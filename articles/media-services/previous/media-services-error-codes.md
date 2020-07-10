---
title: Azure Media Services error codes | Microsoft Docs
description: You may receive HTTP error codes from the service depending on issues such as authentication tokens expiring to actions that are not supported in Media Services. This article gives an overview of Azure Media Services v2 API error codes.
author: Juliako
manager: femila
editor: ''
services: media-services
documentationcenter: ''

ms.assetid: d3a62a64-7608-4b17-8667-479b26ba0d6c
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/18/2019
ms.author: juliako

---
# Azure Media Services error codes
When using Microsoft Azure Media Services, you may receive HTTP error codes from the service depending on issues such as authentication tokens expiring to actions that are not supported in Media Services. The following is a list of **HTTP error codes** that may be returned by Media Services and the possible causes for them.  

## 400 Bad Request
The request contains invalid information and is rejected due to one of the following reasons:

* An unsupported API version is specified. For the most current version, see [Setup for Media Services REST API Development](media-services-rest-how-to-use.md).
* The API version of Media Services is not specified. For information on how to specify the API version, see [Media Services Operations REST API Reference](https://docs.microsoft.com/rest/api/media/operations/azure-media-services-rest-api-reference).
  
  > [!NOTE]
  > If you are using the .NET or Java SDKs to connect to Media Services, the API version is specified for you whenever you try and perform some action against Media Services.
  > 
  > 
* An undefined property has been specified. The property name is in the error message. Only those properties that are members of a given entity can be specified. See [Azure Media Services REST API Reference](https://docs.microsoft.com/rest/api/media/operations/azure-media-services-rest-api-reference) for a list of entities and their properties.
* An invalid property value has been specified. The property name is in the error message. See the previous link for valid property types and their values.
* A property value is missing and is required.
* Part of the URL specified contains a bad value.
* An attempt was made to update a WriteOnce property.
* An attempt was made to create a Job that has an input Asset with a primary AssetFile that was not specified or could not be determined.
* An attempt was made to update a SAS Locator. SAS locators can only be created or deleted. Streaming locators can be updated. For more information, see [Locators](https://docs.microsoft.com/rest/api/media/operations/locator).
* An unsupported operation or query was submitted.

## 401 Unauthorized
The request could not be authenticated (before it can be authorized) due to one of the following reasons:

* Missing authentication header.
* Bad authentication header value.
  * The token has expired. 
  * The token contains an invalid signature.

## 403 Forbidden
The request is not allowed due to one of the following reasons:

* The Media Services account cannot be found or has been deleted.
* The Media Services account is disabled and the request type is not HTTP GET. Service operations will return a 403 response as well.
* The authentication token does not contain the user’s credential information: AccountName and/or SubscriptionId. You can find this information in the Media Services UI extension for your Media Services account in the Azure Management Portal.
* The resource cannot be accessed.
  
  * An attempt was made to use a MediaProcessor that is not available for your Media Services account.
  * An attempt was made to update a JobTemplate defined by Media Services.
  * An attempt was made to overwrite some other Media Services account's Locator.
  * An attempt was made to overwrite some other Media Services account's ContentKey.
* The resource could not be created due to a service quota that was reached for the Media Services account. For more information on the service quotas, see [Quotas and Limitations](media-services-quotas-and-limitations.md).

## 404 Not Found
The request is not allowed on a resource due to one of the following reasons:

* An attempt was made to update an entity that does not exist.
* An attempt was made to delete an entity that does not exist.
* An attempt was made to create an entity that links to an entity that does not exist.
* An attempt was made to GET an entity that does not exist.
* An attempt was made to specify a storage account that is not associated with the Media Services account.  

## 409 Conflict
The request is not allowed due to one of the following reasons:

* More than one AssetFile has the specified name within the Asset.
* An attempt was made to create a second primary AssetFile within the Asset.
* An attempt was made to create a ContentKey with the specified Id already used.
* An attempt was made to create a Locator with the specified Id already used.
* More than one IngestManifestFile has the specified name within the IngestManifest.
* An attempt was made to link a second storage encryption ContentKey to the storage-encrypted Asset.
* An attempt was made to link the same ContentKey to the Asset.
* An attempt was made to create a locator to an Asset whose storage container is missing or is no longer associated with the Asset.
* An attempt was made to create a locator to an Asset which already has 5 locators in use. (Azure Storage enforces the limit of five shared access policies on one storage container.)
* Linking storage account of an Asset to an IngestManifestAsset is not the same as the storage account used by the parent IngestManifest.  

## 500 Internal Server Error
During the processing of the request, Media Services encounters some error that prevents the processing from continuing. This could be due to one of the following reasons:

* Creating an Asset or Job fails because the Media Services account's service quota information is temporarily unavailable.
* Creating an Asset or IngestManifest blob storage container fails because the account's storage account information is temporarily unavailable.
* Other unexpected error.

## 503 Service Unavailable
The server is currently unable to receive requests. This error may be caused by excessive requests to the service. Media Services throttling mechanism restricts the resource usage for applications that make excessive request to the service.

> [!NOTE]
> Check the error message and error code string to get more detailed information about the reason you got the 503 error. This error does not always mean throttling.
> 
> 

Possible status descriptions are:

* "Server is busy. Previous runs of this type of request took more than {0} seconds."
* "Server is busy. More than {0} requests per second can be throttled."
* "Server is busy. More than {0} requests within {1} seconds can be throttled."

To handle this error, we recommend using exponential back-off retry logic. That means using progressively longer waits between retries for consecutive error responses.  For more information, see [Transient Fault Handling Application Block](https://msdn.microsoft.com/library/hh680905.aspx).

> [!NOTE]
> If you are using [Azure Media Services SDK for .Net](https://github.com/Azure/azure-sdk-for-media-services/tree/master), the retry logic for the 503 error has been implemented by the SDK.  
> 
> 

## See Also
[Media Services Management Error Codes](https://msdn.microsoft.com/library/windowsazure/dn167016.aspx)

## Next steps
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

