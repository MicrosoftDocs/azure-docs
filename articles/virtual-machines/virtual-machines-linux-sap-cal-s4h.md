<properties 
pageTitle="Deploying S/4 HANA or BW/4 HANA on Microsoft Azure" 
description="Deploying S/4 HANA or BW/4 HANA on Microsoft Azure" 
services="virtual-machines,virtual-network,storage" 
documentationCenter="saponazure" 
authors="hermanndms" 
manager="juergent" 
editor="" 
tags="azure-resource-manager" 
  keywords=""/> 
<tags 
  ms.service="virtual-machines" 
  ms.devlang="NA" 
  ms.topic="campaign-page" 
  ms.tgt_pltfrm="vm-linux" 
  ms.workload="na" 
  ms.date="09/12/2016" 
  ms.author="hermannd"/> 


# Deploying S/4 HANA or BW/4 HANA on Microsoft Azure 

This article will describe how to deploy S/4 HANA on Microsoft Azure via SAP Cloud Appliance Library 3.0.
The screenshots show the process step by step. Deploying other SAP HANA based solutions like BW/4 HANA 
works exactly the same way from a process perspective. One just has to select a different solution.

To start with SAP Cloud Appliance Library ( SAP CAL ) go [here](https://cal.sap.com/). There is a blog from SAP about the new [SAP Cloud Appliance Library 3.0](http://scn.sap.com/community/cloud-appliance-library/blog/2016/05/27/sap-cloud-appliance-library-30-came-with-a-new-user-experience). 

## Using the new simplified SAP CAL 3.0 UI to deploy S/4 HANA 

The screenshots below show step-by-step how to deploy S/4 HANA on Microsoft Azure. The process works exactly the same way for other solutions likeBW/4 HANA.


![](./media/virtual-machines-linux-sap-cal-s4h/s4h-pic-1b.jpg)

The first picture shows all SAP CAL HANA based solutions which are available on Microsoft Azure.
Exemplarily the "SAP S/4 HANA on premise edition" ( solution at the bottom on the screenshot ) 
was chosen to go through the process.

![](./media/virtual-machines-linux-sap-cal-s4h/s4h-pic-2.jpg)

First a new SAP CAL account has to be created. There are currently two choices for Azure - 
standard Azure and Azure on China mainland which is operated by partner 21Vianet.

![](./media/virtual-machines-linux-sap-cal-s4h/s4h-pic-3b.jpg)

Then one has to enter the Azure subscription ID which can be found on the Azure portal - also see
further down how to get it. Afterwards an Azure management certificate needs to be downloaded.

![](./media/virtual-machines-linux-sap-cal-s4h/s4h-pic-6b.jpg)

In the new Azure portal one will find the item "Subscriptions" on the left side. Click on it to show
all active subscriptions for your user.

![](./media/virtual-machines-linux-sap-cal-s4h/s4h-pic-b7.jpg)

Selecting one of the subscriptions and then choosing "Management Certificates" explains that there is
a new concept using "service principals" for the new Azure Resource Manager model also called ARM.
SAP CAL isn't adapted yet for the new ARM model and still requires the "classic" model and the former
Azure portal to work with management certificates.

![](./media/virtual-machines-linux-sap-cal-s4h/s4h-pic-4.jpg)

Here one can see the former Azure portal. This gives SAP CAL the permissions to create virtual machines
within a customer subscription.

![](./media/virtual-machines-linux-sap-cal-s4h/s4h-pic-5.jpg)

On the second tab it's then possible to upload the management certificate which was downloaded before
from SAP CAL.

![](./media/virtual-machines-linux-sap-cal-s4h/s4h-pic-8.jpg)

A little dialog will pop up to select the downloaded certificate file.

![](./media/virtual-machines-linux-sap-cal-s4h/s4h-pic-9.jpg)

Once the certificate was uploaded the connection between SAP CAL and the customer Azure subscription
can be tested within SAP CAl. A little message should pop up which tells that the connection is valid.

![](./media/virtual-machines-linux-sap-cal-s4h/s4h-pic-10.jpg)

After the setup of an account one has to select a solution which should be deployed and create an instance.
With "basic" mode it's really trivial. Just enter an instance name, choose an Azure region and define the
master password for the solution.

![](./media/virtual-machines-linux-sap-cal-s4h/s4h-pic-11.jpg)

After some time - depends on the complexity of the solution ( an estimation will be given by SAP CAL ) - it's
shown as "active" and ready for use. Really simple.

![](./media/virtual-machines-linux-sap-cal-s4h/s4h-pic-12.jpg)

Looking at some details of the solution one can see which kind of VMs were deployed. In this case three Azure
VMs of different sizes and purpose were created.

![](./media/virtual-machines-linux-sap-cal-s4h/s4h-pic-13.jpg)

On the Azure portal the virtual machines can be found starting with the same instance name which was given
in SAP CAL.

![](./media/virtual-machines-linux-sap-cal-s4h/s4h-pic-14b.jpg)

Now it's possible to connect to the solution via the connect button in the SAP CAL portal. The little dialog
contains a link to a user guide which describes all the default credentials to work with the solution.

![](./media/virtual-machines-linux-sap-cal-s4h/s4h-pic-15.jpg)

Another option is to login to hte client Windows VM and start e.g. the pre-configured SAP GUI.







