<properties
   pageTitle="How To activate or deactivate a role | Microsoft Azure"
   description="Learn how to activate roles for privileged identities with the Azure Privileged Identity Management extension."
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

# Azure AD Privileged Identity Management: How to activate or deactivate a role

## Activating or deactivating a role

1. Log in to the [Azure portal](https://portal.azure.com/).
2. Follow the steps in [Getting Started with Azure Privileged Identity Management](active-directory-privileged-identity-management-getting-started.md) to place Azure PIM on the Azure portal dashboard.
3. After you have completed the steps in the Security Wizard, you will see the main menu of Azure PIM.
4. Click on **Activate my role**.
5. A list of roles that have been assigned to you will appear.
6. Click on the role you want to activate.
7. Click **Activate**. The **Request role activation** blade will appear.
8. Enter the reason for the activation request in the text field.
9. Click **OK**.  The role will now be activated.
10. Once a role has been activated you can also deactivate a role by clicking **Deactivate**.  Additionally, the role can be removed from the user by using the steps in [Adding or Removing a Role](active-directory-privileged-identity-management-how-to-add-role-to-user.md).

For more information about security alerts specific to role activation settings see [How to Configure Security Alerts](active-directory-privileged-identity-management-how-to-configure-security-alerts.md).

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]
