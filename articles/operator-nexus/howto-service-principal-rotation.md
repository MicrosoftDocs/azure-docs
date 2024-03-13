---
title: Azure Operator Nexus service principal rotation
description: Instructions on service principal rotation lifecycle management.
ms.service: azure-operator-nexus
ms.custom: template-how-to
ms.topic: how-to
ms.date: 02/05/2024
author: sbatchu0108
ms.author: sbatchu
---

# Service principal rotation on the target cluster

This document provides an overview on the process of performing service principal rotation on the target cluster.

## Prerequisites

1. The [Install Azure CLI][installation-instruction] must be installed.
2. The `networkcloud` CLI extension is required.  If the `networkcloud` extension isn't installed, it can be installed following the steps listed [here](https://github.com/MicrosoftDocs/azure-docs-pr/blob/main/articles/operator-nexus/howto-install-cli-extensions.md).
3. Access to the Azure portal for the target cluster.
4. You must be logged in to the same subscription as your target cluster via `az login`
5. Target cluster must be in running and healthy state.
6. Service Principal rotation should be performed prior to the configured credentials expiring.
7. Service Principal should have owner privilege on the subscription of the target cluster.

## Append secondary credential to the existing service principal

List existing credentials info for the service principal

```azurecli
az ad app credential list --id "<SP Application (client) ID>"
```

Append secondary credential to the service principal. Please copy the resulting generated password somewhere safe.

```azurecli
az ad app credential reset --id "<SP Application (client) ID>" --append --display-name "<human-readable description>"
```
## Create a new service principal

New service principal should have owner privilege scope on the target cluster subscription.

```azurecli
az ad sp create-for-rbac -n "<service principal display name>" --role owner --scopes /subscriptions/<subscription-id>
```

## Rotate service principal on the target cluster

Service principal can be rotated on the target cluster by supplying the new information, which can either be only secondary credential update or it could be the new service principal for the target cluster.

```azurecli
az networkcloud cluster update --resource-group "<resourceGroupName>" --cluster-service-principal application-id="<sp app id>" password="<cleartext password>" principal-id="<sp id>" tenant-id="<tenant id>" -n <cluster name> --subscription <subscription-id>
```

## Verify new service principal update on the target cluster

Cluster show will list the new service principal changes if its rotated on the target cluster.

```azurecli
az networkcloud cluster show --name "clusterName" --resource-group "resourceGroup"
```

In the output, you can find the details under `clusterServicePrincipal` property.

```
"clusterServicePrincipal": {
      "applicationId": "<sp application id>",
      "principalId": "<sp principal id>",
      "tenantId": "tenant id"
    }
```

> [!NOTE]
> Ensure you're using the correct service principal ID(object ID in Azure) when updating it. There are two different object IDs retrievable from Azure for the same Service Principal name, follow these steps to find the right one:
> 1. Avoid retrieving the object ID from the Service Principal of type application that appears when you search for service principal on the Azure portal search bar.
> 2. Instead, Search for the service principal name under "Enterprise applications" in Azure Services to find the correct object ID and use it as principal ID.

If you still have questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
For more information about Support plans, see [Azure Support plans](https://azure.microsoft.com/support/plans/response/).