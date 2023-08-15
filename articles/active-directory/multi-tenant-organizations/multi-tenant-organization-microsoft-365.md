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

The multi-tenant organization capability is designed for organizations that own multiple Azure Active Directory (Azure AD) tenants and want to streamline intra-organization cross-tenant collaboration in Microsoft 365. It's built on the premise of reciprocal provisioning of B2B member users across multi-tenant organization tenants.

## Microsoft 365 people search

[Teams external access](/microsoftteams/communicate-with-users-from-other-organizations) and [Teams shared channels](/microsoftteams/shared-channels#getting-started-with-shared-channels) excluded, [Microsoft 365 people search](/microsoft-365/enterprise/multi-tenant-people-search) is typically scoped to within local tenant boundaries. In multi-tenant organizations with increased need for cross-tenant coworker collaboration, it's recommended to reciprocally provision users from their home tenants into the resource tenants of collaborating coworkers.

## New Microsoft Teams

The [new Microsoft Teams](/microsoftteams/new-teams-desktop-admin) experience improves upon Microsoft 365 people search and Teams external access for a unified seamless collaboration experience. For this improved experience to light up, the multi-tenant organization representation in Azure AD is required and collaborating users shall be provisioned as B2B members.

## Collaborating user set

Collaboration in Microsoft 365 is built on the premise of reciprocal provisioning of B2B identities across multi-tenant organization tenants.

For example, say Annie in tenant A, Bob and Barbara in tenant B, and Charlie in tenant C want to collaborate. Conceptually, these four users represent a collaborating user set of four internal identities across three tenants.

:::image type="content" source="./media/multi-tenant-organization-microsoft-365/multi-tenant-users.png" alt-text="Diagram that shows users in multiple tenants." lightbox="./media/multi-tenant-organization-microsoft-365/multi-tenant-users.png":::

For people search to succeed, while scoped to local tenant boundaries, the entire collaborating user set must be represented within the scope of each multi-tenant organization tenant A, B, and C, in the form of either internal or B2B identities.

:::image type="content" source="./media/multi-tenant-organization-microsoft-365/multi-tenant-user-set.png" alt-text="Diagram that shows users represented across multiple tenants." lightbox="./media/multi-tenant-organization-microsoft-365/multi-tenant-user-set.png":::

Depending on your organization’s needs, the collaborating user set may contain a subset of collaborating employees, or eventually all employees.

## Sharing your users

One of the simpler ways to achieve a collaborating user set in each multi-tenant organization tenant is for each tenant administrator to define their user contribution and synchronization them outbound. Tenant administrators on the receiving end should accept the shared users inbound.

- Administrator A contributes or shares Annie
- Administrator B contributes or shares Bob and Barbara
- Administrator C contributes or shares Charles

:::image type="content" source="./media/multi-tenant-organization-microsoft-365/multi-tenant-user-sync.png" alt-text="Diagram that shows users synchronized across multiple tenants." lightbox="./media/multi-tenant-organization-microsoft-365/multi-tenant-user-sync.png":::

Microsoft 365 admin center facilitates orchestration of such a collaborating user set across multi-tenant organization tenants, see [Synchronize users in multi-tenant organizations in Microsoft 365 (Preview)](/microsoft-365/enterprise/sync-users-multi-tenant-orgs?branch=mikeplum-mto).

Alternatively, pair-wise configuration of inbound and outbound cross-tenant synchronization can be used to orchestrate such collating user set across multi-tenant organization tenants, see [What is a cross-tenant synchronization](cross-tenant-synchronization-overview.md).

## Next steps

- [Plan for multi-tenant organizations in Microsoft 365](/microsoft-365/enterprise/plan-multi-tenant-org-overview?branch=mikeplum-mto)
- [Set up a multi-tenant org in Microsoft 365](/microsoft-365/enterprise/set-up-multi-tenant-org?branch=mikeplum-mto)
