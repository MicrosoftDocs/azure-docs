---
title: Environment Variables and App Settings Reference
description: This article describes the commonly used environment variables in Azure App Service, and which ones can be modified with app settings.
ms.topic: conceptual
ms.date: 03/28/2025
author: cephalin
ms.author: cephalin
ms.custom:
  - build-2025
---

# Environment variables and app settings in Azure App Service

In [Azure App Service](overview.md), certain settings are available to the deployment or runtime environment as environment variables. You can customize some of these settings when you set them manually as [app settings](configure-common.md#configure-app-settings). This reference shows the variables that you can use or customize.

## App environment

The following environment variables are related to the app environment in general.

| Setting name| Description |
|-|-|
| `WEBSITE_SITE_NAME` | Read-only. App name. |
| `WEBSITE_RESOURCE_GROUP` | Read-only. Azure resource group name that contains the app resource. |
| `WEBSITE_OWNER_NAME` | Read-only. Contains the Azure subscription ID that owns the app, the resource group, and the webspace. |
| `REGION_NAME` | Read-only. Region name of the app. |
| `WEBSITE_PLATFORM_VERSION` | Read-only. App Service platform version. |
| `HOME` | Read-only. Path to the home directory (for example, `D:\home` for Windows). |
| `SERVER_PORT` | Read-only. Port that the app should listen to. |
| `WEBSITE_WARMUP_PATH` | Relative path to ping to warm up the app, beginning with a slash. The default is `/robots933456.txt`.<br/><br/>Whenever the platform starts up a container, the orchestrator makes repeated requests against this endpoint. The platform considers any response from this endpoint as an indication that the container is ready. When the platform considers the container to be ready, it starts forwarding organic traffic to the newly started container. Unless `WEBSITE_WARMUP_STATUSES` is configured, the platform considers any response from the container at this endpoint (even error codes such as 404 or 502) as an indication that the container is ready.<br/><br/>This app setting doesn't change the path that Always On uses. |
| `WEBSITE_WARMUP_STATUSES` | Comma-delimited list of HTTP status codes that are considered successful when the platform makes warm-up pings against a newly started container. Used with `WEBSITE_WARMUP_PATH`.<br/><br/>By default, any status code is considered an indication that the container is ready for organic traffic. You can use this app to require a specific response before organic traffic is routed to the container.<br/><br/>An example is `200,202`. If pings against the app's configured warm-up path receive a response with a 200 or 202 status code, organic traffic is routed to the container. If a status code that isn't in the list is received (such as 502), the platform continues to make pings until a 200 or 202 is received, or until the container startup timeout limit is reached. (See `WEBSITES_CONTAINER_START_TIME_LIMIT` later in this table.)<br/><br/>If the container doesn't respond with an HTTP status code that's in the list, the platform eventually fails the startup attempt and retries, which results in 503 errors. |
| `WEBSITE_COMPUTE_MODE` | Read-only. Specifies whether the app runs on dedicated (`Dedicated`) or shared (`Shared`) virtual machines (VMs). |
| `WEBSITE_SKU` | Read-only. Pricing tier of the app. Possible values are `Free`, `Shared`, `Basic`, and `Standard`. |
| `SITE_BITNESS` | Read-only. Shows whether the app is 32 bit (`x86`) or 64 bit (`AMD64`). |
| `WEBSITE_HOSTNAME` | Read-only. Primary host name for the app. This setting doesn't account for custom host names. |
| `WEBSITE_VOLUME_TYPE` | Read-only. Shows the storage volume type currently in use. |
| `WEBSITE_NPM_DEFAULT_VERSION` | Default npm version that the app is using. |
| `WEBSOCKET_CONCURRENT_REQUEST_LIMIT` | Read-only. Limit for concurrent WebSocket requests. For the `Standard` tier and higher, the value is `-1`, but there's still a per-VM limit based on your VM size. See [Cross VM Numerical Limits](https://github.com/projectkudu/kudu/wiki/Azure-Web-App-sandbox#cross-vm-numerical-limits). |
| `WEBSITE_PRIVATE_EXTENSIONS` | Set to `0` to disable the use of private site extensions. |
| `WEBSITE_TIME_ZONE` | By default, the time zone for the app is always UTC. You can change it to any of the valid values that are listed in [Default time zones](/windows-hardware/manufacture/desktop/default-time-zones). If the specified value isn't recognized, the app uses UTC. <br/><br/>Example: `Atlantic Standard Time` |
| `WEBSITE_ADD_SITENAME_BINDINGS_IN_APPHOST_CONFIG` | After slot swaps, the app might experience unexpected restarts. The reason is that after a swap, the host-name binding configuration goes out of sync, which by itself doesn't cause restarts. However, certain underlying storage events (such as storage volume failovers) might detect these discrepancies and force all worker processes to restart.<br/><br/>To minimize these types of restarts, set the app setting value to `1` on all slots. (The default is `0`.) But don't set this value if you're running a Windows Communication Foundation application. For more information, see [Troubleshoot swaps](deploy-staging-slots.md#troubleshoot-swaps). |
| `WEBSITE_PROACTIVE_AUTOHEAL_ENABLED` | By default, a VM instance is proactively corrected when it uses more than 90% of allocated memory for more than 30 seconds, or when 80% of the total requests in the last two minutes take longer than 200 seconds. If a VM instance triggers one of these rules, the recovery process is an overlapping restart of the instance.<br/><br/>Set to `false` to disable this recovery behavior. The default is `true`.<br/><br/>For more information, see the [Introducing Proactive Auto Heal](https://azure.github.io/AppService/2017/08/17/Introducing-Proactive-Auto-Heal.html) blog post. |
| `WEBSITE_PROACTIVE_CRASHMONITORING_ENABLED` | Whenever the w3wp.exe process on a VM instance of your app crashes due to an unhandled exception for more than three times in 24 hours, a debugger process is attached to the main worker process on that instance. The debugger process collects a memory dump when the worker process crashes again. This memory dump is then analyzed, and the call stack of the thread that caused the crash is logged in your App Service logs.<br/><br/>Set to `false` to disable this automatic monitoring behavior. The default is `true`.<br/><br/>For more information, see the [Proactive Crash Monitoring in Azure App Service](https://azure.github.io/AppService/2021/03/01/Proactive-Crash-Monitoring-in-Azure-App-Service.html) blog post. |
| `WEBSITE_DAAS_STORAGE_SASURI` | During crash monitoring (proactive or manual), the memory dumps are deleted by default. To save the memory dumps to a storage blob container, specify the shared access signature (SAS) URI. |
| `WEBSITE_CRASHMONITORING_ENABLED` | Set to `true` to enable [crash monitoring](https://azure.github.io/AppService/2020/08/11/Crash-Monitoring-Feature-in-Azure-App-Service.html) manually. You must also set `WEBSITE_DAAS_STORAGE_SASURI` and `WEBSITE_CRASHMONITORING_SETTINGS`. The default is `false`.<br/><br/>This setting has no effect if remote debugging is enabled. Also, if this setting is set to `true`, [proactive crash monitoring](https://azure.github.io/AppService/2021/03/01/Proactive-Crash-Monitoring-in-Azure-App-Service.html) is disabled. |
| `WEBSITE_CRASHMONITORING_SETTINGS` | JSON with the following format:`{"StartTimeUtc": "2020-02-10T08:21","MaxHours": "<elapsed-hours-from-StartTimeUtc>","MaxDumpCount": "<max-number-of-crash-dumps>"}`. Required to configure [crash monitoring](https://azure.github.io/AppService/2020/08/11/Crash-Monitoring-Feature-in-Azure-App-Service.html) if `WEBSITE_CRASHMONITORING_ENABLED` is specified. To log the call stack without saving the crash dump in the storage account, add `,"UseStorageAccount":"false"` in the JSON. |
| `REMOTEDEBUGGINGVERSION` | Remote debugging version. |
| `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` | By default, App Service creates a shared storage for you at app creation. To use a custom storage account instead, set to the connection string of your storage account. For functions, see [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md#website_contentazurefileconnectionstring).<br/><br/>Example: `DefaultEndpointsProtocol=https;AccountName=<name>;AccountKey=<key>` |
| `WEBSITE_CONTENTSHARE` | When you use specify a custom storage account with `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`, App Service creates a file share in that storage account for your app. To use a custom name, set this variable to the name that you want. If a file share with the specified name doesn't exist, App Service creates it for you.<br/><br/>Example: `myapp123` |
| `WEBSITE_SCM_ALWAYS_ON_ENABLED` | Read-only. Shows whether Always On is enabled (`1`) or not (`0`). |
| `WEBSITE_SCM_SEPARATE_STATUS` | Read-only. Shows whether the Kudu app is running in a separate process (`1`) or not (`0`). |
| `WEBSITE_DNS_ATTEMPTS` | Number of times to try name resolution. |
| `WEBSITE_DNS_TIMEOUT` | Number of seconds to wait for name resolution. |
| `WEBSITES_CONTAINER_START_TIME_LIMIT` | Amount of time (in seconds) that the platform waits for a container to become ready on startup. This setting applies to both code-based and container-based apps on App Service for Linux. The default value is `230`.<br/><br/>When a container starts up, repeated pings are made against the container to gauge its readiness to serve organic traffic. (See `WEBSITE_WARMUP_PATH` and `WEBSITE_WARMUP_STATUSES`.) These pings are continuously made until either a successful response is received or the start time limit is reached. If the container isn't deemed ready within the configured timeout, the platform fails the startup attempt and retries, which results in 503 errors.<br/><br/>For App Service for Windows containers, the default start time limit is `10 mins`. You can change the start time limit by specifying a time span. For example, `00:05:00` indicates 5 minutes. |

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
| `APPSETTING_` | Signifies that the customer sets a variable as an app setting in the app configuration. It's injected into a .NET app as an app setting. |
| `MAINSITE_` | Signifies that a variable is specific to the app itself. |
| `SCMSITE_` | Signifies that a variable is specific to the Kudu app. |
| `SQLCONNSTR_` | SQL Server connection string in the app configuration. It's injected into a .NET app as a connection string. |
| `SQLAZURECONNSTR_` | Azure SQL Database connection string in the app configuration. It's injected into a .NET app as a connection string. |
| `POSTGRESQLCONNSTR_` | PostgreSQL connection string in the app configuration. It's injected into a .NET app as a connection string. |
| `CUSTOMCONNSTR_` | Custom connection string in the app configuration. It's injected into a .NET app as a connection string. |
| `MYSQLCONNSTR_` | MySQL database connection string in the app configuration. It's injected into a .NET app as a connection string. |
| `AZUREFILESSTORAGE_` | Connection string to a custom share for a custom container in Azure Files. |
| `AZUREBLOBSTORAGE_` | Connection string to a custom storage account for a custom container in Azure Blob Storage. |
| `NOTIFICATIONHUBCONNSTR_` | Connection string to a notification hub in Azure Notification Hubs. |
| `SERVICEBUSCONNSTR_` | Connection string to an instance of Azure Service Bus. |
| `EVENTHUBCONNSTR_` | Connection string to an event hub in Azure Event Hubs. |
| `DOCDBCONNSTR_` | Connection string to a database in Azure Cosmos DB. |
| `REDISCACHECONNSTR_` | Connection string to a cache in Azure Cache for Redis. |
| `FILESHARESTORAGE_` | Connection string to a custom file share. |

## Deployment

The following environment variables are related to app deployment. For variables related to App Service build automation, see [Build automation](#build-automation) later in this article.

| Setting name| Description |
|-|-|
| `DEPLOYMENT_BRANCH`| For [local Git](deploy-local-git.md) or [cloud Git](deploy-continuous-deployment.md) deployment (such as GitHub), set to the branch in Azure that you want to deploy to. By default, it's `master`. |
| `WEBSITE_RUN_FROM_PACKAGE`| Set to `1` to run the app from a local ZIP package, or set to an external URL to run the app from a remote ZIP package. For more information, see [Run your app in Azure App Service directly from a ZIP package](deploy-run-package.md). |
| `WEBSITE_USE_ZIP` | Deprecated. Use `WEBSITE_RUN_FROM_PACKAGE`. |
| `WEBSITE_RUN_FROM_ZIP` | Deprecated. Use `WEBSITE_RUN_FROM_PACKAGE`. |
| `SCM_MAX_ZIP_PACKAGE_COUNT`| Your app keeps five of the most recent ZIP files deployed via [ZIP deploy](deploy-zip.md). You can keep more or fewer by changing the app setting to a different number. |
| `WEBSITE_WEBDEPLOY_USE_SCM` | Set to `false` for Web Deploy to stop using the Kudu deployment engine. The default is `true`. To deploy to Linux apps by using Visual Studio (Web Deploy/MSDeploy), set it to `false`. |
| `MSDEPLOY_RENAME_LOCKED_FILES` | Set to `1` to attempt to rename DLLs if they can't be copied during a Web Deploy deployment. This setting isn't applicable if `WEBSITE_WEBDEPLOY_USE_SCM` is set to `false`. |
| `WEBSITE_DISABLE_SCM_SEPARATION` | By default, the main app and the Kudu app run in different sandboxes. When you stop the app, the Kudu app is still running, and you can continue to use Git deployment and MSDeploy. Each app has its own local files. Turning off this separation (setting to `true`) is a legacy mode that's no longer fully supported. |
| `WEBSITE_ENABLE_SYNC_UPDATE_SITE` | Set to `1` ensure that REST API calls to update `site` and `siteconfig` are completely applied to all instances before returning. The default is `1` if you're deploying with an Azure Resource Manager template (ARM template), to avoid race conditions with subsequent Resource Manager calls. |
| `WEBSITE_START_SCM_ON_SITE_CREATION` | In an ARM template deployment, set to `1` in the ARM template to pre-start the Kudu app as part of app creation. |
| `WEBSITE_START_SCM_WITH_PRELOAD` | For Linux apps, set to `true` to force preloading the Kudu app when Always On is enabled by pinging its URL. The default is `false`. For Windows apps, the Kudu app is always preloaded. |

<!-- 
WEBSITE_RUN_FROM_PACKAGE_BLOB_MI_RESOURCE_ID
-->

## Build automation

# [Kudu (Windows)](#tab/kudu)

Kudu build configuration applies to native Windows apps and is used to control the behavior of Git-based (or ZIP-based) deployments.

| Setting name| Description |
|-|-|
| `SCM_BUILD_ARGS` | Add things at the end of the msbuild command line, such that it overrides any previous parts of the default command line.<br/><br/>For example, to do a clean build: `-t:Clean;Compile`. |
| `SCM_SCRIPT_GENERATOR_ARGS` | Kudu uses the [`azure site deploymentscript` command](http://blog.amitapple.com/post/38418009331/azurewebsitecustomdeploymentpart2) to generate a deployment script. It automatically detects the language framework type and determines the parameters to pass to the command. This setting overrides the automatically generated parameters.<br/><br/>For example, to treat your repository as plain content files: `--basic -p <folder-to-deploy>`. |
| `SCM_TRACE_LEVEL` | Build trace level. The default is `1`. Set to higher values, up to `4`, for more tracing. |
| `SCM_COMMAND_IDLE_TIMEOUT` | Timeout, in seconds, for each command that the build process runs to wait before producing any output. After that, the command is considered idle and stopped. The default is `60` (one minute). <br/><br/>In Azure, there's also a general idle request timeout that disconnects clients after 230 seconds. However, the command continues to run on the server side after that. |
| `SCM_LOGSTREAM_TIMEOUT` | Timeout of inactivity, in seconds, before stopping log streaming. The default is `1800` (30 minutes).|
| `SCM_SITEEXTENSIONS_FEED_URL` | URL of the site extensions gallery. The default is `https://www.nuget.org/api/v2/`. The URL of the old feed is `http://www.siteextensions.net/api/v2/`. |
| `SCM_USE_LIBGIT2SHARP_REPOSITORY` | Set to `0` to use git.exe instead of libgit2sharp for Git operations. |
| `WEBSITE_LOAD_USER_PROFILE` | In case of the error `The specified user does not have a valid profile` during ASP.NET build automation (such as during Git deployment), set this variable to `1` to load a full user profile in the build environment. This setting applies only when `WEBSITE_COMPUTE_MODE` is `Dedicated`. |
| `WEBSITE_SCM_IDLE_TIMEOUT_IN_MINUTES` | Timeout, in minutes, for the Source Control Manager (Kudu) site. The default is `20`. |
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | With [ZIP deploy](deploy-zip.md), the deployment engine assumes that a ZIP file is ready to run as is and doesn't run any build automation. To enable the same build automation as in [Git deployment](deploy-local-git.md), set to `true`. |

<!-- 
SCM_GIT_USERNAME
SCM_GIT_EMAIL
-->

# [Oryx (Linux)](#tab/oryx)

Oryx build configuration applies to Linux apps and is used to control the behavior of Git-based (or ZIP-based) deployments. See [Oryx configuration](https://github.com/microsoft/Oryx/blob/master/doc/configuration.md).

-----

## Language-specific settings

This section shows the configurable runtime settings for each supported language framework. More settings are available during [build automation](#build-automation) at deployment time.

# [.NET](#tab/dotnet)

<!-- 
| DOTNET_HOSTING_OPTIMIZATION_CACHE | 
-->
| Setting name | Description |
|-|-|
| `PORT` | Read-only. For Linux apps, the port that the .NET runtime listens to in the container. |
| `WEBSITE_ROLE_INSTANCE_ID` | Read-only. ID of the current instance. |
| `HOME` | Read-only. Directory that points to shared storage (`/home`). |
| `DUMP_DIR` | Read-only. Directory for the crash dumps (`/home/logs/dumps`). |
| `APP_SVC_RUN_FROM_COPY` | Linux apps only. By default, the app is run from `/home/site/wwwroot`, a shared directory for all scaled-out instances. Set this variable to `true` to copy the app to a local directory in your container and run it from there. When you use this option, be sure not to hard-code any reference to `/home/site/wwwroot`. Instead, use a path relative to `/home/site/wwwroot`. |
| `MACHINEKEY_Decryption` | For native Windows apps or containerized Windows apps, this variable is injected into an app environment or container to enable ASP.NET cryptographic routines. (See [machineKey Element](/previous-versions/dotnet/netframework-4.0/w8h3skw9(v=vs.100)).) To override the default `decryption` value, configure it as an App Service app setting, or set it directly in the `machineKey` element of the `Web.config` file. |
| `MACHINEKEY_DecryptionKey` | For native Windows apps or containerized Windows apps, this variable is injected into the app environment or container to enable ASP.NET cryptographic routines. (See [machineKey Element](/previous-versions/dotnet/netframework-4.0/w8h3skw9(v=vs.100)).) To override the automatically generated `decryptionKey` value, configure it as an App Service app setting, or set it directly in the `machineKey` element of the `Web.config` file. |
| `MACHINEKEY_Validation` | For native Windows apps or containerized Windows apps, this variable is injected into the app environment or container to enable ASP.NET cryptographic routines. (See [machineKey Element](/previous-versions/dotnet/netframework-4.0/w8h3skw9(v=vs.100)).) To override the default `validation` value, configure it as an App Service app setting, or set it directly in the `machineKey` element of the `Web.config` file. |
| `MACHINEKEY_ValidationKey` | For native Windows apps or containerized Windows apps, this variable is injected into the app environment or container to enable ASP.NET cryptographic routines. (See [machineKey Element](/previous-versions/dotnet/netframework-4.0/w8h3skw9(v=vs.100)).) To override the automatically generated `validationKey` value, configure it as an App Service app setting, or set it directly in the `machineKey` element of the `Web.config` file. |
<!-- | `USE_DOTNET_MONITOR` | if =true then /opt/dotnetcore-tools/dotnet-monitor collect --urls "http://0.0.0.0:50051" --metrics true --metricUrls "http://0.0.0.0:50050" > /dev/null 2>&1 & -->

# [Java](#tab/java)

| Setting name | Description |
|-|-|
| `JAVA_HOME` | Path of the Java installation directory. |
| `JAVA_OPTS` | For Java Standard Edition (SE) apps, environment variables to pass into the `java` command. They can contain system variables. For Tomcat, use `CATALINA_OPTS`.<br/><br/>Example: `-Dmysysproperty=%DRIVEPATH%` |
| `AZURE_JAVA_APP_PATH` | Environment variable that custom scripts can use so that they have a location for `app.jar` after it's copied to a local location. |
| `SKIP_JAVA_KEYSTORE_LOAD` | Set a value of 1 to disable App Service from loading the certificates into the key store automatically. |
| `WEBSITE_JAVA_JAR_FILE_NAME` | The .jar file to use. Appends `.jar` if the string doesn't end in `.jar`. Defaults to `app.jar`. |
| `WEBSITE_JAVA_WAR_FILE_NAME` | The .war file to use. Appends `.war` if the string doesn't end in `.war`. Defaults to `app.war`. |
| `JAVA_ARGS` | `JAVA_OPTS` value required by a different Java web server. Defaults to `-noverify -Djava.net.preferIPv4Stack=true`. |
| `JAVA_WEBSERVER_PORT_ENVIRONMENT_VARIABLES` | Environment variables used by popular Java web frameworks for server ports. Frameworks include Spring, Micronaut, Grails, Helidon, Ratpack, and Quarkus. |
| `JAVA_TMP_DIR` | Added to Java arguments as `-Dsite.tempdir`. Defaults to `TEMP`. |
| `WEBSITE_SKIP_LOCAL_COPY` | By default, the deployed `app.jar` file is copied from `/home/site/wwwroot` to a local location. To disable this behavior and load `app.jar` directly from `/home/site/wwwroot`, set this variable to `1` or `true`. This setting has no effect if local cache is enabled. |
| `TOMCAT_USE_STARTUP_BAT` | Native Windows apps only. By default, the Tomcat server is started with its `startup.bat` file. To set the Tomcat server to start by using its `catalina.bat` file instead, set the value to `0` or `False`.<br/><br/>Example: `%LOCAL_EXPANDED%\tomcat` |
| `CATALINA_OPTS` | For Tomcat apps, environment variables to pass into the `java` command. Can contain system variables. |
| `CATALINA_BASE` | To use a custom Tomcat installation, set to the installation's location. |
| `WEBSITE_JAVA_MAX_HEAP_MB` | Maximum size of the Java heap, in megabytes. Note: if `JAVA_OPTS` is defined and already contains one of the `-Xms` or `-Xmx` options, then `WEBSITE_JAVA_MAX_HEAP_MB` is not used. |
| `WEBSITE_DISABLE_JAVA_HEAP_CONFIGURATION` | Manually disable `WEBSITE_JAVA_MAX_HEAP_MB` by setting this variable to `true` or `1`. |
| `WEBSITE_AUTH_SKIP_PRINCIPAL` | By default, the following Tomcat [HttpServletRequest interfaces](https://tomcat.apache.org/tomcat-5.5-doc/servletapi/javax/servlet/http/HttpServletRequest.html) are hydrated when you enable the built-in [authentication](overview-authentication-authorization.md): `isSecure`, `getRemoteAddr`, `getRemoteHost`, `getScheme`, `getServerPort`, `getLocalPort`, `getRequestURL`. To disable it, set the value to `1`. |
| `WEBSITE_AUTH_EXPIRED_SESSION_LOGOFF` | If a webapp uses EasyAuth, set this to `true` or `1` to force a redirect to the EasyAuth logout page if the session associated to a request has expired (e.g. for webapps running on Tomcat, this is defined by the element `session-timeout` in the file `web.xml`). |
| `WEBSITE_SKIP_FILTERS` | To disable all servlet filters that App Service added, set to `1`. |
| `IGNORE_CATALINA_BASE` | By default, App Service checks if the Tomcat variable `CATALINA_BASE` is defined. If not, it looks for the existence of `%HOME%\tomcat\conf\server.xml`. If the file exists, it sets `CATALINA_BASE` to `%HOME%\tomcat`. To disable this behavior and remove `CATALINA_BASE`, set this variable to `1` or `true`. |
| `PORT` | Read-only. For Linux apps, the port that the Java runtime listens to in the container. |
| `WILDFLY_VERSION` | Read-only. For JBoss Enterprise Application Platform (EAP) Linux apps, the WildFly version. |
| `TOMCAT_VERSION` | Read-only. For Linux Tomcat apps, the Tomcat version. |
| `JBOSS_HOME` | Read-only. For JBoss EAP (Linux) apps, the path of the WildFly installation. |
| `AZURE_JETTY9_CMDLINE` | Read-only. For native Windows apps, the command-line arguments for starting Jetty 9. |
| `AZURE_JETTY9_HOME` | Read-only. For native Windows apps, the path to the Jetty 9 installation. |
| `AZURE_JETTY93_CMDLINE` | Read-only. For native Windows apps, specifies the command-line arguments for starting Jetty 9.3. |
| `AZURE_JETTY93_HOME` | Read-only. For native Windows apps, the path to the Jetty 9.3 installation. |
| `AZURE_TOMCAT7_CMDLINE` | Read-only. For native Windows apps, specifies the command-line arguments for starting Tomcat 7. |
| `AZURE_TOMCAT7_HOME` | Read-only. For native Windows apps, the path to the Tomcat 7 installation. |
| `AZURE_TOMCAT8_CMDLINE` | Read-only. For native Windows apps, specifies the command-line arguments for starting Tomcat 8. |
| `AZURE_TOMCAT8_HOME` | Read-only. For native Windows apps, the path to the Tomcat 8 installation. |
| `AZURE_TOMCAT85_CMDLINE` | Read-only. For native Windows apps, specifies the command-line arguments for starting Tomcat 8.5. |
| `AZURE_TOMCAT85_HOME` | Read-only. For native Windows apps, the path to the Tomcat 8.5 installation. |
| `AZURE_TOMCAT90_CMDLINE` | Read-only. For native Windows apps, specifies the command-line arguments for starting Tomcat 9. |
| `AZURE_TOMCAT90_HOME` | Read-only. For native Windows apps, the path to the Tomcat 9 installation. |
| `AZURE_SITE_HOME` | Value added to the Java arguments as `-Dsite.home`. The default is the value of `HOME`. |
| `HTTP_PLATFORM_PORT` | Added to Java arguments as `-Dport.http`. The following environment variables used by different Java web frameworks are also set to this value: `SERVER_PORT`, `MICRONAUT_SERVER_PORT`, `RATPACK_PORT`, `QUARKUS_HTTP_PORT`, `PAYARAMICRO_PORT`. |
| `AZURE_LOGGING_DIR` | For Windows Apps, added to Java arguments as `-Dsite.logdir`. The default is `%HOME%\LogFiles\`. Default value in Linux is `AZURE_LOGGING_DIR=/home/LogFiles`. |
| `WEBSITE_AUTH_ROLE_CLAIM_TYPE` | For Java web apps using built-in [authentication](overview-authentication-authorization.md), claims defined in Entra are available in the `HttpServletRequest.isUserInRole` API in the following format: <code>&lt;claimType&gt;&vert;&lt;claimValue&gt;</code> (e.g. <code>team&vert;contoso</code>). To add the values of claims with the type `roles` directly as role names in the `HttpServletRequest` implementation, set `WEBSITE_AUTH_ROLE_CLAIM_TYPE` to the value `roles`. |
| `WEBSITE_JAVA_GC_LOGGING` | For webapps using Java 11 or later in Linux, set this to `true` or `1` to capture Java Garbage Collector logs in `/home/LogFiles/Application` which can be used to troubleshoot performance issues. |
| `WEBSITE_SKIP_DUMP_ON_OUT_OF_MEMORY` | On Linux, set this to `true` or `1` to disable the following error-handling options that, by default, are passed as parameters to the JVM: `-XX:ErrorFile=/home/LogFiles/java_error_XXX.log`, `-XX:+CrashOnOutOfMemoryError`, `-XX:+HeapDumpOnOutOfMemoryError` and `-XX:HeapDumpPath=/home/LogFiles/java_memdump_XXX.log` |
| `WEBSITE_WORKING_DIR` | On Linux, set this to a path where the bootstrapping process should change before launching Java/Tomcat/JBoss. This is useful for webapps using Java 8, where Java error logs are saved to the same directory where Java was launched. |
| `WEBSITE_CATALINA_MAXCONNECTIONS` | Applies to Tomcat on Linux. The value is used to configure the `maxConnections` property of the Connector component in Tomcat's configuration. If not set, the value defaults to `10000`. |
| `WEBSITE_CATALINA_MAXTHREADS` | Applies to Tomcat on Linux. The value is used to configure the `maxThreads` property of the Connector component in Tomcat's configuration. If not set, the value defaults to `200`. |
| `WEBSITE_JAVA_JAR_FILE_NAME` | If set and the web application is a standalone Java (Java web server) application, this can be used to designate the name of a JAR file if there are multiple JAR files deployed, or the location of the file is not standard (e.g. in the `wwwroot` directory). Defaults to `app.jar`. |
| `WEBSITE_JAVA_WAR_FILE_NAME` | If set and the web application is a Tomcat application, this can be used to designate the name of a single WAR file if there are multiple WAR files deployed, or the location of the file is not standard (e.g. in the `wwwroot` directory). Defaults to `app.war`. |
| `WEBSITE_JAVA_KEYSTORE_PASSWORD` | The value of the keystore password used to store certificates with the `keytool` tool. |
| `WEBSITE_TOMCAT_APPSERVICE_ERROR_PAGE` | On Tomcat webapps, when set to `1` or `true`, the default Tomcat error page is replaced with a custom App Service error page. Defaults to `true`. |
| `WEBSITE_TOMCAT_ERROR_DETAILS` | Defaults to `false`. On Tomcat webapps, when set to `1` or `true`, the properties `showReport` and `showServerInfo` of the Error Report Valve are set to `true`, causing to show the stack trace of failed requests and the Tomcat version in the error page. |
| `WEBSITE_SKIP_TROUBLESHOOT_ARCHIVE` | By default, JAR and WAR archives are scanned for common problems during application startup. This includes looking for duplicate/conflicting Java classes inside the archive, which is a common problem that causes Java apps to crash. Setting this value to `true` or `1` will skip the scanning process. Defaults to `false`. |

<!-- 
WEBSITE_JAVA_COPY_ALL
AZURE_SITE_APP_BASE
-->

# [Node.js](#tab/node)

| Setting name | Description |
|-|-|
| `PORT` | Read-only. For Linux apps, the port that the Node.js app listens to in the container. |
| `WEBSITE_ROLE_INSTANCE_ID` | Read-only. ID of the current instance. |
| `PM2HOME` | |
| `WEBSITE_NODE_DEFAULT_VERSION` | For native Windows apps, the default node version that the app is using. You can use any of the [supported Node.js versions](configure-language-nodejs.md#show-nodejs-version) here. |

<!-- APPSVC_REMOTE_DEBUGGING
APPSVC_REMOTE_DEBUGGING_BREAK
APPSVC_TUNNEL_PORT -->

# [Python](#tab/python)

| Setting name | Description |
|-|-|
| `APPSVC_VIRTUAL_ENV` | Read-only. |
| `PORT` | Read-only. For Linux apps, the port that the Python app listens to in the container. |

<!-- APPSVC_REMOTE_DEBUGGING
APPSVC_TUNNEL_PORT | -debugAdapter ptvsd -debugPort $APPSVC_TUNNEL_PORT"
APPSVC_REMOTE_DEBUGGING_BREAK | debugArgs+=" -debugWait" -->

# [PHP](#tab/php)

| Setting name | Description |
|-|-|
| `PHP_Extensions` | Comma-separated list of PHP extensions.<br/><br/>Example: `extension1.dll,extension2.dll,Name1=value1` |
| `PHP_ZENDEXTENSIONS` | For Linux apps, set to `xdebug` to use the Xdebug version of the PHP container. |
| `PHP_VERSION` | Read-only. Selected PHP version. |
| `WEBSITE_PORT` | Read-only. Port that the Apache server listens to in the container. |
| `WEBSITE_ROLE_INSTANCE_ID` | Read-only. ID of the current instance. |
| `WEBSITE_PROFILER_ENABLE_TRIGGER` | Set to `TRUE` to add `xdebug.profiler_enable_trigger=1` and `xdebug.profiler_enable=0` to the default `php.ini`. |

<!-- 
ZEND_BIN_PATH
MEMCACHESHIM_REDIS_ENABLE
MEMCACHESHIM_PORT 
APACHE_LOG_DIR | RUN sed -i 's!ErrorLog ${APACHE_LOG_DIR}/error.log!ErrorLog /dev/stderr!g' /etc/apache2/apache2.conf 
APACHE_RUN_USER | RUN sed -i 's!User ${APACHE_RUN_USER}!User www-data!g' /etc/apache2/apache2.conf 
APACHE_RUN_GROUP | RUN sed -i 's!User ${APACHE_RUN_GROUP}!Group www-data!g' /etc/apache2/apache2.conf  
-->

# [Ruby](#tab/ruby)

| Setting name | Description |
|-|-|
| `PORT` | Read-only. Port that the Rails app listens to in the container. |
| `WEBSITE_ROLE_INSTANCE_ID` | Read-only. ID of the current instance. |
| `RAILS_IGNORE_SPLASH` | By default, a default splash page is displayed when no Gemfile is found. Set this variable to any value to disable the splash page. |
| `BUNDLE_WITHOUT` | To add `--without` options to `bundle install`, set the variable to the groups that you want to exclude, separated by a space. By default, all gems are installed.<br/><br/>Example: `test development` |
| `BUNDLE_INSTALL_LOCATION` | Directory to install gems. The default is `/tmp/bundle`. |
| `RUBY_SITE_CONFIG_DIR` | Site configuration directory. The default is `/home/site/config`. The container checks for zipped gems in this directory. |
| `SECRET_KEY_BASE` | By default, a random secret key base is generated. To use a custom secret key base, set this variable to the desired key base. |
| `RAILS_ENV` | Rails environment. The default is `production`. |
| `GEM_PRISTINE` | Set this variable to any value to run `gem pristine --all`. |

-----

## WordPress

> [!div class="mx-tdCol5BreakAll"]
> | Application setting | Scope | Value | Maximum | Description |
> |-------------|-------------|-------------|---------------|--------------------|
> | `WEBSITES_ENABLE_APP_SERVICE_STORAGE` | Web app | `true` | Not applicable | When set to `true`, file contents are preserved during restarts. |
> | `WP_MEMORY_LIMIT` | WordPress | `128M` | `512M` | Front-end or general WordPress PHP memory limit (per script). Can't be more than `PHP_MEMORY_LIMIT`. |
> | `WP_MAX_MEMORY_LIMIT` | WordPress | `256M` | `512M` | Admin dashboard PHP memory limit (per script). Generally, the admin dashboard and back-end scripts take lot of memory compared to front-end scripts. Can't be more than `PHP_MEMORY_LIMIT`. |
> | `PHP_MEMORY_LIMIT` | PHP | `512M` | `512M` | Memory limit for general PHP scripts. Can only be decreased. |
> | `FILE_UPLOADS` | PHP | `On` | Not applicable|Enables or disables file uploads. Can be either `On` or `Off`. Note that values are case sensitive. |
> | `UPLOAD_MAX_FILESIZE` | PHP | `50M` | `256M` | Size limit for file upload. Can be increased up to `256M`. |
> | `POST_MAX_SIZE` | PHP | `128M` | `256M` | Can be increased up to `256M`. Generally should be more than `UPLOAD_MAX_FILESIZE`. |
> | `MAX_EXECUTION_TIME` | PHP | `120` | `120` | Can only be decreased. Break down the scripts if it takes more than 120 seconds. Added to avoid bad scripts from slowing the system. |
> | `MAX_INPUT_TIME` | PHP | `120` | `120` | Time limit for parsing input requests. Can only be decreased. |
> | `MAX_INPUT_VARS` | PHP | `10000` | `10000` | Maximum number of variables for input requests. |
> | `DATABASE_HOST` | Database | Not applicable | Not applicable | Database host used to connect to WordPress. |
> | `DATABASE_NAME` | Database | Not applicable | Not applicable | Database name used to connect to WordPress. |
> | `DATABASE_USERNAME` | Database | Not applicable | Not applicable | Database username used to connect to WordPress. |
> | `DATABASE_PASSWORD` |Database | Not applicable | Not applicable | Database password used to connect to the MySQL database. To change the MySQL database password, see [Update admin password](/azure/mysql/single-server/how-to-create-manage-server-portal#update-admin-password). Whenever the MySQL database password is changed, the application settings also need to be updated. |
> | `WORDPRESS_ADMIN_EMAIL` | Deployment only | Not applicable | Not applicable | WordPress admin email. |
> | `WORDPRESS_ADMIN_PASSWORD` | Deployment only | Not applicable | Not applicable | WordPress admin password. This setting is only for deployment purposes. Modifying this value has no effect on the WordPress installation. To change the WordPress admin password, see [Reset your password](https://wordpress.org/support/article/resetting-your-password/#to-change-your-password). |
> | `WORDPRESS_ADMIN_USER` | Deployment only | Not applicable | Not applicable|WordPress admin username. |
> | `WORDPRESS_ADMIN_LOCALE_CODE` | Deployment only | Not applicable | Not applicable | Database username used to connect to WordPress. |

## Domain and DNS

| Setting name | Description |
|-|-|
| `WEBSITE_DNS_SERVER` | IP address of the primary DNS server for outgoing connections (such as to a back-end service). The default DNS server for App Service is Azure DNS, whose IP address is `168.63.129.16`. If your app uses [virtual network integration](./overview-vnet-integration.md) or is in an [App Service environment](environment/intro.md), it inherits the DNS server configuration from the virtual network by default.<br/><br/>Example: `10.0.0.1` |
| `WEBSITE_DNS_ALT_SERVER` | IP address of the fallback DNS server for outgoing connections. See `WEBSITE_DNS_SERVER`. |
| `WEBSITE_ENABLE_DNS_CACHE` | Allows successful DNS resolutions to be cached. By default, expired DNS cache entries are flushed (in addition to the existing cache) every 4.5 minutes. |

<!-- 
DOMAIN_OWNERSHIP_VERIFICATION_IDENTIFIERS
-->

## TLS/SSL

For more information, see [Use a TLS/SSL certificate in your code in Azure App Service](configure-ssl-certificate-in-code.md).

| Setting name| Description |
|-|-|
| `WEBSITE_LOAD_CERTIFICATES` | Comma-separated thumbprint values to the certificate that you want to load in your code. Or use `*` to allow all certificates to be loaded in code. Only [certificates added to your app](configure-ssl-certificate.md) can be loaded. |
| `WEBSITE_PRIVATE_CERTS_PATH` | Read-only. Path in a Windows container to the loaded private certificates. |
| `WEBSITE_PUBLIC_CERTS_PATH` | Read-only. Path in a Windows container to the loaded public certificates. |
| `WEBSITE_INTERMEDIATE_CERTS_PATH` | Read-only. Path in a Windows container to the loaded intermediate certificates. |
| `WEBSITE_ROOT_CERTS_PATH` | Read-only. Path in a Windows container to the loaded root certificates. |

## Deployment slots

For more information on deployment slots, see [Set up staging environments in Azure App Service](deploy-staging-slots.md).

| Setting name | Description |
|-|-|
| `WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS` | By default, the versions for site extensions are specific to each slot. This default prevents unanticipated application behavior due to changing extension versions after a swap. If you want the extension versions to also swap, set to `0` on *all slots*. |
| `WEBSITE_OVERRIDE_PRESERVE_DEFAULT_STICKY_SLOT_SETTINGS` | Designates certain settings as [sticky or not swappable by default](deploy-staging-slots.md#which-settings-are-swapped). Default is `true`. Set this value to `false` or `0` for *all deployment slots* to make them swappable instead. There's no fine-grained control for specific setting types. |
| `WEBSITE_SWAP_WARMUP_PING_PATH` | Path to ping to warm up the target slot in a swap, beginning with a slash. The default is `/`, which pings the root path over HTTP.<br/><br/>Example: `/statuscheck` |
| `WEBSITE_SWAP_WARMUP_PING_STATUSES` | Valid HTTP response codes for the warm-up operation during a swap. If the returned status code isn't in the list, the warm-up and swap operations are stopped. By default, all response codes are valid.<br/><br/>Example: `200,202` |
| `WEBSITE_SLOT_NUMBER_OF_TIMEOUTS_BEFORE_RESTART` | During a slot swap, maximum number of timeouts before a forced restart of the site on a specific VM instance. The default is `3`. |
| `WEBSITE_SLOT_MAX_NUMBER_OF_TIMEOUTS` | During a slot swap, maximum number of timeout requests for a single URL to make before giving up. The default is `5`. |
| `WEBSITE_SKIP_ALL_BINDINGS_IN_APPHOST_CONFIG` | Set to `true` or `1` to skip all bindings in `applicationHost.config`. The default is `false`. If your app triggers a restart because `applicationHost.config` is updated with the swapped host names of the slots, set this variable to `true` to avoid a restart of this kind. If you're running a Windows Communication Foundation app, don't set this variable. |

<!-- 
|`WEBSITE_SWAP_SLOTNAME`||| 
-->

## Custom containers

For more information on custom containers, see [Run a custom container in Azure](quickstart-custom-container.md).

| Setting name| Description |
|-|-|
| `WEBSITES_ENABLE_APP_SERVICE_STORAGE` | For Linux containers, if this app setting isn't specified, the `/home` directory is shared across scaled instances by default. You can set it to `false` to disable sharing.<br/><br/>For Windows containers, set to `true` to enable the `c:\home` directory to be shared across scaled instances. The default is `true` for Windows containers. |
| `WEBSITES_CONTAINER_STOP_TIME_LIMIT` | Amount of time, in seconds, to wait for the container to terminate gracefully. Default is `5`. You can increase to a maximum of `120`. |
| `DOCKER_REGISTRY_SERVER_URL` | URL of the registry server when you're running a custom container in App Service. For security, this variable isn't passed on to the container.<br/><br/>Example: `https://<server-name>.azurecr.io` |
| `DOCKER_REGISTRY_SERVER_USERNAME` | Username to authenticate with the registry server at `DOCKER_REGISTRY_SERVER_URL`. For security, this variable isn't passed on to the container. |
| `DOCKER_REGISTRY_SERVER_PASSWORD` | Password to authenticate with the registry server at `DOCKER_REGISTRY_SERVER_URL`. For security, this variable isn't passed on to the container. |
| `DOCKER_ENABLE_CI` | Set to `true` to enable continuous deployment for custom containers. The default is `false` for custom containers. |
| `WEBSITE_PULL_IMAGE_OVER_VNET` | Connect and pull from a registry inside a virtual network or on-premises. Your app needs to be connected to a virtual network through the virtual network integration feature. This setting is also needed for Azure Container Registry with a private endpoint. |
| `WEBSITES_WEB_CONTAINER_NAME` | In a Docker Compose app, only one of the containers can be internet accessible. Set to the name of the container defined in the configuration file to override the default container selection. By default, the internet-accessible container is the first container to define port 80 or 8080. When no such container is found, the default is the first container defined in the configuration file. |
| `WEBSITES_PORT` | For a custom container, the custom port number on the container for App Service to route requests to. By default, App Service attempts automatic port detection of ports 80 and 8080. This setting isn't injected into the container as an environment variable. |
| `WEBSITE_CPU_CORES_LIMIT` | By default, a Windows container runs with all available cores for your chosen pricing tier. To reduce the number of cores, set a limit to the number of desired cores. For more information, see [Customize the number of compute cores](configure-custom-container.md?pivots=container-windows#customize-the-number-of-compute-cores). |
| `WEBSITE_MEMORY_LIMIT_MB` | By default, all Windows containers deployed in App Service have a memory limit configured, depending on the tier of the App Service plan. Set to the desired memory limit in megabytes. The cumulative total of this setting across apps in the same plan must not exceed the amount that the chosen pricing tier allows. For more information, see [Customize container memory](configure-custom-container.md?pivots=container-windows#customize-container-memory). |

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
| `WEBSITE_DISABLE_OVERLAPPED_RECYCLING` | Overlapped recycling ensures that before the current VM instance of an app is shut down, a new VM instance starts. In some cases, it can cause file locking issues. You can try turning it off by setting to `1`. |
| `WEBSITE_DISABLE_CROSS_STAMP_SCALE` | By default, apps are allowed to scale across stamps if they use Azure Files or a Docker container. Set to `1` or `true` to disable cross-stamp scaling within the app's region. The default is `0`. Custom Docker containers that set `WEBSITES_ENABLE_APP_SERVICE_STORAGE` to `true` or `1` can't scale cross-stamps because their content isn't completely encapsulated in the Docker container. |

## Logging

| Setting name| Description |
|-|-|
| `WEBSITE_HTTPLOGGING_ENABLED` | Read-only. Shows whether the web server logging for native Windows apps is enabled (`1`) or not (`0`). |
| `WEBSITE_HTTPLOGGING_RETENTION_DAYS` | Retention period (in days) of web server logs, if web server logs are enabled for a native Windows or Linux app.<br/><br/>Example: `10` |
| `WEBSITE_HTTPLOGGING_CONTAINER_URL` | SAS URL of the blob storage container to store web server logs for native Windows apps, if web server logs are enabled. If it isn't set, web server logs are stored in the app's file system (default shared storage). |
| `DIAGNOSTICS_AZUREBLOBRETENTIONINDAYS` | Retention period (in days) of application logs for native Windows apps, if application logs are enabled.<br/><br/>Example: `10` |
| `DIAGNOSTICS_AZUREBLOBCONTAINERSASURL` | SAS URL of the blob storage container to store application logs for native Windows apps, if application logs are enabled. |
| `APPSERVICEAPPLOGS_TRACE_LEVEL` | Minimum log level to ship to Log Analytics for the [AppServiceAppLogs](troubleshoot-diagnostic-logs.md#supported-log-types) log type. |
| `DIAGNOSTICS_LASTRESORTFILE` | File name to create, or relative path to the log directory, for logging internal errors for troubleshooting the listener. The default is `logging-errors.txt`. |
| `DIAGNOSTICS_LOGGINGSETTINGSFILE` | Path to the log settings file, relative to `D:\home` or `/home`. The default is `site\diagnostics\settings.json`. |
| `DIAGNOSTICS_TEXTTRACELOGDIRECTORY` | Log folder, relative to the app root (`D:\home\site\wwwroot` or `/home/site/wwwroot`).<br/><br/>Example: `..\..\LogFiles\Application` |
| `DIAGNOSTICS_TEXTTRACEMAXLOGFILESIZEBYTES` | Maximum size of the log file in bytes. The default is `131072` (128 KB). |
| `DIAGNOSTICS_TEXTTRACEMAXLOGFOLDERSIZEBYTES` | Maximum size of the log folder in bytes. The default is `1048576` (1 MB). |
| `DIAGNOSTICS_TEXTTRACEMAXNUMLOGFILES` | Maximum number of log files to keep. The default is `20`. |
| `DIAGNOSTICS_TEXTTRACETURNOFFPERIOD` | Timeout, in milliseconds, to keep application logging enabled. The default is `43200000` (12 hours). |
| `WEBSITE_LOG_BUFFERING` | By default, log buffering is enabled. Set to `0` to disable it. |
| `WEBSITE_ENABLE_PERF_MODE` | For native Windows apps, set to `TRUE` to turn off IIS log entries for successful requests returned within 10 seconds. This is a quick way to do performance benchmarking by removing extended logging. |


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

The following are "fake" environment variables that don't exist if you enumerate them, but they return their value if you look them up individually. The value is dynamic and can change on every lookup.

| Setting name| Description |
|-|-|
| `WEBSITE_COUNTERS_ASPNET` | JSON object that contains ASP.NET performance counters. |
| `WEBSITE_COUNTERS_APP` | JSON object that contains sandbox counters. |
| `WEBSITE_COUNTERS_CLR` | JSON object that contains Common Language Runtime counters. |
| `WEBSITE_COUNTERS_ALL` | JSON object that contains the combination of the other three variables. |

## Caching

| Setting name| Description |
|-|-|
| `WEBSITE_LOCAL_CACHE_OPTION` | Whether local cache is enabled. Available options are: <br/><br/>- `Default`: Inherit the stamp-level global setting.<br/>- `Always`: Enable for the app.<br/>- `OnStorageUnavailability`<br/>- `Disabled`: Disable for the app. |
| `WEBSITE_LOCAL_CACHE_READWRITE_OPTION` | Read/write options of the local cache. Available options are: <br/><br/>- `ReadOnly`: Cache is read-only.<br/>- `WriteButDiscardChanges`: Allow writes to the local cache but discard changes made locally. |
| `WEBSITE_LOCAL_CACHE_SIZEINMB` | Size of the local cache in megabytes. Default is `1000` (1 GB). |
| `WEBSITE_LOCALCACHE_READY` | Read-only flag that indicates if the app is using the local cache. |
| `WEBSITE_DYNAMIC_CACHE` | Due to the network file share's nature to allow access for multiple instances, the dynamic cache improves performance by caching the recently accessed files locally on an instance. The cache is invalidated when file is modified. The cache location is `%SYSTEMDRIVE%\local\DynamicCache`. (The same `%SYSTEMDRIVE%\local` quota is applied.)<br/><br/>To enable full content caching, set to `1`, which includes both file content and directory/file metadata (time stamps, size, directory content). To conserve local disk use, set to `2` to cache only directory/file metadata (time stamps, size, directory content). To turn off caching, set to `0`.<br/><br/>For Windows apps and for [Linux apps created with the WordPress template](quickstart-wordpress.md), the default is `1`. For all other Linux apps, the default is `0`. |
| `WEBSITE_READONLY_APP` | When you use a dynamic cache, you can disable write access to the app root (`D:\home\site\wwwroot` or `/home/site/wwwroot`) by setting this variable to `1`. Except for the `App_Data` directory, no exclusive locks are allowed so that locked files don't block deployments. |

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

The following environment variables are related to [hybrid connections](app-service-hybrid-connections.md) and [virtual network integration](./overview-vnet-integration.md).

| Setting name | Description |
|-|-|
| `WEBSITE_RELAYS` | Read-only. Data needed to configure the hybrid connection, including endpoints and service bus data. |
| `WEBSITE_REWRITE_TABLE` | Read-only. Used at runtime to do the lookups and rewrite connections appropriately. |
| `WEBSITE_VNET_ROUTE_ALL` | By default, if you use [regional virtual network integration](./overview-vnet-integration.md#regional-virtual-network-integration), your app routes only RFC1918 traffic into your virtual network. Set to `1` to route all outbound traffic into your virtual network and be subject to the same network security groups and user-defined routes. The setting lets you access non-RFC1918 endpoints through your virtual network, secure all outbound traffic leaving your app, and force tunnel all outbound traffic to a network appliance of your own choosing. |
| `WEBSITE_PRIVATE_IP` | Read-only. IP address associated with the app that's [integrated with a virtual network](./overview-vnet-integration.md). For regional virtual network integration, the value is an IP from the address range of the delegated subnet. For gateway-required virtual network integration, the value is an IP from the address range of the point-to-site address pool configured on the virtual network gateway.<br/><br/>The app uses this IP to connect to the resources through the virtual network. Also, it can change within the described address range. |
| `WEBSITE_PRIVATE_PORTS` | Read-only. In virtual network integration, shows which ports the app can use to communicate with other nodes. |
| `WEBSITE_CONTENTOVERVNET` | If you're mounting an Azure file share on App Service and the storage account is restricted to a virtual network, enable this setting with a value of `1`. |

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
| `WEBSITE_KEYVAULT_REFERENCES` | Read-only. Contains information (including statuses) for all key vault references that are currently configured in the app. |
| `WEBSITE_SKIP_CONTENTSHARE_VALIDATION` | If you set the shared storage connection of your app (by using `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`) to a key vault reference, the app can't resolve the key vault reference at app creation or update if one of the following conditions is true: <br/><br/>- The app accesses the key vault by using a system-assigned identity.<br/>- The app accesses the key vault by using a user-assigned identity, and the key vault is [locked with a virtual network](/azure/key-vault/general/overview-vnet-service-endpoints).<br/><br/>To avoid errors at create or update time, set this variable to `1`. |
| `WEBSITE_DELAY_CERT_DELETION` | Setting this environment variable to `1` ensures that a certificate that a worker process depends on isn't deleted until it exits. |
<!-- | `WEBSITE_ALLOW_DOUBLE_ESCAPING_URL` | TODO | -->

## CORS

The following environment variables are related to cross-origin resource sharing (CORS) configuration.

| Setting name | Description |
|-|-|
| `WEBSITE_CORS_ALLOWED_ORIGINS` | Read-only. Shows the allowed origins for CORS. |
| `WEBSITE_CORS_SUPPORT_CREDENTIALS` | Read-only. Shows whether setting the `Access-Control-Allow-Credentials` header to `true` is enabled (`True`) or not (`False`). |

## <a name = "authentication--authorization"></a> Authentication and authorization

The following environment variables are related to [App Service authentication](overview-authentication-authorization.md).

| Setting name | Description|
|-|-|
| `WEBSITE_AUTH_DISABLE_IDENTITY_FLOW` | When set to `true`, disables assigning the thread principal identity in ASP.NET-based web applications (including v1 function apps). This capability allows developers to protect access to their site with authentication, but still have it use a separate sign-in mechanism within their app logic. The default is `false`. |
| `WEBSITE_AUTH_HIDE_DEPRECATED_SID` | `true` or `false`. The default value is `false`. This is a setting for the legacy Mobile Apps integration for Azure App Service. Setting the value to `true` resolves an issue where the security ID generated for authenticated users might change if the user changes their profile information.<br/><br/>Changing this value might cause existing Azure Mobile Apps user IDs to change. Most apps don't need to use this setting. |
| `WEBSITE_AUTH_NONCE_DURATION` | A time-span value in the form `hours:minutes:seconds`. The default value is `00:05:00`, or 5 minutes. This setting controls the lifetime of the [cryptographic nonce](https://en.wikipedia.org/wiki/Cryptographic_nonce) generated for all browser-driven sign-ins. If a sign-in fails to finish in the specified time, the sign-in flow is retried automatically.<br/><br/>This application setting is intended for use with the V1 (classic) configuration experience. If you're using the V2 authentication configuration schema, you should instead use the `login.nonce.nonceExpirationInterval` configuration value. |
| `WEBSITE_AUTH_PRESERVE_URL_FRAGMENT` | When set to `true` and users select app links that contain URL fragments, the sign-in process ensures that the URL fragment part of your URL doesn't get lost in the sign-in redirect process. For more information, see [Customize sign-in and sign-out in Azure App Service authentication](configure-authentication-customize-sign-in-out.md#preserve-url-fragments). |
| `WEBSITE_AUTH_USE_LEGACY_CLAIMS` | To maintain backward compatibility across upgrades, the authentication module uses the legacy claims mapping of short to long names in the `/.auth/me` API, so certain mappings are excluded (for example, "roles"). To get the more modern version of the claims mappings, set this variable to `False`. In the "roles" example, it would be mapped to the long claim name `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`. |
| `WEBSITE_AUTH_DISABLE_WWWAUTHENTICATE` | `true` or `false`. The default value is `false`. When it's set to `true`, it removes the [`WWW-Authenticate`](https://developer.mozilla.org/docs/Web/HTTP/Headers/WWW-Authenticate) HTTP response header from module-generated HTTP 401 responses.<br/><br/>This application setting is intended for use with the V1 (classic) configuration experience. If you're using the V2 authentication configuration schema, you should instead use the `identityProviders.azureActiveDirectory.login.disableWwwAuthenticate` configuration value. |
| `WEBSITE_AUTH_STATE_DIRECTORY` | Local file system's directory path where tokens are stored when the file-based token store is enabled. The default value is `%HOME%\Data\.auth`.<br/><br/>This application setting is intended for use with the V1 (classic) configuration experience. If you're using the V2 authentication configuration schema, you should instead use the `login.tokenStore.fileSystem.directory` configuration value. |
| `WEBSITE_AUTH_TOKEN_CONTAINER_SASURL` | Fully qualified blob container URL. Instructs the authentication module to store and load all encrypted tokens to the specified blob storage container instead of using the default local file system. |
| `WEBSITE_AUTH_TOKEN_REFRESH_HOURS` | Any positive decimal number. The default value is `72` (hours). This setting controls the amount of time after a session token expires that the `/.auth/refresh` API can be used to refresh it. Refresh attempts after this period fail, and users are required to sign in again.<br/><br/>This application setting is intended for use with the V1 (classic) configuration experience. If you're using the V2 authentication configuration schema, you should instead use the `login.tokenStore.tokenRefreshExtensionHours` configuration value. |
| `WEBSITE_AUTH_TRACE_LEVEL` | Controls the verbosity of authentication traces written to [application logging](troubleshoot-diagnostic-logs.md#enable-application-logging-windows). Valid values are `Off`, `Error`, `Warning`, `Information`, and `Verbose`. The default value is `Verbose`. |
| `WEBSITE_AUTH_VALIDATE_NONCE`| `true` or `false`. The default value is `true`. This value should never be set to `false` except when you're temporarily debugging [cryptographic nonce](https://en.wikipedia.org/wiki/Cryptographic_nonce) validation failures that occur during interactive logins.<br/><br/>This application setting is intended for use with the V1 (classic) configuration experience. If you're using the V2 authentication configuration schema, you should instead use the `login.nonce.validateNonce` configuration value. |
| `WEBSITE_AUTH_V2_CONFIG_JSON` | Azure App Service automatically populates this environment variable. This variable is used to configure the integrated authentication module. Its value corresponds to the V2 (non-classic) authentication configuration for the current app in Azure Resource Manager. It's not intended to be configured explicitly. |
| `WEBSITE_AUTH_ENABLED` | Read-only. Injected into a Windows or Linux app to indicate whether App Service authentication is enabled. |
| `WEBSITE_AUTH_ENCRYPTION_KEY` | By default, the automatically generated key is used as the encryption key. To override, set to a desired key. We recommend this environment variable if you want to share tokens or sessions across multiple apps. If you specify it, it supersedes the `MACHINEKEY_DecryptionKey` setting. |
| `WEBSITE_AUTH_SIGNING_KEY` | By default, the automatically generated key is used as the signing key. To override, set to a desired key. We recommend this environment variable if you want to share tokens or sessions across multiple apps. If you specify it, it supersedes the `MACHINEKEY_ValidationKey` setting. |

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
|`IDENTITY_ENDPOINT` | Read-only. URL to retrieve the token for the app's [managed identity](overview-managed-identity.md). |
| `MSI_ENDPOINT` | Deprecated. Use `IDENTITY_ENDPOINT`. |
| `IDENTITY_HEADER` | Read-only. Value that must be added to the `X-IDENTITY-HEADER` header when you're making an HTTP GET request to `IDENTITY_ENDPOINT`. The platform rotates the value. |
| `MSI_SECRET` | Deprecated. Use `IDENTITY_HEADER`. |
<!-- | `WEBSITE_AUTHENTICATION_ENDPOINT_ENABLED` | Disabled by default? TODO | -->

## Health check

The following environment variables are related to [health checks](monitor-instances-health-check.md).

| Setting name | Description |
|-|-|
| `WEBSITE_HEALTHCHECK_MAXPINGFAILURES` | Maximum number of failed pings before removing the instance. Set to a value between `2` and `10`. When you're scaling up or out, App Service pings the health check's path to ensure that new instances are ready. For more information, see [Health check](monitor-instances-health-check.md). |
| `WEBSITE_HEALTHCHECK_MAXUNHEALTHYWORKERPERCENT` | To avoid overwhelming healthy instances, no more than half of the instances are excluded. For example, if an App Service plan is scaled to four instances and three are unhealthy, at most two are excluded. The other two instances (one healthy and one unhealthy) continue to receive requests. In the worst-case scenario where all instances are unhealthy, none are excluded.<br/><br/>To override this behavior, set to a value between `1` and `100`. A higher value means more unhealthy instances are removed. The default is `50` (50%). |


## Push notifications

The following environment variables are related to the [push notifications](/previous-versions/azure/app-service-mobile/app-service-mobile-xamarin-forms-get-started-push#configure-hub) feature.

| Setting name | Description |
|-|-|
| `WEBSITE_PUSH_ENABLED` | Read-only. Added when push notifications are enabled. |
| `WEBSITE_PUSH_TAG_WHITELIST` | Read-only. Contains the tags in the notification registration. |
| `WEBSITE_PUSH_TAGS_REQUIRING_AUTH` | Read-only. Contains a list of tags in the notification registration that require user authentication. |
| `WEBSITE_PUSH_TAGS_DYNAMIC` | Read-only. Contains a list of tags in the notification registration that were added automatically. |

> [!NOTE]
> The preceding table refers to *whitelist*, a term that Microsoft no longer uses. When the term is removed from the software, we remove it from this article.

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

## WebJobs

The following environment variables are related to [WebJobs](webjobs-create.md).

| Setting name| Description |
|-|-|
| `WEBJOBS_RESTART_TIME` | For continuous jobs, delay in seconds when a job's process goes down for any reason before it's restarted. |
| `WEBJOBS_IDLE_TIMEOUT` | For triggered jobs, timeout in seconds. After this timeout, the job is stopped if it's idle, has no CPU time, or has no output. |
| `WEBJOBS_HISTORY_SIZE` | For triggered jobs, maximum number of runs kept in the history directory per job. The default is `50`. |
| `WEBJOBS_STOPPED` | Set to `1` to disable running any job and stop all currently running jobs. |
| `WEBJOBS_DISABLE_SCHEDULE` | Set to `1` to turn off all scheduled triggering. Jobs can still be manually invoked. |
| `WEBJOBS_ROOT_PATH` | Absolute or relative path of WebJob files. For a relative path, the value is combined with the default root path (`D:/home/site/wwwroot/` or `/home/site/wwwroot/`). |
| `WEBJOBS_LOG_TRIGGERED_JOBS_TO_APP_LOGS` | Set to `true` to send output from triggered WebJobs to the pipeline of application logs (which supports file systems, blobs, and tables). |
| `WEBJOBS_SHUTDOWN_FILE` | File that App Service creates when a shutdown request is detected. It's the WebJob process's responsibility to detect the presence of this file and initiate shutdown. When you use the WebJobs SDK, this part is handled automatically. |
| `WEBJOBS_PATH` | Read-only. Root path of currently running job, under a temporary directory. |
| `WEBJOBS_NAME` | Read-only. Current job name. |
| `WEBJOBS_TYPE` | Read-only. Current job type (`triggered` or `continuous`). |
| `WEBJOBS_DATA_PATH` | Read-only. Metadata path to contain the current job's logs, history, and artifacts. |
| `WEBJOBS_RUN_ID` | Read-only. For triggered jobs, current run ID of the job. |

## Functions

| Setting name | Description |
|-|-|
| `WEBSITE_FUNCTIONS_ARMCACHE_ENABLED` | Set to `0` to disable the functions cache. |
| `WEBSITE_MAX_DYNAMIC_APPLICATION_SCALE_OUT` | See [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md). |
|`AzureWebJobsSecretStorageType` | See [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md). |
| `FUNCTIONS_EXTENSION_VERSION` | See [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md). |
| `FUNCTIONS_WORKER_RUNTIME` | See [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md). |
| `AzureWebJobsStorage` | See [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md). |
| `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` | See [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md). |
| `WEBSITE_CONTENTSHARE` | See [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md). |
| `WEBSITE_CONTENTOVERVNET` | See [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md). |
| `WEBSITE_ENABLE_BROTLI_ENCODING` | See [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md). |
| `WEBSITE_USE_PLACEHOLDER` | See [App settings reference for Azure Functions](../azure-functions/functions-app-settings.md). |
| `WEBSITE_PLACEHOLDER_MODE` | Read-only. Shows whether the function app is running on a placeholder host (`generalized`) or its own host (`specialized`). |
| `WEBSITE_DISABLE_ZIP_CACHE` | When your app runs from a [ZIP package](deploy-run-package.md) ( `WEBSITE_RUN_FROM_PACKAGE=1`), the five most recently deployed ZIP packages are cached in the app's file system (`D:\home\data\SitePackages`). Set this variable to `1` to disable this cache. For Linux consumption apps, the ZIP package cache is disabled by default. |
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
