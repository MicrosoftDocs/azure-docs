<properties
	pageTitle="Using Azure CDN with CORS | Microsoft Azure"
	description="Learn how to use the Azure Content Delivery Network (CDN) to with Cross-Origin Resource Sharing (CORS)."
	services="cdn"
	documentationCenter=""
	authors="camsoper"
	manager="erikre"
	editor=""/>

<tags
	ms.service="cdn"
	ms.workload="tbd"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/28/2016"
	ms.author="casoper"/>
    
# Using Azure CDN with CORS     

## What is CORS?

CORS (Cross Origin Resource Sharing) is an HTTP feature that enables a web application running under one domain to access resources in another domain. In order to reduce the possibility of cross-site scripting attacks, all modern web browsers implement a security restriction known as [same-origin policy](http://www.w3.org/Security/wiki/Same_Origin_Policy).  This prevents a web page from calling APIs in a different domain.  CORS provides a secure way to allow one domain (the origin domain) to call APIs in another domain.
 
## How it works
1.	The browser sends the OPTIONS request with an **Origin** HTTP header. The value of this header is the domain that served the parent page. When a page from https://www.contoso.com attempts to access a user's data in the fabrikam.com domain, the following request header would be sent to fabrikam.com: 
    
    `Origin: https://www.contoso.com`
 
2.	The server may respond with the following:
    - An **Access-Control-Allow-Origin** header in its response indicating which origin sites are allowed. For example:
        
        `Access-Control-Allow-Origin: https://www.contoso.com`
        
    - An error page if the server does not allow the cross-origin request
    - An **Access-Control-Allow-Origin** header with a wildcard that allows all domains:
        
        `Access-Control-Allow-Origin: *`
 
For complex HTTP requests, there's a "preflight" request done first to determine whether it has permission before sending the entire request.
 
## Wildcard or single origin scenarios

CORS on Azure CDN will work automatically with no additional configuration when the **Access-Control-Allow-Origin** header is set to wildcard (*) or a single origin.  The CDN will cache the first response and subsequent requests will use the same header.
 
If requests have already been made to the CDN prior to CORS being set on the your origin, you will need to purge content on your endpoint content to reload the content with the **Access-Control-Allow-Origin** header.
 
## Multiple origin scenarios

If you need to allow a specific list of origins to be allowed for CORS, things get a little more complicated. The problem occurs when the CDN caches the **Access-Control-Allow-Origin** header for the first CORS origin.  When a different CORS origin makes a subsequent request, the CDN will served the cached **Access-Control-Allow-Origin** header, which won't match.  There are several ways to correct this.
 
### Azure CDN Premium from Verizon

The best way to enable this is to use **Azure CDN Premium from Verizon**, which exposes some advanced functionality. 
 
You'll need to [create a rule](cdn-rules-engine.md) to check the **Origin** header on the request.  If it's a valid origin, your rule will set the **Access-Control-Allow-Origin** header with the origin provided in the request.  If the origin specified in the **Origin** header is not allowed, your rule should omit the **Access-Control-Allow-Origin** header which will cause the browser to reject the request. 
 
There are two ways to do this with the rules engine.  In both cases, the **Access-Control-Allow-Origin** header from the file's origin server is completely ignored, the CDN's rules engine completely manages the allowed CORS origins.

#### One regular expression with all valid origins
 
In this case, you'll create a regular expression that includes all of the origins you want to allow: 

	https?:\/\/(www\.contoso\.com|contoso\.com|www\.microsoft\.com|microsoft.com\.com)$
 
> [AZURE.TIP] **Azure CDN from Verizon** uses [Perl Compatible Regular Expressions](http://pcre.org/) as its engine for regular expressions.  You can use a tool like [Regular Expressions 101](https://regex101.com/) to validate your regular expression.  Note that the "/" character is valid in regular expressions and doesn't need to be escaped, however, escaping that character is considered a best practice and is expected by some regex validators.

If the regular expression matches, your rule will replace the **Access-Control-Allow-Origin** header (if any) from the origin with the origin that sent the request.  You can also add additional CORS headers, such as **Access-Control-Allow-Methods**.

![Rules example with regular expression](./media/cdn-cors/cdn-cors-regex.png)
 
#### Request header rule for each origin.

Rather than regular expressions, you can instead create a separate rule for each origin you wish to allow using the **Request Header Wildcard** [match condition](cdn-rules-engine-details.md#match-conditions). As with the regular expression method, the rules engine alone sets the CORS headers. 
  
![Rules example without regular expression](./media/cdn-cors/cdn-cors-no-regex.png)

> [AZURE.TIP] In the example above, the use of the wildcard character * tells the rules engine to match both HTTP and HTTPS.
 
### Azure CDN Standard

On Azure CDN Standard profiles, the only mechanism to allow for multiple origins without the use of the wildcard origin is to use [query string caching](cdn-query-string.md).  You need to enable query string setting for the CDN endpoint and then use a unique query string for requests from each allowed domain. Doing this will result in the CDN caching a separate object for each unique query string. This approach is not ideal, however, as it will result in multiple copies of the same file cached on the CDN.  

