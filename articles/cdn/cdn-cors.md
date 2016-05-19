<properties
	pageTitle="Using Azure CDN with CORS"
	description="Learn how to use the Azure Content Delivery Network (CDN) to with Cross-Origin Resource Sharing (CORS)."
	services="cdn"
	documentationCenter=".net"
	authors="camsoper"
	manager="erikre"
	editor=""/>

<tags
	ms.service="cdn"
	ms.workload="tbd"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/18/2016"
	ms.author="casoper"/>
    
# Using Azure CDN with CORS     

## What is CORS?

CORS (Cross Origin Resource Sharing) is an HTTP feature that enables a web application running under one domain to access resources in another domain. In order to reduce the possibility of cross-site scripting attacks, all modern web browsers implement a security restriction known as [same-origin policy](http://www.w3.org/Security/wiki/Same_Origin_Policy).  This prevents a web page from calling APIs in a different domain.  CORS provides a secure way to allow one domain (the origin domain) to call APIs in another domain.
 
## How it works
1.	The browser sends the OPTIONS request with an Origin HTTP header. The value of this header is the domain that served the parent page. When a page from https://www.contoso.com attempts to access a user's data in the fabrikam.com domain, the following request header would be sent to fabrikam.com: 
    
    `Origin: https://www.contoso.com`
 
2.	The server may respond with the following:
    - An Access-Control-Allow-Origin (ACAO) header in its response indicating which origin sites are allowed. For example:
        
        `Access-Control-Allow-Origin: http://www.foo.com`
        
    - An error page if the server does not allow the cross-origin request
    - An Access-Control-Allow-Origin (ACAO) header with a wildcard that allows all domains:
        
        `Access-Control-Allow-Origin: *`
 
For complex HTTP requests, there's a "preflight" request done first to determine whether it has permission before sending the entire request.
 
## CDN support with CORS

Wildcard or Single Origin Scenario
CORS on Azure CDN will work out of the box for case where wildcard is set for the Access-Control-Allow-Origin header or just a single origin is allowed, and no special configuration is needed. This is because the CDN will cache the first response, and subsequent requests will use the same header.
 
If requests have already been made to the CDN prior to CORS being set on the customer's origin, customers in most cases will need to purge content as content that is currently cached on the CDN wouldn’t have the associated Access-Control-Allow-Origin header set for it.
 
To set CORS on Azure Storage, see below:
"Cloud Portam is a tool that can be used to set CORS rule on a storage account or blob" http://gauravmantri.com/2014/08/08/announcing-the-launch-of-cloud-portam-a-browser-based-azure-storage-explorer/
 
Multi Origin Scenario
For cases where customer needs to allow a specific list of origins to be allowed for CORS on the origin, additional setup is required.
 
The problem occurs when the CDN caches the  Access-Control-Allow-Origin header for 'origin A'. When 'origin B' makes a subsequent request, it will check against the existing header on the edge which doesn't match and return an error.
 
 
CDN Premium with Verizon
The optimal way to enable this is with Azure CDN is to use CDN Premium with Verizon, which exposes some advanced functionality. 
 
From here one can setup a rule to check  the origin header on the request and set the the Access-Control-Allow-Origin header with the origin as a valid origin if it matches the acceptable list. If the Origin header is not in the list, then do not have the CDN include the Access-Control-Allow-Origin header which will cause the browser to reject the request. 
 
There are a couple of ways to do this with the rules engine.
o	One regex with all origins
 
In this case, you'll create a regex like this which includes all the origins you wish to allow: 
https?:\/\/(www\.contoso\.com|contoso\.com|www\.microsoft\.com|microsoft.com\.com)$
 
If the regex matches, the CDN edge will replace the Access-Control-Allow-Origin header (if any) from the origin with the origin that sent the request. Verizon uses PCRE as their engine for regex. There are a variety of tools to test your regex before deploying such as https://regex101.com/.
 
o	Request Header rule for each origin.
Instead of Regex, you can also create a separate rule for each origin you wish to allow with Request Header Wildcard. The * is to match both http and https.
 
 
In both cases, the Access-Control-Allow-Origin header from the Origin is completely ignored, so it can just be turned off, and management of allowed origins is purely from the Rules Engine above.
 
CDN Standard with Verizon/Akamai
On CDN Standard with either Verizon or Akamai, there is only a sub-optimal workaround to configure this today.
Overall one needs to enable query string setting for the CDN endpoint  and then using a unique query string for requests from each allowed domain. The enable query string setting will result in the CDN caching a separate object for every unique query string. This approach is sub-optimal for a # of reasons including that multiple object that are the same will be cached on the CDN.  
 
 
Additional CORS references:
https://www.fastly.com/blog/caching-cors
https://www.fastly.com/blog/best-practices-for-using-the-vary-header
http://www.w3.org/TR/cors/#access-control-allow-origin-response-header
https://en.wikipedia.org/wiki/Cross-origin_resource_sharing

