---
title: Synchronization across multiple Azure Kinect Dks
description: In this article we will explore the benefits of multi device synchronization as well as all the insides how it is performed.
author: tesych
ms.author: tesych
ms.prod: kinect-dk
ms.date: 01/10/2020
ms.topic: article
keywords: azure, kinect, specs, hardware, DK, capabilities, depth, color, RGB, IMU, microphone, array, depth, multi, synchronization
---

# Synchronization across multiple Azure Kinect Dk devices

In this article, we will explore the benefits of multi device synchronization and its details.

Before you start, make sure to review [Azure Kinect DK Hardware specification](hardware-specification.md) and the [the multi- camera hardware set up](https://support.microsoft.com/help/4494429). 

There are a few important things to consider before starting your multi- camera setup. 

- We recommend using a manual exposure setting if you want to control the precise timing of each device. Automatic exposure allows each the color camera to dynamically change exposure, as a result it is impossible for the timing between the two devices to stay exactly the same.
- The device timestamp reported for images changes meaning to ‘Start of Frame’ from ‘Center of Frame’ when using master or subordinate modes.
- Avoid letting the IR ToF lasers of one camera interferer with another. Use ```depth_delay_off_color_usec``` or ```subordinate_delay_off_master_usec``` to ensure each IR laser fires in its own 160us window or has a different field of view.
- Do ensure you are using the most recent firmware version.
- Do not repeatedly set the same exposure setting in the image capture loop. 
- Do set the exposure when needed, just call the API once.


## Why to use multiple Azure Kinect DK devices?

There are many reasons to use multiple Azure Kinect DK devices. Some examples are
- Fill in occlusions
- 3D object scanning 
- Multiple 4K color images capture of the same scene, all aligned at the start of exposure within 100 us
- Large area coverage

Let's take a closer look at some of those reasons.

### Solve for occlusion

Occlusion means that there is something you want to see, but cannot due to some interference. In our case Azure Kinect Dk device has two cameras (depth and color cameras) that do not share the same origin, so one camera can see part of an object that other cannot. Therefore, when transforming depth to color image, you may see a shadow around an object.
On the image below, the left camera sees the grey pixel P2, but the ray from the right camera to P2 hits the white foreground object. As a result the right camera cannot see P2.

 ![Occlusion](./media/occlusion.png)

Using additional Azure Kinect DK devices will solve this issue and fill out an occlusion problem.

## Set up multiple Azure Kinect DK devices

Make sure to review [the multi- camera hardware setup article](https://support.microsoft.com/help/4494429) that describes different options for hardware setup. 

> [!NOTE]
> Make sure to remove the cover in order to reveal the sync ports.

### Synchronization cables

Azure Kinect DK includes 3.5-mm synchronization ports that can be used to link multiple units together. When linked, cameras can coordinate the timing of Depth and RGB camera triggering. There are specific sync-in and sync-out ports on the device, enabling easy daisy chaining. A compatible cable isn't included in box and must be purchased separately.

Cable requirements:

- 3.5-mm male-to-male cable ("3.5-mm audio cable")
- Maximum cable length < 10 m
- Both stereo and mono cable are supported

When using multiple depth cameras in synchronized captures, depth camera captures should be offset from one another by 160us or more to avoid depth cameras interference.

### Cross-device calibration

In a single device depth and RGB cameras factory calibrated. However, when multiple devices are used, the calibration needs to be considered to determine how to transform an image from the domain of the camera it was captured into the domain of the camera you want to process images in.
There are multiple options for cross-calibrating devices, but in the GitHub green screen code sample we are using OpenCV methods
There are multiple options for cross-calibrating devices, but in the [GitHub green screen code sample](https://github.com/microsoft/Azure-Kinect-Sensor-SDK/tree/develop/examples/green_screen) we are using OpenCV method.

### Verify two Azure Kinect DK devices synchronization

After setting up the hardware and connecting the sync out jack of the master to sync in of the subordinate, we can use the [Azure Kinect Viewer](azure-kinect-viewer.md) to validate the devices setup. It also can be done for more than two devices.

> [!NOTE]
> Subordinate device is the one that connected to "Sync In" pin
> Master is "Synch Out"

1. Open two instances of [Azure Kinect Viewer](azure-kinect-viewer.md)
2. Open subordinate Azure Kinect DK device first. Navigate to Azure Kinect viewer, and in the Open Device section choose subordinate device:

  ![Subordinate camera start](./media/open-device.png)

3. In the section "External Sync", choose option "Sub" and start the device. (when subordinate device is started, you will see no images yet until master device is turned on.)

  ![Subordinate camera start](./media/sub-start.png)

4. Navigate to another instance of the Azure Kinect viewer and open the master Azure Kinect DK device.
5. In the section "External Sync", choose option "Master" and start the device.

> [!NOTE]
> Make sure to always start the subordinate device first!
> Make sure to place your Azure Kinect DK devices in a way so master color camera is between depth cameras.

When Master Azure Kinect Device is started, the synchronized image from both of the Azure Kinect devices should appear.

### Avoiding multi-device depth interference

It is important to understand how to set up your Azure Kinect DK devices to avoid depth interference. 
The depth camera laser on time is less than 160us, 160us ends up having a safety margin (over the 125 us in the table below) to ensure variations is sensors don’t cause issues with software. There are nine pulses & images that the sensor uses to capture the depth engine. The exact timing changes based on the depth mode you are using.

Using the table below the exposure time can be calculated as:

> [!NOTE]
> Exposure Time = (IR Pulses * Pulse Width) + (Idle Periods * Idle Time)

Depth Mode | IR <br>Pulses | Pulse <br>Width  | Idle <br>Periods| Idle Time | Exposure <br> Time
-|-|-|-|-|-
NFOV Unbinned <br>  NFOV 2xx Binned <br> WFOV 2x2 Binned | 9 | 125 us | 8 | 1450 us | 12.8 ms 
WFOV Unbinned                                            | 9 | 125 us | 8 | 2390 us | 20.3 ms

The table above is the raw timing of the sensor and should match up with your scope measurements. As you can tell, the IR on time is ~125 us. Due to variations in timing for the firmware, and it minimum timing resolution of 11us, we recommend being no closer than 160us. The idle time between each IR pulse for NFOV is ~1450us. This idle time gives us enough laser off time to interleave nine more sensors allowing us a total of 10 depth cameras linked together all being 160us of phase off each other. 

It leaves you with 20.5 ms to get your system running without interfering with the depth cameras.

## Trigger Azure Kinect DK devices externally using 3.5 mm audio cable

In order to trigger multiple Azure Kinect DK devices by an external device and control triggering time using 3.5 mm audio cable, the following needs to be considered:

- The SYNC signals are active high and pulse width should be greater than 8us.
- We currently support 30 fps, 15 fps and 5 fps, so frequency of master VSYNC signal from your board (developed to generate signal) should also be one of above 3 options.
- Kinect DK 1 should be connected to your board, Kinect DK 2 to your Kinect DK 1 and Kinect DK 3 to your Kinect DK 2, say daisy-chain.
- SYNC signal from the board should be 5 V TTL/CMOS with maximum driving capacity no less than 8 mA.
- The below plugs can be used with Kinect DK, and all sleeves and rings are shorted together inside Kinect DK and they are connected to ground of master Kinect DK. Tip is the sync signal.

![Camera trigger signal externally](./media/resources/camera-trigger-signal.jpg)
