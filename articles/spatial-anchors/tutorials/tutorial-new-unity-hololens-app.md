---
title: 'Tutorial: Create a new HoloLens Unity app'
description: In this tutorial, you learn how to create a new HoloLens Unity app using Azure Spatial Anchors.
author: msftradford
manager: MehranAzimi-msft
services: azure-spatial-anchors

ms.author: parkerra
ms.date: 2/3/2021
ms.topic: tutorial
ms.service: azure-spatial-anchors
---

# Tutorial: Step-by-step instructions to create a new HoloLens Unity app using Azure Spatial Anchors

This tutorial will show you how to create a new HoloLens Unity app with Azure Spatial Anchors.

## Prerequisites

To complete this tutorial, make sure you have:

1. **PC** - A PC running Windows
2. **Visual Studio** - <a href="https://www.visualstudio.com/downloads/" target="_blank">Visual Studio 2019</a> installed with the **Universal Windows Platform development** workload and the **Windows 10 SDK (10.0.18362.0 or newer)** component. The [C++/WinRT Visual Studio Extension (VSIX)](https://aka.ms/cppwinrt/vsix) for Visual Studio should be installed from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/).
3. **HoloLens** - A HoloLens device with [developer mode](/windows/mixed-reality/using-visual-studio) enabled. This article requires a HoloLens device with the [Windows 10 May 2020 Update](/windows/mixed-reality/whats-new/release-notes-may-2020). To update to the latest release on HoloLens, open the **Settings** app, go to **Update & Security**, then select the **Check for updates** button.
4. **Unity** - [Unity 2020.3.21](https://unity3d.com/get-unity/download) with modules **Universal Windwos Platform Build Support** and **Windows Build Support (IL2CPP)**

## Creating and setting up Unity Project

### Create New Project
1. Create a new **Unity** Project in **Unity Hub**
2. Select **3D**
3. Name your project and enter a save **Location**.
4. Select **Create**.
5. Save the empty default scene to a new file using: **File** > **Save As**.
6. Name the new scene **Main** and press the **Save** button.

### Import ASA and OpenXR
1. Launch [Mixed Reality Feature Toolkit](https://docs.microsoft.com/en-us/windows/mixed-reality/develop/unity/welcome-to-mr-feature-tool)
2. Select your project path - This is the folder that contains folders such as *Assets*, *Library*, *Logs*, etc - and click **Discover Features**
3. Under **Azure Mixed Reality Services** select **Azure Spatial Anchors SDK Core** and **Azure Spatial Anchors SDK for Windows**
4. Under **Platform Support** select **Mixed Reality OpenXR Plugin**
5. Press **Get Features** --> **Import** --> **Approve** --> **Exit**
6. When refocussing your Unity window, Unity will start importing the modules
7. If you get a message about using the new input system click **Yes** to restart Unity and enable the backends.
<!-- Add screenshot of selection-->

### Set up the project settings
We'll now set some Unity project settings that help us target the Windows Holographic SDK for development.
#### Change Build Platform
1. Select **File** > **Build Settings**
1. Select **Universal Windows Platform** then **Switch Platform**. Wait until Unity has finished processing all files.
#### Change OpenXR Settings 
1. Select **File** > **Build Settings** (it might still be open from the previous step)
1. Select **Player Settings...**
1. Select **XR Plug-in Management**
1. Make sure the **Universal Windows Platform Settings** tab is selected and check the box next to **OpenXR** and next to **Microsoft HoloLens feature group**
1. Click on the yellow warning sign next to **OpenXR** to display all OpenXR issues.
1. Select **Fix all**
1. To fix the issue *At least one interaction profile must be added* click on *Edit* to open the OpenXR Project settings. Then under **Interaction Profiles** select the **+** symbol and select **Microsoft Hand Interaction Profile**

#### Change Quality Settings
1. Select **Edit** > **Project Settings** > **Quality**
2. In the column under the **Universal Windows Platform** logo, click on the arrow at the **Default** row and select **Very Low**. You'll know the setting is applied correctly when the box in the **Universal Windows Platform**  column and **Very Low** row is green.

#### Set capabilities
1. Go to **Edit** > **Project Settings** > **Player** (you may still have it open from the previous step).
2. Make sure the **Universal Windows Platform Settings** tab is selected
3. In the **Publishing Settings** Configuration section, check the following
    1. InternetClient
    1. InternetClientServer
    1. PrivateNetworkClientServer
    1. SpatialPerception

#### Set up the main camera
1. In the **Hierarchy Panel**, select **Main Camera**.
2. In the **Inspector**, set its transform position to **0,0,0**.
3. Find the **Clear Flags** property, and change the dropdown from **Skybox** to **Solid Color**.
4. Click on the **Background** field to open a color picker.
5. Set **R, G, B, and A** to **0**.
6. Click **Add Component** and add the **Tracked Pose Driver** Component to the camera

## Creating the Scene

### Create the cube prefab
1. Go to **GameObject** -> **3D Object** -> **Cube**.
2. In the **Inspector**, set its scale to **0.1, 0.1, 0.1**.
3. Find the **Cube** object in the **Hierarchy** pane. Click on it and drag it into the **Assets** folder in the **Project** pane.
4. Right click and **Delete** the original cube you created in the **Hierarchy** pane.

You should now have a cube prefab in your **Project** pane.

## Trying it out
To test out that everything is working, build your app in **Unity** and deploy it from **Visual Studio**. Follow Chapter 6 from the [**MR Basics 100: Getting started with Unity** course](/windows/mixed-reality/holograms-100#chapter-6---build-and-deploy-to-device-from-visual-studio) to do so. You should see the Unity start screen, and then a clear display.

## Create a Spatial Anchors resource
TODO: Link to here https://docs.microsoft.com/en-us/azure/spatial-anchors/how-tos/create-asa-account?tabs=azure-portal 

## Creating & Adding Scripts

1. In the **Project** pane, create a new folder, **Scripts**, under the **Assets** folder.
2. Right-click on the folder, then select **Create >**, **C# Script**. Title it **AzureSpatialAnchorsScript**.
3. Go to **GameObject** -> **Create Empty**.
4. Select it, and in the **Inspector** rename it from **GameObject** to **AzureSpatialAnchors**. Select **Add Component** and search for and add the **AzureSpatialAnchorsScript**
5. Still on the **AzureSpatialAnchors** GameObject select **Add Component** again and search for and add the **SpatialAnchorManager** script.
6. TODO: fill out Spatial Anchor Manager

## App Overview
Our app will support the following interactions:
Gesture | Action
------|------- 
Tap anywhere | Start/Continue Session + Create anchor at Hand Position
Tapping on an anchor | Delete GameObject + Delete Anchor in ASA Cloud Service
Tap + Hold for 2 sec | Stop the session and remove all GameObjects. Keep anchors in ASA Cloud Service
Tap + Hold for 2 sec | Start the session and look for all anchors.


## Add Tap recognition
1. Open `AzureSpatialAnchorsScript.cs` in Visual Studio. 
2. Add the following array to your class
```csharp
public class AzureSpatialAnchorsScript : MonoBehaviour
{
    private float[] tappingTimer = { 0, 0 };
...
```
3. Add the following two methods below the Update() method. We will add implementation at a later stage
```java
Update(){
}

private async void ShortTap(Vector3 handPosition)    {    }

private async void LongTap() {}
```
4. Add the following code top the `Update()` method. This will allow the app to recognize short and long (2s) hand tapping gestures
```csharp
    void Update()
    {

        //Check for any air taps from either hand
        for (int i = 0; i < 2; i++)
        {
            InputDevice device = InputDevices.GetDeviceAtXRNode((i == 0) ? XRNode.RightHand : XRNode.LeftHand);
            if (device.TryGetFeatureValue(CommonUsages.primaryButton, out bool isTapping))
            {
                if (!isTapping)
                {
                    //Stopped Tapping or wasn't tapping
                    if (0f < tappingTimer[i] && tappingTimer[i] < 1f)
                    {
                        if (device.TryGetFeatureValue(CommonUsages.devicePosition, out Vector3 handPosition))
                            ShortTap(handPosition);
                    }
                    tappingTimer[i] = 0;
                }
                else
                {
                    tappingTimer[i] += Time.deltaTime;
                    if (tappingTimer[i] >= 2)
                    {
                        if (device.TryGetFeatureValue(CommonUsages.devicePosition, out Vector3 handPosition))
                            LongTap();
                        tappingTimer[i] = -float.MaxValue;
                    }
                }
            }

        }
    }
```
## Add & Configure SpatialAnchorManager
The ASA SDK offers a simple interface called `SpatialAnchorManager` to make the basic calls to the ASA service. Let's add it as a variable to our `AzureSpatialAnchorsScript.cs`
```csharp
public class AzureSpatialAnchorsScript : MonoBehaviour
{
    private float[] tappingTimer = { 0, 0 };
    private SpatialAnchorManager spatialAnchorManager = null;
    ...
```
In the `Start()` method, assign the variable to the component we added in a previous step
```csharp
void Start()
    {
        spatialAnchorManager = GetComponent<SpatialAnchorManager>();
        ...
```

In order to receive debug and error logs, we need to subscribe to the different callbacks
```csharp
// Start is called before the first frame update
    void Start()
    {
        spatialAnchorManager = GetComponent<SpatialAnchorManager>();
        m_spatialAnchorManager.LogDebug += (sender, args) => Debug.Log($"ASA - Debug: {args.Message}");
        spatialAnchorManager.Error += (sender, args) => Debug.LogError($"ASA - Error: {args.ErrorMessage}");
        spatialAnchorManager.LocateAnchorsCompleted += (sender, args) => Debug.Log("ASA - Locate anchors completed!");
    }
```
> [!Note]
> To view the logs make sure after you built the project from Unity and you open the visual studio solution `.sln`, you select Debug --> Run with Debugging and leave your HoloLens connected to your computer while the app is running.

## Start Session
To create and find anchors we first have to start a session. SpatialAnchorManager can take of that. We don't need to start a session if it's already running. Let's add a method with that logic
```csharp
    private async Task ASA_StartSession()
    {
        if (!spatialAnchorManager.IsSessionStarted)
            await spatialAnchorManager.StartSessionAsync();

        Debug.Log("ASA - Session Started or kept running");
    }
```

Then add the method call to our `ShortTap` method
```csharp
    private async void ShortTap(Vector3 handPosition)
    {
        await ASA_StartSession();
    }
```
## Create Anchor
Now that we have a session running we can create anchors. Let's create a method that receives the **position** of the desired anchor as a parameter
```csharp
private async Task ASA_CreateAnchor(Vector3 position){}
```

Since spatial anchors not only have a **position** but also a **rotation** let's set the **rotation** to always orient towards the HoloLens on creation.
```csharp
private async Task ASA_CreateAnchor(Vector3 position)
    {
        //Create Anchor GameObject. We will use ASA to save the position and the rotation of this GameObject.
        if (!InputDevices.GetDeviceAtXRNode(XRNode.Head).TryGetFeatureValue(CommonUsages.devicePosition, out Vector3 headPosition))
            headPosition = Vector3.zero;
        Quaternion orientationTowardsHead = Quaternion.LookRotation(position - headPosition, Vector3.up);
```

Now that we have the **position** and the **rotation** of the desired anchor, let's create a visible GameObject. ASA does not require the GameObject to be visible to the end-user, but for the purpose of this tutorial it will make the process easier to follow.

> [!Note]
> We are using a legacy shader, since it's included in a default Unity build. Other shaders like the default shader are only included if manually specified or they are directly part of the scene. If a shader is not included and the application is trying to render it, it will result in a pink material.
```csharp
        GameObject anchorGameObject = GameObject.CreatePrimitive(PrimitiveType.Cube);
        anchorGameObject.GetComponent<MeshRenderer>().material.shader = Shader.Find("Legacy Shaders/Diffuse");
        anchorGameObject.transform.position = position;
        anchorGameObject.transform.localScale = Vector3.one * 0.1f;
        anchorGameObject.transform.rotation = orientationTowardsHead;
```
Now let's add and configure the Spatial Anchor components. We are setting the expiration of the anchor to 3 days. After that they will automatically be deleted from the cloud.
```csharp
        //Add and configure ASA components
        CloudNativeAnchor cloudNativeAnchor = anchorGameObject.AddComponent<CloudNativeAnchor>();
        await cloudNativeAnchor.NativeToCloud();
        CloudSpatialAnchor cloudSpatialAnchor = cloudNativeAnchor.CloudAnchor;
        cloudSpatialAnchor.Expiration = DateTimeOffset.Now.AddDays(3);
```

To save an anchor the user must collect environment data. 
> [!Note]
> A HoloLens can possibly reuse already captured environment data surrounding the anchor.
```csharp
        //Collect Environment Data
        while (!spatialAnchorManager.IsReadyForCreate)
        {
            float createProgress = spatialAnchorManager.SessionStatus.RecommendedForCreateProgress;
            Debug.Log($"ASA - Move your device to capture more environment data: {createProgress:0%}");
        }
```
Now that the cloud spatial anchor has been prepared, we can try the actual save here.
```csharp
        Debug.Log($"ASA - Saving cloud anchor... ");

        try
        {
            // Now that the cloud spatial anchor has been prepared, we can try the actual save here.
            await spatialAnchorManager.CreateAnchorAsync(cloudSpatialAnchor);

            bool saveSucceeded = cloudSpatialAnchor != null;
            if (!saveSucceeded)
            {
                Debug.LogError("ASA - Failed to save, but no exception was thrown.");
                return;
            }

            Debug.Log($"ASA - Saved cloud anchor with ID: {cloudSpatialAnchor.Identifier}");
            UnityDispatcher.InvokeOnAppThread(() => anchorGameObject.GetComponent<MeshRenderer>().material.color = Color.green);
        }
        catch (Exception exception)
        {
            Debug.Log("ASA - Failed to save anchor: " + exception.ToString());
            Debug.LogException(exception);
        }

    }
```
In this application we'd like to keep track of the created anchor GameObjects and AnchorIds. Let's add two lists to our code and add our newly created anchor to them

```csharp
            foundOrCreatedAnchorGameObjects.Add(anchorGameObject);
            createdAnchorIDs.Add(cloudSpatialAnchor.Identifier);
```
```csharp
    private List<GameObject> foundOrCreatedAnchorGameObjects = new List<GameObject>(); 
    private List<String> createdAnchorIDs = new List<String>(); 
```

Finally let's add the function call to our `ShortTap` method
```csharp
    private async void ShortTap(Vector3 handPosition)
    {
        await ASA_StartSession();
        await ASA_CreateAnchor(handPosition);
    }
```

Our app can now create multiple anchors. Any device can now locate the created anchors (if not expired yet) as long as they have access to the same Spatial Anchors Resource on Azure and know the AnchorIDs.

## Stop Session & Destroy GameObjects

To emulate a second device finding all anchors, we will now stop the session and remove all anchor GameObjects. After that we will start a new session and query the anchors using the stored AnchorIDs.

Let's create a method `ASA_StopSession` and use the spatial anchor manager to stop the session

```csharp
    private void ASA_StopSession()
    {
        spatialAnchorManager.StopSession();
        spatialAnchorManager.DestroySession();
        //Todo: difference between stop and destroy?
    }
```

Let's create a second method to remove all anchor Game objects

```csharp
    private void RemoveAllAnchorGameObjects()
    {
        foreach (var anchorGameObject in foundOrCreatedAnchorGameObjects)
        {
            Destroy(anchorGameObject);
        }
        foundOrCreatedAnchorGameObjects = new List<GameObject>();
    }
```

And call both methods from the long tap method
```csharp
private async void LongTap()
    {
        if (spatialAnchorManager.IsSessionStarted)
        {
            // Stop Session and remove all GameObjects. This does not delete the Anchors in the cloud
            ASA_StopSession();
            RemoveAllAnchorGameObjects();
            Debug.Log("ASA - Stopped Session and removed all Anchor Objects");
        }
```

## Locate Anchor
We will now try to find the anchors again with the correct position and rotation that we  created them in. To do that we need to create a `Watcher` that will look for anchors that fit the given criteria. As criteria we will feed it the IDs of the anchors we created. Let's create a method `ASA_FindAnchor()` and use spatial anchor manager to create a `Watcher`.
```csharp
    private void ASA_FindAnchor()
    {
        if (createdAnchorIDs.Count > 0)
        {
            //Create watcher to look for all stored anchor IDs
            Debug.Log($"ASA - Creating watcher to look for {createdAnchorIDs.Count} spatial anchors");
            AnchorLocateCriteria anchorLocateCriteria = new AnchorLocateCriteria();
            anchorLocateCriteria.Identifiers = createdAnchorIDs.ToArray();
            spatialAnchorManager.Session.CreateWatcher(anchorLocateCriteria);
            Debug.Log($"ASA - Watcher created!");
        }
    }
```

We also have to subscribe to the callback to get notified when an anchor is located. Once an anchor is located we will create a visual `GameObject` with the anchors position and rotation. 
Similar to the creation process, the anchor does not have to be visible. If you only use it to have a referenced shared coordinate system there is no need for showing the anchor to the end-user. For the purpose of this tutorial we will visualize the anchors.

```csharp
    void Start()
    {
        spatialAnchorManager.AnchorLocated += ASA_SpatialAnchorManagerAnchorLocated;
    }
```

```csharp
    private void ASA_SpatialAnchorManagerAnchorLocated(object sender, AnchorLocatedEventArgs args)
    {
        Debug.Log($"ASA - Anchor recognized as a possible anchor {args.Identifier} {args.Status}");

        if (args.Status == LocateAnchorStatus.Located)
        {
            UnityDispatcher.InvokeOnAppThread(() =>
            {
                // Read out Cloud Anchor values
                CloudSpatialAnchor cloudSpatialAnchor = args.Anchor;
                Pose anchorPose = cloudSpatialAnchor.GetPose();

                //Create GameObject
                GameObject anchorGameObject = GameObject.CreatePrimitive(PrimitiveType.Cube);
                anchorGameObject.transform.localScale = Vector3.one * 0.1f;
                anchorGameObject.transform.position = anchorPose.position;
                anchorGameObject.transform.rotation = anchorPose.rotation;
                anchorGameObject.GetComponent<MeshRenderer>().material.shader = Shader.Find("Legacy Shaders/Diffuse");
                UnityDispatcher.InvokeOnAppThread(() => anchorGameObject.GetComponent<MeshRenderer>().material.color = Color.blue);

                // Link to Cloud Anchor (TODO: Explain why this is necessary, since we already set the position. Does it get updated if we set it?)
                anchorGameObject.AddComponent<CloudNativeAnchor>().CloudToNative(cloudSpatialAnchor);
                foundOrCreatedAnchorGameObjects.Add(anchorGameObject);
            });
        }
    
```

All that is left to do is expand our `LongTap` method to include finding the anchor
```csharp
    private async void LongTap()
    {
        if (spatialAnchorManager.IsSessionStarted)
        {
            // Stop Session and remove all GameObjects. This does not delete the Anchors in the cloud
            ASA_StopSession();
            RemoveAllAnchorGameObjects();
            Debug.Log("ASA - Stopped Session and removed all Anchor Objects");
        } else
        {
            //Start session and search for all Anchors previously created
            await ASA_StartSession();
            ASA_FindAnchor();
        }
    }
```
## Try it out

## Delete Anchor
Right now our app can create and locate anchors. While it deletes the GameObjects, it does not delete the anchor in the cloud. Let's add the functionality to also delete it in the cloud if i tap on an existing anchor.

Let's add a method `ASA_DeleteAnchor` that receives a GameObject. We will then use the spatial anchor manager together with the object's `CloudNativeAnchor` component to request deletion of the anchor in the cloud.
```csharp
    private async void ASA_DeleteAnchor(GameObject anchorGameObject)
    {
        CloudNativeAnchor cloudNativeAnchor = anchorGameObject.GetComponent<CloudNativeAnchor>();
        CloudSpatialAnchor cloudSpatialAnchor = cloudNativeAnchor.CloudAnchor;

        Debug.Log($"ASA - Deleting cloud anchor: {cloudSpatialAnchor.Identifier}");

        //Request Deletion of Cloud Anchor
        await spatialAnchorManager.DeleteAnchorAsync(cloudSpatialAnchor);

        //Remove local references
        createdAnchorIDs.Remove(cloudSpatialAnchor.Identifier);
        foundOrCreatedAnchorGameObjects.Remove(anchorGameObject);
        Destroy(anchorGameObject);

        Debug.Log($"ASA - Cloud anchor deleted!");
    }
```

To call this method from `ShortTap` we need to be able to determine if a tap has been near an existing visible anchor. Let's create a helper method that takes care of that
```csharp
    /// <summary>
    /// Returns true if an Anchor GameObject is within 15cm of position
    /// </summary>
    /// <param name="position"></param>
    /// <param name="anchorGameObject"></param>
    /// <returns></returns>
    private bool IsAnchorNearby(Vector3 position, out GameObject anchorGameObject)
    {
        anchorGameObject = null;

        if (foundOrCreatedAnchorGameObjects.Count <= 0)
            return false;

        //Iterate over existing anchor gameobjects to find the nearest
        var (distance, closestObject) = foundOrCreatedAnchorGameObjects.Aggregate(
            new Tuple<float, GameObject>(Mathf.Infinity, null),
            (minPair, gameobject) =>
            {
                Vector3 gameObjectPosition = gameobject.transform.position;
                float distance = (position - gameObjectPosition).magnitude;
                return distance < minPair.Item1 ? new Tuple<float, GameObject>(distance, gameobject) : minPair;
            });

        if (distance <= 0.15f)
        {
            //Found an anchor within 15cm
            anchorGameObject = closestObject;
            return true;
        }
        else
            return false;
    }
```
We can now extend our `ShortTap` method to include the `ASA_DeleteAnchor` call
```csharp
    private async void ShortTap(Vector3 handPosition)
    {
        await ASA_StartSession();
        if (!IsAnchorNearby(handPosition, out GameObject anchorGameObject))
        {
            //No Anchor Nearby, start session and create an anchor
            await ASA_CreateAnchor(handPosition);
        } else
        {
            //Delete nearby Anchor
            ASA_DeleteAnchor(anchorGameObject);
        }
    }
```

## Try it

------------------------------
# Archive
## Place an object in the real world
Let's create & place an object using your app. Open the Visual Studio solution that we created when we [deployed our app](#trying-it-out).

First, add the following imports into your `Assembly-CSharp (Universal Windows)\Scripts\AzureSpatialAnchorsScript.cs`:

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=19-24)]

Then, add the following members variables into your `AzureSpatialAnchorsScript` class:

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=26-47,53-57,65-84)]

Before we continue, we need to set the sphere prefab we created on our spherePrefab member variable. Go back to **Unity**.
1. In **Unity**, select the **MixedRealityCloud** object in the **Hierarchy** pane.
2. Click on the **Sphere** prefab that you saved in the **Project** pane. Drag the **Sphere** you clicked on into the **Sphere Prefab** area under **Azure Spatial Anchors Script (Script)** in the **Inspector** pane.

You should now have the **Sphere** set as the prefab on your script. Build from **Unity** and then open the resulting **Visual Studio** solution again, like you just did in [Trying it out](#trying-it-out).

In **Visual Studio**, open up `AzureSpatialAnchorsScript.cs` again. Add the following code into your `Start()` method. This code will hook up `GestureRecognizer`, which will call `HandleTap` when it detects an air tap.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=86-95,98&highlight=4-10)]

We now have to add the following `HandleTap()` method below `Update()`. It will do a ray cast and get a hit point at which to place a sphere.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=273-283,305-306,310-318)]

We now need to create the sphere. The sphere will initially be white, but this value will be adjusted later on. Add the following `CreateAndSaveSphere()` method:

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=320-331,396)]

Run your app from **Visual Studio** to validate it once more. This time, tap the screen to create & place your white sphere over the surface of your choice.

## Set up the dispatcher pattern

When working with Unity, all Unity APIs (for example, APIs you use to do UI updates) need to happen on the main thread. In the code we'll write however, we get callbacks on other threads. We want to update UI in these callbacks, so we need a way to go from a side thread onto the main thread. To execute code on the main thread from a side thread, we'll use the dispatcher pattern.

Let's add a member variable, `dispatchQueue`, which is a Queue of Actions. We will push Actions onto the queue, and then dequeue and run the Actions on the main thread.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=43-56&highlight=6-9)]

Next, let's add a way to add an Action to the Queue. Add `QueueOnUpdate()` right after `Update()` :

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=112-122)]

We can use the Update() loop to check if there is an Action queued. If so, we will dequeue the Action and run it.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=100-110&highlight=4-10)]

## Get the Azure Spatial Anchors SDK

### Choose ASA version
[!INCLUDE [Choose SDK Version](../../../includes/spatial-anchors-unity-choose-sdk-version.md)]

### Download packages
[!INCLUDE [Download Unity Packages](../../../includes/spatial-anchors-unity-download-packages.md)]

### Import packages
[!INCLUDE [Import Unity Packages](../../../includes/spatial-anchors-unity-import-packages.md)]

### Prepare code
In your **Visual Studio** solution, add the following import into your `<ProjectName>\Assets\Scripts\AzureSpatialAnchorsScript.cs`:

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=18-21&highlight=1)]

Then, add the following member variables into your `AzureSpatialAnchorsScript` class:

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=53-68&highlight=6-11)]

## Attach a local Azure Spatial Anchor to the local anchor

Let's set up Azure Spatial Anchor's CloudSpatialAnchorSession. We'll start by adding the following `InitializeSession()` method inside your `AzureSpatialAnchorsScript` class. Once called, it will ensure an Azure Spatial Anchors session is created and properly initialized during the startup of your app.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=179-208,211-215)]

We now need to write code to handle delegate calls. We'll add more to them as we continue.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=217-232)]

Now, let's hook your `initializeSession()` method into your `Start()` method.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=86-98&highlight=12)]

Finally, add the following code into your `CreateAndSaveSphere()` method. It will attach a local Azure Spatial Anchor to the sphere that we're placing in the real world.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=320-344,396&highlight=14-25)]

Before proceeding any further, you'll need to create an Azure Spatial Anchors account to get the account Identifier, Key, and Domain. If you don't already have those values, follow the next section to obtain them.

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

## Upload your local anchor into the cloud

Once you have your Azure Spatial Anchors account Identifier, Key, and Domain, go and paste the `Account Id` into `SpatialAnchorsAccountId`, the `Account Key` into `SpatialAnchorsAccountKey`, and the `Account Domain` into `SpatialAnchorsAccountDomain`.

Finally, let's hook everything together. In your `CreateAndSaveSphere()` method, add the following code. It will invoke the `CreateAnchorAsync()` method as soon as your sphere is created. Once the method returns, the code below will update your sphere one last time, changing its color to blue.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=320-397&highlight=26-77)]

Run your app from **Visual Studio** once more. Move around your head and then air tap to place your sphere. Once we have
enough frames, the sphere will turn yellow, and the cloud upload will start. Once the upload finishes, your sphere will
turn blue. Optionally, you can also use the [Output window](/visualstudio/ide/reference/output-window)
while debugging inside **Visual Studio** to monitor the log messages your app is sending. Make sure you deploy the `Debug`
configuration of your app from Visual Studio to see the log messages. You can watch the `RecommendedForCreateProgress`,
and once the upload is complete, you'll be able to see the anchor identifier returned from the cloud.

> [!NOTE]
> If you get "DllNotFoundException: Unable to load DLL 'AzureSpatialAnchors': The specified module could not be found.", you should **Clean** and **Build** your solution again.

## Locate your cloud spatial anchor

One your anchor is uploaded to the cloud, we're ready to attempt locating it again. Let's add the following code into your `HandleTap()` method. This code will:

* Call `ResetSession()`, which will stop the `CloudSpatialAnchorSession` and remove our existing blue sphere from the screen.
* Initialize `CloudSpatialAnchorSession` again. We do this so we're sure the anchor we're going to locate comes from the cloud instead of being the local anchor we created.
* Create a **Watcher** that will look for the anchor we uploaded to Azure Spatial Anchors.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=273-311&highlight=13-31,35-36)]

Let's now add our `ResetSession()` and `CleanupObjects()` methods. You can put them below `QueueOnUpdate()`

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=124-177)]

We now need to hook up the code that will be invoked when the anchor we're querying for is located. Inside `InitializeSession()`, add the following callbacks:

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=206-212&highlight=4-5)]


Now lets add code that will create & place a green sphere once the CloudSpatialAnchor is located. It will also enable screen tapping again, so you can repeat the whole scenario once more: create another local anchor, upload it, and locate it again.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=234-271)]

That's it! Run your app from **Visual Studio** one last time to try out the whole scenario end to end. Move around your device, and place your white sphere. Then, keep moving your head to capture environment data until the sphere turns yellow. Your local anchor will be uploaded, and your sphere will turn blue. Finally, tap your screen once more to remove your local anchor and begin a query for its cloud counterpart. Continue moving your device around until your cloud spatial anchor is located. A green sphere should appear in the correct location, and you can repeat the whole scenario again.

[!INCLUDE [AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md)]