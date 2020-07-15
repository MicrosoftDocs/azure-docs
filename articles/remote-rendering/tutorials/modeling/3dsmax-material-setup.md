---
title: Set up PBR materials in 3ds Max
description: Explains how to set up physically based rendering materials in 3ds Max and export them into FBX format.
author: muxanickms
ms.author: misams
ms.date: 06/16/2020
ms.topic: tutorial
---
# Tutorial: Set up physically based rendering materials in 3ds Max

## Overview
In this tutorial, you'll learn how to:

>[!div class="checklist"]
>
> * Assign materials with advanced lighting to objects in a scene.
> * Handle instancing of objects and materials.
> * Export a scene to FBX format, and select important options.

Creating [physically based rendering (PBR) materials](../../overview/features/pbr-materials.md) in 3ds Max is a straightforward task. It's similar in many ways to PBR setup in other content-creation apps like Maya. This tutorial is a guide to basic PBR shader setup and FBX export for Azure Remote Rendering projects.

The sample scene in this tutorial contains a number of polygon box objects. They're assigned different materials, like wood, metal, painted metal, plastic, and rubber. Broadly speaking, each material contains all or most of the following textures:

* **Albedo**, which is the material's color map and is also called **Diffuse** and **BaseColor**.
* **Metalness**, which determines if a material is metallic and which parts are metallic. 
* **Roughness**, which determines how rough or smooth a surface is.
It also affects the sharpness or blurriness of the reflections and highlights on a surface.
* **Normal**, which adds detail to a surface without adding more polygons. Examples of detail are pitting and dents on a metal surface or grain in wood.
* **Ambient Occlusion**, which is used to add soft shading and contact shadows to a model. It's a grayscale map that indicates which areas of the model receive full lighting (white) or full shade (black).

## Prepare the scene
In 3ds Max, the process for setting up a PBR material is as follows.

To start, we've created a number of box objects in the sample scene, each of which represents a different type of material.

>[!TIP]
>It's worth noting before you start to create assets for Remote Rendering that it uses meters for measurement.  
>So it's a good idea to set your scene's system units to meters. It's also  a good idea to set **Units** to meters in the FBX export settings when you export a scene.

The following screenshot shows the steps to set the system units to meters in 3ds Max. In the main menu, go to **Customize** > **Units Setup** > **System Units Setup**. In **System Unit Scale**, select **Meters**:
![Screenshot that shows how to set system units.](media/3dsmax/system-units.jpg)

We can now begin to create our models. In the sample scene, we create several box objects, each representing a different material type. For example, metal, rubber, and plastic. 

>[!TIP]
>When you create assets, it's a good practice to name them appropriately as you go. This will make them easier to find later if the scene contains a lot of objects.

The following screenshot shows how to rename objects: 
![Screenshot that shows how to rename objects.](media/3dsmax/rename-objects.jpg)

## Assign materials

With some objects in our scene, in this case a number of cubes, we can begin the PBR setup:

1. On the main toolbar, select the **Material Editor** icon as shown in the following screenshot. You can also select **M** on your keyboard to open the editor. The Material Editor has two modes that you can select in the **Modes** list: **Compact Material Editor** mode and **Slate Material editor** mode. Because this scene is relatively simple, we'll use the compact mode.

1. In the Material Editor, you'll see a number of spheres. These spheres are the materials. We'll assign one of these materials to each object (each box) in the scene. To assign the materials, first select one of the objects in the main viewport. Then select the first sphere in the Material Editor. After it's assigned to an object, the selected material will be highlighted, as shown in the next image.

1. Select **Assign Material to Selection**, as shown. The material is now assigned to the selected object.
![Screenshot that shows how to assign materials.](media/3dsmax/assign-material.jpg)

    In the Material Editor, you can choose from a wide selection of material types, depending on your needs. Typically, the material type is set to **Standard** by default. This material is a basic material that's not suitable for PBR setup, so we'll need to change the material type to a PBR material. Physical Material is the preferred 3ds Max material for Azure Remote Rendering projects.

1. In the Material Editor, select the **Standard** tab. In the **Material/Map Browser**, select **Physical Material**. This action will convert the assigned **Standard** material to a PBR physical material.
![Screenshot that shows how to change the material.](media/3dsmax/physical-material.jpg)

    In the Material Editor, you now see the properties for the physical material, as shown in the following screenshot.) You can now start to assign textures to the asset.
![Screenshot that shows the list of textures.](media/3dsmax/textures-list.jpg)

As you can see, there are a wide range of maps and textures that can be added to the material. For this tutorial, we'll use only five texture slots in the material.

>[!TIP]
>It's good practice to name your materials appropriately, as shown in the preceding screenshot.

How you generate your textures can vary according to preference or usage. For example, you might be happy to use tiling textures that can be applied to any asset. Or you might need specific parts of a project or asset to have their own custom sets of textures. You might want to use generic tiling textures that you can get online or create them yourself in apps like Photoshop, Quixel Suite, and Substance Suite.

Before we start to assign textures, we'll need to consider the asset's texture coordinates (UVW). It's a best practice when applying any textures to a model to ensure that the model is unwrapped. (Textures won't display properly without proper UV unwrapping.) It's especially important for our purposes because we want to use an Ambient Occlusion (AO) map on our model. Unlike Stingray Shader in Maya, Physical Material in 3ds Max doesn't have a dedicated AO texture slot. So we'll apply the AO map to another slot. To allow it to be used separately from the other textures (tiling textures for example), we'll assign it a UVW map channel of its own. 

We'll start by assigning an unwrap UVW modifier to the model, as shown in the following screenshot. 

- In the selected objects properties editor, select the modifier list. In the drop-down list that appears, scroll down and select **Unwrap UVW**. This action will apply an unwrap UVW modifier to the asset.
![Screenshot that shows how to select Unwrap UVW.](media/3dsmax/unwrap-modifier.jpg)

The map channel is set to 1. You'll typically do the main unwrapping in map channel 1. In this case, the object has been unwrapped with no overlapping texture coordinates (UV).
![Screenshot that shows unwrapped texture coordinates (UVW).](media/3dsmax/unwrapped-uvw.jpg)

The next step is to create a second UV map channel.

1. Close the UV editor if it's open. In the **Channel** section of the **Edit UVs** menu, change the channel number to **2**. Map channel 2 is the expected channel for AO maps. 

1. In the **Channel Change Warning** dialog box, you'll have the option to either **Move** the existing UVs in channel 1 into the new channel 2 or **Abandon** the existing UVs that will create a new UV unwrap automatically. Select **Abandon** only if you plan to create a new UV unwrap for the AO map that differs from the UVs in map channel 1. (For example, if you want to use tiling textures in channel 1.) In this tutorial, we'll move the UVs from channel one to channel 2 because we don't need to edit the new UV channel.

>[!NOTE]
>Even if you've copied (moved) the UV unwrap from map channel 1 into map channel 2, you can make any necessary edits to the new channel UVs without affecting the original map channel.

![Screenshot that shows the Channel Change Warning.](media/3dsmax/channel-change.jpg)

Now that the new map channel is created, we can return to the physical material in the Material Editor and start to add our textures to it. First we'll add the AO map because there's a further step to allow it to work correctly. After the AO map is plugged in to our material, we need to configure it to use map channel 2.

As noted earlier, there's no dedicated slot for AO maps in the 3ds Max physical material. We'll instead apply the AO map to the **Diffuse Roughness** slot.

1. In the physical material's **Generic Maps** list, select the **No Map** slot next to **Diffuse Roughness** and load your AO map.

1. In the AO textures properties, the map channel is set to **1** by default. Change this value to **2**. This action completes the steps necessary to add your AO map.

>[!IMPORTANT]
>This is an important step, particularly if your UVs in channel 2 are different from those in channel 1, because the AO won't map correctly if the wrong channel is selected.

![Screenshot that shows how to assign an AO map.](media/3dsmax/assign-ao-map.jpg)

We'll now assign the normal map to the PBR material. This action differs somewhat from the process in Maya. The normal map isn't applied directly to the bump map slot. (There's no normal map slot in the 3ds Max physical material.) Instead, you add the normal map to a normal map modifier, which itself is plugged into the normal's slot.

1. In the **Special Maps** section of the physical material properties (in the Material Editor), select the **No Map** slot next to **Bump Map**. 

1. In the **Material/Map Browser**, locate and select **Normal Bump**. This action will add a **Normal Bump** modifier to the material.

1. In the **Normal Bump** modifier, select **No Map** next to **Normal**. Locate and load your normal map.

1. Make sure the method is set to **Tangent**. (It should be, by default.) If necessary, toggle **Flip Green (Y)**.

![Screenshot that shows how to select Normal Bump.](media/3dsmax/normal-bump.jpg)
![Screenshot that shows loading the normal map.](media/3dsmax/load-normal-map.jpg)

With the normal map correctly assigned, we can assign the remaining textures to complete the physical material setup. This process is a simple. There are no special settings to consider. The following screenshot shows the full set of textures assigned to the material: 
![Screenshot that shows the full set of textures assigned to the material.](media/3dsmax/all-textures.jpg)

Now that the PBR materials are created and set up, it's worth thinking about instancing objects in the scene. Instance similar objects in the scene, like nuts, bolts, screws, and washers. Any objects that are the same can yield significant savings in terms of file size. Instances of a master object can have their own scale, rotation, and transforms, so they can be placed as needed in your scene. In 3ds Max, the process of instancing is simple.

1. In the main viewport, select the object or objects that you want to export.

1. Hold the **Shift** key and drag the assets upwards by using the transform (move) tool. 

1. In the **Clone Options** dialog box, set **Object** to **Instance** and then select **OK**. 
![Screenshot of the Clone Options dialog box.](media/3dsmax/instance-object.jpg)

This action will create an instance of your object that can be moved, rotated, or scaled independently of its parent and of other instances of that parent.

>[!IMPORTANT]
>Any changes you make to an instance while you're in sub object mode will be transmitted to all instances of the object. So if you're working with an instanced object's  components, like vertices and polygon faces, be sure that you want any changes you make to affect all of the instances. Remember that any instanced object can be made into a unique object at any time. 

>[!TIP]
>When instancing in your scene, it's a good idea to create instances as you go along. Replacing copies with instanced objects later is difficult. 

One final thing to take into consideration before we move on to the export process is how you might want to package your scene/asset for sharing. Ideally, if you pass the asset on to a client or team member, you'll want them to be able to open and view the asset as it should be seen with a minimum amount of fuss. So it's important to keep your asset's texture paths relative to the scene file. If the texture paths for your asset are pointing to a local drive or absolute path/location, they won't load into the scene if opened on a different computer, even if the .max file is in the same folder as the textures. Making the texture paths relative in 3ds Max solves this problem and is fairly simple.

1. On the main toolbar, go to **File** > **Reference** > **Asset Tracking Toggle**. 

1. In the Asset Tracking window, you'll see all or most of the textures that you've applied to your PBR materials listed in the **Maps/Shaders** column.

1. Next to them, in the **Full Path** column, you'll see the path of the location of your textures, most likely the path of their location on your local machine.

1. Finally, you'll see a column called **Status**. This column indicates whether a given texture has been located and applied to your scene. It will flag the texture with one of these terms: **Ok**, **Found**, or **File Missing**. The first two indicate that the file has been found and loaded. The last obviously means that the tracker has failed to locate the file.
![Screenshot that shows the Asset Tracking window.](media/3dsmax/texture-paths.jpg)

You might notice that not all of your textures are listed in the Asset Tracking window when you first open it. This is nothing to be concerned about. Running through the path-finding process once or twice usually finds all of a scene's textures. The path-finding process is as follows: 

1. In the Asset Tracking window, hold down the **Shift** key and select the top texture in the **Maps/Shaders** list, and, continuing to hold **Shift**, select the last texture in the list. This action will select all the textures in the list. The selected textures will be highlighted in blue. (See the preceding screenshot.)

1. Right-click the selection and select **Set Path**.

1. In the **Specify Asset Path** box, select the local path to your textures and replace it with `.\`.  Select **OK**. 

    The Asset Tracking window will update as shown in the following screenshot. This might take a while, depending on how many textures are in your scene and on how large your scene is.
![Screensthot that shows the updated Asset Tracking window.](media/3dsmax/resolve-textures.jpg)

Notice that the **Full Path** column is now blank. It means that the scene is no longer looking for the relevant textures in a specific (absolute) location but will always find them as long as the .max file or related FBX file is in the same folder as the textures. 

>[!NOTE]
>You might have to repeat this process a couple of times to find and resolve all textures and paths. This is nothing to be concerned about. Just repeat the process until all relevant assets are accounted for. In some cases, some files won't be found. In that case, simply select all the assets in the list and then select **Remove Missing Paths**. (See the preceding image.)

## FBX export

With the asset tracking complete, we can now move on to the FBX export. Again, the process is simple and can be done in a couple of ways. 

>[!TIP]
>It is good practice that unless you wish to export your entire scene, you select for export only those assets which are needed. In particularly resource intensive scenes, export can take a long time so it makes sense to export only what you need
>
>It is advisable that if you have used modifiers such as **Turbosmooth** or **Open SubDiv** etc that you collapse them before export as they can cause problems during export. Always save your scene before doing this! 

* In the scene, select those assets that you want to export and in the main toolbar, go to **File** > **Export** > **Export Selected**

* In the **Select File to Export** dialog, type or select output file name and in the **Save as Type** options select **Autodesk (*.fbx)**. This action will open the FBX export menu. 

* Remember, if you have created instances in your scene that it is important that **Preserve Instances** is toggled on in the FBX export settings. 
![fbx-export](media/3dsmax/fbx-export.jpg)

Remember that previously it was mentioned that there were a couple of ways to export our file. If the intention when exporting is that the FBX is to be shared along with its textures files in a folder/directory, then the settings shown in the image below should apply and work well. Once you have selected your settings, click **OK**.
![fbx-settings](media/3dsmax/fbx-settings.jpg)

However, if you would prefer not to share large folders/directories of textures along with the FBX you can choose to **Embed** the textures in the FBX. It means that the entire asset - textures included - will be added to a single FBX. Be aware though, while it combines your export into a single asset that the FBX file will be considerably larger as a result.

>[!IMPORTANT]
>If your result FBX file is bigger than 2.4GB then the minimum version of FBX export settings (see above) should be 2016 or newer. Because newer versions have 64 bit support and thus support bigger files.

* In the FBX export settings, toggle on **Embed Media, then click **OK** to export with textures included. 

On exporting to FBX while using the Physical Material, you will likely see the following warning pop-up after clicking 'OK' in the export dialogue: 
![export-warnings](media/3dsmax/export-warnings.jpg)

This warning simply informs the user that the exported materials may not be compatible with other software packages. As the physical material is compatible with Azure Remote Rendering, it is nothing to worry about. Simply click **OK** to complete the process and close the window.

## Conclusion

In general, this type of material looks more realistic because it's based on the real-world physics of light. It creates an additional immersive effect so that the scene appears to exist in the real world.

## Next steps

You now know how to set up materials with advanced lighting for objects in a scene. You also know how to export the objects to FBX format that's supported by Azure Remote Rendering. The next step is to convert the FBX file and visualize it in Azure Remote Rendering.

>[!div class="nextstepaction"]
>[Quickstart: Convert a model for rendering](../../quickstarts\convert-model.md)