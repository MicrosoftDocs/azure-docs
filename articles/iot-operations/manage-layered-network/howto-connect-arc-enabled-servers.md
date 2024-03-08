---
title: Connect Azure Arc-enabled servers from an isolated network
description: Connect a node host to Azure Arc-enabled servers from an isolated network environment using Azure IoT Layered Network Management.
author: PatAltimore
ms.subservice: layered-network-management
ms.author: patricka
ms.topic: how-to
ms.date: 01/09/2024

#CustomerIntent: As an operator, I want to configure Layered Network Management so that I have secure isolated devices.
---

# Connect Azure Arc-enabled servers from an Azure IoT Layered Network Management Preview isolated network

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

This walkthrough is an example of connecting your host machine to Azure Arc as an [Arc-enabled server](/azure/azure-arc/servers) from an isolated network environment. For example, level 3 of the *Purdue Network*. You connect the host machine to Azure IoT Layered Network Management Preview at the parent level as a proxy to reach Azure endpoints for the service. You can integrate these steps into your procedure to set up your cluster for Azure IoT Operations Preview. Don't use this guidance independently. For more information, see [Configure Layered Network Management service to enable Azure IoT Operations Preview in an isolated network](howto-configure-aks-edge-essentials-layered-network.md).

> [!IMPORTANT]
> **Arc-enabled servers** aren't a requirement for the Azure IoT Operations experiences. You should evaluate your own design and only enable this service if it suits your needs. Before proceeding with these steps, you should also get familiar with the **Arc-enabled servers** by trying this service with a machine that has direct internet access.

> [!NOTE]
> Layered Network Management for Arc-enabled servers does not support Azure VMs.

## Configuration for Layered Network Management Preview

To support the Arc-enabled servers, the level 4 Layered Network Management instance needs to include the following endpoints in the allowlist when applying the custom resource:

```
    - destinationUrl: "gbl.his.arc.azure.com"
      destinationType: external
    - destinationUrl: "gbl.his.arc.azure.us"
      destinationType: external
    - destinationUrl: "gbl.his.arc.azure.cn"
      destinationType: external
    - destinationUrl: "packages.microsoft.com"
      destinationType: external
    - destinationUrl: "aka.ms"
      destinationType: external
    - destinationUrl: "ppa.launchpadcontent.net"
      destinationType: external
    - destinationUrl: "mirror.enzu.com"
      destinationType: external
    - destinationUrl: "*.guestconfiguration.azure.com"
      destinationType: external
    - destinationUrl: "agentserviceapi.guestconfiguration.azure.com"
      destinationType: external
    - destinationUrl: "pas.windows.net"
      destinationType: external
    - destinationUrl: "download.microsoft.com"
      destinationType: external
```
> [!NOTE] 
> If you plan to onboard an Ubuntu machine, you also need to add the domain name of the *software and update* repository of your choice to the allowlist. For more information selecting the repository, see [Configuration Ubuntu host machine](#configure-ubuntu-host-machine).

If you want to enable optional features, add the appropriate endpoint from the following table. For more information, see [Connected Machine agent network requirements](/azure/azure-arc/servers/network-requirements).

| Endpoint | Optional feature |
|---|---|
| *.waconazure.com | Windows Admin Center connectivity |
| san-af-[REGION]-prod.azurewebsites.net | SQL Server enabled by Azure Arc. The Azure extension for SQL Server uploads inventory and billing information to the data processing service. |
| telemetry.[REGION].arcdataservices.com | For Arc SQL Server. Sends service telemetry and performance monitoring to Azure. |

## Configure Windows host machine

If you prepared your host machine and cluster to be Arc-enabled by following the [Configure level 3 cluster](howto-configure-l3-cluster-layered-network.md) article, you can proceed to onboard your Arc-enabled server. Otherwise at a minimum, point the host machine to your custom DNS. For more information, see [Configure the DNS server](howto-configure-layered-network.md#configure-the-dns-server).

After properly setting up the parent level Layered Network Management instance and custom DNS, see [Quickstart: Connect hybrid machines with Azure Arc-enabled servers](/azure/azure-arc/servers/learn/quick-enable-hybrid-vm).
- After downloading the `OnboardingScript.ps1`, open it with a text editor. find the following section and add the parameter `--use-device-code` at the end of the command.
    ```
    # Run connect command
    & "$env:ProgramW6432\AzureConnectedMachineAgent\azcmagent.exe" connect --resource-group "$env:RESOURCE_GROUP" --tenant-id "$env:TENANT_ID" --location "$env:LOCATION" --subscription-id "$env:SUBSCRIPTION_ID" --cloud "$env:CLOUD" --correlation-id "$env:CORRELATION_ID";
    ```
- Proceed with the steps in [Quickstart: Connect hybrid machines with Azure Arc-enabled servers](/azure/azure-arc/servers/learn/quick-enable-hybrid-vm) to complete the onboarding.

## Configure Ubuntu host machine

If you prepared your host machine and cluster to be Arc-enabled by following the [Configure level 3 cluster](howto-configure-l3-cluster-layered-network.md) article, you can proceed to onboard your Arc-enabled server. Otherwise at a minimum, point the host machine to your custom DNS. For more information, see [Configure the DNS server](howto-configure-layered-network.md#configure-the-dns-server).

Before starting the onboarding process, you need to assign an *https* address for the Ubuntu OS *software and update* repository.
1. Visit https://launchpad.net/ubuntu/+archivemirrors and identify a repository that is close to your location and supports the *https* protocol. 
1. Modify `/etc/apt/sources.list` to replace the address with the URL from the previous step.
1. Add the domain name of this repository to the Layered Network Management allowlist.
1. Run `apt update` to confirm the update is pulling packages from the new repository with *https* protocol.

See [Quickstart: Connect hybrid machines with Azure Arc-enabled servers](/azure/azure-arc/servers/learn/quick-enable-hybrid-vm) to complete the Arc-enabled Servers onboarding.