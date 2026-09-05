---
title: Secure your Azure Storage account
description: Learn how to secure Azure Storage, with best practices for protecting your storage account and the data it contains.
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-storage
ms.topic: best-practice
ms.custom: horz-security
ms.date: 08/19/2026
ai-usage: ai-assisted
# Customer intent: As a storage administrator, I want to learn how to secure my Azure Storage accounts and the data they contain.
---

# Secure your Azure Storage account

Azure Storage provides scalable, durable cloud storage for blobs, files, queues, and tables in a single storage account. Because a storage account can hold data of very different sensitivity levels and is often a target of exfiltration and ransomware attacks, take deliberate steps to protect the account, the data it holds, and the identities that access it.

This article provides security recommendations to help protect your Azure Storage account. These recommendations apply to all data services in the account (Blobs, Files, Queues, and Tables). For guidance specific to each data service, see the [Related security articles](#related-security-articles) at the end of this article.

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Service-specific security

Azure Storage has architectural characteristics that shape how you deploy it securely. Choices you make when you create an account - deployment model, kind, redundancy, and endpoint configuration - are difficult to change later and affect the security posture of every workload that uses the account.

### Storage account architecture

- **Use the Azure Resource Manager deployment model**: Create new storage accounts by using the Azure Resource Manager deployment model. Resource Manager accounts support Azure role-based access control (RBAC), managed identities, Microsoft Entra ID authorization for data, resource locks, tags, and policy - none of which are available with the classic deployment model. Migrate any remaining classic accounts. For more information, see [Migrate a classic storage account to Azure Resource Manager](classic-account-migration-process.md).

- **Separate storage accounts by workload, environment, and sensitivity**: Create separate accounts for development, preproduction, and production, and separate accounts for data of different sensitivity classifications. A storage account is a shared-key trust boundary and a policy boundary - mixing workloads in one account increases the blast radius of a compromise and makes least-privilege access harder to model.

- **Use one account per region for regional isolation**: Placing accounts in the region where their consuming workloads run reduces data movement across regions and simplifies compliance boundaries. For multiregion designs, pair regional accounts with geo-redundant storage or object replication rather than serving all regions from a single account. For more information, see [Azure Storage redundancy](storage-redundancy.md).

### Appropriate use of Azure Storage

- **Don't use Azure Storage account keys as long-lived application credentials**: Storage account keys grant full control of the account and can't be scoped. Applications should use Microsoft Entra ID with managed identities or, when Entra ID isn't an option, short-lived user-delegation shared access signature (SAS) tokens. For more information, see [Authorize access to data in Azure Storage](authorize-data-access.md).

- **Don't use Azure Storage as a general-purpose secrets store**: Secrets, connection strings, and certificates belong in Azure Key Vault, which provides rotation, access policies, hardware security module (HSM) protection, and audit trails. For more information, see [Azure Key Vault overview](/azure/key-vault/general/overview).

## Network security

Storage accounts are internet-reachable by default. Reducing the network attack surface is the single most effective change you can make to protect an account against unauthorized access, data exfiltration, and reconnaissance.

- **Disable public network access to the storage account**: When your clients are entirely in Azure or reachable through Private Link, set the account's public network access to **Disabled** so that only requests through private endpoints are accepted. For more information, see [Configure Azure Storage firewalls and virtual networks](storage-network-security.md).

- **Use private endpoints for access from virtual networks**: A private endpoint assigns a private IP address from your virtual network to the storage account and routes traffic over the Microsoft backbone. Combined with disabled public network access, private endpoints eliminate internet exposure. For more information, see [Use private endpoints for Azure Storage](storage-private-endpoints.md).

- **Restrict public access with the storage firewall when private endpoints aren't practical**: If clients must reach the account over public networking, set the firewall's default action to **Deny** and allow only the specific IP ranges, virtual network subnets (via service endpoints), or resource instances that need access. For more information, see [Configure Azure Storage firewalls and virtual networks](storage-network-security.md).

    - **Allow trusted Microsoft services when they need access to the account**: Deny-by-default firewall rules block requests from other Azure services (for example, Azure Backup, Log Analytics, and Microsoft Defender for Storage) as well as from the Azure portal and diagnostics pipelines. Add the **Allow Azure services on the trusted services list to access this storage account** exception so that first-party services you rely on can reach the account without opening it to the public internet. For more information, see [Grant access to trusted Azure services](storage-network-security.md#exceptions-for-trusted-azure-services-and-network-security).

    - **Grant access to specific resource instances rather than trusted services broadly**: Prefer resource instance rules, which authorize a named Azure resource and its managed identity, over the general "Allow trusted Microsoft services" exception. Resource instance rules produce a smaller trust surface. For more information, see [Grant access from Azure resource instances](storage-network-security-resource-instances.md).

- **Associate storage accounts with a network security perimeter**: A network security perimeter defines logical boundaries between platform as a service resources and blocks traffic outside the perimeter by default, providing defense in depth beyond per-account firewall rules. For more information, see [Network security perimeter for Azure Storage](storage-network-security-perimeter.md).

- **Enforce a minimum TLS version of 1.2 or later**: Configure the storage account's minimum TLS version to reject clients negotiating older, deprecated versions. For more information, see [Configure minimum required version of Transport Layer Security (TLS) for a storage account](transport-layer-security-configure-minimum-version.md).

- **Require secure transfer (HTTPS)**: Enable the **Secure transfer required** property to reject any request made over HTTP. This requirement applies to REST endpoints as well as to SMB access to Azure Files. For more information, see [Require secure transfer for a storage account](storage-require-secure-transfer.md).

    - Some scenarios, such as older SMB clients or legacy tools, require HTTP. In such cases, isolate those clients in a controlled network segment and migrate them off HTTP as soon as possible.

- **Restrict cross-tenant object replication and copy operations**: Configure the storage account to allow copy and object-replication operations only from source accounts in the same tenant, or only from allow-listed source accounts. This configuration prevents data movement across tenant boundaries by users who hold data-plane permissions. For more information, see [Permitted scope for copy operations](security-restrict-copy-operations.md) and [Prevent object replication across Microsoft Entra tenants](../blobs/object-replication-prevent-cross-tenant-policies.md).

- **Use VNet service tags for outbound rules to Azure Storage**: When you restrict outbound traffic from a virtual network to Azure Storage, use the `Storage` service tag (or region-specific variant) rather than hard-coded IP ranges. Microsoft maintains the service tag as the IP space evolves. For more information, see [Azure service tags overview](../../virtual-network/service-tags-overview.md).

- **Prefer the Microsoft global network for inbound routing**: Configure the storage account's network routing preference to **Microsoft network routing** so that inbound traffic enters the Microsoft backbone at the point of presence closest to the client and stays on the Microsoft network end-to-end. Internet routing exits the Microsoft network earlier and increases exposure to the public internet path. For more information, see [Configure network routing preference for Azure Storage](network-routing-preference.md).

## Identity and access management

Storage accounts support two authorization models: Microsoft Entra ID (identity-based, auditable, revocable) and Shared Key (a symmetric secret with full-account access). Move workloads to Microsoft Entra ID wherever possible and treat Shared Key as a legacy fallback.

- **Use Microsoft Entra ID to authorize access to data**: Microsoft Entra ID authorization uses OAuth 2.0 tokens and integrates with Conditional Access, managed identities, and RBAC audit trails. It's superior in every respect to Shared Key for data-plane access. For more information, see [Authorize access to data in Azure Storage](authorize-data-access.md).

- **Disallow Shared Key authorization**: Set the `allowSharedKeyAccess` property to `false` so that the account rejects any request signed with the account keys. Only Microsoft Entra ID and, where applicable, user-delegation SAS requests are accepted. For more information, see [Prevent Shared Key authorization for an Azure Storage account](shared-key-authorization-prevent.md).

- **Assign RBAC roles at the smallest reasonable scope**: Assign the built-in Storage data-plane roles (for example, **Storage Blob Data Reader**, **Storage Queue Data Contributor**) at the container, share, queue, or table level when possible, rather than at the account or subscription level. For more information, see [Authorize access to blobs using Azure role-based access control](../blobs/authorize-access-azure-active-directory.md).

    - **Add ABAC conditions to further constrain data-plane access**: Azure attribute-based access control (ABAC) lets you attach conditions to role assignments - for example, restricting access to blobs with a specific index tag or under a specific path prefix. For more information, see [Authorize access to blobs using Azure role assignments with ABAC conditions](../blobs/storage-auth-abac.md).

- **Use user-delegation SAS instead of service or account SAS when SAS is required**: A user-delegation SAS is signed with a Microsoft Entra credential rather than the account key, so revoking the user delegation key immediately invalidates every SAS issued from it. Service and account SAS tokens signed with account keys can't be revoked individually. For more information, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md).

    - **Scope every SAS to the minimum permissions and shortest lifetime required**: Grant only the specific operations (for example, `read` but not `write`) and set expiry to one hour or less for service SAS not backed by a stored access policy. For more information, see [Best practices when using SAS](storage-sas-overview.md#best-practices-when-using-sas).

    - **Configure a SAS expiration policy on the account**: Set an upper bound on the validity period of SAS tokens issued from the account. Violations are logged so you can find and fix long-lived SAS in your codebase. For more information, see [Create an expiration policy for shared access signatures](sas-expiration-policy.md).

    - **Restrict SAS tokens to HTTPS only**: When you must issue a SAS, allow only HTTPS in the SAS signature to prevent token exposure in the clear. For more information, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md).

- **If you must use account keys, protect and rotate them**: Store account keys in Azure Key Vault, retrieve them at runtime rather than embedding them in configuration, and rotate them on a defined cadence. Have a documented rotation procedure that avoids downtime by using both keys during rollover. For more information, see [Manage storage account access keys](storage-account-keys-manage.md).

- **Assign privileged storage roles just-in-time with Microsoft Entra Privileged Identity Management (PIM)**: For roles that grant management-plane changes to storage (such as **Storage Account Contributor** or **Owner**), require PIM activation with approval and multi-factor authentication rather than standing assignments. For more information, see [What is Microsoft Entra Privileged Identity Management?](/entra/id-governance/privileged-identity-management/pim-configure).

## Data protection

Azure Storage encrypts all data at rest by default with Microsoft-managed keys. The recommendations in this section add customer control, protect against accidental or malicious modification, and reduce exposure of data in transit and at rest.

- **Configure customer-managed keys (CMK) for encryption at rest**: Use a key you manage in Azure Key Vault or Managed HSM as the account encryption key. CMK lets you rotate, audit, and revoke the encryption key independently of Microsoft-managed keys. It supports compliance requirements that mandate customer key control. For more information, see [Customer-managed keys for Azure Storage encryption](customer-managed-keys-overview.md).

    - **Use Managed HSM or an HSM-backed Key Vault key for high-sensitivity data**: HSM-protected keys are stored in FIPS 140-3 Level 3 validated hardware and never leave the boundary. For more information, see [Configure encryption with customer-managed keys stored in Azure Key Vault Managed HSM](customer-managed-keys-configure-key-vault-hsm.md).

- **Enable infrastructure encryption for defense-in-depth double encryption**: Infrastructure encryption applies a second, service-managed encryption layer on top of the primary encryption layer. You must enable it at account creation. For more information, see [Enable infrastructure encryption for double encryption of data](infrastructure-encryption-enable.md).

- **Use encryption scopes to isolate encryption for specific containers or blobs**: Encryption scopes let you apply different keys or key rotation policies at container-level or blob-level granularity within a single account. This feature is useful for multitenant workloads that share an account but need per-tenant key control. For more information, see [Encryption scopes for Blob Storage](../blobs/encryption-scope-overview.md).

- **Enable Azure Storage encryption for all data in transit**: Combine `Secure transfer required = enabled` (see [Network security](#network-security)) with a minimum TLS version of 1.2 or later. Together they ensure the account rejects both unencrypted and weakly encrypted connections.

- **Use client-side encryption for the most sensitive data**: For data whose plaintext must never appear on the server, encrypt in the client before upload. Client-side encryption is complementary to service-side encryption and can be used together with CMK for layered protection. For per-service SDK support and patterns, see [Related security articles](#related-security-articles).

- **Protect the storage account with a resource lock**: Apply a **CanNotDelete** or **ReadOnly** lock to prevent accidental or malicious deletion or reconfiguration of the account itself. Locks apply to the account resource, not to the data within it, so they complement - not replace - soft delete and immutability. For more information, see [Apply an Azure Resource Manager lock to a storage account](lock-account-resource.md).

For data-service-specific data-protection features (blob immutability and WORM policies, blob encryption scopes), see the corresponding sub-article in [Related security articles](#related-security-articles).

## Logging and monitoring

Storage accounts are frequent targets of credential theft, exfiltration attempts, and misconfiguration. You need continuous logging and threat detection to detect and respond to attacks quickly.

- **Enable Microsoft Defender for Storage**: Defender for Storage provides threat detection, malware scanning on upload for blobs, and sensitive data discovery. It flags anomalous access patterns, known malicious IPs and Tor exits, and unusual authentication activity. Enable it at the subscription or storage-account level. For more information, see [Overview of Microsoft Defender for Storage](/azure/defender-for-cloud/defender-for-storage-introduction).

    - **Enable malware scanning for blob uploads on accounts that accept untrusted content**: Malware scanning inspects uploaded blobs and marks or removes malicious content before it can be served to downstream consumers. For more information, see [Malware Scanning in Defender for Storage](/azure/defender-for-cloud/defender-for-storage-malware-scan).

    - **Enable sensitive data threat detection**: Sensitive data discovery classifies data in the account and prioritizes alerts on containers that hold sensitive information. For more information, see [Sensitive data discovery in Defender for Storage](/azure/defender-for-cloud/defender-for-storage-data-sensitivity).

- **Send diagnostic settings to a Log Analytics workspace**: Configure diagnostic settings on the account and each data service (Blobs, Files, Queues, Tables) to send `StorageRead`, `StorageWrite`, and `StorageDelete` logs plus all metrics to Log Analytics. Retain logs for the period required by your compliance obligations. For more information, see [Monitor Azure Storage](/azure/storage/blobs/monitor-blob-storage).

- **Audit how each request is authorized**: Storage logs record whether each request was authorized with Microsoft Entra ID, Shared Key, SAS, or anonymously. Query the logs regularly to detect unexpected authorization methods, especially Shared Key usage after you disable it or anonymous access after you disable it. For more information, see [Monitor requests against Azure Storage](/azure/storage/blobs/monitor-blob-storage).

- **Alert on high-signal security events**: Configure Azure Monitor alerts for events such as key regeneration, firewall rule changes, public network access changes, Shared Key usage on accounts where it should be disabled, and Defender for Storage alerts. For more information, see [Log alerts in Azure Monitor](/azure/azure-monitor/alerts/alerts-unified-log).

- **Forward logs to a central SIEM**: For enterprise-scale response, forward storage logs from Log Analytics to Microsoft Sentinel or another SIEM so that storage events correlate with identity, network, and endpoint signals. For more information, see [Connect Azure Storage to Microsoft Sentinel](/azure/sentinel/data-connectors/azure-storage-account).

## Compliance and governance

Governance controls make secure configurations the default and detect drift automatically. For any storage estate larger than a handful of accounts, policy-based enforcement is the only sustainable way to keep the baseline consistent.

- **Apply Azure Policy to enforce baseline storage security**: Assign built-in policies that block insecure configurations at deployment time and audit existing accounts. High-value built-ins include: require secure transfer, require minimum TLS 1.2, deny public network access, deny public blob access, require infrastructure encryption, and require CMK. For a full list, see [Azure Policy built-in definitions for Azure Storage](policy-reference.md) and [Azure Policy Regulatory Compliance controls for Azure Storage](security-controls-policy.md).

- **Use Microsoft cloud security benchmark (MCSB) as the baseline**: Align storage controls with MCSB v2 domains for a consistent security posture across services. For more information, see [Overview of the Microsoft cloud security benchmark](/security/benchmark/azure/overview).

- **Tag storage accounts with owner, data classification, and environment**: Governance policies, cost management, and incident response all depend on consistent tagging. Apply tags via Azure Policy so they can't be omitted at creation time.

- **Review compliance offerings before storing regulated data**: Azure Storage carries certifications for common regulatory frameworks (HIPAA, PCI DSS, FedRAMP, ISO 27001, and others). Confirm coverage for your workload before deployment. For more information, see [Azure Storage compliance offerings](storage-compliance-offerings.md).

## Backup and recovery

Cross-region redundancy plus validated failover procedures provide regional resilience for the storage account itself. For data-service-specific deletion protection (blob soft delete, blob versioning, change feed, point-in-time restore, file share soft delete and snapshots), see the corresponding sub-article in [Related security articles](#related-security-articles).

- **Choose an appropriate redundancy option for your recovery requirements**: Geo-redundant storage (GRS/RA-GRS/GZRS/RA-GZRS) replicates data to a paired region and supports customer-initiated failover for regional resilience. Zone-redundant storage (ZRS/GZRS) protects against zone-level failures within a region. For more information, see [Azure Storage redundancy](storage-redundancy.md).

- **Don't rely on geo-redundancy for ransomware protection**: Geo-redundant replication mirrors data - and any corruption or malicious deletion - to the paired region. Pair GRS with immutability policies, soft delete, and versioning for ransomware and tamper resistance. For more information, see [Data protection features in Azure Storage](../blobs/data-protection-overview.md).

- **Practice customer-initiated failover and failback**: For accounts with RA-GRS or RA-GZRS, run a planned failover exercise to validate your recovery procedure before you need it. For more information, see [Disaster recovery and storage account failover](storage-disaster-recovery-guidance.md).

## Related security articles

For security guidance specific to each Azure Storage data service, see:

- [Secure your Azure Blob Storage](../blobs/secure-blobs.md) - Blob-specific security, including Azure Data Lake Storage, immutability, versioning, and anonymous access.
- [Secure your Azure Files](../files/secure-files.md) - File share identity-based authentication, SMB/NFS protocol security, and share-level access control.
- [Secure your Azure Queue Storage](../queues/secure-queues.md) - Queue-specific authorization and monitoring.
- [Secure your Azure Table Storage](../tables/secure-tables.md) - Table-specific authorization and Cosmos DB Table API considerations.

## Next steps

- [Well-Architected Framework: Azure Blob Storage service guide](/azure/well-architected/service-guides/azure-blob-storage)
- [Zero Trust guidance center](/security/zero-trust/zero-trust-overview)
- [Microsoft cloud security benchmark](/security/benchmark/azure/overview)
