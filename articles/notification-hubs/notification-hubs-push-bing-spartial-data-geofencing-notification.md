<properties
	pageTitle="Geo-fenced push notifications with Azure Notification Hubs and Bing Spatial Data | Microsoft Azure"
	description="In this tutorial, you will learn how to deliver location-based push notifications with Azure Notification Hubs and Bing Spatial Data."
	services="notification-hubs"
	documentationCenter="windows"
    keywords="push notification,push notification"
	authors="dend"
	manager="yuaxu"
	editor="dend"/>

<tags
	ms.service="notification-hubs"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-windows-phone"
	ms.devlang="dotnet"
	ms.topic="hero-article"
	ms.date="05/31/2016"
	ms.author="dendeli"/>
    
# Geo-fenced push notifications with Azure Notification Hubs and Bing Spatial Data
 
 > [AZURE.NOTE] To complete this tutorial, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02).

In this tutorial, you will learn how to deliver location-based push notifications with Azure Notification Hubs and Bing Spatial Data, leveraged from within a Universal Windows Platform application.

##Prerequisites
First and foremost, you need to make sure that you have all the software and service pre-requisites:

* [Visual Studio 2015 Update 1](https://www.visualstudio.com/en-us/downloads/download-visual-studio-vs.aspx) or later ([Community Edition](https://go.microsoft.com/fwlink/?LinkId=691978&clcid=0x409) will do as well). 
* Latest version of the [Azure SDK](https://azure.microsoft.com/downloads/). 
* [Bing Maps Dev Center account](https://www.bingmapsportal.com/) (you can create one for free and associate it with your Microsoft account). 

##Getting Started

Let’s start by creating the project. In Visual Studio, start a new project of type **Blank App (Universal Windows)**.

![](./media/notification-hubs-geofence/notification-hubs-create-blank-app.png)

Once the project creation is complete, you should have the harness for the app itself. Now let’s set up everything for the geo-fencing infrastructure. Because we are going to use Bing services for this, there is a public REST API endpoint that allows us to query specific location frames:

    http://spatial.virtualearth.net/REST/v1/data/
    
You will need to specify the following parameters to get it working:

* **Data Source ID** and **Data Source Name** – in Bing Maps API, data sources contain various bucketed metadata, such as locations and business hours of operation. You can read more about those here. 
* **Entity Name** – the entity you want to use as a reference point for the notification. 
* **Bing Maps API Key** – this is the key that you obtained earlier when you created the Bing Dev Center account.
 
Let’s do a deep-dive on the setup for each of the elements above.

##Setting up the data source

You can do it in the Bing Maps Dev Center. Simply click on **Data sources** in the top navigation bar and select **Manage Data Sources**.

![](./media/notification-hubs-geofence/bing-maps-manage-data.png)

If you have not worked with Bing Maps API before, most likely there won’t be any data sources present, so you can just create a new one by clicking on Upload data to a data source. Make sure you fill out all the required fields:

![](./media/notification-hubs-geofence/bing-maps-create-data.png)

You might be wondering – what is the data file and what should you be uploading? For the purposes of this test, we can just use the sample pipe-based that frames an area of the San Francisco waterfront:

    Bing Spatial Data Services, 1.0, TestBoundaries
    EntityID(Edm.String,primaryKey)|Name(Edm.String)|Longitude(Edm.Double)|Latitude(Edm.Double)|Boundary(Edm.Geography)
    1|SanFranciscoPier|||POLYGON ((-122.389825 37.776598,-122.389438 37.773087,-122.381885 37.771849,-122.382186 37.777022,-122.389825 37.776598))
    
The above represents this entity:

![](./media/notification-hubs-geofence/bing-maps-geofence.png)

Simply copy and paste the string above into a new file and save it as **NotificationHubsGeofence.pipe**, and upload it in the Bing Dev Center.

>[AZURE.NOTE]You might be prompted to specify a new key for the **Master Key** that is different from the **Query Key**. Simply create a new key through the dashboard and refresh the data source upload page.

Once you upload the data file, you will need to make sure that you publish the data source. 

Go to **Manage Data Sources**, just like we did above, find your data source in the list and click on **Publish** in the **Actions** column. In a bit, you should see your data source in the **Published Data Sources** tab:

![](./media/notification-hubs-geofence/bing-maps-published-data.png)

If you click **Edit**, you will be able to see at a glance what locations we introduced in it:

![](./media/notification-hubs-geofence/bing-maps-data-details.png)

At this point, the portal does not show you the boundaries for the geofence that we created – all we need is a confirmation that the location specified is in the right vicinity.

Now you have all the requirements for the data source. To get the details on the request URL for the API call, in the Bing Maps Dev Center, click **Data sources** and select **Data Source Information**.

![](./media/notification-hubs-geofence/bing-maps-data-info.png)

The **Query URL** is what we’re after here. This is the endpoint against which we can execute queries to check whether the device is currently within the boundaries of a location or not. To perform this check, we simply need to execute a GET call against the query URL, with the following parameters appended:

    ?spatialFilter=intersects(%27POINT%20LONGITUDE%20LATITUDE)%27)&$format=json&key=QUERY_KEY

That way you're specifying a target point that we obtain from the device and Bing Maps will automatically perform the calculations to see whether it is within the geofence. Once you execute the request through a browser (or cURL), you will get standard a JSON response:

![](./media/notification-hubs-geofence/bing-maps-json.png)

This response only happens when the point is actually within the designated boundaries. If it is not, you will get an empty **results** bucket:

![](./media/notification-hubs-geofence/bing-maps-nores.png)

##Setting up the UWP application

Now that we have the data source ready, we can start working on the UWP application that we bootstrapped earlier.

First and foremost, we must enable location services for our application. To do this, double-click on `Package.appxmanifest` file in **Solution Explorer**.

![](./media/notification-hubs-geofence/vs-package-manifest.png)

In the package properties tab that just opened, click on **Capabilities** and make sure that you select **Location**:

![](./media/notification-hubs-geofence/vs-package-location.png)

As the location capability is declared, create a new folder in your solution named `Core`, and add a new file within it, called `LocationHelper.cs`:

![](./media/notification-hubs-geofence/vs-location-helper.png)

The `LocationHelper` class itself is fairly basic at this point – all it does is allow us to obtain the user location through the system API:

    using System;
    using System.Threading.Tasks;
    using Windows.Devices.Geolocation;

    namespace NotificationHubs.Geofence.Core
    {
        public class LocationHelper
        {
            private static readonly uint AppDesiredAccuracyInMeters = 10;

            public async static Task<Geoposition> GetCurrentLocation()
            {
                var accessStatus = await Geolocator.RequestAccessAsync();
                switch (accessStatus)
                {
                    case GeolocationAccessStatus.Allowed:
                        {
                            Geolocator geolocator = new Geolocator { DesiredAccuracyInMeters = AppDesiredAccuracyInMeters };

                            return await geolocator.GetGeopositionAsync();
                        }
                    default:
                        {
                            return null;
                        }
                }
            }

        }
    }

You can read more about getting the user’s location in UWP apps in the official [MSDN document](https://msdn.microsoft.com/library/windows/apps/mt219698.aspx).

To check that the location acquisition is actually working, open the code side of your main page (`MainPage.xaml.cs`). Create a new event handler for the `Loaded` event in the `MainPage` constructor:

    public MainPage()
    {
        this.InitializeComponent();
        this.Loaded += MainPage_Loaded;
    }

The implementation of the event handler is as follows:

    private async void MainPage_Loaded(object sender, RoutedEventArgs e)
    {
        var location = await LocationHelper.GetCurrentLocation();

        if (location != null)
        {
            Debug.WriteLine(string.Concat(location.Coordinate.Longitude,
                " ", location.Coordinate.Latitude));
        }
    }

Notice that we declared the handler as async because `GetCurrentLocation` is awaitable, and therefore requires to be executed in an async context. Also, because under certain circumstances we might end up with a null location (e.g. the location services are disabled or the application was denied permissions to access location), we need to make sure that it is properly handled with a null check.

Run the application. Make sure you allow location access:

![](./media/notification-hubs-geofence/notification-hubs-location-access.png)

Once the application launches, you should be able to see the coordinates in the **Output** window:

![](./media/notification-hubs-geofence/notification-hubs-location-output.png)

Now you know that location acquisition works – feel free to remove the test event handler for Loaded because we won’t be using it anymore.

The next step is to capture location changes. For that, let’s go back to the `LocationHelper` class and add the event handler for `PositionChanged`:

    geolocator.PositionChanged += Geolocator_PositionChanged;

The implementation will show the location coordinates in the **Output** window:

    private static async void Geolocator_PositionChanged(Geolocator sender, PositionChangedEventArgs args)
    {
        await CoreApplication.MainView.CoreWindow.Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
        {
            Debug.WriteLine(string.Concat(args.Position.Coordinate.Longitude, " ", args.Position.Coordinate.Latitude));
        });
    }

##Setting up the backend

Download the [.NET Backend Sample from GitHub](https://github.com/Azure/azure-notificationhubs-samples/tree/master/dotnet/NotifyUsers). Once the download completes, open the `NotifyUsers` folder, and subsequently – the `NotifyUsers.sln` file.

Set the `AppBackend` project as the **StartUp Project** and launch it.

![](./media/notification-hubs-geofence/vs-startup-project.png)

The project is already configured to send push notifications to target devices, so we’ll need to do only two things – swap out the right connection string for the notification hub and add boundary identification to send the notification only when the user is within the geofence.

To configure the connection string, in the `Models` folder open `Notifications.cs`. The `NotificationHubClient.CreateClientFromConnectionString` function should contain the information about your notification hub that you can get in the [Azure Portal](https://portal.azure.com) (look inside the **Access Policies** blade in **Settings**). Save the updated configuration file.

Now we need to create a model for the Bing Maps API result. The easiest way to do that is right-click on the `Models` folder, **Add** > **Class**. Name it `GeofenceBoundary.cs`. Once done, copy the JSON from the API response that we discussed in the first section and in Visual Studio use **Edit** > **Paste Special** > **Paste JSON as Classes**. 

That way we ensure that the object will be deserialized exactly as it was intended. Your resulting class set should resemble this:

    namespace AppBackend.Models
    {
        public class Rootobject
        {
            public D d { get; set; }
        }

        public class D
        {
            public string __copyright { get; set; }
            public Result[] results { get; set; }
        }

        public class Result
        {
            public __Metadata __metadata { get; set; }
            public string EntityID { get; set; }
            public string Name { get; set; }
            public float Longitude { get; set; }
            public float Latitude { get; set; }
            public string Boundary { get; set; }
            public string Confidence { get; set; }
            public string Locality { get; set; }
            public string AddressLine { get; set; }
            public string AdminDistrict { get; set; }
            public string CountryRegion { get; set; }
            public string PostalCode { get; set; }
        }

        public class __Metadata
        {
            public string uri { get; set; }
        }
    }

Next, open `Controllers` > `NotificationsController.cs`. We need to tweak the Post call to account for the target longitude and latitude. For that, simply add two strings to the function signature – `latitude` and `longitude`.

    public async Task<HttpResponseMessage> Post(string pns, [FromBody]string message, string to_tag, string latitude, string longitude)

Create a new class within the project called `ApiHelper.cs` – we’ll use it to connect to Bing to check point boundary intersections. Implement a `IsPointWithinBounds` function, like this:

    public class ApiHelper
    {
        public static readonly string ApiEndpoint = "{YOUR_QUERY_ENDPOINT}?spatialFilter=intersects(%27POINT%20({0}%20{1})%27)&$format=json&key={2}";
        public static readonly string ApiKey = "{YOUR_API_KEY}";

        public static bool IsPointWithinBounds(string longitude,string latitude)
        {
            var json = new WebClient().DownloadString(string.Format(ApiEndpoint, longitude, latitude, ApiKey));
            var result = JsonConvert.DeserializeObject<Rootobject>(json);
            if (result.d.results != null && result.d.results.Count() > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }

>[AZURE.NOTE] Make sure to substitute the API endpoint with the query URL that you obtained earlier from the Bing Dev Center (same applies to the API key). 

If there are results to the query, that means that the specified point is within the boundaries of the geofence, so we return `true`. If there are no results, Bing is telling us that the point is outside the lookup frame, so we return `false`.

Back in `NotificationsController.cs`, create a check right before the switch statement:

    if (ApiHelper.IsPointWithinBounds(longitude, latitude))
    {
        switch (pns.ToLower())
        {
            case "wns":
                //// Windows 8.1 / Windows Phone 8.1
                var toast = @"<toast><visual><binding template=""ToastText01""><text id=""1"">" +
                            "From " + user + ": " + message + "</text></binding></visual></toast>";
                outcome = await Notifications.Instance.Hub.SendWindowsNativeNotificationAsync(toast, userTag);

                // Windows 10 specific Action Center support
                toast = @"<toast><visual><binding template=""ToastGeneric""><text id=""1"">" +
                            "From " + user + ": " + message + "</text></binding></visual></toast>";
                outcome = await Notifications.Instance.Hub.SendWindowsNativeNotificationAsync(toast, userTag);

                break;
        }
    }

That way, the notification is only sent when the point is within the boundaries.

##Testing push notifications in the UWP app

Going back to the UWP app, we should now be able to test notifications. Within the `LocationHelper` class, create a new function – `SendLocationToBackend`:

    public static async Task SendLocationToBackend(string pns, string userTag, string message, string latitude, string longitude)
    {
        var POST_URL = "http://localhost:8741/api/notifications?pns=" +
            pns + "&to_tag=" + userTag + "&latitude=" + latitude + "&longitude=" + longitude;

        using (var httpClient = new HttpClient())
        {
            try
            {
                await httpClient.PostAsync(POST_URL, new StringContent("\"" + message + "\"",
                    System.Text.Encoding.UTF8, "application/json"));
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
            }
        }
    }

>[AZURE.NOTE] Swap the `POST_URL` to the location of your deployed web application that we created in the previous section. For now, it’s OK to run it locally, but as you work on deploying a public version, you will need to host it with an external provider.

Let’s now make sure that we register the UWP app for push notifications. In Visual Studio, click on **Project** > **Store** > **Associate app with the store**.

![](./media/notification-hubs-geofence/vs-associate-with-store.png)

Once you sign in to your developer account, make sure you select an existing app or create a new one and associate the package with it. 

Go to the Dev Center and open the app that you just created. Click **Services** > **Push Notifications** > **Live Services site**.

![](./media/notification-hubs-geofence/ms-live-services.png)

On the site, take note of the **Application Secret** and the **Package SID**. You will need both in the Azure Portal – open your notification hub, click on **Settings** > **Notification Services** > **Windows (WNS)** and enter the information in the required fields.

![](./media/notification-hubs-geofence/notification-hubs-wns.png)

Click on **Save**.

Right click on **References** in **Solution Explorer** and select **Manage NuGet Packages**. We will need to add a reference to the **Microsoft Azure Service Bus managed library** – simply search for `WindowsAzure.Messaging.Managed` and add it to your project.

![](./media/notification-hubs-geofence/vs-nuget.png)

For testing purposes, we can create the `MainPage_Loaded` event handler once again, and add this code snippet to it:

    var channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();

    var hub = new NotificationHub("HUB_NAME", "HUB_LISTEN_CONNECTION_STRING");
    var result = await hub.RegisterNativeAsync(channel.Uri);

    // Displays the registration ID so you know it was successful
    if (result.RegistrationId != null)
    {
        Debug.WriteLine("Reg successful.");
    }

The above registers the app with the notification hub. You are ready to go! 

In `LocationHelper`, inside the `Geolocator_PositionChanged` handler, you can add a piece of test code that will forcefully put the location inside the geofence:

    await LocationHelper.SendLocationToBackend("wns", "TEST_USER", "TEST", "37.7746", "-122.3858");

Because we are not passing the real coordinates (which might not be within the boundaries at the moment) and are using predefined test values, we will see a notification show up on update:

![](./media/notification-hubs-geofence/notification-hubs-test-notification.png)

##What’s next?

There are a couple of steps that you might need to follow in addition to the above to make sure that the solution is production-ready.

First and foremost, you might need to ensure that geofences are dynamic. This will require some extra work with the Bing API in order to be able to upload new boundaries within the existing data source. Consult the [Bing Spatial Data Services API documentation](https://msdn.microsoft.com/library/ff701734.aspx) for more details on the subject.

Second, as you are working to ensure that the delivery is done to the right participants, you might want to target them via [tagging](notification-hubs-tags-segment-push-message.md).

The solution shown above describes a scenario in which you might have a wide variety of target platforms, so we did not limit the geofencing to system-specific capabilities. That said, the Universal Windows Platform offers capabilities to [detect geofences right out-of-the-box](https://msdn.microsoft.com/windows/uwp/maps-and-location/set-up-a-geofence).

For more details regarding Notification Hubs capabilities, check out our [documentation portal](https://azure.microsoft.com/documentation/services/notification-hubs/).
