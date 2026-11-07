---
title: Deploy a software update to a device group
titleSuffix: Azure Device Registry
description: Deploy a software update to a group of IoT Hub-connected devices in Azure Device Registry by creating and running a job in the Azure portal or with Bicep.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot
ms.topic: how-to
ms.date: 10/05/2026
ai-usage: ai-assisted
#Customer intent: As an IoT solution administrator, I want to deploy a software update to a group of IoT Hub-connected devices so that I can update my devices at scale from the Azure portal.
---

# Deploy a software update to a group (preview)

Azure Device Registry uses *jobs* to apply *software updates* to *groups* of IoT Hub-connected devices. A software update job targets a group of devices and applies a software update to the compatible members of that group. In contrast, an onboarding update job targets devices that onboard to a namespace. Deploying a software update as a job lets you roll out the same update to many devices at once, so you can keep your IoT Hub-connected devices current without updating each device individually.

This article shows you how to define or validate a target group, use the Azure portal or Bicep to create a standard software update job, run or schedule the job, and monitor the results. Use this article after you [import the software update](how-to-import-software-update.md) that you want to apply. To learn how jobs, groups, and software updates work together, see [Software updates in Azure Device Registry](concept-software-updates.md).

> [!IMPORTANT]
> Azure Device Registry software updates is currently in preview. The current preview is scoped to IoT Hub-connected devices. This preview is provided without a service-level agreement, and the capability and its portal experience might change before it becomes generally available. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

> [!NOTE]
> During the preview, you can use software updates only with IoT hubs that don't have an existing Device Update for IoT Hub instance. To use software updates, link an IoT hub without a Device Update for IoT Hub instance to your namespace, or delete the existing instance before you link the hub. For more information, see [Software updates and Device Update for IoT Hub](concept-software-updates.md#software-updates-and-device-update-for-iot-hub).

## Prerequisites

- IoT Hub-connected devices whose properties identify the devices that you want to update. Use these properties to define the target group.
- A software update imported into the namespace. To learn more, see [Import a software update (preview)](how-to-import-software-update.md).
- Software updates enabled on the namespace that contains your devices. To learn more, see [Get started with Azure Device Registry](get-started-azure-device-registry.md).
- Azure Resource Manager control-plane permissions, such as the **Contributor** role, to create, read, update, and delete jobs.
- To run jobs, the namespace's managed identity must have access to the software updates instance that's linked to the namespace. If you enable software updates in the Azure portal, these role assignments are created for you.

## Define or validate the target group

A software update job targets a group instead of every device in the namespace. Create a group with a filter that selects only the IoT Hub-connected devices that should receive the update, or reuse an existing group whose membership matches that scope. For example, use device properties such as manufacturer, model, or software revision to target a specific device cohort. Use the Azure portal or Bicep to create the group.

# [Azure portal](#tab/portal)

To create a group in the Azure portal:

1. In the namespace navigation, open **Operations** > **Groups (preview)**, and then start group creation from the command bar.

1. On the **Basics** page, enter a descriptive **Name** and, optionally, a **Description** that identifies the intended device cohort.

1. On the **Definition** page, under **Define filter conditions**, enter a query that selects the IoT Hub-connected devices that you want to update.

    :::image type="content" source="media/how-to-deploy-software-update-group/create-group-definition.png" alt-text="Screenshot of the Definition page with the device query editor." lightbox="media/how-to-deploy-software-update-group/create-group-definition.png":::

    Group filters are immutable after creation. To use different membership criteria, create another group with a different query.

1. On the **Review** page, verify the **Basics**, **Definition**, and **Query filter**, and then select **Create**.

    :::image type="content" source="media/how-to-deploy-software-update-group/create-group-review.png" alt-text="Screenshot of the Review page showing the group name, description, and query filter." lightbox="media/how-to-deploy-software-update-group/create-group-review.png":::

# [Bicep](#tab/bicep)

A group is a `Microsoft.DeviceRegistry/namespaces/groups` resource. The `properties.query` value selects the registered IoT Hub-connected devices that become members of the group, based on device properties such as `manufacturer`, `model`, or `softwareRevision`. After you create the group, you can't change its query. To use different membership criteria, create another group with a different query.

Create a Bicep file with the following content. Replace the placeholder values, such as `<NAMESPACE_NAME>` and `<GROUP_NAME>` with your own.

```bicep
param namespaceName string = '<NAMESPACE_NAME>'
param groupName string = 'contoso-tractors'
param groupDescription string = 'Devices to receive the software update'
param groupQuery string = 'WHERE manufacturer = \'contoso\' AND model = \'tractor\''

resource namespace 'Microsoft.DeviceRegistry/namespaces@2026-11-02-preview' existing = {
  name: namespaceName
}

resource group 'Microsoft.DeviceRegistry/namespaces/groups@2026-11-02-preview' = {
  parent: namespace
  name: groupName
  location: namespace.location
  properties: {
    description: groupDescription
    query: groupQuery
  }
}
```

---

Group membership is calculated and cached when you create or refresh the group. Before you use a group for a software update job:

- Refresh the group's membership if device properties might have changed. In the Azure portal, **Refresh** is available from the group detail command bar.
- Wait until the group status is **Ready**.
- On the group detail view, verify the resolved query filter and the member count. The member list previews up to 10 devices, so treat it as a spot check rather than a complete listing, and confirm that the member count matches the devices that you intend to update.

## Create a software update job

A software update job targets a group of devices and applies an imported software update to the compatible members of that group. Use the Azure portal or Bicep to create the job.

# [Azure portal](#tab/portal)

1. In the Azure portal, go to your Azure Device Registry and select the namespace that contains the devices you want to update.

1. In the namespace, select **Operations** > **Jobs**. The **Jobs** screen lists the defined jobs with their status, job type, and target group. From this screen, you can also view the groups and software updates in the namespace.

    :::image type="content" source="media/how-to-deploy-software-update-group/jobs-list.png" alt-text="Screenshot of the Jobs page showing defined jobs with their type, status, and target group." lightbox="media/how-to-deploy-software-update-group/jobs-list.png":::

1. Select **Create** to create a new job.

1. On the **Basics** page, provide a name and description for the job.

1. For the job type, select **Software update**.

    In preview, the available job types are **Software update** and **Onboarding update**. A software update job targets a group of devices, and an onboarding update job targets devices that onboard to a namespace. This article covers the software update job.

1. Select the group that you want to target. Use the group picker to search for and select a group. The picker shows the approximate number of devices in each group.

    For information about how group membership refreshes, see [Groups concepts (preview)](concept-groups.md).

1. Save the group selection. The portal shows a sample of the devices in the group and the device count.

1. Define the action to run by selecting one of the software updates imported into the namespace. Each software update includes a compatibility check that determines whether it applies to a device. The portal runs a compatibility check for the selected group to determine whether the software update is compatible.

    :::image type="content" source="media/how-to-deploy-software-update-group/define-action.png" alt-text="Screenshot of the Jobs page showing the action definition for a software update job." lightbox="media/how-to-deploy-software-update-group/define-action.png":::

1. Select **Next** to view a summary of the job. The summary shows the number of group members and an estimate of the number of compatible members that the job is likely to update successfully.

    :::image type="content" source="media/how-to-deploy-software-update-group/job-review.png" alt-text="Screenshot of the Jobs page showing the job review for a software update job." lightbox="media/how-to-deploy-software-update-group/job-review.png":::

1. Select **Create**. The job status shows **Creating** and then changes to **Ready** after a moment.

# [Bicep](#tab/bicep)

A software update job is a `Microsoft.DeviceRegistry/namespaces/jobs` resource with `properties.jobType` set to `SoftwareUpdate`. The `target.resourceId` property references the group that the job applies the update to, and must be a resource ID for a `Microsoft.DeviceRegistry/namespaces/groups` resource in the same namespace. The `definition.update.updateId` property identifies the software update to apply by its provider, name, and version. Currently, `definition.schedulingType` only supports the value `Continuous`.

After you create the job, its properties&mdash;including `target` and `definition`&mdash;are immutable. To change the target group or update definition, delete the job and create a new one.

Create a Bicep file with the following content. Replace the placeholder values, such as `<NAMESPACE_NAME>`, `<GROUP_NAME>`, and the update identifier values, with your own.

```bicep
param namespaceName string = '<NAMESPACE_NAME>'
param jobName string = '<JOB_NAME>'
param groupName string = '<GROUP_NAME>'
param updateProvider string = '<UPDATE_PROVIDER>'
param updateName string = '<UPDATE_NAME>'
param updateVersion string = '<UPDATE_VERSION>'

resource namespace 'Microsoft.DeviceRegistry/namespaces@2026-11-02-preview' existing = {
  name: namespaceName
}

resource group 'Microsoft.DeviceRegistry/namespaces/groups@2026-11-02-preview' existing = {
  parent: namespace
  name: groupName
}

resource softwareUpdateJob 'Microsoft.DeviceRegistry/namespaces/jobs@2026-11-02-preview' = {
  parent: namespace
  name: jobName
  location: namespace.location
  properties: {
    description: 'Software update job'
    jobType: 'SoftwareUpdate'
    target: {
      resourceId: group.id
    }
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
    - **Schedule for later**: Pick a time in the next seven days. The job runs at the time you select.

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

After you run or schedule the job, use the Azure portal, or the job run APIs, to monitor the run.

---

## Monitor the job run

The **Runs** tab shows the jobs, including running, completed, and scheduled runs.

# [Azure portal](#tab/portal)

1. Select the **Runs** tab to view the runs and their status.

1. Select a completed run to view its statistics. The run details show the number of updated devices and details of those devices.

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
- [Groups concepts (preview)](concept-groups.md)
