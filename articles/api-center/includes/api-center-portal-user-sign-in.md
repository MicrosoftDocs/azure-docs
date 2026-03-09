---
title: Include file
description: Include file
services: api-center


ms.service: azure-api-center
ms.topic: include
ms.date: 02/25/2026

ms.custom: Include file
---

When Microsoft Entra ID is configured for portal access, users must sign in to the API Center portal to access APIs. To enable sign-in, assign the **Azure API Center Data Reader** role to users or groups in your organization, scoped to your API center.

> [!NOTE]
> * When the Microsoft Entra ID app registration is set up automatically, the user who configures the portal is automatically assigned the **Azure API Center Data Reader** role. 
> * Be sure to assign the **Azure API Center Data Reader** role to other administrators of the API center.  

For detailed prerequisites and steps to assign a role to users and groups, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal). Brief steps follow:

1. In the [Azure portal](https://portal.azure.com), go to your API center.
1. In the sidebar menu, select **Access control (IAM)** > **+ Add role assignment**.
1. In the **Add role assignment** pane, set the values as follows:
    1. On the **Role** page, search for and select **Azure API Center Data Reader**. Select **Next**.
    1. On the **Members** page, In **Assign access to**, select **User, group, or service principal** > **+ Select members**.
    1. On the **Select members** page, search for and select the users or groups to assign the role to. Click **Select** and then **Next**.
    1. Review the role assignment, and select **Review + assign**.

> [!NOTE]
> To streamline access configuration for new users, we recommend that you assign the role to a Microsoft Entra group and configure a dynamic group membership rule. To learn more, see [Create or update a dynamic group in Microsoft Entra ID](/entra/identity/users/groups-create-rule).

After you configure access to the portal, users can sign in to the portal and view the APIs in your API center.

> [!NOTE]
> The first user to sign in to the portal is prompted to consent to the permissions requested by the API Center portal app registration. Thereafter, other configured users aren't prompted to consent.