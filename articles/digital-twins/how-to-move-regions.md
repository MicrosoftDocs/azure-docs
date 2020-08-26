---
# Mandatory fields.
title: Move instance to a different Azure region
titleSuffix: Azure Digital Twins
description: See how to move an Azure Digital Twins instance from one Azure region to another.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 08/26/2020
ms.topic: how-to
ms.custom: subject-moving-resources
ms.service: digital-twins
#Customer intent: As an Azure service administrator, I want to move my Azure Digital Twins instance to another region.

# Optional fields. Don't forget to remove # if you need a field.
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Move an Azure Digital Twins instance to a different Azure region

You can't move; you have to recreate. 

You will...
* Prepare: Download old graph
* Move: Create a new instance
* Move: Repopulate new instance
    - Upload old graph
    - Recreate routes & endpoints
    - Re-link connected Azure services
* Clean up source resources (optional): delete old instance

## Prerequisites

Understand your architecture and its pieces. including..
* Models
* Twins
* Relationships
* Endpoints
* Routes
* Other connections to Azure services. Some common ones include...
    - IoT Hub
    - Event Grid, Event Hub, Service Bus
    - Azure functions
    - Logic Apps
    - TSI
    - Maps
    - DPS

## Prepare

Get ready to run ADT Explorer

## Move

### Create a new instance

Can probably use the same name but needs to be in diff region (for ADT requirements) and diff resource group (for Azure requirements)
Follow the rest of our instructions to create a new instance

### Repopulate old instance

#### Upload original graph using ADT Explorer

#### Recreate routes & endpoints

#### Re-link connected Azure services

Change values in other services that link to it and reference its hostname.

<!-- Anything else changing, if the name can stay the same? -->

Commonly includes:
* Client app
* Azure function (new values & re-publish?)

## Verify

### Verify instance

Look for it in portal, look at region.

### Verify graph

Use ADT Explorer

### Verify endpoints and routes

Look under the instance in portal

### Verify other Azure services

Depends on the service, but try to run them.

## Clean up source resources

Use the portal or the CLI to delete the instance.