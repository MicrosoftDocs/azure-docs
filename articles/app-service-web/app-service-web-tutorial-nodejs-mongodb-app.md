---
title: Build a Node.js and MongoDB web app in Azure | Microsoft Docs 
description: Learn how to get a Node.js app working in Azure, with connection to a DocumentDB database with a MongoDB connection string.
services: app-service\web
documentationcenter: nodejs
author: cephalin
manager: erikre
editor: ''

ms.assetid: 0b4d7d0e-e984-49a1-a57a-3c0caa955f0e
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: nodejs
ms.topic: article
ms.date: 03/30/2017
ms.author: cephalin

---
# Build a Node.js and MongoDB web app in Azure
This tutorial shows you how to create a Node.js web app in Azure and connect it to a MongoDB database. When you are done, you will have a MEAN application (MongoDB, Express, AngularJS, and Node.js) running on [Azure App Service Web Apps](app-service-web-overview.md).

![MEAN.js app running in Azure App Service](./media/app-service-web-tutorial-nodejs-mongodb-app/meanjs-in-azure.png)

## Before you begin

Before starting this tutorial, ensure that [the Azure CLI is installed](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) on your machine. In addition, you need [Node.js](https://nodejs.org/) and [Git](http://www.git-scm.com/downloads). You will run `az`, `npm`, and `git` commands.

You should have working knowledge of Node.js. This tutorial is not intended to help you with developing Node.js applications in general.

## Step 1 - Create local Node.js application
In this step, you set up the local Node.js project.

### Clone the sample application

Open the terminal window and `CD` to a working directory.  

Run the following commands to clone the sample repository. This sample repository contains the default [MEAN.js](http://meanjs.org/) application. 

```bash
git clone https://github.com/prashanthmadi/mean
```

### Run the application

Install the required packages and start the application.

```bash
cd mean
npm install
npm start
```

Unless you already have a local MongoDB database, `npm start` should terminate with something similar to the following error message:

```bash
{ [MongoError: failed to connect to server [localhost:27017] on first connect]
  ...
  name: 'MongoError',
  message: 'failed to connect to server [localhost:27017] on first connect' }
```

Instead of setting up a local MongoDB database, you'll create one in Azure.

## Step 2 - Create a MongoDB database

In this step, you connect your application to a MongoDB database. For MongoDB, this tutorial uses [Azure DocumentDB](https://docs.microsoft.com/en-us/azure/documentdb/), which can support MongoDB client connections. In other words, your Node.js application only knows that it's connecting to a MongoDB database. The fact that the connection is backed by a DocumentDB database is completely transparent to the application.

### Log in to Azure

You are now going to use the Azure CLI 2.0 in a terminal window to create the resources needed to host your Node.js application in Azure App Service.  Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions. 

```azurecli 
az login 
``` 
   
### Create a resource group

Create a [resource group](../azure-resource-manager/resource-group-overview.md) with the [az group create](/cli/azure/group#create). An Azure resource group is a logical container into which Azure resources like web apps, databases and storage accounts are deployed and managed. 

The following example creates a resource group in the West Europe region.

```azurecli
az group create --name myResourceGroup --location "West Europe"
```

To see what possible values you can use for `---location`, use the `az appservice list-locations` Azure CLI command.

### Create a DocumentDB account

Create a DocumentDB account with the [az documentdb create](/cli/azure/documentdb#create) command.

In the following command, please substitute your own unique DocumentDB name where you see the `<documentdb_name>` placeholder. This unique name will be used as the part of your DocumentDB endpoint (`https://<documentdb_name>.documents.azure.com/`), so the name needs to be unique across all DocumentDB accounts in Azure. 

```azurecli
az documentdb create --name <documentdb_name> --resource-group myResourceGroup --kind MongoDB
```

The `--kind MongoDB` parameter enables MongoDB client connections.

When the DocumentDB account is created, the Azure CLI shows information similar to the following example. 

```json
{
  "databaseAccountOfferType": "Standard",
  "documentEndpoint": "https://<documentdb_name>.documents.azure.com:443/",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Document
DB/databaseAccounts/<documentdb_name>",
  "kind": "MongoDB",
  "location": "West Europe",
  "name": "<documentdb_name>",
  "readLocations": [
    {
      "documentEndpoint": "https://<documentdb_name>-westeurope.documents.azure.com:443/",
      "failoverPriority": 0,
      "id": "<documentdb_name>-westeurope",
      "locationName": "West Europe",
      "provisioningState": "Succeeded"
    }
  ],
  "resourceGroup": "myResourceGroup",
  "type": "Microsoft.DocumentDB/databaseAccounts",
  "writeLocations": [
    {
      "documentEndpoint": "https://<documentdb_name>-westeurope.documents.azure.com:443/",
      "failoverPriority": 0,
      "id": "<documentdb_name>-westeurope",
      "locationName": "West Europe",
      "provisioningState": "Succeeded"
    }
  ]
} 
```

## Step 3 - Connect your Node.js application to the database

In this step, you connect your MEAN.js sample application to the DocumentDB database you just created, using a MongoDB connection string. 

### Retrieve the database key

In order to connect to the DocumentDB database, you need the database key. Use the [az documentdb list-keys](/cli/azure/documentdb#list-keys) command to retrieve the primary key.

```azurecli
az documentdb list-keys --name <documentdb_name> --resource-group myResourceGroup
```

The Azure CLI outputs information similar to the following example. 

```json
{
  "primaryMasterKey": "RUayjYjixJDWG5xTqIiXjC...",
  "primaryReadonlyMasterKey": "...",
  "secondaryMasterKey": "...",
  "secondaryReadonlyMasterKey": "..."
}
```

Copy the value of `primaryMasterKey` to a text editor. You need this information in the next step.

<a name="devconfig"></a>
### Configure the connection string in your Node.js application

In your MEAN.js repository, open `config/env/local-development.js`.

Replace the content of this file with the following code. Be sure to also replace the two `<documentdb_name>` placeholders with your DocumentDB database name, and the `<primary_maste_key>` placeholder with the key you copied in the previous step.

```javascript
'use strict';

module.exports = {
  db: {
    uri: 'mongodb://<documentdb_name>:<primary_maste_key>@<documentdb_name>.documents.azure.com:10250/mean-dev?ssl=true&sslverifycertificate=false'
  }
};
```

> [!NOTE] 
> The `ssl=true` option is important because [Azure DocumentDB requires SSL](../documentdb/documentdb-connect-mongodb-account.md#connection-string-requirements). 
>
>

Save your changes.

### Run the application again.

Run `npm start` again. 

```bash
npm start
```

Instead of the error message you saw earlier, a console message should now tell you that the development environment is up and running. 

Navigate to `http://localhost:3000` in a browser. Click **Sign Up** in the top menu and try to create a dummy user. 

The MEAN.js sample application stores user data in the database. If you are successful and MEAN.js automatically signs into the created user, then your MongoDB database connection is working. 

![MEAN.js connects successfully to MongoDB](./media/app-service-web-tutorial-nodejs-mongodb-app/mongodb-connect-success.png)

## Step 4 - Deploy the Node.js application to Azure
In this step, you deploy your MongoDB-connected Node.js application to Azure App Service.

### Prepare your sample application for deployment

You may have noticed that the configuration file that you changed earlier is for the development environment (`/config/env/local-development.js`). When you deploy your application to App Service, your it will run in the production environment by default. So now, you need to make the same change to the respective configuration file.

In your MEAN.js repository, open `config/env/production.js`.

In the `db` object, replace the value of `uri` as show in the following example. Be sure to replace the placeholders as before.

```javascript
db: {
  uri: 'mongodb://<documentdb_name>:<primary_maste_key>@<documentdb_name>.documents.azure.com:10250/mean?ssl=true&sslverifycertificate=false',
  ...
},
```

In the terminal, commit all your changes into Git. You can copy both commands to run them together.

```bash
git add .
git commit -m "configured MongoDB connection string"
```

Your Node.js application is ready to be deployed.

### Create an App Service plan

Create an App Service plan with the [az appservice plan create](/cli/azure/appservice/plan#create) command. 

> [!NOTE] 
> An App Service plan represents the collection of physical resources used to host your apps. All applications assigned to an App Service plan share the resources defined by it allowing you to save cost when hosting multiple apps. 
> 
> App Service plans define: 
> 
> * Region (North Europe, East US, Southeast Asia) 
> * Instance Size (Small, Medium, Large) 
> * Scale Count (one, two or three instances, etc.) 
> * SKU (Free, Shared, Basic, Standard, Premium) 
> 

The following example creates an App Service plan named `myAppServicePlan` using the **FREE** pricing tier.

```azurecli
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku FREE
```

When the App Service plan is created, the Azure CLI shows information similar to the following example. 

```json 
{ 
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Web/serverfarms/myAppServicePlan", 
    "kind": "app", 
    "location": "West Europe", 
    "sku": { 
    "capacity": 0, 
    "family": "F", 
    "name": "F1", 
    "tier": "Free" 
    }, 
    "status": "Ready", 
    "type": "Microsoft.Web/serverfarms" 
} 
``` 

### Create a web app

Now that an App Service plan has been created, create a web app within the `myAppServicePlan` App Service plan. The web app gives your a hosting space to deploy your code as well as provides a URL for you to view the deployed application. Use the [az appservice web create](/cli/azure/appservice/web#create) command to create the web app. 

In the command below, please substitute `<app_name>` placeholder with your own unique app name. This unique name will be used as the part of the default domain name for the web app, so the name needs to be unique across all apps in Azure. You can later map any custom DNS entry to the web app before you expose it to your users. 

```azurecli
az appservice web create --name <app_name> --resource-group myResourceGroup --plan myAppServicePlan
```

When the web app has been created, the Azure CLI shows information similar to the following example. 

```json 
{ 
    "clientAffinityEnabled": true, 
    "defaultHostName": "<app_name>.azurewebsites.net", 
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Web/sites/<app_name>", 
    "isDefaultContainer": null, 
    "kind": "app", 
    "location": "West Europe", 
    "name": "<app_name>", 
    "repositorySiteName": "<app_name>", 
    "reserved": true, 
    "resourceGroup": "myResourceGroup", 
    "serverFarmId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Web/serverfarms/myAppServicePlan", 
    "state": "Running", 
    "type": "Microsoft.Web/sites", 
} 
```

### Configure local git deployment 

You can deploy your application to Azure App Service in a variety of ways including FTP, local Git as well as GitHub, Visual Studio Team Services and Bitbucket. For FTP and local Git, it is necessary to have a deployment user configured on the server to authenicate your deployment. 

Use the [az appservice web deployment user set](/cli/azure/appservice/web/deployment/user#set) command to create your account-level credentials. 

> [!NOTE] 
> A deployment user is required for FTP and Local Git deployment to App Service. This deployment user is account-level. As such, it is different from your Azure subscription account. This deployment user only needs to be created once.

```azurecli
az appservice web deployment user set --user-name <specify-a-username> --password <mininum-8-char-captital-lowercase-number>
```

Use the [az appservice web source-control config-local-git](https://docs.microsoft.com/cli/azure/appservice/web/source-control#config-local-git) command to configure local Git access to the Azure web app. 

```azurecli
az appservice web source-control config-local-git --name <app_name> --resource-group myResourceGroup
```

When the deployment user is configured, the Azure CLI shows the deployment URL for your Azure web app in the following format:

```bash 
https://<username>@<app_name>.scm.azurewebsites.net:443/<app_name>.git 
``` 

Copy the output from the terminal as it will be used in the next step. 

### Push to Azure from Git

Add an Azure remote to your local Git repository. 

```bash
git remote add azure <paste_copied_url_here> 
```

Push to the Azure remote to deploy your Node.js application. You will be prompted for the password you supplied earlier as part of the creation of the deployment user. 

```bash
git push azure master
```

During deployment, Azure App Service will communicate it's progress with Git.

```bash
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
To https://<app_name>.scm.azurewebsites.net/<app_name>.git
 * [new branch]      master -> master
``` 

> [!NOTE]
> You may notice that the deployment process runs [Gulp](http://gulpjs.com/) after `npm install`. Like some other Node.js applications, MEAN.js uses Gulp to automate deployment tasks. Specifically, it uses Gulp to minify and bundle scripts for production. App Service does not run Gulp or Grunt tasks during deployment by default, so this sample repository has two additional files in its root directory to enable this: 
>
> - `.deployment` - This file tells App Service to run `bash deploy.sh` as the custom deployment script.
> - `deploy.sh` - The custom deployment script. If you review the file, you will see that it runs `gulp prod` after `npm install` and `bower install`. 
>
>You can use this approach to add any step to your Git-based deployment.
>
>

### Browse to the Azure web app 
Browse to the deployed web app using your web browser. 

```bash 
http://<app_name>.azurewebsites.net 
``` 

Click **Sign Up** in the top menu and try to create a dummy user. 

If you are successful and the app automatically signs into the created user, then your MEAN.js app in Azure has connectivity to the MongoDB (DocumentDB) database. 

![MEAN.js app running in Azure App Service](./media/app-service-web-tutorial-nodejs-mongodb-app/meanjs-in-azure.png)

## Step 5 - Store sensitive data as environment variables

Earlier in the tutorial, you hardcoded the connection strings in the MEAN.js configuration files. Actually, that's not the best security practice. When you commit your changes into Git, your database key is immediately exposed to anyone with read access to your Git repository. In this step, you learn how to store and access the connection strings instead.

### Configure an environment variable in Azure

In App Service, you set environment variables as _app settings_ by using the [az appservice web config appsettings update](/cli/azure/appservice/web/config/appsettings#update) command. 

The following example lets you configure a `MONGODB_URI` app setting in your Azure web app. Be sure to replace the placeholders like before.

```azurecli
az appservice web config appsettings update --name <app_name> --resource-group myResourceGroup --settings MONGODB_URI="mongodb://<documentdb_name>:<primary_maste_key>@<documentdb_name>.documents.azure.com:10250/mean?ssl=true&sslverifycertificate=false"
```

### Access the environment variable in Node.js code

In your Node.js code, you access this app setting with `process.env.MONGODB_URI` just like any environment variable. 

Open `config/env/production.js` and set `db.uri` to this app setting. For example:

```javascript
db: {
  uri: process.env.MONGODB_URI,
  ...
},
```

### Push your changes to Azure

Now, push your changes with the `git push` command.

```bash
git push azure master
```

Your Azure web app now access this environment variable for its MongoDB connection string.

<!--

## Step 4 - Download server logs
In this step, you turn on monitoring of your web app with web server logs, and then download these logs. 

### Enable logging
Enable all logging options for your web app.

```azurecli
az appservice web log config --name <app_name> --resource-group myResourceGroup --application-logging true --detailed-error-messages true --failed-request-tracing true --web-server-logging filesystem
```

### Generate errors

To generate some error entries, navigate to a nonexistent page in your web app. For example: `http://<app_name>.azurewebsites.net/404`. 

### Download log files
Download the log files for review.

```azurecli
az appservice web log download --name <app_name> --resource-group myResourceGroup
```

## Step 5 - Scale to another region
In this step, you scale your Node.js app to serve your customers in a new region. That way, you can tailor your web app to customers in different regions, and also put your web app closer to them to improve performance. When you're done with this step, you will have a [Traffic Manager](https://docs.microsoft.com/en-us/azure/traffic-manager/) profile with two endpoints, which route traffic to two web apps which reside in different geographical regions.

1. Create a Traffic Manager profile with a unique name and add it to your resource group.

    ```azurecli
    az network traffic-manager profile create --name myTrafficManagerProfile --resource-group myResourceGroup --routing-method Performance --unique-dns-name <unique-dns-name>
    ```

    > [!NOTE]
    > `--routing-method Performance` specifies that this profile [routes user traffic to the closest endpoint](../traffic-manager/traffic-manager-routing-methods.md).

2. Get the resource ID of your existing Node.js web app.

    ```azurecli
    az appservice web show --name <app_name> --resource-group myResourceGroup --query id --output tsv
    ```

3. Add an endpoint to the Traffic Manager profile and put the output of the last command in `<web-app-1-resource-id>`:

    ```azurecli
    az network traffic-manager endpoint create --name <app_name>-westeurope --profile-name myTrafficManagerProfile --resource-group myResourceGroup --type azureEndpoints --target-resource-id <web-app-1-resource-id>
    ```

4. Your Traffic Manager profile now has an endpoint that points to your web app. Query for its URL to try it out.

    ```azurecli
    az network traffic-manager profile show --name cephalin-express --resource-group myResourceGroup --query dnsConfig.fqdn --output tsv
    ```

    Copy the output into your browser. You should get the default Express page again, with data from your database.

5. Let's add some identifying characteristic to your West Europe app. Add an environment variable.

    ```azurecli
    az appservice web config appsettings update --settings region="Europe" --name <app_name> --resource-group myResourceGroup    
    ```

6. Open `routes/index.js` and change the `router.get()` to use the environment variable.

    ```javascript
    router.get('/', function(req, res, next) {
      res.render('index', { title: 'Express ' + process.env.region, data: output });
    });
    ```

7. Save your changes and push them to Azure.

    ```
    git add .
    git commit -m "added region string."
    git push azure master
    ```

8. Refresh your browser on your Traffic Manager profile's URL. You should now see `Express Europe` in the homepage. 

    Since your Traffic Manager profile only has one endpoint which points to your West Europe web app, this is the only page you'll see. Next, you create a new web app in Southeast Asia and add a new endpoint to the profile.

4. Create an App Service plan and web app in the Southeast Asia region, and deploy the same code to it just like you did in [Step 1]<#step1>.

    ```azurecli
    az appservice plan create --name my-expressjs-appservice-plan-asia --resource-group myResourceGroup --location "Southeast Asia" --sku FREE
    az appservice web create --name <app_name>-asia --plan my-expressjs-appservice-plan-asia --resource-group myResourceGroup
    url=$(az appservice web source-control config-local-git --name <app_name>-asia --resource-group myResourceGroup --query url --output tsv)
    git remote add azureasia $url
    git push azureasia master
    ```

5. Add the same application settings to the new web app. Set the region to `"Asia"`.

    ```azurecli
    az appservice web config appsettings update --settings dbconnstring="mongodb://$accountname:$password@$accountname.documents.azure.com:10250/tutorial?ssl=true&sslverifycertificate=false" --name <app_name>-asia --resource-group myResourceGroup    
    az appservice web config appsettings update --settings region="Asia" --name <app_name>-asia --resource-group myResourceGroup    
    ```

    Since DocumentDB is a [geographically distributed](../documentdb/documentdb-distribute-data-globally.md) NoSQL service, you can use the same MongoDB connection string in the Southeast Asia web app. When the MongoDB client driver connects to your DocumentDB account, Azure automatically figures out where is the closest place to route the connection. No code change is necessary. You only need to add the regions you want to support to your DocumentDB account, which you will do next.

6. Add `Southeast Asia` as a region to your DocumentDB account.

    ```azurecli
    az documentdb update --locations "West Europe"=0 "Southeast Asia"=1 --name $accountname --resource-group myResourceGroup
    ```

3. To finish, add a second endpoint to the Traffic Manager profile and put the output of the last command in `<web-app-2-resource-id>`:

    ```azurecli
    resourceid=$(az appservice web show --name <app_name>-asia --resource-group myResourceGroup --query id --output tsv)
    az network traffic-manager endpoint create -n <app_name>-southeastasia --profile-name myTrafficManagerProfile -g myResourceGroup --type azureEndpoints --target-resource-id resourceid
    ```
  
Now, try to access the URL of your Traffic Manager profile. If you access the URL from the Europe region, you should see "Express Europe", but from the Asia region, you should see "Express Asia".

-->
## More resources
