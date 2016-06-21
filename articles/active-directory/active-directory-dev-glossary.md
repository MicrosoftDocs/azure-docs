<properties
   pageTitle="Azure Active Directory Developer Glossary | Microsoft Azure"
   description="A list of terms for commonly used Azure Active Directory developer concepts and features."
   services="active-directory"
   documentationCenter=""
   authors="bryanla"
   manager="mbaldwin"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="06/21/2016"
   ms.author="bryanla"/>

# Azure Active Directory developer glossary

It is helpful to have a basic understanding of Azure Active Directory (AD) development concepts when learning about  [Azure AD application integration][ACOM-How-To-Integrate], and the [basics of Azure AD authentication and supported authentication scenarios][ACOM-Auth-Scenarios]. In addition, here is a set of core application integration concepts, which will serve as the basis for the topics we will discuss throughout this article:

|  Concept                 | Definition |
| -------------------------- | --------------------------------------------|
| application manifest        | An Azure classic portal concept, which provides a JSON representation of the application's identity configuration, and used as a mechanism for updating the application entity and it's related service principal entity. See [Understanding the Azure Active Directory application manifest][AAD-App-Manifest] for more details. |
| application object        | An application's one and only application object lives in the Azure AD tenant where the application was registered. Think of it as a design-time concept that expresses the application's identity configuration data, the template from which it's corresponding service principal object(s) are later derived for use at run-time. <br/><br/>For our scenario, we will create an application object during registration of the client application, in the developer tenant. We will discuss this later during application registration, but also note that many types of applications are supported by Azure AD, including both a client application (which can have multiple profiles), and a resource server that exposes a Web API. See [Application Objects and Service Principal Objects][AAD-App-SP-Objects] for more information. |
| application registration        | In order to allow an application to integrate with and delegate identity management functions to Azure AD, it must be registered with an Azure AD tenant. When you register your application with Azure AD, you are essentially providing an identity configuration for your application, allowing it to participate in the authentication and authorization services provided by Azure AD on behalf of a user (resource owner), to access the user's data in a protected resource server <br/><br/>We will focus on using the Azure classic portal for registration tasks, but please note that you can also register an application through other means, including the Azure AD Graph API, PowerShell cmdlets, and various tools that wrap them. Using the Azure classic portal for registration will create both the application and service principal object. |
| Azure AD tenants           | An Azure AD tenant provides a variety of features, of which we will focus on a subset: registry services for integrated applications, authentication of user accounts and registered applications, and the OAuth 2.0 Authorization Server that brokers the interactions between a user (resource owner), a client application, and Web API(s) exposed by a protected resource server. Note that Azure AD also happens to function as a protected resource server, providing the Graph API to enable querying/updating of it's directory data.<br/><br/> We will create two Azure AD tenants, supporting the IDMaaS needs of a customer that wants to grant a SaaS client application limited access to data secured by their Azure AD tenant, and a SaaS developer that built the client application:<br/><br/>The **customer tenant** authenticates it's user accounts that sign in to the client application, and uses consent to secure the client application's access to the data *provided* by the Web API(s) registered in it. It also *consumes* the client application's application object from the developer tenant, which defines the access intent of the client (via permission scopes), among other things. Once consent is given, a service principal object is derived from the same application object, and persisted in the customer tenant for future use.<br/><br/>The **developer tenant** stores the client application's identity configuration (embodied in the application object). Among other things, it contains the credentials it uses to authenticate with Azure AD and a declaration of the APIs it is interesting in accessing, allowing it to obtain authorization from the authenticated user to access data secured by the customer tenant. It *provides* the client application's application object, and *consumes* the definition of the desired Web APIs and related permission scopes implemented by the customer tenant. |
| client application         | The SaaS application that requests authorization from a resource owner to participate in an OAuth2 grant flow, to access APIs/data on their behalf. We will cover examples of both a Web client application accessed from a browser, and a Native client application installed on a device, which need to access the customer tenant's Graph API to access directory data on behalf of the signed in user. <br/><br/>We will use the [OAuth 2.0 "Authorization Code" grant flow][OAuth2-AuthZ-Code-Grant-Flow] in this article, as it allows the resource owner to delegate authorization to the client application, but please note there are other types of OAuth2 grant flows.  |
| consent         | The process of a resource owner granting authorization to the client application, allowing the application to access protected resources, on behalf of the resource owner. Note that both an administrator and user can consent to allow access to their organization/individual data respectively. We will discuss the entire process in more detail later when we break down the Azure AD consent framework, including how you can add a "sign up" feature to your application to manage user registration and consent. |
| multi-tenant application   | A type of client application registered in Azure AD, that is designed to permit sign ins from user accounts that are provisioned in any Azure AD tenant, including ones other than the one where the application itself is registered. By contrast, an application registered as single-tenant, would only allow sign-ins from user accounts provisioned in the same tenant as the one where the application is registered. 
| permission scopes  | When we refer to permissions in general, or permission scopes in particular, we are referring to the available permissions that a Web API has declared through it's Azure AD configuration. These are the same permission definitions a client application must declare in it's Azure AD configuration in order to access the API. <br/><br/>These permissions will be surfaced to the resource owner/user during the consent process, so they know what they are granting the client permission to access on their behalf. For a detailed discussion of the permission scopes exposed by Azure AD's Graph API, see [Graph API Permission Scopes][AAD-Graph-Perm-Scopes].  |
| service principal object        | The client application is registered in the developer tenant via the [Azure classic portal][AZURE-Azure-classic-portal], which will create both it's application and service principal objects. We mentioned that the application object is more like a template, and the service principal object is *derived* from the application object. It's important to also note that it is the service principal object to which policy and permissions are applied, so think of it as a concept that is also applicable at run-time. When the application object is modified, the corresponding service principal object in it's tenant is also kept in sync. <br/><br/>As mentioned above, a service principal object for the client application will also be created in the customer tenant during consent by the signed in customer user, acknowledging permission to access a protected resource on behalf of the user. Think of the service principal object as representing persisted consent from the user, where it can be used for future authorization requests. We will discuss this later during application registration. See [Application Objects and Service Principal Objects][AAD-App-SP-Objects] for more information.  |
| Web API application    | Exposes APIs and enforces the permissions scopes that allow client applications to access it's protected resources through the APIs, using the OAuth 2.0 Authorization Framework. Examples include the Azure AD Graph API that provides access to Azure AD tenant data, and the Office 365 APIs the provide access to data such as mail, calendar, and documents.  <br/><br/> Just like a client application, a Web API (aka: resource) application's identity configuration is established via registration in an Azure AD tenant, providing both the application and service principal object. (note: there are special considerations for Microsoft-provided APIs such as the Azure AD Graph API, as it's service principal object is made available in all tenants by default)|


## Next steps
Please use the Disqus comments section below to provide feedback and help us refine and shape our content.

<!--Image references-->

<!--Reference style links -->
[AAD-App-Manifest]: ./active-directory-application-manifest.md
[AAD-App-SP-Objects]: ./active-directory-application-objects.md

[AZURE-Azure-classic-portal]: https://manage.windowsazure.com

[OAuth2-AuthZ-Code-Grant-Flow]: https://msdn.microsoft.com/library/azure/dn645542.aspx
























Applications that integrate with Azure Active Directory (AD) must be registered with an Azure AD tenant, providing a persistent identity configuration for the application. This configuration is consulted at runtime, enabling scenarios that allow an application to outsource and broker authentication/authorization through Azure AD. For more information about the Azure AD application model, see the [Adding, Updating, and Removing an Application][ADD-UPD-RMV-APP] article.

## Updating an application's identity configuration

There are actually multiple options available for updating the properties on an application's identity configuration, which vary in capabilities and degrees of difficulty, including the following:

- The **[Azure classic portal's][AZURE-CLASSIC-PORTAL] Web user interface** allows you to update the most common properties of an application. This is the quickest and least error prone way of updating your application's properties, but does not give you full access to all properties, like the next two methods.
- For more advanced scenarios where you need to update properties that are not exposed in the Azure classic portal, you can modify the **application manifest**. This is the focus of this article and is discussed in more detail starting in the next section.
- It's also possible to **write an application that uses the [Graph API][GRAPH-API]** to update your application, which requires the most effort. This may be an attractive option though, if you are writing management software, or need to update application properties on a regular basis in an automated fashion.

## Using the application manifest to update an application's identity configuration
Through the [Azure classic portal][AZURE-CLASSIC-PORTAL], you can manage your application's identity configuration, by downloading and uploading a JSON file representation, which is called an application manifest. No actual file is stored in the directory - the application manifest is merely an HTTP GET operation on the Azure AD Graph API application entity, and the upload is an HTTP PATCH operation on the application entity.

As a result, in order to understand the format and properties of the application manifest, you will need to reference the Graph API [Application entity][APPLICATION-ENTITY] documentation. Examples of updates that can be performed though application manifest upload
include:

- **Declare permission scopes (oauth2Permissions)** exposed by your web API. See the "Exposing Web APIs to Other Applications" topic in [Integrating Applications with Azure Active Directory][INTEGRATING-APPLICATIONS-AAD] for information on implementing user impersonation using the oauth2Permissions delegated permission scope. As mentioned previously, all Application Entity properties are documented in the the Graph API [Entity and Complex Type reference][APPLICATION-ENTITY] reference article, including the oauth2Permissions property which is a collection of type [OAuth2Permission][APPLICATION-ENTITY-OAUTH2-PERMISSION].
- **Declare application roles (appRoles) exposed by your app**. The Application Entity's appRoles property is a collection of type [AppRole][APPLICATION-ENTITY-APP-ROLE]. See the [Roles based access control in cloud applications using Azure AD][RBAC-CLOUD-APPS-AZUREAD] article for an implementation example.
- **Declare known client applications (knownClientApplications)**, which allow you to logically tie the consent of the specified client application(s) to the resource/web API.
- **Request Azure AD to issue group memberships claim** for the signed in user (groupMembershipClaims).  NOTE: this can be configured to additionally issue claims about the user's directory roles memberships. See the [Authorization in Cloud Applications using AD Groups][AAD-GROUPS-FOR-AUTHORIZATION] article for an implementation example.
- **Allow your application to support OAuth 2.0 Implicit grant** flows (oauth2AllowImplicitFlow). This type of grant flow is used with embedded JavaScript web pages or Single Page Applications (SPA). For more details on the implicit authorization grant, see [Understanding the OAuth2 implicit grant flow in Azure Active Directory ][IMPLICIT-GRANT].
- **Enable use of X509 certificates as the secret key** (keyCredentials). See the [Build service and daemon apps in Office 365][O365-SERVICE-DAEMON-APPS] and [Developer’s guide to auth with Azure Resource Manager API ][DEV-GUIDE-TO-AUTH-WITH-ARM] articles for implementation examples.
- **Add a new App ID URI** for your application (identifierURIs[]). App ID URIs are used to uniquely identify an application within its Azure AD tenant (or across multiple Azure AD tenants, for multi-tenant scenarios when qualified via a verified custom domain). They are used when requesting permissions to a resource application, or acquiring an access token for a resource application. When you update this element, the same update is made to the corresponding service principal's servicePrincipalNames[] collection, which lives in the application's home tenant.

The application manifest also provides a good way to track the state of your application registration. Because it's available in JSON format, the file representation can be checked into your source control, along with your application's source code.

## Step by step example
Now lets walk through the steps required to update your application's identity configuration through the application manifest. We will highlight one of the examples given above, showing how to declare a new permission scope on a resource application:

1. Navigate to the [Azure classic portal][AZURE-CLASSIC-PORTAL] and sign in with an account that has service administrator or co-administrator privileges.

2. After you've authenticated, scroll down and select the Azure "Active Directory" extension in the left navigation panel (1), then click on the Azure AD tenant where your application is registered (2).

    ![Select the Azure AD tenant][SELECT-AZURE-AD-TENANT]

3. When the directory page comes up, click "Applications" (1) on the top of the page to see a list of applications registered in the tenant. Then find the application you want to update in the list and click on it (2).

    ![Select the Azure AD tenant][SELECT-AZURE-AD-APP]

4. Now that you've selected the application's main page, notice the "Manage Manifest" feature on the bottom of the page (1). If you click this link, you will be prompted to either download or upload the JSON manifest file. Click "Download Manifest" (2) which will be immediately followed with the download confirmation dialog prompting you to confirm by clicking "Download Manifest" (3), then either open or save the file locally (4).

    ![Manage the manifest, download option][MANAGE-MANIFEST-DOWNLOAD]

    ![Download the manifest][DOWNLOAD-MANIFEST]

5. In this example, we saved the file locally, allowing us to open in an editor, make changes to the JSON, and save again. Here's what the JSON structure looks like inside the Visual Studio JSON editor. Note that it follows the schema for the [Application entity][APPLICATION-ENTITY] as we mentioned earlier:

    ![Update the manifest JSON][UPDATE-MANIFEST]

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

    The entry must be unique, and you must therefore generate a new Globally Unique ID (GUID) for the `"id"` property. In this case, because we specified `"type": "User"`, this permission can be consented to by any account authenticated by the Azure AD tenant in which the resource/API application is registered, granting the client application permission to access it on the account's behalf. The description and display name strings are used during consent and for display in the Azure classic portal.  

6. When you're finished updating the manifest, return to the Azure AD application page in the Azure classic portal, click the "Manage Manifest" feature again (1), but this time select the "Upload Manifest" option (2). Similar to the download, you will be greeted again with a second dialog, prompting you for the location of the JSON file. Click "Browse for file ..." (3), then use the "Choose File to Upload" dialog to select the JSON file (4), and press "Open". Once the dialog goes away, select the "OK" check mark (5) and your manifest will be uploaded.  

    ![Manage the manifest, upload option][MANAGE-MANIFEST-UPLOAD]

    ![Upload the manifest JSON][UPLOAD-MANIFEST]

    ![Upload the manifest JSON - confirmation][UPLOAD-MANIFEST-CONFIRM]

Now that the manifest is saved, you can give a registered client application access to the new permission we added above, but this time you can use the Azure classic portal's Web UI instead of editing the client application's manifest:  

1. First go to the "Configure" page of the client application to which you wish to add access to the new API, and click the "Add application" button.
2. Then you will be presented with the list of registered resource applications (APIs) in the tenant. Click the plus/+ symbol next to the resource application's name to select it.  
3. Then click the check mark in the lower right.
4. When you return to the "Add Application" section of your client's configuration page, you will see the new resource application in the list. If you hover over the "Delegated Permissions" section to the right of that row, you will see a drop down list show up. Click the list, then select the new permission in order to add it to the client's requested list of permissions. Note: this new permission will be stored in the client application's identity configuration, in the "requiredResourceAccess" collection property.

![Permissions to other applications][PERMS-TO-OTHER-APPS]

![Permissions to other applications][PERMS-SELECT-APP]

![Permissions to other applications][PERMS-SELECT-PERMS]

That's it. Now your applications will run using their new identity configuration.

## Next steps
Please use the DISQUS comments section below to provide feedback and help us refine and shape our content.

<!--Image references-->
[DOWNLOAD-MANIFEST]: ./media/active-directory-application-manifest/download-manifest.png
[MANAGE-MANIFEST-DOWNLOAD]: ./media/active-directory-application-manifest/manage-manifest-download.png
[MANAGE-MANIFEST-UPLOAD]: ./media/active-directory-application-manifest/manage-manifest-upload.png
[PERMS-SELECT-APP]: ./media/active-directory-application-manifest/portal-perms-select-app.png
[PERMS-SELECT-PERMS]: ./media/active-directory-application-manifest/portal-perms-select-perms.png
[PERMS-TO-OTHER-APPS]: ./media/active-directory-application-manifest/portal-perms-to-other-apps.png
[SELECT-AZURE-AD-APP]: ./media/active-directory-application-manifest/select-azure-ad-application.png
[SELECT-AZURE-AD-TENANT]: ./media/active-directory-application-manifest/select-azure-ad-tenant.png
[UPDATE-MANIFEST]: ./media/active-directory-application-manifest/update-manifest.png
[UPLOAD-MANIFEST]: ./media/active-directory-application-manifest/upload-manifest.png
[UPLOAD-MANIFEST-CONFIRM]: ./media/active-directory-application-manifest/upload-manifest-confirm.png

<!--article references -->
[AAD-GROUPS-FOR-AUTHORIZATION]: http://www.dushyantgill.com/blog/2014/12/10/authorization-cloud-applications-using-ad-groups/
[ADD-UPD-RMV-APP]: active-directory-integrating-applications.md
[APPLICATION-ENTITY]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#ApplicationEntity
[APPLICATION-ENTITY-APP-ROLE]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#AppRoleType
[APPLICATION-ENTITY-OAUTH2-PERMISSION]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#OAuth2PermissionType
[AZURE-CLASSIC-PORTAL]: https://manage.windowsazure.com
[DEV-GUIDE-TO-AUTH-WITH-ARM]: http://www.dushyantgill.com/blog/2015/05/23/developers-guide-to-auth-with-azure-resource-manager-api/
[GRAPH-API]: active-directory-graph-api.md
[IMPLICIT-GRANT]: active-directory-dev-understanding-oauth2-implicit-grant.md
[INTEGRATING-APPLICATIONS-AAD]: https://azure.microsoft.com/documentation/articles/active-directory-integrating-applications/
[O365-PERM-DETAILS]: https://msdn.microsoft.com/office/office365/HowTo/application-manifest
[O365-SERVICE-DAEMON-APPS]: https://msdn.microsoft.com/office/office365/howto/building-service-apps-in-office-365
[RBAC-CLOUD-APPS-AZUREAD]: http://www.dushyantgill.com/blog/2014/12/10/roles-based-access-control-in-cloud-applications-using-azure-ad/

