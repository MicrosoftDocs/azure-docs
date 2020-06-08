---
title: Azure Active Directory operations reference guide
description: This operations reference guide describes the checks and actions you should take to secure and maintain identity and access management, authentication, governance, and operations
services: active-directory
author: martincoetzer
manager: daveba
tags: azuread
ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.subservice: fundamentals
ms.date: 10/31/2019
ms.author: martinco
---

# Azure Active Directory operations reference guide

This operations reference guide describes the checks and actions you should take to secure and maintain the following areas:

- **[Identity and access management](active-directory-ops-guide-iam.md)** - ability to manage the lifecycle of identities and their entitlements.
- **[Authentication management](active-directory-ops-guide-auth.md)** - ability to manage credentials, define authentication experience, delegate assignment, measure usage, and define access policies based on enterprise security posture.
- **[Governance](active-directory-ops-guide-govern.md)** - ability to assess and attest the access granted non-privileged and privileged identities, audit, and control changes to the environment.
- **[Operations](active-directory-ops-guide-ops.md)** - optimize the operations Azure Active Directory (Azure AD).

Some recommendations here might not be applicable to all customers’ environment, for example, AD FS best practices might not apply if your organization uses password hash sync.

> [!NOTE]
> These recommendations are current as of the date of publishing but can change over time. Organizations should continuously evaluate their identity practices as Microsoft products and services evolve over time. Recommendations can change when organizations subscribe to a different Azure AD Premium license. For example, Azure AD Premium P2 will include more governance recommendations.

## Stakeholders

Each section in this reference guide recommends assigning stakeholders to plan and implement key tasks successfully. The following table outlines the list of all the stakeholders in this guide:

| Stakeholder | Description |
| :- | :- |
| IAM Operations Team | This team handles managing the day to day operations of the Identity and Access Management system |
| Productivity Team | This team owns and manages the productivity applications such as email, file sharing and collaboration, instant messaging, and conferencing. |
| Application Owner | This team owns the specific application from a business and usually a technical perspective in an organization. |
| InfoSec Architecture Team | This team plans and designs the Information Security practices of an organization. |
| InfoSec Operations Team | This team runs and monitors the implemented Information Security practices of the InfoSec Architecture team. |

## Next steps

Get started with the [Identity and access management checks and actions](active-directory-ops-guide-iam.md).
