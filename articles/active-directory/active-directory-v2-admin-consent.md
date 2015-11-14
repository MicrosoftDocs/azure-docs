<properties
	pageTitle="App Model v2.0 Admin Consent | Microsoft Azure"
	description="A spec for the admin consent feature in the MS STS"
	services="active-directory"
	documentationCenter=""
	authors="dstrockis"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="11/10/2015"
	ms.author="dastrock"/>

# MS STS - Admin Consent

> [AZURE.NOTE] Azure AD has a feature known as "admin_consent" which is used in provisioning flows for multi-tenant applications.  The admin consent feature is used for a few different scenarios today:
>
> - pre-granting consent for all users in a tenant
> - apps that require "admin-only" delegated permissions
> - daemon apps that require direct application permissions for the client credentials OAuth flow.
>
> As part of the inital set of features for 3rd party --> 1st party auth, we will need to incorporate admin_consent in the MS STS.  We have decided to change how this feature works in app model v2, because the v1 admin_consent feature had a few important drawbacks:
>
> - Several things happen at the click of a button: a servicePrincipal is created, delegations are created for all users, and roles are assigned to apps.  It is not clear to directory admins that all of this occurs at the time of consent.
> - All of the above actions are 'management' tasks that the admin should do in the context of other management tasks.  I.e., in the Azure Portal
> - Conflating these management tasks with an OAuth/OIDC request is confusing to developers (from anecdotal experience)
> - The admin_consent UI is far too similar to the user consent UI, and one can be mistaken for the other
> - The admin_consent UI is overly simple and could be used to provide richer functionalities in the future

> This document describes how the admin_consent feature should work in app model v2.  It is written as a documentation article intended for customers.  Comments for engineering are provided in these notes.

## Intro

In Azure AD, there are certain permissions which can only be granted to application by an administrator of an organization.  These include:

#### Admin-only delegated permissions

APIs that accept tokens from the MS STS can specify that a permission for their API as an ["admin-only" delegated permissions](#admin-only-delegated-permissions).  This restricts any regular employees from granting this permission to an application through [consent]().  An example of one such permission is the [`Directory.ReadWrite`]() permission on the Microsoft Graph, which allows an application to update any data within an Azure AD tenant.  These "admin-only" permissions are [delegated permissions]() - that is, they are acquired on behalf of a user and can only be used in the context of that user.  For instance, an application acting on behalf of a regular employee would not be able to remove an employee of the company, even if the application had been granted the `Directory.ReadWrite` permission.  The regular employee does not have authorization to perform such actions themselves.

#### Direct application permissions

APIs can also expose "application permissions".  As opposed to delegated permissions, application permissions are granted directly to your application, not on behalf of any particular user.  These permissions are typically used for [daemon scenarios](), or long-running background processes that do not require a user to sign in. As an example, the Microsoft Graph exposes a `Directory.Read` application permission, which allows an application to read all data in an Azure AD tenant without requiring user sign in.  Only administrators of a company are able to grant application permissions to an application.

#### Pre-granted permissions for all users

Administrators of a company also have the ability to "pre-grant" any permission for all employees in their company.  When an admin consents to permissions for all employees, the employees themselves do not have to grant the application the permissions that it requests.  Effecitvely, this action supresses the consent page that users would normally see for a given application.

If you are building an application that requires any of these permissions, you will need to engage company administrators to review & grant those pemrmissions to your app.

For [line of business applications]() that target only a single company, you can follow the steps below to configure your app and get a company administrator to visit the [Azure AD app gallery]().

For [multi-tenant SaaS applications](), you will need to build the permission request flow into the application itself.  Often, SaaS applications that support business customers have a "sign-up your business" flow.  Dropbox is one good example:

![Business Sign Up Button](./media/active-directory-v2-admin-consent/dropbox_business.PNG)

This sign up flow is a good opportunity to provide a way for admins to connect the app to their company's Azure AD directory, [if they have one](determining-if-a-user-has-aad.md).  But of course, you can choose to engage admins at whatever point in your application makes the most sense.  Whenever you choose to acquire permissions from the admin, you can use the [Azure AD app gallery]() to perform the permissions request.  The steps below outline the process you can take to successfully acquire the permissions your app needs.

## 1. Declare permissions your app needs

In your app regsitration on [apps.dev.microsoft.com](https://apps.dev.microsoft.com), declare the set of permissions that your app will need, including delegated and direct application permissions.  

> [AZURE.NOTE]
>
> - Details forthcoming on work required for app reg portal
> - The app portal will write the RequiredResourceAccess property on the application object

## 2. Determine if the user is an admin (Optional)

When you redirect the user to the app gallery, the app gallery will enforce that the user must have the necessary privileges to grant your application the permissions you requested in the app registration portal.  However, you might only want to give the user the option to connect their directory if you know they are indeed an admin ahead of time.

To do this, you can first configure your application to receive [group claims]() in the app registration portal.  You can then [sign the user into the app with their work account](), requesting only the "Sign you in & read your profile" permission.  When your application receives a sign-in token from the MS STS, you can inspect these group claims to determine if the user has administrative privileges.  If the user is a member of [these well-known]() groups, you can safely assume that they will be able to grant your application the permissions it needs. 

> [AZURE.NOTE]
>
> - This is an optimization.  Group claims are not supported on MS STS at this time
> - The WIDs claim might be more appropriate here if the feature existed for all 3rd parties.
> - App would need the abiilty to call the Graph API in the case of a group claim overage

## 3. Send the user to the app gallery

When you want to request permissions from the admin, your app must send the user to the Azure AD app gallery by redirecting to this URL:

```
302 https://login.microsoftonline.com/admin_consent
?client_id=3cd6e33d-71bd-4cd4-90a6-cf7f5a41e429
&tenant=fd4d5422-bc29-4405-baac-6f69fb94eb5c
&state=any-value-goes-here
&redirect_uri=https://my-app.com/sign_up
```

> [AZURE.NOTE] This URL will be hosted by the MS STS for the immediate future.  We will then migrate it to portal.azure.com or some other app gallery location, where administrative app management can take place

The admin_consent endpoint supports a few query string parameters:

| Parameter |  | Description |
| ----------------------- | ------------------------------- | ------------------- |
| client_id | required | The unique id of your app, like `3cd6e33d-71bd-4cd4-90a6-cf7f5a41e429`. |
| tenant | optional | The name or id of the tenant in which permissions are being requested. If you do not know ahead of time which tenant the admin belongs to, omit this parameter.  However, if you have previously signed in the user, you can use the tenant id here, as in `fd4d5422-bc29-4405-baac-6f69fb94eb5c`.  Using the tenant id in the path will ensure that the admin assigns permissions to your application in that specific tenant. |
| state | optional | A string that can take any form as long as it is URL-safe.  The string will be included in the response, unchanged.  It will not be interpreted by the gallery.  Typically the state is used to encode data about an ongoing sign-up/registration process, which can be consumed by the application again once the admin has completed granting permissions to the app. |
| redirect_uri | optional | A location to return after the admin has completed granting permissions to the app.  If ommitted, the app's registered [sign-up URL]() will be used.  If the app has not declared a sign-up URL, the app's registered sign-on URL will be used. |
 
## 4. The admin grants permissions to your app 

When you direct the user to the admin_consent endpoint, they will be asked to provision the app for their company by granting the permissions that your app requested in the app registration portal.

> [AZURE.NOTE]
>
> - At this point, the MS STS shows the admin the consent UI.  In the immediate term, this can remain the same UI as exists on Evo today.
> - In the short term we will want to change this UI to be differentiated from the user consent UI.  
> - The permissions shown in the request UI will be read from the applications requiredResourceAccess property.  Graph API v2 will have to expose this property for read and write.
> - the requiredResourceAccess can maintain the same schema as exists in AAD v1 today.  We may add additional properties to the schema to support new features, but no changes are necessary to support the existing capabilities in MS STS  

If you have also [published your app into the Azure AD app gallery](), the admin will be able to reach this page by browsing to your app in the gallery.  Publishing your app allows Microsoft to drive adoption of your application by recommending to it to companies that are likely to be interested.

At this point in time, the admin may also be able to configure additional settings for your application, including security policies in their directory and the assignment of users to the application.

> [AZURE.NOTE] 
>
> - When this UI is moved to a proper gallery, the UI can evolve to include richer functionality, like role assignments and policy config.
> - When the admin consents, the MS STS will call consentToApp on the Graph API, which will add the servicePrincipal to the tenant, write an allPrincipals delegation in the tenant, and assign role assignments to the servicePrincipal  

## 5. Handle response from the app gallery

When the admin is finished granting permissions to your application, they will be redirected to your application to continue which ever experience your app had begun.  The result from the admin_consent endpoint will be a 302 redirect to your app with the following query string parameters:

```
302 https://my-app.com/sign_up
?tenant=fd4d5422-bc29-4405-baac-6f69fb94eb5c
&state=any-value-goes-here
```

| Parameter |  | Description |
| ----------------------- | ------------------------------- | ------------------- |
| tenant | guaranteed | The id of the tenant to which your app has been added, like `3cd6e33d-71bd-4cd4-90a6-cf7f5a41e429`. |
| state | optional | The same value provided in the request.  If not provided in the request, it will not be included in the response. |

The location in your app that the request is sent to will be determined as follows:

- If a `redirect_uri` was provided in the request, it will be used for returning the result.
- If no `redirect_uri` was provided, the app's registered `sign_up_uri` will be used. The `sign_up_uri` can be added to your application in the app registration portal.  This location will also be used as a redirect location when the admin adds your application from the Azure AD app gallery.
- If no `sign_up_url` is registered for the application, the app's `sign_on_url` will be used instead.
- If no `sign_on_url` is registered, one of the app's registered `redirect_uri`s will be used.

> [AZURE.NOTE] 
>
> - The sign_up_url will be a new property defined on the application object, with the same semantics as the homepage/sign-on-url property
> - For native apps, instead of a sign_up_url we can redirect to the appropriate app store for app download


## 6. Register for graph notifications (Optional)

When an admin adds your application to their directory by visiting the app gallery directly, they will not always visit your application immediately.  They might continue performing their other directory management duties and choose to visit your app at a later time.  The Azure AD app gallery will, however, warn the admin that they may need to visit your app to complete sign up and enable their employees to sign in.

 > [AZURE.NOTE] Should we have a way for the developer to indicate that sign up is complete?  Either by a flag on the app like 'additionalSignUpRequired' or a ping to AAD that indicates the servicePrincipal is 'active/enabled'?

If you would like to become aware whenever your app is added to a directory, you can [register your app to receive a graph notification]().  The graph notification will inform your application of a newly activated customer so you can take appropriate action - maybe you want to send a thank you email?

> [AZURE.NOTE] Graph notifications are out of scope for MS STS Office scenarios GA

## 7. Check your app's permissions

After the company has connected your application, your applicaiton will have all the permissions that it requested in the app registration portal.  However, the admin may remove these permissions for your application at any point in time, so your application must be written to handle such cases gracefully. There are two strategies you can take in doing so.

The first strategy is to handle errors received during token acquisition.  Each time your application attempts to get a token from the MS STS, you can capture failures and provide a remediation flow for the user to re-grant permissions to your app.  This [code recipe]() shows how you might handle such a case using our MSAL authentication library.

The other strategy is to explicity query Azure AD for your app's permissions.  You can do so by [sending a request to the Microsoft Graph](), using the endpoint

```
https://graph.microsoft.com/applications/{my-app-id}/permissions
```

Details of the permissions API on the Microsoft Graph are available [here]().

> [AZURE.NOTE] A permissions API is out of scope for the MS STS Office scenarios GA

## In Summary

When your app needs permissions from a directory administrator, you need to send the user to the `admin_consent`endpoint, following this general flow:

![Admin Consent Swimlane](./media/active-directory-v2-admin-consent/admin_consent_swimlane.png)

> [AZURE.NOTE] A example mock of how this flow might work in an app is provided [here](https://microsoft-my.sharepoint.com/personal/dastrock_microsoft_com/_layouts/15/guestaccess.aspx?guestaccesstoken=4GVgM0n2iCQoKWTKJlttZ1kdS26N97ZlRtTyQkSvFd0%3d&docid=2_132bb1770e03841d180dfa8da5bfaab90)