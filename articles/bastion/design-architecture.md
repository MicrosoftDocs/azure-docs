---
title: 'About Azure Bastion design and architecture'
description: Learn about the different architectures available with Azure Bastion.
author: cherylmc
ms.topic: concept-article
ms.date: 05/09/2024
ms.author: cherylmc
ms.service: azure-bastion
---

# Design architecture for Azure Bastion

Azure Bastion offers multiple deployment architectures, depending on the selected SKU and option configurations. For most SKUs, Bastion is deployed to a virtual network and supports virtual network peering. Specifically, Azure Bastion manages RDP/SSH connectivity to VMs created in the local or peered virtual networks.

RDP and SSH are some of the fundamental means through which you can connect to your workloads running in Azure. Exposing RDP/SSH ports over the Internet isn't desired and is seen as a significant threat surface. This is often due to protocol vulnerabilities. To contain this threat surface, you can deploy bastion hosts (also known as jump-servers) at the public side of your perimeter network. Bastion host servers are designed and configured to withstand attacks. Bastion servers also provide RDP and SSH connectivity to the workloads sitting behind the bastion, and also further inside the network.

The SKU you select when you deploy Bastion determines the architecture and the available features. You can upgrade to a higher SKU to support more features, but you can't downgrade a SKU after deploying. Certain architectures, such as [Private-only](#private-only) and [Developer SKU](#developer), must be configured at the time of deployment.

## <a name="basic"></a>Deployment - Basic SKU and higher

:::image type="content" source="./media/bastion-overview/architecture.png" alt-text="Diagram showing Azure Bastion architecture." lightbox="./media/bastion-overview/architecture.png":::

When working with the Basic SKU or higher, Bastion uses the following architecture and workflow.

* The Bastion host is deployed in the virtual network that contains the AzureBastionSubnet subnet that has a minimum /26 prefix.
* The user connects to the Azure portal using any HTML5 browser and selects the virtual machine to connect to. A public IP address is not required on the Azure VM.
* The RDP/SSH session opens in the browser with a single click.

For some configurations, the user can connect to the virtual machine via the native operating system client.

For configuration steps, see:

* [Deploy Bastion automatically - Basic SKU only](quickstart-host-portal.md)
* [Deploy Bastion using manually specified settings](tutorial-create-host-portal.md)

## <a name="developer"></a>Deployment - Developer SKU

:::image type="content" source="./media/quickstart-developer-sku/bastion-shared-pool.png" alt-text="Diagram that shows the Azure Bastion developer SKU architecture." lightbox="./media/quickstart-developer-sku/bastion-shared-pool.png":::

[!INCLUDE [Developer SKU](../../includes/bastion-developer-sku-description.md)]

For more information about the Developer SKU, see [Deploy Azure Bastion - Developer SKU](quickstart-developer-sku.md).

## <a name="private-only"></a>Deployment - Private-only

:::image type="content" source="./media/private-only-deployment/private-only-architecture.png" alt-text="Diagram showing Azure Bastion private-only architecture." lightbox="./media/private-only-deployment/private-only-architecture.png":::

[!INCLUDE [private-only bastion description](../../includes/bastion-private-only-description.md)].

The diagram shows the Bastion private-only deployment architecture. A user connected to Azure via ExpressRoute private-peering can securely connect to Bastion using the private IP address of the bastion host. Bastion can then make the connection via private IP address to a virtual machine that's within the same virtual network as the bastion host. In a private-only Bastion deployment, Bastion doesn't allow outbound access outside of the virtual network.

Considerations:

[!INCLUDE [private-only bastion considerations](../../includes/bastion-private-only-considerations.md)]

For more information about private-only deployments, see [Deploy Bastion as private-only](private-only-deployment.md).

## Next steps

* [Deploy Bastion automatically - Basic SKU only](quickstart-host-portal.md)
* [Deploy Bastion using manually specified settings](tutorial-create-host-portal.md)
* [Deploy Azure Bastion - Developer SKU](quickstart-developer-sku.md)
* [Deploy Bastion as private-only](private-only-deployment.md)
