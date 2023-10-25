---
title: Configure a cross-tenant connection in Azure Virtual Network Manager Preview - CLI
description: Learn how to connect Azure subscriptions in Azure Virtual Network Manager by using cross-tenant connections for the management of virtual networks across subscriptions.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: how-to 
ms.date: 03/22/2023
ms.custom: template-how-to, devx-track-azurecli
#customerintent: As a cloud admin, I need to manage multiple tenants from a single network manager so that I can easily manage all network resources governed by Azure Virtual Network Manager.
---

# Configure a cross-tenant connection in Azure Virtual Network Manager Preview - CLI

In this article, you'll learn how to create [cross-tenant connections](concept-cross-tenant.md) in Azure Virtual Network Manager by using the [Azure CLI](/cli/azure/network/manager/scope-connection). Cross-tenant support allows organizations to use a central network manager for managing virtual networks across tenants and subscriptions. 

First, you'll create the scope connection on the central network manager. Then, you'll create the network manager connection on the connecting tenant and verify the connection. Last, you'll add virtual networks from different tenants and verify. After you complete all the tasks, you can centrally manage the resources of other tenants from your network manager.

> [!IMPORTANT]
> Azure Virtual Network Manager is generally available for Virtual Network Manager and hub and spoke connectivity configurations. 
>
> Mesh connectivity configurations and security admin rules remain in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- Two Azure tenants with virtual networks that you want to manage through Azure Virtual Network Manager. This article refers to the tenants as follows:
  - **Central management tenant**: The tenant where an Azure Virtual Network Manager instance is installed, and where you'll centrally manage network groups from cross-tenant connections.
  - **Target managed tenant**: The tenant that contains virtual networks to be managed. This tenant will be connected to the central management tenant.
- Azure Virtual Network Manager deployed in the central management tenant.
- These permissions:
  - The administrator of the central management tenant has a guest account in the target managed tenant.
  - The administrator guest account has *Network Contributor* permissions applied at the appropriate scope level (management group, subscription, or virtual network).

Need help with setting up permissions? Check out how to [add guest users in the Azure portal](../active-directory/external-identities/b2b-quickstart-add-guest-users-portal.md) and how to [assign user roles to resources in the Azure portal](../role-based-access-control/role-assignments-portal.md).

## Create a scope connection within a network manager

Creation of the scope connection begins on the central management tenant with a network manager deployed. This is the network manager where you plan to manage all of your resources across tenants. 

In this task, you set up a scope connection to add a subscription from a target tenant. You'll use subscription ID and tenant ID of the target network manager. If you want to use a management group, modify the `–resource-id` argument to look like `/providers/Microsoft.Management/managementGroups/{mgId}`.

```azurecli
# Create a scope connection in the network manager in the central management tenant
az network manager scope-connection create --resource-group "myRG" --network-manager-name "myAVNM" --name "ToTargetManagedTenant" --description "This is a connection to manage resources in the target managed tenant" --resource-id "/subscriptions/13579864-1234-5678-abcd-0987654321ab" --tenant-id "24680975-1234-abcd-56fg-121314ab5643"
```

## Create a network manager connection on a subscription in another tenant 

After you create the scope connection, you switch to your target tenant for the network manager connection. In this task, you connect the target tenant to the scope connection that you created previously. You also verify the connection state.

1. Enter the following command to connect to the target managed tenant by using your administrative account:

   ```azurecli
   
   # Log in to the target managed tenant
   # Change the --tenant value to the appropriate tenant ID
   az login --tenant "12345678-12a3-4abc-5cde-678909876543"
   ```
   
   You're required to complete authentication with your organization, based on your organization's policies.

1. Enter the following commands to set the subscription and to create the cross-tenant connection on the central management tenant. The subscription is the same as the one that the connection referenced in the previous step.

    ```azurecli
    # Set the Azure subscription
    az account set --subscription 87654321-abcd-1234-1def-0987654321ab


    # Create a cross-tenant connection to the central management tenant
    az network manager connection subscription create --connection-name "toCentralManagementTenant" --description "This connection allows management of the tenant by a central management tenant" --network-manager-id "/subscriptions/13579864-1234-5678-abcd-0987654321ab/resourceGroups/myRG/providers/Microsoft.Network/networkManagers/myAVNM"
    ```

## Verify the connection status

1.	Enter the following command to check the connection status:

    ```azurecli
    # Check connection status
    az network manager connection subscription show --name "toCentralManagementTenant"
    ```

1. Switch back to the central management tenant. Use the `show` command for the network manager to show the subscription added via the property for cross-tenant scopes:

    ```azurecli
    # View the subscription added to the network manager
    az network manager show --resource-group myAVNMResourceGroup --name myAVNM
    ```

## Add static members to a network group 

In this task, you add a cross-tenant virtual network to your network group by using static membership. In the following command, the virtual network subscription is the same as the one that you referenced when you created connections earlier.

```azurecli
# Create a network group with a static member from the target managed tenant
az network manager group static-member create --network-group-name "CrossTenantNetworkGroup" --network-manager-name "myAVNM" --resource-group "myAVNMResourceGroup" --static-member-name "targetVnet01" --resource-id="/subscriptions/87654321-abcd-1234-1def-0987654321ab
/resourceGroups/myScopeAVNM/providers/Microsoft.Network/virtualNetworks/targetVnet01"
```
## Delete network manager configurations

Now that the virtual network is in the network group, configurations are applied. To remove the static member or cross-tenant resources, use the corresponding `delete` commands:

```azurecli

# Delete the static member group
az network manager group static-member delete --network-group-name  "CrossTenantNetworkGroup" --network-manager-name " myAVNM" --resource-group "myRG" --static-member-name "targetVnet01” 

# Delete scope connections
az network manager scope-connection delete --resource-group "myRG" --network-manager-name "myAVNM" --name "ToTargetManagedTenant" 

# Switch to a managed tenant if needed 
az network manager connection subscription delete --name "toCentralManagementTenant"  

```

## Next steps

> [!div class="nextstepaction"]

- Learn more about [security admin rules](concept-security-admins.md).

- Learn how to [create a mesh network topology with Azure Virtual Network Manager by using the Azure portal](how-to-create-mesh-network.md).

- Check out the [Azure Virtual Network Manager FAQ](faq.md).
