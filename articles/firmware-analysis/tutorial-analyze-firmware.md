---
title: Analyze a firmware image with the firmware analysis service.
description: Learn to analyze a compiled firmware image using firmware analysis.
ms.topic: tutorial
ms.date: 02/07/2025
author: karengu0
ms.author: karenguo
ms.service: azure-iot-operations
#Customer intent: As a device builder, I want to see what vulnerabilities or weaknesses might exist in my firmware image.
---

# Tutorial: Analyze an IoT/OT firmware image with firmware analysis 

This tutorial describes how to use the **firmware analysis** page to upload a firmware image for security analysis and view analysis results.

> [!NOTE]
> The **firmware analysis** page is in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Prerequisites

> [!NOTE]
> The **firmware analysis** feature is automatically available if you currently access Defender for IoT using the Security Admin, Contributor, or Owner role. If you only have the Security Reader role or want to use **firmware analysis** as a standalone feature, then your Admin must give the Firmware Analysis Admin role. For additional information, please see [Firmware analysis Azure RBAC](./firmware-analysis-rbac.md).
>

* If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.
* If you have a subscription but don't have a resource group where you could upload your firmware images, [create a resource group](/azure/azure-resource-manager/management/manage-resource-groups-portal#create-resource-groups).
* If you already have a subscription and resource group, move on to the next section.

To use the **firmware analysis** page to analyze your firmware security, your firmware image must have the following prerequisites:

- You must have access to the compiled firmware image.

- Your image must be an unencrypted, Linux-based firmware image.

- Your image must be less than 1 GB in size.

## Onboard your subscription to use firmware analysis
> [!NOTE]
> To onboard a subscription to use firmware analysis, you must be an Owner, Contributor, Firmware Analysis Admin, or Security Admin at the subscription level. To learn more about roles and their capabilities in firmware analysis, visit [Firmware analysis Roles, Scopes, and Capabilities](./firmware-analysis-rbac.md#firmware-analysis-roles-scopes-and-capabilities).
>

If this is your first interaction with **firmware analysis**, then you'll need to onboard your subscription to the service and select a region in which to upload and store your firmware images.

1. Sign into the Azure portal and search for "firmware analysis" in the Azure portal search bar.

    :::image type="content" source="media/tutorial-firmware-analysis/firmware-analysis-landing.png" alt-text="Screenshot of the 'Getting started' page." lightbox="media/tutorial-firmware-analysis/firmware-analysis-landing.png":::

2. Select the blue **Get started** button in the **Get Started** card, or select the **Firmware workspaces** subtab.

    :::image type="content" source="media/tutorial-firmware-analysis/subscription-management.png" alt-text="Screenshot of the 'Subscription management' page." lightbox="media/tutorial-firmware-analysis/subscription-management.png":::

3. Select **Create a Workspace**

    :::image type="content" source="media/tutorial-firmware-analysis/create-workspace.png" alt-text="Screenshot of the 'Onboard subscription' pane appearing on the right side of the screen." lightbox="media/tutorial-firmware-analysis/create-workspace.png":::

4. In the **Create a workspace** pane, select a subscription from the drop-down list.
5. Select a resource group from the **Resource group** drop-down or create a new resource group.
6. Enter your **Workspace name**.
7. Select a region to use for storage in the **Location** drop-down.
8. Select **Onboard** to create your workspace in your selected resource group and onboard your subscription to firmware analysis.

    :::image type="content" source="media/tutorial-firmware-analysis/completed-onboarding.png" alt-text="Screenshot of the 'Onboard subscription' pane when it's completed." lightbox="media/tutorial-firmware-analysis/completed-onboarding.png":::

## Upload a firmware image for analysis

If you've just onboarded your subscription, are signed into the Azure portal, and already in the firmware analysis portal, skip to step two.

1. Sign into the Azure portal and go to firmware analysis.

1. Go to the **Firmware workspaces** page, then select the workspace in which you'd like to upload images. Click the **Upload** button.

1. In the **Upload a firmware image** pane, drag and drop your firmware image or click on the grey box. Browse to and select the firmware image file you want to upload.

    :::image type="content" source="media/tutorial-firmware-analysis/upload.png" alt-text="Screenshot that shows clicking the Upload option within firmware analysis." lightbox="media/tutorial-firmware-analysis/upload.png":::

1. Enter the following details:

    - The firmware's vendor
    - The firmware's model
    - The firmware's version
    - An optional description of your firmware
    
1. Select **Upload** to upload your firmware for analysis.

    Your firmware appears in the grid on the **All firmware** page. 

## View firmware analysis results

The analysis time will vary based on the size of the firmware image and the number of files discovered in the image. While the analysis is taking place, the status will say *Extracting* and then *Analyzing*.  When the status is *Ready*, you can see the firmware analysis results.

1. Sign into the Azure portal and go to firmware analysis > **All firmware** page. Alternatively, you can go to the **Firmware workspaces** page, and select the workspace in which you have your firmware image.

1. Select the row of the firmware you want to view. The **Firmware overview** pane shows basic data about the firmware on the right.

    :::image type="content" source="media/tutorial-firmware-analysis/firmware-details.png" alt-text="Screenshot that shows clicking the row with the firmware image to see the side panel details." lightbox="media/tutorial-firmware-analysis/firmware-details.png":::
    
1. Select **View results** to drill down for more details.

    :::image type="content" source="media/tutorial-firmware-analysis/overview.png" alt-text="Screenshot that shows clicking view results button for a detailed analysis of the firmware image." lightbox="media/tutorial-firmware-analysis/overview.png":::
    
1. The firmware details page shows security analysis results on the following tabs:

    |Name |Description  |
    |---------|---------|
    |**Overview**     |   View an overview of all of the analysis results.|
    |**Software Components**     |   View a software bill of materials with the following details: <br><Br> - A list of open source components used to create firmware image <br>- Component version information <br>- Component license <br>- Executable path of the binary      |
    |**Weaknesses**     |  View a listing of common vulnerabilities and exposures (CVEs). <br><br>Select a specific CVE to view more details. |
    |**Binary Hardening**     |   View if executables compiled using recommended security settings: <br><br>- NX <br>- PIE<br>- RELRO<br>- CANARY<br>- STRIPPED<br><br> Select a specific binary to view more details.|
    |**Password Hashes**     |   View embedded accounts and their associated password hashes.<br><br>Select a specific user account to view more details.|
    |**Certificates**     |   View a list of TLS/SSL certificates found in the firmware.<br><br>Select a specific certificate to view more details.|
    |**Keys**     |   View a list of public and private crypto keys in the firmware.<br><br>Select a specific key to view more details.|

    :::image type="content" source="media/tutorial-firmware-analysis/weaknesses.png" alt-text="Screenshot that shows the weaknesses (CVE) analysis of the firmware image." lightbox="media/tutorial-firmware-analysis/weaknesses.png":::

## Delete a firmware image

Delete a firmware image from firmware analysis when you no longer need it analyzed.

After you delete an image, there's no way to retrieve the image or the associated analysis results. If you need the results, you'll need to upload the firmware image again for analysis.

**To delete a firmware image**:

1. Select the checkbox for the firmware image you want to delete and then select **Delete**.

## Next steps

For more information, see [Firmware analysis for device builders](./overview-firmware-analysis.md).

To use the Azure CLI commands for firmware analysis, refer to the [Azure CLI Quickstart](./quickstart-upload-firmware-using-azure-command-line-interface.md), and see [Azure PowerShell Quickstart](./quickstart-upload-firmware-using-powershell.md) to use the Azure PowerShell commands. See [Quickstart: Upload firmware using Python](./quickstart-upload-firmware-using-python.md) to run a Python script using the SDK to upload and analyze firmware images.

Visit [FAQs about firmware analysis](./firmware-analysis-faq.md) for answers to frequent questions.