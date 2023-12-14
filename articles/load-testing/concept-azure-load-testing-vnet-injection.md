---
title: Scenarios for virtual network deployment
titleSuffix: Azure Load Testing
description: Learn about the scenarios for deploying Azure Load Testing in a virtual network. This deployment enables you to load test private application endpoints and hybrid deployments.
services: load-testing
ms.service: load-testing
author: ntrogh
ms.author: nicktrog
ms.topic: conceptual
ms.date: 08/22/2023
---

# Scenarios for deploying Azure Load Testing in a virtual network

In this article, you learn about the scenarios for deploying Azure Load Testing in a virtual network. This deployment is sometimes called virtual network injection.

This functionality enables the following usage scenarios:

- Generate load to an [endpoint hosted in an Azure virtual network](#scenario-load-test-an-azure-hosted-private-endpoint).
- Generate load to a [public endpoint with access restrictions](#scenario-load-test-a-public-endpoint-with-access-restrictions), such as restricting client IP addresses.
- Generate load to an [on-premises service, not publicly accessible, that is connected to Azure via ExpressRoute (hybrid application deployment)](#scenario-load-test-an-on-premises-hosted-service-connected-via-azure-expressroute).

When you deploy Azure Load Testing in a virtual network, the load test engine virtual machines are attached to the virtual network in your subscription. The load test engines can then communicate with the other resources in the virtual network, such as the private application endpoint. You are not billed for the test engine compute resources.

> [!IMPORTANT]
> When you deploy Azure Load Testing in a virtual network, you'll incur additional charges. Azure Load Testing deploys an [Azure Load Balancer](https://azure.microsoft.com/pricing/details/load-balancer/) and a [Public IP address](https://azure.microsoft.com/pricing/details/ip-addresses/) in your subscription and there might be a cost for generated traffic. For more information, see the [Virtual Network pricing information](https://azure.microsoft.com/pricing/details/virtual-network).

The following diagram provides a technical overview:

:::image type="content" source="media/concept-azure-load-testing-vnet-injection/azure-load-testing-vnet-injection.svg" alt-text="Diagram that shows the Azure Load Testing virtual network injection technical overview.":::

## Scenario: Load test an Azure-hosted private endpoint

In this scenario, you've deployed an application endpoint in a virtual network on Azure, which isn't publicly accessible. For example, the endpoint could be behind an internal load balancer, or running on a VM with a private IP address.

:::image type="content" source="media/concept-azure-load-testing-vnet-injection/azure-hosted-private-endpoint.svg" alt-text="Diagram that shows the set-up for load testing a private endpoint hosted on Azure.":::

When you deploy Azure Load Testing in the virtual network, the load test engines can now communicate with the application endpoint. If you've used separate subnets for the application endpoint and Azure Load Testing, make sure that communication between the subnets isn't blocked, for example by a network security group (NSG). Learn how [network security groups filter network traffic](/azure/virtual-network/network-security-group-how-it-works).

## Scenario: Load test a public endpoint with access restrictions

In this scenario, you've deployed a publicly available web service in Azure, or any other location. Access to the endpoint is restricted to specific client IP addresses. For example, the service could be running behind an [Azure Application Gateway](/azure/application-gateway/overview), hosted on [Azure App Service with access restrictions](/azure/app-service/app-service-ip-restrictions), or deployed behind a web application firewall.

:::image type="content" source="media/concept-azure-load-testing-vnet-injection/azure-hosted-public-access-restrictions.svg" alt-text="Diagram that shows the set-up for load testing a public endpoint hosted on Azure with access restrictions.":::

To restrict access to the endpoint for the load test engines, you need a range of public IP addresses for the test engine virtual machines. You deploy a [NAT Gateway resource](/azure/virtual-network/nat-gateway/nat-gateway-resource) in the virtual network, and then create and run a load test in the virtual network. A NAT gateway is a fully managed Azure service that provides source network address translation (SNAT).

Attach the NAT gateway to the subnet in which the load test engines are injected. You can configure the public IP addresses used by the NAT gateway. These load test engine VMs use these IP addresses for generating load. You can then allowlist these IP addresses for restricting access to your application endpoint.

## Scenario: Load test an on-premises hosted service, connected via Azure ExpressRoute

In this scenario, you have an on-premises application endpoint, which isn't publicly accessible. The on-premises environment is connected to Azure by using Azure ExpressRoute.

:::image type="content" source="media/concept-azure-load-testing-vnet-injection/onpremises-private-endpoint-expressroute.svg" alt-text="Diagram that shows the set-up for load testing an on-premises hosted, private endpoint connected via Azure ExpressRoute.":::

ExpressRoute lets you extend your on-premises networks into the Microsoft cloud over a private connection with the help of a connectivity provider. Deploy Azure Load Testing in an Azure virtual network and then [connect the network to your ExpressRoute circuit](/azure/expressroute/expressroute-howto-linkvnet-portal-resource-manager). After you've set up the connection, the load test engines can connect to the on-premises hosted application endpoint.

## Next steps

- Learn how to [load test a private application endpoint](./how-to-test-private-endpoint.md).
- Start using Azure Load Testing with the [Tutorial: Use a load test to identify performance bottlenecks](./tutorial-identify-bottlenecks-azure-portal.md).
