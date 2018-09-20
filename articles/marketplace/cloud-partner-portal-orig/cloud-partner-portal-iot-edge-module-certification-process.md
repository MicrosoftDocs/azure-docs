---
title: IoT Edge Module Certification | Microsoft Docs
description: Certify an IoT Edge Module for the Marketplace.
services: Azure, Marketplace, Cloud Partner Portal, 
documentationcenter:
author: dan-wesley
manager: Patrick.Butler  
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: conceptual
ms.date: 09/19/2018
ms.author: pbutlerm
---


# The IoT Edge Module certification process

This article describes the steps and requirements to certify an IoT Edge Module for publishing on the Azure Marketplace. 

>[!Note]
>This is a temporary document. The IoT Edge Module Marketplace is being built in parallel and this article will be replaced by public documentation.

## Understanding an IoT Edge module

Module terminology:

-   A **module image** is a package containing the software that defines a module.

-   A **module instance** is the specific unit of computation running the module image on an IoT Edge device. The module instance is started by the IoT Edge runtime.

Modules may also include the IoT module SDK, which uses the following terminology:

-   A **module identity** is a piece of information (including security
    credentials) stored in IoT Hub, that's associated with each module instance.

-   A **module twin** is a JSON document stored in IoT Hub, that contains state information for a module instance, including metadata, configurations, and conditions.

-   **SDKs** are used to develop custom modules in multiple languages, such as: C\#, C, Python,
    Java, and Node.JS.

## The onboarding process for an IoT Edge module

The following screen capture shows the process for an IoT Edge module to become public in the Azure Marketplace.

![Certification process](./media/cloud-partner-portal-iot-edge-module-certification-process/onboarding-process.png)

### Onboarding step details

-   **Step 1** - Partners submit their offers with the offer type **IoT Edge Module** in the Cloud Partner Portal tool by the Azure Marketplace team. You must be an official MS partner to access the Cloud Partner Portal tool. For more information, see the [publisher's guide](https://docs.microsoft.com/azure/marketplace/marketplace-publishers-guide).

-   **Step 2** - The Marketplace automatically runs anti-virus and anti-malware checks. The IoT team can run its custom automated ingestion tests during this stage.

-   **Step 3** - The module is public. It's listed in the marketplace and the container can be pulled anonymously from a URL. For example, *marketplace.azurecr.io/module-identifier*.

## IoT Edge module certification criteria

Below are the main requirements that must be met for an IoT Edge module to be certified and published in the Azure Marketplace.

>[!Note]
>These requirements may change. You'll be notified in
advance and be given time to update your containers so they can meet the
updated requirements.

### Technical requirements

**Be an IoT Edge module**

-   Only docker-compatible containers are currently supported as IoT Edge
    modules. The module must be running on [Moby](https://mobyproject.org/). 

    >[!Note]
    >Docker containers will likely work with Moby because Moby is the underlying open source project for Docker.

-   The partner must provide the following default settings: 

    -   A default **tag** (which can't be empty.

    -   A default **createOptions** (which can be empty.)

    -   If using the IoT Module SDK, a default **twin** (which can be empty.)

    -   If using the IoT Module SDK, a default **routes** (which can be empty.)

**Platform support**

-   Only platforms that are **Generally Available** in IoT Edge Tier 1 (as recorded in [Azure IoT Edge
    support](https://docs.microsoft.com/azure/iot-edge/support)) need to
    be supported. For example, this currently means supporting the following OS and architecture combinations:

    -   Ubuntu Server 18.04 for x64

    -   Ubuntu Server 16.04 for x64

    -   Raspbian-stretch for arm32 (armhf)

**Device dimensioning**

-   Any device with the equivalent dimensions (CPU/RAM/Storage/GPU/ and etc.) of a Raspberry Pi or greater can be an IoT Edge device. If a module only works within specific dimension constraints, those constraints must be specified in the module description.

**Default settings**

-   A module should start with the default parameters out of the box for each supported platform (OS + architecture).

-   Configuration settings should be clearly documented (tags, environment variables, twin, routes.) As part of the listing, partners can define a description for their Module that supports basic HTML markup or points to an external webpage.

**Versioning**

-   Customers must be able to choose whether they want to auto-update a module coming from the marketplace or if they want to use an exact version they've tested. Marketplace modules must follow the same versioning pattern as the IoT Edge runtime. For example:

    -   Rolling tags such as “1.0”, can be updated.

    -   Minor version tags, such as “1.3.24”, can't be updated.

**Telemetry**

-   Modules using the IoT Module SDK must set the unique module identifier assigned by the marketplace for telemetry purposes. This enables the Azure Marketplace to identify the number of module instances that are running. This unique identifier is the container name assigned by the marketplace at ingestion. Use the methods of the following SDKs to set this identifier:
    - [C\#](https://hub.docker.com/_/mysql/)
    - [C](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/Iothub_sdk_options.md)
    - [Python](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/Iothub_sdk_options.md)
    - [Java](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.sdk.iot.device._product_info?view=azure-java-stable)

-   For Modules that don't use the IoT Module SDK, less precise insights are available through the Cloud Partner Portal. For example, the number of downloads.

**Security**

-   Containers should have the least privileged access to the host as
    possible. “Privileged” containers should be extremely rare.

-   Partners must keep their module secure as part of the support that they provide.

**Updates**

-   Partners must keep their module up-to-date and functional. They'll be notified in advance if there are any breaking changes planned for IoT Edge Runtime.

**Module IoT SDK**

-   Including the IoT Module SDK isn't a prerequisite for certification.
    However, including the IoT Module SDK may provide a better user experience. For example, to support routing, sending messages to the Cloud, and so on. The IoT Module SDK is required to get telemetry on the number of module instances running.

**Subjective requirement**

-   Must meet at least one real world IoT Edge use case. For example, a WordPress container shouldn't be onboarded unless a customer is willing to use it from IoT Edge.

**Legal requirements (from AMP policy)**

-   The module must comply with the Microsoft Azure Marketplace agreements and policies. For more information, see the attached Publisher Agreement and [Participation Policy](https://azure.microsoft.com/support/legal/marketplace/participation-policies/).

-   In addition to the Azure Marketplace agreements and policies, there might be additional legal requirements specific to an IoT Edge Module offer type. This is currently under review.

-   The module must have a *terms of use* and a *privacy policy*.

-   The module should also have a third party notice if the module uses any third parties.

**Support requirements (from AMP policy)**

-   Partners are responsible for supporting their IoT Edge Modules. They will ensure that support options given in the IoT Edge Module description remain available and that at least one support option is always available. (Refer to Section 4 of the AMP Publisher Agreement for more details.)

**Categorization**

-   All IoT Edge modules will appear under the category **Internet of things \>IoT Edge module**. It's up to the partner to choose the best sub-category for their product.
