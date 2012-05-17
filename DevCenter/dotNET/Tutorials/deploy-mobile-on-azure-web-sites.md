<properties umbracoNaviHide="0" pageTitle="Deploying Applications" metaKeywords="Windows Azure deployment, Azure deployment, Azure configuration changes, Azure deployment update, Windows Azure .NET deployment, Azure .NET deployment, Azure .NET configuration changes, Azure .NET deployment update, Windows Azure C# deployment, Azure C# deployment, Azure C# configuration changes, Azure C# deployment update, Windows Azure VB deployment, Azure VB deployment, Azure VB configuration changes, Azure VB deployment update" metaDescription="Learn how to deploy applications to Windows Azure, make configuration changes, and and make major and minor updates." linkid="dev-net-fundamentals-deploying-applications" urlDisplayName="Deploying Applications" headerExpose="" footerExpose="" disqusComments="1" />

# Deploy an ASP.NET MVC Mobile Web Application on Windows Azure Web Sites

This tutorial will teach you the basics of how to deploy a web application to to a Windows Azure website. For the purposes of this tutorial we will work with mobile features in an ASP.NET MVC 4 developer preview web application. To perform the steps in this tutorial, you can use Microsoft Visual Web Developer 2010 Express Service Pack 1 ("Visual Web Developer"), which is a free version of Microsoft Visual Studio. Or you can use Visual Studio 2010 SP1 if you already have that.

## You will learn:

- How the ASP.NET MVC 4 templates use the HTML5 viewport attribute and adaptive rendering to improve display on mobile devices.
- How to create mobile-specific views.
- How to create a view switcher that lets users toggle between a mobile view and a desktop view of the application.
- How to deploy the web application to Windows Azure.

For this tutorial, you'll add mobile features to the simple conference-listing application that's provided in the starter project. The following screenshot shows the main page of the completed application as seen in the Windows 7 Phone Emulator.

![MVC4 conference application main page.][AppMainPage]

## SETTING UP THE DEVELOPMENT ENVIRONMENT

Before you start, make sure you've installed the prerequisites listed below.

- [Visual Studio Web Developer Express SP1 prerequisites][VSWDExpresPrerequites]
- [ASP.NET MVC 4 Developer Preview][MVC4DeveloperPreview]

Apply the following update to Visual Studio 2010

- [Updates to web deploy][WebDeployUpdate]

You will also need a mobile browser emulator. Any of the following will work:

- [Windows 7 Phone Emulator][Win7PhoneEmulator]. (This is the emulator that's used in most of the screen shots in this tutorial.)
- [Opera Mobile Emulator][OperaMobileEmulator].
- [Apple Safari][AppleSafari] with the user agent set to iPhone. For instructions on how to set the user agent in Safari to "iPhone", see [How to let Safari pretend it's IE][HowToSafari] on David Alison's blog.
- [FireFox][FireFox] with the [FireFox User Agent Switcher][FireFoxUserAgentSwitcher].

This tutorial shows code in C#. However, the starter project and completed project will be available in Visual Basic. Visual Studio projects with Visual Basic and C# source code are available to accompany this topic:

- [Starter project download][MVC4StarterProject]
- [Completed project download][FinishedProject]

## Steps in this tutorial

- [Create a Windows Azure web site][]
- [Setup the starter Project][]
- [Override the Views, Layouts, and Partial Views][]
- [Browser-Specific Views][]
- [Use jQuery Mobile to define the mobile broswer interface][]
- [Improve the Speakers List][]
- [Create a Mobile Speakers View][]
- [Improve the Tags List][]
- [Improve the Dates List][]
- [Improve the SessionsTable View][]
- [Improve the SessionByCode View][]
- [Deploy the Applciation to the Windows Azure Web Site][]


## Getting Started

Set up the Windows Azure environment

Set up the Windows Azure environment by creating a Windows Azure account and a Windows Azure Web Site.

<a name="bkmk_createaccount"></a><h3>Create a Windows Azure account</h3>

1.	Open a web browser, and browse to http://www.windowsazure.com.
2.	To get started with a free account, click Free Trial in the upper-right corner and follow the steps.


<h3>Create a website in Windows Azure</h3>

Your Windows Azure Web Site will run in a shared hosting environment, which means it runs on virtual machines (VMs) that are shared with other Windows Azure clients. A shared hosting environment is a low-cost way to get started in the cloud. Later, if your web traffic increases, the application can scale to meet the need by running on dedicated VMs. If you need a more complex architecture, you can migrate to a Windows Azure cloud service. Cloud services run on dedicated VMs that you can configure according to your needs.

1.	In the Preview Management Portal, click **New**.

	![][CreateWebSite1]
2.	Click **Web Site**, then click **Quick Create**.

	![][CreateWebSite2]
3.	In the **Create a New Web Site**, enter a string in the **URL** box to use as the unique URL for your application.

	![][CreateWebSite3]

	The complete URL will consist of what you enter here plus the suffix that you see below the text box. The illustration shows "MyMobileMVC4WebSite", but if someone has already taken that URL you will have to choose a different one.
4. Click the check mark at the bottom of the box to indicate you're finished.

The Preview Management Portal returns to the Web Sites page and the Status column shows that the site is being created. After a while (typically less than a minute) the Status column shows that the site was successfully created. In the navigation bar at the left, the number of sites you have in your account appears in the Web Sites icon, and the number of databases appears in the SQL Databases icon.

![][CreateWebSite4]

<a name="bkmk_setupstarterproject"></a><h3>Setup the starter project.</h3>

1.	Download the conference-listing application starter project.
2. 	Then in Windows Explorer, right-click the MvcMobileStarterBeta.zip file and choose Properties.
3. 	In the MvcMobileStarterBeta.zip Properties dialog box, choose the Unblock button. (Unblocking prevents a security warning that occurs when you try to use a .zip file that you've downloaded from the web.)

	![Properties dialog box.][PropertiesPopup]
4.	Right-click the MvcMobile.zip file and select Extract All to unzip the file.
5. 	In Visual Web Developer or Visual Studio 2010, open the MvcMobile.sln file.

<h3>To run the starter project</h3>

1.	Press CTRL+F5 to run the application, which will display it in your desktop browser.
2.	Start your mobile browser emulator, copy the URL for the conference application into the emulator, and then click the Browse by tag link.
	- If you are using the Windows Phone Emulator, click in the URL bar and press the Pause key to get keyboard access. The image below shows the AllTags view (from choosing Browse by tag).

	![Browse by tag page.][BrowseByTagWithCallout]

The display is very readable on a mobile device. Choose the ASP.NET link.

![Browse sessions tagged as ASP.NET.][ASPNetPage]

The ASP.NET tag view is very cluttered. For example, the Date column is very difficult to read. Later in the tutorial you'll create a version of the AllTags view that's specifically for mobile browsers and that will make the display readable.

## <a name="bkmk_overrideviews"></a>Override the Views, Layouts, and Partial Views

In this section, you'll create a mobile-specific layout file.

A significant new feature in ASP.NET MVC 4 is a simple mechanism that lets you override any view (including layouts and partial views) for mobile browsers in general, for an individual mobile browser, or for any specific browser. To provide a mobile-specific view, you can copy a view file and add .Mobile to the file name. For example, to create a mobile Index view, copy *Views\Home\Index.cshtml* to *Views\Home\Index.Mobile.cshtml*.

To start, copy *Views\Shared\_Layout.cshtml* to* Views\Shared\_Layout.Mobile.cshtml*. Open *_Layout.Mobile.cshtml* and change the title from **MVC4 Conference** to **Conference (Mobile)**.

In each **Html.ActionLink** call, remove "Browse by" in each link ActionLink. The following code shows the completed body section of the mobile layout file.

     <body>
        <div class="page">
            <div id="header">
                <div id="logindisplay"></div>
                <div id="title">
                    <h1> Conference (Mobile)</h1>
                </div>
                <div id="menucontainer">
                    <ul id="menu">
                        <li>@Html.ActionLink("Home", "Index", "Home")</li>
                        <li>@Html.ActionLink("Date", "AllDates", "Home")</li>
                        <li>@Html.ActionLink("Speaker", "AllSpeakers", "Home")</li>
                        <li>@Html.ActionLink("Tag", "AllTags", "Home")</li>
                    </ul>
                </div>
            </div>
            <div id="main">
                @RenderBody()
            </div>
            <div id="footer">
            </div>
        </div>
    </body>

Copy the *Views\Home\AllTags.cshtml* file to *Views\Home\AllTags.Mobile.cshtml*. Open the new file and change the &lt;h2&gt; element from "Tags" to "Tags (M)":

     <h2>Tags (M)</h2>

Browse to the tags page using a desktop browser and using mobile browser emulator. The mobile browser emulator shows the two changes you made.

![Show changes to tags page][Overrideviews1]

In contrast, the desktop display has not changed.

![Show desktop tags view][Overrideviews2]

## <a name="bkmk_usejquerymobile"></a>Use jQuery Mobile to define the mobile broswer interface

In this section you'll install the jQuery.Mobile.MVC NuGet package, which installs jQuery Mobile and a view-switcher widget.

The jQuery Mobile library provides a user interface framework that works on all the major mobile browsers. jQuery Mobile applies progressive enhancement to mobile browsers that support CSS and JavaScript. Progressive enhancement allows all browsers to display the basic content of a web page, while allowing more powerful browsers and devices to have a richer display. The JavaScript and CSS files that are included with jQuery Mobile style many elements to fit mobile browsers without making any markup changes.

1. Rename *Views\Home\AllTags.Mobile.cshtml* to *Views\Home\AllTags.iPhone.cshtml.hide*. Because the files no longer have a .cshtml extension, they won't be used by the ASP.NET MVC runtime to render the AllTags view.
2. Install the jQuery.Mobile.MVC NuGet package by doing this:

	1. From the **Tools** menu, select **Package Manager** Console, and then select **Library Package Manager**.

		![Library package manager][jquery1]
	2. In the **Package Manager Console**, enter *Install-Package jQuery.Mobile.MVC*

		![Package manager console][jquery2]

		If you get the following error:

		The file C:\my_script.ps1 cannot be loaded. The execution of scripts is disabled on this system. Please see "Get-Help about_signing" for more details

		See Scott Hanselman’s blog Signing PowerShell Scripts. You can run the following in a power shell script to allow signed scripts to run:

			Set-ExecutionPolicy AllSigned

		This command requires administrator privileges. Changes to the execution policy are recognized immediately.

The jQuery.Mobile.MVC NuGet package installs the following:

- jQuery Mobile (jquery.mobile-1.0b3.js and the minified version jquery.mobile-1.0b3.min.js).
- A jQuery Mobile-styled layout file (Views\Shared\_Layout.Mobile.cshtml).
- A jQuery Mobile CSS file (jquery.mobile-1.0b3.css and the minified version jquery.mobile-1.0b3.min.css)
- Several .png image files in the Content\images folder.
- A view-switcher partial view (MvcMobile\Views\Shared\_ViewSwitcher.cshtml) that provides a link at the top of each page to switch from desktop view to mobile view and vice versa.
- A ViewSwitcher controller widget (Controllers\ViewSwitcherController.cs).
- jQuery.Mobile.MVC.dll, a DLL that provides view context extensions used to determine if view overrides exist.

The installation process also upgrades jQuery from version 1.62 to 1.63. The starter application uses jQuery 1.63. If you create a new ASP.NET MVC project, you'll have to manually change the script references from jQuery version 1.62 to 1.63 in the layout file.

	Verify that the jQuery and jQuery Mobile version numbers in the layout file match the version numbers in your project. If the NuGet package updates a new ASP.NET MVC 4 project you create, you will have to change *MvcMobile\Views\Shared\_Layout.Mobile.cshtml* to reference 1.6.3 instead of 1.6.2.

Open the *MvcMobile\Views\Shared\_Layout.Mobile.cshtml* file and add the following markup directly after the *Html.Partial *call:

	<div data-role="header" align="center">
	    @Html.ActionLink("Home", "Index", "Home")
	    @Html.ActionLink("Date", "AllDates")
	    @Html.ActionLink("Speaker", "AllSpeakers")
	    @Html.ActionLink("Tag", "AllTags")
	</div>

The complete body section looks like this:

	<body>
	    <div data-role="page" data-theme="a">
	        @Html.Partial("_ViewSwitcher")
	        <div data-role="header" align="center">
	            @Html.ActionLink("Home", "Index", "Home")
	            @Html.ActionLink("Date", "AllDates")
	            @Html.ActionLink("Speaker", "AllSpeakers")
	            @Html.ActionLink("Tag", "AllTags")
	        </div>
	        <div data-role="header">
	            <h1>@ViewBag.Title</h1>
	        </div>
	        <div data-role="content">
	            @RenderSection("featured", false)
	            @RenderBody()
	        </div>
	    </div>
	</body>

Build the application, and in your mobile browser emulator browse to the AllTags view. You see the following:

![After install jquery through nuget.][jquery3]

	aIf your mobile browser doesn't display the **Home**, **Speaker**, **Tag**, and **Date** links as buttons, the reference to the jQuery Mobile script file is probably not correct. Verify that the jQuery Mobile file version referenced in the mobile layout file matches the version in the Scripts folder.

In addition to the style changes, you see **Displaying mobile view** and a link that lets you switch from mobile view to desktop view. Choose the **Desktop view link**, and the desktop view is displayed.

![Display desktop view][jquery4]

The desktop view doesn't provide a way to directly navigate back to the mobile view. You'll fix that now. Open the *Views\Shared\_Layout.cshtml* file. Just under the page div element, add the following code, which renders the view-switcher widget:

    @Html.Partial("_ViewSwitcher")
    Here's the completed code:
     <body>
        <div class="page">
            @Html.Partial("_ViewSwitcher")
            <div id="header">

            @*Items removed for clarity.*@
            </div>
        </div>
    </body>


Refresh the **AllTags** view is the mobile browser. You can now navigate between desktop and mobile views.

![Navigate to mobile views.][jquery5]

Browse to the AllTags page in a desktop browser. The view-switcher widget is not displayed in a desktop browser because it's added only to the mobile layout page. Later in the tutorial you'll see how you can add the view-switcher widget to the desktop view.

![View desktop experience.][jquery6]

## <a name="bkmk_Improvespeakerslist"></a> Improve the Speakers List

In the mobile browser and select the **Speakers** link. Because there's no mobile view(*AllSpeakers.Mobile.cshtml*), the default speakers display (*AllSpeakers.cshtml*) is rendered using the mobile layout view (*_Layout.Mobile.cshtml*).

![View the mobile speakers list.][SpeakerList1]

You can globally disable a default (non-mobile) view from rendering inside a mobile layout by setting RequireConsistentDisplayMode to true in the *Views\_ViewStart.cshtml* file, like this:

![][SpeakerList2]

    @{
        Layout = "~/Views/Shared/_Layout.cshtml";
        DisplayModes.RequireConsistentDisplayMode = true;
    }

When RequireConsistentDisplayMode is set to true, the mobile layout (*_Layout.Mobile.cshtml*) is used only for mobile views. (That is, the view file is of the form ViewName.Mobile.cshtml.) You might want to set RequireConsistentDisplayMode to true if your mobile layout doesn't work well with your non-mobile views. The screenshot below shows how the Speakers page renders when RequireConsistentDisplayMode is set to true.

![][SpeakerList4]

You can disable consistent display mode in a view by setting RequireConsistentDisplayMode to false in the view file. The following markup in the *Views\Home\AllSpeakers.cshtml* file sets RequireConsistentDisplayMode to false:

    @model IEnumerable<string>
    @{
        ViewBag.Title = "All speakers";
        DisplayModes.RequireConsistentDisplayMode = false;
    }

## <a name="bkmk_mobilespeakersview"></a>Create a Mobile Speakers View

As you just saw, the Speakers view is readable, but the links are small and are difficult to tap on a mobile device. In this section, you'll create a mobile-specific Speakers view that looks like a modern mobile application — it displays large, easy-to-tap links and contains a search box to quickly find speakers.

1. Copy *AllSpeakers.cshtml* to *AllSpeakers.Mobile.cshtml.* Open the *AllSpeakers.Mobile.cshtml* file and remove the &lt;h2&gt; heading element.
2. In the **&lt;ul&gt;** tag, add the data-role attribute and set its value to *listview*. Like other *data-** attributes, *data-role="listview"* makes the large list items easier to tap. This is what the completed markup looks like:

	    @model IEnumerable<string>
	    @{
	        ViewBag.Title = "All speakers";
	    }
	    <ul data-role="listview">
	        @foreach(var speaker in Model) {
	            <li>@Html.ActionLink(speaker, "SessionsBySpeaker", new { speaker })</li>
	        }
	    </ul>

3.	Refresh the mobile browser. The updated view looks like this:

	![][MobileSpeakersView1]

4.	In the **&lt;ul&gt;** tag, add the data-filter attribute and set it to true. The code below shows the ul markup.

    <ul data-role="listview" data-filter="true">

The following image shows the search filter box at the top of the page that results from the data-filter attribute.

![][MobileSpeakersView2]

As you type each letter in the search box, jQuery Mobile filters the displayed list as shown in the image below.

![][MobileSpeakersView3]

## <a name="bkmk_improvetags"></a> Improve the Tags List

Like the default Speakers view, the Tags view is readable, but the links are small and difficult to tap on a mobile device. In this section, you'll fix the Tags view the same way you fixed the Speakers view.

1. Rename the *Views\Home\AllTags.Mobile.cshtml.hide* file to the *Views\Home\AllTags.Mobile.cshtml*. Open the renamed file and remove the **&lt;h2&gt;** element.

2. Add the data-role and data-filter attributes to the **&lt;ul&gt;** tag, as shown here:

		<ul data-role="listview" data-filter="true">

The image below shows the tags page filtering on the letter J.

![][TagsList1]

## <a name="bkmk_improvedates"></a> Improve the Dates List

You can improve the Dates view like you improved the **Speakers** and **Tags** views, so that it's easier to use on a mobile device.

1. Copy the *Views\Home\AllDates.Mobile.cshtml* file to *Views\Home\AllDates.Mobile.cshtml*.
2. Open the new file and remove the **&lt;h2&gt;** element.
3. Add *data-role="listview"* to the &lt;ul&gt; tag, like this:

     <ul data-role="listview">

The image below shows what the **Date** page looks like with the data-role attribute in place.

![][DatesList1]

Replace the contents of the *Views\Home\AllDates.Mobile.cshtml* file with the following code:

    @model IEnumerable<DateTime>
    @{
        ViewBag.Title = "All dates";
        DateTime lastDay = default(DateTime);
    }
    <ul data-role="listview">
        @foreach(var date in Model) {
            if (date.Date != lastDay) {
                lastDay = date.Date;
                <li data-role="list-divider">@date.Date.ToString("ddd, MMM dd")</li>
            }
            <li>@Html.ActionLink(date.ToString("h:mm tt"), "SessionsByDate", new { date })</li>
        }
    </ul>

This code groups all sessions by days. It creates a list divider for each new day, and it lists all the sessions for each day under a divider. Here's what it looks like when this code runs:

![][DatesList2]

## <a name="bkmk_improvesessionstable"></a> Improve the SessionsTable View

In this section, you'll create a mobile-specific view of sessions. The changes we make will be more extensive than in other views we have created.

In the mobile browser, tap the **Speaker** button, then enter Sc in the search box.

![][SessionView1]

Tap the **Scott Hanselman** link.

![][SessionView2]

As you can see, the display is difficult to read on a mobile browser. The date column is hard to read and the tags column is out of the view. To fix this, copy Views\*Home\SessionsTable.cshtml* to *Views\Home\SessionsTable.Mobile.cshtml*, and then replace the contents of the file with the following code:

    @using MvcMobile.Models
    @model IEnumerable<Session>

    <ul data-role="listview">
        @foreach(var session in Model) {
            <li>
                <a href="@Url.Action("SessionByCode", new { session.Code })">
                    <h3>@session.Title</h3>
                    <p><strong>@string.Join(", ", session.Speakers)</strong></p>
                    <p>@session.DateText</p>
                </a>
            </li>
        }
    </ul>

The code removes the room and tags columns, and formats the title, speaker, and date vertically, so that all this information is readable on a mobile browser. The image below reflects the code changes.

![][SessionView3]

## <a name="bkmk_improvesessionbycode"></a> Improve the SessionByCode View

Finally, you'll create a mobile-specific view of the **SessionByCode** view. In the mobile browser, tap the **Speaker** button, then enter Sc in the search box.

![][SessionByCode1]

Tap the **Scott Hanselman** link. Scott Hanselman's sessions are displayed.

![][SessionByCode2]

Choose the **An Overview of the MS Web Stack of Love** link.

![][SessionByCode3]

The default desktop view is fine, but you can improve it.

Copy the *Views\Home\SessionByCode.cshtml* to *Views\Home\SessionByCode.Mobile.cshtml* and replace the contents of the *Views\Home\SessionByCode.Mobile.cshtml* file with the following markup:


    @model MvcMobile.Models.Session

    @{
        ViewBag.Title = "Session details";
    }
    <h2>@Model.Title</h2>
    <p>
        <strong>@Model.DateText</strong> in <strong>@Model.Room</strong>
    </p>

    <ul data-role="listview" data-inset="true">
        <li data-role="list-divider">Speakers</li>
        @foreach (var speaker in Model.Speakers) {
            <li>@Html.ActionLink(speaker, "SessionsBySpeaker", new { speaker })</li>
        }
    </ul>

    <p>@Model.Description</p>
    <h4>Code: @Model.Code</h4>

    <ul data-role="listview" data-inset="true">
        <li data-role="list-divider">Tags</li>
        @foreach (var tag in Model.Tags) {
            <li>@Html.ActionLink(tag, "SessionsByTag", new { tag })</li>
        }
    </ul>

The new markup uses the **data-role** attribute to improve the layout of the view.

Refresh the mobile browser. The following image reflects the code changes that you just made:

![][SessionByCode4]

## <a name="bkmk_deployapplciation"></a> Deploy the Applciation to the Windows Azure Web Site

1.	In your browser, open the Preview Management Portal.
2.	In the **Web Sites** tab, click the name of the site you created earlier.

	![][DeployApplication1]	
3.	Select the Quickstart tab and then click **Download publishing profile**.

	![][DeployApplication2]	
	This step downloads a file that contains all of the settings that you need to deploy an application to your Web Site. You'll import this file into Visual Studio so you don't have to enter this information manually.
4.	Save the .publishsettings file in a folder that you can access from Visual Studio.

	![][DeployApplication3]
5.	In Visual Studio, right-click the project in **Solution Explorer** and select **Publish** from the context menu.

	![][DeployApplication4]	

	The **Publish Web** wizard opens.
6.	In the **Profile** tab of the **Publish Web** wizard, click **Import**.

	![][DeployApplication5]	
7.	Select the .publishsettings file you downloaded earlier, and then click **Open**.

	![][DeployApplication6]	
8.	Click **Next**.

	![][DeployApplication7]	
11.	In the Settings tab, click **Next**.
	
	![][DeployApplication8]	
12.	Click **Publish**.
	Visual Studio begins the process of copying the files to the Windows Azure server.

	![][DeployApplication9]
14.	The **Output** window shows what deployment actions were taken and reports successful completion of the deployment.

15.The default browser automatically opens to the URL of the deployed site.
 The application you created is now running in the cloud.

	![][DeployApplication10]

## Wrapup and Review

This tutorial has introduced the new mobile features of ASP.NET MVC 4 Developer Preview. The mobile features include:
 •The ability to override layout, views, and partial views, both globally and for an individual view.
•Control over layout and partial override enforcement using the RequireConsistentDisplayMode property.
•A view-switcher widget for mobile views than can also be displayed in desktop views.
•Support for supporting specific browsers, such as the iPhone browser.





[Create a Windows Azure web site]: #bkmk_createaccount
[Setup the starter Project]: #
[Overriding Views, Layouts, and Partial Views]: #
[Browser-Specific Views]: #
[Using jQuery Mobile ]: #
[Improve the Speakers List]: #
[Creating a Mobile Speakers View]: #
[Improve the Tags List]: #
[Improve the Dates List]: #
[Improve the SessionsTable View]: #
[Improve the SessionByCode View]: #
[Deploy the Applciation to the Windows Azure Web Site]: #


[CreateWebSite1]: ../media/depoly_mobile_new_website_1.png
[CreateWebSite2]: ../media/depoly_mobile_new_website_2.png
[CreateWebSite3]: ../media/depoly_mobile_new_website_3.png
[CreateWebSite4]: ../media/depoly_mobile_new_website_4.png
[AppMainPage]: ../media/FinishedAPPMainScreen.png
[PropertiesPopup]: ../media/propertiespopup.png
[BrowseByTagWithCallout]:../media/BrowseByTagWithCallout.png
[ASPNetPage]: ../media/ASPNetPage.png"
[Overrideviews1]: ../media/windows-live-writer_asp_net-mvc-4-mobile-features_d2ff_p2m_layouttags_mobile_thumb.png
[Overrideviews2]: ../media/Windows-Live-Writer_ASP_NET-MVC-4-Mobile-Features_D2FF_p2_layoutTagsDesktop_thumb.png
[jquery1]: ../media/Windows-Live-Writer_ASP_NET-MVC-4-Mobile-Features_D2FF_p3_packageMgr_thumb.png
[jquery2]: ../media/Windows-Live-Writer_ASP_NET-MVC-4-Mobile-Features_D2FF_p3_packageMgrConsole_thumb.png
[jquery3]: ../media/windows-live-writer_asp_net-mvc-4-mobile-features_d2ff_p3_afternuget_thumb.png
[jquery4]: ../media/windows-live-writer_asp_net-mvc-4-mobile-features_d2ff_p3_desktopviewwithmobilelink_thumb.png
[jquery5]: ../media/windows-live-writer_asp_net-mvc-4-mobile-features_d2ff_p3_desktopviewwithmobilelink_thumb.png
[jquery6]: ../media/Windows-Live-Writer_ASP_NET-MVC-4-Mobile-Features_D2FF_p3_desktopBrowser_thumb.png
[SpeakerList1]: ../media/windows-live-writer_asp_net-mvc-4-mobile-features_d2ff_p3_speakersdesktop_thumb.png
[SpeakerList2]: ../media/windows-live-writer_asp_net-mvc-4-mobile-features_d2ff_p3_speakersconsistent_thumb.png
[SpeakerList3]: ../media/windows-live-writer_asp_net-mvc-4-mobile-features_d2ff_p3_updatedspeakerview1_thumb.png
[SpeakerList4]: ../media/windows-live-writer_asp_net-mvc-4-mobile-features_d2ff_ps_data_filter_thumb.png
[MobileSpeakersView1]: ../media/windows-live-writer_asp_net-mvc-4-mobile-features_d2ff_p3_updatedspeakerview1_thumb.png
[MobileSpeakersView2]: ../media/windows-live-writer_asp_net-mvc-4-mobile-features_d2ff_ps_data_filter_thumb.png
[MobileSpeakersView3]: ../media/windows-live-writer_asp_net-mvc-4-mobile-features_d2ff_ps_data_filter_sc_thumb.png
[TagsList1]: ../media/windows-live-writer_asp_net-mvc-4-mobile-features_d2ff_p3_tags_j_thumb.png
[DatesList1]: ../media/windows-live-writer_asp_net-mvc-4-mobile-features_d2ff_p3_dates1_thumb.png
[DatesList2]: ../media/windows-live-writer_asp_net-mvc-4-mobile-features_d2ff_p3_dates2_thumb.png
[SessionView1]: ../media/windows-live-writer_asp_net-mvc-4-mobile-features_d2ff_ps_data_filter_sc_thumb_1.png
[SessionView2]: ../media/windows-live-writer_asp_net-mvc-4-mobile-features_d2ff_p3_scottha_thumb.png
[SessionView3]: ../media/windows-live-writer_asp_net-mvc-4-mobile-features_d2ff_ps_sessionsbyscottha_thumb.png
[SessionByCode1]: ../media/windows-live-writer_asp_net-mvc-4-mobile-features_d2ff_ps_data_filter_sc_thumb_2.png
[SessionByCode2]: ../media/windows-live-writer_asp_net-mvc-4-mobile-features_d2ff_p3_scottha_thumb.png
[SessionByCode3]: ../media/windows-live-writer_asp_net-mvc-4-mobile-features_d2ff_ps_love_thumb.png
[SessionByCode4]: ../media/windows-live-writer_asp_net-mvc-4-mobile-features_d2ff_p3_love2_thumb.png
[DeployApplication1]: ../media/depoly_mobile_new_website_5.png
[DeployApplication2]: ../media/depoly_mobile_new_website_6.png
[DeployApplication3]: ../media/depoly_mobile_new_website_7.png
[DeployApplication4]: ../media/depoly_mobile_new_website_8.png
[DeployApplication5]: ../media/depoly_mobile_new_website_9.png
[DeployApplication6]: ../media/depoly_mobile_new_website_10.png
[DeployApplication7]: ../media/depoly_mobile_new_website_12.png
[DeployApplication8]: ../media/depoly_mobile_new_website_13.png
[DeployApplication9]: ../media/depoly_mobile_new_website_14.png
[DeployApplication10]: ../media/depoly_mobile_new_website_15.png

[Create a Windows Azure web site]: #bkmk_createaccount
[Setup the starter Project]: #setupstarterproject
[Override the Views, Layouts, and Partial Views]: #overrideviews
[Browser-Specific Views]: #browserspecificviews
[Use jQuery Mobile to define the mobile broswer interface]: #usejquerymobile
[Improve the Speakers List]: #Improvespeakerslist
[Create a Mobile Speakers View]: #mobilespeakersview
[Improve the Tags List]: #improvetags
[Improve the Dates List]: #improvedates
[Improve the SessionsTable View]: #improvesessionstable
[Improve the SessionByCode View]: #improvesessionbycode
[Deploy the Applciation to the Windows Azure Web Site]: #deployapplciation

[VSWDExpresPrerequites]: http://www.microsoft.com/web/gallery/install.aspx?appid=VWD2010SP1Pack
[MVC4DeveloperPreview]: http://www.asp.net/mvc/mvc4
[WebDeployUpdate]:

[MVC4StarterProject]: http://go.microsoft.com/fwlink/?LinkId=228307
[FinishedProject]: http://go.microsoft.com/fwlink/?LinkId=228306

[Win7PhoneEmulator]: http://www.microsoft.com/web/gallery/install.aspx?appid=VWD2010SP1Pack
[OperaMobileEmulator]: http://www.opera.com/developer/tools/mobile/
[AppleSafari]: http://www.apple.com/safari/download/
[HowToSafari]: http://www.davidalison.com/2008/05/how-to-let-safari-pretend-its-ie.html
[FireFox]: http://www.bing.com/search?q=firefox+download
[FireFoxUserAgentSwitcher]: https://addons.mozilla.org/en-US/firefox/addon/user-agent-switcher/

[CSSMediaQuries]: http://www.w3.org/TR/css3-mediaqueries/
