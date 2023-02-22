---
title: "Tutorial: Automate Running Your Resource Graph Queries within Logic Apps"
description: In this tutorial, you will learn how to call Resource Graph in a Logic App
ms.date: 11/18/2021
ms.topic: tutorial
---
# Tutorial: Run Azure Resource Graph Queries in an Azure Logic App

Azure Resource Graph Explorer lets you query your resources at scale, across your subscriptions, management groups, and your entire tenant.

If you need to query your resources periodically to check for specific resource or management properties and act on the results, you can utilize Azure Logic Apps.

In this tutorial, you will learn how to:

> [!div class="checklist"]
> - Write an Azure Resource Graph query that you plan to run periodically
> - Create an Azure Logic App with a System Assigned Managed Identity
> - Setup a Managed Identity to access specific resources, resource groups, and subscriptions
> - Automate your Azure Resource Graph query execution by calling your Logic App periodically

## Prerequisites

To complete this tutorial, you need an Azure subscription. If you don't have one, create a
[free account](https://azure.microsoft.com/free/) before you begin.

## Write an Azure Resource Graph query

If you have an Azure Resource Graph query that you want to run periodically, you may use that. In this tutorial, we're using the following query to retrieve the power state summary of your Virtual Machines.

   ```kusto
   Resources
   | where type =~ 'microsoft.compute/virtualmachines'
   | extend vmPowerState = tostring(properties.extended.instanceView.powerState.code)
   | summarize count() by vmPowerState
   ```

   For more details, see
   [Samples – Summarize virtual machine by power state](../samples/advanced.md#vm-powerstate).

Keep the query above handy as we will need it later when we configure our Logic App.

## Create a Logic App

1. From the portal menu, select **Logic Apps**, or use the Azure search box at the top of all
   pages to search for and select **Logic Apps**.

2. Click the **Add** button on upper left of your screen and continue with creating your Logic App.

3. When creating the Logic App, ensure you choose **Consumption** under **Plan Type**.

## Setup a Managed Identity

### Create a New System-Assigned Managed Identity

Within the Azure Portal, navigate to the Logic App you created. Select **Identity** on the left hand side of the page. Then, select the system-assigned identity button, set the status to **On**, and click **Save**.

### Add Role Assignments to your Managed Identity

To give the newly created Managed Identity ability to query across your subscriptions, resource groups, and resources so your queries - you need to assign access via Role Assignments. For details on how to assign Role Assignments for Managed Identities, reference: [Assign Azure roles to a managed identity](../../../role-based-access-control/role-assignments-portal-managed-identity.md)

## Configure and Run Your Logic App

In the code view of your Logic App within Azure Portal, paste:

```json
{
    "definition": {
        "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
        "actions": {
            "HTTP_2": {
                "inputs": {
                    "authentication": {
                        "type": "ManagedServiceIdentity"
                    },
                    "body": {
                        "query": "Resources | where type =~ 'microsoft.compute/virtualmachines' | extend vmPowerState = tostring(properties.extended.instanceView.powerState.code) | summarize count() by vmPowerState"
                    },
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "method": "POST",
                    "queries": {
                        "api-version": "2021-03-01"
                    },
                    "uri": "https://management.azure.com/providers/Microsoft.ResourceGraph/resources"
                },
                "runAfter": {},
                "type": "Http"
            }
        },
        "contentVersion": "1.0.0.0",
        "outputs": {},
        "parameters": {},
        "triggers": {
            "Recurrence": {
                "recurrence": {
                    "frequency": "Minute",
                    "interval": 1440
                },
                "type": "Recurrence"
            }
        }
    },
    "parameters": {}
}
```

Then, go into the designer view of your Logic App within Azure Portal and modify your set up as you see fit.

Finally, save your Logic App and run it.

## Next steps

In this tutorial, we've created an Azure Logic App that automates your ARG query requests at a set interval. To learn more about the Resource graph
language, continue to the query language details page linked below and try out more Azure Resource Graph queries.

If you have questions, please contact resourcegraphsupport@microsoft.com

> [!div class="nextstepaction"]
> [Get more information about the query language](../concepts/query-language.md)
