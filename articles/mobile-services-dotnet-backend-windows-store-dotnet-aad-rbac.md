<properties urlDisplayName="Role Based Access Control with Azure Active Directory" pageTitle="Role Based Access Control in Mobile Services and Azure Active Directory (Windows Store) | Mobile Dev Center" metaKeywords="" description="Learn how to control access based on Azure Active Directory roles in your Windows Store application." metaCanonical="" disqusComments="1" umbracoNaviHide="1" documentationCenter="Mobile" title="Role Based Access Control in Mobile Services and Azure Active Directory" authors="wesmc" manager="dwrede" />

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-windows-store" ms.devlang="dotnet" ms.topic="article" ms.date="10/14/2014" ms.author="wesmc" />

# Role Based Access Control in Mobile Services and Azure Active Directory

[WACOM.INCLUDE [mobile-services-selector-rbac](../includes/mobile-services-selector-rbac.md)]

Roles-based access control (RBAC) is the practice of assigning permissions to roles that your users can hold, nicely defining boundaries on what certain classes of users can and cannot do. This tutorial will walk you through how to add basic RBAC to Azure Mobile Services.

This tutorial will demonstrate role based access control, checking each user's membership to a Sales group defined in the Azure Active Directory (AAD). The access check will be done with .NET mobile service backend using the [Graph Client Library] for Azure Active Directory. Only users who belong to the Sales group will be allowed to query the data.


>[AZURE.NOTE] The intent of this tutorial is to extend your knowledge of authentication to include authorization practices. It is expected that you first complete the [Add Authentication to your app] tutorial using the Azure Active Directory authentication provider. This tutorial continues to update the TodoItem application used in the [Add Authentication to your app] tutorial.

This tutorial walks you through the following steps:

1. [Create a Sales group with membership]
2. [Generate a key for the Integrated Application]
3. [Create a custom authorization attribute] 
4. [Add role based access checking to the database operations]
5. [Test client access]

This tutorial requires the following:

* Visual Studio 2013 running on Windows 8.1.
* Completion of the [Add Authentication to your app] tutorial using the Azure Active Directory authentication provider.
* Completion of the [Store Server Scripts] tutorial to be familiar with using a Git repository to store server scripts.
 


## <a name="create-group"></a>Create a Sales group with membership

[WACOM.INCLUDE [mobile-services-aad-rbac-create-sales-group](../includes/mobile-services-aad-rbac-create-sales-group.md)]


## <a name="generate-key"></a>Generate a key for the Integrated Application


During the [Add Authentication to your app] tutorial, you created a registration for the integrated application when you completed the [Register to use an Azure Active Directory Login] step. In this section you generate a key to be used when reading directory information with that integrated application's client ID. 

[WACOM.INCLUDE [mobile-services-generate-aad-app-registration-access-key](../includes/mobile-services-generate-aad-app-registration-access-key.md)]



## <a name="create-custom-authorization-attribute"></a>Create a custom authorization attribute on the mobile service 

In this section you will create a new custom authorization attribute that can be used to perform access checks on mobile service operations. The attribute will look up an Active Directory group based on the role name passed to it. It will then perform access checks based on that group's membership.

1. In Visual Studio, right click mobile service .NET backend project and click **Manage NuGet Packages**.

2. In the NuGet Package Manager dialog, enter **ADAL** in the search criteria to find and install the **Active Directory Authentication Library** for your mobile service.

3. In the NuGet Package Manager, also install the **Microsoft Azure Active Directory Graph Client Library** for your mobile service.


4. In Visual Studio, right click your mobile service project and click **Add** then **New Folder**. Name the new folder **Utilities**.

5. In Visual Studio, right click the new **Utilities** folder and add a new class file named **AuthorizeAadRole.cs**.

    ![][0]

6. In the AuthorizeAadRole.cs file, add the following `using` statements at the top of the file. 

        using System.Net;
        using System.Net.Http;
        using System.Web.Http;
        using System.Web.Http.Controllers;
        using System.Web.Http.Filters;
        using Microsoft.Azure.ActiveDirectory.GraphClient;
        using Microsoft.WindowsAzure.Mobile.Service.Security;
        using Microsoft.WindowsAzure.Mobile.Service;
        using Microsoft.IdentityModel.Clients.ActiveDirectory;
        using System.Globalization;
        using System.Linq.Expressions;

7. In AuthorizeAadRole.cs, add the following enumerated type to the Utilities namespace. In this example we only deal with the **Sales** role. The others are just examples of groups you might use.

        public enum AadRoles
        {
            Sales,
            Management,
            Development
        }

8. In AuthorizeAadRole.cs, add the following `AuthorizeAadRole` class definition to the Utilities namespace.

        [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
        public class AuthorizeAadRole : AuthorizationFilterAttribute
        {
            private bool isInitialized;
            private bool isHosted;

            public AuthorizeAadRole(AadRoles role)
            {
                this.Role = role;
            }

            public AadRoles Role { get; private set; }

            public override void OnAuthorization(HttpActionContext actionContext)
            {
            }
        }

9. In AuthorizeAadRole.cs, add the following `GetAADToken` method to the `AuthorizeAadRole` class.

    >[AZURE.NOTE] You should cache the token instead of creating a new one with each access check. Then refresh the cache when attempts to use the token throw a AccessTokenExpiredException as noted in the [Graph Client Library]. This isn't demonstrated in the code below for simplicity sake but, it will alleviate extra network traffic against your Active Directory.  

        private string GetAADToken(ApiServices services)
        {
            const string AadInstance = "https://login.windows.net/{0}";
            const string GraphResourceId = "https://graph.windows.net";

            string tenantdomain;
            string clientid;
            string clientkey;
            string token = null;
            
            if (services == null)
                return null;

            // Try to get the AAD app settings from the mobile service.  
            if (!(services.Settings.TryGetValue("AAD_CLIENT_ID", out clientid) &
                  services.Settings.TryGetValue("AAD_CLIENT_KEY", out clientkey) &
                  services.Settings.TryGetValue("AAD_TENANT_DOMAIN", out tenantdomain)))
            {
                services.Log.Error("GetAADToken: Could not retrieve all AAD app settings from the mobile service configuration.");
                return null;
            }

            ClientCredential clientCred = new ClientCredential(clientid, clientkey);
            string authority = String.Format(CultureInfo.InvariantCulture, AadInstance, tenantdomain);
            AuthenticationContext authContext = new AuthenticationContext(authority);
            AuthenticationResult result = await authContext.AcquireTokenAsync(GraphResourceId, clientid, clientCred);

            if (result != null)
                token = result.AccessToken;

            return token;
        }

10. In AuthorizeAadRole.cs, update the `OnAuthorization` method in the `AuthorizeAadRole` class with the following code. This code uses the [Graph Client Library] to look up the Active Directory group that corresponds to the role. It then checks the user's membership in that group to authorize the user.

    >[AZURE.NOTE] This code looks up the Active Directory group by name. In many cases it's a better practice to store the group id as a mobile service app setting. This is because the group name may change but, the id stays the same. However, with a group name change there is usually at least a change in the scope of the role that may also require an update to the mobile service code.  

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (actionContext == null)
            {
                throw new ArgumentNullException("actionContext");
            }

            ApiServices services = new ApiServices(actionContext.ControllerContext.Configuration);

            // Check whether we are running in a mode where local host access is allowed 
			// through without authentication.
            if (!this.isInitialized)
            {
                HttpConfiguration config = actionContext.ControllerContext.Configuration;
                this.isHosted = config.GetIsHosted();
                this.isInitialized = true;
            }

            // No security when hosted locally
            if (!this.isHosted && actionContext.RequestContext.IsLocal)
            {
                services.Log.Warn("AuthorizeAadRole: Local Hosting.");
                return;
            }

            ApiController controller = actionContext.ControllerContext.Controller as ApiController;
            if (controller == null)
            {
                services.Log.Error("AuthorizeAadRole: No ApiController.");
                return;
            }

            string accessToken = GetAADToken(services);
            if (accessToken == null)
            {
                services.Log.Error("AuthorizeAadRole: Failed to get an AAD access token.");
                return;
            }

            GraphConnection graphConnection = new GraphConnection(accessToken);
            if (graphConnection == null)
            {
                services.Log.Error("AuthorizeAadRole: Failed to get a graph connection.");
                return;
            }

            bool isAuthorized = false;

            // Find the group using a filter on the name
            FilterGenerator groupFilter = new FilterGenerator();
            groupFilter.QueryFilter = ExpressionHelper
                .CreateConditionalExpression(typeof(Group), GraphProperty.DisplayName, Role.ToString(), 
                    ExpressionType.Equal);

            // Get the group id from the filtered results
            PagedResults<Group> groupPages = graphConnection.List<Group>(null, groupFilter);
            string groupId = groupPages.Results.FirstOrDefault().ObjectId;

            // Check group membership to see if the user is part of the group that corresponds to the role
            if (!string.IsNullOrEmpty(groupId))
            {
                ServiceUser serviceUser = controller.User as ServiceUser;
                if (serviceUser != null && serviceUser.Level == AuthorizationLevel.User)
                {
                    var idents = serviceUser.GetIdentitiesAsync().Result;
                    var clientAadCredentials = idents.OfType<AzureActiveDirectoryCredentials>().FirstOrDefault();
                    if (clientAadCredentials != null)
                    {
                        bool isMember = graphConnection.IsMemberOf(groupId, clientAadCredentials.ObjectId);
                        if (isMember)
                        {
                            isAuthorized = true;
                        }
                    }
                }
            }

            if (!isAuthorized)
            {
                actionContext.Response = actionContext.Request
                    .CreateErrorResponse(HttpStatusCode.Forbidden, 
						"User is not logged in or not a member of the required group");
            }
        }

8. Save your changes to AuthorizeAadRole.cs.

## <a name="add-access-checking"></a>Add role based access checking to the database operations

1. In Visual Studio, expand the **Controllers** folder under the mobile service project. Open TodoItemController.cs.

2. In TodoItemController.cs, add a `using` statement for your utilities namespace that contains the custom authorization attribute. 

        using todolistService.Utilities;

3. In TodoItemController.cs, you can add the attribute to your controller class or individual methods depending on how you want access checked. If you want all controller operations to check access based on the same role, just add the attribute to the class. Add the attribute to the class as follows for testing this tutorial.

        [AuthorizeAadRole(AadGroups.Sales)]
        public class TodoItemController : TableController<TodoItem>

    If you only wanted to access check insert, update, and delete operations, you would set the attribute only on those methods as follows.

        // PATCH tables/TodoItem
        [AuthorizeAadRole(AadGroups.Sales)]
        public Task<TodoItem> PatchTodoItem(string id, Delta<TodoItem> patch)
        {
            return UpdateAsync(id, patch);
        }

        // POST tables/TodoItem
        [AuthorizeAadRole(AadGroups.Sales)]
        public async Task<IHttpActionResult> PostTodoItem(TodoItem item)
        {
            TodoItem current = await InsertAsync(item);
            return CreatedAtRoute("Tables", new { id = current.Id }, current);
        }

        // DELETE tables/TodoItem
        [AuthorizeAadRole(AadGroups.Sales)]
        public Task DeleteTodoItem(string id)
        {
            return DeleteAsync(id);
        }


4. Save TodoItemController.cs and build the mobile service to verify no syntax errors.
5. Publish the mobile service to your Azure account.


## <a name="test-client"></a>Test the client's access

[WACOM.INCLUDE [mobile-services-aad-rbac-test-app](../includes/mobile-services-aad-rbac-test-app.md)]





<!-- Anchors. -->
[Create a Sales group with membership]: #create-group
[Generate a key for the Integrated Application]: #generate-key
[Create a custom authorization attribute]: #create-custom-authorization-attribute
[Add role based access checking to the database operations]: #add-access-checking
[Test client access]: #test-client



<!-- Images -->
[0]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-aad-rbac/add-authorize-aad-role-class.png

<!-- URLs. -->
[Add Authentication to your app]: /en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-users/
[How to Register with the Azure Active Directory]: /en-us/documentation/articles/mobile-services-how-to-register-active-directory-authentication/
[Azure Management Portal]: https://manage.windowsazure.com/
[Directory Sync Scenarios]: http://msdn.microsoft.com/library/azure/jj573653.aspx
[Store Server Scripts]: /en-us/documentation/articles/mobile-services-store-scripts-source-control/
[Register to use an Azure Active Directory Login]: /en-us/documentation/articles/mobile-services-how-to-register-active-directory-authentication/
[Graph Client Library]: http://go.microsoft.com/fwlink/?LinkId=510536
[IsMemberOf]: http://msdn.microsoft.com/en-us/library/azure/dn151601.aspx