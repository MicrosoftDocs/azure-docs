---
title: Environment variables and app settings reference
description: Describes the commonly used environment variables, and which ones can be modified with app settings.
ms.topic: article
ms.date: 09/14/2023
author: cephalin
ms.author: cephalin
---

# Environment variables and app settings in Azure App Service

In [Azure App Service](overview.md), certain settings are available to the deployment or runtime environment as environment variables. Some of these settings can be customized when you set them manually as [app settings](configure-common.md#configure-app-settings). This reference shows the variables you can use or customize.

## App environment

The following environment variables are related to the app environment in general.

| Setting name| Description | Example |
|-|-|-|
| `WEBSITE_SITE_NAME` | Read-only. App name. ||
| `WEBSITE_RESOURCE_GROUP` | Read-only. Azure resource group name that contains the app resource. ||
| `WEBSITE_OWNER_NAME` | Read-only. Contains the Azure subscription ID that owns the app, the resource group, and the webspace. ||
| `REGION_NAME` | Read-only. Region name of the app. ||
| `WEBSITE_PLATFORM_VERSION` | Read-only. App Service platform version. ||
| `HOME` | Read-only. Path to the home directory (for example, `D:\home` for Windows). ||
| `SERVER_PORT` | Read-only. The port the app should listen to. | |
| `WEBSITE_WARMUP_PATH`  | A relative path to ping to warm up the app, beginning with a slash. The default is `/`, which pings the root path. The specific path can be pinged by an unauthenticated client, such as Azure Traffic Manager, even if [App Service authentication](overview-authentication-authorization.md) is set to reject unauthenticated clients. (NOTE: This app setting doesn't change the path used by AlwaysOn.) ||
| `WEBSITE_COMPUTE_MODE` | Read-only. Specifies whether app runs on dedicated (`Dedicated`) or shared (`Shared`) VM/s. ||
| `WEBSITE_SKU` | Read-only. SKU of the app. Possible values are `Free`, `Shared`, `Basic`, and `Standard`. ||
| `SITE_BITNESS` | Read-only. Shows whether the app is 32-bit (`x86`) or 64-bit (`AMD64`). ||
| `WEBSITE_HOSTNAME` | Read-only. Primary hostname for the app. Custom hostnames aren't accounted for here. ||
| `WEBSITE_VOLUME_TYPE` | Read-only. Shows the storage volume type currently in use. ||
| `WEBSITE_NPM_DEFAULT_VERSION` | Default npm version the app is using. ||
| `WEBSOCKET_CONCURRENT_REQUEST_LIMIT` | Read-only. Limit for websocket's concurrent requests. For **Standard** tier and above, the value is `-1`, but there's still a per VM limit based on your VM size (see [Cross VM Numerical Limits](https://github.com/projectkudu/kudu/wiki/Azure-Web-App-sandbox#cross-vm-numerical-limits)). ||
| `WEBSITE_PRIVATE_EXTENSIONS` | Set to `0` to disable the use of private site extensions. ||
| `WEBSITE_TIME_ZONE` | By default, the time zone for the app is always UTC. You can change it to any of the valid values that are listed in [TimeZone](/previous-versions/windows/it-pro/windows-vista/cc749073(v=ws.10)). If the specified value isn't recognized, UTC is used. | `Atlantic Standard Time` |
| `WEBSITE_ADD_SITENAME_BINDINGS_IN_APPHOST_CONFIG` | After slot swaps, the app may experience unexpected restarts. This is because after a swap, the hostname binding configuration goes out of sync, which by itself doesn't cause restarts. However, certain underlying storage events (such as storage volume failovers) may detect these discrepancies and force all worker processes to restart. To minimize these types of restarts, set the app setting value to `1`on all slots (default is`0`). However, don't set this value if you're running a Windows Communication Foundation (WCF) application. For more information, see [Troubleshoot swaps](deploy-staging-slots.md#troubleshoot-swaps)||
| `WEBSITE_PROACTIVE_AUTOHEAL_ENABLED` | By default, a VM instance is proactively "autohealed" when it's using more than 90% of allocated memory for more than 30 seconds, or when 80% of the total requests in the last two minutes take longer than 200 seconds. If a VM instance has triggered one of these rules, the recovery process is an overlapping restart of the instance. Set to `false` to disable this recovery behavior. The default is `true`. For more information, see [Proactive Auto Heal](https://azure.github.io/AppService/2017/08/17/Introducing-Proactive-Auto-Heal.html). ||
| `WEBSITE_PROACTIVE_CRASHMONITORING_ENABLED` | Whenever the w3wp.exe process on a VM instance of your app crashes due to an unhandled exception for more than three times in 24 hours, a debugger process is attached to the main worker process on that instance, and collects a memory dump when the worker process crashes again. This memory dump is then analyzed and the call stack of the thread that caused the crash is logged in your App Service’s logs. Set to `false` to disable this automatic monitoring behavior. The default is `true`. For more information, see [Proactive Crash Monitoring](https://azure.github.io/AppService/2021/03/01/Proactive-Crash-Monitoring-in-Azure-App-Service.html). ||
| `WEBSITE_DAAS_STORAGE_SASURI` | During crash monitoring (proactive or manual), the memory dumps are deleted by default. To save the memory dumps to a storage blob container, specify the SAS URI.  ||
| `WEBSITE_CRASHMONITORING_ENABLED` | Set to `true` to enable [crash monitoring](https://azure.github.io/AppService/2020/08/11/Crash-Monitoring-Feature-in-Azure-App-Service.html) manually. You must also set `WEBSITE_DAAS_STORAGE_SASURI` and `WEBSITE_CRASHMONITORING_SETTINGS`. The default is `false`. This setting has no effect if remote debugging is enabled. Also, if this setting is set to `true`, [proactive crash monitoring](https://azure.github.io/AppService/2020/08/11/Crash-Monitoring-Feature-in-Azure-App-Service.html) is disabled. ||
| `WEBSITE_CRASHMONITORING_SETTINGS` | A JSON with the following format:`{"StartTimeUtc": "2020-02-10T08:21","MaxHours": "<elapsed-hours-from-StartTimeUtc>","MaxDumpCount": "<max-number-of-crash-dumps>"}`. Required to configure [crash monitoring](https://azure.github.io/AppService/2020/08/11/Crash-Monitoring-Feature-in-Azure-App-Service.html) if `WEBSITE_CRASHMONITORING_ENABLED` is specified. To only log the call stack without saving the crash dump in the storage account, add `,"UseStorageAccount":"false"` in the JSON. ||
| `REMOTEDEBUGGINGVERSION` | Remote debugging version. ||
| `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` | By default, App Service creates a shared storage for you at app creation. To use a custom storage account instead, set to the connection string of your storage account. For functions, see [App settings reference for Functions](../azure-functions/functions-app-settings.md#website_contentazurefileconnectionstring). | `DefaultEndpointsProtocol=https;AccountName=<name>;AccountKey=<key>` |
| `WEBSITE_CONTENTSHARE` | When you use specify a custom storage account with `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`, App Service creates a file share in that storage account for your app. To use a custom name, set this variable to the name you want. If a file share with the specified name doesn't exist, App Service creates it for you. | `myapp123` |
| `WEBSITE_SCM_ALWAYS_ON_ENABLED` | Read-only. Shows whether Always On is enabled (`1`) or not (`0`). ||
| `WEBSITE_SCM_SEPARATE_STATUS` | Read-only. Shows whether the Kudu app is running in a separate process (`1`) or not (`0`). ||
| `WEBSITE_DNS_ATTEMPTS` | Number of times to try name resolve. ||
| `WEBSITE_DNS_TIMEOUT` | Number of seconds to wait for name resolve ||
<!-- 
WEBSITE_PROACTIVE_STACKTRACING_ENABLED
WEBSITE_CLOUD_NAME
WEBSITE_MAXIMUM_CONCURRENTCOLDSTARTS
HOME_EXPANDED
USERPROFILE
WEBSITE_ISOLATION
WEBSITE_OS | only appears on windows
WEBSITE_CLASSIC_MODE
 -->

## Variable prefixes

The following table shows environment variable prefixes that App Service uses for various purposes.

| Setting name | Description |
|-|-|
| `APPSETTING_` | Signifies that a variable is set by the customer as an app setting in the app configuration. It's injected into a .NET app as an app setting. |
| `MAINSITE_` | Signifies a variable is specific to the app itself. |
| `SCMSITE_` | Signifies a variable is specific to the Kudu app. |
| `SQLCONNSTR_` | Signifies a SQL Server connection string in the app configuration. It's injected into a .NET app as a connection string. |
| `SQLAZURECONNSTR_` | Signifies an Azure SQL Database connection string in the app configuration. It's injected into a .NET app as a connection string. |
| `POSTGRESQLCONNSTR_` | Signifies a PostgreSQL connection string in the app configuration. It's injected into a .NET app as a connection string. |
| `CUSTOMCONNSTR_` | Signifies a custom connection string in the app configuration. It's injected into a .NET app as a connection string. |
| `MYSQLCONNSTR_` | Signifies a MySQL Database connection string in the app configuration. It's injected into a .NET app as a connection string. |
| `AZUREFILESSTORAGE_` | A connection string to a custom share for a custom container in Azure Files. |
| `AZUREBLOBSTORAGE_` | A connection string to a custom storage account for a custom container in Azure Blob Storage. |
| `NOTIFICATIONHUBCONNSTR_` | Signifies a connection string to a notification hub in Azure Notification Hubs. |
| `SERVICEBUSCONNSTR_` | Signifies a connection string to an instance of Azure Service Bus. |
| `EVENTHUBCONNSTR_` | Signifies a connection string to an event hub in Azure Event Hubs. |
| `DOCDBCONNSTR_` | Signifies a connection string to a database in Azure Cosmos DB. |
| `REDISCACHECONNSTR_` | Signifies a connection string to a cache in Azure Cache for Redis. |
| `FILESHARESTORAGE_` | Signifies a connection string to a custom file share. |

## Deployment

The following environment variables are related to app deployment. For variables related to App Service build automation, see [Build automation](#build-automation).

| Setting name| Description |
|-|-|
| `DEPLOYMENT_BRANCH`| For [local Git](deploy-local-git.md) or [cloud Git](deploy-continuous-deployment.md) deployment (such as GitHub), set to the branch in Azure you want to deploy to. By default, it's `master`. |
| `WEBSITE_RUN_FROM_PACKAGE`| Set to `1` to run the app from a local ZIP package, or set to the URL of an external URL to run the app from a remote ZIP package. For more information, see [Run your app in Azure App Service directly from a ZIP package](deploy-run-package.md). |
| `WEBSITE_USE_ZIP` | Deprecated. Use `WEBSITE_RUN_FROM_PACKAGE`. |
| `WEBSITE_RUN_FROM_ZIP` | Deprecated. Use `WEBSITE_RUN_FROM_PACKAGE`. | 
| `WEBSITE_WEBDEPLOY_USE_SCM` | Set to `false` for WebDeploy to stop using the Kudu deployment engine. The default is `true`. To deploy to Linux apps using Visual Studio (WebDeploy/MSDeploy), set it to `false`. |
| `MSDEPLOY_RENAME_LOCKED_FILES` | Set to `1` to attempt to rename DLLs if they can't be copied during a WebDeploy deployment. This setting isn't applicable if `WEBSITE_WEBDEPLOY_USE_SCM` is set to `false`. |
| `WEBSITE_DISABLE_SCM_SEPARATION` | By default, the main app and the Kudu app run in different sandboxes. When you stop the app, the Kudu app is still running, and you can continue to use Git deploy and MSDeploy. Each app has its own local files. Turning off this separation (setting to `true`) is a legacy mode that's no longer fully supported. |
| `WEBSITE_ENABLE_SYNC_UPDATE_SITE` | Set to `1` ensure that REST API calls to update `site` and `siteconfig` are completely applied to all instances before returning. The default is `1` if deploying with an ARM template, to avoid race conditions with subsequent ARM calls. |
| `WEBSITE_START_SCM_ON_SITE_CREATION` | In an ARM template deployment, set to `1` in the ARM template to pre-start the Kudu app as part of app creation. |
| `WEBSITE_START_SCM_WITH_PRELOAD` | For Linux apps, set to `true` to force preloading the Kudu app when Always On is enabled by pinging its URL. The default is `false`. For Windows apps, the Kudu app is always preloaded. |

<!-- 
WEBSITE_RUN_FROM_PACKAGE_BLOB_MI_RESOURCE_ID
-->

## Build automation

# [Kudu (Windows)](#tab/kudu)

Kudu build configuration applies to native Windows apps and is used to control the behavior of Git-based (or ZIP-based) deployments.

| Setting name| Description | Example |
|-|-|-|
| `SCM_BUILD_ARGS` | Add things at the end of the msbuild command line, such that it overrides any previous parts of the default command line. | To do a clean build: `-t:Clean;Compile`|
| `SCM_SCRIPT_GENERATOR_ARGS` | Kudu uses the `azure site deploymentscript` command described [here](http://blog.amitapple.com/post/38418009331/azurewebsitecustomdeploymentpart2) to generate a deployment script. It automatically detects the language framework type and determines the parameters to pass to the command. This setting overrides the automatically generated parameters. | To treat your repository as plain content files: `--basic -p <folder-to-deploy>` |
| `SCM_TRACE_LEVEL` | Build trace level. The default is `1`. Set to higher values, up to 4, for more tracing. | `4` |
| `SCM_COMMAND_IDLE_TIMEOUT` | Time out in seconds for each command that the build process launches to wait before without producing any output. After that, the command is considered idle and killed. The default is `60` (one minute). In Azure, there's also a general idle request timeout that disconnects clients after 230 seconds. However, the command will still continue running server-side after that. | |
| `SCM_LOGSTREAM_TIMEOUT` | Time-out of inactivity in seconds before stopping log streaming. The default is `1800` (30 minutes).| |
| `SCM_SITEEXTENSIONS_FEED_URL` | URL of the site extensions gallery. The default is `https://www.nuget.org/api/v2/`. The URL of the old feed is `http://www.siteextensions.net/api/v2/`. | |
| `SCM_USE_LIBGIT2SHARP_REPOSITORY` | Set to `0` to use git.exe instead of libgit2sharp for git operations. | |
| `WEBSITE_LOAD_USER_PROFILE` | In case of the error `The specified user does not have a valid profile.` during ASP.NET build automation (such as during Git deployment), set this variable to `1` to load a full user profile in the build environment. This setting is only applicable when `WEBSITE_COMPUTE_MODE` is `Dedicated`. | |
| `WEBSITE_SCM_IDLE_TIMEOUT_IN_MINUTES` | Time out in minutes for the SCM (Kudu) site. The default is `20`. | |
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | With [ZIP deploy](deploy-zip.md), the deployment engine assumes that a ZIP file is ready to run as-is and doesn't run any build automation. To enable the same build automation as in [Git deploy](deploy-local-git.md), set to `true`. |

<!-- 
SCM_GIT_USERNAME
SCM_GIT_EMAIL
 -->

# [Oryx (Linux)](#tab/oryx)

Oryx build configuration applies to Linux apps and is used to control the behavior of Git-based (or ZIP-based) deployments. See [Oryx configuration](https://github.com/microsoft/Oryx/blob/master/doc/configuration.md).

-----

## Language-specific settings

This section shows the configurable runtime settings for each supported language framework. Additional settings are available during [build automation](#build-automation) at deployment time.

# [.NET](#tab/dotnet)

<!-- 
| DOTNET_HOSTING_OPTIMIZATION_CACHE | 
 -->
| Setting name | Description |
|-|-|
| `PORT` | Read-only. For Linux apps, port that the .NET runtime listens to in the container. |
| `WEBSITE_ROLE_INSTANCE_ID` | Read-only. ID of the current instance. |
| `HOME` | Read-only. Directory that points to shared storage (`/home`). |
| `DUMP_DIR` | Read-only. Directory for the crash dumps (`/home/logs/dumps`). |
| `APP_SVC_RUN_FROM_COPY` | Linux apps only. By default, the app is run from `/home/site/wwwroot`, a shared directory for all scaled-out instances. Set this variable to `true` to copy the app to a local directory in your container and run it from there. When using this option, be sure not to hard-code any reference to `/home/site/wwwroot`. Instead, use a path relative to `/home/site/wwwroot`. |
| `MACHINEKEY_Decryption` | For Windows native apps or Windows containerized apps, this variable is injected into app environment or container to enable ASP.NET cryptographic routines (see [machineKey Element](/previous-versions/dotnet/netframework-4.0/w8h3skw9(v=vs.100)). To override the default `decryption` value, configure it as an App Service app setting, or set it directly in the `machineKey` element of the *Web.config* file. |
| `MACHINEKEY_DecryptionKey` | For Windows native apps or Windows containerized apps, this variable is injected into the app environment or container to enable ASP.NET cryptographic routines (see [machineKey Element](/previous-versions/dotnet/netframework-4.0/w8h3skw9(v=vs.100)). To override the automatically generated `decryptionKey` value, configure it as an App Service app setting, or set it directly in the `machineKey` element of the *Web.config* file.|
| `MACHINEKEY_Validation` | For Windows native apps or Windows containerized apps, this variable is injected into the app environment or container to enable ASP.NET cryptographic routines (see [machineKey Element](/previous-versions/dotnet/netframework-4.0/w8h3skw9(v=vs.100)). To override the default `validation` value, configure it as an App Service app setting, or set it directly in the `machineKey` element of the *Web.config* file.|
| `MACHINEKEY_ValidationKey` | For Windows native apps or Windows containerized apps, this variable is injected into the app environment or container to enable ASP.NET cryptographic routines (see [machineKey Element](/previous-versions/dotnet/netframework-4.0/w8h3skw9(v=vs.100)). To override the automatically generated `validationKey` value, configure it as an App Service app setting, or set it directly in the `machineKey` element of the *Web.config* file.|
<!-- | `USE_DOTNET_MONITOR` | if =true then /opt/dotnetcore-tools/dotnet-monitor collect --urls "http://0.0.0.0:50051" --metrics true --metricUrls "http://0.0.0.0:50050" > /dev/null 2>&1 & -->

# [Java](#tab/java)

| Setting name | Description | Example |
|-|-|-|
| `JAVA_HOME` | Path of the Java installation directory ||
| `JAVA_OPTS` | For Java SE apps, environment variables to pass into the `java` command. Can contain system variables. For Tomcat, use `CATALINA_OPTS`. | `-Dmysysproperty=%DRIVEPATH%` |
| `AZURE_JAVA_APP_PATH` | Environment variable can be used by custom scripts so they have a location for app.jar after it's copied to local. | |
| `SKIP_JAVA_KEYSTORE_LOAD` | value of 1 to disable App Service from loading the certificates into the key store automatically ||
| `WEBSITE_JAVA_JAR_FILE_NAME` | The .jar file to use. Appends .jar if the string doesn't end in .jar. Defaults to app.jar ||
| `WEBSITE_JAVA_WAR_FILE_NAME` | The .war file to use. Appends .war if the string doesn't end in .war. Defaults to app.war ||
| `JAVA_ARGS` | java opts required by different java webserver. Defaults to `-noverify -Djava.net.preferIPv4Stack=true` ||
| `JAVA_WEBSERVER_PORT_ENVIRONMENT_VARIABLES` | environment variables used by popular Java web frameworks for server port. Some frameworks included are: Spring, Micronaut, Grails, MicroProfile Thorntail, Helidon, Ratpack, and Quarkus ||
| `JAVA_TMP_DIR` | Added to Java args as `-Dsite.tempdir`. Defaults to `TEMP`. ||
| `WEBSITE_SKIP_LOCAL_COPY` | By default, the deployed app.jar is copied from `/home/site/wwwroot` to a local location. To disable this behavior and load app.jar directly from `/home/site/wwwroot`, set this variable `1` or `true`. This setting has no effect if local cache is enabled. | |
| `TOMCAT_USE_STARTUP_BAT` | Native Windows apps only. By default, the Tomcat server is started with its `startup.bat`. To initiate using its `catalina.bat` instead, set to `0` or `False`. | `%LOCAL_EXPANDED%\tomcat` |
| `CATALINA_OPTS` | For Tomcat apps, environment variables to pass into the `java` command. Can contain system variables. | |
| `CATALINA_BASE` | To use a custom Tomcat installation, set to the installation's location. | |
| `WEBSITE_JAVA_MAX_HEAP_MB` | The Java maximum heap in MB. This setting is effective only when an experimental Tomcat version is used. | |
| `WEBSITE_DISABLE_JAVA_HEAP_CONFIGURATION` | Manually disable `WEBSITE_JAVA_MAX_HEAP_MB` by setting this variable to `true` or `1`. | |
| `WEBSITE_AUTH_SKIP_PRINCIPAL` | By default, the following Tomcat [HttpServletRequest interface](https://tomcat.apache.org/tomcat-5.5-doc/servletapi/javax/servlet/http/HttpServletRequest.html) are hydrated when you enable the built-in [authentication](overview-authentication-authorization.md): `isSecure`, `getRemoteAddr`, `getRemoteHost`, `getScheme`, `getServerPort`. To disable it, set to `1`.  | |
| `WEBSITE_SKIP_FILTERS` | To disable all servlet filters added by App Service, set to `1`. ||
| `IGNORE_CATALINA_BASE` | By default, App Service checks if the Tomcat variable `CATALINA_BASE` is defined. If not, it looks for the existence of `%HOME%\tomcat\conf\server.xml`. If the file exists, it sets `CATALINA_BASE` to `%HOME%\tomcat`. To disable this behavior and remove `CATALINA_BASE`, set this variable to `1` or `true`. ||
| `PORT` | Read-only. For Linux apps, port that the Java runtime listens to in the container. | |
| `WILDFLY_VERSION` | Read-only. For JBoss (Linux) apps, WildFly version. | |
| `TOMCAT_VERSION` | Read-only. For Linux Tomcat apps, Tomcat version. ||
| `JBOSS_HOME` | Read-only. For JBoss (Linux) apps, path of the WildFly installation. | |
| `AZURE_JETTY9_CMDLINE` | Read-only. For native Windows apps, command-line arguments for starting Jetty 9. | |
| `AZURE_JETTY9_HOME` | Read-only. For native Windows apps, path to the Jetty 9 installation.| |
| `AZURE_JETTY93_CMDLINE` | Read-only. For native Windows apps, command-line arguments for starting Jetty 9.3. | |
| `AZURE_JETTY93_HOME` | Read-only. For native Windows apps, path to the Jetty 9.3 installation. | |
| `AZURE_TOMCAT7_CMDLINE` | Read-only. For native Windows apps, command-line arguments for starting Tomcat 7. | |
| `AZURE_TOMCAT7_HOME` | Read-only. For native Windows apps, path to the Tomcat 7 installation. | |
| `AZURE_TOMCAT8_CMDLINE` | Read-only. For native Windows apps, command-line arguments for starting Tomcat 8. | |
| `AZURE_TOMCAT8_HOME` | Read-only. For native Windows apps, path to the Tomcat 8 installation. | |
| `AZURE_TOMCAT85_CMDLINE` | Read-only. For native Windows apps, command-line arguments for starting Tomcat 8.5. | |
| `AZURE_TOMCAT85_HOME` | Read-only. For native Windows apps, path to the Tomcat 8.5 installation. | |
| `AZURE_TOMCAT90_CMDLINE` | Read-only. For native Windows apps, command-line arguments for starting Tomcat 9. | |
| `AZURE_TOMCAT90_HOME` | Read-only. For native Windows apps, path to the Tomcat 9 installation. | |
| `AZURE_SITE_HOME` | The value added to the Java args as `-Dsite.home`. The default is the value of `HOME`. | |
| `HTTP_PLATFORM_PORT` | Added to Java args as `-Dport.http`. The following environment variables used by different Java web frameworks are also set to this value: `SERVER_PORT`, `MICRONAUT_SERVER_PORT`, `THORNTAIL_HTTP_PORT`, `RATPACK_PORT`, `QUARKUS_HTTP_PORT`, `PAYARAMICRO_PORT`. ||
| `AZURE_LOGGING_DIR` | For Windows Apps, added to Java args as `-Dsite.logdir`. The default is `%HOME%\LogFiles\`. Default value in Linux is `AZURE_LOGGING_DIR=/home/LogFiles`. ||

<!-- 
WEBSITE_JAVA_COPY_ALL
AZURE_SITE_APP_BASE
 -->

# [Node.js](#tab/node)

| Setting name | Description |
|-|-|
| `PORT` | Read-only. For Linux apps, port that the Node.js app listens to in the container. |
| `WEBSITE_ROLE_INSTANCE_ID` | Read-only. ID of the current instance. |
| `PM2HOME` | |
| `WEBSITE_NODE_DEFAULT_VERSION` | For native Windows apps, default node version the app is using. Any of the [supported Node.js versions](configure-language-nodejs.md#show-nodejs-version) can be used here. |

<!-- APPSVC_REMOTE_DEBUGGING
APPSVC_REMOTE_DEBUGGING_BREAK
APPSVC_TUNNEL_PORT -->

# [Python](#tab/python)

| Setting name | Description |
|-|-|
| `APPSVC_VIRTUAL_ENV` | Read-only. |
| `PORT` | Read-only. For Linux apps, port that the Python app listens to in the container. |

<!-- APPSVC_REMOTE_DEBUGGING
APPSVC_TUNNEL_PORT | -debugAdapter ptvsd -debugPort $APPSVC_TUNNEL_PORT"
APPSVC_REMOTE_DEBUGGING_BREAK | debugArgs+=" -debugWait" -->

# [PHP](#tab/php)

| Setting name | Description | Example|
|-|-|-|
| `PHP_Extensions` | Comma-separated list of PHP extensions. | `extension1.dll,extension2.dll,Name1=value1` |
| `PHP_ZENDEXTENSIONS` | For Linux apps, set to `xdebug` to use the XDebug version of the PHP container. ||
| `PHP_VERSION` | Read-only. The selected PHP version. ||
| `WEBSITE_PORT` | Read-only. Port that Apache server listens to in the container. ||
| `WEBSITE_ROLE_INSTANCE_ID` | Read-only. ID of the current instance. ||
| `WEBSITE_PROFILER_ENABLE_TRIGGER` | Set to `TRUE` to add `xdebug.profiler_enable_trigger=1` and `xdebug.profiler_enable=0` to the default `php.ini`. ||

<!-- 
ZEND_BIN_PATH
MEMCACHESHIM_REDIS_ENABLE
MEMCACHESHIM_PORT 
APACHE_LOG_DIR | RUN sed -i 's!ErrorLog ${APACHE_LOG_DIR}/error.log!ErrorLog /dev/stderr!g' /etc/apache2/apache2.conf 
APACHE_RUN_USER | RUN sed -i 's!User ${APACHE_RUN_USER}!User www-data!g' /etc/apache2/apache2.conf 
APACHE_RUN_GROUP | RUN sed -i 's!User ${APACHE_RUN_GROUP}!Group www-data!g' /etc/apache2/apache2.conf  
-->

# [Ruby](#tab/ruby)

| Setting name | Description | Example |
|-|-|-|
| `PORT` | Read-only. Port that the Rails app listens to in the container. ||
| `WEBSITE_ROLE_INSTANCE_ID` | Read-only. ID of the current instance. ||
| `RAILS_IGNORE_SPLASH` | By default, a default splash page is displayed when no Gemfile is found. Set this variable to any value to disable the splash page. ||
| `BUNDLE_WITHOUT` | To add `--without` options to `bundle install`, set the variable to the groups you want to exclude, separated by space. By default, all Gems are installed. | `test development` |
| `BUNDLE_INSTALL_LOCATION` | Directory to install gems. The default is `/tmp/bundle`. ||
| `RUBY_SITE_CONFIG_DIR` | Site config directory. The default is `/home/site/config`. The container checks for zipped gems in this directory. ||
| `SECRET_KEY_BASE` | By default, A random secret key base is generated. To use a custom secret key base, set this variable to the desired key base. ||
| `RAILS_ENV` | Rails environment. The default is `production`. ||
| `GEM_PRISTINE` | Set this variable to any value to run `gem pristine --all`. ||

-----

## WordPress

> [!div class="mx-tdCol5BreakAll"]
> |Application Setting | Scope | Value | Max | Description
> |-------------|-------------|-------------|---------------|--------------------|
> |WEBSITES_ENABLE_APP_SERVICE_STORAGE|Web App|true|-|When set to TRUE, file contents are preserved during restarts. |
> |WP_MEMORY_LIMIT|WordPress|128M|512M|Frontend or general wordpress PHP memory limit (per script). Can't be more than PHP_MEMORY_LIMIT|
> |WP_MAX_MEMORY_LIMIT|WordPress|256M|512M|Admin dashboard PHP memory limit (per script). Generally Admin dashboard/ backend scripts takes lot of memory compared to frontend scripts. Can't be more than PHP_MEMORY_LIMIT.|
> |PHP_MEMORY_LIMIT|PHP|512M|512M|Memory limits for general PHP script. It can only be decreased.|
> |FILE_UPLOADS|PHP|On|-|Can be either On or Off. Note that values are case sensitive. Enables or disables file uploads. |
> |UPLOAD_MAX_FILESIZE|PHP|50M|256M	Max file upload size limit. Can be increased up to 256M.|
> |POST_MAX_SIZE|PHP|128M|256M|Can be increased up to 256M. Generally should be more than UPLOAD_MAX_FILESIZE.|
> |MAX_EXECUTION_TIME|PHP|120|120|Can only be decreased. Please break down the scripts if it is taking more than 120 seconds. Added to avoid bad scripts from slowing the system.|
> |MAX_INPUT_TIME|PHP|120|120|Max time limit for parsing the input requests. Can only be decreased.|
> |MAX_INPUT_VARS|PHP|10000|10000|-|
> |DATABASE_HOST|Database|-|-|Database host used to connect to WordPress.|
> |DATABASE_NAME|Database|-|-|Database name used to connect to WordPress.|
> |DATABASE_USERNAME|Database|-|-|Database username used to connect to WordPress.|
> |DATABASE_PASSWORD|Database|-|-|Database password used to connect to the MySQL database. To change the MySQL database password, see [update admin password](../mysql/single-server/how-to-create-manage-server-portal.md#update-admin-password). Whenever the MySQL database password is changed, the Application Settings also need to be updated. |
> |WORDPRESS_ADMIN_EMAIL|Deployment only|-|-|WordPress admin email.|
> |WORDPRESS_ADMIN_PASSWORD|Deployment only|-|-|WordPress admin password. This is only for deployment purposes. Modifying this value has no effect on the WordPress installation. To change the WordPress admin password, see [resetting your password](https://wordpress.org/support/article/resetting-your-password/#to-change-your-password).|
> |WORDPRESS_ADMIN_USER|Deployment only|-|-|WordPress admin username|
> |WORDPRESS_ADMIN_LOCALE_CODE|Deployment only|-|-|Database username used to connect to WordPress.|

## Domain and DNS

| Setting name| Description | Example |
|-|-|-|
| `WEBSITE_DNS_SERVER` | IP address of primary DNS server for outgoing connections (such as to a back-end service). The default DNS server for App Service is Azure DNS, whose IP address is `168.63.129.16`. If your app uses [VNet integration](./overview-vnet-integration.md) or is in an [App Service environment](environment/intro.md), it inherits the DNS server configuration from the VNet by default. | `10.0.0.1` |
| `WEBSITE_DNS_ALT_SERVER` | IP address of fallback DNS server for outgoing connections. See `WEBSITE_DNS_SERVER`. | |
| `WEBSITE_ENABLE_DNS_CACHE` | Allows successful DNS resolutions to be cached. By Default expired DNS cache entries will be flushed & in addition to the existing cache to be flushed every 4.5 mins. | |

<!-- 
DOMAIN_OWNERSHIP_VERIFICATION_IDENTIFIERS
 -->

## TLS/SSL

For more information, see [Use a TLS/SSL certificate in your code in Azure App Service](configure-ssl-certificate-in-code.md).

| Setting name| Description |
|-|-|
| `WEBSITE_LOAD_CERTIFICATES` | Comma-separate thumbprint values to the certificate you want to load in your code, or `*` to allow all certificates to be loaded in code. Only [certificates added to your app](configure-ssl-certificate.md) can be loaded. |
| `WEBSITE_PRIVATE_CERTS_PATH` | Read-only. Path in a Windows container to the loaded private certificates. |
| `WEBSITE_PUBLIC_CERTS_PATH` | Read-only. Path in a Windows container to the loaded public certificates. |
| `WEBSITE_INTERMEDIATE_CERTS_PATH` | Read-only. Path in a Windows container to the loaded intermediate certificates. |
| `WEBSITE_ROOT_CERTS_PATH` | Read-only. Path in a Windows container to the loaded root certificates. |

## Deployment slots 

For more information on deployment slots, see [Set up staging environments in Azure App Service](deploy-staging-slots.md).

| Setting name| Description | Example |
|-|-|-|
|`WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS`| By default, the versions for site extensions are specific to each slot. This prevents unanticipated application behavior due to changing extension versions after a swap. If you want the extension versions to swap as well, set to `0` on *all slots*. ||
|`WEBSITE_OVERRIDE_PRESERVE_DEFAULT_STICKY_SLOT_SETTINGS`| Designates certain settings as [sticky or not swappable by default](deploy-staging-slots.md#which-settings-are-swapped). Default is `true`. Set this setting to `false` or `0` for *all deployment slots* to make them swappable instead. There's no fine-grain control for specific setting types. ||
|`WEBSITE_SWAP_WARMUP_PING_PATH`| Path to ping to warm up the target slot in a swap, beginning with a slash. The default is `/`, which pings the root path over HTTP. | `/statuscheck` |
|`WEBSITE_SWAP_WARMUP_PING_STATUSES`| Valid HTTP response codes for the warm-up operation during a swap. If the returned status code isn't in the list, the warmup and swap operations are stopped. By default, all response codes are valid. | `200,202` |
| `WEBSITE_SLOT_NUMBER_OF_TIMEOUTS_BEFORE_RESTART` | During a slot swap, maximum number of timeouts after which we force restart the site on a specific VM instance. The default is `3`. ||
| `WEBSITE_SLOT_MAX_NUMBER_OF_TIMEOUTS` | During a slot swap, maximum number of timeout requests for a single URL to make before giving up. The default is `5`. ||
| `WEBSITE_SKIP_ALL_BINDINGS_IN_APPHOST_CONFIG` | Set to `true` or `1` to skip all bindings in `applicationHost.config`. The default is `false`. If your app triggers a restart because `applicationHost.config` is updated with the swapped hostnames of th slots, set this variable to `true` to avoid a restart of this kind. If you're running a Windows Communication Foundation (WCF) app, don't set this variable. ||

<!-- 
|`WEBSITE_SWAP_SLOTNAME`||| 
-->

## Custom containers

For more information on custom containers, see [Run a custom container in Azure](quickstart-custom-container.md).

| Setting name| Description | Example |
|-|-|-|
| `WEBSITES_ENABLE_APP_SERVICE_STORAGE` | Set to `true` to enable the `/home` directory to be shared across scaled instances. The default is `true` for custom containers. ||
| `WEBSITES_CONTAINER_START_TIME_LIMIT` | Amount of time in seconds to wait for the container to complete start-up before restarting the container. Default is `230`. You can increase it up to the maximum of `1800`. ||
| `WEBSITES_CONTAINER_STOP_TIME_LIMIT` | Amount of time in seconds to wait for the container to terminate gracefully. Deafult is `5`. You can increase to a maximum of `120` ||
| `DOCKER_REGISTRY_SERVER_URL` | URL of the registry server, when running a custom container in App Service. For security, this variable isn't passed on to the container. | `https://<server-name>.azurecr.io` |
| `DOCKER_REGISTRY_SERVER_USERNAME` | Username to authenticate with the registry server at `DOCKER_REGISTRY_SERVER_URL`. For security, this variable isn't passed on to the container. ||
| `DOCKER_REGISTRY_SERVER_PASSWORD` | Password to authenticate with the registry server at `DOCKER_REGISTRY_SERVER_URL`. For security, this variable isn't passed on to the container. ||
| `DOCKER_ENABLE_CI` | Set to `true` to enable the continuous deployment for custom containers. The default is `false` for custom containers. ||
| `WEBSITE_PULL_IMAGE_OVER_VNET` | Connect and pull from a registry inside a Virtual Network or on-premises. Your app will need to be connected to a Virtual Network using VNet integration feature. This setting is also needed for Azure Container Registry with Private Endpoint. ||
| `WEBSITES_WEB_CONTAINER_NAME` | In a Docker Compose app, only one of the containers can be internet accessible. Set to the name of the container defined in the configuration file to override the default container selection. By default, the internet accessible container is the first container to define port 80 or 8080, or, when no such container is found, the first container defined in the configuration file. |  |
| `WEBSITES_PORT` | For a custom container, the custom port number on the container for App Service to route requests to. By default, App Service attempts automatic port detection of ports 80 and 8080. This setting isn't injected into the container as an environment variable. ||
| `WEBSITE_CPU_CORES_LIMIT` | By default, a Windows container runs with all available cores for your chosen pricing tier. To reduce the number of cores, set to the number of desired cores limit. For more information, see [Customize the number of compute cores](configure-custom-container.md?pivots=container-windows#customize-the-number-of-compute-cores).||
| `WEBSITE_MEMORY_LIMIT_MB` | By default all Windows Containers deployed in Azure App Service have a memory limit configured depending on the App Service Plan SKU. Set to the desired memory limit in MB. The cumulative total of this setting across apps in the same plan must not exceed the amount allowed by the chosen pricing tier. For more information, see [Customize container memory](configure-custom-container.md?pivots=container-windows#customize-container-memory). ||

<!-- 
CONTAINER_ENCRYPTION_KEY
CONTAINER_NAME
CONTAINER_IMAGE_URL
AzureWebEncryptionKey
CONTAINER_START_CONTEXT_SAS_URI
CONTAINER_AZURE_FILES_VOLUME_MOUNT_PATH
CONTAINER_START_CONTEXT
DOCKER_ENABLE_CI
WEBSITE_DISABLE_PRELOAD_HANG_MITIGATION
 -->

## Scaling

| Setting name| Description |
|-|-|
| `WEBSITE_INSTANCE_ID` | Read-only. Unique ID of the current VM instance, when the app is scaled out to multiple instances. |
| `WEBSITE_IIS_SITE_NAME` | Deprecated. Use `WEBSITE_INSTANCE_ID`. |
| `WEBSITE_DISABLE_OVERLAPPED_RECYCLING` | Overlapped recycling makes it so that before the current VM instance of an app is shut down, a new VM instance starts. In some cases, it can cause file locking issues. You can try turning it off by setting to `1`. |
| `WEBSITE_DISABLE_CROSS_STAMP_SCALE` | By default, apps are allowed to scale across stamps if they use Azure Files or a Docker container. Set to `1` or `true` to disable cross-stamp scaling within the app's region. The default is `0`. Custom Docker containers that set `WEBSITES_ENABLE_APP_SERVICE_STORAGE` to `true` or `1` can't scale cross-stamps because their content isn't completely encapsulated in the Docker container. |

## Logging

| Setting name| Description | Example |
|-|-|-|
| `WEBSITE_HTTPLOGGING_ENABLED` | Read-only. Shows whether the web server logging for Windows native apps is enabled (`1`) or not (`0`). ||
| `WEBSITE_HTTPLOGGING_RETENTION_DAYS` | Retention period in days of web server logs for Windows native apps, if web server logs are enabled. | `10` |
| `WEBSITE_HTTPLOGGING_CONTAINER_URL` | SAS URL of the blob storage container to store web server logs for Windows native apps, if web server logs are enabled. If not set, web server logs are stored in the app's file system (default shared storage). | |
| `DIAGNOSTICS_AZUREBLOBRETENTIONINDAYS` | Retention period in days of application logs for Windows native apps, if application logs are enabled. | `10` |
| `DIAGNOSTICS_AZUREBLOBCONTAINERSASURL` | SAS URL of the blob storage container to store application logs for Windows native apps, if application logs are enabled. | |
| `APPSERVICEAPPLOGS_TRACE_LEVEL` | Minimum log level to ship to Log Analytics for the [AppServiceAppLogs](troubleshoot-diagnostic-logs.md#supported-log-types) log type. | |
| `DIAGNOSTICS_LASTRESORTFILE` | The filename to create, or a relative path to the log directory, for logging internal errors for troubleshooting the listener. The default is `logging-errors.txt`. ||
| `DIAGNOSTICS_LOGGINGSETTINGSFILE` | Path to the log settings file, relative to `D:\home` or `/home`. The default is `site\diagnostics\settings.json`. | |
| `DIAGNOSTICS_TEXTTRACELOGDIRECTORY` | The log folder, relative to the app root (`D:\home\site\wwwroot` or `/home/site/wwwroot`). | `..\..\LogFiles\Application`|
| `DIAGNOSTICS_TEXTTRACEMAXLOGFILESIZEBYTES` | Maximum size of the log file in bytes. The default is `131072` (128 KB). ||
| `DIAGNOSTICS_TEXTTRACEMAXLOGFOLDERSIZEBYTES` | Maximum size of the log folder in bytes. The default is `1048576` (1 MB). ||
| `DIAGNOSTICS_TEXTTRACEMAXNUMLOGFILES` | Maximum number of log files to keep. The default is `20`. | |
| `DIAGNOSTICS_TEXTTRACETURNOFFPERIOD` | Time out in milliseconds to keep application logging enabled. The default is `43200000` (12 hours). ||
| `WEBSITE_LOG_BUFFERING` | By default, log buffering is enabled. Set to `0` to disable it. ||
| `WEBSITE_ENABLE_PERF_MODE` | For native Windows apps, set to `TRUE` to turn off IIS log entries for successful requests returned within 10 seconds. This is a quick way to do performance benchmarking by removing extended logging. ||

<!-- 
| `DIAGNOSTICS_AZURETABLESASURL` | old? | |
| WEBSITE_APPSERVICEAPPLOGS_TRACE_ENABLED | Read-only. Added when | | 
| AZMON_LOG_CATEGORY_APPSERVICEAPPLOGS_ENABLED | Read-only. Shows when the AppServiceAppLogs category in Azure Monitor settings is enabled. |
AZMON_LOG_CATEGORY_APPSERVICEPLATFORMLOGS_ENABLED  | Read-only. Shows when the AppServiceAppLogs category in Azure Monitor settings is enabled. |
AZMON_LOG_CATEGORY_APPSERVICECONSOLELOGS_ENABLED | Read-only. Shows when the AppServiceConsoleLogs category in Azure Monitor settings is enabled. |
WEBSITE_FUNCTIONS_AZUREMONITOR_CATEGORIES
WINDOWS_TRACING_FLAGS
WINDOWS_TRACING_LOGFILE
WEBSITE_FREB_DISABLE
WEBSITE_ARR_SESSION_AFFINITY_DISABLE

-->

## Performance counters

The following are 'fake' environment variables that don't exist if you enumerate them, but return their value if you look them up individually. The value is dynamic and can change on every lookup.

| Setting name| Description |
|-|-|
| `WEBSITE_COUNTERS_ASPNET` | A JSON object containing the ASP.NET perf counters. |
| `WEBSITE_COUNTERS_APP` | A JSON object containing sandbox counters. |
| `WEBSITE_COUNTERS_CLR` | A JSON object containing CLR counters. |
| `WEBSITE_COUNTERS_ALL` | A JSON object containing the combination of the other three variables. |

## Caching

| Setting name| Description |
|-|-|
| `WEBSITE_LOCAL_CACHE_OPTION` | Whether local cache is enabled. Available options are: <br/>- `Default`: Inherit the stamp-level global setting.<br/>- `Always`: Enable for the app.<br/>- OnStorageUnavailability<br/>- `Disabled`: Disabled for the app. |
| `WEBSITE_LOCAL_CACHE_READWRITE_OPTION` | Read-write options of the local cache. Available options are: <br/>- `ReadOnly`: Cache is read-only.<br/>- `WriteButDiscardChanges`: Allow writes to local cache but discard changes made locally. |
| `WEBSITE_LOCAL_CACHE_SIZEINMB` | Size of the local cache in MB. Default is `1000` (1 GB). |
| `WEBSITE_LOCALCACHE_READY` | Read-only flag indicating if the app using local cache. |
| `WEBSITE_DYNAMIC_CACHE` | Due to network file shared nature to allow access for multiple instances, the dynamic cache improves performance by caching the recently accessed files locally on an instance. Cache is invalidated when file is modified. The cache location is `%SYSTEMDRIVE%\local\DynamicCache` (same `%SYSTEMDRIVE%\local` quota is applied). By default, full content caching is enabled (set to `1`), which includes both file content and directory/file metadata (timestamps, size, directory content). To conserve local disk use, set to `2` to cache only directory/file metadata (timestamps, size, directory content). To turn off caching, set to `0`. |
| `WEBSITE_READONLY_APP` | When using dynamic cache, you can disable write access to the app root (`D:\home\site\wwwroot` or `/home/site/wwwroot`)  by setting this variable to `1`. Except for the `App_Data` directory, no exclusive locks are allowed, so that deployments don't get blocked by locked files. |

<!-- 
HTTP_X_LOCALCACHE_READY_CHECK
HTTP_X_APPINIT_CHECK
X_SERVER_ROUTED
HTTP_X_MS_REQUEST_ID
HTTP_X_MS_APIM_HOST
HTTP_X_MS_FORWARD_HOSTNAMES
HTTP_X_MS_FORWARD_TOKEN
HTTP_MWH_SECURITYTOKEN
IS_SERVICE_ENDPOINT
VNET_CLIENT_IP
HTTP_X_MS_SITE_RESTRICTED_TOKEN
HTTP_X_FROM
| LOCAL_ADDR | internal private IP address of app |
SERVERS_FOR_HOSTING_SERVER_PROVIDER
NEED_PLATFORM_AUTHORIZATION
TIP_VALUE
TIP_RULE_NAME
TIP_RULE_MAX_AGE
REWRITE_PATH
NEGOTIATE_CLIENT_CERT
| CLIENT_CERT_MODE | used with ClientCertEnabled. Required means ClientCert is required.  Optional means ClientCert is optional or accepted. OptionalInteractiveUser is similar to Optional; however, it will not ask user for Certificate in Browser Interactive scenario.|
| HTTPS_ONLY | set with terraform? |
 -->

## Networking

The following environment variables are related to [hybrid connections](app-service-hybrid-connections.md) and [VNET integration](./overview-vnet-integration.md).

| Setting name | Description |
|-|-|
| `WEBSITE_RELAYS` | Read-only. Data needed to configure the Hybrid Connection, including endpoints and service bus data. |
| `WEBSITE_REWRITE_TABLE` | Read-only. Used at runtime to do the lookups and rewrite connections appropriately. | 
| `WEBSITE_VNET_ROUTE_ALL` | By default, if you use [regional VNet Integration](./overview-vnet-integration.md#regional-virtual-network-integration), your app only routes RFC1918 traffic into your VNet. Set to `1` to route all outbound traffic into your VNet and be subject to the same NSGs and UDRs. The setting lets you access non-RFC1918 endpoints through your VNet, secure all outbound traffic leaving your app, and force tunnel all outbound traffic to a network appliance of your own choosing. |
| `WEBSITE_PRIVATE_IP` | Read-only. IP address associated with the app when [integrated with a VNet](./overview-vnet-integration.md). For Regional VNet Integration, the value is an IP from the address range of the delegated subnet, and for Gateway-required VNet Integration, the value is an IP from the address range of the point-to-site address pool configured on the Virtual Network Gateway. This IP is used by the app to connect to the resources through the VNet. Also, it can change within the described address range. |
| `WEBSITE_PRIVATE_PORTS` | Read-only. In VNet integration, shows which ports are useable by the app to communicate with other nodes. |
| `WEBSITE_CONTENTOVERVNET` | If you are mounting an Azure File Share on the App Service and the Storage account is restricted to a VNET, ensure to enable this setting with a value of `1`. |

<!-- | WEBSITE_SLOT_POLL_WORKER_FOR_CHANGE_NOTIFICATION | Poll worker before pinging the site to detect when change notification has been processed. |
WEBSITE_SPECIAL_CACHE
WEBSITE_SOCKET_STATISTICS_ENABLED
| `WEBSITE_ENABLE_NETWORK_HEALTHCHECK` | Enable network health checks that won't be blocked by CORS or built-in authentication. Three check methods can be utilized: <br/>- Ping an IP address (configurable by `WEBSITE_NETWORK_HEALTH_IPADDRS`). <br/>- Check DNS resolution (configurable by `WEBSITE_NETWORK_HEALTH_DNS_ENDPOINTS`). <br/>- Poll URI endpoints (configurable by `WEBSITE_NETWORK_HEALTH_URI_ENDPOINTS`).<br/> |
| `WEBSITE_NETWORK_HEALTH_IPADDRS` | https://msazure.visualstudio.com/One/_git/AAPT-Antares-EasyAuth/pullrequest/3763264 |
| `WEBSITE_NETWORK_HEALTH_DNS_ENDPOINTS` | |
| `WEBSITE_NETWORK_HEALTH_URI_ENDPOINTS` | |
| `WEBSITE_NETWORK_HEALTH_INTEVALSECS` | Interval of the network health check in seconds. The minimum value is 30 seconds. | |
| `WEBSITE_NETWORK_HEALTH_TIMEOUT_INTEVALSECS` | Time-out of the network health check in seconds. | |

-->
<!-- | CONTAINER_WINRM_USERNAME |
| CONTAINER_WINRM_PASSWORD| -->

## Key vault references

The following environment variables are related to [key vault references](app-service-key-vault-references.md).

| Setting name | Description |
|-|-|
| `WEBSITE_KEYVAULT_REFERENCES` | Read-only. Contains information (including statuses) for all Key Vault references that are currently configured in the app. |
| `WEBSITE_SKIP_CONTENTSHARE_VALIDATION` | If you set the shared storage connection of your app (using `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`) to a Key Vault reference, the app can't resolve the key vault reference at app creation or update if one of the following conditions is true: <br/>- The app accesses the key vault with a system-assigned identity.<br/>- The app accesses the key vault with a user-assigned identity, and the key vault is [locked with a VNet](../key-vault/general/overview-vnet-service-endpoints.md).<br/>To avoid errors at create or update time, set this variable to `1`. |
| `WEBSITE_DELAY_CERT_DELETION` | This env var can be set to 1 by users in order to ensure that a certificate that a worker process is dependent upon isn't deleted until it exits. |
<!-- | `WEBSITE_ALLOW_DOUBLE_ESCAPING_URL` | TODO | -->

## CORS

The following environment variables are related to Cross-Origin Resource Sharing (CORS) configuration.

| Setting name | Description |
|-|-|
| `WEBSITE_CORS_ALLOWED_ORIGINS` | Read-only. Shows the allowed origins for CORS. |
| `WEBSITE_CORS_SUPPORT_CREDENTIALS` | Read-only. Shows whether setting the `Access-Control-Allow-Credentials` header to `true` is enabled (`True`) or not (`False`). |

## Authentication & Authorization

The following environment variables are related to [App Service authentication](overview-authentication-authorization.md).

| Setting name| Description|
|-|-|
| `WEBSITE_AUTH_DISABLE_IDENTITY_FLOW`  | When set to `true`, disables assigning the thread principal identity in ASP.NET-based web applications (including v1 Function Apps). This is designed to allow developers to protect access to their site with auth, but still have it use a separate sign-in mechanism within their app logic. The default is `false`. |
| `WEBSITE_AUTH_HIDE_DEPRECATED_SID` | `true` or `false`. The default value is `false`. This is a setting for the legacy Azure Mobile Apps integration for Azure App Service. Setting this to `true` resolves an issue where the SID (security ID) generated for authenticated users might change if the user changes their profile information. Changing this value may result in existing Azure Mobile Apps user IDs changing. Most apps don't need to use this setting. |
| `WEBSITE_AUTH_NONCE_DURATION`| A _timespan_ value in the form `_hours_:_minutes_:_seconds_`. The default value is `00:05:00`, or 5 minutes. This setting controls the lifetime of the [cryptographic nonce](https://en.wikipedia.org/wiki/Cryptographic_nonce) generated for all browser-driven logins. If a sign-in fails to complete in the specified time, the sign-in flow will be retried automatically. This application setting is intended for use with the V1 (classic) configuration experience. If using the V2 authentication configuration schema, you should instead use the `login.nonce.nonceExpirationInterval` configuration value. |
| `WEBSITE_AUTH_PRESERVE_URL_FRAGMENT` | When set to `true` and users select on app links that contain URL fragments, the sign-in process will ensure that the URL fragment part of your URL doesn't get lost in the sign-in redirect process. For more information, see [Customize sign-in and sign-out in Azure App Service authentication](configure-authentication-customize-sign-in-out.md#preserve-url-fragments). |
| `WEBSITE_AUTH_USE_LEGACY_CLAIMS` | To maintain backward compatibility across upgrades, the authentication module uses the legacy claims mapping of short to long names in the `/.auth/me` API, so certain mappings are excluded (e.g. "roles"). To get the more modern version of the claims mappings, set this variable to `False`. In the "roles" example, it would be mapped to the long claim name "http://schemas.microsoft.com/ws/2008/06/identity/claims/role". |
| `WEBSITE_AUTH_DISABLE_WWWAUTHENTICATE` | `true` or `false`. The default value is `false`. When set to `true`, removes the [`WWW-Authenticate`](https://developer.mozilla.org/docs/Web/HTTP/Headers/WWW-Authenticate) HTTP response header from module-generated HTTP 401 responses. This application setting is intended for use with the V1 (classic) configuration experience. If using the V2 authentication configuration schema, you should instead use the `identityProviders.azureActiveDirectory.login.disableWwwAuthenticate` configuration value. |
| `WEBSITE_AUTH_STATE_DIRECTORY`  | A local file system directory path where tokens are stored when the file-based token store is enabled. The default value is `%HOME%\Data\.auth`. This application setting is intended for use with the V1 (classic) configuration experience. If using the V2 authentication configuration schema, you should instead use the `login.tokenStore.fileSystem.directory` configuration value. |
| `WEBSITE_AUTH_TOKEN_CONTAINER_SASURL` | A fully qualified blob container URL. Instructs the auth module to store and load all encrypted tokens to the specified blob storage container instead of using the default local file system.  |
| `WEBSITE_AUTH_TOKEN_REFRESH_HOURS` | Any positive decimal number. The default value is `72` (hours). This setting controls the amount of time after a session token expires that the `/.auth/refresh` API can be used to refresh it. Refresh attempts after this period will fail and end users will be required to sign-in again. This application setting is intended for use with the V1 (classic) configuration experience. If using the V2 authentication configuration schema, you should instead use the `login.tokenStore.tokenRefreshExtensionHours` configuration value. |
| `WEBSITE_AUTH_TRACE_LEVEL`| Controls the verbosity of authentication traces written to [Application Logging](troubleshoot-diagnostic-logs.md#enable-application-logging-windows). Valid values are `Off`, `Error`, `Warning`, `Information`, and `Verbose`. The default value is `Verbose`. |
| `WEBSITE_AUTH_VALIDATE_NONCE`| `true` or `false`. The default value is `true`. This value should never be set to `false` except when temporarily debugging [cryptographic nonce](https://en.wikipedia.org/wiki/Cryptographic_nonce) validation failures that occur during interactive logins. This application setting is intended for use with the V1 (classic) configuration experience. If using the V2 authentication configuration schema, you should instead use the `login.nonce.validateNonce` configuration value. |
| `WEBSITE_AUTH_V2_CONFIG_JSON` | This environment variable is populated automatically by the Azure App Service platform and is used to configure the integrated authentication module. The value of this environment variable corresponds to the V2 (non-classic) authentication configuration for the current app in Azure Resource Manager. It's not intended to be configured explicitly. |
| `WEBSITE_AUTH_ENABLED` | Read-only. Injected into a Windows or Linux app to indicate whether App Service authentication is enabled. |
| `WEBSITE_AUTH_ENCRYPTION_KEY` | By default, the automatically generated key is used as the encryption key. To override, set to a desired key. This is recommended if you want to share tokens or sessions across multiple apps. If specified, it supersedes the `MACHINEKEY_DecryptionKey` setting. |
| `WEBSITE_AUTH_SIGNING_KEY` | By default, the automatically generated key is used as the signing key. To override, set to a desired key. This is recommended if you want to share tokens or sessions across multiple apps. If specified, it supersedes the `MACHINEKEY_ValidationKey` setting. |

<!-- System settings
WEBSITE_AUTH_RUNTIME_VERSION
WEBSITE_AUTH_API_PREFIX
WEBSITE_AUTH_TOKEN_STORE
WEBSITE_AUTH_MOBILE_COMPAT
WEBSITE_AUTH_AAD_BYPASS_SINGLE_TENANCY_CHECK
WEBSITE_AUTH_COOKIE_EXPIRATION_TIME
WEBSITE_AUTH_COOKIE_EXPIRATION_MODE
WEBSITE_AUTH_PROXY_HEADER_CONVENTION
WEBSITE_AUTH_PROXY_HOST_HEADER
WEBSITE_AUTH_PROXY_PROTO_HEADER
WEBSITE_AUTH_REQUIRE_HTTPS
WEBSITE_AUTH_DEFAULT_PROVIDER
WEBSITE_AUTH_UNAUTHENTICATED_ACTION
WEBSITE_AUTH_EXTERNAL_REDIRECT_URLS
WEBSITE_AUTH_CUSTOM_IDPS
WEBSITE_AUTH_CUSTOM_AUTHZ_SETTINGS
WEBSITE_AUTH_CLIENT_ID
WEBSITE_AUTH_CLIENT_SECRET
WEBSITE_AUTH_CLIENT_SECRET_SETTING_NAME
WEBSITE_AUTH_CLIENT_SECRET_CERTIFICATE_THUMBPRINT
WEBSITE_AUTH_OPENID_ISSUER
WEBSITE_AUTH_ALLOWED_AUDIENCES
WEBSITE_AUTH_LOGIN_PARAMS
WEBSITE_AUTH_AUTO_AAD
WEBSITE_AUTH_AAD_CLAIMS_AUTHORIZATION
WEBSITE_AUTH_GOOGLE_CLIENT_ID
WEBSITE_AUTH_GOOGLE_CLIENT_SECRET
WEBSITE_AUTH_GOOGLE_CLIENT_SECRET_SETTING_NAME
WEBSITE_AUTH_GOOGLE_SCOPE
WEBSITE_AUTH_FB_APP_ID
WEBSITE_AUTH_FB_APP_SECRET
WEBSITE_AUTH_FB_APP_SECRET_SETTING_NAME
WEBSITE_AUTH_FB_SCOPE
WEBSITE_AUTH_GITHUB_CLIENT_ID
WEBSITE_AUTH_GITHUB_CLIENT_SECRET
WEBSITE_AUTH_GITHUB_CLIENT_SECRET_SETTING_NAME
WEBSITE_AUTH_GITHUB_APP_SCOPE
WEBSITE_AUTH_TWITTER_CONSUMER_KEY
WEBSITE_AUTH_TWITTER_CONSUMER_SECRET
WEBSITE_AUTH_TWITTER_CONSUMER_SECRET_SETTING_NAME
WEBSITE_AUTH_MSA_CLIENT_ID
WEBSITE_AUTH_MSA_CLIENT_SECRET
WEBSITE_AUTH_MSA_CLIENT_SECRET_SETTING_NAME
WEBSITE_AUTH_MSA_SCOPE
WEBSITE_AUTH_FROM_FILE
WEBSITE_AUTH_FILE_PATH
| `WEBSITE_AUTH_CONFIG_DIR` | (Used for the deprecated "routes" feature) |
| `WEBSITE_AUTH_ZUMO_USE_TOKEN_STORE_CLAIMS` | (looks like only a tactical fix) ||
 -->

## Managed identity

The following environment variables are related to [managed identities](overview-managed-identity.md).

|Setting name | Description |
|-|-|
|`IDENTITY_ENDPOINT` | Read-only. The URL to retrieve the token for the app's [managed identity](overview-managed-identity.md). |
| `MSI_ENDPOINT` | Deprecated. Use `IDENTITY_ENDPOINT`. |
| `IDENTITY_HEADER` | Read-only. Value that must be added to the `X-IDENTITY-HEADER` header when making an HTTP GET request to `IDENTITY_ENDPOINT`. The value is rotated by the platform. |
| `MSI_SECRET` | Deprecated. Use `IDENTITY_HEADER`. |
<!-- | `WEBSITE_AUTHENTICATION_ENDPOINT_ENABLED` | Disabled by default? TODO | -->

## Health check

The following environment variables are related to [health checks](monitor-instances-health-check.md).

| Setting name | Description |
|-|-|
| `WEBSITE_HEALTHCHECK_MAXPINGFAILURES` | The maximum number of failed pings before removing the instance. Set to a value between `2` and `100`. When you're scaling up or out, App Service pings the Health check path to ensure new instances are ready. For more information, see [Health check](monitor-instances-health-check.md).|
| `WEBSITE_HEALTHCHECK_MAXUNHEALTHYWORKERPERCENT` | To avoid overwhelming healthy instances, no more than half of the instances will be excluded. For example, if an App Service Plan is scaled to four instances and three are unhealthy, at most two will be excluded. The other two instances (one healthy and one unhealthy) will continue to receive requests. In the worst-case scenario where all instances are unhealthy, none will be excluded. To override this behavior, set to a value between `1` and `100`. A higher value means more unhealthy instances will be removed. The default is `50` (50%). |

## Push notifications

The following environment variables are related to the [push notifications](/previous-versions/azure/app-service-mobile/app-service-mobile-xamarin-forms-get-started-push#configure-hub) feature.

| Setting name | Description |
|-|-|
| `WEBSITE_PUSH_ENABLED` | Read-only. Added when push notifications are enabled. |
| `WEBSITE_PUSH_TAG_WHITELIST` | Read-only. Contains the tags in the notification registration. |
| `WEBSITE_PUSH_TAGS_REQUIRING_AUTH` | Read-only. Contains a list of tags in  the notification registration that requires user authentication. |
| `WEBSITE_PUSH_TAGS_DYNAMIC` | Read-only. Contains a list of tags in the notification registration that were added automatically. | 

>[!NOTE]
> This article contains references to a term that Microsoft no longer uses. When the term is removed from the software, we’ll remove it from this article.

<!-- 
## WellKnownAppSettings

WEBSITE_ALWAYS_PERFORM_PRELOAD
| WEBSITE_DISABLE_PRIMARY_VOLUMES | Set to `true` to disable the primary storage volume for that app. The default is `false`. |
| WEBSITE_DISABLE_STANDBY_VOLUMES | Set to `true` to disable the stand-by storage volume for that app. The default is `false`. This setting has no effect if `WEBSITE_DISABLE_PRIMARY_VOLUMES` is `true`. |
WEBSITE_FAILOVER_ONLY_ON_SBX_NW_FAILURES
WEBSITE_ENABLE_SYSTEM_LOG
WEBSITE_FRAMEWORK_JIT
WEBSITE_ADMIN_SITEID
WEBSITE_STAMP_DEPLOYMENT_ID
| WEBSITE_DEPLOYMENT_ID | Read-only. internal ID of deployment slot |
| WEBSITE_DISABLE_MSI | deprecated |
WEBSITE_VNET_BLOCK_FOR_SETUP_MAIN_SITE
WEBSITE_VNET_BLOCK_FOR_SETUP_SCM_SITE

 -->

## Webjobs

The following environment variables are related to [WebJobs](webjobs-create.md).

| Setting name| Description |
|-|-|
| `WEBJOBS_RESTART_TIME`|For continuous jobs, delay in seconds when a job's process goes down for any reason before relaunching it. |
| `WEBJOBS_IDLE_TIMEOUT`| For triggered jobs, timeout in seconds, after which the job is aborted if it's in idle, has no CPU time or output. |
| `WEBJOBS_HISTORY_SIZE`| For triggered jobs, maximum number of runs kept in the history directory per job. The default is `50`. |
| `WEBJOBS_STOPPED`| Set to `1` to disable running any job, and stop all currently running jobs. |
| `WEBJOBS_DISABLE_SCHEDULE`| Set to `1` to turn off all scheduled triggering. Jobs can still be manually invoked. |
| `WEBJOBS_ROOT_PATH`| Absolute or relative path of webjob files. For a relative path, the value is combined with the default root path (`D:/home/site/wwwroot/` or `/home/site/wwwroot/`). |
| `WEBJOBS_LOG_TRIGGERED_JOBS_TO_APP_LOGS`| Set to true to send output from triggered WebJobs to the application logs pipeline (which supports file system, blobs, and tables). |
| `WEBJOBS_SHUTDOWN_FILE` | File that App Service creates when a shutdown request is detected. It's the web job process's responsibility to detect the presence of this file and initiate shutdown. When using the WebJobs SDK, this part is handled automatically. |
| `WEBJOBS_PATH` | Read-only. Root path of currently running job (will be under some temporary directory). |
| `WEBJOBS_NAME` | Read-only. Current job name. |
| `WEBJOBS_TYPE` | Read-only. Current job type (`triggered` or `continuous`). |
| `WEBJOBS_DATA_PATH` | Read-only. Current job metadata path to contain the job's logs, history, and any artifact of the job. |
| `WEBJOBS_RUN_ID` | Read-only. For triggered jobs, current run ID of the job. |

## Functions

| Setting name | Description |
|-|-|
| `WEBSITE_FUNCTIONS_ARMCACHE_ENABLED` | Set to `0` to disable the functions cache. |
| `WEBSITE_MAX_DYNAMIC_APPLICATION_SCALE_OUT` | [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md) |
|`AzureWebJobsSecretStorageType` | [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md) |
| `FUNCTIONS_EXTENSION_VERSION` | [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md) |
| `FUNCTIONS_WORKER_RUNTIME` | [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md) |
| `AzureWebJobsStorage` | [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md) |
| `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` | [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md) |
| `WEBSITE_CONTENTSHARE` | [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md) |
| `WEBSITE_CONTENTOVERVNET` | [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md) |
| `WEBSITE_ENABLE_BROTLI_ENCODING` | [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md) |
| `WEBSITE_USE_PLACEHOLDER` | [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md) |
| `WEBSITE_PLACEHOLDER_MODE` | Read-only. Shows whether the function app is running on a placeholder host (`generalized`) or its own host (`specialized`). |
| `WEBSITE_DISABLE_ZIP_CACHE` | When your app runs from a [ZIP package](deploy-run-package.md) ( `WEBSITE_RUN_FROM_PACKAGE=1`), the five most recently deployed ZIP packages are cached in the app's file system (D:\home\data\SitePackages). Set this variable to `1` to disable this cache. For Linux consumption apps, the ZIP package cache is disabled by default. |
<!--
| `FUNCTIONS_RUNTIME_SCALE_MONITORING_ENABLED` | TODO |
| `WEBSITE_SKIP_FUNCTION_APP_WARMUP` | Apps can use appsetting to opt out of warmup. Restricted to linux only since this is primarily for static sites that use Linux dynamic function apps. Linux dynamic sites are used as placeholder sites for static sites. Function apps don't get specialized until static sites are deployed. This allows function apps used by static sites to skip warmup and using up containers before any content is deployed. TODO |
 WEBSITE_IDLE_TIMEOUT_IN_MINUTES | removed WEBSITE_IDLE_TIMEOUT_IN_MINUTES because they aren't used in Linux Consumption.???
| `WEBSITE_DISABLE_FUNCTIONS_STARTUPCONTEXT_CACHE`| This env var can be set to 1 by users in order to avoid using the Functions StartupContext Cache feature. |
| `WEBSITE_CONTAINER_READY` | The env var is set to '1' to indicate to the Functions Runtime that it can proceed with initializing/specializing 
        // itself. For placeholders, it is set once specialization is complete on DWAS side and detours are reinitialized. For 
        // non-placeholder function apps, it is simply set to 1 when the process is started, because detours are initialized 
        // as part of starting the process (when PicoHelper.dll is loaded, well before any managed code is running).
        // NOTE: This is set on all sites, irrespective of whether it is a Functions site, because the EnvSettings module depends 
        // upon it to decide when to inject the app-settings.|
| `WEBSITE_PLACEHOLDER_PING_PATH` | This env var can be used to set a special warmup ping path on placeholder template sites. |
| ` WEBSITE_PLACEHOLDER_DISABLE_AUTOSPECIALIZATION` | This env var can be used to disable specialization from being enabled automatically for a given placeholder template site. |
| `WEBSITE_FUNCTIONS_STARTUPCONTEXT_CACHE` | This env var is set only during specialization of a placeholder, to indicate to the Functions Runtime that
        // some function-app related data needed at startup, like secrets, are available in a file at the path specified
        // by this env var. |
WEBSITE_ENABLE_COLD_START_PROFILING | This env var can be set to 1 by internal SLA sites in order to trigger collection of perf profiles, if feature is enabled on the stamp. |
WEBSITE_CURRENT_STAMPNAME | these environments contain the stamp name used for various scale decisions |
WEBSITE_HOME_STAMPNAME | these environments contain the stamp name used for various scale decisions |
WEBSITE_ELASTIC_SCALING_ENABLED
WEBSITE_FILECHANGEAUDIT_ENABLED
| `WEBSITE_HTTPSCALEV2_ENABLED` | This is the default behavior for both v1 and v2 Azure Functions apps. | 
WEBSITE_CHANGEANALYSISSCAN_ENABLED
WEBSITE_DISABLE_CHILD_SPECIALIZATION
 -->

<!-- 
## Server variables
|HTTP_HOST| |
|HTTP_DISGUISED_HOST|the runtime site name for inbound requests.|
HTTP_CACHE_CONTROL
HTTP_X_SITE_DEPLOYMENT_ID
HTTP_WAS_DEFAULT_HOSTNAME
HTTP_X_ORIGINAL_URL
HTTP_X_FORWARDED_FOR
HTTP_X_ARR_SSL
HTTP_X_FORWARDED_PROTO
HTTP_X_APPSERVICE_PROTO
HTTP_X_FORWARDED_TLSVERSION
X-WAWS-Unencoded-URL
CLIENT-IP
X-ARR-LOG-ID
DISGUISED-HOST
X-SITE-DEPLOYMENT-ID
WAS-DEFAULT-HOSTNAME
X-Original-URL
X-MS-CLIENT-PRINCIPAL-NAME
X-MS-CLIENT-DISPLAY-NAME
X-Forwarded-For
X-ARR-SSL
X-Forwarded-Proto
X-AppService-Proto
X-Forwarded-TlsVersion
URL
HTTP_CLIENT_IP
APP_WARMING_UP |Regular/external requests made while warmup is in progress will have a APP_WARMING_UP server variable set to 1|
HTTP_COOKIE
SERVER_NAME
HTTP_X_FORWARDED_HOST
| HTTP_X_AZURE_FDID | Azure Front Door ID. See [](../frontdoor/front-door-faq.md#how-do-i-lock-down-the-access-to-my-backend-to-only-azure-front-door-) |
HTTP_X_FD_HEALTHPROBE
|WEBSITE_LOCALCACHE_ENABLED | shows up in w3wp.exe worker process |
HTTP_X_ARR_LOG_ID
| SCM_BASIC_AUTH_ALLOWED | set to "false" or "0" to disable basic authentication |
HTTP_X_MS_WAWS_JWT
HTTP_MWH_SecurityToken
LB_ALGO_FOR_HOSTING_SERVER_PROVIDER
ENABLE_CLIENT_AFFINITY
HTTP_X_MS_FROM_GEOMASTER
HTTP_X_MS_USE_GEOMASTER_CERT
HTTP_X_MS_STAMP_TOKEN
HTTPSCALE_REQUEST_ID
HTTPSCALE_FORWARD_FRONTEND_KEY
HTTPSCALE_FORWARD_REQUEST
IS_VALID_STAMP_TOKEN
NEEDS_SITE_RESTRICTED_TOKEN
HTTP_X_MS_PRIVATELINK_ID
  -->
