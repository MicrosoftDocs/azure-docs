---
title: Protect SPA backend with OAuth 2.0 by using Azure Active Directory B2C and Azure API Management.
description: Protect an API with OAuth 2.0 by using Azure Active Directory B2C, Azure API Management and Easy Auth to be called from a JavaScript SPA using the PKCE enabled SPA Auth Flow.

services: api-management, azure-ad-b2c, app-service
documentationcenter: ''
author: WillEastbury
manager: alberts
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/18/2021
ms.author: wieastbu
ms.custom: fasttrack-new, fasttrack-update, devx-track-js
---

# Protect SPA backend with OAuth 2.0, Azure Active Directory B2C and Azure API Management

This scenario shows you how to configure your Azure API Management instance to protect an API.
We'll use the Azure AD B2C SPA (Auth Code + PKCE) flow to acquire a token, alongside API Management to secure an Azure Functions backend using EasyAuth.

## Aims

We're going to see how API Management can be used in a simplified scenario with Azure Functions and Azure AD B2C. You will create a JavaScript (JS) app calling an API, that signs in users with Azure AD B2C. Then you'll use API Management's validate-jwt, CORS, and Rate Limit By Key policy features to protect the Backend API.

For defence in depth, we then use EasyAuth to validate the token again inside the back-end API and ensure that API management is the only service that can call

## Prerequisites

To follow the steps in this article, you must have:

* An Azure (StorageV2) General Purpose V2 Storage Account to host the frontend JS Single Page App. Deploy this with [Static Website](https://docs.microsoft.com/azure/storage/blobs/storage-blob-static-website) feature "Enabled".
* An Azure API Management instance (Any tier will work, including 'Consumption')
* An empty Azure Function app (running the V3.1 .NET Core runtime, on a Consumption Plan) to host the called API
* An Azure AD B2C tenant, linked to a subscription.

Although in practice you would use resources in the same region in production workloads, for this how-to article the region of deployment isn't important.

## Overview

Here is an illustration of the components in use and the flow between them once this process is complete.
![Components in use and flow](../api-management/media/howto-protect-backend-frontend-azure-ad-b2c/image-arch.png "Components in use and flow")

Here is a quick overview of the steps:

1. Create the Azure AD B2C Calling (Frontend, API Management) and API Applications with scopes and grant API Access
1. Create the sign up or sign in policies to allow users to sign in with Azure AD B2C 
1. Configure API Management with the new Azure AD B2C Client IDs and keys to Enable OAuth2 user authorization in the Developer Console
1. Build the Function API
1. Configure the Function API to enable EasyAuth with the new Azure AD B2C Client ID’s and Keys and lock down to APIM VIP
1. Build the API Definition in API Management
1. Set up Oauth2 for the API Management API configuration
1. Set up the **CORS** policy and add the **validate-jwt** policy to validate the OAuth token for every incoming request
1. Build the calling application to consume the API
1. Upload the JS SPA Sample
1. Configure the Sample JS Client App with the new Azure AD B2C Client ID’s and keys 
1. Test the Client Application

## Configure the Backend Application

Open the Azure AD B2C blade in the portal and do the following steps.

1. Select the **App Registrations** tab
1. Click the 'New Registration' button.
1. Choose 'Web Application' from the Redirect URI selection box.
1. Now set the Display Name, choose something unique and relevant to the service being created, in this example use the name "Backend Application".
1. Use placeholders for the reply urls for now such as https://jwt.ms (A Microsoft owned token inspection site), we’ll update those urls later.
1. Ensure you have selected the "Accounts in any identity provider or organizational directory (for authenticating users with user flows)" option
1. For this example it is not required to leave the "Grant admin consent" box ticked, as we will not require offline_access or openid permissions
1. Click 'Create'.
1. Select the *Certificates and Secrets* tab (under Manage) then click 'New Client Secret' to generate an auth key.
1. Upon clicking 'Add', copy the key somewhere safe for later use - note that this place is the ONLY chance will you get to view and copy this key.
1. Now select the *Expose an API* Tab (Under Manage).
1. You will be prompted to set the AppID URI, select and record the default value.
1. Create and name a scope for your Function API and record the Scope and populated Full Scope Value, then click 'Add Scope'. E.g. "accessapp" scope.

   > [!NOTE]
   > Azure AD B2C scopes are effectively permissions within your API that other applications can request access to via the API access blade from their applications, effectively you just created application permissions for your called API.

## Configure the Frontend Application

1. Select the **App Registrations** tab
1. Click the 'New Registration' button.
1. Choose 'Single Page Application (SPA)' from the Redirect URI selection box.
1. Now set the Display Name and AppID URI, choose something unique and relevant to the Frontend application that will use this AAD B2C app registration. In this example you can use "Frontend Application"
1. As per the first app registration leave the supported account types selection to default (authenticating users with user flows)
1. Use placeholders for the reply urls for now such as https://jwt.ms (A Microsoft owned token inspection site), we’ll update those urls later.
1. Leave the grant admin consent box ticked
1. Click 'Create'.
1. Switch to the *API Permissions* tab.
1. Grant access to the backend application by clicking 'Add a permission', then 'My APIs', select the 'Backend Application', select 'Permissions', click 'Add permissions'.
1. Click 'Grant admin consent for {tenant} and click 'Yes' from the popup dialog. This consents the "Frontend Application" to use the permission "accessapp" defined in the "Backend Application" created earlier.
1. All Permissions should now show for the app as a green tick under the status column

## Create a "Sign up or Sign in" user flow

1. Return to the root of the B2C blade.
1. Switch to the 'User Flows' (Under Policies) tab.
1. Click "New user flow"
1. Choose the 'Sign up and sign in' user flow type, and select 'Recommended'.
1. Give the policy a name and record it for later. For this example you can use "Frontendapp_signupandsignin"
1. Under 'Identity providers' and "Local accounts", check 'Email sign up' and click OK. This is because we'll be registering local B2C accounts, not deferring to another identity provider (e.g. a social identity provider) to utilise a users existing social media account, for example.
1. Leave the MFA and conditional access settings at their defaults.
1. Under 'User Attributes and claims', click 'Show More...' then choose the claim options that you want your users to enter and have returned in the token. Check at least 'Display Name' and 'Email Address' to collect, with 'Display Name' and 'Email Addresses' to return (pay careful attention to the fact that you are collecting emailaddress, singular, and asking to return email addresses, multiple), and click 'OK', then click 'Create'.
1. Click on the policy that you created in the list, then click the 'Run user flow' button.
1. This action will open the run user flow blade, select the frontend application, copy the user flow endpoint and save it for later.
1. Click on the link at the top to open the 'well-known openid configuration endpoint', this should open a new broswer tab, and record the authorization_endpoint and token_endpoint values as well of the value of the link itself as the well-known openid configuration endpoint.

   > [!NOTE]
   > B2C Policies allow you to expose the Azure AD B2C login endpoints to be able to capture different data components and sign in users in different ways.
   > In this case we configured a sign up or sign in flow (policy). This also exposed a well-known configuration endpoint, in both cases our created policy was identified in the URL by the "p=" query string parameter.
   > Once this is done, you now have a functional Business to Consumer identity platform that will sign users into multiple applications.

## Build the function API

1. Switch back to your standard Azure AD tenant in the Azure portal so we can configure items in your subscription again.
1. Go to the Function Apps blade of the Azure portal, open your empty function app, then click 'Functions', click 'Add'.
1. In the flyout that appears, choose 'Develop in portal', under 'select a template' then choose 'http trigger', name it 'hello', with authorization level 'function' then click save.
1. Switch to the Code + Test blade and copy-paste the sample code from below *over the existing code* that appears.

   ```csharp
   
   using System.Net;
   using Microsoft.AspNetCore.Mvc;
   using Microsoft.Extensions.Primitives;
   
   public static async Task<IActionResult> Run(HttpRequest req, ILogger log)
   {
      log.LogInformation("C# HTTP trigger function processed a request.");
      
      return (ActionResult)new OkObjectResult($"Hello World, time and date are {DateTime.Now.ToString()}");
   }
   
   ```

   > [!NOTE]
   > The c# script function code you just pasted simply logs a line to the functions logs, and returns the text "Hello World" with some dynamic data (the date and time).

1. Select “Integrations” from the left-hand blade, then click the http (req) link inside the 'Trigger' box.
1. Uncheck the http POST method, leaving only GET selected, then click Save.
1. Switch back to the Code + Test tab, click 'Get Function URL', then copy the URL that appears. Save this for later.

   > [!NOTE]
   > The bindings you just created simply tell Functions to respond on anonymous http GET requests to the URL you just copied. (`https://yourfunctionappname.azurewebsites.net/api/hello?code=secretkey`)
   > Now we have a scalable serverless https API, that is capable of returning a very simple payload.
   > You can now test calling this API from a web browser using your version of the URL above that you just copied and saved. You can also remove the query string parameters "?code=secret" portion of the URL , and test again, to prove that Azure Functions will return a 401 error.

## Configure and secure the function API

1. Two extra areas in the function app need to be configured (Authorization and Network Restrictions).
1. Firstly Let's configure Authentication / Authorization, so navigate back to the overview tab.
1. Next select 'Authentication / Authorization' (under 'Settings').
1. Turn on the App Service Authentication feature.
1. Under 'Authentication Providers' choose ‘Azure Active Directory’.
1. Set the Action to take when request is not authenticated dropdown to "Log in with Azure Active Directory".
1. Choose ‘Advanced’ from the Management Mode switch.
1. Paste the Backend application's [Application] Client ID (from Azure AD B2C) into the ‘Client ID’ box
1. Paste the Well-known open-id configuration endpoint from the sign up or sign in policy into the Issuer URL box (we recorded this configuration earlier).
1. Leave [Token Store](https://docs.microsoft.com/azure/app-service/overview-authentication-authorization#token-store) enabled under advanced settings (default).
1. Click 'Show Secret' and past the Backend application's client secret into the appropriate box.
1. Select OK, which takes you back to the identity provider selection blade/screen and click 'Save' (at the top left of the blade).

   > [!NOTE]
   > Now your Function API is deployed and should throw 401 responses if the correct key is not supplied, and should return data when a valid request is presented.
   > You added additional defence-in-depth security in EasyAuth by configuring the 'Login With Azure AD' option to handle unauthenticated requests. Be aware that this will change the unauthorized request behaviour between the Backend Function App and Frontend SPA as EasyAuth will issue a 302 redirect to AAD instead of a 401 Not Authorized response, we will correct this by using API Management later.
   > We still have no IP security applied, if you have a valid key and OAuth2 token, anyone can call this from anywhere - ideally we want to force all requests to come via API Management.
   > If you are using APIM Consumption tier then [there isnt a dedicated APIM VIP](./api-management-howto-ip-addresses.md#ip-addresses-of-consumption-tier-api-management-service) to allow-list with the functions access-restrictions. In API Management Standard SKU and above [the VIP is single tenant and for the lifetime of the resource](./api-management-howto-ip-addresses.md#changes-to-the-ip-addresses) . For the Consumption tier, you can lock down your API calls via the shared secret function key.

1. Close the 'Authentication / Authorization' blade 
1. Select 'Networking' and then select 'Access Restrictions'
1. Next, lock down the allowed function app IPs to the API Management instance VIP. This VIP is shown in the API management - overview section of the portal under 'Virtual IP (VIP) addresses: public'.
1. If you want to continue to interact with the functions portal, and to carry out the optional steps below, you should add your own public IP address or CIDR range here too.
1. Once there’s an allow entry in the list, Azure adds an implicit deny rule to block all other addresses.

You'll need to add CIDR formatted blocks of addresses to the IP restrictions panel. When you need to add a single address such as the API Management VIP, you need to add it in the format xx.xx.xx.xx.

   > [!NOTE]
   > Now your Function API should not be callable from anywhere other than via API management, or your address.

1. Open the *API Management blade*, then open *your instance*.
1. Select the APIs Blade (under API).
1. From the 'Add a New API' pane, choose 'Function App', then select 'Full' from the top of the popup.
1. Click Browse, choose the function app you're hosting the API inside, and click select.
1. Give the API a name and description for API Management's internal use and add it to the ‘unlimited’ Product.
1. Make sure you record the base URL for later use and then click create.

   > [!NOTE]
   > If using the consumption tier of APIM the unlimited product will not be available as an out of the box. Instead, navigate to "Products" under "APIs" and hit "Add". > Type "Unlimited" as the product name and description and select the API you just added from the "+" APIs callout at the bottom left of the screen. Select the "published" checkbox. Leave the rest as default. Finally, hit the "create" button. This created the "unlimited" product and assigned it to your API. You can customize your new product later.

## Set up the **CORS** and **validate-jwt** policies

> The following sections should be followed regardless of the APIM tier being used. The storage account URL is from the storage account you will have made available from the prerequisites at the top of this article.

1. Switch back to the design tab and choose “All APIs”, then under "Inbound processing" click the code view button "</>" to show the policy editor.
1. Edit the inbound section and paste the below xml so it reads like the following.
1. Replace the following parameters in the Policy
1. {StorageAccountRootURL}, {b2cpolicy-well-known-openid}, {backend-api-application-client-id} with the correct values saved earlier
1. If you are using the Consumption tier of API Management, then you should remove both rate-limit-by-key policy as this policy is not available when using the Consumption tier of Azure API Management.

   ```xml
   <inbound>
      <cors allow-credentials="true">
            <allowed-origins>
                <origin>{StorageAccountRootURL}</origin>
            </allowed-origins>
            <allowed-methods preflight-result-max-age="120">
                <method>GET</method>
            </allowed-methods>
            <allowed-headers>
                <header>*</header>
            </allowed-headers>
            <expose-headers>
                <header>*</header>
            </expose-headers>
        </cors>
      <validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid." require-expiration-time="true" require-signed-tokens="true" clock-skew="300">
         <openid-config url="{b2cpolicy-well-known-openid}" />
         <required-claims>
            <claim name="aud">
               <value>{backend-api-application-client-id}</value>
            </claim>
         </required-claims>
      </validate-jwt>
      <rate-limit-by-key calls="300" renewal-period="120" counter-key="@(context.Request.IpAddress)" />
      <rate-limit-by-key calls="15" renewal-period="60" counter-key="@(context.Request.Headers.GetValueOrDefault("Authorization","").AsJwt()?.Subject)" />
      <base />
   </inbound>
   ```

1. Edit the openid-config url to match your well-known Azure AD B2C endpoint for the sign up or sign in policy.
1. Edit the claim value to match the valid application ID, also known as a client ID for the backend API application and save.

   > [!NOTE]
   > Now API management is able respond to cross origin requests to JS SPA apps, and it will perform throttling, rate-limiting and pre-validation of the JWT auth token being passed BEFORE forwarding the request on to the Function API.

  Congratulations, you now have Azure AD B2C, API Management and Azure Functions working together to publish, secure AND consume an API!

   > [!NOTE]
   > If you are using the API Management consumption tier then instead of rate limiting by the JWT subject or incoming IP Address (Limit call rate by key policy is not supported today for the "Consumption" tier), you can Limit by call rate quota see [here](./api-management-access-restriction-policies.md#LimitCallRate).
   > As this example is a JavaScript Single Page Application, we use the API Management Key only for rate-limiting and billing calls. The actual Authorization and Authentication is handled by Azure AD B2C, and is encapsulated in the JWT, which gets validated twice, once by API Management, and then by the backend Azure Function.

## Build the JavaScript SPA to consume the API

1. Open the storage accounts blade in the Azure portal 
1. Select the account you created and select the 'Static Website' blade from the Settings section (if you don't see a 'Static Website' option, check you created a V2 account).
1. Set the static web hosting feature to 'enabled', and set the index document name to 'index.html', then click 'save'.
1. Note down the contents of the Primary Endpoint, as this location is where the frontend site will be hosted.

   > [!NOTE]
   > You could use either Azure Blob Storage + CDN rewrite, or Azure App Service - but Blob Storage's Static Website hosting feature gives us a default container to serve static web content / html / js / css from Azure Storage and will infer a default page for us for zero work.

## Upload the JS SPA sample

1. Still in the storage account blade, select the 'Containers' blade from the Blob Service section and click on the $web container that appears in the right-hand pane.
1. Save the code below to a file locally on your machine as index.html and then upload the file index.html to the $web container.

   ```html
    <!doctype html>
    <html lang="en">
    <head>
         <meta charset="utf-8">
         <meta http-equiv="X-UA-Compatible" content="IE=edge">
         <meta name="viewport" content="width=device-width, initial-scale=1">
    	 <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
    	 <script type="text/javascript" src="https://alcdn.msauth.net/browser/2.11.1/js/msal-browser.min.js"></script>
    </head>
    <body>
         <div class="container-fluid">
             <div class="row">
                 <div class="col-md-12">
    				<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    					<div class="container-fluid">
    						<a class="navbar-brand" href="#">Azure Active Directory B2C with Azure API Management</a>
    						<div class="navbar-nav">
    							<button class="btn btn-success" id="signinbtn"  onClick="login()">Sign In</a>
    						</div>
    					</div>
    				</nav>
                 </div>
             </div>
             <div class="row">
                 <div class="col-md-12">
                     <div class="card" >
    					<div id="cardheader" class="card-header">
    						<div class="card-text"id="message">Please sign in to continue</div>
    					</div>
    					<div class="card-body">
    						<button class="btn btn-warning" id="callapibtn" onClick="GetAPIData()">Call API</a>
    						<div id="progress" class="spinner-border" role="status">
    							<span class="visually-hidden">Loading...</span>
    						</div>
    					</div>
                     </div>
                 </div>
             </div>
         </div>
         <script lang="javascript">
    		// Just change the values in this config object ONLY.
    		var config = {
    			msal: {
    				auth: {
    					clientId: "{CLIENTID}", // This is the client ID of your FRONTEND application that you registered with the SPA type in AAD B2C
    					authority:  "{YOURAUTHORITYB2C}", // Formatted as https://{b2ctenantname}.b2clogin.com/tfp/{b2ctenantguid or full tenant name including onmicrosoft.com}/{signuporinpolicyname}
    					redirectUri: "{SPAHOSTINGADDRESS}", // The storage hosting address of the SPA, a web-enabled v2 storage account
    					knownAuthorities: ["{B2CTENANTDOMAIN}"] // {b2ctenantname}.b2clogin.com
    				},
    				cache: {
    					cacheLocation: "sessionStorage",
    					storeAuthStateInCookie: false 
    				}
    			},
    			api: {
    				scopes: ["{APISCOPEWITHFULLURI}"], // The scope that we request for the API from B2C, this should be the API scope you created on the BACKEND API.
    				backend: "{APIMBACKENDADDRESS}" // The location that we will call for the backend api, this should be hosted in API Management
    			},
    			runtime: {
    				account: "" // This is used at runtime, leave it blank.
    			}
    		}
    		document.getElementById("callapibtn").hidden = true;
    		document.getElementById("progress").hidden = true;
    		const myMSALObj = new msal.PublicClientApplication(config.msal);
    		myMSALObj.handleRedirectPromise().then((tokenResponse) => {
    			if(tokenResponse !== null){
    				console.log(tokenResponse.account);
    				config.runtime.account = tokenResponse.account.homeAccountId;
    				document.getElementById("message").innerHTML = "Welcome, " + tokenResponse.account.name;
    				document.getElementById("signinbtn").hidden = true;
    				document.getElementById("callapibtn").hidden = false;
    			}}).catch((error) => {console.log("Error Signing in:" + error);
    		});
    		function login() {
    			try {
    				myMSALObj.loginRedirect({scopes: config.api.scopes});
    			} catch (err) {console.log(err);}
    		}
    		function GetAPIData() {
    			document.getElementById("progress").hidden = false; 
    			document.getElementById("message").innerHTML = "Calling backend ... "
    			document.getElementById("cardheader").classList.remove('bg-success','bg-warning','bg-danger');
    			myMSALObj.acquireTokenSilent({scopes: config.api.scopes, account: config.runtime.account}).then(tokenResponse => {
    				const headers = new Headers();
    				headers.append("Authorization", `Bearer ${tokenResponse.accessToken}`);
    				fetch(config.api.backend, {method: "GET", headers: headers})
    					.then(async (response)  => {
    						if (!response.ok)
    						{
    							document.getElementById("message").innerHTML = "Error: " + response.status + " " + JSON.parse(await response.text()).message;
    							document.getElementById("cardheader").classList.add('bg-warning');
    						}
    						else
    						{
    							document.getElementById("cardheader").classList.add('bg-success');
    							document.getElementById("message").innerHTML = await response.text();
    						}
    						}).catch(async (error) => {
    							document.getElementById("cardheader").classList.add('bg-danger');
    							document.getElementById("message").innerHTML = "Error: " + error;
    						});
    			}).catch(error => {console.log("Error Acquiring Token Silently: " + error);
    			return myMSALObj.acquireTokenRedirect(tokenRequest)
    			});
    			document.getElementById("progress").hidden = true;
             }
         </script>
     </body>
    </html>
   ```

1. Browse to the Static Website Primary Endpoint you stored earlier in the last section.

   > [!NOTE]
   > Congratulations, you just deployed a JavaScript Single Page App to Azure Storage Static content hosting.
   > Since we haven’t configured the JS app with your Azure AD B2C details yet – the page will not work yet if you open it.

## Configure the JS SPA for Azure AD B2C

1. Now we know where everything is: we can configure the SPA with the appropriate API Management API address and the correct Azure AD B2C application / client IDs.
1. Go back to the Azure portal storage blade and click on index.html, then choose ‘Edit’.
1. Update the auth values in the msal config section to match your *front-end* application you registered in B2C earlier. Use the code comments for hints on how the config values should look
1. Set the api values up to match your backend address (The api backend value can be found in the API Management test pane for the API operation, the 'b2cScopes' values were recorded earlier for the *backend application*).

1. Click Save

## Set the redirect URIs for the Azure AD B2C frontend app

1. Open the Azure AD B2C blade and navigate to the application registration for the JavaScript Frontend Application.
1. Set the redirect URL to the one you noted down when you previously set up the static website primary endpoint above.

   > [!NOTE]
   > This configuration will result in a client of the frontend application receiving an access token with appropriate claims from Azure AD B2C.
   > The SPA will be able to add this as a bearer token in the https header in the call to the backend API.
   > API Management will pre-validate the token, rate-limit calls to the endpoint by both the subject of the JWT issued by Azure ID (the user) and by IP address of the caller (depending on the service tier of API Management, see the note above), before passing through the request to the receiving Azure Function API, adding the functions security key.
   > The SPA will render the response in the browser.

   > *Congratulations, you’ve configured Azure AD B2C, Azure API Management, Azure Functions, Azure App Service Authorization to work in perfect harmony!*

Now we have a simple app with a simple secured API, let's test it.

## Test the client application

1. Open the sample app URL that you noted down from the storage account you created earlier.
1. Click “Sign In” in the top-right-hand corner, this click will pop up your Azure AD B2C sign up or sign in profile.
1. The app should welcome you by your B2C profile name.
1. Now Click "Call API", and you the page should update with the values sent back from your secured API.
1. If you *repeatedly* click the Call API button and you are running in the developer tier or above of API Management, you should note that your solution will begin to rate limit the API and this should be reported in the app.

## And we're done

The steps above can be adapted and edited to allow many different uses of Azure AD B2C with API Management.

## Next steps

* Learn more about [Azure Active Directory and OAuth2.0](../active-directory/develop/authentication-vs-authorization.md).
* Check out more [videos](https://azure.microsoft.com/documentation/videos/index/?services=api-management) about API Management.
* For other ways to secure your back-end service, see [Mutual Certificate authentication](api-management-howto-mutual-certificates.md).
* [Create an API Management service instance](get-started-create-service-instance.md).
* [Manage your first API](import-and-publish.md).
