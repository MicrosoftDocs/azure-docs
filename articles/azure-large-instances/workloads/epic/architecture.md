---
title: ALI for the Epic workload architecture
description: Provides an overview of ALI for Epic architecture.
ms.topic: conceptual
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: azure-large-instances
ms.date: 06/01/2023
---

# ALI for the Epic workload architecture 
This article provides an overview of ALI for the Epic <sup>®</sup> workload architecture.

The Epic workload architecture consists of the following tiers: 

* Presentation
* Web and Service
* Reporting, and
* Operational Database  

:::image type="content" source="media/architecture/architecture1.png" alt-text="ALI architecture." lightbox="media/architecture/architecture1.png" border="false":::

Overall architecture can consist of hundreds to thousands of virtual machines. However, only the production Operational Database (ODB) or Production Analytical Database (ADB/Clarity) require the use of Azure Large Instances.
 
The ODB and Clarity systems are represented as an ALI workload.  
ODB can have the Epic workload Production (PRD) or Reporting (RPT) instances deployed, where Clarity is only deployed as the production instance that gets a nightly database extract from RPT.

For a workload to be highly available, two compute nodes must be deployed, and you must also install a clustering software to enable system and application high availability. Other options include: 
- Red Hat Pacemaker
- HPE Service Guard 
- Microsoft Clustering Services  

Each workload for ALI consists of two compute nodes that can be made highly available through clustering services. Each node is connected to a storage cluster through fiber channel that use shared storage between two nodes.  

Connectivity for Azure large instances is made accessible through an Express Route Gateway. 
This Express route Circuit is available to Azure resources. If you require a direct connectivity to an instance of ALI from on-premises, an Express Route Global Reach Circuit is required.
As such IP space for the ALI instances must not overlap with on-premises or Azure network space.
When the ALI instances are deployed a Proximity Placement Group (PPG) is created. 
This PPG allows Azure VMs to be collocated in proximity to the ALI instances within an Azure Zone.
If an Epic workload ECP architecture is required, all ECP Application servers must be placed into the PPG, as this will ensure the strict Network latency requirements are met.  

Shared Storage is made available to the ALI instances by a highly available NetApp Cluster.
This NetApp cluster is an HA pair of nodes that are accessible through multiple ports connected to Fibre Channel Switches.
In turn each compute node as multiple FC cards and ports to allow for fully redundant connectivity.  
Multiple LUNs will be provisioned by Microsoft, the number of LUNs depend on the size of the data base and required IOPS.  

Use AzAcSnap to snapshot, backup, and meet the Epic workload day two operational requirements.
AzAcSnap is a Microsoft developed tool kit that allows interaction with the NetApp Storage array.
In order to use this appropriately, you must implement the appropriate database freeze and thaw operations using the ``runbefore`` and run after commands.
By doing so you'll freeze the Epic workload or IRIS database to take a consistent snapshot.
Snapshots on the ALI NetApp should be transferred out of the ALI environment onto your Azure tenant using NetApp Cloud Volumes ONTAP. Microsoft works with you to create a SnapMirror relationship from ALI to your CVO instance. After creating the SnapMirror, you are responsible for lifecycle and snapshot management.

You can apply CVO to create clones of the production database where you can run integrity checks, send to Azure Blob or a third-party database for long term backup retention, and clone the database to meet the support environment requirements.  

If both your Epic workload production and alternate environments are in Azure, you'll need a mirrored instance of ALI in another region.
Upon setting this up Azure will also configure an Express route connecting the two Azure regions. This network connectivity allows you configure IRIS mirroring for database replication.
To activate DR to a production instance of the Epic workload, you should work with your Epic technical services team to complete all necessary tasks and go through proper activation.





