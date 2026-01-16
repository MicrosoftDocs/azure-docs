---
title: Release notes for Azure Operator Service Manager
description: Official tracking of Azure Operator Service Manager available releases and regions.
author: msftadam
ms.author: adamdor
ms.date: 10/10/2025
ms.topic: release-notes
ms.service: azure-operator-service-manager
---

# Release notes for Azure Operator Service Manager
This article hosts release information for Azure Operator Service Manager (AOSM). Azure Operator Service Manager is a cloud orchestration service that enables automation of operator network-intensive workloads, and mission critical applications hosted on Azure Operator Nexus. Azure Operator Service Manager unifies infrastructure, software, and configuration management with a common model into a single interface, both based on trusted Azure industry standards. This article is updated frequently and serves as the primary announcement method for new releases. Make sure to check back often and stay up-to-date.

## Release email notifications
To receive email notifications upon the general availability of new AOSM releases, join the AOSM notification distribution list by submitting contact information in the following sign-up form: https://forms.office.com/r/GPkgkNi2tx

## Regional availability of releases
Releases described herewithin are generally available and supported across the following Azure regions:
* eastus
* southcentralus
* westus3
* uksouth
* westeurope

Use of AOSM in these regions is permitted, based on prevailing Azure terms of service. Although AOSM may have supported additional regions in the past, any region not-listed is no longer supported. If you have been using AOSM in a not-listed region, or if you have a business need to use AOSM in a not-listed region, please open a support ticket to submit request consideration.
  
## Release attestation for all versions
All releases are produced compliant with Microsoft’s Secure Development Lifecycle. This lifecycle includes processes for authorizing software changes, antimalware scanning, and scanning and mitigating security bugs and vulnerabilities.

## Release notes for the latest release
The following release is the latest generally available release.

## Release 2509.02
This 2509.02 Azure Operator Service Manager release includes updating the NFO version to 3.0.3243-229 and the RP version to 1.0.03180.486. This release is a hotfix to be applied only to systems presently running release 2509.01.

### Latest release details
* NFO Release Version: 3.0.3243-229
* RP Release Version: 1.0.03180.486
* CLI Extension Release Version: 2.0.0b3
* Release Date: November 19, 2025
* Is NFO update required: YES, Update only
* Dependency Versions: Go/1.24.3 - Helm/3.18.4 - Base Image/AzureLinux 3.0

### Latest release updates to improve quality
The following bug fixes, defect resolutions, or usability improvements are delivered with this release, for either Network Function Operator (NFO) or resource provider (RP) components.
* NFO - [408044] Change maxAvailable for tls-daemonset to restart even when cluster has notReady nodes.

## Release notes for all releases 
The following generally available releases are listed in order from oldest to newest.

## Release 2407.01
This 2407.01 Azure Operator Service Manager release includes updating the NFO version to 2.0.2763-119.

### Release Details
* NFO Release Version: 2.0.2763-119
* Release Date: July 31st, 2024
* Is NFO update required: YES, DELETE & REINSTALL

### Release Installation
**[BREAKING CHANGE INSTALLATION]** This is a major version release, which includes a breaking change. To safely install this version, follow the below steps:
1.	Delete all site network services and network functions from the custom location.
2.	Uninstall the network function extension.
3.	Delete custom location
4.	Ensure repository access, if required, by updating the content delivery network (CDN) to permit the endpoint linuxgeneva-microsoft.azurecr.io on port 443. This step can be skipped if a wildcard is used or if running Nexus 3.12 or later.
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


## Release 2408.01
This 2408.01 Azure Operator Service Manager release includes updating the NFO version to 2.0.2777-132.

### Release Details
* NFO Release Version: 2.0.2777-132
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

## Release 2408.02

Document Revision 1.1

### Release Summary
Azure Operator Service Manager is a cloud orchestration service that enables automation of operator network-intensive workloads, and mission critical applications hosted on Azure Operator Nexus. Azure Operator Service Manager unifies infrastructure, software, and configuration management with a common model into a single interface, both based on trusted Azure industry standards. This 2408.02 Azure Operator Service Manager release includes updating the NFO version to 2.0.2783-134, the details of which are further outlined in the remainder of this document.

### Release Details
* NFO Release Version: 2.0.2783-134
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

## Release 2408.03
This 2408.03 Azure Operator Service Manager release includes updating the NFO version to  2.0.2788-135.

### Release Details
* NFO Release Version: Version 2.0.2788-135
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

## Release 2408.04
This 2408.04 Azure Operator Service Manager release includes updating the NFO version to 2.0.2804-137.

### Release Details
* NFO Release Version: Version 2.0.2804-137
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

## Release 2409.01
This 2409.01 Azure Operator Service Manager release includes updating the NFO version to 2.0.2810-144.

### Release Details
* NFO Release Version: Version 2.0.2810-144
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

## Release 2410.01
This 2410.01 Azure Operator Service Manager release includes updating the NFO version to 2.0.2847-158.

### Release Details
* NFO Release Version: Version 2.0.2847-158
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

## Release 2410.02
This 2410.02 Azure Operator Service Manager release includes updating the NFO version to 2.0.2860-160.

### Release Details
* NFO Release Version: Version 2.0.2860-160
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

## Release 2411.01
This 2411.01 Azure Operator Service Manager release includes updating the NFO version to 2.0.2875-165.

### Release Details
* NFO Release Version: Version 2.0.2875-165
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

## Release 2502.01
This 2502.01 Azure Operator Service Manager release includes updating the NFO version to 2.0.2976-178.

### Release Details
* NFO Release Version: Version 2.0.2976-178
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

## Release 2503.01
This 2503.01 Azure Operator Service Manager release includes updating the NFO version to 2.0.2985-184.

### Release Details
* NFO Release Version: Version 2.0.2985-184
* Release Date: March 6, 2025
* Is NFO update required: YES, Update only
* Dependency Versions: Go/1.22.4 - Helm/3.15.2

> [!WARNING]
> This release has been found to contain flaws and should not be used. Please use 2.0.2987-186 instead.

## Release 2503.02
This 2503.02 Azure Operator Service Manager release includes updating the NFO version to 2.0.2987-186.

### Release Details
* NFO Release Version: Version 2.0.2987-186
* Release Date: March 10, 2025
* Is NFO update required: YES, Update only
* Dependency Versions: Go/1.22.4 - Helm/3.15.2

#### Bugfix Related Updates
The following bug fixes, defect resolutions, or usability improvements are delivered with this release, for either Network Function Operator (NFO) or resource provider (RP) components.

* NFO - Cluster Registry Image Corruption Auto-Recovery [2502220010001187]: Sometimes, images in the cluster registry become corrupted due to failures during the download process. This results in all subsequent retry attempts for that image failing. This solution detects corrupted images, removes broken Docker image links, and ensures that future retries can successfully download the image.
* NFO - Avoid performing an unnecessary image copy when the image is already present in the cluster registry: This update eliminates redundant image downloads when the Artifact Controller pod crashes or becomes temporarily unavailable due to network issues. If the image is already present in the cluster registry, the system will now bypass unnecessary copies, improving efficiency and reducing resource consumption.
* NFO - Increase oras download concurrency count [ICM602686818]: This update increases the concurrency setting in ORAS, enhancing parallel processing and improving download speed.

## Release 2503.03
This 2503.03 Azure Operator Service Manager release includes updating the NFO version to 3.0.3007-208.

### Release Details
* NFO Release Version: Version 3.0.3007-208
* Release Date: March 31, 2025
* Is NFO update required: YES, Update only
* Dependency Versions: Go/1.22.4 - Helm/3.15.2

#### Release Updates
The following bug fixes, defect resolutions, or usability improvements are delivered with this release, for either Network Function Operator (NFO) or resource provider (RP) components.

* NFO - [602686818] Expose new installation parameter to set cluster registry CPU and memory resources to "small", "medium" or "large" scale option.
* NFO - [602686818] Tune ORAS concurrency settings for improved performance and resource utilization for all scale options.

## Release 2503.04
This 2503.04 Azure Operator Service Manager release includes updating the NFO version to 3.0.3009-210. This release is a hotfix to be applied only to systems presently running release 2503.03.

### Release Details
* NFO Release Version: Version 3.0.3009-210
* Release Date: November 19, 2025
* Is NFO update required: YES, Update only
* Dependency Versions: Go/1.22.4 - Helm/3.15.2

#### Release Updates
The following bug fixes, defect resolutions, or usability improvements are delivered with this release, for either Network Function Operator (NFO) or resource provider (RP) components.

* NFO - [316979] Run Update CA trust command on container host to accelerate bootstrapping of new TLS CA.
* NFO - [358268] Remove pre-upgrade hook in webhook to prevent NFO upgrade failures.
* NFO - [408044] Change maxAvailable for tls-daemonset to restart even when cluster has notReady nodes.

## Release 2505.01
This 2505.01 Azure Operator Service Manager release includes updating the NFO version to 3.0.3054-214 and the RP version to 1.0.03050.424.

### Release Details
* NFO Release Version: 3.0.3054-214
* RP Release Version: 1.0.03050.424
* Release Date: May 19, 2025
* Is NFO update required: YES, Update only
* Dependency Versions: Go/1.24.3 - Helm/3.17.2

### Release Highlights
#### Support for artifact-manifest publisher template
**[FEATURE 1041747 / ART-399]** adds support for the new artifact-manifest publisher template first introduced in RP API version 2025-03-30. This template improves efficiency of publisher resource cleanup, enabling the safe bulk deletion of unused resources to automate publisher artifact-store space management. The extension remains backward compatible with earlier API versions and existing workflows. Note: When upgrading a site network service (SNS) deployed using an older API version, to this new version, a pod restart is required, following the upgrade, to ensure the local registry remains in-sync with the publisher artifact-store. If the local registry is not brought in-sync, the SNS may not function in a disconnected scenario.

#### Release Updates
The following bug fixes, defect resolutions, or usability improvements are delivered with this release, for either Network Function Operator (NFO) or resource provider (RP) components.

* NFO - [2117907] The TLS daemonset was updated to pre-load required packages during build time. This reduces startup latency and avoids unnecessary network traffic.
* NFO - [SFI] Helm version upgrade from 3.15.2 to 3.17.2.
* NFO - [SFI] Go version upgrade from 1.22.4 to 1.24.3.
* NFO - [SFI] Base image migrated from CBL-Mariner to AzureLinux.
* NFO - [SFI] A total of 15 CVEs are addressed in this release.
* RP - [606065291] Fixes conflict scenarios during SNS delete operations by preventing duplicate requests.
* RP - [600962417] Populate Chart Details in DeploymentProfile when ConfigurationType is "Secret"

## Release 2508.01
This 2508.01 Azure Operator Service Manager release includes updating the NFO version to 3.0.3131-220 and the RP version to 1.0.03134.469.

### Release Details
* NFO Release Version: 3.0.3131-220,
* RP Release Version: 1.0.03134.469
* Release Date: August 8, 2025
* Is NFO update required: YES, Update only
* Dependency Versions: Go/1.24.3 - Helm/3.17.3 - Base Image/AzureLinux 3.0

#### Release Updates
The following bug fixes, defect resolutions, or usability improvements are delivered with this release, for either Network Function Operator (NFO) or resource provider (RP) components.

* NFO - [1041747] Improves support for publisher cleanup feature, fixing stability issues and addressing corner-cases such as disconnected mode.
* NFO - [2217456] Migrates AOSM extension images to MCR source, including cluster registry and geneva images.
* NFO - [2209250] Fixes cluster registry file corruption in broken manifest link, NFO now handles such failures and auto-recovers so the deletes can succeed.
* NFO - [2278364] Fixes behavior where upgrade fails due to a pre-upgrade hook stuck on bad node, removing the hook which is no longer needed.
* NFO - [2196085] Remediates file system security vulnerability with TLS-Daemonset by allowing only ReadOnlyRootFilesystem access.
* RP - [2236853] 1ES Operation Vulnerabilities.
* RP - [2034803] Clean up of RP resources and unused files for decom'ed regions.
* RP - [2217454] Clean up of redundant and old runners.
* RP - [2217437] Fixes NFO component rollback timeout issue.
* RP - [2217439] Fixes SNS retry policy on workload forbidden error.
* RP - [2275730] Fixes batch scope token provisioning timeout.
* RP - [2278044] Fixes NF DTF scheduling failure where timeout now exceeds 7 days.

#### Security Related Updates
* NFO - [CVE] A total of 2 CVEs are addressed in this release.
* NFO - [SFI] Helm version upgraded from 3.17.2 to 3.17.3
* RP - [SFI] 2236914: MISE Upgrade
* RP - [SFI] 2120797: Migrate to MISE/SNI
* RP - [SFI] 2154940: Security Code Bugs

## Release 2509.01
This 2509.01 Azure Operator Service Manager release includes updating the NFO version to 3.0.3194-224 and the RP version to 1.0.03180.486.

### Release details
* NFO Release Version: 3.0.3194-224
* RP Release Version: 1.0.03180.486
* CLI Extension Release Version: 2.0.0b3
* Release Date: September 30, 2025
* Is NFO update required: YES, Update only
* Dependency Versions: Go/1.24.3 - Helm/3.18.4 - Base Image/AzureLinux 3.0

### Release feature highlights

#### Support for interruption of service deployments
**[FEATURE 2069409 / ART-465]** introduces a method to interrupt a broken service deployment operation while in a nonterminal state. Supporting only container network functions, the interruption is triggered by applying a static tag to the network function managed resource group. This tag must later be removed to restore proper service operations. This feature provides a mechanism for customer operation teams to terminate a deployment which maybe negatively impacting service performance and otherwise could take multiple hours to reach a terminal state. For more information, see our [learn documentation](how-to-cancel-service-deployments.md).

#### Support for publisher artifact store resiliency
**[FEATURE 2129209 / ART-535]** introduces artifact store geo-resiliency between the backing ACR resources in two Azure regional location pairs. Once enabled, the artifact-store resource now  survives a single region failure, continuing to operate in read-only mode from the hot standby instance. Seamless integration with Azure Operator Service Manager's cluster registry, combined with centralized management of registry pairs, make artifact store resiliency to get and keep running. For more information, see our [learn documentation](publisher-artifact-store-resiliency.md).

### Release updates to improve quality
The following bug fixes, defect resolutions, or usability improvements are delivered with this release, for either Network Function Operator (NFO) or resource provider (RP) components.
* NFO - [381571] Cleanup of unused infrastructure scripts.
* NFO - [373116] Update of Msi-Adapter service.
* NFO - [372479] Managed Identity support for ACR authentication.
* NFO - [2275729] Fix to prevent instability when encountering untagged container images.
* RP  - [2326576] Support for artifact-store geo-replication.
* RP  - [2327070] Support for interruption of service deployments.
* RP  - [2388664] Fix for West Central US region test operations.
* RP  - [2309471] For to create ACR Names in lower case only.

### Release updates to improve security
* NFO - [CVE] A total of 2 CVEs are addressed in this release.
* NFO - [383549] Helm version 3.18.4 downgrade (from 3.18.5).
* RP  - [2301086] Secure Code Bugs-RP.
* RP  - [2313679] 1ES Operational Vulnerabilities.
