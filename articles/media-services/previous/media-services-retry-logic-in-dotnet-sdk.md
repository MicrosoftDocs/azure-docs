---
title: Retry logic in the Media Services SDK for .NET | Microsoft Docs
description: The topic gives an overview of retry logic in the Media Services SDK for .NET.
author: Juliako
manager: femila
editor: ''
services: media-services
documentationcenter: ''

ms.assetid: 527b61a6-c862-4bd8-bcbc-b9aea1ffdee3
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/20/2019
ms.author: juliako

---
# Retry logic in the Media Services SDK for .NET  

When working with Microsoft Azure services, transient faults can occur. If a transient fault occurs, in most cases, after a few retries the operation succeeds. The Media Services SDK for .NET implements the retry logic to handle transient faults associated with exceptions and errors that are caused by web requests, executing queries, saving changes, and storage operations.  By default, the Media Services SDK for .NET executes four retries before re-throwing the exception to your application. The code in your application must then handle this exception properly.  

 The following is a brief guideline of Web Request, Storage, Query, and SaveChanges policies:  

* The Storage policy is used for blob storage operations (uploads or download of asset files).  
* The Web Request policy is used for generic web requests (for example, for getting an authentication token and resolving the users cluster endpoint).  
* The Query policy is used for querying entities from REST (for example, mediaContext.Assets.Where(…)).  
* The SaveChanges policy is used for doing anything that changes data within the service (for example, creating an entity updating an entity, calling a service function for an operation).  
  
  This topic lists exception types and error codes that are handled by the Media Services SDK for .NET retry logic.  

## Exception types
The following table describes exceptions that the Media Services SDK for .NET handles or does not handle for some operations that may cause transient faults.  

| Exception | Web Request | Storage | Query | SaveChanges |
| --- | --- | --- | --- | --- |
| WebException<br/>For more information, see the [WebException status codes](media-services-retry-logic-in-dotnet-sdk.md#WebExceptionStatus) section. |Yes |Yes |Yes |Yes |
| DataServiceClientException<br/> For more information, see [HTTP error status codes](media-services-retry-logic-in-dotnet-sdk.md#HTTPStatusCode). |No |Yes |Yes |Yes |
| DataServiceQueryException<br/> For more information, see [HTTP error status codes](media-services-retry-logic-in-dotnet-sdk.md#HTTPStatusCode). |No |Yes |Yes |Yes |
| DataServiceRequestException<br/> For more information, see [HTTP error status codes](media-services-retry-logic-in-dotnet-sdk.md#HTTPStatusCode). |No |Yes |Yes |Yes |
| DataServiceTransportException |No |No |Yes |Yes |
| TimeoutException |Yes |Yes |Yes |No |
| SocketException |Yes |Yes |Yes |Yes |
| StorageException |No |Yes |No |No |
| IOException |No |Yes |No |No |

### <a name="WebExceptionStatus"></a> WebException status codes
The following table shows for which WebException error codes the retry logic is implemented. The [WebExceptionStatus](https://msdn.microsoft.com/library/system.net.webexceptionstatus.aspx) enumeration defines the status codes.  

| Status | Web Request | Storage | Query | SaveChanges |
| --- | --- | --- | --- | --- |
| ConnectFailure |Yes |Yes |Yes |Yes |
| NameResolutionFailure |Yes |Yes |Yes |Yes |
| ProxyNameResolutionFailure |Yes |Yes |Yes |Yes |
| SendFailure |Yes |Yes |Yes |Yes |
| PipelineFailure |Yes |Yes |Yes |No |
| ConnectionClosed |Yes |Yes |Yes |No |
| KeepAliveFailure |Yes |Yes |Yes |No |
| UnknownError |Yes |Yes |Yes |No |
| ReceiveFailure |Yes |Yes |Yes |No |
| RequestCanceled |Yes |Yes |Yes |No |
| Timeout |Yes |Yes |Yes |No |
| ProtocolError <br/>The retry on ProtocolError is controlled by the HTTP status code handling. For more information, see [HTTP error status codes](media-services-retry-logic-in-dotnet-sdk.md#HTTPStatusCode). |Yes |Yes |Yes |Yes |

### <a name="HTTPStatusCode"></a> HTTP error status codes
When Query and SaveChanges operations throw DataServiceClientException, DataServiceQueryException, or DataServiceQueryException, the HTTP error status code is returned in the StatusCode property.  The following table shows for which error codes the retry logic is implemented.  

| Status | Web Request | Storage | Query | SaveChanges |
| --- | --- | --- | --- | --- |
| 401 |No |Yes |No |No |
| 403 |No |Yes<br/>Handling retries with longer waits. |No |No |
| 408 |Yes |Yes |Yes |Yes |
| 429 |Yes |Yes |Yes |Yes |
| 500 |Yes |Yes |Yes |No |
| 502 |Yes |Yes |Yes |No |
| 503 |Yes |Yes |Yes |Yes |
| 504 |Yes |Yes |Yes |No |

If you want to take a look at the actual implementation of the Media Services SDK for .NET retry logic, see [azure-sdk-for-media-services](https://github.com/Azure/azure-sdk-for-media-services/tree/dev/src/net/Client/TransientFaultHandling).

## Next steps
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

