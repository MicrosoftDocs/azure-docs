---
author: rajsinghmsa
ms.author: singra
ms.topic: include
ms.date: 11/18/2026
ms.service: azure-storage-mover
---
<!-- 
!########################################################

ATTENTION: 
This is an include for several Storage Mover articles.
Handle file and content with care.

!########################################################
-->

The current Azure Storage Mover release supports full-fidelity migrations for specific source-target pair combinations. Always utilize the latest agent version to benefit from these supported sources and destinations:

| Type of migration | Source protocol | Target | Agent support | Comments |
|-------------------|-----------------|--------|---------------|----------|
| On-premises to Azure | SMB 2.x and 3.x mount | Azure file share (SMB) | Supports agent-based ([link](../storage-mover-create.md)) and agentless ([link](../agentless-on-premises-files-migration.md)) migrations | SMB 1.x sources and NFS Azure file shares are currently not supported.<br>Agentless migrations require private connectivity to the source SMB share and SMB credentials stored in Azure Key Vault. |
| On-premises to Azure | SMB 2.x and 3.x mount | Azure blob container | Supports agent-based ([link](../storage-mover-create.md)) and agentless ([link](../agentless-on-premises-files-migration.md)) migrations | Containers with Flatnamespace (FNS) and Hierarchical Namespace Service (HNS) feature enabled are supported and the ADLS Gen2 REST API set is used for migration.<br>Agentless migrations require private connectivity to the source SMB share and SMB credentials stored in Azure Key Vault. |
| On-premises to Azure | NFS 3 and 4 mount | Azure file share (NFS 4.1) | Supports agent-based ([link](../storage-mover-create.md)) and agentless ([link](../agentless-on-premises-nfs-migration.md)) migrations | NFS Azure file shares support NFS v3 and v4 source.<br>Agentless migrations (preview) require private connectivity to the source NFS share. |
| On-premises to Azure | NFS 3 and 4 mount | Azure blob container | Supports agent-based ([link](../storage-mover-create.md)) and agentless ([link](../agentless-on-premises-nfs-migration.md)) migrations | Agentless migrations (preview) require private connectivity to the source NFS share. |
| On-premises to Azure | S3-compatible object storage (Preview) | Azure blob container | Agentless ([link](../on-premises-s3-compatible-migration.md)) | Requires ExpressRoute or site-to-site VPN connectivity to the source. The source must expose an HTTPS endpoint with a fully qualified domain name and a publicly trusted, CA-signed TLS certificate, and must support AWS Signature Version 4 (SigV4) authentication. |
| Other clouds to Azure | AWS S3 | Azure blob container | Agentless ([link](../cloud-to-cloud-migration.md)) | AWS (Amazon Web Services) S3 buckets with Glacier or Glacier Deep Archive storage classes can't be migrated and need to be restored for Mover to migrate them. |
| Other clouds to Azure | AWS FSx – SMB (Preview) | Azure file share (SMB) | Agentless ([link](../amazon-files-azure-files-migration.md)) | Requires private network connectivity to the FSx SMB share and SMB credentials with access to the source share. |
| Other clouds to Azure | Google Cloud Storage (Preview) | Azure blob container | Agentless ([link](../google-migration.md)) | Ensure the GCS bucket is accessible through the S3-compatible API before migration. You must restore objects in archival storage classes before migration. |
| Other clouds to Azure | Oracle Cloud Infrastructure (OCI) Object Storage | Azure blob container | Agentless ([link](../oracle-cloud-azure-blob.md)) | Requires Customer Secret Keys for the OCI S3-compatible API. Only HTTPS access to the source is supported. |
| Intra-Azure | Azure blob container | Azure blob container | Agentless ([link](../azure-to-azure-migration.md)) | Blob containers can be in two different subscriptions and storage accounts as well as in different tenants. Supported containers include those with Flatnamespace (FNS) and Hierarchical Namespace Service (HNS) feature enabled. The migration uses the ADLS Gen2 REST API set. |
| Intra-Azure | Azure file share (SMB) (Preview) | Azure file share (SMB) | Agentless ([link](../azure-files-to-azure-files-copy.md)) | Source and target shares can be in different storage accounts, subscriptions, and regions. Preview access is enabled per subscription after sign-up, and the Azure portal is the only supported tool during the preview. |