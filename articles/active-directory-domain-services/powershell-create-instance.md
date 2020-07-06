---
title: Enable Azure DS Domain Services using PowerShell | Microsoft Docs
description: Learn how to configure and enable Azure Active Directory Domain Services using Azure AD PowerShell and Azure PowerShell.
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.assetid: d4bc5583-6537-4cd9-bc4b-7712fdd9272a
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: sample
ms.date: 09/05/2019
ms.author: iainfou

---
# Enable Azure Active Directory Domain Services using PowerShell

Azure Active Directory Domain Services (Azure AD DS) provides managed domain services such as domain join, group policy, LDAP, Kerberos/NTLM authentication that is fully compatible with Windows Server Active Directory. You consume these domain services without deploying, managing, and patching domain controllers yourself. Azure AD DS integrates with your existing Azure AD tenant. This integration lets users sign in using their corporate credentials, and you can use existing groups and user accounts to secure access to resources.

This article shows you how to enable Azure AD DS using PowerShell.

[!INCLUDE [updated-for-az.md](../../includes/updated-for-az.md)]

## Prerequisites

To complete this article, you need the following resources:

* Install and configure Azure PowerShell.
    * If needed, follow the instructions to [install the Azure PowerShell module and connect to your Azure subscription](/powershell/azure/install-az-ps).
    * Make sure that you sign in to your Azure subscription using the [Connect-AzAccount][Connect-AzAccount] cmdlet.
* Install and configure Azure AD PowerShell.
    * If needed, follow the instructions to [install the Azure AD PowerShell module and connect to Azure AD](/powershell/azure/active-directory/install-adv2).
    * Make sure that you sign in to your Azure AD tenant using the [Connect-AzureAD][Connect-AzureAD] cmdlet.
* You need *global administrator* privileges in your Azure AD tenant to enable Azure AD DS.
* You need *Contributor* privileges in your Azure subscription to create the required Azure AD DS resources.

## Create required Azure AD resources

Azure AD DS requires a service principal and an Azure AD group. These resources let the Azure AD DS managed domain synchronize data, and define which users have administrative permissions in the managed domain.

First, create an Azure AD service principal for Azure AD DS to communicate and authenticate itself. A specific application ID is used named *Domain Controller Services* with an ID of *2565bd9d-da50-47d4-8b85-4c97f669dc36*. Don't change this application ID.

Create an Azure AD service principal using the [New-AzureADServicePrincipal][New-AzureADServicePrincipal] cmdlet:

```powershell
New-AzureADServicePrincipal -AppId "2565bd9d-da50-47d4-8b85-4c97f669dc36"
```

Now create an Azure AD group named *AAD DC Administrators*. Users added to this group are then granted permissions to perform administration tasks on the managed domain.

Create the *AAD DC Administrators* group using the [New-AzureADGroup][New-AzureADGroup] cmdlet:

```powershell
New-AzureADGroup -DisplayName "AAD DC Administrators" `
  -Description "Delegated group to administer Azure AD Domain Services" `
  -SecurityEnabled $true -MailEnabled $false `
  -MailNickName "AADDCAdministrators"
```

With the *AAD DC Administrators* group created, add a user to the group using the [Add-AzureADGroupMember][Add-AzureADGroupMember] cmdlet. You first get the *AAD DC Administrators* group object ID using the [Get-AzureADGroup][Get-AzureADGroup] cmdlet, then the desired user's object ID using the [Get-AzureADUser][Get-AzureADUser] cmdlet.

In the following example, the user object ID for the account with a UPN of `admin@aaddscontoso.onmicrosoft.com`. Replace this user account with the UPN of the user you wish to add to the *AAD DC Administrators* group:

```powershell
# First, retrieve the object ID of the newly created 'AAD DC Administrators' group.
$GroupObjectId = Get-AzureADGroup `
  -Filter "DisplayName eq 'AAD DC Administrators'" | `
  Select-Object ObjectId

# Now, retrieve the object ID of the user you'd like to add to the group.
$UserObjectId = Get-AzureADUser `
  -Filter "UserPrincipalName eq 'admin@aaddscontoso.onmicrosoft.com'" | `
  Select-Object ObjectId

# Add the user to the 'AAD DC Administrators' group.
Add-AzureADGroupMember -ObjectId $GroupObjectId.ObjectId -RefObjectId $UserObjectId.ObjectId
```

## Create supporting Azure resources

First, register the Azure AD Domain Services resource provider using the [Register-AzResourceProvider][Register-AzResourceProvider] cmdlet:

```powershell
Register-AzResourceProvider -ProviderNamespace Microsoft.AAD
```

Next, create a resource group using the [New-AzResourceGroup][New-AzResourceGroup] cmdlet. In the following example, the resource group is named *myResourceGroup* and is created in the *westus* region. Use your own name and desired region:

```powershell
$ResourceGroupName = "myResourceGroup"
$AzureLocation = "westus"

# Create the resource group.
New-AzResourceGroup `
  -Name $ResourceGroupName `
  -Location $AzureLocation
```

Create the virtual network and subnets for Azure AD Domain Services. Two subnets are created - one for *DomainServices*, and one for *Workloads*. Azure AD DS is deployed into the dedicated *DomainServices* subnet. Don't deploy other applications or workloads into this subnet. Use the separate *Workloads* or other subnets for the rest of your VMs.

Create the subnets using the [New-AzVirtualNetworkSubnetConfig][New-AzVirtualNetworkSubnetConfig] cmdlet, then create the virtual network using the [New-AzVirtualNetwork][New-AzVirtualNetwork] cmdlet.

```powershell
$VnetName = "myVnet"

# Create the dedicated subnet for AAD Domain Services.
$AaddsSubnet = New-AzVirtualNetworkSubnetConfig `
  -Name DomainServices `
  -AddressPrefix 10.0.0.0/24

$WorkloadSubnet = New-AzVirtualNetworkSubnetConfig `
  -Name Workloads `
  -AddressPrefix 10.0.1.0/24

# Create the virtual network in which you will enable Azure AD Domain Services.
$Vnet= New-AzVirtualNetwork `
  -ResourceGroupName $ResourceGroupName `
  -Location westus `
  -Name $VnetName `
  -AddressPrefix 10.0.0.0/16 `
  -Subnet $AaddsSubnet,$WorkloadSubnet
```

## Create a managed domain

Now let's create a managed domain. Set your Azure subscription ID, and then provide a name for the managed domain, such as *aaddscontoso.com*. You can get your subscription ID using the [Get-AzSubscription][Get-AzSubscription] cmdlet.

If you choose a region that supports Availability Zones, the Azure AD DS resources are distributed across zones for additional redundancy.

Availability Zones are unique physical locations within an Azure region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking. To ensure resiliency, there's a minimum of three separate zones in all enabled regions.

There's nothing for you to configure for Azure AD DS to be distributed across zones. The Azure platform automatically handles the zone distribution of resources. For more information and to see region availability, see [What are Availability Zones in Azure?][availability-zones].

```powershell
$AzureSubscriptionId = "YOUR_AZURE_SUBSCRIPTION_ID"
$ManagedDomainName = "aaddscontoso.com"

# Enable Azure AD Domain Services for the directory.
New-AzResource -ResourceId "/subscriptions/$AzureSubscriptionId/resourceGroups/$ResourceGroupName/providers/Microsoft.AAD/DomainServices/$ManagedDomainName" `
  -Location $AzureLocation `
  -Properties @{"DomainName"=$ManagedDomainName; `
    "SubnetId"="/subscriptions/$AzureSubscriptionId/resourceGroups/$ResourceGroupName/providers/Microsoft.Network/virtualNetworks/$VnetName/subnets/DomainServices"} `
  -Force -Verbose
```

It takes a few minutes to create the resource and return control to the PowerShell prompt. The managed domain continues to be provisioned in the background, and can take up to an hour to complete the deployment. In the Azure portal, the **Overview** page for your managed domain shows the current status throughout this deployment stage.

When the Azure portal shows that the managed domain has finished provisioning, the following tasks need to be completed:

* Update DNS settings for the virtual network so virtual machines can find the managed domain for domain join or authentication.
    * To configure DNS, select your managed domain in the portal. On the **Overview** window, you are prompted to automatically configure these DNS settings.
* If you created a managed domain in a region that supports Availability Zones, create a network security group to restrict traffic in the virtual network for the managed domain. An Azure standard load balancer is created that requires these rules to be place. This network security group secures Azure AD DS and is required for the managed domain to work correctly.
    * To create the network security group and required rules, select your managed domain in the portal. On the **Overview** window, you are prompted to automatically create and configure the network security group.
* [Enable password synchronization to Azure AD Domain Services](tutorial-create-instance.md#enable-user-accounts-for-azure-ad-ds) so end users can sign in to the managed domain using their corporate credentials.

## Complete PowerShell script

The following complete PowerShell script combines all of the tasks shown in this article. Copy the script and save it to a file with a `.ps1` extension. Run the script in a local PowerShell console or the [Azure Cloud Shell][cloud-shell].

> [!NOTE]
> To enable Azure AD DS, you must be a global administrator for the Azure AD tenant. You also need at least *Contributor* privileges in the Azure subscription.

```powershell
# Change the following values to match your deployment.
$AaddsAdminUserUpn = "admin@aaddscontoso.onmicrosoft.com"
$ResourceGroupName = "myResourceGroup"
$VnetName = "myVnet"
$AzureLocation = "westus"
$AzureSubscriptionId = "YOUR_AZURE_SUBSCRIPTION_ID"
$ManagedDomainName = "aaddscontoso.com"

# Connect to your Azure AD directory.
Connect-AzureAD

# Login to your Azure subscription.
Connect-AzAccount

# Create the service principal for Azure AD Domain Services.
New-AzureADServicePrincipal -AppId "2565bd9d-da50-47d4-8b85-4c97f669dc36"

# Create the delegated administration group for AAD Domain Services.
New-AzureADGroup -DisplayName "AAD DC Administrators" `
  -Description "Delegated group to administer Azure AD Domain Services" `
  -SecurityEnabled $true -MailEnabled $false `
  -MailNickName "AADDCAdministrators"

# First, retrieve the object ID of the newly created 'AAD DC Administrators' group.
$GroupObjectId = Get-AzureADGroup `
  -Filter "DisplayName eq 'AAD DC Administrators'" | `
  Select-Object ObjectId

# Now, retrieve the object ID of the user you'd like to add to the group.
$UserObjectId = Get-AzureADUser `
  -Filter "UserPrincipalName eq '$AaddsAdminUserUpn'" | `
  Select-Object ObjectId

# Add the user to the 'AAD DC Administrators' group.
Add-AzureADGroupMember -ObjectId $GroupObjectId.ObjectId -RefObjectId $UserObjectId.ObjectId

# Register the resource provider for Azure AD Domain Services with Resource Manager.
Register-AzResourceProvider -ProviderNamespace Microsoft.AAD

# Create the resource group.
New-AzResourceGroup `
  -Name $ResourceGroupName `
  -Location $AzureLocation

# Create the dedicated subnet for AAD Domain Services.
$AaddsSubnet = New-AzVirtualNetworkSubnetConfig `
  -Name DomainServices `
  -AddressPrefix 10.0.0.0/24

$WorkloadSubnet = New-AzVirtualNetworkSubnetConfig `
  -Name Workloads `
  -AddressPrefix 10.0.1.0/24

# Create the virtual network in which you will enable Azure AD Domain Services.
$Vnet=New-AzVirtualNetwork `
  -ResourceGroupName $ResourceGroupName `
  -Location $AzureLocation `
  -Name $VnetName `
  -AddressPrefix 10.0.0.0/16 `
  -Subnet $AaddsSubnet,$WorkloadSubnet

# Enable Azure AD Domain Services for the directory.
New-AzResource -ResourceId "/subscriptions/$AzureSubscriptionId/resourceGroups/$ResourceGroupName/providers/Microsoft.AAD/DomainServices/$ManagedDomainName" `
  -Location $AzureLocation `
  -Properties @{"DomainName"=$ManagedDomainName; `
    "SubnetId"="/subscriptions/$AzureSubscriptionId/resourceGroups/$ResourceGroupName/providers/Microsoft.Network/virtualNetworks/$VnetName/subnets/DomainServices"} `
  -Force -Verbose
```

It takes a few minutes to create the resource and return control to the PowerShell prompt. The managed domain continues to be provisioned in the background, and can take up to an hour to complete the deployment. In the Azure portal, the **Overview** page for your managed domain shows the current status throughout this deployment stage.

When the Azure portal shows that the managed domain has finished provisioning, the following tasks need to be completed:

* Update DNS settings for the virtual network so virtual machines can find the managed domain for domain join or authentication.
    * To configure DNS, select your managed domain in the portal. On the **Overview** window, you are prompted to automatically configure these DNS settings.
* If you created a managed domain in a region that supports Availability Zones, create a network security group to restrict traffic in the virtual network for the managed domain. An Azure standard load balancer is created that requires these rules to be place. This network security group secures Azure AD DS and is required for the managed domain to work correctly.
    * To create the network security group and required rules, select your managed domain in the portal. On the **Overview** window, you are prompted to automatically create and configure the network security group.
* [Enable password synchronization to Azure AD Domain Services](tutorial-create-instance.md#enable-user-accounts-for-azure-ad-ds) so end users can sign in to the managed domain using their corporate credentials.

## Next steps

To see the managed domain in action, you can [domain-join a Windows VM][windows-join], [configure secure LDAP][tutorial-ldaps], and [configure password hash sync][tutorial-phs].

<!-- INTERNAL LINKS -->
[windows-join]: join-windows-vm.md
[tutorial-ldaps]: tutorial-configure-ldaps.md
[tutorial-phs]: tutorial-configure-password-hash-sync.md

<!-- EXTERNAL LINKS -->
[Connect-AzAccount]: /powershell/module/Az.Accounts/Connect-AzAccount
[Connect-AzureAD]: /powershell/module/AzureAD/Connect-AzureAD
[New-AzureADServicePrincipal]: /powershell/module/AzureAD/New-AzureADServicePrincipal
[New-AzureADGroup]: /powershell/module/AzureAD/New-AzureADGroup
[Add-AzureADGroupMember]: /powershell/module/AzureAD/Add-AzureADGroupMember
[Get-AzureADGroup]: /powershell/module/AzureAD/Get-AzureADGroup
[Get-AzureADUser]: /powershell/module/AzureAD/Get-AzureADUser
[Register-AzResourceProvider]: /powershell/module/Az.Resources/Register-AzResourceProvider
[New-AzResourceGroup]: /powershell/module/Az.Resources/New-AzResourceGroup
[New-AzVirtualNetworkSubnetConfig]: /powershell/module/Az.Network/New-AzVirtualNetworkSubnetConfig
[New-AzVirtualNetwork]: /powershell/module/Az.Network/New-AzVirtualNetwork
[Get-AzSubscription]: /powershell/module/Az.Accounts/Get-AzSubscription
[cloud-shell]: /azure/cloud-shell/cloud-shell-windows-users
[availability-zones]: ../availability-zones/az-overview.md
