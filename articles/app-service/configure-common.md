---
title: Configure an App Service App
description: Learn how to configure common settings for an Azure App Service app. You can use the Azure portal, Azure CLI, or Azure PowerShell.
keywords: azure app service, web app, app settings, environment variables
ms.assetid: 9af8a367-7d39-4399-9941-b80cbc5f39a0
ms.topic: how-to
ms.date: 03/27/2025
ms.custom: devx-track-csharp, devx-track-azurecli, devx-track-azurepowershell, AppServiceConnectivity
ms.devlang: azurecli
author: cephalin
ms.author: cephalin
#customer intent: As an app developer, I want to understand how to configure settings in Azure App Service, including command line options.
---

# Configure an App Service app

This article explains how to configure common settings for web apps, a mobile back end, or an API app. For Azure Functions, see [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md).

## Configure app settings

In Azure App Service, app settings are variables passed as environment variables to the application code. The following conditions apply to app settings:

- App setting names can contain only letters, numbers (0-9), periods (.), and underscores (_).
- Special characters in the value of an app setting must be escaped as needed by the target operating system.

For example, to set an environment variable in App Service for Linux with the value `"pa$$w0rd\"`, the string for the app setting should be `"pa\$\$w0rd\\"`.

For Linux apps and custom containers, App Service passes app settings to the container by using the `--env` flag to set the environment variable in the container. In either case, they're injected into your app environment at app startup. When you add, remove, or edit app settings, App Service triggers an app restart.

For ASP.NET and ASP.NET Core developers, configuring app settings in App Service is like configuring them in `<appSettings>` in `Web.config` or `appsettings.json`. The values in App Service override the ones in `Web.config` or `appsettings.json`. You can keep development settings, such as local MySQL password, in `Web.config` or `appsettings.json`. You can keep production secrets, such as Azure MySQL database password, safely in App Service. The same code uses your development settings when you debug locally. It uses your production secrets when you deploy it to Azure.

Other language stacks get the app settings as environment variables at runtime. For steps that are specific to each language stack, see:

- [ASP.NET Core](configure-language-dotnetcore.md#access-environment-variables)
- [Java](configure-language-java-data-sources.md)
- [Node.js](configure-language-nodejs.md#access-environment-variables)
- [Python](configure-language-python.md#access-app-settings-as-environment-variables)
- [PHP](configure-language-php.md#access-environment-variables)
- [Custom containers](configure-custom-container.md#configure-environment-variables)

App settings are always encrypted when they're stored (encrypted at rest).

> [!NOTE]
> If you store secrets in app settings, consider using [Azure Key Vault references](app-service-key-vault-references.md). If your secrets are for connectivity to back-end resources, consider connectivity options that are more secure and that don't require secrets. For more information, see [Secure connectivity to Azure services and databases from Azure App Service](tutorial-connect-overview.md).

# [Azure portal](#tab/portal)

1. In the [Azure portal], search for and select **App Services**, and then select your app.
1. On the app's left menu, select **Settings** > **Environment variables**. Then select **App settings**.

   :::image type="content" source="./media/configure-common/open-ui.png" alt-text="Screenshot that shows selections for displaying app settings." lightbox="./media/configure-common/open-ui.png":::

   By default, values for app settings are hidden in the portal for security. To see a hidden value of an app setting, under **Value**, select **Show value**. To see the hidden values of all app settings, select **Show values**.

   > [!NOTE]
   > Read/Write user permissions are required to view this section in the Azure portal. RBAC built-in roles with sufficient permissions are Owner, Contributor, and Website Contributor. The Reader role alone would not be allowed to access this page. 

1. To add a new app setting, select **Add**. To edit a setting, select the setting.
1. In the dialog, you can [stick the setting to the current slot](deploy-staging-slots.md#which-settings-are-swapped).

   > [!NOTE]
   > In a default Linux app service or a custom Linux container, any nested JSON key structure in the app setting name needs to be configured differently for the key name. Replace any colon (`:`) with a double underscore (`__`). Replace any period (`.`) with a single underscore (`_`). For example, `ApplicationInsights:InstrumentationKey` needs to be configured in App Service as `ApplicationInsights__InstrumentationKey` for the key name.

1. When you finish, select **Apply**. Then select **Apply** on the **Environment variables** page.

# [Azure CLI](#tab/cli)

Add or edit an app setting by using [az webapp config app settings set](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set):

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings <setting-name>="<value>"
```

Replace `<setting-name>` with the name of the setting. Replace `<value>` with the value to assign to the setting.

Show all settings and their values by using [az webapp config appsettings list](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-list):

```azurecli-interactive
az webapp config appsettings list --resource-group <group-name> --name <app-name>
```

Remove one or more settings by using [az webapp config app settings delete](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-delete):

```azurecli-interactive
az webapp config appsettings delete --resource-group <group-name> --name <app-name> --setting-names {<setting-name1>,<setting-name2>,...}
```

# [Azure PowerShell](#tab/ps)

Set one or more app settings by using [Set-AzWebApp](/powershell/module/az.websites/set-azwebapp):

```azurepowershell-interactive
Set-AzWebApp -ResourceGroupName <group-name> -Name <app-name> -AppSettings @{"<setting-name1>"="<value1>"; "<setting-name2>"="<value2>";...}
```

This cmdlet replaces the entire set of app settings with the ones that you specify. To add or edit an app setting within an existing set, include the existing app settings in your input hash table by using the [Get-AzWebApp](/powershell/module/az.websites/get-azwebapp) cmdlet. For example:

```azurepowershell-interactive
# Get app configuration
$webapp=Get-AzWebApp -ResourceGroupName <group-name> -Name <app-name>

# Copy app settings to a new hash table
$appSettings = @{}
ForEach ($item in $webapp.SiteConfig.AppSettings) {
$appSettings[$item.Name] = $item.Value
}

# Add or edit one or more app settings
$appSettings['<setting-name1>'] = '<value1>'
$appSettings['<setting-name2>'] = '<value2>'

# Save changes
Set-AzWebApp -ResourceGroupName <group-name> -Name <app-name> -AppSettings $appSettings
```

To check if an app setting is slot specific, use [Get-AzWebAppSlotConfigName](/powershell/module/az.websites/get-azwebappslotconfigname):

```azurepowershell-interactive
Get-AzWebAppSlotConfigName -ResourceGroupName <group-name> -Name <app-name> | select AppSettingNames
```

To make one or more app settings slot specific, use [Set-AzWebAppSlotConfigName](/powershell/module/az.websites/set-azwebappslotconfigname):

```azurepowershell-interactive
Set-AzWebAppSlotConfigName -ResourceGroupName <group-name> -Name <app-name> -AppSettingNames <setting-name1>,<setting-name2>,...
```

-----

### Edit app settings in bulk

# [Azure portal](#tab/portal)

1. Select **Advanced edit**.
1. Edit the settings in the text area.
1. When you finish, select **OK**. Then select **Apply** on the **Environment variables** page.

App settings have the following JSON formatting:

```json
[
  {
    "name": "<key-1>",
    "value": "<value-1>",
    "slotSetting": false
  },
  {
    "name": "<key-2>",
    "value": "<value-2>",
    "slotSetting": false
  },
  ...
]
```

# [Azure CLI](#tab/cli)

Run [az webapp config app settings set](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) with the name of the JSON file:

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings "@fileName.json"
```

> [!TIP]
> Wrapping the file name with quotation marks is required only in PowerShell.

The necessary file format is a JSON array of settings where the slot setting field is optional. For example:

```json
[
  {
    "name": "key1",
    "slotSetting": false,
    "value": "value1"
  },
  {
    "name": "key2",
    "value": "value2"
  }
]
```

For convenience, you can save existing settings in a JSON file by using [az webapp config appsettings list](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-list).

```azurecli-interactive
# Save the settings
az webapp config appsettings list --resource-group <group-name> --name <app-name>  > settings.json

# Edit the JSON file
...

# Update the app with the JSON file
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings @settings.json
```

# [Azure PowerShell](#tab/ps)

It's not possible to edit app settings in bulk by using a JSON file with Azure PowerShell.

-----

## Configure connection strings

This section describes how to configure connection strings.

> [!NOTE]
> Consider connectivity options that are more secure and that don't require connection secrets. For more information, see [Secure connectivity to Azure services and databases from Azure App Service](tutorial-connect-overview.md).

For ASP.NET and ASP.NET Core developers, setting connection strings in App Service is like setting them in `<connectionStrings>` in `Web.config`. The values that you set in App Service override the ones in `Web.config`. You can keep development settings, such as a database file, in `Web.config`. You can keep production secrets, such as SQL database credentials, safely in App Service. The same code uses your development settings when you debug locally. It uses your production secrets when you deploy it to Azure.

For other language stacks, it's better to use [app settings](#configure-app-settings) instead. Connection strings require special formatting in the variable keys to access the values.

There's one case where you might want to use connection strings instead of app settings for non-.NET languages. Certain Azure database types are backed up along with the app *only* if you configure a connection string for the database in your App Service app. For more information, see [Create a custom backup](manage-backup.md#create-a-custom-backup). If you don't need this automated backup, use app settings.

At runtime, connection strings are available as environment variables, prefixed with the following connection types:

- SQL Server: `SQLCONNSTR_`  
- MySQL: `MYSQLCONNSTR_` 
- Azure SQL: `SQLAZURECONNSTR_` 
- Custom: `CUSTOMCONNSTR_`
- PostgreSQL: `POSTGRESQLCONNSTR_`
- Azure Notification Hubs: `NOTIFICATIONHUBCONNSTR_`
- Azure Service Bus: `SERVICEBUSCONNSTR_`
- Azure Event Hubs: `EVENTHUBCONNSTR_`
- Azure Cosmos DB: `DOCDBCONNSTR_`
- Redis cache: `REDISCACHECONNSTR_`

> [!NOTE]
> .NET apps that target PostgreSQL, Notification Hubs, Service Bus, Event Hubs, Azure Cosmos DB, and Redis cache should set the connection string to **Custom** as a workaround for a [known issue in .NET EnvironmentVariablesConfigurationProvider](https://github.com/dotnet/runtime/issues/36123).

For example, a MySQL connection string named *connectionstring1* can be accessed as the environment variable `MYSQLCONNSTR_connectionString1`. For steps that are specific to each language stack, see:

- [ASP.NET Core](configure-language-dotnetcore.md#access-environment-variables)
- [Java](configure-language-java-data-sources.md)
- [Node.js](configure-language-nodejs.md#access-environment-variables)
- [Python](configure-language-python.md#access-environment-variables)
- [PHP](configure-language-php.md#access-environment-variables)
- [Custom containers](configure-custom-container.md#configure-environment-variables)

Connection strings are always encrypted when they're stored (encrypted at rest).

> [!NOTE]
> You can also resolve connection strings from [Key Vault](/azure/key-vault/) by using [Key Vault references](app-service-key-vault-references.md).

# [Azure portal](#tab/portal)

1. In the [Azure portal], search for and select **App Services**, and then select your app.
1. On the app's left menu, select **Settings** > **Environment variables**. Then select **Connection strings**.

   By default, values for connection strings are hidden in the portal for security. To see a hidden value of a connection string, under **Value**, select **Show value**. To see the hidden values of all connection strings, select **Show values**.

1. To add a new connection string, select **Add**. To edit a connection string, select the connection string.
1. In the dialog, you can [stick the connection string to the current slot](deploy-staging-slots.md#which-settings-are-swapped).
1. When you finish, select **Apply**. Then select **Apply** on the **Environment variables** page.

# [Azure CLI](#tab/cli)

Add or edit an app setting by using [az webapp config connection-string set](/cli/azure/webapp/config/connection-string#az-webapp-config-connection-string-set):

```azurecli-interactive
az webapp config connection-string set --resource-group <group-name> --name <app-name> --connection-string-type <type> --settings <string-name>='<value>'
```

Replace `<string-name>` with the name of the connection string. Replace `<value>` with the value to assign to the connection string. For possible values of `<type>` such as `SQLAzure`, see the [CLI command documentation](/cli/azure/webapp/config/connection-string#az-webapp-config-connection-string-set).

Show all connection strings and their values by using [az webapp config connection-string list](/cli/azure/webapp/config/connection-string#az-webapp-config-connection-string-list):

```azurecli-interactive
az webapp config connection-string list --resource-group <group-name> --name <app-name>
```

Remove one or more connection strings by using [az webapp config connection-string delete](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-delete):

```azurecli-interactive
az webapp config connection-string delete --resource-group <group-name>  --name <app-name>--setting-names {<string-name1>,<string-name2>,...}
```

# [Azure PowerShell](#tab/ps)

Set one or more connection strings by using [Set-AzWebApp](/powershell/module/az.websites/set-azwebapp):

```azurepowershell-interactive
$PropertiesObject = @{
  "<string-name1>" = @{
    value="<connection-string1>";
    type="<type>"};
  "<string-name2>" = @{
    value="<connection-string2>";
    type="<type>"}
}

Set-AzWebApp -ResourceGroupName <group-name> -Name <app-name> -ConnectionStrings $PropertiesObject
```

Each connection string contains a name (`<string-name1>`), a value (`<connection-string1>`), and the type. The type is a numerical value that corresponds to one of the [ConnectionStringType](/dotnet/api/microsoft.azure.management.websites.models.connectionstringtype) enumerator fields. For example, for Azure SQL, specify `type="2"`.

This cmdlet replaces the entire set of connection strings with the ones that you specify. To add or edit an app setting within an existing set, include the existing app settings in your input hash table by using the [Get-AzWebApp](/powershell/module/az.websites/get-azwebapp) cmdlet. For example:

```azurepowershell-interactive
# Get app configuration
$webapp=Get-AzWebApp -ResourceGroupName <group-name> -Name <app-name>

# Copy connection strings to a new hash table
$connStrings = @{}
ForEach ($item in $webapp.SiteConfig.ConnectionStrings) {
    $connStrings[$item.Name] = @{value=$item.ConnectionString; type=$item.Type.ToString()}
}

# Add or edit one or more connection strings
$connStrings['<string-name1>'] = @{value='<connection-string1>'; type='<type>'}
$connStrings['<string-name2>'] = @{value='<connection-string2>'; type='<type>'}

# Save changes
Set-AzWebApp -ResourceGroupName <group-name> -Name <app-name> -ConnectionStrings $connStrings
```

To check if a connection string is slot specific, use [Get-AzWebAppSlotConfigName](/powershell/module/az.websites/get-azwebappslotconfigname):

```azurepowershell-interactive
Get-AzWebAppSlotConfigName -ResourceGroupName <group-name> -Name <app-name> | select ConnectionStringNames
```

To make one or more connection strings slot specific, use [Set-AzWebAppSlotConfigName](/powershell/module/az.websites/set-azwebappslotconfigname):

```azurepowershell-interactive
Set-AzWebAppSlotConfigName -ResourceGroupName <group-name> -Name <app-name> -ConnectionStringNames <string-name1>,<string-name2>,...
```

-----

### Edit connection strings in bulk

# [Azure portal](#tab/portal)

1. Select **Advanced edit**.
1. Edit the connection strings in the text area.
1. When you finish, select **Apply**. Don't forget to also select **Apply** on the **Environment variables** page.

Connection strings have the following JSON formatting:

```json
[
  {
    "name": "name-1",
    "value": "conn-string-1",
    "type": "SQLServer",
    "slotSetting": false
  },
  {
    "name": "name-2",
    "value": "conn-string-2",
    "type": "PostgreSQL",
    "slotSetting": false
  },
  ...
]
```

# [Azure CLI](#tab/cli)

Run [az webapp config connection-string set](/cli/azure/webapp/config/connection-string#az-webapp-config-connection-string-set) with the name of the JSON file:

```azurecli-interactive
az webapp config connection-string set --resource-group <group-name> --name <app-name> --settings "@fileName.json"
```

> [!TIP]
> Wrapping the file name with quotation marks is required only in PowerShell.

The necessary file format is a JSON array of connection strings where the slot setting field is optional. For example:

```json
[
  {
    "name": "name-1",
    "value": "conn-string-1",
    "type": "SQLServer",
    "slotSetting": false
  },
  {
    "name": "name-2",
    "value": "conn-string-2",
    "type": "PostgreSQL",
  },
  ...
]
```

For convenience, you can save existing connection strings in a JSON file by using [az webapp config connection-string list](/cli/azure/webapp/config/connection-string#az-webapp-config-connection-string-list).

```azurecli-interactive
# Save the connection strings
az webapp config connection-string list --resource-group <group-name> --name <app-name> > settings.json

# Edit the JSON file
...

# Update the app with the JSON file
az webapp config connection-string set --resource-group <group-name> --name <app-name> --settings @settings.json
```

# [Azure PowerShell](#tab/ps)

It's not possible to edit connection strings in bulk by using a JSON file with Azure PowerShell.

-----

<a name="platform"></a>

## Configure language stack settings

To configure language stack settings, see these resources:

- [ASP.NET Core](configure-language-dotnetcore.md)
- [Java](configure-language-java-deploy-run.md)
- [Node.js](configure-language-nodejs.md)
- [Python](configure-language-python.md)
- [PHP](configure-language-php.md)

<a name="alwayson"></a>

## Configure general settings

To configure general settings, follow the steps for your preferred tools.

# [Azure portal](#tab/portal)

1. In the [Azure portal], search for and select **App Services**, and then select your app.
1. On the app's left menu, select **Settings** > **Configuration**. Then select **General settings**.

   :::image type="content" source="./media/configure-common/open-general.png" alt-text="Screenshot that shows selections to open general settings." lightbox="./media/configure-common/open-general.png":::

Here, you can configure some common settings for the app. Some settings require you to [scale up to higher pricing tiers](manage-scale-up.md).

- **Stack settings**: Configure settings for the software stack to run the app, including the language and SDK versions.

  For Linux apps, you can select the language runtime version and set an optional startup command.

- **Platform settings**: Configure settings for the hosting platform, including:

  - **Platform**: Choose 32-bit or 64-bit. For Windows apps only.
  - **FTP state**: Allow only FTPS, or disable FTP altogether.
  - **HTTP version**: Set to **2.0** to enable support for the [HTTPS/2](https://wikipedia.org/wiki/HTTP/2) protocol.

    > [!NOTE]
    > Most modern browsers support the HTTP/2 protocol over TLS only. Unencrypted traffic continues to use HTTP/1.1. To ensure that client browsers connect to your app with HTTP/2, secure your custom DNS name. For more information, see [Provide security for a custom DNS name with a TLS/SSL binding in App Service](configure-ssl-bindings.md).

  - **Web sockets**: Configure for [ASP.NET SignalR] or [socket.io](https://socket.io/), for example.
  - **Always On**: Turn on if you want to keep the app loaded even when there's no traffic.
  
    When **Always On** is turned off (default), the app is unloaded after 20 minutes without any incoming requests. The unloaded app can cause high latency for new requests because of its warm-up time.

    When **Always On** is turned on, the front-end load balancer sends a `GET` request to the application root every five minutes. The continuous ping prevents the app from being unloaded.

    Always On is required for continuous WebJobs or for WebJobs that a cron expression triggers.

  - **Session affinity**: In a multiple-instance deployment, ensure that the client is routed to the same instance for the life of the session. You can set this option to **Off** for stateless applications.
  - **Session affinity proxy**: Turn on if your app is behind a reverse proxy (like Azure Application Gateway or Azure Front Door) and you're using the default host name. The domain for the session affinity cookie aligns with the forwarded host name from the reverse proxy.
  - **HTTPS Only**: Enable if you want to redirect all HTTP traffic to HTTPS.
  - **Minimum TLS version**: Select the minimum TLS encryption version that your app requires.

- **Debugging**: Enable remote debugging for [ASP.NET](troubleshoot-dotnet-visual-studio.md#remotedebug), [ASP.NET Core](/visualstudio/debugger/remote-debugging-azure), or [Node.js](configure-language-nodejs.md#debug-remotely) apps. This option turns off automatically after 48 hours.
- **Incoming client certificates**: Require client certificates in [mutual authentication](app-service-web-configure-tls-mutual-auth.md).

# [Azure CLI](#tab/cli)

You can set many of the common configurable options by using [az webapp config set](/cli/azure/webapp/config#az-webapp-config-set). The following example shows a subset of the configurable options:

```azurecli-interactive
az webapp config set --resource-group <group-name> --name <app-name>  --use-32bit-worker-process [true|false] --web-sockets-enabled [true|false] --always-on [true|false]--http20-enabled --auto-heal-enabled [true|false] --remote-debugging-enabled [true|false] --number-of-workers
```

To show the existing settings, use the [az webapp config show](/cli/azure/webapp/config#az-webapp-config-show) command.

# [Azure PowerShell](#tab/ps)

You can set many of the common configurable options by using [Set-AzWebApp](/powershell/module/az.websites/set-azwebapp). The following example shows a subset of the configurable options:

```azurecli-interactive
Set-AzWebApp -ResourceGroupName <group-name> -Name <app-name> -Use32BitWorkerProcess [$True|$False] -WebSocketsEnabled [$True|$False] -AlwaysOn [$True|$False] -NumberOfWorkers
```

To show the existing settings, use the [Get-AzWebApp](/powershell/module/az.websites/get-azwebapp) command.

-----

## Configure default documents

The default document is the webpage that appears at the root URL of an App Service app. The first matching file in the list is used. If the app uses modules that route based on URL instead of serving static content, there's no need for default documents.

The setting to configure default documents is only for Windows apps.

# [Azure portal](#tab/portal)

1. In the [Azure portal], search for and select **App Services**, and then select your app.
1. On the app's left menu, select **Configuration**. Then select **Default documents**.
1. To add a default document, select **New document**. To remove a default document, select **Delete** to its right.

# [Azure CLI](#tab/cli)

Add a default document by using [az resource update](/cli/azure/resource#az-resource-update):

```azurecli-interactive
az resource update --resource-group <group-name> --resource-type "Microsoft.Web/sites/config" --name <app-name>/config/web --add properties.defaultDocuments <filename>
```

# [Azure PowerShell](#tab/ps)

Add a default document by modifying the updating app's PowerShell object:

```azurepowershell-interactive
$webapp = Get-AzWebApp -ResourceGroupName <group-name> -Name <app-name>
$webapp.SiteConfig.DefaultDocuments.Add("<filename>")
Set-AzWebApp $webapp
```

-----

<a name="redirect-to-a-custom-directory" aria-hidden="true"></a>

## Map a URL path to a directory

By default, App Service starts your app from the root directory of your app code. But certain web frameworks don't start in the root directory. For example, [Laravel](https://laravel.com/) starts in the `public` subdirectory. Such an app would be accessible at `http://contoso.com/public`, for example, but you typically want to direct `http://contoso.com` to the `public` directory instead. If your app's startup file is in a different folder, or if your repository has more than one application, you can edit or add virtual applications and directories.

The feature of mapping a virtual directory to a physical path is available only on Windows apps.

# [Azure portal](#tab/portal)

1. In the [Azure portal], search for and select **App Services**, and then select your app.
1. On the app's left menu, select **Settings** > **Configuration**. Then select **Path mappings**.
1. Select **New virtual application or directory**. Then take one of these actions:

   - To map a virtual directory to a physical path, leave **Directory** selected. Specify the virtual directory and the corresponding relative (physical) path to the website root (`D:\home`).
   - To mark a virtual directory as a web application, unselect **Directory**.

   :::image type="content" source="./media/configure-common/directory-check-box.png" alt-text="Screenshot that shows selections for displaying the Directory checkbox." lightbox="./media/configure-common/directory-check-box.png":::

1. Select **Ok**. Then select **Save** on the **Configuration** page.

# [Azure CLI](#tab/cli)

The following example sets the root path `/` to the `public` subdirectory, which works for Laravel. It also adds a second virtual application at the `/app2` path. To run it, create a file called `json.txt` with the following contents:

```txt
[
  {
    "physicalPath"':' "site\\wwwroot\\public",
    "preloadEnabled"':' false,
    "virtualDirectories"':' null,
    "virtualPath"':' "/"
  },
  {
    "physicalPath"':' "site\\wwwroot\\app2",
    "preloadEnabled"':' false,
    "virtualDirectories"':' null,
    "virtualPath"':' "/app2"
  }
]
```

Change `<group-name>` and `<app-name>` for your resources and run the following command. Be aware of escape characters when you run this command. For more information on escape characters, see [Tips for using the Azure CLI successfully](/cli/azure/use-cli-effectively).

```azurecli-interactive
az resource update --resource-group <group-name> --resource-type Microsoft.Web/sites/config --name <app-name>/config/web --set properties.virtualApplications="@json.txt"
```

# [Azure PowerShell](#tab/ps)

The following example sets the root path `/` to the `public` subdirectory, which works for Laravel. It also adds a second virtual application at the `/app2` path. To run it, change `<group-name>` and `<app-name>`.

```azurepowershell-interactive
$webapp=Get-AzWebApp -ResourceGroupName <group-name> -Name <app-name>

# Set default / path to public subdirectory
$webapp.SiteConfig.VirtualApplications[0].PhysicalPath= "site\wwwroot\public"

# Add a virtual application
$virtualApp = New-Object Microsoft.Azure.Management.WebSites.Models.VirtualApplication
$virtualApp.VirtualPath = "/app2"
$virtualApp.PhysicalPath = "site\wwwroot\app2"
$virtualApp.PreloadEnabled = $false
$webapp.SiteConfig.VirtualApplications.Add($virtualApp)

# Save settings
Set-AzWebApp $webapp
```

-----

## Configure handler mappings

For Windows apps, you can customize the IIS handler mappings and virtual applications and directories. Handler mappings let you add custom script processors to handle requests for specific file extensions.

To add a custom handler:

1. In the [Azure portal], search for and select **App Services**, and then select your app.
1. On the app's left menu, select **Settings** > **Configuration**. Then select **Path mappings**.
1. Select **New handler mapping**. Configure the handler as follows:

   - **Extension**. The file extension that you want to handle, such as `*.php` or `handler.fcgi`.
   - **Script processor**. The absolute path of the script processor to you. The script processor processes requests to files that match the file extension. Use the path `D:\home\site\wwwroot` to refer to your app's root directory.
   - **Arguments**. Optional command-line arguments for the script processor.

1. Select **Ok**. Then select **Save** on the **Configuration** page.

## Configure custom containers

- [Configure a custom container for Azure App Service](configure-custom-container.md)
- [Mount Azure Storage as a local share in App Service](configure-connect-to-azure-storage.md)

## Related content

- [Environment variables and app settings in Azure App Service](reference-app-settings.md)
- [Set up an existing custom domain in Azure App Service]
- [Set up staging environments in Azure App Service]
- [Enable HTTPS for a custom domain in Azure App Service](configure-ssl-bindings.md)
- [Enable diagnostics logging for apps in Azure App Service](troubleshoot-diagnostic-logs.md)
- [Scale up an app in Azure App Service]
- [Azure App Service quotas and alerts]
- [Change applicationHost.config settings with applicationHost.xdt](https://github.com/projectkudu/kudu/wiki/Xdt-transform-samples)

<!-- URL List -->

[ASP.NET SignalR]: https://www.asp.net/signalr
[Azure portal]: https://portal.azure.com/
[Set up an existing custom domain in Azure App Service]: ./app-service-web-tutorial-custom-domain.md
[Set up staging environments in Azure App Service]: ./deploy-staging-slots.md
[Azure App Service quotas and alerts]: ./web-sites-monitor.md
[Scale up an app in Azure App Service]: ./manage-scale-up.md
