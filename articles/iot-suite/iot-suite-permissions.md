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
ms.date: 11/10/2017
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
* The global administrator can provision a basic and standard preconfigured solutions.

### Domain user

There can be many domain users per AAD tenant:

* A domain user can provision a basic preconfigured solution through the [azureiotsuite.com][lnk-azureiotsuite] site.
* A domain user can create a basic preconfigured solution using the CLI.

### Guest User

There can be many guest users per AAD tenant. Guest users have a limited set of rights in the AAD tenant. As a result, guest users cannot provision a preconfigured solution in the AAD tenant.

For more information about users and roles in AAD, see the following resources:

* [Create users in Azure AD][lnk-create-edit-users]
* [Assign users to apps][lnk-assign-app-roles]

## Azure subscription administrator roles

The Azure admin roles control the ability to map an Azure subscription to an AD tenant.

Find out more about the Azure admin roles in the article [How to add or change Azure Co-Administrator, Service Administrator, and Account Administrator][lnk-admin-roles].

## FAQ

### I'm a service administrator and I'd like to change the directory mapping between my subscription and a specific AAD tenant. How do I complete this task?

See [To add an existing subscription to your Azure AD directory](../active-directory/active-directory-how-subscriptions-associated-directory.md#to-add-an-existing-subscription-to-your-azure-ad-directory)

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
[lnk-portal]: https://portal.azure.com/
[lnk-create-edit-users]: ../active-directory/active-directory-create-users.md
[lnk-assign-app-roles]: ../active-directory/active-directory-coreapps-assign-user-azure-portal.md
[lnk-service-admins]: https://azure.microsoft.com/support/changing-service-admin-and-co-admin/
[lnk-admin-roles]: ../billing/billing-add-change-azure-subscription-administrator.md
[lnk-resource-cs]: https://github.com/Azure/azure-iot-remote-monitoring/blob/master/DeviceAdministration/Web/Security/RolePermissions.cs
[lnk-help-support]: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade
[lnk-customize]: iot-suite-guidance-on-customizing-preconfigured-solutions.md
