---
title: Usage and insights report | Microsoft Docs
description: Introduction to usage and insights report in the Azure Active Directory portal 
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.subservice: report-monitor
ms.date: 11/03/2022
ms.author: sarahlipsey
ms.reviewer: besiler
---

# Usage and insights in Azure Active Directory

With the Azure Active Directory (Azure AD) **Usage and insights** report, you can get an application-centric view of your sign-in data. You can find answers to the following questions:

*	What are the top used applications in my organization?
*	What applications have the most failed sign-ins? 
*	What are the top sign-in errors for each application?

Azure AD also provides a report on authentication methods activity. This article provides an overview of three reports that look sign-in data. 

## Access Usage & insights 

Accessing the data from Usage and insights requires:

* An Azure AD tenant
* An Azure AD premium (P1/P2) license to view the sign-in data
* A user in the Global Administrator, Security Administrator, Security Reader, or Report Reader roles.

To access Usage & insights:

1. Sign in to the [Azure portal](https://portal.azure.com) using the appropriate least privileged role.
1. Go to **Azure Active Directory** > **Usage & insights**.

The **Usage & insights** report is also available from the **Enterprise applications** area of Azure AD. All users can access their own sign-ins at the [My Sign-Ins portal](https://mysignins.microsoft.com/security-info).

## View the Usage & insights reports

There are currently three reports available in Azure AD Usage & insights. All three reports use sign-in data to provide helpful information an application usage and authentication methods.

### Azure AD application activity (preview)

The **Azure AD application activity (preview)** report shows the list of applications with one or more sign-in attempts. The report allows you to sort by the number of successful sign-ins, failed sign-ins, and the success rate.

Select the **View sign in activity** link for an application to view more details. The sign-in graph per application counts interactive user sign-ins. The details of any sign-in failures appears below the table. 

![Screenshot shows Usage & insights for Application activity where you can select a range and view sign-in activity for different apps.](./media/concept-usage-insights-report/usage-insights-overview.png)

Select a day in the application usage graph to see a detailed list of the sign-in activities for the application. This detailed list is actually the sign-in log with the filter set to the selected application and date.

![Screenshot of the sing-in activity details for a selected application.](./media/concept-usage-insights-report/application-activity-sign-in-detail.png)

### AD FS application activity

The **AD FS application activity** report in Usage & insights looks at the applications currently using Azure AD Federated Services (AD FS) to authenticate. These applications have not been migrated to Azure AD for authentication. 

### Authentication methods activity

The **Authentication methods activity** in Usage & insights displays visualizations of the different authentication methods used by your organization. The **Registration tab** displays statistics of users registered for each of your available authentication methods. Select the **Usage** tab at the top of the page to see actual usage for each authentication method. 

You can also access several other reports and tools related to authentication. 

Are you planning on running a registration campaign to nudge users to sign up for MFA? Use the **Registration campaign** option from the side menu to set up a registration campaign. For more information, see [Nudge users to set up Microsoft Authenticator](../authentication/how-to-mfa-registration-campaign.md).

Looking for the details of a user and their authentication methods? Look at the **User registration details** report from the side menu and search for a name or UPN. The default MFA method and other methods registered are displayed. You can also see if the user is capable of registering for one of the authentication methods.

Looking for the status of an authentication registration or reset event of a user? Look at the **Registration and reset events** report from the side menu and then search for a name or UPN. You'll be able to see the method used to attempt to register or reset an authentication method.

## Next steps

- [Learn about the sign-ins report](concept-sign-ins.md)
- [Learn about Azure AD authentication](../authentication/overview-authentication.md)
