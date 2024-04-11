---
title: Check security rules using NSG diagnostics
titleSuffix: Azure Network Watcher
description: Use NSG diagnostics to check if traffic is allowed or denied by network security group rules or Azure Virtual Network Manager security admin rules. 
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 08/15/2023
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Diagnose network security rules

You can use [network security groups](../virtual-network/network-security-groups-overview.md) to filter and control inbound and outbound network traffic to and from your Azure resources. You can also use [Azure Virtual Network Manager](../virtual-network-manager/overview.md) to apply admin security rules to your Azure resources to control network traffic.

In this article, you learn how to use Azure Network Watcher [NSG diagnostics](network-watcher-network-configuration-diagnostics-overview.md) to check and troubleshoot security rules applied to your Azure traffic. NSG diagnostics checks if the traffic is allowed or denied by applied security rules.

The example in this article shows you how a misconfigured network security group can prevent you from using Azure Bastion to connect to a virtual machine.

## Prerequisites

# [**Portal**](#tab/portal)

- An Azure account with an active subscription. [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Sign in to the [Azure portal](https://portal.azure.com/?WT.mc_id=A261C142F) with your Azure account.

# [**PowerShell**](#tab/powershell)

- An Azure account with an active subscription. [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

  You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

# [**Azure CLI**](#tab/cli)

- An Azure account with an active subscription. [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure Cloud Shell or Azure CLI.
    
    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.
    
    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

---

## Create a virtual network and a Bastion host

In this section, you create a virtual network with two subnets and an Azure Bastion host. The first subnet is used for the virtual machine, and the second subnet is used for the Bastion host. You also create a network security group and apply it to the first subnet.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter ***virtual networks***. Select **Virtual networks** in the search results.

    :::image type="content" source="./media/diagnose-network-security-rules/virtual-networks-portal-search.png" alt-text="Screenshot shows how to search for virtual networks in the Azure portal." lightbox="./media/diagnose-network-security-rules/virtual-networks-portal-search.png":::

1. Select **+ Create**. In **Create virtual network**, enter or select the following values in the **Basics** tab:

    | Setting | Value |
    | --- | --- |
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **Create new**. </br> Enter ***myResourceGroup*** in **Name**. </br> Select **OK**. |
    | **Instance details** |  |
    | Virtual network name | Enter ***myVNet***. |
    | Region | Select **(US) East US**. |

1. Select the **Security** tab, or select the **Next** button at the bottom of the page. 

1. Under **Azure Bastion**, select **Enable Azure Bastion** and accept the default values:

    | Setting | Value |
    | --- | --- |
    | Azure Bastion host name | **myVNet-Bastion**. |
    | Azure Bastion public IP Address | **(New) myVNet-bastion-publicIpAddress**. |

1. Select the **IP Addresses** tab, or select **Next** button at the bottom of the page.

1. Accept the default IP address space **10.0.0.0/16** and edit the default subnet by selecting the pencil icon. In the **Edit subnet** page, enter the following values:

    | Setting | Value |
    | --- | --- |
    | **Subnet details** | |
    | Name | Enter ***mySubnet***. |
    | **Security** | |
    | Network security group | Select **Create new**. </br> Enter ***mySubnet-nsg*** in **Name**. </br> Select **OK**. |

1. Select the **Review + create**.

1. Review the settings, and then select **Create**. 

# [**PowerShell**](#tab/powershell)

1. Create a resource group using [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). An Azure resource group is a logical container into which Azure resources are deployed and managed.

    ```azurepowershell-interactive
    # Create a resource group.
    New-AzResourceGroup -Name 'myResourceGroup' -Location 'eastus'
    ```

1. Create a default network security group using [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup).

    ```azurepowershell-interactive
    # Create a network security group.
    $networkSecurityGroup = New-AzNetworkSecurityGroup -Name 'mySubnet-nsg' -ResourceGroupName 'myResourceGroup' -Location 'eastus'
    ```

1. Create a subnet configuration for the virtual machine subnet and the Bastion host subnet using [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig).

    ```azurepowershell-interactive
    # Create subnets configuration.
    $firstSubnet = New-AzVirtualNetworkSubnetConfig -Name 'mySubnet' -AddressPrefix '10.0.0.0/24' -NetworkSecurityGroup $networkSecurityGroup
    $secondSubnet  = New-AzVirtualNetworkSubnetConfig -Name 'AzureBastionSubnet'  -AddressPrefix '10.0.1.0/26'
    ```

1. Create a virtual network using [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork).

    ```azurepowershell-interactive
    # Create a virtual network.
    $vnet = New-AzVirtualNetwork -Name 'myVNet' -ResourceGroupName 'myResourceGroup' -Location 'eastus' -AddressPrefix '10.0.0.0/16' -Subnet $firstSubnet, $secondSubnet
    ```

1.  Create the public IP address resource required for the Bastion host using [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress). 

    ```azurepowershell-interactive
    # Create a public IP address for Azure Bastion.
    New-AzPublicIpAddress -ResourceGroupName 'myResourceGroup' -Name 'myBastionIp' -Location 'eastus' -AllocationMethod 'Static' -Sku 'Standard'
    ```

1.  Create the Bastion host using [New-AzBastion](/powershell/module/az.network/new-azbastion). 

    ```azurepowershell-interactive
    # Create an Azure Bastion host.
    New-AzBastion -ResourceGroupName 'myResourceGroup' -Name 'myVNet-Bastion' --PublicIpAddressRgName 'myResourceGroup' -PublicIpAddressName 'myBastionIp' -VirtualNetwork $vnet
    ```

# [**Azure CLI**](#tab/cli)

1. Create a resource group using [az group create](/cli/azure/group#az-group-create). An Azure resource group is a logical container into which Azure resources are deployed and managed.

    ```azurecli-interactive
    # Create a resource group.
    az group create --name 'myResourceGroup' --location 'eastus'
    ```

1. Create a default network security group using [az network nsg create](/cli/azure/network/nsg#az-network-nsg-create).

    ```azurecli-interactive
    # Create a network security group.
    az network nsg create --name 'mySubnet-nsg' --resource-group 'myResourceGroup' --location 'eastus'
    ```

1. Create a virtual network using [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create).

    ```azurecli-interactive
    az network vnet create --resource-group 'myResourceGroup' --name 'myVNet' --subnet-name 'mySubnet' --subnet-prefixes 10.0.0.0/24 --network-security-group 'mySubnet-nsg' 
    ```

1. Create a subnet for Azure Bastion using [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create).

    ```azurecli-interactive
    # Create AzureBastionSubnet.
    az network vnet subnet create --name 'AzureBastionSubnet' --resource-group 'myResourceGroup' --vnet-name 'myVNet' --address-prefixes '10.0.1.0/26'
    ```

1. Create a public IP address for the Bastion host using [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create).

    ```azurecli-interactive
    # Create a public IP address resource.
    az network public-ip create --resource-group 'myResourceGroup' --name 'myBastionIp' --sku Standard
    ```

1. Create a Bastion host using [az network bastion create](/cli/azure/network/bastion#az-network-bastion-create). 

    ```azurecli-interactive
    az network bastion create --name 'myVNet-Bastion' --public-ip-address 'myBastionIp' --resource-group 'myResourceGroup' --vnet-name 'myVNet'
    ```

---

> [!IMPORTANT]
> Hourly pricing starts from the moment Bastion host is deployed, regardless of outbound data usage. For more information, see [Pricing](https://azure.microsoft.com/pricing/details/azure-bastion/). We recommend that you delete this resource once you've finished using it.

## Create a virtual machine

In this section, you create a virtual machine and a network security group applied to its network interface.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter ***virtual machines***. Select **Virtual machines** in the search results.

1. Select **+ Create** and then select **Azure virtual machine**.

1. In **Create a virtual machine**, enter or select the following values in the **Basics** tab:

    | Setting | Value |
    | --- | --- |
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **myResourceGroup**. |
    | **Instance details** |  |
    | Virtual machine name | Enter ***myVM***. |
    | Region | Select **(US) East US**. |
    | Availability Options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter: Azure Edition - x64 Gen2**. |
    | Size | Choose a size or leave the default setting. |
    | **Administrator account** |  |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |

1. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.

1. In the Networking tab, select the following values:

    | Setting | Value |
    | --- | --- |
    | **Network interface** |  |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **default**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Basic**. |
    | Public inbound ports | Select **None**. |

1. Select **Review + create**.

1. Review the settings, and then select **Create**. 

# [**PowerShell**](#tab/powershell)

1. Create a default network security group using [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup).

    ```azurepowershell-interactive
    # Create a default network security group.
    New-AzNetworkSecurityGroup -Name 'myVM-nsg' -ResourceGroupName 'myResourceGroup' -Location  eastus
    ```

1. Create a virtual machine using [New-AzVM](/powershell/module/az.compute/new-azvm). When prompted, enter a username and password.

    ```azurepowershell-interactive
    # Create a virtual machine using the latest Windows Server 2022 image.
    New-AzVm -ResourceGroupName 'myResourceGroup' -Name 'myVM' -Location 'eastus' -VirtualNetworkName 'myVNet' -SubnetName 'mySubnet' -SecurityGroupName 'myVM-nsg' -ImageName 'MicrosoftWindowsServer:WindowsServer:2022-Datacenter-azure-edition:latest'
    ```

# [**Azure CLI**](#tab/cli)

1. Create a default network security group using [az network nsg create](/cli/azure/network/nsg#az-network-nsg-create).

    ```azurecli-interactive
    # Create a default network security group.
    az network nsg create --name 'myVM-nsg' --resource-group 'myResourceGroup' --location 'eastus'
    ```

1. Create a virtual machine using [az vm create](/cli/azure/vm#az-vm-create). When prompted, enter a username and password.

    ```azurecli-interactive
    # Create a virtual machine using the latest Windows Server 2022 image.
    az vm create --resource-group 'myResourceGroup' --name 'myVM' --location 'eastus' --vnet-name 'myVNet' --subnet 'mySubnet' --public-ip-address '' --nsg 'myVM-nsg' --image 'Win2022AzureEditionCore'
    ```

---

## Add a security rule to the network security group

In this section, you add a security rule to the network security group associated with the network interface of **myVM**. The rule denies any inbound traffic from the virtual network.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter ***network security groups***. Select **Network security groups** in the search results.

1. From the list of network security groups, select **myVM-nsg**.

1. Under **Settings**, select **Inbound security rules**.

1. Select **+ Add**. In the Networking tab, enter or select the following values:

    | Setting | Value |
    | --- | --- |
    | Source | Select **Service Tag**. |
    | Source service tag | Select **VirtualNetwork**. |
    | Source port ranges | Enter *. |
    | Destination | Select **Any**. |
    | Service | Select **Custom**. |
    | Destination port ranges | Enter *. |
    | Protocol | Select **Any**. |
    | Action | Select **Deny**. |
    | Priority | Enter ***1000***. |
    | Name | Enter ***DenyVnetInBound***. |

1. Select **Add**.

    :::image type="content" source="./media/diagnose-network-security-rules/add-inbound-security-rule.png" alt-text="Screenshot shows how to add an inbound security rule to the network security group in the Azure portal.":::

# [**PowerShell**](#tab/powershell)

Use [Add-AzNetworkSecurityRuleConfig](/powershell/module/az.network/add-aznetworksecurityruleconfig) to create a security rule that denies traffic from the virtual network. Then use [Set-AzNetworkSecurityGroup](/powershell/module/az.network/set-aznetworksecuritygroup) to update the network security group with the new security rule.

```azurepowershell-interactive
# Place the network security group configuration into a variable.
$networkSecurityGroup = Get-AzNetworkSecurityGroup -Name 'myVM-nsg' -ResourceGroupName 'myResourceGroup'
# Create a security rule that denies inbound traffic from the virtual network service tag.
Add-AzNetworkSecurityRuleConfig -Name 'DenyVnetInBound' -NetworkSecurityGroup $networkSecurityGroup `
-Access 'Deny' -Protocol '*' -Direction 'Inbound' -Priority '1000' `
-SourceAddressPrefix 'virtualNetwork' -SourcePortRange '*' -DestinationAddressPrefix '*' -DestinationPortRange '*'
# Updates the network security group.
Set-AzNetworkSecurityGroup -NetworkSecurityGroup $networkSecurityGroup
```

# [**Azure CLI**](#tab/cli)

Use [az network nsg rule create](/cli/azure/network/nsg/rule#az-network-nsg-rule-create) to add to the network security group a security rule that denies traffic from the virtual network.

```azurecli-interactive
# Add to the network security group a security rule that denies inbound traffic from the virtual network service tag.
az network nsg rule create --name 'DenyVnetInBound' --resource-group 'myResourceGroup' --nsg-name 'myVM-nsg' --priority '1000' \
--access 'Deny' --protocol '*' --direction 'Inbound' --source-address-prefixes 'virtualNetwork' --source-port-ranges '*' \
--destination-address-prefixes '*' --destination-port-ranges '*'
```

---

> [!NOTE]
> The **VirtualNetwork** service tag represents the address space of the virtual network, all connected on-premises address spaces, peered virtual networks, virtual networks connected to a virtual network gateway, the virtual IP address of the host, and address prefixes used on user-defined routes. For more information, see [Service tags](../virtual-network/service-tags-overview.md).

## Check security rules applied to a virtual machine traffic

Use NSG diagnostics to check the security rules applied to the traffic originated from the Bastion subnet to the virtual machine. 

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, search for and select **Network Watcher**.

1. Under **Network diagnostic tools**, select **NSG diagnostics**.

1. On the **NSG diagnostics** page, enter or select the following values:

    | Setting | Value  |
    | ------- | ------ |
    | **Target resource** | |
    | Target resource type | Select **Virtual machine**. |
    | Virtual machine | Select **myVM** virtual machine. |
    | **Traffic details** | |
    | Protocol | Select **TCP**. Other available options are: **Any**, **UDP** and **ICMP**. |
    | Direction | Select **Inbound**. Other available option is: **Outbound**. |
    | Source type | Select **IPv4 address/CIDR**. Other available option is: **Service Tag**. |
    | IPv4 address/CIDR | Enter ***10.0.1.0/26***, which is the IP address range of the Bastion subnet. Acceptable values are: single IP address, multiple IP addresses, single IP prefix, multiple IP prefixes. |
    | Destination IP address | Leave the default of **10.0.0.4**, which is the IP address of **myVM**. |
    | Destination port | Enter * to include all ports. |

    :::image type="content" source="./media/diagnose-network-security-rules/nsg-diagnostics-vm-values.png" alt-text="Screenshot showing required values for NSG diagnostics to test inbound connections to a virtual machine in the Azure portal." lightbox="./media/diagnose-network-security-rules/nsg-diagnostics-vm-values.png":::

1. Select **Run NSG diagnostics** to run the test. Once NSG diagnostics completes checking all security rules, it displays the result.

    :::image type="content" source="./media/diagnose-network-security-rules/nsg-diagnostics-vm-test-result-denied.png" alt-text="Screenshot showing the result of inbound connections to the virtual machine as Denied." lightbox="./media/diagnose-network-security-rules/nsg-diagnostics-vm-test-result-denied.png":::

    The result shows that there are three security rules assessed for the inbound connection from the Bastion subnet:

    - **GlobalRules**: this security admin rule is applied at the virtual network level using Azure Virtual Network Manage. The rule allows inbound TCP traffic from the Bastion subnet to the virtual machine.
    - **mySubnet-nsg**: this network security group is applied at the subnet level (subnet of the virtual machine). The rule allows inbound TCP traffic from the Bastion subnet to the virtual machine.
    - **myVM-nsg**: this network security group is applied at the network interface (NIC) level. The rule denies inbound TCP traffic from the Bastion subnet to the virtual machine.

1. Select **View details** of **myVM-nsg** to see details about the security rules that this network security group has and which rule is denying the traffic.

    :::image type="content" source="./media/diagnose-network-security-rules/nsg-diagnostics-vm-test-result-denied-details.png" alt-text="Screenshot showing the details of the network security group that denied the traffic to the virtual machine." lightbox="./media/diagnose-network-security-rules/nsg-diagnostics-vm-test-result-denied-details.png":::  

    In **myVM-nsg** network security group, the security rule **DenyVnetInBound** denies any traffic coming from the address space of **VirtualNetwork** service tag to the virtual machine. The Bastion host uses IP addresses from the address range: **10.0.1.0/26**, which is included in **VirtualNetwork** service tag, to connect to the virtual machine. Therefore, the connection from the Bastion host is denied by the **DenyVnetInBound** security rule.

# [**PowerShell**](#tab/powershell)

Use [Invoke-AzNetworkWatcherNetworkConfigurationDiagnostic](/powershell/module/az.network/invoke-aznetworkwatchernetworkconfigurationdiagnostic) to start the NSG diagnostics session. 

```azurepowershell-interactive
# Create a profile for the diagnostic session.
$profile = New-AzNetworkWatcherNetworkConfigurationDiagnosticProfile -Direction Inbound -Protocol Tcp -Source 10.0.1.0/26 -Destination 10.0.0.4 -DestinationPort *
# Place the virtual machine configuration into a variable.
$vm = Get-AzVM -Name 'myVM' -ResourceGroupName 'myResourceGroup'
# Start the the NSG diagnostics session.
Invoke-AzNetworkWatcherNetworkConfigurationDiagnostic -Location 'eastus' -TargetResourceId $vm.Id -Profile $profile | Format-List
```

Output similar to the following example output is returned:

```output
Results     : {Microsoft.Azure.Commands.Network.Models.PSNetworkConfigurationDiagnosticResult}
ResultsText : [
                {
                  "Profile": {
                    "Direction": "Inbound",
                    "Protocol": "Tcp",
                    "Source": "10.0.1.0/26",
                    "Destination": "10.0.0.4",
                    "DestinationPort": "*"
                  },
                  "NetworkSecurityGroupResult": {
                    "SecurityRuleAccessResult": "Deny",
                    "EvaluatedNetworkSecurityGroups": [
                      {
                        "NetworkSecurityGroupId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/NetworkAdmin/providers/Microsoft.Network/networkManagers/GlobalRules",
                        "MatchedRule": {
                          "RuleName": "VirtualNetwork",
                          "Action": "Allow"
                        },
                        "RulesEvaluationResult": [
                          {
                            "Name": "VirtualNetwork",
                            "ProtocolMatched": true,
                            "SourceMatched": true,
                            "SourcePortMatched": true,
                            "DestinationMatched": true,
                            "DestinationPortMatched": true
                          }
                        ]
                      },
                      {
                        "NetworkSecurityGroupId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/mySubnet-nsg",
                        "MatchedRule": {
                          "RuleName": "DefaultRule_AllowVnetInBound",
                          "Action": "Allow"
                        },
                        "RulesEvaluationResult": [
                          {
                            "Name": "DefaultRule_AllowVnetInBound",
                            "ProtocolMatched": true,
                            "SourceMatched": true,
                            "SourcePortMatched": true,
                            "DestinationMatched": true,
                            "DestinationPortMatched": true
                          }
                        ]
                      },
                      {
                        "NetworkSecurityGroupId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myVM-nsg",
                        "MatchedRule": {
                          "RuleName": "UserRule_DenyVnetInBound",
                          "Action": "Deny"
                        },
                        "RulesEvaluationResult": [
                          {
                            "Name": "UserRule_DenyVnetInBound",
                            "ProtocolMatched": true,
                            "SourceMatched": true,
                            "SourcePortMatched": true,
                            "DestinationMatched": true,
                            "DestinationPortMatched": true
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
```

The result shows that there are three security rules assessed for the inbound connection from the Bastion subnet:

- **GlobalRules**: this security admin rule is applied at the virtual network level using Azure Virtual Network Manage. The rule allows inbound TCP traffic from the Bastion subnet to the virtual machine.
- **mySubnet-nsg**: this network security group is applied at the subnet level (subnet of the virtual machine). The rule allows inbound TCP traffic from the Bastion subnet to the virtual machine.
- **myVM-nsg**: this network security group is applied at the network interface (NIC) level. The rule denies inbound TCP traffic from the Bastion subnet to the virtual machine.

In **myVM-nsg** network security group, the security rule **DenyVnetInBound** denies any traffic coming from the address space of **VirtualNetwork** service tag to the virtual machine. The Bastion host uses IP addresses from **10.0.1.0/26**, which are included **VirtualNetwork** service tag, to connect to the virtual machine. Therefore, the connection from the Bastion host is denied by the **DenyVnetInBound** security rule.
# [**Azure CLI**](#tab/cli)

Use [az network watcher run-configuration-diagnostic](/cli/azure/network/watcher#az-network-watcher-run-configuration-diagnostic) to start the NSG diagnostics session.

```azurecli-interactive
# Start the the NSG diagnostics session.
az network watcher run-configuration-diagnostic --resource 'myVM' --resource-group 'myResourceGroup' --resource-type 'virtualMachines' --direction 'Inbound' --protocol 'TCP' --source '10.0.1.0/26' --destination '10.0.0.4' --port '*'
```

Output similar to the following example output is returned:

```output
{
  "results": [
    {
      "networkSecurityGroupResult": {
        "evaluatedNetworkSecurityGroups": [
          {
            "appliedTo": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVNet",
            "matchedRule": {
              "action": "Allow",
              "ruleName": "VirtualNetwork"
            },
            "networkSecurityGroupId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/NetworkAdmin/providers/Microsoft.Network/networkManagers/GlobalRules",
            "rulesEvaluationResult": [
              {
                "destinationMatched": true,
                "destinationPortMatched": true,
                "name": "VirtualNetwork",
                "protocolMatched": true,
                "sourceMatched": true,
                "sourcePortMatched": true
              }
            ]
          },
          {
            "appliedTo": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVNet/subnets/mySubnet",
            "matchedRule": {
              "action": "Allow",
              "ruleName": "DefaultRule_AllowVnetInBound"
            },
            "networkSecurityGroupId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/mySubnet-nsg",
            "rulesEvaluationResult": [
              {
                "destinationMatched": true,
                "destinationPortMatched": true,
                "name": "DefaultRule_AllowVnetInBound",
                "protocolMatched": true,
                "sourceMatched": true,
                "sourcePortMatched": true
              }
            ]
          },
          {
            "appliedTo": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/myvm36",
            "matchedRule": {
              "action": "Deny",
              "ruleName": "UserRule_DenyVnetInBound"
            },
            "networkSecurityGroupId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myVM-nsg",
            "rulesEvaluationResult": [
              {
                "destinationMatched": true,
                "destinationPortMatched": true,
                "name": "UserRule_DenyVnetInBound",
                "protocolMatched": true,
                "sourceMatched": true,
                "sourcePortMatched": true
              }
            ]
          }
        ],
        "securityRuleAccessResult": "Deny"
      },
      "profile": {
        "destination": "10.0.0.4",
        "destinationPort": "*",
        "direction": "Inbound",
        "protocol": "TCP",
        "source": "10.0.1.0/26"
      }
    }
  ]
}
```
The result shows that there are three security rules assessed for the inbound connection from the Bastion subnet:

- **GlobalRules**: this security admin rule is applied at the virtual network level using Azure Virtual Network Manage. The rule allows inbound TCP traffic from the Bastion subnet to the virtual machine.
- **mySubnet-nsg**: this network security group is applied at the subnet level (subnet of the virtual machine). The rule allows inbound TCP traffic from the Bastion subnet to the virtual machine.
- **myVM-nsg**: this network security group is applied at the network interface (NIC) level. The rule denies inbound TCP traffic from the Bastion subnet to the virtual machine.

In **myVM-nsg** network security group, the security rule **DenyVnetInBound** denies any traffic coming from the address space of **VirtualNetwork** service tag to the virtual machine. The Bastion host uses IP addresses from **10.0.1.0/26**, which are included **VirtualNetwork** service tag, to connect to the virtual machine. Therefore, the connection from the Bastion host is denied by the **DenyVnetInBound** security rule.

---

## Add a security rule to allow traffic from the Bastion subnet

To connect to **myVM** using Azure Bastion, traffic from the Bastion subnet must be allowed by the network security group. To allow traffic from **10.0.1.0/26**, add a security rule with a higher priority (lower priority number) than **DenyVnetInBound** rule or edit the **DenyVnetInBound** rule to allow traffic from the Bastion subnet.

# [**Portal**](#tab/portal)

You can add the security rule to the network security group from the Network Watcher page that showed you the details about the security rule denying the traffic to the virtual machine.

1. To add the security rule from within Network Watcher, select **+ Add security rule**, and then enter or select the following values:

    | Setting | Value |
    | --- | --- |
    | Source | Select **IP Addresses**. |
    | Source IP addresses/CIDR ranges | Enter ***10.0.1.0/26***, which is the IP address range of the Bastion subnet. |
    | Source port ranges | Enter *. |
    | Destination | Select **Any**. |
    | Service | Select **Custom**. |
    | Destination port ranges | Enter *. |
    | Protocol | Select **Any**. |
    | Action | Select **Allow**. |
    | Priority | Enter ***900***, which is higher priority than **1000** used for **DenyVnetInBound** rule. |
    | Name | Enter ***AllowBastionConnections***. |

    :::image type="content" source="./media/diagnose-network-security-rules/nsg-diagnostics-add-security-rule.png" alt-text="Screenshot showing how to add a new security rule to the network security group to allow the traffic to the virtual machine from the Bastion subnet." lightbox="./media/diagnose-network-security-rules/nsg-diagnostics-add-security-rule.png":::

1. Select **Recheck** to run the diagnostic session again. The diagnostic session should now show that the traffic from the Bastion subnet is allowed.

    :::image type="content" source="./media/diagnose-network-security-rules/nsg-diagnostics-vm-test-result-allowed-details.png" alt-text="Screenshot showing the details of the network security group after adding a security rule that allows the traffic to the virtual machine from the Bastion subnet." lightbox="./media/diagnose-network-security-rules/nsg-diagnostics-vm-test-result-allowed-details.png":::

    The security rule **AllowBastionConnections** allows the traffic from any IP address in **10.0.1.0/26** to the virtual machine. Because the Bastion host uses IP addresses from **10.0.1.0/26**, its connection to the virtual machine is allowed by the **AllowBastionConnections** security rule.

# [**PowerShell**](#tab/powershell)

1. Use [Add-AzNetworkSecurityRuleConfig](/powershell/module/az.network/add-aznetworksecurityruleconfig) to create a security rule that allows traffic from the Bastion subnet. Then use [Set-AzNetworkSecurityGroup](/powershell/module/az.network/set-aznetworksecuritygroup) to update the network security group with the new security rule.

    ```azurepowershell-interactive
    # Place the network security group configuration into a variable.
    $networkSecurityGroup = Get-AzNetworkSecurityGroup -Name 'myVM-nsg' -ResourceGroupName 'myResourceGroup'
    # Create a security rule.
    Add-AzNetworkSecurityRuleConfig -Name 'AllowBastionConnections' -NetworkSecurityGroup $networkSecurityGroup -Priority '900' -Access 'Allow' `
    -Protocol '*' -Direction 'Inbound' -SourceAddressPrefix '10.0.1.0/26' -SourcePortRange '*' -DestinationAddressPrefix '*' -DestinationPortRange '*'
    # Updates the network security group.
    Set-AzNetworkSecurityGroup -NetworkSecurityGroup $networkSecurityGroup 
    ```

1. Use [Invoke-AzNetworkWatcherNetworkConfigurationDiagnostic](/powershell/module/az.network/invoke-aznetworkwatchernetworkconfigurationdiagnostic) to recheck using a new NSG diagnostics session.

    ```azurepowershell-interactive
    # Create a profile for the diagnostic session.
    $profile = New-AzNetworkWatcherNetworkConfigurationDiagnosticProfile -Direction 'Inbound' -Protocol 'Tcp' -Source '10.0.1.0/26' -Destination '10.0.0.4' -DestinationPort '*'
    # Place the virtual machine configuration into a variable.
    $vm = Get-AzVM -Name 'myVM' -ResourceGroupName 'myResourceGroup'
    # Start the diagnostic session.
    Invoke-AzNetworkWatcherNetworkConfigurationDiagnostic -Location 'eastus' -TargetResourceId $vm.Id -Profile $profile | Format-List
    ```

    Output similar to the following example output is returned:

    ```output
    Results     : {Microsoft.Azure.Commands.Network.Models.PSNetworkConfigurationDiagnosticResult}
    ResultsText : [
                    {
                      "Profile": {
                        "Direction": "Inbound",
                        "Protocol": "Tcp",
                        "Source": "10.0.1.0/26",
                        "Destination": "10.0.0.4",
                        "DestinationPort": "*"
                      },
                      "NetworkSecurityGroupResult": {
                        "SecurityRuleAccessResult": "Allow",
                        "EvaluatedNetworkSecurityGroups": [
                          {
                            "NetworkSecurityGroupId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/NetworkAdmin/providers/Microsoft.Network/networkManagers/GlobalRules",
                            "MatchedRule": {
                              "RuleName": "VirtualNetwork",
                              "Action": "Allow"
                            },
                            "RulesEvaluationResult": [
                              {
                                "Name": "VirtualNetwork",
                                "ProtocolMatched": true,
                                "SourceMatched": true,
                                "SourcePortMatched": true,
                                "DestinationMatched": true,
                                "DestinationPortMatched": true
                              }
                            ]
                          },
                          {
                            "NetworkSecurityGroupId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/mySubnet-nsg",
                            "MatchedRule": {
                              "RuleName": "DefaultRule_AllowVnetInBound",
                              "Action": "Allow"
                            },
                            "RulesEvaluationResult": [
                              {
                                "Name": "DefaultRule_AllowVnetInBound",
                                "ProtocolMatched": true,
                                "SourceMatched": true,
                                "SourcePortMatched": true,
                                "DestinationMatched": true,
                                "DestinationPortMatched": true
                              }
                            ]
                          },
                          {
                            "NetworkSecurityGroupId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myVM-nsg",
                            "MatchedRule": {
                              "RuleName": "UserRule_AllowBastionConnections",
                              "Action": "Allow"
                            },
                            "RulesEvaluationResult": [
                              {
                                "Name": "UserRule_AllowBastionConnections",
                                "ProtocolMatched": true,
                                "SourceMatched": true,
                                "SourcePortMatched": true,
                                "DestinationMatched": true,
                                "DestinationPortMatched": true
                              }
                            ]
                          }
                        ]
                      }
                    }
                  ]
    ```

    The security rule **AllowBastionConnections** allows the traffic from any IP address in **10.0.1.0/26** to the virtual machine. Because the Bastion host uses IP addresses from **10.0.1.0/26**, its connection to the virtual machine is allowed by the **AllowBastionConnections** security rule.

# [**Azure CLI**](#tab/cli)

1. Use [az network nsg rule create](/cli/azure/network/nsg/rule#az-network-nsg-rule-create) to add to the network security group a security rule that allows traffic from the Bastion subnet.

    ```azurecli-interactive
    # Add a security rule to the network security group.
    az network nsg rule create --name 'AllowBastionConnections' --resource-group 'myResourceGroup' --nsg-name 'myVM-nsg' --priority '900' \
    --access 'Allow' --protocol '*' --direction 'Inbound' --source-address-prefixes '10.0.1.0/26' --source-port-ranges '*' \
    --destination-address-prefixes '*' --destination-port-ranges '*'
    ```

1. Use [az network watcher run-configuration-diagnostic](/cli/azure/network/watcher#az-network-watcher-run-configuration-diagnostic) to recheck using a new NSG diagnostics session.

    ```azurecli-interactive
    # Start the the NSG diagnostics session.
    az network watcher run-configuration-diagnostic --resource 'myVM' --resource-group 'myResourceGroup' --resource-type 'virtualMachines' --direction 'Inbound' --protocol 'TCP' --source '10.0.1.0/26' --destination '10.0.0.4' --port '*'
    ```

    Output similar to the following example output is returned:

    ```output
    {
      "results": [
        {
          "networkSecurityGroupResult": {
            "evaluatedNetworkSecurityGroups": [
              {
                "appliedTo": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVNet",
                "matchedRule": {
                  "action": "Allow",
                  "ruleName": "VirtualNetwork"
                },
                "networkSecurityGroupId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/NetworkAdmin/providers/Microsoft.Network/networkManagers/GlobalRules",
                "rulesEvaluationResult": [
                  {
                    "destinationMatched": true,
                    "destinationPortMatched": true,
                    "name": "VirtualNetwork",
                    "protocolMatched": true,
                    "sourceMatched": true,
                    "sourcePortMatched": true
                  }
                ]
              },
              {
                "appliedTo": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVNet/subnets/mySubnet",
                "matchedRule": {
                  "action": "Allow",
                  "ruleName": "DefaultRule_AllowVnetInBound"
                },
                "networkSecurityGroupId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/mySubnet-nsg",
                "rulesEvaluationResult": [
                  {
                    "destinationMatched": true,
                    "destinationPortMatched": true,
                    "name": "DefaultRule_AllowVnetInBound",
                    "protocolMatched": true,
                    "sourceMatched": true,
                    "sourcePortMatched": true
                  }
                ]
              },
              {
                "appliedTo": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/myvm36",
                "matchedRule": {
                  "action": "Allow",
                  "ruleName": "UserRule_AllowBastionConnections"
                },
                "networkSecurityGroupId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myVM-nsg",
                "rulesEvaluationResult": [
                  {
                    "destinationMatched": true,
                    "destinationPortMatched": true,
                    "name": "UserRule_AllowBastionConnections",
                    "protocolMatched": true,
                    "sourceMatched": true,
                    "sourcePortMatched": true
                  }
                ]
              }
            ],
            "securityRuleAccessResult": "Allow"
          },
          "profile": {
            "destination": "10.0.0.4",
            "destinationPort": "*",
            "direction": "Inbound",
            "protocol": "TCP",
            "source": "10.0.1.0/26"
          }
        }
      ]
    }
    ```

    The security rule **AllowBastionConnections** allows the traffic from any IP address in **10.0.1.0/26** to the virtual machine. Because the Bastion host uses IP addresses from **10.0.1.0/26**, its connection to the virtual machine is allowed by the **AllowBastionConnections** security rule.

---

## Clean up resources

When no longer needed, delete the resource group and all of the resources it contains:

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter ***myResourceGroup***. Select **myResourceGroup** from the search results.

1. Select **Delete resource group**.

1. In **Delete a resource group**, enter ***myResourceGroup***, and then select **Delete**.

1. Select **Delete** to confirm the deletion of the resource group and all its resources.

# [**PowerShell**](#tab/powershell)

Use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to delete the resource group and all of the resources it contains.

```azurepowershell-interactive
# Delete the resource group and all the resources it contains. 
Remove-AzResourceGroup -Name 'myResourceGroup' -Force
```

# [**Azure CLI**](#tab/cli)

Use [az group delete](/cli/azure/group#az-group-delete) to remove the resource group and all of the resources it contains

```azurecli-interactive
# Delete the resource group and all the resources it contains. 
az group delete --name 'myResourceGroup' --yes --no-wait
```

---

## Next steps
- To learn about other Network Watcher tools, see [What is Azure Network Watcher?](network-watcher-overview.md)
- To learn how to troubleshoot virtual machine routing problems, see [Diagnose a virtual machine network routing problem](diagnose-vm-network-routing-problem.md).