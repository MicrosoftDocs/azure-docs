---
title: Troubleshoot Azure Arc-enabled data services
description: Introduction to troubleshooting resources
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 07/07/2022
ms.topic: how-to
---

# Troubleshooting resources

This article identifies troubleshooting resources for Azure Arc-enabled data services.

## Uploads 

### Logs Upload related errors

If you deployed Azure Arc data controller in the `direct` connectivity mode using `kubectl`, and have not created a secret for the Log Analytics workspace credentials, you may see the following error messages in the Data Controller CR (Custom Resource):

```
status": {
    "azure": {
        "uploadStatus": {
            "logs": {
                "lastUploadTime": "YYYY-MM-HHTMM:SS:MS.SSSSSSZ",
                    "message": "spec.settings.azure.autoUploadLogs is true, but failed to get log-workspace-secret secret."
                    },

```

To resolve the above error, create a secret with the Log Analytics Workspace credentials containing the `WorkspaceID` and the `SharedAccessKey` as follows:

```
apiVersion: v1
data:
  primaryKey: <base64 encoding of Azure Log Analytics workspace primary key>
  workspaceId: <base64 encoding of Azure Log Analytics workspace Id>
kind: Secret
metadata:
  name: log-workspace-secret
  namespace: <your datacontroller namespace>
type: Opaque

```

### Metrics upload related errors in direct connected mode

If you configured automatic upload of metrics, in the direct connected mode and the permissions needed for the MSI have not been properly granted (as described in [Upload metrics](upload-metrics.md)), you might see an error in your logs as follows:

```output
'Metric upload response: {"error":{"code":"AuthorizationFailed","message":"Check Access Denied Authorization for AD object XXXXXXXXX-XXXX-XXXX-XXXXX-XXXXXXXXXXX over scope /subscriptions/XXXXXXXXX-XXXX-XXXX-XXXXX-XXXXXXXXXXX/resourcegroups/my-resource-group/providers/microsoft.azurearcdata/sqlmanagedinstances/arc-dc, User Tenant Id: XXXXXXXXX-XXXX-XXXX-XXXXX-XXXXXXXXXXX. Microsoft.Insights/Metrics/write was not allowed, Microsoft.Insights/Telemetry/write was notallowed. Warning: Principal will be blocklisted if the service principal is not granted proper access while it hits the GIG endpoint continuously."}}
```

To resolve above error, retrieve the MSI for the Azure Arc data controller extension, and grant the required roles as described in [Upload metrics](upload-metrics.md).

### Usage upload related errors in direct connected mode

If you deployed your Azure Arc data controller in the direct connected mode the permissions needed to upload your usage information are automatically granted for the Azure Arc data controller extension MSI. If the automatic upload process runs into permissions related issues you might see an error in your logs as follows:

```
identified that your data controller stopped uploading usage data to Azure. The error was:

{"lastUploadTime":"2022-05-05T20:10:47.6746860Z","message":"Data controller upload response: {\"error\":{\"code\":\"AuthorizationFailed\",\"message\":\"The client 'XXXXXXXXX-XXXX-XXXX-XXXXX-XXXXXXXXXXX' with object id 'XXXXXXXXX-XXXX-XXXX-XXXXX-XXXXXXXXXXX' does not have authorization to perform action 'microsoft.azurearcdata/datacontrollers/write' over scope '/subscriptions/XXXXXXXXX-XXXX-XXXX-XXXXX-XXXXXXXXXXX/resourcegroups/my-resource-group/providers/microsoft.azurearcdata/datacontrollers/arc-dc' or the scope is invalid. If access was recently granted, please refresh your credentials.\"}}"}
```

To resolve the permissions issue, retrieve the MSI and grant the required roles as described in [Upload metrics](upload-metrics.md)).

## Upgrades

### Incorrect image tag 

If you are using `az` CLI to upgrade and you pass in an incorrect image tag you will see an error within two minutes.

```output
Job Still Active : Failed to await bootstrap job complete after retrying for 2 minute(s).
Failed to await bootstrap job complete after retrying for 2 minute(s).
```

When you view the pods you will see the bootstrap job status as `ErrImagePull`.

```output
STATUS
ErrImagePull
```

When you describe the pod you will see 

```output
Failed to pull image "<registry>/<repository>/arc-bootstrapper:<incorrect image tag>": [rpc error: code = NotFound desc = failed to pull and unpack image 
```

To resolve, reference the [Version log](version-log.md) for the correct image tag. Re-run the upgrade command with the correct image tag.

### Unable to connect to registry or repository

If you are trying to upgrade and the upgrade job has not produced an error but runs for longer than fifteen minutes, you can view the progress of the upgrade by watching the pods. Run 

```console
kubectl get pods -n <namespace>
```

When you view the pods you will see the bootstrap job status as `ErrImagePull`. 

```output
STATUS
ErrImagePull
```

Describe the bootstrap job pod to view the Events. 

```console
kubectl describe pod <pod name> -n <namespace>
```

When you describe the pod you will see an error that says

```output
failed to resolve reference "<registry>/<repository>/arc-bootstrapper:<image tag>"
```

This is common if your image was deployed from a private registry, you're using Kubernetes to upgrade via a yaml file, and the yaml file references mcr.microsoft.com instead of the private registry. To resolve, cancel the upgrade job. To find the registry you deployed from, run 

```console
kubectl describe pod <controller in format control-XXXXX> -n <namespace>
```

Look for Containers.controller.Image, where you will see the registry and repository. Capture those values, enter into your yaml file, and re-run the upgrade.

### Not enough resources

If you are trying to upgrade and the upgrade job has not produced an error but runs for longer than fifteen minutes, you can view the progress of the upgrade by watching the pods. Run 

```console
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

Describe the pod to see Events. 

```console
kubectl describe pod <pod name> -n <namespace>
```

If there are no events, get the container names and view the logs for the containers.

```console
kubectl get pods <pod name> -n <namespace> -o jsonpath='{.spec.containers[*].name}*'

kubectl logs <pod name> <container name> -n <namespace>
```

If you see a message about insufficient CPU or memory, you should add more nodes to your Kubernetes cluster, or add more resources to your existing nodes.

## Resources by type

[Scenario: Troubleshooting PostgreSQL servers](troubleshoot-postgresql-server.md)

[View logs and metrics using Kibana and Grafana](monitor-grafana-kibana.md)

## Related content

[Scenario: View inventory of your instances in the Azure portal](view-arc-data-services-inventory-in-azure-portal.md)
