---
title: Identity Protection for a customer app
description: Learn how to add Identity Protection to your customer-facing (CIAM) application to provide ongoing risk detection.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 07/12/2023
ms.author: mimart
ms.custom: it-pro

---
# Investigate risk with Identity Protection in Microsoft Entra ID for customers

Microsoft Entra [Identity Protection](../../identity-protection/overview-identity-protection.md) provides ongoing risk detection for your customer tenant. It allows organizations to discover, investigate, and remediate identity-based risks. Identity Protection comes with risk reports that can be used to investigate identity risks in customer tenants. In this article, you learn how to investigate and mitigate risks.

## Identity Protection reporting

Identity Protection provides two reports. The *Risky users* report is where administrators can find which users are at risk and details about detections. The *risk detections* report gives information about each risk detection. This report includes the risk type, other risks triggered at the same time, the location of the sign-in attempt, and more.

Each report launches with a list of all detections for the period shown at the top of the report. Reports can be filtered using the filters across the top of the report. Administrators can choose to download the data, or use [MS Graph API and Microsoft Graph PowerShell SDK](../../identity-protection/howto-identity-protection-graph-api.md) to continuously export the data.

## Service limitations and considerations

Consider the following points when using Identity Protection:

- Identity Protection is not available in trial tenants.
- Identity Protection is on by default.
- Identity Protection is available for both local and social identities, such as Google or Facebook. Detection is limited because the external identity provider manages the social account credentials.
- Currently in Microsoft Entra customer tenants, a subset of the [Microsoft Entra ID Protection risk detections](../../identity-protection/overview-identity-protection.md) is available. Microsoft Entra ID for customers supports the following risk detections:  

|Risk detection type  |Description  |
|---------|---------|
| Atypical travel     | Sign-in from an atypical location based on the user's recent sign-ins.        |
|Anonymous IP address     | Sign-in from an anonymous IP address (for example: Tor browser, anonymizer VPNs).        |
|Malware linked IP address     | Sign-in from a malware linked IP address.         |
|Unfamiliar sign-in properties     | Sign-in with properties we haven't seen recently for the given user.        |
|Admin confirmed user compromised    | An admin has indicated that a user was compromised.             |
|Password spray     | Sign-in through a password spray attack.      |
|Microsoft Entra threat intelligence     | Microsoft's internal and external threat intelligence sources have identified a known attack pattern.        |

## Investigate risky users

With the information provided by the **Risky users** report, administrators can find:

- The **Risk state**, showing which users are **At risk**, have had risk **Remediated**, or have had risk **Dismissed**
- Details about detections
- History of all risky sign-ins
- Risk history
 
Administrators can then choose to take action on these events. Administrators can choose to:

- Reset the user password
- Confirm user compromise
- Dismiss user risk
- Block user from signing in
- Investigate further using Azure ATP

An administrator can choose to dismiss a user's risk in the Microsoft Entra admin center or programmatically through the Microsoft Graph API [Dismiss User Risk](/graph/api/riskyusers-dismiss?preserve-view=true&view=graph-rest-beta). Administrator privileges are required to dismiss a user's risk. The risky user or an administrator working on the user's behalf can remediate the risk, for example through a password reset.

### Navigating the risky users report

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com).

1. Make sure you're using the directory that contains your Microsoft Entra customer tenant: Select the Directories + subscriptions icon :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the toolbar and find your customer tenant in the list. If it's not the current directory, select **Switch**.

1. Browse to **Identity** > **Protection** > **Security Center**.

1. Select **Identity Protection**.

1. Under **Report**, select **Risky users**.

    Selecting individual entries expands a details window below the detections. The details view allows administrators to investigate and perform actions on each detection.

## Risk detections report

The **Risk detections** report contains filterable data for up to the past 90 days (three months).

With the information provided by the risk detections report, administrators can find:

- Information about each risk detection including type.
- Other risks triggered at the same time.
- Sign-in attempt location.

Administrators can then choose to return to the user's risk or sign-ins report to take actions based on information gathered.

### Navigating the risk detections report

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com). 
 
1. Browse to **Identity** > **Protection** > **Security Center**.

1. Select **Identity Protection**.

1. Under **Report**, select **Risk detections**.
