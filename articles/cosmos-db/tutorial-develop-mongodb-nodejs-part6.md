---
title: "Azure Cosmos DB: Create a MEAN.js app - Part 6 | Microsoft Docs"
description: Learn how to create a MEAN.js app for Azure Cosmos DB using the exact same APIs you use for MongoDB. 
services: cosmos-db
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: cosmos-db
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: nodejs
ms.topic: hero-article
ms.date: 08/11/2017
ms.author: mimig
ms.custom: mvc

---
# Azure Cosmos DB: Create a MEAN.js app - Part 6: Add Post, Put and Delete functions to the app

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

This multi-part tutorial demonstrates how to create a new [MongoDB](mongodb-introduction.md) API app written in Node.js with Express and Angular and connect it to your Azure Cosmos DB database. Azure Cosmos DB supports MongoDB client connections, so you can use Azure Cosmos DB in place of Mongo, but use the exact same code that you use when you talk to Mongo. By using Azure Cosmos DB instead of MongoDB, you benefit from the deployment, scaling, security, and super-fast reads and writes that Azure Cosmos DB provides as a managed service. 

Part 6 of the tutorial covers the following tasks:

> [!div class="checklist"]
> * Add POST, PUT, and DELETE functions for the hero service

> [!VIDEO https://www.youtube.com/embed/Y5mdAlFGZjc]

## Prerequisites

Before starting this part of the tutorial, ensure you've completed the steps in [Part 5](tutorial-develop-mongodb-nodejs-part5.md) of the tutorial.

## Add POST functions to hero service

1. In Visual Studio Code, open routes.js and hero.service.js side by side. using the Split Editor screen by pressing the Split Editor button ![New Azure Cosmos DB account in the Azure portal](./media/tutorial-develop-mongodb-nodejs-part6/split-editor-button.png).

    See that routes.js line 7 is calling the getHeroes function on line 5 in hero.service.js.  We need to create this same pairing for the POST, PUT, and DELETE functions. 

    ![New Azure Cosmos DB account in the Azure portal](./media/tutorial-develop-mongodb-nodejs-part6/routes-heroservicejs.png)
    
    Let's start by coding up the hero service. 

2. Copy the following code into hero.service.js. This code:
    
    * Use the hero model to post a new hero
    * Check the responses to see if there's an error and return a status value of 500

    ```javascript
    function postHero(req, res) {
      const originalHero = { id: req.body.id, name: req.body.name, saying: req.body.saying };
      const hero = new Hero(originalHero);
      hero.save(error => {
        if (checkServerError(res, error)) return;
        res.status(201).json(hero);
        console.log('Hero created successfully!');
      });
    }

    function checkServerError(res, error) {
      if (error) {
        res.status(500).send(error);
        return error;
      }
    }
    ```

3. Update the module.exports in hero.service.js to include the postHero function. 

    ```
    module.exports = {
      getHeroes,
      postHero
    };
    ```

4. In routes.js, add a router for the post function. This router will post one hero at a time. This way the router file shows you all of the ways you can talk to your API - then all the real work is done by the hero.service.js.
    ```
    router.post('/hero', (req, res) => {
      heroService.postHero(req, res);
    });
    ```

5. Check that everything worked by running the app. In Visual Studio Code, save all your changes, click the Debug button ![Debug icon in Visual Studio Code](./media/tutorial-develop-mongodb-nodejs-part6/debug-button.png) on the left side, then click the Start Debugging button ![Debug icon in Visual Studio Code](./media/tutorial-develop-mongodb-nodejs-part6/start-debugging-button.png).

6. Now lets flip over to the browser, open the developer tools tab, navigate to localhost:3000, and refresh the tab.   

    ![Debug icon in Visual Studio Code](./media/tutorial-develop-mongodb-nodejs-part6/add-new-hero.png)

7. Add a new hero with an ID of 999, name of Fred, and saying Hello, and see in the Networking tab that you're getting and posting new heroes. 

    ![Debug icon in Visual Studio Code](./media/tutorial-develop-mongodb-nodejs-part6/post-new-hero.png)

    Now lets go back and add PUT and DELETE functions.

## Add PUT and DELETE functions

1. In routes.js, add the put and delete routers.

    ```javascript
    router.put('/hero/:id', (req, res) => {
      heroService.putHero(req, res);
    });

    router.delete('/hero/:id', (req, res) => {
      heroService.deleteHero(req, res);
    });
    ```

2. Copy the following code into hero.service.js. This code:

    * Creates the put and delete functions
    * Performs a check on whether the hero was found
    * Performs error handling 

    ```javascript
    function putHero(req, res) {
      const originalHero = {
        id: parseInt(req.params.id, 10),
        name: req.body.name,
        saying: req.body.saying
      };
      Hero.findOne({ id: originalHero.id }, (error, hero) => {
        if (checkServerError(res, error)) return;
        if (!checkFound(res, hero)) return;

       hero.name = originalHero.name;
        hero.saying = originalHero.saying;
        hero.save(error => {
          if (checkServerError(res, error)) return;
          res.status(200).json(hero);
          console.log('Hero updated successfully!');
        });
      });
    }

    function deleteHero(req, res) {
      const id = parseInt(req.params.id, 10);
      Hero.findOneAndRemove({ id: id })
        .then(hero => {
          if (!checkFound(res, hero)) return;
          res.status(200).json(hero);
          console.log('Hero deleted successfully!');
        })
        .catch(error => {
          if (checkServerError(res, error)) return;
        });
    }

    function checkFound(res, hero) {
      if (!hero) {
        res.status(404).send('Hero not found.');
        return;
      }
      return hero;
    }
    ```

3. In hero.service.js, export the new modules:

   ```javascript
    module.exports = {
      getHeroes,
      postHero,
      putHero,
      deleteHero
    };
    ```

TODO - Complete


## Next steps

In this video, you've learned the benefits of using Azure Cosmos DB to create MEAN apps and you've learned the steps involved in creating a MEAN.js app for Azure Cosmos DB that are covered in rest of the tutorial series. 

