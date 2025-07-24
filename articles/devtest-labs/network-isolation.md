---
title: Create a network isolated lab
description: Learn how to enable and configure network isolation for labs in Azure DevTest Labs.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.custom: UpdateFrequency2
ms.date: 03/31/2025

#customer intent: As a lab administrator, I want to configure a network-isolated lab so I can completely isolate all lab resources to an existing virtual network.
---

# Configure network isolation for a lab in Azure DevTest Labs

Azure DevTest Labs creates all labs inside [Azure virtual networks](/azure/virtual-network/virtual-networks-overview). The virtual network acts as a security boundary to isolate lab resources from the public internet. By default, DevTest Labs creates a new virtual network for each lab, but you can also use an existing virtual network.

If your organizational networking policies require it, you can isolate all lab resources to the lab's virtual network. This article walks you through how to use the Azure portal to create or configure a network-isolated lab in DevTest Labs.

You can use the Azure portal to enable network isolation only during lab creation. To convert an existing lab and its resources to isolated network mode, you can use the PowerShell script [Convert-DtlLabToIsolatedNetwork.ps1](https://github.com/Azure/azure-devtestlab/blob/master/Tools/ConvertDtlLabToIsolatedNetwork/Convert-DtlLabToIsolatedNetwork.ps1).

Network isolation lets you:

- Isolate all lab [virtual machines (VMs)](devtest-lab-configure-vnet.md) and [environments](connect-environment-lab-virtual-network.md) in a preexisting virtual network that you select.
- Completely isolate the lab, including VMs, environments, the lab storage account, and key vaults, to a selected virtual network.
- Join an Azure virtual network to an on-premises network to securely connect to on-premises resources. For more information, see [DevTest Labs enterprise reference architecture: Connectivity components](devtest-lab-reference-architecture.md#connectivity-components).

## Prerequisites

- **Owner** or **Contributor**-level permissions in the Azure subscription where you want to create the network-isolated lab.

## Enable network isolation

During lab creation, you can enable network isolation for the default lab virtual network, or for another, preexisting virtual network that you use for the lab.

### Enable network isolation for the default virtual network

To create the lab and enable network isolation in the default virtual network:

1. During [lab creation](devtest-lab-create-lab.md), select the **Networking** tab on the **Create DevTest Lab** screen.
1. On the **Networking** screen, leave **Virtual Network** and **Subnet** set to **Default**. Select **Yes** next to **Isolate lab resources**, and finish creating the lab.

   :::image type="content" source="./media/network-isolation/isolate-lab-resources.png" alt-text="Screenshot that shows enabling network isolation for the default network.":::

If you enable network isolation for the default network, no further action is needed. The lab handles isolating resources from now on.

### Enable network isolation for an existing virtual network

To use a different, existing virtual network for the lab, and enable network isolation for that network:

1. During [lab creation](devtest-lab-create-lab.md), select the **Networking** tab on the **Create DevTest Lab** screen.
1. On the **Networking** screen, select a network other than **Default** from the dropdown list next to **Virtual Network**. The list only shows networks in the same region and subscription as the lab.

   :::image type="content" source="./media/network-isolation/create-lab.png" alt-text="Screenshot that shows selecting a virtual network.":::   

1. Select a subnet in the virtual network.

   :::image type="content" source="./media/network-isolation/create-lab-subnet.png" alt-text="Screenshot that shows selecting a subnet and selecting Yes for network isolation.":::

1. Select **Yes** next to **Isolate lab resources**, and finish creating the lab.

If you enable network isolation for a different network than the default, complete the following instructions to configure service endpoints for network access.

<a name="steps-to-follow-post-lab-creation"></a>
## Configure service endpoints

If you enabled network isolation for a virtual network other than the default, complete the following steps to isolate the lab storage account and key vault to the network you selected. Do these steps after the lab is created, but before you do any other configuration or create any lab VMs or resources.

### Configure the endpoint for the lab storage account

1. On the lab's **Overview** page, select **Resource visualizer**. 

1. On the **Resource visualizer** page, select the lab's storage account.

   You can also open the lab storage account from **Storage accounts** or the lab's resource group. The lab storage account is named `a<labName><4-digit number>`. For example, if the lab name is `Fabrikam`, the storage account name could be `afabrikam1234`.

   :::image type="content" source="./media/network-isolation/contoso-test.png" alt-text="Screenshot that shows selecting the lab storage account.":::

1. On the storage account page, expand **Security + networking** and select **Networking** from the left navigation menu.

1. On the **Firewalls and virtual networks** tab, ensure that **Enabled from selected virtual networks and IP addresses** is selected under **Public network access**, and select **Add existing virtual network**.

   :::image type="content" source="./media/network-isolation/add-existing-virtual-network.png" alt-text="Screenshot that shows the resource group networking page with add existing virtual network highlighted.":::

1. On the **Add networks** pane, select the virtual network and subnet you chose when you created the lab, and then select **Enable**.

   :::image type="content" source="./media/network-isolation/contoso-lab.png" alt-text="Screenshot that shows the resource group networking pane with Enable highlighted.":::

1. Once the service endpoint is successfully enabled, select **Add**.

   :::image type="content" source="./media/network-isolation/add-network-pane.png" alt-text="Screenshot that shows the resource group networking pane with Add highlighted.":::

1. On the **Networking** page, make sure **Allow Azure services on the trusted services list to access this storage account** is selected under **Exceptions** at the bottom of the page. DevTest Labs is a [trusted Microsoft service](/azure/storage/common/storage-network-security#trusted-microsoft-services), so selecting this option lets the lab operate normally in a network isolated mode.

1. Select **Save** at the top of the page.

   :::image type="content" source="./media/network-isolation/allow-trusted-services.png" alt-text="Screenshot that shows allowing trusted services access to a resource group.":::

Azure Storage now allows inbound connections from the added virtual network, which enables the lab to operate successfully in a network isolated mode.

You can automate these steps with PowerShell or Azure CLI to configure network isolation for multiple labs. For more information, see [Configure Azure Storage firewalls and virtual networks](/azure/storage/common/storage-network-security).

### Configure the endpoint for the lab key vault

1. On the lab's **Overview** page, select **Resource visualizer**. 

1. On the **Resource visualizer** page, select the lab's key vault. The key vault is named `<labName><4-digit number>`. For example, if the lab name is `Fabrikam`, the key vault name could be `Fabrikam1234`.

   :::image type="content" source="./media/network-isolation/key-vault.png" alt-text="Screenshot that shows selecting the lab's key vault.":::

1. On the key vault page, expand **Settings** and select **Networking** from the left navigation menu.

1. On the **Firewalls and virtual networks** tab, ensure that **Allow public access from specific virtual networks and IP addresses** is selected, and select **Add a virtual network** > **Add existing virtual networks**.

   :::image type="content" source="./media/network-isolation/key-vault-enable-network.png" alt-text="Screenshot that shows the Networking page for the key vault.":::

1. On the **Add networks** pane, select the virtual network and subnet you chose when you created the lab, and then select **Enable**.
 
    :::image type="content" source="./media/network-isolation/networking-key-vault.png" alt-text="Screenshot that shows enabling a virtual network and subnet in a key vault.":::

1. Once the service endpoint is successfully enabled, select **Add**.

1. On the **Networking** page, make sure **Allow trusted Microsoft services to bypass this firewall** is selected under **Exception**, and select **Apply**.

   :::image type="content" source="./media/network-isolation/key-vault-add-network.png" alt-text="Screenshot that shows adding a virtual network and subnet in a key vault.":::

## Use a network-isolated lab

You must configure several other processes to be able to use them with a network-isolated lab.

### Enable access to the storage account from outside the lab

You must explicitly enable any access to the network isolated lab's storage account from an allowed endpoint, such as a local or virtual machine (VM). Actions like [uploading a virtual hard disk (VHD) to the storage account for creating custom images](devtest-lab-create-template.md) require this access. You can enable access by creating a lab VM and securely accessing the lab's storage account from that VM.

For more information, see [Connect to a storage account using an Azure Private Endpoint](/azure/private-link/tutorial-private-endpoint-storage-portal).

### Provide storage account to export lab usage data

To [export usage data](personal-data-delete-export.md) for a network isolated lab, you must explicitly specify a storage account and generate a blob within the account to store the data. Exporting usage data fails in network isolated mode if you don't explicitly specify the storage account to use.

For more information, see [Export or delete personal data from Azure DevTest Labs](personal-data-delete-export.md).

### Set key vault access policies

Enabling the key vault service endpoint affects only the firewall. Make sure to also configure the appropriate key vault access permissions in the key vault **Access policies** section.

For more information, see [Assign a Key Vault access policy](/azure/key-vault/general/assign-access-policy).

## Related content

- [Manage Azure DevTest Labs storage accounts](encrypt-storage.md)
- [Store secrets in a key vault in Azure DevTest Labs](devtest-lab-store-secrets-in-key-vault.md)