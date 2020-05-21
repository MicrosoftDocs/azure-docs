---
title: "Create an Azure Arc-enabled onboarding Service Principal (Preview)"
services: azure-arc
ms.service: azure-arc
#ms.subservice: azure-arc-kubernetes coming soon
ms.date: 05/19/2020
ms.topic: article
author: mlearned
ms.author: mlearned
description: "Create an Azure Arc-enabled onboarding Service Principal "
keywords: "Kubernetes, Arc, Azure, containers"
---

# Create an Azure Arc-enabled onboarding Service Principal (Preview)

## Overview

It is possible to use service principals having a role assignment with limited privileges for onboarding Kubernetes clusters to Azure Arc. This is useful in continuous integration and continuous deployment (CI/CD) pipelines like Azure Pipelines and GitHub Actions.

The following steps provide a walkthrough on using service principals for onboarding Kubernetes clusters to Azure Arc.

## Create a new Service Principal

Create a new Service Principal with an informative name. Note that this name must be unique for your Azure Active Directory tenant:

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

After creating the new Service Principal, assign the "Azure Arc for Kubernetes Onboarding" role to the newly created principal. This is a built-in Azure role with limited permissions, which only allows the principal to register clusters to Azure. The principal cannot update, delete, or modify any other clusters or resources within the subscription.

Given the limited abilities, customers can easily re-use this principal to onboard multiple clusters.

Permissions may be further limited by passing in the appropriate `--scope` argument when assigning the role. This allows customers to restrict cluster registration. The following scenarios are supported by various `--scope` parameters:

| Resource  | `scope` argument| Effect |
| ------------- | ------------- | ------------- |
| Subscription | `--scope /subscriptions/0b1f6471-1bf0-4dda-aec3-111122223333` | Service principal can register any cluster in an existing Resource Group in the given subscription |
| Resource Group | `--scope /subscriptions/0b1f6471-1bf0-4dda-aec3-111122223333/resourceGroups/myGroup`  | Service principal can __only__ register clusters in the Resource Group `myGroup` |

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

## Use Service Principal with the Azure CLI

Reference the newly created Service Principal:

```console
az login --service-principal -u mySpnClientId -p mySpnClientSecret --tenant myTenantID
az connectedk8s connect -n myConnectedClusterName -g myResoureGroupName
```

## Next steps

* [Use Azure Policy to govern cluster configuration](./use-azure-policy.md)
