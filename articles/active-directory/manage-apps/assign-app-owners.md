---
title: Assign enterprise application owners
description: Learn how to assign owners to applications in Azure Active Directory
services: active-directory
documentationcenter: ''
author: saipradeepb23
manager: celesteDG
ms.service: active-directory
ms.workload: identity
ms.subservice: app-mgmt
ms.topic: how-to
ms.date: 12/02/2021
ms.author: saibandaru
#Customer intent: As an Azure AD administrator, I want to assign owners to enterprise applications.

---

# Assign enterprise application owners

As an [owner of an enterprise application](overview-assign-app-owners.md) in Azure Active Directory (Azure AD), a user can manage the organization-specific configuration of it, such as single sign-on, provisioning, and user assignments. An owner can also add or remove other owners. Unlike Global Administrators, owners can manage only the enterprise applications they own. In this article, you learn how to assign an owner of an application.

## Assign an owner

To assign an owner to an enterprise application:

1. Sign in to [your Azure AD organization](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) with an account that is eligible for the **Application Administrator** role or the **Cloud Application Administrator** role for the organization.
2. Select **Enterprise applications**, and then select the application that you want to add an owner to.
3. Select **Owners**, and then select **Add** to get a list of user accounts that you can choose an owner from.
4. Search for and select the user account that you want to be an owner of the application.
5. Click **Select** to add the user account that you chose as an owner of the application.

> [!NOTE]
> If the user setting **Restrict access to Azure AD administration portal** is set to `Yes`, non-admin users will not be able to use the Azure portal to manage the applications they own. For more information about the actions that can be performed on owned enterprise applications, see [Owned enterprise applications](../fundamentals/users-default-permissions.md#owned-enterprise-applications). 


## Next steps

- [Delegate app registration permissions in Azure Active Directory](../roles/delegate-app-roles.md)
