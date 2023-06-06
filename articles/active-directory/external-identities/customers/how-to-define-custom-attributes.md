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
ms.date: 05/08/2023
ms.author: mimart
ms.custom: it-pro

---

# Collect user attributes during sign-up  

User attributes are values collected from the user during self-service sign-up. In the user flow settings, you can select from a set of *built-in user attributes* you want to collect from customers. The customer enters the information on the sign-up page, and it's stored with their profile in your directory. Azure AD provides the following built-in user attributes:

  - City
  - Country/Region
  - Display Name
  - Email Address
  - Given Name
  - Job Title
  - Postal Code
  - State/Province
  - Street Address
  - Surname

If you want to collect information beyond the built-in attributes, you can create *custom user attributes* and add them to your sign-up user flow. Custom attributes are also known as directory extension attributes because they extend the user profile information stored in your customer directory. All extension attributes for your customer tenant are stored in an app named *b2c-extensions-app*. After a user enters a value for the custom attribute during sign-up, it's added to the user object and can be called via the Microsoft Graph API.

If your application relies on certain built-in or custom user attributes, you can [include these attributes in the token](how-to-add-attributes-to-token.md) that is sent to your application.

## Create custom attributes

1. In the [Microsoft Entra admin center](https://entra.microsoft.com/), select **Azure Active Directory**.
1. Select **External Identities** > **Overview**.
1. Select **Custom user attributes**. The available user attributes are listed.
1. To add an attribute, select **Add**.
1. In the **Add an attribute** pane, enter the following values:

   - **Name** - Provide a name for the custom attribute. For example, "Loyalty number".
   - **Data Type** - Choose a data type, **String**, **Boolean**, or **Int**.
   - **Description** - Optionally, enter a description of the custom attribute for internal use. This description isn't visible to the user.

1. Select **Create**. The custom attribute is now available in the list of user attributes and can be added to your user flows. 

## Select attributes (built-in and custom) for sign-up

1. Under **User attributes**, choose the attributes you want to collect from the user during sign-up. Select **Show more** to choose from the full list of attributes, including **Job Title**, **Display Name**, and **Postal Code**. This list also includes any custom attributes you defined.

   :::image type="content" source="media/how-to-define-custom-attributes/user-attributes.png" alt-text="Screenshot of the user attribute options on the Create a user flow page.":::

1. Select **OK**.

1. Select **Create** to create the user flow.

## Select the layout of the attribute collection page

You can choose the order in which the attributes are displayed on the sign-up page.

1. In the [Microsoft Entra admin center](https://entra.microsoft.com/), select **Azure Active Directory**.

1. In the left pane, select **Azure Active Directory** > **External Identities** > **User flows**.

1. From the list, select your user flow.

1. Under **Customize**, select **Page layouts**. The attributes you chose to collect appear.

   - To change the properties of an attribute, select a value under the **Label**, **Required**, or **Attribute type** columns, and then type or select a new value.

   - To change the order of display, select an attribute, and then select **Move up**, **Move down**, **Move to the top**, or **Move to the bottom**.

   :::image type="content" source="media/how-to-define-custom-attributes/page-layouts.png" alt-text="Screenshot of page layout options for a user flow.":::

1. Select **Save**.

1. Select **Create**. The new user flow appears in the user flows list. (You might need to refresh the page.)

## Next steps

[Add attributes to the ID token returned to your application](how-to-add-attributes-to-token.md)

[Create a sign-up and sign-in user flow for customers](how-to-user-flow-sign-up-sign-in-customers.md)