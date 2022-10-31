---

title: Identity protection risk analysis workbook in Azure AD | Microsoft Docs
description: Learn how to use the identity protection risk analysis workbook.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''

ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 08/26/2022
ms.author: billmath
ms.reviewer: chuqiaoshi 

ms.collection: M365-identity-device-management
---
# Identity protection risk analysis workbook

Azure AD Identity Protection detects, remediates, and prevents compromised identities. As an IT administrator, you want to understand risk trends in your organizations and opportunities for better policy configuration. With the Identity Protection Risky Analysis Workbook, you can answer common questions about your Identity Protection implementation.

This article provides you with an overview of this workbook.

## Description

![Workbook category](./media/workbook-risk-analysis/workbook-category.png)

As an IT administrator, you need to understand trends in identity risks and gaps in your policy implementations, to ensure you're best protecting your organizations from identity compromise. The identity protection risk analysis workbook helps you analyze the state of risk in your organization.

**This workbook:**

- Provides visualizations of where in the world risk is being detected.
- Allows you to understand the trends in real time vs. Offline risk detections.
- Provides insight into how effective you are at responding to risky users.

## Sections

This workbook has five sections:

- Heatmap of risk detections
- Offline vs real-time risk detections
- Risk detection trends
- Risky users
- Summary

## Filters

This workbook supports setting a time range filter.

![Set time range filter](./media/workbook-risk-analysis/time-range-filter.png)

There are more filters in the risk detection trends and risky users sections. 

Risk Detection Trends:

- Detection timing type (real-time or offline)
- Risk level (low, medium, high, or none)

Risky Users:

- Risk detail (which indicates what changed a user’s risk level)
- Risk level (low, medium, high, or none)

## Best practices

- **[Enable risky sign-in policies](../identity-protection/concept-identity-protection-policies.md#sign-in-risk-based-conditional-access-policy)** - To prompt for multi-factor authentication (MFA) on medium risk or above. Enabling the policy reduces the proportion of active real-time risk detections by allowing legitimate users to self-remediate the risk detections with MFA.

- **[Enable a risky user policy](../identity-protection/howto-identity-protection-configure-risk-policies.md#user-risk-policy-in-conditional-access)** - To enable users to securely remediate their accounts when they're high risk. Enabling the policy reduces the number of active at-risk users in your organization by returning the user’s credentials to a safe state.

## Next steps

- To learn more about identity protection, see [What is identity protection](../identity-protection/overview-identity-protection.md). 
- For more information about Azure AD workbooks, see [How to use Azure AD workbooks](howto-use-azure-monitor-workbooks.md).
