---
title: Create VMware Tools repo to allow the uploading newer Tools version
description: By default the VMware Tools version is the one that comes out with the ESXi version that is runing. Depending on how old that is the customer might want to upload a newer version. This will create a folder and set the ESXi hosts to use it. It is the customer's responsibility to upload the version that they want.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 02/13/2023
---

# Configure ESXi to get VMware Tools from a directory on the vSAN datastore

Guidance [here](https://review.learn.microsoft.com/help/contribute/contribute-how-to-write-seo-basics?branch=main)

By configuring a VMware Tools repo on shared space you can easily upload a newer version of VMware Tools for your VMs to use.

In this artticle, you learn how to:

> [!div class="checklist"]
>
> * Use the run command to create and configure the tools-repo directory
> * Login to [VMware's Customer Connect](https://customerconnect.vmware.com/) -- You might need to create an account
> * Find and download the version of Tools that you want
> * Upload new files

> [!NOTE]
> When you want to upload a new version of VMware Tools you will need to go through this process again. Also, if you create a new cluster it will need to be repeated.

## Prerequisites

* Ability to use "run" commands in the Azure Portal against your SDDC

## Create repo directory and configure ESXi to use it

1. Login to the Azure Portal and go to your SDDC.
1. Use the "Run command" option under "Operations" in the left pane.
1. Under the Microsoft.AVS.Management commands you will find "Set-ToolsRepo".
1. Run it without supplying any options.
1. This might take a few minutes. It will create a directory at the root of every cluster's vSAN datastore and will configure the ESXi hosts to use it for their VMware Tools repo.

## Download Tools package from VMware

1. [Login to Customer Connect](https://customerconnect.vmware.com/)
    * If you don't have one you will need to o create one.
1. Go to "All Products" to search for VMware Tools files
    * The tiles in the middle of your screen might be in a different order. You can choose the one on the far right.

   :::image type="content" source="media/run-command/tools-repo-all-products.png" alt-text="Screenshot showing Connect after logging in." lightbox="media/run-command/tools-repo-all-products.png":::

1. In the search box put "vmware tools"

   :::image type="content" source="media/run-command/tools-repo-search.png" alt-text="Search Box." lightbox="media/run-command/tools-repo-search.png":::

1. The next screen should display a "VMware Tools" product. The version might be different from what is shown. Select it.

   :::image type="content" source="media/run-command/tools-repo-select-tools.png" alt-text="Select the tools package." lightbox="media/run-command/tools-repo-select-tools.png":::

1. When you find the "VMware Tools packages for Windows" download them. You can get the zip or gz file.

   :::image type="content" source="media/run-command/tools-repo-windows-package.png" alt-text="Get the Windows package. (Linux is managed with Open-tools)" lightbox="media/run-command/tools-repo-windows-package.png":::

1. Once downloaded unzip them. There should be two directories: floppies, vmtools.

   :::image type="content" source="media/run-command/tools-repo-files.png" alt-text="The two directories from the unziped file." lightbox="media/run-command/tools-repo-files.png":::

1. Upload these directories to the newly created 'tools-repo' on your vSAN datastore.

## Next steps

For information about machine learning, see [Another article](template-howto.md)
