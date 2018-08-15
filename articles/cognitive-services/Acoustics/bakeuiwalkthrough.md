---
title: Acoustics Bake UI | Microsoft Docs
description: Use advanced acoustics and spatialization in your Unity title
services: cognitive-services
author: kegodin
manager: noelc
ms.service: cognitive-services
ms.component: acoustics
ms.topic: article
ms.date: 08/03/2018
ms.author: kegodin
---
# Acoustics Bake UI for Unity
This document describes the process of submitting an acoustics bake using the Unity editor extension. For more background on acoustics, see [What is Acoustics](what-is-acoustics.md).

## Import the plugin
Import the Acoustics plugin package to your project. Then open the Acoustics UI by choosing **Window > Acoustics** from the Unity menu:

![Open Acoustics Window](media/WindowAcoustics.png)

## Principles
The Acoustics tool window gathers the information the acoustics engine needs to calculate the acoustics for your scene. There are four pre-bake steps:
1. Create or mark your player navigation mesh
2. Mark acoustics geometry
3. Assign acoustic materials properties to geometry
4. Preview probe placement, and bake

After the bake is complete, see [Design Process](designprocess.md) for optional post-bake design steps.

## Create or mark a navigation mesh
A navigation mesh is used to place probe points for simulation. You can use Unity's included [navigation mesh workflow](https://docs.unity3d.com/Manual/nav-BuildingNavMesh.html)), or you can specify your own navigation mesh. Navigation meshes created with Unity's workflow will be picked up by the acoustics system. To use your own meshes, mark them from the Objects tab as described in the next step.

## Objects tab
Open the **Objects** tab of the Acoustics window. Use this tab to mark objects in your scene, which simply adds the AcousticsGeometry or AcousticsNavigation components to the object. You can also use the [standard component workflow](https://docs.unity3d.com/Manual/UsingComponents.html) to mark or unmark objects.

If you have nothing selected in your scene, it will look like the following picture:

![Objects Tab No Selection](media/ObjectsTabNoSelectionDetail.png)

If you have something selected in your scene or hierarchy window, it will look like the following picture:

![Objects Tab No Selection](media/ObjectsTabWithSelectionDetail.png)

### Objects tab parts
The parts of the tab page are:
* Available filters for the hierarchy window
* When no objects are selected, the filter shows the status of the objects in the scene:
   - Total - The total number of active, non-hidden objects in the scene.
   - Mesh - The number of Mesh Renderer objects in the scene
   - Terrain - The number of Terrain objects in the scene
   - Geometry - The number of objects in the scene marked as "Acoustics Geometry"
   - Navigation - The number of objects in the scene marked as "Acoustics Navigation". This number doesn't include Unity's NavMesh.
* Shows the total number of 'mark-able' objects in the scene, which is only Mesh Renderers and Terrains. Shows checkboxes you can use to mark (add the appropriate component to) those objects as geometry or navigation for acoustics
* When nothing is selected, this note reminds you to select objects for marking if needed. You can also check one or both checkboxes to mark all the objects without selecting anything.
* When objects are selected, this tab shows the status of only the selected objects.
* Shows the total number of 'mark-able' selected objects. Changing the values in the checkboxes will mark or unmark all the selected objects.

Only Mesh Renderers and Terrains can be marked. All other object types will be ignored. The checkboxes will mark or unmark all of the affected objects.

If some objects are marked and some aren't, the appropriate checkbox will show a "mixed" value:

![Mixed Value Checkbox](media/MixedObjectSelectionDetail.png)
    
Clicking the checkbox will force all objects to be marked, and clicking again will unmark all the objects.

Objects can be marked for both geometry and navigation.

To unmark meshes or terrain for acoustics, select it and uncheck the "Acoustics Geometry" checkbox.
![Bake Geometry](media/BakeObjectsTabGeometry.png)

### Guidelines for marking objects
Be sure to mark any objects as "Acoustics Geometry" if they should occlude, reflect, or absorb sound. Acoustics geometry can include things like ground, walls, roofs,  windows & window glass, rugs, and large furniture. It's okay to include smaller objects such as lamps, decorative items, light fixtures, as they don't appreciably increase the bake cost. It's important to not miss major elements such as the ground or a ceiling. Also, don't include things that shouldn't affect the acoustics, such as collision meshes.

The object's transform at the time of the bake is fixed in the bake results. Moving any of the marked objects in the scene will require rebaking the scene.

## Materials Tab
Once your objects are marked, go to the **Materials** tab.

### Parts of the Materials tab

![Materials Tab Detail](media/MaterialsTabDetail.png)

1. The **Materials** tab button, used to bring up this page.
2. A brief description of what you need to do using this page.
3. When checked, only materials used by objects marked as "Acoustics Geometry" will be listed. Otherwise, all materials used in the scene will be listed.
4. Use these options to change the order of the dropdown menu that is shown when you click a dropdown in the Acoustics column below (#6). "Name" sorts the acoustic materials by name,
"Absorptivity" sorts them in order of absorptivity from low to high.
5. The list of materials used in the scene, sorted alphabetically. If the "Show Marked Only" checkbox is checked (#3), only materials used by objects marked as "Acoustics Geometry" are shown. Clicking on a material here will select
all objects in the scene that use that material.
6. Shows the acoustic material that the scene material has been assigned to. Click a dropdown to reassign a scene material to a different acoustic material. You can change the sorting order of the menu shown when you click an item here using the "Sort Acoustics By:" options above (#4).
7. Shows the acoustic absorption coefficient of the material selected in the previous column. A value of zero means perfectly reflective (no absorption), while a value of 1 means perfectly absorptive (no reflection). The absorption coefficient can't be changed unless the selected material is "Custom".
8. For a material assigned to "Custom", the slider is no longer disabled and you can choose the absorption coefficient using the slider or by typing in a value.

![Reverb Time Graph](media/ReverbTimeGraph.png)

For some thoughts on choosing material properties, see [Design Process](designprocess.md).

### Guidelines for assigning materials (or absorption values)
This tab is initially populated with absorption value guesses based on string matching. For example, if your scene material name is LivingRoom_WoodTable, the initial acoustic material assigned to it will be "wood". Materials for which matches aren't found are assigned the "Default" material, which has absorption similar to concrete. 

You can reassign acoustic materials to each scene material. For example, if a room sounds too reverberant, change the acoustic material of the walls, floor, or ceiling to something of higher absorptivity. The acoustic material assignment applies to all objects that use that scene material.

## Probes Tab
After assigning the materials, switch to the **Probes** tab.

### Parts of the Probes tab

![Probes Tab Detail](media/ProbesTabDetail.png)

1. The **Probes** tab button used to bring up this page
2. A brief description of what you need to do using this page
3. Use these to choose a coarse or fine simulation resolution. Coarse is faster, but has certain tradeoffs. See ["Coarse vs Fine Resolution"](#Coarse-vs-Fine-Resolution) below for details.
4. Choose the location where the acoustics data files should be placed using this field. Click the button with "..." to use a folder picker. The default is **Assets/AcousticsData**.
An **Editor** subfolder will also be created under this location. For more information about data files, see ["Data Files"](#Data-Files) below.
5. The data files for this scene will be named using the prefix provided here. The default is "Acoustics_[Scene Name]".
6. After the probes have been calculated, the controls above will be disabled. Click the **Clear** button to erase the calculations and enable the controls so that you can re-calculate using new settings.
7. Click the **Calculate...** button to voxelize the scene and calculate the probe point locations. This is done locally on your machine, and must be done prior to doing a bake.

Probes can't be placed manually and must be placed through the automated process provided in the **Probes** tab.

### What does the "Calculate..." button calculate?
The **Calculate...** button takes all the data you have provided so far (geometry, navigation, materials, and the Coarse/Fine setting) and goes through several steps:
1. It takes the geometry from the scene meshes and calculates a voxel volume. The voxel volume is a 3-dimensional volume that encloses your entire scene, and is made up of small cubic "voxels". 
The size of the voxels is determined by the simulation frequency, which is set by the **Simulation Resolution** setting. Each voxel is marked as being either "open air" or containing scene geometry.
If a voxel contains geometry then the voxel is tagged with the absorption coefficient of the material assigned to that geometry.
2. It then uses the navigation data to calculate acoustically interesting locations where the player might go. It tries to find a reasonably small set of these locations that includes smaller areas such as doorways and hallways,
and then to rooms, to open spaces.
3. For each of the final listener locations it computes, it determines a number of parameters such as how "open" is the space, the size of the room it is in, etc.
4. The results of these calculations are stored in files at the location you specify (See ["Data Files"](#Data-Files) below)

Depending on the size of your scene and the speed of your machine, these calculations can take anywhere from 1 minute to 15 minutes or more.

Once these calculations are complete you can preview both the voxel data and the probe point locations to help ensure that the bake will give you good results. Things like a bad navigation mesh or missing/extra geometry
will typically be quickly visible in the preview so you can correct it.

### Scene rename
The scene name is used to connect the scene to files storing the probe point placement and voxelization. If the scene is renamed after probe points are calculated, the material assignment and placement data is lost and should be re-run.

## Debug display through Gizmos
By default, both the **Probes** and **Voxels** gizmos are turned on. These will show you the voxels and probe point locations that were calculated. They can be enabled or disabled using the Gizmos menu:

![Gizmos Menu](media/GizmosMenu.png)

### Voxels
Voxels are shown in the scene window as green cubes around geometry. Voxels that contain only air are not shown. There is a large green box around your entire scene that denotes the complete voxel volume that will be used in the simulation.
Move around your scene and verify that everything that should be geometry has voxels. The scene camera has to be within about 5 meters of the object for the voxels to show.

If you compare the voxels created with Coarse resolution vs Fine resolution, you will see that the coarse voxels are twice as big.

![Voxel Preview](media/VoxelCubesPreview.png)

### Probe points
Probe points are synonymous with listening locations. When doing a bake, the acoustics for a sound source anywhere in the scene is calculated for each of these probe points. If the player is not directly at a probe point
location, the data from the probe points nearest to the player are used to interpolate the parameters at that location.

Therefore it is important to ensure that probe points exist anywhere the player is expected to travel in the scene, and that small areas and doorways are adequately represented. 
Future versions will allow the ability to edit/add/delete probe points, but for now they cannot be edited. Use them instead to verify the correctness of your geometry marking and of the navigation hint data.

![Probes Preview](media/ProbesPreview.png)

### Coarse vs fine resolution
The only difference between the Coarse and Fine resolution settings is the frequency at which the simulation is performed. Fine uses a frequency twice as high as Coarse.
While this may seem simple, it has a number of implications on the acoustic simulation:
* The wavelength for Coarse is twice as big as Fine, and therefore the voxels are twice as big
* Because the simulation time is directly related to the voxel size, a Coarse bake is much faster than a Fine bake (approximately 16 times faster!)
* Portals (e.g. doors or windows) smaller than the voxel size cannot be simulated. The Coarse setting may cause some of these smaller portals to not be simulated; therefore, they will not pass sound through at runtime.
You can see if this is happening by viewing the voxels.
* The lower simulation frequency results in less diffraction around corners and edges.
* Sound sources cannot be located inside voxels - this results in no sound. It is more difficult to locate sound sources so they are not inside the larger voxels of Coarse than it is using the Fine setting.
* The larger voxels will intrude more into portals, as shown below. The first image was created using Coarse, while the second is the same doorway using Fine resolution. As indicated by the red markings, there is much less intrusion into
the doorway using the Fine setting. The blue line is the doorway as defined by the geometry, while the red line is the effective acoustic portal defined by the voxel size. How this intrusion
plays out in a given situation depends completely on how the voxels line up with the geometry of the portal.

![Coarse Doorway](media/CoarseVoxelDoorway.png)

![Fine Doorway](media/FineVoxelDoorway.png)

## Bake tab
Once you're happy with the preview data, use the Bake tab to submit your bake to the cloud.

### Parts of the bake tab
![Bake Tab Detail](media/BakeTabDetails.png)

1. The Bake Tab button used to bring up this page.
2. A brief description of what to do on this page.
3. Fields to enter your Azure Credentials once your Azure account has been created. For more details, see [Create Azure Account](CreateAzureAccount.md).
4. Node type to use for the calculation. The node type must be supported by your Azure datacenter location. If not sure, leave at **Standard_F8**
5. Number of nodes to use for this calculation. What number you enter here affects the time to complete the bake and is limited by your Azure Batch core allocation. 
For the fastest possible bake time, set this equal to the number of probe points.
6. Click the Bake button to submit the bake to the cloud.
7. This area shows the status of the bake. When completed, it should show **Downloaded**.
8. If for some reason you need to force Unity to forget about a bake you submitted (e.g. you downloaded the results using another machine), click the button to forget about the job that was submitted. Note that this means the result file, 
when ready, will **not** be downloaded, and **this is not the same as canceling the job**. The job, if running, will continue to run in the cloud. To cancel this job, you'll need to use the [Azure Portal](https://portal.azure.com).

Once you've started a bake, you can leave Unity. Depending on the project, node type, and number of nodes, a cloud bake can take several hours. The bake job status will be updated when you reload
the project and open the Acoustics window. If the job has completed, the output file will be downloaded.

### Reviewing the bake results
After the bake completes, check that the voxels and probe points are in their expected locations by running the runtime plugin. More information is in [Design Process](designprocess.md).

## Data files
There are four data files created by this plugin at various points. Only one of them is needed at runtime, therefore the other three are inside folders named "Editor" so they won't be compiled into your project.
* **Assets/Editor/[SceneName]\_AcousticsParameters.asset**: This file stores the data you enter in fields in the Acoustics UI. The location and name of this file can't be changed.
* **Assets/AcousticsData/[SceneName]\_Acoustics.ace.bytes**: This file stores the bake results and is used by the runtime. The location and name of this file can be changed using the fields on the **Probes** tab.
* **Assets/AcousticsData/Editor/[SceneName]\_Acoustics.vox**: This file stores the voxelized acoustics geometry and the material properties. Computed using the "Calculate..." button on the **Probes** tab. The location and name of this file can be changed using the fields on the **Probes** tab.
* **Assets/AcousticsData/Editor/[SceneName]\_Acoustics\_config.xml**: This file stores parameters computed using the "Calculate..." button on the Probes Tab. The location and name of this file can be changed using the fields on the **Probes** tab.

Take care not to delete the bake result (.ace.bytes file). This file isn't recoverable except by rebaking the scene.

## Next steps
* Apply bake results to sound sources in [Design Process](designprocess.md)
