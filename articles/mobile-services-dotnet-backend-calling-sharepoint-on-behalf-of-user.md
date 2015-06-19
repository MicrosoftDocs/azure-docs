<properties 
	pageTitle="Access SharePoint on behalf of the user | Mobile Dev Center" 
	description="Learn how to make calls to SharePoint on behalf of the user" 
	documentationCenter="" 
	authors="mattchenderson" 
	manager="dwrede" 
	editor="" 
	services="mobile-services"/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="04/13/2015" 
	ms.author="mahender"/>

# Access SharePoint on behalf of the user

<div class="dev-onpage-video-clear clearfix">
<div class="dev-onpage-left-content">
<p>This topic shows you how to access the SharePoint APIs on behalf of the currently logged-in user.</p>
<p>If you prefer to watch a video, the clip to the right follows the same steps as this tutorial. In the video, Mat Velloso walks you through updating a Windows Store app to interact with SharePoint Online.</p>
</div>
<div class="dev-onpage-video-wrapper"><a href="http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/Azure-Mobile-Services-AAD-O365-Authentication-identity-across-services" target="_blank" class="label">watch the tutorial</a> <a style="background-image: url('http://media.ch9.ms/ch9/f217/3f8cbf94-f36b-4162-b3da-1c00339ff217/AzureMobileServicesAADO365AuthenticationIdentityA_960.jpg') !important;" href="http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/Azure-Mobile-Services-AAD-O365-Authentication-identity-across-services" target="_blank" class="dev-onpage-video"><span class="icon">Play Video</span></a> <span class="time">12:51</span></div>
</div>

In this tutorial, you will update the app from the Authenticate your app with Active Directory Authentication Library Single Sign-On tutorial to create a Word document in SharePoint Online when a new TodoItem is added.

This tutorial walks you through these basic steps to enable on-behalf-of access to SharePoint:

1. [Register your application for delegated access to SharePoint]
2. [Add SharePoint information to your mobile service]
3. [Obtain an access token and call the SharePoint API]
4. [Create and upload a Word document]
5. [Test the application]

This tutorial requires the following:

* Visual Studio 2013 running on Windows 8.1
* An active [SharePoint Online] subscription
* Completion of the [Authenticate your app with Active Directory Authentication Library Single Sign-On] tutorial. You should use the tenant provided by your SharePoint subscription.

## <a name="configure-permissions"></a>Configure your application for delegated access to SharePoint
By default, the token you receive from AAD has limited permissions. In order to access a third-party resource or SaaS application such as SharePoint Online, you must explicitly allow it.

1. In the **Active Directory** Section of the [Azure Management Portal], select your tenant. Navigate to the web application that you created for the mobile service.

    ![][0]

2. In the **Configure** tab, scroll the page down to the permissions to other applications section. Select **Office 365 SharePoint Online** and grant the **Edit or delete users' files** delegated permission. Then click **Save**.

    ![][1]

You have now configured AAD to issue a SharePoint access token to the mobile service.

## <a name="store-credentials"></a>Add SharePoint information to your mobile service

In order to make a call to SharePoint, you need to specify the endpoints that the mobile service needs to talk to. You also need to be able to prove the identity of your mobile service. This is accomplished using a Client ID and Client Secret pair. You have already obtained and stored the Client ID for the mobile service during the AAD login setup. Because these are sensitive credentials, you should not store them as plaintext in our code. Instead, you will set these values as Application Settings for our Mobile Service.

1. Return to the AAD Applications tab for your tenant, and select the web application for your mobile service.

2. Under Configure, scroll down to Keys. You will obtain a Client Secret by generating a new key. Note once you create a key and leave the page, there is no way to get it out of the portal again. Upon creation you must copy and save this value in a secure location. Select a duration for your key, then click save, and copy out the resulting value.

    ![][2]

3. In the Mobile Services section of the Management Portal, navigate to the Configure tab, and scroll down to App Settings. Here you can provide a key-value pair to help you reference the necessary credentials.

    ![][3]

4. Set SP_Authority to be the authority endpoint for your AAD tenant. This should be the same as the authority value used for your client app. It will be of the form https://login.windows.net/contoso.onmicrosoft.com

5. Set SP_ClientSecret to be the client secret value you obtained earlier.

6. Set SP_SharePointURL to be the URL for your SharePoint site. It should be of the form https://contoso-my.sharepoint.com

You will be able to obtain these values again in our code using ApiServices.Settings.

## <a name="obtain-token"></a>Obtain an access token and call the SharePoint API

In order to access SharePoint, you need a special access token with SharePoint as the target audience. To get this token, you will need to call back into AAD with the identity of the Mobile Service and the token that was issued for the user.

1. Open your Mobile Services backend project in Visual Studio.

[AZURE.INCLUDE [mobile-services-dotnet-adal-install-nuget](../includes/mobile-services-dotnet-adal-install-nuget.md)]

2. In your Mobile Services backend project, crate a new class called SharePointUploadContext. In it, add the following:

        private String accessToken;
        private String mySiteApiPath;
        private String clientId;
        private String clientSecret;
        private String sharepointURL;
        private String authority;
        private const string getFilesPath = "/getfolderbyserverrelativeurl('Documents')/Files";

        public static async Task<SharePointUploadContext> createContext(ServiceUser user, ServiceSettingsDictionary settings)
        {
            //Get the current access token
            AzureActiveDirectoryCredentials creds = (await user.GetIdentitiesAsync()).OfType<AzureActiveDirectoryCredentials>().FirstOrDefault();
            string userToken = creds.AccessToken;
            return new SharePointUploadContext(userToken, settings);
        }

        private SharePointUploadContext(string userToken, ServiceSettingsDictionary settings)
        {
            //Call ADAL and request a token to SharePoint with the access token
            AuthenticationContext ac = new AuthenticationContext(authority);
            AuthenticationResult ar = ac.AcquireToken(sharepointURL, new ClientCredential(clientId, clientSecret), new UserAssertion(userToken));
            accessToken = ar.AccessToken;
            string upn = ar.UserInfo.UserId;
            mySiteApiPath = "/personal/" + upn.Replace('@','_').Replace('.','_') + "/_api/web"; 
            clientId = settings.AzureActiveDirectoryClientId;
            clientSecret = settings["SP_ClientSecret"];
            sharepointURL = settings["SP_SharePointURL"];
            authority = settings["SP_Authority"];
        }

3. Now create a method to add the file to the user's document library:

        public async Task<bool> UploadDocument(string docName, byte[] document)
        {
            string uploadUri = sharepointURL + mySiteApiPath + getFilesPath + string.Format(@"/Add(url='{0}.docx', overwrite=true)", docName);
            using (HttpClient client = new HttpClient())
            {
                Func<HttpRequestMessage> requestCreator = () =>
                {
                    HttpRequestMessage UploadRequest = new HttpRequestMessage(HttpMethod.Post, uploadUri);
                    UploadRequest.Content = new System.Net.Http.ByteArrayContent(document);
                    UploadRequest.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                    UploadRequest.Content.Headers.ContentType.Parameters.Add(new NameValueHeaderValue("odata", "verbose"));
                    return UploadRequest;
                };
                using (HttpRequestMessage uploadRequest = requestCreator.Invoke())
                {
                    uploadRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    HttpResponseMessage uploadResponse = await client.SendAsync(uploadRequest);
                }
            }
            return true;
        }

## <a name="create-document"></a>Create and upload a Word document

To create a Word document, you will use the OpenXML NuGet package. Install this package by opening the NuGet Manager and searching for DocumentFormat.OpenXml.

1. Add the following code to TodoItemController. This will create a Word document based on a TodoItem. The text of the document will be the name of the item.

        private static byte[] CreateWordDocument(TodoItem todoItem)
        {
            byte[] document;
            using (MemoryStream generatedDocument = new MemoryStream())
            {
                using (WordprocessingDocument package = WordprocessingDocument.Create(generatedDocument, WordprocessingDocumentType.Document))
                {
                    MainDocumentPart mainPart = package.MainDocumentPart;
                    if (mainPart == null)
                    {
                        mainPart = package.AddMainDocumentPart();
                        new Document(new Body()).Save(mainPart);
                    }
                    Body body = mainPart.Document.Body;
                    Paragraph p =
                        new Paragraph(
                            new Run(
                                new Text(todoItem.Text)));
                    body.Append(p);
                    mainPart.Document.Save();
                }
                document = generatedDocument.ToArray();
            }
            return document;
        }

2. Replace PostTodoItem with the following:

        public async Task<IHttpActionResult> PostTodoItem(TodoItem item)
        {
            TodoItem current = await InsertAsync(item);
            
            SharePointUploadContext context = await SharePointUploadContext.createContext((ServiceUser)this.User, Services.Settings);
            byte[] document = CreateWordDocument(item);
            bool uploadResult = await context.UploadDocument(item.Id, document);
            
            return CreatedAtRoute("Tables", new { id = current.Id }, current);
        }

## <a name="test-application"></a>Test the application

1. Publish the changes to the backend, and then run your client application. Log in when prompted, and insert a new TodoItem.

2. Navigate to your SharePoint site and log in with the same user.

3. Select the OneDrive tab. Under the Documents Folder, you should see a Word document with a GUID title. When you open it, you should find the text for your TodoItem.

    ![][4]


<!-- Images. -->

[0]: ./media/mobile-services-dotnet-backend-calling-sharepoint-on-behalf-of-user/aad-web-application.png
[1]: ./media/mobile-services-dotnet-backend-calling-sharepoint-on-behalf-of-user/aad-sharepoint-permissions.png
[2]: ./media/mobile-services-dotnet-backend-calling-sharepoint-on-behalf-of-user/aad-manage-secret-key.png
[3]: ./media/mobile-services-dotnet-backend-calling-sharepoint-on-behalf-of-user/mobile-services-app-settings-sharepoint.png
[4]: ./media/mobile-services-dotnet-backend-calling-sharepoint-on-behalf-of-user/sharepoint-document-created.png

<!-- Anchors. -->

[Register your application for delegated access to SharePoint]: #configure-permissionss
[Add SharePoint information to your mobile service]: #store-credentials
[Obtain an access token and call the SharePoint API]: #obtain-token
[Create and upload a Word document]: #create-document
[Test the application]: #test-application

<!-- URLs. -->
[Azure Management Portal]: https://manage.windowsazure.com/
[SharePoint Online]: http://office.microsoft.com/sharepoint/
[Authenticate your app with Active Directory Authentication Library Single Sign-On]: http://azure.microsoft.com/documentation/articles/mobile-services-windows-store-dotnet-adal-sso-authentication/
