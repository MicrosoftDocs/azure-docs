---
title: Use App Configuration References
description: Learn how to set up Azure App Service and Azure Functions to use Azure App Configuration references. Make App Configuration key/value pairs available to your application code without changing it.
author: muksvso

ms.topic: how-to
ms.date: 06/21/2022
ms.author: mubatra

---

# Use App Configuration references for Azure App Service and Azure Functions

This article shows you how to work with configuration data in your Azure App Service or Azure Functions application without making any code changes. [Azure App Configuration](../azure-app-configuration/overview.md) is an Azure service you can use to centrally manage application configuration. It's also an effective audit tool for your configuration values over time or across releases.

## Grant app access to App Configuration

To get started with using App Configuration references in App Service, first you create an App Configuration store. Then, you grant permissions to your app to access the configuration key/value pairs that are in the store.

1. To create an App Configuration store, complete the [App Configuration quickstart](../azure-app-configuration/quickstart-azure-app-configuration-create.md).

1. Create a [managed identity](overview-managed-identity.md) for your application.

    App Configuration references use the app's system-assigned identity by default, but you can [specify a user-assigned identity](#access-the-app-configuration-store-with-a-user-assigned-identity).

1. Grant the correct set of access permissions to the App Configuration store to the identity. Update the [role assignments for your store](../azure-app-configuration/howto-integrate-azure-managed-service-identity.md#grant-access-to-app-configuration). You assign the App Configuration Data Reader role to this identity, scoped over the resource.

### Access the App Configuration store with a user-assigned identity

Some apps might need to reference configuration when you create the apps, but a system-assigned identity wouldn't yet be available. In this scenario, you can [create a user-assigned identity for the App Configuration store](../azure-app-configuration/overview-managed-identity.md#adding-a-user-assigned-identity) in advance.

After you grant permissions to the user-assigned identity, complete these steps:

1. [Assign the identity](./overview-managed-identity.md#add-a-user-assigned-identity) to your application.

1. Configure the app to use this identity for App Configuration reference operations by setting the `keyVaultReferenceIdentity` property to the resource ID of the user-assigned identity. Although the property has `keyVault` in the name, the identity also applies to App Configuration references.

    ```azurecli-interactive
    userAssignedIdentityResourceId=$(az identity show -g MyResourceGroupName -n MyUserAssignedIdentityName --query id -o tsv)
    appResourceId=$(az webapp show -g MyResourceGroupName -n MyAppName --query id -o tsv)
    az rest --method PATCH --uri "${appResourceId}?api-version=2021-01-01" --body "{'properties':{'keyVaultReferenceIdentity':'${userAssignedIdentityResourceId}'}}"
    ```

This configuration applies to all references from this app.

## Grant your app access to referenced key vaults

In addition to storing raw configuration values, Azure App Configuration has its own format for storing [Azure Key Vault references][app-config-key-vault-references]. If the value of an App Configuration reference is a Key Vault reference in the App Configuration store, your app also must have permissions to access the key vault that is specified in the reference.

> [!NOTE]
> The [App Configuration Key Vault references concept][app-config-key-vault-references] shouldn't be confused with [the App Service and Azure Functions Key Vault references concept][app-service-key-vault-references]. Your app can use any combination of these references, but there are some important differences. If your vault needs to be network restricted or if you need the app to periodically update to latest versions, consider using the App Service and Azure Functions direct approach instead of using an App Configuration reference.

[app-config-key-vault-references]: ../azure-app-configuration/use-key-vault-references-dotnet-core.md
[app-service-key-vault-references]: app-service-key-vault-references.md

1. Identify the identity that you used for the App Configuration reference. You must grant vault access to the same identity.

1. Create an [access policy in Key Vault](/azure/key-vault/general/security-features#privileged-access) for that identity. Enable the *Get* secret permission on this policy. Don't configure the *authorized application* or the `applicationId` settings because they aren't compatible with a managed identity.

## Reference syntax

An App Configuration reference has the form `@Microsoft.AppConfiguration({referenceString})`, where `{referenceString}` is replaced by a value as described in the following table:

> [!div class="mx-tdBreakAll"]
>
> | Reference string parts                                                           | Description                                                                                                                                                                                 |
> |-----------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
> | `Endpoint` = *endpointURL* | `Endpoint` is the required part of the reference string. The value for `Endpoint` should include the URL of your App Configuration resource. |
> | `Key` = *myAppConfigKey* |  `Key` forms the required part of the reference string. The value for `Key` is the name of the key that you want to assign to the app setting. |
> | `Label` = *myKeyLabel* | `Label` is optional in the reference string. `Label` should be the value of the key label specified in `Key`. |

Here's an example of a complete reference that includes `Label`:

```json
@Microsoft.AppConfiguration(Endpoint=https://myAppConfigStore.azconfig.io; Key=myAppConfigKey; Label=myKeyLabel)​
```

Here's an example that doesn't include `Label`:

```json
@Microsoft.AppConfiguration(Endpoint=https://myAppConfigStore.azconfig.io; Key=myAppConfigKey)​
```

Any configuration change to the app that results in a site restart causes an immediate refetch of all referenced key/value pairs from the App Configuration store.

> [!NOTE]
> Automatic refresh and refetch of these values when the key/value pairs are updated in App Configuration currently isn't supported.

## Source application settings from App Configuration

You can use App Configuration references as values for [application settings](configure-common.md#configure-app-settings), so you can keep configuration data in App Configuration instead of in the site configuration settings. Application settings and App Configuration key/value pairs both are securely encrypted at rest. If you need centralized configuration management capabilities, add configuration data to App Configuration.

To use an App Configuration reference for an [app setting](configure-common.md#configure-app-settings), set the reference as the value of the setting. Your app can reference the Configuration value through its key as usual. No code changes are required.

> [!TIP]
> Most application settings that use App Configuration references should be marked as slot settings so that you have separate stores or labels for each environment.

### Considerations for mounting Azure Files

Apps can use the `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` application setting to mount Azure Files as the file system. This setting has additional validation checks to ensure that the app can start properly. The platform relies on having a content share within Azure Files, and it assumes a default name unless one is specified in the `WEBSITE_CONTENTSHARE` setting. For any requests that modify these settings, the platform attempts to validate that the content share exists. If the share doesn't exist, the platform attempts to create the share. If it can't locate or create the content share, the request is blocked.

If you use App Configuration references for this setting, this validation check fails by default because the connection itself can't be resolved while the platform processes the incoming request. To avoid this issue, you can skip the validation by setting `WEBSITE_SKIP_CONTENTSHARE_VALIDATION` to `1`. This setting bypasses all checks, and the content share isn't automatically created. You must ensure that the share is created in advance.

> [!CAUTION]
> If you skip validation and either the connection string or the content share is invalid, the app can't start properly and serves only HTTP 500 errors.

As part of creating the site, mounting the content share might fail if managed identity permissions aren't propagated or if the virtual network integration isn't set up. You can defer setting up Azure Files until later in the deployment template to accommodate for the required setup. For more information, see [Azure Resource Manager deployment](#azure-resource-manager-deployment). App Service uses only a default file system until Azure Files is set up, and files aren't copied over. Ensure that no deployment attempts occur during the interim period before Azure Files is mounted.

### Azure Resource Manager deployment

If you automate resource deployments by using Azure Resource Manager templates, you might need to sequence your dependencies in a specific order to make this feature work. In that scenario, you must define your application settings as their own resource instead of using a `siteConfig` property in the site definition. The site must be defined first so that the system-assigned identity is created with the site. The managed identity is then used in the access policy.

Here's a demonstration template for a function app that has App Configuration references:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "roleNameGuid": {
            "type": "string",
            "defaultValue": "[newGuid()]",
            "metadata": {
                "description": "A new GUID used to identify the role assignment"
            }
        }
    },
    "variables": {
        "functionAppName": "DemoMBFunc",
        "appConfigStoreName": "DemoMBAppConfig",
        "resourcesRegion": "West US2",
        "appConfigSku": "standard",
        "FontNameKey": "FontName",
        "FontColorKey": "FontColor",
        "myLabel": "Test",
        "App Configuration Data Reader": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', '516239f1-63e1-4d78-a4de-a74fb236a071')]"
    },
    "resources": [
        {
            "type": "Microsoft.Web/sites",
            "name": "[variables('functionAppName')]",
            "apiVersion": "2021-03-01",
            "location": "[variables('resourcesRegion')]",
            "identity": {
                "type": "SystemAssigned"
            },
            //...
            "resources": [
                {
                    "type": "config",
                    "name": "appsettings",
                    "apiVersion": "2021-03-01",
                    //...
                    "dependsOn": [
                        "[resourceId('Microsoft.Web/sites', variables('functionAppName'))]",
                        "[resourceId('Microsoft.AppConfiguration/configurationStores', variables('appConfigStoreName'))]"
                    ],
                    "properties": {
                        "WEBSITE_FONTNAME": "[concat('@Microsoft.AppConfiguration(Endpoint=', reference(resourceId('Microsoft.AppConfiguration/configurationStores', variables('appConfigStoreName'))).endpoint,'; Key=',variables('FontNameKey'),'; Label=',variables('myLabel'), ')')]",
                        "WEBSITE_FONTCOLOR": "[concat('@Microsoft.AppConfiguration(Endpoint=', reference(resourceId('Microsoft.AppConfiguration/configurationStores', variables('appConfigStoreName'))).endpoint,'; Key=',variables('FontColorKey'),'; Label=',variables('myLabel'), ')')]",
                        "WEBSITE_ENABLE_SYNC_UPDATE_SITE": "true"
                        //...
                    }
                },
                {
                    "type": "sourcecontrols",
                    "name": "web",
                    "apiVersion": "2021-03-01",
                    //...
                    "dependsOn": [
                        "[resourceId('Microsoft.Web/sites', variables('functionAppName'))]",
                        "[resourceId('Microsoft.Web/sites/config', variables('functionAppName'), 'appsettings')]"
                    ]
                }
            ]
        },
        {
            "type": "Microsoft.AppConfiguration/configurationStores",
            "name": "[variables('appConfigStoreName')]",
            "apiVersion": "2019-10-01",
            "location": "[variables('resourcesRegion')]",
            "sku": {
                "name": "[variables('appConfigSku')]"
            },
            //...
            "dependsOn": [
                "[resourceId('Microsoft.Web/sites', variables('functionAppName'))]"
            ],
            "properties": {
            },
            "resources": [
                {
                    "type": "keyValues",
                    "name": "[variables('FontNameKey')]",
                    "apiVersion": "2021-10-01-preview",
                    //...
                    "dependsOn": [
                        "[resourceId('Microsoft.AppConfiguration/configurationStores', variables('appConfigStoreName'))]"

                    ],
                    "properties": {
                        "value": "Calibri",
                        "contentType": "application/json"
                    }
                },
                {
                    "type": "keyValues",
                    "name": "[variables('FontColorKey')]",
                    "apiVersion": "2021-10-01-preview",
                    //...
                    "dependsOn": [
                        "[resourceId('Microsoft.AppConfiguration/configurationStores', variables('appConfigStoreName'))]"

                    ],
                    "properties": {
                        "value": "Blue",
                        "contentType": "application/json"
                    }
                }
            ]
        },
        {
            "scope": "[resourceId('Microsoft.AppConfiguration/configurationStores', variables('appConfigStoreName'))]",
            "type": "Microsoft.Authorization/roleAssignments",
            "apiVersion": "2020-04-01-preview",
            "name": "[parameters('roleNameGuid')]",
            "properties": {
                "roleDefinitionId": "[variables('App Configuration Data Reader')]",
                "principalId": "[reference(resourceId('Microsoft.Web/sites/', variables('functionAppName')), '2020-12-01', 'Full').identity.principalId]",
                "principalType": "ServicePrincipal"
            }
        }
    ]
}
```

> [!NOTE]
> In this example, source control deployment depends on the application settings. In most scenarios, this sequence is less secure because app settings updates asynchronously. But because we included the `WEBSITE_ENABLE_SYNC_UPDATE_SITE` application setting, the update is synchronous. Source control deployment begins only after the application settings are fully updated. For more information about app settings, see [Environment variables and app settings in Azure App Service](reference-app-settings.md).

## Troubleshoot app configuration references

If a reference isn't resolved properly, the reference value is used instead. For an application setting in this scenario, an environment variable that uses the syntax `@Microsoft.AppConfiguration(...)` is created. The reference might cause an error because the application was expecting a configuration value.

This error most commonly is the result of a misconfiguration of the [App Configuration access policy](#grant-app-access-to-app-configuration). But it also might occur if there's a syntax error in the reference or if the configuration key/value pair doesn't exist in the store.

## Related content

- [Reference Key Vault secrets from App Service](./app-service-key-vault-references.md)
