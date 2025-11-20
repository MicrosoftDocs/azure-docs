---
title: 'Quickstart: Analyze a Firmware Image'
description: Learn how to use the Azure portal to analyze a firmware image with firmware analysis.
author: karengu0
ms.author: karenguo
ms.service: azure
ms.topic: quickstart
ms.date: 07/17/2025
---

# Quickstart: Analyze a firmware image

In this quickstart, learn how to use the Azure portal to upload a firmware image for security analysis and view the results.

If you don't have an Azure subscription, you can [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

## Prerequisites

> [!NOTE]
> The **firmware analysis** feature is automatically available if you currently access Defender for IoT using the Security Admin, Contributor, or Owner role. If you only have the Security Reader role or want to use **firmware analysis** as a standalone feature, your Admin must assign the Firmware Analysis Admin role. For additional information, please see [Firmware analysis Azure RBAC](./firmware-analysis-rbac.md).

## Onboard your subscription

1. Sign in to the [Azure portal](https://portal.azure.com) and search for **firmware analysis**. Select the blue **Get started** button or go to the **Firmware workspaces** tab.

:::image type="content" source="media/tutorial-firmware-analysis/firmware-analysis-landing.png" alt-text="Screenshot of the 'Getting started' page." lightbox="media/tutorial-firmware-analysis/firmware-analysis-landing.png":::

2. Select **Create a workspace**.
3. In the **Create a workspace** pane:
   - Choose your subscription.
   - Select or create a resource group.
   - Enter a workspace name.
   - Choose a region.
4. Select **Onboard** to complete the setup.

:::image type="content" source="media/tutorial-firmware-analysis/completed-onboarding.png" alt-text="Screenshot of the 'Onboard subscription' pane when it's completed." lightbox="media/tutorial-firmware-analysis/completed-onboarding.png":::


## Upload a firmware image

1. In the Azure portal, go to **firmware analysis** > **Firmware workspaces**, and select your workspace.
2. Select **Upload**.
3. In the **Upload a firmware image** pane:
   - Drag and drop your firmware image or browse to select it.
   - Enter the firmware's vendor, model, version, and an optional description.
4. Select **Upload**.

Your firmware will appear in the **All firmware** grid.

:::image type="content" source="media/tutorial-firmware-analysis/upload.png" alt-text="Screenshot that shows clicking the Upload option within firmware analysis." lightbox="media/tutorial-firmware-analysis/upload.png":::

## View analysis results
1. In the Azure portal, go to **firmware analysis** > **All firmware**, or navigate to your workspace.
2. Select the firmware row to open the **Firmware overview** pane.
3. Select **View results** to see detailed analysis.

:::image type="content" source="media/tutorial-firmware-analysis/overview.png" alt-text="Screenshot that shows clicking view results button for a detailed analysis of the firmware image." lightbox="media/tutorial-firmware-analysis/overview.png":::

The results include:

| Tab | Description |
|-----|-------------|
| **Analysis overview** | Summary of analysis results. |
| **SBOM** | Software bill of materials, including open source components, versions, licenses, and executable paths. |
| **Weaknesses** | List of CVEs. Select a CVE for details. |
| **Binary hardening** | Security settings used in compiled binaries (NX, PIE, RELRO, CANARY, STRIPPED). |
| **Password hashes** | Embedded accounts and password hashes. |
| **Certificates** | TLS/SSL certificates found. |
| **Keys** | Public and private cryptographic keys found. |

## Delete a firmware image

To delete an image and its results:

1. Select the checkbox next to the firmware image.
2. Select **Delete**.

> [!WARNING]
> Deletion is permanent. To view results again, you must re-upload the image.

