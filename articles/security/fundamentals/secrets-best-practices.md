---
title: Best practices for protecting secrets
description: This article links you to security best practices for protecting secrets.
services: security
author: msmbaldwin

ms.assetid: 1cbbf8dc-ea94-4a7e-8fa0-c2cb198956c5
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 05/05/2026
ms.author: mbaldwin
ai-usage: ai-assisted
---

# Best practices for protecting secrets

This article provides guidance on protecting your secrets and reducing the risk of unauthorized access. Follow this guidance to help ensure you do not store sensitive information such as credentials in code, GitHub repositories, logs, continuous integration/continuous deployment (CI/CD) pipelines, and so forth. The guidance in this article is compiled from recommendations of individual services, as well as from the [Microsoft Cloud Security Benchmark](/security/benchmark/azure/introduction) (MCSB).

This article aligns with Microsoft's [Zero Trust](/security/zero-trust/zero-trust-overview) security model, which requires explicit verification, least-privilege access, and the assumption of breach. For prescriptive security controls with Azure Policy enforcement, see [Microsoft Cloud Security Benchmark v2 - Privileged Access](/security/benchmark/azure/mcsb-v2-privileged-access) and [MCSB v2 - Data Protection](/security/benchmark/azure/mcsb-v2-data-protection).

## Secret discovery and prevention

Before you can secure your secrets, you need visibility into where they exist and prevent them from being exposed in the first place.

- **Conduct an audit to identify secrets**: Conducting a thorough audit of your systems and applications helps identify all the sensitive information that needs protection. This includes passwords, API keys, connection strings, and other credentials. Regular audits ensure that new secrets are accounted for and existing ones are properly managed. Even dynamically created secrets, such as OAuth tokens, which may be temporary, still need to be safeguarded with the same rigor as long-term secrets.

- **Avoid hardcoding secrets**: Embedding secrets directly into your code or configuration files is a significant security risk. If your codebase is compromised, so are your secrets. Instead, use environment variables or configuration management tools that keep secrets out of your source code. This practice minimizes the risk of accidental exposure and simplifies the process of updating secrets. Additionally, integrating secret retrieval into your automated deployment pipeline and using secret injection patterns can prevent secrets from being accidentally exposed in logs or version control. For more information, see [Recommendations for protecting application secrets](/azure/well-architected/security/application-secrets).

- **Implement secret scanning tools**: Regularly scanning your codebase for embedded secrets can prevent accidental exposure. Tools like [Azure DevOps Credential Scanner](/azure/devops/repos/security/github-advanced-security-secret-scanning) and [GitHub secret scanning](https://docs.github.com/en/code-security/secret-security/about-secret-scanning) can automatically detect and alert you to any secrets found in your repositories. Integrating these tools into your CI/CD pipeline ensures continuous monitoring. Treat any secret found by these scanning tools as compromised, which means it should be immediately revoked and replaced to maintain the integrity of your security posture.

## Secure storage and encryption

Protecting secrets requires secure storage mechanisms and proper encryption at all stages.

- **Use secure key stores**: Services like [Azure Key Vault](/azure/key-vault) and [Azure Managed HSM](/azure/key-vault/managed-hsm) provide robust security features, including access control, logging, and automatic rotation. This approach centralizes the management of your secrets and reduces the risk of unauthorized access. For even greater security, particularly for highly sensitive or critical secrets, consider encrypting the secret with a key store in a Hardware Security Module (HSM), which offers enhanced protection compared to software-based secret stores. For customer-managed key scenarios, use Azure Key Vault Premium tier (HSM-backed) at minimum, or Azure Managed HSM for key sovereignty requirements. For an overview of all the key management offerings in Azure and guidance on which to choose, see [Key management in Azure](key-management.md) and [How to choose the right key management solution](key-management-choose.md).

- **Encrypt secrets at rest and in transit**: [Azure Key Vault](/azure/key-vault/general/overview) securely stores secrets using envelope encryption, where Data Encryption Keys (DEKs) are encrypted by Key Encryption Keys (KEKs), providing an additional layer of security. Use secure communication protocols like HTTPS to encrypt data in transit between your applications and the key vault. In Azure, encryption at rest is implemented across various services using AES 256 encryption, while data in transit is secured through TLS and MACsec. For more details, see [Encryption at rest and in transit](encryption-atrest.md).

- **Implement network isolation**: Configure [firewalls and network security groups](/azure/key-vault/general/network-security) to restrict access to your key vaults. Only allow trusted applications and services to access your secrets, minimizing the attack surface and preventing unauthorized access. Consider using multiple key vaults to create isolation boundaries for different components, ensuring that if one component is compromised, it cannot gain control of other secrets or the entire workload.

## Access control and identity

Managing who and what can access secrets is critical for maintaining security.

- **Leverage managed identities**: [Managed identities](/entra/identity/managed-identities-azure-resources/overview) in Azure provide a secure way for applications to authenticate to Azure services without storing credentials in the code. By enabling managed identities for Azure resources, you can securely access Azure Key Vault and other services, reducing the need to handle secrets manually. This approach not only minimizes the creation of secrets but also reduces the surface area for potential breaches, as the responsibility for managing credentials is delegated to the platform.

- **Apply granular access control**: Follow the principle of least privilege by applying granular access control to your secrets. Use [Azure role-based access control](../../role-based-access-control/overview.md) (RBAC) to ensure that only authorized entities have access to specific secrets. Regularly review and update access permissions to prevent unauthorized access. Implement distinct roles such as user, administrator, and auditor to manage access to secrets, ensuring that only trusted identities have the appropriate level of permission. See the [Azure Key Vault RBAC guide](/azure/key-vault/general/rbac-guide).

## Secret lifecycle management

Secrets require ongoing management throughout their lifecycle, from creation to retirement.

- **Rotate secrets regularly**: Secrets are susceptible to leakage or exposure over time. Regularly rotating your secrets reduces the risk of unauthorized access. You can [rotate secrets in Azure Key Vault](/azure/key-vault/secrets/tutorial-rotation) for certain secrets; for those that cannot be automatically rotated, establish a manual rotation process and ensure they are purged when no longer in use. Automating the secret rotation process and building redundancy into your secret management can ensure that rotation does not disrupt service availability. Implementing retry logic and concurrent access patterns in your code can help minimize issues during the rotation window.

- **Distribute secrets safely**: When distributing secrets, ensure they are shared securely within and outside the organization. Use tools designed for secure sharing and include secret recovery procedures in your disaster recovery plans. If a key is compromised or leaked, it should be regenerated immediately. Use distinct keys for each consumer rather than sharing keys, even if they have similar access patterns. This practice simplifies key management and revocation, ensuring that compromised keys can be revoked without affecting other consumers.

## Monitoring and logging

Continuous monitoring enables detection of suspicious activity and supports compliance requirements.

- **Monitor and log access**: Enable logging and monitoring for your secret management system to track access and usage. Use [Key Vault logging](/azure/key-vault/key-vault-logging) and/or services like [Azure Monitor](/azure/azure-monitor/overview) and [Azure Event Grid](../../event-grid/overview.md), to monitor all activities related to your secrets. This provides visibility into who accessed your secrets and helps detect any suspicious behavior or potential security incidents. Maintaining detailed audit trails is critical for inspecting and validating access to secrets, which can help prevent identity theft, avoid repudiation, and reduce unnecessary exposure.

## Service-specific guidance for secrets handling

Individual services may have additional best practices and guidance for protecting secrets. Here are some examples:

- API Management: [Use named values in Azure API Management policies with Key Vault Integration](../../api-management/api-management-howto-properties.md)
- App Service: [Use Key Vault references for App Service and Azure Functions](../../app-service/app-service-key-vault-references.md)
- Application Gateway: [Configure an Application Gateway with TLS termination using the Azure portal](../../application-gateway/create-ssl-portal.md#configuration-tab)
- Automation: [Manage credentials in Azure Automation](../../automation/shared-resources/credentials.md?tabs=azure-powershell)
- Azure App Configuration: [Tutorial: Use Key Vault references in an ASP.NET Core app](../../azure-app-configuration/use-key-vault-references-dotnet-core.md)
- Azure Bot Service: [Azure Bot Service encryption for data at rest](/azure/bot-service/bot-service-encryption)
- Azure Center for SAP solutions: [Azure Center for SAP Solutions - Deployment - Prepare network for deployment](../../sap/center-sap-solutions/prepare-network.md#allow-list-a-key-vault)
- Azure Communications Gateway: [Create and store secrets](/azure/communications-gateway/prepare-to-deploy#4-create-and-store-secrets)
- Azure Communications Service: [Create and manage access tokens](../../communication-services/quickstarts/identity/access-tokens.md)
- Azure Container Apps: [Manage secrets in Azure Container Apps](../../container-apps/manage-secrets.md)
- Azure Cosmos DB: [Configure customer-managed keys for your Azure Cosmos DB account](/azure/cosmos-db/how-to-setup-cmk)
- Azure Database for PostgreSQL - Flexible Server: [Azure Database for PostgreSQL - Flexible Server Data Encryption with a Customer-managed Key](/azure/postgresql/flexible-server/concepts-data-encryption)
- Azure Databricks: [Key Vault Integration in Databricks](/azure/databricks/security/secrets/secret-scopes)
- Azure DevTest Labs: [Enable user-assigned managed identities on lab virtual machines in Azure DevTest Labs](../../devtest-labs/enable-managed-identities-lab-vms.md)
- Azure Event Hubs: [Configure customer-managed keys for encrypting Azure Event Hubs data at rest](../../event-hubs/configure-customer-managed-key.md)
- Azure Front Door: [Azure Front Door Secrets](../../frontdoor/create-front-door-portal.md)
- Azure HDInsight on AKS: [Resource prerequisites - Create Azure Key Vault](/azure/hdinsight-aks/prerequisites-resources)
- Azure Information Protection: [Details for Azure Information Protection Key Vault Support](/azure/information-protection/byok-price-restrictions#azure-key-vault-key-storage)
- Azure Kubernetes Service (AKS): [CSI Secret Store](/azure/aks/csi-secrets-store-driver)
- Azure Managed Applications: [Access Key Vault secret when deploying Azure Managed Applications](../../azure-resource-manager/managed-applications/key-vault-access.md)
- Azure OpenAI: [Develop Foundry Tools applications with Key Vault](/azure/ai-services/use-key-vault?tabs=azure-cli&pivots=programming-language-csharp)
- Azure Pipelines: [Protecting secrets in Azure Pipelines](/azure/devops/pipelines/security/secrets)
- Azure Purview: [Credentials for source authentication in Microsoft Purview](/azure/purview/manage-credentials)
- Azure Service Bus: [Integrate Service Bus with Service Connector](../../service-connector/how-to-integrate-service-bus.md)
- Azure SignalR Service: [Key Vault secret reference in URL template settings](../../azure-signalr/concept-upstream.md#key-vault-secret-reference-in-url-template-settings)
- Azure Spring Apps: [Integrate Azure Key Vault with Service Connector](../../service-connector/how-to-integrate-key-vault.md)
- Azure Stack Edge: [Manage Azure Stack Edge secrets using Azure Key Vault](../../databox-online/azure-stack-edge-gpu-activation-key-vault.md)
- Azure Stack Hub: [Rotate secrets](/azure-stack/operator/azure-stack-rotate-secrets)
- Azure Web PubSub: [Add a custom certificate](../../azure-web-pubsub/howto-custom-domain.md?tabs=vault-access-policy%2Cazure-powershell#add-a-custom-certificate)
- Backup: [Configure a vault to encrypt using customer-managed keys](../../backup/encryption-at-rest-with-cmk.md?tabs=portal#configure-a-vault-to-encrypt-by-using-customer-managed-keys)
- Cognitive Services: [Develop Azure Cognitive Services applications with Key Vault](/azure/cognitive-services/use-key-vault?tabs=azure-cli&pivots=programming-language-csharp)
- Data Factory: [Store credentials in Azure Key Vault](../../data-factory/store-credentials-in-key-vault.md)
- ExpressRoute: [Configure MACsec encryption for ExpressRoute Direct.](../../expressroute/expressroute-howto-macsec.md)
- Functions: [Use Key Vault references for App Service and Azure Functions](../../app-service/app-service-key-vault-references.md?toc=%2Fazure%2Fazure-functions%2Ftoc.json)
- Key Vault: [About Azure Key Vault secrets](/azure/key-vault/secrets/about-secrets)
- Logic Apps: [Logic Apps Standard App Settings](../../app-service/app-service-key-vault-references.md?tabs=azure-cli)
- Machine Learning Service: [Use authentication credential secrets in Azure Machine Learning jobs](/azure/machine-learning/how-to-use-secrets-in-runs)
- Service Fabric: [KeyVaultReference support for Service Fabric applications](/azure/service-fabric/service-fabric-keyvault-references)
- SQL IaaS: [Configure Azure Key Vault integration for SQL Server on Azure VMs (Resource Manager)](/azure/azure-sql/virtual-machines/windows/azure-key-vault-integration-configure)
- Storage: [Authorize access to data in Azure Storage](../../storage/common/authorize-data-access.md)

## Next steps

Minimizing security risk is a shared responsibility. You need to be proactive in taking steps to secure your workloads. [Learn more about shared responsibility in the cloud](shared-responsibility.md).

- See [Azure security best practices and patterns](best-practices-and-patterns.md) for more security best practices to use when you're designing, deploying, and managing your cloud solutions by using Azure.
- Review the [Microsoft Cloud Security Benchmark v2 - Privileged Access](/security/benchmark/azure/mcsb-v2-privileged-access) controls for comprehensive secrets and privileged access guidance with Azure Policy mappings.
- Learn about the [Microsoft Secure Future Initiative (SFI)](/security/zero-trust/sfi/secure-future-initiative-overview), Microsoft's internal security best practices for protecting identities and secrets that we also recommend to customers.
- Explore [Zero Trust deployment for identity](/security/zero-trust/deploy/identity) for guidance on implementing Zero Trust principles for identity and access management.
