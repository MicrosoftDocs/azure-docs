---
title: How to download data from an Azure Modeling and Simulation Workbench chamber
description: Learn how to how to download data from a chamber in Azure Modeling and Simulation Workbench
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: how-to
ms.date: 01/01/2023
# Customer intent: As a Modeling and Simulation Workbench chamber user, I want to download data from my chamber
---

# How to download data from an Azure Modeling and Simulation Workbench chamber

This article explains how to download data from a chamber.
<!--- SCREENSHOT OF CHAMBER --->

This guide shows you how to use the Azure portal to upload files to a Modeling and Simulation Workbench chamber.

The process to download data is a 'two key approvals' process. You will need both a Chamber Admin, and your organizations Workbench Owner to complete this process.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An instance of Modeling and Simulation Design Workbench installed with at least one chamber
- A user who is an Workbench Owner (Subscription Owner/Contributor) and a user provisioned as a Chamber Admin or Chamber User
- [AzCopy](https://learn.microsoft.com/azure/storage/common/storage-ref-azcopy) installed on machine which has access to the configured network for the target chamber. Only machines which are on the specified network path for the chamber can download files.

## Sign in to Azure portal

Open your web browser, and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal.

## Log into your chamber

As a Chamber User or a Chamber Admin, browse to your connector to get the Dashboard URL to log into your chamber.

1. Type *Modeling and Simulation Workbench* in the global search and select **Modeling and Simulation Workbench** under **Services**.

1. Choose your Modeling and Simulation Workbench from the resource list.

1. On the page, select the left side menu item **Chamber**, and choose the chamber where you want to download the data from, from the resource list located on the right.

1. Select the left side menu item for connector.

1. From the connector overview section, click on the "Dashboard URL". This should take you to the ETX dashboard.

1. Select a workload available and open a terminal session.

1. Within workload terminal session, copy a file to /mount/private/dataout.

## Request download

As a Chamber Admin, perform the following steps to request a file to be downloaded out of the chamber.

1. From the Chamber you are downloading data from, choose **File** from under **Data Pipeline**

1. Select the file you want to download from the resource list located on the right. Files will be named "mount-private-datain-<filename>"

1. In the file overview section, note the data pipeline direction needs to be **outbound**, click on the **Request download** option.

1. Type in a reason, and click **File Request**

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the Azure portal manage screen showing how to select Approved Action](./media/howtoguide-download-data/filerequestdownload.png)

## Approve download

As a Workbench Owner, perform the following steps to manage a file request, you can Approve or Reject. For this 'How To', we are instructing the approval process.

1. From the Chamber you are downloading data from, choose **File Request** from under **Data Pipeline**.

1. Select the file request you want to manage from the resource list located on the right. Note the file request status should be **Requested**.

1. In the file request overview section, the file request status should be **Requested**, if the file is not requested you cannot approve it.

1. In the file request overview section, click on the **manage** option.

1. In the **Action** drop-down, select **Approved**, and enter a description.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the Azure portal manage screen showing how to select Approved Action](./media/howtoguide-download-data/filerequestapprove.png)

1. Click on **Manage** to complete the approval

1. You should observe in the file request overview section, the status could be **Approved**.

## Download file from chamber

As a Chamber Admin, perform the following steps to download an approved file request from a chamber. Note you must be on approved chamber network to be able to download the file.

1. From the Chamber you are downloading data from, choose **File Request** from under **Data Pipeline**

1. Select the file request you want to download from the resource list located on the right.

1. In the file request overview section, the file request status should be **Approved**. If it is not approved, you cannot download it.

1. In the file request overview section, click on the **Download URL** option, and copy the Download URL.

1. Using the AzCopy command, download your file. e.g. `azcopy copy <downloadURL> <targetFilePath>`

  > [!IMPORTANT]
  >
  > If you are downloading multiple smaller files, it is recommended to zip or tarball into a single file.
  >
  > GB sized tarballs/zipped files supported, depending on your connection type and network speed.

## Next steps

To learn how to manage your chamber storage, [How to Manage Chamber Storage](./howtoguide-manage-storage.md)
