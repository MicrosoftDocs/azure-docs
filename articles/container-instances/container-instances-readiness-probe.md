---
title: Set up readiness probe on container instance
description: Learn how to configure a probe to ensure containers in Azure Container Instances receive requests only when they are ready
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
ms.custom:
services: container-instances
ms.date: 06/17/2022
---

# Configure readiness probes

For containerized applications that serve traffic, you might want to verify that your container is ready to handle incoming requests. Azure Container Instances supports readiness probes to include configurations so that your container can't be accessed under certain conditions. The readiness probe behaves like a [Kubernetes readiness probe](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/). For example, a container application might need to load a large data set during startup, and you don't want it to receive requests during this time.

This article explains how to deploy a container group that includes a readiness probe, so that a container only receives traffic when the probe succeeds.

Azure Container Instances also supports [liveness probes](container-instances-liveness-probe.md), which you can configure to cause an unhealthy container to automatically restart.

## YAML configuration

As an example, create a `readiness-probe.yaml` file with the following snippet that includes a readiness probe. This file defines a container group that consists of a container running a small web app. The app is deployed from the public `mcr.microsoft.com/azuredocs/aci-helloworld` image. This containerized app is also demonstrated in [Deploy a container instance in Azure using the Azure CLI](container-instances-quickstart.md) and other quickstarts.

```yaml
apiVersion: 2019-12-01
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
        - "node /usr/src/app/index.js & (sleep 240; touch /tmp/ready); wait"
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

The deployment includes a `command` property defining a starting command that runs when the container first starts running. This property accepts an array of strings. This command simulates a time when the web app runs but the container isn't ready.

First, it starts a shell session and runs a `node` command to start the web app. It also starts a command to sleep for 240 seconds, after which it creates a file called `ready` within the `/tmp` directory:

```bash
node /usr/src/app/index.js & (sleep 240; touch /tmp/ready); wait
```

### Readiness command

This YAML file defines a `readinessProbe` which supports an `exec` readiness command that acts as the readiness check. This example readiness command tests for the existence of the `ready` file in the `/tmp` directory.

When the `ready` file doesn't exist, the readiness command exits with a non-zero value; the container continues running but can't be accessed. When the command exits successfully with exit code 0, the container is ready to be accessed.

The `periodSeconds` property designates the readiness command should execute every 5 seconds. The readiness probe runs for the lifetime of the container group.

## Example deployment

Run the following command to deploy a container group with the preceding YAML configuration:

```azurecli-interactive
az container create --resource-group myResourceGroup --file readiness-probe.yaml
```

## View readiness checks

In this example, during the first 240 seconds, the readiness command fails when it checks for the `ready` file's existence. The status code returned signals that the container isn't ready.

These events can be viewed from the Azure portal or Azure CLI. For example, the portal shows events of type `Unhealthy` are triggered upon the readiness command failing.

![Portal unhealthy event][portal-unhealthy]

## Verify container readiness

After starting the container, you can verify that it's not accessible initially. After provisioning, get the IP address of the container group:

```azurecli-interactive
az container show --resource-group myResourceGroup --name readinesstest --query "ipAddress.ip" --out tsv
```

Try to access the site while the readiness probe fails:

```bash
wget <ipAddress>
```

Output shows the site isn't accessible initially:
```bash
wget 192.0.2.1
```
```output
--2019-10-15 16:46:02--  http://192.0.2.1/
Connecting to 192.0.2.1... connected.
HTTP request sent, awaiting response...
```

After 240 seconds, the readiness command succeeds, signaling the container is ready. Now, when you run the `wget` command, it succeeds:

```bash
wget 192.0.2.1
```
```output
--2019-10-15 16:46:02--  http://192.0.2.1/
Connecting to 192.0.2.1... connected.
HTTP request sent, awaiting response...200 OK
Length: 1663 (1.6K) [text/html]
Saving to: ‘index.html.1’

index.html.1                       100%[===============================================================>]   1.62K  --.-KB/s    in 0s

2019-10-15 16:49:38 (113 MB/s) - ‘index.html.1’ saved [1663/1663]
```

When the container is ready, you can also access the web app by browsing to the IP address using a web browser.

> [!NOTE]
> The readiness probe continues to run for the lifetime of the container group. If the readiness command fails at a later time, the container again becomes inaccessible.
>

## Next steps

A readiness probe could be useful in scenarios involving multi-container groups that consist of dependent containers. For more information about multi-container scenarios, see [Container groups in Azure Container Instances](container-instances-container-groups.md).

<!-- IMAGES -->
[portal-unhealthy]: ./media/container-instances-readiness-probe/readiness-probe-failed.png
