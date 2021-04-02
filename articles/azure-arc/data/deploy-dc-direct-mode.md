---
title: Deploy Azure Arc data controller | Direct connect mode
description: Explains how to deploy the data controller in direct connect mode. 
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 03/31/2021
ms.topic: overview
---

#  Deploy Azure Arc data controller | Direct connect mode

This article describes how to deploy the Azure Arc data controller in direct connect mode during the current preview of this feature. 

Currently you can create the Azure Arc data controller from Azure portal. Other tools for Azure Arc enabled data services do not support creating the data controller in direct connect mode. For details, see [Known issues - Azure Arc enabled data services (Preview)](known-issues.md).

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]


## Complete prerequisites

Before you begin, verify that you have completed the prerequisites in [Deploy data controller - direct connected mode - prerequisites](direct-connected-mode-prerequisites.md).

## Create the Azure Arc data controller

After the extension and custom location are created, proceed to Azure portal to deploy the Azure Arc data controller.

1. Log into the Azure Portal.
1. Search for "Azure Arc data controller" in the Azure marketplace and initiate the Create flow.
1. In the **Prerequisites** section, ensure that the Azure Arc enabled Kubernetes cluster (direct mode) is selected and proceed to the next step.
1. In the **Data controller details** section, choose a subscription and resource group.
1. Enter a name for the data controller
1. Choose a configuration profile based on the Kubernetes distribution provider you are deploying to.
1. Choose the Custom Location that you created in the previous step.
1. Provide details for the data controller administrator login and password
1. Provide details for ClientId, TenantId and Client Secret for the Service Principal that would be used to create the Azure objects. [Upload metrics](upload-metrics-and-logs-to-azure-monitor.md) article that has detailed instructions on creating a Service Principal account and the roles that needed to be granted for the account.
1. Click **Next**, review the summary page for all the details and click on **Create**.

## Monitor the creation

When the Azure portal deployment status shows the deployment was successful, you can check the status of the Arc data controller deployment on the cluster as follows:

```console
kubectl get datacontrollers -n arc
```