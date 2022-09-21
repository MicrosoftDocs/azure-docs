---
author: grrlgeek
ms.service: azure-arc
ms.topic: include
ms.date: 07/07/2022
ms.author: jeschult
---

## Rollback 

When you set the desired version, which can be done through Kubernetes, CLI, the portal, or Azure Data Studio, the bootstrap job will attempt to upgrade to that version until it succeeds. If the upgrade is successful, the `RunningVersion` property of the spec is updated to the new version. If the upgrade has a failure, there are several steps to troubleshoot. Common problems are an incorrect image tag, being unable to connect to the registry or repository, not enough CPU or memory in the containers, and not enough available storage.

1. To see which pod has an error or recent retarts, run 

   ```console
   kubectl get pods -n <namespace>
   ```
1. To look at Events to see if there is an error, run 

   ```console
   kubectl describe pod <pod name> -n <namespace>
   ```
1. To get a list of the containers in the pods, run 

   ```console 
   kubectl get pods <pod name> -n <namespace> -o jsonpath='{.spec.containers[*].name}*'
   ```
1. To get the logs for a container, run  

   ```console
   kubectl logs <pod name> <container name> -n <namespace>
   ```

## Troubleshooting

To view common errors and how to troubleshoot them go to [Troubleshooting resources](..\troubleshoot-guide.md). 