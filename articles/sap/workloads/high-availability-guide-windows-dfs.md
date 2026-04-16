---
title: Use Windows DFS-N to support flexible SAPMNT share creation for SMB-based file shares
description: Learn how to use Windows DFS-N to overcome SAP-related SAPMNT naming limitations for Azure NetApp Files SMB or Azure Files Premium SMB.
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: how-to
ms.date: 04/07/2026
ms.author: stmuelle
author: stmuelle
# Customer intent: As a system administrator managing SAP deployments, I want to configure Windows DFS-N for flexible share creation, so that I can overcome SAPMNT naming limitations and enhance the management of SMB-based file shares in Azure.
---

# Use Windows DFS-N to support flexible SAPMNT share creation for SMB-based file shares

Windows Distributed File System (DFS) is a set of Windows Server technologies that simplify how users access shared files across a network. Distributed File System Namespaces (DFS-N) is a Windows Server role service that groups shared folders on different servers into logically structured namespaces. When you deploy SAP systems on Azure by using Azure NetApp Files Server Message Block (SMB) shares, the SAP Software Provisioning Manager (SWPM) creates a `sapmnt` share name that can exist only once per NetApp account. This limitation prevents you from hosting multiple SAP systems on the same account without a workaround.

With DFS-N, you can create virtual namespace folders that map to uniquely named shares on Azure NetApp Files. Each SAP system gets its own share while SWPM still resolves the expected `\\<domain>\sapmnt\<SID>` path. This approach also works for the SAP global transport directory.

This article describes how to set up DFS-N namespaces and folder targets for SAP SAPMNT shares on Azure NetApp Files SMB volumes.

## Prerequisites

- A Windows Server joined to an Active Directory (AD) domain with the **DFS Namespaces** role installed. To learn more, see [Add or remove roles and features in Windows Server](/windows-server/administration/server-manager/add-remove-roles-features).
- An Azure NetApp Files account with SMB volumes configured for your SAP systems. For more information, see [High availability for SAP NetWeaver on Azure Virtual Machines on Windows with Azure NetApp Files (SMB) for SAP applications](./high-availability-guide-windows-netapp-files-smb.md).
- SWPM for SAP system installation.
- Familiarity with [DFS-N](/windows-server/storage/dfs-namespaces/dfs-overview).

## Understand SAPMNT share limitations

SAP instances such as ASCS/SCS based on Windows Server Failover Clustering require SAP files to be installed on a shared drive. SAP supports either Cluster Shared Disks or a File Share Cluster to host these files.

:::image type="content" source="media/virtual-machines-shared-sap-high-availability-guide/swpm-01.png" alt-text="Screenshot of the SWPM selection screen for Cluster Share configuration option.":::

For installations based on Azure NetApp Files SMB, select the File Share Cluster option. On the next screen, enter the file share host name.

:::image type="content" source="media/virtual-machines-shared-sap-high-availability-guide/swpm-02.png" alt-text="Screenshot of the SWPM selection screen for Cluster Share Host Name configuration.":::

The Cluster Share Host Name is based on the chosen installation option. For Azure NetApp Files SMB, it's used to join the NetApp account to the AD of the installation. In SAP terms, this name is the **SAPGLOBALHOST**. SWPM internally adds `sapmnt` to the host name, which results in the `\\SAPGLOBALHOST\sapmnt` share. Because `sapmnt` can only be created once per NetApp account, you can use DFS-N to create virtual share names that map to differently named shares. Rather than using `sapmnt` as the share name as mandated by SWPM, you can use a unique name such as `sapmnt-sid`. The same approach applies to the global transport directory. Because `trans` is the expected name of the global transport directory, you must adjust the **SAP DIR_TRANS** profile parameter in the **DEFAULT.PFL** profile.

For example, you can create the following shares by using DFS-N:

- `\\contoso.local\sapmnt\D01` pointing to `\\ANF-670f.contoso.corp\d01-sapmnt`
- `\\contoso.local\sapmnt\erp-trans` pointing to `\\ANF-670f.contoso.corp\erp-trans`, with `DIR_TRANS = \\contoso.local\sapmnt\erp-trans` in the **DEFAULT.PFL** profile.

## Set up folder targets for Azure NetApp Files SMB

Folder targets for Azure NetApp Files SMB are volumes that you create the same way as described in the prerequisites, without DFS-N.

:::image type="content" source="media/virtual-machines-shared-sap-high-availability-guide/anf-volumes.png" alt-text="Screenshot of the Azure portal showing existing Azure NetApp Files volumes.":::

## Configure DFS-N for SAPMNT

The following steps show how to initially configure DFS-N.

1. In **Server Manager**, select **Tools**, then select **DFS Management**.

   :::image type="content" source="media/virtual-machines-shared-sap-high-availability-guide/dfs-setup-01.png" alt-text="Screenshot of the DFS Management console opening screen in the setup sequence.":::

1. Select an AD-joined Windows Server with DFS installed.

   :::image type="content" source="media/virtual-machines-shared-sap-high-availability-guide/dfs-setup-07.png" alt-text="Screenshot of the DFS Namespace server selection screen for an AD-joined Windows Server.":::

1. Define the name of the second part of the Namespace root. Enter **sapmnt**, which is part of the SAP naming convention.

   :::image type="content" source="media/virtual-machines-shared-sap-high-availability-guide/dfs-setup-08.png" alt-text="Screenshot of the DFS Namespace share name definition screen with sapmnt as the required value.":::

1. Define the Namespace type. This input also determines the name of the first part of the Namespace root. DFS supports domain-based or stand-alone namespaces. In a Windows-based installation, domain-based is the default, so the setup of the namespace server must be domain-based. Based on this choice, the domain name becomes the first part of the Namespace root. For example, if the AD domain name is `contoso.corp`, the Namespace root is `\\contoso.corp\sapmnt`.

   :::image type="content" source="media/virtual-machines-shared-sap-high-availability-guide/dfs-setup-09.png" alt-text="Screenshot of the DFS Namespace type selection screen for domain-based or stand-alone options.":::

Under the Namespace root, you can create multiple Namespace folders. Each folder points to a Folder Target. While you can choose the name of the Folder Target freely, the name of the Namespace folder must match a valid SAP security ID (SID). This combination creates a valid SWPM-compliant Universal Naming Convention (UNC) share. You can also use this mechanism to create the `trans` directory to provide an SAP transport directory.

:::image type="content" source="media/virtual-machines-shared-sap-high-availability-guide/dfs-setup-11.png" alt-text="Screenshot of the completed DFS setup showing configured SAP namespace folders.":::

## Add DFS namespace servers for increased resiliency

The domain-based Namespace server setup allows you to add extra Namespace servers. Similar to having multiple domain controllers for redundancy in AD where critical information is replicated between the domain controllers, adding extra Namespace servers provides the same redundancy for DFS-N. You can use domain controllers, cluster nodes, or stand-alone domain-joined servers. Before you use any of them, you must install the DFS-N role.

To add a Namespace server, right-click the **Namespace root** and select **Add Namespace Server**.

:::image type="content" source="media/virtual-machines-shared-sap-high-availability-guide/dfs-add-nss-07.png" alt-text="Screenshot of the Add Namespace Server dialog for adding additional DFS-N servers.":::

In this dialog, enter the Namespace server name directly or select **Browse** to view existing servers.

:::image type="content" source="media/virtual-machines-shared-sap-high-availability-guide/dfs-add-nss-08.png" alt-text="Screenshot of the existing DFS Namespace servers overview in the management console.":::

## Add folders to the Azure NetApp Files SMB-based namespace root

The following steps show how to create folders in DFS-N and assign them to Folder Targets.

1. In the DFS Management console, right-click the Namespace root and select **New Folder**.

   :::image type="content" source="media/virtual-machines-shared-sap-high-availability-guide/dfs-add-folder-05.png" alt-text="Screenshot of the DFS-N New Folder dialog for adding a folder to the namespace root.":::

1. In the New Folder dialog, enter a valid SID (for example, **P01**) or enter **trans** to create a transport directory.

1. In the Azure portal, get the mount instructions for the volume you want to use as a folder target. Copy the UNC name and paste it into the folder target path.

   :::image type="content" source="media/virtual-machines-shared-sap-high-availability-guide/dfs-add-folder-04.png" alt-text="Screenshot of the Azure portal showing Azure NetApp Files mount instructions with UNC path.":::

The following screenshot shows an example of the folder setup for an SAP landscape.

:::image type="content" source="media/virtual-machines-shared-sap-high-availability-guide/dfs-add-folder-08.png" alt-text="Screenshot of the folder setup for an SAP landscape in the DFS Management console.":::

## Related content

- [DFS Namespaces overview](/windows-server/storage/dfs-namespaces/dfs-overview)
