---
title: Call a REST API by using Azure Active Directory B2C custom policy
titleSuffix: Azure AD B2C
description: Learn how to make an HTTP call to external API by using Azure Active Directory B2C custom policy.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.custom: b2c-docs-improvements, devx-track-js
ms.date: 11/06/2023
ms.author: kengaderdus
ms.reviewer: yoelh
ms.subservice: B2C
---

# Call a REST API by using Azure Active Directory B2C custom policy

Azure Active Directory B2C (Azure AD B2C) custom policy allows you to interact with application logic that's implemented outside of Azure AD B2C. To do so, you make an HTTP call to an endpoint. Azure AD B2C custom policies provide RESTful technical profile for this purpose. By using this capability, you can implement features that aren't available within Azure AD B2C custom policy.   

In this article, you learn how to: 

- Create and deploy a sample Node.js app for use as a RESTful service.

- Make an HTTP call to the Node.js RESTful service by using the RESTful technical profile.

- Handle or report an error that a RESTful service returns to your custom policy.


## Scenario overview 

In [Create branching in user journey by using Azure AD B2C custom policies](custom-policies-series-branch-user-journey.md), users who select *Personal Account* need to provide a valid invitation access code to proceed. We use a static access code, but real world apps don't work this way. If the service that issues the access codes is external to your custom policy, you must make a call to that service, and pass the access code input by the user for validation. If the access code is valid, the service returns an HTTP `200 OK` response, and Azure AD B2C issues JWT token. Otherwise, the service returns an HTTP `409 Conflict` response, and the user must re-enter an access code. 

:::image type="content" source="media/custom-policies-series-call-rest-api/screenshot-of-call-rest-api-call.png" alt-text="A flowchart of calling a R E S T  A P I.":::

## Prerequisites

- If you don't have one already, [create an Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.

- [Register a web application](tutorial-register-applications.md), and [enable ID token implicit grant](tutorial-register-applications.md#enable-id-token-implicit-grant). For the Redirect URI, use https://jwt.ms. 

- You must have [Node.js](https://nodejs.org) installed in your computer. 

- You must have [Visual Studio Code (VS Code)](https://code.visualstudio.com/) installed in your computer. 

- Complete the steps in [Validate user inputs by using Azure AD B2C custom policy](custom-policies-series-validate-user-input.md). This article is a part of [Create and run your own custom policies how-to guide series](custom-policies-series-overview.md). 

[!INCLUDE [active-directory-b2c-app-integration-call-api](../../includes/active-directory-b2c-common-note-custom-policy-how-to-series.md)]

## Step 1 - Create and deploy a Node.js app

You need to deploy an app, which will serve as your external app. Your custom policy then makes an HTTP call to this app. 

### Step 1.1 - Create the Node.js app 

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
                    "userMessage" : "The access code you entered is incorrect. Please try again.",
                    "developerMessage" : `The provided code ${req.body.accessCode} does not match the expected code for user.`,
                    "moreInfo" :"https://docs.microsoft.com/en-us/azure/active-directory-b2c/string-transformations"
                };
                res.status(409).send(errorResponse);                
            }
        });
        
        app.listen(80, () => {
            console.log(`Access code service listening on port !` + 80);
        });
    ```
    
    You can observe that when a user submits a wrong access code, you can return an error directly from the REST API. Custom policies allow you to return an HTTP 4xx error message, such as, 400 (bad request), or 409 (Conflict) response status code with a response JSON body formatted as shown in `errorResponse` variable. The source of the accessCode in the app could be read from a database. Learn more about [Returning validation error message](restful-technical-profile.md#returning-validation-error-message).   

1. To test the app works as expected, use the following steps:
    1. In your terminal, run the `node index.js` command to start your app server. 
    1. To make a POST request similar to the one shown below, you can use an HTTP client such as [Microsoft PowerShell](/powershell/scripting/overview) or [Postman](https://www.postman.com/):
    
    ```http
        POST http://localhost/validate-accesscode HTTP/1.1
        Host: localhost
        Content-Type: application/x-www-form-urlencoded
    
        accessCode=user-code-code
    ```
    
    Replace `user-code-code` with an access code input by the user, such as `54321`. If you're using PowerShell, run the following script. 

    ```powershell
        $accessCode="54321"
        $endpoint="http://localhost/validate-accesscode"
        $body=$accessCode
        $response=Invoke-RestMethod -Method Post -Uri $endpoint -Body $body
        echo $response
    ```    

    If you use an incorrect access code, the response looks similar to the following JSON snippet:  
    
    ```json
        {
            "version": "1.0",
            "status": 409,
            "code": "errorCode",
            "requestId": "requestId",
            "userMessage": "The access code you entered is incorrect. Please try again.",
            "developerMessage": "The provided code 54321 does not match the expected code for user.",
            "moreInfo": "https://docs.microsoft.com/en-us/azure/active-directory-b2c/string-transformations"
        }
    ```

At this point, you're ready to deploy your Node.js app. 

### Step 1.2 - Deploy the Node.js app in Azure App Service

For your custom policy to reach your Node.js app, it needs to be reachable, so, you need deploy it. In this article, you'll deploy the app by using [Azure App Service](../app-service/overview-vnet-integration.md), but you use an alternative hosting approach. 

Follow the steps in [Deploy your app to Azure](../app-service/quickstart-nodejs.md#deploy-to-azure) to deploy your Node.js app to Azure. For the **Name** of the app, use a descriptive name such as `custompolicyapi`. Hence:

- App URL looks similar to `https://custompolicyapi.azurewebsites.net`.

- Service endpoint looks similar to `https://custompolicyapi.azurewebsites.net/validate-accesscode`.

You can test the app you've deployed by using an HTTP client such as [Microsoft PowerShell](/powershell/scripting/overview) or [Postman](https://www.postman.com/). This time, use `https://custompolicyapi.azurewebsites.net/validate-accesscode` URL as the endpoint. 

## Step 2 - Call the REST API

Now that your app is running, you need to make an HTTP call from your custom policy. Azure AD B2C custom policy provides a [RESTful technical profile](restful-technical-profile.md#returning-validation-error-message) that you use to call an external service.  


### Step 2.1 - Define a RESTful technical profile 

In your `ContosoCustomPolicy.XML` file, locate the `ClaimsProviders` section, and define a new RESTful technical profile by using the following code: 

```xml
    <!--<ClaimsProviders>-->
        <ClaimsProvider>
            <DisplayName>HTTP Request Technical Profiles</DisplayName>
            <TechnicalProfiles>
                <TechnicalProfile Id="ValidateAccessCodeViaHttp">
                    <DisplayName>Check that the user has entered a valid access code by using Claims Transformations</DisplayName>
                    <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
                    <Metadata>
                        <Item Key="ServiceUrl">https://custompolicyapi.azurewebsites.net/validate-accesscode</Item>
                        <Item Key="SendClaimsIn">Body</Item>
                        <Item Key="AuthenticationType">None</Item>
                        <Item Key="AllowInsecureAuthInProduction">true</Item>
                    </Metadata>
                    <InputClaims>
                        <InputClaim ClaimTypeReferenceId="accessCode" PartnerClaimType="accessCode" />
                    </InputClaims>
                </TechnicalProfile>
            </TechnicalProfiles>
        </ClaimsProvider>
    <!--</ClaimsProviders>-->
``` 
    
From the protocol, you can observe that we configure the Technical Profile to use the *RestfulProvider*. You can also observe the following information it the metadata section: 

- The `ServiceUrl` represents the API endpoint. Its value is `https://custompolicyapi.azurewebsites.net/validate-accesscode`. If you deployed your Node.js app using an alternative method, make sure to update the endpoint value.

- `SendClaimsIn` specifies how the input claims are sent to the RESTful claims provider. Possible values: `Body (default)`, `Form`, `Header`, `Url` or `QueryString`. When you use `Body`, such as in this article, you invoke the *POST* HTTP verb, and the data you send to the API if formatted as key, value pairs in the body of the request. Learn [how to invoke the *GET* HTTP verb, and pass data as query string](restful-technical-profile.md#metadata).  

- `AuthenticationType` specifies the type of authentication that the RESTful claims provider performs. Our RESTful claims provider calls an unprotected endpoint, so we set our `AuthenticationType` to *None*. If you set authentication type to `Bearer`, you need to add a *CryptographicKeys* element, which specifies the storage for your access token. Learn more about [the types of authentication that the RESTful claims provider supports](restful-technical-profile.md#metadata). 

- The *PartnerClaimType* attribute in the `InputClaim` specifies how you'll receive your data in the API. 
   
### Step 2.2 - Update validation technical profile

In [Create branching in user journey by using Azure AD B2C custom policy](custom-policies-series-branch-user-journey.md), you validated the *accessCode* by using a claims transformation. In this article, you validate the *accessCode* by making an HTTP call to an external service. So, you'll need to update your custom policy to reflect the new approach. 

Locate the *AccessCodeInputCollector* technical profile, and update the *ValidationTechnicalProfile* element's *ReferenceId* to *ValidateAccessCodeViaHttp*: 

from: 

```xml
    <ValidationTechnicalProfile ReferenceId="CheckAccessCodeViaClaimsTransformationChecker"/>
```
to: 

```xml
    <ValidationTechnicalProfile ReferenceId="ValidateAccessCodeViaHttp"/>
```
At this point, the Technical Profile with `Id` *CheckAccessCodeViaClaimsTransformationChecker* isn't needed, and can be removed. 


## Step 3 - Upload custom policy file

Make sure your Node.js app is running, and then follow the steps in [Upload custom policy file](custom-policies-series-hello-world.md#step-3---upload-custom-policy-file) to upload your policy file. If you're uploading a file with same name as the one already in the portal, make sure you select **Overwrite the custom policy if it already exists**.

## Step 4 - Test the custom policy

Follow the steps in [Test the custom policy](custom-policies-series-validate-user-input.md#step-6---test-the-custom-policy) to test your custom policy:

1. For **Account Type**, select **Personal Account**
1. Enter the rest of the details as required, and then select **Continue**. You'll see a new screen.
1. For **Access Code**, enter *88888*, and then select **Continue**. After the policy finishes execution, you're redirected to `https://jwt.ms`, and you see a decoded JWT token. If you repeat the procedure, and enter a different **Access Code**, other than *88888*, you'll see an error, **The access code you entered is incorrect. Please try again.**

## Step 5 - Enable debug mode

In development, you may want to see detailed errors sent by the API, such as *developerMessage* and *moreInfo*. In this case, you need to enable debug mode in your RESTful technical provider.

1. Locate your *ValidateAccessCodeViaHttp* technical provider, and add the following item in the technical provider's `metadata`: 

    ```xml
        <Item Key="DebugMode">true</Item>
    ```
1. Save the changes and [upload your policy file](#step-3---upload-custom-policy-file). 

1. [Test your custom policy](#step-4---test-the-custom-policy). Make sure you use a wrong input for your **Access Code**. You'll see an error similar to the one shown in the screenshot below.


    :::image type="content" source="media/custom-policies-series-call-rest-api/screenshot-error-enable-debug-mode.png" alt-text="A screenshot error when you enable debug mode."::: 
  
## Handle complex request JSON payloads

If the REST API that you call requires you to send a complex JSON payload, you can create the payload by using [GenerateJson JSON claims transformations](json-transformations.md#generatejson). Once you generate the payload, you can then [use `ClaimUsedForRequestPayload` metadata](restful-technical-profile.md#send-a-json-payload) option to the name of the claim containing the JSON payload. 

For example, use the following claims transformation to generate a JSON payload:

```xml
    <ClaimsTransformation Id="GenerateRequestBodyClaimsTransformation" TransformationMethod="GenerateJson">
        <InputClaims>
            <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="customerEntity.email" />
            <InputClaim ClaimTypeReferenceId="objectId" TransformationClaimType="customerEntity.userObjectId" />
            <InputClaim ClaimTypeReferenceId="givenName" TransformationClaimType="customerEntity.firstName" />
            <InputClaim ClaimTypeReferenceId="surname" TransformationClaimType="customerEntity.lastName" />
            <InputClaim ClaimTypeReferenceId="accessCode" TransformationClaimType="customerEntity.accessCode" />
        </InputClaims>
        <InputParameters>
            <InputParameter Id="customerEntity.role.name" DataType="string" Value="Administrator" />
            <InputParameter Id="customerEntity.role.id" DataType="long" Value="1" />
        </InputParameters>
        <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="requestBodyPayload" TransformationClaimType="outputClaim" />
        </OutputClaims>
    </ClaimsTransformation>
```  

The ClaimsTransformation generates the following JSON object:

```json
{
   "customerEntity":{
      "email":"john.s@contoso.com",
      "userObjectId":"01234567-89ab-cdef-0123-456789abcdef",
      "firstName":"John",
      "lastName":"Smith",
      "accessCode":"88888",
      "role":{
         "name":"Administrator",
         "id": 1
      }
   }
}
```

Then, update the *Metadata*, *InputClaimsTransformations*, and *InputClaims* of your RESTful technical provider as shown below: 

```xml
    <Metadata>
        <Item Key="ClaimUsedForRequestPayload">requestBodyPayload</Item>
        <!--Other Metadata items -->
    </Metadata>
    
    <!--Execute your InputClaimsTransformations to generate your request Payload-->
    <InputClaimsTransformations>
        <InputClaimsTransformation ReferenceId="GenerateRequestBodyClaimsTransformation" />
    </InputClaimsTransformations>
    
    <InputClaims>
        <InputClaim ClaimTypeReferenceId="requestBodyPayload" />
    </InputClaims>
```

## Receive data from REST API

If your REST API returns data, which you want to include as claims in your policy, you can receive it by specifying claims in the `OutputClaims` element of the RESTful technical profile. If the name of the claim defined in your policy is different from the name defined in the REST API, you need to map these names by using the `PartnerClaimType` attribute. 

Use the steps in [Receiving data](api-connectors-overview.md?pivots=b2c-custom-policy#receiving-data) to learn how to format the data the custom policy expects, how to handle nulls values, and how to parse REST the API's nested JSON body.

## Next steps

Next, learn:

- About [JSON claims transformations](json-transformations.md).
 
- About [RESTful technical profile](restful-technical-profile.md).

-  How to [Create and read a user account by using Azure Active Directory B2C custom policy](custom-policies-series-store-user.md)