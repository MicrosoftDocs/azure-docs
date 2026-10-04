---
title: Migrate a Slurm cluster to a newer template
description: Migrate an Azure CycleCloud Slurm cluster to a newer project and template by using a side-by-side deployment and validation process.
author: padmalathas
ms.author: padmalathas
ms.date: 08/27/2026
ms.topic: how-to
ms.service: azure-cyclecloud
ai-usage: ai-assisted
---

# Migrate a Slurm cluster to a newer template

Azure CycleCloud application upgrades and Slurm cluster upgrades are separate operations. Upgrading the CycleCloud application doesn't replace the Slurm project, template, or software on cluster nodes. To adopt a newer Slurm project or template, create a replacement cluster, validate it, and then move workloads from the original cluster.

> [!IMPORTANT]
> CycleCloud doesn't provide an in-place Slurm template upgrade or template rollback operation. Keep the original cluster stopped or otherwise available until you validate the replacement cluster and complete the cutover.

## Check version compatibility

Check the release notes for each component before you migrate. Their version numbers aren't interchangeable.

| Component | Current release | What to verify |
| --- | --- | --- |
| Azure CycleCloud | [8.9.2](../release-notes/8-9-2.md) | Review resolved issues and test the CycleCloud application upgrade in a nonproduction environment. |
| CycleCloud Workspace for Slurm | [2026.08.07](../release-notes/ccws/2026-08-07.md) | This Workspace release supports CycleCloud 8.9.2. Use Workspace release notes only for Workspace deployments. |
| CycleCloud Slurm project and template | [Azure/cyclecloud-slurm releases](https://github.com/Azure/cyclecloud-slurm/releases) | Select a Slurm project release that supports your CycleCloud version, operating system, and required Slurm features. |

For a standalone CycleCloud deployment, the Workspace version doesn't determine the Slurm project version. For a Workspace deployment, use a Workspace release that explicitly supports your CycleCloud version.

## Prerequisites

Before you start:

- [Upgrade CycleCloud](upgrade-and-migrate.md) to the version required by the target Slurm project. Complete the application backup and staging validation described in that article.
- Install and [initialize the CycleCloud CLI](../cli.md#cyclecloud-initialize).
- Record integrations that aren't stored in cluster parameters, such as DNS aliases, monitoring, identity assignments, and external storage configuration.
- Put custom templates, projects, cluster-init scripts, and configuration files in source control.
- Plan a maintenance window to drain jobs and redirect submissions.
- Confirm regional and VM-family quota for the replacement cluster. Quota doesn't reserve capacity.

## Export the existing cluster parameters

Export the parameters that CycleCloud used to create the original cluster:

```azurecli
cyclecloud export_parameters <existing-cluster-name> -o existing-cluster-parameters.json
```

Store the exported file securely. It can contain environment-specific identifiers and settings. Review the file before you reuse it because the target template might add, remove, or rename parameters.

## Choose a migration path

Use the stock-template path if the cluster uses a built-in Slurm template without template or project changes. Use the custom-template path if you changed the template, cluster-init project, scripts, or software configuration.

### Migrate a stock Slurm template

1. Download the target Slurm project release from the [CycleCloud Slurm repository](https://github.com/Azure/cyclecloud-slurm/releases). Review its release notes and template parameters.
1. From the downloaded project directory, upload the target project version to the configured locker:

   ```azurecli
   cyclecloud project upload <locker-name>
   ```

1. Import the target template under a new name. Don't overwrite the template that the original cluster uses.

   ```azurecli
   cyclecloud import_template <new-template-name> -f templates/slurm.txt
   ```

1. Compare `existing-cluster-parameters.json` with the target template parameters. Add required values and remove parameters that the target template doesn't support.
1. Create a replacement cluster with a new cluster name:

   ```azurecli
   cyclecloud import_cluster <new-cluster-name> -c <template-name-in-file> -f templates/slurm.txt -p existing-cluster-parameters.json
   ```

1. Start and validate the replacement cluster before you change production job submission.

### Migrate a customized Slurm template

Don't apply an old custom template directly over a newer stock template. Instead, rebase your customizations deliberately:

1. In source control, compare your current custom template and project with the stock files for both the current and target releases.
1. Copy the target stock template and project to a new branch or directory.
1. Reapply each required customization. Pay particular attention to:
   - Template parameters, node arrays, VM images, and storage mounts.
   - `[[[cluster-init]]]` references and their project, spec, and version values.
   - Custom cluster-init scripts, Slurm configuration, and health checks.
   - Managed identities, networking, monitoring, and scheduler integrations.
1. Set a new `version=x.y.z` value in the project's `project.ini` file. [Project versions](projects.md#versioning) let the original and migrated cluster reference different project content.
1. Upload the new project version to the target locker.

   ```azurecli
   cyclecloud project upload <locker-name>
   ```

1. Import the customized target template under a new name.

   ```azurecli
   cyclecloud import_template <new-template-name> -f templates/<custom-template-file>
   ```

1. Review the exported parameters against the customized target template, and then create a replacement cluster with a new name.

   ```azurecli
   cyclecloud import_cluster <new-cluster-name> -c <template-name-in-file> -f templates/<custom-template-file> -p existing-cluster-parameters.json
   ```

For more information about project lockers and versioned cluster-init references, see [CycleCloud projects](projects.md). For template syntax and parameter files, see [Cluster templates](cluster-templates.md).

## Validate the replacement cluster

Validate the replacement cluster in a nonproduction environment before cutover:

1. Start the scheduler and a small execute node array.
1. Verify that scheduler, sign-in, and execute nodes complete cluster-init without errors.
1. Run `sinfo` and `scontrol show nodes` on the scheduler to confirm partitions, node states, features, and resources.
1. Submit representative serial and multi-node jobs. Confirm job output, shared storage access, and accounting behavior.
1. Scale each node array from zero and back to zero. Confirm that autoscaling, node health checks, and termination work as expected.
1. Verify monitoring, DNS, identity, proxy, and external service integrations.
1. Compare performance and application results with the original cluster.

If you use current H-series VMs for tightly coupled workloads, you can validate with [`Standard_HB368rs_v5`](/azure/virtual-machines/sizes/high-performance-compute/hbv5-series) where it's available. This size has 368 vCPUs. Confirm image support, regional quota, VM-family quota, and capacity before you use the size for production.

## Cut over and roll back

To cut over:

1. Stop new job submissions to the original cluster.
1. Drain running jobs and confirm that the queue is empty.
1. Synchronize any application data or configuration that changed during validation.
1. Redirect users, automation, and DNS aliases to the replacement cluster.
1. Monitor representative production jobs before you remove the original cluster.

To roll back before you delete the original cluster, stop submissions to the replacement cluster and redirect them to the original cluster. A CycleCloud server [backup and restore](backup-and-restore.md) protects the CycleCloud application and database, but it isn't a rollback mechanism for an individual cluster template or its nodes.

After the rollback window expires, terminate and delete the original cluster according to your organization's retention policy.

## Troubleshoot migration issues

- If the target template rejects the parameter file, compare its parameter names and types with the exported file. Don't use `--force` to replace the original cluster.
- If `cluster-init` fails, confirm that each referenced project, spec, and version exists in the configured locker.
- If execute nodes don't join Slurm, review the scheduler and node logs, and confirm that DNS, ports, and shared storage work from the replacement network.
- If a current Slurm release changes configuration behavior, review the [CycleCloud Slurm release notes](https://github.com/Azure/cyclecloud-slurm/releases) and test the affected customization separately.

## Related content

- [Upgrade or migrate CycleCloud](upgrade-and-migrate.md)
- [CycleCloud Slurm 3.0](../slurm-3.md)
- [CycleCloud CLI reference](../cli.md)
