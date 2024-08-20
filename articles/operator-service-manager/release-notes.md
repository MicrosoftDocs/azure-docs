---
title: Azure Operator Service Manager Release Notes
description: Tracking of major and minor releases of Azure Operator Service Manager.
author: msftadam
ms.author: adamdor
ms.date: 08/14/2024
ms.topic: release-notes
ms.service: azure-operator-service-manager
---

# Release Notes

This pages hosts release notes for Azure Operator Service Manager (AOSM).

## Overview

The following release notes are generally available (GA):

* Release Notes for Version 2.0.2763-119
* Release Notes for Version 2.0.2777-132

### Release Attestation
These releases are produced compliant with Microsoft’s Secure Development Lifecycle. This lifecycle includes processes for authorizing software changes, antimalware scanning, and scanning and mitigating security bugs and vulnerabilities.

## Release 2.0.2763-119

Document Revision 1.5

### Release Summary
Azure Operator Service Manager is a cloud orchestration service that enables automation of operator network-intensive workloads, and mission critical applications hosted on Azure Operator Nexus. Azure Operator Service Manager unifies infrastructure, software, and configuration management with a common model into a single interface, both based on trusted Azure industry standards. This July 31st, 2024 Azure Operator Service Manager release includes updating the NFO version to 2.0.2763-119, the details of which are further outlined in the remainder of this document.

### Release Details
* Release Version: 2.0.2763-119
* Release Date: July 31st, 2024

### Release Installation
**[BREAKING CHANGE INSTALLATION]** This is a major version release, which includes a breaking change. To safely install this version, follow the below steps:
1.	Delete all site network services and network functions from the custom location.
2.	Uninstall the network function extension.
3.	Delete custom location
4.	Ensure repository access, if required, by updating the content delivery network (CDN) to permit the endpoint linuxgeneva-microsoft.azurecr.io on port 443. This step can be skipped if a wildcard is  used or if running Nexus 3.12 or later.
5.	Install the network function extension
6.	Create custom location
7.	Redeploy site network services and network functions to the custom location.

### Release Highlights
#### Cluster Registry & Webhook – High Availability 
Introduced in this release is an enhancement of the cluster registry and webhook service to support high availability operations. When enabled, the singleton pod, used in earlier releases, is replaced  with a replica set and optionally allows for horizontal auto scaling. Other notable improvements include:
* Changing registry storage volume from nexus-volume to nexus-shared.
* Implementing options to allow for the future deletion of the extension with minimal impact.
* Adds tracking references for cluster registry container images usage

#### Safe Upgrades – Downgrade to Lower Version 
With this release, a Site Network Service (SNS) reput operation now supports downgrading a network function to a lower version. The downgrade reput operation uses the helm update method and is not the same as a rollback operation. Downgrade operations support the same capabilities as upgrades, such as atomic parameter, test-option parameters, and pause-on-failure behavior.

### Issues Resolved in This Release 

#### Bugfix Related Updates
The following bug fixes, or other defect resolutions, are delivered with this release, for either Network Function Operator (NFO) or resource provider (RP) components.

* NFO	- Fix for Out Of Memory(OOM) condition in artifact-controller pod when installing fed-smf with Cluster Registry.
* NFO	- Prevent mutation of non-AOSM managed pods within kube-system namespace. AT&T can use the default value for the new parameter to selectively apply mutations to AOSM-managed pods.
* NFO	- Improved logging, fixing situations where logs were being dropped
* NFO	- Tuning of memory and CPU resources, to limit resource consumption.

#### Security Related Updates
Through Microsoft’s Secure Future Initiative (SFI), this release delivers the following security focused enhancements.

* NFO	- Signing of helm package used by network function extension.
* NFO	- Signing of core image used by network function extension.
* NFO	- Use of Cert-manager for service certificate management and rotation. This change can result in failed SNS deployments if not properly reconciled. For guidance on the impact of this change, see our [best practice recommendations](best-practices-onboard-deploy.md#considerations-if-your-nf-runs-cert-manager).
* NFO	- Automated refresh of AOSM certificates during extension installation.
* NFO	- A dedicated service account for the preupgrade job to safeguard against modifications to the existing network function extension service account.
* RP - The service principles (SPs) used for deploying site & Network Function (NF) now require “Microsoft.ExtendedLocation/customLocations/read” permission. The SP's that deploy day N scenario now require "Microsoft.Kubernetes/connectedClusters/listClusterUserCredentials/action" permission. This change can result in failed SNS deployments if not properly reconciled
* CVE	- A total of five CVEs are addressed in this release.


## Release 2.0.2777-132

Document Revision 1.1

### Release Summary
Azure Operator Service Manager is a cloud orchestration service that enables automation of operator network-intensive workloads, and mission critical applications hosted on Azure Operator Nexus. Azure Operator Service Manager unifies infrastructure, software, and configuration management with a common model into a single interface, both based on trusted Azure industry standards. This August 7, 2024 Azure Operator Service Manager release includes updating the NFO version to 2.0.2777-132, the details of which are further outlined in the remainder of this document.

### Release Details
* Release Version: 2.0.2777-132
* Release Date: August 7, 2024
* Is NFO update required: YES

### Release Installation
This release can be installed with as an update on top of release 2.0.2763-119.  

### Issues Resolved in This Release 

#### Bugfix Related Updates
The following bug fixes, or other defect resolutions, are delivered with this release, for either Network Function Operator (NFO) or resource provider (RP) components.

* NFO	- Adding taint tolerations to all NFO pods and scheduling them on system nodes. Daemonset pods will continue to run on all nodes of cluster).

#### Security Related Updates

* CVE	- A total of five CVEs are addressed in this release.
  
