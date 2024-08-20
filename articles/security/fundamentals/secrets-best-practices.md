---
title: Best practices for protecting secrets
description: This article links you to security best practices for protecting secrets.
services: security
author: msmbaldwin

ms.assetid: 1cbbf8dc-ea94-4a7e-8fa0-c2cb198956c5
ms.service: security
ms.subservice: security-fundamentals
ms.topic: conceptual
ms.date: 08/30/2024
ms.author: mbaldwin
ai-usage: ai-assisted
---

# Best practices for protecting secrets

This article provides guidance on protecting your secrets and reducing the risk of unauthorized access. Follow this guidance to help ensure you do not store sensitive information such as credentials in code, GitHub repositories, logs, continuous integration/continuous deployment (CI/CD) pipelines, and so forth. The guidance in this article is compiled from recommendations of individual services, as well as from the [Microsoft Cloud Security Benchmark](/security/benchmark/overview) (MCSB).

## General best practices

In today's digital landscape, securing sensitive information such as application credentials and secrets is paramount. A breach can lead to severe consequences, including data loss, financial penalties, and damage to reputation. Implementing a comprehensive secret management strategy is essential to mitigating these risks.

### Conduct an audit to identify secrets

Before you can secure your secrets, you need to know where they are. Conducting a thorough audit of your systems and applications helps identify all the sensitive information that needs protection. This includes passwords, API keys, connection strings, and other credentials. Regular audits ensure that new secrets are accounted for and existing ones are properly managed. 

It's important to note that even dynamically created secrets, such as OAuth tokens, which may be temporary, still need to be safeguarded with the same rigor as long-term secrets.

### Avoid hardcoding secrets

Embedding secrets directly into your code or configuration files is a significant security risk. If your codebase is compromised, so are your secrets. Instead, use environment variables or configuration management tools that keep secrets out of your source code. This practice minimizes the risk of accidental exposure and simplifies the process of updating secrets. 

Additionally, integrating secret retrieval into your automated deployment pipeline and using secret injection patterns can prevent secrets from being accidentally exposed in logs or version control, further enhancing the security of your deployment process.

See:

- [Recommendations for protecting application secrets](/azure/well-architected/security/application-secrets)

### Use secure key stores

Leveraging secure key stores ensures that your secrets are stored in a secure, encrypted location. Services like Azure Key Vault provide robust security features, including access control, logging, and automatic rotation. For even greater security, particularly for highly sensitive or critical secrets, consider using Hardware Security Modules (HSMs), which offer enhanced protection compared to software-based secret stores. This approach centralizes the management of your secrets and reduces the risk of unauthorized access.

See:

- [Key management in Azure](key-management.md)
- [Azure Key Vault](/azure/key-vault/general/overview)
- [Azure Managed HSM](/azure/key-vault/managed-hsm/overview)

### Implement secret scanning tools

Regularly scanning your codebase for embedded secrets can prevent accidental exposure. Tools like Azure DevOps Credential Scanner and GitHub's native secret scanning feature can automatically detect and alert you to any secrets found in your repositories. Integrating these tools into your CI/CD pipeline ensures continuous monitoring. It is crucial to treat any secret found by these scanning tools as compromised, which means it should be immediately revoked and replaced to maintain the integrity of your security posture.

See:

- [Azure DevOps Credential Scanner](/azure/devops/repos/git/secret-scanning)
- [GitHub secret scanning](https://docs.github.com/en/code-security/secret-security/about-secret-scanning)

### Leverage managed identities

Managed identities in Azure provide a secure way for applications to authenticate to Azure services without storing credentials in the code. By enabling managed identities for Azure resources, you can securely access Azure Key Vault and other services, reducing the need to handle secrets manually. This approach not only minimizes the creation of secrets but also reduces the surface area for potential breaches, as the responsibility for managing credentials is delegated to the platform.

See:

- [Azure managed identities](/azure/active-directory/managed-identities-azure-resources/overview)

### Apply granular access control

Follow the principle of least privilege by applying granular access control to your secrets. Use Azure role-based access control (RBAC) to ensure that only authorized entities have access to specific secrets. Regularly review and update access permissions to prevent unauthorized access. It's also advisable to implement distinct roles such as user, administrator, and auditor to manage access to secrets, ensuring that only trusted identities have the appropriate level of permission.

See:

- [Azure role-based access control](/azure/role-based-access-control/overview)
- [Key Vault: RBAC](/azure/key-vault/general/rbac-guide)

### Rotate secrets regularly

Secrets are susceptible to leakage or exposure over time. Regularly rotating your secrets reduces the risk of unauthorized access. Azure Key Vault supports automatic rotation for certain secrets, but for those that cannot be automatically rotated, establish a manual rotation process and ensure they are purged when no longer in use. Automating the secret rotation process and building redundancy into your secret management can ensure that rotation does not disrupt service availability. Implementing retry logic and concurrent access patterns in your code can help minimize issues during the rotation window.

See:

- [Rotate secrets in Azure Key Vault](/azure/key-vault/secrets/rotate)

### Monitor and log access

Enable logging and monitoring for your secret management system to track access and usage. Use services like Azure Monitor and Azure Event Grid to monitor all activities related to your secrets. This provides visibility into who accessed your secrets and helps detect any suspicious behavior or potential security incidents. Maintaining detailed audit trails is critical for inspecting and validating access to secrets, which can help prevent identity theft, avoid repudiation, and reduce unnecessary exposure.

See:

- [Key Vault logging](/azure/key-vault/key-vault-logging)
- [Azure Monitor](/azure/azure-monitor/overview)
- [Azure Event Grid](/azure/event-grid/overview)

### Implement network isolation

Reduce the exposure of your secrets by implementing network isolation. Configure firewalls and network security groups to restrict access to your key vaults. Only allow trusted applications and services to access your secrets, minimizing the attack surface and preventing unauthorized access. Additionally, consider using multiple key vaults to create isolation boundaries for different components, ensuring that if one component is compromised, it cannot gain control of other secrets or the entire workload.

See:

- [Isolation in the Azure Public Cloud](isolation-choice.md)

### Encrypt secrets at rest and in transit

Ensure that your secrets are encrypted both at rest and in transit. Azure Key Vault automatically encrypts secrets at rest using industry-standard encryption algorithms. Additionally, use secure communication protocols like HTTPS to encrypt data in transit between your applications and the key vault. This approach ensures that your secrets remain protected from unauthorized access during storage and transmission.

See:

- [Encryption at rest and in transit](encryption.md)

### Safe Distribution of Secrets

When distributing secrets, ensure they are shared securely within and outside the organization. Use tools designed for secure sharing and include secret recovery procedures in your disaster recovery plans. If a key is compromised or leaked, it should be regenerated immediately. To further enhance security, use distinct keys for each consumer rather than sharing keys, even if they have similar access patterns. This practice simplifies key management and revocation, ensuring that compromised keys can be revoked without affecting other consumers.

## Service-specific best practices

These best practices are intended to be a resource for IT pros. This might include designers, architects, developers, and testers who build and deploy secure Azure solutions.

- Azure Stack Hub: [Rotate secrets](/azure-stack/operator/azure-stack-rotate-secrets)
- Azure Key Vault: [Centralize storage of application secrets](../../key-vault/general/overview.md)
- Azure Communications Service: [Create and manage access tokens](../../communication-services/quickstarts/identity/access-tokens.md)
- Azure Service Bus: [Authenticate and authorize an application with Microsoft Entra ID to access Azure Service Bus entities](../../service-bus-messaging/authenticate-application.md)
- Azure App Service: [Learn to configure common settings for an App Service application](../../app-service/configure-common.md)
- Azure Pipelines: [Protecting secrets in Azure Pipelines](/azure/devops/pipelines/security/secrets)

## Next steps

Minimizing security risk is a shared responsibility. You need to be proactive in taking steps to secure your workloads. [Learn more about shared responsibility in the cloud](shared-responsibility.md).

See [Azure security best practices and patterns](best-practices-and-patterns.md) for more security best practices to use when you're designing, deploying, and managing your cloud solutions by using Azure.
