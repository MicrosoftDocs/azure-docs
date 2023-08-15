---
title: Multi-tenant organization identity provisioning for Microsoft 365 (Preview)
description: Learn how multi-tenant organizations identity provisioning and Microsoft 365 work together.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: multi-tenant-organizations
ms.topic: conceptual
ms.date: 06/30/2023
ms.author: rolyon
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# Multi-tenant organization identity provisioning for Microsoft 365 (Preview)

> [!IMPORTANT]
> Multi-tenant organization is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The multi-tenant organization capability is designed for organizations that own multiple Azure AD tenants and want to streamline intra-organization cross-tenant collaboration in Microsoft 365. It is built on the premise of reciprocal provisioning of B2B member users across multi-tenant organization tenants.

## Microsoft 365 People Search

Teams External Access and Teams Shared Channels excluded, Microsoft 365 People Search is typically scoped to within local tenant boundaries. In multi-tenant organizations with increased need for cross-tenant coworker collaboration, it is recommended to reciprocally provision users from their home tenants into the resource tenants of collaborating coworkers.

## new Microsoft Teams

The new Microsoft Teams experience improves upon Microsoft 365 People Search and Teams External Access  for a unified seamless collaboration experience. For this improved experience to light up, the multi-tenant organization representation in Azure AD is required and collaborating users shall be provisioned as B2B members.

## Collaborating user set

Collaboration in Microsoft 365 is built on the premise of reciprocal provisioning of B2B identities across multi-tenant organization tenants.

Say Annie in tenant A, Bob and Barbara in tenant B, and Charlie in tenant C want to collaborate. Conceptually, these four users represent a collaborating user set of four internal identities across three tenants:

For People Search to succeed, while scoped to local tenant boundaries, the entire collaborating user set shall be represented within the scope of each multi-tenant organization tenant A, B, and C, in the form of either internal or B2B identities:

Depending on your organization’s needs, the collaborating user set may contain a subset of collaborating employees, or eventually all employees.

## Sharing your users

One of the simpler ways to achieve a collaborating user set in each multi-tenant organization tenant is for each tenant admin to define their user contribution and sync them outbound. Tenant admins on the receiving end should accept the shared users inbound.

Admin A contributes or shares Annie:

Admin B contributes or shares Bob and Barbara:

Admin C contributes or shares Charles:

Microsoft admin center facilitates orchestration of such a collaborating user set across multi-tenant organization tenants, see Synchronize users in multi-tenant organizations in Microsoft 365.

Alternatively, pair-wise configuration of inbound and outbound cross-tenant synchronization can be used to used to orchestrate such collating user set across multi-tenant organization tenants, see What is a cross-tenant synchronization in Azure Active Directory

## Next steps
