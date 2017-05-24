---
title: Replicate Azure VMs between Azure sites | Microsoft Docs
description: Summarizes the steps you need for replicating Azure VMs between Azure regions with the Site Recovery service
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmon
editor: ''

ms.assetid: dab98aa5-9c41-4475-b7dc-2e07ab1cfd18
ms.service: site-recovery
ms.workload: backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/22/2017
ms.author: raynew

---
# Replicate Azure VMs between regions with Azure Site Recovery


This article describes how to replicate Azure virtual machines (VMs) between Azure regions, using the [Azure Site Recovery](site-recovery-overview.md) service in the Azure portal.

Post comments and questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Disaster recovery in Azure

In addition to the inbuilt Azure infrastructure capabilities and features that contribute to a robust and resilient availability strategy for workloads running on Azure VMs, there are a number of reasons why you need to plan for disaster recovery between Azure regions yourself:

- Your compliance guidelines for specific apps and workloads require a Business continuity and Disaster Recovery (BCDR) strategy.
- You want the ability to protect and recover Azure VMs based on your business decisions, and not only based on inbuilt Azure functionality.
- You need to be able to test failover and recovery in accordance with your business and compliance needs, with no impact on production.
- You need to be able to failover to the recovery region in the event of a disaster and fail back to the orinal source region seamlessly.

Azure to Azure VM replication using Site Recovery helps you to do all the above.


## Why use Site Recovery?      

Site Recovery provides a simple way to replicate Azure VMs between regions:

- **Automatic deployment**. Unlike an active-active replication model, there's no need for an expensive and complex infrastructure in the secondary region. When you enable replication, Site Recovery automatically creates the required resources in the target region, based on source region settings. 
- **Control regions**. With Site Recovery you can replicate from any region to any region within a contenent. Compare this with RA-GRS (read-access geo-redundant storage), which replicates asynchronously between standard [paired regions]((https://docs.microsoft.com/azure/best-practices-availability-paired-regions) only, and provides read-only access to the data in the target region.
- **Automated replication**. Site Recovery provides automated continuous replication. Failover and failback can be triggered with just a single click.
- **RTO and RPO**. Site Recovery takes advantage of the Azure network infrastructure that connects regions, to keep RTO and RPO very low.
- **Testing**. You can run disaster recovery drills with on-demand test failovers, as and when needed, without impacting your production workloads or ongoing replication.
- **Recovery plans**. You can use recovery plans to orchestrate failover and failback of the entire application running on multiple VMs. Recovery plan feature has rich first class integration with Azure automation runbooks.


## Deployment summary

Here's a summary of what you need to do to set up replication of VMs between Azure regions:

1. Verify prerequisites and limitations.
2. Create a Recovery Services vault. The vault contains configuration settings, and orchestrates replication.
3. Enable replication for the Azure VMs.
4. Run a test failover to make sure everything's working as expected.


## Prerequisites

**Support requirement** | **Details**
--- | ---
**Supported deployment** | You can deploy the scenario in the Azure portal. Deployment in the classic portal isn't supported.
**Azure VMs** | **Operating system**: VMs you want to replicate should be running a [supported operating system](site-recovery-support-matrix-to-azure.md#support-for-replicated-machine-os-versions).<br/><br/> **Linux**: VMs running Linux must be running a [supported file system](site-recovery-support-matrix-azure-to-azure.md5#supported-file-systems-and-guest-storage-configurations-on-azure-virtual-machines-running-linux-os).<br/><br/> **Compute**: VMs must comply with [VM compute requirements](site-recovery-support-matrix-azure-to-azure.md#support-for-compute-configuration).
**Storage** | You can replicate VMs using standard or premium storage. [Learn more](ite-recovery-support-matrix-azure-to-azure.md#support-for-storage-configuration).
**Networking** | **URL access**: Make sure that VMs (or firewall proxy if used) can access these [URLs and addresses](site-recovery-azure-to-azure-networking-guidance.md#outbound-connectivity-for-azure-site-recovery-urls-or-ip-ranges)<br/><br/> **NSG**: If you're using network security groups (NSGs) with access control list (ACL) rules that allow and deny outbound traffic on VMs in a virtual network, you need to [create appropriate rules](site-recovery-azure-to-azure-networking-guidance.md#network-security-group-configuration). This [sample script](sample-script-for-allowing-azure-datacenter-ip-address-ranges) shows how to allow IP addresses for a specific region.
**Azure Express route to on-premises** | If you're using an Azure Express Route connection between your on-premises datacenter and the Azure region, and you want to connect to an Azure VM, make sure you have at least a site-to-site connect set up between the datacenter and target Azure region. If traffic volumes are heavy, set up a separate Express Route connection. [Learn more](site-recovery-azure-to-azure-networking-guidance.md#azure-to-on-premises-expressroute-configuration).<br/<br/> **Network mapping**: During deployment you set up network mapping so that Azure VMs that fail over to a secondary site are connected to a network that's mapped to the network used by the primary VM in the primary region. [Learn more](site-recovery-network-mapping-azure-to-azure.md).


## Limitations

**Component** | **Limitation**
--- | ---
**Vault** | We recommend that you create the vault used for replication between Azure regions in the target Azure location. It shouldn't be in the same region as the source Azure VMs, because it will be unavailable if there's a disruption in the source region.<br/><br/> Create the vault under the same subscription as the VMs. You can't replicate VMs running in one subscription to another subscription.
**Replication and failover** | You can use recovery plans to orchestrate failover and recovery of multiple VMs, but multi-VM replication groups are not supported.


## Create a Recovery Services vault

[!INCLUDE [site-recovery-create-vault](../../includes/site-recovery-create-vault.md)]

## Configure source settings

Select what you want to replicate.

1. In **Recovery Services vaults**, click the vault name.
2. In the vault > **Getting Started**, click **Site Recovery** > **Replicate Application** > **Source**.
    ![Step 1](./media/site-recovery-azure-to-azure/step-1.png)
3. In **Source**, select **Azure**. In **Source location**, select the primary region from which you want to replicate. Select a deployment model.
    - If you select **Resource Manager**, select the source resource group.
    - If you select **Classic**, select a cloud service. Then click **OK**.
    ![Source](./media/site-recovery-azure-to-azure/source.png)

## Select virtual machines

1. Click **Virtual machines**. Site Recovery retrieves VMs in the resource group or cloud service.
2. Select the VMs you want to replicate, and then click **OK**.

    ![Select VMs](./media/site-recovery-azure-to-azure/vms.png)

## Configure target and replication settings

1. Site Recovery automatically creates settings in the target site using settings that are already configured in the source region, including a target resource group, storage accounts, virtual network, and availability sets (all are created with the suffix **asr**).
    ![Settings](./media/site-recovery-azure-to-azure/settings.png)
2. Click **Customize** to override the target settings that  have been created, or if you want to specify the settings for a specific VM.
    ![Customize target](./media/site-recovery-azure-to-azure/customize-target.png)
3. By default, Site Recovery creates a replication policy that takes app-consistent snapshots every 60 minutes, and retains recovery points for 24 hours. To create a policy with different settings, click **Customize** next to **Replication Policy**.
    ![Customize policy](./media/site-recovery-azure-to-azure/customize-policy.png)
3. Click **Create target resources** to start provisioning the target components. It should take a minute or so. Don't close the blade during provisioning, or you'll need to start over.




## Enable replication

1. Click **Enable replication**. This triggers replication of the selected VMs.
2. Depending on the VM volume, this can take a couple of hours to complete. You can track progress of the **Enable protection** job in **Settings** > **Jobs** > **Site Recovery Jobs**.
3. In **Settings** > **Replicated Items**, you can view the status of VMs, and initial replication progress. Click on the VM to drill down into its settings.

### Enable replication in the VM settings

Alternatively, you can enable replication for a specific VM in the VM properties.

1. Open the Azure VM settings > **Site Recovery**.
2. Select the target region to which you want to replicate the VM.
3. The target and replication settings will be created in accordance with the source settings. You can modify the defaults suggested as needed.
    ![Replicate from VM](./media/site-recovery-azure-to-azure/replicate-vm.png)

    ![Replicate from VM](./media/site-recovery-azure-to-azure/replicate-vm2.png)
4. After you've verified the settings, click **Enable Replication** to start replicating the VM.

## Create a recovery plan

You can optionally add source VMs to a recovery plan. VMs in a recovery plan fail over and start up together, and are useful when there are dependencies between VMs. [Learn more](site-recovery-create-recovery-plan.md).

## Run a test failover

1. In the vault, click **Replicated Items**.
2. Right-click the VM you want to test > **Test Failover**.
    - By default failover is to the latest recovery point.
    - Specify a Azure virtual network in which target test VMs will be created.
3. Track failover progress on the **Jobs** tab.

[Learn more](site-recovery-test-failover-to-azure.md) about running a test failover.

>[AZURE.NOTE] If you want to do a test failover of a recovery plan rather than a single VM, in **Recovery Plans (Site Recovery)**, select the plan, and click **Test Failover**.


## Sample script for allowing Azure datacenter IP address ranges

This script is provided as an example only.

```
$downloadUri = "https://www.microsoft.com/en-in/download/confirmation.aspx?id=41653"
$downloadPage = Invoke-WebRequest -Uri $downloadUri
$xmlFileUri = ($downloadPage.RawContent.Split('"') -like "https://*PublicIps*")[0]
$response = Invoke-WebRequest -Uri $xmlFileUri

# Get list of regions and public IP ranges

[xml]$xmlResponse = [System.Text.Encoding]::UTF8.GetString($response.Content)
$regions = $xmlResponse.AzurePublicIpAddresses.Region

# Select Azure regions to define NSG rules

$selectedRegions = $regions.Name | Out-GridView -Title "Select Azure Datacenter Regions …" -PassThru
$ipRange = ( $regions | where-object Name -In $selectedRegions ).IpRange


# Build NSG rules

$rules = @()
$rulePriority = 1100
$nsg = Get-AzureRmNetworkSecurityGroup -Name $nsgname -ResourceGroupName $rgName
ForEach ($subnet in $ipRange.Subnet) {

    $ruleName = "Allow_Azure_Out_" + $subnet.Replace("/","-")

    Get-AzureRmNetworkSecurityGroup -Name $nsgname -ResourceGroupName $rgName | Add-AzureRmNetworkSecurityRuleConfig -Name $ruleName -Description "Allow outbound to Azure $subnet" -Access Allow -Protocol * -Direction Outbound -Priority $rulePriority -SourceAddressPrefix VirtualNetwork -SourcePortRange * -DestinationAddressPrefix "$subnet" -DestinationPortRange * | Set-AzureRmNetworkSecurityGroup


    $rulePriority++

}
```

## Next steps

After you've tested the deployment:

- [Learn more](site-recovery-failover.md) about different types of failovers, and how to run them.
- Learn about [reprotecting Azure VMs](site-recovery-how-to-reprotect-azure-to-azure.md) after failover.
