---
title: AzCopy v10 configuration setting (Azure Storage)
description: This article provides reference information for AzCopy V10 configuration settings.
author: normesta
ms.service: azure-storage
ms.topic: reference
ms.date: 02/28/2023
ms.author: normesta
ms.subservice: storage-common-concepts
ms.reviewer: zezha-msft
---

# AzCopy v10 configuration settings (Azure Storage)

AzCopy is a command-line utility that you can use to copy blobs or files to or from a storage account. This article contains a list of environment variables that you can use to configure AzCopy v10.

> [!NOTE]
> If you're looking for content to help you get started with AzCopy, see [Get started with AzCopy](storage-use-azcopy-v10.md).

## AzCopy v10 environment variables

The following table describes each environment variable and provides links to content that can help you use the variable.

| Environment variable | Description |
|--|--|
| AWS_ACCESS_KEY_ID | Amazon Web Services access key. Provides a key to authorize with Amazon Web Services.[Copy data from Amazon S3 to Azure Storage by using AzCopy](storage-use-azcopy-s3.md) |
| AWS_SECRET_ACCESS_KEY | Amazon Web Services secret access key Provides a secret key to authorize with Amazon Web Services. [Copy data from Amazon S3 to Azure Storage by using AzCopy](storage-use-azcopy-s3.md) |
| AZCOPY_ACTIVE_DIRECTORY_ENDPOINT | The Azure Active Directory endpoint to use. This variable is only used for auto login, please use the command line flag instead when invoking the login command. |
| AZCOPY_AUTO_LOGIN_TYPE | Set this variable to `DEVICE`, `MSI`, or `SPN`. This variable provides the ability to authorize without using the `azcopy login` command. This mechanism is useful in cases where your operating system doesn't have a secret store such as a Linux *keyring*. See [Authorize without a secret store](storage-use-azcopy-authorize-azure-active-directory.md#authorize-without-a-secret-store). |
| AZCOPY_BUFFER_GB | Specify the maximum amount of your system memory you want AzCopy to use when downloading and uploading files. Express this value in gigabytes (GB). See [Optimize memory use](storage-use-azcopy-optimize.md#optimize-memory-use) |
| AZCOPY_CACHE_PROXY_LOOKUP | By default AzCopy on Windows will cache proxy server lookups at hostname level (not taking URL path into account). Set to any other value than 'true' to disable the cache. |
| AZCOPY_CONCURRENCY_VALUE | Specifies the number of concurrent requests that can occur. You can use this variable to increase throughput. If your computer has fewer than 5 CPUs, then the value of this variable is set to `32`. Otherwise, the default value is equal to 16 multiplied by the number of CPUs. The maximum default value of this variable is `3000`, but you can manually set this value higher or lower. See [Increase concurrency](storage-use-azcopy-optimize.md#increase-concurrency) |
| AZCOPY_CONCURRENT_FILES | Overrides the (approximate) number of files that are in progress at any one time, by controlling how many files we concurrently initiate transfers for. |
| AZCOPY_CONCURRENT_SCAN | Controls the (max) degree of parallelism used during scanning. Only affects parallelized enumerators, which include Azure Files/Blobs, and local file systems. |
| AZCOPY_CONTENT_TYPE_MAP  | Overrides one or more of the default MIME type mappings defined by your operating system. Set this variable to the path of a JSON file that defines any mapping.  Here's the contents of an example JSON file: <br><br> {<br>&nbsp;&nbsp;"MIMETypeMapping": { <br>&nbsp;&nbsp;&nbsp;&nbsp;".323": "text/h323",<br>&nbsp;&nbsp;&nbsp;&nbsp;".aaf": "application/octet-stream",<br>&nbsp;&nbsp;&nbsp; ".aca": "application/octet-stream",<br>&nbsp;&nbsp;&nbsp;&nbsp;".accdb": "application/msaccess"<br>&nbsp;&nbsp;&nbsp;&nbsp;  }<br>}
|
| AZCOPY_DEFAULT_SERVICE_API_VERSION | Overrides the service API version so that AzCopy could accommodate custom environments such as Azure Stack. |
| AZCOPY_DISABLE_HIERARCHICAL_SCAN | Applies only when Azure Blobs is the source. Concurrent scanning is faster but employs the hierarchical listing API, which can result in more IOs/cost. Specify 'true' to sacrifice performance but save on cost. |
| AZCOPY_DISABLE_SYSLOG | Disables logging in Syslog or the Windows Event Logger. By default, AzCopy sends logs to these channels. You can set this variable to true if you want to reduce the noise in Syslog or the Windows Event Log. |
| AZCOPY_DOWNLOAD_TO_TEMP_PATH | Configures AzCopy to download to a temp path before the actual download. Allowed values are true or false|
| AZCOPY_JOB_PLAN_LOCATION | Overrides where the job plan files (used for progress tracking and resuming) are stored, to avoid filling up a disk. |
| AZCOPY_LOG_LOCATION | Overrides where the log files are stored, to avoid filling up a disk. |
| AZCOPY_MSI_CLIENT_ID | The client ID of a user-assigned managed identity. Use when `AZCOPY_AUTO_LOGIN_TYPE` is set to `MSI`. See [Authorize without a secret store](storage-use-azcopy-authorize-azure-active-directory.md#authorize-without-a-secret-store) |
| AZCOPY_MSI_OBJECT_ID | The object ID of the user-assigned managed identity. Use when `AZCOPY_AUTO_LOGIN_TYPE` is set to `MSI`. See [Authorize without a secret store](storage-use-azcopy-authorize-azure-active-directory.md#authorize-without-a-secret-store) |
| AZCOPY_MSI_RESOURCE_STRING | The resource ID of the user-assigned managed identity. See [Authorize without a secret store](storage-use-azcopy-authorize-azure-active-directory.md#authorize-without-a-secret-store) |
| AZCOPY_PACE_PAGE_BLOBS | Should throughput for page blobs automatically be adjusted to match Service limits? Default is true. Set to 'false' to disable |
| AZCOPY_PARALLEL_STAT_FILES | Causes AzCopy to look up file properties on parallel 'threads' when scanning the local file system.  The threads are drawn from the pool defined by AZCOPY_CONCURRENT_SCAN.  Setting this to true may improve scanning performance on Linux.  Not needed or recommended on Windows. |
| AZCOPY_REQUEST_TRY_TIMEOUT | Set the number of minutes that AzCopy should try to upload files for each request before AzCopy times out. |
| AZCOPY_SHOW_PERF_STATES | If set, to anything, on-screen output will include counts of chunks by state |
| AZCOPY_SPA_APPLICATION_ID | The application ID of your service principal's app registration. Use when `AZCOPY_AUTO_LOGIN_TYPE` is set to `SPN`. See [Authorize without a secret store](storage-use-azcopy-authorize-azure-active-directory.md#authorize-without-a-secret-store) |
| AZCOPY_SPA_CERT_PASSWORD | The password of a certificate. Use when `AZCOPY_AUTO_LOGIN_TYPE` is set to `SPN`. See [Authorize without a secret store](storage-use-azcopy-authorize-azure-active-directory.md#authorize-without-a-secret-store) |
| AZCOPY_SPA_CERT_PATH | The relative or fully qualified path to a certificate file. Use when `AZCOPY_AUTO_LOGIN_TYPE` is set to `SPN`. See [Authorize without a secret store](storage-use-azcopy-authorize-azure-active-directory.md#authorize-without-a-secret-store) |
| AZCOPY_SPA_CLIENT_SECRET | The client secret. Use when `AZCOPY_AUTO_LOGIN_TYPE` is set to `SPN`. See [Authorize without a secret store](storage-use-azcopy-authorize-azure-active-directory.md#authorize-without-a-secret-store) |
| AZCOPY_TENANT_ID | The Azure Active Directory tenant ID to use for OAuth device interactive login. This variable is only used for auto login, please use the command line flag instead when invoking the login command. |
| AZCOPY_TUNE_TO_CPU | Set to false to prevent AzCopy from taking CPU usage into account when autotuning its concurrency level (for example, in the benchmark command). |
| AZCOPY_USER_AGENT_PREFIX | Add a prefix to the default AzCopy User Agent, which is used for telemetry purposes. A space is automatically inserted. |
| CPK_ENCRYPTION_KEY | A Base64-encoded AES-256 encryption key value. This variable is required for both read and write requests when using Customer Provided Keys to encrypt and decrypt data on Blob storage operations. You can use Customer Provided Keys by setting the `--cpk-by-value=true` flag. |
| CPK_ENCRYPTION_KEY_SHA256 | The Base64-encoded SHA256 of the encryption key. This variable is required for both read and write requests when using Customer Provided Keys to encrypt and decrypt data on Blob storage operations. You can use Customer Provided Keys by setting the `--cpk-by-value=true` flag.  |
| GOOGLE_APPLICATION_CREDENTIALS | The absolute path to the service account key file Provides a key to authorize with Google Cloud Storage. [Copy data from Google Cloud Storage to Azure Storage by using AzCopy (preview)](storage-ref-azcopy-configuration-settings.md) |
| GOOGLE_CLOUD_PROJECT | Project ID required for service level traversals in Google Cloud Storage. |
| HTTPS_PROXY | Configures proxy settings for AzCopy. Set this variable to the proxy IP address and proxy port number. For example, `xx.xxx.xx.xxx:xx`. If you run AzCopy on Windows, AzCopy automatically detects proxy settings, so you don't have to use this setting in Windows. If you choose to use this setting in Windows, it will override automatic detection. See [Configure proxy settings](#configure-proxy-settings) |

## Configure proxy settings

To configure the proxy settings for AzCopy, set the `HTTPS_PROXY` environment variable. If you run AzCopy on Windows, AzCopy automatically detects proxy settings, so you don't have to use this setting in Windows. If you choose to use this setting in Windows, it will override automatic detection.

| Operating system | Command  |
|--------|-----------|
| **Windows** | In a command prompt use: `set HTTPS_PROXY=<proxy IP>:<proxy port>`<br> In PowerShell use: `$env:HTTPS_PROXY="<proxy IP>:<proxy port>"`|
| **Linux** | `export HTTPS_PROXY=<proxy IP>:<proxy port>` |
| **macOS** | `export HTTPS_PROXY=<proxy IP>:<proxy port>` |

Currently, AzCopy doesn't support proxies that require authentication with NTLM or Kerberos.

### Bypassing a proxy

If you are running AzCopy on Windows, and you want to tell it to use *no* proxy at all (instead of auto-detecting the settings) use these commands. With these settings, AzCopy will not look up or attempt to use any proxy.

| Operating system | Environment | Commands  |
|--------|-----------|----------|
| **Windows** | Command prompt (CMD) | `set HTTPS_PROXY=dummy.invalid` <br>`set NO_PROXY=*`|
| **Windows** | PowerShell | `$env:HTTPS_PROXY="dummy.invalid"` <br>`$env:NO_PROXY="*"`<br>|

On other operating systems, simply leave the HTTPS_PROXY variable unset if you want to use no proxy.

## See also

- [Get started with AzCopy](storage-use-azcopy-v10.md)
- [Optimize the performance of AzCopy v10 with Azure Storage](storage-use-azcopy-optimize.md)
- [Troubleshoot AzCopy V10 issues in Azure Storage by using log files](storage-use-azcopy-configure.md)
