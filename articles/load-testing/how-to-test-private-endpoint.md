---
title: Load test private endpoints
titleSuffix: Azure Load Testing
description: Learn how to deploy Azure Load Testing in a virtual network (VNET injection) to test private application endpoints and hybrid deployments.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 05/18/2022
ms.topic: how-to

---

# Test private endpoints by deploying Azure Load Testing in an Azure virtual network

In this article, learn how to test private application endpoints with Azure Load Testing Preview. You'll create an Azure Load Testing resource and enable it to attach load test engines in your virtual network (VNET injection).

This functionality enables the following usage scenarios:

- Generate load to a web service exposed to an Azure Virtual Network.
- Generate load to an Azure-hosted public endpoint with access restrictions, such as restricting client IP addresses.
- Generate load to an on-premise service, not publicly accessible, that is connected to Azure via ExpressRoute.

Learn more about the scenarios for [deploying Azure Load Testing in your virtual network](./concept-azure-load-testing-vnet-injection.md).

The following diagram provides a technical overview:

:::image type="content" source="media/how-to-test-private-endpoint/azure-load-testing-vnet-injection.png" alt-text="Diagram that shows the Azure Load Testing VNET injection technical overview.":::

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure subscription that is allow-listed for the VNET injection feature.
- An existing virtual network and subnet to use with your Azure Load Testing agents.
- The virtual network must be in the same subscription as the Azure Load Testing resource.
- The subnet used for the load testing must have enough unassigned IP addresses to accommodate the number of load test engines.
- If you plan to secure the virtual network by restricting traffic, see the [Required public internet access](#required-public-internet-access) section.
- The subnet shouldn't be delegated to any other Azure service. For example, it shouldn't be delegated to Azure Container Instances (ACI). Learn more about [subnet delegation](/azure/virtual-network/subnet-delegation-overview).

## Required public internet access

Azure Load Testing requires both inbound and outbound access to the public internet. The following tables provide an overview of what access is required and what it is for.

|Direction  |Ports  |Service tag/IP address  |Purpose  |
|---------|---------|---------|---------|
|Inbound     | 29876-29877  | BatchNodeManagement        | Create, update, and delete of Azure Load Testing compute instances. |
|Inbound     | 8080         | Azure Load Testing outbound IP address   | Create, update, and delete of Azure Load Testing compute instances. |
|Outbound     | *        | *        | Used for various operations involved in orchestrating a load tests |

### Azure Load Testing outbound IP addresses per region

The following table lists the outbound IP addresses for Azure Load Testing per Azure region. You can use these IP addresses in a network security group (NSG) to allowlist the service in your VNET.

|Azure region  |IP address  |
|---------|---------|
|East US     | 52.146.62.140        |
|East US 2     | 20.96.144.103        |
|North Europe     | 40.127.229.174        |
|South Central US     | 20.188.77.178        |
|Australia East | 20.53.147.86 |

## Prepare your subscription

You first need to register your subscription with the Azure Batch resource provider.

1. Open Windows PowerShell, sign in to Azure, and set the subscription:

    ```azurecli
    az login
    az account set --subscription <your-Azure-Subscription-ID>
    ```

1. Register the Azure Batch resource provider for your subscription:

    ```azurecli
    az provider register --namespace "Microsoft.Batch" 
    ```

## Configure your load test script

The test engines, which run the Apache JMeter script, are attached to the virtual network that contains the application endpoint. To load test the application endpoint, you can refer to it in the JMX file by using the private IP address or [name resolution in your network](/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances).

For example, for an endpoint in a virtual network with subnet range 10.179.0.0/18, the JMX file could have this information:

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

## Deploy Azure Load Testing in your virtual network

You can attach load test engines to an Azure Virtual Network for a new load test. You use the Azure portal to add a new load test to an Azure Load Testing resource, and configure it for your virtual network in the creation wizard.

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.
    
1. Go to your Azure Load Testing resource, select **Tests** from the left pane, and then select **+ Create new test**.

    :::image type="content" source="media/how-to-test-private-endpoint/create-new-test.png" alt-text="Screenshot that shows the Azure Load Testing page and the button for creating a new test.":::

1. On the **Basics** tab, enter the **Test name** and **Test description** information. Optionally, you can select the **Run test after creation** checkbox.

    :::image type="content" source="media/how-to-test-private-endpoint/create-new-test-basics.png" alt-text="Screenshot that shows the 'Basics' tab for creating a test.":::

1. On the **Test plan** tab, select your Apache JMeter script, and then select **Upload** to upload the file to Azure.

    You can select and upload additional Apache JMeter configuration files or other files that are referenced in the JMX file. For example, if your test script uses CSV data sets, you can upload the corresponding *.csv* file(s).

1. On the **Load** tab, select **Private** traffic mode, and then select your virtual network and subnet.

    :::image type="content" source="media/how-to-test-private-endpoint/create-new-test-load-vnet.png" alt-text="Screenshot that shows the 'Load' tab for creating a test.":::

    > [!IMPORTANT]
    > When you deploy Azure Load Testing in a virtual network, you'll incur additional charges for generated traffic. For more information, see the [Virtual Network pricing information](https://azure.microsoft.com/pricing/details/virtual-network).
        
1. Select **Review + create**. Review all settings, and then select **Create** to create the load test.

While your load test runs, Azure Load Testing creates the following resources in the virtual network. These resources are ephemeral and exist only during the load test run.

- IP address
- Network Security Group (NSG)
- Azure Load Balancer

## Next steps

- Learn more about the scenarios for [deploying Azure Load Testing in your virtual network](./concept-azure-load-testing-vnet-injection.md).
- Learn how to [Monitor server-side application metrics](./how-to-monitor-server-side-metrics.md).
