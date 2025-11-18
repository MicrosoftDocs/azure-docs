---
title: 'Quickstart: Deploy Your First Container App Using the Azure Portal'
description: Find out how to use the Azure portal to deploy your first application to Azure Container Apps and verify the deployment.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: quickstart
ms.date: 11/12/2025
ms.author: cshoe
ms.custom: mode-ui
# customer intent: As a developer, I want to find out how to deploy my first application to Azure Container Apps so that I can run a containerized app on a serverless platform.
---

# Quickstart: Deploy your first container app using the Azure portal

In this quickstart, you use the Azure portal to create an Azure Container Apps environment and deploy your first container app.

Container Apps provides a way to run microservices and containerized applications on a serverless platform. With Container Apps, you can enjoy the benefits of running containers while leaving behind the concerns of manually configuring cloud infrastructure and complex container orchestrators.

## Prerequisites

- An Azure account with an active subscription. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- The `Microsoft.App` resource provider registered in your Azure subscription.

## Setup

Begin by signing in to the [Azure portal](https://portal.azure.com).

## Create a container app

To create your container app, start at the Azure portal home page.

1. In the top search bar, search for **Container Apps**.

1. In the search results, select **Container Apps**.

1. Select **Create** > **Container App**.

### Configure basic information

On the **Basics** tab, take the following steps:

1. Under **Project details**, take the actions listed in the table:

    | Setting | Action |
    |---|---|
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **Create new** and enter **my-container-apps**. |
    | Container app name |  Enter **my-container-app**. |
    | Optimize for Azure Functions |  Leave the checkbox unselected. Select it only if you want to [create a function app](../container-apps/functions-usage.md). |
    | Deployment source | Select **Container image**. |

1. Under **Container Apps environment**, take the actions listed in the table:

    | Setting | Action |
    |---|---|
    | Region | Select a region near you. |
    | Container Apps environment | Use the default value. |

### Configure container information

1. Select **Next: Container**.

2. Select **Use quickstart image**.

<!-- Deploy the container app -->
[!INCLUDE [container-apps-create-portal-deploy.md](../../includes/container-apps-create-portal-deploy.md)]

3. The following page appears in your browser.

    :::image type="content" source="media/get-started/azure-container-apps-quickstart.png" alt-text="Screenshot of a browser page, with a message about the container app running with a Hello World image, plus other information about container apps.":::

## Clean up resources

If you're not going to continue to use this application, you can delete the container app and all the associated services by removing the resource group.

1. In the Azure portal, go to the **Overview** page for your container app. Under **Essentials**, select the **my-container-apps** resource group.

1. On the resource group **Overview** page, select **Delete resource group**.

1. In the **Delete a resource group** dialog, enter the resource group name, **my-container-apps**.

1. Select **Delete**, and then confirm your selection.

    The process to delete the resource group can take a few minutes to finish.

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next step

> [!div class="nextstepaction"]
> [Communication between microservices](communicate-between-microservices.md)
