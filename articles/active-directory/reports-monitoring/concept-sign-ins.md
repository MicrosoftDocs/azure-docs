---
title: Sign-in activity reports in the Azure Active Directory portal | Microsoft Docs
description: Introduction to sign-in activity reports in the Azure Active Directory portal 
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: daveba
editor: ''

ms.assetid: 4b18127b-d1d0-4bdc-8f9c-6a4c991c5f75
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 04/18/2019
ms.author: markvi
ms.reviewer: dhanyahk

ms.collection: M365-identity-device-management
---
# Sign-in activity reports in the Azure Active Directory portal

The reporting architecture in Azure Active Directory (Azure AD) consists of the following components:

- **Activity** 
    - **Sign-ins** – Information about the usage of managed applications and user sign-in activities.
    - **Audit logs** - [Audit logs](concept-audit-logs.md) provide system activity information about users and group management, managed applications and directory activities.
- **Security** 
    - **Risky sign-ins** - A [risky sign-in](concept-risky-sign-ins.md) is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account.
    - **Users flagged for risk** - A [risky user](concept-user-at-risk.md) is an indicator for a user account that might have been compromised.

This topic gives you an overview of the sign-ins report.

## Prerequisites

### Who can access the data?
* Users in the Security Administrator, Security Reader and Report Reader roles
* Global Administrators
* In addition, any user (non-admins) can access their own sign-ins 

### What Azure AD license do you need to access sign-in activity?
* Your tenant must have an Azure AD Premium license associated with it to see the all up sign-in activity report. See [Getting started with Azure Active Directory Premium](../fundamentals/active-directory-get-started-premium.md) to upgrade your Azure Active Directory edition. Note that if you did not have any activities data prior to the upgrade, it will take a couple of days for the data to show up in the reports after you upgrade to a premium license.

## Sign-ins report

The user sign-ins report provides answers to the following questions:

* What is the sign-in pattern of a user?
* How many users have signed in over a week?
* What’s the status of these sign-ins?

You can access the sign-ins report by selecting **Sign-ins** in the **Activity** section of the **Azure Active Directory** blade in the [Azure portal](https://portal.azure.com). Note that it may take upto two hours for some sign-in records to show up in the portal.

![Sign-in activity](./media/concept-sign-ins/61.png "Sign-in activity")

> [!IMPORTANT]
> The sign-ins report only displays the **interactive** sign-ins, that is, sign-ins where a user manually signs in using their username and password. Non-interactive sign-ins, such as service-to-service authentication, are not displayed in the sign-ins report. 

A sign-ins log has a default list view that shows:

- The sign-in date
- The related user
- The application the user has signed-in to
- The sign-in status
- The status of the risk detection
- The status of the multi-factor authentication (MFA) requirement

![Sign-in activity](./media/concept-sign-ins/01.png "Sign-in activity")

You can customize the list view by clicking **Columns** in the toolbar.

![Sign-in activity](./media/concept-sign-ins/19.png "Sign-in activity")

This enables you to display additional fields or remove fields that are already displayed.

![Sign-in activity](./media/concept-sign-ins/02.png "Sign-in activity")

Select an item in the list view to get more detailed information.

![Sign-in activity](./media/concept-sign-ins/03.png "Sign-in activity")

> [!NOTE]
> Customers can now troubleshoot Conditional Access policies through all sign-in reports. By clicking on the **Conditional Access** tab for a sign-in record, customers can review the Conditional Access status and dive into the details of the policies that applied to the sign-in and the result for each policy.
> For more information, see the [Frequently asked questions about CA information in all sign-ins](reports-faq.md#conditional-access).

![Sign-in activity](./media/concept-sign-ins/ConditionalAccess.png "Sign-in activity")


## Filter sign-in activities

To narrow down the reported data to a level that works for you, you can filter the sign-ins data using the following default fields:

- User
- Application
- Sign-in status
- Conditional Access
- Date

![Sign-in activity](./media/concept-sign-ins/04.png "Sign-in activity")

The **User** filter enables you to specify the name or the user principal name (UPN) of the user you care about.

The **Application** filter enables you to specify the name of the application you care about.

The **Sign-in status** filter enables you to select:

- All
- Success
- Failure

The **Conditional Access** filter enables you to select the CA policy status for the sign-in:

- All
- Not Applied
- Success
- Failure

The **Date** filter enables to you to define a timeframe for the returned data.  
Possible values are:

- 1 month
- 7 days
- 24 hours
- Custom time interval

When you select a custom timeframe, you can configure a start time and an end time.

If you add additional fields to your sign-ins view, these fields are automatically added to the list of filters. For example, by adding **Client App** field to your list, you also get another filter option that enables you to set the following filters:  
![Sign-in activity](./media/concept-sign-ins/12.png "Sign-in activity")

- **Browser**  
    This filter shows all events where sign-in attempts were performed using browser flows.
- **Exchange ActiveSync (supported)**  
    This filter shows all sign-in attempts where the Exchange ActiveSync (EAS) protocol has been attempted from supported platforms like iOS, Android and Windows Phone.
- **Exchange ActiveSync (unSupported)**  
    This filter shows all sign-in attempts where the EAS protocol has been attempted from unsupported platforms like, Linux distros.
- **Mobile Apps and Desktop clients**
        This filter shows all sign-in attempts that were not using browser flows. This can be mobile apps from any platform using any protocol or from Desktop client apps like Office on Windows or MacOS.
  
- **Other clients**
    - **IMAP**  
        A legacy mail client using IMAP to retrieve email.
    - **MAPI**  
        Office 2013, where ADAL is enabled and it is using MAPI.
    - **Older Office clients**  
        Office 2013 in its default configuration where ADAL is not enabled and it is using MAPI, or Office 2016 where ADAL has been disabled.
    - **POP**  
        A legacy mail client using POP3 to retrieve email.
    - **SMTP**  
        A legacy mail client using SMTP to send email.

## Download sign-in activities

You can [download the sign-ins data](quickstart-download-sign-in-report.md) if you want to work with it outside the Azure portal. Clicking **Download** gives you the option to create a CSV or JSON file of the most recent 250,000 records.  

![Download](./media/concept-sign-ins/71.png "Download")

> [!IMPORTANT]
> The number of records you can download is constrained by the [Azure Active Directory report retention policies](reference-reports-data-retention.md).  


## Sign-ins data shortcuts

In addition to Azure AD, the Azure portal provides you with additional entry points to sign-ins data:

- The Identity security protection overview
- Users
- Groups
- Enterprise applications

### Users sign-ins data in Identity security protection

The user sign-in graph in the **Identity security protection** overview page shows weekly aggregations of sign-ins for all users in a given time period. The default for the time period is 30 days.

![Sign-in activity](./media/concept-sign-ins/06.png "Sign-in activity")

When you click on a day in the sign-in graph, you get an overview of the sign-in activities for this day.

Each row in the sign-in activities list shows:

* Who has signed in?
* What application was the target of the sign-in?
* What is the status of the sign-in?
* What is the MFA status of the sign-in?

By clicking an item, you get more details about the sign-in operation:

- User ID
- User
- Username
- Application ID
- Application
- Client
- Location
- IP address
- Date
- MFA Required
- Sign-in status

> [!NOTE]
> IP addresses are issued in such a way that there is no definitive connection between an IP address and where the computer with that address is physically located. Mapping IP addresses is complicated by the fact that mobile providers and VPNs issue IP addresses from central pools that are often very far from where the client device is actually used. 
> Currently in Azure AD reports, converting IP address to a physical location is a best effort based on traces, registry data, reverse look ups and other information.

On the **Users** page, you get a complete overview of all user sign-ins by clicking **Sign-ins** in the **Activity** section.

![Sign-in activity](./media/concept-sign-ins/08.png "Sign-in activity")

## Usage of managed applications

With an application-centric view of your sign-in data, you can answer questions such as:

* Who is using my applications?
* What are the top 3 applications in your organization?
* I have recently rolled out an application. How is it doing?

Your entry point to this data is the top 3 applications in your organization within the last 30 days report in the **Overview** section under **Enterprise applications**.

![Sign-in activity](./media/concept-sign-ins/10.png "Sign-in activity")

The app usage graph weekly aggregations of sign-ins for your top 3 applications in a given time period. The default for the time period is 30 days.

![Sign-in activity](./media/concept-sign-ins/47.png "Sign-in activity")

If you want to, you can set the focus on a specific application.

![Reporting](./media/concept-sign-ins/single_spp_usage_graph.png "Reporting")

When you click on a day in the app usage graph, you get a detailed list of the sign-in activities.

The **Sign-ins** option gives you a complete overview of all sign-in events to your applications.

![Sign-in activity](./media/concept-sign-ins/11.png "Sign-in activity")

## Office 365 activity logs

You can view Office 365 activity logs from the [Microsoft 365 admin center](https://docs.microsoft.com/office365/admin/admin-overview/about-the-admin-center). Even though Office 365 activity and Azure AD activity logs share a lot of the directory resources, only the Microsoft 365 admin center provides a full view of the Office 365 activity logs. 

You can also access the Office 365 activity logs programmatically using the [Office 365 Management APIs](https://docs.microsoft.com/office/office-365-management-api/office-365-management-apis-overview).

## Next steps

* [Sign-in activity report error codes](reference-sign-ins-error-codes.md)
* [Azure AD data retention policies](reference-reports-data-retention.md)
* [Azure AD report latencies](reference-reports-latencies.md)

