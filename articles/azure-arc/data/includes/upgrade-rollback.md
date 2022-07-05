---
author: grrlgeek
ms.service: azure-arc
ms.topic: include
ms.date: 07/05/2022
ms.author: jeschult
---

## Rollback

When you set the desired version, which can be done through Kubernetes, CLI, the portal, or Azure Data Studio, the bootstrap job will attempt to upgrade to that version until it succeeds. If the upgrade is successful, the `RunningVersion` property of the spec is updated to the new version. If the upgrade has a failure, there are several steps to troubleshoot. Common problems are an incorrect image tag, being unable to connect to the registry or repository, not enough CPU or memory in the containers, and not enough available storage.

1. To see which pod has an error or recent retarts, run 
```kubectl
kubectl get pods -n <namespace>
```
1. To look at Events to see if there is an error, run 
```kubectl
kubectl describe pod <pod name> -n <namespace>
```
1. To get a list of the containers in the pods, run 
```kubectl 
kubectl get pods <pod name> -n <namespace> -o jsonpath='{.spec.containers[*].name}*'
```
1. To get the logs for a container, run  
```kubectl
kubectl logs <pod name> <container name> -n <namespace>
```

### Common errors 

#### Incorrect image tag 

If you are using `az` CLI to upgrade and you pass in an incorrect image tag you will see an error within two minutes.

```output
Job Still Active : Failed to await bootstrap job complete after retrying for 2 minute(s).
Failed to await bootstrap job complete after retrying for 2 minute(s).
```

When you view the pods you will see the bootstrap job produce an error.

```output
STATUS
ErrImagePull
```

When you describe the pod you will see 

```output
Failed to pull image "arcdata.azurecr.io/arcdata-p-daily/arc-bootstrapper:<incorrect image tag>": [rpc error: code = NotFound desc = failed to pull and unpack image 
```

To resolve, reference the [Version log](data\version-log.md) for the correct image tag. Re-run the upgrade command with the correct image tag.

### Unable to connect to registry or repository 

If you are trying to upgrade and the upgrade job has not produced an error but runs for longer than fifteen minutes, you can view the progress of the upgrade by watching the pods. Run 

```kubectl
kubectl get pods -n <namespace>
```

If you see the bootstrap job produce an error, 

```output
STATUS
ErrImagePull
```

describe the bootstrap job pod to view the Events. 

```kubectl
kubectl describe pod <pod name> -n <namespace>
```

When you describe the pod you will see an error that says

```output
failed to resolve reference "<registry>/<repository>/arc-bootstrapper:<image tag>"
```

This is common if your image was deployed from a private registry, you're using Kubernetes to upgrade via a yaml file, and the yaml file references mcr.microsoft.com instead of the private registry. To resolve, cancel the upgrade job. To find the registry you deployed from, run 

```kubectl
kubectl describe pod <controller in format control-XXXXX> -n <namespace>
```

Look for Containers.controller.Image, where you will see the registry and repository. Capture those values, enter into your yaml file, and re-run the upgrade.

### Not enough resources

If you are trying to upgrade and the upgrade job has not produced an error but runs for longer than fifteen minutes, you can view the progress of the upgrade by watching the pods. Run 

```kubectl
kubectl get pods -n <namespace>
```

Look for a pod that shows some of the containers are ready, but not - for example, this metricsdb-0 pod has only one of two containers: 

```output
NAME                                    READY   STATUS             RESTARTS        AGE
bootstrapper-848f8f44b5-7qxbx           1/1     Running            0               16m
control-7qxw8                           2/2     Running            0               16m
controldb-0                             2/2     Running            0               16m
logsdb-0                                3/3     Running            0               18d
logsui-hvsrm                            3/3     Running            0               18d
metricsdb-0                             1/2     Running            0               18d
```

Describe the pod to see anything in events: 

```kubectl
kubectl describe pod <pod name> -n <namespace>
```

If there are no events, get the container names and view the logs for the containers. 

```kubectl
kubectl logs <pod name> <container name> -n <namespace>
```

If you see a message about insufficient CPU or memory, you should add more nodes to your Kubernetes cluster, or add more resources to your existing nodes.