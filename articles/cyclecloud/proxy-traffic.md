---
title: Proxy Traffic
description: Enable proxy access to your Azure CycleCloud install.
author: adriankjohnson
ms.date: 07/01/2025
ms.author: adjohnso
---

# Proxy traffic

To use the [Return Proxy](https://docs.cyclecomputing.com/user-guide-v6.6.1/return_proxy) feature, Azure CycleCloud needs direct SSH access to one or more nodes in your clusters. You can also access nodes through a bastion host. In an environment where all HTTP/S traffic must travel through a web proxy or gateway, you need a different setup. You need to know the values for `<%= @http_proxy_host %>` and `<%= @http_proxy_port %>`.

## All providers
Select your user or account name in the upper right corner of your CycleCloud window, and select **Settings**. Double-click **DataMan** to open the configuration window. To allow proxy use, select the **Proxy Enabled** checkbox and enter the required information. Select **Save** to continue, or **Cancel** to exit the window.

To connect to Azure from behind a proxy, modify your `cycle_server/config/cycle_server.properties` file and add the following to the `webServerJvmOptions` property:

``` properties
webServerJvmOptions= -Dhttp.proxyHost=<%= @http_proxy_host %> -Dhttp.proxyPort=<%= @http_proxy_port %>
```
