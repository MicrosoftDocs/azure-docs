<properties 
   pageTitle="Azure Mobile Engagement User Interface" 
   description="User Interface Overview for the User Interface of Azure Mobile Engagement" 
   services="mobile-engagement" 
   documentationCenter="mobile" 
   authors="v-micada" 
   manager="mattgre" 
   editor=""/>

<tags
   ms.service="mobile-engagement"
   ms.devlang="Java"
   ms.topic="article"
   ms.tgt_pltfrm="mobile"
   ms.workload="required" 
   ms.date="02/17/2015"
   ms.author="v-micada"/>

# Azure Mobile Engagement - User Interface

<div class="dev-center-tutorial-selector sublanding">
<a href="#Navigation" title="Navigation">Navigation</a>
<a href="#Home" title="Home">Home</a>
<a href="#MyAccount" title="My Account">My Account</a>
<a href="#Analytics" title="Analytics">Analytics</a>
<a href="#Monitor" title="Monitor">Monitor</a>
<a href="#Reach" title="Reach">Reach</a>
<a href="#Segments" title="Segments">Segments</a>
<a href="#Dashboard" title="Dashboard">Dashboard</a>
<a href="#Settings" title="Settings">Settings</a>
</div>

## Introduction
 
Once you have integrated the Azure Mobile Engagement [SDK][Link 5] into your application and you understand the basic Azure Mobile Engagement [Concepts][Link 6], there are two ways to interact with Azure Mobile Engagement for your app: standard users can use the [User Interface][Link 1], and developer users can use the HTTP REST based [APIs][Link 4]. For a walkthrough of common activities, please see the [How To Guides][Link 3]. If you have any difficulty, please consult the Azure Mobile Engagement [Troubleshooting Guides][Link 2].

## <a name="Navigation">Navigation</a>
 
The UI Frontend Portal at https://YourApp.portal.mobileengagementwindows.net/ contains the following navigation elements: a header, a footer, a sidebar, cookie crumb navigation, and an app-specific ribbon.
 
![Navigation1][1] 

### Header:
- **Azure Mobile Engagement (Logo)** – The Home page of your Azure Mobile Engagement App
- **Your Name** – My Account Profile
- **Documentation** – Azure Mobile Engagement Documentation
- **Sign Out** Sign Out of Azure Mobile Engagement
 
### Footer:
- **Terms of Service** [http://azure.microsoft.com/support/legal/](http://azure.microsoft.com/support/legal/)
- **Privacy & Cookies** [http://www.microsoft.com/privacystatement/en-us/OnlineServices/Default.aspx](http://www.microsoft.com/privacystatement/en-us/OnlineServices/Default.aspx)
 
### Cookie Crumb:
- Navigate quickly to the previous pages that lead to your current location.
 
### Ribbon:
- Analytics 
- Monitor
- Reach
- Segments
- Dashboard
    - + (Add a Dashboard)
- Settings 

**See also:** 

- [UI Documentation – Ribbon Items][Link 1] 

## <a name="Home">Home</a>
 
The Home section of the UI contains the list of all of your applications in My Applications, as well as the ability to grant others permissions to your applications. Anyone can access the home page of the UI by creating an account, but you need to grant others users permission in order for them to have access to your custom applications in My Projects.
 
### My applications:
 
![Home1][2]

This provides a quick overview of your applications and allows you to select which application you would like to open to view the detailed ribbon options. You can click the name of your application to return to the most recently visited ribbon location in your application, or click the gear icon to go directly to the "Settings" page of your application. You can search, filter, or sort the information displayed on the applications tables. You can also drag and drop the column headers to change the order. 
 
The overview of your applications includes:

- Total users (Total number of users)
- New users Trend (Evolution of new users over the last two weeks)
- Active users (Number of active users over the last 30 days)
- Active users trend (Evolution of active users over the last two weeks)
 
You can also see a chart comparing your applications.

- Show comparison chart (Can be used to show the application data in chart form)
- Check boxes (add/remove this application to/from the comparison chart)
 
![Home2][3]

### My projects:
 
![Home5][6]

You can use projects to group your applications and give permissions to your applications. The New projects button allows you to create a new project by only entering a "name" and a "description" of your new project. Once a project is created, you can click on the project name to edit the name and description of your product and to select all the applications you want to see in this project. You can also delete this project, which will not destroy the applications it references. Nevertheless, you will lose access to all applications you do not own and that are not accessible from another project. So, be careful! 
You can also invite a user to your project based on their e-mail address. Users need to have already created an account in Azure Mobile Engagement before you can grant them permissions. 

**Roles include:** 

- Viewer: A Viewer is a User who can only view the applications associated to a Project. A Viewer can access analytics and monitor data and look at Reach results. A Viewer cannot change any information, nor manage Applications or Users. A Viewer cannot create or change Reach campaign status.
- Developer: A Developer is a User who can do everything a Viewer can do as well as manage Applications. A Developer can enable and disable applications, change applications' information (like package and signature), and create Reach campaigns. A Developer cannot manage Users. 
- Administrator: An Administrator is a User who can do everything a Developer can do, as well as manage Users. An Administrator can invite users to join a project, can change user roles, and can change project's information. Application level permissions can also be set in “settings”.
 
**See also:** 

-  [UI Documentation - Settings][Link 1]

## <a name="MyAccount">My Account</a>
 
The My Account section of the UI is where you can view and change the settings associated with your account, including your Profile settings and test Device IDs. These settings contain items that can also be accessed via the Device API.
 
![MyAccount1][7]  

### Profile:
You can view or change any of your account settings: Password, First Name, Last Name, Organization, Phone Number, Time Zone, or E-mail opt-in or opt-out of e-mail updates. You can also give another user permission to use your application based on their e-mail address from “home”.

**See also:** 

-  [UI Documentation - Home][Link 1]

![MyAccount2][8]  

### Devices:
You can view, add, or remove test Device ID's of the test devices that you can use to test your reach or push campaigns. Contextual instructions for how to find the Device ID of devices for each platform (iOS, Android, Windows Phone, etc.) are displayed when you click "New Device". 
 
![MyAccount3][9]  
 
To use Push API or Device API, you need to know your users' unique device identifier (the deviceid parameter). There is several ways to retrieve it:
 
1. From your backend, you can use the "Get" feature of the Device API to get the full list of device identifiers.
2. From your app, you can use the SDK to get it. (On Android, call the getDeviceID() function of the Agent class, and on iOS, read the deviceid property of the Agent class.)
3. From a Reach announcement, if the action URL associated with the announcement contains the {deviceid} pattern, it will be automatically replaced by the identifier of the device triggering the action.
http://<example>.com/registeruser?deviceid={deviceid}&otherparam=myparamdata 
will be replaced by:
http://<example>.com/registeruser?deviceid=XXXXXXXXXXXXXXXX&otherparam=myparamdata 
4. From a Reach web announcement, if the HTML code of the announcement contains the {deviceid} pattern, it will be automatically replaced by the identifier of the device displaying the web announcement.
Here is my device identifier: {deviceid}
will be replaced by:
Here is my device identifier: XXXXXXXXXXXXXXXX
5.  Open your application on your device and perform an Event in your app which has been tagged.
From "UI - your app - Monitor - Events - Details", find the Event you performed in the list.
Click to this event in the Monitor.
You should find out your Device ID in the list of the devices that have performed this event.
Then, you can copy this Device ID and register it in the "UI - My Account - Devices - New Device - Select your device platform".
>(Be aware that when IDFA is disabled for iOS, the Device ID may change over the time if you uninstall and reinstall your app.)

## <a name="Analytics">Analytics</a>
 
The Analytics section of the UI provides aggregated information about your application based on historic data that is updated every 24 hours. This information is displayed on different dashboards, composed of line/bar/pie charts, grids, and maps. The data can also be downloaded as .csv files. Most of this same information is available in real time in the Monitor section of the UI, and it can also be accessed from the Analytics API. The “Glossary” in “Concepts” has the definitions of terms and abbreviations in Analytics and Monitoring, such as the following: Active User, New user, Retained User, Session, User Path Graph, Users Map, Tracking URLs, Trends, Activity, Event, Job, Error, Extra Info, Crash, and App-info.

**See also:** 

-  [Concepts - Glossary][Link 6]

### Standard and Custom Analytics:
Azure Mobile Engagement provides a set of basic, standard analytic information about your applications that can be graphed as soon as you integrate your App with the SDK. Azure Mobile Engagement also provides the ability to gather additional custom analytics information you want about your end-users' behavior by creating a tag plan of custom "app info tags", created from “Settings” so that Azure Mobile Engagement can collect this additional data for you.

**See also:** 
-  [UI Documentation - Settings][Link 1]
 
### Analytics Header:
- Item Name: Labels the item being counted
- Show Help: Displays contextual information about this section
- Versions: Allows you to show different analytics information about each version of your application or to show information for all versions. (Note: Filtering your analytics data in the UI will show all examples of this type regardless of the version of your app. e.g. "Crashes" filtered by name will show from version 1 and version 2 of your app.)
- Time Period: Last 7 days, Last 30 days, All Time, Custom
- Rate: Per hour, day, week, month
- View: Line Chart, Grid, Send to Dashboard, Download CSV file
 
![Analytics1][10] 

### Analytics:
- Dashboard: Shows general information about your new and actives users and their trends.
- Users: Users are identified by their device identifier: this identifier is unique for each device (one new user is actually one new device). A user is considered as new on a given time interval if he has performed his first session during this time interval. A user is considered as retained if he has performed at least one session during the last 7 days. Active Users are users that made at least one session during a given period. You can sort by, monthly, weekly, daily, or hourly time periods. All of the charts look similar but they allow you to filter by different features, such as the version of your application, and then to sort by a period of time. The standard information gathered by integrating the SDK includes the following: Active users, new user, number of sessions, length of each session, technical information about the country, locals, location, language carrier, devices, firmware, network (WIFI), versions of the App and SDK, used by customers. This information can be viewed in real time from the monitor section. 
- Tracking by source displays the number of new users who have downloaded the application as a result of a given promotion campaign. Users are identified by their device identifier: this identifier is unique for each device (one new user is actually one new device). A user is considered as new on a given time interval if he has performed his first session during this time interval.
- Tracking by store displays the number of new users who have downloaded the application from a given store. Users are identified by their device identifier: this identifier is unique for each device (one new user is actually one new device). A user is considered as new on a given time interval if he has performed his first session during this time interval.

> Note: The time period is based on the date from the users' device settings, so a user whose phone has the date incorrectly set could show up in the wrong time period.

- Retention:   A user is considered as retained on a given time interval if he has performed his first session during this time interval. You can change the time intervals during which retained users (and new users) are counted to hours, days, weeks or months. The user retention analytics is built on top of cohorts. A cohort is the set of all the new users detected for a given period (i.e. the set of users performing their first session during this period). We use cohorts of 1-day, 2-day, 4-day, 7-day or 1-month. Given a cohort, every 1-day, 2-day, 4-day, 7-day or 1-month, Azure Mobile Engagement computes the set of all users who belong to the cohort and are still active (i.e., the set of users who performed at least one session during the period). This set of users is called a cohort version. (Azure Mobile Engagement can show you how many of your users are still using your app, but only the platform specific store can tell you how many of your users uninstalled your app, for example, GooglePlay, iTunes, Windows Store, etc.) 
- Sessions: A session is one use of the application by a user. Sessions are generated from the sequence of activities performed by users (an activity is usually associated to the usage of one screen of the application, but this can vary depending on the way the SDK has been integrated in the application). A user can only perform one activity at a time: a session starts as soon as the user starts his first activity and stops when he finishes his last activity. If a user stays more than a few seconds without performing any activity, this sequence of activities is split into two distinct sessions.
- Activities: are the names of each screen in your application and the length of time users spend on each screen. Activities are a custom analytic option that will correspond to the "app info" tags you have setup for your own app:
- User Path:  shows how your users navigate through your application's activities (screens). You can move the slider to adjust the level of details. Blue nodes represent your application's activities. Their size is proportional to the time users spent in it. White nodes represent session start and stop. Red nodes represent crashes. Links represent transitions between your application's activities (or between activities and crashes). Click on a node or a link to display a tooltip with more information about your data: the time spent in a particular screen, the count of transitions, and the percentage of transitions from the source activity to the destination activity (A ---60% ---> B means that users being on activity A goes to activity B 60% of the time). You can reorganize the graph as you want to clarify it, its position is saved every time you make a change. You can show or hide the crashes to lighten the graph.
- Events: are specific actions taken by a user in the application. The distribution of events is show as the count of events per user per session.  An event represents an instant action, for example a click on a button or the reception of a notification (the meaning of events depends on how the SDK has been integrated in the application). An event can occur during a session or a job or can be stand alone.
- Jobs: are similar to events except they focus on the length of the action. For example, Jobs could tell you technical information about how long it takes content to load or a call to web service. It could also show how long it takes a user to fill out a form, create an account, or make a purchase. A job represents the duration of a task, for example the duration of a download task or the time a banner is displayed on the screen (the meaning of jobs depends on how the SDK has been integrated in the application). Jobs are usually associated with background tasks that are performed outside of the scope of a session (i.e., without any user activity).
- Technicals: are technical information about the devices of the users of your app that you can track such as the Locale, Carrier, Network, Device, Firmware, and Screen size of the users' devices, and the Version of your App and the SDK version used in your app.
- Errors: are information about technical errors inside the application that do not cause the application to crash. An error represents an instant issue, for example a network failure or a bad manipulation (the meaning of events depends on how the SDK has been integrated in the application). An error can occur during a session or a job or can be standalone.
- Crashes: are information about errors that cause your application to crash. A crash is an unexpected condition where the application stops performing its expected functions and must be stopped. A crash is usually due to a bug in the application.
 
![Analytics2][11] 

### Accessing the Retention Overview
 
![Analytics3][12] 

The retention overview is broken down in the middle into several cards, each showing the overview for a certain retention period. The 2-day retention period is seen in the example. The other cards show the 4-day and 7 day retention periods. 

### Understanding the Retention Overview cards
 
![Analytics4][13] 

Each card is composed of 3 main parts:

1. 1: The cohort and the period considered
2. 2-4: The retention for the current period
3. 5: A Sparkline of the history

**Here is detailed information about each element:**

1.    Cohort and period: This headline gives the type of cohort. Here "2 day period" means that we will look at the behavior of users over 2 days. Users that arrived over a period of 2 days - did they connect in the following blocks of 2 days? The example above considers the activity of users between the 21st and 22nd of November.
2.    This gives the retention rate over the 21 and 22 of November for the users arriving in 19 and 20 of November. Here we had 1 active user between the 21st and 22nd, over the 3 that were new users between the 19th and 20th.
3.    This visual indicator gives the same information as above represented graphically (the third of the circle is from the 33% number). The color gives an additional information: green indicates this number is growing from the previous calculation. Yellow means stable and red means decreasing.
4.    This indicates the values used for the calculation.
5.    This is a Sparkline of the history of the retention values. It allows you to see the values in the past to have a broad view of how it evolved.

## <a name="Monitor">Monitor</a>
 
The Monitor section of the UI provides real-time analytics information and allows you to set alerts when thresholds are reached for most of the same information that is available historically in the "Analytics" section of the UI. The “Glossary” in “Concepts” has the definitions of terms and abbreviations in Analytics and Monitoring, such as the following: Active User, New user, Retained User, Session, User Path Graph, Users Map, Tracking URLs, Trends, Activity, Event, Job, Error, Extra Info, Crash, and App-info.

**See also:** 

-  [Concepts - Glossary][Link 6]

### Monitor - Sessions, Jobs, Events, Errors, and Crashes:
You can see how many users are currently in session and on specific screens or doing specific actions. You can view user activity divided by Sessions, Jobs, Events, Errors, and Crashes. You can see the current information and show the information from the last hour, day, or week. You can see all of the information in each category or sort by the specific Session, Job, Event, Error, and Crash. Live monitoring is helpful to use during events, such as a Push campaign, to see if there is an uptick in action right after you send your Push notification. 
 
![Monitor1][14]  

### Troubleshooting with Monitor - Events - Details:
Generating an event in your application from your test device and finding it in Monitor - Events - Details is one of the easiest ways to find your Device ID for your test device and to confirm that Azure Mobile Engagement integration of Analytics, Monitoring, and Segments is working from your application. Once you have the Device ID of your test device, you can add it to your test devices in “My Account - Devices”. If you can't generate an event, make sure that Azure Mobile Engagement is correctly integrated in your Android/iOS/Web/Windows/Windows Phone app with the SDK.

**See also:** 

-  [SDK Documentation][Link 5]

![Monitor2][15]  

### Troubleshooting with Monitor - Crashes - Details:
You can review crash information about your app from Monitor - Crashes - Details to help determine why your app is crashing. You should also look up known issues with each version of the SDK in the release notes for each version of the SDK for Android/iOS/Web/Windows/Windows Phone. 

**See also:** 

-  [SDK Documentation - Release notes][Link 5]

![Monitor3][16] 

### Monitor - Alerts:
You can also specify conditions for Alerts that will be automatically sent to you via e-mail or instant message (any XMPP compliant services like Google's GTalk or Apple's iChat are supported). Alerts are based on a pre-defined detection threshold greater than (>) or less than (<) a specific number of Sessions, Jobs, Events, Errors, or Crashes per second, minute, or hour. Alerts can monitor all activities of a given type or just monitor a specific Job, Event, or Error activity. You can also specify a Minimum Detection Rate, which is the minimum amount of time that will separate two notifications for the same alert to make sure that when your alert is triggered, you will never receive more than 1 notification every X minutes.
 
![Monitor4][17]

## <a name="Reach">Reach</a>
 
The Reach section of the UI is the Push campaign management tool where you can create/edit/activate/finish/monitor and get statistics on Push notification campaigns and features that can also be accessed via the Reach API (and some elements of the low level Push API). Remember that whether you are using the APIs or the UI, you will need to integrated both Azure Mobile Engagement and Reach into your application for each platform with the SDK before you can use Reach campaigns. 

**See also:** 

-  [API Documentation - Reach API][Link 4], [API Documentation - Push API][Link 4]
 
### Four types of Push notifications:
1.    Announcements - allow you to send advertising messages to users that redirect them to another location inside your app or to send them to a webpage or store outside of your app. 
2.    Polls - allow you to gather information from end-users by asking them questions.
3.    Data Pushes - allow you to send a binary or base64 data file. The information contained in a data push is sent to your application to modify your users' current experience in your app. Your application needs to be able to process the data in a data push.
4.    Tiles (Windows Phone only) - allow you to use the Microsoft Push Notification Service (MPNS) to send Native Windows Push containing XML Data (Supported since SDK version 0.9.0. The final payload for tiles cannot exceed 32 kilobytes.)

**See also:** 

-  [Concepts - Glossary][Link 6]

### Three categories of Real time statistics shown for each campaign: 
1.    Pushed - how many pushes were sent based on the criteria specified in the campaign. 
2.    Replied - how many users reacted to the notification by either opening it from outside of the app or closing it in app. 
3.    Actioned - how many users clicked on the link in the notification to be redirected to a new location in the app, to a store, or to a web browser. 

> Note: More verbose campaign statistics are available from the via Reach API Stats

**See also:** 

-  [Concepts - Glossary][Link 6], [API Documentation - Reach API - Stats][Link 4]


### Campaign Details:
You can edit, clone, delete, or activate campaigns that have not been activated yet by hovering over their names or you can click to open them. You can clone campaigns that have already been activated by hovering over their names or you can click to open them. However, you can't change a campaign once it has been activated.
 
![Reach1][18]

### Reach Feedback:
You can switch from the details to the statistics view of an open campaign that has already been activated and switch from the simple to advanced view of the statistics to view more detailed information (depending on your permissions). You can also use the reach feedback information from a previous campaign as targeting criteria in a new campaign. Reach Feedback statistics can also be gathered with “Stats” from the Reach API. You can also customize the audience of your Push campaigns based on previous campaigns.


**See also:** 

-  [UI Documentation - Reach - New Push Campaign]( http://go.microsoft.com/fwlink/?LinkID=525552), [API Documentation - Reach API - Stats][Link 4]
![Reach2][19]

## <a name="ReachCampaign">Reach - New Push Campaign:</a>
 
You can use the Reach section of the UI to create a new Push campaign with a complex formula by providing all the information you need to send a push notification. The options of a Push campaign vary slightly depending on the four campaign types: Announcements, Polls, Data Pushes, and Tiles (Windows Phone only).

**Option Applies to:**

- Languages:    All (Announcements, Polls, Data Pushes, Tiles)
- Campaign:    All (Announcements, Polls, Data Pushes, Tiles)
- Notification:     Announcements, Polls
- Content:    Unique for each campaign type
- Audience:     All (Announcements, Polls, Data Pushes, Tiles)
- Time frame:     Announcements, Polls, Tiles
- Test:    All (Announcements, Polls, Data Pushes, Tiles)
 
![Reach-Campaign1][20]

### Languages:
You can use the Languages drop-down menu to send a different version of your Push to devices set to use different languages. By default, all devices will receive the same Push regardless of what language they are set to use. Users with their device set to a different language will receive the Default Language version of the Push. Many of the push campaign options allow you to specify alternate content for each of the additional languages you select. 
 
![Reach-Campaign2][21]

**Language differences apply to:**

- Languages:    Unique languages may be selected in addition to the default language
- Campaign:    Same for all languages
- Notification:    Unique for each language in addition to the default language
- Content:    Unique for each language in addition to the default language
- Audience:     May be filtered by a separate language criterion
- Time frame:     Same for all languages
- Test:    May be sent to each language at a time
 
**Supported Languages:**

- Arabic (ar) 
- Bulgarian (bg) 
- Catalan (ca) 
- Chinese (zh) 
- Croatian (hr) 
- Czech (cs) 
- Danish (da) 
- Dutch (nl) 
- English (en) 
- Finnish (fi) 
- French (fr) 
- German (de) 
- Greek (el) 
- Hebrew (he) 
- Hindi (hi) 
- Hungarian (hu) 
- Indonesian (id) 
- Italian (it) 
- Japanese (ja) 
- Korean (ko) 
- Latvian (lv) 
- Lithuanian (lt) 
- Malay (macrolanguage) (ms) 
- Norwegian Bokmål (nb) 
- Polish (pl) 
- Portuguese (pt) 
- Romanian (ro) 
- Russian (ru) 
- Serbian (sr) 
- Slovak (sk) 
- Slovenian (sl) 
- Spanish (es) 
- Swedish (sv) 
- Tagalog (tl) 
- Thai (th) 
- Turkish (tr) 
- Ukrainian (uk) 
- Vietnamese (vi) 
 
### Campaign:
You can use the Campaign section to set the name and category of your campaign as well as if you plan to ignore the audience section of a Push campaign and send this campaign via the Reach API (and some elements with the low level Push API) instead. Categories can be used with a custom notification template to control in-app notifications based on predefined settings. You can get a list of your existing “Categories” via the Reach API.

> Warning: If you use the "Ignore Audience, push will be sent to users via the API" option in the "Campaign" section of a Reach campaign, the campaign will NOT automatically send, you will need to send it manually via the Reach API.
 
![Reach-Campaign3][22]
 
**Option Applies to:**

- Name:    All
- Category:    Announcements, Polls
- Ignore Audience, push will be sent to users via the API:    All
 
### Notification:
You can use the Notification section to set basic settings for your push, including the following: The title of the Push, the message, an in-app image or if it is dismissible. Many notification settings are specific to the platform of your device. You can select whether your push will be sent "in app" or "out of app" or both. (Remember that users can "opt-in" or "opt-out" of "out of app" Pushes at the Operating System level on their devices and Azure Mobile Engagement will not be able to override this setting. Also remember that the Reach API handles "in app" and "out of app" Pushes. The Push API can be used to handle "out of app" pushes too.) Pushes can be customized with pictures or HTML content, including deep links for linking outside of your App or to another location in your App. (Android SDK 2.1.0 or later intent categories are required.) You can change the icon or iOS badge, and send either text or web content (a popup with html content, URL link to another location either inside or outside of the app). You can also make Android devices ring or vibrate with the Push. (Remember that you will need the correct SDK permissions in your Android manifest file to ring or vibrate a device.) There is currently no industry standard for Android "Big Picture" sizes, since screen sizes are different on every device, but 400x100 pictures work on almost any screen size.

### Delivery Types:
-    Out of app only: the notification will be delivered when the user does not use the application.
- The out of app only notification requires a certificate from Apple or Google (APNS or GCM certificate).
- In-app only: The notification appears only when the application is running.
- The notification uses the Capptain delivery system to reach the user. You can fully customize the visual layout/display of your push.
- Anytime: This option ensures that you send a notification whether the application is running or not.

 
![Reach-Campaign4][23]

**Option Applies to:**

- Notification:     Announcements, Polls
 
### Content:
You can use the Content section to modify the content of your Announcements, Polls, Data Pushes, and Tiles (Windows Phone only). The Content setting of Push campaigns is specific to the type of campaign. 

**See also:**

- [UI Documentation - Reach - Push Content][Link 1]
 
![Reach-Campaign5][24]

### Audience:
You can use the Audience section to define a standard list of items to limit your campaign or limits your campaign based on customized criteria. The standard set of options to Limit your Audience allows you to push to either new or old users or native push users only. You can also set a quota to limit the number of users who receive the push. You can manually Edit the expression for how your campaign is filtered to include one or more criterion to target users. You can manually type an audience expression. Such an expression must explicitly define the relation between criteria. A criterion is described by an identifier that must start with a capital letter and cannot contain spaces. The relation between the criteria can be described using 'and', 'or', 'not' operators as well as '(', ')'. Example: "Criterion1 or (Criterion1 and not Criterion2)".

> Note: With a large audience included in campaigns, the server side targeting scan can be slow, especially if you attempt to start multiple campaigns at the same time.

- If possible, only start one campaign at a time.
- At the most, only start four campaigns at a time.
- Push only to your active users (checkbox "Engage only users who can be reached using Native Push" and "Engage only active users") so that only your users who still have the app installed and use it will need to be scanned.
Once your audience is defined, you can use the simulate button to find out how many users will receive this Push. This will compute the number of known users potentially targeted by this audience (this is an estimate based on a random sample of users). Be aware that users who have uninstalled the application are also part of this audience, but they cannot be reached.

**See also:**

- [UI Documentation - Reach - New Push Criterion][Link 1]

![Reach-Campaign6][25]

### Edit expression
 
![Reach-Campaign7][26]
 
**Limit your audience option applies to:**

- Engage only a subset of users:    All (Announcements, Polls, Data Pushes, Tiles)
- Engage only old users:    All (Announcements, Polls, Data Pushes, Tiles)
- Engage only new users:    All (Announcements, Polls, Data Pushes, Tiles)
- Engage only idle users:    Announcements, Polls, Tiles
- Engage only active users:    All (Announcements, Polls, Data Pushes, Tiles)
- Engage only users who can be reached using Native Push:     Announcements, Polls
 
### Time Frame:
You can use the Time Frame section to set when the push will be sent or you can leave the time frame blank to start the campaign immediately. Remember that using the end-users' time zone may start the campaign a day earlier than you expect for your end-users in Asia and send small batches of pushes at a time until all time zones in the world match the time frame set for your campaign. Using the end users' time zone can also cause delays in campaigns since it has to request the time from the phone before starting the push.

> Note: Campaigns without an end date can cache pushes locally and still display them after you manually complete campaigns. To avoid this behavior, specific an end time for campaigns.

**See also:**

- [How Tos – Scheduling][Link 3] 
 
![Reach-Campaign8][27]

**Settings Apply to:**

- Time frame:     Announcements, Polls, Tiles
 
### Test:
You can use the Test section to send this push to your own test device before saving the campaign. If you have configured any custom languages for this campaign, you can test the push in each language. You can setup a test device from “My Account”.
> Note: No server-side data is logged when you use the button to "test" pushes; data is only logged for real push campaigns.

**See also:**

- [UI Documentation - My Account][Link 1]
 
![Reach-Campaign9][28]

## <a name="ReachCriterion">Reach - New Push Criterion (for targeting Audience)</a>

Targeting your audience by specific criteria with the "New Criteria" button is one of the most powerful concepts in Azure Mobile Engagement, and it helps you send relevant push notifications that customers will respond to instead of spamming everyone. You can limit your audience based on standard criteria and simulate pushes to determine how many people will receive the notification.

**See also:**

- [UI Documentation - Reach - New Push Campaign][Link 1]

### The audience criteria can include:

- **Technicals: ** You can target based on the same technical information you can see in the Analytics and Monitor sections. **See also:** [UI Documentation - Analytics][Link 1],  [UI Documentation - Monitor][Link 1]
- **Location:** Applications that use "Real time location reporting" with Geo-Fencing can use Geo-Location as a criteria to target an audience from the GPS location. "Lazy Area Location Reporting" call also be used to target an audience from the cell phone location ("Real time location reporting" and "Lazy Area Location Reporting" must be activated from the SDK). **See also:** [SDK Documentation - iOS -  Integration][Link 5], [SDK Documentation - Android -  Integration][Link 5]
- **Reach Feedback:** You can target your audience based on their feedback from previous reach notifications through reach feedback from Announcements, Polls, and Data Pushes. This enables you to better target your audience after two or three reach campaigns than you could the first time. It can also be used to filter out users who already received a notification with similar content, by setting a campaign to NOT be sent to users who already received a specific previous campaign. You can even exclude users who are included a specific campaign that is still active from receiving new Pushes. **See also:** [UI Documentation -  Reach - Push Content][Link 1]
- **Install Tracking:** You can track information based on where your users installed your App. **See also:** [UI Documentation -  Settings][Link 1]
- **User Profile:** You can target based on standard user information and you can target based on the custom app info that you have created. This includes users who are currently logged in and users that have answered specific questions you have asked them to set in the app itself instead of just how they have responded to previous campaigns. All of your App Info's defined for your app show up on this list.
- Segments: You can also target based on segments that you have created based on specific user behavior containing multiple criteria. All of your segments defined for your app show up on this list. **See also:** [UI Documentation -  Segments][Link 1]
- **App Info:** Custom App Info Tags can be created from “Settings” to track user behavior. **See also:** [UI Documentation -  Settings][Link 1]
### Example: 
If you want to push an announcements only to the sub-set of your users that have performed an in-app purchase action.

1. Go to your application settings page, select the "App info" menu and select "New app ino"
2. Register a new Boolean app info called "inAppPurchase"
3. Make your application set this app info to "true" when the user successfully perform an in-app purchase (by using the sendAppInfo("inAppPurchase", ...) function)
4. If you don't want to do this from your application, you can do it from your backend by using the device API)
5. Then, you just need to create your announcement, with a criterion limiting your audience to users having "inAppPurchase" set to "true")
 
> Note: Targeting based on criteria other than app info tags requires Azure Mobile Engagement to gather information from your users' devices before the push is sent and so can cause a delay. Complex push configuration options (like updating badges) can also delay pushes. Using a "one shot" campaign from the Push API is the absolute fastest push method in Azure Mobile Engagement. Using only app info tags as push criteria for a Reach campaign (either from the Reach API or the UI) is the next fastest method since app info tags are stored on the server side. Using other targeting criteria for a push campaign is the most flexible but slowest push method, because Azure Mobile Engagement has to query the devices in order to send the campaign.
 
![Reach-Criterion1][29] 

**Criterion Options Apply to:**

- **Technicals**     
- Firmware name:    Firmware name
- Firmware version:    Firmware version
- Device model:    Device model
- Device manufacturer:    Device manufacturer
- Application version:    Application version
- Carrier name:    Carrier name, undefined
- Carrier country:    Carrier country, undefined
- Network type:    Network type
- Locale:    Locale
- Screen size:    Screen size
- **Location**      
- Last known area:    Country, Region, Locality
- Real time geo-fencing:    List of POIs (Name, Actions), Circular POI (Name, Latitude, Longitude, Radius in meters)
- **Reach feedback**     
- Announcement feedback:    Announcement, feedback
- Poll feedback:    Poll, feedback
- Poll answer feedback:    Poll answer feedback, question, choice
- Data Push feedback:    Data Push, feedback
- **Install Tracking**     
- Store:    Store, Undefined
- Source:    Source, Undefined
- **User profile**     
- Gender:    male or female, undefined
- Birth date:    operator, date, undefined
- Opt-in:    true or false, undefined
- **App Info**      
- String:    String, undefined
- Date:    operator, date, undefined
- Integer:    operator, number, undefined
- Boolean:    true or false, undefined
- **Segment**    
- Name of Segments (from dropdown list), Exclusion (target users that are not a part of this segment).

## <a name="ReachContent">Reach - Push Content (for each campaign type)</a>
 
You can use the Content section of a new reach campaign to modify the content of your Announcements, Polls, Data Pushes, and Tiles (Windows Phone only). The content setting of Push campaigns is specific to the type of campaign. 
 
### Content types
- Announcements
- Polls
- Data pushes
- Tiles (Windows Phone Only)
 
### Content of Announcements
 
 ![Reach-Content1][30] 

### Choose the type of your announcement:
-    Notification only: It is a simple standard notification. Meaning that if a user clicks on it, no additional view will appear, but only the action associated to it will occur.
-    Text announcement: It is a notification that engages the user to have a look at a text view.
-    Web announcement: It is a notification that engages the user to have a look at a web view.

**See also:**

- [How Tos - Announcements][Link 3] 

**About Web View Announcements:**

Occurrences of the pattern "{deviceid}" in the HTML code or JavaScript code you provide here will be automatically replaced by the identifier of the device displaying the announcement. This is an easy way to retrieve Azure Mobile Engagement device identifiers in an external web service hosted on your back office.
If you want to create a full screen web view (without the default Action and Exit buttons we provide) you can use the following functions from your web view announcement's JavaScript code: 

-    perform the announcement action: ReachContent.actionContent()
-    exit from the announcement: ReachContent.exitContent()
 
### Choose your Action:

**About Action URLs:**

Any URL that can be interpreted by a targeted device's operating system can be used as an action URL.
Any dedicated URL that your application might support (e.g. to make users jump to a particular screen) can also be used as an action URL.
Each occurrence of the {deviceid} pattern is automatically replaced by the identifier of the device performing the action. This can be used to easily retrieve Azure Mobile Engagement device identifiers via an external web service hosted on your back office.

- **Android + iOS actions**
    - Open a web page
    - http://[web-site-domain] 
    - Example:http://www.azure.com
    - Send an e-mail
    - mailto:[e-mail-recipient]?subject=[subject]&body=[message] 
    - Example:mailto:foo@example.com?subject=Greetings%20from%20Azure%20Mobile%20Engagement!&body=Good%20stuff!
    - Send a SMS
    - sms:[phone-number] 
    - Example:sms:2125551212
    - Dial a phone number
    - tel:[phone-number] 
    - Example:tel:2125551212
- **Android only actions**
    - Download an application on the Play Store
    - market://details?id=[app package] 
    - Example:market://details?id=com.microsoft.office.word
    - Start a geo-localized search
    - geo:0,0?q=[search query] 
    - Example:geo:0,0?q=starbucks,paris
- **iOS only actions**
    - Download an application on the App Store
    - http://itunes.apple.com/[country]/app/[app name]/id[app id]?mt=8 
    - Example:http://itunes.apple.com/fr/app/briquet-virtuel/id430154748?mt=8
    - Windows Actions
    - Open a web page
    - http://[web-site-domain] 
    - Example:http://www.azure.com
    - Send an e-mail
    - mailto:[e-mail-recipient]?subject=[subject]&body=[message] 
    - Example:mailto:foo@example.com?subject=Greetings%20from%20Azure%20Mobile%20Engagement!&body=Good%20stuff!
    - Send a SMS (Skype Store App required)
    - sms:[phone-number] 
    - Example:sms:2125551212
    - Dial a phone number (Skype Store App required)
    - tel:[phone-number] 
    - Example:tel:2125551212
    - Download an application on the Play Store
    - ms-windows-store:PDP?PFN=[app package ID] 
    - Example:ms-windows-store:PDP?PFN=4d91298a-07cb-40fb-aecc-4cb5615d53c1
    - Start a bingmaps search
    - bingmaps:?q=[search query] 
    - Example:bingmaps:?q=starbucks,paris
    - Use a custom scheme
    - [custom scheme]://[custom scheme params] 
    - Example:myCustomProtocol://myCustomParams
    - Use a package data (Store App for extension read required)
    - [folder][data].[extension] 
    - Example:myfolderdata.txt
 
### Build a Tracking URL:
-    See the “Settings” section of the <UI Documentation> for instruction on building a tracking URL that will allow users to download one of your other applications.
 
### Define the texts of your announcement
Fill in the title, content, and button texts of your announcement. 
You can target an audience of a future campaign based on the reach feedback of how users responded to this campaign. Audience targeting can be based on the feedback of whether this campaign was just pushed, replied, actioned, or exited.

**See also:**
- [UI Documentation - Reach - New Push Criterion][Link 1]

### Content of Polls
 
![Reach-Content2][31] 
Fill in the title, description, and button texts of your announcement. 
Then, add questions and choices for the answers to your questions.
You can target an audience of a future campaign based on the reach feedback of how users responded to this campaign. Audience targeting can be based on whether this campaign was just pushed, replied, actioned, or exited. Audience targeting can also be based on Poll answer feedback, where the question and answer choice are used as criteria.

**See also:**

- [UI Documentation - Reach - New Push Criterion][Link 1]
 
### Content of Data Pushes
 
![Reach-Content3][32] 

### Choose the type of your data
- Text
- Binary data
- Base64 data

### Define the content of your data
- If you selected to push text data, copy and paste the text into the "content" box.
- If you selected to push either binary or base64 data, use the "upload your file" button to upload your file.
- You can target an audience of a future campaign based on the reach feedback of how users responded to this campaign. Audience targeting can be based on whether this campaign was just pushed, replied, actioned, or exited.

**See also:**

- [UI Documentation - Reach - New Push Criterion][Link 1]

### Content of Tiles (Windows Phone only)

![Reach-Content4][33]

### Define the content of your tile
The tile payload is the text to be displayed in the tile of your app on Windows Phone devices.
A tile push is the Microsoft Push Notification Service (MPNS) version of a native push for Windows Phone. The tile push type is the only push type that does not have a response and so the audience of future campaigns can't be built on the results of a tile push campaign. 

**See also:**

- [API Documentation - Reach API - Native Push][Link 4]

## <a name="Dashboard">Dashboard</a>

The Dashboard section of the UI allows customers to create customized charts to maximize their time by providing the exact information they want instead of searching for it in the analytics section. A dashboard shows the trends of your application and the Active User Counts for the different versions of your application during a given time (hour/day/week/month/customized). The trends shown are based on the last 7 days.
 
### Dashboard:
- You can add charts to an empty dashboard by choosing the "Send to dashboard" action from the gear menu of any chart in the Analytics section of the UI that you'd like to see on a dashboard.
 
### +  (Add a Dashboard):
- You can use the "+" ribbon menu item to create a new dashboard that will show on the ribbon menu.
 
### Gear Menu:
- You can use the gear menu of a dashboard to Delete, Rename, Share, or Schedule (E-mail Reception) of your dashboard. You can use the Schedule option to define the schedule at which you would like to receive your custom dashboard by email. You can schedule to receive it daily, weekly, or monthly. You can choose the time of the day, and the day of the week, or day of the month when you would like to receive the e-mail. Your e-mail address and time zone are based on the settings you have configured in the My Account section of the UI.
 
 ![dashboard1][34]

## <a name="Segments">Segments</a>
 
The Segments section of the UI allows you to work on segmenting your users based on the different behavior and analytics that you can get from the application and can also access through the Segments API. Segments are first computed 24 hours after they are created and are recomputed every 24 hours based on the latest analytics information. Once a segment is calculated, it displays a "Day to day history" chart each day.

**See also:**

- [API Documentation - Segments API][Link 4]

You can create a segment based on up to 10 criteria on a specific period up to 60 days in the past from the analytics section. 
For example, you can create a segment based on the people who have viewed certain pages or searched for specific content within your app within the last 10 days. This information is available in the analytics section, so you can use it to create a segment, and then setup a push notification to target this subset of users to get them to come back to the application. 
 
> Note: Once a segment has been calculated it cannot be edited, it can only be cloned (copied) or destroyed (deleted). A segment can be cloned within the same application (with the same AppID), and it can also be cloned into other applications (with a different AppID). 
 
 ![segments1][35] 

### Segmentation Examples: 

 ![segments2][36]

Segments allow you to segment the end-users of your application.
Segmenting your users is an important marketing strategy. Azure Mobile Engagement allows you to get historic data and create custom segments. This powerful tool enables you to learn about your customers’ experience in your application. You can easily analyze your segments and use your segments as push targets.
A common use-case is that you want to send a push a notification to encourage your end-users to rate your application in the store. Rather than sending a notification to all your end-users, you can create a segment that would specify only users that have used your application every day for the last month and have had a great user experience. When you send fewer, highly targeted push notifications, you get a better ROI.
 
 ![segments3][37]

**Examples segments you can create based on the major Azure Mobile Engagement elements:**

- Event: create a segment that targets one specific event of the application that happened more than twice a week. 
- Session: create a segment of users that have used the application more than 5 time last week.
- Activity: create a segment of users that have used one page or content more or less than 10 time last month.
- Job: create a segment of users that have completed a job more than twice a day.
- Crash: create a segment of all the users that have had a crash more than 10 times last week. (You could push this segment with an apology or even a coupon!)
- Error: create a segment of all the users that have had an error more than 100 times last 3 days.
- App Info: create a segment that targets a custom App Info that happened during the last 25 days.
 
 ![segments4][38]

To use Segment in an optimal way, you must have done a customized integration of the SDK in your application with a tagging plan of "App Info" tags.
Then, go to the home page of the interface, select the application you want and click on the "Segments" section.

1. Select the "Segments" section.
2. Click on the "New segment" button to create a new segment.

**Example: Create simple segment based on "Session" information.**

Create a segment of all the end users that have used your app at least 50 times in the last week. From there, find only the end users that have spent at least 30 seconds in your app per session. This will show all the end users who have a positive experience in your app. Then, the segment created could be used to push a notification to these end users to ask them to rate your app in the store.
 
 ![segments5][39]

1. Give your segment a name in order to find it quickly in the "Segment" list.
2. Click on the "Create" button.
 
 ![segments6][40]

Select Session.
 
 ![segments7][41]

1. Select the period of "Last week".
2. Click next.
 
 ![segments8][42]

1. Select the Operator that is relevant among the list: =; ≥, ≤.
2. Enter the Count you want.
3. Select the Occurrence you want. 
4. Click next.
This example is set so that over the last week, match users that have made at least 50 sessions.
 
 ![segments9][43]

For the Session segmentation, you can choose the length per session as a criteria.

1. Select the Operator from the list.
2. Provide the Length per session.
3. Click Next.
In this example, it says that over all the session that have been segmented on the occurrence section, select only the users that have spent more than 30 seconds per session.
 
 ![segments10][44]

Name your criterion in order to retrieve it in the complete funnel and click on the "Finish" button.
 
 ![segments11][45]

When you have finished setting up your criterion, it will appear in the segment funnel.
Because a segment is based on analytics data, segment are computed once per day.
In this example, 47.7% of the total end-users matched the criterion. They should be the users who have had a good experience and will be likely to provide a higher rating if we push them a notification asking them to rate the app in the store.

## <a name="Settings">Settings</a>
 
The Settings menu options available for an application vary, depending on the platform of application and the permissions you have been granted for the application. Settings include the following: Details, Projects, Native Push, Push Speed, SDK, Tracking, App Info, Commercial Pressure, and Permissions. Only the App Info menu option of the Settings section of the UI contains elements that can be managed with the “Tag” feature of the Device API. The “Glossary” in “Concepts” includes the definitions of terms and abbreviations such as: APNS, GCM, IDFA, API, SDK, API Key, SDK Key, Application ID (App ID), AppStore ID, Tag Plan, User ID, Device ID, App Delegate, Stack Trace, and Deep linking.

**See also:** 

- [API Documentation - Device API][Link 4], [Concepts - Glossary][Link 6]
 
  ![settings1][46]

### Details:
Allows you to change the name and Description of your application 
View the owner of your application and your role Permissions. 
Analytics configuration: Allows you to view or change the day Weeks start on, the Retention time in day(s)
 
  ![settings2][47]
 
### Projects:
Allows you to select all projects you want your application to appear in. 
You can also search for a project and view the name, description, owner and your role permissions of any project your application is part of.

**See also:**

-    [UI Documentation – Home][Link 1]
 
  ![settings3][48]

### Native Push:
Allows you to register a new certificate or delete and existing certificate for use with native push. 
Native Push enables Azure Mobile Engagement to push to your application at any time, even when it is not running. 
After providing credentials or certificates for at least one Native Push service, you can select "Any time" when creating Reach Campaigns, and also use the "notifier" parameter in the PUSH API.

**See also:**

- [API documentation - Reach API] [Link 4],[API documentation - Push API] [Link 4], [UI Documentation - Reach - New Push Campaign][Link 1]
 
**Apple Push Notification Service (APNS)**

To enable Native Push using the Apple Push Notification Service you will need to register your certificate. You will need to specify the type of certificate as either development (DEV) or production (PROD). Then you will need upload your certificate and the password.

**See also:**

- [SDK Documentation - iOS - How to Prepare your Application for Apple Push notifications][Link 5]
 
![settings4][49]
 
**Windows Push Notification Service (WPNS)**

To enable Native Push using Windows Notification Service, you must provide your application's credentials. 
You will need your Package security identifier (SID) and your Secret key.
 
![settings5][50]
 
**Android Native Push with GCM or ADM**

**Google Cloud Messaging for Android (GCM)**

To enable Native Push using GCM, you need to follow the instructions at http://developer.android.com/guide/google/gcm/gs.html. 
Then you must paste a server simple API key, configured without IP restrictions. 
Requires integration with the SDK for Android v1.12.0+.

**See also:**

- [SDK Documentation - Android - How to Integrate GCM][Link 5]
 
**Amazon Device Messaging for Android (ADM)**

To enable Native Push using ADM, you must provide <OAuth credentials> consisting of a Client ID and Client Secret (Requires integration with SDK for Android v2.1.0+).

**See also:**

- [SDK Documentation - Android - How to Integrate ADM][Link 5]

![settings6][51]

### Push Speed:
Shows the current push speed of your application and allows you to define the push speed of your application. The push speed defines the maximum number of pushes per second that the Reach module will perform. This can be helpful in situation where your own servers are overloaded by too many requests per second(/s) after a campaign activation.
 
  ![settings7][52]

### Tracking:
The tracking feature allows you to track the origins of the installations of your iOS and Android applications. It lets you know where your users downloaded your application (i.e., from which application store) and which source brought them here (i.e, ad campaign, blog, web site, e-mail, SMS, etc.). The Tracking feature of Azure Mobile Engagement must be integrated into your application from the SDK as a separate step. 

**See also:**

- [SDK Documentation - Android - How to Integrate][Link 5], [SDK Documentation - iOS - How to Integrate][Link 5]
 
**Stores**

Allow you to register all stores from which your application can be downloaded based on their names and their associated download URLs. Doing this allows you to create locations to host tracking URLs. Stores can be created or deleted from this page. Using the icon to create a new tracking URL takes you to the tracking URLs page covered below. There are several ways of tracking where yours users download your app:

-    Use a third party Ad Server (Azure Mobile Engagement currently supports [SmartAd](http://smartadserver.fr/) and [Surikate](http://www.surikate.com/).
-    Use a third party attribution service (Azure Mobile Engagement currently supports [Mobile App Tracking]( http://www.mobileapptracking.com/) and [Trademob](http://www.trademob.com/) may also be supported in the near future.)
-    Use a third party install referrer (Azure Mobile Engagement currently supports [Google Play Install Referrer](https://developers.google.com/app-conversion-tracking/docs/third-party-trackers/) - Android Only).
-    Use manual reporting.
 
  ![settings8][53]
 
**Ad Campaigns**
Allow you to create New Ad Campaigns consisting of an Ad server name, a Campaign ID, and the Source where your application can be downloaded. 
 
  ![settings9][54]
 
**Tracking URLs**
Allows you to build tracking URLs to use as target URLs in your sources (ad campaign, blog, web site, e-mail, SMS, etc.) which can redirect users to the stores where they can download your application. Also allows you to display all the tracking URLs you have already created. A tracking URL can be used as the action URL of an ad campaign or a Reach announcement to invite your users to download one of your apps from another app. A tracking URL redirects to the download URL associated with the selected store, while allowing our tracking system to record the store from which the application is downloaded at installation time. If a source is provided, our tracking system also records it, allowing you to distinguish between the various ad campaigns you create for your application.

**See also:**

- [UI Documentation - Reach - New Push Campaign][Link 1] 
 
Creating a New tracking URL requires you to specify a store and the source of either none, customer, or add server. 

-    A source of None creates a de
-    fault tracking URL.
-    A source of Custom allows you to specify a URL on an external server to download your application.
-    A source of Ad server creates a default tracking URL in a default named Ad server.
 
**Build a tracking URL**
You can also build a tracking URL allowing users to download one of your applications from inside the content section of a new reach campaign.

**See also:**

- [UI Documentation - Reach - Push Content][Link 1]
 
![settings10][55]

### App Info:
Allows you to register additional information associated to your application's users. This information can be injected by your application (using the SDK) or by your backend (using the Device API). 
**See also:**

- [API Documentation - Device API][Link 4]

Registering application information tags allows you to segment your Reach campaigns by creating specific Reach audience criteria based on it. You can view the name and type of existing app info tags or add a new app info based on the name and type of String, Date, Integer, or Boolean.

**See also:**

- [UI Documentation - Reach - New Push Campaign][Link 1]
 
![settings11][56]
 
### Commercial Pressure: 
Push Quotas allow you to define the maximum number of times a device can be pushed to over a period. Push quotas are used only by Reach campaigns that have the "Apply push quotas" option enabled. Push quotas can be managed either by segment or by default. Quotas can be set to only send a maximum number of pushes over a sliding period of the last hour, day, week, or month.

**See also:**

- [UI Documentation - Reach - New Push Campaign][Link 1],  [UI Documentation - Segments][Link 1]
 
**Quotas**

- Quota by default: This quota is applied to users that are not matched by any segment in the 'Quota by segment' section below. By default, no quota is set.
- Quota by segment: As a quota must apply to a group of users, you need to create a segment to identify the users to apply a quota to. It could be a 'heavy users' segment defined by the number of sessions they make, or anything you deem interesting to define the user group. If a device matches several segments with a defined quota, only the quota having the highest maximum number of pushes per hour is applied.

![settings12][57]
 
### Permissions:
Allows you to search and view the Email, Name, Organization, and Permission level of users of your application. The permissions concept is an addition to project role. It allows you to associate one set of permissions to a specific user who has access to your application.

**The permissions levels current available are:**

-    "Reach Campaign Creator" (a user that can create Reach campaigns) 
-    "Reach Campaign Manager" (a user that can create Reach campaigns and activate, suspend, finish, destroy them)

> Note: When a user has both a project role and a set of permissions for a given application, the more permissive concept is used. Hence, we suggest that when using permissions, you set the project role of your users to "Viewer" (the least permissive role) and add more permissive permissions at the application level.

**See also:**

- [UI Documentation - Home][Link 1]  
 
![settings13][58]

<!--Image references-->
[1]: ./media/mobile-engagement-user-interface/navigation1.png
[2]: ./media/mobile-engagement-user-interface/home1.png
[3]: ./media/mobile-engagement-user-interface/home2.png
[4]: ./media/mobile-engagement-user-interface/home3.png
[5]: ./media/mobile-engagement-user-interface/home4.png
[6]: ./media/mobile-engagement-user-interface/home5.png
[7]: ./media/mobile-engagement-user-interface/myaccount1.png
[8]: ./media/mobile-engagement-user-interface/myaccount2.png
[9]: ./media/mobile-engagement-user-interface/myaccount3.png
[10]: ./media/mobile-engagement-user-interface/analytics1.png
[11]: ./media/mobile-engagement-user-interface/analytics2.png
[12]: ./media/mobile-engagement-user-interface/analytics3.png
[13]: ./media/mobile-engagement-user-interface/analytics4.png
[14]: ./media/mobile-engagement-user-interface/monitor1.png
[15]: ./media/mobile-engagement-user-interface/monitor2.png
[16]: ./media/mobile-engagement-user-interface/monitor3.png
[17]: ./media/mobile-engagement-user-interface/monitor4.png
[18]: ./media/mobile-engagement-user-interface/reach1.png
[19]: ./media/mobile-engagement-user-interface/reach2.png
[20]: ./media/mobile-engagement-user-interface/Reach-Campaign1.png
[21]: ./media/mobile-engagement-user-interface/Reach-Campaign2.png
[22]: ./media/mobile-engagement-user-interface/Reach-Campaign3.png
[23]: ./media/mobile-engagement-user-interface/Reach-Campaign4.png
[24]: ./media/mobile-engagement-user-interface/Reach-Campaign5.png
[25]: ./media/mobile-engagement-user-interface/Reach-Campaign6.png
[26]: ./media/mobile-engagement-user-interface/Reach-Campaign7.png
[27]: ./media/mobile-engagement-user-interface/Reach-Campaign8.png
[28]: ./media/mobile-engagement-user-interface/Reach-Campaign9.png
[29]: ./media/mobile-engagement-user-interface/Reach-Criterion1.png
[30]: ./media/mobile-engagement-user-interface/Reach-Content1.png
[31]: ./media/mobile-engagement-user-interface/Reach-Content2.png
[32]: ./media/mobile-engagement-user-interface/Reach-Content3.png
[33]: ./media/mobile-engagement-user-interface/Reach-Content4.png
[34]: ./media/mobile-engagement-user-interface/dashboard1.png
[35]: ./media/mobile-engagement-user-interface/segments1.png
[36]: ./media/mobile-engagement-user-interface/segments2.png
[37]: ./media/mobile-engagement-user-interface/segments3.png
[38]: ./media/mobile-engagement-user-interface/segments4.png
[39]: ./media/mobile-engagement-user-interface/segments5.png
[40]: ./media/mobile-engagement-user-interface/segments6.png
[41]: ./media/mobile-engagement-user-interface/segments7.png
[42]: ./media/mobile-engagement-user-interface/segments8.png
[43]: ./media/mobile-engagement-user-interface/segments9.png
[44]: ./media/mobile-engagement-user-interface/segments10.png
[45]: ./media/mobile-engagement-user-interface/segments11.png
[46]: ./media/mobile-engagement-user-interface/settings1.png
[47]: ./media/mobile-engagement-user-interface/settings2.png
[48]: ./media/mobile-engagement-user-interface/settings3.png
[49]: ./media/mobile-engagement-user-interface/settings4.png
[50]: ./media/mobile-engagement-user-interface/settings5.png
[51]: ./media/mobile-engagement-user-interface/settings6.png
[52]: ./media/mobile-engagement-user-interface/settings7.png
[53]: ./media/mobile-engagement-user-interface/settings8.png
[54]: ./media/mobile-engagement-user-interface/settings9.png
[55]: ./media/mobile-engagement-user-interface/settings10.png
[56]: ./media/mobile-engagement-user-interface/settings11.png
[57]: ./media/mobile-engagement-user-interface/settings12.png
[58]: ./media/mobile-engagement-user-interface/settings13.png

<!--Link references-->
[Link 1]: ../mobile-engagement-user-interface/
[Link 2]: ../mobile-engagement-troubleshooting-guide/
[Link 3]: ../mobile-engagement-how-tos/
[Link 4]: http://go.microsoft.com/fwlink/?LinkID=525553
[Link 5]: http://go.microsoft.com/fwlink/?LinkID=525554
[Link 6]: http://go.microsoft.com/fwlink/?LinkId=525555
[Link 7]: https://account.windowsazure.com/PreviewFeatures
[Link 8]: https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=azuremobileengagement
[Link 9]: http://azure.microsoft.com/en-us/services/mobile-engagement/
[Link 10]: http://azure.microsoft.com/en-us/documentation/services/mobile-engagement/
[Link 11]: http://azure.microsoft.com/en-us/pricing/details/mobile-engagement/
[Link 12]: ../mobile-engagement-user-interface-navigation/
[Link 13]: ../mobile-engagement-user-interface-home/
[Link 14]: ../mobile-engagement-user-interface-my-account/
[Link 15]: ../mobile-engagement-user-interface-analytics/
[Link 16]: ../mobile-engagement-user-interface-monitor/
[Link 17]: ../mobile-engagement-user-interface-reach/
[Link 18]: ../mobile-engagement-user-interface-segments/
[Link 19]: ../mobile-engagement-user-interface-dashboard/
[Link 20]: ../mobile-engagement-user-interface-settings/
[Link 21]: ../mobile-engagement-troubleshooting-guide-analytics/
[Link 22]: ../mobile-engagement-troubleshooting-guide-apis/
[Link 23]: ../mobile-engagement-troubleshooting-guide-push-reach/
[Link 24]: ../mobile-engagement-troubleshooting-guide-service/
[Link 25]: ../mobile-engagement-troubleshooting-guide-sdk/
[Link 26]: ../mobile-engagement-troubleshooting-guide-sr-info/
[Link 27]: ../mobile-engagement-how-tos-first-push/
[Link 28]: ../mobile-engagement-how-tos-test-campaign/
[Link 29]: ../mobile-engagement-how-tos-personalize-push/
[Link 30]: ../mobile-engagement-how-tos-differentiate-push/
[Link 31]: ../mobile-engagement-how-tos-schedule-campaign/
[Link 32]: ../mobile-engagement-how-tos-text-view/
[Link 33]: ../mobile-engagement-how-tos-web-view/
