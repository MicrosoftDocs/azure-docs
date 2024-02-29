---
title: Using rendering capabilities
description: How to use Azure Batch rendering capabilities. Try using the Batch Explorer application, either directly or invoked from a client application plug-in.
ms.date: 03/12/2020
ms.topic: how-to
---

# Using Azure Batch rendering

> [!WARNING]
> The rendering VM images and pay-for-use licensing have been [deprecated and will be retired on February 29, 2024](https://azure.microsoft.com/updates/azure-batch-rendering-vm-images-licensing-will-be-retired-on-29-february-2024/). To use Batch for rendering, [a custom VM image and standard application licensing should be used.](batch-rendering-functionality.md#batch-pools-using-custom-vm-images-and-standard-application-licensing)

There are several ways to use Azure Batch rendering:

* APIs:
  * Write code using any of the Batch APIs.  Developers can integrate Azure Batch capabilities into their existing applications or workflow, whether cloud or based on-premises.
* Command line tools:
  * The [Azure command line](/cli/azure/) or [PowerShell](/powershell/azure/) can be used to script Batch use.
  * In particular, the [Batch CLI template support](./batch-cli-templates.md) makes it much easier to create pools and submit jobs.
* Batch Explorer UI:
  * [Batch Explorer](https://github.com/Azure/BatchLabs) is a cross-platform client tool that also allows Batch accounts to be managed and monitored.
  * For each of the rendering applications, a number of pool and job templates are provided that can be used to easily create pools and to submit jobs.  A set of templates is listed in the application UI, with the template files being accessed from GitHub.
  * Custom templates can be authored from scratch or the supplied templates from GitHub can be copied and modified.
* Client application plug-ins:
  * Plug-ins are available that allow Batch rendering to be used from directly within the client design and modeling applications.  The plug-ins mainly invoke the Batch Explorer application with contextual information about the current 3D model and include features to help manage assets.

The best way to try Azure Batch rendering and simplest way for end-users, who are not developers and not Azure experts, is to use the Batch Explorer application, either directly or invoked from a client application plug-in.

## Using Batch Explorer

Batch Explorer [downloads are available](https://azure.github.io/BatchExplorer/) for Windows, OSX, and Linux.

### Using templates to create pools and run jobs

A comprehensive set of templates is available for use with Batch Explorer that makes it easy to create pools and submit jobs for the various rendering applications without having to specify all the properties required to create pools, jobs, and tasks directly with Batch.  The templates available in Batch Explorer are stored and visible in [a GitHub repository](https://github.com/Azure/BatchExplorer-data/tree/master/ncj).

![Batch Explorer Gallery](./media/batch-rendering-using/batch-explorer-gallery.png)

Templates are provided that cater for all the applications present on the Marketplace rendering VM images.  For each application multiple templates exist, including pool templates to cater for CPU and GPU pools, Windows and Linux pools; job templates include full frame or tiled Blender rendering and V-Ray distributed rendering. The set of supplied templates will be expanded over time to cater for other Batch capabilities, such as pool auto-scaling.

It's also possible for custom templates to be produced, from scratch or by modifying the supplied templates. Custom templates can be used by selecting the 'Local templates' item in the 'Gallery' section of Batch Explorer.

### File system and data movement

The 'Data' section in Batch Explorer allows files to be copied between a local file system and Azure Storage accounts.

## Next steps

* Learn about [using rendering applications with Batch](batch-rendering-applications.md).
* Learn about [Storage and data movement options for rendering asset and output files](batch-rendering-storage-data-movement.md).
