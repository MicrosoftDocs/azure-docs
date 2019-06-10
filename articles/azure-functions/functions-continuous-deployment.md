---
title: Continuous deployment for Azure Functions | Microsoft Docs
description: Use the continuous deployment facilities of Azure App Service to publish your functions.
services: functions
documentationcenter: na
author: ggailey777
manager: jeconnoc

ms.assetid: 361daf37-598c-4703-8d78-c77dbef91643
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 09/25/2016
ms.author: glenga
#Customer intent: As a developer, I want to learn how to set up a continuous integration environment so that function app updates are deployed automatically when I check in my code changes.
---

# Continuous deployment for Azure Functions

Azure Functions allows you to deploy your code continuously through [source control integration](functions-deployment-technologies.md#source-control). This enables a workflow where code updates trigger deployment to Azure. If you're new to Azure Functions, get started with the [Azure Functions overview](functions-overview.md).

Continuous deployment is a great option for projects where you're integrating multiple and frequent contributions. It also lets you maintain a single source of truth for your function code. You can configure continuous deployment in Azure Functions from the following source code locations:

* [Azure Repos](https://azure.microsoft.com/services/devops/repos/)
* [GitHub](https://github.com)
* [Bitbucket](https://bitbucket.org/)

The unit of deployment for Azure functions is the function app. This means that all functions in a function app are deployed at the same time. After continuous deployment is enabled, access to function code in the Azure portal is configured as *read-only*, since the source of truth is set to be elsewhere.

## Requirements for continuous deployment

For continuous deployment to succeed, your directory structure must be compatible the following basic folder structure that Azure Functions expects:

[!INCLUDE [functions-folder-structure](../../includes/functions-folder-structure.md)]

## Set up continuous deployment

Use this procedure to configure continuous deployment for an existing function app. These steps demonstrate integration with a GitHub repository, but similar steps apply for Azure Repos or other source code repositories.

1. In your function app in the [Azure portal](https://portal.azure.com), select **Platform features** > **Deployment center**.

    ![Opening the deployment center](./media/functions-continuous-deployment/platform-features.png)

2. On the *Deployment Center*, select **GitHub** for *Source Control*, and click **Authorize**.

    ![Deployment center](./media/functions-continuous-deployment/github.png)

3. Click **Authorize AzureAppService** and click **Continue**.

    ![Authorizing](./media/functions-continuous-deployment/authorize.png)

4. Select **App Service build service** or **Azure Pipelines (Preview)** as your build provider. Select **App Service build service** if you don't need a build or if you need a generic build, select **Azure Pipelines (Preview)** for more control.

    ![Selecting a build provider](./media/functions-continuous-deployment/build.png)

5. Configure information specific to the source control option you specified. For GitHub, you must provide the **Organization**, **Repository**, and **Branch** where your code lives. Then, click **Continue**.

    ![Configuring GitHub](./media/functions-continuous-deployment/github-specifics.png)

6. Finally, review all details and click **Finish** to finalize your continuous deployment.

    ![Summary](./media/functions-continuous-deployment/summary.png)

When this is complete, all code from the specified source is deployed to your app. Any subsequent changes in the deployment source will trigger a deployment of those changes to Azure as well.

## Deployment scenarios

<a name="existing"></a>
### Move existing functions to continuous deployment

If you've already written functions in the [Azure portal](https://portal.azure.com) and wish to download the contents of your app before switching to continuous deployment, you should navigate to the **Overview** tab of your function app, and click the **Download app content** button.

![Downloading app content](./media/functions-continuous-deployment/download.png)

> [!NOTE]
> After you configure continuous integration, you can no longer edit your source files in the Functions portal.

## Next steps

> [!div class="nextstepaction"]
> [Best practices for Azure Functions](functions-best-practices.md)
