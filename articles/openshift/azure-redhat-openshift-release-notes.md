---
title: What's new with Azure Red Hat OpenShift?
description: This article has release notes for Azure Red Hat OpenShift.
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
ms.topic: overview
ms.date: 09/11/2023
ms.custom: references_regions
---

# What's new with Azure Red Hat OpenShift?

Azure Red Hat OpenShift receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about the latest releases.

## Update - September 2023

To create a private cluster without a public IP address, you can now add the parameter `--outbound-type UserDefinedRouting` to the `aro create` command. See [Create a private cluster without a public IP address](howto-create-private-cluster-4x.md#create-a-private-cluster-without-a-public-ip-address) for details.

A cluster that is deployed with this feature and is running version 4.11 or higher can be scaled to 120 nodes and 30,000 pods.

## Version 4.12 - August 2023

We're pleased to announce the launch of OpenShift 4.12 for Azure Red Hat OpenShift. This release enables [OpenShift Container Platform 4.12](https://docs.openshift.com/container-platform/4.12/release_notes/ocp-4-12-release-notes.html).

> [!NOTE]
> Starting with ARO version 4.12, the support lifecycle for new versions will be set to 14 months from the day of general availability. That means that the end date for support of each version will no longer be dependent on the previous version (as shown in the table above for version 4.12.) This does not affect support for the previous version; two generally available (GA) minor versions of Red Hat OpenShift Container Platform will continue to be supported.
> 

## Update - June 2023

- Removed dependencies on service endpoints
    - The addition of the [egress lockdown](concepts-egress-lockdown.md) feature provided access to key Azure resources through the ARO Private Link service, thus removing the need to access ACR and storage accounts through a service endpoint and using a private endpoint instead. With this release, dependencies on service endpoints have been removed, and new clusters won't create service endpoints on VNets.

## Version 4.11 - February 2023

We're pleased to announce the launch of OpenShift 4.11 for Azure Red Hat OpenShift. This release introduces the following features:

- Ability to deploy OpenShift 4.11
- Multi-version support: 
    - This enables customers to select specific Y and Z version of the release. See [Red Hat OpenShift versions](support-lifecycle.md#red-hat-openshift-versions) for more information about versions.
    - Customers can still deploy 4.10 clusters if that version is specified. See [Selecting a different ARO version](tutorial-create-cluster.md#selecting-a-different-aro-version) for more information.
- OVN as the CNI for clusters 4.11 and above
- Accelerated networking VMs 
- UltraSSD support
- Gen2 VM support

