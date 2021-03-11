---
title: Create an Azure Arc data controller in the Azure portal
description: Create an Azure Arc data controller in the Azure portal
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 03/02/2021
ms.topic: how-to
---

# Create an Azure Arc data controller in the Azure portal

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Introduction

You can use the Azure portal to create an Azure Arc data controller.

Many of the creation experiences for Azure Arc start in the Azure portal even though the resource to be created or managed is outside of Azure infrastructure. The user experience pattern in these cases, especially when there is no direct connectivity between Azure and your environment, is to use the Azure portal to generate a script which can then be downloaded and executed in your environment to establish a secure connection back to Azure. For example, Azure Arc enabled servers follows this pattern to [create Arc enabled servers](../servers/onboard-portal.md).

For now, given that the preview only supports the Indirect Connected mode of Azure Arc enabled data services, you can use the Azure portal to generate a notebook for you that can then be downloaded and run in Azure Data Studio against your Kubernetes cluster. In the future, when the Directly Connected mode is available, you will be able to provision the data controller directly from the Azure portal. You can read more about [connectivity modes](connectivity.md).

## Use the Azure portal to create an Azure Arc data controller

Follow the steps below to create an Azure Arc data controller using the Azure portal and Azure Data Studio.

1. First, log in to the [Azure portal marketplace](https://ms.portal.azure.com/#blade/Microsoft_Azure_Marketplace/MarketplaceOffersBlade/selectedMenuItemId/home/searchQuery/azure%20arc%20data%20controller).  The marketplace search results will be filtered to show you the 'Azure Arc data controller'.
2. If the first step has not entered the search criteria. Please enter in to the search results, click on 'Azure Arc data controller'.
3. Select the Azure Data Controller tile from the marketplace.
4. Click on the **Create** button.
5. Review the requirements to create an Azure Arc data controller and install any missing prerequisite software such as Azure Data Studio and kubectl.
6. Click on the **Data controller details** button.
7. Choose a subscription, resource group and Azure location just like you would for any other resource that you would create in the Azure portal. In this case the Azure location that you select will be where the metadata about the resource will be stored.  The resource itself will be created on whatever infrastructure you choose. It doesn't need to be on Azure infrastructure.
8. Enter a name for your data controller.
9. Select the connectivity mode for the data controller. Learn more about [Connectivity modes and requirements](./connectivity.md). 

   > [!NOTE] 
   > If you select **direct** connectivity mode,  ensure the Service Principal credentials are set via environment variables as described in [Create service principal](upload-metrics-and-logs-to-azure-monitor.md#create-service-principal). 

1. Select a deployment configuration profile.
1. Click the **Open in Azure Studio** button.
1. On the next screen, you will see a summary of your selections and a notebook that is generated.  You can click the **Download provisioning notebook** button to download the notebook.

   > [!IMPORTANT]
   > On Azure Red Hat OpenShift or Red Hat OpenShift container platform, you must apply the security context constraint before you create the data controller. Follow the instructions at [Apply a security context constraint for Azure Arc enabled data services on OpenShift](how-to-apply-security-context-constraint.md).

1. Open the notebook in Azure Data Studio and click the **Run All** button at the top.
1. Follow the prompts and instructions in the notebook to complete the data controller creation.

## Monitoring the creation status

Creating the controller will take a few minutes to complete. You can monitor the progress in another terminal window with the following commands:

> [!NOTE]
>  The example commands below assume that you created a data controller and Kubernetes namespace with the name 'arc'.  If you used a different namespace/data controller name, you can replace 'arc' with your name.

```console
kubectl get datacontroller/arc --namespace arc
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