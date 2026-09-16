---
title: Create a community endpoint in the Azure portal
description: Create a community endpoint in the Azure portal.
author: jadean-msft
ms.author: jadean
ai-usage: ai-assisted
ms.topic: how-to
ms.service: azure-enclave
ms.date: 09/15/2026
---

# Create a community endpoint in the Azure portal

In this how-to guide, you create a [community endpoint](./what-community-endpoint.md) and add a rule that defines an allowed destination for enclave connections.

## Prerequisites

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/) before you begin.

- An existing [community](./create-community-portal.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a community endpoint

1. In the Azure portal, search for `Azure Enclave`.

1. Under `Services`, select `Azure Enclave`.

1. In the `Azure Enclave` page, select `Communities` in the left menu, and then select an existing community.

1. In the left menu, select `Community Endpoints`, and then select `Create`.

    ![Screenshot showing the community endpoint list.](./media/tutorial-step-five-fabrikam-endpoint-list.png)

1. Enter a name for the community endpoint, and then select `Add` to create a community endpoint rule.

### Community endpoint rule types

Before you add the rule, choose the destination type that matches the endpoint you need to allow.

- `IPAddress`: Allow traffic from an enclave to one or more destination IP addresses or CIDR ranges.
- `FQDN`: Allow traffic from an enclave to a trusted fully qualified domain name (FQDN). FQDN rules support `HTTP`, `HTTPS`, `TCP`, or `UDP`; use only one protocol and one port per rule. Basic firewall SKU doesn't support FQDN rules.
- `FQDNTag`: Allow traffic from enclaves to known Microsoft Azure services through FQDN tags. Use `HTTPS`, except that the `windowsupdate` tag supports `HTTP` or `HTTPS`, and specify one port. Basic firewall SKU doesn't support FQDN tag rules.
- `ServiceTag`: Allow traffic from enclaves to Azure services by using Azure service tags. This destination type is available in the `2025-11-01-preview` API version and later. Supported protocols include `TCP`, `UDP`, `ICMP`, and `ANY`. Use `ANY` by itself; don't combine it with another protocol.
- `PrivateNetwork`: Allow traffic from enclaves to an external private network. Specify destination CIDR ranges and a succeeded [transit hub](./create-transit-hub-portal.md) in the same community.

Enter the `Rule name`, `Destination type`, `Destination`, `Port`, and `Protocol`, and then select `Add`.

[ ![Screenshot showing the creation page for the community endpoint with the required inputs.](./media/tutorial-step-five-fabrikam-endpoint-rules.png) ](./media/tutorial-step-five-fabrikam-endpoint-rules.png#lightbox)

### Configure service tag rules

When you create a `ServiceTag` rule:

1. Select `ServiceTag` as the destination type.
1. Choose the `Destination` service tag from the list, such as `Storage`, `AzureKeyVault`, or `AzureActiveDirectory`.
1. Select the protocol: `TCP`, `UDP`, `ICMP`, or `ANY`.
1. Enter the destination ports required for your service.

    > [!TIP]
    > Use service tags when you need to connect to Azure services that have dynamic IP address ranges. Service tags reduce the need to track and update IP addresses manually.

1. Select `Review + create`, and then select `Create`.

## Verify the community endpoint

After deployment finishes, open the community and select **Community Endpoints**. Confirm that the new endpoint and its rule appear in the list.

## Related content

- [What is a community endpoint?](./what-community-endpoint.md)
- [What is a community?](./what-community.md)
- [Create a community](./create-community-portal.md)
- [Create an enclave connection](./create-enclave-connection-portal.md)
- [Best practices](./best-practices.md)
