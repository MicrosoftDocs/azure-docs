---
title: Load test private endpoints
titleSuffix: Azure Load Testing
description: Learn how to deploy Azure Load Testing in a virtual network (virtual network injection) to test private application endpoints and hybrid deployments.
services: load-testing
ms.service: azure-load-testing
ms.custom: devx-track-azurecli
ms.author: vevippar
author: nagarjuna-vipparthi
ms.date: 05/12/2023
ms.topic: how-to
---

# Test private endpoints by deploying Azure Load Testing in an Azure virtual network

In this article, learn how to test private application endpoints with Azure Load Testing. You create an Azure Load Testing resource and enable it to generate load from within your virtual network (virtual network injection).

This functionality enables the following usage scenarios:

- Generate load to an endpoint that is deployed in an Azure virtual network.
- Generate load to a public endpoint with access restrictions, such as restricting client IP addresses.
- Generate load to an on-premises service, not publicly accessible, that is connected to Azure via ExpressRoute.

Learn more about the scenarios for [deploying Azure Load Testing in your virtual network](./concept-azure-load-testing-vnet-injection.md).

The following diagram provides a technical overview:

:::image type="content" source="media/how-to-test-private-endpoint/azure-load-testing-vnet-injection.svg" alt-text="Diagram that shows the Azure Load Testing virtual network injection technical overview.":::

When you start the load test, Azure Load Testing service injects the following Azure resources in the virtual network that contains the application endpoint:

- The test engine virtual machines. These VMs invoke your application endpoint during the load test.
- A public IP address.
- A network security group (NSG). 
- An Azure Load Balancer.

These resources are ephemeral and exist only while the load test is running. If you have restrictions on the deployment of a public IP address, Azure load balancer, or network security group in your subnet, you can disable the deployment of these resources. For more information, see [Configure your load test](#configure-your-load-test).

If you restrict access to your virtual network, you need to [configure your virtual network](#configure-virtual-network) to enable communication between these Azure Load Testing and the injected VMs.

## Prerequisites

- Your Azure account has the [Network Contributor](/azure/role-based-access-control/built-in-roles#network-contributor) role, or a parent of this role, on the virtual network. See [Check access for a user to Azure resources](/azure/role-based-access-control/check-access) to verify your permissions.
- The subnet you use for Azure Load Testing must have enough unassigned IP addresses to accommodate the number of load test engines for your test. Learn more about [configuring your test for high-scale load](./how-to-high-scale-load.md).
- The subnet shouldn't be delegated to any other Azure service. For example, it shouldn't be delegated to Azure Container Instances (ACI). Learn more about [subnet delegation](/azure/virtual-network/subnet-delegation-overview).
- The subnet shouldn't have IPv6 enabled. Azure Load Testing doesn't support IPv6 enabled subnets. Learn more about [IPv6 for Azure Virtual Network](/azure/virtual-network/ip-services/ipv6-overview)
- Azure CLI version 2.2.0 or later (if you're using CI/CD). Run `az --version` to find the version that's installed on your computer. If you need to install or upgrade the Azure CLI, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

## Configure virtual network

To test private endpoints, you connect Azure Load Testing to an Azure virtual network. The virtual network should have at least one subnet, and allow outbound traffic to the Azure Load Testing service.

If you don't have a virtual network yet, follow these steps to [create an Azure virtual network in the Azure portal](/azure/virtual-network/quick-create-portal).

> [!IMPORTANT]
> The virtual network must be in the same subscription and the same region as the load testing resource.

### Create a subnet

When you deploy Azure Load Testing in your virtual network, it's recommended to use separate subnets for Azure Load Testing and for the application endpoint. This approach enables you to configure network traffic access policies specifically for each purpose. Learn more about how to [add a subnet to a virtual network](/azure/virtual-network/virtual-network-manage-subnet#add-a-subnet).

### (Optional) Configure traffic rules

Azure Load Testing requires that the injected VMs in your virtual network are allowed outbound access to the Azure Load Testing service. By default, when you create a virtual network, outbound access is already permitted.

If you plan to further restrict access to your virtual network with a network security group, or if you already have a network security group, you need to configure an outbound security rule to allow traffic from the test engine VMs to the Azure Load Testing service.

To configure outbound access for Azure Load Testing: 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your network security group.

    If you don't have an NSG yet, follow these steps to [create a network security group](/azure/virtual-network/manage-network-security-group#create-a-network-security-group).

    Create the NSG in the same region as your virtual network, and then associate it with your subnet.

1. Select **Outbound security rules** in the left navigation.

	:::image type="content" source="media/how-to-test-private-endpoint/network-security-group-overview.png" alt-text="Screenshot that shows the network security group overview page in the Azure portal, highlighting Outbound security rules.":::

1. Select **+ Add**, to add a new outbound security rule. Enter the following information to create a new rule.

    | Field | Value |
    | ----- | ----- |
    | **Source**  | *Any* |
    | **Source port ranges**  | *\** |
    | **Destination**  | *Any* |
    | **Destination port ranges**  | *\** |
    | **Name**  | *azure-load-testing-outbound* |
    | **Description**| *Used for various operations involved in orchestrating a load tests.* |

1. Select **Add** to add the outbound security rule to the network security group.

## Configure your load test script

The test engine VMs, which run the test script, are injected in the virtual network that contains the application endpoint. You can now refer directly to the endpoint in the test script by using the private IP address or use [name resolution in your network](/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances).

For example, for an endpoint with IP address 10.179.0.7, in a virtual network with subnet range 10.179.0.0/18, the JMX file could have this information:

```xml
<HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="Internal service homepage" enabled="true">
  <elementProp name="HTTPsampler.Arguments" elementType="Arguments" guiclass="HTTPArgumentsPanel" testclass="Arguments" testname="Service homepage" enabled="true">
    <collectionProp name="Arguments.arguments"/>
  </elementProp>
  <stringProp name="HTTPSampler.domain">10.179.0.7</stringProp>
  <stringProp name="HTTPSampler.port">8081</stringProp>
  <stringProp name="HTTPSampler.protocol"></stringProp>
  <stringProp name="HTTPSampler.contentEncoding"></stringProp>
  <stringProp name="HTTPSampler.path"></stringProp>
  <stringProp name="HTTPSampler.method">GET</stringProp>
</HTTPSamplerProxy>
```

## Configure your load test

To include privately hosted endpoints in your load test, you need to configure the virtual network settings for the load test. You can configure the virtual network settings in the Azure portal, or specify them in the [YAML test configuration file](./reference-test-config-yaml.md) for CI/CD pipelines.

> [!IMPORTANT]
> When you deploy Azure Load Testing in a virtual network, you'll incur additional charges. Azure Load Testing deploys an [Azure Load Balancer](https://azure.microsoft.com/pricing/details/load-balancer/) and a [Public IP address](https://azure.microsoft.com/pricing/details/ip-addresses/) in your subscription and there might be a cost for generated traffic. For more information, see the [Virtual Network pricing information](https://azure.microsoft.com/pricing/details/virtual-network).

### Configure the virtual network in the Azure portal

You can specify the virtual network configuration settings in the load test creation/update wizard.

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.
    
1. Go to your Azure Load Testing resource, and select **Tests** from the left pane.

1. Open the load test creation/update wizard in either of two ways:

    - Select **+ Create > Upload a script**, if you want to create a new test.

        :::image type="content" source="media/how-to-test-private-endpoint/create-new-test.png" alt-text="Screenshot that shows the Tests page, highlighting the button for creating a new test.":::
    
    - Select an existing test from the list, and then select **Edit**.

        :::image type="content" source="media/how-to-test-private-endpoint/edit-test.png" alt-text="Screenshot that shows the Tests page, highlighting the button for editing a test.":::
    
1. On the **Load** tab, select **Private** traffic mode, and then select your virtual network and subnet.

    If you have multiple subnets in your virtual network, make sure to select the subnet that will host the injected test engine VMs.

    :::image type="content" source="media/how-to-test-private-endpoint/create-new-test-load-vnet.png" alt-text="Screenshot that shows the Load tab for creating or updating a load test.":::

    > [!IMPORTANT]
    > Make sure you have sufficient permissions for managing virtual networks. You require the [Network Contributor](/azure/role-based-access-control/built-in-roles#network-contributor) role.

1. (Optional) Check **Disable Public IP deployment** if you don't want to deploy a public IP address, load balancer, and network security group in your subnet.

    When you select this option, ensure that there is an alternative mechanism like [Azure NAT Gateway](/azure/nat-gateway/nat-overview#outbound-connectivity), [Azure Firewall](/azure/firewall/tutorial-firewall-deploy-portal), or a [network virtual appliance (NVA)](/azure/virtual-wan/scenario-route-through-nvas-custom) to enable outbound traffic routing from the subnet. 
   
1. Review or fill the load test information. Follow these steps to [create or manage a test](./how-to-create-manage-test.md).

1. Select **Review + create** and then **Create** (or **Apply**, when updating an existing test).

    When the load test starts, Azure Load Testing injects the test engine VMs in your virtual network and subnet. The test script can now access the privately hosted application endpoint in your virtual network.

### Configure the virtual network for CI/CD pipelines

To configure the load test with your virtual network settings, update the [YAML test configuration file](./reference-test-config-yaml.md).

1. Open a terminal, and use the Azure CLI to sign in to your Azure subscription:

    ```azurecli
    az login
    az account set --subscription <your-Azure-Subscription-ID>
    ```
1. Retrieve the subnet ID and copy the resulting value:

    ```azurecli
    az network vnet subnet show -g <your-resource-group> --vnet-name <your-vnet-name> --name <your-subnet-name> --query id
    ```

1. Open your YAML test configuration file in your favorite editor.

1. Add the `subnetId` property to the configuration file and provide the subnet ID you copied earlier:

    ```yml
    version: v0.1
    testName: SampleTest
    testPlan: SampleTest.jmx
    description: 'Load test the website home page'
    engineInstances: 1
    subnetId: <your-subnet-id>
    publicIPDisabled: False
    ```

    Optionally, you can set the `publicIPDisabled` property to `True`. For more information about the YAML configuration, see [test configuration YAML reference](./reference-test-config-yaml.md).

    > [!IMPORTANT]
    > Make sure you have sufficient permissions for managing virtual networks. You require the [Network Contributor](/azure/role-based-access-control/built-in-roles#network-contributor) role.

1. Save the YAML configuration file, and commit your changes to the source code repository.

1. After the CI/CD workflow triggers, your load test starts, and can now access the privately hosted application endpoint in your virtual network.

## Troubleshooting

To troubleshoot issues in creating and running load tests against private endpoints, see [how to troubleshoot private endpoint tests](./troubleshoot-private-endpoint-tests.md).

## Next steps

- Learn more about the [scenarios for deploying Azure Load Testing in a virtual network](./concept-azure-load-testing-vnet-injection.md).
- Learn how to [troubleshoot private endpoint tests](./troubleshoot-private-endpoint-tests.md).
