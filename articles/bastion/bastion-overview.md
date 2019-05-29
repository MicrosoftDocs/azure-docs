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

RDP and SSH are some of the fundamental means through which you can connect to your workloads running in Azure. Due to varied reasons, often protocol vulnerabilities, exposing RDP/SSH ports over the Internet isn't desired and is seen as a significant threat surface. To contain this threat surface, customers deploy bastion hosts (also known as jump-servers) at the public side of their perimeter network. Bastion host servers are designed and configured to withstand attacks. In addition, these servers also provide RDP and SSH connectivity to the workloads sitting behind the bastion and further inside into the network.

> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
>

## How does it work?

Once you provision an Azure Bastion service in your virtual network, the seamless RDP/SSH experience is available to all your VMs in the same virtual network. The deployment is per virtual network, not per subscription/account or virtual machine.

[!INCLUDE [Bastion FAQ](../../includes/bastion-faq-include.md)]

## Next steps

- [Create an Azure Bastion host resource](bastion-create-host-portal.md).
- View the [Subscription and service limits](../azure-subscription-service-limits.md#networking-limits).
- Learn about some of the other key [networking capabilities](../networking/networking-overview.md) of Azure.