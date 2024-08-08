---
title: What's new with Azure Red Hat OpenShift?
description: This article has release notes for Azure Red Hat OpenShift.
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
ms.topic: overview
ms.date: 08/08/2024
ms.custom: references_regions
---

# What's new with Azure Red Hat OpenShift?

Azure Red Hat OpenShift receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about the latest releases.

## Update - July 2023

You can now create up to 20 IP addresses per Azure Red Hat OpenShift cluster load balancer, with a maximum number of 65 nodes per IP address. This feature was previously in preview but is now generally available. See [Configure multiple IP addresses per cluster load balancer](howto-multiple-ips.md) for details.

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

