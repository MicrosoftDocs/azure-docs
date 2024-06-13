---
author: grrlgeek
ms.service: azure-arc
ms.topic: include
ms.date: 10/22/2022
ms.author: jeschult
---

## Troubleshooting

When the desired version is set to a specific version, the bootstrapper job will attempt to upgrade to that version until it succeeds. If the upgrade is successful, the `RunningVersion` property of the spec is updated to the new version. Upgrades could fail for scenarios such as an incorrect image tag, unable to connect to registry or repository, insufficient CPU or memory allocated to the containers,  or insufficient storage.

1. Run the below command to see if any of the pods show an `Error` status or have high number of restarts:

   ```console
   kubectl get pods --namespace <namespace>
   ```
1. To look at Events to see if there is an error, run 

   ```console
   kubectl describe pod <pod name> --namespace <namespace>
   ```
1. To get a list of the containers in the pods, run 

   ```console
   kubectl get pods <pod name> --namespace <namespace> -o jsonpath='{.spec.containers[*].name}*'
   ```
1. To get the logs for a container, run  

   ```console
   kubectl logs <pod name> <container name> --namespace <namespace>
   ```

To view common errors and how to troubleshoot them go to [Troubleshooting resources](..\troubleshoot-guide.md). 