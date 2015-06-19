<properties 
 pageTitle="Scheduler Limits, Defaults, and Error Codes" 
 description="" 
 services="scheduler" 
 documentationCenter=".NET" 
 authors="krisragh" 
 manager="dwrede" 
 editor=""/>
<tags 
 ms.service="scheduler" 
 ms.workload="infrastructure-services" 
 ms.tgt_pltfrm="na" 
 ms.devlang="dotnet" 
 ms.topic="article" 
 ms.date="04/22/2015" 
 ms.author="krisragh"/>
 
# Scheduler Limits, Defaults, and Error Codes

## Scheduler Quotas, Limits, Defaults, and Throttles

The following table describes each of the major quotas, limits, defaults, and throttles in Azure Scheduler.

|Resource|Limit Description|
|---|---|
|**Job size**|The maximum job size is 16K. If a PUT or a PATCH results in a job larger than these limits, a 400 Bad Request status code is returned.|
|**Request URL size**|Maximum size of the request URL is 2048 chars.|
|**Aggregate header size**|Maximum aggregate header size is 4096 chars.|
|**Header count**|Maximum header count is 50 headers.|
|**Body size**|Maximum body size is 8192 chars.|
|**Recurrence span**|Maximum recurrence span is 18 months.|
|**Time to start time**|Maximum “time to start time” is 18 months.|
|**Job history**|Maximum response body stored in job history is 2048 bytes.|
|**Frequency**|The default max frequency quota is 1 hour in a free job collection and 1 minute in a standard job collection. The max frequency is configurable on a job collection to be lower than the maximum. All jobs in the job collection are limited the value set on the job collection. If you attempt to create a job with a higher frequency than the maximum frequency on the job collection then request will fail with a 409 Conflict status code.|
|**Jobs**|The default max jobs quota is 5 jobs in a free job collection and 50 jobs in a standard job collection. The maximum number of jobs is configurable on a job collection. All jobs in the job collection are limited the value set on the job collection. If you attempt to create more jobs than the maximum jobs quota, then the request fails with a 409 Conflict status code.|
|**Job history retention**|Job history is retained for up to 2 months.|
|**Completed and faulted job retention**|Completed and faulted jobs are retailed for 60 days.|
|**Timeout**|There’s a static (not configurable) request timeout of 30 seconds for HTTP actions. For longer running operations, follow HTTP asynchronous protocols; for example, return a 202 immediately but continue working in the background.|

## The x-ms-request-id Header

Every request made against the Scheduler service returns a response header named**x-ms-request-id**. This header contains an opaque value that uniquely identifies the request.

If a request is consistently failing and you have verified that the request is properly formulated, you may use this value to report the error to Microsoft. In your report, include the value ofx-ms-request-id, the approximate time that the request was made, the identifier of the subscription, cloud service, job collection, and/or job, and the type of operation that the request attempted.

## Scheduler Status and Error Codes

In addition to standard HTTP status codes, the Azure Scheduler REST API returns extended error codes and error messages. The extended codes do not replace the standard HTTP status codes, but provide additional, actionable information that can be used in conjunction with the standard HTTP status codes. 

For example, an HTTP 404 error can occur for numerous reasons, so having the additional information in the extended message can assist with problem resolution. For more information on the standard HTTP codes returned by the REST API, see [Service Management Status and Error Codes](https://msdn.microsoft.com/library/windowsazure/ee460801.aspx). REST API operations for the Service Management API return standard HTTP status codes, as defined in the[HTTP/1.1 Status Code Definitions](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html). The following table describes common errors that may be returned by the service.

|Error code|HTTP status code|User message|
|----|----|----|
|MissingOrIncorrectVersionHeader|Bad Request (400)|The versioning header is not specified or was specified incorrectly.|
|InvalidXmlRequest|Bad Request (400)|The request body’s XML was invalid or not correctly specified.|
|MissingOrInvalidRequiredQueryParameter|Bad Request (400)|A required query parameter was not specified for this request or was specified incorrectly.|
|InvalidHttpVerb|Bad Request (400)|The HTTP verb specified was not recognized by the server or isn’t valid for this resource.|
|AuthenticationFailed|Forbidden (403)|The server failed to authenticate the request. Verify that the certificate is valid and is associated with this subscription.|
|ResourceNotFound|Not Found (404)|The specified resource does not exist.|
|InternalError|Internal Server Error (500)|The server encountered an internal error. Please retry the request.|
|OperationTimedOut|Internal Server Error (500)|The operation could not be completed within the permitted time.|
|ServerBusy|Service Unavailable (503)|The server (or an internal component) is currently unavailable to receive requests. Please retry your request.|
|SubscriptionDisabled|Forbidden (403)|The subscription is in a disabled state.|
|BadRequest|Bad Request (400)|A parameter was incorrect.|
|ConflictError|Conflict (409)|A conflict occurred to prevent the operation from completing.|
|TemporaryRedirect|Temporary Redirect (307)|The requested object is not available. A temporary URI for the new location of the object can be obtained from the Location field in the response. The original request can be repeated on the new URI.|

API operations may also return additional error information that is defined by the management service. This additional error information is returned in the response body. The body of the error response follows the basic format shown below.

		<?xml version="1.0" encoding="utf-8"?>  
		<Error>  
			<Code>string-code</Code>  
			<Message>detailed-error-message</Message>  
		</Error>  

## See Also

 [Scheduler Concepts, Terminology, and Entity Hierarchy](scheduler-concepts-terms.md)
 
 [Get Started Using Scheduler in the Management Portal](scheduler-get-started-portal.md)
 
 [Plans and Billing in Azure Scheduler](scheduler-plans-billing.md)
 
 [How to Build Complex Schedules and Advanced Recurrence with Azure Scheduler](scheduler-advanced-complexity.md)
 
 [Scheduler REST API Reference](https://msdn.microsoft.com/library/dn528946)   
 
 [Scheduler High-Availability and Reliability](scheduler-high-availability-reliability.md)
 
 [Scheduler Outbound Authentication](scheduler-outbound-authentication.md)

 