<properties title="Creating an Oracle WebLogic Server 12c and Oracle Database 12c Virtual Machine in Azure" pageTitle="Creating an Oracle WebLogic Server 12c and Oracle Database 12c Virtual Machine in Azure" description="Step through an example of creating an Oracle WebLogic Server 12c and Oracle Database 12c image running on Windows Server 2012 in Microsoft Azure." services="virtual-machines" authors="bbenz" documentationCenter=""/>
<tags ms.service="virtual-machines" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="infrastructure-services" ms.date="06/22/2015" ms.author="bbenz" />
#Creating an Oracle WebLogic Server 12c and Oracle Database 12c Virtual Machine in Azure
The following example shows you how you can create a Virtual Machine based on a Microsoft-provided Oracle WebLogic Server 12c and Oracle Database 12c image running on Windows Server 2012 in Azure.

##To create an Oracle WebLogic Server 12c and Oracle Database 12c Virtual Machine in Azure

1. Log in to the [Azure Portal](https://ms.portal.azure.com/).

2.	Click on the **Marketplace**, click **Compute**, then type **Oracle** into the search box.

3.	Select the **Oracle Database 12c and WebLogic Server 12c Standard Edition on Windows Server 2012** or **Oracle Database 12c and WebLogic Server 12c Enterprise Edition on Windows Server 2012** image.  Review the information about this image (such as minimum recommended size), and then click **Next**.

4.	Specify a **Host Name** for the VM.

5.	Specify a **User Name** for the VM. Note that this user is for remotely logging into the VM; this is not the Oracle database user name.

6.	Specify and confirm a password for the VM, or provide a SSH Public Key.

7.	Choose a **Pricing Tier**.  Note that Recommended Pricing Tiers are displayed by default, to see all configuration options, click View all on the top right.

8. let Optional Configuration as needed, with these considerations:

	1. Leave **Storage Account** as-is to create a new storage account with the VM name.

	2. Leave **Availability Set** as “Not Configured”.

	3. Do not add any **endpoints** at this time. 

9.	Choose or Create a [Resource Group](resource-group-portal.md)

10. Choose a **Subscription**

11. Choose a **Location**


##To create your database hosted in this Virtual Machine
Follow the instructions in [Creating an Oracle Database 12c Virtual Machine in Azure](virtual-machines-creating-oracle-database-virtual-machine.md), beginning with the **To create your database using the Oracle Database 12c Virtual Machine in Azure** section.

##To configure your Oracle WebLogic Server 12c hosted in this Virtual Machine
Follow the instructions in [Creating an Oracle WebLogic Server 12c Virtual Machine in Azure](virtual-machines-creating-oracle-webLogic-server-12c-virtual-machine.md), beginning with the **To configure your Oracle WebLogic Server 12c Virtual Machine in Azure** section. If you want to set up a WebLogic Server cluster, also see [Creating an Oracle WebLogic Server 12c cluster in Azure](virtual-machines-creating-oracle-webLogic-server-12c-cluster.md).

##Additional Resources
[Oracle Virtual Machine images - Miscellaneous Considerations](miscellaneous-considerations-for-oracle-virtual-machine-images-new-article.md)

[Oracle Virtual Machine images for Azure](virtual-machines-oracle-list-oracle-virtual-machine-images.md)

[Connecting to Oracle Database from a Java Application](http://docs.oracle.com/cd/E11882_01/appdev.112/e12137/getconn.htm#TDPJD136)

[Oracle WebLogic Server 12c using Linux on Microsoft Azure](http://www.oracle.com/technetwork/middleware/weblogic/learnmore/oracle-weblogic-on-azure-wp-2020930.pdf)

[Oracle Database 2 Day DBA 12c Release 1](http://docs.oracle.com/cd/E16655_01/server.121/e17643/toc.htm)