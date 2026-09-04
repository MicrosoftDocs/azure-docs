---
title: Configure Open OnDemand with CycleCloud
description: Learn how to configure Open OnDemand with Azure CycleCloud to give users a web-based interface for your Slurm cluster.
ai-usage: ai-assisted
author: abatallas
ms.date: 08/24/2026
ms.topic: how-to
ms.author: padmalathas
---

# Configure Open OnDemand with CycleCloud
Open OnDemand is a web-based interface that provides a user-friendly way to interact with the Slurm cluster deployed by Azure CycleCloud. Azure CycleCloud automatically installs and configures Open OnDemand when you deploy Azure CycleCloud Workspace for Slurm, but you need to run a few steps manually.

## Understand the user experience

Open OnDemand can provide browser-based access to cluster files, shells, jobs, and interactive applications. The exact capabilities depend on the applications and configuration included in your CycleCloud Workspace for Slurm release. Verify the deployed applications before you publish user instructions.

Users authenticate to the Open OnDemand front end through Microsoft Entra ID. Their access to Slurm and shared storage also depends on the Linux identity, group membership, and file permissions configured for the workspace.

## Use interactive applications

Open OnDemand can provide browser-based entry points for interactive applications that run through the Slurm scheduler. Interactive sessions use cluster resources and can access the same shared storage as batch jobs. Before you enable an application, validate its scheduler integration, identity and file permissions, network path, resource cleanup, and user experience with a representative workload.

The [CycleCloud Workspace for Slurm 2026.03.10 release notes](../../release-notes/ccws/2026-03-10.md) identify ThinLinc integration with Open OnDemand. Verify the available applications and configuration in the specific workspace release that you deploy. For architecture and deployment-model guidance, see [Remote visualization for high-performance computing on Azure](/azure/high-performance-computing/remote-visualization-overview) and [Choose a remote visualization deployment model for Azure HPC](/azure/high-performance-computing/remote-visualization-choose-deployment-model).

## Customize Open OnDemand

Treat Open OnDemand applications and configuration as release-specific workspace customizations. Don't make ad hoc changes to a running VM and assume that they persist when CycleCloud replaces or rebuilds the node.

Use a CycleCloud cluster-init specification to reproduce required packages, application definitions, and configuration on managed nodes. Keep the specification in source control, test it against the workspace release that you deploy, and include application ownership and rollback instructions. For more information, see [CycleCloud projects](/azure/cyclecloud/how-to/projects).

Open OnDemand applications can have their own scheduler templates, resource controls, and software dependencies. Validate each application with its intended Slurm partition, VM size, GPU driver, storage mounts, and cleanup behavior. Don't assume that a desktop or Visual Studio Code application is enabled by default in every workspace release.

## Configure certificates and network access

Use a certificate trusted by your users' browsers for the Open OnDemand fully qualified domain name (FQDN). Certificate files, deployment automation, and service restart steps can differ by workspace release, so follow the certificate mechanism supported by the release that you deploy instead of editing an undocumented path on the VM.

Keep the Open OnDemand VM and Slurm resources on private networks for production. Provide an approved private access path and allow only the ports required by the portal. Azure Bastion provides SSH or RDP access for VM administration, but it doesn't act as a tunnel for Open OnDemand web and interactive-application traffic.

## Update settings for Microsoft Entra ID authentication
The Open OnDemand front end uses Open ID Connect (OIDC) for authentication. The OIDC provider is a Microsoft Entra ID application that you register for this specific purpose (see [these instructions](../create-app-registration.md) on how to register such an application). The following steps describe how to update the Open OnDemand cluster settings for Microsoft Entra ID authentication in the Azure CycleCloud interface.

Browse to the CycleCloud web portal, select the OpenOnDemand cluster, and select **Edit**. This selection opens the cluster template definition. 
1. Select **Advanced settings**.
1. Leave FQDN empty.
1. Set the Client ID to the registered application ID.
1. Set the user's domain to match the enterprise domain exactly, preserving the original casing (example, 'Contoso.com').
1. Set the Tenant ID to the tenant for the application registration.
1. Manually set the managed identity to the one named `/ccwOpenOnDemandManagedIdentity`.
   
   > [!NOTE]
   > This value doesn't appear at first due to a UI bug, so you need to set it again when editing the template.
 
1. Select `Save`, then `Start Cluster`, and wait for the Open OnDemand virtual machine to be ready.

:::image type="content" source="../../images/ccws/open-ondemand-advanced-settings.png" alt-text="Screenshot of Open OnDemand cluster configuration.":::

## Resources
* [Add users to your registered Microsoft Entra ID application](../create-app-registration.md#permissioning-users-for-cyclecloud)
* [Open OnDemand documentation](https://osc.github.io/ood-documentation/latest/)
