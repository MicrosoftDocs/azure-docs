---
title: Deploy content using FTP/S
description: Learn how to deploy your app to Azure App Service using FTP or FTPS, and improve website security by disabling unencrypted FTP.

ms.assetid: ae78b410-1bc0-4d72-8fc4-ac69801247ae
ms.topic: article
ms.date: 06/16/2025
author: cephalin
ms.author: cephalin
---

# Deploy your app to Azure App Service using FTP/S

This article shows you how to use File Transfer Protocol (FTP) or File Transfer Protocol Secure (FTPS) to deploy your web app, mobile app backend, or API app to [Azure App Service](overview.md). No configuration is necessary to enable FTP or FTPS app deployment. The FTP/S endpoint for your app is already active.

> [!NOTE]
> Both **SCM Basic Auth Publishing Credentials** and **FTP Basic Auth Publishing Credentials** must be enabled for FTP/S deployment to work. When [basic authentication is disabled](configure-basic-auth-disable.md), FTP/S deployment doesn't work, and you can't view or configure FTP/S credentials in the app's **Deployment Center**.

## Get deployment credentials

To get credentials for deployment, follow the instructions at [Configure deployment credentials for Azure App Service](deploy-configure-credentials.md). Copy the application-scope credentials for your app, or set and copy user-scope credentials. You can connect to your app's FTP/S endpoint by using either set of credentials.

For application-scope credentials, the FTP/S username format is `<app-name>\$<app-name>`. For user-scope credentials, the FTP/S username format is `<app-name>\<username>`. App Service FTP/S endpoints are shared among apps, and because user-scope credentials aren't linked to a specific resource, you must prepend the username with the app name.

## Get the FTP/S endpoint

To get the FTP/S endpoint:

# [Azure portal](#tab/portal)

On the [Azure portal](https://portal.azure.com) page for your app, select **Deployment Center** under **Deployment** in the left navigation menu. On the **FTPS Credentials** tab, copy the **FTPS Endpoint** URL.

# [Azure CLI](#tab/cli)

Run the following [az webapp deployment list-publishing-profiles](/cli/azure/webapp/deployment#az-webapp-deployment-list-publishing-profiles) command, replacing the `<app-name>` and `<resource-group-name>` with your values. The following example uses a [JMESPath query](/cli/azure/query-azure-cli) to extract the FTP/S endpoints from the output.

```azurecli-interactive
az webapp deployment list-publishing-profiles --name <app-name> --resource-group <resource-group-name> --query "[?ends_with(profileName, 'FTP')].{profileName: profileName, publishUrl: publishUrl}"
```

>[!NOTE]
>If you see two endpoints returned, copy the read-write URL, not the one containing `dr` that has `ReadOnly` in the name.

# [Azure PowerShell](#tab/powershell)

Run the following [Get-AzWebAppPublishingProfile](/powershell/module/az.websites/get-azwebapppublishingprofile) command, replacing the `<app-name>` and `<resource-group-name>` with your values. The following example extracts the FTP/S endpoint from the XML output.

```azurepowershell-interactive
$xml = [xml](Get-AzWebAppPublishingProfile -Name <app-name> -ResourceGroupName <resource-group-name> -OutputFile null)
$xml.SelectNodes("//publishProfile[@publishMethod=`"FTP`"]/@publishUrl").value
```

-----

## Deploy files to Azure

To deploy files to Azure with FTP/S:

1. From your FTP/S client such as [Visual Studio](https://www.visualstudio.com/vs/community/), [Cyberduck](https://cyberduck.io/), or [WinSCP](https://winscp.net/index.php), use your connection information to connect to your app.
1. Copy your files and their directory structure to the [/site/wwwroot](https://github.com/projectkudu/kudu/wiki/File-structure-on-azure) directory in Azure or the */site/wwwroot/App_Data/Jobs/* directory for WebJobs.
1. Browse to your app's URL to verify the app is running properly.

> [!NOTE] 
> Unlike [local Git deployment](deploy-local-git.md) and [ZIP deployment](deploy-zip.md), FTP/S deployment doesn't support build automation such as: 
> - Restoring dependencies like NuGet, NPM, PIP, and Composer automation.
> - Compiling .NET binaries.
> - Generating a *web.config* file.
> 
> You must generate these necessary files manually on your local machine and then deploy them with your app. For a Node.js *web.config* example, see [Using a custom web.config for Node apps](https://github.com/projectkudu/kudu/wiki/Using-a-custom-web.config-for-Node-apps).

## Enforce FTPS

FTPS is a more secure form of FTP that uses Transport Layer Security (TLS) and Secure Sockets Layer (SSL). For enhanced security, you should enforce FTPS over TLS/SSL. You can also disable both FTP and FTPS if you don't use FTP deployment.

To disable unencrypted FTP:

# [Azure portal](#tab/portal)

1. On the Azure portal page for your app, select **Configuration** under **Settings** in the left navigation menu.

1. On the **General settings** tab of the **Configuration** page, under **Platform settings**, select **FTPS only** for **FTP state**. Or to disable both FTP and FTPS entirely, select **Disabled**.

   [ ![Screenshot that shows setting FTP state to FTPS only.](./media/app-service-deploy-ftp/disable-ftp.png) ](./media/app-service-deploy-ftp/disable-ftp.png#lightbox)

1. If you select **FTPS only**, be sure TLS 1.2 or higher is enforced for **Minimum Inbound TLS Settings**. TLS 1.0 and 1.1 aren't supported for **FTPS only**.

1. Select **Save** at the top of the page.

# [Azure CLI](#tab/cli)

Run the following [az webapp config set](/cli/azure/webapp/deployment#az-webapp-deployment-list-publishing-profiles) command, replacing the `<app-name>` and `<resource-group-name>` with your values. Use the `--ftps-state` argument set to `FtpsOnly` to enforce FTPS, or `Disabled` to disable both FTP and FTPS.

```azurecli-interactive
az webapp config set --name <app-name> --resource-group <resource-group-name> --ftps-state FtpsOnly
```

# [Azure PowerShell](#tab/powershell)

Run the following [Set-AzWebApp](/powershell/module/az.websites/set-azwebapp) command, replacing the `<app-name>` and `<resource-group-name>` with your values. Use the `-FtpsState` parameter set to `FtpsOnly` to enforce FTPS, or `Disabled` to disable both FTP and FTPS..

```azurepowershell-interactive
Set-AzWebApp -Name <app-name> -ResourceGroupName <resource-group-name> -FtpsState FtpsOnly
```

-----

## Troubleshoot FTP/S deployment

- [What happens to my app during deployment that can cause failure or unpredictable behavior?](#what-happens-to-my-app-during-deployment-that-can-cause-failure-or-unpredictable-behavior)
- [What's the first step in troubleshooting FTP/S deployment?](#whats-the-first-step-in-troubleshooting-ftps-deployment)
- [Why can't I FTP/S and publish my code?](#why-cant-i-ftps-and-publish-my-code)
- [How can I connect to FTP/S in App Service via passive mode?](#how-can-i-connect-to-ftps-in-azure-app-service-via-passive-mode)
- [Why does my connection fail when attempting to connect over FTPS using explicit encryption?](#why-does-my-connection-fail-when-attempting-to-connect-over-ftps-using-explicit-encryption)
- [How can I determine what method was used to deploy my app?](#how-can-i-determine-what-method-was-used-to-deploy-my-app)

[!INCLUDE [What happens to my app during deployment that can cause failure or unpredictable behavior?](../../includes/app-service-deploy-atomicity.md)]

### What's the first step in troubleshooting FTP/S deployment?

The first step for troubleshooting FTP/S deployment is distinguishing between deployment issues and runtime application issues.

- A deployment issue typically results in no files or wrong files deployed to your app. You can troubleshoot by investigating your FTP/S deployment or selecting an alternate deployment path, such as source control.

- A runtime application issue typically results in the right files deployed to your app but incorrect app behavior. You can troubleshoot by focusing on code behavior at runtime and investigating specific failure paths.

For more information, see [Deployment vs. runtime issues](https://github.com/projectkudu/kudu/wiki/Deployment-vs-runtime-issues).

### Why can't I FTP/S and publish my code?

Check that you entered the correct [hostname](#get-the-ftps-endpoint) and [credentials](#get-deployment-credentials). Also make sure a firewall isn't blocking the following FTP/S ports on your machine:

- FTP/S control connection ports: `21`, `990`
- FTP/S data connection ports: `989`, `10001-10300`

### How can I connect to FTP/S in Azure App Service via passive mode?

Azure App Service supports connecting via both active and passive modes. Passive mode is preferred because deployment machines are usually behind a firewall in the operating system or as part of a home or business network. For an example of a passive mode connection, see [The Connection Page (Advanced Site Settings dialog)](https://winscp.net/docs/ui_login_connection).

### Why does my connection fail when attempting to connect over FTPS using explicit encryption?

FTPS allows establishing an explicit or implicit TLS secure connection.

 - If you connect with explicit encryption, the connection is established via port `21`.
 - If you connect with implicit encryption, the connection is established via port `990`.

The URL format you use can affect your connection success, and depends on your client application. The portal shows the URL as `ftps://`, but if the URL you connect with starts with `ftp://`, the connection is implied to be on port `21`. If the URL starts with `ftps://`, the connection is implicit and implied to be on port `990`.

Make sure not to mix the settings, such as attempting to connect to `ftps://` by using port `21`. This setting fails to connect even using explicit encryption, because an explicit connection starts as a plain FTP connection before the `AUTH` method.

### How can I determine what method was used to deploy my app?

You can find out how an app was deployed by checking the application settings on its Azure portal page. Select **Environmental variables** under **Settings** in the left navigation menu. On the **App settings** tab:

- If the app was deployed using an external package URL, the `WEBSITE_RUN_FROM_PACKAGE` setting appears in the application settings with a URL value.
- If the app was deployed using ZIP deploy, the `WEBSITE_RUN_FROM_PACKAGE` setting appears with a value of `1`.

If you deployed the app using Azure DevOps, you can see the deployment history in the Azure DevOps portal. If you used Azure Functions Core Tools, you can see the deployment history in the Azure portal.

## Related resources

- [Local Git deployment to Azure App Service](deploy-local-git.md)
- [Azure App Service deployment credentials](deploy-configure-credentials.md)
- [Sample: Create a web app and deploy files with FTP (Azure CLI)](./scripts/cli-deploy-ftp.md)
- [Sample: Upload files to a web app using FTP (PowerShell)](./scripts/powershell-deploy-ftp.md)
