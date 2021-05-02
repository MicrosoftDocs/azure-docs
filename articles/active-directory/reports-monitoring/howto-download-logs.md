---

title: How to download logs in Azure Active Directory | Microsoft Docs
description: Learn how to download activity logs in Azure Active Directory.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: mtillman
editor: ''

ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: report-monitor
ms.date: 11/13/2018
ms.author: markvi
ms.reviewer: besiler 

ms.collection: M365-identity-device-management
---

# How to: Download logs in Azure Active Directory

The Azure Active Directory (Azure AD) portal gives you access to three activity logs:

- **[Sign-ins](concept-sign-ins.md)** – Information about sign-ins and how your resources are used by your users.
- **[Audit](concept-audit-logs.md)** – Information about changes applied to your tenant such as users and group management or updates applied to your tenant’s resources.
- **[Provisioning](concept-provisioning-logs.md)** – Activities performed by the provisioning service, such as the creation of a group in ServiceNow or a user imported from Workday.


As an IT administrator, you want to download your activity logs, so that you have full control over your data.

This article explains how to download logs.  

## What you should know

- In the Azure AD portal, you can find several entry points to the activity logs. For example, the **Activity** section on the [Users](https://portal.azure.com/#blade/Microsoft_AAD_IAM/UsersManagementMenuBlade/MsGraphUsers) or [groups](https://portal.azure.com/#blade/Microsoft_AAD_IAM/GroupsManagementMenuBlade/AllGroups) page. However, there is only one location that provides you with an initially unfiltered view of the logs: the **Monitoring** section on the [Azure AD](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) page.    
- Azure AD stores activity logs only for a specific timeframe. For more information, see... You can use the download option to extend this timeframe and to create a long term backup of your data.
- You can download up to 250 000 records. If you want to download more, use the reporting API.

- Your download is based on the filter you have set. 

- Azure AD supports the following formats for your download:

    - **CSV** 

    - **JSON** 

- The timestamps in the downloaded files are always based on UTC.



## What license do you need?

The option to download the data of an activity log is available in all editions of Azure AD.


## Who can do it?

To access the audit logs, you need to be in one of the following roles:

- Global Reader
- Report Reader
- Global Administrator
- Security Administrator
- Security Reader


## Steps

Azure Active Directory portal gives you access to three activity logs:

- **[Sign-ins](concept-sign-ins.md)** – Information about sign-ins and how your resources are used by your users.
- **[Audit](concept-audit-logs.md)** – Information about changes applied to your tenant. Examples are user and group management changes or updates applied to your tenant’s resources.
- **[Provisioning](concept-provisioning-logs.md)** – Activities performed by the provisioning service. Example are the creation of a group in ServiceNow or a user imported from Workday.

On each activity log-page, you can access the download option in the toolbar:  


![Download log](./media/\howto-download-logs/download-log.png)


**To download an activity log:**

1. Sign in to the Azure Portal (Remove step?)

2. Navigate to the activity log view you care about:
 
    - [The sign-ins log](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/SignIns)
    
    - [The audit log](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/SignIns)    
       
    - [The provisioning log](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/ProvisioningEvents)    
   

3.  **Add** the required filter.  

    ![Add filter](./media/\howto-download-logs/add-filter.png)    

4. **Download** the data.

    ![Download log](./media/\howto-download-logs/download-log.png)

## Next steps

* [Sign-ins error codes reference](./concept-sign-ins.md)
* [Sign-ins report overview](concept-sign-ins.md)