---
title: REST API error codes - Azure Key Vault
description: These error codes could be returned by an operation on an Azure Key Vault web service.
keywords: 
services: machine-learning
author: msmbaldwin
ms.custom: seodec18
ms.author: mbaldwin

ms.service: key-vault
ms.topic: reference
ms.date: 12/16/2019
---
 
# Azure Key Vault REST API Error Codes
 
The following error codes could be returned by an operation on an Azure Key Vault web service.
 
## HTTP 401: Unauthenticated Request

401 means that the request is unauthenticated for Key Vault. 

A request is authenticated if:

- The key vault knows the identity of the caller; and
- The caller is allowed to try to access Key Vault resources. 

There are several different reason why a request may return 401.

### No authentication token attached to the request. 

Here is an example PUT request, setting the value of a secret:

``` 
PUT https://putreqexample.vault.azure.net//secrets/DatabaseRotatingPassword?api-version=7.0 HTTP/1.1
x-ms-client-request-id: 03d275a2-52a4-4bed-82c8-6fe15165affb
accept-language: en-US
Authorization: Bearer     eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5iQ3dXMTF3M1hrQi14VWFYd0tSU0xqTUhHUSIsImtpZCI6Im5iQ3dXMTF3M1hrQi14VWFYd0tSU0xqTUhHUSJ9.eyJhdWQiOiJodHRwczovL3ZhdWx0LmF6dXJlLm5ldCIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0Ny8iLCJpYXQiOjE1NDg2OTc1MTMsIm5iZiI6MTU0ODY5NzUxMywiZXhwIjoxNTQ4NzAxNDEzLCJhaW8iOiI0MkpnWUhoODVqaVBnZHF5ZlRGZE5TdHY3bGUvQkFBPSIsImFwcGlkIjoiZmFkN2Q1YjMtNjlkNi00YjQ4LTkyNTktOGQxMjEyNGUxY2YxIiwiYXBwaWRhY3IiOiIxIiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3LyIsIm9pZCI6IjM5NzVhZWVkLTdkMDgtNDUzYi1iNmY0LTQ0NWYzMjY5ODA5MSIsInN1YiI6IjM5NzVhZWVkLTdkMDgtNDUzYi1iNmY0LTQ0NWYzMjY5ODA5MSIsInRpZCI6IjcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0NyIsInV0aSI6IjItZ3JoUmtlSWs2QmVZLUxuNDJtQUEiLCJ2ZXIiOiIxLjAifQ.fgubiz1MKqTJTXI8dHIV7t9Fle6FdHrkaGYKcBeVRX1WtLVuk1QVxzIFDlZKLXJ7QPNs0KWpeiWQI9IWIRK-8wO38yCqKTfDlfHOiNWGOpkKddlG729KFqakVf2w0GPyGPFCONRDAR5wjQarN9Bt8I8YbHwZQz_M1hztlnv-Lmsk1jBmech9ujD9-lTMBmSfFFbHcqquev119V7sneI-zxBZLf8C0pIDkaXf1t8y6Xr8CUJDMdlWLslCf3pBCNIOy65_TyGvy4Z4AJryTPBarNBPwOkNAtjCfZ4BDc2KqUZM5QN_VK4foP64sVzUL6mSr0Gh7lQJIL5b1qIpJxjxyQ
User-Agent: FxVersion/4.7.3324.0 OSName/Windows OSVersion/6.2.9200.0 Microsoft.Azure.KeyVault.KeyVaultClient/3.0.3.0
Content-Type: application/json; charset=utf-8
Host: putreqexample.vault.azure.net
Content-Length: 31

{
   "value": "m*gBJ7$Zuoz)"
}
```

The "Authorization" header is the access token that is required with every call to the Key Vault for data-plane operations. If the header is missing, then the response must be 401.

### The token lacks the correct resource associated with it. 

When requesting an access token from the Azure OAUTH endpoint, a parameter called "resource" is mandatory. The value is important for the token provider because it scopes the token for its intended use. The resource for **all* tokens to access a Key Vault is <https:\//vault.keyvault.net> (with no trailing slash).

### The token is expired

Tokens are base64 encoded and the values can be decoded at websites such as [http://jwt.calebb.net](http://jwt.calebb.net). Here is the above token decoded:

```
	{
 typ: "JWT",
 alg: "RS256",
 x5t: "nbCwW11w3XkB-xUaXwKRSLjMHGQ",
 kid: "nbCwW11w3XkB-xUaXwKRSLjMHGQ"
}.
{
 aud: "https://vault.azure.net",
 iss: "https://sts.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47/",
 iat: 1548697513,
 nbf: 1548697513,
 exp: 1548701413,
 aio: "42JgYHh85jiPgdqyfTFdNStv7le/BAA=",
 appid: "fad7d5b3-69d6-4b48-9259-8d12124e1cf1",
 appidacr: "1",
 idp: "https://sts.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47/",
 oid: "3975aeed-7d08-453b-b6f4-445f32698091",
 sub: "3975aeed-7d08-453b-b6f4-445f32698091",
 tid: "72f988bf-86f1-41af-91ab-2d7cd011db47",
 uti: "2-grhRkeIk6BeY-Ln42mAA",
 ver: "1.0"
}.
[signature]
```

We can see many important parts in this token:

- aud (audience): The resource of the token. Notice that this is <https://vault.azure.net>. This token will NOT work for any resource that does not explicitly match this value, such as graph.
- iat (issued at): The number of ticks since the start of the epoch when the token was issued.
- nbf (not before): The number of ticks since the start of the epoch when this token becomes valid.
- exp (expiration): The number of ticks since the start of the epoch when this token expires.
- appid (application ID): The GUID for the application ID making this request.
- tid (tenant ID): The GUID for the tenant ID of the principal making this request

It is important that all of the values be properly identified in the token in order for the request to work. If everything is correct, then the request will not result in 401.

### Troubleshooting 401

401s should be investigated from the point of token generation, before the request is made to the key vault. Generally code is being used to request the token. Once the token is received, it is passed into the Key Vault request. If the code is running locally, you can use Fiddler to capture the request/response to https://login.microsoftonline.com. A request looks like this:

``` 
POST https://login.microsoftonline.com/<key vault tenant ID>/oauth2/token HTTP/1.1
Accept: application/json
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Host: login.microsoftonline.com
Content-Length: 192

resource=https%3A%2F%2Fvault.azure.net&client_id=<registered-app-ID>&client_secret=<registered-app-secret>&client_info=1&grant_type=client_credentials
```

The following user-supplied information mush be correct:

- The key vault tenant ID
- Resource value set to https%3A%2F%2Fvault.azure.net (URL encoded)
- Client ID
- Client secret

Ensure the rest of the request is nearly identical.

If you can only get the response access token, you can decode it (as shown above) to ensure the tenant ID, the client ID (app ID), and the resource.

## HTTP 403: Insufficient Permissions

HTTP 403 means that the request was authenticated (it knows the requesting identity) but the identity does not have permission to access the requested resource. There are two causes:

- There is no access policy for the identity.
- The IP address of the requesting resource is not whitelisted in the key vault's firewall settings.

HTTP 403 often occurs when the customer's application is not using the client ID that the customer thinks it is. That usually means that the access policies is not correctly set up for the actual calling identity.

### Troubleshooting 403

First, turn on logging. For instructions on how to do so, see [Azure Key Vault logging](key-vault-logging.md).

Once logging is turned on, you can determine if the 403 is due to access policy or firewall policy.

#### Error due to firewall policy

"Client address (00.00.00.00) is not authorized and caller is not a trusted service"

There is a limited list of "Azure Trusted Services". Azure Web Sites are **not** a Trusted Azure Service. For more information, see the blog post [Key Vault Firewall access by Azure App Services](https://azidentity.azurewebsites.net/post/2019/01/03/key-vault-firewall-access-by-azure-app-services).

You must add the IP address of the Azure Web Site to the Key Vault in order for it to work.

If due to access policy: find the object ID for the request and ensure that the object ID matches the object to which the user is trying to assign the access policy. There will often be multiple objects in the AAD which have the same name, so choosing the correct one is very important. By deleting and re-adding the access policy, it is possible to see if multiple objects exist with the same name.

In addition, most access policies do not require the use of the "Authorized application" as shown in the portal. Authorized application are used for "on-behalf-of" authentication scenarios, which are rare. 


## HTTP 429: Too Many Requests

Throttling occurs when the number of requests exceeds the stated maximum for the timeframe. If throttling occurs, the Key Vault's response will be HTTP 429. There are stated maximums for types of requests made. For instance: the creation of an HSM 2048-bit key is 5 requests per 10 seconds, but all other HSM transactions have a 1000 request/10 seconds limit. Therefore it is important to understand which types of calls are being made when determining the cause of throttling.
In general, requests to the Key Vault are limited to 2000 requests/10 seconds. Exceptions are Key Operations, as documented in [Key Vault service limits](key-vault-service-limits.md)

### Troubleshooting 429
Throttling is worked around using these techniques:

- Reduce number of requests made to the Key Vault by determining if there are patterns to a requested resource and attempting to cache them in the calling application. 

- When Key Vault throttling occurs, adapt the requesting code to use a exponential backoff for retrying. The algorithm is explained here: [How to throttle your app](key-vault-ovw-throttling.md#how-to-throttle-your-app-in-response-to-service-limits)

- If the number of requests cannot be reduced by caching and timed backoff does not work, then consider splitting the keys up into multiple Key Vaults. The service limit for a single subscription is 5x the individual Key Vault limit. If using more than 5 Key Vaults, consideration should be given to using multiple subscriptions. 

Detailed guidance including request to increase limits, can be find here: [Key Vault throttling guidance](key-vault-ovw-throttling.md)


