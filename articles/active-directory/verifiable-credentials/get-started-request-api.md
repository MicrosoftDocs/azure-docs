---
title: How to call the Request Service REST API (preview)
titleSuffix: Azure Active Directory Verifiable Credentials
description: Learn how to issue and verify by using the Request Service REST API
documentationCenter: ''
author: barclayn
manager: rkarlin
ms.service: decentralized-identity
ms.topic: how-to
ms.subservice: verifiable-credentials
ms.date: 05/03/2022
ms.author: barclayn

#Customer intent: As an administrator, I am trying to learn how to use the Request Service API and integrate it into my business application.
---

# Request Service REST API (preview)

[!INCLUDE [Verifiable Credentials announcement](../../../includes/verifiable-credentials-brand.md)]

Azure Active Directory (Azure AD) Verifiable Credentials includes the Request Service REST API. This API allows you to issue and verify credentials. This article shows you how to start using the Request Service REST API.

> [!IMPORTANT]
> The Request Service REST API is currently in preview. This preview version is provided without a service level agreement, and you can occasionally expect breaking changes and deprecation of the API while in preview. The preview version of the API isn't recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## API access token

For your application to access the Request Service REST API, you need to include a valid access token with the required permissions. Access tokens issued by the Microsoft identity platform contain information (scopes) that the Request Service REST API uses to validate the caller. An access token ensures that the caller has the proper permissions to perform the operation they're requesting.

To get an access token, your app must be registered with the Microsoft identity platform, and be authorized by an administrator for access to the Request Service REST API. If you haven't registered the *verifiable-credentials-app* application, see [how to register the app](verifiable-credentials-configure-tenant.md#register-an-application-in-azure-ad) and then [generate an application secret](verifiable-credentials-configure-issuer.md#configure-the-verifiable-credentials-app).

### Get an access token

Use the [OAuth 2.0 client credentials grant flow](../../active-directory/develop/v2-oauth2-client-creds-grant-flow.md) to acquire the access token by using the Microsoft identity platform. Use a trusted library for this purpose. In this tutorial, we use the Microsoft Authentication Library [MSAL](../../active-directory/develop/msal-overview.md). MSAL simplifies adding authentication and authorization to an app that can call a secure web API.

# [HTTP](#tab/http)

```http
Refer to to the Microsoft Authentication Library (MSAL) documentation for more information on how to acquire tokens via HTTP.
```

# [C#](#tab/csharp)

```csharp
// Initialize MSAL library by using the following code
ConfidentialClientApplicationBuilder.Create(AppSettings.ClientId)
    .WithClientSecret(AppSettings.ClientSecret)
    .WithAuthority(new Uri(AppSettings.Authority))
    .Build();

// Acquire an access token
result = await app.AcquireTokenForClient(AppSettings.Scopes)
                .ExecuteAsync();
```

# [Node.js](#tab/nodejs)

```nodejs
// Initialize MSAL library by using the following code
const msalConfig = {
  auth: {
      clientId: config.azClientId,
      authority: `https://login.microsoftonline.com/${config.azTenantId}`,
      clientSecret: config.azClientSecret,
  },
  system: {
      loggerOptions: {
          loggerCallback(loglevel, message, containsPii) {
              console.log(message);
          },
          piiLoggingEnabled: false,
          logLevel: msal.LogLevel.Verbose,
      }
  }
};
const cca = new msal.ConfidentialClientApplication(msalConfig);
const msalClientCredentialRequest = {
  scopes: ["bbb94529-53a3-4be5-a069-7eaf2712b826/.default"],
  skipCache: false, 
};
module.exports.msalCca = cca;
module.exports.msalClientCredentialRequest = msalClientCredentialRequest;

// Acquire an access token
const result = await mainApp.msalCca.acquireTokenByClientCredential(mainApp.msalClientCredentialRequest);
    if ( result ) {
      accessToken = result.accessToken;
    }
```

---

In the preceding code, provide the following parameters:

| Parameter | Condition | Description |
| --- | --- | --- |
| Authority | Required | The directory tenant the application plans to operate against. For example: `https://login.microsoftonline.com/{your-tenant}`. (Replace `your-tenant` with your [tenant ID or name](../fundamentals/active-directory-how-to-find-tenant.md).) |
| Client ID | Required | The application ID that's assigned to your app. You can find this information in the Azure portal, where you registered your app. |
| Client secret | Required | The client secret that you generated for your app.|
| Scopes | Required | Must be set to `bbb94529-53a3-4be5-a069-7eaf2712b826/.default`. |

For more information about how to get an access token by using a console app's identity, see one of the following articles: [C#](../develop/quickstart-v2-netcore-daemon.md), [Python](../develop/quickstart-v2-python-daemon.md), [Node.js](../develop/quickstart-v2-nodejs-console.md), or [Java](../develop/quickstart-v2-java-daemon.md).

You can also [access a token request with a certificate](../develop/v2-oauth2-client-creds-grant-flow.md) instead of client secret.

# [HTTP](#tab/http)

```http
POST /{tenant}/oauth2/v2.0/token HTTP/1.1   //Line breaks for clarity
Host: login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded

client_id=12345678-0000-0000-00000000000000000
&scope=bbb94529-53a3-4be5-a069-7eaf2712b826/.default
&client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer
&client_assertion=eyJhbGciOiJSUzI1NiIsIng1dCI6Imd4OHRHeXN5amNScUtqRlBuZDdSRnd2d1pJMCJ9.eyJ{a lot of characters here}M8U3bSUKKJDEg
&grant_type=client_credentials
```

# [C#](#tab/csharp)

```csharp
// Initialize MSAL library by using the following code
X509Certificate2 certificate = AppSettings.ReadCertificate(AppSettings.CertificateName);
    app = ConfidentialClientApplicationBuilder.Create(AppSettings.ClientId)
        .WithCertificate(certificate)
        .WithAuthority(new Uri(AppSettings.Authority))
        .Build();

// Acquire an access token
result = await app.AcquireTokenForClient(AppSettings.Scopes)
                .ExecuteAsync();
```

# [Node.js](#tab/nodejs)

```nodejs
// Initialize MSAL library by using the following code
const msalConfig = {
  auth: {
      clientId: config.azClientId,
      authority: `https://login.microsoftonline.com/${config.azTenantId}`,
      clientCertificate: {
            thumbprint: "CERT_THUMBPRINT", // a 40-digit hexadecimal string
            privateKey: "CERT_PRIVATE_KEY"
        }
  },
  system: {
      loggerOptions: {
          loggerCallback(loglevel, message, containsPii) {
              console.log(message);
          },
          piiLoggingEnabled: false,
          logLevel: msal.LogLevel.Verbose,
      }
  }
};
const cca = new msal.ConfidentialClientApplication(msalConfig);
const msalClientCredentialRequest = {
  scopes: ["bbb94529-53a3-4be5-a069-7eaf2712b826/.default"],
  skipCache: false, 
};
module.exports.msalCca = cca;
module.exports.msalClientCredentialRequest = msalClientCredentialRequest;

// Acquire an access token
const result = await mainApp.msalCca.acquireTokenByClientCredential(mainApp.msalClientCredentialRequest);
    if ( result ) {
      accessToken = result.accessToken;
    }
```

---

## Call the API

To issue or verify a verifiable credential, follow these steps:

1. Construct an HTTP POST request to the Request Service REST API. Replace the `{tenantID}` with your tenant ID, or your tenant name.

    ```http
    POST https://beta.did.msidentity.com/v1.0/{tenantID}/verifiablecredentials/request
    ```

1. Attach the access token as a bearer token to the authorization header in an HTTP request.

    ```http
    Authorization: Bearer <token>
    ```

1. Set the `Content-Type` header to `Application/json`.

1. Prepare and attach the [issuance](issuance-request-api.md#issuance-request-payload) or [presentation](presentation-request-api.md#presentation-request-payload) request payload to the request body.

1. Submit the request to the Request Service REST API.

## Issuance request example

The following example demonstrates a verifiable credentials issuance request. For information about the payload, see [Request Service REST API issuance specification](issuance-request-api.md).

```http
POST https://beta.did.msidentity.com/v1.0/contoso.onmicrosoft.com/verifiablecredentials/request
Content-Type: application/json
Authorization: Bearer  <token>

{
    "includeQRCode": true,
    "callback": {
        "url": "https://www.contoso.com/api/issuer/issuanceCallback",
        "state": "de19cb6b-36c1-45fe-9409-909a51292a9c",
        "headers": {
            "api-key": "OPTIONAL API-KEY for VERIFIER CALLBACK API"
        }
    },
    "authority": "did:ion:EiCLL8lzCqlGLYTGbjwgR6SN6OkIjO6uUKyF5zM7fQZ8Jg:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJzaWdfOTAyZmM2NmUiLCJwdWJsaWNLZXlKd2siOnsiY3J2Ijoic2VjcDI1NmsxIiwia3R5IjoiRUMiLCJ4IjoiTEdUOWk3aFYzN1dUcFhHcUg5c1VDek...",
    "registration": {
        "clientName": "Verifiable Credential Expert Sample"
    },
    "issuance": {
        "type": "VerifiedCredentialExpert",
        "manifest": "https://beta.did.msidentity.com/v1.0/12345678-0000-0000-0000-000000000000/verifiableCredential/contracts/VerifiedCredentialExpert1",
        "pin": {
            "value": "3539",
            "length": 4
        },
        "claims": {
            "given_name": "Megan",
            "family_name": "Bowen"
        }
    }
}
```  

For the complete code, see one of the following code samples:

- [C#](https://github.com/Azure-Samples/active-directory-verifiable-credentials-dotnet/blob/main/1-asp-net-core-api-idtokenhint/IssuerController.cs)
- [Node.js](https://github.com/Azure-Samples/active-directory-verifiable-credentials-node/blob/main/1-node-api-idtokenhint/issuer.js)

## Presentation request example

The following example demonstrates a verifiable credentials presentation request. For information about the payload, see [Request Service REST API presentation specification](presentation-request-api.md).

```http
POST https://beta.did.msidentity.com/v1.0/contoso.onmicrosoft.com/verifiablecredentials/request
Content-Type: application/json
Authorization: Bearer  <token>

{
  "includeQRCode": true,
  "callback": {
    "url": "https://www.contoso.com/api/verifier/presentationCallback",
    "state": "92d076dd-450a-4247-aa5b-d2e75a1a5d58",
    "headers": {
      "api-key": "OPTIONAL API-KEY for VERIFIER CALLBACK API"
    }
  },
  "authority": "did:ion:EiCLL8lzCqlGLYTGbjwgR6SN6OkIjO6uUKyF5zM7fQZ8Jg:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJzaWdfOTAyZmM2NmUiLCJwdWJsaWNLZXlKd2siOnsiY3J2Ijoic2VjcDI1NmsxIiwia3R5IjoiRUMiLCJ4IjoiTEdUOWk3aFYzN1dUcFhHcUg5c1VDekxTVlFWcVl3S2JNY1Fsc0RILUZJUSIsInkiOiJiRWo5MDY...",
  "registration": {
    "clientName": "Veritable Credential Expert Verifier"
  },
  "presentation": {
    "includeReceipt": true,
    "requestedCredentials": [
      {
        "type": "VerifiedCredentialExpert",
        "purpose": "So we can see that you a veritable credentials expert",
        "acceptedIssuers": [
          "did:ion:EiCLL8lzCqlGLYTGbjwgR6SN6OkIjO6uUKyF5zM7fQZ8Jg:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJzaWdfOTAyZmM2NmUiLCJwdWJsaWNLZXlKd2siOnsiY3J2Ijoic2VjcDI1NmsxIiwia3R5IjoiRUMiLCJ4IjoiTEdUOWk3aFYzN1dUcFhHcUg5c1VDekxTVlFWcVl3S2JNY1Fsc0RILUZJUSIsInkiO..."
        ]
      }
    ]
  }
}
```

For the complete code, see one of the following code samples:

- [C#](https://github.com/Azure-Samples/active-directory-verifiable-credentials-dotnet/blob/main/1-asp-net-core-api-idtokenhint/VerifierController.cs) 
- [Node.js](https://github.com/Azure-Samples/active-directory-verifiable-credentials-node/blob/main/1-node-api-idtokenhint/verifier.js)

## Callback events

The request payload contains the [issuance](issuance-request-api.md#callback-events) and [presentation](presentation-request-api.md#callback-events) callback endpoint. The endpoint is part of your web application, and should be publicly available. Azure AD Verifiable Credentials calls your endpoint to inform your app on certain events. For example, such events might be when a user scans the QR code, uses the deep link the authenticator app, or finishes the presentation process.

The following diagram describes the call your app makes to the Request Service REST API, and the callbacks to your application.

![Diagram that describes the call to the API and the callback events.](media/get-started-request-api/callback-events.png)

Configure your endpoint to listen to incoming HTTP POST requests. The following code snippet demonstrates how to handle the issuance callback HTTP request, and how to update the UI accordingly:

# [HTTP](#tab/http)

Not applicable. Choose one of the other programming languages.

# [C#](#tab/csharp)

```csharp
[HttpPost]
public async Task<ActionResult> IssuanceCallback()
{
try
{
    string content = new System.IO.StreamReader(this.Request.Body).ReadToEndAsync().Result;
    _log.LogTrace("callback!: " + content);
    JObject issuanceResponse = JObject.Parse(content);
    
    // More code here
    if (issuanceResponse["code"].ToString() == "request_retrieved")
    {
        var cacheData = new
        {
            status = "request_retrieved",
            message = "QR Code is scanned. Waiting for issuance...",
        };
        _cache.Set(state, JsonConvert.SerializeObject(cacheData));

        // More code here
    }
}
```

For the complete code, see the [issuance](https://github.com/Azure-Samples/active-directory-verifiable-credentials-dotnet/blob/main/1-asp-net-core-api-idtokenhint/IssuerController.cs) and [presentation](https://github.com/Azure-Samples/active-directory-verifiable-credentials-dotnet/blob/main/1-asp-net-core-api-idtokenhint/IssuerController.cs) code on the GitHub repo.

# [Node.js](#tab/nodejs)

```nodejs
mainApp.app.post('/api/issuer/issuance-request-callback', parser, async (req, res) => {
  var body = '';
  req.on('data', function (data) {
    body += data;
  });
  req.on('end', function () {
    requestTrace( req );
    console.log( body );
    var issuanceResponse = JSON.parse(body.toString());
    var message = null;
    
    if ( issuanceResponse.code == "request_retrieved" ) {
      message = "QR Code is scanned. Waiting for issuance to complete...";
    }
    if ( issuanceResponse.code == "issuance_successful" ) {
      message = "Credential successfully issued";
    }
    if ( issuanceResponse.code == "issuance_error" ) {
      message = issuanceResponse.error.message;
    }
    
    // More code here
    res.send()
  });  
  res.send()
})
```

For the complete code, see the [issuance](https://github.com/Azure-Samples/active-directory-verifiable-credentials-node/blob/main/1-node-api-idtokenhint/issuer.js) and [presentation](https://github.com/Azure-Samples/active-directory-verifiable-credentials-node/blob/main/1-node-api-idtokenhint/verifier.js) code on the GitHub repo.

---

## Next steps

Learn more about these specifications:

- [Issuance API specification](issuance-request-api.md)
- [Presentation API specification](presentation-request-api.md)
