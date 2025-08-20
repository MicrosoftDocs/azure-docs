---
title: Requirements and considerations for Azure NetApp Files application volume group for SAP HANA
description: Describes the requirements and considerations you need to be aware of before using Azure NetApp Files application volume group for SAP HANA.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: concept-article
ms.date: 04/22/2025
ms.author: anfdocs
# Customer intent: As a cloud architect, I want to understand the requirements and best practices for deploying an application volume group for SAP HANA, so that I can ensure optimal performance and reliability of my SAP HANA setup on Azure.
---
# Requirements and considerations for application volume group for SAP HANA 

This article describes the requirements and considerations you need to be aware of before using Azure NetApp Files application volume group (AVG) for SAP HANA.

## Requirements and considerations

* You need to use the [manual QoS capacity pool](manage-manual-qos-capacity-pool.md) functionality.  
* Application volume group supports Basic and Standard network features. To use features including availability zone volume placement, use [Standard network features](azure-netapp-files-network-topologies.md).
* Application volume group supports [availability zone volume placement](replication.md#availability-zones) as the default and recommended method for placement. Using availability zone volume placement mitigates the need for AVset pinning and eliminates the need for proximity placement groups. With support for availability zone volume placement, you only need to select the same availability zone as the database servers. Using availability zone volume placement aligns with the Microsoft recommendation on how to deploy SAP HANA infrastructures to achieve best performance with high-availability, maximum flexibility, and simplified deployment. 
    * If regions don't support availability zones, you can select a regional deployment or choose proximity placement groups (PPG).

    When you create a PPG, you must anchor it to your SAP HANA compute resources. Application volume group for SAP HANA needs this setup to search for an Azure NetApp Files resource that is close to the SAP HANA servers. For more information, see [Best practices about PPGs](#best-practices-about-proximity-placement) and [Create a PPG using the Azure portal](/azure/virtual-machines/windows/proximity-placement-groups-portal).
  
   >[!NOTE]
   >Do not delete the PPG. Deleting a PPG removes the pinning and can cause subsequent volume groups to be created in sub-optimal locations which could lead to increased latency.
  
* You must complete your sizing and SAP HANA system architecture, including the following areas: 
    * SAP ID (SID)
    * Memory
    * Single-host or multiple-host SAP HANA
    * Determine whether you want to use HANA System Replication (HSR).
        HSR enables SAP HANA databases to synchronously or asynchronously replicate from a primary SAP HANA system to a secondary SAP HANA system. 
    * The expected change rate for the data volume (in case you're using snapshots for backup purposes)
* You must create a virtual network (VNet) and delegated subnet to map the Azure NetApp Files IP addresses.

    It's recommended that you lay out the VNet and delegated subnet at design time. 

    Application volume group for SAP HANA creates multiple IP addresses, up to six IP addresses for larger-sized estates. Ensure that the delegated subnet has sufficient free IP addresses. Consider using a delegated subnet with a minimum of 251 IP addresses with a subnet size of /24. See [Considerations about delegating a subnet to Azure NetApp Files](azure-netapp-files-delegate-subnet.md#considerations).

>[!IMPORTANT]
>The use of application volume group for SAP HANA for applications other than SAP HANA is not supported. Reach out to your Azure NetApp Files specialist for guidance on using Azure NetApp Files multi-volume layouts with other database applications.

## Best practices about proximity placement

To deploy SAP HANA volumes using the application volume group, you need to ensure that your HANA database VMs and the Azure NetApp Files resources are in close proximity to ensure lowest possible latency. You can achieve close proximity using either of the following deployment methods: 
  
* **Availability zone volume placement (preferred)**
    Select the availability zone for the volumes and select Standard network features for the deployment. You don't need a proximity placement group or VM pinning with availability zone volume placement. 

* **Proximity placement group with VM pinning**
    The application volume group uses a proximity placement group linked (or anchored) to the database VMs. When passed to the application volume group, the PPG is used to find all Azure NetApp Files resources in close proximity to the database servers. Volumes are deployed using Basic network features.

> [!IMPORTANT]
> A PPG is only anchored and can therefore identify the location of the VMs if at least one VM is started and kept running for the duration of all AVG deployments. If all VMs are stopped, the PPG loses its anchor. At the next restart, the VMs can move to a different location. This situation could lead to increased latency as Azure NetApp Files volumes are not moved after initial creation. 

To avoid this situation, you should create an availability set per database and use the **[SAP HANA VM pinning request form](https://aka.ms/HANAPINNING)** to pin the availability set to a dedicated compute cluster. After pinning, you need to add a PPG to the availability set, and then deploy all hosts of an SAP HANA database using that availability set. Doing so ensures that all virtual machines (VMs) are at the same location. As long as one of the VMs is started, the PPG retains its anchor to deploy the AVG volumes. 

> [!IMPORTANT]
> If you requested Azure NetApp Files SAP HANA volume pinning before the application volume group was available, you should remove the pinning for your subscription. Existing pinning for a subscription might result in inconsistent deployment of volumes; application volume group volumes are deployed based on the PPG while other volumes are deployed based on the initial volume pinning request.

### Relationship between availability set, VM, PPG, and Azure NetApp Files volumes 

A PPG needs to have at least one VM assigned to it, either directly or via an availability set. The purpose of the PPG is to extract the exact location of a VM and pass this information to AVG to search for Azure NetApp Files resources in the same location for volume creation. This approach works only when at least ONE VM in the PPG is started and kept running. Typically, you should add your database servers to this PPG.

PPGs have the side effect that, if all VMs are shut down, a following restart of VMs does NOT guarantee that they would start in the same location as before. To prevent this situation from happening, it's strongly recommended to use an availability set that has all VMs and the PPG associated to it, and use the [HANA pinning workflow](https://aka.ms/HANAPINNING). The workflow not only ensures that the VMs are not moving if restarted, it also ensures that locations are selected where enough compute and Azure NetApp Files resources are available.

When using a PPG without a pinned availability set, a PPG would lose its anchor if all VMs in that PPG are stopped. When the VMs are restarted, they might be started in a different location, which can result in a latency increase because the volumes created with the application volume group won't be moved.

### Two possible scenarios about using PPG

This situation leads to two possible scenarios:

* Stable long-term setup:   
    Using an availability set in combination with a PPG where the availability set is manually pinned.

    With pinning, it's always assured that the placement of the VM won't change even if all machines in the availability set are stopped.

* Temporary setup:   
    Using a PPG or an availability set in combination with a PPG without any pinning.

    SAP HANA capable virtual machine series (that is, M-Series) are mostly placed close to Azure NetApp Files resources so that the application volume group can create the required volumes with lowest possible latency with the help of a PPG. This relationship between volumes and HANA hosts won't change if at least one VM is up and running all the time.

> [!NOTE]
> When you use application volume group to deploy your HANA volumes, at least one VM in the availability set must be started. Without a running VM, the PPG can't be used to find the optimal Azure NetApp files hardware, causing provisioning to fail.

> [!NOTE]
> Do not delete your PPG. Deleting a PPG removes the pinning and can cause subsequent volume groups to be created in sub-optimal locations which could lead to increased latency.

## Next steps

* To use a zonal placement for your database volumes, see [Configuring Azure NetApp Files (ANF) Application Volume Group (AVG) for zonal SAP HANA deployment](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/configuring-azure-netapp-files-anf-application-volume-group-avg/ba-p/3943801)
* [Understand Azure NetApp Files application volume group for SAP HANA](application-volume-group-introduction.md)
* [Deploy the first SAP HANA host using application volume group for SAP HANA](application-volume-group-deploy-first-host.md)
* [Add hosts to a multiple-host SAP HANA system using application volume group for SAP HANA](application-volume-group-add-hosts.md)
* [Add volumes for an SAP HANA system as a secondary database in HSR](application-volume-group-add-volume-secondary.md)
* [Add volumes for an SAP HANA system as a DR system using cross-region replication](application-volume-group-disaster-recovery.md)
* [Manage volumes in an application volume group](application-volume-group-manage-volumes.md)
* [Delete an application volume group](application-volume-group-delete.md)
* [Application volume group FAQs](faq-application-volume-group.md)
* [Troubleshoot application volume group errors](troubleshoot-application-volume-groups.md)
