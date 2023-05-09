---
title: Define custom attributes
description: Learn how to create and define new custom attributes to be collected from users during sign-up and sign-in.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/07/2023
ms.author: mimart
ms.custom: it-pro

---

# Define custom attributes to collect during sign-up  

User attributes are values collected from the user during self-service sign-up flow. Azure AD for customers comes with a built-in set of attributes, but you can create custom attributes for use in your user flow. You can also read and write these attributes by using the Microsoft Graph API. Check out the define custom attributes for user flows<!--(API-reference-CIAM-user-flows.md#scenario-6-list-attributes-in-a-userflow)--> article.

## To add custom attributes

1. In the [Microsoft Entra admin center](https://entra.microsoft.com/), select **Azure Active Directory**.
1. Select **External Identities** > **Overview**.
1. Select **Custom user attributes**. The available user attributes are listed.
1. To add an attribute, select **Add**.
1. In the **Add an attribute** pane, enter the following values:

   - **Name** - Provide a name for the custom attribute. For example, "Loyalty number".
   - **Data Type** - Choose a data type, **String**, **Boolean**, or **Int**.
   - **Description** - Optionally, enter a description of the custom attribute for internal use. This description isn't visible to the user.

1. Select **Create**.

The custom attribute is now available in the list of user attributes and for use in your user flows. A custom attribute is only created the first time it's used in any user flow, and not when you add it to the list of user attributes.

After you've created a new user using a user flow that uses the newly created custom attribute, the object can be queried in Microsoft Graph Explorer. You can call the Graph API from your application to get the data from this attribute after it's added to the user object.

## Next steps

[Create a sign-up and sign-in user flow for customers](how-to-user-flow-sign-up-sign-in-customers.md)