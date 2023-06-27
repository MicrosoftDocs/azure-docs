---
title: Troubleshoot accessing a CSN-connected internet host name within an AKS hybrid cluster for Azure Operator Nexus
description: Learn how to troubleshoot accessing a CSN-connected internet host name within an AKS hybrid cluster for Azure Operator Nexus.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 06/06/2023
ms.author: v-saambe
author: v-saambe
---

# Troubleshoot accessing a CSN-connected internet host name within an AKS hybrid cluster

This article outlines troubleshooting for scenarios where you're having problems reaching an internet host name that's part of the cloud services network (CSN) attached to an Azure Kubernetes Service (AKS) hybrid cluster.

## Prerequisites

* Gather this information:
  * Subscription ID
  * Cluster name and resource group
  * AKS hybrid cluster name and resource group
* Become familiar with the procedures in [Connect to the AKS hybrid cluster](/azure/AkS/Hybrid/create-aks-hybrid-preview-cli#connect-to-the-aks-hybrid-cluster).

## Common scenarios

Assume that you're logged in to the jump server. You used SSH to access the AKS hybrid virtual machine (VM) by using the IP address of the worker nodes or control plane VMs. From the AKS hybrid VM, you can't reach any egress endpoints that you obtained when you created an AKS hybrid VM that uses the CSN.

You're encountering an error when trying to access the fully qualified domain name (FQDN) of internet host names:

~~~bash
curl -vk [http://www.ubuntu.com](http://www.ubuntu.com)
~~~

~~~output
\*   Trying 192.xxx.xxx.xxx:xx...  
\* TCP_NODELAY set  
\*   Trying 2607:f8b0:xxxx:c17::xx:xx...  
\* TCP_NODELAY set  
\* Immediate connect fail for 2607:f8b0:xxxx:c17::xx: Network is
unreachable  
\*   Trying 2607:f8b0:xxxx:c17::xx:xx...  
\* TCP_NODELAY set  
\* Immediate connect fail for 2607:f8b0:xxxx:c17::xx: Network is
unreachable  
\*   Trying 2607:f8b0:xxxx:c17::xx:xx...  
\* TCP_NODELAY set  
\* Immediate connect fail for 2607:f8b0:xxxx:c17::xx: Network is
unreachable  
\*   Trying 2607:f8b0:xxxx:c17::93:xx...
~~~

## Suggested solutions  

### First attempt

Here's the code for the first attempt at a workaround:

~~~bash
curl -x "http_proxy=http://169.xxx.x.xx.xxxx" -vk "https://ubuntu.com"

https_proxy=<http://169.xxx.x.xx.xxxx> tdnf -y install openssh-clients
~~~

Here's the output:

~~~output

error:**
\* Could not resolve proxy: http_proxy=http  
\* Closing connection 0  

curl: (5) Could not resolve proxy: http_proxy=http
https_proxy=[http://169.xxx.x.xx.xxxx](http://169.xxx.x.xx.xxxx/) curl
-vk "https://ubuntu.com" shows connected but user get 403 Access denied.
~~~

### Second attempt

The first option for another attempt is to set a proxy inline by using curl. The settings will go away after the command is complete.

~~~bash
curl -x "http://169.xxx.x.xx.xxxx" -vk "https://ubuntu.com"
~~~

For the following second option, the proxy setting is effective while the user remains in the shell:

~~~bash
export https_proxy="http://169.xxx.x.xx.xxxx"
export HTTPS_PROXY="http://169.xxx.x.xx.xxxx"
curl -vk <https://ubuntu.com>
~~~

If you're running an RPM package installation by using a shell script, be sure to set `https_proxy` locally inside a shell script explicitly. You can also try setting the proxy as an option inline on RPM with the `--httpproxy` and `--httpport` options.

RPM has a proxy flag, which you must set:

~~~bash
sudo rpm --import <https://aglet.packages.cloudpassage.com/cloudpassage.packages.key>
--httpproxy 169.xxx.x.xx  --httpport 3128
~~~

> [!NOTE]
> If you set these flags system wide, they might lose their ability to run kubectl locally. Set them inline within the script first to help minimize the effects.

For more information, see the [Xmodulo article about installing RPM packages behind a proxy](https://www.xmodulo.com/how-to-install-rpm-packages-behind-proxy.html).
