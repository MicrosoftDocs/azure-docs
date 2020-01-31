---
title: Changing the environment and materials
description: Tutorial that shows how to modify the sky map and object materials in a scene.
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 02/03/2020
ms.topic: tutorial
ms.service: azure-remote-rendering
---

# Tutorial: Changing the environment and materials

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Change the environment map of a scene.
> * Modify material parameters.
> * Load custom textures.

## Prerequisites

This tutorial builds on top of [Tutorial: Working with remote entities in Unity](tutorial-2-working-with-remote-entities.md).

## Modify the environment map

Azure Remote Rendering supports the use of [sky boxes](../sdk/features-sky.md) (sometimes also called 'environment maps') to simulate ambient lighting. This is especially useful when your objects use *[Physically Based Rendering](../sdk/concepts-materials.md#pbr-material)*, as our sample models do. ARR also comes with a variety of built-in sky textures, that we will use in this tutorial.

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

    private LoadTextureParams[] builtIns =
    {
        new LoadTextureParams("builtin://GreenPointPark", TextureType.CubeMap),
        new LoadTextureParams("builtin://SataraNight", TextureType.CubeMap),
        new LoadTextureParams("builtin://SnowyForestPath", TextureType.CubeMap),
        new LoadTextureParams("builtin://SunnyVondelpark", TextureType.CubeMap),
        new LoadTextureParams("builtin://Syferfontein", TextureType.CubeMap),
        new LoadTextureParams("builtin://TearsOfSteelBridge", TextureType.CubeMap),
        new LoadTextureParams("builtin://VeniceSunset", TextureType.CubeMap),
        new LoadTextureParams("builtin://WhippleCreekRegionalPark", TextureType.CubeMap),
        new LoadTextureParams("builtin://WinterEvening", TextureType.CubeMap),
        new LoadTextureParams("builtin://WinterRiver", TextureType.CubeMap),
        new LoadTextureParams("builtin://DefaultSky", TextureType.CubeMap)
    };

    public async void ToggleSky()
    {
        if (!RemoteManagerUnity.IsConnected)
        {
            return;
        }

        skyIndex = (skyIndex + 1) % builtIns.Length;

        var texture = await RemoteManagerUnity.CurrentSession.Actions.LoadTextureAsync(builtIns[skyIndex]).AsTask();

        Debug.Log($"Switching sky to: {builtIns[skyIndex].TextureId}");

        var settings = RemoteManagerUnity.CurrentSession.Actions.GetSkyReflectionSettings();

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

When you run the code and toggle through the sky maps, you will notice drastically different lighting on your model. However, the background will stay black and you cannot see the actual sky texture. This is intentional, as rendering a background would be distracting with an Augmented Reality device. In a proper application, you should use sky textures that are similar to your real world surroundings. This will help make the object appear more real.









## Modify materials

In the previous tutorial, when the mouse was over a part of the model, it had changed its [HierarchicalState](../sdk/features-override-hierarchical-state.md)'s tint property, which changed the object's color. To instead change an object's material, you need to modify the [material](../sdk/concepts-materials.md) property.

The material property is part of the `RemoteComponent.Mesh` object. Continuing on from the previous RemoteModelEntity.cs file, add the following properties:

```csharp
    public Color HighlightColor = new Color(1.0f, 0.0f, 0.0f, 0.1f);
    private Color4? originalColor = null;
```

A trivial function would be to swap the albedo color for the material. Add the following to the file:

```csharp
    private void ToggleMaterialColor()
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

        toggleColor = !toggleColor;

        if (materials[0].MaterialSubType == MaterialType.Color)
        {
            var materialColor = materials[0] as ColorMaterial;

            // store the original albedo color
            if (originalColor.HasValue)
            {
                originalColor = materialColor.AlbedoColor;
            }

            // set the color with either original or highlight color
            if (toggleColor)
            {
                materialColor.AlbedoColor = HighlightColor.toRemoteColor4();
            }
            else
            {
                materialColor.AlbedoColor = originalColor.Value;
            }
        }
        else if (materials[0].MaterialSubType == MaterialType.Pbr)
        {
            var materialColor = materials[0] as PbrMaterial;

            // store the original albedo color
            if (originalColor.HasValue)
            {
                originalColor = materialColor.AlbedoColor;
            }

            // set the color with either original or highlight color
            if (toggleColor)
            {
                materialColor.AlbedoColor = HighlightColor.toRemoteColor4();
            }
            else
            {
                materialColor.AlbedoColor = originalColor.Value;
            }
        }
    }
```

To trigger the color change, use the previous OnFocus function and change the SetState call to ToggleMaterialColor:

```csharp
    public bool SetFocus()
    {
        ...

        //SetStateOverride();

        ToggleMaterialColor();

        return true;
    }

    public bool ResetFocus()
    {
        ...

        if (changeColor)
        {
            ToggleMaterialColor();
        }
    }
```

## Modify textures

To change the [texture](../sdk/concepts-textures.md) on a material you first need a valid SAS url for the  file that you want to use.

Continuing with the RemoteModelEntity.cs, add the following:

```csharp
// to prevent namespace conflicts
using ARRTexture = Microsoft.Azure.RemoteRendering.Texture;
```

```csharp
    [SerializeField]
    private string textureFile = "<sas url to a texture>";
    private bool toggleTexture = false;
    private ARRTexture originalTexture = null;
```

```csharp
    private async void ToggleTexture()
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

        toggleTexture = !toggleTexture;

        ARRTexture newTexture = originalTexture;

        if (toggleTexture)
        {
            var textureParams = new LoadTextureParams(textureFile, TextureType.Texture2D);

            newTexture = await RemoteManagerUnity.CurrentSession.Actions.LoadTextureAsync(textureParams).AsTask();
        }

        if (materials[0].MaterialSubType == MaterialType.Color)
        {
            var materialColor = materials[0] as ColorMaterial;

            // store the original albedo texture
            if (originalTexture == null)
            {
                originalTexture = materialColor.AlbedoTexture;
            }

            materialColor.AlbedoTexture = newTexture;
        }
        else if(materials[0].MaterialSubType == MaterialType.Pbr)
        {
            var materialColor = materials[0] as PbrMaterial;

            // store the original albedo texture
            if (originalTexture == null)
            {
                originalTexture = materialColor.AlbedoTexture;
            }

            materialColor.AlbedoTexture = newTexture;
        }
    }
```

Again, change _SetFocus/ResetFocus_ to use the new function:

```csharp
    public bool SetFocus()
    {
        ...

        ToggleTexture();

        //ToggleMaterialColor();
    }

    public void ResetFocus()
    {
        ...

        if (toggleTexture)
        {
            ToggleTexture();
        }
    }
```

## Next steps

TODO

