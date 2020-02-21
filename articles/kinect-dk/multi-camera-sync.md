---
title: Synchronize multiple Azure Kinect DK devices
description: This article explores the benefits of multi-device synchronization as well as how to set up the devices to synchronize.
author: tesych
ms.author: tesych
ms.prod: kinect-dk
ms.date: 02/20/2020
ms.topic: article
keywords: azure, kinect, specs, hardware, DK, capabilities, depth, color, RGB, IMU, array, depth, multi, synchronization
---

# Synchronize multiple Azure Kinect DK devices

Each Azure Kinect DK device includes 3.5-mm synchronization ports (**Sync in** and **Sync out**) that you can use to link multiple units together. When linked, your software can coordinate the trigger timing of multiple depth cameras and RGB cameras. 

In this article, we will explore the benefits of multi-device synchronization and its details.

## Why use multiple Azure Kinect DK devices?

There are many reasons to use multiple Azure Kinect DK devices. Examples include the following:

- Fill in occlusions. An occlusion occurs when a foreground object blocks the view of part of a background object for one of the two cameras. In the resulting color image, the foreground object appears to cast a shadow on the background object. Although the Azure Kinect DK data transformations produce a single image, the two cameras (Depth and RGB) are actually a small distance apart. The offset makes occlusions possible.  
   For example, in the following diagram, the left camera sees the grey pixel "P2." However, the white foreground object blocks the right camera IR beam. The right camera has no data for "P2."
   ![Occlusion](./media/occlusion.png)  
   Additional synchronized devices can fill in the occluded data.
- Scan objects in three dimensions.
- Increase the effective frame rate to something higher than 30 frames per second (FPS).
- Capture multiple 4K color images of the same scene, all aligned within 100 microseconds (&mu;s) of the start of exposure.
- Increase camera coverage within the space.

## Plan your multi-device configuration

Before you start, make sure to review [Azure Kinect DK Hardware specification](hardware-specification.md) and [Azure Kinect DK depth camera](depth-camera.md).

### Select a camera configuration

You can use two different approaches for your camera configuration:

- **Daisy chain configuration**. Synchronize one master device and up to eight subordinate devices.  
   ![Diagram that shows how to connect Azure Kinect DK devices in a daisy chain configuration.](./media/multicam-sync-daisychain.png)
- **Star configuration**. Synchronize one master device with up to two subordinate devices.  
   ![Diagram that shows how to set up multiple Azure DK devices in a star configuration.](./media/multicam-sync-star.png)

### Plan your camera settings and software configuration

#### Exposure
If you want to control the precise timing of each device, we recommend that you use a manual exposure setting. Under the automatic exposure setting, each color camera can dynamically change the actual exposure. Because the exposure affects the timing, such changes quickly push the cameras out of synch.

In the image capture loop, avoid repeatedly setting the same exposure setting. When needed, just call the API once.

#### Timestamps
Cameras that are acting in master or subordinate roles report image timestamps in terms of *Start of Frame* instead of *Center of Frame*.

#### Interference between multiple IR cameras

When multiple IR cameras image overlapping fields of view, each camera must image its own associated laser. To prevent the lasers from interfering with each other, the camera captures should be offset from one another by 160μs or more.

For each depth camera capture, the laser turns on nine times and is active for only 125&mu;s each time. The laser is then idle for either 14505&mu;s or 23905&mu;s, depending on the mode of operation. This behavior means that the starting point for the offset calculation is 125&mu;s.

Additionally, difference between the camera clock and the device firmware clock increase the minimum offset to 160&mu;s. To calculate a more precise offset for your configuration, note the depth mode that you are using and refer to the [depth sensor raw timing table](hardware-specification.md). Using the data from this table, you can calculate the minimum offset (the exposure time of each camera) by using the following equation:

> *Exposure Time* = (*IR Pulses* &times; *Pulse Width*) + (*Idle Periods* &times; *Idle Time*)

When you use an offset of 160&mu;s, you can configure up to nine additional depth cameras so that each laser fires while the other lasers are idle.

In your software, use ```depth_delay_off_color_usec``` or ```subordinate_delay_off_master_usec``` to make sure that each IR laser fires in its own 160&mu;s window or has a different field of view.

#### Using an external sync trigger

Instead of designating a master Azure Kinect DK device, you can use a custom external source for the synchronization trigger. For example, you can use this option to synchronize image captures with other equipment.

Your external trigger source must function in the same manner as the master device: it must deliver a sync signal that has the following characteristics:

- Active high
- Pulse width: greater than 8&mu;s
- 5V TTL/CMOS
- Maximum driving capacity: no less than 8 milliamps (mA)
- Frequency support: precisely 30 FPS, 15 FPS, and 5 FPS (the frequency of the color camera master VSYNC signal)

The trigger source must deliver the signal to the master device **Sync in** port by using a 3.5-mm audio cable. You can use a stereo or mono cable. The Azure Kinect DK shorts all of the sleeves and rings of the audio cable connector together, and grounds them. As shown in the following diagram, the device receives the sync signal from the connector tip only.

![Cable configurations for an external trigger signal](./media/resources/camera-trigger-signal.jpg)

## Prepare your devices and other hardware

### Azure Kinect DK devices

For each of the Azure Kinect DK devices that you want to synchronize, do the following:

- Ensure that the latest firmware is installed on the device. For more info about updating your devices, go to [Update Azure Kinect DK](). 
- Remove the device cover to reveal the sync ports.
- Note the serial number for each device. You will use this number later in the setup process.

### Host computers

- Host PC for each Azure Kinect DK. A dedicated host controller can be used, but it depends on how you're using the device and the amount of data being transferred over USB. 
- Azure Kinect Sensor SDK installed on each host PC. For more info on installing Sensor SDK, go to [Set up Azure Kinect DK](). 

#### Linux computers: USB Memory on Ubuntu

If you are setting up multi-camera synchronization on Linux, by default the USB controller is only allocated 16 MB of kernel memory for handling of USB transfers. It is typically enough to support a single Azure Kinect DK, however more memory is needed to support multiple devices. To increase the memory, follow these steps:

1. Edit /**etc/default/grub**.
1. Replace the following line:
   ```cmd
   GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"
   ```
   with this line:
   ```cmd
   GRUB_CMDLINE_LINUX_DEFAULT="quiet splash usbcore.usbfs_memory_mb=32"
   ```
   In this example, we set the USB memory to 32 MB twice that of the default, however it can be set much larger. Choose a value that is right for your solution.
1. Run **sudo update-grub**.
1. Restart the computer.

### Cables

To connect the cameras to each other and to the host computers, you need 3.5-mm male-to-male cables (also known as 3.5-mm audio cable). The cables should be less than 10 meters long, and may be stereo or mono.

The number of cables that you need depends on the number of cameras you are using as well as the specific configuration. The Azure Kinect DK box does not include cables&mdash;you must purchase them separately.

If you are connecting the cameras in the star configuration, you also need one headphone splitter.

## Set up multiple Azure Kinect DK devices

### Connect your devices

#### Daisy chain configuration 

1. Connect each Azure Kinect DK to power.
1. Connect one device to one host PC. 
1. Select one device to be the master device, and plug a 3.5-mm audio cable into its **Sync out** port.
1. Plug the other end of the cable into the **Sync in** port of the first subordinate device.
1. To connect another device, plug another cable into the **Sync out** port of the first subordinate device, and plug the other end of that cable into the **Sync in** port of the next device.
1. Repeat the previous step until all of the devices are connected. The last device should have one cable plugged into its **Sync in** port, and its **Sync out** port should be empty.

#### Star configuration 

1. Connect each Azure Kinect DK to power.
1. Connect one device to one host PC. 
1. Select one device to be the master device, and plug the single end of the headphone splitter into its **Sync out** port.
1. Connect 3.5-mm audio cables to the "split" ends of the headphone splitter.
1. Plug the other end of each cable into the **Sync in** port of one of the subordinate devices.

## Verify that the devices are connected and communicating

Use the [Azure Kinect Viewer](azure-kinect-viewer.md) to validate the device setup. 

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

### Configure the software control settings

Once you've set up your hardware for synchronized triggering, you'll need to set up the software. For more info on setting this up, go to the [Azure Kinect developer documentation]() (English only). 

### Calibrate the devices as a synchronized set

In a single device depth and RGB cameras are factory calibrated. However, when multiple devices are used, new calibration requirements need to be considered to determine how to transform an image from the domain of the camera it was captured in, to the domain of the camera you want to process images in.

There are multiple options for cross-calibrating devices, but in the [GitHub green screen code sample](https://github.com/microsoft/Azure-Kinect-Sensor-SDK/tree/develop/examples/green_screen) we are using OpenCV method. The Readme file for this code sample provides more details and instructions for calibrating the devices.

## Next steps

- [Use Azure Kinect Sensor SDK](about-sensor-sdk.md)
- [Capture Azure Kinect device synchronization](capture-device-synchronization.md)
- [Set up hardware](set-up-azure-kinect-dk.md)

## Related topics

- [Meet Azure Kinect DK]() 
- [Set up Azure Kinect DK]() 
- [Update Azure Kinect DK]() 
- [Where to use Azure Kinect DK]() 
- [Reset Azure Kinect DK](reset-azure-kinect-dk.md) 
- [Use Azure Kinect Viewer]() 
