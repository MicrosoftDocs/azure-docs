---
title: Azure Site Recovery deployment planner Cost Estimation details for  Hyper-V-to-Azure| Microsoft Docs
description: This article describes cost estimation details of the  generated report using Azure Site Recovery deployment planner for Hyper-V to Azure scenario.
services: site-recovery
documentationcenter: ''
author: nsoneji
manager: garavd
editor:

ms.assetid:
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 11/27/2017
ms.author: nisoneji

---
# Cost estimation
The Cost estimation sheet has the detailed cost analysis per VM for disaster recovery (DR) to Azure.

Azure prices for compute, storage, network, etc. varies across Azure regions. You can generate a cost estimation report with the latest Azure prices based on your subscription, the offer that is associated with your subscription and for the specified target Azure region in the specified currency. By default, the tool uses West US 2 Azure region and US dollar (USD) currency. If you have used any other region and currency, the next time when you generate a report without subscription id, offer id, target region and currency, it will use prices of the last used target region and last used currency for cost estimation.
This section shows the subscription ID and offer ID that you have used for report generation.  If not used, it will be blank.

In the whole report, the cells marked in grey are read only. Cells in white can be modified per your requirements.

## Overall DR cost by components
The first section shows the overall DR cost by components and DR cost by states. 

**Compute**: Cost of IaaS VMs that run on Azure for DR needs. It includes VMs that are created by Azure Site Recovery during DR-drills (test failovers) and VMs running on Azure like SQL Server with Always On Availability Groups and domain controllers / Domain Name Servers.

**Storage**: Cost of Azure storage consumption for DR needs. It includes storage consumption for replication and during DR drills.
Network: ExpressRoute and Site to Site VPN cost for DR needs. 

**ASR license**: Azure Site Recovery license cost for all compatible VMs. If you have manually entered a VM in the detailed cost analysis table, it’s Azure Site Recovery license cost will also be included.

## Overall DR cost by states
The total DR cost is categorized based on two different states - replication and DR-Drill.
**Replication cost**: The cost that will be incurred at the time of replication. It covers the cost of storage, network and Azure Site Recovery license. 

**DR-Drill cost**: The cost that will be incurred at the time of  DR drills. Azure Site Recovery spins up VMs during DR drills. The DR drill cost covers compute and storage cost of the running VMs.
Total DR drill duration in a year = Number of DR drills x Each DR drill duration (days)
Average DR drill cost (per month) = Total DR drill cost / 12

## Storage cost table
This table shows premium and standard storage cost that will be incurred for replication and DR drills with and without discount.

## Site to Azure network
Select the appropriate setting as per your requirements. 

**ExpressRoute**: By default, the tool will select the nearest ExpressRoute plan that matches with the required network bandwidth for delta replication. You can change the plan as per your requirements.

**VPN Gateway**: Select the VPN Gateway if you have any in your environment. By default, it will be NA.

**Target Region**: Specified Azure region for DR. The price used in the report for compute, storage, network and license is based on the Azure pricing for that region. 

## VM running on Azure
If you have any domain controller or DNS VM or SQL Server VM with Always On Availability Groups  running on Azure for DR you can provide the number of VMs and the size to consider their compute cost in the total DR cost. 

## Apply overall discount if applicable
If you are an Azure partner or a customer and are entitled to any discount on overall Azure pricing, you can use this field. The tool will apply the discount (in %) on all components.

## Number of virtual machines type and compute cost (per year)
This table shows the number of Windows and non-Windows VMs and DR drill compute cost for them.

## Settings 

**Using managed disk**: It specifies whether managed disk is being used  at the time of DR drills. The default is yes. If you have set -UseManagedDisks to No, it will use the unmanaged disk price for cost calculation.

**Currency**: The currency in which the report is generated. 
Cost duration:  You can view all costs either for the month or for the whole year. 

## Detailed cost analysis
The below table lists the cost breakup for each compatible VM. 
You can also use this table to get estimated Azure DR cost of non-profiled VMs by manually adding VMs. This is useful in cases where you need to estimate Azure costs for a new disaster recovery deployment without detailed profiling being done.
To manually add VMs: 
1.	Click on the 'Insert row' button to insert a new row between the Start and End rows

2.	Fill the following columns based on approximate VM size and number of VMs that match this configuration: 

* Number of VMs, IaaS size (Your selection)
* Storage Type (Standard/Premium)
* VM total storage size (GB)
* Number of DR drills in a year 
* Each DR drill duration (Days) 
* OS Type
* Data redundancy 
* Azure Hybrid Use Benefit.

3.	You can apply the same value to all VMs in the table by clicking the 'Apply to all' button for Number of DR-Drills in a year, Each DR-Drill duration (Days), Data redundancy and Azure Hybrid Use Benefit

4.	Click 'Re-calculate cost' to update cost

**VM Name**: The name of the VM.

**Number of VMs**: The number of VMs that match the configuration. You can update the number of the existing VMs if similar configuration VMs are not profiled but will be protected.

**IaaS size (Recommendation)**: It is the VM role size of the compatible VM that the tool recommends. 

**IaaS size (Your selection)**: By default, it is the same as recommended VM role size. You can change the role based on your requirement. Compute cost will be based on your selected VM role size.

**Storage type**: The type of the storage that will be used by the VM. It is either standard or premium storage.

**VM total storage size (GB)**: The total storage of the VM.

**Number of DR-Drills in a year**: The number of times you will perform DR-Drills in a year. By default, it is 4 times in a year. You can modify the period for specific VMs or apply the new value to all VMs by entering the new value on the top row and clicking the ‘Apply to all’ button. Based on number of DR-Drills in a year and each DR-Drill duration period, the total DR-Drill cost will be calculated.  

**Each DR-Drill duration (Days)**: The duration of each DR-Drill. By default, it is 7 days every 90 days as per the [Disaster Recovery Software Assurance benefit](https://azure.microsoft.com/en-in/pricing/details/site-recovery). You can modify the period for specific VMs or you can apply a new value to all VMs by entering new value on the top row and clicking the ‘Apply to all’ button. Based on number of DR-Drills in a year and each DR-Drill duration period, the total DR-Drill cost will be calculated.
  
**OS Type**: The OS type of the VM. It is either Windows or Linux. If the OS type is Windows, then Azure Hybrid Use Benefit can be applied to that VM. 

**Data redundancy**: It can be one of the following - Locally redundant storage (LRS), Geo-redundant storage (GRS) or Read-access geo-redundant storage (RA-GRS). Default is LRS. You can change the type based on your storage account for specific VMs or you can apply the new type to all VMs by changing the type of the top row and clicking ‘Apply to all’ button.  The cost of storage for replication will be calculated based on the price of data redundancy that you have selected. 

**Azure Hybrid Use Benefit**: You can apply Azure Hybrid Use Benefit to Windows VMs if applicable.  Default is Yes. You can change the setting for specific VMs or update all VMs by clicking the ‘Apply to all’ button.

**Total Azure consumption**: It incldues compute, storage and Azure Site Recovery license cost for your DR. Based on your selection it shows the cost either monthly or yearly.

**Steady state replication cost**: It includes storage cost for replication.

**Total DR-Drill cost (average)**: It includes compute and storage cost for DR-Drill.

**ASR license cost**: Azure Site Recovery license cost.

## Supported target regions
The Azure Site Recovery Deployment Planner provides cost estimation for the following Azure regions. If your region is not listed below, you can use any of the following regions whose pricing is nearest to your region.

eastus, eastus2, westus, centralus, northcentralus, southcentralus, northeurope, westeurope, eastasia, southeastasia, japaneast, japanwest, australiaeast, australiasoutheast, brazilsouth, southindia, centralindia, westindia, canadacentral, canadaeast, westus2, westcentralus, uksouth, ukwest, koreacentral, koreasouth 

## Supported currencies
The Azure Site Recovery Deployment Planner can generate the cost report with any of the following currencies.

|Currency|Name|
|---|---|
|USD| US Dollar ($)|
|INR|	Indian Rupee (₹)|
|DKK|	Danish Krone (kr)|
|CAD|	Canadian Dollar ($)|
|JPY|	Japanese Yen (¥)|
|KRW|	Korean Won (₩)|
|NZD|	New Zealand Dollar ($)|
|NOK|	Norwegian Krone (kr)|
|RUB|	Russian Ruble (руб)|
|SAR|	Saudi Riyal (SR)|
|ZAR|	South African Rand (R)|
|SEK|	Swedish Krona (kr)|
|TRY|	Turkish Lira (TL)|
|GBP|	British Pound (£)|
|MXN|	Mexican Peso (MX$)|
|MYR|	Malaysian Ringgit (RM$)|
|HKD|	Hong Kong Dollar (HK$)|
|BRL|	Brazilian Real (R$)|
|TWD|	Taiwanese Dollar (NT$)|
|EUR|	Euro (€)|
|CHF|	Swiss Franc. (chf)|
|ARS|	Argentine Peso ($)|
|AUD|	Australian Dollar ($)|
|IDR|	Indonesia rupiah (Rp)|

## Next steps
Learn more about protecting [Hyper-V VMs to Azure using Azure Site Recovery](https://docs.microsoft.com/en-us/azure/site-recovery/tutorial-hyper-v-to-azure).
