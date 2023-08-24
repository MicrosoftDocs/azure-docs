---
title: Network Connections in Azure Storage Explorer
description: Documentation on connecting to your network in Azure Storage Explorer
services: storage
author: MRayermannMSFT
ms.service: azure-storage
ms.topic: article
ms.date: 04/01/2021
ms.author: marayerm
---

# Network connections in Storage Explorer

When not connecting to a local emulator, Storage Explorer uses your network to make requests to your storage resources and other Azure and Microsoft services.

## Hostnames accessed by Storage Explorer

Storage Explorer makes requests to various endpoints while in use. The following list details common hostnames that Storage Explorer makes requests to:

- ARM endpoints:
  - `management.azure.com` (global Azure)
  - `management.chinacloudapi.cn` (Microsoft Azure operated by 21Vianet)
  - `management.microsoftazure.de` (Azure Germany)
  - `management.usgovcloudapi.net` (Azure US Government)
- Login endpoints:
  - `login.microsoftonline.com` (global Azure)
  - `login.chinacloudapi.cn` (Azure operated by 21Vianet)
  - `login.microsoftonline.de` (Azure Germany)
  - `login.microsoftonline.us` (Azure US Government)
- Graph endpoints:
  - `graph.windows.net` (global Azure)
  - `graph.chinacloudapi.cn` (Microsoft Azure operated by 21Vianet)
  - `graph.cloudapi.de` (Azure Germany)
  - `graph.windows.net` (Azure US Government)
- Azure Storage endpoints:
  - `(blob|file|queue|table|dfs).core.windows.net` (global Azure)
  - `(blob|file|queue|table|dfs).core.chinacloudapi.cn` (Microsoft Azure operated by 21Vianet)
  - `(blob|file|queue|table|dfs).core.cloudapi.de` (Azure Germany)
  - `(blob|file|queue|table|dfs).core.usgovcloudapi.net` (Azure US Government)
- Storage Explorer updating: `storageexplorerpublish.blob.core.windows.net`
- Microsoft link forwarding:
  - `aka.ms`
  - `go.microsoft.com`
- Any custom domains, private links, or Azure Stack instance-specific endpoints, that your resources are behind
- Remote emulator hostnames

## Proxy sources

Storage Explorer has several options for how/where it can source the information needed to connect to your proxy. To change which option is being used, go to **Settings** (gear icon on the left vertical toolbar) > **Application** > **Proxy**. Once you are at the proxy section of settings, you can select how/where you want Storage Explorer to source your proxy settings:
- Do not use proxy
- Use environment variables
- Use app proxy settings
- Use system proxy (preview)

### Do not use proxy

When this option is selected, Storage Explorer won't make any attempt to connect to a proxy. Do not use proxy is the default option.

### Use environment variables

When this option is selected, Storage Explorer will look for proxy information from specific environment variables. These variables are:
- `HTTP_PROXY`
- `HTTPS_PROXY`

If both variables are defined, then Storage Explorer will source proxy information from `HTTPS_PROXY`.

The value of these environment variables must be a url of the format:

`(http|https)://(username:password@)<hostname>:<port>`

Only the protocol (`http|https`), and hostname are required. If you have a username, you don't have to supply a password.

### Use app proxy settings

When this option is selected, Storage Explorer will use the in app proxy settings. These settings include:
- Protocol
- Hostname
- Port
- Do/do not use credentials
- Credentials

All settings other than credentials can be managed from either:
- **Settings** (gear icon on the left vertical toolbar) > **Application** > **Proxy** > **Use credentials**.
- The Proxy Settings dialog (**Edit** > **Configure Proxy**).

To set credentials, you must go to the Proxy Settings dialog (**Edit** > **Configure Proxy**).

### Use system proxy (preview)

When this option is selected, Storage Explorer will use your OS proxy settings. More specifically, it will result in network calls being made using the Chromium networking stack. The Chromium networking stack is much more robust than the NodeJS networking stack normally used by Storage Explorer. Here's a snippet from [Chromium's documentation](https://www.chromium.org/developers/design-documents/network-settings) on what all it can do:

> The Chromium network stack uses the system network settings so that users and administrators can control the network settings of all applications easily. The network settings include:
> - proxy settings
> - SSL/TLS settings
> - certificate revocation check settings
> - certificate and private key stores

If your proxy server requires credentials, and those credentials aren't configured at your OS settings, you'll need to enable usage of and set your credentials within in Storage Explorer. You can toggle use of credentials from either:
- **Settings** (gear icon on the left vertical toolbar) > **Application** > **Proxy** > **Use credentials**.
- The Proxy Settings dialog (**Edit** > **Configure Proxy**).

To set credentials, you must go to the Proxy Settings dialog (**Edit** > **Configure Proxy**).

This option is in preview because not all features currently support system proxy. See [features that do not support system proxy](#features-that-do-not-support-system-proxy) for a complete list of features which do not support it. When system proxy is enabled, features that don't support system proxy won't make any attempt to connect to a proxy.

If you come across an issue while using system proxy with a supported feature, [open an issue on GitHub](https://github.com/Microsoft/AzureStorageExplorer/issues/new).

## Proxy server authentication

If you have configured Storage Explorer to source proxy settings from **environment variables** or **app proxy settings**, then only proxy servers that use basic authentication are supported.

If you have configured Storage Explorer to use **system proxy**, then proxy servers that use any of the following authentication methods are supported:
- Basic
- Digest
- NTLM
- Negotiate

## Which proxy source should I choose?

If you're using features not listed [here](#features-that-do-not-support-system-proxy), then you should first try using [**system proxy**](#use-system-proxy-preview). If you come across an issue while using system proxy with a supported feature, [open an issue on GitHub](https://github.com/Microsoft/AzureStorageExplorer/issues/new).

If you're using features that don't support system proxy, then [**app settings**](#use-app-proxy-settings) is probably the next best option. The GUI-based experience for configuring the proxy configuration helps reduce the chance of entering your proxy information correctly. However, if you already have proxy environment variables configured, then it might be better to use [**environment variables**](#use-environment-variables).

## AzCopy proxy usage

Storage Explorer uses AzCopy for most data transfers operations. AzCopy is written using a different set of technologies than Storage Explorer and therefore has a slightly different set of proxy capabilities.

If Storage Explorer is configured to **do not use proxy** or to use **system proxy**, then AzCopy will be told to use its own autodetect proxy features to determine if and how it should make requests to a proxy. If you have configured Storage Explorer to source proxy settings from **environment variables** or **app proxy settings** though, then Storage Explorer will tell AzCopy to use the same proxy settings.

If you don't want AzCopy to use proxy no matter what, then you can disable proxy usage by toggling **Settings** (gear icon on the left vertical toolbar) > **Transfers** > **AzCopy** > **Disable AzCopy Proxy Usage**.

Currently, AzCopy only supports proxy servers that use **basic authentication**.

## SSL certificates

By default, Storage Explorer uses the NodeJS networking stack. NodeJS ships with a predefined list of trusted SSL certificates. Some networking technologies, such as proxy servers or anti-virus software, inject their own SSL certificates into network traffic. These certificates are often not present in NodeJS' certificate list. NodeJS won't trust responses that contain such a certificate. When NodeJS doesn't trust a response, then Storage Explorer will receive an error.

You have multiple options for resolving such errors:
- Use [**system proxy**](#use-system-proxy-preview) as your proxy source.
- Import a copy of the SSL certificate/s causing the error/s.
- Disable SSL certificate. (**not recommended**)

## Features that do not support system proxy

The following is a list of features that do not support **system proxy**:

- Storage Account Features
  - Setting default access tier
- Table Features
  - Manage access policies
  - Configure CORS
  - Generate SAS
  - Copy & Paste Table
  - Clone Table
- All ADLS Gen1 features

## Next steps

- [Troubleshoot proxy issues](./storage-explorer-troubleshooting.md#proxy-issues)
- [Troubleshoot certificate issues](./storage-explorer-troubleshooting.md#ssl-certificate-issues)
