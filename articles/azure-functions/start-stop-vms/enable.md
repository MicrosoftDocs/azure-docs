---
title: Enable Start/Stop VMs (preview)
description: This article tells how to enable the Start/Stop VMs (preview) feature for your Azure VMs.
services: azure-functions
ms.subservice: start-stop-vms
ms.date: 03/12/2021
ms.topic: conceptual
---

# Enable Start/Stop VMs (preview)

Perform the steps in this topic in sequence to enable the Start/Stop VMs (preview) feature. After completing the setup process, configure the schedules to customize the feature.

The deployment is initiated from the Start/Stop VMs GitHub organization [here](https://github.com/microsoft/startstopv2-deployments/blob/main/README.md).

1. Select the deployment option based on the Azure cloud environment your Azure VMs are created in. This will open the custom Azure Resouce Manager deployment page in the Azure portal.
1. If prompted, sign in to the [Azure portal](https://portal.azure.com).
1. Enter the following values:

    |Name |Value |
    |-----|------|
    |Region |Select a region near you for new resources.|
    |Resource Group Name |Specify the resource group name that will contain the individual resources for Start/Stop VMs. |
    |Resource Group Region |Specify the region for the resource group. For example, **Central US**.|
    |Azure Function App Name |Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions. |
    |Application Insights Name |Specify the name of your Application Insights instance that will hold the analytics for Start/Stop VMs. |
    |Application Insights Region |Specify the region for the Application Insights instance.|
    |Storage Account Name |Specify the name of the Azure Storage account to store Start/Stop VMs execution telemetry. |
    |Email Address |Specify one or more email addresses to receive status notifications, separated by a comma (,).|

    :::image type="content" source="media/enable/deployment-template-details.png" alt-text="Start/Stop VMs template deployment configuration":::

1. Select **Review + create** on the bottom of the page.
1. Select **Create** to start the deployment.
1. Select the bell icon (notifications) from the top of the screen to see the deployment status. You shall see **Deployment in progress**. Wait until the deployment is completed.
1. Select **Go to resource group** from the notification pane. You shall see a screen similar to:

    :::image type="content" source="media/enable/deployment-template-results.png" alt-text="Start/Stop VMs template deployment resource group":::

## Configure schedule