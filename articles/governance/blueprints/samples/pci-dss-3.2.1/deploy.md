---
title: Sample - PCI-DSS v3.2.1 blueprint - Deploy steps
description: Deploy steps of the Payment Card Industry Data Security Standard v3.2.1 blueprint sample.
services: blueprints
author: DCtheGeek
ms.author: dacoulte
ms.date: 06/24/2019
ms.topic: conceptual
ms.service: blueprints
manager: carmonm
---
# Deploy the PCI-DSS v3.2.1 blueprint sample

To deploy the Azure Blueprints PCI-DSS v3.2.1 blueprint sample, the following steps must be taken:

> [!div class="checklist"]
> - Create a new blueprint from the sample
> - Mark your copy of the sample as **Published**
> - Assign your copy of the blueprint to an existing subscription

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free)
before you begin.

## Create blueprint from sample

First, implement the blueprint sample by creating a new blueprint in your environment using the
sample as a starter.

1. Select **All services** and search for and select **Policy** in the left pane. On the **Policy**
   page, select **Blueprints**.

1. From the **Getting started** page on the left, select the **Create** button under _Create a
   blueprint_.

1. Find the **PCI-DSS v3.2.1** blueprint sample under _Other Samples_ and select **Use
   this sample**.

1. Enter the _Basics_ of the blueprint sample:

   - **Blueprint name**: Provide a name for your copy of the PCI-DSS v3.2.1 blueprint
     sample.
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
blueprint sample can be customized to your environment and needs, but that modification may move
it away from the PCI-DSS v3.2.1 standard.

1. Select **All services** and search for and select **Policy** in the left pane. On the **Policy**
   page, select **Blueprints**.

1. Select the **Blueprint definitions** page on the left. Use the filters to find your copy of the
   blueprint sample and then select it.

1. Select **Publish blueprint** at the top of the page. In the new page on the right, provide a
   **Version** for your copy of the blueprint sample. This property is useful for if you make a
   modification later. Provide **Change notes** such as "First version published from the PCI-DSS
   v3.2.1 blueprint sample." Then select **Publish** at the bottom of the page.

## Assign the sample copy

Once the copy of the blueprint sample has been successfully **Published**, it can be assigned to a
subscription within the management group it was saved to. This step is where parameters are
provided to make each deployment of the copy of the blueprint sample unique.

1. Select **All services** and search for and select **Policy** in the left pane. On the **Policy**
   page, select **Blueprints**.

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
     - **Location**: Select a region for the managed identity to be created in. Azure Blueprint uses
       this managed identity to deploy all artifacts in the assigned blueprint. To learn more, see
       [managed identities for Azure resources](../../../../active-directory/managed-identities-azure-resources/overview.md).
     - **Blueprint definition version**: Pick a **Published** version of your copy of the blueprint
       sample.

   - Lock Assignment

     Select the blueprint lock setting for your environment. For more information, see [blueprints resource locking](../../concepts/resource-locking.md).

   - Managed Identity

     Leave the default _system assigned_ managed identity option.

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
> resources are [priced by product](https://azure.microsoft.com/pricing/). Use the [pricing calculator](https://azure.microsoft.com/pricing/calculator/)
> to estimate the cost of running resources deployed by this blueprint sample.

## Artifact parameters table

The following table provides a list of the blueprint artifact parameters:

|Artifact name|Artifact type|Parameter name|Description|
|-|-|-|-|
|[Preview]: Audit PCI v3.2.1:2018 controls and deploy specific VM Extensions to support audit requirements|Policy Assignment|List of Resource Types | Audit diagnostic setting for selected resource types. Default value is all resources are selected| 
|Allowed locations|Policy Assignment|List Of Allowed Locations|List of data center locations allowed for any resource to be deployed into. This list is customizable to the desired Azure locations globally. Select locations you wish to allow.| 
|Allowed Locations for resource groups|Policy Assignment |Allowed Location |This policy enables you to restrict the locations your organization can create resource groups in. Use to enforce your geo-compliance requirements.| 
|Deploy Auditing on SQL servers|Policy Assignment|Retention days|Data rentention in number of days. Default value is 180 but PCI requires 365.| 
|Deploy Auditing on SQL servers|Policy Assignment|Resource group name for storage account|Auditing writes database events to an audit log in your Azure Storage account (a storage account will be created in each region where a SQL Server is created that will be shared by all servers in that region).| 

## Next steps

Now that you've reviewed the steps to deploy the PCI-DSS v3.2.1 blueprint sample, visit the
following articles to learn about the overview and control mapping:

> [!div class="nextstepaction"]
> [PCI-DSS v3.2.1 blueprint - Overview](./index.md)
> [PCI-DSS v3.2.1 blueprint - Control mapping](./control-mapping.md)

Addition articles about blueprints and how to use them:

- Learn about the [blueprint life-cycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).
