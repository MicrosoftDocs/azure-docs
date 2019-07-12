---
title: Continuous deployment - Azure App Service | Microsoft Docs
description: Learn how to enable continuous deployment to Azure App Service.
services: app-service
documentationcenter: ''
author: cephalin
manager: cfowler

ms.assetid: 6adb5c84-6cf3-424e-a336-c554f23b4000
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/18/2019
ms.author: cephalin;dariagrigoriu
ms.reviewer: dariac
ms.custom: seodec18

---
# Continuous deployment to Azure App Service

[Azure App Service](overview.md) enables continuous deployment from GitHub, BitBucket, and [Azure Repos](https://azure.microsoft.com/services/devops/repos/) repositories by pulling in the latest updates. This article shows you how to use the Azure portal to continuously deploy your app through the Kudu build service or [Azure Pipelines](https://azure.microsoft.com/services/devops/pipelines/). 

For more information on the source control services, see [Create a repo (GitHub)], [Create a repo (BitBucket)], or [Create a new Git repo (Azure Repos)].

To manually configure continuous deployment from a cloud repository that the portal doesn't directly support, such as [GitLab](https://gitlab.com/), see [Set up continuous deployment using manual steps](https://github.com/projectkudu/kudu/wiki/Continuous-deployment#setting-up-continuous-deployment-using-manual-steps).

[!INCLUDE [Prepare repository](../../includes/app-service-deploy-prepare-repo.md)]

## Authorize Azure App Service 

To use Azure Repos, make sure your Azure DevOps organization is linked to your Azure subscription. For more information, see [Set up an Azure DevOps Services account so it can deploy to a web app](https://github.com/projectkudu/kudu/wiki/Setting-up-a-VSTS-account-so-it-can-deploy-to-a-Web-App).

For Bitbucket or GitHub, authorize Azure App Service to connect to your repository. You only need to authorize with a source control service once. 

1. Select **App Services** in the [Azure portal](https://portal.azure.com) left navigation, and then select the web app you want to deploy. 
   
1. On the app page, select **Deployment Center** in the left menu.
   
1. On the **Deployment Center** page, select **GitHub** or **Bitbucket**, and then select **Authorize**. 
   
   ![Select source control service, then select Authorize.](media/app-service-continuous-deployment/github-choose-source.png)
   
1. Sign in to the service if necessary, and follow the authorization prompts. 

## Enable continuous deployment 

After you authorize a source control service, configure your app for continuous deployment through the built-in [Kudu App Service build server](#option-1-use-the-app-service-build-service), or through [Azure Pipelines](#option-2-use-azure-pipelines). 

### Option 1: Use the App Service build service

You can use the built-in Kudu App Service build server to continuously deploy from GitHub, Bitbucket, or Azure Repos. 

1. Select **App Services** in the [Azure portal](https://portal.azure.com) left navigation, and then select the web app you want to deploy. 
   
1. On the app page, select **Deployment Center** in the left menu.
   
1. Select your authorized source control provider on the **Deployment Center** page, and select **Continue**. For GitHub or Bitbucket, you can also select **Change account** to change the authorized account. 
   
   > [!NOTE]
   > To use Azure Repos, make sure your Azure DevOps Services organization is linked to your Azure subscription. For more information, see [Set up an Azure DevOps Services account so it can deploy to a web app](https://github.com/projectkudu/kudu/wiki/Setting-up-a-VSTS-account-so-it-can-deploy-to-a-Web-App).
   
1. For GitHub or Azure Repos, on the **Build provider** page, select **App Service build service**, and then select **Continue**. Bitbucket always uses the App Service build service.
   
   ![Select App Service build service, then select Continue.](media/app-service-continuous-deployment/choose-kudu.png)
   
1. On the **Configure** page:
   
   - For GitHub, drop down and select the **Organization**, **Repository**, and **Branch** you want to deploy continuously.
     
     > [!NOTE]
     > If you don't see any repositories, you may need to authorize Azure App Service in GitHub. Browse to your GitHub repository and go to **Settings** > **Applications** > **Authorized OAuth Apps**. Select **Azure App Service**, and then select **Grant**.
     
   - For Bitbucket, select the Bitbucket **Team**, **Repository**, and **Branch** you want to deploy continuously.
     
   - For Azure Repos, select the **Azure DevOps Organization**, **Project**, **Repository**, and **Branch** you want to deploy continuously.
     
     > [!NOTE]
     > If your Azure DevOps organization isn't listed, make sure it's linked to your Azure subscription. For more information, see [Set up an Azure DevOps Services account so it can deploy to a web app](https://github.com/projectkudu/kudu/wiki/Setting-up-a-VSTS-account-so-it-can-deploy-to-a-Web-App)..
     
1. Select **Continue**.
   
   ![Fill in repository information, then select Continue.](media/app-service-continuous-deployment/configure-kudu.png)
   
1. After you configure the build provider, review the settings on the **Summary** page, and then select **Finish**.
   
   New commits in the selected repository and branch now deploy continuously into your App Service app. You can track the commits and deployments on the **Deployment Center** page.
   
   ![Track commits and deployments in Deployment Center](media/app-service-continuous-deployment/github-finished.png)

### Option 2: Use Azure Pipelines 

If your account has the necessary permissions, you can set up Azure Pipelines to continuously deploy from GitHub or Azure Repos repositories. For more information about deploying through Azure Pipelines, see [Deploy a web app to Azure App Services](/azure/devops/pipelines/apps/cd/deploy-webdeploy-webapps).

For Azure App Service to create continuous delivery Azure Pipelines in your Azure DevOps organization: 

- Your Azure account must have permissions to write to Azure Active Directory and create a service. 
  
- Your Azure account must have the **Owner** role in your Azure subscription.

- You must be an administrator in the Azure DevOps project you want to use.

To configure Azure Pipelines (Preview):

1. Select **App Services** in the [Azure portal](https://portal.azure.com) left navigation, and then select the web app you want to deploy. 
   
1. On the app page, select **Deployment Center** in the left menu.
   
1. On the **Build provider** page, select **Azure Pipelines (Preview)**, and then select **Continue**. 
   
1. On the **Configure** page, in the **Code** section:
   
   - For GitHub, drop down and select the **Organization**, **Repository**, and **Branch** you want to deploy continuously.
     
     > [!NOTE]
     > If you don't see any repositories, you may need to authorize Azure App Service in GitHub. Browse to your GitHub repository and go to **Settings** > **Applications** > **Authorized OAuth Apps**. Select **Azure App Service**, and then select **Grant**.
     
   - For Azure Repos, select the **Azure DevOps Organization**, **Project**, **Repository**, and **Branch** you want to deploy continuously, or configure a new Azure DevOps organization.
     
     > [!NOTE]
     > If your existing Azure DevOps organization isn't listed, you may need to link it to your Azure subscription. For more information, see [Define your CD release pipeline](/azure/devops/pipelines/apps/cd/deploy-webdeploy-webapps#cd).
     
1. Select **Continue**.
   
1. For Azure Repos, in the **Build** section, specify the language framework that Azure Pipelines should use to run build tasks, and then select **Continue**.
   
1. On the **Test** page, choose whether to enable load tests, and then select **Continue**.
   
1. Depending on your App Service plan [pricing tier](https://azure.microsoft.com/pricing/details/app-service/plans/), you may see a **Deploy to staging** page. Choose whether to [enable deployment slots](deploy-staging-slots.md), and then select **Continue**.
   
   > [!NOTE]
   > Azure Pipelines doesn't allow continuous delivery to the production slot. This restriction prevents accidental deployments to production. Set up continuous delivery to a staging slot, verify the changes there, and then swap the slots when you are ready.
   
1. After you configure the build provider, review the settings on the **Summary** page, and then select **Finish**.
   
   New commits in the selected repository and branch now deploy continuously into your App Service app. You can track the commits and deployments on the **Deployment Center** page.
   
   ![Track commits and deployments in Deployment Center](media/app-service-continuous-deployment/github-finished.png)

## Disable continuous deployment

To disable continuous deployment, select **Disconnect** at the top of your app's **Deployment Center** page.

![Disable continuous deployment](media/app-service-continuous-deployment/disable.png)

[!INCLUDE [What happens to my app during deployment?](../../includes/app-service-deploy-atomicity.md)]

## Additional resources

* [Investigate common issues with continuous deployment](https://github.com/projectkudu/kudu/wiki/Investigating-continuous-deployment)
* [Use Azure PowerShell](/powershell/azureps-cmdlets-docs)
* [Git documentation](https://git-scm.com/documentation)
* [Project Kudu](https://github.com/projectkudu/kudu/wiki)

[Create a repo (GitHub)]: https://help.github.com/articles/create-a-repo
[Create a repo (BitBucket)]: https://confluence.atlassian.com/get-started-with-bitbucket/create-a-repository-861178559.html
[Create a new Git repo (Azure Repos)]: /azure/devops/repos/git/creatingrepo
