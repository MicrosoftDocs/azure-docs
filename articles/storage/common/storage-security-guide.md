---
title: Azure Storage security guide | Microsoft Docs
description: Details the many methods of securing Azure Storage, including but not limited to RBAC, Storage Service Encryption, Client-side Encryption, SMB 3.0, and Azure Disk Encryption.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 03/21/2019
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Azure Storage security guide

Azure Storage provides a comprehensive set of security capabilities that together enable developers to build secure applications:

- All data (including metadata) written to Azure Storage is automatically encrypted using [Storage Service Encryption (SSE)](storage-service-encryption.md). For more information, see [Announcing Default Encryption for Azure Blobs, Files, Table and Queue Storage](https://azure.microsoft.com/blog/announcing-default-encryption-for-azure-blobs-files-table-and-queue-storage/).
- Azure Active Directory (Azure AD) and Role-Based Access Control (RBAC) are supported for Azure Storage for both resource management operations and data operations, as follows:   
    - You can assign RBAC roles scoped to the storage account to security principals and use Azure AD to authorize resource management operations such as key management.
    - Azure AD integration is supported for blob and queue data operations. You can assign RBAC roles scoped to a subscription, resource group, storage account, or an individual container or queue to a security principal or a managed identity for Azure resources. For more information, see [Authenticate access to Azure Storage using Azure Active Directory](storage-auth-aad.md).   
- Data can be secured in transit between an application and Azure by using [Client-Side Encryption](../storage-client-side-encryption.md), HTTPS, or SMB 3.0.  
- OS and data disks used by Azure virtual machines can be encrypted using [Azure Disk Encryption](../../security/azure-security-disk-encryption.md). 
- Delegated access to the data objects in Azure Storage can be granted using [Shared Access Signatures](../storage-dotnet-shared-access-signature-part-1.md).

This article provides an overview of each of these security features that can be used with Azure Storage. Links are provided to articles that will give details of each feature so you can easily do further investigation on each topic.

Here are the topics to be covered in this article:

* [Management Plane Security](#management-plane-security) – Securing your Storage Account

  The management plane consists of the resources used to manage your storage account. This section covers the Azure Resource Manager deployment model and how to use Role-Based Access Control (RBAC) to control access to your storage accounts. It also addresses managing your storage account keys and how to regenerate them.
* [Data Plane Security](#data-plane-security) – Securing Access to Your Data

  In this section, we'll look at allowing access to the actual data objects in your Storage account, such as blobs, files, queues, and tables, using Shared Access Signatures and Stored Access Policies. We will cover both service-level SAS and account-level SAS. We'll also see how to limit access to a specific IP address (or range of IP addresses), how to limit the protocol used to HTTPS, and how to revoke a Shared Access Signature without waiting for it to expire.
* [Encryption in Transit](#encryption-in-transit)

  This section discusses how to secure data when you transfer it into or out of Azure Storage. We'll talk about the recommended use of HTTPS and the encryption used by SMB 3.0 for Azure file shares. We will also take a look at Client-side Encryption, which enables you to encrypt the data before it is transferred into Storage in a client application, and to decrypt the data after it is transferred out of Storage.
* [Encryption at Rest](#encryption-at-rest)

  We will talk about Storage Service Encryption (SSE), which is now automatically enabled for new and existing storage accounts. We will also look at how you can use Azure Disk Encryption and explore the basic differences and cases of Disk Encryption versus SSE versus Client-Side Encryption. We will briefly look at FIPS compliance for U.S. Government computers.
* Using [Storage Analytics](#storage-analytics) to audit access of Azure Storage

  This section discusses how to find information in the storage analytics logs for a request. We'll take a look at real storage analytics log data and see how to discern whether a request is made with the Storage account key, with a Shared Access signature, or anonymously, and whether it succeeded or failed.
* [Enabling Browser-Based Clients using CORS](#cross-origin-resource-sharing-cors)

  This section talks about how to allow cross-origin resource sharing (CORS). We'll talk about cross-domain access, and how to handle it with the CORS capabilities built into Azure Storage.

## Management Plane Security
The management plane consists of operations that affect the storage account itself. For example, you can create or delete a storage account, get a list of storage accounts in a subscription, retrieve the storage account keys, or regenerate the storage account keys.

When you create a new storage account, you select a deployment model of Classic or Resource Manager. The Classic model of creating resources in Azure only allows all-or-nothing access to the subscription, and in turn, the storage account.

This guide focuses on the Resource Manager model that is the recommended means for creating storage accounts. With the Resource Manager storage accounts, rather than giving access to the entire subscription, you can control access on a more finite level to the management plane using Role-Based Access Control (RBAC).

### How to secure your storage account with Role-Based Access Control (RBAC)
Let's talk about what RBAC is, and how you can use it. Each Azure subscription has an Azure Active Directory. Users, groups, and applications from that directory can be granted access to manage resources in the Azure subscription that use the Resource Manager deployment model. This type of security is referred to as Role-Based Access Control (RBAC). To manage this access, you can use the [Azure portal](https://portal.azure.com/), the [Azure CLI tools](../../cli-install-nodejs.md), [PowerShell](/powershell/azureps-cmdlets-docs), or the [Azure Storage Resource Provider REST APIs](https://msdn.microsoft.com/library/azure/mt163683.aspx).

With the Resource Manager model, you put the storage account in a resource group and control access to the management plane of that specific storage account using Azure Active Directory. For example, you can give specific users the ability to access the storage account keys, while other users can view information about the storage account, but cannot access the storage account keys.

#### Granting Access
Access is granted by assigning the appropriate RBAC role to users, groups, and applications, at the right scope. To grant access to the entire subscription, you assign a role at the subscription level. You can grant access to all of the resources in a resource group by granting permissions to the resource group itself. You can also assign specific roles to specific resources, such as storage accounts.

Here are the main points that you need to know about using RBAC to access the management operations of an Azure Storage account:

* When you assign access, you basically assign a role to the account that you want to have access. You can control access to the operations used to manage that storage account, but not to the data objects in the account. For example, you can grant permission to retrieve the properties of the storage account (such as redundancy), but not to a container or data within a container inside Blob Storage.
* For someone to have permission to access the data objects in the storage account, you can give them permission to read the storage account keys, and that user can then use those keys to access the blobs, queues, tables, and files.
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

  This article explains the Resource Manager deployment and classic deployment models, and explains the benefits of using the Resource Manager and resource groups. It explains how the Azure Compute, Network, and Storage Providers work under the Resource Manager model.
* [Managing Role-Based Access Control with the REST API](../../role-based-access-control/role-assignments-rest.md)

  This article shows how to use the REST API to manage RBAC.
* [Azure Storage Resource Provider REST API Reference](https://msdn.microsoft.com/library/azure/mt163683.aspx)

  This API reference describes the APIs you can use to manage your storage account programmatically.
* [Use Resource Manager authentication API to access subscriptions](../../azure-resource-manager/resource-manager-api-authentication.md)

  This article shows how to authenticate using the Resource Manager APIs.
* [Role-Based Access Control for Microsoft Azure from Ignite](https://channel9.msdn.com/events/Ignite/2015/BRK2707)

  This is a link to a video on Channel 9 from the 2015 MS Ignite conference. In this session, they talk about access management and reporting capabilities in Azure, and explore best practices around securing access to Azure subscriptions using Azure Active Directory.

### Managing Your Storage Account Keys
Storage account keys are 512-bit strings created by Azure that, along with the storage account name, can be used to access the data objects stored in the storage account, for example, blobs, entities within a table, queue messages, and files on an Azure file share. Controlling access to the storage account keys controls access to the data plane for that storage account.

Each storage account has two keys referred to as "Key 1" and "Key 2" in the [Azure portal](https://portal.azure.com/) and in the PowerShell cmdlets. These can be regenerated manually using one of several methods, including, but not limited to using the [Azure portal](https://portal.azure.com/), PowerShell, the Azure CLI, or programmatically using the .NET Storage Client Library or the Azure Storage Services REST API.

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

Another option is to put the storage account key in an [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) as a secret and have your applications retrieve the key from there. Then when you regenerate the key and update the Azure Key Vault, the applications will not need to be redeployed because they will pick up the new key from the Azure Key Vault automatically. Note that you can have the application read the key each time you need it, or you can cache it in memory and if it fails when using it, retrieve the key again from the Azure Key Vault.

Using Azure Key Vault also adds another level of security for your storage keys. If you use this method, you will never have the storage key hardcoded in a configuration file, which removes that avenue of somebody getting access to the keys without specific permission.

Another advantage of using Azure Key Vault is you can also control access to your keys using Azure Active Directory. This means you can grant access to the handful of applications that need to retrieve the keys from Azure Key Vault, and know that other applications will not be able to access the keys without granting them permission specifically.

> [!NOTE]
> Microsoft recommends using only one of the keys in all of your applications at the same time. If you use Key 1 in some places and Key 2 in others, you will not be able to rotate your keys without some application losing access.

#### Resources

* [Manage storage account settings in the Azure portal](storage-account-manage.md)
* [Azure Storage Resource Provider REST API Reference](https://msdn.microsoft.com/library/mt163683.aspx)

## Data Plane Security
Data Plane Security refers to the methods used to secure the data objects stored in Azure Storage – the blobs, queues, tables, and files. We've seen methods to encrypt the data and security during transit of the data, but how do you go about controlling access to the objects?

You have three options for authorizing access to data objects in Azure Storage, including:

- Using Azure AD to authorize access to containers and queues. Azure AD provides advantages over other approaches to authorization, including removing the need to store secrets in your code. For more information, see [Authenticate access to Azure Storage using Azure Active Directory](storage-auth-aad.md). 
- Using your storage account keys to authorize access via Shared Key. Authorizing via Shared Key requires storing your storage account keys in your application, so Microsoft recommends using Azure AD instead where possible.
- Using Shared Access Signatures to grant controlled permissions to specific data objects for a specific amount of time.

In addition, for Blob Storage, you can allow public access to your blobs by setting the access level for the container that holds the blobs accordingly. If you set access for a container to Blob or Container, it will allow public read access for the blobs in that container. This means anyone with a URL pointing to a blob in that container can open it in a browser without using a Shared Access Signature or having the storage account keys.

In addition to limiting access through authorization, you can also use [Firewalls and Virtual Networks](storage-network-security.md) to limit access to the storage account based on network rules.  This approach enables you deny access to public internet traffic, and to grant access only to specific Azure Virtual Networks or public internet IP address ranges.

### Storage Account Keys
Storage account keys are 512-bit strings created by Azure that, along with the storage account name, can be used to access the data objects stored in the storage account.

For example, you can read blobs, write to queues, create tables, and modify files. Many of these actions can be performed through the Azure portal, or using one of many Storage Explorer applications. You can also write code to use the REST API or one of the Storage Client Libraries to perform these operations.

As discussed in the section on the [Management Plane Security](#management-plane-security), access to the storage keys for a Classic storage account can be granted by giving full access to the Azure subscription. Access to the storage keys for a storage account using the Azure Resource Manager model can be controlled through Role-Based Access Control (RBAC).

### How to delegate access to objects in your account using Shared Access Signatures and Stored Access Policies
A Shared Access Signature is a string containing a security token that can be attached to a URI that allows you to delegate access to storage objects and specify constraints such as the permissions and the date/time range of access.

You can grant access to blobs, containers, queue messages, files, and tables. With tables, you can actually grant permission to access a range of entities in the table by specifying the partition and row key ranges to which you want the user to have access. For example, if you have data stored with a partition key of geographical state, you could give someone access to just the data for California.

In another example, you might give a web application a SAS token that enables it to write entries to a queue, and give a worker role application a SAS token to get messages from the queue and process them. Or you could give one customer a SAS token they can use to upload pictures to a container in Blob Storage, and give a web application permission to read those pictures. In both cases, there is a separation of concerns – each application can be given just the access that they require in order to perform their task. This is possible through the use of Shared Access Signatures.

#### Why you want to use Shared Access Signatures
Why would you want to use an SAS instead of just giving out your storage account key, which is so much easier? Giving out your storage account key is like sharing the keys of your storage kingdom. It grants complete access. Someone could use your keys and upload their entire music library to your storage account. They could also replace your files with virus-infected versions, or steal your data. Giving away unlimited access to your storage account is something that should not be taken lightly.

With Shared Access Signatures, you can give a client just the permissions required for a limited amount of time. For example, if someone is uploading a blob to your account, you can grant them write access for just enough time to upload the blob (depending on the size of the blob, of course). And if you change your mind, you can revoke that access.

Additionally, you can specify that requests made using a SAS are restricted to a certain IP address or IP address range external to Azure. You can also require that requests are made using a specific protocol (HTTPS or HTTP/HTTPS). This means if you only want to allow HTTPS traffic, you can set the required protocol to HTTPS only, and HTTP traffic will be blocked.

#### Definition of a Shared Access Signature
A Shared Access Signature is a set of query parameters appended to the URL pointing at the resource

that provides information about the access allowed and the length of time for which the access is permitted. Here is an example; this URI provides read access to a blob for five minutes. Note that SAS query parameters must be URL Encoded, such as %3A for colon (:) or %20 for a space.

```
http://mystorage.blob.core.windows.net/mycontainer/myblob.txt (URL to the blob)
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
* A service-level SAS can be used to access specific resources in a storage account. Some examples of this are retrieving a list of blobs in a container, downloading a blob, updating an entity in a table, adding messages to a queue, or uploading a file to a file share.
* An account-level SAS can be used to access anything that a service-level SAS can be used for. Additionally, it can give options to resources that are not permitted with a service-level SAS, such as the ability to create containers, tables, queues, and file shares. You can also specify access to multiple services at once. For example, you might give someone access to both blobs and files in your storage account.

#### Creating a SAS URI
1. You can create a URI on demand, defining all of the query parameters each time.

   This approach is flexible, but if you have a logical set of parameters that are similar each time, using a Stored Access Policy is a better idea.
2. You can create a Stored Access Policy for an entire container, file share, table, or queue. Then you can use this as the basis for the SAS URIs you create. Permissions based on Stored Access Policies can be easily revoked. You can have up to five policies defined on each container, queue, table, or file share.

   For example, if you were going to have many people read the blobs in a specific container, you could create a Stored Access Policy that says "give read access" and any other settings that will be the same each time. Then you can create an SAS URI using the settings of the Stored Access Policy and specifying the expiration date/time. The advantage of this is that you don't have to specify all of the query parameters every time.

#### Revocation
Suppose your SAS has been compromised, or you want to change it because of corporate security or regulatory compliance requirements. How do you revoke access to a resource using that SAS? It depends on how you created the SAS URI.

If you are using ad hoc URIs, you have three options. You can issue SAS tokens with short expiration policies and wait for the SAS to expire. You can rename or delete the resource (assuming the token was scoped to a single object). You can change the storage account keys. This last option can have a significant impact, depending on how many services are using that storage account, and probably isn't something you want to do without some planning.

If you are using a SAS derived from a Stored Access Policy, you can remove access by revoking the Stored Access Policy – you can just change it so it has already expired, or you can remove it altogether. This takes effect immediately, and invalidates every SAS created using that Stored Access Policy. Updating or removing the Stored Access Policy may impact people accessing that specific container, file share, table, or queue via SAS, but if the clients are written so they request a new SAS when the old one becomes invalid, this will work fine.

Because using a SAS derived from a Stored Access Policy gives you the ability to revoke that SAS immediately, it is the recommended best practice to always use Stored Access Policies when possible.

#### Resources
For more detailed information on using Shared Access Signatures and Stored Access Policies, complete with examples, refer to the following articles:

* These are the reference articles.

  * [Service SAS](https://msdn.microsoft.com/library/dn140256.aspx)

    This article provides examples of using a service-level SAS with blobs, queue messages, table ranges, and files.
  * [Constructing a service SAS](https://msdn.microsoft.com/library/dn140255.aspx)
  * [Constructing an account SAS](https://msdn.microsoft.com/library/mt584140.aspx)

* This is a tutorial for using the .NET client library to create Shared Access Signatures and Stored Access Policies.
  * [Using Shared Access Signatures (SAS)](../storage-dotnet-shared-access-signature-part-1.md)

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

### Using encryption during transit with Azure file shares
[Azure Files](../files/storage-files-introduction.md) supports encryption via SMB 3.0 and with HTTPS when using the File REST API. When mounting outside of the Azure region the Azure file share is located in, such as on-premises or in another Azure region, SMB 3.0 with encryption is always required. SMB 2.1 does not support encryption, so by default connections are only allowed within the same region in Azure, but SMB 3.0 with encryption can be enforced by [requiring secure transfer](../storage-require-secure-transfer.md) for the storage account.

SMB 3.0 with encryption is available in [all supported Windows and Windows Server operating systems](../files/storage-how-to-use-files-windows.md) except Windows 7 and Windows Server 2008 R2, which only support SMB 2.1. SMB 3.0 is also supported on [macOS](../files/storage-how-to-use-files-mac.md) and on distributions of [Linux](../files/storage-how-to-use-files-linux.md) using Linux kernel 4.11 and above. Encryption support for SMB 3.0 has also been backported to older versions of the Linux kernel by several Linux distributions, consult [Understanding SMB client requirements](../files/storage-how-to-use-files-linux.md#smb-client-reqs).

### Using Client-side encryption to secure data that you send to storage
Another option that helps you ensure that your data is secure while being transferred between a client application and Storage is Client-side Encryption. The data is encrypted before being transferred into Azure Storage. When retrieving the data from Azure Storage, the data is decrypted after it is received on the client side. Even though the data is encrypted going across the wire, we recommend that you also use HTTPS, as it has data integrity checks built in which help mitigate network errors affecting the integrity of the data.

Client-side encryption is also a method for encrypting your data at rest, as the data is stored in its encrypted form. We'll talk about this in more detail in the section on [Encryption at Rest](#encryption-at-rest).

## Encryption at Rest
There are three Azure features that provide encryption at rest. Azure Disk Encryption is used to encrypt the OS and data disks in IaaS Virtual Machines. Client-side Encryption and SSE are both used to encrypt data in Azure Storage. 

While you can use Client-side Encryption to encrypt the data in transit (which is also stored in its encrypted form in Storage), you may prefer to use HTTPS during the transfer, and have some way for the data to be automatically encrypted when it is stored. There are two ways to do this -- Azure Disk Encryption and SSE. One is used to directly encrypt the data on OS and data disks used by VMs, and the other is used to encrypt data written to Azure Blob Storage.

### Storage Service Encryption (SSE)

SSE is enabled for all storage accounts and cannot be disabled. SSE automatically encrypts your data when writing it to Azure Storage. When you read data from Azure Storage, it is decrypted by Azure Storage before being returned. SSE enables you to secure your data without having to modify code or add code to any applications.

You can use either Microsoft-managed keys or your own custom keys. Microsoft generates managed keys and handles their secure storage as well as their regular rotation, as defined by internal Microsoft policy. For more information about using custom keys, see [Storage Service Encryption using customer-managed keys in Azure Key Vault](storage-service-encryption-customer-managed-keys.md).

SSE automatically encrypts data in all performance tiers (Standard and Premium), all deployment models (Azure Resource Manager and Classic), and all of the Azure Storage services (Blob, Queue, Table, and File). 

### Client-side Encryption
We mentioned client-side encryption when discussing the encryption of the data in transit. This feature allows you to programmatically encrypt your data in a client application before sending it across the wire to be written to Azure Storage, and to programmatically decrypt your data after retrieving it from Azure Storage.

This does provide encryption in transit, but it also provides the feature of Encryption at Rest. Although the data is encrypted in transit, we still recommend using HTTPS to take advantage of the built-in data integrity checks that help mitigate network errors affecting the integrity of the data.

An example of where you might use this is if you have a web application that stores blobs and retrieves blobs, and you want the application and data to be as secure as possible. In that case, you would use client-side encryption. The traffic between the client and the Azure Blob Service contains the encrypted resource, and nobody can interpret the data in transit and reconstitute it into your private blobs.

Client-side encryption is built into the Java and the .NET storage client libraries, which in turn use the Azure Key Vault APIs, making it easy for you to implement. The process of encrypting and decrypting the data uses the envelope technique, and stores metadata used by the encryption in each storage object. For example, for blobs, it stores it in the blob metadata, while for queues, it adds it to each queue message.

For the encryption itself, you can generate and manage your own encryption keys. You can also use keys generated by the Azure Storage Client Library, or you can have the Azure Key Vault generate the keys. You can store your encryption keys in your on-premises key storage, or you can store them in an Azure Key Vault. Azure Key Vault allows you to grant access to the secrets in Azure Key Vault to specific users using Azure Active Directory. This means that not just anybody can read the Azure Key Vault and retrieve the keys you're using for client-side encryption.

#### Resources
* [Encrypt and decrypt blobs in Microsoft Azure Storage using Azure Key Vault](../blobs/storage-encrypt-decrypt-blobs-key-vault.md)

  This article shows how to use client-side encryption with Azure Key Vault, including how to create the KEK and store it in the vault using PowerShell.
* [Client-Side Encryption and Azure Key Vault for Microsoft Azure Storage](../storage-client-side-encryption.md)

  This article gives an explanation of client-side encryption, and provides examples of using the storage client library to encrypt and decrypt resources from the four storage services. It also talks about Azure Key Vault.

### Using Azure Disk Encryption to encrypt disks used by your virtual machines
Azure Disk Encryption allows you to encrypt the OS disks and Data disks used by an IaaS Virtual Machine. For Windows, the drives are encrypted using industry-standard BitLocker encryption technology. For Linux, the disks are encrypted using the DM-Crypt technology. This is integrated with Azure Key Vault to allow you to control and manage the disk encryption keys.

The solution supports the following scenarios for IaaS VMs when they are enabled in Microsoft Azure:

* Integration with Azure Key Vault
* Standard tier VMs: [A, D, DS, G, GS, and so forth series IaaS VMs](https://azure.microsoft.com/pricing/details/virtual-machines/)
* Enabling encryption on Windows and Linux IaaS VMs
* Disabling encryption on OS and data drives for Windows IaaS VMs
* Disabling encryption on data drives for Linux IaaS VMs
* Enabling encryption on IaaS VMs that are running Windows client OS
* Enabling encryption on volumes with mount paths
* Enabling encryption on Linux VMs that are configured with disk striping (RAID) by using mdadm
* Enabling encryption on Linux VMs by using LVM for data disks
* Enabling encryption on Windows VMs that are configured by using storage spaces
* All Azure public regions are supported

The solution does not support the following scenarios, features, and technology in the release:

* Basic tier IaaS VMs
* Disabling encryption on an OS drive for Linux IaaS VMs
* IaaS VMs that are created by using the classic VM creation method
* Integration with your on-premises Key Management Service
* Azure Files (shared file system), Network File System (NFS), dynamic volumes, and Windows VMs that are configured with software-based RAID systems


> [!NOTE]
> Linux OS disk encryption is currently supported on the following Linux distributions: RHEL 7.2, CentOS 7.2n, and Ubuntu 16.04.
>
>

This feature ensures that all data on your virtual machine disks is encrypted at rest in Azure Storage.

#### Resources
* [Azure Disk Encryption for Windows and Linux IaaS VMs](https://docs.microsoft.com/azure/security/azure-security-disk-encryption)

### Comparison of Azure Disk Encryption, SSE, and Client-Side Encryption

#### IaaS VMs and their VHD files

For data disks used by IaaS VMs, Azure Disk Encryption is recommended. If you create a VM with unmanaged disks using an image from the Azure Marketplace, Azure performs a [shallow copy](https://en.wikipedia.org/wiki/Object_copying) of the image to your storage account in Azure Storage, and it is not encrypted even if you have SSE enabled. After it creates the VM and starts updating the image, SSE will start encrypting the data. For this reason, it's best to use Azure Disk Encryption on VMs with unmanaged disks created from images in the Azure Marketplace if you want them fully encrypted. If you create a VM with Managed Disks, SSE encrypts all the data by default using platform managed keys. 

If you bring a pre-encrypted VM into Azure from on-premises, you will be able to upload the encryption keys to Azure Key Vault, and continue using the encryption for that VM that you were using on-premises. Azure Disk Encryption is enabled to handle this scenario.

If you have non-encrypted VHD from on-premises, you can upload it into the gallery as a custom image and provision a VM from it. If you do this using the Resource Manager templates, you can ask it to turn on Azure Disk Encryption when it boots up the VM.

When you add a data disk and mount it on the VM, you can turn on Azure Disk Encryption on that data disk. It will encrypt that data disk locally first, and then the classic deployment model layer will do a lazy write against storage so the storage content is encrypted.

#### Client-side encryption
Client-side encryption is the most secure method of encrypting your data, because it encrypts data prior to transit.  However, it does require that you add code to your applications using storage, which you may not want to do. In those cases, you can use HTTPS to secure your data in transit. Once data reaches Azure Storage, it is encrypted by SSE.

With client-side encryption, you can encrypt table entities, queue messages, and blobs. 

Client-side encryption is managed entirely by the application. This is the most secure approach, but does require you to make programmatic changes to your application and put key management processes in place. You would use this when you want the extra security during transit, and you want your stored data to be encrypted.

Client-side encryption is more load on the client, and you have to account for this in your scalability plans, especially if you are encrypting and transferring a large amount of data.

#### Storage Service Encryption (SSE)

SSE is managed by Azure Storage. SSE does not provide for the security of the data in transit, but it does encrypt the data as it is written to Azure Storage. SSE does not affect Azure Storage performance.

You can encrypt any kind of data of the storage account using SSE (block blobs, append blobs, page blobs, table data, queue data, and files).

If you have an archive or library of VHD files that you use as a basis for creating new virtual machines, you can create a new storage account and then upload the VHD files to that account. Those VHD files will be encrypted by Azure Storage.

If you have Azure Disk Encryption enabled for the disks in a VM, then any newly written data is encrypted both by SSE and by Azure Disk Encryption.

## Storage Analytics
### Using Storage Analytics to monitor authorization type
For each storage account, you can enable Azure Storage Analytics to perform logging and store metrics data. This is a great tool to use when you want to check the performance metrics of a storage account, or need to troubleshoot a storage account because you are having performance problems.

Another piece of data you can see in the storage analytics logs is the authentication method used by someone when they access storage. For example, with Blob Storage, you can see if they used a Shared Access Signature or the storage account keys, or if the blob accessed was public.

This can be helpful if you are tightly guarding access to storage. For example, in Blob Storage you can set all of the containers to private and implement the use of an SAS service throughout your applications. Then you can check the logs regularly to see if your blobs are accessed using the storage account keys, which may indicate a breach of security, or if the blobs are public but they shouldn't be.

#### What do the logs look like?
After you enable the storage account metrics and logging through the Azure portal, analytics data will start to accumulate quickly. The logging and metrics for each service is separate; the logging is only written when there is activity in that storage account, while the metrics will be logged every minute, every hour, or every day, depending on how you configure it.

The logs are stored in block blobs in a container named $logs in the storage account. This container is automatically created when Storage Analytics is enabled. Once this container is created, you can't delete it, although you can delete its contents.

Under the $logs container, there is a folder for each service, and then there are subfolders for the year/month/day/hour. Under hour, the logs are numbered. This is what the directory structure will look like:

![View of log files](./media/storage-security-guide/image1.png)

Every request to Azure Storage is logged. Here's a snapshot of a log file, showing the first few fields.

![Snapshot of a log file](./media/storage-security-guide/image2.png)

You can see that you can use the logs to track any kind of calls to a storage account.

#### What are all of those fields for?
There is an article listed in the resources below that provides the list of the many fields in the logs and what they are used for. Here is the list of fields in order:

![Snapshot of fields in a log file](./media/storage-security-guide/image3.png)

We're interested in the entries for GetBlob, and how they are authorized, so we need to look for entries with operation-type "Get-Blob", and check the request-status (fourth</sup> column) and the authorization-type (eighth</sup> column).

For example, in the first few rows in the listing above, the request-status is "Success" and the authorization-type is "authenticated". This means the request was authorized using the storage account key.

#### How is access to my blobs being authorized?
We have three cases that we are interested in.

1. The blob is public and it is accessed using a URL without a Shared Access Signature. In this case, the request-status is "AnonymousSuccess" and the authorization-type is "anonymous".

   1.0;2015-11-17T02:01:29.0488963Z;GetBlob;**AnonymousSuccess**;200;124;37;**anonymous**;;mystorage…
2. The blob is private and was used with a Shared Access Signature. In this case, the request-status is "SASSuccess" and the authorization-type is "sas".

   1.0;2015-11-16T18:30:05.6556115Z;GetBlob;**SASSuccess**;200;416;64;**sas**;;mystorage…
3. The blob is private and the storage key was used to access it. In this case, the request-status is "**Success**" and the authorization-type is "**authenticated**".

   1.0;2015-11-16T18:32:24.3174537Z;GetBlob;**Success**;206;59;22;**authenticated**;mystorage…

You can use the Microsoft Message Analyzer to view and analyze these logs. It includes search and filter capabilities. For example, you might want to search for instances of GetBlob to see if the usage is what you expect, that is, to make sure someone is not accessing your storage account inappropriately.

#### Resources
* [Storage Analytics](../storage-analytics.md)

  This article is an overview of storage analytics and how to enable them.
* [Storage Analytics Log Format](https://msdn.microsoft.com/library/azure/hh343259.aspx)

  This article illustrates the Storage Analytics Log Format, and details the fields available therein, including authentication-type, which indicates the type of authentication used for the request.
* [Monitor a Storage Account in the Azure portal](../storage-monitor-storage-account.md)

  This article shows how to configure monitoring of metrics and logging for a storage account.
* [End-to-End Troubleshooting using Azure Storage Metrics and Logging, AzCopy, and Message Analyzer](../storage-e2e-troubleshooting.md)

  This article talks about troubleshooting using the Storage Analytics and shows how to use the Microsoft Message Analyzer.
* [Microsoft Message Analyzer Operating Guide](https://technet.microsoft.com/library/jj649776.aspx)

  This article is the reference for the Microsoft Message Analyzer and includes links to a tutorial, quickstart, and feature summary.

## Cross-Origin Resource Sharing (CORS)
### Cross-domain access of resources
When a web browser running in one domain makes an HTTP request for a resource from a different domain, this is called a cross-origin HTTP request. For example, an HTML page served from contoso.com makes a request for a jpeg hosted on fabrikam.blob.core.windows.net. For security reasons, browsers restrict cross-origin HTTP requests initiated from within scripts, such as JavaScript. This means that when some JavaScript code on a web page on contoso.com requests that jpeg on fabrikam.blob.core.windows.net, the browser will not allow the request.

What does this have to do with Azure Storage? Well, if you are storing static assets such as JSON or XML data files in Blob Storage using a storage account called Fabrikam, the domain for the assets will be fabrikam.blob.core.windows.net, and the contoso.com web application will not be able to access them using JavaScript because the domains are different. This is also true if you're trying to call one of the Azure Storage Services – such as Table Storage – that return JSON data to be processed by the JavaScript client.

#### Possible solutions
One way to resolve this is to assign a custom domain like "storage.contoso.com" to fabrikam.blob.core.windows.net. The problem is that you can only assign that custom domain to one storage account. What if the assets are stored in multiple storage accounts?

Another way to resolve this is to have the web application act as a proxy for the storage calls. This means if you are uploading a file to Blob Storage, the web application would either write it locally and then copy it to Blob Storage, or it would read all of it into memory and then write it to Blob Storage. Alternately, you could write a dedicated web application (such as a Web API) that uploads the files locally and writes them to Blob Storage. Either way, you have to account for that function when determining the scalability needs.

#### How can CORS help?
Azure Storage allows you to enable CORS – Cross Origin Resource Sharing. For each storage account, you can specify domains that can access the resources in that storage account. For example, in our case outlined above, we can enable CORS on the fabrikam.blob.core.windows.net storage account and configure it to allow access to contoso.com. Then the web application contoso.com can directly access the resources in fabrikam.blob.core.windows.net.

One thing to note is that CORS allows access, but it does not provide authentication, which is required for all non-public access of storage resources. This means you can only access blobs if they are public or you include a Shared Access Signature giving you the appropriate permission. Tables, queues, and files have no public access, and require a SAS.

By default, CORS is disabled on all services. You can enable CORS by using the REST API or the storage client library to call one of the methods to set the service policies. When you do that, you include a CORS rule, which is in XML. Here's an example of a CORS rule that has been set using the Set Service Properties operation for the Blob Service for a storage account. You can perform that operation using the storage client library or the REST APIs for Azure Storage.

```xml
<Cors>    
    <CorsRule>
        <AllowedOrigins>http://www.contoso.com, http://www.fabrikam.com</AllowedOrigins>
        <AllowedMethods>PUT,GET</AllowedMethods>
        <AllowedHeaders>x-ms-meta-data*,x-ms-meta-target*,x-ms-meta-abc</AllowedHeaders>
        <ExposedHeaders>x-ms-meta-*</ExposedHeaders>
        <MaxAgeInSeconds>200</MaxAgeInSeconds>
    </CorsRule>
<Cors>
```

Here's what each row means:

* **AllowedOrigins** This tells which non-matching domains can request and receive data from the storage service. This says that both contoso.com and fabrikam.com can request data from Blob Storage for a specific storage account. You can also set this to a wildcard (\*) to allow all domains to access requests.
* **AllowedMethods** This is the list of methods (HTTP request verbs) that can be used when making the request. In this example, only PUT and GET are allowed. You can set this to a wildcard (\*) to allow all methods to be used.
* **AllowedHeaders** This is the request headers that the origin domain can specify when making the request. In this example, all metadata headers starting with x-ms-meta-data, x-ms-meta-target, and x-ms-meta-abc are permitted. The wildcard character (\*) indicates that any header beginning with the specified prefix is allowed.
* **ExposedHeaders** This tells which response headers should be exposed by the browser to the request issuer. In this example, any header starting with "x-ms-meta-" will be exposed.
* **MaxAgeInSeconds** This is the maximum amount of time that a browser will cache the preflight OPTIONS request. (For more information about the preflight request, check the first article below.)

#### Resources
For more information about CORS and how to enable it, check out these resources.

* [Cross-Origin Resource Sharing (CORS) Support for the Azure Storage Services on Azure.com](../storage-cors-support.md)

  This article provides an overview of CORS and how to set the rules for the different storage services.
* [Cross-Origin Resource Sharing (CORS) Support for the Azure Storage Services on MSDN](https://msdn.microsoft.com/library/azure/dn535601.aspx)

  This is the reference documentation for CORS support for the Azure Storage Services. This has links to articles applying to each storage service, and shows an example and explains each element in the CORS file.
* [Microsoft Azure Storage: Introducing CORS](https://blogs.msdn.com/b/windowsazurestorage/archive/2014/02/03/windows-azure-storage-introducing-cors.aspx)

  This is a link to the initial blog article announcing CORS and showing how to use it.

## Frequently asked questions about Azure Storage security
1. **How can I verify the integrity of the blobs I'm transferring into or out of Azure Storage if I can't use the HTTPS protocol?**

   If for any reason you need to use HTTP instead of HTTPS and you are working with block blobs, you can use MD5 checking to help verify the integrity of the blobs being transferred. This will help with protection from network/transport layer errors, but not necessarily with intermediary attacks.

   If you can use HTTPS, which provides transport level security, then using MD5 checking is redundant and unnecessary.

   For more information, please check out the [Azure Blob MD5 Overview](https://blogs.msdn.com/b/windowsazurestorage/archive/2011/02/18/windows-azure-blob-md5-overview.aspx).
2. **What about FIPS-Compliance for the U.S. Government?**

   The United States Federal Information Processing Standard (FIPS) defines cryptographic algorithms approved for use by U.S. Federal government computer systems for the protection of sensitive data. Enabling FIPS mode on a Windows server or desktop tells the OS that only FIPS-validated cryptographic algorithms should be used. If an application uses non-compliant algorithms, the applications will break. With.NET Framework versions 4.5.2 or higher, the application automatically switches the cryptography algorithms to use FIPS-compliant algorithms when the computer is in FIPS mode.

   Microsoft leaves it up to each customer to decide whether to enable FIPS mode. We believe there is no compelling reason for customers who are not subject to government regulations to enable FIPS mode by default.

### Resources
* [Why We're Not Recommending "FIPS Mode" Anymore](https://blogs.technet.microsoft.com/secguide/2014/04/07/why-were-not-recommending-fips-mode-anymore/)

  This blog article gives an overview of FIPS and explains why they don't enable FIPS mode by default.
* [FIPS 140 Validation](https://technet.microsoft.com/library/cc750357.aspx)

  This article provides information on how Microsoft products and cryptographic modules comply with the FIPS standard for the U.S. Federal government.
* ["System cryptography: Use FIPS compliant algorithms for encryption, hashing, and signing" security settings effects in Windows XP and in later versions of Windows](https://support.microsoft.com/kb/811833)

  This article talks about the use of FIPS mode in older Windows computers.
