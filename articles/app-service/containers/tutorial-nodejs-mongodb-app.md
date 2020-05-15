---
title: 'Tutorial: Linux Node.js app with MongoDB' 
description: Learn how to get a Linux Node.js app working in Azure App Service, with connection to a MongoDB database in Azure (Cosmos DB). MEAN.js is used in the tutorial.
ms.assetid: 0b4d7d0e-e984-49a1-a57a-3c0caa955f0e
ms.devlang: nodejs
ms.topic: tutorial
ms.date: 03/27/2019
ms.custom: mvc, cli-validate, seodec18
---
# Build a Node.js and MongoDB app in Azure App Service on Linux

> [!NOTE]
> This article deploys an app to App Service on Linux. To deploy to App Service on _Windows_, see [Build a Node.js and MongoDB app in Azure](../app-service-web-tutorial-nodejs-mongodb-app.md).
>

[App Service on Linux](app-service-linux-intro.md) provides a highly scalable, self-patching web hosting service using the Linux operating system. This tutorial shows how to create a Node.js app, connect it locally to a MongoDB database, then deploy it to a database in Azure Cosmos DB's API for MongoDB. When you're done, you'll have a MEAN application (MongoDB, Express, AngularJS, and Node.js) running in App Service on Linux. For simplicity, the sample application uses the [MEAN.js web framework](https://meanjs.org/).

![MEAN.js app running in Azure App Service](./media/tutorial-nodejs-mongodb-app/meanjs-in-azure.png)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a database using Azure Cosmos DB's API for MongoDB
> * Connect a Node.js app to MongoDB
> * Deploy the app to Azure
> * Update the data model and redeploy the app
> * Stream diagnostic logs from Azure
> * Manage the app in the Azure portal

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this tutorial:

1. [Install Git](https://git-scm.com/)
2. [Install Node.js v6.0 or above and NPM](https://nodejs.org/)
3. [Install Gulp.js](https://gulpjs.com/) (required by [MEAN.js](https://meanjs.org/docs/0.5.x/#getting-started))
4. [Install and run MongoDB Community Edition](https://docs.mongodb.com/manual/administration/install-community/)

## Test local MongoDB

Open the terminal window and `cd` to the `bin` directory of your MongoDB installation. You can use this terminal window to run all the commands in this tutorial.

Run `mongo` in the terminal to connect to your local MongoDB server.

```bash
mongo
```

If your connection is successful, then your MongoDB database is already running. If not, make sure that your local MongoDB database is started by following the steps at [Install MongoDB Community Edition](https://docs.mongodb.com/manual/administration/install-community/). Often, MongoDB is installed, but you still need to start it by running `mongod`.

When you're done testing your MongoDB database, type `Ctrl+C` in the terminal.

## Create local Node.js app

In this step, you set up the local Node.js project.

### Clone the sample application

In the terminal window, `cd` to a working directory.

Run the following command to clone the sample repository.

```bash
git clone https://github.com/Azure-Samples/meanjs.git
```

This sample repository contains a copy of the [MEAN.js repository](https://github.com/meanjs/mean). It is modified to run on App Service (for more information, see the MEAN.js repository [README file](https://github.com/Azure-Samples/meanjs/blob/master/README.md)).

### Run the application

Run the following commands to install the required packages and start the application.

```bash
cd meanjs
npm install
npm start
```

Ignore the config.domain warning. When the app is fully loaded, you see something similar to the following message:

```txt
--
MEAN.JS - Development Environment

Environment:     development
Server:          http://0.0.0.0:3000
Database:        mongodb://localhost/mean-dev
App version:     0.5.0
MEAN.JS version: 0.5.0
--
```

Navigate to `http://localhost:3000` in a browser. Click **Sign Up** in the top menu and create a test user. 

The MEAN.js sample application stores user data in the database. If you are successful at creating a user and signing in, then your app is writing data to the local MongoDB database.

![MEAN.js connects successfully to MongoDB](./media/tutorial-nodejs-mongodb-app/mongodb-connect-success.png)

Select **Admin > Manage Articles** to add some articles.

To stop Node.js at any time, press `Ctrl+C` in the terminal.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Create production MongoDB

In this step, you create a database account using Azure Cosmos DB's API for MongoDB. When your app is deployed to Azure, it uses this cloud database.

### Create a resource group

[!INCLUDE [Create resource group](../../../includes/app-service-web-create-resource-group-linux-no-h.md)]

### Create a Cosmos DB account

In the Cloud Shell, create a Cosmos DB account with the [`az cosmosdb create`](/cli/azure/cosmosdb?view=azure-cli-latest#az-cosmosdb-create) command.

In the following command, substitute a unique Cosmos DB name for the *\<cosmosdb-name>* placeholder. This name is used as the part of the Cosmos DB endpoint, `https://<cosmosdb-name>.documents.azure.com/`, so the name needs to be unique across all Cosmos DB accounts in Azure. The name must contain only lowercase letters, numbers, and the hyphen (-) character, and must be between 3 and 50 characters long.

```azurecli-interactive
az cosmosdb create --name <cosmosdb-name> --resource-group myResourceGroup --kind MongoDB
```

The *--kind MongoDB* parameter enables MongoDB client connections.

When the Cosmos DB account is created, the Azure CLI shows information similar to the following example:

<pre>
{
  "consistencyPolicy":
  {
    "defaultConsistencyLevel": "Session",
    "maxIntervalInSeconds": 5,
    "maxStalenessPrefix": 100
  },
  "databaseAccountOfferType": "Standard",
  "documentEndpoint": "https://&lt;cosmosdb-name&gt;.documents.azure.com:443/",
  "failoverPolicies":
  ...
  &lt; Output truncated for readability &gt;
}
</pre>

## Connect app to production configured with Azure Cosmos DB's API for MongoDB

In this step, you connect your MEAN.js sample application to the Cosmos DB database you just created, using a MongoDB connection string.

### Retrieve the database key

To connect to the Cosmos DB database, you need the database key. In the Cloud Shell, use the [`az cosmosdb list-keys`](/cli/azure/cosmosdb?view=azure-cli-latest#az-cosmosdb-list-keys) command to retrieve the primary key.

```azurecli-interactive
az cosmosdb list-keys --name <cosmosdb-name> --resource-group myResourceGroup
```

The Azure CLI shows information similar to the following example:

<pre>
{
  "primaryMasterKey": "RS4CmUwzGRASJPMoc0kiEvdnKmxyRILC9BWisAYh3Hq4zBYKr0XQiSE4pqx3UchBeO4QRCzUt1i7w0rOkitoJw==",
  "primaryReadonlyMasterKey": "HvitsjIYz8TwRmIuPEUAALRwqgKOzJUjW22wPL2U8zoMVhGvregBkBk9LdMTxqBgDETSq7obbwZtdeFY7hElTg==",
  "secondaryMasterKey": "Lu9aeZTiXU4PjuuyGBbvS1N9IRG3oegIrIh95U6VOstf9bJiiIpw3IfwSUgQWSEYM3VeEyrhHJ4rn3Ci0vuFqA==",
  "secondaryReadonlyMasterKey": "LpsCicpVZqHRy7qbMgrzbRKjbYCwCKPQRl0QpgReAOxMcggTvxJFA94fTi0oQ7xtxpftTJcXkjTirQ0pT7QFrQ=="
}
</pre>

Copy the value of `primaryMasterKey`. You need this information in the next step.

<a name="devconfig"></a>

### Configure the connection string in your Node.js application

In your local MEAN.js repository, in the _config/env/_ folder, create a file named _local-production.js_. _.gitignore_ is configured to keep this file out of the repository.

Copy the following code into it. Be sure to replace the two *\<cosmosdb-name>* placeholders with your Cosmos DB database name, and replace the *\<primary-master-key>* placeholder with the key you copied in the previous step.

```javascript
module.exports = {
  db: {
    uri: 'mongodb://<cosmosdb-name>:<primary-master-key>@<cosmosdb-name>.documents.azure.com:10250/mean?ssl=true&sslverifycertificate=false'
  }
};
```

The `ssl=true` option is required because [Cosmos DB requires SSL](../../cosmos-db/connect-mongodb-account.md#connection-string-requirements).

Save your changes.

### Test the application in production mode

In a local terminal window, run the following command to minify and bundle scripts for the production environment. This process generates the files needed by the production environment.

```bash
gulp prod
```

In a local terminal window, run the following command to use the connection string you configured in _config/env/local-production.js_. Ignore the certificate error and the config.domain warning.

```bash
NODE_ENV=production node server.js
```

`NODE_ENV=production` sets the environment variable that tells Node.js to run in the production environment.  `node server.js` starts the Node.js server with `server.js` in your repository root. This is how your Node.js application is loaded in Azure.

When the app is loaded, check to make sure that it's running in the production environment:

```
--
MEAN.JS

Environment:     production
Server:          http://0.0.0.0:8443
Database:        mongodb://<cosmosdb-name>:<primary-master-key>@<cosmosdb-name>.documents.azure.com:10250/mean?ssl=true&sslverifycertificate=false
App version:     0.5.0
MEAN.JS version: 0.5.0
```

Navigate to `http://localhost:8443` in a browser. Click **Sign Up** in the top menu and create a test user. If you are successful creating a user and signing in, then your app is writing data to the Cosmos DB database in Azure.

In the terminal, stop Node.js by typing `Ctrl+C`.

## Deploy app to Azure

In this step, you deploy your Node.js application to Azure App Service.

### Configure local git deployment

[!INCLUDE [Configure a deployment user](../../../includes/configure-deployment-user-no-h.md)]

### Create an App Service plan

[!INCLUDE [Create app service plan](../../../includes/app-service-web-create-app-service-plan-linux-no-h.md)]

<a name="create"></a>

### Create a web app

[!INCLUDE [Create web app](../../../includes/app-service-web-create-web-app-nodejs-linux-no-h.md)] 

### Configure an environment variable

By default, the MEAN.js project keeps _config/env/local-production.js_ out of the Git repository. So for your Azure app, you use app settings to define your MongoDB connection string.

To set app settings, use the [`az webapp config appsettings set`](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az-webapp-config-appsettings-set) command in the Cloud Shell.

The following example configures a `MONGODB_URI` app setting in your Azure app. Replace the *\<app-name>*, *\<cosmosdb-name>*, and *\<primary-master-key>* placeholders.

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group myResourceGroup --settings MONGODB_URI="mongodb://<cosmosdb-name>:<primary-master-key>@<cosmosdb-name>.documents.azure.com:10250/mean?ssl=true"
```

In Node.js code, you [access this app setting](configure-language-nodejs.md#access-environment-variables) with `process.env.MONGODB_URI`, just like you would access any environment variable.

In your local MEAN.js repository, open _config/env/production.js_ (not _config/env/local-production.js_), which has production-environment specific configuration. The default MEAN.js app is already configured to use the `MONGODB_URI` environment variable that you created.

```javascript
db: {
  uri: ... || process.env.MONGODB_URI || ...,
  ...
},
```

### Push to Azure from Git

[!INCLUDE [app-service-plan-no-h](../../../includes/app-service-web-git-push-to-azure-no-h.md)]

<pre>
Counting objects: 5, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (5/5), done.
Writing objects: 100% (5/5), 489 bytes | 0 bytes/s, done.
Total 5 (delta 3), reused 0 (delta 0)
remote: Updating branch 'master'.
remote: Updating submodules.
remote: Preparing deployment for commit id '6c7c716eee'.
remote: Running custom deployment command...
remote: Running deployment command...
remote: Handling node.js deployment.
.
.
.
remote: Deployment successful.
To https://&lt;app-name&gt;.scm.azurewebsites.net/&lt;app-name&gt;.git
 * [new branch]      master -> master
</pre>

You may notice that the deployment process runs [Gulp](https://gulpjs.com/) after `npm install`. App Service does not run Gulp or Grunt tasks during deployment, so this sample repository has two additional files in its root directory to enable it:

- _.deployment_ - This file tells App Service to run `bash deploy.sh` as the custom deployment script.
- _deploy.sh_ - The custom deployment script. If you review the file, you will see that it runs `gulp prod` after `npm install` and `bower install`.

You can use this approach to add any step to your Git-based deployment. If you restart your Azure app at any point, App Service doesn't rerun these automation tasks. For more information, see [Run Grunt/Bower/Gulp](configure-language-nodejs.md#run-gruntbowergulp).

### Browse to the Azure app

Browse to the deployed app using your web browser.

```bash
http://<app-name>.azurewebsites.net
```

Click **Sign Up** in the top menu and create a dummy user.

If you are successful and the app automatically signs in to the created user, then your MEAN.js app in Azure has connectivity to the Azure Cosmos DB's API for MongoDB.

![MEAN.js app running in Azure App Service](./media/tutorial-nodejs-mongodb-app/meanjs-in-azure.png)

Select **Admin > Manage Articles** to add some articles.

**Congratulations!** You're running a data-driven Node.js app in Azure App Service on Linux.

## Update data model and redeploy

In this step, you change the `article` data model and publish your change to Azure.

### Update the data model

In your local MEAN.js repository, open _modules/articles/server/models/article.server.model.js_.

In `ArticleSchema`, add a `String` type called `comment`. When you're done, your schema code should look like this:

```javascript
let ArticleSchema = new Schema({
  ...,
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  comment: {
    type: String,
    default: '',
    trim: true
  }
});
```

### Update the articles code

Update the rest of your `articles` code to use `comment`.

There are five files you need to modify: the server controller and the four client views. 

Open _modules/articles/server/controllers/articles.server.controller.js_.

In the `update` function, add an assignment for `article.comment`. The following code shows the completed `update` function:

```javascript
exports.update = function (req, res) {
  let article = req.article;

  article.title = req.body.title;
  article.content = req.body.content;
  article.comment = req.body.comment;

  ...
};
```

Open _modules/articles/client/views/view-article.client.view.html_.

Just above the closing `</section>` tag, add the following line to display `comment` along with the rest of the article data:

```HTML
<p class="lead" ng-bind="vm.article.comment"></p>
```

Open _modules/articles/client/views/list-articles.client.view.html_.

Just above the closing `</a>` tag, add the following line to display `comment` along with the rest of the article data:

```HTML
<p class="list-group-item-text" ng-bind="article.comment"></p>
```

Open _modules/articles/client/views/admin/list-articles.client.view.html_.

Inside the `<div class="list-group">` element and just above the closing `</a>` tag, add the following line to display `comment` along with the rest of the article data:

```HTML
<p class="list-group-item-text" data-ng-bind="article.comment"></p>
```

Open _modules/articles/client/views/admin/form-article.client.view.html_.

Find the `<div class="form-group">` element that contains the submit button, which looks like this:

```HTML
<div class="form-group">
  <button type="submit" class="btn btn-default">{{vm.article._id ? 'Update' : 'Create'}}</button>
</div>
```

Just above this tag, add another `<div class="form-group">` element that lets people edit the `comment` field. Your new element should look like this:

```HTML
<div class="form-group">
  <label class="control-label" for="comment">Comment</label>
  <textarea name="comment" data-ng-model="vm.article.comment" id="comment" class="form-control" cols="30" rows="10" placeholder="Comment"></textarea>
</div>
```

### Test your changes locally

Save all your changes.

In the local terminal window, test your changes in production mode again.

```bash
gulp prod
NODE_ENV=production node server.js
```

Navigate to `http://localhost:8443` in a browser and make sure that you're signed in.

Select **Admin > Manage Articles**, then add an article by selecting the **+** button.

You see the new `Comment` textbox now.

![Added comment field to Articles](./media/tutorial-nodejs-mongodb-app/added-comment-field.png)

In the terminal, stop Node.js by typing `Ctrl+C`.

### Publish changes to Azure

Commit your changes in Git, then push the code changes to Azure.

```bash
git commit -am "added article comment"
git push azure master
```

Once the `git push` is complete, navigate to your Azure app and try out the new functionality.

![Model and database changes published to Azure](media/tutorial-nodejs-mongodb-app/added-comment-field-published.png)

If you added any articles earlier, you still can see them. Existing data in your Cosmos DB is not lost. Also, your updates to the data schema and leaves your existing data intact.

## Stream diagnostic logs

[!INCLUDE [Access diagnostic logs](../../../includes/app-service-web-logs-access-no-h.md)]

## Manage your Azure app

Go to the [Azure portal](https://portal.azure.com) to see the app you created.

From the left menu, click **App Services**, then click the name of your Azure app.

![Portal navigation to Azure app](./media/tutorial-nodejs-mongodb-app/access-portal.png)

By default, the portal shows your app's **Overview** page. This page gives you a view of how your app is doing. Here, you can also perform basic management tasks like browse, stop, start, restart, and delete. The tabs on the left side of the page show the different configuration pages you can open.

![App Service page in Azure portal](./media/tutorial-nodejs-mongodb-app/web-app-blade.png)

[!INCLUDE [cli-samples-clean-up](../../../includes/cli-samples-clean-up.md)]

<a name="next"></a>

## Next steps

What you learned:

> [!div class="checklist"]
> * Create a database using Azure Cosmos DB's API for MongoDB
> * Connect a Node.js app to a database
> * Deploy the app to Azure
> * Update the data model and redeploy the app
> * Stream logs from Azure to your terminal
> * Manage the app in the Azure portal

Advance to the next tutorial to learn how to map a custom DNS name to your app.

> [!div class="nextstepaction"]
> [Tutorial: Map custom DNS name to your app](../app-service-web-tutorial-custom-domain.md)

Or, check out other resources:

> [!div class="nextstepaction"]
> [Configure Node.js app](configure-language-nodejs.md)