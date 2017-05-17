---
title: Azure Service Fabric Patch Orchestration Application | Microsoft Docs
description: Application to automate OS pactching on a Service Fabric cluster.
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

# Application to patch Windows OS in your Service Fabric cluster

Patch Orchestration Application is a Service Fabric application, that allows you
to automate OS patching on a Service Fabric cluster on Azure or
on-premise, without downtime.

Patch Orchestration Application includes following salient features:

1. **Automatic OS Update Installation**: Patch Orchestration Application ensures
    that updates are automatically downloaded and installed, node is rebooted as applicable.
    This is done on all the cluster nodes without downtime.

1. **Cluster Aware Patching and Health Integration**: Patch Orchestration Application, 
    while applying updates, monitors the health of the cluster as it moves 
    ahead updating one node at a time or one upgrade domain at a time. 
    If at any time it detects health of the cluster going down due 
    to patching process, it stops the process to prevent aggravating the problem.

1. **Support all Service Fabric clusters**: The application is generic enough to
    work in both Azure Service Fabric clusters and standalone clusters.
    > [!NOTE]
    > Support for standalone cluster is coming soon.

## Link to download the application package

Download the application from [Download
link](https://go.microsoft.com/fwlink/P/?linkid=849590)

## Internal details of the application

Patch Orchestration Application comprises of following subcomponents:

- **Coordinator Service**: is a stateful service. The service is
    responsible for
    - Coordinating the Windows Update job on the entire cluster.
    - Stores the result of completed Windows Update operations.
- **Node Agent Service**: is a stateless service, it runs on all
    service fabric cluster nodes. The service is responsible for
    - Bootstrapping of Node Agent NTService.
    - Monitoring the Node Agent NTService.
- **Node Agent NTService**: is a Windows NT service. Node Agent
    NTService runs at higher privileges (SYSTEM). In contrast, Node
    Agent Service and Coordinator Service run at a lower-level
    privilege (NETWORK SERVICE). The service is responsible for
    performing following Windows Update jobs on all the cluster nodes.
    - Disabling automatic Windows Update on the node.
    - Download, installation of Windows Updates as per the policy user
        has provided.
    - Restarting the machine post Windows Update installation
    - Uploading the result of Windows Update to Coordinator Service.
    - Report health report in case operation has failed after exhausting all retries.

> [!NOTE]
> Patch Orchestration Application uses Service Fabric system
service **Repair Manager**, to disable/enable the node and
performing health checks. The repair task created by Patch
Orchestration Application tracks the Windows
Update progress for each node.

## Prerequisites for using the application

### Ensure Service Fabric version is 5.5 or above

Patch Orchestration Application can be run on clusters having Service
Fabric runtime version v5.5 or above.

### Enable Repair Manager service (if not running already)

Patch Orchestration Application requires Repair Manager system service to be
enabled on the cluster.

#### Service Fabric clusters on Azure

Azure clusters in Silver durability tier would have Repair Manager enabled by default. Azure cluster in Gold durability tier may or may not have Repair Manager enabled, depending on how long ago those clusters were created. While Azure cluster in Bronze durability tier, by default, does not have Repair Manager service enabled. 

You can use the [Azure Resource Manager template](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-creation-via-arm) to enable Repair Manager service on their new/ existing Service Fabric clusters, in case you do not see it running already under the system services section in the Service Fabric explorer.

First, get the template for the cluster that you want to deploy. You can either use the sample templates or create a custom Resource Manager template. You can then enable the Repair Manager by using the following steps:

1. First check that the `apiversion` is set to `2017-07-01-preview` for the `Microsoft.ServiceFabric/clusters` resource as shown in the following snippet. If it is different then you need to update the `apiVersion` to the value `2017-07-01-preview`

    ```json
    {
        "apiVersion": "2017-07-01-preview",
        "type": "Microsoft.ServiceFabric/clusters",
        "name": "[parameters('clusterName')]",
        "location": "[parameters('clusterLocation')]",
        ...
    }
    ```

2. Now enable Repair Manager service by adding the following `addonFeaturres` section after the `fabricSettings` section as shown below

    ```json
    "fabricSettings": [
        ...      
        ],
        "addonFeatures": [
            "RepairManager"
        ],
    ```

3. Once you have updated your cluster template with these changes, apply them and let the upgrade complete. Once completed, you can now see the Repair Manager system service running in your cluster, which is called `fabric:/System/RepairManagerService`, under system services section in the Service Fabric explorer. 

#### Standalone On-Premise Clusters

> [!NOTE]
> Support for Standalone cluster is coming soon

### Disable Automatic Windows Update on all nodes.

Having automatic Windows Update enabled on Service Fabric cluster may
lead to availability loss as multiple nodes can restart at the same time to complete the update.

Patch Orchestration Application, by default tries to disable the automatic Windows
Update on each cluster node.

However, in case the settings are managed by administrator/ group policy, we
recommend setting the Windows Update policy to “Notify before Download”
explicitly.


### Optional: Enable Windows Azure Diagnostics

In coming days, logs for Patch Orchestration Application would be collected as part of the Service Fabric logs itself. However untill then, logs would get collected locally on each of the cluster nodes. We recommend configuring Windows Azure Diagnostics (WAD) to have the logs uploaded from all nodes to a central location.

Steps for enabling WAD are detailed [here.](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-how-to-setup-wad)

Logs for Patch Orchestration Application would be generated on following fixed
provider IDs.

- e39b723c-590c-4090-abb0-11e3e6616346
- fc0028ff-bfdc-499f-80dc-ed922c52c5e9
- 24afa313-0d3b-4c7c-b485-1047fd964b60
- 05dc046c-60e9-4ef7-965e-91660adffa68

Inside "WadCfg" section in Azure Resource Manager template, add the following section: 

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
> In case your Service Fabric cluster comprises of multiple node types, then the above
section has to be added for all the “WadCfg” sections.

## Configuring the application

Following are the configurations, which can be set by the user to tweak
the behavior of Patch Orchestration Application as per their needs.

One can override the default values by passing in the application parameter during application create/update. 
Application parameters can be provided by specifying `ApplicationParameter` to cmdlet 
`Start-ServiceFabricApplicationUpgrade` or `New-ServiceFabricApplication`

|**Parameter**        |**Type**                          | **Details**|
|:-|-|-|
|MaxResultsToCache    |Long                              | Maximum number of Windows Update results histories, which should be cached. <br>Default value is 3000 assuming <br> - Number of nodes are 20 <br> - Number of updates happening on a node per month is 5 <br> - Number of results per operation can be 10 <br> - And results for past 3 months should be stored |
|TaskApprovalPolicy   |Enum <br> { NodeWise, UpgradeDomainWise }                          |TaskApprovalPolicy indicates policy to be used by CoordinatorService to install windows updates across the Service Fabric cluster nodes<br>                         Allowed values are: <br><br>                                                           <b>NodeWise</b> - Windows Update is installed one node at a time <br>                                                           <b>UpgradeDomainWise</b> - Windows Update would be installed one upgrade domain at a time (at max all the nodes belonging to an upgrade domain can go for Windows Update)
|LogsDiskQuotaInMB   |Long  <br> (Default: 1024)               |Maximum size of Patch Orchestration Application logs in MB, which can be persisted locally on node
| WUQuery               | string<br>(Default: "IsInstalled=0")                | Query to get windows updates, For more information, see [WuQuery.](https://msdn.microsoft.com/library/windows/desktop/aa386526(v=vs.85).aspx)
| InstallWindowsOSOnlyUpdates | Bool <br> (default: True)                 | This flag allows windows OS updates to be installed.            |
| WUOperationTimeOutInMinutes | Int <br>(Default: 90)                   | Specifies the timeout for any Windows Update operation (search/ download/ install). If operation is not completed within the specified timeout, it is aborted.       |
| WURescheduleCount     | Int <br> (Default: 5)                  | This configuration decides the maximum number of times the service would reschedule the Windows Update in case operation fails persistently          |
| WURescheduleTimeInMinutes | Int <br>(Default: 30) | This configuration decides the interval at which service would reschedule the Windows Update in case failure persists |
| WUFrequency           | Comma-separated string (Default: "Weekly, Wednesday, 7:00:00")     | The frequency for installing Windows Update. The format and Possible Values are as below <br>-   Monthly,DD,HH:MM:SS Ex: Monthly,5,12:22:32 <br> -   Weekly,DAY,HH:MM:SS Ex: Weekly, Tuesday, 12:22:32  <br> -   Daily, HH:MM:SS Ex: Daily, 12:22:32  <br> -  None - Indicates that Windows Update shouldn't be done  <br><br> NOTE: All the times are in UTC|
| AcceptWindowsUpdateEula | Bool <br>(Default: true) | By setting this flag, application accepts EULA for Windows Update on behalf of owner of machine.              |


## Steps to deploy the application

1. Finish all prerequisite steps to prepare the cluster.
1. Deploy the application - This can be done from
    PowerShell using the steps mentioned [here.](https://docs.microsoft.com/azure/service-fabric/service-fabric-deploy-remove-applications)
1. For configuring the application at time of deployment use `ApplicationParamater` to cmdlet `New-ServiceFabricApplication`

    For ease of user, we’ve provided script Deploy.ps1 along with our
    application. To use it.

    - Connect to Service Fabric cluster using `Connect-ServiceFabricCluster`
    - Execute the powershell script Deploy.ps1 with appropriate `ApplicationParameter` value

> [!NOTE]
> Keep the script and application folder PatchOrchestrationApplication in same directory.

## Steps to upgrade the application

For upgrading an existing Patch Orchestration Application using
PowerShell, refer to the application upgrade steps mentioned [here.](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-upgrade-tutorial-powershell)

For only changing the application parameters of the application, provide `ApplicationParamater` to cmdlet `Start-ServiceFabricApplicationUpgrade` with existing application version.

## Steps to remove the application

For removing the application, refer to steps mentioned [here.](https://docs.microsoft.com/azure/service-fabric/service-fabric-deploy-remove-applications)

For ease of user, we have provided script Undeploy.ps1 along with our
application. To use it.
    - Connect to Service Fabric cluster using ```Connect-ServiceFabricCluster```
    - Execute the powershell script Undeploy.ps1

> [!NOTE]
> Keep the script and application folder PatchOrchestrationApplication in same directory.

## Viewing the Windows Update results

Patch Orchestration Application exposes REST API to display the historical
results to the user.

Windows Update results can be queried by logging to the cluster, and then finding out the replica address for the primary of coordinator service, and hitting the url from the browser.
http://&lt;REPLICA-IP&gt;:&lt;ApplicationPort&gt;/PatchOrchestrationApplication/v1/GetWindowsUpdateResults
The REST endpoint for CoordinatorService has dynamic port,
to check the exact url refer to ServiceFabric explorer.
Ex: For below example, results would be available at
`http://10.0.0.7:20000/PatchOrchestrationApplication/v1/GetWindowsUpdateResults`
![Image of Rest Endpoint](media/service-fabric-patch-orchestration-application/Rest_Endpoint.png)


User can access the URL from outside of the cluster as well, in case reverse proxy is enabled on the cluster.
Endpoint that needs to be hit:
http://&lt;SERVERURL&gt;:&lt;REVERSEPROXYPORT&gt;/PatchOrchestrationApplication/CoordinatorService/v1/GetWindowsUpdateResults
Reverse proxy can be enabled on the cluster by following the steps [here.](https://docs.microsoft.com/azure/service-fabric/service-fabric-reverseproxy) 

> 
> [!WARNING]
> Once Reverse Proxy is configured, all micro services in the cluster that expose 
an HTTP endpoint are addressable from outside the cluster.

## Diagnostics / Health events

### Collecting Patch Orchestration Application Logs

In coming days Patch Orchestration Application logs would be collected as part of Service Fabric logs.
Until that time logs can be collected using one of the following ways

#### Locally on each node

Logs are collected locally on each Service Fabric cluster node. The location to
access the logs is
\[Service Fabric\_Installation\_Drive\]:\\PatchOrchestrationApplication\\logs

Ex: If Service Fabric was installed on “D” drive, the path would be
D:\\PatchOrchestrationApplication\\logs

#### Central Location

If WAD is configured as part of prerequisite steps, then logs for
Patch Orchestration Application would be available in Azure Storage.

### Health Reports

Patch Orchestration Application also publishes
health reports against the CoordinatorService or NodeAgentService in
following cases

#### Windows Update operation failed

If Windows Update operation fails on a node, health
report against the NodeAgentService would be generated.
Details of the health report would contain the problematic node name.

The report would be automatically cleared off once patching is done
successfully on the problematic node.

#### Node Agent NTService is down

If NodeAgentNTService is down on a node, warning level health report
is generated against NodeAgentService

#### Repair Manager is not enabled

If Repair Manager service was not found on the cluster, warning level health report is generated for CoordinatorService.

## Frequently Asked questions:

Q. **I see my Cluster in error state when Patch Orchestration Application
is running**.

A. Patch Orchestration Application
would disable and/or restart nodes, during installation process, it can temporarily result in health
of the cluster going down.

Based on policy for application, either
one node can go down during a patching operation OR an entire upgrade
domain can go down simultaneously.

Do note that by the end of Windows Update installation, the nodes would
be re-enabled post restart.

Ex: In below case, cluster went to error state temporarily due to 2 down nodes and
MaxPercentageUnhealthNodes policy got violated. It's a temporary error until patching operation is ongoing.

![Image of Unhealthy cluster](media/service-fabric-patch-orchestration-application/MaxPercentage_causing_unhealthy_cluster.png)

In case issue persists, refer to Troubleshooting section

Q. **Can I use Patch Orchestration Application for standalone clusters?**

A. Not yet, support for standalone clusters is coming soon.

Q. **Patch Orchestration Application is in warning state**

A. Check if a health report posted against the
application is the root cause. Usually the warning would contain detail of the problem.
Application is expected to auto recover from this state in case the issue is transient.

Q. **My cluster is unhealthy. However I need to do OS update urgently**

A. Patch Orchestration Application does not install updates while the
cluster is unhealthy.
Try to bring your cluster to healthy state for unblocking the Patch Orchestration Application workflow.

Q. **Why does patching across cluster take so long to run?**

A. The time taken by Patch Orchestration Application is mostly dependent
on following factors:

- Policy of CoordinatorService - Default policy of `NodeWise` results in patching only one node at a time, esp. in case of bigger clusters we recommend using `UpgradeDomainWise` policy to achieve faster patching across cluster.
- Number of updates available for download and install - Avg. time taken for downloading and installing an update should not exceed couple of hours.
- Performance of the VM and network bandwidth.

## Disclaimers

- Patch Orchestration Application accepts EULA of Windows Update on
    behalf of user. The setting can optionally be
    turned off in the configuration of the application.

- Patch Orchestration Application collects telemetry to track 
    usage and performance.
    Application’s telemetry follows the setting
    of Service Fabric runtime’s telemetry setting (which is on by
    default).

## Troubleshooting help

### Node not coming back to Up state

**Node could be stuck in Disabling state**
This can happen when a node scheduled for operation, cannot be disabled
due to pending safety check. To remedy this situation, ensure that enough
nodes are available in healthy state.

**Node could be stuck in Disabled state due to following reason**

- Node was disabled manually.
- Node was disabled due to an ongoing Azure infrastructure job.
- Node was disabled temporarily by the Patch Orchestration Application to patch the node.

**Node could be stuck in Down state due to following reason**

- Node was put in down state manually.
- Node is undergoing restart (could be triggered by Patch Orchestration Application).
- Node is down due to faulty VM/Machine or network connectivity issues.

### Updates were skipped on some nodes

Patch Orchestration Application tries to install Windows Update as per
rescheduling policy. Service would try to recover the node and skip the update as per the application policy.

In such case, a warning level health report would be generated against the Node Agent Service.
The result for Windows Update would also contain possible failure reason.

### Health of the cluster goes to error while update was getting installed

In case, a bad Windows Update brings down the health of
application/cluster on a particular node or upgrade domain, Patch Orchestration Application does not continue with any
subsequent Windows Update operation until the cluster becomes healthy
again.

Administrator has to intervene and understand why a Windows Update is causing
health of the application/cluster to go bad.
