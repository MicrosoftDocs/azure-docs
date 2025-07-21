---
title: Configure a PHP App
description: Learn how to configure a PHP app in a prebuilt PHP container in Azure App Service. This article shows the most common configuration tasks.
ms.devlang: php
ms.topic: how-to
ms.date: 04/22/2025
ms.custom: devx-track-azurecli, linux-related-content
zone_pivot_groups: app-service-platform-windows-linux
ms.author: msangapu
author: msangapu-msft
#customer intent: As an app developer who uses PHP, I want to understand how to configure my PHP web apps in Azure App Service.
---

# Configure a PHP app in Azure App Service

::: zone pivot="platform-windows"  

[!INCLUDE [php-eol-notice](./includes/php-windows-eol-notice.md)]

This guide shows you how to configure your PHP web apps, mobile back ends, and API apps in Azure App Service. The most common configuration tasks are covered.

If you're new to App Service, you should first follow the [Create a PHP web app in Azure App Service](quickstart-php.md) quickstart and the [Deploy a PHP, MySQL, and Redis app to Azure App Service](tutorial-php-mysql-app.md) tutorial.

## Show the PHP version

To show the current PHP version, run the following command. You can use the [Azure Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config show --resource-group <resource-group-name> --name <app-name> --query phpVersion
```

Replace `<resource-group-name>` and `<app-name>` with names that are appropriate for your web app.

> [!NOTE]
> To address a development slot, include the parameter `--slot` followed by the name of the slot.

To show all supported PHP versions, run the following command:

```azurecli-interactive
az webapp list-runtimes --os windows | grep PHP
```

::: zone-end

::: zone pivot="platform-linux"

This guide shows you how to configure your PHP web apps, mobile back ends, and API apps in Azure App Service. The most common configuration tasks are covered.

If you're new to App Service, you should first follow the [Create a PHP web app in Azure App Service](quickstart-php.md) quickstart and the [Deploy a PHP, MySQL, and Redis app to Azure App Service](tutorial-php-mysql-app.md) tutorial.

## Show the PHP version

To show the current PHP version, run the following command. You can use the [Azure Cloud Shell](https://shell.azure.com).

```azurecli-interactive
az webapp config show --resource-group <resource-group-name> --name <app-name> --query linuxFxVersion
```

Replace `<resource-group-name>` and `<app-name>` with names that are appropriate for your web app.

> [!NOTE]
> To address a development slot, include the parameter `--slot` followed by the name of the slot.

To show all supported PHP versions, run the following command:

```azurecli-interactive
az webapp list-runtimes --os linux | grep PHP
```

::: zone-end

## Set the PHP version

::: zone pivot="platform-windows"  

To set the PHP version to 8.1, run the following command:

```azurecli-interactive
az webapp config set --resource-group <resource-group-name> --name <app-name> --php-version 8.1
```

::: zone-end

::: zone pivot="platform-linux"

To set the PHP version to 8.1, run the following command:

```azurecli-interactive
az webapp config set --resource-group <resource-group-name> --name <app-name> --linux-fx-version "PHP|8.1"
```

::: zone-end

[!INCLUDE [outdated-runtimes](includes/outdated-runtimes.md)]

::: zone pivot="platform-windows"  

## Run Composer

If you want App Service to run [Composer](https://getcomposer.org/) at deployment time, the easiest way is to include Composer in your repository.

From a local terminal window, change the directory to your repository root. Then, follow the instructions at [Download Composer](https://getcomposer.org/download/) to download `composer.phar` to the directory root.

Run the following commands. To run them, you need [npm](https://www.npmjs.com/get-npm) installed.

```bash
npm install kuduscript -g
kuduscript --node --scriptType bash --suppressPrompt
```

Your repository root now has two new files: `.deployment` and `deploy.sh`.

Open `deploy.sh` and find the `Deployment` section, which looks like this example:

```bash
##################################################################################################################################
# Deployment
# ----------
```

*At the end* of the `Deployment` section, add the code section that you need to run the required tool:

```bash
# 4. Use composer
echo "$DEPLOYMENT_TARGET"
if [ -e "$DEPLOYMENT_TARGET/composer.json" ]; then
  echo "Found composer.json"
  pushd "$DEPLOYMENT_TARGET"
  php composer.phar install $COMPOSER_ARGS
  exitWithMessageOnError "Composer install failed"
  popd
fi
```

Commit all your changes and deploy your code by using Git or by using ZIP deploy with [build automation enabled](deploy-zip.md#enable-build-automation-for-zip-deploy). Composer should now be running as part of deployment automation.

## Run Bower, Gulp, or Grunt

If you want App Service to run popular automation tools at deployment time, such as Bower, Gulp, or Grunt, you need to supply a [custom deployment script](https://github.com/projectkudu/kudu/wiki/Custom-Deployment-Script). App Service runs this script when you deploy by using Git or by using ZIP deploy with [build automation enabled](deploy-zip.md#enable-build-automation-for-zip-deploy).

To enable your repository to run these tools, you need to add them to the dependencies in `package.json`. For example:

```json
"dependencies": {
  "bower": "^1.7.9",
  "grunt": "^1.0.1",
  "gulp": "^3.9.1",
  ...
}
```

From a local terminal window, change the directory to your repository root and run the following commands. To run them, you need [npm](https://www.npmjs.com/get-npm) installed.

```bash
npm install kuduscript -g
kuduscript --node --scriptType bash --suppressPrompt
```

Your repository root now has two new files: `.deployment` and `deploy.sh`.

Open `deploy.sh` and find the `Deployment` section, which looks like this example:

```bash
##################################################################################################################################
# Deployment
# ----------
```

This section ends with running `npm install --production`. *At the end* of the `Deployment` section, add the code section that you need to run the required tool:

- [Bower](#bower)
- [Gulp](#gulp)
- [Grunt](#grunt)

See an [example in the MEAN.js sample](https://github.com/Azure-Samples/meanjs/blob/master/deploy.sh#L112-L135), where the deployment script also runs a custom `npm install` command.

### Bower

This snippet runs `bower install`:

```bash
if [ -e "$DEPLOYMENT_TARGET/bower.json" ]; then
  cd "$DEPLOYMENT_TARGET"
  eval ./node_modules/.bin/bower install
  exitWithMessageOnError "bower failed"
  cd - > /dev/null
fi
```

### Gulp

This snippet runs `gulp imagemin`:

```bash
if [ -e "$DEPLOYMENT_TARGET/gulpfile.js" ]; then
  cd "$DEPLOYMENT_TARGET"
  eval ./node_modules/.bin/gulp imagemin
  exitWithMessageOnError "gulp failed"
  cd - > /dev/null
fi
```

### Grunt

This snippet runs `grunt`:

```bash
if [ -e "$DEPLOYMENT_TARGET/Gruntfile.js" ]; then
  cd "$DEPLOYMENT_TARGET"
  eval ./node_modules/.bin/grunt
  exitWithMessageOnError "Grunt failed"
  cd - > /dev/null
fi
```

::: zone-end

::: zone pivot="platform-linux"

## Customize build automation

If you deploy your app by using Git or by using ZIP packages [with build automation enabled](deploy-zip.md#enable-build-automation-for-zip-deploy), the build automation in App Service steps through the following sequence:

1. Run a custom script if `PRE_BUILD_SCRIPT_PATH` specifies it.
1. Run `php composer.phar install`.
1. Run a custom script if `POST_BUILD_SCRIPT_PATH` specifies it.

`PRE_BUILD_COMMAND` and `POST_BUILD_COMMAND` are environment variables that are empty by default. To run prebuild commands, define `PRE_BUILD_COMMAND`. To run post-build commands, define `POST_BUILD_COMMAND`.

The following example specifies the two variables to a series of commands, separated by commas:

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings PRE_BUILD_COMMAND="echo foo, scripts/prebuild.sh"
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings POST_BUILD_COMMAND="echo foo, scripts/postbuild.sh"
```

For other environment variables to customize build automation, see [Oryx configuration](https://github.com/microsoft/Oryx/blob/master/doc/configuration.md).

To learn how App Service runs and builds PHP apps in Linux, see the [Oryx documentation on how PHP apps are detected and built](https://github.com/microsoft/Oryx/blob/master/doc/runtimes/php.md).

## Customize startup

You can run a custom command at the container startup time. Run the following command:

```azurecli-interactive
az webapp config set --resource-group <resource-group-name> --name <app-name> --startup-file "<custom-command>"
```

::: zone-end

## Access environment variables

In App Service, you can [set app settings](configure-common.md#configure-app-settings) outside your app code. You can then access those settings by using the standard [`getenv()`](https://secure.php.net/manual/function.getenv.php) pattern. For example, to access an app setting called `DB_HOST`, use the following code:

```php
getenv("DB_HOST")
```

## Change the site root

::: zone pivot="platform-windows"  

The web framework of your choice might use a subdirectory as the site root. For example, [Laravel](https://laravel.com/) uses the `public/` subdirectory as the site root.

To customize the site root, set the virtual application path for the app by using the [`az resource update`](/cli/azure/resource#az-resource-update) command. The following example sets the site root to the `public/` subdirectory in your repository:

```azurecli-interactive
az resource update --name web --resource-group <group-name> --namespace Microsoft.Web --resource-type config --parent sites/<app-name> --set properties.virtualApplications[0].physicalPath="site\wwwroot\public" --api-version 2015-06-01
```

By default, Azure App Service points the root virtual application path (`/`) to the root directory of the deployed application files (`sites\wwwroot`).

::: zone-end

::: zone pivot="platform-linux"

The web framework of your choice might use a subdirectory as the site root. For example, [Laravel](https://laravel.com/) uses the `public/` subdirectory as the site root.

The default PHP image for App Service uses NGINX, and you change the site root by [configuring the NGINX server with the `root` directive](https://docs.nginx.com/nginx/admin-guide/web-server/serving-static-content/). This [example configuration file](https://github.com/Azure-Samples/laravel-tasks/blob/main/default) contains the following snippet that changes the `root` directive:

```output
server {
    #proxy_cache cache;
    #proxy_cache_valid 200 1s;
    listen 8080;
    listen [::]:8080;
    root /home/site/wwwroot/public; # Changed for Laravel

    location / {            
        index  index.php index.html index.htm hostingstart.html;
        try_files $uri $uri/ /index.php?$args; # Changed for Laravel
    }
    ...
```

The default container uses the configuration file at `/etc/nginx/sites-available/default`. Any edit you make to this file is erased when the app restarts. To make a change that's effective across app restarts, [add a custom startup command](#customize-startup) like this example:

```output
cp /home/site/wwwroot/default /etc/nginx/sites-available/default && service nginx reload
```

This command replaces the default NGINX configuration file with a file named `default` in your repository root, and it restarts NGINX.

::: zone-end

## Detect an HTTPS session

In App Service, [TLS/SSL termination](https://wikipedia.org/wiki/TLS_termination_proxy) happens at the network load balancers, so all HTTPS requests reach your app as unencrypted HTTP requests. If your app logic needs to check whether the user requests are encrypted, inspect the `X-Forwarded-Proto` header:

```php
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
// Do something when HTTPS is used
}
```

Popular web frameworks let you access the `X-Forwarded-*` information in your standard app pattern. In [CodeIgniter](https://codeigniter.com/), the [is_https()](https://github.com/bcit-ci/CodeIgniter/blob/master/system/core/Common.php#L338-L365) function checks the value of `X_FORWARDED_PROTO` by default.

## Customize php.ini settings

If you need to make changes to your PHP installation, you can change any of the [php.ini directives](https://www.php.net/manual/ini.list.php) by using the following steps.

> [!NOTE]
> The best way to see the PHP version and the current `php.ini` configuration is to call [`phpinfo()`](https://php.net/manual/function.phpinfo.php) in your app.

### <a name="Customize-non-PHP_INI_SYSTEM directives"></a>Customize non-PHP_INI_SYSTEM directives

::: zone pivot="platform-windows"  

To customize `PHP_INI_USER`, `PHP_INI_PERDIR`, and `PHP_INI_ALL` directives, add a `.user.ini` file to the root directory of your app.

Add configuration settings to the `.user.ini` file by using the same syntax that you would use in a `php.ini` file. For example, if you wanted to turn on the `display_errors` setting and set the `upload_max_filesize` setting to `10M`, your `.user.ini` file would contain this text:

```ini
 ; Example Settings
 display_errors=On
 upload_max_filesize=10M

 ; Write errors to d:\home\LogFiles\php_errors.log
 ; log_errors=On
```

Redeploy your app with the changes and restart it.

As an alternative to using a `.user.ini` file, you can use [`ini_set()`](https://www.php.net/manual/function.ini-set.php) in your app to customize these non-`PHP_INI_SYSTEM` directives.

::: zone-end

::: zone pivot="platform-linux"

To customize `PHP_INI_USER`, `PHP_INI_PERDIR`, and `PHP_INI_ALL` directives for Linux web apps, such as `upload_max_filesize` and `expose_php`, use a custom *.ini* file. You can create it in an [SSH session](configure-linux-open-ssh-session.md). First, set up the directory:

1. Go to your Kudu site. To get the random hash and region values, in your app **Overview**, copy **Default domain**.
1. On the top menu, select **Debug console**, then **Bash** or **SSH**.
1. In Bash or SSH, go to your `/home/site/wwwroot` directory.
1. Create a directory called `ini` (for example, `mkdir ini`).
1. Change the current working directory to the `ini` folder that you created.

Next, create an *.ini* file where you add your settings. This example uses `extensions.ini`. There are no file editors such as Vi, Vim, or Nano, so use `Echo` to add the settings to the file. Change the `upload_max_filesize` value from `2M` to `50M`. Use the following command to add the setting and create an `extensions.ini` file if one doesn't already exist:

```bash
/home/site/wwwroot/ini>echo "upload_max_filesize=50M" >> extensions.ini
/home/site/wwwroot/ini>cat extensions.ini

upload_max_filesize=50M

/home/site/wwwroot/ini>
```

In the Azure portal, add an application setting to scan the `ini` directory that you just created to apply the change for `upload_max_filesize`:
  
1. Go to the [Azure portal](https://portal.azure.com) and select your App Service Linux PHP application.
1. Go to **Settings** > **Environment variables**.
1. Select **+ Add**.
1. For **Name** enter *PHP_INI_SCAN_DIR* and for **Value**, enter `:/home/site/wwwroot/ini`.
1. Select **Apply**, then **Apply** again. Confirm your changes.

> [!NOTE]
> If you recompiled a PHP extension, such as GD, follow the steps at [Recompiling PHP extensions](/archive/blogs/azureossds/azure-app-service-linux-adding-php-extensions#recompiling-php-extensions--).

::: zone-end

### <a name="customize-php_ini_system-directives"></a>Customize PHP_INI_SYSTEM directives

::: zone pivot="platform-windows"  

To customize `PHP_INI_SYSTEM` directives, use the `PHP_INI_SCAN_DIR` app setting.

First, run the following command to add an app setting called `PHP_INI_SCAN_DIR`:

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings PHP_INI_SCAN_DIR="d:\home\site\ini"
```

In the Azure portal, select your app. Under **Development Tools** in the sidebar menu, select **Advanced Tools**, and then go to `d:\home\site` using SSH.

Create a directory in `d:\home\site` called `ini`. Then, create an *.ini* file in the `d:\home\site\ini` directory, for example, `settings.ini`, with the directives that you want to customize. Use the same syntax that you would use in a `php.ini` file.

For example, to change the value of [`expose_php`](https://php.net/manual/ini.core.php#ini.expose-php), run the following commands:

```bash
cd /home/site
mkdir ini
echo "expose_php = Off" >> ini/setting.ini
```

For the changes to take effect, restart the app.

::: zone-end

::: zone pivot="platform-linux"

To customize `PHP_INI_SYSTEM` directives, you can't use the *.htaccess* approach. App Service provides a separate mechanism that uses the `PHP_INI_SCAN_DIR` app setting.

First, run the following command to add an app setting called `PHP_INI_SCAN_DIR`:

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings PHP_INI_SCAN_DIR="/usr/local/etc/php/conf.d:/home/site/ini"
```

The value `/usr/local/etc/php/conf.d` is the default directory where `php.ini` exists. The value `/home/site/ini` is the custom directory in which you add a custom *.ini* file. You separate the values with a colon (`:`).

Go to the web SSH session with your Linux container.

Create a directory in `/home/site` called `ini`. Then, create an *.ini* file in the `/home/site/ini` directory, for example, `settings.ini`, with the directives that you want to customize. Use the same syntax that you would use in a `php.ini` file.

> [!TIP]
> The built-in Linux containers in App Service use `/home` as persisted shared storage.

For example, to change the value of [`expose_php`](https://php.net/manual/ini.core.php#ini.expose-php), run the following commands:

```bash
cd /home/site
mkdir ini
echo "expose_php = Off" >> ini/setting.ini
```

For the changes to take effect, restart the app.

::: zone-end

## Enable PHP extensions

::: zone pivot="platform-windows"  

The built-in PHP installations contain the most commonly used extensions. You can enable more extensions in the same way that you [customize php.ini directives](#customize-php_ini_system-directives).

> [!NOTE]
> The best way to see the PHP version and the current `php.ini` configuration is to call [`phpinfo()`](https://php.net/manual/function.phpinfo.php) in your app.

To enable other extensions, use the following steps:

1. Add a `bin` directory to the root directory of your app, and put the *.dll* extension files in it, for example, `mongodb.dll`. Make sure that the extensions are compatible with the PHP version in Azure, and that they're VC9 and non-thread-safe (NTS) compatible.

1. Deploy your changes.

1. Follow the steps in [Customize PHP_INI_SYSTEM directives](#customize-php_ini_system-directives), and add the extensions into the custom .ini file with the [extension](https://www.php.net/manual/ini.core.php#ini.extension) or [zend_extension](https://www.php.net/manual/ini.core.php#ini.zend-extension) directive:

   ```ini
   extension=d:\home\site\wwwroot\bin\mongodb.dll
   zend_extension=d:\home\site\wwwroot\bin\xdebug.dll
   ```

For the changes to take effect, restart the app.

::: zone-end

::: zone pivot="platform-linux"

The built-in PHP installations contain the most commonly used extensions. You can enable more extensions in the same way that you [customize php.ini directives](#customize-php_ini_system-directives).

> [!NOTE]
> The best way to see the PHP version and the current `php.ini` configuration is to call [`phpinfo()`](https://php.net/manual/function.phpinfo.php) in your app.

To enable other extensions, use the following steps:

1. Add a `bin` directory to the root directory of your app, and put the *.so* extension files in it (for example, `mongodb.so`). Make sure that the extensions are compatible with the PHP version in Azure, and that they're VC9 and non-thread-safe (NTS) compatible.

1. Deploy your changes.

1. Follow the steps in [Customize PHP_INI_SYSTEM directives](#customize-php_ini_system-directives), and add the extensions into the custom .ini file with the [extension](https://www.php.net/manual/ini.core.php#ini.extension) or [zend_extension](https://www.php.net/manual/ini.core.php#ini.zend-extension) directive:

   ```ini
   extension=/home/site/wwwroot/bin/mongodb.so
   zend_extension=/home/site/wwwroot/bin/xdebug.so
   ```

For the changes to take effect, restart the app.

::: zone-end

## Access diagnostic logs

::: zone pivot="platform-windows"  

Use the standard [`error_log()`](https://php.net/manual/function.error-log.php) tool to make your diagnostic logs appear in Azure App Service.

[!INCLUDE [Access diagnostic logs](../../includes/app-service-web-logs-access-no-h.md)]

::: zone-end

::: zone pivot="platform-linux"

[!INCLUDE [Access diagnostic logs](../../includes/app-service-web-logs-access-linux-no-h.md)]

::: zone-end

## Troubleshoot

When a working PHP app behaves differently in App Service or has errors, try the following solutions:

- Access the [diagnostic log stream](#access-diagnostic-logs).
- Test the app locally in production mode. App Service runs your app in production mode, so you need to make sure that your project works as expected in production mode locally. For example:
  - Depending on your `composer.json` file, different packages might be installed for production mode (`require` versus `require-dev`).
  - Certain web frameworks might deploy static files differently in production mode.
  - Certain web frameworks might use custom startup scripts when running in production mode.
- Run your app in App Service in debug mode. For example, in [Laravel](https://laravel.com/), you can configure your app to output debug messages in production by [setting the `APP_DEBUG` app setting to `true`](configure-common.md#configure-app-settings).

::: zone pivot="platform-linux"

[!INCLUDE [robots933456](../../includes/app-service-web-configure-robots933456.md)]

::: zone-end

## Related content

- [Tutorial: Deploy a PHP, MySQL, and Redis app to Azure App Service](tutorial-php-mysql-app.md)

::: zone pivot="platform-linux"

- [Azure App Service on Linux FAQ](faq-app-service-linux.yml)

::: zone-end

- [Environment variables and app settings in Azure App Service](reference-app-settings.md)
