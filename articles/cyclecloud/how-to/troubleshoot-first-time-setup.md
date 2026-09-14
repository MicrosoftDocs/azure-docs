---
title: Troubleshoot first-time Azure CycleCloud setup issues
description: Resolve common credential, location, subnet, provider registration, and storage issues during Azure CycleCloud setup.
ai-usage: ai-assisted
author: padmalathas
ms.author: padmalathas
ms.date: 08/27/2026
ms.update-cycle: 365-days
ms.topic: troubleshooting-general
ms.service: azure-cyclecloud
ms.custom: compute-evergreen
# Customer intent: As a new CycleCloud administrator, I want to diagnose setup issues so that I can configure my Azure account and create my first cluster.
---

# Troubleshoot first-time Azure CycleCloud setup issues

When you configure an Azure account or create your first cluster in Azure CycleCloud, missing Azure resources or account permissions can block setup. Use the symptoms in this article to identify the likely cause and find the detailed resolution.

## Subnet ID isn't available

**Symptom:** The **Subnet ID** list doesn't show the subnet where you want to deploy cluster nodes.

**Likely cause:** The subnet doesn't exist in the subscription and region associated with the selected credentials, or CycleCloud didn't detect a newly created subnet yet.

**Verification:** In the Azure portal, confirm that the virtual network and subnet exist in the expected subscription and region. In the CycleCloud cluster form, confirm that you selected the credentials and region for that subscription.

**Resolution:** If the subnet doesn't exist, [create the subnet](configuration.md#configure-a-subnet-and-network-security-group). After you create a subnet, wait a short time for CycleCloud to detect it, and then reopen the cluster form. For more information about the form fields, see [Create a new cluster](create-cluster.md#cluster-parameters).

## Default Location list is empty

**Symptom:** The **Default Location** list is empty when you configure an Azure account.

**Likely cause:** CycleCloud can't retrieve the available regions for the selected subscription. Invalid credentials, missing subscription permissions, or a resource provider registration failure can prevent account setup.

**Verification:** On the CycleCloud **Clusters** page, select the gear icon and confirm that the account uses the intended subscription. In the Azure portal, confirm that the service principal or managed identity is active and has sufficient permissions for that subscription.

**Resolution:** Correct the account credentials or role assignment, and then configure the account again. If CycleCloud reports a provider registration failure, follow [Resolve an Azure provider registration error](../common-issues/registering-providers.md#resolution).

## Azure credentials aren't valid

**Symptom:** Resource staging reports `Azure account credentials are not valid`, `No JSON object could be decoded`, or an authorization error for the CycleCloud identity.

**Likely cause:** The service principal secret expired, the managed identity or service principal doesn't have a required role assignment, or the credentials refer to the wrong tenant or subscription.

**Verification:** On the CycleCloud **Clusters** page, select the gear icon and confirm that the named account exists. In the Azure portal, verify the identity, subscription, role assignments, and service principal secret expiration date.

**Resolution:** For an expired secret, follow [Resolve an Azure credentials resource error](../common-issues/azure-credentials.md#resolution). For a missing role assignment, see [Resolve an invalid Azure credentials error](/troubleshoot/azure/hpc/cyclecloud/error-invalid-azure-credentials-cycle-cloud).

## Azure resource provider registration fails

**Symptom:** CycleCloud reports `Failed to register Azure providers` when you add an Azure account.

**Likely cause:** The CycleCloud identity doesn't have permission to register the resource providers required for compute, network, and storage resources.

**Verification:** Confirm that the CycleCloud identity has provider registration permissions, or ask a subscription owner to check the registration state of the required providers.

**Resolution:** Grant the required registration permissions or register the providers manually. For the required permissions and commands, see [Resolve an Azure provider registration error](../common-issues/registering-providers.md#resolution).

## Storage resources can't be staged

**Symptom:** Resource staging reports `Unable to determine AccessKey for URL`, an `az://.../blobs` path error, or a directory-to-file synchronization error.

**Likely cause:** The CycleCloud identity can't list the storage account keys, or the storage account used for the locker has hierarchical namespace enabled.

**Verification:** Confirm that the CycleCloud identity has the `Microsoft.Storage/storageAccounts/listKeys/action` permission. On the storage account **Overview** page in the Azure portal, check whether **Hierarchical namespace** is enabled.

**Resolution:** Grant the required storage permission. If hierarchical namespace is enabled, select or create a Blob storage account without hierarchical namespace for the CycleCloud storage locker. For more information, see [Resolve a staging resources error](../common-issues/staging-resources.md#resolution).

## Next step

If these checks don't resolve the issue, [report the issue](report-issues.md) and include the CycleCloud version, the operation that failed, and the complete error message.