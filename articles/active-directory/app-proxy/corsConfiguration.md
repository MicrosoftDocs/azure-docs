---
title: Complex applications for Azure Active Directory Application Proxy
description: Provides an understanding of complex application in Azure Active Directory Application Proxy, and how to configure one. 
services: active-directory
author: dhruvinshah
manager: ashishj
ms.service: active-directory
ms.subservice: app-proxy
ms.workload: identity
ms.topic: how-to
ms.date: 04/22/2022
ms.author: dhruvinshah
ms.reviewer: ashishj
---

# Understand and solve Azure Active Directory Application Proxy CORS issues

[Cross-origin resource sharing (CORS)](https://www.w3.org/TR/cors/) can sometimes present challenges for the apps and APIs you publish through the Azure Active Directory Application Proxy. This article discusses Azure AD Application Proxy CORS issues and solutions.

Browser security usually prevents a web page from making AJAX requests to another domain. This restriction is called the *same-origin policy*, and prevents a malicious site from reading sensitive data from another site. However, sometimes you might want to let other sites call your web API. CORS is a W3C standard that lets a server relax the same-origin policy and allow some cross-origin requests while rejecting others.

## Pre-requisites
Before you get started with single sign-on for header-based authentication apps, make sure your environment is ready with the following settings and configurations:
- You need to enable Application Proxy and install a connector that has line of site to your applications. See the tutorial [Add an on-premises application for remote access through Application Proxy](application-proxy-add-on-premises-application.md#add-an-on-premises-app-to-azure-ad) to learn how to prepare your on-premises environment, install and register a connector, and test the connector. 

## Understand and identify CORS issues

Two URLs have the same origin if they have identical schemes, hosts, and ports ([RFC 6454](https://tools.ietf.org/html/rfc6454)), such as:

-   http:\//contoso.com/foo.html
-   http:\//contoso.com/bar.html

The following URLs have different origins than the previous two:

-   http:\//contoso.net - Different domain
-   http:\//contoso.com:9000/foo.html - Different port
-   https:\//contoso.com/foo.html - Different scheme
-   http:\//www.contoso.com/foo.html - Different subdomain

Same-origin policy prevents apps from accessing resources from other origins unless they use the correct access control headers. If the CORS headers are absent or incorrect, cross-origin requests fail. 

You can identify CORS issues by using browser debug tools:

1. Launch the browser and browse to the web app.
1. Press **F12** to bring up the debug console.
1. Try to reproduce the transaction, and review the console message. A CORS violation produces a console error about origin.

In the following screenshot, selecting the **Try It** button caused a CORS error message that https:\//corswebclient-contoso.msappproxy.net wasn't found in the Access-Control-Allow-Origin header.

![CORS issue](./media/application-proxy-understand-cors-issues/image3.png)

## Pre-requisites
Before you get started with single sign-on for header-based authentication apps, make sure your environment is ready with the following settings and configurations:
- You need to enable Application Proxy and install a connector that has line of site to your applications. See the tutorial [Add an on-premises application for remote access through Application Proxy](application-proxy-add-on-premises-application.md#add-an-on-premises-app-to-azure-ad) to learn how to prepare your on-premises environment, install and register a connector, and test the connector.
- You need to add a windlcard application to add application segments.

## Configure application segment(s) for complex application. 
Before you get started with single sign-on for header-based applications, you should have already installed an Application Proxy connector and the connector can access the target wildcard application. If not, follow the steps in [Create a wildcard application](application-proxy-wildcard.md#create-a-wildcard-application) then come back here. 

1. After your application appears in the list of enterprise applications, select it, and select **Single sign-on**. 
2. 

If successful, this method returns a `204 No Content` response code and does not return anything in the response body.
## Example

##### Response

<!-- {
  "blockType": "response"
} -->
```http
HTTP/1.1 204 No Content
```
#### Request
Here is an example of the request.


```http
<!-- {
  "blockType": "request",
  "name": "update_application"
}-->
```http
PATCH https://graph.microsoft.com/beta/applications/{<object-id-of--the-complex-app}

Content-type: application/json
{
    "onPremisesPublishing": {
		"onPremisesApplicationSegments": [
			{
				"externalUrl": "https://home.cookie.contoso.net/",
				"internalUrl": "https://home.test.com/",
				"alternateUrl": "",
				"corsConfigurations": []
			},
			{
				"externalUrl": "https://assets.cookie.constoso.net/",
				"internalUrl": "https://assets.test.com",
				"alternateUrl": "",
				"corsConfigurations": [
					{
						"resource": "/",
						"allowedOrigins": [
							"https://home.cookie.contoso.net/"
						],
						"allowedHeaders": [
							"*"
						],
						"allowedMethods": [
							"*"
						],
						"maxAgeInSeconds": 0
					}
				]
			}	
		]
	}
}

```
3. Set the single sign-on mode to **Header-based**. 
4. In Basic Configuration, **Azure Active Directory**, will be selected as the default. 
5. Select the edit pencil, in Headers to configure headers to send to the application. 
6. Select **Add new header**. Provide a **Name** for the header and select either **Attribute** or **Transformation** and select from the drop-down which header your application needs.  
    - To learn more about the list of attribute available, see [Claims Customizations- Attributes](../develop/active-directory-saml-claims-customization.md#attributes). 
    - To learn more about the list of transformation available, see [Claims Customizations- Claim Transformations](../develop/active-directory-saml-claims-customization.md#claim-transformations). 
    - You may also add a **Group Header**, to send all the groups a user is part of, or the groups assigned to the application as a header. To learn more about configuring groups as a value see: [Configure group claims for applications](../hybrid/how-to-connect-fed-group-claims.md#add-group-claims-to-tokens-for-saml-applications-using-sso-configuration). 
7. Select Save. 

## CORS challenges with Application Proxy

The following example shows a typical Azure AD Application Proxy CORS scenario. The internal server hosts a **CORSWebService** web API controller, and a **CORSWebClient** that calls **CORSWebService**. There's an AJAX request from **CORSWebClient** to **CORSWebService**.

![On-premises same-origin request](./media/application-proxy-understand-cors-issues/image1.png)

The CORSWebClient app works when you host it on-premises, but either fails to load or errors out when published through Azure AD Application Proxy. If you published the CORSWebClient and CORSWebService apps separately as different apps through Application Proxy, the two apps are hosted at different domains. An AJAX request from CORSWebClient to CORSWebService is a cross-origin request, and it fails.

![Application Proxy CORS request](./media/application-proxy-understand-cors-issues/image2.png)

## Solutions for Application Proxy CORS issues

You can resolve the preceding CORS issue in any one of several ways.

### Option 1: Set up a custom domain

Use an Azure AD Application Proxy [custom domain](./application-proxy-configure-custom-domain.md) to publish from the same origin, without having to make any changes to app origins, code, or headers. 

### Option 2: Publish the parent directory

Publish the parent directory of both apps. This solution works especially well if you have only two apps on the web server. Instead of publishing each app separately, you can publish the common parent directory, which results in the same origin.

The following examples show the portal Azure AD Application Proxy page for the CORSWebClient app.  When the **Internal URL** is set to *contoso.com/CORSWebClient*, the app can't make successful requests to the *contoso.com/CORSWebService* directory, because they're cross-origin. 

![Publish app individually](./media/application-proxy-understand-cors-issues/image4.png)

Instead, set the **Internal URL** to publish the parent directory, which includes both the *CORSWebClient* and *CORSWebService* directories:

![Publish parent directory](./media/application-proxy-understand-cors-issues/image5.png)

The resulting app URLs effectively resolve the CORS issue:

- https:\//corswebclient-contoso.msappproxy.net/CORSWebService
- https:\//corswebclient-contoso.msappproxy.net/CORSWebClient

### Option 3: Update HTTP headers

Add a custom HTTP response header on the web service to match the origin request. For websites running in Internet Information Services (IIS), use IIS Manager to modify the header:

![Add custom response header in IIS Manager](./media/application-proxy-understand-cors-issues/image6.png)

This modification doesn't require any code changes. You can verify it in the Fiddler traces:

```output
**Post the Header Addition**\
HTTP/1.1 200 OK\
Cache-Control: no-cache\
Pragma: no-cache\
Content-Type: text/plain; charset=utf-8\
Expires: -1\
Vary: Accept-Encoding\
Server: Microsoft-IIS/8.5 Microsoft-HTTPAPI/2.0\
**Access-Control-Allow-Origin: https\://corswebclient-contoso.msappproxy.net**\
X-AspNet-Version: 4.0.30319\
X-Powered-By: ASP.NET\
Content-Length: 17
```

### Option 4: Modify the app

You can change your app to support CORS by adding the Access-Control-Allow-Origin header, with appropriate values. The way to add the header depends on the app's code language. Changing the code is the least recommended option, because it requires the most effort.

### Option 5: Extend the lifetime of the access token

Some CORS issues can't be resolved, such as when your app redirects to *login.microsoftonline.com* to authenticate, and the access token expires. The CORS call then fails. A workaround for this scenario is to extend the lifetime of the access token, to prevent it from expiring during a user’s session. For more information about how to do this, see [Configurable token lifetimes in Azure AD](../develop/active-directory-configurable-token-lifetimes.md).

## See also
- [Tutorial: Add an on-premises application for remote access through Application Proxy in Azure Active Directory](../app-proxy/application-proxy-add-on-premises-application.md) 
- [Plan an Azure AD Application Proxy deployment](application-proxy-deployment-plan.md) 
- [Remote access to on-premises applications through Azure Active Directory Application Proxy](application-proxy.md)
