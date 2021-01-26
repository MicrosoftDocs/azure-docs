---
title: Render manager support
description: Using Azure Batch render manager integration. Learn about built-in support or add-ons for popular render managers.
author: mscurrell
ms.author: markscu
ms.date: 08/02/2018
ms.topic: how-to
---

# Using Azure Batch with render farm managers

If you're using an existing on-premises render farm, then it's highly likely that a render manager controls the render farm capacity and render jobs.

Azure provides either built-in support or add-ons for popular render managers. You can then add and remove Azure VMs, including VMs with the pay-for-use application licensing and low-priority VMs.

The following render managers are supported:

* [PipelineFX Qube!](https://www.pipelinefx.com/)
* [Royal Render](https://www.royalrender.de/)
* [Thinkbox Deadline](https://deadline.thinkboxsoftware.com/)

## Azure Render Hub

Azure Render Hub simplifies the creation and management of Azure render farms.  Render Hub has native support for PipelineFx Qube and Deadline 10.  For more information and detailed instructions see [the GitHub repository](https://github.com/Azure/azure-render-hub).

## Using Azure with PipelineFX Qube

Azure Render Hub supports popular render managers including Deadline.  For instructions on deploying and using Render Hub see [the GitHub repository](https://github.com/Azure/azure-render-hub).

Scripts and instructions to enable Azure Batch pool VMs to be used as Qube workers are also available in [the GitHub repository](https://github.com/Azure/azure-qube).

## Using Azure with Royal Render

Royal Render has Azure and Azure Batch integration built-in, allowing you to extend a render farm with Azure-based VMs. For a summary, see [the help files](https://www.royalrender.de/help8/index.html?Cloudrendering.html).

For an example of a Royal Render customer using the Azure integration, see the [Jellyfish Pictures customer story](https://customers.microsoft.com/story/jellyfishpictures).

## Using Azure with Thinkbox Deadline

Azure Render Hub supports popular render managers including Deadline.  For instructions on deploying and using Render Hub see [the GitHub repository](https://github.com/Azure/azure-render-hub).

## Next steps

Try out the Azure Batch integration for your render manager, using the appropriate plug-in and instructions on GitHub, where applicable.
