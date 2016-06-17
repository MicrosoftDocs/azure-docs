<properties
	pageTitle="Oracle WebLogic Server and Database VM | Microsoft Azure"
	description="Create an Oracle WebLogic Server 12c and Oracle Database 12c Azure image running on Windows Server 2012, using Resource Manager deployment model."
	services="virtual-machines-windows"
	authors="rickstercdn"
	manager="timlt"
	documentationCenter=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows"
	ms.workload="infrastructure-services"
	ms.date="05/17/2016"
	ms.author="rickstercdn" />

#Create an Oracle WebLogic Server 12c and Oracle Database 12c virtual machine in Azure

[AZURE.INCLUDE [virtual-machines-common-oracle-support](../../includes/virtual-machines-common-oracle-support.md)]

This article shows how to create an Oracle WebLogic Server 12c and Oracle Database 12c database on an image you previously created with Oracle software installed on on Windows Server 2012 in Azure. 

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
