---
title: Define, run, and monitor jobs
titleSuffix: Azure Device Registry
description: Learn how to define, run, and monitor Azure Device Registry jobs against groups of IoT Hub-connected devices by using the Azure portal or Azure CLI.
author: meenag16
ms.author: mgudapati
ms.service: azure-iot
ms.topic: how-to
ms.date: 11/10/2026
ai-usage: ai-assisted
#Customer intent: As an IoT solution administrator, I want to understand the steps to define, run, and monitor a job so that I can operate on my devices at scale.
---

# Define, run, and monitor jobs (preview)

Running a job in Azure Device Registry generally involves a few steps: getting set up, defining the job, running it, and checking on the results. This article gives a high-level overview of each step by using the Azure portal or Azure CLI.

For more information about jobs, job types, and states, see [Jobs concepts (preview)](concept-jobs.md). For steps specific to software updates, see [Deploy a software update to a group (preview)](how-to-deploy-software-update-group.md).

> [!IMPORTANT]
> Azure Device Registry jobs are currently in preview. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Job lifecycle

:::image type="content" source="media/how-to-define-run-monitor-jobs/job-lifecycle.svg" alt-text="Diagram showing the four stages of a job: prepare, define, run, and monitor. An arrow from monitor back to run indicates retrying failed devices." lightbox="media/how-to-define-run-monitor-jobs/job-lifecycle.svg":::

1. **Prepare**: Ensure the devices you want to target, such as a group, are set up.
1. **Define**: Create the job definition by choosing the job type, selecting the target, and defining the action for that job type.
1. **Run**: Start the job immediately or schedule it. End the run if needed.
1. **Monitor**: Track job run status and per-device results. If devices fail, you can [retry them](#retry-failed-devices).

## Prerequisites

- An Azure Device Registry namespace with registered IoT Hub-connected devices. To learn more, see [Get started with Azure Device Registry](get-started-azure-device-registry.md).
- Azure Resource Manager control-plane permissions, such as the **Contributor** role, to create, read, update, and delete jobs.
- A target for the job. For group-targeted jobs, a [group](concept-groups.md) that contains the devices you want to update. Namespace-targeted jobs don't need a group.
- Anything the job's action needs. For example, a software update job needs an imported [software update](how-to-import-software-update.md).
- To use Azure CLI, the [Azure CLI](/cli/azure/install-azure-cli) with the `azure-iot` extension installed.

## Define a job

A job definition describes what the job does and which devices it applies to. When you define a job, provide:

| Property | Description |
| --- | --- |
| Name | A unique name for the job in the namespace. |
| Job type | The kind of job to run, such as a software update. |
| Target | The group or namespace the job applies to. |
| Action | What the job does, which depends on the job type. For example, the software update to apply. |

# [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to your Azure Device Registry namespace.

1. Select **Operations** > **Jobs**, and then select **Create**.

1. On the **Basics** page, enter a **Name** and optional **Description**, and then select the job **Type**.

    :::image type="content" source="media/how-to-define-run-monitor-jobs/job-define.png" alt-text="Screenshot of the Create job Basics page showing the name, description, and job type fields." lightbox="media/how-to-define-run-monitor-jobs/job-define.png":::

1. On the **Define action** page, select the target and define the action for the job type.

1. On the **Review + create** page, review the job, and then select **Create**.

The job's provisioning state is **Accepted** right after you create it, and then changes to **Succeeded**.

# [Azure CLI (Bash)](#tab/azure-cli)

Set the values that the commands reuse. Replace the angle-bracketed placeholders with your own values:

```azurecli
RG="<resource-group>"
LOCATION="<region>"
NS="<namespace-name>"
JOB="<job-name>"
GROUP="<group-name>"
UPDATE_PROVIDER="<update-provider>"
UPDATE_NAME="<update-name>"
UPDATE_VERSION="<update-version>"
```

Create the job. The target and action parameters depend on the job type. This example creates a software update job that targets a group:

```azurecli
az iot adr ns job create --name $JOB --ns $NS --resource-group $RG \
  --location $LOCATION --type SoftwareUpdate --target-group-name $GROUP \
  --update-id-provider $UPDATE_PROVIDER --update-id-name $UPDATE_NAME \
  --update-id-version $UPDATE_VERSION
```

Wait for the job to be created, and then check its state:

```azurecli
az iot adr ns job wait --name $JOB --ns $NS --resource-group $RG --created
az iot adr ns job show --name $JOB --ns $NS --resource-group $RG
```

# [Azure CLI (PowerShell)](#tab/azure-cli-powershell)

Set the values that the commands reuse. Replace the angle-bracketed placeholders with your own values:

```powershell
$RG = "<resource-group>"
$LOCATION = "<region>"
$NS = "<namespace-name>"
$JOB = "<job-name>"
$GROUP = "<group-name>"
$UPDATE_PROVIDER = "<update-provider>"
$UPDATE_NAME = "<update-name>"
$UPDATE_VERSION = "<update-version>"
```

Create the job. The target and action parameters depend on the job type. This example creates a software update job that targets a group:

```powershell
az iot adr ns job create --name $JOB --ns $NS --resource-group $RG `
  --location $LOCATION --type SoftwareUpdate --target-group-name $GROUP `
  --update-id-provider $UPDATE_PROVIDER --update-id-name $UPDATE_NAME `
  --update-id-version $UPDATE_VERSION
```

Wait for the job to be created, and then check its state:

```powershell
az iot adr ns job wait --name $JOB --ns $NS --resource-group $RG --created
az iot adr ns job show --name $JOB --ns $NS --resource-group $RG
```

---

After you create the job, its provisioning state is `Accepted`, `Succeeded`, `Failed`, or `Deleting`. You can run a job only when its provisioning state is `Succeeded`. For the full list of states, see [Jobs concepts (preview)](concept-jobs.md#execution-model).

## Run a job

You can run a job immediately or schedule it to run later. Running a job creates a *job run*.

# [Azure portal](#tab/azure-portal)

1. On the **Jobs** tab, select the job that you want to run.

1. Select **Run job**, and then select one of the following options:

    - **Now**: The job runs immediately.
    - **Schedule for later**: Pick the time that the job runs, up to seven days from now.

    :::image type="content" source="media/how-to-define-run-monitor-jobs/job-run-options.png" alt-text="Screenshot of the Run job menu showing the Now and Schedule for later options." lightbox="media/how-to-define-run-monitor-jobs/job-run-options.png":::

After you run or schedule the job, the portal moves to the **Runs** tab.

# [Azure CLI (Bash)](#tab/azure-cli)

Run the job immediately by creating a run without a scheduled time:

```azurecli
RUN="<run-name>"

az iot adr ns job schedule --name $JOB --ns $NS --resource-group $RG --run-name $RUN
```

To schedule the job for later, add a UTC scheduled time up to seven days from now:

```azurecli
az iot adr ns job schedule --name $JOB --ns $NS --resource-group $RG \
  --run-name $RUN --scheduled-time "<yyyy-mm-ddThh:mm:ssZ>"
```

# [Azure CLI (PowerShell)](#tab/azure-cli-powershell)

Run the job immediately by creating a run without a scheduled time:

```powershell
$RUN = "<run-name>"

az iot adr ns job schedule --name $JOB --ns $NS --resource-group $RG --run-name $RUN
```

To schedule the job for later, add a UTC scheduled time up to seven days from now:

```powershell
az iot adr ns job schedule --name $JOB --ns $NS --resource-group $RG `
  --run-name $RUN --scheduled-time "<yyyy-mm-ddThh:mm:ssZ>"
```

---

> [!NOTE]
> You can have up to 50 concurrent `Scheduled` and `Active` job runs. For more information, see [Limits](concept-jobs.md#limits).

### End a job run

You can end a job run that's in progress. After the run ends, the job doesn't apply to more devices.

# [Azure portal](#tab/azure-portal)

1. On the **Runs** tab, select the run that you want to end.

1. Select **Cancel run**.

# [Azure CLI (Bash)](#tab/azure-cli)

```azurecli
az iot adr ns job run cancel --name $RUN --job-name $JOB --ns $NS --resource-group $RG --yes
```

# [Azure CLI (PowerShell)](#tab/azure-cli-powershell)

```powershell
az iot adr ns job run cancel --name $RUN --job-name $JOB --ns $NS --resource-group $RG --yes
```

---

## Monitor a job

You can monitor a job at the job run level and at the device level. For the definitions of job run and device states, see [Jobs concepts (preview)](concept-jobs.md#execution-model).

# [Azure portal](#tab/azure-portal)

1. Select the **Runs** tab to view the job runs and their status.

    :::image type="content" source="media/how-to-define-run-monitor-jobs/job-runs.png" alt-text="Screenshot of the Runs tab showing job runs with their status, success rate, and progress." lightbox="media/how-to-define-run-monitor-jobs/job-runs.png":::

1. Select a run to view its details. The run details show the number of devices that succeeded, failed, are in progress, or were canceled, and the status of each device.

    :::image type="content" source="media/how-to-define-run-monitor-jobs/job-run-summary.png" alt-text="Screenshot of a job run's details showing the target analysis, job progress, and per-device status." lightbox="media/how-to-define-run-monitor-jobs/job-run-summary.png":::

# [Azure CLI (Bash)](#tab/azure-cli)

List the runs for a job and show the status of a run:

```azurecli
az iot adr ns job run list --job-name $JOB --ns $NS --resource-group $RG
az iot adr ns job run show --name $RUN --job-name $JOB --ns $NS --resource-group $RG
```

Get a summary of the run and the device-level results. To see only the failed devices, filter the results by status:

```azurecli
az iot adr ns job run summary --name $RUN --job-name $JOB --ns $NS --resource-group $RG
az iot adr ns job run results --name $RUN --job-name $JOB --ns $NS --resource-group $RG \
  --filter "status eq 'Failed'"
```

# [Azure CLI (PowerShell)](#tab/azure-cli-powershell)

List the runs for a job and show the status of a run:

```powershell
az iot adr ns job run list --job-name $JOB --ns $NS --resource-group $RG
az iot adr ns job run show --name $RUN --job-name $JOB --ns $NS --resource-group $RG
```

Get a summary of the run and the device-level results. To see only the failed devices, filter the results by status:

```powershell
az iot adr ns job run summary --name $RUN --job-name $JOB --ns $NS --resource-group $RG
az iot adr ns job run results --name $RUN --job-name $JOB --ns $NS --resource-group $RG `
  --filter "status eq 'Failed'"
```

---

## Retry failed devices

To retry the job on devices that failed:

1. [End the job run](#end-a-job-run).
1. [Run the job definition again](#run-a-job).

## Related content

- [Jobs concepts (preview)](concept-jobs.md)
- [Software updates concepts (preview)](concept-software-updates.md)
- [Import a software update (preview)](how-to-import-software-update.md)
- [Deploy a software update to a group (preview)](how-to-deploy-software-update-group.md)
- [Deploy an onboarding update to a namespace (preview)](how-to-deploy-onboarding-update-namespace.md)