---

title: How to download logs in Azure Active Directory | Microsoft Docs
description: Learn how to download activity logs in Azure Active Directory.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''

ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: report-monitor
ms.date: 08/26/2022
ms.author: billmath
ms.reviewer: besiler 

ms.collection: M365-identity-device-management
---

# How to: Download logs in Azure Active Directory

The Azure Active Directory (Azure AD) portal gives you access to three types of activity logs:

- **[Sign-ins](concept-sign-ins.md)** – Information about sign-ins and how your resources are used by your users.
- **[Audit](concept-audit-logs.md)** – Information about changes applied to your tenant such as users and group management or updates applied to your tenant’s resources.
- **[Provisioning](concept-provisioning-logs.md)** – Activities performed by the provisioning service, such as the creation of a group in ServiceNow or a user imported from Workday.

Azure AD stores the data in these logs for a limited amount of time. As an IT administrator, you can download your activity logs to have a long-term backup.

This article explains how to download activity logs in Azure AD.  

## What you should know

- In the Azure AD portal, you can find several entry points to the activity logs. For example, the **Activity** section on the [Users](https://portal.azure.com/#blade/Microsoft_AAD_IAM/UsersManagementMenuBlade/MsGraphUsers) or [groups](https://portal.azure.com/#blade/Microsoft_AAD_IAM/GroupsManagementMenuBlade/AllGroups) page. However, there is only one location that provides you with an initially unfiltered view of the logs: the **Monitoring** section on the [Azure AD](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) page.    

- Azure AD stores activity logs only for a specific period. For more information, see [How long does Azure AD store reporting data?](reference-reports-data-retention.md) 

- By downloading the logs, you can control for how long logs are stored. 

- Your download is based on the filter you have set. 

- Azure AD supports the following formats for your download:

    - **CSV** 

    - **JSON** 

- The timestamps in the downloaded files are always based on UTC.

- For large data sets (> 250 000 records), you should use the reporting API to download the data.


## What license do you need?

The option to download the data of an activity log is available in all editions of Azure AD.

You can also download activity logs using Microsoft Graph; however, downloading logs grammatically requires a premium incense.


## Who can do it?

While the global administrator works, you should use an account with lower privileges to perform this task. To access the audit logs, the following roles work:

- Report Reader
- Global Reader
- Security Administrator
- Security Reader


## How to do it


**To download an activity log:**

1. Navigate to the activity log view you care about:
 
    - [The sign-ins log](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/SignIns)
    
    - [The audit log](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/SignIns)    
       
    - [The provisioning log](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/ProvisioningEvents)    
   

2.  **Add** the required filter.  

    ![Add filter](./media/\howto-download-logs/add-filter.png)    

3. **Download** the data.

    ![Download log](./media/\howto-download-logs/download-log.png)

## Next steps

- [Sign-ins logs in Azure AD](concept-sign-ins.md)
- [Audit logs in Azure AD](concept-audit-logs.md)