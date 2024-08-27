---
title: Azure Container Storage enabled by Azure Arc FAQ and release notes (preview)
description: Learn about new features and known issues in Azure Container Storage enabled by Azure Arc.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.date: 08/26/2024

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

### Encryption

#### What types of encryption are used by Azure Container Storage enabled by Azure Arc?

There are three types of encryption that might be interesting for an Azure Container Storage enabled by Azure Arc customer:

- **Cluster to Blob Encryption**: Data in transit from the cluster to blob is encrypted using standard HTTPS protocols. Data is decrypted once it reaches the cloud.
- **Encryption Between Nodes**: This encryption is covered by Open Service Mesh (OSM) that is installed as part of setting up your Azure Container Storage enabled by Azure Arc cluster. It uses standard TLS encryption protocols.
- **On Disk Encryption**: This is encryption at rest. This is not currently offered by Azure Container Storage enabled by Azure Arc.

#### Is data encrypted in transit?

Yes, data in transit is encrypted using standard HTTPS protocols. Data is decrypted once it reaches the cloud.

#### Is data encrypted at REST?

Currently, there is no encryption for data at REST.

### ACStor Triplication

#### What is ACStor triplication?

ACStor triplication stores data across three different nodes, each with its own hard drive. This intended behavior ensures data redundancy and reliability.

#### Can ACStor triplication occur on a single physical device?

No, ACStor triplication is not designed to operate on a single physical device with three attached hard drives.

## Next steps

[Azure Container Storage enabled by Azure Arc overview](overview.md)
