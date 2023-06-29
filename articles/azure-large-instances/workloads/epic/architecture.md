---
title: ALI for Epic architecture
description: Provides an overview of ALI for Epic architecture.
ms.topic: conceptual
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: baremetal-infrastructure
ms.date: 06/01/2023
---

# ALI for Epic architecture 

Epic Architecture consists of these tiers: 

* Presentation
* Web and Service
* Reporting, and
* Operational Database  

:::image type="content" source="media/architecture/architecture1.png" alt-text="ALI architecture." lightbox="media/architecture/architecture1.png" border="false":::

Overall architecture can consist of hundreds to thousands of virtual machines. 
Of these only the production Operational Database (ODB) or Production Analytical Database (ADB/Clarity) require the use of Azure Large Instances. 
The ODB and Clarity systems are represented as an ALI workload.  
ODB can have the Epic Production (PRD) or Reporting (RPT) instances deployed, where Clarity is only deployed as the production instance which gets a nightly database extract from RPT.

In order for a workload to be highly available, two compute nodes must be deployed, and you must install a clustering software to enable system and application high availability. Options can be but are not limited to Red Hat Pacemaker, HPE Service Guard, Microsoft Clustering Services.  

Each workload for ALI consists of two compute nodes that can be made highly available through clustering services, each node is connected to a storage cluster through fiber channel and leveraged shared storage between two nodes.  

Connectivity for Azure large instances is made accessible through an Express Route Gateway. 
This Express route Circuit is available to Azure resources. If direct connectivity to the ALI instances is required from on-premise, an Express Route Global Reach Circuit is required.
As such IP space for the ALI instances must not overlap with on-premise or Azure network space.
When the ALI instances are deployed a Proximity Placement Group (PPG) is created. 
This PPG allows Azure VMs to be collocated in proximity to the ALI instances within an Azure Zone.
If an Epic ECP architecture is required all ECP Application servers must be placed into the PPG, as this will ensure the strict Network latency requirements are met.  

Shared Storage is made available to the ALI instances by a highly available NetApp Cluster.
This NetApp cluster is an HA pair of nodes that are accessible through multiple ports connected to Fibre Channel Switches.
In turn each compute node as multiple FC cards and ports to allow for fully redundant connectivity.  
Multiple LUNs will be provisioned by Microsoft, the number of LUNs will depend on the size of the data base and required IOPS.  
Microsoft works with NetApp to follow their Epic Best Practices guide.

In order to snapshot, backup, and meet Epic’s day 2 operational requirements AzAcSnap is leveraged.
AzAcSnap is a Microsoft developed tool kit that allows interaction with the NetApp Storage array.
In order to leverage this appropriately you must implement the appropriate database freeze and thaw operations using the runbefore and runafter commands.
By doing so you will freeze the Epic / IRIS database and be able to take a consistent snapshot.
Snapshots on the ALI NetApp should be transferred out of the ALI environment onto your Azure tenant using NetApp Cloud Volumes ONTAP. Microsoft will work with you to create a SnapMirror relationship from ALI to your CVO instance.
After which the lifecycle and snapshot management are your responsibility.

CVO can be leveraged to create clones of your production database in which you can run integrity checks, sent to Azure Blob or a 3rd party for long term back up retention, and clone the database to meet the support environment requirements.  

If both your Epic Production and Alternate environments are in Azure you will need a mirrored instance of ALI in another region.
Upon setting this up Azure will also configure an Express route connecting the two Azure regions. This network connectivity will allow you configure IRIS mirroring for database replication.
In order to activate DR to a production instance of Epic, you should work with your Epic technical services team to complete all necessary tasks and go through proper activation.

## Next steps

Learn how to identify and interact with ALI instances through the Azure portal.

> [!div class="nextstepaction"]
> [What is Azure for Large Instances?](../../what-is-azure-large-instances.md)


