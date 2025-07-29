---
title: Release notes for Azure Operator Service Manager
description: Official tracking or AOSM releases and available regions.
author: msftadam
ms.author: adamdor
ms.date: 01/15/2025
ms.topic: release-notes
ms.service: azure-operator-service-manager
---

# Release Notes for Azure Operator Service Manager

This article hosts release information for Azure Operator Service Manager (AOSM).

## Regional Availability of Releases

Releases described herewithin are generally available across the following Azure regions:
* eastus
* southcentralus
* westus3
* uksouth
* westeurope

Use of AOSM in these regions is permitted, based on prevailing Azure terms of service. Although AOSM may have supported additional regions in the past, any region not-listed is no longer supported. If you have been using AOSM in a not-listed region, or if you have a business need to use AOSM in a not-listed region, please open a support ticket to submit request consideration.

## Release Notes by Version

Releases included in this article are generally available and supported across permitted regions. AOSM users are recommended to watch this page for frequent changes, as releases maybe added, updated or removed at any time. No additional notice of releases is provided, beyond this release notes article.
  
### Release Attestation for All Versions
All releases are produced compliant with Microsoft’s Secure Development Lifecycle. This lifecycle includes processes for authorizing software changes, antimalware scanning, and scanning and mitigating security bugs and vulnerabilities.

## Release 2.0.2763-119

Document Revision 1.5

### Release Summary
Azure Operator Service Manager is a cloud orchestration service that enables automation of operator network-intensive workloads, and mission critical applications hosted on Azure Operator Nexus. Azure Operator Service Manager unifies infrastructure, software, and configuration management with a common model into a single interface, both based on trusted Azure industry standards. This July 31st, 2024 Azure Operator Service Manager release includes updating the NFO version to 2.0.2763-119, the details of which are further outlined in the remainder of this document.

### Release Details
* Release Version: 2.0.2763-119
* Release Date: July 31st, 2024
* Is NFO update required: YES, DELETE & REINSTALL

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
* NFO	- Use of Cert-manager for service certificate management and rotation. This change can result in failed SNS deployments if not properly reconciled.
* NFO	- Automated refresh of AOSM certificates during extension installation.
* NFO	- A dedicated service account for the preupgrade job to safeguard against modifications to the existing network function extension service account.
* RP - The service principles (SPs) used for deploying site & Network Function (NF) now require “Microsoft.ExtendedLocation/customLocations/read” permission. The SPs that deploy day N scenario now require "Microsoft.Kubernetes/connectedClusters/listClusterUserCredentials/action" permission. This change can result in failed SNS deployments if not properly reconciled
* CVE	- A total of five CVEs are addressed in this release.


## Release 2.0.2777-132

Document Revision 1.1

### Release Summary
Azure Operator Service Manager is a cloud orchestration service that enables automation of operator network-intensive workloads, and mission critical applications hosted on Azure Operator Nexus. Azure Operator Service Manager unifies infrastructure, software, and configuration management with a common model into a single interface, both based on trusted Azure industry standards. This August 7, 2024 Azure Operator Service Manager release includes updating the NFO version to 2.0.2777-132, the details of which are further outlined in the remainder of this document.

### Release Details
* Release Version: 2.0.2777-132
* Release Date: August 7, 2024
* Is NFO update required: YES, UPDATE ONLY

### Release Installation
This release can be installed with as an update on top of release 2.0.2763-119. See [learn documentation](manage-network-function-operator.md) for more installation guidance.

### Issues Resolved in This Release 

#### Bugfix Related Updates
The following bug fixes, or other defect resolutions, are delivered with this release, for either Network Function Operator (NFO) or resource provider (RP) components.

* NFO	- Adding taint tolerations to all NFO pods and scheduling them on system nodes. Daemonset pods continue to run on all nodes of cluster).

#### Security Related Updates

* CVE	- A total of five CVEs are addressed in this release.

## Release 2.0.2783-134

Document Revision 1.1

### Release Summary
Azure Operator Service Manager is a cloud orchestration service that enables automation of operator network-intensive workloads, and mission critical applications hosted on Azure Operator Nexus. Azure Operator Service Manager unifies infrastructure, software, and configuration management with a common model into a single interface, both based on trusted Azure industry standards. This August 15, 2024 Azure Operator Service Manager release includes updating the NFO version to 2.0.2783-134, the details of which are further outlined in the remainder of this document.

### Release Details
* Release Version: 2.0.2783-134
* Release Date: August 15, 2024
* Is NFO update required: YES, DELETE & REINSTALL

### Release Installation
**[BREAKING CHANGE INSTALLATION]** This is a mitigation version release, which includes a breaking change. To safely install this version, follow the below steps:
* Delete all site network services and network functions from the custom location.
* Delete custom location
* Uninstall the network function extension.
* Delete cert-manager CRDs using commands:
```
kubectl delete crd certificaterequests.cert-manager.io
kubectl delete crd certificates.cert-manager.io
kubectl delete crd challenges.acme.cert-manager.io
kubectl delete crd clusterissuers.cert-manager.io
kubectl delete crd issuers.cert-manager.io
kubectl delete crd orders.acme.cert-manager.io
```
* Install the network function extension
* Create custom location
* Redeploy site network services and network functions to the custom location.

### Release Highlights
#### Cluster Registry & Webhook – High Availability 
This mitigation release disables cluster registry and webhook high availability functionality, to restore ownership of cert-manager services to workload. Instead, NFO uses custom methods of certificate management. High availability, along with changes to rotate certs will be restored in a future release.

### Issues Resolved in This Release 

#### Bugfix Related Updates
The following bug fixes, or other defect resolutions, are delivered with this release, for either Network Function Operator (NFO) or resource provider (RP) components.

* NFO	- Cert-manager service is removed from NFO installation and operational use.
   
#### Security Related Updates

None

## Release 2.0.2788-135

Document Revision 1.1

### Release Summary
Azure Operator Service Manager is a cloud orchestration service that enables automation of operator network-intensive workloads, and mission critical applications hosted on Azure Operator Nexus. Azure Operator Service Manager unifies infrastructure, software, and configuration management with a common model into a single interface, both based on trusted Azure industry standards. This August 21, 2024 Azure Operator Service Manager release includes updating the NFO version to  2.0.2788-135, the details of which are further outlined in the remainder of this document.

### Release Details
* Release Version: Version 2.0.2788-135
* Release Date: August 21, 2024
* Is NFO update required: YES, Update only
* Dependency Versions: Go/1.22.4  Helm/3.15.2

### Release Installation
This release can be installed with as an update on top of release 2.0.2783-134. See [learn documentation](manage-network-function-operator.md) for more installation guidance.

### Release Highlights
#### Cluster Registry – Garbage Collection 
This release extends cluster registry functionality enabling a manual trigger to identify and purging of unused images in the repository. For proper operation, the user must install both this latest version and a helper script, which is provided by request only.

### Issues Resolved in This Release 

#### Bugfix Related Updates
The following bug fixes, or other defect resolutions, are delivered with this release, for either Network Function Operator (NFO) or resource provider (RP) components.

* NFO	- Adjusts AOSM pod tolerations to ensure scheduling on the appropriate nodes.
* NFO - Adds a retry mechanism to handle concurrent updates of artifact custom resources.
   
#### Security Related Updates

None

## Release 2.0.2804-137

Document Revision 1.1

### Release Summary
Azure Operator Service Manager is a cloud orchestration service that enables automation of operator network-intensive workloads, and mission critical applications hosted on Azure Operator Nexus. Azure Operator Service Manager unifies infrastructure, software, and configuration management with a common model into a single interface, both based on trusted Azure industry standards. This August 30, 2024 Azure Operator Service Manager release includes updating the NFO version to 2.0.2804-137, the details of which are further outlined in the remainder of this document.

### Release Details
* Release Version: Version 2.0.2804-137
* Release Date: August 30, 2024
* Is NFO update required: YES, Update only
* Dependency Versions: Go/1.22.4 - Helm/3.15.2

### Release Installation
This release can be installed with as an update on top of release 2.0.2788-135. See [learn documentation](manage-network-function-operator.md) for more installation guidance.

### Release Highlights
#### High availability for cluster registry and webhook.
This version restores the high availability features first introduced with release 2.0.2783-134. When enabled, the singleton pod, used in earlier releases, is replaced with a replica set and optionally allows for horizontal auto scaling.

#### Enhanced internal certificate management and rotation.
This version implements internal certificate management using a new method which does not take dependency on cert-manager. Instead, a private internal service is used to handle requirements for certificate management and rotation within the AOSM namespace. 

#### Safe Upgrades NF Level Rollback
This version introduces new user options to control behavior when a failure occurs during an upgrade. While pause on failure remains the default, a user can now optionally enable rollback on failure. If a failure occurs, with rollback on failure any prior completed NfApps are reverted to prior state using helm rollback command. See [learn documentation](safe-upgrades-nf-level-rollback.md) for more details on usage.

### Issues Resolved in This Release 

#### Bugfix Related Updates
The following bug fixes, or other defect resolutions, are delivered with this release, for either Network Function Operator (NFO) or resource provider (RP) components.

* NFO	- Enhance cluster registry performance by preventing unnecessary or repeated image downloads.
   
#### Security Related Updates

* CVE	- A total of one CVE is addressed in this release.

## Release 2.0.2810-144

Document Revision 1.1

### Release Summary
Azure Operator Service Manager is a cloud orchestration service that enables automation of operator network-intensive workloads, and mission critical applications hosted on Azure Operator Nexus. Azure Operator Service Manager unifies infrastructure, software, and configuration management with a common model into a single interface, both based on trusted Azure industry standards. This September 13, 2024 Azure Operator Service Manager release includes updating the NFO version to 2.0.2810-144, the details of which are further outlined in the remainder of this document.

### Release Details
* Release Version: Version 2.0.2810-144
* Release Date: September 13, 2024
* Is NFO update required: YES, Update only
* Dependency Versions: Go/1.22.4 - Helm/3.15.2

### Release Installation
This release can be installed with as an update on top of release 2.0.2804-137. See [learn documentation](manage-network-function-operator.md) for more installation guidance.

### Issues Resolved in This Release 

#### Bugfix Related Updates
The following bug fixes, or other defect resolutions, are delivered with this release, for either Network Function Operator (NFO) or resource provider (RP) components.

* NFO	- Prevent the cluster registry certificate from being invalidated during Arc extension controller reconciliation.

#### Security Related Updates

None

## Release 2.0.2847-158

Document Revision 1.0

### Release Summary
Azure Operator Service Manager is a cloud orchestration service that enables automation of operator network-intensive workloads, and mission critical applications hosted on Azure Operator Nexus. Azure Operator Service Manager unifies infrastructure, software, and configuration management with a common model into a single interface, both based on trusted Azure industry standards. This October 18, 2024 Azure Operator Service Manager release includes updating the NFO version to 2.0.2847-158, the details of which are further outlined in the remainder of this document.

### Release Details
* Release Version: Version 2.0.2847-158
* Release Date: October 18, 2024
* Is NFO update required: YES, Update only
* Dependency Versions: Go/1.22.4 - Helm/3.15.2

### Release Installation
This release can be installed with as an update on top of release 2.0.2804-144. See [learn documentation](manage-network-function-operator.md) for more installation guidance.
  
#### Bugfix Related Updates
The following bug fixes, or other defect resolutions, are delivered with this release, for either Network Function Operator (NFO) or resource provider (RP) components.

* NFO	- Fixes webhook and image secrets issues when trying to delete 2 network functions in same namespace.
* NFO - Adds retries to fix intermittent image download failures from the cluster registry.

#### Security Related Updates
* CVE	- A total of 19 CVEs are addressed in this release.

## Release 2.0.2860-160

Document Revision 1.0

### Release Summary
Azure Operator Service Manager is a cloud orchestration service that enables automation of operator network-intensive workloads, and mission critical applications hosted on Azure Operator Nexus. Azure Operator Service Manager unifies infrastructure, software, and configuration management with a common model into a single interface, both based on trusted Azure industry standards. This October 31, 2024 Azure Operator Service Manager release includes updating the NFO version to 2.0.2860-160, the details of which are further outlined in the remainder of this document.

### Release Details
* Release Version: Version 2.0.2860-160
* Release Date: October 31, 2024
* Is NFO update required: YES, Update only
* Dependency Versions: Go/1.22.4 - Helm/3.15.2

### Release Installation
This release can be installed with as an update on top of release 2.0.2847-158. See [learn documentation](manage-network-function-operator.md) for more installation guidance.

### Release Highlights
#### Cluster registry garbage collection automation
This version expands the cluster registry garbage collection feature set to include automatic cleanup. A background job runs to regularly clean up container images. The job schedule, how frequently each day the jobs runs, and the threshold condition to trigger cleanup, expressed as percent capacity utilized, is configured by end-user. By default, the job will run once per day at a 0% utilization threshold.

#### Bugfix Related Updates
The following bug fixes, or other defect resolutions, are delivered with this release, for either Network Function Operator (NFO) or resource provider (RP) components.

None

#### Security Related Updates

None

## Release 2.0.2875-165

Document Revision 1.0

### Release Summary
Azure Operator Service Manager is a cloud orchestration service that enables automation of operator network-intensive workloads, and mission critical applications hosted on Azure Operator Nexus. Azure Operator Service Manager unifies infrastructure, software, and configuration management with a common model into a single interface, both based on trusted Azure industry standards. This November 15, 2024 Azure Operator Service Manager release includes updating the NFO version to 2.0.2875-165, the details of which are further outlined in the remainder of this document.

### Release Details
* Release Version: Version 2.0.2875-165
* Release Date: November 15, 2024
* Is NFO update required: YES, Update only
* Dependency Versions: Go/1.22.4 - Helm/3.15.2

#### Bugfix Related Updates
The following bug fixes, or other defect resolutions, are delivered with this release, for either Network Function Operator (NFO) or resource provider (RP) components.

* NFO	- Fixes image pull issues by enumerating to find the valid secret to use when pulling the image from remote artifact store resource.
* NFO - Fixes issue resulting from enabling cluster registry after first NFO extension installation.
* NFO - Improved Cluster Registry error handling and logging.

#### Security Related Updates
* CVE	- A total of 2 CVEs are addressed in this release.

## Release 2.0.2976-178

Document Revision 1.0

### Release Summary
Azure Operator Service Manager is a cloud orchestration service that enables automation of operator network-intensive workloads, and mission critical applications hosted on Azure Operator Nexus. Azure Operator Service Manager unifies infrastructure, software, and configuration management with a common model into a single interface, both based on trusted Azure industry standards. This February 25, 2025 Azure Operator Service Manager release includes updating the NFO version to 2.0.2976-178, the details of which are further outlined in the remainder of this document.

### Release Details
* Release Version: Version 2.0.2976-178
* Release Date: February 25, 2025
* Is NFO update required: YES, Update only
* Dependency Versions: Go/1.22.4 - Helm/3.15.2

#### Bugfix Related Updates
The following bug fixes, defect resolutions, or usability improvements are delivered with this release, for either Network Function Operator (NFO) or resource provider (RP) components.

* RP - Increase component timeout during delete operations to 2 hours and 30 minutes. (2501290010002055)
* NFO	- Fix for SNS delete Pre & Post hooks not able to download images (2501270010002100)
* NFO - Remove redundant image downloads to improve install/upgrade time 
* NFO - Artifact Controller Logging Improvement

#### Security Related Updates
* CVE	- A total of 2 CVEs are addressed in this release.

## Release 2.0.2985-184

Document Revision 1.0

### Release Summary
Azure Operator Service Manager is a cloud orchestration service that enables automation of operator network-intensive workloads, and mission critical applications hosted on Azure Operator Nexus. Azure Operator Service Manager unifies infrastructure, software, and configuration management with a common model into a single interface, both based on trusted Azure industry standards. This March 6, 2025 Azure Operator Service Manager release includes updating the NFO version to 2.0.2985-184, the details of which are further outlined in the remainder of this document.

### Release Details
* Release Version: Version 2.0.2985-184
* Release Date: March 6, 2025
* Is NFO update required: YES, Update only
* Dependency Versions: Go/1.22.4 - Helm/3.15.2

> [!WARNING]
> This release has been found to contain flaws and should not be used. Please use 2.0.2987-186 instead.

## Release 2.0.2987-186

Document Revision 1.0

### Release Summary
Azure Operator Service Manager is a cloud orchestration service that enables automation of operator network-intensive workloads, and mission critical applications hosted on Azure Operator Nexus. Azure Operator Service Manager unifies infrastructure, software, and configuration management with a common model into a single interface, both based on trusted Azure industry standards. This March 10, 2025 Azure Operator Service Manager release includes updating the NFO version to 2.0.2987-186, the details of which are further outlined in the remainder of this document.

### Release Details
* Release Version: Version 2.0.2987-186
* Release Date: March 10, 2025
* Is NFO update required: YES, Update only
* Dependency Versions: Go/1.22.4 - Helm/3.15.2

#### Bugfix Related Updates
The following bug fixes, defect resolutions, or usability improvements are delivered with this release, for either Network Function Operator (NFO) or resource provider (RP) components.

* NFO - Cluster Registry Image Corruption Auto-Recovery [2502220010001187]: Sometimes, images in the cluster registry become corrupted due to failures during the download process. This results in all subsequent retry attempts for that image failing. This solution detects corrupted images, removes broken Docker image links, and ensures that future retries can successfully download the image.
* NFO - Avoid performing an unnecessary image copy when the image is already present in the cluster registry: This update eliminates redundant image downloads when the Artifact Controller pod crashes or becomes temporarily unavailable due to network issues. If the image is already present in the cluster registry, the system will now bypass unnecessary copies, improving efficiency and reducing resource consumption.
* NFO - Increase oras download concurrency count [ICM602686818]: This update increases the concurrency setting in ORAS, enhancing parallel processing and improving download speed.

## Release 3.0.3007-208

Document Revision 1.0

### Release Summary
Azure Operator Service Manager is a cloud orchestration service that enables automation of operator network-intensive workloads, and mission critical applications hosted on Azure Operator Nexus. Azure Operator Service Manager unifies infrastructure, software, and configuration management with a common model into a single interface, both based on trusted Azure industry standards. This March 31, 2025 Azure Operator Service Manager release includes updating the NFO version to 3.0.3007-208, the details of which are further outlined in the remainder of this document.

### Release Details
* Release Version: Version 3.0.3007-208
* Release Date: March 31, 2025
* Is NFO update required: YES, Update only
* Dependency Versions: Go/1.22.4 - Helm/3.15.2

#### Release Updates
The following bug fixes, defect resolutions, or usability improvements are delivered with this release, for either Network Function Operator (NFO) or resource provider (RP) components.

* NFO - [602686818] Expose new installation parameter to set cluster registry CPU and memory resources to "small", "medium" or "large" scale option.
* NFO - [602686818] Tune ORAS concurrency settings for improved performance and resource utilization for all scale options.

## Release 3.0.3054-214 

Document Revision 1.0

### Release Summary
Azure Operator Service Manager is a cloud orchestration service that enables automation of operator network-intensive workloads, and mission critical applications hosted on Azure Operator Nexus. Azure Operator Service Manager unifies infrastructure, software, and configuration management with a common model into a single interface, both based on trusted Azure industry standards. This May 19, 2025 Azure Operator Service Manager release includes updating the NFO version to 3.0.3054-214 and the RP version to 1.0.03050.424, the details of which are further outlined in the remainder of this document.

### Release Details
* Release Version: NFO version 3.0.3054-214, RP version 1.0.03050.424
* Release Date: May 19, 2025
* Is NFO update required: YES, Update only
* Dependency Versions: Go/1.24.3 - Helm/3.17.2

### Release Highlights
#### Support for artifact-manifest publisher template
**[FEATURE 1041747 / ART-399]** adds support for the new artifact-manifest publisher template first introduced in RP API version 2025-03-30. This template improves effeciency of publisher resource cleanup, enabling the safe bulk deleteion of unused resources to automate publisher artifact-store space management. The extension remains backward compatible with earlier API versions and existing workflows. Note: When upgrading a site network service (SNS) deployed using an older API version, to this new version, a pod restart is required, following the upgrade, to ensure the local registry remains in-sync with the publisher artifact-store. If the local registry is not brought in-sync, the SNS may not function in a disconnected scenario.

#### Release Updates
The following bug fixes, defect resolutions, or usability improvements are delivered with this release, for either Network Function Operator (NFO) or resource provider (RP) components.

* NFO - [2117907] The TLS daemonset was updateed to pre-load required packages during build time. This reduces startup latency and avoids unnecessary network traffic.
* NFO - [SFI] Helm version upgrade from 3.15.2 to 3.17.2.
* NFO - [SFI] Go version upgrade from 1.22.4 to 1.24.3.
* NFO - [SFI] Base image migrated from CBL-Mariner to AzureLinux.
* NFO - [SFI] A total of 15 CVEs are addressed in this release.
* RP - [606065291] Fixes conflict scenarios during SNS delete operations by preventing duplicate requests.
* RP - [600962417] Populate Chart Details in DeploymentProfile when ConfigurationType is "Secret"
