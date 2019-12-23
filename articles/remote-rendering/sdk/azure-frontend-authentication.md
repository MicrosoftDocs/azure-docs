---
title: Authentication
description: Explains how authentication works in Azure Remove Rendering
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---
# Authentication

ARR uses the same authentication mechanism as Azure Spatial Anchors (ASA), for detailed documentation, see https://docs.microsoft.com/azure/spatial-anchors/concepts/authentication?tabs=csharp. Clients need to set AccountKey, AuthenticationToken or AccessToken to call the REST APIs successfully. AccountKey can be obtained in the "Keys" tab for the Remote Rendering account on the Azure portal. AuthenticationToken is an Azure AD token, which can be obtained by using the ADAL library. AccessToken is an MR token, which can be obtained from Azure Mixed Reality Security Token Service (STS). (Azure AD token is not supported yet)

## AzureFrontendAccountInfo

AzureFrontendAccountInfo is used to set up the authentication information for an AzureFrontend. 

The important fields are:

```cs

    public class AzureFrontendAccountInfo
    {
        public enum SessionLocation
        {
            westus2,
            westeurope,
            ppe,
            ignore
        }

        public string AccountDomain = "mixedreality.azure.com";

        // Can use one of:
        // 1) ID and Key.
        // 2) AuthenticationToken.
        // 3) AccessToken.
        public string AccountId = Guid.Empty.ToString();
        public string AccountKey = string.Empty;
        public string AuthenticationToken = string.Empty;
        public string AccessToken = string.Empty;
        public SessionLocation Location = SessionLocation.westus2;
    }

```

```Location``` is automatically appended to the ```AccountDomain``` when constructing the ```AzureFrontend``` object. For example, if ```AzureFrontendAccountInfo.SessionLocation``` is set to westus2, when the Frontend is created, it will automatically create the domain 'westus2.mixedreality.azure.com' for the AccountDomain.

```SessionLocation.ignore``` can be used to pass the AccountDomain directly to the underlying authentication service.

## Azure Frontend

The relevant classes are ```AzureFrontend``` and ```AzureSession```. ```AzureFrontend``` is used for account management and account level functionality which includes: asset ingestion and rendering session creation. ```AzureSession``` is used for session level functionality and it includes: session update, queries, and stopping.

Each opened/created ```AzureSession``` will keep a reference to the frontend that's created it. To cleanly shut down, all sessions must be deallocated before the frontend will be deallocated.

Deallocating a session will not stop the VM on Azure, Stop must be explicitly called.

Once a session has been created and its state has been marked as ready, it can be connected to by a ```RemoteManager```. 

The state and hostname of the session can be queried directly from the object and used to connect to the underlying runtime:

``` cs
void GetRenderingSessionProperties(AzureSession session)
{
    session.GetRenderingSessionPropertiesAsync().Completed +=
        (IAsync<RRRenderingSessionProperties> res) =>
        {
            var sessionProperties = res.Result;
            if(sessionProperties.Status == ARRRenderingSessionStatus.Ready)
            {
                RemoteManager.Connect(session.Hostname, session.Frontend);
            }
        }
}
```

```AzureSession``` will keep a local cache of the last known session properties based on calls to GetRenderingSessionProperties.

### Threading

All AzureSession and AzureFrontend async calls are completed in a background thread, not the main application thread.

### Redundant calls on a session object

At any given point in time, only a single call of a particular type for a session can be issued. For example, if the user has called ```AzureSession.StopRenderingSession``` and, before the first call has returned, calls ```AzureSession.StopRenderingSession``` again, the second call will fail with ARRResult.AlreadyExists.

It is possible to call the function again from within the completion routine of the first call:

``` cs

    session.GetRenderingSessionPropertiesAsync().Completed +=
        (IAsync<RRRenderingSessionProperties> res) =>
        {
            session.GetRenderingSessionPropertiesAsync(); // Succeeds
        };

    session.GetRenderingSessionPropertiesAsync(); // Fails due to redundancy
```

### Azure Frontend APIs

This section will cover Azure Frontend APIs, which are C++ and C# APIs to interact with ingestion service and rendering service REST APIs.

### Ingestion APIs

For detailed documentation about ingestion service, see the [article](../how-tos/ingest-models.md).

#### Start asset ingestion

``` cpp
void StartAssetIngestion(AzureFrontend& frontend, const char* modelName, const char* modelUrl, const char* assetContainerUrl)
{
    frontend.StartAssetIngestionAsync(IngestAssetCInfo{ modelName, modelUrl, assetContainerUrl },
    [&](RRSessionGeneralCContext context, const char* assetId)
    {
        if (context.result == ARRResult::Success)
        {
            //use assetId 
        }
        else
        {
            std::cout << "Failed to start asset ingestion!" << std::endl;
        }
    });
}
```
The C# API can be used in a similar fashion:
``` cs
void StartAssetIngestion(AzureFrontend frontend, string modelName, string modelUrl, string assetContainerUrl)
{
    frontend.StartAssetIngestionAsync(
        new IngestAssetParams(modelName, modelUrl, assetContainerUrl)).Completed +=
        (IAsync<string> res) =>
        {
            if (res.IsRanToCompletion)
            {
                //use res.Result
            }
            else
            {
                Console.WriteLine("Failed to start asset ingestion!");
            }
        };
}
```

#### Get ingestion status

``` cpp
void GetIngestionStatus(AzureFrontend& frontend, const char* assetId)
{
    frontend.GetIngestionStatusAsync(assetId,
    [&](RRSessionGeneralCContext context, ARRIngestionSessionStatus status)
    {
        if (context.result == ARRResult::Success)
        {
            //use status 
        }
        else
        {
            std::cout << "Failed to get status of asset ingestion!" << std::endl;
        }
    });
}
```
The C# API can be used in a similar fashion:
``` cs
void GetIngestionStatus(AzureFrontend frontend, string assetId)
{
    frontend.GetIngestionStatusAsync(assetId).Completed +=
        (IAsync<ARRIngestionSessionStatus> res) =>
        {
            if (res.IsRanToCompletion)
            {
                //use res.Result
            }
            else
            {
                Console.WriteLine("Failed to get status of asset ingestion!");
            }
        };
}
```

### Rendering APIs

For detailed documentation about rendering service, see the [article](../quickstarts/launching-virtual-machines.md).

A rendering session can either be created dynamically on the service or an already existing session id can be 'opened' into an AzureSession object.

#### Create rendering session

``` cpp
void CreateRenderingSession(AzureFrontend& frontend, ARRRenderingSessionVmSize vmSize, uint32_t maxLeaseTimeHours)
{
    frontend.CreateRenderingSessionAsync(CreateRenderingSessionCInfo{ vmSize, maxLeaseTimeHours },
    [&](RRSessionGeneralCContext context, std::shared_ptr<RenderingSession> renderingSession)
    {
        if (context.result == ARRResult::Success)
        {
            //use sessionId 
        }
        else
        {
            std::cout << "Failed to create session!" << std::endl;
        }
    });
}
```
The C# API can be used in a similar fashion:
``` cs
void CreateRenderingSession(AzureFrontend frontend, ARRRenderingSessionVmSize vmSize, uint maxLeaseTimeHours)
{
    frontend.CreateRenderingSessionAsync(
        new CreateRenderingSessionParams(vmSize, maxLeaseTimeHours)).Completed +=
        (IAsync<AzureSession> res) =>
        {
            if (res.IsRanToCompletion)
            {
                //use res.Result
            }
            else
            {
                Console.WriteLine("Failed to create session!");
            }
        };
}
```

#### Open an existing rendering session

``` cpp
void OpenRenderingSession(AzureFrontend& frontend, const char* sessionId)
{
    std::shared_ptr<RenderingSession> session = frontend.OpenRenderingSession(sessionId);
    // Query session status.. etc.
}
```

The C# API can be used in a similar fashion:
``` cs
void CreateRenderingSession(AzureFrontend frontend, string sessionId)
{
    AzureSession session = frontend.OpenRenderingSession(sessionId);
    // Query session status, etc.
}
```

#### Get current rendering sessions

``` cpp
void AzureFrontendTest::GetCurrentRenderingSessions(AzureFrontend& frontend)
{
    frontend.GetCurrentRenderingSessionsAsync([&](RRSessionGeneralCContext context, const RRRenderingSessionCProperties* sessions, uint32_t num)
    {
        if (context.result == ARRResult::Success)
        {
            //use sessions 
        }
        else
        {
            std::cout << "Failed to get current rendering sessions!" << std::endl;
        }
    });
}
```
The C# API can be used in a similar fashion:
``` cs
void GetCurrentRenderingSessions(AzureFrontend frontend)
{
    frontend.GetCurrentRenderingSessionsAsync().Completed +=
        (IAsync<RRRenderingSessionProperties[]> res) =>
        {
            if (res.IsRanToCompletion)
            {
                //use res.Result
            }
            else
            {
                Console.WriteLine("Failed to get current rendering sessions!");
            }
        };
}
```

### Session APIs

#### Get rendering session properties

``` cpp
void GetRenderingSessionProperties(RenderingSession& session)
{
    client.GetRenderingSessionPropertiesAsync(sessionId,
    [&](RRSessionGeneralCContext context, RRRenderingSessionCProperties properties)
    {
        if (context.result == ARRResult::Success)
        {
            //use properties 
        }
        else
        {
            std::cout << "Failed to get properties of session!" << std::endl;
        }
    });
}
```
The C# API can be used in a similar fashion:
``` cs
void GetRenderingSessionProperties(AzureSession session)
{
    session.GetRenderingSessionPropertiesAsync().Completed +=
        (IAsync<RRRenderingSessionProperties> res) =>
        {
            if (res.IsRanToCompletion)
            {
                //use res.Result
            }
            else
            {
                Console.WriteLine("Failed to get properties of session!");
            }
        };
}
```

#### Update rendering session

``` cpp
void UpdateRenderingSession(RenderingSession& session, uint32_t maxLeaseTimeHours, maxLeaseTimeMinutes)
{
    session.UpdateRenderingSessionAsync(UpdateRenderingSessionCInfo{ maxLeaseTimeHours, maxLeaseTimeMinutes },
    [&](RRSessionGeneralCContext context)
    {
        if (context.result == ARRResult::Success)
        {
            std::cout << "Rendering session update succeeded!" << std::endl;
        }
        else
        {
            std::cout << "Failed to update rendering session!" << std::endl;
        }
    });
}
```
The C# API can be used in a similar fashion:
``` cs
void UpdateRenderingSession(AzureSession sessionId, uint maxLeaseTimeHours, uint maxLeaseTimeMinutes)
{
    RemoteManager.UpdateRenderingSessionAsync(
        new UpdateRenderingSessionParams(maxLeaseTimeHours, maxLeaseTimeMinutes)).Completed +=
        (IAsync<ARRResult> res) =>
        {
            if (res.IsRanToCompletion)
            {
                Console.WriteLine("Rendering session update succeeded!");
            }
            else
            {
                Console.WriteLine("Failed to update rendering session!");
            }
        };
}
```

#### Stop rendering session

``` cpp
void StopRenderingSession(RenderingSession& session)
{
    session.StopRenderingSessionAsync(
    [&](RRSessionGeneralCContext context)
    {
        if (context.result == ARRResult::Success)
        {
            std::cout << "Rendering session stopping succeeded!" << std::endl;
        }
        else
        {
            std::cout << "Failed to stop rendering session!" << std::endl;
        }
    });
}
```
The C# API can be used in a similar fashion:
``` cs
void StopRenderingSession(AzureSession session)
{
    session.StopRenderingSessionAsync().Completed +=
        (IAsync<ARRResult> res) =>
        {
            if (res.IsRanToCompletion)
            {
                Console.WriteLine("Rendering session stop succeeded!");
            }
            else
            {
                Console.WriteLine("Failed to stop rendering session!");
            }
        };
}
```

#### Connect to ARR inspector


``` cpp
void ConnectToArrInspector(RenderingSession& session)
{
    session.ConnectToArrInspectorAsync(
    [&](ARRResult error, const char* htmlFilePath)
    {
        if (error == ARRResult::Success)
        {
            //launch html file 
        }
        else
        {
            std::cout << "Failed to connect to ARR inspector!" << std::endl;
        }
    });
}
```
The C# API can be used in a similar fashion:
``` cs
void ConnectToArrInspector(AzureSession session)
{
    session.ConnectToArrInspectorAsync().Completed +=
        (IAsync<string> res) =>
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
#elif UNITY_EDITOR
                UnityEngine.Application.OpenURL("file:///" + htmlPath);
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

> [!NOTE]
> ConnectToArrInspector will use the locally cached hostname in the AzureSession. Make sure to call GetRenderingSessionProperties at least once to set the hostname.
