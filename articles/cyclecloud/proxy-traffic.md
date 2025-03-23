---
title: Proxy Traffic
description: Enable proxy access to your Azure CycleCloud install.
author: adriankjohnson
ms.date: 08/01/2018
ms.author: adjohnso
---

# Proxy Traffic

When using the [Return Proxy](https://docs.cyclecomputing.com/user-guide-v6.6.1/return_proxy) feature, Azure CycleCloud requires direct (or via bastion host) SSH access to one or more nodes in your clusters. In an environment where all HTTP/S traffic must travel through a web proxy or gateway, additional setup is required. You will need to know the values for  `<%= @http_proxy_host %> ` and  `<%= @http_proxy_port %> `.

## All Providers
Click on your user or account name in the upper right corner of your CycleCloud window, and select "Settings". Double click on "DataMan" to open the configuration window. To allow proxy use, click the "Proxy Enabled" checkbox and enter the required information. Click "Save" to continue, or "Cancel" to exit the window.

To connect to Azure from behind a proxy, you will need to modify your  `cycle_server/config/cycle_server.properties ` file and add the following to the  `webServerJvmOptions` property:

``` properties
webServerJvmOptions= -Dhttp.proxyHost=<%= @http_proxy_host %> -Dhttp.proxyPort=<%= @http_proxy_port %>
```
