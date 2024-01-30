---
title: Move Azure Stream Analytics cluster - Azure PowerShell
description: Use Azure PowerShell and Azure Resource Manager to Move Azure Stream Analytics cluster to another region. 
author: xujxu
ms.author: xujiang1
ms.service: stream-analytics
ms.topic: overview
ms.custom: mvc, devx-track-azurepowershell, devx-track-arm-template
ms.date: 02/20/2022
---
# Move Azure Stream Analytics cluster using Azure PowerShell

Learn how to use Azure Az PowerShell module to move your Azure Stream Analytics cluster to another region.
You can move a Stream Analytics cluster by exporting the cluster’s ARM template using Azure portal and from there deploy another cluster with the same ARM template to your alternate region.

## Move Azure Stream Analytics cluster to another region

You must have the Azure Az PowerShell module installed on your machine to complete this procedure. Install the [latest version of PowerShell](/powershell/scripting/install/installing-powershell) available for your operating system.

1. Open Azure Portal. 
2. Select the resource group that contains the Stream Analytics cluster you want to move. 
3. Select the Azure Stream Analytics resource you want to move and then click **Export template**.

:::image type="content" source="./media/move-cluster/export-template.png" alt-text="Screenshot of Azure Portal, with Stream Analytics resource selected, and the Export Template button highlighted at upper right" lightbox="./media/move-cluster/export-template.png":::

4. Decompress the file and save the template to your local drive.
5. Sign in to Azure PowerShell using your Azure credentials.

```powershell
Connect-AzAccount
```
6. Run the following command, using the value for the subscription of the cluster you want to move.

```powershell
Set-AZContext: Set-AzContext -Subscription "<subscription id>"
```
7. Deploy the Stream Analytics template from your local drive.

```powershell
New-AzResourceGroupDeployment `
  -Name <Example> `
  -ResourceGroupName <name of your resource group> `
  -TemplateFile <path-to-template>
```
For more information on how to deploy a template using Azure PowerShell, see [Deploy a template](../azure-resource-manager/management/manage-resources-powershell.md#deploy-a-template).

## Next steps

- [Quickstart: Create an Azure Stream Analytics cluster](create-cluster.md).
- [Quickstart: Create a Stream Analytics job by using Azure portal](stream-analytics-quick-create-portal.md).
