---
ms.service: azure-arc
ms.topic: include
ms.date: 08/16/2024
author: sethmanheim
ms.author: sethm
---

## Prepare Linux with Ubuntu

This section describes how to prepare Linux with Ubuntu if you run a single-node or two-node cluster.

1. Install Open Service Mesh (OSM) using the following command:

   ```bash
   az k8s-extension create --resource-group "YOUR_RESOURCE_GROUP_NAME" --cluster-name "YOUR_CLUSTER_NAME" --cluster-type connectedClusters --extension-type Microsoft.openservicemesh --scope cluster --name osm
   ```

1. Run the following command to determine if you set `fs.inotify.max_user_instances` to 1024:

   ```bash
   sysctl fs.inotify.max_user_instances
   ```

   After you run this command, if it outputs less than 1024, run the following command to increase the maximum number of files and reload the **sysctl** settings:

   ```bash
   echo 'fs.inotify.max_user_instances = 1024' | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```
