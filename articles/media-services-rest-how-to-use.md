<properties 
	pageTitle="Media Services REST API overview - Azure" 
	description="Media Services REST API overview" 
	services="media-services" 
	documentationCenter="" 
	authors="Juliako" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="02/02/2015" 
	ms.author="juliako"/>


# Media Services REST API overview 

Microsoft Azure Media Services is a service that accepts OData-based HTTP requests and can respond back in verbose JSON or atom+pub. Because Media Services conforms to Azure design guidelines, there is a set of required HTTP headers that each client must use when connecting to Media Services, as well as a set of optional headers that can be used. The following sections describe the headers and HTTP verbs you can use when creating requests and receiving responses from Media Services.


## Standard HTTP request headers supported by Media Services

For every call you make into Media Services, there is a set of required headers you must include in your request and also a set of optional headers you may want to include. The following table lists the required headers:


<table border="1">
<tr><th>Header</th><th>Type</th><th>Value</th></tr>
<tr><td>Authorization</td><td>Bearer</td><td>Bearer is the only accepted authorization mechanism. The value must also include the access token provided by ACS.</td></tr>
<tr><td>x-ms-version</td><td>Decimal</td><td>2.9</td></tr>
<tr><td>DataServiceVersion</td><td>Decimal</td><td>3.0</td></tr>
<tr><td>MaxDataServiceVersion</td><td>Decimal</td><td>3.0</td></tr>
</table><br/>


>[AZURE.NOTE] Because Media Services uses OData to expose its underlying asset metadata repository through REST APIs, the DataServiceVersion and MaxDataServiceVersion headers should be included in any request; however, if they are not, then currently Media Services assumes the DataServiceVersion value in use is 3.0.

The following is a set of optional headers:

<table border="1">
<tr><th>Header</th><th>Type</th><th>Value</th></tr>
<tr><td>Date</td><td>RFC 1123 date</td><td>Timestamp of the request</td></tr>
<tr><td>Accept</td><td>Content type</td><td>The requested content type for the response such as the following:
<ul><li>application/json;odata=verbose</li><li>application/atom+xml</li></ul></br> Responses may have a different content type, such as a blob fetch, where a successful response will contain the blob stream as the payload.</td></tr>
<tr><td>Accept-Encoding</td><td>Gzip, deflate</td><td>GZIP and DEFLATE encoding, when applicable. Note: For large resources, Media Services may ignore this header and return noncompressed data.
</td></tr>
<tr><td>Accept-Language</td><td>"en", "es", and so on.</td><td>Specifies the preferred language for the response.</td></tr>
<tr><td>Accept-Charset</td><td>Charset type like “UTF-8”</td><td>Default is UTF-8.</td></tr>
<tr><td>X-HTTP-Method</td><td>HTTP Method</td><td>Allows clients or firewalls that do not support HTTP methods like PUT or DELETE to use these methods, tunneled via a GET call.</td></tr>
<tr><td>Content-Type</td><td>Content type</td><td>Content type of the request body in PUT or POST requests.</td></tr>
<tr><td>client-request-id</td><td>String</td><td>A caller-defined value that identifies the given request. If specified, this value will be included in the response message as a way to map the request. <br/><br/>
<b>Important</b><br/>
Values should be capped at 2096b (2k).</td></tr>
</table><br/>


## Standard HTTP response headers supported by Media Services

The following is a set of headers that may be returned to you depending on the resource you were requesting and the action you intended to perform.


<table border="1">
<tr><th>Header</th><th>Type</th><th>Value</th></tr>
<tr><td>request-id</td><td>String</td><td>A unique identifier for the current operation, service generated.</td></tr>
<tr><td>client-request-id</td><td>String</td><td>An identifier specified by the caller in the original request, if present.</td></tr>
<tr><td>Date</td><td>RFC 1123 date</td><td>The date that the request was processed.</td></tr>
<tr><td>Content-Type</td><td>Varies</td><td>The content type of the response body.</td></tr>
<tr><td>Content-Encoding</td><td>Varies</td><td>Gzip or deflate, as appropriate.</td></tr>
</table><br/>

## Standard HTTP verbs supported by Media Services

The following is a complete list of HTTP verbs that can be used when making HTTP requests:


<table border="1">
<tr><th>Verb</th><th>Description</th></tr>
<tr><td>GET</td><td>Returns the current value of an object.</td></tr>
<tr><td>POST</td><td>Creates an object based on the data provided, or submits a command.</td></tr>
<tr><td>PUT</td><td>Replaces an object, or creates a named object (when applicable).</td></tr>
<tr><td>DELETE</td><td>Deletes an object.</td></tr>
<tr><td>MERGE</td><td>Updates an existing object with named property changes.</td></tr>
<tr><td>HEAD</td><td>Returns metadata of an object for a GET response.</td></tr>
</table><br/>

## Discovering Media Services model

To make Media Services entities more discoverable, the $metadata operation can be used. It allows you to retrieve all valid entity types, entity properties, associations, functions, actions, and so on. The following example shows how to construct the URI: https://media.windows.net/API/$metadata.

You should append "?api-version=2.x" to the end of the URI if you want to view the metadata in a browser, or do not include the x-ms-version header in your request.


<!-- Anchors. -->


<!-- URLs. -->
  
  [Management Portal]: http://manage.windowsazure.com/



