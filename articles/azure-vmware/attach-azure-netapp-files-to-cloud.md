---
title: Attach Azure NetApp Files datastores to a private cloud (Private preview)
description: Learn how to create NSF datastores with Azure NetApp Files and Azure VMware Solution private cloud.
ms.topic: how-to
ms.date: 03/24/2022
---

# Attach Azure NetApp Files datastores to a private cloud (Private preview)

## Overview

[Azure VMware Solution](/azure/azure-vmware/introduction) private clouds support attaching Network File System (NFS) datastores, backed by Azure NetApp Files volumes, on clusters you choose to create virtual machines (VMs) for optimal cost and performance. 

Azure NetApp Files is an Azure service is an enterprise-class, high-performance, metered file storage service. The service supports the most demanding enterprise file-workloads in the cloud: databases, SAP, and high-performance computing applications, with no code changes. For more information on Azure NetApp Files, see [Azure NetApp Files](/azure/azure-netapp-files) documentation.  

By using NFS datastores backed by Azure NetApp Files you can expand your storage instead of scaling the clusters. You can also use Azure NetApp Files volumes to replicate data from on-premises or primary VMware environments for the secondary site. 

> [!IMPORTANT]
> Azure NetApp Files datastores for Azure VMware Solution (Preview) is currently in public preview. This version is provided without a service-level agreement and is not recommended for production workloads. Some features may not be supported or have constrained capabilities. For more information, see Supplemental Terms of Use for Microsoft Azure Previews.

## Regional road map

## Prerequisites

1.    Azure VMware Solution private cloud deployed with a [virtual network configured](/azure/azure-vmware/deploy-azure-vmware-solution). For more information, see [Network planning checklist and Configure networking for your VMware private cloud](/azure/azure-vmware/tutorial-network-checklist).
    a. Verify the subscription is registered to Microsoft.AVS 
    `az provider show -n "Microsoft.AVS" -- query registrationState`
    b. If it's not already registered, register it.
        `az provider register -n "Microsoft.AVS"`
1. Create a [Network File System (NFS) volume for Azure NetApp Files](/azure/azure-netapp-files/azure-netapp-files-create-volumes) in the same virtual network as the Azure VMware Solution private cloud.

## Delete an Azure NetApp Files datastore from your private cloud

## Next steps
