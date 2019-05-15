---
title: Understand and solve Azure AD Application Proxy CORS issues
description: Provides an understanding of CORS in Azure AD Application Proxy, and how to identify and solve CORS issues. 
services: active-directory
author: jeevanbisht
manager: mtillman
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 05/13/2019
ms.author: celested
ms.reviewer: japere
---

# Understand and solve Azure Active Directory Application Proxy CORS issues

Browser security usually prevents a web page from making AJAX requests to another domain. This restriction is called the *same-origin policy*, and prevents a malicious site from reading sensitive data from another site. However, sometimes you might want to let other sites call your web API. [Cross-origin resource sharing (CORS)](http://www.w3.org/TR/cors/) is a W3C standard that lets a server relax the same-origin policy. Using CORS, a server can explicitly allow some cross-origin requests while rejecting others.

CORS can sometimes present challenges for the apps and APIs you publish through the Azure AD Application Proxy. This article discusses Azure AD Application Proxy CORS issues and solutions.

## CORS challenges with Application Proxy

Two URLs have the same origin if they have identical schemes, hosts, and ports ([RFC 6454](https://tools.ietf.org/html/rfc6454)), such as:

-   http:\//contoso.com/foo.html
-   http:\//contoso.com/bar.html

The following URLs have different origins than the previous two:

-   http:\//contoso.net - Different domain
-   http:\//contoso.com:9000/foo.html - Different port
-   https:\//contoso.com/foo.html - Different scheme
-   http:\//www.contoso.com/foo.html - Different subdomain

The following examples show a **WebService**, which hosts a web API controller, and a **WebClient**, which calls **WebService**. There is an AJAX request from **WebClient** to **WebService**.

![On-premises same-origin request](./media/application-proxy-understand-cors-issues/image1.png)

The WebClient app seems to work when you host it on premises, but it either fails to load or errors out when you publish it via the Azure AD Application Proxy. Since you published the two apps separately through Application Proxy, they're hosted at different domains, so the AJAX request from WebClient to WebService is cross-origin and it fails.

![Application Proxy CORS request](./media/application-proxy-understand-cors-issues/image2.png)

You can identify CORS issues by using browser debug tools:

1. Launch the browser and browse to the web app.
1. Press **F12** to bring up the debug console.
1. Try to reproduce the transaction, and review the console message. A CORS violation gives a console error about origin.

In the following example, the cross-origin call happens on the **Try It** button click. Instead of the test message, there's an error that https:\//corswebclient-allmylab.msappproxy.net is missing from the Access-Control-Allow-Origin header.

![CORS issue](./media/application-proxy-understand-cors-issues/image3.png)

## Solutions for Application Proxy CORS issues

You can resolve the preceding CORS issue in any one of several ways.

### Option 1: Custom domains

Use an Azure AD Application Proxy [custom domain](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-application-proxy-custom-domains) to publish from the same origin, without having to make any changes to app origins, code, or headers. 

### Option 2: Publish the parent directory

Publish the parent directory of both apps. This solution works especially well if you only have two apps on the web server. Instead of publishing each app separately, publish the common parent directory to give both apps the same origin.

- App directory published individually:
  
  ![Publish app individually](./media/application-proxy-understand-cors-issues/image4.png)
  
- Instead publish the parent directory:

  ![Publish parent directory](./media/application-proxy-understand-cors-issues/image5.png)
  
  The resulting app URLs effectively resolve the CORS issue:
  
  - https:\//corswebclient-allmylab.msappproxy.net/CORSWebService
  - https:\//corswebclient-allmylab.msappproxy.net/CORSWebClient

### Option 3: Update HTTP headers

Add a custom HTTP response header on the web service to match the origin request. For websites running in Internet Information Services (IIS), use IIS Manager to modify the header:

![Add custom response header in IIS Manager](./media/application-proxy-understand-cors-issues/image6.png)

This modification doesn't require any code changes. You can verify it in the Fiddler traces:

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

### Option 4: Modify the app

You can change your app to support CORS by adding the Access-Control-Allow-Origin header, with appropriate values. The way to add the header depends on the app's code language. Changing the code is the least recommended option, because it requires the most effort.

## See also
- [Tutorial: Add an on-premises application for remote access through Application Proxy in Azure Active Directory](application-proxy-add-on-premises-application.md) 
- [Plan an Azure AD Application Proxy deployment](application-proxy-deployment-plan.md) 
- [Remote access to on-premises applications through Azure Active Directory Application Proxy](application-proxy.md) 
