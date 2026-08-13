---
title: Work with access keys in Azure Functions
description: Learn about access keys in Azure Functions, including how to get and renew keys and how to use access keys when calling function endpoints.
ms.service: azure-functions
ms.topic: how-to 
ms.date: 08/10/2026

#CustomerIntent: As an Azure Functions developer, I want to learn how to work with access keys so that I can properly harden both my function endpoints and my overall function app running in Azure.
---

# Work with access keys in Azure Functions

Azure Functions access keys act as shared secrets that authorize access to function endpoints. This article describes the kinds of access keys that Functions supports, and how to work with access keys.

While access keys provide some protection against unwanted access, consider other options to secure HTTP endpoints in production. For example, don't distribute shared secrets in a public app. If a public client calls your function, consider implementing these or other security mechanisms:

- [Enable App Service Authentication/Authorization](security-concepts.md#enable-app-service-authenticationauthorization)
- [Use Azure API Management (APIM) to authenticate requests](security-concepts.md#use-azure-api-management-apim-to-authenticate-requests)
- [Deploy your function app to a virtual network](security-concepts.md#deploy-your-function-app-to-a-virtual-network)
- [Deploy your function app in isolation](security-concepts.md#deploy-your-function-app-in-isolation)
 
Access keys provide the basis for HTTP authorization in HTTP-triggered functions. For more information, see [Authorization level](./functions-bindings-http-webhook-trigger.md#http-auth).

## Access key types
<a name="understand-keys"></a>

The scope of an access key and the actions it supports depend on the type of access key. 

| Key type | Key name | HTTP auth level | Description |
| ----- | ----- | ---- | ---- |
| **Function** | `default` or user defined | `function` | Allows access only to a specific function endpoint. |
| **Host** | `default` or user defined | `function` | Allows access to all function endpoints in a function app. |
| **Master** | `_master` | `admin` | Special host key that also provides administrative access to the runtime REST APIs in a function app. Because the master key grants elevated permissions in your function app, don't share this key with third parties or distribute it in native client applications. |
| **System** | Depends on the extension | n/a | Specific extensions might require a system-managed key to access webhook endpoints. System keys are designed for extension-specific function endpoints that internal components call. For example, the [Event Grid trigger](functions-bindings-event-grid-trigger.md) requires that the subscription use a system key when calling the trigger endpoint. Durable Functions also uses system keys to call [Durable Task extension APIs](../durable-task/durable-functions/durable-functions-http-api.md). <br/>Only specific extensions can create system keys. You can't explicitly set their values. Like other keys, you can generate a new value for the key from the portal or by using the key APIs. | 

Each key has a name for reference. The function app and function levels each have a default key named `default`. Function keys take precedence over host keys. When two keys have the same name, the function key is always used.

The following table compares the uses for various kinds of access keys:

| Action | Scope | Key type |
| --- | --- | --- |
| Execute a function | Specific function | Function |
| Execute a function | Any function | Function or host |
| Call an `admin` endpoint | Function app | Master |
| Call Durable Task extension APIs | Function app<sup>*</sup> | System |
| Call an extension-specific webhook (internal) | Function app<sup>*</sup> | System |

<sup>*</sup>Scope determined by the extension.  

## Access key requirements

In Functions, access keys are randomly generated 32-byte arrays that are encoded as URL-safe base-64 strings. While you can generate your own access keys and use them with Functions, use the default access key generation process instead.

Functions-generated access keys include special signature and checksum values that indicate the type of access key and that Azure Functions generated it. These extra components in the key make it easier to determine the source of these kinds of secrets during security scanning and other automated processes.

To allow Functions to generate your keys, don't supply the key `value` to any of the APIs that you can use to generate keys.

## Access key storage
<a name="manage-key-storage"></a>

Your function app in Azure stores keys and encrypts them at rest. By default, the `AzureWebJobsStorage` setting stores keys in a Blob storage container in the provided account. Use the [`AzureWebJobsSecretStorageType`](functions-app-settings.md#azurewebjobssecretstoragetype) setting to override this default behavior and store keys in one of these alternate locations:

| Location | Value | Description | 
| --------- | --------- | --------- |
| A second storage account | `blob` | Stores keys in Blob storage in a storage account that's different from the one used by the Functions runtime. The specific account and container used are defined by a shared access signature (SAS) URL set in the [`AzureWebJobsSecretStorageSas`](functions-app-settings.md#azurewebjobssecretstoragesas) setting. You must maintain the `AzureWebJobsSecretStorageSas` setting when the SAS URL changes. |
| [Azure Key Vault](/azure/key-vault/general/overview) | `keyvault` | Stores keys in the key vault set in [`AzureWebJobsSecretStorageKeyVaultUri`](functions-app-settings.md#azurewebjobssecretstoragekeyvaulturi). |
| File system | `files` | Keys are persisted on the local file system, which is the default in Functions v1.x. File system storage isn't recommended. |
| Kubernetes Secrets | `kubernetes` | Stores keys in the resource set in [`AzureWebJobsKubernetesSecretName`](functions-app-settings.md#azurewebjobskubernetessecretname). Supported only when your function app is deployed to Kubernetes. The [Azure Functions Core Tools](functions-run-local.md) generates the values automatically when you use it to deploy your app to a Kubernetes cluster. [Immutable secrets](https://kubernetes.io/docs/concepts/configuration/secret/#secret-immutable) aren't supported. |
| Azure Container Apps secrets | `containerapps` | Keys are stored in the Azure Container Apps secrets store, which is the internal secrets management system for Container Apps. Supported only when your function app is deployed to Azure Container Apps. For information, see [Configure the Container Apps secret store](../container-apps/functions-secrets-host-keys.md#configure-the-container-apps-secret-store). |

When you use Key Vault for key storage, the app settings you need depend on how the app authenticates to Key Vault: a system-assigned managed identity, a user-assigned managed identity, or an app registration.

| Setting name | System-assigned | User-assigned | App registration | 
| --- | --- | --- | --- |
| [`AzureWebJobsSecretStorageKeyVaultUri`](functions-app-settings.md#azurewebjobssecretstoragekeyvaulturi) | Yes | Yes | Yes |
| [`AzureWebJobsSecretStorageKeyVaultClientId`](functions-app-settings.md#azurewebjobssecretstoragekeyvaultclientid) | No | Yes | Yes |
| [`AzureWebJobsSecretStorageKeyVaultClientSecret`](functions-app-settings.md#azurewebjobssecretstoragekeyvaultclientsecret) | No | No | Yes |
| [`AzureWebJobsSecretStorageKeyVaultTenantId`](functions-app-settings.md#azurewebjobssecretstoragekeyvaulttenantid) | No | No | Yes |

[!INCLUDE [functions-key-vault-secrets-storage-warning](../../includes/functions-key-vault-secrets-storage-warning.md)]

## Call endpoints with access keys
<a name="use-access-keys"></a>

You can call HTTP-triggered functions by using a URL that includes the function name. When you set the authorization level of a function to any value other than `anonymous`, you must also provide an access key in your request. You can include the access key in the URL by using the `?code=` query string or in the request header (`x-functions-key`). For more information, see [Access key authorization](functions-bindings-http-webhook-trigger.md#api-key-authorization).

To access the runtime REST APIs (under `/admin/`), you must provide the master key (`_master`) in the `x-functions-key` request header. You can [disable administrative endpoints](./security-concepts.md#disable-administrative-endpoints) by setting the `functionsRuntimeAdminIsolationEnabled` site property.

## Get your function access keys

You can get function and host keys programmatically by using these Azure Resource Manager APIs: 

- [List Function Keys](/rest/api/appservice/webapps/listfunctionkeys)
- [List Host Keys](/rest/api/appservice/webapps/listhostkeys)
- [List Function Keys Slot](/rest/api/appservice/webapps/listfunctionkeysslot)
- [List Host Keys Slot](/rest/api/appservice/webapps/listhostkeysslot)

To learn how to call Azure Resource Manager APIs, see the [Azure REST API reference](/rest/api/azure/).

> [!NOTE]
> When you deploy your function app to Azure Container Apps and use `AzureWebJobsSecretStorageType=ContainerApps`, you must use Container Apps-specific methods to retrieve function keys. For more information, see [Manage access keys](../container-apps/functions-secrets-host-keys.md#manage-access-keys) in Container Apps documentation.

Use these methods to get access keys without using the REST APIs. 

### [Azure portal](#tab/azure-portal)

1. Sign in to the Azure portal, and then search for and select **Function App**.

1. Select the function app you want to work with.

1. In the left menu, expand **Functions**, and then select **App keys**.

    The **App keys** page appears. On this page, the host keys are displayed, which you can use to access any function in the app. The system key is also displayed, which gives anyone administrator-level access to all function app APIs.

You can also practice least privilege by using the key for a specific function. You can get function-specific keys from the **Function keys** tab of a specific HTTP-triggered function.

### [Azure CLI](#tab/azure-cli)

Run the following command in Azure Cloud Shell. The output of the command is the `default` host key, which you can use to access any HTTP-triggered function in the function app.

```azurecli-interactive
az functionapp keys list --resource-group <RESOURCE_GROUP> --name <APP_NAME> --query functionKeys.default --output tsv
```

Replace `<RESOURCE_GROUP>` and `<APP_NAME>` with the resource group and your function app name.

Because the output contains sensitive information, don't persist the output or secure any persisted file outputs.

### [Azure PowerShell](#tab/azure-powershell)

Run the following script. The output is the `default` host key, which you can use to access any HTTP-triggered function in the function app.

```powershell-interactive
$rGroup = '<RESOURCE_GROUP>'
$appName = '<APP_NAME>'
$path = "/subscriptions/$((Get-AzContext).Subscription.Id)/resourceGroups/$rGroup/providers/Microsoft.Web/sites/$appName/host/default/listKeys?api-version=2018-11-01"

((Invoke-AzRestMethod -Path $path -Method POST).Content | ConvertFrom-JSON).functionKeys.default
```

In this script, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with the resource group and your function app name.

---

>[!TIP]
>You can also get access keys for your functions by using the Azure Functions Core Tools command `func azure functionapp list-functions` with the `--show-keys` option. For more information, see the [Azure Functions Core Tools reference](functions-core-tools-reference.md#func-azure-functionapp-list-functions).

## Renew or create access keys

When you renew or create your access key values, you must manually redistribute the updated key values to all clients that call your function. 

You can renew function and host keys programmatically or create new ones by using these Azure Resource Manager APIs: 

- [Create Or Update Function Secret](/rest/api/appservice/webapps/createorupdatefunctionsecret) 
- [Create Or Update Function Secret Slot](/rest/api/appservice/webapps/createorupdatefunctionsecretslot)
- [Create Or Update Host Secret](/rest/api/appservice/webapps/createorupdatehostsecret) 
- [Create Or Update Host Secret Slot](/rest/api/appservice/webapps/createorupdatehostsecretslot)

To learn how to call Azure Resource Manager APIs, see the [Azure REST API reference](/rest/api/azure/).

You can use these methods to get access keys without having to manually create calls to the REST APIs. 

### [Azure portal](#tab/azure-portal)

1. Sign in to the Azure portal, and then search for and select **Function App**.

1. Select the function app you want to work with.

1. In the left menu, expand **Functions**, and then select **App keys**.

    The **App keys** page appears. On this page, the host keys are displayed, which you can use to access any function in the app. The system key is also displayed, which gives anyone administrator-level access to all function app APIs.

1. Select **Renew key value** next to the key you want to renew, and then select **Renew and save**.  

You can also renew a function key in the **Function keys** tab of a specific HTTP-triggered function.

### [Azure CLI](#tab/azure-cli)

Run the following command in Azure Cloud Shell. The command renews the `default` host key with a new key value generated by Functions.

```azurecli-interactive
az functionapp keys set --resource-group <RESOURCE_GROUP> --name <APP_NAME> --key-type functionKeys --key-name default
```

In this command, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with the resource group and your function app name. This command runs in Azure Cloud Shell (Bash). You must modify it to run in a Windows terminal.

The new key value generated by Functions is displayed for your reference. Securely distribute this new key value to any apps that rely on the host key. Because the output contains sensitive information, either don't persist the output or secure any persisted file outputs.

### [Azure PowerShell](#tab/azure-powershell)

Run the following script. The script uses the REST APIs to renew the `default` host key with a new key value generated by Functions.

```powershell-interactive
# Variables - replace these with your actual values
$resourceGroupName = "<RESOURCE_GROUP>"
$functionAppName = "<APP_NAME>" 

# Construct the URI for the REST API call
$uri = "https://management.azure.com/subscriptions/$((Get-AzContext).Subscription.Id)/resourceGroups/$resourceGroupName/providers/Microsoft.Web/sites/$functionAppName/host/default/listkeys?api-version=2021-02-01"

# Construct the body of the request
$body = @{
    properties = @{
        name = "default"
    }
} | ConvertTo-Json

# Invoke the REST API to create or update the host-level secret
$response = Invoke-AzRestMethod -Method Post -Uri $uri -Payload $body

# Output the updated key for reference
($response.Content | ConvertFrom-Json).functionKeys.default
```

In this script, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with the resource group and your function app name.

The new key value generated by Functions is returned for your reference. Securely distribute this key to any apps that rely on the host key. Because the output contains sensitive information, either don't persist the output or secure any persisted file outputs.

---

## Delete access keys

You can delete function and host keys programmatically by using these Azure Resource Manager APIs: 

- [Delete Function Secret](/rest/api/appservice/webapps/deletefunctionsecret)
- [Delete Function Secret Slot](/rest/api/appservice/webapps/deletefunctionsecretslot)
- [Delete Host Secret](/rest/api/appservice/webapps/deletehostsecret)
- [Delete Host Secret Slot](/rest/api/appservice/webapps/deletehostsecretslot)

To learn how to call Azure Resource Manager APIs, see the [Azure REST API reference](/rest/api/azure/). 

## Related content

- [Securing Azure Functions](security-concepts.md)
- [Azure Functions HTTP trigger](functions-bindings-http-webhook-trigger.md)
- [Manage your function app](functions-how-to-use-azure-function-app-settings.md)

