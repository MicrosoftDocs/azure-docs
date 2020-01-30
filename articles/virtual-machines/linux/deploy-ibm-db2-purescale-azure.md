---
title:  Deploy IBM DB2 pureScale on Azure
description: Learn how to deploy an example architecture used recently to migrate an enterprise from its IBM DB2 environment running on z/OS to IBM DB2 pureScale on Azure.
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

ms.topic: article
ms.date: 11/09/2018
ms.author: edprice

---

# Deploy IBM DB2 pureScale on Azure

This article describes how to deploy an [example architecture](ibm-db2-purescale-azure.md) that an enterprise customer recently used to migrate from its IBM DB2 environment running on z/OS to IBM DB2 pureScale on Azure.

To follow the steps used for the migration, see the installation scripts in the [DB2onAzure](https://aka.ms/db2onazure) repository on GitHub. These scripts are based on the architecture for a typical, medium-sized online transaction processing (OLTP) workload.

## Get started

To deploy this architecture, download and run the deploy.sh script found in the [DB2onAzure](https://aka.ms/db2onazure) repository on GitHub.

The repository also has scripts for setting up a Grafana dashboard. You can use the dashboard to query Prometheus, the open-source monitoring and alerting system included with DB2.

> [!NOTE]
> The deploy.sh script on the client creates private SSH keys and passes them to the deployment template over HTTPS. For greater security, we recommend using [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview) to store secrets, keys, and passwords.

## How the deployment script works

The deploy.sh script creates and configures the Azure resources for this architecture. The script prompts you for the Azure subscription and virtual machines used in the target environment, and then performs the following operations:

-   Sets up the resource group, virtual network, and subnets on Azure for the installation.

-   Sets up the network security groups and SSH for the environment.

-   Sets up multiple NICs on both the shared storage and the DB2 pureScale virtual machines.

-   Creates the shared storage virtual machines. If you use Storage Spaces Direct or another storage solution, see [Storage Spaces Direct overview](/windows-server/storage/storage-spaces/storage-spaces-direct-overview).

-   Creates the jumpbox virtual machine.

-   Creates the DB2 pureScale virtual machines.

-   Creates the witness virtual machine that DB2 pureScale pings. Skip this part of the deployment if your version of Db2 pureScale does not require a witness.

-   Creates a Windows virtual machine to use for testing but doesn't install anything on it.

Next, the deployment scripts set up an iSCSI virtual storage area network (vSAN) for shared storage on Azure. In this example, iSCSI connects to the shared storage cluster. In the original customer solution, GlusterFS was used. However, IBM no longer supports this approach. To maintain your support from IBM, you need to use a supported iSCSI-compatible file system. Microsoft offers Storage Spaces Direct (S2D) as an option.

This solution also gives you the option to install the iSCSI targets as a single Windows node. iSCSI provides a shared block storage interface over TCP/IP that allows the DB2 pureScale setup procedure to use a device interface to connect to shared storage.

The deployment scripts run these general steps:

1.  Set up a shared storage cluster on Azure. This step involves at least two Linux nodes.

2.  Set up an iSCSI Direct interface on target Linux servers for the shared storage cluster.

3.  Set up the iSCSI initiator on the Linux virtual machines. The initiator will access the shared storage cluster by using an iSCSI target. For setup details, see [How To Configure An iSCSI Target And Initiator In Linux](https://www.rootusers.com/how-to-configure-an-iscsi-target-and-initiator-in-linux/) in the RootUsers documentation.

4.  Install the shared storage layer for the iSCSI interface.

After the scripts create the iSCSI device, the final step is to install DB2 pureScale. As part of the DB2 pureScale setup, [IBM Spectrum Scale](https://www.ibm.com/support/knowledgecenter/SSEPGG_11.1.0/com.ibm.db2.luw.qb.server.doc/doc/t0057167.html) (formerly known as GPFS) is compiled and installed on the GlusterFS cluster. This clustered file system enables DB2 pureScale to share data among the virtual machines that run the DB2 pureScale engine. For more information, see the [IBM Spectrum Scale](https://www.ibm.com/support/knowledgecenter/en/STXKQY_4.2.0/ibmspectrumscale42_welcome.html) documentation on the IBM website.

## DB2 pureScale response file

The GitHub repository includes DB2server.rsp, a response (.rsp) file that enables you to generate an automated script for the DB2 pureScale installation. The following table lists the DB2 pureScale options that the response file uses for setup. You can customize the response file as needed for your environment.

> [!NOTE]
> A sample response file, DB2server.rsp, is included in the [DB2onAzure](https://aka.ms/db2onazure) repository on GitHub. If you use this file, you must edit it before it can work in your environment.

| Screen name               | Field                                        | Value                                                                                                 |
|---------------------------|----------------------------------------------|-------------------------------------------------------------------------------------------------------|
| Welcome                   |                                              | New Install                                                                                           |
| Choose a Product          |                                              | DB2 Version 11.1.3.3. Server Editions with DB2 pureScale                                              |
| Configuration             | Directory                                    | /data1/opt/ibm/db2/V11.1                                                                              |
|                           | Select the installation type                 | Typical                                                                                               |
|                           | I agree to the IBM terms                     | Checked                                                                                               |
| Instance Owner            | Existing User For Instance, User name        | DB2sdin1                                                                                              |
| Fenced User               | Existing User, User name                     | DB2sdfe1                                                                                              |
| Cluster File System       | Shared disk partition device path            | /dev/dm-2                                                                                             |
|                           | Mount point                                  | /DB2sd\_1804a                                                                                         |
|                           | Shared disk for data                         | /dev/dm-1                                                                                             |
|                           | Mount point (Data)                           | /DB2fs/datafs1                                                                                        |
|                           | Shared disk for log                          | /dev/dm-0                                                                                             |
|                           | Mount point (Log)                            | /DB2fs/logfs1                                                                                         |
|                           | DB2 Cluster Services Tiebreaker. Device path | /dev/dm-3                                                                                             |
| Host List                 | d1 [eth1], d2 [eth1], cf1 [eth1], cf2 [eth1] |                                                                                                       |
|                           | Preferred primary CF                         | cf1                                                                                                   |
|                           | Preferred secondary CF                       | cf2                                                                                                   |
| Response File and Summary | first option                                 | Install DB2 Server Edition with the IBM DB2 pureScale feature and save my settings in a response file |
|                           | Response file name                           | /root/DB2server.rsp                                                                                   |

### Notes about this deployment

- The values for /dev-dm0, /dev-dm1, /dev-dm2, and /dev-dm3 can change after a restart on the virtual machine where the setup takes place (d0 in the automated script). To find the right values, you can issue the following command before completing the response file on the server where the setup will run:

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

- The setup scripts use aliases for the iSCSI disks so that the actual names can be found easily.

- When the setup script is run on d0, the **/dev/dm-\*** values might be different on d1, cf0, and cf1. The difference in values doesn't affect the DB2 pureScale setup.

## Troubleshooting and known issues

The GitHub repo includes a knowledge base that the authors maintain. It lists potential problems you might have and resolutions you can try. For example, known problems can happen when:

-   You're trying to reach the gateway IP address.

-   You're compiling General Public License (GPL).

-   The security handshake between hosts fails.

-   The DB2 installer detects an existing file system.

-   You're manually installing IBM Spectrum Scale.

-   You're installing DB2 pureScale when IBM Spectrum Scale is already created.

-   You're removing DB2 pureScale and IBM Spectrum Scale.

For more information about these and other known problems, see the kb.md file in the [DB2onAzure](https://aka.ms/DB2onAzure) repo.

## Next steps

-   [Creating required users for a DB2 pureScale Feature installation](https://www.ibm.com/support/knowledgecenter/en/SSEPGG_11.1.0/com.ibm.db2.luw.qb.server.doc/doc/t0055374.html?pos=2)

-   [DB2icrt - Create instance command](https://www.ibm.com/support/knowledgecenter/en/SSEPGG_11.1.0/com.ibm.db2.luw.admin.cmd.doc/doc/r0002057.html)

-   [DB2 pureScale Clusters Data Solution](https://www.ibmbigdatahub.com/blog/db2-purescale-clustered-database-solution-part-1)

-   [IBM Data Studio](https://www.ibm.com/developerworks/downloads/im/data/index.html/)

-   [Azure Virtual Data Center Lift and Shift Guide](https://azure.microsoft.com/resources/azure-virtual-datacenter-lift-and-shift-guide/)
