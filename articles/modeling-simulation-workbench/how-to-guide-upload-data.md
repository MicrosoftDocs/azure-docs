---
title: Import data into Azure Modeling and Simulation Workbench
description: Learn how to import data into a chamber in Azure Modeling and Simulation Workbench.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: how-to
ms.date: 01/01/2023
# Customer intent: As a Chamber User in Azure Modeling and Simulation Workbench, I want to import data into my chamber.
---

# Import data into Azure Modeling and Simulation Workbench

You can use Azure Modeling and Simulation Workbench to run your design applications in a secure and managed environment in Azure. This article explains how to upload files and import data into a chamber.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An instance of Azure Modeling and Simulation Design Workbench installed with at least one chamber.
- A user who's provisioned as a Chamber Admin or Chamber User.
- [AzCopy](/azure/storage/common/storage-ref-azcopy) installed on the machine, with access to the configured network for the target chamber. Only machines on the specified network path for the chamber can upload files.

## Sign in to the Azure portal

Open your web browser and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal.

## Browse to the chamber and get the upload URL

1. Enter **Modeling and Simulation Workbench** in the global search. Then, under **Services**, select **Modeling and Simulation Workbench**.

1. Select your workbench from the resource list.

1. On the left menu, select **Settings** > **Chamber**. A resource list appears. Select the chamber that you want to upload the data to.

1. In the chamber overview section, select the **Upload File** button.

1. In the **Upload File** pop-up dialog, copy the **Upload URL** value.

1. Use the AzCopy command to upload your file. For example, use `azcopy copy <sourceFilePath> "<uploadURL>"`.

   > [!NOTE]
   > Supported characters for the file name are alphanumeric characters, underscores, periods, and hyphens.
   >
   > The data pipeline processes only files at the root. It doesn't process subfolders.

1. Confirm that the uploaded file resource with the source file name appears under **Chamber** > **Data Pipeline** > **File**.

A Chamber Admin or Chamber User can access the uploaded file from the chamber by accessing the following path: */mount/datapipeline/datain*.

> [!IMPORTANT]
> If you're importing multiple smaller files, we recommend that you zip or tarball them into a single file. Gigabyte-sized tarballs and zipped files are supported, depending on your connection type and network speed.

## Next steps

To learn how to export data from an Azure Modeling and Simulation Workbench chamber, see [Export data](./how-to-guide-download-data.md).
