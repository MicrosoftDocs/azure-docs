---
title: Azure Operator Service Manager Release Notes
description: Tracking of notes for major and minor release of AOSM.
author: msftadam
ms.author: adamdor
ms.date: 08/09/2024
ms.topic: release-notes
ms.service: azure-operator-service-manager
---

# Release Notes

This pages contains major and minor releas for Azure Operator Service Manager

## Overview

The following release notes are presently generally available:

[Release Notes for Version 2.0.2763-119 7/31/24](https://github.com/msftadam/azure-docs-pr/edit/patch-2/articles/operator-service-manager/release-notes.md?pr=%2FMicrosoftDocs%2Fazure-docs-pr%2Fpull%2F284200#731-release)

## Release 2.0.2763-119 - 7/31 

Azure Operator Service Manager Release Notes
7/31/2024 – Document Version 1.5

### Release Summary
Azure Operator Service Manager is a cloud orchestration service that enables automation of operator network-intensive workloads, and mission critical applications hosted on Azure Operator Nexus.  Azure Operator Service Manager unifies infrastructure, software and configuration management with a common model into a single interface, both based on trusted Azure industry standards.
This 07-31-2024 Azure Operator Service Manager release includes updating the NFO version to 2.0.2763-119, the details of which are further outlined in the remainder of this document.

### Release Details
* Release Version: 2.0.2763-119
* Release Date: 07-31-2024

### Release Installation
**[BREAKING CHANGE INSTALLATION]** This is a major version release which includes a breaking change. To safely install this version, please follow the steps:
1.	Delete all site network services and network functions from the custom location.
2.	Uninstall the network function extension: 
3.	Delete custom location
4.	_If Required:_ Update the CSN to whitelist the endpoint: "linuxgeneva-microsoft.azurecr.io" port 443. This step can be skipped if a wildcard is being used or if running Nexus 3.12 or later.
5.	Install the network function extension
    - For further reference, complete extension syntax in Appendix B.
6.	Create custom location
7.	Redeploy site network services and network functions to the custom location.

For more Azure Operator Service Manager documentation, please visit; <br> [Azure Operator Service Manager Documentation | Microsoft Learn](https://learn.microsoft.com/en-us/azure/operator-service-manager/)

### Release Attestation
This release has been produced in accordance with Microsoft’s Secure Development Lifecycle, including processes for authorizing software changes, antimalware scanning, and scanning and mitigating security bugs and vulnerabilities.”

### Release Highlights
#### Cluster Registry & Webhook – High Availability 
Introduced in this release is an enhancement of the cluster registry and webhook service to support high availability operations.  When enabled, this replaces the singleton pod, used in earlier releases, with a replica set and optionally allows for horizontal auto scaling. Other notable improvements include:
* Changing registry storage volume from "nexus-volume" to "nexus-shared"
* Implementing options to allow for the future deletion of the extension with minimal impact.
* Adds tracking references for cluster registry container images usage

The following new parameters are now available, and should be appropriately set, when creating the network function extension using the “az k8s-extension” command.

--config global.networkfunctionextension.clusterRegistry.highAvailability.enabled=
This configuration will provision the cluster registry in high availability mode, if enabled.
By default, uses NAKS nexus-shared volume on AKS.
Accepted values: true, false.
Default value: true.

--config global.networkfunctionextension.clusterRegistry.autoScaling.enabled=
This configuration will provision the cluster registry pods with horizontal auto scaling.
Accepted values: true, false.
Default value: true.

--config global.networkfunctionextension.webhook.highAvailability.enabled=
This configuration will provision multiple replicas of webhook for high availability.
Accepted values: true, false.
Default value: true.

--config global.networkfunctionextension.webhook.autoScaling.enabled=
This configuration will provision the webhook pods with horizontal auto scaling.
Accepted values: true, false.
Default value: true.

#### Safe Upgrades – Downgrade to Lower Version 
With this release a SNS re-put operation now supports downgrading a network function to a lower version.  The downgrade re-put operation uses the “helm update” method and is not the same as a rollback operation.  Downgrade operations support the same capabilities as upgrades, such as atomic parameter, test-option parameters and pause-on-failure behavior.

### Issues Resolved in This Release 

#### Bugfix Related Updates
The following bugfixes, or other defect resolutions, have been delivered with this release.

* NFO	- Fix for Out Of Memory(OOM) condition in artifact-controller pod when installing fed-smf with Cluster Registry.
* NFO	- Prevent mutation of non-AOSM managed pods within "kube-system" namespace. AT&T can use the default value for the new parameter to selectively apply mutations to AOSM-managed pods. (see Appendix B)
* NFO	- Improved logging, fixing situations where logs were being dropped
* NFO	- Tuning of memory and CPU resources, to limit resource consumption.

#### Security Related Updates
Through Microsoft’s Secure Future Initiative | Microsoft, the Nexus product has introduced the following security focused enhancements in this release and will continue to do so in future releases.

* NFO	- Signing of helm package used by network function extension.
* NFO	- Signing of core image used by network function extension.
* NFO	- Use of Cert-manager for service certificate management and rotation.  This change can result in failed SNS deployments if not properly reconciled.  For guidance on the impact of this change, see Appendix C.
* NFO	- Automated refresh of AOSM certificates during extension installation.
* NFO	- A dedicated service account for the pre-upgrade job to safeguard against modifications to the existing network function extension service account.
* RP - The service principles (SPs) used for deploying site & NF now require “Microsoft.ExtendedLocation/customLocations/read” permission.  The SP's which deploy day N scenario now require "Microsoft.Kubernetes/connectedClusters/listClusterUserCredentials/action" permission. This change can result in failed SNS deployments if not properly reconciled
* CVE	- The following CVE’s are addressed in this release: CVE-2019-25210, CVE-2024-2511, CVE-2023-42366, CVE-2024-4603, CVE-2023-42363

### Appendix A
#### Detailed Syntax to Create NF Extension
az k8s-extension create --cluster-name
                        --cluster-type {connectedClusters}
                        --extension-type {Microsoft.Azure.HybridNetwork}
                        --name
                        --resource-group
                        --scope {cluster}
                        --release-namespace {azurehybridnetwork}
                        --release-train {preview, stable}
                        --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator
                        [--auto-upgrade {false, true}]
                        [--config global.networkfunctionextension.enableClusterRegistry={false, true}]
                        [--config global.networkfunctionextension.enableLocalRegistry={false, true}]
                        [--config global.networkfunctionextension.enableEarlyLoading={false,true}]
                        [--config global.networkfunctionextension.clusterRegistry.highAvailability.enabled={true, false}]
                        [--config global.networkfunctionextension.clusterRegistry.autoScaling.enabled={true, false}]
                        [--config global.networkfunctionextension.webhook.highAvailability.enabled={true, false}]
                        [--config global.networkfunctionextension.webhook.autoScaling.enabled={true, false}]
                        [--config global.networkfunctionextension.clusterRegistry.storageClassName=]
                        [--config global.networkfunctionextension.clusterRegistry.storageSize=]
                        [--config global.networkfunctionextension.webhook.pod.mutation.matchConditionExpression=]
                        [--version]

#### Required Parameters

--cluster-name -c
Name of the Kubernetes cluster.

--cluster-type -t
Specify Arc clusters or AKS managed clusters or Arc appliances or provisionedClusters.
Accepted values: connectedClusters.

--extension-type
Name of the extension type.
Accepted values: Microsoft.Azure.HybridNetwork.

--name -n
Name of the extension instance.

--resource-group -g
Name of resource group. You can configure the default group using az configure --defaults group=.
--config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator
This configuration must be provided.

#### Optional Parameters

--auto-upgrade
Automatically upgrade minor version of the extension instance.
Accepted values: false, true.
Default value: true.

--release-train
Specify the release train for the extension type.
Accepted values: preview, stable.
Default value: stable.

--version
Specify the version to install for the extension instance if --auto-upgrade-minor-version is not enabled.
Availabe version can be found on Network Function Extension Release notes

#### Optional feature specific configurations

**Pod Mutating Webhook**

--config global.networkfunctionextension.webhook.pod.mutation.matchConditionExpression=
This configuration is an optional parameter. It comes into play when CNF is getting installed and as a part of its installation corresponding pods are spin up in the CNF's release namespace.  This configuration configures more granular control on top of rules and namespaceSelectors defined in Pod Mutating Webhook Configuration.

Default value:
"((object.metadata.namespace != \"kube-system\") ||  (object.metadata.namespace == \"kube-system\" && has(object.metadata.labels) && (has(object.metadata.labels.app) && (object.metadata.labels.app == \"commissioning\") || (has(object.metadata.labels.name) && object.metadata.labels.name == \"cert-exporter\") || (has(object.metadata.labels.app) && object.metadata.labels.app == \"descheduler\"))))"

The above matchCondition implies that the pods getting admitted in kube-system namespace will be mutated only if they have atleast one of the following labels:
app == "commissioning"
name == "cert-exporter"
app == "descheduler"
else they will not be mutated and continue to be pulled from the original.
Accepted value: Any valid CEL expressions
To learn more about matchConditions reference Kubernetes doc link.

This configuration parameter can be set or updated during NF Extension's installation or update.
Also, this condition comes into play only when the CNF/Component/Application is getting installed into the namespace as per the rules and namespaceSelectors defined in Pod Mutating Webhook Configuration. If there are more pods getting spin up in that namespace, this condition will still be applied to them.

**Cluster registry**

--config global.networkfunctionextension.enableClusterRegistry=
This configuration will provision a regsitry in the cluster to locally cache artifacts.
By default this will enable lazy loading mode unless global.networkfunctionextension.enableEarlyLoading=true.
Accepted values: false, true.
Default value: false.

--config global.networkfunctionextension.clusterRegistry.highAvailability.enabled=
This configuration will provision the cluster regsitry in high availability mode if cluster registry is enabled.
By default is true and uses NAKS nexus-shared volume on AKS recommendation is to set this as false.
Accepted values: true, false.
Default value: true.

--config global.networkfunctionextension.clusterRegistry.autoScaling.enabled=
This configuration will provision the cluster registry pods with horizontal auto scaling.
Accepted values: true, false.
Default value: true.

--config global.networkfunctionextension.webhook.highAvailability.enabled=
This configuration will provision multiple replicas of webhook for high availability.
Accepted values: true, false.
Default value: true.

--config global.networkfunctionextension.webhook.autoScaling.enabled=
This configuration will provision the webhook pods with horizontal auto scaling.
Accepted values: true, false.
Default value: true.

--config global.networkfunctionextension.enableEarlyLoading=
This configuration will enable artifacts early loading into cluster regsitry before helm installation or upgrade.
This configuration can only be enabled when global.networkfunctionextension.enableClusterRegistry=true.
Accetped values: false, true.
Default value: false.

--config global.networkfunctionextension.clusterRegistry.storageClassName=
This configuration must be provided when global.networkfunctionextension.enableClusterRegistry=true.
NetworkFunctionExtension will provision a PVC to local cache artifacts from this storage class.
Platform specific values
AKS: managed-csi
NAKS(Default): nexus-shared
NAKS(Non-HA): nexus-volume
ASE: managed-premium
Default value: nexus-shared.

--config global.networkfunctionextension.clusterRegistry.storageSize=
This configuration must be provided when global.networkfunctionextension.enableClusterRegistry=true.
This configuration configures the size we reserve for cluster registry.
Recommend carefully choose a value that needed to cache artifacts.
Please notes to use unit as Gi and Ti for sizing. 
Default value: 100Gi
Side loading

--config global.networkfunctionextension.enableLocalRegistry=
This configuration will allow artifacts to be delivered to edge via hardware drive.
It is only used for Tempnet with AP5GC.
Accepted values: false, true.
Default value: false.
Recommended NFO config for AKS
The default NFO config is configured for HA on NAKS as none of the csi disk drives on AKS support ReadWriteX access mode, HA needs to be disabled on AKS.Use the following config options on AKS

--config global.networkfunctionextension.clusterRegistry.highAvailability.enabled=false--config global.networkfunctionextension.webhook.highAvailability.enabled=false (optional)--config global.networkfunctionextension.clusterRegistry.storageClassName=managed-csi

#### Examples

Create a network function extension with auto upgrade.

az k8s-extension create --resource-group myresourcegroup --cluster-name mycluster --name myextension --cluster-type connectedClusters --extension-type Microsoft.Azure.HybridNetwork --scope cluster --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator --release-namespace azurehybridnetwork

Create a network function extension with a pined version.

az k8s-extension create --resource-group myresourcegroup --cluster-name mycluster --name myextension --cluster-type connectedClusters --extension-type Microsoft.Azure.HybridNetwork --auto-upgrade-minor-version false --scope cluster --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator --release-namespace azurehybridnetwork --version <put-version-value-here>

Create a network function extension with cluster registry (default lazy loading mode) feature enabled on NAKS.

az k8s-extension create --resource-group myresourcegroup --cluster-name mycluster --name myextension --cluster-type connectedClusters --extension-type Microsoft.Azure.HybridNetwork --scope cluster --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator --release-namespace azurehybridnetwork --config global.networkfunctionextension.enableClusterRegistry=true --config global.networkfunctionextension.clusterRegistry.storageSize=100Gi

Create a network function extension with cluster registry (default lazy loading mode) feature enabled on AKS.

az k8s-extension create --resource-group myresourcegroup --cluster-name mycluster --name myextension --cluster-type connectedClusters --extension-type Microsoft.Azure.HybridNetwork --scope cluster --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator --release-namespace azurehybridnetwork --config global.networkfunctionextension.enableClusterRegistry=true --config global.networkfunctionextension.clusterRegistry.highAvailability.enabled=false --config global.networkfunctionextension.clusterRegistry.storageClassName=managed-csi --config global.networkfunctionextension.clusterRegistry.storageSize=100Gi

Create a network function extension with cluster registry (early loading) feature enabled.

az k8s-extension create --resource-group myresourcegroup --cluster-name mycluster --name myextension --cluster-type connectedClusters --extension-type Microsoft.Azure.HybridNetwork --scope cluster --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator --release-namespace azurehybridnetwork --config global.networkfunctionextension.enableClusterRegistry=true --config global.networkfunctionextension.enableEarlyLoading=true --config global.networkfunctionextension.clusterRegistry.storageClassName=managed-csi --config global.networkfunctionextension.clusterRegistry.storageSize=100Gi

Create a network function extension with side loading feature enabled.

az k8s-extension create --resource-group myresourcegroup --cluster-name mycluster --name myextension --cluster-type connectedClusters --extension-type Microsoft.Azure.HybridNetwork --scope cluster --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator --release-namespace azurehybridnetwork --config global.networkfunctionextension.enableLocalRegistry=true

### Appendix B
#### Cert-manager Usage Guidance for NEPS
With this release, AOSM now uses cert-manager to store and rotate certificates. As part of this change, AOSM deploys a cert-manager operator, and associate CRDs, in the azurehybridnetwork namespace. Since having multiple cert-manager operators, even deployed in separate namespaces, will watch across all namespaces, only one cert-manager can be effectively run on the cluster.

Any user trying to install cert-manager on the cluster, as part of a workload deployment, will get a deployment failure with an error that the CRD “exists and cannot be imported into the current release.”  To avoid this error, the recommendation is to skip installing cert-manager, instead take dependency on cert-manager operator and CRD already installed by AOSM.

#### Other Configuration Changes to Consider
In addition to disabling the NfApp associated with the old user cert-manager, we have found other changes may be needed.
1.	If any other NfApps have DependsOn references to the old user cert-manager NfApp, these will need to be removed. 
2.	If any other NfApps reference the old user cert-manager namespace value, this will need to be changed to the new azurehybridnetwork namespace value.  

#### Cert-Manager Version Compatibility & Management
For the cert-manager operator, our current deployed version is 1.14.5.  Users should test for compatibility with this version.  Future cert-manager operator upgrades will be supported via the NFO extension upgrade process. 

For the CRD resources, our current deployed version is 1.14.5.  Users should test for compatibility with this version.  Since management of a common cluster CRD is something typically handled by a cluster administrator, we are working to enable CRD resource upgrades via standard Nexus Add-on process.
