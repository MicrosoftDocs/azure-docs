---
title: Device Update and the Yocto Build Pipeline
description: Learn concepts about the Yocto Build Pipeline and Use with IoT Hub Device Update
author: nihemstr
ms.author: nihemstr
ms.date: 09/22/2023
ms.topic: concept-article
ms.service: iot-hub-device-update
---

# What is Yocto? 

Yocto is a build system that is utilized by the IoT industry to create custom image files for machines running non-standard images or that require specific operating system configurations. 

The user expresses their build system in terms of layers. You start with the base Yocto layer which will incorporates the layers above it into a finished image. Above the base layer you add the operating systems (keep in mind Yocto is NOT an operating system it is a build system) you're trying to build and then the hardware integration layer that lets the operating system run on the hardware you're targeting. Each of these layers is consumed by the Yocto build system using "recipes" that allow the base Yocto layer to build the image. These "recipes" are akin to Makefiles/build instructions for the layer they are attached to.


For example if you were trying to build Debian 10 for your home baked hardware you would have a Yocto base layer, a layer that provides the hardware integration for the image, and then a Debian 10 layer. You would give the Yocto base layer the recipes for your custom hardware integration layer and a recipe for building Debian 10. Once you start the build, Yocto will gather the recipes in the order you've specified, execute them one by one, and knit all the layers together into your own custom Debian 10 image that can run on your custom hardware!

That's the very basics of the Yocto build system. The real power comes from the ability to add layers ontop of the base Yocto, hardware integration, and operating system layers to customize the run time environment and applications on the operating system. With Yocto you can easily add, and source control, additional layers for each application, daemon, firmware, or anything else you like. You can even add layers called "meta-layers" for building and integrating dependencies and weaving together individual layers. 

This is an extremely broad overview only intended to explain to the reader what the concepts of the Yocto build system, layers in the context of Yocto, and Yocto recipes for building images. If you have further questions about the Yocto build system you should visit the [Yocto Project's site](https://www.yoctoproject.org/) to read more and get started on your own Yocto project!


# How does DU build images using the Yocto build system? 

Device Update for IoT Hub uses the Yocto build system to generate an image for the Raspberry Pi 4 with the latest version of Device Update already installed and prepped for provisioning. The system used for generating this image is inteded as an example of what I device builder / maintainer might use for creating custom images. It is NOT intended as a off-the-shelf complete build system for your custom images. 

The Device Update for IoT Hub currently supports both Yocto Kirkstone and Hornister. You can visually imagine the Device Update build system like the image below: 

:::image type="content" source="media/device-update-yocto-build/du-yocto-build-layers.png" alt-text="DU Yocto Build System " lightbox="media/device-update-yocto-build/du-yocto-build-layers.png":::

The individual layers here represent the different sections that go together to make the Device Update for IoT Hub build work. The base layer (can be Hornister or Kirkstone) runs the build and incorporates all of the above layers into the resulting image. Below you'll find the description for each of the layers and what they do:

1. Yocto Build Layer - the base build system that will generate the image file form all layers above it. Can be Yocto Hornister or Yocto Kirkstone depending on what you're targeting and what your system needs
2. Open Embedded Meta Layer - the layer that glues the Raspberry Pi 4 hardware firmware with the intended operating system above it to the Yocto build system. Traditionally this determines operating system primitives and systems
3. Raspberry Pi 4 w/ ADU Meta Layer - this is the actual operating system that incorporates the build of Device Update for IoT Hub into the system. This layer creates the A / B partitions for Image Based Updates, creates the adu data partitions, and adds all of the supporting systems within the Raspberry Pi 4 image build allow Device Update for IoT Hub to run.
4. IoT Hub Device Update Meta Layer - this is the layer that installs all of the dependencies and tools that DU uses for accomplishing it's runtime. These might include the Azure Identity Service, the Delta Processor, or any of the background dependencies IoT Hub Device Update needs to interact with other products.
5. SW Update Meta Layer and Delta Update Meta Layer - These meta layers knit together the last part of the Device Update for IoT Hub functionality. The SW Update Meta Layer adds SWUpdate to the system and configures it to run with Device Update for IoT Hub. The Delta Update Meta Layer adds support for Delta Updates on the device. 


These are all brief descriptions of the layers. The intention of this document is to give a general overview of how Yocto works and how the Device Update agent uses them. 

# Looking Deeper / Learning More

To learn more about the Device Update for IoT Hub Yocto build system you can look at the build sources in our GitHub repo [here](https://github.com/Azure/iot-hub-device-update-yocto#introduction).

If you want to try out a building a custom image locally you can follow the directions [here](https://github.com/Azure/iot-hub-device-update-yocto#how-to-build-the-project-locally). Please note for running Kirkstone builds you will need to go look at that branch. The default `main` branch builds Hornister. 

You can also view the source code for how to automate the building of these images using Azure Dev Ops Pipelines [here](https://github.com/Azure/iot-hub-device-update-yocto/tree/main/azurepipelines).


Please note all of these are reference materials. Any customer looking to add their own content or to create production level Yocto images are encourage to review the Yocto Project's documentation and the Device Update for IoT Hub team's pipeline as a reference. 