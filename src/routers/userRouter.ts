import { Router } from 'express';
import UserController from '../controllers/UserController';
import Github from '../external/Github';
import Gitlab from '../external/Gitlab';
import MongoUserRepository from '../repositories/MongoUserRepository';
import PrismaUserRepository from '../repositories/PrismaUserRepository';
import ProfileService from '../services/ProfileService';

const router = Router();

// const userController = new UserController(new ProfileService(new PrismaUserRepository(), new Github()));
// const userController = new UserController(new ProfileService(new PrismaUserRepository(), new Gitlab()));
// const userController = new UserController(new ProfileService(new MongoUserRepository(), new Github()));
const userController = new UserController(new ProfileService(new MongoUserRepository(), new Gitlab()));

router.post('/profiles', userController.addProfile.bind(userController));

router.get('/profiles', userController.getProfiles.bind(userController));

router.get('/profiles/:username', userController.getProfile.bind(userController));

export default router;