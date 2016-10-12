<properties
   pageTitle="Configurable Token Lifetimes in Azure Active Directory  | Microsoft Azure"
   description="This feature is used by admins and developers to specify the lifetimes of tokens issued by Azure AD."
   services="active-directory"
   documentationCenter=""
   authors="billmath"
   manager="femila"
   editor=""/>

<tags
   ms.service="active-directory"  
   ms.workload="identity"
   ms.tgt_pltfrm="na"
   ms.devlang="na"
   ms.topic="article"
   ms.date="10/06/2016"
   ms.author="billmath"/>


# Configurable Token Lifetimes in Azure Active Directory (Public Preview)

>[AZURE.NOTE]
>This capability is currently in public preview.  You should be prepared to revert or remove any changes.  We are opening up this feature for everyone to try during the public preview, however, certain aspects may require an [Azure AD Premium subscription](active-directory-get-started-premium.md) once generally available.


## Introduction
This feature is used by admins and developers to specify the lifetimes of tokens issued by Azure AD. Token lifetimes can be configured for all apps in a tenant, for a multi-tenant application, or for a specific Service Principal in a tenant.

In Azure AD, a policy object represents a set of rules enforced on individual applications or all applications in a tenant.  Each type of policy has a unique structure with a set of properties that are then applied to objects to which they are assigned.

A policy can be designated as the default for a tenant. This policy then takes effect on any application that resides within that tenant as long as it is not overridden by a policy with a higher priority. Policies can also be assigned to specific applications. The order of priority varies by policy type.

Token lifetime policies can be configured for refresh tokens, access tokens, session tokens, and ID tokens.


### Access tokens
An access token is used by a client to access a protected resource. An access token can only be used for a specific combination of user, client, and resource. Access tokens cannot be revoked and are valid until their expiry. A malicious actor that has obtained an access token can use it for extent of its lifetime.  Adjusting access token lifetime is a trade-off between improving system performance and increasing the amount of time that the client retains access after the user’s account is disabled.  Improved system performance is achieved by reducing the number of times a client needs to acquire a fresh access token. 

### Refresh tokens
When a client acquires an access token to access a protected resource, it receives both a refresh token and an access token. The refresh token is used to obtain new access/refresh token pairs when the current access token expires. Refresh tokens are bound to combinations of user and client. They can be revoked and their validity is checked every time they are used.

It is important to make a distinction between confidential and public clients. 
Confidential clients are applications that are able to securely store a client password, allowing them to prove that requests are coming from the client application and not a malicious actor. As these flows are more secure, the default lifetimes of refresh tokens issued to these flows are higher and cannot be changed using policy.

Due to limitations of the environment that the applications run in, public clients are unable to securely store a client password. Policies can be set on resources to prevent refresh tokens from public clients older than a specified period from obtaining a new access/refresh token pair (Refresh Token Max Inactive Time).  Additionally, policies can be used to set a period of time beyond which the refresh tokens are no longer accepted (Refresh Token Max Age).  Adjusting refresh token lifetime allows you to control when and how often the user is required to reenter credentials instead of being silently re-authenticated when using a public client application.


### ID tokens
ID tokens are passed to web sites and native clients and contain profile information about a user. An ID token is bound to a specific combination of user and client. ID tokens are considered valid until expiry.  Normally, a web application matches a user’s session lifetime in the application to the lifetime of the ID token issued for the user.  Adjusting ID token lifetime allows you to control how often the web application will expire the application session and require the user to be re-authenticated with Azure AD (either silently or interactively).

### Single sign-on session token
When a user authenticates with Azure AD, a single sign-on session is established with the user’s browser and Azure AD.  The Single Sign-On Session Token, in the form of a cookie, represents this session. It is important to note that the SSO session token is not bound to a specific resource/client application. SSO session tokens can be revoked and their validity is checked every time they are used.

There are two kinds of SSO session tokens. Persistent session tokens are stored as persistent cookies by the browser and non-persistent session tokens are stored as session cookies (these are destroyed when the browser is closed).

Non-persistent session tokens have a lifetime of 24 hours whereas persistent tokens have a lifetime of 180 days. Any time the SSO session token is used within its validity period, the validity period is extended another 24 hours or 180 days. If the SSO session token is not used within its validity period, it is considered expired and will no longer be accepted. 

Policies can be used to set a period of time after the first session token was issued beyond which the session tokens are no longer accepted (Session Token Max Age).  Adjusting session token lifetime allows you to control when and how often the user is required to re-enter credentials instead of being silently authenticated when using a web application.

### Token lifetime policy properties
A token lifetime policy is a type of policy object that contains token lifetime rules.  The properties of the policy are used to control specified token lifetimes.  If no policy is set, the system enforces the default lifetime value.


### Configurable token lifetime properties
Property|Policy property string|Affects|Default|Minimum|Maximum|
----- | ----- | ----- |----- | ----- | ----- |
Access Token Lifetime|	AccessTokenLifetime|Access tokens, ID tokens, SAML2 tokens|1 hour|10 minutes|1 day|
Refresh Token Max Inactive Time|	MaxInactiveTime	|Refresh tokens	|14 days|10 minutes|	90 days|
Single-Factor Refresh Token Max Age|	MaxAgeSingleFactor	|Refresh tokens (for any users)	|90 days|10 minutes	|Until-revoked*|
Multi-Factor Refresh Token Max Age|	MaxAgeMultiFactor|	Refresh tokens (for any users)|	90 days|10 minutes|Until-revoked*|
Single-Factor Session Token Max Age	|MaxAgeSessionSingleFactor**	|Session tokens(persistent and non-persistent)|	Until-revoked	|10 minutes	|Until-revoked*|
Multi-Factor Session Token Max Age|	MaxAgeSessionMultiFactor***|	Session tokens (persistent and non-persistent)|	Until-revoked|	10 minutes|	Until-revoked*



- *365 days is the maximum explicit length that can be set for these attributes.
- **If MaxAgeSessionSingleFactor is not set then this value takes the MaxAgeSingleFactor value. If neither parameter is set, the property takes on the default value (Until-revoked).
- ***If MaxAgeSessionMultiFactor is not set then this value takes the MaxAgeMultiFactor value. If neither parameter is set, the property takes on the default value (Until-revoked).

### Exceptions
Property|Affects|Default|
----- | ----- | ----- |
Refresh Token Max Inactive Time (federated users with insufficient revocation information)|Refresh tokens (Issued for federated users with insufficient revocation information)|12 hours|
Refresh Token Max Inactive Time (Confidential Clients)|	Refresh tokens (Issued for Confidential Clients)|90 days|
Refresh token Max Age (Issued for Confidential Clients) |	Refresh tokens (Issued for Confidential Clients) |Until-revoked

### Priority and evaluation of policies

Token Lifetime policies can be created and assigned to specific applications, tenants and service principals. This means that it is possible for multiple policies to apply to a specific application. The Token Lifetime policy that takes effect follows these rules:


- If a policy is explicitly assigned to the service principal, it will be enforced. 
- If no policy is explicitly assigned to the service principal, a policy explicitly assigned to the parent tenant of the service principal will be enforced. 
- If no policy is explicitly assigned to the service principal or the tenant, the policy assigned to the application will be enforced. 
- If no policy has been assigned to the service principal, the tenant, or the application object, the default values will be enforced (see table above).

For more information on the relationship between application objects and service principal objects in Azure AD, see [Application and service principal objects in Azure Active Directory](active-directory-application-objects.md).

A token’s validity is evaluated at the time it is used. The policy with the highest priority on the application that is being accessed takes effect.


>[AZURE.NOTE]
>Example
>
>A user wants to access 2 web applications, A and B. 
>
>
>- Both applications are in the same parent tenant. 
>- Token lifetime policy 1 with a Session Token Max Age of 8 hours is set as the parent tenant’s default.
>- Web application A is a regular use web application and isn’t linked to any policies. 
>- Web application B is used for highly sensitive processes and its service principal is linked to token lifetime policy 2 with a Session Token Max Age of 30 minutes.
>
>At 12:00PM the user opens up a new browser session and tries to access web application A. the user is redirected to Azure AD and is asked to sign-in. This drops a cookie with a session token in the browser. The user is redirected back to web application A with an ID token that allows them to access the application.
>
>At 12:15PM, the user then tries to access web application B. The browser redirects to Azure AD which detects the session cookie. Web application B’s service principal is linked to a policy 1, but is also part of the parent tenant with default policy 2. Policy 2 takes effect since policies linked to service principals have a higher priority than tenant default policies. The session token was originally issued within the last 30 minutes so it is considered valid. The user is redirected back to web application B with an ID token granting them access.
>
>At 1:00PM the user tries navigating to web application A. The user is redirected to Azure AD. Web application A is not linked to any policies, but since it is in a tenant with default policy 1, this policy takes effect. The session cookie is detected that was originally issued within the last 8 hours and the user is silently redirected back to web application A with a new ID token without needing to authenticate.
>
>The user immediately tries to access web application B. The user is redirected to Azure AD. As before, policy 2 takes effect. As the token was issued longer than 30 minutes ago, the user is then prompted to re-enter their credentials, and a brand new session and ID token are issued. The user can then access web application B.

## Configurable policy properties: In-Depth

### Access token lifetime

**String:** AccessTokenLifetime

**Affects:** Access tokens, ID tokens

**Summary:** This policy controls how long access and ID tokens for this resource are considered valid. Reducing the access token lifetime mitigates the risk of an access or ID token being used by a malicious actor for an extended period of time (as they cannot be revoked) but also adversely impacts performance as the tokens will have to be replaced more often.

### Refresh token max inactive time

**String:** MaxInactiveTime

**Affects:** Refresh tokens

**Summary:** This policy controls how old a refresh token can be before a client can no longer use it to retrieve a new access/refresh token pair when attempting to access this resource. Since a new Refresh token is usually returned a refresh token is used, the client must not have reached out to any resource using the current refresh token for the specified period of time before this policy would prevent access. 

This policy will force users who have not been active on their client to re-authenticate to retrieve a new refresh token. 

It is important to note that the Refresh Token Max Inactive Time must be set to a lower value than the Single-Factor Token Max Age and the Multi-Factor Refresh Token Max Age.

### Single-factor refresh token max age

**String:** MaxAgeSingleFactor

**Affects:** Refresh tokens

**Summary:** This policy controls how long a user can continue to use refresh tokens to get new access/refresh token pairs after the last time they authenticated successfully with only a single factor. Once a user authenticates and receives a new refresh token, they will be able to use the refresh token flow (as long as the current refresh token is not revoked and it is not left unused for longer than the inactive time) for the specified period of time. At that point, users will be forced to re-authenticate to receive a new refresh token. 

Reducing the max age will force users to authenticate more often. Since single-factor authentication is considered less secure than a multi-factor authentication, it is recommended that this policy is set to an equal or lesser value than the Multi-Factor Refresh Token Max Age Policy.

### Multi-factor refresh token max age

**String:** MaxAgeMultiFactor

**Affects:** Refresh tokens

**Summary:** This policy controls how long a user can continue to use refresh tokens to get new access/refresh token pairs after the last time they authenticated successfully with multiple factors. Once a user authenticates and receives a new refresh token, they will be able to use the refresh token flow (as long as the current refresh token is not revoked and it is not left unused for longer than the inactive time) for the specified period of time. At that point, users will be forced to re-authenticate to receive a new refresh token. 

Reducing the max age will force users to authenticate more often. Since single-factor authentication is considered less secure than a multi-factor authentication, it is recommended that this policy is set to an equal or greater value than the Single-Factor Refresh Token Max Age Policy.

### Single-factor session token max age

**String:** MaxAgeSessionSingleFactor

**Affects:** Session tokens (persistent and non-persistent)

**Summary:** This policy controls how long a user can continue to use session tokens to get new ID and session tokens after the last time they authenticated successfully with only a single factor. Once a user authenticates and receives a new session token, they will be able to use the session token flow (as long as the current session token is not revoked or expired) for the specified period of time. At that point, users will be forced to re-authenticate to receive a new session token. 

Reducing the max age will force users to authenticate more often. Since single-factor authentication is considered less secure than a multi-factor authentication, it is recommended that this policy is set to an equal or lesser value than the Multi-Factor Session Token Max Age Policy.

### Multi-factor session token max age

**String:** MaxAgeSessionMultiFactor

**Affects:** Session tokens (persistent and non-persistent)

**Summary:** This policy controls how long a user can continue to use session tokens to get new ID and session tokens after the last time they authenticated successfully with multiple factors. Once a user authenticates and receives a new session token, they will be able to use the session token flow (as long as the current session token is not revoked or expired) for the specified period of time. At that point, users will be forced to re-authenticate to receive a new session token. 

Reducing the max age will force users to authenticate more often. Since single-factor authentication is considered less secure than a multi-factor authentication, it is recommended that this policy is set to an equal or greater value than the Single-Factor Session Token Max Age Policy.

## Sample token lifetime policies

Being able to create and manage token lifetimes for apps, service principals, and your overall tenant exposes all kinds of new scenarios possible in Azure AD.  We're going to walk through a few common policy scenarios that will help you impose new rules for:


- Token Lifetimes
- Token Max Inactive Times
- Token Max Age

We'll walk through a few scenarios including:


- Managing a Tenant's Default Policy
- Creating a Policy for Web Sign-in
- Creating a Policy for Native Apps calling a Web API
- Managing an Advanced Policy 

### Prerequisites
In the sample scenarios we'll be creating, updating, linking, and deleting policies on apps, service principals, and your overall tenant.  If you are new to Azure AD, checkout [this article](active-directory-howto-tenant.md) to help you get started before proceeding with these samples.  


1. To begin, download the latest [Azure AD PowerShell Cmdlet Preview](https://www.powershellgallery.com/packages/AzureADPreview). 
2.	Once you have the Azure AD PowerShell Cmdlets, run Connect command to sign into your Azure AD admin account. You'll need to do this whenever you start a new session.
        
        Connect-AzureAD -Confirm

3.	Run the following command to see all policies that have been created in your tenant.  This command should be used after most operations in the following scenarios.  It will also help you get the **Object ID** of your policies. 
        
        Get-AzureADPolicy

### Sample: Managing a tenant's default policy

In this sample, we will create a policy that allows your users to sign in less frequently across your entire tenant. 

To do this, we create a token lifetime policy for Single-Factor Refresh Tokens that is applied across your tenant. This policy will be applied to every application in your tenant, and each service principal that doesn’t already have a policy set to it. 

1.	**Create a Token Lifetime Policy.** 

Set the Single-Factor Refresh Token to "until-revoked" meaning it won't expire until access is revoked.  The policy definition below is what we will be creating:
        
        @("{
          `"TokenLifetimePolicy`":
              {
                 `"Version`":1, 
                 `"MaxAgeSingleFactor`":`"until-revoked`"
              }
        }")

Then run the following command to create this policy. 

		
    New-AzureADPolicy -Definition @("{`"TokenLifetimePolicy`":{`"Version`":1, `"MaxAgeSingleFactor`":`"until-revoked`"}}") -DisplayName TenantDefaultPolicyScenario -IsTenantDefault $true -Type TokenLifetimePolicy
		
To see your new policy and get its ObjectID, run the following command.

    Get-AzureADPolicy
&nbsp;&nbsp;2.	**Update the Policy**

You've decided that the first policy is not quite as strict as your service requires, and have decided you want your Single-Factor Refresh Tokens to expire in 2 days. Run the following command. 
		
    Set-AzureADPolicy -ObjectId <ObjectID FROM GET COMMAND> -DisplayName TenantDefaultPolicyUpdatedScenario -Definition @("{`"TokenLifetimePolicy`":{`"Version`":1,`"MaxAgeSingleFactor`":`"2.00:00:00`"}}")
		
&nbsp;&nbsp;3. **You're done!** 

### Sample: Creating a policy for web sign-in

In this sample, we will create a policy that will require your users to authenticate more frequently into your Web App. This policy will set the lifetime of the Access/Id Tokens and the Max Age of a Multi-Factor Session Token to the service principal of your web app.

1.	**Create a Token Lifetime Policy.**

This policy for Web Sign-in will set the Access/Id Token lifetime and the Max Single-Factor Session Token Age to 2 hours.

    New-AzureADPolicy -Definition @("{`"TokenLifetimePolicy`":{`"Version`":1,`"AccessTokenLifetime`":`"02:00:00`",`"MaxAgeSessionSingleFactor`":`"02:00:00`"}}") -DisplayName WebPolicyScenario -IsTenantDefault $false -Type TokenLifetimePolicy

To see your new policy and get its ObjectID, run the following command.

    Get-AzureADPolicy
&nbsp;&nbsp;2.	**Assign the policy to your service principal.**

We're going to link this new policy with a service principal.  You'll also need a way to access the **ObjectId** of your service principal. You can query the [Microsoft Graph](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#serviceprincipal-entity) or go to our [Graph Explorer Tool](https://graphexplorer.cloudapp.net/) and sign into your Azure AD account to see all your tenant's service principals. 

Once you have the **ObjectId**, Run the following command.
        
    Add-AzureADServicePrincipalPolicy -ObjectId <ObjectID of the Service Principal> -RefObjectId <ObjectId of the Policy>
&nbsp;&nbsp;3.	**You're Done!** 

 

### Sample: Creating a policy for native apps calling a Web API

>[AZURE.NOTE]
>Linking policies to applications is currently disabled.  We are working on enabling this shortly.  This page will be updated as soon as the feature is available.

In this sample, we will create a policy that requires users to authenticate less and will lengthen the amount of time they can be inactive without having to authenticate again. The policy will be applied to the Web API, that way when the Native App requests it as a resource this policy will be applied.

1.	**Create a Token Lifetime Policy.** 

This command will create a strict policy for a Web API. 
        
    New-AzureADPolicy -Definition @("{`"TokenLifetimePolicy`":{`"Version`":1,`"MaxInactiveTime`":`"30.00:00:00`",`"MaxAgeMultiFactor`":`"until-revoked`",`"MaxAgeSingleFactor`":`"180.00:00:00`"}}") -DisplayName WebApiDefaultPolicyScenario -IsTenantDefault $false -Type TokenLifetimePolicy
         
To see your new policy and get its ObjectID, run the following command.

    Get-AzureADPolicy

&nbsp;&nbsp;2.	**Assign the policy to your Web API**.

We're going to link this new policy with an application.  You'll also need a way to access the **ObjectId** of your application. The best way to find your app's **ObjectId** is to use the [Azure Portal](https://portal.azure.com/). 

Once you have the **ObjectId**, Run the following command.

    Add-AzureADApplicationPolicy -ObjectId <ObjectID of the App> -RefObjectId <ObjectId of the Policy>

&nbsp;&nbsp;3.	**You're Done!** 

### Sample: Managing an advanced policy 

In this sample, we will create a few policies to demonstrate how the priority system works, and how you can manage multiple policies applied to several objects. This will give some insight into the priority of policies explained above, and will also help you manage more complicated scenarios. 

1.	**Create a Token Lifetime Policy**

So far pretty simple. We've created a tenant default policy that sets the Single-Factor Refresh Token lifetime to 30 days. 

    New-AzureADPolicy -Definition @("{`"TokenLifetimePolicy`":{`"Version`":1,`"MaxAgeSingleFactor`":`"30.00:00:00`"}}") -DisplayName ComplexPolicyScenario -IsTenantDefault $true -Type TokenLifetimePolicy
To see your new policy and get it's ObjectID, run the following command.
 
    Get-AzureADPolicy

&nbsp;&nbsp;2.	**Assign the Policy to a Service Principal**

Now we have a policy on the entire tenant.  Let's say we want to preserve this 30 day policy for a specific service principal, but change the tenant default policy to be the upper limit of "until-revoked". 

First, We're going to link this new policy with our service principal.  You'll also need a way to access the **ObjectId** of your service principal. You can query the [Microsoft Graph](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#serviceprincipal-entity) or go to our [Graph Explorer Tool](https://graphexplorer.cloudapp.net/) and sign into your Azure AD account to see all your tenant's service principals. 

Once you have the **ObjectId**, Run the following command.

    Add-AzureADServicePrincipalPolicy -ObjectId <ObjectID of the Service Principal> -RefObjectId <ObjectId of the Policy>

&nbsp;&nbsp;3.	**Set the IsTenantDefault flag to false using the following command**. 

    Set-AzureADPolicy -ObjectId <ObjectId of Policy> -DisplayName ComplexPolicyScenario -IsTenantDefault $false
&nbsp;&nbsp;4.	**Create a new Tenant Default Policy**

    New-AzureADPolicy -Definition @("{`"TokenLifetimePolicy`":{`"Version`":1,`"MaxAgeSingleFactor`":`"until-revoked`"}}") -DisplayName ComplexPolicyScenarioTwo -IsTenantDefault $true -Type TokenLifetimePolicy

&nbsp;&nbsp;5.	 **You're Done!** 

You now have the original policy linked to your service principal and the new policy set as your tenant default policy.  It's important to remember that policies applied to service principals have priority over tenant default policies. 


## Cmdlet Reference

### Manage policies
The following cmdlets can be used to manage policies.</br></br>



#### New-AzureADPolicy
Creates a new policy.

    New-AzureADPolicy -Definition <Array of Rules> -DisplayName <Name of Policy> -IsTenantDefault <boolean> -Type <Policy Type> 

Parameters|Description|Example|
-----| ----- |-----|
-Definition| The array of stringified JSON that contains all the rules of the policy.|-Definition @("{`"TokenLifetimePolicy`":{`"Version`":1,`"MaxInactiveTime`":`"20:00:00`"}}") 
-DisplayName|String of the policy name|-DisplayName MyTokenPolicy
-IsTenantDefault|If true sets the policy as tenant's default policy, if false does nothing|-IsTenantDefault $true
-Type|The type of policy, for token lifetimes always use "TokenLifetimePolicy"|-Type TokenLifetimePolicy
-AlternativeIdentifier [Optional]|Sets an alternative id to the policy.|-AlternativeIdentifier myAltId
</br></br>

#### Get-AzureADPolicy         
Gets all AzureAD Policies or specified policy 
        
    Get-AzureADPolicy 

Parameters|Description|Example|
-----| ----- |-----|
-ObjectId [Optional]|The object Id of the Policy you would like to get. |-ObjectId &lt;ObjectID of Policy&gt; 
</br></br>

#### Get-AzureADPolicyAppliedObject         
Gets all apps and service principals linked to a policy
        
    Get-AzureADPolicyAppliedObject -ObjectId <object id of policy> 

Parameters|Description|Example|
-----| ----- |-----|
-ObjectId|The object Id of the Policy you would like to get.|-ObjectId &lt;ObjectID of Policy&gt;
</br></br>

#### Set-AzureADPolicy
Updates an existing policy
        
    Set-AzureADPolicy -ObjectId <object id of policy> -DisplayName <string> 
 
Parameters|Description|Example|
-----| ----- |-----|
-ObjectId|The object Id of the Policy you would like to get.|-ObjectId &lt;ObjectID of Policy&gt;
-DisplayName|String of the policy name|-DisplayName MyTokenPolicy
-Definition [Optional]|The array of stringified JSON that contains all the rules of the policy.|-Definition @("{`"TokenLifetimePolicy`":{`"Version`":1,`"MaxInactiveTime`":`"20:00:00`"}}") 
-IsTenantDefault [Optional]|If true sets the policy as tenant's default policy, if false does nothing|-IsTenantDefault $true
-Type [Optional]|The type of policy, for token lifetimes always use "TokenLifetimePolicy"|-Type TokenLifetimePolicy
-AlternativeIdentifier [Optional]|Sets an alternative id to the policy.|-AlternativeIdentifier myAltId
</br></br>

#### Remove-AzureADPolicy         
Deletes the specified policy

     Remove-AzureADPolicy -ObjectId <object id of policy>

Parameters|Description|Example|
-----| ----- |-----|
-ObjectId|The object Id of the Policy you would like to get.|-ObjectId &lt;ObjectID of Policy&gt;
</br></br>

### Application policies
The following cmdlets can be used for application policies.</br></br>

#### Add-AzureADApplicationPolicy         
Links the specified policy to an application

    Add-AzureADApplicationPolicy -ObjectId <object id of application> -RefObjectId <object id of policy>

Parameters|Description|Example|
-----| ----- |-----|
-ObjectId|The object Id of the Application.|-ObjectId &lt;ObjectID of Application&gt; 
-RefObjectId|The object Id of the Policy. |-RefObjectId &lt;ObjectID of Policy&gt;
</br></br>

#### Get-AzureADApplicationPolicy        
Gets the policy assigned to an application

    Get-AzureADApplicationPolicy -ObjectId <object id of application>

Parameters|Description|Example|
-----| ----- |-----|
-ObjectId|The object Id of the Application.|-ObjectId &lt;ObjectID of Application&gt; 
</br></br>

#### Remove-AzureADApplicationPolicy        
Removes a policy from an application

    Remove-AzureADApplicationPolicy -ObjectId <object id of application> -PolicyId <object id of policy>

Parameters|Description|Example|
-----| ----- |-----|
-ObjectId|The object Id of the Application.|-ObjectId &lt;ObjectID of Application&gt; 
-PolicyId| The ObjectId of Policy.|-PolicyId &lt;ObjectID of Policy&gt;
</br></br>

### Service principal policies
The following cmdlets can be used for service principal policies.</br></br>

#### Add-AzureADServicePrincipalPolicy         
Links the specified policy to a service principal

    Add-AzureADServicePrincipalPolicy -ObjectId <object id of service principal> -RefObjectId <object id of policy>

Parameters|Description|Example|
-----| ----- |-----|
-ObjectId|The object Id of the Application.|-ObjectId &lt;ObjectID of Application&gt; 
-RefObjectId|The object Id of the Policy. |-RefObjectId &lt;ObjectID of Policy&gt;
</br></br>

#### Get-AzureADServicePrincipalPolicy        
Gets any policy linked to the specified service principal

    Get-AzureADServicePrincipalPolicy -ObjectId <object id of service principal>
 
Parameters|Description|Example|
-----| ----- |-----|
-ObjectId|The object Id of the Application.|-ObjectId &lt;ObjectID of Application&gt; 
</br></br>

#### Remove-AzureADServicePrincipalPolicy         
Removes the policy from specified service principal

    Remove-AzureADServicePrincipalPolicy -ObjectId <object id of service principal>  -PolicyId <object id of policy>
 
Parameters|Description|Example|
-----| ----- |-----|
-ObjectId|The object Id of the Application.|-ObjectId &lt;ObjectID of Application&gt; 
-PolicyId| The ObjectId of Policy.|-PolicyId &lt;ObjectID of Policy&gt;
