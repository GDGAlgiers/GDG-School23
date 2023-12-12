import 'package:blogz/Blog.dart';
import 'package:flutter/material.dart';

class BlogDetails extends StatelessWidget {
  Blog blog;
  BlogDetails({super.key, required this.blog});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(blog.title)),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Center(
          child: Column(children: [
            Text(blog.description),
            const SizedBox(
              height: 20,
            ),
            Text(blog.content),
          ]),
        ),
      ),
    );
  }
}
