---
title: Use App Configuration references (Preview)
description: Learn how to set up Azure App Service and Azure Functions to use Azure App Configuration references. Make App Configuration key-values available to your application code without changing it.
author: muksvso

ms.topic: article
ms.date: 06/21/2022
ms.author: mubatra

---

# Use App Configuration references for App Service and Azure Functions (preview)

This topic shows you how to work with configuration data in your App Service or Azure Functions application without requiring any code changes. [Azure App Configuration](../azure-app-configuration/overview.md) is a service to centrally manage application configuration. Additionally, it's an effective audit tool for your configuration values over time or releases.

## Granting your app access to App Configuration

To get started with using App Configuration references in App Service, you'll first need  an App Configuration store, and provide your app permission to access the configuration key-values in the store.

1. Create an App Configuration store by following the [App Configuration quickstart](../azure-app-configuration/quickstart-azure-app-configuration-create.md).

    > [!NOTE]
    > App Configuration references do not yet support network-restricted configuration stores.

1. Create a [managed identity](overview-managed-identity.md) for your application.

    App Configuration references will use the app's system assigned identity by default, but you can [specify a user-assigned identity](#access-app-configuration-store-with-a-user-assigned-identity).

1. Enable the newly created identity to have the right set of access permissions on the App Configuration store. Update the [role assignments for your store](../azure-app-configuration/howto-integrate-azure-managed-service-identity.md#grant-access-to-app-configuration). You'll be assigning `App Configuration Data Reader` role to this identity, scoped over the resource.

### Access App Configuration Store with a user-assigned identity

Some apps might need to reference configuration at creation time, when a system-assigned identity wouldn't yet be available. In these cases, a user-assigned identity can be created and given access to the App Configuration store, in advance. Follow these steps to [create user-assigned identity for App Configuration store](../azure-app-configuration/overview-managed-identity.md#adding-a-user-assigned-identity).

Once you have granted permissions to the user-assigned identity, follow these steps:

1. [Assign the identity](./overview-managed-identity.md#add-a-user-assigned-identity) to your application if you haven't already.

1. Configure the app to use this identity for App Configuration reference operations by setting the `keyVaultReferenceIdentity` property to the resource ID of the user-assigned identity. Though the property has keyVault in the name, the identity will apply to App Configuration references as well.

    ```azurecli-interactive
    userAssignedIdentityResourceId=$(az identity show -g MyResourceGroupName -n MyUserAssignedIdentityName --query id -o tsv)
    appResourceId=$(az webapp show -g MyResourceGroupName -n MyAppName --query id -o tsv)
    az rest --method PATCH --uri "${appResourceId}?api-version=2021-01-01" --body "{'properties':{'keyVaultReferenceIdentity':'${userAssignedIdentityResourceId}'}}"
    ```

This configuration will apply to all references from this App.

## Granting your app access to referenced key vaults

In addition to storing raw configuration values, Azure App Configuration has its own format for storing [Key Vault references][app-config-key-vault-references]. If the value of an App Configuration reference is a Key Vault reference in App Configuration store, your app will also need to have permission to access the key vault being specified.

> [!NOTE]
> [The Azure App Configuration Key Vault references concept][app-config-key-vault-references] should not be confused with [the App Service and Azure Functions Key Vault references concept][app-service-key-vault-references]. Your app may use any combination of these, but there are some important differences to note. If your vault needs to be network restricted or you need the app to periodically update to latest versions, consider using the App Service and Azure Functions direct approach instead of using an App Configuration reference.

[app-config-key-vault-references]: ../azure-app-configuration/use-key-vault-references-dotnet-core.md
[app-service-key-vault-references]: app-service-key-vault-references.md

1. Identify the identity that you used for the App Configuration reference. Access to the vault must be granted to that same identity.

1. Create an [access policy in Key Vault](../key-vault/general/security-features.md#privileged-access) for that identity. Enable the "Get" secret permission on this policy. Do not configure the "authorized application" or `applicationId` settings, as this is not compatible with a managed identity.

## Reference syntax

An App Configuration reference is of the form `@Microsoft.AppConfiguration({referenceString})`, where `{referenceString}` is replaced by below:

> [!div class="mx-tdBreakAll"]
> | Reference string parts                                                           | Description                                                                                                                                                                                 |
> |-----------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
> | Endpoint=_endpoint_; | **Endpoint** is the required part of the reference string. The value for **Endpoint** should have the url of your App Configuration resource.|
> | Key=_keyName_; |  **Key** forms the required part of the reference string. Value for **Key** should be the name of the Key that you want to assign to the App setting.
> | Label=_label_ | The **Label** part is optional in reference string. **Label** should be the value of Label for the Key specified in **Key**

For example, a complete reference with `Label` would look like the following,

```
@Microsoft.AppConfiguration(Endpoint=https://myAppConfigStore.azconfig.io; Key=myAppConfigKey; Label=myKeysLabel)​
```

Alternatively without any `Label`:

```
@Microsoft.AppConfiguration(Endpoint=https://myAppConfigStore.azconfig.io; Key=myAppConfigKey)​
```

Any configuration change to the app that results in a site restart causes an immediate refetch of all referenced key-values from the App Configuration store.

## Source Application Settings from App Config

App Configuration references can be used as values for [Application Settings](configure-common.md#configure-app-settings), allowing you to keep configuration data in App Configuration instead of the site config. Application Settings and App Configuration key-values both are securely encrypted at rest. If you need centralized configuration management capabilities, then configuration data should go into App Config.

To use an App Configuration reference for an [app setting](configure-common.md#configure-app-settings), set the reference as the value of the setting. Your app can reference the Configuration value through its key as usual. No code changes are required.

> [!TIP]
> Most application settings using App Configuration references should be marked as slot settings, as you should have separate stores or labels for each environment.

### Considerations for Azure Files mounting

Apps can use the `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` application setting to mount Azure Files as the file system. This setting has additional validation checks to ensure that the app can be properly started. The platform relies on having a content share within Azure Files, and it assumes a default name unless one is specified via the `WEBSITE_CONTENTSHARE` setting. For any requests that modify these settings, the platform will attempt to validate if this content share exists, and it will attempt to create it if not. If it can't locate or create the content share, the request is blocked.

If you use App Configuration references for this setting, this validation check will fail by default, as the connection itself can't be resolved while processing the incoming request. To avoid this issue, you can skip the validation by setting `WEBSITE_SKIP_CONTENTSHARE_VALIDATION` to "1". This setting will bypass all checks, and the content share won't be created for you. You should ensure it's created in advance.

> [!CAUTION]
> If you skip validation and either the connection string or content share are invalid, the app will be unable to start properly and will only serve HTTP 500 errors.

As part of creating the site, it's also possible that attempted mounting of the content share could fail due to managed identity permissions not being propagated or the virtual network integration not being set up. You can defer setting up Azure Files until later in the deployment template to accommodate for the required setup. See [Azure Resource Manager deployment](#azure-resource-manager-deployment) to learn more. App Service will use a default file system until Azure Files is set up, and files aren't copied over so make sure that no deployment attempts occur during the interim period before Azure Files is mounted.

### Azure Resource Manager deployment

When automating resource deployments through Azure Resource Manager templates, you may need to sequence your dependencies in a particular order to make this feature work. Of note, you'll need to define your application settings as their own resource, rather than using a `siteConfig` property in the site definition. This is because the site needs to be defined first so that the system-assigned identity is created with it and can be used in the access policy.

Below is an example pseudo-template for a function app with App Configuration references:

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
> In this example, the source control deployment depends on the application settings. This is normally unsafe behavior, as the app setting update behaves asynchronously. However, because we have included the `WEBSITE_ENABLE_SYNC_UPDATE_SITE` application setting, the update is synchronous. This means that the source control deployment will only begin once the application settings have been fully updated. For more app settings, see [Environment variables and app settings in Azure App Service](reference-app-settings.md).

## Troubleshooting App Configuration References

If a reference isn't resolved properly, the reference value will be used instead. For the application settings, an environment variable would be created whose value has the `@Microsoft.AppConfiguration(...)` syntax. It may cause an error, as the application was expecting a configuration value instead.

Most commonly, this error could be due to a misconfiguration of the [App Configuration access policy](#granting-your-app-access-to-app-configuration). However, it could also be due to a syntax error in the reference or the Configuration key-value not existing in the store.

## Next steps

> [!div class="nextstepaction"]
> [Reference Key vault secrets from App Service](./app-service-key-vault-references.md) 
