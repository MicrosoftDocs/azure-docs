---
title: Azure Kinect depth camera
description: Azure Kinect Depth camera concepts
author: joylital 
ms.author: joylital
ms.prod: kinect-dk
ms.date: 06/05/2019
ms.topic: conceptual 
keywords: kinect, azure, sensor, sdk, depth camera, tof, principles, performance, invalidation
---

# Depth camera

This page covers how to use the depth camera in your Azure Kinect DK device. The depth camera is the second of the two cameras. As covered in previous sections, the other camera is the RGB camera.  

## Operating principles

The Azure Kinect depth camera implements the Amplitude Modulated Continuous Wave (AMCW) Time-of-Flight (ToF) principle. The camera casts modulated illumination in the near-IR (NIR) spectrum onto the scene and then records an indirect measurement of the time it takes the light to travel from the camera to the scene and back.

![Depth and IR side by side](./media/concepts/depth-camera-depth-ir.png)

These indirect measurements are processed to generate a depth map that stores a Z-coordinate value for every pixel of the image in millimeters. In addition to a Z-value, we also obtain a so-called clean IR reading. This IR value is proportional to the amount of light returned from the scene to the pixel and looks similar to a regular IR image. The figure below shows an example depth map (left) and a corresponding clean IR image (right).

## Key features

Technical characteristics are include:

- 1 Megapixel ToF imaging chip with advanced pixel technology enabling higher modulation frequencies and depth precision.
- Two NIR Laser diodes enabling near and wide field-of-view (FoV) depth modes.
- The world’s smallest ToF pixel, at 3.5um by 3.5um.
- Highest figure of merit (highest modulation frequency and modulation contrast resulting in low power consumption with the overall system power of 225-950mw).
- Automatic per pixel gain selection enabling large dynamic range allowing near and far objects to be captured cleanly.
- Global shutter that allows for improved performance in sunlight.
- Multi-phase depth calculation method  that enables robust accuracy even in the presence of chip, laser and power supply variation.
- Low systematic and random errors.

![Depth Module](./media/concepts/depth-camera-depth-module.jpg)

The depth camera transmits raw modulated IR images to the host PC where the GPU accelerated depth engine software converts the raw signal into depth maps. The depth camera supports several modes. The narrow field of view (Fov) modes are ideal for scenes with smaller extents in X- and Y-dimensions, but larger extents in the Z-dimension. If the scene has large X- and Y-extents, but smaller Z-ranges, the wide FoV modes are better suited.

The depth camera supports 2x2 binning modes to extend the Z-range in comparison to the corresponding un-binned modes at the cost of lowering image resolution. All modes can be run at up to 30 frames-per-second (fps) with exception of the 1 megapixel (MP) mode that runs at a maximum frame rate of 15 fps. The depth camera also provides a passive IR mode. In this mode the illuminators on the camera are not active and only ambient illumination is observed.

## Camera performance

We measure the camera’s performance in terms of systematic and random errors. These errors are detailed in the sections below.

### Systematic Error

Systematic error is defined as the difference between the measured depth after noise removal and the correct (ground truth) depth. We compute the temporal average over many frames of a static scene to eliminate depth noise as much as possible. More precisely, the systematic error is defined as:

![Depth Systematic Error](./media/concepts/depth-camera-systematic-error.png)

Where *d_t* denotes the measure depth at time *t*, *N* is the number of frames used in the averaging procedure and d_gt is the ground truth depth. The depth camera’s systematic error specification is excluding multi-path interference (MPI). MPI is when one sensor pixel integrates light that's reflected by more than one object. MPI is partly mitigated in our depth camera using higher modulation frequencies, along with the depth invalidation, which we will introduce later.

### Random error

Let's assume we take 100 images of the same object without moving the camera. The depth of the object will be slightly different in each of the 100 images. This is caused by shot noise, i.e., the number of photons hitting the sensor varies by a random factor over time. We define this random error on a static scene as the standard deviation of depth over time computed as:

![Depth Random Error](./media/concepts/depth-camera-random-error.png)

Where *N* denotes the number of depth measurements, *d_t* represents the depth measurement at time *t* and *d* denotes the mean value computed over all depth measurements *d*_t*.

### Performance graph

The plot below shows our performance metrics defined above for different depths and reflectivity levels. While the systematic error is close to 0, the random error increases with increasing distance and decreasing reflectivity.

## Invalidation

In certain situations, the depth camera may not provide correct values for some pixels. In these cases, depth pixels are invalidated. This is indicated by the depth value equals to 0. Reasons for the depth engine being unable to produce correct values include:

- Outside of active IR illumination mask
- Saturated IR signal
- Low IR signal
- Filter outlier
- Multi-path interference

### Illumination Mask

Invalidate when pixels are outside of the active IR illumination mask. We do not recommend using the signal of such pixels to compute depth. The figure below, shows the example of invalidation by illumination mask. these are the black-color pixels outside the circle in the wide FoV modes (left), and the hexagon in the narrow FoV modes (right).

![Invalidation Outside Illumination Mask](./media/concepts/depth-camera-invalidation-illumination-mask.png)

### Signal strength

Invalidate when pixels contain a saturated IR signal, because the accurate phase information was lost. The image below, shows the example of invalidation by a saturated IR signal. See arrows pointed to the example pixels in both the depth and IR images.

![Invalidation Saturation](./media/concepts/depth-camera-invalidation-saturation.png)

Invalidation can also occur when the IR signal is not strong enough to generate depth. The below figure, shows the example of invalidation by a low IR signal. See the arrows pointed to example pixels in both the depth and IR images.

![Invalidation Low Signal](./media/concepts/depth-camera-invalidation-low-signal.png)

### Ambiguous depth

Pixels can also be invalidated if they received signals from more than one object in the scene. A common case where this sort of invalidation can be seen is in corners.  Due to the scene geometry, the IR light from the camera reflected off one wall and onto the other. This reflected light causes ambiguity in the measured depth of the pixel. Filters in the depth algorithm detect these ambiguous signals and invalidate the pixels.

The figures below show examples of invalidation by multi-path detection. You also can see the same surface area got invalidated from one camera view (top row) may appear again from a different camera view (bottom row). This demonstrates that surfaces invalidated from one perspective may be visible from another.

![Invalidation Multipath - Corner](./media/concepts/depth-camera-invalidation-multipath.png)

Another common case of multi path is pixels contain the mixed signal from foreground and background (e.g. edges). During fast motion, because the exposure interval of capturing raw depth data, you may see more invalidated pixels around the edges.

![Invalidation MultiPath - Edge](./media/concepts/depth-camera-invalidation-edge.png)

## Next steps

> [!div class="nextstepaction"]
>[Coordinate systems](azure-kinect-dk-coordinate-systems.md)