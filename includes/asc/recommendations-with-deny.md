---
author: memildin
ms.service: defender-for-cloud
ms.topic: include
ms.date: 08/24/2022
ms.author: memildin
ms.custom: generated
---

- [Enable if required] Azure Cosmos DB accounts should use customer-managed keys to encrypt data at rest
- [Enable if required] Azure Machine Learning workspaces should be encrypted with a customer-managed key (CMK)
- [Enable if required] Cognitive Services accounts should enable data encryption with a customer-managed key (CMK)
- [Enable if required] Container registries should be encrypted with a customer-managed key (CMK)
- Access to storage accounts with firewall and virtual network configurations should be restricted
- Automation account variables should be encrypted
- Azure Cache for Redis should reside within a virtual network
- Azure Spring Cloud should use network injection
- Container CPU and memory limits should be enforced
- Container images should be deployed from trusted registries only
- Container with privilege escalation should be avoided
- Containers sharing sensitive host namespaces should be avoided
- Containers should only use allowed AppArmor profiles
- Immutable (read-only) root filesystem should be enforced for containers
- Key Vault keys should have an expiration date
- Key Vault secrets should have an expiration date
- Key vaults should have purge protection enabled
- Key vaults should have soft delete enabled
- Least privileged Linux capabilities should be enforced for containers
- Privileged containers should be avoided
- Redis Cache should allow access only via SSL
- Running containers as root user should be avoided
- Secure transfer to storage accounts should be enabled
- Service Fabric clusters should have the ClusterProtectionLevel property set to EncryptAndSign
- Service Fabric clusters should only use Azure Active Directory for client authentication
- Services should listen on allowed ports only
- Storage account public access should be disallowed
- Storage accounts should be migrated to new Azure Resource Manager resources
- Storage accounts should restrict network access using virtual network rules
- Usage of host networking and ports should be restricted
- Usage of pod HostPath volume mounts should be restricted to a known list to restrict node access from compromised containers
- Validity period of certificates stored in Azure Key Vault should not exceed 12 months
- Virtual machines should be migrated to new Azure Resource Manager resources
- Web Application Firewall (WAF) should be enabled for Application Gateway
- Web Application Firewall (WAF) should be enabled for Azure Front Door Service service

