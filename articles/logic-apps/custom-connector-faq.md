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
ms.date: 09/1/2017
ms.author: LADocs; estfan
---

# FAQ: Custom connectors

## Requirements

**Q:** I'm not an ISV, so can I still build a connector? </br>
**A:** If you want to certify and publicly release a connector, 
you must either own the underlying service or present explicit rights to use the API.

**Q:** Can I build a connector without REST APIs? </br>
**A:** No, to build a connector, you must support stable HTTP REST APIs 
for your service. 

**Q:** What tools can I use to create a connector? </br>
**A:** Azure has capabilities and services that 
you can use for exposing any service as an API, 
such as Azure App Service for hosting, API Management, and more.

**Q:** What authentication types are supported? </br>
**A:** You can use these supported authentication standards:

* OAuth2.0, which includes Azure Active Directory
* API Key
* Basic Authentication

## Triggers

**Q:** Can I build triggers without webhooks? </br>
**A:** No, custom connectors for Azure Logic Apps and Microsoft Flow 
support only webhook-based triggers. 
If you want to request other patterns for implementation, 
contact [condevhelp@microsoft.com](mailto:condevhelp@microsoft.com) 
with more details about your API.

## Other

**Q:** My APIs use a dynamic host. How do I implement them with OpenAPI? </br>
**A:** Custom connectors don't support dynamic hosts. 
Instead, use a static host for development and testing purposes. 
During submission, talk to your Microsoft contact regarding the dynamic implementation.

**Q:** Do you support Postman Collection V2? </br>
**A:** No, only Postman Collection V1 is currently supported.

**Q:** Do you support OpenAPI 3.0? </br>
**A:** No, only OpenAPI 2.0 is currently supported.