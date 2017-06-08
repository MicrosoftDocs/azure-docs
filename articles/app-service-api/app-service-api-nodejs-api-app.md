---
title: Node.js API app in Azure App Service | Microsoft Docs
description: Learn how to create a Node.js RESTful API and deploy it to an API app in Azure App Service.
services: app-service\api
documentationcenter: node
author: bradygaster
manager: erikre
editor: ''

ms.assetid: a820e400-06af-4852-8627-12b3db4a8e70
ms.service: app-service-api
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: nodejs
ms.topic: get-started-article
ms.date: 05/26/2016
ms.author: rachelap

---
# Build a Node.js RESTful API and deploy it to an API app in Azure
[!INCLUDE [app-service-api-get-started-selector](../../includes/app-service-api-get-started-selector.md)]

This quickstart shows how to create a simple [Express](http://expressjs.com/) framework Node.js REST API using from a [Swagger](http://swagger.io/) definintion and deploy it as an [API app](app-service-api-apps-why-best-platform.md)  on Azure. You'll create the app using command line tools, configure resources with the [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli),  and deploy the app using Git.  When you've finished, you'll have a working sample REST API running on Azure.

## Prerequisites

To complete this quickstart:

* [Install Git](https://git-scm.com/)
* [Install Node.js and NPM](https://nodejs.org/)
* [Install Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prepare your environment

1. In a terminal window , run the following command to clone the sample to your local machine.

    ```bash
    git clone https://github.com/Azure-Samples/app-service-api-node-contact-list
    ```

2. Change to the directory that contains the sample code.

    ```bash
    cd app-serfvice-api-node-contact-list
    ```

3. Install [Swaggerize](https://www.npmjs.com/package/swaggerize-express) on your local machine.

    Swaggerize is a tool that generates Node.js code for your REST API from a Swagger definition.

    ```bash
    npm install -g yo
    npm install -g generator-swaggerize
    ```

## Generate Node.js code 

This section of the tutorial models an API development workflow in which you create Swagger metadata first and use that to scaffold (auto-generate) server code for the API. 

1. Change directory to the *start* folder, then run `yo swaggerize`. 

    ```bash
    cd start
    yo swaggerize --apiPath api.json --framework express
    ```

    Swaggerize will ask a series of questions.  For **What to call this project**, enter "ContactList". 
   
   ```bash
   Swaggerize Generator
   Tell us a bit about your application
   ? What would you like to call this project: ContactList
   ? Your name: Francis Totten
   ? Your github user name: fabfrank
   ? Your email: frank@fabrikam.net
   ```
   
2. Install the **jsonpath** and **swaggerize-ui** NPM modules. 

    ```bash
    npm install --save jsonpath swaggerize-ui
    ```

### Customize the generated code

1. Copy the *lib* folder into the *ContactList* folder created by `yo swaggerize`, then change directory into *ContactList*.

    ```bash
    cp -r lib/ ContactList/
    cd ContactList
    ```

2. Replace the code in the *handlers/contacts.js* with the following code. 
    ```javascript
    'use strict';

    var repository = require('../lib/contactRepository');

    module.exports = {
        get: function contacts_get(req, res) {
            res.json(repository.all())
        }
    };
    ```
    This code uses the JSON data stored in the *lib/contacts.json* file that is served by *lib/contactRepository.js*. The new *contacts.js* code responds to HTTP requests to get all of the contacts and return them as a JSON payload. 

3. Replace the code in the **handlers/contacts/{id}.js** file with the following code. 

    ```javascript
    'use strict';

    var repository = require('../../lib/contactRepository');

    module.exports = {
        get: function contacts_get(req, res) {
            res.json(repository.get(req.params['id']));
        }    
    };
    ```

4. Replace the code in **server.js** with the following code. 

    ```javascript
    'use strict';

    var port = process.env.PORT || 8000; // first change

    var http = require('http');
    var express = require('express');
    var bodyParser = require('body-parser');
    var swaggerize = require('swaggerize-express');
    var swaggerUi = require('swaggerize-ui'); // second change
    var path = require('path');

    var app = express();

    var server = http.createServer(app);

    app.use(bodyParser.json());

    app.use(swaggerize({
        api: path.resolve('./config/swagger.json'), // third change
        handlers: path.resolve('./handlers'),
        docspath: '/swagger' // fourth change
    }));

    // change four
    app.use('/docs', swaggerUi({
        docs: '/swagger'  
    }));

    server.listen(port, function () { // fifth and final change
    });
    ```   

### Test the API locally

1. Start up the Node.js app
    ```bash
    node server.js
    ```
    
2. Browse to http://localhost:8000/contacts to view the  JSON output of the contact list.
   
   ```json
    {
        "id": 1,
        "name": "Barney Poland",
        "email": "barney@contoso.com"
    },
    {
        "id": 2,
        "name": "Lacy Barrera",
        "email": "lacy@contoso.com"
    },
    {
        "id": 3,
        "name": "Lora Riggs",
        "email": "lora@contoso.com"
    }
   ```

3. Browse to http://localhost:8000/contacts/2 to view the contact represented by that id value of 2.
   
    ```json
    { 
        "id": 2,
        "name": "Lacy Barrera",
        "email": "lacy@contoso.com"
    }
    ```

4. Browse to the Swagger UI http://localhost:8000/docs. The Swagger UI lets you test the API using your web browser.
   
    ![Swagger Ui](media/app-service-api-nodejs-api-app/swagger-ui.png)

## <a id="createapiapp"></a> Create a new API App

In this section you use the Azure CLI 2.0 to create the resources to host the API on Azure App Service. 

1.  Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions.

    ```azurecli-interactive
    az login
    ```

2. [!INCLUDE [Create resource group](../../includes/app-service-api-create-resource-group.md)] 

3. [!INCLUDE [Create app service plan](../../includes/app-service-api-create-app-service-plan.md)]

4. [!INCLUDE [Create API app](../../includes/app-service-api-create-api-app.md)] 


## Deploy the API with Git

Deploy your code to the API app by pushing commits from your local Git repository to Azure App Service.

1. [!INCLUDE [Configure your deployment credentials](../../includes/app-service-api-configure-local-git.md)] 

2 . Initialize a new repo in the *ContactList* directory. 

    ```bash
    git init .
    ```

3. (Optional) Update the .gitignore to exclude the *node_modules* directory created by npm in an earlier step in the tutorial. Open up the *.gitignore* file in the root of your local repo and add the following text on a new line anywhere in the file.

    ```gitignore
    node_modules/
    ```
    Confirm the `node_modules` folder is being ignored with  `git status`.

4. Commit the changes to the repo.
    ```bash
    git add .
    git commit -m "initial version"
    ```

5. [!INCLUDE [Push to Azure](../../includes/app-service-api-git-push-to-azure.md)]  
 
## Test the API  in Azure

1. Open a browser to http://app_name.azurewebsites.net/contacts. You'll see the same JSON returned as when you made the request locally:
    ```json
    {
        "id": 1,
        "name": "Barney Poland",
        "email": "barney@contoso.com"
    },
    {
        "id": 2,
        "name": "Lacy Barrera",
        "email": "lacy@contoso.com"
    },
    {
        "id": 3,
        "name": "Lora Riggs",
        "email": "lora@contoso.com"
    }
    ```
3. In a browser, go to the `http://app_name.azurewebsites.net/docs` endpoint to try out the Swagger UI running on Azure.

You can now deploy updates to the sample API to Azure simply by pushing commits to the Azure Git repository.

## Clean up

To clean up the resources created in this quickstart, run the following Azure CLI command:

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next step 
> [!div class="nextstepaction"]
> [Consume API apps from JavaScript clients with CORS](app-service-api-cors-consume-javascript.md)

