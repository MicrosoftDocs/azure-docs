#How to Build a Smooth Streaming Windows Store Application

The Smooth Streaming Client SDK for Windows 8 enables developers to build Windows Store applications that can play on-demand and live Smooth Streaming content from [IIS Media Services](http://www.iis.net/media) or [Windows Azure Media Services](http://www.windowsazure.com/en-us/develop/net/how-to-guides/media-services/). In addition to the basic playback of Smooth Streaming content, the SDK also provides rich features like Microsoft PlayReady protection, quality level restriction, Live DVR, audio stream switching, listening for status updates (such as quality level changes) and error events, and so on. For more information of the supported features, see the [release notes](http://www.iis.net/learn/media/smooth-streaming/smooth-streaming-client-sdk-beta-2-for-windows-store-apps-release-notes).

This tutorial covers the APIs. For player development, Microsoft <strong>strongly</strong> recommends using [Player Framework for Windows 8](http://playerframework.codeplex.com/). Player framework makes it easier to build applications and provides many additional features. 

This tutorial contains two lessons. In the first lesson, you will create a C# Windows Store application with a XML MediaElement control to playback Smooth Stream content. In the second lesson, you will add a slider to control the progress of the media.

For creating a player in HTML5 and the reference documentation that describes the Smooth Streaming Client SDK for Windows 8 APIs, see [Microsoft Smooth Streaming Client for Windows 8](http://msdn.microsoft.com/en-us/library/jj573703(v=vs.90).aspx).

#Prerequisites
- Windows 8 32-bit or 64-bit. You can get [Windows 8 Enterprise Evaluation](http://msdn.microsoft.com/en-us/evalcenter/jj554510.aspx) from MSDN.
- Visual Studio 2012 or Visual Studio Express 2012 for Windows 8 installed on Windows 8. You can get the trial version from [here](http://www.microsoft.com/visualstudio/11/en-us/downloads).
- [Microsoft Smooth Streaming Client SDK for Windows 8](http://visualstudiogallery.msdn.microsoft.com/04423d13-3b3e-4741-a01c-1ae29e84fea6?SRC=Homehttp://visualstudiogallery.msdn.microsoft.com/04423d13-3b3e-4741-a01c-1ae29e84fea6?SRC=Home).

#Lesson 1: Create a Basic Smooth Streaming Store Application
In this lesson, you will create a Windows Store application with a MediaElement control to play Smooth Stream content.  The running application looks like:

![Smooth Streaming Windows Store application example][PlayerApplication]
 
For more information on developing Windows Store application, see [Develop Great Apps for Windows 8](http://msdn.microsoft.com/en-us/windows/apps/br229512.aspx). 
This lesson contains the following procedures:

1.	Create a Windows Store project
2.	Design the user interface (XAML)
3.	Modify the code behind file
4.	Compile and test the application

**To create a Windows Store project**

1.	Run Visual Studio 2012
2.	From the **FILE** menu, click **New**, and then click **Project**.
3.	From the New Project dialog, type or select  the following values:

	<table border="1">
	<tr>
		<th>Name</th>
		<th>Value</th>
	</tr>
	<tr>
		<td>Template group</td>
		<td>Installed/Templates/Visual C#/Windows Store</td>
	</tr>
	<tr>
		<td>Template</td>
		<td>Blank App (XAML)</td>
	</tr>
	<tr>
		<td>Name</td>
		<td>SSPlayer</td>
	</tr>
	<tr>
		<td>Location</td>
		<td>C:\SSTutorials</td>
	</tr>
	<tr>
		<td>Solution Name</td>
		<td>SSPlayer</td>
	</tr>
	<tr>
		<td>Create directory for solution</td>
		<td>(selected)</td>
	</tr>
	<tr>
		<td></td>
		<td></td>
	</tr>
	
	</table>

4.	Click **OK**.

**To add a reference to the Smooth Streaming Client SDK**

1.	From Solution Explorer, right-click **SSPlayer**, and then click **Add Reference**.
2.	Type or select the following values:

	<table border="1">
	<tr>
		<th>Name</th>
		<th>Value</th>
	</tr>
	<tr>
		<td>Reference group</td>
		<td>Windows/Extensions</td>
	</tr>
	<tr>
		<td>Reference</td>
		<td>Select Microsoft Smooth Streaming Client SDK for Windows 8 and Microsoft Visual C++ Runtime Package 
		</td>
	</tr>
	</table>
	
3.	Click **OK**.

**To design the player user interface**

1.	From Solution Explorer, double click **MainPage.xaml** to open it in the design view.
2.	Locate the **&lt;Grid&gt;** and **&lt;/Grid&gt;**  tags the XAML file, and paste the following code between the two tags:

	<pre><code>&lt;Grid.RowDefinitions&gt;
	    &lt;RowDefinition Height="20"/&gt;
	    &lt;RowDefinition Height="50"/&gt;
	    &lt;RowDefinition Height="100*"/&gt;
	    &lt;RowDefinition Height="50"/&gt;
	&lt;/Grid.RowDefinitions&gt;
	&lt;StackPanel Orientation="Horizontal" Grid.Row="1"&gt;
	    &lt;TextBlock x:Name="tbSource" Text="Source :  " 
	               FontSize="18" FontWeight="Bold" 
	               VerticalAlignment="Center" HorizontalAlignment="Center" /&gt;
	    &lt;TextBox x:Name="txtMediaSource" Text="http://ecn.channel9.msdn.com/o9/content/smf/smoothcontent/elephantsdream/Elephants_Dream_1024-h264-st-aac.ism/manifest"
	             FontSize="10" Width="700" Margin="0,4,0,10" /&gt;
	    &lt;Button x:Name="btnSetSource" Content="Set Source" 
	            Click="btnSetSource_Click" 
	            HorizontalAlignment="Left" VerticalAlignment="Top" 
	            Width="111" Height="43" /&gt;
	    &lt;Button x:Name="btnPlay" Content="Play"  
	            Click="btnPlay_Click" 
	            HorizontalAlignment="Left"  VerticalAlignment="Top" 
	            Width="111" Height="43" /&gt;
	    &lt;Button x:Name="btnPause" Content="Pause" 
	            Click="btnPause_Click" 
	            HorizontalAlignment="Left" VerticalAlignment="Top" 
	            Width="111" Height="43"/&gt;
	    &lt;Button x:Name="btnStop" Content="Stop" 
	            Click="btnStop_Click" 
	            HorizontalAlignment="Left"  VerticalAlignment="Top" Width="111" Height="43" /&gt;
	            &lt;CheckBox x:Name="chkAutoPlay" Content="Auto Play" 
	              IsChecked="{Binding AutoPlay, ElementName=mediaElement, Mode=TwoWay}" 
	              HorizontalAlignment="Left"  VerticalAlignment="Top" Height="55" Width="Auto"/&gt;
	    &lt;CheckBox x:Name="chkMute" Content="Mute" 
	              IsChecked="{Binding IsMuted, ElementName=mediaElement, Mode=TwoWay}" 
	              HorizontalAlignment="Left"  VerticalAlignment="Top" Height="55" Width="67"/&gt;
	&lt;/StackPanel&gt;
	&lt;StackPanel HorizontalAlignment="Center" VerticalAlignment="Center" Grid.Row="2" Height="435" Margin="147,132,147,131" Width="1072"&gt;
	    &lt;MediaElement x:Name="mediaElement"  
	                  HorizontalAlignment="Center" MinHeight="225" VerticalAlignment="Center" Width="924" AudioCategory="BackgroundCapableMedia" Height="356"/&gt;
	    &lt;StackPanel Orientation="Horizontal"&gt;
	        &lt;Slider x:Name="sliderProgress" 
	                PointerPressed="sliderProgress_PointerPressed" 
	                HorizontalAlignment="Center" VerticalAlignment="Center" Width="924" Height="44" /&gt;
	        &lt;Slider x:Name="sliderVolume" 
	                HorizontalAlignment="Right" VerticalAlignment="Center" Width="148" Orientation="Vertical" Height="79" Minimum="0" Maximum="1" StepFrequency="0.1" 
	                         Value="{Binding Volume, ElementName=mediaElement, Mode=TwoWay}" 
	                         ToolTipService.ToolTip="{Binding Value, RelativeSource={RelativeSource Mode=Self}}"/&gt;    
	     &lt;/StackPanel&gt;           
	&lt;/StackPanel&gt;
	&lt;StackPanel Orientation="Horizontal" Grid.Row="3"&gt;
	    &lt;TextBlock x:Name="tbStatus" Text="Status :  " 
	               FontSize="18" FontWeight="Bold" VerticalAlignment="Center" HorizontalAlignment="Center" /&gt;
	    &lt;TextBox x:Name="txtStatus" 
	             FontSize="10" Width="700" Margin="0,4,0,10" /&gt;
	&lt;/StackPanel&gt;
	</code></pre>

	The MediaElement control is used to playback media. The slider control named sliderProgress will be used in the next lesson to control the media progress.

3.	Press **CTRL+S** to save the file.

The MediaElement control does not support Smooth Streaming content out-of-box. To enable the Smooth Streaming support, you must register the Smooth Streaming byte-stream handler by file name extension and MIME type.  To register, you use the MediaExtensionManager.RegisterByteStremHandler method of the Windows.Media namespace.

In this XAML file, some event handlers are associated with the controls.  You must define those event handlers.

**To modify the code behind file**

1.	From Solution Explorer, right-click **MainPage.xaml**, and then click **View Code**.
2.	At the top of the file, add the following using statement:
	<pre><code>using Windows.Media;</code></pre>
3.	At the beginning of the **MainPage** class, add the following data member:
	<pre><code>private MediaExtensionManager extensions = new MediaExtensionManager();</code></pre>
4.	At the end of the **MainPage** constructor, add the following two lines:
	<pre><code>extensions.RegisterByteStreamHandler("Microsoft.Media.AdaptiveStreaming.SmoothByteStreamHandler", ".ism", "text/xml");
	extensions.RegisterByteStreamHandler("Microsoft.Media.AdaptiveStreaming.SmoothByteStreamHandler", ".ism", "application/vnd.ms-sstr+xml");</code></pre>
5.	At the end of the **MainPage** class, past the following code:
	<pre><code>#region UI Button Click Events
	private void btnPlay_Click(object sender, RoutedEventArgs e)
	{
	    mediaElement.Play();
	    txtStatus.Text = "MediaElement is playing ...";
	}
	
	private void btnPause_Click(object sender, RoutedEventArgs e)
	{
	    mediaElement.Pause();
	    txtStatus.Text = "MediaElement is paused";
	}
	
	private void btnSetSource_Click(object sender, RoutedEventArgs e)
	{
	    sliderProgress.Value = 0;
	    mediaElement.Source = new Uri(txtMediaSource.Text);
	
	    if (chkAutoPlay.IsChecked == true)
	    {
	        txtStatus.Text = "MediaElement is playing ...";
	    }
	    else
	    {
	        txtStatus.Text = "Click the Play button to play the media source.";
	    }
	}
	
	private void btnStop_Click(object sender, RoutedEventArgs e)
	{
	    mediaElement.Stop();
	    txtStatus.Text = "MediaElement is stopped";
	}
	
	private void sliderProgress_PointerPressed(object sender, PointerRoutedEventArgs e)
	{
	    txtStatus.Text = "Seek to position " + sliderProgress.Value;
	    mediaElement.Position = new TimeSpan(0, 0, (int)(sliderProgress.Value));
	}</code></pre>
	<pre><code>#endregion</code></pre>
	The sliderProgress_PointerPressed event handler is defined here.  There are more works to do to get it working, which will be covered in the next lesson of this tutorial.
6.	Press **CTRL+S** to save the file.

The finished the code behind file shall look like this:

![Codeview in Visual Studio of Smooth Streaming Windows Store application][CodeViewPic]

**To compile and test the application**

1.	From the **BUILD** menu, click **Configuration Manager**.
2.	Change **Active solution platform** to match your development platform.
3.	Press **F6** to compile the project. 
4.	Press **F5** to run the application.
5.	At the top of the application, you can either use the default Smooth Streaming URL or enter a different one. 
6.	Click **Set Source**. Because **Auto Play** is enabled by default, the media shall play automatically.  You can control the media using the **Play**, **Pause** and **Stop** buttons.  You can control the media volume using the vertical slider.  However the horizontal slider for controlling the media progress is not fully implemented yet. 

You have completed lesson1.  In this lesson, you use a MediaElement control to playback Smooth Streaming content.  In the next lesson, you will add a slider to control the progress of the Smooth Streaming content.

 
#Lesson 2: Add a Slider Bar to the Application
In lesson 1, you created a Windows Store application with a MediaElement XAML control to playback Smooth Streaming media content.  It comes some basic media functions like start, stop and pause.  In this lesson, you will add a slider bar control to the application.

In this tutorial, we will use a timer to update the slider position based on the current position of the MediaElement control.  The slider start and end time also need to be updated in case of live content.  This can be better handled in the adaptive source update event.

Media sources are objects that generate media data.  The source resolver takes a URL or byte stream and creates the appropriate media source for that content.  The source resolver is the standard way for the applications to create media sources. 

This lesson contains the following procedures:

1.	Register the Smooth Streaming handler 
2.	Add the adaptive source manager level event handlers
3.	Add the adaptive source level event handlers
4.	Add MediaElement event handlers
5.	Add slider bar related code
6.	Compile and test the application

**To register the Smooth Streaming byte-stream handler and pass the propertyset**

1.	From Solution Explorer, right click **MainPage.xaml**, and then click **View Code**.
2.	At the beginning of the file, add the following using statement:
	<pre><code>using Microsoft.Media.AdaptiveStreaming;</code></pre>
3.	At the beginning of the MainPage class, add the following data members:
	<pre><code>private Windows.Foundation.Collections.PropertySet propertySet = 
	    new Windows.Foundation.Collections.PropertySet();             
	private IAdaptiveSourceManager adaptiveSourceManager;
	</code></pre>
4.	Inside the **MainPage** constructor, add the following code after the **this.Initialize Components();** line:
	<pre><code>// Gets the default instance of AdaptiveSourceManager which manages Smooth 
	//Streaming media sources.
	adaptiveSourceManager = AdaptiveSourceManager.GetDefault();
	       // Sets property key value to AdaptiveSourceManager default instance.
	// {A5CE1DE8-1D00-427B-ACEF-FB9A3C93DE2D}" must be hardcoded.
	propertySet["{A5CE1DE8-1D00-427B-ACEF-FB9A3C93DE2D}"] = adaptiveSourceManager;</code></pre>
5.	Inside the **MainPage** constructor, modify the two RegisterByteStreamHandler methods to add the forth parameters:
	<pre><code>// Registers Smooth Streaming byte-stream handler for “.ism” extension and, 
	// "text/xml" and "application/vnd.ms-ss" mime-types and pass the propertyset. 
	// http://*.ism/manifest URI resources will be resolved by Byte-stream handler.
	extensions.RegisterByteStreamHandler(
	    "Microsoft.Media.AdaptiveStreaming.SmoothByteStreamHandler", 
	    ".ism", 
	    "text/xml", 
	    propertySet );
	extensions.RegisterByteStreamHandler(
	    "Microsoft.Media.AdaptiveStreaming.SmoothByteStreamHandler", 
	    ".ism", 
	    "application/vnd.ms-sstr+xml", 
	propertySet);</code></pre>
6.	Press **CTRL+S** to save the file.

**To add the adaptive source manager level event handler**

1.	From Solution Explorer, right click **MainPage.xaml**, and then click **View Code**.
2.	Inside the **MainPage** class, add the following data member:
	<pre><code>private AdaptiveSource adaptiveSource = null;</code></pre>
3.	At the end of the **MainPage** class, add the following event handler:
	<pre><code>#region Adaptive Source Manager Level Events
	private void mediaElement_AdaptiveSourceOpened(AdaptiveSource sender, AdaptiveSourceOpenedEventArgs args)
	{
	    adaptiveSource = args.AdaptiveSource;
	}
	#endregion Adaptive Source Manager Level Events</code></pre>
4.	At the end of the **MainPage** constructor, add the following line to subscribe to the adaptive source open event:
	<pre><code>adaptiveSourceManager.AdaptiveSourceOpenedEvent += 
	    new AdaptiveSourceOpenedEventHandler(mediaElement_AdaptiveSourceOpened);</code></pre>
5.	Press **CTRL+S** to save the file.

**To add adaptive source level event handlers**

1.	From Solution Explorer, right click **MainPage.xaml**, and then click **View Code**.
2.	Inside the **MainPage** class, add the following data member:
	<pre><code>private AdaptiveSourceStatusUpdatedEventArgs adaptiveSourceStatusUpdate; 
	private Manifest manifestObject;</code></pre>
3.	At the end of the **MainPage** class, add the following event handlers:
	<pre><code>#region Adaptive Source Level Events
	private void mediaElement_ManifestReady(AdaptiveSource sender, ManifestReadyEventArgs args)
	{
	    adaptiveSource = args.AdaptiveSource;
	    manifestObject = args.AdaptiveSource.Manifest;
	}
	
	private void mediaElement_AdaptiveSourceStatusUpdated(AdaptiveSource sender, AdaptiveSourceStatusUpdatedEventArgs args)
	{
	    adaptiveSourceStatusUpdate = args;
	}
	
	private void mediaElement_AdaptiveSourceFailed(AdaptiveSource sender, AdaptiveSourceFailedEventArgs args)
	{
	    txtStatus.Text = "Error: " + args.HttpResponse;
	}</code></pre>
	<pre><code>#endregion Adaptive Source Level Events</code></pre>
4.	At the end of the **mediaElement\_AdaptiveSourceOpened** method, add the following code to subscribe to the events:
	<pre><code>adaptiveSource.AdaptiveSourceStatusUpdatedEvent += 
	    mediaElement_AdaptiveSourceStatusUpdated;
	adaptiveSource.AdaptiveSourceFailedEvent += 
	    mediaElement_AdaptiveSourceFailed;</code></pre>
5.	Press **CTRL+S** to save the file.

**To add Media Element event handlers**

1.	From Solution Explorer, right click **MainPage.xaml**, and then click **View Code**.
2.	At the end of the **MainPage** class, add the following event handlers:
	<pre><code>#region Media Element Event Handlers 
	private void MediaOpened(object sender, RoutedEventArgs e)
	{
	    txtStatus.Text = "MediaElement opened";
	}
	
	private void MediaFailed(object sender, ExceptionRoutedEventArgs e)
	{
	    txtStatus.Text= "MediaElement failed: " + e.ErrorMessage;
	}
	
	private void MediaEnded(object sender, RoutedEventArgs e)
	{
	    txtStatus.Text ="MediaElement ended.";
	}</code></pre>
	<pre><code>#endregion Media Element Event Handlers</code></pre>
3.	At the end of the **MainPage** constructor, add the following code to subscript to the events:
	<pre><code>mediaElement.MediaOpened += MediaOpened;
	mediaElement.MediaEnded += MediaEnded;
	mediaElement.MediaFailed += MediaFailed;</code></pre>
4.	Press **CTRL+S** to save the file.

**To add slider bar related code**

1.	From Solution Explorer, right click **MainPage.xaml**, and then click **View Code**.
2.	At the beginning of the file, add the following using statement:
	<pre><code>using Windows.UI.Core;</code></pre>
3.	Inside the **MainPage** class, add the following data members:
	<pre><code>public static CoreDispatcher _dispatcher;
	private DispatcherTimer sliderPositionUpdateDispatcher;</code></pre>
4.	At the end of the **MainPage** constructor, add the following code:
	<pre><code>_dispatcher = Window.Current.Dispatcher;
	PointerEventHandler pointerpressedhandler = new PointerEventHandler(sliderProgress_PointerPressed);
	            sliderProgress.AddHandler(Control.PointerPressedEvent, pointerpressedhandler, true);    </code></pre>
5.	At the end of the **MainPage** class, add the following code:
	<pre><code>#region sliderMediaPlayer
	private double SliderFrequency(TimeSpan timevalue)
	{
	    long absvalue = 0;
	    double stepfrequency = -1;
	
	    if (manifestObject != null)
	    {
	        absvalue = manifestObject.Duration - (long)manifestObject.StartTime;
	    }
	    else
	    {
	        absvalue = mediaElement.NaturalDuration.TimeSpan.Ticks;
	    }
	
	    TimeSpan totalDVRDuration = new TimeSpan(absvalue);
	
	    if (totalDVRDuration.TotalMinutes >= 10 && totalDVRDuration.TotalMinutes < 30)
	    {
	       stepfrequency = 10;
	    }
	    else if (totalDVRDuration.TotalMinutes >= 30 
	             && totalDVRDuration.TotalMinutes < 60)
	    {
	        stepfrequency = 30;
	    }
	    else if (totalDVRDuration.TotalHours >= 1)
	    {
	        stepfrequency = 60;
	    }
	
	    return stepfrequency;
	}
	
	void updateSliderPositionoNTicks(object sender, object e)
	{
	    sliderProgress.Value = mediaElement.Position.TotalSeconds;
	}
	
	public void setupTimer()
	{
	    sliderPositionUpdateDispatcher = new DispatcherTimer();
	    sliderPositionUpdateDispatcher.Interval = new TimeSpan(0, 0, 0, 0, 300);
	    startTimer();
	}
	
	public void startTimer()
	{
	    sliderPositionUpdateDispatcher.Tick += updateSliderPositionoNTicks;
	    sliderPositionUpdateDispatcher.Start();
	}
	
	// Slider start and end time must be updated in case of live content
	public async void setSliderStartTime(long startTime)
	{
	    await _dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
	    {
	        TimeSpan timespan = new TimeSpan(adaptiveSourceStatusUpdate.StartTime);
	        double absvalue = (int)Math.Round(timespan.TotalSeconds, MidpointRounding.AwayFromZero);
	        sliderProgress.Minimum = absvalue;
	    });
	}
	
	// Slider start and end time must be updated in case of live content
	public async void setSliderEndTime(long startTime)
	{
	    await _dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
	    {
	        TimeSpan timespan = new TimeSpan(adaptiveSourceStatusUpdate.EndTime);
	        double absvalue = (int)Math.Round(timespan.TotalSeconds, MidpointRounding.AwayFromZero);
	        sliderProgress.Maximum = absvalue;
	    });
	}</code></pre>
	<pre><code>#endregion sliderMediaPlayer</code></pre>
6.	At the end of the **mediaElement_AdaptiveSourceStatusUpdated** method, add the following code:
	<pre><code>setSliderStartTime(args.StartTime);
	setSliderEndTime(args.EndTime);</code></pre>
7.	At the end of the **MediaOpened** method, add the following code:
	<pre><code>sliderProgress.StepFrequency = SliderFrequency(mediaElement.NaturalDuration.TimeSpan);
	sliderProgress.Width = mediaElement.Width;
	setupTimer();</code></pre>
8.	Press **CTRL+S** to save the file.

**To compile and test the application**

1. Press **F6** to compile the project. 
2.	Press **F5** to run the application.
3.	At the top of the application, you can either use the default Smooth Streaming URL or enter a different one. 
4.	Click **Set Source**. 
5.	Test the slider bar.

You have completed lesson 2.  In this lesson you added a slider to application.  We will continue to add more lessons to this tutorial to explore other functions of the Smooth Streaming Client SDK for Windows 8.

#Other Resources:
- [How to build a Smooth Streaming Windows 8 JavaScript application with advanced features](http://blogs.iis.net/cenkd/archive/2012/08/10/how-to-build-a-smooth-streaming-windows-8-javascript-application-with-advanced-features.aspx)
- [Smooth Streaming Technical Overview](http://www.iis.net/learn/media/on-demand-smooth-streaming/smooth-streaming-technical-overview)

[PlayerApplication]: ../../../DevCenter/dotNet/Media/SSClientWin8-1.png
[CodeViewPic]: ../../../DevCenter/dotNet/Media/SSClientWin8-2.png