---
title: 'Azure Bastion | Microsoft Docs'
description: Learn about Azure Bastion
services: bastion
author: cherylmc
# Customer intent: As someone with a basic network background, but is new to Azure, I want to understand the capabilities of Azure Bastion so that I can securely connect to my Azure virtual machines.

ms.service: bastion
ms.topic: overview
ms.date: 05/29/2019
ms.author: cherylmc

---
# What is Azure Bastion? (preview)

The Azure Bastion service is a new fully platform-managed PaaS service. It provides secure and seamless RDP/SSH connectivity to your virtual machines directly in the Azure portal over SSL. The virtual machines do not need a public IP address. Azure Bastion is provisioned in your Azure Virtual Network. It provides secure RDP and SSH connectivity to all VMs in the virtual network in which it is provisioned. Using Azure Bastion protects your virtual machines from exposing RDP/SSH ports to outside world while still providing secure access using RDP/SSH.  With Azure Bastion, you connect to the virtual machine directly from the Azure portal. You don't need an additional client, agent, or piece of software.

RDP and SSH are some of the fundamental means through which you can connect to your workloads running in Azure. Exposing RDP/SSH ports over the Internet isn't desired and is seen as a significant threat surface. This is often due to protocol vulnerabilities. To contain this threat surface, you can deploy bastion hosts (also known as jump-servers) at the public side of your perimeter network. Bastion host servers are designed and configured to withstand attacks. Additionally, these servers also provide RDP and SSH connectivity to the workloads sitting behind the bastion and further inside into the network.

> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
>

![architecture](./media/bastion-overview/architecture.png)

This graphic shows the architecture of an Azure Bastion deployment. Azure Bastion is deployed in your virtual network and once deployed, it provides the secure RDP/SSH experience for all the virtual machines in your virtual network.

## How does it work?

Once you provision an Azure Bastion service in your virtual network, the RDP/SSH experience is available to all your VMs in the same virtual network. The deployment is per virtual network, not per subscription/account or virtual machine.

## Key features

The following features are available to try during public preview:

* **RDP and SSH directly in Azure portal:** You can directly get to the RDP and SSH session directly in the Azure portal using a single click seamless experience.
* **Remote Session over SSL and firewall traversal for RDP/SSH:** Azure Bastion uses an HTML5 based web client that is automatically streamed to your local device, so that you get your RDP/SSH session over SSL on port 443 enabling you to traverse corporate firewalls securely.
* **No Public IP required on the Azure VM:** Azure Bastion opens the RDP/SSH connection to your Azure virtual machine using private IP on your VM.  Thus, you do not need a public IP on your virtual machine.
* **No hassle of managing NSGs:** Azure Bastion is a fully managed platform PaaS service from Azure and is hardened internally to provide you secure RDP/SSH connectivity.   You do not need to apply any NSGs on Azure Bastion subnet and since Azure Bastion connects to your virtual machines over private IP, you can one-time configure your NSGs to allow RDP/SSH from Azure Bastion only removing the hassle of managing NSGs every time you need to securely connect to your virtual machines.
* **Protection again port scanning:** With Azure Bastion, since you do not need to expose your virtual machines to public internet, your virtual machines are protected against port scanning by rogue and malicious users outside your virtual network.
* **Protect Zero-day exploits and hardening one place only:** Azure Bastion is a fully platform-managed PaaS service. Since it sits at the perimeter of your virtual network, you do not need to worry about hardening each of your virtual machines in your virtual network. Azure platform will keep the Azure Bastion hardened by protecting zero-day exploits by keeping Azure Bastion always up-to-date for you.

## FAQ

[!INCLUDE [Bastion FAQ](../../includes/bastion-faq-include.md)]

## Next steps

- [Create an Azure Bastion host resource](bastion-create-host-portal.md).
- Learn about some of the other key [networking capabilities](../networking/networking-overview.md) of Azure.