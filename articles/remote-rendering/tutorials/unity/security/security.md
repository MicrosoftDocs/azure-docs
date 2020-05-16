---
title: Securing Azure Remote Rendering and Model Storage
description: Hardening a Remote Rendering application for securing content
author: michael-house
ms.author: v-mihous
ms.date: 04/09/2020
ms.topic: tutorial
---

# Tutorial: Securing Azure Remote Rendering and model storage

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Secure Azure Blob Storage containing Azure Remote Rendering models
> * Authenticate with AAD to access Azure Remote Rendering instance
> * Use Windows Hello for device authentication

## Prerequisites

* This tutorial builds on [Tutorial: Refining materials, lighting, and effects](..\materials-lighting-effects\materials-lighting-effects.md).

## Securing your content in Azure Blob Storage

Azure Remote Rendering can securely access the contents of your Azure Blob Storage with the correct configuration. See the [How-to: Link storage accounts](../../../how-tos/create-an-account.md#link-storage-accounts) to configure your Azure Remote Rendering instance with your blob storage accounts.

When using a linked blob storage, you'll use slightly different methods for loading models. In the **RemoteRenderingCoordinator**, the **LoadModel** method will need to be modified or duplicated. The goal is to replace these two lines:

```csharp
var loadModelParams = new LoadModelFromSASParams(modelPath, modelEntity);
var loadModelAsync = ARRSessionService.CurrentActiveSession.Actions.LoadModelFromSASAsync(loadModelParams);
```

These lines use the `FromSAS` version of the params and session action. Convert them to the non-SAS versions:

```csharp
var loadModelParams = new LoadModelParams(storageContainer, blobName, modelPath, modelEntity);
var loadModelAsync = ARRSessionService.CurrentActiveSession.Actions.LoadModelAsync(loadModelParams);
```

The additional inputs `storageContainer` and `blobName` will need to either be passed in or defined via other configuration. If you followed the Quickstart for model conversion, the `storageContainer` variable would equal *arrtutorialstorage* and the `blobName` variable would equal *arroutput*. If you want, you can modify the **LoadModel** method to accept those as arguments and the **RemotelyRenderedModel** class to store and pass those values in.

Securing the blob storage in this way is the first step to securing your remote rendering application and the content you're displaying.

## Azure Active Directory (AAD) authentication

Because it's an Azure resource, Azure Remote Rendering's access can be controlled and managed using Azure Active Directory (AAD) and role assignments. This will allow you to determine which individuals or groups are using Azure Remote Rendering in a more controlled way.

The **RemoteRenderingCoordinator** script has a delegate named **ARRCredentialGetter**, which holds a method that returns a **AzureFrontendAccountInfo** object, which is used to configure the remote session management. We can assign a different method to **ARRCredentialGetter**, allowing us to use an Azure sign in flow, generating a **AzureFrontendAccountInfo** object that contains an Azure Access Token. This Access Token will be specific to the user that's signing in.

1. Follow the [How To: Configure authentication](../../../how-tos/authentication.md). Which involves registering a new Azure Active Directory application and configuring access to your Azure Remote Rendering instance.

With the Azure side of things in place, we now need to modify how your code connects to the AAR service. We do that by implementing an instance of **BaseARRAuthentication**, which will return a new **AzureFrontendAccountInfo** object. In this case, the account info will be configured with the Azure Access Token.

2. Create a new script named **AADAuthentication** and replace its code with the following:

```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.Azure.RemoteRendering;
using Microsoft.Identity.Client;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using UnityEngine;

public class AADAuthentication : BaseARRAuthentication
{
    public string accountDomain;

    public string activeDirectoryApplicationClientID;

    public string azureTenantID;

    public string azureRemoteRenderingAccountID;

    public override event Action<string> AuthenticationInstructions;

    string authority => "https://login.microsoftonline.com/" + azureTenantID;

    string redirect_uri = "https://login.microsoftonline.com/common/oauth2/nativeclient";

    string[] scopes => new string[] { "https://sts.mixedreality.azure.com/mixedreality.signin" };

    public void OnEnable()
    {
        RemoteRenderingCoordinator.ARRCredentialGetter = GetAARCredentials;
        this.gameObject.AddComponent<ExecuteOnUnityThread>();
    }

    public async override Task<AzureFrontendAccountInfo> GetAARCredentials()
    {
        var result = await TryLogin();
        if (result != null)
        {
            Debug.Log("Account signin successful " + result.Account.Username);

            var AD_Token = result.AccessToken;

            return await Task.FromResult(new AzureFrontendAccountInfo(accountDomain, azureRemoteRenderingAccountID, "", AD_Token, ""));
        }
        else
        {
            Debug.LogError("Error logging in");
        }
        return default;
    }

    private Task DeviceCodeReturned(DeviceCodeResult deviceCodeDetails)
    {
        //Since everything in this task can happen on a different thread, invoke responses on the main Unity thread
        ExecuteOnUnityThread.Enqueue(() =>
        {
            // Display instructions to the user for how to authenticate in the browser
            Debug.Log(deviceCodeDetails.Message);
            AuthenticationInstructions?.Invoke(deviceCodeDetails.Message);
        });

        return Task.FromResult(0);
    }

    public override async Task<AuthenticationResult> TryLogin()
    {
        var clientApplication = PublicClientApplicationBuilder.Create(activeDirectoryApplicationClientID).WithAuthority(authority).WithRedirectUri(redirect_uri).Build();
        AuthenticationResult result = null;
        try
        {
            var accounts = await clientApplication.GetAccountsAsync();

            if (accounts.Any())
            {
                result = await clientApplication.AcquireTokenSilent(scopes, accounts.First()).ExecuteAsync();

                return result;
            }
            else
            {
                try
                {
                    result = await clientApplication.AcquireTokenWithDeviceCode(scopes, DeviceCodeReturned).ExecuteAsync(CancellationToken.None);
                    return result;
                }
                catch (MsalUiRequiredException ex)
                {
                    Debug.LogError("MsalUiRequiredException");
                    Debug.LogException(ex);
                }
                catch (MsalServiceException ex)
                {
                    Debug.LogError("MsalServiceException");
                    Debug.LogException(ex);
                }
                catch (MsalClientException ex)
                {
                    Debug.LogError("MsalClientException");
                    Debug.LogException(ex);
                    // Mitigation: Use interactive authentication
                }
                catch (Exception ex)
                {
                    Debug.LogError("Exception");
                    Debug.LogException(ex);
                }
            }
        }
        catch (Exception ex)
        {
            Debug.LogError("GetAccountsAsync");
            Debug.LogException(ex);
        }

        return null;
    }
}
```

First, try to get the token silently using **AquireTokenSilent**. If that's not successful, move on to a more user-involved strategy.

In this case, we're using the [device code flow](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-device-code) to obtain an access token. This flow allows the user to sign in to their Azure account on a computer or phone and have the resulting token sent to the HoloLens application.

The most important part of this class from an ARR perspective is this line:

```csharp
return await Task.FromResult(new AzureFrontendAccountInfo(accountDomain, azureRemoteRenderingAccountID, "", AD_Token, ""));
```

Here, we create a new **AzureFrontendAccountInfo** object using the account domain, account ID, and access token. This token is then used by the ARR service to query, create, and join remote rendering sessions as long as the user is authorized based on the role-based permissions configured earlier.

Because there are many different ways to authenticate with Azure: in-app, on a web service of your own, and more, this code is just the beginning. You'll likely want to add the ability to sign out too. This can be done using the `Task RemoveAsync(IAccount account)` method provided by the client application.

Before building for the device, you'll need to include a file in your project's **Assets** folder. This will help the compiler build the application correctly using the *Microsoft.Identity.Client.dll* included in the **Tutorial Assets**.

1. Add a new file in **Assets** named **link.xml**
1. Add the following for to the file:

```xml
<linker>
	<assembly fullname="Microsoft.Identity.Client" preserve="all"/>
	<assembly fullname="System.Runtime.Serialization" preserve="all"/>
	<assembly fullname="System.Core">
		<type fullname="System.Linq.Expressions.Interpreter.LightLambda" preserve="all" />
	</assembly>
</linker>
```

3. Save the changes

## Next steps

With these security measures in place, you're one step closer to a production-ready application that uses Azure Remote Rendering.

> [!div class="nextstepaction"]
> [Next: Commercial Readiness](../commercial-ready/commercial-ready.md)