---
title: App settings reference for Azure Functions
description: Reference documentation for the Azure Functions app settings or environment variables.
ms.topic: conceptual
ms.date: 10/04/2022
---

# App settings reference for Azure Functions

App settings in a function app contain configuration options that affect all functions for that function app. When you run locally, these settings are accessed as local [environment variables](functions-develop-local.md#local-settings-file). This article lists the app settings that are available in function apps.

[!INCLUDE [Function app settings](../../includes/functions-app-settings.md)]

There are other function app configuration options in the [host.json](functions-host-json.md) file and in the [local.settings.json](functions-develop-local.md#local-settings-file) file.
Example connection string values are truncated for readability.

> [!NOTE]
> You can use application settings to override host.json setting values without having to change the host.json file itself. This is helpful for scenarios where you need to configure or modify specific host.json settings for a specific environment. This also lets you change host.json settings without having to republish your project. To learn more, see the [host.json reference article](functions-host-json.md#override-hostjson-values). Changes to function app settings require your function app to be restarted.

> [!IMPORTANT]
> Do not use an [instrumentation key](../azure-monitor/app/separate-resources.md#about-resources-and-instrumentation-keys) and a [connection string](../azure-monitor/app/sdk-connection-string.md#overview) simultaneously. Whichever was set last will take precedence.

## APPINSIGHTS_INSTRUMENTATIONKEY

The instrumentation key for Application Insights. Only use one of `APPINSIGHTS_INSTRUMENTATIONKEY` or `APPLICATIONINSIGHTS_CONNECTION_STRING`. When Application Insights runs in a sovereign cloud, use `APPLICATIONINSIGHTS_CONNECTION_STRING`. For more information, see [How to configure monitoring for Azure Functions](configure-monitoring.md).

|Key|Sample value|
|---|------------|
|APPINSIGHTS_INSTRUMENTATIONKEY|`55555555-af77-484b-9032-64f83bb83bb`|

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../includes/azure-monitor-instrumentation-key-deprecation.md)]

## APPLICATIONINSIGHTS_CONNECTION_STRING

The connection string for Application Insights. Use `APPLICATIONINSIGHTS_CONNECTION_STRING` instead of `APPINSIGHTS_INSTRUMENTATIONKEY` in the following cases:

+ When your function app requires the added customizations supported by using the connection string.
+ When your Application Insights instance runs in a sovereign cloud, which requires a custom endpoint.

For more information, see [Connection strings](../azure-monitor/app/sdk-connection-string.md).

|Key|Sample value|
|---|------------|
|APPLICATIONINSIGHTS_CONNECTION_STRING|`InstrumentationKey=...`|

## AZURE_FUNCTION_PROXY_DISABLE_LOCAL_CALL

By default, [Functions proxies](functions-proxies.md) use a shortcut to send API calls from proxies directly to functions in the same function app. This shortcut is used instead of creating a new HTTP request. This setting allows you to disable that shortcut behavior.

|Key|Value|Description|
|-|-|-|
|AZURE_FUNCTION_PROXY_DISABLE_LOCAL_CALL|`true`|Calls with a backend URL pointing to a function in the local function app won't be sent directly to the function. Instead, the requests are directed back to the HTTP frontend for the function app.|
|AZURE_FUNCTION_PROXY_DISABLE_LOCAL_CALL|`false`|Calls with a backend URL pointing to a function in the local function app are forwarded directly to the function. This is the default value. |

## AZURE_FUNCTION_PROXY_BACKEND_URL_DECODE_SLASHES

This setting controls whether the characters `%2F` are decoded as slashes in route parameters when they are inserted into the backend URL.

|Key|Value|Description|
|-|-|-|
|AZURE_FUNCTION_PROXY_BACKEND_URL_DECODE_SLASHES|`true`|Route parameters with encoded slashes are decoded. |
|AZURE_FUNCTION_PROXY_BACKEND_URL_DECODE_SLASHES|`false`|All route parameters are passed along unchanged, which is the default behavior. |

For example, consider the proxies.json file for a function app at the `myfunction.com` domain.

```JSON
{
    "$schema": "http://json.schemastore.org/proxies",
    "proxies": {
        "root": {
            "matchCondition": {
                "route": "/{*all}"
            },
            "backendUri": "example.com/{all}"
        }
    }
}
```

When `AZURE_FUNCTION_PROXY_BACKEND_URL_DECODE_SLASHES` is set to `true`, the URL `example.com/api%2ftest` resolves to `example.com/api/test`. By default, the URL remains unchanged as `example.com/test%2fapi`. For more information, see [Functions proxies](functions-proxies.md).

## AZURE_FUNCTIONS_ENVIRONMENT

In version 2.x and later versions of the Functions runtime, configures app behavior based on the runtime environment. This value is read during initialization, and can be set to any value. Only the values of `Development`, `Staging`, and `Production` are honored by the runtime. When this application setting isn't present when running in Azure, the environment is assumed to be `Production`. Use this setting instead of `ASPNETCORE_ENVIRONMENT` if you need to change the runtime environment in Azure to something other than `Production`. The Azure Functions Core Tools set `AZURE_FUNCTIONS_ENVIRONMENT` to `Development` when running on a local computer, and this can't be overridden in the local.settings.json file. To learn more, see [Environment-based Startup class and methods](/aspnet/core/fundamentals/environments#environment-based-startup-class-and-methods).

## AzureFunctionsJobHost__\*

In version 2.x and later versions of the Functions runtime, application settings can override [host.json](functions-host-json.md) settings in the current environment. These overrides are expressed as application settings named `AzureFunctionsJobHost__path__to__setting`. For more information, see [Override host.json values](functions-host-json.md#override-hostjson-values).

## AzureFunctionsWebHost__hostid

Sets the host ID for a given function app, which should be a unique ID. This setting overrides the automatically generated host ID value for your app. Use this setting only when you need to prevent host ID collisions between function apps that share the same storage account. 

A host ID must be between 1 and 32 characters, contain only lowercase letters, numbers, and dashes, not start or end with a dash, and not contain consecutive dashes. An easy way to generate an ID is to take a GUID, remove the dashes, and make it lower case, such as by converting the GUID `1835D7B5-5C98-4790-815D-072CC94C6F71` to the value `1835d7b55c984790815d072cc94c6f71`.

|Key|Sample value|
|---|------------|
|AzureFunctionsWebHost__hostid|`myuniquefunctionappname123456789`|

For more information, see [Host ID considerations](storage-considerations.md#host-id-considerations).

## AzureWebJobsDashboard

Optional storage account connection string for storing logs and displaying them in the **Monitor** tab in the portal. This setting is only valid for apps that target version 1.x of the Azure Functions runtime. The storage account must be a general-purpose one that supports blobs, queues, and tables. To learn more, see [Storage account requirements](storage-considerations.md#storage-account-requirements).

|Key|Sample value|
|---|------------|
|AzureWebJobsDashboard|`DefaultEndpointsProtocol=https;AccountName=...`|

> [!NOTE]
> For better performance and experience, runtime version 2.x and later versions use APPINSIGHTS_INSTRUMENTATIONKEY and App Insights for monitoring instead of `AzureWebJobsDashboard`.

## AzureWebJobsDisableHomepage

`true` means disable the default landing page that is shown for the root URL of a function app. Default is `false`.

|Key|Sample value|
|---|------------|
|AzureWebJobsDisableHomepage|`true`|

When this app setting is omitted or set to `false`, a page similar to the following example is displayed in response to the URL `<functionappname>.azurewebsites.net`.

![Function app landing page](media/functions-app-settings/function-app-landing-page.png)

## AzureWebJobsDotNetReleaseCompilation

`true` means use Release mode when compiling .NET code; `false` means use Debug mode. Default is `true`.

|Key|Sample value|
|---|------------|
|AzureWebJobsDotNetReleaseCompilation|`true`|

## AzureWebJobsFeatureFlags

A comma-delimited list of beta features to enable. Beta features enabled by these flags are not production ready, but can be enabled for experimental use before they go live.

|Key|Sample value|
|---|------------|
|AzureWebJobsFeatureFlags|`feature1,feature2`|

## AzureWebJobsKubernetesSecretName 

Indicates the Kubernetes Secrets resource used for storing keys. Supported only when running in Kubernetes. Requires that `AzureWebJobsSecretStorageType` be set to `kubernetes`. When `AzureWebJobsKubernetesSecretName` isn't set, the repository is considered read-only. In this case, the values must be generated before deployment. The [Azure Functions Core Tools](functions-run-local.md) generates the values automatically when deploying to Kubernetes.

|Key|Sample value|
|---|------------|
|AzureWebJobsKubernetesSecretName|`<SECRETS_RESOURCE>`|

To learn more, see [Secret repositories](security-concepts.md#secret-repositories).

## AzureWebJobsSecretStorageKeyVaultClientId

The client ID of the user-assigned managed identity or the app registration used to access the vault where keys are stored. Requires that `AzureWebJobsSecretStorageType` be set to `keyvault`.  Supported in version 4.x and later versions of the Functions runtime.

|Key|Sample value|
|---|------------|
|AzureWebJobsSecretStorageKeyVaultClientId|`<CLIENT_ID>`|

To learn more, see [Secret repositories](security-concepts.md#secret-repositories).

## AzureWebJobsSecretStorageKeyVaultClientSecret

The secret for client ID of the user-assigned managed identity or the app registration used to access the vault where keys are stored. Requires that `AzureWebJobsSecretStorageType` be set to `keyvault`.  Supported in version 4.x and later versions of the Functions runtime.

|Key|Sample value|
|---|------------|
|AzureWebJobsSecretStorageKeyVaultClientSecret|`<CLIENT_SECRET>`|

To learn more, see [Secret repositories](security-concepts.md#secret-repositories).

## AzureWebJobsSecretStorageKeyVaultName

The name of a key vault instance used to store keys. This setting is only supported for version 3.x of the Functions runtime. For version 4.x, instead use `AzureWebJobsSecretStorageKeyVaultUri`. Requires that `AzureWebJobsSecretStorageType` be set to `keyvault`. 

The vault must have an access policy corresponding to the system-assigned managed identity of the hosting resource. The access policy should grant the identity the following secret permissions: `Get`,`Set`, `List`, and `Delete`. <br/>When running locally, the developer identity is used, and settings must be in the [local.settings.json file](functions-develop-local.md#local-settings-file). 

|Key|Sample value|
|---|------------|
|AzureWebJobsSecretStorageKeyVaultName|`<VAULT_NAME>`|

To learn more, see [Secret repositories](security-concepts.md#secret-repositories).

## AzureWebJobsSecretStorageKeyVaultTenantId

The tenant ID of the app registration used to access the vault where keys are stored. Requires that `AzureWebJobsSecretStorageType` be set to `keyvault`. Supported in version 4.x and later versions of the Functions runtime. To learn more, see [Secret repositories](security-concepts.md#secret-repositories).

|Key|Sample value|
|---|------------|
|AzureWebJobsSecretStorageKeyVaultTenantId|`<TENANT_ID>`|

## AzureWebJobsSecretStorageKeyVaultUri

The URI of a key vault instance used to store keys. Supported in version 4.x and later versions of the Functions runtime. This is the recommended setting for using a key vault instance for key storage. Requires that `AzureWebJobsSecretStorageType` be set to `keyvault`.

The `AzureWebJobsSecretStorageKeyVaultUri` value should be the full value of **Vault URI** displayed in the **Key Vault overview** tab, including `https://`.

The vault must have an access policy corresponding to the system-assigned managed identity of the hosting resource. The access policy should grant the identity the following secret permissions: `Get`,`Set`, `List`, and `Delete`. <br/>When running locally, the developer identity is used, and settings must be in the [local.settings.json file](functions-develop-local.md#local-settings-file). 

|Key|Sample value|
|---|------------|
|AzureWebJobsSecretStorageKeyVaultUri|`https://<VAULT_NAME>.vault.azure.net`|

To learn more, see [Use Key Vault references for Azure Functions](../app-service/app-service-key-vault-references.md?toc=/azure/azure-functions/toc.json).

## AzureWebJobsSecretStorageSas

A Blob Storage SAS URL for a second storage account used for key storage. By default, Functions uses the account set in `AzureWebJobsStorage`. When using this secret storage option, make sure that `AzureWebJobsSecretStorageType` isn't explicitly set or is set to `blob`. To learn more, see [Secret repositories](security-concepts.md#secret-repositories).

|Key|Sample value|
|--|--|
|AzureWebJobsSecretStorageSas| `<BLOB_SAS_URL>` | 

## AzureWebJobsSecretStorageType

Specifies the repository or provider to use for key storage. Keys are always encrypted before being stored using a secret unique to your function app.

|Key| Value| Description|
|---|------------|---|
|AzureWebJobsSecretStorageType|`blob`|Keys are stored in a Blob storage container in the account provided by the `AzureWebJobsStorage` setting. This is the default behavior when `AzureWebJobsSecretStorageType` isn't set.<br/>To specify a different storage account, use the `AzureWebJobsSecretStorageSas` setting to indicate the SAS URL of a second storage account. |
|AzureWebJobsSecretStorageType  | `files` | Keys are persisted on the file system. This is the default for Functions v1.x.|
|AzureWebJobsSecretStorageType |`keyvault` | Keys are stored in a key vault instance set by `AzureWebJobsSecretStorageKeyVaultName`. | 
|Kubernetes Secrets  | `kubernetes` | Supported only when running the Functions runtime in Kubernetes. When `AzureWebJobsKubernetesSecretName` isn't set, the repository is considered read-only. In this case, the values must be generated before deployment. The [Azure Functions Core Tools](functions-run-local.md) generates the values automatically when deploying to Kubernetes.|

To learn more, see [Secret repositories](security-concepts.md#secret-repositories).

## AzureWebJobsStorage

The Azure Functions runtime uses this storage account connection string for normal operation. Some uses of this storage account include key management, timer trigger management, and Event Hubs checkpoints. The storage account must be a general-purpose one that supports blobs, queues, and tables. See [Storage account](functions-infrastructure-as-code.md#storage-account) and [Storage account requirements](storage-considerations.md#storage-account-requirements).

|Key|Sample value|
|---|------------|
|AzureWebJobsStorage|`DefaultEndpointsProtocol=https;AccountName=...`|

## AzureWebJobs_TypeScriptPath

Path to the compiler used for TypeScript. Allows you to override the default if you need to.

|Key|Sample value|
|---|------------|
|AzureWebJobs_TypeScriptPath|`%HOME%\typescript`|

## DOCKER_SHM_SIZE

Sets the shared memory size (in bytes) when the Python worker is using shared memory. To learn more, see [Shared memory](functions-reference-python.md#shared-memory).

|Key|Sample value|
|---|------------|
|DOCKER_SHM_SIZE|`268435456`|

The value above sets a shared memory size of ~256 MB. 

Requires that [FUNCTIONS\_WORKER\_SHARED\_MEMORY\_DATA\_TRANSFER\_ENABLED](#functions_worker_shared_memory_data_transfer_enabled) be set to `1`.

## FUNCTION\_APP\_EDIT\_MODE

Dictates whether editing in the Azure portal is enabled. Valid values are "readwrite" and "readonly".

|Key|Sample value|
|---|------------|
|FUNCTION\_APP\_EDIT\_MODE|`readonly`|

## FUNCTIONS\_EXTENSION\_VERSION

The version of the Functions runtime that hosts your function app. A tilde (`~`) with major version means use the latest version of that major version (for example, "~3"). When new versions for the same major version are available, they are automatically installed in the function app. To pin the app to a specific version, use the full version number (for example, "3.0.12345"). Default is "~3". A value of `~1` pins your app to version 1.x of the runtime. For more information, see [Azure Functions runtime versions overview](functions-versions.md). A value of `~4` means that your app runs on version 4.x of the runtime, which supports .NET 6.0.

|Key|Sample value|
|---|------------|
|FUNCTIONS\_EXTENSION\_VERSION|`~4`|

The following major runtime version values are supported:

| Value | Runtime target | Comment |
| ------ | -------- | --- |
| `~4` | 4.x | Recommended |
| `~3` | 3.x | Support ends December 13, 2022 |
| `~2` | 2.x | No longer supported |
| `~1` | 1.x | Supported |

## FUNCTIONS\_V2\_COMPATIBILITY\_MODE

This setting enables your function app to run in a version 2.x compatible mode on the version 3.x runtime. Use this setting only if encountering issues when [upgrading your function app from version 2.x to 3.x of the runtime](functions-versions.md#migrating-from-2x-to-3x).

>[!IMPORTANT]
> This setting is intended only as a short-term workaround while you update your app to run correctly on version 3.x. This setting is supported as long as the [2.x runtime is supported](functions-versions.md). If you encounter issues that prevent your app from running on version 3.x without using this setting, please [report your issue](https://github.com/Azure/azure-functions-host/issues/new?template=Bug_report.md).

Requires that [FUNCTIONS\_EXTENSION\_VERSION](#functions_extension_version) be set to `~3`.

|Key|Sample value|
|---|------------|
|FUNCTIONS\_V2\_COMPATIBILITY\_MODE|`true`|

## FUNCTIONS\_WORKER\_PROCESS\_COUNT

Specifies the maximum number of language worker processes, with a default value of `1`. The maximum value allowed is `10`. Function invocations are evenly distributed among language worker processes. Language worker processes are spawned every 10 seconds until the count set by FUNCTIONS\_WORKER\_PROCESS\_COUNT is reached. Using multiple language worker processes is not the same as [scaling](functions-scale.md). Consider using this setting when your workload has a mix of CPU-bound and I/O-bound invocations. This setting applies to all language runtimes, except for .NET running in process (`dotnet`).

|Key|Sample value|
|---|------------|
|FUNCTIONS\_WORKER\_PROCESS\_COUNT|`2`|

## FUNCTIONS\_WORKER\_RUNTIME

The language worker runtime to load in the function app.  This corresponds to the language being used in your application (for example, `dotnet`). Starting with version 2.x of the Azure Functions runtime, a given function app can only support a single language.

|Key|Sample value|
|---|------------|
|FUNCTIONS\_WORKER\_RUNTIME|`node`|

Valid values:

| Value | Language |
|---|---|
| `dotnet` | [C# (class library)](functions-dotnet-class-library.md)<br/>[C# (script)](functions-reference-csharp.md) |
| `dotnet-isolated` | [C# (isolated process)](dotnet-isolated-process-guide.md) |
| `java` | [Java](functions-reference-java.md) |
| `node` | [JavaScript](functions-reference-node.md)<br/>[TypeScript](functions-reference-node.md#typescript) |
| `powershell` | [PowerShell](functions-reference-powershell.md) |
| `python` | [Python](functions-reference-python.md) |

## FUNCTIONS\_WORKER\_SHARED\_MEMORY\_DATA\_TRANSFER\_ENABLED

This setting enables the Python worker to use shared memory to improve throughput. Enable shared memory when your Python function app is hitting memory bottlenecks. 

|Key|Sample value|
|---|------------|
|FUNCTIONS_WORKER_SHARED_MEMORY_DATA_TRANSFER_ENABLED|`1`|

With this setting enabled, you can use the [DOCKER_SHM_SIZE](#docker_shm_size) setting to set the shared memory size. To learn more, see [Shared memory](functions-reference-python.md#shared-memory).

## MDMaxBackgroundUpgradePeriod

Controls the managed dependencies background update period for PowerShell function apps, with a default value of `7.00:00:00` (weekly).

Each PowerShell worker process initiates checking for module upgrades on the PowerShell Gallery on process start and every `MDMaxBackgroundUpgradePeriod` after that. When a new module version is available in the PowerShell Gallery, it's installed to the file system and made available to PowerShell workers. Decreasing this value lets your function app get newer module versions sooner, but it also increases the app resource usage (network I/O, CPU, storage). Increasing this value decreases the app's resource usage, but it may also delay delivering new module versions to your app.

|Key|Sample value|
|---|------------|
|MDMaxBackgroundUpgradePeriod|`7.00:00:00`|

To learn more, see [Dependency management](functions-reference-powershell.md#dependency-management).

## MDNewSnapshotCheckPeriod

Specifies how often each PowerShell worker checks whether managed dependency upgrades have been installed. The default frequency is `01:00:00` (hourly).

After new module versions are installed to the file system, every PowerShell worker process must be restarted. Restarting PowerShell workers affects your app availability as it can interrupt current function execution. Until all PowerShell worker processes are restarted, function invocations may use either the old or the new module versions. Restarting all PowerShell workers completes within `MDNewSnapshotCheckPeriod`.

Within every `MDNewSnapshotCheckPeriod`, the PowerShell worker checks whether or not managed dependency upgrades have been installed. When upgrades have been installed, a restart is initiated. Increasing this value decreases the frequency of interruptions because of restarts. However, the increase might also increase the time during which function invocations could use either the old or the new module versions, non-deterministically.

|Key|Sample value|
|---|------------|
|MDNewSnapshotCheckPeriod|`01:00:00`|

To learn more, see [Dependency management](functions-reference-powershell.md#dependency-management).


## MDMinBackgroundUpgradePeriod

The period of time after a previous managed dependency upgrade check before another upgrade check is started, with a default of  `1.00:00:00` (daily).

To avoid excessive module upgrades on frequent Worker restarts, checking for module upgrades isn't performed when any worker has already initiated that check in the last `MDMinBackgroundUpgradePeriod`.

|Key|Sample value|
|---|------------|
|MDMinBackgroundUpgradePeriod|`1.00:00:00`|

To learn more, see [Dependency management](functions-reference-powershell.md#dependency-management).

## PIP\_INDEX\_URL

This setting lets you override the base URL of the Python Package Index, which by default is `https://pypi.org/simple`. Use this setting when you need to run a remote build using custom dependencies that are found in a package index repository compliant with PEP 503 (the simple repository API) or in a local directory that follows the same format.

|Key|Sample value|
|---|------------|
|PIP\_INDEX\_URL|`http://my.custom.package.repo/simple` |

To learn more, see [`pip` documentation for `--index-url`](https://pip.pypa.io/en/stable/cli/pip_wheel/?highlight=index%20url#cmdoption-i) and using [Custom dependencies](functions-reference-python.md#remote-build-with-extra-index-url) in the Python developer reference.

## PIP\_EXTRA\_INDEX\_URL

The value for this setting indicates an extra index URL for custom packages for Python apps, to use in addition to the `--index-url`. Use this setting when you need to run a remote build using custom dependencies that are found in an extra package index. Should follow the same rules as --index-url.

|Key|Sample value|
|---|------------|
|PIP\_EXTRA\_INDEX\_URL|`http://my.custom.package.repo/simple` |

To learn more, see [`pip` documentation for `--extra-index-url`](https://pip.pypa.io/en/stable/cli/pip_wheel/?highlight=index%20url#cmdoption-extra-index-url) and [Custom dependencies](functions-reference-python.md#remote-build-with-extra-index-url) in the Python developer reference.

## PYTHON\_ISOLATE\_WORKER\_DEPENDENCIES (Preview)

The configuration is specific to Python function apps. It defines the prioritization of module loading order. When your Python function apps face issues related to module collision (e.g. when you're using protobuf, tensorflow, or grpcio in your project), configuring this app setting to `1` should resolve your issue. By default, this value is set to `0`. This flag is currently in Preview.

|Key|Value|Description|
|---|-----|-----------|
|PYTHON\_ISOLATE\_WORKER\_DEPENDENCIES|`0`| Prioritize loading the Python libraries from internal Python worker's dependencies. Third-party libraries defined in requirements.txt may be shadowed. |
|PYTHON\_ISOLATE\_WORKER\_DEPENDENCIES|`1`| Prioritize loading the Python libraries from application's package defined in requirements.txt. This prevents your libraries from colliding with internal Python worker's libraries. |

## PYTHON_ENABLE_DEBUG_LOGGING
Enables debug-level logging in a Python function app. A value of `1` enables debug-level logging. Without this setting or with a value of `0`, only information and higher level logs are sent from the Python worker to the Functions host. Use this setting when debugging or tracing your Python function executions.

When debugging Python functions, make sure to also set a debug or trace [logging level](functions-host-json.md#logging) in the host.json file, as needed. To learn more, see [How to configure monitoring for Azure Functions](configure-monitoring.md).


## PYTHON\_ENABLE\_WORKER\_EXTENSIONS

The configuration is specific to Python function apps. Setting this to `1` allows the worker to load in [Python worker extensions](functions-reference-python.md#python-worker-extensions) defined in requirements.txt. It enables your function app to access new features provided by third-party packages. It may also change the behavior of function load and invocation in your app. Please ensure the extension you choose is trustworthy as you bear the risk of using it. Azure Functions gives no express warranties to any extensions. For how to use an extension, please visit the extension's manual page or readme doc. By default, this value sets to `0`.

|Key|Value|Description|
|---|-----|-----------|
|PYTHON\_ENABLE\_WORKER\_EXTENSIONS|`0`| Disable any Python worker extension. |
|PYTHON\_ENABLE\_WORKER\_EXTENSIONS|`1`| Allow Python worker to load extensions from requirements.txt. |

## PYTHON\_THREADPOOL\_THREAD\_COUNT

Specifies the maximum number of threads that a Python language worker would use to execute function invocations, with a default value of `1` for Python version `3.8` and below. For Python version `3.9` and above, the value is set to `None`. Note that this setting does not guarantee the number of threads that would be set during executions. The setting allows Python to expand the number of threads to the specified value. The setting only applies to Python functions apps. Additionally, the setting applies to synchronous functions invocation and not for coroutines.

|Key|Sample value|Max value|
|---|------------|---------|
|PYTHON\_THREADPOOL\_THREAD\_COUNT|2|32|

## SCALE\_CONTROLLER\_LOGGING\_ENABLED

_This setting is currently in preview._

This setting controls logging from the Azure Functions scale controller. For more information, see [Scale controller logs](functions-monitoring.md#scale-controller-logs).

|Key|Sample value|
|-|-|
|SCALE_CONTROLLER_LOGGING_ENABLED|`AppInsights:Verbose`|

The value for this key is supplied in the format `<DESTINATION>:<VERBOSITY>`, which is defined as follows:

[!INCLUDE [functions-scale-controller-logging](../../includes/functions-scale-controller-logging.md)]

## SCM\_LOGSTREAM\_TIMEOUT

Controls the timeout, in seconds, when connected to streaming logs. The default value is 7200 (2 hours). 

|Key|Sample value|
|-|-|
|SCM_LOGSTREAM_TIMEOUT|`1800`|

The above sample value of `1800` sets a timeout of 30 minutes. To learn more, see [Enable streaming logs](functions-run-local.md#enable-streaming-logs).

## WEBSITE\_CONTENTAZUREFILECONNECTIONSTRING

Connection string for storage account where the function app code and configuration are stored in event-driven scaling plans. For more information, see [Create a function app](functions-infrastructure-as-code.md?tabs=windows#create-a-function-app).

|Key|Sample value|
|---|------------|
|WEBSITE_CONTENTAZUREFILECONNECTIONSTRING|`DefaultEndpointsProtocol=https;AccountName=...`|

This setting is required for Consumption and Premium plan apps on both Windows and Linux. It's not required for Dedicated plan apps, which aren't dynamically scaled by Functions. 

Changing or removing this setting may cause your function app to not start. To learn more, see [this troubleshooting article](functions-recover-storage-account.md#storage-account-application-settings-were-deleted).

## WEBSITE\_CONTENTOVERVNET

A value of `1` enables your function app to scale when you have your storage account restricted to a virtual network. You should enable this setting when restricting your storage account to a virtual network. To learn more, see [Restrict your storage account to a virtual network](configure-networking-how-to.md#restrict-your-storage-account-to-a-virtual-network).

|Key|Sample value|
|---|------------|
|WEBSITE_CONTENTOVERVNET|`1`|

Supported on [Premium](functions-premium-plan.md) and [Dedicated (App Service) plans](dedicated-plan.md) (Standard and higher). Not supported when running on a [Consumption plan](consumption-plan.md). 

## WEBSITE\_CONTENTSHARE

The file path to the function app code and configuration in an event-driven scaling plans. Used with WEBSITE_CONTENTAZUREFILECONNECTIONSTRING. Default is a unique string generated by the runtime that begins with the function app name. See [Create a function app](functions-infrastructure-as-code.md?tabs=windows#create-a-function-app).

|Key|Sample value|
|---|------------|
|WEBSITE_CONTENTSHARE|`functionapp091999e2`|

This setting is required for Consumption and Premium plan apps on both Windows and Linux. It's not required for Dedicated plan apps, which aren't dynamically scaled by Functions. 

Changing or removing this setting may cause your function app to not start. To learn more, see [this troubleshooting article](functions-recover-storage-account.md#storage-account-application-settings-were-deleted).

The following considerations apply when using an Azure Resource Manager (ARM) template to create a function app during deployment: 

+ When you don't set a `WEBSITE_CONTENTSHARE` value for the main function app or any apps in slots, unique share values are generated for you. This is the recommended approach for an ARM template deployment.
+ There are scenarios where you must set the `WEBSITE_CONTENTSHARE` value to a predefined share, such as when you [use a secured storage account in a virtual network](configure-networking-how-to.md#restrict-your-storage-account-to-a-virtual-network). In this case, you must set a unique share name for the main function app and the app for each deployment slot.  
+ Don't make `WEBSITE_CONTENTSHARE` a slot setting. 
+ When you specify `WEBSITE_CONTENTSHARE`, the value must follow [this guidance for share names](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata#share-names). 

To learn more, see [Automate resource deployment for your function app](functions-infrastructure-as-code.md?tabs=windows#create-a-function-app).

## WEBSITE\_DNS\_SERVER

Sets the DNS server used by an app when resolving IP addresses. This setting is often required when using certain networking functionality, such as [Azure DNS private zones](functions-networking-options.md#azure-dns-private-zones) and [private endpoints](functions-networking-options.md#restrict-your-storage-account-to-a-virtual-network).

|Key|Sample value|
|---|------------|
|WEBSITE\_DNS\_SERVER|`168.63.129.16`|

## WEBSITE\_ENABLE\_BROTLI\_ENCODING

Controls whether Brotli encoding is used for compression instead of the default gzip compression. When `WEBSITE_ENABLE_BROTLI_ENCODING` is set to `1`, Brotli encoding is used; otherwise gzip encoding is used.

## WEBSITE\_MAX\_DYNAMIC\_APPLICATION\_SCALE\_OUT

The maximum number of instances that the app can scale out to. Default is no limit.

> [!IMPORTANT]
> This setting is in preview.  An [app property for function max scale out](./event-driven-scaling.md#limit-scale-out) has been added and is the recommended way to limit scale out.

|Key|Sample value|
|---|------------|
|WEBSITE\_MAX\_DYNAMIC\_APPLICATION\_SCALE\_OUT|`5`|

## WEBSITE\_NODE\_DEFAULT_VERSION

_Windows only._
Sets the version of Node.js to use when running your function app on Windows. You should use a tilde (~) to have the runtime use the latest available version of the targeted major version. For example, when set to `~10`, the latest version of Node.js 10 is used. When a major version is targeted with a tilde, you don't have to manually update the minor version.

|Key|Sample value|
|---|------------|
|WEBSITE\_NODE\_DEFAULT_VERSION|`~10`|

## WEBSITE\_OVERRIDE\_STICKY\_EXTENSION\_VERSIONS

By default, the version settings for function apps are specific to each slot. This setting is used when upgrading functions by using [deployment slots](functions-deployment-slots.md). This prevents unanticipated behavior due to changing versions after a swap. Set to `0` in production and in the slot to make sure that all version settings are also swapped. For more information, see [Migrate using slots](functions-versions.md#migrate-using-slots). 

|Key|Sample value|
|---|------------|
|WEBSITE\_OVERRIDE\_STICKY\_EXTENSION\_VERSIONS|`0`|

## WEBSITE\_RUN\_FROM\_PACKAGE

Enables your function app to run from a mounted package file.

|Key|Sample value|
|---|------------|
|WEBSITE\_RUN\_FROM\_PACKAGE|`1`|

Valid values are either a URL that resolves to the location of a deployment package file, or `1`. When set to `1`, the package must be in the `d:\home\data\SitePackages` folder. When using zip deployment with this setting, the package is automatically uploaded to this location. In preview, this setting was named `WEBSITE_RUN_FROM_ZIP`. For more information, see [Run your functions from a package file](run-functions-from-deployment-package.md).

## WEBSITE\_SKIP\_CONTENTSHARE\_VALIDATION

The [WEBSITE_CONTENTAZUREFILECONNECTIONSTRING](#website_contentazurefileconnectionstring) and [WEBSITE_CONTENTSHARE](#website_contentshare) settings have additional validation checks to ensure that the app can be properly started. Creation of application settings will fail if the Function App cannot properly call out to the downstream Storage Account or Key Vault due to networking constraints or other limiting factors. When WEBSITE_SKIP_CONTENTSHARE_VALIDATION is set to `1`, the validation check is skipped; otherwise the value defaults to `0` and the validation will take place. 

|Key|Sample value|
|---|------------|
|WEBSITE_SKIP_CONTENTSHARE_VALIDATION|`1`|

If validation is skipped and either the connection string or content share are not valid, the app will be unable to start properly and will only serve HTTP 500 errors.

## WEBSITE\_TIME\_ZONE

Allows you to set the timezone for your function app.

|Key|OS|Sample value|
|---|--|------------|
|WEBSITE\_TIME\_ZONE|Windows|`Eastern Standard Time`|
|WEBSITE\_TIME\_ZONE|Linux|`America/New_York`|

[!INCLUDE [functions-timezone](../../includes/functions-timezone.md)]

## WEBSITE\_VNET\_ROUTE\_ALL

> [!IMPORTANT]
> WEBSITE_VNET_ROUTE_ALL is a legacy app setting that has been replaced by the [vnetRouteAllEnabled configuration setting](../app-service/configure-vnet-integration-routing.md).

Indicates whether all outbound traffic from the app is routed through the virtual network. A setting value of `1` indicates that all traffic is routed through the virtual network. You need this setting when using features of [Regional virtual network integration](functions-networking-options.md#regional-virtual-network-integration). It's also used when a [virtual network NAT gateway is used to define a static outbound IP address](functions-how-to-use-nat-gateway.md).

|Key|Sample value|
|---|------------|
|WEBSITE\_VNET\_ROUTE\_ALL|`1`|

## App Service site settings

Some configurations must be maintained at the App Service level as site settings, such as language versions. These settings are usually set in the portal, by using REST APIs, or by using Azure CLI or Azure PowerShell. The following are site settings that could be required, depending on your runtime language, OS, and versions: 

### linuxFxVersion 

For function apps running on Linux, `linuxFxVersion` indicates the language and version for the language-specific worker process. This information is used, along with [`FUNCTIONS_EXTENSION_VERSION`](#functions_extension_version), to determine which specific Linux container image is installed to run your function app. This setting can be set to a pre-defined value or a custom image URI.

This value is set for you when you create your Linux function app. You may need to set it for ARM template and Bicep deployments and in certain upgrade scenarios. 

#### Valid linuxFxVersion values

You can use the following Azure CLI command to see a table of current `linuxFxVersion` values, by supported Functions runtime version:

```azurecli-interactive
az functionapp list-runtimes --os linux --query "[].{stack:join(' ', [runtime, version]), LinuxFxVersion:linux_fx_version, SupportedFunctionsVersions:to_string(supported_functions_versions[])}" --output table
```

The previous command requires you to upgrade to version 2.40 of the Azure CLI.  

#### Custom images

When you create and maintain your own custom linux container for your function app, the `linuxFxVersion` value is also in the format `DOCKER|<IMAGE_URI>`, as in the following example:

```
linuxFxVersion = "DOCKER|contoso.com/azurefunctionsimage:v1.0.0"
```
For more information, see [Create a function on Linux using a custom container](functions-create-function-linux-custom-image.md).

[!INCLUDE [functions-linux-custom-container-note](../../includes/functions-linux-custom-container-note.md)]

### netFrameworkVersion

Sets the specific version of .NET for C# functions. For more information, see [Migrating from 3.x to 4.x](functions-versions.md#migrating-from-3x-to-4x). 

### powerShellVersion 

Sets the specific version of PowerShell on which your functions run. For more information, see [Changing the PowerShell version](functions-reference-powershell.md#changing-the-powershell-version). 

When running locally, you instead use the [`FUNCTIONS_WORKER_RUNTIME_VERSION`](functions-reference-powershell.md#running-local-on-a-specific-version) setting in the local.settings.json file. 

## Next steps

[Learn how to update app settings](functions-how-to-use-azure-function-app-settings.md#settings)

[See configuration settings in the host.json file](functions-host-json.md)

[See other app settings for App Service apps](https://github.com/projectkudu/kudu/wiki/Configurable-settings)
