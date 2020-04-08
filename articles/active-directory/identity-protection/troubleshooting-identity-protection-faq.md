---
title: FAQs for Identity Protection in Azure Active Directory
description: Frequently asked questions Azure AD Identity Protection

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: troubleshooting
ms.date: 12/13/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sahandle

ms.collection: M365-identity-device-management
---
# Frequently asked questions Identity Protection in Azure Active Directory

## Dismiss user risk known issues

**Dismiss user risk** in classic Identity Protection sets the actor in the user’s risk history in Identity Protection to **Azure AD**.

**Dismiss user risk** in Identity Protection sets the actor in the user’s risk history in Identity Protection to **\<Admin’s name with a hyperlink pointing to user’s blade\>**.

There is a current known issue causing latency in the user risk dismissal flow. If you have a "User risk policy", this policy will stop applying to dismissed users within minutes of clicking on "Dismiss user risk". However, there are known delays with the UX refreshing the "Risk state" of dismissed users. As a workaround, refresh the page on the browser level to see the latest user "Risk state".

## Risky users report known issues

Queries on the **username** field are case-sensitive, while queries on the **Name** field are case-agnostic.

Toggling **Show dates as** hides the **RISK LAST UPDATED** column. To readd the column click **Columns** at the top of the Risky Users blade.

**Dismiss all events** in classic Identity Protection sets the status of the risk detections to **Closed (resolved)**.

## Risky sign-ins report known issues

**Resolve** on a risk detection sets the status to **Users passed MFA driven by risk-based policy**.

## Frequently asked questions

### Why is a user is at risk?

If you are an Azure AD Identity Protection customer, go to the [risky users](howto-identity-protection-investigate-risk.md#risky-users) view and click on an at-risk user. In the drawer at the bottom, tab ‘Risk history’ will show all the events that led to a user risk change. To see all risky sign-ins for the user, click on ‘User’s risky sign-ins’. To see all risk detections for this user, click on ‘User’s risk detections’.

### How can I get a report of detections of a specific type?

Go to the risk detections view and filter by ‘Detection type’. You can then download this report in .CSV or .JSON format using the **Download** button at the top. For more information, see the article [How To: Investigate risk](howto-identity-protection-investigate-risk.md#risk-detections).

### Why can’t I set my own risk levels for each risk detection?

Risk levels in Identity Protection are based on the precision of the detection and powered by our supervised machine learning. To customize what experience users are presented, administrator can include/exclude certain users/groups from the User Risk and Sign-In Risk Policies.

### Why does the location of a sign-in not match where the user truly signed in from?

IP geolocation mapping is an industry-wide challenge. If you feel that the location listed in the sign-ins report does not match the actual location, reach out to Microsoft support. 

### How can I close specific risk detections like I did in the old UI?

You can give feedback on risk detections by confirming the linked sign-in as compromised or safe. The feedback given on the sign-in trickles down to all the detections made on that sign-in. If you want to close detections that are not linked to a sign-in, you can provide that feedback on the user level. For more information, see the article [How to: Give risk feedback in Azure AD Identity Protection](howto-identity-protection-risk-feedback.md).

### How far can I go back in time to understand what’s going on with my user?

- The [risky users](howto-identity-protection-investigate-risk.md#risky-users) view shows a user’s risk standing based on all past sign-ins. 
- The [risky sign-ins](howto-identity-protection-investigate-risk.md#risky-sign-ins) view shows at-risk signs in the last 30 days. 
- The [risk detections](howto-identity-protection-investigate-risk.md#risk-detections) view shows risk detections made in the last 90 days.

### How can I learn more about a specific detection?

All risk detections are documented in the article [What is risk](concept-identity-protection-risks.md#risk-types-and-detection). You can hover over the (i) symbol next to the detection on the Azure portal to learn more about a detection.

### How do the feedback mechanisms in Identity Protection work?

**Confirm compromised** (on a sign-in) – Informs Azure AD Identity Protection that the sign-in was not performed by the identity owner and indicates a compromise.

- Upon receiving this feedback, we move the sign-in and user risk state to **Confirmed compromised** and risk level to **High**.

- In addition, we provide the information to our machine learning systems for future improvements in risk assessment.

    > [!NOTE]
    > If the user is already remediated, don't click **Confirm compromised** because it moves the sign-in and user risk state to **Confirmed compromised** and risk level to **High**.

**Confirm safe** (on a sign-in) – Informs Azure AD Identity Protection that the sign-in was performed by the identity owner and does not indicate a compromise.

- Upon receiving this feedback, we move the sign-in (not the user) risk state to **Confirmed safe** and the risk level to **-**.

- In addition, we provide the information to our machine learning systems for future improvements in risk assessment.

    > [!NOTE]
    > If you believe the user is not compromised, use **Dismiss user risk** on the user level instead of using **Confirmed safe** on the sign-in level. A **Dismiss user risk** on the user level closes the user risk and all past risky sign-ins and risk detections.

### Why am I seeing a user with a low (or above) risk score, even if no risky sign-ins or risk detections are shown in Identity Protection?

Given the user risk is cumulative in nature and does not expire, a user may have a user risk of low or above even if there are no recent risky sign-ins or risk detections shown in Identity Protection. This situation could happen if the only malicious activity on a user took place beyond the timeframe for which we store the details of risky sign-ins and risk detections. We do not expire user risk because bad actors have been known to stay in customers' environment over 140 days behind a compromised identity before ramping up their attack. Customers can review the user's risk timeline to understand why a user is at risk by going to: `Azure Portal > Azure Active Directory > Risky users’ report > Click on an at-risk user > Details’ drawer > Risk history tab`

### Why does a sign-in have a “sign-in risk (aggregate)” score of High when the detections associated with it are of low or medium risk?

The high aggregate risk score could be based on other features of the sign-in, or the fact that more than one detection fired for that sign-in. And conversely, a sign-in may have a sign-in risk (aggregate) of Medium even if the detections associated with the sign-in are of High risk. 
