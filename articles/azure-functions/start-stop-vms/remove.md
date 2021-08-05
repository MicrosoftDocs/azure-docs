---
title: Remove Start/Stop VMs v2 (preview) overview
description: This article describes how to remove the Start/Stop VMs v2 (preview) feature.
services: azure-functions
ms.subservice: start-stop-vms
ms.date: 06/25/2021
ms.topic: conceptual
---

# How to remove Start/Stop VMs v2 (preview)

After you enable the Start/Stop VMs v2 (preview) feature to manage the running state of your Azure VMs, you may decide to stop using it. Removing this feature can be done by deleting the resource group dedicated to store the following resources in support of Start/Stop VMs v2 (preview):

- The Azure Functions applications
- Schedules in Azure Logic Apps
- The Application Insights instance
- Azure Storage account

> [!NOTE]
> If you run into problems during deployment, you encounter an issue when using Start/Stop VMs v2 (preview), or if you have a related question, you can submit an issue on [GitHub](https://github.com/microsoft/startstopv2-deployments/issues). Filing an Azure support incident from the [Azure support site](https://azure.microsoft.com/support/options/) is not available for this preview version. 

## Delete the dedicated resource group

To delete the resource group, follow the steps outlined in the [Azure Resource Manager resource group and resource deletion](../../azure-resource-manager/management/delete-resource-group.md) article.

## Next steps

To re-deploy this feature, see [Deploy Start/Stop v2](deploy.md) (preview).