---
title: Azure Service Fabric Patch Orchestration Application | Microsoft Docs
description: Application to automate operating system patching on a Service Fabric cluster.
services: service-fabric
documentationcenter: .net
author: novino
manager: timlt
editor: ''

ms.assetid: de7dacf5-4038-434a-a265-5d0de80a9b1d
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 5/9/2017
ms.author: nachandr

---

# Application to patch the Windows operating system in your Service Fabric cluster

The Patch Orchestration Application is an Azure Service Fabric application that you can use to automate operating system patching on a Service Fabric cluster on Azure or on-premises, without downtime.

The Patch Orchestration Application includes the following salient features:

- **Automatic operating system update installation**: The Patch Orchestration Application ensures that updates are automatically downloaded and installed and that nodes are rebooted as applicable. These processes are done on all the cluster nodes without downtime.

- **Cluster-aware patching and health integration**: While applying updates, the Patch Orchestration Application monitors the health of the cluster as it moves ahead. The application updates one node at a time or one upgrade domain at a time. If it detects that the health of the cluster is going down due to the patching process, it stops the process to prevent aggravating the problem.

- **Support all Service Fabric clusters**: The application is generic enough to work in both Service Fabric clusters and standalone clusters.
> [!NOTE]
> Support for standalone clusters is coming.

## Download the application package

Download the application from the [download link](https://go.microsoft.com/fwlink/P/?linkid=849590).

## Internal details of the application

The Patch Orchestration Application comprises the following subcomponents:

- **Coordinator Service**: This stateful service is responsible for:
    - Coordinating the Windows Update job on the entire cluster.
    - Storing the results of completed Windows Update operations.
- **Node Agent Service**: This stateless service runs on all Service Fabric cluster nodes. The service is responsible for:
    - Bootstrapping the Node Agent NTService.
    - Monitoring the Node Agent NTService.
- **Node Agent NTService**: This Windows NT service runs at higher privileges (SYSTEM). In contrast, the Node Agent Service and the Coordinator Service run at a lower-level privilege (NETWORK SERVICE). The service is responsible for performing the following Windows Update jobs on all the cluster nodes:
    - Disabling automatic Windows Update on the node.
    - Downloading and installing Windows updates according to the policy the user has provided.
    - Restarting the machine post Windows Update installation.
    - Uploading the result of a Windows update to the Coordinator Service.
    - Reporting on health in case the operation has failed after exhausting all retries.

> [!NOTE]
> The Patch Orchestration Application uses the Service Fabric Repair Manager system service to disable/enable the node and perform health checks. The repair task created by the Patch Orchestration Application tracks the Windows update progress for each node.

## Prerequisites for using the application

- Ensure that the Service Fabric version is 5.5 or later.
  - The Patch Orchestration Application can be run on clusters that have the Service Fabric runtime version 5.5 or later.
- Enable the Repair Manager service (if it's not running already).
  - The Patch Orchestration Application requires the Repair Manager system service to be enabled on the cluster.

### Service Fabric clusters on Azure

Azure clusters in the Gold durability tier might or might not have the Repair Manager service enabled, depending on how long ago those clusters were created. Azure clusters in the Silver durability tier have the Repair Manager service enabled by default. Azure clusters in the Bronze durability tier, by default, do not have the Repair Manager service enabled. 

You can use the [Azure Resource Manager template](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-via-arm) to enable the Repair Manager service on your new or existing Service Fabric clusters. Look at the system services section in the Service Fabric Explorer to see whether the service is running.

### Enable the Repair Manager service

First, get the template for the cluster that you want to deploy. You can either use the sample templates or create a custom Resource Manager template. You can then enable the Repair Manager service by following these steps:

1. Check to make sure that the `apiversion` is set to `2017-07-01-preview` for the `Microsoft.ServiceFabric/clusters` resource, as shown in the following snippet. If it is different, you need to update the `apiVersion` to the value `2017-07-01-preview`:

    ```json
    {
        "apiVersion": "2017-07-01-preview",
        "type": "Microsoft.ServiceFabric/clusters",
        "name": "[parameters('clusterName')]",
        "location": "[parameters('clusterLocation')]",
        ...
    }
    ```

2. Enable the Repair Manager service by adding the following `addonFeatures` section after the `fabricSettings` section:

    ```json
    "fabricSettings": [
        ...      
        ],
        "addonFeatures": [
            "RepairManager"
        ],
    ```

3. After you have updated your cluster template with these changes, apply them and let the upgrade complete. You can now see the Repair Manager system service running in your cluster. It is called `fabric:/System/RepairManagerService` in the system services section in the Service Fabric Explorer. 

### Standalone on-premises clusters

> [!NOTE]
> Support for standalone clusters is coming.

### Disable automatic Windows Update on all nodes

If automatic Windows Update is enabled on a Service Fabric cluster, availability loss might occur because multiple nodes can restart at the same time to complete an update. By default, Patch Orchestration Application tries to disable automatic Windows Update on each cluster node. If the settings are managed by administrator/group policy, we recommend that you set the Windows Update policy to “Notify before Download” explicitly.

### Optional: Enable Windows Azure Diagnostics

Until logs for the Patch Orchestration Application are collected as part of the Service Fabric log itself, they are collected locally on each of the cluster nodes. We recommend configuring Windows Azure Diagnostics to have the logs uploaded from all nodes to a central location.

For information on enabling Windows Azure Diagnostics, see [Collect logs by using Azure Diagnostics](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-how-to-setup-wad).

Logs for the Patch Orchestration Application are generated on the following fixed provider IDs:

- e39b723c-590c-4090-abb0-11e3e6616346
- fc0028ff-bfdc-499f-80dc-ed922c52c5e9
- 24afa313-0d3b-4c7c-b485-1047fd964b60
- 05dc046c-60e9-4ef7-965e-91660adffa68

Inside the "WadCfg" section in the Resource Manager template, add the following section: 

```json
"PatchOrchestrationApplication": \[
  {
    "provider": "e39b723c-590c-4090-abb0-11e3e6616346",
    "scheduledTransferPeriod": "PT5M",
    "DefaultEvents": {
      "eventDestination": "PatchOrchestrationApplicationTable"
    }
  },
  {
    "provider": "fc0028ff-bfdc-499f-80dc-ed922c52c5e9",
    "scheduledTransferPeriod": "PT5M",
    "DefaultEvents": {
    "eventDestination": " PatchOrchestrationApplicationTable"
    }
  },
  {
    "provider": "24afa313-0d3b-4c7c-b485-1047fd964b60",
    "scheduledTransferPeriod": "PT5M",
    "DefaultEvents": {
    "eventDestination": " PatchOrchestrationApplicationTable"
    }
  },
  {
    "provider": "05dc046c-60e9-4ef7-965e-91660adffa68",
    "scheduledTransferPeriod": "PT5M",
    "DefaultEvents": {
    "eventDestination": " PatchOrchestrationApplicationTable"
    }
  },
\]
```

> [!NOTE]
> If your Service Fabric cluster is composed of multiple node types, then the previous section has to be added for all the “WadCfg” sections.

## Configure the application

You can set the following configurations to tweak the behavior of the Patch Orchestration Application to meet your needs.

You can override the default values by passing in the application parameter during application creation or update. Application parameters can be provided by specifying `ApplicationParameter` to the cmdlet 
`Start-ServiceFabricApplicationUpgrade` or `New-ServiceFabricApplication`.

|**Parameter**        |**Type**                          | **Details**|
|:-|-|-|
|MaxResultsToCache    |Long                              | Maximum number of Windows Update results histories that should be cached. <br>Default value is 3000 assuming: <br> - Number of nodes is 20. <br> - Number of updates happening on a node per month is five. <br> - Number of results per operation can be 10. <br> - And results for the past three months should be stored. |
|TaskApprovalPolicy   |Enum <br> { NodeWise, UpgradeDomainWise }                          |TaskApprovalPolicy indicates that the policy is to be used by CoordinatorService to install Windows updates across the Service Fabric cluster nodes.<br>                         Allowed values are:<br>                                                           - <b>NodeWise</b>. A Windows update is installed one node at a time. <br>                                                           - <b>UpgradeDomainWise</b>. A Windows update is installed one upgrade domain at a time. (At the maximum, all the nodes that belong to an upgrade domain can go for a Windows update.)
|LogsDiskQuotaInMB   |Long  <br> (Default: 1024)               |Maximum size of Patch Orchestration Application logs in MB, which can be persisted locally on node.
| WUQuery               | string<br>(Default: "IsInstalled=0")                | Query to get Windows updates. For more information, see [WuQuery](https://msdn.microsoft.com/library/windows/desktop/aa386526(v=vs.85).aspx).
| InstallWindowsOSOnlyUpdates | Bool <br> (default: True)                 | This flag allows Windows operating system updates to be installed.            |
| WUOperationTimeOutInMinutes | Int <br>(Default: 90)                   | Specifies the timeout for any Windows Update operation (search/download/install). If the operation is not completed within the specified timeout, it is aborted.       |
| WURescheduleCount     | Int <br> (Default: 5)                  | This configuration determines the maximum number of times that the service reschedules the Windows update if the operation fails persistently.          |
| WURescheduleTimeInMinutes | Int <br>(Default: 30) | This configuration determines the interval at which the service reschedules the Windows update if failure persists. |
| WUFrequency           | Comma-separated string (Default: "Weekly, Wednesday, 7:00:00")     | The frequency for installing a Windows update. The format and possible values are: <br>-   Monthly, DD,HH:MM:SS. For example: Monthly, 5,12:22:32. <br> - Weekly, DAY,HH:MM:SS. For example: Weekly, Tuesday, 12:22:32.  <br> - Daily, HH:MM:SS. For example: Daily, 12:22:32.  <br> - None indicates that the Windows update shouldn't be done.  <br><br> All the times are in UTC.|
| AcceptWindowsUpdateEula | Bool <br>(Default: true) | By setting this flag, the application accepts the EULA for the Windows update on behalf of the owner of the machine.              |


## Deploy the application

1. To prepare the cluster, finish all the prerequisite steps.

2. Deploy the application by using PowerShell. Follow the steps in [Deploy and remove applications using PowerShell](https://docs.microsoft.com/azure/service-fabric/service-fabric-deploy-remove-applications).

3. To configure the application at the time of deployment, use `ApplicationParameter` to cmdlet `New-ServiceFabricApplication`.

    For ease of use, we’ve provided the script Deploy.ps1 along with the application. To use it:

    - Connect to a Service Fabric cluster by using `Connect-ServiceFabricCluster`.
    - Execute the PowerShell script Deploy.ps1 with the appropriate `ApplicationParameter` value.

> [!NOTE]
> Keep the script and application folder PatchOrchestrationApplication in the same directory.

## Upgrade the application

To upgrade an existing Patch Orchestration Application by using PowerShell, follow the steps in [Service Fabric application upgrade using PowerShell](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-upgrade-tutorial-powershell).

To change only the parameters of the application, provide `ApplicationParameter` to the cmdlet `Start-ServiceFabricApplicationUpgrade` with the existing application version.

## Remove the application

To remove the application, follow the steps in [Deploy and remove applications using PowerShell](https://docs.microsoft.com/azure/service-fabric/service-fabric-deploy-remove-applications).

For ease of use, we've provided the script Undeploy.ps1 along with the application. To use it:

    - Connect to Service Fabric cluster using ```Connect-ServiceFabricCluster```
    - Execute the powershell script Undeploy.ps1

> [!NOTE]
> Keep the script and the application folder PatchOrchestrationApplication in the same directory.

## View the Windows Update results

The Patch Orchestration Application exposes the REST API to display the historical results to the user.

Windows Update results can be queried by logging to the cluster. Then find out the replica address for the primary of the coordinator service, and hit the URL from the browser:
http://&lt;REPLICA-IP&gt;:&lt;ApplicationPort&gt;/PatchOrchestrationApplication/v1/GetWindowsUpdateResults.

The REST endpoint for CoordinatorService has a dynamic port. To check the exact URL, refer to Service Fabric Explorer. For the following example, the results would be available at
`http://10.0.0.7:20000/PatchOrchestrationApplication/v1/GetWindowsUpdateResults`.

![Image of REST endpoint](media/service-fabric-patch-orchestration-application/Rest_Endpoint.png)


You can access the URL from outside of the cluster as well, if the reverse proxy is enabled on the cluster.
The endpoint that needs to be hit is
http://&lt;SERVERURL&gt;:&lt;REVERSEPROXYPORT&gt;/PatchOrchestrationApplication/CoordinatorService/v1/GetWindowsUpdateResults.

To enable the reverse proxy on the cluster, follow the steps in [Reverse proxy in Azure Service Fabric](https://docs.microsoft.com/azure/service-fabric/service-fabric-reverseproxy). 

> 
> [!WARNING]
> After the reverse proxy is configured, all micro services in the cluster that expose an HTTP endpoint are addressable from outside the cluster.

## Diagnostics/health events

### Collect Patch Orchestration Application logs

Patch Orchestration Application logs are collected as part of the Service Fabric log. Logs can be collected in two ways: locally on each node or in a central location.

#### Locally on each node

Logs are collected locally on each Service Fabric cluster node. The location to access the logs is
\[Service Fabric\_Installation\_Drive\]:\\PatchOrchestrationApplication\\logs.

For example, if Service Fabric was installed on drive D, the path would be 
D:\\PatchOrchestrationApplication\\logs.

#### Central location

If Windows Azure Diagnostics is configured as part of the prerequisite steps, logs for the Patch Orchestration Application are available in Azure storage.

### Health reports

The Patch Orchestration Application also publishes health reports against the Coordinator Service or the Node Agent Service in the following cases:

#### Windows Update operation failed

If a Windows Update operation fails on a node, a health report against the Node Agent Service is generated.
Details of the health report contain the problematic node name.

After patching is successfully completed on the problematic node, the report is automatically cleared.

#### Node Agent NTService is down

If the Node Agent NTService is down on a node, a warning-level health report is generated against the Node Agent Service.

#### Repair Manager is not enabled

If the Repair Manager service is not found on the cluster, a warning-level health report is generated for the Coordinator Service.

## Frequently asked questions

Q. **Why do I see my cluster in an error state when the Patch Orchestration Application is running?**

A. During the installation process, the Patch Orchestration Application disables and/or restarts nodes, which can temporarily result in the health of the cluster going down.

Based on the policy for Patch Orchestration Application, either one node can go down during a patching operation *or* an entire upgrade domain can go down simultaneously.

By the end of the Windows Update installation, the nodes are reenabled post restart.

In the following example, a cluster went to an error state temporarily because two nodes were down and the 
MaxPercentageUnhealthNodes policy was violated. The error is temporary until the patching operation is ongoing.

![Image of unhealthy cluster](media/service-fabric-patch-orchestration-application/MaxPercentage_causing_unhealthy_cluster.png)

If the issue persists, refer to the Troubleshooting section.

Q. **Can I use the Patch Orchestration Application for standalone clusters?**

A. No. Support for standalone clusters is coming.

Q. **Why is the Patch Orchestration Application in a warning state?**

A. Check to see if a health report posted against the application is the root cause. Usually, the warning contains details of the problem. If the issue is transient, the Patch Orchestration Application is expected to auto-recover from this state.

Q. **What can I do if my cluster is unhealthy and I need to do an urgent operating system update?**

A. The Patch Orchestration Application does not install updates while the cluster is unhealthy. Try to bring your cluster to a healthy state to unblock the Patch Orchestration Application workflow.

Q. **Why does patching across clusters take so long to run?**

A. The time needed by the Patch Orchestration Application is mostly dependent on the following factors:

- The policy of the Coordinator Service. 
- The default policy of `NodeWise`, which results in patching only one node at a time. Especially in the case of bigger clusters, we recommend that you use the `UpgradeDomainWise` policy to achieve faster patching across clusters.
- The number of updates available for download and install. 
- The average time needed to download and install an update, which should not exceed a couple of hours.
- The performance of the VM and network bandwidth.

## Disclaimers

- The Patch Orchestration Application accepts the EULA of the Windows update on behalf of the user. Optionally, the setting can be turned off in the configuration of the application.

- The Patch Orchestration Application collects telemetry to track usage and performance. Patch Orchestration Application telemetry follows the setting of the Service Fabric runtime telemetry setting (which is on by default).

## Troubleshooting

### Node not coming back to up state

**The node might be stuck in a disabling state because**:

A safety check is pending. To remedy this situation, ensure that enough nodes are available in a healthy state.

**The node might be stuck in a disabled state because**:

- The node was disabled manually.
- The node was disabled due to an ongoing Azure infrastructure job.
- The node was disabled temporarily by the Patch Orchestration Application to patch the node.

**The node might be stuck in a down state because**:

- The node was put in a down state manually.
- The node is undergoing a restart (which might be triggered by the Patch Orchestration Application).
- The node is down due to faulty VM/machine or network connectivity issues.

### Updates were skipped on some nodes

The Patch Orchestration Application tries to install a Windows update according to the rescheduling policy. Service would try to recover the node and skip the update as per the application policy.

In such a case, a warning-level health report is generated against the Node Agent Service. The result for the Windows update also contains the possible reason for the failure.

### Health of the cluster goes to error while the update installs

If a Windows update brings down the health of an application/cluster on a particular node or upgrade domain, the Patch Orchestration Application discontinues any subsequent Windows update operations until the cluster is healthy again.

An administrator has to intervene and determine why the Windows update is causing the health of the application/cluster to go bad.
