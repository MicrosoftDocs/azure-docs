---
title: Azure Service Fabric Patch Orchestration Application | Microsoft Docs
description: Application to automate OS patching on a Service Fabric cluster.
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

# Patch Windows OS in your Service Fabric cluster

The patch orchestration application is a Service Fabric application that automates OS patching on a Service Fabric cluster on Azure without downtime. Support for running the patch orchestration app on a standalone cluster is coming later.

The patch orchestration application provides the following:

- **Automatic OS update installation**. OS updates are automatically downloaded and installed.  Cluster nodes are rebooted as needed without cluster downtime.

- **Cluster aware patching and health integration**.  While applying updates, the patch orchestration app monitors the health of the cluster nodes.  Cluster nodes are upgraded one node at a time or one upgrade domain at a time. If the health of the cluster goes down due to the patching process, patching is stopped to prevent aggravating the problem.

## Internal details of the app

The patch orchestration app is comprised of the following subcomponents:

- **Coordinator Service**: a stateful service. The service is responsible for
    - Coordinating the Windows Update job on the entire cluster.
    - Stores the result of completed Windows Update operations.
- **Node Agent Service**: a stateless service, it runs on all Service Fabric cluster nodes. The service is responsible for
    - Bootstrapping of Node Agent NTService.
    - Monitoring the Node Agent NTService.
- **Node Agent NTService**: a Windows NT service. Node Agent NTService runs at higher privileges (SYSTEM). In contrast, Node Agent Service and Coordinator Service run at a lower-level privilege (NETWORK SERVICE). The service is responsible for performing following Windows Update jobs on all the cluster nodes.
    - Disabling automatic Windows Update on the node.
    - Download, installation of Windows Updates as per the policy user has provided.
    - Restarting the machine post Windows Update installation
    - Uploading the result of Windows Update to Coordinator Service.
    - Report health report in case operation has failed after exhausting all retries.

> [!NOTE]
> Patch orchestration app uses Service Fabric system service **repair manager**, to disable/enable the node and performing health checks. The repair task created by the patch orchestration application tracks the Windows Update progress for each node.

## Prerequisites

### The cluster runs Service Fabric version 5.5 or later

The patch orchestration app must be run on clusters having Service Fabric runtime version v5.5 or later.

### Enable repair manager service (if not running already)

The patch orchestration app requires the repair manager system service to be enabled on the cluster.

#### Enable the repair manager service on Azure clusters

Azure clusters in silver durability tier have the repair manager service enabled by default. Azure cluster in gold durability tier may or may not have the repair manager service enabled, depending on when those clusters were created. Azure clusters in bronze durability tier, by default, do not have repair manager service enabled. If the service is already enabled, you can see it running under the system services section in the Service Fabric explorer.

You can use the [Azure Resource Manager template](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-via-arm) to enable the repair manager service on new and existing Service Fabric clusters.  Get the template for the cluster that you want to deploy. You can either use the sample templates or create a custom Resource Manager template. 

To enable the repair manager service:

1. First check that the `apiversion` is set to `2017-07-01-preview` for the `Microsoft.ServiceFabric/clusters` resource as shown in the following snippet. If it is different, then you need to update the `apiVersion` to the value `2017-07-01-preview`:

    ```json
    {
        "apiVersion": "2017-07-01-preview",
        "type": "Microsoft.ServiceFabric/clusters",
        "name": "[parameters('clusterName')]",
        "location": "[parameters('clusterLocation')]",
        ...
    }
    ```

2. Now enable repair manager service by adding the following `addonFeaturres` section after the `fabricSettings` section as shown below:

    ```json
    "fabricSettings": [
        ...      
        ],
        "addonFeatures": [
            "RepairManager"
        ],
    ```

3. Once you have updated your cluster template with these changes, apply them and let the upgrade complete. Once completed, you can now see the repair manager system service running in your cluster, which is called `fabric:/System/RepairManagerService`, under system services section in the Service Fabric explorer. 

#### Standalone On-Premise Clusters

> [!NOTE]
> Support for standalone clusters is coming later.

### Disable automatic Windows Update on all nodes

Automatic Windows updates may lead to availability loss as multiple cluster nodes can restart at the same time. The patch orchestration app, by default, tries to disable the automatic Windows Update on each cluster node. However, if the settings are managed by an administrator or group policy, we recommend setting the Windows Update policy to “Notify before Download” explicitly.

### Optional: Enable Windows Azure Diagnostics

Logs for the patch orchestration app collect locally on each of the cluster nodes. We recommend configuring Windows Azure Diagnostics (WAD) to upload logs from all nodes to a central location.

Steps for enabling WAD are detailed [here.](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-how-to-setup-wad)

Logs for the patch orchestration app would be generated on the following fixed provider IDs:

- e39b723c-590c-4090-abb0-11e3e6616346
- fc0028ff-bfdc-499f-80dc-ed922c52c5e9
- 24afa313-0d3b-4c7c-b485-1047fd964b60
- 05dc046c-60e9-4ef7-965e-91660adffa68

Inside the `WadCfg` section in the Azure Resource Manager template, add the following section: 

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
> If your Service Fabric cluster has multiple node types, then the above
section has to be added for all the `WadCfg` sections.

## Download the app package

Download the application from [Download
link](https://go.microsoft.com/fwlink/P/?linkid=849590)

## Configure the app

The behavior of the patch orchestration app can be configured to meet your needs.  Override the default values by passing in the application parameter during application create/update.  Application parameters can be provided by specifying `ApplicationParameter` to the  `Start-ServiceFabricApplicationUpgrade` or `New-ServiceFabricApplication`cmdlets.

|**Parameter**        |**Type**                          | **Details**|
|:-|-|-|
|MaxResultsToCache    |Long                              | Maximum number of Windows Update results histories, which should be cached. <br>Default value is 3000 assuming <br> - Number of nodes are 20 <br> - Number of updates happening on a node per month is 5 <br> - Number of results per operation can be 10 <br> - And results for past 3 months should be stored |
|TaskApprovalPolicy   |Enum <br> { NodeWise, UpgradeDomainWise }                          |TaskApprovalPolicy indicates policy to be used by CoordinatorService to install windows updates across the Service Fabric cluster nodes<br>                         Allowed values are: <br><br>                                                           <b>NodeWise</b> - Windows Update is installed one node at a time <br>                                                           <b>UpgradeDomainWise</b> - Windows Update would be installed one upgrade domain at a time (at max all the nodes belonging to an upgrade domain can go for Windows Update)
|LogsDiskQuotaInMB   |Long  <br> (Default: 1024)               |Maximum size of patch orchestration app logs in MB, which can be persisted locally on node
| WUQuery               | string<br>(Default: "IsInstalled=0")                | Query to get windows updates, For more information, see [WuQuery.](https://msdn.microsoft.com/library/windows/desktop/aa386526(v=vs.85).aspx)
| InstallWindowsOSOnlyUpdates | Bool <br> (default: True)                 | This flag allows windows OS updates to be installed.            |
| WUOperationTimeOutInMinutes | Int <br>(Default: 90)                   | Specifies the timeout for any Windows Update operation (search/ download/ install). If operation is not completed within the specified timeout, it is aborted.       |
| WURescheduleCount     | Int <br> (Default: 5)                  | The maximum number of times the service would reschedule the Windows Update in case operation fails persistently          |
| WURescheduleTimeInMinutes | Int <br>(Default: 30) | The interval at which service would reschedule the Windows Update in case failure persists |
| WUFrequency           | Comma-separated string (Default: "Weekly, Wednesday, 7:00:00")     | The frequency for installing Windows Update. The format and Possible Values are as below <br>-   Monthly,DD,HH:MM:SS Ex: Monthly,5,12:22:32 <br> -   Weekly,DAY,HH:MM:SS Ex: Weekly, Tuesday, 12:22:32  <br> -   Daily, HH:MM:SS Ex: Daily, 12:22:32  <br> -  None - Indicates that Windows Update shouldn't be done  <br><br> NOTE: All the times are in UTC|
| AcceptWindowsUpdateEula | Bool <br>(Default: true) | By setting this flag, application accepts EULA for Windows Update on behalf of the owner of the machine.              |

> [!TIP]
> If you want first Windows Update to happen immediately, set `WUFrequency` relative to application deployment time.
<br>For example: If you've a five node test cluster, and planning to deploy the app at around 5:00 pm UTC. Assuming the application upgrade/deployment would take 30 minutes at max, set the WUFrequency as "Daily, 17:30:00"

## Deploy the app

1. Finish all the prerequisite steps to prepare the cluster.
2. Deploy the patch orchestration application as you would any other Service Fabric app.  Deployment can be done with PowerShell using the steps mentioned [here.](https://docs.microsoft.com/azure/service-fabric/service-fabric-deploy-remove-applications)
3. To configure the application at time of deployment pass the `ApplicationParamater` to the cmdlet `New-ServiceFabricApplication`.  For your convenience, we’ve provided script Deploy.ps1 along with our application. To use the script:

    - Connect to Service Fabric cluster using `Connect-ServiceFabricCluster`
    - Execute the powershell script Deploy.ps1 with appropriate `ApplicationParameter` value

> [!NOTE]
> Keep the script and application folder PatchOrchestrationApplication in same directory.

## Upgrade the app

To upgrade an existing patch orchestration app using PowerShell, refer to the application upgrade steps mentioned [here.](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-upgrade-tutorial-powershell)

For only changing the application parameters of the application, provide `ApplicationParamater` to cmdlet `Start-ServiceFabricApplicationUpgrade` with existing application version.

## Remove the app

To remove the application, refer to the steps mentioned [here.](https://docs.microsoft.com/azure/service-fabric/service-fabric-deploy-remove-applications)

For your convenience, we have provided script Undeploy.ps1 along with our application. To use the script:
    - Connect to Service Fabric cluster using ```Connect-ServiceFabricCluster```
    - Execute the powershell script Undeploy.ps1

> [!NOTE]
> Keep the script and application folder PatchOrchestrationApplication in same directory.

## View the Windows Update results

The patch orchestration app exposes REST APIs to display the historical results to the user.
Example of result json:
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
If no update has been scheduled yet, the result json would be empty.

Windows Update results can be queried by logging in to the cluster, and then finding out the replica address for the primary of coordinator service, and hitting the url from the browser.
http://&lt;REPLICA-IP&gt;:&lt;ApplicationPort&gt;/PatchOrchestrationApplication/v1/GetWindowsUpdateResults
The REST endpoint for CoordinatorService has a dynamic port, to check the exact URL refer to Service Fabric explorer.
For example, results would be available at
`http://10.0.0.7:20000/PatchOrchestrationApplication/v1/GetWindowsUpdateResults`
![Image of Rest Endpoint](media/service-fabric-patch-orchestration-application/Rest_Endpoint.png)


You can access the URL from outside of the cluster as well, if the reverse proxy is enabled on the cluster.
Endpoint that needs to be hit:
http://&lt;SERVERURL&gt;:&lt;REVERSEPROXYPORT&gt;/PatchOrchestrationApplication/CoordinatorService/v1/GetWindowsUpdateResults
Reverse proxy can be enabled on the cluster by following the steps [here.](https://docs.microsoft.com/azure/service-fabric/service-fabric-reverseproxy) 

> 
> [!WARNING]
> Once Reverse Proxy is configured, all micro services in the cluster that expose 
an HTTP endpoint are addressable from outside the cluster.

## Diagnostics / Health events

### Collecting patch orchestration app Logs

Patch orchestration app logs collect as part of Service Fabric logs. Until that time logs can be collected using one of the following ways.

#### Locally on each node

Logs are collected locally on each Service Fabric cluster node. The location to access the logs is
*\[Service Fabric\_Installation\_Drive\]:\\PatchOrchestrationApplication\\logs*.

For example, if Service Fabric was installed on “D” drive, the path would be *D:\\PatchOrchestrationApplication\\logs*.

#### Central Location

If WAD is configured as part of prerequisite steps, then logs for patch orchestration app would be available in Azure Storage.

### Health Reports

The patch orchestration app also publishes health reports against the CoordinatorService or NodeAgentService in following cases.

#### Windows Update operation failed

If Windows Update operation fails on a node, a health report against the NodeAgentService would be generated. Details of the health report would contain the problematic node name.

The report would be automatically cleared off once patching is done successfully on the problematic node.

#### Node Agent NTService is down

If NodeAgentNTService is down on a node, a warning level health report is generated against NodeAgentService.

#### repair manager service is not enabled

If the repair manager service was not found on the cluster, a warning level health report is generated for CoordinatorService.

## Frequently Asked questions:

Q. **I see my Cluster in error state when patch orchestration app is running**.

A. Patch orchestration app would disable and/or restart nodes, during installation process, it can temporarily result in health of the cluster going down.

Based on the policy for the application, either one node can go down during a patching operation OR an entire upgrade domain can go down simultaneously.

Do note that by the end of Windows Update installation, the nodes would be re-enabled post restart.

For example, the cluster went to error state temporarily due to 2 down nodes and MaxPercentageUnhealthNodes policy was violated. It's a temporary error until patching operation is ongoing.

![Image of Unhealthy cluster](media/service-fabric-patch-orchestration-application/MaxPercentage_causing_unhealthy_cluster.png)

In case the issue persists, refer to the troubleshooting section.

Q. **Can I use patch orchestration app for standalone clusters?**

A. Not yet, support for standalone clusters is coming soon.

Q. **Patch orchestration app is in warning state**

A. Check if a health report posted against the application is the root cause. Usually the warning would contain detail of the problem. Application is expected to auto recover from this state in case the issue is transient.

Q. **My cluster is unhealthy. However I need to do OS update urgently**

A. Patch orchestration app does not install updates while the cluster is unhealthy. Try to bring your cluster to healthy state for unblocking the patch orchestration app workflow.

Q. **Why does patching across cluster take so long to run?**

A. The time taken by patch orchestration app is mostly dependent on following factors:

- Policy of CoordinatorService - Default policy of `NodeWise` results in patching only one node at a time, esp. in case of bigger clusters we recommend using `UpgradeDomainWise` policy to achieve faster patching across cluster.
- Number of updates available for download and install - Avg. time taken for downloading and installing an update should not exceed couple of hours.
- Performance of the VM and network bandwidth.

## Disclaimers

- Patch orchestration app accepts EULA of Windows Update on
    behalf of user. The setting can optionally be
    turned off in the configuration of the application.

- Patch orchestration app collects telemetry to track 
    usage and performance.
    Application’s telemetry follows the setting
    of Service Fabric runtime’s telemetry setting (which is on by
    default).

## Troubleshooting help

### Node not coming back to Up state

**Node could be stuck in Disabling state**
This can happen when a node scheduled for operation, cannot be disabled due to pending safety check. To remedy this situation, ensure that enough nodes are available in healthy state.

**Node could be stuck in Disabled state due to following reason**

- Node was disabled manually.
- Node was disabled due to an ongoing Azure infrastructure job.
- Node was disabled temporarily by the patch orchestration app to patch the node.

**Node could be stuck in Down state due to following reason**

- Node was put in down state manually.
- Node is undergoing restart (could be triggered by patch orchestration app).
- Node is down due to faulty VM/Machine or network connectivity issues.

### Updates were skipped on some nodes

The Patch orchestration app tries to install Windows Update as per rescheduling policy. Service would try to recover the node and skip the update as per the application policy.

In such case, a warning level health report would be generated against the Node Agent Service. The result for Windows Update would also contain possible failure reason.

### Health of the cluster goes to error while update was getting installed

In case, a bad Windows Update brings down the health of application/cluster on a particular node or upgrade domain, patch orchestration app does not continue with any subsequent Windows Update operation until the cluster becomes healthy again.

Administrator has to intervene and understand why a Windows Update is causing health of the application/cluster to go bad.
