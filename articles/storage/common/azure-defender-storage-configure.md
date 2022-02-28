---
title: Configure Microsoft Defender for Storage
titleSuffix: Azure Storage
description: Configure Microsoft Defender for Storage to detect anomalies in account activity and be notified of potentially harmful attempts to access your account.
services: storage
author: tamram

ms.service: storage
ms.subservice: common
ms.topic: conceptual
ms.date: 03/30/2021
ms.author: tamram
ms.reviewer: ozgun 
ms.custom: devx-track-azurepowershell
---

# Configure Microsoft Defender for Storage

Microsoft Defender for Storage provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit storage accounts. This layer of protection allows you to address threats without being a security expert or managing security monitoring systems.

Security alerts are triggered when anomalies in activity occur. These security alerts are integrated with [Microsoft Defender for Cloud](https://azure.microsoft.com/services/security-center/), and are also sent via email to subscription administrators, with details of suspicious activity and recommendations on how to investigate and remediate threats.

The service ingests resource logs of read, write, and delete requests to Blob storage and to Azure Files for threat detection. To investigate alerts from Microsoft Defender for Cloud, you can view related storage activity using Storage Analytics Logging. For more information, see **Configure logging** in [Monitor a storage account in the Azure portal](./manage-storage-analytics-logs.md#configure-logging).

## Availability

Microsoft Defender for Storage is currently available for Blob storage, Azure Files, and Azure Data Lake Storage Gen2. Account types that support Microsoft Defender for Storage include general-purpose v2, block blob, and Blob storage accounts. Microsoft Defender for Storage is available in all public clouds and US government clouds, but not in other sovereign or Azure Government cloud regions.

Accounts with hierarchical namespaces enabled for Data Lake Storage support transactions using both the Azure Blob storage APIs and the Data Lake Storage APIs. Azure file shares support transactions over SMB.

For pricing details, including a free 30 day trial, see the [Microsoft Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/security-center/).

The following list summarizes the availability of Microsoft Defender for Storage:

- Release state:
  - [Blob Storage](https://azure.microsoft.com/services/storage/blobs/) (general availability)
  - [Azure Files](../files/storage-files-introduction.md) (general availability)
  - Azure Data Lake Storage Gen2 (general availability)
- Clouds:
    ✔ Commercial clouds<br>
    ✔ Azure Government<br>
    ✘ Azure China 21Vianet

## Set up Microsoft Defender for Cloud

You can configure Microsoft Defender for Storage in any of several ways, described in the following sections.

### [Microsoft Defender for Cloud](#tab/azure-security-center)

Microsoft Defender for Storage is built into Microsoft Defender for Cloud. When you enable Microsoft Defender for Cloud's enhanced security features on your subscription, Microsoft Defender for Storage is automatically enabled for all of your storage accounts. To enable or disable Defender for Storage for individual storage accounts under a specific subscription:

1. Launch **Microsoft Defender for Cloud** in the [Azure portal](https://portal.azure.com).
1. From Defender for Cloud's main menu, select **Environment settings**.
1. Select the subscription for which you want to enable or disable Microsoft Defender for Cloud.
1. Select **Enable all Microsoft Defender plans** to enable Microsoft Defender for Cloud in the subscription.
1. Under **Select Microsoft Defender plans by resource type**, locate the **Storage** row, and select **Enabled** in the **Plan** column.
1. Save your changes.

    :::image type="content" source="media/azure-defender-storage-configure/enable-azure-defender-security-center.png" alt-text="Screenshot showing how to enable Microsoft Defender for Storage.":::

Microsoft Defender for Storage is now enabled for all storage accounts in this subscription.

### [Portal](#tab/azure-portal)

1. Launch the [Azure portal](https://portal.azure.com/).
1. Navigate to your storage account. Under **Settings**, select **Advanced security**.
1. Select **Enable Microsoft Defender for Storage**.

    :::image type="content" source="media/azure-defender-storage-configure/enable-azure-defender-portal.png" alt-text="Screenshot showing how to enable an account for Microsoft Defender for Storage.":::

Microsoft Defender for Storage is now enabled for this storage account.

### [Template](#tab/template)

Use an Azure Resource Manager template to deploy an Azure Storage account with Microsoft Defender for Storage enabled. For more information, see [Storage account with advanced threat protection](https://azure.microsoft.com/resources/templates/storage-advanced-threat-protection-create/).

### [Azure Policy](#tab/azure-policy)

Use an Azure Policy to enable Microsoft Defender for Cloud across storage accounts under a specific subscription or resource group.

1. Launch the Azure **Policy - Definitions** page.
1. Search for the **Deploy Microsoft Defender for Storage accounts** policy.

    :::image type="content" source="media/azure-defender-storage-configure/storage-atp-policy-definitions.png" alt-text="Apply policy to enable Microsoft Defender for Storage accounts":::

1. Select an Azure subscription or resource group.

    :::image type="content" source="media/azure-defender-storage-configure/storage-atp-policy2.png" alt-text="Select subscription or resource group for scope of policy ":::

1. Assign the policy.

    :::image type="content" source="media/azure-defender-storage-configure/storage-atp-policy1.png" alt-text="Assign policy to enable Microsoft Defender for Storage":::

### [PowerShell](#tab/azure-powershell)

To enable Microsoft Defender for Storage for a storage account via PowerShell, first make sure you have installed the [Az.Security](https://www.powershellgallery.com/packages/Az.Security) module. Next, call the [Enable-AzSecurityAdvancedThreatProtection](/powershell/module/az.security/enable-azsecurityadvancedthreatprotection) command. Remember to replace values in angle brackets with your own values:

```azurepowershell
Enable-AzSecurityAdvancedThreatProtection -ResourceId "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/"
```

To check the Microsoft Defender for Storage setting for a storage account via PowerShell, call the [Get-AzSecurityAdvancedThreatProtection](/powershell/module/az.security/get-azsecurityadvancedthreatprotection) command. Remember to replace values in angle brackets with your own values:

```azurepowershell
Get-AzSecurityAdvancedThreatProtection -ResourceId "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/"
```

### [Azure CLI](#tab/azure-cli)

To enable Microsoft Defender for Storage for a storage account via Azure CLI, call the [az security atp storage update](/cli/azure/security/atp/storage#az-security-atp-storage-update) command. Remember to replace values in angle brackets with your own values:

```azurecli
az security atp storage update \
    --resource-group <resource-group> \
    --storage-account <storage-account> \
    --is-enabled true
```

To check the Microsoft Defender for Storage setting for a storage account via Azure CLI, call the [az security atp storage show](/cli/azure/security/atp/storage#az-security-atp-storage-show) command. Remember to replace values in angle brackets with your own values:

```azurecli
az security atp storage show \
    --resource-group <resource-group> \
    --storage-account <storage-account>
```

---

## Explore security anomalies

When storage activity anomalies occur, you receive an email notification with information about the suspicious security event. Details of the event include:

- The nature of the anomaly
- The storage account name
- The event time
- The storage type
- The potential causes
- The investigation steps
- The remediation steps

The email also includes details on possible causes and recommended actions to investigate and mitigate the potential threat.

:::image type="content" source="media/azure-defender-storage-configure/storage-advanced-threat-protection-alert-email.png" alt-text="Microsoft Defender for Storage alert email":::

You can review and manage your current security alerts from Microsoft Defender for Cloud's [Security alerts tile](../../security-center/security-center-managing-and-responding-alerts.md). Select an alert for details and actions for investigating the current threat and addressing future threats.

:::image type="content" source="media/azure-defender-storage-configure/storage-advanced-threat-protection-alert.png" alt-text="Microsoft Defender for Storage alert":::

## Security alerts

Alerts are generated by unusual and potentially harmful attempts to access or exploit storage accounts. For a list of alerts for Azure Storage, see [Alerts for Azure Storage](../../security-center/alerts-reference.md#alerts-azurestorage).

## Next steps

- [Introduction to Microsoft Defender for Storage](../../security-center/defender-for-storage-introduction.md)
- [Microsoft Defender for Cloud](../../security-center/security-center-introduction.md)
- [Logs in Azure Storage accounts](/rest/api/storageservices/About-Storage-Analytics-Logging)
