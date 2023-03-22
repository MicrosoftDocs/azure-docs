---
title: How to upload data into an Azure Modeling and Simulation Workbench chamber
description: Learn how to upload data to chamber in Azure Modeling and Simulation Workbench
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: how-to
ms.date: 01/01/2023
# Customer intent: As a Modeling and Simulation Workbench chamber user, I want to upload data into my chamber
---

# How to upload data into an Azure Modeling and Simulation Workbench chamber

This article explains how to upload data into a chamber.
<!--- SCREENSHOT OF CHAMBER --->

Get started with Azure Modeling and Simulation Workbench (preview) to run your design applications in a secure and managed environment in Azure. This guide shows you how to use the Azure portal to upload files to a Modeling and Simulation Workbench chamber.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An instance of Modeling and Simulation Design Workbench installed with at least one chamber
- User must be provisioned as a Chamber Admin or Chamber User
- [AzCopy](/azure/storage/common/storage-ref-azcopy) installed on machine, which has access to the configured network for the target chamber. Only machines that are on the specified network path for the chamber can upload files.

## Sign in to Azure portal

Open your web browser, and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal.

## Browse to your Chamber and get an upload URL

1. Type *Modeling and Simulation Workbench* in the global search and select **Modeling and Simulation Workbench** under **Services**.

1. Choose your Modeling and Simulation Workbench from the resource list.

1. On the page, select the left side menu item **Chamber** and choose the chamber where you want the data to be uploaded, from the resource list shown.

1. From the chamber overview section, select the **Upload File** button.

1. In the **Upload File** popup, copy the Upload URL.

1. Using the AzCopy command, upload your file. for example, `azcopy copy <sourceFilePath> <uploadURL>`

1. The customer is able to see the uploaded file resource with source filename under **Chamber | Data Pipeline | File**.

1. Chamber Admin and chamber users can access the uploaded file from within the chamber by accessing the path: */mount/private/datain*.

  > [!IMPORTANT]
  >
  > If you are uploading multiple smaller files, it is recommended to zip or tarball into a single file.
  >
  > GB sized tarballs/zipped files supported, depending on your connection type and network speed.

## Next steps

To learn how to download data from an Azure Modeling and Simulation Workbench chamber, check [How to Download Data](./howtoguide-download-data.md)
