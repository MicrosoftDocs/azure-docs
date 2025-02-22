---
title: How to enable Micro-BFD on CE and PE devices
description: Process of enabling Micro-BFD On CE and PE devices.
author: sushantjrao 
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 08/12/2024
ms.custom: template-how-to, devx-track-azurecli
---

# Enabling Micro-BFD

Micro-BFD (Bidirectional Forwarding Detection) is a lightweight protocol designed to rapidly detect failures between adjacent network devices, such as routers or switches, with minimal overhead. This guide provides step-by-step instructions to enable Micro-BFD on Customer Edge (CE) and Provider Edge (PE) devices.

## Prerequisites

Ensure the following prerequisites are met before enabling Micro-BFD:

- Both CE and PE devices are preconfigured with the required Micro-BFD settings.

- The feature flag `MicroBFDEnabled` is turned off by default.

>[!Note]
> It is required to contact Microsoft support through a support incident to enable the feature flag once necessary configurations has been performed to devices as explained in this article.

- It's necessary to [put the device in maintenance mode](.\howto-put-device-in-maintenance-mode.md) to apply below the configuration changes. 

## Configuration steps for enabling Micro-BFD

Follow these steps to enable Micro-BFD, starting with the secondary devices. Once verified, proceed with the primary devices using the instructions provided.
 
### Step 1: Place CE2 in Maintenance Mode

Run the following Azure CLI command to place the CE2 device in maintenance mode:

```Azure CLI
az networkfabric device update-admin-state --resource-group <resource-group> --resource-name <resource-name> --state UnderMaintenance
```

>[!Note]
> For new deployments, maintenance mode is not required.

### Step 2: Configure Micro-BFD on CE2

Use the following Azure CLI command to configure Micro-BFD under Port-Channel1 on CE2.

```Azure CLI 
az networkfabric device run-rw --ids /subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/
Microsoft.ManagedNetworkFabric/NetworkDevices/<device>-AggrRack-CE2 --rw-command "interface Port-Channel1
    ip address 10.30.0.69/30
    mtu 9124
    no switchport
    bfd neighbor 10.30.0.70
    bfd interval 50 min-rx 50 multiplier 3
    bfd per-link rfc-7130
!"
```

```Example IP address allocation
NFIPv4Addr: 10.30.0.0/19
CE<->PE MicroBFD: 10.30.0.64/30
CE1: 10.30.0.65/30 & PE1: 10.30.0.66/30
CE2: 10.30.0.69/30 & PE2: 10.30.0.70/30
NFIPv4Addr: 10.30.32.0/19
CE<->PE MicroBFD: 10.30.32.64/30
CE1: 10.30.32.65/30 & PE1: 10.30.32.66/30
CE2: 10.30.32.69/30 & PE2: 10.30.32.70/30
```

Verify the changes using the following command and check that the configured IP address, BFD interval, and neighbor details match the intended configuration.

```Example show output after configuring MicroBFD on CE2
CE2#show running-config interfaces pox
    interface pox
        description "Port pox Connected to PE-02"
        mtu 9124
        no switchport
        ip address 10.30.0.69/30
        bfd interval 50 min-rx 50 multiplier 3
        bfd neighbor 10.30.0.70
        bfd per-link rfc-7130
```

### Step 3: Configure Micro-BFD on PE2

Use the following command to configure PE2 with Micro-BFD: Consider min-links under the PE device for the respective port-channel.

```Azure CLI 
az networkfabric device run-rw --ids /subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/
Microsoft.ManagedNetworkFabric/NetworkDevices/<device>-AggrRack-PE2 --rw-command "interface Port-Channel1
    ip address 10.30.0.70/30
    mtu 9124
    no switchport
    bfd neighbor 10.30.0.69
    bfd interval 50 min-rx 50 multiplier 3
    bfd per-link rfc-7130
```

Verify the changes using the following command and check that the configured IP address, BFD interval, and neighbor details match the intended configuration.

```Example Show Output After Configuring MicroBFD on PE2
PE2#show running-config interfaces pox
    interface pox
        description "Port pox Connected to CE-02"
        mtu 9124
        no switchport
        ip address 10.30.0.70/30
        bfd interval 50 min-rx 50 multiplier 3
        bfd neighbor 10.30.0.69
        bfd per-link rfc-7130
```

### Step 4: Move device CE2 into enabled state

Use the following command to re-enable the device and make it operational after configuration.

```Azure CLI
az networkfabric device update-admin-state --resource-group <resource-group> --resource-name <resource-name> --state Enable
```

>[!Note]
> For new deployments, this step is not required.

### Step 5: Verify BFD details

Check BFD peer details using the following command:

```Bash
CE2#show bfd peers dest-ip <dest-bfd-peer-ip> detail
```

>[!NOTE] 
> After verifying the configuration on secondary devices, repeat steps 1 to 5 for primary devices (CE1 and PE1).

### Step 6: Ensure connectivity and BGP sessions

Ensure connectivity between CE and PE devices is stable, and BGP sessions are established with the appropriate routes.

### Step 7: Enable Micro-BFD Flag

Contact Microsoft support through a support incident to enable the Micro-BFD feature flag. After enabling the feature flag, a full reconciliation with the base configuration is required, ensuring the NPB property is set to true.

### Step 8: Verify Connectivity and BGP Sessions

After enabling the feature flag, confirm that connectivity and BGP sessions remain stable.

### Step 9: Remove configuration from RW config

After the BFD sessions are up, run the following Azure CLI command to remove BFD configurations. This process ensures that every full reconcile request avoids reapplying configurations to the devices.

```Azure CLI 
az networkfabric device run-rw --ids /subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.ManagedNetworkFabric/NetworkDevices/<device-name>-AggrRack-CE1\PE1\CE2\PE2 --rw-command " "
```

### Step 11: Ensure devices aren't disturbed

Ensure that devices aren't disturbed for Micro-BFD configuration.

## Recovery steps if Micro-BFD is misconfigured

In cases like reconfiguration, where Micro-BFD is disabled by default but the Provider Edge (PE) device still has settings from a previous deployment, it's important to remove the Micro-BFD configuration from the PE device.

Follow these steps to ensure that Micro-BFD is disabled on your PE devices:

### Step1: Identify the PE devices

Determine which PE devices have the Micro-BFD configuration from the previous deployment.

### Step2: Remove Micro-BFD configuration

Access the configuration settings of each identified PE device and remove any existing Micro-BFD settings.

### Verify configuration

Ensure that the Micro-BFD settings have been successfully removed and that the PE device is operating without Micro-BFD enabled.
