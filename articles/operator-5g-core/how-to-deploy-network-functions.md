---
title: Deploy an Azure Operator 5G Core network function
description: Learn the high-level process to deploy an Azure Operator 5G Core network function using Azure CLI commands.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-5g-core
ms.custom: devx-track-azurecli
ms.topic: how-to #required; leave this attribute/value as-is
ms.date: 03/22/2024

#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.
---

# Deploy a network function using Azure CLI

This article shows you how to deploy various network functions, including Session Management Functions (SMF), User Plane Functions (UPF), Network Repository Functions (NRF), Network Slice Selection Functions (NSSF), and Access and Mobility Functions (AMF) in Azure Operator 5G Core Preview. 

## Prerequisites

You must deploy the clusterServices resource before you can deploy any other network function.

See [Quickstart: Deploy Azure Operator 5G Core Preview](quickstart-deploy-5g-core.md) for available network function resources.

## Deploy a network function-Azure CLI

Use the following Azure CLI commands to deploy the network function:

```azurecli
$ export resourceGroupName <Name of resource group> 
$ export templateFile <Path to bicep scripts> 
$ export resourceName <Choose name for the AO5GC resource – note the same resourceName should be used for clusterServices and all associated NFs> 
$ export location <Azure region where resources are deployed> 
$ export templateParamsFile <Path to bicep script parameters file> 

$ az deployment group create  
--resource-group $resourceGroupName \ 
--template-file $templateFile \ 
--parameters resourceName=$resourceName \ 
--parameters locationName=$location \ 
--parameters $templateParamsFile 
```

## Next step

- [Quickstart: Monitor the  status of your Azure Operator 5G Core Preview deployment](quickstart-monitor-deployment-status.md)