---
title: Set up customer-managed keys in Azure Sentinel| Microsoft Docs
description: Learn how to set up customer-managed keys (CMK) in Azure Sentinel.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/01/2021
ms.author: yelevin

---
# Set up Azure Sentinel customer-managed key

This article provides background information and steps to configure a [customer-managed key (CMK)](../azure-monitor/logs/customer-managed-keys.md) for Azure Sentinel. CMK allows you to give all data stored in Azure Sentinel - already encrypted by Microsoft in all relevant storage resources - an extra layer of protection with an encryption key created and owned by you and stored in your [Azure Key Vault](../key-vault/general/overview.md).

## Prerequisites

- The CMK capability requires a Log Analytics dedicated cluster with at least a 1 TB/day commitment tier. Several workspaces can be linked to the same dedicated cluster, and they will share the same customer-managed key.

- After you complete the steps in this guide and before you use the workspace, for onboarding confirmation, contact the [Azure Sentinel Product Group](mailto:azuresentinelCMK@microsoft.com).

- Learn about [Log Analytics Dedicated Cluster Pricing](../azure-monitor/logs/logs-dedicated-clusters.md#cluster-pricing-model).

## Considerations

- Onboarding a CMK workspace to Sentinel is supported only via REST API, and not via the Azure portal. Azure Resource Manager templates (ARM templates) currently aren't supported for CMK onboarding.

- The Azure Sentinel CMK capability is provided only to *workspaces in Log Analytics dedicated clusters* that have *not already been onboarded to Azure Sentinel*.

- The following CMK-related changes *are not supported* because they will be ineffective (Azure Sentinel data will continue to be encrypted only by the Microsoft-managed key, and not by the CMK):

  - Enabling CMK on a workspace that's *already onboarded* to Azure Sentinel.
  - Enabling CMK on a cluster that contains Sentinel-onboarded workspaces.
  - Linking a Sentinel-onboarded non-CMK workspace to a CMK-enabled cluster.

- The following CMK-related changes *are not supported* because they may lead to undefined and problematic behavior:

  - Disabling CMK on a workspace already onboarded to Azure Sentinel.
  - Setting a Sentinel-onboarded, CMK-enabled workspace as a non-CMK workspace by de-linking it from its CMK-enabled dedicated cluster.
  - Disabling CMK on a CMK-enabled Log Analytics dedicated cluster.

- Azure Sentinel supports System Assigned Identities in CMK configuration. Therefore, the dedicated Log Analytics cluster's identity should be of **System Assigned** type. We recommend that you use the identity that's automatically assigned to the Log Analytics cluster when it's created.

- Changing the customer-managed key to another key (with another URI) currently *isn't supported*. You should change the key by [rotating it](../azure-monitor/logs/customer-managed-keys.md#key-rotation).

- Before you make any CMK changes to a production workspace or to a Log Analytics cluster, contact the [Azure Sentinel Product Group](mailto:azuresentinelCMK@microsoft.com).

## How CMK works 

The Azure Sentinel solution uses several storage resources for log collection and features, including a Log Analytics dedicated cluster. As part of the Azure Sentinel CMK configuration, you will have to configure the CMK settings on the related Log Analytics dedicated cluster. Data saved by Azure Sentinel in storage resources other than Log Analytics will also be encrypted using the customer-managed key configured for the dedicated Log Analytics cluster.

See the following additional relevant documentation:
- [Azure Monitor customer-managed keys (CMK)](../azure-monitor/logs/customer-managed-keys.md).
- [Azure Key Vault](../key-vault/general/overview.md).
- [Log Analytics dedicated clusters](../azure-monitor/logs/logs-dedicated-clusters.md).

> [!NOTE]
> If you enable CMK on Azure Sentinel, any Public Preview feature that does not support CMK will not be enabled.

## Enable CMK 

To provision CMK, follow these steps: 

1.  Create an Azure Key Vault and generate or import a key.

2.  Enable CMK on your Log Analytics workspace.

3.  Register to the Cosmos DB Resource Provider.

4.  Add an access policy to your Azure Key Vault instance.

5.  Onboard the workspace to Azure Sentinel via the [Onboarding API](https://github.com/Azure/Azure-Sentinel/raw/master/docs/Azure%20Sentinel%20management.docx).

### STEP 1: Create an Azure Key Vault and generate or import a key

1.  [Create Azure Key Vault resource](/azure-stack/user/azure-stack-key-vault-manage-portal),
    then generate or import a key to be used for data encryption.
    > [!NOTE]
    >  Azure Key Vault must be configured as recoverable to protect your key and the access.

1.  [Turn on recovery options:](../key-vault/general/key-vault-recovery.md)

    -   Make sure [Soft Delete](../key-vault/general/soft-delete-overview.md) is turned on.

    -   Turn on [Purge protection](../key-vault/general/soft-delete-overview.md#purge-protection) to guard against forced deletion of the secret/vault even after soft delete.

### STEP 2: Enable CMK on your Log Analytics workspace

Follow the instructions in [Azure Monitor customer-managed key configuration](../azure-monitor/logs/customer-managed-keys.md) in order to create a CMK workspace that will be used as the Azure Sentinel workspace in the following steps.

### STEP 3: Register to the Cosmos DB Resource Provider

Azure Sentinel works with Cosmos DB as an additional storage resource. Make sure to register to the Cosmos DB Resource Provider.

Follow the Cosmos DB instruction to [Register the Azure Cosmos DB Resource Provider](../cosmos-db/how-to-setup-cmk.md#register-resource-provider) resource provider for your Azure subscription.

### STEP 4: Add an access policy to your Azure Key Vault instance

Make sure to add access from Cosmos DB to your Azure Key Vault instance. Follow the Cosmos DB instruction to [add an access policy to your Azure Key Vault instance](../cosmos-db/how-to-setup-cmk.md#add-access-policy) with Azure Cosmos DB principal.

### STEP 5: Onboard the workspace to Azure Sentinel via the onboarding API

Onboard the workspace to Azure Sentinel via the [Onboarding API](https://github.com/Azure/Azure-Sentinel/raw/master/docs/Azure%20Sentinel%20management.docx).

## Key Encryption Key revocation or deletion

In the event that a user revokes the key encryption key (the CMK), either by deleting it or removing access for the dedicated cluster and Cosmos DB Resource Provider, Azure Sentinel will honor the change and behave as if the data is no longer available, within one hour. At this point, any operation that uses persistent storage resources such as data ingestion, persistent configuration changes, and incident creation, will be prevented. Previously stored data will not be deleted but will remain inaccessible. Inaccessible data is governed by the data-retention policy and will be purged in accordance with that policy.

The only operation possible after the encryption key is revoked or deleted is account deletion.

If access is restored after revocation, Azure Sentinel will restore access to the data within an hour.

Access to the data can be revoked by disabling the customer-managed key in the key vault, or deleting the access policy to the key, for both the dedicated Log Analytics cluster and Cosmos DB. Revoking access by removing the key from the dedicated Log Analytics cluster, or by removing the identity associated with the dedicated Log Analytics cluster is not supported.

To understand more about how this works in Azure Monitor, see [Azure Monitor CMK revocation](../azure-monitor/logs/customer-managed-keys.md#key-revocation).

## Customer-managed key rotation

Azure Sentinel and Log Analytics support key rotation. When a user performs key rotation in Key Vault, Azure Sentinel supports the new key within an hour.

In Key Vault, you can perform key rotation by creating a new version of the key:

![key rotation](./media/customer-managed-keys/key-rotation.png)

You can disable the previous version of the key after 24 hours, or after the Azure Key Vault audit logs no longer show any activity that uses the previous version.

After rotating a key, you must explicitly update the dedicated Log Analytics cluster resource in Log Analytics with the new Azure Key Vault key version. For more information, see [Azure Monitor CMK rotation](../azure-monitor/logs/customer-managed-keys.md#key-rotation).

## Replacing a customer-managed key

Azure Sentinel does not support replacing a customer-managed key. You should use the [key rotation capability](#customer-managed-key-rotation) instead.

## Next steps
In this document, you learned how to set up a customer-managed key in Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](./detect-threats-built-in.md).
- [Use workbooks](/azure/sentinel/articles/sentinel/monitor-your-data.md) to monitor your data.