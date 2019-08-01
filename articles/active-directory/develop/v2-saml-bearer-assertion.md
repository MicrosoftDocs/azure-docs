SAML Bearer Assertion Flow Microsoft Documentation suggest 4 authentication flows but also supports SAML Bearer assertion flow. This is particularly useful in scenario when a user is trying to fetch data through Graph API which only supports delegated permissions. In this case, client credentials flow which is preferred for any background processes will not work. Also, when the information is being exchanged from few different systems then also the only resort is SAML Bearer flow.

What is the challenge in getting authenticated and access data through Office 365 and Azure AD was the question when i started working on this concept.

It all started with an intent of accessing the Graph API for different workloads in office 365 viz Accessing an outlook task,planner task or for that matter read Microsoft teams related information. There were couple of approaches to take in this scenario and no matter which approach we take,it all boils down to fetch an OAuth Token as any resource accessible through Graph API is secured with Azure AD. Basically the need is to to have the data in the background for the user, so the user should not be prompted for the credentials during the process, Hence as a first choice, client credentials flow is considered.This worked for quite a few API's, i believe mostly for all of the Graph API's which supports Application permission(for e.g SendMail,Read a sharepoint list item) while your register the App. However, for API's which does not support, its a complete dead end. To my research,there were no other flows as such which can help to fetch token/data without the prompt. Ultimately, in the end i came to know that OAuth2 Token endpoint for AAD supports SAML assertion and SAML assertion is basically in the user context which means delegated permission will work.So in a nutshell below is the scenario.

![][./media/v2-saml-bearer-assertion/1.png]

Now let us understand on how we can actually fetch SAML Asserstion.programatically. this approach is tested with ADFS. However this works with any IDP which is supporting return of SAML assertion programatically.

OAuth 2.0 SAML Bearer Assertion Flow The OAuth 2.0 SAML bearer assertion flow defines how a SAML assertion is used to request an OAuth access token. A SAML assertion is an XML security token issued by an identity provider and consumed by a service provider. The service provider relies on its content to identify the assertion’s subject for security-related purposes.

Pre-Requisites

There is a trust relationship between the authorization server/environment- O365 and the issuer of the SAML 2.0 bearer assertion, which is the identity provider - ADFS. To configure ADFS for SSO and IDP you may refer to this article
The application is registered in the office portal with below necessary configurations.Since we are using OAuth V2.0 endpoint,so need to register the application in App registration portal. Below are the steps o	Login to the App registration portal (Please note that we are using the v2.0 endpoints for Graph API and hence need to register the application in this portal. Otherwise we could have used the registrations in Azure active directory) o	Click "Add an App" o	Enter an "Application Name" o	Make a note of the Application id (this is referred as client id when required by the application) o	Click "Generate New Password" under Application secrets section. Please note that this will be flashed only once in the screen and make sure you note and save it in a safe place 😀 o	Under section "Microsoft Graph Permissions", add delegated permission for "Tasks.read" since we intend to use the Outlook graph api. o	Click Save for saving the Application related settings and data.
Postman Tool is required to test the Sample requests in three parts Process to fetch the OAuth Token and Access Graph API This can be achieved with the POSTMAN tool for POC in three parts as below. The same can be converted to code in any platform of your choice.
Get the SAML assertion from ADFS
Get the OAuth2 token using the assertion
Get the data with the Oauth token Get the SAML assertion from ADFS
Create a POST request to ADFS endpoint with SOAP envelope to fetch the SAML assertion


![][./media/v2-saml-bearer-assertion/2.png]

Header values as below

![][./media/v2-saml-bearer-assertion/3.png]

ADFS request body

![][./media/v2-saml-bearer-assertion/4.png]

Note : At the end of the post , i have attached the postman export files for reference Once,this request is posted successfully, you should receive a SAML Assertion from ADFS Only the SAML:Assertion tag data is required for further requests Convert the same to base64 encoding to use in further requests.

Get the OAuth2 token using the assertion In this step ,we will fetch a OAuth2 token using the ADFS assertion response.

Create a POST request as shown below with the header values. 
![][./media/v2-saml-bearer-assertion/5.png]
In the Body of the request please do the following

Replace client_id, client_secret and assertion (base 64 encoded SAML assertion obtained in step #1)
![][./media/v2-saml-bearer-assertion/6.png]
Upon successful request you will receive a access token from Azure active directory.
Get the data with the Oauth token

For the POC we will call Graph API’s (e.g outlook tasks in this example) Create a GET request as shown below with the access token fetched in the earlier step. 

![][./media/v2-saml-bearer-assertion/7.png]

Upon successful request , you will receive a json response.
I would say, there is much more to Azure but i did not find enough documentation to this topic. So for the benefit of the community, I tried jotting down the thoughts. Hope this helps !