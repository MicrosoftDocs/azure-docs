---
title: AzCopy v10 configuration setting (Azure Storage) | Microsoft Docs
description: This article provides reference information for AzCopy V10 configuration settings.
author: normesta
ms.service: storage
ms.topic: reference
ms.date: 03/23/2021
ms.author: normesta
ms.subservice: common
ms.reviewer: zezha-msft
---

# AzCopy v10 configuration settings (Azure Storage)

AzCopy is a command-line utility that you can use to copy blobs or files to or from a storage account. This article contains a list of environment variables that you can use to configure AzCopy v10.

> [!NOTE]
> If you're looking for content to help you get started with AzCopy, see [Get started with AzCopy](storage-use-azcopy-v10.md).

## AzCopy v10 environment variables

The following table describes each environment variable and provides links to content that can help you use the variable.

|Environment variable|Value|Description|More information|
|----|----|----|---|
|HTTPS_PROXY|The proxy IP address and proxy port number. For example, `xx.xxx.xx.xxx:xx`.|Configures proxy settings for AzCopy. If you run AzCopy on Windows, AzCopy automatically detects proxy settings, so you don't have to use this setting in Windows. If you choose to use this setting in Windows, it will override automatic detection. |[Configure proxy settings](#configure-proxy-settings)|
|AZCOPY_CONCURRENCY_VALUE|A number |Specifies the number of concurrent requests that can occur. You can use this variable to increase throughput. If your computer has fewer than 5 CPUs, then the value of this variable is set to `32`. Otherwise, the default value is equal to 16 multiplied by the number of CPUs. The maximum default value of this variable is `3000`, but you can manually set this value higher or lower. |[Optimize throughput](storage-use-azcopy-optimize.md#optimize-throughput)|
|AZCOPY_BUFFER_GB|A number|Specify the maximum amount of your system memory you want AzCopy to use when downloading and uploading files. Express this value in gigabytes (GB).|[Optimize memory use](storage-use-azcopy-optimize.md#optimize-memory-use)|
|AZCOPY_AUTO_LOGIN_TYPE|`DEVICE`, `MSI`, or `SPN`|Provides the ability to authorize without using the `azcopy login` command. This mechanism is useful in cases where your operating system doesn't have a secret store such as a Linux *keyring*.|[Authorize without a secret store](storage-use-azcopy-authorize-azure-active-directory.md#authorize-without-a-secret-store)|
|AZCOPY_MSI_CLIENT_ID|The client ID of a user-assigned managed identity.|Use when `AZCOPY_AUTO_LOGIN_TYPE` is set to `MSI`.|[Authorize without a secret store](storage-use-azcopy-authorize-azure-active-directory.md#authorize-without-a-secret-store)|
|AZCOPY_MSI_OBJECT_ID|The object ID of the user-assigned managed identity.|Use when `AZCOPY_AUTO_LOGIN_TYPE` is set to `MSI`.|[Authorize without a secret store](storage-use-azcopy-authorize-azure-active-directory.md#authorize-without-a-secret-store)|
|AZCOPY_MSI_RESOURCE_STRING|The resource ID of the user-assigned managed identity.|Use when `AZCOPY_AUTO_LOGIN_TYPE` is set to `MSI`.|[Authorize without a secret store](storage-use-azcopy-authorize-azure-active-directory.md#authorize-without-a-secret-store)|
|AZCOPY_SPA_APPLICATION_ID|The application ID of your service principal's app registration.|Use when `AZCOPY_AUTO_LOGIN_TYPE` is set to `SPN`.|[Authorize without a secret store](storage-use-azcopy-authorize-azure-active-directory.md#authorize-without-a-secret-store)|
|AZCOPY_SPA_CLIENT_SECRET|The client secret.|Use when `AZCOPY_AUTO_LOGIN_TYPE` is set to `SPN`.|[Authorize without a secret store](storage-use-azcopy-authorize-azure-active-directory.md#authorize-without-a-secret-store)|
|AZCOPY_SPA_CERT_PATH|The relative or fully qualified path to a certificate file.|Use when `AZCOPY_AUTO_LOGIN_TYPE` is set to `SPN`.|[Authorize without a secret store](storage-use-azcopy-authorize-azure-active-directory.md#authorize-without-a-secret-store)|
|AZCOPY_SPA_CERT_PASSWORD|The password of a certificate.|Use when `AZCOPY_AUTO_LOGIN_TYPE` is set to `SPN`.|[Authorize without a secret store](storage-use-azcopy-authorize-azure-active-directory.md#authorize-without-a-secret-store)|
|GOOGLE_APPLICATION_CREDENTIALS|The absolute path to the service account key file|Provides a key to authorize with Google Cloud Storage.|[Copy data from Google Cloud Storage to Azure Storage by using AzCopy (preview)](storage-ref-azcopy-configuration-settings.md)|
|AWS_ACCESS_KEY_ID|Amazon Web Services access key|Provides a key to authorize with Amazon Web Services.|[Copy data from Amazon S3 to Azure Storage by using AzCopy](storage-use-azcopy-s3.md)|
|AWS_SECRET_ACCESS_KEY|Amazon Web Services secret access key|Provides a secret key to authorize with Amazon Web Services.|[Copy data from Amazon S3 to Azure Storage by using AzCopy](storage-use-azcopy-s3.md)|

## Configure proxy settings

To configure the proxy settings for AzCopy, set the `HTTPS_PROXY` environment variable. If you run AzCopy on Windows, AzCopy automatically detects proxy settings, so you don't have to use this setting in Windows. If you choose to use this setting in Windows, it will override automatic detection.

| Operating system | Command  |
|--------|-----------|
| **Windows** | In a command prompt use: `set HTTPS_PROXY=<proxy IP>:<proxy port>`<br> In PowerShell use: `$env:HTTPS_PROXY="<proxy IP>:<proxy port>"`|
| **Linux** | `export HTTPS_PROXY=<proxy IP>:<proxy port>` |
| **macOS** | `export HTTPS_PROXY=<proxy IP>:<proxy port>` |

Currently, AzCopy doesn't support proxies that require authentication with NTLM or Kerberos.

### Bypassing a proxy

If you are running AzCopy on Windows, and you want to tell it to use _no_ proxy at all (instead of auto-detecting the settings) use these commands. With these settings, AzCopy will not look up or attempt to use any proxy.

| Operating system | Environment | Commands  |
|--------|-----------|----------|
| **Windows** | Command prompt (CMD) | `set HTTPS_PROXY=dummy.invalid` <br>`set NO_PROXY=*`|
| **Windows** | PowerShell | `$env:HTTPS_PROXY="dummy.invalid"` <br>`$env:NO_PROXY="*"`<br>|

On other operating systems, simply leave the HTTPS_PROXY variable unset if you want to use no proxy.

## See also

- [Get started with AzCopy](storage-use-azcopy-v10.md)
- [Optimize the performance of AzCopy v10 with Azure Storage](storage-use-azcopy-optimize.md)
- [Troubleshoot AzCopy V10 issues in Azure Storage by using log files](storage-use-azcopy-configure.md)
- [AzCopy V10 with Azure Storage FAQ](storage-use-faq.yml)
