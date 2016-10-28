<properties
   pageTitle="Continuous deployment for Azure Functions | Microsoft Azure"
   description="Use continuous deployment facilities of Azure App Service to publish your Azure Functions."
   services="functions"
   documentationCenter="na"
   authors="ggailey777"
   manager="erikre"
   editor=""
   tags=""
   />

<tags
   ms.service="functions"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="multiple"
   ms.workload="na"
   ms.date="09/25/2016"
   ms.author="glenga"/>

# Continuous deployment for Azure Functions 

Azure Functions makes it easy to configure continuous deployment for your function app. Functions leverages Azure App Service integration with BitBucket, Dropbox, GitHub, and Visual Studio Team Services (VSTS) to enable a continuous deployment workflow where Azure pulls updates to your functions code when they are published to one of these services. If you are new to Azure Functions, start with [Azure Functions Overview](functions-overview.md).

Continuous deployment is a great option for projects where multiple and frequent contributions are being integrated. It also lets you maintain source control on your functions code. The following deployment sources are currently supported:

+ [Bitbucket](https://bitbucket.org/)
+ [Dropbox](https://bitbucket.org/)
+ [Git local repo](../app-service-web/app-service-deploy-local-git.md)
+ Git external repo
+ [GitHub]
+ Mercurial external repo
+ [OneDrive](https://onedrive.live.com/)
+ Visual Studio Team Services

Deployments are configured on a per-function-app basis. After continuous deployment is enabled, access to function code in the portal is set to *read-only*.

## Continuous deployment requirements

You must have your deployment source configured and your functions code in the deployment source before you set-up continuous deployment. In a given function app deployment, each function lives in a named subdirectory, there the directory name is the name of the function. This folder structure is essentially your site code. 

[AZURE.INCLUDE [functions-folder-structure](../../includes/functions-folder-structure.md)]

## Setting-up continuous deployment

Use the following procedure to configure continuous deployment for an existing function app:

1. In your function app in the [Azure Functions portal](https://functions.azure.com/signin), click **Function app settings** > **Configure continuous integration** > **Setup**.

	![Setup continuous deployment](./media/functions-continuous-deployment/setup-deployment.png)
	
	![Setup continuous deployment](./media/functions-continuous-deployment/setup-deployment-1.png)
	
	You can also get to the Deployments blade from the Functions quickstart by clicking **Start from source control**.

2. In the Deployments blade, click **Choose source**, then fill-in the information for your chosen deployment source and click **OK**.

	![Choose deployment source](./media/functions-continuous-deployment/choose-deployment-source.png)

After continuous deployment is configured, all changes files in your deployment source are copied to the function app and a full site deployment is triggered. The site is redeployed when files in the source are updated.


##Deployment options

The following are some typical deployment scenarios:

+ 

###Create a staging deployment

Function Apps doesn't yet support deployment slots. However, you can still manage separate staging and production deployments by using continuous integration.

The process to configure and work with a staging deployment looks generally like this:

1. Create two function apps in your subscription, one for the production code and one for staging. 

2. Create a deployment source, if you don't already have one. We will use [GitHub].
 
3. For your production function app, complete the above steps in **Setting-up continuous deployment** and set the deployment branch to the master branch of your GitHub repo.

	![Choose deployment branch](./media/functions-continuous-deployment/choose-deployment-branch.png)

4. Repeat this step for the staging function app, but this time choose the staging branch in your GitHub repo. If your deployment source doesn't support branching, use a different folder.
 
5. Make updates to your code in the staging branch or folder, then verify that those changes are reflected in the staging deployment.

6. After testing, merge changes from the staging branch into the master branch. This will trigger deployment to the production function app. If your deployment source doesn't support branches, overwrite the files in the production folder with the files from the staging folder.

###Move existing functions to continuous deployment

When you have existing functions that you have created and maintained in the portal, you need to download your existing function code files using FTP or the local Git repository before you can set-up continuous deployment as described above. You can do this in the App Service settings for your function app. After your files are downloaded, you can upload them to your chosen continuous deployment source.

>[AZURE.NOTE]After you configure continuous integration, you will no longer be able to edit your source files in the Functions portal.

####How to: Configure deployment credentials
Before you can download files from your function app, you must configure your credentials to access the site, which you can do from the portal. Credentials are set at the Function app level.

1. In your function app in the [Azure Functions portal](https://functions.azure.com/signin), click **Function app settings** > **Go to App Service settings** > **Deployment credentials**.

	![Set local deployment credentials](./media/functions-continuous-deployment/setup-deployment-credentials.png)

2. Type in a username and password, then click **Save**. You can now use these credentials to access your function app from FTP or the built-in Git repo.

####How to: Download files using FTP

1. In your function app in the [Azure Functions portal](https://functions.azure.com/signin), click **Function app settings** > **Go to App Service settings** > **Properties** and copy the values for **FTP/Deployment User**, **FTP Host Name**, and **FTPS Host Name**.  
**FTP/Deployment User** must be entered as displayed in the portal, including the app name in order to provide proper context for the FTP server.

	![Get your deployment information](./media/functions-continuous-deployment/get-deployment-credentials.png)
    
2. From your FTP client, use the connection information you gathered to connect to your app and download the source files for your functions.

####How to: download files using the local Git repository

1. In your function app in the [Azure Functions portal](https://functions.azure.com/signin), click **Function app settings** > **Configure continuous integration** > **Setup**.

2. In the Deployments blade, click **Choose source**, **Local Git repository**, then click **OK**.
 
3. Click **Go to App Service settings** > **Properties** and note the value of Git URL. 
    
	![Setup continuous deployment](./media/functions-continuous-deployment/get-local-git-deployment-url.png)

4. Clone the repo on your local machine using a Git-aware command line or your favorite Git tool. The Git clone command looks like the following:

		git clone https://username@my-function-app.scm.azurewebsites.net:443/my-function-app.git

5. Fetch files from your function app to the clone on your local computer, as in the following example:

		git pull origin master

	If requested, supply the username and password for your function app deployment.  


[GitHub]: https://github.com/
