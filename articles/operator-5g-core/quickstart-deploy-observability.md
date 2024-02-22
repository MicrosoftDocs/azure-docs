---
title: Deploy Azure Operator 5G Core observability on Azure Kubernetes Services
description: Learn the high-level process to deploy Azure Operator 5G Core observability on Azure Kubernetes Services.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-5g-core
ms.topic: quickstart #required; leave this attribute/value as-is
ms.date: 02/22/2024

#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.
---

# Quickstart: Deploy Azure Operator 5G Core observability on Azure Kubernetes Services (AKS) or Nexus Azure Kubernetes Services (NAKS)

Use the following Azure CLI commands to deploy observability resources for Azure Operator 5G Core.

## Deploy observability


```azurecli
New-AzResourceGroupDeployment ` 

-Name <DEPLOYMENT NAME> ` 

-ResourceGroupName <RESOURCE GROUP> ` 

-TemplateFile ./releases/2311.0-1/AKS/bicep/obsvTemplate.bicep ` 

-TemplateParameterFile ./releases/2311.0-1/AKS/params/obsvParams.json ` 

-resourceName <RESOURCE NAME> –Verbose
```

## Next step

- [Deploy a network function on Azure Kubernetes Services (AKS)](quickstart-deploy-network-functions.md)