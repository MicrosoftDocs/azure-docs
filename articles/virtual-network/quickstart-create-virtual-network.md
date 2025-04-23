---
title: 'Quickstart: Create an Azure Virtual Network'
description: Learn how to use the various deployment methods in Azure to create a virtual network.
author: asudbring
ms.author: allensu
ms.service: azure-virtual-network
ms.topic: quickstart  #Don't change
ms.date: 04/22/2025

#customer intent: As an administrator or network engineer, I want to create a virtual network and test traffic between virtual machines in the same virtual network.

---

# Quickstart: Create an Azure Virtual Network
 
In this quickstart, learn how to create an Azure Virtual Network (VNet) using the Azure portal, Azure CLI, Azure PowerShell, Resource Manager template, Bicep template, and Terraform. Two virtual machines and an Azure Bastion host are deployed to test connectivity between the virtual machines in the same virtual network. The Azure Bastion host facilitates secure and seamless RDP and SSH connectivity to the virtual machines directly in the Azure portal over SSL.

:::image type="content" source="./media/quick-create-portal/virtual-network-qs-resources.png" alt-text="Diagram of resources created in the virtual network quickstart." lightbox="./media/quick-create-portal/virtual-network-qs-resources.png":::

A virtual network is the fundamental building block for private networks in Azure. Azure Virtual Network enables Azure resources like VMs to securely communicate with each other and the internet.

>[!VIDEO https://learn-video.azurefd.net/vod/player?id=6b5b138e-8406-406e-8b34-40bdadf9fc6d]

If you don't have a service subscription, [create a free trial account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Prerequisites

### [Portal](#tab/portal)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

### [Powershell](#tab/powershell)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

### [CLI](#tab/cli)

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

### [ARM](#tab/arm)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

### [Bicep](#tab/bicep)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- To deploy the Bicep files, either the Azure CLI or Azure PowerShell installed.

### [Terraform](#tab/terraform)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- [Installation and configuration of Terraform](/azure/developer/terraform/quickstart-configure).

---


### [Portal](#tab/portal)

## <a name="create-a-virtual-network"></a> Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

[!INCLUDE [virtual-network-create-with-bastion.md](~/reusable-content/ce-skilling/azure/includes/virtual-network-create-with-bastion.md)]

[!INCLUDE [create-two-virtual-machines.md](../../includes/create-two-virtual-machines.md)]

## Connect to a virtual machine

1. In the portal, search for and select **Virtual machines**.

1. On the **Virtual machines** page, select **vm-1**.

1. In the **Overview** information for **vm-1**, select **Connect**.

1. On the **Connect to virtual machine** page, select the **Bastion** tab.

1. Select **Use Bastion**.

1. Enter the username and password that you created when you created the VM, and then select **Connect**.

## Start communication between VMs

1. At the bash prompt for **vm-1**, enter `ping -c 4 vm-2`.

   You get a reply similar to the following message:

    ```output
    azureuser@vm-1:~$ ping -c 4 vm-2
    PING vm-2.3bnkevn3313ujpr5l1kqop4n4d.cx.internal.cloudapp.net (10.0.0.5) 56(84) bytes of data.
    64 bytes from vm-2.internal.cloudapp.net (10.0.0.5): icmp_seq=1 ttl=64 time=1.83 ms
    64 bytes from vm-2.internal.cloudapp.net (10.0.0.5): icmp_seq=2 ttl=64 time=0.987 ms
    64 bytes from vm-2.internal.cloudapp.net (10.0.0.5): icmp_seq=3 ttl=64 time=0.864 ms
    64 bytes from vm-2.internal.cloudapp.net (10.0.0.5): icmp_seq=4 ttl=64 time=0.890 ms
    ```

1. Close the Bastion connection to **vm-1**.

1. Repeat the steps in [Connect to a virtual machine](#connect-to-a-virtual-machine) to connect to **vm-2**.

1. At the bash prompt for **vm-2**, enter `ping -c 4 vm-1`.

   You get a reply similar to the following message:

    ```output
    azureuser@vm-2:~$ ping -c 4 vm-1
    PING vm-1.3bnkevn3313ujpr5l1kqop4n4d.cx.internal.cloudapp.net (10.0.0.4) 56(84) bytes of data.
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=1 ttl=64 time=0.695 ms
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=2 ttl=64 time=0.896 ms
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=3 ttl=64 time=3.43 ms
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=4 ttl=64 time=0.780 ms
    ```

1. Close the Bastion connection to **vm-2**.

[!INCLUDE [portal-clean-up.md](~/reusable-content/ce-skilling/azure/includes/portal-clean-up.md)]


### [Powershell](#tab/powershell)

### [CLI](#tab/cli)

### [ARM](#tab/arm)

### [Bicep](#tab/bicep)

### [Terraform](#tab/terraform)

---


## Clean up resources



## Next step -or- Related content

> [!div class="nextstepaction"]
> [Next sequential article title](link.md)

-or-

- [Related article title](link.md)
- [Related article title](link.md)
- [Related article title](link.md)

