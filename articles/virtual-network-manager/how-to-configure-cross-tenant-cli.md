---
title: Configure cross-tenant connection in Azure Virtual Network Manager - CLI
description: Learn to connect Azure subscriptions in Azure Virtual Network Manager using cross-tenant connections for the management of virtual networks across subscriptions.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: how-to 
ms.date: 11/1/2022
ms.custom: template-how-to 
#customerintent: As a cloud admin, in need to manage multi tenants from a single network manager instance. Cross tenant functionality will give me this so I can easily manage all network resources governed by azure virtual network manager
---

# Configure cross-tenant connection in Azure Virtual Network Manager

In this article, you’ll learn how-to create cross-tenant connections in Azure Virtual Network Manager using [Azure CLI](/cli/azure/network/manager/scope-connection). Cross-tenant support allows organizations to use a central Network Manager instance for managing virtual networks across different tenants and subscriptions. First, you'll create the scope connection on the central network manager. Then you'll create the network manager connection on the connecting tenant, and verify connection. Last, you'll add virtual networks from different tenants and verify. Once completed, You can centrally manage the resources of other tenants from a central network manager instance.

> [!IMPORTANT]
> Azure Virtual Network Manager is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
## Prerequisites

- Two Azure tenants with virtual networks needing to be managed by Azure Virtual Network Manager Deploy. During the how-to, the tenants will be referred to as follows:
  - **Central management tenant** - The tenant where an Azure Virtual Network Manager instance is installed, and you'll centrally manage network groups from cross-tenant connections.
  - **Target managed tenant** - The tenant containing virtual networks to be managed. This tenant will be connected to the central management tenant.
- Azure Virtual Network Manager deployed in the central management tenant.
- Required permissions include:
  - Administrator of central management tenant has guest account in target managed tenant.
  - Administrator guest account has *Network Contributor* permissions applied at appropriate scope level(Management group, subscription, or virtual network).

Need help with setting up permissions? Check out how to [add guest users in the Azure portal](../active-directory/external-identities/b2b-quickstart-add-guest-users-portal.md), and how to [assign user roles to resources in Azure portal](../role-based-access-control/role-assignments-portal.md)
## Create scope connection within network manager

Creation of the scope connection begins on the central management tenant with a network manager deployed, which is the network manager where you plan to manage all of your resources across tenants. In this task, you'll set up a scope connection to add a subscription from a target tenant. If you wish to use a management group, you'll modify the `–resource-id` argument to look like `/providers/Microsoft.Management/managementGroups/{mgId}`.

```azurecli
# Create scope connection in network manager in the central management tenant
az network manager scope-connection create --resource-group "myRG" --network-manager-name "myAVNM" --name "ToTargetManagedTenant" --description "This is a connection to manage resources in the target managed tenant" --resource-id "/subscriptions/6a5f35e9-6951-499d-a36b-83c6c6eed44a" --tenant-id "72f988bf-86f1-41af-91ab-2d7cd011db47"
```

## Create network manager connection on subscription in other tenant 
Once the scope connection is created, you'll switch to your target tenant for the network manager connection. During this task, you'll connect the target tenant to the scope connection created previously and verify the connection state.

1. Enter the following command to connect to the target managed tenant with your administrative account:

```azurecli

# Login to target managed tenant
# Note: Change the --tenant value to the appropriate tenant ID
az login --tenant "79686033-97a2-4ebd-8e7d-0cae2c7df00e"
```
You'll be required to complete authentication with your organization based on your organizations policies.

1. Enter the following command to create the cross tenant connection on the central management
Set the subscription (note it’s the same as the one the connection references in step 1)
```azurecli
# Set the Azure subscription
az account set --subscription dec492d3-4f4e-493b-aa47-7bdf2f96a6fc

# Create cross-tenant connection to central management tenant
az network manager connection subscription create --connection-name "toCentralManagementTenant" --description "This connection allows management of the tenant by a central management tenant" --network-manager-id "/subscriptions/6a5f35e9-6951-499d-a36b-83c6c6eed44a/resourceGroups/myRG/providers/Microsoft.Network/networkManagers/myAVNM"
```

## Verify the connection state

1.	Enter the following command to check the connection Status:
```azurecli
# Check connection status
az network manager connection subscription show --name "toCentralManagementTenant"
```

1. Switch back to the central management tenant, and performing a get on the network manager shows the subscription added via the cross tenant scopes property.

```azurecli
# View subscription added to network manager
az network manager show --resource-group myAVNMResourceGroup --name myAVNM
```

## Add static members to your network group 
In this task, you'll add a cross-tenant virtual network to your network group with static membership. The virtual network subscription used below is the same as referenced when creating connections above.

```azurecli
# Create network group with static member from target managed tenant
az network manager group static-member create --network-group-name "CrossTenantNetworkGroup" --network-manager-name "myAVNM" --resource-group "myAVNMResourceGroup" --static-member-name "targetVnet01" --resource-id="/subscriptions/dec492d3-4f4e-493b-aa47-7bdf2f96a6fc/resourceGroups/myScopeAVNM/providers/Microsoft.Network/virtualNetworks/targetVnet01"
```
## Delete virtual network manager configurations

Now that the virtual network is in the network group, configurations will be applied. To remove the static member or cross-tenant resources, use the corresponding delete commands.

```azurecli

# Delete static member group
az network manager group static-member delete --network-group-name  "CrossTenantNetworkGroup" --network-manager-name " myAVNM" --resource-group "myRG" --static-member-name "fabrikamVnet” 

# Delete scope connections
az network manager scope-connection delete --resource-group "myRG" --network-manager-name "myAVNM" --name "ToTargetManagedTenant" 

# Switch to ‘managed tenant’ if needed 
# 
az network manager connection subscription delete --name "toCentralManagementTenant"  

```

## Next steps

> [!div class="nextstepaction"]

- Learn more about [Security admin rules](concept-security-admins.md).

- Learn how to [create a mesh network topology with Azure Virtual Network Manager using the Azure portal](how-to-create-mesh-network.md)

- Check out the [Azure Virtual Network Manager FAQ](faq.md)