// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'package:flutter/material.dart';

import 'package:blogz/Blog.dart';

class AddBlog extends StatefulWidget {
  List<Blog> blogs;
  AddBlog({
    Key? key,
    required this.blogs,
  }) : super(key: key);

  @override
  State<AddBlog> createState() => _AddBlogState();
}

class _AddBlogState extends State<AddBlog> {
  late TextEditingController titleController;
  late TextEditingController descriptionController;
  late TextEditingController contentController;
  @override
  void initState() {
    titleController = TextEditingController();
    descriptionController = TextEditingController();
    contentController = TextEditingController();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Add blog"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              decoration: const InputDecoration(
                hintText: "title",
              ),
              controller: titleController,
            ),
            const SizedBox(
              height: 20,
            ),
            TextField(
              decoration: const InputDecoration(
                hintText: "description",
              ),
              controller: descriptionController,
            ),
            const SizedBox(
              height: 20,
            ),
            TextField(
              decoration: const InputDecoration(
                hintText: "content",
              ),
              controller: contentController,
            ),
            const SizedBox(
              height: 20,
            ),
            ElevatedButton(
                onPressed: () {
                  String? title = titleController.text;
                  String? description = descriptionController.text;
                  String? content = contentController.text;

                  Blog newBlog = Blog(
                      title: title, description: description, content: content);
                  widget.blogs.add(newBlog);
                  Navigator.of(context).pop();
                },
                child: const Text("add")),
            const SizedBox(
              height: 20,
            ),
            OutlinedButton(
                onPressed: () {
                  Navigator.of(context).pop();
                },
                child: const Text("cancel"))
          ],
        ),
      ),
    );
  }
}
