const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  try {
    const tagDossier = await Tag.findAll({
      include: [{ model: Product, through: ProductTag}]
      })
    res.status(200).json(tagDossier);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  try {
    const tagDossier = await Tag.findByPk(req.params.id, {
    include: [{ model: Product, through: ProductTag}]
    });

    if (!tagDossier) {
      res.status(404).json({ message: 'Tag can not be found with this id' });
      return;
    }

    res.status(200).json(tagDossier);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tagDossier = await Tag.create(req.body);
    res.status(200).json(tagDossier);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagDossier = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!tagDossier[0]) {
      res.status(404).json({ message: 'Tag can not be found with this id' });
      return;
    }
    res.status(200).json(tagDossier);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagDossier = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!tagDossier) {
      res.status(404).json({ message: 'Tag can not be found with this id!' });
      return;
    }

    res.status(200).json(tagDossier);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
