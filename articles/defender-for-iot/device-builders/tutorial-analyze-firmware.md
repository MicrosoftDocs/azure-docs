---
title: Analyze a firmware image with Microsoft Defender for IoT.
description: Learn to analyze a compiled firmware image within Microsoft Defender for IoT.
ms.topic: tutorial
ms.date: 06/15/2023    
#Customer intent: As a device builder, I want to see what vulnerabilities or weaknesses might exist in my firmware image.
---

# Tutorial: Analyze an IoT/OT firmware image

This tutorial describes how to use Defender for IoT's **Firmware analysis** page to upload a firmware image for security analysis and view analysis results.

> [!NOTE]
> The Defender for IoT **Firmware analysis** page is in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Prerequisites

> [!NOTE]
> The Defender for IoT **Firmware Analysis** feature is automatically available if you currently access Defender for IoT using the Security Admin, Contributor, or Owner role. If you only have the SecurityReader role or want to use Firmware Analysis as a standalone feature, then your Admin must give the FirmwareAnalysisAdmin role. For additional information, please see [Azure User Roles and Permissions](/azure/role-based-access-control/built-in-roles).
>

To use the **Firmware analysis** page to analyze your firmware security, your firmware image must have the following prerequisites:

- You must have access to the compiled firmware image.

- Your image must be an unencrypted, Linux-based firmware image.

- Your image must be less than 1 GB in size.

## Select the region for storing firmware images

If this is your first interaction with **Firmware analysis,** then you'll need to select a region in which to upload and store your firmware images. 

1. Sign into the Azure portal and go to Defender for IoT.

    :::image type="content" source="media/tutorial-firmware-analysis/defender-portal.png" alt-text="Screenshot that shows the Defender for IoT portal.":::

1. Select **Firmware analysis**.
1. Select a region to use for storage.

    :::image type="content" source="media/tutorial-firmware-analysis/select-region.png" alt-text="Screenshot that shows selecting an Azure Region.":::

## Upload a firmware image for analysis

1. Sign into the Azure portal and go to Defender for IoT.

1. Select **Firmware analysis** > **Upload**.

1. In the **Upload a firmware image** pane, select **Choose file**. Browse to and select the firmware image file you want to upload.

    :::image type="content" source="media/tutorial-firmware-analysis/upload.png" alt-text="Screenshot that shows clicking the Upload option within Firmware Analysis.":::

1. Enter the following details:

    - The firmware's vendor
    - The firmware's model
    - The firmware's version
    - An optional description of your firmware
    
1. Select **Upload** to upload your firmware for analysis.

    Your firmware appears in the grid on the **Firmware analysis** page. 
    
## View firmware analysis results

The analysis time will vary based on the size of the firmware image and the number of files discovered in the image. While the analysis is taking place, the status will say *Extracting* and then *Analysis*.  When the status is *Ready*, you can see the firmware analysis results.

1. Sign into the Azure portal and go to Microsoft Defender for IoT > **Firmware analysis**.

1. Select the row of the firmware you want to view. The **Firmware overview** pane shows basic data about the firmware on the right.

    :::image type="content" source="media/tutorial-firmware-analysis/firmware-details.png" alt-text="Screenshot that shows clicking the row with the firmware image to see the side panel details.":::
    
1. Select **View results** to drill down for more details.

    :::image type="content" source="media/tutorial-firmware-analysis/overview.png" alt-text="Screenshot that shows clicking view results button for a detailed analysis of the firmware image.":::
    
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

    :::image type="content" source="media/tutorial-firmware-analysis/weaknesses.png" alt-text="Screenshot that shows the weaknesses (CVE) analysis of the firmware image.":::

## Delete a firmware image

Delete a firmware image from Defender for IoT when you no longer need it analyzed.

After you delete an image, there's no way to retrieve the image or the associated analysis results. If you need the results, you'll need to upload the firmware image again for analysis.

**To delete a firmware image**:

1. Select the checkbox for the firmware image you want to delete and then select **Delete**.

## Next steps

For more information, see [Firmware analysis for device builders](overview-firmware-analysis.md).

