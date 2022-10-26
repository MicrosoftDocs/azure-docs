---
title: Call a REST API by using Azure Active Directory B2C custom policy
titleSuffix: Azure AD B2C
description: Learn how to make an HTTP call to external API by using Azure Active Directory B2C custom policy.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.custom: b2c-docs-improvements
ms.date: 12/30/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Call a REST API by using Azure Active Directory B2C custom policy

TODO


## Scenario overview 

TODO

DIAGRAM/FLOWCHART 

## Prerequisites

- If you don't have one already, [create an Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.

- [Register a web application](tutorial-register-applications.md), and [enable ID token implicit grant](tutorial-register-applications.md#enable-id-token-implicit-grant). For the Redirect URI, use https://jwt.ms. 

- You must have [Node.js](https://nodejs.org) installed in your computer. 

- You must have [Visual Studio Code (VS Code)](https://code.visualstudio.com/) installed in your computer. 

- Complete the steps in [Validate user inputs by using Azure AD B2C custom policy](custom-policies-series-validate-user-input.md). This article is a part of [Create and run your own custom policies how-to guide series](custom-policies-series-overview.md). 


- Node rest service:
    - node app
    - host it in Azure app service
    - name of app is custom-policy-api
    
- Validate the access code:
    - send access code to external service
    - validate access code in the service
    - return a 200 OK or Error 409 - conflict 
- Authenticating REST service? [!NOTE]
    - mention how it needs to be done
- Enable for complex payload data:[!NOTE]
    - use claims transformation such as JSON and send it over 



