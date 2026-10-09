---
title: Secure your Azure Files
description: Learn how to secure classic and Microsoft.FileShares file shares with network controls, authentication, encryption, recovery, monitoring, and governance.
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-file-storage
ms.topic: best-practice
ms.custom: horz-security
ms.date: 10/03/2026
ai-usage: ai-assisted
# Customer intent: As an administrator using Azure Files, I want to implement file-share-specific security best practices.
---

# Secure your Azure Files

This article provides security guidance for Azure Files, including classic file shares created with Microsoft.Storage and file shares created with Microsoft.FileShares. It covers the resources that hold your shares, client access, data protection, and operational controls.

Security controls depend on the resource provider and protocol. For a comparison of supported features, see [Azure Files management concepts](files-management-concepts.md).

## Resource isolation
- **Treat the storage account as a trust boundary**: Creating separate classic file shares in the same storage account doesn't isolate their network rules, SMB identity source, or encryption key configuration. Changes to these account-level settings affect all shares in the account. Group classic shares together only when they can share these controls. Microsoft.FileShares avoids this shared account-level boundary by providing independent network and security configuration for each share.

- **Protect client systems**: A client with write access can modify or delete file data. Keep client operating systems updated and restrict local administrative access. Use endpoint protection appropriate to the client environment. Network isolation and encryption don't prevent an authorized client from making destructive changes.

## Network security

### Inbound access and outbound filtering
- **Limit inbound access to the clients that need it**: Both resource providers support private endpoints and service endpoints with virtual network restrictions. Access to NFS Azure file shares requires one of these paths. Classic SMB and FileREST clients can also use public endpoints with IP address rules. For configuration steps, see [Configure network endpoints for Azure file shares](storage-files-networking-endpoints.md).

- **Disable public access when it isn't needed**: Public endpoints can be used securely with network access controls, authentication, and encryption appropriate to the protocol. Keep public access enabled when your workloads require it and your security model permits it, including for connections through service endpoints. Creating a private endpoint doesn't automatically disable public access. For classic shares, review any trusted service or resource instance exceptions that can remain effective after public access is disabled. For more information, see [Restrict public endpoint access](storage-files-networking-endpoints.md#restrict-public-endpoint-access).

- **Enable trusted service access only when needed**: Available only for classic file shares, the trusted services setting lets supported Azure services bypass the storage account's network rules. Enable it only when an integration needs this access. These services must still be authorized to access your file data.

- **Optional filtering for service endpoint traffic**: When clients use service endpoints to access classic file shares, you can optionally apply a service endpoint policy to their subnet. The policy limits which storage accounts those clients can access through service endpoints, where traffic bypasses Azure Firewall and network virtual appliances. It applies only to service endpoint traffic and doesn't filter private endpoint traffic or other outbound paths. The destination's network rules and authorization requirements still apply. Microsoft.FileShares doesn't currently support these policies. Clients in a subnet with a policy must use a private endpoint to access Microsoft.FileShares shares. For more information, see [Service endpoint policies](storage-files-networking-overview.md#restrict-outbound-access-with-service-endpoint-policies).

- **Check protocol support before using a network security perimeter**: For classic shares, perimeter support differs by protocol and authentication method. In Enforced mode, a perimeter denies NFS access through the public endpoint, including service endpoint traffic. Private endpoint traffic is outside perimeter enforcement. Check the restrictions for Azure Backup and Azure File Sync before applying a perimeter. For more information, see [Network security perimeter for Azure Files](files-network-security-perimeter.md).

### SMB protocol hardening

These recommendations apply to classic SMB file shares.

- **Require SMB channel encryption**: Use encrypted SMB 3.x connections. SMB 2.1 doesn't support channel encryption. The HTTPS requirement for FileREST doesn't replace the SMB encryption configuration. For more information, see [SMB encryption and security settings](files-smb-protocol.md#smb-security-settings).

- **Restrict protocol versions and algorithms to those your clients need**: Use the most secure SMB profile compatible with your workloads. Verify client support before requiring SMB 3.1.1 or AES-256-GCM, because incompatible clients can't connect. SMB channel encryption and Kerberos ticket encryption are separate controls. For more information, see [SMB security settings](files-smb-protocol.md#smb-security-settings).

- **Limit SMB authentication methods**: Use Kerberos for identity-based access. If no clients need storage account key authentication over SMB, remove NTLMv2 from the allowed SMB authentication methods after testing. This control applies to SMB; it doesn't disable key-based FileREST access.

- **Maintain AD DS credentials where applicable**: For AD DS authentication, manage the password of the directory principal that represents the storage account according to your directory policy. Follow the documented rotation procedure to keep the directory password and storage account Kerberos key synchronized. For more information, see [Update the storage account identity password in AD DS](storage-files-identity-ad-ds-update-password.md).

### NFS 4.1 file shares

These recommendations apply to NFS file shares with either resource provider. NFS uses network-based authentication and POSIX permissions, not SMB identity-based authentication.

- **Limit access to trusted networks**: Allow only the subnets and private connections needed by the workload. NFS relies on the identities presented by the client, so control which systems and administrators can use those connections.

- **Manage POSIX permissions and client identities**: Use consistent user IDs and group IDs across clients. Restrict file and directory permissions to the users and groups that need access. Azure RBAC permissions for managing the Azure resource don't grant NFS file access. For more information, see [NFS authentication and network access](files-nfs-protocol.md#authentication-and-network-access).

- **Configure root squash where compatible with the workload**: Root squash maps requests from UID/GID 0 to an anonymous identity. It doesn't restrict other identities or make a share read-only. For settings and configuration steps for both resource providers, see [Root squashing for NFS Azure file shares](nfs-root-squash.md).

- **Require encryption in transit**: Both resource providers support TLS through the AZNFS mount helper. Microsoft.FileShares requires encryption in transit by default. Classic shares have storage account-level NFS encryption settings. For defaults and configuration links, see [NFS encryption](files-nfs-protocol.md#encryption).

## Identity and access management

### Azure resource management
- **Use least privilege for management access**: Grant Azure RBAC permissions at the smallest scope needed to create, configure, or delete resources. For classic shares, account-level permissions can affect every share in the account. You can manage Microsoft.FileShares resources independently. Management roles and data access permissions have different purposes. For more information, see [Azure control plane and data plane](../../azure-resource-manager/management/control-plane-and-data-plane.md).

- **Limit standing administrative access**: Use Microsoft Entra Privileged Identity Management where appropriate for privileged Azure roles. Require approval and multifactor authentication for administrative activation according to your organization's policy. For more information, see [Privileged Identity Management](/entra/id-governance/privileged-identity-management/pim-configure).

### Identity-based authentication for SMB file shares

SMB identity-based access is available for classic file shares. A storage account key grants broad data access across the shares in an account and doesn't identify an individual user.

- **Use an identity source supported by your clients**: Azure Files supports AD DS, Microsoft Entra Domain Services, and Microsoft Entra Kerberos. Their client and identity requirements differ. For supported scenarios and setup guides, see [Identity-based authentication for Azure Files](storage-files-active-directory-overview.md).

- **Use managed identities for supported application workloads**: Managed identities can provide SMB access without distributing storage account keys. Verify the compute, client, and authentication prerequisites for your deployment. For more information, see [Access SMB shares by using managed identities](files-managed-identities.md).

- **Protect account keys when they're required**: Restrict permission to retrieve or regenerate keys. Store required keys in Azure Key Vault and rotate them after exposure or according to your credential policy. Plan rotation around clients and integrations that still use the keys. For more information, see [Manage storage account access keys](../common/storage-account-keys-manage.md?toc=/azure/storage/files/toc.json).

### Share-level and NTFS permissions

These permissions apply to classic SMB file shares.

- **Assign share-level roles at the required scope**: Grant read, write, or administrative access only to the identities that need it. Share-level role assignments avoid granting access to unrelated shares in the same storage account. For more information, see [Assign share-level permissions](storage-files-identity-assign-share-level-permissions.md).

- **Apply directory and file permissions**: Use Windows ACLs, including on the share's root directory where needed, to control access within the share. Use inheritance to keep permissions manageable. Both share-level permissions and Windows ACLs are enforced. For more information, see [Configure directory-level and file-level permissions](storage-files-identity-configure-file-level-permissions.md).

- **Restrict permission administration**: Limit elevated roles and ACL modification rights to identities responsible for managing permissions. Review both role assignments and inherited ACLs when access requirements change.

### FileREST access and SAS
FileREST data access is available for classic shares. Microsoft.FileShares doesn't currently support FileREST data access.

- **Use OAuth for supported administrative data access**: Microsoft Entra identities, including managed identities, can access classic shares through FileREST. The privileged roles used by this access method can bypass file and directory permissions, so grant them only where that access is required. For more information, see [Azure Files OAuth over REST](authorize-oauth-rest.md).

- **Limit SAS permissions and lifetime**: When a supported tool requires a shared access signature (SAS), restrict its scope, permissions, and validity period, and require HTTPS. Protect the SAS as a credential. SAS tokens aren't used to mount shares over SMB or NFS. For more information, see [Shared access signatures](../common/storage-sas-overview.md?toc=/azure/storage/files/toc.json).

- **Require HTTPS for FileREST**: HTTPS protects REST requests in transit. SMB channel encryption and NFS TLS tunneling are separate from the HTTPS requirement. For configuration steps, see [Require secure transfer](../common/storage-require-secure-transfer.md?toc=/azure/storage/files/toc.json).

## Data protection
- **Understand encryption at rest**: Both resource providers encrypt file data at rest with Microsoft-managed keys by default. Encryption at rest protects stored data; it doesn't prevent authorized clients from reading or changing files.

- **Use customer-managed keys when required**: Classic shares support customer-managed keys in Azure Key Vault or Managed HSM. Microsoft.FileShares doesn't currently support customer-managed keys. Protect the key store, plan key rotation, and understand that loss of key access can make the data unavailable. For more information, see [Customer-managed keys for Azure Files](customer-managed-keys.md).

- **Evaluate infrastructure encryption for applicable classic deployments**: Classic storage accounts can have an additional encryption layer when required by your compliance policy. This option is selected at account creation and can't be changed afterward. For supported account types, see [Infrastructure encryption](../common/infrastructure-encryption-enable.md?toc=/azure/storage/files/toc.json).

- **Use resource locks to protect management operations**: A **CanNotDelete** lock on the appropriate Azure resource or parent scope can prevent deletion through Azure Resource Manager. Locks don't prevent clients from modifying or deleting file data. For classic shares, they also don't prevent deletion through FileREST data-plane APIs. For lock behavior and operational effects, see [Lock Azure resources](../../azure-resource-manager/management/lock-resources.md).

## Backup and recovery

- **Take share snapshots according to recovery needs**: Both resource providers support share snapshots for recovery of earlier file versions. Set a schedule and retention policy that meet your recovery objectives. Share snapshots remain associated with the source share, so they don't provide an independent backup if that share is permanently deleted. For more information, see [Share snapshots for Azure Files](storage-snapshots-files.md).

- **Enable soft delete for classic shares**: Soft delete retains deleted shares for a configured period. It doesn't recover individual files or individually deleted snapshots. Microsoft.FileShares doesn't currently support soft delete. For more information, see [Prevent accidental deletion of Azure file shares](storage-files-prevent-file-share-deletion.md).

- **Choose a backup solution supported by the protocol**: Azure Backup supports classic SMB shares, with snapshot and vaulted backup options. It doesn't currently support NFS shares with either resource provider. For NFS, choose a backup solution that supports the protocol and meets your retention and isolation requirements. For Azure Backup coverage, see [Azure file share backup support](../../backup/azure-file-share-support-matrix.md).

- **Separate backup administration and test recovery**: Limit who can delete recovery points or change retention. Test restores of files, permissions, and complete workloads. Verify that recovery remains possible if production credentials or the source share are compromised.

- **Plan for infrastructure failures separately from data recovery**: Redundancy improves resilience to infrastructure failures but also replicates data changes. It doesn't replace backups for unwanted changes or deletion. Available redundancy options differ by media tier and resource provider. For more information, see [Azure Files redundancy](files-redundancy.md).

## Logging and monitoring

- **Audit management changes for both resource providers**: Use the Azure Activity Log to monitor resource deletion, configuration changes, and role assignments. Review changes to public access, network rules, encryption requirements, and recovery controls. For more information, see [Azure Activity Log](/azure/azure-monitor/essentials/activity-log).

- **Collect supported data access logs**: For classic SMB and FileREST access, use file service resource logs to review callers, authorization methods, failed requests, and deletion activity. Collect the logs required by your retention policy in Log Analytics or another supported destination. Don't assume the same request logging coverage for NFS or Microsoft.FileShares. For supported operations and fields, see [Azure Files monitoring data reference](storage-files-monitoring-reference.md).

- **Correlate alerts with client and identity logs**: Investigate unexpected key use, failed authentication, share deletion, and security configuration changes. Use client and directory logs when an authentication failure occurs before the request reaches Azure Files. Route alerts to the team responsible for the workload.

- **Evaluate Defender for Storage for classic deployments**: Defender for Storage provides threat detection for supported storage accounts. Verify feature and protocol coverage for your deployment; account protection doesn't imply that every file operation is scanned for malware. For more information, see [Microsoft Defender for Storage](/azure/defender-for-cloud/defender-for-storage-introduction).

## Compliance and governance
- **Apply policies that match the resource provider**: Use Azure Policy to audit or enforce your organization's requirements where the resource type and properties are supported. Check each definition's scope and effects. A policy targeting Microsoft.Storage storage accounts doesn't automatically evaluate Microsoft.FileShares resources. For more information, see [Azure Policy definitions](../../governance/policy/concepts/definition-structure-basics.md).

- **Record ownership and data requirements**: Use resource tags to identify the responsible team, environment, and data classification. For classic shares, account-level controls affect all shares in the account. Record exceptions and review them when workload ownership changes.

- **Validate compliance for the deployment**: Confirm that the selected service, region, protocol, and protection features meet your requirements. Use the [Microsoft cloud security benchmark](/security/benchmark/azure/overview) to organize control reviews. For certification information, see [Azure Storage compliance offerings](../common/storage-compliance-offerings.md?toc=/azure/storage/files/toc.json).

## Azure File Sync

Azure File Sync supports classic SMB shares. It doesn't support NFS or Microsoft.FileShares. Secure both the cloud share and the Windows Server endpoints.

- **Use managed identities for supported File Sync deployments**: Follow the managed identity configuration for the Storage Sync Service and registered servers to remove the dependency on shared keys. For more information, see [Use managed identities with Azure File Sync](../file-sync/file-sync-managed-identities.md).

- **Limit administrative access to sync resources and servers**: Use the required Storage Sync roles at the appropriate scope. Protect local file permissions and server administration because changes made through a server endpoint can be synchronized to the cloud share. For more information, see [Plan an Azure File Sync deployment](../file-sync/file-sync-planning.md).

## Next steps

- [Plan an Azure Files deployment](storage-files-planning.md)
- [Azure Files networking overview](storage-files-networking-overview.md)
- [Configure network endpoints for Azure file shares](storage-files-networking-endpoints.md)
