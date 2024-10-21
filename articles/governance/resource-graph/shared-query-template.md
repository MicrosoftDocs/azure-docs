---
title: "Quickstart: Create Resource Graph shared query using ARM template"
description: In this quickstart, you use an Azure Resource Manager template (ARM template) to create a Resource Graph shared query that counts virtual machines by OS.
ms.date: 06/26/2024
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
---

# Quickstart: Create Resource Graph shared query using ARM template

In this quickstart, you use an Azure Resource Manager template (ARM template) to create a Resource Graph shared query. Resource Graph queries can be saved as a _private query_ or a _shared query_. A private query is saved to the individuals portal profile and isn't visible to others. A shared query is a Resource Manager object that can be shared with others through permissions and role-based access. A shared query provides common and consistent execution of resource discovery.

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template opens in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fdemos%2Fresourcegraph-sharedquery-countos%2Fazuredeploy.json":::

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Review the template

In this quickstart, you create a shared query called _Count VMs by OS_. To try this query in SDK or in portal with Resource Graph Explorer, go to [Samples - Count virtual machines by OS type](./samples/starter.md#count-virtual-machines-by-os-type).

The template used in this quickstart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/resourcegraph-sharedquery-countos/).

:::code language="json" source="~/quickstart-templates/demos/resourcegraph-sharedquery-countos/azuredeploy.json":::

The resource defined in the template is [Microsoft.ResourceGraph/queries](/azure/templates/microsoft.resourcegraph/queries).

## Deploy the template

1. Select the following image to sign in to the Azure portal and open the template:

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fdemos%2Fresourcegraph-sharedquery-countos%2Fazuredeploy.json":::

1. Select or enter the following values:

   | Name | Value |
   |------|-------|
   | Subscription | Select your Azure subscription. |
   | Resource group | Select **Create new**, specify a name, and then select **OK**. Or select an existing resource group. |
   | Location | Select a region. For example, **West US**. |
   | Query name | Use the default value: **Count VMs by OS**. |
   | Query code | Use the default value: `Resources | where type =~ 'Microsoft.Compute/virtualMachines' | summarize count() by tostring(properties.storageProfile.osDisk.osType)` |
   | Query description | Use the default value: **This shared query counts all virtual machine resources and summarizes by the OS type.** |

1. Select **Review + create**.
1. Select **Create**.

Some other resources:

- To find more sample templates, see
  [Browse code samples](/samples/browse/?expanded=azure&products=azure-resource-manager).
- To see the template reference, go to
  [Azure template reference](/azure/templates/microsoft.resourcegraph/allversions).
- To learn how to develop ARM templates, see
  [Azure Resource Manager documentation](../../azure-resource-manager/management/overview.md).
- To learn subscription-level deployment, see
  [Create resource groups and resources at the subscription level](../../azure-resource-manager/templates/deploy-to-subscription.md).

## Validate the deployment

To run the new shared query, follow these steps:

1. From the portal search bar, search for _Resource Graph queries_ and select it.
1. Select the shared query named **Count VMs by OS**, then select the **Results** tab on the
   **Overview** page.

The shared query can also be opened from Resource Graph Explorer:

1. From the portal search bar, search for _Resource Graph Explorer_ and select it.
1. Select the **Open a query**.
1. Change **Type** to _Shared queries_. If you don't see the **Count VMs by OS** in the list, use
   the filter box to limit the results by **Subscription** or **Resource group**. When the **Count VMs by OS** shared query is visible, select its name.
1. Select **Run query** and results are displayed in the **Results** tab.

In Resource Graph Explorer, on left side of page, you can change the **Scope** to use _Directory_, _Management group_, or _Subscription_.

## Clean up resources

To remove the shared query created, follow these steps:

1. From the portal search bar, search for _Resource Graph queries_ and select it.
1. Set the check box next to the shared query named **Count VMs by OS**.
1. Select **Delete**.
1. Enter _delete_ and select **Delete**.
1. Select **Delete** from the confirmation prompt.

## Next steps

In this quickstart, you created a Resource Graph shared query. To learn more about the Resource Graph language, continue to the query language details page.

> [!div class="nextstepaction"]
> [Understanding the Azure Resource Graph query language](./concepts/query-language.md)
