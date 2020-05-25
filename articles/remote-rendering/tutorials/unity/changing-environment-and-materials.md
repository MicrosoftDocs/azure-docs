---
title: Changing the environment and materials
description: Tutorial that shows how to modify the sky map and object materials in a Unity scene.
author: jakrams
ms.author: jakras
ms.date: 02/03/2020
ms.topic: tutorial
---

# Tutorial: Changing the environment and materials

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Change the environment map of a scene.
> * Modify material parameters.
> * Load custom textures.

## Prerequisites

This tutorial assumes that you are familiar with [Tutorial: Working with remote entities in Unity](working-with-remote-entities.md). However, you only need a Unity project with which you can connect to sessions and load a model, as shown in [Tutorial: Setting up a Unity project from scratch](project-setup.md).

> [!TIP]
> The [ARR samples repository](https://github.com/Azure/azure-remote-rendering) contains prepared Unity projects for all tutorials in the *Unity* folder, that you can use as reference.

## Change the environment map

Azure Remote Rendering supports the use of [sky boxes](../../overview/features/sky.md) (sometimes also called 'environment maps') to simulate ambient lighting. This is especially useful when your objects use *[Physically Based Rendering](../../overview/features/pbr-materials.md)*, as our sample models do. ARR also comes with a variety of built-in sky textures, that we will use in this tutorial.

Create a new script called **RemoteSky** and add it to a new GameObject. Open the script file and replace it with the following code:

```csharp
using Microsoft.Azure.RemoteRendering;
using Microsoft.Azure.RemoteRendering.Unity;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RemoteSky : MonoBehaviour
{
    private int skyIndex = 0;

    private LoadTextureFromSASParams[] builtIns =
    {
        new LoadTextureFromSASParams("builtin://Autoshop", TextureType.CubeMap),
        new LoadTextureFromSASParams("builtin://BoilerRoom", TextureType.CubeMap),
        new LoadTextureFromSASParams("builtin://ColorfulStudio", TextureType.CubeMap),
        new LoadTextureFromSASParams("builtin://Hangar", TextureType.CubeMap),
        new LoadTextureFromSASParams("builtin://IndustrialPipeAndValve", TextureType.CubeMap),
        new LoadTextureFromSASParams("builtin://Lebombo", TextureType.CubeMap),
        new LoadTextureFromSASParams("builtin://SataraNight", TextureType.CubeMap),
        new LoadTextureFromSASParams("builtin://SunnyVondelpark", TextureType.CubeMap),
        new LoadTextureFromSASParams("builtin://Syferfontein", TextureType.CubeMap),
        new LoadTextureFromSASParams("builtin://TearsOfSteelBridge", TextureType.CubeMap),
        new LoadTextureFromSASParams("builtin://VeniceSunset", TextureType.CubeMap),
        new LoadTextureFromSASParams("builtin://WhippleCreekRegionalPark", TextureType.CubeMap),
        new LoadTextureFromSASParams("builtin://WinterRiver", TextureType.CubeMap),
        new LoadTextureFromSASParams("builtin://DefaultSky", TextureType.CubeMap)
    };

    public async void ToggleSky()
    {
        if (!RemoteManagerUnity.IsConnected)
        {
            return;
        }

        skyIndex = (skyIndex + 1) % builtIns.Length;

        var texture = await RemoteManagerUnity.CurrentSession.Actions.LoadTextureFromSASAsync(builtIns[skyIndex]).AsTask();

        Debug.Log($"Switching sky to: {builtIns[skyIndex].TextureId}");

        var settings = RemoteManagerUnity.CurrentSession.Actions.SkyReflectionSettings;

        settings.SkyReflectionTexture = texture;
    }

    private void OnGUI()
    {
        if (RemoteManagerUnity.IsConnected)
        {
            if (GUI.Button(new Rect(10, Screen.height - 50, 175, 30), "Toggle Sky"))
            {
                ToggleSky();
            }
        }
    }
}
```

Note that the `LoadTextureFromSASAsync` variant is used above because built-in textures are loaded. In case of loading from [linked blob storages](../../how-tos/create-an-account.md#link-storage-accounts), use the `LoadTextureAsync` variant. An example for how this works for models can be found in [model loading section](../../concepts/models.md#loading-models).

When you run the code and toggle through the sky maps, you will notice drastically different lighting on your model. However, the background will stay black and you cannot see the actual sky texture. This is intentional, as rendering a background would be distracting with an Augmented Reality device. In a proper application, you should use sky textures that are similar to your real world surroundings, as this will help make objects appear more real.

## Modify materials

In the previous tutorial, we used [state override components](../../overview/features/override-hierarchical-state.md) to change the tint color of selected objects. Now we want to achieve a similar effect, but do so by modifying the [material](../../concepts/materials.md) of an object.

First we need a script to pick objects, as we did in [the second tutorial](working-with-remote-entities.md). If you don't have a **RemoteRaycaster** script yet, create it now. Replace its content with the following code:

```csharp
using Microsoft.Azure.RemoteRendering;
using Microsoft.Azure.RemoteRendering.Unity;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;

[RequireComponent(typeof(ARRServiceUnity))]
public class RemoteRaycaster : MonoBehaviour
{
    public double MaxDistance = 30.0;

    private ARRServiceUnity arrService = null;

    private void Awake()
    {
        arrService = GetComponent<ARRServiceUnity>();
    }

    private async Task<Entity> RemoteRayCast(Vector3 origin, Vector3 dir)
    {
        Entity entity = null;

        var raycast = new RayCast(origin.toRemotePos(), dir.toRemoteDir(), MaxDistance, HitCollectionPolicy.ClosestHit);

        var hits = await arrService.CurrentActiveSession.Actions.RayCastQueryAsync(raycast).AsTask();

        if (hits != null)
        {
            foreach (var hit in hits)
            {
                var hitEntity = hit.HitEntity;
                if (hitEntity == null)
                {
                    continue;
                }

                entity = hitEntity;
                break;
            }
        }

        return entity;
    }

    private RemoteModelEntity focusedModel = null;

    public async void Raycast(Vector3 origin, Vector3 direction)
    {
        var remoteEntity = await RemoteRayCast(origin, direction);

        if (focusedModel != null)
        {
            if (focusedModel.Entity == remoteEntity)
            {
                // picked the same object as before
                return;
            }

            ClearFocus();
        }

        if (remoteEntity == null)
        {
            // picked no object at all
            return;
        }

        // get the instance of a Unity GameObject for the ARR entity
        var entityGO = remoteEntity.GetOrCreateGameObject(UnityCreationMode.DoNotCreateUnityComponents);

        // ensure the game object has the RemoteModelEntity component
        focusedModel = entityGO.GetComponent<RemoteModelEntity>();
        if (focusedModel == null)
        {
            focusedModel = entityGO.AddComponent<RemoteModelEntity>();
        }

        focusedModel.SetFocus(true);
    }

    private void ClearFocus()
    {
        focusedModel.SetFocus(false);
        CleanHierarchy(focusedModel.gameObject);
        focusedModel = null;
    }

    private void CleanHierarchy(GameObject focusedGO)
    {
        var sync = focusedGO?.GetComponent<RemoteEntitySyncObject>();
        if (sync == null || !sync.IsEntityValid)
        {
            return;
        }

        sync.Entity.DestroyGameObject(EntityExtensions.DestroyGameObjectFlags.DestroyEmptyParents | EntityExtensions.DestroyGameObjectFlags.KeepRemoteRoot);
    }

    private void Update()
    {
        if (!RemoteManagerUnity.IsConnected)
        {
            return;
        }

        Vector3 position = Input.mousePresent ? Input.mousePosition : new Vector3(Screen.width / 2, Screen.height / 2, 0);
        var ray = Camera.main.ScreenPointToRay(position);

        Raycast(ray.origin, ray.direction);
    }
}
```

Add the component to your *RemoteRendering* game object. It is responsible for picking objects under the mouse and adding *RemoteModelEntity* components to the picked objects. That component class is where we implement the actual material change functionality.

If you don't have a **RemoteModelEntity** script yet, create it and replace its content with this code:

```csharp
using UnityEngine;
using Microsoft.Azure.RemoteRendering;
using Microsoft.Azure.RemoteRendering.Unity;

// to prevent namespace conflicts
using ARRTexture = Microsoft.Azure.RemoteRendering.Texture;

public class RemoteModelEntity : MonoBehaviour
{
    private Color HighlightColor = new Color(1.0f, 0.4f, 0.1f, 1.0f);

    public Entity Entity => localSyncObject != null ? localSyncObject?.Entity : null;
    private RemoteEntitySyncObject localSyncObject = null;
    private ARRMeshComponent meshComponent = null;
    private Color4 originalColor;

    public void OnEnable()
    {
        localSyncObject = GetComponent<RemoteEntitySyncObject>();

        meshComponent = GetComponent<ARRMeshComponent>();
        if (meshComponent == null)
        {
            var mesh = localSyncObject.Entity.FindComponentOfType<MeshComponent>();
            if (mesh != null)
            {
                gameObject.BindArrComponent<ARRMeshComponent>(mesh);
                meshComponent = gameObject.GetComponent<ARRMeshComponent>();
            }
        }
        meshComponent.enabled = true;
    }

    public void SetFocus(bool on)
    {
        SetMaterialColor(on);
    }

    private void SetMaterialColor(bool on)
    {
        if (!meshComponent.IsComponentValid)
        {
            return;
        }

        // get the list of materials from the picked mesh
        // we only modify the first material; depending on how the model is authored, this may
        // work exactly as desired, or not ;-)
        var materials = meshComponent.RemoteComponent.Mesh.Materials;
        if (materials == null || materials.Count == 0)
        {
            return;
        }

        // there are different types of materials, cast as necessary
        if (materials[0].MaterialSubType == MaterialType.Color)
        {
            var materialColor = materials[0] as ColorMaterial;

            if (on)
            {
                // modify the color of the material
                originalColor = materialColor.AlbedoColor;
                materialColor.AlbedoColor = HighlightColor.toRemoteColor4();
            }
            else
            {
                materialColor.AlbedoColor = originalColor;
            }
        }
        else if (materials[0].MaterialSubType == MaterialType.Pbr)
        {
            var materialColor = materials[0] as PbrMaterial;

            if (on)
            {
                // modify the color of the material
                originalColor = materialColor.AlbedoColor;
                materialColor.AlbedoColor = HighlightColor.toRemoteColor4();
            }
            else
            {
                materialColor.AlbedoColor = originalColor;
            }
        }
    }
}
```

When you run this code, objects that you hover of with the mouse get highlighted. The effect is similar to what we did in tutorial 2, but the way it is achieved is different. Here we get the list of materials on the picked object and then modify the first one to have a different albedo color.

> [!IMPORTANT]
> Please be aware that whether this method highlights the correct parts of a model, depends on how a model is authored. It will work perfectly, if every object uses exactly one material. However, if the model does not have a 1:1 relation between parts and materials, the naive code above will not do the right thing.

## Use a different texture

[Textures](../../concepts/textures.md) are typically part of a source model. During [model conversion](../../quickstarts/convert-model.md), all textures are converted to the necessary runtime format and packaged into the final model file. To replace a texture at runtime, you need to save it in [DDS file format](https://en.wikipedia.org/wiki/DirectDraw_Surface) and upload it to Azure blob storage. Consult [this quickstart guide](../../quickstarts/convert-model.md) for how to create an Azure blob container. Once you have a blob container, you can open it in Azure Storage Explorer and upload your file via drag and drop.

On the runtime side, you can address a texture asset in blob storage in two distinct ways:

* Address texture by its SAS URI. For that, right-click on the uploaded file and select "**Get Shared Access Signature...**" from context menu. Use this SAS URI with the `LoadTextureFromSASAsync` function variant (see sample code below).
* Address the texture by blob storage parameters directly, in case the [blob storage is linked to the account](../../how-tos/create-an-account.md#link-storage-accounts). Relevant loading function in this case is `LoadTextureAsync`.

Now open the **RemoteModelEntity** script, add the following code, and remove duplicate functions:

```csharp
    private string textureFile = ""; //<SAS URI for your texture>
    private ARRTexture originalTexture = null;

    private async void SetMaterialTexture(bool on)
    {
        if (!meshComponent.IsComponentValid)
        {
            return;
        }

        var materials = meshComponent.RemoteComponent.Mesh.Materials;
        if (materials == null || materials.Count == 0)
        {
            return;
        }

        ARRTexture newTexture = originalTexture;

        if (on)
        {
            var textureParams = new LoadTextureFromSASParams(textureFile, TextureType.Texture2D);

            newTexture = await RemoteManagerUnity.CurrentSession.Actions.LoadTextureFromSASAsync(textureParams).AsTask();
        }

        if (materials[0].MaterialSubType == MaterialType.Color)
        {
            var materialColor = materials[0] as ColorMaterial;

            originalTexture = materialColor.AlbedoTexture;
            materialColor.AlbedoTexture = newTexture;
        }
        else if (materials[0].MaterialSubType == MaterialType.Pbr)
        {
            var materialColor = materials[0] as PbrMaterial;

            originalTexture = materialColor.AlbedoTexture;
            materialColor.AlbedoTexture = newTexture;
        }
    }

    public void SetFocus(bool on)
    {
        if (string.IsNullOrEmpty(textureFile))
        {
            SetMaterialColor(on);
        }
        else
        {
            SetMaterialTexture(on);
        }
    }
```

Run this code and hover over your model. If your model has proper UV coordinates, you should see your texture appear. Otherwise, you may only notice a color change.

## Next steps

That concludes our introduction series on how to use Azure Remote Rendering with Unity. As a next step you should familiarize yourself some fundamental concepts of ARR, such as [sessions](../../concepts/sessions.md), [entities](../../concepts/entities.md), and [models](../../concepts/models.md) to build a deeper understanding. There are also various features like [lights](../../overview/features/lights.md), [outline rendering](../../overview/features/outlines.md), [hierarchical state overrides](../../overview/features/override-hierarchical-state.md), and [materials](../../concepts/materials.md) that you should explore in more detail.

> [!div class="nextstepaction"]
> [Unity game objects and components](../../how-tos/unity/objects-components.md)
