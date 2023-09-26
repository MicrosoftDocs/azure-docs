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
ms.date: 08/31/2023
ms.author: mimart
ms.custom: it-pro

---

# Collect user attributes during sign-up  

User attributes are values collected from the user during self-service sign-up. In the user flow settings, you can select from a set of *built-in user attributes* you want to collect from customers. The customer enters the information on the sign-up page, and it's stored with their profile in your directory. Microsoft Entra ID provides the following built-in user attributes:

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

If you want to collect information beyond the built-in attributes, you can create *custom user attributes* and add them to your sign-up user flow. Custom attributes are also known as directory extension attributes because they extend the user profile information stored in your customer directory. All extension attributes for your customer tenant are stored in an app named *b2c-extensions-app*. After a user enters a value for the custom attribute during sign-up, it's added to the user object and can be called via the Microsoft Graph API using the naming convention `extension_<b2c-extensions-app-id>_attributename`.

If your application relies on certain built-in or custom user attributes, you can [include these attributes in the token](how-to-add-attributes-to-token.md) that is sent to your application.


## Create custom attributes

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com).
1. Browse to **Identity** > **External Identities** > **Overview**.
1. Select **Custom user attributes**. The available user attributes are listed.
1. To add an attribute, select **Add**. In the **Add an attribute** pane, enter the following values:

   - **Name** - Provide a name for the custom attribute. For example, "Loyalty number."
   - **Data Type** - Choose a data type, **String**, **Boolean**, or **Int**.
   - **Description** - Optionally, enter a description of the custom attribute for internal use. This description isn't visible to the user.

   :::image type="content" source="media/how-to-define-custom-attributes/add-attribute.png" alt-text="Screenshot of the pane for adding an attribute." lightbox="media/how-to-define-custom-attributes/add-attribute.png":::

1. Select **Create**. The custom attribute is now available in the list of user attributes and can be [added to your user flows](#include-custom-attributes-in-a-sign-up-flow).

### Referencing custom attributes

The custom attributes you create are added to the *b2c-extensions-app* registered in your customer tenant. If you want to call a custom attribute from an application or manage it via Microsoft Graph, use the naming convention `extension_<b2c-extensions-app-id>_<custom-attribute-name>` where:

- `<b2c-extensions-app-id>` is the *b2c-extensions-app* application ID with no hyphens.
- `<custom-attribute-name>` is the name you assigned to the custom attribute.

To find the application ID for the *b2c-extensions-app* registered in your customer tenant:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com).
1. Browse to **Identity** > **App registrations** > **All applications**.
1. Select the application **b2c-extensions-app. Do not modify. Used by AADB2C for storing user data.**
2. On the **Overview** page, use the **Application (client) ID** value, for example: `12345678-abcd-1234-1234-ab123456789`, but remove the hyphens.

**Example**: If you created a custom attribute named **loyaltyNumber**, refer to it as follows:

`extension_12345678abcd12341234ab123456789_loyaltyNumber`

## Include custom attributes in a sign-up flow

Follow these steps to add custom attributes to a user flow you've already created. (For a new user flow, see [Create a sign-up and sign-in user flow for customers](how-to-user-flow-sign-up-sign-in-customers.md).)

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com).

1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to your customer tenant.

1. Browse to **Identity** > **External Identities** > **User flows**.

1. Select the user flow from the list.

1. Select **User attributes**. The list includes any custom attributes you defined as described in the previous section. For example, the new **Rewards number** attribute now appears in the list. Choose the attributes you want to collect from the user during sign-up.

   :::image type="content" source="media/how-to-define-custom-attributes/user-attributes.png" alt-text="Screenshot of the user attribute options on the Create a user flow page." lightbox="media/how-to-define-custom-attributes/user-attributes.png":::

1. Select **Save**.

## Select the layout of the attribute collection page

You can choose the order in which the attributes are displayed on the sign-up page.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com).

1. Browse to **Identity** > **External Identities** > **User flows**.

1. From the list, select your user flow.

1. Under **Customize**, select **Page layouts**. The attributes you chose to collect appear.

   - To change the properties of an attribute, select a value under the **Label**, **Required**, or **Attribute type** columns, and then type or select a new value. (For security reasons, **Email Address** properties can't be changed).

   - To change the order of display, select an attribute, and then select **Move up**, **Move down**, **Move to the top**, or **Move to the bottom**.

   :::image type="content" source="media/how-to-define-custom-attributes/page-layouts.png" alt-text="Screenshot of page layout options for a user flow." lightbox="media/how-to-define-custom-attributes/page-layouts.png":::   

1. Select **Save**.

## Next steps

[Add attributes to the ID token returned to your application](how-to-add-attributes-to-token.md)

[Create a sign-up and sign-in user flow for customers](how-to-user-flow-sign-up-sign-in-customers.md)
