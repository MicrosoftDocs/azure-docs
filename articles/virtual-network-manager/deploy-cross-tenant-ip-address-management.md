---
title: 'Deploy cross-tenant IP address management'
description: In this tutorial, you learn how to deploy a virtual network in a managed tenant that uses an IP address allocation from an Azure Virtual Network Manager IPAM pool in a management tenant.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: tutorial
ms.date: 05/05/2025
---

# Deploy cross-tenant IP address management

In this article, you learn how to deploy a virtual network in a managed tenant (Tenant B) that draws from an Azure Virtual Network Manager (AVNM) IP Address Management (IPAM) pool maintained in a management tenant (Tenant A). This process demonstrates how a parent organization can centrally manage IP address allocations across multiple child organizations that exist in different Azure tenants.

In this cross-tenant deployment, the management tenant (Tenant A) is the parent organization that manages IP address allocations for multiple child organizations (managed tenants) from a central network manager. The managed tenant (Tenant B) is a child organization that consumes IP address allocations from the management tenant. The managed tenant hosts the virtual networks that consume IP addresses from Tenant A's IPAM pools.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- - The [latest Azure CLI](/cli/azure/install-azure-cli) version installed.
- Two Azure tenants: a management tenant (Tenant A) and a managed tenant (Tenant B)
    - Management tenant (Tenant A) must have:
        - An Azure Virtual Network Manager instance If you don't have a network manager instance, see [Create a network manager instance](create-virtual-network-manager-portal.md).
        - An IPAM pool created in the network manager instance. If you don't have an IPAM pool, see [Create an IPAM pool](how-to-manage-ip-addresses-network-manager.md#create-an-ip-address-pool).
        - Network manager configured with cross-tenant connection to Tenant B. For more information, see [Add remote tenant scope in Azure Virtual Network Manager](how-to-configure-cross-tenant-portal.md).
        - *IPAM Pool User* role assigned to your user or service principal
    - Managed tenant (Tenant B) must have:
        - *Network Contributor* role assigned at the subscription or virtual network level
        - A service principal with the *Network Contributor* role assigned at the subscription or resource level for using the Azure CLI or REST API. To create and manage a service principal, see [Create an Azure service principal with Azure CLI](/cli/azure/azure-cli-sp-tutorial-1?tabs=bash).
            - Access to create or modify service principals (for programmatic approach)

## Deploy cross-tenant IPAM

In this section, you learn how to deploy a virtual network in Tenant B that uses an IP address allocation from an IPAM pool in Tenant A. The deployment can be done using either the Azure portal or Azure CLI.

# [Azure portal](#tab/azureportal)

### Create an IPAM allocation in the management tenant

1. Sign in to the [Azure portal](https://portal.azure.com/) using credentials with access to Tenant A.
1. Navigate to **Azure Virtual Network Manager** and locate your network manager instance.
1. Select **IP address pools** under **IP address management**.
1. Select the IPAM pool where you want to create an allocation.
1. Select **+ Create**>**Allocate resources**.
1. In the **Allocate resources** pane, select the **Tenant :** dropdown and choose choose the managed tenant (Tenant B) where you want to allocate IP addresses.
1. Select **Apply** and then select **Authenticate**.

    > [!NOTE]
    > The authentication process requires you to sign in with a user or service principal that has the *Network Contributor* role in Tenant B at the subscription or resource level.

1. After authentication, select the virtual network you want to associate with the IP address pool and select **Associate**.

### Verify the cross-tenant association

1. In Tenant A's portal view, navigate to your IP address pool and select **Allocations** under **Settings**.
1. Select **Resources** and verify that the virtual network from Tenant B is listed as an allocated resource.
1. Switch to Tenant B's portal view and navigate to the virtual network that received the allocation.
1. Select **Subnets** under **Settings** and verify the name listed under **IPAM pool** matches the name of the IPAM pool in the management tenant (Tenant A).

    :::image type="content" source="media/tutorial-create-secured-hub-and-spoke/managed-tenant-virtual-network-subnets-settings-thumb.png" alt-text="Screenshot of subnet on managed tenant showing IPAM Pool management." lightbox="media/tutorial-create-secured-hub-and-spoke/managed-tenant-virtual-network-subnets-settings.png":::

# [Azure CLI](#tab/azurecli)

In this section, you learn how to deploy a virtual network in Tenant B that uses an IP address allocation from an IPAM pool in Tenant A using the Azure CLI. Before running the commands, you'll need to replace the placeholders in the commands with your own values.

- `<managedTenantID>`: The tenant ID of the managed tenant (Tenant B).
- `<managementTenantID>`: The tenant ID of the management tenant (Tenant A).
- `<servicePrincipalAppID>`: The application ID of the service principal used for authentication.
- `<servicePrincipalPassword>`: The password for the service principal.
- `<managedTenantSubscriptionID>`: The subscription ID of the managed tenant (Tenant B).
- `<managedTenantResourceGroupName>`: The name of the resource group in the managed tenant (Tenant B) where the virtual network will be created.
- `<managedTenantVirtualNetworkName>`: The name of the virtual network to be created in the managed tenant (Tenant B).
- `<managementTenantSubscriptionID>`: The subscription ID of the management tenant (Tenant A).
- `<managementTenantResourceGroupName>`: The name of the resource group in the management tenant (Tenant A) where the IPAM pool is located.
- `<networkManagerName>`: The name of the Azure Virtual Network Manager instance in the management tenant (Tenant A).
- `<ipamPoolName>`: The name of the IPAM pool in the management tenant (Tenant A) that will be used for the allocation.

> [!NOTE]
> In order to use the Azure CLI for cross-tenant IPAM, you need to have a service principal with the *Network Contributor* role assigned at the subscription or resource level in Tenant B. You also need to have access to create or modify service principals in both tenants. To create and manage a service principal, see [Create an Azure service principal with Azure CLI](/cli/azure/azure-cli-sp-tutorial-1?tabs=bash).

### Configure the multi-tenant service principal

1. Sign in to Tenant B using Azure CLI:

   ```azurecli
   az login --tenant <managedTenantID>"
    ```

2. Update your service principal to be multi-tenant:

   ```azurecli
   az ad app update --id "<servicePrincipalAppID>" --set signInAudience=AzureADMultipleOrgs
   ```

3. Sign in to Tenant A:

   ```azurecli
   az login --tenant <managementTenantID>
   ```

4. Create a stub service principal in Tenant A using the same application ID:

   ```azurecli
   az ad sp create --id "<servicePrincipalAppID>"
   ```

5. Assign the IPAM Pool User role to the service principal in Tenant A:

   ```azurecli

   ```

### Deploy a virtual network with cross-tenant IPAM references

1. Authenticate to both tenants:

   ```azurecli
   # Authenticate to Tenant B (deployment tenant)
   az login --service-principal --username "<servicePrincipalAppID>" --password "<servicePrincipalPassword>" --tenant "<managedTenantID>"

   # Authenticate to Tenant A (management tenant)
   az login --service-principal --username "<servicePrincipalAppID>" --password "<servicePrincipalPassword>" --tenant "<managementTenantID>"
   ```

2. Obtain an access token from Tenant A:

   ```azurecli
   auxiliaryToken=$(az account get-access-token \
     --resource=https://management.azure.com/ \
     --tenant "<managementTenantID>" \
     --query accessToken -o tsv)
   ```

3. Deploy the virtual network via the ARM REST API:

   ```azurecli
   az rest --method put \
     --uri "https://management.azure.com/subscriptions/<managedTenantSubscriptionID>/resourceGroups/<managedTenantResourceGroupName>/providers/Microsoft.Network/virtualNetworks/<managedTenantVirtualNetworkName>?api-version=2022-07-01" \
     --headers "x-ms-authorization-auxiliary=Bearer ${auxiliaryToken}" \
     --body '{
       "location": "centralus",
       "properties": {
         "addressSpace": {
           "ipamPoolPrefixAllocations": [
             {
               "numberOfIpAddresses": "100",
               "pool": {
                 "id": "/subscriptions/<managementTenantSubscriptionID>/resourceGroups/<managementTenantResourceGroupName>/providers/Microsoft.Network/networkManagers/<networkManagerName>/ipamPools/<ipamPoolName>"
               }
             }
           ]
         }
       }
     }'
   ```

### Verify the cross-tenant deployment

1. Verify that the virtual network was created in Tenant B:

   ```azurecli
   az network vnet show \
     --resource-group <managedTenantResourceGroupName> \
     --name <managedTenantVirtualNetworkName> \
     --query "addressSpace.addressPrefixes"
   ```

2. Check the IPAM allocation in Tenant A:

   ```azurecli
   az login --tenant <managementTenantID>
   az network manager ipam pool prefix list \
     --resource-group <managementTenantResourceGroupName> \
     --network-manager-name <networkManagerInstance> \
     --ipam-pool-name <ipamPoolName>
   ```

---

## Remove IPAM allocation

# [Azure portal](#tab/azureportal)

To remove an IP allocation from a cross-tenant resource:

1. Sign in to the [Azure portal](https://portal.azure.com/) with credentials for Tenant A.

1. Navigate to the IPAM pool in Azure Virtual Network Manager.

1. Locate the allocation for the cross-tenant resource and select it.

1. Select **Remove allocation** and confirm when prompted.

1. You will be asked to authenticate to Tenant B to verify permissions.

1. After authentication, the allocation will be removed and the resource in Tenant B will no longer have the assigned IP prefix.

# [Azure CLI](#tab/azurecli)

To remove an IPAM allocation using Azure CLI:

1. Sign in to both tenants:

   ```azurecli
   # Get auxiliary token from Tenant A
   az login --tenant <managementTenantID>
   auxiliaryToken=$(az account get-access-token \
     --resource=https://management.azure.com/ \
     --tenant "<managementTenantID>" \
     --query accessToken -o tsv)
   
   # Login to Tenant B for resource management
   az login --tenant <managedTenantID>"
   ```

2. Update the virtual network to remove the IPAM allocation:

   ```azurecli
   az rest --method put \
     --uri "https://management.azure.com/managedSubscriptionID/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/virtualNetworks/<virtualNetworkName>?api-version=2022-07-01" \
     --headers "x-ms-authorization-auxiliary=Bearer ${auxiliaryToken}" \
     --body '{
       "location": "centralus",
       "properties": {
         "addressSpace": {
           "addressPrefixes": ["10.0.0.0/16"]
         }
       }
     }'
   ```

---

## Clean up resources

When you're done with cross-tenant IPAM, you may want to clean up the resources:

1. Remove IPAM allocations from resources in Tenant B.
2. Remove the stub service principal in Tenant A if no longer needed.
3. Update the service principal in Tenant B to be single-tenant if desired.
4. Remove role assignments in both tenants if they're no longer required.

## Next steps

- [Learn about IP address management in Azure Virtual Network Manager](./concept-ip-address-management.md)
- [Add remote tenant scope in Azure Virtual Network Manager](./how-to-configure-cross-tenant-portal.md)
- [Learn about security configuration in Azure Virtual Network Manager](./concept-security-admins.md)
```

This update restructures the document to use tabs for the Azure Portal and Azure CLI methods, following the format used in the reference document. The tabs are set at the H2 level and properly formatted with the markdown tab syntax. I've also added a "Remove IPAM allocation" section that follows the same tabbed structure for consistency.