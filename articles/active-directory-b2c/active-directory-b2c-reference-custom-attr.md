---
title: Define custom attributes in Azure Active Directory B2C | Microsoft Docs
description: Define custom attributes for your application in Azure Active Directory B2C to collect information about your customers.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 07/10/2018
ms.author: davidmu
ms.component: B2C
---

# Define custom attributes in Azure Active Directory B2C

 Every customer-facing application has unique requirements for the information that needs to be collected. Your Azure Active Directory (Azure AD) B2C tenant comes with a built-in set of information stored in attributes, such as Given Name, Surname, City, and Postal Code. With Azure AD B2C, you can extend the set of attributes stored on each customer account. 
 
 You can create custom attributes in the [Azure portal](https://portal.azure.com/) and use them in your sign-up policies, sign-up or sign-in policies, or profile editing policies. You can also read and write these attributes by using the [Azure AD Graph API](active-directory-b2c-devquickstarts-graph-dotnet.md). Custom attributes in Azure AD B2C use [Azure AD Graph API Directory Schema Extensions](https://msdn.microsoft.com/library/azure/ad/graph/howto/azure-ad-graph-api-directory-schema-extensions).

## Create a custom attribute

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
2. Make sure you're using the directory that contains your Azure AD B2C tenant by switching to it in the top-right corner of the Azure portal. Select your subscription information, and then select **Switch Directory**. 

    ![Switch to your Azure AD B2C tenant](./media/active-directory-b2c-reference-custom-attr/switch-directories.png)

    Choose the directory that contains your tenant.

    ![Select directory](./media/active-directory-b2c-reference-custom-attr/select-directory.png)

3. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
4. Select **User attributes**, and then select **Add**.
5. Provide a **Name** for the custom attribute (for example, "ShoeSize")
6. Choose a **Data Type**. Only **String**, **Boolean**, and **Int** are available.
7. Optionally, enter a **Description** for informational purposes. 
8. Click **Create**.

The custom attribute is now available in the list of **User attributes** and for use in your policies. A custom attribute is only created the first time it is used in any policy, and not when you add it to the list of **User attributes**.

## Use a custom attribute in your policy

1. In your Azure AD B2C tenant, select **Sign-up or sign-in policies**.
2. Select your policy (for example, "B2C_1_SignupSignin") to open it. 
3. Click **Edit**.
4. Select **Sign-up attributes** and then select the custom attribute (for example, "ShoeSize"). Click **OK**.
5. Select **Application claims** and then select the custom attribute. Click **OK**.
6. Click **Save**.

You can use the **Run now** feature on the policy to verify the customer experience. You should now see **ShoeSize** in the list of attributes collected during the sign-up journey, and see it in the token sent back to your application.

