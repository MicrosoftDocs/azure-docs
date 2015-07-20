The server project downloaded from the portal already has authentication enabled.

In your ASP.NET project, you should see the following:

* The `Microsoft.Azure.Mobile.Server.Authentication` NuGet package is installed.

* In WebApiConfig.cs, the `UseDefaultConfiguration()` method is called on the MobileAppConfiguration object. This in turn calls the `AddAppServiceAuthentication()` extension method provided by the above NuGet package. It also registers an OWIN middleware needed for authentication by calling `app.UseAppServiceAuthentication()` during OWIN startup.