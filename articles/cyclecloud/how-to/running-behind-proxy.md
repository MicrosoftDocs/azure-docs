---
title: Using a Web Proxy
description: Configure Azure CycleCloud to use a proxy for HTTP/HTTPS web traffic, which is useful to monitor traffic or when direct internet access isn't allowed.
author: dpwatrous
ms.date: 07/01/2025
ms.author: dawatrou
---

# Configuring CycleCloud to Use an HTTP(s) Proxy

You can configure Azure CycleCloud to use a proxy for all internet-bound HTTP and/or HTTPS traffic. This configuration is generally useful when direct internet access isn't allowed or when you want to monitor traffic.

## Proxy Setup

To enable proxies, go to the CycleCloud GUI and navigate to the **Settings** tab in the left frame. Then, double-click the **HTTP(s) Proxies** row. In the configuration dialog that appears, verify that **Enabled** is checked and enter the proxy details in the form.

![Proxy Settings window](~/articles/cyclecloud/images/proxy-settings.png)

Changes to the proxy settings don't take effect until after a restart. To restart CycleCloud, run the following command:

```bash
/opt/cycle_server/cycle_server restart --wait
```

## Add storage endpoint for Blob access

CycleCloud needs access to a Blob Storage container in your subscription to cache installation files for nodes. When operating behind a proxy or on a locked down network, configure a [Virtual Network Service Endpoint](/azure/virtual-network/virtual-network-service-endpoints-overview) or a [Private Endpoint](/azure/storage/common/storage-private-endpoints) to the storage service. This configuration routes requests to the storage container through the Azure backbone network instead of through the public management URLs.

> [!TIP]
> When you combine a Service Endpoint for Azure Storage access with an HTTPS Proxy for outbound Azure API traffic, you can configure CycleCloud to avoid the Proxy and send Storage requests directly via the Service Endpoint.
> 
> To disable the proxy for Storage Account access, add:
> `-Dhttp.nonProxyHosts="*.core.windows.net"`
> to the `webServerJvmOptions=` property in the: */opt/cycle_server/config/cycle_server.properties*
> file and then restart CycleCloud.

## Export HTTPS_PROXY before running the CycleCloud CLI installer

The [CycleCloud CLI installer](~/articles/cyclecloud/how-to/install-cyclecloud-cli.md) needs outbound access to install packages through `pip`. Before running the install script, set the **HTTPS_PROXY** environment variable to point to your proxy server and port:

```bash
export HTTPS_PROXY=myserver:8080
```

## Exporting proxy settings on nodes

If the nodes that CycleCloud starts also need to route traffic through a proxy server, we suggest using [cloud-init](~/articles/cyclecloud/how-to/cloud-init.md) to help configure your proxy settings. For example:

```ini
[node scheduler]
CloudInit = '''#cloud-config
write_files:
- path: /etc/profile.d/proxy.sh
  owner: root:root
  permissions: '0644'
  content: |
    export http_proxy=10.12.0.5:3128
    export https_proxy=10.12.0.5:3128
    export no_proxy=127.0.0.1,169.254.169.254  # special rule exempting Azure metadata URL from proxy
- path: /etc/systemd/system/jetpackd.service.d/env.conf
  owner: root:root
  permissions: '0644'
  content: |
    [Service]
    Environment="http_proxy=10.12.0.5:3128"
    Environment="https_proxy=10.12.0.5:3128"
    Environment="no_proxy=127.0.0.1,169.254.169.254"
'''
```
