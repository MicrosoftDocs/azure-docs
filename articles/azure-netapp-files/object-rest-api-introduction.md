---
title: Understand Azure NetApp Files object REST API
description: Learn about object REST API  access management for S3 workloads in Azure NetApp Files. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: concept-article
ms.date: 10/13/2025
ms.author: anfdocs
---
# Understand Azure NetApp Files object REST API (preview)

Azure NetApp Files supports the Object REST API, an S3-compatible REST API. The object REST API extends your file-based storage, enabling native S3 read and write access. You can integrate Azure NetApp Files with services including Azure AI Search, Microsoft Foundry, Azure Databricks, OneLake and more.

Object REST API allows you to present the same data set as a file hierarchy or as objects in a bucket. To do so, object REST API creates buckets that allow S3 clients to read, write, and enumerate files in network attached storage (NAS) storage using S3 object requests. This mapping conforms to the NAS security configuration, observing file and directory access permissions.

This mapping is accomplished by presenting a specified NAS directory hierarchy as an S3 bucket. Each file in the directory hierarchy is represented as an S3 object whose name is relative from the mapped directory downwards. Directory boundaries are represented by the slash character (/).

## Requirements and considerations

* Object REST API buckets are associated with volumes. Deleting the volume associated with a bucket permanently deletes the bucket. This action can't be undone. 
* Buckets are supported with cool access-enabled volumes and with large volumes. 
* You are responsible for maintaining the lifecycle of your bucket certificates. To check the expiration and renew certificates view the **Bucket** menu then check the **Certificate** status and **Certificate expiration date** fields. 
* You must enable diagnostic logging on all Azure Key Vaults to ensure audit trails are available for security investigations.
* You must configure network access control lists (ACLs) to restrict Key Vault access to only authorized networks (NetApp VNet and customer VNet).
* It is recommended to implement separate Azure Key Vaults for certificates (read-only access) and S3 credentials (write access) to adhere to the principle of least privilege.
* It is recommended to store Azure Key Vaults object references for certificates and credentials in separate buckets to maintain proper access control boundaries.
* Buckets are not supported on Azure NetApp Files cache volumes.


## Supported actions

- ListBucket
- ListObjects / ListObjectsV2
- GetObject
- PutObject
- DeleteObject
- HeadObject

## Next steps 

* [Configure object REST API access](object-rest-api-access-configure.md)