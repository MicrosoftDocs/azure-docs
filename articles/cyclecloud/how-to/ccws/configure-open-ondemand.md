---
title: Configure Open Demand with CycleCloud
description: How to configure Open OnDemand with CycleCloud
author: xpillons
ms.date: 07/01/2025
ms.author: padmalathas
---

# Configure Open OnDemand with CycleCloud
Open OnDemand is a web-based interface that provides a user-friendly way to interact with the Slurm cluster deployed by Azure CycleCloud. Azure CycleCloud automatically installs and configures Open OnDemand when you deploy Azure CycleCloud Workspace for Slurm, but you need to run a few steps manually.

## Update settings for Microsoft Entra ID authentication
The Open OnDemand front end uses Open ID Connect (OIDC) for authentication. The OIDC provider is a Microsoft Entra ID application that you register specifically for this purpose (see [How to register a Microsoft Entra ID application for Open OnDemand Authentication](./register-entra-id-app.md)). The following steps describe how to update the settings for Microsoft Entra ID authentication.

Browse to the CycleCloud web portal, select the OpenOnDemand cluster, and select **Edit**. This selection opens the cluster template definition. 
1. Select **Advanced settings**,
1. Leave FQDN empty,
1. Set the Client ID to the registered application ID,
1. Set the user domain to the enterprise domain,
1. Set the Tenant ID to the tenant for the application registration,
1. Manually set the managed identity to the one named `/ccwOpenOnDemandManagedIdentity`.
   
   > [!NOTE]
   > This value doesn't appear at first due to a UI bug, so you need to set it again when editing the template.
 
Select `Save`, then `Start Cluster`, and wait for the Open OnDemand virtual machine to be ready.

:::image type="content" source="../../images/ccws/open-ondemand-advanced-settings.png" alt-text="Screenshot of Open OnDemand cluster configuration.":::

## Resources
* [Add users for Open OnDemand](./open-ondemand-add-users.md)