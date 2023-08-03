---

title: How to download logs in Azure Active Directory
description: Learn how to download activity logs in Azure Active Directory.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: report-monitor
ms.date: 02/16/2023
ms.author: sarahlipsey
ms.reviewer: besiler 

ms.collection: M365-identity-device-management
---

# How to: Download logs in Azure Active Directory

The Azure Active Directory (Azure AD) portal gives you access to three types of activity logs:

- **[Sign-ins](concept-sign-ins.md)**: Information about sign-ins and how your resources are used by your users.
- **[Audit](concept-audit-logs.md)**: Information about changes applied to your tenant such as users and group management or updates applied to your tenant’s resources.
- **[Provisioning](concept-provisioning-logs.md)**: Activities performed by a provisioning service, such as the creation of a group in ServiceNow or a user imported from Workday.

Azure AD stores the data in these logs for a limited amount of time. As an IT administrator, you can download your activity logs to have a long-term backup. This article explains how to download activity logs in Azure AD. 

## Prerequisites 

The option to download the data of an activity log is available in all editions of Azure AD. You can also download activity logs using Microsoft Graph; however, downloading logs programmatically requires a premium license.

The following roles provide read access to audit logs. Always use the least privileged role, according to Microsoft [Zero Trust guidance](/security/zero-trust/zero-trust-overview).
- Reports Reader
- Security Reader
- Security Administrator
- Global Reader (sign-in logs only)
- Global Administrator

## Log download details

Azure AD stores activity logs for a specific period. For more information, see [How long does Azure AD store reporting data?](reference-reports-data-retention.md) By downloading the logs, you can control how long logs are stored. 

- Azure AD supports the following formats for your download:
    - **CSV** 
    - **JSON** 
- Timestamps in the downloaded files are based on UTC.
- For large data sets (> 250,000 records), you should use the [reporting API](/graph/api/resources/azure-ad-auditlog-overview) to download the data.

  > [!NOTE]
   > **Issues downloading large data sets**  
   > The Azure portal downloader will time out if you attempt to download large data sets. Generally, data sets smaller than 250,000 records work well with the browser download feature. If you face issues completing large downloads in the browser, you should use the [reporting API](/graph/api/resources/azure-ad-auditlog-overview) to download the data.

## How to download activity logs

You can access the activity logs from the **Monitoring** section of Azure AD or from the **Users** page of Azure AD. If you view the audit logs from the **Users** page, the filter category will be set to **UserManagement**. Similarly, if you view the audit logs from the **Groups** page, the filter category will be set to **GroupManagement**. Regardless of how you access the activity logs, your download is based on the filter you've set. 

1. Navigate to the activity log you need to download.
1. Adjust the filter for your needs.  
1. Select **Download**.
    - For audit and sign-in logs, a window appears where you'll select the download format (CSV or JSON).
    - For provisioning logs, you'll select the download format (CSV of JSON) from the Download button.
    - You can change the File Name of the download.
    - Select the **Download** button.
1. The download processes and sends the file to your default download location. 

The following screenshot shows the download window from the audit and sign-in log download process. 
    ![Screenshot of the audit log download process.](./media/howto-download-logs/audit-log-download.png)

The following screenshot shows menu options for the provisioning log download process.
    ![Screenshot of the provisioning log download button options.](./media/howto-download-logs/provisioning-logs-download.png)

If your tenant has enabled the [sign-in logs preview](concept-all-sign-ins.md), more options are available after selecting **Download**. The sign-in logs preview include interactive and non-interactive user sign-ins, service principal sign-ins, and managed identity sign-ins.
    ![Screenshot of the download options for the sign-in logs preview.](media/howto-download-logs/sign-in-preview-download-options.png)

## Next steps

- [Integrate Azure AD logs with Azure Monitor](howto-integrate-activity-logs-with-log-analytics.md)
- [Access Azure AD logs using the Graph API](quickstart-access-log-with-graph-api.md)
