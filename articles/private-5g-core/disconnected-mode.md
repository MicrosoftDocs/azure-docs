---
title: Disconnected mode
titleSuffix: Azure Private 5G Core Preview
description: An overview of Azure Private 5G Core's disconnected mode.
author: James-Green-Microsoft
ms.author: jamesgreen
ms.service: private-5g-core
ms.topic: conceptual 
ms.date: 11/30/2022
ms.custom: template-concept 
---

# Disconnected mode for Azure Private 5G Core Preview

*Azure Private 5G Core (AP5GC)* allows for *Azure Stack Edge (ASE)* disconnects of up to two days. Disconnected mode allows AP5GC core functionality to persist through ASE disconnects due to: network issues, network equipment resets and temporary network equipment separation. During disconnects, the ASE management GUI will display several banners alerting that it is currently disconnected and the impact on functions.

## Functions not supported while in disconnected mode

The following functions aren't supported while in disconnected mode:

- Deployment of the 5G core
- Updating the 5G core version
- Updating SIM configuration
- Updating NAT configuration
- Updating service policy
- Provisioning SIMs

## Monitoring and troubleshooting during disconnects

<!-- TODO: add in paragraph once AAD feature is live and remove first sentence of existing paragraph.
Azure Active Directory based sign on for distributed tracing and Grafana monitoring won't be available while in disconnected mode. However, you can configure username and password access to each of these tools if you plan to require access during periods of disconnect. -->
Distributed tracing and packet core dashboards are accessible in disconnected mode. Once the disconnect ends, log analytics on Azure will update with the stored data, excluding rate and gauge type metrics.

## Configuration and provisioning actions during disconnects

It is common to see configuration and provisioning failures while ASE is disconnected. AP5GC can handle such events without major issues by retrying configuration and provisioning actions over a set period. If the actions do not succeed when the period ends, an error is displayed and you will need to  repeat the action once ASE reconnects. Throughout the disconnect, the SIM overview blade continues to display SIM provisioning status in the Site Details section allowing you to monitor progress for any configuration and provisioning actions.

## ASE behavior after reconnecting

Once ASE reconnects, several features will resume:

- ASE management will resume immediately.
- **Resource Health** will be viewable immediately.
- **Workbooks** will be viewable immediately. Additionally, **Workbooks** will populate for the duration of the disconnect.
- **Kubernetes Cluster Overview** will show as **Online** after 10 minutes.
- **Metrics** and **Insights** will show new stats after 10 minutes, but will not populate stats for the duration of the disconnect.
- **Log Analytics** will show metrics and populate charts after 10 minutes. Additionally, **Logs Analytics** will populate for the duration of the disconnect.

## Next steps

Once reconnected, you can continue to manage your deployment:

- [Create a site using the Azure portal](create-a-site.md)
- [Modify the packet core instance in a site](modify-packet-core.md)
- [Provision new SIMs for Azure Private 5G Core Preview - Azure portal](provision-sims-azure-portal.md)
- [Provision new SIMs for Azure Private 5G Core Preview - ARM template](provision-sims-arm-template.md)