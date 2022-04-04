---
title: Attach Azure NetApp Files datastores to a private cloud (Private preview)
description: Learn how to create Azure NetApp Files based NSF datastores for Azure VMware Solution private cloud.
ms.topic: how-to
ms.date: 03/24/2022
---

# Attach Azure NetApp Files datastores to a private cloud (Private preview)

## Overview

[Azure VMware Solution](/azure/azure-vmware/introduction) private clouds support attaching Network File System (NFS) datastores, created with [Azure NetApp Files](/azure/azure-netapp-files/azure-netapp-files-introduction?branch=main) volumes, to clusters you choose to create virtual machines (VMs) for optimal cost and performance. 

Azure NetApp Files is an Azure service is an enterprise-class, high-performance, metered file storage service. The service supports the most demanding enterprise file-workloads in the cloud: databases, SAP, and high-performance computing applications, with no code changes. For more information on Azure NetApp Files, see [Azure NetApp Files](/azure/azure-netapp-files) documentation.  

> [!IMPORTANT]
> Azure NetApp Files datastores for Azure VMware Solution (Preview) is currently in public preview. This version is provided without a service-level agreement and is not recommended for production workloads. Some features may not be supported or have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews]().

By using NFS datastores backed by Azure NetApp Files you can expand your storage instead of scaling the clusters. You can also use Azure NetApp Files volumes to replicate data from on-premises or primary VMware environments for the secondary site. 

## Regional road map

## Prerequisites

1.    Deploy Azure VMware Solution private cloud with a [virtual network configured](/azure/azure-vmware/deploy-azure-vmware-solution). For more information, see [Network planning checklist and Configure networking for your VMware private cloud](/azure/azure-vmware/tutorial-network-checklist).
    1. Verify the subscription is registered to Microsoft.AVS.
        `az provider show -n "Microsoft.AVS" -- query registrationState`
    1. If it's not already registered, register it.
        `az provider register -n "Microsoft.AVS"`
1. Create a [Network File System (NFS) volume for Azure NetApp Files](/azure/azure-netapp-files/azure-netapp-files-create-volumes) in the same virtual network as the Azure VMware Solution private cloud. 
    1. Ping the attached target IP to verify connectivity from the private cloud to Azure NetApp Files volume.
    1. Verify the subscription is registered to `ANFAvsDataStore` feature in the **Microsoft.NetApp** namespace to confirm the volume is for Azure VMware Solution NFS datastore.
    1. The registration isn't auto approved. You'll need to send an email to the support DL and provide the subscription ID if it wasn't registered when you signed up for preview.

## Delete an Azure NetApp Files datastore from your private cloud

## Next steps

## FAQs

- **Are there any special permissions required to create the datastore with the Azure NetApp Files volume and attach it onto the clusters in a private cloud?**
    
    No other special permissions are needed. The datastore creation and attachment is implemented via Azure VMware Solution RP.

- **Which NFS versions are supported?**
  
     NFSv3 is supported for datastores on Azure NetApp Files.

- **Should Azure NetApp Files be in the same subscription as the private cloud?** 

    It's recommended to use the Premium or Ultra tier for optimal performance.

- **What latencies and bandwidth can be expected from the datastores backed by Azure NetApp Files?** 

    We are currently validating and working on the benchmarking. However, for Azure NetApp Files volumes with "Basic" network features, the connectivity from Azure VMware Solution is bound by the bandwidth of the ExpressRoute circuit and the ExpressRoute Gateway along with the latency that comes with tat architecture.

