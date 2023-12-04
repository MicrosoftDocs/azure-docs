---
description: This article describes a scenario for using Azure Cloud Shell in a private virtual network.
ms.contributor: jahelmic
ms.date: 06/21/2023
ms.topic: article
title: Use Cloud Shell in an Azure virtual network
---

# Use Cloud Shell in an Azure virtual network

By default, Azure Cloud Shell sessions run in a container in a Microsoft network that's separate
from your resources. Commands that run inside the container can't access resources in a private
virtual network. For example, you can't use Secure Shell (SSH) to connect from Cloud Shell to a
virtual machine that has only a private IP address, or use `kubectl` to connect to a Kubernetes
cluster that has locked down access.

To provide access to your private resources, you can deploy Cloud Shell into an Azure virtual
network that you control. This technique is called _virtual network isolation_.

## Benefits of virtual network isolation with Cloud Shell

Deploying Cloud Shell in a private virtual network offers these benefits:

- The resources that you want to manage don't need to have public IP addresses.
- You can use command-line tools, SSH, and PowerShell remoting from the Cloud Shell container to
  manage your resources.
- The storage account that Cloud Shell uses doesn't have to be publicly accessible.

## Things to consider before deploying Azure Cloud Shell in a virtual network

- Starting Cloud Shell in a virtual network is typically slower than a standard Cloud Shell session.
- Virtual network isolation requires you to use [Azure Relay][01], which is a paid service. In the
  Cloud Shell scenario, one hybrid connection is used for each administrator while they're using
  Cloud Shell. The connection is automatically closed when the Cloud Shell session ends.

## Architecture

The following diagram shows the resource architecture that you must build to enable this scenario.

![Illustration of a Cloud Shell isolated virtual network architecture.][03]

- **Customer client network**: Client users can be located anywhere on the internet to securely
  access and authenticate to the Azure portal and use Cloud Shell to manage resources contained in
  the customer's subscription. For stricter security, you can allow users to open Cloud Shell only
  from the virtual network contained in your subscription.
- **Microsoft network**: Customers connect to the Azure portal on Microsoft's network to
  authenticate and open Cloud Shell.
- **Customer virtual network**: This is the network that contains the subnets to support virtual
  network isolation. Resources such as virtual machines and services are directly accessible from
  Cloud Shell without the need to assign a public IP address.
- **Azure Relay**: [Azure Relay][01] allows two endpoints that aren't directly reachable to
  communicate. In this case, it's used to allow the administrator's browser to communicate with the
  container in the private network.
- **File share**: Cloud Shell requires a storage account that's accessible from the virtual network.
  The storage account provides the file share used by Cloud Shell users.

## Related links

For more information, see the [pricing][02] guide.

<!-- link references -->
[01]: ../azure-relay/relay-what-is-it.md
[02]: https://azure.microsoft.com/pricing/details/service-bus/
[03]: media/private-vnet/data-diagram.png
