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

# Temporary AP5GC disconnects

Azure Stack Edge (ASE) can tolerate up to five days of unplanned connectivity issues. The following sections detail the behavior expected during these times and behavior after ASE connectivity resumes.

Throughout temporary disconnects, the **Azure Stack Edge overview** displays a banner stating `The device heartbeat is missing. Some operations will not be available in this state. Critical alert(s) present. Click here to view details.`

> [!CAUTION]
> Limited Azure Private 5G Core (AP5GC) support is available if you encounter issues while disconnected. If you encounter issues during a disconnect, we recommend you reconnect to enable full support. If it is not possible to reconnect, support is provided on a best-effort basis.

While disconnected, AP5GC core functionality persists through ASE disconnects due to network issues, network equipment resets and temporary network equipment separation. During disconnects, the ASE management GUI displays several banners stating that it's currently disconnected and describing the impact on functions.

## Unsupported functions during disconnects

The following functions aren't supported while disconnected:

- Deploying the packet core
- Reinstalling the packet core
- Updating the packet core version
- Rolling back the packet core version
- Updating SIM configuration
- Updating NAT configuration
- Updating service policy
- Provisioning SIMs

### Monitoring and troubleshooting during disconnects

While disconnected, you can't enable local monitoring authentication or sign in to the [distributed tracing](distributed-tracing.md) and [packet core dashboards](packet-core-dashboards.md) using Azure Active Directory. However, you can access both distributed tracing and packet core dashboards via local access if enabled.

New [Azure Monitor platform metrics](monitor-private-5g-core-with-platform-metrics.md) won't be collected while in disconnected mode. Once the disconnect ends, Azure Monitor will automatically resume gathering metrics about the packet core instance.

If you expect to need access to your local monitoring tools while the ASE device is disconnected, you can change your authentication method to local usernames and passwords by following [Modify the local access configuration in a site](modify-local-access-configuration.md).

### Configuration and provisioning actions during temporary disconnects

It's common to see temporary failures such as timeouts of configuration and provisioning while ASE is online but with a connectivity issue. AP5GC can handle such events by automatically retrying configuration and provisioning actions once ASE connectivity is restored. If ASE connectivity isn't restored within 10 minutes, or ASE is detected as being offline, ongoing operations fail and you'll need to repeat the action manually once the ASE reconnects.

The **Sim overview** and **Sim Policy overview** blades display provisioning status of the resource in the site, which allows you to monitor the progress of provisioning actions. Additionally, the **Packet core control plane overview** displays the **Installation state** which can be used to monitor changes due to configuration actions.

### ASE behavior after connectivity resumes

Once ASE connectivity resumes, several features resume:

- ASE management resumes immediately.
- **Resource Health** is viewable immediately.
- **Workbooks** is viewable immediately and populates for the disconnected duration.
- **Kubernetes Cluster Overview** shows as **Online** after 10 minutes.
- **Monitoring** tabs show metrics for sites after 10 minutes but don't populate stats for the disconnected duration.
- **Kubernetes Arc Insights** shows new stats after 10 minutes but doesn't populate stats for the disconnected duration.
- **Resource Health** views are viewable immediately.
- [Workbooks](../update-center/workbooks.md) for the ASE are viewable immediately and populate for the disconnected duration.

## Next steps

Once reconnected, you can continue to manage your deployment:

- [Create a site using the Azure portal](create-a-site.md)
- [Modify the packet core instance in a site](modify-packet-core.md)
- [Provision new SIMs for Azure Private 5G Core - Azure portal](provision-sims-azure-portal.md)
- [Provision new SIMs for Azure Private 5G Core - ARM template](provision-sims-arm-template.md)