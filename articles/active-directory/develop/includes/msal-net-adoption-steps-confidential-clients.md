The following steps for updating code apply across all the confidential client scenarios:

1. Add the MSAL.NET namespace in your source code: `using Microsoft.Identity.Client;`.
2. Instead of instantiating `AuthenticationContext`, use `ConfidentialClientApplicationBuilder.Create` to instantiate `IConfidentialClientApplication`.
3. Instead of the `resourceId` string, MSAL.NET uses scopes. Because applications that use ADAL.NET are preauthorized, you can always use the following scopes: `new string[] { $"{resourceId}/.default" }`.
4. Replace the call to `AuthenticationContext.AcquireTokenAsync` with a call to `IConfidentialClientApplication.AcquireTokenXXX`, where *XXX* depends on your scenario.
