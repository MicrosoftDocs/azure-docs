---
# Mandatory fields.
title: 'Tutorial: Build out an Azure Digital Twin solution'
description: Step-by-step view of the process to build out a digital twin representation of your space.
author: philmea
ms.author: philmea # Microsoft employees only
ms.date: 2/12/2020
ms.topic: tutorial
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---
# Build an Azure Digital Twin to represent your space

Intent: I want to understand how to integrate ADT into my IoT solution and build a proof of concept.​

Scenario: Build a complete IoT solution using ADT​

Goal: Build solution from the ground up, get solid core experience of platform from model to event handling​

Tooling: Azure subscription, CLI*, VS Code, .NET core​

Outline: ​

    - Update and extend an existing model​

    - Build simple .NET app for interacting with Digital Twins instance, integrate with AAD​

    - Add components to the Digital Twins graph (create twins, relationships, event handling)​

    - Identify what to change that will affect customer projects and works in their scenario​

* Potentially extend the Quickstart with custom code

## Walkthrough
In this section, we will walk through aspects of creating a Digital Twins solution:
* Connect to a service instance
* Create and upload models
* Write client app code to create twins, relationships and orchestrate IoT data processing
* Set properties on twins
* React to live cycle events
* Query the Digital Twins graph
* Event processing and routing
* Updating a solution
Unless otherwise mentioned, the code samples in the following sections would typically be part of a client app controlling and operating an ADT instance. See the Getting Started section above for more information on how to create and set up an ADT instance.

## Getting Started
This section is still sketch content. Update pending 
To get started with ADT development you will need:
* An Azure subscription. Add link for free subscription
* Azure CLI with Azure IoT CLI extensions, if you want to use command line tools or automation Add description and link for how to get 
* A development environment of your choice. 
TBD – what are we going to use in the manual? VS/VS Code
* An ADT language SDK of your choice (C#, Java, JavaScript or Python), unless you want to use the REST APIs directly. The ADT language SDK also contains the DTDL parser client library.
Creating an ADT Instance
You can use Azure Portal to create a new instance of ADT
Describe how to find the ADT PaaS offering in the portal and create an instance using the portal (public preview)
 
For production projects, however, we recommend using an automation-centric approach, where all artifacts – not just code, but also configuration scripts – are stored in version-controlled repositories. developer experience support. This approach makes it easier to implement a reliable development cycle.
 
To get started with ADT using a command line approach, create an empty project directory on your machine and issue the following commands:
az dt dev init
This will create an empty project set up readily for ADT development.
Alternatively, there are also several pre-built starter projects you can begin with:
az dt init --quickstart <project name>
Exact set of projects still TBD 

Documentation on how to work with the starter project or init project still outstanding

### Setting Up IoT Hub
Description on how to connect to IoT Hub
As part of the configuration of an ADT instance (in the portal or via CLI/ARM), you can connect a pre-existing IoT Hub to ADT. Once an IoT Hub is attached to ADT, ADT will automatically create special twins for all devices newly registered on IoT Hub. For PnP devices, it will also synchronize properties to the ADT graph. Finally, all telemetry from devices will produce telemetry messages in ADT.
See the section on IoT Hub Integration for more information.  
Setting up Endpoints
To connect ADT to downstream data consumers, you need to set up consumer endpoints in your subscription and attach them to ADT. Initially, supported endpoints include:
* Event Hub
* Event Grid
* Service Bus
To attach an endpoint to ADT, you need to create the endpoint in your subscription first, using the portal, command line or ARM. 
You can then use the ADT portal page or ARM/CLI to attach the endpoints to ADT.
Provide more detail on endpoint set up
