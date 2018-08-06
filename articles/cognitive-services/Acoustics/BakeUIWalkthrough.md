---
title: Acoustics bake process | Microsoft Docs
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
# Unity Bake UI
This is a detailed guide for using the Acoustics tool window to do an Acoustics bake. For more information about what Microsoft Acoustics is, check out the [Introduction to Microsoft Acoustics](AcousticsIntro.md).

## Importing the plugin
Import the Acoustics plugin package to your project by following the instructions on the [Getting Started](GettingStarted.md) page. Then open the Acoustics UI by choosing Window > Acoustics from the Unity menu:

![Open Acoustics Window](media/WindowAcoustics.png)
# Principles
The Acoustics tool window is designed to make it easy for you to quickly provide all the information the acoustics engine needs to calculate the acoustics data for your scene. There are 5 steps you will follow:
1. Decide how you will provide a navigation mesh, and run through the Unity navigation workflow if necessary
2. Mark the geometry in your scene that should be used in the acoustics calculations, as well as any custom navigation meshes
3. Assign acoustic properties to the materials used by the geometry you marked
4. Calculate and preview probe locations and voxels
5. Bake in the cloud

Once step 5 is complete, your project will contain a data file that is used by the Acoustics Spatializer to give you realistic acoustics in your scene. See the [Getting Started](GettingStarted.md) page for more information on setting up the runtime environment.

You will perform steps 2 through 5 using the Acoustics tool window, which is described in detail in this document.

# Unity Navigation vs. Custom Navigation (or no navigation)
You will generally want to provide some sort of navigation hints to the acoustics engine so that it does not spend a lot of time calculating acoustics data for areas the player will never go.
The easiest way to do this is by using the navigation workflow provided within Unity. If a Unity NavMesh has been created the acoustics engine will use this to limit the locations where the acoustic simulations are performed, dramatically saving time and money
performing the bake and shrinking the size of the resulting data file used at runtime.

If you can use the Unity navigation workflow, or already use it in your project, this is the simplest way to provide navigation hints to the acoustics engine. You can see instructions for doing this on the Unity documentation page to [Create a Unity Navigation Mesh](https://docs.unity3d.com/Manual/nav-BuildingNavMesh.html).

If you can't or don't want to use the Unity navigation workflow, then you can provide navigation hints by marking one or more meshes in your project for "Acoustics Navigation". This is done on the Objects tab of the UI, and the meshes are marked in the same way
as meshes are marked as acoustics geometry. You want to mark all the horizontal surfaces where the player can walk/travel. See the documentation below on the Objects tab UI for more details.

If you use both techniques - that is, you have a Unity NavMesh **and** mark meshes as "Acoustics Navigation" - then both will be used as hints by the acoustics engine.

It is recommended that you provide navigation hints, and if you attempt to create the probe preview without any you will get a warning. This is because without navigation hints the acoustics engine will calculate acoustics
for listening locations across the entire cubic volume of your scene, which can be quite time consuming and expensive. However, if your project allows the player to get to literally any location in the scene (e.g. they can fly), then this may be
necessary. In this case, you can use some of the information in the Advanced Parameters section to try and reduce the number of probe points/listening locations that are simulated.

# Objects Tab
After creating your Unity NavMesh (if applicable), open the Acoustics tool window. The first tab you will see is the Objects tab. You use this tab to mark objects in your scene as the geometry for which the acoustics are going to be calculated.
"Marking" an object simply adds the AcousticsGeometry or AcousticsNavigation component to the object. You can also use the [standard component workflow](https://docs.unity3d.com/Manual/UsingComponents.html) to mark or unmark objects.

If you have nothing selected in your scene it will look like this:

![Objects Tab No Selection](media/ObjectsTabNoSelectionDetail.png)

If you have something selected in your scene or hierarchy window, it will look like this:

![Objects Tab No Selection](media/ObjectsTabWithSelectionDetail.png)

The various parts of the tab page are:
1. The tab selection buttons (Objects tab selected). Use this to walk through the various steps of doing an acoustics bake, from left to right.
2. A brief description of the task you perform using this tab.
3. Available filters for the hierarchy window. Use this to filter the hierarchy window to objects of the specified type so you can more easily mark them. If you have not yet marked anything for acoustics, 
selecting the last two options will show you nothing. However, they can be useful to find marked objects once you have done so.
4. (Only when no objects are selected) This shows the status of the objects in the scene:
   - Total - The total number of active, non-hidden objects in the scene.
   - Mesh - The number of Mesh Renderer objects in the scene
   - Terrain - The number of Terrain objects in the scene
   - Geometry - The number of objects in the scene marked as "Acoustics Geometry"
   - Navigation - The number of objects in the scene marked as "Acoustics Navigation". This does not include the Unity NavMesh if created.
5. Shows the total number of 'mark-able' objects in the scene, which is only Mesh Renderers and Terrains, and checkboxes you can use to mark (add the appropriate component to) those objects as geometry or navigation for acoustics
6. When nothing is selected, this note reminds you to select objects for marking if needed. You can also check one or both checkboxes to mark all the objects without selecting anything.
7. (Only when objects are selected) This shows the status of only the selected objects (See #4 above for a description of the values, which in this case only apply to the selected objects).
8. Shows the total number of 'mark-able' selected objects. Changing the values in the checkboxes will mark or unmark all the selected objects.

Only Mesh Renderers and Terrains can be marked. All other object types (including parent objects, cameras, lights, etc.) will be ignored. The checkboxes will mark or unmark all of the affected objects.

If some objects are marked and some are not, the appropriate checkbox will show a "mixed" value as seen here:

![Mixed Value Checkbox](media/MixedObjectSelectionDetail.png)
    
Clicking the checkbox will force all objects to be marked, and clicking again will unmark all the objects.

Objects can be marked for both geometry and navigation.

### Guidelines for marking objects
You should be sure to mark any static (non-moving) objects you want to participate in the acoustics of your scene as "Acoustics Geometry". The acoustics engine does not facilitate acoustics for non-static objects. 
"Participate" in this case means you want sound to bounce off of or be absorbed by the object. 
This typically includes things like ground, walls, roofs, buildings, windows & window glass, rugs, large furniture (tables, sofas, etc.), stationary vehicles, and so on. Smaller objects such as lamps, decorative items,
light fixtures, and other small details are at your discretion. Especially when using "Coarse" mode (see the Probes Tab documentation below), small objects will not be accounted for in the simulation anyway.
However, it is always safer to include something than exclude it. Including more objects does not affect the bake time, so there is little drawback to including more than needed.

The important thing is that you don't miss any major elements that would affect the acoustics, such as the ground, a ceiling, etc., and that you **do not** include things that should not affect the acoustics, such
as collision meshes.

If you are not using a Unity NavMesh and are instead marking your own meshes for navigation, be sure to mark all horizontal surfaces where the player can travel. Marking vertical surfaces will not have any affect on the probe point calculations.

# Materials Tab
Once your objects are marked, click the "Materials" button to go to the Materials Tab:

![Materials Tab Detail](media/MaterialsTabDetail.png)

1. The Materials Tab button, used to bring up this page.
2. A brief description of what you need to do using this page.
3. When checked, only materials used by objects marked as "Acoustics Geometry" will be listed. Otherwise, all materials used in the scene will be listed.
4. Use these options to change the order of the dropdown menu that is shown when you click a dropdown in the Acoustics column below (#6). "Name" sorts the acoustic materials by name,
"Absorptivity" sorts them in order of absortivity from low to high.
5. The list of materials used in the scene, sorted alphabetically. If the "Show Marked Only" checkbox is checked (#3), only materials used by objects marked as "Acoustics Geometry" are shown. Clicking on a material here will select
all objects in the scene that use that material.
6. Shows the acoustic material that the scene material has been assigned to. Click a dropdown to re-assign a scene material to a different acoustic material. You can change the sorting order of the menu shown when you click an item here using
the "Sort Acoustics By:" options above (#4).
7. Shows the acoustic absorption coefficient of the material selected in the previous column. A value of zero means perfectly reflective (no absorption), while a value of 1 means perfectly absorptive (no reflection). The reverberation time
of a given material in a room is inversely related to its absorption coefficient, with most materials having absorption values in the 0.01 to 0.20 range; anything above that is a material that is pretty absorbent.
The absorption coefficient cannot be changed unless the selected material is "Custom".
8. For a material assigned to "Custom", the slider is no longer disabled and you can choose the absorption coefficient using the slider or by typing in a value.

![Reverb Time Graph](media/ReverbTimeGraph.png)

### Guidelines for assigning materials (or absorption values)
This tab uses the name of your material to try and assign the initial acoustics value. For example, if your scene material name is LivingRoom_WoodTable, the initial acoustic material assigned to it will be "wood".
If you are starting a new project, or for future projects, try to give materials names that contain the actual material name in it to facilitate this matching.

Any material where no suitable match was found will be assigned the "Default" material. **This material is acoustically equivalent to concrete.** In general, you will want to re-assign your materials to something that more closely represents
its actual acoustic properties in order to get the most pleasant sounding and realistic acoustics.

If you cannot find an acoustic material in the list that makes sense for your scene material, then choose one that you think would absorb or reflect sound in the same way as your material. You may have to do a bake and listen to it, then adjust
the value to fine-tune the sound later. Changing the "Sort Acoustics By:" selection to "Absorptivity" can be helpful if you want to tweak how a material sounds.

If desired, you can also assign acoustic materials simply to get the sound that you want. For example, if a room is too reverberant, then you can change the acoustic material assigned to the walls to something that has higher absorptivity.
Similarly, if you want more reverb/a longer RT60, then change one or more materials (such as a carpet) to something that is more reflective. Note that an absorption value above about 0.25 to 0.30 will sound pretty dry.

Note that the acoustic assignments apply to all objects that use that material. If you want some uses of the material to have different acoustic properties than others then you will need to create two distinct versions of the material 
with different names in the scene.

# Probes Tab
After assigning the materials, proceed to the Probes Tab:

![Probes Tab Detail](media/ProbesTabDetail.png)

1. The Probes Tab button used to bring up this page
2. A brief description of what you need to do using this page
3. Use these to choose a coarse or fine simulation resolution. Coarse is faster, but has certain tradeoffs. See ["Coarse vs Fine Resolution"](#Coarse-vs-Fine-Resolution) below for details.
4. Choose the location where the acoustics data files should be placed using this field. Click the button with "..." to use a folder picker. The default is Assets/AcousticsData.
An "Editor" subfolder will also be created under this location. See ["Data Files"](#Data-Files) below for more information about the data files.
5. The data files for this scene will be named using the prefix provided here. The default is "Acoustics_[Scene Name]". See ["Data Files"](#Data-Files) below for more information about the data files.
6. After the probes have been calculated, the controls above will be disabled. Click the "Clear" button to erase the calculations and enable the controls so that you can re-calculate using new settings.
7. Click the "Calculate..." button to voxelize the scene and calculate the probe point locations. **This is done locally on your machine**, and must be done prior to doing a bake.

### What does the "Calculate..." button calculate?
The Calculate... button takes all the data you have provided so far (geometry, navigation, materials, and the Coarse/Fine setting) and goes through several steps:
1. It takes the geometry from the scene meshes and calculates a voxel volume. The voxel volume is a 3-dimensional volume that encloses your entire scene, and is made up of small cubic "voxels". 
The size of the voxels is determined by the simulation frequency, which is set by the "Simulation Resolution" setting. Each voxel is marked as being either "open air" or containing scene geometry.
If a voxel contains geometry then the voxel is tagged with the absorption coefficient of the material assigned to that geometry.
2. It then uses the navigation data to calculate acoustically interesting locations where the player might go. It tries to find a reasonably small set of these locations that includes smaller areas such as doorways and hallways,
and then to rooms, to open spaces.
3. For each of the final listener locations it computes, it determines a number of parameters such as how "open" is the space, the size of the room it is in, etc.
4. The results of these calculations are stored in files at the location you specify (See ["Data Files"](#Data-Files) below)

Depending on the size of your scene and the speed of your machine, these calculations can take anywhere from 1 minute to 15 minutes or more.

Once these calculations are complete you can preview both the voxel data and the probe point locations to help ensure that the bake will give you good results. Things like a bad navigation mesh or missing/extra geometry
will typically be quickly visible in the preview so you can correct it.

## Gizmos
By default, both the Probes and Voxels gizmos are turned on. These will show you the voxels and probe point locations that were calculated. They can be enabled or disabled using the Gizmos menu:

![Gizmos Menu](media/GizmosMenu.png)

### Voxels
Voxels are shown in the scene window as green cubes around geometry. Voxels that contain only air are not shown. There is a large green box around your entire scene that denotes the complete voxel volume that will be used in the simulation.
Move around your scene and verify that everything that should be geometry has voxels. The scene camera has to be within about 5 meters of the object for the voxels to show.

If you compare the voxels created with Coarse resolution vs Fine resolution, you will see that the coarse voxels are twice as big.

![Voxel Preview](media/VoxelCubesPreview.png)

### Probe Points
Probe points are synonymous with listening locations. When doing a bake, the acoustics for a sound source anywhere in the scene is calculated for each of these probe points. If the player is not directly at a probe point
location, the data from the probe points nearest to the player are used to interpolate the parameters at that location.

Therefore it is important to ensure that probe points exist anywhere the player is expected to travel in the scene, and that small areas and doorways are adequately represented. 
Future versions will allow the ability to edit/add/delete probe points, but for now they cannot be edited. Use them instead to verify the correctness of your geometry marking and of the navigation hint data.

![Probes Preview](media/ProbesPreview.png)

### Coarse vs Fine Resolution
The only difference between the Coarse and Fine resolution settings is the frequency at which the simulation is performed. Fine uses a frequency twice as high as Coarse.
While this may seem simple, it has a number of implications on the acoustic simulation:
* The wavelength for Coarse is twice as big as Fine, and therefore the voxels are twice as big
* Because the simulation time is directly related to the voxel size, a Coarse bake is much faster than a Fine bake (approximately 16 times faster!)
* Portals (e.g. doors or windows) smaller than the voxel size cannot be simulated. The Coarse setting may cause some of these smaller portals to not be simulated; therefore, they will not pass sound through at runtime.
You can see if this is happening by viewing the voxels (_Example coming..._).
* The lower simulation frequency results in less diffraction around corners and edges.
* Sound sources cannot be located inside voxels - this results in no sound. It is more difficult to locate sound sources so they are not inside the larger voxels of Coarse than it is using the Fine setting.
* The larger voxels will intrude more into portals, as shown below. The first image was created using Coarse, while the second is the same doorway using Fine resolution. As indicated by the red markings, there is much less intrusion into
the doorway using the Fine setting. The blue line is the doorway as defined by the geometry, while the red line is the effective acoustic portal defined by the voxel size. How this intrusion
plays out in a given situation depends completely on how the voxels line up with the geometry of the portal.

![Course Doorway](media/CoarseVoxelDoorway.png)
![Fine Doorway](media/FineVoxelDoorway.png)

# Bake Tab
Once you are happy with the preview data, then use the Bake Tab to submit your bake to the cloud:

![Bake Tab Detail](media/BakeTabDetails.png)

1. The Bake Tab button used to bring up this page.
2. A brief description of what to do on this page.
3. Fields to enter your Azure Credentials once your Azure account has been created. For more details, see [Create Azure Account](CreateAzureAccount.md).
4. Node type to use for the calculation. The node type must be supported by your Azure datacenter location. If not sure, leave at "Standard_F8"
5. Number of nodes to use for this calculation. What number you enter here depends on how fast you want the calculation to complete and what your Azure Batch core allocation is. 
For the absolute fastest possible bake time, set this equal to twice the number of probe points (if using an 8 core node like Standard_F8), or equal to the number of probe points (if using a 16 core node like Standard_F16).
6. Click the Bake button to submit the bake to the cloud.
7. This area shows the status of the bake. When completed, it should show "Downloaded".
8. If for some reason you need to force Unity to forget about a bake you submitted (e.g. you downloaded the results using another machine), click the button to forget about the job that was submitted. Note that this means the result file, 
when ready, will **not** be downloaded. In addition, **this is not the same as canceling the job**. The job, if running, will continue to run in the cloud! To cancel a job, you need to use the [Azure Portal](https://portal.azure.com) (_job cancel support is coming..._)

Once you have started a bake, you can leave Unity (**don't forget to save first!**). Depending on the project, node type, and number of nodes, a cloud bake can take many hours. When you reload
the project and open the Acoustics window the job status will be updated. If the job has completed then the output file will be downloaded.

Once the cloud bake has completed and the data file downloaded, follow the instructions on the [Getting Started](GettingStarted.md) page to use the data at runtime.

# Data Files
There are four data files created by this plugin at various points. Only one of them is needed at runtime, therefore the other three are inside folders named "Editor" so they will not be compiled into your project.
* **Assets/Editor/[SceneName]\_AcousticsParameters.asset**: This file stores the data you enter into the various fields in the Acoustics UI. It also contains a number of advanced fields that manipulate the simulation bake 
(See "Advanced Parameters" below). The location and name of this file cannot be changed.
* **Assets/AcousticsData/[SceneName]\_Acoustics.ace.bytes**: This contains the results of the bake and is used by the runtime. The location and name of this file can be changed using the fields on the Probes Tab.
* **Assets/AcousticsData/Editor/[SceneName]\_Acoustics.vox**: Contains the voxelized representation of the scene including material data. Computed using the "Calculate..." button on the Probes Tab. The location and name of this file can be changed using the fields on the Probes Tab.
* **Assets/AcousticsData/Editor/[SceneName]\_Acoustics\_config.xml**: Contains probe point locations and other simulation parameters used for the bake. Computed using the "Calculate..." button on the Probes Tab. The location and name of this file can be changed using the fields on the Probes Tab.

# Advanced Parameters
TBD - Describe a few of the advanced parameters fields (particularly Max Probe Spacing).