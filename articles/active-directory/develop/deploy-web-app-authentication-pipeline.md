---
title: Deploy a web app with authentiation in a pipeline
description: Describes how to deploy a web app to Azure App Service and enable Azure App Service authentication in Azure Pipelines.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.custom: 
ms.topic: how-to
ms.date: 07/07/2023
ms.author: ryanwi
ms.reviewer: mahender
---

# Deploy a web app in a pipeline and configure authentication

Set up a multi-stage continuous integration/continuous deployment (CI/CD) pipeline that automates the process of deploying your application.  Your pipeline will automatically trigger a build when code changes are made and promote changes through various environments.

Configure authentication and authorization for Azure App Service in a continuous integration/continuous deployment (CI/CD) pipeline. Create an Azure AD app registration as an identity for your web app and configure redirect URI, home page URI, and issuer settings for App Service Authentication.

After completing this article, you'll be able to:

1. Create an identity for your web app using an Azure AD app registration in Azure Pipelines
1. Configure Azure App Service authentication to enable user sign-in in Azure Pipelines.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure DevOps organization. [Create one for free](/azure/devops/pipelines/get-started/pipelines-sign-up).
- An ability to run pipelines on Microsoft-hosted agents. You can either purchase a [parallel job](https://learn.microsoft.com/en-us/azure/devops/pipelines/licensing/concurrent-jobs) or you can request a free tier.
- An Azure Active Directory [tenant](azure/active-directory/develop/quickstart-create-new-tenant).
- A [GitHub username](https://github.com), Git is [setup locally](https://docs.github.com/en/get-started/quickstart/set-up-git).

## Create and clone a repo in GitHub

[Create a new repo](https://docs.github.com/en/get-started/quickstart/create-a-repo?tool=webui) in GitHub, specify a name like "PipelinesTest".  Add a .gitignore file with **.getignore template: VisualStudio**.

Open a terminal window and change the current working directory to the location where you want the cloned directory:

```
cd c:\temp\
```

Enter the following command to clone the repo:

```
git clone https://github.com/YOUR-USERNAME/PipelinesTest
cd PipelinesTest
```

## Create an ASP.NET web app

1. Open a terminal window on your machine to a working directory. Create a new .NET web app using the [dotnet new webapp](/dotnet/core/tools/dotnet-new#web-options) command, and then change directories into the newly created app.

```dotnetcli
dotnet new webapp -n PipelinesTest --framework net7.0
cd PipelinesTest
```

From the same terminal session, run the application locally using the dotnet run command.

```dotnetcli
dotnet run --urls=https://localhost:5001/
```

Open a web browser, and navigate to the app at `https://localhost:5001`.

You see the template ASP.NET Core 7.0 web app displayed in the page.

Enter CTRL-C to stop running the web app.

## Push the sample to GitHub

Commit your changes and push to GitHub:

```
git add .
git commit -m "Initial check-in"
git push origin main
```

## Set up your Azure DevOps environment

1. Add a user to Azure DevOps
Create a new project:

1. Select **New project**.
1. Enter a **Project name**, such as "PipelinesTest".
1. Select **Private** visibility.
1. Select **Create**.

Add a service connection:

1. Select **Project settings**.
1. In the left navigation pane, select **Service connections** and then **Create service connection**.
1. Select **Azure Resource Manager** and then **Next**.
1. Select **Service principal (automatic)** and then **Next**.
1. Select **Subscription** for **scope level** and select your subscription.  Enter a service connection name such as "PipelinesTextServiceConnetion" and select **Next**.
        
## Create the pipeline

1. Go to **Pipelines**, and then select **Create Pipeline**.
1. Select **GitHub  YAML**.  

1. On the **Connect** tab, select GitHub. When prompted, enter your GitHub credentials.

1. When the list of repositories appears, select your `PipelinesTest` repository.

1. You might be redirected to GitHub to install the Azure Pipelines app. If so, select **Approve & install**.
1. In **Configure your pipeline**, select the **Starter pipeline**.

1. When the **Configure** tab appears, select **ASP.NET Core**.

1. A new pipeline with a very basic configuration appears. The default configuration uses a Microsoft-hosted agent.

    ```yml
    # Starter pipeline
    # Start with a minimal pipeline that you can customize to build and deploy your code.
    # Add steps that build, run tests, deploy, and more:
    # https://aka.ms/yaml
    
    trigger:
    - main
    
    pool:
      vmImage: ubuntu-latest
    
    steps:
    - script: echo Hello, world!
      displayName: 'Run a one-line script'
    
    - script: |
        echo Add other tasks to build, test, and deploy your project.
        echo See https://aka.ms/yaml
      displayName: 'Run a multi-line script'
    ```

1. When you're ready, select **Save and run**. To commit your changes to GitHub and start the pipeline, choose Commit directly to the main branch and select Save and run a second time. If prompted to grant permission with a message like **This pipeline needs permission to access a resource before this run can continue**, choose **View** and follow the prompts to permit access.

Under **Jobs**, select **Job**. Next, trace the build process through each of the steps. To see the job output as a text file when the build completes, you can also select **View** raw log.

## Add a variable group

Add a variable group and varialbes to the pipeline.  Select **Library** in the left navigation pane and create a new **Variable group**.

Give it the name "AzureResourcesVariableGroup".  Add the following variables and values:

| Variable name | Value |
| --- | --- |
| KEYVAULTNAME | pipelinetestwebapp |
| LOCATION | centralus |
| PIPELINESPID | app-id|
| RESOURCEGROUPNAME | pipelinetestgroup |
| SVCPLANNAME | pipelinetestplan |
| TENANTID |  tenant-id|
| TESTCLIENNAME | pipelinetestclient |
| TESTUSERNAME | testuser123 |
| WEBAPPNAMETEST | pipelinetestwebapp |

Select **Save**.

Give the pipeline permissions to access the variable group.  Select **Pipeline permissions**, add your pipeline, and then close the window.

## Build and deploy the web app to Azure App Service

1. Create/update pipeline variables
1. Deploy the web app to Azure App Service
1. See the deployed website on App Service
    
## Configure Azure App Service authentication in Azure Pipelines

1. Create an Azure AD app registration as an identity for your web app.
1. Get a secret from the app for App Service authentication
1. Configure secret setting for App Service web app
1. Configure redirect URI, home page URI, and issuer settings for App Service Authentication
1. Deploy the web app to Azure App Service and verify user sign in

## Next steps


