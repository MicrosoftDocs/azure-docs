---
title: Troubleshoot Azure Arc resource bridge (preview) issues
description: This article tells how to troubleshoot and resolve issues with the Azure Arc resource bridge (preview) when trying to deploy or connect to the service.
ms.date: 11/09/2021
ms.topic: conceptual
---

# Troubleshoot Azure Arc resource bridge (preview) issues

This article provides information on troubleshooting and resolving issues that may occur while attempting to deploy, use, or remove the Azure Arc resource bridge (preview). The resource bridge is a packaged virtual machine, which hosts a *management* Kubernetes cluster. For general information, see [Azure Arc resource bridge (preview) overview](./overview.md).

> [!IMPORTANT]
> In the interest of ensuring new features are documented no later than their release, this page may include documentation for features that may not yet be publicly available.

## Logs

For any issues encountered with the Azure Arc resource bridge, you can collect logs for further investigation. To collect the logs, use the Azure CLI [Az arcappliance log](placeholder for published ref API) command. This command needs to be run from the client machine where you've deployed the Azure Arc resource bridge from.

The `Az arcappliance log` command requires SSH to the Azure Arc resource bridge VM. The SSH key is saved to the client machine where the deployment of the appliance was performed from. If you are going to use a different client machine to run the Azure CLI command, you need to make sure the following files are copied to the new client machine:

```azurecli
$HOME\.KVA\.ssh\logkey.pub
$HOME\.KVA\.ssh\logkey 
```
To view the logs, run the following command:

```azurecli
az arcappliance logs <provider> --kubeconfig <path to kubeconfig>
```

To save the logs to a destination folder, run the following command:

```azurecli
az arcappliance logs <provider> --kubeconfig <path to kubeconfig> --out-dir <path to specified output directory>
```

To specify the ip address of the Azure Arc resource bridge virtual machine, run the following command:

```azurecli
az arcappliance logs <provider> --out-dir <path to specified output directory> --ip XXX.XXX.XXX.XXX
```

## Az Arcappliance prepare fails when deploying to VMware

The **arcappliance** extension for Azure CLI enables a prepare command, which enables you to download an OVA template to your vSphere environment. This OVA file is used to deploy the Azure Arc resource bridge. The `az arcappliance prepare` command uses the vSphere SDK and can result in the following error:

```azurecli
$ az arcappliance prepare vmware --config-file <path to config> 

Error: Error in reading OVA file: failed to parse ovf: strconv.ParseInt: parsing "3670409216": 
value out of range.
```

### Cause

This error occurs when you run the Azure CLI commands in a 32-bit context, which is the default behavior. The vSphere SDK only supports running in a 64-bit context. The specific error returned from the vSphere SDK is `Unable to import ova of size 6GB using govc`. When you install the Azure CLI, it is a 32-bit Windows Installer package. However, the Azure CLI `Az arcappliance` extension needs to run in a 64-bit context.

### Resolution

Perform the following steps to configure your client machine with the Azure CLI 64-bit version.

1. Uninstall the current version of the Azure CLI on Windows following these [steps](/cli/azure/install-azure-cli-windows#uninstall).
1. Install version 3.6 or higher of [Python](https://www.python.org/downloads/windows/) (64-bit).

   > [!NOTE]
   > It is important after installing Python to confirm that its path is added to the PATH environmental variable.

1. Install the [pip](https://pypi.org/project/pip/) package installer for Python.
1. Verify Python is installed correctly by running `py` in a Command Prompt.
1. From an elevated PowerShell console, run `pip install azure-cli` to install the Azure CLI from PyPI.

After completing these steps, in a new PowerShell console you can get started using the Azure Arc appliance CLI extension.

## Azure Arc resource bridge (preview) is unreachable

Azure Arc resource bridge (preview) runs a Kubernetes cluster, and its control plane requires a static IP address. The IP address is specified in the `infra.yaml` file. If the IP address is assigned from a DHCP server, the address can change if not reserved. Rebooting the Azure Arc resource bridge (preview) or VM can trigger an IP address change, resulting in failing services.

Intermittently, the resource bridge (preview) can lose the reserved IP configuration. This is due to the behavior described in [loss of VIPs when systemd-networkd is restarted](https://github.com/acassen/keepalived/issues/1385). When the IP address is not assigned to the Azure Arc resource bridge (preview) VM, any call to the resource bridge API server will fail. As a result you are unable to create any new resource through the resource bridge (preview), ranging from connecting to Azure Arc private cloud, create a custom location, create a VM, etc.

Another possible cause is slow disk access. Azure Arc resource bridge uses etcd which requires 10ms latency or less per [recommendation](https://docs.openshift.com/container-platform/4.6/scalability_and_performance/recommended-host-practices.html#recommended-etcd-practices_). If the underlying disk has low performance, it can impact the operations, and causing failures.

### Resolution

Reboot the resource bridge (preview) VM and it should recover its IP address. If the address is assigned from a DHCP server, reserve the IP address associated with the resource bridge (preview).

## Resource bridge cannot be updated

In this release, all the parameters are specified at time of creation. When there is a need to update the Azure Arc resource bridge, you need to delete it and redeploy it again.

For example, if you specified the wrong location, or subscription during deployment, later the resource creation fails. If you only try to recreate the resource without redeploying the resource bridge VM, you will see the status stuck at *WaitForHeartBeat*.

### Resolution

Delete the appliance, update the appliance YAML file, then redeploy and create the resource bridge.

## Token refresh error

When you run the Azure CLI commands the following error may be returned, *The refresh token has expired or is invalid due to sign-in frequency checks by conditional access.* The error occurs because when you sign into Azure, the token has a maximum lifetime. When that lifetime is exceeded, you need to sign in to Azure again.

### Resolution

Sign into Azure again using the `Az login` command.

## Next steps

If you don't see your problem here or you can't resolve your issue, try one of the following channels for support:

* Get answers from Azure experts through [Microsoft Q&A](/answers/topics/azure-arc.html).

* Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.

* File an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/), and select **Get Support**.