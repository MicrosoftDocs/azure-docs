---
title: Configure role-based access controls in Azure IoT Central | Microsoft Docs
description: As an administrator, learn how to configure role-based access controls in your Azure IoT Central application.
author: dominicbetts
ms.author: dobett
ms.date: 10/11/2019
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: philmea
---

# Configure role-based access controls

[!INCLUDE [iot-central-pnp-original](../../../includes/iot-central-pnp-original-note.md)]

By default, you can assign users in your IoT Central application to one of three built-in *roles*:

- **Application Administrator**: Users in this role have access to all functionality in an Azure IoT Central application.
- **Application Builder**: Users in this role can do everything in an Azure IoT Central application except administer the application.
- **Application Operator**: Users in this role don't have access to **Design** mode or the **Application Builder** page. These users can't administer the application.

If your solution requires finer-grained access controls, you can create custom roles with custom sets of permissions. You can [add users to custom roles](./howto-manage-users-roles-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json#add-users) in the same way that you add users to the built-in roles.

## Custom role options

When you define a custom role, you choose the set of permissions that a user is granted if they're a member of the role. Some permissions are dependent on others. For example, if you add the **Update application dashboards** permission to a role, the **View application dashboards** permission is automatically added. The following tables summarize the available permissions you can use to create custom roles:

### Customizing the app

Application dashboard permissions:

| Name | Automatically added |
| ---- | -------- |
| View | None     |
| Update | View   |
| Full Control | View, Update |

Personal dashboards permissions:

| Name | Automatically added |
| ---- | -------- |
| View | None     |
| Update | View   |
| Create | View   |
| Delete | View   |
| Full Control | View, Update, Create, Delete |

White labeling permissions:

| Name | Automatically added |
| ---- | -------- |
| View | None     |
| Update | View   |
| Full Control | View, Update |

Help links permissions:

| Name | Automatically added |
| ---- | -------- |
| View | None     |
| Update | View   |
| Full Control | View, Update |

### Extending the app

Data export permissions:

| Name | Automatically added |
| ---- | -------- |
| View | None     |
| Update | View   |
| Create | View   |
| Delete | View   |
| Full Control | View, Update, Create, Delete |

API token permissions:

| Name | Automatically added |
| ---- | -------- |
| View | None     |
| Create | View   |
| Delete | View   |
| Full Control | View, Create, Delete |

### Managing the app

Application settings permissions:

| Name | Automatically added |
| ---- | -------- |
| View | None     |
| Update | View   |
| Copy | View. Export and view application templates. View device templates, rules, jobs, device instances, and device groups. |
| Delete | View   |
| Full Control | View, Update, Copy, Delete. Export and view application templates. View device templates, rules, jobs, device instances, and device groups. |

Application template export permissions:

| Name | Automatically added |
| ---- | -------- |
| View | None     |
| Export | View. View device templates, rules, jobs, device instances, and device groups.   |
| Full Control | View, Export. View device templates, rules, jobs, device instances, and device groups. |

Billing permissions:

| Name | Automatically added |
| ---- | -------- |
| View | None     |
| Convert to Paid | View |
| Full Control | View, Convert to Paid |

### Managing devices

Device template permissions:

| Name | Automatically added |
| ---- | -------- |
| View | None     |
| Update | View   |
| Create | View   |
| Delete | View   |
| Full Control | View, Update, Create, Delete |

Device instance permissions:

| Name | Automatically added |
| ---- | -------- |
| View | View device templates |
| Update | View. View device templates. |
| Create | View. View device templates. |
| Delete | View. View device templates. |
| Execute Commands | Update, View. View device templates. |
| Full Control | View, Update, Create, Delete, Execute Commands. View device templates. |

Device groups permissions:

| Name | Automatically added |
| ---- | -------- |
| View | View device templates and device instances. |
| Update | View. View device templates and device instances.   |
| Create | View. View device templates and device instances.   |
| Delete | View. View device templates and device instances.   |
| Full Control | View, Update, Create, Delete. View device templates and device instances. |

Device connectivity management permissions:

| Name | Automatically added |
| ---- | -------- |
| Read Instance | View device templates and device instances. |
| Read Global | None   |
| Update Global | Read Global |
| Full Control | Read Instance, Read Global, Update Global. View device templates and device instances. |

Jobs permissions:

| Name | Automatically added |
| ---- | -------- |
| View | View device templates, device instances, and device groups. |
| Update | View. View device templates, device instances, and device groups. |
| Create | View. View device templates, device instances, and device groups. |
| Delete | View. View device templates, device instances, and device groups. |
| Execute | View. View device templates, device instances, and device groups. Update device instances. |
| Full Control | View, Update, Create, Delete, Execute. View device templates, device instances, and device groups. Update device instances. |

Rules permissions:

| Name | Automatically added |
| ---- | -------- |
| View | View device templates. |
| Update | View. View device templates. |
| Create | View. View device templates. |
| Delete | View. View device templates. |
| Full Control | View, Update, Create, Delete. View device templates. |

Analytics permissions:

| Name | Automatically added |
| ---- | -------- |
| View | View device templates, device instances, and device groups. |
| Full Control | View. View device templates, device instances, and device groups. |

### Managing users and roles

Custom roles permissions:

| Name | Automatically added |
| ---- | -------- |
| View | None |
| Update | View |
| Create | View |
| Delete | View |
| Full Control | View, Update, Create, Delete |

User management permissions:

| Name | Automatically added |
| ---- | -------- |
| View | View custom roles. |
| Create | View. View custom roles. |
| Delete | View. View custom roles. |
| Full Control | View, Create, Delete. View custom roles. |

## Create a custom role

To create a custom role, navigate to the **Roles** page in the **Administration** section of your application. Then select **+ New role**, and add a name and description for your role. Select the permissions your role requires and then select **Save**.

You can [add users to your custom role](./howto-manage-users-roles-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json#add-users) in the same way that you add users to a built-in role.

## Next steps

Now that you've learned about how to create custom roles in your Azure IoT Central application, the suggested next step is to learn how to [View your bill](howto-view-bill-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json).
