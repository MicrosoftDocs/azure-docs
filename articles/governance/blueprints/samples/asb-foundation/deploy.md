---
title: Deploy Azure Security Benchmark Foundation blueprint sample
description: Deploy steps for the Azure Security Benchmark Foundation blueprint sample including blueprint artifact parameter details.
ms.date: 01/13/2020
ms.topic: sample
---
# Deploy the Azure Security Benchmark Foundation blueprint sample

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

1. Find the **Azure Security Benchmark Foundation** blueprint sample under _Other Samples_ and select **Use this
   sample**.

1. Enter the _Basics_ of the blueprint sample:

   - **Blueprint name**: Provide a name for your copy of the Azure Security Benchmark Foundation blueprint sample.
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
     - Azure Blueprint uses this managed identity to deploy all artifacts in the assigned blueprint.
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
     definition to provide consistency.These
     parameters are [dynamic parameters](../../concepts/parameters.md#dynamic-parameters) since
     they're defined during the assignment of the blueprint. For a full list or artifact parameters
     and their descriptions, see [Blueprint parameters table](#blueprint-parameters-table).

     - **Organization**: Enter your organization name, such as Contoso, must be unique.
     - **Azure Region**: Select the Azure Region for Deployment.
     - **Allowed locations**: Which Azure Regions will you allow resources to be built in?
     
   - Artifact parameters

     There are no artifact parameters for this blueprint sample.

1. Once all parameters have been entered, select **Assign** at the bottom of the page. The blueprint
   assignment is created and artifact deployment begins. Deployment takes roughly an hour. To check
   on the status of deployment, open the blueprint assignment.

> [!WARNING]
> The Azure Blueprints service and the built-in blueprint samples are **free of cost**. Azure
> resources are [priced by product](https://azure.microsoft.com/pricing/). Use the [pricing calculator](https://azure.microsoft.com/pricing/calculator/)
> to estimate the cost of running resources deployed by this blueprint sample.

## Blueprint parameters table

The following table provides a list of the blueprint parameters:

|-|-|
|Parameter name|Description|
|Resource Group and Resource name prefix|Resource Group and Resource identifier. String to be used as prefix to all Resource Group and Resource names|
|Hub name|Name of the Hub|
|Hub Location|Hub Resource Group Location|
|Hub Subscription Id|Hub Subscription Id|
|Deploy Hub|Deploy Hub|
|Deploy Spoke|Deploy Spoke|
|Spoke name|Name of the Spoke|
|Azure Log Analytics Workspace Service tier|Azure Log Analytics Workspace Service tier: Free, Standalone, PerNode or PerGB2018|
|Log retention in days|Specifies the number of days that logs will be kept for; a value of 0 will retain data indefinitely|
|Log Analytics Workspace location|Location where Log Analytics workspace to be created. Run `Get-AzLocation | Where-Object Providers -like 'Microsoft.OperationalInsights' | Select DisplayName` in Azure PowersShell to find available regions|
|Azure Automation account id|Optional. Automation Account resource identifier, value used to create a LinkedService between Log Analytics and an Automation Account|
|Network Watcher name|Name of the Network Watcher resource|
|Network Watcher location|Location of the Network Watcher resource|
|Network Watcher Resource Group name|Name of the Network Watcher Resource Group|
|Network Watcher Resource Group location|Location of the Network Watcher Resource Group|
|Enable NSG Flow Logs|Enable NSG Flow Logs|
|Destination IP Addresses|Destination IP addresses for outbound connectivity|
|Virtual Network address prefix|Virtual Network address prefix|
|Azure Firewall subnet address prefix|Azure Firewall subnet address prefix|
|Bastion subnet address prefix|Bastion subnet address prefix|
|Gateway subnet address prefix|Gateway subnet address prefix|
|Management subnet address prefix|Management subnet address prefix|
|JumpBox subnet address prefix|JumpBox subnet address prefix|
|Optional subnet address names|Optional. An Array of subnet names to deploy to the Virtual Network. e.g "subnet1","subnet2"|
|Optional subnet address prefixes|Optional. An Array of IP Address Prefixes for subnets. e.g "10.0.7.0/24","10.0.8.0/24"|
|Enable Virtual Network DDoS protection|Determines whether or not DDoS Protection is enabled in the Virtual Network|
|Azure Firewall private IP|Azure Firewall private IP|
|Virtual Network address prefix|Virtual Network address prefix|
|Subnet address prefix|Subnet address prefix|
|Optional subnet address names|Optional. An Array of subnet names to deploy to the Virtual Network. e.g "subnet1","subnet2"|
|Optional subnet address prefixes|Optional. An Array of IP Address Prefixes for subnets. e.g "10.0.7.0/24","10.0.8.0/24"|

## Next steps

Now that you've reviewed the steps to deploy the Azure Security Benchmark Foundation blueprint sample, visit the
following article to learn about the architecture:

> [!div class="nextstepaction"]
> [Azure Security Benchmark Foundation blueprint - Overview](./index.md)

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).
