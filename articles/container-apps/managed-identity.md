---
title: Managed identities in Azure Container Apps
description: Using managed identities in Container Apps
services: container-apps
author: v-jaswel
ms.service: azure-container-apps
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 10/25/2023
ms.author: v-wellsjason
---

# Managed identities in Azure Container Apps

A managed identity from Microsoft Entra ID allows your container app to access other Microsoft Entra protected resources. For more about managed identities in Microsoft Entra ID, see [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

Your container app can be granted two types of identities:

- A **system-assigned identity** is tied to your container app and is deleted when your container app is deleted. An app can only have one system-assigned identity.
- A **user-assigned identity** is a standalone Azure resource that you can assign to your container app and other resources. A container app can have multiple user-assigned identities. User-assigned identities exist until you delete them.

## Why use a managed identity?

You can use a managed identity in a running container app to authenticate to any [service that supports Microsoft Entra authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication).

With managed identities:

- Your app connects to resources with the managed identity. You don't need to manage credentials in your container app.
- You can use role-based access control to grant specific permissions to a managed identity.
- System-assigned identities are automatically created and managed. They're deleted when your container app is deleted.
- You can add and delete user-assigned identities and assign them to multiple resources. They're independent of your container app's lifecycle.
- You can use managed identity to [authenticate with a private Azure Container Registry](./managed-identity-image-pull.md) without a username and password to pull containers for your container app.
- You can use a [managed identity to create connections for Dapr-enabled applications via Dapr components](./dapr-overview.md)

### Common use cases

System-assigned identities are best for workloads that:

- are contained within a single resource
- need independent identities

User-assigned identities are ideal for workloads that:

- run on multiple resources and can share a single identity
- need pre-authorization to a secure resource

## Limitations

[Init containers](containers.md#init-containers) can't access managed identities in [consumption-only environments](environment.md#types) and [dedicated workload profile environments](environment.md#types)

## Configure managed identities

You can configure your managed identities through:

- the Azure portal
- the Azure CLI
- your Azure Resource Manager (ARM) template

When a managed identity is added, deleted, or modified on a running container app, the app doesn't automatically restart and a new revision isn't created.

> [!NOTE]
> When adding a managed identity to a container app deployed before April 11, 2022, you must create a new revision.

### Add a system-assigned identity

# [Azure portal](#tab/portal)

1. Go to your container app in the Azure portal.

1. From the *Settings* group, select **Identity**.

1. Within the *System assigned* tab, switch *Status* to **On**.

1. Select **Save**.

:::image type="content" source="media/managed-identity/screenshot-system-assigned-identity.png" alt-text="Screenshot of system-assigned identities.":::

# [Azure CLI](#tab/cli)

Run the `az containerapp identity assign` command to create a system-assigned identity:

```azurecli
az containerapp identity assign --name myApp --resource-group myResourceGroup --system-assigned
```

# [ARM template](#tab/arm)

An ARM template can be used to automate deployment of your container app and resources. To add a system-assigned identity, add an `identity` section to your ARM template.

```json
"identity": {
    "type": "SystemAssigned"
}
```

Adding the system-assigned type tells Azure to create and manage the identity for your application. For a complete ARM template example, see [ARM API Specification](azure-resource-manager-api-spec.md?tabs=arm-template#container-app-examples).

# [YAML](#tab/yaml)

Some Azure CLI commands, including `az containerapp create` and `az containerapp job create`, support YAML files for input. To add a system-assigned identity, add an `identity` section to your YAML file.

```yaml
identity:
  type: SystemAssigned
```

Adding the system-assigned type tells Azure to create and manage the identity for your application. For a complete YAML template example, see [ARM API Specification](azure-resource-manager-api-spec.md?tabs=yaml#container-app-examples).

# [Bicep](#tab/bicep)

A Bicep template can be used to automate deployment of your container app and resources. To add a system-assigned identity, add an `identity` section to your Bicep template.

```bicep
identity: {
  type: 'SystemAssigned'
}
```

Adding the system-assigned type tells Azure to create and manage the identity for your application. For a complete Bicep template example, see [Microsoft.App containerApps Bicep, ARM template & Terraform AzAPI reference](/azure/templates/microsoft.app/containerapps?pivots=deployment-language-bicep).

---

### Add a user-assigned identity

Configuring a container app with a user-assigned identity requires that you first create the identity then add its resource identifier to your container app's configuration. You can create user-assigned identities via the Azure portal or the Azure CLI. For information on creating and managing user-assigned identities, see [Manage user-assigned managed identities](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md).

# [Azure portal](#tab/portal)

First, you'll need to create a user-assigned identity resource.

1. Create a user-assigned managed identity resource according to the steps found in [Manage user-assigned managed identities](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity).

1. Go to your container app in the Azure portal.

1. From the *Settings* group, select **Identity**.

1. Within the *User assigned* tab, select **Add**.

1. Search for and select the identity you created earlier.

1. Select **Add**.

:::image type="content" source="media/managed-identity/screenshot-user-assigned-identity.png" alt-text="Screenshot of user-assigned identities.":::

# [Azure CLI](#tab/cli)

1. Create a user-assigned identity.

   ```azurecli
   az identity create --resource-group <GROUP_NAME> --name <IDENTITY_NAME> --output json
   ```

   Note the `id` property of the new identity.

1. Run the `az containerapp identity assign` command to assign the identity to the app. The identities parameter is a space separated list.

   ```azurecli
   az containerapp identity assign --resource-group <GROUP_NAME> --name <APP_NAME> \
       --user-assigned <IDENTITY_RESOURCE_ID>
   ```

   Replace `<IDENTITY_RESOURCE_ID>` with the `id` property of the identity. To assign more than one user-assigned identity, supply a space-separated list of identity IDs to the `--user-assigned` parameter.

# [ARM template](#tab/arm)

To add one or more user-assigned identities, add an `identity` section to your ARM template. Replace `<IDENTITY1_RESOURCE_ID>` and `<IDENTITY2_RESOURCE_ID>` with the resource identifiers of the identities you want to add.

Specify each user-assigned identity by adding an item to the `userAssignedIdentities` object with the identity's resource identifier as the key. Use an empty object as the value.

```json
"identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
        "<IDENTITY1_RESOURCE_ID>": {},
        "<IDENTITY2_RESOURCE_ID>": {}
    }
}
```

For a complete ARM template example, see [ARM API Specification](azure-resource-manager-api-spec.md?tabs=arm-template#container-app-examples).

> [!NOTE]
> An application can have both system-assigned and user-assigned identities at the same time. In this case, the value for the `type` property would be `SystemAssigned,UserAssigned`.

# [YAML](#tab/yaml)

To add one or more user-assigned identities, add an `identity` section to your YAML configuration file. Replace `<IDENTITY1_RESOURCE_ID>` and `<IDENTITY2_RESOURCE_ID>` with the resource identifiers of the identities you want to add.

Specify each user-assigned identity by adding an item to the `userAssignedIdentities` object with the identity's resource identifier as the key. Use an empty object as the value.

```yaml
identity:
    type: UserAssigned
    userAssignedIdentities:
        <IDENTITY1_RESOURCE_ID>: {}
        <IDENTITY2_RESOURCE_ID>: {}
```

For a complete YAML template example, see [ARM API Specification](azure-resource-manager-api-spec.md?tabs=yaml#container-app-examples).

> [!NOTE]
> An application can have both system-assigned and user-assigned identities at the same time. In this case, the `type` property would be `SystemAssigned,UserAssigned`.

# [Bicep](#tab/bicep)

To add one or more user-assigned identities, add an `identity` section to your Bicep template. Replace `<IDENTITY1_RESOURCE_ID>` and `<IDENTITY2_RESOURCE_ID>` with the resource identifiers of the identities you want to add.

Specify each user-assigned identity by adding an item to the `userAssignedIdentities` object with the identity's resource identifier as the key. Use an empty object as the value.

```bicep
identity: {
  type: 'UserAssigned'
  userAssignedIdentities: {
    <IDENTITY1_RESOURCE_ID>: {}
    <IDENTITY2_RESOURCE_ID>: {}
  }
}
```

For a complete Bicep template example, see [Microsoft.App containerApps Bicep, ARM template & Terraform AzAPI reference](/azure/templates/microsoft.app/containerapps?pivots=deployment-language-bicep).

> [!NOTE]
> An application can have both system-assigned and user-assigned identities at the same time. In this case, the `type` property would be `SystemAssigned,UserAssigned`.

---

## Configure a target resource

For some resources, you need to configure role assignments for your app's managed identity to grant access. Otherwise, calls from your app to services, such as Azure Key Vault and Azure SQL Database, are rejected even when you use a valid token for that identity. To learn more about Azure role-based access control (Azure RBAC), see [What is RBAC?](../role-based-access-control/overview.md). To learn more about which resources support Microsoft Entra tokens, see [Azure services that support Microsoft Entra authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication).

> [!IMPORTANT]
> The back-end services for managed identities maintain a cache per resource URI for around 24 hours. If you update the access policy of a particular target resource and immediately retrieve a token for that resource, you may continue to get a cached token with outdated permissions until that token expires. Forcing a token refresh isn't supported.

## Connect to Azure services in app code

With managed identities, an app can obtain tokens to access Azure resources that use Microsoft Entra ID, such as Azure SQL Database, Azure Key Vault, and Azure Storage. These tokens represent the application accessing the resource, and not any specific user of the application.

Container Apps provides an internally accessible [REST endpoint](managed-identity.md?tabs=cli%2Chttp#rest-endpoint-reference) to retrieve tokens. The REST endpoint is available from within the app with a standard HTTP `GET` request, which you can send with a generic HTTP client in your preferred language. For .NET, JavaScript, Java, and Python, the Azure Identity client library provides an abstraction over this REST endpoint. You can connect to other Azure services by adding a credential object to the service-specific client.

> [!NOTE]
> When using Azure Identity client library, you need to explicitly specify the user-assigned managed identity client ID.

# [.NET](#tab/dotnet)

> [!NOTE]
> When connecting to Azure SQL data sources with [Entity Framework Core](/ef/core/), consider using [Microsoft.Data.SqlClient](/sql/connect/ado-net/sql/azure-active-directory-authentication), which provides special connection strings for managed identity connectivity.

For .NET apps, the simplest way to work with a managed identity is through the [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme). See the following resources for more information:

- [Add Azure Identity client library to your project](/dotnet/api/overview/azure/identity-readme#getting-started)
- [Access Azure service with a system-assigned identity](/dotnet/api/overview/azure/identity-readme#authenticating-with-defaultazurecredential)
- [Access Azure service with a user-assigned identity](/dotnet/api/overview/azure/identity-readme#specify-a-user-assigned-managed-identity-with-defaultazurecredential)

The linked examples use [`DefaultAzureCredential`](/dotnet/api/overview/azure/identity-readme#defaultazurecredential). This object is effective in most scenarios as the same pattern works in Azure (with managed identities) and on your local machine (without managed identities).

# [JavaScript](#tab/javascript)

For Node.js apps, the simplest way to work with a managed identity is through the [Azure Identity client library for JavaScript](/javascript/api/overview/azure/identity-readme?). See the following resources for more information:

- [Add Azure Identity client library to your project](/javascript/api/overview/azure/identity-readme#install-the-package)
- [Access Azure service with a system-assigned identity](/javascript/api/overview/azure/identity-readme#authenticating-with-defaultazurecredential)
- [Access Azure service with a user-assigned identity](/javascript/api/overview/azure/identity-readme#authenticating-a-user-assigned-managed-identity-with-defaultazurecredential)

The linked examples use [`DefaultAzureCredential`](/javascript/api/overview/azure/identity-readme#defaultazurecredential). This object is effective in most scenarios as the same pattern works in Azure (with managed identities) and on your local machine (without managed identities).

For more code examples of the Azure Identity client library for JavaScript, see [Azure Identity examples](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/identity_2.0.1/sdk/identity/identity/samples/AzureIdentityExamples.md).

# [Python](#tab/python)

For Python apps, the simplest way to work with a managed identity is through the [Azure Identity client library for Python](/python/api/overview/azure/identity-readme). See the following resources for more information:

- [Add Azure Identity client library to your project](/python/api/overview/azure/identity-readme#getting-started)
- [Access Azure service with a system-assigned identity](/python/api/overview/azure/identity-readme#authenticating-with-defaultazurecredential)
- [Access Azure service with a user-assigned identity](/python/api/overview/azure/identity-readme#authenticating-a-user-assigned-managed-identity-with-defaultazurecredential)

The linked examples use [`DefaultAzureCredential`](/python/api/overview/azure/identity-readme#defaultazurecredential). This object is effective in most scenarios as the same pattern works in Azure (with managed identities) and on your local machine (without managed identities).

# [Java](#tab/java)

For Java apps and functions, the simplest way to work with a managed identity is through the [Azure Identity client library for Java](/java/api/overview/azure/identity-readme). See the following resources for more information:

- [Add Azure Identity client library to your project](/java/api/overview/azure/identity-readme#include-the-package)
- [Access Azure service with a system-assigned identity](/java/api/overview/azure/identity-readme#authenticating-with-defaultazurecredential)
- [Access Azure service with a user-assigned identity](/java/api/overview/azure/identity-readme#authenticating-a-user-assigned-managed-identity-with-defaultazurecredential)

The linked examples use [`DefaultAzureCredential`](/azure/developer/java/sdk/identity-azure-hosted-auth#default-azure-credential). This object is effective in most scenarios as the same pattern works in Azure (with managed identities) and on your local machine (without managed identities).

For more code examples of the Azure Identity client library for Java, see [Azure Identity Examples](https://github.com/Azure/azure-sdk-for-java/wiki/Azure-Identity-Examples).

# [PowerShell](#tab/powershell)

Use the following script to retrieve a token from the local endpoint by specifying a resource URI of an Azure service. Replace the placeholder with the resource URI to obtain the token.

```powershell
$resourceURI = "https://<AAD-resource-URI>"
$tokenAuthURI = $env:IDENTITY_ENDPOINT + "?resource=$resourceURI&api-version=2019-08-01"
$tokenResponse = Invoke-RestMethod -Method Get -Headers @{"X-IDENTITY-HEADER"="$env:IDENTITY_HEADER"} -Uri $tokenAuthURI
$accessToken = $tokenResponse.access_token
```

# [HTTP GET](#tab/http)

A raw HTTP `GET` request looks like the following example.

Obtain the token endpoint URL from the `IDENTITY_ENDPOINT` environment variable. `x-identity-header` contains the GUID that is stored in the `IDENTITY_HEADER` environment variable.

```http
GET http://localhost:42356/msi/token?resource=https://vault.azure.net&api-version=2019-08-01 HTTP/1.1
x-identity-header: 853b9a84-5bfa-4b22-a3f3-0b9a43d9ad8a
```

A response might look like this example:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "access_token": "eyJ0eXAi…",
    "expires_on": "1586984735",
    "resource": "https://vault.azure.net",
    "token_type": "Bearer",
    "client_id": "5E29463D-71DA-4FE0-8E69-999B57DB23B0"
}

```

This response is the same as the [response for the Microsoft Entra service-to-service access token request](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md#successful-response). To access Key Vault, add the value of `access_token` to a client connection with the vault.

### REST endpoint reference

A container app with a managed identity exposes the identity endpoint by defining two environment variables:

- `IDENTITY_ENDPOINT`: Local URL from which your container app can request tokens.
- `IDENTITY_HEADER`: A header used to help mitigate server-side request forgery (SSRF) attacks. The value is rotated by the platform.

To get a token for a resource, make an HTTP `GET` request to the endpoint, including the following parameters:

| Parameter name    | In     | Description                                                                                                                                                                                                                                                                                                                                          |
| ----------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| resource          | Query  | The Microsoft Entra resource URI of the resource for which a token should be obtained. The resource could be one of the [Azure services that support Microsoft Entra authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication) or any other resource URI. |
| api-version       | Query  | The version of the token API to be used. Use "2019-08-01" or later.                                                                                                                                                                                                                                                                                  |
| X-IDENTITY-HEADER | Header | The value of the `IDENTITY_HEADER` environment variable. This header mitigates server-side request forgery (SSRF) attacks.                                                                                                                                                                                                                           |
| client_id         | Query  | (Optional) The client ID of the user-assigned identity to be used. Can't be used on a request that includes `principal_id`, `mi_res_id`, or `object_id`. If all ID parameters (`client_id`, `principal_id`, `object_id`, and `mi_res_id`) are omitted, the system-assigned identity is used.                                                         |
| principal_id      | Query  | (Optional) The principal ID of the user-assigned identity to be used. `object_id` is an alias that may be used instead. Can't be used on a request that includes client_id, mi_res_id, or object_id. If all ID parameters (`client_id`, `principal_id`, `object_id`, and `mi_res_id`) are omitted, the system-assigned identity is used.             |
| mi_res_id         | Query  | (Optional) The Azure resource ID of the user-assigned identity to be used. Can't be used on a request that includes `principal_id`, `client_id`, or `object_id`. If all ID parameters (`client_id`, `principal_id`, `object_id`, and `mi_res_id`) are omitted, the system-assigned identity is used.                                                 |

> [!IMPORTANT]
> If you are attempting to obtain tokens for user-assigned identities, you must include one of the optional properties. Otherwise the token service will attempt to obtain a token for a system-assigned identity, which may or may not exist.

---

## <a name="scale-rules"></a>Use managed identity for scale rules

You can use managed identities in your scale rules to authenticate with Azure services that support managed identities. To use a managed identity in your scale rule, use the `identity` property instead of the `auth` property in your scale rule. Acceptable values for the `identity` property are either the Azure resource ID of a user-assigned identity, or `system` to use a system-assigned identity.

> [!NOTE]
> Managed identity authentication in scale rules is in public preview. It's available in API version `2024-02-02-preview`.

The following ARM template example shows how to use a managed identity with an Azure Queue Storage scale rule:

The queue storage account uses the `accountName` property to identify the storage account, while the `identity` property specifies which managed identity to use. You do not need to use the `auth` property.

```json
"scale": {
    "minReplicas": 1,
    "maxReplicas": 10,
    "rules": [{
        "name": "myQueueRule",
        "azureQueue": {
            "accountName": "mystorageaccount",
            "queueName": "myqueue",
            "queueLength": 2,
            "identity": "<IDENTITY1_RESOURCE_ID>"
        }
    }]
}
```
To learn more about using managed identity with scale rules, see [Set scaling rules in Azure Container Apps](scale-app.md?pivots=azure-portal#authentication-2).

## Control managed identity availability

Container Apps allows you to specify [init containers](containers.md#init-containers) and main containers. By default, both main and init containers in a consumption workload profile environment can use managed identity to access other Azure services. In consumption-only environments and dedicated workload profile environments, only main containers can use managed identity. Managed identity access tokens are available for every managed identity configured on the container app. However, in some situations only the init container or the main container require access tokens for a managed identity. Other times, you may use a managed identity only to access your Azure Container Registry to pull the container image, and your application itself doesn't need to have access to your Azure Container Registry.

Starting in API version `2024-02-02-preview`, you can control which managed identities are available to your container app during the init and main phases to follow the security principle of least privilege. The following options are available:

- `Init`: Available only to init containers. Use this when you want to perform some initialization work that requires a managed identity, but you no longer need the managed identity in the main container. This option is currently only supported in [workload profile consumption environments](environment.md#types)
- `Main`: Available only to main containers. Use this if your init container does not need managed identity.
- `All`: Available to all containers. This value is the default setting.
- `None`: Not available to any containers. Use this when you have a managed identity that is only used for ACR image pull, scale rules, or Key Vault secrets and does not need to be available to the code running in your containers.

The following ARM template example shows how to configure a container app on a workload profile consumption environment that:

- Restricts the container app's system-assigned identity to main containers only.
- Restricts a specific user-assigned identity to init containers only.
- Uses a specific user-assigned identity for Azure Container Registry image pull without allowing the code in the containers to use that managed identity to access the registry. In this example, the containers themselves don't need to access the registry.

This approach limits the resources that can be accessed if a malicious actor were to gain unauthorized access to the containers.

```json
{
    "location": "eastus2",
    "identity":{
    "type": "SystemAssigned, UserAssigned",
        "userAssignedIdentities": {
            "<IDENTITY1_RESOURCE_ID>":{},
            "<ACR_IMAGEPULL_IDENTITY_RESOURCE_ID>":{}
         }
     },
    "properties": {
        "workloadProfileName":"Consumption",
        "environmentId": "<CONTAINER_APPS_ENVIRONMENT_ID>",
        "configuration": {
            "registries": [
            {
                "server": "myregistry.azurecr.io",
                "identity": "ACR_IMAGEPULL_IDENTITY_RESOURCE_ID"
            }],
            "identitySettings":[
            {
                "identity": "ACR_IMAGEPULL_IDENTITY_RESOURCE_ID",
                "lifecycle": "None"
            },
            {
                "identity": "<IDENTITY1_RESOURCE_ID>",
                "lifecycle": "Init"
            },
            {
                "identity": "system",
                "lifecycle": "Main"
            }]
        },
        "template": {
            "containers":[
                {
                    "image":"myregistry.azurecr.io/main:1.0",
                    "name":"app-main"
                }
            ],
            "initContainers":[
                {
                    "image":"myregistry.azurecr.io/init:1.0",
                    "name":"app-init",
                }
            ]
        }
    }
}
```

## View managed identities

You can show the system-assigned and user-assigned managed identities using the following Azure CLI command. The output shows the managed identity type, tenant IDs and principal IDs of all managed identities assigned to your container app.

```azurecli
az containerapp identity show --name <APP_NAME> --resource-group <GROUP_NAME>
```

## Remove a managed identity

When you remove a system-assigned identity, it's deleted from Microsoft Entra ID. System-assigned identities are also automatically removed from Microsoft Entra ID when you delete the container app resource itself. Removing user-assigned managed identities from your container app doesn't remove them from Microsoft Entra ID.

# [Azure portal](#tab/portal)

1. In the left navigation of your app's page, scroll down to the **Settings** group.

1. Select **Identity**. Then follow the steps based on the identity type:

   - **System-assigned identity**: Within the **System assigned** tab, switch **Status** to **Off**. Select **Save**.
   - **User-assigned identity**: Select the **User assigned** tab, select the checkbox for the identity, and select **Remove**. Select **Yes** to confirm.

# [Azure CLI](#tab/cli)

To remove the system-assigned identity:

```azurecli
az containerapp identity remove --name <APP_NAME> --resource-group <GROUP_NAME> --system-assigned
```

To remove one or more user-assigned identities:

```azurecli
az containerapp identity remove --name <APP_NAME> --resource-group <GROUP_NAME> \
    --user-assigned <IDENTITY1_RESOURCE_ID> <IDENTITY2_RESOURCE_ID>
```

To remove all user-assigned identities:

```azurecli
az containerapp identity remove --name <APP_NAME> --resource-group <GROUP_NAME> \
    --user-assigned <IDENTITY1_RESOURCE_ID> <IDENTITY2_RESOURCE_ID>
```

# [ARM template](#tab/arm)

To remove all identities, set the `type` of the container app's identity to `None` in the ARM template:

```json
"identity": {
    "type": "None"
}
```

# [YAML](#tab/yaml)

To remove all identities, set the `type` of the container app's identity to `None` in the YAML configuration file:

```yaml
identity:
    type: None
```

# [Bicep](#tab/bicep)

To remove all identities, set the `type` of the container app's identity to `None` in the Bicep template:

```bicep
identity: {
  type: 'None'
}
```

---

## Next steps

> [!div class="nextstepaction"]
> [Monitor an app](monitor.md)
