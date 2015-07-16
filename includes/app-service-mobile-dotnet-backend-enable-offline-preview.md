The server project downloaded from the portal already has data features enabled.

In your ASP.NET project, you should see the following:

* The `Microsoft.Azure.Mobile.Server.Tables` and `Microsoft.Azure.Mobile.Server.Entity` NuGet packages are installed.

* In WebApiConfig.cs, the `UseDefaultConfiguration()` method is called on the MobileAppConfiguration object. This in turn calls the `AddTablesWithEntityFramework()` extension method provided by the above NuGet package.