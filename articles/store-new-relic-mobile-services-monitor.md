<properties 
	pageTitle="Store server scripts in source control - Azure Mobile Services" 
	description="Learn how to use the New Relic add-on to monitor your mobile service." 
	documentationCenter="" 
	authors="stepsic-microsoft-com" 
	manager="carolz" 
	editor="" 
	services="mobile-services"/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="03/16/2015" 
	ms.author="stepsic"/>

# Use New Relic to monitor Mobile Services

This topic shows you how to configure the third-party New Relic add-on to work with Azure Mobile Services to provide enhanced monitoring of your mobile service. 

The tutorial guides you through the following steps:

1. [Sign up for New Relic using the Azure Store].
2. [Install the New Relic module].
3. [Enable New Relic developer analytics for the mobile service].
4. [Monitor the mobile service in the New Relic dashboard].

To complete this tutorial, you must have already created a mobile service by completing either the [Get started with Mobile Services] or the [Get started with data] tutorial.

##<a name="sign-up"></a>Sign up for New Relic using the Azure Store

The first step is to purchase the New Relic service. This tutorial shows you how to purchase this service from the Azure Store. Mobile Services supports New Relic subscriptions purchased outside of the Azure Store.

1. Log in to the [Azure Management Portal](https://manage.windowsazure.com).

2. In the lower pane of the management portal, click **New**.

3. Click **Store**.

4. In the **Choose an Add-on** dialog, select **New Relic** and click **Next**.

5. In the **Personalize Add-on** dialog, select the New Relic plan that you want.

7. Enter a name for how the New Relic service will appear in your Azure
   settings, or use the default value **NewRelic**. This name must be unique in
   your list of subscribed Azure Store items.

8. Choose a value for the region; for example, **West US**.

9. Click **Next**.

10. In the **Review Purchase** dialog, review the plan and pricing information,
    and review the legal terms. If you agree to the terms, click **Purchase**.

11. After you click **Purchase**, your New Relic account will begin the creation process. You can monitor the status in the Azure management portal.

##<a name="install-module"></a>Install the New Relic module

After you have signed-up for the New Relic service, you need to install the New Relic Node.js module in your mobile service. You must have source control enabled for your mobile service to be able to upload this module.

1. If you haven't already done so, follow the steps in the tutorial [Store server scripts in source control] to enable source control for your mobile service, clone the repository, and install the <a href="http://nodejs.org/" target="_blank">Node Package Manager (NPM)</a>.

2. Navigate to the `.\service` folder of your local Git repository, then from the command prompt run the following command:

		npm install newrelic

	NPM installs the [New Relic module][newrelic] in the `\newrelic` subdirectory. 

3. Open a Git command-line tool, such as **GitBash** (Windows) or **Bash** (Unix Shell) and type the following command in the Git command prompt: 

		$ git add .
		$ git commit -m "added newrelic module"
		$ git push origin master
		
	This uploads the new `newrelic` module to your mobile service. 

Next, you will enable New Relic monitoring of your mobile service in the [Management Portal][Azure Management Portal]. 

##<a name="enable-service"></a>Enable New Relic developer analytics for the mobile service

1. In the [Management Portal][Azure Management Portal], select your mobile service, then click the **Configure** tab.

	![][0]

2. Scroll down to **Developer analytics** and do one of the following, depending on how you purchased your New Relic subscription:

	+ Purchased in the Azure store:

		Click **Add-on**, select the New Relic add-on from **Choose add-on**, then click **Save**.

		![][1]

	+ Purchased directly from New Relic: 

		Click **Custom**, select the New Relic from **Provider**, enter your key, then click **Save**.

		![][2]

		The key can be obtained from your the New Relic dashboard.

3. After registration is complete, you will see a new value in **App settings**:

	![][3] 

##<a name="monitor"></a>Monitor the mobile service in the New Relic dashboard

1. Run your client app to generate read, create, update, and delete requests to your mobile service.

2. Wait a few minutes for the data to be processed, then navigate to the New Relic dashboard.

	When your New Relic subscription was purchased as an add-on, select it in the [Management Portal][Azure Management Portal], and click **Manage**.

3. In New Relic, click **Applications**, then click your mobile service.

	![][4]

4. Click **Web transactions** to see recent requests you just made to your mobile service:

	![][5]

##<a name="next-steps"> </a>Next steps

+ To optimzie your **iOS**/**Android** mobile app performance, see [New Relic Mobile].
+ For pricing information see the [New Relic page in the Azure Store].
+ For more information about using New Relic, see [Applications Overview] in the New Relic documentation. 

<!-- Anchors. -->
[Sign up for New Relic using the Azure Store]: #sign-up
[Install the New Relic module]: #install-module
[Enable New Relic developer analytics for the mobile service]: #enable-service
[Monitor the mobile service in the New Relic dashboard]: #monitor
[Next steps]: #next-steps

<!-- Images. -->
[0]: ./media/store-new-relic-mobile-services-monitor/mobile-configure-tab.png
[1]: ./media/store-new-relic-mobile-services-monitor/mobile-configure-new-relic-monitoring.png
[2]: ./media/store-new-relic-mobile-services-monitor/mobile-configure-new-relic-monitoring-custom.png
[3]: ./media/store-new-relic-mobile-services-monitor/mobile-configure-new-relic-monitoring-complete.png
[4]: ./media/store-new-relic-mobile-services-monitor/mobile-new-relic-dashboard.png
[5]: ./media/store-new-relic-mobile-services-monitor/mobile-new-relic-dashboard-2.png

<!-- URLs. -->
[Source control]: http://msdn.microsoft.com/library/windowsazure/c25aaede-c1f0-4004-8b78-113708761643
[Work with server scripts in Mobile Services]: /develop/mobile/how-to-guides/work-with-server-scripts.md

[Azure Management Portal]: https://manage.windowsazure.com/
[Node.js API Documentation: Modules]: http://nodejs.org/api/modules.html
[Store server scripts in source control]: /develop/mobile/tutorials/store-scripts-in-source-control/
[newrelic]: https://npmjs.org/package/newrelic
[New Relic page in the Azure Store]: /gallery/store/new-relic/new-relic/
[Applications Overview]: https://docs.newrelic.com/docs/applications-dashboards/applications-overview
[Get started with Mobile Services]: /develop/mobile/tutorials/get-started/
[Get started with data]: /develop/mobile/tutorials/get-started-with-data-dotnet
[New Relic Mobile]: http://newrelic.com/mobile-monitoring

