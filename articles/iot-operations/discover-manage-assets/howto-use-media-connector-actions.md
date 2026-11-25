---
title: Use media connector mRPC management actions
description: Register and invoke Azure IoT Operations media connector mRPC actions to start and stop tasks, probe endpoints, and query, extract, and copy stored media.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-akri
ms.topic: how-to
ms.date: 10/27/2026
ai-usage: ai-assisted

#CustomerIntent: As an application developer, I want to invoke media connector management actions so that I can control media tasks, diagnose camera connectivity, and retrieve stored recordings.
---

# Use media connector mRPC management actions

The Azure IoT Operations media connector provides the following mRPC management actions:

- **`start`** starts the configured media tasks on an asset.
- **`stop`** stops the configured media tasks on an asset.
- **`probe`** inspects the asset's inbound media endpoint and returns media format and stream information.
- **`ExtractClip`** selects stored clips or snapshots around an event. You can query the selection, combine it into one output, copy the individual sources, or combine and copy them.
- **`Copy`** transfers finished connector-produced files from local shared storage to cloud ingest.

`start`, `stop`, and `probe` control or inspect live media tasks and endpoints. `ExtractClip` and `Copy` operate on stored files, not the live camera stream, and don't require camera connectivity. For all actions, the asset and endpoint must remain enabled and registered, and the connector and MQTT broker must be available.

## Prerequisites

- A media connector version that supports the actions you want to invoke. The registered JSON schemas for your installed connector are authoritative when available. Field names, action names, and enum values are case-sensitive: `start`, `stop`, and `probe` are lowercase; `ExtractClip` and `Copy` use the capitalization shown.
- An enabled asset associated with a media endpoint. For `start` and `stop`, configure the asset's media streams. For `ExtractClip`, configure a `clip-to-fs` or `snapshot-to-fs` stream with finalized recordings. See [Configure the media connector](howto-use-media-connector.md).
- For file operations, available storage roots and filesystem permissions, with retention configured by an IT administrator. `ExtractClip` requires the root for its selected target. `Copy` requires both `localSharedPath` and `cloudIngestPath`. See [Configure storage and retention](howto-configure-media-connector-storage.md).
- An mRPC-capable MQTT client for local invocation, or the [management actions infrastructure](howto-use-management-actions.md#enable-management-actions) and Azure CLI for cloud invocation.

For clip extraction, record sources in MKV or MP4 format. For snapshot extraction, configure a positive `snapshotsPerSecond` on the source stream. Retention must keep the sources long enough for them to finalize and for the application to request them.

## Register the actions on the asset

Add the following management-group configuration to the asset that owns the streams or endpoint you want to manage. Register only the actions you need. This YAML is a fragment of the asset's `spec`, not a complete asset manifest. Merge it with any existing management groups and preserve the asset's other settings.

```yaml
spec:
  managementGroups:
    - name: control
      actions:
        - name: start
          actionType: Call
          targetUri: start
          typeRef: start
          topic: azure-iot-operations/asset-operations/my-asset/control/start
        - name: stop
          actionType: Call
          targetUri: stop
          typeRef: stop
          topic: azure-iot-operations/asset-operations/my-asset/control/stop
        - name: probe
          actionType: Call
          targetUri: probe
          typeRef: probe
          topic: azure-iot-operations/asset-operations/my-asset/control/probe
        - name: ExtractClip
          actionType: Call
          targetUri: ExtractClip
          typeRef: ExtractClip
          topic: azure-iot-operations/asset-operations/my-asset/control/ExtractClip
        - name: Copy
          actionType: Call
          targetUri: Copy
          typeRef: Copy
          topic: azure-iot-operations/asset-operations/my-asset/control/Copy
```

Replace `my-asset` in the topics with your asset name. For each action, keep `name`, `targetUri`, and `typeRef` equal to the action name shown. The management group name, `control`, must match the group used when invoking the action.

`ExtractClip` resolves `StreamConfigurationName` only on the invoking asset; it doesn't provide cross-asset stream access. `Copy` instead operates within the connector-wide local shared root. Its file selectors aren't scoped to the invoking asset's stream directory.

## Invoke an action

The JSON examples in this article are action payloads, not complete MQTT request envelopes. Local callers must use the mRPC request-response protocol rather than publishing only the JSON body as an ordinary MQTT message.

For cloud invocation, first [enable and verify management actions](howto-use-management-actions.md#enable-management-actions). Save the [ExtractClip request](#extractclip-request) in the following section as `extract-clip-request.json`, update its stream name and event time, and run the following command:

```azurecli
az iot ops mgmt-actions execute \
    --instance <instance-name> \
    --resource-group <resource-group> \
    --asset my-asset \
    --group control \
    --action ExtractClip \
    --payload extract-clip-request.json
```

For the `Copy` action, save one of the [Copy requests](#copy-request) as `copy-request.json`, then use `--action Copy --payload copy-request.json` with the same command.

For the `start`, `stop`, or `probe` actions, save an empty JSON object, `{}`, as `empty-request.json`, then use the corresponding lowercase action name. For example:

```azurecli
az iot ops mgmt-actions execute \
    --instance <instance-name> \
    --resource-group <resource-group> \
    --asset my-asset \
    --group control \
    --action start \
    --payload empty-request.json
```

Replace `--action start` with `--action stop` or `--action probe` to invoke the other actions.

The CLI validates requests against the registered request schema when one is available. Use `--show-schema` to inspect the schema reported for an action. For transport setup and invocation details, see [Enable and run management actions](howto-use-management-actions.md).

## Start and stop media tasks

The `start` and `stop` actions don't take request parameters. Use `{}` as the JSON payload. They apply to **all configured media tasks on the invoking asset**, not an individual stream. Don't include `StreamConfigurationName`; that selector belongs to `ExtractClip`.

### Start tasks

Invoke `start` to start the asset's configured tasks, including tasks configured with `autostart: false`. The endpoint must be ready before the connector admits a `start` request.

A successful response payload is:

```json
{
  "startStatus": 0
}
```

If any task fails to start, the payload contains `"startStatus": 1`, and the mRPC response reports the application error code `StartFailed`. Other tasks might have started successfully; the operation isn't transactional.

You can also use `start` to resume tasks stopped by publication-budget or cleanup-tracking exhaustion. Correct the destination, storage, or cleanup problem before invoking it. Because the action applies to the whole asset, it isn't a per-stream recovery command.

### Stop tasks

Invoke `stop` to stop the asset's configured tasks. The connector keeps the task configurations so that a later `start` can start them again. The action doesn't require the camera endpoint to be ready and doesn't change the streams' configured `autostart` values.

A successful response payload is:

```json
{
  "stopStatus": 0
}
```

If any task fails to stop, the payload contains `"stopStatus": 1`, and the mRPC response reports the application error code `StopFailed`. Other tasks might have stopped successfully.

For both actions, status `0` means no task operation reported a failure. It doesn't report the number of tasks affected or verify that media is flowing. An asset with no configured tasks can also return status `0`.

## Probe the media endpoint

The `probe` action doesn't take any request parameters. Use `{}` as the JSON payload. It runs FFprobe against the inbound endpoint associated with the invoking asset, using the endpoint's configured connection and credentials. It doesn't probe stored recordings or take a stream name or URL parameter.

The connector admits `probe` even when the endpoint isn't marked ready, so you can use it to diagnose connectivity or media-source problems. The endpoint must still be reachable and accessible for the probe to succeed. The probe has a 30-second execution timeout.

A successful response includes `probeStatus: 0` and `probeResult`, which normally contains FFprobe's JSON `streams` and `format` information. For example, a response can include:

```json
{
  "probeStatus": 0,
  "probeResult": {
    "streams": [
      {
        "index": 0,
        "codec_name": "h264",
        "codec_type": "video",
        "width": 1920,
        "height": 1080
      }
    ],
    "format": {
      "format_name": "rtsp"
    }
  }
}
```

The following example shows selected FFprobe fields; the actual fields depend on the source. If the probe output isn't valid JSON, `probeResult` contains the output as a string instead.

If probing fails, the payload contains `"probeStatus": 1`, and the mRPC response reports the application error code `ProbeFailed`. Check endpoint connectivity, credentials, certificates, and connector logs.

For `start`, `stop`, and `probe`, inspect both the status payload and mRPC application errors. Their responses don't use the `Result` and `Error` payload structure documented later in this article for stored-media actions. Requests rejected before execution can instead return a runtime error, such as a readiness or concurrency error.

## ExtractClip request

This example queries finalized clips around an event without writing output:

```json
{
  "ExtractClip": {
    "StreamConfigurationName": "lobby-clips",
    "EventTime": "2026-10-09T14:30:00Z",
    "PrePaddingSeconds": 10,
    "PostPaddingSeconds": 20,
    "Target": "local-shared",
    "Mode": "Query",
    "OutputFormat": "mkv",
    "OutputStem": "alarm_42"
  }
}
```

| Field | Required | Default | Meaning |
| --- | --- | --- | --- |
| `StreamConfigurationName` | Yes | None | Name of a `clip-to-fs` or `snapshot-to-fs` stream on the invoking asset |
| `EventTime` | Yes | None | Event instant in ISO 8601 UTC; must precede the time the connector receives the request |
| `PrePaddingSeconds` | No | `10` | Integer seconds before the event, from `0` through `86400` |
| `PostPaddingSeconds` | No | `10` | Integer seconds after the event, from `0` through `86400` |
| `Target` | Yes | None | `local-shared` or `cloud-ingest`; required even for `Query` |
| `Mode` | No | `Combine` | `Query`, `Combine`, `CopySource`, or `CombineAndCopySource` |
| `OutputFormat` | No | `mkv` for clips; `mp4` for snapshots | Combined-output container: `mkv`, `mp4`, or `wav`; ignored by `CopySource` after validation |
| `OutputStem` | No | None | Optional correlation stem of at most 64 characters; ignored by `CopySource` after validation |

The requested interval is:

```text
[EventTime - PrePaddingSeconds, EventTime + PostPaddingSeconds]
```

The individual padding maximums are arithmetic guards, not the permitted extraction duration. Their sum must fit the administrator's source-type duration limit. The default limit is 300 seconds for clips and 99 seconds for snapshots.

Set both padding values to `0` for a point lookup. The connector doesn't wait for an in-progress clip or future snapshots. A request whose end is at or after receipt-time `Now` has partial coverage.

`OutputStem` is a filename component, not a path. Use ASCII letters, digits, `.`, `_`, and `-`, with no leading or trailing underscore. Supply the bare stem without a path separator or output extension. The combined-output filename has this form:

```text
extracted_[{OutputStem}_]{requested-start}_{requested-duration}s.{OutputFormat}
```

The square brackets indicate an optional stem component; they aren't literal filename characters. The filename describes the requested range, not necessarily the output's playback duration.

### Modes and source selection

| Mode | Combined output | Source copies | Use |
| --- | --- | --- | --- |
| `Query` | No | No | Validate the request and inspect selected sources, coverage, and prospective output. |
| `Combine` | Yes | No | Combine whole source clips or encode selected snapshots into one output. |
| `CopySource` | No | Yes | Preserve individual selected sources without combining. |
| `CombineAndCopySource` | Yes | Yes | Produce a combined output and copy the selected sources. |

All modes repeat source discovery and validation. A successful `Query` doesn't reserve sources, capacity, a filename, or permission for a later writing call.

For **clip sources**:

- Selection includes clips that start within the interval and at most the immediate predecessor needed to cover its start.
- Combining uses whole finalized clips without trimming or re-encoding. The output can be longer than the requested interval.
- The connector inspects actual media timing. It rejects ambiguous overlaps or incompatible combinations instead of silently dropping tracks.
- MKV and MP4 output preserve source codecs; selecting a container doesn't transcode H.265 to H.264.
- WAV output deliberately drops video and requires exactly one WAVE-compatible audio track. It isn't supported for snapshot sources.

For **snapshot sources**:

- The capture rate comes from the named stream's `snapshotsPerSecond`, not from the request.
- Query and writing modes use that positive configured rate to calculate the expected source count.
- Combining encodes one video frame per selected image.

### Example: extract a clip containing an event

To retrieve the whole finalized clip containing an event, use zero padding:

```json
{
  "ExtractClip": {
    "StreamConfigurationName": "lobby-clips",
    "EventTime": "2026-10-09T14:30:25Z",
    "PrePaddingSeconds": 0,
    "PostPaddingSeconds": 0,
    "Target": "local-shared",
    "Mode": "Query",
    "OutputStem": "alarm_42"
  }
}
```

Poll with bounded backoff until Query reports `CoverageStatus: "Complete"` and `EventTimeCovered: true`. A no-source error can mean that the containing clip isn't finalized yet. Stop on unrelated errors rather than retrying every failure. When the clip is ready, change `Mode` to `Combine` and invoke `ExtractClip` again.

The writing call must still handle a source disappearing between calls. The output name contains `_0s` because the requested range is a point, not because the output is empty.

## ExtractClip response

A response contains `Result`, `Error`, or both. The following Query response selects two whole clips for the 30-second requested interval:

```json
{
  "Result": {
    "RequestedStartTime": "2026-10-09T14:29:50Z",
    "RequestedEndTime": "2026-10-09T14:30:20Z",
    "StartTime": "2026-10-09T14:29:00Z",
    "EndTime": "2026-10-09T14:31:00Z",
    "FileName": "recordings/device/endpoint/my-asset/lobby-clips/extracted_alarm_42_20261009-142950-000000000Z_30s.mkv",
    "Exists": false,
    "SourceDirectory": "/tmp/local-storage/recordings/device/endpoint/my-asset/lobby-clips",
    "SourceTier": "local-storage",
    "SourceType": "clip-to-fs",
    "SourceFileCount": 2,
    "CoverageStatus": "Complete",
    "EventTimeCovered": true,
    "SourceFiles": [
      {
        "Path": "/tmp/local-storage/recordings/device/endpoint/my-asset/lobby-clips/clip_20261009-142900-000000000Z_60s.mkv",
        "StartTime": "2026-10-09T14:29:00Z",
        "EndTime": "2026-10-09T14:30:00Z",
        "EventTimeCovered": false
      },
      {
        "Path": "/tmp/local-storage/recordings/device/endpoint/my-asset/lobby-clips/clip_20261009-143000-000000000Z_60s.mkv",
        "StartTime": "2026-10-09T14:30:00Z",
        "EndTime": "2026-10-09T14:31:00Z",
        "EventTimeCovered": true
      }
    ]
  }
}
```

### Resolve response paths

Mounted-storage paths in responses are relative to their configured storage root, without a leading slash. Query and writing modes use the same path rules.

| Fields | Root context |
| --- | --- |
| `FileName`, `SourceFiles[].TargetPath`, `Failures[].Target` | The request's `Target`: relative to `localSharedPath` for `local-shared`, or `cloudIngestPath` for `cloud-ingest` |
| `SourceDirectory`, `SourceFiles[].Path`, `SourceImageMetadata.InspectedPath` | The response's `SourceTier`: relative to `localSharedPath` for `local-shared`, or absolute connector-local paths for `local-storage` |

Every `ExtractClip` result includes `SourceTier`, which identifies the source independently of the requested output target. Cloud ingest can't be an extraction source. If `localSharedPath` is exactly `/tmp/local-storage`, the source tier is `local-storage` and source paths remain absolute.

Join a returned relative path to the corresponding root as mounted by your application. For example, if the connector uses `/local-shared` but your application mounts the same root at `/mnt/media`, join the returned `recordings/device/endpoint/my-asset/lobby-clips/...` to `/mnt/media`.

Returned file paths contain the complete root-relative hierarchy, not a path relative to `SourceDirectory`. They contain no `.` or `..` components; a `SourceDirectory` value of `.` denotes the root. A `FileName` returned for `Target: "local-shared"` can be passed directly as an entry in `Copy.Files`.

Cloud target paths retain the cluster and extension identity components but omit the connector's mount and subvolume prefix. For example, with `cloudIngestPath: "/cloud-ingest/media"`, a returned path starts with `cluster/extension/recordings/...`, not `/cloud-ingest/media/`. For the documented ACSA mapping, this relative path is the blob name within the configured container, not a cloud URI or confirmation that upload completed.

### Selection and coverage fields

| Field | Meaning |
| --- | --- |
| `RequestedStartTime`, `RequestedEndTime` | Exact requested bounds, before source alignment |
| `StartTime`, `EndTime` | Outer source-time bounds in approximate UTC; not proof of continuous coverage |
| `SourceDirectory` | The single directory from which sources were selected, interpreted using `SourceTier` |
| `SourceTier` | Source context included in every result: `local-shared` for paths relative to `localSharedPath`, or `local-storage` for absolute connector-local paths |
| `SourceType` | `clip-to-fs` or `snapshot-to-fs` |
| `SourceFileCount` | Number of entries in `SourceFiles`, including failed or skipped source copies |
| `SourceFiles` | Complete ordered selection with source paths interpreted using `SourceTier` and per-source timing |
| `SourceFiles[].Timestamp` | Snapshot sources only; stored snapshot timestamp in ISO 8601 UTC, not a guarantee of exact camera-time accuracy |
| `SourceFiles[].OffsetFromEventTimeMilliseconds` | Snapshot sources only; signed difference `Timestamp - EventTime` in milliseconds, including available fractional precision. Negative means before the event, positive means after it, and zero means the timestamps are equal |
| `CoverageStatus` | `Complete` or `Partial` coverage of this call's source plan |
| `EventTimeCovered` | Clip plans only; whether verified coverage includes the event instant |
| `ExpectedSourceFileCount` | Snapshot plans only; nominal source count required for Complete coverage |
| `FileName` | Prospective or actual combined-output path relative to the requested target root; absent for `CopySource` |
| `Exists` | Query only; whether the prospective combined file existed when checked |

Clip source records contain `Path`, `StartTime`, `EndTime`, and `EventTimeCovered`. Snapshot records instead contain `Path`, `Timestamp`, and `OffsetFromEventTimeMilliseconds`. The offset is signed: negative is before the event and positive is after it. Snapshot timestamps don't certify exact camera-time accuracy.

For clip plans, event membership uses verified half-open coverage intervals: `start <= EventTime` and `end > EventTime`. A pre-only request can have Complete coverage while `EventTimeCovered` is false. Clip `CopySource` can omit aggregate coverage and outer bounds if that aggregate can't be established.

For snapshots, the expected count is:

```text
ExpectedSourceFileCount =
  max(1, ceil(snapshotsPerSecond * (PrePaddingSeconds + PostPaddingSeconds)))
```

A historical snapshot selection is Complete when its count reaches the expected count. This is a quantity check, not a guarantee of continuous or evenly sampled coverage. A requested end at or after receipt-time `Now` remains Partial.

`Exists` concerns only `FileName`, not source-copy targets. It doesn't reserve the file, which retention or cloud ingest can remove after the check. Query doesn't return `Created`, `Replaced`, `ClipMetadata`, source-copy outcomes, or `Failures`.

### Combined-output fields

`Combine` and `CombineAndCopySource` report:

| Field | Meaning |
| --- | --- |
| `Created` | `true` for confirmed combined publication; `false` when an observed existing output was deliberately kept |
| `Replaced` | `true` when an existing output was confirmed overwritten; `false` when an existing output was deliberately kept; omitted when no overwrite was confirmed |
| `ClipMetadata` | Measured properties of the confirmed output or deliberately kept existing output; present exactly when `Created` is present |

An initial creation reports `Created: true` and omits `Replaced`. A confirmed overwrite reports both as `true`.

The connector deliberately keeps an output observed at `FileName`, without replacing it, in either of these cases:

- The current source selection doesn't have complete coverage. Incomplete coverage doesn't authorize replacement of an existing output, although it can be used to create an output if none exists.
- A complete snapshot selection fails the replacement frame-count guard. The number of selected snapshots must be at least the existing output's decoded video-frame count. If the existing output has more frames, or its frame count can't be verified, the connector keeps it and returns a top-level `Error` explaining the refusal.

A deliberate keep reports `Created: false` and `Replaced: false`, with `ClipMetadata` describing the kept output where measurable.

An unconfirmed overwrite means the connector can't establish that an existing output was actually replaced. Observing a file before publication isn't sufficient: for example, retention might remove it before the new output is published. If publication then creates a new file without overwriting one, the response reports `Created: true` and omits `Replaced`. If publication fails or its outcome is unknown, the response omits both fields. Inspect any accompanying `Error` and check the target before retrying an operation with an unknown outcome.

Other failed or unattempted combined publications also omit `Created`. An omitted field doesn't mean `false`: `Created: false` specifically identifies a deliberate keep.

Coverage and source records always describe the current selection, not the provenance of an older output that was kept.

`ClipMetadata` describes the file as stored:

| Property | Meaning |
| --- | --- |
| `Width`, `Height` | Primary-video dimensions in pixels, before display rotation |
| `Fps` | Measured average primary-video frame rate; not a constant-frame-rate guarantee |
| `Codec` | FFmpeg's lowercase codec name, such as `h264` or `hevc`, not the container |
| `RotationDegrees` | Clockwise display rotation: `0`, `90`, `180`, or `270` |
| `SampleAspectRatio` | Pixel aspect ratio as `W:H`; `1:1` means square pixels |
| `DurationMilliseconds` | Measured playback duration, not a source-coverage signal |
| `Error` | Nested nonfatal diagnostic when a property is unavailable and represented as `null` |

Unavailable metadata alone doesn't fail the action or require a top-level `Error`. `ClipMetadata` isn't returned for `Query`, `CopySource`, or an unknown combined-publication outcome.

The following example shows a successful `Combine` response for the same two-clip selection as the earlier Query example. The connector creates a new output, so `Created` is `true` and `Replaced` is absent:

```json
{
  "Result": {
    "RequestedStartTime": "2026-10-09T14:29:50Z",
    "RequestedEndTime": "2026-10-09T14:30:20Z",
    "StartTime": "2026-10-09T14:29:00Z",
    "EndTime": "2026-10-09T14:31:00Z",
    "FileName": "recordings/device/endpoint/my-asset/lobby-clips/extracted_alarm_42_20261009-142950-000000000Z_30s.mkv",
    "Created": true,
    "ClipMetadata": {
      "Width": 1920,
      "Height": 1080,
      "Fps": 30,
      "Codec": "h264",
      "RotationDegrees": 0,
      "SampleAspectRatio": "1:1",
      "DurationMilliseconds": 120000
    },
    "SourceDirectory": "/tmp/local-storage/recordings/device/endpoint/my-asset/lobby-clips",
    "SourceTier": "local-storage",
    "SourceType": "clip-to-fs",
    "SourceFileCount": 2,
    "CoverageStatus": "Complete",
    "EventTimeCovered": true,
    "SourceFiles": [
      {
        "Path": "/tmp/local-storage/recordings/device/endpoint/my-asset/lobby-clips/clip_20261009-142900-000000000Z_60s.mkv",
        "StartTime": "2026-10-09T14:29:00Z",
        "EndTime": "2026-10-09T14:30:00Z",
        "EventTimeCovered": false
      },
      {
        "Path": "/tmp/local-storage/recordings/device/endpoint/my-asset/lobby-clips/clip_20261009-143000-000000000Z_60s.mkv",
        "StartTime": "2026-10-09T14:30:00Z",
        "EndTime": "2026-10-09T14:31:00Z",
        "EventTimeCovered": true
      }
    ]
  }
}
```

In this example, the measured output duration is 120 seconds because combining preserves both whole 60-second source clips. The `_30s` in `FileName` describes the requested interval, not the output's playback duration. Unlike Query, this response doesn't include `Exists`.

### Source-copy outcomes

`CopySource` and `CombineAndCopySource` add `CopyStatus` and the intended `TargetPath`, relative to the requested target root, to every `SourceFiles` entry. They also return `Failures`, including an empty array when no source failed.

| `CopyStatus` | Meaning |
| --- | --- |
| `Copied` | Publication and required retention registration completed, or the target tier legitimately has no retention index. |
| `Skipped` | The target already existed and was left unchanged, or source and target resolved to the same file. |
| `Failed` | The copy failed, wasn't attempted, or has indeterminate completion. |

Each failed source has exactly one `Failures` entry. Its `Target` equals the source record's `TargetPath`. `Message` distinguishes work not attempted, failure before publication, unconfirmed required registration, and unknown publication outcome. Copied and skipped sources have no failure entry.

`CombineAndCopySource` combines the original selected sources, not the successfully copied subset. It can therefore produce combined output even if an individual source copy fails.

For clip `CopySource`, source records can also report `Width`, `Height`, `Fps`, `Codec`, `RotationDegrees`, and `SampleAspectRatio`, with unavailable values represented as `null`.

For snapshot source-copy modes, `SourceImageMetadata` reports `Width`, `Height`, and `Codec` once for the selection. `InspectedPath` names the inspected source using the same `SourceTier` context as `SourceFiles[].Path`, and `Sampled` is true if any selected image went uninspected. A false value certifies that every image's frame geometry was inspected and compared, not that their codecs match. Unavailable properties have a nested nonfatal `Error`.

### Handle result and error together

> [!IMPORTANT]
> A top-level `Error` doesn't prove that no output was written. Always inspect any accompanying `Result` before retrying.

Mixed outcomes include:

- Some source copies succeeded or were skipped while others failed.
- Combined output was published but a source copy failed, or source copies completed while combination failed.
- A Complete snapshot selection couldn't replace an existing output because its frame count couldn't be verified or was greater than the new selection. The response reports `Created: false`, `Replaced: false`, and a top-level error explaining the refusal.
- Combined publication was confirmed, so `Created` is true, but required retention registration subsequently failed.

Inspect `Created`, `Replaced`, every `CopyStatus`, and every failure message. If completion is indeterminate, reconcile the intended destination through its supported storage interface. Blind retries can overwrite completed output or repeat cloud ingestion.

## Copy request

Standalone `Copy` transfers finished connector-produced files from `localSharedPath` to `cloudIngestPath`. Both roots must be configured. Use exactly one of the following selector forms.

### Select explicit files

```json
{
  "Copy": {
    "Files": [
      "recordings/device/endpoint/my-asset/lobby-clips/clip_20261009-143000-000000000Z_60s.mkv",
      "recordings/device/endpoint/my-asset/lobby-clips/extracted_alarm_42_20261009-142950-000000000Z_30s.mkv"
    ]
  }
}
```

`Files` must contain at least one path. Each path is relative to `localSharedPath` and must resolve inside it. The basename must parse as a finished `snapshot_`, `clip_`, or `extracted_` filename. Temporary and unrecognized files are rejected.

### Select an extraction by stem

```json
{
  "Copy": {
    "SourceDirectory": "recordings/device/endpoint/my-asset/lobby-clips",
    "Stem": "alarm_42"
  }
}
```

`SourceDirectory` is relative to `localSharedPath` and searches without recursion. `Stem` follows the same rules as `OutputStem` and matches exactly against the parsed stem of an `extracted_` filename. It isn't a prefix or substring search.

You must provide exactly one match. If several files match, `Error.MatchCount` reports the total count and `Error.Matches` provides a bounded list of matching paths relative to `localSharedPath`. Choose a file and retry with `Files`. The list has no continuation token and isn't paginated.

Don't combine `Files` with `SourceDirectory` or `Stem`. You must supply the directory and stem together.

## Copy response

An all-success response contains only `Result`:

```json
{
  "Result": {
    "CopiedFiles": [
      "cluster/extension/recordings/device/endpoint/my-asset/lobby-clips/clip_20261009-143000-000000000Z_60s.mkv"
    ],
    "SkippedFiles": [],
    "Failures": []
  }
}
```

| Field | Meaning |
| --- | --- |
| `CopiedFiles` | Cloud-ingest target paths of confirmed new publications, relative to `cloudIngestPath` |
| `SkippedFiles` | Target paths that already existed and were left unchanged, relative to `cloudIngestPath` |
| `Failures` | Intended target paths relative to `cloudIngestPath`, and messages for failed, unattempted, or indeterminate copies |

The example assumes `cloudIngestPath: "/cloud-ingest/media"`. Returned paths omit this root and have no leading slash, but retain the cluster and extension identity components described in [Filesystem destination paths](howto-use-media-connector.md#filesystem-destination-paths). Resolve them against your application's corresponding root, as described in [Resolve response paths](#resolve-response-paths).

A nonempty `Failures` array requires a top-level `Error` alongside `Result`:

```json
{
  "Result": {
    "CopiedFiles": [
      "cluster/extension/recordings/device/endpoint/my-asset/lobby-clips/clip_20261009-143000-000000000Z_60s.mkv"
    ],
    "SkippedFiles": [],
    "Failures": [
      {
        "Target": "cluster/extension/recordings/device/endpoint/my-asset/lobby-clips/clip_20261009-143100-000000000Z_60s.mkv",
        "Message": "Failed before publication: temporary write returned EIO."
      }
    ]
  },
  "Error": {
    "Message": "One file failed to copy."
  }
}
```

If request validation, source selection, or destination resolution fails before copying, the response contains `Error` without `Result`. Once copying begins, failures, cancellation, and indeterminate completion preserve confirmed progress in `Result` alongside `Error`.

Failure `Target` and `Message` fields are each bounded to 512 serialized UTF-8 bytes, including quotes and escaping. Overlong targets are rejected before copying, not truncated.

## Concurrency, limits, and readiness

The `start` and `stop` actions share a connector-wide control slot, and the `probe` action has a separate diagnostic slot. One control action and one probe can run alongside a stored-media action. The connector rejects a request that can't acquire its action slot instead of queuing it. The `start` action requires endpoint readiness; the `stop` and `probe` actions don't.

The connector executes one file operation at a time across all assets: one `ExtractClip` in any mode, including Query, or one `Copy`. A new call for a source stream that already has an active file operation isn't queued and returns immediately:

```json
{
  "Error": {
    "Message": "Busy: source stream already has an active file operation"
  }
}
```

No filesystem side effect starts for that rejected call. The `Busy:` prefix in `Error.Message` is the machine-distinguishable condition in the current schema; there's no separate status-code field.

Administrator request and response size limits apply to all actions. The following table also lists the source-count, duration, and execution-time limits for stored-media actions. Defaults are:

| Limit | Default |
| --- | --- |
| Entire encoded request | 65,536 bytes |
| Entire encoded response | 524,288 bytes |
| Selected `ExtractClip` sources | 100 |
| Standalone `Copy` input entries | 100 |
| `ExtractClip` execution timeout | 180 seconds |
| `Copy` execution timeout | 180 seconds |
| Clip-source requested duration | 300 seconds |
| Snapshot-source requested duration | 99 seconds |

See [Limits for stored-media management actions](howto-configure-media-connector-storage.md#limits-for-stored-media-management-actions) for setting names and configuration.

Selections and responses aren't silently truncated or paginated to fit these limits. Reduce the time window or input list when a count, byte, or duration limit is exceeded.

A deadline or caller cancellation stops new work, but issued native or filesystem I/O must settle before the single-operation permit is released. A timed-out call can leave later calls Busy for longer than the configured deadline.

## Retry safely

- Retry `Busy` responses with bounded backoff. The rejected request isn't queued.
- Retry a `Partial` or future-tail `Query` only after more source material could finalize.
- Treat `Query` as advisory. A writing call repeats validation, and retention or cloud ingest can remove files between calls.
- Reconcile mixed `Result` and `Error` responses before retrying. Don't assume an indeterminate target is absent.
- Reuse a deterministic `OutputStem` and requested interval when retrying the same intended operation. This behavior doesn't guarantee exactly-once behavior: existing output can be kept or replaced according to coverage and snapshot frame-count guards.
- Don't retry unchanged parameter, compatibility, count, duration, or response-size errors.

## Related content

- [Configure the media connector](howto-use-media-connector.md)
- [Configure storage and retention for the media connector](howto-configure-media-connector-storage.md)
- [Enable and run management actions](howto-use-management-actions.md)
- [Run inference on camera images captured by the media connector (preview)](../ai/inference-connector/howto-media-connector-inference.md)
