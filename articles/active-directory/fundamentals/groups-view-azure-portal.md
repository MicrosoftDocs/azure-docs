---
title: Quickstart - View groups & members
description: Instructions about how to search for and view your organization's groups and their assigned members.
services: active-directory
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: quickstart
ms.date: 08/17/2022
ms.author: barclayn
ms.custom: it-pro, seodec18, seo-update-azuread-jan, mode-other
ms.reviewer: krbain
ms.collection: M365-identity-device-management
#Customer intent: As a brand-new Azure AD administrator, I need to view my organization’s groups along with the assigned members, so I can manage permissions to apps and services for people in my organization.
---

# Quickstart: Create a group with members and view all groups and members in Azure Active Directory
You can view your organization's existing groups and group members using the Azure portal. Groups are used to manage users that all need the same access and permissions for potentially restricted apps and services.

In this quickstart, you’ll set up a new group and assign members to the group. Then you'll view your organization's group and assigned members. Throughout this guide, you'll create a user and group that you can use in other Azure AD Fundamentals quickstarts and tutorials.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. 

## Prerequisites

Before you begin, you’ll need to:

- Create an Azure Active Directory tenant. For more information, see [Access the Azure portal and create a new tenant](active-directory-access-create-new-tenant.md).

<a name='sign-in-to-the-azure-portal'></a>

## Sign in to the [Azure portal](https://portal.azure.com)

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

You must sign in to the [Azure portal](https://portal.azure.com) using a Global administrator account for the directory.

## Create a new group 

Create a new group, named _MDM policy - West_. For more information about creating a group, see [How to create a basic group and add members](active-directory-groups-create-azure-portal.md).

1. Go to **Azure Active Directory** > **Groups**.

1. Select **New group**.

1. Complete the **Group** page:
    
    - **Group type:** Select **Security**
    
    - **Group name:** Type _MDM policy - West_
    
    - **Membership type:** Select **Assigned**.

1. Select **Create**.

## Create a new user
A user must exist before being added as a group member, so you'll need to create a new user. For this quickstart, we've added a user named _Alain Charon_. Check the "Custom domain names" tab first to get the verified domain name in which to create users. For more information about creating a user, see [How to add or delete users](add-users-azure-active-directory.md).

1. Go to **Azure Active Directory** > **Users**.

1.  Select  **New user**.

1. Complete the **User** page:

    - **Name:** Type _Alain Charon_.

    - **User name:** Type *alain\@contoso.com*.

1. Copy the auto-generated password provided in the **Password** box and select **Create**.

## Add a group member
Now that you have a group and a user, you can add _Alain Charon_ as a member to the _MDM policy - West_ group. For more information about adding group members, see the [Manage groups](how-to-manage-groups.md) article.

1. Go to **Azure Active Directory** > **Groups**.

2. From the **Groups - All groups** page, search for and select the **MDM policy - West** group.

3. From the **MDM policy - West Overview** page, select **Members** from the **Manage** area.

4. Select **Add members**, and then search and select **Alain Charon**.

5. Choose **Select**.

## View all groups
You can see all the groups for your organization in the **Groups - All groups** page of the Azure portal.

- Go to **Azure Active Directory** > **Groups**.

    The **Groups - All groups** page appears, showing all your active groups.

    ![Screenshot of the 'Groups-All groups' page, showing all existing groups.](media/groups-view-azure-portal/groups-search.png)

## Search for a group
Search the **Groups – All groups** page to find the **MDM policy – West** group.

1. From the **Groups - All groups** page, type _MDM_ into the **Search** box.

    The search results appear under the **Search** box, including the _MDM policy - West_ group.

    ![Screenshot of the 'Groups' search page showing matching search results.](media/groups-view-azure-portal/groups-search-group-name.png)

1. Select the group **MDM policy – West**.

1. View the group info on the **MDM policy - West Overview** page, including the number of members of that group.

    ![Screenshot of MDM policy – West Overview page with member info.](media/groups-view-azure-portal/groups-overview.png)

## View group members
Now that you’ve found the group, you can view all the assigned members.

Select **Members** from the **Manage** area, and then review the complete list of member names assigned to that specific group, including _Alain Charon_.

![Screenshot of the list of members assigned to the MDM policy – West group.](media/groups-view-azure-portal/groups-all-members.png)

## Clean up resources
The group you just created is used in other articles in the Azure AD Fundamentals documentation. If you'd rather not use this group, you can delete it and its assigned members using the following steps:

1. On the **Groups - All groups** page, search for the **MDM policy - West** group.

1. Select the **MDM policy - West** group.

    The **MDM policy - West Overview** page appears.

1. Select **Delete**.

    The group and its associated members are deleted.

    ![Screenshot of the MDM policy – West Overview page with Delete link highlighted.](media/groups-view-azure-portal/groups-delete.png)

    >[!Important]
    >This doesn't delete the user Alain Charon, just his membership in the deleted group.

## Next steps
Advance to the next article to learn how to associate a subscription to your Azure AD directory.

> [!div class="nextstepaction"]
> [Associate an Azure subscription](active-directory-how-subscriptions-associated-directory.md)
