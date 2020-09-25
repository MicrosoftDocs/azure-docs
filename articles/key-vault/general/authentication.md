---
title: Authenticate to Azure Key Vault
description: Learn how to authenticate to Azure Key Vault
author: ShaneBala-keyvault
ms.author: sudbalas
ms.date: 08/27/2020
ms.service: key-vault
ms.subservice: general
ms.topic: how-to

---
# Authenticate to Azure Key Vault

Azure Key Vault allows you to store secrets and control their distribution in a centralized, secure cloud repository, which eliminates the need to store credentials in applications. Applications need only authenticate with Key Vault at run time to access those secrets.

## App identity and security principals

Authentication with Key Vault works in conjunction with [Azure Active Directory (Azure AD)](/azure/active-directory/fundamentals/active-directory-whatis), which is responsible for authenticating the identity of any given **security principal**.

A security principal is an object that represents a user, group, service, or application that's requesting access to Azure resources. Azure assigns a unique **object ID** to every security principal.

* A **user** security principal identifies an individual who has a profile in Azure Active Directory.

* A **group** security principal identifies a set of users created in Azure Active Directory. Any roles or permissions assigned to the group are granted to all of the users within the group.

* A **service principal** is a type of security principal that identities an application or service, which is to say, a piece of code rather than a user or group. A service principal's object ID is known as its **client ID** and acts like its username. The service principal's **client secret** acts like its password.

For applications, there are two ways to obtain a service principal:

* Recommended: enable a system-assigned **managed identity** for the application.

    With managed identity, Azure internally manages the application's service principal and automatically authenticates the application with other Azure services. Managed identity is available for applications deployed to a variety of services.

    For more information, see the [Managed identity overview](/azure/active-directory/managed-identities-azure-resources/overview). Also see [Azure services that support managed identity](/azure/active-directory/managed-identities-azure-resources/services-support-managed-identities), which links to articles that describe how to enable managed identity for specific services (such as App Service, Azure Functions, Virtual Machines, etc.).

* If you cannot use managed identity, you instead **register** the application with your Azure AD tenant, as described on [Quickstart: Register an application with the Azure identity platform](/azure/active-directory/develop/quickstart-register-app). Registration also creates a second application object that identifies the app across all tenants.

## Authorize a security principal to access Key Vault

Key Vault works with two separate levels of authorization:

- **Access policies** control whether a user, group, or service principal is authorized to access secrets, keys, and certificates *within* an existing Key Vault resource (sometimes referred to "data plane" operations). Access policies are typically granted to users, groups, and applications.

    To assign access policies, see the following articles:

    - [Azure portal](assign-access-policy-portal.md)
    - [Azure CLI](assign-access-policy-cli.md)
    - [Azure PowerShell](assign-access-policy-portal.md)

- **Role permissions** control whether a user, group, or service principal is authorized to create, delete, and otherwise manage a Key Vault resource (sometimes referred to as "management plane" operations). Such roles are most often granted only to administrators.
 
    To assign and manage roles, see the following articles:

    - [Azure portal](/azure/role-based-access-control/role-assignments-portal)
    - [Azure CLI](/azure/role-based-access-control/role-assignments-cli)
    - [Azure PowerShell](/azure/role-based-access-control/role-assignments-powershell)

    Key Vault currently supports the [Contributor](/azure/role-based-access-control/built-in-roles#key-vault-contributor) role, which allows management operations on Key Vault resources. A number of other roles are currently in preview. You can also create custom roles, as described on [Azure custom roles](/azure/role-based-access-control/custom-roles).

    For general information on roles, see [What is Azure Role-Based Access Control (RBAC)?](/azure/role-based-access-control/overview).


> [!IMPORTANT]
> For greatest security, always follow the principal of least privilege and grant only the most specific access policies and roles that are necessary. 
    
## Configure the Key Vault firewall

By default, Key Vault allows access to resources through public IP addresses. For greater security, you can also restrict access to specific IP ranges, service endpoints, virtual networks, or private endpoints.

For more information, see [Access Azure Key Vault behind a firewall](/azure/key-vault/general/access-behind-firewall).


## The Key Vault authentication flow

1. A service principal requests to authenticate with Azure AD, for example:
    * A user logs into the Azure portal using a username and password.
    * An application invokes an Azure REST API, presenting a client ID and secret or a client certificate.
    * An Azure resource such as a virtual machine with a managed identity contacts the [Azure Instance Metadata Service (IMDS)](/azure/virtual-machines/windows/instance-metadata-service) REST endpoint to get an access token.

1. If authentication with Azure AD is successful, the service principal is granted an OAuth token.

1. The service principal makes a call to the Key Vault REST API through the Key Vault's endpoint (URI).

1. Key Vault Firewall checks the following criteria. If any criterion is met, the call is allowed. Otherwise the call is blocked and a forbidden response is returned.

    * The firewall is disabled and the public endpoint of Key Vault is reachable from the public internet.
    * The caller is a [Key Vault Trusted Service](/azure/key-vault/general/overview-vnet-service-endpoints#trusted-services), allowing it to bypass the firewall.
    * The caller is listed in the firewall by IP address, virtual network, or service endpoint.
    * The caller can reach Key Vault over a configured private link connection.    

1. If the firewall allows the call, Key Vault calls Azure AD to validate the service principal’s access token.

1. Key Vault checks if the service principal has the necessary access policy for the requested operation. If not, Key Vault returns a forbidden response.

1. Key Vault carries out the requested operation and returns the result.

The following diagram illustrates the process for an application calling a Key Vault "Get Secret" API:

![The Azure Key Vault authentication flow](../media/authentication/authentication-flow.png)

## Code examples

The following table links to different articles that demonstrate how to work with Key Vault in application code using the Azure SDK libraries for the language in question. Other interfaces such as the Azure CLI and the Azure portal are included for convenience.

| Key Vault Secrets | Key Vault Keys | Key Vault Certificates |
|  --- | --- | --- |
| [Python](/azure/key-vault/secrets/quick-create-python) | [Python](/azure/key-vault/keys/quick-create-python) | [Python](/azure/key-vault/certificates/quick-create-python) | 
| [.NET (SDK v4)](/azure/key-vault/secrets/quick-create-net) | -- | -- |
| [.NET (SDK v3)](/azure/key-vault/secrets/quick-create-net-v3) | -- | -- |
| [Java](/azure/key-vault/secrets/quick-create-java) | -- | -- |
| [JavaScript](/azure/key-vault/secrets/quick-create-node) | -- | -- | 
| | | |
| [Azure portal](/azure/key-vault/secrets/quick-create-portal) | [Azure portal](/azure/key-vault/keys/quick-create-portal) | [Azure portal](/azure/key-vault/certificates/quick-create-portal) |
| [Azure CLI](/azure/key-vault/secrets/quick-create-cli) | [Azure CLI](/azure/key-vault/keys/quick-create-cli) | [Azure CLI](/azure/key-vault/certificates/quick-create-cli) |
| [Azure PowerShell](/azure/key-vault/secrets/quick-create-powershell) | [Azure PowerShell](/azure/key-vault/keys/quick-create-powershell) | [Azure PowerShell](/azure/key-vault/certificates/quick-create-powershell) |
| [ARM template](/azure/key-vault/secrets/quick-create-net) | -- | -- |

## Next Steps

- [Key Vault access policy troubleshooting](troubleshooting-access-issues.md)
- [Key Vault REST API error codes](rest-error-codes.md)
- [Key Vault developer's guide](developers-guide.md)
- [What is Azure Role-Based Access Control (RBAC)?](/azure/role-based-access-control/overview)
