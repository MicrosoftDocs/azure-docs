<properties 
	pageTitle="Deploy an ASP.NET MVC 5 mobile web app in Azure App Service" 
	description="A tutorial that teaches you how to deploy a web app to Azure App Service using mobile features in ASP.NET MVC 5 web application." 
	services="app-service\web" 
	documentationCenter=".net" 
	authors="cephalin" 
	manager="wpickett" 
	editor="mollybos"/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="04/29/2015" 
	ms.author="cephalin;riande"/>


# Deploy an ASP.NET MVC 5 mobile web app in Azure App Service

This tutorial will teach you the basics of how to build an ASP.NET MVC 5
web app that is mobile-friendly and deploy it to Azure App Service. For this tutorial, you need 
[Visual Studio Express 2013 for Web][Visual Studio Express 2013]
or the professional edition of Visual Studio if you already
have that.

[AZURE.INCLUDE [create-account-and-websites-note](../includes/create-account-and-websites-note.md)]

## What You'll Build

For this tutorial, you'll add mobile features to the simple
conference-listing application that's provided in the [starter project][StarterProject]. The following screenshot shows the ASP.NET sessions in the completed
application, as seen in the browser emulator in Internet Explorer 11 F12
developer tools.

![][FixedSessionsByTag]

You can use the Internet Explorer 11 F12 developer tools and the [Fiddler
tool][Fiddler] to help debug your
application. 

## Skills You'll Learn

Here's what you'll learn:

-	How to use Visual Studio 2013 to publish your web application directly to a web app in Azure App Service.
-   How the ASP.NET MVC 5 templates use the CSS Bootstrap framework to
    improve display on mobile devices
-   How to create mobile-specific views to target specific mobile
    browsers, such as the iPhone and Android
-   How to create responsive views (views that respond to different
    browsers across devices)

## Set up the development environment

Set up your development environment by installing the Azure SDK for .NET 2.5.1 or later. 

1. To install the Azure SDK for .NET, click the link below. If you don't have Visual Studio 2013 installed yet, it will be installed by the link. This tutorial requires Visual Studio 2013. [Azure SDK for Visual Studio 2013][AzureSDKVs2013]
1. In the Web Platform Installer window, click **Install** and proceed with the installation.

You will also need a mobile browser emulator. Any of the following will
work:

-   Browser Emulator in [Internet Explorer 11 F12 developer tools][EmulatorIE11] (used in all mobile
    browser screenshots). It has user agent string presets for Windows Phone 8, Windows Phone 7, and Apple iPad.
-	Browser Emulator in [Google Chrome DevTools][EmulatorChrome]. It contains presets for numerous Android devices, as well as Apple iPhone, Apple iPad, and Amazon Kindle Fire. It also emulates touch events.
-   [Opera Mobile Emulator][EmulatorOpera]

Visual Studio projects with C\# source code are available to accompany
this topic:

-   [Starter project download][StarterProject]
-   [Completed project download][CompletedProject]

##<a name="bkmk_DeployStarterProject"></a>Deploy the starter project to an Azure web app

1.	Download the conference-listing application [starter project][StarterProject].

2. 	Then in Windows Explorer, right-click the Mvc5Mobile.zip file and choose *Properties*.

3. 	In the **Mvc5Mobile.zip Properties** dialog box,
choose the **Unblock** button. (Unblocking prevents a security warning
that occurs when you try to use a *.zip* file that you've downloaded
from the web.)

4.	Right-click the *Mvc5Mobile.zip* file and select **Extract All** to
unzip the file. 

5. 	In Visual Studio, open the *Mvc5Mobile.sln* file.

6.  In Solution Explorer, right-click the project and click **Publish**.

	![][DeployClickPublish]

7.	In Publish Web, click **Microsoft Azure Web Apps**.

	![][DeployClickWebSites]

8.	Click **Sign in**.

	![][DeploySignIn]

9.	Follow the prompts to log into your Azure account.

11. The Select Existing Web App dialog should now show you as signed in. Click **New**.

	![][DeployNewWebsite]  

12. In the **Web App name** field, specify a unique app name prefix. Your fully-qualified web app name will be *&lt;prefix>*.azurewebsites.net. Also, configure the **App Service plan**, **Resource group**, and **Region** fields. Then, click **Create**.

	![][DeploySiteSettings]

13.	The Publish Web dialog will be filled with the settings for your new web app. Click **Publish**.

	![][DeployPublishSite]

	Once Visual Studio finishes publishing the starter project to the Azure web app, the desktop browser opens to display the live web app.

14.	Start your mobile browser emulator, copy the URL for
the conference application (*<prefix>*.azurewebsites.net) into the emulator, and then click the
top-right button and select **Browse by tag**. If you are using Internet
Explorer 11 as the default browser, you just need to type `F12`, then
`Ctrl+8`, and then change the browser profile to **Windows Phone**. The
image below shows the *AllTags* view in portrait mode (from choosing
**Browse by tag**).

	![][AllTags]

>[AZURE.NOTE] While you can debug your MVC 5 application from within Visual Studio, you can publish your web app to Azure again to verify the live web app directly from your mobile browser or a browser emulator.

The display is very readable on a mobile device. You can also already
see some of the visual effects applied by the Bootstrap CSS framework.
Click the **ASP.NET** link.

![][SessionsByTagASP.NET]

The ASP.NET tag view is zoom-fitted to the screen, which Bootstrap does
for you automatically. However, you can improve this view to better suit
the mobile browser. For example, the **Date** column is difficult to
read. Later in the tutorial you'll change the *AllTags* view to make it
mobile-friendly.

##<a name="bkmk_bootstrap"></a> Bootstrap CSS Framework

New in the MVC 5 template is built-in Bootstrap support. You have
already seen how it immediately improves the different views in your
application. For example, the navigation bar at the top is automatically
collapsible when the browser width is smaller. On the desktop browser,
try resizing the browser window and see how the navigation bar changes
its look and feel. This is the responsive web design that is built into
Bootstrap.

To see how the Web app would look without Bootstrap, open
*App\_Start\\BundleConfig.cs* and comment out the lines that contain
*bootstrap.js* and *bootstrap.css*. The following code shows the last
two statements of the `RegisterBundles` method after the change:

     bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
              //"~/Scripts/bootstrap.js",
              "~/Scripts/respond.js"));

    bundles.Add(new StyleBundle("~/Content/css").Include(
              //"~/Content/bootstrap.css",
              "~/Content/site.css"));

Press `Ctrl+F5` to run the application.

Observe that the collapsible navigation bar is now just an ordinary
unordered list. Click **Browse by tag** again, then click **ASP.NET**.
In the mobile emulator view, you can see now that it is no longer
zoom-fitted to the screen, and you must scroll sideways in order to see
the right side of the table.

![][SessionsByTagASP.NETNoBootstrap]

Undo your changes and refresh the mobile browser
to verify that the mobile-friendly display has been restored.

Bootstrap is not specific to ASP.NET MVC 5, and you can take advantage
of these features in any web application. But it is now built into the
ASP.NET MVC 5 project template, so that your MVC 5 Web application can
take advantage of Bootstrap by default.

For more information about Bootstrap, go to the
[Bootstrap][BootstrapSite] site.

In the next section you'll see how to provide mobile-browser specific
views.

##<a name="bkmk_overrideviews"></a> Override the Views, Layouts, and Partial Views

You can override any view (including layouts and partial views) for
mobile browsers in general, for an individual mobile browser, or for any
specific browser. To provide a mobile-specific view, you can copy a view
file and add *.Mobile* to the file name. For example, to create a mobile
*Index* view, you can copy *Views\\Home\\Index.cshtml* to
*Views\\Home\\Index.Mobile.cshtml*.

In this section, you'll create a mobile-specific layout file.

To start, copy *Views\\Shared\\\_Layout.cshtml* to
*Views\\Shared\\\_Layout.Mobile.cshtml*. Open *\_Layout.Mobile.cshtml*
and change the title from **MVC5 Application** to **MVC5 Application
(Mobile)**.

In each `Html.ActionLink` call for the navigation bar, remove "Browse by" in each link
*ActionLink*. The following code shows the completed `<ul class="nav navbar-nav">` tag of the mobile layout file.

    <ul class="nav navbar-nav">
        <li>@Html.ActionLink("Home", "Index", "Home")</li>
        <li>@Html.ActionLink("Date", "AllDates", "Home")</li>
        <li>@Html.ActionLink("Speaker", "AllSpeakers", "Home")</li>
        <li>@Html.ActionLink("Tag", "AllTags", "Home")</li>
    </ul>

Copy the *Views\\Home\\AllTags.cshtml* file to
*Views\\Home\\AllTags.Mobile.cshtml*. Open the new file and change the
`<h2>` element from "Tags" to "Tags (M)":

    <h2>Tags (M)</h2>

Browse to the tags page using a desktop browser and using mobile browser
emulator. The mobile browser emulator shows the two changes you made
(the title from *\_Layout.Mobile.cshtml* and the title from
*AllTags.Mobile.cshtml*).

![][AllTagsMobile_LayoutMobile]

In contrast, the desktop display has not changed (with titles from from *\_Layout.cshtml* and 
*AllTags.cshtml*).

![][AllTagsMobile_LayoutMobileDesktop]

##<a name="bkmk_browserviews"></a> Create Browser-Specific Views

In addition to mobile-specific and desktop-specific views, you can
create views for an individual browser. For example, you can create
views that are specifically for the iPhone or the Android browser. In this section,
you'll create a layout for the iPhone browser and an iPhone version of
the *AllTags* view.

Open the *Global.asax* file and add the following code to the bottom of the
`Application_Start` method.

    DisplayModeProvider.Instance.Modes.Insert(0, new DefaultDisplayMode("iPhone")
    {
        ContextCondition = (context => context.GetOverriddenUserAgent().IndexOf
            ("iPhone", StringComparison.OrdinalIgnoreCase) >= 0)
    });

This code defines a new display mode named "iPhone" that will be matched
against each incoming request. If the incoming request matches the
condition you defined (that is, if the user agent contains the string
"iPhone"), ASP.NET MVC will look for views whose name contains the
"iPhone" suffix.

>[AZURE.NOTE] When adding mobile browser-specific display modes, such as for iPhone and Android, be sure to set the first argument to `0` (insert at the top of the list) to make sure that the browser-specific mode takes precedence over the mobile template (*.Mobile.cshtml). If the mobile template is at the top of the list instead, it will be selected over your intended display mode (the first match wins, and the mobile template matches all mobile browsers). 

In the code, right-click `DefaultDisplayMode`, choose **Resolve**, and
then choose `using System.Web.WebPages;`. This adds a reference to the
`System.Web.WebPages` namespace, which is where the
`DisplayModeProvider` and `DefaultDisplayMode` types are defined.

![][ResolveDefaultDisplayMode]

Alternatively, you can just manually add the following line to the
`using` section of the file.

    using System.Web.WebPages;

Save the changes. Copy the
*Views\\Shared\\\_Layout.Mobile.cshtml* file to
*Views\\Shared\\\_Layout.iPhone.cshtml*. Open the new file
and then change the title from `MVC5 Application (Mobile)` to
`MVC5 Application (iPhone)`.

Copy the *Views\\Home\\AllTags.Mobile.cshtml* file to
*Views\\Home\\AllTags.iPhone.cshtml*. In the new file, change
the `<h2>` element from "Tags (M)" to "Tags (iPhone)".

Run the application. Run a mobile browser emulator, make sure its user
agent is set to "iPhone", and browse to the *AllTags* view. If you are
using the emulator in Internet Explorer 11 F12 developer tools,
configure emulation to the following:

-   Browser profile = **Windows Phone**
-   User agent string =  **Custom**
-   Custom string = **Apple-iPhone5C1/1001.525**

The following screenshot shows the *AllTags* view rendered in the
emulator in Internet Explorer 11 F12 developer tools with the custom user agent string (this is an iPhone 5C user agent string).

![][AllTagsIPhone_LayoutIPhone]

In the mobile browser, select the **Speakers** link. Because there's not
a mobile view (*AllSpeakers.Mobile.cshtml*), the default speakers view
(*AllSpeakers.cshtml*) is rendered using the mobile layout view
(*\_Layout.Mobile.cshtml*). As shown below, the title **MVC5 Application
(Mobile)** is defined in *\_Layout.Mobile.cshtml*.

![][AllSpeakers_LayoutMobile]

You can globally disable a default (non-mobile) view from rendering
inside a mobile layout by setting `RequireConsistentDisplayMode` to
`true` in the *Views\\\_ViewStart.cshtml* file, like this:

    @{
        Layout = "~/Views/Shared/_Layout.cshtml";
        DisplayModeProvider.Instance.RequireConsistentDisplayMode = true;
    }

When `RequireConsistentDisplayMode` is set to `true`, the mobile layout
(*\_Layout.Mobile.cshtml*) is used only for mobile views (i.e. when the
view file is of the form ***ViewName**.Mobile.cshtml*). You might want
to set `RequireConsistentDisplayMode` to `true` if your mobile layout
doesn't work well with your non-mobile views. The screenshot below shows
how the *Speakers* page renders when `RequireConsistentDisplayMode` is
set to `true` (without the string "(Mobile)" in the navigational bar at the top).

![][AllSpeakers_LayoutMobileOverridden]

You can disable consistent display mode in a specific view by setting
`RequireConsistentDisplayMode` to `false` in the view file. The
following markup in the *Views\\Home\\AllSpeakers.cshtml* file sets
`RequireConsistentDisplayMode` to `false`:

    @model IEnumerable<string>

    @{
        ViewBag.Title = "All speakers";
        DisplayModeProvider.Instance.RequireConsistentDisplayMode = false;
    }

In this section we've seen how to create mobile layouts and views and
how to create layouts and views for specific devices such as the iPhone.
However, the main advantage of the Bootstrap CSS framework is the
responsive layout, which means that a single stylesheet can be applied
across desktop, phone, and tablet browsers to create a consistent look and
feel. In the next section you'll see how to leverage Bootstrap to create
mobile-friendly views.

##<a name="bkmk_Improvespeakerslist"></a> Improve the Speakers List

As you just saw, the *Speakers* view is readable, but the links are
small and are difficult to tap on a mobile device. In this section,
you'll make the *AllSpeakers* view mobile-friendly, which displays
large, easy-to-tap links and contains a search box to quickly find
speakers.

You can use the Bootstrap [linked list group][] styling to
improve the *Speakers* view. In *Views\\Home\\AllSpeakers.cshtml*,
replace the contents of the Razor file with the code below.

     @model IEnumerable<string>

    @{
        ViewBag.Title = "All Speakers";
    }

    <h2>Speakers</h2>

    <div class="list-group">
        @foreach (var speaker in Model)
        {
            @Html.ActionLink(speaker, "SessionsBySpeaker", new { speaker }, new { @class = "list-group-item" })
        }
    </div>

The `class="list-group"` attribute in the `<div>` tag applies the
Bootstrap list styling, and the `class="input-group-item"` attribute
applies Bootstrap list item styling to each link.

Refresh the mobile browser. The updated view looks like this:

![][AllSpeakersFixed]

The Bootstrap [linked list group][] styling makes the entire box for each
link clickable, which is a much better user experience. Switch to the
desktop view and observe the consistent look and feel.

![][AllSpeakersFixedDesktop]

Although the mobile browser view has improved, it's difficult to
navigate the long list of speakers. Bootstrap doesn't provide a
search filter functionality out-of-the-box, but you can add it with a
few lines of code. You will first add a search box to the view, then
hook up with the JavaScript code for the filter function. In
*Views\\Home\\AllSpeakers.cshtml*, add a \<form\> tag just after the \<h2\> tag, as shown below:

    @model IEnumerable<string>

    @{
        ViewBag.Title = "All Speakers";
    }

    <h2>Speakers</h2>

    <form class="input-group">
        <span class="input-group-addon"><span class="glyphicon glyphicon-search"></span></span>
        <input type="text" class="form-control" placeholder="Search speaker">
    </form>
    <br />
    <div class="list-group">
        @foreach (var speaker in Model)
        {
            @Html.ActionLink(speaker, 
                             "SessionsBySpeaker", 
                             new { speaker }, 
                             new { @class = "list-group-item" })
        }
    </div>

Notice that the `<form>` and `<input>` tags both have the Bootstrap
styles applied to them. The `<span>` element adds a Bootstrap
[glyphicon][] to the
search box.

In the *Scripts* folder, add a JavaScript file called *filter.js*. Open
the file and paste the following code into it:

    $(function () {

        // reset the search form when the page loads
        $("form").each(function () {
            this.reset();
        });

        // wire up the events to the <input> element for search/filter
        $("input").bind("keyup change", function () {
            var searchtxt = this.value.toLowerCase();
            var items = $(".list-group-item");

            // show all speakers that begin with the typed text and hide others
            for (var i = 0; i < items.length; i++) {
                var val = items[i].text.toLowerCase();
                val = val.substring(0, searchtxt.length);
                if (val == searchtxt) {
                    $(items[i]).show();
                }
                else {
                    $(items[i]).hide();
                }
            }
        });
    });

You also need to include filter.js in your registered bundles. Open
*App\_Start\\BundleConfig.cs* and change the first bundles. Change the
first `bundles.Add` statement (for the **jquery** bundle) to include
*Scripts\\filter.js*, as follows:

     bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-{version}.js",
                "~/Scripts/filter.js"));

The **jquery** bundle is already rendered by the default *\_Layout*
view. Later, you can utilize the same JavaScript code to apply the
filter functionality to other list views.

Refresh the mobile browser and go to the *AllSpeakers* view. In the
search box, type "sc". The speakers list should now be filtered
according to your search string.

![][AllSpeakersFixedSearchBySC]

##<a name="bkmk_improvetags"></a> Improve the Tags List

Like the *Speakers* view, the *Tags* view is readable, but the links
are small and difficult to tap on a mobile device. You can fix the *Tags* view the same way you fix the *Speakers* view, if you use the code changes described earlier, but with the following `Html.ActionLink` method syntax in *Views\\Home\\AllTags.cshtml*:

    @Html.ActionLink(tag, 
                     "SessionsByTag", 
                     new { tag }, 
                     new { @class = "list-group-item" })

The refreshed desktop browser looks as follows:

![][AllTagsFixedDesktop]

And the refreshed mobile browser looks as follows: 

![][AllTagsFixed]

>[AZURE.NOTE] If you notice that the original list formatting is still there in the mobile browser and wonder what happened to your nice Bootstrap styling, this is an artifact of your earlier action to create mobile specific views. However, now that you are using the Bootstrap CSS framework to create a responsive web design, go head and remove these mobile-specific views and the mobile-specific layout views. Once you have done so, the refreshed mobile browser will show the Bootstrap styling.

##<a name="bkmk_improvedates"></a> Improve the Dates List

You can improve the *Dates* view like you improved the *Speakers* and
*Tags* views if you use the code changes described earlier, but with the following `Html.ActionLink` method syntax in *Views\\Home\\AllDates.cshtml*:

    @Html.ActionLink(date.ToString("ddd, MMM dd, h:mm tt"), 
                     "SessionsByDate", 
                     new { date }, 
                     new { @class = "list-group-item" })

You will get a refreshed mobile browser view like this:

![][AllDatesFixed]

You can further improve the *Dates* view by organizing the date-time
values by date. This can be done with the Bootstrap
[panels][] styling. Replace
the contents of the *Views\\Home\\AllDates.cshtml* file with the
following code:

    @model IEnumerable<DateTime>

    @{
        ViewBag.Title = "All Dates";
    }

    <h2>Dates</h2>

    @foreach (var dategroup in Model.GroupBy(x=>x.Date))
    {
        <div class="panel panel-primary">
            <div class="panel-heading">
                @dategroup.Key.ToString("ddd, MMM dd")
            </div>
            <div class="panel-body list-group">
                @foreach (var date in dategroup)
                {
                    @Html.ActionLink(date.ToString("h:mm tt"), 
                                     "SessionsByDate", 
                                     new { date }, 
                                     new { @class = "list-group-item" })
                }
            </div>
        </div>
    }

This code creates a separate `<div class="panel panel-primary">` tag for
each distinct date in the list, and uses the [linked list group][] for the
respective links as before. Here's what the mobile browser looks like
when this code runs:

![][AllDatesFixed2]

Switch to the desktop browser. Again, note the consistent look.

![][AllDatesFixed2Desktop]

##<a name="bkmk_improvesessionstable"></a> Improve the SessionsTable View

In this section, you'll make the *SessionsTable* view more
mobile-friendly. This change is more extensive the previous changes.

In the mobile browser, tap the **Tag** button, then enter `asp` in the
search box.

![][AllTagsFixedSearchByASP]

Tap the **ASP.NET** link.

![][SessionsTableTagASP.NET]

As you can see, the display is formatted as a table, which is currently
designed to be viewed in the desktop browser. However, it's a little bit
difficult to read on a mobile browser. To fix this, open
*Views\\Home\\SessionsTable.cshtml* and then replace the contents of the
file with the following code:

    @model IEnumerable<Mvc5Mobile.Models.Session>

    <h2>@ViewBag.Title</h2>

    <div class="container">
        <div class="row">
            @foreach (var session in Model)
            {
                <div class="col-md-4">
                    <div class="list-group">
                        @Html.ActionLink(session.Title, 
                                         "SessionByCode", 
                                         new { session.Code }, 
                                         new { @class="list-group-item active" })
                        <div class="list-group-item">
                            <div class="list-group-item-text">
                                @Html.Partial("_SpeakersLinks", session)
                            </div>
                            <div class="list-group-item-info">
                                @session.DateText
                            </div>
                            <div class="list-group-item-info small hidden-xs">
                                @Html.Partial("_TagsLinks", session)
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    </div>

The code does 3 things:

-   uses the Bootstrap [custom linked list group][]
    to format the session information vertically, so that all this
    information is readable on a mobile browser (using classes such as list-group-item-text)
-   applies the [grid system][] to the
    layout, so that the session items flow horizontally in the desktop
    browser and vertically in the mobile browser (using the col-md-4 class)
-   uses the [responsive utilities][] to
    hide the session tags when viewed in the mobile browser (using the hidden-xs class)

You can also tap a title link to go to the respective session. The image
below reflects the code changes.

![][FixedSessionsByTag]

The Bootstrap grid system that you applied automatically arranges the
sessions vertically in the mobile browser. Also, notice that the tags
are not shown. Switch to the desktop browser.

![][SessionsTableFixedTagASP.NETDesktop]

In the desktop browser, notice that the tags are now displayed. Also, you can see that the Bootstrap grid system you
applied arranges the session items in two columns. If you enlarge the
browser, you will see that the arrangement changes to three columns.

##<a name="bkmk_improvesessionbycode"></a> Improve the SessionByCode View

Finally, you'll fix the *SessionByCode* view to make it mobile-friendly.

In the mobile browser, tap the **Tag** button, then enter `asp` in the
search box.

![][AllTagsFixedSearchByASP]

Tap the **ASP.NET** link. Sessions for the ASP.NET tag are displayed.

![][FixedSessionsByTag]

Choose the **Building a Single Page Application with ASP.NET and
AngularJS** link.

![][SessionByCode3-644]

The default desktop view is fine, but you can improve the look easily by using some Bootstrap GUI components.

Open *Views\\Home\\SessionByCode.cshtml* and replace the contents with
the following markup:

    @model Mvc5Mobile.Models.Session

    @{
        ViewBag.Title = "Session details";
    }
    <h3>@Model.Title (@Model.Code)</h3>
    <p>
        <strong>@Model.DateText</strong> in <strong>@Model.Room</strong>
    </p>

    <div class="panel panel-primary">
        <div class="panel-heading">
            Speakers
        </div>
        @foreach (var speaker in Model.Speakers)
        {
            @Html.ActionLink(speaker, 
                             "SessionsBySpeaker", 
                             new { speaker }, 
                             new { @class="panel-body" })
        }
    </div>

    <p>@Model.Abstract</p>

    <div class="panel panel-primary">
        <div class="panel-heading">
            Tags
        </div>
        @foreach (var tag in Model.Tags)
        {
            @Html.ActionLink(tag, 
                             "SessionsByTag", 
                             new { tag }, 
                             new { @class = "panel-body" })
        }
    </div>

The new markup uses Bootstrap panels styling to improve the mobile view. 

Refresh the mobile browser. The following image reflects the code
changes that you just made:

![][SessionByCodeFixed3-644]

## Wrap Up and Review

This tutorial has shown you how to use ASP.NET MVC 5 to develop
mobile-friendly Web applications. These include:

-	Deploy an ASP.NET MVC 5 application to an App Service web app
-   Use Bootstrap to create responsive web layout in your MVC 5
    application
-   Override layout, views, and partial views, both globally and for an
    individual view
-   Control layout and partial override enforcement using the
    `RequireConsistentDisplayMode` property
-   Create views that target specific browsers, such as the iPhone
    browser
-   Apply Bootstrap styling in Razor code

## See Also

-   [9 basic principles of responsive web design](http://blog.froont.com/9-basic-principles-of-responsive-web-design/)
-   [Bootstrap][BootstrapSite]
-   [Official Bootstrap Blog][]
-   [Twitter Bootstrap Tutorial from Tutorial Republic][]
-   [The Bootstrap Playground][]
-   [W3C Recommendation Mobile Web Application Best Practices][]
-   [W3C Candidate Recommendation for media queries][]

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the old portal to the new portal see: [Reference for navigating the preview portal](http://go.microsoft.com/fwlink/?LinkId=529715)

<!-- Internal Links -->
[Deploy the starter project to an Azure web app]: #bkmk_DeployStarterProject
[Bootstrap CSS Framework]: #bkmk_bootstrap
[Override the Views, Layouts, and Partial Views]: #bkmk_overrideviews
[Create Browser-Specific Views]:#bkmk_browserviews
[Improve the Speakers List]: #bkmk_Improvespeakerslist
[Improve the Tags List]: #bkmk_improvetags
[Improve the Dates List]: #bkmk_improvedates
[Improve the SessionsTable View]: #bkmk_improvesessionstable
[Improve the SessionByCode View]: #bkmk_improvesessionbycode

<!-- External Links -->
[Visual Studio Express 2013]: http://www.visualstudio.com/downloads/download-visual-studio-vs#d-express-web
[AzureSDKVs2013]: http://go.microsoft.com/fwlink/p/?linkid=323510&clcid=0x409
[Fiddler]: http://www.fiddler2.com/fiddler2/
[EmulatorIE11]: http://msdn.microsoft.com/library/ie/dn255001.aspx
[EmulatorChrome]: https://developers.google.com/chrome-developer-tools/docs/mobile-emulation
[EmulatorOpera]: http://www.opera.com/developer/tools/mobile/
[StarterProject]: http://go.microsoft.com/fwlink/?LinkID=398780&clcid=0x409
[CompletedProject]: http://go.microsoft.com/fwlink/?LinkID=398781&clcid=0x409
[BootstrapSite]: http://getbootstrap.com/
[WebPIAzureSdk23NetVS13]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/WebPIAzureSdk23NetVS13.png
[linked list group]: http://getbootstrap.com/components/#list-group-linked
[glyphicon]: http://getbootstrap.com/components/#glyphicons
[panels]: http://getbootstrap.com/components/#panels
[custom linked list group]: http://getbootstrap.com/components/#list-group-custom-content
[grid system]: http://getbootstrap.com/css/#grid
[responsive utilities]: http://getbootstrap.com/css/#responsive-utilities
[Official Bootstrap Blog]: http://blog.getbootstrap.com/
[Twitter Bootstrap Tutorial from Tutorial Republic]: http://www.tutorialrepublic.com/twitter-bootstrap-tutorial/
[The Bootstrap Playground]: http://www.bootply.com/
[W3C Recommendation Mobile Web Application Best Practices]: http://www.w3.org/TR/mwabp/
[W3C Candidate Recommendation for media queries]: http://www.w3.org/TR/css3-mediaqueries/

<!-- Images -->
[DeployClickPublish]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/deploy-to-azure-website-1.png
[DeployClickWebSites]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/deploy-to-azure-website-2.png
[DeploySignIn]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/deploy-to-azure-website-3.png
[DeployUsername]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/deploy-to-azure-website-4.png
[DeployPassword]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/deploy-to-azure-website-5.png
[DeployNewWebsite]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/deploy-to-azure-website-6.png
[DeploySiteSettings]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/deploy-to-azure-website-7.png
[DeployPublishSite]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/deploy-to-azure-website-8.png
[MobileHomePage]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/mobile-home-page.png
[FixedSessionsByTag]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/SessionsByTag-ASP.NET-Fixed.png
[AllTags]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/AllTags.png
[SessionsByTagASP.NET]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/SessionsByTag-ASP.NET.png
[SessionsByTagASP.NETNoBootstrap]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/SessionsByTag-ASP.NET-NoBootstrap.png
[AllTagsMobile_LayoutMobile]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/AllTagsMobile-_LayoutMobile.png
[AllTagsMobile_LayoutMobileDesktop]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/AllTagsMobile-_LayoutMobile-Desktop.png
[ResolveDefaultDisplayMode]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/Resolve-DefaultDisplayMode.png
[AllTagsIPhone_LayoutIPhone]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/AllTagsIPhone-_LayoutIPhone.png
[AllSpeakers_LayoutMobile]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/AllSpeakers-_LayoutMobile.png
[AllSpeakers_LayoutMobileOverridden]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/AllSpeakers-_LayoutMobile-Overridden.png
[AllSpeakersFixed]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/AllSpeakers-Fixed.png
[AllSpeakersFixedDesktop]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/AllSpeakers-Fixed-Desktop.png
[AllSpeakersFixedSearchBySC]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/AllSpeakers-Fixed-SearchBySC.png
[AllTagsFixedDesktop]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/AllTags-Fixed-Desktop.png 
[AllTagsFixed]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/AllTags-Fixed.png
[AllDatesFixed]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/AllDates-Fixed.png
[AllDatesFixed2]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/AllDates-Fixed2.png
[AllDatesFixed2Desktop]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/AllDates-Fixed2-Desktop.png
[AllTagsFixedSearchByASP]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/AllTags-Fixed-SearchByASP.png
[SessionsTableTagASP.NET]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/SessionsTable-Tag-ASP.NET.png
[SessionsTableFixedTagASP.NETDesktop]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/SessionsTable-Fixed-Tag-ASP.NET-Desktop.png
[SessionByCode3-644]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/SessionByCode-3-644.png
[SessionByCodeFixed3-644]: ./media/web-sites-dotnet-deploy-aspnet-mvc-mobile-app/SessionByCode-Fixed-3-644.png
