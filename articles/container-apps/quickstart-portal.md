---
title: 'Quickstart: Deploy your first container app using the Azure Portal'
description: Deploy your first application to Azure Container Apps Preview using the Azure Portal.
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic:  quickstart
ms.date: 11/09/2021
ms.author: v-bcatherine
ms.custom: 
---

# Quickstart: Deploy your first container app using the Azure Portal

Azure Container Apps Preview enables you to run microservices and containerized applications on a serverless platform. With Container Apps, you enjoy the benefits of running containers while leaving behind the concerns of manually configuring cloud infrastructure and complex container orchestrators.

In this quickstart, you create a secure Container Apps environment and deploy your first container app using the Azure Portal.

## Prerequisites

An Azure account with an active subscription is required. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Setup

Begin by signing in to the [Azure Portal](https://portal.azure.com).
<!--
Do we need to include steps to login?  Probably not..
-->

## Create a container app

To create a your container app, start at the Azure portal home page.

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

| Setting | Action |
|---|---|
| Use quickstart image | **Uncheck** the checkbox. |
| Name | Enter **my-app**. <!-- I don't know what name to use --> |
| Image source | Select **Docker Hub or other registries**. |
| Image type | Select **Public**. |
| Registry login server | Enter `mcr.microsoft.com`. |  
| Image and tag | Enter **/azuredocs/containerapps-helloworld:latest**. |

#### Application ingress settings

| Setting | Action |
|---|---|
| Ingress | Select **Enabled**. |
| Ingress visibility | Select **External**. |
| Target port | Enter **80**. |

### Deploying the Container App

1. Select the **Review and create** button at the bottom of the page.  

    Next, the settings in the Container App are verified. If no errors are found, the *Create* button is enabled.  

    If there are errors, any tab containing errors is marked with a red dot.  Navigate to the appropriate tab.  Fields containing an error will be highlighted in red.  Once any errors are fixed, select **Review and create** again.

1. Select **Create**.

    A page with the message *Deployment is in progress* is displayed.  Once the deployment is successfully completed, you'll see the message "Your deployment is complete".

### View Your deployed application

Select **Go to resource** to view your Container App details.  Select the *Application URL" to view your running application.  You'll see the following message:

:::image type="content" source="media/get-started/azure-container-apps-quickstart.png" alt-text="Your first Azure Container Apps deployment.":::

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Container Apps instance and all the associated services by removing the resource group.

1. Select the **my-containerapps** resource group from the *my-container-app* page.
1. Select **Delete resource group** on the my-containerapps page.
1. Enter the resource group name **my-containerapps** in the *Are you sure you want to delete "my-containerapps"* dialog.
1. Select **Delete**.  
    It may take a few minutes to complete the deletion.


> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Environments in Azure Container Apps](environment.md)
