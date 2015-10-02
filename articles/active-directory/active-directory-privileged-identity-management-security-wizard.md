<properties
   pageTitle="The Azure Privileged Identity Management Security Wizard"
   description="The first time you use the Azure Privileged Identity Managment extention, you will be presented with a security wizard. This article describes the steps for using the wizard."
   services="active-directory"
   documentationCenter=""
   authors="IHenkel"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="na"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="08/31/2015"
   ms.author="inhenk"/>

# The Azure Privileged Identity Management Security Wizard

The first time you run Azure Privileged Identity Management, you will be presented with a wizard. The wizard helps you understand the security risks of privileged identities and how to use Privileged Identity Management to reduce risk.

There are three sections to review, **YOUR ADMINS MIGHT PUT YOU AT RISK, MANAGE YOUR ADMINS’ ATTACK SURFACE**, and **DEFINE TEMPORARY ADMIN SETTINGS**. Each section gives you an overview of the concepts and an explanation of some actions to take.

At first, all of your global administrators will be permanent. When you click on **YOUR ADMINS MIGHT PUT YOU AT RISK**, you will be shown a list of global administrator roles and how many of them you currently have.

Clicking on **MANAGE YOUR ADMINS’ ATTACK SURFACE**, will present you with an opportunity to change administrators to temporary, leave them permanent or remove them from the role altogether.

**DEFINE TEMPORARY ADMINS SETTINGS** allows you to determine how long a temporary administrator will have privileges, enable notifications, and require multi-factor authentication.

## Change Global Administrator Roles to Temporary or Permanent

You have three options for changing the time window of a global administrator.

1.  Click the **Make all temporary** button to make all global administrators temporary.

2.  Click the **Make all permanent** button to make all global administrators permanent.

3.  Select **Keep Perm**, **Make Temp**, or **Remove from Role** for each global administrator.

4.  Click **OK**.

5.  Click **Submit**.

## Change the activation period for a global administrator role.

1.  Move the **activation period** slider to the left or right to increase or decrease the activation period. The activation period can be up to 72 hours.

2.  Enter the number of hours in the **hours** field to the right of the slider.

## Enable notifications

So administrators can receive mail when roles are made active, enable notifications by clicking the **Enable** button. You can also disable this feature.

## Require Multi-Factor Authentication

If you want administrators to be required to use MFA to log in to their accounts and to request an extension of their role, enable MFA by clicking the **Enable** button. You can also disable this feature.

For more information about MFA and PIM, click here. PLACEHOLDER: NEED LINK TO MFA DOC.

Select the roles that these settings will be applied to. Click **OK**.

> [AZURE.WARNING] If is important, at this time, that you have more than one security administrator, because if that one security administrator is not set to permanent and the role assignment expires, and you don’t have MFA set up for that user, the user will not be able to administer PIM at all.

Click the **OK** button. When you are finished.

After you have made changes, the wizard will no longer show up. However, you can access it again by clicking the Wizard button under Manage identities.

## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]
