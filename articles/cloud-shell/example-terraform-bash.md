---
title: Deploy with Terraform from Bash in Azure Cloud Shell | Microsoft Docs
description: Deploy with Terraform from Bash in Azure Cloud Shell
services: Azure
documentationcenter: ''
author: tomarcher
manager: routlaw
tags: azure-cloud-shell

ms.service: azure
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 11/15/2017
ms.author: tarcher
---

# Deploy with Terraform from Bash in Azure Cloud Shell
This article walks you through creating a resource group with the [Terraform AzureRM provider](https://www.terraform.io/docs/providers/azurerm/index.html). 

[Hashicorp Terraform](https://www.terraform.io/) is an open source tool that codifies APIs into declarative configuration files that can be shared amongst team members to be edited, reviewed, and versioned. The Microsoft AzureRM provider is used to interact with resources supported by Azure Resource Manager via the AzureRM APIs. 

## Automatic authentication
Terraform is installed in Bash in Cloud Shell by default. Additionally, Cloud Shell automatically authenticates your default Azure CLI subscription to deploy resources through the Terraform Azure modules.

Terraform uses the default Azure CLI subscription that is set. To update default subscriptions, run:

```azurecli-interactive
az account set --subscription mySubscriptionName
```

## Walkthrough
### Launch Bash in Cloud Shell
1. Launch Cloud Shell from your preferred location
2. Verify your preferred subscription is set

```azurecli-interactive
az account show
```

### Create a Terraform template
Create a new Terraform template named main.tf with your preferred text editor.

```
vim main.tf
```

Copy/paste the following code into Cloud Shell.

```
resource "azurerm_resource_group" "myterraformgroup" {
    name = "myRgName"
    location = "West US"
}
```

Save your file and exit your text editor.

### Terraform init
Begin by running `terraform init`.

```
justin@Azure:~$ terraform init

Initializing provider plugins...

The following providers do not have any version constraints in configuration,
so the latest version was installed.

To prevent automatic upgrades to new major versions that may contain breaking
changes, it is recommended to add version = "..." constraints to the
corresponding provider blocks in configuration, with the constraint strings
suggested below.

* provider.azurerm: version = "~> 0.2"

Terraform has been successfully initialized!

You may now begin working with Terraform. Try running "terraform plan" to see
any changes that are required for your infrastructure. All Terraform commands
should now work.

If you ever set or change modules or backend configuration for Terraform,
rerun this command to reinitialize your working directory. If you forget, other
commands will detect it and remind you to do so if necessary.
```

The [terraform init command](https://www.terraform.io/docs/commands/init.html) is used to initialize a working directory containing Terraform configuration files. The `terraform init` command is the first command that should be run after writing a new Terraform configuration or cloning an existing one from version control. It is safe to run this command multiple times.

### Terraform plan
Preview the resources to be created by the Terraform template with `terraform plan`.

```
justin@Azure:~$ terraform plan
Refreshing Terraform state in-memory prior to plan...
The refreshed state will be used to calculate this plan, but will not be
persisted to local or remote state storage.


------------------------------------------------------------------------

An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  + azurerm_resource_group.demo
      id:       <computed>
      location: "westus"
      name:     "myRGName"
      tags.%:   <computed>


Plan: 1 to add, 0 to change, 0 to destroy.

------------------------------------------------------------------------

Note: You didn't specify an "-out" parameter to save this plan, so Terraform
can't guarantee that exactly these actions will be performed if
"terraform apply" is subsequently run.
```

The [terraform plan command](https://www.terraform.io/docs/commands/plan.html) is used to create an execution plan. Terraform performs a refresh, unless explicitly disabled, and then determines what actions are necessary to achieve the desired state specified in the configuration files. The plan can be saved using -out, and then provided to terraform apply to ensure only the pre-planned actions are executed.

### Terraform apply
Provision the Azure resources with `terraform apply`.

```
justin@Azure:~$ terraform apply
azurerm_resource_group.demo: Creating...
  location: "" => "westus"
  name:     "" => "myRGName"
  tags.%:   "" => "<computed>"
azurerm_resource_group.demo: Creation complete after 0s (ID: /subscriptions/mySubIDmysub/resourceGroups/myRGName)

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
```

The [terraform apply command](https://www.terraform.io/docs/commands/apply.html) is used to apply the changes required to reach the desired state of the configuration.

### Verify deployment with Azure CLI
Run `az group show -n myRgName` to verify the resource has succeeded provisioning.

```azcliinteractive
az group show -n myRgName
```

### Clean up with terraform destroy
Clean up the resource group created with the [Terraform destroy command](https://www.terraform.io/docs/commands/destroy.html) to clean up Terraform-created infrastructure.

```
justin@Azure:~$ terraform destroy
azurerm_resource_group.demo: Refreshing state... (ID: /subscriptions/mySubID/resourceGroups/myRGName)

An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  - destroy

Terraform will perform the following actions:

  - azurerm_resource_group.demo


Plan: 0 to add, 0 to change, 1 to destroy.

Do you really want to destroy?
  Terraform will destroy all your managed infrastructure, as shown above.
  There is no undo. Only 'yes' will be accepted to confirm.

  Enter a value: yes

azurerm_resource_group.demo: Destroying... (ID: /subscriptions/mySubID/resourceGroups/myRGName)
azurerm_resource_group.demo: Still destroying... (ID: /subscriptions/mySubID/resourceGroups/myRGName, 10s elapsed)
azurerm_resource_group.demo: Still destroying... (ID: /subscriptions/mySubID/resourceGroups/myRGName, 20s elapsed)
azurerm_resource_group.demo: Still destroying... (ID: /subscriptions/mySubID/resourceGroups/myRGName, 30s elapsed)
azurerm_resource_group.demo: Still destroying... (ID: /subscriptions/mySubID/resourceGroups/myRGName, 40s elapsed)
azurerm_resource_group.demo: Destruction complete after 45s

Destroy complete! Resources: 1 destroyed.
```

You have successfully created an Azure resource through Terraform. Visit next steps to continue learning about Cloud Shell.

## Next steps
[Learn about the Terraform Azure provider](https://www.terraform.io/docs/providers/azurerm/#)<br>
[Bash in Cloud Shell quickstart](quickstart.md)
