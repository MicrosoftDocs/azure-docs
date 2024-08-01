---
title: Relocation guidance for Azure Firewall
description: Learn how to relocate Azure Firewall to a new region
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 07/23/2024
ms.service: firewall
ms.topic: how-to
ms.custom:
  - subject-relocation
---


# Relocate Azure Firewall to another region

This article shows you how to relocate an Azure Firewall that protects an Azure Virtual Network.


## Prerequisites

- We highly recommend that you use Premium SKU. If you are on Standard SKU, consider [migrating from an existing Standard SKU Azure Firewall to Premium SKU](/azure/firewall-manager/migrate-to-policy) before you being relocation.

- The following information must be collected in order to properly plan and execute an Azure Firewall relocation:

    - **Deployment model.** *Classic Firewall Rules* or *Firewall policy*.
    - **Firewall policy name.** (If *Firewall policy* deployment model is used).
    - **Diagnostic setting at the firewall instance level.** (If Log Analytics workspace is used).
    - **TLS (Transport Layer Security) Inspection configuration.**: (If Azure Key Vault, Certificate and Managed Identity is used.)
    - **Public IP control.** Assess that any external identity relying on Azure Firewall public IP remains fixed and trusted.


- Azure Firewall Standard and Premium tiers have the following dependencies that you may need to be deploy in the target region:

    - [Azure Virtual Network](./relocation-virtual-network.md)
    - (If used) [Log Analytics Workspace](./relocation-log-analytics.md)
  

- If you're using the TLS Inspection feature of Azure Firewall Premium tier, the following dependencies also need to be deployed in the target region:

    - [Azure Key Vault](./relocation-key-vault.md)
    - [Azure Managed Identity](./relocation-managed-identity.md)


## Downtime

To understand the possible downtimes involved, see [Cloud Adoption Framework for Azure: Select a relocation method](/azure/cloud-adoption-framework/relocate/select#select-a-relocation-method).
  

## Prepare

To prepare for relocation, you need to first export and modify the template from the source region. To view a sample ARM template for Azure Firewall, see [review the template](../firewall-manager/quick-firewall-policy.md#review-the-template).

### Export template


# [portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All resources** and then select your Azure Firewall resource.
3. On the **Azure Firewall** page, select **Export template** under **Automation** in the left menu. 
4. Choose **Download** in the **Export template** page.

5. Locate the .zip file that you downloaded from the portal, and unzip that file to a folder of your choice.

   This zip file contains the .json files that include the template and scripts to deploy the template.


# [PowerShell](#tab/azure-powershell)

1. Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions:

```azurecli

Connect-AzAccount
```

2. If your identity is associated with more than one subscription, then set your active subscription to subscription of the Azure Firewall resource that you want to move.

```azurepowershell

$context = Get-AzSubscription -SubscriptionId <subscription-id>
Set-AzContext $context

```

3. Export the template of your source Azure Firewall resource by running the following commands:

```azurepowershell

$resource = Get-AzResource `
  -ResourceGroupName <resource-group-name> `
  -ResourceName <resource-name> `
  -ResourceType <resource-type>

Export-AzResourceGroup `
  -ResourceGroupName <resource-group-name> `
  -Resource $resource.ResourceId

```

4. Locate the `template.json` in your current directory.


---

### Modify template

In this section, you learn how to modify the template that you generated in the previous section. 

If you're running classic firewall rules without Firewall policy, migrate to Firewall policy before proceeding with the steps in this section. To learn how to migrate from classic firewall rules to Firewall policy, see [Migrate Azure Firewall configuration to Azure Firewall policy using PowerShell](/azure/firewall-manager/migrate-to-policy).


# [Azure portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. If you're using Premium SKU with TLS Inspection enabled,
    1. [Relocate the key vault](./relocation-key-vault.md) that's used for TLS inspection into the new target region.  Then, follow [the procedures](../application-gateway/key-vault-certs.md) to move certificates or generate new certificates for TLS inspection into the new key vault in the target region.
    1. [Relocate managed identity](./relocation-managed-identity.md) into the new target region. Reassign the corresponding roles for the key vault in the target region and subscription.

1. In the Azure portal, select **Create a resource**.

1. In **Search the Marketplace**, type `template deployment`, and then press **Enter**.

1. Select **Template deployment** and the select **Create**.

1. Select **Build your own template in the editor**.

1. Select **Load file**, and then follow the instructions to load the `template.json` file that you downloaded in the previous section

1. In the `template.json` file, replace: 
    - `firewallName` with the default value of your Azure Firewall name.
    - `azureFirewallPublicIpId` with the ID of your public IP address in the target region.
    - `virtualNetworkName` with the name of the virtual network in the target region. 
    - `firewallPolicy.id` with your policy ID.

1. [Create a new firewall policy](/azure/firewall-manager/create-policy-powershell) using the configuration of the source region and reflect changes introduced by the new target region (IP Address Ranges, Public IP, Rule Collections). 

1. If you're using Premium SKU and you want to enable TLS Inspection, update the newly created firewall policy and enable TLS inspection by following [the instructions here](https://techcommunity.microsoft.com/t5/azure-network-security-blog/building-a-poc-for-tls-inspection-in-azure-firewall/ba-p/3676723). 

1. Review and update the configuration for the topics below to reflect the changes required for the target region.
    - **IP Groups.** To include IP addresses from the target region, if different from the source, *IP Groups* should be reviewed. The IP addresses included in the groups must be modified.
    - **Zones.**  Configure the [availability Zones (AZ)](../reliability/availability-zones-overview.md) in the target region.
    - **Forced Tunneling.**  [Ensure that you've relcoated the virtual network](./relocation-virtual-network.md) and that the firewall *Management Subnet* is present before the Azure Firewall is relocated.   Update the IP Address in the target region of the Network Virtual Appliance (NVA) to which the Azure Firewall should redirect the traffic, in the User Defined Route (UDR).
    - **DNS.** Review IP Addresses for your custom custom *DNS Servers* to reflect your target region. If the *DNS Proxy* feature is enabled, be sure to configure your virtual network DNS server settings and set the Azure Firewall’s private IP address as a *Custom DNS server*.
    - **Private IP ranges (SNAT).** - If custom ranges are defined for SNAT, it's recommended that you review and eventually adjust to include the target region address space.
    - **Tags.** - Verify and eventually update any tag that may reflect or refer to the new firewall location.
    - **Diagnostic Settings.**  When recreating the Azure Firewall in the target region, be sure to review the *Diagnostic Setting* adn configure it to reflect the target region (Log Analytics workspace, storage account, Event Hub, or 3rd-party partner solution).

1. Edit the `location` property in the `template.json` file to the target region (The following example sets the target region to `centralus`.):

```json
      "resources": [
      {
          "type": "Microsoft.Network/azureFirewalls",
          "apiVersion": "2023-09-01",
          "name": "[parameters('azureFirewalls_fw_name')]",
          "location": "centralus",}]
```

To find the location code for your target region, see [Data residency in Azure](https://azure.microsoft.com/explore/global-infrastructure/data-residency/#overview).

1. Save the `template.json` file. 

# [PowerShell](#tab/azure-powershell)



1. Sign in to the [Azure portal](https://portal.azure.com).

1. If you're using Premium SKU with TLS Inspection enabled,
    1. [Relocate the key vault](./relocation-key-vault.md) used for TLS inspection into the new target region and follow the procedures to move certificates or generate new certificates for TLS inspection in the new key vault in the target region.
    1. [Relocate managed identity](./relocation-managed-identity.md) into the new target region and reassign the corresponding roles for the key vault in the target region and subscription.


1. In the `template.json` file, replace: 
    - `firewallName` with the default value of your Azure Firewall name.
    - `azureFirewallPublicIpId` with the ID of your public IP address in the target region.
    - `virtualNetworkName` with the name of the virtual network in the target region. 
    - `firewallPolicy.id` with your policy ID.

1. [Create a new firewall policy](/azure/firewall-manager/create-policy-powershell) using the configuration of the source region and reflect changes introduced by the new target region (IP Address Ranges, Public IP, Rule Collections). 

1. Review and update the configuration for the topics below to reflect the changes required for the target region.
    - **IP Groups.** To include IP addresses from the target region, if different from the source, *IP Groups* should be reviewed. The IP addresses included in the groups must be modified.
    - **Zones.**  Configure the [availability Zones (AZ)](../reliability/availability-zones-overview.md) in the target region.
    - **Forced Tunneling.**  [Ensure that you've relcoated the virtual network](./relocation-virtual-network.md) and that the firewall *Management Subnet* is present before the Azure Firewall is relocated.   Update the IP Address in the target region of the Network Virtual Appliance (NVA) to which the Azure Firewall should redirect the traffic, in the User Defined Route (UDR).
    - **DNS.** Review IP Addresses for your custom custom *DNS Servers* to reflect your target region. If the *DNS Proxy* feature is enabled, be sure to configure your virtual network DNS server settings and set the Azure Firewall’s private IP address as a *Custom DNS server*.
    - **Private IP ranges (SNAT).** - If custom ranges are defined for SNAT, it's recommended that you review and eventually adjust to include the target region address space.
    - **Tags.** - Verify and eventually update any tag that may reflect or refer to the new firewall location.
    - **Diagnostic Settings.**  When recreating the Azure Firewall in the target region, be sure to review the *Diagnostic Setting* adn configure it to reflect the target region (Log Analytics workspace, storage account, Event Hub, or 3rd-party partner solution).

1. Edit the `location` property in the `template.json` file to the target region (The following example sets the target region to `centralus`.):

```json
      "resources": [
      {
          "type": "Microsoft.Network/azureFirewalls",
          "apiVersion": "2023-09-01",
          "name": "[parameters('azureFirewalls_fw_name')]",
          "location": "centralus",}]
```

To find the location code for your target region, see [Data residency in Azure](https://azure.microsoft.com/explore/global-infrastructure/data-residency/#overview).

---


## Redeploy

Deploy the template to create a new Azure Firewall in the target region.


# [Azure portal](#tab/azure-portal)

1. Enter or select the property values:
    
    - Subscription: Select an Azure subscription.
    
    - Resource group: Select Create new and give the resource group a name.
    
    - Location: Select an Azure location.

1. The Azure Firewall is now deployed with the adopted configuration to reflect the needed changes in the target region. 
1. Verify configuration and functionality.


# [PowerShell](#tab/azure-powershell)

1. Obtain the subscription ID where you want to deploy the target public IP by running the following command:

```azurepowershell

Get-AzSubscription

```

2. Run the following commands to deploy your template:

```azurepowershell

$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
$location = Read-Host -Prompt "Enter the location (i.e. eastus)"

New-AzResourceGroup -Name $resourceGroupName -Location "$location"
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri "<name of your local template file>"

1. The Azure Firewall is now deployed with the adopted configuration to reflect the needed changes in the target region. 
1. Verify configuration and functionality.


```

## Related content

- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)
