# Getting Started With Acoustics in Unity
This is a step-by-step guide in getting started with the Acoustics toolkit inside a blank Unity project. For more information about what Microsoft Acoustics is, check out the [Introduction to Microsoft Acoustics](AcousticsIntro.md).

## Supported platforms
* Unity 2018+ for bakes, using .NET 4.x scripting runtime version
* Unity 5.2+ for runtime, using 48kHz sample rate, "Best Performance" DSP buffer size
* Windows 64-bit Unity Editor
* Windows desktop, UWP, and Android targets
* Azure Batch subscription required for bakes

## Importing the plugin
To get started with the runtime, import the UnityPackage to your project. 
* In Unity, go to Assets > Import Package > Custom Package... 
 
![Import Package](Images/ImportPackage.png)  

* Choose MicrosoftAcoustics.unitypackage

## Calculating the Acoustics for your scene
The first step in creating the runtime acoustics for your project is to calculate the acoustic properties of each scene. This calculation process is called doing an acoustics "bake". 
To do an acoustics bake you need to tell the acoustics simulation engine what elements of your scene are relevant acoustically, and you also need a navigation mesh so the bake doesn't
have to take extra time to compute the acoustics for areas the player will never go.
The following will get you started with doing a basic acoustics bake for your project. For a complete detailed walkthrough, please read the [Bake UI Walkthrough](BakeUIWalkthrough.md) page.
### Enable the plugin
The Bake portion of the Acoustics toolkit only works with .NET 4.x scripting runtime version. Change this in the player settings. Unity will need to restart after changing this.

![Player Settings](Images/PlayerSettings.png) ![.NET 4.5](Images/Net45.png)  
### Create a Navigation Mesh
Use the standard Unity workflow to create a navigation mesh for your project. A walkthrough for how to do this can be found here: [Create a Unity Navigation Mesh](https://docs.unity3d.com/Manual/nav-BuildingNavMesh.html)
### Mark your scene objects for acoustics
In Unity, go to Window > Acoustics. This will bring up the Acoustics window.

![Open Acoustics Window](Images/WindowAcoustics.png)

Make sure you have nothing selected in the Unity hierarchy window, and then in the Acoustics window's Object tab click the "Acoustics Geometry" checkbox to mark all meshes and terrains in your scene as relevant for the acoustics.
If you're using the Demo project, you will also need to un-mark the cube containing the sound source by selecting it and un-checking the "Acoustics Geometry" checkbox. This is how you un-mark objects that should not be participating in the acoustics
(such as collision meshes, for example). Ignore the Navigation checkbox for now, since we are using a Unity Navigation Mesh.

![Bake Geometry](Images/BakeObjectsTabGeometry.png)

On the Materials tab assign the materials used in your scene to something that looks reasonable in the dropdown in the Acoustics column. Try not to have anything assigned to "Default". 
Having the settings on the page be correct is important for your acoustics to work properly, so come back to this and refine it when you do the [full walkthrough](BakeUIWalkthrough.md).

![Materials Tab](Images/MaterialsTab.png)

### Preview the probes
Go to the Probes tab and click Calculate. It will take several minutes to complete. When completed, you should see a bunch of floating spheres show up in the UI. These represent the locations where the acoustics calculations will be performed.
If you get close enough to an object in the scene window you can also see the voxelization of the scene that will be used
during the bake. The green voxels should line up with the objects you marked as geometry. The probe points and voxels can be turned off and on by using the Gizmos menu.

![GizmosPreview](Images/BakePreviewWithGizmos.png)
### Perform the bake in the cloud
Go to the bake tab. Enter your Azure credentials and click Bake.
If you do not have an Azure Batch account, see [this walkthrough for our recommended account setup](CreateAzureAccount.md).
When the bake is finished, the data file will automatically be downloaded to your AcousticsData directory.

## Using the Acoustics Runtime
* In Unity, go to Edit > Project Settings > Audio, and select "Microsoft Acoustics" as the Spatializer Plugin for your project. Also make sure the DSP Buffer Size is set to Best Performance, as this changes the buffer size used in Unity's audio engine. Only the largest buffer size is currently supported.  
![Project Settings](Images/ProjectSettings.png)  
![Microsoft Acoustics Spatializer](Images/ChooseSpatializer.png)  
* Drag and drop the Microsoft Acoustics prefab from the project panel into your scene  
![Acoustics Prefab](Images/AcousticsPrefab.png)  
* Click on the MicrosoftAcoustics Game Object and go to its inspector panel 
* Specify the location of your ACE file by drag-and-dropping it into the Acoustics Manager script, or by clicking on the circle button next to the text box. The ACE file should follow the form "<scenename>.ace.bytes"  
![Acoustics Manager](Images/AcousticsManager.png)  

* Create an audio source. Click the checkbox at the bottom of the AudioSource's inspector panel that says "Spatialize." Make sure the Spatial Blend is set to full 3D  
![Audio Source](Images/AudioSource.png)  
* Open the Audio Mixer (Window > Audio Mixer). Make sure you have at least one Mixer, with one group. If you don't, Click the '+' button to the right of "Mixers" 
* Right click the bottom of the channel strip in the effects section, and add the "Microsoft Acoustics Mixer" effect. Note that only one Microsoft Acoustics Mixer is supported at a time.  
![Audio Mixer](Images/AudioMixer.png)  
* Assign all spatialized audio sources' outputs to the group. Without this, all spatialized audio sources may be muted.

## Tuning parameters without rebaking
Sometimes, the results of the bake sound great for one category of sounds, but another category of sounds requires less realism and needs adjustment. This can be accomplished by adding the AcousticsSourceCustomization script to the Audio Sources that need tuning. The script has three parameters  
![Source Customization](Images/SourceCustomization.png)  
* **Reverb Power Adjust** - This value adjusts the reverb power, in dB. Positive values make a sound more reverberant, negative values make a sound more dry.
* **Decay Time Scale** - This value adjusts the decay time in a multiplicative fashion. For example, if the acoustics table query results in a decay time of 750 milliseconds, but this value is set to 1.5, the resulting decay time is 1.125 seconds.
* **Enable Acoustics** - This checkbox controls whether this sound source uses the results of the acoustics table query or not. When this checkbox is checked, all acoustic parameters from the lookup table will be applied. When this checkbox is unchecked, the source will still be spatialized, but no acoustics lookup query is performed. The result is through-the-wall directionality, with no obstruction/occlusion effects, and no dynamic change in reverb.  

If a global adjustment of the parameters is desired, it would be tedious to change all parameters on each individual source. Instead, go the the Audio Mixer, click on the channel strip with the Microsoft Acoustics Mixer, and adjust the parameters on the Microsoft Acoustics Mixer effect. This will update the Reverb Power and Decay Time for all spatialized sources in the scene.  
![Mixer Customization](Images/MixerParameters.png)  

## Viewing bake information at runtime
Just like you can view voxels and probe points at design time, you can also view voxels and probe points at runtime. This can help debug issues with sound sources being stuck inside the geometry, or making sure all transforms are matched up. To toggle the voxel grid and probe points on/off, click the corresponding checkbox in the Gizmos menu.  
![Gizmos Menu](Images/GizmosMenu.png)  
If you do find that the visual components in the game have a transform applied to them, apply the same transform to the GameObject hosting the Acoustics Manager. Use the voxel grid to make sure everything lines up, otherwise your audio sources will not sound correct as you navigate through the scene.

## Deploying to Android
To use Microsoft Acoustics on Android, simply change your build target to Android. Note that certain versions of Unity have a bug with deploying audio plugins -- make sure you are not using a version affected by [this bug](https://issuetracker.unity3d.com/issues/android-ios-audiosource-playing-through-google-resonance-audio-sdk-with-spatializer-enabled-does-not-play-on-built-player).