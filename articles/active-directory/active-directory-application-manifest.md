<properties
   pageTitle="Understanding the Azure Active Directory Application Manifest | Microsoft Azure"
   description="Detailed coverage of how to use the Azure Active Directory application manifest, which represents an application's identity configuration in an Azure AD tenant, and is used to facilitate OAuth authorization, consent experience, and more."
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
   ms.date="07/25/2016"
   ms.author="dkershaw;bryanla"/>

# Understanding the Azure Active Directory application manifest

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
[APPLICATION-ENTITY]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#application-entity
[APPLICATION-ENTITY-APP-ROLE]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#approle-type
[APPLICATION-ENTITY-OAUTH2-PERMISSION]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#oauth2permission-type
[AZURE-CLASSIC-PORTAL]: https://manage.windowsazure.com
[DEV-GUIDE-TO-AUTH-WITH-ARM]: http://www.dushyantgill.com/blog/2015/05/23/developers-guide-to-auth-with-azure-resource-manager-api/
[GRAPH-API]: active-directory-graph-api.md
[IMPLICIT-GRANT]: active-directory-dev-understanding-oauth2-implicit-grant.md
[INTEGRATING-APPLICATIONS-AAD]: https://azure.microsoft.com/documentation/articles/active-directory-integrating-applications/
[O365-PERM-DETAILS]: https://msdn.microsoft.com/office/office365/HowTo/application-manifest
[O365-SERVICE-DAEMON-APPS]: https://msdn.microsoft.com/office/office365/howto/building-service-apps-in-office-365
[RBAC-CLOUD-APPS-AZUREAD]: http://www.dushyantgill.com/blog/2014/12/10/roles-based-access-control-in-cloud-applications-using-azure-ad/

