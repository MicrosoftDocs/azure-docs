---
title: Define custom attributes in Azure Active Directory B2C | Microsoft Docs
description: Define custom attributes for your application in Azure Active Directory B2C to collect information about your customers.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 11/30/2018
ms.author: mimart
ms.subservice: B2C
---

# Define custom attributes in Azure Active Directory B2C

 Every customer-facing application has unique requirements for the information that needs to be collected. Your Azure Active Directory B2C (Azure AD B2C) tenant comes with a built-in set of information stored in attributes, such as Given Name, Surname, City, and Postal Code. With Azure AD B2C, you can extend the set of attributes stored on each customer account.

 You can create custom attributes in the [Azure portal](https://portal.azure.com/) and use them in your sign-up user flows, sign-up or sign-in user flows, or profile editing user flows. You can also read and write these attributes by using the [Microsoft Graph API](manage-user-accounts-graph-api.md).

## Create a custom attribute

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
2. Make sure you're using the directory that contains your Azure AD B2C tenant by switching to it in the top-right corner of the Azure portal. Select your subscription information, and then select **Switch Directory**.

    ![Switch to your Azure AD B2C tenant](./media/user-flow-custom-attributes/switch-directories.png)

    Choose the directory that contains your tenant.

    ![B2C tenant highlighted in Directory and Subscription filter](./media/user-flow-custom-attributes/select-directory.PNG)

3. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
4. Select **User attributes**, and then select **Add**.
5. Provide a **Name** for the custom attribute (for example, "ShoeSize")
6. Choose a **Data Type**. Only **String**, **Boolean**, and **Int** are available.
7. Optionally, enter a **Description** for informational purposes.
8. Click **Create**.

The custom attribute is now available in the list of **User attributes** and for use in your user flows. A custom attribute is only created the first time it is used in any user flow, and not when you add it to the list of **User attributes**.

## Use a custom attribute in your user flow

1. In your Azure AD B2C tenant, select **User flows**.
1. Select your policy (for example, "B2C_1_SignupSignin") to open it.
1. Select **User attributes** and then select the custom attribute (for example, "ShoeSize"). Click **Save**.
1. Select **Application claims** and then select the custom attribute.
1. Click **Save**.

Once you've created a new user using a user flow which uses the newly created custom attribute, the object can be queried in [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer). Alternatively you can use the [Run user flow](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-user-flows) feature on the user flow to verify the customer experience. You should now see **ShoeSize** in the list of attributes collected during the sign-up journey, and see it in the token sent back to your application.
