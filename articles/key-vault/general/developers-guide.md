---
title: Azure Key Vault developer's guide
description: Developers can use Azure Key Vault to manage cryptographic keys within the Microsoft Azure environment.
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: general
ms.topic: how-to
ms.date: 01/17/2023
ms.author: mbaldwin
---
# Azure Key Vault developer's guide

Azure Key Vault allows you to securely access sensitive information from within your applications:

- Keys, secrets, and certificates are protected without you're having to write the code yourself, and you can easily use them from your applications.
- You allow customers to own and manage their own keys, secrets, and certificates so you can concentrate on providing the core software features. In this way, your applications won't own the responsibility or potential liability for your customers' tenant keys, secrets, and certificates.
- Your application can use keys for signing and encryption yet keep the key management external from your application. For more information, see [About keys](../keys/about-keys.md).
- You can manage credentials like passwords, access keys, and SAS tokens by storing them in Key Vault as secrets. For more information, see [About secrets](../secrets/about-secrets.md).
- Manage certificates. For more information, see [About certificates](../certificates/about-certificates.md).

For general information on Azure Key Vault, see [About Azure Key Vault](overview.md).

## Public previews

Periodically, we release a public preview of a new Key Vault feature. Try out public preview features and let us know what you think via azurekeyvault@microsoft.com, our feedback email address.

## Create and manage key vaults

As with other Azure services, Key Vault is managed through [Azure Resource Manager](../../azure-resource-manager/management/overview.md). Azure Resource Manager is the deployment and management service for Azure. You can use it to create, update, and delete resources in your Azure account. 

[Azure role-based access control (RBAC)](../../role-based-access-control/overview.md) controls access to the management layer, also known as the [management plane](security-features.md#managing-administrative-access-to-key-vault). You use the management plane in Key Vault to create and manage key vaults and their attributes, including access policies. You use the *data plane* to manage keys, certificates, and secrets. 

You can use the predefined Key Vault Contributor role to grant management access to Key Vault.     

### APIs and SDKs for key vault management

| Azure CLI | PowerShell | REST API | Resource Manager | .NET | Python | Java | JavaScript |  
|--|--|--|--|--|--|--|--|
|[Reference](/cli/azure/keyvault)<br>[Quickstart](quick-create-cli.md)|[Reference](/powershell/module/az.keyvault)<br>[Quickstart](quick-create-powershell.md)|[Reference](/rest/api/keyvault/)|[Reference](/azure/templates/microsoft.keyvault/vaults)<br>[Quickstart](./vault-create-template.md)|[Reference](/dotnet/api/microsoft.azure.management.keyvault)|[Reference](/python/api/azure-mgmt-keyvault/azure.mgmt.keyvault)|[Reference](/java/api/overview/azure/resourcemanager-keyvault-readme?view=azure-java-stable&preserve-view=true)|[Reference](/javascript/api/@azure/arm-keyvault)|

For installation packages and source code, see [Client libraries](client-libraries.md).

## Authenticate to Key Vault in code

Key Vault uses Azure Active Directory (Azure AD) authentication, which requires an Azure AD security principal to grant access. An Azure AD security principal can be a user, an application service principal, a [managed identity for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md), or a group of any of these types.

### Authentication best practices

We recommend that you use a managed identity for applications deployed to Azure. If you use Azure services that don't support managed identities or if applications are deployed on-premises, a [service principal with a certificate](../../active-directory/develop/howto-create-service-principal-portal.md) is a possible alternative. In that scenario, the certificate should be stored in Key Vault and frequently rotated.

Use a service principal with a secret for development and testing environments. Use a user principal for local development and Azure Cloud Shell.

We recommend these security principals in each environment:
- **Production environment**: Managed identity or service principal with a certificate.
- **Test and development environments**: Managed identity, service principal with certificate, or service principal with a secret.
- **Local development**: User principal or service principal with a secret.

### Azure Identity client libraries

The preceding authentication scenarios are supported by the *Azure Identity client library* and integrated with Key Vault SDKs. You can use the Azure Identity client library across environments and platforms without changing your code. The library automatically retrieves authentication tokens from users who are signed in to Azure user through the Azure CLI, Visual Studio, Visual Studio Code, and other means. 

For more information about the Azure Identity client library, see:

| .NET | Python | Java | JavaScript |
|--|--|--|--|
|[Azure Identity SDK .NET](/dotnet/api/overview/azure/identity-readme)|[Azure Identity SDK Python](/python/api/overview/azure/identity-readme)|[Azure Identity SDK Java](/java/api/overview/azure/identity-readme)|[Azure Identity SDK JavaScript](/javascript/api/overview/azure/identity-readme)|     

> [!Note]
> We recommended [App Authentication library](/dotnet/api/overview/azure/service-to-service-authentication) for Key Vault .NET SDK version 3, but it's now deprecated. To migrate to Key Vault .NET SDK version 4, follow the [AppAuthentication to Azure.Identity migration guidance](/dotnet/api/overview/azure/app-auth-migration).

For tutorials on how to authenticate to Key Vault in applications, see:
- [Use Azure Key Vault with a virtual machine in .NET](./tutorial-net-virtual-machine.md)
- [Use Azure Key Vault with a virtual machine in Python](./tutorial-python-virtual-machine.md)
- [Use a managed identity to connect Key Vault to an Azure web app in .NET](./tutorial-net-create-vault-azure-web-app.md)

## Manage keys, certificates, and secrets

> [!Note]
> SDKs for .NET, Python, Java, JavaScript, PowerShell, and the Azure CLI are part of the Key Vault feature release process through public preview and general availability with Key Vault service team support. Other SDK clients for Key Vault are available, but they are built and supported by individual SDK teams over GitHub and released in their teams schedule.

The data plane controls access to keys, certificates, and secrets. You can use local vault access policies or Azure RBAC for access control through the data plane.

### APIs and SDKs for keys

| Azure CLI | PowerShell | REST API | Resource Manager | .NET | Python | Java | JavaScript |  
|--|--|--|--|--|--|--|--|
|[Reference](/cli/azure/keyvault/key)<br>[Quickstart](../keys/quick-create-cli.md)|[Reference](/powershell/module/az.keyvault/)<br>[Quickstart](../keys/quick-create-powershell.md)|[Reference](/rest/api/keyvault/#key-operations)|[Reference](/azure/templates/microsoft.keyvault/vaults/keys)<br>[Quickstart](../keys/quick-create-template.md)|[Reference](/dotnet/api/azure.security.keyvault.keys)<br>[Quickstart](../keys/quick-create-net.md)|[Reference](/python/api/azure-mgmt-keyvault/azure.mgmt.keyvault)<br>[Quickstart](../keys/quick-create-python.md)|[Reference](/java/api/overview/azure/security-keyvault-keys-readme)<br>[Quickstart](../keys/quick-create-java.md)|[Reference](/javascript/api/@azure/keyvault-keys/)<br>[Quickstart](../keys/quick-create-node.md)|

#### Other Libraries

##### Cryptography client for Key Vault and Managed HSM
This module provides a cryptography client for the [Azure Key Vault Keys client module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/security/keyvault/azkeys).

> [!Note]
> This project is not supported by the Azure SDK team, but does align with the cryptography clients in other supported languages.

| Language | Reference |
|--|--|
|Go|[Reference](https://pkg.go.dev/github.com/heaths/azcrypto)|

### APIs and SDKs for certificates

| Azure CLI | PowerShell | REST API | Resource Manager | .NET | Python | Java | JavaScript |  
|--|--|--|--|--|--|--|--|
|[Reference](/cli/azure/keyvault/certificate)<br>[Quickstart](../certificates/quick-create-cli.md)|[Reference](/powershell/module/az.keyvault)<br>[Quickstart](../certificates/quick-create-powershell.md)|[Reference](/rest/api/keyvault/#certificate-operations)|N/A|[Reference](/dotnet/api/azure.security.keyvault.certificates)<br>[Quickstart](../certificates/quick-create-net.md)|[Reference](/python/api/overview/azure/keyvault-certificates-readme)<br>[Quickstart](../certificates/quick-create-python.md)|[Reference](/java/api/overview/azure/security-keyvault-certificates-readme)<br>[Quickstart](../certificates/quick-create-java.md)|[Reference](/javascript/api/@azure/keyvault-certificates/)<br>[Quickstart](../certificates/quick-create-node.md)|

### APIs and SDKs for secrets

| Azure CLI | PowerShell | REST API | Resource Manager | .NET | Python | Java | JavaScript |  
|--|--|--|--|--|--|--|--|
|[Reference](/cli/azure/keyvault/secret)<br>[Quickstart](../secrets/quick-create-cli.md)|[Reference](/powershell/module/az.keyvault/)<br>[Quickstart](../secrets/quick-create-powershell.md)|[Reference](/rest/api/keyvault/#secret-operations)|[Reference](/azure/templates/microsoft.keyvault/vaults/secrets)<br>[Quickstart](../secrets/quick-create-template.md)|[Reference](/dotnet/api/azure.security.keyvault.secrets)<br>[Quickstart](../secrets/quick-create-net.md)|[Reference](/python/api/overview/azure/keyvault-secrets-readme)<br>[Quickstart](../secrets/quick-create-python.md)|[Reference](/java/api/overview/azure/security-keyvault-secrets-readme)<br>[Quickstart](../secrets/quick-create-java.md)|[Reference](/javascript/api/@azure/keyvault-secrets/)<br>[Quickstart](../secrets/quick-create-node.md)|

### Usage of secrets
Use Azure Key Vault to store only secrets for your application. Examples of secrets that should be stored in Key Vault include:

- Client application secrets
- Connection strings
- Passwords
- Shared access keys
- SSH keys

Any secret-related information, like usernames and application IDs, can be stored as a tag in a secret. For any other sensitive configuration settings, you should use [Azure App Configuration](../../azure-app-configuration/overview.md).
 
### References 

For installation packages and source code, see [Client libraries](client-libraries.md).

For information about data plane security for Key Vault, see [Azure Key Vault security features](security-features.md).

## Use Key Vault in applications

To take advantage of the most recent features in Key Vault, we recommend that you use the available Key Vault SDKs for using secrets, certificates, and keys in your application. The Key Vault SDKs and REST API are updated as new features are released for the product, and they follow best practices and guidelines.

For basic scenarios, there are other libraries and integration solutions for simplified usage, with support provided by Microsoft partners or open-source communities.

For certificates, you can use:

- The Key Vault virtual machine (VM) extension, which provides automatic refresh of certificates stored in an Azure key vault. For more information, see: 
  - [Key Vault virtual machine extension for Windows](../../virtual-machines/extensions/key-vault-windows.md)
  - [Key Vault virtual machine extension for Linux](../../virtual-machines/extensions/key-vault-linux.md)
  - [Key Vault virtual machine extension for Azure Arc-enabled servers](../../azure-arc/servers/manage-vm-extensions.md#azure-key-vault-vm-extension)
- Azure App Service integration, which can import and automatically refresh certificates from Key Vault. For more information, see [Import a certificate from Key Vault](../../app-service/configure-ssl-certificate.md#import-a-certificate-from-key-vault).

For secrets, you can use:

- Key Vault secrets with App Service application settings. For more information, see [Use Key Vault references for App Service and Azure Functions](../../app-service/app-service-key-vault-references.md).
- Key Vault secrets with the App Configuration service for applications hosted in an Azure VM. For more information, see [Configure applications with App Configuration and Key Vault](/samples/azure/azure-sdk-for-net/app-secrets-configuration/).

## Code examples

For complete examples of using Key Vault with applications, see [Azure Key Vault code samples](https://azure.microsoft.com/resources/samples/?service=key-vault). 

## Task-specific guidance

The following articles and scenarios provide task-specific guidance for working with Azure Key Vault:

- To access a key vault, your client application needs to be able to access multiple endpoints for various functionalities. See [Accessing Key Vault behind a firewall](access-behind-firewall.md). 
- A cloud application running in an Azure VM needs a certificate. How do you get this certificate into this VM? See [Key Vault virtual machine extension for Windows](../../virtual-machines/extensions/key-vault-windows.md) or [Key Vault virtual machine extension for Linux](../../virtual-machines/extensions/key-vault-linux.md).
- To assign an access policy by using the Azure CLI, PowerShell, or the Azure portal, see [Assign a Key Vault access policy](assign-access-policy.md). 
- For guidance on the use and lifecycle of a key vault and various key vault objects with soft-delete enabled, see [Azure Key Vault recovery management with soft delete and purge protection](./key-vault-recovery.md).
- When you need to pass a secure value (like a password) as a parameter during deployment, you can store that value as a secret in a key vault and reference the value in other Resource Manager templates. See [Use Azure Key Vault to pass secure parameter values during deployment](../../azure-resource-manager/templates/key-vault-parameter.md).

## Integration with Key Vault

The following services and scenarios use or integrate with Key Vault:

- [Encryption at rest](../../security/fundamentals/encryption-atrest.md) allows the encoding (encryption) of data when it's persisted. Data encryption keys are often encrypted with a key encryption key in Azure Key Vault to further limit access.
- [Azure Information Protection](/azure/information-protection/plan-implement-tenant-key) allows you to manage your own tenant key. For example, instead of Microsoft managing your tenant key (the default), you can manage your own tenant key to comply with specific regulations that apply to your organization. Managing your own tenant key is also called *bring your own key* (BYOK).
- [Azure Private Link](private-link-service.md) enables you to access Azure services (for example, Azure Key Vault, Azure Storage, and Azure Cosmos DB) and Azure-hosted customer/partner services over a private endpoint in your virtual network.
- Key Vault integration with [Azure Event Grid](../../event-grid/event-schema-key-vault.md) allows users to be notified when the status of a secret stored in Key Vault has changed. You can distribute new versions of secrets to applications or rotate near-expiration secrets to prevent outages.
- Protect your [Azure DevOps](/azure/devops/pipelines/release/azure-key-vault) secrets from unwanted access in Key Vault.
- Use secrets stored in Key Vault to [connect to Azure Storage from Azure Databricks](./integrate-databricks-blob-storage.md).
- Configure and run the Azure Key Vault provider for the [Secrets Store CSI driver](./key-vault-integrate-kubernetes.md) on Kubernetes. 

## Key Vault overviews and concepts

To learn about:

- A feature that allows recovery of deleted objects, whether the deletion was accidental or intentional, see [Azure Key Vault soft-delete overview](soft-delete-overview.md).
- The basic concepts of throttling and get an approach for your app, see [Azure Key Vault throttling guidance](overview-throttling.md).
- The relationships between regions and security areas, see [Azure Key Vault security worlds and geographic boundaries](overview-security-worlds.md).

## Social

- [Microsoft Q&A](/answers/products/)
- [Stack Overflow for questions about Key Vault](https://stackoverflow.com/questions/tagged/azure-keyvault)
- [Azure Feedback for features requests](https://feedback.azure.com/d365community/forum/285c5ae0-f524-ec11-b6e6-000d3a4f0da0)
