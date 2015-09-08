<properties 
	pageTitle="Security Considerations for SQL Server in Azure Virtual Machines"
	description="Provides general guidance for securing SQL Server running in an Azure Virtual Machine."
	services="virtual-machines"
	documentationCenter="na"
	authors="rothja"
	manager="jeffreyg"
	editor="monicar" />
<tags 
	ms.service="virtual-machines"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows-sql-server"
	ms.workload="infrastructure-services"
	ms.date="08/19/2015"
	ms.author="jroth" />

# Security Considerations for SQL Server in Azure Virtual Machines

This topic includes overall security guidelines that help establish secure access to SQL Server instances in an Azure VM. However, in order to ensure better protection to your SQL Server database instances in Azure, we recommend that you implement the traditional on-premises security practices in addition to the security best practices for Azure.

For more information about the SQL Server security practices, see [SQL Server 2008 R2 Security Best Practices - Operational and Administrative Tasks](http://download.microsoft.com/download/1/2/A/12ABE102-4427-4335-B989-5DA579A4D29D/SQL_Server_2008_R2_Security_Best_Practice_Whitepaper.docx)

Azure complies with several industry regulations and standards that can enable you to build a compliant solution with SQL Server running in a Virtual Machine. For information about regulatory compliance with Azure, see [Azure Trust Center](http://azure.microsoft.com/support/trust-center/).

Following is a list of security recommendations that should be considered when configuring and connecting to the instance of SQL Server in an Azure VM.

## Considerations for managing accounts:

- Create a unique local administrator account that is not named **Administrator**.

- Use complex strong passwords for all your accounts. For more information about how to create a strong password, see [Create Strong Passwords](http://go.microsoft.com/fwlink/?LinkId=293596) article in the Safety and Security Center.

- By default, Azure selects Windows Authentication during SQL Server Virtual Machine setup. Therefore, the **SA** login is disabled and a password is assigned by setup. We recommend that the **SA** login should be not be used or enabled. The following are alternative strategies if a SQL Login is desired:
	- Create a SQL account that has **CONTROL SERVER** permissions.
	- If you must use a **SA** login, enable the login and rename it and assign a new password.
	- Both the options that were mentioned earlier require a change the authentication mode to SQL Server and Windows Authentication Mode. For more information, see Change Server Authentication Mode.

- Create a SQL account that has CONTROL SERVER permissions.

- If you must use a SA login, enable the login and rename it and assign a new password.

- Both the options that were mentioned earlier require a change the authentication mode to **SQL Server and Windows Authentication Mode**. For more information, see [Change Server Authentication Mode](https://msdn.microsoft.com/library/ms188670.aspx).

## Considerations for Securing Connections to Azure Virtual Machine:

- Consider using [Azure Virtual Network](../virtual-network/virtual-networks-overview.md) to administer the virtual machines instead of public RDP ports.

- Remove any endpoints on the virtual machine if you do not use them.

- Enable an encrypted connection option for an instance of the SQL Server Database Engine in Azure Virtual Machines. Configure SQL server instance with a signed certificate. For more information, see [Enable Encrypted Connections to the Database Engine](https://msdn.microsoft.com/library/ms191192.aspx) and [Connection String Syntax](https://msdn.microsoft.com/library/ms254500.aspx).

- If your virtual machines should be accessed only from a specific network, use Windows Firewall to restrict access to certain IP addresses or network subnets. You can also consider adding an ACL on your endpoint to restrict traffic only to the clients you permit. For instructions on using ACLs with endpoints, see [Manage the ACL on an endpoint](virtual-machines-set-up-endpoints.md#manage-the-acl-on-an-endpoint)

## Next Steps

If you are also interested in best practices around performance, see [Performance Best Practices for SQL Server in Azure Virtual Machines](virtual-machines-sql-server-performance-best-practices.md).

For other topics related to running SQL Server in Azure VMs, see [SQL Server on Azure Virtual Machines overview](virtual-machines-sql-server-infrastructure-services.md).

