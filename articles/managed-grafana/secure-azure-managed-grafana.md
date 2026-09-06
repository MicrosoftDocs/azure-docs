---
title: Secure your Azure Managed Grafana deployment
description: Learn how to secure Azure Managed Grafana, with best practices for protecting your resource.
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-managed-grafana
ms.topic: best-practice
ms.custom: horz-security
ms.date: 09/02/2026
ai-usage: ai-assisted
---

# Secure your Azure Managed Grafana deployment

Azure Managed Grafana provides capabilities to visualize and monitor data from multiple sources with comprehensive dashboard and alerting functionality. When deploying this service, it's important to follow security best practices to protect data, configurations, and infrastructure.

This article provides security recommendations to help protect your Azure Managed Grafana deployment.

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Service-specific security

Service-specific security controls address unique security considerations and features available in Azure Managed Grafana for API authentication and automated access management.

- **Disable API keys and service accounts when not needed**: Keep API key creation disabled by default to prevent automated access through service accounts unless specifically required for integration scenarios. Service accounts and API keys effectively bypass Microsoft Entra authentication and allow access to Grafana with token-based authentication, which can undermine the default security model of centralized identity management and multifactor authentication. Enable API keys only when necessary for legitimate automation use cases such as CI/CD pipelines and implement proper token lifecycle management. For more information, see [How to use service accounts in Azure Managed Grafana](/azure/managed-grafana/how-to-service-accounts).

- **Implement proper service account token management**: When service accounts are required, configure tokens with appropriate expiration times and minimal necessary permissions. Use the most restrictive Grafana role that allows the needed tasks (Viewer or Editor rather than Admin unless absolutely required). Take advantage of token expiration settings and avoid selecting "No expiration" unless operationally unavoidable. Regularly rotate service account tokens and revoke unused tokens to reduce the risk of credential compromise. Store tokens securely in systems like Azure Key Vault and never expose them in logs or client-side code. Monitor service account usage through Grafana login events in diagnostic settings to track when tokens are used for authentication. For more information, see [How to use service accounts in Azure Managed Grafana](/azure/managed-grafana/how-to-service-accounts).

- **Secure data source plugin configurations**: When configuring data source plugins, follow the prioritized authentication approach detailed in the Identity and access management section to ensure secure data access. For data sources that require direct credentials, use Azure Key Vault to store and retrieve connection information securely. Carefully evaluate and approve plugins before enabling them in your environment, as you're responsible for determining which plugins meet your security requirements and organizational standards. For more information, see [How to manage data sources in Azure Managed Grafana](/azure/managed-grafana/how-to-data-source-plugins-managed-identity) and [How to manage plugins in Azure Managed Grafana](/azure/managed-grafana/how-to-manage-plugins).

- **Control plugin access and evaluate plugin trust**: Carefully review and approve all plugins enabled in your environment, whether they are core Grafana plugins, community plugins, or Grafana Enterprise plugins. Only install plugins that are required for your monitoring use cases and that meet your organizational standards for quality, compliance, and security. Third-party plugins have their own release frequency, security implications, and update processes that are outside of Microsoft control. It is your responsibility to determine which plugins meet your requirements and security needs. Monitor plugin usage for security issues and regularly review installed plugins to ensure they remain necessary and trustworthy. For more information, see [How to manage plugins in Azure Managed Grafana](/azure/managed-grafana/how-to-manage-plugins) and [Enable Grafana Enterprise](/azure/managed-grafana/how-to-grafana-enterprise).

- **Enable CSRF protection**: Configure **CSRF Always Check** in **Grafana Settings** to enhance security by rejecting requests that have an origin header that doesn't match the origin of the Grafana instance. This setting provides additional protection against Cross-Site Request Forgery (CSRF) attacks by strictly validating request origins. Since Azure Managed Grafana is accessed via its specific domain and doesn't support anonymous access, enabling this setting has minimal impact on functionality while providing enhanced security. This option applies to workspaces running Grafana 11 or earlier; Grafana 12 and newer workspaces can't access this configuration option. For more information, see [How to configure Grafana settings](/azure/managed-grafana/grafana-settings).

- **Secure dashboard snapshot sharing**: Disable external snapshot publishing unless explicitly required for your use cases. The **External Enabled** setting allows users to publish dashboard snapshots to an external public server (snapshots.raintank.io), which can expose sensitive data to anyone with the snapshot link and bypass Microsoft Entra authentication controls. Consider disabling this feature in Grafana Settings to restrict snapshots to local-only sharing within your Microsoft Entra tenant. For more information, see [How to configure Grafana settings](/azure/managed-grafana/grafana-settings) and [How to share a dashboard](/azure/managed-grafana/how-to-share-dashboard).

## Network security

Network security controls prevent unauthorized access to Azure Managed Grafana workspaces and establish secure communication boundaries for monitoring and visualization workloads.

- **Enable private endpoints**: Eliminate public internet exposure by routing traffic through your virtual network using Azure Private Link. Private endpoints provide dedicated network interfaces that connect directly to Azure Managed Grafana while preventing data exfiltration risks. Public network access is enabled by default on new workspaces, so explicitly configuring private endpoints is essential for minimizing the attack surface by preventing unsolicited internet traffic from reaching the Grafana instance. For more information, see [Set up private access](/azure/managed-grafana/how-to-set-up-private-access#create-a-private-endpoint).

- **Disable public network access**: Block all internet-based connections when using private endpoints by configuring the workspace to deny public network access. This configuration forces all communication through private endpoints and reduces your attack surface. Disabling public access prevents the Azure portal's **Pin to Grafana** feature from working, but this trade-off is recommended for enhanced security in production environments. For more information, see [Set up private access](/azure/managed-grafana/how-to-set-up-private-access#disable-public-access-to-a-workspace).

- **Configure network security groups for private endpoints**: Use network security groups (NSGs) to control traffic flow to and from subnets hosting private endpoints by implementing restrictive rules that deny unauthorized access while allowing necessary communication patterns. Configure NSG rules on the subnet where the private endpoint is deployed to control access. For more information, see [Set up private access](/azure/managed-grafana/how-to-set-up-private-access).

- **Use deterministic outbound IP addresses**: Enable the deterministic outbound IP feature in Azure Managed Grafana Standard tier to obtain predictable IP addresses for outbound connections. This configuration allows you to set up data source firewalls to allow specific IP addresses, reducing the need for broad network access rules. By default, Grafana service outbound IP addresses aren't fixed, so this feature is essential when data source security requires IP allowlisting. For more information, see [Use deterministic outbound IPs](/azure/managed-grafana/how-to-deterministic-ip).

## Identity and access management

Identity and access management controls ensure that only authorized users and applications can access Azure Managed Grafana resources with appropriate permissions for dashboard management and data visualization.

- **Use Microsoft Entra ID authentication**: Replace local authentication mechanisms with Microsoft Entra ID to use centralized identity management, conditional access policies, and advanced security features. This configuration provides better security through multifactor authentication and eliminates long-lived secrets. For more information, see [Set up Azure Managed Grafana authentication and permissions](/azure/managed-grafana/how-to-authentication-permissions).

- **Implement role-based access control (RBAC)**: Assign users and applications the minimum required permissions by using built-in Grafana roles, rather than using administrative roles. Use Azure RBAC to enforce least-privilege access principles. For more information, see [Manage access and permissions for users and identities](/azure/managed-grafana/how-to-manage-access-permissions-users-identities).

- **Prioritize Current User authentication for data sources**: Configure data sources to use Current User authentication as the preferred method when supported, as this configuration ensures each user can only access data they have permissions for through their own Microsoft Entra identity, following zero-trust principles. When Current User authentication isn't available, use managed identities as the fallback authentication method to authenticate Azure Managed Grafana to data sources without storing credentials in code or configuration. Managed identities eliminate credential management overhead and provide automatic secret rotation. For more information, see [Set up Azure Managed Grafana authentication and permissions](/azure/managed-grafana/how-to-authentication-permissions).

- **Assign Monitoring Reader role for data access**: When using managed identity authentication, grant the managed identity associated with Azure Managed Grafana the Monitoring Reader role on the appropriate scope - whether at the subscription level for broad access, or on specific resource groups or resources that contain the monitoring data you need to visualize. This configuration follows least-privilege principles by limiting data source access to only the resources where monitoring data is needed when Current User authentication isn't available. For more information, see [Set up Azure Managed Grafana authentication and permissions](/azure/managed-grafana/how-to-authentication-permissions).

- **Manage guest user access carefully**: Azure Managed Grafana only allows Microsoft Entra identities, requiring external collaborators to be added as guest users in your Microsoft Entra tenant. Tightly control guest access by only inviting necessary external users and regularly reviewing guest accounts. Remove guest access when it's no longer needed to reduce potential security risks from compromised external accounts or over-privileged guest access. For more information, see [Manage access and permissions for users and identities](/azure/managed-grafana/how-to-manage-access-permissions-users-identities).

- **Limit administrative privileges**: Minimize the number of users with the Grafana Admin role, which can change critical settings including data sources and user permissions. Use the Grafana Editor role for most power users who need to create and modify dashboards, and reserve the Grafana Admin role only for those who need to manage workspace configuration and security settings. Consider using the Grafana Limited Viewer role as the default for new users, combined with explicit dashboard sharing, to provide minimal access by default. For more information, see [Manage access and permissions for users and identities](/azure/managed-grafana/how-to-manage-access-permissions-users-identities).

## Data protection

Data protection controls ensure that configuration data, dashboard definitions, and user information stored in Azure Managed Grafana are properly encrypted and secured against unauthorized access.

- **Ensure data in transit encryption**: For data source connections, encryption depends on the configuration and capabilities of your external data sources. Configure encrypted endpoints (HTTPS) in your data source settings when possible to ensure secure communication between Grafana and your data sources. Azure-managed data sources like Azure Monitor are automatically configured with encrypted connections, but custom data sources require you to configure TLS/SSL connections based on the target system's capabilities. For more information, see [How to manage data sources in Azure Managed Grafana](/azure/managed-grafana/how-to-data-source-plugins-managed-identity).

- **Secure data source connections**: Configure data sources with secure authentication methods rather than storing credentials directly in Grafana. Follow the prioritized authentication approach detailed in the Identity and access management section. The default Azure Monitor data source is preconfigured with managed identity authentication, but you should evaluate whether to change this to Current User authentication based on your security requirements and whether you need per-user data access control. For more information, see [How to manage data sources in Azure Managed Grafana](/azure/managed-grafana/how-to-data-source-plugins-managed-identity).

- **Implement proper dashboard and folder permissions**: Use Grafana's built-in permission system to control access to dashboards and folders based on user roles and responsibilities. Ensure sensitive monitoring data is only accessible to authorized personnel. For more information, see [Manage access and permissions for users and identities](/azure/managed-grafana/how-to-manage-access-permissions-users-identities).

## Logging and monitoring

Logging and monitoring capabilities provide visibility into Azure Managed Grafana usage patterns, authentication events, and system health for security analysis and compliance reporting.

- **Enable diagnostic settings for audit logging**: Configure diagnostic settings to stream Grafana authentication events and other logs to Log Analytics, storage account, or Event Hubs for centralized monitoring and security analysis. This setup provides visibility into user access patterns and system events. For more information, see [Monitor Azure Managed Grafana using diagnostic settings](/azure/managed-grafana/how-to-monitor-managed-grafana-workspace).

- **Configure log retention policies**: Establish appropriate retention periods for diagnostic logs based on compliance requirements and security analysis needs. Store logs in secure, tamper-evident storage locations with proper access controls. For more information, see [Monitor Azure Managed Grafana using diagnostic settings](/azure/managed-grafana/how-to-monitor-managed-grafana-workspace).

- **Monitor workspace metrics**: Use Azure Monitor metrics to track performance indicators and detect anomalous behavior that might indicate security issues or resource exhaustion attacks. Monitor metrics such as HTTP requests, memory usage, and network bytes received or transmitted through Azure Monitor's metric charts. For more information, see [Monitor Azure Managed Grafana using Azure Monitor's metric chart](/azure/managed-grafana/how-to-monitor-managed-grafana-metrics).

## Compliance and governance

Compliance and governance controls ensure that Azure Managed Grafana deployments meet organizational policies and regulatory requirements for data protection and access management.

- **Implement Azure Policy controls**: Use Azure Policy to audit and enforce Azure Managed Grafana configurations across your organization. Built-in policies include options to disable public network access, disable the Grafana Enterprise upgrade, disable email settings, and disable service accounts. For more information, see [Azure Policy built-in policy definitions for Managed Grafana](/azure/governance/policy/samples/built-in-policies#managed-grafana).

- **Enforce private network access requirements**: Apply the "Azure Managed Grafana workspaces should disable public network access" policy to ensure all workspaces use private endpoints instead of public internet connections. This policy can audit existing configurations or deny creation of non-compliant workspaces. For more information, see [Azure Policy built-in policy definitions for Managed Grafana](/azure/governance/policy/samples/built-in-policies#managed-grafana).

- **Configure resource tagging for governance**: Apply consistent tags to Azure Managed Grafana resources to support cost management, security classification, and compliance reporting. Use tags to identify resource owners, environments, and data sensitivity levels. For more information, see [Use tags to organize your Azure resources and management hierarchy](/azure/azure-resource-manager/management/tag-resources).

- **Establish access review processes**: Implement regular access reviews for the Grafana Admin, Editor, Viewer, and Limited Viewer role assignments on your Managed Grafana workspaces to ensure users maintain only necessary access levels. Remove unused accounts and adjust permissions based on changing role requirements. For more information, see [What are Microsoft Entra ID access reviews?](/entra/id-governance/access-reviews-overview).

## Backup and recovery

Backup and recovery controls protect against data loss and ensure business continuity for Azure Managed Grafana monitoring capabilities during outages or disasters.

- **Enable zone redundancy for high availability**: Configure zone redundancy when creating Azure Managed Grafana workspaces in supported regions to distribute virtual machines across availability zones. This setup provides automatic failover capabilities during zone-level outages without user intervention. For more information, see [Azure Managed Grafana service reliability](/azure/reliability/reliability-managed-grafana?toc=/azure/managed-grafana/toc.json&bc=/azure/managed-grafana/breadcrumb/toc.json).

- **Plan multiregion deployment strategy**: Deploy Azure Managed Grafana workspaces in multiple regions for disaster recovery purposes since Microsoft doesn't provide cross-region disaster recovery for this service. Maintain consistent dashboard configurations across regions for seamless failover capabilities during regional outages. For more information, see [Azure Managed Grafana service reliability](/azure/reliability/reliability-managed-grafana?toc=/azure/managed-grafana/toc.json&bc=/azure/managed-grafana/breadcrumb/toc.json).

- **Export and version control dashboard configurations**: Regularly export dashboard definitions and data source configurations to version control systems or backup storage locations. This practice enables restoration of monitoring capabilities and maintains configuration history for compliance and recovery purposes. Use Grafana's native export functionality to backup dashboard JSON definitions. For more information, see [How to create a dashboard](/azure/managed-grafana/how-to-create-dashboard).

- **Document recovery procedures**: Create detailed recovery procedures that include steps for recreating workspaces, restoring configurations, and reestablishing data source connections. Test recovery procedures regularly to ensure they remain current and effective. For more information, see [Azure Managed Grafana service reliability](/azure/reliability/reliability-managed-grafana?toc=/azure/managed-grafana/toc.json&bc=/azure/managed-grafana/breadcrumb/toc.json).
