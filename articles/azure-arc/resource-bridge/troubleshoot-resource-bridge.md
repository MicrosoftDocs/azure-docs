---
title: Troubleshoot Azure Arc resource bridge (preview) issues
description: This article tells how to troubleshoot and resolve issues with the Azure Arc resource bridge (preview) when trying to deploy or connect to the service.
ms.date: 10/25/2021
ms.topic: conceptual
---

# Troubleshoot Azure Arc resource bridge (preview) issues

This article provides information on troubleshooting and resolving issues that may occur while attempting to deploy, use, or remove the Azure Arc resource bridge (preview). The resource bridge is a packaged virtual machine, which hosts a *management* Kubernetes cluster. For general information, see [Azure Arc resource bridge (preview) overview](./overview.md).

## Azure Arc resource bridge (preview) is unreachable

Azure Arc resource bridge (preview) runs a Kubernetes cluster, and its control plane requires a static IP address. The IP address is specified in the `infra.yaml` file. Sometimes, the resource bridge VM loses the reserved IP configuration. This is due to the behavior described in [loss of VIP's when systemd-networkd is restarted](https://github.com/acassen/keepalived/issues/1385). When the IP address is not assigned to the resource bridge VM, any call to the resource bridge API server will fail. As a result you are unable to create any new resource through the resource bridge, ranging from connecting to Azure Arc private cloud, create a custom location, create a VM, etc.

### Workaround

Reboot the resource bridge VM and it will recover its IP address.

## Resource bridge cannot be updated

For this release, all the parameters specified at the creation time, there is not update to the properties. When there is a need to update the resource, you will need to delete it and redeploy it again.

For example, if you specified the wrong location, or subscription when you deploy the resource bridge, later the resource creation fails. If you only try to recreate the resource without redeploying the resource bridge VM, you will see the status stuck at *WaitForHeartBeat*.

**Workaround**

Delete the appliance, update the appliance YAML file, then redeploy and create the resource bridge.

## Token refresh error

When you run the Azure CLI commands the following error may be returned, *The refresh token has expired or is invalid due to sign-in frequency checks by conditional access.* This happens because when you sign into Azure, the token has a maximum lifetime. When that lifetime is exceeded, you need to sign in to Azure again for security.

### Workaround

Sign into Azure again using the `Az login` command.

## Next steps

If you don't see your problem here or you can't resolve your issue, try one of the following channels for support:

* Get answers from Azure experts through [Microsoft Q&A](/answers/topics/azure-arc.html).

* Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.

* File an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/), and select **Get Support**.