---
title: Azure CycleCloud using Web Proxy | Microsoft Docs
description: Running Azure CycleCloud from behind HTTP/HTTPs Proxy.
services: azure cyclecloud
author: dpwatrous
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 12/18/2018
ms.author: dpwatrous
---

# Configuring CycleCloud to Use an HTTP(s) Proxy

Azure CycleCloud can be configured to use a proxy for all internet-bound HTTP 
and/or HTTPS traffic. This is generally useful when direct internet access is 
not allowed, or for traffic monitoring purposes.

## Proxy Setup

To enable proxies, go into the CycleCloud GUI and navigate to the 
**Settings** tab from the left frame, then double click on the 
**HTTP(s) Proxies** row. In the configuration dialog that pops up, check that 
**Enabled** is checked and enter the proxy details in the form.

![Proxy Settings window](~/images/proxy_settings.png)

Changes to the proxy settings will not take effect until after a restart. To 
restart CycleCloud, run the following command:

```bash
/opt/cycle_server/cycle_server restart --wait
```

## Add storage endpoint for Blob access

CycleCloud requires access to a Blob Storage container in your subscription 
in order to cache installation files for nodes. When operating behind a proxy
or on a locked down network, you should configure a [Virtual Network Service Endpoint](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-service-endpoints-overview)
to the storage service. This will route requests to the storage container through
the Azure backbone network instead of through the public management URLs.

## Export **HTTPS_PROXY** before running the CycleCloud CLI installer

The [CycleCloud CLI installer](../install-cyclecloud-cli.md) requires outbound
access to install packages via `pip`. Prior to running the install script,
be sure to set the **HTTPS_PROXY** environment variable to point to your
proxy server and port:

```bash
export HTTPS_PROXY=myserver:8080
```
