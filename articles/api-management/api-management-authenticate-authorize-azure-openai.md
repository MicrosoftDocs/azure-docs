---
title: Authenticate to Azure OpenAI API - Azure API Management
titleSuffix: Azure API Management
description: Options to authenticate and authorize to Azure OpenAI APIs using Azure API Management. Includes API key, managed identity, and OAuth 2.0 authorization.
author: dlepow
ms.service: api-management
ms.topic: article
ms.date: 02/16/2024
ms.author: danlep
---

# Authenticate and authorize access to Azure OpenAI APIs using Azure API Management 

In this article, you'll learn about ways to authenticate and authorize to Azure OpenAI API endpoints that are managed using Azure API Management. This article shows the following common methods:

* **Authentication** - Authenticate to an Azure OpenAI API using either API key authentication or a Microsoft Entra ID managed identity 

* **Authorization** - Enable more fine-grained access control to an Azure OpenAI API using OAuth 2.0 authorization with Microsoft Entra ID or another identity provider

For background, see:

* [Azure OpenAI Service REST API reference](/azure/ai-services/openai/reference)

* [Authentication and authorization to APIs in API Management](authentication-authorization-overview.md).

## Prerequisites

Prior to following the steps in this article, you must have:

- An API Management instance. For example steps, see [Create an Azure API Management instance](get-started-create-service-instance.md).
- An Azure OpenAI resource and model added to your API Management instance. For example steps, see [Import an Azure OpenAI API from OpenAPI specification](openai-api-from-specification.md)
- Permissions to create an app registration in a Microsoft Entra tenant associated with your Azure subscription (for OAuth 2.0 authorization using Microsoft Entra ID)

## Authenticate with API key

A default way to authenticate to an Azure OpenAI API is by using an API key. For this type of authentication, all API requests must include a valid API key in the `api-key` HTTP header.

Following are steps to use this API key authentication method in your API Management instance:

1. Obtain an API key from the Azure OpenAI resource. In the Azure portal, find a key on the **Keys and Endpoint** page of the Azure OpenAI resource.

1. To protect the key, add it as a [named value](api-management-howto-properties.md) in your API Management instance. Add it as a secret, or optionally for more security, use a [key vault reference](api-management-howto-properties.md#key-vault-secrets).

1. Add the following `inbound` policy snippet to your API Management instance to authenticate requests to the Azure OpenAI API using the API key. This policy snippet sets the `api-key` header with the named value that you set up. 

    In this example, the named value in API Management is *openai-api-key*.

    ```xml
    <set-header name="api-key" exists-action="override">
        <value>{{openai-api-key}}</value>
    </set-header>
    ```

## Authenticate with managed identity

An alternative way to authenticate to an Azure OpenAI API by using a managed identity in Microsoft Entra ID. For background, see
[How to configure Azure OpenAI Service with managed identity](../ai-services/openai/how-to/managed-identity.md).

Following are steps to configure your API Management instance to use a managed identity to authenticate requests to an Azure OpenAI API. 

1. [Enable](api-management-howto-use-managed-service-identity.md) a system-assigned or user-assigned managed identity for your API Management instance. The following example assumes that you've enabled the instance's system-assigned managed identity.

1. Assign the managed identity the **Cognitive Services OpenAI User** role, scoped to the appropriate resource. For example, assign the system-assigned managed identity the **Cognitive Services OpenAI User** role on the Azure OpenAI resource. For details, see [Role-based access control for Azure OpenAI service](../ai-services/openai/how-to/role-based-access-control.md).

1. Add the following `inbound` policy snippet in your API Management instance to authenticate requests to the Azure OpenAI API using the managed identity. 

    In this example:
    
    * The [`authentication-managed-identity`](authentication-managed-identity-policy.md) policy obtains an access token for the managed identity. 
    * The [`set-header`](set-header-policy.md) policy sets the `Authorization` header of the request with the access token. 

    ```xml
    <authentication-managed-identity resource="https://cognitiveservices.azure.com" output-token-variable-name="managed-id-access-token" ignore-error="false" /> 
    <set-header name="Authorization" exists-action="override"> 
        <value>@("Bearer " + (string)context.Variables["managed-id-access-token"])</value> 
    </set-header> 
    ```

### OAuth 2.0 authorization using identity provider

To enable more fine-grained access to OpenAPI APIs by particular users or clients, you can preauthorize access to the Azure OpenAI API using OAuth 2.0 authorization with Microsoft Entra ID or another identity provider. For background, see [Protect an API in Azure API Management using OAuth 2.0 authorization with Microsoft Entra ID](api-management-howto-protect-backend-with-aad.md).

> [!NOTE]
> Use OAuth 2.0 authorization as part of a defense-in-depth strategy. It's not a replacement for API key authentication or managed identity authentication to an Azure OpenAI API.

Following are high level steps to restrict API access to users or apps that are authorized using an identity provider.  

1. Create an application in your identity provider to represent the OpenAI API in Azure API Management. If you're using Microsoft Entra ID, [register](api-management-howto-protect-backend-with-aad.md#register-an-application-in-microsoft-entra-id-to-represent-the-api) an application in your Microsoft Entra ID tenant. Record details such as the application ID and the audience URI.

    As needed, configure the application to have roles or scopes that represent the fine-grained permissions needed to access the Azure OpenAI API.

1. Add an `inbound` policy snippet in your API Management instance to validate requests that present a JSON web token (JWT) in the `Authorization` header. Place this snippet *before* other `inbound` policies that you set to authenticate to the Azure OpenAI API. 

    > [!NOTE]
    > The following examples show the general structure of the policies to validate a JWT, but you must customize them to your identity provider and the requirements of your application and API.

    **validate-azure-ad-token** - If you use Microsoft Entra ID, configure the `validate-azure-ad-token` policy to validate the audience and claims in the JWT. For details, see the policy [reference](validate-azure-ad-token-policy.md).

        ```xml
        <validate-azure-ad-token tenant-id={{TENANT_ID}} header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
            <client-application-ids>
                    <application-id>{{CLIENT_APP_ID}}</application-id>
            </client-application-ids>
           <audiences>
                <audience>...</audience> 
            </audiences>
            <required-claims>
                <claim name=...>
                    <value>...</value>
                </claim>
            </required-claims>
        </validate-azure-ad-token>
        ```


    * **validate-jwt** - If you use another identity provider, configure the `validate-jwt` policy to validate the audience and claims in the JWT. For details, see the policy [reference](validate-jwt-policy.md).

        ```xml
        <validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
            <openid-config url={{OPENID_CONFIGURATION_URL}} />
            <issuers>
                <issuer>{{ISSUER_URL}}</issuer>
            </issuers>
            <audiences>
                <audience>...</audience> 
            </audiences>
            <required-claims>
                <claim name=...>
                    <value>...</value>
                </claim>
            </required-claims>
        </validate-jwt>
        ```
    
## Related content

* Learn more about [Microsoft Entra ID and OAuth2.0](../active-directory/develop/authentication-vs-authorization.md).
* [Manage users and groups assignment to an application](/entra/identity/enterprise-apps/assign-user-or-group-access-portal)  
* https://github.com/galiniliev/apim-azure-openai-sample
* [Authenticate requests to Azure AI services](../ai-services/authentication.md#authenticate-with-microsoft-entra-id)
* [Protect Azure OpenAI keys](/semantic-kernel/deploy/use-ai-apis-with-api-management?toc=%2Fazure%2Fapi-management%2Ftoc.json&bc=/azure/api-management/breadcrumb/toc.json)
* [Azure OpenAI Service as a central capability with Azure API Management](/samples/azure/enterprise-azureai/enterprise-azureai/)
