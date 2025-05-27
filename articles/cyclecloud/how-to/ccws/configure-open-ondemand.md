---
title: Configure Open Demand with CycleCloud
description: How to configure Open OnDemand with CycleCloud
author: xpillons
ms.date: 05/27/2025
ms.author: padmalathas
---

# Configure Open OnDemand with CycleCloud
Open OnDemand is a web-based interface that provides a user-friendly way to interact with the Slurm cluster deployed by Azure CycleCloud. Open OnDemand is automatically installed and configured when deploying Azure CycleCloud Workspace for Slurm, but there remain few steps that must be manually executed.

## Update settings for Microsoft Entra ID authentication
The Open OnDemand front end uses Open ID Connect (OIDC) for authentication. The OIDC provider is a Microsoft Entra ID application that was registered specifically for this purpose (see [How to register a Microsoft Entra ID application for Open OnDemand Authentication](./register-entra-id-app.md)). The following steps describe how to update the settings for Entra ID authentication.

Browse to the CycleCloud web portal, select the OpenOnDemand cluster, and click on the Edit button. This opens the cluster template definition. 
1. Select Advanced settings,
1. Leave FQDN empty,
1. Set the Client ID to that of the registered application ID created in previous steps,
1. Set the user domain to the enterprise domain,
1. Tenant ID should be set to that of the tenant in which the application registration exists,
1. The managed identity should be manually set to the one named `/ccwOpenOnDemandManagedIdentity` 
> [!NOTE]
> This value will initially fail to appear due to a UI bug, so this needs to be set again when editing the template.
 
Press `Save` and then `Start Cluster` and wait for the Open OnDemand virtual machine to be ready.

:::image type="content" source="../../images/ccws/open-ondemand-advanced-settings.png" alt-text="Screenshot of Open OnDemand cluster configuration.":::

## Resources
* [Add users for Open OnDemand](./open-ondemand-add-users.md)