---
title: Troubleshoot control plane quorum loss
description: Learn how to restore control plane quorum loss.
ms.topic: article
ms.date: 01/18/2024
author: matthewernst
ms.author: matthewernst
ms.service: azure-operator-nexus
---

# Troubleshoot control plane quorum loss

Follow the steps in this troubleshooting article when multiple control plane nodes are offline or unavailable.

## Prerequisites

- Install the latest version of the
  [appropriate Azure CLI extensions](./howto-install-cli-extensions.md).
- Gather the following information:
  - Subscription ID
  - Cluster name and resource group
  - Bare-metal machine name
- Ensure that you're signed in by using `az login`.

## Symptoms

- The Kubernetes API isn't available.
- Multiple control plane nodes are offline or unavailable.

## Procedure

1. Identify the Azure Operator Nexus management nodes:
   - To identify the management nodes, run `az networkcloud baremetalmachine list -g <ResourceGroup_Name>`.
   - Sign in to the identified server.
   - Ensure that the ironic-conductor service is present on this node by using `crictl ps -a |grep -i ironic-conductor`. Here's example output:

        ~~~
        testuser@<servername> [ ~ ]$ sudo crictl ps -a |grep -i ironic-conductor
        <id>       <id>       6 hours ago       Running       ironic-conductor       0       <id>
        ~~~

1. Determine the integrated Dell remote access controller (iDRAC) IP of the server:
   - Run the command `az networkcloud cluster list -g <RG_Name>`.
   - The output of the command is JSON with the iDRAC IP.

        ~~~
        {
                "bmcConnectionString": "redfish+https://xx.xx.xx.xx/redfish/v1/Systems/System.Embedded.1",
                "bmcCredentials": {
                  "username": "<username>"
                },
                "bmcMacAddress": "<bmcMacAddress>",
                "bootMacAddress": "<bootMacAddress",
                "machineDetails": "extraDetails",
                "machineName": "<machineName>",
                "rackSlot": <rackSlot>,
                "serialNumber": "<serialNumber>"
        },
        ~~~

1. Access the integrated iDRAC graphical user interface (GUI) by using the IP in your browser to shut down affected management servers.

   :::image type="content" source="media\troubleshoot-control-plane-quorum\graceful-shutdown.png" alt-text="Screenshot that shows an iDRAC GUI and the button to perform a graceful shutdown." lightbox="media\troubleshoot-control-plane-quorum\graceful-shutdown.png":::

1. When all affected management servers are down, turn on the servers by using the iDRAC GUI.

   :::image type="content" source="media\troubleshoot-control-plane-quorum\graceful-power-on.png" alt-text="Screenshot that shows an iDRAC GUI and the button to perform the power command." lightbox="media\troubleshoot-control-plane-quorum\graceful-power-on.png":::

The servers should now be restored.

## Related content

- If you still have questions, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- For more information about support plans, see [Azure support plans](https://azure.microsoft.com/support/plans/response/).
