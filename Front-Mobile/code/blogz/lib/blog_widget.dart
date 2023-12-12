import 'package:blogz/Blog.dart';
import 'package:blogz/blog_detail.dart';
import 'package:flutter/material.dart';

class BlogTile extends StatelessWidget {
  Blog blog;
  BlogTile({super.key, required this.blog});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 1,
      child: ListTile(
        onTap: () {
          Navigator.of(context).push(MaterialPageRoute(builder: (context) {
            return BlogDetails(blog: blog);
          }));
        },
        title: Text(blog.title),
        subtitle: Text(blog.description),
        trailing: const Icon(Icons.arrow_forward_ios_rounded),
      ),
    );
  }
}
