##### Common steps

1. Add the MSAL.NET namespace in your source code: `using Microsoft.Identity.Client;`
2. Instead of instantiating an `AuthenticationContext`, use `ConfidentialClientApplicationBuilder.Create` to instantiate a `IConfidentialClientApplication`.
3. Instead of the `resourceId` string, MSAL.NET uses scopes. As first party applications are pre-authorized, you can always use the following scopes: `new string[] { $"{resourceId}/.default" }`
4. Replace the call to `AuthenticationContext.AcquireTokenAsync` by a call to `IConfidentialClientApplication.AcquireTokenXXX` where XXX depends on your scenario.
