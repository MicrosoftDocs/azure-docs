---
title: 'Quickstart: Deploy your first container app using the Azure portal'
description: Deploy your first application to Azure Container Apps using the Azure portal.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: quickstart
ms.date: 12/13/2021
ms.author: cshoe
ms.custom: mode-ui, event-tier1-build-2022
---

# Quickstart: Deploy your first container app using the Azure portal

Azure Container Apps enables you to run microservices and containerized applications on a serverless platform. With Container Apps, you enjoy the benefits of running containers while leaving behind the concerns of manually configuring cloud infrastructure and complex container orchestrators.

In this quickstart, you create a secure Container Apps environment and deploy your first container app using the Azure portal.

## Prerequisites

An Azure account with an active subscription is required. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). Also, please make sure to have the Resource Provider "Microsoft.App" registered.

## Setup

<!-- Create -->
[!INCLUDE [container-apps-create-portal-steps.md](../../includes/container-apps-create-portal-steps.md)]

7. Select the **Create** button at the bottom of the *Create Container App Environment* page.

<!-- Deploy the container app -->
[!INCLUDE [container-apps-create-portal-deploy.md](../../includes/container-apps-create-portal-deploy.md)]

### Verify deployment

Select **Go to resource** to view your new container app.  Select the link next to *Application URL* to view your application. You'll see the following message in your browser.

:::image type="content" source="media/get-started/azure-container-apps-quickstart.png" alt-text="Your first Azure Container Apps deployment.":::

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Container Apps instance and all the associated services by removing the resource group.

1. Select the **my-container-apps** resource group from the *Overview* section.
1. Select the **Delete resource group** button at the top of the resource group *Overview*.
1. Enter the resource group name **my-container-apps** in the *Are you sure you want to delete "my-container-apps"* confirmation dialog.
1. Select **Delete**.  
    The process to delete the resource group may take a few minutes to complete.

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Communication between microservices](communicate-between-microservices.md)
