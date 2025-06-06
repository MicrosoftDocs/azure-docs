---
title: Using a Web Proxy
description: Configure Azure CycleCloud to use a proxy for HTTP/HTTPS web traffic, which is useful to monitor traffic or when direct internet access isn't allowed.
author: dpwatrous
ms.date: 2/18/2020
ms.author: dawatrou
---

# Configuring CycleCloud to Use an HTTP(s) Proxy

Azure CycleCloud can be configured to use a proxy for all internet-bound HTTP and/or HTTPS traffic. This is generally useful when direct internet access is not allowed, or for traffic monitoring purposes.

## Proxy Setup

To enable proxies, go into the CycleCloud GUI and navigate to the **Settings** tab from the left frame, then double click on the **HTTP(s) Proxies** row. In the configuration dialog that pops up, verify that **Enabled** is checked and enter the proxy details in the form.

![Proxy Settings window](~/articles/cyclecloud/images/proxy-settings.png)

Changes to the proxy settings will not take effect until after a restart. To restart CycleCloud, run the following command:

```bash
/opt/cycle_server/cycle_server restart --wait
```

## Add storage endpoint for Blob access

CycleCloud requires access to a Blob Storage container in your subscription in order to cache installation files for nodes. When operating behind a proxy or on a locked down network, you should configure a [Virtual Network Service Endpoint](/azure/virtual-network/virtual-network-service-endpoints-overview) or a [Private Endpoint](/azure/storage/common/storage-private-endpoints) to the storage service. This will route requests to the storage container through the Azure backbone network instead of through the public management URLs.

> [!TIP]
> When combining a Service Endpoint for Azure Storage access with an HTTPS Proxy for outbound Azure API traffic, CycleCloud itself can be configured to avoid the Proxy and send Storage requests directly via the Service Endpoint.
> 
> To disable the proxy for Storage Account access, add:
> `-Dhttp.nonProxyHosts="*.core.windows.net"`
> to the `webServerJvmOptions=` property in the: */opt/cycle_server/config/cycle_server.properties*
> file and then restart CycleCloud.

## Export HTTPS_PROXY before running the CycleCloud CLI installer

The [CycleCloud CLI installer](~/articles/cyclecloud/how-to/install-cyclecloud-cli.md) requires outbound access to install packages via `pip`. Prior to running the install script, be sure to set the **HTTPS_PROXY** environment variable to point to your
proxy server and port:

```bash
export HTTPS_PROXY=myserver:8080
```

## Exporting proxy settings on nodes

If the nodes started by CycleCloud also need to have traffic routed through a proxy server, we suggest the use of [cloud-init](~/articles/cyclecloud/how-to/cloud-init.md) to help configure your proxy settings as needed. For example:

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
