---
title: Security Considerations for SQL Server in Azure | Microsoft Docs
description: This topic provides general guidance for securing SQL Server running in an Azure Virtual Machine.
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
manager: craigg
editor: ''
tags: azure-service-management

ms.assetid: d710c296-e490-43e7-8ca9-8932586b71da
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 03/23/2018
ms.author: mathoma
ms.reviewer: jroth
---
# Security Considerations for SQL Server in Azure Virtual Machines

This topic includes overall security guidelines that help establish secure access to SQL Server instances in an Azure virtual machine (VM).

Azure complies with several industry regulations and standards that can enable you to build a compliant solution with SQL Server running in a virtual machine. For information about regulatory compliance with Azure, see [Azure Trust Center](https://azure.microsoft.com/support/trust-center/).

[!INCLUDE [learn-about-deployment-models](../../../../includes/learn-about-deployment-models-both-include.md)]

## Control access to the SQL VM

When you create your SQL Server virtual machine, consider how to carefully control who has access to the machine and to SQL Server. In general, you should do the following:

- Restrict access to SQL Server to only the applications and clients that need it.
- Follow best practices for managing user accounts and passwords.

The following sections provide suggestions on thinking through these points.

## Secure connections

When you create a SQL Server virtual machine with a gallery image, the **SQL Server Connectivity** option gives you the choice of **Local (inside VM)**, **Private (within Virtual Network)**, or **Public (Internet)**.

![SQL Server connectivity](./media/virtual-machines-windows-sql-security/sql-vm-connectivity-option.png)

For the best security, choose the most restrictive option for your scenario. For example, if you are running an application that accesses SQL Server on the same VM, then **Local** is the most secure choice. If you are running an Azure application that requires access to the SQL Server, then **Private** secures communication to SQL Server only within the specified [Azure Virtual Network](../../../virtual-network/virtual-networks-overview.md). If you require **Public** (internet) access to the SQL Server VM, then make sure to follow other best practices in this topic to reduce your attack surface area.

The selected options in the portal use inbound security rules on the VM's [network security group](../../../virtual-network/security-overview.md) (NSG) to allow or deny network traffic to your virtual machine. You can modify or create new inbound NSG rules to allow traffic to the SQL Server port (default 1433). You can also specify specific IP addresses that are allowed to communicate over this port.

![Network security group rules](./media/virtual-machines-windows-sql-security/sql-vm-network-security-group-rules.png)

In addition to NSG rules to restrict network traffic, you can also use the Windows Firewall on the virtual machine.

If you are using endpoints with the classic deployment model, remove any endpoints on the virtual machine if you do not use them. For instructions on using ACLs with endpoints, see [Manage the ACL on an endpoint](/previous-versions/azure/virtual-machines/windows/classic/setup-endpoints#manage-the-acl-on-an-endpoint). This is not necessary for VMs that use the Resource Manager.

Finally, consider enabling encrypted connections for the instance of the SQL Server Database Engine in your Azure virtual machine. Configure SQL server instance with a signed certificate. For more information, see [Enable Encrypted Connections to the Database Engine](https://docs.microsoft.com/sql/database-engine/configure-windows/enable-encrypted-connections-to-the-database-engine) and [Connection String Syntax](https://msdn.microsoft.com/library/ms254500.aspx).

## Use a non-default port

By default, SQL Server listens on a well-known port, 1433. For increased security, configure SQL Server to listen on a non-default port, such as 1401. If you provision a SQL Server gallery image in the Azure portal, you can specify this port in the **SQL Server settings** blade.

[!INCLUDE [windows-virtual-machines-sql-use-new-management-blade](../../../../includes/windows-virtual-machines-sql-new-resource.md)]

To configure this after provisioning, you have two options:

- For Resource Manager VMs, you can select **Security** from the [SQL virtual machines resource](virtual-machines-windows-sql-manage-portal.md#access-sql-virtual-machine-resource). This provides an option to change the port.

  ![TCP port change in portal](./media/virtual-machines-windows-sql-security/sql-vm-change-tcp-port.png)

- For Classic VMs or for SQL Server VMs that were not provisioned with the portal, you can manually configure the port by connecting remotely to the VM. For the configuration steps, see [Configure a Server to Listen on a Specific TCP Port](https://docs.microsoft.com/sql/database-engine/configure-windows/configure-a-server-to-listen-on-a-specific-tcp-port). If you use this manual technique, you also need to add a Windows Firewall rule to allow incoming traffic on that TCP port.

> [!IMPORTANT]
> Specifying a non-default port is a good idea if your SQL Server port is open to public internet connections.

When SQL Server is listening on a non-default port, you must specify the port when you connect. For example, consider a scenario where the server IP address is 13.55.255.255 and SQL Server is listening on port 1401. To connect to SQL Server, you would specify `13.55.255.255,1401` in the connection string.

## Manage accounts

You don't want attackers to easily guess account names or passwords. Use the following tips to help:

- Create a unique local administrator account that is not named **Administrator**.

- Use complex strong passwords for all your accounts. For more information about how to create a strong password, see [Create a strong password](https://support.microsoft.com/instantanswers/9bd5223b-efbe-aa95-b15a-2fb37bef637d/create-a-strong-password) article.

- By default, Azure selects Windows Authentication during SQL Server Virtual Machine setup. Therefore, the **SA** login is disabled and a password is assigned by setup. We recommend that the **SA** login should not be used or enabled. If you must have a SQL login, use one of the following strategies:

  - Create a SQL account with a unique name that has **sysadmin** membership. You can do this from the portal by enabling **SQL Authentication** during provisioning.

    > [!TIP] 
    > If you do not enable SQL Authentication during provisioning, you must manually change the authentication mode to **SQL Server and Windows Authentication Mode**. For more information, see [Change Server Authentication Mode](https://docs.microsoft.com/sql/database-engine/configure-windows/change-server-authentication-mode).

  - If you must use the **SA** login, enable the login after provisioning and assign a new strong password.

## Follow on-premises best practices

In addition to the practices described in this topic, we recommend that you review and implement the traditional on-premises security practices where applicable. For more information, see [Security Considerations for a SQL Server Installation](https://docs.microsoft.com/sql/sql-server/install/security-considerations-for-a-sql-server-installation)

## Next Steps

If you are also interested in best practices around performance, see [Performance Best Practices for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-performance.md).

For other topics related to running SQL Server in Azure VMs, see [SQL Server on Azure Virtual Machines overview](virtual-machines-windows-sql-server-iaas-overview.md). If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](virtual-machines-windows-sql-server-iaas-faq.md).

