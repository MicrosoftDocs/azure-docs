---
title: Recover from accidental deletion of resource bridge VM
description: Learn how to perform recovery operations for the Azure Arc resource bridge VM in Azure Arc-enabled System Center Virtual Machine Manager (preview) disaster scenarios.
ms.topic: how-to 
ms.custom:
ms.date: 07/28/2023
ms.services: azure-arc
ms.subservice: azure-arc-scvmm
author: jyothisuri
ms.author: jsuri
---

# Recover from accidental deletion of resource bridge virtual machine

In this article, you'll learn how to recover the Azure Arc resource bridge (preview) connection into a working state in disaster scenarios such as accidental deletion. In such cases, the connection between on-premises infrastructure and Azure is lost and any operations performed through Arc will fail.

## Recover the Arc resource bridge in case of virtual machine deletion

To recover from Arc resource bridge VM deletion, you need to deploy a new resource bridge with the same resource ID as the current resource bridge using the following steps.

1. Copy the Azure region and resource IDs of the Arc resource bridge, custom location, and SCVMM Azure resources.

2. Find and delete the old Arc resource bridge template from your SCVMM.

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

6. Once the script successfully finishes, the resource bridge should be recovered, and the previously disconnected Arc-enabled resources will be manageable in Azure again.

## Next steps

[Troubleshoot Azure Arc resource bridge (preview) issues](../resource-bridge/troubleshoot-resource-bridge.md)

If the recovery steps mentioned above are unsuccessful in restoring Arc resource bridge to its original state, try one of the following channels for support:

- Get answers from Azure experts through [Microsoft Q&A](/answers/topics/azure-arc.html).
- Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.
- [Open an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md).