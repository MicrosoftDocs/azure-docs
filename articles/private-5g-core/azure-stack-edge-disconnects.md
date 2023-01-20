---
title: Azure Stack Edge disconnects 
titleSuffix: Azure Private 5G Core Preview
description: An overview of Azure Private 5G Core's behavior during disconnects.
author: James-Green-Microsoft
ms.author: jamesgreen
ms.service: private-5g-core
ms.topic: conceptual 
ms.date: 11/30/2022
ms.custom: template-concept 
---

# Azure Stack Edge disconnects

There are several reasons why your *Azure Private 5G Core (AP5GC)* may have *Azure Stack Edge (ASE)* disconnects. These disconnects can either be unplanned short-term [Temporary disconnects](#temporary-disconnects) or periods of [Disconnected mode for up to two days](#disconnected-mode-for-azure-private-5g-core-preview).

## Temporary disconnects

Azure Stack Edge can tolerate small periods of unplanned temporary disconnect. The following sections detail the behavior expected during these times and behavior after ASE reconnect.

Throughout any temporary disconnects, the **Azure Stack Edge overview** will display a banner stating `The device heartbeat is missing. Some operations will not be available in this state. Critical alert(s) present. Click here to view details.`

### Configuration and provisioning actions during temporary disconnects

It's common to see configuration and provisioning failures while ASE is temporarily disconnected. AP5GC can handle such events without major issues by automatically retrying configuration and provisioning actions once the ASE reconnects. If the action hasn't succeed within 10 minutes, an error displays and you will need to repeat the action manually once ASE reconnects.

Throughout disconnects, the **SIM overview** blade displays SIM provisioning status in the **Site Details** section allowing you to monitor progress for any pending configuration and provisioning actions.

### ASE behavior after reconnecting

Once ASE reconnects, several features will resume:

- ASE management will resume immediately.
- **Resource Health** will be viewable immediately.
- **Workbooks** will be viewable immediately and will populate for the disconnected duration.
- **Kubernetes Cluster Overview** will show as **Online** after 10 minutes.
- **Monitoring** tabs will show metrics for sites after 10 minutes, but won't populate stats for the disconnected duration.
- **Kubernetes Arc Insights** will show new stats after 10 minutes, but won't populate stats for the disconnected duration.
- **Resource Health** views will be viewable immediately.
- [Workbooks](/azure/update-center/workbooks) for the ASE will be viewable immediately and will populate for the disconnected duration.

## Disconnected mode for Azure Private 5G Core Preview

*Disconnected mode* allows for ASE disconnects of up to two days. During disconnected mode, AP5GC core functionality persists through ASE disconnects due to: network issues, network equipment resets and temporary network equipment separation. During disconnects, the ASE management GUI will display several banners alerting that it's currently disconnected and the impact on functions.

### Functions not supported while in disconnected mode

The following functions aren't supported while in disconnected mode:

- Deployment of the 5G core
- Updating the 5G core version
- Updating SIM configuration
- Updating NAT configuration
- Updating service policy
- Provisioning SIMs

### Monitoring and troubleshooting during disconnects

<!-- TODO: add in paragraph once AAD feature is live and remove first sentence of existing paragraph.
Azure Active Directory based sign on for distributed tracing and Grafana monitoring won't be available while in disconnected mode. However, you can configure username and password access to each of these tools if you plan to require access during periods of disconnect. -->
Distributed tracing and packet core dashboards are accessible in disconnected mode. Once the disconnect ends, log analytics on Azure will update with the stored data, excluding rate and gauge type metrics.

## Next steps

Once reconnected, you can continue to manage your deployment:

- [Create a site using the Azure portal](create-a-site.md)
- [Modify the packet core instance in a site](modify-packet-core.md)
- [Provision new SIMs for Azure Private 5G Core Preview - Azure portal](provision-sims-azure-portal.md)
- [Provision new SIMs for Azure Private 5G Core Preview - ARM template](provision-sims-arm-template.md)