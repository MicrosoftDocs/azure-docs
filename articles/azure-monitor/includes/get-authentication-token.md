---
ms.service: azure-monitor
ms.topic: include
ms.date: 07/01/2024
ms.author: edbaynash
author: EdB-MSFT
---

Get an authentication token using any of the following methods:
- CLI
- REST API
- SDK

When requesting a token, you must provide a `resource` parameter. The `resource` parameter is the URL of the resource you want to access. 

Resources include:
- `https://management.azure.com`
- `https://api.loganalytics.io`
- `https://monitoring.azure.com` 


## [REST](#tab/rest)
### Get a token using a REST request
Use the following REST API call to get a token.
This request uses a client ID and client secret to authenticate the request. The client ID and client secret are obtained when you register your application with Microsoft Entra ID. For more information, see [Register an App to request authorization tokens and work with APIs](/azure/azure-monitor/logs/api/register-app-for-token?tabs=portal)


```console
curl -X POST 'https://login.microsoftonline.com/<tennant ID>/oauth2/token' \
-H 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'client_id=<your apps client ID>' \
--data-urlencode 'client_secret=<your apps client secret' \
--data-urlencode 'resource=https://monitoring.azure.com'
```

The response body appears in the following format:

```JSON
{
    "token_type": "Bearer",
    "expires_in": "86399",
    "ext_expires_in": "86399",
    "expires_on": "1672826207",
    "not_before": "1672739507",
    "resource": "https://monitoring.azure.com",
    "access_token": "eyJ0eXAiOiJKV1Qi....gpHWoRzeDdVQd2OE3dNsLIvUIxQ"
}
```

## [CLI](#tab/cli)
### Get a token using Azure CLI
To get a token using CLI, you can use the following command

```bash
az account get-access-token 
```

For more information, see [az account get-access-token](/cli/azure/account#az-account-get-access-token)

## [SDK](#tab/SDK)
### Get a token using the SDKs
The following code samples show how to get a token using:
+ C# 
+ NodeJS
+ Python

#### C#

The following code shows how to get a token using the Azure. Identity library It requires a client ID and client secret to authenticate the request. 
```csharp
var context = new AuthenticationContext("https://login.microsoftonline.com/<tennant ID>");
var clientCredential = new ClientCredential("<your apps client ID>", "<your apps client secret>");
var result = context.AcquireTokenAsync("https://monitoring.azure.com", clientCredential).Result;
```    

Alternatively, you can use the DefaultAzureCredential class to get a token. This method uses the default Azure credentials to authenticate the request and doesn't require a client ID or client secret.

```csharp
var credential = new DefaultAzureCredential();
var token = credential.GetToken(new TokenRequestContext(new[] { "https://management.azure.com/.default" }));
```


You can also specify your managed identity or service principal credentials as follows:

```csharp
string userAssignedClientId = "<your managed identity client ID>";
var credential = new DefaultAzureCredential(
    new DefaultAzureCredentialOptions
    {
        ManagedIdentityClientId = userAssignedClientId
    });

var token = credential.GetToken(new TokenRequestContext(new[] { "https://management.azure.com/.default" }));

```
For more information, see [DefaultAzureCredential Class](/dotnet/api/azure.identity.defaultazurecredential?view=azure-dotnet)


#### Node.js

For information on authentication use JavaScript and NodeJS,  see [How to authenticate JavaScript apps to Azure services using the Azure SDK for JavaScript](/azure/developer/javascript/sdk/authentication/overview)


The following code shows how to get a token using the DefaultAzureCredential class. This method uses the default Azure credentials to authenticate the request and doesn't require a client ID or client secret.

```javascript
const { DefaultAzureCredential } = require("@azure/identity");

const credential = new DefaultAzureCredential();
const accessToken = await credential.getToken("https://management.azure.com/.default");
```

You can also use the `InteractiveBrowserCredential` class to get the credentials. This method provides a browser-based authentication experience for users to authenticate with Azure services. 

For more information, see [DefaultAzureCredential Class](/javascript/api/@azure/identity/defaultazurecredential?view=azure-node-latest) and [InteractiveBrowserCredential Class](/javascript/api/@azure/identity/interactivebrowsercredential?view=azure-node-latest)

Alternatively you can use the ClientSecretCredential class to get a token. This method requires a client ID and client secret to authenticate the request.

```javascript
const { ClientSecretCredential } = require("@azure/identity");
credential = ClientSecretCredential(
    client_id="<client_id>",
    username="<username>",
    password="<password>"
   )
const accessToken = await credential.getToken("https://management.azure.com/.default");
```
For more information, see [ClientSecretCredential Class](/javascript/api/@azure/identity/clientsecretcredential?view=azure-node-latest)

#### Python

The following code shows how to get a token using the DefaultAzureCredential class. This method uses the default Azure credentials to authenticate the request and doesn't require a client ID or client secret.

```python
from azure.identity import DefaultAzureCredential

credential = DefaultAzureCredential()
token = credential.get_token('https://management.azure.com/.default')
print(token.token)
```

You can also use the `InteractiveBrowserCredential` class to get the credentials. This method provides a browser-based authentication experience for users to authenticate with Azure services. 

For more information, see [DefaultAzureCredential Class](/python/api/azure-identity/azure.identity.defaultazurecredential?view=azure-python) and [InteractiveBrowserCredential Class](/python/api/azure-identity/azure.identity.interactivebrowsercredential?view=azure-python)

Alternatively you can use the ClientSecretCredential class to get a token. This method requires a client ID and client secret to authenticate the request.

```python
from azure.identity import ClientSecretCredential

credential = ClientSecretCredential (
     tenant_id="<tenant id>",
     client_id="<Client id>",
     client_secret="client secret"
    )
token =  credential.get_token("https://management.azure.com/.default")
print(token.token)
```

 For more information, see [ClientSecretCredential Class](/python/api/azure-identity/azure.identity.clientsecretcredential?view=azure-python)

---