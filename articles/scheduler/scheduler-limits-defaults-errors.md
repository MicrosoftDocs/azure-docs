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
 ms.date="07/28/2015"
 ms.author="krisragh"/>

# Scheduler Limits, Defaults, and Error Codes

## Scheduler Quotas, Limits, Defaults, and Throttles

[AZURE.INCLUDE [scheduler-limits-table](../../includes/scheduler-limits-table.md)]

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
