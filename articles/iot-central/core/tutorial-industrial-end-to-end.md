---
title: Tutorial - Explore an Azure IoT Central industrial scenario | Microsoft Docs
description: This tutorial shows you how to deploy an end-to-end industrial IoT sample that uses IoT Central. The sample includes a script to generate simulated OPCUA data, an IoT Edge gateway, an IoT Central application, and Azure Data Explorer.
author: dominicbetts
ms.author: dobett
ms.date: 06/22/2022
ms.topic: tutorial
ms.service: iot-central
services: iot-central

---

# Explore an industrial IoT scenario with IoT Central

The sample shows how to use Azure IoT Central to ingest industrial IoT data from edge resources and then export the data to Azure Data Explorer (ADX) for further analysis. The sample provisions a number of resources such as:

- An Azure virtual machine to host the Azure IoT Edge runtime.
- An IoT Central application to ingest OPCUA data, transform it, and export it to ADX.
- An ADX environment to store, manipulate, and explore the OPCUA data.

The following diagram shows the data flow in the scenario and highlights the key capabilities of IoT Central that are relevant to industrial solutions:

:::image type="content" source="media/tutorial-industrial-end-to-end/industrial-iot-architecture.png" alt-text="A diagram that shows the architecture of an industrial I O T scenario.":::

The sample uses a custom tool to deploy and configure all of the resources. The tool shows you what resources it deploys and provides links to further information.

## Prerequisites

- Azure subscription
- Local machine to run deploy tool - what platforms are supported?
- Local installation of Git - do they need to clone the repo?
- Text editor - do they need to edit the config file?

## Setup

- Create service principal
- Install tool
- Configure tool - service principal etc.

## Provision resources

Use the tool to provision the resources for the scenario. The tool deploys and configures the resources to create a running solution:

- Load config file in tool
- Run provisioning from tool
- How the tool works - ARM templates, REST API calls, documentation links from tool
- View resource group and resources in the Azure portal

## Walk through solution

The following sections describe the resources you deployed and what they do:

### OPCUA simulator

### IoT Edge

### Device templates and devices

Include device model and deployment manifest that configures the IoT Edge runtime.

Include running modules list for gateway device.

### Data export configuration

### Azure Data Explorer

- Tables
- Functions
- Sample analysis queries

## Next steps