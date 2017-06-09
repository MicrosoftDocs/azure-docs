---
title: Azure IoT Suite and Azure Active Directory | Microsoft Docs
description: Describes how Azure IoT Suite uses Azure Active Directory to manage permissions.
services: ''
suite: iot-suite
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 246228ba-954a-4d96-b6d6-e53e4590cb4f
ms.service: iot-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/09/2017
ms.author: dobett

---
# Permissions on the azureiotsuite.com site

## What happens when you sign in

The first time you sign in at [azureiotsuite.com][lnk-azureiotsuite], the site determines the permission levels you have based on the currently selected Azure Active Directory (AAD) tenant and Azure subscription.

1. First, to populate the list of tenants seen next to your username, the site finds out from Azure which AAD tenants you belong to. Currently, the site can only obtain user tokens for one tenant at a time. Therefore, when you switch tenants using the dropdown in the top right corner, the site logs you in to that tenant to obtain the tokens for that tenant.

2. Next, the site finds out from Azure which subscriptions you have associated with the selected tenant. You see the available subscriptions when you create a new preconfigured solution.

3. Finally, the site retrieves all the resources in the subscriptions and resource groups tagged as preconfigured solutions and populates the tiles on the home page.

The following sections describe the roles that control access to the preconfigured solutions.

## AAD roles

The AAD roles control the ability provision preconfigured solutions and manage users in a preconfigured solution.

You can find more information about administrator roles in AAD in [Assigning administrator roles in Azure AD][lnk-aad-admin]. The current article focuses on the **Global Administrator** and the **User** directory roles as used by the preconfigured solutions.

### Global administrator

There can be many global administrators per AAD tenant:

* When you create an AAD tenant, you are by default the global administrator of that tenant.
* The global administrator can provision a preconfigured solution and is assigned an **Admin** role for the application inside their AAD tenant.
* If another user in the same AAD tenant creates an application, the default role granted to the global administrator is **ReadOnly**.
* A global administrator can assign users to roles for applications using the [Azure portal][lnk-portal].

### Domain user

There can be many domain users per AAD tenant:

* A domain user can provision a preconfigured solution through the [azureiotsuite.com][lnk-azureiotsuite] site. By default, the domain user is granted the **Admin** role in the provisioned application.
* A domain user can create an application using the build.cmd script in the [azure-iot-remote-monitoring][lnk-rm-github-repo],  [azure-iot-predictive-maintenance][lnk-pm-github-repo], or [azure-iot-connected-factory][lnk-cf-github-repo] repository. However, the default role granted to the domain user is **ReadOnly**, because a domain user does not have permission to assign roles.
* If another user in the AAD tenant creates an application, the domain user is assigned the **ReadOnly** role by default for that application.
* A domain user cannot assign roles for applications; therefore a domain user cannot add users or roles for users for an application even if they provisioned it.

### Guest User

There can be many guest users per AAD tenant. Guest users have a limited set of rights in the AAD tenant. As a result, guest users cannot provision a preconfigured solution in the AAD tenant.

For more information about users and roles in AAD, see the following resources:

* [Create users in Azure AD][lnk-create-edit-users]
* [Assign users to apps][lnk-assign-app-roles]

## Azure subscription administrator roles

The Azure admin roles control the ability to map an Azure subscription to an AD tenant.

Find out more about the Azure admin roles in the article [How to add or change Azure Co-Administrator, Service Administrator, and Account Administrator][lnk-admin-roles].

## Application roles

The application roles control access to devices in your preconfigured solution.

There are two defined roles and one implicit role defined in a provisioned application:

* **Admin:** Has full control to add, manage, remove devices, and modify settings.
* **ReadOnly:** Can view devices, rules, actions, jobs, and telemetry.

You can find the permissions assigned to each role in the [RolePermissions.cs][lnk-resource-cs] source file.

### Changing application roles for a user

You can use the following procedure to make a user in your Active Directory an administrator of your preconfigured solution.

You must be an AAD global administrator to change roles for a user:

1. Go to the [Azure portal][lnk-portal].
2. Select **Azure Active Directory**.
3. Make sure you are using the directory you chose on azureiotsuite.com when you provisioned your solution. If you have multiple directories associated with your subscription, you can switch between them if you click your account name at the top-right of the portal.
4. Click **Enterprise applications**, then **All applications**.
4. Show **All applications** with **Any** status. Then search for an application with name of your preconfigured solution.
5. Click the name of the application that matches your preconfigured solution name.
6. Click **Users and groups**.
7. Select the user you want to switch roles.
8. Click **Assign** and select the role (such as **Admin**) you'd like to assign to the user, click the check mark.

## FAQ

### I'm a service administrator and I'd like to change the directory mapping between my subscription and a specific AAD tenant. How do I complete this task?

1. Go to the [Azure classic portal][lnk-classic-portal], click **Settings** in the list of services on the left-hand side.
2. Select the subscription you'd like to change the directory mapping to.
3. Click **Edit Directory**.
4. Select the **Directory** you would like to use in the dropdown. Click the forward arrow.
5. Confirm the directory mapping and affected co-administrators. If you are moving from another directory, all the co-administrators from the original directory are removed.

### I'm a domain user/member on the AAD tenant and I've created a preconfigured solution. How do I get assigned a role for my application?

Ask a global administrator to make you a global administrator on the AAD tenant and then assign roles to users yourself. Alternatively, ask a global administrator to assign you a role directly. If you'd like to change the AAD tenant your preconfigured solution has been deployed to, see the next question.

### How do I switch the AAD tenant my remote monitoring preconfigured solution and application are assigned to?

You can run a cloud deployment from <https://github.com/Azure/azure-iot-remote-monitoring> and redeploy with a newly created AAD tenant. Because you are, by default, a global administrator when you create an AAD tenant, you have permissions to add users and assign roles to those users.

1. Create an AAD directory in the [Azure portal][lnk-portal].
2. Go to <https://github.com/Azure/azure-iot-remote-monitoring>.
3. Run `build.cmd cloud [debug | release] {name of previously deployed remote monitoring solution}` (For example, `build.cmd cloud debug myRMSolution`)
4. When prompted, set the **tenantid** to be your newly created tenant instead of your previous tenant.

### I want to change a Service Administrator or Co-Administrator when logged in with an organisational account

See the support article [Changing Service Administrator and Co-Administrator when logged in with an organisational account][lnk-service-admins].

### Why am I seeing this error? "Your account does not have the proper permissions to create a solution. Please check with your account administrator or try with a different account."

Look at the following diagram for guidance:

![][img-flowchart]

> [!NOTE]
> If you continue to see the error after validating you are a global administrator on the AAD tenant and a co-administrator on the subscription, have your account administrator remove the user and reassign necessary permissions in this order. First, add the user as a global administrator and then add user as a co-administrator on the Azure subscription. If issues persist, contact [Help & Support][lnk-help-support].

### Why am I seeing this error when I have an Azure subscription? "An Azure subscription is required to create pre-configured solutions. You can create a free trial account in just a couple of minutes."

If you're certain you have an Azure subscription, validate the tenant mapping for your subscription and ensure the correct tenant is selected in the dropdown. If you’ve validated the desired tenant is correct, follow the preceding diagram and validate the mapping of your subscription and this AAD tenant.

## Next steps
To continue learning about IoT Suite, see how you can [customize a preconfigured solution][lnk-customize].

[img-flowchart]: media/iot-suite-permissions/flowchart.png

[lnk-azureiotsuite]: https://www.azureiotsuite.com/
[lnk-rm-github-repo]: https://github.com/Azure/azure-iot-remote-monitoring
[lnk-pm-github-repo]: https://github.com/Azure/azure-iot-predictive-maintenance
[lnk-cf-github-repo]: https://github.com/Azure/azure-iot-connected-factory
[lnk-aad-admin]: ../active-directory/active-directory-assign-admin-roles.md
[lnk-classic-portal]: https://manage.windowsazure.com/
[lnk-portal]: https://portal.azure.com/
[lnk-create-edit-users]: ../active-directory/active-directory-create-users.md
[lnk-assign-app-roles]: ../active-directory/active-directory-coreapps-assign-user-azure-portal.md
[lnk-service-admins]: https://azure.microsoft.com/support/changing-service-admin-and-co-admin/
[lnk-admin-roles]: ../billing/billing-add-change-azure-subscription-administrator.md
[lnk-resource-cs]: https://github.com/Azure/azure-iot-remote-monitoring/blob/master/DeviceAdministration/Web/Security/RolePermissions.cs
[lnk-help-support]: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade
[lnk-customize]: iot-suite-guidance-on-customizing-preconfigured-solutions.md
