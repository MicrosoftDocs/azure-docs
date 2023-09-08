---
title: Configure Sign in with Apple (Preview)
description: Learn how to configure Sign in with Apple as an identity provider for your App Service or Azure Functions app.
ms.topic: article
ms.date: 11/19/2020
ms.reviewer: mikarmar
ms.custom: AppServiceIdentity
author: cephalin
ms.author: cephalin
---

# Configure your App Service or Azure Functions app to sign in using a Sign in with Apple provider (Preview)

[!INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]

This article shows you how to configure Azure App Service or Azure Functions to use Sign in with Apple as an authentication provider. 

To complete the procedure in this article, you must have enrolled in the Apple developer program. To enroll in the Apple developer program, go to [developer.apple.com/programs/enroll](https://developer.apple.com/programs/enroll/).

> [!CAUTION]
> Enabling Sign in with Apple will disable management of the App Service Authentication / Authorization feature for your application through some clients, such as the Azure portal, Azure CLI, and Azure PowerShell. The feature relies on a new API surface which, during preview, is not yet accounted for in all management experiences.

[comment]: <Remove this caution block when V2 becomes available for use.> 

## <a name="createApplication"> </a>Create an application in the Apple Developer portal
You'll need to create an App ID and a service ID in the Apple Developer portal.

1. On the Apple Developer portal, go to **Certificates, Identifiers, & Profiles**.
2. On the **Identifiers** tab, select the **(+)** button.
3. On the **Register a New Identifier** page, choose **App IDs** and select **Continue**. (App IDs include one or more Service IDs.)
![Registering a new app identifier in the Apple Developer Portal](media/configure-authentication-provider-apple/apple-register-app.jpg)
4. On the **Register an App ID** page, provide a description and a bundle ID, and select **Sign in with Apple** from the capabilities list. Then select **Continue**. Take note of your **App ID Prefix (Team ID)** from this step, you'll need it later.
![Configuring a new app identifier in the Apple Developer Portal](media/configure-authentication-provider-apple/apple-configure-app.jpg)
5. Review the app registration information and select **Register**.
6. Again, on the **Identifiers** tab, select the **(+)** button.
![Creating a new service identifier in the Apple Developer Portal](media/configure-authentication-provider-apple/apple-new-app.jpg) 
7. On the **Register a New Identifier** page, choose **Services IDs** and select **Continue**.
![Registering a new service identifier in the Apple Developer Portal](media/configure-authentication-provider-apple/apple-register-service.jpg)
8. On the **Register a Services ID** page, provide a description and an identifier. The description is what will be shown to the user on the consent screen. The identifier will be your client ID used in configuring the Apple provider with your app service. Then select **Configure**.
![Providing a description and an identifier](media/configure-authentication-provider-apple/apple-configure-service-1.jpg)
9. On the pop-up window, set the Primary App ID to the App ID you created earlier. Specify your application's domain in the domain section. For the return URL, use the URL `<app-url>/.auth/login/apple/callback`. For example, `https://contoso.azurewebsites.net/.auth/login/apple/callback`. Then select **Add** and **Save**.
![Specifying the domain and return URL for the registration](media/configure-authentication-provider-apple/apple-configure-service-2.jpg)
10. Review the service registration information and select **Save**.

## <a name="generateClientSecret"> </a>Generate the client secret
Apple requires app developers to create and sign a JWT token as the client secret value. To generate this secret, first generate and download an elliptic curve private key from the Apple Developer portal. Then, use that key to [sign a JWT](#sign-the-client-secret-jwt) with a [specific payload](#structure-the-client-secret-jwt).

### Create and download the private key
1. On the **Keys** tab in the Apple Developer portal, choose **Create a key** or select the **(+)** button.
2. On the **Register a New Key** page give the key a name, check the box next to **Sign in with Apple** and select **Configure**.
3. On the **Configure Key** page, link the key to the primary app ID you created previously and select **Save**.
4. Finish creating the key by confirming the information and selecting **Continue** and then reviewing the information and selecting **Register**.
5. On the **Download Your Key** page, download the key. It will download as a `.p8` (PKCS#8) file - you'll use the file contents to sign your client secret JWT.

### Structure the client secret JWT
Apple requires the client secret be the base64-encoding of a JWT token. The decoded JWT token should have a payload structured like this example:
```json
{
  "alg": "ES256",
  "kid": "URKEYID001",
}.{
  "sub": "com.yourcompany.app1",
  "nbf": 1560203207,
  "exp": 1560289607,
  "iss": "ABC123DEFG",
  "aud": "https://appleid.apple.com"
}.[Signature]
```
- **sub**: The Apple Client ID (also the service ID)
- **iss**: Your Apple Developer Team ID
- **aud**: Apple is receiving the token, so they're the audience
- **exp**: No more than six months after **nbf**

The base64-encoded version of the above payload looks like this: 
`eyJhbGciOiJFUzI1NiIsImtpZCI6IlVSS0VZSUQwMDEifQ.eyJzdWIiOiJjb20ueW91cmNvbXBhbnkuYXBwMSIsIm5iZiI6MTU2MDIwMzIwNywiZXhwIjoxNTYwMjg5NjA3LCJpc3MiOiJBQkMxMjNERUZHIiwiYXVkIjoiaHR0cHM6Ly9hcHBsZWlkLmFwcGxlLmNvbSJ9.ABSXELWuTbgqfrIUz7bLi6nXvkXAz5O8vt0jB2dSHTQTib1x1DSP4__4UrlKI-pdzNg1sgeocolPNTmDKazO8-BHAZCsdeeTNlgFEzBytIpMKFfVEQbEtGRkam5IeclUK7S9oOva4EK4jV4VmgDrr-LGWWO3TaAxAvy3_ZoKohvFFkVG`

_Note: Apple doesn't accept client secret JWTs with an expiration date more than six months after the creation (or nbf) date. That means you'll need to rotate your client secret, at minimum, every six months._

More information about generating and validating tokens can be found in [Apple's developer documentation](https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens). 

### Sign the client secret JWT
You'll use the `.p8` file you downloaded previously to sign the client secret JWT. This file is a [PCKS#8 file](https://en.wikipedia.org/wiki/PKCS_8) that contains the private signing key in PEM format. There are many libraries that can create and sign the JWT for you. 

There are different kinds of open-source libraries available online for creating and signing JWT tokens. For more information about generating JWT tokens, see [JSON Web Token (JWT)](../active-directory/develop/security-tokens.md#json-web-tokens-and-claims). For example, one way of generating the client secret is by importing the [Microsoft.IdentityModel.Tokens NuGet package](https://www.nuget.org/packages/Microsoft.IdentityModel.Tokens/) and running a small amount of C# code shown below.

```csharp
using Microsoft.IdentityModel.Tokens;

public static string GetAppleClientSecret(string teamId, string clientId, string keyId, string p8key)
{
    string audience = "https://appleid.apple.com";

    string issuer = teamId;
    string subject = clientId;
    string kid = keyId;

    IList<Claim> claims = new List<Claim> {
        new Claim ("sub", subject)
    };

    CngKey cngKey = CngKey.Import(Convert.FromBase64String(p8key), CngKeyBlobFormat.Pkcs8PrivateBlob);

    SigningCredentials signingCred = new SigningCredentials(
        new ECDsaSecurityKey(new ECDsaCng(cngKey)),
        SecurityAlgorithms.EcdsaSha256
    );

    JwtSecurityToken token = new JwtSecurityToken(
        issuer,
        audience,
        claims,
        DateTime.Now,
        DateTime.Now.AddDays(180),
        signingCred
    );
    token.Header.Add("kid", kid);
    token.Header.Remove("typ");

    JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();

    return tokenHandler.WriteToken(token);
}
```
- **teamId**: Your Apple Developer Team ID
- **clientId**: The Apple Client ID (also the service ID)
- **p8key**: The PEM format key - you can obtain the key by opening the `.p8` file in a text editor, and copying everything between `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` without line breaks
- **keyId**: The ID of the downloaded key

This token returned is the client secret value you'll use to configure the Apple provider.

> [!IMPORTANT]
> The client secret is an important security credential. Do not share this secret with anyone or distribute it within a client application.
>

Add the client secret as an [application setting](./configure-common.md#configure-app-settings) for the app, using a setting name of your choice. Make note of this name for later.

## <a name="configure"> </a>Add provider information to your application

> [!NOTE]
> The required configuration is in a new API format, currently only supported by [file-based configuration (preview)](configure-authentication-file-based.md). You will need to follow the below steps using such a file.

This section will walk you through updating the configuration to include your new IDP. An example configuration follows.

1. Within the `identityProviders` object, add an `apple` object if one doesn't already exist.
2. Assign an object to that key with a `registration` object within it, and optionally a `login` object:
    
    ```json
    "apple" : {
       "registration" : {
            "clientId": "<client ID>",
            "clientSecretSettingName": "APP_SETTING_CONTAINING_APPLE_CLIENT_SECRET" 
        },
       "login": {
             "scopes": []
       }
    }
    ```
    a. Within the `registration` object, set the `clientId` to the client ID you collected.
    
    b. Within the `registration` object, set `clientSecretSettingName` to the name of the application setting where you stored the client secret.
    
    c. Within the `login` object, you may choose to set the `scopes` array to include a list of scopes used when authenticating with Apple, such as "name" and "email". If scopes are configured, they'll be explicitly requested on the consent screen when users sign in for the first time.

Once this configuration has been set, you're ready to use your Apple provider for authentication in your app.

A complete configuration might look like the following example (where the APPLE_GENERATED_CLIENT_SECRET setting points to an application setting containing a generated JWT):

```json
{
    "platform": {
        "enabled": true
    },
    "globalValidation": {
        "redirectToProvider": "apple",
        "unauthenticatedClientAction": "RedirectToLoginPage"
    },
    "identityProviders": {
        "apple": {
            "registration": {
                "clientId": "com.contoso.example.client",
                "clientSecretSettingName": "APPLE_GENERATED_CLIENT_SECRET"
            },
            "login": {
                "scopes": []
            }
        }
    },
    "login": {
        "tokenStore": {
            "enabled": true
        }
    }     
}
```

## <a name="related-content"> </a>Next steps

[!INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]
