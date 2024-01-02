---
title: Set sign-in with SAML identity provider options
titleSuffix: Azure Active Directory B2C
description: Configure sign-in SAML identity provider (IdP) options in Azure Active Directory B2C.

author: garrodonnell
manager: CelesteDG

ms.service: active-directory

ms.topic: how-to
ms.date: 03/20/2023
ms.custom: 
ms.author: godonnell
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---


# Configure SAML identity provider options with Azure Active Directory B2C

Azure Active Directory B2C (Azure AD B2C) supports federation with SAML 2.0 identity providers. This article describes how to parse the security assertions, and the configuration options that are available when enabling sign-in with a SAML identity provider.


[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

::: zone pivot="b2c-user-flow"

[!INCLUDE [active-directory-b2c-limited-to-custom-policy](../../includes/active-directory-b2c-limited-to-custom-policy.md)]

::: zone-end

::: zone pivot="b2c-custom-policy"


## Claims mapping

The **OutputClaims** element contains a list of claims returned by the SAML identity provider. You need to map the name of the claim defined in your policy to the name defined in the identity provider. Check your identity provider for the list of  claims (assertions). You can also check the content of the SAML response your identity provider returns. For more information, see [Debug the SAML messages](#debug-saml-protocol). To add a claim, first [define a claim](claimsschema.md), then add the claim to the output claims collection.

You can also include claims that not return by the identity provider, as long as you set the `DefaultValue` attribute. The default value can be static or dynamic, using [context claims](#enable-use-of-context-claims).

The output claim element contains the following attributes:

- **ClaimTypeReferenceId** is the reference to a claim type. 
- **PartnerClaimType** is the name of the property that appears SAML assertion. 
- **DefaultValue** is a predefined default value. If the claim is empty, the default value is used. You can also use a [claim resolvers](claim-resolver-overview.md) with a contextual value, such as the correlation ID, or the user IP address.

### Subject name

To read the SAML assertion **NameId** in the **Subject** as a normalized claim, set the claim **PartnerClaimType** to the value of the `SPNameQualifier` attribute. If the `SPNameQualifier`attribute isn't presented, set the claim **PartnerClaimType** to value of the `NameQualifier` attribute.

SAML assertion:

```xml
<saml:Subject>
  <saml:NameID SPNameQualifier="http://your-idp.com/unique-identifier" Format="urn:oasis:names:tc:SAML:2.0:nameid-format:transient">david@contoso.com</saml:NameID>
  <SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
    <SubjectConfirmationData InResponseTo="_cd37c3f2-6875-4308-a9db-ce2cf187f4d1" NotOnOrAfter="2020-02-15T16:23:23.137Z" Recipient="https://<your-tenant>.b2clogin.com/<your-tenant>.onmicrosoft.com/B2C_1A_TrustFrameworkBase/samlp/sso/assertionconsumer" />
    </SubjectConfirmation>
  </saml:SubjectConfirmation>
</saml:Subject>
```

Output claim:

```xml
<OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="http://your-idp.com/unique-identifier" />
```

If both `SPNameQualifier` or `NameQualifier` attributes aren't presented in the SAML assertion, set the claim **PartnerClaimType** to `assertionSubjectName`. Make sure the **NameId** is the first value in assertion XML. When you define more than one assertion, Azure AD B2C picks the subject value from the last assertion.


## Configure SAML protocol bindings

The SAML requests are sent to the identity provider as specified in the identity provider's metadata `SingleSignOnService` element. Most of the identity providers' authorization requests are carried directly in the URL query string of an HTTP GET request (as the messages are relatively short). Refer to your identity provider documentation for how to configure the bindings for both SAML requests.

The following XML is an example of a Microsoft Entra metadata single sign-on service with two bindings. The `HTTP-Redirect` takes precedence over the `HTTP-POST` because it appears first in the SAML identity provider metadata.

```xml
<IDPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
  ...
  <SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://login.microsoftonline.com/00000000-0000-0000-0000-000000000000/saml2"/>
  <SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://login.microsoftonline.com/00000000-0000-0000-0000-000000000000/saml2"/>
</IDPSSODescriptor>
```

### Assertion consumer service

The Assertion Consumer Service (or ACS) is where the identity provider SAML responses are sent and received by Azure AD B2C. SAML responses are transmitted to Azure AD B2C via HTTP POST binding. The ACS location points to your relying party's base policy. For example, if the relying policy is *B2C_1A_signup_signin*, the ACS is the base policy of the *B2C_1A_signup_signin*, such as *B2C_1A_TrustFrameworkBase*.

The following XML is an example of an Azure AD B2C policy metadata assertion consumer service element. 

```xml
<SPSSODescriptor AuthnRequestsSigned="true" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
  ...
  <AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://your-tenant.b2clogin.com/your-tenant/B2C_1A_TrustFrameworkBase/samlp/sso/assertionconsumer" index="0" isDefault="true"/>
</SPSSODescriptor>
```

## Configure the SAML request signature

Azure AD B2C signs all outgoing authentication requests using the **SamlMessageSigning** cryptographic key. To disable the SAML request signature, set the **WantsSignedRequests** to `false`. If the metadata is set to `false`, the **SigAlg** and **Signature** parameters (query string or post parameter) are omitted from the request.

This metadata also controls the **AuthnRequestsSigned** attribute, which is included with the metadata of the Azure AD B2C technical profile that is shared with the identity provider. Azure AD B2C doesn't sign the request if the value of **WantsSignedRequests** in the technical profile metadata is set to `false` and the identity provider metadata **WantAuthnRequestsSigned** is set to `false` or not specified.

The following example removes the signature from the SAML request.

```xml
<Metadata>
  ...
  <Item Key="WantsSignedRequests">false</Item>
</Metadata>
```

### Signature algorithm

Azure AD B2C uses `Sha1` to sign the SAML request. Use the **XmlSignatureAlgorithm** metadata to configure the algorithm to be used. Possible values are `Sha256`, `Sha384`, `Sha512`, or `Sha1` (default). This metadata controls the value of the  **SigAlg** parameter (query string or post parameter) in the SAML request. Make sure you configure the signature algorithm on both sides with same value. Use only the algorithm that your certificate supports.

### Include key info

When the identity provider indicates that Azure AD B2C binding is set to `HTTP-POST`, Azure AD B2C includes the signature and the algorithm in the body of the SAML request. You can also configure Microsoft Entra ID to include the public key of the certificate when the binding is set to `HTTP-POST`. Use the **IncludeKeyInfo** metadata to `true`, or `false`. In the following example, Microsoft Entra ID doesn't include the public key of the certificate.

```xml
<Metadata>
  ...
  <Item Key="IncludeKeyInfo">false</Item>
</Metadata>
```

## Configure SAML request name ID

The SAML authorization request `<NameID>` element indicates the SAML name identifier format. This section describes the default configuration and how to customize the name ID element.

## Preferred username

During a sign-in user journey, a relying party application may target a specific user. Azure AD B2C allows you to send a preferred username to the SAML identity provider. The **InputClaims** element is used to send a **NameId** within the **Subject** of the SAML authorization request.

To include the subject name ID within the authorization request, add the following `<InputClaims>` element immediately after the `<CryptographicKeys>`. The **PartnerClaimType** must be set to `subject`.

```xml
<InputClaims>
  <InputClaim ClaimTypeReferenceId="signInName" PartnerClaimType="subject" />
</InputClaims>
```

In this example, Azure AD B2C sends the value of the **signInName** claim with **NameId** within the **Subject** of the SAML authorization request.

```xml
<samlp:AuthnRequest ... >
  ...
  <saml:Subject>
    <saml:NameID>sam@contoso.com</saml:NameID>
  </saml:Subject>
</samlp:AuthnRequest>
```

You can use [context claims](claim-resolver-overview.md), such as `{OIDC:LoginHint}` to populate the claim value.

```xml
<Metadata>
  ...
  <Item Key="IncludeClaimResolvingInClaimsHandling">true</Item>
</Metadata>
  ...
<InputClaims>
  <InputClaim ClaimTypeReferenceId="signInName" PartnerClaimType="subject" DefaultValue="{OIDC:LoginHint}" AlwaysUseDefaultValue="true" />
</InputClaims>
```

### Name ID policy format

By default, the SAML authorization request specifies the `urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified` policy. This name ID indicates that any type of identifier supported by the identity provider for the requested subject can be used.

To change this behavior, refer to your identity provider’s documentation for guidance about which name ID policies are supported. Then add the `NameIdPolicyFormat` metadata in the corresponding policy format. For example:

```xml
<Metadata>
  ...
  <Item Key="NameIdPolicyFormat">urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</Item>
</Metadata>
```

The following SAML authorization request contains the name ID policy.

```xml
<samlp:AuthnRequest ... >
  ...
  <samlp:NameIDPolicy Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress" />
</samlp:AuthnRequest>
```

### Allow creating new accounts

If you specify the [Name ID policy format](#name-id-policy-format), you can also specify the `AllowCreate` property of **NameIDPolicy** to indicate whether the identity provider is allowed to create a new account during the sign-in flow. Refer to your identity provider’s documentation for guidance.

Azure AD B2C omits the `AllowCreate` property by default. You can change this behavior using the `NameIdPolicyAllowCreate` metadata. The value of this metadata is `true` or `false`.

The following example demonstrates how to set `AllowCreate` property of `NameIDPolicy` to `true`.

```xml
<Metadata>
  ...
  <Item Key="NameIdPolicyFormat">urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</Item>
  <Item Key="NameIdPolicyAllowCreate">true</Item>
</Metadata>
```


The following example demonstrates an authorization request with **AllowCreate** of the **NameIDPolicy** element in the authorization request.


```xml
<samlp:AuthnRequest ... >
  ...
  <samlp:NameIDPolicy 
      Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress" 
      AllowCreate="true" />
</samlp:AuthnRequest>
```

### Force authentication

You can force the external SAML IDP to prompt the user for authentication by passing the `ForceAuthN` property in the SAML authentication request. Your identity provider must also support this property.

The `ForceAuthN` property is a Boolean `true` or `false` value. By default, Azure AD B2C sets the ForceAuthN value to `false`. If the session is then reset (for example by using the `prompt=login` in OIDC), then the `ForceAuthN` value is set to `true`. Setting the `ForceAuthN` metadata to `true` forces the value for all requests to the external IDP.

The following example shows the `ForceAuthN` property set to `true`:

```xml
<Metadata>
  ...
  <Item Key="ForceAuthN">true</Item>
  ...
</Metadata>
```

The following example shows the `ForceAuthN` property in an authorization request:


```xml
<samlp:AuthnRequest AssertionConsumerServiceURL="https://..."  ...
                    ForceAuthN="true">
  ...
</samlp:AuthnRequest>
```

### Provider name

You can optionally include the `ProviderName` attribute in the SAML authorization request. Set the `ProviderName` metadata to include the provider name for all requests to the external SAML IDP. The following example shows the `ProviderName` property set to `Contoso app`:

```xml
<Metadata>
  ...
  <Item Key="ProviderName">Contoso app</Item>
  ...
</Metadata>
```

The following example shows the `ProviderName` property in an authorization request:


```xml
<samlp:AuthnRequest AssertionConsumerServiceURL="https://..."  ...
                    ProviderName="Contoso app">
  ...
</samlp:AuthnRequest>
```


### Include authentication context class references

A SAML authorization request may contain a **AuthnContext** element, which specifies the context of an authorization request. The element can contain an authentication context class reference, which tells the SAML identity provider which authentication mechanism to present to the user.

To configure the authentication context class references, add **IncludeAuthnContextClassReferences** metadata. In the value, specify one or more URI references identifying authentication context classes. Specify multiple URIs as a comma-delimited list. Refer to your identity provider’s documentation for guidance on the **AuthnContextClassRef** URIs that are supported.

The following example allows users to sign in with both username and password, and to sign in with username and password over a protected session (SSL/TLS).

```xml
<Metadata>
  ...
  <Item Key="IncludeAuthnContextClassReferences">urn:oasis:names:tc:SAML:2.0:ac:classes:Password,urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</Item>
</Metadata>
```

The following SAML authorization request contains the authentication context class references.

```xml
<samlp:AuthnRequest ... >
  ...
  <samlp:RequestedAuthnContext>
    <saml:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:Password</saml:AuthnContextClassRef>
    <saml:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml:AuthnContextClassRef>
  </samlp:RequestedAuthnContext>
</samlp:AuthnRequest>
```

## Include custom data in the authorization request

You can optionally include protocol message extension elements that are agreed to by both Azure AD B2C and your identity provider. The extension is presented in XML format. You include extension elements by adding XML data inside the CDATA element `<![CDATA[Your Custom XML]]>`. Check your identity provider’s documentation to see if the extensions element is supported.

The following example illustrates the use of extension data:

```xml
<Metadata>
  ...
  <Item Key="AuthenticationRequestExtensions"><![CDATA[
            <ext:MyCustom xmlns:ext="urn:ext:custom">
              <ext:AssuranceLevel>1</ext:AssuranceLevel>
              <ext:AssuranceDescription>Identity verified to level 1.</ext:AssuranceDescription>
            </ext:MyCustom>]]></Item>
</Metadata>
```

> [!NOTE]
> Per the SAML specification, the extension data must be namespace-qualified XML (for example, 'urn:ext:custom' shown in the sample), and it must not be one of the SAML-specific namespaces.

With the SAML protocol message extension, the SAML response looks like the following example:

```xml
<samlp:AuthnRequest ... >
  ...
  <samlp:Extensions>
    <ext:MyCustom xmlns:ext="urn:ext:custom">
      <ext:AssuranceLevel>1</ext:AssuranceLevel>
      <ext:AssuranceDescription>Identity verified to level 1.</ext:AssuranceDescription>
    </ext:MyCustom>
  </samlp:Extensions>
</samlp:AuthnRequest>
```

## Require signed SAML responses

Azure AD B2C requires all incoming assertions to be signed. You can remove this requirement by setting the **WantsSignedAssertions** to `false`. The identity provider shouldn’t sign the assertions in this case, but even if it does, Azure AD B2C doesn't validate the signature.

The **WantsSignedAssertions** metadata controls the SAML metadata flag **WantAssertionsSigned**, which is included in the metadata of the Azure AD B2C technical profile that is shared with the identity provider.

```xml
<SPSSODescriptor AuthnRequestsSigned="true" WantAssertionsSigned="true" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
```

If you disable the assertions validation, you might also want to disable the response message signature validation. Set the **ResponsesSigned** metadata to `false`. The identity provider shouldn’t sign the SAML response message in this case, but even if it does, Azure AD B2C doesn't validate the signature.

The following example removes both the message and the assertion signature:

```xml
<Metadata>
  ...
  <Item Key="WantsSignedAssertions">false</Item>
  <Item Key="ResponsesSigned">false</Item>
</Metadata>
```

## Require encrypted SAML responses

To require all incoming assertions to be encrypted, set the **WantsEncryptedAssertions** metadata. When encryption is required, the identity provider uses a public key of an encryption certificate in an Azure AD B2C technical profile. Azure AD B2C decrypts the response assertion using the private portion of the encryption certificate.

If you enable the assertions encryption, you might also need to disable the response signature validation (for more information, see [Require signed SAML responses](#require-signed-saml-responses).

When the **WantsEncryptedAssertions** metadata is set to `true`, the metadata of the Azure AD B2C technical profile includes the **encryption** section. The identity provider reads the metadata and encrypts the SAML response assertion with the public key that is provided in the metadata of the Azure AD B2C technical profile.

The following example shows the Key Descriptor section of the SAML metadata used for encryption:

```xml
<SPSSODescriptor AuthnRequestsSigned="true"  protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
  <KeyDescriptor use="encryption">
    <KeyInfo xmlns="https://www.w3.org/2000/09/xmldsig#">
      <X509Data>
        <X509Certificate>valid certificate</X509Certificate>
      </X509Data>
    </KeyInfo>
  </KeyDescriptor>
  ...
</SPSSODescriptor>
```

To encrypt the SAML response assertion:

1. [Create a policy key](identity-provider-generic-saml.md#create-a-policy-key) with a unique identifier. For example, `B2C_1A_SAMLEncryptionCert`.
2. In your SAML technical profile **CryptographicKeys** collection. Set the **StorageReferenceId** to the name of the policy key you created in the first step. The `SamlAssertionDecryption` ID indicates the use of the cryptographic key to encrypt and decrypt the assertion of the SAML response.

    ```xml
    <CryptographicKeys>
            ...
      <Key Id="SamlAssertionDecryption" StorageReferenceId="B2C_1A_SAMLEncryptionCert"/>
    </CryptographicKeys>
    ```

3. Set the technical profile metadata **WantsEncryptedAssertions** to `true`.
    
    ```xml
    <Metadata>
      ...
      <Item Key="WantsEncryptedAssertions">true</Item>
    </Metadata>
    ```

4. Update your identity provider with the new Azure AD B2C technical profile metadata. You should see the **KeyDescriptor** with the **use** property set to `encryption` containing the public key of your certificate.

## Enable use of context claims

In the input and output claims collection, you can include claims that not return by the identity provider as long as you set the `DefaultValue` attribute. You can also use [context claims](claim-resolver-overview.md) to be included in the technical profile. To use a context claim:

1. Add a claim type to the [ClaimsSchema](claimsschema.md) element within [BuildingBlocks](buildingblocks.md).
2. Add an output claim to the input or output collection. In the following example, the first claim sets the value of the identity provider. The second claim uses the user IP address [context claims](claim-resolver-overview.md).
    
    ```xml
    <OutputClaims>
      <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="contoso.com" AlwaysUseDefaultValue="true" />
      <OutputClaim ClaimTypeReferenceId="IpAddress" DefaultValue="{Context:IPAddress}" AlwaysUseDefaultValue="true" />
    </OutputClaims>
    ```

## Disable single logout

Upon an application sign-out request, Azure AD B2C attempts to sign out from your SAML identity provider. For more information, see [Azure AD B2C session sign-out](session-behavior.md#sign-out).  To disable the single logout behavior, set the **SingleLogoutEnabled** metadata to `false`.

```xml
<Metadata>
  ...
  <Item Key="SingleLogoutEnabled">false</Item>
</Metadata>
```

## Debug SAML protocol

To help configure and debug federation with a SAML identity provider, you can use a browser extension for the SAML protocol, such as [SAML DevTools extension](https://chrome.google.com/webstore/detail/saml-devtools-extension/jndllhgbinhiiddokbeoeepbppdnhhio) for Chrome, [SAML-tracer](https://addons.mozilla.org/es/firefox/addon/saml-tracer/) for FireFox, or [Microsoft Edge or IE Developer tools](https://techcommunity.microsoft.com/t5/microsoft-sharepoint-blog/gathering-a-saml-token-using-edge-or-ie-developer-tools/ba-p/320957).

Using these tools, you can check the integration between Azure AD B2C and your SAML identity provider. For example:

- Check if the SAML request contains a signature and determine what algorithm is used to sign in the authorization request.
- Get the claims (assertions) under the `AttributeStatement` section.
- Check if the identity provider returns an error message.
- Check if the assertion section is encrypted.

## SAML request and response samples

Security Assertion Markup Language (SAML) is an open standard for exchanging authentication and authorization data between an identity provider and a service provider. When Azure AD B2C federates with a SAML identity provider, it acts as a **service provider** initiating a SAML request to the SAML **identity provider**, and waiting for a SAML response.

A success SAML response contains security **assertions** which are statements that made by the external SAML identity providers. Azure AD B2C parses and [maps the assertions](#claims-mapping) into claims.

### Authorization request

To request a user authentication, Azure AD B2C sends an `AuthnRequest` element to the external SAML identity provider. A sample SAML 2.0 `AuthnRequest` could look like the following example:

```xml
<samlp:AuthnRequest 
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" 
    ID="_11111111-0000-0000-0000-000000000000" 
    Version="2.0" 
    IssueInstant="2023-03-20T07:10:00.0000000Z" 
    Destination="https://fabrikam.com/saml2" 
    ForceAuthn="false" 
    IsPassive="false" 
    ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" 
    AssertionConsumerServiceURL="https://contoso.b2clogin.com/contoso.onmicrosoft.com/B2C_1A_TrustFrameworkBase/samlp/sso/assertionconsumer" 
    ProviderName="https://fabrikam.com" 
    xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol">
    <saml:Issuer 
        Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">https://contoso.b2clogin.com/contoso.onmicrosoft.com/B2C_1A_TrustFrameworkBase
    </saml:Issuer>
</samlp:AuthnRequest>
```

### Response

When a requested sign-on completes successfully, the external SAML identity provider posts a response to Azure AD B2C [assertion consumer service](#assertion-consumer-service) endpoint. A response to a successful sign-on attempt looks like the following sample:

```xml
<samlp:Response 
    ID="_98765432-0000-0000-0000-000000000000" 
    Version="2.0" 
    IssueInstant="2023-03-20T07:11:30.0000000Z" 
    Destination="https://contoso.b2clogin.com/contoso.onmicrosoft.com/B2C_1A_TrustFrameworkBase/samlp/sso/assertionconsumer" 
    InResponseTo="_11111111-0000-0000-0000-000000000000" 
    xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol">
    <Issuer 
        xmlns="urn:oasis:names:tc:SAML:2.0:assertion">https://fabrikam.com/
    </Issuer>
    <samlp:Status>
        <samlp:StatusCode 
            Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
    </samlp:Status>
    <Assertion 
        ID="_55555555-0000-0000-0000-000000000000" 
        IssueInstant="2023-03-20T07:40:45.505Z" 
        Version="2.0" 
        xmlns="urn:oasis:names:tc:SAML:2.0:assertion">
        <Issuer>https://fabrikam.com/</Issuer>
        <Signature 
            xmlns="http://www.w3.org/2000/09/xmldsig#">
            ...
        </Signature>
        <Subject>
            <NameID 
                Format="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent">ABCDEFG
            </NameID>
            ...
        </Subject>
        <AttributeStatement>
            <Attribute Name="uid">
                <AttributeValue>12345</AttributeValue>
            </Attribute>
            <Attribute Name="displayname">
                <AttributeValue>David</AttributeValue>
            </Attribute>
            <Attribute Name="email">
                <AttributeValue>david@contoso.com</AttributeValue>
            </Attribute>
            ....
        </AttributeStatement>
        <AuthnStatement 
            AuthnInstant="2023-03-20T07:40:45.505Z" 
            SessionIndex="_55555555-0000-0000-0000-000000000000">
            <AuthnContext>
                <AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:Password</AuthnContextClassRef>
            </AuthnContext>
        </AuthnStatement>
    </Assertion>
</samlp:Response>
```

### Logout request

Upon an application sign-out request, Azure AD B2C attempts to sign out from your SAML identity provider. Azure AD B2C sends a `LogoutRequest` message to the external IDP to indicate that a session has been terminated. The following excerpt shows a sample `LogoutRequest` element.

The value of the `NameID` element matches the `NameID` of the user that is being signed out. The `SessionIndex` element matches the `SessionIndex` attribute of `AuthnStatement` in the sign-in SAML response.

```xml
<samlp:LogoutRequest 
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    ID="_22222222-0000-0000-0000-000000000000" 
    Version="2.0" 
    IssueInstant="2023-03-20T08:21:07.3679354Z" 
    Destination="https://fabrikam.com/saml2/logout" 
    xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol">
    <saml:Issuer 
        Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">https://contoso.b2clogin.com/contoso.onmicrosoft.com/B2C_1A_TrustFrameworkBase
    </saml:Issuer>
    <saml:NameID>ABCDEFG</saml:NameID>
    <samlp:SessionIndex>_55555555-0000-0000-0000-000000000000</samlp:SessionIndex>
</samlp:LogoutRequest>
```

## Next steps

- Learn how to diagnose problems with your custom policies, using [Application Insights](troubleshoot-with-application-insights.md). 

::: zone-end
