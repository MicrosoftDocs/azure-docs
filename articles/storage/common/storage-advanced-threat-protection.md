---
title: Advanced Threat Protection for Azure Storage
description: Configure Azure Storage Advanced Threat Protection to detect anomalies in account activity and notify you of potentially harmful attempts to access your account.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 04/03/2019
ms.author: tamram
ms.reviewer: cbrooks
---

# Advanced Threat Protection for Azure Storage

Advanced Threat Protection for Azure Storage provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit storage accounts. This layer of protection allows you to address threats without the need to be a security expert or manage security monitoring systems. 

Security alerts are triggered when anomalies in activity occur.  These security alerts are integrated with [Azure Security Center](https://azure.microsoft.com/services/security-center/), and are also sent via email to subscription administrators, with details of suspicious activity and recommendations on how to investigate and remediate threats.

> [!NOTE]
> * Advanced Threat Protection for Azure Storage is currently available only for the Blob storage.
> * For pricing details, including a free 30 day trial, see the [Azure Security Center pricing page]( https://azure.microsoft.com/pricing/details/security-center/).
> * ATP for Azure storage feature is currently not available in Azure government and sovereign cloud regions.

Advanced Threat Protection for Azure Storage ingests diagnostic logs of read, write, and delete requests to Blob storage for threat detection. To investigate the alerts from Advanced Threat Protection, you can view related storage activity using Storage Analytics Logging. For more information, see how to [configure Storage Analytics logging](storage-monitor-storage-account.md#configure-logging).

## Set up Advanced Threat Protection 

### Using the portal

1. Launch the Azure portal at [https://portal.azure.com](https://portal.azure.com/).

2. Navigate to the configuration page of the Azure Storage account you want to protect. In the **Settings** page, select **Advanced Threat Protection**.

3. In the **Advanced Threat Protection** configuration blade
	* Turn **ON** Advanced *Threat Protection*
	* Click **Save** to save the new or updated Advanced Threat Protection policy. (Prices in the image are for example purposes only.)

![Turn on Azure Storage advanced threat protection](./media/storage-advanced-threat-protection/storage-advanced-threat-protection-turn-on.png)

### Using Azure Security Center

When you subscribe to the Standard tier in Azure Security Center, Advanced Threat Protection is automatically set up on all of your storage accounts. You can enable or disable Advanced Threat Protection for your storage accounts under a specific subscription as follows:

1. Launch **Azure Security Center** in the [Azure portal](https://portal.azure.com).
1. From the main menu, click **Pricing & settings**.
1. Click the subscription that you want to enable or disable threat protection for its storage accounts.

    ![Select subscription](./media/storage-advanced-threat-protection/storage-advanced-threat-protection-subscription.png)

1. Click **Pricing tier**.
1. In the **Select pricing tier by resource type** section, in the **Storage accounts** row, click **Enabled** or **Disabled**.

    ![Enable ATP in Security Center](./media/storage-advanced-threat-protection/storage-advanced-threat-protection-pricing2.png)
1. Click **Save**.

### Using Azure Resource Manager templates

Use an Azure Resource Manager template to deploy an Azure Storage account with Advanced Threat Protection enabled. 
For more information, see
[Storage account with Advanced Threat Protection](https://azure.microsoft.com/resources/templates/201-storage-advanced-threat-protection-create/).

### Using Azure Policy

Use an Azure Policy to enable Advanced Threat Protection across storage accounts under a specific subscription or resource group.

1. Launch the Azure **Policy - Definitions** page.

1. Search for the **Deploy Advanced Threat Protection on Storage Accounts** policy.

     ![Search Policy](./media/storage-advanced-threat-protection/storage-atp-policy-definitions.png)
  
1. Select an Azure subscription or resource group.

    ![Select Subscription Or Group](./media/storage-advanced-threat-protection/storage-atp-policy2.png)

1. Assign the policy.

    ![Policy Definitions Page](./media/storage-advanced-threat-protection/storage-atp-policy1.png)

### Using REST API
Use Rest API commands to create, update, or get the Advanced Threat Protection setting for a specific storage account.

* [Advanced Threat Protection - Create](https://docs.microsoft.com/rest/api/securitycenter/advancedthreatprotection/create)
* [Advanced Threat Protection - Get](https://docs.microsoft.com/rest/api/securitycenter/advancedthreatprotection/get)

### Using Azure PowerShell

Use the following PowerShell cmdlets:

  * [Enable Advanced Threat Protection](https://docs.microsoft.com/powershell/module/az.security/enable-azsecurityadvancedthreatprotection)
  * [Get Advanced Threat Protection](https://docs.microsoft.com/powershell/module/az.security/get-azsecurityadvancedthreatprotection)
  * [Disable Advanced Threat Protection](https://docs.microsoft.com/powershell/module/az.security/disable-azsecurityadvancedthreatprotection)

## Explore security anomalies

When storage activity anomalies occur, you receive an email notification with information about the suspicious security event. Details of the event include:

* The nature of the anomaly
* The storage account name
* The event time
* The storage type
* The potential causes 
* The investigation steps
* The remediation steps


The email also includes details on possible causes and recommended actions to investigate and mitigate the potential threat.

![Azure Storage advanced threat protection alert email](./media/storage-advanced-threat-protection/storage-advanced-threat-protection-alert-email.png)

You can review and manage your current security alerts from Azure Security Center’s [Security alerts tile](../../security-center/security-center-managing-and-responding-alerts.md#managing-security-alerts). Clicking on a specific alert provides details and actions for investigating the current threat and addressing future threats.

![Azure Storage advanced threat protection alert email](./media/storage-advanced-threat-protection/storage-advanced-threat-protection-alert.png)

## Protection alerts

Alerts are generated by unusual and potentially harmful attempts to access or exploit storage accounts. For a list of these alerts, see [Azure Storage](../../security-center/security-center-alerts-data-services.md#azure-storage) alerts

## Next steps

* Learn more about [Logs in Azure Storage accounts](/rest/api/storageservices/About-Storage-Analytics-Logging)

* Learn more about [Azure Security Center](../../security-center/security-center-intro.md)
