<properties
	pageTitle="Azure Active Directory B2C preview: Custom attributes | Microsoft Azure"
	description="How to use custom attributes in Azure Active Directory B2C to collect information about your consumers"
	services="active-directory-b2c"
	documentationCenter=""
	authors="swkrish"
	manager="msmbaldwin"
	editor="bryanla"/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/27/2016"
	ms.author="swkrish"/>

#  Azure Active Directory B2C preview: Use custom attributes to collect information about your consumers

[AZURE.INCLUDE [active-directory-b2c-preview-note](../../includes/active-directory-b2c-preview-note.md)]

Your Azure Active Directory (Azure AD) B2C directory comes with a built-in set of information (attributes): Given Name, Surname, City, Postal Code, and other attributes. However, every consumer-facing application has unique requirements on what attributes to gather from consumers. With Azure AD B2C, you can extend the set of attributes stored on each consumer account. You can create custom attributes on the [Azure portal](https://portal.azure.com/) and use it in your sign-up policies, as shown below. You can also read and write these attributes by using the [Azure AD Graph API](active-directory-b2c-devquickstarts-graph-dotnet.md).

> [AZURE.NOTE]
Custom attributes use [Azure AD Graph API Directory Schema Extensions](https://msdn.microsoft.com/library/azure/dn720459.aspx).

## Create a custom attribute

1. [Follow these steps to navigate to the B2C features blade on the Azure portal](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade).
2. Click **User attributes**.
3. Click **+Add** at the top of the blade.
4. Provide a **Name** for the custom attribute (for example, "ShoeSize") and optionally, a **Description**. Click **Create**.

    > [AZURE.NOTE]
    Only the "String" **Data Type** is currently available.

The custom attribute is now available in the list of **User attributes**, and for use in your sign-up policies.

## Use a custom attribute in your sign-up policy

1. [Follow these steps to navigate to the B2C features blade on the Azure portal](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade).
2. Click **Sign-up policies**.
3. Click your sign-up policy (for example, "B2C_1_SiUp") to open it. Click **Edit** at the top of the blade.
4. Click **Sign-up attributes** and select the custom attribute (for example, "ShoeSize"). Click **OK**.
5. Click **Application claims** and select the custom attribute. Click **OK**.
6. Click **Save** at the top of the blade.

You can use the "Run now" feature on the policy to verify the consumer experience. You should now see "ShoeSize" in the list of attributes collected during consumer sign-up, and see it in the token sent back to your application.

## Notes

- Along with sign-up policies, custom attributes can also be used in sign-up or sign-in policies and profile editing policies.
- There is a known limitation of custom attributes. It is only created the first time it is used in any policy, and not when you add it to the list of **User attributes**. We plan to fix this soon.
