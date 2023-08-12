---
title: Manage Azure Active Directory Users - Azure Database for PostgreSQL - Flexible Server
description: This article describes how you can manage Azure AD enabled roles to interact with an Azure Database for PostgreSQL - Flexible Server.
author: achudnovskij
ms.author: anchudno
ms.reviewer: maghan
ms.date: 11/04/2022
ms.service: postgresql
ms.subservice: flexible-server
ms.custom: devx-track-arm-template
ms.topic: how-to
---

# Manage Azure Active Directory roles in Azure Database for PostgreSQL - Flexible Server 

[!INCLUDE [applies-to-postgresql-Flexible-server](../includes/applies-to-postgresql-Flexible-server.md)]

This article describes how you can create an Azure Active Directory (Azure AD) enabled database roles within an Azure Database for PostgreSQL server.

> [!NOTE]  
> This guide assumes you already enabled Azure Active Directory authentication on your PostgreSQL Flexible server.
> See [How to Configure Azure AD Authentication](./how-to-configure-sign-in-azure-ad-authentication.md)

If you like to learn about how to create and manage Azure subscription users and their privileges, you can visit the [Azure role-based access control (Azure RBAC) article](../../role-based-access-control/built-in-roles.md) or review [how to customize roles](../../role-based-access-control/custom-roles.md).

## Create or Delete Azure AD administrators using Azure portal or Azure Resource Manager (ARM) API

1. Open **Authentication** page for your Azure Database for PostgreSQL Flexible Server in Azure portal
1. To add an administrator - select **Add Azure AD Admin**  and select a user, group, application or a managed identity from the current Azure AD tenant.
1. To remove an administrator - select **Delete** icon for the one to remove.
1. Select **Save** and wait for provisioning operation to completed.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/how-to-manage-azure-ad-users/add-aad-principal-via-portal.png" alt-text="Screenshot of managing Azure AD administrators via portal.":::

> [!NOTE]  
> Support for Azure AD Administrators management via Azure SDK, az cli and Azure PowerShell is coming soon.

## Manage Azure AD roles using SQL

Once first Azure AD administrator is created from the Azure portal or API, you can use the administrator role to manage Azure AD roles in your Azure Database for PostgreSQL Flexible Server.

We recommend getting familiar with [Microsoft identity platform](../../active-directory/develop/v2-overview.md). for best use of Azure AD integration with Azure Database for PostgreSQL Flexible Servers.

### Principal Types

Azure Database for PostgreSQL Flexible servers internally stores mapping between PostgreSQL database roles and unique identifiers of AzureAD objects.
Each PostgreSQL database role can be mapped to one of the following Azure AD object types:

1. **User** - Including Tenant local and guest users.
1. **Service Principal**. Including [Applications and Managed identities](../../active-directory/develop/app-objects-and-service-principals.md)
1. **Group**  When a PostgreSQL Role is linked to an Azure AD group, any user or service principal member of this group can connect to the Azure Database for PostgreSQL Flexible Server instance with the group role.

### List Azure AD roles using SQL

```sql
select * from pgaadauth_list_principals(true);
```

**Parameters:**
- *true*  -will return Admin users.
- *false* -will return all AAD user both AAD admins and Non AAD admins.

## Create a role using Azure AD principal name

```sql
select * from pgaadauth_create_principal('<roleName>', <isAdmin>, <isMfa>);

For example: select * from pgaadauth_create_principal('mary@contoso.com', false, false);
```

**Parameters:**
- *roleName* - Name of the role to be created. This **must match a name of Azure AD principal**:
   - For **users** use User Principal Name from Profile. For guest users, include the full name in their home domain with #EXT# tag.
   - For **groups** and **service principals** use display name. The name must be unique in the tenant.
- *isAdmin* - Set to **true** if when creating an admin user and **false** for a regular user. Admin user created this way has the same privileges as one created via portal or API.
- *isMfa* - Flag if Multi Factor Authentication must be enforced for this role.

## Create a role using Azure AD object identifier

```sql
select * from pgaadauth_create_principal_with_oid('<roleName>', '<objectId>', '<objectType>', <isAdmin>, <isMfa>);

For example: select * from pgaadauth_create_principal_with_oid('accounting_application', '00000000-0000-0000-0000-000000000000', 'service', false, false);
```

**Parameters:**
- *roleName* - Name of the role to be created.
- *objectId* - Unique object identifier of the Azure AD object:
   - For **Users**, **Groups** and **Managed Identities** the ObjectId can be found by searching for the object name in Azure AD page in Azure portal. [See this guide as example](/partner-center/find-ids-and-domain-names)
   - For **Applications**, Objectid of the corresponding **Service Principal** must be used. In Azure portal the required ObjectId can be found on **Enterprise Applications** page.
- *objectType* - Type of the Azure AD object to link to this role: service, user, group.
- *isAdmin* - Set to **true** if when creating an admin user and **false** for a regular user. Admin user created this way has the same privileges as one created via portal or API.
- *isMfa* - Flag if Multi Factor Authentication must be enforced for this role.

## Enable Azure AD authentication for an existing PostgreSQL role using SQL

Azure Database for PostgreSQL Flexible Servers uses Security Labels associated with database roles to store Azure AD mapping.

You can use the following SQL to assign security label:

```sql
SECURITY LABEL for "pgaadauth" on role "<roleName>" is 'aadauth,oid=<objectId>,type=<user|group|service>,admin';
```

**Parameters:**
- *roleName* - Name of an existing PostgreSQL role to which Azure AD authentication needs to be enabled.
- *objectId* - Unique object identifier of the Azure AD object.
- *user* - End user principals.
- *service* - Applications or Managed Identities connecting under their own service credentials.
- *group* - Name of Azure AD Group.

## Next steps

- Review the overall concepts for [Azure Active Directory authentication with Azure Database for PostgreSQL - Flexible Server](concepts-azure-ad-authentication.md)
