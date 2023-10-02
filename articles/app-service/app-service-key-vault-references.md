---
title: Use Key Vault references
description: Learn how to set up Azure App Service and Azure Functions to use Azure Key Vault references. Make Key Vault secrets available to your application code.
author: cephalin

ms.topic: article
ms.date: 07/31/2023
ms.author: cephalin
ms.custom: seodec18, AppServiceConnectivity

---

# Use Key Vault references as app settings in Azure App Service and Azure Functions

This article shows you how to use secrets from Azure Key Vault as values of [app settings](configure-common.md#configure-app-settings) or [connection strings](configure-common.md#configure-connection-strings) in your App Service or Azure Functions apps. 

[Azure Key Vault](../key-vault/general/overview.md) is a service that provides centralized secrets management, with full control over access policies and audit history. When an app setting or connection string is a key vault reference, your application code can use it like any other app setting or connection string. This way, you can maintain secrets apart from your app's configuration. App settings are securely encrypted at rest, but if you need secret management capabilities, they should go into a key vault.

## Grant your app access to a key vault

In order to read secrets from a key vault, you need to have a vault created and give your app permission to access it.

1. Create a key vault by following the [Key Vault quickstart](../key-vault/secrets/quick-create-cli.md).

1. Create a [managed identity](overview-managed-identity.md) for your application.

    Key vault references use the app's system-assigned identity by default, but you can [specify a user-assigned identity](#access-vaults-with-a-user-assigned-identity).

1. Authorize [read access to secrets your key vault](../key-vault/general/security-features.md#privileged-access) for the managed identity you created earlier. How you do it depends on the permissions model of your key vault:

    - **Azure role-based access control**: Assign the **Key Vault Secrets User** role to the managed identity. For instructions, see [Provide access to Key Vault keys, certificates, and secrets with an Azure role-based access control](../key-vault/general/rbac-guide.md).
    - **Vault access policy**: Assign the **Get** secrets permission to the managed identity. For instructions, see [Assign a Key Vault access policy](../key-vault/general/assign-access-policy.md).

### Access network-restricted vaults

If your vault is configured with [network restrictions](../key-vault/general/overview-vnet-service-endpoints.md), ensure that the application has network access. Vaults shouldn't depend on the app's public outbound IPs because the origin IP of the secret request could be different. Instead, the vault should be configured to accept traffic from a virtual network used by the app.

1. Make sure the application has outbound networking capabilities configured, as described in [App Service networking features](./networking-features.md) and [Azure Functions networking options](../azure-functions/functions-networking-options.md).

    Linux applications that connect to private endpoints must be explicitly configured to route all traffic through the virtual network. This requirement will be removed in a forthcoming update. To configure this setting, run the following command:

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az webapp config set --subscription <sub> -g <group-name> -n <app-name> --generic-configurations '{"vnetRouteAllEnabled": true}'
    ```
    
    # [Azure PowerShell](#tab/azure-powershell) 

    ```azurepowershell
    Update-AzFunctionAppSetting -Name <app-name> -ResourceGroupName <group-name> -AppSetting @{vnetRouteAllEnabled = $true}
    ```
    
    ---

2. Make sure that the vault's configuration allows the network or subnet that your app uses to access it.

### Access vaults with a user-assigned identity

Some apps need to reference secrets at creation time, when a system-assigned identity isn't available yet. In these cases, a user-assigned identity can be created and given access to the vault in advance.

Once you have granted permissions to the user-assigned identity, follow these steps:

1. [Assign the identity](./overview-managed-identity.md#add-a-user-assigned-identity) to your application if you haven't already.

1. Configure the app to use this identity for key vault reference operations by setting the `keyVaultReferenceIdentity` property to the resource ID of the user-assigned identity.

    # [Azure CLI](#tab/azure-cli)
    
    ```azurecli-interactive
    identityResourceId=$(az identity show --resource-group <group-name> --name <identity-name> --query id -o tsv)
    az webapp update --resource-group <group-name> --name <app-name> --set keyVaultReferenceIdentity=${identityResourceId}
    ```
    # [Azure PowerShell](#tab/azure-powershell) 
    
    ```azurepowershell-interactive   
    $identityResourceId = Get-AzUserAssignedIdentity -ResourceGroupName <group-name> -Name MyUserAssignedIdentityName | Select-Object -ExpandProperty Id
    $appResourceId = Get-AzFunctionApp -ResourceGroupName <group-name> -Name <app-name> | Select-Object -ExpandProperty Id
    
    $Path = "{0}?api-version=2021-01-01" -f $appResourceId
    Invoke-AzRestMethod -Method PATCH -Path $Path -Payload "{'properties':{'keyVaultReferenceIdentity':'$identityResourceId'}}"
    ```
    
    ---

This setting applies to all key vault references for the app.

## Rotation

If the secret version isn't specified in the reference, the app uses the latest version that exists in the key vault. When newer versions become available, such as with a rotation event, the app automatically updates and begins using the latest version within 24 hours. The delay is because App Service caches the values of the key vault references and refetches it every 24 hours. Any configuration change to the app causes an app restart and an immediate refetch of all referenced secrets.

## Source app settings from key vault

To use a key vault reference, set the reference as the value of the setting. Your app can reference the secret through its key as normal. No code changes are required.

> [!TIP]
> Most app settings using key vault references should be marked as slot settings, as you should have separate vaults for each environment.

A key vault reference is of the form `@Microsoft.KeyVault({referenceString})`, where `{referenceString}` is in one of the following formats:

> [!div class="mx-tdBreakAll"]
> | Reference string                                                            | Description                                                                                                                                                                                 |
> |-----------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
> | SecretUri=_secretUri_                                                       | The **SecretUri** should be the full data-plane URI of a secret in the vault, optionally including a version, e.g., `https://myvault.vault.azure.net/secrets/mysecret/` or `https://myvault.vault.azure.net/secrets/mysecret/ec96f02080254f109c51a1f14cdb1931`  |
> | VaultName=_vaultName_;SecretName=_secretName_;SecretVersion=_secretVersion_ | The **VaultName** is required and is the vault name. The **SecretName** is required and is the secret name. The **SecretVersion** is optional but if present indicates the version of the secret to use. |

For example, a complete reference would look like the following string:

```
@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/)
```

Alternatively:

```
@Microsoft.KeyVault(VaultName=myvault;SecretName=mysecret)
```

### Considerations for Azure Files mounting

Apps can use the `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` application setting to mount [Azure Files](../storage/files/storage-files-introduction.md) as the file system. This setting has validation checks to ensure that the app can be properly started. The platform relies on having a content share within Azure Files, and it assumes a default name unless one is specified via the `WEBSITE_CONTENTSHARE` setting. For any requests that modify these settings, the platform validates if this content share exists, and attempts to create it if not. If it can't locate or create the content share, it blocks the request.

When you use key vault references in this setting, the validation check fails by default, because the secret itself can't be resolved while processing the incoming request. To avoid this issue, you can skip the validation by setting `WEBSITE_SKIP_CONTENTSHARE_VALIDATION` to "1". This setting tells App Service to bypass all checks, and doesn't create the content share for you. You should ensure that it's created in advance. 

> [!CAUTION]
> If you skip validation and either the connection string or content share are invalid, the app will be unable to start properly and will only serve HTTP 500 errors.

As part of creating the app, attempted mounting of the content share could fail due to managed identity permissions not being propagated or the virtual network integration not being set up. You can defer setting up Azure Files until later in the deployment template to accommodate this. See [Azure Resource Manager deployment](#azure-resource-manager-deployment) to learn more. In this case, App Service uses a default file system until Azure Files is set up, and files aren't copied over. You must ensure that no deployment attempts occur during the interim period before Azure Files is mounted.

### Considerations for Application Insights instrumentation

Apps can use the `APPINSIGHTS_INSTRUMENTATIONKEY` or `APPLICATIONINSIGHTS_CONNECTION_STRING` application settings to integrate with [Application Insights](../azure-monitor/app/app-insights-overview.md). The portal experiences for App Service and Azure Functions also use these settings to surface telemetry data from the resource. If these values are referenced from Key Vault, these experiences aren't available, and you instead need to work directly with the Application Insights resource to view the telemetry. However, these values are [not considered secrets](../azure-monitor/app/sdk-connection-string.md#is-the-connection-string-a-secret), so you might alternatively consider configuring them directly instead of using key vault references.

### Azure Resource Manager deployment

When automating resource deployments through Azure Resource Manager templates, you may need to sequence your dependencies in a particular order to make this feature work. Be sure to define your app settings as their own resource, rather than using a `siteConfig` property in the app definition. This is because the app needs to be defined first so that the system-assigned identity is created with it and can be used in the access policy.

The following pseudo-template is an example of what a function app might look like:

```json
{
    //...
    "resources": [
        {
            "type": "Microsoft.Storage/storageAccounts",
            "name": "[variables('storageAccountName')]",
            //...
        },
        {
            "type": "Microsoft.Insights/components",
            "name": "[variables('appInsightsName')]",
            //...
        },
        {
            "type": "Microsoft.Web/sites",
            "name": "[variables('functionAppName')]",
            "identity": {
                "type": "SystemAssigned"
            },
            //...
            "resources": [
                {
                    "type": "config",
                    "name": "appsettings",
                    //...
                    "dependsOn": [
                        "[resourceId('Microsoft.Web/sites', variables('functionAppName'))]",
                        "[resourceId('Microsoft.KeyVault/vaults/', variables('keyVaultName'))]",
                        "[resourceId('Microsoft.KeyVault/vaults/secrets', variables('keyVaultName'), variables('storageConnectionStringName'))]",
                        "[resourceId('Microsoft.KeyVault/vaults/secrets', variables('keyVaultName'), variables('appInsightsKeyName'))]"
                    ],
                    "properties": {
                        "AzureWebJobsStorage": "[concat('@Microsoft.KeyVault(SecretUri=', reference(variables('storageConnectionStringName')).secretUriWithVersion, ')')]",
                        "WEBSITE_CONTENTAZUREFILECONNECTIONSTRING": "[concat('@Microsoft.KeyVault(SecretUri=', reference(variables('storageConnectionStringName')).secretUriWithVersion, ')')]",
                        "APPINSIGHTS_INSTRUMENTATIONKEY": "[concat('@Microsoft.KeyVault(SecretUri=', reference(variables('appInsightsKeyName')).secretUriWithVersion, ')')]",
                        "WEBSITE_ENABLE_SYNC_UPDATE_SITE": "true"
                        //...
                    }
                },
                {
                    "type": "sourcecontrols",
                    "name": "web",
                    //...
                    "dependsOn": [
                        "[resourceId('Microsoft.Web/sites', variables('functionAppName'))]",
                        "[resourceId('Microsoft.Web/sites/config', variables('functionAppName'), 'appsettings')]"
                    ],
                }
            ]
        },
        {
            "type": "Microsoft.KeyVault/vaults",
            "name": "[variables('keyVaultName')]",
            //...
            "dependsOn": [
                "[resourceId('Microsoft.Web/sites', variables('functionAppName'))]"
            ],
            "properties": {
                //...
                "accessPolicies": [
                    {
                        "tenantId": "[reference(resourceId('Microsoft.Web/sites/', variables('functionAppName')), '2020-12-01', 'Full').identity.tenantId]",
                        "objectId": "[reference(resourceId('Microsoft.Web/sites/', variables('functionAppName')), '2020-12-01', 'Full').identity.principalId]",
                        "permissions": {
                            "secrets": [ "get" ]
                        }
                    }
                ]
            },
            "resources": [
                {
                    "type": "secrets",
                    "name": "[variables('storageConnectionStringName')]",
                    //...
                    "dependsOn": [
                        "[resourceId('Microsoft.KeyVault/vaults/', variables('keyVaultName'))]",
                        "[resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))]"
                    ],
                    "properties": {
                        "value": "[concat('DefaultEndpointsProtocol=https;AccountName=', variables('storageAccountName'), ';AccountKey=', listKeys(variables('storageAccountResourceId'),'2019-09-01').key1)]"
                    }
                },
                {
                    "type": "secrets",
                    "name": "[variables('appInsightsKeyName')]",
                    //...
                    "dependsOn": [
                        "[resourceId('Microsoft.KeyVault/vaults/', variables('keyVaultName'))]",
                        "[resourceId('Microsoft.Insights/components', variables('appInsightsName'))]"
                    ],
                    "properties": {
                        "value": "[reference(resourceId('microsoft.insights/components/', variables('appInsightsName')), '2019-09-01').InstrumentationKey]"
                    }
                }
            ]
        }
    ]
}
```

> [!NOTE] 
> In this example, the source control deployment depends on the application settings. This is normally unsafe behavior, as the app setting update behaves asynchronously. However, because we have included the `WEBSITE_ENABLE_SYNC_UPDATE_SITE` application setting, the update is synchronous. This means that the source control deployment will only begin once the application settings have been fully updated. For more app settings, see [Environment variables and app settings in Azure App Service](reference-app-settings.md).

## Troubleshooting key vault references

If a reference isn't resolved properly, the reference string is used instead (for example, `@Microsoft.KeyVault(...)`). It may cause the application to throw errors, because it's expecting a secret of a different value.

Failure to resolve is commonly due to a misconfiguration of the [Key Vault access policy](#grant-your-app-access-to-a-key-vault). However, it could also be due to a secret no longer existing or a syntax error in the reference itself.

If the syntax is correct, you can view other causes for error by checking the current resolution status in the portal. Navigate to Application Settings and select "Edit" for the reference in question. The edit dialog shows status information, including any errors. If you don't see the status message, it means that the syntax is invalid and not recognized as a key vault reference.

You can also use one of the built-in detectors to get additional information.

### Using the detector for App Service

1. In the portal, navigate to your app.
2. Select **Diagnose and solve problems**.
3. Choose **Availability and Performance** and select **Web app down**.
4. In the search box, search for and select **Key Vault Application Settings Diagnostics**.

### Using the detector for Azure Functions

1. In the portal, navigate to your app.
2. Navigate to **Platform features**.
3. Select **Diagnose and solve problems**.
4. Choose **Availability and Performance** and select **Function app down or reporting errors**.
5. Select **Key Vault Application Settings Diagnostics**.
