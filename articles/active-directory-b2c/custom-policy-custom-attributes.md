---
title: Add your own attributes to custom policies
titleSuffix: Azure AD B2C
description: A walkthrough on using extension properties and custom attributes and including them in the user interface.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 03/17/2020
ms.author: mimart
ms.subservice: B2C
---
# Azure Active Directory B2C: Enable custom attributes in a custom profile policy

In [add claims and customize user input using custom policies](custom-policy-configure-user-input.md) article you learn how to use build-in [user profile attributes](user-profile-attributes.md). In this article, you enable a custom attribute in your Azure Active Directory B2C (Azure AD B2C) directory. Later you can use the new attribute as a custom claim in any or your custom policies.

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

## Prerequisites

Follow the steps in the article [Azure Active Directory B2C: Get started with custom policies](custom-policy-get-started.md).

## Use custom attributes to collect information about your customers 

Your Azure AD B2C directory comes with a [built-in set of attributes](user-profile-attributes.md). You often need to create your own attributes like these examples:

* A customer-facing application needs to persist for an attribute like **LoyaltyId**.
* An identity provider has a unique user identifier like **uniqueUserGUID** that must be saved.
* A custom user journey needs to persist for a state of a user like **migrationStatus**.

Azure AD B2C extends the set of attributes stored on each user account. You can also read and write these attributes by using the [Microsoft Graph API](manage-user-accounts-graph-api.md).

## Azure AD B2C extensions app

Extension properties extend the schema of the user objects in the directory. The terms *extension property*, *custom attribute*, and *custom claim* refer to the same thing in the context of this article. The name varies depending on the context, such as application, object, or policy.

Azure AD B2C extends the set of attributes stored on each user account. Extension attributes [extend the schema](https://docs.microsoft.com/graph/extensibility-overview#schema-extensions) of the user objects in the directory. The extension attributes can only be registered on an application object, even though they might contain data for a user. The extension attribute is attached to the application called b2c-extensions-app. Do not modify this application, as it's used by Azure AD B2C for storing user data. You can find this application under Azure Active Directory App registrations.

## Get the application properties

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **App registrations (Preview)**, and then select **All Applications**.
1. Select the `b2c-extensions-app. Do not modify. Used by AADB2C for storing user data.` application.
1. Copy the following identifiers to your clipboard and save them:
    * **Application ID**. Example: `11111111-1111-1111-1111-111111111111`.
    * **Object ID**. Example: `22222222-2222-2222-2222-222222222222`.

## Modify your custom policy

To enable custom attributes in your policy, provide **Application ID** and Application **Object ID** to the *AAD-Common* technical profile. The *AAD-Common* is the base [Azure Active Directory](active-directory-technical-profile.md) technical profile provides support for the Azure AD user management. Other Azure AD technical profiles indlue the *AAD-Common*.

1. Open the extensions file of your policy. For example, <em>`SocialAndLocalAccounts/`**`TrustFrameworkExtensions.xml`**</em>.
1. Override the **AAD-Common** technical profile in the extension file. Add the `Metadata` section as shown in the following example as follows:
1. Insert the object ID that you previously recorded for the `ApplicationObjectId` value and the application ID that you recorded for the `ClientId` value:

    ```xml
    <ClaimsProviders>
      <ClaimsProvider>
        <DisplayName>Azure Active Directory</DisplayName>
        <TechnicalProfile Id="AAD-Common">
          <Metadata>
            <!--Insert application ID here, for example: 11111111-1111-1111-1111-111111111111-->  
            <Item Key="ClientId"></Item>
            <!--Insert application ObjectId here, for example: 22222222-2222-2222-2222-222222222222--> 
            <Item Key="ApplicationObjectId">/Item>
          </Metadata>
        </TechnicalProfile>
      </ClaimsProvider>
    </ClaimsProviders>
    ```

## Upload your custom policy

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains your Azure AD tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your Azure AD tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **App registrations**.
4. Select **Identity Experience Framework**.
5. Select **Upload Custom Policy**, and then upload the TrustFrameworkExtensions.xml policy files that you changed.

> [!NOTE]
> When the **TechnicalProfile** writes for the first time to the newly created extension property, you might experience a one-time error. The extension property is created the first time it's used.

## Create a custom attribute

The same extension attributes are shared between built-in and custom policies. When you add custom attributes via the portal experience, those attributes are registered by using the **b2c-extensions-app** that exists in every B2C tenant.

Create these attributes by using the portal UI before you use them in your custom policies. Follow the guidance how to [define custom attributes in Azure Active Directory B2C](user-flow-custom-attributes.md) When you create an attribute **loyaltyId** in the portal, you must refer to it as follows:

   ```
   extension_loyaltyId in the custom policy.
   extension_<app-guid>_loyaltyId via Graph API.
   ```

The following example demonstrates the use of custom attribute in Azure AD B2C custom policy.

```xml
<BuildingBlocks>
  <ClaimsSchema>
    <ClaimType Id="extension_loyaltyId">
      <DisplayName>Loyalty Identification</DisplayName>
      <DataType>string</DataType>
      <UserHelpText>Your loyalty number from your membership card</UserHelpText>
      <UserInputType>TextBox</UserInputType>
    </ClaimType>
  </ClaimsSchema>
</BuildingBlocks>
```

## Use a custom attribute in a policy

Follow the guidance how to [add claims and customize user input using custom policies](custom-policy-configure-user-input.md). This sample uses a built-in claim 'city'. To use custom attribute, replace the 'city' with your own custom attributes. 


## Next steps

Learn more about:

- [Azure AD B2C user profile attributes](user-profile-attributes.md)
- [Extension attributes definition](user-profile-attributes#extension-attributes.md)
- [Manage Azure AD B2C user accounts with Microsoft Graph](manage-user-accounts-graph-api.md)
