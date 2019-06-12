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
ms.date: 06/07/2019
ms.author: cephalin;dariagrigoriu
ms.custom: seodec18

---
# Continuous deployment to Azure App Service

[Azure App Service](overview.md) enables continuous deployment from BitBucket, GitHub, and [Azure Repos](https://azure.microsoft.com/services/devops/repos/) by pulling in updates from your repository. This article shows you how to use the Azure portal to configure continuous deployment through Kudu build service or Azure Pipelines (Preview). 

For more information on the source control services, see [Create a repo (GitHub)], [Create a repo (BitBucket)], and [Create a new Git repo (Azure Repos)].

To manually configure continuous deployment from a cloud repository that the portal doesn't directly support, such as [GitLab](https://gitlab.com/), see [Set up continuous deployment using manual steps](https://github.com/projectkudu/kudu/wiki/Continuous-deployment#setting-up-continuous-deployment-using-manual-steps).

[!INCLUDE [Prepare repository](../../includes/app-service-deploy-prepare-repo.md)]

## Authorize Azure App Service to access your respository

You only need to authorize with a source control service once. To authorize Azure App Service to connect to your GitHub, Bitbucket, or Azure Repos repository:

1. Navigate to your Azure App Service app page in the [Azure portal](https://portal.azure.com), and select **Deployment Center** in the left menu.
   
1. On the **Deployment Center** page, select either **GitHub**, **Bitbucket**, or **Azure Repos**, and then select **Authorize**. 
   
   ![Select source control service, then select Authorize.](media/app-service-continuous-deployment/github-choose-source.png)
   
1. Sign in to the service if necessary, and follow the authorization prompts. 
   
> [!NOTE]
> To use Azure Repos, you need to link your Azure DevOps organization to your Azure subscription. For more information, see [Define your CD release pipeline](/azure/devops/pipelines/apps/cd/deploy-webdeploy-webapps#cd).

## Select and configure a build provider

After you authorize a source control service, you can configure your app for continuous deployment through the built-in Kudu App Service build service or through Azure Pipelines (Preview). 

### To configure Kudu App Service build service

You can use the built-in Kudu App Service build service to continuously deploy from GitHub, Bitbucket, or Azure Repos repositories. 

1. Navigate to your Azure App Service app page in the [Azure portal](https://portal.azure.com), and select **Deployment Center** in the left menu.
   
1. Select your authorized source control provider on the **Deployment Center** page, and select **Continue**. For GitHub or Bitbucket, you can also select **Change account** to change the authorized account. 
   
1. For GitHub or Azure Repos, on the **Build provider** page, select **App Service build service**, and then select **Continue**. Bitbucket only uses App Service build service.
   
   ![Select App Service build service, then select Continue.](media/app-service-continuous-deployment/choose-kudu.png)
   
1. On the **Configure** page:
   
   - For GitHub, drop down and select the **Organization**, **Repository**, and **Branch** you want to deploy continuously.
     
     If you don't see any repositories, you may need to authorize Azure App Service in GitHub. Browse to your GitHub repository and go to **Settings** > **Applications** > **Authorized OAuth Apps**. Select **Azure App Service**, and then select **Grant**.
     
   - For Bitbucket, drop down and select the Bitbucket **Team**, **Repository** and **Branch** you want to deploy continuously.
     
   - For Azure Repos, drop down and select the **Azure DevOps Organization**, **Project**, **Repository**, and **Branch** you want to deploy.
     
     > [!NOTE]
     > To use Azure Repos, you need to link your Azure DevOps organization to your Azure subscription. For more information, see [Define your CD release pipeline](/azure/devops/pipelines/apps/cd/deploy-webdeploy-webapps#cd).
     
1. Select **Continue**.
   
   ![Fill in repository information, then select Continue.](media/app-service-continuous-deployment/configure-kudu.png)
   
1. On the **Summary** page, review the settings, and then select **Finish**.

After configuration completes, new commits in the selected repository and branch deploy continuously into your App Service app.

![](media/app-service-continuous-deployment/github-finished.png)

### To configure Azure Pipelines (Preview)

If your Azure account has the necessary permissions, you can set up Azure Pipelines (Preview) to continuously deploy from GitHub or Azure Repos repositories. 

- To use Azure Pipelines continuous delivery, your Azure account must have permissions to write to Azure Active Directory and create a service. 
  
- For Azure App Service to create the necessary Azure Pipelines in your Azure DevOps organization, your Azure account must have the **Owner** role in your Azure subscription.

To configure Azure Pipelines (Preview):

1. On the **Deployment Center** page for your App Service app, select **GitHub** or **Azure Repos**, and then select **Continue**. For GitHub, you can also select **Change account** to change the authorized account. 
   
1. On the **Build provider** page, select **Azure Pipelines (Preview)**, and then select **Continue**. 
   
1. On the **Configure** page, in the **Code** section:
   
   - For GitHub, drop down and select the **Organization**, **Repository**, and **Branch** you want to deploy continuously.
     
     If you don't see any repositories, you may need to authorize Azure App Service in GitHub. Browse to your GitHub repository and go to **Settings** > **Applications** > **Authorized OAuth Apps**. Select **Azure App Service**, and then select **Grant**.
     
   - For Azure Repos, drop down and select the **Azure DevOps Organization**, **Project**, **Repository**, and **Branch** you want to deploy.
     
     > [!NOTE]
     > To use Azure Repos, you need to link your Azure DevOps organization to your Azure subscription. For more information, see [Define your CD release pipeline](/azure/devops/pipelines/apps/cd/deploy-webdeploy-webapps#cd).
     
1. Select **Continue**.
   
1. On the **Configure** page, in the **Build** section, specify the language framework that Azure Pipelines should use, and then select **Continue**.
   
1. On the **Test** page, choose whether to enable load tests, and then select **Continue**.
   
1. Depending on your App Service plan [pricing tier](https://azure.microsoft.com/pricing/details/app-service/plans/), you may see a **Deploy to staging** page. Choose whether to [enable deployment slots](deploy-staging-slots.md), and then select **Continue**.
   
   > [!NOTE]
   > Azure Pipelines doesn't allow continuous delivery to the production slot. This is by design, to prevent accidental deployments to production. Set up continuous delivery to a staging slot, verify the changes there, and swap the slots when you are ready.
   
1. On the **Summary** page, review the settings, and then select **Finish**.

After configuration completes, new commits in the selected repository deploy continuously into your App Service app.

## Disable continuous deployment

To disable continuous deployment, select **Disconnect** at the top of the **Deployment Center** page.

![Disable continuous deployment](media/app-service-continuous-deployment/disable.png)

[!INCLUDE [What happens to my app during deployment?](../../includes/app-service-deploy-atomicity.md)]

## Additional resources

* [Investigate common issues with continuous deployment](https://github.com/projectkudu/kudu/wiki/Investigating-continuous-deployment)
* [Use Azure PowerShell]
* [Git documentation]
* [Project Kudu](https://github.com/projectkudu/kudu/wiki)
* [Use Azure to automatically generate a CI/CD pipeline to deploy an ASP.NET 4 app](https://www.visualstudio.com/docs/build/get-started/aspnet-4-ci-cd-azure-automatic)

[Azure portal]: https://portal.azure.com
[Use Azure PowerShell]: /powershell/azureps-cmdlets-docs
[Git documentation]: https://git-scm.com/documentation

[Create a repo (GitHub)]: https://help.github.com/articles/create-a-repo
[Create a repo (BitBucket)]: https://confluence.atlassian.com/get-started-with-bitbucket/create-a-repository-861178559.html
[Create a new Git repo (Azure Repos)]: /azure/devops/repos/git/creatingrepo
