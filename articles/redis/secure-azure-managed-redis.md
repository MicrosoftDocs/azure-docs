---
title: Secure your Azure Managed Redis deployment
description: Learn how to secure Azure Managed Redis, with best practices for protecting your data, authentication, and infrastructure. 
ms.author: danlep
author: dlepow
ms.service: azure-managed-redis
ms.topic: concept-article
ms.custom: horz-security
ms.date: 03/30/2026
ai-usage: ai-assisted
---

# Secure your Azure Managed Redis deployment

Azure Managed Redis provides a fully managed in-memory data store based on Redis Enterprise software. When deploying this service, it's important to follow security best practices to protect your cached data, configurations, and infrastructure.

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

This article provides security recommendations to help protect your Azure Managed Redis deployment.

## Data protection

Protecting data at rest and in transit is crucial for maintaining the confidentiality and integrity of your cache.

- **Keep non-TLS access disabled**: Azure Managed Redis requires TLS 1.2 or 1.3 for all connections by default, ensuring data in transit is encrypted. Keep non-TLS access disabled to prevent unencrypted communication. If you enable non-TLS access for legacy applications, plan to migrate those applications to TLS-enabled clients. See [TLS configuration for Azure Managed Redis](/azure/redis/tls-configuration).

- **Use customer-managed keys for disk encryption**: Azure Managed Redis encrypts persistence data and OS disks using Microsoft-managed keys (MMK) by default. For additional control, configure customer-managed keys (CMK) to wrap the encryption keys using Azure Key Vault. CMK requires a user-assigned managed identity and an Azure Key Vault instance with purge protection and soft delete enabled. See [Configure disk encryption for Azure Managed Redis instances using customer managed keys](/azure/redis/how-to-encryption).

- **Enable data persistence for recovery**: Configure RDB or AOF persistence to protect against data loss from unexpected failures. Persistence writes data to managed disks that are encrypted at rest. Data persistence isn't a backup or point-in-time recovery (PITR) feature—if corrupted data is written to Redis, it's also persisted. For true backups, use the export feature. See [Configure data persistence for an Azure Managed Redis instance](/azure/redis/how-to-persistence).

- **Use export for data backups**: Create periodic backups of your Redis data using the Export feature to Azure Storage accounts. Export provides point-in-time data copies that can be imported to new cache instances for disaster recovery. See [Import and Export data in Azure Managed Redis](/azure/redis/how-to-import-export-data).

## Network security

Isolate your Azure Managed Redis instance from the public internet and control network access.

- **Use private endpoints**: Deploy Azure Private Link to connect to your Azure Managed Redis instance through a private IP address in your virtual network. Private endpoints eliminate exposure to the public internet and keep traffic on the Microsoft backbone network. Private endpoints are the recommended solution for securing your Azure Managed Redis resource at the networking layer. See [Azure Managed Redis with Azure Private Link](/azure/redis/private-link).

- **Disable public network access**: When using private endpoints, disable public network access using the `publicNetworkAccess` property to ensure all traffic flows through your virtual network. This configuration prevents unauthorized access from the internet. Disabling `publicNetworkAccess` and protecting your cache using a VNet along with Private Endpoint and Private Links is the most secure option. See [Enabling public network access](/azure/redis/private-link#enabling-public-network-access).

## Identity and access management

Properly configure authentication and authorization to control access to your Azure Managed Redis instance.

- **Use Microsoft Entra ID authentication**: Configure Microsoft Entra ID for password-free authentication instead of access keys. Microsoft Entra authentication provides enhanced security, centralized identity management, and automatic token refresh. Azure Managed Redis enables managed identity by default when you create a new cache. Microsoft Entra groups aren't supported, so add individual users or service principals to the Redis users list. See [Use Microsoft Entra ID for cache authentication with Azure Managed Redis](/azure/redis/entra-for-authentication).

- **Disable access key authentication**: After configuring Microsoft Entra ID authentication, disable access key authentication to eliminate the risk of credential exposure. Access keys are static credentials that can be compromised if leaked. When you change this setting, all existing client connections are terminated regardless of authentication method, so implement proper retry mechanisms for reconnecting. See [Disable access key authentication on your cache](/azure/redis/entra-for-authentication#disable-access-key-authentication-on-your-cache).

- **Add authorized users or service principals**: Configure which Microsoft Entra users or service principals can access your cache by adding them to the Redis users list in the Azure portal. Follow the principle of least privilege by granting access only to identities that require it. See [Add users or service principal to your cache](/azure/redis/entra-for-authentication#add-users-or-system-principal-to-your-cache).

- **Apply least privilege access with RBAC**: Use Azure role-based access control (RBAC) to manage who can administer your Azure Managed Redis resources in the Azure portal and through APIs. Assign roles at the appropriate scope to limit permissions to only what's necessary. See [Access control (IAM)](/azure/redis/configure#access-control-iam).

- **Use managed identities for Azure resource access**: When your Azure Managed Redis instance needs to access other Azure resources such as Azure Key Vault for customer-managed keys, use managed identities. Managed identities eliminate the need to manage credentials. See [Configure disk encryption](/azure/redis/how-to-encryption#prerequisites-and-limitations).

- **Regenerate access keys regularly**: If you must use access keys, regenerate them regularly to limit the impact of potential key exposure. Azure Managed Redis supports two access keys so you can rotate keys without downtime. See [Authentication](/azure/redis/configure#authentication).

## Logging and monitoring

Implement comprehensive logging and monitoring to detect security threats and troubleshoot issues.

- **Enable connection logs**: Configure Azure diagnostic settings to log client connections to your cache. Connection logs record who is connecting and the timestamp of those connections, enabling you to identify the scope of security breaches and perform security auditing. See [Azure Monitor diagnostic settings](/azure/redis/monitor-diagnostic-settings).

- **Monitor the Activity log**: Review the Azure Activity log to track management operations performed on your Azure Managed Redis resources. Activity logs help you determine what operations were performed, who initiated them, and when they occurred for security auditing purposes. See [Activity log](/azure/redis/configure#activity-log).

- **Create security alerts**: Set up Azure Monitor alerts to notify you of abnormal usage patterns, connection anomalies, or potential security breaches affecting your cache. Configure alerts based on connection count spikes, authentication failures, or unusual data transfer patterns. See [Alerts](/azure/redis/configure#alerts).

- **Integrate with Azure Monitor**: Configure Azure Monitor to collect and analyze logs and metrics from your Azure Managed Redis instance. Use Log Analytics workspaces to run queries on connection logs and identify security patterns. See [Monitoring](/azure/redis/configure#monitoring).

## Compliance and governance

Implement governance controls to ensure your Azure Managed Redis deployments meet organizational and regulatory requirements.

- **Use Azure Policy for compliance**: Deploy Azure Policy to enforce organizational standards and assess compliance at scale. Use built-in policy definitions to audit and enforce security configurations. 

- **Enable resource locks**: Apply resource locks to prevent accidental deletion or modification of critical Azure Managed Redis resources. Use CanNotDelete locks to prevent deletion while allowing modifications, or ReadOnly locks for complete protection. See [Locks](/azure/redis/configure#locks).

- **Use tags for resource organization**: Apply tags to your Azure Managed Redis resources to support security governance, cost tracking, and compliance reporting. Tags help you organize resources by security classification, environment, or compliance requirements. See [Tags](/azure/redis/configure#tags).

## Backup and recovery

Implement backup and recovery mechanisms to ensure business continuity and data protection.

- **Configure data persistence**: Enable RDB or AOF persistence to automatically recover data after unexpected failures. RDB persistence saves periodic snapshots with minimal performance impact and is suitable for most scenarios. AOF persistence logs every write operation for minimal data loss but can affect throughput. See [Configure data persistence for an Azure Managed Redis instance](/azure/redis/how-to-persistence).

- **Use active geo-replication for disaster recovery**: For critical workloads, enable active geo-replication to replicate data across multiple Azure regions. Geo-replication provides business continuity if an entire region becomes unavailable. Active geo-replication isn't compatible with data persistence, so choose geo-replication for cross-region resiliency or persistence for single-region durability. See [Set up active geo-replication](/azure/redis/how-to-active-geo-replication).

- **Implement export-based backup strategy**: Create automated scripts using PowerShell or Azure CLI to periodically export data for backup purposes. Exported data can be imported to a new cache instance for disaster recovery. See [Import and Export data in Azure Managed Redis](/azure/redis/how-to-import-export-data).

## Service-specific security

Azure Managed Redis has unique security considerations based on its in-memory architecture.

### Azure Managed Redis architecture

- **Select the appropriate tier for security requirements**: Different Azure Managed Redis tiers offer different capabilities. All tiers support private endpoints, TLS encryption, and Microsoft Entra authentication. Flash Optimized tier stores some data on NVMe disks encrypted with Microsoft-managed keys. Azure Managed Redis provides built-in high availability with primary and replica shards across two nodes; in regions with multiple availability zones, the service is zone redundant. See [Feature comparison](/azure/redis/overview#feature-comparison).

### Appropriate use of Azure Managed Redis

- **Do not store sensitive data without proper encryption**: While Azure Managed Redis encrypts data at rest on persistence disks, data in memory isn't encrypted by the service. Implement application-level encryption for highly sensitive data before writing it to the cache, or use the service only for non-sensitive cached data. See [Data protection](/azure/redis/how-to-encryption#encryption-coverage).

- **Do not expose access keys in application code**: Store access keys in Azure Key Vault or use Microsoft Entra authentication instead of embedding access keys in application code or configuration files. Exposed access keys can lead to unauthorized cache access. See [Use Microsoft Entra ID for cache authentication](/azure/redis/entra-for-authentication).

- **Do not use Azure Managed Redis as a primary data store**: Azure Managed Redis is designed as a cache and temporary data store, not a persistent primary database. Always maintain authoritative data in a persistent data store like Azure SQL Database or Azure Cosmos DB. See [Key scenarios](/azure/redis/overview#key-scenarios).

## Next steps

- [Reliability in Azure Managed Redis](/azure/reliability/reliability-managed-redis)
- [Azure Managed Redis documentation](/azure/redis/)
- [Zero Trust guidance center](/security/zero-trust/zero-trust-overview)
- [Microsoft Cloud Security Benchmark v2 overview](/security/benchmark/azure/overview)
