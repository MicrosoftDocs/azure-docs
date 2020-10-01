---
title: Create and manage integration runtimes in Babylon
description: This article explains the steps to create and manage integration runtimes in Babylon.
author: viseshag
ms.author: viseshag
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: Tutorial
ms.date: 09/11/2020
---

# Create and manage a self-hosted integration runtime for scanning

## Prerequisites

1. **Create a new Babylon account (or create date more recent than 9/15/2020). This capability is currently not available on older Babylon accounts and will be available by 10/9/2020.**

### Feature Flag

To create and manage an SHIR, please append the following to your URL: ?feature.ext.datasource={%22sqlServer%22:%22true%22}

E.g. full URL https://web.babylon.azure.com/?feature.ext.datasource={%22sqlServer%22:%22true%22}

## Create a self-hosted integration runtime

1. On the home page of Babylon Studio, select Management Center from the leftmost navigation pane.

    ![Navigate to management center](media/manage-integration-runtimes/image1.png)

2. Select Integration runtimes on the left pane, and then select +New.

    ![click on IR](media/manage-integration-runtimes/image2.png)

3. On the Integration runtime setup page, select Self-Hosted to create a Self-Hosted IR, and then select Continue.

    ![create new SHIR](media/manage-integration-runtimes/image3.png)

4. Enter a name for your IR, and select Create.

5. On the Integration runtime settings page, follow the steps under Manual setup section. You will have to download the integration runtime from the download site onto a VM or machine where you intend to run it.

    ![get key](media/manage-integration-runtimes/image4.png)

    a. Copy and paste the authentication key.
        
    b. Download the self-hosted integration runtime from [here](https://www.microsoft.com/en-us/download/details.aspx?id=39717) on a local Windows machine. Run the installer.
        
    c. On the Register Integration Runtime (Self-hosted) page, paste one of the 2 keys you saved earlier, and select Register.

    ![input key](media/manage-integration-runtimes/image5.png)

    d. On the New Integration Runtime (Self-hosted) Node page, select Finish.

6. After the self-hosted integration runtime is registered successfully, you see the following window:

    ![successfully registered](media/manage-integration-runtimes/image6.png)

## Manage a self-hosted integration runtime

You can edit a self-hosted integration runtime by navigating to 'integration runtimes' in the management center, selecting the IR and then clicking on edit. You can now update the description, copy the key or regenerate new keys.

![edit IR](media/manage-integration-runtimes/image7.png)

![edit IR details](media/manage-integration-runtimes/image8.png)

You can delete a self-hosted integration runtime by navigating to 'integration runtimes' in the management center, selecting the IR and then clicking on delete.

> [!NOTE]
> If scans are using this IR, then they will fail.