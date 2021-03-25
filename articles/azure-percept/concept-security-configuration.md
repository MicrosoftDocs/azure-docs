---
title: Azure Percept firewall configuration and security recommendations
description: Learn more about Azure Percept firewall configuration and security recommendations
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: conceptual
ms.date: 03/25/2021
---

# Azure Percept firewall configuration and security recommendations

Review the guidelines below for information on configuring firewalls and general security best practices with Azure Percept.

## Configuring firewalls for Azure Percept DK

If your networking setup requires that you explicitly permit connections made from Azure Percept DK devices, review the following list of components.

This checklist is a starting point for firewall rules:

|URL (* = wildcard)|Outbound TCP Ports|Usage|
|-------------------|------------------|---------|
|*.auth.azureperceptdk.azure.net|443|Azure DK SOM Authentication and Authorization|
|*.auth.projectsantacruz.azure.net|443|Azure DK SOM Authentication and Authorization|

Additionally, review the list of [connections used by Azure IoT Edge](https://docs.microsoft.com/azure/iot-edge/production-checklist#allow-connections-from-iot-edge-devices).

## Additional recommendations for deployment to production

Azure Percept DK offers a great variety of security capabilities out of the box. In addition to those powerful security features included in the current release, Microsoft also suggests the following guidelines when considering production deployments:

- Strong physical protection of the device itself
- Ensure data-at-rest encryption is enabled
- Continuously monitor the device posture and quickly respond to alerts
- Limit the number of administrators who have access to the device
