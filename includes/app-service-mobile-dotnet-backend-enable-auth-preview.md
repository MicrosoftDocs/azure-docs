The server project downloaded from the portal already has authentication enabled.

The project has done the following for you:

* The `Microsoft.Azure.Mobile.Server.Authentication` NuGet package is installed.

* The MobileAppConfiguration object has its `UseDefaultConfiguration()` method invoked. This in turn calls the `AddAppServiceAuthentication()` provided by the above NuGet package. It also registers an OWIN middleware needed for authentication by calling `app.UseAppServiceAuthentication()` during OWIN startup.