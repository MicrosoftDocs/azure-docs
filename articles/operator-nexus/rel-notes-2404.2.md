---
title: Azure Operator Nexus Release Notes 2404.2
description: Release notes for Operator Nexus 2404.2 release.
ms.topic: article
ms.date: 05/06/2024
author: jashobhit
ms.author: shobhitjain
ms.service: azure-operator-nexus
---

# Operator Nexus Release Version 2404.2

Release date: April 29, 2024

## Release Summary

Operator Nexus 2404.2 includes NC3.10 Management updates and NC3.8.7
runtime patch. 

## Release highlights

### Resiliency enhancements

* Bare Metal Machine (BMM)/BMC KeySets - Enhanced handling of Entra disconnected state.

*  Prevent simultaneous disruptive BMM actions against K8s Control Plane nodes.

* Prevent user from adding or deleting a hybrid-compute machine  extension on the Cluster MRG.

* Prevents user from creating and deleting arc-connected clusters and arc-connected machine from Nexus Kubernetes Service (NKS) MRG.

### Security enhancements

* Credential rotation status information on the Bare-metal Machine (BMC or Console User) and Storage Appliance (Storage Admin) resources.

* Harden NFC Infrastructure Proxy to allow outbound connections to known services.

* HTTP/2 enhancements.

* Remove Key Vault from Cluster Manager Managed Resource Group (MRG).

### Observability enhancements 

* (Preview) Appropriate status reflected for Rack Pause scenarios.

* More metrics support: Calico data-plane failures, disk latency, etcd, hypervisor memory usage, pageswap, pod restart, NTP.

*  Enable metrics to indicate connectivity of clusters to cluster manager. This feature enables users to create alert rules indicating disconnection.

* Enable storage appliance logs.

### Other Updates:

* Enable high-availability for NFS Storage.

* Purity 6.5.4 support

* PURE hardware upgrade from R3 to R4:  

* Release runtime patch release: To remediate new CVEs, include an updated OS image as a 3.8.7 runtime patch release.

## Next steps

* Learn more about [supported software versions] (./reference-supported-software-versions.md).