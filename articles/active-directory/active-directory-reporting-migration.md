---
title: How to find activity reports in the Azure Portal | Microsoft Docs
description: Learn how to find activity reports in the Azure Portal
services: active-directory
documentationcenter: ''
author: dhanyahk
manager: femila
editor: ''

ms.assetid: d93521f8-dc21-4feb-aaff-4bb300f04812
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 02/17/2017
ms.author: dhanyahk;markvi

---
# How to find activity reports in the Azure Portal

With the migration from the Azure classic portal to the Azure portal, we are providing you with a new look to the Azure Active Directory Activity Logs. We have released a [blog post](https://blogs.technet.microsoft.com/enterprisemobility/2016/11/08/azuread-weve-just-turned-on-detailed-auditing-and-sign-in-logs-in-the-new-azure-portal/) a couple of months ago that explains how we provide Activity logs in the context of the resource you are working on. This article describes to you how we have translated the existing reports in the Azure classic portal into the new world of the Azure portal.

## What is new?

The reports in the Azure classic portal are split into various categories:

1.	Security Reports
2.	Activity Reports
3.	Integrated App Reports

### Activity and integrated app reports

Moving to context based reporting in Azure portal, we have merged the existing reports into one single view with a single underlying API providing the data to the view. 

You can find this view under **Audit logs** in the **Activity** section of the **Azure Active Directory** blade.


![Audit logs](./media/active-directory-reporting-migration/482.png "Audit logs")








The following are the reports that have been consolidated into this view.

-	Audit report

- 	Password reset activity

- 	Password reset registration activity

- 	Self service groups activity

- 	Office365 Group Name Changes

- 	Account provisioning activity

- 	Password rollover status
- 	Account provisioning errors


The Application Usage report has been enhanced and included in a view called the **Sign-ins**. You can find this view in the **Activity** section of the **Azure Active Directory** blade.


![Audit logs](./media/active-directory-reporting-migration/483.png "Audit logs")

This view includes all the users’ sign-ins, which, in turn can be derived to get the application usage information. You can find the application usage information through the **Enterprise Applications** overview as well.

![Audit logs](./media/active-directory-reporting-migration/484.png "Audit logs")



## How can I access a specific report in this single view?

### Audit logs

One of the key asks of many customers has been the ability to have multiple filter options to access Activity logs within Azure AD. In lieu of this, we have provided advanced filtering mechanism for you to filter the data you want. One of the filters we have provided is called **Activity Category**, which lists the different types of activity logs that Azure AD provides. By choosing the category you want, you can narrow down the results to what you are looking for. 

For example, if you are interested in just getting **Self-service Password Reset** related activities, you can choose the **Self-service Password Management** category. The categories you can see are in the context of the resource you are working on.  


![Audit logs](./media/active-directory-reporting-migration/06.png "Audit logs")

 
The various categories we have today include:

- Core Directory

- Self-service Password Management

- Self-service Group Management

- Account Provisioning

### Application usage

You can view the application usage for all apps or a single app through the **Activities > Sign-ins** view. As shown below, this view is present for all applications or a single application. You can filter either on **User name** or **Application name** if you want narrow down the results.
 

![Audit logs](./media/active-directory-reporting-migration/07.png "Audit logs")


### Security reports

The security reports have been consolidated to provide with a complete overview of a view of all security related risk events that Azure Active Directory can detect and report on. For a complete overview, see
[Azure Active Directory risk events](active-directory-identity-protection-risk-events.md).  
In this topic, you can find an overview of how the Azure Active Directry anomalous activity reports map to the risk events in Azure AD in the [Azure AD anomalous activity reports](active-directory-identity-protection-risk-events.md#azure-ad-anomalous-activity-reports) section.

In the Azure portal, you can access the reports about detected risk events in the **Security** section of the **Azure Active Directory** blade. The detected risk events are tracked within the following reports:   

- Users at Risk
- Risky Sign-ins 


![Audit logs](./media/active-directory-reporting-migration/04.png "Audit logs")

For more details about these reports, see:

- [Users at risk security report in the Azure Active Directory portal - preview](active-directory-reporting-security-user-at-risk.md)
- [Risky sign-ins report in the Azure Active Directory portal - preview](active-directory-reporting-security-risky-sign-ins.md)






## Activity Reports in Azure Classic Portal versus Azure Portal

This section lists the existing reports in the Azure classic portal and how you can get this information in the Azure portal.


Your entry point to all auditing data is **Audit logs** in the **Activity** section of the **Azure Active Directory** blade.

![Audit logs](./media/active-directory-reporting-migration/61.png "Audit logs")


| Azure classic portal                 | Azure portal steps                                                         |
| ---                                  | ---                                                                        |
| Audit Logs                           | As **Activity Category**, select **Core Directory**.                       |
| Password reset activity              | As the **Activity Category**, select **Self service Password Management**. | 
| Password reset registration activity | As **Activity Category**, select **Self Service Password Management**.     |
| Self service groups activity         | As **Activity Category**, select **Self service Group Management**.        |
| Account provisioning activity        | As as **Activity Category**, select **Account User Provisioning**.         |
| Password rollover status             | As **Activity Category**, select **Automatic App Password Rollover**.      |
| Account provisioning errors          | As the **Activity Category**, select **Account User Provisioning**.        |
| Office365 Group Name Changes         | As **Activity Category**, select **Self service Password Management**, as **Activity Resource Type**, select **Group** and as **Activity Source**, select **O365 groups**.|

 

Your entry point to the **Application Usage** report is **Azure Active Directory > Enterprise Applications > Sign-ins**. 


![Audit logs](./media/active-directory-reporting-migration/199.png "Audit logs")

