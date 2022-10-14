---
title: Troubleshoot Azure Arc resource bridge (preview) issues
description: This article tells how to troubleshoot and resolve issues with the Azure Arc resource bridge (preview) when trying to deploy or connect to the service.
ms.date: 09/26/2022
ms.topic: conceptual
---

# Troubleshoot Azure Arc resource bridge (preview) issues

This article provides information on troubleshooting and resolving issues that may occur while attempting to deploy, use, or remove the Azure Arc resource bridge (preview). The resource bridge is a packaged virtual machine, which hosts a *management* Kubernetes cluster. For general information, see [Azure Arc resource bridge (preview) overview](./overview.md).

## General issues

### Logs

For any issues encountered with the Azure Arc resource bridge, you can collect logs for further investigation. To collect the logs, use the Azure CLI [`az arcappliance logs`](/cli/azure/arcappliance/logs) command. This command needs to be run from the client machine from which you've deployed the Azure Arc resource bridge.

The `az arcappliance logs` command requires SSH to the Azure Arc resource bridge VM. The SSH key is saved to the client machine where the deployment of the appliance was performed from. To use a different client machine to run the Azure CLI command, you need to make sure the following files are copied to the new client machine:

```azurecli
$HOME\.KVA\.ssh\logkey.pub
$HOME\.KVA\.ssh\logkey 
```

To run the `az arcappliance logs` command, the path to the kubeconfig must be provided. The kubeconfig is generated after successful completion of the `az arcappliance deploy` command and is placed in the same directory as the CLI command in ./kubeconfig or as specified in `--outfile` (if the parameter was passed).  

If `az arcappliance deploy` was not completed, then the kubeconfig file may exist but may be empty or missing data, so it can't be used for logs collection. In this case, the Appliance VM IP address can be used to collect logs instead. The Appliance VM IP is assigned when the `az arcappliance deploy` command is run, after Control Plane Endpoint reconciliation. For example, if the message displayed in the command window reads "Appliance IP is 10.97.176.27", the command to use for logs collection would be:

```azurecli
az arcappliance logs hci --out-dir c:\logs --ip 10.97.176.27
```

To view the logs, run the following command:

```azurecli
az arcappliance logs <provider> --kubeconfig <path to kubeconfig>
```

To save the logs to a destination folder, run the following command:

```azurecli
az arcappliance logs <provider> --kubeconfig <path to kubeconfig> --out-dir <path to specified output directory>
```

To specify the IP address of the Azure Arc resource bridge virtual machine, run the following command:

```azurecli
az arcappliance logs <provider> --out-dir <path to specified output directory> --ip XXX.XXX.XXX.XXX
```

### Remote PowerShell is not supported

If you run `az arcappliance` CLI commands for Arc Resource Bridge via remote PowerShell, you may experience various problems. For instance, you might see an [EOF error when using the `logs` command](#logs-command-fails-with-eof-error), or an [authentication handshake failure error when trying to install the resource bridge on an Azure Stack HCI cluster](#authentication-handshake-failure).

Using `az arcappliance` commands from remote PowerShell is not currently supported. Instead, sign in to the node through Remote Desktop Protocol (RDP) or use a console session.

### Resource bridge cannot be updated

In this release, all the parameters are specified at time of creation. To update the Azure Arc resource bridge, you must delete it and redeploy it again.

For example, if you specified the wrong location, or subscription during deployment, later the resource creation fails. If you only try to recreate the resource without redeploying the resource bridge VM, you'll see the status stuck at `WaitForHeartBeat`.

To resolve this issue, delete the appliance and update the appliance YAML file. Then redeploy and create the resource bridge.

### Failure due to previous failed deployments

If an Arc resource bridge deployment fails, subsequent deployments may fail due to residual cached folders remaining on the machine.

To prevent this from happening, be sure to run the `az arcappliance delete` command after any failed deployment. This command must be run with the latest `arcappliance` Azure CLI extension. To ensure that you have the latest version installed on your machine, run the following command:

```azurecli
az extension update --name arcappliance
```

If the failed deployment is not successfully removed, residual cached folders may cause future Arc resource bridge deployments to fail. This may cause the error message `Unavailable desc = connection closed before server preface received` to surface when various `az arcappliance` commands are run, including `prepare` and `delete`.

To resolve this error, the .wssd\python and .wssd\kva folders in the user profile directory need to be deleted on the machine where the Arc resource bridge CLI commands are being run. You can delete these manually by navigating to the user profile directory (typically C:\Users\<username>), then deleting the .wssd\python and/or .wssd\kva folders. After they are deleted, try the command again.

### Token refresh error

When you run the Azure CLI commands, the following error may be returned: *The refresh token has expired or is invalid due to sign-in frequency checks by conditional access.* The error occurs because when you sign in to Azure, the token has a maximum lifetime. When that lifetime is exceeded, you need to sign in to Azure again by using the `az login` command.

### `logs` command fails with EOF error

When running the `az arcappliance logs` Azure CLI command, you may see an error: `Appliance logs command failed with error: EOF when reading a line.` This may occur in scenarios similar to the following:

```azurecli
az arcappliance logs hci --kubeconfig .\kubeconfig --out-dir c:\temp --ip 192.168.200.127
+ CategoryInfo : NotSpecified: (WARNING: Comman...s/CLI_refstatus:String) [], RemoteException
+ FullyQualifiedErrorId : NativeCommandError

Please enter cloudservice FQDN/IP: Appliance logs command failed with error: EOF when reading a line[v-Host1]: PS C:\Users\AzureStackAdminD\Documents> az arcappliance logs hci --kubeconfig .\kubeconfig --out-dir c:\temp --ip 192.168.200.127
+ CategoryInfo : NotSpecified: (WARNING: Comman...s/CLI_refstatus:String) [], RemoteException
+ FullyQualifiedErrorId : NativeCommandError

Please enter cloudservice FQDN/IP: Appliance logs command failed with error: EOF when reading a line
```

The `az arcappliance logs` CLI command runs in interactive mode, meaning that it prompts the user for parameters. If the command is run in a scenario where it can't prompt the user for parameters, this error will occur. This is especially common when trying to use remote PowerShell to run the command.

To avoid this error, use Remote Desktop Protocol (RDP) or a console session to sign directly in to the node and locally run the `logs` command (or any `az arcappliance` command). Remote PowerShell is not currently supported by Azure Arc resource bridge.

You can also avoid this error by pre-populating the values that the `logs` command prompts for, thus avoiding the prompt. The example below provides these values into a variable which is then passed to the `logs` command. Be sure to replace `$loginValues` with your cloudservice IP address and the full path to your token credentials.

```azurecli
$loginValues="192.168.200.2
C:\kvatoken.tok"

$user_in = ""
foreach ($val in $loginValues) { $user_in = $user_in + $val + "`n" }

$user_in | az arcappliance logs hci --kubeconfig C:\Users\AzureStackAdminD\.kube\config
```

### Default host resource pools are unavailable for deployment

When using the `az arcappliance createConfig` or `az arcappliance run` command, there will be an interactive experience which shows the list of the VMware entities where user can select to deploy the virtual appliance. This list will show all user-created resource pools along with default cluster resource pools, but the default host resource pools aren't listed.

When the appliance is deployed to a host resource pool, there is no high availability if the host hardware fails. Because of this, we recommend that you don't try to deploy the appliance in a host resource pool.

## Networking issues

### Restricted outbound connectivity

Make sure the URLs listed below are added to your allowlist.

#### Proxy URLs used by appliance agents and services

|**Service**|**Port**|**URL**|**Direction**|**Notes**|
|--|--|--|--|--|
|Microsoft container registry | 443 | `https://mcr.microsoft.com`| Appliance VM IP and Control Plane IP need outbound connection. | Required to pull container images for installation. |  
|Azure Arc Identity service | 443 | `https://*.his.arc.azure.com` | Appliance VM IP and Control Plane IP need outbound connection. | Manages identity and access control for Azure resources |  
|Azure Arc configuration service | 443 | `https://*.dp.kubernetesconfiguration.azure.com`| Appliance VM IP and Control Plane IP need outbound connection. | Used for Kubernetes cluster configuration.|
|Cluster connect service | 443 | `https://*.servicebus.windows.net` | Appliance VM IP and Control Plane IP need outbound connection. | Provides cloud-enabled communication to connect on-premises resources with the cloud. |
|Guest Notification service| 443 | `https://guestnotificationservice.azure.com`| Appliance VM IP and Control Plane IP need outbound connection. | Used to connect on-prem resources to Azure.|
|SFS API endpoint | 443 | msk8s.api.cdp.microsoft.com | Host machine,  Appliance VM IP and Control Plane IP need outbound connection. | Used when downloading product catalog, product bits, and OS images from SFS. |
|Resource bridge (appliance) Dataplane service| 443 | `https://*.dp.prod.appliances.azure.com`| Appliance VM IP and Control Plane IP need outbound connection. | Communicate with resource provider in Azure.|
|Resource bridge (appliance) container image download| 443 | `*.blob.core.windows.net, https://ecpacr.azurecr.io`| Appliance VM IP and Control Plane IP need outbound connection. | Required to pull container images. |
|Resource bridge (appliance) image download| 80 | `*.dl.delivery.mp.microsoft.com`| Host machine,  Appliance VM IP and Control Plane IP need outbound connection. |  Download the Arc Resource Bridge OS images.  |
|Azure Arc for Kubernetes container image download| 443 | `https://azurearcfork8sdev.azurecr.io`|  Appliance VM IP and Control Plane IP need outbound connection. | Required to pull container images. |
|ADHS telemetry service | 443 | adhs.events.data.microsoft.com| Appliance VM IP and Control Plane IP need outbound connection. | Runs inside the appliance/mariner OS. Used periodically to send Microsoft required diagnostic data from control plane nodes. Used when telemetry is coming off Mariner, which would mean any Kubernetes control plane. |
|Microsoft events data service | 443 |v20.events.data.microsoft.com| Appliance VM IP and Control Plane IP need outbound connection. | Used periodically to send Microsoft required diagnostic data from the Azure Stack HCI or Windows Server host. Used when telemetry is coming off Windows like Windows Server or HCI. |

#### Used by other Arc agents

|**Service**|**URL**|
|--|--|
|Azure Resource Manager| `https://management.azure.com`|
|Azure Active Directory| `https://login.microsoftonline.com`|

### Azure Arc resource bridge is unreachable

Azure Arc resource bridge (preview) runs a Kubernetes cluster, and its control plane requires a static IP address. The IP address is specified in the `infra.yaml` file. If the IP address is assigned from a DHCP server, the address can change if not reserved. Rebooting the Azure Arc resource bridge (preview) or VM can trigger an IP address change, resulting in failing services.

Intermittently, the resource bridge (preview) can lose the reserved IP configuration. This is due to the behavior described in [loss of VIPs when systemd-networkd is restarted](https://github.com/acassen/keepalived/issues/1385). When the IP address isn't assigned to the Azure Arc resource bridge (preview) VM, any call to the resource bridge API server will fail. As a result, you can't create any new resource through the resource bridge (preview), ranging from connecting to Azure Arc private cloud, create a custom location, create a VM, etc.

Another possible cause is slow disk access. Azure Arc resource bridge uses etcd which requires 10 ms latency or less per [recommendation](https://docs.openshift.com/container-platform/4.6/scalability_and_performance/recommended-host-practices.html#recommended-etcd-practices_). If the underlying disk has low performance, it can impact the operations, and causing failures.

To resolve this issue, reboot the resource bridge (preview) VM, and it should recover its IP address. If the address is assigned from a DHCP server, reserve the IP address associated with the resource bridge (preview).

### SSL proxy configuration issues

Azure Arc resource bridge must be configured for proxy so that it can connect to the Azure services. This configuration is handled automatically. However, proxy configuration of the client machine isn't configured by the Azure Arc resource bridge.

There are only two certificates that should be relevant when deploying the Arc resource bridge behind an SSL proxy: the SSL certificate for your SSL proxy (so that the host and guest trust your proxy FQDN and can establish an SSL connection to it), and the SSL certificate of the Microsoft download servers. This certificate must be trusted by your proxy server itself, as the proxy is the one establishing the final connection and needs to trust the endpoint. Non-Windows machines may not trust this second certificate by default, so you may need to ensure that it's trusted.

### KVA timeout error

Azure Arc resource bridge is a Kubernetes management cluster that is deployed in an appliance VM directly on the on-premises infrastructure. While trying to deploy Azure Arc resource bridge, a "KVA timeout error" may appear if there is a networking problem that doesn't allow communication of the Arc Resource Bridge appliance VM to the host, DNS, network or internet. This error is typically displayed for the following reasons:

- The appliance VM IP address doesn't have DNS resolution.
- The appliance VM IP address doesn't have internet access to download the required image.
- The host doesn't have routability to the appliance VM IP address.

To resolve this error, ensure that all IP addresses assigned to the Arc Resource Bridge appliance VM can be resolved by DNS and have access to the internet, and that the host can successfully route to the IP addresses.

## Azure-Arc enabled VMs on Azure Stack HCI issues

For general help resolving issues related to Azure-Arc enabled VMs on Azure Stack HCI, see [Troubleshoot Azure Arc-enabled virtual machines](/azure-stack/hci/manage/troubleshoot-arc-enabled-vms).

### Authentication handshake failure

When running an `az arcappliance` command, you may see a connection error: `authentication handshake failed: x509: certificate signed by unknown authority`

This is usually caused when trying to run commands from remote PowerShell, which is not supported by Azure Arc resource bridge.

To install Azure Arc resource bridge on an Azure Stack HCI cluster, `az arcappliance` commands must be run locally on a node in the cluster. Sign in to the node through Remote Desktop Protocol (RDP) or use a console session to run these commands.

## Azure Arc-enabled VMware VCenter issues

### `az arcappliance prepare` failure

The `arcappliance` extension for Azure CLI enables a [prepare](/cli/azure/arcappliance/prepare) command, which enables you to download an OVA template to your vSphere environment. This OVA file is used to deploy the Azure Arc resource bridge. The `az arcappliance prepare` command uses the vSphere SDK and can result in the following error:

```azurecli
$ az arcappliance prepare vmware --config-file <path to config> 

Error: Error in reading OVA file: failed to parse ovf: strconv.ParseInt: parsing "3670409216": 
value out of range.
```

This error occurs when you run the Azure CLI commands in a 32-bit context, which is the default behavior. The vSphere SDK only supports running in a 64-bit context. The specific error returned from the vSphere SDK is `Unable to import ova of size 6GB using govc`. When you install the Azure CLI, it's a 32-bit Windows Installer package. However, the Azure CLI `az arcappliance` extension needs to run in a 64-bit context.

To resolve this issue, perform the following steps to configure your client machine with the Azure CLI 64-bit version:

1. Uninstall the current version of the Azure CLI on Windows following these [steps](/cli/azure/install-azure-cli-windows#uninstall).
1. Install version 3.6 or higher of [Python](https://www.python.org/downloads/windows/) (64-bit).

   > [!IMPORTANT]
   > After you install Python, make sure to confirm that its path is added to the PATH environmental variable.

1. Install the [pip](https://pypi.org/project/pip/) package installer for Python.
1. Verify Python is installed correctly by running `py` in a Command Prompt.
1. From an elevated PowerShell console, run `pip install azure-cli` to install the Azure CLI from PyPI.

After you complete these steps, you can get started using the Azure Arc appliance CLI extension in a new PowerShell console.

### Error during host configuration

When you deploy the resource bridge on VMware vCenter, if you have been using the same template to deploy and delete the appliance multiple times, you may encounter the following error:

`Appliance cluster deployment failed with error:
Error: An error occurred during host configuration`

To resolve this issue, delete the existing template manually. Then run [`az arcappliance prepare`](/cli/azure/arcappliance/prepare) to download a new template for deployment.

### Unable to find folders

When deploying the resource bridge on VMware vCenter, you specify the folder in which the template and VM will be created. The folder must be VM and template folder type. Other types of folder, such as storage folders, network folders, or host and cluster folders, can't be used by the resource bridge deployment.

### Insufficient permissions

When deploying the resource bridge on VMware Vcenter, you may get an error saying that you have insufficient permission. To resolve this issue, make sure that your user account has all of the following privileges in VMware vCenter and then try again.

```
"Datastore.AllocateSpace"
"Datastore.Browse"
"Datastore.DeleteFile"
"Datastore.FileManagement"
"Folder.Create"
"Folder.Delete"
"Folder.Move"
"Folder.Rename"
"InventoryService.Tagging.CreateTag"
"Sessions.ValidateSession"
"Network.Assign"
"Resource.ApplyRecommendation"
"Resource.AssignVMToPool"
"Resource.HotMigrate"
"Resource.ColdMigrate"
"StorageViews.View"
"System.Anonymous"
"System.Read"
"System.View"
"VirtualMachine.Config.AddExistingDisk"
"VirtualMachine.Config.AddNewDisk"
"VirtualMachine.Config.AddRemoveDevice"
"VirtualMachine.Config.AdvancedConfig"
"VirtualMachine.Config.Annotation"
"VirtualMachine.Config.CPUCount"
"VirtualMachine.Config.ChangeTracking"
"VirtualMachine.Config.DiskExtend"
"VirtualMachine.Config.DiskLease"
"VirtualMachine.Config.EditDevice"
"VirtualMachine.Config.HostUSBDevice"
"VirtualMachine.Config.ManagedBy"
"VirtualMachine.Config.Memory"
"VirtualMachine.Config.MksControl"
"VirtualMachine.Config.QueryFTCompatibility"
"VirtualMachine.Config.QueryUnownedFiles"
"VirtualMachine.Config.RawDevice"
"VirtualMachine.Config.ReloadFromPath"
"VirtualMachine.Config.RemoveDisk"
"VirtualMachine.Config.Rename"
"VirtualMachine.Config.ResetGuestInfo"
"VirtualMachine.Config.Resource"
"VirtualMachine.Config.Settings"
"VirtualMachine.Config.SwapPlacement"
"VirtualMachine.Config.ToggleForkParent"
"VirtualMachine.Config.UpgradeVirtualHardware"
"VirtualMachine.GuestOperations.Execute"
"VirtualMachine.GuestOperations.Modify"
"VirtualMachine.GuestOperations.ModifyAliases"
"VirtualMachine.GuestOperations.Query"
"VirtualMachine.GuestOperations.QueryAliases"
"VirtualMachine.Hbr.ConfigureReplication"
"VirtualMachine.Hbr.MonitorReplication"
"VirtualMachine.Hbr.ReplicaManagement"
"VirtualMachine.Interact.AnswerQuestion"
"VirtualMachine.Interact.Backup"
"VirtualMachine.Interact.ConsoleInteract"
"VirtualMachine.Interact.CreateScreenshot"
"VirtualMachine.Interact.CreateSecondary"
"VirtualMachine.Interact.DefragmentAllDisks"
"VirtualMachine.Interact.DeviceConnection"
"VirtualMachine.Interact.DisableSecondary"
"VirtualMachine.Interact.DnD"
"VirtualMachine.Interact.EnableSecondary"
"VirtualMachine.Interact.GuestControl"
"VirtualMachine.Interact.MakePrimary"
"VirtualMachine.Interact.Pause"
"VirtualMachine.Interact.PowerOff"
"VirtualMachine.Interact.PowerOn"
"VirtualMachine.Interact.PutUsbScanCodes"
"VirtualMachine.Interact.Record"
"VirtualMachine.Interact.Replay"
"VirtualMachine.Interact.Reset"
"VirtualMachine.Interact.SESparseMaintenance"
"VirtualMachine.Interact.SetCDMedia"
"VirtualMachine.Interact.SetFloppyMedia"
"VirtualMachine.Interact.Suspend"
"VirtualMachine.Interact.TerminateFaultTolerantVM"
"VirtualMachine.Interact.ToolsInstall"
"VirtualMachine.Interact.TurnOffFaultTolerance"
"VirtualMachine.Inventory.Create"
"VirtualMachine.Inventory.CreateFromExisting"
"VirtualMachine.Inventory.Delete"
"VirtualMachine.Inventory.Move"
"VirtualMachine.Inventory.Register"
"VirtualMachine.Inventory.Unregister"
"VirtualMachine.Namespace.Event"
"VirtualMachine.Namespace.EventNotify"
"VirtualMachine.Namespace.Management"
"VirtualMachine.Namespace.ModifyContent"
"VirtualMachine.Namespace.Query"
"VirtualMachine.Namespace.ReadContent"
"VirtualMachine.Provisioning.Clone"
"VirtualMachine.Provisioning.CloneTemplate"
"VirtualMachine.Provisioning.CreateTemplateFromVM"
"VirtualMachine.Provisioning.Customize"
"VirtualMachine.Provisioning.DeployTemplate"
"VirtualMachine.Provisioning.DiskRandomAccess"
"VirtualMachine.Provisioning.DiskRandomRead"
"VirtualMachine.Provisioning.FileRandomAccess"
"VirtualMachine.Provisioning.GetVmFiles"
"VirtualMachine.Provisioning.MarkAsTemplate"
"VirtualMachine.Provisioning.MarkAsVM"
"VirtualMachine.Provisioning.ModifyCustSpecs"
"VirtualMachine.Provisioning.PromoteDisks"
"VirtualMachine.Provisioning.PutVmFiles"
"VirtualMachine.Provisioning.ReadCustSpecs"
"VirtualMachine.State.CreateSnapshot"
"VirtualMachine.State.RemoveSnapshot"
"VirtualMachine.State.RenameSnapshot"
"VirtualMachine.State.RevertToSnapshot"
```

## Next steps

[Understand recovery operations for resource bridge in Azure Arc-enabled VMware vSphere disaster scenarios](../vmware-vsphere/disaster-recovery.md)

If you don't see your problem here or you can't resolve your issue, try one of the following channels for support:

- Get answers from Azure experts through [Microsoft Q&A](/answers/topics/azure-arc.html).

- Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.

- [Open an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md).
