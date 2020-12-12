---
title: Access sensors using a proxy
description: "Enhance system security by preventing user sign-in directly to the sensor. Instead leverage proxy tunneling to let users access the sensor directly from the on-premises management console with a single firewall rule."
author: mlottner
ms.author: mlottner
ms.date: 08/31/2020
ms.topic: article
ms.service: azure
---

## Proxy tunneled connection to sensors

Enhance system security by preventing user sign-in directly to the sensor. Instead leverage proxy tunneling to let users access the sensor directly from the on-premises management console with a single firewall rule. This narrows the possibility of unauthorized access to the network environment beyond the sensor.
Use a proxy in environments where there is no direct connectivity to sensors.

  :::image type="content" source="media/how-to-access-sensors-using-a-proxy/image310.png" alt-text="user":::

Perform the following to set up tunneling, including:

  - Connect a Sensor to the Management Console

  - Set up Tunneling on the Management Console

To enable tunneling:

1. Sign in to the management console appliance CLI with administrative credentials.

2. Type: `sudo cyberx-management-tunnel-enable.`

3. Select **Enter**.

4. Type `--port 10000`.
