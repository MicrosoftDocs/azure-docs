---
title: Understand and solve Azure AD Application Proxy CORS issues
description: Provides an understanding of CORS in Azure AD Application Proxy, and how to identify and solve CORS issues. 
services: active-directory
author: v-thepet
manager: mtillman
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 05/13/2019
ms.author: celested
ms.reviewer: japere
---

# Understand and solve Azure AD Application Proxy CORS issues

Browser security prevents a web page from making AJAX requests to another domain. This restriction is called the *same-origin policy*, and prevents a malicious site from reading sensitive data from another site. However, sometimes you might want to let other sites call your web API. [Cross-origin resource sharing (CORS)](http://www.w3.org/TR/cors/) is a W3C standard that lets a server relax the same-origin policy. Using CORS, a server can explicitly allow some cross-origin requests while rejecting others.

CORS can sometimes present challenges for the apps and APIs you publish through the Azure AD Application Proxy. This article provides an understanding of CORS in Application Proxy, and options to resolve CORS issues.

## CORS challenges with Application Proxy

Two URLs have the same origin if they have identical schemes, hosts, and ports ([RFC 6454](https://tools.ietf.org/html/rfc6454)), such as:

-   http:\//contoso.com/foo.html

-   http:\//contoso.com/bar.html

The following URLs have different origins than the previous two:

-   http:\//consoto.net - Different domain

-   http:\//contoso.com:9000/foo.html - Different port

-   https:\//contoso.com/foo.html - Different scheme

-   http:\//www.contoso.com/foo.html - Different subdomain

The following examples show a **Webservice**, which hosts a web API controller, and a **WebClient**, which calls **Webservice**. There is an AJAX request from **WebClient** to **WebService**.

![On-premises same-origin request](./media/application-proxy-understand-cors-issues/image1.png)

The WebClient app seems to work when you host it on premises, but it either fails to load or errors out when you publish it via the Azure AD Application Proxy. Since you published the two apps separately through Application Proxy, they're hosted at different domains, so the AJAX request from WebClient to WebService is cross-origin and fails.

![Application Proxy CORS request](./media/application-proxy-understand-cors-issues/image2.png)

You can identify CORS issues by using browser debug tools:

1. Launch the browser and browse to the web app.
1. Press **F12** to bring up the debug console or developer tools.
1. Try to reproduce the transaction, and review the console. 
   If there is a CORS violation, the console gives an error about the origin.

In the following example, the cross-origin call happens on the **Try It** button click. Instead of the expected test message, you see an error that *https:\//corwebclient-allmylab.msappproxy.net* is missing from the **Access-Control-Allow-Origin** header.

![CORS issue](./media/application-proxy-understand-cors-issues/image3.png)

## Solutions for Application Proxy CORS issues

### Option 1: Custom domains

Use an Azure AD Application Proxy [custom domain](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-application-proxy-custom-domains) name, without having to make any changes to origins, apps, or headers. 

### Option 2: Publish the parent directory

Publish the parent directory of both apps. This solution works especially well if you only have two apps on the web server. Instead of publishing each app separately, publish the common parent directory, resulting in the same origin.

App published individually:

![Publish app individually](./media/application-proxy-understand-cors-issues/image6.png)

Instead, publish the parent directory:

![Publish parent directory](./media/application-proxy-understand-cors-issues/image6.png)

The resulting URLs effectively resolve the CORS issues:

- https:\//corswebclient-allmylab.msappproxy.net/CORSWebService
- https:\//corswebclient-allmylab.msappproxy.net/CORSWebClient

## Option 3: Update HTTP headers

Add a custom HTTP response header on the web service to match the origin request. For example, you can use IIS Manager to modify the header for websites running in Internet Information Services (IIS):

![Add custom response header in IIS Manager](./media/application-proxy-understand-cors-issues/image6.png)

This modification doesn't require any code changes. You can verify it in the Fiddler traces.

**Post the Header Addition**\
HTTP/1.1 200 OK\
Cache-Control: no-cache\
Pragma: no-cache\
Content-Type: text/plain; charset=utf-8\
Expires: -1\
Vary: Accept-Encoding\
Server: Microsoft-IIS/8.5 Microsoft-HTTPAPI/2.0\
**Access-Control-Allow-Origin: https://corswebclient-allmylab.msappproxy.net**\
X-AspNet-Version: 4.0.30319\
X-Powered-By: ASP.NET\
Content-Length: 17

## Option 4: Modify the app

You can change your app to support CORS by adding the *Access-Control-Allow-Origin* header, with appropriate values. The way to add the header depends on the app's code language. Changing the code is the least recommended option, because it requires the most effort.
