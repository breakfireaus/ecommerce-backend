const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const categoryDossier = await Category.findAll({
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock'],
        },
      ],
    });
    res.status(200).json(categoryDossier);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const categoryDossier = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock'],
        },
      ],
    });

    if (!categoryDossier) {
      res
        .status(404)
        .json({ message: 'No category found using the selected ID!' });
      return;
    }
    res.status(200).json(categoryDossier);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const categoryDossier = await Category.create(req.body);
    res.status(200).json(categoryDossier);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const categoryDossier = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!categoryDossier[0]) {
      res.status(404).json({ message: 'There is no category with this id!' });
      return;
    }
    res.status(200).json(categoryDossier);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryDossier = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!categoryDossier) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    res.status(200).json(categoryDossier);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
