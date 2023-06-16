---
description: Deploy Cloud Shell into an Azure virtual network
ms.contributor: jahelmic
ms.date: 11/14/2022
ms.topic: article
tags: azure-resource-manager
title: Cloud Shell in an Azure virtual network
---

# Deploy Cloud Shell into an Azure virtual network

A regular Cloud Shell session runs in a container in a Microsoft network separate from your
resources. Commands running inside the container can't access resources that can only be accessed
from a specific virtual network. For example, you can't use SSH to connect from Cloud Shell to a
virtual machine that only has a private IP address, or use `kubectl` to connect to a Kubernetes
cluster that has locked down access.

This optional feature addresses these limitations and allows you to deploy Cloud Shell into an Azure
virtual network that you control. From there, the container is able to interact with resources
within the virtual network you select.

The following diagram shows the resource architecture that's deployed and used in this scenario.

![Illustrates the Cloud Shell isolated VNET architecture.][06]

Before you can use Cloud Shell in your own Azure Virtual Network, you need to create several
resources. This article shows how to set up the required resources using an ARM template.

> [!NOTE]
> These resources only need to be set up once for the virtual network. They can then be shared by
> all administrators with access to the virtual network.

## Required network resources

### Virtual network

A virtual network defines the address space in which one or more subnets are created.

You need to identify the virtual network to be used for Cloud Shell. Usually, you want to use an
existing virtual network that contains resources you want to manage or a network that peers with
networks that contain your resources.

### Subnet

Within the selected virtual network, a dedicated subnet must be used for Cloud Shell containers.
This subnet is delegated to the Azure Container Instances (ACI) service. When a user requests a
Cloud Shell container in a virtual network, Cloud Shell uses ACI to create a container that's in
this delegated subnet. No other resources can be created in this subnet.

### Network profile

A network profile is a network configuration template for Azure resources that specifies certain
network properties for the resource.

### Azure Relay

An [Azure Relay][01] allows two endpoints that aren't directly reachable to communicate. In this
case, it's used to allow the administrator's browser to communicate with the container in the
private network.

The Azure Relay instance used for Cloud Shell can be configured to control which networks can access
container resources:

- Accessible from the public internet: In this configuration, Cloud Shell provides a way to reach
  the internal resources from outside.
- Accessible from specified networks: In this configuration, administrators must access the Azure
  portal from a computer running in the appropriate network to be able to use Cloud Shell.
- Disabled: When the networking for relay is set to disabled, the computer running Azure Cloud Shell
  must be able to reach the private endpoint connected to the relay.

## Storage requirements

As in standard Cloud Shell, a storage account is required while using Cloud Shell in a virtual
network. Each administrator needs a fileshare to store their files. The storage account needs to be
accessible from the virtual network that's used by Cloud Shell.

> [!NOTE]
> Secondary storage regions are currently not supported in Cloud Shell VNET scenarios.

## Virtual network deployment limitations

- Starting Cloud Shell in a virtual network is typically slower than a standard Cloud Shell session.
- All Cloud Shell primary regions, except Central India, are supported.
- [Azure Relay][01] is a paid service. See the [pricing][04] guide. In the Cloud Shell scenario, one
  hybrid connection is used for each administrator while they're using Cloud Shell. The connection
  is automatically shut down after the Cloud Shell session is ended.

## Register the resource provider

The Microsoft.ContainerInstances resource provider needs to be registered in the subscription that
holds the virtual network you want to use. Select the appropriate subscription with
`Set-AzContext -Subscription {subscriptionName}`, and then run:

```powershell
PS> Get-AzResourceProvider -ProviderNamespace Microsoft.ContainerInstance | select ResourceTypes,RegistrationState

ResourceTypes                             RegistrationState
-------------                             -----------------
{containerGroups}                         Registered
...
```

If **RegistrationState** is `Registered`, no action is required. If it's `NotRegistered`, run
`Register-AzResourceProvider -ProviderNamespace Microsoft.ContainerInstance`.

## Deploy network resources

### Create a resource group and virtual network

If you already have a desired VNET that you would like to connect to, skip this section.

In the Azure portal, or using Azure CLI, Azure PowerShell, etc. create a resource group and a
virtual network in the new resource group, **the resource group and virtual network need to be in
the same region**.

### ARM templates

Use the [Azure Quickstart Template][03] for creating Cloud Shell resources in a virtual network,
and the [Azure Quickstart Template][05] for creating necessary storage. Take note of your resource
names, primarily your fileshare name.

### Open relay firewall

By default the relay is only accessible from the virtual network where it was created. To open
access, navigate to the relay created using the previous template, select "Networking" in settings,
allow access from your browser network to the relay.

### Configuring Cloud Shell to use a virtual network.

> [!NOTE]
> This step must be completed for each administrator that uses Cloud Shell.

After deploying and completing the previous steps, open Cloud Shell. One of these experiences must
be used each time you want to connect to an isolated Cloud Shell experience.

> [!NOTE]
> If Cloud Shell has been used in the past, the existing clouddrive must be unmounted. To do this
> run `clouddrive unmount` from an active Cloud Shell session, refresh your page.

Connect to Cloud Shell. You'll be prompted with the first run experience. Select your preferred
shell experience, select **Show advanced settings** and select the **Show VNET isolation settings**
box. Fill in the fields in the form. Most fields will be autofilled to the available resources that
can be associated with Cloud Shell in a virtual network. You must provide a name for the fileshare.

![Illustrates the Cloud Shell isolated VNET first experience settings.][07]

## Next steps

[Learn about Azure Virtual Networks][02]

<!-- link references -->
[01]: ../azure-relay/relay-what-is-it.md
[02]: ../virtual-network/virtual-networks-overview.md
[03]: https://aka.ms/cloudshell/docs/vnet/template
[04]: https://azure.microsoft.com/pricing/details/service-bus/
[05]: https://azure.microsoft.com/resources/templates/cloud-shell-vnet-storage/
[06]: media/private-vnet/data-diagram.png
[07]: media/private-vnet/vnet-settings.png
