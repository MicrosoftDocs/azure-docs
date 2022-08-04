---
title: Scenarios for VNET deployment
titleSuffix: Azure Load Testing
description: Learn about the scenarios for deploying Azure Load Testing in a virtual network (VNET). This deployment enables you to load test private application endpoints and hybrid deployments.
services: load-testing
ms.service: load-testing
author: ntrogh
ms.author: nicktrog
ms.topic: conceptual
ms.date: 08/03/2022
---

# Scenarios for deploying Azure Load Testing in a virtual network

In this article, you'll learn about the scenarios for deploying Azure Load Testing Preview in a virtual network (VNET). This deployment is sometimes called VNET injection.

This functionality enables the following usage scenarios:

- Generate load to an [endpoint hosted in an Azure virtual network](#scenario-load-test-an-azure-hosted-private-backend-microservice).
- Generate load to a [public endpoint with access restrictions](#scenario-load-test-a-public-endpoint-with-access-restrictions), such as restricting client IP addresses.
- Generate load to an [on-premises service, not publicly accessible, that is connected to Azure via ExpressRoute (hybrid application deployment)](#scenario-load-test-an-on-premise-hosted-service-connected-via-azure-expressroute).

When you deploy Azure Load Testing in a virtual network, the load test engine virtual machines are attached to the virtual network in your subscription. The load test engines can then communicate with the other resources in the virtual network, such as the private application endpoint. You are not billed for the test engine compute resources.

> [!IMPORTANT]
> When you deploy Azure Load Testing in a virtual network, you'll incur additional charges. Azure Load Testing deploys an [Azure Load Balancer](https://azure.microsoft.com/pricing/details/load-balancer/) and a [Public IP address](https://azure.microsoft.com/pricing/details/ip-addresses/) in your subscription and there might be a cost for generated traffic. For more information, see the [Virtual Network pricing information](https://azure.microsoft.com/pricing/details/virtual-network).

The following diagram provides a technical overview:

:::image type="content" source="media/concept-azure-load-testing-vnet-injection/azure-load-testing-vnet-injection.png" alt-text="Diagram that shows the Azure Load Testing VNET injection technical overview.":::

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Scenario: Load test an Azure-hosted private backend microservice

In this scenario, you've deployed a microservice endpoint in a virtual network on Azure, which isn't publicly accessible. For example, the service could be behind an internal load balancer, running on a VM with a private IP address, etcetera.

:::image type="content" source="media/concept-azure-load-testing-vnet-injection/azure-hosted-private-endpoint.png" alt-text="Diagram that shows the set-up for load testing a private endpoint hosted on Azure.":::

## Scenario: Load test a public endpoint with access restrictions

In this scenario, you've deployed a publicly available web service in Azure, which is restricted to specific client IP addresses by using a firewall. For example, the service could be running behind an Azure Application Gateway, a Web Application Firewall, hosted on Azure App Service, etcetera.

:::image type="content" source="media/concept-azure-load-testing-vnet-injection/azure-hosted-public-access-restrictions.png" alt-text="Diagram that shows the set-up for load testing a public endpoint hosted on Azure with access restrictions.":::

You can deploy a [NAT Gateway resource](/azure/virtual-network/nat-gateway/nat-gateway-resource), which is a fully managed Azure service that provides source network address translation (SNAT). The NAT Gateway is attached to the subnet in which the test engines are injected. You can configure the public IP addresses that NAT Gateway uses, and allowlist them for access restriction.

## Scenario: Load test an on-premises hosted service, connected via Azure ExpressRoute

In this scenario, you have an on-premises webservice, which isn't publicly accessible. The on-premises environment is connected to Azure by using Azure ExpressRoute. 

:::image type="content" source="media/concept-azure-load-testing-vnet-injection/onpremise-private-endpoint-expressroute.png" alt-text="Diagram that shows the set-up for load testing an on-premises hosted, private endpoint connected via Azure ExpressRoute.":::

## Next steps

- Learn how to [load test a private application endpoint](./how-to-test-private-endpoint.md).
- Start using Azure Load Testing with the [Tutorial: Use a load test to identify performance bottlenecks](./tutorial-identify-bottlenecks-azure-portal.md).
