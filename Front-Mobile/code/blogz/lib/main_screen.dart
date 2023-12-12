import 'package:blogz/Blog.dart';
import 'package:blogz/add_blog_screen.dart';
import 'package:blogz/home.dart';
import 'package:blogz/my_blogs_screen.dart';
import 'package:flutter/material.dart';

class MainApp extends StatefulWidget {
  const MainApp({super.key});

  @override
  State<MainApp> createState() => _MainAppState();
}

class _MainAppState extends State<MainApp> {
  late int pageIndex;
  late List<Blog> blogs;

  @override
  void initState() {
    pageIndex = 0;
    blogs = [
      Blog(title: "blog1", description: "description 1", content: "content1"),
      Blog(title: "blog2", description: "description 2", content: "content2"),
      Blog(title: "blog3", description: "description 3", content: "content3")
    ];
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: pageIndex == 0 ? const Text("Home") : const Text("My blogs"),
      ),
      body: pageIndex == 0
          ? Home(
              blogs: blogs,
            )
          : const MyBlogsScreen(),
      floatingActionButton: FloatingActionButton(
          onPressed: () {
            Navigator.of(context).push(MaterialPageRoute(
              builder: (context) {
                return AddBlog(
                  blogs: blogs,
                );
              },
            ));
          },
          child: const Icon(Icons.add)),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: pageIndex,
        onTap: (int index) {
          setState(() {
            pageIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: "Home",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.account_circle_rounded),
            label: "My blogs",
          )
        ],
      ),
    );
  }
}
