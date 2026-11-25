---
title: Configure storage and retention for the media connector
description: Configure storage roots, persistent volumes, retention policies, and publication limits for the Azure IoT Operations media connector.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-akri
ms.topic: how-to
ms.date: 11/18/2026
ai-usage: ai-assisted

#CustomerIntent: As an IT administrator, I want to configure storage and retention for the media connector so that captured media is available to applications without exhausting edge storage.
---

# Configure storage and retention for the media connector

The Azure IoT Operations media connector can buffer recordings locally, retain media on a shared volume, and hand files to a cloud-ingest provider. As an IT administrator, you configure the storage roots, retention policies, and resource limits in the connector template instance. OT users then select destinations for their recording streams.

This article explains how to configure storage and operate it safely. For camera connectivity and recording tasks, see [Configure the media connector](howto-use-media-connector.md). For the generic procedure to attach a persistent volume claim (PVC), see [Create and manage connector template instances](howto-manage-connector-templates.md#configure-a-persistent-volume-claim-for-the-media-connector).

## Prerequisites

[!INCLUDE [prereq-deployed-instance](../includes/prereq-deployed-instance.md)]

[!INCLUDE [prereq-azure-cli](../includes/prereq-azure-cli.md)]

- A media connector template instance. See [Create a basic connector template instance](howto-manage-connector-templates.md#create-a-basic-connector-template-instance).
- A media connector version that supports the storage and retention settings in this article. Use the configuration schema supplied with your connector version.
- Permission to update the connector template instance through Azure Resource Manager (ARM), and the Bicep template that defines its current configuration. Configuration doesn't require direct access to the Kubernetes cluster. For Bicep setup, see [Install Bicep tools](/azure/azure-resource-manager/bicep/install).
- For persistent or shared storage, bound, writable PVCs in the connector's namespace. Have your cluster administrator provision and verify the PVCs before you configure the connector.
- Optional: Access to the cluster through `kubectl` to inspect PVCs, connector pods, and logs for troubleshooting.
- For cloud ingest, [Azure Container Storage enabled by Azure Arc (ACSA)](/azure/azure-arc/container-storage/overview) and a provisioned [Cloud Ingest Edge Volume subvolume](/azure/azure-arc/container-storage/howto-configure-cloud-ingest-subvolumes). Cloud ingest requires [secure settings](../secure-iot-ops/howto-enable-secure-settings.md#enable-the-cluster-for-secure-settings).
  
  [!INCLUDE [azure-government-acsa-note](../includes/azure-government-container-storage-note.md)]

[!INCLUDE [set-environment-variables](../includes/set-environment-variables.md)]

## Plan the deployment boundary

> [!IMPORTANT]
> Only one active media connector process can write to or clean up a managed storage tree. Set `imageConfigurationSettings.replicas` to `1`, and ensure that other connector templates, namespaces, or installations can't write to the same tree.

The replica count applies to each allocated Connector, not to the whole connector template. With bucketized allocation, Akri can allocate another Connector when a bucket fills. Use `bucketSize: 100`, the largest currently accepted value, to provide allocation headroom, monitor the endpoint count, and don't allow it to exceed 100. This setting reduces the chance of a second Connector; it isn't a singleton guarantee. Don't use `bucketSize: 0` as a singleton setting.

During recovery, a terminating or unreachable process, its FFmpeg children, and outstanding filesystem operations still count as active. Confirm that the previous process has stopped, or revoke its storage access, before allowing a replacement to write.

Mount connector-managed data read-only in ordinary consumer pods. A designated consumer can delete a recognized final-file kind only when connector retention for that kind is disabled and the consumer owns its complete deletion lifecycle. Don't rename, rewrite, or move files in an active connector-managed directory.

## Understand the storage tiers

| Tier | Root | Purpose | Cleanup owner |
| --- | --- | --- | --- |
| Local storage | `/tmp/local-storage` | Short recording buffer; optionally backed by a PVC | Media connector, through `localStore*` settings |
| Local shared | The configured `localSharedPath` | Retained media shared with other workloads, and extraction output | Media connector, through `localShared*` settings |
| Cloud ingest | The configured `cloudIngestPath` | Files handed to the cloud-ingest provider | Storage provider after publication |

Setting `localSharedPath` or `cloudIngestPath` enables the corresponding tier. Mounting a PVC without setting the matching root doesn't enable that tier. Each configured root must exist and be writable when the connector starts; a missing or unwritable root prevents startup. Don't place nested mounts below a publication root. Configure each distinct storage backing as its own root.

The private staging directory, `/tmp/media-connector`, isn't a publication root. Keep it private to the connector container. Don't mount a PVC or `hostPath` shared with another workload at that directory or an ancestor such as `/tmp`. The current connector-template surface doesn't expose `emptyDir` configuration; without another supported private backing, staging uses the container writable layer.

For ACSA, set `cloudIngestPath` to the writable ingest subvolume directory, not just the PVC mount path or the subvolume resource name. For example, if the PVC is mounted at `/data` and the subvolume's `spec.path` is `ingestSubDir`, use `/data/ingestSubDir`.

## Configure storage roots and retention

Use ARM to update the existing connector template instance before creating recording streams. The following procedure uses Bicep and Azure CLI, which you can run from [Azure Cloud Shell](/azure/cloud-shell/overview) or a machine with access to Azure. Don't edit the Kubernetes `ConnectorTemplate` resource directly.

1. Review the current connector template configuration. Replace `my-media-template` with the name of your template.

   ```azurecli
   az iot ops connector template show \
       --name my-media-template \
       --resource-group $RESOURCE_GROUP \
       --instance $AIO_INSTANCE_NAME
   ```

1. Open the Bicep template that defines your existing `Microsoft.IoTOperations/instances/akriConnectorTemplates` resource. Use API version `2026-07-01`, consistent with the other configuration examples in this docset. For the resource schema, see [Connector template Bicep reference](/azure/templates/microsoft.iotoperations/2026-07-01/instances/akriconnectortemplates).

   Merge the following `runtimeConfiguration` fragment into the resource's `properties` object, updating the storage and retention settings under `managedConfigurationSettings`. This Bicep fragment isn't a complete deployment template. Preserve the resource's existing name, parent instance, extended location, image configuration, MQTT connection, diagnostics, secrets, trust settings, and any other required configuration. Merge the nested objects rather than replacing them, and retain any existing PVCs and additional settings that you still need. Replace the PVC names and paths with your own values.

   ```bicep
   runtimeConfiguration: {
     runtimeConfigurationType: 'ManagedConfiguration'
     managedConfigurationSettings: {
       managedConfigurationType: 'ImageConfiguration'
       imageConfigurationSettings: {
         replicas: 1
       }
       allocation: {
         policy: 'Bucketized'
         bucketSize: 100
       }
       persistentVolumeClaims: [
         {
           claimName: 'local-shared-pvc'
           mountPath: '/local-shared'
         }
         {
           claimName: 'media-pvc'
           mountPath: '/data'
         }
       ]
       additionalConfiguration: {
         localSharedPath: '/local-shared'
         cloudIngestPath: '/data/ingestSubDir'
         localStoreSnapshotRetentionMinutes: '10'
         localStoreClipRetentionMinutes: '10'
         localStoreExtractedClipRetentionMinutes: '1440'
         localStoreAbandonedRetentionIntervalMinutes: '5'
         localSharedSnapshotRetentionMinutes: '43200'
         localSharedClipRetentionMinutes: '43200'
         localSharedExtractedClipRetentionMinutes: '43200'
         localSharedTempRetentionMinutes: '1440'
         localSharedRetentionIntervalMinutes: '1440'
         localSharedOthersRetentionMinutes: '43200'
         maxPendingPublicationsPerStream: '20'
         maxPendingPublicationBytesPerStream: '64Mi'
         maxTrackedCleanupRecords: '10000'
       }
     }
   }
   ```

   Omit the PVC and root setting for any mounted tier you don't need. Omit settings whose defaults are suitable.

   All `additionalConfiguration` values must be strings, including numbers and byte quantities. Names are case-sensitive. Unknown names, duplicate keys, invalid values, and non-string values prevent connector initialization. Byte suffixes are also case-sensitive: use `Ki`, `Mi`, or `Gi`.

1. Save the complete Bicep template as `media-connector.bicep` and deploy it to the resource group that contains your Azure IoT Operations instance. Supply any parameters required by your existing template.

   ```azurecli
   az deployment group create \
       --subscription $SUBSCRIPTION_ID \
       --resource-group $RESOURCE_GROUP \
       --template-file media-connector.bicep
   ```

1. Verify the connector as described in [Verify storage and troubleshoot](#verify-storage-and-troubleshoot). Ensure that any replacement process has exclusive access to the storage tree.

### Select stream destinations

OT users select a destination through the asset stream's Storage destination `path`. The path must be nonempty, either explicitly on the stream or inherited from the asset's `defaultStreamsDestinations`. A nonempty stream destination list overrides the asset defaults.

| Destination path | Storage tier |
| --- | --- |
| A relative path, such as `recordings` | Local storage, under `/tmp/local-storage/recordings` |
| An absolute path under `/tmp/local-storage` | Local storage |
| An absolute path under `localSharedPath`, such as `/local-shared/archive` | Local shared |
| An absolute path under `cloudIngestPath`, such as `/data/ingestSubDir/clips` | Cloud ingest |

Other absolute paths are configuration errors. Don't use `..` to escape a root or use the private staging directory as a destination. The connector appends identity components to the destination prefix; see [Filesystem destination paths](howto-use-media-connector.md#filesystem-destination-paths).

## Configure retention and cleanup

Retention applies globally by storage tier and file kind, not per stream. A value of `0` disables connector deletion for that file kind; it doesn't assign another cleanup owner or impose a capacity limit. For clips on a connector-retained tier, an enabled clip-retention window must be at least as long as the stream's configured clip `duration`.

> [!WARNING]
> Retention can delete existing recognized files as soon as an upgrade enables or shortens a retention window. Review the configured windows before upgrading. Mounting a PVC at `/tmp/local-storage` doesn't change the short default retention for local storage.

Recognized final filenames start with `snapshot_`, `clip_`, or `extracted_`. On local and local shared storage, their age comes from the UTC timestamp in the filename, not the time the file was copied to the volume. Extracted media is already as old as its content start when it's created.

Recognized publication temporaries start with `temp_`. When eligible for cleanup, their age is evaluated from the deadline in the name plus the configured temporary grace period.

Applications that read media files must skip files whose names start with `temp_`, which the media connector uses as temporary working files.

Recognized final files might be deleted by retention cleanup after an application lists the directory but before it opens them. If opening a file returns a file-not-found error, the application must handle that error and continue processing other files.

### Local storage settings

| Setting | Default | Meaning |
| --- | --- | --- |
| `localStoreSnapshotRetentionMinutes` | `10` | Maximum age of snapshot files, in minutes; `0` disables deletion |
| `localStoreClipRetentionMinutes` | `10` | Maximum age of clip files, in minutes; `0` disables deletion |
| `localStoreExtractedClipRetentionMinutes` | `1440` | Maximum age of extracted files, in minutes; `0` disables deletion |
| `localStoreAbandonedRetentionIntervalMinutes` | `5` | Sweep interval, in minutes, for destinations that no configured stream owns; `0` disables this sweeper |

If the abandoned-destination sweeper is enabled, the connector must receive its complete stream configuration within one sweep interval after startup. Until a stream configuration arrives, an existing destination is indistinguishable from an abandoned destination. Set `localStoreAbandonedRetentionIntervalMinutes` to `"0"` if the platform can't meet that startup condition.

### Local shared settings

| Setting | Default | Validation and meaning |
| --- | --- | --- |
| `localSharedSnapshotRetentionMinutes` | `43200` | `0` or at least `60`; maximum age of snapshot files, in minutes |
| `localSharedClipRetentionMinutes` | `43200` | `0` or at least `60`; maximum age of clip files, in minutes |
| `localSharedExtractedClipRetentionMinutes` | `43200` | `0` or at least `60`; maximum age of extracted files, in minutes |
| `localSharedTempRetentionMinutes` | `1440` | `0` or at least `60`; grace period, in minutes, after an inactive temporary file's declared deadline |
| `localSharedRetentionIntervalMinutes` | `1440` | At least `60`; reevaluation and managed-directory scan interval, in minutes |
| `localSharedOthersRetentionMinutes` | `43200` | `0` or at least `60`; maximum age of unrecognized files in managed directories, in minutes |
| `localSharedManagedDirectories` | Empty | Newline-separated paths relative to `localSharedPath` for additional recursive cleanup |

The default retention for local shared snapshots, clips, and extracted media is 30 days. The default reevaluation interval is one day; allow storage headroom for files awaiting cleanup.

The connector always manages its own local shared destinations. `localSharedManagedDirectories` adds directories; it doesn't replace that set. For example, to clean up immutable output handed off by another producer, merge the following setting into the Bicep resource's `additionalConfiguration` object and redeploy the template:

```bicep
additionalConfiguration: {
  localSharedManagedDirectories: 'archive/legacy\nvendor-analytics/output'
}
```

Unrecognized files have no filename timestamp. Cleanup of these files uses guarded filesystem metadata.

> [!WARNING]
> Listing a managed directory grants recursive cleanup authority. Only include directories whose deletion lifecycle belongs entirely to the connector. Another producer must finish files outside the directory, move them into place under unique names, and never update or delete them afterward. Don't include mutable working directories, databases, model caches, scratch files, or checkpoints. A second media connector on the same tree remains unsupported.

If `localSharedPath` is exactly `/tmp/local-storage`, the two tiers collapse to one root governed by `localStore*` settings. This configuration is intended mainly for development and testing, not as the production mechanism for sharing output with another pod. For that scenario, mount a shared volume at `/tmp/local-storage`. A descendant such as `/tmp/local-storage/exports` isn't a valid `localSharedPath`.

In this shared-root configuration, the media connector never deletes unrecognized files.

## Plan capacity and publication limits

Retention is time-based, not a byte quota. The capacity advertised by a PVC isn't necessarily an enforced filesystem limit. Estimate retained storage from measured write rates and retention windows, with headroom for cleanup intervals, temporary files, and provider outages.

The following limits bound pending work, not retained media:

| Setting | Default | Validation and scope |
| --- | --- | --- |
| `maxPendingPublicationsPerStream` | `20` | At least `1`; completed payload count per stream |
| `maxPendingPublicationBytesPerStream` | `64Mi` | At least `1Mi`; completed payload bytes per stream; accepts `Ki`, `Mi`, or `Gi` |
| `maxTrackedCleanupRecords` | `10000` | At least `1`; connector-wide temporary-file and orphan-cleanup bookkeeping |

A pending publication is a completed filesystem payload awaiting publication and registration acknowledgement. For clips, the payload is held in private staging; for snapshots, it's held in memory. It leaves the pending set only after the destination write completes and, on a connector-retained tier, retention registration is confirmed.

Reaching either per-stream limit stops that producer and marks its data operation unavailable. Other streams retain their own publication budgets. The producer doesn't resume automatically. Correct the destination or capacity problem, then restart the task through its management action, reconfigure the stream or settings, or restart the connector.

The cleanup-record limit has a separate purpose. It tracks destination temporaries and orphan cleanup work, including failed removals and startup residue. Before creating a temporary file, the connector reserves a tracking slot within the `maxTrackedCleanupRecords` limit. If no slots are available, it refuses the write so that no temporary file is left untracked. A high count indicates a deletion, permission, or mount problem, not ordinary retained history.

Size private staging for all streams in the pod, including each clip currently being recorded, which is outside the completed-publication budget. A conservative bound is:

```text
streams per pod * (maxPendingPublicationBytesPerStream + largest in-progress clip)
```

Pending snapshots consume memory. If staging uses a memory-backed filesystem, staged clips also count against the pod's memory limit. Choose limits from measured payload sizes, publication rates, tolerated destination outages, and available storage and memory. The current connector-template surface doesn't expose container resource requests and limits, including `ephemeral-storage`; don't assume these publication settings configure pod resource limits.

### Limits for stored-media management actions

If applications use `ExtractClip` or `Copy`, configure these administrator limits in `additionalConfiguration` as needed. These limits don't extend retention or reserve source files. For action registration, request and response payloads, and retry behavior, see [Use media connector mRPC management actions](howto-use-media-connector-actions.md).

| Setting | Default | Scope |
| --- | --- | --- |
| `maxClipExtractionDurationSeconds` | `300` | Maximum requested clip-source window |
| `maxSnapshotExtractionDurationSeconds` | `99` | Maximum requested snapshot-source window |
| `maxManagementRequestBytes` | `65536` | Entire encoded request, before JSON parsing |
| `maxManagementResponseBytes` | `524288` | Entire encoded response |
| `maxFilesPerCopy` | `100` | Input entries for a standalone `Copy` |
| `maxSourceFilesPerExtractClip` | `100` | Selected source files for `ExtractClip` |
| `extractClipTimeoutSeconds` | `180` | One `ExtractClip` invocation |
| `copyTimeoutSeconds` | `180` | One standalone `Copy` invocation |

All values are positive integers; zero doesn't mean unlimited. Byte budgets must fit the verified transport capacity or initialization fails. Configure byte and timeout limits conservatively.

For snapshot extraction, keep duration and source-file limits consistent with the highest configured capture rate:

```text
maxSnapshotExtractionDurationSeconds
  <= floor((maxSourceFilesPerExtractClip - 1) / snapshotsPerSecond)
```

Extraction from snapshots requires a configured `snapshotsPerSecond` greater than `0`. Fractional rates below `1` are supported. A value of `0` uses the source frame rate for capture but isn't supported for extraction. Keep retention long enough for sources to be finalized and for the application to request them.

## Verify storage and troubleshoot

Use the following command to verify the connector template's provisioning state and configured storage and retention settings through ARM:

```azurecli
az iot ops connector template show \
    --name my-media-template \
    --resource-group $RESOURCE_GROUP \
    --instance $AIO_INSTANCE_NAME
```

Successful ARM provisioning doesn't verify PVC health, exclusive storage access, or recording output. Configure a test recording stream and verify its data-operation status and finalized files. For cloud ingest, also verify that ACSA uploads the files to the configured blob container.

### Optional cluster diagnostics

If you or your cluster administrator have direct cluster access, use the following read-only checks. These commands are for diagnostics, not configuration. Replace the namespace and pod name with the values for your deployment.

1. Verify that the PVCs are bound:

   ```bash
   kubectl get pvc --namespace azure-iot-operations
   ```

1. Verify that only one Connector and one pod can write to or clean the managed tree:

   ```bash
   kubectl get connectors --namespace azure-iot-operations
   kubectl get pods --namespace azure-iot-operations
   ```

1. Check the media connector pod's startup logs. Replace `<media-connector-pod>` with the pod name:

   ```bash
   kubectl logs <media-connector-pod> --namespace azure-iot-operations
   ```

1. Configure a recording stream with a nonempty destination path. See [Configure the media connector](howto-use-media-connector.md#filesystem-destination-paths).

1. Check the resolved destination in the task startup logs or data-operation status. Don't rely on opening a shell in the distroless connector image. Verify that finalized files appear at the expected destination. For cloud ingest, also verify that ACSA uploads the files to the configured blob container.

1. Monitor free storage, data-operation health, cleanup warnings, and Connector allocation count. Test retention with disposable recordings before relying on it for production history.

| Symptom | Check |
| --- | --- |
| Connector doesn't initialize | Configuration spelling, string values, supported settings, transport budgets, and existing writable roots |
| Recording task doesn't start | Nonempty destination under a configured root, valid task settings, and a clip-retention window at least as long as the clip duration |
| Expected directory is empty | Resolved destination, including appended identity components |
| Files disappear sooner than expected | Effective tier, filename timestamps, and global retention settings; local defaults still apply to a PVC at `/tmp/local-storage` |
| Storage fills | Capture rate, measured payload size, retention windows, cleanup interval, consumer progress, and cloud-ingest health |
| Stream remains unavailable after storage recovers | Publication limits and explicit restart or reconfiguration after correcting the fault |
| Cleanup records accumulate | Deletion failures, permissions, mount health, and orphaned temporary files |
| Multiple Connectors can access the same tree | Allocation count, bucket capacity, other templates and namespaces, and predecessor shutdown |

## Related content

- [Configure the media connector](howto-use-media-connector.md)
- [Use media connector mRPC management actions](howto-use-media-connector-actions.md)
- [Create and manage connector template instances](howto-manage-connector-templates.md)
- [Enable and run management actions](howto-use-management-actions.md)
- [Capture media from ONVIF cameras and store in Azure Blob Storage](../end-to-end-tutorials/tutorial-onvif-media-blob-storage.md)
