---
title: How to enable Micro-BFD on CE and PE devices
description: Process of enabling Micro-BFD On CE and PE devices .
author: sushantjrao 
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 08/12/2024
ms.custom: template-how-to, devx-track-azurecli
---

# Enabling Micro-BFD

Micro-BFD (Bidirectional Forwarding Detection) is a lightweight protocol designed to quickly detect failures between adjacent network devices, such as routers or switches, with minimal overhead. This guide provides step-by-step instructions to enable Micro-BFD on Customer Edge (CE) and Provider Edge (PE) devices.

## Prerequisites

Before enabling Micro-BFD, ensure the following:

- Both CE and PE devices are configured with the required Micro-BFD settings.

- The feature flag `MicroBFDEnabled` is turned off by default. To enable it, please contact Microsoft support through a support incident.

- Need to [put the device in maintenance mode](.\howto-put-device-in-maintenance-mode.md) for below configuration changes.

## Configuration steps

### Step 1: Configure CE devices

1. Access the CE device and enter the configuration mode.

2. Add the following configuration to enable Micro-BFD on the CE-PE interface:

   ```bash
   ip address 10.30.0.65/30
   bfd interval 50 min-rx 50 multiplier 3
   bfd neighbor 10.30.0.66
   bfd per-link rfc-7130
   ```

### Step 2: Configure PE devices

1. Access the PE device and enter the configuration mode.

2. Add the following configuration to enable Micro-BFD on the PE-CE interface:

   ```bash
   ip address 10.30.0.66/30
   bfd interval 50 min-rx 50 multiplier 3
   bfd neighbor 10.30.0.65
   bfd per-link rfc-7130
   ```

### Step 3: Enable feature flag

1. Request the DE team to enable the `MicroBFDEnabled` feature flag.

2. Verify the configuration by checking the status of Micro-BFD sessions on both CE and PE devices.

### Step 4: Validate configuration

Use the following command to check the status of Micro-BFD sessions on the PE device:

```bash
show bfd status dest-ip 10.30.0.65 detail
```
Ensure that the Micro-BFD sessions are established and operational.
