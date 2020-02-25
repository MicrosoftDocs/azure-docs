---
title: Configure custom Azure Active Directory password protection lists
description: In this tutorial, you learn how to configure custom banned password protection lists for Azure Active Directory to restrict common words in your environment.

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: tutorial
ms.date: 02/24/2020

ms.author: iainfou
author: iainfoulds
ms.reviewer: rogoya

ms.collection: M365-identity-device-management

# Customer intent: As an Azure AD Administrator, I want to learn how to configure custom banned passwords to prevent users in my organization from using common insecure passwords.
---
# Tutorial: Configure custom banned passwords for Azure Active Directory password protection

In this tutorial you learn how to:

> [!div class="checklist"]
> * Enable custom banned passwords
> * Add entries to the custom banned password list
> * Test password changes with a banned password

## Prerequisites

To complete this tutorial, you need the following resources and privileges:

* A working Azure AD tenant with at least a trial license enabled.
    * If needed, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An account with *Global Administrator* privileges.
* A non-administrator user with a password you know, such as *testuser*. You test a password change event using this account in this tutorial.
    * If you need to create a user, see [Quickstart: Add new users to Azure Active Directory](../add-users-azure-active-directory.md).

## Configure custom banned passwords

Azure AD lets you enable SSPR for *None*, *Selected*, or *All* users. This granular ability lets you choose a subset of users to test the SSPR registration process and workflow. When you're comfortable with the process and can communicate the requirements with a broader set of users, you can select additional groups of users to enable for SSPR. Or, you can enable SSPR for everyone in the Azure AD tenant.

1. Sign in to the [Azure portal](https://portal.azure.com) using an account with *global administrator* permissions.
1. Search for and select **Azure Active Directory**, then choose **Security** from the menu on the left-hand side.
1. Under the **Manage** menu header, select **Authentication methods**, then **Password protection**.
1. Set the option for **Enforce custom list** to *Yes*.
1. Add strings to the **Custom banned password list**, one string per line. The following conditions apply to these custom banned password entries:

    * The custom banned password list can contain up to 1000 terms.
    * The custom banned password list is case-insensitive.
    * The custom banned password list considers common character substitution.
        * Example: "o" and "0" or "a" and "@"
    * The minimum string length is four characters, and the maximum is 16 characters.

    [![](media/tutorial-enable-sspr/enable-sspr-for-group-cropped.png "Select a group in the Azure portal to enable for self-service password reset")](media/tutorial-enable-sspr/enable-sspr-for-group.png#lightbox)

1. To enable the custom banned passwords, select **Save**.

## Test custom banned password list



## Clean up resources

If you no longer want to use the custom banned password list you have configured as part of this tutorial, complete the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Azure Active Directory**, then choose **Security** from the menu on the left-hand side.
1. Under the **Manage** menu header, select **Authentication methods**, then **Password protection**.
1. Set the option for **Enforce custom list** to *No*.
1. To update the custom banned password configuration, select **Save**.

## Next steps

In this tutorial, you enabled and configured custom password protection lists for Azure AD. You learned how to:

> [!div class="checklist"]
> * Enable custom banned passwords
> * Add entries to the custom banned password list
> * Test password changes with a banned password

> [!div class="nextstepaction"]
> [Enable risk-based Azure Multi-Factor Authentication](tutorial-mfa-applications.md)
