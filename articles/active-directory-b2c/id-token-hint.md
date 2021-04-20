---
title: Define an ID token hint technical profile in a custom policy
titleSuffix: Azure AD B2C
description: Define an ID token hint technical profile in a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 10/16/2020
ms.author: mimart
ms.subservice: B2C
---

# Define an ID token hint technical profile in an Azure Active Directory B2C custom policy

Azure AD B2C allows relying party applications to send an inbound JWT as part of the OAuth2 authorization request. The JWT token can be issued by a relying party application or an identity provider, and it can pass a hint about the user or the authorization request. Azure AD B2C validates the signature, issuer name, and token audience, and extracts the claim from the inbound token.

## Use cases

You can use this solution to send data to Azure AD B2C encapsulated in a single JWT token. The [SignUp with email invitation solution](https://github.com/azure-ad-b2c/samples/blob/master/policies/invite/README.md), where your system admin can send a signed invite to users, is based on id_token_hint. Only users with access to the invite email can create the account in the directory.

## Token signing approach

With id_token_hint, the token issuer (a relying party app or an identity provider) composes the token, and then signs it by using a signing key to prove the token comes from a trusted source. The signing key can be symmetric or asymmetric. Symmetric cryptography, or private key cryptography, uses a shared secret to both sign and validate the signature. Asymmetric cryptography, or public key cryptography, is a cryptographic system that uses both a private key and a public key. The private key is known only to the token issuer and is used to sign the token. The public key is shared with the Azure AD B2C policy to validate the signature of the token.

## Token format

The id_token_hint must be a valid JWT token. The following table lists the claims that are mandatory. Additional claims are optional.

| Name | Claim | Example value | Description |
| ---- | ----- | ------------- | ----------- |
| Audience | `aud` | `a489fc44-3cc0-4a78-92f6-e413cd853eae` | Identifies the intended recipient of the token. The audience is an arbitrary string defined by the token issuer. Azure AD B2C validates this value, and rejects the token if it doesn't match.  |
| Issuer | `iss` |`https://localhost` | Identifies the security token service (token issuer). The issuer is an arbitrary URI defined by the token issuer. Azure AD B2C validates this value, and rejects the token if it doesn't match.  |
| Expiration time | `exp` | `1600087315` | The time at which the token becomes invalid, represented in epoch time. Azure AD B2C validates this value, and rejects the token if the token is expired.|
| Not before | `nbf` | `1599482515` | The time at which the token becomes valid, represented in epoch time. This time is usually the same as the time the token was issued. Azure AD B2C validates this value, and rejects the token if the token lifetime is not valid. |

 The following token is an example of a valid ID token:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}.{
  "displayName": " John Smith",
  "userId": "john.s@contoso.com",
  "nbf": 1599482515,
  "exp": 1600087315,
  "iss": "https://localhost",
  "aud": "a489fc44-3cc0-4a78-92f6-e413cd853eae"
}
```

## Protocol

The **Name** attribute of the **Protocol** element needs to be set to `None`. For example, the protocol for the **IdTokenHint_ExtractClaims** technical profile is `None`:

```xml
<TechnicalProfile Id="IdTokenHint_ExtractClaims">
  <DisplayName> My ID Token Hint TechnicalProfile</DisplayName>
  <Protocol Name="None" />
  ...
```

The technical profile is called from an orchestration step with type of `GetClaims`.

```xml
<OrchestrationStep Order="1" Type="GetClaims" CpimIssuerTechnicalProfileReferenceId="IdTokenHint_ExtractClaims" />
``` 

## Output claims

The **OutputClaims** element contains a list of claims to be extracted from the JWT token. You may need to map the name of the claim defined in your policy to the name defined in the JWT token. You can also include claims that aren't returned by the JWT token, as long as you set the `DefaultValue` attribute.

## Metadata

The following metadata is relevant when using symmetric key. 

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| issuer | Yes | Identifies the security token service (token issuer). This value must be identical to the `iss` claim within the JWT token claim. | 
| IdTokenAudience | Yes | Identifies the intended recipient of the token. Must be identical to the `aud` claim within the JWT token claim. | 

The following metadata is relevant when using an asymmetric key. 

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| METADATA| Yes | A URL that points to a token issuer configuration document, which is also known as an OpenID well-known configuration endpoint.   |
| issuer | No | Identifies the security token service (token issuer). This value can be used to overwrite the value configured in the metadata, and must be identical to the `iss` claim within the JWT token claim. |  
| IdTokenAudience | No | Identifies the intended recipient of the token. Must be identical to the `aud` claim within the JWT token claim. |  

## Cryptographic keys

When using a symmetric key, the **CryptographicKeys** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| client_secret | Yes | The cryptographic key that is used to validate the JWT token signature.|


## How-to guide

### Issue a token with symmetric keys

#### Step 1. Create a shared key 

Create a key that can be used to sign the token. For example, use the following PowerShell code to generate a key.

```powershell
$bytes = New-Object Byte[] 32
$rand = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rand.GetBytes($bytes)
$rand.Dispose()
$newClientSecret = [System.Convert]::ToBase64String($bytes)
$newClientSecret
```

This code creates a secret string like `VK62QTn0m1hMcn0DQ3RPYDAr6yIiSvYgdRwjZtU5QhI=`.

#### Step 2. Add the signing key to Azure AD B2C

The same key that is used by the token issuer needs to be created in your Azure AD B2C policy keys.  

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. On the overview page, under **Policies**, select **Identity Experience Framework**.
1. Select **Policy Keys** 
1. Select **Manual**.
1. For **Name**, use `IdTokenHintKey`.  
   The prefix `B2C_1A_` might be added automatically.
1. In the **Secret** box, enter the sign-in key you generated earlier.
1. For **Key usage**, use **Encryption**.
1. Select **Create**.
1. Confirm that you've created the key `B2C_1A_IdTokenHintKey`.


#### Step 3. Add the ID token hint technical profile

The following technical profile validates the token and extracts the claims. 

```xml
<ClaimsProvider>
  <DisplayName>My ID Token Hint ClaimsProvider</DisplayName>
  <TechnicalProfiles>
    <TechnicalProfile Id="IdTokenHint_ExtractClaims">
      <DisplayName> My ID Token Hint TechnicalProfile</DisplayName>
      <Protocol Name="None" />
      <Metadata>
        <Item Key="IdTokenAudience">a489fc44-3cc0-4a78-92f6-e413cd853eae</Item>
        <Item Key="issuer">https://localhost</Item>
      </Metadata>
      <CryptographicKeys>
        <Key Id="client_secret" StorageReferenceId="B2C_1A_IdTokenHintKey" />
      </CryptographicKeys>
      <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="userId" />
      </OutputClaims>
    </TechnicalProfile>
  </TechnicalProfiles>
</ClaimsProvider>
```

#### Step 4. Prepare your policy

Complete the [Configure your policy](#configure-your-policy) step.

#### Step 5. Prepare the code  

The [GitHub sample](https://github.com/azure-ad-b2c/id_token_hint/tree/master/dotnet_core_symmetric_key) is an ASP.NET web application and console app that generates an ID token that is signed using a symmetric key. 


### Issue a token with asymmetric keys

With an asymmetric key, the token is signed using RSA certificates. This application hosts an Open ID Connect metadata endpoint and JSON Web Keys (JWKs) endpoint that is used by Azure AD B2C to validate the signature of the ID token.

The token issuer must provide following endpoints:

* `/.well-known/openid-configuration` - A well-known configuration endpoint with relevant information about the token, such as the token issuer name and the link to the JWK endpoint. 
* `/.well-known/keys` - the JSON Web Key (JWK) end point with the public key that is used to sign the key (with the private key part of the certificate).

See the [TokenMetadataController.cs](https://github.com/azure-ad-b2c/id-token-builder/blob/master/source-code/B2CIdTokenBuilder/Controllers/TokenMetadataController.cs) .Net MVC controller sample.

#### Step 1. Prepare a self-signed certificate

If you don't already have a certificate, you can use a self-signed certificate for this how-to guide. On Windows, you can use PowerShell's [New-SelfSignedCertificate](/powershell/module/pki/new-selfsignedcertificate) cmdlet to generate a certificate.

Run this PowerShell command to generate a self-signed certificate. Modify the `-Subject` argument as appropriate for your application and Azure AD B2C tenant name. You can also adjust the `-NotAfter` date to specify a different expiration for the certificate.

```PowerShell
New-SelfSignedCertificate `
    -KeyExportPolicy Exportable `
    -Subject "CN=yourappname.yourtenant.onmicrosoft.com" `
    -KeyAlgorithm RSA `
    -KeyLength 2048 `
    -KeyUsage DigitalSignature `
    -NotAfter (Get-Date).AddMonths(12) `
    -CertStoreLocation "Cert:\CurrentUser\My"
```


#### Step 2. Add the ID token hint technical profile 

The following technical profile validates the token and extracts the claims. Change the metadata URI to your token issuer well-known configuration endpoint.  

```xml
<ClaimsProvider>
  <DisplayName>My ID Token Hint ClaimsProvider</DisplayName>
  <TechnicalProfiles>
    <TechnicalProfile Id="IdTokenHint_ExtractClaims">
      <DisplayName> My ID Token Hint TechnicalProfile</DisplayName>
      <Protocol Name="None" />
      <Metadata>
        <!-- Replace with your endpoint location -->
        <Item Key="METADATA">https://your-app.azurewebsites.net/.well-known/openid-configuration</Item>
        <Item Key="IdTokenAudience">your_optional_audience</Item> -->
        <!-- <Item Key="issuer">your_optional_token_issuer_override</Item> -->
      </Metadata>
      <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="userId" />
      </OutputClaims>
    </TechnicalProfile>
  </TechnicalProfiles>
</ClaimsProvider>
```

#### Step 3. Prepare your policy

Complete the [Configure your policy](#configure-your-policy) step.

#### Step 4. Prepare the code 

This [GitHub sample](https://github.com/azure-ad-b2c/id-token-builder) ASP.NET web application generates ID tokens and hosts the metadata endpoints required to use the "id_token_hint" parameter in Azure AD B2C.


### Configure your policy

For both symmetric and asymmetric approaches, the `id_token_hint` technical profile is called from an orchestration step with type of `GetClaims` and needs to specify the input claims of the relying party policy.

1. Add the IdTokenHint_ExtractClaims technical profile to your extension policy.
1. Add the following orchestration step to your user journey as the first item.  

    ```xml
    <OrchestrationStep Order="1" Type="GetClaims" CpimIssuerTechnicalProfileReferenceId="IdTokenHint_ExtractClaims" />
    ``` 
1. In your relying party policy, repeat the same input claims you configured in the IdTokenHint_ExtractClaims technical profile. For example:
    ```xml
   <RelyingParty>
     <DefaultUserJourney ReferenceId="SignUp" />
     <TechnicalProfile Id="PolicyProfile">
       <DisplayName>PolicyProfile</DisplayName>
       <Protocol Name="OpenIdConnect" />
       <InputClaims>
         <InputClaim ClaimTypeReferenceId="email" PartnerClaimType="userId" />
        </InputClaims>
       <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="displayName" />
        <OutputClaim ClaimTypeReferenceId="givenName" />
        <OutputClaim ClaimTypeReferenceId="surname" />
        <OutputClaim ClaimTypeReferenceId="email" />
        <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub"/>
        <OutputClaim ClaimTypeReferenceId="identityProvider" />
       </OutputClaims>
       <SubjectNamingInfo ClaimType="sub" />
      </TechnicalProfile>
    </RelyingParty>
    ```

Depending on your business requirements, you might need to add token validations, for example check the format of the email address. To do so, add orchestration steps that invoke a [claims transformation technical profile](claims-transformation-technical-profile.md). Also add a [self-asserted technical profile](self-asserted-technical-profile.md) to present an error message. 

### Create and sign a token

The GitHub samples illustrate how to create such a token issue a JWT that later sent as a `id_token_hint` query string parameter. Following is an example of an authorization request with id_token_hint parameter
 
```html
https://tenant-name.b2clogin.com/tenant-name.onmicrosoft.com/B2C_1A_signup_signin/oauth2/v2.0/authorize?client_id=63ba0d17-c4ba-47fd-89e9-31b3c2734339&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fjwt.ms&scope=openid&response_type=id_token&prompt=login&id_token_hint=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNwbGF5TmFtZSI6IiBKb2huIFNtaXRoIiwidXNlcklkIjoiam9obi5zQGNvbnRvc28uY29tIiwibmJmIjoxNTk5NDgyNTE1LCJleHAiOjE2MDAwODczMTUsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0IiwiYXVkIjoiYTQ4OWZjNDQtM2NjMC00YTc4LTkyZjYtZTQxM2NkODUzZWFlIn0.nPmLXydI83PQCk5lRBYUZRu_aX58pL1khahHyQuupig
```

## Next steps

- Check the [sign-up with invite email](https://github.com/azure-ad-b2c/samples/blob/master/policies/invite/README.md) solution on the Azure AD B2C community GitHub repo.
