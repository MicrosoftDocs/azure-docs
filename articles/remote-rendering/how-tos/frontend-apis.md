---
title: Azure Frontend APIs for authentication
description: Explains how to use the C# frontend API for authentication
author: florianborn71
ms.author: flborn
ms.date: 02/12/2010
ms.topic: how-to
ms.custom: devx-track-csharp
---

# Use the Azure Frontend APIs for authentication

In this section, we will describe how to use the API for authentication and session management.

> [!CAUTION]
> The functions described in this chapter issue REST calls on the server internally. As for all REST calls, sending these commands too frequently will cause the server to throttle and return failure eventually. The value of the `SessionGeneralContext.HttpResponseCode` member in this case is 429 ("too many requests"). As a rule of thumb, there should be a delay of **5-10 seconds between subsequent calls**.


## SessionConfiguration

SessionConfiguration is used to set up the authentication information for an ```RemoteRenderingClient``` instance in the SDK.

The important fields are:

```cs [APITODO]
public class SessionConfiguration
{
    // Domain that will be used for account authentication for the Azure Remote Rendering service, in the form [region].mixedreality.azure.com.
    // [region] should be set to the domain of the Azure Remote Rendering account.
    public string AccountAuthenticationDomain;
    // Domain that will be used to generate sessions for the Azure Remote Rendering service, in the form [region].mixedreality.azure.com.
    // [region] should be selected based on the region closest to the user. For example, westus2.mixedreality.azure.com or westeurope.mixedreality.azure.com.
    public string AccountDomain;

    // Can use one of:
    // 1) ID and Key.
    // 2) ID and AuthenticationToken.
    // 3) ID and AccessToken.
    public string AccountId = Guid.Empty.ToString();
    public string AccountKey = string.Empty;
    public string AuthenticationToken = string.Empty;
    public string AccessToken = string.Empty;
}
```

The C++ counterpart looks like this:

```cpp [APITODO]
struct SessionConfiguration
{
    std::string AccountAuthenticationDomain{};
    std::string AccountDomain{};
    std::string AccountId{};
    std::string AccountKey{};
    std::string AuthenticationToken{};
    std::string AccessToken{};
};
```

For the _region_ part in the domain, use a [region near you](../reference/regions.md).

The account information can be obtained from the portal as described in the [retrieve account information](create-an-account.md#retrieve-the-account-information) paragraph.

## Azure Frontend

The relevant classes are ```RemoteRenderingClient``` and ```RenderingSession```. ```RemoteRenderingClient``` is used for account management and account level functionality, which includes: asset conversion and rendering session creation. ```RenderingSession``` is used for session level functionality and it includes: session update, queries, renewing, and decommissioning.

Each opened/created ```RenderingSession``` will keep a reference to the frontend that's created it. To cleanly shut down, all sessions must be deallocated before the frontend will be deallocated.

Deallocating a session will not stop the server on Azure, `RenderingSession.StopAsync` must be called explicitly.

Once a session has been created and its state has been marked as ready, it can connect to the remote rendering runtime with `RenderingSession.ConnectAsync`.

### Threading

All RenderingSession and RemoteRenderingClient async calls are completed in a background thread, not the main application thread.

### Conversion APIs

For more information about the conversion service, see [the model conversion REST API](conversion/conversion-rest-api.md).

#### Start asset conversion

```cs [APITODO]
private StartConversionAsync _pendingAsync = null;

void StartAssetConversion(RemoteRenderingClient client, string storageContainer, string blobinputpath, string bloboutpath, string modelName, string outputName)
{
    _pendingAsync = client.StartConversionAsync(
        new AssetConversionInputParams(storageContainer, blobinputpath, "", modelName),
        new AssetConversionOutputParams(storageContainer, bloboutpath, "", outputName)
        );
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

```cpp [APITODO]
void StartAssetConversion(ApiHandle<RemoteRenderingClient> client, std::string storageContainer, std::string blobinputpath, std::string bloboutpath, std::string modelName, std::string outputName)
{
    AssetConversionInputParams input;
    input.BlobContainerInformation.BlobContainerName = blobinputpath;
    input.BlobContainerInformation.StorageAccountName = storageContainer;
    input.BlobContainerInformation.FolderPath = "";
    input.InputAssetPath = modelName;

    AssetConversionOutputParams output;
    output.BlobContainerInformation.BlobContainerName = blobinputpath;
    output.BlobContainerInformation.StorageAccountName = storageContainer;
    output.BlobContainerInformation.FolderPath = "";
    output.OutputAssetPath = outputName;

    ApiHandle<StartAssetConversionAsync> conversionAsync = *client->StartAssetConversionAsync(input, output);
    conversionAsync->Completed([](ApiHandle<StartAssetConversionAsync> res)
    {
        if (res->GetIsRanToCompletion())
        {
            //use res.Result
        }
        else
        {
            printf("Failed to start asset conversion!");
        }
    }
    );
}
```


#### Get conversion status

```cs [APITODO]
private ConversionStatusAsync _pendingAsync = null
void GetConversionStatus(RemoteRenderingClient client, string assetId)
{
    _pendingAsync = client.GetAssetConversionStatusAsync(assetId);
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

```cpp [APITODO]
void GetConversionStatus(ApiHandle<RemoteRenderingClient> client, std::string assetId)
{
    ApiHandle<ConversionStatusAsync> pendingAsync = *frontend->GetAssetConversionStatusAsync(assetId);
    pendingAsync->Completed([](ApiHandle<ConversionStatusAsync> res)
    {
        if (res->GetIsRanToCompletion())
        {
            // use res->Result
        }
        else
        {
            printf("Failed to get status of asset conversion!");
        }

    });
}
```


### Rendering APIs

See [the session management REST API](session-rest-api.md) for details about session management.

A rendering session can either be created dynamically on the service or an already existing session ID can be 'opened' into an RenderingSession object.

#### Create rendering session

```cs [APITODO]
private CreateSessionAsync _pendingAsync = null;
void CreateRenderingSession(RemoteRenderingClient client, RenderingSessionVmSize vmSize, ARRTimeSpan maxLease)
{
    _pendingAsync = client.CreateNewRenderingSessionAsync(
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

```cpp [APITODO]
void CreateRenderingSession(ApiHandle<RemoteRenderingClient> client, RenderingSessionVmSize vmSize, const ARRTimeSpan& maxLease)
{
    RenderingSessionCreationParams params;
    params.MaxLease = maxLease;
    params.Size = vmSize;
    ApiHandle<CreateSessionAsync> pendingAsync = *client->CreateNewRenderingSessionAsync(params);

    pendingAsync->Completed([] (ApiHandle<CreateSessionAsync> res)
    {
        if (res->GetIsRanToCompletion())
        {
            //use res->Result
        }
        else
        {
            printf("Failed to create session!");
        }
    });
}
```

#### Open an existing rendering session

Opening an existing session is a synchronous call.

```cs [APITODO]
void CreateRenderingSession(RemoteRenderingClient client, string sessionId)
{
    RenderingSession session = client.OpenRenderingSession(sessionId);
    // Query session status, etc.
}
```

```cpp [APITODO]
void CreateRenderingSession(ApiHandle<RemoteRenderingClient> client, std::string sessionId)
{
    ApiHandle<RenderingSession> session = *client->OpenRenderingSession(sessionId);
    // Query session status, etc.
}
```


#### Get current rendering sessions

```cs [APITODO]
private SessionPropertiesArrayAsync _pendingAsync = null;
void GetCurrentRenderingSessions(RemoteRenderingClient client)
{
    _pendingAsync = client.GetCurrentRenderingSessionsAsync();
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

```cpp [APITODO]
void GetCurrentRenderingSessions(ApiHandle<RemoteRenderingClient> client)
{
    ApiHandle<SessionPropertiesArrayAsync> pendingAsync = *client->GetCurrentRenderingSessionsAsync();
    pendingAsync->Completed([](ApiHandle<SessionPropertiesArrayAsync> res)
    {
        if (res->GetIsRanToCompletion())
        {
            // use res.Result
        }
        else
        {
            printf("Failed to get current rendering sessions!");
        }
    });
}
```

### Session APIs

#### Get rendering session properties

```cs [APITODO]
private SessionPropertiesAsync _pendingAsync = null;
void GetRenderingSessionProperties(RenderingSession session)
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

```cpp [APITODO]
void GetRenderingSessionProperties(ApiHandle<RenderingSession> session)
{
    ApiHandle<SessionPropertiesAsync> pendingAsync = *session->GetPropertiesAsync();
    pendingAsync->Completed([](ApiHandle<SessionPropertiesAsync> res)
    {
        if (res->GetIsRanToCompletion())
        {
            //use res.Result
        }
        else
        {
            printf("Failed to get properties of session!");
        }
    });
}
```

#### Update rendering session

```cs [APITODO]
private SessionAsync _pendingAsync;
void UpdateRenderingSession(RenderingSession session, ARRTimeSpan updatedLease)
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

```cpp [APITODO]
void UpdateRenderingSession(ApiHandle<RenderingSession> session, const ARRTimeSpan& updatedLease)
{
    RenderingSessionUpdateParams params;
    params.MaxLease = updatedLease;
    ApiHandle<SessionAsync> pendingAsync = *session->RenewAsync(params);
    pendingAsync->Completed([](ApiHandle<SessionAsync> res)
    {
        if (res->GetIsRanToCompletion())
        {
            printf("Rendering session renewed succeeded!");
        }
        else
        {
            printf("Failed to renew rendering session!");
        }
    });
}
```

#### Stop rendering session

```cs [APITODO]
private SessionAsync _pendingAsync;
void StopRenderingSession(RenderingSession session)
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

```cpp [APITODO]
void StopRenderingSession(ApiHandle<RenderingSession> session)
{
    ApiHandle<SessionAsync> pendingAsync = *session->StopAsync();
    pendingAsync->Completed([](ApiHandle<SessionAsync> res)
    {
        if (res->GetIsRanToCompletion())
        {
            printf("Rendering session stopped successfully!");
        }
        else
        {
            printf("Failed to stop rendering session!");
        }
    });
}
```

#### Connect to ARR inspector

```cs [APITODO]
private ArrInspectorAsync _pendingAsync = null;
void ConnectToArrInspector(RenderingSession session)
{
    _pendingAsync = session.ConnectToArrInspectorAsync();
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

```cpp [APITODO]
void ConnectToArrInspector(ApiHandle<RenderingSession> session)
{
    ApiHandle<ArrInspectorAsync> pendingAsync = *session->ConnectToArrInspectorAsync();
    pendingAsync->Completed([](ApiHandle<ArrInspectorAsync> res)
    {
        if (res->GetIsRanToCompletion())
        {
            // Launch the html file with default browser
            std::string htmlPath = "file:///" + *res->Result();
            ShellExecuteA(NULL, "open", htmlPath.c_str(), NULL, NULL, SW_SHOWDEFAULT);
        }
        else
        {
            printf("Failed to connect to ARR inspector!");
        }
    });
}
```

## Next steps

* [Create an account](create-an-account.md)
* [Example PowerShell scripts](../samples/powershell-example-scripts.md)
