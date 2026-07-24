---
title: Configure a standard service endpoint - Azure portal
titleSuffix: Azure Private Link
description: Learn how to configure a standard service endpoint using the Azure portal with network security perimeter and network identifiers.
author: asudbring
ms.author: allensu
ms.service: azure-private-link
ms.topic: how-to
ms.date: 07/08/2026
---

# Configure a standard service endpoint using the Azure portal

This article walks you through configuring a [standard service endpoint](service-endpoint-standard-overview.md) using the Azure portal. You create a public IP address as a network identifier, associate it with service endpoints on a subnet, configure a network security perimeter, and validate connectivity.

> [!IMPORTANT]
> Standard service endpoint is currently in public preview. This preview is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account).

- **Network Contributor** role or higher on the subscription. Specifically, you need the `Microsoft.Network/publicIPAddresses/joinServiceEndpointNetworkIdentifier/action` permission. For more information, see [network security perimeter role-based access control requirements](network-security-perimeter-role-based-access-control-requirements.md).

- The **AllowServiceEndpointNetworkIdentifier** feature must be registered in your subscription. Use the following steps to register the feature:

    1. Sign in to the [Azure portal](https://portal.azure.com/?feature.vnetnetworkidentifier=true).

    1. In the search box at the top of the portal, enter **Subscriptions**. Select **Subscriptions** in the search results.

    1. Select the subscription you want to enable the feature for.

    1. In the left menu, select **Preview features** under **Settings**.

    1. In the search box, enter **AllowServiceEndpointNetworkIdentifier**.

    1. Select **AllowServiceEndpointNetworkIdentifier** in the results, and then select **Register**.

    1. Wait for the registration state to change to **Registered**. You can select **Refresh** to update the status.

## Create a resource group

1. Sign in to the [Azure portal](https://portal.azure.com/?feature.vnetnetworkidentifier=true) with your Azure account.

1. In the search box at the top of the portal, enter **Resource group**. Select **Resource groups** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create a resource group**, enter, or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select your subscription. |
    | Resource group | Enter **test-rg**. |
    | Region | Select **East US 2**. |

1. Select **Review + create**.

1. Select **Create**.

## Create a virtual network

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **+ Create**.

1. On the **Basics** tab of **Create virtual network**, enter, or select the following information:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |  |
    | Name | Enter **vnet-1**. |
    | Region | Select **East US 2**. |

1. Select **Next** to proceed to the **Security** tab.

1. Select **Next** to proceed to the **IP Addresses** tab.

1. In the address space box in **Subnets**, select the **default** subnet.

1. In **Edit subnet**, enter, or select the following information:

    | Setting | Value |
    |---|---|
    | **Subnet details** |  |
    | Subnet template | Leave the default **Default**. |
    | Name | Enter **subnet-1**. |
    | Starting address | Leave the default of **10.0.0.0**. |
    | Subnet size | Leave the default of **/24 (256 addresses)**. |

1. Select **Save**.

1. Select **Review + create** at the bottom of the screen, and when validation passes, select **Create**.

## Create a NAT gateway

Create a NAT gateway v2 and associate it with **subnet-1** to provide outbound internet connectivity for the virtual machine.

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **+ Create**.

1. On the **Basics** tab of **Create network address translation (NAT) gateway**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |  |
    | NAT gateway name | Enter **nat-gateway**. |
    | Region | Select **East US 2**. |
    | Tier | Select **Standard V2**. |
    | Availability zone | Select **No zone**. |
    | TCP idle timeout (minutes) | Leave the default of **4**. |

1. Select the **Outbound IP** tab.

1. Next to **Public IP addresses**, select **Create a new public IP address**.

1. Enter **public-ip-nat** for the name, and then select **OK**.

1. Select the **Networking** tab.

1. Select **vnet-1** for the virtual network.

1. Select the checkbox next to **subnet-1**.

1. Select **Review + create**, then select **Create**.

## Create a virtual machine

The following procedure creates a VM named **vm-1** in the virtual network. The virtual machine is used to validate connectivity after configuration.

1. In the portal, search for and select **Virtual machines**.

1. In **Virtual machines**, select **+ Create**, and then select **Azure virtual machine**.

1. On the **Basics** tab of **Create a virtual machine**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |  |
    | Virtual machine name | Enter **vm-1**. |
    | Region | Select **East US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Leave the default of **Standard**. |
    | Image | Select **Ubuntu Server 24.04 LTS - x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Size | Select a size. |
    | **Administrator account** |  |
    | Authentication type | Select **SSH public key**. |
    | Username | Enter **azureuser**. |
    | SSH public key source | Select **Generate new key pair**. |
    | Key pair name | Enter **vm-1-key**. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None**. |

1. Select the **Networking** tab. Enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Network interface** |  |
    | Virtual network | Select **vnet-1**. |
    | Subnet | Select **subnet-1 (10.0.0.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Basic**. |
  
1. Leave the rest of the settings at the defaults and select **Review + create**.

1. Review the settings and select **Create**.

> [!NOTE]
> Virtual machines in a virtual network with an Azure Bastion host don't need public IP addresses. Bastion provides the public IP, and the VMs use private IPs to communicate within the network. You can remove the public IPs from any VMs in Bastion-hosted virtual networks. For more information, see [Dissociate a public IP address from an Azure VM](../virtual-network/ip-services/remove-public-ip-address-vm.md).

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]

## Install tools on the virtual machine

Install **cifs-utils** and **Azure CLI** on the virtual machine by running a shell script through the Azure portal.

1. In the search box at the top of the portal, enter **Virtual machines**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. Under **Operations**, select **Run command**.

1. Select **RunShellScript**.

1. In the **Run Command Script** pane, enter the following script:

    ```bash
    #!/bin/bash
    sudo apt-get update
    sudo apt-get install -y cifs-utils
    curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
    ```

1. Select **Run**.

1. Wait for the script to complete. The output pane displays the installation progress and confirms successful installation.

## Create a storage account

Create an Azure storage account with a file share to use as the PaaS resource for testing connectivity through the service endpoint.

1. In the search box at the top of the portal, enter **Storage accounts**. Select **Storage accounts** in the search results.

1. Select **+ Create**.

1. On the **Basics** tab of **Create a storage account**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |  |
    | Storage account name | Enter a globally unique name, such as **storage1*\<unique-id\>***. |
    | Region | Select **East US 2**. |
    | Primary service | Select **Azure Files**. |
    | Performance | Select **Standard**. |
    | Redundancy | Select **Locally redundant storage (LRS)**. |

1. Select **Review + create**, then select **Create**.

1. After the storage account is created, navigate to the storage account resource.

1. Under **Data storage**, select **File shares**.

1. Select **+ File share**.

1. Enter **fileshare-1** for the name, and then select **Create**.

## Create a public IP prefix

Create a public IP prefix and a public IP address instance to use as a network identifier.

1. In the Azure portal, search for and select **Public IP Prefixes**.

1. Select **+ Create**.

1. Enter the following information:

    | Setting | Value |
    |---------|-------|
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | Name | Enter **public-ip-prefix**. |
    | Region | Select **East US 2**. |
    | IP version | Select **IPv4**. |
    | Prefix size | Select a prefix size based on your needs. |

1. Select **Review + create**, then select **Create**.

1. After the prefix is created, create a public IP address from the prefix. Search for and select **Public IP addresses**, then select **+ Create**. Associate it with the prefix you created.

## Configure service endpoints with a network identifier

This step is the key configuration for a standard service endpoint. You associate a public IP address as a network identifier with service endpoints on a subnet.

A network identifier is a public IP address that you assign to your service endpoint. The public IP isn't used for network routing decisions. When you create a public IP address within your subscription, it's automatically assigned from your service's designated IP pool. Services inside the network security perimeter use this public IP address to recognize service endpoint traffic and configure appropriate access rules.

1. In the Azure portal, search for and select **Virtual networks**.

1. Select **vnet-1**.

1. Under **Settings**, select **Subnets**.

1. Select **subnet-1**.

1. Under **Service endpoints**, select **Microsoft.Storage**.

1. In the **Network identifier** dropdown, select the public IP address you created in the previous step.

    > [!NOTE]
    > The same public IP address can be assigned to all subnets in a region within a subscription. The network identifier is supported across subscriptions during the public preview.

1. Select **Save**.

## Create a network security perimeter

Create a network security perimeter and associate your PaaS resources with it. If you already have a network security perimeter, skip to [Create a network security perimeter inbound access rule](#create-a-network-security-perimeter-inbound-access-rule).

For detailed steps, see [Quickstart: Create a network security perimeter - Azure portal](create-network-security-perimeter-portal.md).

1. In the Azure portal, search for and select **Network security perimeters**.

1. Select **+ Create**.

1. Enter the following information:

    | Setting | Value |
    |---------|-------|
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | Name | Enter **nsp-1**. |
    | Region | Select **East US 2**. |
    | Profile name | Enter **profile-1**. |

1. Select the **Resources** tab.

1. Select **+ Add** and add your storage account (for example, **storage1*\<unique-id\>***).

1. Select **Review + create**, then select **Create**.

## Create a network security perimeter inbound access rule

Add an IP-based inbound access rule in the network security perimeter to authorize traffic from your network identifier. This rule matches the public IP address to enable connectivity from your service endpoints.

1. In the Azure portal, navigate to **nsp-1**.

1. Select **profile-1**.

1. Under **Inbound access rules**, select **+ Add**.

1. Enter the following information:

    | Setting | Value |
    |---------|-------|
    | Rule name | Enter **allow-se-standard**. |
    | Source type | Select **IP address ranges**. |
    | Allowed Sources | Enter the public IP address or prefix associated with your network identifier. |

1. Select **Add**.

## Validate connectivity

Connect to your virtual machine with Azure Bastion and test connectivity to the storage account to validate that traffic is authorized by the network security perimeter inbound access rule.

### Connect to the virtual machine

1. In the search box at the top of the portal, enter **Virtual machines**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. Select **Connect**, then select **Connect via Bastion**.

1. In the **Bastion** page, enter the following information:

    | Setting | Value |
    |---|---|
    | Authentication Type | Select **SSH Private Key from Local File**. |
    | Username | Enter **azureuser**. |
    | Local File | Select the **vm-1-key.pem** file you downloaded when you created the virtual machine. |

1. Select **Connect**.

### Test connectivity to the storage account

1. In the SSH session on **vm-1**, sign in to Azure CLI:

    ```bash
    az login
    ```

1. Mount the Azure file share to validate connectivity to the storage account through the service endpoint. Replace `<storage-account-name>` with the name of your storage account:

    ```bash
    sudo mkdir -p /mnt/fileshare-1
    STORAGE_KEY=$(az storage account keys list \
        --resource-group test-rg \
        --account-name <storage-account-name> \
        --query "[0].value" -o tsv)

    sudo mount -t cifs //<storage-account-name>.file.core.windows.net/fileshare-1 /mnt/fileshare-1 \
        -o username=<storage-account-name>,password=$STORAGE_KEY,serverino,nosharesock,actimeo=30,mfsymlinks
    ```

1. Verify that the file share mounts successfully by listing the mount:

    ```bash
    df -h /mnt/fileshare-1
    ```

1. To confirm that the inbound access rule is working, check the network security perimeter diagnostic logs:

    1. Navigate to **nsp-1** in the Azure portal.
    1. Under **Monitoring**, check the diagnostic logs.
    1. Verify that the data plane traffic from your service endpoint is approved by the network security perimeter inbound access rule.

For more information about network security perimeter diagnostic logs, see [Diagnostic logging for network security perimeter](network-security-perimeter-diagnostic-logs.md).

## Clean up resources

When you no longer need the resources created in this article, delete the resource group that contains them. Deleting the resource group also deletes the virtual network, public IP prefix, network security perimeter, and all related resources.

1. In the Azure portal, search for and select **Resource groups**.

1. Select **test-rg**.

1. Select **Delete resource group**.

1. Enter the resource group name and select **Delete**.

## Next steps

- [Configure a standard service endpoint using the Azure CLI](configure-service-endpoint-standard-cli.md)
- [Configure a standard service endpoint using Azure PowerShell](configure-service-endpoint-standard-powershell.md)
- [What is a standard service endpoint?](service-endpoint-standard-overview.md)
- [What is a network security perimeter?](network-security-perimeter-concepts.md)
