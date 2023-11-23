---
title:  Perform ongoing administration for Arc-enabled System Center Virtual Machine Manager
description: Learn how to perform administrator operations related to Azure Arc-enabled System Center Virtual Machine Manager
ms.topic: how-to 
ms.date: 11/21/2023
ms.service: azure-arc
ms.subservice: azure-arc-scvmm
author: Farha-Bano
ms.author: v-farhabano
manager: jsuri
---

# Perform ongoing administration for Arc-enabled System Center Virtual Machine Manager

In this article, you learn how to perform various administrative operations related to Azure Arc-enabled System Center Virtual Machine Manager (SCVMM):

- Upgrade the Azure Arc resource bridge
- Update the credentials
- Collect logs from the Arc resource bridge

Each of these operations requires either SSH key to the resource bridge VM or the kubeconfig that provides access to the Kubernetes cluster on the resource bridge VM.

## Upgrade the Arc resource bridge

Azure Arc-enabled SCVMM requires the Arc resource bridge to connect your SCVMM environment with Azure. Periodically, new images of Arc resource bridge are released to include security and feature updates.

> [!NOTE]
> To upgrade the Arc resource bridge VM to the latest version, you need to perform the onboarding again with the **same resource IDs**. This will cause some downtime as operations performed through Arc during this time might fail.

To upgrade to the latest version of the resource bridge, perform the following steps:

1. Copy the Azure region and resource IDs of the Arc resource bridge, custom location, and SCVMM Azure resources.

2. Find and delete the old Arc resource bridge resource under the [Resource Bridges tab from the Azure Arc center](https://ms.portal.azure.com/#view/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/~/resourceBridges).

3. Download the [onboarding script](/azure/azure-arc/system-center-virtual-machine-manager/quickstart-connect-system-center-virtual-machine-manager-to-arc#download-the-onboarding-script) from the Azure portal and update the following section in the script, using the same information as the original resources in Azure.

    ```powershell
    $location = <Azure region of the resources>
    $applianceSubscriptionId = <subscription-id>
    $applianceResourceGroupName = <resource-group-name>
    $applianceName = <resource-bridge-name>

    $customLocationSubscriptionId = <subscription-id>
    $customLocationResourceGroupName = <resource-group-name>
    $customLocationName = <custom-location-name>

    $vmmserverSubscriptionId = <subscription-id>
    $vmmserverResourceGroupName = <resource-group-name>
    $vmmserverName= <SCVMM-name-in-azure>
    ```

4. [Run the onboarding script](/azure/azure-arc/system-center-virtual-machine-manager/quickstart-connect-system-center-virtual-machine-manager-to-arc#download-the-onboarding-script) again with the `--force` parameter.

    ``` powershell-interactive
    ./resource-bridge-onboarding-script.ps1 --force
    ```

5. [Provide the inputs](/azure/azure-arc/system-center-virtual-machine-manager/quickstart-connect-system-center-virtual-machine-manager-to-arc#script-runtime) as prompted.

6. Once the onboarding is successfully completed, the resource bridge is upgraded to the latest version.

## Update the SCVMM account credentials (using a new password or a new SCVMM account after onboarding)

Azure Arc-enabled SCVMM uses the SCVMM account credentials you provided during the onboarding to communicate with your SCVMM management server. These credentials are only persisted locally on the Arc resource bridge VM.

As part of your security practices, you might need to rotate credentials for your SCVMM accounts. As credentials are rotated, you must also update the credentials provided to Azure Arc to ensure the functioning of Azure Arc-enabled SCVMM. You can also use the same steps in case you need to use a different SCVMM account after onboarding. You must ensure the new account also has all the [required SCVMM permissions](quickstart-connect-system-center-virtual-machine-manager-to-arc.md#prerequisites).

There are two different sets of credentials stored on the Arc resource bridge. You can use the same account credentials for both.

- **Account for Arc resource bridge**. This account is used for deploying the Arc resource bridge VM and will be used for upgrade.
- **Account for SCVMM cluster extension**. This account is used to discover inventory and perform all the VM operations through Azure Arc-enabled SCVMM.

To update the credentials of the account for Arc resource bridge, run the following Azure CLI commands. Run the commands from a workstation that can access cluster configuration IP address of the Arc resource bridge locally:

```azurecli
az account set -s <subscription id>
az arcappliance get-credentials -n <name of the appliance> -g <resource group name> 
az arcappliance update-infracredentials scvmm --kubeconfig kubeconfig
```
For more details on the commands, see [`az arcappliance get-credentials`](/cli/azure/arcappliance#az-arcappliance-get-credentials) and [`az arcappliance update-infracredentials scvmm`](/cli/azure/arcappliance/update-infracredentials#az-arcappliance-update-infracredentials-scvmm).


To update the credentials used by the SCVMM cluster extension on the resource bridge. This command can be run from anywhere with `connectedscvmm` CLI extension installed.

```azurecli
az connectedscvmm scvmm connect --custom-location <name of the custom location> --location <Azure region>  --name <name of the SCVMM resource in Azure>       --resource-group <resource group for the SCVMM resource>  --username   <username for the SCVMM account>  --password  <password to the SCVMM account>
```

## Collect logs from the Arc resource bridge

For any issues encountered with the Azure Arc resource bridge, you can collect logs for further investigation. To collect the logs, use the Azure CLI [`Az arcappliance log`](/cli/azure/arcappliance/logs#az-arcappliance-logs-scvmm) command.

To save the logs to a destination folder, run the following commands. These commands need connectivity to cluster configuration IP address.

```azurecli
az account set -s <subscription id>
az arcappliance get-credentials -n <name of the appliance> -g <resource group name> 
az arcappliance logs scvmm --kubeconfig kubeconfig --out-dir <path to specified output directory>
```

If the Kubernetes cluster on the resource bridge isn't in functional state, you can use the following commands. These commands require connectivity to IP address of the Azure Arc resource bridge VM via SSH.

```azurecli
az account set -s <subscription id>
az arcappliance get-credentials -n <name of the appliance> -g <resource group name> 
az arcappliance logs scvmm --out-dir <path to specified output directory> --ip XXX.XXX.XXX.XXX
```

## Next steps

- [Troubleshoot common issues related to resource bridge](../resource-bridge/troubleshoot-resource-bridge.md).
- [Understand disaster recovery operations for resource bridge](./disaster-recovery.md).
