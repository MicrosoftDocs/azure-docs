---
title: Azure Service Fabric patch orchestration application | Microsoft Docs
description: Application to automate operating system patching on a Service Fabric cluster.
services: service-fabric
documentationcenter: .net
author: novino
manager: timlt
editor: ''

ms.assetid: de7dacf5-4038-434a-a265-5d0de80a9b1d
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 5/22/2018
ms.author: nachandr

---

# Patch the Windows operating system in your Service Fabric cluster

> [!div class="op_single_selector"]
> * [Windows](service-fabric-patch-orchestration-application.md)
> * [Linux](service-fabric-patch-orchestration-application-linux.md)
>
>

The patch orchestration application is an Azure Service Fabric application that automates operating system patching on a Service Fabric cluster without downtime.

The patch orchestration app provides the following features:

- **Automatic operating system update installation**. Operating system updates are automatically downloaded and installed. Cluster nodes are rebooted as needed without cluster downtime.

- **Cluster-aware patching and health integration**. While applying updates, the patch orchestration app monitors the health of the cluster nodes. Cluster nodes are upgraded one node at a time or one upgrade domain at a time. If the health of the cluster goes down due to the patching process, patching is stopped to prevent aggravating the problem.

## Internal details of the app

The patch orchestration app is composed of the following subcomponents:

- **Coordinator Service**: This stateful service is responsible for:
    - Coordinating the Windows Update job on the entire cluster.
    - Storing the result of completed Windows Update operations.
- **Node Agent Service**: This stateless service runs on all Service Fabric cluster nodes. The service is responsible for:
    - Bootstrapping the Node Agent NTService.
    - Monitoring the Node Agent NTService.
- **Node Agent NTService**: This Windows NT service runs at a higher-level privilege (SYSTEM). In contrast, the Node Agent Service and the Coordinator Service run at a lower-level privilege (NETWORK SERVICE). The service is responsible for performing the following Windows Update jobs on all the cluster nodes:
    - Disabling automatic Windows Update on the node.
    - Downloading and installing Windows Update according to the policy the user has provided.
    - Restarting the machine post Windows Update installation.
    - Uploading the results of Windows updates to the Coordinator Service.
    - Reporting health reports in case an operation has failed after exhausting all retries.

> [!NOTE]
> The patch orchestration app uses the Service Fabric repair manager system service to disable or enable the node and perform health checks. The repair task created by the patch orchestration app tracks the Windows Update progress for each node.

## Prerequisites

### Enable the repair manager service (if it's not running already)

The patch orchestration app requires the repair manager system service to be enabled on the cluster.

#### Azure clusters

Azure clusters in the silver durability tier have the repair manager service enabled by default. Azure clusters in the gold durability tier might or might not have the repair manager service enabled, depending on when those clusters were created. Azure clusters in the bronze durability tier, by default, do not have the repair manager service enabled. If the service is already enabled, you can see it running in the system services section in the Service Fabric Explorer.

##### Azure portal
You can enable repair manager from Azure portal at the time of setting up of cluster. Select **Include Repair Manager** option under **Add-on features** at the time of cluster configuration.
![Image of Enabling Repair Manager from Azure portal](media/service-fabric-patch-orchestration-application/EnableRepairManager.png)

##### Azure Resource Manager deployment model
Alternatively you can use the [Azure Resource Manager deployment model](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-via-arm) to enable the repair manager service on new and existing Service Fabric clusters. Get the template for the cluster that you want to deploy. You can either use the sample templates or create a custom Azure Resource Manager deployment model template. 

To enable the repair manager service using [Azure Resource Manager deployment model template](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-via-arm):

1. First check that the `apiversion` is set to `2017-07-01-preview` for the `Microsoft.ServiceFabric/clusters` resource. If it is different, then you need to update the `apiVersion` to the value `2017-07-01-preview` or higher:

    ```json
    {
        "apiVersion": "2017-07-01-preview",
        "type": "Microsoft.ServiceFabric/clusters",
        "name": "[parameters('clusterName')]",
        "location": "[parameters('clusterLocation')]",
        ...
    }
    ```

2. Now enable the repair manager service by adding the following `addonFeatures` section after the `fabricSettings` section:

    ```json
    "fabricSettings": [
        ...      
    ],
    "addonFeatures": [
        "RepairManager"
    ],
    ```

3. After you have updated your cluster template with these changes, apply them and let the upgrade finish. You can now see the repair manager system service running in your cluster. It is called `fabric:/System/RepairManagerService` in the system services section in the Service Fabric Explorer. 

### Standalone on-premises clusters

You can use the [Configuration settings for standalone Windows cluster](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-manifest) to enable the repair manager service on new and existing Service Fabric cluster.

To enable the repair manager service:

1. First check that the `apiversion` in [General cluster configurations](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-manifest#general-cluster-configurations) is set to `04-2017` or higher:

    ```json
    {
        "name": "SampleCluster",
        "clusterConfigurationVersion": "1.0.0",
        "apiVersion": "04-2017",
        ...
    }
    ```

2. Now enable repair manager service by adding the following `addonFeatures` section after the `fabricSettings` section as shown below:

    ```json
    "fabricSettings": [
        ...      
    ],
    "addonFeatures": [
        "RepairManager"
    ],
    ```

3. Update your cluster manifest with these changes, using the updated cluster manifest [create a new cluster](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-for-windows-server) or [upgrade the cluster configuration](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-upgrade-windows-server#Upgrade-the-cluster-configuration). Once the cluster is running with updated cluster manifest, you can now see the repair manager system service running in your cluster, which is called `fabric:/System/RepairManagerService`, under system services section in the Service Fabric explorer.

### Disable automatic Windows Update on all nodes

Automatic Windows updates might lead to availability loss because multiple cluster nodes can restart at the same time. The patch orchestration app, by default, tries to disable the automatic Windows Update on each cluster node. However, if the settings are managed by an administrator or group policy, we recommend setting the Windows Update policy to “Notify before Download” explicitly.

## Download the app package

Application along with installation scripts can be downloaded from [Archive link](https://go.microsoft.com/fwlink/?linkid=869566).

Application in sfpkg format can be downloaded from [sfpkg link](https://aka.ms/POA/POA_v1.2.2.sfpkg). This comes handy for [Azure Resource Manager based application deployment](service-fabric-application-arm-resource.md).

## Configure the app

The behavior of the patch orchestration app can be configured to meet your needs. Override the default values by passing in the application parameter during application creation or update. Application parameters can be provided by specifying `ApplicationParameter` to the `Start-ServiceFabricApplicationUpgrade` or `New-ServiceFabricApplication` cmdlets.

|**Parameter**        |**Type**                          | **Details**|
|:-|-|-|
|MaxResultsToCache    |Long                              | Maximum number of Windows Update results, which should be cached. <br>Default value is 3000 assuming the: <br> - Number of nodes is 20. <br> - Number of updates happening on a node per month is five. <br> - Number of results per operation can be 10. <br> - Results for the past three months should be stored. |
|TaskApprovalPolicy   |Enum <br> { NodeWise, UpgradeDomainWise }                          |TaskApprovalPolicy indicates the policy that is to be used by the Coordinator Service to install Windows updates across the Service Fabric cluster nodes.<br>                         Allowed values are: <br>                                                           <b>NodeWise</b>. Windows Update is installed one node at a time. <br>                                                           <b>UpgradeDomainWise</b>. Windows Update is installed one upgrade domain at a time. (At the maximum, all the nodes belonging to an upgrade domain can go for Windows Update.)<br> Refer to [FAQ](#frequently-asked-questions) section on how to decide which is best suited policy for your cluster.
|LogsDiskQuotaInMB   |Long  <br> (Default: 1024)               |Maximum size of patch orchestration app logs in MB, which can be persisted locally on nodes.
| WUQuery               | string<br>(Default: "IsInstalled=0")                | Query to get Windows updates. For more information, see [WuQuery.](https://msdn.microsoft.com/library/windows/desktop/aa386526(v=vs.85).aspx)
| InstallWindowsOSOnlyUpdates | Boolean <br> (default: True)                 | This flag allows Windows operating system updates to be installed.            |
| WUOperationTimeOutInMinutes | Int <br>(Default: 90)                   | Specifies the timeout for any Windows Update operation (search or download or install). If the operation is not completed within the specified timeout, it is aborted.       |
| WURescheduleCount     | Int <br> (Default: 5)                  | The maximum number of times the service reschedules the Windows update in case an operation fails persistently.          |
| WURescheduleTimeInMinutes | Int <br>(Default: 30) | The interval at which the service reschedules the Windows update in case failure persists. |
| WUFrequency           | Comma-separated string (Default: "Weekly, Wednesday, 7:00:00")     | The frequency for installing Windows Update. The format and possible values are: <br>-   Monthly, DD, HH:MM:SS, for example, Monthly, 5,12:22:32. <br> -   Weekly, DAY, HH:MM:SS, for example, Weekly, Tuesday, 12:22:32.  <br> -   Daily, HH:MM:SS, for example, Daily, 12:22:32.  <br> -  None indicates that Windows Update shouldn't be done.  <br><br> Note that times are in UTC.|
| AcceptWindowsUpdateEula | Boolean <br>(Default: true) | By setting this flag, the application accepts the End-User License Agreement for Windows Update on behalf of the owner of the machine.              |

> [!TIP]
> If you want Windows Update to happen immediately, set `WUFrequency` relative to the application deployment time. For example, suppose that you have a five-node test cluster and plan to deploy the app at around 5:00 PM UTC. If you assume that the application upgrade or deployment takes 30 minutes at the maximum, set the WUFrequency as "Daily, 17:30:00."

## Deploy the app

1. Finish all the prerequisite steps to prepare the cluster.
2. Deploy the patch orchestration app like any other Service Fabric app. You can deploy the app by using PowerShell. Follow the steps in [Deploy and remove applications using PowerShell](https://docs.microsoft.com/azure/service-fabric/service-fabric-deploy-remove-applications).
3. To configure the application at the time of deployment, pass the `ApplicationParamater` to the `New-ServiceFabricApplication` cmdlet. For your convenience, we’ve provided the script Deploy.ps1 along with the application. To use the script:

    - Connect to a Service Fabric cluster by using `Connect-ServiceFabricCluster`.
    - Execute the PowerShell script Deploy.ps1 with the appropriate `ApplicationParameter` value.

> [!NOTE]
> Keep the script and the application folder PatchOrchestrationApplication in the same directory.

## Upgrade the app

To upgrade an existing patch orchestration app by using PowerShell, follow the steps in [Service Fabric application upgrade using PowerShell](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-upgrade-tutorial-powershell).

## Remove the app

To remove the application, follow the steps in [Deploy and remove applications using PowerShell](https://docs.microsoft.com/azure/service-fabric/service-fabric-deploy-remove-applications).

For your convenience, we've provided the script Undeploy.ps1 along with the application. To use the script:

  - Connect to a Service Fabric cluster by using ```Connect-ServiceFabricCluster```.

  - Execute the PowerShell script Undeploy.ps1.

> [!NOTE]
> Keep the script and the application folder PatchOrchestrationApplication in the same directory.

## View the Windows Update results

The patch orchestration app exposes REST APIs to display the historical results to the user. An example of the result JSON:
```json
[
  {
    "NodeName": "_stg1vm_1",
    "WindowsUpdateOperationResults": [
      {
        "OperationResult": 0,
        "NodeName": "_stg1vm_1",
        "OperationTime": "2017-05-21T11:46:52.1953713Z",
        "UpdateDetails": [
          {
            "UpdateId": "7392acaf-6a85-427c-8a8d-058c25beb0d6",
            "Title": "Cumulative Security Update for Internet Explorer 11 for Windows Server 2012 R2 (KB3185319)",
            "Description": "A security issue has been identified in a Microsoft software product that could affect your system. You can help protect your system by installing this update from Microsoft. For a complete listing of the issues that are included in this update, see the associated Microsoft Knowledge Base article. After you install this update, you may have to restart your system.",
            "ResultCode": 0
          }
        ],
        "OperationType": 1,
        "WindowsUpdateQuery": "IsInstalled=0",
        "WindowsUpdateFrequency": "Daily,10:00:00",
        "RebootRequired": false
      }
    ]
  },
  ...
]
```

Fields of the JSON are described below.

Field | Values | Details
-- | -- | --
OperationResult | 0 - Succeeded<br> 1 - Succeeded With Errors<br> 2 - Failed<br> 3 - Aborted<br> 4 - Aborted With Timeout | Indicates the result of overall operation (typically involving installation of one or more updates).
ResultCode | Same as OperationResult | This field indicates result of installation operation for an individual update.
OperationType | 1 - Installation<br> 0 - Search and Download.| Installation is the only OperationType that would be shown in the results by default.
WindowsUpdateQuery | Default is "IsInstalled=0" |Windows update query that was used to search for updates. For more information, see [WuQuery.](https://msdn.microsoft.com/library/windows/desktop/aa386526(v=vs.85).aspx)
RebootRequired | true - reboot was required<br> false - reboot was not required | Indicates if reboot was required to complete installation of updates.

If no update is scheduled yet, the result JSON is empty.

Log in to the cluster to query Windows Update results. Then find out the replica address for the primary of the Coordinator Service, and hit the URL from the browser:
http://&lt;REPLICA-IP&gt;:&lt;ApplicationPort&gt;/PatchOrchestrationApplication/v1/GetWindowsUpdateResults.

The REST endpoint for the Coordinator Service has a dynamic port. To check the exact URL, refer to the Service Fabric Explorer. For example, the results are available at
`http://10.0.0.7:20000/PatchOrchestrationApplication/v1/GetWindowsUpdateResults`.

![Image of REST endpoint](media/service-fabric-patch-orchestration-application/Rest_Endpoint.png)


If the reverse proxy is enabled on the cluster, you can access the URL from outside of the cluster as well.
The endpoint that needs to be hit is
http://&lt;SERVERURL&gt;:&lt;REVERSEPROXYPORT&gt;/PatchOrchestrationApplication/CoordinatorService/v1/GetWindowsUpdateResults.

To enable the reverse proxy on the cluster, follow the steps in [Reverse proxy in Azure Service Fabric](https://docs.microsoft.com/azure/service-fabric/service-fabric-reverseproxy). 

> 
> [!WARNING]
> After the reverse proxy is configured, all micro services in the cluster that expose an HTTP endpoint are addressable from outside the cluster.

## Diagnostics/health events

### Diagnostic logs

Patch orchestration app logs are collected as part of Service Fabric runtime logs.

In case you want to capture logs via diagnostic tool/pipeline of your choice. Patch orchestration application uses below fixed provider IDs to log events via [eventsource](https://docs.microsoft.com/dotnet/api/system.diagnostics.tracing.eventsource?view=netframework-4.5.1)

- e39b723c-590c-4090-abb0-11e3e6616346
- fc0028ff-bfdc-499f-80dc-ed922c52c5e9
- 24afa313-0d3b-4c7c-b485-1047fd964b60
- 05dc046c-60e9-4ef7-965e-91660adffa68

### Health reports

The patch orchestration app also publishes health reports against the Coordinator Service or the Node Agent Service in the following cases:

#### A Windows Update operation failed

If a Windows Update operation fails on a node, a health report is generated against the Node Agent Service. Details of the health report contain the problematic node name.

After patching is successfully completed on the problematic node, the report is automatically cleared.

#### The Node Agent NTService is down

If the Node Agent NTService is down on a node, a warning-level health report is generated against the Node Agent Service.

#### The repair manager service is not enabled

If the repair manager service is not found on the cluster, a warning-level health report is generated for the Coordinator Service.

## Frequently asked questions

Q. **Why do I see my cluster in an error state when the patch orchestration app is running?**

A. During the installation process, the patch orchestration app disables or restarts nodes, which can temporarily result in the health of the cluster going down.

Based on the policy for the application, either one node can go down during a patching operation *or* an entire upgrade domain can go down simultaneously.

By the end of the Windows Update installation, the nodes are reenabled post restart.

In the following example, the cluster went to an error state temporarily because two nodes were down and the MaxPercentageUnhealthNodes policy was violated. The error is temporary until the patching operation is ongoing.

![Image of unhealthy cluster](media/service-fabric-patch-orchestration-application/MaxPercentage_causing_unhealthy_cluster.png)

If the issue persists, refer to the Troubleshooting section.

Q. **Patch orchestration app is in warning state**

A. Check to see if a health report posted against the application is the root cause. Usually, the warning contains details of the problem. If the issue is transient, the application is expected to auto-recover from this state.

Q. **What can I do if my cluster is unhealthy and I need to do an urgent operating system update?**

A. The patch orchestration app does not install updates while the cluster is unhealthy. Try to bring your cluster to a healthy state to unblock the patch orchestration app workflow.

Q. **Should i set TaskApprovalPolicy as 'NodeWise' or 'UpgradeDomainWise' for my cluster?**

A. 'UpgradeDomainWise' makes the overall cluster patching faster by patching all the nodes belonging to an upgrade domain in parallel. This means that nodes belonging to an entire upgrade domain would be unavailable (in [Disabled](https://docs.microsoft.com/dotnet/api/system.fabric.query.nodestatus?view=azure-dotnet#System_Fabric_Query_NodeStatus_Disabled) state) during the patching process.

In contrast 'NodeWise' policy patches only one node at a time, this implies overall cluster patching would take longer time. However, at max, only one node would be unavailable (in [Disabled](https://docs.microsoft.com/dotnet/api/system.fabric.query.nodestatus?view=azure-dotnet#System_Fabric_Query_NodeStatus_Disabled) state) during the patching process.

If your cluster can tolerate running on N-1 number of upgrade domains during patching cycle (where N is the total number of upgrade domains on your cluster), then you can set the policy as 'UpgradeDomainWise', otherwise set it to 'NodeWise'.

Q. **How much time does it take to patch a node?**

A. Patching a node may take minutes (for example: [Windows Defender definition updates](https://www.microsoft.com/wdsi/definitions)) to hours (for example: [Windows Cumulative updates](https://www.catalog.update.microsoft.com/Search.aspx?q=windows%20server%20cumulative%20update)). Time required to patch a node depends mostly on 
 - The size of updates
 - Number of updates, which have to be applied in a patching window
 - Time it takes to install the updates, reboot the node (if required), and finish post-reboot installation steps.
 - Performance of VM/machine and network conditions.

Q. **How long does it take to patch an entire cluster?**

A. The time needed to patch an entire cluster depends on the following factors:

- Time needed to patch a node.
- The policy of the Coordinator Service. - The default policy, `NodeWise`, results in patching only one node at a time, which would be slower than `UpgradeDomainWise`. For example: If a node takes ~1 hour to be patched, inorder to patch a 20 node (same type of nodes) cluster with 5 upgrade domains, each containing 4 nodes.
    - It should take ~20 hours to patch the entire cluster, if policy is `NodeWise`
    - It should take ~5 hours if policy is `UpgradeDomainWise`
- Cluster load - Each patching operation requires relocating the customer workload to other available nodes in the cluster. Node undergoing patch would be in [Disabling](https://docs.microsoft.com/dotnet/api/system.fabric.query.nodestatus?view=azure-dotnet#System_Fabric_Query_NodeStatus_Disabling) state during this time. If the cluster is running near peak load, the disabling process would take longer time. Hence overall patching process may appear to be slow in such stressed conditions.
- Cluster health failures during patching - Any [degradation](https://docs.microsoft.com/dotnet/api/system.fabric.health.healthstate?view=azure-dotnet#System_Fabric_Health_HealthState_Error) in [health of the cluster](https://docs.microsoft.com/azure/service-fabric/service-fabric-health-introduction) would interrupt the patching process. This would add to the overall time required to patch the entire cluster.

Q. **Why do I see some updates in Windows Update results obtained via REST API, but not under the Windows Update history on the machine?**

A. Some product updates would only appear in their respective update/patch history. For example, Windows Defender updates may or may not show up in Windows Update history on Windows Server 2016.

Q. **Can Patch Orchestration app be used to patch my dev cluster (one-node cluster)?**

A. No, Patch orchestration app cannot be used to patch one-node cluster. This limitation is by design, as [service fabric system services](https://docs.microsoft.com/azure/service-fabric/service-fabric-technical-overview#system-services) or any customer apps will face downtime and hence any repair job for patching would never get approved by repair manager.

## Disclaimers

- The patch orchestration app accepts the End-User License Agreement of Windows Update on behalf of the user. Optionally, the setting can be turned off in the configuration of the application.

- The patch orchestration app collects telemetry to track usage and performance. The application’s telemetry follows the setting of the Service Fabric runtime’s telemetry setting (which is on by default).

## Troubleshooting

### A node is not coming back to up state

**The node might be stuck in a disabling state because**:

A safety check is pending. To remedy this situation, ensure that enough nodes are available in a healthy state.

**The node might be stuck in a disabled state because**:

- The node was disabled manually.
- The node was disabled due to an ongoing Azure infrastructure job.
- The node was disabled temporarily by the patch orchestration app to patch the node.

**The node might be stuck in a down state because**:

- The node was put in a down state manually.
- The node is undergoing a restart (which might be triggered by the patch orchestration app).
- The node is down due to a faulty VM or machine or network connectivity issues.

### Updates were skipped on some nodes

The patch orchestration app tries to install a Windows update according to the rescheduling policy. The service tries to recover the node and skip the update according to the application policy.

In such a case, a warning-level health report is generated against the Node Agent Service. The result for Windows Update also contains the possible reason for the failure.

### The health of the cluster goes to error while the update installs

A faulty Windows update can bring down the health of an application or cluster on a particular node or upgrade domain. The patch orchestration app discontinues any subsequent Windows Update operation until the cluster is healthy again.

An administrator must intervene and determine why the application or cluster became unhealthy due to Windows Update.

## Release Notes

### Version 1.1.0
- Public release

### Version 1.1.1
- Fixed a bug in SetupEntryPoint of NodeAgentService that prevented installation of NodeAgentNTService.

### Version 1.2.0

- Bug fixes around system restart workflow.
- Bug fix in creation of RM tasks due to which health check during preparing repair tasks wasn't happening as expected.
- Changed the startup mode for windows service POANodeSvc from auto to delayed-auto.

### Version 1.2.1

- Bug fix in cluster scale-down workflow. Introduced garbage collection logic for POA repair tasks belonging to non-existent nodes.

### Version 1.2.2 (Latest)

- Miscellaneous bug fixes.
- Binaries are now signed.
- sfpkg download link now points to a specific version.
