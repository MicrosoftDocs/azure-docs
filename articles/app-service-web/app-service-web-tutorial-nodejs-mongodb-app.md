---
title:Create a MEAN.js app in Azure | Microsoft Docs 
description: Create a MEAN.js app in Azure. Learn how to get a MEAN.js app working in Azure, with connection to a DocumentDB database with a MongoDB connection string.
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
ms.date: 03/16/2017
ms.author: cephalin

---
# Create a MEAN.js app in Azure
This tutorial shows you how to deploy a [MEAN.js](http://meanjs.org/) app to Azure App Service, complete with MongoDB access. MEAN.js is a popular MEAN (MongoDB, Express, AngularJS, and Node.js) framework.

You should have working knowledge of Node.js. This tutorial is not intended to help you with issues related to developing Node.js apps in general.

Before starting this tutorial, ensure that [the Azure CLI is installed](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) on your machine. In addition, you need [Node.js](https://nodejs.org/) and [Git](http://www.git-scm.com/downloads). You will run `az`, `npm`, and `git` commands.

## Step 1 - Create local MEAN.js app
In this step, you set up the local Node.js project.

### Clone MEAN.js code

Open the command-line terminal of your choice and `CD` to a working directory. Then, run the following commands to clone the official MEAN.js repository. In this tutorial, you use the 0.5.0 release of MEAN.js.

```bash
git clone https://github.com/meanjs/mean.git
cd mean
git checkout tags/0.5.0 -b 0.5.0
```

### Run the app

Install the required packages and start the app.

```bash
npm install
npm start
```

Unless you already have a local MongoDB instance, `npm start` should terminate with the following error message:

```bash
{ [MongoError: failed to connect to server [localhost:27017] on first connect]
  name: 'MongoError',
  message: 'failed to connect to server [localhost:27017] on first connect' }
```

Instead of setting up a local MongoDB instance, you create one in Azure.

## Step 2 - Connect to MongoDB

In this step, you connect your app to a MongoDB database. For MongoDB, this tutorial uses [Azure DocumentDB](https://docs.microsoft.com/en-us/azure/documentdb/), which can support MongoDB client connections.

### Create resource group

Create a [resource group](../azure-resource-manager/resource-group-overview.md). A resource group is where you put all the Azure resources that you want to manage together, such as 
the web app and the DocumentDB database back end.

```azurecli
az group create --location "West Europe" --name myResourceGroup
```

To see what possible values you can use for `---location`, use the `az appservice list-locations` Azure CLI command.

### Create a DocumentDB account

Use the `az documentdb create` command to create a DocumentDB account with MongoDB support.

```azurecli
accountname="<replace-with-a-unique-name>"
az documentdb create --name $accountname --resource-group myResourceGroup --kind MongoDB
```

The `--kind MongoDB` parameter specifies that the database should support MongoDB client connections.

### Retrieve connection key

Use the `az documentdb list-keys` to retrieve the primary key.

```azurecli
password=$(az documentdb list-keys --name $accountname --resource-group myResourceGroup --query primaryMasterKey --output tsv)
```

The `--query primaryMasterKey --output tsv` portion helps filter the JSON output to only the value you need, in the format you want.

### Set the MEAN.js environment variable

MEAN.js lets you use several environment variables to set the connection URI for MongoDB, and `MONGODB_URI` is one of them (see `config/env/development.js` in your repository). Set this environment variable using the connection information of your DocumentDB database.

```bash
export MONGODB_URI="mongodb://$accountname:$password@$accountname.documents.azure.com:10250/mean-dev?ssl=true&sslverifycertificate=false"
```

> [!NOTE] 
> The `ssl=true` option is important because [Azure DocumentDB requires it](../documentdb/documentdb-connect-mongodb-account.md#connection-string-requirements). 
>
>

### Run the app again.

Run `npm start` again. When the development environment is up and running, navigate to http://localhost:3000 in a browser.

## Step 3 - Deploy app to Azure

### Create App Service plan
Create a "Standard" [App Service plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md). Standard tier is required to run Linux containers.

```azurecli
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku S1 --is-linux 
```

### Create web app

Create a web app with a unique name in `<app_name>`.

```azurecli
az appservice web create --name <app_name> --resource-group myResourceGroup --plan myAppServicePlan
```

### Configure Linux container
Configure the Linux container to use the default Node.js 6.9.3 image.

```azurecli
az appservice web config update --node-version 6.9.3 --name <app_name> --resource-group myResourceGroup
```

### Configure MongoDB connection string

Remember that you created a local environment variable for `MONGODB_URI`. Do the same for your Azure app by setting an application setting for your app.

```azurecli
az appservice web config appsettings update --settings dbconnstring="mongodb://$accountname:$password@$accountname.documents.azure.com:10250/mean?ssl=true&sslverifycertificate=false" --name <app_name> --resource-group myResourceGroup    
```

Putting your settings in Azure app settings keeps sensitive data like username and password out of your source control (Git). 

### Set deployment credentials
Set your account-level deployment credentials for App Service.

```azurecli
az appservice web deployment user set --user-name <specify-a-username> --password <mininum-8-char-captital-lowercase-number>
```

### Configure Git deployment
Configure local Git deployment.

```azurecli
az appservice web source-control config-local-git --name $webappname --resource-group myResourceGroup
```

This command gives you an output that looks like the following JSON:

```json
{
  "url": "https://user123@myuniqueappname.scm.azurewebsites.net/myuniqueappname.git"
}
```
Use the returned URL to configure your Git remote. The following command uses the preceding output example.

```bash
git remote add azure https://user123@myuniqueappname.scm.azurewebsites.net/myuniqueappname.git
```

### Deploy sample application
You are now ready to deploy your MEAN.js sample application. Run `git push`.

```bash
git push azure master
```

When prompted for password, use the password that you specified when you ran `az appservice web deployment user set`.

### Browse to Azure web app
To see your app running live in Azure, run this command.

```azurecli
az appservice web browse --name <app_name> --resource-group myResourceGroup
```

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

<!--
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
