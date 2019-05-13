---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: bastion
 ms.topic: include
 ms.date: 05/13/2019
 ms.author: cherylmc
 ms.custom: include file
---

## <a name="connecting"></a>How do I participate in the public preview?

Send an email to request onboarding for your subscription. In this email, include the following information:

* Subscription ID: <>
* Company Name:
* Your Name:
* Email Address (Corporate Email):

After your subscription has been provisioned for the preview, we will respond with a confirmation.

## <a name="publicip"></a>Do I need a public IP on my virtual machine?

You do not need a public IP on the Azure Virtual Machine that you are connecting to with Azure Bastion Host Service. The Bastion service will open the RDP/SSH to your virtual machine over a private IP within your virtual network.

## <a name="rdpssh"></a>Do I need an RDP or SSH client?

You do not need an RDP or SSH client to access the RDP/SSH to your Azure virtual machine in your Azure portal. Use the [Azure portal - preview link](https://aka.ms/BastionHost) to access the preview flight of the portal. This will let you get RDP/SSH access directly in the browser.

## <a name="agent"></a>Do I need an agent running in the Azure virtual machine?

You don't need to install an agent or any software on your browser or on your Azure virtual machine. The Bastion service is agentless and does not require any additional software for RDP/SSH.

## <a name="browsers"></a>Which browsers are supported?

During this preview, use the Microsoft Edge browser or Google Chrome on Windows. For Apple Mac, use Google Chrome browseSr.

## <a name="regions"></a>What regions are available during preview?

The preview is available in all Azure Public regions. Once your subscription is enabled, you can deploy and use the Bastion service via the [Azure portal - preview link](https://aka.ms/BastionHost).

## <a name="portal"></a>I can't find the Bastion resource in the Azure portal. What should I do?

Make sure that you are using the [Azure portal - preview link](https://aka.ms/BastionHost), not the regular Azure portal.

## <a name="previewbill"></a>Do I get billed for participating in the preview?

You will not be billed for your deployments during preview. However, there is no SLA attached with your deployment.