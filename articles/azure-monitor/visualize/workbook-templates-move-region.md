---
title: Move and Azure Workbook template to another region
description: How to move a workbook template to a different region
services: azure-monitor
manager: acearun
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: how-to
ms.custom: subject-moving-resources
ms.date: 06/21/2023
ms.reviewer: jgardner

#Customer intent: As an Azure service administrator, I want to move my resources to another Azure region
---
# Move an Azure Workbook Template to another region

This article describes how to move Azure Workbook Template resources to a different Azure region. You might move your resources to another region for a number of reasons. For example, to take advantage of a new Azure region, to deploy features or services available in specific regions only, to meet internal policy and governance requirements, or in response to capacity planning requirements.

There currently is no portal UI to create Workbook Template resources, the only current way to create them is [via Azure Resource Manager Template (ARM template) deployments](../visualize/workbooks-automate.md). As such, the easiest way to move a template is to reuse the previous ARM template and update it to be deployed to the new region.

## Prerequisites

* Ensure that workbook templates are supported in the target region.

## Prepare

* Identify the previously used ARM Template for the workbook template.

## Move

1. Update the previously used template to reference the new region.

   > [!NOTE]
   > You may need to use a new name for the workbook template to avoid any duplicate names.

2. Deploy the updated template via ARM template deployment to create a new workbook template in the desired region.

## Verify

Use the Azure Workbooks browse UI to locate the newly deployed workbook template. Ensure the location is the target location.

## Clean up

Once your workbook template has been created in the new region, delete the original workbook template in the previous region.
1. Find the workbook template in the Azure Workbooks browse UI.
2. Select the workbook template to delete.
3. Select the "Delete" command.

If you renamed your workbook template to import it into a new region, you can rename the workbook template to the previous name after the original item has been deleted by using the "Rename" command in the Azure Workbook Template resource view.

## Next Steps

Need to move a workbook instead of a template? See how to [move an Azure Workbook to another region](./workbooks-move-region.md).

