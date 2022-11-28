---
title: Perform disaster recovery operations
description: Learn how to perform recovery operations for the Azure Arc resource bridge VM in Azure Arc-enabled VMware vSphere disaster scenarios.
ms.topic: how-to 
ms.date: 08/16/2022

---

# Perform disaster recovery operations

In this article, you'll learn how to perform recovery operations for the Azure Arc resource bridge (preview) VM in Azure Arc-enabled VMware vSphere disaster scenarios.

## Disaster scenarios & recovery goals

In disaster scenarios for the Azure Arc resource bridge virtual machine (VM), including accidental deletion and hardware failure, the resource bridge Azure resource will have a status of `offline`. This means that the connection between on-premises infrastructure and Azure is lost, and previously managed Arc-enabled resources are disconnected from their on-premises counterparts.

By performing recovery options, you can recreate a healthy Arc resource bridge and automatically reenable disconnected Arc-enabled resources.

## Recovering the Arc resource bridge

> [!NOTE]
> When prompted for names for the Arc resource bridge, custom locations, and vCenter Azure resources, you'll need to provide the **same resource IDs** as the original resources in Azure.

To recover the Arc resource bridge VM, you'll need to:

- Delete the existing Arc resource bridge.
- Create a new Arc resource bridge.
- Recreate necessary custom extensions and custom locations.
- Reconnect the new Arc resource bridge to existing resources in Azure.

Follow the [Perform manual recovery for Arc resource bridge](#perform-manual-recovery-for-arc-resource-bridge) if any of the following apply:

- The Arc resource bridge VM template is still present in vSphere.
- The old Arc resource bridge contained multiple cluster extensions.
- The old Arc resource bridge contained multiple custom locations.

If none of the above apply, you can use the automated recovery process described in [Use a script to recover Arc resource bridge](#use-a-script-to-recover-arc-resource-bridge).

## Perform manual recovery for Arc resource bridge

1. Copy the Azure region and resource IDs of the Arc resource bridge, custom location, and vCenter Azure resources.

1. If the original configuration files for setting up Arc-enabled VMware vSphere are still present, move to the next step.

    Otherwise, recreate the configuration files and validate them. vSphere-related configurations can be changed from the original settings, but any Azure-related configurations (resource groups, Azure IDs, location) must be the same as in the original setup.

    ```azurecli
    az arcappliance createconfig vmware --resource-group <resource group of original Arc resource bridge> --name <name of original Arc resource bridge> --location <Azure region of original Arc resource bridge>
    ```

    ```azurecli
    az arcappliance validate vmware --config-file <path to configuration "name-appliance.yaml" file>
    ```

1. If the original Arc resource bridge VM template for setting up Arc-enabled VMware vSphere is still present in vSphere, move to the next step.

    Otherwise, prepare a new VM template:

    ```azurecli
    az arcappliance prepare vmware --config-file <path to configuration "name-appliance.yaml" file>
    ```

1. Delete the existing Arc resource bridge. This command will delete both the on-premises VM in vSphere and the associated Azure resource.

    ```azurecli
    az arcappliance delete vmware --config-file <path to configuration "name-appliance.yaml" file>
    ```

1. Deploy a new Arc resource bridge VM.

    ```azurecli
    az arcappliance deploy vmware --config-file <path to configuration "name-appliance.yaml" file>
    ```

1. Create a new Arc resource bridge Azure resource and establish the connection between vCenter and Azure.

    ```azurecli
    az arcappliance create vmware --config-file <path to configuration "name-appliance.yaml" file> --kubeconfig <path to kubeconfig file>
    ```

1. Wait for the new Arc resource bridge to have a status of "Running". This process can take up to 5 minutes. Check the status in the Azure portal or use the following command:

    ```azurecli
    az arcappliance show --resource-group <resource-group-name> --name <Arc-resource-bridge-name>
    ```

1. Recreate necessary custom extensions. For Arc-enabled VMware vSphere:

    ```azurecli
    az k8s-extension create --resource-group <resource-group-name> --name azure-vmwareoperator --cluster-name <cluster-name> --cluster-type appliances --scope cluster --extension-type Microsoft.VMWare --release-train stable --release-namespace azure-vmwareoperator --auto-upgrade true --config Microsoft.CustomLocation.ServiceAccount=azure-vmwareoperator  
    ```

1. Recreate original custom locations. The name must be the same as the resource ID of the existing custom location in Azure. This method will allow the newly created custom location to automatically connect to the existing Azure resource.

    ```azurecli
    az customlocation create --name <name of existing custom location resource in Azure> --namespace azure-vmwareoperator --resource-group <resource group of the existing custom location> --host-resource-id <extension-name>
    ```

1. Reconnect to the existing vCenter Azure resource. The name must be the same as the resource ID of the existing vCenter resource in Azure.

    ```azurecli
    az connectedvmware vcenter connect --custom-location <custom-location-name> --location <Azure-region> --name <name of existing vCenter resource in Azure> --resource-group <resource group of the existing vCenter resource> --username <username to the vSphere account> --password <password to the vSphere account>
    ```

1. Once the above commands are successfully completed, the resource bridge should be recovered, and the previously disconnected Arc-enabled resources will be manageable in Azure again.

## Use a script to recover Arc resource bridge

> [!NOTE]
> The script used in this automated recovery process will also upgrade the resource bridge to the latest version.

To recover the Arc resource bridge, perform the following steps:

1. Copy the Azure region and resource IDs of the Arc resource bridge, custom location, and vCenter Azure resources.

1. Find and delete the old Arc resource bridge **template** from your vCenter.

1. Download the [onboarding script](../vmware-vsphere/quick-start-connect-vcenter-to-arc-using-script.md#run-the-script) from the Azure portal and update the following section in the script, using the **same information** as the original resources in Azure.

    ```powershell
    $location = <Azure region of the resources>
    
    $applianceSubscriptionId = <subscription-id>
    $applianceResourceGroupName = <resource-group-name>
    $applianceName = <resource-bridge-name>
    
    $customLocationSubscriptionId = <subscription-id>
    $customLocationResourceGroupName = <resource-group-name>
    $customLocationName = <custom-location-name>
    
    $vCenterSubscriptionId = <subscription-id>
    $vCenterResourceGroupName = <resource-group-name>
    $vCenterName = <vcenter-name-in-azure>
    ```

1. [Run the onboarding script](../vmware-vsphere/quick-start-connect-vcenter-to-arc-using-script.md#run-the-script) again with the `--force` parameter.

    ``` powershell-interactive
    ./resource-bridge-onboarding-script.ps1 --force
    ```

1. [Provide the inputs](../vmware-vsphere/quick-start-connect-vcenter-to-arc-using-script.md#inputs-for-the-script) as prompted.

1. Once the script successfully finishes, the resource bridge should be recovered, and the previously disconnected Arc-enabled resources will be manageable in Azure again.

## Next steps

[Troubleshoot Azure Arc resource bridge (preview) issues](../resource-bridge/troubleshoot-resource-bridge.md)

If the recovery steps above are unsuccessful in restoring Arc resource bridge to its original state, try one of the following channels for support:

- Get answers from Azure experts through [Microsoft Q&A](/answers/topics/azure-arc.html).
- Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.
- [Open an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md).