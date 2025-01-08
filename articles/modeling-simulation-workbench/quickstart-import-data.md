---
title: "Quickstart: Inport data"
description: "Import data into Modeling and Simulation Workbench."
author: yousefi-msft
ms.author: yousefi
ms.service: azure-modeling-simulation-workbench
ms.topic: quickstart
ms.date: 09/28/2024

#customer intent: As a user, I want to import data into a newly created Modeling and Simulation Workbench

---

# Quickstart: Import data

After you create a Modeling and Simulation Workbench, you might need data from your local environment to be available. Modeling and Simulation Workbench [chambers](./concept-chamber.md) have no access to the internet or other Azure resources. In this quickstart, learn how to import data from your previous environment to the workbench chamber.

If you don't have a service subscription,  [create a free trial account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Prerequisites

[!INCLUDE [prerequisite-mswb-chamber](includes/prerequisite-chamber.md)]

* A current public facing IP address must be on the allowlist if using public connector.

* The most recent version of [AzCopy](/azure/storage/common/storage-use-azcopy-v10?tabs=dnf), an Azure utility to manage data transfers to and from Azure. AzCopy is a standalone executable and doesn't require installation.

## Import data

1. In your newly created workbench, select **Settings** > **Chamber** from the menu on the left. A list of chambers appears. Select the chamber that you want to upload the data to.

1. In the chamber overview section, select the **Upload File** button from the action menu across the top center.

1. In the **Upload File** pop-up dialog, copy the **Upload URL** value.

1. Use the AzCopy command to upload your file. For example, use `azcopy copy <sourceFilePath> "<uploadURL>"`.

   > [!IMPORTANT]
   > Supported characters for the file name are alphanumeric characters, underscores, periods, and hyphens. Make sure that the file name does not have any spaces between characters, as it will cause the data import to fail.
   >
   > The data pipeline processes only files at the root. It doesn't process subfolders. If you're importing multiple smaller files in a folder hierarchy, we recommend that you zip or tarball them into a single file.
   >
   > Gigabyte-sized tarballs and zipped files are supported, up to a maximum of 200GB per file. Ensure that each individual file is less than the maximum allowed size.

Uploaded files appear at the `/mount/datapipeline/datain` mount point. A Chamber Admin or Chamber User can access the files there. The `/mount/datapipeline/` has a volume size of 1TB. If the combined imported dataset is larger than this, [create a chamber storage volume](./how-to-guide-manage-chamber-storage.md).

## Clean up resources

The `/mount/datapipeline/` has a volume size of 1TB. You should move data imports out of this mount point regularly into [a chamber storage volume](./how-to-guide-manage-chamber-storage.md).
