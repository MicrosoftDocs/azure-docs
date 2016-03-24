<properties
   pageTitle="How to add or remove a user role | Microsoft Azure"
   description="Learn how to add roles to privileged identities with the Azure Active Directory Privileged Identity Management extension."
   services="active-directory"
   documentationCenter=""
   authors="kgremban"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="03/17/2016"
   ms.author="kgremban"/>

# Azure AD Privileged Identity Management: How to add or remove a user role

## Adding or removing a user role
There are several ways to navigate to the **Add managed users** blade of the Privileged Identity Management (PIM) interface. The click sequence for each is listed below:

- Dashboard > Users in Admin Roles > Add or Remove
- Dashboard > Role Summary > All Users List > Add or Remove
- Dashboard > click on user role in role table (for example Global Administrator) > Add or Remove

## Add a user to a role
Once you have navigated to the **Add managed users** blade:

1. Click on **Select a role**. If you have navigated here from clicking on a user role in the role table, then the role will already be selected.
2. Select a role from the role list. For example, **Password Administrator**, the **Select users** blade will open.
3. Enter the name of the user in the search field.  If the user is in the directory, their accounts will appear as you are typing as will other users with similar names.
4. Select the user in the list, and click **Done**.
5. Click **OK** to save your selection. The user you have selected will appear in the list and the role will be temporary.
6. If you want to make the role permanent, click the user in the list. The user's information will appear in a new blade. Select **make perm** in the user information menu.

    You'll need to do this if the user cannot register for Azure Muti-Fator Authentication (MFA), or is using a Microsoft account. Temporary admins are asked to register for MFA during activation.

7. Click **Activate** to start a request to active this role for the user.  Enter the reason for the activation in the **Request reason** text field.  At this time, the role will automatically be activated for this user, and a notification will be sent to global administrators.

## Remove a user from a role
1. Navigate to the user in the user role list using one of the paths described above.
2. Click on the user in the user list.
3. Click on **Remove**.  You will be presented with a confirmation message.
4. Click **Yes** to remove the role from the user.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]
