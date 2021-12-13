---
title: Deploy your first container app with an existing container image in the Azure portal
description: Deploy your first application with an existing container image to Azure Container Apps Preview using the Azure portal.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: quickstart
ms.date: 12/09/2021
ms.author: cshoe
zone_pivot_groups: container-apps-registry-types
---

# Deploy your first container app with an existing container image in the Azure portal

Azure Container Apps Preview enables you to run microservices and containerized applications on a serverless platform. With Container Apps, you enjoy the benefits of running containers while leaving behind the concerns of manually configuring cloud infrastructure and complex container orchestrators.

This article demonstrates how to deploy an existing container to Azure Container Apps using the Azure portal.

> [!NOTE]
> Private registry authorization is supported via registry username and password.

## Prerequisites

- Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
## Setup

Begin by signing in to the [Azure portal](https://portal.azure.com).

## Create a container app

To create your container app, start at the Azure portal home page.

1. Search for **Container Apps** in the top search bar.
1. Select **Container Apps** in the search results.
1. Select the **Create** button.

### Basics Tab

In the *Basics* tab, do the following actions.

#### Enter project details

| Setting | Action |
|---|---|
| Subscription | Select your Azure subscription. |
| Resource group | Select **Create new** and enter **my-container-apps**. |
| Container app name |  Enter **my-container-app**. |

#### Create an Environment

1. In the *Create Container App environment* field, select **Create new**.
1. In the *Create Container App Environment* page on the *Basics* tab, enter the following values:

    | Setting | Value |
    |---|---|
    | Environment name | Enter **my-environment**. |
    | Region | Select **Canada Central**. |

1. Select the **Monitoring** tab to create a Log Analytics workspace.
1. Select **Create new** in the *Log Analytics workspace* field.
1. Enter **my-container-apps-logs** in the *Name* field of the *Create new Log Analytics Workspace* dialog.
  
    The *Location* field is pre-filled with *Canada Central* for you.

1. Select **OK**.
1. Select the **Create** button at the bottom of the *Create Container App Environment* page.
1. Select the **Next: App settings** button at the bottom of the page.

### App Settings Tab

In the *App settings* tab, do the following actions:

::: zone pivot="container-apps-private-registry"
| Setting | Action |
|---|---|
| Use quickstart image | **Uncheck** the checkbox. |
| Name | Enter **my-portal-app**. |
| Image source | Select your container image repository source. If your container is hosted in a registry other than **Azure Container Registry**, select **Docker Hub or other registries**. |
| Registry login server | Enter the domain (including subdomain) of your container registry. |
| Image type | Select **Private**. |
| Registry login server |  |
| Registry user name |  |
| Registry password |  |
| Image and tag |  |
| Image and tag | Enter **/azuredocs/containerapps-helloworld:latest**. |
::: zone-end

::: zone pivot="container-apps-public-registry"
| Setting | Action |
|---|---|
| Use quickstart image | **Uncheck** the checkbox. |
| Name | Enter **my-portal-app**. |
| Image source | Select your container image repository source. If your container is hosted in a registry other than **Azure Container Registry**, select **Docker Hub or other registries**. |
| Registry login server | Enter the domain (including subdomain) of your container registry. |
| Image type | Select **Public**. |
| Image and tag | Enter **/azuredocs/containerapps-helloworld:latest**. |
::: zone-end

#### Application ingress settings

| Setting | Action |
|---|---|
| Ingress | Select **Enabled** or **Disabled**. |

If you enabled ingress, configure the following settings:

| Setting | Action |
| Ingress visibility | Select **Internal** to only allow ingress from other apps in the same virtual network, and select **External** to publicly expose your container app. |
| Target port | Enter the port you want to expose your container app. |

### Deploying the Container App

1. Select the **Review and create** button at the bottom of the page.  

    Next, the settings in the Container App are verified. If no errors are found, the *Create* button is enabled.  

    If there are errors, any tab containing errors is marked with a red dot.  Navigate to the appropriate tab.  Fields containing an error will be highlighted in red.  Once all errors are fixed, select **Review and create** again.

1. Select **Create**.

    A page with the message *Deployment is in progress* is displayed.  Once the deployment is successfully completed, you'll see the message: *Your deployment is complete*.

### View Your deployed application

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
> [Environments in Azure Container Apps](environment.md)
