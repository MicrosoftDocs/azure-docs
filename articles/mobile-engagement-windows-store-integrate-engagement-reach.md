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
	ms.date="04/06/2015" 
	ms.author="piyushjo" />

#Windows Universal Apps Reach SDK Integration

You must follow the integration procedure described in the [Windows Universal Engagement SDK Integration](mobile-engagement-windows-store-integrate-engagement.md) before following this guide.

##Embed the Engagement Reach SDK into your Windows Universal project

You do not have anything to add. `EngagementReach` references and resources are already in your project.

> [AZURE.TIP] You can customize images located in the `Resources` folder of your project, especially the brand icon (that default to the Engagement icon). On Universal Apps you can also move the `Resources` folder on your shared project to share its content between apps, but you will have to keep the `Resources\EngagementConfiguration.xml` file on its default location as it is platform dependent.

##Enable the Windows Notification Service

In order to use the **Windows Notification Service** (referred as WNS) in your `Package.appxmanifest` file on `Application UI` click on `All Image Assets` in the left bot box. At the right of the box in `Notifications`, change `toast capable` from `(not set)` to `Yes`.

Moreover, you need to synchronize your app to your Microsoft account and to the engagement platform. On the engagement frontend, go on your app setting in `native push` and paste your credentials. After that, right click on your project, select `store` and `Associate App with the Store...`.

##Initialize the Engagement Reach SDK

Modify the `App.xaml.cs`:

-   Add to your `using` statements :

		using Microsoft.Azure.Engagement;

-   Insert `EngagementReach.Instance.Init` just after `EngagementAgent.Instance.Init` in `OnLaunched` :

		protected override void OnLaunched(LaunchActivatedEventArgs args)
		{
		  EngagementAgent.Instance.Init(args);
		  EngagementReach.Instance.Init(args);
		}

-   If you want to launch engagement reach when your app is activated, override `OnActivated` method:

		protected override void OnActivated(IActivatedEventArgs args)
		{
		  EngagementAgent.Instance.Init(args);
		  EngagementReach.Instance.Init(args);
		}

	The `EngagementReach.Instance.Init` runs in a dedicated thread. You do not have to do it yourself.

> [AZURE.TIP] You can specify the name of the WNS push channel of your application in the `Resources\EngagementConfiguration.xml` file of your project on `<channelName></channelName>`. By default, Engagement creates a name based on the appId. You have no need to specify the name yourself, except if you plan to use the push channel outside of Engagement.

##Integration

Engagement provides two ways to implement Reach notification and announcement: the Overlay integration and the Web View integration.

windows-sdk-engagement-overlay-integration doesn't require a lot of code to write into your application. You just need to tag your pages, xaml and cs files, with EngagementPageOverlay. Moreover, if you customize the Engagement default view, your customization will be shared with all tagged pages and just defined once. But if your pages need to inherit from an object other than EngagementPageOverlay, you are stuck and forced to use Web View integration.

windows-sdk-engagement-webview-integration is more complicated to be implemented. But if your App pages need to inherit from an object other than "Page", then you have to integrate the Web View and its behavior.

> [AZURE.TIP] You should consider adding a first level `<Grid></Grid>` element to surround all page content. For Webview integration, just add Webview as child of this grid. If you need to set Engagement component elsewhere, remember that you have to manage the display size yourself.

### Overlay integration

Engagement provides an overlay for notification and announcement display.

If you want to use it, do not use windows-sdk-engagement-webview-integration.

In your .xaml file change EngagementPage reference to EngagementPageOverlay

-   Add to your namespaces declarations:

			xmlns:engagement="using:Microsoft.Azure.Engagement.Overlay"

-   Replace `engagement:EngagementPage` with `engagement:EngagementPageOverlay`:

**With EngagementPage:**

		<engagement:EngagementPage 
		    xmlns:engagement="using:Microsoft.Azure.Engagement">
		
		    <!-- layout -->
		</engagement:EngagementPage>

**With EngagementPageOverlay:**

		<engagement:EngagementPageOverlay 
		    xmlns:engagement="using:Microsoft.Azure.Engagement.Overlay">
		
		    <!-- layout -->
		</engagement:EngagementPageOverlay>

> **With EngagementPageOverlay for 8.1:**

		<engagement:EngagementPageOverlay 
		    xmlns:engagement="using:Microsoft.Azure.Engagement.Overlay">
		    <Grid>
		      <!-- layout -->
		    </Grid>
		</engagement:EngagementPageOverlay>

Then in your .cs file tag your page in "EngagementPageOverlay" instead of "EngagementPage" and import "Microsoft.Azure.Engagement.Overlay".

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

Now this page uses the engagement overlay mechanism, you don't have to insert a web view.

The Engagement overlay uses the first “Grid” element it finds in your xaml file to add two web views on your page. If you want to locate where web views will be set, you can define a grid named “EngagementGrid” like this:

			<Grid x:Name="EngagementGrid"></Grid>

You can customize the overlay notification and announcement directly on their xaml and cs files:

-   `EngagementAnnouncement.html` : The `Announcement` web view html design.
-   `EngagementOverlayAnnouncement.xaml` : The `Announcement` xaml design.
-   `EngagementOverlayAnnouncement.xaml.cs` : The `EngagementOverlayAnnouncement.xaml` linked code.
-   `EngagementNotification.html` : The `Notification` web view html design.
-   `EngagementOverlayNotification.xaml` : The `Notification` xaml design.
-   `EngagementOverlayNotification.xaml.cs` : The `EngagementOverlayNotification.xaml` linked code.
-   `EngagementPageOverlay.cs` : The `Overlay` announcement and notification display code.

### Web View integration

If you want to use it, do not use windows-sdk-engagement-overlay-integration.

To display engagement content, you need to integrate the two xaml WebView in each page and you need to display notification and announcement. So add this code in your xaml file:

			<WebView x:Name="engagement_notification_content" Visibility="Collapsed" ScriptNotify="scriptEvent" Height="64" HorizontalAlignment="Right" VerticalAlignment="Top"/>
			<WebView x:Name="engagement_announcement_content" Visibility="Collapsed" ScriptNotify="scriptEvent" HorizontalAlignment="Right" VerticalAlignment="Top"/> 

> **For 8.1 integration:**

			<engagement:EngagementPage
			    xmlns:engagement="using:Microsoft.Azure.Engagement">
			    <Grid>
			      <WebView x:Name="engagement_notification_content" Visibility="Collapsed" ScriptNotify="scriptEvent" Height="64" HorizontalAlignment="Right" VerticalAlignment="Top"/>
			      <WebView x:Name="engagement_announcement_content" Visibility="Collapsed" ScriptNotify="scriptEvent" HorizontalAlignment="Right" VerticalAlignment="Top"/> 
			      <!-- layout -->
			    </Grid>
			</engagement:EngagementPage>

And your associate .cs file have to look like:

			/// <summary>
			/// An empty page that can be used on its own or navigated to within a Frame.
			/// </summary>
			public sealed partial class ExampleEngagementReachPage : EngagementPage
			{
			  public ExampleEngagementReachPage()
			  {
			    this.InitializeComponent();
			
			   /* Set your webview elements to the correct size */
			    SetWebView(width, height);
			
			    Window.Current.SizeChanged += DisplayProperties_OrientationChanged;
			  }
			
			  #region to implement
			  /* Allow webview script to notify system */
			  private void scriptEvent(object sender, NotifyEventArgs e)
			  {
			  }
			
			  /* When page is left ensure to detach SizeChanged handler */
			  protected override void OnNavigatedFrom(NavigationEventArgs e)
			  {
			    Window.Current.SizeChanged -= DisplayProperties_OrientationChanged;
			    base.OnNavigatedFrom(e);
			  }
			
			  /* "width" is the current width of your application display */
			  double width = Window.Current.Bounds.Width;
			
			  /* "height" is the current height of your application display */
			  double height = Window.Current.Bounds.Height;
			
			  /// <summary>
			  /// Set your webview elements to the correct size
			  /// </summary>
			  /// <param name="width">The width of your current display</param>
			  /// <param name="height">The height of your current display</param>
			  private void SetWebView(double width, double height)
			  {
			    #pragma warning disable 4014
			    CoreApplication.MainView.CoreWindow.Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal,
			            () =>
			            {
			              this.engagement_notification_content.Width = width;
			              this.engagement_announcement_content.Width = width;
			              this.engagement_announcement_content.Height = height;
			            });
			  }
			
			  /// <summary>
			  /// Handler that take the Windows.Current.SizeChanged and indicate that webview have to be resized
			  /// </summary>
			  /// <param name="sender">Original event trigger</param>
			  /// <param name="e">Window Size Changed Event argument</param>
			  private void DisplayProperties_OrientationChanged(object sender, Windows.UI.Core.WindowSizeChangedEventArgs e)
			  {
			    double width = e.Size.Width;
			    double height = e.Size.Height;
			
			    /* Set your webview elements to the correct size */
			    SetWebView(width, height);
			  }
			  #endregion
			}

> This implementation embedded WebView resizing when the device screen is turned.

##Handle datapush (optional)

If you want your application to be able to receive Reach data pushes, you have to implement two events of the EngagementReach class:

In App.xaml.cs in "Public App(){}" add:

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

##Customize UI (optional)

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

##Custom scheme tip

We provide custom scheme use. You can send different type of URI from engagement frontend to be used in your engagement application. Default scheme like `http, ftp, ...` are manage by Windows, a window will prompt if they are no default application installed on device. Other scheme like application scheme can be used. Moreover, you can use a custom scheme for your application.

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
