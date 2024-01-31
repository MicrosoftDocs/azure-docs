---
title: Azure Stack Edge 2312 release notes
description: Describes critical open issues and resolutions for the Azure Stack Edge running 2312 release.
services: databox
author: alkohli
 
ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 12/22/2023
ms.author: alkohli
---

# Azure Stack Edge 2312 release notes

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

The following release notes identify the critical open issues and the resolved issues for the 2312 release for your Azure Stack Edge devices. Features and issues that correspond to a specific model of Azure Stack Edge are called out wherever applicable.

The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they're added. Before you deploy your device, carefully review the information contained in the release notes.

This article applies to the **Azure Stack Edge 2312** release, which maps to software version **3.2.2510.2000**.

> [!Warning] 
> In this release, you must update the packet core version to AP5GC 2308 before you update to Azure Stack Edge 2312. For detailed steps, see [Azure Private 5G Core 2308 release notes](../private-5g-core/azure-private-5g-core-release-notes-2308.md).
> If you update to Azure Stack Edge 2312 before updating to Packet Core 2308.0.1, you will experience a total system outage. In this case, you must delete and re-create the Azure Kubernetes service cluster on your Azure Stack Edge device.
> Each time you change the Kubernetes workload profile, you are prompted for the Kubernetes update. Go ahead and apply the update.

## Supported update paths

To apply the 2312 update, your device must be running version 2303 or later.

 - If you are not running the minimum required version, you'll see this error: 

   *Update package cannot be installed as its dependencies are not met.* 

 - You can update to 2303 from 2207 or later, and then install 2312.

You can update to the latest version using the following update paths:

| Current version of Azure Stack Edge software and Kubernetes     | Update to Azure Stack Edge software and Kubernetes  | Desired update to 2312  |
| --------------------| -----------| -----------|
|2207   |2303   |2312   |
|2209   |2303   |2312   |
|2210   |2303   |2312   |
|2301   |2303   |2312   |
|2303   |Directly to   |2312   |

## What's new

The 2312 release has the following new features and enhancements:

- Base OS updates for Kubernetes nodes.
- For Azure Stack Edge Kubernetes, switch container hosting platform from Docker to Containerd.
- Topology aware routing. For more information, see [Topology Aware Routing](https://kubernetes.io/docs/concepts/services-networking/topology-aware-routing/).
- Failover of stateful apps for non-graceful node shutdown. For more information, see [Non-graceful node shutdown handling](https://kubernetes.io/docs/concepts/architecture/nodes/#non-graceful-node-shutdown).
- WS22 LCU: 11B.
- Driver and firmware updates - Klas BIOS, Mellanox driver.
- Kubernetes v1.26, multiversion Kubernetes update.
- Ubuntu version update for Azure Stack Edge Kubernetes.
- General availability for two-node Azure Kubernetes Service cluster on Azure Stack Edge.
- VM NIC passthrough.
- AP5GC sideload update for low bandwidth environments.

## Issues fixed in this release

| No. | Feature | Issue |
| --- | --- | --- |
|**1.**|Azure Kubernetes Service |Expired certificate handling |
|**2.**|Azure Kubernetes Service usage |High control plane memory usage |
|**3.**|VM provision failure with arp_ignore set to 2 |
|**4.**|IVAS deployment blocker, NFS file delete |


 <!--!## Known issues in this release

| No. | Feature | Issue | Workaround/comments |
| --- | --- | --- | --- |
|**1.**|AKS... |The AKS Kubernetes... |
|**2.**|Wi-Fi... |Starting this release... |  |-->


## Known issues from previous releases

The following table provides a summary of known issues carried over from the previous releases.

| No. | Feature | Issue | Workaround/comments |
| --- | --- | --- | --- |
| **1.** |Azure Stack Edge Pro + Azure SQL | Creating SQL database requires Administrator access.   |Do the following steps instead of Steps 1-2 in [Create-the-sql-database](../iot-edge/tutorial-store-data-sql-server.md#create-the-sql-database). <br> 1. In the local UI of your device, enable compute interface. Select **Compute > Port # > Enable for compute > Apply.**<br> 2. Download `sqlcmd` on your client machine from [SQL command utility](/sql/tools/sqlcmd-utility). <br> 3. Connect to your compute interface IP address (the port that was enabled), adding a ",1401" to the end of the address.<br> 4. Final command will look like this: sqlcmd -S {Interface IP},1401 -U SA -P "Strong!Passw0rd". After this, steps 3-4 from the current documentation should be identical.  |
| **2.** |Refresh| Incremental changes to blobs restored via **Refresh** are NOT supported |For Blob endpoints, partial updates of blobs after a Refresh, might result in the updates not getting uploaded to the cloud. For example, sequence of actions such as:<br> 1. Create blob in cloud. Or delete a previously uploaded blob from the device.<br> 2. Refresh blob from the cloud into the appliance using the refresh functionality.<br> 3. Update only a portion of the blob using Azure SDK REST APIs. These actions can result in the updated sections of the blob to not get updated in the cloud. <br>**Workaround**: Use tools such as robocopy, or regular file copy through Explorer or command line, to replace entire blobs.|
|**3.**|Throttling|During throttling, if new writes to the device aren't allowed, writes by the NFS client fail with a "Permission Denied" error.| The error will show as below:<br>`hcsuser@ubuntu-vm:~/nfstest$ mkdir test`<br>mkdir: can't create directory 'test': Permission denied​|
|**4.**|Blob Storage ingestion|When using AzCopy version 10 for Blob storage ingestion, run AzCopy with the following argument: `Azcopy <other arguments> --cap-mbps 2000`| If these limits aren't provided for AzCopy, it could potentially send a large number of requests to the device, resulting in issues with the service.|
|**5.**|Tiered storage accounts|The following apply when using tiered storage accounts:<br> - Only block blobs are supported. Page blobs aren't supported.<br> - There's no snapshot or copy API support.<br> -  Hadoop workload ingestion through `distcp` isn't supported as it uses the copy operation heavily.||
|**6.**|NFS share connection|If multiple processes are copying to the same share, and the `nolock` attribute isn't used, you might see errors during the copy.​|The `nolock` attribute must be passed to the mount command to copy files to the NFS share. For example: `C:\Users\aseuser mount -o anon \\10.1.1.211\mnt\vms Z:`.|
|**7.**|Kubernetes cluster|When applying an update on your device that is running a Kubernetes cluster, the Kubernetes virtual machines will restart and reboot. In this instance, only pods that are deployed with replicas specified are automatically restored after an update.  |If you have created individual pods outside a replication controller without specifying a replica set, these pods won't be restored automatically after the device update. You'll need to restore these pods.<br>A replica set replaces pods that are deleted or terminated for any reason, such as node failure or disruptive node upgrade. For this reason, we recommend that you use a replica set even if your application requires only a single pod.|
|**8.**|Kubernetes cluster|Kubernetes on Azure Stack Edge Pro is supported only with Helm v3 or later. For more information, go to [Frequently asked questions: Removal of Tiller](https://v3.helm.sh/docs/faq/).|
|**9.**|Kubernetes |Port 31000 is reserved for Kubernetes Dashboard. Port 31001 is reserved for Edge container registry. Similarly, in the default configuration, the IP addresses 172.28.0.1 and 172.28.0.10, are reserved for Kubernetes service and Core DNS service respectively.|Don't use reserved IPs.|
|**10.**|Kubernetes |Kubernetes doesn't currently allow multi-protocol LoadBalancer services. For example, a DNS service that would have to listen on both TCP and UDP. |To work around this limitation of Kubernetes with MetalLB, two services (one for TCP, one for UDP) can be created on the same pod selector. These services use the same sharing key and spec.loadBalancerIP to share the same IP address. IPs can also be shared if you have more services than available IP addresses. <br> For more information, see [IP address sharing](https://metallb.universe.tf/usage/#ip-address-sharing).|
|**11.**|Kubernetes cluster|Existing Azure IoT Edge marketplace modules might require modifications to run on IoT Edge on Azure Stack Edge device.|For more information, see [Run existing IoT Edge modules from Azure Stack Edge Pro FPGA devices on Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-modify-fpga-modules-gpu.md).|
|**12.**|Kubernetes |File-based bind mounts aren't supported with Azure IoT Edge on Kubernetes on Azure Stack Edge device.|IoT Edge uses a translation layer to translate `ContainerCreate` options to Kubernetes constructs. Creating `Binds` maps to `hostpath` directory and thus file-based bind mounts can't be bound to paths in IoT Edge containers. If possible, map the parent directory.|
|**13.**|Kubernetes |If you bring your own certificates for IoT Edge and add those certificates on your Azure Stack Edge device after the compute is configured on the device, the new certificates aren't picked up.|To work around this problem, you should upload the certificates before you configure compute on the device. If the compute is already configured, [Connect to the PowerShell interface of the device and run IoT Edge commands](azure-stack-edge-gpu-connect-powershell-interface.md#use-iotedge-commands). Restart `iotedged` and `edgehub` pods.|
|**14.**|Certificates |In certain instances, certificate state in the local UI might take several seconds to update. |The following scenarios in the local UI might be affected. <br> - **Status** column in **Certificates** page. <br> - **Security** tile in **Get started** page. <br> - **Configuration** tile in **Overview** page.<br>  |
|**15.**|Certificates|Alerts related to signing chain certificates aren't removed from the portal even after uploading new signing chain certificates.| |
|**16.**|Web proxy |NTLM authentication-based web proxy isn't supported. ||
|**17.**|Internet Explorer|If enhanced security features are enabled, you might not be able to access local web UI pages. | Disable enhanced security, and restart your browser.|
|**18.**|Kubernetes |Kubernetes doesn't support ":" in environment variable names that are used by .NET applications. This is also required for Event Grid IoT Edge module to function on Azure Stack Edge device and other applications. For more information, see [ASP.NET core documentation](/aspnet/core/fundamentals/configuration/?tabs=basicconfiguration#environment-variables).|Replace ":" by double underscore. For more information,see [Kubernetes issue](https://github.com/kubernetes/kubernetes/issues/53201)|
|**19.** |Azure Arc + Kubernetes cluster |By default, when resource `yamls` are deleted from the Git repository, the corresponding resources aren't deleted from the Kubernetes cluster.  |To allow the deletion of resources when they're deleted from the git repository, set `--sync-garbage-collection` in Arc OperatorParams. For more information, see [Delete a configuration](../azure-arc/kubernetes/tutorial-use-gitops-connected-cluster.md#additional-parameters). |
|**20.**|NFS |Applications that use NFS share mounts on your device to write data should use Exclusive write. That ensures the writes are written to the disk.| |
|**21.**|Compute configuration |Compute configuration fails in network configurations where gateways or switches or routers respond to Address Resolution Protocol (ARP) requests for systems that don't exist on the network.| |
|**22.**|Compute and Kubernetes |If Kubernetes is set up first on your device, it claims all the available GPUs. Hence, it isn't possible to create Azure Resource Manager VMs using GPUs after setting up the Kubernetes. |If your device has 2 GPUs, then you can create one VM that uses the GPU and then configure Kubernetes. In this case, Kubernetes will use the remaining available one GPU. |
|**23.**|Custom script VM extension |There's a known issue in the Windows VMs that were created in an earlier release and the device was updated to 2103. <br> If you add a custom script extension on these VMs, the Windows VM Guest Agent (Version 2.7.41491.901 only) gets stuck in the update causing the extension deployment to time out. | To work around this issue: <br> 1. Connect to the Windows VM using remote desktop protocol (RDP). <br> 2. Make sure that the `waappagent.exe` is running on the machine: `Get-Process WaAppAgent`. <br> 3. If the `waappagent.exe` isn't running, restart the `rdagent` service: `Get-Service RdAgent` \| `Restart-Service`. Wait for 5 minutes.<br> 4. While the `waappagent.exe` is running, kill the `WindowsAzureGuest.exe` process. <br> 5. After you kill the process, the process starts running again with the newer version. <br> 6. Verify that the Windows VM Guest Agent version is 2.7.41491.971 using this command: `Get-Process WindowsAzureGuestAgent` \| `fl ProductVersion`.<br> 7. [Set up custom script extension on Windows VM](azure-stack-edge-gpu-deploy-virtual-machine-custom-script-extension.md).  |
|**24.**|Multi-Process Service (MPS) |When the device software and the Kubernetes cluster are updated, the MPS setting isn't retained for the workloads.   |[Re-enable MPS](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface) and redeploy the workloads that were using MPS. |
|**25.**|Wi-Fi |Wi-Fi doesn't work on Azure Stack Edge Pro 2 in this release. |
|**26.**|Azure IoT Edge |The managed Azure IoT Edge solution on Azure Stack Edge is running on an older, obsolete IoT Edge runtime that is at end of life. For more information, see [IoT Edge v1.1 EoL: What does that mean for me?](https://techcommunity.microsoft.com/t5/internet-of-things-blog/iot-edge-v1-1-eol-what-does-that-mean-for-me/ba-p/3662137). Although the solution does not stop working past end of life, there are no plans to update it.  |To run the latest version of Azure IoT Edge [LTSs](../iot-edge/version-history.md#version-history) with the latest updates and features on their Azure Stack Edge, we **recommend** that you deploy a [customer self-managed IoT Edge solution](azure-stack-edge-gpu-deploy-iot-edge-linux-vm.md) that runs on a Linux VM. For more information, see [Move workloads from managed IoT Edge on Azure Stack Edge to an IoT Edge solution on a Linux VM](azure-stack-edge-move-to-self-service-iot-edge.md). |
|**27.**|AKS on Azure Stack Edge |In this release, you can't modify the virtual networks once the AKS cluster is deployed on your Azure Stack Edge cluster.| To modify the virtual network, you will need to delete the AKS cluster, then modify virtual networks, and then recreate AKS cluster on your Azure Stack Edge. |
|**28.**|AKS Update |The AKS Kubernetes update might fail if one of the AKS VMs is not running. This issue might be seen in the 2-node cluster. |If the AKS update has failed, [Connect to the PowerShell interface of the device](azure-stack-edge-gpu-connect-powershell-interface.md). Check the state of the Kubernetes VMs by running `Get-VM` cmdlet. If the VM is off, run the `Start-VM` cmdlet to restart the VM. Once the Kubernetes VM is running, reapply the update. |
|**29.**|Wi-Fi |Wi-Fi functionality for Azure Stack Edge Mini R has been deprecated. |

## Next steps

- [Update your device](azure-stack-edge-gpu-install-update.md)