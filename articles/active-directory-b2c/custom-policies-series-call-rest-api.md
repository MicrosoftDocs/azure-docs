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

Azure Active Directory B2C (Azure AD B2C) custom policy allows you to interact with application logic that implemented outside of Azure AD B2C. You do this by making an HTTP call to an endpoint. Azure AD B2C custom policies provides RESTful technical profile for this purpose. By using this capability, you can implement features that aren't available within Azure AD B2C custom policy.   

In this article, you'll learn how to: 

- Create and deploy a sample Node.js app.

- Make an HTTP call to the Node.js app by using the RESTful technical profile.

- Handle or report errors that result from calling the Node.js app in your custom policy.


## Scenario overview 

In [Create branching in user journey by using Azure AD B2C custom policies](custom-policies-series-branch-in-user-journey-using-pre-conditions.md), users who select *Personal Account* needs to provide a valid invitation access code to proceed. We use a static access code, but real apps don't work this way. If the service, which issues the access codes is external to your custom policy, you must make a call to that service, and pass the access code input by the user for validation. If the access code is valid, the service returns an HTTP 200 (OK) response, and Azure AD B2C issues JWT token. Otherwise, the service returns an HTTP 409 (Conflict) response, and the use must re-enter an access code. 

:::image type="content" source="media/custom-policies-series-call-rest-api/screenshot-of-call-rest-api-call.png" alt-text="screenshot-of-branching-in-user-journey.":::

## Prerequisites

- If you don't have one already, [create an Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.

- [Register a web application](tutorial-register-applications.md), and [enable ID token implicit grant](tutorial-register-applications.md#enable-id-token-implicit-grant). For the Redirect URI, use https://jwt.ms. 

- You must have [Node.js](https://nodejs.org) installed in your computer. 

- You must have [Visual Studio Code (VS Code)](https://code.visualstudio.com/) installed in your computer. 

- Complete the steps in [Validate user inputs by using Azure AD B2C custom policy](custom-policies-series-validate-user-input.md). This article is a part of [Create and run your own custom policies how-to guide series](custom-policies-series-overview.md). 

## Create and deploy a Node.js app

You need to deploy an app, which will serve as your external app. Your custom policy then makes an HTTP call to this app. 

### Create the Node.js app 

1. Create a folder to host your node application, such as `access-code-app`. 

1. In your terminal, change directory into your Node app folder, such as `cd access-code-app`, and run `npm init -y`. This command creates a default `package.json` file for your Node.js project.

1. In your terminal, run `npm install express body-parser`. This command installs the Express framework and the [body-parser](https://www.npmjs.com/package/body-parser) package.

1. In your project, create `index.js` file. 

1. In VS Code, open the `index.js` file, and then add the following code:

    ```JavaScript
        const express = require('express');
        let bodyParser = require('body-parser')
        //Create an express instance
        const app = express();
        
        app.use( bodyParser.json() );       // to support JSON-encoded bodies
        app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
          extended: true
        }));
        
        
        app.post('/validate-accesscode', (req, res) => {
            let accessCode = '88888';
            if(accessCode == req.body.accessCode){
                res.status(200).send();
            }else{
                let errorResponse = {
                    "version" :"1.0",
                    "status" : 409,
                    "code" : "errorCode",
                    "requestId": "requestId",
                    "userMessage" : "Invalid access code. Please try again.",
                    "developerMessage" : `The The provided code ${req.body.accessCode} does not match the expected code for user.`,
                    "moreInfo" :"https://docs.microsoft.com/en-us/azure/active-directory-b2c/string-transformations"
                };
                res.status(409).send(errorResponse);
                
            }
        });
        
        app.listen(3000, () => {
            console.log(`Access code service listening on port !` + 3000);
        });
    ```    

1. Test app by issuing a POST request by using a HTTP client such as MS PowerShell .... make sure it return the expected result 


At this point, your Node.js app is ready for deploying. 

### Deploy the Node.js app in Azure App Service



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



