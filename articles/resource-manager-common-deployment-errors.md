<properties
   pageTitle="Troubleshoot common Azure deployment errors | Microsoft Azure"
   description="Describes how to resolve common errors during deploy with Azure Resource Manager."
   services="azure-resource-manager"
   documentationCenter=""
   tags="top-support-issue"
   authors="tfitzmac"
   manager="timlt"
   editor="tysonn"/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="06/15/2016"
   ms.author="tomfitz"/>

# Troubleshoot common errors when deploying resources to Azure with Azure Resource Manager

This topic describes how you can resolve some common errors you may encounter when deploying resources to Azure. If you need more information about what went work with your deployment, first see [View deployment operations](resource-manager-troubleshoot-deployments-portal.md) and then come back to this article for help with resolving the error.

## Invalid template or resource

If you receive an error stating that either the template or a property on a resource is invalid, you may have a missing character in your template. This error 
is easy to make when using template expressions because the expression is wrapped in quotes, so the JSON still validates and your editor may not 
detect the error. For example, the following name assignment for a storage account contains one set of brackets, three functions, 
three sets of parentheses, one set of single quotes, and one property:

    "name": "[concat('storage', uniqueString(resourceGroup().id))]",

If you do not provide all of the matching syntax, the template will produce a value that is very different than your intention.

Depending on where the missing character is located in your template, you will receive an error stating that either the template or a resource is invalid. 
The error may also state the deployment process was unable to process the template language expression. When you receive this type of error, carefully 
review the expression syntax.

## Resource name already exists or is already used by another resource

For some resources, most notably storage accounts, database servers, and web sites, you must provide a name for the resource that is unique across all of Azure. 
You can create a unique name by concatenating your naming convention with the result of the [uniqueString](resource-group-template-functions.md#uniquestring) function.
 
    "name": "[concat('contosostorage', uniqueString(resourceGroup().id))]", 
    "type": "Microsoft.Storage/storageAccounts", 

## Cannot find resource during deployment

Resource Manager optimizes deployment by creating resources in parallel, when possible. If one resource must be deployed after another resource, you need to use the **dependsOn** element in your 
template to create a dependency on the other resource. For example, when deploying a web app, the App Service plan must exist. If you have not specified that the web app is dependent on the App Service plan, Resource Manager will create both resources at the same time. You will receive an error stating that the App Service plan resource cannot be found, because it does not exist yet when attempting to set a property on the web app. You can prevent this error by setting the dependency in the web app.

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

You will receive an error code **NoRegisteredProviderFound** for one of three reasons:

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

## Virtual machine troubleshooting

| Articles | Description |
| -------- | ----------- |
| [Troubleshooting Azure Windows VM extension failures](./virtual-machines/virtual-machines-windows-extensions-troubleshoot.md)<br />or<br />[Troubleshooting Azure Linux VM extension failures](./virtual-machines/virtual-machines-linux-extensions-troubleshoot.md) | Custom script extension error |
| [Troubleshoot creating a new Windows VM](./virtual-machines/virtual-machines-windows-troubleshoot-deployment-new-vm.md)<br />or<br />[Troubleshoot creating a new Linux VM](./virtual-machines/virtual-machines-linux-troubleshoot-deployment-new-vm.md ) | OS image provisioning error |
| [Troubleshoot allocation failures for Windows VM](./virtual-machines/virtual-machines-windows-allocation-failure.md)<br />or<br />[Troubleshoot allocation failures for Linux VM](./virtual-machines/virtual-machines-linux-allocation-failure.md) | Allocation failures  |
| [Troubleshoot Secure Shell connections to a Linux-based Azure virtual machine](./virtual-machines/virtual-machines-linux-troubleshoot-ssh-connection.md) | Secure Shell (SSH) errors when attempting to connect |
| [Troubleshoot access to an application running on a Windows virtual machine](./virtual-machines/virtual-machines-windows-troubleshoot-app-connection.md)<br />or<br />[Troubleshoot access to an application running on a Linux virtual machine](./virtual-machines/virtual-machines-linux-troubleshoot-app-connection.md) | Error connecting to an application running on a VM |
| [Troubleshoot Remote Desktop connections to an Azure virtual machine running Windows](./virtual-machines/virtual-machines-windows-troubleshoot-rdp-connection.md) | Cannot connect to VM |
| [Redeploy Virtual Machine to new Azure node](./virtual-machines/virtual-machines-windows-redeploy-to-new-node.md) | Resolve connection error by re-deploying |
| [Troubleshoot cloud service deployment problems](./cloud-services/cloud-services-troubleshoot-deployment-problems.md) | Cloud service errors |

## Other Azure servcies troubleshooting

The following topics focus on issues related to deploying or configuring resources. If you need help troubleshooting a run-time issues with a resource, see the documentation for that Azure services. 

| Articles | Services |
| -------- | -------- |
| [Troubleshooting tips for common errors in Azure Automation](./automation/automation-troubleshooting-automation-errors.md) | Automation |
| [Microsoft Azure Stack troubleshooting](./azure-stack/azure-stack-troubleshooting.md) | Azure Stack |
| [Web Apps and Azure Stack](./azure-stack/azure-stack-webapps-troubleshoot-known-issues.md ) | Azure Stack |
| [Troubleshoot Data Factory issues](./data-factory/data-factory-troubleshoot.md) | Data Factory |
| [Troubleshoot StorSimple device deployment issues](./storsimple/storsimple-troubleshoot-deployment.md) | StorSimple |
| [Monitor and troubleshoot protection for virtual machines and physical servers](./site-recovery/site-recovery-monitoring-and-troubleshooting.md) | Site Recovery |
| [Troubleshoot connection issues to Azure SQL Database](./sql-database/sql-database-troubleshoot-common-connection-issues.md) | SQL Database |
| [Troubleshoot common issues when you deploy services on Azure Service Fabric](./service-fabric/service-fabric-diagnostics-troubleshoot-common-scenarios.md) | Service Fabric |
| [Troubleshooting Azure SQL Data Warehouse](./sql-data-warehouse/sql-data-warehouse-troubleshoot.md) | SQL Data Warehouse |
| [Monitor, diagnose, and troubleshoot Microsoft Azure Storage](./storage/storage-monitoring-diagnosing-troubleshooting.md) | Storage |


## Understand when a deployment is ready 

Azure Resource Manager reports success on a deployment when all providers return from deployment successfully. However, that this does not necessarily mean that your resource group is "active and ready for your users". For example, a deployment may need to download upgrades, wait on non-template resources, or install complex scripts or some other executable activity that Azure does not know about because it is not an activity that a provider is tracking. In these cases, it can be some time before your resources are ready for real-world use. As a result, you should expect that the deployment status succeeds some time before your deployment can be used.

You can prevent Azure from reporting deployment success, however, by creating a custom script for your custom template -- using 
the [CustomScriptExtension](https://azure.microsoft.com/blog/2014/08/20/automate-linux-vm-customization-tasks-using-customscript-extension/) for example -- that knows how to monitor the entire deployment for system-wide readiness and returns successfully only when users can interact with the entire deployment. If you want to ensure that your extension is the last to run, use the **dependsOn** property in your template. 

## Next steps

- To learn about auditing actions, see [Audit operations with Resource Manager](resource-group-audit.md).
- To learn about actions to determine the errors during deployment, see [View deployment operations](resource-manager-troubleshoot-deployments-portal.md).
- To troubleshoot Remote Desktop Protocol errors to your Windows-based virtual machine, see [Troubleshoot Remote Desktop connections](./virtual-machines/virtual-machines-windows-troubleshoot-rdp-connection.md).
- To troubleshoot Secure Shell errors to your Linux-based virtual machine, see [Troubleshoot Secure Shell connections](./virtual-machines/virtual-machines-linux-troubleshoot-ssh-connection.md).
