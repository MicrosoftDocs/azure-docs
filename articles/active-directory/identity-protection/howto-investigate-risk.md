---
title: How to investigate risks in Azure Active Directory identity protection (refreshed) | Microsoft Docs
description: Learn how to investigate risky users, detections, and sign-ins in Azure Active Directory identity protection (refreshed).

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: conceptual
ms.date: 01/25/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sahandle

ms.collection: M365-identity-device-management
---
# How To: Investigate risk

Using the risky sign-ins, risky users, and risk detections reports you can investigate and gain insight into risk in your environment. With the ability to filter and sort the risky sign-ins, users and detections, you can better understand potential intrusion in your organization. 

## Risky users report

With the information provided by the risky users report, you can find answers to questions such as:

- Which users are high risk?
- Which users have a risk state of remediated?

Your first entry point to this report is the **Investigate** section on the security page.

![Risky users report](./media/howto-investigate-risky-users-signins/01.png)

The risky users report has a default view that shows:

- Name
- Risk state
- Risk level
- Risk detail
- Risk last updated
- Type
- Status

![Risky users report](./media/howto-investigate-risky-users-signins/03.png)

You can customize the list view by clicking **Columns** in the toolbar.

![Risky users report](./media/howto-investigate-risky-users-signins/04.png)

The columns dialog enables you to display additional fields or remove fields that are already displayed.

By clicking an item in the list view, you get all available details about it in a horizontal view.

![Risky users report](./media/howto-investigate-risky-users-signins/05.png)

The details view shows:

- Basic info
- Recent risky sign-ins
- Risk detections not linked to a sign-in
- Risk history

Additionally, you can:

![Risky users report](./media/howto-investigate-risky-users-signins/08.png)

- View all sign-ins shortcut to view the sign-ins report for that user.
- View all risky sign-ins to view all the sign-ins for that user that were flagged as risky.
- Reset a user’s password if you believe that the user's identity has been compromised.
- Dismiss user risk if you think that the active risk detections of a user are false positives. For more information, see the article [Provide feedback on risk detections in Azure AD Identity Protection](howto-provide-risk-event-feedback.md).

### Filter risky users

To narrow down the reported data to a level that works for you, you can filter the risky user data using the following default fields:

- Name
- Username
- Risk state
- Risk level
- Type
- Status

![Risky users report](./media/howto-investigate-risky-users-signins/06.png)

The **Name** filter enables you to specify the name or the user principal name (UPN) of the user you care about.

The **Risk state** filter enables you to select:

- At risk
- Remediated
- Dismissed

The **Risk level** filter enables you to select:

- High
- Medium
- Low

The **Type** filter enables you to select:

- Guest
- Member

The **Status** filter enables you to select:

- Deleted
- Active

### Download risky users data

You can download the risky users data if you want to work with it outside the Azure portal. Clicking Download creates a CSV file of the most recent 2,500 records. 

![Risky users report](./media/howto-investigate-risky-users-signins/07.png)

You can customize the list view by clicking Columns in the toolbar.
 
This enables you to display additional fields or remove fields that are already displayed.
 
To learn more about a risky user, click on the Details drawer to expand it

## Risky sign-ins report

With the information provided by the risky sign-ins report, you can find answers to questions such as:

- How many successful sign-ins were there that had anonymous IP address risk detections in the last week?
- Which users were confirmed compromised in the last month?
- Which users had risky sign-ins to the Office 365 portal?

Your first entry point to this report is the **Investigate** section on the security page.

![Risky sign-ins report](./media/howto-investigate-risky-users-signins/02.png)

The risky sign-ins report has a default view that shows:

- Date
- User
- Application
- Sign-in status
- Risk state
- Risk level (aggregate)
- Risk level (real-time)
- Conditional Access
- MFA required  

![Risky sign-ins report](./media/howto-investigate-risky-users-signins/09.png)

You can customize the list view by clicking **Columns** in the toolbar.

![Risky users report](./media/howto-investigate-risky-users-signins/11.png)

The columns dialog enables you to display additional fields or remove fields that are already displayed.

By clicking an item in the list view, you get all available details about it in a horizontal view.

![Risky users report](./media/howto-investigate-risky-users-signins/12.png)

The details view shows:

- Basic info
- Device info
- Risk info
- MFA info
- Conditional Access

Additionally, you can:

![Risky users report](./media/howto-investigate-risky-users-signins/13.png)

- Confirm compromised 
- Confirm safe

For more information, see the article [Provide feedback on risk detections in Azure AD Identity Protection](howto-provide-risk-event-feedback.md).

### Filter risky sign-ins

To narrow down the reported data to a level that works for you, you can filter the risky user data using the following default fields:

- User
- Application
- Sign-in status
- Risk state
- Risk level (aggregate)
- Risk level (real-time)
- Conditional Access
- Date
- Risk level type

![Risky sign-ins report](./media/howto-investigate-risky-users-signins/14.png)

The **Name** filter enables you to specify the name or the user principal name (UPN) of the user you care about.

The **Application** filter enables you to specify the cloud app the user tried to access.

The **Sign-in status** filter enables you to select:

- All
- Success
- Failure

The **Risk state** filter enables you to select:

- At risk
- Confirmed compromised
- Confirmed safe
- Dismissed
- Remediated

The **Risk level (aggregate)** filter enables you to select:

- High
- Medium
- Low

The **Risk level (real-time)** filter enables you to select:

- High
- Medium
- Low

The **Conditional Access** filter enables you to select:

- All
- Not applied
- Success
- Failure

The **Date** filter enables to you to define a timeframe for the returned data.
Possible values are:

- Last 1 month
- Last 7 days
- Last 24 hours
- Custom time interval

### Download risky sign-ins data

You can download the risky sign-ins data if you want to work with it outside the Azure portal. Clicking Download creates a CSV file of the most recent 2,500 records. 

![Risky users report](./media/howto-investigate-risky-users-signins/15.png)


## Risk detections report

The risk detections report gives you insight into every Identity Protection risk detection in your tenant.


The risk detection report has a default view that shows:

- Date

- User

- IP address

- Location

- Detection type

- Risk state

- Risk level

- Request ID
 

You can customize the list view by clicking **Columns** in the toolbar. The columns dialog enables you to display additional fields or remove fields that are already displayed.

By clicking an item in the list view, you get all available details about it in a horizontal view.


The details view shows additional information about the risk detection.

The details view also includes links to

- View user's risk report
- View user's sign-ins
- View user's risky sign-ins
- View linked risky sign-in
- View user's risk detections


### Filter risk detections

To narrow down the reported data to a level that works for you, you can filter the risk detection data using the following default fields:

- Detection time
- Detection type
- Risk state
- Risk level
- User
- Username
- IP address
- Location
- Detection timing
- Activity 
- Source
- Token issuer type
- Request ID
- Correlation ID


The **Detection time** filter enables to you to define a timeframe for the returned data. This filter allows you to select:
- Last 90 days
- Last 30 days
- Last 7 days
- Last 24 hours
- Custom time interval

The **Detection type** filter enables you to specify the type of risk detection (such as unfamiliar sign-in properties).

The **Risk state** filter enables you to select:

- At risk
- Confirmed compromised
- Confirmed safe
- Dismissed
- Remediated

The **Risk level** filter enables you to select:

- High
- Medium
- Low

The **User** filter enables you to specify the name or the object ID of the user you care about.

The **Username** filter enables you to specify the user principal name (UPN) of the user you care about.

The **Detection timing** filter enables you to specify whether the detection was real-time or offline. Note: You can challenge sign-ins with real-time detections using Sign-in risk policy. 

The **Activity** filter enables you to specify whether the detection was linked to a sign-in (e.g. Anonymous IP address) or a user (e.g. Leaked credentials).

The **Source** filter enables you to specify the source of the risk detection (such as Azure AD or Microsoft Cloud App Security). 

The **Token issuer type** filter allows you to specify where the token was issued (such as Azure AD or AD Federation Services)


### Download risk detections data

You can download the risk detections data if you want work with it outside the Azure portal. Clicking Download creates a CSV file of the most recent 5,000 records. 

## Next steps

To get an overview of Azure AD Identity Protection, see the [Azure AD Identity Protection overview](overview-v2.md).
