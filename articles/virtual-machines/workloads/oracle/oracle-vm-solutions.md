---
title: Oracle solutions on Azure virtual machines | Microsoft Docs
description: Learn about supported configurations and limitations of Oracle virtual machine images on Microsoft Azure.
services: virtual-machines-linux
documentationcenter: ''
author: BorisB2015
manager: gwallace
tags: azure-resource-management

ms.assetid: 
ms.service: virtual-machines-windows

ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 05/12/2020
ms.author: borisb
---
# Oracle VM images and their deployment on Microsoft Azure

This article covers information about Oracle solutions based on virtual machine images published by Oracle in the Azure Marketplace. If you are interested in cross-cloud application solutions with Oracle Cloud Infrastructure, see [Oracle application solutions integrating Microsoft Azure and Oracle Cloud Infrastructure](oracle-oci-overview.md).

To get a list of currently available images, run the following command:

```azurecli-interactive
az vm image list --publisher oracle -o table --all
```

As of May 2020 the following images are available:

```bash
Offer                   Publisher    Sku                     Urn                                                          Version
----------------------  -----------  ----------------------  -----------------------------------------------------------  -------------
oracle-database-19-3    Oracle       oracle-db-19300         Oracle:oracle-database-19-3:oracle-db-19300:19.3.0           19.3.0
Oracle-Database-Ee      Oracle       12.1.0.2                Oracle:Oracle-Database-Ee:12.1.0.2:12.1.20170220             12.1.20170220
Oracle-Database-Ee      Oracle       12.2.0.1                Oracle:Oracle-Database-Ee:12.2.0.1:12.2.20180725             12.2.20180725
Oracle-Database-Ee      Oracle       18.3.0.0                Oracle:Oracle-Database-Ee:18.3.0.0:18.3.20181213             18.3.20181213
Oracle-Database-Se      Oracle       12.1.0.2                Oracle:Oracle-Database-Se:12.1.0.2:12.1.20170220             12.1.20170220
Oracle-Database-Se      Oracle       12.2.0.1                Oracle:Oracle-Database-Se:12.2.0.1:12.2.20180725             12.2.20180725
Oracle-Database-Se      Oracle       18.3.0.0                Oracle:Oracle-Database-Se:18.3.0.0:18.3.20181213             18.3.20181213
Oracle-Linux            Oracle       6.10                    Oracle:Oracle-Linux:6.10:6.10.00                             6.10.00
Oracle-Linux            Oracle       6.8                     Oracle:Oracle-Linux:6.8:6.8.0                                6.8.0
Oracle-Linux            Oracle       6.8                     Oracle:Oracle-Linux:6.8:6.8.20190529                         6.8.20190529
Oracle-Linux            Oracle       6.9                     Oracle:Oracle-Linux:6.9:6.9.0                                6.9.0
Oracle-Linux            Oracle       6.9                     Oracle:Oracle-Linux:6.9:6.9.20190529                         6.9.20190529
Oracle-Linux            Oracle       7.3                     Oracle:Oracle-Linux:7.3:7.3.0                                7.3.0
Oracle-Linux            Oracle       7.3                     Oracle:Oracle-Linux:7.3:7.3.20190529                         7.3.20190529
Oracle-Linux            Oracle       7.4                     Oracle:Oracle-Linux:7.4:7.4.1                                7.4.1
Oracle-Linux            Oracle       7.4                     Oracle:Oracle-Linux:7.4:7.4.20190529                         7.4.20190529
Oracle-Linux            Oracle       7.5                     Oracle:Oracle-Linux:7.5:7.5.1                                7.5.1
Oracle-Linux            Oracle       7.5                     Oracle:Oracle-Linux:7.5:7.5.2                                7.5.2
Oracle-Linux            Oracle       7.5                     Oracle:Oracle-Linux:7.5:7.5.20181207                         7.5.20181207
Oracle-Linux            Oracle       7.5                     Oracle:Oracle-Linux:7.5:7.5.20190529                         7.5.20190529
Oracle-Linux            Oracle       7.6                     Oracle:Oracle-Linux:7.6:7.6.2                                7.6.2
Oracle-Linux            Oracle       7.6                     Oracle:Oracle-Linux:7.6:7.6.3                                7.6.3
Oracle-Linux            Oracle       7.6                     Oracle:Oracle-Linux:7.6:7.6.4                                7.6.4
Oracle-Linux            Oracle       77                      Oracle:Oracle-Linux:77:7.7.1                                 7.7.1
Oracle-Linux            Oracle       77                      Oracle:Oracle-Linux:77:7.7.2                                 7.7.2
Oracle-Linux            Oracle       77                      Oracle:Oracle-Linux:77:7.7.3                                 7.7.3
Oracle-Linux            Oracle       77                      Oracle:Oracle-Linux:77:7.7.4                                 7.7.4
Oracle-Linux            Oracle       77-ci                   Oracle:Oracle-Linux:77-ci:7.7.01                             7.7.01
Oracle-Linux            Oracle       77-ci                   Oracle:Oracle-Linux:77-ci:7.7.02                             7.7.02
Oracle-Linux            Oracle       77-ci                   Oracle:Oracle-Linux:77-ci:7.7.03                             7.7.03
Oracle-Linux            Oracle       8                       Oracle:Oracle-Linux:8:8.0.2                                  8.0.2
Oracle-Linux            Oracle       8-ci                    Oracle:Oracle-Linux:8-ci:8.0.11                              8.0.11
Oracle-Linux            Oracle       81                      Oracle:Oracle-Linux:81:8.1.0                                 8.1.0
Oracle-Linux            Oracle       81-ci                   Oracle:Oracle-Linux:81-ci:8.1.0                              8.1.0
Oracle-Linux            Oracle       ol77-ci-gen2            Oracle:Oracle-Linux:ol77-ci-gen2:7.7.1                       7.7.1
Oracle-Linux            Oracle       ol77-gen2               Oracle:Oracle-Linux:ol77-gen2:7.7.01                         7.7.01
Oracle-WebLogic-Server  Oracle       Oracle-WebLogic-Server  Oracle:Oracle-WebLogic-Server:Oracle-WebLogic-Server:12.1.2  12.1.2
```

These images are considered "Bring Your Own License" and as such you will only be charged for compute, storage, and networking costs incurred by running a VM.  It is assumed you are properly licensed to use Oracle software and that you have a current support agreement in place with Oracle. Oracle has guaranteed license mobility from on-premises to Azure. See the published [Oracle and Microsoft](https://www.oracle.com/technetwork/topics/cloud/faq-1963009.html) note for details on license mobility. 

Individuals can also choose to base their solutions on a custom image they create from scratch in Azure or upload a custom image from their on premises environment.

## Oracle database VM images
Oracle supports running Oracle Database 12.1 and higher Standard and Enterprise editions in Azure on virtual machine images based on Oracle Linux.  For the best performance for production workloads of Oracle Database on Azure, be sure to properly size the VM image and use Premium SSD or Ultra SSD Managed Disks. For instructions on how to quickly get an Oracle Database up and running in Azure using the Oracle published VM image, [try the Oracle Database Quickstart walkthrough](oracle-database-quick-create.md).

### Attached disk configuration options

Attached disks rely on the Azure Blob storage service. Each standard disk is capable of a theoretical maximum of approximately 500 input/output operations per second (IOPS). Our premium disk offering is preferred for high-performance database workloads and can achieve up to 5000 IOps per disk. You can use a single disk if that meets your performance needs. However, you can improve the effective IOPS performance if you use multiple attached disks, spread database data across them, and then use Oracle Automatic Storage Management (ASM). See [Oracle Automatic Storage overview](https://www.oracle.com/technetwork/database/index-100339.html) for more Oracle ASM specific information. For an example of how to install and configure Oracle ASM on a Linux Azure VM, see the [Installing and Configuring Oracle Automated Storage Management](configure-oracle-asm.md) tutorial.

### Shared storage configuration options

Azure NetApp Files was designed to meet the core requirements of running high-performance workloads like databases in the cloud, and provides;
- Azure native shared NFS storage service for running Oracle workloads either through VM native NFS client, or Oracle dNFS
- Scalable performance tiers that reflect the real-world range of IOPS demands
- Low latency
- High availability, high durability and manageability at scale, typically demanded by mission critical enterprise workloads (like SAP and Oracle)
- Fast and efficient backup and recovery, to achieve the most aggressive RTO and RPO SLA’s

These capabilities are possible because Azure NetApp Files is based on NetApp® ONTAP® all-flash systems running within Azure data center environment – as an Azure Native service. The result is an ideal database storage technology that can be provisioned and consumed just like other Azure storage options. See [Azure NetApp Files documentation](https://docs.microsoft.com/azure/azure-netapp-files/) for more information on how to deploy and access Azure NetApp Files NFS volumes. See [Oracle on Azure Deployment Best Practice Guide Using Azure NetApp Files](https://www.netapp.com/us/media/tr-4780.pdf) for best practice recommendations for operating an Oracle database on Azure NetApp Files.


## Licensing Oracle Database & software on Azure
Microsoft Azure is an authorized cloud environment for running Oracle Database. The Oracle Core Factor table is not applicable when licensing Oracle databases in the cloud. Instead, when using VMs with Hyper-Threading Technology enabled for Enterprise Edition databases, count two vCPUs as equivalent to one Oracle Processor license if hyperthreading is enabled (as stated in the policy document). The policy details can be found [here](http://www.oracle.com/us/corporate/pricing/cloud-licensing-070579.pdf).
Oracle databases generally require higher memory and IO. For this reason, [Memory Optimized VMs](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-memory) are recommended for these workloads. To optimize your workloads further, [Constrained Core vCPUs](https://docs.microsoft.com/azure/virtual-machines/linux/constrained-vcpu) are recommended for Oracle Database workloads that require high memory, storage, and I/O bandwidth, but not a high core count.

When migrating Oracle software and workloads from on-premises to Microsoft Azure, Oracle provides license mobility as stated in the [Oracle on Azure FAQ](https://www.oracle.com/cloud/technologies/oracle-azure-faq.html)


## Oracle Real Application Cluster (Oracle RAC)
Oracle Real Application Cluster (Oracle RAC) is designed to mitigate the failure of a single node in an on-premises multi-node cluster configuration. It relies on two on-premises technologies which are not native to hyper-scale public cloud environments: network multi-cast and shared disk. If your database solution requires Oracle RAC in Azure, you need third=party software to enable these technologies. For more information on Oracle RAC, see the [FlashGrid SkyCluster page](https://www.flashgrid.io/oracle-rac-in-azure/).

## High availability and disaster recovery considerations
When using Oracle databases in Azure, you are responsible for implementing a high availability and disaster recovery solution to avoid any downtime. 

High availability and disaster recovery for Oracle Database Enterprise Edition (without relying on Oracle RAC) can be achieved on Azure using [Data Guard, Active Data Guard](https://www.oracle.com/database/technologies/high-availability/dataguard.html), or [Oracle GoldenGate](https://www.oracle.com/technetwork/middleware/goldengate), with two databases on two separate virtual machines. Both virtual machines should be in the same [virtual network](https://azure.microsoft.com/documentation/services/virtual-network/) to ensure they can access each other over the private persistent IP address.  Additionally, we recommend placing the virtual machines in the same availability set to allow Azure to place them into separate fault domains and upgrade domains. Should you want to have geo-redundancy, set up the two databases to replicate between two different regions and connect the two instances with a VPN Gateway.

The tutorial [Implement Oracle Data Guard on Azure](configure-oracle-dataguard.md) walks you through the basic setup procedure on Azure.  

With Oracle Data Guard, high availability can be achieved with a primary database in one virtual machine, a secondary (standby) database in another virtual machine, and one-way replication set up between them. The result is read access to the copy of the database. With Oracle GoldenGate, you can configure bi-directional replication between the two databases. To learn how to set up a high-availability solution for your databases using these tools, see [Active Data Guard](https://www.oracle.com/database/technologies/high-availability/dataguard.html) and [GoldenGate](https://docs.oracle.com/goldengate/1212/gg-winux/index.html) documentation at the Oracle website. If you need read-write access to the copy of the database, you can use [Oracle Active Data Guard](https://www.oracle.com/uk/products/database/options/active-data-guard/overview/index.html).

The tutorial [Implement Oracle GoldenGate on Azure](configure-oracle-golden-gate.md) walks you through the basic setup procedure on Azure.

In addition to having an HA and DR solution architected in Azure, you should have a backup strategy in place to restore your database. The tutorial [Backup and recover an Oracle Database](oracle-backup-recovery.md) walks you through the basic procedure for establishing a consistent backup.


## Support for JD Edwards
According to Oracle Support note [Doc ID 2178595.1](https://support.oracle.com/epmos/faces/DocumentDisplay?_afrLoop=573435677515785&id=2178595.1&_afrWindowMode=0&_adf.ctrl-state=o852dw7d_4), JD Edwards EnterpriseOne versions 9.2 and above are supported on **any public cloud offering** that meets their specific `Minimum Technical Requirements` (MTR).  You need to create custom images that meet their MTR specifications for OS and software application compatibility. 


## Oracle WebLogic Server virtual machine offers

Oracle and Microsoft are collaborating to bring WebLogic Server to the Azure Marketplace in the form of a collection of Azure Application offers.  These offers are described in the article [Oracle WebLogic Server Azure Applications](oracle-weblogic.md).

### Oracle WebLogic Server virtual machine images

* **Clustering is supported on Enterprise Edition only.** You are licensed to use WebLogic clustering only when using the Enterprise Edition of Oracle WebLogic Server. Do not use clustering with Oracle WebLogic Server Standard Edition.
* **UDP multicast is not supported.** Azure supports UDP unicasting, but not multicasting or broadcasting. Oracle WebLogic Server is able to rely on Azure UDP unicast capabilities. For best results relying on UDP unicast, we recommend that the WebLogic cluster size is kept static, or kept with no more than 10 managed servers.
* **Oracle WebLogic Server expects public and private ports to be the same for T3 access (for example, when using Enterprise JavaBeans).** Consider a multi-tier scenario where a service layer (EJB) application is running on a Oracle WebLogic Server cluster consisting of two or more VMs, in a virtual network named *SLWLS*. The client tier is in a different subnet in the same virtual network, running a simple Java program trying to call EJB in the service layer. Because it is necessary to load balance the service layer, a public load-balanced endpoint needs to be created for the virtual machines in the Oracle WebLogic Server cluster. If the private port that you specify is different from the public port (for example, 7006:7008), an error such as the following occurs:

       [java] javax.naming.CommunicationException [Root exception is java.net.ConnectException: t3://example.cloudapp.net:7006:

       Bootstrap to: example.cloudapp.net/138.91.142.178:7006' over: 't3' got an error or timed out]

   This is because for any remote T3 access, Oracle WebLogic Server expects the load balancer port and the WebLogic managed server port to be the same. In the preceding case, the client is accessing port 7006 (the load balancer port) and the managed server is listening on 7008 (the private port). This restriction is applicable only for T3 access, not HTTP.

   To avoid this issue, use one of the following workarounds:

  * Use the same private and public port numbers for load balanced endpoints dedicated to T3 access.
  * Include the following JVM parameter when starting Oracle WebLogic Server:

    ```
    -Dweblogic.rjvm.enableprotocolswitch=true
    ```

For related information, see KB article **860340.1** at <https://support.oracle.com>.

* **Dynamic clustering and load balancing limitations.** Suppose you want to use a dynamic cluster in Oracle WebLogic Server and expose it through a single, public load-balanced endpoint in Azure. This can be done as long as you use a fixed port number for each of the managed servers (not dynamically assigned from a range) and do not start more managed servers than there are machines the administrator is tracking. That is, there is no more than one managed server per virtual machine). If your configuration results in more Oracle WebLogic Servers being started than there are virtual machines (that is, where multiple Oracle WebLogic Server instances share the same virtual machine), then it is not possible for more than one of those instances of Oracle WebLogic Servers to bind to a given port number. The others on that virtual machine fail.

   If you configure the admin server to automatically assign unique port numbers to its managed servers, then load balancing is not possible because Azure does not support mapping from a single public port to multiple private ports, as would be required for this configuration.
* **Multiple instances of Oracle WebLogic Server on a virtual machine.** Depending on your deployment’s requirements, you might consider running multiple instances of Oracle WebLogic Server on the same virtual machine, if the virtual machine is large enough. For example, on a medium size virtual machine, which contains two cores, you could choose to run two instances of Oracle WebLogic Server. However, we still recommend that you avoid introducing single points of failure into your architecture, which would be the case if you used just one virtual machine that is running multiple instances of Oracle WebLogic Server. Using at least two virtual machines could be a better approach, and each virtual machine could then run multiple instances of Oracle WebLogic Server. Each instance of Oracle WebLogic Server could still be part of the same cluster. However, it is currently not possible to use Azure to load-balance endpoints that are exposed by such Oracle WebLogic Server deployments within the same virtual machine, because Azure load balancer requires the load-balanced servers to be distributed among unique virtual machines.

## Oracle JDK virtual machine images
* **JDK 6 and 7 latest updates.** While we recommend using the latest public, supported version of Java (currently Java 8), Azure also makes JDK 6 and 7 images available. This is intended for legacy applications that are not yet ready to be upgraded to JDK 8. While updates to previous JDK images might no longer be available to the general public, given the Microsoft partnership with Oracle, the JDK 6 and 7 images provided by Azure are intended to contain a more recent non-public update that is normally offered by Oracle to only a select group of Oracle’s supported customers. New versions of the JDK images will be made available over time with updated releases of JDK 6 and 7.

   The JDK available in the JDK 6 and 7 images, and the virtual machines and images derived from them, can only be used within Azure.
* **64-bit JDK.** The Oracle WebLogic Server virtual machine images and the Oracle JDK virtual machine images provided by Azure contain the 64-bit versions of both Windows Server and the JDK.

## Next steps
You now have an overview of current Oracle solutions based on virtual machine images in Microsoft Azure. Your next step is to deploy your first Oracle database on Azure.

> [!div class="nextstepaction"]
> [Create an Oracle database on Azure](oracle-database-quick-create.md)
