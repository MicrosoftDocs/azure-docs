---
title: Review the Azure Site Recovery Deployment Planner cost estimation report for disaster recovery of Hyper-V VMs to Azure| Microsoft Docs
description: This article describes how to review the cost estimation report generated the Azure Site Recovery Deployment Planner for Hyper-V disaster recovery to Azure.
services: site-recovery
author: ankitaduttaMSFT
manager: rochakm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 4/9/2019
ms.author: ankitadutta

---
# Cost estimation report by Azure Site Recovery Deployment Planner 

The Azure Site Recovery Deployment Planner Report provides the cost estimation summary in [Recommendations](hyper-v-deployment-planner-analyze-report.md#recommendations) sheets and detailed cost analysis in the Cost Estimation sheet. It has the detailed cost analysis per VM. 

### Cost estimation summary 
The graph shows the summary view of the estimated total disaster recovery (DR) cost to Azure of your chosen target region and the currency that you specified for report generation.

![Cost estimation summary](media/hyper-v-azure-deployment-planner-cost-estimation/cost-estimation-summary-h2a.png)

The summary helps you to understand the cost that you need to pay for storage, compute, network, and license when you protect your compatible VMs by using Azure Site Recovery. The cost is calculated for compatible VMs and not on all the profiled VMs. 
 
You can view the cost either monthly or yearly. Learn more about [supported target regions](./hyper-v-deployment-planner-cost-estimation.md#supported-target-regions) and [supported currencies](./hyper-v-deployment-planner-cost-estimation.md#supported-currencies).

**Cost by components**: The total DR cost is divided into four components: compute, storage, network, and Site Recovery license cost. The cost is calculated based on the consumption that is incurred during replication and at DR-drill time. Compute, storage (premium and standard), the ExpressRoute/VPN that is configured between the on-premises site and Azure, and the Site Recovery license are used for the calculations.

**Cost by states**: The total disaster recovery (DR) cost category is based on two different states: replication and DR drill. 

**Replication cost**: The cost that is incurred during replication. It covers the cost of storage, network, and the Site Recovery license. 

**DR-Drill cost**: The cost that is incurred during test failovers. Site Recovery spins up VMs during test failover. The DR-drill cost covers the running VMs' compute and storage costs. 

**Azure storage cost per Month/Year**: The total storage cost that is incurred for premium and standard storage for replication and DR drill.

## Detailed cost analysis
Azure prices for compute, storage, and network vary across Azure regions. You can generate a cost estimation report with the latest Azure prices based on your subscription, the offer associated with your subscription, and the specified target Azure region in a specified currency. By default, the tool uses West US 2 Azure region and US dollar (USD) currency. If you use any other region and currency, the next time you generate a report without subscription ID, offer ID, target region, and currency, the tool uses prices of the last-used target region and currency for cost estimation.

This section shows the subscription ID and offer ID that you used for report generation. If they're not used, it's blank.

In the whole report, the cells marked in gray are read-only. Cells in white can be modified according to your requirements.

![Cost estimation details](media/hyper-v-azure-deployment-planner-cost-estimation/cost-estimation1-h2a.png)

### Overall DR costs by components
The first section shows the overall DR cost by components and DR cost by states. 

**Compute**: The cost of IaaS VMs that run on Azure for DR needs. It includes VMs that are created by Site Recovery during DR drills (test failovers). It also includes VMs running on Azure, such as SQL Server with Always On availability groups and domain controllers or domain name servers.

**Storage**: The cost of Azure storage consumption for DR needs. It includes storage consumption for replication and during DR drills.

**Network**: ExpressRoute and site-to-site VPN cost for DR needs. 

**Azure Site Recovery license**: The Site Recovery license cost for all compatible VMs. If you manually entered a VM in the detailed cost analysis table, the Site Recovery license cost also is included for that VM.

### Overall DR costs by states
The total DR cost is categorized based on two different states: replication and DR drill.

**Replication**: The cost incurred at the time of replication. It covers the cost of storage, network, and the Site Recovery license. 

**DR-Drill**: The cost incurred at the time of DR drills. Site Recovery spins up VMs during DR drills. The DR-drill cost covers compute and storage cost of the running VMs.

* Total DR-drill duration in a year = number of DR drills x each DR drill duration (days)
* Average DR-drill cost (per month) = total DR-drill cost / 12

### Storage cost table
This table shows premium and standard storage costs incurred for replication and DR drills with and without discounts.

### Site to Azure network
Select the appropriate setting according to your requirements. 

**ExpressRoute**: By default, the tool selects the nearest ExpressRoute plan that matches with the required network bandwidth for delta replication. You can change the plan according to your requirements.

**VPN Gateway type**: Select the Azure VPN Gateway if you have any in your environment. By default, it is NA.

**Target region**: Specified Azure region for DR. The price used in the report for compute, storage, network, and license is based on the Azure pricing for that region. 

### VM running on Azure
Perhaps you have a domain controller or DNS VM or SQL Server VM with Always On availability groups running on Azure for DR. You can provide the number of VMs and the size to consider their computing cost in the total DR cost. 

### Apply overall discount if applicable
If you're an Azure partner or a customer and are entitled to any discount on overall Azure pricing, you can use this field. The tool applies the discount (in percent) on all components.

### Number of virtual machines type and compute cost (per year)
This table shows the number of Windows and non-Windows VMs and the DR-drill compute cost for them.

### Settings 
**Using Managed disk**: This setting specifies whether a managed disk is used at the time of DR drills. The default is **Yes**. If you set **-UseManagedDisks** to **No**, the unmanaged disk price is used for cost calculation.

**Currency**: The currency in which the report is generated.

**Cost duration**: You can view all costs either for the month or for the whole year. 

## Detailed cost analysis table
![Detailed cost analysis](media/hyper-v-azure-deployment-planner-cost-estimation/detailed-cost-analysis-h2a.png)

The table lists the cost breakdown for each compatible VM. You also can use this table to get the estimated Azure DR cost of nonprofiled VMs by manually adding VMs. This information is useful in cases where you need to estimate Azure costs for a new DR deployment without detailed profiling.

To manually add VMs:

1. Select **Insert row** to insert a new row between the **Start** and **End** rows.

1. Fill in the following columns based on approximate VM size and the number of VMs that match this configuration: 

    a. **Number of VMs**

    b. **IaaS size (Your selection)**

    c. **Storage type Standard/Premium**

    d. **VM total storage size (GB)**

    e. **Number of DR-Drills in a year**

    f. **Each DR-Drill duration (Days)**

    g. **OS Type**

    h. **Data redundancy**

    i. **Azure Hybrid Use Benefit**

1. You can apply the same value to all VMs in the table by selecting **Apply to all** for **Number of DR-Drills in a year**, **Each DR-Drill duration (Days)**, **Data redundancy**, and **Azure Hybrid Use Benefit**.

1. Select **Re-calculate cost** to update the cost.

**VM Name**: The name of the VM.

**Number of VMs**: The number of VMs that match the configuration. You can update the number of existing VMs if a similar configuration of VMs isn't profiled but protected.

**IaaS size (Recommendation)**: The VM role size of the compatible VM that the tool recommends. 

**IaaS size (Your selection)**: By default, the size is the same as the recommended VM role size. You can change the role based on your requirement. Compute cost is based on your selected VM role size.

**Storage type**: The type of storage that is used by the VM. It's either standard or premium storage.

**VM total storage size (GB)**: The total storage of the VM.

**Number of DR-Drills in a year**: The number of times you perform DR drills in a year. By default, it's four times in a year. You can modify the period for specific VMs or apply the new value to all VMs. Enter the new value in the top row, and select **Apply to all**. Based on the number of DR drills in a year and each DR-drill duration period, the total DR-drill cost is calculated. 

**Each DR-Drill duration (Days)**: The duration of each DR drill. By default, it's 7 days every 90 days according to the [Disaster Recovery Software Assurance benefit](https://azure.microsoft.com/pricing/details/site-recovery). You can modify the period for specific VMs, or you can apply a new value to all VMs. Enter a new value in the top row, and select **Apply to all**. The total DR-drill cost is calculated based on the number of DR drills in a year and each DR-drill duration period.
 
**OS Type**: The operating system (OS) type of the VM. It's either Windows or Linux. If the OS type is Windows, the Azure Hybrid Use Benefit can be applied to that VM. 

**Data redundancy**: It can be locally redundant storage, geo-redundant storage, or read-access geo-redundant storage. The default is locally redundant storage. You can change the type based on your storage account for specific VMs, or you can apply the new type to all VMs. Change the type of the top row, and select **Apply to all**. The cost of storage for replication is calculated based on the price of data redundancy that you selected. 

**Azure Hybrid Use Benefit**: You can apply the Azure Hybrid Use Benefit to Windows VMs, if applicable. The default is **Yes**. You can change the setting for specific VMs, or you can update all VMs. Select **Apply to all**.

**Total Azure consumption**: The compute, storage, and Site Recovery license cost for your DR. Based on your selection, it shows the cost either monthly or yearly.

**Steady state replication cost**: The storage cost for replication.

**Total DR-Drill cost (average)**: The compute and storage cost for DR drills.

**Azure Site Recovery license cost**: The Site Recovery license cost.

## Supported target regions
Site Recovery Deployment Planner provides cost estimation for the following Azure regions. If your region isn't listed here, you can use any of the following regions whose pricing is nearest to your region:

eastus, eastus2, westus, centralus, northcentralus, southcentralus, northeurope, westeurope, eastasia, southeastasia, japaneast, japanwest, australiaeast, australiasoutheast, brazilsouth, southindia, centralindia, westindia, canadacentral, canadaeast, westus2, westcentralus, uksouth, ukwest, koreacentral, koreasouth 

## Supported currencies
Site Recovery Deployment Planner can generate the cost report with any of the following currencies.

|Currency|Name|Currency|Name|Currency|Name|
|---|---|---|---|---|---|
|ARS|Argentine peso ($)|AUD|Australian dollar ($)|BRL|Brazilian real (R$)|
|CAD|Canadian dollar ($)|CHF|Swiss franc (chf)|DKK|Danish krone (kr)|
|EUR|Euro (&euro;)|GBP|British pound (£)|HKD|Hong Kong dollar (HK$)|
|IDR|Indonesia rupiah (Rp)|INR|Indian rupee (₹)|JPY|Japanese yen (¥)|
|KRW|Korean won (₩)|MXN|Mexican peso (MX$)|MYR|Malaysian ringgit (RM$)|
|NOK|Norwegian krone (kr)|NZD|New Zealand dollar ($)|RUB|Russian ruble (руб)|
|SAR|Saudi riyal (SR)|SEK|Swedish krona (kr)|TWD|Taiwanese dollar (NT$)|
|TRY|Turkish lira (TL)|USD| US dollar ($)|ZAR|South African rand (R)|

## Next steps
Learn more about how to protect [Hyper-V VMs to Azure by using Site Recovery](hyper-v-azure-tutorial.md).
