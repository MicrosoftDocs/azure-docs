---
title: Configure ThinLinc with Open OnDemand in CycleCloud Workspace for Slurm
description: Learn how to deploy and validate the Cendio ThinLinc integration with Open OnDemand in CycleCloud Workspace for Slurm.
ai-usage: ai-assisted
author: abatallas
ms.date: 08/24/2026
ms.topic: how-to
ms.author: padmalathas
---

# Configure ThinLinc with Open OnDemand in CycleCloud Workspace for Slurm

Azure CycleCloud Workspace for Slurm includes an Open OnDemand application that integrates with Cendio ThinLinc. The integration gives users a browser-based entry point for Linux virtual desktop sessions that run as jobs on the Slurm cluster. ThinLinc is one of multiple applications that customers can use with Open OnDemand.

Microsoft provides limited support for the integration between CycleCloud Workspace for Slurm, Open OnDemand, and ThinLinc. Cendio, a Microsoft partner, supports the ThinLinc product itself.

This article describes how to deploy the integration, open a session, and validate the deployment. It doesn't describe a standalone ThinLinc deployment. For that scenario, see [Deploy Linux virtual desktops with ThinLinc on Azure](/azure/virtual-machines/linux/thinlinc-linux-vdi).

## Prerequisites

Before you begin, ensure that you have:

- CycleCloud Workspace for Slurm version 2026.03.10 or later. This version introduced the ThinLinc integration with Open OnDemand. For more information, see the [2026.03.10 release notes](../../release-notes/ccws/2026-03-10.md).
- A Microsoft Entra application registration and user-assigned managed identity configured for CycleCloud and Open OnDemand. For more information, see [Create an application registration for CycleCloud](../create-app-registration.md).
- Private network access to the Open OnDemand virtual machine. Azure Bastion doesn't proxy Open OnDemand or interactive application traffic. For supported network options, see [Plan your CycleCloud Workspace for Slurm deployment](./plan-your-deployment.md#open-ondemand).
- At least one Slurm authentication node. Open OnDemand uses an authentication node as a proxy between the Open OnDemand server and the Slurm cluster.
- Shared storage for `/shared` and `/home` that's mounted on the Open OnDemand, authentication, scheduler, and compute nodes. Use Azure NetApp Files for the primary file system.
- Microsoft Entra users who are assigned the required CycleCloud application role and have corresponding Linux identities, group membership, and file permissions in the workspace.

Review and accept Cendio's license terms before you deploy ThinLinc. ThinLinc image and licensing charges aren't included with CycleCloud Workspace for Slurm. Azure doesn't provide or manage ThinLinc licenses.

## Deploy Open OnDemand with ThinLinc

The Open OnDemand project includes the ThinLinc integration and ships with supported CycleCloud Workspace for Slurm releases. You don't need to install a separate CycleCloud project or select a separate ThinLinc option.

To deploy the integration from Azure Marketplace:

1. Start a CycleCloud Workspace for Slurm deployment as described in [Deploy Azure CycleCloud Workspace for Slurm](../../qs-deploy-ccws.md).
1. On the **Basics** tab, select **Enable Microsoft Entra ID SSO**, and provide the application registration and managed identity information.
1. On the **File-system** tab, configure the primary file system for `/shared` and `/home`. Use storage that's accessible from all nodes that participate in interactive sessions.
1. On the **Slurm Settings** tab, configure at least one initial authentication node and one maximum authentication node.
1. On the **Open OnDemand** tab, select **Deploy Open OnDemand**.
1. Select the Open OnDemand virtual machine size and image.
1. If the deployment form displays **User domain**, enter the domain for your users' email addresses. The field isn't present in every supported release.
1. Enter the Open OnDemand fully qualified domain name (FQDN) or IP address, or leave the field blank to use the private IP address assigned during deployment.
1. Select **Start Open OnDemand** if you want the Open OnDemand cluster to start when the deployment finishes.
1. Complete the remaining workspace settings, review the deployment, and select **Create**.

The deployment creates the Slurm and Open OnDemand clusters in CycleCloud and installs the release-specific interactive application definitions, including the ThinLinc integration.

## Complete Open OnDemand configuration

After the Azure deployment finishes, complete the Microsoft Entra ID settings and start the Open OnDemand cluster. For the current post-deployment steps, see [Configure Open OnDemand with CycleCloud](./configure-open-ondemand.md#update-settings-for-microsoft-entra-id-authentication).

Wait until the Slurm cluster has a running authentication node and the Open OnDemand virtual machine is ready before you test the integration.

## Start a ThinLinc session

1. Sign in to CycleCloud with Microsoft Entra ID before you open Open OnDemand.
1. In a browser that has private network access to the workspace, go to the Open OnDemand FQDN or private IP address.
1. Sign in with the same Microsoft Entra identity.
1. In Open OnDemand, open **Interactive Apps**, and select the available ThinLinc application. The application name can differ between workspace releases.
1. Complete the displayed Slurm resource form for the desktop session, and submit the request.
1. Wait for Slurm to allocate the requested resources and for the session to enter the running state.
1. Use the session controls displayed by Open OnDemand to open the Linux desktop.

Interactive sessions consume Slurm resources and remain subject to the cluster's partitions, quotas, and scheduling policies.

## Validate the integration

Before you publish the workflow to users, validate it with a representative user and workload:

1. Confirm that the user can authenticate to both CycleCloud and Open OnDemand.
1. Confirm that the ThinLinc application appears under **Interactive Apps**.
1. Submit a desktop session and confirm that Open OnDemand creates a Slurm job in the expected partition.
1. Open the desktop and verify that the user's home directory and required workload storage are available.
1. Start a representative graphical workload and verify display responsiveness and access to required licenses or services.
1. End the desktop session and confirm that the Slurm job and allocated compute resources are released.

If the application isn't listed, confirm that you deployed CycleCloud Workspace for Slurm version 2026.03.10 or later and that the Open OnDemand cluster uses the project version included with that workspace release. Don't add an unrelated third-party CycleCloud project to the managed Open OnDemand cluster.

For problems with the CycleCloud Workspace for Slurm deployment or the packaged Open OnDemand integration, contact Azure support. For ThinLinc licensing, charges, and product-specific support, use the support channel provided by Cendio.

## Related content

- [Configure Open OnDemand with CycleCloud](./configure-open-ondemand.md)
- [Remote visualization for high-performance computing on Azure](/azure/high-performance-computing/remote-visualization-overview)
- [Choose a remote visualization deployment model for Azure HPC](/azure/high-performance-computing/remote-visualization-choose-deployment-model)