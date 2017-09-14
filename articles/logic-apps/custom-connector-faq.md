---
title: Custom connector FAQ - Azure Logic Apps | Microsoft Docs
description: FAQ about requirements, triggers, and so on about creating custom  connectors
author: ecfan
manager: anneta
editor: 
services: logic-apps
documentationcenter: 

ms.assetid: 
ms.service: logic-apps
ms.workload: logic-apps
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/20/2017
ms.author: LADocs; estfan
---

# FAQ: Custom connectors

## Requirements

**Q:** Can I build a connector without REST APIs? </br>
**A:** No, to build a connector, you must support stable HTTP REST APIs 
for your service. 

**Q:** What tools can I use to create a connector? </br>
**A:** Azure has capabilities and services that 
you can use for exposing any service as an API, 
such as Azure App Service for hosting, API Management, and more.

**Q:** What authentication types are supported? </br>
**A:** You can use these supported authentication standards:

* [OAuth 2.0](https://oauth.net/2/), including 
[Azure Active Directory](https://azure.microsoft.com/develop/identity/) 
or specific services, such as Dropbox, GitHub, and SalesForce
* Generic OAuth 2.0
* [Basic authentication](https://swagger.io/docs/specification/authentication/basic-authentication/)
* [API Key](https://swagger.io/docs/specification/authentication/api-keys/)

## Triggers

**Q:** Can I build triggers without webhooks? </br>
**A:** No, custom connectors for Azure Logic Apps and Microsoft Flow 
support only webhook-based triggers. 
If you want to request other patterns for implementation, 
contact [condevhelp@microsoft.com](mailto:condevhelp@microsoft.com) 
with more details about your API.

## Certification

**Q**: I'm not a Microsoft partner or Independent Software Vendor (ISV). 
Can I still create connectors? </br>
**A**: Yes, you can register these connectors for internal use in your organization, but if you want to certify and publicly release a connector, 
you must either own the underlying service or present explicit 
rights to use the API.

## Other

**Q:** My APIs use a dynamic host. How do I implement them with OpenAPI? </br>
**A:** Custom connectors don't support dynamic hosts. 
Instead, use a static host for development and testing purposes. 
If you want to certify your connector, 
ask your Microsoft contact about dynamic implementation.

**Q:** Do you support Postman Collection V2? </br>
**A:** No, only Postman Collection V1 is currently supported.

**Q:** Do you support OpenAPI 3.0? </br>
**A:** No, only OpenAPI 2.0 is currently supported.