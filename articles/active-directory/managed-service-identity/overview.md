---
title: What is Managed Service Identity (MSI) for Azure resources
description: An overview of Managed Service Identity for Azure resources.
services: active-directory
documentationcenter: 
author: daveba
manager: mtillman
editor: 
ms.assetid: 0232041d-b8f5-4bd2-8d11-27999ad69370
ms.service: active-directory
ms.devlang: 
ms.topic: overview
ms.custom: mvc
ms.date: 03/28/2018
ms.author: daveba

#As a developer, I would like to securely manage the credentials my application uses for authenticating to cloud services without having those credentials in my code or checked into source control.
---

#  What is Managed Service Identity (MSI) for Azure resources?

[!INCLUDE[preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

A common challenge when building cloud applications is how to manage the credentials that need to be in your code for authenticating to cloud services. Keeping these credentials secure is an important task. Ideally, they never appear on developer workstations or get checked into source control. Azure Key Vault provides a way to securely store credentials and other keys and secrets, but your code needs to authenticate to Key Vault to retrieve them. Managed Service Identity (MSI) makes solving this problem simpler by giving Azure services an automatically managed identity in Azure Active Directory (Azure AD). You can use this identity to authenticate to any service that supports Azure AD authentication, including Key Vault, without having any credentials in your code.

## How does it work?

When using a Managed Service Identity on an Azure service instance, Azure creates an identity in the Azure AD tenant used by your Azure subscription. Additionally, Azure provisions the credentials for the identity, onto the service instance. As a result, your code can then make a local request to get access tokens for services that support Azure AD authentication. All while Azure takes care of rolling the credentials used by the service instance.

Managed Service Identity comes free with Azure Active Directory, which is the default for Azure subscriptions.

![Virtual Machine MSI example](../media/msi-vm-imds-example.png)

1. Azure Resource Manager receives a message to enable the Managed Service Identity (MSI) on a VM.
2. Azure Resource Manager creates a Service Principal in Azure AD to represent the identity of the VM. The Service Principal is created in the Azure AD tenant that is trusted by this subscription.
3. Azure Resource Manager configures the Service Principal details for the VM in the Azure Instance Metadata Service of the VM. This step includes configuring client ID and certificate used to get access tokens from Azure AD. *Note: The MSI IMDS endpoint is replacing the current MSI VM Extension endpoint. For more infromation about this change, please see the FAQs and known issues page*
4. Now that the Service Principal identity of the VM is known, it can be granted access to Azure resources. For example, if your code needs to call Azure Resource Manager, then you would assign the VM’s Service Principal the appropriate role using Role-Based Access Control (RBAC) in Azure AD.  If your code needs to call Key Vault, then you would grant your code access to the specific secret or key in Key Vault.
5. Your code running on the VM requests a token from the Azure Instance Metadata Service (IMDS) MSI endpoint, which is only accessible from within the VM: http://169.254.169.254/metadata/identity/oauth2/token. The resource parameter specifies the service to which the token is sent. For example, if you want your code to authenticate to Azure Resource Manager, you would use resource=https://management.azure.com/.
6. The Azure Instance Metadata requests an an access token from Azure AD, using the client ID and certificate for the VM. Azure AD returns a JSON Web Token (JWT) access token.
7. Your code sends the access token on a call to a service that supports Azure AD authentication.

- A **System Assigned** MSI is enabled directly on an Azure service instance. Through the enable process, Azure creates an identity for the service instance in the Azure AD tenant, and provisions the credentials for the identity onto the service instance. The life cycle of a system assigned MSI is directly tied to the Azure service instance it's enabled on. If the service instance is deleted, Azure automatically cleans up the credentials and the identity in Azure AD.

- A **User Assigned** MSI *(private preview)* is created as a standalone Azure resource. Through the create process, Azure creates an identity in the Azure AD tenant. After the identity is created, it can be assigned to one or more Azure service instances. Since a user-assigned MSI can be used by multiple Azure service instances, it's life cycle is managed separately.

Here's an example of how a system-assigned MSI works with Azure Virtual Machines.

![Virtual Machine MSI example](~/articles/active-directory/media/msi-vm-example.png)  

1. Azure Resource Manager receives a message to enable the system-assigned MSI on a VM.
2. Azure Resource Manager creates a Service Principal in Azure AD to represent the identity of the VM. The Service Principal is created in the Azure AD tenant that is trusted by this subscription.
3. Azure Resource Manager configures the Service Principal details in the MSI VM Extension of the VM. This step includes configuring client ID and certificate used by the extension to get access tokens from Azure AD.  
4. Now that the Service Principal identity of the VM is known, it can be granted access to Azure resources. For example, if your code needs to call Azure Resource Manager, then you would assign the VM’s Service Principal the appropriate role using Role-Based Access Control (RBAC) in Azure AD.  If your code needs to call Key Vault, then you would grant your code access to the specific secret or key in Key Vault.
5. Your code running on the VM requests a token from a local endpoint that is hosted by the MSI VM extension: http://localhost:50342/oauth2/token. The resource parameter specifies the service to which the token is sent. For example, if you want your code to authenticate to Azure Resource Manager, you would use resource=https://management.azure.com/.
6. The MSI VM Extension uses its configured client ID and certificate to request an access token from Azure AD.  Azure AD returns a JSON Web Token (JWT) access token.
7. Your code sends the access token on a call to a service that supports Azure AD authentication.

Using the same diagram, here's an example of how a user-assigned MSI works with Azure Virtual Machines.

![Virtual Machine MSI example](~/articles/active-directory/media/msi-vm-example.png)

1. Azure Resource Manager receives a message to create a user-assigned MSI.
2. Azure Resource Manager creates a Service Principal in Azure AD to represent the identity of the MSI. The Service Principal is created in the Azure AD tenant that is trusted by this subscription.
3. Azure Resource Manager receives a message to configure the Service Principal details in the MSI VM Extension of a VM. This step includes configuring client ID and certificate used by the extension to get access tokens from Azure AD.
4. Now that the Service Principal identity of the MSI is known, it can be granted access to Azure resources. For example, if your code needs to call Azure Resource Manager, then you would assign the MSI's Service Principal the appropriate role using Role-Based Access Control (RBAC) in Azure AD. If your code needs to call Key Vault, then you would grant your code access to the specific secret or key in Key Vault. Note: Step 3 is not required to complete step 4. Once an MSI exists, it can be granted access to resources, regardless of being configured on a VM or not.
5. Your code running on the VM requests a token from a local endpoint that is hosted by the MSI VM extension:  http://localhost:50342/oauth2/token. The client ID parameter specifies the name of the MSI identity to use. Additionally, the resource parameter specifies the service to which the token is sent. For example, if you want your code to authenticate to Azure Resource Manager, you would use resource=https://management.azure.com/.
6. The MSI VM Extension checks if the certificate for the requested client ID is configured, and requests an access token from Azure AD. Azure AD returns a JSON Web Token (JWT) access token.
7. Your code sends the access token on a call to a service that supports Azure AD authentication.

Each Azure service that supports Managed Service Identity has its own method for your code to obtain an access token. Check out the [Step-by-Step Tutorials](/azure/active-directory/managed-service-identity#Step-by-Step-Tutorials) for each service to find out the specific method to get a token.

## Which Azure services support Managed Service Identity?

Azure services that support Managed Service Identity can use MSI to authenticate to services that support Azure AD authentication.  For a list of Azure services that support Managed Service Identity refer to the following article:
- [Services that support Managed Service Identity](services-support-msi.md)

## How much does Managed Service Identity cost?



## Support and feedback

We would love to hear from you!

* Ask how-to questions on Stack Overflow with the tag [azure-msi](http://stackoverflow.com/questions/tagged/azure-msi).
* Make feature requests or give feedback on the [Azure AD feedback forum for developers](https://feedback.azure.com/forums/169401-azure-active-directory/category/164757-developer-experiences).

## Next steps

Get started with Azure Managed Service Identity with the following quickstarts:

* [Use a Windows VM Managed Service Identity (MSI) to access Resource Manager - Windows VM](tutorial-windows-vm-access-arm.md)
* [Use a Linux VM Managed Service Identity (MSI) to access Azure Resource Manager - Linux VM](tutorial-linux-vm-access-arm.md)
