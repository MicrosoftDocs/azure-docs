---
title: Deploying SAP IDES EHP7 SP3 for SAP ERP 6.0 on Microsoft Azure | Microsoft Docs
description: Deploying SAP IDES EHP7 SP3 for SAP ERP 6.0 on Microsoft Azure
services: virtual-machines-windows
documentationcenter: ''
author: hermanndms
manager: timlt
editor: ''
tags: azure-resource-manager
keywords: ''

ms.assetid: 626c1523-1026-478f-bd8a-22c83b869231
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 09/16/2016
ms.author: hermannd

---
# Deploying SAP IDES EHP7 SP3 for SAP ERP 6.0 on Microsoft Azure
This article describes how to deploy SAP IDES running with SQL Server and Windows OS on Microsoft Azure 
via SAP Cloud Appliance Library 3.0. The screenshots show the process step by step. Deploying other 
solutions in the list works the same way from a process perspective. One just has to select a different solution.

To start with SAP Cloud Appliance Library (SAP CAL) go [here](https://cal.sap.com/). There is a blog from SAP about 
the new [SAP Cloud Appliance Library 3.0](http://scn.sap.com/community/cloud-appliance-library/blog/2016/05/27/sap-cloud-appliance-library-30-came-with-a-new-user-experience). 

The following screenshots show step-by-step how to deploy SAP IDES on Microsoft Azure. The process works the same way for other solutions.

![](./media/virtual-machines-windows-sap-cal-ides-erp6-ehp7-sp3-sql/ides-pic1.jpg)

The first picture shows all solutions that are available on Microsoft Azure. The highlighted
Windows-based SAP IDES solution that is only available on Azure was chosen to go through the 
process.

![](./media/virtual-machines-windows-sap-cal-ides-erp6-ehp7-sp3-sql/ides-pic2.jpg)

First a new SAP CAL account has to be created. There are currently two choices for Azure - 
standard Azure and Azure on China mainland that is operated by partner 21Vianet.

![](./media/virtual-machines-windows-sap-cal-ides-erp6-ehp7-sp3-sql/ides-pic3.jpg)

Then one has to enter the Azure subscription ID that can be found on the Azure portal - also see
further down how to get it. Afterwards an Azure management certificate needs to be downloaded.

![](./media/virtual-machines-windows-sap-cal-ides-erp6-ehp7-sp3-sql/ides-pic6.jpg)

In the new Azure portal one finds the item "Subscriptions" on the left side. Click it to show all
active subscriptions for your user.

![](./media/virtual-machines-windows-sap-cal-ides-erp6-ehp7-sp3-sql/ides-pic7.jpg)

Selecting one of the subscriptions and then choosing "Management Certificates" explains that there is
a new concept using "service principals" for the new Azure Resource Manager model.
SAP CAL isn't adapted yet for this new model and still requires the "classic" model and the former
Azure portal to work with management certificates.

![](./media/virtual-machines-windows-sap-cal-ides-erp6-ehp7-sp3-sql/ides-pic4.jpg)

Here one can see the former Azure portal. The upload of a management certificate gives SAP CAL the permissions 
to create virtual machines within a customer subscription. Under the "SUBSCRIPTIONS" tab one can find the
subscription ID that has to be entered in the SAP CAL portal.

![](./media/virtual-machines-windows-sap-cal-ides-erp6-ehp7-sp3-sql/ides-pic5.jpg)

On the second tab, it's then possible to upload the management certificate that was downloaded before
from SAP CAL.

![](./media/virtual-machines-windows-sap-cal-ides-erp6-ehp7-sp3-sql/ides-pic8.jpg)

A little dialog pops up to select the downloaded certificate file.

![](./media/virtual-machines-windows-sap-cal-ides-erp6-ehp7-sp3-sql/ides-pic9.jpg)

Once the certificate was uploaded the connection between SAP CAL and the customer Azure subscription
can be tested within SAP CAl. A little message should pop up which tells that the connection is valid.

![](./media/virtual-machines-windows-sap-cal-ides-erp6-ehp7-sp3-sql/ides-pic10.jpg)

After the setup of an account one has to select a solution that should be deployed and create an instance.
With "basic" mode, it's really trivial. Enter an instance name, choose an Azure region and define the
master password for the solution.

![](./media/virtual-machines-windows-sap-cal-ides-erp6-ehp7-sp3-sql/ides-pic11.jpg)

After some time depending on the size and complexity of the solution (an estimation is given by SAP CAL) 
it's shown as "active" and ready for use. It is very simple.

![](./media/virtual-machines-windows-sap-cal-ides-erp6-ehp7-sp3-sql/ides-pic12.jpg)

Looking at some details of the solution one can see which kind of VMs were deployed. In this case there is
one single Azure VM of size D12 that was created by SAP CAL.

![](./media/virtual-machines-windows-sap-cal-ides-erp6-ehp7-sp3-sql/ides-pic13.jpg)

On the Azure portal, the virtual machine can be found starting with the same instance name that was given
in SAP CAL.

![](./media/virtual-machines-windows-sap-cal-ides-erp6-ehp7-sp3-sql/ides-pic14.jpg)

Now it's possible to connect to the solution via the connect button in the SAP CAL portal. The little dialog
contains a link to a user guide that describes all the default credentials to work with the solution.
[Here](https://caldocs.hana.ondemand.com/caldocs/help/Getting_Started_Guide_IDES607MSSQL.pdf) is the link to
the guide for the IDES solution.

![](./media/virtual-machines-windows-sap-cal-ides-erp6-ehp7-sp3-sql/ides-pic15.jpg)

Another option is to login to the Windows VM and start for example the pre-configured SAP GUI.

