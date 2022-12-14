const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const productdossier = await Product.findAll({
      include: [
        { model: Category, attributes: ['id', 'category_name'] },
        { model: Tag, through: ProductTag },
      ],
    });
    res.status(200).json(productdossier);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const productdossier = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ['id', 'category_name'] },
        { model: Tag, through: ProductTag },
      ],
    });

    if (!productdossier) {
      res
        .status(404)
        .json({ message: 'A product was not found with this id!' });
      return;
    }
    console.log(req.body);
    res.status(200).json(productdossier);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      console.log(req.body);
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tag_ids.length) {
        const productTagIdArr = req.body.tag_ids.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((updatedProductTags) => res.status(200).json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productdossier = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!productdossier) {
      res.status(404).json({ message: 'Product was not found with that id!' });
      return;
    }

    res.status(200).json(productdossier);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
