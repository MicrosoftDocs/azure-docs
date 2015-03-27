<properties 
	pageTitle="Shared access signatures: Understanding the SAS Model | Microsoft Azure" 
	description="Learn about delegating access to blob, queue, and table resources with shared access signatures" 
	services="storage" 
	documentationCenter="" 
	authors="tamram" 
	manager="adinah" 
	editor=""/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="03/06/2015" 
	ms.author="tamram"/>



# Shared Access Signatures, Part 1: Understanding the SAS Model

## Overview

Using a shared access signature (SAS) is a powerful way to grant limited access to blobs, tables, and queues in your storage account to other clients, without having to expose your account key. In Part 1 of this tutorial on shared access signatures, we'll provide an overview of the SAS model and review SAS best practices. [Part 2](storage-dotnet-shared-access-signature-part-2.md) of the tutorial walks you through the process of creating shared access signatures with the Blob service.

## What Is a Shared Access Signature? ##

A shared access signature provides delegated access to resources in your storage account. This means that you can grant a client limited permissions to your blobs, queues, or tables for a specified period of time and with a specified set of permissions, without having to share your account access keys. The SAS is a URI that encompasses in its query parameters all of the information necessary for authenticated access to a storage resource. To access storage resources with the SAS, the client only needs to pass in the SAS to the appropriate constructor or method.

## When Should You Use a Shared Access Signature? ##

You can use a SAS when you want to provide access to resources in your storage account to a client that can't be trusted with the account key. Your storage account keys include both a primary and secondary key, both of which grant administrative access to your account and all of the resources in it. Exposing either of your account keys opens your account to the possibility of malicious or negligent use. Shared access signatures provide a safe alternative that allows other clients to read, write, and delete data in your storage account according to the permissions you've granted, and without need for the account key.

A common scenario where a SAS is useful is a service where users read and write their own data to your storage account. In a scenario where a storage account stores user data, there are two typical design patterns:


1\. Clients upload and download data via a front-end proxy service, which performs authentication. This front-end proxy service has the advantage of allowing validation of business rules, but for large amounts of data or high-volume transactions, creating a service that can scale to match demand may be expensive or difficult.

![sas-storage-fe-proxy-service][sas-storage-fe-proxy-service]

2\.	A lightweight service authenticates the client as needed and then generates a SAS. Once the client receives the SAS, they can access storage account resources directly with the permissions defined by the SAS and for the interval allowed by the SAS. The SAS mitigates the need for routing all data through the front-end proxy service.

![sas-storage-provider-service][sas-storage-provider-service]

Many real-world services may use a hybrid of these two approaches, depending on the scenario involved, with some data processed and validated via the front-end proxy while other data is saved and/or read directly using SAS.

## How a Shared Access Signature Works ##

A shared access signature is a URI that points to a storage resource and includes a special set of query parameters that indicate how the resource may be accessed by the client. One of these parameters, the signature, is constructed from the SAS parameters and signed with the account key. This signature is used by Azure Storage to authenticate the SAS.

A shared access signature has the following constraints that define it, each of which is represented as a parameter on the URI:

- **The storage resource.** Storage resources for which you can delegate access include containers, blobs, queues, tables, and ranges of table entities.
- **Start time.** This is the time at which the SAS becomes valid. The start time for a shared access signature is optional; if omitted, the SAS is effective immediately. 
- **Expiry time.** This is the time after which the SAS is no longer valid. Best practices recommend that you either specify an expiry time for a SAS, or associate it with a stored access policy (see more below).
- **Permissions.** The permissions specified on the SAS indicate what operations the client can perform against the storage resource using the SAS. 

Here is an example of a SAS URI that provides read and write permissions to a blob. The table breaks down each part of the URI to understand how it contributes to the SAS:

https://myaccount.blob.core.windows.net/sascontainer/sasblob.txt?sv=2012-02-12&st=2013-04-29T22%3A18%3A26Z&se=2013-04-30T02%3A23%3A26Z&sr=b&sp=rw&sig=Z%2FRHIX5Xcg0Mq2rqI3OlWTjEg2tYkboXr1P9ZUXDtkk%3D

<table border="1" cellpadding="0" cellspacing="0">
    <tbody>
        <tr>
            <td valign="top" width="213">
                <p>
                    Blob URI
                </p>
            </td>
            <td valign="top" width="213">
                <p>
                    https://myaccount.blob.core.windows.net/sascontainer/sasblob.txt
                </p>
            </td>
            <td valign="top" width="213">
                <p>
                    The address of the blob. Note that using HTTPS is highly recommended.
                </p>
            </td>
        </tr>
        <tr>
            <td valign="top" width="213">
                <p>
                    Storage services version
                </p>
            </td>
            <td valign="top" width="213">
                <p>
                    sv=2012-02-12
                </p>
            </td>
            <td valign="top" width="213">
                <p>
                    For storage services version 2012-02-12 and later, this parameter indicates the version to use.
                </p>
            </td>
        </tr>
        <tr>
            <td valign="top" width="213">
                <p>
                    Start time
                </p>
            </td>
            <td valign="top" width="213">
                <p>
                    st=2013-04-29T22%3A18%3A26Z
                </p>
            </td>
            <td valign="top" width="213">
                <p>
                    Specified in an ISO 8061 format. If you want the SAS to be valid immediately, omit the start time.
                </p>
            </td>
        </tr>
        <tr>
            <td valign="top" width="213">
                <p>
                    Expiry time
                </p>
            </td>
            <td valign="top" width="213">
                <p>
                    se=2013-04-30T02%3A23%3A26Z
                </p>
            </td>
            <td valign="top" width="213">
                <p>
                    Specified in an ISO 8061 format.
                </p>
            </td>
        </tr>
        <tr>
            <td valign="top" width="213">
                <p>
                    Resource
                </p>
            </td>
            <td valign="top" width="213">
                <p>
                    sr=b
                </p>
            </td>
            <td valign="top" width="213">
                <p>
                    The resource is a blob.
                </p>
            </td>
        </tr>
        <tr>
            <td valign="top" width="213">
                <p>
                    Permissions
                </p>
            </td>
            <td valign="top" width="213">
                <p>
                    sp=rw
                </p>
            </td>
            <td valign="top" width="213">
                <p>
                    The permissions granted by the SAS include Read (r) and Write (w).
                </p>
            </td>
        </tr>
        <tr>
            <td valign="top" width="213">
                <p>
                    Signature
                </p>
            </td>
            <td valign="top" width="213">
                <p>
                    sig=Z%2FRHIX5Xcg0Mq2rqI3OlWTjEg2tYkboXr1P9ZUXDtkk%3D
                </p>
            </td>
            <td valign="top" width="213">
                <p>
                    Used to authenticate access to the blob. The signature is an HMAC computed over a string-to-sign and key using the SHA256 algorithm, and
                    then encoded using Base64 encoding.
                </p>
            </td>
        </tr>
    </tbody>
</table>


## Controlling Shared Access Signatures with a Stored Access Policy ##

A shared access signature can take one of two forms:

- **Ad hoc SAS:** When you create an ad hoc SAS, the start time, expiry time, and permissions for the SAS are all specified on the SAS URI (or implied, in the case where start time is omitted). This type of SAS may be created on a container, blob, table, or queue.
- **SAS with stored access policy:** A stored access policy is defined on a resource container - a blob container, table, or queue - and can be used to manage constraints for one or more shared access signatures. When you associate a SAS with a stored access policy, the SAS inherits the constraints - the start time, expiry time, and permissions - defined for the stored access policy.

The difference between the two forms is important for one key scenario: revocation. A SAS is a URL, so anyone who obtains the SAS can use it, regardless of who requested it to begin with. If a SAS is published publically, it can be used by anyone in the world. A SAS that is distributed is valid until one of four things happens:

1.	The expiry time specified on the SAS is reached.
2.	The expiry time specified on the stored access policy referenced by the SAS is reached (if a stored access policy is referenced, and if it specifies an expiry time). This can either occur because the interval elapses, or because you have modified the stored access policy to have an expiry time in the past, which is one way to revoke the SAS.
3.	The stored access policy referenced by the SAS is deleted, which is another way to revoke the SAS. Note that if you recreate the stored access policy with exactly the same name, all existing SAS tokens will again be valid according to the permissions associated with that stored access policy (assuming that the expiry time on the SAS has not passed). If you are intending to revoke the SAS, be sure to use a different name if you recreate the access policy with an expiry time in the future.
4.	The account key that was used to create the SAS is regenerated.  Note that doing this will cause all application components using that account key to fail to authenticate until they are updated to use either the other valid account key or the newly regenerated account key.
 
## Best Practices for Using Shared Access Signatures ##

When you use shared access signatures in your applications, you need to be aware of two potential risks:

- If a SAS is leaked, it can be used by anyone who obtains it, which can potentially compromise your storage account.
- If a SAS provided to a client application expires and the application is unable to retrieve a new SAS from your service, then the application's functionality may be hindered.  

The following recommendations for using shared access signatures will help balance these risks:

1. **Always use HTTPS** to create a SAS or to distribute a SAS.  If a SAS is passed over HTTP and intercepted, an attacker performing a man-in-the-middle attack will be able to read the SAS and then use it just as the intended user could have, potentially compromising sensitive data or allowing for data corruption by the malicious user.
2. **Reference stored access policies where possible.** Stored access policies give you the option to revoke permissions without having to regenerate the storage account keys.  Set the expiration on these to be a very long time (or infinite)  and make sure that it is regularly updated to move it farther into the future.
3. **Use near-term expiration times on an ad hoc SAS.** In this way, even if a SAS is compromised unknowingly, it will only be viable for a short time duration. This practice is especially important if you cannot reference a stored access policy. This practice also helps limit the amount of data that can be written to a blob by limiting the time available to upload to it.
4. **Have clients automatically renew the SAS if necessary.** Clients should renew the SAS well before the expected expiration, in order to allow time for retries if the service providing the SAS is unavailable.  If your SAS is meant to be used for a small number of immediate, short-lived operations, which are expected to be completed within the expiration time given, then this may not be necessary, as the SAS is not expected be renewed.  However, if you have client that is routinely making requests via SAS, then the possibility of expiration comes into play.  The key consideration is to balance the need for the SAS to be short-lived (as stated above) with the need to ensure that the client is requesting renewal early enough to avoid disruption due to the SAS expiring prior to successful renewal.
5. **Be careful with SAS start time.** If you set the start time for a SAS to **now**, then due to clock skew (differences in current time according to different machines), failures may be observed intermittently for the first few minutes.  In general, set the start time to be at least 15 minutes ago, or don't set it at all, which will make it valid immediately in all cases.  The same generally applies to expiry time as well - remember that you may observe up to 15 minutes of clock skew in either direction on any request.  Note for clients using a REST version prior to 2012-02-12, the maximum duration for a SAS that does not reference a stored access policy is 1 hour, and any policies specifying longer term than that will fail.
6.	**Be specific with the resource to be accessed.** A typical security best practice is to provide a user with the minimum required privileges.  If a user only needs read access to a single entity, then grant them read access to that single entity, and not read/write/delete access to all entities.  This also helps mitigate the threat of the SAS being compromised, as the SAS has less power in the hands of an attacker.
7.	**Understand that your account will be billed for any usage, including that done with SAS.** If you provide write access to a blob, a user may choose to upload a 200GB blob.  If you've given them read access as well, they may choose do download it 10 times, incurring 2TB in egress costs for you.  Again, provide limited permissions, to help mitigate the potential of malicious users.  Use short-lived SAS to reduce this threat (but be mindful of clock skew on the end time).
8.	**Validate data written using SAS.** When a client application writes data to your storage account, keep in mind that there can be problems with that data. If your application requires that that data be validated or authorized before it is ready to use, you should perform this validation after the data is written and before it is used by your application. This practice also protects against corrupt or malicious data being written to your account, either by a user who properly acquired the SAS, or by a user exploiting a leaked SAS.
9. **Don't always use SAS.** Sometimes the risks associated with a particular operation against your storage account outweigh the benefits of SAS.  For such operations, create a middle-tier service that writes to your storage account after performing business rule validation, authentication, and auditing. Also, sometimes it's simpler to manage access in other ways. For example, if you want to make all blobs in a container publically readable, you can make the container Public, rather than providing a SAS to every client for access.
10.	**Use Storage Analytics to monitor your application.** You can use logging and metrics to observe any spike in authentication failures due to an outage in your SAS provider service or or to the inadvertent removal of a stored access policy. See the [Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/archive/2011/08/03/windows-azure-storage-logging-using-logs-to-track-storage-requests.aspx) for additional information.

## Conclusion ##

Shared access signatures are useful for providing limited permissions to your storage account to clients that should not have the account key.  As such, they are a vital part of the security model for any application using Azure Storage.  If you follow the best practices listed here, you can use SAS to provide greater flexibility of access to resources in your storage account, without compromising the security of your application.

## Next Steps ##

[Shared Access Signatures, Part 2: Create and Use a SAS with the Blob Service](../storage-dotnet-shared-access-signature-part-2/)

[Manage Access to Azure Storage Resources](http://msdn.microsoft.com/library/azure/ee393343.aspx)

[Delegating Access with a Shared Access Signature (REST API)](http://msdn.microsoft.com/library/azure/ee395415.aspx)

[Introducing Table and Queue SAS](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/06/12/introducing-table-sas-shared-access-signature-queue-sas-and-update-to-blob-sas.aspx)
[sas-storage-fe-proxy-service]: ./media/storage-dotnet-shared-access-signature-part-1/sas-storage-fe-proxy-service.png
[sas-storage-provider-service]: ./media/storage-dotnet-shared-access-signature-part-1/sas-storage-provider-service.png


