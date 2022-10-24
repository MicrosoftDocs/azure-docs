---
title: Configure Microsoft Defender for Storage
titleSuffix: Azure Storage
description: Configure Microsoft Defender for Storage to detect anomalies in account activity and be notified of potentially harmful attempts to access your account.
services: storage
author: bmansheim

ms.service: storage
ms.subservice: common
ms.topic: how-to
ms.date: 10/24/2022
ms.author: benmansheim
ms.reviewer: ozgun 
ms.custom: devx-track-azurepowershell
---

# Configure Microsoft Defender for Storage

> [!NOTE]
> A new per-storage account pricing plan is now available for Microsoft Defender for Cloud.
>
> In the legacy, per-transaction plan, the cost increases according to the number of analyzed transactions in the storage account. The new per-account plan fixes costs per storage account. Accounts with an exceptionally high transaction volume incur an overage charge.
> 
> For details about the pricing plans, see [Microsoft Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).


**Microsoft Defender for Storage** is an Azure-native layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit your storage accounts. It uses advanced threat detection capabilities and [Microsoft Threat Intelligence](https://go.microsoft.com/fwlink/?linkid=2128684) data to provide contextual security alerts. Those alerts also include steps to mitigate the detected threats and prevent future attacks.

Microsoft Defender for Storage continuously analyzes the transactions of [Azure Blob Storage](https://azure.microsoft.com/services/storage/blobs/), [Azure Data Lake Storage](https://azure.microsoft.com/services/storage/data-lake-storage/), and [Azure Files](https://azure.microsoft.com/services/storage/files/) services. When potentially malicious activities are detected, security alerts are generated. These alerts are displayed in Microsoft Defender for Cloud, with the details of the suspicious activity, appropriate investigation steps, remediation actions, and security recommendations. 

Analyzed transactions of Azure Blob Storage include operation types such as `Get Blob`, `Put Blob`, `Get Container ACL`, `List Blobs`, and `Get Blob Properties`. Examples of analyzed Azure Files operation types include `Get File`, `Create File`, `List Files`, `Get File Properties`, and `Put Range`. 

**Defender for Storage doesn't access the Storage account data and has no impact on its performance.**

Learn more about the [benefits, features, and limitations of Defender for Storage](../defender-for-cloud/defender-for-storage-introduction). You can also learn more about Defender for Storage in the [Defender for Storage episode](../defender-for-cloud/episode-thirteen.md) of the Defender for Cloud in the Field video series.

## Availability

|Aspect|Details|
|----|:----|
|Release state:|General availability (GA)|
|Pricing:|**Microsoft Defender for Storage** is billed as shown on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/)|
|Protected storage types:|[Blob Storage](../storage/blobs/storage-blobs-introduction.md)  (Standard/Premium StorageV2, Block Blobs) <br>[Azure Files](../storage/files/storage-files-introduction.md) (over REST API and SMB)<br>[Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md) (Standard/Premium accounts with hierarchical namespaces enabled)|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure Government<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure China 21Vianet<br>:::image type="icon" source="./media/icons/no-icon.png"::: Connected AWS accounts|

## Set up Microsoft Defender for Storage for the per-transaction pricing plan

> [!NOTE]
> You can only enable the per-account pricing plan at the subscription level.

With the Defender for Storage per-account pricing plan, you can configure Microsoft Defender for Storage on your subscriptions in several ways. When the plan is enabled at the subscription level, Microsoft Defender for Storage is automatically enabled for all your existing and new storage accounts created under that subscription. 

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
1. Navigate to your storage account. Under **Security + networking**, select **Security**.
1. Select **Enable Microsoft Defender for Storage**.

    :::image type="content" source="media/azure-defender-storage-configure/enable-azure-defender-portal.png" alt-text="Screenshot showing how to enable a storage account for Microsoft Defender for Storage.":::

Microsoft Defender for Storage is now enabled for this storage account.

### [Template](#tab/template)

Use an Azure Resource Manager template to deploy an Azure Storage account with Microsoft Defender for Storage enabled. For more information, see [Storage account with advanced threat protection](https://azure.microsoft.com/resources/templates/storage-advanced-threat-protection-create/).

### [Azure Policy](#tab/azure-policy)

Use an Azure Policy to enable Microsoft Defender for Cloud across storage accounts under a specific subscription or resource group.

1. Launch the Azure **Policy - Definitions** page.
1. Search for the **Azure Defender for Storage should be enabled** policy, then select the policy to view the policy definition page.

    :::image type="content" source="media/azure-defender-storage-configure/storage-defender-policy-definitions.png" alt-text="Locate built-in policy to enable Microsoft Defender for Storage for your storage accounts." lightbox="media/azure-defender-storage-configure/storage-defender-policy-definitions.png":::

1. Select the **Assign** button for the built-in policy, then specify an Azure subscription. You can also optionally specify a  resource group to further scope the policy assignment.

    :::image type="content" source="media/azure-defender-storage-configure/storage-defender-policy-assignment.png" alt-text="Select subscription and optionally resource group to scope the policy assignment." lightbox="media/azure-defender-storage-configure/storage-defender-policy-assignment.png":::

1. Select **Review + create** to review the policy definition and then create it with the specified scope.

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

## Set up Microsoft Defender for Storage for the per-account pricing plan

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
1. Navigate to your storage account. Under **Security + networking**, select **Security**.
1. Select **Enable Microsoft Defender for Storage**.

    :::image type="content" source="media/azure-defender-storage-configure/enable-azure-defender-portal.png" alt-text="Screenshot showing how to enable a storage account for Microsoft Defender for Storage.":::

Microsoft Defender for Storage is now enabled for this storage account.

### [Template](#tab/template)

Use an Azure Resource Manager template to deploy an Azure Storage account with Microsoft Defender for Storage enabled. For more information, see [Storage account with advanced threat protection](https://azure.microsoft.com/resources/templates/storage-advanced-threat-protection-create/).

### [Azure Policy](#tab/azure-policy)

Use an Azure Policy to enable Microsoft Defender for Cloud across storage accounts under a specific subscription or resource group.

1. Launch the Azure **Policy - Definitions** page.
1. Search for the **Azure Defender for Storage should be enabled** policy, then select the policy to view the policy definition page.

    :::image type="content" source="media/azure-defender-storage-configure/storage-defender-policy-definitions.png" alt-text="Locate built-in policy to enable Microsoft Defender for Storage for your storage accounts." lightbox="media/azure-defender-storage-configure/storage-defender-policy-definitions.png":::

1. Select the **Assign** button for the built-in policy, then specify an Azure subscription. You can also optionally specify a  resource group to further scope the policy assignment.

    :::image type="content" source="media/azure-defender-storage-configure/storage-defender-policy-assignment.png" alt-text="Select subscription and optionally resource group to scope the policy assignment." lightbox="media/azure-defender-storage-configure/storage-defender-policy-assignment.png":::

1. Select **Review + create** to review the policy definition and then create it with the specified scope.

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

You can review and manage your current security alerts from Microsoft Defender for Cloud's [Security alerts tile](../../defender-for-cloud/managing-and-responding-alerts.md). Select an alert for details and actions for investigating the current threat and addressing future threats.

:::image type="content" source="media/azure-defender-storage-configure/storage-advanced-threat-protection-alert.png" alt-text="Microsoft Defender for Storage alert":::

## Security alerts

Alerts are generated by unusual and potentially harmful attempts to access or exploit storage accounts. For a list of alerts for Azure Storage, see [Alerts for Azure Storage](../../defender-for-cloud/alerts-reference.md#alerts-azurestorage).

## Next steps

- [Introduction to Microsoft Defender for Storage](../../defender-for-cloud/defender-for-storage-introduction.md)
- [Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-cloud-introduction.md)
- [Logs in Azure Storage accounts](/rest/api/storageservices/About-Storage-Analytics-Logging)
