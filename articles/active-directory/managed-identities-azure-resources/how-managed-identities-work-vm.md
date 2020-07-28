---
title: How managed identities for Azure resources work with with Azure virtual machines
description: Description of managed identities for Azure resources work with Azure virtual machines.
services: active-directory
documentationcenter:
author: MarkusVi
manager: daveba
editor:
ms.assetid: 0232041d-b8f5-4bd2-8d11-27999ad69370
ms.service: active-directory
ms.subservice: msi
ms.devlang:
ms.topic: conceptual
ms.custom: mvc
ms.date: 06/11/2020
ms.author: markvi

#As a developer, I'd like to ...
ms.collection: M365-identity-device-management
---

# How managed identities for Azure resources work with Azure virtual machines

Managed identities for Azure resources provide Azure services with an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code.

In this article, you learn how managed identities work with Azure virtual machines (VMs).


## How it works

Internally, managed identities are service principals of a special type, which can only be used with Azure resources. When the managed identity is deleted, the corresponding service principal is automatically removed.
Also, when a User-Assigned or System-Assigned Identity is created, the Managed Identity Resource Provider (MSRP) issues a certificate internally to that identity. 

Your code can use a managed identity to request access tokens for services that support Azure AD authentication. Azure takes care of rolling the credentials that are used by the service instance. 

The following diagram shows how managed service identities work with Azure virtual machines (VMs):

![Managed service identities and Azure VMs](media/how-managed-identities-work-vm/data-flow.png)

|  Property    | System-assigned managed identity | User-assigned managed identity |
|------|----------------------------------|--------------------------------|
| Creation |  Created as part of an Azure resource (for example, an Azure virtual machine or Azure App Service). | Created as a stand-alone Azure resource. |
| Life cycle | Shared life cycle with the Azure resource that the managed identity is created with. <br/> When the parent resource is deleted, the managed identity is deleted as well. | Independent life cycle. <br/> Must be explicitly deleted. |
| Sharing across Azure resources | Cannot be shared. <br/> It can only be associated with a single Azure resource. | Can be shared. <br/> The same user-assigned managed identity can be associated with more than one Azure resource. |
| Common use cases | Workloads that are contained within a single Azure resource. <br/> Workloads for which you need independent identities. <br/> For example, an application that runs on a single virtual machine | Workloads that run on multiple resources and which can share a single identity. <br/> Workloads that need pre-authorization to a secure resource as part of a provisioning flow. <br/> Workloads where resources are recycled frequently, but permissions should stay consistent. <br/> For example, a workload where multiple virtual machines need to access the same resource |

## System-assigned managed identity

1. Azure Resource Manager receives a request to enable the system-assigned managed identity on a VM.

2. Azure Resource Manager creates a service principal in Azure AD for the identity of the VM. The service principal is created in the Azure AD tenant that's trusted by the subscription.

3. Azure Resource Manager configures the identity on the VM by updating the Azure Instance Metadata Service identity endpoint with the service principal client ID and certificate.

4. After the VM has an identity, use the service principal information to grant the VM access to Azure resources. To call Azure Resource Manager, use role-based access control (RBAC) in Azure AD to assign the appropriate role to the VM service principal. To call Key Vault, grant your code access to the specific secret or key in Key Vault.

5. Your code that's running on the VM can request a token from the Azure Instance Metadata service endpoint, accessible only from within the VM: `http://169.254.169.254/metadata/identity/oauth2/token`
    - The resource parameter specifies the service to which the token is sent. To authenticate to Azure Resource Manager, use `resource=https://management.azure.com/`.
    - API version parameter specifies the IMDS version, use api-version=2018-02-01 or greater.

6. A call is made to Azure AD to request an access token (as specified in step 5) by using the client ID and certificate configured in step 3. Azure AD returns a JSON Web Token (JWT) access token.

7. Your code sends the access token on a call to a service that supports Azure AD authentication.

## User-assigned managed identity

1. Azure Resource Manager receives a request to create a user-assigned managed identity.

2. Azure Resource Manager creates a service principal in Azure AD for the user-assigned managed identity. The service principal is created in the Azure AD tenant that's trusted by the subscription.

3. Azure Resource Manager receives a request to configure the user-assigned managed identity on a VM and updates the Azure Instance Metadata Service identity endpoint with the user-assigned managed identity service principal client ID and certificate.

4. After the user-assigned managed identity is created, use the service principal information to grant the identity access to Azure resources. To call Azure Resource Manager, use RBAC in Azure AD to assign the appropriate role to the service principal of the user-assigned identity. To call Key Vault, grant your code access to the specific secret or key in Key Vault.

   > [!Note]
   > You can also do this step before step 3.

5. Your code that's running on the VM can request a token from the Azure Instance Metadata Service identity endpoint, accessible only from within the VM: `http://169.254.169.254/metadata/identity/oauth2/token`
    - The resource parameter specifies the service to which the token is sent. To authenticate to Azure Resource Manager, use `resource=https://management.azure.com/`.
    - The client ID parameter specifies the identity for which the token is requested. This value is required for disambiguation when more than one user-assigned identity is on a single VM.
    - The API version parameter specifies the Azure Instance Metadata Service version. Use `api-version=2018-02-01` or higher.

6. A call is made to Azure AD to request an access token (as specified in step 5) by using the client ID and certificate configured in step 3. Azure AD returns a JSON Web Token (JWT) access token.
7. Your code sends the access token on a call to a service that supports Azure AD authentication.


## Next steps

Get started with the managed identities for Azure resources feature with the following quickstarts:

* [Use a Windows VM system-assigned managed identity to access Resource Manager](tutorial-windows-vm-access-arm.md)
* [Use a Linux VM system-assigned managed identity to access Resource Manager](tutorial-linux-vm-access-arm.md)
