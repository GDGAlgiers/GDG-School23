import { compare } from "bcrypt";
import { createMember } from "../services/authService.js";
import jwt from "jsonwebtoken";
import { getMemberByEmail } from "../utils/getMemberByEmail.js";
import { hash } from "bcrypt";
import { checkDepsExistance } from "../utils/checkDepsExistance.js";
import { generatePassword } from "../utils/randomPasswordGenerator.js";
import { sendMail } from "../utils/sendMail.js";
export async function signUpMember(req, res) {
  try {
    const member = req.body;
    const oldMember = await getMemberByEmail(member.email);
    if (oldMember)
      return res.status(400).json({
          status: 400,
          message: "the email address is already in use by another member",
        });
    const checkDeps = await checkDepsExistance(member.departmentNames);
    if (!checkDeps.status) {
      return res.status(404).json({ status: 404, message: checkDeps.message });
    }
    const newPassword = generatePassword(8)
    const cryptedPassword = await hash(newPassword, 12);
    member.password = cryptedPassword;
    const newMember = await createMember(member);
    await sendMail(member.email,"account creation",`your account in project platform was created and here is your password : ${newPassword}`)
    newMember.password = undefined;
    return res.status(201).json({ status: 201, data: newMember});
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "something went wrong while trying to create the memeber"
    });
  }
}

export async function signInMember(req, res) {
  try {
    const { email, password } = req.body;
    const member = await getMemberByEmail(email);
    if (!member)
      return res.status(404).json({
        status: 404,
        message: "there is no member with this email address",
      });

    const isMatched = await compare(password, member.password);
    if (!isMatched)
      return res.status(400).json({ status: 400, message: "wrong password" });
    const accessToken = jwt.sign(
      {
        id: member.memberId,
        email: member.email,
        name: member.memberName,
        role: member.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );
    const refreshToken = jwt.sign(
      {
        id: member.memberId,
        email: member.email,
        name: member.memberName,
        role: member.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "20d" }
    );

    return res
      .status(200)
      .json({ status: 200, data: { accessToken, refreshToken,member } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "something went wrong while trying to sign the member in",
    });
  }
}
