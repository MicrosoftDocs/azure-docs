---
title: Create and associate service endpoint policies
titlesuffix: Azure Virtual Network
description: In this article, learn how to set up and associated service endpoint policies.
author: asudbring
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 08/20/2024
ms.author: allensu
---

# Create and associate service endpoint policies

Service endpoint policies enable you to filter virtual network traffic to specific Azure resources, over service endpoints. If you're not familiar with service endpoint policies, see [service endpoint policies overview](virtual-network-service-endpoint-policies-overview.md) to learn more.

 In this tutorial, you learn how to:

> [!div class="checklist"]
* Create a virtual network.
* Add a subnet and enable service endpoint for Azure Storage.
* Create two Azure Storage accounts and allow network access to it from the subnet created above.
* Create a service endpoint policy to allow access only to one of the storage accounts.
* Deploy a virtual machine (VM) to the subnet.
* Confirm access to the allowed storage account from the subnet.
* Confirm access is denied to the non-allowed storage account from the subnet.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure 

Sign in to the [Azure portal](https://portal.azure.com).

## Create a virtual network

1. In the search box in the portal, enter **Virtual networks**. Select **Virtual networks** in the search results.

1. Select **+ Create** to create a new virtual network.

1. Enter or select the following information in the **Basics** tab of **Create virtual network**.

    | Setting | Value |
    | -------| ------- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **test-rg** in **Name**. </br> Select **OK**. |
    | Name | Enter **vnet-1**. |
    | Region | Select **West US 2**. |

1. Select **Next**.

1. Select **Next**.

1. In the **IP addresses** tab, in **Subnets**, select the **default** subnet.

1. Enter or select the following information in **Edit subnet**.

    | Setting | Value |
    | -------| ------- |
    | Name | Enter **subnet-1**. |
    | **Service Endpoints** | |
    | **Services** |  |
    | In the pull-down menu, select **Microsoft.Storage**. |

1. Select **Save**.

1. Select **Review + Create**.

1. Select **Create**.

## Restrict network access for the subnet

### Create a network security group

1. In the search box in the portal, enter **Network security groups**. Select **Network security groups** in the search results.

1. Select **+ Create** to create a new network security group.

1. In the **Basics** tab of **Create network security group**, enter or select the following information.

    | Setting | Value |
    | -------| ------- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | Name | Enter **nsg-1**. |
    | Region | Select **West US 2**. |

1. Select **Review + Create**.

1. Select **Create**.

### Create network security group rules

1. In the search box in the portal, enter **Network security groups**. Select **Network security groups** in the search results.

1. Select **nsg-1**.

1. Expand **Settings**. Select **Outbound security rules**.

1. Select **+ Add** to add a new outbound security rule.

1. In **Add outbound security rule**, enter or select the following information.

    | Setting | Value |
    | -------| ------- |
    | Source | Select **Service Tag**. |
    | Source service tag | Select **VirtualNetwork**. |
    | Source port ranges | Enter **\***. |
    | Destination | Select **Service Tag**. |
    | Destination service tag | Select **Storage**. |
    | Service | Select **Custom**. |
    | Destination port ranges | Enter **\***. |
    | Protocol | Select **Any**. |
    | Action | Select **Allow**. |
    | Priority | Enter **100**. |
    | Name | Enter **allow-storage-all**. |

1. Select **Add**.

1. Select **+ Add** to add another outbound security rule.

1. In **Add outbound security rule**, enter or select the following information.

    | Setting | Value |
    | -------| ------- |
    | Source | Select **Service Tag**. |
    | Source service tag | Select **VirtualNetwork**. |
    | Source port ranges | Enter **\***. |
    | Destination | Select **Service Tag**. |
    | Destination service tag | Select **Internet**. |
    | Service | Select **Custom**. |
    | Destination port ranges | Enter **\***. |
    | Protocol | Select **Any**. |
    | Action | Select **Deny**. |
    | Priority | Enter **110**. |
    | Name | Enter **deny-internet-all**. |

1. Select **Add**.

1. Expand **Settings**. Select **Subnets**.

1. Select **Associate**.

1. In **Associate subnet**, enter or select the following information.

    | Setting | Value |
    | -------| ------- |
    | Virtual network | Select **vnet-1 (test-rg)**. |
    | Subnet | Select **subnet-1**. |

1. Select **OK**.

## Restrict network access to Azure Storage accounts

### Create two storage accounts

1. In the search box in the portal, enter **Storage accounts**. Select **Storage accounts** in the search results.

1. Select **+ Create** to create a new storage account.

1. In **Create a storage account**, enter or select the following information.

    | Setting | Value |
    | -------| ------- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** | |
    | Storage account name | Enter **allowedaccount(random-number)**. </br> **Note: The storage account name must be unique. Add a random number to the end of the name allowedaccount**. |
    | Region | Select **West US 2**. |
    | Performance | Select **Standard**. |
    | Redundancy | Select **Locally-redundant storage (LRS)**. |

1. Select **Review + Create**.

1. Select **Create**.

1. Repeat the steps above to create another storage account with the following information.

    | Setting | Value |
    | -------| ------- |
    | Storage account name | Enter **deniedaccount(random-number)**. |

### Create file shares

1. In the search box in the portal, enter **Storage accounts**. Select **Storage accounts** in the search results.

1. Select **allowedaccount(random-number)**.

1. Expand the **Data storage** section and select **File shares**.

1. Select **+ File share**.

1. In **New file share**, enter or select the following information.

    | Setting | Value |
    | -------| ------- |
    | Name | Enter **file-share**. |

1. Leave the rest of the settings as default and select **Review + create**.

1. Select **Create**.

1. Repeat the steps above to create a file share in **deniedaccount(random-number)**.

### Deny all network access to a storage accounts

1. In the search box in the portal, enter **Storage accounts**. Select **Storage accounts** in the search results.

1. Select **allowedaccount(random-number)**.

1. Expand **Security + networking** and select **Networking**.

1. In **Firewalls and virtual networks**, in **Public network access**, select **Enabled from selected virtual networks and IP addresses**.

1. In **Virtual networks**, select **+ Add existing virtual network**.

1. In **Add networks**, enter or select the following information.

    | Setting | Value |
    | -------| ------- |
    | Subscription | Select your subscription. |
    | Virtual networks | Select **vnet-1**. |
    | Subnets | Select **subnet-1**. |

1. Select **Add**.

1. Select **Save**.

1. Repeat the steps above to deny network access to **deniedaccount(random-number)**.

## Apply policy to allow access to valid storage account

### Create a service endpoint policy

1. In the search box in the portal, enter **Service endpoint policy**. Select **Service endpoint policies** in the search results.

1. Select **+ Create** to create a new service endpoint policy.

1. Enter or select the following information in the **Basics** tab of **Create a service endpoint policy**.

    | Setting | Value |
    | -------| ------- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** | |
    | Name | Enter **service-endpoint-policy**. |
    | Location | Select **West US 2**. |

1. Select **Next: Policy definitions**.

1. Select **+ Add a resource** in **Resources**.

1. In **Add a resource**, enter or select the following information:

    | Setting | Value |
    | -------| ------- |
    | Service | Select **Microsoft.Storage**. |
    | Scope | Select **Single account** |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | Resource | Select **allowedaccount(random-number)** |

1. Select **Add**.

1. Select **Review + Create**.

1. Select **Create**.

## Associate a service endpoint policy to a subnet

1. In the search box in the portal, enter **Service endpoint policy**. Select **Service endpoint policies** in the search results.

1. Select **service-endpoint-policy**.

1. Expand **Settings** and select **Associated subnets**.

1. Select **+ Edit subnet association**.

1. In **Edit subnet association**, select **vnet-1** and **subnet-1**.

1. Select **Apply**.

>[!WARNING] 
> Ensure that all the resources accessed from the subnet are added to the policy definition before associating the policy to the given subnet. Once the policy is associated, only access to the *allow listed* resources will be allowed over service endpoints. 
>
> Ensure that no managed Azure services exist in the subnet that is being associated to the service endpoint policy.
>
> Access to Azure Storage resources in all regions will be restricted as per Service Endpoint Policy from this subnet.

## Validate access restriction to Azure Storage accounts

### Deploy the virtual machine

1. In the search box in the portal, enter **Virtual machines**. Select **Virtual machines** in the search results.

1. In the **Basics** tab of **Create a virtual machine**, enter or select the following information:

    | Setting | Value |
    | -------| ------- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** | |
    | Virtual machine name | Enter **vm-1**. |
    | Region | Select **(US) West US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter** - x64 Gen2**. |
    | Size | Select a size. |
    | **Administrator account** | |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Enter the password again. |
    | **Inbound port rules** | |

1. Select **Next: Disks**, then select **Next: Networking**.

1. In the **Networking** tab, enter or select the following information.

    | Setting | Value |
    | -------| ------- |
    | **Network interface** | |
    | Virtual network | Select **vnet-1**. |
    | Subnet | Select **subnet-1* (10.0.0.0/24)*. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **None**. |

1. Leave the rest of the settings as default and select **Review + Create**.

1. Select **Create**.

### Confirm access to the *allowed* storage account

1. In the search box in the portal, enter **Storage accounts**. Select **Storage accounts** in the search results.

1. Select **allowedaccount(random-number)**.

1. Expand **Security + networking** and select **Access keys**.

1. Copy the **key1** value. You will use this key to map a drive to the storage account from the virtual machine you created earlier.

1. In the search box in the portal, enter **Virtual machines**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. Expand **Operations**. Select **Run command**.

1. Select **RunPowerShellScript**.

1. Paste the following script in **Run Command Script**.

    ```powershell
    ## Enter the storage account key for the allowed storage account that you recorded earlier.
    $storageAcctKey1 = (pasted from procedure above)
    $acctKey = ConvertTo-SecureString -String $storageAcctKey1 -AsPlainText -Force
    ## Replace the login account with the name of the storage account you created.
    $credential = New-Object System.Management.Automation.PSCredential -ArgumentList ("Azure\allowedaccount"), $acctKey
    ## Replace the storage account name with the name of the storage account you created.
    New-PSDrive -Name Z -PSProvider FileSystem -Root "\\allowedaccount.file.core.windows.net\file-share" -Credential $credential
    ```

1. Select **Run**.

1. If the drive map is successful, the output in the **Output** box looks similar to the following example:

    ```output
    Name           Used (GB)     Free (GB) Provider      Root
    ----           ---------     --------- --------      ----
    Z                                      FileSystem    \\allowedaccount.file.core.windows.net\fil..
    ```

### Confirm access is denied to the *denied* storage account

1. In the search box in the portal, enter **Storage accounts**. Select **Storage accounts** in the search results.

1. Select **deniedaccount(random-number)**.

1. Expand **Security + networking** and select **Access keys**.

1. Copy the **key1** value. You will use this key to map a drive to the storage account from the virtual machine you created earlier.

1. In the search box in the portal, enter **Virtual machines**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. Expand **Operations**. Select **Run command**.

1. Select **RunPowerShellScript**.

1. Paste the following script in **Run Command Script**.

    ```powershell
    ## Enter the storage account key for the denied storage account that you recorded earlier.
    $storageAcctKey2 = (pasted from procedure above)
    $acctKey = ConvertTo-SecureString -String $storageAcctKey2 -AsPlainText -Force
    ## Replace the login account with the name of the storage account you created.
    $credential = New-Object System.Management.Automation.PSCredential -ArgumentList ("Azure\deniedaccount"), $acctKey
    ## Replace the storage account name with the name of the storage account you created.
    New-PSDrive -Name Z -PSProvider FileSystem -Root "\\deniedaccount.file.core.windows.net\file-share" -Credential $credential
    ```

1. Select **Run**.

1. You will receive the following error message in the **Output** box:

    ```output
    New-PSDrive : Access is denied
    At line:1 char:1
    + New-PSDrive -Name Z -PSProvider FileSystem -Root "\\deniedaccount8675 ...
    + ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidOperation: (Z:PSDriveInfo) [New-PSDrive], Win32Exception
    + FullyQualifiedErrorId : CouldNotMapNetworkDrive,Microsoft.PowerShell.Commands.NewPSDriveCommand
    ```
1. The drive map is denied because of the service endpoint policy that restricts access to the storage account.

[!INCLUDE [portal-clean-up.md](~/reusable-content/ce-skilling/azure/includes/portal-clean-up.md)]

## Next steps
In this tutorial, you created a service endpoint policy and associated it to a subnet. To learn more about service endpoint policies, see [service endpoint policies overview.](virtual-network-service-endpoint-policies-overview.md)
