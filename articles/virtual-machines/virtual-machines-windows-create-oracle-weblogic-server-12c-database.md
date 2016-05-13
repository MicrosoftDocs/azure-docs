<properties
	pageTitle="Oracle WebLogic Server and Database VM | Microsoft Azure"
	description="Create an Oracle WebLogic Server 12c and Oracle Database 12c Azure image running on Windows Server 2012, using Resource Manager deployment model."
	services="virtual-machines-windows"
	authors="bbenz"
	documentationCenter=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows"
	ms.workload="infrastructure-services"
	ms.date="06/22/2015"
	ms.author="bbenz" />

#Create an Oracle WebLogic Server 12c and Oracle Database 12c virtual machine in Azure

This article shows how to create a virtual machine based on a Microsoft-provided Oracle WebLogic Server 12c and Oracle Database 12c image running on Windows Server 2012 in Azure.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] classic deployment model.


##To create an Oracle WebLogic Server 12c and Oracle Database 12c virtual machine in Azure

1. Sign in to the [Azure portal](https://ms.portal.azure.com/).

2.	Click the **Marketplace**, click **Compute**, and then type **Oracle** into the search box.

3.	Select the **Oracle Database 12c and WebLogic Server 12c Standard Edition on Windows Server 2012** or **Oracle Database 12c and WebLogic Server 12c Enterprise Edition on Windows Server 2012** image. Review the information about this image (such as minimum recommended size), and then click **Next**.

4.	Specify a **Host Name** for the virtual machine.

5.	Specify a **User Name** for the virtual machine. Note that this user name is for remotely signing in to the virtual machine; this is not the Oracle database user name.

6.	Specify and confirm a password for the virtual machine, or provide a Secure Shell (SSH) public key.

7.	Choose a **Pricing Tier**.  Note that the recommended pricing tiers are displayed by default. To see all configuration options, click **View all** on the top right.

8. Set the optional configurations as needed. Follow these considerations:

	a. Leave **Storage Account** as-is to create a new storage account with the virtual machine name.

	b. Leave **Availability Set** as **Not Configured**.

	c. Do not add any endpoints at this time.

9.	Choose or create a resource group. For more information, see [Using the Azure portal to manage your Azure resources](../azure-portal/resource-group-portal.md).

10. Choose a **Subscription**.

11. Choose a **Location**.


##To create your database hosted in this virtual machine

Follow the instructions in [Create an Oracle Database 12c virtual machine in Azure](virtual-machines-windows-classic-create-oracle-database.md), beginning with the **To create your database using the Oracle Database 12c virtual machine in Azure** section.

##To configure your Oracle WebLogic Server 12c hosted in this virtual machine
Follow the instructions in [Create an Oracle WebLogic Server 12c virtual machine in Azure](virtual-machines-windows-create-oracle-weblogic-server-12c.md), beginning with the **To configure your Oracle WebLogic Server 12c virtual machine in Azure** section.

##Additional resources
[Miscellaneous considerations for Oracle virtual machine images](virtual-machines-windows-classic-oracle-considerations.md)

[List of Oracle virtual machine images](virtual-machines-linux-classic-oracle-images.md)

[Connecting to Oracle Database from a Java Application](http://docs.oracle.com/cd/E11882_01/appdev.112/e12137/getconn.htm#TDPJD136)

[Oracle WebLogic Server 12c using Linux on Microsoft Azure](http://www.oracle.com/technetwork/middleware/weblogic/learnmore/oracle-weblogic-on-azure-wp-2020930.pdf)

[Oracle Database 2 Day DBA 12c Release 1](http://docs.oracle.com/cd/E16655_01/server.121/e17643/toc.htm)
