---
title: Azure Active Directory Identity Protection security overview
description: Learn how the Security overview gives you an insight into your organization’s security posture. 

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: conceptual
ms.date: 08/22/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: sahandle

ms.collection: M365-identity-device-management
---
# Azure Active Directory Identity Protection - Security overview

The [Security overview](https://aka.ms/IdentityProtectionRefresh) in the Azure portal gives you an insight into your organization’s security posture. It helps identify potential attacks and understand the effectiveness of your policies.

The ‘Security overview’ is broadly divided into two sections:

- Trends, on the left, provide a timeline of risk in your organization.
- Tiles, on the right, highlight the key ongoing issues in your organization and suggest how to quickly take action.

:::image type="content" source="./media/concept-identity-protection-security-overview/01.png" alt-text="Screenshot of the Azure portal Security overview. Bar charts show the count of risks over time. Tiles summarize information on users and sign-ins." border="false":::

You can find the security overview page in the **Azure portal** > **Azure Active Directory** > **Security** > **Identity Protection** > **Overview**.

## Trends

### New risky users detected

This chart shows the number of new risky users that were detected over the chosen time period. You can filter the view of this chart by user risk level (low, medium, high). Hover over the UTC date increments to see the number of risky users detected for that day. Selecting this chart will bring you to the ‘Risky users’ report. To remediate users that are at risk, consider changing their password.

### New risky sign-ins detected

This chart shows the number of risky sign-ins detected over the chosen time period. You can filter the view of this chart by the sign-in risk type (real-time or aggregate) and the sign-in risk level (low, medium, high). Unprotected sign-ins are successful real-time risk sign-ins that weren't MFA challenged. (Note: Sign-ins that are risky because of offline detections can't be protected in real-time by sign-in risk policies). Hover over the UTC date increments to see the number of sign-ins detected at risk for that day. Selecting this chart will bring you to the ‘Risky sign-ins’ report.

## Tiles
 
###	High risk users

The ‘High risk users’ tile shows the latest count of users with high probability of identity compromise. These users should be a top priority for investigation. Selecting the ‘High risk users’ tile will redirect to a filtered view of the ‘Risky users’ report showing only users with a risk level of high. Using this report, you can learn more and remediate these users with a password reset.

:::image type="content" source="./media/concept-identity-protection-security-overview/02.png" alt-text="Screenshot of the Azure portal Security overview, with tiles visible for high-risk and medium-risk users and other risk factors." border="false":::

###	Medium risk users
The ‘Medium risk users’ tile shows the latest count of users with medium probability of identity compromise. Selecting the ‘Medium risk users’ tile will take you to a view of the ‘Risky users’ report showing only users with a risk level of medium. Using this report, you can further investigate and remediate these users.

### Unprotected risky sign-ins

The ‘Unprotected risky sign-ins' tile shows the last week’s count of successful, real-time risky sign-ins that weren't blocked or MFA challenged by a Conditional Access policy, Identity Protection risk policy, or per-user MFA. These successful sign-ins are potentially compromised and not challenged for MFA. To protect such sign-ins in future, apply a sign-in risk policy. Selecting the ‘Unprotected risky sign-ins' tile will take you to the sign-in risk policy configuration blade where you can configure the sign-in risk policy.

### Legacy authentication

The ‘Legacy authentication’ tile shows the last week’s count of legacy authentications with risk present in your organization. Legacy authentication protocols don't support modern security methods such as an MFA. To prevent legacy authentication, you can apply a Conditional Access policy. Selecting the ‘Legacy authentication’ tile will redirect you to the ‘Identity Secure Score’.

### Identity Secure Score

The Identity Secure Score measures and compares your security posture to industry patterns. If you select the **Identity Secure Score** tile, it will redirect to [Identity Secure Score](../fundamentals/identity-secure-score.md) where you can learn more about improving your security posture.

## Next steps

- [What is risk](concept-identity-protection-risks.md)
- [Policies available to mitigate risks](concept-identity-protection-policies.md)
