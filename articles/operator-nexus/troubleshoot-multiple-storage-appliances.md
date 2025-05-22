---
title: Troubleshooting common issues with multiple Storage Appliances
description: Troubleshooting common issues with multiple Storage Appliances
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 05/22/2024
ms.author: peterwhiting
author: pjw711
---

# Troubleshooting common issues with multiple Storage Appliances

This guide documents common issues encountered in Azure Operator Nexus environments with multiple storage appliances.

## Failure to create the storage appliance

There are several common misconfigurations that prevent the second storage appliance from deploying successfully. Symptoms include:

- The [cluster creation](./howto-configure-cluster.md#create-a-cluster) step failing.
- The cluster creation step succeeding, but only creating a single storage appliance resource.

If you see these issues, perform these checks:

- Confirm that you correctly configured the prerequisites for both storage appliances. The initial IP address configuration is different for each storage appliance. See [the platform prerequisites](./howto-platform-prerequisites.md) for the correct configuration.
- Confirm that Network Fabric Controller and Network Fabric are successfully provisioned.
- Confirm that you have opened a support ticket to enable Network Fabric support for the second storage appliance. Confirm the ticket has been closed.
- Check that the Azure CLI command you ran included the configuration for the second storage appliance and specified an aggregator rack SKU that supports a second storage appliance. See [cluster creation with multiple storage appliances](./howto-configure-cluster.md#create-the-cluster-using-azure-cli---multiple-storage-appliances) for details.

If any of the configurations was incorrect:

- Delete the Nexus cluster
- Apply the correct initial storage appliance configuration and/or open a support ticket for Network Fabric enablement
- Recreate the cluster with the correct configuration.

## Nexus-volume Persistent Volume Claim (PVC) on the wrong storage appliance

PVCs using the nexus-volume storage class can select the storage appliance to use for backing storage using the `storageApplianceName` annotation. If this annotation isn't present, the PVC uses the first storage appliance. You can check this by using `kubectl get pvc <pvcName> -o yaml` and checking the `storageApplianceName` annotation. The value tells you which storage appliance the PVC is using.

If you wanted to create the PVC on the other storage appliance then you must delete and recreate the PVC, and then provide the correct annotation. There's no support for moving the volumes consumed by a PVC between storage appliances.

## Failure to create nexus-volume PVC

A PVC fails to create if the `storageApplianceName` annotation is present but doesn't match the Azure Resource name of a storage appliance managed by the Nexus Cluster. You can check that the `storageApplianceName` annotation is correct by:

1. Opening the Cluster (Operator Nexus) resource in the Azure portal
1. Clicking on Rack definitions in the resource menu.
1. Navigating to the aggregator rack and selecting Storage Appliance definitions.

The `storageApplianceName` annotation must match one of the storage appliances in the Storage Appliance definitions list. You must delete the PVC and recreate it with the correct annotation to resolve this issue.

## Cloud Service Network (CSN) fails to create

A CSN fails to create if the `storageApplianceName` Azure resource tag is present but doesn't match the Azure Resource name of a storage appliance managed by the Nexus Cluster. You can check that the `storageApplianceName` Azure resource tag is correct by:

1. Opening the Cluster (Operator Nexus) resource in the Azure portal
1. Clicking on Rack definitions in the resource menu.
1. Navigating to the aggregator rack and selecting Storage Appliance definitions.

The `storageApplianceName` Azure resource tag must match one of the storage appliances in the Storage Appliance definitions list. You must delete the CSN and recreate it with the correct Azure Resource tag to resolve this issue.
