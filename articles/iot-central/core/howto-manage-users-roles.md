---
title: Manage users and roles in Azure IoT Central application | Microsoft Docs
description: As an administrator, how to manage users and roles in your Azure IoT Central application
author: lmasieri
ms.author: lmasieri
ms.date: 04/16/2021
ms.topic: how-to
ms.service: iot-central
services: iot-central
manager: corywink
---

# Manage users and roles in your IoT Central application

This article describes how, as an administrator, you can add, edit, and delete users in your Azure IoT Central application. The article also describes how to manage roles in your application.

To access and use the **Administration** section, you must be in the **Administrator** role for an Azure IoT Central application. If you create an Azure IoT Central application, you're automatically added to the **Administrator** role for that application.

## Add users

Every user must have a user account before they can sign in and access an application. IoT Central currently supports Microsoft accounts and Azure Active Directory accounts, but not Azure Active Directory groups.

For more information, see [Microsoft account help](https://support.microsoft.com/products/microsoft-account?category=manage-account) and  [Quickstart: Add new users to Azure Active Directory](../../active-directory/fundamentals/add-users-azure-active-directory.md).

1. To add a user to an IoT Central application, go to the **Users** page in the **Administration** section.

  :::image type="content" source="media/howto-manage-users-roles/manage-users-pnp.png" alt-text="Manage users":::

1. To add a user, on the **Users** page, choose **+ Add user**.

1. Choose a role for the user from the **Role** drop-down menu. Learn more about roles in the [Manage roles](#manage-roles) section of this article.

  :::image type="content" source="media/howto-manage-users-roles/add-user-pnp.png" alt-text="Add a user and select a role.":::

  > [!NOTE]
  > A user who is in a custom role that grants them the permission to add other users, can only add users to a role with same or fewer permissions than their own role.

  > [!NOTE]
  > If a user is deleted from Azure Active Directory and then added back, they won't be able to sign into the IoT Central application. To re-enable access, the application's administrator should delete and re-add the user in the application as well.

### Edit the roles that are assigned to users

Roles can't be changed after they're assigned. To change the role that's assigned to a user, delete the user, and then add the user again with a different role.

> [!NOTE]
> The roles assigned are specific to the IoT Central application and cannot be managed from the Azure Portal.

## Delete users

To delete users, select one or more check boxes on the **Users** page. Then select **Delete**.

## Manage roles

Roles enable you to control who within your organization is allowed to do various tasks in IoT Central. There are three built-in roles you can assign to users of your application. You can also [create custom roles](#create-a-custom-role) if you require finer-grained control.

> [!div class="mx-imgBorder"]
> ![Manage roles selection](media/howto-manage-users-roles/manage-roles-pnp.png)

### Administrator

Users in the **Administrator** role can manage and control every part of the application, including billing.

The user who creates an application is automatically assigned to the **Administrator** role. There must always be at least one user in the **Administrator** role.

### Builder

Users in the **Builder** role can manage every part of the app, but can't make changes on the Administration or Continuous Data Export tabs.

### Operator

Users in the **Operator** role can monitor device health and status. They aren't allowed to make changes to device templates or to administer the application. Operators can add and delete devices, manage device sets, and run analytics and jobs.

## Create a custom role

If your solution requires finer-grained access controls, you can create roles with custom sets of permissions. To create a custom role, navigate to the **Roles** page in the **Administration** section of your application. Then select **+ New role**, and add a name and description for your role. Select the permissions your role requires and then select **Save**.

You can add users to your custom role in the same way that you add users to a built-in role.

> [!div class="mx-imgBorder"]
> ![Build a custom role](media/howto-manage-users-roles/create-custom-role-pnp.png)

### Custom role options

When you define a custom role, you choose the set of permissions that a user is granted if they're a member of the role. Some permissions are dependent on others. For example, if you add the **Update personal dashboards** permission to a role, the **View personal dashboards** permission is added automatically. The following tables summarize the available permissions, and their dependencies, you can use when creating custom roles.

#### Managing devices

**Device template permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None     |
| Manage | View <br/> Other dependencies: View device instances  |
| Full Control | View, Manage <br/> Other dependencies: View device instances |

**Device instance permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None <br/> Other dependencies: View device templates and device groups |
| Update | View <br/> Other dependencies: View device templates and device groups  |
| Create | View <br/> Other dependencies:  View device templates and device groups  |
| Delete | View <br/> Other dependencies: View device templates and device groups  |
| Execute commands | Update, View <br/> Other dependencies: View device templates and device groups  |
| View raw data | View <br/> Other dependencies: View device templates and device groups  |
| Full Control | View, Update, Create, Delete, Execute commands, View raw data <br/> Other dependencies: View device templates and device groups  |

**Device groups permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None <br/> Other dependencies: View device templates and device instances |
| Update | View <br/> Other dependencies: View device templates and device instances   |
| Create | View, Update <br/> Other dependencies:  View device templates and device instances   |
| Delete | View <br/> Other dependencies:  View device templates and device instances  |
| Full Control | View, Update, Create, Delete <br/> Other dependencies: View device templates and device instances |

**Device connectivity management permissions**

| Name | Dependencies |
| ---- | -------- |
| Read instance | None <br/> Other dependencies: View device templates, device groups, device instances |
| Manage instance | Read instance <br /> Other dependencies: View device templates, device groups, device instances |
| Read global | None   |
| Manage global | Read global |
| Full Control | Read instance, Manage instance, Read global, Manage global <br/> Other dependencies: View device templates, device groups, device instances |

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

#### Managing the app

**Application settings permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None     |
| Update | View   |
| Copy | View <br/> Other dependencies: View device templates, device instances, device groups, dashboards, data export, branding, help links, custom roles, rules |
| Delete | View   |
| Full Control | View, Update, Copy, Delete <br/> Other dependencies: View device templates, device groups, application dashboards, data export, branding, help links, custom roles, rules |

**Application template export permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None     |
| Export | View <br/> Other dependencies:  View device templates, device instances, device groups, dashboards, data export, branding, help links, custom roles, rules |
| Full Control | View, Export <br/> Other dependencies:  View device templates, device groups, application dashboards, data export, branding, help links, custom roles, rules |

**Device file upload permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None     |
| Manage | View   |
| Full Control | View, Manage |

**Billing permissions**

| Name | Dependencies |
| ---- | -------- |
| Manage | None     |
| Full Control | Manage |

#### Managing users and roles

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

> [!NOTE]
> A user who is in a custom role that grants them the permission to add other users, can only add users to a role with same or fewer permissions than their own role.

#### Customizing the app

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

**Branding, favicon, and colors permissions**

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

#### Extending the app

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
| View | None  <br/> Other dependencies: View custom roles |
| Create | View <br/> Other dependencies: View custom roles |
| Delete | View <br/> Other dependencies: View custom roles |
| Full Control | View, Create, Delete <br/> Other dependencies: View custom roles |

## Next steps

Now that you've learned how to manage users and roles in your IoT Central application, the suggested next step is to learn how to [Manage your bill](howto-view-bill.md).