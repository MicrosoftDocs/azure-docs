---
title: Authenticate to Azure OpenAI API - Azure API Management
titleSuffix: Azure API Management
description: Configure authentication and authorization to Azure OpenAI endpoints using Azure API Management.
author: dlepow
ms.service: api-management
ms.topic: article
ms.date: 02/07/2024
ms.author: danlep
---

# Authenticate and authorize access to Azure OpenAI endpoints using Azure API Management 

In this article, you'll...

Azure OpenAI API [supports](/azure/ai-services/openai/reference) the following two authentication methods: API key authentication and Microsoft Entra ID authentication.




Learn more about [authentication and authorization to APIs in API Management](authentication-authorization-overview.md).

## Prerequisites

Prior to following the steps in this article, you must have:

- An API Management instance
- An Azure OpenAI ....
- A Microsoft Entra tenant (for OAuth 2.0 authorization using Microsoft Entra ID)



## Authenticate with API key

A default way to authenticate to an Azure OpenAI API is by using an API key. For this type of authentication, all API requests must include the API Key in the `api-key` HTTP header.

Following are steps to use the API key authentication method in your API Management instance:

1. Obtain an API key from the Azure OpenAI Service. 

1. To protect the key, add it as a [named value](api-management-howto-properties.md) in your API Management instance. Add it as a custom secret, or optionally for more security, use a [key vault reference](api-management-howto-properties.md#key-vault-secrets).

1. Add the following `inbound` policy snippet to your API Management instance to authenticate requests to the Azure OpenAI API using the API key. This policy snippet sets the `api-key` header with the named value that you set up. 

    In this example, the named value in API Management is *openai-api-key*.

    ```xml
    <set-header name="api-key" exists-action="override">
        <value>{{openai-api-key}}</value>
    </set-header>
    ```

## Authenticate with managed identity

You can also authenticate to an Azure OpenAI API by using a managed identity in Microsoft Entra ID. For background information, see
[How to configure Azure OpenAI Service with managed identity](../ai-services/openai/how-to/managed-identity.md).

Following are steps to configure your API Management instance to use a managed identity to access Azure OpenAI Service. 

1. [Enable](api-management-howto-use-managed-service-identity.md) a system-assigned or user-assigned managed identity for your API Management instance.

1. Assign the managed identity the **Cognitive Services OpenAI User** role, scoped to the appropriate resource. For example, assign the managed identity the **Cognitive Services OpenAI User** role on the Azure OpenAI Service. For details, see [Role-based access control for Azure OpenAI service](../ai-services/openai/how-to/role-based-access-control.md).

1. Add the following `inbound` policy snippet in your API Management instance to authenticate request to the Azure OpenAI API using the managed identity. 

    The [`authentication-managed-identity`](authentication-managed-identity-policy.md) policy obtains an access token for the managed identity, and the [`set-header`](set-header-policy.md) policy sets the `Authorization` header of the request with the access token. In this example, the API Management instance's system-assigned identity is used to access the Azure OpenAI Service.

    ```xml
    <authentication-managed-identity resource="https://cognitiveservices.azure.com" output-token-variable-name="managed-id-access-token" ignore-error="false" /> 
    <set-header name="Authorization" exists-action="override"> 
        <value>@("Bearer " + (string)context.Variables["managed-id-access-token"])</value> 
    </set-header> 
    ```

### OAuth 2.0 authorization using Microsoft Entra ID

To enable more fine-grained access to OpenAPI APIs by particular users or clients, you can preauthorize access to the Azure OpenAI API using OAuth 2.0 authorization with Microsoft Entra ID. 

For background, see [Protect an API in Azure API Management using OAuth 2.0 authorization with Microsoft Entra ID](api-management-howto-protect-backend-with-aad.md).

Following are steps to configure your API Management instance to use OAuth 2.0 authorization with Microsoft Entra ID to access an Azure OpenAI API. These example steps restrict API access to users or apps using a Microsoft Entra ID identity in the appropriate tenant, and that the identity is authorized for the Cognitive Services OAuth scope, which Azure OpenAI falls under.  

1. [Register](api-management-howto-protect-backend-with-aad.md#register-an-application-in-microsoft-entra-id-to-represent-the-api) an application in your Microsoft Entra ID tenant to represent the OpenAI API in Azure API Management.

    Configure the application to have roles, scopes, or claims that represent the permissions that the application needs to access the OpenAI API. For example, you can configure the application to have .

1. Add the following `inbound` policy snippet in your API Management instance to validate requests that present a JSON web token (JWT) in the `Authorization` header. 

    The [`validate-jwt`](validate-jwt-policy.md) policy validates the JWT in the `Authorization` header of the request. The policy checks that the token is intended for the Cognitive Services OAuth scope, which Azure OpenAI falls under, and that the token is issued by the tenant identified by the named value *TENANT_ID*. If the request doesn’t include a valid JWT, the user receives a `403` error.

    ```xml
    <validate-jwt header-name="Authorization" failed-validation-httpcode="403" failed-validation-error-message="Forbidden">
            <openid-config url="https://login.microsoftonline.com/{{TENANT_ID}}/v2.0/.well-known/openid-configuration" />
            <issuers>
                <issuer>https://sts.windows.net/{{TENANT_ID}}/</issuer>
            </issuers>
            <required-claims>
                <claim name="aud">
                    <value>https://cognitiveservices.azure.com</value>
                </claim>
            </required-claims>
    </validate-jwt>
    ```

    Alternatively, you can use the [`validate-azure-ad-token`](validate-azure-ad-token-policy.md) policy in the `inbound` section to validate the Microsoft Entra ID token provided with the request to the Azure OpenAI API. In this policy example, the Microsoft Entra ID tenant ID and the client application ID are specified as named values. 

    ```xml
    <validate-azure-ad-token tenant-id={{TENANT_ID}} header-name="Authorization" failed-validation-httpcode="403" failed-validation-error-message="Forbidden">
        <client-application-ids>
            <application-id>{{CLIENT_APP_ID}}</application-id>            
        </client-application-ids>
        <required-claims>
            <claim name="aud">
                <value>https://cognitiveservices.azure.com</value>
            </claim>
        </required-claims>
    </validate-azure-ad-token>
    ```


## Related content

* Learn more about [Microsoft Entra ID and OAuth2.0](../active-directory/develop/authentication-vs-authorization.md).
* [Manage users and groups assignment to an application](/entra/identity/enterprise-apps/assign-user-or-group-access-portal)  
* https://github.com/galiniliev/apim-azure-openai-sample
* [Authenticate requests to Azure AI services](../ai-services/authentication#authenticate-with-microsoft-entra-id.md)
* [](https://techcommunity.microsoft.com/t5/fasttrack-for-azure/protecting-apis-in-azure-api-management-using-oauth-2-0-client/ba-p/3054130)
* https://github.com/pascalvanderheiden/ais-apim-oauth-flow
* https://github.com/pascalvanderheiden/ais-apim-oauth-flow
