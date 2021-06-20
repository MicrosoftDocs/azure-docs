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
ms.date: 10/12/2020
ms.author: yelevin

---
# Set up Azure Sentinel customer-managed key

This article provides background information and steps to configure a customer-managed key (CMK) for Azure Sentinel. CMK enables all data stored in Azure Sentinel to be encrypted in all relevant storage resources with an Azure Key Vault key created and owned by you.

> [!NOTE]
> - The Azure Sentinel CMK capability is provided only to **new workspaces**.
>
> - Onboarding a CMK workspace to Sentinel is supported only via REST API and not via the Azure Portal.
>
> - Once a workspace is onboarded as a CMK workspace, setting it as a non-CMK workspace by de-linking it from the dedicated Log Analytics CMK cluster, or setting the dedicated Log Analytics cluster as non-CMK is not supported and might lead to undefined and undesired behavior.
>
> - Once a workspace was onboarded to Azure Sentinel as a non-CMK workspace, linking it to a CMK Log Analytics cluster, or setting the Log Analytic cluster its currently linked to, as a CMK cluster, is not supported, and will lead to its Azure Sentinel data being encrypted by a Microsoft Managed Key instead of the Customer Managed Key.
>
> - Currently, only System Assigned Identities are supported with Azure Sentinel CMK. Therefore, the dedicated Log Analytics cluster's identity should be of System Assigned type. It is recommended that it will be the identity automatically assigned to the Log Analytics cluster upon its creation.
>
> - Please consult Azure Sentinel's Product Group about any CMK changes to a production workspace or a Log Analytics cluster at azuresentinelCMK@microsoft.com.
>
> - Upon completing the steps in this guide, and prior to using the workspace, please contact azuresentinelCMK@microsoft.com for onboarding confirmation.
>
> - The CMK capability requires a dedicated Log Analytics cluster with 1TB a day or more of reserved capacity. Several workspaces can be linked to the same dedicated cluster, and they will share the same customer managed key.
>
> - You will receive information about additional pricing when you apply to Microsoft to provision CMK on your Azure subscription. Learn more about [Log Analytics dedicated cluster](../azure-monitor/logs/manage-cost-storage.md#log-analytics-dedicated-clusters).

## How CMK works 

The Azure Sentinel solution uses several storage resources for log collection and features, including a Log Analytics dedicated cluster. As part of the Azure Sentinel CMK configuration, you will have to configure the CMK settings on the related Log Analytics dedicated cluster. Data saved by Azure Sentinel in storage resources other than Log Analytics will also be encrypted using the customer managed key configured for the dedicated Log Analytics cluster.

Learn more about [CMK](../azure-monitor/logs/customer-managed-keys.md#customer-managed-key-overview).

> [!NOTE]
> If you enable CMK on Azure Sentinel, any Public Preview feature that does not support CMK will not be enabled.

## Enable CMK 

To provision CMK, follow these steps: 

1.  Create an Azure Key Vault and generate or import a key.

2.  Enable CMK on your Log Analytics workspace.

3.  Register to the Cosmos DB Resource Provider.

4.  Add an access policy to your Azure Key Vault instance.

5.  Onboard the workspace to Azure Sentinel via the onboarding API.

### STEP 1: Create an Azure Key Vault and storing key

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

Onboard the workspace to Azure Sentinel via the Onboarding API. For more information, see [Azure Sentinel Onboarding](quickstart-onboard.md).

## Key Encryption Key revocation or deletion


In the event that a user revokes the key encryption key, either by deleting it or removing access for the dedicated cluster and Cosmos DB Resource Provider, Azure Sentinel will
honor the change and behave as if the data is no longer available, within one hour. At this point, any operation that uses persistent storage resources such as
data ingestion, persistent configuration changes, and incident creation, will be prevented. Previously stored data will not be deleted but will remain
inaccessible. Inaccessible data is governed by the data-retention policy and will be purged in accordance with that policy.

The only operation possible after the encryption key is revoked or deleted is account deletion.

If access is restored after revocation, Azure Sentinel will restore access to the data within an hour.

The way to revoke access is by disabling the customer managed key in the key vault, or deleting the access policy to the key, for both the dedicated Log Analytics cluster and Cosmos DB. Revoking access by removing the key from the dedicated Log Analytics cluster, or by removing the identity associated with the dedicated Log Analytics cluster is not supported.

To understand more about how this works in Azure Monitor, see [Azure Monitor CMK revocation](../azure-monitor/logs/customer-managed-keys.md#key-revocation).

## Customer managed key rotation


Azure Sentinel and Log Analytics support key rotation. When a user performs key rotation in Key Vault, Azure Sentinel supports the new key within an hour.

In Key Vault, you can perform key rotation by creating a new version of the key:

![key rotation](./media/customer-managed-keys/key-rotation.png)

You can disable the previous version of the key after 24 hours, or after the Azure Key Vault audit logs no longer show any activity that uses the previous
version.

After rotating a key, you must explicitly update the dedicated Log Analytics cluster resource in Log
Analytics with the new Azure Key Vault key version. For more information, see [Azure Monitor CMK rotation](../azure-monitor/logs/customer-managed-keys.md#key-rotation).

## Replacing a customer managed key

Azure Sentinel and Log Analytics support replacing a customer managed key. In order to replace the key, create another key in the same key vault or another key vault and configure it according to the key creatin instructions above. Then, update the dedicated Log Analytics cluster with the new key. Sentinel will detect the key change and will use it across all Azure Sentinel's data storage resources within 1 hour.

## Next steps
In this document, you learned how to set up a customer-managed key in Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](./tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
