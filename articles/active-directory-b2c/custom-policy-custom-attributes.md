---
title: Add your own attributes to custom policies
titleSuffix: Azure AD B2C
description: A walkthrough on using extension properties and custom attributes and including them in the user interface.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/17/2020
ms.author: mimart
ms.subservice: B2C
---
# Azure Active Directory B2C: Enable custom attributes in a custom profile policy

In the [Add claims and customize user input using custom policies](custom-policy-configure-user-input.md) article you learn how to use built-in [user profile attributes](user-profile-attributes.md). In this article, you enable a custom attribute in your Azure Active Directory B2C (Azure AD B2C) directory. Later, you can use the new attribute as a custom claim in [user flows](user-flow-overview.md) or [custom policies](custom-policy-get-started.md) simultaneously.

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

## Prerequisites

Follow the steps in the article [Azure Active Directory B2C: Get started with custom policies](custom-policy-get-started.md).

## Use custom attributes to collect information about your customers 

Your Azure AD B2C directory comes with a [built-in set of attributes](user-profile-attributes.md). However, you often need to create your own attributes to manage your specific scenario, for example when:

* A customer-facing application needs to persist a **LoyaltyId** attribute.
* An identity provider has a unique user identifier, **uniqueUserGUID**, that must be persisted.
* A custom user journey needs to persist the state of the user, **migrationStatus**, for other logic to operate on.

Azure AD B2C allows you to extend the set of attributes stored on each user account. You can also read and write these attributes by using the [Microsoft Graph API](manage-user-accounts-graph-api.md).

## Azure AD B2C extensions app

Extension attributes can only be registered on an application object, even though they might contain data for a user. The extension attribute is attached to the application called b2c-extensions-app. Do not modify this application, as it's used by Azure AD B2C for storing user data. You can find this application under Azure AD B2C, app registrations.

The terms *extension property*, *custom attribute*, and *custom claim* refer to the same thing in the context of this article. The name varies depending on the context, such as application, object, or policy.

## Get the application properties

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **App registrations**, and then select **All applications**.
1. Select the `b2c-extensions-app. Do not modify. Used by AADB2C for storing user data.` application.
1. Copy the following identifiers to your clipboard and save them:
    * **Application ID**. Example: `11111111-1111-1111-1111-111111111111`.
    * **Object ID**. Example: `22222222-2222-2222-2222-222222222222`.

## Modify your custom policy

To enable custom attributes in your policy, provide **Application ID** and Application **Object ID** in the AAD-Common technical profile metadata. The *AAD-Common* technical profile is found in the base [Azure Active Directory](active-directory-technical-profile.md) technical profile, and provides support for Azure AD user management. Other Azure AD technical profiles include the AAD-Common to leverage its configuration. Override the AAD-Common technical profile in the extension file.

1. Open the extensions file of your policy. For example, <em>`SocialAndLocalAccounts/`**`TrustFrameworkExtensions.xml`**</em>.
1. Find the ClaimsProviders element. Add a new ClaimsProvider to the ClaimsProviders element.
1. Replace `ApplicationObjectId` with the Object ID that you previously recorded. Then replace `ClientId` with the Application ID that you previously recorded in the below snippet.

    ```xml
    <ClaimsProvider>
      <DisplayName>Azure Active Directory</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="AAD-Common">
          <Metadata>
            <!--Insert b2c-extensions-app application ID here, for example: 11111111-1111-1111-1111-111111111111-->  
            <Item Key="ClientId"></Item>
            <!--Insert b2c-extensions-app application ObjectId here, for example: 22222222-2222-2222-2222-222222222222-->
            <Item Key="ApplicationObjectId"></Item>
          </Metadata>
        </TechnicalProfile>
      </TechnicalProfiles> 
    </ClaimsProvider>
    ```

## Upload your custom policy

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains your Azure AD tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your Azure AD B2C tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **App registrations**.
4. Select **Identity Experience Framework**.
5. Select **Upload Custom Policy**, and then upload the TrustFrameworkExtensions.xml policy files that you changed.

> [!NOTE]
> The first time the Azure AD technical profile persists the claim to the directory, it checks whether the custom attribute exists. If not, it creates the custom attribute.  

## Create a custom attribute through Azure portal

The same extension attributes are shared between built-in and custom policies. When you add custom attributes via the portal experience, those attributes are registered by using the **b2c-extensions-app** that exists in every B2C tenant.

You can create these attributes by using the portal UI before or after you use them in your custom policies. Follow the guidance for how to [define custom attributes in Azure Active Directory B2C](user-flow-custom-attributes.md). When you create an attribute **loyaltyId** in the portal, you must refer to it as follows:

|Name     |Used in |
|---------|---------|
|`extension_loyaltyId`  | Custom policy|
|`extension_<b2c-extensions-app-guid>_loyaltyId`  | [Microsoft Graph API](manage-user-accounts-graph-api.md)|

The following example demonstrates the use of custom attributes in an Azure AD B2C custom policy claim definition.

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

The following example demonstrates the use of a custom attribute in Azure AD B2C custom policy in a technical profile, input, output, and persisted claims.

```xml
<InputClaims>
  <InputClaim ClaimTypeReferenceId="extension_loyaltyId"  />
</InputClaims>
<PersistedClaims>
  <PersistedClaim ClaimTypeReferenceId="extension_loyaltyId" />
</PersistedClaims>
<OutputClaims>
  <OutputClaim ClaimTypeReferenceId="extension_loyaltyId" />
</OutputClaims>
```

## Use a custom attribute in a policy

Follow the guidance for how to [add claims and customize user input using custom policies](custom-policy-configure-user-input.md). This sample uses a built-in claim 'city'. To use a custom attribute, replace 'city' with your own custom attributes.


## Next steps

Learn more about:

- [Azure AD B2C user profile attributes](user-profile-attributes.md)
- [Extension attributes definition](user-profile-attributes.md#extension-attributes)
- [Manage Azure AD B2C user accounts with Microsoft Graph](manage-user-accounts-graph-api.md)
