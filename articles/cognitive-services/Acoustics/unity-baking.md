---
title: Project Acoustics Unity Bake Tutorial
titlesuffix: Azure Cognitive Services
description: This tutorial describes acoustics baking with Project Acoustics in Unity.
services: cognitive-services
author: NoelCross
manager: nitinme

ms.service: cognitive-services
ms.subservice: acoustics
ms.topic: tutorial
ms.date: 03/20/2019
ms.author: noelc
ROBOTS: NOINDEX
---
# Project Acoustics Unity Bake Tutorial
This tutorial describes acoustics baking with Project Acoustics in Unity.

Software requirements:
* [Unity 2018.2+](https://unity3d.com) for Windows or MacOS
* [Project Acoustics plug-in integrated in your Unity project](unity-integration.md) or the [Project Acoustics Unity sample content](unity-quickstart.md)
* Optional: An [Azure Batch account](create-azure-account.md) to accelerate bakes by using cloud computing

## Open the Project Acoustics bake window
Choose **Window > Acoustics** from the Unity menu:

![Unity editor with Acoustics window menu option highlighted](media/window-acoustics.png)

## Create a navigation mesh
Project Acoustics uses a navigation mesh to place listener probe points for simulation. You can use Unity's [navigation mesh workflow](https://docs.unity3d.com/Manual/nav-BuildingNavMesh.html), or use another 3D modeling package to design your own mesh.

## Mark acoustic scene objects
Project Acoustics relies on two types of scene objects for simulation: 
- The objects that will reflect and occlude sound in the simulation
- The player navigation mesh that constrains listener probe points in simulation

Both object types are marked by using the **Objects** tab.

Because marking objects simply adds the *AcousticsGeometry* or *AcousticsNavigation* components to the object, you can also use the [standard Unity component workflow](https://docs.unity3d.com/Manual/UsingComponents.html) to mark or unmark objects. Only Mesh Renderers and Terrains can be marked. All other object types will be ignored. The checkboxes will mark or unmark all of the affected objects.

### Mark acoustic occlusion and reflection geometry
Open the **Objects** tab of the **Acoustics** window. Mark any objects as **Acoustics Geometry** if they should occlude, reflect, or absorb sound. Acoustics geometry can include things like ground, walls, roofs, windows and window glass, rugs, and large furniture. You can use any arbitrary level of complexity for these objects. Because the scene is voxelized before simulation, highly detailed meshes, such as trees that many small leaves, aren't more costly to bake than simplified objects.

Don't include things that shouldn't affect the acoustics, such as invisible collision meshes.

An object's transform at the time of the probe calculation (via the **Probes** tab, see below) is fixed in the bake results. Moving any of the marked objects in the scene will require redoing the probe calculation and rebaking the scene.

### Mark the navigation mesh
Navigation meshes that were created through Unity's workflow will be picked up by the acoustics system. To use your own meshes, mark them from the **Objects** tab.

### For reference: The Objects tab parts
The parts of the tab page are:

1. The tab selection buttons (**Objects** tab selected). Use these buttons to walk through the various steps of an acoustics bake, from left to right.
1. A brief description of what you can do by using this page.
1. Available filters for the hierarchy window. Use these options to filter the hierarchy window to objects of the specified type so that you can more easily mark them. If you haven't yet marked anything for acoustics, selecting the last two options will show you nothing. However, they can be useful to find marked objects once you've done so.
1. When no objects are selected, this section shows the status of all objects in the scene:
    * Total: The total number of active, non-hidden objects in the scene.
    * Ignored: The number of objects that are not mesh renderers or terrains.
    * Mesh: The number of Mesh Renderer objects in the scene.
    * Terrain: The number of Terrain objects in the scene.
    * Geometry: The number of Mesh or Terrain objects in the scene marked as "Acoustics Geometry".
    * Navigation: The number of Mesh or Terrain objects in the scene marked as "Acoustics Navigation." This number doesn't include Unity's NavMesh.
1. Shows the total number of "mark-able" objects in the scene, which are only Mesh Renderers and Terrains. It shows checkboxes that you can use to mark (add the appropriate component to) those objects as geometry or navigation for acoustics.
1. When nothing is selected, this note reminds you to select objects for marking if needed. You can also select  one or both checkboxes to mark all the objects in the scene without selecting anything.
1. When objects are selected (previous bullet), this section shows the status of only the selected objects.
1. Shows the total number of "mark-able" selected objects. Selecting or clearing the checkboxes will mark or unmark only the selected objects.

If you have nothing selected in your scene, the **Objects** tab will look like the following picture:

![Acoustics Objects tab with no selection](media/objects-tab-no-selection-detail.png)

If you have something selected in your scene or hierarchy window, it will look like the following picture:

![Acoustics Objects tab with selection shown](media/objects-tab-selection-detail.png)

If some objects are marked and some aren't, the appropriate checkbox will show a "mixed" value, like the following picture:

![Acoustics Objects tab with a mixed selection of icons highlighted](media/mixed-object-selection-detail.png)

Select the checkbox to mark all the items. Select it again to unmark all the objects.

Objects can be marked for both geometry and navigation.

## Select acoustic materials
After your objects are marked, click the **Materials** button, and assign acoustic materials. The Project Acoustics materials system is tied to the Unity visual materials system: For two objects to have separate acoustic materials, they must have separate visual materials.

The acoustic materials control the amount of sound energy that's reflected back from each surface. The default acoustic material has absorption similar to concrete. Project Acoustics suggests materials based on the visual material name. You can assign the acoustic material *Custom* to a material to activate an absorption-coefficient slider.

The reverberation time of a given material in a room is inversely related to its absorption coefficient. Most materials have absorption values in a range of 0.01 to 0.20. Materials that have absorption coefficients outside this range are very absorbent.

![Graph shows the negative correlation of reverberation time and absorption coefficient.](media/reverb-time-graph.png)

### For reference: Parts of the Materials tab
![The Acoustics Materials tab in Unity](media/materials-tab-detail.png)
1. The **Materials** button that displays this tab.
2. A brief description of what you can do by using this page.
3. When this checkbox is selected, only materials used by objects that marked as **Acoustics Geometry** will be listed. Otherwise, all materials used in the scene will be listed.
4. Use these options to change the order of the options when you click a drop-down menu in the Acoustics column (#6). Sort acoustic materials by **Name**. Or sort by **Absorptivity** from low to high.
5. An alphabetically sorted list of materials that are used in the scene. If the **Show Marked Only** checkbox is selected (#3), only materials used by objects marked as **Acoustics Geometry** are shown. Select a material here to select all objects in the scene that use that material.
6. The acoustic material that the scene material has been assigned to. Select any item to change the acoustic material assigned to that scene material. To change the sorting order of these menus, use the **Sort Acoustics By:** options above (#4).
7. The acoustic absorption coefficient of the material selected in the column to the left (#6). A value of 0 means perfectly reflective (no absorption), while a value of 1 means perfectly absorptive (no reflection). The absorption coefficient can't be changed unless the selected material is "Custom."
8.  For a material marked as "Custom" (in #7), the slider is no longer disabled. You can move the slider or type a value to assign the absorption coefficient.

## Calculate and review listener probe locations
After you assign the materials, switch to the **Probes** tab. Select **Calculate** to place listener probe points for simulation.

### What the "Calculate..." button calculates
The **Calculate...** button uses your selected acoustic scene geometry to prepare your scene for simulation:

1. It takes the geometry from the scene meshes and calculates a voxel volume. The voxel volume is volume of your entire scene that's comprised of small cubic "voxels." Voxel size is determined by the simulation frequency, which is controlled by the **Simulation Resolution** setting. Each voxel is marked as "open air" or containing scene geometry. If a voxel contains geometry, the voxel is tagged with the absorption coefficient of the material that's assigned to that geometry.
2. It uses the navigation meshes to place listener probe points. The algorithm balances the competing concerns of spatial coverage and simulation time and file size. It aims to ensure that narrow corridors and small spaces always have some coverage. Typical probe point counts range from 100 for small scenes to a few thousand for large scenes.

Depending on the size of your scene and the speed of your machine, these calculations can take several minutes.

### Review voxel and probe placement
Preview both the voxel data and the probe point locations to make sure you're ready to bake your scene. An incomplete navigation mesh or missing or extra acoustic geometry is usually easily visible in the preview. Enable or disable Voxel and probe placement by using the Gizmos menu:

![Gizmos menu in Unity](media/gizmos-menu.png)

Voxels that contain acoustic geometry are shown as green cubes. Explore your scene, and verify that everything that should be geometry has voxels. The scene camera has to be within about 5 meters of the object for the voxels to show.

If you compare the voxels created with coarse resolution versus fine resolution, you'll see that the coarse voxels are twice as large.

![Coarse voxels preview in Unity editor](media/voxel-cubes-preview.png)

Simulation results are interpolated between listener probe point locations at runtime. Check that there are probe points near any places that the player is expected to travel to in the scene.

![Probes preview in Unity editor](media/probes-preview.png)

### Take care with scene renames
The scene name is used to connect the scene to files that store the probe point placement and voxelization. If you rename the after probe points are calculated, the material assignment and placement data is lost and should be rerun.

### For reference: Parts of the Probes tab
![The Acoustics Probes tab in Unity](media/probes-tab-detail.png)

1. The **Probes** tab button brings up this page.
1. A brief description of what you can do on this tab.
1. Use these options to set coarse or fine simulation resolution. Coarse is faster, but there are certain tradeoffs. For details, see [Bake resolution](bake-resolution.md).
1. Use this field to specify where to put the acoustics data files. Click the "**...**" button to access a folder picker. The default location is *Assets/AcousticsData*. An *Editor* subfolder will also be created under this location. For more information about data files, see [Data files added by the bake process](#Data-Files), later in this article.
1. The prefix that's specified here is used to name the  data files for this scene. The default is "Acoustics_*[Scene Name]*".
1. After the probes are calculated, the controls that we just described are disabled. Select the **Clear** button to erase the calculations and enable the controls so that you can recalculate with new settings.
1. Select **Calculate** to voxelize the scene and calculate the probe point locations. This is done locally on your machine. It must be done before doing a bake.

In this version of Project Acoustics, probes can't be placed manually. You must use the automated process on the **Probes** tab.

For more information about coarse versus fine resolution, see [Bake resolution](bake-resolution.md) .

## Bake your scene by using Azure Batch
You can bake your scene with a compute cluster in the cloud by using the Azure Batch service. The Project Acoustics Unity plug-in connects directly to Azure Batch to instantiate, manage, and tear down an Azure Batch cluster for each bake. On the **Bake** tab, enter your Azure credentials, select a cluster machine type and size, and select **Bake**.

### For reference: Parts of the Bake tab
![The Acoustics Bake tab in Unity](media/bake-tab-details.png)

1. The **Bake** button that displays this tab.
1. A brief description of what you can do on this page.
1. Fields where you enter your Azure credentials, after your Azure account is created. For more information, see [Create an Azure Batch account](create-azure-account.md).
1. Docker image tag field for the acoustics toolset.
1. Launch the Azure portal to manage your subscriptions, monitor usage and view billing information, and so on.
1. Azure batch compute node type to use for calculation. The node type must be supported by your Azure data center location. If you're not sure, leave as *Standard_F8s_v2*.
7. Number of nodes to use for the calculation. This number affects the time to complete the bake. It's limited by your Azure Batch core allocation. The default allocation only allows for two 8-core nodes or one 16-core node, but it can be expanded. For more information about core allocation constraints, see [Create an Azure Batch account](create-azure-account.md).
8. Select this checkbox to configure your compute pool to use [low-priority nodes](https://docs.microsoft.com/azure/batch/batch-low-pri-vms). Low-priority compute nodes have much lower cost, but they may not always be available or may be preempted at any time.
9. The probe count for your scene as calculated on the **Probes** tab. The number of probes determines the number of simulations that need to be run in the cloud. You can't specify more nodes than there are probes.
10. An estimate of the time that you job will take to run in the cloud. It doesn't include node startup time. After the job starts running, this field shows about how long it until you get back the results.
11. The total amount of computing time needed to run the simulations. This is the total amount of node compute time that will be used in Azure. See [Estimate Azure bake cost](#Estimating-bake-cost) later in this article for more information about using this value.
12. This message tells you where the results of the bake will be saved when the job is finished.
13. (Advanced use only:) If you need to force Unity to forget about a bake that you submitted, for example if you downloaded the results by using another machine), select the **Clear State** button to forget that job. The result file, when ready, will *not* be downloaded. *But this is not the same as canceling the job*. The job, if running, will continue to run in the cloud.
14. Select the **Bake** button to submit the bake to the cloud. While a job is running, this button shows **Cancel Job** instead.
15. Select to prepare for processing [acoustics simulation on your PC](#Local-bake).
16. This area shows the status of the bake. When completed, it should show **Downloaded**.

You can always get complete information about active jobs, compute pools, and storage in the [Azure portal](https://portal.azure.com).

While a job is running, the **Bake** button changes to **Cancel Job**. Use this button to cancel the job that's in progress. You'll be prompted to confirm before the job is canceled. Canceling a job can't be undone, no results will be available, and you'll still be charged for any Azure compute time used.

After you've started a bake, you can close Unity. Depending on the project, node type, and number of nodes, a cloud bake can take several hours. The bake job status will be updated when you reload the project and open the Acoustics window. If the job has completed, the output file will be downloaded.

For security, the Azure credentials are stored on your local machine and associated with your Unity editor. They are used only to establish a secure connection to Azure.

## To find the status of a running job on the Azure portal

1. Find the bake job ID on the bake tab:

    ![Unity bake job ID](media/unity-job-id.png)  

2. Open the [Azure portal](https://portal.azure.com), navigate to the Batch account that was used for the bake, and select **Jobs**

    ![The Jobs link](media/azure-batch-jobs.png)  

3. Search for the job ID in the list of jobs

   ![Bake job status](media/azure-bake-job-status.png)  

4. Select the job ID to see the status of the related tasks and the overall job status.

   ![Bake task status](media/azure-batch-task-state.png)  


### <a name="Estimating-bake-cost"></a> Estimate Azure bake cost

To estimate what a given bake will cost, take the value shown for **Estimated Compute Cost**, which is a duration. Multiply that value by the hourly cost in your local currency of the **VM Node Type** you selected. But the result won't include the node time needed to get the nodes up and running. For example, say you select **Standard_F8s_v2** for your node type, which has a cost of $0.40/hr. If the Estimated Compute Cost is 3 hours and 57 minutes, the estimated cost to run the job will be $0.40 * ~4 hours = ~$1.60. The actual cost will likely be a bit higher because of the extra time to get the nodes started. You can find the hourly node cost on the [Azure Batch pricing](https://azure.microsoft.com/pricing/details/virtual-machines/linux) page. (Select "Compute optimized" or "High performance compute" for the category.)

## <a name="Local-bake"></a> Bake your scene on your PC
You can bake your scene on your own PC. This method can be useful for experimenting with acoustics for small scenes before you create an Azure Batch account. Note that acoustics simulation can take a long time depending on the size of the scene.

### Minimum hardware requirements
* An x86-64 processor with at least 8 cores and 32 GB of RAM
* [Hyper-V enabled](https://docs.microsoft.com/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v) to run Docker

As an example, in our testing on an 8-core machine with Intel Xeon E5-1660 @ 3 GHz and 32 GB of RAM: 
* A small scene with 100 probes can take about 2 hours for a coarse bake or 32 hours for a fine bake.
* A medium-sized scene with 1,000 probes can take about 20 hours for a coarse bake or 21 days for a fine bake.

### Set up Docker
Install and configure Docker on the PC that will process the simulation:
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop).
2. Launch Docker settings, navigate to the **Advanced** options, and configure resources to have at least 8 GB of RAM. The more CPUs that you can allocate to Docker, the faster the bake will complete.  
![Sample Docker settings](media/docker-settings.png)
1. Navigate to "Shared Drives" and turn on sharing for the drive that's used for processing.  
![Docker shared drive options](media/docker-shared-drives.png)

### Run local bake
1. Select the **Prepare Local Bake** button on the **Bake** tab, and select a folder location to save the input files and execution scripts. You can then run the bake on any machine as long as it meets the minimum hardware requirements and has Docker installed by copying the folder to that machine.
2. Launch the simulation by using the *runlocalbake.bat* script on Windows or the *runlocalbake.sh* script on MacOS. This script will fetch the Project Acoustics Docker image with the toolset necessary for simulation processing and start the simulation.
3. After the simulation has finished, copy the resulting .ace file back to your Unity project. To make sure that Unity recognizes this as a binary file, append ".bytes" to the file extension name (for example, "Scene1.ace.bytes"). The detailed logs for the simulation are stored in *AcousticsLog.txt.* If you run into any issues, share this file to assist with diagnosis.

## <a name="Data-Files"></a> Data files added by the bake process

The following four data files are created during the bake process. One contains the simulation results and ships with your title. The others store Unity Editor-related data.

Simulation result:
* **Assets/AcousticsData/Acoustics\_[SceneName].ace.bytes**: This is the runtime lookup table. It contains the simulation results and voxelized acoustic scene elements. You can change the name and location and name of this file on the **Probes** Tab.

   *Be careful not to delete the simulation result file. It isn't recoverable except by rebaking the scene.*

Editor data files:
* **Assets/Editor/[SceneName]\_AcousticsParameters.asset**: This file stores the data that you enter in fields in the Acoustics UI. The location and name of this file can't be changed.
* **Assets/AcousticsData/Editor/Acoustics_[SceneName].Fox**: This file stores the voxelized acoustics geometry and the material properties that are computed by using the **Calculate** button on the **Probes** tab. You can change the location and name of this file on the **Probes** tab.
* **Assets/AcousticsData/Editor/Acoustics\_[SceneName]\_config.xml**: This file stores simulation parameters that are computed by using the **Calculate** button on the **Probes** tab. You can change the location and name of this file on the **Probes** tab.

## Set up the acoustics lookup table
Drag the **Project Acoustics** prefab from the project panel into your scene:

![The Acoustics prefab in Unity](media/acoustics-prefab.png)

Select the **ProjectAcoustics** Game Object, and go to its inspector panel. Specify the location of your bake result (the .ACE file, in **Assets/AcousticsData**) by dragging it into the Acoustics Manager script or by selecting the circle button next to the text box.

The Acoustics Manager prefab in Unity](media/acoustics-manager.png) 

## Next steps
* Explore the [design controls for Unity](unity-workflow.md)
* Explore the [Project Acoustics design concepts](design-process.md)
