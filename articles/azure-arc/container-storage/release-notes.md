---
title: Azure Container Storage enabled by Azure Arc FAQ and release notes (preview)
description: Learn about new features and known issues in Azure Container Storage enabled by Azure Arc.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.date: 08/30/2024

---

# Azure Container Storage enabled by Azure Arc FAQ and release notes (preview)

This article provides information about new features and known issues in Azure Container Storage enabled by Azure Arc, and answers some frequently asked questions.

## Release notes

### Version 2.1.0-preview

- CRD operator
- Cloud Ingest Tunable Timers
- Uninstall during version updates
- Added regions: West US, West US 2, North Europe

### Version 1.2.0-preview

- Extension identity and OneLake support: Azure Container Storage enabled by Azure Arc now allows use of a system-assigned extension identity for access to blob storage or OneLake lake houses.
- Security fixes: security maintenance (package/module version updates).

### Version 1.1.0-preview

- Kernel versions: the minimum supported Linux kernel version is 5.1. Currently there are known issues with 6.4 and 6.2.

## FAQ

### Uninstall previous instance of the Azure Container Storage enabled by Azure Arc extension

#### If I installed the 1.2.0-preview or any earlier release, how do I uninstall the extension?

If you previously installed a version of Azure Container Storage enabled by Azure Arc earlier than **2.1.0-preview**, you must uninstall that previous instance in order to install the newer version.

> [!NOTE]
> The extension name for Azure Container Storage enabled by Azure Arc was previously **Edge Storage Accelerator**. If you still have this instance installed, the extension is referred to as **microsoft.edgestorageaccelerator** in the Azure portal.

1. Before you can delete the extension, you must delete your configPods, Persistent Volume Claims, and Persistent Volumes using the following commands in this order. Replace `YOUR_POD_FILE_NAME_HERE`, `YOUR_PVC_FILE_NAME_HERE`, and `YOUR_PV_FILE_NAME_HERE` with your respective file names. If you have more than one of each type, add one line per instance:

   ```bash
   kubectl delete -f "YOUR_POD_FILE_NAME_HERE.yaml"
   kubectl delete -f "YOUR_PVC_FILE_NAME_HERE.yaml"
   kubectl delete -f "YOUR_PV_FILE_NAME_HERE.yaml"
   ```

1. After you delete your configPods, PVCs, and PVs in the previous step, you can uninstall the extension using the following command. Replace `YOUR_RESOURCE_GROUP_NAME_HERE`, `YOUR_CLUSTER_NAME_HERE`, and `YOUR_EXTENSION_NAME_HERE` with your respective information:

   ```azurecli
   az k8s-extension delete --resource-group YOUR_RESOURCE_GROUP_NAME_HERE --cluster-name YOUR_CLUSTER_NAME_HERE --cluster-type connectedClusters --name YOUR_EXTENSION_NAME_HERE
   ```

1. If you installed the extension before the **1.1.0-preview** release (released on 4/19/24) and have a pre-existing `config.json` file, the `config.json` schema changed. Remove the old `config.json` file using `rm config.json`.

### Encryption

#### What types of encryption are used by Azure Container Storage enabled by Azure Arc?

There are three types of encryption that might be interesting for an Azure Container Storage enabled by Azure Arc customer:

- **Cluster to Blob Encryption**: Data in transit from the cluster to blob is encrypted using standard HTTPS protocols. Data is decrypted once it reaches the cloud.
- **Encryption Between Nodes**: This encryption is covered by Open Service Mesh (OSM) that is installed as part of setting up your Azure Container Storage enabled by Azure Arc cluster. It uses standard TLS encryption protocols.
- **On Disk Encryption**: Encryption at rest. Not currently supported by Azure Container Storage enabled by Azure Arc.

#### Is data encrypted in transit?

Yes, data in transit is encrypted using standard HTTPS protocols. Data is decrypted once it reaches the cloud.

#### Is data encrypted at REST?

Data persisted by the Azure Container Storage enabled by Azure Arc extension is encrypted at REST if the underlying platform provides encrypted disks.

### ACStor Triplication

#### What is ACStor triplication?

ACStor triplication stores data across three different nodes, each with its own hard drive. This intended behavior ensures data redundancy and reliability.

#### Can ACStor triplication occur on a single physical device?

No, ACStor triplication isn't designed to operate on a single physical device with three attached hard drives.

## Next steps

[Azure Container Storage enabled by Azure Arc overview](overview.md)
