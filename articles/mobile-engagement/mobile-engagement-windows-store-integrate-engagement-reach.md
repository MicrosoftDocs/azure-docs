<properties 
	pageTitle="Windows Universal Apps Reach SDK Integration" 
	description="How to Integrate Azure Mobile Engagement Reach with Windows Universal Apps"
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="piyushjo" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-store" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="02/29/2016" 
	ms.author="piyushjo" />

# Windows Universal Apps Reach SDK Integration

You must follow the integration procedure described in the [Windows Universal Engagement SDK Integration](mobile-engagement-windows-store-integrate-engagement.md) before following this guide.

## Embed the Engagement Reach SDK into your Windows Universal project

You do not have anything to add. `EngagementReach` references and resources are already in your project.

> [AZURE.TIP] You can customize images located in the `Resources` folder of your project, especially the brand icon (that default to the Engagement icon). On Universal Apps you can also move the `Resources` folder on your shared project to share its content between apps, but you will have to keep the `Resources\EngagementConfiguration.xml` file on its default location as it is platform dependent.

## Enable the Windows Notification Service

### Windows 8.x and Windows Phone 8.1 only

In order to use the **Windows Notification Service** (referred as WNS) in your `Package.appxmanifest` file on `Application UI` click on `All Image Assets` in the left bot box. At the right of the box in `Notifications`, change `toast capable` from `(not set)` to `(Yes)`.

### All platforms

You need to synchronize your app to your Microsoft account and to the engagement platform. For this you need to create an account or log on [windows dev center](https://dev.windows.com). After that create a new application and find the SID and secret key. On the engagement frontend, go on your app setting in `native push` and paste your credentials. After that, right click on your project, select `store` and `Associate App with the Store...`. You just need to select the application you have create before to synchronize it.

## Initialize the Engagement Reach SDK

Modify the `App.xaml.cs`:

-   Insert `EngagementReach.Instance.Init` just after `EngagementAgent.Instance.Init` in your `InitEngagement` method:

		private void InitEngagement(IActivatedEventArgs e)
		{
		  EngagementAgent.Instance.Init(e);
		  EngagementReach.Instance.Init(e);
		}

	The `EngagementReach.Instance.Init` runs in a dedicated thread. You do not have to do it yourself.

> [AZURE.NOTE] If you are using push notifications elsewhere in your application then you have to [share your push channel](#push-channel-sharing) with Engagement Reach.

## Integration

Engagement provides two ways to add the Reach in-app banners and interstitial views for announcements and polls in your application: the overlay integration and the web views manual integration. You should not combine both approach on the same page.

The choice between the two integration could be summarized this way:

-   You may choose the overlay integration if your pages already inherits from the Agent `EngagementPage`, it's just a matter of replacing `EngagementPage` by `EngagementPageOverlay` and `xmlns:engagement="using:Microsoft.Azure.Engagement"` by `xmlns:engagement="using:Microsoft.Azure.Engagement.Overlay"` in your pages.
-   You may choose the web views manual integration if you want to precisely place the Reach UI within your pages or if you don't want to add another inheritance level to your pages. 

### Overlay integration

The Engagement overlay dynamically adds the UI elements used to display Reach campaigns in your page. If the overlay doesn't suit your layout you should consider the web views manual integration instead.

In your .xaml file change `EngagementPage` reference to `EngagementPageOverlay`

-   Add to your namespaces declarations:

		xmlns:engagement="using:Microsoft.Azure.Engagement.Overlay"

-   Replace `engagement:EngagementPage` with `engagement:EngagementPageOverlay`:

**With EngagementPage:**

		<engagement:EngagementPage 
		    xmlns:engagement="using:Microsoft.Azure.Engagement">
		
		    <!-- Your layout -->
		</engagement:EngagementPage>

**With EngagementPageOverlay:**

		<engagement:EngagementPageOverlay 
		    xmlns:engagement="using:Microsoft.Azure.Engagement.Overlay">
		
		    <!-- Your layout -->
		</engagement:EngagementPageOverlay>

Then in your .cs file tag your page in `EngagementPageOverlay` instead of `EngagementPage` and import `Microsoft.Azure.Engagement.Overlay`.

			using Microsoft.Azure.Engagement.Overlay;

-   Replace `EngagementPage` with `EngagementPageOverlay`:

**With EngagementPage:**

			using Microsoft.Azure.Engagement;
			
			namespace Example
			{
			  public sealed partial class ExamplePage : EngagementPage
			  {
			    [...]
			  }
			}

**With EngagementPageOverlay:**

			using Microsoft.Azure.Engagement.Overlay;
			
			namespace Example
			{
			  public sealed partial class ExamplePage : EngagementPageOverlay 
			  {
			    [...]
			  }
			}


The Engagement overlay adds a `Grid` element on top of your page composed of your layout and the two `WebView` elements one for the banner and the other one for the interstitial view.

You can customize the overlay elements directly in the `EngagementPageOverlay.cs` file.

### Web views manual integration

Reach will be searching your pages for the two `WebView` elements responsible for displaying the banner and the interstitial view. The only thing you have to do is to add those two `WebView` elements somewhere in your pages, here is an example:

    <Grid x:Name="engagementGrid">

      <!-- Your layout -->

      <WebView x:Name="engagement_notification_content" Visibility="Collapsed" Height="80" HorizontalAlignment="Stretch" VerticalAlignment="Top"/>
      <WebView x:Name="engagement_announcement_content" Visibility="Collapsed"  HorizontalAlignment="Stretch"  VerticalAlignment="Stretch"/>
    </Grid>


In this example the `WebView` elements are stretched to fit their container which automatically re-sizes them in case of screen rotation or window size change.

> [AZURE.WARNING] It is important to keep the same naming `engagement_notification_content` and `engagement_announcement_content` for the `WebView` elements. Reach is identifying them by their name. 

## Handle datapush (optional)

If you want your application to be able to receive Reach data pushes, you have to implement two events of the EngagementReach class:

In App.xaml.cs in the App() constructor add:

			EngagementReach.Instance.DataPushStringReceived += (body) =>
			{
			  Debug.WriteLine("String data push message received: " + body);
			  return true;
			};
			
			EngagementReach.Instance.DataPushBase64Received += (decodedBody, encodedBody) =>
			{
			  Debug.WriteLine("Base64 data push message received: " + encodedBody);
			  // Do something useful with decodedBody like updating an image view
			  return true;
			};

You can see that the callback of each method returns a boolean. Engagement sends a feedback to its back-end after dispatching the data push. If the callback returns false, the `exit` feedback will be send. Otherwise, it will be `action`. If no callback is set for the events, the `drop` feedback will be returned to Engagement.

> [AZURE.WARNING] Engagement is not able to receive multiples feedbacks for a data push. If you plan to set several handlers on an event, be aware that the feedback will correspond to the last one sent. In this case, we recommend to always returns the same value to avoid having confusing feedback on the front-end.

## Customize UI (optional)

### First step

We allow you to customize the reach UI.

To do so, you have to create a subclass of the `EngagementReachHandler` class.

**Sample Code :**

			using Microsoft.Azure.Engagement;
			
			namespace Example
			{
			  internal class ExampleReachHandler : EngagementReachHandler
			  {
			   // Override EngagementReachHandler methods depending on your needs
			  }
			}

Then, set the content of the `EngagementReach.Instance.Handler` field with your custom object in your `App.xaml.cs` class within the `App()` method.

**Sample Code :**

			protected override void OnLaunched(LaunchActivatedEventArgs args)
			{
			  // your app initialization 
			  EngagementReach.Instance.Handler = new ExampleReachHandler();
			  // Engagement Agent and Reach initialization
			}

> [AZURE.NOTE] By default, Engagement uses its own implementation of `EngagementReachHandler`.
> You don't have to create your own, and if you do so, you don't have to override every method. The default behavior is to select the Engagement base object.

### Web View

By default, Reach will use the embedded resources of the DLL to display the notifications and pages.

To provide a full customization possibilities we only use web view. If you want to customize layouts, override directly the resources files `EngagementAnnouncement.html` and `EngagementNotification.html`. Engagement needs all code in `<body></body>` to run correctly. But you can add tag outer `engagement_webview_area`.

However, you can decide to use your own resources.

You can override `EngagementReachHandler` methods in your subclass to tell Engagement to use your layouts, but take care to embedded the engagement mechanism:

**Sample Code :**
			
			// In your subclass of EngagementReachHandler
			
			public override string GetAnnouncementHTML()
			{
			  return base.GetAnnouncementHTML();
			}
			public override string GetAnnouncementName()
			{
			  return base.GetAnnouncementName();
			}
			public override string GetNotfificationHTML()
			{
			  return base.GetNotfificationHTML();
			}
			public override string GetNotfificationName()
			{
			  return base.GetNotfificationName();
			}


By default, AnnouncementHTML is `ms-appx-web:///Resources/EngagementAnnouncement.html`. It represents the html file that design the content of a push message (Text announcement, Web anoucement and Poll announcement). AnnouncementName is `engagement_announcement_content`. It is the name of the webview design in your xaml page.

NotfificationHTML is `ms-appx-web:///Resources/EngagementNotification.html`. It represents the html file that design the notification of a push message. NotfificationName is `engagement_notification_content`. It is the name of the webview design in your xaml page.

### Customization

You can customize notification and announcement web view has you want if you preserve Engagement object. Take care that webview object is described three times - the first time in your xaml, second time in your .cs file in the "setwebview()" method, and third time in the html file.

-   In your xaml you describe the current graphical layout webview component.
-   In your .cs file you can define "setwebview()" in which you set the dimension of the two webview (notification, announcement). It is very effective when the application is resizing.
-   In the Engagement html file we describe the webview content, design and the elements positions between each other.

### Launch message

When a user clicks on a system notification (a toast), Engagement launches the application, load the content of the push messages, and display the page for the corresponding campaign.

There is a delay between the launch of the application and the display of the page (depending on the speed of your network).

To indicate to the user that something is loading, you should provide a visual information, like a progress bar or a progress indicator. Engagement cannot handle that itself, but provides a few handlers for you.

To implement the callback, in App.xaml.cs in "Public App(){}" add:

			/* The application has launched and the content is loading.
			 * You should display an indicator here.
			 */
			EngagementReach.Instance.RetrieveLaunchMessageStarted += () => { [...] };
			
			/* The application has finished loading the content and the page
			 * is about to be displayed.
			 * You should hide the indicator here.
			 */
			EngagementReach.Instance.RetrieveLaunchMessageCompleted += () => { [...] };
			
			/* The content has been loaded, but an error has occurred.
			 * You can provide an information to the user.
			 * You should hide the indicator here.
			 */
			EngagementReach.Instance.RetrieveLaunchMessageFailed += () => { [...] };

You can set the callback in your "Public App(){}" method of your `App.xaml.cs` file, preferably before the `EngagementReach.Instance.Init()` call.

> [AZURE.TIP] Each handler is called by the UI Thread. You do not have to worry when using a MessageBox or something UI-related.

##<a id="push-channel-sharing"></a> Push channel sharing

If you are using push notifications for another purpose in your application then you have to use the push channel sharing feature of the Engagement SDK. This is to avoid missed push.

- You can provide your own push channel to the Engagement Reach initialization. The SDK will use it instead of requesting a new one.

Update the Engagement Reach initialization with your push channel in the `InitEngagement` method from the `App.xaml.cs` file:
    
    /* Your own push channel logic... */
    var pushChannel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
    
    /*...Engagement initialization */
    EngagementAgent.Instance.Init(e);
	EngagementReach.Instance.Init(e,pushChannel);

- Alternatively, if you just want to consume the push channel after the Reach initialization then you can set a callback on Engagement Reach to get the push channel once it is created by the SDK.

Set your callback at any place **after** the Reach initialization :

    /* Set action on the SDK push channel. */
    EngagementReach.Instance.SetActionOnPushChannel((PushNotificationChannel channel) => 
    {
      /* The forwarded channel can be null if its creation fails for any reason. */
      if (channel != null)
      {
		/* Your own push channel logic... */
      });
	}

## Custom scheme tip

We provide custom scheme use. You can send different type of URI from engagement frontend to be used in your engagement application. Default scheme like `http, ftp, ...` are manage by Windows, a window will prompt if they are no default application installed on device. You can also create your own custom scheme for your application.

The simple way to set a custom scheme in your application is to open your `Package.appxmanifest` go in `Declarations` panel. Select `Protocol` in the Available Declarations scroll box and add it. Edit the `Name` field with your new protocol desired name.

Now to use this protocol, edit your `App.xaml.cs` with the `OnActivated` method, and don't forget to initialize engagement here also:

			/// <summary>
			/// Enter point when app his called by another way than user click
			/// </summary>
			/// <param name="args">Activation args</param>
			protected override void OnActivated(IActivatedEventArgs args)
			{
			  /* Init engagement like it was launch by a custom uri scheme */
			  EngagementAgent.Instance.Init(args);
			  EngagementReach.Instance.Init(args);
			
			  //TODO design action to do when app is launch
			
			  #region Custom scheme use
			  if (args.Kind == ActivationKind.Protocol)
			  {
			    ProtocolActivatedEventArgs myProtocol = (ProtocolActivatedEventArgs)args;
			
			    if (myProtocol.Uri.Scheme.Equals("protocolName"))
			    {
			      string path = myProtocol.Uri.AbsolutePath;
			    }
			  }
			  #endregion
 