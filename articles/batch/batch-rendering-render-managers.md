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

If rendering work is being performed using an existing on-premises render farm, then it's highly likely that a render management system is being used to manage the render farm capacity and render jobs.

Azure support is either built in or provided as add-ons for popular render managers, allowing Azure VMs to be added and removed, including VMs with the pay-for-use application licensing and low-priority VMs.

The following render managers are supported:

* [PipelineFX Qube!](https://www.pipelinefx.com/)
* [Royal Render](http://www.royalrender.de/)
* [Thinkbox Deadline](https://deadline.thinkboxsoftware.com/)

## Using Azure with PipelineFX Qube

Scripts and instructions to enable Azure Batch pool VMs to be used as Qube workers are in [the GitHub repository](https://github.com/Azure/azure-qube).

## Using Azure with Royal Render

Royal Render has Azure and Azure Batch integration built-in, with the ability to create Azure-based VMs to extend a render farm. A summary of the capabilities available is included in [the help files](http://www.royalrender.de/help8/index.html?Cloudrendering.html).

For an example of a Royal Render customer using the Azure integration, see the [Jellyfish Pictures customer story](https://customers.microsoft.com/en-gb/story/jellyfishpictures).

## Using Azure with Thinkbox Deadline

Scripts and instructions to enable Azure Batch pool VMs to be used as Deadline slaves are in [the GitHub repository](https://github.com/Azure/azure-deadline).

## Next steps

Try out the Azure Batch integration for your render manager, using the appropriate plug-in and instructions on GitHub, where applicable.