<properties
   pageTitle="Create FQDN for a VM in Azure portal | Microsoft Azure"
   description="Learn how to create a Fully Qualified Domain Name or FQDN for a Resource Manager based virtual machine in the Azure portal."
   services="virtual-machines"
   documentationCenter=""
   authors="dsk-2015"
   manager="timlt"
   editor="tysonn"
   tags="azure-resource-manager"/>

<tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="01/19/2016"
   ms.author="dkshir"/>

# Create a Fully Qualified Domain Name in the Azure portal

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] classic deployment model.


When you create a virtual machine in the [Azure portal](https://portal.azure.com) using the **Resource Manager** deployment model, the portal creates a public IP resource for the virtual machine. You can use this IP address to remotely access the virtual machine. Although the portal does not create a [fully qualified domain name](https://en.wikipedia.org/wiki/Fully_qualified_domain_name) or FQDN, by default, it is extremely easy to create one once the virtual machine is created. This article demonstrates the steps to create a DNS name or FQDN.

The article assumes that you have logged in to your subscription in the portal, and created a virtual machine with the available images, using the **Resource Manager**. Follow these steps once your virtual machine starts running.

1.  View the virtual machine settings on the portal and click on the Public IP address.

    ![locate ip resource](media/virtual-machines-create-fqdn-on-portal/locatePublicIP.PNG)

2.  Note that the DNS name for the Public IP is blank. Click **All settings** for the Public IP blade.

    ![settings ip](media/virtual-machines-create-fqdn-on-portal/settingsIP.PNG)

3.  Open the **Configuration** tab in the Public IP Settings. Enter the desired DNS name label and **Save** this configuration.

    ![enter dns name label](media/virtual-machines-create-fqdn-on-portal/dnsNameLabel.PNG)

    The Public IP resource will now show this new DNS label on its blade.

4.  Close the Public IP blades and go back to the virtual machine blade in the portal. Verify that the DNS name/FQDN appears next to the IP address for the Public IP resource.

    ![FQDN is created](media/virtual-machines-create-fqdn-on-portal/fqdnCreated.PNG)


    You can now connect remotely to the virtual machine using this DNS name. For example, use `SSH adminuser@testdnslabel.centralus.cloudapp.azure.com`, when connecting to a Linux virtual machine which has the fully qualified domain name of `testdnslabel.centralus.cloudapp.azure.com` and user name of `adminuser`.
