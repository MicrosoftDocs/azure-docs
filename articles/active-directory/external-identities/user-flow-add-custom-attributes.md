---
title: Add custom attributes to self-service sign-up flows
description: Learn about customizing the attributes for your self-service sign-up user flows.
services: active-directory
author: msmimart
manager: celestedg

ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 11/07/2022
ms.author: mimart
ms.custom: engagement-fy23, it-pro
ms.collection: M365-identity-device-management

# Customer intent: As a tenant administrator, I want to create custom attributes for the self-service sign-up user flows.
---

# Define custom attributes for user flows

> [!TIP]
> This article applies to B2B collaboration user flows. If your tenant is configured for customer identity and access management, see [Collect user attributes during sign-up](customers/how-to-define-custom-attributes.md) for customers.

For each application, you might have different requirements for the information you want to collect during sign-up. Microsoft Entra External ID comes with a built-in set of information stored in attributes, such as Given Name, Surname, City, and Postal Code. With Microsoft Entra External ID, you can extend the set of attributes stored on a guest account when the external user signs up through a user flow.

You can create custom attributes in the Microsoft Entra admin center and use them in your [self-service sign-up user flows](self-service-sign-up-user-flow.md). You can also read and write these attributes by using the [Microsoft Graph API](/azure/active-directory-b2c/microsoft-graph-operations). Microsoft Graph API supports creating and updating a user with extension attributes. Extension attributes in the Graph API are named by using the convention `extension_<extensions-app-id>_attributename`. For example:

```JSON
"extension_831374b3bd5041bfaa54263ec9e050fc_loyaltyNumber": "212342"
```

The `<extensions-app-id>` is specific to your tenant. To find this identifier, navigate to **Identity** > **Applications** > **App registrations** > **All applications**. Search for the app that starts with "aad-extensions-app" and select it. On the app's Overview page, note the Application (client) ID.

## Create a custom attribute

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **External Identities** > **Overview**.
4. Select **Custom user attributes**. The available user attributes are listed.

   :::image type="content" source="media/user-flow-add-custom-attributes/user-attributes.png" alt-text="Screenshot of selecting custom user attributes for sign-up." lightbox="media/user-flow-add-custom-attributes/user-attributes-large-image.png":::


5. To add an attribute, select **Add**.
6. In the **Add an attribute** pane, enter the following values:

   - **Name** - Provide a name for the custom attribute (for example, "Shoe size").
   - **Data Type** - Choose a data type (**String**, **Boolean**, or **Int**).
   - **Description** - Optionally, enter a description of the custom attribute for internal use. This description isn't visible to the user.

   :::image type="content" source="media/user-flow-add-custom-attributes/add-an-attribute.png" alt-text="Screenshot of adding a custom attribute.":::

7. Select **Create**.

The custom attribute is now available in the list of user attributes and for use in your user flows. A custom attribute is only created the first time it's used in any user flow, and not when you add it to the list of user attributes.

Once you've created a new user using a user flow that uses the newly created custom attribute, the object can be queried in [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer). You should now see **ShoeSize** in the list of attributes collected during the sign-up journey on the user object. You can call the Graph API from your application to get the data from this attribute after it's added to the user object.

## Next steps

- [Add a self-service sign-up user flow to an app](self-service-sign-up-user-flow.md)
- [Customize the user flow language](user-flow-customize-language.md)
