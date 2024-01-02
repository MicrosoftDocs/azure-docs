---
title: Overview of OVN-Kubernetes network provider for Azure Red Hat OpenShift clusters
description: Overview of OVN-Kubernetes network provider for Azure Red Hat OpenShift clusters.
author: johnmarco
ms.service: azure-redhat-openshift
ms.topic: conceptual
ms.author: johnmarc
ms.date: 04/17/2023
topic: how-to
keywords: azure, openshift, aro, red hat, azure CLI, azure portal, ovn, ovn-kubernetes, CNI, Container Network Interface
#Customer intent: I need to configure OVN-Kubernetes network provider for Azure Red Hat OpenShift clusters.
---

# OVN-Kubernetes network provider for Azure Red Hat OpenShift clusters

The OpenShift Container Platform cluster uses a virtualized network for pod and service networks. The OVN-Kubernetes Container Network Interface (CNI) plug-in is a network provider for the default cluster network. OVN-Kubernetes, which is based on the Open Virtual Network (OVN), provides an overlay-based networking implementation. 

A cluster that uses the OVN-Kubernetes network provider also runs Open vSwitch (OVS) on each node. OVN configures OVS on each node to implement the declared network configuration.

## OVN-Kubernetes features

The OVN-Kubernetes CNI cluster network provider offers the following features:

* Uses OVN to manage network traffic flows. OVN is a community developed, vendor-agnostic network virtualization solution.
* Implements Kubernetes network policy support, including ingress and egress rules.
* Uses the Generic Network Virtualization Encapsulation (Geneve) protocol rather than the Virtual Extensible LAN (VXLAN) protocol to create an overlay network between nodes.

> [!NOTE]
> As of ARO 4.11, OVN-Kubernetes is the CNI for all ARO clusters. In already existing clusters, migrating from the previous SDN standard to OVN is not supported.
> 
> If your cluster uses any part of the 100.64.0.0/16 IP address range, you cannot migrate to OVN-Kubernetes because it uses this IP address range internally.

For more information about OVN-Kubernetes CNI network provider, see [About the OVN-Kubernetes default Container Network Interface (CNI) network provider](https://docs.openshift.com/container-platform/latest/networking/ovn_kubernetes_network_provider/about-ovn-kubernetes.html).

## Recommended content

[Tutorial: Create an Azure Red Hat OpenShift 4 cluster](tutorial-create-cluster.md)
