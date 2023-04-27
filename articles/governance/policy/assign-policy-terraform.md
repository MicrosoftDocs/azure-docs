---
title: "Quickstart: New policy assignment with Terraform"
description: In this quickstart, you use Terraform and HCL syntax to create a policy assignment to identify non-compliant resources.
ms.date: 03/01/2023
ms.topic: quickstart
ms.custom: devx-track-terraform
ms.tool: terraform
---
# Quickstart: Create a policy assignment to identify non-compliant resources using Terraform

The first step in understanding compliance in Azure is to identify the status of your resources.
This quickstart steps you through the process of creating a policy assignment to identify virtual
machines that aren't using managed disks.

At the end of this process, you'll successfully identify virtual machines that aren't using managed
disks across subscription. They're _non-compliant_ with the policy assignment.

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/)
  account before you begin.
- [Terraform](https://www.terraform.io/) version 0.12.0 or higher configured in your environment.
  For instructions, see
  [Configure Terraform using Azure Cloud Shell](/azure/developer/terraform/get-started-cloud-shell).
- This quickstart requires that you run Azure CLI version 2.13.0 or later. To find the version, run
  `az --version`. If you need to install or upgrade, see
  [Install Azure CLI](/cli/azure/install-azure-cli).

## Create the Terraform configuration, variable, and output file

In this quickstart, you create a policy assignment and assign the **Audit VMs that do not use
managed disks** (`06a78e20-9358-41c9-923c-fb736d382a4d`) definition. This policy definition
identifies resources that aren't compliant to the conditions set in the policy definition.

First, configure the Terraform configuration, variable, and output files. The Terraform resources
for Azure Policy use the
[Azure Provider](https://www.terraform.io/docs/providers/azurerm/index.html).

1. Create a new folder named `policy-assignment` and change directories into it.

2. Create `main.tf` with the following code:

    > [!NOTE]
    > To create a Policy Assignment at a Management Group use the [azurerm_management_group_policy_assignment](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/management_group_policy_assignment) resource, for a Resource Group use the [azurerm_resource_group_policy_assignment](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group_policy_assignment) and for a Subscription use the [azurerm_subscription_policy_assignment](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/subscription_policy_assignment) resource.


    ```terraform
      provider "azurerm" {
        features {}
      }

      terraform {
      required_providers {
          azurerm = {
              source = "hashicorp/azurerm"
              version = ">= 2.96.0"
          }
      }
      }

      resource "azurerm_subscription_policy_assignment" "auditvms" {
      name = "audit-vm-manageddisks"
      subscription_id = var.cust_scope
      policy_definition_id = "/providers/Microsoft.Authorization/policyDefinitions/06a78e20-9358-41c9-923c-fb736d382a4d"
      description = "Shows all virtual machines not using managed disks"
      display_name = "Audit VMs without managed disks assignment"
      }
    ```
3. Create `variables.tf` with the following code:

    ```terraform
    variable "cust_scope" {
        default = "{scope}"
    }
    ```

   A scope determines what resources or grouping of resources the policy assignment gets enforced on. It could range from a management group to an individual  resource. Be sure to replace `{scope}` with one of the following patterns based on the declared resource:

   - Subscription: `/subscriptions/{subscriptionId}`
   - Resource group: `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}`
   - Resource: `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/[{parentResourcePath}/]`

4. Create `output.tf` with the following code:

    ```terraform
    output "assignment_id" {
        value = azurerm_subscription_policy_assignment.auditvms.id
    }
    ```

## Initialize Terraform and create plan

Next, initialize Terraform to download the necessary providers and then create a plan.

1. Run the [terraform init](https://www.terraform.io/docs/commands/init.html) command. This command
   downloads the Azure modules required to create the Azure resources in the Terraform
   configuration.

   ```bash
   terraform init
   ```

   :::image type="content" source="./media/assign-policy-terraform/terraform-initialize.png" alt-text="Screenshot of running the terraform init command that shows downloading the azurerm module and a success message.":::

1. Authenticate with [Azure CLI](/cli/azure/) for Terraform. For more information, see
   [Azure Provider: Authenticating using the Azure CLI](https://www.terraform.io/docs/providers/azurerm/guides/azure_cli.html).

   ```azurecli
   az login
   ```

1. Create the execution plan with the
   [terraform plan](https://www.terraform.io/docs/commands/plan.html) command and **out** parameter.

   ```bash
   terraform plan -out assignment.tfplan
   ```

   :::image type="content" source="./media/assign-policy-terraform/terraform-plan-out.png" alt-text="Screenshot of running the terraform plan command and out parameter to show the Azure resource that would be created.":::

   > [!NOTE]
   > For information about persisting execution plans and security, see
   > [Terraform Plan: Security Warning](https://www.terraform.io/docs/commands/plan.html#security-warning).

## Apply the Terraform execution plan

Last, apply the execution plan.

Run the [terraform apply](https://www.terraform.io/docs/commands/apply.html) command and specify the
`assignment.tfplan` already created.

```bash
terraform apply assignment.tfplan
```

:::image type="content" source="./media/assign-policy-terraform/terraform-apply.png" alt-text="Screenshot of running the terraform apply command and the resulting resource creation.":::

With the "Apply complete! Resources: 1 added, 0 changed, 0 destroyed." message, the policy
assignment is now created. Since we defined the `outputs.tf` file, the _assignment\_id_ is also
returned.

## Identify non-compliant resources

To view the resources that aren't compliant under this new assignment, use the _assignment\_id_
returned by ```terraform apply```. With it, run the following command to get the resource IDs of the
non-compliant resources that are output into a JSON file:

```console
armclient post "/subscriptions/<subscriptionID>/providers/Microsoft.PolicyInsights/policyStates/latest/queryResults?api-version=2019-10-01&$filter=IsCompliant eq false and PolicyAssignmentId eq '<policyAssignmentID>'&$apply=groupby((ResourceId))" > <json file to direct the output with the resource IDs into>
```

Your results resemble the following example:

```json
{
    "@odata.context": "https://management.azure.com/subscriptions/<subscriptionId>/providers/Microsoft.PolicyInsights/policyStates/$metadata#latest",
    "@odata.count": 3,
    "value": [{
            "@odata.id": null,
            "@odata.context": "https://management.azure.com/subscriptions/<subscriptionId>/providers/Microsoft.PolicyInsights/policyStates/$metadata#latest/$entity",
            "ResourceId": "/subscriptions/<subscriptionId>/resourcegroups/<rgname>/providers/microsoft.compute/virtualmachines/<virtualmachineId>"
        },
        {
            "@odata.id": null,
            "@odata.context": "https://management.azure.com/subscriptions/<subscriptionId>/providers/Microsoft.PolicyInsights/policyStates/$metadata#latest/$entity",
            "ResourceId": "/subscriptions/<subscriptionId>/resourcegroups/<rgname>/providers/microsoft.compute/virtualmachines/<virtualmachine2Id>"
        },
        {
            "@odata.id": null,
            "@odata.context": "https://management.azure.com/subscriptions/<subscriptionId>/providers/Microsoft.PolicyInsights/policyStates/$metadata#latest/$entity",
            "ResourceId": "/subscriptions/<subscriptionName>/resourcegroups/<rgname>/providers/microsoft.compute/virtualmachines/<virtualmachine3ID>"
        }

    ]
}
```

The results are comparable to what you'd typically see listed under **Non-compliant resources** in
the Azure portal view.

## Clean up resources

To remove the assignment created, use Azure CLI or reverse the Terraform execution plan with
`terraform destroy`.

- Azure CLI

  ```azurecli-interactive
  az policy assignment delete --name 'audit-vm-manageddisks' --scope '/subscriptions/<subscriptionID>/<resourceGroupName>'
  ```

- Terraform

  ```bash
  terraform destroy
  ```

## Next steps

In this quickstart, you assigned a policy definition to identify non-compliant resources in your
Azure environment.

To learn more about assigning policies to validate that new resources are compliant, continue to the
tutorial for:

> [!div class="nextstepaction"]
> [Creating and managing policies](./tutorials/create-and-manage.md)
