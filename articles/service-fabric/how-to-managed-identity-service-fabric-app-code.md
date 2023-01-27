---
title: Use managed identity with an application
description: How to use managed identities in Azure Service Fabric application code to access Azure Services.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# How to leverage a Service Fabric application's managed identity to access Azure services

Service Fabric applications can leverage managed identities to access other Azure resources which support Azure Active Directory-based authentication. An application can obtain an [access token](../active-directory/develop/developer-glossary.md#access-token) representing its identity, which may be system-assigned or user-assigned, and use it as a 'bearer' token to authenticate itself to another service - also known as a [protected resource server](../active-directory/develop/developer-glossary.md#resource-server). The token represents the identity assigned to the Service Fabric application, and will only be issued to Azure resources (including SF applications) which share that identity. Refer to the [managed identity overview](../active-directory/managed-identities-azure-resources/overview.md) documentation for a detailed description of managed identities, as well as the distinction between system-assigned and user-assigned identities. We will refer to a managed-identity-enabled Service Fabric application as the [client application](../active-directory/develop/developer-glossary.md#client-application) throughout this article.

See a companion sample application that demonstrates using system-assigned and user-assigned [Service Fabric application managed identities](https://github.com/Azure-Samples/service-fabric-managed-identity) with Reliable Services and containers.

> [!IMPORTANT]
> A managed identity represents the association between an Azure resource and a service principal in the corresponding Azure AD tenant associated with the subscription containing the resource. As such, in the context of Service Fabric, managed identities are only supported for applications deployed as Azure resources. 

> [!IMPORTANT]
> Prior to using the managed identity of a Service Fabric application, the client application must be granted access to the protected resource. Please refer to the list of [Azure services which support Azure AD authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-managed-identities-for-azure-resources)
 to check for support, and then to the respective service's documentation for specific steps to grant an identity access to resources of interest. 

## Leverage a managed identity using Azure.Identity

The Azure Identity SDK now supports Service Fabric. Using Azure.Identity makes writing code to use Service Fabric app managed identities easier because it handles fetching tokens, caching tokens, and server authentication. While accessing most Azure resources, the concept of a token is hidden.

Service Fabric support is available in the following versions for these languages: 
- [C# in version 1.3.0](https://www.nuget.org/packages/Azure.Identity). See a [C# sample](https://github.com/Azure-Samples/service-fabric-managed-identity).
- [Python in version 1.5.0](https://pypi.org/project/azure-identity/). See a [Python sample](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/identity/azure-identity/tests/managed-identity-live/service-fabric/service_fabric.md).
- [Java in version 1.2.0](/java/api/overview/azure/identity-readme).

C# sample of initializing credentials and using the credentials to fetch a secret from Azure Key Vault:

```csharp
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

namespace MyMIService
{
    internal sealed class MyMIService : StatelessService
    {
        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            try
            {
                // Load the service fabric application managed identity assigned to the service
                ManagedIdentityCredential creds = new ManagedIdentityCredential();

                // Create a client to keyvault using that identity
                SecretClient client = new SecretClient(new Uri("https://mykv.vault.azure.net/"), creds);

                // Fetch a secret
                KeyVaultSecret secret = (await client.GetSecretAsync("mysecret", cancellationToken: cancellationToken)).Value;
            }
            catch (CredentialUnavailableException e)
            {
                // Handle errors with loading the Managed Identity
            }
            catch (RequestFailedException)
            {
                // Handle errors with fetching the secret
            }
            catch (Exception e)
            {
                // Handle generic errors
            }
        }
    }
}

```

## Acquiring an access token using REST API
In clusters enabled for managed identity, the Service Fabric runtime exposes a localhost endpoint which applications can use to obtain access tokens. The endpoint is available on every node of the cluster, and is accessible to all entities on that node. Authorized callers may obtain access tokens by calling this endpoint and presenting an authentication code; the code is generated by the Service Fabric runtime for each distinct service code package activation, and is bound to the lifetime of the process hosting that service code package.

Specifically, the environment of a managed-identity-enabled Service Fabric service will be seeded with the following variables:
- 'IDENTITY_ENDPOINT': the localhost endpoint corresponding to service's managed identity
- 'IDENTITY_HEADER': a unique authentication code representing the service on the current node
- 'IDENTITY_SERVER_THUMBPRINT': Thumbprint of service fabric managed identity server

> [!IMPORTANT]
> The application code should consider the value of the 'IDENTITY_HEADER' environment variable as sensitive data - it should not be logged or otherwise disseminated. The authentication code has no value outside of the local node, or after the process hosting the service has terminated, but it does represent the identity of the Service Fabric service, and so should be treated with the same precautions as the access token itself.

To obtain a token, the client performs the following steps:
- forms a URI by concatenating the managed identity endpoint (IDENTITY_ENDPOINT value) with the API version and the resource (audience) required for the token
- creates a GET http(s) request for the specified URI
- adds appropriate server certificate validation logic
- adds the authentication code (IDENTITY_HEADER value) as a header to the request
- submits the request

A successful response will contain a JSON payload representing the resulting access token, as well as metadata describing it. A failed response will also include an explanation of the failure. See below for additional details on error handling.

Access tokens will be cached by Service Fabric at various levels (node, cluster, resource provider service), so a successful response does not necessarily imply that the token was issued directly in response to the user application's request. Tokens will be cached for less than their lifetime, and so an application is guaranteed to receive a valid token. It is recommended that the application code caches itself any access tokens it acquires; the caching key should include (a derivation of) the audience. 

Sample request:
```http
GET 'https://localhost:2377/metadata/identity/oauth2/token?api-version=2019-07-01-preview&resource=https://vault.azure.net/' HTTP/1.1 Secret: 912e4af7-77ba-4fa5-a737-56c8e3ace132
```
where:

| Element | Description |
| ------- | ----------- |
| `GET` | The HTTP verb, indicating you want to retrieve data from the endpoint. In this case, an OAuth access token. | 
| `https://localhost:2377/metadata/identity/oauth2/token` | The managed identity endpoint for Service Fabric applications, provided via the IDENTITY_ENDPOINT environment variable. |
| `api-version` | A query string parameter, specifying the API version of the Managed Identity Token Service; currently the only accepted value is `2019-07-01-preview`, and is subject to change. |
| `resource` | A query string parameter, indicating the App ID URI of the target resource. This will be reflected as the `aud` (audience) claim of the issued token. This example requests a token to access Azure Key Vault, whose an App ID URI is https:\//vault.azure.net/. |
| `Secret` | An HTTP request header field, required by the Service Fabric Managed Identity Token Service for Service Fabric services to authenticate the caller. This value is provided by the SF runtime via IDENTITY_HEADER environment variable. |


Sample response:
```json
HTTP/1.1 200 OK
Content-Type: application/json
{
    "token_type":  "Bearer",
    "access_token":  "eyJ0eXAiO...",
    "expires_on":  1565244611,
    "resource":  "https://vault.azure.net/"
}
```
where:

| Element | Description |
| ------- | ----------- |
| `token_type` | The type of token; in this case, a "Bearer" access token, which means the presenter ('bearer') of this token is the intended subject of the token. |
| `access_token` | The requested access token. When calling a secured REST API, the token is embedded in the `Authorization` request header field as a "bearer" token, allowing the API to authenticate the caller. | 
| `expires_on` | The timestamp of the expiration of the access token; represented as the number of seconds from "1970-01-01T0:0:0Z UTC" and corresponds to the token's `exp` claim. In this case, the token expires on 2019-08-08T06:10:11+00:00 (in RFC 3339)|
| `resource` | The resource for which the access token was issued, specified via the `resource` query string parameter of the request; corresponds to the token's 'aud' claim. |


## Acquiring an access token using C#
The above becomes, in C#:

```C#
namespace Azure.ServiceFabric.ManagedIdentity.Samples
{
    using System;
    using System.Net.Http;
    using System.Text;
    using System.Threading;
    using System.Threading.Tasks;
    using System.Web;
    using Newtonsoft.Json;

    /// <summary>
    /// Type representing the response of the SF Managed Identity endpoint for token acquisition requests.
    /// </summary>
    [JsonObject]
    public sealed class ManagedIdentityTokenResponse
    {
        [JsonProperty(Required = Required.Always, PropertyName = "token_type")]
        public string TokenType { get; set; }

        [JsonProperty(Required = Required.Always, PropertyName = "access_token")]
        public string AccessToken { get; set; }

        [JsonProperty(PropertyName = "expires_on")]
        public string ExpiresOn { get; set; }

        [JsonProperty(PropertyName = "resource")]
        public string Resource { get; set; }
    }

    /// <summary>
    /// Sample class demonstrating access token acquisition using Managed Identity.
    /// </summary>
    public sealed class AccessTokenAcquirer
    {
        /// <summary>
        /// Acquire an access token.
        /// </summary>
        /// <returns>Access token</returns>
        public static async Task<string> AcquireAccessTokenAsync()
        {
            var managedIdentityEndpoint = Environment.GetEnvironmentVariable("IDENTITY_ENDPOINT");
            var managedIdentityAuthenticationCode = Environment.GetEnvironmentVariable("IDENTITY_HEADER");
            var managedIdentityServerThumbprint = Environment.GetEnvironmentVariable("IDENTITY_SERVER_THUMBPRINT");
            // Latest api version, 2019-07-01-preview is still supported.
            var managedIdentityApiVersion = Environment.GetEnvironmentVariable("IDENTITY_API_VERSION");
            var managedIdentityAuthenticationHeader = "secret";
            var resource = "https://management.azure.com/";

            var requestUri = $"{managedIdentityEndpoint}?api-version={managedIdentityApiVersion}&resource={HttpUtility.UrlEncode(resource)}";

            var requestMessage = new HttpRequestMessage(HttpMethod.Get, requestUri);
            requestMessage.Headers.Add(managedIdentityAuthenticationHeader, managedIdentityAuthenticationCode);
            
            var handler = new HttpClientHandler();
            handler.ServerCertificateCustomValidationCallback = (httpRequestMessage, cert, certChain, policyErrors) =>
            {
                // Do any additional validation here
                if (policyErrors == SslPolicyErrors.None)
                {
                    return true;
                }
                return 0 == string.Compare(cert.GetCertHashString(), managedIdentityServerThumbprint, StringComparison.OrdinalIgnoreCase);
            };

            try
            {
                var response = await new HttpClient(handler).SendAsync(requestMessage)
                    .ConfigureAwait(false);

                response.EnsureSuccessStatusCode();

                var tokenResponseString = await response.Content.ReadAsStringAsync()
                    .ConfigureAwait(false);

                var tokenResponseObject = JsonConvert.DeserializeObject<ManagedIdentityTokenResponse>(tokenResponseString);

                return tokenResponseObject.AccessToken;
            }
            catch (Exception ex)
            {
                string errorText = String.Format("{0} \n\n{1}", ex.Message, ex.InnerException != null ? ex.InnerException.Message : "Acquire token failed");

                Console.WriteLine(errorText);
            }

            return String.Empty;
        }
    } // class AccessTokenAcquirer
} // namespace Azure.ServiceFabric.ManagedIdentity.Samples
```
## Accessing Key Vault from a Service Fabric application using Managed Identity
This sample builds on the above to demonstrate accessing a secret stored in a Key Vault using managed identity.

```C#
        /// <summary>
        /// Probe the specified secret, displaying metadata on success.  
        /// </summary>
        /// <param name="vault">vault name</param>
        /// <param name="secret">secret name</param>
        /// <param name="version">secret version id</param>
        /// <returns></returns>
        public async Task<string> ProbeSecretAsync(string vault, string secret, string version)
        {
            // initialize a KeyVault client with a managed identity-based authentication callback
            var kvClient = new Microsoft.Azure.KeyVault.KeyVaultClient(new Microsoft.Azure.KeyVault.KeyVaultClient.AuthenticationCallback((a, r, s) => { return AuthenticationCallbackAsync(a, r, s); }));

            Log(LogLevel.Info, $"\nRunning with configuration: \n\tobserved vault: {config.VaultName}\n\tobserved secret: {config.SecretName}\n\tMI endpoint: {config.ManagedIdentityEndpoint}\n\tMI auth code: {config.ManagedIdentityAuthenticationCode}\n\tMI auth header: {config.ManagedIdentityAuthenticationHeader}");
            string response = String.Empty;

            Log(LogLevel.Info, "\n== {DateTime.UtcNow.ToString()}: Probing secret...");
            try
            {
                var secretResponse = await kvClient.GetSecretWithHttpMessagesAsync(vault, secret, version)
                    .ConfigureAwait(false);

                if (secretResponse.Response.IsSuccessStatusCode)
                {
                    // use the secret: secretValue.Body.Value;
                    response = String.Format($"Successfully probed secret '{secret}' in vault '{vault}': {PrintSecretBundleMetadata(secretResponse.Body)}");
                }
                else
                {
                    response = String.Format($"Non-critical error encountered retrieving secret '{secret}' in vault '{vault}': {secretResponse.Response.ReasonPhrase} ({secretResponse.Response.StatusCode})");
                }
            }
            catch (Microsoft.Rest.ValidationException ve)
            {
                response = String.Format($"encountered REST validation exception 0x{ve.HResult.ToString("X")} trying to access '{secret}' in vault '{vault}' from {ve.Source}: {ve.Message}");
            }
            catch (KeyVaultErrorException kvee)
            {
                response = String.Format($"encountered KeyVault exception 0x{kvee.HResult.ToString("X")} trying to access '{secret}' in vault '{vault}': {kvee.Response.ReasonPhrase} ({kvee.Response.StatusCode})");
            }
            catch (Exception ex)
            {
                // handle generic errors here
                response = String.Format($"encountered exception 0x{ex.HResult.ToString("X")} trying to access '{secret}' in vault '{vault}': {ex.Message}");
            }

            Log(LogLevel.Info, response);

            return response;
        }

        /// <summary>
        /// KV authentication callback, using the application's managed identity.
        /// </summary>
        /// <param name="authority">The expected issuer of the access token, from the KV authorization challenge.</param>
        /// <param name="resource">The expected audience of the access token, from the KV authorization challenge.</param>
        /// <param name="scope">The expected scope of the access token; not currently used.</param>
        /// <returns>Access token</returns>
        public async Task<string> AuthenticationCallbackAsync(string authority, string resource, string scope)
        {
            Log(LogLevel.Verbose, $"authentication callback invoked with: auth: {authority}, resource: {resource}, scope: {scope}");
            var encodedResource = HttpUtility.UrlEncode(resource);

            // This sample does not illustrate the caching of the access token, which the user application is expected to do.
            // For a given service, the caching key should be the (encoded) resource uri. The token should be cached for a period
            // of time at most equal to its remaining validity. The 'expires_on' field of the token response object represents
            // the number of seconds from Unix time when the token will expire. You may cache the token if it will be valid for at
            // least another short interval (1-10s). If its expiration will occur shortly, don't cache but still return it to the 
            // caller. The MI endpoint will not return an expired token.
            // Sample caching code:
            //
            // ManagedIdentityTokenResponse tokenResponse;
            // if (responseCache.TryGetCachedItem(encodedResource, out tokenResponse))
            // {
            //     Log(LogLevel.Verbose, $"cache hit for key '{encodedResource}'");
            //
            //     return tokenResponse.AccessToken;
            // }
            //
            // Log(LogLevel.Verbose, $"cache miss for key '{encodedResource}'");
            //
            // where the response cache is left as an exercise for the reader. MemoryCache is a good option, albeit not yet available on .net core.

            var requestUri = $"{config.ManagedIdentityEndpoint}?api-version={config.ManagedIdentityApiVersion}&resource={encodedResource}";
            Log(LogLevel.Verbose, $"request uri: {requestUri}");

            var requestMessage = new HttpRequestMessage(HttpMethod.Get, requestUri);
            requestMessage.Headers.Add(config.ManagedIdentityAuthenticationHeader, config.ManagedIdentityAuthenticationCode);
            Log(LogLevel.Verbose, $"added header '{config.ManagedIdentityAuthenticationHeader}': '{config.ManagedIdentityAuthenticationCode}'");

            var response = await httpClient.SendAsync(requestMessage)
                .ConfigureAwait(false);
            Log(LogLevel.Verbose, $"response status: success: {response.IsSuccessStatusCode}, status: {response.StatusCode}");

            response.EnsureSuccessStatusCode();

            var tokenResponseString = await response.Content.ReadAsStringAsync()
                .ConfigureAwait(false);

            var tokenResponse = JsonConvert.DeserializeObject<ManagedIdentityTokenResponse>(tokenResponseString);
            Log(LogLevel.Verbose, "deserialized token response; returning access code..");

            // Sample caching code (continuation):
            // var expiration = DateTimeOffset.FromUnixTimeSeconds(Int32.Parse(tokenResponse.ExpiresOn));
            // if (expiration > DateTimeOffset.UtcNow.AddSeconds(5.0))
            //    responseCache.AddOrUpdate(encodedResource, tokenResponse, expiration);

            return tokenResponse.AccessToken;
        }

        private string PrintSecretBundleMetadata(SecretBundle bundle)
        {
            StringBuilder strBuilder = new StringBuilder();

            strBuilder.AppendFormat($"\n\tid: {bundle.Id}\n");
            strBuilder.AppendFormat($"\tcontent type: {bundle.ContentType}\n");
            strBuilder.AppendFormat($"\tmanaged: {bundle.Managed}\n");
            strBuilder.AppendFormat($"\tattributes:\n");
            strBuilder.AppendFormat($"\t\tenabled: {bundle.Attributes.Enabled}\n");
            strBuilder.AppendFormat($"\t\tnbf: {bundle.Attributes.NotBefore}\n");
            strBuilder.AppendFormat($"\t\texp: {bundle.Attributes.Expires}\n");
            strBuilder.AppendFormat($"\t\tcreated: {bundle.Attributes.Created}\n");
            strBuilder.AppendFormat($"\t\tupdated: {bundle.Attributes.Updated}\n");
            strBuilder.AppendFormat($"\t\trecoveryLevel: {bundle.Attributes.RecoveryLevel}\n");

            return strBuilder.ToString();
        }

        private enum LogLevel
        {
            Info,
            Verbose
        };

        private void Log(LogLevel level, string message)
        {
            if (level != LogLevel.Verbose
                || config.DoVerboseLogging)
            {
                Console.WriteLine(message);
            }
        }

```

## Error handling
The 'status code' field of the HTTP response header indicates the success status of the request; a '200 OK' status indicates success, and the response will include the access token as described above. Following are a short enumeration of possible error responses.

| Status Code | Error Reason | How To Handle |
| ----------- | ------------ | ------------- |
| 404 Not found. | Unknown authentication code, or the application was not assigned a managed identity. | Rectify the application setup or token acquisition code. |
| 429 Too many requests. |  Throttle limit reached, imposed by AAD or SF. | Retry with Exponential Backoff. See guidance below. |
| 4xx Error in request. | One or more of the request parameters was incorrect. | Do not retry.  Examine the error details for more information.  4xx errors are design-time errors.|
| 5xx Error from service. | The managed identity subsystem or Azure Active Directory returned a transient error. | It is safe to retry after a short while. You may hit a throttling condition (429) upon retrying.|

If an error occurs, the corresponding HTTP response body contains a JSON object with the error details:

| Element | Description |
| ------- | ----------- |
| code | Error code. |
| correlationId | A correlation ID that can be used for debugging. |
| message | Verbose description of error. **Error descriptions can change at any time. Do not depend on the error message itself.**|

Sample error:
```json
{"error":{"correlationId":"7f30f4d3-0f3a-41e0-a417-527f21b3848f","code":"SecretHeaderNotFound","message":"Secret is not found in the request headers."}}
```

Following is a list of typical Service Fabric errors specific to managed identities:

| Code | Message | Description | 
| ----------- | ----- | ----------------- |
| SecretHeaderNotFound | Secret is not found in the request headers. | The authentication code was not provided with the request. | 
| ManagedIdentityNotFound | Managed identity not found for the specified application host. | The application has no identity, or the authentication code is unknown. |
| ArgumentNullOrEmpty | The parameter 'resource' should not be null or empty string. | The resource (audience) was not provided in the request. |
| InvalidApiVersion | The api-version '' is not supported. Supported version is '2019-07-01-preview'. | Missing or unsupported API version specified in the request URI. |
| InternalServerError | An error occurred. | An error was encountered in the managed identity subsystem, possibly outside of the Service Fabric stack. Most likely cause is an incorrect value specified for the resource (check for trailing '/'?) | 

## Retry guidance 

Typically the only retryable error code is 429 (Too Many Requests); internal server errors/5xx error codes may be retryable, though the cause may be permanent. 

Throttling limits apply to the number of calls made to the managed identity subsystem - specifically the 'upstream' dependencies (the Managed Identity Azure service, or the secure token service). Service Fabric caches tokens at various levels in the pipeline, but given the distributed nature of the involved components, the caller may experience inconsistent throttling responses (i.e. get throttled on one node/instance of an application, but not on a different node while requesting a token for the same identity.) When the throttling condition is set, subsequent requests from the same application may fail with the HTTP status code 429 (Too Many Requests) until the condition is cleared.  

It is recommended that requests failed due to throttling are retried with an exponential backoff, as follows: 

| Call index | Action on receiving 429 | 
| --- | --- | 
| 1 | Wait 1 second and retry |
| 2 | Wait 2 seconds and retry |
| 3 | Wait 4 seconds and retry |
| 4 | Wait 8 seconds and retry |
| 4 | Wait 8 seconds and retry |
| 5 | Wait 16 seconds and retry |

## Resource IDs for Azure services
See [Azure services that support Azure AD authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md) for a list of resources that support Azure AD, and their respective resource IDs.

## Next steps
* [Deploy a Service Fabric application with Managed Identity to a managed cluster](how-to-managed-cluster-application-managed-identity.md)
* [Deploy a Service Fabric application with a system-assigned Managed Identity to a classic cluster](./how-to-deploy-service-fabric-application-system-assigned-managed-identity.md)
* [Deploy a Service Fabric application with a user-assigned Managed Identity to a classic cluster](./how-to-deploy-service-fabric-application-user-assigned-managed-identity.md)
* [Granting a Service Fabric application's Managed Identity access to Azure resources](./how-to-grant-access-other-resources.md)
* [Explore a sample application using Service Fabric Managed Identity](https://github.com/Azure-Samples/service-fabric-managed-identity)