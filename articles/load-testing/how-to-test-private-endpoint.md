---
title: Load test private endpoints
titleSuffix: Azure Load Testing
description: Learn how to deploy Azure Load Testing in a virtual network (VNET injection) to test private application endpoints and hybrid deployments.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 08/05/2022
ms.topic: how-to
ms.custom: references_regions
---

# Test private endpoints by deploying Azure Load Testing in an Azure virtual network

In this article, learn how to test private application endpoints with Azure Load Testing Preview. You'll create an Azure Load Testing resource and enable it to generate load from within your virtual network (VNET injection).

This functionality enables the following usage scenarios:

- Generate load to an endpoint that is deployed in an Azure virtual network.
- Generate load to a public endpoint with access restrictions, such as restricting client IP addresses.
- Generate load to an on-premises service, not publicly accessible, that is connected to Azure via ExpressRoute.

Learn more about the scenarios for [deploying Azure Load Testing in your virtual network](./concept-azure-load-testing-vnet-injection.md).

The following diagram provides a technical overview:

:::image type="content" source="media/how-to-test-private-endpoint/azure-load-testing-vnet-injection.png" alt-text="Diagram that shows the Azure Load Testing VNET injection technical overview.":::

When you start the load test, Azure Load Testing service injects the following Azure resources in the virtual network that contains the application endpoint:

- The test engine virtual machines. These VMs will invoke your application endpoint during the load test.
- A public IP address.
- A network security group (NSG). 
- An Azure Load Balancer.

These resources are ephemeral and exist only for the duration of the load test run. If you restrict access to your virtual network, you need to [configure your virtual network](#configure-your-virtual-network) to enable communication between these Azure Load Testing and the injected VMs.

> [!NOTE]
> Virtual network support for Azure Load Testing is available in the following Azure regions: Australia East, East US, East US 2, and North Europe.

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An existing virtual network and a subnet to use with Azure Load Testing.
- The virtual network must be in the same subscription as the Azure Load Testing resource.
- The subnet you use for Azure Load Testing must have enough unassigned IP addresses to accommodate the number of load test engines for your test. Learn more about [configuring your test for high-scale load](./how-to-high-scale-load.md).
- The subnet shouldn't be delegated to any other Azure service. For example, it shouldn't be delegated to Azure Container Instances (ACI). Learn more about [subnet delegation](/azure/virtual-network/subnet-delegation-overview).

## Configure your virtual network

To test private endpoints, you need an Azure virtual network and at least one subnet. In this section, you'll configure your virtual network and subnet.

### Create a subnet

When you deploy Azure Load Testing in your virtual network, it's recommended to use different subnets for Azure Load Testing and the application endpoint. This approach enables you to configure network traffic access specifically for each purpose. Learn more about how to [add a subnet to a virtual network](/azure/virtual-network/virtual-network-manage-subnet#add-a-subnet).

### Configure traffic access

Azure Load Testing requires both inbound and outbound access for the injected VMs in your virtual network. If you plan to restrict traffic access to your virtual network, or are already using a network security group, configure the network security group for the subnet in which you deploy the load test.

1. If you don't have an NSG yet, create one in the same region as your virtual network and associate it with your subnet. Follow these steps to [create a network security group](/azure/virtual-network/manage-network-security-group#create-a-network-security-group).

1. Go to the [Azure portal](https://portal.azure.com) to view your network security groups. Search for and select **Network security groups**.

1. Select the name of your network security group.

1. Select **Inbound security rules** in the left navigation.

1. Select **+ Add**, to add a new inbound security rule. Enter the following information to create a new rule, and then select **Add**.

    | Field | Value |
    | ----- | ----- |
    | **Source**  | *Service Tag* |
    | **Source service tag**  | *BatchNodeManagement* |
    | **Source port ranges**  | *\** |
    | **Destination**  | *Any* |
    | **Destination port ranges**  | *29876-29877* |
    | **Name**  | *batch-node-management-inbound* |
    | **Description**| *Create, update, and delete of Azure Load Testing compute instances.* |

1. Add a second inbound security rule using the following information:

    | Field | Value |
    | ----- | ----- |
    | **Source**  | *Service Tag* |
    | **Source service tag**  | *AzureLoadTestingInstanceManagement* |
    | **Source port ranges**  | *\** |
    | **Destination**  | *Any* |
    | **Destination port ranges**  | *8080* |
    | **Name**  | *azure-load-testing-inbound* |
    | **Description**| *Create, update, and delete of Azure Load Testing compute instances.* |

1. Select **Outbound security rules** in the left navigation.

1. Select **+ Add**, to add a new outbound security rule. Enter the following information to create a new rule, and then select **Add**.

    | Field | Value |
    | ----- | ----- |
    | **Source**  | *Any* |
    | **Source port ranges**  | *\** |
    | **Destination**  | *Any* |
    | **Destination port ranges**  | *\** |
    | **Name**  | *azure-load-testing-outbound* |
    | **Description**| *Used for various operations involved in orchestrating a load tests.* |

## Configure your load test script

The test engine VMs, which run the JMeter script, are injected in the virtual network that contains the application endpoint. You can now refer directly to the endpoint in the JMX file by using the private IP address or use [name resolution in your network](/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances).

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

## Set up a load test

To create a load test for testing your private endpoint, you have to specify the virtual network details in the test creation wizard.

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.
    
1. Go to your Azure Load Testing resource, select **Tests** from the left pane, and then select **+ Create new test**.

    :::image type="content" source="media/how-to-test-private-endpoint/create-new-test.png" alt-text="Screenshot that shows the Azure Load Testing page and the button for creating a new test.":::

1. On the **Basics** tab, enter the **Test name** and **Test description** information. Optionally, you can select the **Run test after creation** checkbox.

    :::image type="content" source="media/how-to-test-private-endpoint/create-new-test-basics.png" alt-text="Screenshot that shows the 'Basics' tab for creating a test.":::

1. On the **Test plan** tab, select your Apache JMeter script, and then select **Upload** to upload the file to Azure.

    You can select and upload other Apache JMeter configuration files or other files that are referenced in the JMX file. For example, if your test script uses CSV data sets, you can upload the corresponding *.csv* file(s).

1. On the **Load** tab, select **Private** traffic mode, and then select your virtual network and subnet.

    :::image type="content" source="media/how-to-test-private-endpoint/create-new-test-load-vnet.png" alt-text="Screenshot that shows the 'Load' tab for creating a test.":::

    > [!IMPORTANT]
    > When you deploy Azure Load Testing in a virtual network, you'll incur additional charges. Azure Load Testing deploys an [Azure Load Balancer](https://azure.microsoft.com/pricing/details/load-balancer/) and a [Public IP address](https://azure.microsoft.com/pricing/details/ip-addresses/) in your subscription and there might be a cost for generated traffic. For more information, see the [Virtual Network pricing information](https://azure.microsoft.com/pricing/details/virtual-network).
        
1. Select **Review + create**. Review all settings, and then select **Create** to create the load test.

## Troubleshooting

### Starting the load test fails with `Test cannot be started`

To start a load test, you must have sufficient permissions to deploy Azure Load Testing to the virtual network. You require the [Network Contributor](/azure/role-based-access-control/built-in-roles#network-contributor) role, or a parent of this role, on the virtual network. See [Check access for a user to Azure resources](/azure/role-based-access-control/check-access) to verify your permissions.

If you're using the [Azure Load Testing REST API](/rest/api/loadtesting/) to start a load test, check that you're using a valid subnet ID. The subnet must be in the same Azure region as your Azure Load Testing resource.

### The load test is stuck in `Provisioning` state and then goes to `Failed`

1. Verify that your subscription is registered with `Microsoft.Batch`.

    Run the following Azure CLI command to verify the status. The result should be `Registered`.

    ```azurecli
    az provider show --namespace Microsoft.Batch --query registrationState
    ```

1. Verify that Microsoft Batch node management and the Azure Load Testing IPs can make inbound connections to the test engine VMs.

    1. Enable [Network Watcher](/azure/network-watcher/network-watcher-monitoring-overview) for the virtual network region.

        ```azurecli
        az network watcher configure \
                  --resource-group NetworkWatcherRG \
                  --locations eastus \
                  --enabled
        ```

    1. Create a temporary VM  with a Public IP in the subnet you're using for the Azure Load Testing service. You'll only use this VM to diagnose the network connectivity and delete it afterwards. The VM can be of any type.

        ```azurecli
        az vm create \
              --resource-group myResourceGroup \
              --name myVm \
              --image UbuntuLTS \
              --generate-ssh-keys \
              --subnet mySubnet
        ```

    1. Test the inbound connectivity to the temporary VM from the `BatchNodeManagement` service tag.

        1. In the [Azure portal](https://portal.azure.com), go to **Network Watcher**.
        1. On the left pane, select **NSG Diagnostic**.
        1. Enter the details of the VM you created in the previous step.
        1. Select **Service Tag** for the **Source type**, and then select **BatchNodeManagement** for the **Service tag**.
        1. The **Destination IP address** is the IP address of the VM you created in previous step.
        1. For **Destination port**, you have to validate two ports: *29876* and *29877*. Enter one value at a time and move to the next step.
        1. Press **Check** to verify that the network security group isn't blocking traffic.

            :::image type="content" source="media/how-to-test-private-endpoint/test-network-security-group-connectivity.png" alt-text="Screenshot that shows the NSG Diagnostic page to test network connectivity.":::

            If the traffic status is **Denied**, [configure your virtual network](#configure-your-virtual-network) to allow traffic for the **BatchNodeManagement** service tag.

    1. Test the inbound connectivity to the temporary VM from the `AzureLoadTestingInstanceManagement` service tag.

        1. In the [Azure portal](https://portal.azure.com), go to **Network Watcher**.
        1. On the left pane, select **NSG Diagnostic**.
        1. Enter the details of the VM you created in the previous step.
        1. Select **Service Tag** for the **Source type**, and then select **AzureLoadTestingInstanceManagement** for the **Service tag**.
        1. The **Destination IP address** is the IP address of the VM you created in previous step.
        1. For **Destination port**, enter *8080*.
        1. Press **Check** to verify that the network security group isn't blocking traffic.

            If the traffic status is **Denied**, [configure your virtual network](#configure-your-virtual-network) to allow traffic for the **AzureLoadTestingInstanceManagement** service tag.

    1. Delete the temporary VM you created earlier.

### The test executes and results in a 100% error rate

Possible cause: there are connectivity issues between the subnet in which you deployed Azure Load Testing and the subnet in which the application endpoint is hosted.

1. You might deploy a temporary VM in the subnet used by Azure Load Testing and then use the [curl](https://curl.se/) tool to test connectivity to the application endpoint. Verify that there are no firewall or NSG rules that are blocking traffic.

1. Verify the [Azure Load Testing results file](./how-to-export-test-results.md) for error response messages:

    |Response message  | Action  |
    |---------|---------|
    | **Non http response code java.net.unknownhostexception** | Possible cause is a DNS resolution issue. If you’re using Azure Private DNS, verify that the DNS is set up correctly for the subnet in which Azure Load Testing instances are injected, and for the application subnet. |
    | **Non http response code SocketTimeout**     | Possible cause is when there’s a firewall blocking connections from the subnet in which Azure Load Testing instances are injected to your application subnet.  |

## Next steps

- Learn more about the [scenarios for deploying Azure Load Testing in a virtual network](./concept-azure-load-testing-vnet-injection.md).
- Learn how to [Monitor server-side application metrics](./how-to-monitor-server-side-metrics.md).
