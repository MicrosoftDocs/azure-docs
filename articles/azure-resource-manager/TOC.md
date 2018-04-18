# [Azure Resource Manager Documentation](index.md)

# Overview
## [What is Resource Manager?](resource-group-overview.md)
## [Resource providers and types](resource-manager-supported-services.md)
## [Resource Manager and Classic deployment](resource-manager-deployment-model.md)
## [Subscription governance](resource-manager-subscription-governance.md)
## [Organize resources with management groups](management-groups-overview.md)

# Get started
## [Create and deploy template](resource-manager-create-first-template.md)
## [VS Code extension for templates](resource-manager-vscode-extension.md)
## [Visual Studio with Resource Manager](vs-azure-tools-resource-groups-deployment-projects-create-deploy.md)

# How to
## Create templates
### [Template sections](resource-group-authoring-templates.md)
#### [Parameters](resource-manager-templates-parameters.md)
#### [Variables](resource-manager-templates-variables.md)
#### [Resources](resource-manager-templates-resources.md)
#### [Outputs](resource-manager-templates-outputs.md)
### [Linked and nested templates](resource-group-linked-templates.md)
### [Define dependency between resources](resource-group-define-dependencies.md)
### [Create multiple instances](resource-group-create-multiple.md)
### [Update resource](/azure/architecture/building-blocks/extending-templates/update-resource)

## Deploy
### Azure PowerShell
#### [Deploy template](resource-group-template-deploy.md)
#### [Deploy private template with SAS token](resource-manager-powershell-sas-token.md)
#### [Export template and redeploy](resource-manager-export-template-powershell.md)
### Azure CLI
#### [Deploy template](resource-group-template-deploy-cli.md)
#### [Deploy private template with SAS token](resource-manager-cli-sas-token.md)
#### [Export template and redeploy](resource-manager-export-template-cli.md)
### Azure portal
#### [Deploy resources](resource-group-template-deploy-portal.md)
#### [Export template](resource-manager-export-template.md)
### [REST API](resource-group-template-deploy-rest.md)
### [Multiple resource groups or subscriptions](resource-manager-cross-resource-group-deployment.md)
### [Continuous integration with Visual Studio Team Services](../vs-azure-tools-resource-groups-ci-in-vsts.md?toc=%2fazure%2fazure-resource-manager%2ftoc.json)
### [Pass secure values during deployment](resource-manager-keyvault-parameter.md)

## Manage
### [Azure PowerShell](powershell-azure-resource-manager.md)
### [Azure CLI](xplat-cli-azure-resource-manager.md)
### [Azure portal](resource-group-portal.md)
### [Use tags to organize resources](resource-group-using-tags.md)
### [Move resources to new group or subscription](resource-group-move-resources.md)
### [Create management groups](management-groups-create.md)
### [Manage your management groups](management-groups-manage.md)
### [Governance examples](resource-manager-subscription-examples.md)

## Control Access
### Create service principal
#### [Azure PowerShell](resource-group-authenticate-service-principal.md)
#### [Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli?toc=%2fazure%2fazure-resource-manager%2ftoc.json)
#### [Azure portal](resource-group-create-service-principal-portal.md)
### [Authentication API to access subscriptions](resource-manager-api-authentication.md)
### [Lock resources](resource-group-lock-resources.md)

## Audit
### [View activity logs](resource-group-audit.md)
### [View deployment operations](resource-manager-deployment-operations.md)

## Troubleshoot
### [Common deployment errors](resource-manager-common-deployment-errors.md)
#### [AccountNameInvalid](resource-manager-storage-account-name-errors.md)
#### [InvalidTemplate](resource-manager-invalid-template-errors.md)
#### [Linux deployment issues](../virtual-machines/linux/troubleshoot-deploy-vm.md)
#### [NoRegisteredProviderFound](resource-manager-register-provider-errors.md)
#### [NotFound](resource-manager-not-found-errors.md)
#### [ParentResourceNotFound](resource-manager-parent-resource-errors.md)
#### [Provisioning and allocation issues for Linux](../virtual-machines/linux/troubleshoot-deployment-new-vm.md)
#### [Provisioning and allocation issues for Windows](../virtual-machines/windows/troubleshoot-deployment-new-vm.md)
#### [RequestDisallowedByPolicy](resource-manager-policy-requestdisallowedbypolicy-error.md)
#### [ReservedResourceName](resource-manager-reserved-resource-name.md)
#### [ResourceQuotaExceeded](resource-manager-quota-errors.md)
#### [SkuNotAvailable](resource-manager-sku-not-available-errors.md)
#### [Windows deployment issues](../virtual-machines/windows/troubleshoot-deploy-vm.md)
### [Understand deployment errors](resource-manager-troubleshoot-tips.md)

# Reference
## [Template format](/azure/templates/)
## [Template functions](resource-group-template-functions.md)
### [Array and object functions](resource-group-template-functions-array.md)
### [Comparison functions](resource-group-template-functions-comparison.md)
### [Deployment functions](resource-group-template-functions-deployment.md)
### [Logical functions](resource-group-template-functions-logical.md)
### [Numeric functions](resource-group-template-functions-numeric.md)
### [Resource functions](resource-group-template-functions-resource.md)
### [String functions](resource-group-template-functions-string.md)
## [PowerShell](/powershell/module/azurerm.resources)
## [Azure CLI](/cli/azure/resource)
## [.NET](/dotnet/api/microsoft.azure.management.resourcemanager)
## [Java](/java/api/com.microsoft.azure.management.resources)
## [Python](http://azure-sdk-for-python.readthedocs.io/en/latest/resourcemanagement.html)
## [REST](/rest/api/resources/)

# Resources
## [Azure Roadmap](https://azure.microsoft.com/roadmap/?category=monitoring-management)
## [Pricing calculator](https://azure.microsoft.com/pricing/calculator/)
## [Service updates](https://azure.microsoft.com/updates/?product=azure-resource-manager)
## [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-resource-manager)
## [Throttling requests](resource-manager-request-limits.md)
## [Track asynchronous operations](resource-manager-async-operations.md)
## [Videos](https://azure.microsoft.com/documentation/videos/index/?services=azure-resource-manager)
