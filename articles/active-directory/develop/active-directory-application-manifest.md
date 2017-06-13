---
title: Understanding the Azure Active Directory Application Manifest | Microsoft Docs
description: Detailed coverage of the Azure Active Directory application manifest, which represents an application's identity configuration in an Azure AD tenant, and is used to facilitate OAuth authorization, consent experience, and more.
services: active-directory
documentationcenter: ''
author: bryanla
manager: mbaldwin
editor: ''

ms.assetid: 4804f3d4-0ff1-4280-b663-f8f10d54d184
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 02/08/2017
ms.author: dkershaw;bryanla
ms.custom: aaddev

---
# Understanding the Azure Active Directory application manifest
Applications that integrate with Azure Active Directory (AD) must be registered with an Azure AD tenant, providing a persistent identity configuration for the application. This configuration is consulted at runtime, enabling scenarios that allow an application to outsource and broker authentication/authorization through Azure AD. For more information about the Azure AD application model, see the [Adding, Updating, and Removing an Application][ADD-UPD-RMV-APP] article.

## Updating an application's identity configuration
There are actually multiple options available for updating the properties on an application's identity configuration, which vary in capabilities and degrees of difficulty, including the following:

* The **[Azure portal's][AZURE-PORTAL] Web user interface** allows you to update the most common properties of an application. This is the quickest and least error prone way of updating your application's properties, but does not give you full access to all properties, like the next two methods.
* For more advanced scenarios where you need to update properties that are not exposed in the Azure classic portal, you can modify the **application manifest**. This is the focus of this article and is discussed in more detail starting in the next section.
* It's also possible to **write an application that uses the [Graph API][GRAPH-API]** to update your application, which requires the most effort. This may be an attractive option though, if you are writing management software, or need to update application properties on a regular basis in an automated fashion.

## Using the application manifest to update an application's identity configuration
Through the [Azure portal][AZURE-PORTAL], you can manage your application's identity configuration by updating the application manifest using the inline manifest editor. You can also download and upload the application manifest as a JSON file. No actual file is stored in the directory. The application manifest is merely an HTTP GET operation on the Azure AD Graph API Application entity, and the upload is an HTTP PATCH operation on the Application entity.

As a result, in order to understand the format and properties of the application manifest, you will need to reference the Graph API [Application entity][APPLICATION-ENTITY] documentation. Examples of updates that can be performed though application manifest upload
include:

* **Declare permission scopes (oauth2Permissions)** exposed by your web API. See the "Exposing Web APIs to Other Applications" topic in [Integrating Applications with Azure Active Directory][INTEGRATING-APPLICATIONS-AAD] for information on implementing user impersonation using the oauth2Permissions delegated permission scope. As mentioned previously, Application entity properties are documented in the Graph API [Entity and Complex Type][APPLICATION-ENTITY] reference article, including the oauth2Permissions property which is a collection of type [OAuth2Permission][APPLICATION-ENTITY-OAUTH2-PERMISSION].
* **Declare application roles (appRoles) exposed by your app**. The Application entity's appRoles property is a collection of type [AppRole][APPLICATION-ENTITY-APP-ROLE]. See the [Role based access control in cloud applications using Azure AD][RBAC-CLOUD-APPS-AZUREAD] article for an implementation example.
* **Declare known client applications (knownClientApplications)**, which allow you to logically tie the consent of the specified client application(s) to the resource/web API.
* **Request Azure AD to issue group memberships claim** for the signed in user (groupMembershipClaims).  This can also be configured to issue claims about the user's directory roles memberships. See the [Authorization in Cloud Applications using AD Groups][AAD-GROUPS-FOR-AUTHORIZATION] article for an implementation example.
* **Allow your application to support OAuth 2.0 Implicit grant** flows (oauth2AllowImplicitFlow). This type of grant flow is used with embedded JavaScript web pages or Single Page Applications (SPA). For more information on the implicit authorization grant, see [Understanding the OAuth2 implicit grant flow in Azure Active Directory][IMPLICIT-GRANT].
* **Enable use of X509 certificates as the secret key** (keyCredentials). See the [Build service and daemon apps in Office 365][O365-SERVICE-DAEMON-APPS] and [Developer’s guide to auth with Azure Resource Manager API][DEV-GUIDE-TO-AUTH-WITH-ARM] articles for implementation examples.
* **Add a new App ID URI** for your application (identifierURIs[]). App ID URIs are used to uniquely identify an application within its Azure AD tenant (or across multiple Azure AD tenants, for multi-tenant scenarios when qualified via verified custom domain). They are used when requesting permissions to a resource application, or acquiring an access token for a resource application. When you update this element, the same update is made to the corresponding service principal's servicePrincipalNames[] collection, which lives in the application's home tenant.

The application manifest also provides a good way to track the state of your application registration. Because it's available in JSON format, the file representation can be checked into your source control, along with your application's source code.

## Step by step example
Now lets walk through the steps required to update your application's identity configuration through the application manifest. We will highlight one of the preceding examples, showing how to declare a new permission scope on a resource application:

1. Sign in to the [Azure portal][AZURE-PORTAL].
2. After you've authenticated, choose your Azure AD tenant by selecting it from the top right corner of the page.
3. Select **Azure Active Directory** extension from the left navigation panel and click on **App Registrations**.
4. Find the application you want to update in the list and click on it.
5. From the application page, click **Manifest** to open the inline manifest editor. 
6. You can directly edit the manifest using this editor. Note that the manifest follows the schema for the [Application entity][APPLICATION-ENTITY] as we mentioned earlier:
    For example, assuming we want to implement/expose a new permission called "Employees.Read.All" on our resource application (API), you would simply add a new/second element to the oauth2Permissions collection, ie:
   
        "oauth2Permissions": [
        {
        "adminConsentDescription": "Allow the application to access MyWebApplication on behalf of the signed-in user.",
        "adminConsentDisplayName": "Access MyWebApplication",
        "id": "aade5b35-ea3e-481c-b38d-cba4c78682a0",
        "isEnabled": true,
        "type": "User",
        "userConsentDescription": "Allow the application to access MyWebApplication on your behalf.",
        "userConsentDisplayName": "Access MyWebApplication",
        "value": "user_impersonation"
        },
        {
        "adminConsentDescription": "Allow the application to have read-only access to all Employee data.",
        "adminConsentDisplayName": "Read-only access to Employee records",
        "id": "2b351394-d7a7-4a84-841e-08a6a17e4cb8",
        "isEnabled": true,
        "type": "User",
        "userConsentDescription": "Allow the application to have read-only access to your Employee data.",
        "userConsentDisplayName": "Read-only access to your Employee records",
        "value": "Employees.Read.All"
        }
        ],
   
    The entry must be unique, and you must therefore generate a new Globally Unique ID (GUID) for the `"id"` property. In this case, because we specified `"type": "User"`, this permission can be consented to by any account authenticated by the Azure AD tenant in which the resource/API application is registered. This grants the client application permission to access it on the account's behalf. The description and display name strings are used during consent and for display in the Azure portal.
6. When you're finished updating the manifest, click **Save** to save the manifest.  
   
Now that the manifest is saved, you can give a registered client application access to the new permission we added above. This time you can use the Azure portal's Web UI instead of editing the client application's manifest:  

1. First go to the **Settings** blade of the client application to which you wish to add access to the new API, click **Required Permissions** and choose **Select an API**.
2. Then you will be presented with the list of registered resource applications (APIs) in the tenant. Click the resource application to select it, or type the name of the application the search box. When you've found the application, click **Select**.  
3. This will take you to the **Select Permissions** page, which will show the list of Application Permissions and Delegated Permissions available for the resource application. Select the new permission in order to add it to the client's requested list of permissions. This new permission will be stored in the client application's identity configuration, in the "requiredResourceAccess" collection property.


That's it. Now your applications will run using their new identity configuration.

## Next steps
* For more details on the relationship between an application's Application and Service Principal object(s), see [Application and service principal objects in Azure AD][AAD-APP-OBJECTS].
* See the [Azure AD developer glossary][AAD-DEVELOPER-GLOSSARY] for definitions of some of the core Azure Active Directory (AD) developer concepts.

Please use the comments section below to provide feedback and help us refine and shape our content.

<!--article references -->
[AAD-APP-OBJECTS]: active-directory-application-objects.md
[AAD-DEVELOPER-GLOSSARY]: active-directory-dev-glossary.md
[AAD-GROUPS-FOR-AUTHORIZATION]: http://www.dushyantgill.com/blog/2014/12/10/authorization-cloud-applications-using-ad-groups/
[ADD-UPD-RMV-APP]: active-directory-integrating-applications.md
[APPLICATION-ENTITY]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#application-entity
[APPLICATION-ENTITY-APP-ROLE]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#approle-type
[APPLICATION-ENTITY-OAUTH2-PERMISSION]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#oauth2permission-type
[AZURE-PORTAL]: https://portal.azure.com
[DEV-GUIDE-TO-AUTH-WITH-ARM]: http://www.dushyantgill.com/blog/2015/05/23/developers-guide-to-auth-with-azure-resource-manager-api/
[GRAPH-API]: active-directory-graph-api.md
[IMPLICIT-GRANT]: active-directory-dev-understanding-oauth2-implicit-grant.md
[INTEGRATING-APPLICATIONS-AAD]: https://azure.microsoft.com/documentation/articles/active-directory-integrating-applications/
[O365-PERM-DETAILS]: https://msdn.microsoft.com/office/office365/HowTo/application-manifest
[O365-SERVICE-DAEMON-APPS]: https://msdn.microsoft.com/office/office365/howto/building-service-apps-in-office-365
[RBAC-CLOUD-APPS-AZUREAD]: http://www.dushyantgill.com/blog/2014/12/10/roles-based-access-control-in-cloud-applications-using-azure-ad/

