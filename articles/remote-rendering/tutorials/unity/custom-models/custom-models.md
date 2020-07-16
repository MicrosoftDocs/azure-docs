---
title: Interfaces and custom models
description: Add view controllers and ingest custom models to be rendered by Azure Remote Rendering
author: michael-house
ms.author: v-mihous
ms.date: 06/15/2020
ms.topic: tutorial
---

# Tutorial: Interfaces and custom models

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Add Mixed Reality Toolkit to the project
> * Manage model state
> * Configure Azure Blob Storage for model ingestion
> * Upload and process models for rendering

## Prerequisites

* This tutorial builds on [Tutorial: Viewing a remotely rendered model](../view-remote-models/view-remote-models.md).

## Get started with the Mixed Reality Toolkit (MRTK)

The Mixed Reality Toolkit (MRTK) is a cross-platform toolkit for building mixed reality experiences. We'll use MRTK 2.3 for its interaction and visualization features.

To add MRTK, follow the [Required steps](https://microsoft.github.io/MixedRealityToolkit-Unity/version/releases/2.3.0/Documentation/GettingStartedWithTheMRTK.html#required) listed in [Getting started with MRTK](https://microsoft.github.io/MixedRealityToolkit-Unity/version/releases/2.3.0/Documentation/GettingStartedWithTheMRTK.html).

Those steps are:
 - [Get the latest MRTK Unity packages](https://microsoft.github.io/MixedRealityToolkit-Unity/version/releases/2.3.0/Documentation/GettingStartedWithTheMRTK.html#get-the-latest-mrtk-unity-packages)
     - Even though it says "latest", this is for version 2.3.
     - We only use the *Foundation* package in this tutorial. The *Extensions*, *Tools*, and *Examples* packages are not required.
 - [Import MRTK packages into your Unity project](https://microsoft.github.io/MixedRealityToolkit-Unity/version/releases/2.3.0/Documentation/GettingStartedWithTheMRTK.html#import-mrtk-packages-into-your-unity-project)
 - [Switch your Unity project to the target platform](https://microsoft.github.io/MixedRealityToolkit-Unity/version/releases/2.3.0/Documentation/GettingStartedWithTheMRTK.html#switch-your-unity-project-to-the-target-platform)
     - You should have done this step already in the first chapter, but now is a good time to double check!
 - [Add MRTK to a new scene or new project](https://microsoft.github.io/MixedRealityToolkit-Unity/version/releases/2.3.0/Documentation/GettingStartedWithTheMRTK.html#add-mrtk-to-a-new-scene-or-new-project)
     - You can add MRTK to a new scene and re-add your coordinator and model objects/scripts, or you can add MRTK to your existing scene using the *Mixed Reality Toolkit -> Add to Scene and Configure* menu command.

## Import assets used by this tutorial

Starting in this chapter, we'll implement a simple [model-view-controller pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) for much of the material covered. The *model* part of the pattern is the Azure Remote Rendering specific code and the state management related to Azure Remote Rendering. The *view* and *controller* parts of the pattern are implemented using MRTK assets and some custom scripts. It is possible to use the *model* in this tutorial without the *view-controller* implemented here. This separation allows you to easily integrate the code found in this tutorial into your own application where it will take over the *view-controller* part of the design pattern.

With the introduction of MRTK, there are a number of scripts, prefabs, and assets that can now be added to the project to support interactions and visual feedback. These assets, referred to as the **Tutorial Assets**, are bundled into a [Unity Asset Package](https://docs.unity3d.com/Manual/AssetPackages.html), which is included in the [Azure Remote Rendering GitHub](https://github.com/Azure/azure-remote-rendering) in '\Unity\TutorialAssets\TutorialAssets.unitypackage'.

1. Clone or download the git repository [Azure Remote Rendering](https://github.com/Azure/azure-remote-rendering), if downloading extract the zip to a known location.
1. In your Unity project, choose *Assets -> Import Package -> Custom Package*.
1. In the file explorer, navigate to the directory where you cloned or unzipped the Azure Remote Rendering repository, then select the .unitypackage found in **Unity -> TutorialAssets -> TutorialAssets.unitypackage**
1. Select the **Import** button to import the contents of the package into your project.
1. In the Unity Editor, select *Mixed Reality Toolkit -> Utilities -> Upgrade MRTK Standard Shader for Lightweight Render Pipeline* from the top menu bar and follow the prompts to upgrade the shader.

Once MRTK and the Tutorial Assets are included in the project, we'll switch the MRTK profile to one more suitable for the tutorial.

1. Select the **MixedRealityToolkit** GameObject in the scene hierarchy.
1. In the Inspector, under the **MixedRealityToolkit** component, switch the configuration profile to *ARRMixedRealityToolkitConfigurationProfile*.
1. Press *Ctrl+S* to save your changes.

This will configure MRTK, primarily, with the default HoloLens 2 profiles. The provided profiles are pre-configured in the following ways:
 - Turn off the profiler (Press 9 to toggle it on/off, or say "Show/Hide Profiler" on device).
 - Turn off the eye gaze cursor.
 - Enable Unity mouse clicks, so you can click MRTK UI elements with the mouse instead of the simulated hand.

## Add the App Menu

Most of the view controllers in this tutorial operate against abstract base classes instead of against concrete classes. This pattern provides more flexibility and allows us to provide the view controllers for you, while still helping you learn the Azure Remote Rendering code. For simplicity, the **RemoteRenderingCoordinator** class does not have an abstract class provided and its view controller operates directly against the concrete class.

You can now add the prefab **AppMenu** to the scene, for visual feedback of the current session state. This view controller will "unlock" more sub menu view controllers as we implement and integrate more ARR features into the scene. For now, the **AppMenu** will have a visual indication of the ARR state and present the modal panel that the user uses to authorize the application to connect to ARR.

1. Locate the **AppMenu** prefab in *Assets/RemoteRenderingTutorial/Prefabs/AppMenu*
1. Drag the **AppMenu** prefab into the scene.
1. You'll likely see a dialog for **TMP Importer**, since this is the first time we're including *Text Mesh Pro* assets in the scene. Follow the prompts to **Import TMP Essentials**. Then close the importer dialog, the examples and extras are not needed.
1. The **AppMenu** is configured to automatically hook up and provide the modal for consenting to connecting to a Session, so we can remove the bypass placed earlier. On the **RemoteRenderingCoordinator** GameObject, remove the bypass for authorization we implemented previously, by pressing the '-' button on the **On Requesting Authorization** event.\
 ![Remove bypass](./media/remove-bypass-event.png).\
1. Test the view controller by pressing **Play** in the Unity Editor.
1. In the Editor, now that MRTK is configured, you can use the WASD keys to change the position your view and holding the right mouse button + moving the mouse to change your view direction. Try "driving" around the scene a bit to get a feel for the controls.
1. On device, you can raise your palm up to summon the **AppMenu**, in the Unity Editor, use the hotkey 'M'.
1. If you've lost sight of the menu, press the 'M' key to summon the menu. The menu will be placed near the camera for easy interaction.
1. The authorization will now show as a request to the right of the **AppMenu**, from now on, you'll use this to authorize the app to manage remote rendering sessions.\
 ![UI authorize](./media/authorize-request-ui.png)\
1. Stop Unity from playing to continue with the tutorial.

## Manage model state

Now we'll implement a new script, **RemoteRenderedModel** that is for tracking state, responding to events, firing events, and configuration. Essentially, **RemoteRenderedModel** stores the remote path for the model data in `modelPath`. It will listen for state changes in the **RemoteRenderingCoordinator** to see if it should automatically load or unload the model it defines. The GameObject that has the **RemoteRenderedModel** attached to it will be the local parent for the remote content.

Notice that the **RemoteRenderedModel** script implements **BaseRemoteRenderedModel**, included from **Tutorial Assets**. This will allow the remote model view controller to bind with your script.

1. Create a new script named **RemoteRenderedModel** in the same folder as **RemoteRenderingCoordinator**. Replace the entire contents with the following code:

    ```csharp
    // Copyright (c) Microsoft Corporation. All rights reserved.
    // Licensed under the MIT License. See LICENSE in the project root for license information.

    using Microsoft.Azure.RemoteRendering;
    using Microsoft.Azure.RemoteRendering.Unity;
    using System;
    using UnityEngine;
    using UnityEngine.Events;

    public class RemoteRenderedModel : BaseRemoteRenderedModel
    {
        [SerializeField]
        [Tooltip("The friendly name for this model")]
        private string modelDisplayName;
        [SerializeField]
        [Tooltip("The URI for this model")]
        private string modelPath;

        public bool AutomaticallyLoad = true;

        private ModelState currentModelState = ModelState.NotReady;

        public override string ModelDisplayName { get => modelDisplayName; set => modelDisplayName = value; }
        public override string ModelPath { get => modelPath; set => modelPath = value; }

        public override ModelState CurrentModelState
        {
            get => currentModelState;
            protected set
            {
                if (currentModelState != value)
                {
                    currentModelState = value;
                    ModelStateChange?.Invoke(value);
                }
            }
        }

        public override event Action<ModelState> ModelStateChange;
        public override event Action<float> LoadProgress;
        public override Entity ModelEntity { get; protected set; }

        public UnityEvent OnModelNotReady = new UnityEvent();
        public UnityEvent OnModelReady = new UnityEvent();
        public UnityEvent OnStartLoading = new UnityEvent();
        public UnityEvent OnModelLoaded = new UnityEvent();
        public UnityEvent OnModelUnloading = new UnityEvent();

        public UnityFloatEvent OnLoadProgress = new UnityFloatEvent();

        public void Awake()
        {
            // Hook up the event to the Unity event
            LoadProgress += (progress) => OnLoadProgress?.Invoke(progress);

            ModelStateChange += HandleUnityStateEvents;
        }

        private void HandleUnityStateEvents(ModelState modelState)
        {
            switch (modelState)
            {
                case ModelState.NotReady:  OnModelNotReady?.Invoke();  break;
                case ModelState.Ready:     OnModelReady?.Invoke();     break;
                case ModelState.Loading:   OnStartLoading?.Invoke();   break;
                case ModelState.Loaded:    OnModelLoaded?.Invoke();    break;
                case ModelState.Unloading: OnModelUnloading?.Invoke(); break;
            }
        }

        private void Start()
        {
            //Attach to and initialize current state (in case we're attaching late)
            RemoteRenderingCoordinator.CoordinatorStateChange += Instance_CoordinatorStateChange;
            Instance_CoordinatorStateChange(RemoteRenderingCoordinator.instance.CurrentCoordinatorState);
        }

        /// <summary>
        /// Listen for state changes on the coordinator, clean up this model's remote objects if we're no longer connected.
        /// Automatically load if required
        /// </summary>
        private void Instance_CoordinatorStateChange(RemoteRenderingCoordinator.RemoteRenderingState state)
        {
            switch (state)
            {
                case RemoteRenderingCoordinator.RemoteRenderingState.RuntimeConnected:
                    CurrentModelState = ModelState.Ready;
                    if (AutomaticallyLoad)
                        LoadModel();
                    break;
                default:
                    UnloadModel();
                    break;
            }
        }

        private void OnDestroy()
        {
            RemoteRenderingCoordinator.CoordinatorStateChange -= Instance_CoordinatorStateChange;
            UnloadModel();
        }

        /// <summary>
        /// Asks the coordinator to create a model entity and listens for coordinator state changes
        /// </summary>
        [ContextMenu("Load Model")]
        public override async void LoadModel()
        {
            if (CurrentModelState != ModelState.Ready)
                return; //We're already loaded, currently loading, or not ready to load

            CurrentModelState = ModelState.Loading;

            ModelEntity = await RemoteRenderingCoordinator.instance?.LoadModel(ModelPath, this.transform, SetLoadingProgress);

            if (ModelEntity != null)
                CurrentModelState = ModelState.Loaded;
            else
                CurrentModelState = ModelState.Error;
        }

        /// <summary>
        /// Clean up the local model instances
        /// </summary>
        [ContextMenu("Unload Model")]
        public override void UnloadModel()
        {
            CurrentModelState = ModelState.Unloading;

            if (ModelEntity != null)
            {
                var modelGameObject = ModelEntity.GetOrCreateGameObject(UnityCreationMode.DoNotCreateUnityComponents);
                Destroy(modelGameObject);
                ModelEntity.Destroy();
                ModelEntity = null;
            }

            if (RemoteRenderingCoordinator.instance.CurrentCoordinatorState == RemoteRenderingCoordinator.RemoteRenderingState.RuntimeConnected)
                CurrentModelState = ModelState.Ready;
            else
                CurrentModelState = ModelState.NotReady;
        }

        /// <summary>
        /// Update the Unity progress event
        /// </summary>
        /// <param name="progressValue"></param>
        public override void SetLoadingProgress(float progressValue)
        {
            LoadProgress?.Invoke(progressValue);
        }
    }
    ```

In the most basic terms, **RemoteRenderedModel** holds the data needed to load a model (in this case the SAS or *builtin://* URI) and tracks the remote model state. When it's time to load, the `LoadModel` method is called on **RemoteRenderingCoordinator** and the Entity containing the model is returned for reference and unloading.

## Load the Test Model

Let's test the new script by loading the test model again. We'll create a Game Object to contain the script and be a parent to the test model.

1. Create a new empty Game Object in the scene and name it **TestModel**.
1. Add the *RemoteRenderedModel* script to **TestModel**.\
![Add RemoteRenderedModel component](./media/add-remote-rendered-model-script.png)
1. Fill in the `Model Display Name` and the `Model Path` with "*TestModel*" and "*builtin://Engine*" respectively.\
![Specify model details](./media/add-model-script.png)
1. Position the **TestModel** object in front of the camera, at position **x = 0, y = 0, z = 3**.\
![Position object](./media/test-model-position.png)
1. Ensure **AutomaticallyLoad** is turned on.
1. Press **Play** in the Unity Editor to test the application.
1. Grant authorization by clicking the *Connect* button to allow the app to create a session and it will connect to a Session and automatically load the model.

Watch the Console as the application progresses through its states. Keep in mind, some states may take some time to complete, and won't show progress. Eventually, you'll see the logs from the model loading and then the test model will be rendered in the scene.

Try moving and rotating the **TestModel** GameObject via the Transform in the Inspector, or in the Scene view. You'll see the model move and rotate it in the Game view.

![Unity Log](./media/unity-loading-log.png)

## Provision Blob Storage in Azure and custom model ingestion

Now we can try loading your own model. To do that, you'll need to configure Blob Storage and on Azure, upload and convert a model, then we'll load the model using the **RemoteRenderedModel** script. The custom model loading steps can be safely skipped if you don't have your own model to load at this time.

Follow the steps specified in the [Quickstart: Convert a model for rendering](../../../quickstarts/convert-model.md). Skip the **Insert new model into Quickstart Sample App** section for the purpose of this tutorial. Once you have your ingested model's *Shared Access Signature (SAS)* URI, continue to the next step below.

## Load and rendering a custom model

1. Create a new empty GameObject in the scene and name it similar to your custom model.
1. Add the *RemoteRenderedModel* script to the newly created GameObject.\
 ![Add RemoteRenderedModel component](./media/add-remote-rendered-model-script.png)
1. Fill in the `Model Display Name` with an appropriate name for your model.
1. Fill in the `Model Path` with the model's *Shared Access Signature (SAS)* URI you created in the ingestion steps above.
1. Position the GameObject in front of the camera, at position **x = 0, y = 0, z = 3.**
1. Ensure **AutomaticallyLoad** is turned on.
1. Press **Play** in the Unity Editor to test the application.

    You will see the Console begin to populate with the current state, and eventually, model loading progress messages. Your custom model will then load into the scene.

1. Remove your custom model object from the scene. The best experience for this tutorial will be using the test model. While multiple models are certainly supported in ARR, this tutorial was written to best support a single remote model at a time.

## Next steps

You can now load your own models into Azure Remote Rendering and view them in your application! Next, we'll guide you through manipulating your models.

> [!div class="nextstepaction"]
> [Next: Manipulating models](../manipulate-models/manipulate-models.md)
