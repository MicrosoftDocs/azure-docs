---
title: Manage AuthN/AuthZ API versions
description: Upgrade your App Service authentication API to V2 or pin it to a specific version, if needed.
ms.topic: article
ms.date: 02/17/2023
ms.custom: seodec18, devx-track-azurecli, AppServiceIdentity
author: cephalin
ms.author: cephalin
---

# Manage the API and runtime versions of App Service authentication

This article shows you how to customize the API and runtime versions of the built-in [authentication and authorization in App Service](overview-authentication-authorization.md).

There are two versions of the management API for App Service authentication. The V2 version is required for the "Authentication" experience in the Azure portal. An app already using the V1 API can upgrade to the V2 version once a few changes have been made. Specifically, secret configuration must be moved to slot-sticky application settings. This can be done automatically from the "Authentication" section of the portal for your app.

## Update the configuration version

> [!WARNING]
> Migration to V2 will disable management of the App Service Authentication/Authorization feature for your application through some clients, such as its existing experience in the Azure portal, Azure CLI, and Azure PowerShell. This cannot be reversed.

The V2 API doesn't support creation or editing of Microsoft Account as a distinct provider as was done in V1. Rather, it uses the converged [Microsoft identity platform](../active-directory/develop/v2-overview.md) to sign-in users with both Azure AD and personal Microsoft accounts. When switching to the V2 API, the V1 Azure Active Directory (Azure AD) configuration is used to configure the Microsoft identity platform provider. The V1 Microsoft Account provider will be carried forward in the migration process and continue to operate as normal, but you should move to the newer Microsoft Identity Platform model. See [Support for Microsoft Account provider registrations](#support-for-microsoft-account-provider-registrations) to learn more.

The automated migration process will move provider secrets into application settings and then convert the rest of the configuration into the new format. To use the automatic migration:

1. Navigate to your app in the portal and select the **Authentication** menu option.
1. If the app is configured using the V1 model, you'll see an **Upgrade** button.
1. Review the description in the confirmation prompt. If you're ready to perform the migration, select **Upgrade** in the prompt.

### Manually managing the migration

The following steps will allow you to manually migrate the application to the V2 API if you don't wish to use the automatic version mentioned above.

#### Moving secrets to application settings

1. Get your existing configuration by using the V1 API:

   ```azurecli
   az webapp auth show -g <group_name> -n <site_name>
   ```

   In the resulting JSON payload, make note of the secret value used for each provider you've configured:

   * Azure AD: `clientSecret`
   * Google: `googleClientSecret`
   * Facebook: `facebookAppSecret`
   * Twitter: `twitterConsumerSecret`
   * Microsoft Account: `microsoftAccountClientSecret`

   > [!IMPORTANT]
   > The secret values are important security credentials and should be handled carefully. Do not share these values or persist them on a local machine.

1. Create slot-sticky application settings for each secret value. You may choose the name of each application setting. Its value should match what you obtained in the previous step or [reference a Key Vault secret](./app-service-key-vault-references.md?toc=/azure/azure-functions/toc.json) that you've created with that value.

   To create the setting, you can use the Azure portal or run a variation of the following for each provider:

   ```azurecli
   # For Web Apps, Google example    
   az webapp config appsettings set -g <group_name> -n <site_name> --slot-settings GOOGLE_PROVIDER_AUTHENTICATION_SECRET=<value_from_previous_step>

   # For Azure Functions, Twitter example
   az functionapp config appsettings set -g <group_name> -n <site_name> --slot-settings TWITTER_PROVIDER_AUTHENTICATION_SECRET=<value_from_previous_step>
   ```

   > [!NOTE]
   > The application settings for this configuration should be marked as slot-sticky, meaning that they will not move between environments during a [slot swap operation](./deploy-staging-slots.md). This is because your authentication configuration itself is tied to the environment. 

1. Create a new JSON file named `authsettings.json`. Take the output that you received previously and remove each secret value from it. Write the remaining output to the file, making sure that no secret is included. In some cases, the configuration may have arrays containing empty strings. Make sure that `microsoftAccountOAuthScopes` doesn't, and if it does, switch that value to `null`.

1. Add a property to `authsettings.json` that points to the application setting name you created earlier for each provider:
 
   * Azure AD: `clientSecretSettingName`
   * Google: `googleClientSecretSettingName`
   * Facebook: `facebookAppSecretSettingName`
   * Twitter: `twitterConsumerSecretSettingName`
   * Microsoft Account: `microsoftAccountClientSecretSettingName`

   An example file after this operation might look similar to the following, in this case only configured for Azure AD:

   ```json
   {
       "id": "/subscriptions/00d563f8-5b89-4c6a-bcec-c1b9f6d607e0/resourceGroups/myresourcegroup/providers/Microsoft.Web/sites/mywebapp/config/authsettings",
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
           "clientId": "3197c8ed-2470-480a-8fae-58c25558ac9b",
           "clientSecret": "",
           "clientSecretSettingName": "MICROSOFT_IDENTITY_AUTHENTICATION_SECRET",
           "clientSecretCertificateThumbprint": null,
           "issuer": "https://sts.windows.net/0b2ef922-672a-4707-9643-9a5726eec524/",
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

1. Submit this file as the new Authentication/Authorization configuration for your app:

   ```azurecli
   az rest --method PUT --url "/subscriptions/<subscription_id>/resourceGroups/<group_name>/providers/Microsoft.Web/sites/<site_name>/config/authsettings?api-version=2020-06-01" --body @./authsettings.json
   ```

1. Validate that your app is still operating as expected after this gesture.

1. Delete the file used in the previous steps.

You've now migrated the app to store identity provider secrets as application settings.

#### Support for Microsoft Account provider registrations

If your existing configuration contains a Microsoft Account provider and doesn't contain an Azure AD provider, you can switch the configuration over to the Azure AD provider and then perform the migration. To do this:

1. Go to [**App registrations**](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) in the Azure portal and find the registration associated with your Microsoft Account provider. It may be under the "Applications from personal account" heading.
1. Navigate to the "Authentication" page for the registration. Under "Redirect URIs", you should see an entry ending in `/.auth/login/microsoftaccount/callback`. Copy this URI.
1. Add a new URI that matches the one you just copied, except instead have it end in `/.auth/login/aad/callback`. This will allow the registration to be used by the App Service Authentication / Authorization configuration.
1. Navigate to the App Service Authentication / Authorization configuration for your app.
1. Collect the configuration for the Microsoft Account provider.
1. Configure the Azure AD provider using the "Advanced" management mode, supplying the client ID and client secret values you collected in the previous step. For the Issuer URL, use Use `<authentication-endpoint>/<tenant-id>/v2.0`, and replace *\<authentication-endpoint>* with the [authentication endpoint for your cloud environment](../active-directory/develop/authentication-national-cloud.md#azure-ad-authentication-endpoints) (e.g., "https://login.microsoftonline.com" for global Azure), also replacing *\<tenant-id>* with your **Directory (tenant) ID**.
1. Once you've saved the configuration, test the login flow by navigating in your browser to the `/.auth/login/aad` endpoint on your site and complete the sign-in flow.
1. At this point, you've successfully copied the configuration over, but the existing Microsoft Account provider configuration remains. Before you remove it, make sure that all parts of your app reference the Azure AD provider through login links, etc. Verify that all parts of your app work as expected.
1. Once you've validated that things work against the Azure AD provider, you may remove the Microsoft Account provider configuration.

> [!WARNING]
> It is possible to converge the two registrations by modifying the [supported account types](../active-directory/develop/supported-accounts-validation.md) for the Azure AD app registration. However, this would force a new consent prompt for Microsoft Account users, and those users' identity claims may be different in structure, `sub` notably changing values since a new App ID is being used. This approach is not recommended unless thoroughly understood. You should instead wait for support for the two registrations in the V2 API surface.

#### Switching to V2

Once the above steps have been performed, navigate to the app in the Azure portal. Select the "Authentication (preview)" section. 

Alternatively, you may make a PUT request against the `config/authsettingsv2` resource under the site resource. The schema for the payload is the same as captured in [File-based configuration](configure-authentication-file-based.md).

## Pin your app to a specific authentication runtime version

When you enable authentication/authorization, platform middleware is injected into your HTTP request pipeline as described in the [feature overview](overview-authentication-authorization.md#how-it-works). This platform middleware is periodically updated with new features and improvements as part of routine platform updates. By default, your web or function app will run on the latest version of this platform middleware. These automatic updates are always backwards compatible. However, in the rare event that this automatic update introduces a runtime issue for your web or function app, you can temporarily roll back to the previous middleware version. This article explains how to temporarily pin an app to a specific version of the authentication middleware.

### Automatic and manual version updates 

You can pin your app to a specific version of the platform middleware by setting a `runtimeVersion` setting for the app. Your app always runs on the latest version unless you choose to explicitly pin it back to a specific version. There will be a few versions supported at a time. If you pin to an invalid version that is no longer supported, your app will use the latest version instead. To always run the latest version, set `runtimeVersion` to ~1. 

### View and update the current runtime version

You can change the runtime version used by your app. The new runtime version should take effect after restarting the app. 

#### View the current runtime version

You can view the current version of the platform authentication middleware either using the Azure CLI or via one of the built-in version HTTP endpoints in your app.

##### From the Azure CLI

Using the Azure CLI, view the current middleware version with the [az webapp auth show](/cli/azure/webapp/auth#az-webapp-auth-show) command.

```azurecli-interactive
az webapp auth show --name <my_app_name> \
--resource-group <my_resource_group>
```

In this code, replace `<my_app_name>` with the name of your app. Also replace `<my_resource_group>` with the name of the resource group for your app.

You'll see the `runtimeVersion` field in the CLI output. It will resemble the following example output, which has been truncated for clarity: 
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

You can also hit /.auth/version endpoint on an app also to view the current middleware version that the app is running on. It will resemble the following example output:
```output
{
"version": "1.3.2"
}
```

#### Update the current runtime version

Using the Azure CLI, you can update the `runtimeVersion` setting in the app with the [az webapp auth update](/cli/azure/webapp/auth#az-webapp-auth-update) command.

```azurecli-interactive
az webapp auth update --name <my_app_name> \
--resource-group <my_resource_group> \
--runtime-version <version>
```

Replace `<my_app_name>` with the name of your app. Also replace `<my_resource_group>` with the name of the resource group for your app. Also, replace `<version>` with a valid version of the 1.x runtime or `~1` for the latest version. See the [release notes on the different runtime versions](https://github.com/Azure/app-service-announcements) to help determine the version to pin to.

You can run this command from the [Azure Cloud Shell](../cloud-shell/overview.md) by choosing **Try it** in the preceding code sample. You can also use the [Azure CLI locally](/cli/azure/install-azure-cli) to execute this command after executing [az login](/cli/azure/reference-index#az-login) to sign in.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Authenticate and authorize users end-to-end](tutorial-auth-aad.md)
