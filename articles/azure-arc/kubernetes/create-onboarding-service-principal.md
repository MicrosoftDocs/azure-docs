---
title: "Create an onboarding service principal for Azure Arc-enabled Kubernetes"
services: azure-arc
ms.service: azure-arc
#ms.subservice: azure-arc-kubernetes coming soon
ms.date: 03/03/2021
ms.topic: article
author: mlearned
ms.author: mlearned
description: "Create an Azure Arc-enabled onboarding service principal "
keywords: "Kubernetes, Arc, Azure, containers"
---

# Create an onboarding service principal for Azure Arc-enabled Kubernetes

## Overview

You can connect Kubernetes clusters to Azure Arc using service principals with limited-privilege role assignments. This capability is useful in continuous integration and continuous deployment (CI/CD) pipelines, like Azure Pipelines and GitHub Actions.

Walk through the following steps to learn how to use service principals for connecting Kubernetes clusters to Azure Arc.

## Create a new service principal

Create a new service principal with an informative name that is unique for your Azure Active Directory tenant.

```console
az ad sp create-for-RBAC --skip-assignment --name "https://azure-arc-for-k8s-onboarding"
```

**Output:**

```console
{
  "appId": "22cc2695-54b9-49c1-9a73-2269592103d8",
  "displayName": "azure-arc-for-k8s-onboarding",
  "name": "https://azure-arc-for-k8s-onboarding",
  "password": "09d3a928-b223-4dfe-80e8-fed13baa3b3d",
  "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db47"
}
```

## Assign permissions

Assign the "Kubernetes Cluster - Azure Arc Onboarding" role to the newly created service principal. This built-in Azure role with limited permissions only allows the principal to register clusters to Azure. The principal with this assigned role cannot update, delete, or modify any other clusters or resources within the subscription.

Given the limited abilities, customers can easily re-use this principal to onboard multiple clusters.

You can limit permissions further by passing in the appropriate `--scope` argument when assigning the role. This allows admins to restrict cluster registration to subscription or resource group scope. The following scenarios are supported by various `--scope` parameters:

| Resource  | `scope` argument| Effect |
| ------------- | ------------- | ------------- |
| Subscription | `--scope /subscriptions/0b1f6471-1bf0-4dda-aec3-111122223333` | Service principal can register cluster in  any resource group under that subscription. |
| Resource Group | `--scope /subscriptions/0b1f6471-1bf0-4dda-aec3-111122223333/resourceGroups/myGroup`  | Service principal can __only__ register clusters in the resource group `myGroup`. |

```console
az role assignment create \
    --role 34e09817-6cbe-4d01-b1a2-e0eac5743d41 \      # this is the id for the built-in role
    --assignee 22cc2695-54b9-49c1-9a73-2269592103d8 \  # use the appId from the new SP
    --scope /subscriptions/<<SUBSCRIPTION_ID>>         # apply the appropriate scope
```

**Output:**

```console
{
  "canDelegate": null,
  "id": "/subscriptions/<<SUBSCRIPTION_ID>>/providers/Microsoft.Authorization/roleAssignments/fbd819a9-01e8-486b-9eb9-f177ba400ba6",
  "name": "fbd819a9-01e8-486b-9eb9-f177ba400ba6",
  "principalId": "ddb0ddb4-ba84-4cde-b936-affc272a4b90",
  "principalType": "ServicePrincipal",
  "roleDefinitionId": "/subscriptions/<<SUBSCRIPTION_ID>>/providers/Microsoft.Authorization/roleDefinitions/34e09817-6cbe-4d01-b1a2-e0eac5743d41",
  "scope": "/subscriptions/<<SUBSCRIPTION_ID>>",
  "type": "Microsoft.Authorization/roleAssignments"
}
```

## Use service principal with the Azure CLI

Reference the newly created service principal with the following commands:

```azurecli
az login --service-principal -u mySpnClientId -p mySpnClientSecret --tenant myTenantID
az connectedk8s connect -n myConnectedClusterName -g myResoureGroupName
```

## Next steps

Govern your cluster configuration [using Azure Policy](./use-azure-policy.md).
