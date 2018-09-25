---
title: Azure Batch render manager support
description: Using Azure for rendering using Azure Batch render manager integration
services: batch
author: mscurrell
ms.author: markscu
ms.date: 08/02/2018
ms.topic: conceptual
---

# Using Azure Batch with render farm managers

If you're using an existing on-premises render farm, then it's highly likely that a render manager controls the render farm capacity and render jobs.

Azure provides either built-in support or add-ons for popular render managers. You can then add and remove Azure VMs, including VMs with the pay-for-use application licensing and low-priority VMs.

The following render managers are supported:

* [PipelineFX Qube!](https://www.pipelinefx.com/)
* [Royal Render](http://www.royalrender.de/)
* [Thinkbox Deadline](https://deadline.thinkboxsoftware.com/)

## Using Azure with PipelineFX Qube

Scripts and instructions to enable Azure Batch pool VMs to be used as Qube workers are in [the GitHub repository](https://github.com/Azure/azure-qube).

## Using Azure with Royal Render

Royal Render has Azure and Azure Batch integration built-in, allowing you to extend a render farm with Azure-based VMs. For a summary, see [the help files](http://www.royalrender.de/help8/index.html?Cloudrendering.html).

For an example of a Royal Render customer using the Azure integration, see the [Jellyfish Pictures customer story](https://customers.microsoft.com/en-gb/story/jellyfishpictures).

## Using Azure with Thinkbox Deadline

Scripts and instructions to enable Azure Batch pool VMs to be used as Deadline slaves are in [the GitHub repository](https://github.com/Azure/azure-deadline).

## Next steps

Try out the Azure Batch integration for your render manager, using the appropriate plug-in and instructions on GitHub, where applicable.