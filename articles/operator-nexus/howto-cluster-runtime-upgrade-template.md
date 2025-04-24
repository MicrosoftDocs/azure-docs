---
title: "Azure Operator Nexus: Cluster runtime upgrade template"
description: Learn the process for upgrading Cluster for Operator Nexus with step-by-step parameterized template.
author: bartpinto 
ms.author: bpinto
ms.service: azure-operator-nexus
ms.date: 04/24/2025
ms.topic: how-to
ms.custom: azure-operator-nexus, template-include
---

# Cluster runtime upgrade template

This how-to guide provides a step-by-step template for upgrading a Nexus Cluster designed to assist users in managing a reproducible end-to-end upgrade through Azure APIs and standard operating procedures. Regular updates are crucial for maintaining system integrity and accessing the latest product improvements.

## Overview

**Runtime bundle components**: These components require operator consent for upgrades that may affect traffic behavior or necessitate server reboots. Nexus Cluster's design allows for updates to be applied while maintaining continuous workload operation.

Runtime changes are categorized as follows:
- **Firmware/BIOS/BMC updates**: Necessary to support new server control features and resolve security issues.
- **Operating system updates**: Necessary to support new Operating system features and resolve security issues.
- **Platform updates**: Necessary to support new platform features and resolve security issues.

## Prerequisites

1. Install the latest version of [Azure CLI](https://aka.ms/azcli).
2. The latest `networkcloud` CLI extension is required. It can be installed following the steps listed in [Install CLI Extension](howto-install-cli-extensions.md).
3. Subscription access to run the Azure Operator Nexus Network Fabric (NF) and Network Cloud (NC) CLI extension commands.
4. Target Cluster must be healthy in a running state.

## Required Parameters:
- <ENVIRONMENT> - Instance Name
- <AZURE_REGION> - Azure Region of Instance
- <CUSTOMER_SUB_NAME>: Subscription Name
- <CUSTOMER_SUB_TENANT_ID>  // From 'az account show'
- <CUSTOMER_SUB_ID>: Subscription ID
- <CLUSTER_NAME>: Cluster Name
- <CLUSTER_RG>: Cluster Resource Group
- <CLUSTER_RID>: Cluster ARM ID
- <CLUSTER_KEYVAULT_ID>: Cluster Keyvault ARM ID
- <CLUSTER_MRG>: Cluster Managed Resource Group
- <CLUSTER_CONTROL_BMM>: Cluster Control plane baremetalmachine
- <CLUSTER_RUNTIME_VERSION>: Runtime version for upgrade
- <START_TIME>: Planned start time of upgrade
- <DURATION>: Estimated Duration of upgrade
- <NFC_NAME>: Associated NFC
- <CM_NAME>: Associated CM
- <ETCD_LAST_ROTATION_DATE>: Control plane etcd credential last rotation date
- <ETCD_ROTATION_DAYS>: Control plane etcd credential next rotation period
- <FABRIC_NAME>: Associated Fabric
- <NEXUS_VERSION>: Target upgrade version

## Pre-Checks

1. Very last/next rotation date on etcd credential will not occur during upgrade on each control plane Bare Metal Machine (BMM):
   - Check in Azure portal from the following path: `Clusters` -> <CLUSTER_NAME> -> `Resources` -> `Bare Metal Machines`
   - Select each BMM with `control-plane` under the `Role`: <CLUSTER_CONTROL_BMM>  -> `JSON View`
   - Validate the `lastRotationTime` and `rotationPeriodDays` under the `etcd credential` section:
     ```
     {
	    "lastRotationTime": "<ETCD_LAST_ROTATION_DATE>",
        "rotationPeriodDays": <ETCD_ROTATION_DAYS>,
        "secretType": "etcd credential"
	 }
	 ```
	 
	 >[!Important]
     > If the upgrade will occur within three days of the next `etcd credential` rotation (<ETCD_LAST_ROTATION_DATE> + <ETCD_ROTATION_DAYS>), contact Miscrosoft Support to complete a manual rotation before starting the upgrade.
	 
2. Validate the provisioning and detailed status for the Cluster Manager (CM) and Cluster.
   
   Set up the subscription, CM, and Cluster parameters:
   ```  
   export SUBSCRIPTION_ID=<CUSTOMER_SUB_ID>
   export CM_RG=<CM_RG>
   export CM_NAME=<CM_NAME>
   export CLUSTER_RG=<CLUSTER_RG>
   export CLUSTER_NAME=<CLUSTER_NAME>
   ```

   Check that the CM is in `Succeeded` for `Provisioning state`:
   ```
   az networkcloud clustermanager show -g $CM_RG --resource-name $CM_NAME --subscription $SUBSCRIPTION_ID -o table
   ```

   Check the Cluster status `Detailed status` is `Running`:
   ```  
   az networkcloud cluster show -g $CLUSTER_RG --resource-name $CLUSTER_NAME --subscription $SUBSCRIPTION_ID -o table
   ```

   >[!Note]
   > If CM `Provisioning state` is not `Succeeded` and Cluster `Detailed status` is not `Running` stop the upgrade until issues are resolved.

3. Review Operator Nexus Release notes for required checks and configuration updates not included in this document.

