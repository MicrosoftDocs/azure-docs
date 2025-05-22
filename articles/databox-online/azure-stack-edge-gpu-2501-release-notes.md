---
title: Azure Stack Edge 2501 release notes
description: Describes critical open issues and resolutions for the Azure Stack Edge running 2501 release.
services: databox
author: alkohli
 
ms.service: azure-stack-edge
ms.topic: article
ms.date: 02/04/2025
ms.author: alkohli
---

# Azure Stack Edge 2501 release notes

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

The following release notes identify critical open issues and resolved issues for the 2501 release for your Azure Stack Edge devices. Features and issues that correspond to a specific model of Azure Stack Edge are called out wherever applicable.

The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they're added. Before you deploy your device, carefully review the information contained in the release notes.

This article applies to the **Azure Stack Edge 2501** release, which maps to software version **3.3.2501.1176**.

> [!Warning] 
> In this release, you must update the packet core version to AP5GC 2308 before you update to Azure Stack Edge 2501. For detailed steps, see [Azure Private 5G Core 2308 release notes](../private-5g-core/azure-private-5g-core-release-notes-2308.md).
> If you update to Azure Stack Edge 2501 before updating to Packet Core 2308.0.1, you will experience a total system outage. In this case, you must delete and re-create the Azure Kubernetes service cluster on your Azure Stack Edge device.
> Each time you change the Kubernetes workload profile, you are prompted for the Kubernetes update. Go ahead and apply the update.

## Supported update paths

To apply the 2501 update, your device must be running version 2403 or later.

 - If you aren't running the minimum required version, you see this error: 

   *Update package can't be installed as its dependencies aren't met.* 

 - You can update to 2403 from 2303 or later, and then update to 2501.

You can update to the latest version using the following update paths:

| Current version of Azure Stack Edge software and Kubernetes     | Update to Azure Stack Edge software and Kubernetes  | Desired update to 2501  |
| --------------------| -----------| -----------|
|2303   |2403   |2501   |
|2309   |2403   |2501   |
|2312   |2403   |2501   |
|2403   |Directly to   |2501   |

## What's new

The 2501 release has the following new features and enhancements:

- Managed service identity (MSI) is used instead of access keys to tier data from an Azure Stack Edge device to Azure cloud storage. No new user action is required as a result of this change. 

<!--!## Issues fixed in this release
==previous==
| No. | Feature | Issue |
| --- | --- | --- |
|**1.**| Clustering |-->

## Known issues in this release

| No. | Feature | Issue | Workaround/comments |
| --- | --- | --- | --- |
|**1.**| Unable to add VM images to Azure Stack Edge| Customers may be unable to add VM images to their Azure Stack Edge due to changes in blob permissions. | To add a VM image to Azure Stack Edge, you must have the `Storage blob data reader` or `Storage blob data contributor` role on the storage account, resource group, or subscription. Alternatively, you can have someone with those permissions perform the operation. |

## Known issues from previous releases

The following table provides a summary of known issues carried over from the previous releases.

| No. | Feature | Issue | Workaround/comments |
| --- | --- | --- | --- |
| **1.** |Azure Stack Edge Pro + Azure SQL | Creating SQL database requires Administrator access.   |Do the following steps instead of Steps 1-2 in [Create-the-sql-database](../iot-edge/tutorial-store-data-sql-server.md#create-the-sql-database). <br> 1. In the local UI of your device, enable compute interface. Select **Compute > Port # > Enable for compute > Apply.**<br> 2. Download `sqlcmd` on your client machine from [SQL command utility](/sql/tools/sqlcmd-utility). <br> 3. Connect to your compute interface IP address (the port that was enabled), adding a ",1401" to the end of the address.<br> 4. Final command looks like this: sqlcmd -S {Interface IP},1401 -U SA -P "Strong!Passw0rd". After this, steps 3-4 from the current documentation should be identical.  |
| **2.** |Refresh| Incremental changes to blobs restored via **Refresh** are NOT supported |For Blob endpoints, partial updates of blobs after a Refresh, might result in the updates not getting uploaded to the cloud. For example, sequence of actions such as:<br> 1. Create blob in cloud. Or delete a previously uploaded blob from the device.<br> 2. Refresh blob from the cloud into the appliance using the refresh functionality.<br> 3. Update only a portion of the blob using Azure SDK REST APIs. These actions can result in the updated sections of the blob to not get updated in the cloud. <br>**Workaround**: Use tools such as robocopy, or regular file copy through Explorer or command line, to replace entire blobs.|
|**3.**|Throttling|During throttling, if new writes to the device aren't allowed, writes by the NFS client fail with a "Permission Denied" error.| The error shows as below:<br>`hcsuser@ubuntu-vm:~/nfstest$ mkdir test`<br>mkdir: can't create directory 'test': Permission denied​|
|**4.**|Blob Storage ingestion|When using AzCopy version 10 for Blob storage ingestion, run AzCopy with the following argument: `Azcopy <other arguments> --cap-mbps 2000`| If these limits aren't provided for AzCopy, it could potentially send a large number of requests to the device, resulting in issues with the service.|
|**5.**|Tiered storage accounts|The following apply when using tiered storage accounts:<br> - Only block blobs are supported. Page blobs aren't supported.<br> - There's no snapshot or copy API support.<br> -  Hadoop workload ingestion through `distcp` isn't supported as it uses the copy operation heavily.||
|**6.**|NFS share connection|If multiple processes are copying to the same share, and the `nolock` attribute isn't used, you might see errors during the copy.​|The `nolock` attribute must be passed to the mount command to copy files to the NFS share. For example: `C:\Users\aseuser mount -o anon \\10.1.1.211\mnt\vms Z:`.|
|**7.**|Kubernetes cluster|When applying an update on your device that is running a Kubernetes cluster, the Kubernetes virtual machines will restart and reboot. In this instance, only pods that are deployed with replicas specified are automatically restored after an update.  |If you have created individual pods outside a replication controller without specifying a replica set, these pods won't be restored automatically after the device update. You must restore these pods.<br>A replica set replaces pods that are deleted or terminated for any reason, such as node failure or disruptive node upgrade. For this reason, we recommend that you use a replica set even if your application requires only a single pod.|
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
|**18.**|Kubernetes |Kubernetes doesn't support ":" in environment variable names that are used by .NET applications. This is also required for Event Grid IoT Edge module to function on Azure Stack Edge device and other applications. For more information, see [ASP.NET core documentation](/aspnet/core/fundamentals/configuration/?tabs=basicconfiguration#environment-variables).|Replace ":" by double underscore. For more information, see [Kubernetes issue](https://github.com/kubernetes/kubernetes/issues/53201)|
|**19.** |Azure Arc + Kubernetes cluster |By default, when resource `yamls` are deleted from the Git repository, the corresponding resources aren't deleted from the Kubernetes cluster.  |To allow the deletion of resources when they're deleted from the git repository, set `--sync-garbage-collection` in Arc OperatorParams. For more information, see [Delete a configuration](/azure/azure-arc/kubernetes/tutorial-use-gitops-connected-cluster#additional-parameters). |
|**20.**|NFS |Applications that use NFS share mounts on your device to write data should use Exclusive write. That ensures the writes are written to the disk.| |
|**21.**|Compute configuration |Compute configuration fails in network configurations where gateways or switches or routers respond to Address Resolution Protocol (ARP) requests for systems that don't exist on the network.| |
|**22.**|Compute and Kubernetes |If Kubernetes is set up first on your device, it claims all the available GPUs. Hence, it isn't possible to create Azure Resource Manager VMs using GPUs after setting up the Kubernetes. |If your device has 2 GPUs, then you can create one VM that uses the GPU and then configure Kubernetes. In this case, Kubernetes will use the remaining available one GPU. |
|**23.**|Custom script VM extension |There's a known issue in the Windows VMs that were created in an earlier release and the device was updated to 2103. <br> If you add a custom script extension on these VMs, the Windows VM Guest Agent (Version 2.7.41491.901 only) gets stuck in the update causing the extension deployment to time out. | To work around this issue: <br> 1. Connect to the Windows VM using remote desktop protocol (RDP). <br> 2. Make sure that the `waappagent.exe` is running on the machine: `Get-Process WaAppAgent`. <br> 3. If the `waappagent.exe` isn't running, restart the `rdagent` service: `Get-Service RdAgent` \| `Restart-Service`. Wait for 5 minutes.<br> 4. While the `waappagent.exe` is running, kill the `WindowsAzureGuest.exe` process. <br> 5. After you kill the process, the process starts running again with the newer version. <br> 6. Verify that the Windows VM Guest Agent version is 2.7.41491.971 using this command: `Get-Process WindowsAzureGuestAgent` \| `fl ProductVersion`.<br> 7. [Set up custom script extension on Windows VM](azure-stack-edge-gpu-deploy-virtual-machine-custom-script-extension.md).  |
|**24.**|Multi-Process Service (MPS) |When the device software and the Kubernetes cluster are updated, the MPS setting isn't retained for the workloads.   |[Re-enable MPS](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface) and redeploy the workloads that were using MPS. |
|**25.**|Wi-Fi |Wi-Fi doesn't work on Azure Stack Edge Pro 2 in this release. |
|**26.**|Azure IoT Edge |The managed Azure IoT Edge solution on Azure Stack Edge is running on an older, obsolete IoT Edge runtime that is at end of life. For more information, see [IoT Edge v1.1 end of life: What does that mean for me?](https://techcommunity.microsoft.com/t5/internet-of-things-blog/iot-edge-v1-1-eol-what-does-that-mean-for-me/ba-p/3662137). Although the solution doesn't stop working past end of life, there are no plans to update it.  |To run the latest version of Azure IoT Edge [LTSs](../iot-edge/version-history.md#version-history) with the latest updates and features on their Azure Stack Edge, we **recommend** that you deploy a [customer self-managed IoT Edge solution](azure-stack-edge-gpu-deploy-iot-edge-linux-vm.md) that runs on a Linux VM. For more information, see [Move workloads from managed IoT Edge on Azure Stack Edge to an IoT Edge solution on a Linux VM](azure-stack-edge-move-to-self-service-iot-edge.md). |
|**27.**|AKS on Azure Stack Edge |In this release, you can't modify the virtual networks once the AKS cluster is deployed on your Azure Stack Edge cluster.| To modify the virtual network, you must delete the AKS cluster, then modify virtual networks, and then recreate AKS cluster on your Azure Stack Edge. |
|**28.**|AKS Update |The AKS Kubernetes update might fail if one of the AKS VMs isn't running. This issue might be seen in the two-node cluster. |If the AKS update has failed, [Connect to the PowerShell interface of the device](azure-stack-edge-gpu-connect-powershell-interface.md). Check the state of the Kubernetes VMs by running `Get-VM` cmdlet. If the VM is off, run the `Start-VM` cmdlet to restart the VM. Once the Kubernetes VM is running, reapply the update. |
|**29.**|Wi-Fi |Wi-Fi functionality for Azure Stack Edge Mini R is deprecated. |  |
|**30.**| Azure Storage Explorer | The Blob storage endpoint certificate that's autogenerated by the Azure Stack Edge device might not work properly with Azure Storage Explorer. | Replace the Blob storage endpoint certificate. For detailed steps, see [Bring your own certificates](azure-stack-edge-gpu-deploy-configure-certificates.md#bring-your-own-certificates). |
|**31.**| Network connectivity | On a two-node Azure Stack Edge Pro 2 cluster with a teamed virtual switch for Port 1 and Port 2, if a Port 1 or Port 2 link is down, it can take up to 5 seconds to resume network connectivity on the remaining active port. If a Kubernetes cluster uses this teamed virtual switch for management traffic, pod communication may be disrupted up to 5 seconds. |  |
|**32.**| Virtual machine | After the host or Kubernetes node pool VM is shut down, there's a chance that kubelet in node pool VM fails to start due to a CPU static policy error. Node pool VM shows **Not ready** status, and pods won't be scheduled on this VM. | Enter a support session and ssh into the node pool VM, then follow steps in [Changing the CPU Manager Policy](https://kubernetes.io/docs/tasks/administer-cluster/cpu-management-policies/#changing-the-cpu-manager-policy) to remediate the kubelet service. |
|**33.**|VM creation | If you have a Marketplace image created with Azure Stack Edge earlier than 2403 and then create a VM from the existing Marketplace image, your VM creation fails because Azure Stack Edge 2407 changed the download path for the Marketplace image. | Delete the Marketplace image and then create a new image from Azure portal. For detailed steps, see [Troubleshoot VM creation issues](azure-stack-edge-gpu-troubleshoot-virtual-machine-provisioning.md#vm-creation-fails). |

## Next steps

- [Update your device](azure-stack-edge-gpu-install-update.md).
