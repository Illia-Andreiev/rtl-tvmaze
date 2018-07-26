import * as express from 'express';
const router = express.Router();
import showStorage from '../services/ShowsStorage';
import {Request, Response} from 'express';


router.get('/', async (req: Request, res: Response) => {
  const cast = await showStorage.getShows();
  res.type('json').send(cast);
});

router.get('/:page', async function(req: Request, res: Response) {
  const pageParam = req.params.page;

  if (Number.isInteger(+pageParam)) {
    const pagedCast = await showStorage.getPage(+pageParam);
    res.type('json').send(pagedCast);
  } else {
    res.status(400).json({error: 'Bad Request: Page number should be a number!'});
  }
});

export default router;

