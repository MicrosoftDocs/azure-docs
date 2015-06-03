<properties 
	pageTitle="Accessing Azure Active Directory Graph Information (Windows Store) | Mobile Dev Center" 
	description="Learn how to access Azure Active Directory information using the Graph API in your Windows Store application." 
	documentationCenter="windows" 
	authors="wesmc7777" 
	manager="dwrede" 
	editor="" 
	services="mobile-services"/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="multiple" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="05/04/2015" 
	ms.author="wesmc"/>

# Accessing Azure Active Directory Graph Information



[AZURE.INCLUDE [mobile-services-selector-aad-graph](../includes/mobile-services-selector-aad-graph.md)]

##Overview

Like the other identity providers offered with Mobile Services, the Azure Active Directory (AAD) provider also supports a rich Graph API which can be used for programmatic access to the directory. In this tutorial you update the ToDoList app to personalize the authenticated user’s app experience returning additional user information you retrieve from the directory using the [Graph REST API].

For more information on the Azure AD Graph API, see the [Azure Active Directory Graph Team Blog]. 


>[AZURE.NOTE] The intent of this tutorial is to extend your knowledge of authentication with the Azure Active Directory. It is expected that you have completed the [Add Authentication to your app] tutorial using the Azure Active Directory authentication provider. This tutorial continues to update the TodoItem application used in the [Add Authentication to your app] tutorial. 




##Prerequisites 

Before you start this tutorial, you must have already completed these Mobile Services tutorials:

+ [Add Authentication to your app]<br/>Adds a login requirement to the TodoList sample app.

+ [Custom API Tutorial]<br/>Demonstrates how to call a custom API. 



## <a name="generate-key"></a>Generate an access key for the App registration in AAD


During the [Add Authentication to your app] tutorial, you created a registration for the integrated application when you completed the [Register to use an Azure Active Directory Login] step. In this section you generate a key to be used when reading directory information with that integrated application's client ID. 

[AZURE.INCLUDE [mobile-services-generate-aad-app-registration-access-key](../includes/mobile-services-generate-aad-app-registration-access-key.md)]


## <a name="create-api"></a>Create a GetUserInfo custom API

In this section, you will create the GetUserInfo custom API that will use the Azure AD Graph API to retrieve additional information about the user from the AAD.

If you've never used custom APIs with Mobile Services, refer to the [Custom API Tutorial] before completing this section.

1. In Visual Studio, right click mobile service .NET backend project and click **Manage NuGet Packages**.
2. In the NuGet Package Manager dialog, enter **ADAL** in the search criteria to find and install the **Active Directory Authentication Library** for your mobile service. This tutorial was most recently tested with the 3.0.110281957-alpha (Prerelease) version of the ADAL package.


3. In Visual Studio, right click the **Controllers** folder for the mobile service project and click **Add** to add a new **Microsoft Azure Mobile Services Custom Controller** named `GetUserInfoController`. The client will call this API to get user information from the Active Directory.

4. In the new GetUserInfoController.cs file, add the following `using` statements.

		using Microsoft.WindowsAzure.Mobile.Service.Security;
		using Microsoft.IdentityModel.Clients.ActiveDirectory;
		using System.Globalization;
		using System.Threading.Tasks;
		using Newtonsoft.Json;
		using System.IO;

5. In the new GetUserInfoController.cs file, add the following `UserInfo` class to hold the information we want to gather from the AAD.

	    public class UserInfo
	    {
	        public String displayName { get; set; }
	        public String streetAddress { get; set; }
	        public String city { get; set; }
	        public String state { get; set; }
	        public String postalCode { get; set; }
	        public String mail { get; set; }
	        public String[] otherMails { get; set; }
	
	        public override string ToString()
	        {
	            return "displayName : " + displayName + "\n" +
	                   "streetAddress : " + streetAddress + "\n" +
	                   "city : " + city + "\n" +
	                   "state : " + state + "\n" +
	                   "postalCode : " + postalCode + "\n" +
	                   "mail : " + mail + "\n" +
	                   "otherMails : " + string.Join(", ",otherMails);
	        }
	    }

6. In GetUserInfoController.cs, add the following member variables to the `GetUserInfoController` class.

        private const string AadInstance = "https://login.windows.net/{0}";
        private const string GraphResourceId = "https://graph.windows.net/";
        private const string APIVersion = "?api-version=2013-04-05";

        private string tenantdomain;
        private string clientid;
        private string clientkey;
        private string token = null;


7. In GetUserInfoController.cs, add the following `GetAADToken` method to the class.

        private async Task<string> GetAADToken()
        {
            // Try to get the AAD app settings from the mobile service.  
            if (!(Services.Settings.TryGetValue("AAD_CLIENT_ID", out clientid) &
                  Services.Settings.TryGetValue("AAD_CLIENT_KEY", out clientkey) &
                  Services.Settings.TryGetValue("AAD_TENANT_DOMAIN", out tenantdomain)))
            {
                Services.Log.Error("GetAADToken() : Could not retrieve mobile service app settings.");
                return null;
            }

            ClientCredential clientCred = new ClientCredential(clientid, clientkey);
            string authority = String.Format(CultureInfo.InvariantCulture, AadInstance, tenantdomain);
            AuthenticationContext authContext = new AuthenticationContext(authority);
            AuthenticationResult result = await authContext.AcquireTokenAsync(GraphResourceId, clientCred);

            if (result != null)
                token = result.AccessToken;
            else
                Services.Log.Error("GetAADToken() : Failed to return a token.");

            return token;
        }

    This method uses the app settings you configured on the mobile service in the [Azure Management Portal] to get a token to access the Active Directory.

7. In GetUserInfoController.cs, add the following `GetAADUser` method to the class.

        private async Task<UserInfo> GetAADUser()
        {
            ServiceUser serviceUser = (ServiceUser)this.User;

            // Need a user
            if (serviceUser == null || serviceUser.Level != AuthorizationLevel.User)
            {
                Services.Log.Error("GetAADUser() : No ServiceUser or wrong Authorizationlevel");
                return null;
            }

            // Get the user's AAD object id
            var idents = serviceUser.GetIdentitiesAsync().Result;
            var clientAadCredentials = idents.OfType<AzureActiveDirectoryCredentials>().FirstOrDefault();
            if (clientAadCredentials == null)
            {
                Services.Log.Error("GetAADUser() : Could not get AAD credientials for the logged in user.");
                return null;
            }

            if (token == null)
                await GetAADToken();

            if (token == null)
            {
                Services.Log.Error("GetAADUser() : No token.");
                return null;
            }

            // User the AAD Graph REST API to get the user's information
            string url = GraphResourceId + tenantdomain + "/users/" + clientAadCredentials.ObjectId + APIVersion;
            Services.Log.Info("GetAADUser() : Request URL : " + url);
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";
            request.ContentType = "application/json";
            request.Headers.Add("Authorization", token);
            UserInfo userinfo = null;
            try
            {
                WebResponse response = await request.GetResponseAsync();
                StreamReader sr = new StreamReader(response.GetResponseStream());
                string userjson = sr.ReadToEnd();
                userinfo = JsonConvert.DeserializeObject<UserInfo>(userjson);
                Services.Log.Info("GetAADUser user : " + userinfo.ToString());
            }
            catch(Exception e)
            {
                Services.Log.Error("GetAADUser exception : " + e.Message);
            }

            return userinfo;
        }

    This method gets the Active Directory object id for the authorized user and then uses the Graph REST API to get the user's information from the Active Diretory.


8. In GetUserInfoController.cs replace the `Get` method with the following method. This method returns the user entity from the Azure Active directory using the Graph REST API and requires an authorized user to call the API.

        // GET api/GetUserInfo
        [AuthorizeLevel(AuthorizationLevel.User)]
        public async Task<UserInfo> Get()
        {
            Services.Log.Info("Entered GetUserInfo custom controller!");
            return await GetAADUser();
        }

9. Save your changes and build the the service to verify no syntax errors.
10. Publish the mobile service project to your Azure account. 


## <a name="update-app"></a>Update the app to use GetUserInfo

In this section you will update the `AuthenticateAsync` method you implemented in the [Add Authentication to your app] tutorial to call the custom API and return additional information about the user from the AAD. 

[AZURE.INCLUDE [mobile-services-aad-graph-info-update-app](../includes/mobile-services-aad-graph-info-update-app.md)]
  


## <a name="test-app"></a>Test the app

[AZURE.INCLUDE [mobile-services-aad-graph-info-test-app](../includes/mobile-services-aad-graph-info-test-app.md)]





##<a name="next-steps"></a>Next steps

In the next tutorial, [Role based access control with the AAD in Mobile Services], you will use role based access control with the Azure Active Directory (AAD) to check group membership before allowing access. 



<!-- Anchors. -->
[Generate an access key for the App registration in AAD]: #generate-key
[Create a GetUserInfo custom API]: #create-api
[Update the app to use the custom API]: #update-app
[Test the app]: #test-app
[Next Steps]:#next-steps

<!-- Images -->


<!-- URLs. -->
[Add Authentication to your app]: mobile-services-dotnet-backend-windows-store-dotnet-get-started-users.md
[How to Register with the Azure Active Directory]: mobile-services-how-to-register-active-directory-authentication.md
[Azure Management Portal]: https://manage.windowsazure.com/
[Graph REST API]: http://msdn.microsoft.com/library/azure/hh974478.aspx
[Custom API Tutorial]: mobile-services-dotnet-backend-windows-store-dotnet-call-custom-api.md
[Store Server Scripts]: mobile-services-store-scripts-source-control.md
[Register to use an Azure Active Directory Login]: mobile-services-how-to-register-active-directory-authentication.md
[Azure Active Directory Graph Team Blog]: http://go.microsoft.com/fwlink/?LinkId=510536
[Get User]: http://msdn.microsoft.com/library/azure/dn151678.aspx
[Role based access control with the AAD in Mobile Services]: mobile-services-dotnet-backend-windows-store-dotnet-aad-rbac.md
