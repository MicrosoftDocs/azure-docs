### (Optional) Configure your .NET Mobile Service for Azure Active Directory

>[AZURE.NOTE] These steps are optional because they only apply to the Azure Active Directory login provider.

1. Install the [WindowsAzure.MobileServices.Backend.Security NuGet package](https://www.nuget.org/packages/WindowsAzure.MobileServices.Backend.Security).

2. In Visual Studio expand App_Start and open WebApiConfig.cs. Add the following `using` statement at the top:

        using Microsoft.WindowsAzure.Mobile.Service.Security.Providers;

3. Also in WebApiConfig.cs, add the following code to the `Register` method, immediately after `options` is instantiated:

        options.LoginProviders.Remove(typeof(AzureActiveDirectoryLoginProvider));
        options.LoginProviders.Add(typeof(AzureActiveDirectoryExtendedLoginProvider));
