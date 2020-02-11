---
title: Authentication
description: Explains how authentication works
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---

# Azure Frontend APIs

Azure Remote Rendering uses the same authentication mechanism as [Azure Spatial Anchors (ASA)](https://docs.microsoft.com/azure/spatial-anchors/concepts/authentication?tabs=csharp). Clients need to set AccountKey, AuthenticationToken, or AccessToken to call the REST APIs successfully. AccountKey can be obtained in the "Keys" tab for the Remote Rendering account on the Azure portal. AuthenticationToken is an Azure AD token, which can be obtained by using the ADAL library. AccessToken is an MR token, which can be obtained from Azure Mixed Reality Security Token Service (STS).

> [!WARNING]
>
> Use of account keys is recommended for quick on-boarding, but during development/prototyping only. It is strongly recommended not to ship your application to production using an embedded account key in it, and to instead use the user-based or service-based Azure AD authentication approaches.
> This is described in the [Azure AD user authentication](https://docs.microsoft.com/azure/spatial-anchors/concepts/authentication?tabs=csharp#azure-ad-user-authentication) section of the [Azure Spatial Anchors (ASA)](https://docs.microsoft.com/azure/spatial-anchors/) service.

## Role-based access control

To help control the level of access granted to applications, services or Azure AD users of your service, the following roles have been created for you to assign as needed against your Azure Spatial Anchors accounts:

* **Remote Rendering Administrator**: Provides user with conversion, manage session, rendering, and diagnostics capabilities for Azure Remote Rendering.
* **Remote Rendering Client**: Provides user with manage session, rendering, and diagnostics capabilities for Azure Remote Rendering.


## AzureFrontendAccountInfo

AzureFrontendAccountInfo is used to set up the authentication information for an AzureFrontend instance in the SDK.

The important fields are:

```cs

    public class AzureFrontendAccountInfo
    {
        // Something akin to "<azure endpoint>.mixedreality.azure.com"
        public string AccountDomain;

        // Can use one of:
        // 1) ID and Key.
        // 2) AuthenticationToken.
        // 3) AccessToken.
        public string AccountId = Guid.Empty.ToString();
        public string AccountKey = string.Empty;
        public string AuthenticationToken = string.Empty;
        public string AccessToken = string.Empty;
    }

```

## Azure Frontend

The relevant classes are ```AzureFrontend``` and ```AzureSession```. ```AzureFrontend``` is used for account management and account level functionality, which includes: asset conversion and rendering session creation. ```AzureSession``` is used for session level functionality and it includes: session update, queries, renewing, and decommissioning.

Each opened/created ```AzureSession``` will keep a reference to the frontend that's created it. To cleanly shut down, all sessions must be deallocated before the frontend will be deallocated.

Deallocating a session will not stop the VM on Azure, `AzureSession.StopAsync` must be explicitly called.

Once a session has been created and its state has been marked as ready, it can connect to the remote rendering runtime with `AzureSession.ConnectToRuntime`.

### Threading

All AzureSession and AzureFrontend async calls are completed in a background thread, not the main application thread.

### Conversion APIs

For more information about the conversion service, see [the model conversion REST API](conversion/conversion-rest-api.md).

#### Start asset conversion

``` cs
private StartConversionAsync _pendingAsync = null;

void StartAssetConversion(AzureFrontend frontend, string modelName, string modelUrl, string assetContainerUrl)
{
    _pendingAsync = frontend.StartConversionAsync(
        new AssetConversionParams(modelName, modelUrl, assetContainerUrl));
    _pendingAsync.Completed +=
        (StartConversionAsync res) =>
        {
            if (res.IsRanToCompletion)
            {
                //use res.Result
            }
            else
            {
                Console.WriteLine("Failed to start asset conversion!");
            }
        };

        _pendingAsync = null;
}
```

#### Get conversion status

``` cs
private ConversionStatusAsync _pendingAsync = null
void GetConversionStatus(AzureFrontend frontend, string assetId)
{
    _pendingAsync = frontend.GetConversionStatusAsync(assetId);
    _pendingAsync.Completed +=
        (ConversionStatusAsync res) =>
        {
            if (res.IsRanToCompletion)
            {
                //use res.Result
            }
            else
            {
                Console.WriteLine("Failed to get status of asset conversion!");
            }

            _pendingAsync = null;
        };
}
```

### Rendering APIs

See [the session management REST API](session-rest-api.md) for details about session management.

A rendering session can either be created dynamically on the service or an already existing session ID can be 'opened' into an AzureSession object.

#### Create rendering session

``` cs
private CreateSessionAsync _pendingAsync = null;
void CreateRenderingSession(AzureFrontend frontend, RenderingSessionVmSize vmSize, ARRTimeSpan maxLease)
{
    _pendingAsync = frontend.CreateNewRenderingSessionAsync(
        new RenderingSessionCreationParams(vmSize, maxLease));

    _pendingAsync.Completed +=
        (CreateSessionAsync res) =>
        {
            if (res.IsRanToCompletion)
            {
                //use res.Result
            }
            else
            {
                Console.WriteLine("Failed to create session!");
            }
            _pendingAsync = null;
        };
}
```

#### Open an existing rendering session

Opening an existing session is a synchronous call.

``` cs
void CreateRenderingSession(AzureFrontend frontend, string sessionId)
{
    AzureSession session = frontend.OpenRenderingSession(sessionId);
    // Query session status, etc.
}
```

#### Get current rendering sessions

``` cs
private SessionPropertiesArrayAsync _pendingAsync = null;
void GetCurrentRenderingSessions(AzureFrontend frontend)
{
    _pendingAsync = frontend.GetCurrentRenderingSessionsAsync();
    _pendingAsync.Completed +=
        (SessionPropertiesArrayAsync res) =>
        {
            if (res.IsRanToCompletion)
            {
                //use res.Result
            }
            else
            {
                Console.WriteLine("Failed to get current rendering sessions!");
            }
            _pendingAsync = null;
        };
}
```

### Session APIs

#### Get rendering session properties

``` cs
private SessionPropertiesAsync _pendingAsync = null;
void GetRenderingSessionProperties(AzureSession session)
{
    _pendingAsync = session.GetPropertiesAsync();
    _pendingAsync.Completed +=
        (SessionPropertiesAsync res) =>
        {
            if (res.IsRanToCompletion)
            {
                //use res.Result
            }
            else
            {
                Console.WriteLine("Failed to get properties of session!");
            }
            _pendingAsync = null;
        };
}
```

#### Update rendering session

``` cs
private SessionAsync _pendingAsync;
void UpdateRenderingSession(AzureSession session, ARRTimeSpan updatedLease)
{
    _pendingAsync = session.RenewAsync(
        new RenderingSessionUpdateParams(updatedLease));
    _pendingAsync.Completed +=
        (SessionAsync res) =>
        {
            if (res.IsRanToCompletion)
            {
                Console.WriteLine("Rendering session renewed succeeded!");
            }
            else
            {
                Console.WriteLine("Failed to renew rendering session!");
            }
            _pendingAsync = null;
        };
}
```

#### Stop rendering session

``` cs
private SessionAsync _pendingAsync;
void StopRenderingSession(AzureSession session)
{
    _pendingAsync = session.StopAsync();
    _pendingAsync.Completed +=
        (SessionAsync res) =>
        {
            if (res.IsRanToCompletion)
            {
                Console.WriteLine("Rendering session stopped successfully!");
            }
            else
            {
                Console.WriteLine("Failed to stop rendering session!");
            }
            _pendingAsync = null;
        };
}
```

#### Connect to ARR inspector

``` cs
private ArrInspectorAsync _pendingAsync = null;
void ConnectToArrInspector(AzureSession session, string hostname)
{
    _pendingAsync = session.ConnectToArrInspectorAsync(hostname);
    _pendingAsync.Completed +=
        (ArrInspectorAsync res) =>
        {
            if (res.IsRanToCompletion)
            {
                // Launch the html file with default browser
                string htmlPath = res.Result;
#if WINDOWS_UWP
                UnityEngine.WSA.Application.InvokeOnUIThread(async () =>
                {
                    var file = await Windows.Storage.StorageFile.GetFileFromPathAsync(htmlPath);
                    await Windows.System.Launcher.LaunchFileAsync(file);
                }, true);
#else
                InvokeOnAppThreadAsync(() =>
                {
                    System.Diagnostics.Process.Start("file:///" + htmlPath);
                });
#endif
            }
            else
            {
                Console.WriteLine("Failed to connect to ARR inspector!");
            }
        };
}
```
