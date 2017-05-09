---

title: Find activity reports in the Azure portal | Microsoft Docs
description: Learn how to find Azure Active Directory activity reports in the Azure portal.
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
ms.date: 05/04/2017
ms.author: dhanyahk;markvi

---
# Find activity reports in the Azure portal

If you are moving from the Azure classic portal to the Azure portal, you get a new look at Azure Active Directory (Azure AD) activity logs. In a recent [blog post](https://blogs.technet.microsoft.com/enterprisemobility/2016/11/08/azuread-weve-just-turned-on-detailed-auditing-and-sign-in-logs-in-the-new-azure-portal/), we explain how you can see activity logs in the context of the resource you are working on in the Azure portal. In this article, we describe how to find reports that you used in the Azure classic portal in the Azure portal.

## What's new

Reports in the Azure classic portal are separated into categories:

1.	Security reports
2.	Activity reports
3.	Integrated app reports

### Activity and integrated app reports

For context-based reporting in the Azure portal, existing reports are merged into a single view. A single, underlying API provides the data to the view.

To see this view, on the **Azure Active Directory** blade, under **ACTIVITY**, select **Audit logs**.

![Audit logs](./media/active-directory-reporting-migration/482.png "Audit logs")

The following reports are consolidated in this view:

-	Audit report
- 	Password reset activity
- 	Password reset registration activity
- 	Self-service groups activity
- 	Office365 Group Name Changes
- 	Account provisioning activity
- 	Password rollover status
- 	Account provisioning errors


The Application Usage report has been enhanced and is included in the **Sign-ins** view. To see this view, on the **Azure Active Directory** blade, under **ACTIVITY**, select **Sign-ins**.

![Sign-ins view](./media/active-directory-reporting-migration/483.png "Sign-ins view")

The **Sign-ins** view includes all user sign-ins. You can use this information to get application usage information. You also can view application usage information in the **Enterprise applications** overview, in the **MANAGE** section.

![Enterprise applications](./media/active-directory-reporting-migration/484.png "Enterprise applications")

## Access a specific report

Although the Azure portal offers a single view, you also can look at specific reports.

### Audit logs

In response to customer feedback, in the Azure portal, you can use advanced filtering to access the data you want. One filter you can use is an *activity category*, which lists the different types of activity logs in Azure AD. To narrow results to what you are looking for, you can select a category.

For example, if you are interested only in activities related to self-service password resets, you can choose the **Self-service Password Management** category. The categories you see are based on the resource you are working in.  

![Category options on the Filter Audit Logs page](./media/active-directory-reporting-migration/06.png "Category options on the Filter Audit Logs page")

Activity categories include:

- Core Directory
- Self-service Password Management
- Self-service Group Management
- Account Provisioning

### Application usage

To view details about application usage for all apps or for a single app, under **ACTIVITY**, select **Sign-ins**. To narrow the results, you can filter on user name or application name.

![Filter Sign-In Events page](./media/active-directory-reporting-migration/07.png "Filter Sign-In Events page")

### Security reports

#### Azure AD anomalous activity reports

Azure AD anomalous activity security reports from the Azure classic portal have been consolidated to provide you with one, central view. This view shows all security-related risk events that Azure AD can detect and report on.

The following table lists the Azure AD anomalous activity security reports, and corresponding risk event types in the Azure portal.

| Azure AD anomalous activity report |  Identity protection risk event type|
| :--- | :--- |
| Users with leaked credentials | Leaked credentials |
| Irregular sign-in activity | Impossible travel to atypical locations |
| Sign-ins from possibly infected devices | Sign-ins from infected devices|
| Sign-ins from unknown sources | Sign-ins from anonymous IP addresses |
| Sign-ins from IP addresses with suspicious activity | Sign-ins from IP addresses with suspicious activity |
| - | Sign-ins from unfamiliar locations |

The following Azure AD anomalous activity security reports are not included as risk events in the Azure portal:

* Sign-ins after multiple failures
* Sign-ins from multiple geographies

These reports are still available in the Azure classic portal, but they will be deprecated at some time in the future.

For more information, see
[Azure Active Directory risk events](active-directory-identity-protection-risk-events.md).  


#### Detected risk events

In the Azure portal, you can access reports about detected risk events on the **Azure Active Directory** blade, under **SECURITY**. Detected risk events are tracked in the following reports:   

- Users at Risk
- Risky Sign-ins

![Security reports](./media/active-directory-reporting-migration/04.png "Security reports")

For more information about security reports, see:

- [Users at Risk security report in the Azure Active Directory portal](active-directory-reporting-security-user-at-risk.md)
- [Risky Sign-ins report in the Azure Active Directory portal](active-directory-reporting-security-risky-sign-ins.md)


## Activity reports in the Azure classic portal vs. the Azure portal

The table in this section lists existing reports in the Azure classic portal. It also describes how you can get the same information in the Azure portal.

To view all auditing data, on the **Azure Active Directory** blade, under **ACTIVITY**, go to **Audit logs**.

![Audit logs](./media/active-directory-reporting-migration/61.png "Audit logs")

| Azure classic portal                 | To find in the Azure portal                                                         |
| ---                                  | ---                                                                        |
| Audit logs                           | For **Activity Category**, select **Core Directory**.                       |
| Password reset activity              | For **Activity Category**, select **Self-service Password Management**. |
| Password reset registration activity | For **Activity Category**, select **Self-service Password Management**.     |
| Self-service groups activity         | For **Activity Category**, select **Self-service Group Management**.        |
| Account provisioning activity        | For **Activity Category**, select **Account User Provisioning**.         |
| Password rollover status             | For **Activity Category**, select **Automatic App Password Rollover**.      |
| Account provisioning errors          | For **Activity Category**, select **Account User Provisioning**.        |
| Office365 Group Name Changes         | For **Activity Category**, select **Self-service Password Management**. For **Activity Resource Type**, select **Group**. For **Activity Source**, select **O365 groups**.|

To view the **Application Usage** report, on the **Azure Active Directory** blade, under **MANAGE**, select **Enterprise Applications**, and then select **Sign-ins**.


![Enterprise Applications Sign-Ins report](./media/active-directory-reporting-migration/199.png "Enterprise Applications Sign-Ins report")
