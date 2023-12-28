---
title: Connect the node host to Azure Arc-enabled Servers
titleSuffix: Connect Arc-enabled servers
description: Connect the node host to Azure Arc-enabled servers from an isolated network 
author: PatAltimore
ms.subservice: layered-network-management
ms.author: patricka
ms.topic: how-to
ms.custom: ignite-2023
ms.date: 1/2/2024

#CustomerIntent: As an operator, I want to configure Layered Network Management so that I have secure isolate devices.
---

# Connect the node host to Azure Arc-enabled Servers

This walkthrough is an example of connecting your host machine to the Arc as an [Arc-enabled Server](/azure/azure-arc/servers) from an isolated network environment (for example, level 3 of the *Purdue Network*). With the steps in this guidance, the host machine connects to the Layered Network Management at the parent level as a proxy, then reaches to the Azure endpoints for the service. You should review these steps and integrate them into your procedure of setting up your cluster for Azure IoT Operations. Do not use this guidnace independently. For more information, see [Configure Layered Network Management service to enable Azure IoT Operations in an isolated network](howto-configure-aks-edge-essentials-layered-network.md).

> [!IMPORTANT]
> **Arc-enabled Servers** isn't a requirement for the Azure IoT Operations experiences. You should evaluate your own design and only enable this service if it suit your needs. Before proceed with these steps, you should also get familar with the **Arc-enabled Servers** by trying this service out with a machine that has direct internet access.

> [!NOTE]
> Layered Network Management for Arc-enabled Servers does not support Azure VM. 

## Configuration for Layered Network Management
To support the Arc-enabled Servers, the level 4 Layered Network Management instance needs to include the following endpoints in the allowlist when applying the CR.

> [!NOTE] 
> If you plan to onboard an Ubuntu machine, you will also need to add the domain name of your choice of *software and update* repository to the allowlist. Refer to [Configuration Ubuntu host machine](#configure-ubuntu-host-machine) for selecting the repository.

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

If you want to enable optional features, there are more endpoints needs to be added as listed in the table below. For more information, see [Connected Machine agent network requirements](/azure/azure-arc/servers/network-requirements).

| Endpoints | Description |
|---|---|
| *.waconazure.com | For Windows Admin Center connectivity |
| san-af-[REGION]-prod.azurewebsites.net | For SQL Server enabled by Azure Arc. The Azure Extension for SQL Server uploads inventory and billing information to the data processing service. |
| telemetry.[REGION].arcdataservices.com | For Arc SQL Server. Sends service telemetry and performance monitoring to Azure |

## Configure Windows host machine
If you have prepared your host machine and cluster ready for Arc-enable by following the [Configure level 3 cluster](howto-configure-l3-cluster-layered-network.md), you can proceed with the Arc-enabled Servers onboarding. Otherwise, you need to at least point the host machine to your custom DNS. For more information, see [Configure the DNS server](howto-configure-layered-network.md#configure-the-dns-server).

After properly set up the parent level Layered Network Management instance and custom DNS, refer to the [Quickstart: Connect hybrid machines with Azure Arc-enabled servers](/azure/azure-arc/servers/learn/quick-enable-hybrid-vm).
- After downloading the `OnboardingScript.ps1`, open it with a text editor. Identify the following section, and add the parameter `--use-device-code` at the end of the command.
    ```
    # Run connect command
    & "$env:ProgramW6432\AzureConnectedMachineAgent\azcmagent.exe" connect --resource-group "$env:RESOURCE_GROUP" --tenant-id "$env:TENANT_ID" --location "$env:LOCATION" --subscription-id "$env:SUBSCRIPTION_ID" --cloud "$env:CLOUD" --correlation-id "$env:CORRELATION_ID";
    ```
- Proceed with the steps in [Quickstart: Connect hybrid machines with Azure Arc-enabled servers](/azure/azure-arc/servers/learn/quick-enable-hybrid-vm) to complete the onboarding.

## Configure Ubuntu host machine
If you have prepared your host machine and cluster ready for Arc-enable by following the [Configure level 3 cluster](howto-configure-l3-cluster-layered-network.md), you can proceed with the Arc-enabled Servers onboarding. Otherwise, you need to at least point the host machine to your custom DNS. For more information, see [Configure the DNS server](howto-configure-layered-network.md#configure-the-dns-server).

Before starting the onboarding process, you need to assign an *https* address for the *software and update* repository for your Ubuntu OS.
1. Visit https://launchpad.net/ubuntu/+archivemirrors and identify a repository that is close to your location, and support *https* protocol. 
1. Modify `/etc/apt/sources.list` to replace the address with the URL from the last step.
1. You also need to add the domain name of this repository to the Layered Network Management allowlist.
1. Run `apt update` to confirm the update is pulling packages from the new repository with *https* protocol.

Refer to the [Quickstart: Connect hybrid machines with Azure Arc-enabled servers](/azure/azure-arc/servers/learn/quick-enable-hybrid-vm) to complete the Arc-enabled Servers onboarding.