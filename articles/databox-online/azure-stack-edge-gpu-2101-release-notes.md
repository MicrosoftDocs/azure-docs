---
title: Azure Stack Edge Pro 2101 release notes
description: Describes critical open issues and resolutions for the Azure Stack Edge Pro running 2101 release.
author: alkohli
ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 03/08/2021
ms.author: alkohli
---

# Azure Stack Edge 2101 release notes

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

The following release notes identify the critical open issues and the resolved issues for the 2101 release for your Azure Stack Edge devices. These release notes are applicable for Azure Stack Edge Pro GPU, Azure Stack Edge Pro R, and Azure Stack Edge Mini R devices. Features and issues that correspond to a specific model are called out wherever applicable.

The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they are added. Before you deploy your device, carefully review the information contained in the release notes.

This article applies to the **Azure Stack Edge 2101** release, which maps to software version number **2.2.1473.2521**.

## What's new

The following new features are available in the Azure Stack Edge 2101 release. 

- **General availability of Azure Stack Edge Pro R and Azure Stack Edge Mini R devices** - Starting with this release, Azure Stack Edge Pro R and Azure Stack Edge Mini R devices will be available. For more information, see [What is Azure Stack Edge Pro R](azure-stack-edge-pro-r-overview.md) and [What is Azure Stack Edge Mini R](azure-stack-edge-mini-r-overview.md).  
- **Cloud management of Virtual Machines** - Beginning this release, you can create and manage the virtual machines on your device via the Azure portal. For more information, see [Deploy VMs via the Azure portal](azure-stack-edge-gpu-deploy-virtual-machine-portal.md).
- **Integration with Azure Monitor** - You can now use Azure Monitor to monitor containers from the compute applications that run on your device. The Azure Monitor metrics store is not supported in this release. For more information, see how to [Enable Azure Monitor on your device](azure-stack-edge-gpu-enable-azure-monitor.md).
- **Edge container registry** - In this release, an Edge container registry is available that provides a repository at the edge on your device. You can use this registry to store and manage container images. For more information, see [Enable Edge container registry](azure-stack-edge-gpu-deploy-arc-kubernetes-cluster.md). 
- **Virtual Private Network (VPN)** - Use VPN to provide another layer of encryption for the data that flows between the devices and the cloud. VPN is available only on Azure Stack Edge Pro R and Azure Stack Edge Mini R. For more information, see how to [Configure VPN on your device](azure-stack-edge-mini-r-configure-vpn-powershell.md). 
- **Rotate encryption-at-rest keys** - You can now rotate the encryption-at-rest keys that are used to protect the drives on your device. This feature is available only for Azure Stack Edge Pro R and Azure Stack Edge Mini R devices. For more information, see [Rotate encryption-at-rest keys](azure-stack-edge-gpu-manage-access-power-connectivity-mode.md#manage-access-to-device-data).
- **Proactive logging** - Starting this release, you can enable proactive log collection on your device based on the system health indicators to help efficiently troubleshoot any device issues. For more information, see [Proactive log collection on your device](azure-stack-edge-gpu-proactive-log-collection.md).


## Known issues in 2101 release

The following table provides a summary of known issues in the 2101 release.

| No. | Feature | Issue | Workaround/comments |
| --- | --- | --- | --- |
|**1.**|Preview features |For this release, the following features: Local Azure Resource Manager, VMs, Cloud management of VMs, Azure Arc-enabled Kubernetes, VPN for Azure Stack Edge Pro R and Azure Stack Edge Mini R, Multi-process service (MPS) for Azure Stack Edge Pro GPU  - are all available in preview.  |These features will be generally available in later releases. |
|**2.**|Kubernetes Dashboard | *Https* endpoint for Kubernetes Dashboard with SSL certificate is not supported. | |
|**3.**|Kubernetes |Edge container registry does not work when web proxy is enabled.|The functionality will be available in a future release. |
|**4.**|Kubernetes |Edge container registry does not work with IoT Edge modules.| |
|**5.**|Kubernetes |Kubernetes doesn't support ":" in environment variable names that are used by .NET applications. This is also required for Event grid IoT Edge module to function on Azure Stack Edge device and other applications. For more information, see [ASP.NET core documentation](/aspnet/core/fundamentals/configuration/?tabs=basicconfiguration&view=aspnetcore-3.1&preserve-view=true#environment-variables).|Replace ":" by double underscore. For more information,see [Kubernetes issue](https://github.com/kubernetes/kubernetes/issues/53201)|
|**6.** |Azure Arc + Kubernetes cluster |By default, when resource `yamls` are deleted from the Git repository, the corresponding resources are not deleted from the Kubernetes cluster.  |To allow the deletion of resources when they're deleted from the git repository, set `--sync-garbage-collection` in Arc OperatorParams. For more information, see [Delete a configuration](../azure-arc/kubernetes/tutorial-use-gitops-connected-cluster.md#additional-parameters). |
|**7.**|NFS |Applications that use NFS share mounts on your device to write data should use Exclusive write. That ensures the writes are written to the disk.| |
|**8.**|Compute configuration |Compute configuration fails in network configurations where gateways or switches or routers respond to Address Resolution Protocol (ARP) requests for systems that do not exist on the network.| |
|**9.**|Compute and Kubernetes |If Kubernetes is set up first on your device, it claims all the available GPUs. Hence, it is not possible to create Azure Resource Manager VMs using GPUs after setting up the Kubernetes. |If your device has 2 GPUs, then you can create 1 VM that uses the GPU and then configure Kubernetes. In this case, Kubernetes will use the remaining available 1 GPU. |


## Known issues from previous releases

The following table provides a summary of known issues carried over from the previous releases.

| No. | Feature | Issue | Workaround/comments |
| --- | --- | --- | --- |
|**1.**|Azure Stack Edge Pro + Azure SQL | Creating SQL database requires Administrator access. |Do the following steps instead of Steps 1-2 in [Tutorial: Store data at the edge with SQL Server databases](../iot-edge/tutorial-store-data-sql-server.md#create-the-sql-database). <ul><li>In the local UI of your device, enable compute interface. Select **Compute > Port # > Enable for compute > Apply.**</li><li>Download `sqlcmd` on your client machine from [sqlcmd Utility](/sql/tools/sqlcmd-utility) </li><li>Connect to your compute interface IP address (the port that was enabled), adding a `,1401` to the end of the address.</li><li>Final command will look like this: `sqlcmd -S {Interface IP},1401 -U SA -P "Strong!Passw0rd"`.</li>After this, steps 3-4 from the current documentation should be identical. </li></ul> |
|**2.**|Refresh| Incremental changes to blobs restored via **Refresh** are NOT supported |For Blob endpoints, partial updates of blobs after a Refresh, may result in the updates not getting uploaded to the cloud. For example, sequence of actions such as:<ul><li>Create blob in cloud. Or delete a previously uploaded blob from the device.</li><li>Refresh blob from the cloud into the appliance using the refresh functionality.</li><li>Update only a portion of the blob using Azure SDK REST APIs.</li></ul>These actions can result in the updated sections of the blob to not get updated in the cloud. <br>**Workaround**: Use tools such as robocopy, or regular file copy through Explorer or command line, to replace entire blobs.|
|**3.**|Throttling|During throttling, if new writes to the device aren't allowed, writes by the NFS client fail with a "Permission Denied" error.| The error will show as below:<br>`hcsuser@ubuntu-vm:~/nfstest$ mkdir test`<br>mkdir: cannot create directory 'test': Permission denied​|
|**4.**|Blob Storage ingestion|When using AzCopy version 10 for Blob storage ingestion, run AzCopy with the following argument: `Azcopy <other arguments> --cap-mbps 2000`| If these limits aren't provided for AzCopy, it could potentially send a large number of requests to the device, resulting in issues with the service.|
|**5.**|Tiered storage accounts|The following apply when using tiered storage accounts:<ul><li> Only block blobs are supported. Page blobs are not supported.</li><li>There is no snapshot or copy API support.</li><li> Hadoop workload ingestion through `distcp` is not supported as it uses the copy operation heavily.</li></ul>||
|**6.**|NFS share connection|If multiple processes are copying to the same share, and the `nolock` attribute isn't used, you may see errors during the copy.​|The `nolock` attribute must be passed to the mount command to copy files to the NFS share. For example: `C:\Users\aseuser mount -o anon \\10.1.1.211\mnt\vms Z:`.|
|**7.**|Kubernetes cluster|When applying an update on your device that is running a kubernetes cluster, the kubernetes virtual machines will restart and reboot. In this instance, only pods that are deployed with replicas specified are automatically restored after an update.  |If you have created individual pods outside a replication controller without specifying a replica set, these pods won't be restored automatically after the device update. You will need to restore these pods.<br>A replica set replaces pods that are deleted or terminated for any reason, such as node failure or disruptive node upgrade. For this reason, we recommend that you use a replica set even if your application requires only a single pod.|
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


<!--|**18.**|Azure Private Edge Zone (Preview) |There is a known issue with Virtual Network Function VM if the VM was created on Azure Stack Edge device running earlier preview builds such as 2006/2007b and then the device was updated to 2009 GA release. The issue is that the VNF information can't be retrieved or any new VNFs can't be created unless the VNF VMs are deleted before the device is updated.  |Before you update Azure Stack Edge device to 2009 release, use the PowerShell command `get-mecvnf` followed by `remove-mecvnf <VNF guid>` to remove all Virtual Network Function VMs one at a time. After the upgrade, you will need to redeploy the same VNFs.|-->


## Next steps

- [Update your device](azure-stack-edge-gpu-install-update.md)
