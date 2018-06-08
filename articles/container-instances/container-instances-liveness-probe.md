---
title: Configure liveness probes in Azure Container Instances
description: Learn how to configure liveness probes in the containers you run in Azure Container Instances
services: container-instances
author: jluk
manager: jeconnoc

ms.service: container-instances
ms.topic: article
ms.date: 06/05/2018
ms.author: juluk
---
# Configure liveness probes

Containerized applications may run for extended periods of time resulting in broken states that may need to be repaired by restarting the container. Azure Container Instances supports liveness probes to include restart situations within a container's specification.

## YAML deployment

Create a `liveness-probe.yaml` file with the following snippet. 

```yaml
apiVersion: 2018-06-01
location: westus
name: livenesstest
properties:
  containers:
  - name: mycontainer
    properties:
      image: nginx
      command:
        - "/bin/sh"
        - "-c"
        - "touch /tmp/healthy; sleep 30; rm -rf /tmp/healthy; sleep 600"
      ports: []
      resources:
        requests:
          cpu: 1.0
          memoryInGB: 1.5
      livenessProbe:
        exec:
            command: 
                - "cat"
                - "/tmp/healthy"
        periodSeconds: 5
  osType: Linux
  restartPolicy: Never
tags: null
type: Microsoft.ContainerInstance/containerGroups
```
Run the following command to deploy this container group with the above YAML configuration.

```azurecli-interactive
az container create --resource-group myRG --name livenesstest -f liveness-probe.yaml
```

The periodSeconds property designates the liveness command should execute every 5 seconds. In this example the command `cat /tmp/healthy` acts as the probe, returning 0 if successful. If the command returns a non-zero value, the container will automatically be killed and restarted.

## Verify liveness output

Within the first 30 seconds, the `healthy` file created by the start command still exists. When the liveness command checks for the `healthy` file's existence, the status code returns a zero signaling success so no restarting occurs.

After 30 seconds the command for `cat /tmp/healthy` begin to fail causing unhealthy and killing events to occur.

![Portal unhealthy event][portal-unhealthy]

By viewing the events in the Azure portal, events of type `Unhealthy` will be triggered upon the liveness command failing. The subsequent event will be of type `Killing` signifying a container deletion so a restart can begin.

### Liveness and restart policies

Restart policies supercede the restart behavior triggered by liveness probes. For example, if you set a `restartPolicy = Never` and a liveness probe the container group will not restart in the event of a failed liveness check to adhere to the container group's restart policy.

## Next steps

Task-based scenarios may require a liveness probe to enable automatic restarts if a pre-requisite function is not working properly. For more information about running task-based containers, see [Run containerized tasks in Azure Container Instances](container-instances-restart-policy.md).

<!-- IMAGES -->
[portal-unhealthy]: ./media/container-instances-liveness-probe/unhealthy-killing.png