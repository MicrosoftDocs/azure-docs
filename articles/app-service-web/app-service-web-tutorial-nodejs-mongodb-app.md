---
title: Create a data-driven Node.js app in Azure with MongoDB | Microsoft Docs 
description: Learn how to get a MEAN.js app working in Azure, with connection to a DocumentDB database with a MongoDB connection string.
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
# Build a Node.js and MongoDB app in Azure
This tutorial shows you how to deploy a Node.js web app to Azure and connect it to a MongoDB database. When you are done, you will have a MEAN application (MongoDB, Express, AngularJS, and Node.js) running on Azure App Service.

## Before you begin

Before starting this tutorial, ensure that [the Azure CLI is installed](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) on your machine. In addition, you need [Node.js](https://nodejs.org/) and [Git](http://www.git-scm.com/downloads). You will run `az`, `npm`, and `git` commands.

You should have working knowledge of Node.js. This tutorial is not intended to help you with developing Node.js apps in general.

## Step 1 - Create local Node.js app
In this step, you set up the local Node.js project.

### Clone MEAN.js code

Open the terminal window and `CD` to a working directory. 

Run the following commands to clone the sample repository. This sample repository is the 0.5.0 version of the [MEAN.js](http://meanjs.org/) framework. 

```bash
git clone https://github.com/cephalin/mean.git
```

### Run the app

Install the required packages and start the app.

```bash
cd mean
npm install
npm start
```

Unless you already have a local MongoDB database, `npm start` should terminate with something similar to the following error message:

```bash
{ [MongoError: failed to connect to server [localhost:27017] on first connect]
  name: 'MongoError',
  message: 'failed to connect to server [localhost:27017] on first connect' }
```

Instead of setting up a local MongoDB database, you'll create one in Azure.

## Step 2 - Create a MongoDB database

In this step, you connect your app to a MongoDB database. For MongoDB, this tutorial uses [Azure DocumentDB](https://docs.microsoft.com/en-us/azure/documentdb/), which can support MongoDB client connections. In other words, as far as your MEAN.js app is concerned, it just needs to know that it's connecting to a MongoDB database. The fact that the connection is backed by a DocumentDB database is complete transparent to the app.

### Log in to Azure

We are now going to use the Azure CLI 2.0 in a terminal window to create the resources needed to host our Node.js app in Azure.  Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions. 

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

Create a DocumentDB account with the [az documentdb create]() command.

The following command, please substitute your own unique DocumentDB name where you see the `<documentdb_name>` placeholder. This unique name will be used as the part of your DocumentDB endpoint (`https://<documentdb_name>.documents.azure.com/`), so the name needs to be unique across all DocumentDB accounts in Azure. 

```azurecli
az documentdb create --name <documentdb_name> --resource-group myResourceGroup --kind MongoDB
```

The `--kind MongoDB` parameter enables MongoDB client connections.

When the DocumentDB account is created, the Azure CLI shows information similar to the following example. 

```json
{
  "consistencyPolicy": {
    "defaultConsistencyLevel": "Session",
    "maxIntervalInSeconds": 5,
    "maxStalenessPrefix": 100
  },
  "databaseAccountOfferType": "Standard",
  "documentEndpoint": "https://<documentdb_name>.documents.azure.com:443/",
  "failoverPolicies": [
    {
      "failoverPriority": 0,
      "id": "<documentdb_name>-westeurope",
      "locationName": "West Europe"
    }
  ],
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Document
DB/databaseAccounts/<documentdb_name>",
  "ipRangeFilter": "",
  "kind": "MongoDB",
  "location": "West Europe",
  "name": "<documentdb_name>",
  "provisioningState": "Succeeded",
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
  "tags": {},
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

## Step 3 - Connect your Node.js app to the database

### Retrieve the database key

In order to connect to the DocumentDB database, you need the database key. Use the [az documentdb list-keys]() command to retrieve the primary key.

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
### Configure the connection string in your Node.js app

In your MEAN.js repository, open `/config/env/development.js`.

In the `db` object, replace the value of `uri` as show in the following example. Replace the two `<documentdb_name>` placeholders with your DocumentDB database name, and the `<primary_maste_key>` placeholder with the key you copied in the previous step.

```javascript
db: {
  uri: 'mongodb://<documentdb_name>:<primary_maste_key>@<documentdb_name>.documents.azure.com:10250/mean-dev?ssl=true&sslverifycertificate=false',
  ...
},
```

> [!NOTE] 
> The `ssl=true` option is important because [Azure DocumentDB requires SSL](../documentdb/documentdb-connect-mongodb-account.md#connection-string-requirements). 
>
>

When you're done, your `db` object show look like the following code:


Save your changes.

### Run the app again.

Run `npm start` again. 

Instead of the error message you saw earlier, a console message should now tell you that the development environment is up and running. 

Navigate to http://localhost:3000 in a browser. Click **Sign Up** in the top menu and try to create a dummy user. 

The MEAN.js sample app stores user data in the database. If you are successful and the app automatically signs into the created user, then your MongoDB database connection is working. 

![]()

## Step 4 - Deploy the Node.js app to Azure
In this step, you deploy your MongoDB-connected app to Azure App Service.

### Prepare your sample app for deployment

You may have noticed that the configuration file that you changed earlier is for the development environment (`/config/env/development.js`). When you deploy your app to App Service, your app will run in the production environment by default instead. So now, you will make the same change to the respective configuration file.

In your MEAN.js repository, open `/config/env/production.js`.

In the `db` object, replace the value of `uri` with the following connection string:

```
mongodb://<documentdb_name>:<primary_maste_key>@<documentdb_name>.documents.azure.com:10250/mean?ssl=true&sslverifycertificate=false
```

In the `db` object, replace the value of `uri` as show in the following example. Be sure to replace the placeholders as before.

```javascript
db: {
  uri: 'mongodb://<documentdb_name>:<primary_maste_key>@<documentdb_name>.documents.azure.com:10250/mean?ssl=true&sslverifycertificate=false',
  ...
},
```

> [!NOTE] 
> The only different with this connection string than before is that the [MongoDB collection](https://docs.mongodb.com/manual/reference/glossary/#term-collection) name is changed from `mean-dev` to `mean`. Actually, you can name your collection however you want. You're just following the convention for development and production environments that the MEAN.js sample already gives you.
>
>

In the terminal, commit all your changes into Git. You can copy both commands to run them together.

```bash
git add .
git commit -m "configured MongoDB connection string"
```

That's it! Your Node.js app is ready to be deployed.

### Create an App Service plan

Create a Linux-based App Service plan with the [az appservice plan create](/cli/azure/appservice/plan#create) command. 

> [!NOTE] 
> An App Service plan represents the collection of physical resources used to host your apps. All applications assigned to an App Service plan share the resources defined by it allowing you to save cost when hosting multiple apps. 
> 
> App Service plans define: 
> * Region (North Europe, East US, Southeast Asia) 
> * Instance Size (Small, Medium, Large) 
> * Scale Count (one, two or three instances, etc.) 
> * SKU (Free, Shared, Basic, Standard, Premium) 
> 

The following example creates an App Service plan in Linux named `myAppServicePlan` using the **Standard** pricing tier. Standard tier is required to run Linux containers.

```azurecli
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku S1 --is-linux
```

When the App Service plan is created, the Azure CLI shows information similar to the following example. 

```json 
{ 
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Web/serverfarms/myAppServicePlan", 
    "kind": "app", 
    "location": "West Europe", 
    "sku": { 
    "capacity": 1, 
    "family": "S", 
    "name": "S1", 
    "tier": "Standard" 
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

### Configure to use Node.js 

Use the `az appservice web config update` command to configure the Web App to use Node.js version `6.9.3`. 

> [!TIP] 
> Setting the node.js version this way uses a default container provided by the platform, if you would like to use your own container refer to the reference for the [az appservice web config container update](https://docs.microsoft.com/cli/azure/appservice/web/config/container#update) command. 
>
>

```azurecli
az appservice web config update --name <app_name> --resource-group myResourceGroup --linux-fx-version "NODE|6.9.3"
```

### Configure local git deployment 

You can deploy your app to Azure App Service in a variety of ways including FTP, local Git as well as GitHub, Visual Studio Team Services and Bitbucket. For FTP and local Git, it is necessary to have a deployment user configured on the server to authenicate your deployment. 

Use the [az appservice web deployment user set](/cli/azure/appservice/web/deployment/user#set) command to create your account-level credentials. 

> [!NOTE] 
> A deployment user is required for FTP and Local Git deployment to App Service. This deployment user is account-level. As such, it is different from your Azure subscription account. This deployment user only needs to be created once.

```azurecli
az appservice web deployment user set --user-name <specify-a-username> --password <mininum-8-char-captital-lowercase-number>
```

Use the [az appservice web source-control config-local-git](https://docs.microsoft.com/cli/azure/appservice/web/source-control#config-local-git) command to configure local git access to the Web App. 

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

Set a high `http.postBuffer` value to make Git deployment work with the Linux container.

```bash
git config http.postBuffer 524288000
```

Push to the Azure remote to deploy your Node.js app. You will be prompted for the password you supplied earlier as part of the creation of the deployment user. 

```bash
git push azure master
```

During deployment, Azure Web App will communicate it's progress with Git. Be patient as it may take some time.

```bash
[]() 
``` 

### Browse to the web app 
Browse to the deployed application using your web browser. 

```bash 
http://<app_name>.azurewebsites.net 
``` 

Click **Sign Up** in the top menu and try to create a dummy user. 

If you are successful and the app automatically signs into the created user, then your Node.js app in Azure has connectivity to the MongoDB (DocumentDB) database. 

![]()

## Step 5 - Store sensitive data as environment variables

Earlier in the tutorial, you hardcoded the connection strings in the MEAN.js config files. Actually, that's actually best security practice. When you commit your changes into Git, your database key is immediately exposed to anyone with read access to your Git repository. In this step, you learn how to store and access the connection strings instead.

### Reset your sample repository

In your terminal, reset your local MEAN.js repository to remove your changes to the configuration files. 

```bash
git reset --hard origin/master
```

Take a look at both `config/env/development.js` and `config/env/production.js`.

In both configuration files, you should see this format:

```javascript
db: {
  uri: ... || process.env.MONGODB_URI || ...,
},
```

The default code already lets you use several environment variables for your MongoDB connection string, and `MONGODB_URI` is one of them. Set this environment variable using the connection information of your DocumentDB database.

### Configure a local environment variable

For your local development environment, you can configure database connection to the DocumentDB database simply by adding an environment variable in your shell. 

In Bash, you do this with the `export` command. Be sure to replace the placeholders like before.

```bash
export MONGODB_URI="mongodb://<documentdb_name>:<primary_maste_key>@<documentdb_name>.documents.azure.com:10250/mean-dev?ssl=true&sslverifycertificate=false",
```

### Configure an environment variable in Azure

In App Service, you set environment variables by using the [az appservice web config appsettings update]() command. 

The following example lets you configure your MongoDB connection string in your Azure web app. Be sure to replace the placeholders like before.

```azurecli
az appservice web config appsettings update --name <app_name> --resource-group myResourceGroup --settings MONGODB_URI="mongodb://<documentdb_name>:<primary_maste_key>@<documentdb_name>.documents.azure.com:10250/mean?ssl=true&sslverifycertificate=false"
```

Now, to reset your Azure web app's repository like your local repository, run the following command:

```bash
git push azure master --force
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
