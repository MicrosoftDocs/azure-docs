---
title: Add custom attributes to self-service sign-up flows - CIAM
description: Learn about customizing the attributes for your self-service sign-up user flows in your CIAM tenant. 
services: active-directory
author: csmulligan
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: conceptual
ms.date: 03/08/2023
ms.author: cmulligan
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to know how can I customize the attributes for the self-service sign-up user flows to gather the necessary information from my customers.
---
<!--   The content is mostly copied from https://learn.microsoft.com/en-us/azure/active-directory/external-identities/user-flow-add-custom-attributes and some are details added to it from articles in this branch. For now the text  is used as a placeholder in the release branch, until further notice. -->

# Define custom attributes for user flows

For each application, you might have different requirements for the information you want to collect during sign-up from your customers. Azure AD comes with a built-in set of information stored in attributes, such as Given Name, Surname, City, and Postal Code. With CIAM, you can extend the set of attributes stored on a guest account when the cusrokomer signs up through a user flow.

You can create custom attributes in the Azure portal and use them in your self-service sign-up user flows. You can also read and write these attributes by using the Microsoft Graph API. Microsoft Graph API supports creating and updating a user with extension attributes. Extension attributes in the Graph API are named by using the convention `extension_<extensions-app-id>_attributename`. For example:

```JSON
"extension_831374b3bd5041bfaa54263ec9e050fc_loyaltyNumber": "212342"
```

The `<extensions-app-id>` is specific to your tenant. To find this identifier, navigate to **Azure Active Directory** > **App registrations** > **All applications**. Search for the app that starts with "aad-extensions-app" and select it. On the app's Overview page, note the Application (client) ID.

Once you've created a new user using a user flow that uses the newly created custom attribute, the object can be queried in [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer). You should now see new name in the list of attributes collected during the sign-up journey on the user object. You can call the Graph API from your application to get the data from this attribute after it's added to the user object.

## Next steps
- [Customizing the sign-in look and feel](concept-branding-customers.md)
