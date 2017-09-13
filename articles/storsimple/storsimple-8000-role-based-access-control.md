---
title: Use Role-based Access Control for StorSimple | Microsoft Docs
description: Describes how to use Azure Role-based Access Control (RBAC) in the context of StorSimple.
services: storsimple
documentationcenter: ''
author: alkohli
manager: timlt
editor: ''

ms.assetid: 
ms.service: storsimple
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/13/2017
ms.author: alkohli

---
# Use Role-based Access Control for StorSimple

This article provides a brief description of how Azure Role-Based Access Control (RBAC) can be used for your StorSimple device. RBAC offers fine-grained access management for Azure. Use RBAC to grant just the right amount of access to the StorSimple users to do their jobs instead of giving everyone unrestricted access. For more information on the basics of access management in Azure, refer to [Get started with Role-based Access Control in the Azure portal](../active-directory/role-based-access-control-what-is.md).

This article applies to StorSimple 8000 series devices running Update 3.0 or later in the Azure portal.

## RBAC roles for StorSimple

RBAC can be assigned based on the roles. To view the different roles available for a StorSimple device user in the Azure portal, go to  

There are two types of roles that StorSimple users can choose from: built-in or custom.

* Built-in roles - The built-in roles ensure certain permission levels based on the available resources in the environment. The following built-in roles are available in Azure:
    * Owner
    * Contributor
    * Reader
    * User Access Administrator
    * Log Analytics Contributor
    * Log Analytics Reader
    * Monitoring Contributor
    * Monitoring Reader

    For more information, refer to [Built-in roles for Azure Role-based Access Control](../active-directory/role-based-access-built-in-roles.md).

* Custom roles - If the built-in roles do not suit your needs, you can create custom RBAC roles. To create a custom RBAC role, start with a built-in role, edit it, and then import it back in the environment. The download and upload of the role are managed using either PowerShell of CLI.

    It is important to understand the prerequisites of creating a custom role which can grant granular access at the subscription level and also allow the invited user the flexibility of opening support requests.

    For more information, refer to [Create custom roles for Role-based Access Control](../active-directory/role-based-access-control-custom-roles.md).

## Create a custom role for StorSimple Infrastructure Administrator

A StorSimple Infrastructure Admin (StorSimple Infra Admin) can manage the infrastructre management for the StorSimple devices. The following examples shows a custom role for a StorSimple Infrastructure Admin.

```
{
    "Name":  "Stor Simple Infra Admin",
    "Id":  "<guid>",
    "IsCustom":  true,
    "Description":  "Lets you view all devices, but not make any changes (except for clearAlerts, clertSettings, install, download etc.,).",
    "Actions":  [
                    "Microsoft.StorSimple/managers/alerts/read",
					"Microsoft.StorSimple/managers/devices/volumeContainers/read",
                    "Microsoft.StorSimple/managers/devices/jobs/read",
					"Microsoft.StorSimple/managers/alerts/read",
					"Microsoft.StorSimple/managers/devices/alertSettings/read",
					"Microsoft.StorSimple/managers/devices/alertSettings/write",
					"Microsoft.StorSimple/managers/clearAlerts/action",
					"Microsoft.StorSimple/managers/devices/networkSettings/read",
					"Microsoft.StorSimple/managers/devices/publishSupportPackage/action",
					"Microsoft.StorSimple/managers/devices/scanForUpdates/action",
					"Microsoft.StorSimple/managers/devices/metrics/read",
                ],
    "NotActions":  [

                   ],
    "AssignableScopes":  [
                             "/subscriptions/<subId>/"
                         ]
}
```


## Next steps

Learn how to [Assign custom roles for internal and external users](../active-directory/role-based-access-control-create-custom-roles-for-internal-external-users.md).

