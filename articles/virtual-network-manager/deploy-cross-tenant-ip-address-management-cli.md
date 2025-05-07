---
title: 'Deploy cross-tenant IP address management using Azure CLI/REST API'
description: Learn how to deploy a virtual network in a managed tenant that uses an IP address allocation from an Azure Virtual Network Manager IPAM pool in a management tenant using Azure CLI or REST API.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: tutorial
ms.date: 05/05/2025
---

# Deploy cross-tenant IP address management using Azure CLI/REST API

This article demonstrates how to deploy a virtual network in a managed tenant (Tenant B) using an IP address allocation from an Azure Virtual Network Manager IP address management (IPAM) pool in a management tenant (Tenant A). You use the Azure CLI or REST API to configure cross-tenant IPAM, enabling centralized IP address management across multiple tenants. This guide also covers prerequisites, configuration steps, and how to remove IPAM allocations.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- The [latest Azure CLI](/cli/azure/install-azure-cli) version installed.
- Two Azure tenants: a management tenant (Tenant A) and a managed tenant (Tenant B)
    - Management tenant (Tenant A) must have:
        - An Azure Virtual Network Manager instance. If you don't have a network manager instance, see [Create a network manager instance](create-virtual-network-manager-portal.md).
        - An IPAM pool created in the network manager instance. If you don't have an IPAM pool, see [Create an IPAM pool](how-to-manage-ip-addresses-network-manager.md#create-an-ip-address-pool).
        - Network manager configured with cross-tenant connection to Tenant B. For more information, see [Add remote tenant scope in Azure Virtual Network Manager](how-to-configure-cross-tenant-portal.md).
        - *IPAM Pool User* role assigned to your user or service principal.
    - Managed tenant (Tenant B) must have:
        - *Network Contributor* role assigned at the subscription or virtual network level.
        - A service principal with the *Network Contributor* role assigned at the subscription or resource level for using the Azure CLI or REST API.

### Configure the multitenant service principal

1. Sign in to Tenant B using Azure CLI:

   ```azurecli
   az login --tenant <managedTenantID>
   ```

2. Update your service principal to be multitenant:

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

5. Assign the *IPAM Pool User* role to the service principal in Tenant A:

   ```azurecli
   az role assignment create --assignee "<servicePrincipalAppID>" --role "IPAM Pool User" --scope "/subscriptions/<managementTenantSubscriptionID>/resourceGroups/<managementTenantResourceGroupName>/providers/Microsoft.Network/networkManagers/<networkManagerName>/ipamPools/<ipamPoolName>"
   ```

### Deploy a virtual network with cross-tenant IPAM references

1. Authenticate to both tenants:

   ```azurecli
   az login --service-principal --username "<servicePrincipalAppID>" --password "<servicePrincipalPassword>" --tenant "<managedTenantID>"
   az login --service-principal --username "<servicePrincipalAppID>" --password "<servicePrincipalPassword>" --tenant "<managementTenantID>"
   ```

2. Obtain an access token from Tenant A:

   ```azurecli
   auxiliaryToken=$(az account get-access-token \
     --resource=https://management.azure.com/ \
     --tenant "<managementTenantID>" \
     --query accessToken -o tsv)
   ```

3. Deploy the virtual network via the Azure Resource Manager REST API:

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

## Remove IPAM allocation using Azure CLI

1. Sign in to both tenants and obtain an auxiliary token from Tenant A:

   ```azurecli
   az login --tenant <managementTenantID>
   auxiliaryToken=$(az account get-access-token \
     --resource=https://management.azure.com/ \
     --tenant "<managementTenantID>" \
     --query accessToken -o tsv)
   ```

2. Update the virtual network to remove the IPAM allocation:

   ```azurecli
   az rest --method put \
     --uri "https://management.azure.com/subscriptions/<managedTenantSubscriptionID>/resourceGroups/<managedTenantResourceGroupName>/providers/Microsoft.Network/virtualNetworks/<managedTenantVirtualNetworkName>?api-version=2022-07-01" \
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

## Next steps

- [Learn about IP address management in Azure Virtual Network Manager](./concept-ip-address-management.md)
- [Add remote tenant scope in Azure Virtual Network Manager](./how-to-configure-cross-tenant-portal.md)
