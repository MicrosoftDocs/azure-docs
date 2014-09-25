### (Optional) Configure your .NET mobile service for AAD login

>[WACOM.NOTE] These steps are optional because they only apply to the Azure Active Directory login provider.

1. Install the **WindowsAzure.MobileServices.Backend.Security** NuGet package.

2. In Visual Studio expand App_Start and open the WebApiConfig.cs file. Add the following code to the `Register` method, immediately after `options` is instantiated:

        options.LoginProviders.Remove(typeof(AzureActiveDirectoryLoginProvider));
        options.LoginProviders.Add(typeof(AzureActiveDirectoryExtendedLoginProvider));

