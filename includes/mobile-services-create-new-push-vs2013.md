The following steps registers your app with the Windows Store, configure your mobile service to enable push notifications, and add code to your app to register a device channel with your notification hub. Visual Studio 2013 connects to Azure and to the Windows Store by using the credentials that you provide. 

1. In Visual Studio 2013, open Solution Explorer, right-click the Windows Store app project, click **Add** then **Push Notification...**. 

	![Add Push Notification wizard in Visual Studio 2013](../includes/media/mobile-services-create-new-push-vs2013/mobile-add-push-notifications-vs2013.png)

	This starts the Add Push Notification Wizard.

2. Click **Next**, sign in to your Windows Store account, then supply a name in **Reserve a new name** and click **Reserve**.

	![Select an app name in the Add Push Notification wizard](../includes/media/mobile-services-create-new-push-vs2013/mobile-add-push-notifications-vs2013-2.png) 

	This creates a new app registration.

3. Click the new registration in the **App Name** list, then click **Next**.

	![mobile-add-push-notifications-vs2013-3](../includes/media/mobile-services-create-new-push-vs2013/mobile-add-push-notifications-vs2013-3.png)

4. In the **Select a service** page, click the name of your mobile service, then click **Next** and **Finish**. 

	The notification hub used by your mobile service is updated with the Windows Notification Services (WNS) registration. You can now use Azure Notification Hubs to send notifications from Mobile Services to your app by using WNS. This tutorial demonstrates sending notifications from a mobile service backend. You can use the same notification hub registration to send notifications from any backend service. For more information, see [Notification Hubs Overview](http://msdn.microsoft.com/en-us/library/azure/jj927170.aspx).

	The redirect domain of your mobile service is also set in the Live Connect developer center. This means that your mobile service is also configured for Microsoft Account authentication.


<!-- URLs. -->
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-dotnet/
[Import your publishsettings file in Visual Studio 2013]: /en-us/documentation/articles/mobile-services-windows-how-to-import-publishsettings/
