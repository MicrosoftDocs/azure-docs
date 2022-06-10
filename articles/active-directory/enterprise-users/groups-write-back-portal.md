---
title: Group writeback portal operations (preview) in Azure Active Directory
description: The access points for group writeback to on-premises Active Directory in the Azure Active Directory admin center.
keywords:
author: curtand
manager: karenhoran
ms.author: curtand
ms.reviewer: krbain
ms.date: 06/09/2022
ms.topic: how-to
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
services: active-directory
ms.custom: "it-pro"

#Customer intent: As a new Azure AD identity administrator, user management is at the core of my work so I need to understand the user management tools such as groups, administrator roles, and licenses to manage users.
ms.collection: M365-identity-device-management
---

# Group writeback in the Azure Active Directory admin center (preview)

Group writeback is a valuable tool for administrators of Azure Active Directory (Azure AD) tenants being synced with on-premises Active Directory groups. Right now, Microsoft is previewing enhanced capabilities for group writeback, so that in the Azure AD admin center you can specify which groups you want to write back and what you’d like to each one write back as. You can write Microsoft 365 groups back to on-premises Active Directory as Distribution, Mail-Enabled Security, or Security groups, and write Security groups back as Security groups. Groups are written back with a scope of universal​.

## Show writeback columns

From the **All groups** overview page, you can add the group writeback columns **Target writeback type** and **Writeback enabled**.

​:::image type="content" source="./media/groups-write-back-portal/all-groups-columns.png" alt-text="Selecting columns for writeback in the All groups list.":::

## Writeback column settings

Writeback enabled is the column that will allow you to turn the writeback capability off for a particular group(s) & Target writeback type is the column that allows you to select what group type you want this cloud group to be when synced to your on-prem active directory. For an Azure AD Microsoft 365 group, you can write it back as a security group, a distribution group, or a mail-enabled security group. For an Azure AD security group, you can write it back only as a security group.

:::image type="content" source="./media/groups-write-back-portal/all-groups-view.png" alt-text="Writeback settings columns are visible in the All groups page.":::

## Writeback settings in group properties

One can also configure this on an individual groups property blade. There is a new drop down labeled “group writeback state” which behaves as the other two columns do in the overview blade. When “No writeback” is selected, the group is not being written back. But if you select one of the viable writeback types as an option (i.e. Security) then you have enabled the group for writeback and are targeting the writeback type as a security group.

:::image type="content" source="./media/groups-write-back-portal/groups-properties-view.png" alt-text="Changing writeback settings in the group properties.":::
 
## Next steps

Check out the groups REST API documentation for the [preview writeback property on the settings template](../hybrid/how-to-connect-group-writeback.md).

For more about group writeback operations, see [Azure AD Connect group writeback](../hybrid/how-to-connect-group-writeback.md)
