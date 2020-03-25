---
title: Configure customer-managed-keys using the Azure portal
description: This article describes how to configure customer-managed keys encryption on your data in Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: itsagui
ms.service: data-explorer
ms.topic: conceptual
ms.date: 03/25/2020
---

# Configure customer-managed-keys using the Azure Portal

> [!div class="op_single_selector"]
> * [Portal](customer-managed-keys-portal.md)
> * [C#](customer-managed-keys-csharp.md)
> * [Azure Resource Manager template](customer-managed-keys-resource-manager.md)

[!INCLUDE [data-explorer-configure-customer-managed-keys](../../includes/data-explorer-configure-customer-managed-keys.md)]

## Enable customer-managed keys in the Azure Portal

This section shows you how to enable customer-managed keys encryption using the Azure portal. 

### Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* [A cluster and database](create-cluster-database-portal.md).
* [Configure managed identities for your Azure Data Explorer cluster](managed-identities.md)

### Configure cluster

By default, Azure Data Explorer encryption uses Microsoft-managed keys. Configure your Azure Data Explorer cluster to use customer-managed keys and specify the key to associate with the cluster.

Configure encryption with customer-managed keys

You can configure customer-managed keys for your Azure Data Explorer cluster.
1. In the Azure portal, go to your Azure Data Explorer cluster resource. Under the Settings heading, select Encryption.
2. In the Encryption window, select **On** for the Customer-managed key setting.
3. Click Select Key

![Show databases command](media/customer-managed-key-portal/.png)

4. In the **Select key from Azure Key Vault** screen you can either create a new Key Vault or select an existing one.
    1. If you choose to create a new Key Vault you'll be routed to the **Create Key Vault** screen where you can create a new Key Vault resource following these instructions. (link to create a key vault)
    2. If you choose an existing Key Vault you need to either create a new key select an existing key.
    3. Once you have a key you need to select a version.
5. Either select **Key** or **create new** ?from Azure Key Vault screen.
1. Select **Version**.
1. Click **Select**
6. Select Save.

## screenshot

By enabling customer-managed key for your Azure Data Explorer cluster behind the scenes you'll be creating a system assigned identity for the cluster if it does not have one.
In addition you'll be providing the required view permissions to Azure Data Explorer cluster on the selected Key Vault and get the Key Vault properties. (see c# doc)
(3 steps done as part of process)

when CMK creation succeeds, get success message in notification.

Note
Select **Off** to remove the customer managed key after it has been created.

## Update the key version

When you create a new version of a key, you'll need to update the cluster to use the new version. First, call `Get-AzKeyVaultKey` to get the latest version of the key. Then update the cluster's key vault properties to use the new version of the key, as shown in [Configure cluster](#configure-cluster).

## Next steps

* [Secure Azure Data Explorer clusters in Azure](security.md)
* [Secure your cluster in Azure Data Explorer - Azure portal](manage-cluster-security.md) by enabling encryption at rest.
* [Configure customer-managed-keys using the Azure Resource Manager template](customer-managed-keys-resource-manager.md)
* [Configure customer-managed-keys using C#](customer-managed-keys-csharp.md)



