---
title: Authenticate with namespaces using webhook auth
description: This article shows you how to authenticate with Azure Event Grid namespace using webhook or Azure function. 
ms.topic: how-to
ms.custom:
  - build-2025
ms.date: 04/30/2025
author: Connected-Seth
ms.author: seshanmugam
---

# Authenticate with MQTT broker using custom webhook authentication (Preview)
This article shows how to authenticate with Azure Event Grid namespace using webhook or Azure function. 

Webhook authentication allows external HTTP endpoints (webhooks or functions) to authenticate MQTT connections dynamically. This method uses Microsoft Entra ID JWT validation to ensure secure access.  

When a client attempts to connect, the broker invokes a user-defined HTTP endpoint that validates credentials such SAS tokens, usernames/passwords, or even performs Certificate Revocation List (CRL) checks. The webhook evaluates the request and returns a decision to allow or deny the connection, along with optional metadata for fine-grained authorization. This approach supports flexible and centralized authentication policies across diverse device fleets and use cases. 

> [!NOTE]
> This feature is currently in preview. 

## Prerequisites 

To use custom webhook authentication for namespaces, you need to have the following prerequisites: 

- An Event Grid namespace with either system-assigned or user-assigned managed identity. 
- The External Webhook or Azure function. 
- Grant access to the Event Grid Namespace’s Managed identity to Azure  function /Webhook. 

## High-level steps 

To use custom webhook authentication for namespaces, follow these steps: 

1. Create a namespace and configure its subresources. 
1. Enable managed identity on your Event Grid namespace. 
1. Grant the managed identity access to your Azure function or Webhook. 
1. Configure custom webhook settings on your Event Grid namespace 
1. Connect your clients to the Event Grid namespace and get authenticated via the webhook or function. 

## Create a namespace and configure its subresources 
Follow instructions from [Quickstart: Publish and subscribe to MQTT messages on Event Grid Namespace with Azure portal](mqtt-publish-and-subscribe-portal.md) to create a namespace and configure its subresources. Skip the certificate and client creation steps as the client identities come from the provided token. Client attributes are based on the custom claims in the client token. The client attributes are used in the client group query, topic template variables, and routing enrichment configuration.

## Enable managed identity on your Event Grid namespace 
Use the following command to enable system-assigned managed identity on your Event Grid namespace:  
 
```azurecli-interactive
az eventgrid namespace update --resource-group <resource group name> --name <namespace name> --identity "{type:systemassigned}" 
```
 
For information on configuring system and user-assigned identities using the Azure portal, see [Enable managed identity for an Event Grid namespace](event-grid-namespace-managed-identity.md).

## Grant the managed identity appropriate access to function or webhook
Grant the managed identity of your Event Grid namespace the appropriate access to the target Azure function or webhook. 

To set up custom authentication for an Azure function, follow these steps:

### Create a Microsoft Entra app
1. [Create a Microsoft Entra App in Microsoft Entra ID](/entra/identity-platform/quickstart-register-app).
1. On the overview page of the app, note the **Application (client) ID**.

    :::image type="content" source="./media/authenticate-with-namespaces-using-webhook-authentication/application-client-id.png" alt-text="Screenshot showing the Overview page of a Microsoft Entra ID app with the application or client ID highlighted.":::
1. On the left menu, select **Expose an API**, and then select **Add** next to **Application ID URI**. 
1. Note down the **application ID URI** On the **Edit application ID URI** page, then select **Save**. 

    :::image type="content" source="./media/authenticate-with-namespaces-using-webhook-authentication/application-id-uri.png" alt-text="Screenshot showing the application ID URI of the Microsoft Entra app." lightbox="./media/authenticate-with-namespaces-using-webhook-authentication/application-id-uri.png":::    

### Set up authentication for Azure function
If you have a basic Azure Function created from the Azure portal, follow these steps to set up authentication and validate the Microsoft Entra ID token created using a managed identity. 

1. Navigate to your Azure function app.
1. On the left menu, select **Authentication**, and then select **Add identity provider**. 

    :::image type="content" source="./media/authenticate-with-namespaces-using-webhook-authentication/function-add-identity-provider-button.png" alt-text="Screenshot showing the Authentication page." lightbox="./media/authenticate-with-namespaces-using-webhook-authentication/function-add-identity-provider-button.png":::
1. On the **Add an identity provider** page, for **Identity Provider**, select **Microsoft** from the drop-down list. 
1. In the **App registration**, do these steps: 
    1. For **Client ID**, enter the client ID of Microsoft Entra app you noted earlier. 
    1. For **Issuer URL**, add the issuer URL in the form: `https://login.microsoftonline.com/<tenantid>/v2.0`.

        :::image type="content" source="./media/authenticate-with-namespaces-using-webhook-authentication/identity-provider-first-settings.png" alt-text="Screenshot showing the Add an identity provider with Microsoft as an identity provider." lightbox="./media/authenticate-with-namespaces-using-webhook-authentication/identity-provider-first-settings.png":::
1. In the **Allowed token audiences**, add the **application UD URI** of the Microsoft Entra app you noted earlier. 
1. In the **Additional checks** section, do these steps:
    1. For **Client application development**, select **Allow requests from specific client applications**. 
    1. On the **Allowed client applications** page, enter the **client ID** of the system-assigned managed identity used to generate the token. You can find this ID in the **enterprise app** of the Microsoft Entra ID resource.
1. Choose additional settings based on specific requirements, and then select **Add**. 

Now, generate and use the Microsoft Entra ID token.
1. Generate a Microsoft Entra ID token using the **managed identity** with the **application ID URI** as the resources.
1. Use this token to invoke the Azure function by including it in the request header. 



## Configure custom webhook authentication settings on your Event Grid namespace 
In this step, you configure custom webhook authentication settings on your Event Grid namespace using Azure portal and Azure CLI. You need to create the namespace first and then update it using the following steps. 

### Use Azure portal 

1. Navigate to your Event Grid namespace in the [Azure portal](https://portal.azure.com). 
1. On the **Event Grid Namespace** page, select **Configuration** on the left menu. 
1. In the **Custom Webhook authentication** section, specify values for the following properties: 
    1. Select **Managed identity** type.
    1. For **Webhook URL**, enter the value of the URL endpoint where the Event Grid service sends authenticated webhook requests using the specified managed identity. 
    1. For **Token audience URI**, enter the value of Microsoft Entra application ID or URI to get the access token to be included as the bearer token in delivery requests. 
    1. For **Microsoft Entra tenant ID**, enter the value of Microsoft Entra tenant ID used to acquire the bearer token for authenticated webhook delivery. 
    1. Select **Apply**. 
    
        :::image type="content" source="./media/authenticate-with-namespaces-using-webhook-authentication/configure-webhook-authentication.png" alt-text="Screenshot that shows the configuration of webhook authentication for an Event Grid namespace." lightbox="./media/authenticate-with-namespaces-using-webhook-authentication/configure-webhook-authentication.png":::

### Use Azure CLI 

Use the following command to update your namespace with the custom webhook authentication configuration. 

```azurecli    
az eventgrid namespace update \ 
    --resource-group <resource-group-name> \ 
    --name <namespace-name> \ 
    --api-version 2025-04-01-preview \ 
    --identity-type UserAssigned \ 
    --identity-user-assigned-identities "/subscriptions/XXXXXXXXXXX/resourcegroups/XXXXXXXXXXX/providers/Microsoft.ManagedIdentity/userAssignedIdentities/XXXXXXXXXXX={}" \ 
    --set properties.isZoneRedundant=true \ 
        properties.topicSpacesConfiguration.state=Enabled \ 
        properties.topicSpacesConfiguration.clientAuthentication.webHookAuthentication.identity.type=UserAssigned \ 
        properties.topicSpacesConfiguration.clientAuthentication.webHookAuthentication.identity.userAssignedIdentity="/subscriptions/XXXXXXXXXXX/resourcegroups/XXXXXXXXXXX/providers/Microsoft.ManagedIdentity/userAssignedIdentities/XXXXXXXXXXX" \ 
        properties.topicSpacesConfiguration.clientAuthentication.webHookAuthentication.endpointUrl="https://XXXXXXXXXXX" \ 
        properties.topicSpacesConfiguration.clientAuthentication.webHookAuthentication.azureActiveDirectoryApplicationIdOrUri="api://XXXXXXXXXXX/.default" \ 
        properties.topicSpacesConfiguration.clientAuthentication.webHookAuthentication.azureActiveDirectoryTenantId="XXXXXXXXXXX" 
```

Replace <NAMESPACE_NAME> and <RESOURCE_GROUP_NAME> with your actual values, and fill in the placeholders in the subscription/resource group/identity/app ID/URL/tenant ID. To enhance the performance and reliability of webhook-based authentication for Azure Event Grid MQTT Broker, we strongly recommend enabling HTTP/2 support for your webhook endpoint. 

## Webhook API details 

### Request Headers 

- Authorization: Bearer token 
    - token is a Microsoft Entra token for the managed identity configured to call the webhook. 
    
### Request payload 

```json
{
    "clientId": "<string>",
    "userName": "<string>",
    "password": "<base64 encoded bytes>",
    "authenticationMethod": "<string>",
    "authenticationData": "<base64 encoded bytes>",
    "clientCertificate": "<certificate in PEM format>",
    "clientCertificateChain": "<certificates from chain in PEM format>"
}
```

### Payload field descriptions 

| Field | Required/Optional | Description | 
|-----------------|------------------|---------| 
| clientId | Required | Client ID from MQTT CONNECT packet. | 
| userName | Optional | Username from MQTT CONNECT packet. | 
| password | Optional | Password from MQTT CONNECT packet in base64 encoding. | 
| authenticationMethod | Optional | Authentication method from MQTT CONNECT packet (MQTT5 only). | 
| authenticationData | Optional | Authentication data from MQTT CONNECT packet in base64 encoding (MQTT5 only). | 
| clientCertificate | Optional | Client certificate in PEM format. | 
| clientCertificateChain| Optional | Additional certificates provided by the client required for building the chain from the client certificate to the CA certificate. | 
| userProperties | Optional | User properties from CONNECT packet (MQTT5 only). | 

### Response payload 

#### Successful response 

```json
HTTP/1.1 200 OK 
Content-Type: application/json 

{ 
    "decision": "allow", 
    "clientAuthenticationName": "<string>", 
    "attributes": { 
        "attr": "<int/string/array_of_strings>", 
        ... 
    }, 
    "expiration": "<unix time format>" 
} 
```

#### Denied response 

```json
HTTP/1.1 400 Bad Request 
Content-Type: application/json 

{ 
    "decision": "deny", 
    "errorReason": "<string>" 
}
```

### Response field descriptions


| Field             | Description  |
|---------------------------|------------------------------------|
| Decision (required)       | Authentication decision. Can be either **allow** or **deny**. |
| clientAuthenticationName  | Client authentication name (identity name). (Required when Decision is set to allow).  |
| attributes                | Dictionary with attributes. Key is the attribute name, and the value can be an int/string/array. (Optional when Decision is set to allow). |
| expiration                | Expiration date in Unix time format. (Optional when Decision is set to allow) |
| errorReason               | Error message if decision is set to deny. This error is logged. (Optional when Decision is set to deny) |

### Examples of supported attribute types: 

```json
"num_attr_pos": 1, 
"num_attr_neg": -1, 
"str_attr": "str_value", 
"str_list_attr": [ 
    "str_value_1", 
    "str_value_2" 
] 
```

All correct data types (number that fits int32, string, array of strings) are used as attributes. In the example, `num_attr_pos`, `num_attr_neg`, `str_attr`, `str_list_attr` claims have correct data types and are used as attributes. 



## Related content
- [MQTT client authentication](mqtt-client-authentication.md)
- [Authenticate client using custom JWT](mqtt-client-custom-jwt.md)
