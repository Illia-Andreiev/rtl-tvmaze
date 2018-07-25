import * as express from 'express';
const router = express.Router();
import {default as showStorage, ShowStorage} from '../services/ShowStorage';
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
    res.status(404).json({error: 'Page number should be a number!'});
  }

  // TODO: Error handling for out of range page parameter
});

export default router;

