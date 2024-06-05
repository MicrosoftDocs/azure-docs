---
title: Use service tag for Azure Resource Manager
description: Learn how to use the service tag for Azure Resource Manager to create security rules that allow or deny traffic.
ms.topic: conceptual
ms.date: 05/07/2024
---

# Understand how to use Azure Resource Manager service tag

By using the `AzureResourceManager` service tag, you can define network access for the Azure Resource Manager service without specifying individual IP addresses. The service tag is a group of IP address prefixes that you use to minimize the complexity of creating security rules. When you use service tags, Azure automatically updates the IP addresses as they change for the service. However, the service tag isn't a security control mechanism. The service tag is merely a list of IP addresses.

## When to use

You use service tags to define network access controls for:

* Network security groups (NSGs)
* Azure Firewall rules
* User-defined routing (UDR)

In addition to these scenarios, use the `AzureResourceManager` service tag to:

* Restrict access to linked templates referenced within an ARM template deployment.
* Restrict access to a Kubernetes control plane accessed via Bicep extensibility.

## Security considerations

The Azure Resource Manager service tag helps you define network access, but it shouldn't be considered as a replacement for proper network security measures. In particular, the Azure Resource Manager service tag:

* Doesn't provide granular control over individual IP addresses.
* Shouldn't be relied upon as the sole method for securing a network.

## Monitoring and automation

When monitoring your infrastructure, use the specific IP address prefixes that are associated with a service tag in the Azure networking stack.

For deployment automation and monitoring, make sure that only public IPs from the service's tagged ranges are used on customer-facing portions of the service.

## Next steps

For more information about service tags, see [Virtual network service tags](../../virtual-network/service-tags-overview.md).
