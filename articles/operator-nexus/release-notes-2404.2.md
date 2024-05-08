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

## Release summary

Operator Nexus 2404.2 includes NC3.10 Management updates and an NC3.8.7
runtime patch. 

## Release highlights

### Resiliency enhancements

* Bare Metal Machine (BMM)/BMC KeySets - Enhanced handling of Entra disconnected state.

*  Prevents simultaneous disruptive BMM actions against Kubernetes Control Plane nodes.

* Prevents user from adding or deleting a hybrid-compute machine  extension on the Cluster MRG.

* Prevents user from creating and deleting arc-connected clusters and the arc-connected machine from Nexus Kubernetes Service (NKS) MRG.

### Security enhancements

* Credential rotation status information on the Bare-metal Machine (BMC or Console User) and Storage Appliance (Storage Admin) resources.

* Harden Network Fabric Controller (NFC) Infrastructure Proxy to allow outbound connections to known services.

* HTTP/2 enhancements.

* Remove Key Vault from Cluster Manager MRG.

### Observability enhancements 

* (Preview) Appropriate status reflected for Rack Pause scenarios.

* More metrics support: Calico data-plane failures, disk latency, etcd, hypervisor memory usage, pageswap, pod restart, NTP.

*  Enable users to create alert rules that track disconnection metrics for connectivity of clusters to the Cluster Manager.

* Enable storage appliance logs.

### Other updates

* Enable high-availability for NFS Storage.

* Support Purity 6.5.4.

* PURE hardware upgrade from R3 to R4.

* Updated OS image as a 3.8.7 runtime patch release to remediate new Common Vulnerabilities Exposures (CVEs).

## Next steps

* Learn more about [supported software versions](./reference-supported-software-versions.md).