---
title: Network Connections in Azure Storage Explorer
description: Documentation on connecting to your network in Azure Storage Explorer
services: storage
author: jinglouMSFT
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: article
ms.date: 04/01/2021
ms.author: jinglou
ms.reviewer: cralvord,richardgao
---

# Network connections in Storage Explorer

Storage Explorer uses your network to make requests to your storage resources and other Azure and Microsoft services.

## Hostnames accessed by Storage Explorer

Storage Explorer makes requests to various endpoints while in use. The following list details common hostnames that Storage Explorer makes requests to:

- Azure Resource Manager (ARM) endpoints:
  - `management.azure.com` (global Azure)
  - `management.chinacloudapi.cn` (Microsoft Azure operated by 21Vianet)
  - `management.usgovcloudapi.net` (Azure US Government)
- Sign in endpoints:
  - `login.microsoftonline.com` (global Azure)
  - `login.chinacloudapi.cn` (Microsoft Azure operated by 21Vianet)
  - `login.microsoftonline.us` (Azure US Government)
- Graph endpoints:
  - `graph.microsoft.com` (global Azure)
  - `microsoftgraph.chinacloudapi.cn` (Microsoft Azure operated by 21Vianet)
  - `graph.microsoft.us` (Azure US Government)
- Azure Storage endpoints:
  - `(blob|file|queue|table|dfs).core.windows.net` (global Azure)
  - `(blob|file|queue|table|dfs).core.chinacloudapi.cn` (Microsoft Azure operated by 21Vianet)
  - `(blob|file|queue|table|dfs).core.usgovcloudapi.net` (Azure US Government)
- Storage Explorer updating:
  - `storage-explorer-publishing-feapcgfgbzc2cjek.b01.azurefd.net`
- Microsoft link forwarding:
  - `aka.ms`
  - `go.microsoft.com`
- Any custom domains, private links, or Azure Stack instance-specific endpoints, that your resources are behind
- Remote emulator hostnames

## Proxy sources

Storage Explorer has several options for how/where it can source the information needed to connect to your proxy. To change which option is being used, go to **Settings** (gear icon in the vertical toolbar) > **Application** > **Proxy**. Once you are at the proxy section of settings, you can select how/where you want Storage Explorer to source your proxy settings:
- [Do not use proxy](#do-not-use-proxy)
- [Use environment variables](#use-environment-variables)
- [Use app proxy settings](#use-app-proxy-settings)
- [Use system proxy](#use-system-proxy)

In some situations, Storage Explorer might automatically change the proxy source and other proxy related settings. To disable this behavior, go to **Settings** (gear icon in the vertical toolbar) > **Application** > **Proxy** > **Auto Manage Proxy Settings**. Disabling this setting prevents Storage Explorer from changing any manually configured proxy settings.

### Do not use proxy

When this option is selected, Storage Explorer doesn't connect to a proxy. This option is the default.

### Use environment variables

When this option is selected, Storage Explorer looks for proxy information from specific environment variables. These variables are:
- `HTTP_PROXY`
- `HTTPS_PROXY`

If both variables are defined, then Storage Explorer retrieves proxy information from `HTTPS_PROXY`.

The value of these environment variables must be a url of the format:

`(http|https)://(username:password@)<hostname>:<port>`

Only the protocol (`http|https`), and hostname are required. If you have a username, you don't have to supply a password.

### Use app proxy settings

When this option is selected, Storage Explorer uses the in-app proxy settings. These settings include:
- Protocol
- Hostname
- Port
- Credentials (optional)

All settings other than credentials can be managed from either:
- **Settings** (gear icon in the vertical toolbar) > **Application** > **Proxy** > **Use credentials**.
- The Proxy Settings dialog (**Edit** > **Configure Proxy**).

To set credentials, you must go to the Proxy Settings dialog (**Edit** > **Configure Proxy**).

### Use system proxy

When this option is selected, Storage Explorer uses your OS proxy settings. Specifically, Storage Explorer uses the Chromium networking stack when making network calls. The Chromium networking stack is much more robust than the Node.js networking stack normally used by Storage Explorer. Here's a snippet from [Chromium's documentation](https://www.chromium.org/developers/design-documents/network-settings) on what all it can do:

> The Chromium network stack uses the system network settings so that users and administrators can control the network settings of all applications easily. The network settings include:
> - proxy settings
> - SSL/TLS settings
> - certificate revocation check settings
> - certificate and private key stores

If your proxy server requires credentials, and those credentials aren't configured at your OS settings, you need to set credentials in Storage Explorer. You can toggle use of credentials from either:
- **Settings** (gear icon in the vertical toolbar) > **Application** > **Proxy** > **Use credentials**.
- The Proxy Settings dialog (**Edit** > **Configure Proxy**).

To set credentials, you must go to the Proxy Settings dialog (**Edit** > **Configure Proxy**).

## Proxy server authentication

If you configured Storage Explorer to source proxy settings from **environment variables** or **app proxy settings**, then only proxy servers that use basic authentication are supported.

If you configured Storage Explorer to use **system proxy**, then proxy servers that use any of the following authentication methods are supported:
- Basic
- Digest
- NTLM
- Negotiate

## Which proxy source should I choose?

You should first try using [**system proxy**](#use-system-proxy). After that, [**app settings**](#use-app-proxy-settings) is the next best option. The GUI-based experience for configuring the proxy configuration helps reduce the chance of entering your proxy information correctly. However, if you already have proxy environment variables configured, then it might be better to use [**environment variables**](#use-environment-variables).

## AzCopy proxy usage

Storage Explorer uses AzCopy for most data transfers. AzCopy is written using a different set of technologies than Storage Explorer and therefore has a slightly different set of proxy capabilities. The following describe AzCopy's proxy behavior based on how Storage Explorer is configured:

- If Storage Explorer is configured with `system proxy`, AzCopy uses its own autodetect proxy features.
- If Storage Explorer is configured with `environment variables` or `app proxy settings`, Storage Explorer tells AzCopy to use the same proxy setting.
- If Storage Explorer is configured with `do not use proxy`, AzCopy proxy usage is disabled.

Currently, AzCopy only supports proxy servers that use **basic authentication**.

## SSL certificates

By default, Storage Explorer uses the Node.js networking stack. Node.js ships with a predefined list of trusted SSL certificates. Some networking technologies, such as proxy servers or anti-virus software, inject their own SSL certificates into network traffic. These certificates are often not present in NodeJS' certificate list. Node.js rejects responses that contain such a certificate. When Node.js doesn't trust a response, then Storage Explorer receives an error.

You have multiple options for resolving such errors:
- Use [**system proxy**](#use-system-proxy) as your proxy source.
- Import a copy of the SSL certificate/s causing the error/s.
- Disable SSL certificate. (**not recommended**)

## Next steps

- [Troubleshoot proxy issues](./storage-explorer-troubleshooting.md#proxy-issues)
- [Troubleshoot certificate issues](./storage-explorer-troubleshooting.md#ssl-certificate-issues)
