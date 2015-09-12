<properties
   pageTitle="Understanding the Azure Active Directory Application Manifest | Microsoft Azure"
   description="Provides additional details on the Azure AD application manifest, which accompanies each application configuration in an Azure AD tenant."
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
   ms.date="09/03/2015"
   ms.author="dkershaw;bryanla"/>

# Understanding the Azure Active Directory application manifest

Applications that integrate with Azure Active Directory (AD) must be registered with an Azure AD tenant, providing a persistent identity configuration for the application. This configuration is consulted at runtime, enabling scenarios that allow an application to outsource and broker authentication/authorization through Azure AD. For more information about the Azure AD application model, see the [Adding, Updating, and Removing an Application][ADD-UPD-RMV-APP] article.

## Updating an application's identity configuration

There are actually multiple options available for updating the properties on an application's identity configuration, which vary in capabilities and degrees of difficulty, including the following:

- The **[Azure portal's][AZURE-PORTAL] Web user interface** allows you to update the most common properties of an application. This is the quickest and least error prone way of updating your application's properties, but does not give you full access to all properties, like the next two methods.
- For more advanced scenarios where you need to update properties that are not exposed in the Azure portal, you can modify the **application manifest**. This is the focus of this article and is discussed in more detail starting in the next section.
- It's also possible to **write an application that uses the [Graph API][GRAPH-API]** to update your application, which requires the most effort. This may be an attractive option though, if you are writing management software, or need to update application properties on a regular basis in an automated fashion.

## Using the application manifest to update an application's identity configuration
Through the [Azure portal][AZURE-PORTAL], you can manage your application's identity configuration, by downloading and uploading a JSON file representation, which is called an application manifest. No actual file is stored in the directory - the application manifest is merely an HTTP GET operation on the Azure AD Graph API application entity, and the upload is an HTTP PATCH operation on the application entity.

As a result, in order to understand the format and properties of the application manifest, you will need to reference the Graph API [Application entity][APPLICATION-ENTITY] documentation. Examples of updates that can be performed though application manifest upload
include:

- Declare permission scopes (oauth2Permissions) exposed by your web API. See the "Exposing Web APIs to Other Applications" topic in [Integrating Applications with Azure Active Directory][INTEGRATING-APPLICATIONS-AAD] for information on implementing user impersonation using the oauth2Permissions delegated permission scope. As mentioned previously, all Application Entity properties are documented in the the Graph API [Entity and Complex Type reference][APPLICATION-ENTITY] reference article, including oauth2Permissions which is of type [OAuth2Permission][APPLICATION-ENTITY-OAUTH2-PERMISSION]
- Declare application roles (appRoles) exposed by your app. See the [Roles based access control in cloud applications using Azure AD][RBAC-CLOUD-APPS-AZUREAD] article for an implementation example.
- Declare known client applications.
- Request Azure AD to issue group memberships claim for the signed in user.  NOTE: this can be configured to additionally issue claims about the user's directory roles memberships. See the [Authorization in Cloud Applications using AD Groups][AAD-GROUPS-FOR-AUTHORIZATION] article for an implementation example.
- Allow your application to support OAuth 2.0 Implicit grant flows (for embedded JavaScript web pages or Single Page Applications (SPA))
- Enable use of X509 certificates as the secret key. See the [Build service and daemon apps in Office 365][O365-SERVICE-DAEMON-APPS] article for an implementation example.

The application manifest also provides a good way to track the state of your application registration. Because it's available in JSON format, the file representation can be checked into your source control, along with your application's source code.

### Step by step example
Now lets walk through the steps required to update your application's identity configuration through the application manifest:

1. Navigate to the [Azure portal][AZURE-PORTAL] and sign in with an account that has service administrator or co-administrator privileges.


2. After you've authenticated, scroll down and select the Azure "Active Directory" extension in the left navigation panel (1), then click on the Azure AD tenant where your application is registered (2).

	![Select the Azure AD tenant][SELECT-AZURE-AD-TENANT]


3. When the directory page comes up, click "Applications" (1) on the top of the page to see a list of applications registered in the tenant. Then find the application you want to update in the list and click on it (2).

	![Select the Azure AD tenant][SELECT-AZURE-AD-APP]


4. Now that you've selected the application's main page, notice the "Manage Manifest" feature on the bottom of the page (1). If you click this link, you will be prompted to either download or upload the JSON manifest file. Click "Download Manifest" (2) which will be immediately followed with the download confirmation dialog prompting you to confirm by clicking "Download Manifest" (3), then either open or save the file locally (4).

	![Manage the manifest, download option][MANAGE-MANIFEST-DOWNLOAD]

	![Download the manifest][DOWNLOAD-MANIFEST]


5. In this example, we saved the file locally, allowing us to open in an editor, make changes to the JSON, and save again. Here's what the JSON structure looks like inside the Visual Studio JSON editor. Note that it follows the schema for the [Application entity][APPLICATION-ENTITY] as we mentioned earlier:

	![Update the manifest JSON][UPDATE-MANIFEST]


6. When you're finished updating the manifest, return to the Azure AD application page in the Azure portal again, click the "Manage Manifest" feature again (1), but this time select the "Upload Manifest" option (2). Similar to the download, you will be greeted again with a second dialog, prompting you for the location of the JSON file. Click "Browse for file ..." (3), then use the "Choose File to Upload" dialog to select the JSON file (4), and press "Open". Once the dialog goes away, select the "OK" check mark (5) and your manifest will be uploaded.  

	![Manage the manifest, upload option][MANAGE-MANIFEST-UPLOAD]

	![Upload the manifest JSON][UPLOAD-MANIFEST]

	![Upload the manifest JSON - confirmation][UPLOAD-MANIFEST-CONFIRM]

That's it. Now your application can run using the new Application configuration, based on the changes you made to the manifest.

## Next steps
Please use the DISQUS comments section below to provide feedback and help us refine and shape our content.

<!--Image references-->
[MANAGE-MANIFEST-DOWNLOAD]: ./media/active-directory-application-manifest/manage-manifest-download.png
[MANAGE-MANIFEST-UPLOAD]: ./media/active-directory-application-manifest/manage-manifest-upload.png
[DOWNLOAD-MANIFEST]: ./media/active-directory-application-manifest/download-manifest.png
[SELECT-AZURE-AD-APP]: ./media/active-directory-application-manifest/select-azure-ad-application.png
[SELECT-AZURE-AD-TENANT]: ./media/active-directory-application-manifest/select-azure-ad-tenant.png
[UPDATE-MANIFEST]: ./media/active-directory-application-manifest/update-manifest.png
[UPLOAD-MANIFEST]: ./media/active-directory-application-manifest/upload-manifest.png
[UPLOAD-MANIFEST-CONFIRM]: ./media/active-directory-application-manifest/upload-manifest-confirm.png

<!--article references -->
[AAD-GROUPS-FOR-AUTHORIZATION]: http://www.dushyantgill.com/blog/2014/12/10/authorization-cloud-applications-using-ad-groups/
[ADD-UPD-RMV-APP]: active-directory-integrating-applications.md
[APPLICATION-ENTITY]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#ApplicationEntity
[APPLICATION-ENTITY-OAUTH2-PERMISSION]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#OAuth2PermissionType
[AZURE-PORTAL]: https://manage.windowsazure.com
[GRAPH-API]: active-directory-graph-api.md
[INTEGRATING-APPLICATIONS-AAD]: https://azure.microsoft.com/documentation/articles/active-directory-integrating-applications/
[O365-PERM-DETAILS]: https://msdn.microsoft.com/office/office365/HowTo/application-manifest
[O365-SERVICE-DAEMON-APPS]: https://msdn.microsoft.com/office/office365/howto/building-service-apps-in-office-365
[RBAC-CLOUD-APPS-AZUREAD]: http://www.dushyantgill.com/blog/2014/12/10/roles-based-access-control-in-cloud-applications-using-azure-ad/
