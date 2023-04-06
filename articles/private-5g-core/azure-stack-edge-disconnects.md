---
title: Azure Stack Edge disconnects 
titleSuffix: Azure Private 5G Core
description: An overview of Azure Private 5G Core's behavior during disconnects.
author: James-Green-Microsoft
ms.author: jamesgreen
ms.service: private-5g-core
ms.topic: conceptual 
ms.date: 11/30/2022
ms.custom: template-concept 
---

# Azure Stack Edge disconnects

There are several reasons why your *Azure Private 5G Core (AP5GC)* may have *Azure Stack Edge (ASE)* disconnects. These disconnects can either be unplanned short-term [Temporary disconnects](#temporary-disconnects) or periods of [Disconnected mode for up to two days](#disconnected-mode-for-azure-private-5g-core).

## Temporary disconnects

ASE can tolerate small periods of unplanned connectivity issues. The following sections detail the behavior expected during these times and behavior after ASE connectivity resumes.

Throughout any temporary disconnects, the **Azure Stack Edge overview** will display a banner stating `The device heartbeat is missing. Some operations will not be available in this state. Critical alert(s) present. Click here to view details.`

### Configuration and provisioning actions during temporary disconnects

It's common to see temporary failures such as timeouts of configuration and provisioning while ASE is online, but there is a connectivity issue. AP5GC can handle such events by automatically retrying configuration and provisioning actions once the ASE connectivity is restored. If ASE connectivity is not restored within 10 minutes or ASE is detected as being offline, ongoing operations will fail and you will need to repeat the action manually once ASE reconnects.

The **Sim overview** and **Sim Policy overview** blades display provisioning status of the resource in the site. This allows you to monitor the progress of provisioning actions. Additionally, the **Packet core control plane overview** displays the **Installation state** which can be used to monitor changes due to configuration actions.

### ASE behavior after connectivity resumes

Once ASE connectivity resumes, several features will resume:

- ASE management will resume immediately.
- **Resource Health** will be viewable immediately.
- **Workbooks** will be viewable immediately and will populate for the disconnected duration.
- **Kubernetes Cluster Overview** will show as **Online** after 10 minutes.
- **Monitoring** tabs will show metrics for sites after 10 minutes, but won't populate stats for the disconnected duration.
- **Kubernetes Arc Insights** will show new stats after 10 minutes, but won't populate stats for the disconnected duration.
- **Resource Health** views will be viewable immediately.
- [Workbooks](../update-center/workbooks.md) for the ASE will be viewable immediately and will populate for the disconnected duration.

## Disconnected mode for Azure Private 5G Core

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

While in disconnected mode, you won't be able to change the local monitoring authentication method or sign in to the [distributed tracing](distributed-tracing.md) and [packet core dashboards](packet-core-dashboards.md) using Azure Active Directory. If you expect to need access to your local monitoring tools while the ASE is disconnected, you can change your authentication method to local usernames and passwords by following [Modify the local access configuration in a site](modify-local-access-configuration.md).

Once the disconnect ends, log analytics on Azure will update with the stored data, excluding rate and gauge type metrics.

## Next steps

Once reconnected, you can continue to manage your deployment:

- [Create a site using the Azure portal](create-a-site.md)
- [Modify the packet core instance in a site](modify-packet-core.md)
- [Provision new SIMs for Azure Private 5G Core - Azure portal](provision-sims-azure-portal.md)
- [Provision new SIMs for Azure Private 5G Core - ARM template](provision-sims-arm-template.md)