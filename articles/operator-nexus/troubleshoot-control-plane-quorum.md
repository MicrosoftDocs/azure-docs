---
title: Troubleshoot control plane quorum loss
description: Document how to restore control plane quorum loss
ms.topic: article
ms.date: 01/18/2024
author: matthewernst
ms.author: matthewernst
ms.service: azure-operator-nexus
---

# Troubleshoot control plane quorum loss

Follow this troubleshooting guide when multiple control plane nodes are offline or unavailable:

## Prerequisites

- Install the latest version of the
  [appropriate Azure CLI extensions](./howto-install-cli-extensions.md).
- Gather the following information:
  - Subscription ID
  - Cluster name and resource group
  - Bare metal machine name
- Ensure you're logged using `az login`


## Symptoms

- Kubernetes API isn't available
- Multiple control plane nodes are offline or unavailable

## Procedure

1. Identify the Nexus Management Node
- To identify the management nodes, run `az networkcloud baremetalmachine list -g <ResourceGroup_Name>`
- Log in to the identified server
- Ensure the ironic-conductor service is present on this node using `crictl ps -a |grep -i ironic-conductor`
  Example output:

~~~
testuser@<servername> [ ~ ]$ sudo crictl ps -a |grep -i ironic-conductor
<id>       <id>       6 hours ago       Running       ironic-conductor       0       <id>
~~~

2. Determine the iDRAC IP of the server
- Run the command `az networkcloud cluster list -g <RG_Name>`
- The output of the command is a JSON with the iDRAC IP

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

3. Access the iDRAC GUI using the IP in your browser to shut down impacted management servers

   :::image type="content" source="media\troubleshoot-control-plane-quorum\graceful-shutdown.png" alt-text="Screenshot of an iDRAC GUI and the button to perform a graceful shutdown." lightbox="media\troubleshoot-control-plane-quorum\graceful-shutdown.png":::

4. When all impacted management servers are down, turn on the servers using the iDRAC GUI

   :::image type="content" source="media\troubleshoot-control-plane-quorum\graceful-power-on.png" alt-text="Screenshot of an iDRAC GUI and the button to perform power on command." lightbox="media\troubleshoot-control-plane-quorum\graceful-power-on.png":::

5. The servers should now be restored. If not, engage Microsoft support.
