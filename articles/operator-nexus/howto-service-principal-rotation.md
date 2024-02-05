---
title: Azure Operator Nexus service principal rotation
description: Instructions on Service Principal Rotation Lifecycle Management.
ms.service: azure-operator-nexus
ms.custom: template-how-to
ms.topic: how-to
ms.date: 02/05/2024
author: sbatchu0108
ms.author: sbatchu
---

# Credential rotation management for on-premises devices

This document provides an overview on the process of performing service principal rotation on the target cluster.

## Prerequisites

1. Target cluster and fabric must be in running and healthy state.
1. Service Principal rotation should be performed prior to the configured credentials expiring.
1. Service Principal should have owner privilege on the subscription of the target cluster.

## Appending secondary credential to the existing service principal

List existing credentials info for the service principal

```azurecli
az ad app credential list --id "<SP Application (client) ID>"
```

Append secondary credential to the service principal. Please store the resulting generated password somewhere safe.

```azurecli
az ad app credential reset --id "<SP Application (client) ID>" --append --display-name "<human-readable description>"
```
## Creating new service principal

New service principal should have owner privilege scope on the target cluster subscription.

```azurecli
az ad sp create-for-rbac -n "<service principal display name>" --role owner --scopes /subscriptions/<subscription-id>
```

## Rotating service principal on the target cluster

Service principal can be rotated on the target cluster by supplying the new information which can either be only secondary credential update or it could be the new service principal for the target cluster.

```azurecli
az networkcloud cluster update --resource-group "<resourceGroupName>" --cluster-service-principal application-id="<sp app id>" password="<cleartext password>" principal-id="<sp id>" tenant-id="<tenant id>" -n <cluster name> --subscription <subscription-id>
```

> [!NOTE]
> Ensure you're using the correct service principal ID(object ID in Azure) when updating it. There are two different object IDs retrievable from Azure for the same Service Principal name, follow these steps to find the right one:
> 1. Avoid retrieving the object ID from the Service Principal of type application that appears when you search for service principal on the Azure portal search bar.
> 1. Instead, search for the service principal name under "Enterprise applications" in Azure Services to find the correct object ID and use it as principal ID.

If you still have questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
For more information about Support plans, see [Azure Support plans](https://azure.microsoft.com/support/plans/response/).