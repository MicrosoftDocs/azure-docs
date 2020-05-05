---
title: Integrate Remote Rendering into a HoloLens Holographic App
description: Explains how to integrate Remote Rendering into a plain HoloLens Holographic App as created with Visual Studio project wizard
author: florianborn71
ms.author: flborn
ms.date: 05/04/2020
ms.topic: tutorial
---

# Tutorial: Integrate Remote Rendering into a HoloLens Holographic App

In this tutorial you will learn:

> [!div class="checklist"]
>
> * Using Visual Studio to create a Holographic App that can be deployed to HoloLens
> * Add the necessary code snippets and project settings to combine local rendering with remotely rendered content

This tutorial focuses on adding the necessary bits to a native `Holographic App` sample to combine local rendering with Azure Remote Rendering. It leaves out the parts for proper error- and status display inside the app (for example through text panels), because adding UI elements in native C++ is beyond the scope of this sample. Building a dynamic text panel from scratch is cumbersome as you need to deal with writing text to native `DirectX11` resources via `DirectWrite` and then render these resources as 3d overlays in the scene using custom shaders. A good starting point is class `StatusDisplay` which is part of the
[Remoting Player sample project on GitHub](https://github.com/microsoft/MixedReality-HolographicRemoting-Samples/tree/master/player/common/Content). In fact, the pre-canned version of this tutorial uses a local copy of that class.

> [!TIP]
> The [ARR samples repository](https://github.com/Azure/azure-remote-rendering) contains the outcome of this tutorial as a Visual Studio project that is ready to use. It is also enriched with proper error- and status reporting through UI class `StatusDisplay`. Inside the tutorial, all ARR specific additions are scoped by `#ifdef USE_REMOTE_RENDERING` / `#endif`, so it is easy to see what has been modified.

## Prerequisites

For this tutorial you need:

* Your account information (account ID, account key, subscription ID). If you don't have an account, [create an account](../../how-tos/create-an-account.md).
* Windows SDK 10.0.18362.0 [(download)](https://developer.microsoft.com/windows/downloads/windows-10-sdk)
* The latest version of Visual Studio 2019 [(download)](https://visualstudio.microsoft.com/vs/older-downloads/)
* Windows Mixed Reality App Templates for Visual Studio -> download link (Visual Studio Marketplace)

## Create a new Holographic App sample

As a first step, we create a stock sample that is the basis for the Remote Rendering integration. Open Visual Studio and select "Create a new project" and search for "Holographic DirectX 11 App (Universal Windows) (C++/WinRT)"

![Create new project](media/new-project-wizard.png)

Type in a project name of your choice, choose the path and select the "Create" button.
In the new project, switch the configuration to **"Release / ARM64"**. You should now be able to compile and deploy it to a connected HoloLens 2 device. If you run it on HoloLens, you should see a rotating cube in front of you.

## Add Remote Rendering dependencies through NuGet

First step into adding Remote Rendering capabilities is to add the client side dependencies. These are availble as a NuGet package.
In the Solution Explorer, right-click on the project and select **"Manage NuGet Packages..."** from the context menu.

In the prompted dialog, browse for the **"Azure Remote Rendering"** NuGet package:

![Browse for NuGet package](media/add-nuget.png)

and add it to the project by selecting the package and then pressing the "Install" button.

The NuGet package adds the Remote Rendering dependencies to the project. Specifically:
* link against the client library (RemoteRenderingClient.lib),
* set up the .dll dependencies,
* set the correct path to the include directory.

## Integrate Remote Rendering

Now that the project is prepared, we can start with the code. A good entry point into the application is class `HolographicAppMain`(file HolographicAppMain.h/cpp) because it has all the necessary hooks for initialization, de-initialization, and rendering.

### Includes

We start by adding the necessary includes. Add the following include to file HolographicAppMain.h:

```cpp
#include <AzureRemoteRendering.h>
```

...and this additional include to file HolographicAppMain.cpp:

```cpp
#include <AzureRemoteRendering.inl>
```

For simplicity of code, we define the following namespace shortcut at the top of file HolographicAppMain.h, after the include:

```cpp
namespace RR = Microsoft::Azure::RemoteRendering;
```

This is useful so we don't have to write out the full namespace everywhere but still can recognize ARR specific data structures. Of course you can also use the `using namespace...` directive.

### Initialization
 
We need to hold a few objects for the session etc. during the lifetime of the application. The lifetime coincides with the lifetime of the application's `HolographicAppMain` object, so we simply add our objects as members to class `HolographicAppMain`. The next step is adding the following class members in file HolographicAppMain.h:

```cpp
class HolographicAppMain
{
    ...
    // members:
    RR::ApiHandle<RR::AzureFrontend> m_frontEnd;  // the front end instance
    RR::ApiHandle<RR::AzureSession> m_session;    // the current remote rendering session
    RR::ApiHandle<RR::RemoteManager> m_api;       // the API instance, that is used to perform all the actions. This is just a shortcut to m_session->Actions()
    RR::ApiHandle<RR::GraphicsBindingWmrD3d11> m_graphicsBinding; // the graphics binding instance
}
```

A good place to do the actual implementation is the constructor of class `HolographicAppMain`. We have to do three types of initialization there:
1. The one-time initialization of the Remote Rendering system
1. Front end creation
1. Session creation

We do all of that sequentially in the constructor. However, in real use cases it might be appropriate to do this separately, for example linked to UI events. Add the following code to the beginning of the constructor body in file HolographicAppMain.cpp:

```cpp
HolographicAppMain::HolographicAppMain(std::shared_ptr<DX::DeviceResources> const& deviceResources) :
    m_deviceResources(deviceResources)
{
    // 1. one time initialization
    {
        RR::RemoteRenderingInitialization clientInit;
        memset(&clientInit, 0, sizeof(RR::RemoteRenderingInitialization));
        clientInit.connectionType = RR::ConnectionType::General;
        clientInit.graphicsApi = RR::GraphicsApiType::WmrD3D11;
        clientInit.toolId = "<sample name goes here>"; // <put your sample name here>
        clientInit.unitsPerMeter = 1.0f;
        clientInit.forward = RR::Axis::Z_Neg;
        clientInit.right = RR::Axis::X;
        clientInit.up = RR::Axis::Y;
        RR::StartupRemoteRendering(clientInit);
    }

    // 2. Create front end
    {
        // fill out the following credentials:
        RR::AzureFrontendAccountInfo init;
        memset(&init, 0, sizeof(RR::AzureFrontendAccountInfo));
        init.AccountId = "00000000-0000-0000-0000-000000000000";
        init.AccountKey = "<account key>";
        init.AccountDomain = "<account domain>";

        m_frontEnd = RR::ApiHandle(RR::AzureFrontend(init));
    }

    // 3. Open rendering session
    {
        auto openSession = m_frontEnd->OpenRenderingSession("<SessionId>");
        if (!openSession)
        {
            return;
        }

        m_session = *openSession;
        m_api = m_session->Actions(); // cache the 'actions' object for convenience
        m_graphicsBinding = m_session->GetGraphicsBinding().as<RR::GraphicsBindingWmrD3d11>();
    }

    { // listen to connection status changed callbacks
        m_session->ConnectionStatusChanged([this](auto status, auto error)
        {
            OnConnectionStatusChanged(status, error);
        });
    }


    // rest of constructor code:
    ...
}
```
In the last addition above, we register to a callback that is triggered whenever the connection status on given session changes. We re-direct that call to our own function `OnConnectionStatusChanged`, which does not exist yet. We will declare and implement it as part of the state machine in the next paragraph. Also note that credentials are hard-coded in the sample and need to be filled out in place ([account ID, account key](../../../how-tos/create-an-account.md#retrieve-the-account-information) and [domain](../../../reference/regions.md)).

We do the de-initialization symmetrically and in reverse order at the end of the destructor body:

```cpp
HolographicAppMain::~HolographicAppMain()
{
    // existing destructor code:
    ...
    
    // destroy session:
    if (m_session != nullptr)
    {
        m_session->DisconnectFromRuntime();
        m_session = nullptr;
    }

    // destroy front end:
    m_frontEnd = nullptr;

    // one-time de-initialization:
    RR::ShutdownRemoteRendering();
}
```

## State machine

In Remote Rendering, key functions to create a session and to load a model are asynchronous functions. To reflect this, we need a simple state machine that essentially transitions through the following states automatically:

*Initialization -> Session creation -> model loading (with progress)*




Accordingly, as a next step, we add a bit of state machine handling to the class. We declare our own enum `ConnectionStatus` for the various states that our application can be in. It is very similar to `RR::ConnectionStatus`, but has an additional state for failed connection.

Add the following members and functions to the class declaration:

```cpp
namespace HolographicApp
{
    // our applications's possible states:
    enum class ConnectionStatus
    {
        Disconnected,
        Connecting,
        Connected,
        ConnectionFailed,
    };

    class HolographicAppMain
    {
        ...
        // member functions for state transition handling
        void OnConnectionStatusChanged(RR::ConnectionStatus status, RR::Result error);
        void SetNewState(ConnectionStatus state, RR::Result error);
       
       // members for state handling:
        ConnectionStatus m_currentStatus = ConnectionStatus::Disconnected;
        RR::Result m_connectionResult = RR::Result::Success;
        bool m_isConnected = false;

    }
```

### Per frame update

We have to perform some operations once per simulation tick. This includes ticking the client and custom handling of our state machine.
Class `HolographicApp1Main` provides a good hook for this, so add the following code to the body of function `HolographicApp1Main::Update`:

```cpp
// Updates the application state once per frame.
HolographicFrame HolographicAppMain::Update()
{
    // tick Remote rendering:
    if (m_session != nullptr)
    {
        // tick the client to receive messages
        m_api->Update();

        if (m_isConnected && !m_modelLoadTriggered)
        {
            m_modelLoadTriggered = true;
            LoadModel();
        }
    }

    // rest of the body:
    ...
}
```

### Rendering

The last thing to do is invoking the rendering. We have to do this in the exact right position within the rendering pipeline, after the clear. Insert the following snippet into the `UseHolographicCameraResources` lock inside function `HolographicAppMain::Render`:

```cpp
        ...
        // existing clear function:
        context->ClearDepthStencilView(depthStencilView, D3D11_CLEAR_DEPTH | D3D11_CLEAR_STENCIL, 1.0f, 0);

        // inject remote rendering: as soon as we are connected, start blitting the remote frame.
        // We do the blitting after the Clear, and before cube rendering
        if (m_isConnected)
        {
            m_graphicsBinding->BlitRemoteFrame();
        }

        ...
```

## Run the sample

The sample should now be in a state to compile and run. Note that there is no error display integrated into this demo. So if something goes wrong (e.g. authentication failures), there is no visible feedback. Displaying the current state and loading progress is left to the user. The pre-canned version of this sample on GitHub on the other hand has status text. 


## Next steps

In this tutorial, you learned all the steps necessary to take a blank Unity project and get it working with Azure Remote Rendering. In the next tutorial, we will take a closer look at how to work with remote entities.

> [!div class="nextstepaction"]
> [Tutorial: Working with remote entities in Unity](working-with-remote-entities.md)
