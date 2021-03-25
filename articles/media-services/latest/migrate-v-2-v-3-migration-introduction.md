---
title: Migrate from Media Services v2 to v3 introduction
description: This article is an introduction to migrating from Media Services v2 to v3.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: conceptual
ms.workload: media
ms.date: 1/14/2020
ms.author: inhenkel
---

# Migrate from Media Services v2 to v3 introduction

![migration guide logo](./media/migration-guide/azure-media-services-logo-migration-guide.svg)

The Media Services migration guide helps you migrate from Media Services V2 APIs to V3 APIs based on a migration that takes advantage of the new features and functions that are now available. You should use your best judgment and determine what best fits your scenario.

## How to use this guide

### Navigating

Throughout the guide, you will see the following graphic.

![migration steps](./media/migration-guide/steps.svg)<br/>

The step you are on will be indicated by a color change in the number of the step, like so:

![migration steps 2](./media/migration-guide/steps-2.svg)<br/>

At the end of each page, you will see links to the rest of the migration documents you can read underneath the **Next steps** heading.

### Guidance

The guidance provided here is *general*. It includes content to improve your awareness of what is now available in V3 as well as what has changed in the Media Services workflows.

For more detailed guidance, including screenshots and conceptual graphics, there are links to concepts, tutorials, quickstarts, samples and API references in each scenario-based topic. We have also listed samples that help you compare the V2 API to the V3 API.

## Migration guidance overview

There are four general steps to follow during your migration:

## Step 1 Benefits

<hr color="#5ea0ef" size="10">

[Understand the benefits](migrate-v-2-v-3-migration-benefits.md) of migrating to Media Services API V3.

## Step 2 Differences

<hr color="#5ea0ef" size="10">

Understand the differences between Media Services V2 API and the V3 API.

- [API access](migrate-v-2-v-3-differences-api-access.md)
- [Feature gaps](migrate-v-2-v-3-differences-feature-gaps.md)
- [Terminology and entity changes](migrate-v-2-v-3-differences-terminology.md)

## Step 3 SDK setup

<hr color="#5ea0ef" size="10">

Understand the SDK differences and [set up to migrate to the V3 REST API or client SDK](migrate-v-2-v-3-migration-setup.md).

## Step 4 Scenario-based guidance

<hr color="#5ea0ef" size="10">

Your application of Media Services V2 may be unique. Therefore, we have provided scenario-based guidance based on how you *may have* used media services in the past and the steps for each feature of the service such as:

- [Encoding](migrate-v-2-v-3-migration-scenario-based-encoding.md)
- [Live streaming](migrate-v-2-v-3-migration-scenario-based-live-streaming.md)
- [Packaging and delivery](migrate-v-2-v-3-migration-scenario-based-publishing.md)
- [Content protection](migrate-v-2-v-3-migration-scenario-based-content-protection.md)
- [Media Reserved Units (MRU)](migrate-v-2-v-3-migration-scenario-based-media-reserved-units.md)

## Next steps

[!INCLUDE [migration guide next steps](./includes/migration-guide-next-steps.md)]
