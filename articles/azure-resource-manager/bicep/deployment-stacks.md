---
title: Create & deploy deployment stacks in Bicep
description: Describes how to create deployment stacks in Bicep .
ms.topic: conceptual
ms.date: 04/20/2023
---

# Deployment stacks (Preview)



Many Azure administrators find it difficult to manage the lifecycle of their cloud infrastructure.
For example, infrastructure deployed in Azure may span multiple
management groups, subscriptions, and resource groups. Deployment stacks simplify lifecycle management for your Azure deployments, regardless of their complexity.

A _deployment stack_ is a native Azure resource type that enables you to perform operations on
a resource collection as an atomic unit. Deployment stacks are defined in ARM
as the type `Microsoft.Resources/deploymentStacks`.

jgao: publish the template reference for deploymentStacks.

Because the deployment stack is a native Azure resource, you can perform all typical Azure
Resource Manager (ARM) operations on the resource, including:

- Azure role-based access control (RBAC) assignments
- Security recommendations surfaced by Microsoft Defender for Cloud
- Azure Policy assignments

Any Azure resource created using a deployment stack is managed by it, and subsequent updates to that
deployment stack, combined with value of the newest iteration's `actionOnUnmanage` property, allows you to control
the lifecycle of the resources managed by the deployment stack. When a deployment stack is updated,
the new set of managed resources will be determined by the resources defined in the template.

To create your first deployment stack, work through our [quickstart tutorial](./TUTORIAL.md).

## Feature registration

Use the following PowerShell command to enable the deployment stacks preview feature in your Azure subscription:

```powershell
Register-AzProviderFeature -ProviderNamespace Microsoft.Resources -FeatureName deploymentStacksPreview
```

jgao: is there an Azure CLI command for feature registration?
jgao: will feature registration still required with public preview?

## Deployment stacks tools installation (PowerShell on Windows, macOS, and Linux)

Use the following steps to install the deployment stacks PowerShell cmdlets:

1. Install the latest `Az` PowerShell module.  See [Install the Azure Az PowerShell module](/powershell/azure/new-azureps-module-az).

1. Open an elevated PowerShell session.

1. Run the following command to bypass local script signing policy in your session.

```powershell
Set-ExecutionPolicy Bypass -Scope Process
```

1. Download the latest [deployment stacks installation package](https://github.com/Azure/deployment-stacks/releases), unzip the package, and then run the installation `.ps1` script. You can choose to install the module either in the current PowerShell session or system-wide.

```powershell
    ./AzDeploymentStacksPrivatePreview.ps1
```

  To uninstall the module, run the same `.ps1` file and choose the `Uninstall module (previous system-wide installs)` option.

1. Set the current subscription context to your preferred Azure subscription. As long
as the deployment stacks feature has been enabled in your Azure AD tenant, the feature is
available for all subscriptions.

```powershell
Connect-AzAccount
Set-AzContext -SubscriptionId '<subscription-id>'
```

1. Verify the deployment stacks PowerShell commands are available in your PowerShell session by running the following command:

```powershell
Get-Command -Name *DeploymentStack*
```

## Deployment stacks tools installation (Azure CLI on Windows)

Use the following steps to install the Deployment Stacks Command-Line Interface (CLI) on your Windows machine:

1. Install _Microsoft Azure CLI.msi_ from the _msi_ folder

1. Note the path to the _azure-mgmt-resource-21.2.0_ software development kit (SDK) folder

1. Open an elevated PowerShell session

1. Run the following command:

```bash
 & "C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2\python.exe" -m pip install -e <path-to-unzipped-sdk-folder> --force-reinstall
```

1. Verify you have the Deployment Stacks CLI installed by running the following command (if you get Deployment Stacks output, you know it's installed correctly):

```azurecli
  az stack --help
```

1. Switch your Azure CLI context to the appropriate Azure subscription and give the new Deployment Stacks CLI a try!

```azurecli
 az account set --subscription <subscription-id>
```

## Deployment stacks tools installation (Azure CLI on macOS)

Use the following steps to install the Deployment Stacks Command-Line Interface (CLI) on your macOS computer:

1. Ensure you have Python and pip installed on your Mac. If not, install Homebrew and run the following `brew` commands to install the dependencies:

```bash
brew install python
brew install pip
```

> [!TIP]
> If the Python and pip install doesn't work for you, try using `python3` and `pip3` in your `brew` commands.

1. Open Terminal and change directory to `Stacks_CLI_Mac_1.8/pypi`.

1. Run the following sequence of `pip` commands in an administrative (sudo) context:

```bash
pip install azure_cli_core-2.44.1.post20230111200937-py3-none-any.whl
pip install azure_cli-2.44.1.post20230111200937-py3-none-any.whl
pip install -e ../azure-mgmt-resource-21.2.0
```

## Troubleshooting

Deployment stacks contain some diagnostic information that isn't displayed by
default. When troubleshooting problems with an update, save the objects to analyze them further:

```azurepowershell
$stack =  Get-AzSubscriptionDeploymentStack -Name 'mySubStack'
```

There may be more than one level for the error messages, to easily see them all at once:

```powershell
$stack.Error | ConvertTo-Json -Depth 50
```

If a deployment was created and the failure occurred during deployment, you can retrieve details of
the deployment using the deployment commands.  For example if your template was deployed
to a resource group:

```azurepowershell
Get-AzResourceGroupDeployment -Id $stack.DeploymentId
```

You can get more information from the [deployment operations](https://docs.microsoft.com/azure/azure-resource-manager/templates/deployment-history?tabs=azure-portal#get-deployment-operations-and-error-message) as needed.

## Known issues

The `2022-08-01-preview` private preview API version has the following limitations:

- We don't recommended using deployment stacks in production environments because the service is still in preview. Therefore, you should expect breaking changes in future releases.

- Resource group delete currently bypasses deny assignments.

- Implicitly created resources aren't managed by the stack (therefore, no deny assignments or cleanup is possible)

- The `denyDelete` resource locking method is available in private preview. The `denyWriteAndDelete` method will be available in the future.

- `Whatif` isn't available in the private preview. `Whatif` allows you to evaluate changes before actually submitting the deployment to ARM.

- Deployment stacks are currently limited to the resource group and subscription management scopes for the private preview. At this time management group-scoped Azure PowerShell and Azure CLI commands exist; they just aren't usable yet.

- A deployment stack doesn't guarantee the protection of `secureString` and `secureObject` parameters; this release returns them in plain text when requested.

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit the [Microsoft Open Source website](https://cla.opensource.microsoft.com).

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause
confusion or imply Microsoft sponsorship. Any use of third-party trademarks or logos are
subject to those third-party's policies.











## Next steps

To learn more about template specs, and for hands-on guidance, see [Publish libraries of reusable infrastructure code by using template specs](/training/modules/arm-template-specs).
