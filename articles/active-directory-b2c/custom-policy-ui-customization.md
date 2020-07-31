---
title: Customize the user interface of your app with a custom policy
titleSuffix: Azure AD B2C
description: Learn about customizing a user interface using a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/16/2020
ms.author: mimart
ms.subservice: B2C
---
# Customize the user interface of your application using a custom policy in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

By completing the steps in this article, you create a sign-up and sign-in custom policy with your brand and appearance. With Azure Active Directory B2C (Azure AD B2C), you get nearly full control of the HTML and CSS content that's presented to users. When you use a custom policy, you configure UI customization in XML instead of using controls in the Azure portal.

## Prerequisites

Complete the steps in [Get started with custom policies](custom-policy-get-started.md). You should have a working custom policy for sign-up and sign-in with local accounts.

[!INCLUDE [active-directory-b2c-html-how-to](../../includes/active-directory-b2c-html-how-to.md)]

### 4. Modify the extensions file

To configure UI customization, copy the **ContentDefinition** and its child elements from the base file to the extensions file.

1. Open the base file of your policy. For example, <em>`SocialAndLocalAccounts/`**`TrustFrameworkBase.xml`**</em>. This base file is one of the policy files included in the custom policy starter pack, which you should have obtained in the prerequisite, [Get started with custom policies](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-get-started-custom).
1. Search for and copy the entire contents of the **ContentDefinitions** element.
1. Open the extension file. For example, *TrustFrameworkExtensions.xml*. Search for the **BuildingBlocks** element. If the element doesn't exist, add it.
1. Paste the entire contents of the **ContentDefinitions** element that you copied as a child of the **BuildingBlocks** element.
1. Search for the **ContentDefinition** element that contains `Id="api.signuporsignin"` in the XML that you copied.
1. Change the value of **LoadUri** to the URL of the HTML file that you uploaded to storage. For example, `https://your-storage-account.blob.core.windows.net/your-container/customize-ui.html`.

    Your custom policy should look like the following code snippet:

    ```xml
    <BuildingBlocks>
      <ContentDefinitions>
        <ContentDefinition Id="api.signuporsignin">
          <LoadUri>https://your-storage-account.blob.core.windows.net/your-container/customize-ui.html</LoadUri>
          <RecoveryUri>~/common/default_page_error.html</RecoveryUri>
          <DataUri>urn:com:microsoft:aad:b2c:elements:unifiedssp:1.0.0</DataUri>
          <Metadata>
            <Item Key="DisplayName">Signin and Signup</Item>
          </Metadata>
        </ContentDefinition>
      </ContentDefinitions>
    </BuildingBlocks>
    ```

1. Save the extensions file.

### 5. Upload and test your updated custom policy

#### 5.1 Upload the custom policy

1. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
1. Search for and select **Azure AD B2C**.
1. Under **Policies**, select **Identity Experience Framework**.
1. Select **Upload custom policy**.
1. Upload the extensions file that you previously changed.

#### 5.2 Test the custom policy by using **Run now**

1. Select the policy that you uploaded, and then select **Run now**.
1. You should be able to sign up by using an email address.

[!INCLUDE [active-directory-b2c-html-templates](../../includes/active-directory-b2c-html-templates.md)]

## Configure dynamic custom page content URI

By using Azure AD B2C custom policies, you can send a parameter in the URL path, or a query string. By passing the parameter to your HTML endpoint, you can dynamically change the page content. For example, you can change the background image on the Azure AD B2C sign-up or sign-in page, based on a parameter that you pass from your web or mobile application. The parameter can be any [claim resolver](claim-resolver-overview.md), such as the application ID, language ID, or custom query string parameter, such as `campaignId`.

### Sending query string parameters

To send query string parameters, in the [relying party policy](relyingparty.md), add a `ContentDefinitionParameters` element as shown below.

```xml
<RelyingParty>
    <DefaultUserJourney ReferenceId="SignUpOrSignIn" />
    <UserJourneyBehaviors>
    <ContentDefinitionParameters>
        <Parameter Name="campaignId">{OAUTH-KV:campaignId}</Parameter>
        <Parameter Name="lang">{Culture:LanguageName}</Parameter>
        <Parameter Name="appId">{OIDC:ClientId}</Parameter>
    </ContentDefinitionParameters>
    </UserJourneyBehaviors>
    ...
</RelyingParty>
```

In your content definition, change the value of `LoadUri` to `https://<app_name>.azurewebsites.net/home/unified`. Your custom policy `ContentDefinition` should look like the following code snippet:

```xml
<ContentDefinition Id="api.signuporsignin">
  <LoadUri>https://<app_name>.azurewebsites.net/home/unified</LoadUri>
  ...
</ContentDefinition>
```

When Azure AD B2C loads the page, it makes a call to your web server endpoint:

```http
https://<app_name>.azurewebsites.net/home/unified?campaignId=123&lang=fr&appId=f893d6d3-3b6d-480d-a330-1707bf80ebea
```

### Dynamic page content URI

Content can be pulled from different places based on the parameters used. In your CORS-enabled endpoint, set up a folder structure to host content. For example, you can organize the content in following structure. Root *folder/folder per language/your html files*. For example, your custom page URI might look like:

```xml
<ContentDefinition Id="api.signuporsignin">
  <LoadUri>https://contoso.blob.core.windows.net/{Culture:LanguageName}/myHTML/unified.html</LoadUri>
  ...
</ContentDefinition>
```

Azure AD B2C sends the  two letter ISO code for the language, `fr` for French:

```http
https://contoso.blob.core.windows.net/fr/myHTML/unified.html
```

## Next steps

For more information about UI elements that can be customized, see [reference guide for UI customization for user flows](customize-ui-overview.md).
