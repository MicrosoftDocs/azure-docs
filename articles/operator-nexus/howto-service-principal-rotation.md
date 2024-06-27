---
title: Azure Operator Nexus service principal rotation
description: Instructions on service principal rotation lifecycle management.
ms.service: azure-operator-nexus
ms.custom: template-how-to
ms.topic: how-to
ms.date: 03/05/2024
author: sbatchu0108
ms.author: sbatchu
---

# Service Principal rotation on the target Cluster

This document provides an overview on the process of performing Service Principal rotation on the target Nexus cluster.
In alignment with security best practices, a Security Principal should be rotated periodically. Anytime the integrity of the Service Principal is suspected or known to be compromised, it should be rotated immediately.

## Prerequisites

1. The [Install Azure CLI][installation-instruction] must be installed.
2. The `networkcloud` CLI extension is required.  If the `networkcloud` extension isn't installed, it can be installed following the steps listed [here](https://github.com/MicrosoftDocs/azure-docs-pr/blob/main/articles/operator-nexus/howto-install-cli-extensions.md).
3. Access to the Azure portal for the target cluster.
4. You must be logged in to the same subscription as your target cluster via `az login`
5. Target cluster must be in running and healthy state.
6. Service Principal rotation should be performed prior to the configured credentials expiring.
7. Service Principal should have owner privilege on the subscription of the target cluster.

## Append secondary credential to the existing Service Principal

List existing credentials info for the Service Principal

```azurecli
az ad app credential list --id "<SP Application (client) ID>"
```

Append secondary credential to the Service Principal. Please copy the resulting generated password somewhere safe, following best practices.

```azurecli
az ad app credential reset --id "<SP Application (client) ID>" --append --display-name "<human-readable description>"
```
## Create a new Service Principal

New Service Principal should have owner privilege scope on the target Cluster subscription.

```azurecli
az ad sp create-for-rbac -n "<service principal display name>" --role owner --scopes /subscriptions/<subscription-id>
```

## Rotate Service Principal on the target Cluster

Service Principal can be rotated on the target Cluster by supplying the new information, which can either be only secondary credential update or it could be the new Service Principal for the target Cluster.

```azurecli
az networkcloud cluster update --resource-group "<resourceGroupName>" --cluster-service-principal application-id="<sp app id>" password="<cleartext password>" principal-id="<sp id>" tenant-id="<tenant id>" -n <cluster name> --subscription <subscription-id>
```

## Verify new Service Principal update on the target Cluster

Cluster show will list the new Service Principal changes if its rotated on the target Cluster.

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
> Ensure you're using the correct Service Principal ID(object ID in Azure) when updating it. There are two different object IDs retrievable from Azure for the same Service Principal name, follow these steps to find the right one:
> 1. Avoid retrieving the object ID from the Service Principal of type application that appears when you search for service principal on the Azure portal search bar.
> 2. Instead, Search for the service principal name under "Enterprise applications" in Azure Services to find the correct object ID and use it as principal ID.

If you still have questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
For more information about Support plans, see [Azure Support plans](https://azure.microsoft.com/support/plans/response/).
