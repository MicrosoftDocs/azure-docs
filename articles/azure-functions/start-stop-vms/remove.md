---
title: Remove Start/Stop VMs v2 overview
description: This article describes how to remove the Start/Stop VMs v2 feature.
services: azure-functions
ms.subservice: start-stop-vms
ms.date: 06/08/2022
ms.topic: conceptual
---

# How to remove Start/Stop VMs v2

After you enable the Start/Stop VMs v2 feature to manage the running state of your Azure VMs, you may decide to stop using it. Removing this feature can be done by deleting the resource group dedicated to store the following resources in support of Start/Stop VMs v2:

- The Azure Functions applications
- Schedules in Azure Logic Apps
- The Application Insights instance
- Azure Storage account

> [!NOTE]
> If you run into problems during deployment, you encounter an issue when using Start/Stop VMs v2, or if you have a related question, you can submit an issue on [GitHub](https://github.com/microsoft/startstopv2-deployments/issues). Filing an Azure support incident from the [Azure support site](https://azure.microsoft.com/support/options/) is not available for this version. 

## Delete the dedicated resource group

To delete the resource group, follow the steps outlined in the [Azure Resource Manager resource group and resource deletion](../../azure-resource-manager/management/delete-resource-group.md) article.

> [!NOTE]
> You might need to manually remove the managed identity associated with the removed Start Stop V2 function app. You can determine whether you need to do this by going to your subscription and selecting **Access Control (IAM)**. From there you can filter by Type: `App Services or Function Apps`. If you find a managed identity that was left over from your removed Start Stop V2 installation, you must remove it. Leaving this managed identity could interfere with future installations. 

## Next steps

To re-deploy this feature, see [Deploy Start/Stop v2](deploy.md).
