---
title: Import data into Azure Modeling and Simulation Workbench
description: Learn how to import data to chamber in Azure Modeling and Simulation Workbench
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: how-to
ms.date: 01/01/2023
# Customer intent: As a Modeling and Simulation Workbench Chamber User, I want to import data into my chamber
---

# Import data into Azure Modeling and Simulation Workbench

<!--- SCREENSHOT OF CHAMBER --->

Azure Modeling and Simulation Workbench (preview) allows you to run your design applications in a secure and managed environment in Azure. This article explains how to upload files/import data into a chamber.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An instance of Modeling and Simulation Design Workbench installed with at least one chamber.
- User must be provisioned as a Chamber Admin or Chamber User.
- [AzCopy](/azure/storage/common/storage-ref-azcopy) installed on machine, with access to the configured network for the target chamber. Only machines on the specified network path for the chamber can upload files.

## Sign in to Azure portal

Open your web browser and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal.

## Browse to Chamber and get upload URL

1. Type *Modeling and Simulation Workbench* in the global search and select **Modeling and Simulation Workbench** under **Services**.

1. Select your Modeling and Simulation Workbench from the resource list.

1. Select **Settings > Chamber** in the left side menu. A resource list displays. Select the chamber you want to upload the data to.

1. Select the **Upload File** button in the chamber overview section.

1. Copy the **Upload URL** in the Upload File popup.

1. Use the AzCopy command to upload your file. For example, `azcopy copy <sourceFilePath> "<uploadURL>"`

  > [!NOTE]
  > Supported filename characters are alphanumerics, underscores, periods, and hyphens.
  > Data pipeline will only process files at root, it will not process sub-folders.

1. The uploaded file resource with the source filename displays under **Chamber | Data Pipeline | File**.

1. The Chamber Admin and Users can access the uploaded file from the chamber by accessing the path: */mount/datapipeline/datain*.

  > [!IMPORTANT]
  >
  > If you're importing multiple smaller files, it's recommended to zip or tarball them into a single file.
  >
  > GB sized tarballs/zipped files are supported, depending on your connection type and network speed.

## Next steps

To learn how to export data from an Azure Modeling and Simulation Workbench chamber, check out [Export data.](./how-to-guide-download-data.md)
