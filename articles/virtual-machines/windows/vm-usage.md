---
title: Understanding Azure virtual machine usage 
description: Understand virtual machine usage details
author: mmccrory
tags: azure-virtual-machine
ms.service: virtual-machines
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 12/04/2017
ms.author: memccror
---

# Understanding Azure virtual machine usage
By analyzing your Azure usage data, powerful consumption insights can be gained – insights that can enable better cost management and allocation throughout your organization. This document provides a deep dive into your Azure Compute consumption details. For more details on general Azure usage, navigate to [Understanding your bill](../../cost-management-billing/understand/review-individual-bill.md).

## Download your usage details
To begin, [download your usage details](../../cost-management-billing/manage/download-azure-invoice-daily-usage-date.md). The table below provides the definition and example values of usage for Virtual Machines deployed via the Azure Resource Manager. This document does not contain detailed information for VMs deployed via our classic model.


| Fields             | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Example Values                                                                                                                                                                                                                                                                                                                                                   |
|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Usage Date         | The date when the resource was used.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |  “11/23/2017”                                                                                                                                                                                                                                                                                                                                                     |
| Meter ID           | Identifies the top-level service for which this usage belongs to.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | “Virtual Machines”                                                                                                                                                                                                                                                                                                                                               |
| Meter Sub-Category | The billed meter identifier. <ul><li>For Compute Hour usage, there is a meter for each VM Size + OS (Windows, Non-Windows) + Region.</li><li>For Premium software usage, there is a meter for each software type. Most premium software images have different meters for each core size. For more information, visit the [Compute Pricing Page.](https://azure.microsoft.com/pricing/details/virtual-machines/)</li></ul>                                                                                                                                                                                                                                                                                                                                         | “2005544f-659d-49c9-9094-8e0aea1be3a5”                                                                                                                                                                                                                                                                                                                           |
| Meter Name         | This is specific for each service in Azure. For compute, it is always “Compute Hours”.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | “Compute Hours”                                                                                                                                                                                                                                                                                                                                                  |
| Meter Region       | Identifies the location of the datacenter for certain services that are priced based on datacenter location.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |  “JA East”                                                                                                                                                                                                                                                                                                                                                       |
| Unit               | Identifies the unit that the service is charged in. Compute resources are billed per hour.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | “Hours”                                                                                                                                                                                                                                                                                                                                                          |
| Consumed           | The amount of the resource that has been consumed for that day. For Compute, we bill for each minute the VM ran for a given hour (up to 6 decimals of accuracy).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |    “1”, “0.5”                                                                                                                                                                                                                                                                                                                                                    |
| Resource Location  | Identifies the datacenter where the resource is running.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | “JA East”                                                                                                                                                                                                                                                                                                                                                        |
| Consumed Service   | The Azure platform service that you used.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | "Microsoft.Compute"                                                                                                                                                                                                                                                                                                                                              |
| Resource Group     | The resource group in which the deployed resource is running in. For more information, see [Azure Resource Manager overview.](../../azure-resource-manager/management/overview.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |    "MyRG"                                                                                                                                                                                                                                                                                                                                                        |
| Instance ID        | The identifier for the resource. The identifier contains the name you specify for the resource when it was created. For VMs, the Instance ID will contain the SubscriptionId, ResourceGroupName, and VMName (or scale set name for scale set usage).                                                                                                                                                                                                                                                                                                                                                                                                                    | "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/ resourceGroups/MyRG/providers/Microsoft.Compute/virtualMachines/MyVM1”<br><br>or<br><br>"/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/ resourceGroups/MyRG/providers/Microsoft.Compute/virtualMachineScaleSets/MyVMSS1”                                                                                           |
| Tags               | Tag you assign to the resource. Use tags to group billing records. Learn how to [tag your Virtual Machines.](tag.md) This is available for Resource Manager VMs only.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | "{"myDepartment":"RD","myUser":"myName"}"                                                                                                                                                                                                                                                                                                                        |
| Additional Info    | Service-specific metadata. For VMs, we populate the following in the additional info field: <ul><li>Image Type- specific image that you ran. Find the full list of supported strings below under Image Types.</li><li>Service Type: the size that you deployed.</li><li>VMName: name of your VM. This is only populated for scale set VMs. If you need your VM Name for scale set VMs, you can find that in the Instance ID string above.</li><li>UsageType: This specifies the type of usage this represents.<ul><li>ComputeHR is the Compute Hour usage for the underlying VM, like Standard_D1_v2.</li><li>ComputeHR_SW is the premium software charge if the VM is using premium software, like Microsoft R Server.</li></ul></li></ul>    | Virtual Machines {"ImageType":"Canonical","ServiceType":"Standard_DS1_v2","VMName":"", "UsageType":"ComputeHR"}<br><br>Virtual Machine Scale Sets {"ImageType":"Canonical","ServiceType":"Standard_DS1_v2","VMName":"myVM1", "UsageType":"ComputeHR"}<br><br>Premium Software {"ImageType":"","ServiceType":"Standard_DS1_v2","VMName":"", "UsageType":"ComputeHR_SW"} |

## Image Type
For some images in the Azure gallery, the image type is populated in the Additional Info field. This enables users to understand and track what they have deployed on their Virtual Machine. The values that are populated in this field based on the image you have deployed are the following:
  - BitRock 
  - Canonical 
  - FreeBSD 
  - Open Logic 
  - Oracle 
  - SLES for SAP 
  - SQL Server 14 Preview on Windows Server 2012 R2 Preview 
  - SUSE
  - SUSE Premium
  - StorSimple Cloud Appliance 
  - Red Hat
  - Red Hat for SAP Business Applications     
  - Red Hat for SAP HANA 
  - Windows Client BYOL 
  - Windows Server BYOL 
  - Windows Server Preview 

## Service Type
The service type field in the Additional Info field corresponds to the exact VM size you deployed. Premium storage VMs (SSD-based) and non-premium storage VMs (HDD-based) are priced the same. If you deploy an SSD-based size, like Standard\_DS2\_v2, you see the non-SSD size (‘Standard\_D2\_v2 VM’) in the Meter Sub-Category column and the SSD-size (‘Standard\_DS2\_v2’)
in the Additional Info field.

## Region Names
The region name populated in the Resource Location field in the usage details varies from the region name used in the Azure Resource Manager. Here is a mapping between the region values:

|    **Resource Manager Region Name**       |    **Resource Location in Usage Details**    |
|--------------------------|------------------------------------------|
|    australiaeast         |    AU East                               |
|    australiasoutheast    |    AU Southeast                          |
|    brazilsouth           |    BR South                              |
|    CanadaCentral         |    CA Central                            |
|    CanadaEast            |    CA East                               |
|    CentralIndia          |    IN Central                            |
|    centralus             |    Central US                            |
|    chinaeast             |    China East                            |
|    chinanorth            |    China North                           |
|    eastasia              |    East Asia                             |
|    eastus                |    East US                               |
|    eastus2               |    East US 2                             |
|    GermanyCentral        |    DE Central                            |
|    GermanyNortheast      |    DE Northeast                          |
|    japaneast             |    JA East                               |
|    japanwest             |    JA West                               |
|    KoreaCentral          |    KR Central                            |
|    KoreaSouth            |    KR South                              |
|    northcentralus        |    North Central US                      |
|    northeurope           |    North Europe                          |
|    southcentralus        |    South Central US                      |
|    southeastasia         |    Southeast Asia                        |
|    SouthIndia            |    IN South                              |
|    UKNorth               |    US North                              |
|    uksouth               |    UK South                              |
|    UKSouth2              |    UK South 2                            |
|    ukwest                |    UK West                               |
|    USDoDCentral          |    US DoD Central                        |
|    USDoDEast             |    US DoD East                           |
|    USGovArizona          |    USGov Arizona                         |
|    usgoviowa             |    USGov Iowa                            |
|    USGovTexas            |    USGov Texas                           |
|    usgovvirginia         |    USGov Virginia                        |
|    westcentralus         |    US West Central                       |
|    westeurope            |    West Europe                           |
|    WestIndia             |    IN West                               |
|    westus                |    West US                               |
|    westus2               |    US West 2                             |


## Virtual machine usage FAQ
### What resources are charged when deploying a VM?    
VMs acquire costs for the VM itself, any premium software running on the VM, the storage account\managed disk associated with the VM, and the networking bandwidth transfers from the VM.
### How can I tell if a VM is using Azure Hybrid Benefit in the Usage CSV?
If you deploy using the [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/), you are charged the Non-Windows VM rate since you are bringing your own license to the cloud. In your bill, you can distinguish which Resource Manager VMs are running Azure Hybrid Benefit because they have either “Windows\_Server BYOL” or “Windows\_Client BYOL” in the ImageType column.
### How are Basic vs. Standard VM Types differentiated in the Usage CSV?
Both Basic and Standard A-Series VMs are offered. If you deploy a Basic VM, in the Meter Sub Category, it has the string “Basic.” If you deploy a Standard A-Series VM, then the VM size appears as “A1 VM” since Standard is the default. To learn more about the differences between Basic and Standard, see the [Pricing Page](https://azure.microsoft.com/pricing/details/virtual-machines/).
### What are ExtraSmall, Small, Medium, Large, and ExtraLarge sizes?
ExtraSmall - ExtraLarge are the legacy names for Standard\_A0 – Standard\_A4. In classic VM usage records, you might see this convention used if you have deployed these sizes.
### What is the difference between Meter Region and Resource Location?
The Meter Region is associated with the meter. For some Azure services who use one price for all regions, the Meter Region field could be blank. However, since VMs have dedicated prices per region for Virtual Machines, this field is populated. Similarly, the Resource Location for Virtual Machines is the location where the VM is deployed. The Azure region in both fields are the same, although they might have a different string convention for the region name.
### Why is the ImageType value blank in the Additional Info field?
The ImageType field is only populated for a subset of images. If you did not deploy one of the images above, the ImageType is blank.
### Why is the VMName blank in the Additional Info?
The VMName is only populated in the Additional Info field for VMs in a scale set. The InstanceID field contains the VM name for non-scale set VMs.
### What does ComputeHR mean in the UsageType field in the Additional Info?
ComputeHR stands for Compute Hour which represents the usage event for the underlying infrastructure cost. If the UsageType is ComputeHR\_SW, the usage event represents the premium software charge for the VM.
### How do I know if I am charged for premium software?
When exploring which VM Image best fits your needs, be sure to check out the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/compute). The image has the software plan rate. If you see “Free” for the rate, there is no additional cost for the software. 
### What is the difference between Microsoft.ClassicCompute and Microsoft.Compute in the Consumed service?
Microsoft.ClassicCompute represents classic resources deployed via the Azure Service Manager. If you deploy via the Resource Manager, then Microsoft.Compute is populated in the consumed service. Learn more about the [Azure Deployment models](../../azure-resource-manager/management/deployment-models.md).
### Why is the InstanceID field blank for my Virtual Machine usage?
If you deploy via the classic deployment model, the InstanceID string is not available.
### Why are the tags for my VMs not flowing to the usage details?
Tags only flow to you the Usage CSV for Resource Manager VMs only. Classic resource tags are not available in the usage details.
### How can the consumed quantity be more than 24 hours one day?
In the Classic model, billing for resources is aggregated at the Cloud Service level. If you have more than one VM in a Cloud Service that uses the same billing meter, your usage is aggregated together. VMs deployed via Resource Manager are billed at the VM level, so this aggregation will not apply.
### Why is pricing not available for DS/FS/GS/LS sizes on the pricing page?
Premium storage capable VMs are billed at the same rate as non-premium storage capable VMs. Only your storage costs differ. Visit the [storage pricing page](https://azure.microsoft.com/pricing/details/storage/unmanaged-disks/) for more information.
### How to know the operating system version running on the VM?

There are 3 possible places in the APIs which may return the operating system running on the VM:

1) Running VMs that include the guest agent (all Linux VMs and most Windows VMs) will show the OS Name and OS Version in the VM Instances view. This is accurate at all times, but due to the fact that the information comes from the guest agent it will not be available for all VMs. API documentation [here](https://docs.microsoft.com/rest/api/compute/virtualmachines/instanceview#virtualmachineagentinstanceview).
2) VMs deployed from a platform image will contain the image details which may indicate the OS version in the publisher selected names for Offer or SKU. However, these are publisher selected so there is no guarantee the OS will be discoverable in the naming. API documentation [here](https://docs.microsoft.com/rest/api/compute/images/get#operatingsystemtypes).
3) Each OS Disk will have a specified value of Windows or Linux. This value is inherited from the image when the OS Disk was created from an image. When an OS disk is uploaded to the platform directly, then the OS value is set when the OS disk is created. This value is always present, but the Azure platform does not ensure it is correct. API documentation [here](https://docs.microsoft.com/rest/api/compute/virtualmachineimages/get#operatingsystemtypes).

## Next steps
To learn more about your usage details, see [Understand your bill for Microsoft Azure.](../../cost-management-billing/understand/review-individual-bill.md)

