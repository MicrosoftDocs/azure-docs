---
title: Azure Stack Edge 2207 release notes
description: Describes critical open issues and resolutions for the Azure Stack Edge running 2207 release.
services: databox
author: alkohli
 
ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 11/21/2022
ms.author: alkohli
---

# Azure Stack Edge 2207 release notes

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

The following release notes identify the critical open issues and the resolved issues for the 2207 release for your Azure Stack Edge devices. Features and issues that correspond to a specific model of Azure Stack Edge are called out wherever applicable.

The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they're added. Before you deploy your device, carefully review the information contained in the release notes.

This article applies to the **Azure Stack Edge 2207** release, which maps to software version number **2.2.2039.84**. This software can be applied to your device if you're running at least Azure Stack Edge 2106 (2.2.1636.3457) software.

## What's new

The 2207 release has the following features and enhancements:

- **Kubernetes version update** - This release contains a Kubernetes version update from 1.20.9 to v1.22.6.


## Known issues in this release

The following table provides a summary of known issues in this release.

| No. | Feature | Issue | Workaround/comments |
| --- | --- | --- | --- |
|**1.**|Preview features |For this release, the following features are available in preview: <br> - Clustering and Multi-Access Edge Computing (MEC) for Azure Stack Edge Pro GPU devices only.  <br> - VPN for Azure Stack Edge Pro R and Azure Stack Edge Mini R only. <br> - Local Azure Resource Manager, VMs, Cloud management of VMs, Kubernetes cloud management, and Multi-process service (MPS) for Azure Stack Edge Pro GPU, Azure Stack Edge Pro R, and Azure Stack Edge Mini R. |These features will be generally available in later releases. |
|**2.**|Drive replacement |In this release, if there is a need to replace the drive on your Azure Stack Edge Pro 2 device, contact Microsoft Support to help you with a seamless drive replacement. |
|**3.**|Jumbo frames |When deploying an Azure Stack Edge Pro 2 2-node cluster, enable Jumbo Frames on the network switches in your environment for a better device performance.  |

## Known issues from previous releases

The following table provides a summary of known issues carried over from the previous releases.

| No. | Feature | Issue | Workaround/comments |
| --- | --- | --- | --- |
| **1.** |Azure Stack Edge Pro + Azure SQL | Creating SQL database requires Administrator access.   |Do the following steps instead of Steps 1-2 in [Create-the-sql-database](../iot-edge/tutorial-store-data-sql-server.md#create-the-sql-database). <br> - In the local UI of your device, enable compute interface. Select **Compute > Port # > Enable for compute > Apply.**<br> - Download `sqlcmd` on your client machine from [SQL command utility](/sql/tools/sqlcmd-utility). <br> - Connect to your compute interface IP address (the port that was enabled), adding a ",1401" to the end of the address.<br> - Final command will look like this: sqlcmd -S {Interface IP},1401 -U SA -P "Strong!Passw0rd". After this, steps 3-4 from the current documentation should be identical.  |
| **2.** |Refresh| Incremental changes to blobs restored via **Refresh** are NOT supported |For Blob endpoints, partial updates of blobs after a Refresh, may result in the updates not getting uploaded to the cloud. For example, sequence of actions such as:<br> 1. Create blob in cloud. Or delete a previously uploaded blob from the device.<br> 2. Refresh blob from the cloud into the appliance using the refresh functionality.<br> 3. Update only a portion of the blob using Azure SDK REST APIs. These actions can result in the updated sections of the blob to not get updated in the cloud. <br>**Workaround**: Use tools such as robocopy, or regular file copy through Explorer or command line, to replace entire blobs.|
|**3.**|Throttling|During throttling, if new writes to the device aren't allowed, writes by the NFS client fail with a "Permission Denied" error.| The error will show as below:<br>`hcsuser@ubuntu-vm:~/nfstest$ mkdir test`<br>mkdir: can't create directory 'test': Permission denied​|
|**4.**|Blob Storage ingestion|When using AzCopy version 10 for Blob storage ingestion, run AzCopy with the following argument: `Azcopy <other arguments> --cap-mbps 2000`| If these limits aren't provided for AzCopy, it could potentially send a large number of requests to the device, resulting in issues with the service.|
|**5.**|Tiered storage accounts|The following apply when using tiered storage accounts:<br> - Only block blobs are supported. Page blobs aren't supported.<br> - There's no snapshot or copy API support.<br> -  Hadoop workload ingestion through `distcp` isn't supported as it uses the copy operation heavily.||
|**6.**|NFS share connection|If multiple processes are copying to the same share, and the `nolock` attribute isn't used, you may see errors during the copy.​|The `nolock` attribute must be passed to the mount command to copy files to the NFS share. For example: `C:\Users\aseuser mount -o anon \\10.1.1.211\mnt\vms Z:`.|
|**7.**|Kubernetes cluster|When applying an update on your device that is running a Kubernetes cluster, the Kubernetes virtual machines will restart and reboot. In this instance, only pods that are deployed with replicas specified are automatically restored after an update.  |If you have created individual pods outside a replication controller without specifying a replica set, these pods won't be restored automatically after the device update. You'll need to restore these pods.<br>A replica set replaces pods that are deleted or terminated for any reason, such as node failure or disruptive node upgrade. For this reason, we recommend that you use a replica set even if your application requires only a single pod.|
|**8.**|Kubernetes cluster|Kubernetes on Azure Stack Edge Pro is supported only with Helm v3 or later. For more information, go to [Frequently asked questions: Removal of Tiller](https://v3.helm.sh/docs/faq/).|
|**9.**|Kubernetes |Port 31000 is reserved for Kubernetes Dashboard. Port 31001 is reserved for Edge container registry. Similarly, in the default configuration, the IP addresses 172.28.0.1 and 172.28.0.10, are reserved for Kubernetes service and Core DNS service respectively.|Don't use reserved IPs.|
|**10.**|Kubernetes |Kubernetes doesn't currently allow multi-protocol LoadBalancer services. For example, a DNS service that would have to listen on both TCP and UDP. |To work around this limitation of Kubernetes with MetalLB, two services (one for TCP, one for UDP) can be created on the same pod selector. These services use the same sharing key and spec.loadBalancerIP to share the same IP address. IPs can also be shared if you have more services than available IP addresses. <br> For more information, see [IP address sharing](https://metallb.universe.tf/usage/#ip-address-sharing).|
|**11.**|Kubernetes cluster|Existing Azure IoT Edge marketplace modules may require modifications to run on IoT Edge on Azure Stack Edge device.|For more information, see [Run existing IoT Edge modules from Azure Stack Edge Pro FPGA devices on Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-modify-fpga-modules-gpu.md).|
|**12.**|Kubernetes |File-based bind mounts aren't supported with Azure IoT Edge on Kubernetes on Azure Stack Edge device.|IoT Edge uses a translation layer to translate `ContainerCreate` options to Kubernetes constructs. Creating `Binds` maps to `hostpath` directory and thus file-based bind mounts can't be bound to paths in IoT Edge containers. If possible, map the parent directory.|
|**13.**|Kubernetes |If you bring your own certificates for IoT Edge and add those certificates on your Azure Stack Edge device after the compute is configured on the device, the new certificates aren't picked up.|To work around this problem, you should upload the certificates before you configure compute on the device. If the compute is already configured, [Connect to the PowerShell interface of the device and run IoT Edge commands](azure-stack-edge-gpu-connect-powershell-interface.md#use-iotedge-commands). Restart `iotedged` and `edgehub` pods.|
|**14.**|Certificates |In certain instances, certificate state in the local UI may take several seconds to update. |The following scenarios in the local UI may be affected. <br> - **Status** column in **Certificates** page. <br> - **Security** tile in **Get started** page. <br> - **Configuration** tile in **Overview** page.</li></ul>  |
|**15.**|Certificates|Alerts related to signing chain certificates aren't removed from the portal even after uploading new signing chain certificates.| |
|**16.**|Web proxy |NTLM authentication-based web proxy isn't supported. ||
|**17.**|Internet Explorer|If enhanced security features are enabled, you may not be able to access local web UI pages. | Disable enhanced security, and restart your browser.|
|**18.**|Kubernetes |Kubernetes doesn't support ":" in environment variable names that are used by .NET applications. This is also required for Event Grid IoT Edge module to function on Azure Stack Edge device and other applications. For more information, see [ASP.NET core documentation](/aspnet/core/fundamentals/configuration/?tabs=basicconfiguration#environment-variables).|Replace ":" by double underscore. For more information,see [Kubernetes issue](https://github.com/kubernetes/kubernetes/issues/53201)|
|**19.** |Azure Arc + Kubernetes cluster |By default, when resource `yamls` are deleted from the Git repository, the corresponding resources aren't deleted from the Kubernetes cluster.  |To allow the deletion of resources when they're deleted from the git repository, set `--sync-garbage-collection` in Arc OperatorParams. For more information, see [Delete a configuration](../azure-arc/kubernetes/tutorial-use-gitops-connected-cluster.md#additional-parameters). |
|**20.**|NFS |Applications that use NFS share mounts on your device to write data should use Exclusive write. That ensures the writes are written to the disk.| |
|**21.**|Compute configuration |Compute configuration fails in network configurations where gateways or switches or routers respond to Address Resolution Protocol (ARP) requests for systems that don't exist on the network.| |
|**22.**|Compute and Kubernetes |If Kubernetes is set up first on your device, it claims all the available GPUs. Hence, it isn't possible to create Azure Resource Manager VMs using GPUs after setting up the Kubernetes. |If your device has 2 GPUs, then you can create one VM that uses the GPU and then configure Kubernetes. In this case, Kubernetes will use the remaining available one GPU. |
|**23.**|Custom script VM extension |There's a known issue in the Windows VMs that were created in an earlier release and the device was updated to 2103. <br> If you add a custom script extension on these VMs, the Windows VM Guest Agent (Version 2.7.41491.901 only) gets stuck in the update causing the extension deployment to time out. | To work around this issue: <br> - Connect to the Windows VM using remote desktop protocol (RDP). <br> - Make sure that the `waappagent.exe` is running on the machine: `Get-Process WaAppAgent`. <br> - If the `waappagent.exe` isn't running, restart the `rdagent` service: `Get-Service RdAgent` \| `Restart-Service`. Wait for 5 minutes.<br> - While the `waappagent.exe` is running, kill the `WindowsAzureGuest.exe` process. <br> - After you kill the process, the process starts running again with the newer version. <br> - Verify that the Windows VM Guest Agent version is 2.7.41491.971 using this command: `Get-Process WindowsAzureGuestAgent` \| `fl ProductVersion`.<br> - [Set up custom script extension on Windows VM](azure-stack-edge-gpu-deploy-virtual-machine-custom-script-extension.md).  |
|**24.**|Multi-Process Service (MPS) |When the device software and the Kubernetes cluster are updated, the MPS setting isn't retained for the workloads.   |[Re-enable MPS](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface) and redeploy the workloads that were using MPS. |
|**25.**|Wi-Fi |Wi-Fi doesn't work on Azure Stack Edge Pro 2 in this release. | This functionality may be available in a future release.   |


## Next steps

- [Update your device](azure-stack-edge-gpu-install-update.md)
