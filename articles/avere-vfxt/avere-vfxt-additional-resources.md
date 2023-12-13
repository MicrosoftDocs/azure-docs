---
title: Additional links about Avere vFXT for Azure
description: Use these resources for additional information about Avere vFXT for Azure, including Avere cluster documentation and vFXT management documentation.
author: ekpgh
ms.service: avere-vfxt
ms.topic: conceptual
ms.date: 01/13/2020
ms.author: rohogue
---

# Additional documentation

This article has links to additional documentation about the Avere Control Panel management interface and related topics.

## Avere cluster documentation

Additional Avere cluster documentation can be found on the [Avere website](https://azure.github.io/Avere/). These documents can help you understand the cluster's capabilities and how to configure its settings.

* The [FXT Cluster Creation Guide](https://azure.github.io/Avere/#fxt_cluster) is designed for clusters made up of physical hardware nodes, but some information in the document is relevant for vFXT clusters as well. In particular, new vFXT cluster administrators can benefit from reading these sections:
  * [Customizing Support and Monitoring Settings](https://azure.github.io/Avere/legacy/create_cluster/4_8/html/config_support.html#config-support) explains how to customize support upload settings and enable remote monitoring.
  * [Configuring VServers and Global Namespace](https://azure.github.io/Avere/legacy/create_cluster/4_8/html/config_vserver.html#config-vserver) has information about creating a client-facing namespace.
  * [Configuring DNS for the Avere cluster](https://azure.github.io/Avere/legacy/create_cluster/4_8/html/config_network.html#dns-overview) explains how to configure round-robin DNS.
  * [Adding Back-end Storage](https://azure.github.io/Avere/legacy/create_cluster/4_8/html/config_core_filer.html#add-core-filer) documents how to add core filers.

* The [Cluster Configuration Guide](https://azure.github.io/Avere/#operations) is a complete reference of settings and options for an Avere cluster. A vFXT cluster uses a subset of these options, but most of the same configuration pages apply.

* The [Dashboard Guide](https://azure.github.io/Avere/#operations) explains how to use the cluster monitoring features of the Avere Control Panel.

## vFXT creation and management documentation

A full guide for using vfxt.py, a script-based cloud cluster creation and management utility, is provided on GitHub: [Cloud cluster management with vfxt.py](https://github.com/Azure/AvereSDK/blob/master/docs/README.md).
