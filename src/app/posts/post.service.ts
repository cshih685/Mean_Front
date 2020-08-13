import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient){}

  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      /* get the postData which includes message&posts. Then transform _id into id */
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        };
      });
    }))
    /* resolve the transformed post data when subscribe */
    .subscribe((transformedPosts) => {
      //save posts from server to this.posts
      this.posts = transformedPosts;
      //update the Subject (Observe) which is a copy of the posts and show on list UI
      this.postsUpdated.next([...this.posts]);
    });
  }

  // tslint:disable-next-line:typedef
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  // tslint:disable-next-line:typedef
  addPost(title: string, content: string){
    const post: Post = { id: null, title: title, content: content};
    this.http
    .post<{ message: string, postId: string }>("http://localhost:3000/api/posts", post)
    .subscribe(responseData => {
      console.log(responseData.message);
      const id = responseData.postId;
      post.id = id;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });

  }

  updatePost(id: string, title: string, content: string){
    const post: Post = { id: id, title: title, content: content };
    this.http
    .put("http://localhost:3000/api/posts/" + id, post)
    .subscribe(response => console.log(response));
  }

  getPost(id: string) {
    return {...this.posts.find(p => p.id === id)};
  }

  deletePost(postId: string) {
    this.http.delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        console.log('Deleted!');
        const updateDeletedPost = this.posts.filter(post => post.id !== postId);
        this.posts = updateDeletedPost;
        this.postsUpdated.next([...this.posts]);
      });
  }

}
