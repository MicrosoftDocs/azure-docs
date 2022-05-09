---
# Mandatory fields.
title: 3D Scenes Studio for Azure Digital Twins
titleSuffix: Azure Digital Twins
description: Learn about 3D Scenes Studio for Azure Digital Twins.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 05/04/2022
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# 3D Scenes Studio for Azure Digital Twins

Azure Digital Twins [3D Scenes Studio](http://dev.explorer.azuredigitaltwins-test.net/3dscenes) is an immersive 3D environment, where business and front-line workers can consume and investigate operational data from their Azure Digital Twins solutions with visual context. 3D Scenes Studio empowers organizations to enrich existing 3D models with visualizations powered by Azure Digital Twins data, without the need for 3D expertise. These visualizations are driven by contextual data, and can be easily consumed from web browsers. 

With a digital twin graph and curated 3D model, subject matter experts can leverage the studio's low-code Build mode to map the 3D elements to the digital twin, and define UI interactivity and business logic for a 3D visualization of a business environment. The 3D Scene can then be surfaced to end users by deep-linking into the hosted experience within [Azure Digital Twins Explorer](concepts-azure-digital-twins-explorer.md), or embedding the 3D viewer component into custom applications. 

## Studio overview

3D Scenes Studio is built around the concept of *scenes*. A scene is a view of a single business environment, and is comprised of 3D content, custom business logic, and references to an Azure Digital Twins instance. You can have multiple scenes for a single digital twin instance.

Scenes are configured in [Build mode](#build-mode) inside the 3D Scenes Studio. Then, you can view your finished scenes in the studio's [built-in view experience](#view-mode), or [embedded in custom web applications](#embeddable-view-component). You can extend the built-in viewer or create your own viewers that access the 3D Scenes files and your Azure Digital Twins graph.

The following diagram illustrates how 3D Scenes Studio exists alongside Azure Digital Twins and custom web applications.

:::image type="content" source="media/concepts-3d-scenes-studio/architecture.png" alt-text="Architecture diagram showing 3D Scenes Studio alongside Azure Digital Twins and custom web applications." lightbox="media/concepts-3d-scenes-studio/architecture.png":::

### Artifacts and file storage

Each 3D scene relies on two files:
* A 3D file, which contains environment data and meshes for your visualization. You import this file into 3D Scenes Studio.
* A configuration file, which is automatically created for you when you use the studio. This file contains the mapping definition between 3D content and Azure Digital Twins, as well as bits of business logic.

The files for a scene are stored in linked [Azure storage](/azure/storage/blobs/), which you create and manage in your Azure account. As a result, you'll be able to modify any of the stored files directly. However, it's **not recommended** to manually edit the configuration file, as this creates a risk of inconsistencies in the file that might not be handled correctly in the viewer experience.

## Set up

To work with 3D Scenes Studio, you'll need the following required resources:
* An [Azure Digital Twins instance](how-to-set-up-instance-cli.md)
    * You'll need *Azure Digital Twins Data Owner* or *Azure Digital Twins Data Reader* access to the instance
    * The instance should be populated with [models](concepts-models.md) and [twins](concepts-twins-graph.md)
* An [Azure storage account](/azure/storage/common/storage-account-create?tabs=azure-portal)
    * To build 3D scenes, you'll need *Storage Blob Data Owner* access to the storage account. If you only need to consume 3D scenes that others have created, you'll need *Storage Blob Data Reader*.
* A [private container](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container) in the storage account

Then, you can access 3D Scenes Studio at this link: [3D Scenes Studio](http://dev.explorer.azuredigitaltwins-test.net/3dscenes).

Once there, you'll link your 3D environment to your storage resources, and configure your first scene. For detailed instructions on how to perform these actions, see [Initialize your 3D Scenes Studio environment](how-to-use-3d-scenes-studio.md#initialize-your-3d-scenes-studio-environment) and [Create and view scenes](how-to-use-3d-scenes-studio.md#create-and-view-scenes).

## Build mode

The *Build mode* in 3D Scenes Studio is the primary interface for configuring your scenes. It is a low-code, visual experience.

Here's what the Build mode looks like:

:::image type="content" source="media/concepts-3d-scenes-studio/build-mode.png" alt-text="Screenshot of 3D Scenes Studio in Build mode."  lightbox="media/concepts-3d-scenes-studio/build-mode.png":::

In Build mode, you'll create *elements* and *behaviors* for your scene. Elements are self-defined 3D meshes that are linked to data on digital twins, mapping the visualization pieces to relevant twin data. Behaviors are business logic rules that use digital twin data to drive visuals in the scene.

### Elements

When creating an element in Build mode, you'll define the following components:

* **Linked twin**: Each element is connected to a primary digital twin counterpart. You connect the element to a twin in your Azure Digital Twins instance so that the element can represent your twin and its data within the 3D visualization.
* **Name**: Each element needs a name. You might want to make it match the `$dtId` of its linked twin.
* **Mesh**: Identify which components of the 3D visualization mesh represent this element.
* **Behaviors**: Elements are subject to [behaviors](#behaviors) that affect how they appear in the visualization. You can choose which behaviors each element exhibits.
* **Aliased twins**: If you want, you can add secondary digital twin data sources for an element. You should only add aliased twins when there are additional twins with data beyond your linked twin that you want to leverage in your behaviors. After configuring an aliased twin, you'll be able to use properties from that twin when defining behaviors for that element.

### Behaviors

When creating a behavior for an element, you'll define the following components:

* **Elements**: Behaviors affect how certain [elements](#elements) appear in the visualization. You can choose which elements this behavior applies to.
* **Twins**: Identify the set of twins whose data is available to this behavior. This includes the targeted elements' linked twins, and any aliased twins.
* **Status**: States are data-driven overlays on your elements to indicate the health or status of the element. 
* **Alerts**: Alerts are conditional notifications to help you quickly see when an element requires your attention.
* **Widgets**: Widgets are data-driven visuals that provide additional context and data, to help you understand the scenario that the behavior represents. Configuring widgets will help you make sure the right data is discoverable when an alert or status is active.

You can also create *layers* in your scene to help organize your behaviors. Layers act like tags on the behaviors, enabling you to define which behaviors need to be seen together, thus creating custom views of your scene for different roles or tasks.

## View mode

3D Scenes Studio also contains a *View mode*, which end users (like operators) can use to explore the 3D scene. 

Here's what the View mode looks like:

:::image type="content" source="media/concepts-3d-scenes-studio/view-mode.png" alt-text="Screenshot of 3D Scenes Studio in View mode."  lightbox="media/concepts-3d-scenes-studio/view-mode.png":::

You can use the **Elements** list to explore all the elements and active alerts in your scene, or you can click elements directly in the visualization to explore their details.

## Embeddable view component

3D Scenes Studio is extensible to support additional viewing needs. The [viewer component](#view-mode) can be embedded into custom applications, and can work in conjunction with 3rd party components.

Here's an example of what the embedded viewer might look like in an independent application:

:::image type="content" source="media/concepts-3d-scenes-studio/embedded-view.png" alt-text="Screenshot of 3D Scenes Studio in embedded view." lightbox="media/concepts-3d-scenes-studio/embedded-view.png":::

## Recommended limits

When working with 3D Scenes Studio, it's recommended to stay within the following limits.

| Capability | Recommended limit |
| --- | --- |
| Data refresh rate | Every 10 seconds |
| Number of elements | 50 |
| Size of 3D file | 100 MB |

## Next steps

Try out 3D Scenes Studio with a sample scenario in [Get started with 3D Scenes Studio](quickstart-3d-scenes-studio.md).

Or, learn how to use the studio's full feature set in [Use 3D Scenes Studio](how-to-use-3d-scenes-studio.md).
