---
title: Access Azure resources from Google Cloud without credentials
description: Access Azure AD protected resources from a service running in Google Cloud without using secrets or certificates.  Use workload identity federation to set up a trust relationship between an app in Azure AD and an identity in Google Cloud. The workload running in Google Cloud can get an access token from Microsoft identity platform and access Azure AD protected resources.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 08/07/2022
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: udayh
#Customer intent: As an application developer, I want to create a trust relationship with a Google Cloud identity so my service in Google Cloud can access Azure AD protected resources without managing secrets.
---

# Access Azure AD protected resources from an app in Google Cloud

Software workloads running in Google Cloud need an Azure Active Directory (Azure AD) application to authenticate and access Azure AD protected resources. A common practice is to configure that application with credentials (a secret or certificate). The credentials are used by a Google Cloud workload to request an access token from Microsoft identity platform. These credentials pose a security risk and have to be stored securely and rotated regularly. You also run the risk of service downtime if the credentials expire.

[Workload identity federation](workload-identity-federation.md) allows you to access Azure AD protected resources from services running in Google Cloud without needing to manage secrets. Instead, you can configure your Azure AD application to trust a token issued by Google and exchange it for an access token from Microsoft identity platform.

## Create an app registration in Azure AD

[Create an app registration](quickstart-register-app.md) in Azure AD. 

Take note of the *object ID* of the app (not the application (client) ID) which you need in the following steps.  Go to the [list of registered applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) in the Azure portal, select your app registration, and find the **Object ID** in **Overview**->**Essentials**.

## Grant your app permissions to resources

Grant your app the permissions necessary to access the Azure AD protected resources targeted by your software workload running in Google Cloud.  For example, [assign the Storage Blob Data Contributor role](../../storage/blobs/assign-azure-role-data-access.md) to your app if your application needs to read, write, and delete blob data in [Azure Storage](../../storage/blobs/storage-blobs-introduction.md).

## Set up an identity in Google Cloud

You need an identity in Google Cloud that can be associated with your Azure AD application. A [service account](https://cloud.google.com/iam/docs/service-accounts), for example, used by an application or compute workload.  You can either use the default service account of your Cloud project or create a dedicated service account.

Each service account has a unique ID. When you visit the **IAM & Admin** page in the Google Cloud console, click on **Service Accounts**. Select the service account you plan to use, and copy its **Unique ID**.

:::image type="content" source="media/workload-identity-federation-create-trust-gcp/service-account-details.png" alt-text="Shows a screen shot of the Service Accounts page" border="true":::

Tokens issued by Google to the service account will have this **Unique ID** as the *subject* claim.

The *issuer* claim in the tokens will be `https://accounts.google.com`.

You need these claim values to configure a trust relationship with an Azure AD application, which allows your application to trust tokens issued by Google to your service account.

## Configure an Azure AD app to trust a Google Cloud identity

Configure a federated identity credential on your Azure AD application to set up the trust relationship. 

The most important fields for creating the federated identity credential are:

- *object ID*: the object ID of the app (not the application (client) ID) you previously registered in Azure AD.
- *subject*: must match the `sub` claim in the token issued by another identity provider, in this case Google. This is the Unique ID of the service account you plan to use.
- *issuer*: must match the `iss` claim in the token issued by the identity provider. A URL that complies with the [OIDC Discovery spec](https://openid.net/specs/openid-connect-discovery-1_0.html). Azure AD uses this issuer URL to fetch the keys that are necessary to validate the token. In the case of Google Cloud, the issuer is `https://accounts.google.com`.
- *audiences*: must match the `aud` claim in the token. For security reasons, you should pick a value that is unique for tokens meant for Azure AD. The Microsoft recommended value is `api://AzureADTokenExchange`.

The following command configures a federated identity credential:

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az ad app federated-credential create --id 41be38fd-caac-4354-aa1e-1fdb20e43bfa --parameters credential.json
("credential.json" contains the following content)
{
    "name": "GcpFederation",
    "issuer": "https://accounts.google.com",
    "subject": "112633961854638529490",
    "description": "Test GCP federation",
    "audiences": [
        "api://AzureADTokenExchange"
    ]
}
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzADappfederatedidentitycredential -ApplicationObjectId $appObjectId -Audience api://AzureADTokenExchange -Issuer 'https://accounts.google.com' -name 'GcpFederation' -Subject '112633961854638529490'
```
---

For more information and examples, see [Create a federated identity credential](workload-identity-federation-create-trust.md).

## Exchange a Google token for an access token

Now that you have configured the Azure AD application to trust the Google service account, you are ready to get a token from Google and exchange it for an access token from Microsoft identity platform.  This code runs in an application deployed to Google Cloud and running, for example, on [App Engine](https://cloud.google.com/appengine/docs/standard/).

### Get an ID token for your Google service account

As mentioned earlier, Google cloud resources such as App Engine automatically use the default service account of your Cloud project. You can also configure the app to use a different service account when you deploy your service. Your service can [request an ID token](https://cloud.google.com/compute/docs/instances/verifying-instance-identity#request_signature) for that service account from the metadata server that handles such requests. With this approach, you don't need any keys for your service account: these are all managed by Google.

# [TypeScript](#tab/typescript)
Here’s an example in TypeScript of how to request an ID token from the Google metadata server:

```typescript
async function getGoogleIDToken() {
    const headers = new Headers();

    headers.append("Metadata-Flavor", "Google ");

    let aadAudience = "api://AzureADTokenExchange";

    const endpoint="http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience="+ aadAudience;

    const options = {
            method: "GET",
            headers: headers,
        };

    return fetch(endpoint, options);
}
```

# [C#](#tab/csharp)
Here’s an example in C# of how to request an ID token from the Google metadata server:
```csharp
private string getGoogleIdToken()
{
    const string endpoint = "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=api://AzureADTokenExchange";
                
    var httpWebRequest = (HttpWebRequest)WebRequest.Create(endpoint);
    //httpWebRequest.ContentType = "application/json";
    httpWebRequest.Accept = "*/*";
    httpWebRequest.Method = "GET";
    httpWebRequest.Headers.Add("Metadata-Flavor", "Google ");

    var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();

    using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
    {
        string result = streamReader.ReadToEnd();
        return result;
    }
}
```

# [Java](#tab/java)
Here’s an example in Java of how to request an ID token from the Google metadata server:
```java
private String getGoogleIdToken() throws IOException {
    final String endpoint = "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=api://AzureADTokenExchange";

    URL url = new URL(endpoint);
    HttpURLConnection httpUrlConnection = (HttpURLConnection) url.openConnection();
    
    httpUrlConnection.setRequestMethod("GET");
    httpUrlConnection.setRequestProperty("Metadata-Flavor", "Google ");

    InputStream inputStream = httpUrlConnection.getInputStream();
    InputStreamReader inputStreamReader = new InputStreamReader(inputStream);
    BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
    StringBuffer content = new StringBuffer();
    String inputLine;

    while ((inputLine = bufferedReader.readLine()) != null)
        content.append(inputLine);

    bufferedReader.close();

    return content.toString();
}
```
---

> [!IMPORTANT]
> The *audience* here needs to match the *audiences* value you configured on your Azure AD application when [creating the federated identity credential](#configure-an-azure-ad-app-to-trust-a-google-cloud-identity).

### Exchange the identity token for an Azure AD access token

Now that your app running in Google Cloud has an identity token from Google, exchange it for an access token from Microsoft identity platform. Use the [Microsoft Authentication Library (MSAL)](msal-overview.md) to pass the Google token as a client assertion. The following MSAL versions support client assertions:
- [MSAL Go (Preview)](https://github.com/AzureAD/microsoft-authentication-library-for-go)
- [MSAL Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node)
- [MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet)
- [MSAL Python](https://github.com/AzureAD/microsoft-authentication-library-for-python)
- [MSAL Java](https://github.com/AzureAD/microsoft-authentication-library-for-java)

Using MSAL, you write a token class (implementing the `TokenCredential` interface) exchange the ID token.  The token class is used to with different client libraries to access Azure AD protected resources.

# [TypeScript](#tab/typescript)
The following TypeScript sample code snippet implements the `TokenCredential` interface, gets an ID token from Google (using the `getGoogleIDToken` method previously defined), and exchanges the ID token for an access token.

```typescript
const msal = require("@azure/msal-node");
import {TokenCredential, GetTokenOptions, AccessToken} from "@azure/core-auth"

class ClientAssertionCredential implements TokenCredential {

    constructor(clientID:string, tenantID:string, aadAuthority:string) {
        this.clientID = clientID;
        this.tenantID = tenantID;
        this.aadAuthority = aadAuthority;  // https://login.microsoftonline.com/
    }
    
    async getToken(scope: string | string[], _options?: GetTokenOptions):Promise<AccessToken> {

        var scopes:string[] = [];

        if (typeof scope === "string") {
            scopes[0]=scope;
        } else if (Array.isArray(scope)) {
            scopes = scope;
        }   

        // Get the ID token from Google.
        return getGoogleIDToken() // calling this directly just for clarity, 
                               // this should be a callback
        // pass this as a client assertion to the confidential client app
        .then((clientAssertion:any)=> {
            var msalApp: any;
            msalApp = new msal.ConfidentialClientApplication({
                auth: {
                    clientId: this.clientID,
                    authority: this.aadAuthority + this.tenantID,
                    clientAssertion: clientAssertion,
                }
            });
            return msalApp.acquireTokenByClientCredential({ scopes })
        })
        .then(function(aadToken) {
            // return in form expected by TokenCredential.getToken
            let returnToken = {
                token: aadToken.accessToken,
                expiresOnTimestamp: aadToken.expiresOn.getTime(),
            };
            return (returnToken);
        })
        .catch(function(error) {
            // error stuff
        });
    }
}
export default ClientAssertionCredential;
```

# [C#](#tab/csharp)

The following C# sample code snippet implements the `TokenCredential` interface, gets an ID token from Google (using the `getGoogleIDToken` method previously defined), and exchanges the ID token for an access token.

```csharp
using System;
using System.Threading.Tasks;
using Microsoft.Identity.Client;
using Azure.Core;
using System.Threading;
using System.Net;
using System.IO;

public class ClientAssertionCredential:TokenCredential
{
    private readonly string clientID;
    private readonly string tenantID;
    private readonly string aadAuthority;
                
    public ClientAssertionCredential(string clientID, string tenantID, string aadAuthority)
    {
        this.clientID = clientID;
        this.tenantID = tenantID;
        this.aadAuthority = aadAuthority;  // https://login.microsoftonline.com/                
    }

    public override AccessToken GetToken(TokenRequestContext requestContext, CancellationToken cancellationToken = default) {

        return GetTokenImplAsync(false, requestContext, cancellationToken).GetAwaiter().GetResult();
    }

    public override async ValueTask<AccessToken> GetTokenAsync(TokenRequestContext requestContext, CancellationToken cancellationToken = default)
    {
        return await GetTokenImplAsync(true, requestContext, cancellationToken).ConfigureAwait(false);
    }

    private async ValueTask<AccessToken> GetTokenImplAsync(bool async, TokenRequestContext requestContext, CancellationToken cancellationToken)
    {
        // calling this directly just for clarity, this should be a callback
        string idToken = getGoogleIdToken();
        
        try
        {
            // pass token as a client assertion to the confidential client app
            var app = ConfidentialClientApplicationBuilder.Create(this.clientID)
                                            .WithClientAssertion(idToken)
                                            .Build();

            var authResult = app.AcquireTokenForClient(requestContext.Scopes)
                .WithAuthority(this.aadAuthority + this.tenantID)
                .ExecuteAsync();                

            AccessToken token = new AccessToken(authResult.Result.AccessToken, authResult.Result.ExpiresOn);
            
            return token;
        }
        catch (Exception ex)
        {
            throw (ex);
        }        
    }    
}
```

# [Java](#tab/java)

The following Java sample code snippet implements the `TokenCredential` interface, gets an ID token from Google (using the `getGoogleIDToken` method previously defined), and exchanges the ID token for an access token.

```java
import java.io.Exception;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.HashSet;
import java.util.Set;

import com.azure.core.credential.AccessToken;
import com.azure.core.credential.TokenCredential;
import com.azure.core.credential.TokenRequestContext;
import com.microsoft.aad.msal4j.ClientCredentialFactory;
import com.microsoft.aad.msal4j.ClientCredentialParameters;
import com.microsoft.aad.msal4j.ConfidentialClientApplication;
import com.microsoft.aad.msal4j.IClientCredential;
import com.microsoft.aad.msal4j.IAuthenticationResult;
import reactor.core.publisher.Mono;

public class ClientAssertionCredential implements TokenCredential {
    private String clientID;
	private String tenantID;
    private String aadAuthority;

    public ClientAssertionCredential(String clientID, String tenantID, String aadAuthority)
    {
        this.clientID = clientID;
        this.tenantID = tenantID;
        this.aadAuthority = aadAuthority;  // https://login.microsoftonline.com/                
    }

    @Override
	public Mono<AccessToken> getToken(TokenRequestContext requestContext) {
        try {
			// Get the ID token from Google
            String idToken = getGoogleIdToken(); // calling this directly just for clarity, this should be a callback
            
			IClientCredential clientCredential = ClientCredentialFactory.createFromClientAssertion(idToken);
            String authority = String.format("%s%s", aadAuthority, tenantID);

            ConfidentialClientApplication app = ConfidentialClientApplication
                .builder(clientID, clientCredential)
                .authority(aadAuthority)
                .build();

            Set<String> scopes = new HashSet<String>(requestContext.getScopes());
		    ClientCredentialParameters clientCredentialParam = ClientCredentialParameters
				.builder(scopes)
				.build();

            IAuthenticationResult authResult = app.acquireToken(clientCredentialParam).get();
            Instant expiresOnInstant = authResult.expiresOnDate().toInstant();
            OffsetDateTime expiresOn = OffsetDateTime.ofInstant(expiresOnInstant, ZoneOffset.UTC);

            AccessToken accessToken = new AccessToken(authResult.accessToken(), expiresOn);

            return Mono.just(accessToken);
        } catch (Exception ex) {
			return Mono.error(ex);
		}
	}
}
```

---

## Access Azure AD protected resources

Your application running in Google Cloud now has an access token issued by Microsoft identity platform.  Use the access token to access the Azure AD protected resources that your Azure AD app has permissions to access.  As an example, here's how you can access Azure Blob storage using the `ClientAssertionCredential` token class and the Azure Blob Storage client library. When you make requests to the `BlobServiceClient` to access storage, the `BlobServiceClient` calls the `getToken` method on the `ClientAssertionCredential` object to get a fresh ID token and exchange it for an access token.  

# [TypeScript](#tab/typescript)

The following TypeScript example initializes a new `ClientAssertionCredential` object and then creates a new `BlobServiceClient` object.

```typescript
const { BlobServiceClient } = require("@azure/storage-blob");

var storageUrl = "https://<storageaccount>.blob.core.windows.net";
var clientID:any = "<client-id>";
var tenantID:any = "<tenant-id>";
var aadAuthority:any = "https://login.microsoftonline.com/";
var credential =  new ClientAssertionCredential(clientID,
                                                tenantID,
                                                aadAuthority);
                                             
const blobServiceClient  = new BlobServiceClient(storageUrl, credential);

// write code to access Blob storage
```

# [C#](#tab/csharp)

```csharp
string clientID = "<client-id>";
string tenantID = "<tenant-id>";
string authority = "https://login.microsoftonline.com/";
string storageUrl = "https://<storageaccount>.blob.core.windows.net";

var credential = new ClientAssertionCredential(clientID,
                            tenantID,
                            authority);

BlobServiceClient blobServiceClient = new BlobServiceClient(new Uri(storageUrl), credential);

// write code to access Blob storage
```

# [Java](#tab/java)

```java
String clientID = "<client-id>";
String tenantID = "<tenant-id>";
String authority = "https://login.microsoftonline.com/";
String storageUrl = "https://<storageaccount>.blob.core.windows.net";

ClientAssertionCredential credential = new ClientAssertionCredential(clientID, tenantID, authority);

BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
    .endpoint(storageUrl)
    .credential(credential)
    .buildClient();

// write code to access Blob storage
```

---

## Next steps

Learn more about [workload identity federation](workload-identity-federation.md).