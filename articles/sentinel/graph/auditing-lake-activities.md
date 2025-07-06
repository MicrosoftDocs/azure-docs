---
title: Search the audit log for events in Microsoft Sentinel data lake
description: Learn how to use the audit log to search for Microsoft Sentinel data lake activities to help with investigation.
ms.service: mircosoft-sentinel
ms.subservice: sentinel-graph
ms.author: edbaynash
author: EdB-MSFT
ms.topic: how-to
ms.date: 07/06/2025

#customer intent: As a SOC analyst, I want to learn how to use the audit log to search for Microsoft Sentinel data lake activities to help with investigation.

---

# Search the audit log for events in Microsoft Sentinel data lake


The audit log helps you investigate specific activities across Microsoft services. In the Microsoft Defender portal, the Microsoft Sentinel data lake activities are audited and can be searched in the audit log. The audit log provides a record of activities that are performed by users and administrators in Microsoft Sentinel data lake, such as:
+ Accessing data in lake via KQL queries
+ Running notebooks on data lake
+ Create/ edit/ run/ delete jobs 
+ Create/ delete graph instance


Auditing is automatically turned on for Microsoft Sentinel data lake. Features that are audited are logged in the audit log automatically.

## Prerequisites
Microsoft Sentinel Data Lake uses the [Microsoft Purview auditing solution](/purview/audit-solutions-overview). Before you can look at the audit data, you need to turn on auditing in the Microsoft Purview portal. For more information, see [Turn auditing on or off](/purview/audit-log-enable-disable). 
 
To access the audit log, you need to have the **View-Only Audit Logs** or **Audit Logs** role in Exchange Online. By default, those roles are assigned to the Compliance Management and Organization Management role groups.

> [!NOTE]
> Global administrators in Office 365 and Microsoft 365 are automatically added as members of the Organization Management role group in Exchange Online.


> [!IMPORTANT]
> Global Administrator is a highly privileged role that should be limited to scenarios when you can't use an existing role. Microsoft recommends that you use roles with the fewest permissions. Using accounts with lower permissions helps improve security for your organization.

## Microsoft Sentinel data lake activities

For a list of all events that are logged for user and admin activities in Microsoft Sentinel data lake, see the following articles:

+ [Microsoft Sentinel data lake onboarding activities](/purview/audit-log-activities#microsoft-sentinel-data-lake-onboarding-activities)
+ [Microsoft Sentinel data lake notebook activities](/purview/audit-log-activities#microsoft-sentinel-data-lake-notebook-activities)
+ [Microsoft Sentinel data lake job activities](/purview/audit-log-activities#microsoft-sentinel-data-lake-job-activities)
+ [Microsoft Sentinel data lake KQL activities](/purview/audit-log-activities#microsoft-sentinel-data-lake-kql-activities)

For detailed audit log schema information, see [Microsoft Sentinel data lake schema](https://aka.ms/sentinel-lake-audit-schema).

## Search the audit log

Follow these steps to search the audit log:

1. Navigate to the  [Microsoft Purview portal](https://purview.microsoft.com) and select **Audit**.


1. On the **New Search** page, filter the activities, dates, and users you want to audit.
1. Select **Search**

   :::image type="content" source="media/auditing-lake-activities/unified-audit-log.png" alt-text="Screenshot of the unified audit log page." lightbox="media/auditing-lake-activities/unified-audit-log.png":::

1. Export your results to Excel for further analysis.

For step-by-step instructions, see [Search the audit sign in the Microsoft Purview portal](/purview/audit-new-search).

Audit log record retention is based on Microsoft Purview retention policies. For more information, see [Manage audit log retention policies](/purview/audit-log-retention-policies).




## Search for events using a PowerShell script

You can use the following PowerShell code snippet to query the Office 365 Management API to retrieve information about Microsoft Defender XDR events:

```PowerShell
$cred = Get-Credential
$s = New-PSSession -ConfigurationName microsoft.exchange -ConnectionUri https://outlook.office365.com/powershell-liveid/ -Credential $cred -Authentication Basic -AllowRedirection 
Import-PSSession $s
Search-UnifiedAuditLog -StartDate 2023/03/12 -EndDate 2023/03/20 -RecordType <ID>
```

>[!NOTE]
> See the API column in Audit activities included for the record type values.

For more information, see [Use a PowerShell script to search the audit log](/purview/audit-log-search-script)

## See also

- [Detailed properties in the audit log](/purview/audit-log-detailed-properties)
- [Export, configure, and view audit log records](/purview/audit-log-export-records)
- [Office 365 Management Activity API reference](/office/office-365-management-api/office-365-management-activity-api-reference)
