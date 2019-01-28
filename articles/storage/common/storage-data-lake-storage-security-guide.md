---
title: Azure Data Lake Storage Gen2 Storage security guide | Microsoft Docs
description: Details the many methods of securing Azure Storage, including but not limited to RBAC and Storage Service Encryption
services: storage
author: roygara

ms.service: storage
ms.topic: article
ms.date: 12/04/2018
ms.author: rogarana
ms.component: common
---

# Azure Data Lake Storage Gen2 security guide

Azure Data Lake Storage Gen2 Preview, is a set of capabilities built on Azure Storage accounts. As such, any references in this article are meant for an Azure Storage account with hierarchical namespace enabled (Data Lake Storage Gen2 capabilities).

- All data written to Azure Storage is automatically encrypted using [Storage Service Encryption (SSE)](storage-service-encryption.md). For more information, see [Announcing Default Encryption for Azure Blobs, Files, Tables, and Queue Storage](https://azure.microsoft.com/blog/announcing-default-encryption-for-azure-blobs-files-table-and-queue-storage/).
- Azure Active Directory (Azure AD) and Role-Based Access Control (RBAC) are supported for Azure Storage for both resource management operations and data operations, as follows:
    - You can assign RBAC roles scoped to the storage account to security principals and use Azure AD to authorize resource management operations such as key management.
    - Azure AD integration is supported in preview for data operations on Azure Storage. You can assign RBAC roles scoped to a subscription, resource group, storage account, or an individual filesystem to a security principal or a managed identity for Azure resources. For more information, see [Authenticate access to Azure Storage using Azure Active Directory (Preview)](storage-auth-aad.md).
- Delegated access to the data objects in Azure Storage can be granted using [Shared Access Signatures](../storage-dotnet-shared-access-signature-part-1.md).

This article provides an overview of each of these security features that can be used with Azure Storage. Links are provided to articles that will give details of each feature so you can easily do further investigation on each topic.

Here are the topics to be covered in this article:

* [Management Plane Security](#management-plane-security) – Securing your Storage Account

  The management plane consists of the resources used to manage your storage account. This section covers the Azure Resource Manager deployment model and how to use Role-Based Access Control (RBAC) to control access to your storage accounts. It also addresses managing your storage account keys and how to regenerate them.
* [Data Plane Security](#data-plane-security) – Securing Access to Your Data

  In this section, we'll look at allowing access to the actual data objects in your Storage account, i.e. files and directories, using Shared Access Signatures and Stored Access Policies. We will cover both service-level SAS and account-level SAS. We'll also see how to limit access to a specific IP address (or range of IP addresses), how to limit the protocol used to HTTPS, and how to revoke a Shared Access Signature without waiting for it to expire.
* [Encryption in Transit](#encryption-in-transit)

This section discusses how to secure data when you transfer it into or out of a storage account with Data Lake Storage Gen2 enabled. We'll talk about the recommended use of HTTPS.

## Management Plane Security

The management plane consists of operations that affect the storage account itself. For example, you can create or delete a storage account, get a list of storage accounts in a subscription, retrieve the storage account keys, or regenerate the storage account keys.

This guide focuses on the Resource Manager model of deployment, which is the means for creating storage accounts with Data Lake Storage Gen2 capabilities. With the Resource Manager storage accounts, rather than giving access to the entire subscription, you can control access on a more finite level to the management plane using Role-Based Access Control (RBAC).

### How to secure your storage account with Role-Based Access Control (RBAC)

Let's talk about what RBAC is, and how you can use it. Each Azure subscription has an Azure Active Directory. Users, groups, and applications from that directory can be granted access to manage resources in the Azure subscription that use the Resource Manager deployment model. This type of security is referred to as Role-Based Access Control (RBAC). To manage this access, use **Access control (IAM)** in the Azure portal.

With the Resource Manager model, you put the storage account in a resource group and control access to the management plane of that specific storage account using Azure Active Directory. For example, you can give specific users the ability to access the storage account keys, while other users can view information about the storage account, but cannot access the storage account keys.

#### Granting Access

Access is granted by assigning the appropriate RBAC role to users, groups, and applications, at the right scope. To grant access to the entire subscription, you assign a role at the subscription level. You can grant access to all of the resources in a resource group by granting permissions to the resource group itself. You can also assign specific roles to specific resources, such as storage accounts.

Here are the main points that you need to know about using RBAC to access the management operations of an Azure Storage account:

* For someone to have permission to access the data objects in the storage account, you can give them permission to read the storage account keys, and that user can then use those keys to access the files and directories.
* Roles can be assigned to a specific user account, a group of users, or to a specific application.
* Each role has a list of Actions and Not Actions. For example, the Virtual Machine Contributor role has an Action of "listKeys" that allows the storage account keys to be read. The Contributor has "Not Actions" such as updating the access for users in the Active Directory.
* Roles for storage include (but are not limited to) the following roles:

  * Owner – They can manage everything, including access.
  * Contributor – They can do anything the owner can do except assign access. Someone with this role can view and regenerate the storage account keys. With the storage account keys, they can access the data objects.
  * Reader – They can view information about the storage account, except secrets. For example, if you assign a role with reader permissions on the storage account to someone, they can view the properties of the storage account, but they can't make any changes to the properties or view the storage account keys.
  * Storage Account Contributor – They can manage the storage account – they can read the subscription's resource groups and resources, and create and manage subscription resource group deployments. They can also access the storage account keys, which in turn means they can access the data plane.
  * User Access Administrator – They can manage user access to the storage account. For example, they can grant Reader access to a specific user.
  * Virtual Machine Contributor – They can manage virtual machines but not the storage account to which they are connected. This role can list the storage account keys, which means that the user to whom you assign this role can update the data plane.

    In order for a user to create a virtual machine, they have to be able to create the corresponding VHD file in a storage account. To do that, they need to be able to retrieve the storage account key and pass it to the API creating the VM. Therefore, they must have this permission so they can list the storage account keys.
* The ability to define custom roles is a feature that allows you to compose a set of actions from a list of available actions that can be performed on Azure resources.
* The user must be set up in your Azure Active Directory before you can assign a role to them.
* You can create a report of who granted/revoked what kind of access to/from whom and on what scope using PowerShell or the Azure CLI.

#### Resources

* [Azure Active Directory Role-based Access Control](../../role-based-access-control/role-assignments-portal.md)

  This article explains the Azure Active Directory Role-based Access Control and how it works.
* [RBAC: Built in Roles](../../role-based-access-control/built-in-roles.md)

  This article details all of the built-in roles available in RBAC.
* [Understanding Resource Manager deployment and classic deployment](../../azure-resource-manager/resource-manager-deployment-model.md)

### Managing Your Storage Account Keys

Storage account keys are 512-bit strings created by Azure that, along with the storage account name, can be used to access the data objects stored in the storage account, for example, blobs, entities within a table, queue messages, and files on an Azure file share. Controlling access to the storage account keys controls access to the data plane for that storage account.

Each storage account has two keys referred to as "Key 1" and "Key 2" in the [Azure portal](http://portal.azure.com/) and in the PowerShell cmdlets. These can be regenerated manually using one of several methods, including, but not limited to using the [Azure portal](https://portal.azure.com/), PowerShell, the Azure CLI, or programmatically using the .NET Storage Client Library or the Azure Storage Services REST API.

There are any number of reasons to regenerate your storage account keys.

* You might regenerate them on a regular basis for security reasons.
* You would regenerate your storage account keys if someone managed to hack into an application and retrieve the key that was hardcoded or saved in a configuration file, giving them full access to your storage account.
* Another case for key regeneration is if your team is using a Storage Explorer application that retains the storage account key, and one of the team members leaves. The application would continue to work, giving them access to your storage account after they're gone. This is actually the primary reason they created account-level Shared Access Signatures – you can use an account-level SAS instead of storing the access keys in a configuration file.

#### Key regeneration plan

You don't want to just regenerate the key you are using without some planning. If you do that, you could cut off all access to that storage account, which can cause major disruption. This is why there are two keys. You should regenerate one key at a time.

Before you regenerate your keys, be sure you have a list of all of your applications that are dependent on the storage account, as well as any other services you are using in Azure. For example, if you are using Azure Media Services that are dependent on your storage account, you must resync the access keys with your media service after you regenerate the key. If you are using any applications such as a storage explorer, you will need to provide the new keys to those applications as well. If you have VMs whose VHD files are stored in the storage account, they will not be affected by regenerating the storage account keys.

You can regenerate your keys in the Azure portal. Once keys are regenerated, they can take up to 10 minutes to be synchronized across Storage Services.

When you're ready, here's the general process detailing how you should change your key. In this case, the assumption is that you are currently using Key 1 and you are going to change everything to use Key 2 instead.

1. Regenerate Key 2 to ensure that it is secure. You can do this in the Azure portal.
2. In all of the applications where the storage key is stored, change the storage key to use Key 2's new value. Test and publish the application.
3. After all of the applications and services are up and running successfully, regenerate Key 1. This ensures that anybody to whom you have not expressly given the new key will no longer have access to the storage account.

If you are currently using Key 2, you can use the same process, but reverse the key names.

You can migrate over a couple of days, changing each application to use the new key and publishing it. After all of them are done, you should then go back and regenerate the old key so it no longer works.

Another option is to put the storage account key in an [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) as a secret and have your applications retrieve the key from there. Then when you regenerate the key and update the Azure Key Vault, the applications will not need to be redeployed because they will pick up the new key from the Azure Key Vault automatically. You can have the application read the key each time you need it, or you can cache it in memory and if it fails when using it, retrieve the key again from the Azure Key Vault.

Using Azure Key Vault also adds another level of security for your storage keys. If you use this method, you will never have the storage key hardcoded in a configuration file, which removes that avenue of somebody getting access to the keys without specific permission.

Another advantage of using Azure Key Vault is you can also control access to your keys using Azure Active Directory. This means you can grant access to the handful of applications that need to retrieve the keys from Azure Key Vault, and know that other applications will not be able to access the keys without granting them permission specifically.

> [!NOTE]
> Microsoft recommends using only one of the keys in all of your applications at the same time. If you use Key 1 in some places and Key 2 in others, you will not be able to rotate your keys without some application losing access.

#### Resources

* [Manage storage account settings in the Azure portal](storage-account-manage.md)
* [Azure Storage Resource Provider REST API Reference](https://msdn.microsoft.com/library/mt163683.aspx)

## Data Plane Security
Data Plane Security refers to the methods used to secure the data objects stored in Azure Storage. We've seen methods to encrypt the data and security during transit of the data, but how do you go about controlling access to the objects?

You have three options for authorizing access to data objects in Azure Storage, including:

- Using Azure AD to authorize access to filesystems and queues (Preview). Azure AD provides advantages over other approaches to authorization, including removing the need to store secrets in your code. For more information, see [Authenticate access to Azure Storage using Azure Active Directory (Preview)](storage-auth-aad.md). 
- Using your storage account keys to authorize access via Shared Key. Authorizing via Shared Key requires storing your storage account keys in your application, so Microsoft recommends using Azure AD instead where possible. For production applications, or for authorizing access to Azure tables and files, continue using Shared Key while Azure AD integration is in preview.
- Using Shared Access Signatures to grant controlled permissions to specific data objects for a specific amount of time.

In addition to limiting access through authorization, you can also use [Firewalls and Virtual Networks](storage-network-security.md) to limit access to the storage account based on network rules.  This approach enables you deny access to public internet traffic, and to grant access only to specific Azure Virtual Networks or public internet IP address ranges.

### Storage Account Keys

Storage account keys are 512-bit strings created by Azure that, along with the storage account name, can be used to access the data objects stored in the storage account.

For example, you can read files. Many of these actions can be performed through the Azure portal, or using one of many Storage Explorer applications. You can also write code to use the REST API to perform these operations.

As discussed in the section on the [Management Plane Security](#management-plane-security), access to the storage keys for a storage account using the Azure Resource Manager model can be controlled through Role-Based Access Control (RBAC).

### How to delegate access to objects in your account using Shared Access Signatures and Stored Access Policies

A Shared Access Signature is a string containing a security token that can be attached to a URI that allows you to delegate access to storage objects and specify constraints such as the permissions and the date/time range of access.

You can grant access to files or directories.

You could give one customer a SAS token they can use to upload pictures to a filesystem in Blob Storage, and give a web application permission to read those pictures. In both cases, there is a separation of concerns – each application can be given just the access that they require in order to perform their task. This is possible through the use of Shared Access Signatures.

#### Why you want to use Shared Access Signatures

Why would you want to use an SAS instead of just giving out your storage account key, which is so much easier? Giving out your storage account key is like sharing the keys of your storage kingdom. It grants complete access. Someone could use your keys and upload their entire music library to your storage account. They could also replace your files with virus-infected versions, or steal your data. Giving away unlimited access to your storage account is something that should not be taken lightly.

With Shared Access Signatures, you can give a client just the permissions required for a limited amount of time. For example, if someone is uploading a file to your account, you can grant them write access for enough time to upload the file (depending on the size of the file, of course). And if you change your mind, you can revoke that access.

Additionally, you can specify that requests made using a SAS are restricted to a certain IP address or IP address range external to Azure. You can also require that requests are made using a specific protocol (HTTPS or HTTP/HTTPS). This means if you only want to allow HTTPS traffic, you can set the required protocol to HTTPS only, and HTTP traffic will be blocked.

#### Definition of a Shared Access Signature

A Shared Access Signature is a set of query parameters appended to the URL pointing at the resource

that provides information about the access allowed and the length of time for which the access is permitted. Here is an example; this URI provides read access to a blob for five minutes. SAS query parameters must be URL Encoded, such as %3A for colon (:) or %20 for a space.

```
http://mystorage.dfs.core.windows.net/myfilesystem/myfile.txt (URL to the file)
?sv=2015-04-05 (storage service version)
&st=2015-12-10T22%3A18%3A26Z (start time, in UTC time and URL encoded)
&se=2015-12-10T22%3A23%3A26Z (end time, in UTC time and URL encoded)
&sr=b (resource is a blob)
&sp=r (read access)
&sip=168.1.5.60-168.1.5.70 (requests can only come from this range of IP addresses)
&spr=https (only allow HTTPS requests)
&sig=Z%2FRHIX5Xcg0Mq2rqI3OlWTjEg2tYkboXr1P9ZUXDtkk%3D (signature used for the authentication of the SAS)
```

#### How the Shared Access Signature is authorized by the Azure Storage Service

When the storage service receives the request, it takes the input query parameters and creates a signature using the same method as the calling program. It then compares the two signatures. If they agree, then the storage service can check the storage service version to make sure it's valid, verify that the current date and time are within the specified window, make sure the access requested corresponds to the request made, etc.

For example, with our URL above, if the URL was pointing to a file instead of a blob, this request would fail because it specifies that the Shared Access Signature is for a blob. If the REST command being called was to update a blob, it would fail because the Shared Access Signature specifies that only read access is permitted.

#### Types of Shared Access Signatures

* A service-level SAS can be used to access specific resources in a storage account. Some examples of this are retrieving a list of files in a filesystem or downloading a file.
* An account-level SAS can be used to access anything that a service-level SAS can be used for. Additionally, it can give options to resources that are not permitted with a service-level SAS, such as the ability to create filesystems.

#### Creating a SAS URI

1. You can create a URI on demand, defining all of the query parameters each time.

   This approach is flexible, but if you have a logical set of parameters that are similar each time, using a Stored Access Policy is a better idea.
2. You can create a Stored Access Policy for an entire filesystem, file share, table, or queue. Then you can use this as the basis for the SAS URIs you create. Permissions based on Stored Access Policies can be easily revoked. You can have up to five policies defined on each filesystem, queue, table, or file share.

   For example, if you were going to have many people read the blobs in a specific filesystem, you could create a Stored Access Policy that says "give read access" and any other settings that will be the same each time. Then you can create an SAS URI using the settings of the Stored Access Policy and specifying the expiration date/time. The advantage of this is that you don't have to specify all of the query parameters every time.

#### Revocation

Suppose your SAS has been compromised, or you want to change it because of corporate security or regulatory compliance requirements. How do you revoke access to a resource using that SAS? It depends on how you created the SAS URI.

If you are using ad hoc URIs, you have three options. You can issue SAS tokens with short expiration policies and wait for the SAS to expire. You can rename or delete the resource (assuming the token was scoped to a single object). You can change the storage account keys. This last option can have a significant impact, depending on how many services are using that storage account, and probably isn't something you want to do without some planning.

If you are using a SAS derived from a Stored Access Policy, you can remove access by revoking the Stored Access Policy – you can just change it so it has already expired, or you can remove it altogether. This takes effect immediately, and invalidates every SAS created using that Stored Access Policy. Updating or removing the Stored Access Policy may impact people accessing that specific filesystem, file share, table, or queue via SAS, but if the clients are written so they request a new SAS when the old one becomes invalid, this will work fine.

Because using a SAS derived from a Stored Access Policy gives you the ability to revoke that SAS immediately, it is the recommended best practice to always use Stored Access Policies when possible.

#### Resources

For more detailed information on using Shared Access Signatures and Stored Access Policies, complete with examples, refer to the following articles:

* These are the reference articles.

  * [Service SAS](https://msdn.microsoft.com/library/dn140256.aspx)

    This article provides examples of using a service-level SAS with blobs, queue messages, table ranges, and files.
  * [Constructing a service SAS](https://msdn.microsoft.com/library/dn140255.aspx)
  * [Constructing an account SAS](https://msdn.microsoft.com/library/mt584140.aspx)
* These are tutorials for using the .NET client library to create Shared Access Signatures and Stored Access Policies.

  * [Using Shared Access Signatures (SAS)](../storage-dotnet-shared-access-signature-part-1.md)
  * [Shared Access Signatures, Part 2: Create and Use a SAS with the Blob Service](../blobs/storage-dotnet-shared-access-signature-part-2.md)

    This article includes an explanation of the SAS model, examples of Shared Access Signatures, and recommendations for the best practice use of SAS. Also discussed is the revocation of the permission granted.

* Authentication

  * [Authentication for the Azure Storage Services](https://msdn.microsoft.com/library/azure/dd179428.aspx)
* Shared Access Signatures Getting Started Tutorial

  * [SAS Getting Started Tutorial](https://github.com/Azure-Samples/storage-dotnet-sas-getting-started)

## Encryption in Transit

### Transport-Level Encryption – Using HTTPS

Another step you should take to ensure the security of your Azure Storage data is to encrypt the data between the client and Azure Storage. The first recommendation is to always use the [HTTPS](https://en.wikipedia.org/wiki/HTTPS) protocol, which ensures secure communication over the public Internet.

To have a secure communication channel, you should always use HTTPS when calling the REST APIs or accessing objects in storage. Also, **Shared Access Signatures**, which can be used to delegate access to Azure Storage objects, include an option to specify that only the HTTPS protocol can be used when using Shared Access Signatures, ensuring that anybody sending out links with SAS tokens will use the proper protocol.

You can enforce the use of HTTPS when calling the REST APIs to access objects in storage accounts by enabling [Secure transfer required](../storage-require-secure-transfer.md) for the storage account. Connections using HTTP will be refused once this is enabled.

## Encryption at Rest

### Storage Service Encryption (SSE)

SSE is enabled for all storage accounts and cannot be disabled. SSE automatically encrypts your data when writing it to Azure Storage. When you read data from Azure Storage, it is decrypted by Azure Storage before being returned. SSE enables you to secure your data without having to modify code or add code to any applications.

You can use either Microsoft-managed keys or your own custom keys. Microsoft generates managed keys and handles their secure storage as well as their regular rotation, as defined by internal Microsoft policy. For more information about using custom keys, see [Storage Service Encryption using customer-managed keys in Azure Key Vault](storage-service-encryption-customer-managed-keys.md).