---
title: Configure Azure Operator 5G Core Preview network functions
description: Learn the high-level process for configuring a network function.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-5g-core
ms.topic: how-to #required; leave this attribute/value as-is
ms.date: 03/21/2024

---

# Configure Azure Operator 5G Core Preview network functions

Azure Operator 5G Core Preview supports  direct configuration of the first party packet core network functions deployed on Azure and Nexus by:

- enabling SSH access to port 22 of network configuration management pods directly.
- enabling configuration of network functions through CLI or by NETCONF to port 830, or by RESTCONF to port 443.

Note that many concurrent configuration user sessions are supported.

## Prerequisites

Before you can successfully SSH to your Azure Operator 5G Core, you must: 

1. Install `kubectl`. `kubectl` is the Kubernetes command-line tool that allows you to manage  Kubernetes clusters. 

1. Copy the kube.conf file from its source to the ~/.kube/config directory. You can copy the file using scp (secure copy) or any other secure method. 

## Connect to an Azure Operator 5G Core Preview network function using SSH

1. Obtain the IP address provided to the cfgmgr service's load balancer. Enter the following ```kubectl``` command or use the cfgmgr load balancer IP address specified during deployment:  

    `kubectl get svc -n fed-<nf_name>` \
    where <nf_name> is the name of the network function (for example, smf).

1. Use the cfgmgr load balancer IP address to SSH into the network function and configure it:

    `ssh admin@<nf_cfgmgr_svc_lb_ip>` \
    where <nf_cfgmgr_svc_lb_ip> is the cfgmgr load balancer IP address for the network function.

1. Use the `config` command to enter config mode and configure the network function.

## Additional information

For more information, see the documentation for the [Configuration Manager](https://manuals.metaswitch.com/UC/4.3.0/UnityCloud_Overview/Content/Microservices/Shared/Microservices/Config_Manager.htm).

> [!NOTE]
> The linked content is available only to customers with a current Affirmed Networks support agreement. To access the content, you must have  Affirmed Networks login credentials. If you need assistance, please speak to the Affirmed Networks Support Team.

## Next step

Learn how to configure a specific network function in [Tutorial: Configure Network Functions](tutorial-configure-network-function.md)