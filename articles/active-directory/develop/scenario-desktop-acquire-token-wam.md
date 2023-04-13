---
title: Acquire a token to call a web API using web account manager (desktop app)
description: Learn how to build a desktop app that calls web APIs to acquire a token for the app using web account manager
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 12/14/2022
ms.author: dmwendia
ms.custom: aaddev, devx-track-python
#Customer intent: As an application developer, I want to know how to write a desktop app that calls web APIs by using the Microsoft identity platform.
---

# Desktop app that calls web APIs: Acquire a token using WAM

MSAL is able to call Web Account Manager (WAM), a Windows 10+ component that ships with the OS. This component acts as an authentication broker and users of your app benefit from integration with accounts known from Windows, such as the account you signed-in with in your Windows session.

## WAM value proposition

Using an authentication broker such as WAM has numerous benefits.

- Enhanced security. See [token protection](https://learn.microsoft.com/azure/active-directory/conditional-access/concept-token-protection)
- Better support for Windows Hello, Conditional Access and FIDO keys
- Integration with Windows' "Email and Accounts" view
- Better Single Sign-On 
- Ability to sign in silently with the current Windows account
- Most bug fixes and enhancements will be shipped with Windows

## WAM limitations

- Available on Windows 10 and later and on Windows Server 2019 and later. On Mac, Linux, and earlier versions of Windows, MSAL will automatically fall back to a browser.
- B2C and ADFS authorities aren't supported. MSAL will fall back to a browser.

## WAM integration package

Most apps will need to reference `Microsoft.Identity.Client.Broker` package to use this integration. MAUI apps are not required to do this; the functionality is inside MSAL when the target is `net6-windows` and later.

## WAM calling pattern

You can use the following pattern to use WAM. 

```csharp
    // 1. Configuration - read below about redirect URI
    var pca = PublicClientApplicationBuilder.Create("client_id")
                    .WithBroker(new BrokerOptions(BrokerOptions.OperatingSystems.Windows))
                    .Build();

    // Add a token cache, see https://learn.microsoft.com/azure/active-directory/develop/msal-net-token-cache-serialization?tabs=desktop

    // 2. Find a account for silent login

    // is there an account in the cache?
    IAccount accountToLogin = (await pca.GetAccountsAsync()).FirstOrDefault();
    if (accountToLogin == null)
    {
        // 3. no account in the cache, try to login with the OS account
        accountToLogin = PublicClientApplication.OperatingSystemAccount;
    }

    try
    {
        // 4. Silent authentication 
        var authResult = await pca.AcquireTokenSilent(new[] { "User.Read" }, accountToLogin)
                                    .ExecuteAsync();
    }
    // cannot login silently - most likely AAD would like to show a consent dialog or the user needs to re-enter credentials
    catch (MsalUiRequiredException) 
    {
        // 5. Interactive authentication
        var authResult = await pca.AcquireTokenInteractive(new[] { "User.Read" })
                                    .WithAccount(accountToLogin)
                                    // this is mandatory so that WAM is correctly parented to your app, read on for more guidance
                                    .WithParentActivityOrWindow(myWindowHandle) 
                                    .ExecuteAsync();
                                    
        // consider allowing the user to re-authenticate with a different account, by calling AcquireTokenInteractive again                                  
    }
```

If a broker isn't present (for example, Win8.1, Mac, or Linux), then MSAL will fall back to a browser, where redirect URI rules apply.

### Redirect URI

WAM redirect URIs don't need to be configured in MSAL, but they must be configured in the app registration. 

```
ms-appx-web://microsoft.aad.brokerplugin/{client_id}
```

### Token cache persistence

It's important to persist MSAL's token cache because MSAL continues to store id tokens and account metadata there. See https://learn.microsoft.com/azure/active-directory/develop/msal-net-token-cache-serialization?tabs=desktop

### Find a account for silent login

The recommended pattern is: 

1. If the user previously logged in, use that account.
2. If not, use `PublicClientApplication.OperatingSystemAccount` which the current Windows Account 
3. Allow the end-user to change to a different account by logging in interactively. 

## Parent Window Handles

It is required to configure MSAL with the window that the interactive experience should be parented to, using `WithParentActivityOrWindow` APIs.

### UI applications
For UI apps like WinForms, WPF, WinUI3 see https://learn.microsoft.com/windows/apps/develop/ui-input/retrieve-hwnd

### Console applications

For console applications it is a bit more involved, because of the terminal window and its tabs. Use the following code:

```csharp
enum GetAncestorFlags
{   
    GetParent = 1,
    GetRoot = 2,
    /// <summary>
    /// Retrieves the owned root window by walking the chain of parent and owner windows returned by GetParent.
    /// </summary>
    GetRootOwner = 3
}

/// <summary>
/// Retrieves the handle to the ancestor of the specified window.
/// </summary>
/// <param name="hwnd">A handle to the window whose ancestor is to be retrieved.
/// If this parameter is the desktop window, the function returns NULL. </param>
/// <param name="flags">The ancestor to be retrieved.</param>
/// <returns>The return value is the handle to the ancestor window.</returns>
[DllImport("user32.dll", ExactSpelling = true)]
static extern IntPtr GetAncestor(IntPtr hwnd, GetAncestorFlags flags);

[DllImport("kernel32.dll")]
static extern IntPtr GetConsoleWindow();

// This is your window handle!
public IntPtr GetConsoleOrTerminalWindow()
{
   IntPtr consoleHandle = GetConsoleWindow();
   IntPtr handle = GetAncestor(consoleHandle, GetAncestorFlags.GetRootOwner );
  
   return handle;
}
```

## Troubleshooting

### "WAM Account Picker did not return an account" error message

This message indicates that either the application user closed the dialog that displays accounts, or the dialog itself crashed. A crash might occur if AccountsControl, a Windows control, is registered incorrectly in Windows. To resolve this issue: 

1. In the taskbar, right-click **Start**, and then select **Windows PowerShell (Admin)**.
1. If you're prompted by a User Account Control (UAC) dialog, select **Yes** to start PowerShell.
1. Copy and then run the following script:

   ```powershell
   if (-not (Get-AppxPackage Microsoft.AccountsControl)) { Add-AppxPackage -Register "$env:windir\SystemApps\Microsoft.AccountsControl_cw5n1h2txyewy\AppxManifest.xml" -DisableDevelopmentMode -ForceApplicationShutdown } Get-AppxPackage Microsoft.AccountsControl
   ```
### "MsalClientException: ErrorCode: wam_runtime_init_failed" error message during Single-file deployment 

You may see the following error when packaging your application into a [single file bundle](/dotnet/core/deploying/single-file/overview). 

```
MsalClientException: wam_runtime_init_failed: The type initializer for 'Microsoft.Identity.Client.NativeInterop.API' threw an exception. See https://aka.ms/msal-net-wam#troubleshooting
```

This error indicates that the native binaries from the [Microsoft.Identity.Client.NativeInterop](https://www.nuget.org/packages/Microsoft.Identity.Client.NativeInterop/) were not packaged into the single file bundle. To embed those files for extraction and get one output file, set the property IncludeNativeLibrariesForSelfExtract to true. Read more about [how to package native binaries into a single file](/dotnet/core/deploying/single-file/overview?tabs=cli#native-libraries).

### Connection issues

The application user sees an error message similar to "Please check your connection and try again." If this issue occurs regularly, see the [troubleshooting guide for Office](/microsoft-365/troubleshoot/authentication/connection-issue-when-sign-in-office-2016), which also uses the broker.


## Sample

[WPF sample that uses WAM](https://github.com/azure-samples/active-directory-dotnet-desktop-msgraph-v2)

---
## Next steps

Move on to the next article in this scenario,
[Call a web API from the desktop app](scenario-desktop-call-api.md).
