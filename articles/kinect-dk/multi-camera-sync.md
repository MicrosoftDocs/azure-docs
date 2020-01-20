---
title: Synchronization across multiple Azure Kinect DKs
description: In this article, we will explore the benefits of multi device synchronization as well as all the insides how it is performed.
author: tesych
ms.author: tesych
ms.prod: kinect-dk
ms.date: 01/10/2020
ms.topic: article
keywords: azure, kinect, specs, hardware, DK, capabilities, depth, color, RGB, IMU, microphone, array, depth, multi, synchronization
---

# Synchronization across multiple Azure Kinect DK devices

In this article, we will explore the benefits of multi device synchronization and its details.

Before you start, make sure to review [Azure Kinect DK Hardware specification](hardware-specification.md) and the [the multi-camera hardware set up](https://support.microsoft.com/help/4494429). 

There are a few important things to consider before starting your multi-camera setup. 

- We recommend using a manual exposure setting if you want to control the precise timing of each device. Automatic exposure allows each color camera to dynamically change exposure, as a result it is impossible for the timing between the two devices to stay exactly the same.
- The device timestamp reported for images changes meaning to ‘Start of Frame’ from ‘Center of Frame’ when using master or subordinate modes.
- Avoid IR camera interference between different cameras. Use ```depth_delay_off_color_usec``` or ```subordinate_delay_off_master_usec``` to ensure each IR laser fires in its own 160us window or has a different field of view.
- Do ensure you are using the most recent firmware version.
- Do not repeatedly set the same exposure setting in the image capture loop. 
- Do set the exposure when needed, just call the API once.


## Why to use multiple Azure Kinect DK devices?

There are many reasons to use multiple Azure Kinect DK devices. Some examples are
- Fill in occlusions
- 3D object scanning 
- Increase the effective frame rate to something larger than the 30 FPS
- Multiple 4K color images capture of the same scene, all aligned at the start of exposure within 100 us
- Increase camera coverage within the space

### Solve for occlusion

Occlusion means that there is something you want to see, but can't see it due to some interference. In our case Azure Kinect DK device has two cameras (depth and color cameras) that do not share the same origin, so one camera can see part of an object that other cannot. Therefore, when transforming depth to color image, you may see a shadow around an object.
On the image below, the left camera sees the grey pixel P2, but the ray from the right camera to P2 hits the white foreground object. As a result the right camera cannot see P2.

 ![Occlusion](./media/occlusion.png)

Using additional Azure Kinect DK devices will solve this issue and fill out an occlusion problem.

## Set up multiple Azure Kinect DK devices

Make sure to review [the multi-camera hardware setup article](https://support.microsoft.com/help/4494429) that describes different options for hardware setup. 

### Synchronization cables

Azure Kinect DK includes 3.5-mm synchronization ports that can be used to link multiple units together. When linked, cameras can coordinate the timing of Depth and RGB camera triggering. There are specific sync-in and sync-out ports on the device, enabling easy daisy chaining. A compatible cable isn't included in box and must be purchased separately.

Cable requirements:

- 3.5-mm male-to-male cable ("3.5-mm audio cable")
- Maximum cable length should be less than 10 meters
- Both stereo and mono cable types are supported

When using multiple depth cameras in synchronized captures, depth camera captures should be offset from one another by 160μs or more to avoid depth cameras interference.

> [!NOTE]
> Make sure to remove the cover in order to reveal the sync ports.

### Cross-device calibration

In a single device depth and RGB cameras factory calibrated. However, when multiple devices are used, new calibration requirements need to be considered to determine how to transform an image from the domain of the camera it was captured in, to the domain of the camera you want to process images in.
There are multiple options for cross-calibrating devices, but in the GitHub green screen code sample we are using OpenCV methods
There are multiple options for cross-calibrating devices, but in the [GitHub green screen code sample](https://github.com/microsoft/Azure-Kinect-Sensor-SDK/tree/develop/examples/green_screen) we are using OpenCV method.

### USB Memory on Ubuntu

If you are setting up multi-camera synchronization on Linux, by default the USB controller is only allocated 16 MB of kernel memory for handling of USB transfers. It is typically enough to support a single Azure Kinect DK, however more memory is needed to support multiple devices. To increase the memory, follow the below steps:
- Edit /etc/default/grub
- Replace the line that says GRUB_CMDLINE_LINUX_DEFAULT="quiet splash" with GRUB_CMDLINE_LINUX_DEFAULT="quiet splash usbcore.usbfs_memory_mb=32". In this example, we set the USB memory to 32 MB twice that of the default, however to can be set much larger. Choose a value that is right for your solution.
- Run sudo update-grub
- Restart the computer

### Verify two Azure Kinect DKs' synchronization

After setting up the hardware and connecting the sync out port of the master to sync in of the subordinate, we can use the [Azure Kinect Viewer](azure-kinect-viewer.md) to validate the devices setup. It also can be done for more than two devices.

> [!NOTE]
> The Subordinate device is the one that connected to "Sync In" pin.
> The master is the one connected "Synch Out".

1. Get the serial number for each device.
2. Open two instances of [Azure Kinect Viewer](azure-kinect-viewer.md)
3. Open subordinate Azure Kinect DK device first. Navigate to Azure Kinect viewer, and in the Open Device section choose subordinate device:


      ![Open device](./media/open-devices.png)

4. In the section "External Sync", choose option "Sub" and start the device. Images will not be sent to the subordinate after hitting start due to the device waiting for the sync pulse from the master device.


      ![Subordinate camera start](./media/sub-device-start.png)

5. Navigate to another instance of the Azure Kinect viewer and open the master Azure Kinect DK device.
6. In the section "External Sync", choose option "Master" and start the device.

> [!NOTE]
> The master device must always be started last the get precise image capture alignment between all devices.

When the master Azure Kinect Device is started, the synchronized image from both of the Azure Kinect devices should appear.

### Avoiding interference from other depth cameras

Interference happens when the depth sensor's ToF lasers are on at the same time as another depth camera.
To avoid it, cameras that have overlapping areas of interest need to have their timing shifted by the "laser on time" so they are not on at the same time.  For each capture, the laser turns on nine times and is active for only 125us and is then idle for 1450us or 2390us depending on the mode of operation. As a result, depth cameras need their "laser on time" shifted by a minimum of 125us and that on time needs to fall into the idle time of the other depth sensors in use. 

Due to the differences in the clock used by the firmware and the clock used by the camera, 125us cannot be used directly. Instead the software setting required to ensure sure there is no camera interference is 160us. It allows nine more depth cameras to be scheduled into the 1450us of idle time of NFOV. The exact timing changes based on the depth mode you are using.

Using the [depth sensor raw timing table](hardware-specification.md) the exposure time can be calculated as:

> [!NOTE]
> Exposure Time = (IR Pulses * Pulse Width) + (Idle Periods * Idle Time)

## Triggering with custom source

A custom sync source can be used to replace the master Azure Kinect DK. It is helpful when the image captures need to be synchronized with other equipment. The custom trigger must create a sync signal, similar to the master device,  via the 3.5-mm port.

- The SYNC signals are active high and pulse width should be greater than 8us.
- Frequency support must be precisely 30 fps, 15 fps, and 5 fps, the frequency of color camera's master VSYNC signal.
- SYNC signal from the board should be 5 V TTL/CMOS with maximum driving capacity no less than 8 mA.
- All styles of 3.5-mm port can be used with Kinect DK, including "mono", that is not pictured. All sleeves and rings are shorted together inside Kinect DK and they are connected to ground of the master Azure Kinect DK. The tip is the sync signal.

![Camera trigger signal externally](./media/resources/camera-trigger-signal.jpg)

## Next steps

- [Use Azure Kinect Sensor SDK](about-sensor-sdk.md)
- [Capture Azure Kinect device synchronization](capture-device-synchronization.md)
- [Set up hardware](set-up-azure-kinect-dk.md)


