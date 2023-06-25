---
title: What's new with Azure Red Hat OpenShift?
description: This article has release notes for Azure Red Hat OpenShift.
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
ms.topic: overview
ms.date: 06/21/2023
ms.custom: references_regions
---

# What's new with Azure Red Hat OpenShift?

Azure Red Hat OpenShift receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about the latest releases.

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

