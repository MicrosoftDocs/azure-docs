---
title: Protect APIs in Azure API Management with Active Directory B2C
description: Protect a serverless API with OAuth 2.0 by using Azure Active Directory B2C, Azure API Management, and Easy Auth to be called from a JavaScript SPA using the PKCE enabled SPA Auth Flow.

services: api-management, azure-ad-b2c, app-service
documentationcenter: ''
author: WillEastbury
manager: alberts
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 02/18/2021
ms.author: wieastbu
ms.custom: fasttrack-new, fasttrack-update, devx-track-js
---

# Protect serverless APIs with Azure API Management and Azure AD B2C for consumption from a SPA

This scenario shows you how to configure your Azure API Management instance to protect an API.
We'll use the Azure AD B2C SPA (Auth Code + PKCE) flow to acquire a token, alongside API Management to secure an Azure Functions backend using EasyAuth.

For a conceptual overview of API authorization, see [Authentication and authorization to APIs in API Management](authentication-authorization-overview.md).


## Aims

We're going to see how API Management can be used in a simplified scenario with Azure Functions and Azure AD B2C. You'll create a JavaScript (JS) app calling an API, that signs in users with Azure AD B2C. Then you'll use API Management's validate-jwt, CORS, and Rate Limit By Key policy features to protect the Backend API.

For defense in depth, we then use EasyAuth to validate the token again inside the back-end API and ensure that API management is the only service that can call the Azure Functions backend.

## What will you learn

> [!div class="checklist"]
> * Setup of a Single Page App and backend API in Azure Active Directory B2C
> * Creation of an Azure Functions Backend API
> * Import of an Azure Functions API into Azure API Management
> * Securing the API in Azure API Management
> * Calling the Azure Active Directory B2C Authorization Endpoints via the Microsoft identity platform Libraries (MSAL.js)
> * Storing a HTML / Vanilla JS Single Page Application and serving it from an Azure Blob Storage Endpoint

## Prerequisites

To follow the steps in this article, you must have:

* An Azure (StorageV2) General Purpose V2 Storage Account to host the frontend JS Single Page App.
* An Azure API Management instance (Any tier will work, including 'Consumption', however certain features applicable to the full scenario aren't available in this tier (rate-limit-by-key and dedicated Virtual IP), these restrictions are called out below in the article where appropriate).
* An empty Azure Function app (running the V3.1 .NET Core runtime, on a Consumption Plan) to host the called API
* An Azure AD B2C tenant, linked to a subscription.

Although in practice you would use resources in the same region in production workloads, for this how-to article the region of deployment isn't important.

## Overview

Here's an illustration of the components in use and the flow between them once this process is complete.
![Components in use and flow](../api-management/media/howto-protect-backend-frontend-azure-ad-b2c/image-arch.png "Components in use and flow")

Here's a quick overview of the steps:

1. Create the Azure AD B2C Calling (Frontend, API Management) and API Applications with scopes and grant API Access
1. Create the sign-up and sign-in policies to allow users to sign in with Azure AD B2C
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

   > [!TIP]
   > We're going to capture quite a few pieces of information and keys etc as we walk this document, you might find it handy to have a text editor open to store the following items of configuration temporarily.
   >
   > B2C BACKEND CLIENT ID:
   > B2C BACKEND CLIENT SECRET KEY:
   > B2C BACKEND API SCOPE URI:
   > B2C FRONTEND CLIENT ID:
   > B2C USER FLOW ENDPOINT URI:
   > B2C WELL-KNOWN OPENID ENDPOINT:
   > B2C POLICY NAME: Frontendapp_signupandsignin
   > FUNCTION URL:
   > APIM API BASE URL:
   > STORAGE PRIMARY ENDPOINT URL:

## Configure the backend application

Open the Azure AD B2C blade in the portal and do the following steps.

1. Select the **App Registrations** tab
1. Click the 'New Registration' button.
1. Choose 'Web' from the Redirect URI selection box.
1. Now set the Display Name, choose something unique and relevant to the service being created. In this example, we'll use the name "Backend Application".
1. Use placeholders for the reply urls, like 'https://jwt.ms' (A Microsoft owned token decoding site), we’ll update those urls later.
1. Ensure you have selected the "Accounts in any identity provider or organizational directory (for authenticating users with user flows)" option
1. For this sample, uncheck the "Grant admin consent" box, as we won't require offline_access permissions today.
1. Click 'Register'.
1. Record the Backend Application Client ID for later use (shown under 'Application (client) ID').
1. Select the *Certificates and Secrets* tab (under Manage) then click 'New Client Secret' to generate an auth key (Accept the default settings and click 'Add').
1. Upon clicking 'Add', copy the key (under 'value') somewhere safe for later use as the 'Backend client secret' - note that this dialog is the ONLY chance you'll have to copy this key.
1. Now select the *Expose an API* Tab (Under Manage).
1. You will be prompted to set the AppID URI, select and record the default value.
1. Create and name the scope "Hello" for your Function API, you can use the phrase 'Hello' for all of the enterable options, recording the populated Full Scope Value URI, then click 'Add Scope'.
1. Return to the root of the Azure AD B2C blade by selecting the 'Azure AD B2C' breadcrumb at the top left of the portal.

   > [!NOTE]
   > Azure AD B2C scopes are effectively permissions within your API that other applications can request access to via the API access blade from their applications, effectively you just created application permissions for your called API.

## Configure the frontend application

1. Select the **App Registrations** tab
1. Click the 'New Registration' button.
1. Choose 'Single Page Application (SPA)' from the Redirect URI selection box.
1. Now set the Display Name and AppID URI, choose something unique and relevant to the Frontend application that will use this Azure Active Directory B2C app registration. In this example, you can use "Frontend Application"
1. As per the first app registration, leave the supported account types selection to default (authenticating users with user flows)
1. Use placeholders for the reply urls, like 'https://jwt.ms' (A Microsoft owned token decoding site), we’ll update those urls later.
1. Leave the grant admin consent box ticked
1. Click 'Register'.
1. Record the Frontend Application Client ID for later use (shown under 'Application (client) ID').
1. Switch to the *API Permissions* tab.
1. Grant access to the backend application by clicking 'Add a permission', then 'My APIs', select the 'Backend Application', select 'Permissions', select the scope you created in the previous section, and click 'Add permissions'
1. Click 'Grant admin consent for {tenant} and click 'Yes' from the popup dialog. This popup consents the "Frontend Application" to use the permission "hello" defined in the "Backend Application" created earlier.
1. All Permissions should now show for the app as a green tick under the status column

## Create a "Sign-up and Sign-in" user flow

1. Return to the root of the B2C blade by selecting the Azure AD B2C breadcrumb.
1. Switch to the 'User Flows' (Under Policies) tab.
1. Click "New user flow"
1. Choose the 'Sign-up and sign-in' user flow type, and select 'Recommended' and then 'Create'
1. Give the policy a name and record it for later. For this example, you can use "Frontendapp_signupandsignin", note that this will be prefixed with "B2C_1_" to make "B2C_1_Frontendapp_signupandsignin"
1. Under 'Identity providers' and "Local accounts", check 'Email sign up' (or 'User ID sign up' depending on the config of your B2C tenant) and click OK. This configuration is because we'll be registering local B2C accounts, not deferring to another identity provider (like a social identity provider) to use a user's existing social media account.
1. Leave the MFA and conditional access settings at their defaults.
1. Under 'User Attributes and claims', click 'Show More...' then choose the claim options that you want your users to enter and have returned in the token. Check at least 'Display Name' and 'Email Address' to collect, with 'Display Name' and 'Email Addresses' to return (pay careful attention to the fact that you're collecting emailaddress, singular, and asking to return email addresses, multiple), and click 'OK', then click 'Create'.
1. Click on the user flow that you created in the list, then click the 'Run user flow' button.
1. This action will open the run user flow blade, select the frontend application, copy the user flow endpoint and save it for later.
1. Copy and store the link at the top, recording as the 'well-known openid configuration endpoint' for later use.

   > [!NOTE]
   > B2C Policies allow you to expose the Azure AD B2C login endpoints to be able to capture different data components and sign in users in different ways.
   >
   > In this case we configured a sign-up or sign in flow (policy). This also exposed a well-known configuration endpoint, in both cases our created policy was identified in the URL by the "p=" query string parameter.
   >
   > Once this is done, you now have a functional Business to Consumer identity platform that will sign users into multiple applications.

## Build the function API

1. Switch back to your standard Microsoft Entra tenant in the Azure portal so we can configure items in your subscription again.
1. Go to the Function Apps blade of the Azure portal, open your empty function app, then click 'Functions', click 'Add'.
1. In the flyout that appears, choose 'Develop in portal', under 'select a template' then choose 'HTTP trigger', under Template details name it 'hello' with authorization level 'Function', then select Add.
1. Switch to the Code + Test blade and copy-paste the sample code from below *over the existing code* that appears.
1. Select Save.

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

   > [!TIP]
   > The C# script function code you just pasted simply logs a line to the functions logs, and returns the text "Hello World" with some dynamic data (the date and time).

1. Select “Integration” from the left-hand blade, then click the http (req) link inside the 'Trigger' box.
1. From the 'Selected HTTP methods' dropdown, uncheck the http POST method, leaving only GET selected, then click Save.
1. Switch back to the Code + Test tab, click 'Get Function URL', then copy the URL that appears and save it for later.

   > [!NOTE]
   > The bindings you just created simply tell Functions to respond on anonymous http GET requests to the URL you just copied (`https://yourfunctionappname.azurewebsites.net/api/hello?code=secretkey`). Now we have a scalable serverless https API, that is capable of returning a very simple payload.
   >
   > You can now test calling this API from a web browser using your version of the URL above that you just copied and saved. You can also remove the query string parameters "?code=secretkey" portion of the URL , and test again, to prove that Azure Functions will return a 401 error.

## Configure and secure the function API

1. Two extra areas in the function app need to be configured (Authorization and Network Restrictions).
1. Firstly Let's configure Authentication / Authorization, so navigate back to the root blade of the function app via the breadcrumb.
1. Next select 'Authentication' (under 'Settings').
1. Click 'Add Identity Provider'
1. From the Identity Provider dropdown, select 'Microsoft'
1. For App Registration, select 'Provide the details of an existing app registration'
1. Paste the Backend application's client ID (from Azure AD B2C) into the ‘Application (client) ID’ box (we recorded this configuration earlier).
1. Paste the Well-known open-id configuration endpoint from the sign-up and sign-in policy into the Issuer URL box (we recorded this configuration earlier).
1. Paste the Backend application's client secret into the appropriate box (we recorded this configuration earlier).
1. For 'Unauthenticated requests', select 'HTTP 401 Unauthorized: recommended for APIs'
1. Leave [Token Store](../app-service/overview-authentication-authorization.md#token-store) enabled (default).
1. Click 'Save' (at the top left of the blade).

   > [!IMPORTANT]
   > Now your Function API is deployed and should throw 401 responses if the correct JWT isn't supplied as an Authorization: Bearer header, and should return data when a valid request is presented.
   > You added additional defense-in-depth security in EasyAuth by configuring the 'Login With Microsoft Entra ID' option to handle unauthenticated requests.
   >
   > We still have no IP security applied, if you have a valid key and OAuth2 token, anyone can call this from anywhere - ideally we want to force all requests to come via API Management.
   >
   > If you're using APIM Consumption tier then [there isn't a dedicated Azure API Management Virtual IP](./api-management-howto-ip-addresses.md#ip-addresses-of-consumption-tier-api-management-service) to allow-list with the functions access-restrictions. In the Azure API Management Standard SKU and above [the VIP is single tenant and for the lifetime of the resource](./api-management-howto-ip-addresses.md#changes-to-the-ip-addresses). For the Azure API Management Consumption tier, you can lock down your API calls via the shared secret function key in the portion of the URI you copied above. Also, for the Consumption tier - steps 12-17 below do not apply.

1. Close the 'Authentication' blade from the App Service / Functions portal.
1. Open the *API Management blade of the portal*, then open *your instance*.
1. Record the Private VIP shown on the overview tab.
1. Return to the *Azure Functions blade of the portal* then open *your instance* again.
1. Select 'Networking' and then select 'Configure access restrictions'
1. Click 'Add Rule', and enter the VIP copied in step 3 above in the format xx.xx.xx.xx/32.
1. If you want to continue to interact with the functions portal, and to carry out the optional steps below, you should add your own public IP address or CIDR range here too.
1. Once there’s an allow entry in the list, Azure adds an implicit deny rule to block all other addresses.

You'll need to add CIDR formatted blocks of addresses to the IP restrictions panel. When you need to add a single address such as the API Management VIP, you need to add it in the format xx.xx.xx.xx/32.

   > [!NOTE]
   > Now your Function API should not be callable from anywhere other than via API management, or your address.

1. Open the *API Management blade*, then open *your instance*.
1. Select the APIs Blade (under APIs).
1. From the 'Add a New API' pane, choose 'Function App', then select 'Full' from the top of the popup.
1. Click Browse, choose the function app you're hosting the API inside, and click select. Next, click select again.
1. Give the API a name and description for API Management's internal use and add it to the ‘unlimited’ Product.
1. Copy and record the API's 'base URL' and click 'create'.
1. Click the 'settings' tab, then under subscription - switch off the 'Subscription Required' checkbox as we'll use the Oauth JWT token in this case to rate limit. Note that if you're using the consumption tier, this would still be required in a production environment.

   > [!TIP]
   > If using the consumption tier of APIM the unlimited product won't be available as an out of the box. Instead, navigate to "Products" under "APIs" and hit "Add".
   > Type "Unlimited" as the product name and description and select the API you just added from the "+" APIs callout at the bottom left of the screen. Select the "published" checkbox. Leave the rest as default. Finally, hit the "create" button. This created the "unlimited" product and assigned it to your API. You can customize your new product later.

## Configure and capture the correct storage endpoint settings

1. Open the storage accounts blade in the Azure portal
1. Select the account you created and select the 'Static Website' blade from the Settings section (if you don't see a 'Static Website' option, check you created a V2 account).
1. Set the static web hosting feature to 'enabled', and set the index document name to 'index.html', then click 'save'.
1. Note down the contents of the 'Primary Endpoint' for later, as this location is where the frontend site will be hosted.

   > [!TIP]
   > You could use either Azure Blob Storage + CDN rewrite, or Azure App Service to host the SPA - but Blob Storage's Static Website hosting feature gives us a default container to serve static web content / html / js / css from Azure Storage and will infer a default page for us for zero work.

## Set up the **CORS** and **validate-jwt** policies

> The following sections should be followed regardless of the APIM tier being used. The storage account URL is from the storage account you will have made available from the prerequisites at the top of this article.
1. Switch to the API management blade of the portal and open your instance.
1. Select APIs, then select “All APIs”.
1. Under "Inbound processing", click the code view button "</>" to show the policy editor.
1. Edit the inbound section and paste the below xml so it reads like the following.
1. Replace the following parameters in the Policy
1. {PrimaryStorageEndpoint} (The 'Primary Storage Endpoint' you copied in the previous section), {b2cpolicy-well-known-openid} (The 'well-known openid configuration endpoint' you copied earlier) and {backend-api-application-client-id} (The B2C Application / Client ID for the **backend API**) with the correct values saved earlier.
1. If you're using the Consumption tier of API Management, then you should remove both rate-limit-by-key policy as this policy isn't available when using the Consumption tier of Azure API Management.

   ```xml
   <inbound>
      <cors allow-credentials="true">
            <allowed-origins>
                <origin>{PrimaryStorageEndpoint}</origin>
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
   </inbound>
   ```

   > [!NOTE]
   > Now Azure API management is able to respond to cross origin requests from  your JavaScript SPA apps, and it will perform throttling, rate-limiting and pre-validation of the JWT auth token being passed BEFORE forwarding the request on to the Function API.
   >
   > Congratulations, you now have Azure AD B2C, API Management and Azure Functions working together to publish, secure AND consume an API!

   > [!TIP]
   > If you're using the API Management consumption tier then instead of rate limiting by the JWT subject or incoming IP Address (Limit call rate by key policy isn't supported today for the "Consumption" tier), you can Limit by call rate quota see [here](rate-limit-policy.md).
   > As this example is a JavaScript Single Page Application, we use the API Management Key only for rate-limiting and billing calls. The actual Authorization and Authentication is handled by Azure AD B2C, and is encapsulated in the JWT, which gets validated twice, once by API Management, and then by the backend Azure Function.

## Upload the JavaScript SPA sample to static storage

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
                            <button class="btn btn-warning" id="callapibtn" onClick="getAPIData()">Call API</a>
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
                            clientId: "{CLIENTID}", // This is the client ID of your FRONTEND application that you registered with the SPA type in Azure Active Directory B2C
                            authority:  "{YOURAUTHORITYB2C}", // Formatted as https://{b2ctenantname}.b2clogin.com/tfp/{b2ctenantguid or full tenant name including onmicrosoft.com}/{signuporinpolicyname}
                            redirectUri: "{StoragePrimaryEndpoint}", // The storage hosting address of the SPA, a web-enabled v2 storage account - recorded earlier as the Primary Endpoint.
                            knownAuthorities: ["{B2CTENANTDOMAIN}"] // {b2ctenantname}.b2clogin.com
                        },
                        cache: {
                            cacheLocation: "sessionStorage",
                            storeAuthStateInCookie: false
                        }
                    },
                    api: {
                        scopes: ["{BACKENDAPISCOPE}"], // The scope that we request for the API from B2C, this should be the backend API scope, with the full URI.
                        backend: "{APIBASEURL}/hello" // The location that we'll call for the backend api, this should be hosted in API Management, suffixed with the name of the API operation (in the sample this is '/hello').
                    }
                }
                document.getElementById("callapibtn").hidden = true;
                document.getElementById("progress").hidden = true;
                const myMSALObj = new msal.PublicClientApplication(config.msal);
                myMSALObj.handleRedirectPromise().then((tokenResponse) => {
                    if(tokenResponse !== null){
                        console.log(tokenResponse.account);
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
                function getAPIData() {
                    document.getElementById("progress").hidden = false;
                    document.getElementById("message").innerHTML = "Calling backend ... "
                    document.getElementById("cardheader").classList.remove('bg-success','bg-warning','bg-danger');
                    myMSALObj.acquireTokenSilent({scopes: config.api.scopes, account: getAccount()}).then(tokenResponse => {
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
                        return myMSALObj.acquireTokenRedirect({scopes: config.api.scopes, forceRefresh: false})
                    });
                    document.getElementById("progress").hidden = true;
             }
            function getAccount() {
                var accounts = myMSALObj.getAllAccounts();
                if (!accounts || accounts.length === 0) {
                    return null;
                } else {
                    return accounts[0];
                }
            }
        </script>
     </body>
    </html>
   ```

1. Browse to the Static Website Primary Endpoint you stored earlier in the last section.

   > [!NOTE]
   > Congratulations, you just deployed a JavaScript Single Page App to Azure Storage Static content hosting.
   > Since we haven’t configured the JS app with your Azure AD B2C details yet – the page won't work yet if you open it.

## Configure the JavaScript SPA for Azure AD B2C

1. Now we know where everything is: we can configure the SPA with the appropriate API Management API address and the correct Azure AD B2C application / client IDs.
1. Go back to the Azure portal storage blade
1. Select 'Containers' (under 'Settings')
1. Select the '$web' container from the list
1. Select index.html blob from the list
1. Click 'Edit'
1. Update the auth values in the MSAL config section to match your *front-end* application you registered in B2C earlier. Use the code comments for hints on how the config values should look.
The *authority* value needs to be in the format:- https://{b2ctenantname}.b2clogin.com/tfp/{b2ctenantname}.onmicrosoft.com}/{signupandsigninpolicyname}, if you have used our sample names and your b2c tenant is called 'contoso' then you would expect the authority to be 'https://contoso.b2clogin.com/tfp/contoso.onmicrosoft.com/Frontendapp_signupandsignin'.
1. Set the api values to match your backend address (The API Base Url you recorded earlier, and the 'b2cScopes' values were recorded earlier for the *backend application*).
1. Click Save

## Set the redirect URIs for the Azure AD B2C frontend app

1. Open the Azure AD B2C blade and navigate to the application registration for the JavaScript Frontend Application.
1. Click 'Redirect URIs' and delete the placeholder 'https://jwt.ms' we entered earlier.
1. Add a new URI for the primary (storage) endpoint (minus the trailing forward slash).

   > [!NOTE]
   > This configuration will result in a client of the frontend application receiving an access token with appropriate claims from Azure AD B2C.
   > The SPA will be able to add this as a bearer token in the https header in the call to the backend API.
   >
   > API Management will pre-validate the token, rate-limit calls to the endpoint by both the subject of the JWT issued by Azure ID (the user) and by IP address of the caller (depending on the service tier of API Management, see the note above), before passing through the request to the receiving Azure Function API, adding the functions security key.
   > The SPA will render the response in the browser.
   >
   > *Congratulations, you’ve configured Azure AD B2C, Azure API Management, Azure Functions, Azure App Service Authorization to work in perfect harmony!*

Now we have a simple app with a simple secured API, let's test it.

## Test the client application

1. Open the sample app URL that you noted down from the storage account you created earlier.
1. Click “Sign In” in the top-right-hand corner, this click will pop up your Azure AD B2C sign-up or sign-in profile.
1. The app should welcome you by your B2C profile name.
1. Now Click "Call API" and the page should update with the values sent back from your secured API.
1. If you *repeatedly* click the Call API button and you're running in the developer tier or above of API Management, you should note that your solution will begin to rate limit the API and this feature should be reported in the app with an appropriate message.

## And we're done

The steps above can be adapted and edited to allow many different uses of Azure AD B2C with API Management.

## Next steps

* Learn more about [Microsoft Entra ID and OAuth2.0](../active-directory/develop/authentication-vs-authorization.md).
* Check out more [videos](https://azure.microsoft.com/documentation/videos/index/?services=api-management) about API Management.
* For other ways to secure your back-end service, see [Mutual Certificate authentication](api-management-howto-mutual-certificates.md).
* [Create an API Management service instance](get-started-create-service-instance.md).
* [Manage your first API](import-and-publish.md).
