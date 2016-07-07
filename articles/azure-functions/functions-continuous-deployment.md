<properties
   pageTitle="Continuous deployment for Azure Functions | Microsoft Azure"
   description="Use continuous deployment facilities of Azure App Service to publish your Azure Functions."
   services="azure-functions"
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
   ms.date="07/06/2016"
   ms.author="glenga"/>

# Continuous deployment for Azure Functions 

Azure Functions makes it easy to configure continuous deployment for your function app. Functions leverages Azure App Service integration with BitBucket, Dropbox, GitHub, and Visual Studio Team Services (VSTS) to enable a continuous deployment workflow where Azure pulls updates to your functions code when they are published to one of these services. Continuous deployment is a great option for projects where multiple and frequent contributions are being integrated. It also lets you maintain source control on your functions code. The following deployment sources are currently supported:

+ [Bitbucket](https://bitbucket.org/)
+ [Dropbox](https://bitbucket.org/)
+ Git local repo (App Service)
+ Git external repo
+ [GitHub](https://github.com/)
+ Mercurial external repo
+ [OneDrive](https://onedrive.live.com/)
+ Visual Studio Team Services

Deployments are configured on a per-function-app basis. After continuous deployment is enabled, access to function code in the portal is set to *read-only*.

## Continuous deployment requirements

With the exception of the local Git repo in App Service, you must have your deployment source configured and your functions code in the deployment source before you set-up continuous deployment. In a given function app deployment, each function lives in a named subdirectory, there the directory name is the name of the function. This folder structure is essentially your site code. 

[AZURE.INCLUDE [functions-folder-structure](../../includes/functions-folder-structure.md)]

## Setting-up continuous deployment

Use the following procedure to configure continuous deployment for an existing function app:

1. In your function app in the [Azure Functions portal](https://functions.azure.com/signin), click **Function app settings** > **Configure continuous integration** > **Setup**.

	![Setup continuous deployment](./media/functions-continuous-deployment/setup-deployment.png)

	You can also get to the Deployments blade from the Functions quickstart by clicking **Start from source control**.

2. In the Deployments blade, click **Choose source**, then fill-in the information for your chosen deployment source and click **OK**.

	![](./media/functions-continuous-deployment/choose-deployment-source.png)

After continuous deployment is configured, all changes files in your deployment source are copied to the function app and redeployment is triggered.


##Deployment options

The following are some typical deployment scenarios

###Setting-up staging and production deployments

Function Apps doesn't yet support deployment slots. However, you can still manage separate staging and production  deployment and by using continuous integration when you use a deployment source that supports branching, like GitHub. The process looks generally like this:

1. Create two function apps in your subscription, one for the production code and one for staging. 

2. Create a deployment source that supports branching, in this case GitHub.

3. For your production function app, complete the above steps in **Setting-up continuous deployment** and set the deployment branch to the master branch of your GitHub repo.

	![](./media/functions-continuous-deployment/choose-deployment-branch.png)

4. Repeat this step for the staging function app, but this time choose the staging branch in your GitHub repo. 
 
5. Make updates to your code in the staging branch of your repo, and verify that those changes are reflected in the staging deployment.

6. After testing, merge changes from the staging branch into the master branch. This will trigger deployment to the production function app.

###Moving existing functions to continuous deployment

What's the best guidance here?

###Custom deployments

Are there more of these?

##Next steps


