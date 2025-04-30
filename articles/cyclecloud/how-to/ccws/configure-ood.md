---
title: Configure Open OnDemand with CycleCloud
description: How to configure Open OnDemand with CycleCloud
author: xpillons
ms.date: 04/30/2025
ms.author: padmalathas
---

# Configure Open OnDemand with CycleCloud
Open OnDemand is a web-based interface that provides a user-friendly way to interact with the Slurm cluster deployed by Azure CycleCloud. Open OnDemand is automatically installed and configured when deploying Azure CycleCloud Workspace for Slurm, but there remain few steps that must be manually executed.

## Update settings for Entra ID authentication
The Open OnDemand front end uses Open ID Connect (OIDC) for authentication. The OIDC provider is an Entra ID application that was registered specifically for this purpose (see [How to register an Entra ID application for Open OnDemand Authentication](./register-entra-id-app.md)). The following steps describe how to update the settings for Entra ID authentication.

Browse to the CycleCloud web portal, select the OpenOnDemand cluster, and click on the Edit button. This opens the cluster template definition. 
1. Select Advanced settings,
1. Leave FQDN empty,
1. Set the Client ID to that of the registered application ID created in previous steps,
1. Set the user domain to the enterprise domain,
1. Tenant ID should be set to that of the tenant in which the application registration exists,
1. The managed identity should be manually set to the one named `/ccwOpenOnDemandManagedIdentity` **Note**: this value will initially fail to appear due to a UI bug, so this needs to be set again when editing the template.
 
Press `Save` and then `Start Cluster` and wait for the Open OnDemand virtual machine to be ready.

![Screenshot of Open OnDemand cluster configuration](../../images/ccws/ood-advanced-settings.png)

## Resources
* [Add users for Open OnDemand](./ood-add-users.md)