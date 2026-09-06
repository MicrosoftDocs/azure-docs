---
title: Use the New-AVSStoragePolicy Run Command in Azure VMware Solution
description: Learn how to use the New-AVSStoragePolicy run command in Azure VMware Solution.
ms.topic: how-to
ms.service: azure-vmware
ms.custom: engagement-fy26
ms.date: 8/17/2026
# Customer intent: As a cloud administrator, I want to execute the New-AVSStoragePolicy run command in Azure VMware Solution to create vSphere storage policy or replace an existing policy.
---

# Use the New-AVSStoragePolicy run command

Use the `New-AVSStoragePolicy` run command to create a vSphere storage policy or replace an existing policy. You can combine vSAN rules, virtual machine (VM) encryption, datastore tag placement, and ESA compression settings in one policy definition.

## When to use New-AVSStoragePolicy

- Create a policy that uses vSAN failure tolerance, object-space reservation, disk striping, I/O limits, cache reservation, checksum, or force provisioning rules.
- Configure VM-level encryption with a Pre-IO or Post-IO filter position.
- Place workloads on datastores that have specific tags or exclude datastores with specific tags.
- Configure space efficiency for vSAN Express Storage Architecture (ESA) clusters.
- Replace an existing storage policy with the complete set of settings supplied to the command.

When both ESA and Original Storage Architecture (OSA) clusters are detected, the command creates two policies: one with the `-esa` suffix and one with the `-osa` suffix. When only one architecture is detected, the command creates one policy with the name you supply.

## Prerequisites

- Confirm that the target private cloud and Software-Defined Data Center (SDDC) are accessible.
- Confirm that you can access the Run command pane for the intended private cloud in the Azure portal.
- Confirm that the target vCenter has at least one cluster that the command can inspect for vSAN configuration and architecture.
- If you use `Preferred` or `Secondary` for `vSANSiteDisasterTolerance`, confirm that the target environment contains a stretched cluster.
- If you use `Tags` or `NotTags`, confirm that the intended datastore tags are available in the `AVS` tag category, or allow the command to create that category and the requested tags.
- If you use VM encryption, confirm that the required encryption data service policy can be created or retrieved.

## Parameters

### `-Name`

Specifies the storage policy name. This parameter is required. The command removes wildcard and code-injection characters before it uses the name. The cleaned name must not be empty or consist only of whitespace, and it must not match a protected policy name.

### `-Description`

Specifies the storage policy description. This parameter is optional. If you omit this parameter, the command uses AVS Storage Policy created via PowerCLI as the description. The command removes wildcard and code-injection characters before it uses the description.

### `-vSANSiteDisasterTolerance` values

Specifies the site locality for objects in a stretched cluster. This parameter is optional. The command maps the values as follows:

- `None` does not specify a preferred site.
- `Preferred` places objects on the preferred site.
- `Secondary` places objects on the secondary site.

`Preferred` and `Secondary` are supported only when the command detects a stretched cluster. The command rejects these values for non-stretched clusters.

### `-vSANFailuresToTolerate` values

The command maps the values as follows:

- `None` adds no data redundancy and emits a warning that affected policy objects are not covered by the Microsoft SLA and that data loss or corruption may occur.
- `R1FTT1` uses RAID-1 mirroring and tolerates one failure.
- `R5FTT1` uses RAID-5/6 erasure coding and tolerates one failure.
- `R1FTT2` uses RAID-1 mirroring and tolerates two failures.
- `R6FTT2` uses RAID-5/6 erasure coding and tolerates two failures.
- `R1FTT3` uses RAID-1 mirroring and tolerates three failures.

### `-VMEncryption` values

- `None` does not add a VM encryption capability.
- `PreIO` configures encryption before the VAIO filter and uses the `AVS PRE IO Encryption` data service policy.
- `PostIO` configures encryption after the VAIO filter and uses the `AVS POST IO Encryption` data service policy.

### `-vSANObjectSpaceReservation`

Specifies the percentage of space reserved for each vSAN object. Use an integer from 0 through 100. This parameter is optional.

### `-vSANDiskStripesPerObject`

Specifies the number of disk stripes used by each vSAN object. Use an integer from 1 through 12. This parameter is optional.

### `-vSANIOLimit`

Specifies the maximum number of I/O operations per second for the policy. Use an integer from 0 through 2147483647. This parameter is optional.

### `-vSANCacheReservation`

Specifies the percentage of cache reserved for the policy. Use an integer from 0 through 100. This parameter is optional.

### `-vSANChecksumDisabled` option

Set this option to `$true` to add the vSAN checksum-disabled rule. Disabling checksum can result in data loss or corruption. The function documentation recommends leaving this option disabled, which keeps checksum enabled.

### `-vSANForceProvisioning` option

Set this option to `$true` to add the vSAN force-provisioning rule. Force-provisioned objects are not covered by the Microsoft SLA, and data loss or vSAN instability may occur. The function documentation recommends leaving this option disabled.

### `-Tags`

Use `-Tags` to restrict policy placement to datastores that have the specified tags. Specify one or more comma-separated tag names. Tag names are case-sensitive. The command uses the AVS tag category for these tags. This parameter is optional.

### `-NotTags`

Use `-NotTags` to exclude datastores that have the specified tags from policy placement. Specify one or more comma-separated tag names. Tag names are case-sensitive. The command uses the AVS tag category for these tags. This parameter is optional.

### `-Overwrite` option

Use `-Overwrite` only when you intend to replace the complete existing policy definition. The command removes an existing policy before it creates the replacement. The command doesn't retain settings that you omit as part of the replacement.

### `-NoCompression` option

Use `-NoCompression` when an ESA policy must disable space efficiency. When omitted, the ESA policy receives the `CompressionOnly` setting. This option applies only to ESA policies.

## What this command does

1. Reads the clusters available in the connected vCenter.
2. Reads each cluster's vSAN configuration and determines whether it is ESA or OSA.
3. Tracks whether a stretched cluster is available for site locality validation.
4. Cleans the supplied name and description, then rejects an empty, whitespace-only, or protected name.
5. Checks for existing policy names and, when requested, removes the policies that will be replaced.
6. Builds the requested vSAN, tag, and VM encryption rules.
7. Creates an ESA policy, an OSA policy, or a single policy depending on the detected cluster architectures.
8. Returns the names of the policies created.

If the command can't detect some clusters but detects at least one ESA or OSA cluster, it can still create policies from the successfully detected architectures. It emits a warning that names the clusters it couldn't detect.


## Validation

1. Review the returned policy names.
2. When both architectures are present, confirm that both the `-esa` and `-osa` policies were created.
3. Inspect each created policy and confirm that its name, description, vSAN rules, tag rules, VM encryption capability, and ESA compression setting match the requested configuration.
4. For tag-based placement, confirm that the policy matches datastores with the requested tags and excludes datastores with the `NotTags` values.
5. For VM encryption, confirm that the command used the expected data service policy for the selected `PreIO` or `PostIO` mode.
6. Review command warnings, especially warnings about `None` failure tolerance, disabled checksum, force provisioning, or unreplicated objects on stretched clusters.
7. If the command reports cluster detection failures, confirm whether the resulting policy scope is acceptable before assigning the policy to workloads.

## Troubleshooting

### ESA or OSA cluster type cannot be detected

**Symptom:** The command reports `Failed to detect vSAN cluster types` or `Could not detect ESA or OSA from any cluster. Policy creation stopped.`

**Fix:** Confirm that clusters are available in the connected vCenter and that their vSAN configuration can be read. If no architecture can be detected, capture the command output and escalate.

### The policy name is invalid or protected

**Symptom:** The command rejects the name because it is empty, whitespace-only, or protected. The output may also show a cleaned name that differs from the supplied value.

**Fix:** Supply a non-empty name that is not protected and does not contain wildcard or unsupported characters. Confirm the cleaned name in the command output before continuing.

### The policy already exists

**Symptom:** The command reports `Storage Policy <name> already exists. Set -Overwrite to $true to overwrite existing policy.` When both architectures are detected, the conflicting names can include `<name>-esa` and `<name>-osa`.

**Fix:** Choose a different name if you want to keep the existing policy. Use `-Overwrite` only after confirming that you want to remove the existing policy and replace it with the complete definition supplied to the command.

### A stretched-cluster setting is used on a non-stretched cluster

**Symptom:** The command reports `Stretch site setting is only supported on stretch clusters, not normal clusters.`

**Fix:** Use `None` for `vSANSiteDisasterTolerance` on a non-stretched cluster. Use `Preferred` or `Secondary` only when the command can detect a stretched cluster.

### A vSAN value is rejected or produces a warning

**Symptom:** Parameter validation rejects a numeric value, or the command warns about unprotected objects, data loss or corruption, disabled checksum, force provisioning, or unreplicated objects.

**Fix:** Use the supported numeric ranges and enum values. Review every warning before assigning the policy to workloads. Use a supported failure-tolerance value such as `R1FTT1` when it matches the intended design, keep checksum enabled unless disabling it is explicitly required, and avoid force provisioning unless its impact has been reviewed.

### Tag-based datastore placement fails

**Symptom:** The command cannot resolve tag-based placement, or the resulting policy does not match the intended datastores.

**Fix:** Confirm the exact case of each tag name, confirm that the tags are associated with the `AVS` category, and check the `Tags` and `NotTags` formatting. Test with one tag at a time if necessary.

### VM encryption configuration fails

**Symptom:** The command fails while configuring `PreIO` or `PostIO` VM encryption, or it cannot retrieve the required data service policy.

**Fix:** Use exactly `None`, `PreIO`, or `PostIO`. Confirm that the corresponding encryption data service policy can be created and retrieved, then run the command again. Capture the output if the failure continues.

### One ESA or OSA policy is created but the other fails

**Symptom:** When both architectures are detected, the command reports `Failed to create ESA policy` or `Failed to create OSA policy` after creating or attempting the other policy.

**Fix:** Inspect the policies created before the failure and determine whether they should remain. Check for conflicts with the generated `-esa` or `-osa` names, review architecture-specific rule or capability errors, and correct the configuration before retrying.

### Some clusters fail detection but policy creation succeeds

**Symptom:** The command reports `Cluster type detection failed for: <cluster names>. Policies were created using successfully detected clusters only.`

**Fix:** Confirm that the created policy scope is acceptable. Resolve access or vSAN configuration detection problems for the named clusters and rerun the command if the policy must cover all intended clusters.

When escalating any issue, capture the exact command output, the command parameters with secrets removed, the target vCenter and SDDC identification without credentials, the detected cluster architectures, and the names of any policies created before the failure.

## Related content

- To learn more about run commands, see [Use run commands](using-run-command.md).
