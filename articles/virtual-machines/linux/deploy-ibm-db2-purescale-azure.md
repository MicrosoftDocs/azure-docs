---
title:  Deploy IBM Db2 pureScale on Azure
description: Learn how to deploy an [example architecture](ibm-db2-purescale-azure.md) used recently to migrate an enterprise from their IBM Db2 environment running on z/OS to IBM Db2 pureScale on Azure.
services: virtual-machines-linux
documentationcenter: ''
author: njray
manager: edprice
editor: edprice
tags: 

ms.assetid: 
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 11/09/2018
ms.author: njray

---

# Deploy IBM Db2 pureScale on Azure

This article describes how to deploy an [example architecture](ibm-db2-purescale-azure.md) used recently to migrate an enterprise from their IBM Db2 environment running on z/OS to IBM Db2 pureScale on Azure.

To follow the steps used during the migration, see the installation scripts in [Db2onAzure](http://aka.ms/db2onazure) repository on GitHub. These scripts are based on the architecture used for a typical, medium-sized online transaction processing (OLTP) workload.

## Get started

To deploy this architecture, download and run the deploy.sh script found in the [Db2onAzure](http://aka.ms/db2onazure) repository on GitHub.

The repository also includes scripts you can use to set up a Grafana dashboard that can be used to query Prometheus, the open-source monitoring and alerting system included with Db2.

> [!NOTE]
> The deploy.sh script on the client creates private SSH keys and passes them to the deployment template over HTTPS. For greater security, we recommend using [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview) to store secrets, keys, and passwords.

## How the deployment script works

The deploy.sh script creates and configures the Azure resources that are used in this architecture. The script prompts you for the Azure subscription and virtual machines used in the target environment, and then performs the following operations:

-   Sets up the resource group, virtual network, and subnets on Azure for the installation.

-   Sets up the NSGs and SSH for the environment.

-   Sets up multiple NICs on both the GlusterFS and the Db2 pureScale virtual machines.

-   Creates the GlusterFS storage virtual machines.

-   Creates the jumpbox virtual machine.

-   Creates the Db2 pureScale virtual machines.

-   Creates the witness virtual machine that Db2 pureScale pings.

-   Creates a Windows virtual machine to use for testing but does not install anything on it.

Next, the deployment scripts set up iSCSI virtual storage area network (vSAN) for shared storage on Azure. In this example, iSCSI connects to GlusterFS. This solution also gives you the option to install the iSCSI targets as a single Windows node. (iSCSI provides a shared block storage interface over TCP/IP that allows the Db2 pureScale setup procedure to use a device interface to connect to shared storage.) For GlusterFS basics, see the [Architecture: Types of volumes](https://docs.gluster.org/en/latest/Quick-Start-Guide/Architecture/) topic in Getting started with GlusterFS.

The deployment scripts execute these general steps:

1.  Set up a shared storage cluster on Azure. GlusterFS is used to set up the shared storage cluster. This involves at least two Linux nodes. For setup details, see [Setting up Red Hat Gluster Storage in Microsoft Azure](https://access.redhat.com/documentation/en-us/red_hat_gluster_storage/3.1/html/deployment_guide_for_public_cloud/chap-documentation-deployment_guide_for_public_cloud-azure-setting_up_rhgs_azure) in the Red Hat Gluster documentation.

2.  Set up an iSCSI Direct interface on target Linux servers for GlusterFS. For setup details, see [GlusterFS iSCSI](https://docs.gluster.org/en/latest/Administrator%20Guide/GlusterFS%20iSCSI/) in the GlusterFS Administration Guide.

3.  Set up the iSCSI Initiator on the Linux virtual machines that will access the GlusterFS cluster using iSCSI Target. For setup details, see the [How To Configure An iSCSI Target And Initiator In Linux](https://www.rootusers.com/how-to-configure-an-iscsi-target-and-initiator-in-linux/) in the RootUsers documentation.

4.  Installs GlusterFS as the storage layer for the iSCSI interface.

After creating the iSCSI device, the final step is to install Db2 pureScale. As part of the Db2 pureScale setup, [IBM Spectrum Scale](https://www.ibm.com/support/knowledgecenter/SSEPGG_11.1.0/com.ibm.db2.luw.qb.server.doc/doc/t0057167.html) (formerly known as GPFS) is compiled and installed on the GlusterFS cluster. This clustered file system enables Db2 pureScale to share data among the multiple virtual machines that run the Db2 pureScale engine. For more information, see the [IBM Spectrum Scale](https://www.ibm.com/support/knowledgecenter/en/STXKQY_4.2.0/ibmspectrumscale42_welcome.html) documentation on the IBM website.

## Db2 pureScale response file

The GitHub repository includes Db2server.rsp, a response (.rsp) file that enables you to generate an automated script for the Db2 pureScale installation. The following table lists the Db2 pureScale options that the response file uses for setup. You can customize the response file as needed for your installation environment.

> [!NOTE]
> A sample response file, Db2server.rsp, is included in the [Db2onAzure](http://aka.ms/db2onazure) repository on GitHub. If you use this file, you must edit it before it can work in your environment.

**Db2 pureScale response file options**

| Screen name               | Field                                        | Value                                                                                                 |
|---------------------------|----------------------------------------------|-------------------------------------------------------------------------------------------------------|
| Welcome                   |                                              | New Install                                                                                           |
| Choose a Product          |                                              | Db2 Version 11.1.3.3. Server Editions with Db2 pureScale                                              |
| Configuration             | Directory                                    | /data1/opt/ibm/db2/V11.1                                                                              |
|                           | Select the installation type                 | Typical                                                                                               |
|                           | I agree to the IBM terms                     | Checked                                                                                               |
| Instance Owner            | Existing User For Instance, User name        | Db2sdin1                                                                                              |
| Fenced User               | Existing User, User name                     | Db2sdfe1                                                                                              |
| Cluster File System       | Shared disk partition device path            | /dev/dm-2                                                                                             |
|                           | Mount point                                  | /Db2sd\_1804a                                                                                         |
|                           | Shared disk for data                         | /dev/dm-1                                                                                             |
|                           | Mount point (Data)                           | /Db2fs/datafs1                                                                                        |
|                           | Shared disk for log                          | /dev/dm-0                                                                                             |
|                           | Mount point (Log)                            | /Db2fs/logfs1                                                                                         |
|                           | Db2 Cluster Services Tiebreaker. Device path | /dev/dm-3                                                                                             |
| Host List                 | d1 [eth1], d2 [eth1], cf1 [eth1], cf2 [eth1] |                                                                                                       |
|                           | Preferred primary CF                         | cf1                                                                                                   |
|                           | Preferred secondary CF                       | cf2                                                                                                   |
| Response File and Summary | first option                                 | Install Db2 Server Edition with the IBM Db2 pureScale feature and save my settings in a response file |
|                           | Response file name                           | /root/DB2server.rsp                                                                                   |

### Notes about this deployment

-   The values for /dev-dm0, /dev-dm1, /dev-dm2, and /dev-dm3 can change after a reboot on the virtual machine where the setup takes place (d0 in the automated script). To find the right values, you can issue the following command before completing the response file on the server where the setup will be run:

```
   [root\@d0 rhel]\# ls -als /dev/mapper
   total 0
   0 drwxr-xr-x 2 root root 140 May 30 11:07 .
   0 drwxr-xr-x 19 root root 4060 May 30 11:31 ..
   0 crw------- 1 root root 10, 236 May 30 11:04 control
   0 lrwxrwxrwx 1 root root 7 May 30 11:07 db2data1 -\> ../dm-1
   0 lrwxrwxrwx 1 root root 7 May 30 11:07 db2log1 -\> ../dm-0
   0 lrwxrwxrwx 1 root root 7 May 30 11:26 db2shared -\> ../dm-2
   0 lrwxrwxrwx 1 root root 7 May 30 11:08 db2tieb -\> ../dm-3
```

-   The setup scripts use aliases for the iSCSI disks so that the actual names can be found easily.

-   When the setup script is run on d0, the **/dev/dm-\*** values may be different on d1, cf0 and cf1. The Db2 pureScale setup does not care.

## Troubleshooting and known issues

The GitHub repo includes a Knowledge Base maintained by the authors. It lists potential issues you may encounter and resolutions you can try. For example, known issues can occur when:

-   Trying to reach the gateway IP address.

-   Compiling GPL.

-   The security handshake between hosts fails.

-   The Db2 installer detects an existing file system.

-   Manually installing GPFS.

-   Installing Db2 pureScale when GPFS is already created.

-   Removing Db2 pureScale and GPFS.

For more information about these and other known issues, see the kb.md file in the [Db2onAzure](http://aka.ms/Db2onAzure) repo.

## Next steps

-   [GlusterFS iSCSI](https://docs.gluster.org/en/latest/Administrator%20Guide/GlusterFS%20iSCSI/)

-   [Creating required users for a Db2 pureScale Feature installation](https://www.ibm.com/support/knowledgecenter/en/SSEPGG_11.1.0/com.ibm.db2.luw.qb.server.doc/doc/t0055374.html?pos=2)

-   [Db2icrt - Create instance command](https://www.ibm.com/support/knowledgecenter/en/SSEPGG_11.1.0/com.ibm.db2.luw.admin.cmd.doc/doc/r0002057.html)

-   [Db2 pureScale Clusters Data Solution](http://www.ibmbigdatahub.com/blog/db2-purescale-clustered-database-solution-part-1)

-   [IBM Data Studio](https://www.ibm.com/developerworks/downloads/im/data/index.html/)

-   [Platform Modernization Alliance: IBM Db2 on Azure](https://www.platformmodernization.org/pages/ibmdb2azure.aspx)

-   [Azure Virtual Data Center Lift and Shift Guide](https://azure.microsoft.com/resources/azure-virtual-datacenter-lift-and-shift-guide/)
