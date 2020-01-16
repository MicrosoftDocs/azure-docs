---
title: Change the SKU for an Azure AD Domain Services | Microsoft Docs
description: Learn how to the SKU tier for an Azure AD Domain Services managed domain if your business requirements change
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: conceptual
ms.date: 01/16/2020
ms.author: iainfou

#Customer intent: As an identity administrator, I want to change the SKU for my Azure AD Domain Services managed domain to use different features as my business requirements change.
---

# Change the SKU for an existing Azure AD Domain Services managed domain

In Azure Active Directory Domain Services (Azure AD DS), the available performance and features are based on the SKU type. These feature differences include the backup frequency or maximum number of one-way outbound forest trusts. You select a SKU when you create the managed domain, and you can switch SKUs as your business needs change after the managed domain has been deployed. Changes in business requirements could include the need for more frequent backups or additional forest trusts. For more information on the limits and pricing of the different SKUs, see [Azure AD DS SKU concepts][concepts-sku] and [Azure AD DS pricing][pricing] pages.

This article shows you how to change the SKU for an existing Azure AD DS managed domain using the Azure portal.

## Before you begin

To complete this article, you need the following resources and privileges:

* An active Azure subscription.
    * If you don’t have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Active Directory tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
    * If needed, [create an Azure Active Directory tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
* An Azure Active Directory Domain Services managed domain enabled and configured in your Azure AD tenant.
    * If needed, complete the tutorial to [create and configure an Azure Active Directory Domain Services instance][create-azure-ad-ds-instance].

## Select a new SKU

The SKU for an Azure AD DS managed domain is changed using the Azure portal.

1. At the top of the Azure portal, search for and select **Azure AD Domain Services**. Choose your managed domain from the list, such as *aadds.contoso.com*.
1. On the **Overview** page is an option to **Choose SKU**, as shown in the following example:

    ![Select the option to change SKU from the Overview page of your Azure AD DS managed domain in the Azure portal](media/change-sku/overview-change-sku.png)

    You can also select **Settings > SKU** from the menu on the left-hand side of the Azure AD DS page.

1.  From the drop-down menu, select the SKU you wish for your Azure AD DS managed domain. If you have a resource forest, you can't select *Standard* SKU as forest trusts are only available on the *Enterprise* SKU or higher.

    Choose the SKU you want from the drop-down menu, then select **Save**.

    ![Choose the required SKU from the drop-down menu in the Azure portal](media/change-sku/change-sku-selection.png)

It can take a minute or two to change the SKU type.

## Next steps

If you have a resource forest and need to create additional trusts after the SKU change, see [Create an outbound forest trust to an on-premises domain in Azure AD DS (preview)][create-trust].

<!-- INTERNAL LINKS -->
[create-azure-ad-tenant]: ../active-directory/fundamentals/sign-up-organization.md
[associate-azure-ad-tenant]: ../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md
[create-azure-ad-ds-instance]: tutorial-create-instance.md
[concepts-sku]: administration-concepts.md#azure-ad-ds-skus
[create-trust]: tutorial-create-forest-trust.md

<!-- EXTERNAL LINKS -->
[pricing]: https://azure.microsoft.com/pricing/details/active-directory-ds/
