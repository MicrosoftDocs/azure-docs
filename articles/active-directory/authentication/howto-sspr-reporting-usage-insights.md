---
title: Self-service password reset reports - Azure Active Directory
description: Reporting on Azure AD self-service password reset events

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 06/06/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sahenry

ms.collection: M365-identity-device-management
---
# SSPR Usage & Insights  - Private Preview

Overview

Hello and welcome to the private preview for self-service password reset (SSPR) usage & insights! We appreciate your participation in this private preview and look forward to hearing your feedback.

SSPR usage & insights enables you to understand how SSPR is working in your organization. The insights and reports give you information both about SSPR authentication methods registration and self-service reset usage.

Goals of this private preview

- Quickly gather customer feedback and incorporate it into the experience. 
- Ensure that the feature meets customer requirements
- Validate feature functionality and identify any issues or bugs

Communication

During private preview, please reach out to your GTP or FastTrack contact to provide feedback. 

How it works

Prerequisites

- You must have SSPR enabled in your tenant

Limitations & known issues

- The data shown in these reports will be delayed. We will be adding a “Last updated” field to the report so that you know how recent your data is.
- The registration failure data shown in the Registrations chart may be inaccurate. We will address this issue before public preview. 
- The ability to download the details for registration and reset is not yet available. This will be available in public preview.

Roles & Licensing

The following roles can access SSPR Usage and Insights:

- Global Administrator
- Security Reader
- Security Administrator
- Reports Reader

The SSPR licensing requirements are described here: https://docs.microsoft.com/en-us/azure/active-directory/authentication/concept-sspr-licensing. If you do not have the appropriate licensing, users will not be able to reset their passwords and you will not see password reset data in the reports.

Functionality

SSPR usage & insights provides two types of data:

- Registration data: This data shows exactly which methods a user (or an admin on behalf of the user) has registered for SSPR. This data does not change based on the Date filter selected.
- Audit data: This data shows the latest details on success and failures in registration and reset. This data is available for the last 24 hour, 7 days, and 30 days.

Insights and charts

To access SSPR usage & insights, go to https://portal.azure.com/#blade/Microsoft_AAD_IAM/AuthenticationMethodsOverviewBlade. This will bring you to the overview:

The Users registered, Users enabled, and Users capable tiles show the following registration data for your users:

- Registered: A user is considered registered if they (or an admin) have registered enough authentication methods to meet the SSPR policy.
- Enabled: A user is considered enabled if they are in scope for the SSPR policy. If SSPR is enabled for a group, then the user is considered enabled if they are in that group. If SSPR is enabled for all users, then all users in the tenant (excluding guests) are considered enabled.
- Capable: A user is considered capable if they are both registered and enabled. This means that they can perform SSPR at any time if needed.

Clicking on any of these three tiles or the insights shown in them will bring you to a pre-filtered list of registration details, which is covered later in this document.

The Registrations chart shows the number of successful and failed authentication method registrations by authentication method. The Resets chart shows the number of successful and failed authentications during the password reset flow by authentication method. 
Clicking on either of the charts will bring you to a pre-filtered list of registration or reset events, which is covered later in this document.

Using the control in the upper, right-hand corner, you can change the date range for the audit data shown in the Registrations and Resets charts to 24 hours, 7 days, or 30 days.

Registration details

Clicking on the Users registered, Users enabled, or Users capable tiles or insights will bring you to the registration details:

This report shows the following information for each user:

- Name
- User name
- Registration status (All, Registered, Not registered)
- Enabled status (All, Enabled, Not enabled)
- Capable status (All, Capable, Not capable)
- Methods (App notification, App code, Phone call, SMS, Email, Security questions)

Using the controls at the top of the list, you can search for a user and filter the list of users based on the columns shown. 

Reset details

Clicking on the Registrations or Resets charts will bring you to the reset details:

This report shows registration and reset events from the last 30 days including:
- Name
- User name
- Feature (All, Registration, Reset)
- Authentication method (App notification, App code, Phone call, Office call, SMS, Email, Security questions)
- Status (All, Success, Failure)

Using the controls at the top of the list, you can search for a user and filter the list of users based on the columns shown.

Support

Support during private preview is provided directly by the Azure AD engineering team, and it will provide during business hours in US Pacific Time Zone. To report an issue, please post in the Microsoft Teams channel or email your GTP contact directly.

Upcoming features

- Faster data update
- API for accessing all report data

FAQs

Can a customer use this capability in production?

Yes, this feature should have no impact on end users and can be used in production.

Who can the customer call when things go wrong?

Engineering will directly support each Private Preview customer. The customer can reach out to the private preview via when there are problems. This support may not be 24x7.

How about breaking changes and functional takebacks?

There is a high degree of ongoing change during a Private Preview that is hard to predict. This is why we limit Private Previews to a restricted set of customers working directly with engineering. Customer should assess risk when deploying Private Preview features in production.

Time to next milestone?

Private Preview capabilities may be withdrawn and possibly redesigned before reaching further milestones. We are targeting March 2019 for the public release of this feature.
