---
title: Azure Stack Edge 2105 release notes
description: Describes critical open issues and resolutions for the Azure Stack Edge running 2105 release.
services: databox
author: alkohli
 
ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 05/27/2021
ms.author: alkohli
---

# Azure Stack Edge 2105 release notes

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

The following release notes identify the critical open issues and the resolved issues for the 2105 release for your Azure Stack Edge devices. These release notes are applicable for Azure Stack Edge Pro GPU, Azure Stack Edge Pro R, and Azure Stack Edge Mini R devices. Features and issues that correspond to a specific model are called out wherever applicable.

The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they are added. Before you deploy your device, carefully review the information contained in the release notes.

This article applies to the **Azure Stack Edge 2105** release, which maps to software version number **2.2.1606.3320**. This software can be applied to your device if you are running at least Azure Stack Edge 2010 (2.1.1377.2170) software.

## What's new

The following new features are available in the Azure Stack Edge 2105 release. 

- **Virtual Local Area Network (VLAN) configuration support** - In this release, the virtual local area network (VLAN) configuration can be changed by connecting to the PowerShell interface of the device. For more information, see [Create vLAN networks on virtual switch](azure-stack-edge-gpu-create-virtual-switch-powershell.md).
- **IP Forwarding support** - Beginning this release, IP forwarding is supported for network interfaces attached to Virtual Machines (VMs). 
    - IP forwarding enables VMs to receive network traffic from an IP not assigned to any of the IP configurations assigned to a network interface on the VM. 
    - IP forwarding also lets VMs send network traffic with a different source IP address than the one assigned to the IP configurations for the VM's network interface.
        
    For more information, see [Enable or disable IP forwarding](../virtual-network/virtual-network-network-interface.md#enable-or-disable-ip-forwarding). 
- **Kubernetes improvements** - In this release, several enhancements related to Kubernetes have been made.
    - The following Kubernetes version updates are available: 

        - Kubernetes server version: v1.20.2
        - IoT Edge version: 0.1.0-beta14
        - Azure Arc-enabled Kubernetes version: 1.1
    - Azure Arc-enabled Kubernetes now has support for various clouds, logging is improved and the cmdlet experience via the PowerShell interface has changed. 
    - Diagnostics and telemetry fixes have been made.
    - Proactive log collection is enhanced for compute logs. 

- **Support for Az cmdlets** - Starting this release, the Az cmdlets are available (in preview) when connecting to the local Azure Resource Manager of the device or when deploying VM workloads. For more information, see [Az cmdlets](/powershell/azure/new-azureps-module-az).
- **Enable remote PowerShell session over HTTP** - Starting this release, you can enable a remote PowerShell session into a device over *http* via the local UI. For more information, see how to [Enable Remote PowerShell over http](azure-stack-edge-gpu-manage-access-power-connectivity-mode.md#enable-device-access-via-remote-powershell-over-http) for your device.


## Issues fixed in 2105 release

The following table lists the issues that were release noted in previous releases and fixed in the current release.

| No. | Feature | Issue | 
| --- | --- | --- |
|**1.**|VM |Failure during DHCP lease renewal should not cause network interface record to be removed.|
|**2.**|VM | Monitoring improvements to resolve locking issue when provisioning VMs.| 

## Known issues in 2105 release

The following table provides a summary of known issues in the 2105 release.

| No. | Feature | Issue | Workaround/comments |
| --- | --- | --- | --- |
|**1.**|Preview features |For this release, the following features: Local Azure Resource Manager, VMs, Cloud management of VMs, Kubernetes cloud management, Azure Arc-enabled Kubernetes, VPN for Azure Stack Edge Pro R and Azure Stack Edge Mini R, Multi-process service (MPS), Network Function Manager for Azure Stack Edge Pro GPU  - are all available in preview.  |These features will be generally available in later releases. |
|**2.**|Multi-access Edge Compute (MEC)/Network Function Manager (NFM) deployments |For MEC/NFM deployments prior to the 2105 update, you may face this rare issue where traffic from LAN/WAN VM NetAdapters is dropped. <br><br> On your Azure Stack Edge device, Port 5 and Port 6 are connected to the Mellanox network interface card that allows for [accelerated networking](../virtual-network/create-vm-accelerated-networking-powershell.md). The accelerated networking allows the LAN/WAN traffic from Port 5 and Port 6 to bypass the hypervisor layer and the virtual switch, and directly reach the physical switch. <br><br> You can disable the accelerated networking by disabling the [Virtual Functions (VF)](/windows-hardware/drivers/network/sr-iov-virtual-functions--vfs-) device on the LAN/WAN network interfaces. All the networking traffic from the VMs will now traverse the hypervisor layer that performs security checks. If your application sends traffic using arbitrary unicast source IP address (which is not the IP for VM NetAdapter), the security checks cause the traffic to be dropped (as it seems to be originating from arbitrary IPs that aren't specified in the Virtual Networking Functions contract).|To work around this problem, you can hold off on the 2105 update and wait for the next release that has a fix for this issue.<br><br> Alternatively, you could apply the 2105 update on your Azure Stack Edge device and redeploy the same VNF. The VNFs that are deployed after the 2105 update do not require the fix. |


## Known issues from previous releases

The following table provides a summary of known issues carried over from the previous releases.

| No. | Feature | Issue | Workaround/comments |
| --- | --- | --- | --- |
| **1.** |Azure Stack Edge Pro + Azure SQL | Creating SQL database requires Administrator access.   |Do the following steps instead of Steps 1-2 in [Create-the-sql-database](../iot-edge/tutorial-store-data-sql-server.md#create-the-sql-database). <ul><li>In the local UI of your device, enable compute interface. Select **Compute > Port # > Enable for compute > Apply.**</li><li>Download `sqlcmd` on your client machine from [SQL command utility](/sql/tools/sqlcmd-utility). </li><li>Connect to your compute interface IP address (the port that was enabled), adding a ",1401" to the end of the address.</li><li>Final command will look like this: sqlcmd -S {Interface IP},1401 -U SA -P "Strong!Passw0rd".</li>After this, steps 3-4 from the current documentation should be identical. </li></ul> |
| **2.** |Refresh| Incremental changes to blobs restored via **Refresh** are NOT supported |For Blob endpoints, partial updates of blobs after a Refresh, may result in the updates not getting uploaded to the cloud. For example, sequence of actions such as:<ul><li>Create blob in cloud. Or delete a previously uploaded blob from the device.</li><li>Refresh blob from the cloud into the appliance using the refresh functionality.</li><li>Update only a portion of the blob using Azure SDK REST APIs.</li></ul>These actions can result in the updated sections of the blob to not get updated in the cloud. <br>**Workaround**: Use tools such as robocopy, or regular file copy through Explorer or command line, to replace entire blobs.|
|**3.**|Throttling|During throttling, if new writes to the device aren't allowed, writes by the NFS client fail with a "Permission Denied" error.| The error will show as below:<br>`hcsuser@ubuntu-vm:~/nfstest$ mkdir test`<br>mkdir: cannot create directory 'test': Permission denied​|
|**4.**|Blob Storage ingestion|When using AzCopy version 10 for Blob storage ingestion, run AzCopy with the following argument: `Azcopy <other arguments> --cap-mbps 2000`| If these limits aren't provided for AzCopy, it could potentially send a large number of requests to the device, resulting in issues with the service.|
|**5.**|Tiered storage accounts|The following apply when using tiered storage accounts:<ul><li> Only block blobs are supported. Page blobs are not supported.</li><li>There is no snapshot or copy API support.</li><li> Hadoop workload ingestion through `distcp` is not supported as it uses the copy operation heavily.</li></ul>||
|**6.**|NFS share connection|If multiple processes are copying to the same share, and the `nolock` attribute isn't used, you may see errors during the copy.​|The `nolock` attribute must be passed to the mount command to copy files to the NFS share. For example: `C:\Users\aseuser mount -o anon \\10.1.1.211\mnt\vms Z:`.|
|**7.**|Kubernetes cluster|When applying an update on your device that is running a Kubernetes cluster, the Kubernetes virtual machines will restart and reboot. In this instance, only pods that are deployed with replicas specified are automatically restored after an update.  |If you have created individual pods outside a replication controller without specifying a replica set, these pods won't be restored automatically after the device update. You will need to restore these pods.<br>A replica set replaces pods that are deleted or terminated for any reason, such as node failure or disruptive node upgrade. For this reason, we recommend that you use a replica set even if your application requires only a single pod.|
|**8.**|Kubernetes cluster|Kubernetes on Azure Stack Edge Pro is supported only with Helm v3 or later. For more information, go to [Frequently asked questions: Removal of Tiller](https://v3.helm.sh/docs/faq/).|
|**9.**|Azure Arc-enabled Kubernetes |For the GA release, Azure Arc-enabled Kubernetes is updated from version 0.1.18 to 0.2.9. As the Azure Arc-enabled Kubernetes update is not supported on Azure Stack Edge device, you will need to redeploy Azure Arc-enabled Kubernetes.|Follow these steps:<ol><li>[Apply device software and Kubernetes updates](azure-stack-edge-gpu-install-update.md).</li><li>Connect to the [PowerShell interface of the device](azure-stack-edge-gpu-connect-powershell-interface.md).</li><li>Remove the existing Azure Arc agent. Type: `Remove-HcsKubernetesAzureArcAgent`.</li><li>Deploy [Azure Arc to a new resource](azure-stack-edge-gpu-deploy-arc-kubernetes-cluster.md). Do not use an existing Azure Arc resource.</li></ol>|
|**10.**|Azure Arc-enabled Kubernetes|Azure Arc deployments are not supported if web proxy is configured on your Azure Stack Edge Pro device.||
|**11.**|Kubernetes |Port 31000 is reserved for Kubernetes Dashboard. Port 31001 is reserved for Edge container registry. Similarly, in the default configuration, the IP addresses 172.28.0.1 and 172.28.0.10, are reserved for Kubernetes service and Core DNS service respectively.|Do not use reserved IPs.|
|**12.**|Kubernetes |Kubernetes does not currently allow multi-protocol LoadBalancer services. For example, a DNS service that would have to listen on both TCP and UDP. |To work around this limitation of Kubernetes with MetalLB, two services (one for TCP, one for UDP) can be created on the same pod selector. These services use the same sharing key and spec.loadBalancerIP to share the same IP address. IPs can also be shared if you have more services than available IP addresses. <br> For more information, see [IP address sharing](https://metallb.universe.tf/usage/#ip-address-sharing).|
|**13.**|Kubernetes cluster|Existing Azure IoT Edge marketplace modules may require modifications to run on IoT Edge on Azure Stack Edge device.|For more information, see Modify Azure IoT Edge modules from marketplace to run on Azure Stack Edge device.<!-- insert link-->|
|**14.**|Kubernetes |File-based bind mounts aren't supported with Azure IoT Edge on Kubernetes on Azure Stack Edge device.|IoT Edge uses a translation layer to translate `ContainerCreate` options to Kubernetes constructs. Creating `Binds` maps to `hostpath` directory and thus file-based bind mounts cannot be bound to paths in IoT Edge containers. If possible, map the parent directory.|
|**15.**|Kubernetes |If you bring your own certificates for IoT Edge and add those certificates on your Azure Stack Edge device after the compute is configured on the device, the new certificates are not picked up.|To work around this problem, you should upload the certificates before you configure compute on the device. If the compute is already configured, [Connect to the PowerShell interface of the device and run IoT Edge commands](azure-stack-edge-gpu-connect-powershell-interface.md#use-iotedge-commands). Restart `iotedged` and `edgehub` pods.|
|**16.**|Certificates |In certain instances, certificate state in the local UI may take several seconds to update. |The following scenarios in the local UI may be affected.<ul><li>**Status** column in **Certificates** page.</li><li>**Security** tile in **Get started** page.</li><li>**Configuration** tile in **Overview** page.</li></ul>  |
|**17.**|IoT Edge |Modules deployed through IoT Edge can't use host network. | |
|**18.**|Compute + Kubernetes |Compute/Kubernetes does not support NTLM web proxy. ||
|**19.**|Kubernetes + update |Earlier software versions such as 2008 releases have a race condition update issue that causes the update to fail with ClusterConnectionException. |Using the newer builds should help avoid this issue. If you still see this issue, the workaround is to retry the upgrade, and it should work.|
|**20**|Internet Explorer|If enhanced security features are enabled, you may not be able to access local web UI pages. | Disable enhanced security, and restart your browser.|
|**21.**|Kubernetes Dashboard | *Https* endpoint for Kubernetes Dashboard with SSL certificate is not supported. | |
|**22.**|Kubernetes |Kubernetes doesn't support ":" in environment variable names that are used by .NET applications. This is also required for Event grid IoT Edge module to function on Azure Stack Edge device and other applications. For more information, see [ASP.NET core documentation](/aspnet/core/fundamentals/configuration/?tabs=basicconfiguration#environment-variables).|Replace ":" by double underscore. For more information,see [Kubernetes issue](https://github.com/kubernetes/kubernetes/issues/53201)|
|**23.** |Azure Arc + Kubernetes cluster |By default, when resource `yamls` are deleted from the Git repository, the corresponding resources are not deleted from the Kubernetes cluster.  |To allow the deletion of resources when they're deleted from the git repository, set `--sync-garbage-collection` in Arc OperatorParams. For more information, see [Delete a configuration](../azure-arc/kubernetes/tutorial-use-gitops-connected-cluster.md#additional-parameters). |
|**24.**|NFS |Applications that use NFS share mounts on your device to write data should use Exclusive write. That ensures the writes are written to the disk.| |
|**25.**|Compute configuration |Compute configuration fails in network configurations where gateways or switches or routers respond to Address Resolution Protocol (ARP) requests for systems that do not exist on the network.| |
|**26.**|Compute and Kubernetes |If Kubernetes is set up first on your device, it claims all the available GPUs. Hence, it is not possible to create Azure Resource Manager VMs using GPUs after setting up the Kubernetes. |If your device has 2 GPUs, then you can create 1 VM that uses the GPU and then configure Kubernetes. In this case, Kubernetes will use the remaining available 1 GPU. |
|**27.**|Custom script VM extension |There is a known issue in the Windows VMs that were created in an earlier release and the device was updated to 2103. <br> If you add a custom script extension on these VMs, the Windows VM Guest Agent (Version 2.7.41491.901 only) gets stuck in the update causing the extension deployment to time out. | To work around this issue: <ul><li> Connect to the Windows VM using remote desktop protocol (RDP). </li><li> Make sure that the `waappagent.exe` is running on the machine: `Get-Process WaAppAgent`. </li><li> If the `waappagent.exe` is not running, restart the `rdagent` service: `Get-Service RdAgent` \| `Restart-Service`. Wait for 5 minutes.</li><li> While the `waappagent.exe` is running, kill the `WindowsAzureGuest.exe` process. </li><li>After you kill the process, the process starts running again with the newer version.</li><li>Verify that the Windows VM Guest Agent version is 2.7.41491.971 using this command: `Get-Process WindowsAzureGuestAgent` \| `fl ProductVersion`.</li><li>[Set up custom script extension on Windows VM](azure-stack-edge-gpu-deploy-virtual-machine-custom-script-extension.md). </li><ul> |
|**28.**|GPU VMs |Prior to this release, GPU VM lifecycle was not managed in the update flow. Hence, when updating to 2103 release, GPU VMs are not stopped automatically during the update. You will need to manually stop the GPU VMs using a `stop-stayProvisioned` flag before you update your device. For more information, see [Suspend or shut down the VM](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md#suspend-or-shut-down-the-vm).<br> All the GPU VMs that are kept running before the update, are started after the update. In these instances, the workloads running on the VMs aren't terminated gracefully. And the VMs could potentially end up in an undesirable state after the update. <br>All the GPU VMs that are stopped via the `stop-stayProvisioned` before the update, are automatically started after the update. <br>If you stop the GPU VMs via the Azure portal, you'll need to manually start the VM after the device update.| If running GPU VMs with Kubernetes, stop the GPU VMs right before the update. <br>When the GPU VMs are stopped, Kubernetes will take over the GPUs that were used originally by VMs. <br>The longer the GPU VMs are in stopped state, higher the chances that Kubernetes will take over the GPUs. |
|**29.**|Multi-Process Service (MPS) |When the device software and the Kubernetes cluster are updated, the MPS setting is not retained for the workloads.   |[Re-enable MPS](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface) and redeploy the workloads that were using MPS. |



## Next steps

- [Update your device](azure-stack-edge-gpu-install-update.md)
