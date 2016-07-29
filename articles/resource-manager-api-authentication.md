<properties 
   pageTitle="Authorization with Resource Manager API | Microsoft Azure"
   description="A developer's guide to authorization with the Azure Resource Manager API and Active Directory for integrating an app with Azure."
   services="azure-resource-manager,active-directory"
   documentationCenter="na"
   authors="dushyantgill"
   manager="timlt"
   editor="tysonn" />
<tags 
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="07/12/2016"
   ms.author="dugill;tomfitz" />


# Developer's guide to authorization with the Azure Resource Manager API

If you are a software developer who wishes to integrate an app with Azure, or to manage your customer's Azure resources, this topic shows you how to authenticate with the Azure 
Resource Manager APIs. 

Your app can access the Resource Manager APIs in couple of ways:

1. **User + app access**: use this method for apps that access resources on behalf of a signed-in user. It works for apps, such as web apps and command-line tools, that deal with only "interactive management" of Azure resources.
1. **App-only access**: use this method when the app's identity must be granted direct access to the resources. It works for daemon services and scheduled jobs that need long-term "offline access" to Azure.

This topic gives a step-by-step description of how to create an app that employs both these authorization methods.

You'll build a web application that:

1. Signs-in an Azure user
2. Queries Resource Manager on behalf of the user (user + app access) to get a list of Azure subscriptions that the user owns
3. Enables the user to "connect" subscriptions to the app; thereby, granting direct access on the subscription to the application
4. Accesses Resource Manager as the application to perform offline operations (app-only access)

Here's the end-to-end flow of the web application that you will write.

![ARM Auth - App Registration 1](./media/resource-manager-api-authentication/ARM-Auth-Swim-Lane.png)

All of the code for this topic is running as a web app that you can try at [http://vipswapper.azurewebsites.net/cloudsense](http://vipswapper.azurewebsites.net/cloudsense). 

As a user, you select the type of account to use for logging in:

![select sign-in](./media/resource-manager-api-authentication/ARM-Auth-Sample-App-Ux-1.png)

Provide your credentials.

![provide credentials](./media/resource-manager-api-authentication/ARM-Auth-Sample-App-Ux-2.png)

Grant the app access to your Azure subscriptions:
 
 ![Grant access](./media/resource-manager-api-authentication/ARM-Auth-Sample-App-Ux-3.png)
 
Connect your subscriptions to the app for monitoring:

![Connect subscription](./media/resource-manager-api-authentication/ARM-Auth-Sample-App-Ux-4.png)

Disconnect or repair the connection to the app:

![Disconnect subscription](./media/resource-manager-api-authentication/ARM-Auth-Sample-App-Ux-5.png)

## Register your application with Azure Active Directory

You begin by registering you web app with Azure Active Directory (AD). The app registration creates a central identity for your app 
in Azure AD. It holds basic information about your application like OAuth Client ID, Reply URLs and credentials that your application 
will use to authenticate and access Azure Resource Manager APIs. The app registration also records the various delegated permissions 
that your applications needs when accessing Microsoft APIs on behalf of the user. 

The topic 
[Create Active Directory application and service principal using portal](resource-group-create-service-principal-portal.md) shows 
all of the steps necessary to set up your application. Refer to that topic as you create an application with the following properties:

- Web application named **CloudSense**
- Sign-in URL and App ID URI in the format **http://{domain_name_of_your_directory}/{name_of_the_app}**.
- Authentication key for signing in the application
- Delegated permission **Access Azure Service Management** for **Azure Service Management API**. Leave the default **Enable single sign-on and read user's profile** for **Azure Active Directory**.
- Multi-tenant application

### Optional configuration - certificate credential

Azure AD also supports certificate credentials for applications: you create a self-signed cert, keep the private key, and add 
the public key to your Azure AD application registration. For authentication, your application sends a small payload to Azure AD 
signed using your private key, and Azure AD validates the signature using the public key that you registered.

For information about configuring the certificate, see [Build service and daemon apps in Office 365](https://msdn.microsoft.com/office/office365/howto/building-service-apps-in-office-365). 
The section titled "Configuring a X.509 public cert for your application" has step-by-step instructions for setting up the certificate. Or, see 
[Authenticating a service principal with Azure Resource Manager](resource-group-authenticate-service-principal.md) for examples of configuring a certificate through Azure PowerShell or Azure CLI.

## Authenticate user and get access token

You now have everything you need to get started with coding the application. This topic provides the REST API examples 
for each step of the end-to-end flow, and links to the relevant C# code for each step. The complete ASP.NET MVC application sample is available at 
[https://github.com/dushyantgill/VipSwapper/tree/master/CloudSense](https://github.com/dushyantgill/VipSwapper/tree/master/CloudSense). 

You start at the point where the user decides to connect his or her Azure subscription to your application. 

You must ask the user two things:

1. **Directory Domain Name**: the domain name of the Azure Active Directory associated with the user's Azure subscription. The OAuth 2.0 Authorization request must be sent to this Azure AD. The user can find out the domain name of their Azure AD by navigating to the Azure Portal and selecting the account in the upper right corner. You may provide visual instructions to the user like: 

     ![](./media/resource-manager-api-authentication/show-directory.png)
   
1. **Microsoft Account vs. Work Account**: determine whether the user manages his or her Azure subscription with a Microsoft Account (aka Live Id) or a Work Account (aka Organizational Account). If Microsoft Account, your application will redirect the user to the Azure Active Directory login page with a query string parameter (&domain_hint=live.com) that will instruct Azure AD to take the user directly to the Microsoft Account sign-in page. The authorization code and tokens that you receive for either type of account will be processed in the same way.

Your application then redirects the user to Azure AD with an 
OAuth 2.0 Authorize Request - to authenticate the user's credentials and get back 
an authorization code. Your application will use the authorization code to get an access token for Resource Manager.

### Auth request (OAuth 2.0)

Issue an Open ID Connect/OAuth2.0 Authorize Request to the Azure AD Authorize endpoint:

    https://login.microsoftonline.com/{directory_domain_name}/OAuth2/Authorize

The query string parameters that are available for this request are described in the [Authorization Code Grant Flow](https://msdn.microsoft.com/library/azure/dn645542.aspx) topic.

The following example shows how to request OAuth2.0 authorization:

    https://login.windows.net/dushyantgill.com/OAuth2/Authorize?client_id=a0448380-c346-4f9f-b897-c18733de9394&response_mode=query&response_type=code&redirect_uri=http%3a%2f%2fwww.vipswapper.com%2fcloudsense%2fAccount%2fSignIn&resource=https%3a%2f%2fgraph.windows.net%2f&domain_hint=live.com

Azure AD authenticates the user, and, if required, asks the user to grant permission to the app. It returns the authorization code to the Reply URL of your application. Depending on the 
requested response_mode, Azure AD either sends back the data in query string or as post data.

    code=AAABAAAAiL****FDMZBUwZ8eCAA&session_state=2d16bbce-d5d1-443f-acdf-75f6b0ce8850

### Auth request (Open ID Connect)

If you not only wish to access Azure Resource Manager on behalf of the user, but also allow the user to sign-in to your application using their Azure AD account, issue an 
Open ID Connect Authorize Request. With Open ID Connect, your application will also receive an id_token from Azure AD that your app can use to sign-in the user.

The OAuth2.0 Authorize request query string parameters are:

| QS Parameter | Value
|----|----
| client_id | Client ID of your application
| response_mode | **form_post** or **query**
| response_type | **code+id_token**
| redirect_uri | URL encoded Reply URL of your application. For instance: http://www.vipswapper.com/cloudsense/Account/SignIn |
| resource | URL encoded identifier of Azure Service Management APIs: https://management.core.windows.net/ |
| scope | openid+profile
| nonce | Piece of data to tie the authorize request to the returned id_token to ensure that the authorize response is solicited and isn't replayed.
| domain_hint | live.com <br />**Note**: only use the domain_hint parameter if the user manages their Azure Subscription using a Microsoft Account.
| state | Optionally, specify any state data that you wish Azure AD to return back with the response.

An example Open ID Connect request is:

     https://login.windows.net/dushyantgill.com/OAuth2/Authorize?client_id=a0448380-c346-4f9f-b897-c18733de9394&response_mode=form_post&response_type=code+id_token&redirect_uri=http%3a%2f%2fwww.vipswapper.com%2fcloudsense%2fAccount%2fSignIn&resource=https%3a%2f%2fgraph.windows.net%2f&scope=openid+profile&nonce=63567Dc4MDAw&domain_hint=live.com&state=M_12tMyKaM8

Azure AD authenticates the user, and, if required, asks the user to grant permission to the app. It returns the authorization code to the Reply URL of your application. Depending on the 
requested response_mode, Azure AD either sends back the data in query string or as post data.

An example Open ID Connect response is:

    code=AAABAAAAiL*****I4rDWd7zXsH6WUjlkIEQxIAA&id_token=eyJ0eXAiOiJKV1Q*****T3GrzzSFxg&state=M_12tMyKaM8&session_state=2d16bbce-d5d1-443f-acdf-75f6b0ce8850

### Validate id_token

Before your application signs-in the user it must validate the id_token. Token validation is an involved topic, and I recommend that you use a standard JSON Web Token handler library for your development platform 
(see the [.NET Azure AD JWT Handler source code](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/blob/master/src/System.IdentityModel.Tokens.Jwt/JwtSecurityTokenHandler.cs)). 
That said, security of your application is your responsibility, so make sure that the library that you use to handle the id_token properly 
validates the following aspects of the token:

- **Timing of the token**: check the nbf and exp claims to ensure that the token isn't too fresh or too stale. It is customary to keep some slack (5 minutes) to accommodate time skews.
- **Issuer**: check the iss claim to ensure the issuer of the token is Azure Active Directory: https://sts.windows.net/{tenant_id_of_the_directory}
- **Audience**: check the aud claim to ensure that the token has been minted for your application. The value must be the Client ID of your application.
- **Nonce**: check the nonce claim to check against the nonce data that you sent in the authorization request, to ensure that the response has been solicited by your application and that the token isn't being replayed.
- **Signature**: your app must verify that the token has been signed by Azure Active Directory. Azure AD signing keys roll frequently, so your app must either poll for refreshed keys daily or fault-in the refreshed keys if signature validation fails. For more information, see [Important Information About Signing Key Rollover in Azure AD](active-directory/active-directory-signing-key-rollover.md).

Once the **id_token** has been validated, use the oid claim value as the immutable and non-reusable identifier of the user. Use either **unique_name** claim or the upn/email claim as the human readable display name of the user. You may also use the optional given_name/family_name claims for display purpose.

### Token request (OAuth2.0 Code Grant Flow)

Now that your application has received the authorization code from Azure AD, it is time to get the access token for Azure Resource Manager.  Post an OAuth2.0 Code Grant Token Request 
to the Azure AD Token endpoint: 

    https://login.microsoftonline.com/{directory_domain_name}/OAuth2/Token

The query string parameters that are available for this request are described in the [Authorization Code Grant Flow](https://msdn.microsoft.com/library/azure/dn645542.aspx) topic.

The following example shows a request for code grant token with password credential:

    POST https://login.windows.net/7fe877e6-a150-4992-bbfe-f517e304dfa0/oauth2/token HTTP/1.1

    Content-Type: application/x-www-form-urlencoded
    Content-Length: 1012

    grant_type=authorization_code&code=AAABAAAAiL9Kn2Z*****L1nVMH3Z5ESiAA&redirect_uri=http%3A%2F%2Flocalhost%3A62080%2FAccount%2FSignIn&client_id=a0448380-c346-4f9f-b897-c18733de9394&client_secret=olna84E8*****goScOg%3D

When working with certificate credentials, create a JSON Web Token (JWT) and sign (RSA SHA256) using the private key of your application's certificate credential. The claim types for the token are shown in 
[Authorization Code Grant Flow](https://msdn.microsoft.com/library/azure/dn645542.aspx). For reference, see the [Active Directory Auth Library (.NET) code](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/blob/master/src/ADAL.NET/CryptographyHelper.cs) 
to sign Client Assertion JWT tokens.

See the [Open ID Connect spec](http://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication) for details on Client Authentication. Here's a [sample client assertion JWT token](https://www.authnauthz.com/OAuth/ParseJWTToken?token=eyJhbGciOiJSUzI1NiIsIng1dCI6IlFwcXdKZnJNZ003ekJ4M1hkM2NSSFdkYVFsTSJ9.eyJhdWQiOiJodHRwczpcL1wvbG9naW4ud2luZG93cy5uZXRcL2FhbHRlc3RzLm9ubWljcm9zb2Z0LmNvbVwvb2F1dGgyXC90b2tlbiIsImV4cCI6MTQyODk2Mjk5MSwiaXNzIjoiOTA4M2NjYjgtOGE0Ni00M2U3LTg0MzktMWQ2OTZkZjk4NGFlIiwianRpIjoiMmYyMjczMzQtZGQ3YS00NzZkLWFlOTYtYzg4NDQ4YTkxZGM0IiwibmJmIjoxNDI4OTYyMzkxLCJzdWIiOiI5MDgzY2NiOC04YTQ2LTQzZTctODQzOS0xZDY5NmRmOTg0YWUifQ.UXQE9H-FlwxYQmRVG0-p7pAX9TFgiRXcYr7GhbcC7ndIPHKpZ5tfHWPEgBl3ZVRvF2l8uA7HEV86T7t2w7OHhHwLBoW7XTgj-17hnV1CY21MwjrebPjaPIVITiilekKiBASfW2pmss3MjeOYcnBV2MuUnIgt4A_iUbF_-opRivgI4TFT4n17_3VPlChcU8zJqAMpt3TcAxC3EXXfh10Mw0qFfdZKqQOQxKHjnL8y7Of9xeB9BBD_b22JNRv0m7s0cYRx2Cz0cUUHw-ipHhWaW7YwhVRMfK6BMkaDUgaie4zFkcgHb7rm1z0rM1CvzIqP-Mwu3oEqYpY9cYo8nEjMyA).

The following example shows a request for code grant token with certificate credential:

	POST https://login.windows.net/7fe877e6-a150-4992-bbfe-f517e304dfa0/oauth2/token HTTP/1.1
	
	Content-Type: application/x-www-form-urlencoded
	Content-Length: 1012
	
	grant_type=authorization_code&code=AAABAAAAiL9Kn2Z*****L1nVMH3Z5ESiAA&redirect_uri=http%3A%2F%2Flocalhost%3A62080%2FAccount%2FSignIn&client_id=a0448380-c346-4f9f-b897-c18733de9394&client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer&client_assertion=eyJhbG*****Y9cYo8nEjMyA

An example response for code grant token: 

    HTTP/1.1 200 OK

    {"token_type":"Bearer","expires_in":"3599","expires_on":"1432039858","not_before":"1432035958","resource":"https://management.core.windows.net/","access_token":"eyJ0eXAiOiJKV1Q****M7Cw6JWtfY2lGc5A","refresh_token":"AAABAAAAiL9Kn2Z****55j-sjnyYgAA","scope":"user_impersonation","id_token":"eyJ0eXAiOiJKV*****-drP1J3P-HnHi9Rr46kGZnukEBH4dsg"}

#### Handle code grant token response

A successful token response will contain the (user + app) access token for Azure Resource Manager. Your application will use this access token to access Resource Manager on behalf of the user. 
The lifetime of access tokens issued by 
Azure AD is one hour. It is unlikely that your web application will need to renew the (user + app) access token - however, if it does, you may use the refresh token that 
your application receives in the token response. Post an OAuth2.0 Token Request to the Azure AD Token endpoint: 

    https://login.microsoftonline.com/{directory_domain_name}/OAuth2/Token

The parameters to use with the refresh request are described in [Authorization Code Grant Flow](https://msdn.microsoft.com/library/azure/dn645542.aspx).

The following example shows how to use the refresh token:

    POST https://login.windows.net/7fe877e6-a150-4992-bbfe-f517e304dfa0/oauth2/token HTTP/1.1

    Content-Type: application/x-www-form-urlencoded
    Content-Length: 1012

    grant_type=refresh_token&refresh_token=AAABAAAAiL9Kn2Z****55j-sjnyYgAA&client_id=a0448380-c346-4f9f-b897-c18733de9394&client_secret=olna84E8*****goScOg%3D

Note that although refresh tokens can be used to get new access tokens for Azure Resource Manager, they are not suitable for offline access by your application. 
The refresh tokens lifetime is limited, and refresh tokens are bound to the user. If the user leaves the organization, the application using the refresh token will lose access. 
This approach isn't suitable for applications that are used by teams to manage their Azure resources.

## List available subscriptions

Your application now has a token to access Azure Resource Manager on behalf of the user.

The next step of the experience is to allow the user to connect his or her Azure subscription to your app so your app can manage those subscriptions 
even when the user isn't present (long-term offline access). 
Show the user the list of Azure subscriptions on which the user can manage access, and allow the user to assign an RBAC role directly to your application's identity.

![ARM Auth - Sample App Ux 4](./media/resource-manager-api-authentication/ARM-Auth-Sample-App-Ux-4-full.png)

### List subscriptions in which the user has any access

We shall first call the [Resource Manager list subscriptions](https://msdn.microsoft.com/library/azure/dn790531.aspx) API to list all subscriptions in which the user has any kind of access. 
Then, we will identify the ones for which the user can manage access.

The [GetUserSubscription](https://github.com/dushyantgill/VipSwapper/blob/master/CloudSense/CloudSense/AzureResourceManagerUtil.cs#L79) method of the ASP.net MVC sample app implements this call.

An example request to list subscriptions is:

    GET https://management.azure.com/subscriptions?api-version=2014-04-01-preview HTTP/1.1

    Authorization: Bearer eyJ0eXAiOiJKV1QiLC***lwO1mM7Cw6JWtfY2lGc5A

An example response to list subscriptions is:

    HTTP/1.1 200 OK

    {"value":[{"id":"/subscriptions/34370e90-ac4a-4bf9-821f-85eeedeae1a2","subscriptionId":"34370e90-ac4a-4bf9-821f-85eeedeae1a2","displayName":"Sandbox","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Public_2014-09-01","quotaId":"PayAsYouGo_2014-09-01"}},{"id":"/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e","subscriptionId":"c276fc76-9cd4-44c9-99a7-4fd71546436e","displayName":"Production","state":"Enabled","subscriptionPolicies":{"locationPlacementId":"Public_2014-09-01","quotaId":"PayAsYouGo_2014-09-01"}}]}

### Get user's permissions on subscription

The connect/disconnect action should only be displayed for subscriptions for which the user can manage access. For each subscription, you will call the 
[Resource Manager list permissions](https://msdn.microsoft.com/library/azure/dn906889.aspx) API to determine whether or not the user has Access 
Management rights for the subscription.

The [UserCanManagerAccessForSubscription](https://github.com/dushyantgill/VipSwapper/blob/master/CloudSense/CloudSense/AzureResourceManagerUtil.cs#L132) method of the ASP.net MVC sample app 
implements this call.

The following example shows how to request a user's permissions on a subscription. 83cfe939-2402-4581-b761-4f59b0a041e4 is the id of the subscription.

    GET https://management.azure.com/subscriptions/83cfe939-2402-4581-b761-4f59b0a041e4/providers/microsoft.authorization/permissions?api-version=2014-07-01-preview HTTP/1.1

    Authorization: Bearer eyJ0eXAiOiJKV1QiLC***lwO1mM7Cw6JWtfY2lGc5A

An example of the response to get user's permissions on subscription is:

    HTTP/1.1 200 OK

    {"value":[{"actions":["*"],"notActions":["Microsoft.Authorization/*/Write","Microsoft.Authorization/*/Delete"]},{"actions":["*/read"],"notActions":[]}]}

The Permissions API returns multiple permissions. Each permission consists of allowed actions (actions) and disallowed actions (notactions). If an action is present in the allowed actions 
list of any permission and not present in the notactions list of that permission, the user is allowed to perform that action.
**microsoft.authorization/roleassignments/write** is the action that that grants access management rights. Your application must parse the permissions result to look for a regex match 
on this action string in the actions and notactions of each permission.

### Optional: list directories in which user account is present

A user's account can be present in multiple Azure Active Directories. It is possible that the user didn't specify the correct directory name initially - in that case the desired subscription 
wouldn't be displayed in the list.

[Resource Manager list tenants](https://msdn.microsoft.com/library/azure/dn790536.aspx) API lists the identifiers of all directories in which the user's account is present. You may call the 
API to determine whether the user's account is in more than one directory and optionally show 
the user a message like "Didn't find the subscription you were looking for? It could be in the other Azure Active Directory of which you are a member. Click here to switch directory."

The [GetUserOrganizations](https://github.com/dushyantgill/VipSwapper/blob/master/CloudSense/CloudSense/AzureResourceManagerUtil.cs#L20) method of the ASP.NET MVC sample app implements this call.

An example request to list directories: 

    GET https://management.azure.com/tenants?api-version=2014-04-01-preview HTTP/1.1

    Authorization: Bearer eyJ0eXAiOiJKV1Qi****8DJf1UO4a-ZZ_TJmWFlwO1mM7Cw6JWtfY2lGc5A

An example response to list directories: 

    HTTP/1.1 200 OK

    {"value":[{"id":"/tenants/7fe877e6-a150-4992-bbfe-f517e304dfa0","tenantId":"7fe877e6-a150-4992-bbfe-f517e304dfa0"},{"id":"/tenants/62e173e9-301e-423e-bcd4-29121ec1aa24","tenantId":"62e173e9-301e-423e-bcd4-29121ec1aa24"}]}

## Connect subscription to application

You now have a list of Azure subscriptions that the user can connect to your application. The next step is to give the user a command to create the connection. When the user selects **connect**, 
your app:

1. Assigns the appropriate RBAC role to your application's identity on the subscription.
2. Validates the access assignment by querying for the Application's permission on the subscription or by accessing Resource Manager using app-only token.
1. Records the connection in your applications "connected subscriptions" data structure - persisting the id of the subscription.

Let's look closer at the first step: to assign the appropriate RBAC role to the application's identity, you must determine:

- The object id of your application's identity in the user's Azure Active Directory
- The identifier of the RBAC role that your application requires on the subscription

Let's drill into the first part: the first time your application authenticates a user from an Azure AD, a Service Principal object for your application gets created in that Azure AD. 
Azure allows RBAC roles to be assigned to Service Principals, to grant direct access to corresponding Applications on Azure resources. This is exactly what we wish to do - so we begin by 
querying the Azure AD Graph API to determine the identifier of the Service Principal of your application in the signed-in user's Azure AD.

You only have an access token for Azure Resource Manager - you need a new access token to call the Azure AD Graph API. Every application in Azure AD has permission to query its 
own Service Principal object, so we don't need a user + app access token for this, an app-only access token will suffice.

<a id="app-azure-ad-graph">
### Get app-only access token for Azure AD Graph API

To authenticate your app and get a token to Azure AD Graph API, issue a Client Credential Grant OAuth2.0 flow token request to Azure AD 
token endpoint (**https://login.microsoftonline.com/{directory_domain_name}/OAuth2/Token**).

Lines 73-77 of [GetObjectIdOfServicePrincipalInOrganization](https://github.com/dushyantgill/VipSwapper/blob/master/CloudSense/CloudSense/AzureADGraphAPIUtil.cs#L73) method of the ASP.net MVC 
sample application gets an app-only access token for Graph API using the Active Directory Authentication Library for .NET.

The client credential grant token request data:

| Element | Value
|----|----
| grant_type | **client_credentials**
| client_id | Client ID of your application
| resource | URL encoded identifier of the resource for which the access token is being requested. In this case, the identifier of the Azure AD Graph API: **https://graph.windows.net/**
| client_secret or client_assertion_type + client_assertion | If your application uses password credential, use client_secret. If your application uses certificate credential, use client_assertion.

An example request for client credential grant token: 

    POST https://login.windows.net/62e173e9-301e-423e-bcd4-29121ec1aa24/oauth2/token HTTP/1.1
    Content-Type: application/x-www-form-urlencoded
    Content-Length: 187</pre>
    <pre>grant_type=client_credentials&client_id=a0448380-c346-4f9f-b897-c18733de9394&resource=https%3A%2F%2Fgraph.windows.net%2F &client_secret=olna8C*****Og%3D

An example response for client credential grant token: 

    HTTP/1.1 200 OK

    {"token_type":"Bearer","expires_in":"3599","expires_on":"1432039862","not_before":"1432035962","resource":"https://graph.windows.net/","access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSIsImtpZCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLndpbmRv****G5gUTV-kKorR-pg"}

### Get ObjectId of application service principal in user Azure AD

Now, use the app-only access token to query the [Azure AD Graph Service Principals](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#serviceprincipal-entity) API to determine the Object Id of the application's service principal in the directory.

The [GetObjectIdOfServicePrincipalInOrganiation](https://github.com/dushyantgill/VipSwapper/blob/master/CloudSense/CloudSense/AzureADGraphAPIUtil.cs#L66) method of the ASP.net MVC sample application implements this call.

The following example shows how to request an application's service principal. a0448380-c346-4f9f-b897-c18733de9394 is the client id of the application.

    GET https://graph.windows.net/62e173e9-301e-423e-bcd4-29121ec1aa24/servicePrincipals?api-version=1.5&$filter=appId%20eq%20'a0448380-c346-4f9f-b897-c18733de9394' HTTP/1.1

    Authorization: Bearer eyJ0eXAiOiJK*****-kKorR-pg

The following example shows a response to the request for an application's service principal 

    HTTP/1.1 200 OK

    {"odata.metadata":"https://graph.windows.net/62e173e9-301e-423e-bcd4-29121ec1aa24/$metadata#directoryObjects/Microsoft.DirectoryServices.ServicePrincipal","value":[{"odata.type":"Microsoft.DirectoryServices.ServicePrincipal","objectType":"ServicePrincipal","objectId":"9b5018d4-6951-42ed-8a92-f11ec283ccec","deletionTimestamp":null,"accountEnabled":true,"appDisplayName":"CloudSense","appId":"a0448380-c346-4f9f-b897-c18733de9394","appOwnerTenantId":"62e173e9-301e-423e-bcd4-29121ec1aa24","appRoleAssignmentRequired":false,"appRoles":[],"displayName":"CloudSense","errorUrl":null,"homepage":"http://www.vipswapper.com/cloudsense","keyCredentials":[],"logoutUrl":null,"oauth2Permissions":[{"adminConsentDescription":"Allow the application to access CloudSense on behalf of the signed-in user.","adminConsentDisplayName":"Access CloudSense","id":"b7b7338e-683a-4796-b95e-60c10380de1c","isEnabled":true,"type":"User","userConsentDescription":"Allow the application to access CloudSense on your behalf.","userConsentDisplayName":"Access CloudSense","value":"user_impersonation"}],"passwordCredentials":[],"preferredTokenSigningKeyThumbprint":null,"publisherName":"vipswapper"quot;,"replyUrls":["http://www.vipswapper.com/cloudsense","http://www.vipswapper.com","http://vipswapper.com","http://vipswapper.azurewebsites.net","http://localhost:62080"],"samlMetadataUrl":null,"servicePrincipalNames":["http://www.vipswapper.com/cloudsense","a0448380-c346-4f9f-b897-c18733de9394"],"tags":["WindowsAzureActiveDirectoryIntegratedApp"]}]}

### Get Azure RBAC role identifier

You must assign the appropriate RBAC role to your application's service principal on the selected subscription. For this you must determine the identifier of the Azure RBAC role.

The right RBAC role for your application:

- If your application only monitors the subscription, without making any changes, it requires only reader permissions on the subscription. Assign the **Reader** role.
- If your application manages Azure the subscription, creating/modifying/deleting entities, it will require one of the contributor permissions.
  - To manage a particular type of resource, assign the resource specific contributor roles (Virtual Machine Contributor, Virtual Network Contributor, Storage Account Contributor, etc.)
  - To manage any resource type, assign the **Contributor** role.

The role assignment for your application will be visible to users, so select the least-required privilege.

Call the [Resource Manager role definition API](https://msdn.microsoft.com/library/azure/dn906879.aspx) to list all Azure RBAC roles and search then iterate over the result to 
find the desired role definition by name.

The [GetRoleId](https://github.com/dushyantgill/VipSwapper/blob/master/CloudSense/CloudSense/AzureResourceManagerUtil.cs#L354) method of the ASP.net MVC sample app implements this call.

The following request example shows how to get Azure RBAC role identifier. 09cbd307-aa71-4aca-b346-5f253e6e3ebb is the id of the subscription.

    GET https://management.azure.com/subscriptions/09cbd307-aa71-4aca-b346-5f253e6e3ebb/providers/Microsoft.Authorization/roleDefinitions?api-version=2014-07-01-preview HTTP/1.1

    Authorization: Bearer eyJ0eXAiOiJKV*****fY2lGc5

The response is in the following format: 

    HTTP/1.1 200 OK

    {"value":[{"properties":{"roleName":"API Management Service Contributor","type":"BuiltInRole","description":"Lets you manage API Management services, but not access to them.","scope":"/","permissions":[{"actions":["Microsoft.ApiManagement/Services/*","Microsoft.Authorization/*/read","Microsoft.Resources/subscriptions/resources/read","Microsoft.Resources/subscriptions/resourceGroups/read","Microsoft.Resources/subscriptions/resourceGroups/resources/read","Microsoft.Resources/subscriptions/resourceGroups/deployments/*","Microsoft.Insights/alertRules/*","Microsoft.Support/*"],"notActions":[]}]},"id":"/subscriptions/09cbd307-aa71-4aca-b346-5f253e6e3ebb/providers/Microsoft.Authorization/roleDefinitions/312a565d-c81f-4fd8-895a-4e21e48d571c","type":"Microsoft.Authorization/roleDefinitions","name":"312a565d-c81f-4fd8-895a-4e21e48d571c"},{"properties":{"roleName":"Application Insights Component Contributor","type":"BuiltInRole","description":"Lets you manage Application Insights components, but not access to them.","scope":"/","permissions":[{"actions":["Microsoft.Insights/components/*","Microsoft.Insights/webtests/*","Microsoft.Authorization/*/read","Microsoft.Resources/subscriptions/resources/read","Microsoft.Resources/subscriptions/resourceGroups/read","Microsoft.Resources/subscriptions/resourceGroups/resources/read","Microsoft.Resources/subscriptions/resourceGroups/deployments/*","Microsoft.Insights/alertRules/*","Microsoft.Support/*"],"notActions":[]}]},"id":"/subscriptions/09cbd307-aa71-4aca-b346-5f253e6e3ebb/providers/Microsoft.Authorization/roleDefinitions/ae349356-3a1b-4a5e-921d-050484c6347e","type":"Microsoft.Authorization/roleDefinitions","name":"ae349356-3a1b-4a5e-921d-050484c6347e"}]}

Note that you do not need to call this API on an ongoing basis. Once you've determined the well-known GUID of the role definition, you can construct the role definition id as:

    /subscriptions/{subscription_id}/providers/Microsoft.Authorization/roleDefinitions/{well-known-role-guid}

Here are the well-known guids of commonly used built-in roles:

| Role | Guid |
| ----- | ------ |
| Reader | acdd72a7-3385-48ef-bd42-f606fba81ae7
| Contributor | b24988ac-6180-42a0-ab88-20f7382dd24c
| Virtual Machine Contributor | d73bb868-a0df-4d4d-bd69-98a00b01fccb
| Virtual Network Contributor | b34d265f-36f7-4a0d-a4d4-e158ca92e90f
| Storage Account Contributor | 86e8f5dc-a6e9-4c67-9d15-de283e8eac25
| Website Contributor | de139f84-1756-47ae-9be6-808fbbe84772
| Web Plan Contributor | 2cc479cb-7b4d-49a8-b449-8c00fd0f0a4b
| SQL Server Contributor | 6d8ee4ec-f05a-4a1d-8b00-a9b17e38b437
| SQL DB Contributor | 9b7fa17d-e63e-47b0-bb0a-15c516ac86ec

### Assign RBAC role to application

You have everything you need to assign the appropriate RBAC role to your application's service principal on the selected subscription by using 
the [Resource Manager create role assignment](https://msdn.microsoft.com/library/azure/dn906887.aspx) API.

The [GrantRoleToServicePrincipalOnSubscription](https://github.com/dushyantgill/VipSwapper/blob/master/CloudSense/CloudSense/AzureResourceManagerUtil.cs#L269) method of the ASP.net MVC sample app implements this call.

An example request to assign RBAC role to application: 

    PUT https://management.azure.com/subscriptions/09cbd307-aa71-4aca-b346-5f253e6e3ebb/providers/microsoft.authorization/roleassignments/4f87261d-2816-465d-8311-70a27558df4c?api-version=2014-10-01-preview HTTP/1.1

    Authorization: Bearer eyJ0eXAiOiJKV1QiL*****FlwO1mM7Cw6JWtfY2lGc5
    Content-Type: application/json
    Content-Length: 230

    {"properties": {"roleDefinitionId":"/subscriptions/09cbd307-aa71-4aca-b346-5f253e6e3ebb/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7","principalId":"c3097b31-7309-4c59-b4e3-770f8406bad2"}}

In the request, the following values are used:

| Guid | Description |
| ------ | --------- |
| 09cbd307-aa71-4aca-b346-5f253e6e3ebb | the id of the subscription
| c3097b31-7309-4c59-b4e3-770f8406bad2 | the object id of the service principal of the application
| acdd72a7-3385-48ef-bd42-f606fba81ae7 | the well-known guid of the Reader RBAC role
| 4f87261d-2816-465d-8311-70a27558df4c | a new guid created for the new role assignment

The response is in the following format: 

    HTTP/1.1 201 Created

    {"properties":{"roleDefinitionId":"/subscriptions/09cbd307-aa71-4aca-b346-5f253e6e3ebb/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7","principalId":"c3097b31-7309-4c59-b4e3-770f8406bad2","scope":"/subscriptions/09cbd307-aa71-4aca-b346-5f253e6e3ebb"},"id":"/subscriptions/09cbd307-aa71-4aca-b346-5f253e6e3ebb/providers/Microsoft.Authorization/roleAssignments/4f87261d-2816-465d-8311-70a27558df4c","type":"Microsoft.Authorization/roleAssignments","name":"4f87261d-2816-465d-8311-70a27558df4c"}

### Get app-only access token for Azure Resource Manager

The next step is to validate that app has desired access on the subscription. For this, you should perform a test task on the subscription using an app-only token for Azure Resource Manager. 
The test task should validate that your application does indeed have the desired access on the subscription, to perform offline monitoring/management.

To get an app-only access token for Azure Resource Manager, follow instructions from section [Get app-only access token for Azure AD Graph API](#app-azure-ad-graph), with a different 
value for the resource parameter: 

    https://management.core.windows.net/

Lines 210-214 of [ServicePrincipalHasReadAccessToSubscription](https://github.com/dushyantgill/VipSwapper/blob/master/CloudSense/CloudSense/AzureResourceManagerUtil.cs#L203) method of the ASP.net MVC sample application gets an app-only access token for Azure Resource Manager using the Active Directory Authentication Library for .net.

#### Get Application's Permissions on Subscription

To check that your application has the desired access on an Azure subscription, you may also call the [Resource Manager Permissions](https://msdn.microsoft.com/library/azure/dn906889.aspx) 
API similar to how you determined whether or not the user has Access Management rights for the subscription. However, this time call the permissions API with the app-only access token 
that you received in the previous step.

The [ServicePrincipalHasReadAccessToSubscription](https://github.com/dushyantgill/VipSwapper/blob/master/CloudSense/CloudSense/AzureResourceManagerUtil.cs#L203) method of the ASP.NET MVC sample app implements this call.

## Manage connected subscriptions

When the appropriate RBAC role is assigned to your application's service principal on the subscription, your application can keep
monitoring/managing it using app-only access tokens for Azure Resource Manager.

If a subscription owner removes your application's role assignment using Azure Management Portal or command line tools, your application will no longer be able to access that subscription. 
In that case, you should notify the user that the connection with the subscription was severed from outside the application and give them an option to "repair" the connection. 
"Repair" would simply re-create the role assignment that was deleted offline.


## Disconnect subscriptions

Just as you enabled the user to connect his or her subscriptions to your application, you must allow the user to disconnect subscriptions too. From an access management point of view, 
disconnect means removing the role assignment that the application's service principal has on the subscription. Optionally, any state in the application for the subscription might be removed too. 
Only users with access management permission on the subscription will be able to disconnect the subscription.

The [RevokeRoleFromServicePrincipalOnSubscription method](https://github.com/dushyantgill/VipSwapper/blob/master/CloudSense/CloudSense/AzureResourceManagerUtil.cs#L303) of the ASP.net MVC sample app implements this call.

There you go - users can now easily connect and manage their Azure subscriptions with your application.

