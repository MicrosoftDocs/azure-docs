---
title: 'Quickstart: Deploy an Existing Container Image in the Azure Portal'
description: Deploy an existing container image to Azure Container Apps by using the Azure portal.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: quickstart
ms.date: 03/26/2026
ms.author: cshoe
---

# Quickstart: Deploy an existing container image in the Azure portal

Azure Container Apps allows you to run microservices and containerized applications on a serverless platform. With Container Apps, you enjoy the benefits of running containers while leaving behind the concerns of manually configuring cloud infrastructure and complex container orchestrators.

This article demonstrates how to deploy an existing container to Azure Container Apps by using the Azure portal.

> [!NOTE]
> Private registry authorization is supported via registry username and password.

## Prerequisites

- An Azure account with an active subscription. If you don't have one, you can [create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

## Create a container app

To create your container app, start at the Azure portal home page.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Container Apps** in the search bar.

1. Select the **Create** button, then choose **+ Container App**.

### Basics tab

On the **Basics** tab, enter the following information:

| Setting | Action |
|---|---|
| Subscription | Select your Azure subscription. |
| Resource group | Select **Create new** and enter *my-container-apps*. |
| Container app name | Enter *my-container-app*. |
| Optimize for Azure Functions | Leave the checkbox unchecked. |
| Deployment source | Select **Container image**. |
| Region | Select **Canada Central**. |
| Container Apps environment | Accept the default. |

Select **Next: Container**.

### Container tab

On the **Container** tab, enter the following information:

| Setting | Action |
|---|---|
| Use quickstart image | Uncheck the checkbox. |
| Name | Enter *my-portal-app*. |
| Image source | Select your container image repository source. If your container is hosted in a registry other than **Azure Container Registry**, select **Docker Hub or other registries**. |
| Subscription | Select your Azure subscription. |
| Registry | Select your registry. |
| Image and image tag | Enter the image name, including tag. |

Select **Next: Ingress**.

### Ingress tab

| Setting | Action |
|---|---|
| Ingress | Check or uncheck the checkbox. |

If you checked the box to enable ingress, configure the following settings:

| Setting | Action |
|---|---|
| Ingress traffic | Select **Limited to Container App Environment** to restrict traffic to this container app. Select **Accepting traffic from anywhere** to publicly expose your container app. |
| Target port | Enter the port you want to expose your container app. |

### Deploy the container app

1. Select the **Review and create** button.  

    If no errors are found, the **Create** button is enabled.  

    If there are errors, any tab containing errors is marked with a red dot. Navigate to the appropriate tab. Fields containing an error are highlighted in red. Once all errors are fixed, select **Review and create** again.

1. Select **Create**.

    A page with the message **Deployment is in progress** is displayed. Once the deployment is successfully completed, you see the message: **Your deployment is complete**.

### Verify deployment

You can verify your deployment is successful by querying the Log Analytics workspace. You might need to wait 5 to 10 minutes for the analytics to arrive for the first time before you're able to query the logs.

1. Select **Go to resource** to view your new container app.

1. Under **Monitoring**, select **Logs**.

1. Select **KQL mode** from the menu bar.

1. Enter the following query:

    ```text
    ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'my-container-app' | project ContainerAppName_s, Log_s, TimeGenerated
    ```

1. Select the **Run** button.

1. Inspect the results in the table.

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Container Apps instance and all the associated services by removing the resource group.

1. Select your resource group from the **Overview** section, then select the **Delete resource group** button.

1. Confirm the resource group name, and then select **Delete**. The process to delete the resource group might take a few minutes to complete.

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next step

> [!div class="nextstepaction"]
> [Communication between microservices](communicate-between-microservices.md)
