---
title: Manage Microsoft Entra users - Azure Database for PostgreSQL - Flexible Server
description: This article describes how you can manage Microsoft Entra ID enabled roles to interact with an Azure Database for PostgreSQL - Flexible Server.
author: achudnovskij
ms.author: anchudno
ms.reviewer: maghan
ms.date: 11/04/2022
ms.service: postgresql
ms.subservice: flexible-server
ms.custom: devx-track-arm-template
ms.topic: how-to
---

# Manage Microsoft Entra roles in Azure Database for PostgreSQL - Flexible Server 

[!INCLUDE [applies-to-postgresql-Flexible-server](../includes/applies-to-postgresql-Flexible-server.md)]

This article describes how you can create a Microsoft Entra ID enabled database roles within an Azure Database for PostgreSQL server.

> [!NOTE]  
> This guide assumes you already enabled Microsoft Entra authentication on your PostgreSQL Flexible server.
> See [How to Configure Microsoft Entra authentication](./how-to-configure-sign-in-azure-ad-authentication.md)

If you like to learn about how to create and manage Azure subscription users and their privileges, you can visit the [Azure role-based access control (Azure RBAC) article](../../role-based-access-control/built-in-roles.md) or review [how to customize roles](../../role-based-access-control/custom-roles.md).

<a name='create-or-delete-azure-ad-administrators-using-azure-portal-or-azure-resource-manager-arm-api'></a>

## Create or Delete Microsoft Entra administrators using Azure portal or Azure Resource Manager (ARM) API

1. Open **Authentication** page for your Azure Database for PostgreSQL Flexible Server in Azure portal
1. To add an administrator - select **Add Microsoft Entra Admin**  and select a user, group, application or a managed identity from the current Microsoft Entra tenant.
1. To remove an administrator - select **Delete** icon for the one to remove.
1. Select **Save** and wait for provisioning operation to completed.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/how-to-manage-azure-ad-users/add-aad-principal-via-portal.png" alt-text="Screenshot of managing Microsoft Entra administrators via portal.":::

> [!NOTE]  
> Support for Microsoft Entra Administrators management via Azure SDK, az cli and Azure PowerShell is coming soon.

<a name='manage-azure-ad-roles-using-sql'></a>

## Manage Microsoft Entra roles using SQL

Once first Microsoft Entra administrator is created from the Azure portal or API, you can use the administrator role to manage Microsoft Entra roles in your Azure Database for PostgreSQL Flexible Server.

We recommend getting familiar with [Microsoft identity platform](../../active-directory/develop/v2-overview.md). for best use of Microsoft Entra integration with Azure Database for PostgreSQL Flexible Servers.

### Principal Types

Azure Database for PostgreSQL Flexible servers internally stores mapping between PostgreSQL database roles and unique identifiers of AzureAD objects.
Each PostgreSQL database role can be mapped to one of the following Microsoft Entra object types:

1. **User** - Including Tenant local and guest users.
1. **Service Principal**. Including [Applications and Managed identities](../../active-directory/develop/app-objects-and-service-principals.md)
1. **Group**  When a PostgreSQL Role is linked to a Microsoft Entra group, any user or service principal member of this group can connect to the Azure Database for PostgreSQL Flexible Server instance with the group role.

<a name='list-azure-ad-roles-using-sql'></a>

### List Microsoft Entra roles using SQL

```sql
select * from pgaadauth_list_principals(true);
```

**Parameters:**
- *true*  -will return Admin users.
- *false* -will return all Microsoft Entra user both Microsoft Entra admins and Non Microsoft Entra admins.

<a name='create-a-role-using-azure-ad-principal-name'></a>

## Create a role using Microsoft Entra principal name

```sql
select * from pgaadauth_create_principal('<roleName>', <isAdmin>, <isMfa>);

For example: select * from pgaadauth_create_principal('mary@contoso.com', false, false);
```

**Parameters:**
- *roleName* - Name of the role to be created. This **must match a name of Microsoft Entra principal**:
   - For **users** use User Principal Name from Profile. For guest users, include the full name in their home domain with #EXT# tag.
   - For **groups** and **service principals** use display name. The name must be unique in the tenant.
- *isAdmin* - Set to **true** if when creating an admin user and **false** for a regular user. Admin user created this way has the same privileges as one created via portal or API.
- *isMfa* - Flag if Multi Factor Authentication must be enforced for this role.

<a name='create-a-role-using-azure-ad-object-identifier'></a>

## Create a role using Microsoft Entra object identifier

```sql
select * from pgaadauth_create_principal_with_oid('<roleName>', '<objectId>', '<objectType>', <isAdmin>, <isMfa>);

For example: select * from pgaadauth_create_principal_with_oid('accounting_application', '00000000-0000-0000-0000-000000000000', 'service', false, false);
```

**Parameters:**
- *roleName* - Name of the role to be created.
- *objectId* - Unique object identifier of the Microsoft Entra object:
   - For **Users**, **Groups** and **Managed Identities** the ObjectId can be found by searching for the object name in Microsoft Entra ID page in Azure portal. [See this guide as example](/partner-center/find-ids-and-domain-names)
   - For **Applications**, Objectid of the corresponding **Service Principal** must be used. In Azure portal the required ObjectId can be found on **Enterprise Applications** page.
- *objectType* - Type of the Microsoft Entra object to link to this role: service, user, group.
- *isAdmin* - Set to **true** if when creating an admin user and **false** for a regular user. Admin user created this way has the same privileges as one created via portal or API.
- *isMfa* - Flag if Multi Factor Authentication must be enforced for this role.

<a name='enable-azure-ad-authentication-for-an-existing-postgresql-role-using-sql'></a>

## Enable Microsoft Entra authentication for an existing PostgreSQL role using SQL

Azure Database for PostgreSQL Flexible Servers uses Security Labels associated with database roles to store Microsoft Entra ID mapping.

You can use the following SQL to assign security label:

```sql
SECURITY LABEL for "pgaadauth" on role "<roleName>" is 'aadauth,oid=<objectId>,type=<user|group|service>,admin';
```

**Parameters:**
- *roleName* - Name of an existing PostgreSQL role to which Microsoft Entra authentication needs to be enabled.
- *objectId* - Unique object identifier of the Microsoft Entra object.
- *user* - End user principals.
- *service* - Applications or Managed Identities connecting under their own service credentials.
- *group* - Name of Microsoft Entra group.

## Next steps

- Review the overall concepts for [Microsoft Entra authentication with Azure Database for PostgreSQL - Flexible Server](concepts-azure-ad-authentication.md)
