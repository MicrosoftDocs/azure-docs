---
title: Azure Monitor Workbooks - Move Regions
description: How to move a workbook to a different region
services: azure-monitor
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: how-to
ms.custom: subject-moving-resources
ms.date: 06/21/2023
ms.reviewer: jgardner

#Customer intent: As an Azure service administrator, I want to move my resources to another Azure region
---

# Move an Azure Workbook to another region

This article describes how to move Azure Workbook resources to a different Azure region. You might move your resources to another region for a number of reasons. For example, to take advantage of a new Azure region, to deploy features or services available in specific regions only, to meet internal policy and governance requirements, or in response to capacity planning requirements.

## Prerequisites

* Ensure that workbooks are supported in the target region.

* These instructions apply to workbooks (`microsoft.insights/workbooks`) saved in Azure Monitor and on most resource types.

  However, for workbooks specifically linked to the Application Insights resource type, those workbooks are stored in the Azure region where the Application Insights resource is saved.

  Those workbooks cannot be individually moved to another region.

## Move

The simplest way to move an Azure Workbook is to use "Save as" in the Workbooks tool in the Portal UI:

1. Open the target workbook in the workbook viewer.
2. Use the "Edit" toolbar button to enter edit mode.
3. Use the "Save As" toolbar button.
4. In the Save form, choose a name and the desired region for the workbook. Ensure the other fields for subscription, resource group, and sharing are appropriate.

   > [!NOTE]
   > You may need to use a new name for the workbook to avoid any duplicate names.

5. Save. 

## Verify

Use the Azure Workbooks browse UI to locate the new workbook. Ensure the location is the target location.

## Clean up

Once your workbook has been created in the new region, delete the original workbook in the previous region.
1. Open the original workbook in the workbook viewer.
2. Use the "Edit" toolbar button to enter edit mode.
3. From the edit tools dropdown (pencil icon), choose "Delete Workbook".

If you renamed your workbook to import it into a new region, you can rename the workbook to the previous name after the original workbook has been deleted by using the Edit Mode toolbar's edit tools dropdown "Rename" item.

## Next Steps

Need to move a workbook template instead of a workbook? See how to [move an Azure Workbook Template to another region](./workbook-templates-move-region.md).

See how to [deploy Workbooks and Workbook Templates](../visualize/workbooks-automate.md) via ARM Templates.
