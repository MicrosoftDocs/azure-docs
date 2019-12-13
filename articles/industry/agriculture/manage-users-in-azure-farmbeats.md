---
title: Manage users
description: This article describes how to manage users.
author: uhabiba04
ms.topic: article
ms.date: 12/02/2019
ms.author: v-umha
---


# Manage users

Azure FarmBeats includes user management for people who are part of your Azure Active Directory (Azure AD). You are able to add users to your Azure FarmBeats instance to access the APIs, view the generated maps, and sensor telemetry from the farm.

## Prerequisites

- An Azure FarmBeats deployment is required. See [Install Azure FarmBeats](install-azure-farmbeats.md) to know more on how to setup Azure FarmBeats.
- The email ID of the users you want to add or remove from your Azure FarmBeats instance.

## Manage Azure FarmBeats users

Azure FarmBeats uses Azure AD for authentication, access control and roles. Users in the Azure AD tenant can be added as users in Azure FarmBeats.

> [!NOTE]
> If the user you are trying to add is not present in the Azure AD tenant, follow the instructions in the **Add Azure AD users** section to complete the setup, before proceeding to set them up as Azure FarmBeats users.

**Roles**

There are two kinds of user roles supported in Azure FarmBeats today:

 - **Admin** — All access to Azure FarmBeats Datahub APIs. Users in this role can query all  Azure FarmBeats Datahub objects, perform all operations from the FarmBeats Accelerator.
 - **Read-Only** — Read-only access to FarmBeats Datahub APIs. Users can view the Datahub APIs, the Accelerator Dashboards and the maps. A user with “Read-only” role will NOT be able to perform any operations like generate maps, associate devices or create farms.


## Add user to Azure FarmBeats

Follow the steps to add a user to Azure FarmBeats:

1.	Sign in to the Accelerator and then select the **Settings** icon.
2.	Select **Access Control**.

    ![Project Farm Beats](./media/create-farms-in-azure-farmbeats/settings-users-1.png)

3.	Enter the email ID of the user you want to provide access.
4.	Select the desired role – Admin or Read-Only.
5.	Select **Add Role**.

The added user(s) will now be able to access Azure FarmBeats (both Datahub and Accelerator).

## Delete user from Azure FarmBeats

Follow the steps to remove a user from the Azure FarmBeats system:

1.	Sign in to the Accelerator and then select the **Settings** icon.
2.	Select **Access Control**.
3.	Select the **Delete** to delete a user.

The user is deleted from the system. You will receive the following message to confirm the successful operation.

![Project Farm Beats](./media/create-farms-in-azure-farmbeats/manage-users-2.png)

## Add Azure AD users

> [!NOTE]
> Follow the below steps to provide user access to Azure FarmBeats, if the user doesn't exist in the Azure AD tenant. You can skip the below steps if the user exists in Azure AD tenant.
>

FarmBeats users need to exist in the Azure AD tenant before you can assign them to applications and roles. To add users to Azure AD, use the following steps:

1.	Sign in to the [Azure portal](https://portal.azure.com/).
2.	Select your account in the top-right corner, and switch to the Azure AD tenant associated to FarmBeats.
3.	Select **Azure Active Directory > Users**.
    You see a list of users in your directory.
4.	To add users to the directory, select **New user**. For external users, select **New guest user**.

    ![Project Farm Beats](./media/create-farms-in-azure-farmbeats/manage-users-3.png)

5.	Complete the required fields for the new user. Select **Create**.

Visit [Azure AD](https://docs.microsoft.com/azure/active-directory/fundamentals/add-users-azure-active-directory/) documentation for more details on how to manage users within Azure AD.

## Next steps

You have successfully added users to Azure FarmBeats instance. Now, learn how to [create farms](manage-farms-in-azure-farmbeats.md#create-farms).
