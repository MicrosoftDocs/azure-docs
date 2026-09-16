---
title: Manage Authentication and Authorization API Versions
description: Learn how to upgrade your Azure App Service authentication API to V2 or pin it to a specific version.
ms.topic: how-to
ms.date: 03/19/2026
ms.custom: devx-track-azurecli, AppServiceIdentity
author: cephalin
ms.author: cephalin
ms.service: azure-app-service
# customer intent: As an app developer, I want to customize the API and runtime versions of the built-in authentication and authorization in App Service.

---

# Manage the API and runtime versions of App Service authentication

This article describes how to customize the API and runtime versions of the built-in [authentication and authorization in App Service](overview-authentication-authorization.md).

There are two versions of the management API for App Service authentication. The V2 version is required for the authentication experience in the Azure portal. An app already using the V1 API can upgrade to the V2 version after a few changes are made. Specifically, secret configuration must be moved to slot-sticky application settings. You can move secret configuration automatically from the **Authentication** section of your app on the portal.

## Update the configuration version

> [!WARNING]
> Migration to V2 disables management of the App Service authentication/authorization feature for your application through some clients, such as its existing experience in the Azure portal, Azure CLI, and Azure PowerShell. This migration can't be reversed.

The V2 API doesn't support creation or editing of a Microsoft account as a distinct provider as V1 does. Rather, it uses the converged [Microsoft identity platform](../active-directory/develop/v2-overview.md) to sign in users with both Microsoft Entra and personal Microsoft accounts. When you switch to the V2 API, the V1 Microsoft Entra configuration is used to configure the Microsoft identity platform provider. The V1 Microsoft account provider is carried forward in the migration process and continues to operate as normal, but you should move to the newer Microsoft identity platform model. For more information, see [Switch a configuration to a Microsoft Entra provider](#switch-a-configuration-to-a-microsoft-entra-provider).

The automated migration process moves provider secrets into application settings and then converts the rest of the configuration into the new format. To use automatic migration:

1. Go to your app in the portal and select **Settings** > **Authentication** in the left pane.
1. If the app is configured with the V1 model, you see an **Upgrade** button.
1. Select the **Upgrade** button. Review the description in the confirmation prompt. If you're ready to perform the migration, select **Upgrade** in the prompt.

### Manually managing the migration

The following steps enable you to manually migrate an application to the V2 API if you don't want to use the automatic version described previously.

#### Move secrets to application settings

To move identity provider secrets to application settings, complete these steps.

1. Get your existing configuration by using the V1 API:

   ```azurecli
   az webapp auth show -g <group_name> -n <app_name>
   ```

   In the resulting JSON payload, make note of the secret value used for each provider you've configured:

   * Microsoft Entra: `clientSecret`
   * Google: `googleClientSecret`
   * Facebook: `facebookAppSecret`
   * X: `twitterConsumerSecret`
   * Microsoft Account: `microsoftAccountClientSecret`

   > [!IMPORTANT]
   > The secret values are important security credentials and should be handled carefully. Don't share these values or persist them on a local machine.

1. Create slot-sticky application settings for each secret value. You can choose the name of each application setting. Its value should match what you obtained in the previous step or [reference an Azure Key Vault secret](./app-service-key-vault-references.md) that you've created with that value.

   To create the setting, you can use the Azure portal or run a variation of the following command for each provider:

   ```azurecli
   # For web apps, Google example    
   az webapp config appsettings set -g <group_name> -n <app_name> --slot-settings GOOGLE_PROVIDER_AUTHENTICATION_SECRET=<value_from_previous_step>

   # For Azure Functions, X example
   az functionapp config appsettings set -g <group_name> -n <app_name> --slot-settings TWITTER_PROVIDER_AUTHENTICATION_SECRET=<value_from_previous_step>
   ```

   > [!NOTE]
   > The application settings for this configuration should be marked as slot-sticky, which means that they won't move between environments during a [slot swap operation](./deploy-staging-slots.md). This configuration is required because your authentication configuration is tied to the environment. 

1. Create a new JSON file named `authsettings.json`. Take the output that you received previously and remove each secret value from it. Add the remaining output to the file, making sure that no secrets are included. In some cases, the configuration might have arrays that contain empty strings. Make sure that `microsoftAccountOAuthScopes` doesn't. If it does, change the value to `null`.

1. Add a property to `authsettings.json` that points to the application setting name you created earlier for each provider:
 
   * Microsoft Entra: `clientSecretSettingName`
   * Google: `googleClientSecretSettingName`
   * Facebook: `facebookAppSecretSettingName`
   * X: `twitterConsumerSecretSettingName`
   * Microsoft account: `microsoftAccountClientSecretSettingName`

   A settings file after this operation might look similar to the following, in this case only configured for Microsoft Entra ID:

   ```json
   {
       "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myresourcegroup/providers/Microsoft.Web/sites/mywebapp/config/authsettings",
       "name": "authsettings",
       "type": "Microsoft.Web/sites/config",
       "location": "Central US",
       "properties": {
           "enabled": true,
           "runtimeVersion": "~1",
           "unauthenticatedClientAction": "AllowAnonymous",
           "tokenStoreEnabled": true,
           "allowedExternalRedirectUrls": null,
           "defaultProvider": "AzureActiveDirectory",
           "clientId": "00001111-aaaa-2222-bbbb-3333cccc4444",
           "clientSecret": "",
           "clientSecretSettingName": "MICROSOFT_IDENTITY_AUTHENTICATION_SECRET",
           "clientSecretCertificateThumbprint": null,
           "issuer": "https://sts.windows.net/aaaabbbb-0000-cccc-1111-dddd2222eeee/",
           "allowedAudiences": [
               "https://mywebapp.azurewebsites.net"
           ],
           "additionalLoginParams": null,
           "isAadAutoProvisioned": true,
           "aadClaimsAuthorization": null,
           "googleClientId": null,
           "googleClientSecret": null,
           "googleClientSecretSettingName": null,
           "googleOAuthScopes": null,
           "facebookAppId": null,
           "facebookAppSecret": null,
           "facebookAppSecretSettingName": null,
           "facebookOAuthScopes": null,
           "gitHubClientId": null,
           "gitHubClientSecret": null,
           "gitHubClientSecretSettingName": null,
           "gitHubOAuthScopes": null,
           "twitterConsumerKey": null,
           "twitterConsumerSecret": null,
           "twitterConsumerSecretSettingName": null,
           "microsoftAccountClientId": null,
           "microsoftAccountClientSecret": null,
           "microsoftAccountClientSecretSettingName": null,
           "microsoftAccountOAuthScopes": null,
           "isAuthFromFile": "false"
       }   
   }
   ```

1. Submit this file as the new authentication/authorization configuration for your app:

   ```azurecli
   az rest --method PUT --url "/subscriptions/<subscription_id>/resourceGroups/<group_name>/providers/Microsoft.Web/sites/<app_name>/config/authsettings?api-version=2020-06-01" --body @./authsettings.json
   ```

1. Validate that your app is still operating as expected after you submit the file.

1. Delete the file used in the previous steps.

You've now migrated the app to store identity provider secrets as application settings.

#### Switch a configuration to a Microsoft Entra provider

If your existing configuration contains a Microsoft account provider and doesn't contain a Microsoft Entra provider, you can change the configuration to the Microsoft Entra provider and then perform the migration:

1. Go to [**App registrations**](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) in the Azure portal and find the registration associated with your Microsoft account provider. It might be under the **Owned applications** heading.
1. Go to the **Authentication (Preview)** page for the registration. Under **Redirect URI**, you should see an entry ending in `/.auth/login/microsoftaccount/callback`. Copy this URI.
1. Add a new URI that matches the one you just copied, but end it with `/.auth/login/aad/callback`. This URI allows the registration to be used by the App Service authentication/authorization configuration.
1. Go to your app in the portal. Select **Settings** > **Authentication**.
1. Collect the configuration for the Microsoft account provider.
1. Configure the Microsoft Entra provider by using the **Advanced** management mode, supplying the client ID and client secret values you collected in the previous step. For the **Issuer URL**, use `<authentication-endpoint>/<tenant-id>/v2.0`. Replace `<authentication-endpoint>` with the [authentication endpoint for your cloud environment](../active-directory/develop/authentication-national-cloud.md#azure-ad-authentication-endpoints) (for example, "https://login.microsoftonline.com" for global Microsoft Entra ID). Replace `<tenant-id>` with your **Directory (tenant) ID**.
1. After you save the configuration, test the sign-in flow by navigating in your browser to the `/.auth/login/aad` endpoint on your site and completing the sign-in flow.
1. At this point, you've successfully copied the configuration over, but the existing Microsoft account provider configuration remains. Before you remove it, make sure that all parts of your app reference the Microsoft Entra provider through sign-in links and so on. Verify that all parts of your app work as expected.
1. After you validate that everything works with the Microsoft Entra provider, you can remove the Microsoft account provider configuration.

> [!WARNING]
> It's possible to converge the two registrations by modifying the [supported account types](../active-directory/develop/supported-accounts-validation.md) for the Microsoft Entra app registration. However, this configuration would force a new consent prompt for Microsoft account users, and those users' identity claims might be different in structure, `sub` notably changing values because a new app ID is being used. We don't recommend this approach unless you thoroughly understand it. You should instead wait for support for the two registrations in the V2 API surface.

#### Switch to V2

After you complete the previous steps, go to the app in the Azure portal. Select the **Authentication (preview)** section. 

Alternatively, you can make a PUT request against the `config/authsettingsv2` resource under the site resource. The schema for the payload is the same as the one captured in [File-based configuration](configure-authentication-file-based.md).

## Pin your app to a specific authentication runtime version

When you enable authentication/authorization, platform middleware is injected into your HTTP request pipeline as described in the [feature overview](overview-authentication-authorization.md#how-it-works). This platform middleware is periodically updated with new features and improvements as part of routine platform updates. By default, your web or function app runs on the latest version of this platform middleware. These automatic updates are always backward compatible. However, in the rare event that this automatic update introduces a runtime issue for your web or function app, you can temporarily roll back to the previous middleware version. This section explains how to temporarily pin an app to a specific version of the authentication middleware.

### Automatic and manual version updates 

You can pin your app to a specific version of the platform middleware by configuring a `runtimeVersion` setting for the app. Your app always runs on the latest version unless you choose to explicitly pin it to a specific version. There are a few versions supported at a time. If you pin to an invalid version that's no longer supported, your app uses the latest version instead. To always run the latest version, set `runtimeVersion` to `~1`. 

### View and update the current runtime version

You can change the runtime version used by your app. The new runtime version should take effect after you restart the app. 

#### View the current runtime version

You can view the current version of the platform authentication middleware by using the Azure CLI or via one of the built-in version HTTP endpoints in your app.

##### From the Azure CLI

By using the Azure CLI, view the current middleware version with the [az webapp auth show](/cli/azure/webapp/auth#az-webapp-auth-show) command.

```azurecli-interactive
az webapp auth show --name <my_app_name> \
--resource-group <my_resource_group>
```

In this code, replace `<my_app_name>` with the name of your app. Replace `<my_resource_group>` with the name of the resource group for your app.

You'll see the `runtimeVersion` field in the CLI output. It resembles the following example output, which is truncated for clarity: 
```output
{
  "additionalLoginParams": null,
  "allowedAudiences": null,
    ...
  "runtimeVersion": "1.3.2",
    ...
}
```

##### From the version endpoint

You can also hit the /.auth/version endpoint on an app to view the current middleware version that the app is running on. The output will look similar to the following:
```output
{
"version": "1.3.2"
}
```

#### Update the current runtime version

With Azure CLI, you can update the `runtimeVersion` setting in an app by using the [az webapp auth update](/cli/azure/webapp/auth#az-webapp-auth-update) command:

```azurecli-interactive
az webapp auth update --name <my_app_name> \
--resource-group <my_resource_group> \
--runtime-version <version>
```

Replace `<my_app_name>` with the name of your app. Replace `<my_resource_group>` with the name of the resource group for your app. Replace `<version>` with a valid version of the 1.*x* runtime, or use `~1` for the latest version. To determine the version to pin to for Azure Functions, see [Azure Functions runtime versions overview](/azure/azure-functions/functions-versions).

You can run this command from the [Azure Cloud Shell](../cloud-shell/overview.md) by selecting **Open Cloud Shell** in the preceding code sample. You can also use the [Azure CLI locally](/cli/azure/install-azure-cli) to run this command after running [az login](/cli/azure/reference-index#az-login) to sign in.

## Next step

> [!div class="nextstepaction"]
> [Tutorial: Authenticate and authorize users end-to-end](tutorial-auth-aad.md)
