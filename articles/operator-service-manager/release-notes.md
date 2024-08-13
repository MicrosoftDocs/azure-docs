---
title: Azure Operator Service Manager Release Notes
description: Tracking of notes for major and minor release of AOSM.
author: msftadam
ms.author: adamdor
ms.date: 08/13/2024
ms.topic: release-notes
ms.service: azure-operator-service-manager
---

# Release Notes

This pages hosts  notes for Azure Operator Service Manager (AOSM) releases.

## Overview

The following release notes are generally available (GA):

* Release Notes for Version 2.0.2763-119

### Release Attestation
These releases are produced compliant with Microsoft’s Secure Development Lifecycle.  This includes processes for authorizing software changes, antimalware scanning, and scanning and mitigating security bugs and vulnerabilities.

## Release 2.0.2763-119

Document Revision 1.5

### Release Summary
Azure Operator Service Manager is a cloud orchestration service that enables automation of operator network-intensive workloads, and mission critical applications hosted on Azure Operator Nexus.  Azure Operator Service Manager unifies infrastructure, software and configuration management with a common model into a single interface, both based on trusted Azure industry standards.  This 07-31-2024 Azure Operator Service Manager release includes updating the NFO version to 2.0.2763-119, the details of which are further outlined in the remainder of this document.

### Release Details
* Release Version: 2.0.2763-119
* Release Date: 07-31-2024

### Release Installation
**[BREAKING CHANGE INSTALLATION]** This is a major version release, which includes a breaking change. To safely install this version, follow the below steps:
1.	Delete all site network services and network functions from the custom location.
2.	Uninstall the network function extension: 
3.	Delete custom location
4.	_If Required:_ To ensure repository access, update the content delivery network (CDN) to permit the endpoint: "linuxgeneva-microsoft.azurecr.io" port 443. This step can be skipped if a wildcard is being used or if running Nexus 3.12 or later.
5.	Install the network function extension
6.	Create custom location
7.	Redeploy site network services and network functions to the custom location.

### Release Highlights
#### Cluster Registry & Webhook – High Availability 
Introduced in this release is an enhancement of the cluster registry and webhook service to support high availability operations.  When enabled, the singleton pod, used in earlier releases, is rpelaced with a replica set and optionally allows for horizontal auto scaling. Other notable improvements include:
* Changing registry storage volume from "nexus-volume" to "nexus-shared"
* Implementing options to allow for the future deletion of the extension with minimal impact.
* Adds tracking references for cluster registry container images usage

#### Safe Upgrades – Downgrade to Lower Version 
With this release, a Site Network Service (SNS) re-put operation now supports downgrading a network function to a lower version.  The downgrade re-put operation uses the “helm update” method and is not the same as a rollback operation.  Downgrade operations support the same capabilities as upgrades, such as atomic parameter, test-option parameters and pause-on-failure behavior.

### Issues Resolved in This Release 

#### Bugfix Related Updates
The following bugfixes, or other defect resolutions, are delivered with this release, for either Network Function Operator (NFO) or reource provider (RP) components.

* NFO	- Fix for Out Of Memory(OOM) condition in artifact-controller pod when installing fed-smf with Cluster Registry.
* NFO	- Prevent mutation of non-AOSM managed pods within "kube-system" namespace. AT&T can use the default value for the new parameter to selectively apply mutations to AOSM-managed pods. (see Appendix B)
* NFO	- Improved logging, fixing situations where logs were being dropped
* NFO	- Tuning of memory and CPU resources, to limit resource consumption.

#### Security Related Updates
Through Microsoft’s Secure Future Initiative (SFI), this release delivers the following security focused enhancements.

* NFO	- Signing of helm package used by network function extension.
* NFO	- Signing of core image used by network function extension.
* NFO	- Use of Cert-manager for service certificate management and rotation.  This change can result in failed SNS deployments if not properly reconciled.  For guidance on the impact of this change, see Appendix A.
* NFO	- Automated refresh of AOSM certificates during extension installation.
* NFO	- A dedicated service account for the pre-upgrade job to safeguard against modifications to the existing network function extension service account.
* RP - The service principles (SPs) used for deploying site & NF now require “Microsoft.ExtendedLocation/customLocations/read” permission.  The SP's that deploy day N scenario now require "Microsoft.Kubernetes/connectedClusters/listClusterUserCredentials/action" permission. This change can result in failed SNS deployments if not properly reconciled
* CVE	- A total of 5 CVE’s are addressed in this release.

### Appendix A
#### Cert-manager Usage Guidance for NEPS
With release 1.0.2728-50 and later , AOSM now uses cert-manager to store and rotate certificates. As part of this change, AOSM deploys a cert-manager operator, and associate CRDs, in the azurehybridnetwork namespace. Since having multiple cert-manager operators, even deployed in separate namespaces, will watch across all namespaces, only one cert-manager can be effectively run on the cluster.

Any user trying to install cert-manager on the cluster, as part of a workload deployment, will get a deployment failure with an error that the CRD “exists and cannot be imported into the current release.”  To avoid this error, the recommendation is to skip installing cert-manager, instead take dependency on cert-manager operator and CRD already installed by AOSM.

#### Other Configuration Changes to Consider

In addition to disabling the NfApp associated with the old user cert-manager, we have found other changes may be needed;
1.	If one NfApp contains both cert-manager and the CA installation, these must broken into two NfApps, so that the partner can disable cert-manager but enable CA installation.
2.	If any other NfApps have DependsOn references to the old user cert-manager NfApp, these will need to be removed. 
3.	If any other NfApps reference the old user cert-manager namespace value, this will need to be changed to the new azurehybridnetwork namespace value.  

#### Cert-Manager Version Compatibility & Management

For the cert-manager operator, our current deployed version is 1.14.5.  Users should test for compatibility with this version.  Future cert-manager operator upgrades will be supported via the NFO extension upgrade process. 

For the CRD resources, our current deployed version is 1.14.5.  Users should test for compatibility with this version.  Since management of a common cluster CRD is something typically handled by a cluster administrator, we are working to enable CRD resource upgrades via standard Nexus Add-on process.
