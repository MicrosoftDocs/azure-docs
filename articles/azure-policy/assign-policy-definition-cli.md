---
title: Use the Azure CLI to create a policy assignment to identify non-compliant resources in your Azure environment | Microsoft Docs
description: Use PowerShell to create an Azure Policy assignment to identify non-compliant resources.
services: azure-policy
keywords:
author: bandersmsft
ms.author: banders
ms.date: 01/17/2018
ms.topic: quickstart
ms.service: azure-policy
ms.custom: mvc
---

# Create a policy assignment to identify non-compliant resources in your Azure environment with the Azure CLI

The first step in understanding compliance in Azure is to identify the status of your resources. This quickstart steps you through the process of creating a policy assignment to identify virtual machines that are not using managed disks.

At the end of this process, you will successfully identify virtual machines that are not using managed disks. They are *non-compliant* with the policy assignment.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

This quickstart requires that you run Azure CLI version 2.0.4 or later to install and use the CLI locally. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Create a policy assignment

In this quickstart, we create a policy assignment and assign the Audit Virtual Machines without Managed Disks definition. This policy definition identifies resources that do not comply with the conditions set in the policy definition.

Follow these steps to create a new policy assignment:

1. Register the Policy Insights resource provider to ensure that your subscription works with the resource provider. To register a resource provider, you must have permission to perform the register action operation for the resource provider. This operation is included in the Contributor and Owner roles.

    Register the resource provider by running the following command:

    ```azurecli
    az provider register --namespace Microsoft.PolicyInsights
    ```

    The command returns a message stating that registration is on-going.

    You cannot unregister a resource provider while you have resource types from the resource provider in your subscription. For more information about registering and viewing resource providers, see [Resource Providers and Types](../azure-resource-manager/resource-manager-supported-services.md).

2. View all policy definitions, and find the *Audit Virtual Machines without Managed Disks* policy definition:

    ```azurecli
az policy definition list
```

    Azure Policy comes with already built in policy definitions you can use. You will see built-in policy definitions such as:

    - Enforce tag and its value
    - Apply tag and its value
    - Require SQL Server Version 12.0

3. Next, provide the following information and run the following command to assign the policy definition:

    - Display **Name** for the policy assignment. In this case, let’s use *Audit Virtual Machines without Managed Disks*.
    - **Policy** – This is the policy definition, based off which you’re using to create the assignment. In this case, it is the policy definition – *Audit Virtual Machines without Managed Disks*
    - A **scope** - A scope determines what resources or grouping of resources the policy assignment gets enforced on. It could range from a subscription to resource groups.

    Use the subscription (or resource group) you have previously registered. In this example, we are using the **bc75htn-a0fhsi-349b-56gh-4fghti-f84852** subscription ID and the **FabrikamOMS** resource group name. Be sure to change these to the ID of the subscription and the name of resource group you are working with.

    The command should resemble:

    ```azurecli
az policy assignment create --name Audit Virtual Machines without Managed Disks Assignment --policy Audit Virtual Machines without Managed Disks --scope /subscriptions/
bc75htn-a0fhsi-349b-56gh-4fghti-f84852/resourceGroups/FabrikamOMS
```

A policy assignment is a policy that has been assigned to take place within a specific scope. This scope could also range from a management group to a resource group.

## Identify non-compliant resources

To view the resources that are not compliant under this new assignment:

1. Navigate back to the Azure Policy page.
2. Select **Compliance** on the left pane, and search for the **Policy Assignment** you created.

   ![Policy compliance](media/assign-policy-definition/policy-compliance.png)

   Any existing resources that are not compliant with the new assignment appear in the **Non-compliant resources** tab. The preceding image shows examples of non-compliant resources.

## Clean up resources

Other guides in this collection build upon this quickstart. If you plan to continue to work with subsequent tutorials, do not clean up the resources created in this quickstart. If you do not plan to continue, delete the assignment you created by running this command:

```azurecli
az policy assignment delete –name  Assignment --scope /subscriptions/ bc75htn-a0fhsi-349b-56gh-4fghti-f84852 resourceGroups/ FabrikamOMS
```

## Next steps

In this quickstart, you assigned a policy definition to identify non-compliant resources in your Azure environment.

To learn more about assigning policies, to ensure that resources you create in the **future** are compliant, continue to the tutorial for:

> [!div class="nextstepaction"]
> [Creating and managing policies](./create-manage-policy.md)
