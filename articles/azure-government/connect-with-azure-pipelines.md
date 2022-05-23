---
title: Deploy an app in Azure Government with Azure Pipelines
description: Configure continuous deployment to your applications hosted in Azure Government by connecting from Azure Pipelines.
ms.service: azure-government
ms.topic: article
ms.custom: devx-track-azurepowershell
ms.date: 03/02/2022 
---

# Deploy an app in Azure Government with Azure Pipelines

This article helps you use Azure Pipelines to set up continuous integration (CI) and continuous deployment (CD) of your web app running in Azure Government. CI/CD automates the build of your code from a repo along with the deployment (release) of the built code artifacts to a service or set of services in Azure Government. In this tutorial, you'll build a web app and deploy it to an Azure Governments app service. This build and release process is triggered by a change to a code file in the repo.

[Azure Pipelines](/azure/devops/pipelines/get-started/what-is-azure-pipelines) is used by teams to configure continuous deployment for applications hosted in Azure subscriptions. We can use this service for applications running in Azure Government by defining [service connections](/azure/devops/pipelines/library/service-endpoints) for Azure Government. 

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

Before starting this tutorial, you must complete the following prerequisites:

+ [Create an organization in Azure DevOps](/azure/devops/organizations/accounts/create-organization)
+ [Create and add a project to the Azure DevOps organization](/azure/devops/organizations/projects/create-project?;bc=%2fazure%2fdevops%2fuser-guide%2fbreadcrumb%2ftoc.json&tabs=new-nav&toc=%2fazure%2fdevops%2fuser-guide%2ftoc.json)
+ Install and set up [Azure PowerShell](/powershell/azure/install-az-ps)

If you don't have an active Azure Government subscription, create a [free account](https://azure.microsoft.com/global-infrastructure/government/request/) before you begin.

## Create Azure Government app service 

[Create an App service in your Azure Government subscription](documentation-government-howto-deploy-webandmobile.md). 
The following steps will set up a CD process to deploy to this Web App. 

## Set up Build and Source control integration

Follow through one of the quickstarts below to set up a Build for your specific type of app: 

- [ASP.NET 4 app](/azure/devops/pipelines/apps/aspnet/build-aspnet-4)
- [ASP.NET Core app](/azure/devops/pipelines/ecosystems/dotnet-core)
- [Node.js app with Gulp](/azure/devops/pipelines/ecosystems/javascript)

## Generate a service principal 

1. Download or copy and paste the [service principal creation](https://github.com/yujhongmicrosoft/spncreationn/blob/master/spncreation.ps1) PowerShell script into an IDE or editor.

    > [!NOTE]
    > This script will be updated to use the Azure Az PowerShell module instead of the deprecated AzureRM PowerShell module.

2. Open up the file and navigate to the `param` parameter. Replace the `$environmentName` variable with 
AzureUSGovernment." This action sets the service principal to be created in Azure Government.

3. Open your PowerShell window and run the following command. This command sets a policy that enables running local files.

   `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

   When you're asked whether you want to change the execution policy, enter "A" (for "Yes to All").

4. Navigate to the directory that has the edited script above.

5. Edit the following command with the name of your script and run:

   `./<name of script file you saved>`

6. The "subscriptionName" parameter can be found by logging into your Azure Government subscription via `Connect-AzAccount -EnvironmentName AzureUSGovernment` and then running `Get-AzureSubscription`. 

7. When prompted for the "password" parameter, enter your desired password. 

8. After providing your Azure Government subscription credentials, you should see the following message: 

    > [!NOTE]
    > The Environment variable should be `AzureUSGovernment`.

9. After the script has run, you should see your service connection values. Copy these values as we'll need them when setting up our endpoint.

   ![ps4](./media/documentation-government-vsts-img11.png)

## Configure the Azure Pipelines service connection

Follow the instructions in [Service connections for builds and releases](/azure/devops/pipelines/library/service-endpoints) to set up the Azure Pipelines service connection. 

Make one change specific to Azure Government: In step #3 of [Service connections for builds and releases](/azure/devops/pipelines/library/service-endpoints), click on "use the full version of the service connection catalog" and set **Environment** to **AzureUSGovernment**.

## Define a release process

Follow [Deploy a web app to Azure App Services](/azure/devops/pipelines/apps/cd/deploy-webdeploy-webapps) instructions to set up your release pipeline and deploy to your application in Azure Government.

## Q&A

**Do I need a build agent?** <br/>
You need at least one [agent](/azure/devops/pipelines/agents/agents) to run your deployments. By default, the build and deployment processes are configured to use the [hosted agents](/azure/devops/pipelines/agents/agents#microsoft-hosted-agents). Configuring a private agent would limit data sharing outside of Azure Government.

**I use Team Foundation Server on premises. Can I configure CD on my server to target Azure Government?** <br/>
Currently, Team Foundation Server can't be used to deploy to an Azure Government Cloud.

## Next steps

- Subscribe to the [Azure Government blog](https://devblogs.microsoft.com/azuregov/)
- Get help on Stack Overflow by using the "[azure-gov](https://stackoverflow.com/questions/tagged/azure-gov)" tag
