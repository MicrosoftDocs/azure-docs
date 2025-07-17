---
title: 'Quickstart: Analyze a Firmware Image'
description: Learn how to use the Azure portal to analyze a firmware image with firmware analysis.
author: karengu0
ms.author: karenguo
ms.service: azure-iot-operations
ms.topic: quickstart
ms.date: 07/14/2025
---

# Quickstart: Analyze a firmware image

In this quickstart, learn how to use the Azure portal to upload a firmware image for security analysis and view the results using the **firmware analysis** feature in Velma.

If you don't have an Azure subscription, https://azure.microsoft.com/free/ before you begin.

> [!NOTE]
> The **firmware analysis** page is in PREVIEW. The https://azure.microsoft.com/support/legal/preview-supplemental-terms/ include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

> [!NOTE]
> The **firmware analysis** feature is automatically available if you currently access Defender for IoT using the Security Admin, Contributor, or Owner role. If you only have the Security Reader role or want to use **firmware analysis** as a standalone feature, your Admin must assign the Firmware Analysis Admin role. For more information, see [Firmware analysis Azure RBAC](./firmwaresubscription and a resource group. If needed, [create a resource group](/azure/azure-resource-manager/management/manage-resource-groups-portal#create-resource-groupsd Linux-based firmware image less than 1 GB in size.

## Onboard your subscription

1. Sign in to the [Azure portal](https://portal.azure.com) and search for **firmware analysis**.
started** or go to the **Firmware workspaces** tab.
3. Select **Create a workspace**.
4. In the **Create a workspace** pane:
   - Choose your subscription.
   - Select or create a resource group.
   - Enter a workspace name.
   - Choose a region.
5. Select **Onboard** to complete the setup.

## Upload a firmware image

1. In the Azure portal, go to **firmware analysis** > **Firmware workspaces**, and select your workspace.
2. Select **Upload**.
3. In the **Upload a firmware image** pane:
   - Drag and drop your firmware image or browse to select it.
   - Enter the firmware's vendor, model, version, and an optional description.
4. Select **Upload**.

Your firmware will appear in the **All firmware** grid.

## View analysis results
1. In the Azure portal, go to **firmware analysis** > **All firmware**, or navigate to your workspace.
2. Select the firmware row to open the **Firmware overview** pane.
3. Select **View results** to see detailed analysis.

The results include:

| Tab | Description |
|-----|-------------|
| **Overview** | Summary of analysis results. |
| **Software Components** | Software bill of materials, including open source components, versions, licenses, and paths. |
| **Weaknesses** | List of CVEs. Select a CVE for details. |
| **Binary Hardening** | Security settings used in compiled binaries (NX, PIE, RELRO, CANARY, STRIPPED). |
| **Password Hashes** | Embedded accounts and password hashes. |
| **Certificates** | TLS/SSL certificates found. |
| **Keys** | Public and private cryptographic keys found. |

## Delete a firmware image

To delete an image and its results:

1. Select the checkbox next to the firmware image.
2. Select **Delete**.

> [!WARNING]
> Deletion is permanent. To view results again, you must re-upload the image.

## Next steps

> [!div class="nextstepaction"]
> ./overview-firmware-analysis.md

- ./quickstart-upload-firmware-using-azure-command-line-interface.md
- ./quickstart-upload-firmware-using-powershell.md
- ./quickstart-upload-firmware-using-python.md
- ./firmware-analysis-faq.md
