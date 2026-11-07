---
title: Deploy an onboarding update to a namespace
titleSuffix: Azure Device Registry
description: Deploy an onboarding update so that devices get a software update when they onboard to an Azure Device Registry namespace, before they start operating. Use the Azure portal or Bicep.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot
ms.topic: how-to
ms.date: 10/05/2026
ai-usage: ai-assisted
#Customer intent: As an IoT solution administrator, I want to deploy an onboarding update to a namespace so that eligible devices receive the update when they onboard, before they become operational.
---

# Deploy an onboarding update to a namespace (preview)

Azure Device Registry uses *jobs* to apply *software updates* to devices. An *onboarding update job* targets a *namespace*: compatible devices check for the update when they onboard to the namespace, before they register and start operating. In contrast, a software update job targets a group of devices that are already in operation. An onboarding update job remains active until you end it. Use an onboarding update to bring devices that ship with older firmware up to date as they come online, so they're current before they start operating.

This article shows you how to use the Azure portal or Bicep to create an onboarding update job, run or schedule it against a namespace, and monitor the results. Use this article after you [import the software update](how-to-import-software-update.md) that you want to apply. To learn how jobs, groups, and software updates work together, see [Software updates concepts (preview)](concept-software-updates.md).

> [!IMPORTANT]
> Azure Device Registry software updates is currently in preview. The current preview is scoped to IoT Hub-connected devices. This preview is provided without a service-level agreement, and the capability and its portal experience might change before it becomes generally available. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

> [!NOTE]
> During the preview, you can use software updates only with IoT hubs that don't have an existing Device Update for IoT Hub instance. To use software updates, link an IoT hub without a Device Update for IoT Hub instance to your namespace, or delete the existing instance before you link the hub. For more information, see [Software updates and Device Update for IoT Hub](concept-software-updates.md#software-updates-and-device-update-for-iot-hub).

## Prerequisites

- An Azure Device Registry namespace that your devices onboard to.
- A software update imported into the namespace. To learn more, see [Import a software update (preview)](how-to-import-software-update.md).
- Devices that use the software updates client in the [unified Azure IoT SDKs (preview)](concept-unified-iot-sdks.md) and check for onboarding updates before they register.
- Software updates enabled on the namespace. To learn more, see [Get started with Azure Device Registry](get-started-azure-device-registry.md).
- Azure Resource Manager control-plane permissions, such as the **Contributor** role, to create, read, update, and delete jobs.
- To run jobs, the namespace's managed identity must have access to the software updates instance that's linked to the namespace. If you enable software updates in the Azure portal, these role assignments are created for you.

## Create an onboarding update job

An onboarding update job targets a namespace and applies an imported software update to compatible devices when they onboard. Use the Azure portal or Bicep to create the job.

# [Azure portal](#tab/portal)

1. In the Azure portal, go to your Azure Device Registry and select the namespace that contains the devices you want to update.

1. In the namespace, select **Jobs**. The Jobs screen lists the defined jobs with their status, job type, and target. From this screen, you can also view the software updates in the namespace.

    :::image type="content" source="media/how-to-deploy-onboarding-update-namespace/jobs-list.png" alt-text="Screenshot of the Jobs page showing an onboarding update job that targets Namespace 1." lightbox="media/how-to-deploy-onboarding-update-namespace/jobs-list.png":::

1. Select **Create** to start a new job.

1. For the job type, select **Onboarding update**.

    In preview, the available job types are **Software update** and **Onboarding update**. A software update job targets a group of devices, and an onboarding update job targets devices that onboard to a namespace. This article covers the onboarding update job.

1. Target the namespace. An onboarding update job always targets the namespace that your devices onboard to.

    :::image type="content" source="media/how-to-deploy-onboarding-update-namespace/onboarding-target.png" alt-text="Screenshot of an onboarding update job definition showing contoso-namespace as the target." lightbox="media/how-to-deploy-onboarding-update-namespace/onboarding-target.png":::

1. Define the action to run by selecting one of the software updates imported into the namespace. Each software update includes a compatibility check that determines whether it applies to a device. The portal runs a compatibility check for the namespace to determine whether the software update is compatible.

    :::image type="content" source="media/how-to-deploy-onboarding-update-namespace/onboarding-review.png" alt-text="Screenshot of an onboarding update job summary showing contoso-namespace as the target." lightbox="media/how-to-deploy-onboarding-update-namespace/onboarding-review.png":::

1. Select **Next** to view a summary of the job. The summary shows that the job targets the namespace and lists the software update that the job applies.

1. Select **Create**. The job status shows **Creating** and then changes to **Ready** after a moment.

# [Bicep](#tab/bicep)

An onboarding update job is a `Microsoft.DeviceRegistry/namespaces/jobs` resource with `properties.jobType` set to `OnboardingUpdate`. Unlike a software update job, an onboarding update job doesn't include a `target` property&mdash;it always targets compatible devices that onboard to the namespace. Compatibility is checked when each device checks for updates. The `definition.update.updateId` property identifies the software update to apply by its provider, name, and version. Currently, `definition.schedulingType` only supports the value `Continuous`.

After you create the job, its properties&mdash;including `definition`&mdash;are immutable. To change the update definition, delete the job and create a new one.

Create a Bicep file with the following content. Replace the placeholder values, such as `<NAMESPACE_NAME>` and the update identifier values, with your own.

```bicep
param namespaceName string = '<NAMESPACE_NAME>'
param jobName string = '<JOB_NAME>'
param updateProvider string = '<UPDATE_PROVIDER>'
param updateName string = '<UPDATE_NAME>'
param updateVersion string = '<UPDATE_VERSION>'

resource namespace 'Microsoft.DeviceRegistry/namespaces@2026-11-02-preview' existing = {
  name: namespaceName
}

resource onboardingUpdateJob 'Microsoft.DeviceRegistry/namespaces/jobs@2026-11-02-preview' = {
  parent: namespace
  name: jobName
  location: namespace.location
  properties: {
    description: 'Onboarding update job'
    jobType: 'OnboardingUpdate'
    definition: {
      schedulingType: 'Continuous'
      update: {
        updateId: {
          provider: updateProvider
          name: updateName
          version: updateVersion
        }
      }
    }
  }
}
```

---

## Run or schedule the job

After a job is ready, you can run it immediately or schedule it to run later.

# [Azure portal](#tab/portal)

1. On the **Jobs** screen, select the job that you want to run.

1. Select one of the following options:

    - **Run now**: The job runs immediately.
    - **Schedule for later**: Pick a later time today. The job runs at the time you select.

After you run or schedule the job, the portal moves to the **Runs** tab.

# [Bicep](#tab/bicep)

Bicep declares resources, so it can't directly trigger an action like running or scheduling a job. Instead, use the job's `schedule` action, which you can call with Azure CLI. To run the job immediately, omit `scheduledTime`. To schedule the job, include a `scheduledTime` value.

```azurecli
az rest --method post \
  --uri "https://management.azure.com/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.DeviceRegistry/namespaces/<NAMESPACE_NAME>/jobs/<JOB_NAME>/schedule?api-version=2026-11-02-preview" \
  --body '{
    "scheduledTime": "2026-11-15T14:30:00Z",
    "timeout": "PT1H"
  }'
```

- `scheduledTime`: The UTC date and time to run the job. Omit this property to run the job immediately.
- `timeout`: An ISO 8601 duration that limits how long the run is allowed to take, for example `PT1H` for one hour. This property is optional.

An onboarding update job remains active until you end it, so eligible devices continue to receive the update as they onboard.

After you run or schedule the job, use the Azure portal, or the job run APIs, to monitor the run.

---

## Monitor the job run

The **Runs** tab shows the jobs, including running, completed, and scheduled runs.

# [Azure portal](#tab/portal)

1. Select the **Runs** tab to view the runs and their status.

1. Select a completed run to view its statistics. The run details show the status of the devices that the job targeted.

1. **Check a specific device.** To confirm whether a specific device was updated, use the search box in the run details to find the device.

# [Bicep](#tab/bicep)

Job runs are read-only resources, so you monitor them by querying the `Microsoft.DeviceRegistry/namespaces/jobs/runs` resource type instead of declaring them in Bicep. Use Azure CLI to list the runs for the job and check their status:

```azurecli
az rest --method get \
  --uri "https://management.azure.com/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.DeviceRegistry/namespaces/<NAMESPACE_NAME>/jobs/<JOB_NAME>/runs?api-version=2026-11-02-preview"
```

Each run includes a `status` value, such as `Scheduled`, `Running`, or `Ended`, and a `results` summary with counts of succeeded, failed, in-progress, pending, and canceled devices.

To check a specific device, get the results for a run and filter by status:

```azurecli
az rest --method post \
  --uri "https://management.azure.com/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.DeviceRegistry/namespaces/<NAMESPACE_NAME>/jobs/<JOB_NAME>/runs/<RUN_NAME>/listResults?api-version=2026-11-02-preview" \
  --body '{
    "filter": "status eq '\''Failed'\''"
  }'
```

Each entry in the results identifies the target device and its per-device status. Omit the `filter` property in the request body to return all device results for the run.

---

## Related content

- [Software updates concepts (preview)](concept-software-updates.md)
- [Jobs concepts (preview)](concept-jobs.md)
- [Unified Azure IoT SDKs (preview)](concept-unified-iot-sdks.md)
