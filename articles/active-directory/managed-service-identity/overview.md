---
title: What is Managed Service Identity for Azure resources
description: An overview of Managed Service Identity for Azure resources.
services: active-directory
documentationcenter: 
author: daveba
manager: mtillman
editor: 
ms.assetid: 0232041d-b8f5-4bd2-8d11-27999ad69370
ms.service: active-directory
ms.component: msi
ms.devlang: 
ms.topic: overview
ms.custom: mvc
ms.date: 03/28/2018
ms.author: daveba

#As a developer, I would like to securely manage the credentials my application uses for authenticating to cloud services without having those credentials in my code or checked into source control.
---

#  What is Managed Service Identity for Azure resources?

[!INCLUDE[preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

A common challenge when building cloud applications is how to manage the credentials that need to be in your code for authenticating to cloud services. Keeping these credentials secure is an important task. Ideally, they never appear on developer workstations or get checked into source control. Azure Key Vault provides a way to securely store credentials and other keys and secrets, but your code needs to authenticate to Key Vault to retrieve them. Managed Service Identity makes solving this problem simpler by giving Azure services an automatically managed identity in Azure Active Directory (Azure AD). You can use this identity to authenticate to any service that supports Azure AD authentication, including Key Vault, without having any credentials in your code.

Managed Service Identity comes with Azure Active Directory free, which is the default for Azure subscriptions. There is no additional cost for Managed Service Identity.

## How does it work?

There are two types of Managed Service Identities: **System Assigned** and **User Assigned**.

- A **System Assigned Identity** is enabled directly on an Azure service instance. When enabled, Azure creates an identity for the service instance in the Azure AD tenant trusted by the subscription of the service instance. Once the identity is created, its credentials get provisioned onto the service instance. The life cycle of a system assigned identity is directly tied to the Azure service instance it is enabled on. If the service instance is deleted, Azure automatically cleans up the credentials and the identity in Azure AD.
- A **User Assigned Identity** is created as a standalone Azure resource. Through a create process, Azure creates an identity in the Azure AD tenant trusted by the subscription being used. After the identity is created, it can be assigned to one or more Azure service instances. The life cycle of a user assigned identity is managed separately from the life cycle of the Azure service instances it is assigned to.

As a result, your code can use either a system assigned or user assigned identity, to request access tokens for services that support Azure AD authentication. All while Azure takes care of rolling the credentials used by the service instance.

Here's an example of how System Assigned Identities work with Azure Virtual Machines:

![Virtual Machine Managed Identity example](media/overview/msi-vm-vmextension-imds-example.png)

1. Azure Resource Manager receives a request to enable the system assigned identity on a VM.
2. Azure Resource Manager creates a Service Principal in Azure AD to represent the identity of the VM. The Service Principal is created in the Azure AD tenant that is trusted by this subscription.
3. Azure Resource Manager configures the identity on the VM:
    - Updates the Azure Instance Metadata Service identity endpoint with the Service Principal client ID and certificate.
    - Provisions the VM extension and adds the Service Principal client ID and certificate. (to be deprecated)
4. Now that the VM has an identity, we use its Service Principal information to grant the VM access to Azure resources. For example, if your code needs to call Azure Resource Manager, then you would assign the VM’s Service Principal the appropriate role using Role-Based Access Control (RBAC) in Azure AD. If your code needs to call Key Vault, then you would grant your code access to the specific secret or key in Key Vault.
5. Your code running on the VM can request a token from two endpoints that are only accessible from within the VM:

    - Azure Instance Metadata Service (IMDS) identity endpoint: http://169.254.169.254/metadata/identity/oauth2/token (recommended)
        - Resource parameter specifies the service to which the token is sent. For example, if you want your code to authenticate to Azure Resource Manager, you would use resource=https://management.azure.com/.
        - API version parameter specifies the IMDS version, use api-version=2018-02-01 or greater.
    - VM extension endpoint: http://localhost:50342/oauth2/token (to be deprecated)
        - Resource parameter specifies the service to which the token is sent. For example, if you want your code to authenticate to Azure Resource Manager, you would use resource=https://management.azure.com/.

6. Call is made to Azure AD requesting an access token as specified in step #5, using the client ID and certificate configured in step #3. Azure AD returns a JSON Web Token (JWT) access token.
7. Your code sends the access token on a call to a service that supports Azure AD authentication.

Using the same diagram, here's an example of how a user-assigned works with Azure Virtual Machines.

1. Azure Resource Manager receives a request to create a user assigned identity.
2. Azure Resource Manager creates a Service Principal in Azure AD to represent the user assigned identity. The Service Principal is created in the Azure AD tenant that is trusted by this subscription.
3. Azure Resource Manager receives a request to configure the user assigned identity on a VM:
    - Updates the Azure Instance Metadata Service identity endpoint with the user assigned identity Service Principal client ID and certificate.
    - Provisioning the VM extension and adds the user assigned identity Service Principal client ID and certificate (to be deprecated).
4. Now that the user assigned identity has been created, we use its Service Principal information to grant it access to Azure resources. For example, if your code needs to call Azure Resource Manager, then you would assign the Service Principal of the user assigned identity, the appropriate role using Role-Based Access Control (RBAC) in Azure AD. If your code needs to call Key Vault, then you would grant your code access to the specific secret or key in Key Vault. Note: This step can be performed before step #3 as well.
5. Your code running on the VM can request a token from two endpoints that are only accessible from within the VM:

    - Azure Instance Metadata Service (IMDS) identity endpoint: http://169.254.169.254/metadata/identity/oauth2/token (recommended)
        - Resource parameter specifies the service to which the token is sent. For example, if you want your code to authenticate to Azure Resource Manager, you would use resource=https://management.azure.com/.
        - Client ID parameter specifies the identity for which the token is requested. This is required to disambiguate when more than one user assigned identities are on a single VM.
        - API version parameter specifies the IMDS version, use api-version=2018-02-01 or greater.

    - VM extension endpoint: http://localhost:50342/oauth2/token (to be deprecated)
        - Resource parameter specifies the service to which the token is sent. For example, if you want your code to authenticate to Azure Resource Manager, you would use resource=https://management.azure.com/.
        - Client ID parameter specifies the identity for which the token is requested. This is required to disambiguate when more than one user assigned identities are on a single VM.
6. Call is made to Azure AD requesting an access token as specified in step #5, using the client ID and certificate configured in step #3. Azure AD returns a JSON Web Token (JWT) access token.
7. Your code sends the access token on a call to a service that supports Azure AD authentication.
     
## Try Managed Service Identity

Try a Managed Service Identity tutorial to learn end-to-end scenarios for accessing different Azure resources:
<br><br>
| From managed identity-enabled resource | Learn how to |
| ------- | -------- |
| Azure VM (Windows) | [Access Azure Data Lake Store with a Windows VM Managed Service Identity](tutorial-windows-vm-access-datalake.md) |
|                    | [Access Azure Resource Manager with a Windows VM Managed Service Identity](tutorial-windows-vm-access-arm.md) |
|                    | [Access Azure SQL with a Windows VM Managed Service Identity](tutorial-windows-vm-access-sql.md) |
|                    | [Access Azure Storage via access key with a Windows VM Managed Service Identity](tutorial-windows-vm-access-storage.md) |
|                    | [Access Azure Storage via SAS with a Windows VM Managed Service Identity](tutorial-windows-vm-access-storage-sas.md) |
|                    | [Access a non-Azure AD resource with a Windows VM Managed Service Identity and Azure Key Vault](tutorial-windows-vm-access-nonaad.md) |
| Azure VM (Linux)   | [Access Azure Data Lake Store with a Linux VM Managed Service Identity](tutorial-linux-vm-access-datalake.md) |
|                    | [Access Azure Resource Manager with a Linux VM Managed Service Identity](tutorial-linux-vm-access-arm.md) |
|                    | [Access Azure Storage via access key with a Linux VM Managed Service Identity](tutorial-linux-vm-access-storage.md) |
|                    | [Access Azure Storage via SAS with a Linux VM Managed Service Identity](tutorial-linux-vm-access-storage-sas.md) |
|                    | [Access a non-Azure AD resource with a Linux VM Managed Service Identity and Azure Key Vault](tutorial-linux-vm-access-nonaad.md) |
| Azure App Service  | [Use Managed Service Identity with Azure App Service or Azure Functions](/azure/app-service/app-service-managed-service-identity) |
| Azure Functions    | [Use Managed Service Identity with Azure App Service or Azure Functions](/azure/app-service/app-service-managed-service-identity) |
| Azure Service Bus  | [Use Managed Service Identity with Azure Service Bus](../../service-bus-messaging/service-bus-managed-service-identity.md) |
| Azure Event Hubs   | [Use Managed Service Identity with Azure Event Hubs](../../event-hubs/event-hubs-managed-service-identity.md) |
| Azure API Management | [Use Managed Service Identity with Azure API Management](../../api-management/api-management-howto-use-managed-service-identity.md) |

## Which Azure services support Managed Service Identity?

Managed identities can be used to authenticate to services that support Azure AD authentication. For a list of Azure services that support Managed Service Identity refer to the following article:
- [Services that support Managed Service Identity](services-support-msi.md)

## Next steps

Get started with Azure Managed Service Identity with the following quickstarts:

* [Use a Windows VM Managed Service Identity to access Resource Manager - Windows VM](tutorial-windows-vm-access-arm.md)
* [Use a Linux VM Managed Service Identity to access Azure Resource Manager - Linux VM](tutorial-linux-vm-access-arm.md)
