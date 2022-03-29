---
title: Create a cluster
description: 
ms.topic: how-to
ms.subservice:  
ms.date: 03/31/2021
---

# Create a cluster

N

## Next steps

Create a cluster in Azure by using Nutanix Clusters. Your Nutanix cluster is deployed in an 
Azure virtual network (VNet) which is an isolated environment in the cloud provider’s region run 
and maintained by Nutanix.
Perform the following to create a Nutanix cluster in an Azure environment.

1. Log on to Nutanix Clusters from the My Nutanix dashboard.
1. In the Clusters page, do one of the following:
    * If you are creating a cluster for the first time, under **You have no clusters**, click 
**Create Cluster**.  
    * If you have created clusters before, click **Create Cluster** in the top-right corner of the Clusters page.
1. Select one of the following cluster options: 
    * General Purpose 
    * Virtual Desktop Infrastructure (VDI)
1. In the Cloud Provider tab of the Create Cluster dialog box, do the following in the 
indicated fields and then click **Next**:
    * **Organization**. Select the organization in which you want to create the cluster.
    * **Cluster Name**. Type a name for the cluster.
    * **Cloud provider**. Select Azure.
    * **Region**. Select the Azure region in which you want to create the cluster.
1. In the Network and Infrastructure tab, provide the following information in the indicated 
fields:
    * Under the Network section, do one of the following:
        * Click Use an existing VNET to choose an existing Virtual Private Network (VNet) in which you want to create the cluster. Provide the following information:
            * Resource Group. Select a resource group from the drop-down list.
            * Virtual Private Network (VNET). Select a VNet in which you want to create the cluster.
            > [!NOTE]
            > Ensure that you have one private network (subnet) without outward internet access and the VNet you selected has internet connectivity to the portal through an internet gate
            * Management Subnet
        * Click Create New VNET if you want to create a new VNet for this cluster and do not want to use any of your existing Azure virtual networks.
        * > [!NOTE]
          > If you choose to create a new VNet in the Nutanix Clusters console, Nutanix creates a resource group and delegates a management subnet for your cluster.
            * VNET CIDR. Enter a range of IP addresses for the resources deployed in the VNET. (Required)
            * Resource Group. Enter the name of the resource group. (Optional)
            * DNS Server. Enter the list of IP addresses that you want to use as DNS Servers. (Required)
    * Under Cluster Capacity and Redundancy, you can increase or decrease the number of hosts and set the redundancy factor here.
        * Host type. Enter the type of bare metal instance you want your cluster to run on.
        > [!NOTE] 
        > There is only one bare metal instance this release called Azure Nutanix Ready Node.
        * Number of Hosts. Select the number of nodes you want in your cluster.
        * Redundancy Factor. Select one of the following redundancy factors (RF) for your cluster.
            * Number of copies of data replicated across the cluster is 1. Number of nodes for RF1 must be 1.
            * Number of copies of data replicated across the cluster is 2. Minimum number of nodes for RF2 must be 3.
            * Number of copies of data replicated across the cluster is 3. Minimum number of nodes for RF3 must be 5.
        Click Next.
1. In the Nutanix Software Configuration tab, provide the following information in the 
indicated fields:
    * AOS Version. Select the AOS version that you want to use for the cluster.
    * AOS Software Tier. In the Software Tier drop-down list, select the license type (Pro or Ultimate) that you want to apply to your AOS cluster.
    * Click the View Supported Features list to see the available features in each type of license.
    * Check the Use Nutanix Files on this Cluster box, if you want to use files for billing clusters running on Azure.
1. Review your cluster configuration in the Summary page and click Create.
1. Monitor the cluster creation progress in the Clusters page.
When the cluster creation is in progress, the status is Creating. After the cluster is 
created, the status changes to Running.
The Nutanix cluster is deployed in Azure in approximately 40 to 45 minutes. 
After the cluster is created, click the name of the cluster to view the cluster details.





Learn more about Nutanix:

> [!div class="nextstepaction"]
> [About the Public Preview](about-the-public-preview.md)
