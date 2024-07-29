---
title: Deploy Azure Operator 5G Core observability(preview) on Azure Kubernetes Services
description: Learn the high-level process to deploy Azure Operator 5G Core observability (preview) on Azure Kubernetes Services.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-5g-core
ms.topic: how-to #required; leave this attribute/value as-is
ms.date: 02/22/2024

#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.
---

# Deploy Azure Operator 5G Core Preview observability services

Use the following Azure CLI commands to deploy observability resources for Azure Operator 5G Core Preview.

> [!IMPORTANT]
> You must deploy the clusterServices resource before deploying observability services. 

## Deploy observability

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
-- verbose 
```

## Next step

- [Deploy an Azure Operator 5G Core network function](how-to-deploy-network-functions.md)