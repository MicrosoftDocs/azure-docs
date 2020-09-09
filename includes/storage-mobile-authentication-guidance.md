---
author: tamram
ms.service: storage
ms.topic: include
ms.date: 10/26/2018
ms.author: tamram
---
## Configure your application to access Azure Storage
There are two ways to authenticate your application to access Storage services:

* Shared Key: Use Shared Key for testing purposes only
* Shared Access Signature (SAS): Use SAS for production applications

### Shared Key
Shared Key authentication means that your application will use your account name and account key to access Storage services. For the purposes of quickly showing how to use this library, we will be using Shared Key authentication in this getting started.

> [!WARNING] 
> **Only use Shared Key authentication for testing purposes!** Your account name and account key, which give full read/write access to the associated Storage account, will be distributed to every person that downloads your app. This is **not** a good practice as you risk having your key compromised by untrusted clients.
> 
> 

When using Shared Key authentication, you will create a [connection string](../articles/storage/common/storage-configure-connection-string.md). The connection string is comprised of:  

* The **DefaultEndpointsProtocol** - you can choose HTTP or HTTPS. However, using HTTPS is highly recommended.
* The **Account Name** - the name of your storage account
* The **Account Key** - On the [Azure Portal](https://portal.azure.com), navigate to your storage account and click the **Keys** icon to find this information.
* (Optional) **EndpointSuffix** - This is used for storage services in regions with different endpoint suffixes, such as Azure China or Azure Governance.

Here is an example of connection string using Shared Key authentication:

`"DefaultEndpointsProtocol=https;AccountName=your_account_name_here;AccountKey=your_account_key_here"`

### Shared Access Signatures (SAS)
For a mobile application, the recommended method for authenticating a request by a client against the Azure Storage service is by using a Shared Access Signature (SAS). SAS allows you to grant a client access to a resource for a specified period of time, with a specified set of permissions.
As the storage account owner, you'll need to generate a SAS for your mobile clients to consume. To generate the SAS, you'll probably want to write a separate service that generates the SAS to be distributed to your clients. For testing purposes, you can use the [Microsoft Azure Storage Explorer](https://storageexplorer.com) or the [Azure Portal](https://portal.azure.com) to generate a SAS. When you create the SAS, you can specify the time interval over which the SAS is valid, and the permissions that the SAS grants to the client.

The following example shows how to use the Microsoft Azure Storage Explorer to generate a SAS.

1. If you haven't already, [Install the Microsoft Azure Storage Explorer](https://storageexplorer.com)
2. Connect to your subscription.
3. Click on your Storage account and click on the "Actions" tab at the bottom left. Click "Get Shared Access Signature" to generate a "connection string" for your SAS.
4. Here is an example of a SAS connection string that grants read and write permissions at the service, container and object level for the blob service of the Storage account.
   
   `"SharedAccessSignature=sv=2015-04-05&ss=b&srt=sco&sp=rw&se=2016-07-21T18%3A00%3A00Z&sig=3ABdLOJZosCp0o491T%2BqZGKIhafF1nlM3MzESDDD3Gg%3D;BlobEndpoint=https://youraccount.blob.core.windows.net"`

As you can see, when using a SAS, you’re not exposing your account key in your application. You can learn more about SAS and best practices for using SAS by checking out [Shared Access Signatures: Understanding the SAS model](../articles/storage/common/storage-dotnet-shared-access-signature-part-1.md).

