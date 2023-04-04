---
title: Azure Stack Edge GA release notes| Microsoft Docs
description: Describes critical open issues and resolutions for the Azure Stack Edge running general availability release.
services: databox
author: alkohli
 
ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 03/05/2021
ms.author: alkohli
---

# Azure Stack Edge Pro with GPU General Availability (GA) release notes

[!INCLUDE [applies-to-Pro-GPU-sku](../../includes/azure-stack-edge-applies-to-gpu-sku.md)]

The following release notes identify the critical open issues and the resolved issues for general availability (GA) release for your Azure Stack Edge Pro devices with GPU.

The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they are added. Before you deploy your Azure Stack Edge Pro device, carefully review the information contained in the release notes.

This article applies to the **Azure Stack Edge Pro 2010** release which maps to software version number **2.1.1377.2170**.

## What's new

The following new features are available in the Azure Stack Edge 2010 release. 

- **Storage classes** - In this release, Storage classes are available that let you dynamically provision storage. For more information, see [Kubernetes storage management on your Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-kubernetes-storage.md#dynamicprovisioning). 
- **Kubernetes dashboard with metrics server** - In this release, a Kubernetes Dashboard is added with a metrics server add-on. You can use the dashboard to get an overview of the applications running on your Azure Stack Edge Pro device, view status of Kubernetes cluster resources, and see any errors that have occurred on the device. The Metrics server aggregates the CPU and memory usage across Kubernetes resources on the device. For more information, see [Use Kubernetes dashboard to monitor your Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-monitor-kubernetes-dashboard.md).
- **Azure Arc-enabled Kubernetes on Azure Stack Edge Pro** - Beginning this release, you can deploy application workloads on your Azure Stack Edge Pro device via Azure Arc-enabled Kubernetes. Azure Arc is a hybrid management tool that allows you to deploy applications on your Kubernetes clusters. For more information, see [Deploy workloads via Azure Arc on your Azure Stack Edge Pro device](azure-stack-edge-gpu-deploy-arc-kubernetes-cluster.md).  

## Known issues 

The following table provides a summary of known issues for the Azure Stack Edge Pro device.

| No. | Feature | Issue | Workaround/comments |
| --- | --- | --- | --- |
|**1.**|Preview features |For this GA release, the following features: Local Azure Resource Manager, VMs, Kubernetes, Azure Arc-enabled Kubernetes, Multi-Process service (MPS) for GPU - are all available in preview for your Azure Stack Edge Pro device.  |These features will be generally available in a later release. |
| **2.** |Azure Stack Edge Pro + Azure SQL | Creating SQL database requires Administrator access.   |Do the following steps instead of Steps 1-2 in [Tutorial: Store data at the edge with SQL Server databases](../iot-edge/tutorial-store-data-sql-server.md#create-the-sql-database). <ul><li>In the local UI of your device, enable compute interface. Select **Compute > Port # > Enable for compute > Apply.**</li><li>Download [sqlcmd utility](/sql/tools/sqlcmd-utility) on your client machine.</li><li>Connect to your compute interface IP address (the port that was enabled), adding a ",1401" to the end of the address.</li><li>Final command will look like this: sqlcmd -S {Interface IP},1401 -U SA -P "Strong!Passw0rd".</li>After this, steps 3-4 from the current documentation should be identical. </li></ul> |
| **3.** |Refresh| Incremental changes to blobs restored via **Refresh** are NOT supported |For Blob endpoints, partial updates of blobs after a Refresh, may result in the updates not getting uploaded to the cloud. For example, sequence of actions such as:<ul><li>Create blob in cloud. Or delete a previously uploaded blob from the device.</li><li>Refresh blob from the cloud into the appliance using the refresh functionality.</li><li>Update only a portion of the blob using Azure SDK REST APIs.</li></ul>These actions can result in the updated sections of the blob to not get updated in the cloud. <br>**Workaround**: Use tools such as robocopy, or regular file copy through Explorer or command line, to replace entire blobs.|
|**4.**|Throttling|During throttling, if new writes are not allowed into the device, writes done by NFS client fail with "Permission Denied" error.| The error will show as below:<br>`hcsuser@ubuntu-vm:~/nfstest$ mkdir test`<br>mkdir: cannot create directory 'test': Permission denied​|
|**5.**|Blob Storage ingestion|When using AzCopy version 10 for Blob storage ingestion, run AzCopy with the following argument: `Azcopy <other arguments> --cap-mbps 2000`| If these limits are not provided for AzCopy, then it could potentially send a large number of requests to the device and result in issues with the service.|
|**6.**|Tiered storage accounts|The following apply when using tiered storage accounts:<ul><li> Only block blobs are supported. Page blobs are not supported.</li><li>There is no snapshot or copy API support.</li><li> Hadoop workload ingestion through `distcp` is not supported as it uses the copy operation heavily.</li></ul>||
|**7.**|NFS share connection|If multiple processes are copying to the same share, and the `nolock` attribute is not used, you may see errors during the copy.​|The `nolock` attribute must be passed to the mount command to copy files to the NFS share. For example: `C:\Users\aseuser mount -o anon \\10.1.1.211\mnt\vms Z:`.|
|**8.**|Kubernetes cluster|When applying an update on your device that is running a kubernetes cluster, the kubernetes virtual machines will restart and reboot. In this instance, only pods that are deployed with replicas specified are automatically restored after an update.  |If you have created individual pods outside of a replication controller without specifying a replica set, then these pods will not be automatically restored after the device update. You will need to restore these pods.<br>A replica set replaces pods that are deleted or terminated for any reason, such as node failure or disruptive node upgrade. For this reason, we recommend that you use a replica set even if your application requires only a single pod.|
|**9.**|Kubernetes cluster|Kubernetes on Azure Stack Edge Pro is supported only with Helm v3 or later. For more information, go to [Frequently asked questions: Removal of Tiller](https://v3.helm.sh/docs/faq/).|
|**10.**|Azure Arc-enabled Kubernetes |For the GA release, Azure Arc-enabled Kubernetes is updated from version 0.1.18 to 0.2.9. As the Azure Arc-enabled Kubernetes update is not supported on Azure Stack Edge device, you will need to redeploy Azure Arc-enabled Kubernetes.|Follow these steps:<ol><li>[Apply device software and Kubernetes updates](azure-stack-edge-gpu-install-update.md).</li><li>Connect to the [PowerShell interface of the device](azure-stack-edge-gpu-connect-powershell-interface.md).</li><li>Remove the existing Azure Arc agent. Type: `Remove-HcsKubernetesAzureArcAgent`.</li><li>Deploy [Azure Arc to a new resource](azure-stack-edge-gpu-deploy-arc-kubernetes-cluster.md). Do not use an existing Azure Arc resource.</li></ol>|
|**11.**|Azure Arc-enabled Kubernetes|Azure Arc deployments are not supported if web proxy is configured on your Azure Stack Edge Pro device.||
|**12.**|Kubernetes |Port 31000 is reserved for Kubernetes Dashboard. Similarly, in the default configuration, the IP addresses 172.28.0.1 and 172.28.0.10, are reserved for Kubernetes service and Core DNS service respectively.|Do not use reserved IPs.|
|**13.**|Kubernetes |Kubernetes does not currently allow multi-protocol LoadBalancer services. For example, a DNS service that would have to listen on both TCP and UDP. |To work around this limitation of Kubernetes with MetalLB, two services (one for TCP, one for UDP) can be created on the same pod selector. These services use the same sharing key and spec.loadBalancerIP to share the same IP address. IPs can also be shared if you have more services than available IP addresses. <br> For more information, see [IP address sharing](https://metallb.universe.tf/usage/#ip-address-sharing).|
|**14.**|Kubernetes cluster|Existing Azure IoT Edge marketplace modules may require modifications to run on IoT Edge on Azure Stack Edge device.|For more information, see Modify Azure IoT Edge modules from marketplace to run on Azure Stack Edge device.<!-- insert link-->|
|**15.**|Kubernetes |File-based bind mounts are not supported with Azure IoT Edge on Kubernetes on Azure Stack Edge device.|IoT Edge uses a translation layer to translate `ContainerCreate` options to Kubernetes constructs. Creating `Binds` maps to `hostpath` directory and thus file-based bind mounts cannot be bound to paths in IoT Edge containers. If possible, map the parent directory.|
|**16.**|Kubernetes |If you bring your own certificates for IoT Edge and add those on your Azure Stack Edge device after the compute is configured on the device, the new certificates are not picked up.|To work around this problem, you should upload the certificates before you configure compute on the device. If the compute is already configured, [Connect to the PowerShell interface of the device and run IoT Edge commands](azure-stack-edge-gpu-connect-powershell-interface.md#use-iotedge-commands). Restart `iotedged` and `edgehub` pods.|
|**17.**|Certificates |In certain instances, certificate state in the local UI may take several seconds to update. |The following scenarios in the local UI may be affected.<ul><li>**Status** column in **Certificates** page.</li><li>**Security** tile in **Get started** page.</li><li>**Configuration** tile in **Overview** page.</li></ul>  |
|**17.**|IoT Edge |Modules deployed through IoT Edge can't use host network. | |
|**18.**|Compute + Kubernetes |Compute/Kubernetes does not support NTLM web proxy. ||
|**19.**|Compute + web proxy + update |If you have compute configured with web proxy, then compute update may fail. |We recommend that you disable compute before the update. |

<!--|**18.**|Azure Private Edge Zone (Preview) |There is a known issue with Virtual Network Function VM if the VM was created on Azure Stack Edge device running earlier preview builds such as 2006/2007b and then the device was updated to 2009 GA release. The issue is that the VNF information can't be retrieved or any new VNFs can't be created unless the VNF VMs are deleted before the device is updated.  |Before you update Azure Stack Edge device to 2009 release, use the PowerShell command `get-mecvnf` followed by `remove-mecvnf <VNF guid>` to remove all Virtual Network Function VMs one at a time. After the upgrade, you will need to redeploy the same VNFs.|-->




## Next steps

- [Prepare to deploy Azure Stack Edge Pro device with GPU](azure-stack-edge-gpu-deploy-prep.md)
