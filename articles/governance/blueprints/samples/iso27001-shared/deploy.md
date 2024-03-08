---
title: Deploy ISO 27001 Shared Services blueprint sample
description: Deploy steps for the ISO 27001 Shared Services blueprint sample including blueprint artifact parameter details.
ms.date: 09/07/2023
ms.topic: sample
---
# Deploy the ISO 27001 Shared Services blueprint sample

[!INCLUDE [Blueprints deprecation note](../../../../../includes/blueprints-deprecation-note.md)]

To deploy the Azure Blueprints ISO 27001 Shared Services blueprint sample, the following steps must
be taken:

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

1. Find the **ISO 27001: Shared Services** blueprint sample under _Other Samples_ and select **Use
   this sample**.

1. Enter the _Basics_ of the blueprint sample:

   - **Blueprint name**: Provide a name for your copy of the ISO 27001 Shared Services blueprint
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
it away from the ISO 27001 standard.

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
     - **Shared services subnet address prefix**: Provide the CIDR notation value for networking the
       deployed resources together.
     - **Shared services location**: Determines what location the artifacts are deployed to. Not all
       services are available in all locations. Artifacts deploying such services provide a
       parameter option for the location to deploy that artifact to.
     - **Allowed location (Policy: Blueprint initiative for ISO 27001)**: Value that indicates the
       allowed locations for resource groups and resources.
     - **Log Analytics workspace for VM agents (Policy: Blueprint initiative for ISO 27001)**:
       Specifies the Resource ID of a workspace. This parameter uses a `concat` function to
       construct the Resource ID.

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
|\[Preview\]: Deploy Log Analytics Agent for Linux VM Scale Sets (VMSS)|Policy assignment|Optional: List of VM images that have supported Linux OS to add to scope|(Optional) Default value is _["none"]_.|
|\[Preview\]: Deploy Log Analytics Agent for Linux VMs|Policy assignment|Optional: List of VM images that have supported Linux OS to add to scope|(Optional) Default value is _["none"]_.|
|\[Preview\]: Deploy Log Analytics Agent for Windows VM Scale Sets (VMSS)|Policy assignment|Optional: List of VM images that have supported Windows OS to add to scope|(Optional) Default value is _["none"]_.|
|\[Preview\]: Deploy Log Analytics Agent for Windows VMs|Policy assignment|Optional: List of VM images that have supported Windows OS to add to scope|(Optional) Default value is _["none"]_.|
|Allowed resource types|Policy assignment|Allowed resource types|List of resource types allowed to be deployed. This list is composed of all the resource types deployed in Shared Services.|
|Allowed storage account SKUs|Policy assignment|Allowed storage SKUs|List of diagnostic logs storage account SKUs allowed. Default value is _["Standard_LRS"]_.|
|Allowed virtual machine SKUs|Policy assignment|List of virtual machine SKUs allowed to be deployed. Default value is _["Standard_DS1_v2", "Standard_DS2_v2"]_.|
|Blueprint initiative for ISO 27001|Policy assignment|Resource types to audit diagnostic logs|List of resource types to audit if diagnostic log setting is not enabled. Acceptable values can be found at [Azure Monitor diagnostic logs schemas](../../../../azure-monitor/essentials/resource-logs-schema.md#service-specific-schemas).|
|Log Analytics resource group|Resource group|Name|**Locked** - Concatenates the **Organization name** with `-sharedsvsc-log-rg` to make the resource group unique.|
|Log Analytics resource group|Resource group|Location|**Locked** - Uses the blueprint parameter.|
|Log Analytics template|Resource Manager template|Service tier|Sets the tier of the Log Analytics workspace. Default value is _PerNode_.|
|Log Analytics template|Resource Manager template|Log retention in days|Data retention in days. Default value is _365_.|
|Log Analytics template|Resource Manager template|Location|Region used for creating the Log Analytics workspace. Default value is _West US 2_.|
|Network resource group|Resource group|Name|**Locked** - Concatenates the **Organization name** with `-sharedsvcs-net-rg` to make the resource group unique.|
|Network resource group|Resource group|Location|**Locked** - Uses the blueprint parameter.|
|Azure Firewall template|Resource Manager template|Azure firewall private IP|Configures the private IP of the [Azure firewall](../../../../firewall/overview.md). This value is also used as default route table on shared services subnet. Should be part of the CIDR notation defined in **Azure Firewall subnet address prefix**. Default value is _10.0.4.4_.|
|Azure Firewall template|Resource Manager template|Log retention in days|Data retention in days. Default value is _365_.|
|Network Security Group template|Resource Manager template|Log retention in days|Data retention in days. Default value is _365_.|
|Virtual Network and Route Table template|Resource Manager template|Virtual Network address prefix|The CIDR notation for the virtual network. Default value is _10.0.0.0/16_.|
|Virtual Network and Route Table template|Resource Manager template|Enable Virtual Network DDoS protection|Configures DDoS protection for the virtual network. Default value is _true_.|
|Virtual Network and Route Table template|Resource Manager template|Shared Services subnet address prefix|The CIDR notation for the Shared Services subnet. Default value is _10.0.0.0/24_.|
|Virtual Network and Route Table template|Resource Manager template|DMZ subnet address prefix|The CIDR notation for the DMZ subnet. Default value is _10.0.1.0/24_.|
|Virtual Network and Route Table template|Resource Manager template|Application Gateway subnet address prefix|The CIDR notation for the application gateway subnet. Default value is _10.0.2.0/24_.|
|Virtual Network and Route Table template|Resource Manager template|Virtual Network Gateway subnet address prefix|The CIDR notation for the virtual network gateway subnet. Default value is _10.0.3.0/24_.|
|Virtual Network and Route Table template|Resource Manager template|Azure Firewall subnet address prefix|The CIDR notation for the [Azure firewall](../../../../firewall/overview.md) subnet. Should include the **Azure firewall private IP** parameter.|
|Key Vault resource group|Resource group|Name|**Locked** - Concatenates the **Organization name** with `-sharedsvcs-kv-rg` to make the resource group unique.|
|Key Vault resource group|Resource group|Location|**Locked** - Uses the blueprint parameter.|
|Key Vault template|Resource Manager template|Jumpbox admin username|Username for the jumpbox. Must match same property value in **Jumpbox template**. Default value is _jb-admin-user_.|
|Key Vault template|Resource Manager template|Jumpbox admin ssh key or password|Key or password for the account on the jumpbox. Must match same property value in **Jumpbox template**. No default value and can't be left blank.|
|Key Vault template|Resource Manager template|Domain admin username|Username used to access Active Directory VM and to join other VMs to a domain. Must match **Domain admin user** property value in **Active Directory Domain Services template**. Default value is _domain-admin-user_.|
|Key Vault template|Resource Manager template|Domain admin password|Domain admin user's password. No default value and can't be left blank.|
|Key Vault template|Resource Manager template|AAD object ID|The AAD object identifier of the account that requires access to the Key Vault instance. No default value and can't be left blank. To locate this value from the Azure portal, search for and select "Users" under _Services_. Use the _Name_ box to filter for the account name and select that account. On the _User profile_ page, select the "Click to copy" icon next to the _Object ID_.  |
|Key Vault template|Resource Manager template|Log retention in days|Data retention in days. Default value is _365_.|
|Key Vault template|Resource Manager template|Key Vault SKU|Specifies the SKU of the Key Vault that is created. Default value is _Premium_.|
|Jumpbox resource group|Resource group|Name|**Locked** - Concatenates the **Organization name** with `-sharedsvcs-jb-rg` to make the resource group unique.|
|Jumpbox resource group|Resource group|Location|**Locked** - Uses the blueprint parameter.|
|Jumpbox template|Resource Manager template|Jumpbox admin username|The username used to access jumpbox VMs. Must match same property value in **Key Vault template**. Default value is _jb-admin-user_.|
|Jumpbox template|Resource Manager template|Jumpbox admin password (Key Vault Resource ID)|The Resource ID of the Key Vault. Use "/subscriptions/{subscriptionId}/resourceGroups/{orgName}-sharedsvcs-kv-rg/providers/Microsoft.KeyVault/vaults/{orgName}-sharedsvcs-kv" and replace `{subscriptionId}` with your Subscription ID and `{orgName}` with the **Organization name** blueprint parameter.|
|Jumpbox template|Resource Manager template|Jumpbox admin password (Key Vault Secret Name)|Username of the jumpbox admin. Must match value in **Key Vault template** property **Jumpbox admin username**.|
|Jumpbox template|Resource Manager template|Jumpbox Operating System|Determines the operating system of the jumpbox VM. Default value is _Windows_.|
|Active Directory Domain Services resource group|Resource group|Name|**Locked** - Concatenates the **Organization name** with `-sharedsvcs-adds-rg` to make the resource group unique.|
|Active Directory Domain Services resource group|Resource group|Location|**Locked** - Uses the blueprint parameter.|
|Active Directory Domain Services template|Resource Manager template|Domain admin username|Username for the ADDS jumpbox. Must match same property value in **Key Vault template**. Default value is _adds-admin-user_.|
|Active Directory Domain Services template|Resource Manager template|Domain admin password (Key Vault Resource ID)|The Resource ID of the Key Vault. Use "/subscriptions/{subscriptionId}/resourceGroups/{orgName}-sharedsvcs-kv-rg/providers/Microsoft.KeyVault/vaults/{orgName}-sharedsvcs-kv" and replace `{subscriptionId}` with your Subscription ID and `{orgName}` with the **Organization name** blueprint parameter.|
|Active Directory Domain Services template|Resource Manager template|Domain admin password (Key Vault Secret Name)|Username of the domain admin. Must match value in **Key Vault template** property **Domain admin username**.|
|Active Directory Domain Services template|Resource Manager template|Domain name|Name of the Active Directory created by the sample. Default value is _contoso.com_.|
|Active Directory Domain Services template|Resource Manager template|Domain admin user|Username for the admin AD account and for joining devices to the AD domain. Must match **AD admin username** property value in **Key Vault template**. Default value is _domain-admin-user_.|
|Active Directory Domain Services template|Resource Manager template|Domain admin password|Set the Key Vault details for storing the password. No default value and can't be left blank.|

## Next steps

Now that you've reviewed the steps to deploy the ISO 27001 Shared Services blueprint sample, visit
the following articles to learn about the architecture and control mapping:

> [!div class="nextstepaction"]
> [ISO 27001 Shared Services blueprint - Overview](./index.md)
> [ISO 27001 Shared Services blueprint - Control mapping](./control-mapping.md)

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).
