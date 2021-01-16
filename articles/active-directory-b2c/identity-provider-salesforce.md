---
title: Set up sign-up and sign-in with a Salesforce account
titleSuffix: Azure AD B2C
description: Provide sign-up and sign-in to customers with Salesforce accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 01/05/2021
ms.custom: project-no-code
ms.author: mimart
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Set up sign-up and sign-in with a Salesforce account using Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

::: zone pivot="b2c-custom-policy"

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

::: zone-end

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]


## Create a Salesforce application

To use a Salesforce account in Azure Active Directory B2C (Azure AD B2C), you need to create an application in your Salesforce **App Manager**. For more information, see [Configure Basic Connected App Settings](https://help.salesforce.com/articleView?id=connected_app_create_basics.htm), and [Enable OAuth Settings for API Integration](https://help.salesforce.com/articleView?id=connected_app_create_api_integration.htm)

1. [Sign in to Salesforce](https://login.salesforce.com/).
1. From the menu, select **Setup**.
1.  Expand **Apps**, and then select **App Manager**.
1. Select **New Connected App**.
1. Under the **Basic Information**, enter:
    1. **Connected App Name** - The connected app name is displayed in the App Manager and on its App Launcher tile. The name must be unique within your org. 
    1. **API Name** 
    1. **Contact Email** - The contact email for Salesforce
1. Under **API (Enable OAuth Settings)**, select **Enable OAuth Settings**
    1. In **Callback URL**, enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp`. Replace `your-tenant-name` with the name of your tenant. You need to use all lowercase letters when entering your tenant name even if the tenant is defined with uppercase letters in Azure AD B2C.
    1. In the **Selected OAuth Scopes**, select **Access your basic information (id, profile, email, address, phone)**, and **Allow access to your unique identifier (openid)**.
    1. Select **Require Secret for Web Server Flow**.
1. Select **Configure ID Token** 
    1. Set the **Token Valid for** 5 minutes.
    1. Select **Include Standard Claims**.
1. Click **Save**.
1. Copy the values of **Consumer Key** and **Consumer Secret**. You will need both of them to configure Salesforce as an identity provider in your tenant. **Client secret** is an important security credential.

::: zone pivot="b2c-user-flow"

## Configure a Salesforce account as an identity provider

1. Make sure you're using the directory that contains Azure AD B2C tenant. Select the **Directory + subscription** filter in the top menu and choose the directory that contains your Azure AD B2C tenant.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Select **Identity providers**, and then select **New OpenID Connect provider**.
1. Enter a **Name**. For example, enter *Salesforce*.
1. For **Metadata url**, enter the URL of the [Salesforce OpenID Connect Configuration document](https://help.salesforce.com/articleView?id=remoteaccess_using_openid_discovery_endpoint.htm). For a sandbox, login.salesforce.com is replaced with test.salesforce.com. For a community, login.salesforce.com is replaced with the community URL, such as username.force.com/.well-known/openid-configuration. The URL must be HTTPS.

    ```
    https://login.salesforce.com/.well-known/openid-configuration
    ```

1. For **Client ID**, enter the application ID that you previously recorded.
1. For **Client secret**, enter the client secret that you previously recorded.
1. For the **Scope**, enter the `openid id profile email`.
1. Leave the default values for **Response type**, and **Response mode**.
1. (Optional) For the **Domain hint**, enter `contoso.com`. For more information, see [Set up direct sign-in using Azure Active Directory B2C](direct-signin.md#redirect-sign-in-to-a-social-provider).
1. Under **Identity provider claims mapping**, select the following claims:

    - **User ID**: *sub*
    - **Display name**: *name*
    - **Given name**: *given_name*
    - **Surname**: *family_name*
    - **Email**: *email*

1. Select **Save**.
::: zone-end

::: zone pivot="b2c-custom-policy"

## Create a policy key

You need to store the client secret that you previously recorded in your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directory + subscription** filter in the top menu and choose the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
4. On the Overview page, select **Identity Experience Framework**.
5. Select **Policy Keys** and then select **Add**.
6. For **Options**, choose `Manual`.
7. Enter a **Name** for the policy key. For example, `SalesforceSecret`. The prefix `B2C_1A_` is added automatically to the name of your key.
8. In **Secret**, enter your client secret that you previously recorded.
9. For **Key usage**, select `Signature`.
10. Click **Create**.

## Add a claims provider

If you want users to sign in by using a Salesforce account, you need to define the account as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated.

You can define a Salesforce account as a claims provider by adding it to the **ClaimsProviders** element in the extension file of your policy.

1. Open the *TrustFrameworkExtensions.xml*.
2. Find the **ClaimsProviders** element. If it does not exist, add it under the root element.
3. Add a new **ClaimsProvider** as follows:

    ```xml
    <ClaimsProvider>
      <Domain>salesforce.com</Domain>
      <DisplayName>Salesforce</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="Salesforce-OIDC">
          <DisplayName>Salesforce</DisplayName>
          <Protocol Name="OpenIdConnect" />
          <Metadata>
            <Item Key="METADATA">https://login.salesforce.com/.well-known/openid-configuration</Item>
            <Item Key="response_types">code</Item>
            <Item Key="response_mode">form_post</Item>
            <Item Key="scope">openid id profile email</Item>
            <Item Key="HttpBinding">POST</Item>
            <Item Key="UsePolicyInRedirectUri">0</Item>
            <!-- Update the Client ID below to the Application ID -->
            <Item Key="client_id">Your Salesforce application ID</Item>
          </Metadata>
          <CryptographicKeys>
            <Key Id="client_secret" StorageReferenceId="B2C_1A_SalesforceSecret"/>
          </CryptographicKeys>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="sub" />
            <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="given_name" />
            <OutputClaim ClaimTypeReferenceId="surname" PartnerClaimType="family_name" />
            <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name" />
            <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="email" />
            <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="salesforce.com" AlwaysUseDefaultValue="true" />
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" AlwaysUseDefaultValue="true" />
          </OutputClaims>
          <OutputClaimsTransformations>
            <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName" />
            <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName" />
            <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId" />
          </OutputClaimsTransformations>
          <UseTechnicalProfileForSessionManagement ReferenceId="SM-SocialLogin" />
        </TechnicalProfile>
      </TechnicalProfiles>
    </ClaimsProvider>
    ```

4. The **METADATA** is set to the URL of the [Salesforce OpenID Connect Configuration document](https://help.salesforce.com/articleView?id=remoteaccess_using_openid_discovery_endpoint.htm). For a sandbox, login.salesforce.com is replaced with test.salesforce.com. For a community, login.salesforce.com is replaced with the community URL, such as username.force.com/.well-known/openid-configuration. The URL must be HTTPS.
5. Set **client_id** to the application ID from the application registration.
6. Save the file.

### Upload the extension file for verification

By now, you have configured your policy so that Azure AD B2C knows how to communicate with your Salesforce account. Try uploading the extension file of your policy just to confirm that it doesn't have any issues so far.

1. On the **Custom Policies** page in your Azure AD B2C tenant, select **Upload Policy**.
2. Enable **Overwrite the policy if it exists**, and then browse to and select the *TrustFrameworkExtensions.xml* file.
3. Click **Upload**.

## Register the claims provider

At this point, the identity provider has been set up, but it’s not available in any of the sign-up/sign-in screens. To make it available, you create a duplicate of an existing template user journey, and then modify it so that it also has the Salesforce identity provider.

1. Open the *TrustFrameworkBase.xml* file from the starter pack.
2. Find and copy the entire contents of the **UserJourney** element that includes `Id="SignUpOrSignIn"`.
3. Open the *TrustFrameworkExtensions.xml* and find the **UserJourneys** element. If the element doesn't exist, add one.
4. Paste the entire content of the **UserJourney** element that you copied as a child of the **UserJourneys** element.
5. Rename the ID of the user journey. For example, `SignUpSignInSalesforce`.

### Display the button

The **ClaimsProviderSelection** element is analogous to an identity provider button on a sign-up/sign-in screen. If you add a **ClaimsProviderSelection** element for a Salesforce account, a new button shows up when a user lands on the page.

1. Find the **OrchestrationStep** element that includes `Order="1"` in the user journey that you created.
2. Under **ClaimsProviderSelects**, add the following element. Set the value of **TargetClaimsExchangeId** to an appropriate value, for example `SalesforceExchange`:

    ```xml
    <ClaimsProviderSelection TargetClaimsExchangeId="SalesforceExchange" />
    ```

### Link the button to an action

Now that you have a button in place, you need to link it to an action. The action, in this case, is for Azure AD B2C to communicate with a Salesforce account to receive a token.

1. Find the **OrchestrationStep** that includes `Order="2"` in the user journey.
2. Add the following **ClaimsExchange** element making sure that you use the same value for ID that you used for **TargetClaimsExchangeId**:

    ```xml
    <ClaimsExchange Id="SalesforceExchange" TechnicalProfileReferenceId="Salesforce-OIDC" />
    ```

    Update the value of **TechnicalProfileReferenceId** to the ID of the technical profile you created earlier. For example, `Salesforce-OIDC`.

3. Save the *TrustFrameworkExtensions.xml* file and upload it again for verification.

::: zone-end

::: zone pivot="b2c-user-flow"

## Add Salesforce identity provider to a user flow 

1. In your Azure AD B2C tenant, select **User flows**.
1. Click the user flow that you want to the Salesforce identity provider.
1. Under the **Social identity providers**, select **Salesforce**.
1. Select **Save**.
1. To test your policy, select **Run user flow**.
1. For **Application**, select the web application named *testapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Click **Run user flow**

::: zone-end

::: zone pivot="b2c-custom-policy"

## Update and test the relying party file

Update the relying party (RP) file that initiates the user journey that you created.

1. Make a copy of *SignUpOrSignIn.xml* in your working directory, and rename it. For example, rename it to *SignUpSignInSalesforce.xml*.
1. Open the new file and update the value of the **PolicyId** attribute for **TrustFrameworkPolicy** with a unique value. For example, `SignUpSignInSalesforce`.
1. Update the value of **PublicPolicyUri** with the URI for the policy. For example,`http://contoso.com/B2C_1A_signup_signin_Salesforce`
1. Update the value of the **ReferenceId** attribute in **DefaultUserJourney** to match the ID of the new user journey that you created (SignUpSignSalesforce).
1. Save your changes, upload the file.
1. Under **Custom policies**, select **B2C_1A_signup_signin**.
1. For **Select Application**, select the web application named *testapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Select **Run now** and select Salesforce to sign in with Salesforce and test the custom policy.

::: zone-end

## Next steps

Learn how to [pass Salesforce token to your application](idp-pass-through-user-flow.md).
