---
title: Quickstart - Access & create new tenant
description: Instructions about how to find Microsoft Entra ID and how to create a new tenant for your organization.
services: active-directory
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: quickstart
ms.date: 06/28/2023
ms.author: barclayn
ms.custom: it-pro, seodec18, fasttrack-edit, mode-other
ms.collection: M365-identity-device-management
---
# Quickstart: Create a new tenant in Microsoft Entra ID

You can do all of your administrative tasks using the Microsoft Entra admin center, including creating a new tenant for your organization. 

In this quickstart article, you'll learn how to get to the Azure portal and Microsoft Entra ID, and you'll learn how to create a basic tenant for your organization.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Create a new tenant for your organization

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

After you sign in to the [Azure portal](https://portal.azure.com), you can create a new tenant for your organization. Your new tenant represents your organization and helps you to manage a specific instance of Microsoft cloud services for your internal and external users.

>[!Note]
>If you're unable to create Microsoft Entra ID or Azure AD B2C tenant, review your user settings page to ensure that tenant creation isn't switched off. If tenant creation is switched off, ask your _Global Administrator_ to assign you a _Tenant Creator_ role.

### To create a new tenant

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the Azure portal menu, select **Microsoft Entra ID**.

1. On the overview page, select **Manage tenants**.
 
1. Select **Create**.

   ![Microsoft Entra ID - Overview page - Create a tenant](media/create-new-tenant/portal.png) 

1. On the Basics tab, select the type of tenant you want to create, either **Microsoft Entra ID** or **Microsoft Entra ID (B2C)**.

1. Select **Next: Configuration** to move to the Configuration tab.

1. On the Configuration tab, enter the following information:

   ![Microsoft Entra ID - Create a tenant page - configuration tab](media/create-new-tenant/create-new-tenant.png)

   - Type your desired Organization name (for example _Contoso Organization_) into the **Organization name** box.
   - Type your desired Initial domain name (for example _Contosoorg_) into the **Initial domain name** box.
   - Select your desired Country/Region or leave the _United States_ option in the **Country or region** box.

1. Select **Next: Review + Create**. Review the information you entered and if the information is correct, select **Create** in the lower left corner.

Your new tenant is created with the domain contoso.onmicrosoft.com.

## Your user account in the new tenant

When you create a new Microsoft Entra tenant, you become the first user of that tenant. As the first user, you're automatically assigned the [Global Administrator](../roles/permissions-reference.md#global-administrator) role. Check out your user account by navigating to the [**Users**](https://portal.azure.com/#blade/Microsoft_AAD_IAM/UsersManagementMenuBlade/MsGraphUsers) page.

By default, you're also listed as the [technical contact](/microsoft-365/admin/manage/change-address-contact-and-more#what-do-these-fields-mean) for the tenant. Technical contact information is something you can change in [**Properties**](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Properties).

> [!WARNING]
> Ensure your directory has at least two accounts with Global Administrator privileges assigned to them. This will help in the case that one Global Administrator is locked out. For more detail see the article, [Manage emergency access accounts in Microsoft Entra ID](../roles/security-emergency-access.md).

## Clean up resources

If you're not going to continue to use this application, you can delete the tenant using the following steps:

- Ensure that you're signed in to the directory that you want to delete through the **Directory + subscription** filter in the Azure portal. Switch to the target directory if needed.
- Select **Microsoft Entra ID**, and then on the **Contoso - Overview** page, select **Delete directory**.

    The tenant and its associated information are deleted.

    ![Overview page, with highlighted Delete directory button](media/create-new-tenant/delete-new-tenant.png)

## Next steps

- Change or add other domain names, see [How to add a custom domain name to Microsoft Entra ID](add-custom-domain.md).

- Add users, see [Add or delete a new user](./add-users.md)

- Add groups and members, see [Create a basic group and add members](./how-to-manage-groups.md).

- Learn about [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) and [Conditional Access](../conditional-access/overview.md) to help manage your organization's application and resource access.

- Learn about Microsoft Entra ID, including [basic licensing information, terminology, and associated features](./whatis.md).
