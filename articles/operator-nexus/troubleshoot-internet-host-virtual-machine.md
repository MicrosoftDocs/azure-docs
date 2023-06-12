---
title: Troubleshoot accessing a CSN connected internet hostname within the AKS hybrid cluster for Azure Operator Nexus
description: Troubleshoot accessing a CSN connected internet hostname within the AKS hybrid cluster for Azure Operator Nexus
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 06/06/2023
ms.author: v-saambe
author: v-saambe
---

# Accessing a CSN connected internet hostname within the AKS hybrid cluster

This article outlines troubleshooting for scenarios where the end user is having issues reaching an internet hostname, which is part of the CSN
attached to AKS hybrid cluster.

## Prerequisites

* Subscription ID
* Cluster name and resource group
* AKS-Hybrid cluster name and resource group
* Familiar with procedures provided in [Connect to AKS Hybrid](/azure/AkS/Hybrid/create-aks-hybrid-preview-cli#connect-to-the-aks-hybrid-cluster)

Once these prerequisites have been applied, we can finalize the repair of the “Curl -vk” by performing the below workaround.

## Common scenarios

User logged in to the jump server and ssh would into AKS hybrid VM using the IP address of the worker nodes or control plane VMs. From AKS hybrid VM users couldn’t reach any egress endpoints mentioned while creating an AKS hybrid that uses the CSN

The user is encountering an error when trying to access the fully qualified domain name (FQDN) of internet hostnames

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

~~~bash
curl -x "http_proxy=http://169.xxx.x.xx.xxxx" -vk "https://ubuntu.com"

https_proxy=<http://169.xxx.x.xx.xxxx> tdnf -y install openssh-clients
~~~

### First attempt with the above commands generated a user

~~~output

error:**
\* Could not resolve proxy: http_proxy=http  
\* Closing connection 0  

curl: (5) Could not resolve proxy: http_proxy=http
https_proxy=[http://169.xxx.x.xx.xxxx](http://169.xxx.x.xx.xxxx/) curl
-vk "https://ubuntu.com" shows connected but user get 403 Access denied.
~~~

### Second attempt with the commands

\# option 1 (set proxy inline on curl, settings will go away after
command is complete)

~~~bash
curl -x "http://169.xxx.x.xx.xxxx" -vk "https://ubuntu.com"
~~~

\# option 2 (proxy setting is effective while they remain in the shell)

~~~bash
export https_proxy="http://169.xxx.x.xx.xxxx"
export HTTPS_PROXY="http://169.xxx.x.xx.xxxx"
curl -vk <https://ubuntu.com>
~~~

If a customer is running their rpm install with a shell script, they must ensure setting the http(s)\_proxy locally inside their shell script explicitly. They can also try setting the proxy as an option inline on rpm with the '--httpproxy' and '--httpport' options.

[For additional information](https://www.xmodulo.com/how-to-install-rpm-packages-behind-proxy.html)

### How to install.RPM packages behind proxy

RPM has a proxy flag, which must be set:

~~~bash
sudo rpm --import <https://aglet.packages.cloudpassage.com/cloudpassage.packages.key>
--httpproxy 169.xxx.x.xx  --httpport 3128
~~~

>[!Note]
>Keep in mind if you set them system-wide, they may "lose" their ability to run kubectl locally. Set them inline within the script first to help minimize the effects.
