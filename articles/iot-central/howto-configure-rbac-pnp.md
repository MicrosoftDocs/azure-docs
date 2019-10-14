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

[!INCLUDE [iot-central-pnp-original](../../includes/iot-central-pnp-original-note.md)]

By default, you can assign users in your IoT Central application to one of three built-in *roles*:

- **Application administrator**: Users in this role have access to all functionality in an Azure IoT Central application.
- **Application builder**: Users in this role can do everything in an Azure IoT Central application except access the administration and data export sections.
- **Application operator**: Users in this role can monitor devices and system health. They can't administer or configure the application.

If your solution requires finer-grained access controls, you can create custom roles with custom sets of permissions. 

## Create a custom role (preview)

To create a custom role, navigate to the **Roles (preview)** page in the **Administration** section of your application. Then select **+ New role**, and add a name and description for your role. Select the permissions your role requires and then select **Save**.

You can [add users to your custom role](./howto-manage-users-roles-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json#add-users) in the same way that you add users to a built-in role.

## Custom role options

When you define a custom role, you choose the set of permissions that a user is granted if they're a member of the role. Some permissions are dependent on others. For example, if you add the **Update application dashboards** permission to a role, the **View application dashboards** permission is automatically added. The following tables summarize the available permissions, and their dependencies, you can use when creating custom roles:

### Customizing the app

**Application dashboard permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None     |
| Update | View   |
| Create | View, Update |
| Delete | View   |
| Full Control | View, Update, Create, Delete |

**Personal dashboards permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None     |
| Update | View   |
| Create | View, Update   |
| Delete | View   |
| Full Control | View, Update, Create, Delete |

**Whitelabeling permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None     |
| Update | View   |
| Full Control | View, Update |

**Help links permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None     |
| Update | View   |
| Full Control | View, Update |


### Extending the app

**Data export permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None     |
| Update | View   |
| Create | View, Update  |
| Delete | View   |
| Full Control | View, Update, Create, Delete |

**API token permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None     |
| Create | View   |
| Delete | View   |
| Full Control | View, Create, Delete |

### Managing the app

**Application settings permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None     |
| Update | View   |
| Copy | View <br/> Other dependencies: View device templates, device instances, device groups, dashboards, data export, whitelabeling, help links, custom roles, rules |
| Delete | View   |
| Full Control | View, Update, Copy, Delete <br/> Other dependencies: View device templates, device instances, device groups, dashboards, data export, whitelabeling, help links, custom roles, rules |

**Application template export permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None     |
| Export | View <br/> Other dependencies:  View device templates, device instances, device groups, dashboards, data export, whitelabeling, help links, custom roles, rules |
| Full Control | View, Export <br/> Other dependencies:  View device templates, device instances, device groups, dashboards, data export, whitelabeling, help links, custom roles, rules |

**Billing permissions**

| Name | Dependencies |
| ---- | -------- |
| Manage | None     |
| Full Control | Manage |

### Managing devices

**Device template permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None     |
| Update | View   |
| Create | View, Update   |
| Delete | View   |
| Publish | View, Update|
| Full Control | View, Update, Create, Delete, Publish |

**Device instance permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None <br/> Other dependencies: View device templates |
| Update | View <br/> Other dependencies: View device templates |
| Create | View <br/> Other dependencies:  View device templates |
| Delete | View <br/> Other dependencies: View device templates |
| Execute Commands | Update, View <br/> Other dependencies: View device templates |
| Full Control | View, Update, Create, Delete, Execute Commands <br/> Other dependencies: View device templates |

**Device groups permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None <br/> Other dependencies: View device templates and device instances |
| Update | View <br/> Other dependencies: View device templates and device instances   |
| Create | View, Update <br/> Other dependencies:  View device templates and device instances   |
| Delete | View <br/> Other dependencies:  View device templates and device instances   |
| Full Control | View, Update, Create, Delete <br/> Other dependencies: View device templates and device instances |

**Device connectivity management permissions**

| Name | Dependencies |
| ---- | -------- |
| Read instance | None <br/> Other dependencies: View device templates and device instances |
| Read global | None   |
| Update global | Read Global |
| Full Control | Read instance, Read global, Update global. <br/> Other dependencies: View device templates and device instances |

**Jobs permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None <br/> Other dependencies: View device templates, device instances, and device groups |
| Update | View <br/> Other dependencies: View device templates, device instances, and device groups |
| Create | View, Update <br/> Other dependencies:  View device templates, device instances, and device groups |
| Delete | View <br/> Other dependencies:  View device templates, device instances, and device groups |
| Execute | View <br/> Other dependencies: View device templates, device instances, and device groups; Update device instances; Execute commands on device instances |
| Full Control | View, Update, Create, Delete, Execute <br/> Other dependencies:  View device templates, device instances, and device groups; Update device instances; Execute commands on device instances |

**Rules permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None <br/> Other dependencies: View device templates |
| Update | View <br/> Other dependencies: View device templates |
| Create | View, Update <br/> Other dependencies:  View device templates |
| Delete | View <br/> Other dependencies: View device templates |
| Full Control | View, Update, Create, Delete <br/> Other dependencies: View device templates |

**Analytics permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None <br/> Other dependencies: View device templates, device instances,  device groups |
| Full Control | View <br/> Other dependencies:  View device templates, device instances,  device groups |



### Managing users and roles

**Custom roles permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None |
| Update | View |
| Create | View, Update |
| Delete | View |
| Full Control | View, Update, Create, Delete |

**User management permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None <br/> Other dependencies: View custom roles |
| Add | View <br/> Other dependencies:  View custom roles |
| Delete | View <br/> Other dependencies:  View custom roles |
| Full Control | View, Add, Delete <br/> Other dependencies:  View custom roles |

## Next steps

Now that you've learned about how to create custom roles in your Azure IoT Central application, the suggested next step is to learn how to [View your bill](howto-view-bill-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json).
