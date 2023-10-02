---
title: Architecture fundamentals
titleSuffix: Azure Lab Services
description: This article covers the fundamental resources used by Azure Lab Services and the basic architecture of a lab environment.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: conceptual
ms.date: 04/24/2023
---

# Architecture fundamentals in Azure Lab Services

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

Azure Lab Services is a SaaS (software as a service) solution, which means that the infrastructure resources needed by Azure Lab Services are managed for you. This article covers the fundamental resources that Azure Lab Services uses and the basic architecture of a lab.

While Azure Lab Services is a managed service, you can configure the service to integrate with your own resources. For example, [connect lab virtual machines to your own network with virtual network injection](how-to-connect-vnet-injection.md) instead of using virtual network peering. Or reuse your own custom virtual machine images by [attaching an Azure compute gallery](./how-to-attach-detach-shared-image-gallery.md).

The following diagram shows the basic architecture of a lab without advanced networking enabled.  The [lab plan](./classroom-labs-concepts.md#lab-plan) is hosted in your subscription. The lab virtual machines, along with the resources needed to support the virtual machines, are hosted in a subscription owned by Azure Lab Services.

:::image type="content" source="./media/classroom-labs-fundamentals/labservices-basic-architecture.png" alt-text="Architecture diagram of basic lab in Azure Lab Services.":::

## Hosted resources

Azure Lab Services hosts the resources to run a lab in one of the Microsoft-managed Azure subscriptions. These resources include:

- [template virtual machine](./classroom-labs-concepts.md#template-virtual-machine) for the lab creator to configure the lab
- [lab virtual machine](./classroom-labs-concepts.md#lab-virtual-machine) for each lab user to remotely connect to
- network-related items, such as a load balancer, virtual network, and network security group

Azure monitors these managed subscriptions for suspicious activity.  It's important to note that this monitoring is done externally to the virtual machines through VM extensions or network pattern monitoring.  If you enable [shutdown on disconnect](how-to-enable-shutdown-disconnect.md), a diagnostic extension is enabled on the virtual machine. The extension allows Azure Lab Services to be informed of the remote desktop protocol (RDP) session disconnect event.

## Virtual network

By default, each lab is isolated by its own virtual network.  

Lab users connect to their lab virtual machine through a load balancer.  Lab virtual machines don't have a public IP address and only have a private IP address. The connection string to remotely connect to the lab virtual machine uses the public IP address of the load balancer and a random port between:

- 4980-4989 and 5000-6999 for SSH connections
- 4990-4999 and 7000-8999 for RDP connections

Inbound rules on the load balancer forward the connection, depending on the operating system, to either port 22 (SSH) or port 3389 (RDP) of the lab virtual machine. A network security group (NSG) blocks external traffic to any other port.

If the lab is using [advanced networking](how-to-connect-vnet-injection.md), then each lab is using the same subnet that was delegated to Azure Lab Services and connected to the lab plan. You're also responsible for creating an [NSG with an inbound security rule to allow RDP and SSH traffic](how-to-connect-vnet-injection.md#associate-the-subnet-with-the-network-security-group) so lab users can connect to their VMs.

## Access control to the lab virtual machines

Azure Lab Services manages access to lab virtual machines at different levels:

- Start or stop a lab VM. Azure Lab Services grants lab users permission to perform such actions on their own virtual machines. The service also controls access to the lab virtual machine connection information.

- Register for a lab. Azure Lab Services offers two different access settings: restricted and nonrestricted. *Restricted access* means that Azure Lab Services verifies that lab users are added to the lab before allowing access. *Nonrestricted access* means that any user can register for a lab by using the lab registration link, if there's capacity in the lab. Nonrestricted access can be useful for hackathon events. For more information, see the [manage lab users](how-to-manage-lab-users.md#send-invitations-to-users) article.

- Virtual machine credentials. Lab virtual machines that are hosted in the lab have a username and password set by the creator of the lab. Alternately, the creator of the lab can allow registered users to choose their own password on first sign-in.

## Next steps

- What is [Azure Lab Services](./lab-services-overview.md)

- Learn more about the [key concepts in Azure Lab Services](./classroom-labs-concepts.md)
