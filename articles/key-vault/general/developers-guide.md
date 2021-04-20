---
title: Azure Key Vault Developer's Guide
description: Developers can use Azure Key Vault to manage cryptographic keys within the Microsoft Azure environment.
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: general
ms.topic: how-to
ms.date: 10/05/2020
ms.author: mbaldwin
---
# Azure Key Vault Developer's Guide

Key Vault allows you to securely access sensitive information from within your applications:

- Keys, secrets, and certificates are protected without having to write the code yourself and you're easily able to use them from your applications.
- You allow customers to own and manage their own keys, secrets, and certificates so you can concentrate on providing the core software features. In this way, your applications will not own the responsibility or potential liability for your customers' tenant keys, secrets, and certificates.
- Your application can use keys for signing and encryption yet keeps the key management external from your application. For more information about keys, see [About Keys](../keys/about-keys.md)
- You can manage credentials like passwords, access keys, and sas tokens by storing them in Key Vault as secrets, see [About Secrets](../secrets/about-secrets.md)
- Manage certificates. For more information, see [About Certificates](../certificates/about-certificates.md)

For more general information on Azure Key Vault, see [What is Key Vault](overview.md).

## Public Previews

Periodically, we release a public preview of a new Key Vault feature. Try out public preview features and let us know what you think via azurekeyvault@microsoft.com, our feedback email address.

## Creating and Managing Key Vaults

Key Vault management, similar to other Azure services, is done through Azure Resource Manager service. Azure Resource Manager is the deployment and management service for Azure. It provides a management layer that enables you to create, update, and delete resources in your Azure account. For more information, see [Azure Resource Manager](../../azure-resource-manager/management/overview.md)

Access to management layer is controlled by [Azure role-based access control](../../role-based-access-control/overview.md). In Key Vault, management layer, also known as management or control plane, let you create and manage Key Vaults and its attributes including access policies, but not keys, secrets and certificates, which are managed on data plane. You can use pre-defined `Key Vault Contributor` role to grant management access to Key Vault.     

**API's and SDKs for key vault management:**

| Azure CLI | PowerShell | REST API | Resource Manager | .NET | Python | Java | JavaScript |  
|--|--|--|--|--|--|--|--|
|[Reference](/cli/azure/keyvault)<br>[Quickstart](quick-create-cli.md)|[Reference](/powershell/module/az.keyvault)<br>[Quickstart](quick-create-powershell.md)|[Reference](/rest/api/keyvault/)|[Reference](/azure/templates/microsoft.keyvault/vaults)<br>[Quickstart](./vault-create-template.md)|[Reference](/dotnet/api/microsoft.azure.management.keyvault)|[Reference](/python/api/azure-mgmt-keyvault/azure.mgmt.keyvault)|[Reference](/java/api/com.microsoft.azure.management.keyvault)|[Reference](/javascript/api/@azure/arm-keyvault)|

See [Client Libraries](client-libraries.md) for installation packages and source code.

For more information about Key Vault management plane, see [Key Vault Management Plane](security-overview.md)

## Authenticate to Key Vault in code

Key Vault is using Azure AD authentication that requires Azure AD security principal to grant access. An Azure AD security principal may be a user, an application service principal, a [managed identity for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md), or a group of any type of security principals.

### Authentication best practices

It is recommended to use managed identity for applications deployed to Azure. If you use Azure services, which do not support managed identity or if applications are deployed on premise, [service principal with a certificate](../../active-directory/develop/howto-create-service-principal-portal.md) is a possible alternative. In that scenario, certificate should be stored in Key Vault and rotated often. Service principal with secret can be used for development and testing environments, and locally or in Cloud Shell using user principal is recommended.

Recommended security principals per environment:
- **Production environment**:
  - Managed identity or service principal with a certificate
- **Test and development environments**:
  - Managed identity, service principal with certificate or service principal with secret
- **Local development**:
  - User principal or service principal with secret

Above authentications scenarios are supported by **Azure Identity client library** and integrated with Key Vault SDKs. Azure Identity library can be used across different environments and platforms without changing your code. Azure Identity would also automatically retrieve authentication token from logged in to Azure user with Azure CLI, Visual Studio, Visual Studio Code, and others. 

For more information about Azure Identity client libarary, see:

**Azure Identity client libraries**

| .NET | Python | Java | JavaScript |
|--|--|--|--|
|[Azure Identity SDK .NET](/dotnet/api/overview/azure/identity-readme)|[Azure Identity SDK Python](/python/api/overview/azure/identity-readme)|[Azure Identity SDK Java](/java/api/overview/azure/identity-readme)|[Azure Identity SDK JavaScript](/javascript/api/overview/azure/identity-readme)|     

>[!Note]
> [App Authentication library](/dotnet/api/overview/azure/service-to-service-authentication) which was recommended for Key Vault .NET SDK version 3, which is currently depracated . Please follow [AppAuthentication to Azure.Identity Migration Guidance](/dotnet/api/overview/azure/app-auth-migration) to migrate to Key Vault .NET SDK Version 4.

For tutorials on how to authenticate to Key Vault in applications, see:
- [Authenticate to Key Vault in application hosted in VM in .NET](./tutorial-net-virtual-machine.md)
- [Authenticate to Key Vault in application hosted in VM in Python](./tutorial-python-virtual-machine.md)
- [Authenticate to Key Vault with App Service](./tutorial-net-create-vault-azure-web-app.md)

## Manage keys, certificates, and secrets

Access to keys, secrets, and certificates is controlled by data plane. Data plane access control can be done using local vault access policies or Azure RBAC.

**Keys API's and SDKs**

| Azure CLI | PowerShell | REST API | Resource Manager | .NET | Python | Java | JavaScript |  
|--|--|--|--|--|--|--|--|
|[Reference](/cli/azure/keyvault/key)<br>[Quickstart](../keys/quick-create-cli.md)|[Reference](/powershell/module/az.keyvault/)<br>[Quickstart](../keys/quick-create-powershell.md)|[Reference](/rest/api/keyvault/#key-operations)|[Reference](/azure/templates/microsoft.keyvault/vaults/keys)<br>[Quickstart](../keys/quick-create-template.md)|[Reference](/dotnet/api/azure.security.keyvault.keys)<br>[Quickstart](../keys/quick-create-net.md)|[Reference](/python/api/azure-mgmt-keyvault/azure.mgmt.keyvault)<br>[Quickstart](../keys/quick-create-python.md)|[Reference](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-security-keyvault-keys/4.2.0/index.html)<br>[Quickstart](../keys/quick-create-java.md)|[Reference](/javascript/api/@azure/keyvault-keys/)<br>[Quickstart](../keys/quick-create-node.md)|

**Certificates API's and SDKs**

| Azure CLI | PowerShell | REST API | Resource Manager | .NET | Python | Java | JavaScript |  
|--|--|--|--|--|--|--|--|
|[Reference](/cli/azure/keyvault/certificate)<br>[Quickstart](../certificates/quick-create-cli.md)|[Reference](/powershell/module/az.keyvault)<br>[Quickstart](../certificates/quick-create-powershell.md)|[Reference](/rest/api/keyvault/#certificate-operations)|N/A|[Reference](/dotnet/api/azure.security.keyvault.certificates)<br>[Quickstart](../certificates/quick-create-net.md)|[Reference](/python/api/overview/azure/keyvault-certificates-readme)<br>[Quickstart](../certificates/quick-create-python.md)|[Reference](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-security-keyvault-certificates/4.1.0/index.html)<br>[Quickstart](../certificates/quick-create-java.md)|[Reference](/javascript/api/@azure/keyvault-certificates/)<br>[Quickstart](../certificates/quick-create-node.md)|

**Secrets API's and SDKs**

| Azure CLI | PowerShell | REST API | Resource Manager | .NET | Python | Java | JavaScript |  
|--|--|--|--|--|--|--|--|
|[Reference](/cli/azure/keyvault/secret)<br>[Quickstart](../secrets/quick-create-cli.md)|[Reference](/powershell/module/az.keyvault/)<br>[Quickstart](../secrets/quick-create-powershell.md)|[Reference](/rest/api/keyvault/#secret-operations)|[Reference](/azure/templates/microsoft.keyvault/vaults/secrets)<br>[Quickstart](../secrets/quick-create-template.md)|[Reference](/dotnet/api/azure.security.keyvault.secrets)<br>[Quickstart](../secrets/quick-create-net.md)|[Reference](/python/api/overview/azure/keyvault-secrets-readme)<br>[Quickstart](../secrets/quick-create-python.md)|[Reference](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-security-keyvault-secrets/4.2.0/index.html)<br>[Quickstart](../secrets/quick-create-java.md)|[Reference](/javascript/api/@azure/keyvault-secrets/)<br>[Quickstart](../secrets/quick-create-node.md)|

See [Client Libraries](client-libraries.md) for installation packages and source code.

For more information about Key Vault data plane security, see [Key Vault Security overview](security-overview.md).

### Code examples

For complete examples using Key Vault with your applications, see:

- [Azure Key Vault code samples](https://azure.microsoft.com/resources/samples/?service=key-vault) - Code Samples for Azure Key Vault. 

## How-tos

The following articles and scenarios provide task-specific guidance for working with Azure Key Vault:

- [Accessing Key Vault behind firewall](access-behind-firewall.md) - To access a key vault your key vault client application needs to be able to access multiple end-points for various functionalities.
- How to deploy Certificates to VMs from Key Vault - [Windows](../../virtual-machines/extensions/key-vault-windows.md), [Linux](../../virtual-machines/extensions/key-vault-linux.md) - A cloud application running in a VM on Azure needs a certificate. How do you get this certificate into this VM today?
- [Deploying Azure Web App Certificate through Key Vault](../../app-service/configure-ssl-certificate.md#import-a-certificate-from-key-vault)
- Assign an access policy ([CLI](assign-access-policy-cli.md) | [PowerShell](assign-access-policy-powershell.md) | [Portal](assign-access-policy-portal.md)). 
- [How to use Key Vault soft-delete with CLI](./key-vault-recovery.md) guides you through the use and lifecycle of a key vault and various key vault objects with soft-delete enabled.
- [How to pass secure values (such as passwords) during deployment](../../azure-resource-manager/templates/key-vault-parameter.md) - When you need to pass a secure value (like a password) as a parameter during deployment, you can store that value as a secret in an Azure Key Vault and reference the value in other Resource Manager templates.

## Integrated with Key Vault

These articles are about other scenarios and services that use or integrate with Key Vault.

- [Encryption at rest](../../security/fundamentals/encryption-atrest.md) allows the encoding (encryption) of data when it is persisted. Data encryption keys are often encrypted with a key encryption key in Azure Key Vault to further limit access.
- [Azure Information Protection](/azure/information-protection/plan-implement-tenant-key) allows you to manager your own tenant key. For example, instead of Microsoft managing your tenant key (the default), you can manage your own tenant key to comply with specific regulations that apply to your organization. Managing your own tenant key is also referred to as bring your own key, or BYOK.
- [Azure Private Link Service](private-link-service.md) enables you to access Azure Services (for example, Azure Key Vault, Azure Storage, and Azure Cosmos DB) and Azure hosted customer/partner services over a Private Endpoint in your virtual network.
- Key Vault integration with [Event Grid](../../event-grid/event-schema-key-vault.md)  allows users to be notified when the status of a secret  stored in key vault has changed. You can distribute new version of secrets to applications or rotate near expiry secrets to prevent outages.
- You can protect your [Azure Devops](/azure/devops/pipelines/release/azure-key-vault) secrets from unwanted access in Key Vault.
- [Use secret stored in Key Vault in DataBricks to connect to Azure Storage](./integrate-databricks-blob-storage.md)
- Configure and run the Azure Key Vault provider for the [Secrets Store CSI driver](./key-vault-integrate-kubernetes.md) on Kubernetes

## Key Vault overviews and concepts

- [Key Vault soft-delete behavior](soft-delete-overview.md) describes a feature that allows recovery of deleted objects, whether the deletion was accidental or intentional.
- [Key Vault client throttling](overview-throttling.md) orients you to the basic concepts of throttling and offers an approach for your app.
- [Key Vault security worlds](overview-security-worlds.md) describes the relationships between regions and security areas.

## Social

- [Key Vault Blog](/archive/blogs/kv/)
- [Key Vault Forum](https://aka.ms/kvforum)