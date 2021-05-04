---
title: Azure Key Vault authentication fundamentals
description: Learn about how key vault's authentication model works
author: msmbaldwin
ms.author: mbaldwin
ms.date: 04/15/2021
ms.service: key-vault
ms.subservice: general
ms.topic: conceptual

---
# Key Vault Authentication Fundamentals

Azure Key Vault allows you to securely store and manage application credentials such as secrets, keys, and certificates in a central and secure cloud repository. Key Vault eliminates the need to store credentials in your applications. Your applications can authenticate to Key Vault at run time to retrieve credentials.

As an administrator, you can tightly control which users and applications can access your key vault and you can limit and audit the operations they perform. This document explains the fundamental concepts of the key vault access model. It will provide you with an introductory level of knowledge and show you how you can authenticate a user or application to key vault from start to finish.

## Required Knowledge

This document assumes you are familiar with the following concepts. If you are not familiar with any of these concepts, follow the help links before proceeding.

* Azure Active Directory [link](../../active-directory/fundamentals/active-directory-whatis.md)
* Security Principals [link](./authentication.md#app-identity-and-security-principals)

## Key Vault Configuration Steps Summary

1. Register your user or application in Azure Active Directory as a security principal.
1. Configure a role assignment for your security principal in Azure Active Directory.
1. Configure key vault access policies for your security principal.
1. Configure Key Vault firewall access to your key vault (optional).
1. Test your security principal's ability to access key vault.

## Register a user or application in Azure Active Directory as a security principal

When a user or application makes a request to key vault, the request must first be authenticated by Azure Active Directory. For this to work, the user or application needs to be registered in Azure Active Directory as a security principal.

Follow the documentation links below to understand how to register a user or application in Azure Active Directory.
**Make sure you create a password for user registration and a client secret or client certificate credential for applications.**

* Registering a user in Azure Active Directory [link](../../active-directory/fundamentals/add-users-azure-active-directory.md)
* Registering an application in Azure Active Directory [link](../../active-directory/develop/quickstart-register-app.md)

## Assign your security principal a role

You can use Azure role-based access control (Azure RBAC) to assign permissions to security principals. These permissions are called role assignments.

In the context of key vault, these role assignments determine a security principal's level of access to the management plane (also known as control plane) of key vault. These role assignments do not provide access to the data plane secrets directly, but they provide access to manage properties of key vault. For example a user or application assigned a **Reader role** will not be permitted to make changes to key vault firewall settings, whereas a user or application assigned a **Contributor role** can make changes. Neither role will have direct access to perform operations on secrets, keys, and certificates such as creating or retrieving their value until they are assigned access to the key vault data plane. This is covered in the next step.

>[!IMPORTANT]
> Although users with the Contributor or Owner role do not have access to perform operations on secrets stored in key vault by default, the Contributor and Owner roles, provide permissions to add or remove access policies to secrets stored in key vault. Therefore a user with these role assignments can grant themselves access to access secrets in the key vault. For this reason, it is recommended that only administrators have access to the Contributor or Owner roles. Users and applications that only need to retrieve secrets from key vault should be granted the Reader role. **More details in the next section.**

>[!NOTE]
> When you assign a role assignment to a user at the Azure Active Directory tenant level, this set of permissions will trickle down to all subscriptions, resource-groups, and resources within the scope of the assignment. To follow the principal of least-privilege you can make this role assignment at a more granular scope. For example you can assign a user a Reader role at the subscription level, and an Owner role for a single key vault. Go to the Identity Access Management (IAM) settings of a subscription, resource-group, or key vault to make a role assignment at a more granular scope.

* To learn more about Azure roles [link](../../role-based-access-control/built-in-roles.md)
* To learn more about assigning or removing role assignments [link](../../role-based-access-control/role-assignments-portal.md)

## Configure key vault access policies for your security principal

Before you grant access for your users and applications to access key vault, it is important to understand the different types of operations that can be performed on a key vault. There are two main types of key vault operations, management plane (also referred to as control plane) operations, and data plane Operations.

This table shows several examples of the different operations that are controlled by the management plane vs the data plane. Operations that change the properties of the key vault are management plane operations. Operations that change or retrieve the value of secrets stored in key vault are data plane operations.

|Management Plane Operations (Examples)|Data Plane Operations (Examples)|
| --- | --- |
| Create Key Vault | Create a Key, Secret, Certificate
| Delete Key Vault | Delete a Key, Secret, Certificate
| Add or Remove Key Vault Role Assignments | List and Get values of Keys, Secrets, Certificates
| Add or Remove Key Vault Access Policies | Backup and Restore Keys, Secrets, Certificates
| Modify Key Vault Firewall Settings | Renew Keys, Secrets, Certificates
| Modify Key Vault Recovery Settings | Purge or Recover soft-deleted Keys, Secrets, Certificates
| Modify Key Vault Diagnostic Logs Settings

### Management Plane Access & Azure Active Directory Role Assignments

Azure Active Directory role assignments grant access to perform management plane operations on a key vault. This access is typically granted to users, not to applications. You can restrict what management plane operations a user can perform by changing a user’s role assignment.

For example, assigning a user a Key Vault Reader Role to a user will allow them to see the properties of your key vault such as access policies, but will not allow them to make any changes. Assigning a user, an Owner role will allow them full access to change key vault management plane settings.

Role assignments are controlled in the key vault Access Control (IAM) blade. If you want a particular user to have access to be a reader or be the administrator of multiple key vault resources, you can create a role assignment at the vault, resource group, or subscription level, and the role assignment will be added to all resources within the scope of the assignment.

Data plane access, or access to perform operations on keys, secrets, and certificates stored in key vault can be added in one of two ways.

### Data Plane Access Option 1: Classic Key Vault Access Policies

Key vault access policies grant users and applications access to perform data plane operations on a key vault.

> [!NOTE]
> This access model is not compatible with Azure RBAC for key vault (Option 2) documented below. You must choose one. You will have the opportunity to make this selection when you click on the Access Policy tab of your key vault.

Classic access policies are granular, which means you can allow or deny the ability of each individual user or application to perform individual operations within a key vault. Here are a few examples:

* Security Principal 1 can perform any key operation but is not allowed to perform any secret or certificate operation.
* Security Principal 2 can list and read all keys, secrets, and certificates but cannot perform any create, delete, or renew operations.
* Security Principal 3 can backup and restore all secrets but cannot read the value of the secrets themselves.

However, classic access policies do not allow per-object level permissions, and assigned permissions are applied to the scope of an individual key vault. For example, if you grant the “Secret Get” access policy permission to a security principal in a particular key vault, the security principal has the ability to get all secrets within that particular key vault. However, this “Get Secret” permission will not automatically extend to other key vaults and must be assigned explicitly.

> [!IMPORTANT]
> Classic key vault access policies and Azure Active Directory role assignments are independent of each other. Assigning a security principal a ‘Contributor’ role at a subscription level will not automatically allow the security principal the ability to perform data-plane operations on every key vault within the scope of the subscription. The security principal must still must be granted, or grant themselves access policy permissions to perform data plane operations.

### Data Plane Access Option 2:  Azure RBAC for Key Vault

A new way to grant access to the key vault data plane is through Azure role-based access control (Azure RBAC) for key vault.

> [!NOTE]
> This access model is not compatible with key vault classic access policies shown above. You must choose one. You will have the opportunity to make this selection when you click on the Access Policy tab of your key vault.

Key Vault role assignments are a set of Azure built-in role assignments that encompass common sets of permissions used to access keys, secrets, and certificates. This permission model also enables additional capabilities that are not available in the classic key vault access policy model.

* Azure RBAC permissions can be managed at scale by allowing users to have these roles assigned at a subscription, resource group, or individual key vault level. A user will have the data plane permissions to all key vaults within the scope of the Azure RBAC assignment. This eliminates the need to assign individual access policy permissions per user/application per key vault.

* Azure RBAC permissions are compatible with Privileged Identity Management or PIM. This allows you to configure just-in-time access controls for privileged roles like Key Vault Administrator. This is a best-security practice and follows the principal of least-privilege by eliminating standing access to your key vaults.

To learn more about Azure RBAC for Key Vault, see the following documents:

* Azure RBAC for Key Vault [link](rbac-guide.md)
* Azure RBAC for Key Vault roles [link](../../role-based-access-control/built-in-roles.md#key-vault-administrator)

## Configure Key Vault Firewall

By default, key vault allows traffic from the public internet to send reach your key vault through a public endpoint. For an additional layer of security, you can configure the Azure Key Vault Firewall to restrict access to the key vault public endpoint.

To enable key vault firewall, click on the Networking tab in the key vault portal and select the radio button to Allow Access From: “Private Endpoint and Selected Networks”. If you choose to enable the key vault firewall, these are the ways you can allow traffic through the key vault firewall.

* Add IPv4 addresses to the key vault firewall allow list. This option works best for applications that have static IP addresses.

* Add a virtual network to the key vault firewall. This option works best for Azure resources that have dynamic IP addresses such as Virtual Machines. You can add Azure resources to a virtual network and add the virtual network to the key vault firewall allow list. This option uses a service endpoint which is a private IP address within the virtual network. This provides an additional layer of protection so no traffic between key vault and your virtual network are routed over the public internet. To learn more about service endpoint see the following documentation. [link](./network-security.md)

* Add a private link connection to the key vault. This option connects your virtual network directly to a particular instance of key vault, effectively bringing your key vault inside your virtual network. To learn more about configuring a private endpoint connection to key vault, see the following [link](./private-link-service.md)

## Test your service principal's ability to access key vault

Once you have followed all of the steps above, you will be able to set and retrieve secrets from your key vault.

### Authentication process for users (examples)

* Users can log in to the Azure portal to use key vault. [Key Vault portal Quickstart](./quick-create-portal.md)

* User can use Azure CLI to use key vault. [Key Vault Azure CLI Quickstart](./quick-create-cli.md)

* User can use Azure PowerShell to use key vault. [Key Vault Azure PowerShell Quickstart](./quick-create-powershell.md)

### Azure Active Directory authentication process for applications or services (examples)

* An application provides a client secret and client ID in a function to get an Azure Active Directory token. 

* An application provides a certificate to get an Azure Active Directory token. 

* An Azure resource uses MSI authentication to get an Azure Active Directory token. 

* Learn more about MSI authentication [link](../../active-directory/managed-identities-azure-resources/overview.md)

### Authentication process for application (Python Example)

Use the following code sample to test whether your application can retrieve a secret from your key vault using the service principal you configured.

>[!NOTE]
>This sample is for demonstration and test purposes only. **DO NOT USE CLIENT SECRET AUTHENTICATION IN PRODUCTION** This is not a secure design practice. You should use client certificate or MSI Authentication as a best practice.

```python
from azure.identity import ClientSecretCredential
from azure.keyvault.secrets import SecretClient

tenant_id = "{ENTER YOUR TENANT ID HERE}"                          ##ENTER AZURE TENANT ID
vault_url = "https://{ENTER YOUR VAULT NAME}.vault.azure.net/"     ##ENTER THE URL OF YOUR KEY VAULT
client_id = "{ENTER YOUR CLIENT ID HERE}"                          ##ENTER THE CLIENT ID OF YOUR SERVICE PRINCIPAL
cert_path = "{ENTER YOUR CLIENT SECRET HERE}"                      ##ENTER THE CLIENT SECRET OF YOUR SERVICE PRINCIPAL

def main():

    #AUTHENTICATION TO Azure Active Directory USING CLIENT ID AND CLIENT CERTIFICATE (GET Azure Active Directory TOKEN)
    token = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)

    #AUTHENTICATION TO KEY VAULT PRESENTING Azure Active Directory TOKEN
    client = SecretClient(vault_url=vault_url, credential=token)

    #CALL TO KEY VAULT TO GET SECRET
    #ENTER NAME OF A SECRET STORED IN KEY VAULT
    secret = client.get_secret('{SECRET_NAME}')

    #GET PLAINTEXT OF SECRET
    print(secret.value)

#CALL MAIN()
if __name__ == "__main__":
    main()
```

## Next Steps

To learn about key vault authentication in more detail, see the following document. [Key Vault Authentication](./authentication.md)
