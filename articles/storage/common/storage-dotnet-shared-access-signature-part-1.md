---
title: Using shared access signatures (SAS) in Azure Storage | Microsoft Docs
description: Learn to use shared access signatures (SAS) to delegate access to Azure Storage resources, including blobs, queues, tables, and files.
services: storage
author: craigshoemaker
ms.service: storage
ms.topic: article
ms.date: 04/18/2017
ms.author: cshoe
ms.component: common
---
# Using shared access signatures (SAS)

A shared access signature (SAS) provides you with a way to grant limited access to objects in your storage account to other clients, without exposing your account key. In this article, we provide an overview of the SAS model, review SAS best practices, and look at some examples.

For additional code examples using SAS beyond those presented here, see [Getting Started with Azure Blob Storage in .NET](https://azure.microsoft.com/documentation/samples/storage-blob-dotnet-getting-started/) and other samples available in the [Azure Code Samples](https://azure.microsoft.com/documentation/samples/?service=storage) library. You can download the sample applications and run them, or browse the code on GitHub.

## What is a shared access signature?
A shared access signature provides delegated access to resources in your storage account. With a SAS, you can grant clients access to resources in your storage account, without sharing your account keys. This is the key point of using shared access signatures in your applications--a SAS is a secure way to share your storage resources without compromising your account keys.

[!INCLUDE [storage-account-key-note-include](../../../includes/storage-account-key-note-include.md)]

A SAS gives you granular control over the type of access you grant to clients who have the SAS, including:

* The interval over which the SAS is valid, including the start time and the expiry time.
* The permissions granted by the SAS. For example, a SAS for a blob might grant read and write permissions to that blob, but not delete permissions.
* An optional IP address or range of IP addresses from which Azure Storage will accept the SAS. For example, you might specify a range of IP addresses belonging to your organization.
* The protocol over which Azure Storage will accept the SAS. You can use this optional parameter to restrict access to clients using HTTPS.

## When should you use a shared access signature?
You can use a SAS when you want to provide access to resources in your storage account to any client not possessing your storage account's access keys. Your storage account includes both a primary and secondary access key, both of which grant administrative access to your account, and all resources within it. Exposing either of these keys opens your account to the possibility of malicious or negligent use. Shared access signatures provide a safe alternative that allows clients to read, write, and delete data in your storage account according to the permissions you've explicitly granted, and without need for an account key.

A common scenario where a SAS is useful is a service where users read and write their own data to your storage account. In a scenario where a storage account stores user data, there are two typical design patterns:

1. Clients upload and download data via a front-end proxy service, which performs authentication. This front-end proxy service has the advantage of allowing validation of business rules, but for large amounts of data or high-volume transactions, creating a service that can scale to match demand may be expensive or difficult.

  ![Scenario diagram: Front-end proxy service](./media/storage-dotnet-shared-access-signature-part-1/sas-storage-fe-proxy-service.png)   

1. A lightweight service authenticates the client as needed and then generates a SAS. Once the client receives the SAS, they can access storage account resources directly with the permissions defined by the SAS and for the interval allowed by the SAS. The SAS mitigates the need for routing all data through the front-end proxy service.

  ![Scenario diagram: SAS provider service](./media/storage-dotnet-shared-access-signature-part-1/sas-storage-provider-service.png)   

Many real-world services may use a hybrid of these two approaches. For example, some data might be processed and validated via the front-end proxy, while other data is saved and/or read directly using SAS.

Additionally, you will need to use a SAS to authorize access to the source object in a copy operation in certain scenarios:

* When you copy a blob to another blob that resides in a different storage account, you must use a SAS to authorize access to the source blob. You can optionally use a SAS to authorize access to the destination blob as well.
* When you copy a file to another file that resides in a different storage account, you must use a SAS to authorize access to the source file. You can optionally use a SAS to authorize access to the destination file as well.
* When you copy a blob to a file, or a file to a blob, you must use a SAS to authorize access to the source object, even if the source and destination objects reside within the same storage account.

## Types of shared access signatures
You can create two types of shared access signatures:

* **Service SAS.** The service SAS delegates access to a resource in just one of the storage services: the Blob, Queue, Table, or File service. See [Constructing a Service SAS](https://msdn.microsoft.com/library/dn140255.aspx) and [Service SAS Examples](https://msdn.microsoft.com/library/dn140256.aspx) for in-depth information about constructing the service SAS token.
* **Account SAS.** The account SAS delegates access to resources in one or more of the storage services. All of the operations available via a service SAS are also available via an account SAS. Additionally, with the account SAS, you can delegate access to operations that apply to a given service, such as **Get/Set Service Properties** and **Get Service Stats**. You can also delegate access to read, write, and delete operations on blob containers, tables, queues, and file shares that are not permitted with a service SAS. See [Constructing an Account SAS](https://msdn.microsoft.com/library/mt584140.aspx) for in-depth information about constructing the account SAS token.

## How a shared access signature works
A shared access signature is a signed URI that points to one or more storage resources and includes a token that contains a special set of query parameters. The token indicates how the resources may be accessed by the client. One of the query parameters, the signature, is constructed from the SAS parameters and signed with the account key. This signature is used by Azure Storage to authorize access to the storage resource.

Here's an example of a SAS URI, showing the resource URI and the SAS token:

![Components of a SAS URI](./media/storage-dotnet-shared-access-signature-part-1/sas-storage-uri.png)   

The SAS token is a string you generate on the *client* side (see the [SAS examples](#sas-examples) section for code examples). A SAS token you generate with the storage client library, for example, is not tracked by Azure Storage in any way. You can create an unlimited number of SAS tokens on the client side.

When a client provides a SAS URI to Azure Storage as part of a request, the service checks the SAS parameters and signature to verify that it is valid for authenticating the request. If the service verifies that the signature is valid, then the request is authorized. Otherwise, the request is declined with error code 403 (Forbidden).

## Shared access signature parameters
The account SAS and service SAS tokens include some common parameters, and also take a few parameters that are different.

### Parameters common to account SAS and service SAS tokens
* **Api version** An optional parameter that specifies the storage service version to use to execute the request.
* **Service version** A required parameter that specifies the storage service version to use to authorize the request.
* **Start time.** This is the time at which the SAS becomes valid. The start time for a shared access signature is optional. If a start time is omitted, the SAS is effective immediately. The start time must be expressed in UTC (Coordinated Universal Time), with a special UTC designator ("Z"), for example `1994-11-05T13:15:30Z`.
* **Expiry time.** This is the time after which the SAS is no longer valid. Best practices recommend that you either specify an expiry time for a SAS, or associate it with a stored access policy. The expiry time must be expressed in UTC (Coordinated Universal Time), with a special UTC designator ("Z"), for example `1994-11-05T13:15:30Z` (see more below).
* **Permissions.** The permissions specified on the SAS indicate what operations the client can perform against the storage resource using the SAS. Available permissions differ for an account SAS and a service SAS.
* **IP.** An optional parameter that specifies an IP address or a range of IP addresses outside of Azure (see the section [Routing session configuration state](../../expressroute/expressroute-workflows.md#routing-session-configuration-state) for Express Route) from which to accept requests.
* **Protocol.** An optional parameter that specifies the protocol permitted for a request. Possible values are both HTTPS and HTTP (`https,http`), which is the default value, or HTTPS only (`https`). Note that HTTP only is not a permitted value.
* **Signature.** The signature is constructed from the other parameters specified as part token and then encrypted. The signature is used to authorize access to the specified storage resources.

### Parameters for a service SAS token
* **Storage resource.** Storage resources for which you can delegate access with a service SAS include:
  * Containers and blobs
  * File shares and files
  * Queues
  * Tables and ranges of table entities.

### Parameters for an account SAS token
* **Service or services.** An account SAS can delegate access to one or more of the storage services. For example, you can create an account SAS that delegates access to the Blob and File service. Or you can create a SAS that delegates access to all four services (Blob, Queue, Table, and File).
* **Storage resource types.** An account SAS applies to one or more classes of storage resources, rather than a specific resource. You can create an account SAS to delegate access to:
  * Service-level APIs, which are called against the storage account resource. Examples include **Get/Set Service Properties**, **Get Service Stats**, and **List Containers/Queues/Tables/Shares**.
  * Container-level APIs, which are called against the container objects for each service: blob containers, queues, tables, and file shares. Examples include **Create/Delete Container**, **Create/Delete Queue**, **Create/Delete Table**, **Create/Delete Share**, and **List Blobs/Files and Directories**.
  * Object-level APIs, which are called against blobs, queue messages, table entities, and files. For example, **Put Blob**, **Query Entity**, **Get Messages**, and **Create File**.

## Examples of SAS URIs

### Service SAS URI example

Here is an example of a service SAS URI that provides read and write permissions to a blob. The table breaks down each part of the URI to understand how it contributes to the SAS:

```
https://myaccount.blob.core.windows.net/sascontainer/sasblob.txt?sv=2015-04-05&st=2015-04-29T22%3A18%3A26Z&se=2015-04-30T02%3A23%3A26Z&sr=b&sp=rw&sip=168.1.5.60-168.1.5.70&spr=https&sig=Z%2FRHIX5Xcg0Mq2rqI3OlWTjEg2tYkboXr1P9ZUXDtkk%3D
```

| Name | SAS portion | Description |
| --- | --- | --- |
| Blob URI |`https://myaccount.blob.core.windows.net/sascontainer/sasblob.txt` |The address of the blob. Note that using HTTPS is highly recommended. |
| Storage services version |`sv=2015-04-05` |For storage services version 2012-02-12 and later, this parameter indicates the version to use. |
| Start time |`st=2015-04-29T22%3A18%3A26Z` |Specified in UTC time. If you want the SAS to be valid immediately, omit the start time. |
| Expiry time |`se=2015-04-30T02%3A23%3A26Z` |Specified in UTC time. |
| Resource |`sr=b` |The resource is a blob. |
| Permissions |`sp=rw` |The permissions granted by the SAS include Read (r) and Write (w). |
| IP range |`sip=168.1.5.60-168.1.5.70` |The range of IP addresses from which a request will be accepted. |
| Protocol |`spr=https` |Only requests using HTTPS are permitted. |
| Signature |`sig=Z%2FRHIX5Xcg0Mq2rqI3OlWTjEg2tYkboXr1P9ZUXDtkk%3D` |Used to authorize access to the blob. The signature is an HMAC computed over a string-to-sign and key using the SHA256 algorithm, and then encoded using Base64 encoding. |

### Account SAS URI example

Here is an example of an account SAS that uses the same common parameters on the token. Since these parameters are described above, they are not described here. Only the parameters that are specific to account SAS are described in the table below.

```
https://myaccount.blob.core.windows.net/?restype=service&comp=properties&sv=2015-04-05&ss=bf&srt=s&st=2015-04-29T22%3A18%3A26Z&se=2015-04-30T02%3A23%3A26Z&sr=b&sp=rw&sip=168.1.5.60-168.1.5.70&spr=https&sig=F%6GRVAZ5Cdj2Pw4tgU7IlSTkWgn7bUkkAg8P6HESXwmf%4B
```

| Name | SAS portion | Description |
| --- | --- | --- |
| Resource URI |`https://myaccount.blob.core.windows.net/?restype=service&comp=properties` |The Blob service endpoint, with parameters for getting service properties (when called with GET) or setting service properties (when called with SET). |
| Services |`ss=bf` |The SAS applies to the Blob and File services |
| Resource types |`srt=s` |The SAS applies to service-level operations. |
| Permissions |`sp=rw` |The permissions grant access to read and write operations. |

Given that permissions are restricted to the service level, accessible operations with this SAS are **Get Blob Service Properties** (read) and **Set Blob Service Properties** (write). However, with a different resource URI, the same SAS token could also be used to delegate access to **Get Blob Service Stats** (read).

## Controlling a SAS with a stored access policy
A shared access signature can take one of two forms:

* **Ad hoc SAS:** When you create an ad hoc SAS, the start time, expiry time, and permissions for the SAS are all specified in the SAS URI (or implied, in the case where start time is omitted). This type of SAS can be created as an account SAS or a service SAS.
* **SAS with stored access policy:** A stored access policy is defined on a resource container--a blob container, table, queue, or file share--and can be used to manage constraints for one or more shared access signatures. When you associate a SAS with a stored access policy, the SAS inherits the constraints--the start time, expiry time, and permissions--defined for the stored access policy.

> [!NOTE]
> Currently, an account SAS must be an ad hoc SAS. Stored access policies are not yet supported for account SAS.

The difference between the two forms is important for one key scenario: revocation. Because a SAS URI is a URL, anyone that obtains the SAS can use it, regardless of who originally created it. If a SAS is published publicly, it can be used by anyone in the world. A SAS grants access to resources to anyone possessing it until one of four things happens:

1. The expiry time specified on the SAS is reached.
2. The expiry time specified on the stored access policy referenced by the SAS is reached (if a stored access policy is referenced, and if it specifies an expiry time). This can occur either because the interval elapses, or because you've modified the stored access policy with an expiry time in the past, which is one way to revoke the SAS.
3. The stored access policy referenced by the SAS is deleted, which is another way to revoke the SAS. Note that if you recreate the stored access policy with exactly the same name, all existing SAS tokens will again be valid according to the permissions associated with that stored access policy (assuming that the expiry time on the SAS has not passed). If you are intending to revoke the SAS, be sure to use a different name if you recreate the access policy with an expiry time in the future.
4. The account key that was used to create the SAS is regenerated. Regenerating an account key will cause all application components using that key to fail to authorize until they're updated to use either the other valid account key or the newly regenerated account key.

> [!IMPORTANT]
> A shared access signature URI is associated with the account key used to create the signature, and the associated stored access policy (if any). If no stored access policy is specified, the only way to revoke a shared access signature is to change the account key.

## Authenticating from a client application with a SAS
A client who is in possession of a SAS can use the SAS to authorize a request against a storage account for which they do not possess the account keys. A SAS can be included in a connection string, or used directly from the appropriate constructor or method.

### Using a SAS in a connection string
[!INCLUDE [storage-use-sas-in-connection-string-include](../../../includes/storage-use-sas-in-connection-string-include.md)]

### Using a SAS in a constructor or method
Several Azure Storage client library constructors and method overloads offer a SAS parameter, so that you can authorize a request to the service with a SAS.

For example, here a SAS URI is used to create a reference to a block blob. The SAS provides the only credentials needed for the request. The block blob reference is then used for a write operation:

```csharp
string sasUri = "https://storagesample.blob.core.windows.net/sample-container/" +
    "sampleBlob.txt?sv=2015-07-08&sr=b&sig=39Up9JzHkxhUIhFEjEH9594DJxe7w6cIRCg0V6lCGSo%3D" +
    "&se=2016-10-18T21%3A51%3A37Z&sp=rcw";

CloudBlockBlob blob = new CloudBlockBlob(new Uri(sasUri));

// Create operation: Upload a blob with the specified name to the container.
// If the blob does not exist, it will be created. If it does exist, it will be overwritten.
try
{
    MemoryStream msWrite = new MemoryStream(Encoding.UTF8.GetBytes(blobContent));
    msWrite.Position = 0;
    using (msWrite)
    {
        await blob.UploadFromStreamAsync(msWrite);
    }

    Console.WriteLine("Create operation succeeded for SAS {0}", sasUri);
    Console.WriteLine();
}
catch (StorageException e)
{
    if (e.RequestInformation.HttpStatusCode == 403)
    {
        Console.WriteLine("Create operation failed for SAS {0}", sasUri);
        Console.WriteLine("Additional error information: " + e.Message);
        Console.WriteLine();
    }
    else
    {
        Console.WriteLine(e.Message);
        Console.ReadLine();
        throw;
    }
}

```

## Best practices when using SAS
When you use shared access signatures in your applications, you need to be aware of two potential risks:

* If a SAS is leaked, it can be used by anyone who obtains it, which can potentially compromise your storage account.
* If a SAS provided to a client application expires and the application is unable to retrieve a new SAS from your service, then the application's functionality may be hindered.

The following recommendations for using shared access signatures can help mitigate these risks:

1. **Always use HTTPS** to create or distribute a SAS. If a SAS is passed over HTTP and intercepted, an attacker performing a man-in-the-middle attack is able to read the SAS and then use it just as the intended user could have, potentially compromising sensitive data or allowing for data corruption by the malicious user.
2. **Reference stored access policies where possible.** Stored access policies give you the option to revoke permissions without having to regenerate the storage account keys. Set the expiration on these very far in the future (or infinite) and make sure it's regularly updated to move it farther into the future.
3. **Use near-term expiration times on an ad hoc SAS.** In this way, even if a SAS is compromised, it's valid only for a short time. This practice is especially important if you cannot reference a stored access policy. Near-term expiration times also limit the amount of data that can be written to a blob by limiting the time available to upload to it.
4. **Have clients automatically renew the SAS if necessary.** Clients should renew the SAS well before the expiration, in order to allow time for retries if the service providing the SAS is unavailable. If your SAS is meant to be used for a small number of immediate, short-lived operations that are expected to be completed within the expiration period, then this may be unnecessary as the SAS is not expected to be renewed. However, if you have client that is routinely making requests via SAS, then the possibility of expiration comes into play. The key consideration is to balance the need for the SAS to be short-lived (as previously stated) with the need to ensure that the client is requesting renewal early enough (to avoid disruption due to the SAS expiring prior to successful renewal).
5. **Be careful with SAS start time.** If you set the start time for a SAS to **now**, then due to clock skew (differences in current time according to different machines), failures may be observed intermittently for the first few minutes. In general, set the start time to be at least 15 minutes in the past. Or, don't set it at all, which will make it valid immediately in all cases. The same generally applies to expiry time as well--remember that you may observe up to 15 minutes of clock skew in either direction on any request. For clients using a REST version prior to 2012-02-12, the maximum duration for a SAS that does not reference a stored access policy is 1 hour, and any policies specifying longer term than that will fail.
6. **Be specific with the resource to be accessed.** A security best practice is to provide a user with the minimum required privileges. If a user only needs read access to a single entity, then grant them read access to that single entity, and not read/write/delete access to all entities. This also helps lessen the damage if a SAS is compromised because the SAS has less power in the hands of an attacker.
7. **Understand that your account will be billed for any usage, including that done with SAS.** If you provide write access to a blob, a user may choose to upload a 200GB blob. If you've given them read access as well, they may choose to download it 10 times, incurring 2 TB in egress costs for you. Again, provide limited permissions to help mitigate the potential actions of malicious users. Use short-lived SAS to reduce this threat (but be mindful of clock skew on the end time).
8. **Validate data written using SAS.** When a client application writes data to your storage account, keep in mind that there can be problems with that data. If your application requires that data be validated or authorized before it is ready to use, you should perform this validation after the data is written and before it is used by your application. This practice also protects against corrupt or malicious data being written to your account, either by a user who properly acquired the SAS, or by a user exploiting a leaked SAS.
9. **Don't always use SAS.** Sometimes the risks associated with a particular operation against your storage account outweigh the benefits of SAS. For such operations, create a middle-tier service that writes to your storage account after performing business rule validation, authentication, and auditing. Also, sometimes it's simpler to manage access in other ways. For example, if you want to make all blobs in a container publically readable, you can make the container Public, rather than providing a SAS to every client for access.
10. **Use Storage Analytics to monitor your application.** You can use logging and metrics to observe any spike in authentication failures due to an outage in your SAS provider service or to the inadvertent removal of a stored access policy. See the [Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/archive/2011/08/03/windows-azure-storage-logging-using-logs-to-track-storage-requests.aspx) for additional information.

## SAS examples
Below are some examples of both types of shared access signatures, account SAS and service SAS.

To run these C# examples, you need to reference the following NuGet packages in your project:

* [Azure Storage Client Library for .NET](http://www.nuget.org/packages/WindowsAzure.Storage), version 6.x or later (to use account SAS).
* [Azure Configuration Manager](http://www.nuget.org/packages/Microsoft.WindowsAzure.ConfigurationManager)

For additional examples that show how to create and test a SAS, see [Azure Code Samples for Storage](https://azure.microsoft.com/documentation/samples/?service=storage).

### Example: Create and use an account SAS
The following code example creates an account SAS that is valid for the Blob and File services, and gives the client permissions read, write, and list permissions to access service-level APIs. The account SAS restricts the protocol to HTTPS, so the request must be made with HTTPS.

```csharp
static string GetAccountSASToken()
{
    // To create the account SAS, you need to use your shared key credentials. Modify for your account.
    const string ConnectionString = "DefaultEndpointsProtocol=https;AccountName=account-name;AccountKey=account-key";
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConnectionString);

    // Create a new access policy for the account.
    SharedAccessAccountPolicy policy = new SharedAccessAccountPolicy()
        {
            Permissions = SharedAccessAccountPermissions.Read | SharedAccessAccountPermissions.Write | SharedAccessAccountPermissions.List,
            Services = SharedAccessAccountServices.Blob | SharedAccessAccountServices.File,
            ResourceTypes = SharedAccessAccountResourceTypes.Service,
            SharedAccessExpiryTime = DateTime.UtcNow.AddHours(24),
            Protocols = SharedAccessProtocol.HttpsOnly
        };

    // Return the SAS token.
    return storageAccount.GetSharedAccessSignature(policy);
}
```

To use the account SAS to access service-level APIs for the Blob service, construct a Blob client object using the SAS and the Blob storage endpoint for your storage account.

```csharp
static void UseAccountSAS(string sasToken)
{
    // Create new storage credentials using the SAS token.
    StorageCredentials accountSAS = new StorageCredentials(sasToken);
    // Use these credentials and the account name to create a Blob service client.
    CloudStorageAccount accountWithSAS = new CloudStorageAccount(accountSAS, "account-name", endpointSuffix: null, useHttps: true);
    CloudBlobClient blobClientWithSAS = accountWithSAS.CreateCloudBlobClient();

    // Now set the service properties for the Blob client created with the SAS.
    blobClientWithSAS.SetServiceProperties(new ServiceProperties()
    {
        HourMetrics = new MetricsProperties()
        {
            MetricsLevel = MetricsLevel.ServiceAndApi,
            RetentionDays = 7,
            Version = "1.0"
        },
        MinuteMetrics = new MetricsProperties()
        {
            MetricsLevel = MetricsLevel.ServiceAndApi,
            RetentionDays = 7,
            Version = "1.0"
        },
        Logging = new LoggingProperties()
        {
            LoggingOperations = LoggingOperations.All,
            RetentionDays = 14,
            Version = "1.0"
        }
    });

    // The permissions granted by the account SAS also permit you to retrieve service properties.
    ServiceProperties serviceProperties = blobClientWithSAS.GetServiceProperties();
    Console.WriteLine(serviceProperties.HourMetrics.MetricsLevel);
    Console.WriteLine(serviceProperties.HourMetrics.RetentionDays);
    Console.WriteLine(serviceProperties.HourMetrics.Version);
}
```

### Example: Create a stored access policy
The following code creates a stored access policy on a container. You can use the access policy to specify constraints for a service SAS on the container or its blobs.

```csharp
private static async Task CreateSharedAccessPolicyAsync(CloudBlobContainer container, string policyName)
{
    // Create a new shared access policy and define its constraints.
    // The access policy provides create, write, read, list, and delete permissions.
    SharedAccessBlobPolicy sharedPolicy = new SharedAccessBlobPolicy()
    {
        // When the start time for the SAS is omitted, the start time is assumed to be the time when the storage service receives the request.
        // Omitting the start time for a SAS that is effective immediately helps to avoid clock skew.
        SharedAccessExpiryTime = DateTime.UtcNow.AddHours(24),
        Permissions = SharedAccessBlobPermissions.Read | SharedAccessBlobPermissions.List |
            SharedAccessBlobPermissions.Write | SharedAccessBlobPermissions.Create | SharedAccessBlobPermissions.Delete
    };

    // Get the container's existing permissions.
    BlobContainerPermissions permissions = await container.GetPermissionsAsync();

    // Add the new policy to the container's permissions, and set the container's permissions.
    permissions.SharedAccessPolicies.Add(policyName, sharedPolicy);
    await container.SetPermissionsAsync(permissions);
}
```

### Example: Create a service SAS on a container
The following code creates a SAS on a container. If the name of an existing stored access policy is provided, that policy is associated with the SAS. If no stored access policy is provided, then the code creates an ad-hoc SAS on the container.

```csharp
private static string GetContainerSasUri(CloudBlobContainer container, string storedPolicyName = null)
{
    string sasContainerToken;

    // If no stored policy is specified, create a new access policy and define its constraints.
    if (storedPolicyName == null)
    {
        // Note that the SharedAccessBlobPolicy class is used both to define the parameters of an ad-hoc SAS, and
        // to construct a shared access policy that is saved to the container's shared access policies.
        SharedAccessBlobPolicy adHocPolicy = new SharedAccessBlobPolicy()
        {
            // When the start time for the SAS is omitted, the start time is assumed to be the time when the storage service receives the request.
            // Omitting the start time for a SAS that is effective immediately helps to avoid clock skew.
            SharedAccessExpiryTime = DateTime.UtcNow.AddHours(24),
            Permissions = SharedAccessBlobPermissions.Write | SharedAccessBlobPermissions.List
        };

        // Generate the shared access signature on the container, setting the constraints directly on the signature.
        sasContainerToken = container.GetSharedAccessSignature(adHocPolicy, null);

        Console.WriteLine("SAS for blob container (ad hoc): {0}", sasContainerToken);
        Console.WriteLine();
    }
    else
    {
        // Generate the shared access signature on the container. In this case, all of the constraints for the
        // shared access signature are specified on the stored access policy, which is provided by name.
        // It is also possible to specify some constraints on an ad-hoc SAS and others on the stored access policy.
        sasContainerToken = container.GetSharedAccessSignature(null, storedPolicyName);

        Console.WriteLine("SAS for blob container (stored access policy): {0}", sasContainerToken);
        Console.WriteLine();
    }

    // Return the URI string for the container, including the SAS token.
    return container.Uri + sasContainerToken;
}
```

### Example: Create a service SAS on a blob
The following code creates a SAS on a blob. If the name of an existing stored access policy is provided, that policy is associated with the SAS. If no stored access policy is provided, then the code creates an ad-hoc SAS on the blob.

```csharp
private static string GetBlobSasUri(CloudBlobContainer container, string blobName, string policyName = null)
{
    string sasBlobToken;

    // Get a reference to a blob within the container.
    // Note that the blob may not exist yet, but a SAS can still be created for it.
    CloudBlockBlob blob = container.GetBlockBlobReference(blobName);

    if (policyName == null)
    {
        // Create a new access policy and define its constraints.
        // Note that the SharedAccessBlobPolicy class is used both to define the parameters of an ad-hoc SAS, and
        // to construct a shared access policy that is saved to the container's shared access policies.
        SharedAccessBlobPolicy adHocSAS = new SharedAccessBlobPolicy()
        {
            // When the start time for the SAS is omitted, the start time is assumed to be the time when the storage service receives the request.
            // Omitting the start time for a SAS that is effective immediately helps to avoid clock skew.
            SharedAccessExpiryTime = DateTime.UtcNow.AddHours(24),
            Permissions = SharedAccessBlobPermissions.Read | SharedAccessBlobPermissions.Write | SharedAccessBlobPermissions.Create
        };

        // Generate the shared access signature on the blob, setting the constraints directly on the signature.
        sasBlobToken = blob.GetSharedAccessSignature(adHocSAS);

        Console.WriteLine("SAS for blob (ad hoc): {0}", sasBlobToken);
        Console.WriteLine();
    }
    else
    {
        // Generate the shared access signature on the blob. In this case, all of the constraints for the
        // shared access signature are specified on the container's stored access policy.
        sasBlobToken = blob.GetSharedAccessSignature(null, policyName);

        Console.WriteLine("SAS for blob (stored access policy): {0}", sasBlobToken);
        Console.WriteLine();
    }

    // Return the URI string for the container, including the SAS token.
    return blob.Uri + sasBlobToken;
}
```

## Conclusion
Shared access signatures are useful for providing limited permissions to your storage account to clients that should not have the account key. As such, they are a vital part of the security model for any application using Azure Storage. If you follow the best practices listed here, you can use SAS to provide greater flexibility of access to resources in your storage account, without compromising the security of your application.

## Next Steps
* [Shared Access Signatures, Part 2: Create and use a SAS with Blob storage](../blobs/storage-dotnet-shared-access-signature-part-2.md)
* [Manage anonymous read access to containers and blobs](../blobs/storage-manage-access-to-resources.md)
* [Delegating Access with a Shared Access Signature](http://msdn.microsoft.com/library/azure/ee395415.aspx)
* [Introducing Table and Queue SAS](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/06/12/introducing-table-sas-shared-access-signature-queue-sas-and-update-to-blob-sas.aspx)
