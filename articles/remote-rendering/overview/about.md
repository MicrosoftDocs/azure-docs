---
title: About
description: Introduction into Azure Remote Rendering
author: florianborn71
ms.author: flborn
ms.date: 02/05/2020
ms.topic: overview
---

# About Azure Remote Rendering

*Azure Remote Rendering* (ARR) is a service that enables you to render high-quality, interactive 3D content in the cloud and stream it in real time to devices, such as the HoloLens 2.

![Diagram that shows an example of rendered high-quality, interactive 3D automobile engine.](../media/arr-engine.png)

Untethered devices have limited computational power for rendering complex models. For many applications it would be unacceptable, though, to reduce the visual fidelity in any way. The following screenshot compares the model at full detail with a model that has been decimated using a common content creation tool:

![Sample model](./media/engine-model-decimated.png)

The reduced model consists of approximately 200,000 triangles (including the detailed inner parts), versus more than 18 million triangles in the original model.

*Remote Rendering* solves this problem by moving the rendering workload to high-end GPUs in the cloud. A cloud-hosted graphics engine renders the image, encodes it as a video stream, and streams that to the target device.

## Hybrid rendering

In most applications, it is not sufficient to only render a complex model. You also need custom UI to provide functionality to the user. Azure Remote Rendering does not force you to use a dedicated UI framework, instead it supports *Hybrid Rendering*. This means you can render elements on device, using your preferred method, such as [MRTK](https://microsoft.github.io/MixedRealityToolkit-Unity/Documentation/GettingStartedWithTheMRTK.html).

At the end of a frame, Azure Remote Rendering then automatically combines your locally rendered content with the remote image. It is even able to do so with correct occlusion.

## Multi-GPU rendering

Some models are too complex to render at interactive frame rates, even for a high-end GPU. Especially in industrial visualization this is a common problem. To push the limits further, Azure Remote Rendering can distribute the workload to multiple GPUs. The results are merged into a single image, making the process entirely transparent to the user.

## High-level architecture

This diagram illustrates the remote rendering architecture:

![Architecture](./media/arr-high-level-architecture.png)

A full cycle for image generation involves the following steps:

1. Client-side: Frame setup
    1. Your code: User input is processed, scene graph gets updated
    1. ARR code: Scene graph updates and predicted head pose get sent to the server
1. Server-side: Remote rendering
    1. Rendering engine distributes rendering across available GPUs
    1. Output from multiple GPUs gets composed into single image
    1. Image is encoded as video stream, sent back to client
1. Client-side: Finalization
    1. Your code: Optional local content (UI, markers, ...) is rendered
    1. ARR code: On 'present', locally rendered content gets automatically merged with video stream

Network latency is the main problem. The turn-around time between sending a request and receiving the result is typically too long for interactive frame rates. Therefore more than one frame may be in flight at any time.

## Next steps

* [System requirements](system-requirements.md)
* [Quickstart: Render a model with Unity](../quickstarts/render-model.md)
