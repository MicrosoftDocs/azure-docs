---
title: Avere vFXT cluster tuning - Azure
description: Overview of custom settings to optimize performance in Avere vFXT for Azure
author: ekpgh
ms.service: avere-vfxt
ms.topic: how-to
ms.date: 12/19/2019
ms.author: rohogue
---

# Cluster tuning

Most vFXT clusters can benefit from customized performance settings. These settings help the cluster to work best with your particular workflow, dataset, and tools.

This customization should be done with help from a support representative, because it can involve configuring features that are not available from the Avere Control Panel.

This section describes some of the custom tuning that can be done.

## General optimizations

These changes might be recommended based on dataset qualities or workflow style.

* If the workload is write-heavy, increase the size of the write cache from its default of 20%.
* If the dataset involves many small files, increase the cluster cache's file count limit.
* If the work involves copying or moving data between two repositories, adjust the number of threads used for moving data:
  * To increase speed, you might increase the number of parallel threads used.
  * If the back-end storage volume is becoming overloaded, you might need to decrease the number of parallel threads used.
* If the cluster caches data for a core filer that uses NFSv4 ACLs, enable access mode caching to streamline file authorization for particular clients.

## Cloud NAS or cloud gateway optimizations

In a cloud NAS or gateway scenario, the vFXT cluster provides NAS-style access to a cloud container. To take advantage of higher data speeds between the vFXT cluster and cloud storage, your representative might recommend changing settings to more aggressively push data to the storage volume from the cache. For example:

* Increase the number of TCP connections between the cluster and the storage container

## Cloud bursting or hybrid WAN optimizations

In a cloud bursting scenario or hybrid storage WAN optimization scenario, the vFXT cluster provides integration between the cloud and on-premises hardware storage. These changes can be helpful:

* Increase the number of TCP connections allowed between the cluster and the core filer
* Enable the WAN Optimization setting for the remote core filer (This setting can be used for a remote on-premises filer or a cloud core filer in a different Azure region.)
* Increase the TCP socket buffer size<sup>*</sup>
* Enable the "always forward" setting to reduce redundantly cached files<sup>*</sup>

<sup>*</sup>These adjustments might not apply to all systems, depending on workload and performance needs.

## Help optimizing your Avere vFXT for Azure

To contact support staff about these optimizations, use the procedure described in [Get help with your system](avere-vfxt-open-ticket.md).
