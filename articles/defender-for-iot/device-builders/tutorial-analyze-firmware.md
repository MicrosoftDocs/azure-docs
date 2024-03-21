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
> The Defender for IoT **Firmware analysis** feature is automatically available if you currently access Defender for IoT using the Security Admin, Contributor, or Owner role. If you only have the Security Reader role or want to use **Firmware analysis** as a standalone feature, then your Admin must give the Firmware Analysis Admin role. For additional information, please see [Defender for IoT Firmware Analysis Azure RBAC](defender-iot-firmware-analysis-rbac.md).
>

* If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.
* If you have a subscription but don't have a resource group where you could upload your firmware images, [create a resource group](/azure/azure-resource-manager/management/manage-resource-groups-portal#create-resource-groups).
* If you already have a subscription and resource group, move on to the next section.

To use the **Firmware analysis** page to analyze your firmware security, your firmware image must have the following prerequisites:

- You must have access to the compiled firmware image.

- Your image must be an unencrypted, Linux-based firmware image.

- Your image must be less than 5 GB in size.

## Onboard your subscription to use Defender for Firmware Analysis
> [!NOTE]
> To onboard a subscription to use Defender for Firmware analysis, you must be an Owner, Contributor, Firmware Analysis Admin, or Security Admin at the subscription level. To learn more about roles and their capabilities in Defender for Firmware Analysis, visit [Defender for IoT Firmware Analysis Roles, Scopes, and Capabilities](../../../articles/defender-for-iot/device-builders/defender-iot-firmware-analysis-rbac.md#defender-for-iot-firmware-analysis-roles-scopes-and-capabilities).
>

If this is your first interaction with **Firmware analysis**, then you'll need to onboard your subscription to the service and select a region in which to upload and store your firmware images.

1. Sign into the Azure portal and go to Defender for IoT.

    :::image type="content" source="media/tutorial-firmware-analysis/defender-portal.png" alt-text="Screenshot of the 'Getting started' page." lightbox="media/tutorial-firmware-analysis/defender-portal.png":::

2. Select **Set up a subscription** in the **Get Started** card, or select the **Subscription management** subtab.

    :::image type="content" source="media/tutorial-firmware-analysis/subscription-management.png" alt-text="Screenshot of the 'Subscription management' page." lightbox="media/tutorial-firmware-analysis/subscription-management.png":::

3. Select **Onboard a new subscription**

    :::image type="content" source="media/tutorial-firmware-analysis/onboard-subscription.png" alt-text="Screenshot of the 'Onboard subscription' pane appearing on the right side of the screen." lightbox="media/tutorial-firmware-analysis/onboard-subscription.png":::

4. In the **Onboard subscription** pane, select a subscription from the drop-down list.
5. Select a resource group from the **Resource group** drop-down or create a new resource group.
6. Select a region to use for storage in the **Location** drop-down.
7. Select **Onboard** to onboard your subscription to Defender for Firmware Analysis.

    :::image type="content" source="media/tutorial-firmware-analysis/completed-onboarding.png" alt-text="Screenshot of the 'Onboard subscription' pane when it's completed." lightbox="media/tutorial-firmware-analysis/completed-onboarding.png":::

## Upload a firmware image for analysis

If you've just onboarded your subscription, are signed into the Azure portal, and already in the Defender for IoT portal, skip to step two.

1. Sign into the Azure portal and go to Defender for IoT.

1. Select **Firmware analysis** > **Firmware inventory** > **Upload**.

1. In the **Upload a firmware image** pane, select **Choose file**. Browse to and select the firmware image file you want to upload.

    :::image type="content" source="media/tutorial-firmware-analysis/upload.png" alt-text="Screenshot that shows clicking the Upload option within Firmware Analysis." lightbox="media/tutorial-firmware-analysis/upload.png":::

1. Select a **Subscription** that you have onboarded onto Defender for IoT Firmware Analysis. Then select a **Resource group** that you would like to upload your firmware image to.

1. Enter the following details:

    - The firmware's vendor
    - The firmware's model
    - The firmware's version
    - An optional description of your firmware
    
1. Select **Upload** to upload your firmware for analysis.

    Your firmware appears in the grid on the **Firmware inventory** page. 

## View firmware analysis results

The analysis time will vary based on the size of the firmware image and the number of files discovered in the image. While the analysis is taking place, the status will say *Extracting* and then *Analyzing*.  When the status is *Ready*, you can see the firmware analysis results.

1. Sign into the Azure portal and go to Microsoft Defender for IoT > **Firmware analysis** > **Firmware inventory**.

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

Delete a firmware image from Defender for IoT when you no longer need it analyzed.

After you delete an image, there's no way to retrieve the image or the associated analysis results. If you need the results, you'll need to upload the firmware image again for analysis.

**To delete a firmware image**:

1. Select the checkbox for the firmware image you want to delete and then select **Delete**.

## Next steps

For more information, see [Firmware analysis for device builders](overview-firmware-analysis.md). Visit [FAQs about Defender for IoT Firmware Analysis](defender-iot-firmware-analysis-FAQ.md) for answers to frequent questions.
