import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: { userId: string };
}

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user?.userId;

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId: authorId as string,
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: { select: { id: true, name: true } } },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: { author: { select: { id: true, name: true } } },
    });
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error });
  }
});

export default router;