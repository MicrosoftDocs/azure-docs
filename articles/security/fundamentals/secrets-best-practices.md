---
title: Best practices for protecting secrets
description: Learn best practices for discovering, storing, accessing, rotating, monitoring, and protecting secrets in Azure workloads.
services: security
author: msmbaldwin

ms.assetid: 1cbbf8dc-ea94-4a7e-8fa0-c2cb198956c5
ms.service: security
ms.subservice: security-fundamentals
ms.topic: best-practice
ms.date: 07/08/2026
ms.author: mbaldwin
ai-usage: ai-assisted
---

# Best practices for protecting secrets

This article helps you protect secrets and reduce the risk of unauthorized access. Follow this guidance to help ensure that you don't store sensitive information, such as credentials, in code, GitHub repositories, logs, or continuous integration/continuous deployment (CI/CD) pipelines. The guidance in this article comes from individual service recommendations and the [Microsoft Cloud Security Benchmark](/security/benchmark/azure/introduction) (MCSB).

This article aligns with Microsoft's [Zero Trust](/security/zero-trust/zero-trust-overview) security model, which requires explicit verification, least-privilege access, and the assumption of breach. For prescriptive security controls that include Azure Policy enforcement, see [Microsoft Cloud Security Benchmark v2: Privileged Access](/security/benchmark/azure/mcsb-v2-privileged-access) and [MCSB v2: Data Protection](/security/benchmark/azure/mcsb-v2-data-protection).

## Secret discovery and prevention

Before you can secure your secrets, you need visibility into where they exist. You also need controls that prevent exposure before it occurs.

- **Conduct an audit to identify secrets**: Audit your systems and applications to identify sensitive information that needs protection, such as passwords, API keys, connection strings, and other credentials. Regular audits help ensure that your inventory accounts for new secrets and that you properly manage existing secrets. Safeguard dynamically created secrets, such as temporary OAuth tokens, with the same rigor as long-term secrets.

- **Avoid hardcoding secrets**: Embedding secrets directly into code or configuration files creates a significant security risk. If attackers compromise your codebase, they also compromise your secrets. Instead, use environment variables or configuration management tools that keep secrets out of source code. This practice minimizes the risk of accidental exposure and simplifies secret updates. Integrate secret retrieval into your automated deployment pipeline, and use secret injection patterns to help prevent accidental exposure in logs or version control. For more information, see [Recommendations for protecting application secrets](/azure/well-architected/security/application-secrets).

- **Implement secret scanning tools**: Regularly scan your codebase for embedded secrets to help prevent accidental exposure. Tools such as [Azure DevOps Credential Scanner](/azure/devops/repos/security/github-advanced-security-secret-scanning) and [GitHub secret scanning](https://docs.github.com/en/code-security/secret-security/about-secret-scanning) can automatically detect and alert you to secrets in repositories. Integrate these tools into your CI/CD pipeline for continuous monitoring. Treat any secret found by scanning tools as compromised. Immediately revoke and replace it to maintain the integrity of your security posture.

## Secure storage and encryption

Protecting secrets requires secure storage mechanisms and proper encryption at all stages.

- **Use secure key stores**: Services such as [Azure Key Vault](/azure/key-vault) and [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm) provide security features, including access control, logging, and automatic rotation. This approach centralizes secret management and reduces the risk of unauthorized access. For highly sensitive or critical secrets, use a hardware security module (HSM)-backed key store for enhanced protection compared to software-based secret stores. For customer-managed key scenarios, use Azure Key Vault Premium tier, which is HSM-backed, at minimum. Use Azure Key Vault Managed HSM for key sovereignty requirements. For an overview of Azure key management offerings and guidance on which to choose, see [Key management in Azure](key-management.md) and [How to choose the right key management solution](key-management-choose.md).

- **Encrypt secrets at rest and in transit**: [Azure Key Vault](/azure/key-vault/general/overview) securely stores secrets through envelope encryption, where key encryption keys encrypt data encryption keys to provide another layer of security. Use secure communication protocols such as HTTPS to encrypt data in transit between your applications and the key vault. In Azure, various services implement encryption at rest by using AES 256 encryption. TLS and MACsec secure data in transit. For more information, see [Encryption at rest and in transit](encryption-atrest.md).

- **Implement network isolation**: Configure [firewalls and network security groups](/azure/key-vault/general/network-security) to restrict access to your key vaults. Allow only trusted applications and services to access your secrets. This approach minimizes the attack surface and helps prevent unauthorized access. Consider using multiple key vaults to create isolation boundaries for different components. If attackers compromise one component, the component can't gain control of other secrets or the entire workload.

## Access control and identity

Managing who and what can access secrets is critical for maintaining security.

- **Use managed identities**: [Managed identities](/entra/identity/managed-identities-azure-resources/overview) in Azure provide a secure way for applications to authenticate to Azure services without storing credentials in code. Enable managed identities for Azure resources to securely access Azure Key Vault and other services, reducing the need to handle secrets manually. This approach minimizes secret creation and reduces the surface area for potential breaches because the platform manages the credentials.

- **Apply granular access control**: Follow the principle of least privilege by applying granular access control to your secrets. Use [Azure role-based access control](../../role-based-access-control/overview.md) (Azure RBAC) to ensure that only authorized entities have access to specific secrets. Regularly review and update access permissions to prevent unauthorized access. Implement distinct roles such as user, administrator, and auditor to manage access to secrets. This practice helps ensure that only trusted identities have the appropriate level of permission. For more information, see the [Azure Key Vault RBAC guide](/azure/key-vault/general/rbac-guide).

## Secret lifecycle management

Secrets require ongoing management throughout their lifecycle, from creation to retirement.

- **Rotate secrets regularly**: Secrets are susceptible to leakage or exposure over time. Regularly rotate your secrets to reduce the risk of unauthorized access. You can [rotate secrets in Azure Key Vault](/azure/key-vault/secrets/tutorial-rotation) for certain secrets. For secrets that can't rotate automatically, establish a manual rotation process and purge them when they're no longer in use. Automate secret rotation and build redundancy into your secret management to help ensure that rotation doesn't disrupt service availability. Implement retry logic and concurrent access patterns in your code to help minimize problems during the rotation window.

- **Distribute secrets safely**: When you distribute secrets, share them securely within and outside the organization. Use tools designed for secure sharing, and include secret recovery procedures in your disaster recovery plans. If attackers compromise or leak a key, regenerate it immediately. Use distinct keys for each consumer rather than sharing keys, even if consumers have similar access patterns. This practice simplifies key management and revocation, so you can revoke compromised keys without affecting other consumers.

## Monitoring and logging

Continuous monitoring detects suspicious activity and supports compliance requirements.

- **Monitor and log access**: Enable logging and monitoring for your secret management system to track access and usage. Use [Key Vault logging](/azure/key-vault/general/logging), [Azure Monitor](/azure/azure-monitor/overview), or [Azure Event Grid](../../event-grid/overview.md) to monitor all activities related to your secrets. Monitoring provides visibility into who accessed your secrets and helps detect suspicious behavior or potential security incidents. Maintain detailed audit trails for inspecting and validating access to secrets, which can help prevent identity theft, avoid repudiation, and reduce unnecessary exposure.

## Service-specific guidance for secrets handling

Individual services might have more best practices and guidance for protecting secrets. Examples include:

- API Management: [Use named values in Azure API Management policies with Key Vault integration](../../api-management/api-management-howto-properties.md)
- App Service: [Use Key Vault references for App Service and Azure Functions](../../app-service/app-service-key-vault-references.md)
- Application Gateway: [Configure TLS termination for Application Gateway by using the Azure portal](../../application-gateway/create-ssl-portal.md#configuration-tab)
- Automation: [Manage credentials in Azure Automation](../../automation/shared-resources/credentials.md?tabs=azure-powershell)
- Azure AI Foundry: [Develop Foundry Tools applications with Azure Key Vault](/azure/ai-services/use-key-vault?tabs=azure-cli&pivots=programming-language-csharp)
- Azure App Configuration: [Use Key Vault references in an ASP.NET Core app](../../azure-app-configuration/use-key-vault-references-dotnet-core.md)
- Azure Bot Service: [Azure Bot Service encryption for data at rest](/azure/bot-service/bot-service-encryption)
- Azure Center for SAP solutions: [Prepare the network for Azure Center for SAP solutions deployment](../../sap/center-sap-solutions/prepare-network.md#allow-list-a-key-vault)
- Azure Communication Services: [Create and manage access tokens](../../communication-services/quickstarts/identity/access-tokens.md)
- Azure Communications Gateway: [Create and store secrets](/azure/communications-gateway/prepare-to-deploy#4-create-and-store-secrets)
- Azure Container Apps: [Manage secrets in Azure Container Apps](../../container-apps/manage-secrets.md)
- Azure Cosmos DB: [Configure customer-managed keys for Azure Cosmos DB](/azure/cosmos-db/how-to-setup-cmk)
- Azure Database for PostgreSQL - Flexible Server: [Data encryption with a customer-managed key](/azure/postgresql/flexible-server/concepts-data-encryption)
- Azure Databricks: [Key Vault integration in Azure Databricks](/azure/databricks/security/secrets/secret-scopes)
- Azure DevTest Labs: [Enable user-assigned managed identities on lab virtual machines in Azure DevTest Labs](../../devtest-labs/enable-managed-identities-lab-vms.md)
- Azure Event Hubs: [Configure customer-managed keys for encrypting Azure Event Hubs data at rest](../../event-hubs/configure-customer-managed-key.md)
- Azure Front Door: [Azure Front Door secrets](../../frontdoor/create-front-door-portal.md)
- Azure HDInsight on AKS: [Create Azure Key Vault resource prerequisites](/azure/hdinsight-aks/prerequisites-resources)
- Azure Information Protection: [Key Vault support for Azure Information Protection](/azure/information-protection/byok-price-restrictions#azure-key-vault-key-storage)
- Azure Kubernetes Service (AKS): [CSI Secret Store](/azure/aks/csi-secrets-store-driver)
- Azure Machine Learning: [Use authentication credential secrets in Azure Machine Learning jobs](/azure/machine-learning/how-to-use-secrets-in-runs)
- Azure Managed Applications: [Access Key Vault secrets when deploying Azure Managed Applications](../../azure-resource-manager/managed-applications/key-vault-access.md)
- Azure Pipelines: [Protect secrets in Azure Pipelines](/azure/devops/pipelines/security/secrets)
- Azure Service Bus: [Integrate Service Bus with Service Connector](../../service-connector/how-to-integrate-service-bus.md)
- Azure SignalR Service: [Key Vault secret reference in URL template settings](../../azure-signalr/concept-upstream.md#key-vault-secret-reference-in-url-template-settings)
- Azure Spring Apps: [Integrate Azure Key Vault with Service Connector](../../service-connector/how-to-integrate-key-vault.md)
- Azure Stack Edge: [Manage Azure Stack Edge secrets by using Azure Key Vault](../../databox-online/azure-stack-edge-gpu-activation-key-vault.md)
- Azure Stack Hub: [Rotate secrets](/azure-stack/operator/azure-stack-rotate-secrets)
- Azure Web PubSub: [Add a custom certificate](../../azure-web-pubsub/howto-custom-domain.md?tabs=vault-access-policy%2Cazure-powershell#add-a-custom-certificate)
- Backup: [Configure a vault to encrypt by using customer-managed keys](../../backup/encryption-at-rest-with-cmk.md?tabs=portal#configure-a-vault-to-encrypt-by-using-customer-managed-keys)
- Data Factory: [Store credentials in Azure Key Vault](../../data-factory/store-credentials-in-key-vault.md)
- ExpressRoute: [Configure MACsec encryption for ExpressRoute Direct](../../expressroute/expressroute-howto-macsec.md)
- Functions: [Use Key Vault references for App Service and Azure Functions](../../app-service/app-service-key-vault-references.md?toc=%2Fazure%2Fazure-functions%2Ftoc.json)
- Key Vault: [About Azure Key Vault secrets](/azure/key-vault/secrets/about-secrets)
- Logic Apps: [Logic Apps Standard app settings](../../app-service/app-service-key-vault-references.md?tabs=azure-cli)
- Microsoft Purview: [Credentials for source authentication in Microsoft Purview](/azure/purview/manage-credentials)
- Service Fabric: [KeyVaultReference support for Service Fabric applications](/azure/service-fabric/service-fabric-keyvault-references)
- SQL Server on Azure VMs: [Configure Azure Key Vault integration for SQL Server on Azure VMs](/azure/azure-sql/virtual-machines/windows/azure-key-vault-integration-configure)
- Storage: [Authorize access to data in Azure Storage](../../storage/common/authorize-data-access.md)

## Next steps

Minimizing security risk is a shared responsibility. Proactively take steps to secure your workloads. For more information, see [Shared responsibility in the cloud](shared-responsibility.md).

- See [Azure security best practices and patterns](best-practices-and-patterns.md) for more security best practices to use when you're designing, deploying, and managing your cloud solutions by using Azure.
- Review the [Microsoft Cloud Security Benchmark v2: Privileged Access](/security/benchmark/azure/mcsb-v2-privileged-access) controls for comprehensive secrets and privileged access guidance and Azure Policy mappings.
- Learn about the [Microsoft Secure Future Initiative](/security/zero-trust/sfi/secure-future-initiative-overview), Microsoft's internal security best practices for protecting identities and secrets that Microsoft also recommends to organizations.
- Explore [Zero Trust deployment for identity](/security/zero-trust/deploy/identity) for guidance on implementing Zero Trust principles for identity and access management.
