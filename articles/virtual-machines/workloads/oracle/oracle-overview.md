---
title: Overview of Oracle Applications and solutions on Azure | Microsoft Docs
description: Learn about deploying Oracle Applications and solutions on Azure. Run entirely on Azure infrastructure or use cross-cloud connectivity with OCI.
documentationcenter: ''
author: jjaygbay1
tags: azure-resource-management
ms.assetid: 
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: linux
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 04/10/2023
ms.author: jacobjaygbay
---

# Overview of Oracle Applications and solutions on Azure

**Applies to:** :heavy_check_mark: Linux VMs

In this article, you learn about running Oracle solutions using the Azure infrastructure.

> [!Important]
> Oracle RAC and Oracle RAC OneNode are not supported in Azure Bare Metal Infrastructure.

## Oracle databases on Azure infrastructure
Oracle supports running its Database 12.1 and higher Standard and Enterprise editions in Azure on VM images based on Oracle Linux. You can run Oracle databases on Azure infrastructure using Oracle Database on Oracle Linux images available in the Azure Marketplace. 
- Oracle Database 12.2, and 18.3 Enterprise Edition
- Oracle Database 12.2, and 18.3 Standard Edition
- Oracle Database 19.3      
You can also take one of the following approaches:
- Set up Oracle Database on a non-Oracle Linux image available in Azure.
- Build a solution on a custom image you create from scratch in Azure.
- Upload a custom image from your on-premises environment.

You can also choose to configure your solution with multiple attached disks. You can improve database performance by installing Oracle Automated Storage Management (ASM).
For the best performance for production workloads of Oracle Database on Azure, be sure to properly size the VM image and select the right storage options based on throughput, IOPS & latency. For instructions on how to quickly get an Oracle Database up and running in Azure using the Oracle published VM image, see [Create an Oracle Database](oracle-database-quick-create.md) in an Azure VM.
## Deploy Oracle VM images on Microsoft Azure
This section covers information about Oracle solutions based on virtual machine (VM) images published by Oracle in the Azure Marketplace.
To get a list of currently available Oracle images, run the following command using
Azure CLI or Azure Cloud Shell

``az vm image list --publisher oracle --output table –all``

The images are bring-your-own-license. You're charged only for the costs of compute, storage, and networking incurred running a VM. You can also choose to build your solutions on a custom image that you create from scratch in Azure or upload a custom image from your on-premises environment.  
>[!IMPORTANT]
>You require a proper license to use Oracle software and a current support agreement with Oracle. Oracle has guaranteed license mobility from on-premises to Azure. For more information about license mobility, see the [Oracle and Microsoft Strategic Partnership FAQ](https://www.oracle.com/cloud/azure/interconnect/faq/).

## Applications on Oracle Linux and WebLogic server
Run enterprise applications on WebLogic server in Azure on supported Oracle Linux images. For more information, see the WebLogic documentation,[Oracle WebLogic Server on Azure Solution Overview](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/oracle.oraclelinux-wls-cluster). 

## WebLogic Server with Azure service integrations
Oracle and Microsoft are collaborating to bring WebLogic Server to the Azure Marketplace in the form of Azure Application offering. For more information about these offers, see [What are solutions for running Oracle WebLogic Server](oracle-weblogic.md).

### Oracle WebLogic Server VM images
**Clustering is supported on Enterprise Edition only**. You're licensed to use WebLogic clustering only when you use the Enterprise Edition of Oracle WebLogic Server. Don't use clustering with Oracle WebLogic Server Standard Edition.
**UDP multicast isn't supported**. Azure supports UDP unicasting, but not multicasting or broadcasting. Oracle WebLogic Server can rely on Azure UDP unicast capabilities. For best results relying on UDP unicast, we recommend that the WebLogic cluster size is kept static, or kept with no more than 10 managed servers.
**Oracle WebLogic Server expects public and private ports to be the same for T3 access**. For example, when using Enterprise JavaBeans (EJB). Consider a multi-tier scenario where a service layer application is running on an Oracle WebLogic Server cluster consisting of two or more VMs, in a virtual network named SLWLS. The client tier is in a different subnet in the same virtual network, running a simple Java program trying to call EJB in the service layer. Because you must load balance the service layer, a public load-balanced endpoint needs to be created for the VMs in the Oracle WebLogic Server cluster. If the private port specified is different from the public port an error occurs. For example, if you use ``7006:7008``, the following error occurs because for any remote T3 access, Oracle WebLogic Server expects the load balancer port and the WebLogic managed server port to be the same.

``[java] javax.naming.CommunicationException [Root exception is java.net.ConnectException: t3://example.cloudapp.net:7006:``

``Bootstrap to: example.cloudapp.net/138.91.142.178:7006' over: 't3' got an error or timed out]``

 In the preceding case, the client is accessing port 7006, which is the load balancer port, and the managed server is listening on 7008, which is the private port. This restriction is applicable only for T3 access, not HTTP.

To avoid this issue, use one of the following workarounds:

- Use the same private and public port numbers for load balanced endpoints dedicated to T3 access.
- Include the following JVM parameter when starting Oracle WebLogic Server:
configCopy
``Dweblogic.rjvm.enableprotocolswitch=true``

- Dynamic clustering and load balancing limitations. Suppose you want to   use a dynamic cluster in Oracle WebLogic Server and expose it through a single, public load-balanced endpoint in Azure. This approach can be done as long as you use a fixed port number for each of the managed servers, not dynamically assigned from a range, and don't start more managed servers than there are machines the administrator is tracking. There should be no more than one managed server per VM.
    If your configuration results in more Oracle WebLogic Servers being started than there are VMs, it isn't possible for more than one of those instances of Oracle WebLogic Servers to bind to a given port number. That is, if multiple Oracle WebLogic Server instances share the same virtual machine, the others on that VM fail.
    If you configure the admin server to automatically assign unique port numbers to its managed servers, then load balancing isn't possible because Azure doesn't support mapping from a single public port to multiple private ports, as would be required for this configuration.    
- Multiple instances of Oracle WebLogic Server on a VM. Depending on your deployment requirements, you might consider running multiple instances of Oracle WebLogic Server on the same VM, if the VM is large enough. For example, on a midsize VM, which contains two cores, you could choose to run two instances of Oracle WebLogic Server. However, we still recommend that you avoid introducing single points of failure into your architecture. Running multiple instances of Oracle WebLogic Server on just one VM would be such a single point.

Using at least two VMs could be a better approach. Each VM can run multiple instances of Oracle WebLogic Server. Each instance of Oracle WebLogic Server could still be part of the same cluster. However, it's currently not possible to use Azure to load-balance endpoints that are exposed by such Oracle WebLogic Server deployments within the same VM. Azure Load Balancer requires the load-balanced servers to be distributed among unique VMs.
## High availability and disaster recovery options
 When using Oracle solutions in Azure, you're responsible for implementing a high availability and disaster recovery solution to avoid any downtime.
You can also implement high availability and disaster recovery for Oracle Database Enterprise Edition by using Data Guard, Active Data Guard, or Oracle GoldenGate. The approach requires two databases on two separate VMs, which should be in the same virtual network to ensure they can access each other over the private persistent IP address.

We recommend placing the VMs in the same availability set to allow Azure to place them into separate fault domains and upgrade domains. If you want to have geo-redundancy, set up the two databases to replicate between two different regions and connect the two instances with a VPN Gateway. To walk through the basic setup procedure on Azure, see Implement Oracle Data Guard on an Azure Linux virtual machine.

With Oracle Active Data Guard, you can achieve high availability with a primary database in one VM, a secondary (standby) database in another VM, and one-way replication set up between them. The result is read access to the copy of the database. With Oracle GoldenGate, you can configure bi-directional replication between the two databases. To learn how to set up a high-availability solution for your databases using these tools, see [Active Data Guard and GoldenGate](https://www.oracle.com/docs/tech/database/oow14-con7715-adg-gg-bestpractices.pdf). If you need read-write access to the copy of the database, you can use Oracle Active Data Guard.

To walk through the basic setup procedure on Azure, see [Implement Oracle Golden Gate on an Azure Linux VM](configure-oracle-golden-gate.md).

In addition to having a high availability and disaster recovery solution architected in Azure, you should have a backup strategy in place to restore your database. 
## Backup Oracle workloads
Different [backup strategies](oracle-database-backup-strategies.md) are available for Oracle on Azure VMs, the following backups are other options:
- Using [Azure files](oracle-database-backup-azure-storage.md)
- Using [Azure backup](oracle-database-backup-azure-backup.md) 
- Using [Oracle RMAN Streaming data](oracle-rman-streaming-backup.md) backup
## Deploy Oracle applications on Azure
Use Terraform templates, AZ CLI, or the Azure Portal to set up Azure infrastructure and install Oracle applications. You also use Ansible to configure DB inside the VM. For more information, see [Terraform on Azure](/azure/developer/terraform).

Oracle has certified the following applications to run in Azure when connecting to an Oracle database by using the Azure with Oracle Cloud interconnect solution:
- E-Business Suite
- JD Edwards EnterpriseOne
- PeopleSoft
- Oracle Retail applications
- Oracle Hyperion Financial Management

You can deploy custom applications in Azure that connect with OCI and other Azure services.
## Support for JD Edwards
According to Oracle Support, JD Edwards EnterpriseOne versions 9.2 and above are supported on any public cloud offering that meets their specific Minimum Technical Requirements (MTR). You need to create custom images that meet their MTR specifications for operating system and software application compatibility. For more information, see [Doc ID 2178595.1](https://support.oracle.com/knowledge/JD%20Edwards%20EnterpriseOne/2178595_1.html).
## Licensing
Deployment of Oracle solutions in Azure is based on a bring-your-own-license model. This model assumes that you have licenses to use Oracle software and that you have a current support agreement in place with Oracle. 
Microsoft Azure is an authorized cloud environment for running Oracle Database. The Oracle Core Factor table isn't applicable when licensing Oracle databases in the cloud. For more information, see [Oracle Processor Core Factor Table](https://www.oracle.com/us/corporate/contracts/processor-core-factor-table-070634.pdf). Instead, when using VMs with Hyper-Threading Technology enabled for Enterprise Edition databases, count two vCPUs as equivalent to one Oracle Processor license if hyperthreading is enabled, as stated in the policy document. The policy details can be found at [Licensing Oracle Software in the Cloud Computing Environment](https://www.oracle.com/us/corporate/pricing/cloud-licensing-070579.pdf).  
Oracle databases generally require higher memory and I/O. For this reason, we recommend [Memory Optimized VMs](/azure/virtual-machines/sizes-memory) for these workloads. To optimize your workloads further, we recommend [Constrained Core vCPUs](/azure/virtual-machines/constrained-vcpu) for Oracle Database workloads that require high memory, storage, and I/O bandwidth, but not a high core count.
When you migrate Oracle software and workloads from on-premises to Microsoft Azure, Oracle provides license mobility as stated in [Oracle and Microsoft Strategic Partnership FAQ](https://www.oracle.com/cloud/azure/interconnect/faq/). 
## Next steps
You now have an overview of current Oracle databases and solutions based on VM images in Microsoft Azure. Your next step is to deploy your first Oracle database on Azure.
- [Create an Oracle database on Azure](oracle-database-quick-create.md)
