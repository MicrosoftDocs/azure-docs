---
title: Add custom attributes to self-service sign-up flows - Azure AD
description: Learn about customizing the attributes for your self-service sign-up user flows.
services: active-directory
author: msmimart
manager: celestedg

ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 06/16/2020
ms.author: mimart
ms.custom: "it-pro"
ms.collection: M365-identity-device-management
---

# Define custom attributes for user flows (Preview)

> [!NOTE]
> The custom user attributes feature is a public preview feature of Azure Active Directory. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

For each application, you might have different requirements for the information you want to collect during sign-up. Azure AD comes with a built-in set of information stored in attributes, such as Given Name, Surname, City, and Postal Code. With Azure AD, you can extend the set of attributes stored on a guest account when the external user signs up through a user flow.

You can create custom attributes in the Azure portal and use them in your self-service sign-up user flows. You can also read and write these attributes by using the [Microsoft Graph API](https://docs.microsoft.com/azure/active-directory-b2c/manage-user-accounts-graph-api). Microsoft Graph API supports creating and updating a user with extension attributes. Extension attributes in the Graph API are named by using the convention `extension_<extensions-app-id>_attributename`. For example:

```JSON
"extension_831374b3bd5041bfaa54263ec9e050fc_loyaltyNumber": "212342"
```

The `<extensions-app-id>` is specific to your tenant. To find this identifier, navigate to Azure Active Directory > App registrations > All applications. Search for the app that starts with "aad-extensions-app" and select it. On the app's Overview page, note the Application (client) ID.

## Create a custom attribute

1. Sign in to the [Azure portal](https://portal.azure.com) as an Azure AD administrator.
2. Under **Azure services**, select **Azure Active Directory**.
3. In the left menu, select **External Identities**.
4. Select **Custom user attributes (Preview)**. The available user attributes are listed.

   ![Select user attributes for sign-up](media/user-flow-add-custom-attributes/user-attributes.png)

5. To add an attribute, select **Add**.
6. In the **Add an attribute** pane, enter the following values:

   - **Name** - Provide a name for the custom attribute (for example, "Shoesize").
   - **Data Type** - Choose a data type (**String**, **Boolean**, or **Int**).
   - **Description** - Optionally, enter a description of the custom attribute for internal use. This description is not visible to the user.

   ![Add an attribute](media/user-flow-add-custom-attributes/add-an-attribute.png)

7. Select **Create**.

The custom attribute is now available in the list of user attributes and for use in your user flows. A custom attribute is only created the first time it is used in any user flow, and not when you add it to the list of user attributes.

Once you've created a new user using a user flow that uses the newly created custom attribute, the object can be queried in [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer). You should now see **ShoeSize** in the list of attributes collected during the sign-up journey on the user object. You can call the Graph API from your application to get the data from this attribute after it is added to the user object.

## Next steps

[Add a self-service sign-up user flow to an app](self-service-sign-up-user-flow.md)
