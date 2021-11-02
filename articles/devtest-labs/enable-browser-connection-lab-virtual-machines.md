---
title: Enable browser connection on Azure DevTest Labs virtual machines
description: DevTest Labs now integrates with Azure Bastion, as an owner of the lab you can enable accessing all lab virtual machines through a browser.  
ms.topic: how-to
ms.date: 10/28/2021
---

# Enable browser connection on Azure DevTest Labs virtual machines 

DevTest Labs integrates with [Azure Bastion](../bastion/index.yml), which enables you to connect to your virtual machines through a browser. You first need to enable browser connections to lab virtual machines.

As an owner of a lab, you can enable accessing all lab virtual machines through a browser. You don't need another client, agent, or piece of software. Azure Bastion provides secure and seamless RDP/SSH connectivity to your virtual machines directly in the Azure portal over TLS. When you connect via Azure Bastion, your virtual machines don't need a public IP address. For more information, see [What is Azure Bastion?](../bastion/bastion-overview.md)

In this guide, you'll enable browser connections to lab virtual machines.

## Prerequisites

- A lab in [Azure DevTest Labs](./devtest-lab-overview.md).

- Your lab's virtual network configured with Bastion. See [Create an Azure Bastion host](../bastion/tutorial-create-host-portal.md) for steps on adding Bastion.

- The lab user needs to be a member of the **Reader** role on the Bastion host and the virtual network that has Bastion configured. 

## Add virtual network to lab

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your lab in **DevTest Labs**.

1. Under **Settings**, select **Configuration and policies**.

    :::image type="content" source="./media/enable-browser-connection-lab-virtual-machines/portal-lab-configurations-policies.png" alt-text="Screenshot of configurations and policies.":::

1. On the **Configuration and policies** page, under **External resources**, select **Virtual networks**.

1. Select your Bastion configured virtual network.

    :::image type="content" source="./media/enable-browser-connection-lab-virtual-machines/virtual-network-added.png" alt-text="Screenshot of added virtual network.":::

1. On the **Virtual network** page, select the subnet for VMs, not **AzureBastionSubnet**.

1. On the **Lab Subnet** section, for the **Use in virtual machine creation** option, select **Yes**. Then select **Save**.

    :::image type="content" source="./media/enable-browser-connection-lab-virtual-machines/allow-subnet-use.png" alt-text="Screenshot of selection for allow subnet use option.":::

1. On the **Virtual network** page, select **Save**. You'll then be returned to the **Virtual networks** section of **Configuration and policies**.

## Enable browser connection 

Once you have a Bastion configured virtual network inside the lab, as a lab owner, you can enable browser connect to lab virtual machines.

These steps continue immediately from the prior section.

1. Under **Settings**, select **Browser connect**.

1. Under the **Browser access to virtual machines** section, select **Yes** for **Browser connect**. Then select **Save**.

    :::image type="content" source="./media/enable-browser-connection-lab-virtual-machines/enable-browser-connect.png" alt-text="Screenshot of enabling browser connect option.":::

## Next Steps

See the following article to learn how to connect to your VMs using a browser: [Connect to your virtual machines through a browser](connect-virtual-machine-through-browser.md)