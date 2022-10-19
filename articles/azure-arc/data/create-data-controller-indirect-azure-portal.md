---
title: Create an Azure Arc data controller in indirect mode from Azure portal
description: Create an Azure Arc data controller in indirect mode from Azure portal
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Create Azure Arc data controller from Azure portal - Indirect connectivity mode


## Introduction

You can use the Azure portal to create an Azure Arc data controller, in indirect connectivity mode.

Many of the creation experiences for Azure Arc start in the Azure portal even though the resource to be created or managed is outside of Azure infrastructure. The user experience pattern in these cases, especially when there is no direct connectivity between Azure and your environment, is to use the Azure portal to generate a script which can then be downloaded and executed in your environment to establish a secure connection back to Azure. For example, Azure Arc-enabled servers follows this pattern to [create Azure Arc-enabled servers](../servers/onboard-portal.md).

When you use the indirect connect mode of Azure Arc-enabled data services, you can use the Azure portal to generate a notebook for you that can then be downloaded and run in Azure Data Studio against your Kubernetes cluster. 

   [!INCLUDE [use-insider-azure-data-studio](includes/use-insider-azure-data-studio.md)]

When you use direct connect mode, you can provision the data controller directly from the Azure portal. You can read more about [connectivity modes](connectivity.md).

## Use the Azure portal to create an Azure Arc data controller

Follow the steps below to create an Azure Arc data controller using the Azure portal and Azure Data Studio.

1. First, log in to the [Azure portal marketplace](https://portal.azure.com/#blade/Microsoft_Azure_Marketplace/MarketplaceOffersBlade/selectedMenuItemId/home/searchQuery/azure%20arc%20data%20controller).  The marketplace search results will be filtered to show you the 'Azure Arc data controller'.
1. If the first step has not entered the search criteria. Please enter in to the search results, click on 'Azure Arc data controller'.
1. Select the Azure Data Controller tile from the marketplace.
1. Click on the **Create** button.
1. Select the indirect connectivity mode. Learn more about [Connectivity modes and requirements](./connectivity.md). 
1. Review the requirements to create an Azure Arc data controller and install any missing prerequisite software such as Azure Data Studio and kubectl.
1. Click on the **Next: Data controller details** button.
1. Choose a subscription, resource group and Azure location just like you would for any other resource that you would create in the Azure portal. In this case the Azure location that you select will be where the metadata about the resource will be stored.  The resource itself will be created on whatever infrastructure you choose. It doesn't need to be on Azure infrastructure.
1. Enter a name for your data controller.

1. Click the **Open in Azure Studio** button.
1. On the next screen, you will see a summary of your selections and a notebook that is generated.  You can click the **Open link in Azure Data Studio** button to open the generated notebook in Azure Data Studio.
1. Open the notebook in Azure Data Studio and click the **Run All** button at the top.
1. Follow the prompts and instructions in the notebook to complete the data controller creation.

## Monitoring the creation status

Creating the controller will take a few minutes to complete. You can monitor the progress in another terminal window with the following commands:

> [!NOTE]
> The example commands below assume that you created a data controller named `arc-dc` and Kubernetes namespace named `arc`. If you used different values update the script accordingly.

```console
kubectl get datacontroller/arc-dc --namespace arc
```

```console
kubectl get pods --namespace arc
```

You can also check on the creation status of any particular pod by running a command like below.  This is especially useful for troubleshooting any issues.

```console
kubectl describe po/<pod name> --namespace arc

#Example:
#kubectl describe po/control-2g7bl --namespace arc
```

## Troubleshooting creation problems

If you encounter any troubles with creation, please see the [troubleshooting guide](troubleshoot-guide.md).
