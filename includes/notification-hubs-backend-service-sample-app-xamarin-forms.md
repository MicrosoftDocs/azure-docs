---
 author: mikeparker104
 ms.author: miparker
 ms.date: 06/02/2020
 ms.service: notification-hubs
 ms.topic: include
---

### Create the Xamarin.Forms solution

1. In **Visual Studio**, create a new **Xamarin.Forms** solution using **Blank Forms App** as the template and entering *PushDemo* for the **Project Name**.

    > [!NOTE]
    > In the **Configure your Blank Forms App** dialog, ensure the **Organization Identifier** matches the value you used previously and that both **Android** and **iOS** targets are checked.

1. **Control** + **Click** on the *PushDemo* solution, then choose **Update NuGet Packages**.
1. **Control** + **Click** on the *PushDemo* solution, then choose **Manage NuGet Packages..**.
1. Search for **Newtonsoft.Json** and ensure it's checked.
1. Click **Add Packages**, then click **Accept** when prompted to accept the license terms.
1. Build and run the app on each target platform (**Command** + **Enter**) to test the templated app runs on your device(s).

### Implement the cross-platform components

1. **Control** + **Click** on the **PushDemo** project, choose **New Folder** from the **Add** menu, then click **Add** using *Models* as the **Folder Name**.

1. **Control** + **Click** on the **Models** folder, then choose **New File...** from the **Add** menu.

1. Select **General** > **Empty Class**, enter *DeviceInstallation.cs*, then add the following implementation.

    ```csharp
    using System.Collections.Generic;
    using Newtonsoft.Json;

    namespace PushDemo.Models
    {
        public class DeviceInstallation
        {
            [JsonProperty("installationId")]
            public string InstallationId { get; set; }

            [JsonProperty("platform")]
            public string Platform { get; set; }

            [JsonProperty("pushChannel")]
            public string PushChannel { get; set; }

            [JsonProperty("tags")]
            public List<string> Tags { get; set; } = new List<string>();
        }
    }
    ```

1. Add an **Empty Enumeration** to the **Models** folder called *PushDemoAction.cs* with the following implementation.

    ```csharp
    namespace PushDemo.Models
    {
        public enum PushDemoAction
        {
            ActionA,
            ActionB
        }
    }
    ```

1. Add a new folder to the **PushDemo** project called *Services* then add an **Empty Class** to that folder called *ServiceContainer.cs* with the following implementation.

     ```csharp
    using System;
    using System.Collections.Generic;

    namespace PushDemo.Services
    {
        public static class ServiceContainer
        {
            static readonly Dictionary<Type, Lazy<object>> services
                = new Dictionary<Type, Lazy<object>>();

            public static void Register<T>(Func<T> function)
                => services[typeof(T)] = new Lazy<object>(() => function());

            public static T Resolve<T>()
                => (T)Resolve(typeof(T));

            public static object Resolve(Type type)
            {
                {
                    if (services.TryGetValue(type, out var service))
                        return service.Value;

                    throw new KeyNotFoundException($"Service not found for type '{type}'");
                }
            }
        }
    }
    ```

    > [!NOTE]
    > This is a trimmed-down version of the [ServiceContainer](https://github.com/xamcat/mobcat-library/blob/master/MobCAT/ServiceContainer.cs) class from the [XamCAT](https://github.com/xamcat/mobcat-library) repository. It will be used as a light-weight IoC (Inversion of Control) container.

1. Add an **Empty Interface** to the **Services** folder called *IDeviceInstallationService.cs*, then add the following code.

    ```csharp
    using PushDemo.Models;

    namespace PushDemo.Services
    {
        public interface IDeviceInstallationService
        {
            string Token { get; set; }
            bool NotificationsSupported { get; }
            string GetDeviceId();
            DeviceInstallation GetDeviceInstallation(params string[] tags);
        }
    }
    ```

    > [!NOTE]
    > This interface will be implemented and bootstrapped by each target later to provide the platform-specific functionality and **DeviceInstallation** information required by the backend service.

1. Add another **Empty Interface** to the **Services** folder called *INotificationRegistrationService.cs*, then add the following code.  

    ```csharp
    using System.Threading.Tasks;

    namespace PushDemo.Services
    {
        public interface INotificationRegistrationService
        {
            Task DeregisterDeviceAsync();
            Task RegisterDeviceAsync(params string[] tags);
            Task RefreshRegistrationAsync();
        }
    }
    ```

    > [!NOTE]
    > This will handle the interaction between the client and backend service.

1. Add another **Empty Interface** to the **Services** folder called *INotificationActionService.cs*, then add the following code.  

    ```csharp
    namespace PushDemo.Services
    {
        public interface INotificationActionService
        {
            void TriggerAction(string action);
        }
    }
    ```

    > [!NOTE]
    > This is used as a simple mechanism to centralize the handling of notification actions.

1. Add an **Empty Interface** to the **Services** folder called *IPushDemoNotificationActionService.cs* that derives from the *INotificationActionService*, with the following implementation.  

    ```csharp
    using System;
    using PushDemo.Models;

    namespace PushDemo.Services
    {
        public interface IPushDemoNotificationActionService : INotificationActionService
        {
            event EventHandler<PushDemoAction> ActionTriggered;
        }
    }
    ```

    > [!NOTE]
    > This type is specific to the **PushDemo** application and uses the **PushDemoAction** enumeration to identify the action that is being triggered in a strongly-typed manner.

1. Add an **Empty Class** to the **Services** folder called *NotificationRegistrationService.cs* implementing the *INotificationRegistrationService* with the following code.

    ```csharp
    using System;
    using System.Net.Http;
    using System.Text;
    using System.Threading.Tasks;
    using Newtonsoft.Json;
    using PushDemo.Models;
    using Xamarin.Essentials;

    namespace PushDemo.Services
    {
        public class NotificationRegistrationService : INotificationRegistrationService
        {
            const string RequestUrl = "api/notifications/installations";
            const string CachedDeviceTokenKey = "cached_device_token";
            const string CachedTagsKey = "cached_tags";

            string _baseApiUrl;
            HttpClient _client;
            IDeviceInstallationService _deviceInstallationService;

            public NotificationRegistrationService(string baseApiUri, string apiKey)
            {
                _client = new HttpClient();
                _client.DefaultRequestHeaders.Add("Accept", "application/json");
                _client.DefaultRequestHeaders.Add("apikey", apiKey);

                _baseApiUrl = baseApiUri;
            }

            IDeviceInstallationService DeviceInstallationService
                => _deviceInstallationService ??
                    (_deviceInstallationService = ServiceContainer.Resolve<IDeviceInstallationService>());

            public async Task DeregisterDeviceAsync()
            {
                var cachedToken = await SecureStorage.GetAsync(CachedDeviceTokenKey)
                    .ConfigureAwait(false);

                if (cachedToken == null)
                    return;

                var deviceId = DeviceInstallationService?.GetDeviceId();

                if (string.IsNullOrWhiteSpace(deviceId))
                    throw new Exception("Unable to resolve an ID for the device.");

                await SendAsync(HttpMethod.Delete, $"{RequestUrl}/{deviceId}")
                    .ConfigureAwait(false);

                SecureStorage.Remove(CachedDeviceTokenKey);
                SecureStorage.Remove(CachedTagsKey);
            }

            public async Task RegisterDeviceAsync(params string[] tags)
            {
                var deviceInstallation = DeviceInstallationService?.GetDeviceInstallation(tags);

                await SendAsync<DeviceInstallation>(HttpMethod.Put, RequestUrl, deviceInstallation)
                    .ConfigureAwait(false);

                await SecureStorage.SetAsync(CachedDeviceTokenKey, deviceInstallation.PushChannel)
                    .ConfigureAwait(false);

                await SecureStorage.SetAsync(CachedTagsKey, JsonConvert.SerializeObject(tags));
            }

            public async Task RefreshRegistrationAsync()
            {
                var cachedToken = await SecureStorage.GetAsync(CachedDeviceTokenKey)
                    .ConfigureAwait(false);

                var serializedTags = await SecureStorage.GetAsync(CachedTagsKey)
                    .ConfigureAwait(false);

                if (string.IsNullOrWhiteSpace(cachedToken) ||
                    string.IsNullOrWhiteSpace(serializedTags) ||
                    string.IsNullOrWhiteSpace(DeviceInstallationService.Token) ||
                    cachedToken == DeviceInstallationService.Token)
                    return;

                var tags = JsonConvert.DeserializeObject<string[]>(serializedTags);

                await RegisterDeviceAsync(tags);
            }

            async Task SendAsync<T>(HttpMethod requestType, string requestUri, T obj)
            {
                string serializedContent = null;

                await Task.Run(() => serializedContent = JsonConvert.SerializeObject(obj))
                    .ConfigureAwait(false);

                await SendAsync(requestType, requestUri, serializedContent);
            }

            async Task SendAsync(
                HttpMethod requestType,
                string requestUri,
                string jsonRequest = null)
            {
                var request = new HttpRequestMessage(requestType, new Uri($"{_baseApiUrl}{requestUri}"));

                if (jsonRequest != null)
                    request.Content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                var response = await _client.SendAsync(request).ConfigureAwait(false);

                response.EnsureSuccessStatusCode();
            }
        }
    }
    ```

    > [!NOTE]
    > The **apiKey** argument is only required if you chose to complete the [Authenticate clients using an API Key](#authenticate-clients-using-an-api-key-optional) section.

1. Add an **Empty Class** to the **Services** folder called *PushDemoNotificationActionService.cs* implementing the *IPushDemoNotificationActionService* with the following code.

    ```csharp
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using PushDemo.Models;

    namespace PushDemo.Services
    {
        public class PushDemoNotificationActionService : IPushDemoNotificationActionService
        {
            readonly Dictionary<string, PushDemoAction> _actionMappings = new Dictionary<string, PushDemoAction>
            {
                { "action_a", PushDemoAction.ActionA },
                { "action_b", PushDemoAction.ActionB }
            };

            public event EventHandler<PushDemoAction> ActionTriggered = delegate { };

            public void TriggerAction(string action)
            {
                if (!_actionMappings.TryGetValue(action, out var pushDemoAction))
                    return;

                List<Exception> exceptions = new List<Exception>();

                foreach (var handler in ActionTriggered?.GetInvocationList())
                {
                    try
                    {
                        handler.DynamicInvoke(this, pushDemoAction);
                    }
                    catch (Exception ex)
                    {
                        exceptions.Add(ex);
                    }
                }

                if (exceptions.Any())
                    throw new AggregateException(exceptions);
            }
        }
    }
    ```

1. Add an **Empty Class** to the **PushDemo** project called *Config.cs* with the following implementation.  

    ```csharp
    namespace PushDemo
    {
        public static partial class Config
        {
            public static string ApiKey = "API_KEY";
            public static string BackendServiceEndpoint = "BACKEND_SERVICE_ENDPOINT";
        }
    }
    ```

    > [!NOTE]
    > This is used as a simple way to keep secrets out of source control. You can replace these values as part of an automated build or override them using a local partial class. You will do this in the next step.
    >
    > The **ApiKey** field is only required if you chose to complete the [Authenticate clients using an API Key](#authenticate-clients-using-an-api-key-optional) section.

1. Add another **Empty Class** to the **PushDemo** project this time called *Config.local_secrets.cs* with the following implementation.  

    ```csharp
    namespace PushDemo
    {
        public static partial class Config
        {
            static Config()
            {
                ApiKey = "<your_api_key>";
                BackendServiceEndpoint = "<your_api_app_url>";
            }
        }
    }
    ```

    > [!NOTE]
    > Replace the placeholder values with your own. You should have made a note of these when you built the backend service. The **API App** URL should be ``https://<api_app_name>.azurewebsites.net/``. Remember to add ``*.local_secrets.*`` to your gitignore file to avoid committing this file.
    >
    > The **ApiKey** field is only required if you chose to complete the [Authenticate clients using an API Key](#authenticate-clients-using-an-api-key-optional) section.

1. Add an **Empty Class** to the **PushDemo** project called *Bootstrap.cs* with the following implementation.  

    ```csharp
    using System;
    using PushDemo.Services;

    namespace PushDemo
    {
        public static class Bootstrap
        {
            public static void Begin(Func<IDeviceInstallationService> deviceInstallationService)
            {
                ServiceContainer.Register(deviceInstallationService);

                ServiceContainer.Register<IPushDemoNotificationActionService>(()
                    => new PushDemoNotificationActionService());

                ServiceContainer.Register<INotificationRegistrationService>(()
                    => new NotificationRegistrationService(
                        Config.BackendServiceEndpoint,
                        Config.ApiKey));
            }
        }
    }
    ```

    > [!NOTE]
    > The **Begin** method will be called by each platform when the app launches passing in a platform-specific implementation of **IDeviceInstallationService**.
    >
    > The **NotificationRegistrationService** **apiKey** constructor argument is only required if you chose to complete the [Authenticate clients using an API Key](#authenticate-clients-using-an-api-key-optional) section.

### Implement the cross-platform UI

1. In the **PushDemo** project, open **MainPage.xaml** and replace the **StackLayout** control with the following.

    ```xml
    <StackLayout VerticalOptions="EndAndExpand"  
                 HorizontalOptions="FillAndExpand"
                 Padding="20,40">
        <Button x:Name="RegisterButton"
                Text="Register"
                Clicked="RegisterButtonClicked" />
        <Button x:Name="DeregisterButton"
                Text="Deregister"
                Clicked="DeregisterButtonClicked" />
    </StackLayout>
    ```

1. Now in **MainPage.xaml.cs**, add a **readonly** backing field to store a reference to the **INotificationRegistrationService** implementation.

    ```csharp
    readonly INotificationRegistrationService _notificationRegistrationService;
    ```

1. In the **MainPage** constructor, resolve the **INotificationRegistrationService** implementation using the **ServiceContainer** and assign it to the *_notificationRegistrationService_* backing field.

    ```csharp
    public MainPage()
    {
        InitializeComponent();

        _notificationRegistrationService =
            ServiceContainer.Resolve<INotificationRegistrationService>();
    }
    ```

1. Implement the event handlers for the **RegisterButton** and **DeregisterButton** buttons **Clicked** events calling the corresponding **Register**/**Deregister** methods.

    ```csharp
    void RegisterButtonClicked(object sender, EventArgs e)
        => _notificationRegistrationService.RegisterDeviceAsync().ContinueWith((task)
            => { ShowAlert(task.IsFaulted ?
                    task.Exception.Message :
                    $"Device registered"); });

    void DeregisterButtonClicked(object sender, EventArgs e)
        => _notificationRegistrationService.DeregisterDeviceAsync().ContinueWith((task)
            => { ShowAlert(task.IsFaulted ?
                    task.Exception.Message :
                    $"Device deregistered"); });

    void ShowAlert(string message)
        => MainThread.BeginInvokeOnMainThread(()
            => DisplayAlert("PushDemo", message, "OK").ContinueWith((task)
                => { if (task.IsFaulted) throw task.Exception; }));
    ```

1. Now in **App.xaml.cs**, ensure the following namespaces are referenced.

    ```csharp
    using PushDemo.Models;
    using PushDemo.Services;
    using Xamarin.Essentials;
    using Xamarin.Forms;
    ```

1. Implement the event handler for the **IPushDemoNotificationActionService** **ActionTriggered** event.

    ```csharp
    void NotificationActionTriggered(object sender, PushDemoAction e)
        => ShowActionAlert(e);

    void ShowActionAlert(PushDemoAction action)
        => MainThread.BeginInvokeOnMainThread(()
            => MainPage?.DisplayAlert("PushDemo", $"{action} action received", "OK")
                .ContinueWith((task) => { if (task.IsFaulted) throw task.Exception; }));
    ```

1. In the **App** constructor, resolve the **IPushNotificationActionService** implementation using the **ServiceContainer** and subscribe to the **IPushDemoNotificationActionService** **ActionTriggered** event.

    ```csharp
    public App()
    {
        InitializeComponent();

        ServiceContainer.Resolve<IPushDemoNotificationActionService>()
            .ActionTriggered += NotificationActionTriggered;

        MainPage = new MainPage();
    }
    ```

    > [!NOTE]
    > This is simply to demonstrate the receipt and propagation of push notification actions. Typically, these would be handled silently for example navigating to a specific view or refreshing some data rather than displaying an alert via the root **Page**, **MainPage** in this case.
