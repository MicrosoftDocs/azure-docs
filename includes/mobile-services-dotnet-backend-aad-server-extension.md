### (Optional) Configure your .NET mobile service for AAD login

>[WACOM.NOTE] These steps are optional because they only apply to the Azure Active Directory login provider.

1. Install the **WindowsAzure.MobileServices.Backend.Security** prerelease NuGet package.

2. In  App_Start/WebApiConfig.cs, add the following to Register(), immediately after `options` is instantiated:

                options.LoginProviders.Remove(typeof(AzureActiveDirectoryLoginProvider));
                    options.LoginProviders.Add(typeof(AzureActiveDirectoryExtendedLoginProvider);

