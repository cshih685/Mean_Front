import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router){}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
    .get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
    .pipe(map((postData) => {
      /* get the postData which includes message&posts. Then transform _id into id */
      return {
        posts: postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        };
      }),
        maxPosts: postData.maxPosts
      };
    }))
    /* resolve the transformed post data when subscribe */
    .subscribe((transformedPostData) => {
      //save posts from server to this.posts
      this.posts = transformedPostData.posts;
      //update the Subject (Observe) which is a copy of the posts and show on list UI
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostData.maxPosts
      });
    });
  }

  // tslint:disable-next-line:typedef
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  // tslint:disable-next-line:typedef
  addPost(title: string, content: string, image: File){
    // const post: Post = { id: null, title: title, content: content};
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
    .post<{ message: string, post: Post }>
    ("http://localhost:3000/api/posts", postData)
    .subscribe(responseData => {
/*       // console.log(responseData.message);
      const post: Post = {
        id: responseData.post.id,
        title: title,
        content: content,
        imagePath: responseData.post.imagePath
      };
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]); */
      this.router.navigate(['/']);
    });

  }

  updatePost(id: string, title: string, content: string, image: File | string){
    // const post: Post = { id: id, title: title, content: content, imagePath: null };
    let postData: Post | FormData;
    if (typeof(image) === 'object'){
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    }else {
        postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    this.http
    .put("http://localhost:3000/api/posts/" + id, postData)
    .subscribe(response => {
/*       const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
      const post: Post = {
        id: id,
        title: title,
        content: content,
        imagePath: 'response.imagePath'
      };
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]); */
      this.router.navigate(['/']);
    });
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string }>(
      "http://localhost:3000/api/posts/" + id
      );
  }

  deletePost(postId: string) {
    return this.http
      .delete("http://localhost:3000/api/posts/" + postId);
  }

}
