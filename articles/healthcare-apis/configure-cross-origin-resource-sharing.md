---
title: Configure Cross-Origin Resource Sharing in Azure API for FHIR
description: This article describes how to configure Cross-Origin Resource Sharing (CORS) in Azure API for FHIR..
author: matjazl
ms.author: matjazl 
ms.date: 3/11/2019
ms.topic: reference
ms.service: healthcare-apis

---
# Configure Cross-Origin Resource Sharing

Azure API for FHIR supports [Cross Origin Resource Sharing (CORS)](https://wikipedia.org/wiki/Cross-Origin_Resource_Sharing) which allows you to configure settings so that applications from one domain (origin) can access resources from a different domain (a cross-domain request).

CORS is mostly used in single page app that needs to call RESTful API call to a different domain.

To configure CORS setting in Azure API for FHIR, navigate to CORS setting. 

Here you can specify the following settings:

**Origins (Access-Control-Allow-Origin):** List of domains that are allowed to make cross-origin requests to the Azure API for FHIR. Each domain (Origin) must be entered in separate line. You can enter '*' to allow calls from any domain (not recommended as it represents security risk).

**Headers (Access-Control-Allow-Headers):** You can specify a list of headers that origin request will contain. You can set it to '*' to allow all headers. 

**Methods (Access-Control-Allow-Methods):** You can select allowed methods (PUT, GET, POST,...) that are allowed in API call. You can also **Select all** for all methods.

**Max Age (Access-Control-Max-Age):** Value in seconds to cache preflight request results for **Access-Control-Allow-Methods** and **Access-Control-Allow-Headers**. 

**Allow Credentials (Access-Control-Allow-Credentials):** CORS requests normally don’t include cookies to prevent [Cross-Site Request Forgery (CSRF)](https://en.wikipedia.org/wiki/Cross-site_request_forgery) attacks. When checked, the request can be made with/will include credentials such as Cookies. You can not set this setting if you set Origins to '*'

![](media/cors/cors.png)

You cannot specify different settings for different domain Origins. All the settings (headers, methods, max age and allow credentials) apply to all Origins specified in Origins setting.
