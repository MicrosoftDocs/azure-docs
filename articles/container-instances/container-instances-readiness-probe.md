---
title: Configure readiness probes in Azure Container Instances
description: Learn how to configure readiness probes to ... containers in Azure Container Instances
services: container-instances
author: dlepow
manager: gwallace

ms.service: container-instances
ms.topic: article
ms.date: 10/15/2019
ms.author: danlep
---
# Configure readiness probes

 Azure Container Instances supports readiness probes to include configurations so that your container can't be accessed for a period. The readiness probe behaves similarly to a [Kubernetes readiness probe](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/). For example, a container app might need to load a large data set during startup, and you don't want to send requests to it, or have another container app send requests, during this time.

This article explains how to deploy a container group that includes a readiness probe, demonstrating how to make sure that traffic doesn't reach a container that isn't ready for it.

Azure Container Instances also supports [liveness probes](container-instances-liveness-probes.md), which you can configure to cause an unhealthy container to automatically restart.

## YAML deployment

As an example, create a `readiness-probe.yaml` file with the following snippet. This file defines a container group that consists of a container running a small web app. The app is packaged in the public `mcr.microsoft.com/azuredocs/aci-helloworld` image. This image is also demonstrated in quickstarts such as [Deploy a container instance in Azure using the Azure CLI](container-instances-quickstart.md).

```yaml
apiVersion: 2018-10-01
location: eastus
name: readinesstest
properties:
  containers:
  - name: mycontainer
    properties:
      image: mcr.microsoft.com/azuredocs/aci-helloworld
      command:
        - "/bin/sh"
        - "-c"
        - "node /usr/src/app/index.js; sleep 240; touch /tmp/ready"
      ports:
      - port: 80
      resources:
        requests:
          cpu: 1.0
          memoryInGB: 1.5
      readinessProbe:
        exec:
          command:
          - "cat"
          - "/tmp/ready"
        periodSeconds: 5
  osType: Linux
  restartPolicy: Always
  ipAddress:
    type: Public
    ports:
    - protocol: tcp
      port: '80'
tags: null
type: Microsoft.ContainerInstance/containerGroups
```

### Start command

The deployment defines a starting command to be run when the container first starts running, defined by the `command` property which accepts an array of strings. In this example, to simulate a time when the container isn't ready, it starts a shell session, sleeps for 240 seconds, and creates a file called `ready` within the `/tmp` directory. Then, a `node` command runs to start the web app:

```console
node /usr/src/app/index.js; /bin/sh -c "sleep 240; touch /tmp/ready; "
```

### Readiness command

This deployment defines a `readinessProbe` which supports an `exec` readiness command that acts as the readiness check. If this command exits with a non-zero value, the container is running but can't be accessed. If this command exits successfully with exit code 0, the container is ready to be accessed.

The `periodSeconds` property designates the readiness command should execute every 5 seconds.

## Run readiness example

Run the following command to deploy this container group with the above YAML configuration:

```azurecli-interactive
az container create --resource-group myResourceGroup --file readiness-probe.yaml
```

## Verify readiness output

In this example, within the first 240 seconds, the container is sleeping. When the readiness command checks for the `ready` file's existence, the status code returned is non-zero, signaling failure, so the container isn't ready.

After 240 seconds, the `cat /tmp/ready` succeeds, signaling the container is ready.

These events can be viewed from the Azure portal or Azure CLI.

![Portal unhealthy event][portal-unhealthy]

By viewing the events in the Azure portal, events of type `Unhealthy` are triggered upon the readiness command failing.


## Readiness probes and restart policies

Restart policies supersede the readiness probes. For example, if you set a `restartPolicy = Never` *and* a readiness probe, the container group will not restart in the event of a failed readiness check. The container group will instead adhere to the container group's restart policy of `Never`.

## Next steps

Task-based scenarios may require a liveness probe to enable automatic restarts if a pre-requisite function is not working properly. For more information about running task-based containers, see [Run containerized tasks in Azure Container Instances](container-instances-restart-policy.md).

<!-- IMAGES -->
[portal-unhealthy]: ./media/container-instances-readiness-probe/readiness-probe-failed.png
