var express = require('express');
var { PrismaClient } = require('@prisma/client');
var path = require('path');

var app = express();
var prisma = new PrismaClient();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
console.log("Serving static files from:", path.join(__dirname, 'public'));


app.post('/api/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  prisma.userPass.findUnique({ where: { user: username } }).then(function(existingUser) {
    if (existingUser) {
      return res.status(409).json({ error: 'Username is already taken.' });
    }

    prisma.userPass.create({
      data: { user: username, pass: password },
    }).then(function(newUser) {
      res.status(201).json({ username: newUser.user });
    }).catch(function(error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'An error occurred during signup.' });
    });
  });
});

app.post('/api/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  prisma.userPass.findUnique({ where: { user: username } }).then(function(user) {
    if (user && user.pass === password) {
      res.status(200).json({ message: 'Login successful', username: user.user });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  }).catch(function(error) {
    res.status(500).json({ error: 'An error occurred during login.' });
  });
});

app.get('/api/ingredients', function(req, res) {
  var username = req.query.username;
  if (!username) {
    return res.status(400).json({ error: 'Username is required to fetch ingredients.' });
  }
  
  // FIX: Changed prisma.ingredient to prisma.ingredients
  prisma.ingredients.findMany({
    where: { creatorUsername: username },
    orderBy: { name: 'asc' }
  }).then(function(ingredients) {
    res.json(ingredients);
  }).catch(function(error) {
    res.status(500).json({ error: 'Could not fetch ingredients.' });
  });
});

app.post('/api/ingredients', function(req, res) {
    var name = req.body.name;
    var username = req.body.username;

    if (!name || !username) {
        return res.status(400).json({ error: 'Ingredient name and username are required.' });
    }
    
    // FIX: Changed prisma.ingredient to prisma.ingredients
    prisma.ingredients.create({
        data: { 
            name: name,
            creatorUsername: username
        }
    }).then(function(newIngredient) {
        res.status(201).json(newIngredient);
    }).catch(function(error) {
         if (error.code === 'P2002') { 
            return res.status(409).json({ error: 'You have already created an ingredient with this name.' });
        }
        res.status(500).json({ error: 'Could not create ingredient.' });
    });
});

app.get('/api/recipes', function(req, res) {
  var search = req.query.search;
  var sortBy = req.query.sortBy;
  var ingredients = req.query.ingredients;
  var username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: 'Username is required to fetch recipes.' });
  }

  var where = {
    // FIX: Changed 'users' to 'UserRecipe' to match the relation name in the schema
    UserRecipe: {
      some: {
        userId: username,
      },
    },
  };

  if (search) {
    where.name = { contains: search };
  }

  if (ingredients) {
    var ingredientIds = ingredients.split(',').map(function(id) {
        return parseInt(id, 10);
    });
    if (ingredientIds.length > 0) {
      // FIX: Changed 'ingredients' to 'RecipeIngredient'
      where.RecipeIngredient = {
        some: {
          ingredientId: { in: ingredientIds },
        },
      };
    }
  }

  var orderBy;
  if (sortBy === 'prepTime') {
    orderBy = { prepTime: 'asc' };
  } else {
    orderBy = { name: 'asc' };
  }

  prisma.recipes.findMany({
    where: where,
    orderBy: orderBy,
    include: {
      // FIX: Changed 'ingredients' to 'RecipeIngredient'
      RecipeIngredient: {
        include: {
          ingredient: true,
        },
      },
    },
  }).then(function(recipes) {
    res.json(recipes);
  }).catch(function(error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Could not fetch recipes.' });
  });
});

app.post('/api/recipes', function(req, res) {
  var name = req.body.name;
  var details = req.body.details;
  var prepTime = req.body.prepTime;
  var username = req.body.username;
  var ingredients = req.body.ingredients;

  if (!name || !details || !prepTime || !username || !ingredients) {
      return res.status(400).json({ error: 'Missing required recipe data.' });
  }

  prisma.recipes.create({
    data: {
      name: name,
      details: details,
      prepTime: prepTime,
      // FIX: Changed 'users' to 'UserRecipe'
      UserRecipe: {
        create: {
          userId: username,
        },
      },
      // FIX: Changed 'ingredients' to 'RecipeIngredient'
      RecipeIngredient: {
        create: ingredients.map(function(ing) {
            return {
                quantity: ing.quantity,
                ingredientId: ing.ingredientId,
            }
        }),
      },
    },
    include: {
      // FIX: Changed 'users' and 'ingredients'
      UserRecipe: true,
      RecipeIngredient: true
    }
  }).then(function(newRecipe) {
    res.status(201).json(newRecipe);
  }).catch(function(error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ error: 'Could not create recipe.' });
  });
});

var PORT = 3000;
app.listen(PORT, function() {
  console.log('Server is running and listening on http://localhost:' + PORT);
});

