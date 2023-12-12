// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'package:flutter/material.dart';

import 'package:blogz/Blog.dart';
import 'package:blogz/blog_widget.dart';

class Home extends StatefulWidget {
  List<Blog> blogs;
  Home({
    Key? key,
    required this.blogs,
  }) : super(key: key);

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
        itemBuilder: (context, index) {
          return BlogTile(blog: widget.blogs[index]);
        },
        separatorBuilder: (context, index) => const Divider(),
        itemCount: widget.blogs.length);
  }
}
