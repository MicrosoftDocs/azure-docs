---
title: Azure IoT solution accelerators and Azure Active Directory | Microsoft Docs
description: Describes how Azure IoT solution accelerators uses Azure Active Directory to manage permissions.
author: dominicbetts
manager: timlt
ms.service: iot-accelerators
services: iot-accelerators
ms.topic: conceptual
ms.date: 11/10/2017
ms.author: dobett
---

# Permissions on the azureiotsolutions.com site

## What happens when you sign in

The first time you sign in at [azureiotsuite.com][lnk-azureiotsolutions], the site determines the permission levels you have based on the currently selected Azure Active Directory (AAD) tenant and Azure subscription.

1. First, to populate the list of tenants seen next to your username, the site finds out from Azure which AAD tenants you belong to. Currently, the site can only obtain user tokens for one tenant at a time. Therefore, when you switch tenants using the dropdown in the top right corner, the site logs you in to that tenant to obtain the tokens for that tenant.

2. Next, the site finds out from Azure which subscriptions you have associated with the selected tenant. You see the available subscriptions when you create a new solution accelerator.

3. Finally, the site retrieves all the resources in the subscriptions and resource groups tagged as solution accelerators and populates the tiles on the home page.

The following sections describe the roles that control access to the solution accelerators.

## AAD roles

The AAD roles control the ability to provision solution accelerators, to manage users and some Azure services in a solution accelerator.

You can find more information about administrator roles in AAD in [Assigning administrator roles in Azure AD][lnk-aad-admin]. The current article focuses on the **Global Administrator** and the **User** directory roles as used by the solution accelerators.

### Global administrator

There can be many global administrators per AAD tenant:

* When you create an AAD tenant, you are by default the global administrator of that tenant.
* The global administrator can provision a basic and standard solution accelerators (a basic deployment uses a single Azure Virtual Machine).

### Domain user

There can be many domain users per AAD tenant:

* A domain user can provision a basic solution accelerator through the [azureiotsolutions.com][lnk-azureiotsolutions] site.
* A domain user can create a basic solution accelerator using the CLI.

### Guest User

There can be many guest users per AAD tenant. Guest users have a limited set of rights in the AAD tenant. As a result, guest users cannot provision a solution accelerator in the AAD tenant.

For more information about users and roles in AAD, see the following resources:

* [Create users in Azure AD][lnk-create-edit-users]
* [Assign users to apps][lnk-assign-app-roles]

## Azure subscription administrator roles

The Azure admin roles control the ability to map an Azure subscription to an AAD tenant.

Find out more about the Azure admin roles in the article [Add or change Azure subscription administrators][lnk-admin-roles].

## FAQ

### I'm a service administrator and I'd like to change the directory mapping between my subscription and a specific AAD tenant. How do I complete this task?

See [To add an existing subscription to your Azure AD directory](../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md#to-associate-an-existing-subscription-to-your-azure-ad-directory)

### I want to change a Service Administrator or Co-Administrator when logged in with an organizational account

See the support article [Changing Service Administrator and Co-Administrator when logged in with an organizational account][lnk-service-admins].

### Why am I seeing this error? "Your account does not have the proper permissions to create a solution. Please check with your account administrator or try with a different account."

Look at the following diagram for guidance:

![][img-flowchart]

> [!NOTE]
> If you continue to see the error after validating you are a global administrator of the AAD tenant and a co-administrator of the subscription, have your account administrator remove the user and reassign necessary permissions in this order. First, add the user as a global administrator and then add user as a co-administrator of the Azure subscription. If issues persist, contact [Help & Support][lnk-help-support].

### Why am I seeing this error when I have an Azure subscription? "An Azure subscription is required to create pre-configured solutions. You can create a free trial account in just a couple of minutes."

If you're certain you have an Azure subscription, validate the tenant mapping for your subscription and ensure the correct tenant is selected in the dropdown. If you’ve validated the desired tenant is correct, follow the preceding diagram and validate the mapping of your subscription and this AAD tenant.

## Next steps
To continue learning about IoT solution accelerators, see how you can [customize a solution accelerator][lnk-customize].

[img-flowchart]: media/iot-accelerators-permissions/flowchart.png

[lnk-azureiotsolutions]: https://www.azureiotsolutions.com
[lnk-rm-github-repo]: https://github.com/Azure/remote-monitoring-services-dotnet
[lnk-pm-github-repo]: https://github.com/Azure/azure-iot-predictive-maintenance
[lnk-cf-github-repo]: https://github.com/Azure/azure-iot-connected-factory
[lnk-aad-admin]:../active-directory/users-groups-roles/directory-assign-admin-roles.md
[lnk-portal]: https://portal.azure.com
[lnk-create-edit-users]:../active-directory/fundamentals/active-directory-users-profile-azure-portal.md
[lnk-assign-app-roles]:../active-directory/manage-apps/assign-user-or-group-access-portal.md
[lnk-service-admins]: https://azure.microsoft.com/support/changing-service-admin-and-co-admin
[lnk-admin-roles]: ../billing/billing-add-change-azure-subscription-administrator.md
[lnk-help-support]: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade
[lnk-customize]: iot-accelerators-remote-monitoring-customize.md
