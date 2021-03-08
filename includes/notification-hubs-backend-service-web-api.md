---
 author: mikeparker104
 ms.author: miparker
 ms.date: 06/02/2020
 ms.service: notification-hubs
 ms.topic: include
---

### Create a web project

1. In **Visual Studio**, select **File** > **New Solution**.

1. Select **.NET Core** > **App** > **ASP.NET Core** > **API** > **Next**.
  
1. In the **Configure your new ASP.NET Core Web API** dialog, select **Target Framework** of **.NET Core 3.1**.

1. Enter *PushDemoApi* for the **Project Name** and then select **Create**.

1. Start debugging (**Command** + **Enter**) to test the templated app.

    > [!NOTE]
    > The templated app is configured to use the **WeatherForecastController** as the *launchUrl*. This is set in **Properties** > **launchSettings.json**.  
    >
    > If you are prompted with an **Invalid development certificate found** message:
    >
    > 1. Click **Yes** to agree to running the 'dotnet dev-certs https' tool to fix this. The 'dotnet dev-certs https' tool then prompt you to enter a password for the certificate and the password for your Keychain.
    >
    > 1. Click **Yes** when prompted to **Install and trust the new certificate**, then enter the password for your Keychain.

1. Expand the **Controllers** folder, then delete **WeatherForecastController.cs**.

1. Delete **WeatherForecast.cs**.

1. **Control** + **Click** on the **PushDemoApi** project, then choose **New File...** from the **Add** menu.

1. Set up local configuration values using the [Secret Manager tool](/aspnet/core/security/app-secrets?tabs=linux&view=aspnetcore-3.1#secret-manager). Decoupling the secrets from the solution ensures that they don't end up in source control. Open **Terminal** then go to the directory of the project file and run the following commands:

    ```bash
    dotnet user-secrets init
    dotnet user-secrets set "NotificationHub:Name" <value>
    dotnet user-secrets set "NotificationHub:ConnectionString" <value>
    ```

    Replace the placeholder values with your own notification hub name and connection string values. You made a note of them in the [create a notification hub](#create-a-notification-hub) section. Otherwise, you can look them up in [Azure](https://portal.azure.com).

    **NotificationsHub:Name**:  
    See *Name* in the **Essentials** summary at the top of **Overview**.  

    **NotificationHub:ConnectionString**:  
    See *DefaultFullSharedAccessSignature* in **Access Policies**

    > [!NOTE]
    > For production scenarios, you can look at options such as [Azure KeyVault](https://azure.microsoft.com/services/key-vault) to securely store the connection string. For simplicity, the secrets will be added to the [Azure App Service](https://azure.microsoft.com/services/app-service/) application settings.

### Authenticate clients using an API Key (Optional)

API keys aren't as secure as tokens, but will suffice for the purposes of this tutorial. An API key can be configured easily via the [ASP.NET Middleware](/aspnet/core/fundamentals/middleware/?view=aspnetcore-3.1).

1. Add the **API key** to the local configuration values.

    ```bash
    dotnet user-secrets set "Authentication:ApiKey" <value>
    ```

    > [!NOTE]
    > You should replace the placeholder value with your own and make a note of it.

1. **Control** + **Click** on the **PushDemoApi** project, choose **New Folder** from the **Add** menu, then click **Add** using *Authentication* as the **Folder Name**.

1. **Control** + **Click** on the **Authentication** folder, then choose **New File...** from the **Add** menu.

1. Select **General** > **Empty Class**, enter *ApiKeyAuthOptions.cs* for the **Name**, then click **New** adding the following implementation.

    ```csharp
    using Microsoft.AspNetCore.Authentication;

    namespace PushDemoApi.Authentication
    {
        public class ApiKeyAuthOptions : AuthenticationSchemeOptions
        {
            public const string DefaultScheme = "ApiKey";
            public string Scheme => DefaultScheme;
            public string ApiKey { get; set; }
        }
    }
    ```

1. Add another **Empty Class** to the **Authentication** folder called *ApiKeyAuthHandler.cs*, then add the following implementation.

    ```csharp
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Security.Claims;
    using System.Text.Encodings.Web;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authentication;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;

    namespace PushDemoApi.Authentication
    {
        public class ApiKeyAuthHandler : AuthenticationHandler<ApiKeyAuthOptions>
        {
            const string ApiKeyIdentifier = "apikey";

            public ApiKeyAuthHandler(
                IOptionsMonitor<ApiKeyAuthOptions> options,
                ILoggerFactory logger,
                UrlEncoder encoder,
                ISystemClock clock)
                : base(options, logger, encoder, clock) {}

            protected override Task<AuthenticateResult> HandleAuthenticateAsync()
            {
                string key = string.Empty;

                if (Request.Headers[ApiKeyIdentifier].Any())
                {
                    key = Request.Headers[ApiKeyIdentifier].FirstOrDefault();
                }
                else if (Request.Query.ContainsKey(ApiKeyIdentifier))
                {
                    if (Request.Query.TryGetValue(ApiKeyIdentifier, out var queryKey))
                        key = queryKey;
                }

                if (string.IsNullOrWhiteSpace(key))
                    return Task.FromResult(AuthenticateResult.Fail("No api key provided"));

                if (!string.Equals(key, Options.ApiKey, StringComparison.Ordinal))
                    return Task.FromResult(AuthenticateResult.Fail("Invalid api key."));

                var identities = new List<ClaimsIdentity> {
                    new ClaimsIdentity("ApiKeyIdentity")
                };

                var ticket = new AuthenticationTicket(
                    new ClaimsPrincipal(identities), Options.Scheme);

                return Task.FromResult(AuthenticateResult.Success(ticket));
            }
        }
    }
    ```

    > [!NOTE]
    > An [Authentication Handler](/aspnet/core/security/authentication/?view=aspnetcore-3.1#authentication-handler) is a type that implements the behavior of a scheme, in this case a custom API Key scheme.

1. Add another **Empty Class** to the **Authentication** folder called *ApiKeyAuthenticationBuilderExtensions.cs*, then add the following implementation.

    ```csharp
    using System;
    using Microsoft.AspNetCore.Authentication;

    namespace PushDemoApi.Authentication
    {
        public static class AuthenticationBuilderExtensions
        {
            public static AuthenticationBuilder AddApiKeyAuth(
                this AuthenticationBuilder builder,
                Action<ApiKeyAuthOptions> configureOptions)
            {
                return builder
                    .AddScheme<ApiKeyAuthOptions, ApiKeyAuthHandler>(
                        ApiKeyAuthOptions.DefaultScheme,
                        configureOptions);
            }
        }
    }
    ```

    > [!NOTE]
    > This extension method simplifies the middleware configuration code in **Startup.cs** making it more readable and generally easier to follow.

1. In **Startup.cs**, update the **ConfigureServices** method to configure the API Key authentication below the call to the **services.AddControllers** method.

    ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = ApiKeyAuthOptions.DefaultScheme;
            options.DefaultChallengeScheme = ApiKeyAuthOptions.DefaultScheme;
        }).AddApiKeyAuth(Configuration.GetSection("Authentication").Bind);
    }
    ```

1. Still in **Startup.cs**, update the **Configure** method to call the **UseAuthentication** and **UseAuthorization** extension methods on the app's **IApplicationBuilder**. Ensure those methods are called after **UseRouting** and before **app.UseEndpoints**.

    ```csharp
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseHttpsRedirection();

        app.UseRouting();

        app.UseAuthentication();

        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
    ```

    > [!NOTE]
    > Calling **UseAuthentication** registers the middleware which uses the previously registered authentication schemes (from **ConfigureServices**). This must be called before any middleware that depends on users being authenticated.

### Add Dependencies and Configure Services

ASP.NET Core supports the [dependency injection (DI)](/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-3.1) software design pattern, which is a technique for achieving [Inversion of Control (IoC)](/dotnet/standard/modern-web-apps-azure-architecture/architectural-principles#dependency-inversion) between classes and their dependencies.  

Use of the notification hub and the [Notification Hubs SDK for backend operations](https://www.nuget.org/packages/Microsoft.Azure.NotificationHubs/) is encapsulated within a service. The service is registered and made available through a suitable abstraction.

1. **Control** + **Click** on the **Dependencies** folder, then choose **Manage NuGet Packages...**.

1. Search for **Microsoft.Azure.NotificationHubs** and ensure it's checked.

1. Click **Add Packages**, then click **Accept** when prompted to accept the license terms.

1. **Control** + **Click** on the **PushDemoApi** project, choose **New Folder** from the **Add** menu, then click **Add** using *Models* as the **Folder Name**.

1. **Control** + **Click** on the **Models** folder, then choose **New File...** from the **Add** menu.

1. Select **General** > **Empty Class**, enter *PushTemplates.cs* for the **Name**, then click **New** adding the following implementation.

    ```csharp
    namespace PushDemoApi.Models
    {
        public class PushTemplates
        {
            public class Generic
            {
                public const string Android = "{ \"notification\": { \"title\" : \"PushDemo\", \"body\" : \"$(alertMessage)\"}, \"data\" : { \"action\" : \"$(alertAction)\" } }";
                public const string iOS = "{ \"aps\" : {\"alert\" : \"$(alertMessage)\"}, \"action\" : \"$(alertAction)\" }";
            }

            public class Silent
            {
                public const string Android = "{ \"data\" : {\"message\" : \"$(alertMessage)\", \"action\" : \"$(alertAction)\"} }";
                public const string iOS = "{ \"aps\" : {\"content-available\" : 1, \"apns-priority\": 5, \"sound\" : \"\", \"badge\" : 0}, \"message\" : \"$(alertMessage)\", \"action\" : \"$(alertAction)\" }";
            }
        }
    }
    ```

    > [!NOTE]
    > This class contains the tokenized notification payloads for the generic and silent notifications required by this scenario. The payloads are defined outside of the [Installation](/dotnet/api/microsoft.azure.notificationhubs.installation) to allow experimentation without having to update existing installations via the service. Handling changes to installations in this way is out of scope for this tutorial. For production, consider [custom templates](../articles/notification-hubs/notification-hubs-templates-cross-platform-push-messages.md).

1. Select **General** > **Empty Class**, enter *DeviceInstallation.cs* for the **Name**, then click **New** adding the following implementation.

    ```csharp
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    namespace PushDemoApi.Models
    {
        public class DeviceInstallation
        {
            [Required]
            public string InstallationId { get; set; }

            [Required]
            public string Platform { get; set; }

            [Required]
            public string PushChannel { get; set; }

            public IList<string> Tags { get; set; } = Array.Empty<string>();
        }
    }
    ```

1. Add another **Empty Class** to the **Models** folder called *NotificationRequest.cs*, then add the following implementation.

    ```csharp
    using System;

    namespace PushDemoApi.Models
    {
        public class NotificationRequest
        {
            public string Text { get; set; }
            public string Action { get; set; }
            public string[] Tags { get; set; } = Array.Empty<string>();
            public bool Silent { get; set; }
        }
    }
    ```

1. Add another **Empty Class** to the **Models** folder called *NotificationHubOptions.cs*, then add the following implementation.

    ```csharp
    using System.ComponentModel.DataAnnotations;

    namespace PushDemoApi.Models
    {
        public class NotificationHubOptions
        {
            [Required]
            public string Name { get; set; }

            [Required]
            public string ConnectionString { get; set; }
        }
    }
    ```

1. Add a new folder to the **PushDemoApi** project called *Services*.

1. Add an **Empty Interface** to the **Services** folder called *INotificationService.cs*, then add the following implementation.

    ```csharp
    using System.Threading.Tasks;
    using PushDemoApi.Models;

    namespace PushDemoApi.Services
    {
        public interface INotificationService
        {
            Task<bool> CreateOrUpdateInstallationAsync(DeviceInstallation deviceInstallation, CancellationToken token);
            Task<bool> DeleteInstallationByIdAsync(string installationId, CancellationToken token);
            Task<bool> RequestNotificationAsync(NotificationRequest notificationRequest, CancellationToken token);
        }
    }
    ```

1. Add an **Empty Class** to the **Services** folder called *NotificationHubsService.cs*, then add the following code to implement the **INotificationService** interface:

    ```csharp
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.NotificationHubs;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using PushDemoApi.Models;

    namespace PushDemoApi.Services
    {
        public class NotificationHubService : INotificationService
        {
            readonly NotificationHubClient _hub;
            readonly Dictionary<string, NotificationPlatform> _installationPlatform;
            readonly ILogger<NotificationHubService> _logger;

            public NotificationHubService(IOptions<NotificationHubOptions> options, ILogger<NotificationHubService> logger)
            {
                _logger = logger;
                _hub = NotificationHubClient.CreateClientFromConnectionString(
                    options.Value.ConnectionString,
                    options.Value.Name);

                _installationPlatform = new Dictionary<string, NotificationPlatform>
                {
                    { nameof(NotificationPlatform.Apns).ToLower(), NotificationPlatform.Apns },
                    { nameof(NotificationPlatform.Fcm).ToLower(), NotificationPlatform.Fcm }
                };
            }

            public async Task<bool> CreateOrUpdateInstallationAsync(DeviceInstallation deviceInstallation, CancellationToken token)
            {
                if (string.IsNullOrWhiteSpace(deviceInstallation?.InstallationId) ||
                    string.IsNullOrWhiteSpace(deviceInstallation?.Platform) ||
                    string.IsNullOrWhiteSpace(deviceInstallation?.PushChannel))
                    return false;

                var installation = new Installation()
                {
                    InstallationId = deviceInstallation.InstallationId,
                    PushChannel = deviceInstallation.PushChannel,
                    Tags = deviceInstallation.Tags
                };

                if (_installationPlatform.TryGetValue(deviceInstallation.Platform, out var platform))
                    installation.Platform = platform;
                else
                    return false;

                try
                {
                    await _hub.CreateOrUpdateInstallationAsync(installation, token);
                }
                catch
                {
                    return false;
                }

                return true;
            }

            public async Task<bool> DeleteInstallationByIdAsync(string installationId, CancellationToken token)
            {
                if (string.IsNullOrWhiteSpace(installationId))
                    return false;

                try
                {
                    await _hub.DeleteInstallationAsync(installationId, token);
                }
                catch
                {
                    return false;
                }

                return true;
            }

            public async Task<bool> RequestNotificationAsync(NotificationRequest notificationRequest, CancellationToken token)
            {
                if ((notificationRequest.Silent &&
                    string.IsNullOrWhiteSpace(notificationRequest?.Action)) ||
                    (!notificationRequest.Silent &&
                    (string.IsNullOrWhiteSpace(notificationRequest?.Text)) ||
                    string.IsNullOrWhiteSpace(notificationRequest?.Action)))
                    return false;

                var androidPushTemplate = notificationRequest.Silent ?
                    PushTemplates.Silent.Android :
                    PushTemplates.Generic.Android;

                var iOSPushTemplate = notificationRequest.Silent ?
                    PushTemplates.Silent.iOS :
                    PushTemplates.Generic.iOS;

                var androidPayload = PrepareNotificationPayload(
                    androidPushTemplate,
                    notificationRequest.Text,
                    notificationRequest.Action);

                var iOSPayload = PrepareNotificationPayload(
                    iOSPushTemplate,
                    notificationRequest.Text,
                    notificationRequest.Action);

                try
                {
                    if (notificationRequest.Tags.Length == 0)
                    {
                        // This will broadcast to all users registered in the notification hub
                        await SendPlatformNotificationsAsync(androidPayload, iOSPayload, token);
                    }
                    else if (notificationRequest.Tags.Length <= 20)
                    {
                        await SendPlatformNotificationsAsync(androidPayload, iOSPayload, notificationRequest.Tags, token);
                    }
                    else
                    {
                        var notificationTasks = notificationRequest.Tags
                            .Select((value, index) => (value, index))
                            .GroupBy(g => g.index / 20, i => i.value)
                            .Select(tags => SendPlatformNotificationsAsync(androidPayload, iOSPayload, tags, token));

                        await Task.WhenAll(notificationTasks);
                    }

                    return true;
                }
                catch (Exception e)
                {
                    _logger.LogError(e, "Unexpected error sending notification");
                    return false;
                }
            }

            string PrepareNotificationPayload(string template, string text, string action) => template
                .Replace("$(alertMessage)", text, StringComparison.InvariantCulture)
                .Replace("$(alertAction)", action, StringComparison.InvariantCulture);

            Task SendPlatformNotificationsAsync(string androidPayload, string iOSPayload, CancellationToken token)
            {
                var sendTasks = new Task[]
                {
                    _hub.SendFcmNativeNotificationAsync(androidPayload, token),
                    _hub.SendAppleNativeNotificationAsync(iOSPayload, token)
                };

                return Task.WhenAll(sendTasks);
            }

            Task SendPlatformNotificationsAsync(string androidPayload, string iOSPayload, IEnumerable<string> tags, CancellationToken token)
            {
                var sendTasks = new Task[]
                {
                    _hub.SendFcmNativeNotificationAsync(androidPayload, tags, token),
                    _hub.SendAppleNativeNotificationAsync(iOSPayload, tags, token)
                };

                return Task.WhenAll(sendTasks);
            }
        }
    }
    ```

    > [!NOTE]
    > The tag expression provided to **SendTemplateNotificationAsync** is limited to 20 tags. It is limited to 6 for most operators but the expression contains only ORs (||) in this case. If there are more than 20 tags in the request then they must be split into multiple requests. See the [Routing and Tag Expressions](/previous-versions/azure/azure-services/dn530749(v=azure.100)?f=255&MSPPError=-2147217396) documentation for more detail.

1. In **Startup.cs**, update the **ConfigureServices** method to add the **NotificationHubsService** as a singleton implementation of **INotificationService**.

    ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        ...

        services.AddSingleton<INotificationService, NotificationHubService>();

        services.AddOptions<NotificationHubOptions>()
            .Configure(Configuration.GetSection("NotificationHub").Bind)
            .ValidateDataAnnotations();
    }
    ```

### Create the Notifications API

1. **Control** + **Click** on the **Controllers** folder, then choose **New File...** from the **Add** menu.

1. Select **ASP.NET Core** > **Web API Controller Class**, enter *NotificationsController* for the **Name**, then click **New**.

1. Add the following namespaces to the top of the file.

    ```csharp
    using System.ComponentModel.DataAnnotations;
    using System.Net;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using PushDemoApi.Models;
    using PushDemoApi.Services;
    ```

1. Update the templated controller so it derives from **ControllerBase** and is decorated with the **ApiController** attribute.

    ```cs
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        // Templated methods here
    }
    ```

    > [!NOTE]
    > The **Controller** base class provides support support for views but this is not needed in this case and so **ControllerBase** can be used instead.

1. If you chose to complete the [Authenticate clients using an API Key](#authenticate-clients-using-an-api-key-optional) section, you should decorate the **NotificationsController** with the **Authorize** attribute as well.

    ```cs
    [Authorize]
    ```

1. Update the constructor to accept the registered instance of **INotificationService** as an argument and assign it to a readonly member.

    ```cs
    readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }
    ```

1. In **launchSettings.json** (within the **Properties** folder), change the **launchUrl** from `weatherforecast` to *api/notifications* to match the URL specified in the **RegistrationsController** **Route** attribute.

1. Start debugging (**Command** + **Enter**) to validate the app is working with the new **NotificationsController** and returns a **401 Unauthorized** status.

    > [!NOTE]
    > Visual Studio may not automatically launch the app in the browser. You will use [Postman](https://www.postman.com/downloads) to test the API from this point on.

1. On a new **[Postman](https://www.postman.com/downloads)** tab, set the request to **GET** and enter the address below.

    ```bash
    https://localhost:5001/api/notifications
    ```

    > [!NOTE]
    > The localhost address should match the **applicationUrl** value found in **Properties** > **launchSettings.json**. The default should be `https://localhost:5001;http://localhost:5000` however this is something to verify if you receive a 404 response.

1. If you chose to complete the [Authenticate clients using an API Key](#authenticate-clients-using-an-api-key-optional) section, be sure to configure the request headers  to include your **apikey** value.

   | Key                            | Value                          |
   | ------------------------------ | ------------------------------ |
   | apikey                         | <your_api_key>                 |

1. Click the **Send** button.

    > [!NOTE]
    > You should receive a **200 OK** status with some **JSON** content.
    >
    > If you receive an **SSL certificate verification** warning, you can switch the request SSL certificate verification **[Postman](https://www.postman.com/downloads)** setting off in the **Settings**.

1. Replace the templated class methods with the following code.

    ```csharp
    [HttpPut]
    [Route("installations")]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    [ProducesResponseType((int)HttpStatusCode.UnprocessableEntity)]
    public async Task<IActionResult> UpdateInstallation(
        [Required]DeviceInstallation deviceInstallation)
    {
        var success = await _notificationService
            .CreateOrUpdateInstallationAsync(deviceInstallation, HttpContext.RequestAborted);

        if (!success)
            return new UnprocessableEntityResult();

        return new OkResult();
    }

    [HttpDelete()]
    [Route("installations/{installationId}")]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    [ProducesResponseType((int)HttpStatusCode.UnprocessableEntity)]
    public async Task<ActionResult> DeleteInstallation(
        [Required][FromRoute]string installationId)
    {
        var success = await _notificationService
            .DeleteInstallationByIdAsync(installationId, CancellationToken.None);

        if (!success)
            return new UnprocessableEntityResult();

        return new OkResult();
    }

    [HttpPost]
    [Route("requests")]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    [ProducesResponseType((int)HttpStatusCode.UnprocessableEntity)]
    public async Task<IActionResult> RequestPush(
        [Required]NotificationRequest notificationRequest)
    {
        if ((notificationRequest.Silent &&
            string.IsNullOrWhiteSpace(notificationRequest?.Action)) ||
            (!notificationRequest.Silent &&
            string.IsNullOrWhiteSpace(notificationRequest?.Text)))
            return new BadRequestResult();

        var success = await _notificationService
            .RequestNotificationAsync(notificationRequest, HttpContext.RequestAborted);

        if (!success)
            return new UnprocessableEntityResult();

        return new OkResult();
    }
    ```

### Create the API App

You now create an [API App](https://azure.microsoft.com/services/app-service/api/) in [Azure App Service](../articles/app-service/index.yml) for hosting the backend service.  

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Click **Create a resource**, then search for and choose **API App**, then click **Create**.

1. Update the following fields, then click **Create**.

    **App name:**  
    Enter a globally unique name for the **API App**

    **Subscription:**  
    Choose the same target **Subscription** you created the notification hub in.

    **Resource Group:**  
    Choose the same **Resource Group** you created the notification hub in.

    **App Service Plan/Location:**  
    Create a new **App Service Plan**  

    > [!NOTE]
    > Change from the default option to a plan that includes **SSL** support. Otherwise, you will need to take the appropriate steps when working with the mobile app to prevent **http** requests from getting blocked.

    **Application Insights:**  
    Keep the suggested option (a new resource will be created using that name) or pick an existing resource.

1. Once the **API App** has been provisioned, navigate to that resource.

1. Make note of the **URL** property in the **Essentials** summary at the top of the **Overview**. This URL is your *backend endpoint* that will be used later in this tutorial.

    > [!NOTE]
    > The URL uses the API app name that you specified earlier, with the format `https://<app_name>.azurewebsites.net`.

1. Select **Configuration** from the list (under **Settings**).  

1. For each of the settings below, click **New application setting** to enter the **Name** and a **Value**, then click **OK**.

   | Name                               | Value                          |
   | ---------------------------------- | ------------------------------ |
   | `Authentication:ApiKey`            | <api_key_value>                |
   | `NotificationHub:Name`             | <hub_name_value>               |
   | `NotificationHub:ConnectionString` | <hub_connection_string_value>  |

   > [!NOTE]
   > These are the same settings you defined previously in the user settings. You should be able to copy these over. The **Authentication:ApiKey** setting is required only if you chose to to complete the [Authenticate clients using an API Key](#authenticate-clients-using-an-api-key-optional) section. For production scenarios, you can look at options such as [Azure KeyVault](https://azure.microsoft.com/services/key-vault). These have been added as application settings for simplicity in this case.

1. Once all application settings have been added click **Save**, then **Continue**.

### Publish the backend service

Next, you deploy the app to the API App to make it accessible from all devices.  

1. Change your configuration from **Debug** to **Release** if you haven't already done so.

1. **Control** + **Click** the **PushDemoApi** project, and then choose **Publish to Azure...** from the **Publish** menu.

1. Follow the auth flow if prompted to do so. Use the account that you used in the previous [create the API App](#create-the-api-app) section.

1. Select the **Azure App Service API App** you created previously from the list as your publish target, and then click **Publish**.

After you've completed the wizard, it publishes the app to Azure and then opens the app. Make a note of the **URL** if you haven't done so already. This URL is your *backend endpoint* that is used later in this tutorial.

### Validating the published API

1. In **[Postman](https://www.postman.com/downloads)** open a new tab, set the request to **POST** and enter the address below. Replace the placeholder with the base address you made note of in the previous [publish the backend service](#publish-the-backend-service) section.

    ```csharp
    https://<app_name>.azurewebsites.net/api/notifications/installations
    ```

    > [!NOTE]
    > The base address should be in the format ``https://<app_name>.azurewebsites.net/``

1. If you chose to complete the [Authenticate clients using an API Key](#authenticate-clients-using-an-api-key-optional) section, be sure to configure the request headers to include your **apikey** value.

   | Key                            | Value                          |
   | ------------------------------ | ------------------------------ |
   | apikey                         | <your_api_key>                 |

1. Choose the **raw** option for the **Body**, then choose **JSON** from the list of format options, and then include some placeholder **JSON** content:

    ```json
    {}
    ```

1. Click **Send**.

    > [!NOTE]
    > You should receive a **400 Bad Request** status from the service.

1. Do steps 1-4 again but this time specifying the requests endpoint to validate you receive the same **400 Bad Request** response.

    ```bash
    https://<app_name>.azurewebsites.net/api/notifications/requests
    ```

> [!NOTE]
> It is not yet possible to test the API using valid request data since this will require platform-specific information from the client mobile app.