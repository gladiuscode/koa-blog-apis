import database from "../../database/init.database.js";
import {v4} from "uuid";
import {Post, User, Comment} from "../../database/types.database.js";

interface CreateUserPayload {
  email: string;
  password: string;
}

interface CreatePostPayload {
  title: string;
  description: string;
  author: string;
  date?: string;
}

interface CreateCommentPayload {
  text: string;
  postId: string;
  author: string;
  date?: string;
}

interface UpdatePostPayload {
  id: string;
  title?: string;
  description?: string;
}

export interface IDatabaseDatasource {
  getUserBy(email: string): Promise<User | undefined>;
  createUser(payload: CreateUserPayload): Promise<User | undefined>;
  deleteUserBy(email: string): Promise<User | undefined>;
  getPosts(): Promise<Post[]>;
  getPostBy(id: string): Promise<Post | undefined>;
  getUserPosts(author: string): Promise<Post[]>;
  deleteUserPosts(author: string): Promise<Post[]>;
  createPost(payload: CreatePostPayload): Promise<Post>;
  deletePostBy(id: string): Promise<Post | undefined>;
  updatePostBy(payload: UpdatePostPayload): Promise<Post | undefined>;
  getComments(): Promise<Comment[]>;
  getCommentBy(id: string): Promise<Comment | undefined>;
  getUserComments(author: string): Promise<Comment[]>;
  createComment(payload: CreateCommentPayload): Promise<Comment>;
  deleteCommentBy(id: string): Promise<Comment | undefined>;
  deleteUserComments(author: string): Promise<Comment[]>;
  getPostComments(postId: string): Promise<Comment[]>;
}

class DatabaseDatasource implements IDatabaseDatasource {

  constructor() {
  }

  getUserBy(email: string) {
    return Promise.resolve(database.data.users.find(user => user.email === email));
  }

  async createUser({ email, password }: CreateUserPayload) {
    const newUser: User = {
      id: v4(),
      email,
      password,
    }

    database.data.users.push(newUser);
    await database.write();

    return newUser;
  }

  async deleteUserBy(email: string) {
    const userIndex = database.data.users.findIndex(user => user.email === email);
    if (userIndex == -1) {
      return;
    }

    const user = database.data.users[userIndex];

    database.data.users = database.data.users.filter(user => user.email !== email);
    await database.write();

    return user;
  }

  getPosts() {
    return Promise.resolve(database.data.posts);
  }

  getPostBy(id: string) {
    return Promise.resolve(database.data.posts.find(post => post.id === id));
  }

  getUserPosts(author: string) {
    return Promise.resolve(database.data.posts.filter(post => post.author === author));
  }

  async deleteUserPosts(author: string) {
    const userPosts = database.data.posts.filter(post => post.author === author);
    if (!userPosts.length) {
      return userPosts;
    }

    database.data.posts = database.data.posts.filter(post => !userPosts.find(userPost => userPost.id !== post.id));

    await database.write();

    return userPosts;
  }

  async createPost({ title, description, author, date }: CreatePostPayload) {
    const newPost: Post = {
      id: v4(),
      title,
      description,
      author,
      date: date ?? new Date().toISOString(),
    };

    database.data.posts.push(newPost)

    await database.write();

    return newPost;
  }

  async deletePostBy(id: string) {
    const postIndex = database.data.posts.findIndex(post => post.id === id);
    if (postIndex == -1) {
      return;
    }

    const post = database.data.posts[postIndex];

    database.data.posts = database.data.posts.filter(post => post.id !== id);
    await database.write();

    return post;
  }

  async updatePostBy({ id, title, description }: UpdatePostPayload) {
    const postIndex = database.data.posts.findIndex(post => post.id === id);
    if (postIndex == -1) {
      return;
    }

    const oldPost = database.data.posts[postIndex];

    const updatedPost: Post = {
      ...oldPost,
      title: title ?? oldPost.title,
      description: description ?? oldPost.description,
    }

    database.data.posts = [
      ...database.data.posts.slice(0, postIndex),
      updatedPost,
      ...database.data.posts.slice(postIndex + 1),
    ]

    await database.write();

    return updatedPost;
  }

  getComments() {
    return Promise.resolve(database.data.comments);
  }

  getCommentBy(id: string) {
    return Promise.resolve(database.data.comments.find(comment => comment.id === id));
  }

  async createComment({ text, postId, author, date }: CreateCommentPayload) {
    const newComment: Comment = {
      id: v4(),
      postId,
      text,
      author,
      date: date ?? new Date().toISOString(),
    };

    database.data.comments.push(newComment);

    await database.write();

    return newComment;
  }

  async deleteCommentBy(id: string) {
    const commentIndex = database.data.comments.findIndex(comment => comment.id === id);
    if (commentIndex == -1) {
      return;
    }

    const comment = database.data.comments[commentIndex];

    database.data.comments = database.data.comments.filter(comment => comment.id !== id);
    await database.write();

    return comment;
  }

  async deleteUserComments(author: string) {
    const userComments = database.data.comments.filter(comment => comment.author === author);
    if (!userComments.length) {
      return [];
    }

    database.data.comments = database.data.comments.filter(comment => !userComments.find(userComment => userComment.id === comment.author));
    await database.write();

    return userComments;
  }

  getUserComments(author: string) {
    return Promise.resolve(database.data.comments.filter(comment => comment.author === author));
  }

  getPostComments(postId: string) {
    return Promise.resolve(database.data.comments.filter(comment => comment.postId === postId));
  }
}

export default DatabaseDatasource;
