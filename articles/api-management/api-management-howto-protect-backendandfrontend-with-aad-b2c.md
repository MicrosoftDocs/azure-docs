---
title: Protect an API and flow custom claims by using OAuth 2.0 with Azure Active Directory and API Management | Microsoft Docs
description: Protect an API by using OAuth 2.0 with Azure Active Directory B2C, API Management and Azure App Service Easy Auth and call it from a JavaScript Single Page App

.
services: api-management
documentationcenter: ''
author: wieastbu
manager: glsmall
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/14/2018
ms.author: wieastbu
---

# Protect an API by using OAuth 2.0 with Azure Active Directory B2C, API Management and Azure App Service Easy Auth and call it from a JavaScript Single Page App

This guide shows you how to configure your Azure API Management instance to protect an API, by using the OAuth 2.0 protocol with Azure Active Directory (Azure AD) B2C, and how to flow claims data through API management to be used into a backend function. 

## Aims
The idea of this document is to show how API-Management can be used in a real world scenario with the Azure Functions and AAD B2C services to capture additional data and flow it through API Management.
The basic premise of the document is that there is a JavaScript Single Page Application calling through and retrieving data from the API about the user, in practice you will use this data in the function API tier to feed into some kind of business logic, 
in this case we will simply record a CRMID field as a custom attribute and flow it through API-management to secure the API and validate the JWT in flight.
The ‘logged in as’ is picked up from the client side token when we log in, the ‘Custom Claim’ comes back from the Azure Function code to show that we can decipher the token and use the claim in the function’s business logic.

## Prerequisites
To follow the steps in this article, you must have:
* An Azure v2 Storage Account to host the frontend JS Single Page App
* An API Management instance
* An empty Function app (v1 runtime) to host the back end API (sample code provided)
* An Azure AD B2C tenant, linked to a subscription 

## Overview

Here is a quick overview of the steps:

1. Create the AAD B2C User Attributes to capture the custom claims
2. Create the AAD Calling (Frontend, API-M) and API Applications with scopes and grant API Access
3. Create the Signup or signin policies to allow users to login with AAD B2C
4. Configure API Management with the new AAD B2C Client IDs and keys to Enable OAuth 2.0 user authorization in the Developer Console
5. Build the Function API
6. Configure the Function API to enable EasyAuth with the new AAD B2C Client ID’s and Keys and lock down to APIM VIP 
7. Build the API Definition in API Management
8. Set up Oauth2 for the API-M API configuration
9. Setup CORS and Add the **validate-jwt** policy to validate the OAuth token for every incoming request.
10. Setup the custom claim data
11. Test the API from the APIM Portal 
12. Build the calling application to consume the API
13. Upload the JS SPA Sample
14. Configure the Sample JS Client App with the new AAD B2C Client ID’s and keys 
15. Configure the Function API to serve as a useful reminder countdown
16. Test the Client Application

# Create the AAD B2C User Attributes to capture the custom claims

Before we can capture and flow any custom claims or register the applications that we intend to use, we need to create the AAD B2C user attributes inside the AAD B2C tenant, effectively you just created and assigned application permissions for your calling API.

1. Open the Azure Portal, switch your tenant to the AAD B2C tenant and browse to the **Azure Active Directory B2C** blade 
2. Select the **Overview** tab and record the domain name of the tenant for later use.
3. Select the **User Attributes** tab and add a custom string attribute called CRM_ID of type string

> [!NOTE]
> Custom attributes are accessible from AAD B2C policies and are returned optionally as claims in the auth token that is issued, this is a convenient way of securely storing additional metadata about users in AAD B2C.
> You can also manipulate and read this data as an administrator using the AAD Graph API.

# Create the AAD Calling (Frontend, API-M) and Backend API Applications with scopes and grant API Access

1. Select the **Applications** tab 
2. Click the 'Add' button and create 3 applications
* The Frontend Client, 
* The Backend Function API,
* The API-Management developer portal (unless you are running APIM in consumption mode)

3. Use placeholders for the reply urls for now, we’ll update those later.
4. For the App ID URI simply choose something unique and relevant to the service being created.
5. Set WebApp/ Web API and Allow Implicit flow to yes
6. Record the AppID URI, name and Application ID for later use for all 3 apps.

7. Open the Backend API from the list of applications and select the *Keys* tab (under General) to generate an auth key
8. Record the key somewhere safe for later use
9. Now select the *Published Scopes* Tab (Under API Access)
10. Create and name a scope for your Function API 

> [!NOTE]
> AAD B2C scopes are effectively permissions within your API that other applications can request access to via the API access blade from their applications, effectively you just created and assigned application permissions for your calling API.

11. Open the other 2 applications and under the *API Access* tab, grant them access to the backend API scope (that you just created) and the default one that was already there ("login as user") 
12. Generate them a key each (select the *Keys* tab (under General) to generate an auth key) whilst you are here and record those somewhere safe too.

# Create a "Signup or signin" policy to allow users to login with AAD B2C
1. Return to the root of the AAD B2C Blade 
2. Then select “Sign-up or Sign-in Policies” and click ‘add’
3. Give the policy a name (and record it for later) and select 'Identity providers', then check User ID signup and click OK. 
4. Select 'Signup attributes' and choose the registration options that you want your customers to enter (At a minimum, choose Email, Display Name and Country/Region), then click OK.
5. Select 'Application Claims' and choose 'Country/Region', 'Display Name', CRM_ID, 'User's Object ID' and 'User is new', then click OK.
6. Click OK again to return to the main AAD B2C blade, now select the policy you just created in the list to re-open it, then record the address of the b2clogin.com domain from the .
7. Click on the link at the top for the well-known openid confguration endpoint and record the authorization_endpoint and token_endpoint values from the opened document.

> [!NOTE]
> B2C Policies allow you to expose the AAD B2C login endpoints to be able to capture different data components and log in users in different ways
> In this case we configured a sign up and sign in endpoint, which exposed a well-known condfiguration endpoint, specifically our created policy was identified in the URL by the p= parameter
> Once this is done – you now have a functional Business to Consumer identity platform that will sign users into multiple applications. 
> If you want to you can click 'run now' here to go through the sign up and sign in process and get a feel for what it will do in practice, but the redirection step at the end will fail as we haven't yet configured this.

# [Optional] Configure API Management with the new AAD B2C Client IDs and keys to to Enable OAuth 2.0 user authorization in the Developer Console
1. Switch back to your standard AAD tenant in the Azure portal and open the *API management blade*, then open *your instance*.
2. Note down the *Virtual IP (VIP) address* of the instance, and optionally the *developer portal URL* and record them for later.
3. Next, Select the Oauth 2.0  blade from the Security Tab, and click 'Add'
4. Give sensible values for *Display Name* and *Description*
5. You can enter any value in the Client registration page URL, as we will not use it here
6. Check the *Authorization code* and *Implicit Auth* Grant types
7. In the *Authorization* and *Token* endpoint fields enter the values you captured from the well-known configuration xml document earlier.
8. Scroll down and populate an *Additional body parameter* called 'resource' with the Back end Function API client ID from the AAD B2C App registration
9. Set the Client credentials section upSet the Client ID to the APIM Developer console app's application ID and set the Client Secret to the APIM developer console app's Key) 
10. Lastly, now record the redirect_uri of the auth code grant from APIM 'This is what the redirect_uri for authorization code grant looks like' for later use.

> [!NOTE]
> Now we have an API Management instance that knows how to get access tokens from AAD B2C to authorize requests through the developer portal for testing.

# Build the Function API
1. Go to the Function Apps blade of the azure portal, open the function app and create a new http triggered C# function,
2. Set it’s name to HttpTriggerC# and it’s auth level to Anonymous (we will secure this, but not by using a function key or admin key).
3. Paste the sample code from this link into Run.csx over the existing code that appears.

> [!NOTE]
> The function code you just pasted simply decodes the JWT token validated by both APIM and App Service Authentication / Authorization, extracts our custom attribute from the extension claim and generates a response back to the JS SPA.

4. Select “Integrate” from the left-hand blade, then select ‘Advanced Editor’.
5. Paste the sample code over the existing json that appears to remove the post method and add the custom route to make the API respond on {http://fnappname.azurewebsites.net/api/celebration}, then click save

> [!NOTE]
> The bindings you just created simply tell Functions to respond on http GET requests to the URI https://<functionappname>.azurewebsites.net/api/celebration 

6. Reselect the HttpTriggerCSharp1 item from the list on the left hand side, then select the ‘View Files’ tab on the right hand side.
7. Click ‘Add’ and name the file project.json, an empty file will be created.
8. Post the sample code into that file and click save.

> [!NOTE]
> The project.json file you just pasted tells Functions that your project has a dependency on the nuget package "System.IdentityModel.Tokens.Jwt" of version 5.0 or above, and that it should perform a nuget package restore.

> [!NOTE]
> Now we have a very simplistic backend serverless http API, that is capable of validating tokens and returning a simple payload.
> Basically all this function does is checks a few claims on the provided access token and returns some static data for the website to render.
> You should see something like this returned if you are correctly signed in and the value of cclaim_CRM should be set to the custom claim we defined in the AAD B2C configuration, 
> note that if you haven’t set this claim – then the API should throw a 403 Forbidden message at you see the profile editing policy section, if the token is not present then APIM should throw a 401 Unauthorized message.
>{
>   "date":"20181014",
>   "location":"Whatever you choose as the location",
>   "time":"1400",
>   "cclaim_CRM":"Will001"
>}

# Configure the Function API to enable EasyAuth with the new AAD B2C Client ID’s and Keys and lock down to APIM VIP 
1. Two extra areas in the function app need to be configured (Auth and Network Restrictions).
2. Firstly Let's configure Authentication / Authorization, so click on the name of the function app (next to the <Z> icon to show the overview page.
3. Next Select the 'Platform features' tab and select 'Authentication / Authorization'.
4. Turn the App Service Authentication feature on, but leave anonymous requests allowed (We’ll block them, but don’t want random redirects interfering with debugging at the moment)
5. Under 'Authentication Providers' choose ‘Azure Active Directory’, and choose ‘Advanced’ from the Management Mode switch.
6. Paste the BACKEND API's application ID (from AAD B2C into the ‘Client ID’ box)
7. Paste the Well-known open-id configuration from the signup/signin policy into the Issuer URL box (we recorded this earlier).

> [!NOTE]
> Now your Function API is deployed and should throw 401 or 403 errors for unauthorized requests, and should return data when a valid request is presented.
> But we still have no IP security, if you have a valid token you can call this from anywhere - we want to force all requests to come via API Management.

8. Close the 'Authentication / Authorization' blade 
9. Select 'Networking' and then select 'IP Restrictions'
10. We need to lock down the IP ranges of the allowed callers to the function app to be the IP Address of the API management instance VIP (Found on the API management overview page in the portal) and if you want to interact with the functions portal, you will need to add your public IP address / range here too.
11. Once there is an allow entry in the list, there is an implicit deny rule to block all other addresses, also be aware that you have to add CIDR blocks of addresses to the IP restrictions panel, so if you need to add a single address (such as the API Management VIP), you need to add it in the format xx.xx.xx.xx/32

> [!NOTE]
> Now your Function API should not be callable from anywhere other than via API management, or your address.

# Import the Function App as an API Definition in API Management
1. Open the API Management portal blade and select your API Management instance.
2. Select the APIs Blade from the API Management section of your instance.
3. From the 'Add a New API' pane, choose 'Function App', then select 'Full' from the top of the popup.
4. Click Browse, choose the function app you are hosting the API inside, and click select.
5. Give the api a sensible set of names and descriptions and add it to the ‘unlimited’ Product.
6. Make sure you record the base URL for later use and then click create.

# Set up Oauth2 for the API-M API configuration
1. Your API will appear on the left hand side of the portal under the 'All APIs' section, open your API by clicking on it.
2. Select the 'Settings' Tab.
3. Update your settings by selecting “Oauth 2.0” from the user authorization radio button.
4. Select the OAuth server that you defined earlier.
5. Check the ‘Override scope’ checkbox and enter the scope you recorded for the BACKEND API call earlier on.

# Configure the redirect URIs for the Application Registrations in B2C
1. Open the AAD B2C blade and navigate to the application registration for the Developer Portal
2. Set the 'Reply URL' entry to the one you noted down when you configured the redirect_uri of the auth code grant in API Management earlier.

> The following section does not apply to the **Consumption** tier, which does not support the developer portal.

Now that the OAuth 2.0 user authorization is enabled on the `Echo API`, the Developer Console obtains an access token on behalf of the user, before calling the API.

1. Browse to any operation under the `Echo API` in the developer portal, and select **Try it**. This brings you to the Developer Console.
2. Note a new item in the **Authorization** section, corresponding to the authorization server you just added.
3. Select **Authorization code** from the authorization drop-down list, and you are prompted to sign in to the Azure AD tenant. If you are already signed in with the account, you might not be prompted.
4. After successful sign-in, an `Authorization` header is added to the request, with an access token from Azure AD. The following is a sample token (Base64 encoded):
   ```
   Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlNTUWRoSTFjS3ZoUUVEU0p4RTJnR1lzNDBRMCIsImtpZCI6IlNTUWRoSTFjS3ZoUUVEU0p4RTJnR1lzNDBRMCJ9.eyJhdWQiOiIxYzg2ZWVmNC1jMjZkLTRiNGUtODEzNy0wYjBiZTEyM2NhMGMiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC80NDc4ODkyMC05Yjk3LTRmOGItODIwYS0yMTFiMTMzZDk1MzgvIiwiaWF0IjoxNTIxMTUyNjMzLCJuYmYiOjE1MjExNTI2MzMsImV4cCI6MTUyMTE1NjUzMywiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhHQUFBQUptVzkzTFd6dVArcGF4ZzJPeGE1cGp2V1NXV1ZSVnd1ZXZ5QU5yMlNkc0tkQmFWNnNjcHZsbUpmT1dDOThscUJJMDhXdlB6cDdlenpJdzJLai9MdWdXWWdydHhkM1lmaDlYSGpXeFVaWk9JPSIsImFtciI6WyJyc2EiXSwiYXBwaWQiOiJhYTY5ODM1OC0yMWEzLTRhYTQtYjI3OC1mMzI2NTMzMDUzZTkiLCJhcHBpZGFjciI6IjEiLCJlbWFpbCI6Im1pamlhbmdAbWljcm9zb2Z0LmNvbSIsImZhbWlseV9uYW1lIjoiSmlhbmciLCJnaXZlbl9uYW1lIjoiTWlhbyIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0Ny8iLCJpcGFkZHIiOiIxMzEuMTA3LjE3NC4xNDAiLCJuYW1lIjoiTWlhbyBKaWFuZyIsIm9pZCI6IjhiMTU4ZDEwLWVmZGItNDUxMS1iOTQzLTczOWZkYjMxNzAyZSIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6IkFGaWtvWFk1TEV1LTNkbk1pa3Z3MUJzQUx4SGIybV9IaVJjaHVfSEM1aGciLCJ0aWQiOiI0NDc4ODkyMC05Yjk3LTRmOGItODIwYS0yMTFiMTMzZDk1MzgiLCJ1bmlxdWVfbmFtZSI6Im1pamlhbmdAbWljcm9zb2Z0LmNvbSIsInV0aSI6ImFQaTJxOVZ6ODBXdHNsYjRBMzBCQUEiLCJ2ZXIiOiIxLjAifQ.agGfaegYRnGj6DM_-N_eYulnQdXHhrsus45QDuApirETDR2P2aMRxRioOCR2YVwn8pmpQ1LoAhddcYMWisrw_qhaQr0AYsDPWRtJ6x0hDk5teUgbix3gazb7F-TVcC1gXpc9y7j77Ujxcq9z0r5lF65Y9bpNSefn9Te6GZYG7BgKEixqC4W6LqjtcjuOuW-ouy6LSSox71Fj4Ni3zkGfxX1T_jiOvQTd6BBltSrShDm0bTMefoyX8oqfMEA2ziKjwvBFrOjO0uK4rJLgLYH4qvkR0bdF9etdstqKMo5gecarWHNzWi_tghQu9aE3Z3EZdYNI_ZGM-Bbe3pkCfvEOyA
   ```
5. Select **Send**, and you can call the API successfully.

> [!NOTE]
> Now API management is able to acquire tokens for the developer portal to test your API and is able to understand it's definition and render the appropriate test page in the dev portal.

# Setup CORS and Add the **validate-jwt** policy to validate the OAuth token for every incoming request.
1. Switch back to the design tab and choose “All Operations”, then click the code view button to show the policy editor.
2. In the inbound section after <base/>, paste the following (but edit the url to match your well known B2C endpoint for the 
signin and sign up policy), (and edit the claim value to match the valid application id (or client ID) for the BACKEND API APPLICATION).

       <validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
            <openid-config url="https://williameastbury.b2clogin.com/williameastbury.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_MyDefaultPolicy" />
            <required-claims>
                <claim name="aud">
                    <value>85882f55-59d3-4f4e-af0a-f6cb6d169b01</value>
                </claim>
            </required-claims>
        </validate-jwt>
        <cors>
            <allowed-origins>
                <origin>*</origin>
            </allowed-origins>
            <allowed-methods>
                <method>GET</method>
            </allowed-methods>
            <allowed-headers>
                <header>*</header>
            </allowed-headers>
            <expose-headers>
                <header>*</header>
            </expose-headers>
        </cors>

> [!NOTE]
> Now API management is able respond to cross origin requests to JS SPA apps, and it will perform throttling, rate-limiting and pre-validation of the JWT auth token being passed BEFORE 
> forwarding the request on to the Function API.

# Setup the custom claim data
1. Since it’s unlikely you have setup the profile editing and AAD Graph API services yet, you will need to set up a profile editing policy to be able to actually set the Custom Claim we defined earlier.
2. Define a profile editing policy in the AAD B2C portal that includes your custom claim as both a profile attribute and a claim.
3. You can now go to the defined address to run the profile editing policy and set this claim to a value which will be stored by AAD B2C.

> [!NOTE]
> This is for configuring demo data only, YOU SHOULD NOT DO THIS IN A PRODUCTION SYSTEM otherwise users will be able to edit their own assigned profile attributes, when you look to productionize a system – ENSURE the custom claim is no longer an editable profile attribute.
> In normal production usage, you would set this value programmatically by using the AAD Graph API.
> For this walkthough you will need to do this, as the function app will throw a 403 forbidden error if the custom claim is not populated.
> For bonus points, of course you could try and set this through the AAD Graph API.

> The following section does not apply to the **Consumption** tier, which does not support the developer portal.
# Test the API from the API Management Developer Portal
1. From the overview blade of the API Management section of the Azure portal, click 'Developer Portal'
2. This should automatically log you into the developer portal as an administrator of the API, this is where you and other selected consumers of your API can test and call them without needing to build client software.
3. Select ‘Products’, then choose ‘Unlimited’, then choose the API we created earlier and click ‘TRY IT’
4. Unhide the API subscription key, and copy it somewhere safe along with the request url, you will need it later when we configure the application, 
5. Also select Implicit, from the oauth auth dropdown and you may have to authenticate here with a popup.
6. Click ‘Send’ and if all is well, your Function App should respond back with some Data from AAD B2C claims via API management with a 200 OK message and some JSON.

> [!NOTE]
> Congratulations, you now have AAD B2C, API Management and Azure Functions working together to publish, secure AND consume an API. 
> You might have noticed that the API is in fact secured twice using this method, once with the API Management Ocp-Subscription-Key Header, and once with the Authorization: Bearer JWT.
> You would be correct, as this example is a JavaScript Single Page Application, we use the API Management Key only for rate-limiting and billing calls.
> The actual Authorization and Authentication is handled by AAD B2C, and is encapsulated in the JWT, which gets validated twice, once by API Management, and then by App Service.
> If you have a secure channel for credentials (which a JS SPA is *not*) then in some circumstances just using the API Key to secure server to server communications is enough.

# Build the calling JavaScript Single Page Application to consume the API
1. Open the storage accounts blade in the Azure Portal
2. Create a new General Purpose V2 Storage Account
3. Select the account you just created and select the 'Static Website' blade from the Settings section 
4. Set the the static web hosting feature to 'enabled'
5. Note down the contents of the Primary Endpoint, as this is where the frontend site will be hosted.

> [!NOTE]
> You could use either Azure Blob Storage + CDN rewrite, or Azure App Service - but Blob Storage's Static Website hosting feature gives us a default container to serve static web content / html / js / css from Azure Storage and will infer a default page for us for zero work.

# Upload the JS SPA Sample
1. Still in the storage account blade, select the 'Blobs' blade from the Blob Service section and click on the $web container that appears in the right hand pane.
2. From the sample code, upload index.html to the $web container.
3. Browse to the Static Website Primary Endpoint you stored earlier in the last section.

[!NOTE]
> Congratulations, you just deployed a JavaScript Single Page App to Azure Storage
> Since we haven’t configured the JS app with your keys for the api or configured the JS app with your AAD B2C details yet – the page will look a little strange when you open it, nothing will be populated yet!

# Configure the Sample JS Client App with the new AAD B2C Client ID’s and keys 
1. Now we know where everything is: we can configure the SPA with the appropriate API Management API address and the correct AAD B2C application / client ID’s
2. Go back to the Azure portal storage blade and click on index.html, then choose ‘Edit Blob’ 
3. Scroll down to line 52 and update the details to match your FRONT END application that you registered in AAD B2C, noting that the b2cscopes are for the associated backend application that is being called (the API).
4. It should look something like this :-  

var applicationConfig = {			
clientID: 'the registered application id of the CLIENT OR FRONTEND Application in B2C’, // This represents the app obtaining the token
            	authority: "https://{tenant name}.b2clogin.com/tfp/{tenant URI}/{signinsignuppolicyname}", 
            	b2cScopes: [{an array of the scopes that you configured in AAD B2C for the BACKEND API}], // These are permissions you are asking for (to be able to call in the backend API)
	webApi: ‘{the actual address of the API when called through api management}’, // This was ‘request url’ in the developer portal
	subKey: '{the api-m subscription key you want to call them with}' // this was the value in ‘ocp-apim-subscription-key
        };

# Configure the redirect URIs for the Application Registrations in B2C
1. Open the AAD B2C blade and navigate to the application registration for the JavaScript Frontend Application
2. Set the redirect URL to the one you noted down when you setup the static website primary endpoint above

> [!NOTE] 
> This configuration will result in a client of the frontend application receiving an access token with appropriate claims from AAD B2C 
> The SPA will be able to add this as a bearer token in the https header in the call to the backend API.
> API Management will pre-validate the token, and rate-limit calls to the endpoint by the subscriber key, before passing through the request to the receiving Azure Function API.
> The Azure Function will extract the claim and render a sample reminder message back as a response.
> The SPA will render the response in the browser.
> *Congratulations, you’ve configured Azure Active Directory B2C, Azure API Management, Azure Functions, Azure App Service Authorization to work in perfect harmony, only one thing remains.*

# Configure the Function API to serve as a useful reminder countdown
1. Go back to the Function Apps blade in the Azure portal.
2. Open the Function App by selecting it from the list.
3. Open the source code for the function HttpTriggerC# in the editor by clicking on the name of the function.
4. Change the JSON Data highlighted in yellow and green returned by line 25 to be a significant future event for you.

string json = $"{{\"date\":\"20181014\",\"location\":\"Contoso Headquarters\",\"time\":\"1400\",\"cclaim\":\"{CustomClaimID}\"}}";

Where :- 
Date = an important date in YYYYMMDD format
Location = Where this will take place
Time = When it starts on that day in HHMM format

> [!NOTE]
> Now we have a simple app with an API that has a purpose, let's test it.

# Test the Client Application
1. Open the sample app URL that you noted down from the storage account you created earlier
2. Click “Login” in the top right hand corner, this should popup your B2C sign in / up profile.
3. Once complete the ‘logged in as’ section of the screen will be populated.
4. Now Click ‘Call Web Api’, and you should get a popup alert with the address of your API in it.
5. OK that and the screen should update with  a rolling countdown to your event
6. Also, note that your Custom Claim has been returned back by the API.

## And we're done, the steps above can be adapted and edited to allow many different uses of Azure AD B2C with API Management.

## Next steps
* Learn more about [Azure Active Directory and OAuth2.0](../active-directory/develop/authentication-scenarios.md).
* Check out more [videos](https://azure.microsoft.com/documentation/videos/index/?services=api-management) about API Management.
* For other ways to secure your back-end service, see [Mutual Certificate authentication](api-management-howto-mutual-certificates.md).

* [Create an API Management service instance](get-started-create-service-instance.md).

* [Manage your first API](import-and-publish.md).
