---
title: How to work with the .NET backend server SDK for Mobile Apps | Microsoft Docs
description: Learn how to work with the .NET backend server SDK for Azure App Service Mobile Apps.
keywords: app service, azure app service, mobile app, mobile service, scale, scalable, app deployment, azure app deployment
services: app-service\mobile
documentationcenter: ''
author: conceptdev
manager: crdun
editor: ''

ms.assetid: 0620554f-9590-40a8-9f47-61c48c21076b
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-multiple
ms.devlang: dotnet
ms.topic: article
ms.date: 10/01/2016
ms.author: crdun

---
# Work with the .NET backend server SDK for Azure Mobile Apps
[!INCLUDE [app-service-mobile-selector-server-sdk](../../includes/app-service-mobile-selector-server-sdk.md)]

This topic shows you how to use the .NET backend server SDK in key Azure App Service Mobile Apps scenarios. The Azure Mobile Apps SDK
helps you work with mobile clients from your ASP.NET application.

> [!TIP]
> The [.NET server SDK for Azure Mobile Apps][2] is open source on GitHub. The repository contains all source code including
> the entire server SDK unit test suite and some sample projects.
>
>

## Reference documentation
The reference documentation for the server SDK is located here: [Azure Mobile Apps .NET Reference][1].

## <a name="create-app"></a>How to: Create a .NET Mobile App backend
If you are starting a new project, you can create an App Service application using either the [Azure portal] or Visual Studio. You can run
the App Service application locally or publish the project to your cloud-based App Service mobile app.

If you are adding mobile capabilities to an existing project, see the [Download and initialize the SDK](#install-sdk) section.

### Create a .NET backend using the Azure portal
To create an App Service mobile backend, either follow the [Quickstart tutorial][3] or follow these steps:

[!INCLUDE [app-service-mobile-dotnet-backend-create-new-service-classic](../../includes/app-service-mobile-dotnet-backend-create-new-service-classic.md)]

Back in the *Get started* blade, under **Create a table API**, choose **C#** as your **Backend language**. Click **Download**, extract the
compressed project files to your local computer, and open the solution in Visual Studio.

### Create a .NET backend using Visual Studio 2017

Install the Azure workload via the Visual Studio Installer to publish to Azure Mobile Apps project from Visual Studio. Once you
have installed the SDK, create an ASP.NET application using the following steps:

1. Open the **New Project** dialog (from **File** > **New** > **Project...**).
2. Expand **Visual C#** and select **Web**.
3. Select **ASP.NET Web Application (.NET Framework)**.
4. Fill in the project name. Then click **OK**.
5. Select **Azure Mobile App** from the list of templates.
6. Click **OK** to create the solution.
7. Right-click on the project in the **Solution Explorer** and choose **Publish...**, then choose **App Service** as the publishing target.
8. Follow the prompts to authenticate and choose a new or existing Azure App Service to publish.

### Create a .NET backend using Visual Studio 2015

Install the [Azure SDK for .NET][4] (version 2.9.0 or later) to create an Azure Mobile Apps project in Visual Studio. Once you
have installed the SDK, create an ASP.NET application using the following steps:

1. Open the **New Project** dialog (from **File** > **New** > **Project...**).
2. Expand **Templates** > **Visual C#**, and select **Web**.
3. Select **ASP.NET Web Application**.
4. Fill in the project name. Then click **OK**.
5. Under *ASP.NET 4.5.2 Templates*, select **Azure Mobile App**. Check **Host in the cloud** to create a mobile backend in the cloud to which you can publish this project.
6. Click **OK**.

## <a name="install-sdk"></a>How to: Download and initialize the SDK
The SDK is available on [NuGet.org]. This package includes the base functionality required to get started using the SDK. To initialize the SDK, you
need to perform actions on the **HttpConfiguration** object.

### Install the SDK
To install the SDK, right-click on the server project in Visual Studio, select **Manage NuGet Packages**, search for the [Microsoft.Azure.Mobile.Server]
package, then click **Install**.

### <a name="server-project-setup"></a> Initialize the server project
A .NET backend server project is initialized similar to other ASP.NET projects, by including an OWIN startup class. Ensure that you have referenced
the NuGet package `Microsoft.Owin.Host.SystemWeb`. To add this class in Visual Studio, right-click on your server project and select **Add** >
**New Item**, then **Web** > **General** > **OWIN Startup class**.  A class is generated with the following attribute:

    [assembly: OwinStartup(typeof(YourServiceName.YourStartupClassName))]

In the `Configuration()` method of your OWIN startup class, use an **HttpConfiguration** object to configure the Azure Mobile Apps environment.
The following example initializes the server project with no added features:

    // in OWIN startup class
    public void Configuration(IAppBuilder app)
    {
        HttpConfiguration config = new HttpConfiguration();

        new MobileAppConfiguration()
            // no added features
            .ApplyTo(config);

        app.UseWebApi(config);
    }

To enable individual features, you must call extension methods on the **MobileAppConfiguration** object before calling **ApplyTo**. For example,
the following code adds the default routes to all API controllers that have the attribute `[MobileAppController]` during initialization:

    new MobileAppConfiguration()
        .MapApiControllers()
        .ApplyTo(config);

The server quickstart from the Azure portal calls **UseDefaultConfiguration()**. This equivalent to the following setup:

        new MobileAppConfiguration()
            .AddMobileAppHomeController()             // from the Home package
            .MapApiControllers()
            .AddTables(                               // from the Tables package
                new MobileAppTableConfiguration()
                    .MapTableControllers()
                    .AddEntityFramework()             // from the Entity package
                )
            .AddPushNotifications()                   // from the Notifications package
            .MapLegacyCrossDomainController()         // from the CrossDomain package
            .ApplyTo(config);

The extension methods used are:

* `AddMobileAppHomeController()` provides the default Azure Mobile Apps home page.
* `MapApiControllers()` provides custom API capabilities for WebAPI controllers decorated with the `[MobileAppController]` attribute.
* `AddTables()` provides a mapping of the `/tables` endpoints to table controllers.
* `AddTablesWithEntityFramework()` is a short-hand for mapping the `/tables` endpoints using Entity Framework based controllers.
* `AddPushNotifications()` provides a simple method of registering devices for Notification Hubs.
* `MapLegacyCrossDomainController()` provides standard CORS headers for local development.

### SDK extensions
The following NuGet-based extension packages provide various mobile features that can be used by your application. You enable extensions during
initialization by using the **MobileAppConfiguration** object.

* [Microsoft.Azure.Mobile.Server.Quickstart]
     Supports the basic Mobile Apps setup. Added to the configuration by calling the **UseDefaultConfiguration** extension method during
     initialization. This extension includes following extensions: Notifications, Authentication, Entity, Tables, Cross-domain, and Home
     packages. This package is used by the Mobile Apps Quickstart available on the Azure portal.
* [Microsoft.Azure.Mobile.Server.Home](https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Home/)
    Implements the default *this mobile app is up and running page* for the web site root. Add to the configuration by calling the
    **AddMobileAppHomeController** extension method.
* [Microsoft.Azure.Mobile.Server.Tables](https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Tables/)
    includes classes for working with data and sets-up the data pipeline. Add to the configuration by calling the **AddTables** extension method.
* [Microsoft.Azure.Mobile.Server.Entity](https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Entity/)
    Enables the Entity Framework to access data in the SQL Database. Add to the configuration by calling the **AddTablesWithEntityFramework** extension method.
* [Microsoft.Azure.Mobile.Server.Authentication]
    Enables authentication and sets-up the OWIN middleware used to validate tokens. Add to the configuration by calling the **AddAppServiceAuthentication**
    and **IAppBuilder**.**UseAppServiceAuthentication** extension methods.
* [Microsoft.Azure.Mobile.Server.Notifications]
    Enables push notifications and defines a push registration endpoint. Add to the configuration by calling the **AddPushNotifications** extension method.
* [Microsoft.Azure.Mobile.Server.CrossDomain](https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.CrossDomain/)
    Creates a controller that serves data to legacy web browsers from your Mobile App. Add to the configuration by calling the
    **MapLegacyCrossDomainController** extension method.
* [Microsoft.Azure.Mobile.Server.Login]
     Provides the AppServiceLoginHandler.CreateToken() method, which is a static method used during custom authentication scenarios.

## <a name="publish-server-project"></a>How to: Publish the server project
This section shows you how to publish your .NET backend project from Visual Studio. You can also deploy your backend project using [Git](../app-service/deploy-local-git.md) or any of
the other methods available there.

1. In Visual Studio, rebuild the project to restore NuGet packages.
2. In Solution Explorer, right-click the project, click **Publish**. The first time you publish, you need to define a publishing profile. When
   you already have a profile defined, you can select it and click **Publish**.
3. If asked to select a publish target, click **Microsoft Azure App Service** > **Next**, then (if needed) sign-in with your Azure credentials.
   Visual Studio downloads and securely stores your publish settings directly from Azure.

    ![](./media/app-service-mobile-dotnet-backend-how-to-use-server-sdk/publish-wizard-1.png)
4. Choose your **Subscription**, select **Resource Type** from **View**, expand **Mobile App**, and click your Mobile App backend, then click **OK**.

    ![](./media/app-service-mobile-dotnet-backend-how-to-use-server-sdk/publish-wizard-2.png)
5. Verify the publish profile information and click **Publish**.

    ![](./media/app-service-mobile-dotnet-backend-how-to-use-server-sdk/publish-wizard-3.png)

    When your Mobile App backend has published successfully, you see a landing page indicating success.

    ![](./media/app-service-mobile-dotnet-backend-how-to-use-server-sdk/publish-success.png)

## <a name="define-table-controller"></a> How to: Define a table controller
Define a Table Controller to expose a SQL table to mobile clients.  Configuring a Table Controller requires three steps:

1. Create a Data Transfer Object (DTO) class.
2. Configure a table reference in the Mobile DbContext class.
3. Create a table controller.

A Data Transfer Object (DTO) is a plain C# object that inherits from `EntityData`.  For example:

    public class TodoItem : EntityData
    {
        public string Text { get; set; }
        public bool Complete {get; set;}
    }

The DTO is used to define the table within the SQL database.  To create the database entry, add a `DbSet<>` property to
the DbContext you are using.  In the default project template for Azure Mobile Apps, the DbContext is called `Models\MobileServiceContext.cs`:

    public class MobileServiceContext : DbContext
    {
        private const string connectionStringName = "Name=MS_TableConnectionString";

        public MobileServiceContext() : base(connectionStringName)
        {

        }

        public DbSet<TodoItem> TodoItems { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Add(
                new AttributeToColumnAnnotationConvention<TableColumnAttribute, string>(
                    "ServiceColumnTable", (property, attributes) => attributes.Single().ColumnType.ToString()));
        }
    }

If you have the Azure SDK installed, you can now create a template table controller as follows:

1. Right-click on the Controllers folder and select **Add** > **Controller...**.
2. Select the **Azure Mobile Apps Table Controller** option, then click **Add**.
3. In the **Add Controller** dialog:
   * In the **Model class** dropdown, select your new DTO.
   * In the **DbContext** dropdown, select the Mobile Service DbContext class.
   * The Controller name is created for you.
4. Click **Add**.

The quickstart server project contains an example for a simple **TodoItemController**.

### <a name="adjust-pagesize"></a>How to: Adjust the table paging size
By default, Azure Mobile Apps returns 50 records per request.  Paging ensures that the client does not tie up their UI thread nor the server for
too long, ensuring a good user experience. To change the table paging size, increase the server side "allowed query size" and the client-side page size
The server side "allowed query size" is adjusted using the `EnableQuery` attribute:

    [EnableQuery(PageSize = 500)]

Ensure the PageSize is the same or larger than the size requested by the client.  Refer to the specific client HOWTO documentation
for details on changing the client page size.

## How to: Define a custom API controller
The custom API controller provides the most basic functionality to your Mobile App backend by exposing an endpoint. You can register a
mobile-specific API controller using the [MobileAppController] attribute. The `MobileAppController` attribute registers the route, sets
up the Mobile Apps JSON serializer, and turns on [client version checking](app-service-mobile-client-and-server-versioning.md).

1. In Visual Studio, right-click the Controllers folder, then click **Add** > **Controller**, select **Web API 2 Controller&mdash;Empty** and click **Add**.
2. Supply a **Controller name**, such as `CustomController`, and click **Add**.
3. In the new controller class file, add the following using statement:

        using Microsoft.Azure.Mobile.Server.Config;
4. Apply the **[MobileAppController]** attribute to the API controller class definition, as in the following example:

        [MobileAppController]
        public class CustomController : ApiController
        {
              //...
        }
5. In App_Start/Startup.MobileApp.cs file, add a call to the **MapApiControllers** extension method, as in the following example:

        new MobileAppConfiguration()
            .MapApiControllers()
            .ApplyTo(config);

You can also use the `UseDefaultConfiguration()` extension method instead of `MapApiControllers()`. Any controller that does not have
**MobileAppControllerAttribute** applied can still be accessed by clients, but it may not be correctly consumed by clients using any
Mobile App client SDK.

## How to: Work with authentication
Azure Mobile Apps uses App Service Authentication / Authorization to secure your mobile backend.  This section shows you how to perform
the following authentication-related tasks in your .NET backend server project:

* [How to: Add authentication to a server project](#add-auth)
* [How to: Use custom authentication for your application](#custom-auth)
* [How to: Retrieve authenticated user information](#user-info)
* [How to: Restrict data access for authorized users](#authorize)

### <a name="add-auth"></a>How to: Add authentication to a server project
You can add authentication to your server project by extending the **MobileAppConfiguration** object and configuring OWIN middleware. When
you install the [Microsoft.Azure.Mobile.Server.Quickstart] package and call the **UseDefaultConfiguration** extension method, you can skip
to step 3.

1. In Visual Studio, install the [Microsoft.Azure.Mobile.Server.Authentication] package.
2. In the Startup.cs project file, add the following line of code at the beginning of the **Configuration** method:

        app.UseAppServiceAuthentication(config);

    This OWIN middleware component validates tokens issued by the associated App Service gateway.
3. Add the `[Authorize]` attribute to any controller or method that requires authentication.

To learn about how to authenticate clients to your Mobile Apps backend, see [Add authentication to your app](app-service-mobile-ios-get-started-users.md).

### <a name="custom-auth"></a>How to: Use custom authentication for your application
> [!IMPORTANT]
> In order to enable custom authentication, you must first enable App Service Authentication without selecting a provider for your App Service in the Azure portal. This will enable the WEBSITE_AUTH_SIGNING_KEY environment variable when hosted.
> 
> 
> If you do not wish to use one of the App Service Authentication/Authorization providers, you can implement your own login system. Install
> the [Microsoft.Azure.Mobile.Server.Login] package to assist with authentication token generation.  Provide your own code for validating
> user credentials. For example, you might check against salted and hashed passwords in a database. In the example below, the `isValidAssertion()`
> method (defined elsewhere) is responsible for these checks.

The custom authentication is exposed by creating an ApiController and exposing `register` and `login` actions. The client should use
a custom UI to collect the information from the user.  The information is then submitted to the API with a standard HTTP POST call. Once
the server validates the assertion, a token is issued using the `AppServiceLoginHandler.CreateToken()` method.  The ApiController **should not**
use the `[MobileAppController]` attribute.

An example `login` action:

        public IHttpActionResult Post([FromBody] JObject assertion)
        {
            if (isValidAssertion(assertion)) // user-defined function, checks against a database
            {
                JwtSecurityToken token = AppServiceLoginHandler.CreateToken(new Claim[] { new Claim(JwtRegisteredClaimNames.Sub, assertion["username"]) },
                    mySigningKey,
                    myAppURL,
                    myAppURL,
                    TimeSpan.FromHours(24) );
                return Ok(new LoginResult()
                {
                    AuthenticationToken = token.RawData,
                    User = new LoginResultUser() { UserId = userName.ToString() }
                });
            }
            else // user assertion was not valid
            {
                return this.Request.CreateUnauthorizedResponse();
            }
        }

In the preceding example, LoginResult and LoginResultUser are serializable objects exposing required properties. The client expects login
responses to be returned as JSON objects of the form:

        {
            "authenticationToken": "<token>",
            "user": {
                "userId": "<userId>"
            }
        }

The `AppServiceLoginHandler.CreateToken()` method includes an *audience* and an *issuer* parameter. Both of these parameters are set to the URL
of your application root, using the HTTPS scheme. Similarly you should set *secretKey* to be the value of your application's signing key. Do not
distribute the signing key in a client as it can be used to mint keys and impersonate users. You can obtain the signing key while hosted in App
Service by referencing the *WEBSITE\_AUTH\_SIGNING\_KEY* environment variable. If needed in a local debugging context, follow the instructions in
the [Local debugging with authentication](#local-debug) section to retrieve the key and store it as an application setting.

The issued token may also include other claims and an expiry date.  Minimally, the issued token must include a subject (**sub**) claim.

You can support the standard client `loginAsync()` method by overloading the authentication route.  If the client calls `client.loginAsync('custom');`
to log in, your route must be `/.auth/login/custom`.  You can set the route for the custom authentication controller using `MapHttpRoute()`:

    config.Routes.MapHttpRoute("custom", ".auth/login/custom", new { controller = "CustomAuth" });

> [!TIP]
> Using the `loginAsync()` approach ensures that the authentication token is attached to every subsequent call to the service.
>
>

### <a name="user-info"></a>How to: Retrieve authenticated user information
When a user is authenticated by App Service, you can access the assigned user ID and other information in your .NET backend code. The user
information can be used for making authorization decisions in the backend. The following code obtains the user ID associated with a request:

    // Get the SID of the current user.
    var claimsPrincipal = this.User as ClaimsPrincipal;
    string sid = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier).Value;

The SID is derived from the provider-specific user ID and is static for a given user and login provider.  The SID is null for invalid
authentication tokens.

App Service also lets you request specific claims from your login provider. Each identity provider can provide more information using the
identity provider SDK.  For example, you can use the Facebook Graph API for friends information.  You can specify claims that are requested
in the provider blade in the Azure portal. Some claims require additional configuration with the identity provider.

The following code calls the **GetAppServiceIdentityAsync** extension method to get the login credentials, which include the access token
needed to make requests against the Facebook Graph API:

    // Get the credentials for the logged-in user.
    var credentials =
        await this.User
        .GetAppServiceIdentityAsync<FacebookCredentials>(this.Request);

    if (credentials.Provider == "Facebook")
    {
        // Create a query string with the Facebook access token.
        var fbRequestUrl = "https://graph.facebook.com/me/feed?access_token="
            + credentials.AccessToken;

        // Create an HttpClient request.
        var client = new System.Net.Http.HttpClient();

        // Request the current user info from Facebook.
        var resp = await client.GetAsync(fbRequestUrl);
        resp.EnsureSuccessStatusCode();

        // Do something here with the Facebook user information.
        var fbInfo = await resp.Content.ReadAsStringAsync();
    }

Add a using statement for `System.Security.Principal` to provide the **GetAppServiceIdentityAsync** extension method.

### <a name="authorize"></a>How to: Restrict data access for authorized users
In the previous section, we showed how to retrieve the user ID of an authenticated user. You can restrict access to data and other
resources based on this value. For example, adding a userId column to tables and filtering the query results by the user ID is
a simple way to limit returned data only to authorized users. The following code returns data rows only when the SID matches the
value in the UserId column on the TodoItem table:

    // Get the SID of the current user.
    var claimsPrincipal = this.User as ClaimsPrincipal;
    string sid = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier).Value;

    // Only return data rows that belong to the current user.
    return Query().Where(t => t.UserId == sid);

The `Query()` method returns an `IQueryable` that can be manipulated by LINQ to handle filtering.

## How to: Add push notifications to a server project
Add push notifications to your server project by extending the **MobileAppConfiguration** object and creating a Notification Hubs
client.

1. In Visual Studio, right-click the server project and click **Manage NuGet Packages**, search for `Microsoft.Azure.Mobile.Server.Notifications`,
   then click **Install**.
2. Repeat this step to install the `Microsoft.Azure.NotificationHubs` package, which includes the Notification Hubs client library.
3. In App_Start/Startup.MobileApp.cs, and add a call to the **AddPushNotifications()** extension method during initialization:

        new MobileAppConfiguration()
            // other features...
            .AddPushNotifications()
            .ApplyTo(config);
4. Add the following code that creates a Notification Hubs client:

        // Get the settings for the server project.
        HttpConfiguration config = this.Configuration;
        MobileAppSettingsDictionary settings =
            config.GetMobileAppSettingsProvider().GetMobileAppSettings();

        // Get the Notification Hubs credentials for the Mobile App.
        string notificationHubName = settings.NotificationHubName;
        string notificationHubConnection = settings
            .Connections[MobileAppSettingsKeys.NotificationHubConnectionString].ConnectionString;

        // Create a new Notification Hub client.
        NotificationHubClient hub = NotificationHubClient
            .CreateClientFromConnectionString(notificationHubConnection, notificationHubName);

You can now use the Notification Hubs client to send push notifications to registered devices. For more information,
see [Add push notifications to your app](app-service-mobile-ios-get-started-push.md). To learn more about Notification Hubs,
see [Notification Hubs Overview](../notification-hubs/notification-hubs-push-notification-overview.md).

## <a name="tags"></a>How to: Enable targeted push using Tags
Notification Hubs lets you send targeted notifications to specific registrations by using tags. Several tags are created automatically:

* The Installation ID identifies a specific device.
* The User Id based on the authenticated SID identifies a specific user.

The installation ID can be accessed from the **installationId** property on the **MobileServiceClient**.  The following example shows how to
use an installation ID to add a tag to a specific installation in Notification Hubs:

    hub.PatchInstallation("my-installation-id", new[]
    {
        new PartialUpdateOperation
        {
            Operation = UpdateOperationType.Add,
            Path = "/tags",
            Value = "{my-tag}"
        }
    });

Any tags supplied by the client during push notification registration are ignored by the backend when creating the installation. To enable a client
to add tags to the installation, you must create a custom API that adds tags using the preceding pattern.

See [Client-added push notification tags][5] in the App Service Mobile Apps completed quickstart sample for an example.

## <a name="push-user"></a>How to: Send push notifications to an authenticated user
When an authenticated user registers for push notifications, a user ID tag is automatically added to the registration. By using
this tag, you can send push notifications to all devices registered by that person. The following code gets the SID of user making the
request and sends a template push notification to every device registration for that person:

    // Get the current user SID and create a tag for the current user.
    var claimsPrincipal = this.User as ClaimsPrincipal;
    string sid = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier).Value;
    string userTag = "_UserId:" + sid;

    // Build a dictionary for the template with the item message text.
    var notification = new Dictionary<string, string> { { "message", item.Text } };

    // Send a template notification to the user ID.
    await hub.SendTemplateNotificationAsync(notification, userTag);

When registering for push notifications from an authenticated client, make sure that authentication is complete before attempting
registration. For more information, see [Push to users][6] in the App Service Mobile Apps completed quickstart sample for .NET backend.

## How to: Debug and troubleshoot the .NET Server SDK
Azure App Service provides several debugging and troubleshooting techniques for ASP.NET applications:

* [Monitoring an Azure App Service](../app-service/web-sites-monitor.md)
* [Enable Diagnostic Logging in Azure App Service](../app-service/troubleshoot-diagnostic-logs.md)
* [Troubleshoot an Azure App Service in Visual Studio](../app-service/troubleshoot-dotnet-visual-studio.md)

### Logging
You can write to App Service diagnostic logs by using the standard ASP.NET trace writing. Before you can write to the logs, you must enable
diagnostics in your Mobile App backend.

To enable diagnostics and write to the logs:

1. Follow the steps in [How to enable diagnostics](../app-service/troubleshoot-diagnostic-logs.md#enablediag).
2. Add the following using statement in your code file:

        using System.Web.Http.Tracing;
3. Create a trace writer to write from the .NET backend to the diagnostic logs, as follows:

        ITraceWriter traceWriter = this.Configuration.Services.GetTraceWriter();
        traceWriter.Info("Hello, World");
4. Republish your server project, and access the Mobile App backend to execute the code path with the logging.
5. Download and evaluate the logs, as described in [How to: Download logs](../app-service/troubleshoot-diagnostic-logs.md#download).

### <a name="local-debug"></a>Local debugging with authentication
You can run your application locally to test changes before publishing them to the cloud. For most Azure Mobile Apps backends, press *F5* while
in Visual Studio. However, there are some additional considerations when using authentication.

You must have a cloud-based mobile app with App Service Authentication/Authorization configured, and your client must have the cloud endpoint
specified as the alternate login host. See the documentation for your client platform for the specific steps required.

Ensure that your mobile backend has [Microsoft.Azure.Mobile.Server.Authentication] installed. Then, in your application's OWIN startup class,
add the following, after `MobileAppConfiguration` has been applied to your `HttpConfiguration`:

        app.UseAppServiceAuthentication(new AppServiceAuthenticationOptions()
        {
            SigningKey = ConfigurationManager.AppSettings["authSigningKey"],
            ValidAudiences = new[] { ConfigurationManager.AppSettings["authAudience"] },
            ValidIssuers = new[] { ConfigurationManager.AppSettings["authIssuer"] },
            TokenHandler = config.GetAppServiceTokenHandler()
        });

In the preceding example, you should configure the *authAudience* and *authIssuer* application settings within your Web.config file to each be the
URL of your application root, using the HTTPS scheme. Similarly you should set *authSigningKey* to be the value of your application's signing key.
To obtain the signing key:

1. Navigate to your app within the [Azure portal]
2. Click **Tools**, **Kudu**, **Go**.
3. In the Kudu Management site, click **Environment**.
4. Find the value for *WEBSITE\_AUTH\_SIGNING\_KEY*.

Use the signing key for the *authSigningKey* parameter in your local application config.  Your mobile backend is now equipped to validate
tokens when running locally, which the client obtains the token from the cloud-based endpoint.

[1]: https://msdn.microsoft.com/library/azure/dn961176.aspx
[2]: https://github.com/Azure/azure-mobile-apps-net-server
[3]: app-service-mobile-ios-get-started.md
[4]: https://azure.microsoft.com/downloads/
[5]: https://github.com/Azure-Samples/app-service-mobile-dotnet-backend-quickstart/blob/master/README.md#client-added-push-notification-tags
[6]: https://github.com/Azure-Samples/app-service-mobile-dotnet-backend-quickstart/blob/master/README.md#push-to-users
[Azure portal]: https://portal.azure.com
[NuGet.org]: https://www.nuget.org/
[Microsoft.Azure.Mobile.Server]: https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server/
[Microsoft.Azure.Mobile.Server.Quickstart]: https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Quickstart/
[Microsoft.Azure.Mobile.Server.Authentication]: https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Authentication/
[Microsoft.Azure.Mobile.Server.Login]: https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Login/
[Microsoft.Azure.Mobile.Server.Notifications]: https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Notifications/
[MapHttpAttributeRoutes]: https://msdn.microsoft.com/library/dn479134(v=vs.118).aspx
