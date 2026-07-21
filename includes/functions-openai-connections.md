---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 07/08/2026
ms.author: glenga
---

## Connections

To use the Azure OpenAI binding extension, you need to specify a connection to an OpenAI model definition. Set the OpenAI model connection in your bindings by using one of these approaches: 

+ Use the `AIConnectionName` binding property (preferred for Azure OpenAI).
+ Set `AZURE_OPENAI_ENDPOINT` and `AZURE_OPENAI_KEY` in app settings (for Azure OpenAI).
+ Set only `Open_API_Key` in app settings (for `https://api.openai.com`).

The way you set the connection depends on both the model API and the authentication method, as indicated by the following table:

| Authentication/Model API | [Azure OpenAI](/azure/ai-services/openai/overview) | [OpenAI (https://api.openai.com)](https://openai.com/) |
| ----- | ----- | --- |
|**Managed identity connection**  | `AIConnectionName`  | Not supported |
|**[Key Vault reference](/azure/key-vault/general/overview)** | `AZURE_OPENAI_ENDPOINT`<br/>`AZURE_OPENAI_KEY`   | `Open_API_Key` |
|**[App Configuration reference](../articles/azure-app-configuration/quickstart-azure-functions-csharp.md)** |`AZURE_OPENAI_ENDPOINT`<br/>`AZURE_OPENAI_KEY` | `Open_API_Key` |
| Shared secret | `AZURE_OPENAI_ENDPOINT`<br/>`AZURE_OPENAI_KEY` | `Open_API_Key` |

Use managed identity-based connections and the `AIConnectionName` property. 

When you use `AIConnectionName`, the value of this property setting depends on the type of connection: 

+ **Managed identity connection**: The `AIConnectionName` property is a `<CONNECTION_NAME_PREFIX>` shared by a group of settings that together define an identity-based connection to Azure OpenAI. For more information, see [Define identity connections](../articles/azure-functions/manage-connections.md?pivots=functions-auth-identity&tabs=bindings#define-connections).
+ **[Key Vault reference](/azure/key-vault/general/overview)**: The `AIConnectionName` property setting returns an Azure Key Vault reference to the location where the API key is centrally maintained. For more information, see [Define Key Vault connections](../articles/azure-functions/manage-connections.md?pivots=functions-auth-keyvault&tabs=bindings#define-connections).
+ **[App Configuration reference](../articles/azure-app-configuration/quickstart-azure-functions-csharp.md)**: The `AIConnectionName` property setting returns an Azure App Configuration reference that returns an API key or a Key Vault reference. For more information, see [Azure App Configuration](../articles/azure-functions/manage-connections.md#azure-app-configuration) in the connections article. 
+ **API key**: The `AIConnectionName` property setting resolves to app settings containing the endpoint and key directly. Because shared keys can be compromised, use managed identity connections when possible. For more information, see [Define connections](../articles/azure-functions/manage-connections.md?pivots=functions-auth-secret&tabs=bindings#define-connections).

To learn more about bindings connections, see [Manage connections in Azure Functions](../articles/azure-functions/manage-connections.md?pivots=functions-auth-identity&tabs=bindings).


### [AIConnectionName Property](#tab/ai-connection-name)

The OpenAI bindings include an `AIConnectionName` property that you can use to specify the `<ConnectionNamePrefix>` for the group of app settings that define the connection to Azure OpenAI:

| Setting name |   Description |
|---|---|
| `<CONNECTION_NAME_PREFIX>__endpoint` | Sets the URI endpoint of the Azure OpenAI service. This setting is always required. |
| `<CONNECTION_NAME_PREFIX>__clientId` | Sets the specific user-assigned identity to use when obtaining an access token. Requires that `<CONNECTION_NAME_PREFIX>__credential` is set to `managedidentity`. The property accepts a client ID corresponding to a user-assigned identity assigned to the application. It's invalid to specify both a Resource ID and a client ID. If you don't specify this property, the system-assigned identity is used. This property is used differently in [local development scenarios](../articles/azure-functions/functions-reference.md#local-development-with-identity-based-connections), when `credential` shouldn't be set. |
|  `<CONNECTION_NAME_PREFIX>__credential` | Defines how an access token is obtained for the connection. Use `managedidentity` for managed identity authentication. This value is only valid when a managed identity is available in the hosting environment. |
|  `<CONNECTION_NAME_PREFIX>__managedIdentityResourceId` | When `credential` is set to `managedidentity`, set this property to specify the resource Identifier to use when obtaining a token. The property accepts a resource identifier corresponding to the resource ID of the user-defined managed identity. It's invalid to specify both a resource ID and a client ID. If you don't specify either, the system-assigned identity is used. This property is used differently in [local development scenarios](../articles/azure-functions/functions-reference.md#local-development-with-identity-based-connections), when `credential` shouldn't be set. |
| `<CONNECTION_NAME_PREFIX>__key` | Sets the shared secret key required to access the endpoint of the Azure OpenAI service by using key-based authentication. As a security best practice, always use Microsoft Entra ID with managed identities for authentication. | 

Consider these managed identity connection settings when you set the `AIConnectionName` property to `myAzureOpenAI`:

+ `myAzureOpenAI__endpoint=https://contoso.openai.azure.com/`
+ `myAzureOpenAI__credential=managedidentity`
+ `myAzureOpenAI__clientId=aaaaaaaa-bbbb-cccc-1111-222222222222`

At runtime, the host interprets these settings as a single `myAzureOpenAI` setting:

```json
"myAzureOpenAI":
{
    "endpoint": "https://contoso.openai.azure.com/",
    "credential": "managedidentity",
    "clientId": "aaaaaaaa-bbbb-cccc-1111-222222222222"
}
```

When you use managed identities, make sure to add your identity to the [Cognitive Services OpenAI User](../articles/role-based-access-control/built-in-roles/ai-machine-learning.md#cognitive-services-openai-user) role.

When running locally, add these settings to the *local.settings.json* project file. For more information, see [Local development with identity-based connections](../articles/azure-functions/functions-reference.md#local-development-with-identity-based-connections).

### [Environment variables](#tab/envars)

To support legacy apps and providers other than Azure OpenAI, define key-based authentication to OpenAI by using these environment variables. 

| Variable name |   Description |
|---|---|
| `AZURE_OPENAI_ENDPOINT` | Sets the URI endpoint of your Azure OpenAI instance. Don't use with `Open_API_Key`. |
| `AZURE_OPENAI_KEY` | Sets the shared secret key required to access your Azure OpenAI endpoint (`AZURE_OPENAI_ENDPOINT`) by using key-based authentication.  |
| `Open_API_Key` | Sets the shared secret key required to access the `https://api.openai.com` endpoint by using key-based authentication.  |

Set these variables in your app settings. 

When running locally, add these settings to the *local.settings.json* project file. 

---

For more information, see [Work with application settings](../articles/azure-functions/functions-how-to-use-azure-function-app-settings.md#settings). 
