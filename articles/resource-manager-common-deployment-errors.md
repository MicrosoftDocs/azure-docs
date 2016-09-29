<properties
   pageTitle="Troubleshoot common Azure deployment errors | Microsoft Azure"
   description="Describes how to resolve common errors when you deploy resources to Azure using Azure Resource Manager."
   services="azure-resource-manager"
   documentationCenter=""
   tags="top-support-issue"
   authors="tfitzmac"
   manager="timlt"
   editor="tysonn"
   keywords="deployment error, azure deployment, deploy to azure"/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/14/2016"
   ms.author="tomfitz"/>

# Troubleshoot common Azure deployment errors with Azure Resource Manager

This topic describes how you can resolve some common Azure deployment errors you may encounter. If you need more information about what went wrong with your deployment, first see [View deployment operations](resource-manager-troubleshoot-deployments-portal.md) and then come back to this article for help with resolving the error.

## Invalid template or resource

When deploying a template, you may receive:

    Code=InvalidTemplate 
    Message=Deployment template validation failed

If you receive an error stating that either the template or a property on a resource is invalid, you may have a syntax error in your template. This error is easy to make because template expressions can be intricate. For example, the following name assignment for a storage account contains one set of brackets, three functions, three sets of parentheses, one set of single quotes, and one property:

    "name": "[concat('storage', uniqueString(resourceGroup().id))]",

If you do not provide all of the matching syntax, the template will produce a value that is very different than your intention.

When you receive this type of error, carefully review the expression syntax. Consider using a JSON editor like [Visual Studio](vs-azure-tools-resource-groups-deployment-projects-create-deploy.md) or [Visual Studio Code](resource-manager-vs-code.md) which can warn you about syntax errors. 

## Incorrect segment lengths

Another invalid template error occurs when the resource name is not in the correct format.

    Code=InvalidTemplate
    Message=Deployment template validation failed: 'The template resource {resource-name}' 
    for type {resource-type} has incorrect segment lengths.

A root level resource must one less segment in the name than in the resource type. Each segment is differentiated by a slash. In the following example, the type has 2 segments and the name has 1 segment, so it is a **valid name**.

    {
      "type": "Microsoft.Web/serverfarms",
      "name": "myHostingPlanName",

But the next example is **not a valid name** because it has the same number of segments as the type.

    {
      "type": "Microsoft.Web/serverfarms",
      "name": "appPlan/myHostingPlanName",

For child resources, the type and name must have the same number of segments. This makes sense because the full name and type for the child includes the parent name and type, so the full name still has one less segment than the full type. 

    "resources": [
        {
            "type": "Microsoft.KeyVault/vaults",
            "name": "contosokeyvault",
            ...
            "resources": [
                {
                    "type": "secrets",
                    "name": "appPassword",

Getting the segments right can be particularly tricky with Resource Manager types that are applied across resource providers. For example, applying a resource lock to a web site requires a type with 4 segments. Therefore, the name is 3 segments:

    {
        "type": "Microsoft.Web/sites/providers/locks",
        "name": "[concat(variables('siteName'),'/Microsoft.Authorization/MySiteLock')]",

## Resource name already taken or is already used by another resource

For some resources, most notably storage accounts, database servers, and web sites, you must provide a name for the resource that is unique across all of Azure. If you do not provide a unique name, you may receive an error like:

    Code=StorageAccountAlreadyTaken 
    Message=The storage account named mystorage is already taken.

You can create a unique name by concatenating your naming convention with the result of the [uniqueString](resource-group-template-functions.md#uniquestring) function.

    "name": "[concat('contosostorage', uniqueString(resourceGroup().id))]",
    "type": "Microsoft.Storage/storageAccounts",

## Cannot find resource during deployment

Resource Manager optimizes deployment by creating resources in parallel, when possible. If one resource must be deployed after another resource, you need to use the **dependsOn** element in your template to create a dependency on the other resource. For example, when deploying a web app, the App Service plan must exist. If you have not specified that the web app is dependent on the App Service plan, Resource Manager will create both resources at the same time. You will receive an error stating that the App Service plan resource cannot be found, because it does not exist yet when attempting to set a property on the web app. You can prevent this error by setting the dependency in the web app.

    {
      "apiVersion": "2015-08-01",
      "type": "Microsoft.Web/sites",
      ...
      "dependsOn": [
        "[variables('hostingPlanName')]"
      ],
      ...
    }

## Could not find member 'copy' on object

You encounter this error when you have applied the **copy** element to a part of the template that does not support this element. You can only apply the copy element to a resource type. You cannot apply copy to a property within a resource type. For example, you apply copy to a virtual machine, but you cannot apply it to the OS disks for a virtual machine. In some cases, you can convert a child resource to a parent resource to create a copy loop. For more information about using copy, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md).

## SKU not available

When deploying a resource (typically a virtual machine), you may receive the following error code and error message:

    Code: SkuNotAvailable
    Message: The requested tier for resource '<resource>' is currently not available in location '<location>' for subscription '<subscriptionID>'. Please try another tier or deploy to a different location.

You receive this error when the resource SKU you have selected (such as VM size) is not available for the location you have selected. You have two options to resolve this issue:

1.	Log into portal and begin adding a new resource through the UI. As you set the values, you will see the available SKUs for that resource.

    ![available skus](./media/resource-manager-common-deployment-errors/view-sku.png)

2.	If you are unable to find a suitable SKU in that region or an alternative region that meets your business needs, please reach out to [Azure Support](https://portal.azure.com/#create/Microsoft.Support).


## No registered provider found

When deploying resource, you may receive the following error code and message:

    Code: NoRegisteredProviderFound
    Message: No registered resource provider found for location '<location>' and API version '<api-version>' for type '<resource-type>'.

You receive this error for one of three reasons:

1. Location not supported for the resource type
2. API version not supported for the resource type
3. The resource provider has not been registered for your subscription

The error message should give you suggestions for the supported locations and API versions. You can change your template to one of the suggested values. Most providers are registered automatically by the Azure portal or the command-line interface you are using, but not all. If you have not used a particular resource provider before, you may need to register that provider. You can discover more about resource providers with the following commands.

### PowerShell

To see your registration status, use **Get-AzureRmResourceProvider**.

    Get-AzureRmResourceProvider -ListAvailable

To register a provider, use **Register-AzureRmResourceProvider** and provide the name of the resource provider you wish to register.

    Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Cdn

To get the supported locations for a particular type of resource, use:

    ((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).Locations

To get the supported API versions for a particular type of resource, use:

    ((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).ApiVersions

### Azure CLI

To see whether the provider is registered, use the `azure provider list` command.

    azure provider list

To register a resource provider, use the `azure provider register` command, and specify the *namespace* to register.

    azure provider register Microsoft.Cdn

To see the supported locations and API versions for a resource provider, use:

    azure provider show -n Microsoft.Compute --json > compute.json

## Quota exceeded

You might have issues when deployment exceeds a quota, which could be per resource group, subscriptions, accounts, and other scopes. For example, your subscription may be configured to limit the number of cores for a region. If you attempt to deploy a virtual machine with more cores than the permitted amount, you will receive an error stating the quota has been exceeded.
For complete quota information, see [Azure subscription and service limits, quotas, and constraints](azure-subscription-service-limits.md).

To examine your subscription's quotas for cores, you can use the `azure vm list-usage` command in the Azure CLI. The following example illustrates that the core quota for a
free trial account is 4:

    azure vm list-usage

Which returns:

    info:    Executing command vm list-usage
    Location: westus
    data:    Name   Unit   CurrentValue  Limit
    data:    -----  -----  ------------  -----
    data:    Cores  Count  0             4
    info:    vm list-usage command OK

If you were to try to deploy a template that creates more than 4 cores into the West US region on the above subscription, you would get a deployment error that might look something like this (either in the portal or by investigating the deployment logs):

    statusCode:Conflict
    serviceRequestId:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    statusMessage:{"error":{"code":"OperationNotAllowed","message":"Operation results in exceeding quota limits of Core. Maximum allowed: 4, Current in use: 4, Additional requested: 2."}}

Or in PowerShell, you can use the **Get-AzureRmVMUsage** cmdlet.

    Get-AzureRmVMUsage

Which returns:

    ...
    CurrentValue : 0
    Limit        : 4
    Name         : {
                     "value": "cores",
                     "localizedValue": "Total Regional Cores"
                   }
    Unit         : null
    ...

In these cases, you should go to the portal and file a support issue to raise your quota for the region into which you want to deploy.

> [AZURE.NOTE] Remember that for resource groups, the quota is for each individual region, not for the entire subscription. If you need to deploy 30 cores in West US, you have to ask for 30 Resource Manager cores in West US. If you need to deploy 30 cores in any of the regions to which you have access, you should ask for 30 resource Manager cores in all regions.


## Authorization failed

You may receive an error during deployment because the account or service principal attempting to deploy the resources does not have access to perform those actions. Azure Active Directory enables you or your administrator to control which identities can access what resources with a great degree of precision. For example, if your account is assigned to the Reader role, it will not be able to create new resources. In that case, you should see an error message indicating that authorization failed.

For more information about role-based access control, see [Azure Role-Based Access Control](./active-directory/role-based-access-control-configure.md).

In addition to role-based access control, your deployment actions may be limited by policies on the subscription. Through policies, the administrator can enforce conventions on all resources deployed in the subscription. For example, an administrator can require that a particular tag value be provided for a resource type. If you have not fulfilled the policy requirements, you will receive an error during deployment. For more information about policies, see [Use Policy to manage resources and control access](resource-manager-policy.md).

## Troubleshooting virtual machines

| Error | Articles |
| -------- | ----------- |
| Custom script extension errors | [Windows VM extension failures](./virtual-machines/virtual-machines-windows-extensions-troubleshoot.md)<br />or<br />[Linux VM extension failures](./virtual-machines/virtual-machines-linux-extensions-troubleshoot.md) |
| OS image provisioning errors | [New Windows VM errors](./virtual-machines/virtual-machines-windows-troubleshoot-deployment-new-vm.md)<br />or<br />[New Linux VM errors](./virtual-machines/virtual-machines-linux-troubleshoot-deployment-new-vm.md ) |
| Allocation failures | [Windows VM allocation failures](./virtual-machines/virtual-machines-windows-allocation-failure.md)<br />or<br />[Linux VM allocation failures](./virtual-machines/virtual-machines-linux-allocation-failure.md) |
| Secure Shell (SSH) errors when attempting to connect | [Secure Shell connections to Linux VM](./virtual-machines/virtual-machines-linux-troubleshoot-ssh-connection.md) |
| Errors connecting to application running on VM | [Application running on Windows VM](./virtual-machines/virtual-machines-windows-troubleshoot-app-connection.md)<br />or<br />[Application running on a Linux VM](./virtual-machines/virtual-machines-linux-troubleshoot-app-connection.md) |
| Remote Desktop connection errors | [Remote Desktop connections to Windows VM](./virtual-machines/virtual-machines-windows-troubleshoot-rdp-connection.md) |
| Connection errors resolved by re-deploying | [Redeploy Virtual Machine to new Azure node](./virtual-machines/virtual-machines-windows-redeploy-to-new-node.md) |
| Cloud service errors | [Cloud service deployment problems](./cloud-services/cloud-services-troubleshoot-deployment-problems.md) |

## Troubleshooting other services

The following table is not a complete list of troubleshooting topics for Azure. Instead, it focuses on issues related to deploying or configuring resources. If you need help troubleshooting run-time issues with a resource, see the documentation for that Azure service.

| Service | Article |
| -------- | -------- |
| Automation | [Troubleshooting tips for common errors in Azure Automation](./automation/automation-troubleshooting-automation-errors.md) |
| Azure Stack | [Microsoft Azure Stack troubleshooting](./azure-stack/azure-stack-troubleshooting.md) |
| Azure Stack | [Web Apps and Azure Stack](./azure-stack/azure-stack-webapps-troubleshoot-known-issues.md ) |
| Data Factory | [Troubleshoot Data Factory issues](./data-factory/data-factory-troubleshoot.md) |
| Service Fabric | [Troubleshoot common issues when you deploy services on Azure Service Fabric](./service-fabric/service-fabric-diagnostics-troubleshoot-common-scenarios.md) |
| Site Recovery | [Monitor and troubleshoot protection for virtual machines and physical servers](./site-recovery/site-recovery-monitoring-and-troubleshooting.md) |
| Storage | [Monitor, diagnose, and troubleshoot Microsoft Azure Storage](./storage/storage-monitoring-diagnosing-troubleshooting.md) |
| StorSimple | [Troubleshoot StorSimple device deployment issues](./storsimple/storsimple-troubleshoot-deployment.md) |
| SQL Database | [Troubleshoot connection issues to Azure SQL Database](./sql-database/sql-database-troubleshoot-common-connection-issues.md) |
| SQL Data Warehouse | [Troubleshooting Azure SQL Data Warehouse](./sql-data-warehouse/sql-data-warehouse-troubleshoot.md) |

## Understand when a deployment is ready

Azure Resource Manager reports success on a deployment when all providers return from deployment successfully. However, that this does not necessarily mean that your resource group is "active and ready for your users". For example, a deployment may need to download upgrades, wait on non-template resources, or install complex scripts or some other executable activity that Azure does not know about because it is not an activity that a provider is tracking. In these cases, it can be some time before your resources are ready for real-world use. As a result, you should expect that the deployment status succeeds some time before your deployment can be used.

You can prevent Azure from reporting deployment success, however, by creating a custom script for your custom template -- using
the [CustomScriptExtension](https://azure.microsoft.com/blog/2014/08/20/automate-linux-vm-customization-tasks-using-customscript-extension/) for example -- that knows how to monitor the entire deployment for system-wide readiness and returns successfully only when users can interact with the entire deployment. If you want to ensure that your extension is the last to run, use the **dependsOn** property in your template.

## Next steps

- To learn about auditing actions, see [Audit operations with Resource Manager](resource-group-audit.md).
- To learn about actions to determine the errors during deployment, see [View deployment operations](resource-manager-troubleshoot-deployments-portal.md).
