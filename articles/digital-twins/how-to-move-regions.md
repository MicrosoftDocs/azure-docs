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

If you need to move your Azure Digital Twins instance from one region to another, the current process is to **recreate your resources in the new region**, and then (optionally) delete the original resources. At the end of this process, you will be working with a new Azure Digital Twins instance that is identical to the first, except for the updated location.

This article provides guidance on how to do a complete move, copying over everything you'll need to make the new instance match the original.

This process includes the following steps:
* Prepare: Download your original models, twins, and graph
* Move: Create a new Azure Digital Twins instance, in a new region
* Move: Repopulate the new Azure Digital Twins instance
    - Upload original models, twins, and graph
    - Recreate routes & endpoints
    - Re-link connected Azure services
* Clean up source resources (optional): Delete original instance

## Prerequisites

Before attempting to recreate your Azure Digital Twins instance, it's a good idea to go over the components of your original instance and get a clear idea of all the pieces that will need to be recreated.

Here are some questions you may want to consider:
* What are the **models** uploaded to my instance? How many are there?
* What are the **twins** in my instance? How many are there?
* What is the general shape of the **graph** in my instance? How many relationships are there?
* What **endpoints** do I have in my instance?
* What **routes** do I have in my instance?
* Where does my instance **connect to other Azure services**? Some common integration points include...
    - IoT Hub
    - Event Grid, Event Hub, or Service Bus
    - Azure functions
    - Logic Apps
    - Time Series Insights
    - Azure Maps
    - Device Provisioning Service (DPS)

You can gather this information using the [Azure portal](https://portal.azure.com), [Azure Digital Twins APIs and SDKs](how-to-use-apis-sdks.md), [Azure Digital Twins CLI commands](how-to-use-cli.md), or the [Azure Digital Twins (ADT) Explorer](quickstart-adt-explorer.md) sample.

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