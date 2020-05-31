---
title: "Quickstart: Create a shared query with templates"
description: In this quickstart, you use a Resource Manager template to create a Resource Graph shared query that counts virtual machines by OS.
ms.date: 04/28/2020
ms.topic: quickstart
ms.custom: subject-armqs
---
# Quickstart: Create a shared query by using a Resource Manager template

Resource Graph queries can be saved as a _private query_ or a _shared query_. A private query is
saved to the individuals portal profile and isn't visible to others. A shared query is a Resource
Manager object that can be shared with others through permissions and role-based access. A shared
query provides common and consistent execution of resource discovery. This quickstart uses a
Resource Manager template to create a shared query.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

## Create a shared query

In this quickstart, you create a shared query called _Count VMs by OS_. To try this query in SDK or
in portal with Resource Graph Explorer, see
[Samples - Count virtual machines by OS type](./samples/starter.md#count-os).

### Review the template

The template used in this quickstart is from [Azure Quickstart templates](https://azure.microsoft.com/resources/templates/resourcegraph-sharedquery-countos/).

:::code language="json" source="~/quickstart-templates/resourcegraph-sharedquery-countos/azuredeploy.json" highlight="28-37":::

The resource defined in the template is:

- [Microsoft.ResourceGraph/queries](/azure/templates/microsoft.resourcegraph/queries)

### Deploy the template

> [!NOTE]
> Azure Resource Graph service is free. For more information, see
> [Overview of Azure Resource Graph](./overview.md).

1. Select the following image to sign in to the Azure portal and open the template:

   [![Deploy the Policy template to Azure](../../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fresourcegraph-sharedquery-countos%2Fazuredeploy.json)

1. Select or enter the following values:

   | Name | Value |
   |------|-------|
   | Subscription | Select your Azure subscription. |
   | Resource group | Select **Create new**, specify a name, and then select **OK**. |
   | Location | Select a region. For example, **Central US**. |
   | Query name | Leave the default value **Count VMs by OS**. |
   | Query code | Leave the default value `Resources | where type =~ 'Microsoft.Compute/virtualMachines' | summarize count() by tostring(properties.storageProfile.osDisk.osType)` |
   | Query description | Leave the default value **This shared query counts all virtual machine resources and summarizes by the OS type.** |
   | I agree to the terms and conditions stated above | (Select) |

1. Select **Purchase**.

Some additional resources:

- To find more samples templates, see
  [Azure Quickstart template](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Authorization&pageNumber=1&sort=Popular).
- To see the template reference, go to
  [Azure template reference](/azure/templates/microsoft.resourcegraph/allversions).
- To learn how to develop Resource Manager templates, see
  [Azure Resource Manager documentation](../../azure-resource-manager/management/overview.md).
- To learn subscription-level deployment, see
  [Create resource groups and resources at the subscription level](../../azure-resource-manager/templates/deploy-to-subscription.md).

## Validate the deployment

To run the new shared query, follow these steps:

1. From the portal search bar, search for **Resource Graph queries** and select it.

1. Select the shared query named **Count VMs by OS**, then select the **Results** tab on the
   **Overview** page.

Alternatively, the shared query can be opened from Resource Graph Explorer:

1. From the portal search bar, search for **Resource Graph Explorer** and select it.

1. Select the **Open a query** button.

1. Change **Type** to _Shared queries_. If you don't see the **Count VMs by OS** in the list, use
   the filter box to limit the results. Once the **Count VMs by OS** shared query is visible, select
   its name.

1. Once the query is loaded, select the **Run query** button. Results are displayed in the
   **Results** tab below.

## Clean up resources

To remove the shared query created, follow these steps:

1. From the portal search bar, search for **Resource Graph queries** and select it.

1. Set the check box next to the shared query named **Count VMs by OS**.

1. Select the **Delete** button along the top of the page.

## Next steps

In this quickstart, you created a Resource Graph shared query.

To learn more about shared queries, continue to the tutorial for:

> [!div class="nextstepaction"]
> [Manage queries in Azure portal](./tutorials/create-share-query.md)