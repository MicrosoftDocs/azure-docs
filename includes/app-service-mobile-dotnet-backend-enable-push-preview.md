The server project downloaded from the portal already has push notifications enabled.

In your ASP.NET project, you can verify the following:

* The `Microsoft.Azure.Mobile.Server.Notifications` NuGet package is installed.

* In WebApiConfig.cs, the `UseDefaultConfiguration()` method is called on the MobileAppConfiguration object. This in turn calls the `AddPushNotifications()` extension method provided by the above NuGet package.
