---
title: Manage users and roles in Azure IoT Central application
description: Create, edit, delete, and manage users and roles in your Azure IoT Central application to control access to resources
author: dominicbetts
ms.author: dobett
ms.date: 08/01/2022
ms.topic: how-to
ms.service: iot-central
services: iot-central

# Administrator
---

# Manage users and roles in your IoT Central application

This article describes how you can add, edit, and delete users in your Azure IoT Central application. The article also describes how to manage roles in your application.

To access and use the **Permissions** section, you must be in the **App Administrator** role for an Azure IoT Central application or in a custom role that includes administration permissions. If you create an Azure IoT Central application, you're automatically added to the **App Administrator** role for that application.

To learn how to manage users and roles by using the IoT Central REST API, see [How to use the IoT Central REST API to manage users and roles.](../core/howto-manage-users-roles-with-rest-api.md)

## Add users

Every user must have a user account before they can sign in and access an application. IoT Central supports Microsoft user accounts, Microsoft Entra accounts, Microsoft Entra groups, and Microsoft Entra service principals. To learn more, see [Microsoft account help](https://support.microsoft.com/products/microsoft-account?category=manage-account) and  [Quickstart: Add new users to Microsoft Entra ID](../../active-directory/fundamentals/add-users-azure-active-directory.md).

1. To add a user to an IoT Central application, go to the **Users** page in the **Permissions** section.

    :::image type="content" source="media/howto-manage-users-roles/manage-users.png" alt-text="Screenshot that shows the manage users page in IoT Central." lightbox="media/howto-manage-users-roles/manage-users.png":::  

1. To add a user on the **Users** page, choose **+ Assign user**. To add a service principal on the **Users** page, choose **+ Assign service principal**. To add a Microsoft Entra group on the **Users** page, choose **+ Assign group**. Start typing the name of the Active Directory group or service principal to auto-populate the form.

    > [!NOTE]
    > Service principals and Active Directory groups must belong to the same Microsoft Entra tenant as the Azure subscription associated with the IoT Central application.

1. If your application uses [organizations](howto-create-organizations.md), choose an organization to assign to the user from the **Organization** drop-down menu.

1. Choose a role for the user from the **Role** drop-down menu. Learn more about roles in the [Manage roles](#manage-roles) section of this article.

    :::image type="content" source="media/howto-manage-users-roles/add-user.png" alt-text="Screenshot showing how to add a user and select a role." lightbox="media/howto-manage-users-roles/add-user.png":::

    The available roles depend on the organization the user is associated with. You can assign **App** roles to users associated with the root organization, and **Org** roles to users associated with any other organization in the hierarchy.

    > [!NOTE]
    > A user who is in a custom role that grants them the permission to add other users, can only add users to a role with same or fewer permissions than their own role.

    When you invite a new user, you need to share the application URL with them and ask them to sign in. After the user has signed in for the first time, the application appears on the user's [My apps](https://apps.azureiotcentral.com/myapps) page.

    > [!NOTE]
    > If a user is deleted from Microsoft Entra ID and then added back, they won't be able to sign into the IoT Central application. To re-enable access, the application's administrator should delete and re-add the user in the application as well.

The following limitations apply to Microsoft Entra groups and service principals:

- Total number of Microsoft Entra groups for each IoT Central application can't be more than 20.
- Total number of unique Microsoft Entra groups from the same Microsoft Entra tenant can't be more than 200 across all IoT Central applications.
- Service principals that are part of a Microsoft Entra group aren't automatically granted access to the application. The service principals must be added explicitly.

### Edit the roles and organizations that are assigned to users

Roles and organizations can't be changed after they're assigned. To change the role or organization that's assigned to a user, delete the user, and then add the user again with a different role or organization.

> [!NOTE]
> The roles assigned are specific to the IoT Central application and cannot be managed from the Azure Portal.

## Delete users

To delete users, select one or more check boxes on the **Users** page. Then select **Delete**.

## Manage roles

Roles enable you to control who within your organization is allowed to do various tasks in IoT Central. There are three built-in roles you can assign to users of your application. You can also [create custom roles](#create-a-custom-role) if you require finer-grained control.

:::image type="content" source="media/howto-manage-users-roles/manage-roles.png" alt-text="Screenshot that shows how to manage roles." lightbox="media/howto-manage-users-roles/manage-roles.png":::

### App Administrator

Users in the **App Administrator** role can manage and control every part of the application, including billing.

The user who creates an application is automatically assigned to the **App Administrator** role. There must always be at least one user in the **App Administrator** role.

### App Builder

Users in the **App Builder** role can manage every part of the app, but can't make changes on the **Application** or **Data Export** tabs.

### App Operator

Users in the **App Operator** role can monitor device health and status. They aren't allowed to make changes to device templates or to administer the application. Operators can add and delete devices, manage device sets, and run analytics and jobs.

### Org Administrator

IoT Central adds this role automatically when you add an organization to your application. This role restricts organization administrators from accessing some application-wide capabilities such as billing, branding, colors, API tokens, and enrollment group information.

Users in the **Org Administrator** role can invite users to the application, create suborganizations within their organization hierarchy, and manage the devices within their organization.

### Org Operator

IoT Central adds this role automatically when you add an organization to your application. This role restricts organization operators from accessing some application-wide capabilities.

Users in the **Org Operator** role can complete tasks such as adding devices, running commands, viewing device data, creating dashboards, and creating device groups.

### Org Viewer

IoT Central adds this role automatically when you add an organization to your application.

Users in the **Org Viewer** role can view items such as devices and their data, organization dashboards, device groups, and device templates.

## Create a custom role

If your solution requires finer-grained access controls, you can create roles with custom sets of permissions. To create a custom role, navigate to the **Roles** page in the **Permissions** section of your application, and choose one of these options:

- Select **+ New**, add a name and description for your role, and select **Application** or **Organization** as the role type. This option lets you create a role definition from scratch.
- Navigate to an existing role and select **Copy**. This option lets you start with an existing role definition that you can customize.

:::image type="content" source="media/howto-manage-users-roles/create-custom-role.png" alt-text="Screenshot to build a custom role." lightbox="media/howto-manage-users-roles/create-custom-role.png":::

> [!WARNING]
> You can't change the role type after you create a role.

When you invite a user to your application, if you associate the user with:

- The root organization, then only **Application** roles are available.
- Any other organization, then only **Organization** roles are available.

You can add users to your custom role in the same way that you add users to a built-in role

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
| View uploaded device files | View <br/> Other dependencies: View device templates and device groups  |
| Delete uploaded device files | View <br/> Other dependencies: View device templates and device groups  |
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

**Edge deployment manifests**

| Name | Dependencies |
| ---- | -------- |
| Read instance | None <br/> Other dependencies: View device templates, device groups, device instances |
| Manage instance | Read instance <br /> Other dependencies: View device templates, device groups, device instances |
| Read global | None   |
| Manage global | Read global |
| Full Control | Read instance, Manage instance, Read global, Manage global <br/> Other dependencies: View device templates, device groups, device instances. Update device instances |

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

**Audit log permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None     |
| Full Control | View |

> [!CAUTION]
> Any user granted permission to view the audit log can see all log entries even if they don't have permission to view or modify the entities listed in the log. Therefore, any user who can view the log can view the identity of and changes made to any modified entity.

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

**Organization management permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None |
| Update | View |
| Create | View, Update |
| Delete | View |
| Full Control | View, Update, Create, Delete |

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

**Data explorer permissions**

| Name | Dependencies |
| ---- | -------- |
| View | None <br/> Other dependencies: View device groups, device templates, device instances |
| Update | View <br/> Other dependencies: View device groups, device templates, device instances |
| Create | View, Update <br/> Other dependencies: View device groups, device templates, device instances |
| Delete | View <br/> Other dependencies: View device groups, device templates, device instances |
| Full Control | View, Update, Create, Delete <br/> Other dependencies: View device groups, device templates, device instances |

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

Now that you've learned how to manage users and roles in your IoT Central application, the suggested next step is to learn how to [Manage IoT Central organizations](howto-create-organizations.md).
