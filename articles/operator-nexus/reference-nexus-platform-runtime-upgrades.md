---
title: Operator Nexus Platform Cluster runtime upgrades
description: Detail the cadence and process Nexus uses to release new runtime versions to customers
ms.topic: article
ms.date: 12/29/2023
author: matthewernst
ms.author: matthewernst
ms.service: azure-operator-nexus
---

# Nexus Platform Cluster runtime upgrade governance

This document details how Nexus releases, manages, and supports various platform runtime upgrades for near edge customers. 

Operator Nexus will release platform cluster runtime versions three minor versions per year and monthly patch versions in between.

Operator Nexus supports n-2 platform cluster runtime releases for customers, providing approximately one year of support upon release.

## Understanding Nexus Cluster versioning

Nexus Platform Cluster versions use semantically versioning-based principles (https://semver.org/), which ensures that users can make informed decisions about version selection with the following rules about changes allowed in a version: 

- Major version to introduce fundamentally incompatible functionality or interface changes. 
- Minor version to introduce functionality while retaining a backwards compatible interface. 
- Patch version to make backwards compatible modifications, such as bug or security vulnerability fixes. 

Nexus Cluster versions utilize the same Major.Minor.Patch scheme. Using semantic versioning includes a critical principle of immutability. **Once a versioned package has been released, the contents of that version WILL NOT be modified. Any modifications MUST be released as a new version.**  

The Platform Cluster version is represented in the Nexus Cluster resource in the “clusterVersion” property. At the time of cluster creation, the version is specified in the cluster resource, and must contain a supported version. To update, the cluster updateVersion action is called with a payload specifying the desired version, which must be one of the supported update versions for that cluster. The cluster property “availableUpgradeVersions” contains the list of eligible versions specific to that cluster’s hardware and current version. 

## Nexus Platform Cluster release cadence

Operator Nexus targets a new minor version platform cluster release in February, June, and October every year. A customer can decide when to apply the minor version to a Nexus instance. However, these minor releases aren't optional and need to be taken to stay in support. 

These platform cluster releases consist of new minor Kubernetes releases for the infrastructure, new versions of Azure Linux, and other critical components to the underlying platform. 

In addition to minor releases, Operator Nexus releases patch platform cluster releases in between minor releases. In general, these releases are optional to apply.

## Patch Platform Cluster runtime releases

Platform Cluster patch releases will be scheduled monthly to provide customers with an updated, secure version of Azure Linux. These releases will be applied to the latest minor release.

Operator Nexus will also release patch platform cluster runtime releases addressing critical functional or high severity security issues to the latest minor release. 

## Platform Cluster runtime releases out of support

When a customer is on a release that has moved out of support, Microsoft will attempt to mitigate the customer tickets but it may not be possible to address. When a runtime minor release has dropped support, it will no longer be an option to deploy to a new instance.  

 

When an instance is running an n-3 version: 

- The cluster will continue to run; however, normal operations may start to degrade as newer versions of software aren't given the same testing and integration 
- Support tickets raised will continue to get support, but the issues may not be able to be mitigated.  
- The n-3 release will no longer be available to customers to deploy a new instance.  
- There's no upgrade path supported (more details below), requiring customers to repave instances. 
- Platform Cluster runtime versions past support may continue to run but Microsoft doesn't guarantee all functionality to be compatible with the newest version of software in the Cluster Manager.  An upgrade path will be supported for customers on supported releases. Upgrading from an n-3 version or greater aren't supported and will require a repave of the site.  Customers need to execute a platform cluster runtime upgrade before a site gets to n-3, this is usually within four months of the EOS date.   
- From a certificate perspective, there's currently a requirement for the customer to update their platform cluster runtime within a year of the most recent platform cluster runtime upgrade or first deployment to ensure certificates are kept valid and can connect to Azure. Instances with invalid certificates will require a new deployment.

## Skipping minor releases

Platform Cluster runtime minor releases can't be skipped due to the upgrade requirements of Kubernetes. A customer wanting to go from an n-2 version to an n version needs to perform multiple platform cluster runtime upgrades.

## Related links

[How to perform a Platform Cluster runtime upgrade](./howto-cluster-runtime-upgrade.md)
