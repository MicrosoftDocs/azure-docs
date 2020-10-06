---
title: Configure Azure Defender for Storage
titleSuffix: Azure Storage
description: Configure Azure Defender for Storage to detect anomalies in account activity and be notified of potentially harmful attempts to access your account.
services: storage
author: tamram

ms.service: storage
ms.subservice: common
ms.topic: conceptual
ms.date: 09/22/2020
ms.author: tamram
ms.reviewer: ozgun
---

# Configure Azure Defender for Storage

Azure Defender for Storage provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit storage accounts. This layer of protection allows you to address threats without being a security expert or managing security monitoring systems.

Security alerts are triggered when anomalies in activity occur. These security alerts are integrated with [Azure Security Center](https://azure.microsoft.com/services/security-center/), and are also sent via email to subscription administrators, with details of suspicious activity and recommendations on how to investigate and remediate threats.

The service ingests resource logs of read, write, and delete requests to Blob storage and to Azure Files for threat detection. To investigate alerts from Azure Defender, you can view related storage activity using Storage Analytics Logging. For more information, see **Configure logging** in [Monitor a storage account in the Azure portal](storage-monitor-storage-account.md#configure-logging).

## Availability

Azure Defender for Storage is currently available for Blob storage, Azure Files, and Azure Data Lake Storage Gen2. Account types that support Azure Defender include general-purpose v2, block blob, and Blob storage accounts. Azure Defender for Storage is available in all public clouds and US government clouds, but not in other sovereign or Azure Government cloud regions.

Accounts with hierarchical namespaces enabled for Data Lake Storage support transactions using both the Azure Blob storage APIs and the Data Lake Storage APIs. Azure file shares support transactions over SMB.

For pricing details, including a free 30 day trial, see the [Azure Security Center pricing page](https://azure.microsoft.com/pricing/details/security-center/).

The following list summarizes the availability of Azure Defender for Storage:

- Release state:
  - [Blob Storage](https://azure.microsoft.com/services/storage/blobs/) (general availability)
  - [Azure Files](https://docs.microsoft.com/azure/storage/files/storage-files-introduction) (general availability)
  - Azure Data Lake Storage Gen2 (general availability)
- Clouds:<br>
    ✔ Commercial clouds<br>
    ✔ US Gov<br>
    ✘ China Gov, Other Gov

## Set up Azure Defender

You can configure Azure Defender for Storage in any of several ways, described in the following sections.

### [Azure Security Center](#tab/azure-security-center)

When you subscribe to the Standard tier in Azure Security Center, Azure Defender is automatically set up on all of your storage accounts. You can enable or disable Azure Defender for your storage accounts under a specific subscription as follows:

1. Launch **Azure Security Center** in the [Azure portal](https://portal.azure.com).
1. From the main menu, under **Management**, select **Pricing & settings**.
1. Select the subscription for which you want to enable or disable Azure Defender.
1. Select **Azure Defender on** to enable Azure Defender for the subscription.
1. Under **Select Azure Defender plan by resource type**, locate the **Storage** row, and select **Enabled** in the **Plan** column.
1. Save your changes.

    :::image type="content" source="media/azure-defender-storage-configure/enable-azure-defender-security-center.png" alt-text="Screenshot showing how to enable Azure Defender for Storage in Security Center":::

Azure Defender is now enabled for all storage accounts in this subscription.

### [Portal](#tab/azure-portal)

1. Launch the [Azure portal](https://portal.azure.com/).
1. Navigate to your storage account. Under **Settings**, select **Advanced security**.
1. Select **Enable Azure Defender for Storage**.

    :::image type="content" source="media/azure-defender-storage-configure/enable-azure-defender-portal.png" alt-text="Screenshot showing how to enable Azure Defender for an Azure Storage account":::

Azure Defender is now enabled for this storage account.

### [Template](#tab/template)

Use an Azure Resource Manager template to deploy an Azure Storage account with Azure Defender enabled. For more information, see
[Storage account with advanced threat protection](https://azure.microsoft.com/resources/templates/201-storage-advanced-threat-protection-create/).

### [Azure Policy](#tab/azure-policy)

Use an Azure Policy to enable Azure Defender across storage accounts under a specific subscription or resource group.

1. Launch the Azure **Policy - Definitions** page.
1. Search for the **Deploy Azure Defender on Storage Accounts** policy.

    :::image type="content" source="media/azure-defender-storage-configure/storage-atp-policy-definitions.png" alt-text="Apply policy to enable Azure Defender for Storage accounts":::

1. Select an Azure subscription or resource group.

    :::image type="content" source="media/azure-defender-storage-configure/storage-atp-policy2.png" alt-text="Select subscription or resource group for scope of policy ":::

1. Assign the policy.

    :::image type="content" source="media/azure-defender-storage-configure/storage-atp-policy1.png" alt-text="Assign policy to enable Azure Defender for Storage":::

### [REST API](#tab/rest-api)

Use Rest API commands to create, update, or get the Azure Defender setting for a specific storage account.

- [Advanced threat protection - Create](https://docs.microsoft.com/rest/api/securitycenter/advancedthreatprotection/create)
- [Advanced threat protection - Get](https://docs.microsoft.com/rest/api/securitycenter/advancedthreatprotection/get)

### [PowerShell](#tab/azure-powershell)

Use the following PowerShell cmdlets:

- [Enable advanced threat protection](https://docs.microsoft.com/powershell/module/az.security/enable-azsecurityadvancedthreatprotection)
- [Get advanced threat protection](https://docs.microsoft.com/powershell/module/az.security/get-azsecurityadvancedthreatprotection)
- [Disable advanced threat protection](https://docs.microsoft.com/powershell/module/az.security/disable-azsecurityadvancedthreatprotection)

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

:::image type="content" source="media/azure-defender-storage-configure/storage-advanced-threat-protection-alert-email.png" alt-text="Azure Defender for Storage alert email":::

You can review and manage your current security alerts from Azure Security Center's [Security alerts tile](../../security-center/security-center-managing-and-responding-alerts.md). Clicking on a specific alert provides details and actions for investigating the current threat and addressing future threats.

:::image type="content" source="media/azure-defender-storage-configure/storage-advanced-threat-protection-alert.png" alt-text="Azure Defender for Storage alert":::

## Security alerts

Alerts are generated by unusual and potentially harmful attempts to access or exploit storage accounts. For a list of alerts for Azure Storage, see [Alerts for Azure Storage](../../security-center/alerts-reference.md#alerts-azurestorage).

## Next steps

- Learn more about [Logs in Azure Storage accounts](/rest/api/storageservices/About-Storage-Analytics-Logging)
- Learn more about [Azure Security Center](../../security-center/security-center-intro.md)
