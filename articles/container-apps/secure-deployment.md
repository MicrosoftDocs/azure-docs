---
title: Secure your Azure Container Apps deployment
description: Learn how to secure Azure Container Apps, with best practices for protecting your deployment.
author: craigshoemaker
ms.author: cshoe
ms.service: azure-container-apps
ms.topic: conceptual
ms.custom: horz-security
ms.date: 12/18/2025
ai-usage: ai-assisted
---

# Secure your Azure Container Apps deployment

Azure Container Apps provides capabilities to run containerized applications without managing complex infrastructure while providing enterprise-grade security features. When deploying this service, follow security best practices to protect data, configurations, and infrastructure.

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

This article provides security recommendations to help protect your Azure Container Apps deployment.

## Network security

Network security controls prevent unauthorized access to container app endpoints and establish secure communication boundaries between your applications and external services.

- **Deploy container apps in a virtual network**: To control network traffic and secure access to backend resources, Integrate your container app environment with Azure Virtual Networks. Virtual network integration enables your apps to access resources in private networks while protecting against internet-based attacks. See [Virtual network configuration](/azure/container-apps/custom-virtual-networks).

- **Enable private endpoints for inbound access**: Eliminate public internet exposure by using Azure Private Link to route client traffic through your virtual network. Private endpoints provide a private IP address from your virtual network, effectively bringing your container app into your network perimeter. See [Use a private endpoint with an Azure Container Apps environment](/azure/container-apps/how-to-use-private-endpoint).

- **Configure internal environments for complete isolation**: Deploy internal Container Apps environments to restrict all inbound access to clients within your virtual network. Internal environments provide complete isolation from the public internet and enable secure communication between container apps and other network resources. See [Networking in Azure Container Apps environment](/azure/container-apps/networking).

- **Disable public network access**: Configure Container Apps environments to disable public network access when using private endpoints, ensuring all connectivity occurs through your controlled virtual network environment. This configuration prevents unauthorized external access attempts. See [Private endpoints and DNS for virtual networks in Azure Container Apps environments](/azure/container-apps/private-endpoints-with-dns).

- **Implement Azure Firewall for outbound traffic control**: Use Azure Firewall with user-defined routes (UDR) to control and monitor all outbound traffic from your container apps to ensure communication only occurs with approved destinations. See [Enable User Defined Routes (UDR)](/azure/container-apps/user-defined-routes).

- **Configure Network Security Groups with restrictive rules**: Apply Network Security Groups to control traffic flow to and from your Container Apps subnets by implementing deny-by-default policies with specific allow rules for required communication patterns. See [Securing a existing VNet with an NSG](/azure/container-apps/firewall-integration).

- **Configure app-level restrictions**: Configure ingress settings with appropriate security controls including client certificate authentication and IP restrictions for secure exposure of container applications. Use internal ingress for applications that shouldn't be accessible from the internet. See [Ingress overview](/azure/container-apps/ingress-overview).

## Identity and access management

Identity and access management controls ensure that only authorized users and applications can access Container Apps resources with appropriate permissions and authentication mechanisms.

- **Enable authentication and authorization**: Configure built-in authentication using Microsoft Entra ID and other identity providers to protect container app endpoints beyond basic access controls. This configuration provides centralized identity management and supports custom authorization rules. See [Authentication and authorization in Azure Container Apps](/azure/container-apps/authentication).

- **Use managed identities for service connections**: Configure system-assigned or user-assigned managed identities to authenticate to other Azure services without storing credentials in code or configuration. Managed identities eliminate credential management overhead and provide automatic secret rotation. See [Use managed identities in Azure Container Apps](/azure/container-apps/managed-identity).

- **Implement role-based access control (RBAC)**: Use Azure RBAC to provide fine-grained permissions for Container Apps management operations. Assign users the minimum required roles such as Contributor, Owner, or Reader based on their responsibilities. See [Azure security baseline for Azure Container Apps](/security/benchmark/azure/baselines/azure-container-apps-security-baseline).

- **Configure Microsoft Entra ID authentication**: Use Microsoft Entra ID for centralized identity management and enable conditional access policies to control access based on user, location, and device conditions. This configuration provides enterprise-grade authentication capabilities with multifactor authentication support. See [Enable authentication and authorization in Azure Container Apps with Azure Active Directory](/azure/container-apps/authentication-entra).

- **Enable token store for secure authentication**: Use the built-in token store feature to manage authentication tokens securely independent of your application code. The token store provides automatic token refresh and reduces attack surface by eliminating custom token management code. See [Enable an authentication token store](/azure/container-apps/token-store).

## Data protection

Data protection mechanisms safeguard sensitive information processed by container apps through encryption, secure storage, and proper handling of secrets and configuration data.

- **Enforce HTTPS for all communication**: Configure Envoy proxy to redirect all HTTP traffic to HTTPS to ensure all data transmission uses TLS encryption. Set `allowInsecure: false` in your ingress configuration to prevent unencrypted connections. See [Set up HTTPS or TCP ingress in Azure Container Apps](/azure/container-apps/ingress).

- **Use Azure Key Vault for secrets management**: Store connection strings, API keys, and other secrets in Azure Key Vault instead of application settings. Use Key Vault references to retrieve secrets at runtime while maintaining centralized secret management with enhanced security and audit capabilities. See [Import certificates from Azure Key Vault](/azure/container-apps/key-vault-certificates-manage).

- **Enable mutual Transport Layer Security (mTLS)**: Use mTLS to authenticate and encrypt traffic between services, providing bidirectional authentication that verifies both client and server identities. This feature enhances security for service-to-service communication within your container app environment. See [Use Mutual Transport Layer Security (mTLS)](/azure/container-apps/mtls).

- **Implement proper secrets management**: Use Container Apps built-in secrets management with proper isolation and access controls. Avoid storing secrets directly in container images or environment variables; instead use secret references and Key Vault integration for production environments. See [Security overview in Azure Container Apps](/azure/container-apps/security).

- **Secure container image storage**: Store container images in Azure Container Registry with authentication enabled and configure geo-replication for disaster recovery. Use private registries instead of public repositories for production workloads to maintain control over image access. See [Architecture best practices for Azure Container Apps](/azure/well-architected/service-guides/azure-container-apps).

## Logging and monitoring

Comprehensive logging and monitoring provide visibility into Container Apps operations, security events, and performance metrics to enable threat detection and operational oversight.

- **Enable Azure Monitor Log Analytics integration**: Configure Log Analytics workspace integration to collect and analyze system and application logs from all container apps in your environment. This configuration provides centralized log management and supports security monitoring and compliance auditing. For more information, see [Monitor logs in Azure Container Apps with Log Analytics](/azure/container-apps/log-monitoring).

- **Configure diagnostic settings**: Enable diagnostic settings to stream container app logs and metrics to Azure Monitor Logs, storage accounts, or Event Hubs for centralized analysis and long-term retention. This configuration supports security investigations and compliance requirements. For more information, see [Observability in Azure Container Apps](/azure/container-apps/observability).

- **Set up Azure Monitor alerts**: Configure alerts for suspicious activities including failed authentications, unusual traffic patterns, high error rates, and resource consumption anomalies. Use action groups to enable automated response to potential security incidents. For more information, see [Azure Monitor alerts](/azure/container-apps/alerts).

- **Enable log streaming for real-time monitoring**: Use log streaming capabilities to view near real-time system and console logs from containers for immediate troubleshooting and security event detection. This capability provides rapid response capabilities during security incidents. For more information, see [Log streaming](/azure/container-apps/log-streaming).

- **Implement Application Insights integration**: Configure Application Insights integration to capture detailed telemetry, performance metrics, and custom traces from your container applications. This integration provides comprehensive observability for security analysis and performance optimization. For more information, see [Azure Functions on Azure Container Apps overview](/azure/container-apps/functions-overview).

## Compliance and governance

Compliance and governance controls ensure Container Apps deployments meet regulatory requirements and organizational policies through proper configuration management and audit capabilities.

- **Apply Azure Policy definitions**: Use built-in Azure Policy definitions to audit and enforce security configurations such as virtual network deployment, authentication requirements, and HTTPS enforcement. Policies help maintain consistent security posture across environments. For more information, see [Azure Policy built-in definitions for Azure Container Apps](/azure/container-apps/policy-reference).



- **Implement resource tagging**: Apply consistent resource tags to Container Apps resources for cost management, security monitoring, compliance tracking, and governance. Use tags to identify data classification, owner information, and regulatory requirements. For more information, see [Azure security baseline for Azure Container Apps](/security/benchmark/azure/baselines/azure-container-apps-security-baseline).

- **Configure conditional access policies**: Use Microsoft Entra conditional access policies to control access to Container Apps based on user identity, location, device compliance, and risk assessment when using authentication features. For more information, see [Azure security baseline for Azure Container Apps](/security/benchmark/azure/baselines/azure-container-apps-security-baseline).

- **Maintain audit trails and compliance documentation**: Ensure comprehensive logging captures all container app administrative actions, configuration changes, and access attempts for regulatory compliance and security investigations by using diagnostic settings and activity logs. For more information, see [Azure security baseline for Azure Container Apps](/security/benchmark/azure/baselines/azure-container-apps-security-baseline).

## Backup and recovery

Backup and recovery strategies protect container app configurations and ensure business continuity through proper disaster recovery planning and multi-region deployment strategies.

- **Enable zone redundancy for high availability**: Configure zone redundancy in Container Apps environments to automatically distribute replicas across multiple availability zones within a region. This configuration protects against zone-level failures and improves application uptime. See [Reliability in Azure Container Apps](/azure/reliability/reliability-azure-container-apps).

- **Implement multi-region deployments**: Deploy Container Apps across multiple Azure regions by using Azure Front Door or Azure Traffic Manager for automatic failover capabilities during regional outages. This strategy ensures continuous application availability for critical workloads. See [Cross-region disaster recovery and business continuity](/azure/reliability/reliability-azure-container-apps#cross-region-disaster-recovery-and-business-continuity).

- **Use infrastructure as code for deployment automation**: Implement automated deployment processes by using Azure Resource Manager templates, Bicep, or other infrastructure as code tools to ensure you can quickly redeploy container app configurations after incidents or in alternate regions. See [Management and operations for the Azure Container Apps - Landing Zone Accelerator](/azure/cloud-adoption-framework/scenarios/app-platform/container-apps/management).

- **Configure geo-redundant container registry**: Use Azure Container Registry with geo-replication enabled to ensure container images are available across multiple regions for disaster recovery scenarios. This configuration protects against registry outages and supports multi-region deployments. See [Management and operations for the Azure Container Apps - Landing Zone Accelerator](/azure/cloud-adoption-framework/scenarios/app-platform/container-apps/management#recommendations).

- **Test disaster recovery procedures**: Regularly test backup and recovery procedures including application deployment, configuration restoration, and failover processes to validate effectiveness and identify gaps in disaster recovery planning. Document test results and update procedures based on lessons learned. See [Testing backup and disaster recovery](/azure/architecture/framework/resiliency/backup-and-recovery).

## Service-specific security

Container Apps provides unique security capabilities designed specifically for containerized workloads, microservices architectures, and cloud-native applications.

- **Configure environment-level security boundaries**: Use Container Apps environments to create security boundaries between different applications and workloads. Separate production and nonproduction environments to prevent unauthorized access and configuration drift. See [Environment overview](/azure/container-apps/environment).

- **Implement proper scaling and resource limits**: Configure appropriate scaling rules and resource limits to prevent resource exhaustion attacks and ensure fair resource allocation among applications. Monitor scaling events for unusual patterns that might indicate security issues. See [Set scaling rules in Azure Container Apps](/azure/container-apps/scale-app).

## Next steps

- [Microsoft Cloud Security Benchmark - Azure Container Apps baseline](/security/benchmark/azure/baselines/azure-container-apps-security-baseline)
- [Well-Architected Framework – Azure Container Apps guide](/azure/well-architected/service-guides/azure-container-apps)
- [Zero Trust guidance center](/security/zero-trust/zero-trust-overview)
- [Microsoft Cloud Security Benchmark v2 (preview)](/security/benchmark/azure/overview)
- [Azure Security Documentation](/azure/security/)
