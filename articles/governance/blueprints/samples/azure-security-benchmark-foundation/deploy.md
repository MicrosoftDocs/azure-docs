---
title: Deploy Azure Security Benchmark Foundation blueprint sample
description: Deploy steps for the Azure Security Benchmark Foundation blueprint sample including blueprint artifact parameter details.
ms.date: 09/07/2023
ms.topic: sample
---
# Deploy the Azure Security Benchmark Foundation blueprint sample

[!INCLUDE [Blueprints deprecation note](../../../../../includes/blueprints-deprecation-note.md)]

To deploy the Azure Security Benchmark Foundation blueprint sample, the following steps must be
taken:

> [!div class="checklist"]
> - Create a new blueprint from the sample
> - Mark your copy of the sample as **Published**
> - Assign your copy of the blueprint to an existing subscription

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free)
before you begin.

## Create blueprint from sample

First, implement the blueprint sample by creating a new blueprint in your environment using the
sample as a starter.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. From the **Getting started** page on the left, select the **Create** button under _Create a
   blueprint_.

1. Find the **Azure Security Benchmark Foundation** blueprint sample under _Other Samples_ and
   select **Use this sample**.

1. Enter the _Basics_ of the blueprint sample:

   - **Blueprint name**: Provide a name for your copy of the Azure Security Benchmark Foundation
     blueprint sample.
   - **Definition location**: Use the ellipsis and select the management group to save your copy of
     the sample to.

1. Select the _Artifacts_ tab at the top of the page or **Next: Artifacts** at the bottom of the
   page.

1. Review the list of artifacts that make up the blueprint sample. Many of the artifacts have
   parameters that we'll define later. Select **Save Draft** when you've finished reviewing the
   blueprint sample.

## Publish the sample copy

Your copy of the blueprint sample has now been created in your environment. It's created in
**Draft** mode and must be **Published** before it can be assigned and deployed. The copy of the
blueprint sample can be customized to your environment and needs, but that modification may move it
away from the Azure Security Benchmark Foundation blueprint.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Blueprint definitions** page on the left. Use the filters to find your copy of the
   blueprint sample and then select it.

1. Select **Publish blueprint** at the top of the page. In the new page on the right, provide a
   **Version** for your copy of the blueprint sample. This property is useful for if you make a
   modification later. Provide **Change notes** such as "First version published from the Azure
   Security Benchmark Foundation blueprint sample." Then select **Publish** at the bottom of the
   page.

## Assign the sample copy

Once the copy of the blueprint sample has been successfully **Published**, it can be assigned to a
subscription within the management group it was saved to. This step is where parameters are provided
to make each deployment of the copy of the blueprint sample unique.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Blueprint definitions** page on the left. Use the filters to find your copy of the
   blueprint sample and then select it.

1. Select **Assign blueprint** at the top of the blueprint definition page.

1. Provide the parameter values for the blueprint assignment:

   - Basics
       - **Subscriptions**: Select one or more of the subscriptions that are in the management group
       you saved your copy of the blueprint sample to. If you select more than one subscription, an
       assignment will be created for each using the parameters entered.
     - **Assignment name**: The name is pre-populated for you based on the name of the blueprint.
       Change as needed or leave as is.
     - **Location**: Select a region for the managed identity to be created in.
     - Azure Blueprints uses this managed identity to deploy all artifacts in the assigned blueprint.
       To learn more, see
       [managed identities for Azure resources](../../../../active-directory/managed-identities-azure-resources/overview.md).
     - **Blueprint definition version**: Pick a **Published** version of your copy of the blueprint
       sample.

   - Lock Assignment

     Select the blueprint lock setting for your environment. For more information, see
     [blueprints resource locking](../../concepts/resource-locking.md).

   - Managed Identity

     Choose either the default _system assigned_ managed identity option or the _user assigned_
     identity option.

   - Blueprint parameters

     The parameters defined in this section are used by many of the artifacts in the blueprint
     definition to provide consistency.

     - **Prefix for resources and resource groups**: This string is used as a prefix for all
       resource and resource group names
     - **Hub name**: Name for the hub
     - **Log retention (days)**: Number of days that logs are retained; entering '0' retains logs
       indefinitely
     - **Deploy hub**: Enter 'true' or 'false' to specify whether the assignment deploys the hub
       components of the architecture
     - **Hub location**: Location for the hub resource group
     - **Destination IP addresses**: Destination IP addresses for outbound connectivity;
       comma-separated list of IP addresses or IP range prefixes
     - **Network Watcher name**: Name for the Network Watcher resource
     - **Network Watcher resource group name**: Name for the Network Watcher resource group
     - **Enable DDoS protection**: Enter 'true' or 'false' to specify whether or not DDoS Protection
       is enabled in the virtual network

     > [!NOTE]
     > If Network Watcher is already enabled, it's recommended that you use the existing Network
     > Watcher resource group. You must also provide the location for the existing Network Watcher
     > resource group for the artifact parameter **Network Watcher resource group location**.

   - Artifact parameters

     The parameters defined in this section apply to the artifact under which it's defined. These
     parameters are [dynamic parameters](../../concepts/parameters.md#dynamic-parameters) since
     they're defined during the assignment of the blueprint. For a full list or artifact parameters
     and their descriptions, see [Artifact parameters table](#artifact-parameters-table).

1. Once all parameters have been entered, select **Assign** at the bottom of the page. The blueprint
   assignment is created and artifact deployment begins. Deployment takes roughly an hour. To check
   on the status of deployment, open the blueprint assignment.

> [!WARNING]
> The Azure Blueprints service and the built-in blueprint samples are **free of cost**. Azure
> resources are [priced by product](https://azure.microsoft.com/pricing/). Use the
> [pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate the cost of
> running resources deployed by this blueprint sample.

## Artifact parameters table

The following table provides a list of the blueprint parameters:

|Artifact name|Artifact type|Parameter name|Description|
|-|-|-|-|
|Hub resource group|Resource group|Resource group name|Locked - Concatenates prefix with hub name|
|Hub resource group|Resource group|Resource group location|Locked - Uses hub location|
|Azure Firewall template|Resource Manager template|Azure Firewall private IP address||
|Azure Log Analytics and Diagnostics template|Resource Manager template|Log Analytics workspace location|Location where Log Analytics workspace is created; run `Get-AzLocation | Where-Object Providers -like 'Microsoft.OperationalInsights' | Select DisplayName` in Azure PowersShell to see available regions|
|Azure Log Analytics and Diagnostics template|Resource Manager template|Azure Automation account ID (optional) |Automation account resource ID; used to create a linked service between Log Analytics and an Automation account|
|Azure Network Security Group template|Resource Manager template|Enable NSG flow logs|Enter 'true' or 'false' to enable or disable NSG flow logs|
|Azure Virtual Network hub template|Resource Manager template|Virtual network address prefix|Virtual network address prefix for hub virtual network|
|Azure Virtual Network hub template|Resource Manager template|Firewall subnet address prefix|Firewall subnet address prefix for hub virtual network|
|Azure Virtual Network hub template|Resource Manager template|Bastion subnet address prefix|Bastion subnet address prefix for hub virtual network|
|Azure Virtual Network hub template|Resource Manager template|Gateway subnet address prefix|Gateway subnet address prefix for hub virtual network|
|Azure Virtual Network hub template|Resource Manager template|Management subnet address prefix|Management subnet address prefix for hub virtual network|
|Azure Virtual Network hub template|Resource Manager template|Jump box subnet address prefix|Jump box subnet address prefix for hub virtual network|
|Azure Virtual Network hub template|Resource Manager template|Subnet address names (optional)|Array of subnet names to deploy to the hub virtual network; for example, "subnet1","subnet2"|
|Azure Virtual Network hub template|Resource Manager template|Subnet address prefixes (optional)|Array of IP address prefixes for optional subnets for hub virtual network; for example, "10.0.7.0/24","10.0.8.0/24"|
|Spoke resource group|Resource group|Resource group name|Locked - Concatenates prefix with spoke name|
|Spoke resource group|Resource group|Resource group location|Locked - Uses hub location|
|Azure Virtual Network spoke template|Resource Manager template|Deploy spoke|Enter 'true' or 'false' to specify whether the assignment deploys the spoke components of the architecture|
|Azure Virtual Network spoke template|Resource Manager template|Hub subscription ID|Subscription ID where hub is deployed; default value is the subscription where the blueprint definition is located|
|Azure Virtual Network spoke template|Resource Manager template|Spoke name|Name of the spoke|
|Azure Virtual Network spoke template|Resource Manager template|Virtual Network address prefix|Virtual Network address prefix for spoke virtual network|
|Azure Virtual Network spoke template|Resource Manager template|Subnet address prefix|Subnet address prefix for spoke virtual network|
|Azure Virtual Network spoke template|Resource Manager template|Subnet address names (optional)|Array of subnet names to deploy to the spoke virtual network; for example, "subnet1","subnet2"|
|Azure Virtual Network spoke template|Resource Manager template|Subnet address prefixes (optional)|Array of IP address prefixes for optional subnets for the spoke virtual network; for example, "10.0.7.0/24","10.0.8.0/24"|
|Azure Virtual Network spoke template|Resource Manager template|Deploy spoke|Enter 'true' or 'false' to specify whether the assignment deploys the spoke components of the architecture|
|Azure Network Watcher template|Resource Manager template|Network Watcher location|Location for the Network Watcher resource|
|Azure Network Watcher template|Resource Manager template|Network Watcher resource group location|If Network Watcher is already enabled, this parameter value **must** match the location of the existing Network Watcher resource group.|

## Troubleshooting

If you encounter the error `The resource group 'NetworkWatcherRG' failed to deploy due to the
following error: Invalid resource group location '{location}'. The Resource group already exists in
location '{location}'.`, check that the blueprint parameter **Network Watcher resource group name**
specifies the existing Network Watcher resource group name and that the artifact parameter **Network
Watcher resource group location** specifies the existing Network Watcher resource group location.

## Next steps

Now that you've reviewed the steps to deploy the Azure Security Benchmark Foundation blueprint
sample, visit the following article to learn about the architecture:

> [!div class="nextstepaction"]
> [Azure Security Benchmark Foundation blueprint - Overview](./index.md)

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).
