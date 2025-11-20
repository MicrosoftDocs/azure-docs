---
title: Authenticate with Namespaces by using Webhook Auth
description: This article shows you how to authenticate with Azure Event Grid namespaces by using a webhook or an Azure function. 
ms.topic: how-to
ms.custom:
  - build-2025
ms.date: 07/30/2025
author: Connected-Seth
ms.author: seshanmugam
---

# Authenticate with the MQTT broker by using custom webhook authentication

This article shows you how to authenticate with Azure Event Grid namespaces by using a webhook or an Azure function.

Webhook authentication allows external HTTP endpoints (webhooks or functions) to authenticate Message Queuing Telemetry Transport (MQTT) connections dynamically. This method uses Microsoft Entra ID JSON Web Token validation to ensure secure access.

When a client attempts to connect, the broker invokes a user-defined HTTP endpoint that validates credentials, such as Shared Access Signature tokens, usernames, and passwords, or even performs Certificate Revocation List checks. The webhook evaluates the request and returns a decision to allow or deny the connection, along with optional metadata for fine-grained authorization. This approach supports flexible and centralized authentication policies across diverse device fleets and use cases.

## Prerequisites

- An Event Grid namespace with either a system-assigned or user-assigned managed identity.
- An external webhook or Azure function.
- Access granted to the Event Grid namespace's managed identity to the Azure function or webhook.

## High-level steps

To use custom webhook authentication for namespaces, follow these steps:

1. Create a namespace and configure its subresources.
1. Enable a managed identity on your Event Grid namespace.
1. Grant the managed identity access to your Azure function or webhook.
1. Configure custom webhook settings on your Event Grid namespace.
1. Connect your clients to the Event Grid namespace and get authenticated via the webhook or function.

## Create a namespace and configure its subresources

To create a namespace and configure its subresources, follow the instructions in [Quickstart: Publish and subscribe to MQTT messages on an Event Grid namespace with the Azure portal](mqtt-publish-and-subscribe-portal.md). Skip the steps to create a certificate and a client because the client identities come from the provided token. Client attributes are based on the custom claims in the client token. The client attributes are used in the client group query, topic template variables, and routing enrichment configuration.

## Enable a managed identity on your Event Grid namespace

To enable a system-assigned managed identity on your Event Grid namespace, use the following command:
 
```azurecli-interactive
az eventgrid namespace update --resource-group <resource group name> --name <namespace name> --identity "{type:systemassigned}" 
```

For information on how to configure system and user-assigned identities by using the Azure portal, see [Enable managed identity for an Event Grid namespace](event-grid-namespace-managed-identity.md).

## Grant the managed identity appropriate access to a function or webhook

Grant the managed identity of your Event Grid namespace the appropriate access to the target Azure function or webhook.

To set up custom authentication for an Azure function, follow the next steps.

### Create a Microsoft Entra app

1. [Create a Microsoft Entra app in Microsoft Entra ID](/entra/identity-platform/quickstart-register-app).
1. On the **Overview** page of the app, make a note of the **Application (client) ID** value.

    :::image type="content" source="./media/authenticate-with-namespaces-using-webhook-authentication/application-client-id.png" alt-text="Screenshot that shows the Overview page of a Microsoft Entra ID app with the application (client) ID highlighted.":::
1. On the left menu, select **Expose an API**. Next to **Application ID URI**, select **Add**.
1. Make a note of the **Application ID URI** value on the **Edit application ID URI** pane, and then select **Save**.

    :::image type="content" source="./media/authenticate-with-namespaces-using-webhook-authentication/application-id-uri.png" alt-text="Screenshot that shows the application ID URI of the Microsoft Entra app." lightbox="./media/authenticate-with-namespaces-using-webhook-authentication/application-id-uri.png":::

### Set up authentication for an Azure function

If you have a basic Azure function created from the Azure portal, set up authentication and validate the Microsoft Entra ID token that was created by using a managed identity.

1. Go to your Azure Functions app.
1. On the left menu, select **Authentication**, and then select **Add identity provider**.

    :::image type="content" source="./media/authenticate-with-namespaces-using-webhook-authentication/function-add-identity-provider-button.png" alt-text="Screenshot that shows the Authentication page." lightbox="./media/authenticate-with-namespaces-using-webhook-authentication/function-add-identity-provider-button.png":::
1. On the **Add an identity provider** page, for **Identity Provider**, select **Microsoft** from the dropdown list.
1. In the **App registration** section, specify values for the following properties:
    1. **Application (client) ID**: Enter the client ID of the Microsoft Entra app that you noted earlier.
    1. **Issuer URL**: Add the issuer URL in the form `https://login.microsoftonline.com/<tenantid>/v2.0`.

        :::image type="content" source="./media/authenticate-with-namespaces-using-webhook-authentication/identity-provider-first-settings.png" alt-text="Screenshot that shows the Add an identity provider with Microsoft as an identity provider." lightbox="./media/authenticate-with-namespaces-using-webhook-authentication/identity-provider-first-settings.png":::
1. For **Allowed token audiences**, add the **Application ID URI** value of the Microsoft Entra app that you noted earlier.
1. In the **Additional checks** section, for **Client application development**, select **Allow requests from specific client applications**.
1. On the **Allowed client applications** pane, enter the client ID of the system-assigned managed identity used to generate the token. You can find this ID in the enterprise app of the Microsoft Entra ID resource.
1. Choose other settings based on your specific requirements, and then select **Add**.

Now, generate and use the Microsoft Entra ID token.

1. Generate a Microsoft Entra ID token by using the managed identity with the application ID URI as the resources.
1. Use this token to invoke the Azure function by including it in the request header.

## Configure custom webhook authentication settings on your Event Grid namespace

Configure custom webhook authentication settings on your Event Grid namespace by using the Azure portal and the Azure CLI. You create the namespace first and then update it.

### Use the Azure portal

1. Go to your Event Grid namespace in the [Azure portal](https://portal.azure.com).
1. On the **Event Grid Namespace** page, select **Configuration** on the left menu.
1. In the **Custom Webhook authentication** section, specify values for the following properties:
    1. **Managed identity type**: Select **User assigned**.
    1. **Webhook URL**: Enter the value of the URL endpoint where the Event Grid service sends authenticated webhook requests by using the specified managed identity.
    1. **Token audience URI**: Enter the value of the Microsoft Entra application ID or URI to get the access token to be included as the bearer token in delivery requests.
    1. **Microsoft Entra ID tenant ID**: Enter the value of the Microsoft Entra tenant ID used to acquire the bearer token for authenticated webhook delivery.
1. Select **Apply**.
    
    :::image type="content" source="./media/authenticate-with-namespaces-using-webhook-authentication/configure-webhook-authentication.png" alt-text="Screenshot that shows the configuration of webhook authentication for an Event Grid namespace." lightbox="./media/authenticate-with-namespaces-using-webhook-authentication/configure-webhook-authentication.png":::

### Use the Azure CLI

To update your namespace with the custom webhook authentication configuration, use the following command:

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

Replace `<NAMESPACE_NAME>` and `<RESOURCE_GROUP_NAME>` with your actual values. Fill in the placeholders in the subscription, resource group, identity, app ID, URL, and tenant ID. To enhance the performance and reliability of webhook-based authentication for the Event Grid MQTT broker, we strongly recommend that you enable HTTP/2 support for your webhook endpoint.

## Webhook API details

### Request headers

**Authorization**: Bearer token

The token is a Microsoft Entra token for the managed identity that was configured to call the webhook.

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
| `clientId` | Required | Client ID from MQTT CONNECT packet. | 
| `userName` | Optional | Username from MQTT CONNECT packet. | 
| `password` | Optional | Password from MQTT CONNECT packet in Base64 encoding. | 
| `authenticationMethod` | Optional | Authentication method from MQTT CONNECT packet (MQTT5 only). | 
| `authenticationData` | Optional | Authentication data from MQTT CONNECT packet in Base64 encoding (MQTT5 only). | 
| `clientCertificate` | Optional | Client certificate in PEM format. | 
| `clientCertificateChain`| Optional | Other certificates provided by the client required to build the chain from the client certificate to the Certificate Authority certificate. | 
| `userProperties` | Optional | User properties from CONNECT packet (MQTT5 only). | 

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
| `decision` (required)       | Authentication decision is either `allow` or `deny`. |
| `clientAuthenticationName`  | Client authentication name (identity name). (Required when `decision` is set to `allow`.)  |
| `attributes`                | Dictionary with attributes. Key is the attribute name, and the value is an int/string/array. (Optional when `decision` is set to `allow`.) |
| `expiration`                | Expiration date in Unix time format. (Optional when `decision` is set to `allow`.) |
| `errorReason`               | Error message if `decision` is set to `deny`. This error is logged. (Optional when `decision` is set to `deny`.) |

### Examples of supported attribute types

```json
"num_attr_pos": 1, 
"num_attr_neg": -1, 
"str_attr": "str_value", 
"str_list_attr": [ 
    "str_value_1", 
    "str_value_2" 
] 
```

All correct data types (number that fits `<int32/string/array_of_strings>`) are used as attributes. In the example, `num_attr_pos`, `num_attr_neg`, `str_attr`, and `str_list_attr` claims have correct data types and are used as attributes.

## Related content

- [MQTT client authentication](mqtt-client-authentication.md)
- [Authenticate client by using custom JWT](mqtt-client-custom-jwt.md)
