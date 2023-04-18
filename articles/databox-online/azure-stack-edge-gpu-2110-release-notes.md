---
title: Azure Stack Edge 2110 release notes
description: Describes critical open issues and resolutions for the Azure Stack Edge running 2110 release.
services: databox
author: alkohli
 
ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 01/28/2022
ms.author: alkohli
---

# Azure Stack Edge 2110 release notes

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

The following release notes identify the critical open issues and the resolved issues for the 2110 release for your Azure Stack Edge devices. These release notes are applicable for Azure Stack Edge Pro GPU, Azure Stack Edge Pro R, and Azure Stack Edge Mini R devices. Features and issues that correspond to a specific model are called out wherever applicable.

The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they are added. Before you deploy your device, carefully review the information contained in the release notes.

This article applies to the **Azure Stack Edge 2110** release, which maps to software version number **2.2.1758.4034**. This software can be applied to your device if you are running at least Azure Stack Edge 2106 (2.2.1636.3457) software.

## What's new

The following new features are available in the Azure Stack Edge 2110 release. 

- **Windows updates and security fixes** - The [latest cumulative update (LCU) for Windows and September security fixes](https://support.microsoft.com/topic/september-14-2021-kb5005623-monthly-rollup-bcdb6598-517e-4d53-aa7c-dd7fcfdca204) were rolled into the updates package for Azure Stack Edge.
- **Remote support** - In this release, you can enable remote support on your Azure Stack Edge device to allow Microsoft Support to diagnose and remediate issues by accessing your device remotely. When you enable this feature, you provide consent for the level of access and the duration of access. For more information, see [Enable remote support and diagnostics for Azure Stack Edge](azure-stack-edge-gpu-remote-support-diagnostics-repair.md).
- **High-performance network virtual machines** - Beginning this release, high-performance network virtual machines can be deployed on your Azure Stack Edge device. For more information, see [Deploy high-performance network virtual machines on Azure Stack Edge](azure-stack-edge-gpu-deploy-virtual-machine-high-performance-network.md).
- **Certificates for Edge container registry and Kubernetes dashboard** - Certificates for Edge container registry and Kubernetes dashboard are now supported. You can create and upload certificates via the local UI. For more information, see [Kubernetes certificates](azure-stack-edge-gpu-certificates-overview.md#kubernetes-certificates) and [Upload Kubernetes certificates](azure-stack-edge-gpu-manage-certificates.md#upload-kubernetes-certificates).
- **Metallb in BGP mode** - Starting this release, you can configure load balancing on your Azure Stack Edge device using MetalLB via Border Gateway Protocol (BGP). Configuration is done by connecting to the PowerShell interface of the device and then running specific cmdlets. For more information, see [Configure load balancing with MetalLB on your Azure Stack Edge device](azure-stack-edge-gpu-configure-metallb-bgp-mode.md).

## Issues fixed in 2110 release

The following table lists the issues that were release noted in previous releases and fixed in the current release.

| No. | Feature | Issue | 
| --- | --- | --- |
|**1.**|Azure Arc enabled Kubernetes |For the GA release, Azure Arc enabled Kubernetes is updated from version 0.1.18 to 0.2.9. As the Azure Arc enabled Kubernetes update is not supported on Azure Stack Edge device, you will need to redeploy Azure Arc enabled Kubernetes.|
|**2.**|Azure Arc enabled Kubernetes|Azure Arc deployments are not supported if web proxy is configured on your Azure Stack Edge Pro device.|
|**3.**|IoT Edge |Modules deployed through IoT Edge can't use host network. | 
|**4.**|Kubernetes + update |Earlier software versions such as 2008 releases have a race condition update issue that causes the update to fail with ClusterConnectionException. |
|**5.**|Kubernetes Dashboard | *Https* endpoint for Kubernetes Dashboard with SSL certificate is not supported. | 
|**6.**|VMs |Static IP duplication check is added for VM management NIC during VNF deployment. Explicit error message is returned. | 
|**7.**|VMs |IP reservation check was removed for first four IP addresses in address space.  | 
|**8.**|Multi-Access Edge Compute |Fixed local Azure Resource Manager token expiration issue during VNF deployment. In earlier releases, when VHD download took a long time, the VNF deployment would fail as the Azure Resource Manager token would expire.  | 
|**9.**|Multi-Access Edge Compute |A timeout was added for Azure Resource Manager calls during VNF deployment. In earlier releases, VNF deployment took a long time, if Azure Resource Manager calls were not successful.   | 
|**10.**|Multi-Access Edge Compute |Multi-Access Edge Compute cleans up Azure Resource Manager template deployments after VHD download completes. In earlier releases, the user would hit deployment quota exceeded error after many VNF deployments. Default quota was 800 deployments per resource group.  | 



## Known issues in 2110 release

The following table provides a summary of known issues in the 2110 release.

| No. | Feature | Issue | Workaround/comments |
| --- | --- | --- | --- |
|**1.**|Preview features |For this release, the following features: Local Azure Resource Manager, VMs, Cloud management of VMs, Kubernetes cloud management, VPN for Azure Stack Edge Pro R and Azure Stack Edge Mini R, Multi-process service (MPS), and Multi-Access Edge Computing (MEC) for Azure Stack Edge Pro GPU  - are all available in preview.  |These features will be generally available in later releases. |
|**2.**|Certificates|Alerts related to signing chain certificates aren't removed from the portal even after uploading new signing chain certificates.| |


## Known issues from previous releases

The following table provides a summary of known issues carried over from the previous releases.

| No. | Feature | Issue | Workaround/comments |
| --- | --- | --- | --- |
| **1.** |Azure Stack Edge Pro + Azure SQL | Creating SQL database requires Administrator access.   |Do the following steps instead of Steps 1-2 in [Create-the-sql-database](../iot-edge/tutorial-store-data-sql-server.md#create-the-sql-database). <ol><li>In the local UI of your device, enable compute interface. Select **Compute > Port # > Enable for compute > Apply.**</li><li>Download `sqlcmd` on your client machine from [SQL command utility](/sql/tools/sqlcmd-utility). </li><li>Connect to your compute interface IP address (the port that was enabled), adding a ",1401" to the end of the address.</li><li>Final command will look like this: sqlcmd -S {Interface IP},1401 -U SA -P "Strong!Passw0rd".</li>After this, steps 3-4 from the current documentation should be identical. </li></ol> |
| **2.** |Refresh| Incremental changes to blobs restored via **Refresh** are NOT supported |For Blob endpoints, partial updates of blobs after a Refresh, may result in the updates not getting uploaded to the cloud. For example, sequence of actions such as:<ol><li>Create blob in cloud. Or delete a previously uploaded blob from the device.</li><li>Refresh blob from the cloud into the appliance using the refresh functionality.</li><li>Update only a portion of the blob using Azure SDK REST APIs.</li></ol>These actions can result in the updated sections of the blob to not get updated in the cloud. <br>**Workaround**: Use tools such as robocopy, or regular file copy through Explorer or command line, to replace entire blobs.|
|**3.**|Throttling|During throttling, if new writes to the device aren't allowed, writes by the NFS client fail with a "Permission Denied" error.| The error will show as below:<br>`hcsuser@ubuntu-vm:~/nfstest$ mkdir test`<br>mkdir: cannot create directory 'test': Permission denied​|
|**4.**|Blob Storage ingestion|When using AzCopy version 10 for Blob storage ingestion, run AzCopy with the following argument: `Azcopy <other arguments> --cap-mbps 2000`| If these limits aren't provided for AzCopy, it could potentially send a large number of requests to the device, resulting in issues with the service.|
|**5.**|Tiered storage accounts|The following apply when using tiered storage accounts:<ul><li> Only block blobs are supported. Page blobs are not supported.</li><li>There is no snapshot or copy API support.</li><li> Hadoop workload ingestion through `distcp` is not supported as it uses the copy operation heavily.</li></ul>||
|**6.**|NFS share connection|If multiple processes are copying to the same share, and the `nolock` attribute isn't used, you may see errors during the copy.​|The `nolock` attribute must be passed to the mount command to copy files to the NFS share. For example: `C:\Users\aseuser mount -o anon \\10.1.1.211\mnt\vms Z:`.|
|**7.**|Kubernetes cluster|When applying an update on your device that is running a Kubernetes cluster, the Kubernetes virtual machines will restart and reboot. In this instance, only pods that are deployed with replicas specified are automatically restored after an update.  |If you have created individual pods outside a replication controller without specifying a replica set, these pods won't be restored automatically after the device update. You will need to restore these pods.<br>A replica set replaces pods that are deleted or terminated for any reason, such as node failure or disruptive node upgrade. For this reason, we recommend that you use a replica set even if your application requires only a single pod.|
|**8.**|Kubernetes cluster|Kubernetes on Azure Stack Edge Pro is supported only with Helm v3 or later. For more information, go to [Frequently asked questions: Removal of Tiller](https://v3.helm.sh/docs/faq/).|
|**9.**|Kubernetes |Port 31000 is reserved for Kubernetes Dashboard. Port 31001 is reserved for Edge container registry. Similarly, in the default configuration, the IP addresses 172.28.0.1 and 172.28.0.10, are reserved for Kubernetes service and Core DNS service respectively.|Do not use reserved IPs.|
|**10.**|Kubernetes |Kubernetes does not currently allow multi-protocol LoadBalancer services. For example, a DNS service that would have to listen on both TCP and UDP. |To work around this limitation of Kubernetes with MetalLB, two services (one for TCP, one for UDP) can be created on the same pod selector. These services use the same sharing key and spec.loadBalancerIP to share the same IP address. IPs can also be shared if you have more services than available IP addresses. <br> For more information, see [IP address sharing](https://metallb.universe.tf/usage/#ip-address-sharing).|
|**11.**|Kubernetes cluster|Existing Azure IoT Edge marketplace modules may require modifications to run on IoT Edge on Azure Stack Edge device.|For more information, see [Run existing IoT Edge modules from Azure Stack Edge Pro FPGA devices on Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-modify-fpga-modules-gpu.md).|
|**12.**|Kubernetes |File-based bind mounts aren't supported with Azure IoT Edge on Kubernetes on Azure Stack Edge device.|IoT Edge uses a translation layer to translate `ContainerCreate` options to Kubernetes constructs. Creating `Binds` maps to `hostpath` directory and thus file-based bind mounts cannot be bound to paths in IoT Edge containers. If possible, map the parent directory.|
|**13.**|Kubernetes |If you bring your own certificates for IoT Edge and add those certificates on your Azure Stack Edge device after the compute is configured on the device, the new certificates are not picked up.|To work around this problem, you should upload the certificates before you configure compute on the device. If the compute is already configured, [Connect to the PowerShell interface of the device and run IoT Edge commands](azure-stack-edge-gpu-connect-powershell-interface.md#use-iotedge-commands). Restart `iotedged` and `edgehub` pods.|
|**14.**|Certificates |In certain instances, certificate state in the local UI may take several seconds to update. |The following scenarios in the local UI may be affected.<ul><li>**Status** column in **Certificates** page.</li><li>**Security** tile in **Get started** page.</li><li>**Configuration** tile in **Overview** page.</li></ul>  |
|**15.**|Compute + Kubernetes |Compute/Kubernetes does not support NTLM web proxy. ||
|**16**|Internet Explorer|If enhanced security features are enabled, you may not be able to access local web UI pages. | Disable enhanced security, and restart your browser.|
|**17.**|Kubernetes |Kubernetes doesn't support ":" in environment variable names that are used by .NET applications. This is also required for Event Grid IoT Edge module to function on Azure Stack Edge device and other applications. For more information, see [ASP.NET core documentation](/aspnet/core/fundamentals/configuration/?tabs=basicconfiguration#environment-variables).|Replace ":" by double underscore. For more information,see [Kubernetes issue](https://github.com/kubernetes/kubernetes/issues/53201)|
|**18.** |Azure Arc + Kubernetes cluster |By default, when resource `yamls` are deleted from the Git repository, the corresponding resources are not deleted from the Kubernetes cluster.  |To allow the deletion of resources when they're deleted from the git repository, set `--sync-garbage-collection` in Arc OperatorParams. For more information, see [Delete a configuration](../azure-arc/kubernetes/tutorial-use-gitops-connected-cluster.md#additional-parameters). |
|**19.**|NFS |Applications that use NFS share mounts on your device to write data should use Exclusive write. That ensures the writes are written to the disk.| |
|**20.**|Compute configuration |Compute configuration fails in network configurations where gateways or switches or routers respond to Address Resolution Protocol (ARP) requests for systems that do not exist on the network.| |
|**21.**|Compute and Kubernetes |If Kubernetes is set up first on your device, it claims all the available GPUs. Hence, it is not possible to create Azure Resource Manager VMs using GPUs after setting up the Kubernetes. |If your device has 2 GPUs, then you can create 1 VM that uses the GPU and then configure Kubernetes. In this case, Kubernetes will use the remaining available 1 GPU. |
|**22.**|Custom script VM extension |There is a known issue in the Windows VMs that were created in an earlier release and the device was updated to 2103. <br> If you add a custom script extension on these VMs, the Windows VM Guest Agent (Version 2.7.41491.901 only) gets stuck in the update causing the extension deployment to time out. | To work around this issue: <ol><li> Connect to the Windows VM using remote desktop protocol (RDP). </li><li> Make sure that the `waappagent.exe` is running on the machine: `Get-Process WaAppAgent`. </li><li> If the `waappagent.exe` is not running, restart the `rdagent` service: `Get-Service RdAgent` \| `Restart-Service`. Wait for 5 minutes.</li><li> While the `waappagent.exe` is running, kill the `WindowsAzureGuest.exe` process. </li><li>After you kill the process, the process starts running again with the newer version.</li><li>Verify that the Windows VM Guest Agent version is 2.7.41491.971 using this command: `Get-Process WindowsAzureGuestAgent` \| `fl ProductVersion`.</li><li>[Set up custom script extension on Windows VM](azure-stack-edge-gpu-deploy-virtual-machine-custom-script-extension.md). </li><ol> |
|**23.**|GPU VMs |Prior to this release, GPU VM lifecycle was not managed in the update flow. Hence, when updating to 2103 release, GPU VMs are not stopped automatically during the update. You will need to manually stop the GPU VMs using a `stop-stayProvisioned` flag before you update your device. For more information, see [Suspend or shut down the VM](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md#suspend-or-shut-down-the-vm).<br> All the GPU VMs that are kept running before the update, are started after the update. In these instances, the workloads running on the VMs aren't terminated gracefully. And the VMs could potentially end up in an undesirable state after the update. <br>All the GPU VMs that are stopped via the `stop-stayProvisioned` before the update, are automatically started after the update. <br>If you stop the GPU VMs via the Azure portal, you'll need to manually start the VM after the device update.| If running GPU VMs with Kubernetes, stop the GPU VMs right before the update. <br>When the GPU VMs are stopped, Kubernetes will take over the GPUs that were used originally by VMs. <br>The longer the GPU VMs are in stopped state, higher the chances that Kubernetes will take over the GPUs. |
|**24.**|Multi-Process Service (MPS) |When the device software and the Kubernetes cluster are updated, the MPS setting is not retained for the workloads.   |[Re-enable MPS](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface) and redeploy the workloads that were using MPS. |
|**25.**|Multi-Access Edge Compute (MEC) |If Azure Stack Edge is running 2106, and a Network Function Device resource is created and the Azure Stack Edge is then updated to 2110, when you deploy the Network Function, the deployment will fail. The virtual network is not being created after the device is updated to 2110. The failure does not occur if there is an existing Network Function deployment on Azure Stack Edge. | To work around this issue, re-register the same device resource using the `Invoke-MecRegister` cmdlet on your Azure Stack Edge and use the activation key from the Azure Stack Edge resource. Alternatively, you can create virtual switches via the following commands: <ul><li> `Add-HcsExternalVirtualSwitch -InterfaceAlias  Port5 -WaitForSwitchCreation $true -switchName mec-vswitch-LAN  -SupportsAcceleratedNetworking $true` </li><li> `Add-HcsExternalVirtualSwitch -InterfaceAlias  Port6 -WaitForSwitchCreation $true -switchName mec-vswitch-WAN -SupportsAcceleratedNetworking $true` </li></ul>  |
|**26.**|Multi-Access Edge Compute (MEC) |Azure Stack Edge was updated to version 2110 while the Network Functions VMs were running. In these instances, the update may fail when trying to stop the virtual machines that are connected to the Mellanox Ethernet adapter. The following error is seen in the event log: *The network interface "Mellanox ConnectX-4 Lx Ethernet Adapter" has begun resetting. There will be a momentary disruption in network connectivity while the hardware resets. Reason: The network driver did not respond to an OID request in a timely fashion. This network interface has reset 3 time(s) since it was last initialized.*  |To work around this issue, reboot your Azure Stack Edge and retry updating the device. |

## Next steps

- [Update your device](azure-stack-edge-gpu-install-update.md)

 
