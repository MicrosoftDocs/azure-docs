<properties
   pageTitle="Application Objects and Service Principal Objects | Microsoft Azure"
   description="A discussion of the relationship between Application objects and ServicePrincipal objects in Azure Active Directory"
   documentationCenter="dev-center-name"
   authors="msmbaldwin"
   manager="mbaldwin"
   services="active-directory"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="05/16/2016"
   ms.author="mbaldwin"/>


# Application Objects and Service Principal Objects

This diagram illustrates the relationship between an Application object and a ServicePrincipal object in the context of an sample application called **HR app**. There are three tenants: **Adatum**, the tenant that develops the app, and **Contoso** and **Fabrikam**, the tenants that consume the **HR app**.

![Relationship between an Application object and a ServicePrincipal object](./media/active-directory-application-objects/application-objects-relationship.png)


When you register an app in the Azure Management Portal, two objects are created in your directory tenant:

- **Application object**: This object represents a definition for your app. You can find a detailed description of its properties in the **Application Object** section below.

- **ServicePrincipal object**: This object represents an instance of your app in your directory tenant. You can apply policies to ServicePrincipal objects, including assigning permissions to the ServicePrincipal that allow the app to read your tenant’s directory data. Whenever you change your Application object, the changes are also applied to the associated ServicePrincipal object in your tenant.


> [AZURE.NOTE] If your application is configured for external access, changes to the application object are not reflected in a consumer tenant’s ServicePrincipal until the consumer tenant removes access and grants access again.



In the diagram above, Step "1" is the process of creating the Application and ServicePrincipal objects.

In Step 2, when a company admin grants access, a ServicePrincipal object is created in the company's Azure AD tenant and is assigned the directory access level that the company admin granted.

In Step 3, the consumer tenants of an app (such as Contoso and Fabrikam) each have their own ServicePrincipal object that represents their instance of the app. In this example, they each have a ServicePrincipal that represents the HR app.





## Application Object Properties

The following tables list all the properties of an application object and includes important details for developers. These properties apply to web applications, web APIs, and native client applications that are registered with Azure AD.


### General

Property | Description
| ------------- | -----------
| Name | Display name of the app. Required property in the **Add Application** wizard.
| Logo | An app logo that represents your app or company. This logo allows external users to more easily associate the grant access request with your app. When uploading a logo, please adhere to the specifications in the **Upload logo** wizard. If you don’t supply a logo, a default logo appears.
| External access | Determines whether users in external organizations are allowed to grant your app single sign-on and access to data in their organization's directory. This control affects only the ability to grant access. It does not change access that has already been granted. Only Company Administrators can grant access.


### Single Sign-On

Property | Description
| ------------- | -----------
| App ID URI | A unique logical identifier for your app. Required property in the **Add Application** wizard. <br><br>Because the App ID URI is a logical identifier, it does not need to resolve to an Internet address. It is presented by your app when sending a single sign-on request to Azure AD. Azure AD identifies your app and sends the sign-on response (a SAML token) to the Reply URL that was provided during app registration. Use the App ID URI value to set the wtrealm property (for WS-Federation) or the Issuer property (for SAML-P) when making a sign-in request. The **App ID URI** must be a unique value in your organization’s Azure AD.<br><br>**Note**: When enabling an app for external users, the value of the App ID URI of the app must be an address in one of your directory’s verified domains. As a result, it cannot be a URN. This safeguard prevents other organizations from specifying (and taking) unique property that belongs to your organization. During development, you can change your App ID URI to a location in your organization’s initial domain (if you haven’t verified a custom/vanity domain), and update your app to use this new value. The initial domain is the 3-level domain that you create during sign up, such as contoso.onmicrosoft.com.
| App URL | The address of a web page where users can sign in and use your app. Required property in the **Add Application** wizard.<br><BR>**Note**: The value set for this property in the Add Application wizard is also set as the value of the Reply URL.
| Reply URL | The physical address of your app. Azure AD sends a token with the single sign-on response to this address. During first registration in the **Add Application** wizard, the value set for the App URL is also set as the value of the Reply URL. When making a sign in request, use the Reply URL value to set the wreply property (for WS-Federation) or the **AssertionConsumerServiceURL** property (for SAML-P).<br><BR>**Note**: When enabling an app for external users, the Reply URL must be an **https://** address.
| Federation Metadata URL | (Optional). Represents the physical URL of the federation metadata document for your app. It is required to support SAML-P sign out. Azure AD downloads the metadata document that is hosted at this endpoint and uses it to discover the public portion of the certificate that you use to verify the signature on your sign-out requests and your app’s sign-out URL. You cannot configure this property when you first add your app. It can only be configured later.<br><BR>**Note**: If you need to support SAML-P sign-out, but you do not have a federation metadata endpoint for your app, contact Customer Support for other options.


### Calling the Graph API or Web APIs

Property | Description
| ------------- | -----------
| Client ID | The unique identifier for your app. You need to use this identifier in calls to the Graph API or other web APIs registered with Azure AD. Azure AD automatically generates this value during app registration and it cannot be changed.<BR><BR>To enable your app to access the directory (for read or write access) through the Graph API, you need a Client ID and a key (known in OAuth 2.0 as a client secret). Your app uses the Client ID and key to request an access token from the Azure AD OAuth 2.0 token endpoint. (To view all Azure AD endpoints, in the command bar, click **View endpoints**.) When using the Graph API to get or set (change) directory data, your app uses this access token in the Authorize header of the request to the Graph API.
| Keys | If your app reads or writes data in Azure AD, such as data that is made available through the Graph API, your app needs a key. When you request an access token to call the Graph API, your app supplies its **Client ID** and **Key**. The token endpoint uses the ID and key to authenticate your app before issuing the access token. You can create multiple keys to address key rollover scenarios. And, you can delete keys that are expired, compromised, or no longer in use.
| Manage Access | Choose from one of three different access levels: single sign-on (SSO), SSO and read directory data, or SSO and read/write directory data. You can also remove access. <br><BR>**Note**: Changes to the directory access level of your app apply only to your directory. The changes do not apply to customers who have granted access to your app.


### Native Clients

Property | Description
| ------------- | -----------
| Redirect URI | The URI to which Azure AD will redirect the user-agent in response to an OAuth 2.0 authorization request. The value does not need to be a physical endpoint, but must be a valid URI.

##
