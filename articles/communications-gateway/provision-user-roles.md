---
title: Set up user roles for Azure Communications Gateway
description: Learn how to configure the user roles required to deploy, manage and monitor your Azure Communications Gateway
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 11/27/2023
---

# Set up user roles for Azure Communications Gateway

This article will guide you through how to configure the permissions required for staff in your organization to:

- Deploy Azure Communications Gateway through the portal
- Raise customer support requests (support tickets)
- Monitor Azure Communications Gateway
- Use the Number Management Portal for provisioning

## Prerequisites

Familiarize yourself with the Azure user roles relevant to Azure Communications Gateway by reading [Azure roles, Microsoft Entra roles, and classic subscription administrator roles](../role-based-access-control/rbac-and-directory-admin-roles.md).

A list of all available defined Azure roles is available in [Azure built-in roles](../role-based-access-control/built-in-roles.md).

## Understand the user roles required for Azure Communications Gateway

Your staff might need different user roles, depending on the tasks they need to carry out.

|Task  | Required user roles or access |
|---------|---------|
| Deploying Azure Communications Gateway |**Contributor** access to your subscription|
| Raising support requests |**Owner**, **Contributor** or **Support Request Contributor** access to your subscription or a custom role with `Microsoft.Support/*` access at the subscription level|
|Monitoring logs and metrics | **Reader** access to your subscription|
|Using the Number Management Portal| **Reader** access to your subscription and appropriate roles for the Project Synergy enterprise application: <!-- Must be kept in sync with step below for configuring and with manage-enterprise-operator-connect.md  --><br> - To view existing configuration: **PartnerSettings.Read**, **TrunkManagement.Read**, and **NumberManagement.Read**<br>- To configure your relationship to an enterprise (a _consent_) and numbers:  **PartnerSettings.Read**, **TrunkManagement.Read**, and **NumberManagement.Write**|

> [!TIP]
> To allow staff to  manage consents in the Number Management Portal without managing numbers, assign the **NumberManagement.Read**, **TrunkManagement.Read** and **PartnerSettings.Write** roles.

## Configure user roles

You need to use the Azure portal to configure user roles.

### Prepare to assign a user role

1. Read through [Steps to assign an Azure role](../role-based-access-control/role-assignments-steps.md) and ensure that you:
    - Know who needs access.
    - Know the appropriate user role or roles to assign them.
    - Are signed in with a user account with a role that can change role assignments for the subscription, such as **Owner** or **User Access Administrator**.
1. If you're managing access to the Number Management Portal, ensure that you're signed in with a user account that can change roles for enterprise applications. For example, you could be a Global Administrator, Cloud Application Administrator or Application Administrator. For more information, see [Assign users and groups to an application](../active-directory/manage-apps/assign-user-or-group-access-portal.md).

### Assign a user role

1. Follow the steps in [Assign a user role using the Azure portal](../role-based-access-control/role-assignments-portal.md) to assign the permissions you determined in [Understand the user roles required for Azure Communications Gateway](#understand-the-user-roles-required-for-azure-communications-gateway).
1. If you're managing access to the Number Management Portal, follow [Assign users and groups to an application](/entra/identity/enterprise-apps/assign-user-or-group-access-portal?pivots=portal) to assign suitable roles for each user in the Project Synergy application.
    <!-- Must be kept in sync with step 1 and with manage-enterprise-operator-connect.md  -->
    * To view existing configuration: **PartnerSettings.Read**, **TrunkManagement.Read**, and **NumberManagement.Read**
    * To make changes to consents and numbers: **PartnerSettings.Read**, **TrunkManagement.Read**, and **NumberManagement.Write**

## Next steps

- Learn how to remove access to the Azure Communications Gateway subscription by [removing Azure role assignments](../role-based-access-control/role-assignments-remove.md).
