---
title: Troubleshoot issues with private endpoint tests
titleSuffix: Azure Load Testing
description: Learn about the troubleshooting steps to fix issues with running load tests against private endpoints using virtual network injection. 
services: load-testing
ms.service: azure-load-testing
author: Nagarjuna-Vipparthi
ms.author: vevippar
ms.topic: troubleshooting
ms.date: 04/18/2024
---

# Troubleshoot issues with running load tests against private endpoints. 

This article addresses issues that might arise when you run load tests against private application endpoints using Azure Load Testing. Azure Load Testing service injects the Azure resources that are required to generate load in the virtual network that contains the application endpoint. In this process, you might run into some issues related to virtual network configuration and role-based access control (RBAC) permissions. 

Azure Load Testing service requires outbound connectivity from the virtual network to the following destinations. 

| Destination | Need for connectivity |
| ------------|-------|
| *.azure.com | Access to this destination is required for the Azure Load Testing service to interact with Azure Batch service. |
| *.windows.net | Access to this destination is required for the Azure Load Testing service to interact with Azure Service Bus, Azure Event Grids, and Azure Storage. To learn more about firewall configuration in these services, see <li> [Azure Service Bus frequently asked questions](/azure/service-bus-messaging/service-bus-faq#what-ports-do-i-need-to-open-on-the-firewall--) </li> <li> [Azure Event Hubs Firewall Rules](/azure/event-hubs/event-hubs-ip-filtering) </li> <li> [Configure Azure Storage firewalls and virtual networks ](/azure/storage/common/storage-network-security?tabs=azure-portal) </li> |
| *.azurecr.io | Access to this destination is required for the Azure Load Testing service to interact with Azure Container Registry. To learn more about firewall configuration in Azure Container Registry, see <li> [Firewall access rules - Azure Container Registry ](/azure/container-registry/container-registry-firewall-access-rules) </li> |

Optionally, outbound connectivity is needed to *.maven.org and *.github.com to download any plugins that are included in your test configuration. 

## Troubleshoot connectivity from the virtual network by deploying an Azure Virtual Machine

To test connectivity from your virtual network: 

1. Create a Virtual Machine with a Public IP in the subnet that you're using in your test configuration in Azure Load Testing. This virtual machine is only used to diagnose network connectivity and can be deleted after troubleshooting. Azure Load Testing service doesn't use this virtual machine to generate load.

    Run the following Azure CLI command to create a virtual machine.
  
    ```azurecli
    az vm create --resource-group <your-resource-group> --name <your-virtual-machine-name> --image UbuntuLTS --generate-ssh-keys --subnet <your-subnet>
    ```
    The virtual machine can be of any type. 

2. Login to the virtual machine using [Azure Bastion](/azure/bastion/bastion-connect-vm-ssh-linux).
3. Test outbound connectivity from the virtual machine to azure.com
    - To validate Domain Name System (DNS) lookup, run the following command  
        ```
        nslookup azure.com
        ```
        A response with IP addresses assocaiated with azure.com indicates successful connection. 	

      :::image type="content" source="media/troubleshoot-private-endpoint-tests/dns-success-response.png" alt-text="Screenshot that shows a successful response for DNS validation":::
      
    - To validate connectivity to 'azure.com', run the following command 
      ```
      curl azure.com -I
      ```
       An HTTP response indicates successful connectivity

        :::image type="content" source="media/troubleshoot-private-endpoint-tests/curl-success-response.png" alt-text="Screenshot that shows a successful response for connectivity validation":::
      
    4. Repeat step 3 for 'windows.net' and 'azurecr.io' to validate DNS lookup and connectivity to these destinations. 

You can also use any other approach to ensure connectivity from the subnet to *.azure.com, *.windows.net and *.azurecr.io. 

While performing the connectivity tests, you may run into issues due to policy constraints or firewall restrictions. Follow the error messages to take any corrective action required and retry the connectivity tests. 

## Troubleshoot issues using the actionable error messages 

### Creating or updating the load test fails with `Subscription not registered with Microsoft.Batch (ALTVNET001)`

When you configure a load test in a virtual network, the subscription has to be registered with `Microsoft.Batch`. 

1. Try to create or update the load test again after a few minutes.

1. If the error persists, follow these steps to [register your subscription](/azure/azure-resource-manager/management/resource-providers-and-types#register-resource-provider) with the `Microsoft.Batch` resource provider manually.

### Creating or updating the load test fails with `Subnet is not in the Succeeded state (ALTVNET002)`

The subnet you're using for the load test isn't in the `Succeeded` state and isn't ready to deploy your load test into it.

1. Verify the state of the subnet.

    To verify the state, run the following Azure CLI command. The result should be `Succeeded`.

    ```azurecli
    az network vnet subnet show -g MyResourceGroup -n MySubnet --vnet-name MyVNet
    ```

1. Resolve any issues with the subnet. If you have just created the subnet, verify the state again after a few minutes.

1. Alternately, select another subnet for the load test.

### Create or updating the load test fails with `Subnet is delegated to other service (ALTVNET003)`

The subnet you use for deploying the load test can't be delegated to another Azure service. Either remove the existing delegation, or select another subnet that isn't delegated to a service.

Learn more about [adding or removing a subnet delegation](/azure/virtual-network/manage-subnet-delegation#remove-subnet-delegation-from-an-azure-service).

### Updating or starting the load test fails with `User doesn't have subnet/join/action permission on the virtual network (ALTVNET004)`

To update or start a load test, you must have sufficient permissions to deploy Azure Load Testing to the virtual network. You require the [Network Contributor](/azure/role-based-access-control/built-in-roles#network-contributor) role, or a parent of this role, on the virtual network. 

1. See [Check access for a user to Azure resources](/azure/role-based-access-control/check-access) to verify your permissions.

1. Follow these steps to [assign the Network Contributor role](/azure/role-based-access-control/role-assignments-steps) to your account.

### Creating or updating the load test fails with `IPv6 enabled subnet not supported (ALTVNET005)`

Azure Load Testing doesn't support IPv6 enabled subnets. Select another subnet for which IPv6 isn't enabled.

### Creating or updating the load test fails with `NSG attached to subnet is not in Succeeded state (ALTVNET006)`

The network security group (NSG) that is attached to the subnet isn't in the `Succeeded` state.

1. Verify the state of the NSG.

    To verify the state, run the following Azure CLI command. The result should be `Succeeded`.

    ```azurecli
    az network nsg show -g MyResourceGroup -n MyNsg
    ```

1. Resolve any issues with the NSG. If you've just created the NSG or subnet, verify the state again after a few minutes.

1. Alternately, select another NSG.

### Creating or updating the load test fails with `Route Table attached to subnet is not in Succeeded state (ALTVNET007)`

The route table attached to the subnet isn't in the `Succeeded` state.

1. Verify the state of the route table.

    To verify the state, run the following Azure CLI command. The result should be `Succeeded`.

    ```azurecli
    az network route-table show -g MyResourceGroup -n MyRouteTable
    ```

1. Resolve any issues with the route table. If you have just created the route table or subnet, verify the state again after a few minutes.

1. Alternately, select another route table.

### Creating or updating the load test fails with `Subnet is in a different subscription than resource (ALTVNET011)`

The virtual network isn't in the same subscription and region as your Azure load testing resource. Either move or recreate the Azure virtual network or the Azure load testing resource to the same subscription and region.

### Provisioning fails with `An azure policy is restricting engine deployment to your subscription (ALTVNET012)`

An Azure policy is restricting load test engine deployment to your subscription. Check your policy restrictions and try again. If you have policy restrictions on the deployment of the public IP address, Azure load balancer, or network security group, you can disable the deployment of these resources. See [Configure your load test](./how-to-test-private-endpoint.md#configure-your-load-test).

### Provisioning fails with `Engines could not be deployed due to an error in subnet configuration (ALTVNET013)`

The load test engine instances couldn't be deployed due to an error in the subnet configuration. Verify your subnet configuration. If the issue persists, raise a ticket with support along with the run ID of the test.

1. Verify the state of the subnet.

    To verify the state, run the following Azure CLI command. The result should be `Succeeded`.

    ```azurecli
    az network vnet subnet show -g MyResourceGroup -n MySubnet --vnet-name MyVNet
    ```

1. Resolve any issues with the subnet. If you have just created the subnet, verify the state again after a few minutes.

1. If the problem persists, [open an online customer support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

    Provide the load test run ID within the support request.

### Starting the load test fails with `Subnet has {0} free IPs, {1} more free IP(s) required to run {2} engine instance load test (ALTVNET014)`

The subnet you use for Azure Load Testing must have enough unassigned IP addresses to accommodate the number of load test engines for your test.

Follow these steps to [update the subnet settings](/azure/virtual-network/virtual-network-manage-subnet#change-subnet-settings) and increase the IP address range.

### Starting the load test fails with `Management Lock is enabled on Resource Group of VNET (ALTVNET015)`

If there's a lock on the resource group that contains the virtual network, the service can't inject the test engine virtual machines in your virtual network. Remove the management lock before running the load test. Learn how to [configure locks in the Azure portal](/azure/azure-resource-manager/management/lock-resources?tabs=json#configure-locks).

### Starting the load test fails with `Insufficient public IP address quota in VNET subscription (ALTVNET016)`

When you start the load test, Azure Load Testing injects the following Azure resources in the virtual network that contains the application endpoint:

- The test engine virtual machines. These VMs invoke your application endpoint during the load test.
- A public IP address.
- A network security group (NSG). 
- An Azure Load Balancer.

Ensure that you have quota for at least one public IP address available in your subscription to use in the load test.

### Starting the load test fails with `Subnet with name "AzureFirewallSubnet" cannot be used for load testing (ALTVNET017)`

The subnet *AzureFirewallSubnet* is reserved and you can't use it for Azure Load Testing. Select another subnet for your load test.

## Next steps

- Learn how to [load test private endpoints](./how-to-test-private-endpoint.md).
- Learn more about the [scenarios for deploying Azure Load Testing in a virtual network](./concept-azure-load-testing-vnet-injection.md).

