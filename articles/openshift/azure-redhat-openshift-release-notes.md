---
title: What's new with Azure Red Hat OpenShift?
description: This article has release notes for Azure Red Hat OpenShift.
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
ms.topic: overview
ms.date: 01/28/2025
ms.custom: references_regions
---

# What's new with Azure Red Hat OpenShift?

Azure Red Hat OpenShift receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about the latest releases.



## Updates - January 2025

- Public preview of [Confidential Containers support](confidential-containers-overview.md) on Azure Red Hat OpenShift released at Microsoft Ignite 2024. Confidential Containers provide a secure enclave within the host system, isolating applications and their data from potential threats.

- Azure Red Hat OpenShift [released in Spain Central region](https://azure.microsoft.com/updates?id=478571).

- New article released on [purchasing Reserved Instances](/azure/cost-management-billing/reservations/prepay-red-hat-openshift) for Azure Red Hat OpenShift.

- SRE maintenance operations that previously required reboots of the nodes have been improved. The reboots won't be initiated by SREs and will be paused until the next cluster upgrade operation.

## Version 4.15 - September 2024

We're pleased to announce the launch of OpenShift 4.15 for Azure Red Hat OpenShift. This release enables [OpenShift Container Platform 4.15](https://docs.openshift.com/container-platform/4.15/welcome/index.html) as an installable version. You can check the end of support date on the [support lifecycle page](/azure/openshift/support-lifecycle) for previous versions.

In addition to making version 4.15 available as an installable version, this release also makes the following features generally available:

- CLI for multiple public IP addresses for larger clusters up to 250 nodes

## Updates - August 2024

- You can now create up to 20 IP addresses per Azure Red Hat OpenShift cluster load balancer. This feature was previously in preview but is now generally available. See [Configure multiple IP addresses per cluster load balancer](howto-multiple-ips.md) for details. Azure Red Hat OpenShift 4.x has a 250 pod-per-node limit and a 250 compute node limit. For instructions on adding large clusters, see [Deploy a large Azure Red Hat OpenShift cluster](howto-large-clusters.md).

- There's a change in the order of actions performed by Site Reliability Engineers of Azure RedHat OpenShift. To maintain the health of a cluster, a timely action is necessary if control plane resources are over-utilized. Now the control plane is resized proactively to maintain cluster health. After the resize of the control plane, a notification is sent out to you with the details of the changes made to the control plane. Make sure you have the quota available in your subscription for Site Reliability Engineers to perform the cluster resize action.

## Version 4.14 - May 2024

We're pleased to announce the launch of OpenShift 4.14 for Azure Red Hat OpenShift. This release enables [OpenShift Container Platform 4.14](https://docs.openshift.com/container-platform/4.14/welcome/index.html). You can check the end of support date on the [support lifecycle page](/azure/openshift/support-lifecycle) for previous versions.

In addition to making version 4.14 available, this release also makes the following features generally available:

- [Egress IP (v4.12.45+, 4.13.21+)](https://docs.openshift.com/container-platform/4.14/networking/ovn_kubernetes_network_provider/configuring-egress-ips-ovn.html) 

- [Bring your own Network Security Group (NSG)](/azure/openshift/howto-bring-nsg).

- Support for [Azure Resource Health alerts](/azure/openshift/howto-monitor-alerts)

- Support in [Azure Terraform provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest)

## Version 4.13 - December 2023

We're pleased to announce the launch of OpenShift 4.13 for Azure Red Hat OpenShift. This release enables [OpenShift Container Platform 4.13](https://docs.openshift.com/container-platform/4.13/release_notes/ocp-4-13-release-notes.html). Version 4.11 will be outside of support after February 10, 2024.  Existing clusters version 4.11 and below should be upgraded before then.

## Update - September 2023

To create a private cluster without a public IP address, you can now add the parameter `--outbound-type UserDefinedRouting` to the `aro create` command. See [Create a private cluster without a public IP address](howto-create-private-cluster-4x.md#create-a-private-cluster-without-a-public-ip-address) for details.

A cluster that is deployed with this feature and is running version 4.11 or higher can be scaled to 120 nodes and 30,000 pods.

## Version 4.12 - August 2023

We're pleased to announce the launch of OpenShift 4.12 for Azure Red Hat OpenShift. This release enables [OpenShift Container Platform 4.12](https://docs.openshift.com/container-platform/4.12/release_notes/ocp-4-12-release-notes.html).

## Update - June 2023

- Removed dependencies on service endpoints
    - The addition of the [egress lockdown](concepts-egress-lockdown.md) feature provided access to key Azure resources through the ARO Private Link service, thus removing the need to access ACR and storage accounts through a service endpoint and using a private endpoint instead. With this release, dependencies on service endpoints have been removed, and new clusters won't create service endpoints on VNets.

## Version 4.11 - February 2023

We're pleased to announce the launch of OpenShift 4.11 for Azure Red Hat OpenShift. This release introduces the following features:

- Ability to deploy OpenShift 4.11
- Multi-version support: 
    - This enables customers to select specific Y and Z version of the release. For more information about versions, see [Red Hat OpenShift versions](support-lifecycle.md#red-hat-openshift-versions).
    - Customers can still deploy 4.10 clusters if that version is specified. For more information, see [Selecting a different ARO version](create-cluster.md#selecting-a-different-aro-version).
- OVN as the CNI for clusters 4.11 and above
- Accelerated networking VMs 
- UltraSSD support
- Gen2 VM support

