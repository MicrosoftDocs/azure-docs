---
title: Set up user roles for Azure Communications Gateway
description: Learn how to configure the user roles required to deploy, manage, and monitor your Azure Communications Gateway.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 02/16/2024
---

# Set up user roles for Azure Communications Gateway

This article guides you through how to configure the permissions required for staff in your organization to:

- Deploy Azure Communications Gateway through the portal.
- Raise customer support requests (support tickets).
- Monitor Azure Communications Gateway.
- Use the Number Management Portal (preview) for provisioning the Operator Connect or Teams Phone Mobile environments.

For permissions for the Provisioning API, see [Integrate with Azure Communications Gateway's Provisioning API](integrate-with-provisioning-api.md).

## Prerequisites

Familiarize yourself with the Azure user roles relevant to Azure Communications Gateway by reading [Azure roles, Microsoft Entra roles, and classic subscription administrator roles](../role-based-access-control/rbac-and-directory-admin-roles.md).

A list of all available defined Azure roles is available in [Azure built-in roles](../role-based-access-control/built-in-roles.md).

## Understand the user roles required for Azure Communications Gateway

Your staff might need different user roles, depending on the tasks they need to carry out.

|Task  | Minimum required user role or access |
|---------|---------|
| Deploy Azure Communications Gateway or change its configuration. |**Contributor** access to the resource group.|
| Raise support requests. |**Owner**, **Contributor**, or **Support Request Contributor** access to your subscription or a custom role with `Microsoft.Support/*` access at the subscription level. |
| Monitor logs and metrics. | **Reader** access to the Azure Communications Gateway resource. |
| Use the Number Management Portal (preview) | **Reader** access to the Azure Communications Gateway resource and appropriate roles for the AzureCommunicationsGateway enterprise application: <!-- Must be kept in sync with step below for configuring and with manage-enterprise-operator-connect.md  --><br>- To view configuration: **ProvisioningAPI.ReadUser**.<br>- To add or make changes to configuration: **ProvisioningAPI.ReadUser** and **ProvisioningAPI.WriteUser**.<br>- To remove configuration: **ProvisioningAPI.ReadUser** and **ProvisioningAPI.DeleteUser**.<br>- To view, add, make changes to, or remove configuration: **ProvisioningAPI.AdminUser**. |

> [!IMPORTANT]
> The roles that you assign for the Number Management Portal apply to all Azure Communications Gateway resources in the same tenant.

## Configure user roles

You need to use the Azure portal to configure user roles.

### Prepare to assign a user role

1. Read through [Steps to assign an Azure role](../role-based-access-control/role-assignments-steps.md) and ensure that you:
    - Know who needs access.
    - Know the appropriate user role or roles to assign them.
    - Are signed in with a user account with a role that can change role assignments for the subscription, such as **Owner** or **User Access Administrator**.
1. If you're managing access to the Number Management Portal, ensure that you're signed in with a user account that can change roles for enterprise applications. For example, you could be a Global Administrator, Cloud Application Administrator, or Application Administrator. For more information, see [Assign users and groups to an application](../active-directory/manage-apps/assign-user-or-group-access-portal.md).

### Assign a user role

1. Follow the steps in [Assign a user role using the Azure portal](../role-based-access-control/role-assignments-portal.yml) to assign the permissions you determined in [Understand the user roles required for Azure Communications Gateway](#understand-the-user-roles-required-for-azure-communications-gateway).
1. If you're managing access to the Number Management Portal, also follow [Assign users and groups to an application](/entra/identity/enterprise-apps/assign-user-or-group-access-portal?pivots=portal) to assign suitable roles for each user in the AzureCommunicationsGateway enterprise application.

    <!-- Must be kept in sync with step 1 and with manage-enterprise-operator-connect.md  -->
    - To view configuration: **ProvisioningAPI.ReadUser**.
    - To add or make changes to configuration: **ProvisioningAPI.ReadUser** and **ProvisioningAPI.WriteUser**.
    - To remove configuration: **ProvisioningAPI.ReadUser** and **ProvisioningAPI.DeleteUser**.
    - To view, add, make changes to, or remove configuration: **ProvisioningAPI.AdminUser**.

    > [!IMPORTANT]
    > Ensure you configure these roles on the AzureCommunicationsGateway enterprise application (not the Project Synergy enterprise application for Operator Connect and Teams Phone Mobile). The ID application for AzureCommunicationsGateway is always `8502a0ec-c76d-412f-836c-398018e2312b`.

## Next steps

- Learn how to remove access to the Azure Communications Gateway subscription by [removing Azure role assignments](../role-based-access-control/role-assignments-remove.yml).
