---
title: Define custom attributes in Azure Active Directory B2C  
description: Define custom attributes for your application in Azure Active Directory B2C to collect information about your customers.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/09/2023
ms.custom: project-no-code
ms.author: kengaderdus
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Define custom attributes in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

In the [Add claims and customize user input using custom policies](configure-user-input.md) article, you learn how to use built-in [user profile attributes](user-profile-attributes.md). In this article, you enable a custom attribute in your Azure Active Directory B2C (Azure AD B2C) directory. Later, you can use the new attribute as a custom claim in [user flows](user-flow-overview.md) or [custom policies](user-flow-overview.md) simultaneously.

Your Azure AD B2C directory comes with a [built-in set of attributes](user-profile-attributes.md). However, you often need to create your own attributes to manage your specific scenario, for example when:

* A customer-facing application needs to persist a **loyaltyId** attribute.
* An identity provider has a unique user identifier, **uniqueUserGUID**, that must be persisted.
* A custom user journey needs to persist the state of the user, **migrationStatus**, for other logic to operate on.

The terms *extension property*, *custom attribute*, and *custom claim* refer to the same thing in the context of this article. The name varies depending on the context, such as application, object, or policy.

Azure AD B2C allows you to extend the set of attributes stored on each user account. You can also read and write these attributes by using the [Microsoft Graph API](microsoft-graph-operations.md#application-extension-directory-extension-properties).

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]

## Create a custom attribute

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
1. Make sure you're using the directory that contains your Azure AD B2C tenant:
    1. Select the **Directories + subscriptions** icon in the portal toolbar.
    1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the Directory name list, and then select **Switch**
1. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
1. Select **User attributes**, and then select **Add**.
1. Provide a **Name** for the custom attribute (for example, "ShoeSize")
1. Choose a **Data Type**. Only **String**, **Boolean**, and **Int** are available.
1. Optionally, enter a **Description** for informational purposes.
1. Select **Create**.

The custom attribute is now available in the list of **User attributes** and for use in your user flows. A custom attribute is only created the first time it's used in any user flow, and not when you add it to the list of **User attributes**.

::: zone pivot="b2c-user-flow"

## Use a custom attribute in your user flow

1. In your Azure AD B2C tenant, select **User flows**.
1. Select your policy (for example, "B2C_1_SignupSignin") to open it.
1. Select **User attributes** and then select the custom attribute (for example, "ShoeSize"). Select **Save**.
1. Select **Application claims** and then select the custom attribute.
1. Select **Save**.

Once you've created a new user using the user flow, you can use the [Run user flow](./tutorial-create-user-flows.md) feature on the user flow to verify the customer experience. You should now see **ShoeSize** in the list of attributes collected during the sign-up journey, and see it in the token sent back to your application.

::: zone-end

## Azure AD B2C extensions app

Extension attributes can only be registered on an application object, even though they might contain data for a user. The extension attribute is attached to the application called `b2c-extensions-app`. Don't modify this application, as it's used by Azure AD B2C for storing user data. You can find this application under Azure AD B2C, app registrations. 

::: zone pivot="b2c-user-flow"

### Get extensions app's application ID

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains your Azure AD B2C tenant; 
    1. Select the **Directories + subscriptions** icon in the portal toolbar.
    2. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **App registrations**, and then select **All applications**.
1. Select the `b2c-extensions-app. Do not modify. Used by AADB2C for storing user data.` application.
1. Copy the **Application ID**. Example: `11111111-1111-1111-1111-111111111111`.
 
::: zone-end

::: zone pivot="b2c-custom-policy"

### Get extensions app's application properties

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains your Azure AD B2C tenant: 
    1. Select the **Directories + subscriptions** icon in the portal toolbar.
    2. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **App registrations**, and then select **All applications**.
1. Select the **b2c-extensions-app. Do not modify. Used by AADB2C for storing user data.** application.
1. Copy the following identifiers to your clipboard and save them:
    * **Application ID**. Example: `11111111-1111-1111-1111-111111111111`.
    * **Object ID**. Example: `22222222-2222-2222-2222-222222222222`.

## Modify your custom policy

To enable custom attributes in your policy, provide **Application ID** and Application **Object ID** in the **AAD-Common** technical profile metadata. The **AAD-Common*** technical profile is found in the base [Microsoft Entra ID](active-directory-technical-profile.md) technical profile, and provides support for Microsoft Entra user management. Other Microsoft Entra technical profiles include **AAD-Common** to use its configuration. Override the **AAD-Common** technical profile in the extension file.

1. Open the extensions file of your policy. For example, <em>`SocialAndLocalAccounts/`**`TrustFrameworkExtensions.xml`**</em>.
1. Find the ClaimsProviders element. Add a new ClaimsProvider to the ClaimsProviders element.
1. Insert the **Application ID** that you previously recorded, between the opening `<Item Key="ClientId">` and closing `</Item>` elements.
1. Insert the **Application ObjectID** that you previously recorded, between the opening `<Item Key="ApplicationObjectId">` and closing `</Item>` elements.

    ```xml
    <!-- 
    <ClaimsProviders> -->
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
    <!-- 
    </ClaimsProviders> -->
    ```

## Upload your custom policy

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains your Azure B2C AD tenant:
    1.  Select the **Directories + subscriptions** icon in the portal toolbar.
    1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **App registrations**.
1. Select **Identity Experience Framework**.
1. Select **Upload Custom Policy**, and then upload the TrustFrameworkExtensions.xml policy files that you changed.

> [!NOTE]
> The first time the Microsoft Entra technical profile persists the claim to the directory, it checks whether the custom attribute exists. If it doesn't, it creates the custom attribute.  

## Create a custom attribute through Azure portal

The same extension attributes are shared between built-in and custom policies. When you add custom attributes via the portal experience, those attributes are registered by using the **b2c-extensions-app** that exists in every B2C tenant.

You can create these attributes by using the portal UI before or after you use them in your custom policies. When you create an attribute **loyaltyId** in the portal, you must refer to it as follows:

|Name     |Used in |
|---------|---------|
|`extension_loyaltyId` | Custom policy|
|`extension_<b2c-extensions-app-guid>_loyaltyId`  | [Microsoft Graph API](microsoft-graph-operations.md#application-extension-directory-extension-properties)|

> [!NOTE] 
> When using a custom attribute in custom policies, you must prefix the claim type ID with `extension_` to allow the correct data mapping to take place within the Azure AD B2C directory.

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

::: zone-end

## Manage extension attributes through Microsoft Graph

You can use Microsoft Graph to create and manage the custom attributes then set the values for a user. Extension attributes are also called directory or Microsoft Entra extensions.

Custom attributes (directory extensions) in the Microsoft Graph API are named by using the convention `extension_{appId-without-hyphens}_{extensionProperty-name}` where `{appId-without-hyphens}` is the stripped version of the **appId** (called Client ID on the Azure AD B2C portal) for the `b2c-extensions-app` with only characters 0-9 and A-Z. For example, if the **appId** of the `b2c-extensions-app` application is `25883231-668a-43a7-80b2-5685c3f874bc` and the attribute name is `loyaltyId`, then the custom attribute is named `extension_25883231668a43a780b25685c3f874bc_loyaltyId`.

Learn how to [manage extension attributes in your Azure AD B2C tenant](microsoft-graph-operations.md#application-extension-directory-extension-properties) using the Microsoft Graph API. 

## Remove extension attribute

Unlike built-in attributes, custom attributes can be removed. The extension attributes' values can also be removed. 

> [!Important]
> Before you remove the custom attribute, for each account in the directory, set the extension attribute value to `null`.  That way, you explicitly remove the extension attribute’s values. Then, continue to remove the extension attribute itself. Custom attributes can be queried using Microsoft Graph API. 

::: zone pivot="b2c-user-flow"

Use the following steps to remove a custom attribute from a user flow in your tenant:

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
2. Make sure you're using the directory that contains your Azure AD B2C tenant:
    1. Select the **Directories + subscriptions** icon in the portal toolbar.
    1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the Directory name list, and then select **Switch**
1. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
1. Select **User attributes**, and then select the attribute you want to delete.
1. Select **Delete**, and then select **Yes** to confirm.

::: zone-end

::: zone pivot="b2c-custom-policy"

Use the [Microsoft Graph API](microsoft-graph-operations.md#application-extension-directory-extension-properties) to manage the custom attributes.

::: zone-end

 


## Next steps

Learn how to [add claims and customize user input using custom policies](configure-user-input.md). This sample uses a built-in claim 'city'. To use a custom attribute, replace 'city' with your own custom attributes.


<!-- LINKS -->
[ms-graph]: /graph/
[ms-graph-api]: /graph/api/overview
