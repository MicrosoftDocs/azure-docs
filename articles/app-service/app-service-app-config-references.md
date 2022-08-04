---
title: Use App Config references (Preview)
description: Learn how to set up Azure App Service and Azure Functions to use Azure App Config references. Make Configuration available to your application code without changing it.
author: muksvso

ms.topic: article
ms.date: 06/21/2022
ms.author: mubatra

---

# Use App Config references for App Service and Azure Functions

This topic shows you how to work with configuration data in your App Service or Azure Functions application without requiring any code changes. [Azure App Config](../azure-app-configuration/overview.md) is a service to centrally manage application configuration. Additionally, it's an effective audit tool for your configuration values over time or releases.

## Granting your app access to App Config

To get started with using App Config references in App Service, you'll first need  an App Config store, and provide your app permission to access the configuration key-values in the store.

1. Create an App Config store by following the [App Config quickstart](../azure-app-configuration/quickstart-dotnet-core-app.md#create-an-app-configuration-store).

1. Create a [managed identity](overview-managed-identity.md) for your application.

    App Config references will use the app's system assigned identity by default, but you can [specify a user-assigned identity](#access App Config Store with a user-assigned identity).

1. Enable the newly created identity to have the right set of access permissions on the App Config store. Update [Access Control for App Config](../azure-app-configuration/howto-integrate-azure-managed-service-identity.md#grant-access-to-app-configuration). You'll be assigning `App Configuration Data Reader` role to this identity.

### Access network-restricted App Config stores

If your store is configured as [private access only](../azure-app-configuration/concept-private-endpoint.md), you'll need to ensure that the app service has network access.

1. Make sure the application has outbound networking capabilities configured, as described in [App Service networking features](./networking-features.md) and [Azure Functions networking options](../azure-functions/functions-networking-options.md).

    Linux applications using private endpoints, require that the app is explicitly configured to have all traffic route through the virtual network. This requirement will be removed in a forthcoming update. To set this vNet configuration, use the following CLI command:

    ```azurecli
    az webapp config set --subscription <sub> -g <rg> -n <appname> --generic-configurations '{"vnetRouteAllEnabled": true}'
    ```

2. Make sure that the App Config store's configuration accounts for the network or subnet through which your app will access it.

> [!NOTE]
> Windows container currently does not support App Config references over VNet Integration.

### Access App Config Store with a user-assigned identity

Some apps might need to reference configuration at creation time, when a system-assigned identity wouldn't yet be available. In these cases, a user-assigned identity can be created and given access to the App Config store, in advance. Follow these steps to [create user-assigned identity for App Config store](../azure-app-configuration/overview-managed-identity.md#adding-a-user-assigned-identity).

Once you have granted permissions to the user-assigned identity, follow these steps:

1. [Assign the identity](./overview-managed-identity.md#add-a-user-assigned-identity) to your application if you haven't already.

1. Configure the app to use this identity for App Config reference operations by setting the `appConfigReferenceIdentity` property to the resource ID of the user-assigned identity.

    ```azurecli-interactive
    userAssignedIdentityResourceId=$(az identity show -g MyResourceGroupName -n MyUserAssignedIdentityName --query id -o tsv)
    appResourceId=$(az webapp show -g MyResourceGroupName -n MyAppName --query id -o tsv)
    az rest --method PATCH --uri "${appResourceId}?api-version=2021-01-01" --body "{'properties':{'appConfigReferenceIdentity':'${userAssignedIdentityResourceId}'}}"
    ```

This configuration will apply to all App Config Store's references from this App.

## Reference syntax

An App Config reference is of the form `@Microsoft.AppConfig({referenceString})`, where `{referenceString}` is replaced by below:

> [!div class="mx-tdBreakAll"]
> | Reference string                                                            | Description                                                                                                                                                                                 |
> |-----------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
> | Endpoint=_endpoint_; Key=_KeyName_;Label=_label_ | The **Endpoint** is required and should be the  url of your App Config resource. The **Key** is required and should the name of your Key that you want to assign to the App setting. The **Label** is optional and should be the value of Label for the Key specified |

For example, a complete reference would look like the following:

```
@Microsoft.AppConfiguration(Endpoint=https://myAppConfigStore.azconfig.io; Key=myAppConfigKey; Label=myKeysLabel)​
```

Alternatively without any label:

```
@Microsoft.AppConfiguration(Endpoint=https://myAppConfigStore.azconfig.io; Key=myAppConfigKey)​
```

## Source Application Settings from App Config

App Config references can be used as values for [Application Settings](configure-common.md#configure-app-settings), allowing you to keep Configuration data in App Config instead of the site config. Application Settings are securely encrypted at rest, but if you need Centralized Configuration management capabilities, Dynamic configuration, then Config data should go into App Config.

To use an App Config reference for an [app setting](configure-common.md#configure-app-settings), set the reference as the value of the setting. Your app can reference the Configuration through its key as normal. No code changes are required.

> [!TIP]
> Most application settings using App Config references should be marked as slot settings, as you should have separate stores or labels for each environment.

> [!NOTE]
> An App Config reference pointing to Key vault reference type won't be resolved and the value will be used as-is. Support for same is planned for the future releases.

### Considerations for Azure Files mounting

Apps can use the `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` application setting to mount Azure Files as the file system. This setting has additional validation checks to ensure that the app can be properly started. The platform relies on having a content share within Azure Files, and it assumes a default name unless one is specified via the `WEBSITE_CONTENTSHARE` setting. For any requests that modify these settings, the platform will attempt to validate if this content share exists, and it will attempt to create it if not. If it can't locate or create the content share, the request is blocked.

If you use App Config references for this setting, this validation check will fail by default, as the connection itself can't be resolved while processing the incoming request. To avoid this issue, you can skip the validation by setting `WEBSITE_SKIP_CONTENTSHARE_VALIDATION` to "1". This setting will bypass all checks, and the content share won't be created for you. You should ensure it's created in advance.

> [!CAUTION]
> If you skip validation and either the connection string or content share are invalid, the app will be unable to start properly and will only serve HTTP 500 errors.

As part of creating the site, it's also possible that attempted mounting of the content share could fail due to managed identity permissions not being propagated or the virtual network integration not being set up. You can defer setting up Azure Files until later in the deployment template to accommodate for the required setup. See [Azure Resource Manager deployment](#azure-resource-manager-deployment) to learn more. App Service will use a default file system until Azure Files is set up, and files aren't copied over so make sure that no deployment attempts occur during the interim period before Azure Files is mounted.

### Azure Resource Manager deployment

When automating resource deployments through Azure Resource Manager templates, you may need to sequence your dependencies in a particular order to make this feature work. Of note, you'll need to define your application settings as their own resource, rather than using a `siteConfig` property in the site definition. This is because the site needs to be defined first so that the system-assigned identity is created with it and can be used in the access policy.

Below is an example pseudo-template for a function app with App Config references:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "variables": {
        "functionAppName": "DemoMBFunc",
        "appConfigStoreName": "DemoMBAppConfig",
        "resourcesRegion": "West US2",
        "appConfigSku": "standard",
        "FontNameKey": "FontName",
        "FontColorKey": "FontColor",
        "myLabel": "Test"
       
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
        }
    ]
}
```

> [!NOTE]
> In this example, the source control deployment depends on the application settings. This is normally unsafe behavior, as the app setting update behaves asynchronously. However, because we have included the `WEBSITE_ENABLE_SYNC_UPDATE_SITE` application setting, the update is synchronous. This means that the source control deployment will only begin once the application settings have been fully updated. For more app settings, see [Environment variables and app settings in Azure App Service](reference-app-settings.md).

## Troubleshooting App Config References

If a reference isn't resolved properly, the reference value will be used instead. For the application settings, an environment variable would be created whose value has the `@Microsoft.AppConfig(...)` syntax. It may cause an error, as the application was expecting a configuration value instead.

Most commonly, this error could be due to a misconfiguration of the [App Config access policy](#granting-your-app-access-to-app-config). However, it could also be due to a syntax error in the reference or the config key-value not existing in the store.
