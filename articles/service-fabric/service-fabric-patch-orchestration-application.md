---
title: Azure Service Fabric Patch Orchestration Application | Microsoft Docs
<<<<<<< HEAD
description: Application to automate operating system patching on a Service Fabric cluster.
=======
description: Application to automate OS patching on a Service Fabric cluster.
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf
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

<<<<<<< HEAD
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
=======
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
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

## Prerequisites

<<<<<<< HEAD
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
=======
### The cluster runs Service Fabric version 5.5 or later

The patch orchestration app must be run on clusters having Service Fabric runtime version v5.5 or later.

### Enable repair manager service (if not running already)

The patch orchestration app requires the repair manager system service to be enabled on the cluster.

#### Enable the repair manager service on Azure clusters

Azure clusters in silver durability tier have the repair manager service enabled by default. Azure cluster in gold durability tier may or may not have the repair manager service enabled, depending on when those clusters were created. Azure clusters in bronze durability tier, by default, do not have repair manager service enabled. If the service is already enabled, you can see it running under the system services section in the Service Fabric explorer.

You can use the [Azure Resource Manager template](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-via-arm) to enable the repair manager service on new and existing Service Fabric clusters.  Get the template for the cluster that you want to deploy. You can either use the sample templates or create a custom Resource Manager template. 

To enable the repair manager service:

1. First check that the `apiversion` is set to `2017-07-01-preview` for the `Microsoft.ServiceFabric/clusters` resource as shown in the following snippet. If it is different, then you need to update the `apiVersion` to the value `2017-07-01-preview`:
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

    ```json
    {
        "apiVersion": "2017-07-01-preview",
        "type": "Microsoft.ServiceFabric/clusters",
        "name": "[parameters('clusterName')]",
        "location": "[parameters('clusterLocation')]",
        ...
    }
    ```

<<<<<<< HEAD
2. Enable the Repair Manager service by adding the following `addonFeatures` section after the `fabricSettings` section:
=======
2. Now enable repair manager service by adding the following `addonFeaturres` section after the `fabricSettings` section as shown below:
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

    ```json
    "fabricSettings": [
        ...      
        ],
        "addonFeatures": [
            "RepairManager"
        ],
    ```

<<<<<<< HEAD
3. After you have updated your cluster template with these changes, apply them and let the upgrade complete. You can now see the Repair Manager system service running in your cluster. It is called `fabric:/System/RepairManagerService` in the system services section in the Service Fabric Explorer. 
=======
3. Once you have updated your cluster template with these changes, apply them and let the upgrade complete. Once completed, you can now see the repair manager system service running in your cluster, which is called `fabric:/System/RepairManagerService`, under system services section in the Service Fabric explorer. 
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

### Standalone on-premises clusters

> [!NOTE]
<<<<<<< HEAD
> Support for standalone clusters is coming.

### Disable automatic Windows Update on all nodes

If automatic Windows Update is enabled on a Service Fabric cluster, availability loss might occur because multiple nodes can restart at the same time to complete an update. By default, Patch Orchestration Application tries to disable automatic Windows Update on each cluster node. If the settings are managed by administrator/group policy, we recommend that you set the Windows Update policy to “Notify before Download” explicitly.

### Optional: Enable Windows Azure Diagnostics

Until logs for the Patch Orchestration Application are collected as part of the Service Fabric log itself, they are collected locally on each of the cluster nodes. We recommend configuring Windows Azure Diagnostics to have the logs uploaded from all nodes to a central location.
=======
> Support for standalone clusters is coming later.

### Disable automatic Windows Update on all nodes

Automatic Windows updates may lead to availability loss as multiple cluster nodes can restart at the same time. The patch orchestration app, by default, tries to disable the automatic Windows Update on each cluster node. However, if the settings are managed by an administrator or group policy, we recommend setting the Windows Update policy to “Notify before Download” explicitly.

### Optional: Enable Windows Azure Diagnostics

Logs for the patch orchestration app collect locally on each of the cluster nodes. We recommend configuring Windows Azure Diagnostics (WAD) to upload logs from all nodes to a central location.
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

For information on enabling Windows Azure Diagnostics, see [Collect logs by using Azure Diagnostics](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-how-to-setup-wad).

<<<<<<< HEAD
Logs for the Patch Orchestration Application are generated on the following fixed provider IDs:
=======
Logs for the patch orchestration app would be generated on the following fixed provider IDs:
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

- e39b723c-590c-4090-abb0-11e3e6616346
- fc0028ff-bfdc-499f-80dc-ed922c52c5e9
- 24afa313-0d3b-4c7c-b485-1047fd964b60
- 05dc046c-60e9-4ef7-965e-91660adffa68

<<<<<<< HEAD
Inside the "WadCfg" section in the Resource Manager template, add the following section: 
=======
Inside the `WadCfg` section in the Azure Resource Manager template, add the following section: 
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

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
<<<<<<< HEAD
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
=======
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
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

    For ease of use, we’ve provided the script Deploy.ps1 along with the application. To use it:

    - Connect to a Service Fabric cluster by using `Connect-ServiceFabricCluster`.
    - Execute the PowerShell script Deploy.ps1 with the appropriate `ApplicationParameter` value.

> [!NOTE]
> Keep the script and application folder PatchOrchestrationApplication in the same directory.

## Upgrade the application

<<<<<<< HEAD
To upgrade an existing Patch Orchestration Application by using PowerShell, follow the steps in [Service Fabric application upgrade using PowerShell](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-upgrade-tutorial-powershell).

To change only the parameters of the application, provide `ApplicationParameter` to the cmdlet `Start-ServiceFabricApplicationUpgrade` with the existing application version.
=======
## Upgrade the app

To upgrade an existing patch orchestration app using PowerShell, refer to the application upgrade steps mentioned [here.](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-upgrade-tutorial-powershell)
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

## Remove the application

<<<<<<< HEAD
To remove the application, follow the steps in [Deploy and remove applications using PowerShell](https://docs.microsoft.com/azure/service-fabric/service-fabric-deploy-remove-applications).

For ease of use, we've provided the script Undeploy.ps1 along with the application. To use it:

=======
## Remove the app

To remove the application, refer to the steps mentioned [here.](https://docs.microsoft.com/azure/service-fabric/service-fabric-deploy-remove-applications)

For your convenience, we have provided script Undeploy.ps1 along with our application. To use the script:
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf
    - Connect to Service Fabric cluster using ```Connect-ServiceFabricCluster```
    - Execute the powershell script Undeploy.ps1

> [!NOTE]
> Keep the script and the application folder PatchOrchestrationApplication in the same directory.

## View the Windows Update results

<<<<<<< HEAD
The Patch Orchestration Application exposes the REST API to display the historical results to the user.

Windows Update results can be queried by logging to the cluster. Then find out the replica address for the primary of the coordinator service, and hit the URL from the browser:
http://&lt;REPLICA-IP&gt;:&lt;ApplicationPort&gt;/PatchOrchestrationApplication/v1/GetWindowsUpdateResults.

The REST endpoint for CoordinatorService has a dynamic port. To check the exact URL, refer to Service Fabric Explorer. For the following example, the results would be available at
`http://10.0.0.7:20000/PatchOrchestrationApplication/v1/GetWindowsUpdateResults`.
=======
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
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

![Image of REST endpoint](media/service-fabric-patch-orchestration-application/Rest_Endpoint.png)

<<<<<<< HEAD

You can access the URL from outside of the cluster as well, if the reverse proxy is enabled on the cluster.
The endpoint that needs to be hit is
http://&lt;SERVERURL&gt;:&lt;REVERSEPROXYPORT&gt;/PatchOrchestrationApplication/CoordinatorService/v1/GetWindowsUpdateResults.

To enable the reverse proxy on the cluster, follow the steps in [Reverse proxy in Azure Service Fabric](https://docs.microsoft.com/azure/service-fabric/service-fabric-reverseproxy). 
=======
You can access the URL from outside of the cluster as well, if the reverse proxy is enabled on the cluster.
Endpoint that needs to be hit:
http://&lt;SERVERURL&gt;:&lt;REVERSEPROXYPORT&gt;/PatchOrchestrationApplication/CoordinatorService/v1/GetWindowsUpdateResults
Reverse proxy can be enabled on the cluster by following the steps [here.](https://docs.microsoft.com/azure/service-fabric/service-fabric-reverseproxy) 
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

> 
> [!WARNING]
> After the reverse proxy is configured, all micro services in the cluster that expose an HTTP endpoint are addressable from outside the cluster.

## Diagnostics/health events

<<<<<<< HEAD
### Collect Patch Orchestration Application logs

Patch Orchestration Application logs are collected as part of the Service Fabric log. Logs can be collected in two ways: locally on each node or in a central location.
=======
### Collecting patch orchestration app Logs

Patch orchestration app logs collect as part of Service Fabric logs. Until that time logs can be collected using one of the following ways.
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

#### Locally on each node

Logs are collected locally on each Service Fabric cluster node. The location to access the logs is
<<<<<<< HEAD
\[Service Fabric\_Installation\_Drive\]:\\PatchOrchestrationApplication\\logs.

For example, if Service Fabric was installed on drive D, the path would be 
D:\\PatchOrchestrationApplication\\logs.
=======
*\[Service Fabric\_Installation\_Drive\]:\\PatchOrchestrationApplication\\logs*.

For example, if Service Fabric was installed on “D” drive, the path would be *D:\\PatchOrchestrationApplication\\logs*.
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

#### Central location

<<<<<<< HEAD
If Windows Azure Diagnostics is configured as part of the prerequisite steps, logs for the Patch Orchestration Application are available in Azure storage.
=======
If WAD is configured as part of prerequisite steps, then logs for patch orchestration app would be available in Azure Storage.
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

### Health reports

<<<<<<< HEAD
The Patch Orchestration Application also publishes health reports against the Coordinator Service or the Node Agent Service in the following cases:

#### Windows Update operation failed

If a Windows Update operation fails on a node, a health report against the Node Agent Service is generated.
Details of the health report contain the problematic node name.

After patching is successfully completed on the problematic node, the report is automatically cleared.

#### Node Agent NTService is down

If the Node Agent NTService is down on a node, a warning-level health report is generated against the Node Agent Service.
=======
The patch orchestration app also publishes health reports against the CoordinatorService or NodeAgentService in following cases.

#### Windows Update operation failed

If Windows Update operation fails on a node, a health report against the NodeAgentService would be generated. Details of the health report would contain the problematic node name.

The report would be automatically cleared off once patching is done successfully on the problematic node.

#### Node Agent NTService is down

If NodeAgentNTService is down on a node, a warning-level health report is generated against NodeAgentService.
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

#### repair manager service is not enabled

<<<<<<< HEAD
If the Repair Manager service is not found on the cluster, a warning-level health report is generated for the Coordinator Service.
=======
If the repair manager service was not found on the cluster, a warning level health report is generated for CoordinatorService.
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

## Frequently asked questions

<<<<<<< HEAD
Q. **Why do I see my cluster in an error state when the Patch Orchestration Application is running?**

A. During the installation process, the Patch Orchestration Application disables and/or restarts nodes, which can temporarily result in the health of the cluster going down.

Based on the policy for Patch Orchestration Application, either one node can go down during a patching operation *or* an entire upgrade domain can go down simultaneously.

By the end of the Windows Update installation, the nodes are reenabled post restart.

In the following example, a cluster went to an error state temporarily because two nodes were down and the 
MaxPercentageUnhealthNodes policy was violated. The error is temporary until the patching operation is ongoing.
=======
Q. **I see my Cluster in error state when patch orchestration app is running**.

A. Patch orchestration app would disable and/or restart nodes, during installation process, it can temporarily result in health of the cluster going down.

Based on the policy for the application, either one node can go down during a patching operation OR an entire upgrade domain can go down simultaneously.

Do note that by the end of Windows Update installation, the nodes would be re-enabled post restart.

For example, the cluster went to error state temporarily due to 2 down nodes and MaxPercentageUnhealthNodes policy was violated. It's a temporary error until patching operation is ongoing.
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

![Image of unhealthy cluster](media/service-fabric-patch-orchestration-application/MaxPercentage_causing_unhealthy_cluster.png)

<<<<<<< HEAD
If the issue persists, refer to the Troubleshooting section.

Q. **Can I use the Patch Orchestration Application for standalone clusters?**
=======
In case the issue persists, refer to the troubleshooting section.

Q. **Can I use patch orchestration app for standalone clusters?**
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

A. No. Support for standalone clusters is coming.

<<<<<<< HEAD
Q. **Why is the Patch Orchestration Application in a warning state?**

A. Check to see if a health report posted against the application is the root cause. Usually, the warning contains details of the problem. If the issue is transient, the Patch Orchestration Application is expected to auto-recover from this state.
=======
Q. **Patch orchestration app is in warning state**

A. Check if a health report posted against the application is the root cause. Usually the warning would contain detail of the problem. Application is expected to auto recover from this state in case the issue is transient.
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

Q. **What can I do if my cluster is unhealthy and I need to do an urgent operating system update?**

<<<<<<< HEAD
A. The Patch Orchestration Application does not install updates while the cluster is unhealthy. Try to bring your cluster to a healthy state to unblock the Patch Orchestration Application workflow.
=======
A. Patch orchestration app does not install updates while the cluster is unhealthy. Try to bring your cluster to healthy state for unblocking the patch orchestration app workflow.
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

Q. **Why does patching across clusters take so long to run?**

<<<<<<< HEAD
A. The time needed by the Patch Orchestration Application is mostly dependent on the following factors:
=======
A. The time taken by patch orchestration app is mostly dependent on following factors:
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

- The policy of the Coordinator Service. 
- The default policy of `NodeWise`, which results in patching only one node at a time. Especially in the case of bigger clusters, we recommend that you use the `UpgradeDomainWise` policy to achieve faster patching across clusters.
- The number of updates available for download and install. 
- The average time needed to download and install an update, which should not exceed a couple of hours.
- The performance of the VM and network bandwidth.

## Disclaimers

<<<<<<< HEAD
- The Patch Orchestration Application accepts the EULA of the Windows update on behalf of the user. Optionally, the setting can be turned off in the configuration of the application.

- The Patch Orchestration Application collects telemetry to track usage and performance. Patch Orchestration Application telemetry follows the setting of the Service Fabric runtime telemetry setting (which is on by default).

## Troubleshooting
=======
- Patch orchestration app accepts EULA of Windows Update on
    behalf of user. The setting can optionally be
    turned off in the configuration of the application.

- Patch orchestration app collects telemetry to track 
    usage and performance.
    Application’s telemetry follows the setting
    of Service Fabric runtime’s telemetry setting (which is on by
    default).
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

### Node not coming back to up state

**The node might be stuck in a disabling state because**:

<<<<<<< HEAD
A safety check is pending. To remedy this situation, ensure that enough nodes are available in a healthy state.
=======
**Node could be stuck in Disabling state**
This can happen when a node scheduled for operation, cannot be disabled due to pending safety check. To remedy this situation, ensure that enough nodes are available in healthy state.
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

**The node might be stuck in a disabled state because**:

<<<<<<< HEAD
- The node was disabled manually.
- The node was disabled due to an ongoing Azure infrastructure job.
- The node was disabled temporarily by the Patch Orchestration Application to patch the node.
=======
- Node was disabled manually.
- Node was disabled due to an ongoing Azure infrastructure job.
- Node was disabled temporarily by the patch orchestration app to patch the node.
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

**The node might be stuck in a down state because**:

<<<<<<< HEAD
- The node was put in a down state manually.
- The node is undergoing a restart (which might be triggered by the Patch Orchestration Application).
- The node is down due to faulty VM/machine or network connectivity issues.

### Updates were skipped on some nodes

The Patch Orchestration Application tries to install a Windows update according to the rescheduling policy. Service would try to recover the node and skip the update as per the application policy.

In such a case, a warning-level health report is generated against the Node Agent Service. The result for the Windows update also contains the possible reason for the failure.
=======
- Node was put in down state manually.
- Node is undergoing restart (could be triggered by patch orchestration app).
- Node is down due to faulty VM/Machine or network connectivity issues.

### Updates were skipped on some nodes

The Patch orchestration app tries to install Windows Update as per rescheduling policy. Service would try to recover the node and skip the update as per the application policy.

In such case, a warning level health report would be generated against the Node Agent Service. The result for Windows Update would also contain possible failure reason.
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf

### Health of the cluster goes to error while the update installs

<<<<<<< HEAD
If a Windows update brings down the health of an application/cluster on a particular node or upgrade domain, the Patch Orchestration Application discontinues any subsequent Windows update operations until the cluster is healthy again.

An administrator has to intervene and determine why the Windows update is causing the health of the application/cluster to go bad.
=======
In case, a bad Windows Update brings down the health of application/cluster on a particular node or upgrade domain, patch orchestration app does not continue with any subsequent Windows Update operation until the cluster becomes healthy again.

Administrator has to intervene and understand why a Windows Update is causing health of the application/cluster to go bad.
>>>>>>> 0d80dc34be15e4c100c2a042e34dea3d591881bf
