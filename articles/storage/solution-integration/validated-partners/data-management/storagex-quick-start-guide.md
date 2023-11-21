---
title: Analyze and migrate your file data to Azure with Data Dynamics StorageX
titleSuffix: Azure Storage
description: Getting started guide to implement Data Dynamics StorageX. Guide shows how to migrate your data to Azure Files, Azure NetApp Files, Azure Blob Storage, or any available ISV NAS solution 
author: dukicn
ms.author: nikoduki
ms.date: 06/15/2021
ms.topic: conceptual
ms.service: azure-storage
ms.subservice: storage-partner-integration
---

# Migrate data to Azure with Data Dynamics StorageX

This article helps you deploy Data Dynamics StorageX in Microsoft Azure. We introduce key concepts around how StorageX works, deployment prerequisites, installation process, and how-tos for operational guidance. For more in-depth information, visit [Data Dynamics Customer Portal](https://ddsupport.datadynamicsinc.com/).

 StorageX is a Unified Unstructured Data Management platform that allows analyzing, managing, and moving data across heterogenous storage environments. Basic capabilities are:
- Data Movement capabilities
    - NAS to NAS (with or without Analysis)
    - NAS to Object replication
    - NAS to Object archive
- Duplicate file check report
- Open shares report
- File Meta Data Analysis with custom tagging
  
You can find more functionalities on StorageX, and comparison with similar tools in our [comparison table](./migration-tools-comparison.md).

This document covers three major topics:
- Process for deploying the StorageX offering in Azure environment,
- Basic steps for adding file and cloud storage resources to StorageX,
- Creating Data Movement Policies.

## Reference architecture

The following diagram provides a reference architecture for on-premises to Azure and in-Azure deployments of StorageX.

:::image type="content" source="./media/storagex-quick-start-guide/storagex-architecture.png" alt-text="Diagram that shows reference architecture for StorageX implementation":::

## StorageX interoperability matrix

| Feature | SMB | NFS | Notes |
| ------- |--- | --- | --- |
| **Migration** | SMB to SMB | NFSv3 to NFSv3 | Can be combined for multi-protocol |
| **File-to-object archive** | SMB to Azure Blob Storage | NFSv3 to Azure Blob Storage | Archive data to optimize cost |
| **File-to-object replication** | SMB to Azure Blob Storage | NFSv3 to Azure Blob Storage | Replicate data to increase protection |

## Before you begin

Upfront planning will ease the migration and reduce the risks. Some of tips to ease the migration are:

- Gather data on the source and targets services,
- Make sure you have a list of your connectivity points and all necessary network ports.
- Your StorageX server in Azure will need to be part of your Active Directory infrastructure. Ensure you engage an administrator with Active Directory privileges to add the server to Active Directory.
- For easier implementation use [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=Overview).

### Get started with Azure

Microsoft offers a framework to follow to get you started with Azure. The [Cloud Adoption Framework](/azure/architecture/cloud-adoption/) (CAF) is a detailed approach to enterprise digital transformation and comprehensive guide to planning a production grade cloud adoption. The CAF includes a step-by-step [Azure setup guide](/azure/cloud-adoption-framework/ready/azure-setup-guide/) to help you get up and running quickly and securely. You can find an interactive version in the [Azure portal](https://portal.azure.com/?feature.quickstart=true#blade/Microsoft_Azure_Resources/QuickstartCenterBlade). You'll find sample architectures, specific best practices for deploying applications, and free training resources to put you on the path to Azure expertise.

### Considerations for migrations

Several aspects are important when considering migrations of file data to Azure. Before proceeding learn more:

- [Storage migration overview](../../../common/storage-migration-overview.md)
- latest supported features by Data Dynamics StorageX in [migration tools comparison matrix](./migration-tools-comparison.md).

Remember, you'll require enough network capacity to support migrations without impacting production applications. This section outlines the tools and techniques that are available to assess your network needs.

#### Determine unutilized internet bandwidth

It's important to know how much typically unutilized bandwidth (or *headroom*) you have available on a day-to-day basis. To help you assess whether you can meet your goals for:

- initial time for migrations when you're not using Azure Data Box for offline method
- time required to do incremental resync before final switch-over to the target file service

Use the following methods to identify the bandwidth headroom to Azure that is free to consume.

- If you're an existing Azure ExpressRoute customer, view your [circuit usage](../../../../expressroute/expressroute-monitoring-metrics-alerts.md#circuits-metrics) in the Azure portal.
- Contact your ISP and request reports to show your existing daily and monthly utilization.
- There are several tools that can measure utilization by monitoring your network traffic at the router/switch level:
  - [SolarWinds Bandwidth Analyzer Pack](https://www.solarwinds.com/network-bandwidth-analyzer-pack?CMP=ORG-BLG-DNS)
  - [Paessler PRTG](https://www.paessler.com/bandwidth_monitoring)
  - [Cisco Network Assistant](https://www.cisco.com/c/en/us/products/cloud-systems-management/network-assistant/index.html)
  - [WhatsUp Gold](https://www.whatsupgold.com/network-traffic-monitoring)

#### Creating a StorageX service account

For SMB migrations, service account to run the StorageX services is recommended. Service account enables access to be traced for support reasons, while giving the proper privileges to grant full access.

The process that runs data movement policies on the StorageX universal data engines uses the StorageX service account. Account must have all necessary privileges assigned to it in the Active Directory domain.

You can create an account like domain administrator if allowed in your environment. Recommended approach is to grant permissions directly on the NAS server. To do the latter, place the service account in the Administrators and Backup operators groups.

The StorageX service account requires the following privileges:

- SeServiceLogonRight
- SeSecurityPrivilege 
- SeBackupPrivilege 
- SeRestorePrivilege 
- SeAuditPrivilege
- SeInteractiveLogonRight

NFS access requires an export rule for the IP of the StorageX server, and grant access for RW and root. For example, "root=10.2.3.12, rw=10.2.3.12", where 10.2.3.12 is the StorageX server IP address.

## Deployment guide

This section provides guidance on how to deploy a StorageX server, and other StorageX components in your Azure environment.

Before implementation starts, several prerequisites are important:

- Target storage service must be identified and created,
- Make sure you have the proper ports open to access the storage services. You can use Microsoft’s [portqryui](https://www.microsoft.com/download/details.aspx?id=24009) tool to verify necessary ports are open.

You can learn more here:

- How to create [Azure File Share](../../../files/storage-how-to-create-file-share.md)
- How to create an [SMB volume](../../../../azure-netapp-files/azure-netapp-files-create-volumes-smb.md) or [NFS export](../../../../azure-netapp-files/azure-netapp-files-create-volumes.md) in Azure NetApp Files

Any SMB migrations require Active Directory to be properly set up before adding any resources. We will be using an existing Azure NetApp Files implementation with new volume for migration target. Before we can create a new Azure NetApp Files volume, we need to:

- [Create Azure NetApp Files account](../../../../azure-netapp-files/azure-netapp-files-quickstart-set-up-account-create-volumes.md?tabs=azure-portal#create-a-netapp-account)
- [Create Capacity Pool](../../../../azure-netapp-files/azure-netapp-files-quickstart-set-up-account-create-volumes.md?tabs=azure-portal#create-a-capacity-pool)
- [Join Azure NetApp Files account to Active Directory Domain](../../../../azure-netapp-files/create-active-directory-connections.md)

Once the configuration for Azure NetApp Files is done, we can create a share we will use for migration. 

1. Navigate to existing Azure NetApp Files account, and select **Volumes**. Select **Add volume**. Give it a name, select capacity pool and networking setup.

    :::image type="content" source="./media/storagex-quick-start-guide/anf-create-volume-1.png" alt-text="Screenshot for adding new Azure NetApp Files volume":::

1. Select **SMB** protocol, select existing Active Directory connection, and provide a **Share name**.

    :::image type="content" source="./media/storagex-quick-start-guide/anf-create-volume-2.png" alt-text="Screenshot for SMB properties in Azure NetApp Files volume":::

1. Add **Tags** if you use them, and **Create** a share.

    Once the volume has been created, we can proceed with StorageX deployment.

1.	Deploy the Data Dynamics Data Movement and Mobility offering in Azure. Recommended approach is using [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/datadynamicsinc1581991927942.vm_4?tab=Overview). Add the deployed server into your Active Directory domain.
1.	On the deployed server, verify that all required network ports are open.
1.	Run the StorageX installation script. Installation script is available on the desktop when you log in to your deployed server in Azure. 
    All installation files and output logs are located in the folder **C:\ProgramData\data Dynamics\StorageX**. Within that folder, the **InstallationFiles** subfolder contains the zipped source installation files, while the **SilentInstaller-DD** folder contains the configuration XML files and installation logs.

    By default, the installation script deploys the following services:

    - StorageX
    - StorageX API
    - StorageX Processing Engine
    - StorageX Universal Data Engine
    - StorageX File Recovery
    - Elasticsearch
    - Microsoft SQL Express
    - Microsoft SQL Management Studio
    - Kibana
    - Any supporting software (for example, Java)

    The installation script has an XML configuration file where these different services can be customized, but we do not recommend manually modifying the configuration.

    To install, right-click the **StorageXPOCSilentInstaller - Shortcut** on the Desktop and select **Run as administrator**. After the installation starts, you will be asked for the StorageX service account and the password for that account.

    :::image type="content" source="./media/storagex-quick-start-guide/storagex-cli-1.jpg" alt-text="Screenshot of installation CLI":::

    Installation script will continue installing all the services. When the installation process is finished, you will see the message on the command-line interface.

    :::image type="content" source="./media/storagex-quick-start-guide/storagex-cli-2.jpg" alt-text="Screenshot that shows finished installation":::

    StorageX will start automatically.

## Migration guide

Once the installation finishes, and all services are started, we can start migration process.

1.	Open the StorageX Console.
1.	Click the **Storage Resources** tab.
1.	In the **My Resources** view, add your NAS devices or storage services, called **storage resources** in StorageX. You can add different types:
    - **Add file storage resource** for on-premises NAS devices, Windows file server, Azure NetApp Files, or generic file servers,
    - **Add object storage resource** for S3 or Azure Blob Storage (including Azure Files service),
    - **Add DFS namespace** for DFS file servers.

    Select **Add file storage resource** to start the wizard of adding Azure NetApp Files migration target.

    :::image type="content" source="./media/storagex-quick-start-guide/storagex-add-resource-1.png" alt-text="Screenshot for adding new resource to StorageX deployment":::

1. Select **Generic CIFS** for CIFS and SMB migrations.

    :::image type="content" source="./media/storagex-quick-start-guide/storagex-add-resource-2.png" alt-text="Screenshot for adding Generic CIFS resource to StorageX deployment":::

1. Browse to find Azure NetApp Files computer account. Azure NetApp Files computer account was created when it was added to Active Directory Domain.
   
    :::image type="content" source="./media/storagex-quick-start-guide/storagex-add-resource-3.png" alt-text="Screenshot for adding Azure NetApp Files computer account":::

    **Finish** the wizard, and verify the account has been added, and contains the share we created.

    :::image type="content" source="./media/storagex-quick-start-guide/storagex-add-resource-4.png" alt-text="Screenshot for browsing the added resources":::

    Every source, and target must be added as a separate resource. Example shows adding Azure NetApp Files share, and it can be slightly different for other services.

1.	Click the **Data Movement** tab.

1.	In the tree pane, right-click the folder where you want to create the new policy and select **Phased Migration Policy**.

1.	Follow the steps in the wizard to create a Phased Migration policy. Select appropriate **Source** and **Destination** targets.

    :::image type="content" source="./media/storagex-quick-start-guide/storagex-migration-1.png" alt-text="Screenshot for selecting proper source and destination targets":::

1. Provide a name and description for the policy and **Finish** the wizard.

1.	Right-click the new policy and select **Run** to run a test migration. We recommend checking the security configuration on multiple files on the source resource to verify necessary permissions have been provided.

    :::image type="content" source="./media/storagex-quick-start-guide/storagex-migration-2.png" alt-text="Screenshot for running a defined policy":::

1. Check the status of the policy to make sure initial migration has run successfully. 

## Support

If issues occur, Microsoft and Data Dynamics can provide help using regular support channels. Contact Microsoft for infrastructure issues or with any Azure service. Contact Data Dynamics for issues tied to Data Dynamics StorageX installation.

### How to open a case with Azure

In the [Azure portal](https://portal.azure.com) search for support in the search bar at the top. Select **Help + support** -> **New Support Request**.

### How to open a case with Data Dynamics	

Go to the [Data Dynamics Support Portal](https://ddsupport.datadynamicsinc.com/). If you have not registered, provide your email address, and our Support team will create an account for you. Once you have signed in, open a user request. If you have already opened an Azure support case, note support request number when creating the request.	

## Next steps

Various resources are available to learn more:	Various resources are available to learn more:

- [Storage migration overview](../../../common/storage-migration-overview.md)	- [Storage migration overview](../../../common/storage-migration-overview.md)
- Features supported by Data Dynamics StorageX in [migration tools comparison matrix](./migration-tools-comparison.md)	- Features supported by Data Dynamics StorageX in [migration tools comparison matrix](./migration-tools-comparison.md)
- [Data Dynamics](https://www.datadynamicsinc.com/)	- [Data Dynamics](https://ddsupport.datadynamicsinc.com/)
- [Data Dynamics Customer Portal](https://ddsupport.datadynamicsinc.com/) contains full documentation for StorageX
