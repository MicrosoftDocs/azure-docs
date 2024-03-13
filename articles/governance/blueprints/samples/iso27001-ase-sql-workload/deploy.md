---
title: Deploy ISO 27001 ASE/SQL workload blueprint sample
description: Deploy steps of the ISO 27001 App Service Environment/SQL Database workload blueprint sample including blueprint artifact parameter details.
ms.date: 09/07/2023
ms.topic: sample
---
# Deploy the ISO 27001 App Service Environment/SQL Database workload blueprint sample

[!INCLUDE [Blueprints deprecation note](../../../../../includes/blueprints-deprecation-note.md)]

To deploy the Azure Blueprints ISO 27001 App Service Environment/SQL Database workload blueprint
sample, the following steps must be taken:

> [!div class="checklist"]
> - Deploy the [ISO 27001 Shared Services](../iso27001-shared/index.md) blueprint sample
> - Create a new blueprint from the sample
> - Mark your copy of the sample as **Published**
> - Assign your copy of the blueprint to an existing subscription

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free)
before you begin.

## Deploy the ISO 27001 Shared Services blueprint sample

Before this blueprint sample can be deployed, the [ISO 27001 Shared
Services](../iso27001-shared/index.md) blueprint sample must be deployed to the target
subscription. Without a successful deployment of the ISO 27001 Shared Services blueprint sample,
this blueprint sample will be missing infrastructure dependencies and fail during deployment.

> [!IMPORTANT]
> This blueprint sample must be assigned in the same subscription as the [ISO 27001 Shared Services](../iso27001-shared/index.md)
> blueprint sample.

## Create blueprint from sample

First, implement the blueprint sample by creating a new blueprint in your environment using the
sample as a starter.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. From the **Getting started** page on the left, select the **Create** button under _Create a
   blueprint_.

1. Find the **ISO 27001: ASE/SQL Workload** blueprint sample under _Other Samples_ and select **Use
   this sample**.

1. Enter the _Basics_ of the blueprint sample:

   - **Blueprint name**: Provide a name for your copy of the ISO 27001 ASE/SQL workload blueprint
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
blueprint sample can be customized to your environment and needs, but that modification may move it
away from the ISO 27001 standard.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Blueprint definitions** page on the left. Use the filters to find your copy of the
   blueprint sample and then select it.

1. Select **Publish blueprint** at the top of the page. In the new page on the right, provide a
   **Version** for your copy of the blueprint sample. This property is useful for if you make a
   modification later. Provide **Change notes** such as "First version published from the ISO 27001
   blueprint sample." Then select **Publish** at the bottom of the page.

## Assign the sample copy

Once the copy of the blueprint sample has been successfully **Published**, it can be assigned to a
subscription within the management group it was saved to. This step is where parameters are
provided to make each deployment of the copy of the blueprint sample unique.

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
     - **Location**: Select a region for the managed identity to be created in. Azure Blueprints uses
       this managed identity to deploy all artifacts in the assigned blueprint. To learn more, see
       [managed identities for Azure resources](../../../../active-directory/managed-identities-azure-resources/overview.md).
     - **Blueprint definition version**: Pick a **Published** version of your copy of the blueprint
       sample.

   - Lock Assignment

     Select the blueprint lock setting for your environment. For more information, see [blueprints resource locking](../../concepts/resource-locking.md).

   - Managed Identity

     Leave the default _system assigned_ managed identity option.

   - Blueprint parameters

     The parameters defined in this section are used by many of the artifacts in the blueprint
     definition to provide consistency.

     - **Organization name**: Enter a short-name for your organization. This property is primarily
       used for naming resources.
     - **Shared Service Subscription ID**: Subscription ID where the [ISO 27001 Shared Services](../iso27001-shared/index.md)
       blueprint sample is assigned.
     - **Default subnet address prefix**: The CIDR notation for the virtual network default subnet.
       Default value is _10.1.0.0/24_.
     - **Workload location**: Determines what location the artifacts are deployed to. Not all
       services are available in all locations. Artifacts deploying such services provide a
       parameter option for the location to deploy that artifact to.

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
|Log Analytics resource group|Resource group|Name|**Locked** - Concatenates the **Organization name** with `-workload-log-rg` to make the resource group unique.|
|Log Analytics resource group|Resource group|Location|**Locked** - Uses the blueprint parameter.|
|Log Analytics template|Resource Manager template|Service tier|Sets the tier of the Log Analytics workspace. Default value is _PerNode_.|
|Log Analytics template|Resource Manager template|Log retention in days|Data retention in days. Default value is _365_.|
|Log Analytics template|Resource Manager template|Location|Region used for creating the Log Analytics workspace. Default value is _West US 2_.|
|Network resource group|Resource group|Name|**Locked** - Concatenates the **Organization name** with `-workload-net-rg` to make the resource group unique.|
|Network resource group|Resource group|Location|**Locked** - Uses the blueprint parameter.|
|Network Security Group template|Resource Manager template|Log retention in days|Data retention in days. Default value is _365_.|
|Virtual Network and Route Table template|Resource Manager template|Azure firewall private IP|Configures the private IP of the [Azure firewall](../../../../firewall/overview.md). Should be part of the CIDR notation defined in _ISO 27001: Shared Services_ artifact parameter **Azure Firewall subnet address prefix**. Default value is _10.0.4.4_.|
|Virtual Network and Route Table template|Resource Manager template|Virtual Network address prefix|The CIDR notation for the virtual network. Default value is _10.1.0.0/16_.|
|Virtual Network and Route Table template|Resource Manager template|ADDS IP address|IP address of the first ADDS VM. This value is used as custom VNET DNS.|
|Virtual Network and Route Table template|Resource Manager template|Log retention in days|Data retention in days. Default value is _365_.|
|Virtual Network and Route Table template|Resource Manager template|Virtual Network Peering name|Value used to enable VNET peering between a Workload and Shared Services.|
|Key Vault resource group|Resource group|Name|**Locked** - Concatenates the **Organization name** with `-workload-kv-rg` to make the resource group unique.|
|Key Vault resource group|Resource group|Location|**Locked** - Uses the blueprint parameter.|
|Key Vault template|Resource Manager template|AAD object ID|The AAD object identifier of the account that requires access to the Key Vault instance. No default value and can't be left blank. To locate this value from the Azure portal, search for and select "Users" under _Services_. Use the _Name_ box to filter for the account name and select that account. On the _User profile_ page, select the "Click to copy" icon next to the _Object ID_.|
|Key Vault template|Resource Manager template|Log retention in days|Data retention in days. Default value is _365_.|
|Key Vault template|Resource Manager template|Key Vault SKU|Specifies the SKU of the Key Vault that is created. Default value is _Premium_.|
|Key Vault template|Resource Manager template|Azure SQL Server admin username|The username used to access Azure SQL Server. Must match same property value in **Azure SQL Database template**. Default value is _sql-admin-user_.|
|Key Vault template|Resource Manager template|Azure SQL Server admin password|The password for the Azure SQL Server admin username|
|Azure SQL Database resource group|Resource group|Name|**Locked** - Concatenates the **Organization name** with `-workload-azsql-rg` to make the resource group unique.|
|Azure SQL Database resource group|Resource group|Location|**Locked** - Uses the blueprint parameter.|
|Azure SQL Database template|Resource Manager template|Azure SQL Server admin username|Username for the Azure SQL Server. Must match same property value in **Key Vault template**. Default value is _sql-admin-user_.|
|Azure SQL Database template|Resource Manager template|Azure SQL Server admin password (Key vault resource ID)|The Resource ID of the Key Vault. Use "/subscriptions/{subscriptionId}/resourceGroups/{orgName}-workload-kv-rg/providers/Microsoft.KeyVault/vaults/{orgName}-workload-kv" and replace `{subscriptionId}` with your Subscription ID and `{orgName}` with the **Organization name** blueprint parameter.|
|Azure SQL Database template|Resource Manager template|Azure SQL Server admin password (Key vault secret name)|Username of the SQL Server admin. Must match value in **Key Vault template** property **Azure SQL Server admin username**.|
|Azure SQL Database template|Resource Manager template|Azure SQL Server admin password (Key vault secret version)|Key vault secret version (leave empty for new deployments)|
|Azure SQL Database template|Resource Manager template|Log retention in days|Data retention in days. Default value is _365_.|
|Azure SQL Database template|Resource Manager template|AAD admin object ID|AAD object ID of the user that will get assigned as an Active Directory admin. No default value and can't be left blank. To locate this value from the Azure portal, search for and select "Users" under _Services_. Use the _Name_ box to filter for the account name and select that account. On the _User profile_ page, select the "Click to copy" icon next to the _Object ID_.|
|Azure SQL Database template|Resource Manager template|AAD admin login|Currently, Microsoft accounts (such as live.com or outlook.com) can't be set as admin. Only users and security groups within your organization can be set as admin. No default value and can't be left blank. To locate this value from the Azure portal, search for and select "Users" under _Services_. Use the _Name_ box to filter for the account name and select that account. On the _User profile_ page, copy the _User name_.|
|App Service Environment resource group|Resource group|Name|**Locked** - Concatenates the **Organization name** with `-workload-ase-rg` to make the resource group unique.|
|App Service Environment resource group|Resource group|Location|**Locked** - Uses the blueprint parameter.|
|App Service Environment template|Resource Manager template|Domain name|Name of the Active Directory created by the sample. Default value is _contoso.com_.|
|App Service Environment template|Resource Manager template|ASE location|App Service Environment location. Default value is _West US 2_.|
|App Service Environment template|Resource Manager template|Application Gateway log retention in days|Data retention in days. Default value is _365_.|

## Next steps

Now that you've reviewed the steps to deploy the ISO 27001 App Service Environment/SQL Database
workload blueprint sample, visit the following articles to learn about the architecture and
control mapping:

> [!div class="nextstepaction"]
> [ISO 27001 App Service Environment/SQL Database workload blueprint - Overview](./index.md)
> [ISO 27001 App Service Environment/SQL Database workload blueprint - Control mapping](./control-mapping.md)

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).
