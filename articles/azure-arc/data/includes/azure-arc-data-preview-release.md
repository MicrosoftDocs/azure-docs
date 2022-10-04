---
author: MikeRayMSFT
ms.author: mikeray
ms.service: azure-arc
ms.topic: include
ms.date: 08/02/2022
---

<!--
At this time, a test or preview build is not available for the next release.
-->

The current preview release published on October 4, 2022.

|Component|Value|
|-----------|-----------|
|Container images registry/repository |`mcr.microsoft.com/arcdata/preview`|
|Container images tag |`v1.12.0_2022-10-11`|
|CRD names and version|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`kafkas.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v7<br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2, v1beta3<br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1<br/>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2, v1 through v2<br/>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2, v1<br/>`sqlmanagedinstancereprovisionreplicatask.tasks.sql.arcdata.microsoft.com`: v1beta1<br/>`otelcollectors.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`telemetryrouters.arcdata.microsoft.com`: v1beta1, v1beta2<br/>|
|Azure Resource Manager (ARM) API version|2022-03-01-preview (No change)|
|`arcdata` Azure CLI extension version|1.4.7 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc enabled Kubernetes helm chart extension version|1.12.0|
|Arc Data extension for Azure Data Studio<br/>`arc`<br/>`azcli`|*No Changes*<br/>1.5.4 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.5.4 ([Download](https://aka.ms/ads-azcli-ext))|

New for this release:
- Arc data controller
  - Updates to TelemetryRouter implementation to include inbound and outbound TelemetryCollector layers alongside Kafka as a persistent buffer
  - AD connector will now be upgraded when data controller is upgraded

- Arc-enabled SQL managed instance
  - New reprovision replica task lets you rebuild a broken sql instance replica. For more information, see [Reprovision replica](#reprovision-replica).
  - Edit Active Directory settings from the Azure portal

<!--
- Arc-enabled PostgreSQL server
-->

- `arcdata` Azure CLI extension
  - Columns for release information added to the following commands: `az sql mi-arc list` this makes it easy to see what instance may need to be updated.
  - Alternately you can run `az arcdata dc list-upgrades'
  - New command to list AD Connectors `az arcdata ad-connector list --k8s-namespace <namespace> --use-k8s`
  - Az CLI Polling for AD Connector create/update/delete: This feature changes the default behavior of `az arcdata ad-connector create/update/delete` to hang and wait until the operation finishes. To override this behavior, the user has to use the `--no-wait` flag when invoking the command. 

### Reprovision replica

The reprovision replica task lets you rebuild a broken sql instance replica. It is intended to be used for a replica that is failing to synchronize, perhaps due to corruption of the data on the persistent volumes (PV) for that instance, or due to some recurring SQL issue, for example.

Support for reprovisioning of a replica is provided only via `az` CLI and kube-native. There is no portal support.

#### Prerequisites

Reprovisioning can only be performed on a multi-replica instance.

#### Request a reprovision replica

Request provisioning [via `az` CLI](#via-az-cli) or [via `kubectl`](#via-kubectl).

##### Via `az` CLI

```az
az sql mi-arc reprovision-replica -n <instance_name-replica_number> -k <namespace> --use-k8s
```

For example, for replica 2 of instance mySqlInstance in namespace arc, the command would be:

```az
az sql mi-arc reprovision-replica -n mySqlInstance-2 -k arc --use-k8s
```

This runs until completion at which point the console returns:

```az
sql-reprov-replica-mySqlInstance-2-1664217002.376132 is Ready
```

The name of the thing that is ready, is the kubernetes task. At this point you can either examine the task:

```console
kubectl describe SqlManagedInstanceReprovisionReplicaTask sql-reprov-replica-mySqlInstance-2-1664217002.376132 -n arc
```

Or delete it:

```console
kubectl delete SqlManagedInstanceReprovisionReplicaTask sql-reprov-replica-mySqlInstance-2-1664217002.376132 -n arc
```

There is an optional `--no-wait` parameter for the command. If you send the request with `--no-wait`, the output will include the name of the task to be monitored. For example:

```az
az sql mi-arc reprovision-replica -n mySqlInstance-2 -k arc --use-k8s --no-wait
Reprovisioning replica mySqlInstance-2 in namespace `arc`. Please use
`kubectl get -n arc SqlManagedInstanceReprovisionReplicaTask sql-reprov-replica-mySqlInstance-2-1664217434.531035`
to check its status or
`kubectl get -n arc SqlManagedInstanceReprovisionReplicaTask`
to view all reprovision tasks.
```

#### Via kubectl

The CRD for reprovision replica is fairly simple. You can create a yaml file with this structure:

```yaml
apiVersion: tasks.sql.arcdata.microsoft.com/v1beta1
kind: SqlManagedInstanceReprovisionReplicaTask
metadata:
  name: <task name you make up>
  namespace: <namespace>
spec:
  replicaName: instance_name-replica_number
```

To use the same example as above, mySqlinstance replica 2, the payload would be:

```yaml
apiVersion: tasks.sql.arcdata.microsoft.com/v1beta1
kind: SqlManagedInstanceReprovisionReplicaTask
metadata:
  name: my-reprovision-task-mySqlInstance-2
  namespace: arc
spec:
  replicaName: mySqlInstance-2
```

Once the yaml is applied via kubectl apply, you can monitor or delete the task via kubectl:

```console
kubectl get -n arc SqlManagedInstanceReprovisionReplicaTask my-reprovision-task-mySqlInstance-2
kubectl describe -n arc SqlManagedInstanceReprovisionReplicaTask my-reprovision-task-mySqlInstance-2
kubectl delete -n arc SqlManagedInstanceReprovisionReplicaTask my-reprovision-task-mySqlInstance-2
```

#### Limitations

- The task should reject attempts to reprovision the current primary replica. If the current primary is believed to be corrupted and in need of reprovisioning, the user should fail over to a different primary and then request the reprovisioning.

- Reprovisioning of multiple replicas in the same instance will serialize; the tasks will accumulate and be held in "Creating" state until the currently active task finishes *and is deleted*. There is no auto-cleanup of a completed task, so this serialization will affect the user even if they run the az command synchronously and wait for it to complete before requesting another reprovision. In all cases they will have to remove the task via kubectl before another reprovision on the same instance can run. **There is no warning about this, either in the az cli or in kubectl.**


More about that second limitation: If you have multiple requests to reprovision a replica in one instance, you may see something like this in the output from a `kubectl get SqlManagedInstanceReprovisionReplicaTask`:

```console
kubectl get SqlManagedInstanceReprovisionReplicaTask -n arc
NAME                                                     STATUS      AGE
sql-reprov-replica-c-sql-djlexlmty-1-1664217344.304601   Completed   13m
sql-reprov-replica-c-sql-kkncursza-1-1664217002.376132   Completed   19m
sql-reprov-replica-c-sql-kkncursza-1-1664217434.531035   Creating    12m
```

That last entry for replica c-sql-kkncursza-1, `sql-reprov-replica-c-sql-kkncursza-1-1664217434.531035`, will stay in status `Creating` until the completed one `sql-reprov-replica-c-sql-kkncursza-1-1664217002.376132` is removed.
