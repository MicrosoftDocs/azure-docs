<properties
   pageTitle="Common Azure deployment errors | Microsoft Azure"
   description="Describes how to resolve common errors during deploy with Azure Resource Manager."
   services="azure-resource-manager"
   documentationCenter=""
   tags=""
   authors="tfitzmac"
   manager="timlt"
   editor="tysonn"/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="04/19/2016"
   ms.author="tomfitz"/>

# Resolve common errors when deploying resources to Azure with Azure Resource Manager

This topic describes how you can resolve some of the common errors you may encounter when deploying resources to Azure. For information about troubleshooting deployments, see 
[Troubleshooting resource group deployments](resource-manager-troubleshoot-deployments-portal.md).

You can avoid some errors by validating your template and parameters prior to deployment. For examples of validating your template, see [Deploy resources with Azure Resource Manager template](resource-group-template-deploy.md).

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

## Resource name already exists

For some resources, most notably Storage accounts, database servers, and web sites, you must provide a name for the resource that is unique across all of Azure. 
You can create a unique name by concatenating your naming convention with the result of the [uniqueString](./resource-group-template-functions/#uniquestring) function.
 
    "name": "[concat('contosostorage', uniqueString(resourceGroup().id))]", 
    "type": "Microsoft.Storage/storageAccounts", 

## Cannot find resource during deployment

Resource Manager optimizes deployment by creating resources in parallel, when possible. If one resource must be deployed after another resource, you need to use the **dependsOn** element in your 
template to create a dependency on the other resource. For example, when deploying a web app, the App Service plan must exist. If you have not specified that the web app is dependent on the App Service plan, 
Resource Manager will create both resources at the same time. You will receive an error stating that the App Service plan resource cannot be found, because it does not exist yet when attempting to set a property 
on the web app. You can prevent this error by setting the dependency in the web app.

    {
      "apiVersion": "2015-08-01",
      "type": "Microsoft.Web/sites",
      ...
      "dependsOn": [
        "[variables('hostingPlanName')]"
      ],
      ...
    }

## Location not available for resource

When specifying a location for a resource, you must use one of the locations that supports the resource. Before you enter a location for a resource, use one of the following commands to verify that the location 
supports the resource type.

### PowerShell

Use **Get-AzureRmResourceProvider** to get supported types and locations for a particular resource provider.

    Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Web

You will get a list of the resource types for that resource provider.

    ProviderNamespace RegistrationState ResourceTypes               Locations
    ----------------- ----------------- -------------               ---------
    Microsoft.Web     Registered        {sites/extensions}          {Brazil South, ...
    Microsoft.Web     Registered        {sites/slots/extensions}    {Brazil South, ...
    Microsoft.Web     Registered        {sites/instances}           {Brazil South, ...
    ...

You can focus on the locations for a particular type of resource with:

    ((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).Locations

Which returns the supported locations:

    Brazil South
    East Asia
    East US
    Japan East
    Japan West
    North Central US
    North Europe
    South Central US
    West Europe
    West US
    Southeast Asia

### Azure CLI

For Azure CLI, you can use **azure location list**. Because the list of locations can be long, and there are many providers, you can use tools to examine providers and locations before you use a location that isn't available yet. The following script uses **jq** to discover the locations where the resource provider for Azure virtual machines is available.

    azure location list --json | jq '.[] | select(.name == "Microsoft.Compute/virtualMachines")'
    
Which returns the supported locations:
    
    {
      "name": "Microsoft.Compute/virtualMachines",
      "location": "East US,East US 2,West US,Central US,South Central US,North Europe,West Europe,East Asia,Southeast Asia,Japan East,Japan West"
    }

### REST API

For REST API, see [Get information about a resource provider](https://msdn.microsoft.com/library/azure/dn790534.aspx).

## Quota exceeded

You might have issues when deployment exceeds a quota, which could be per resource group, subscriptions, accounts, and other scopes. For example, your subscription may be configured to limit the number of cores for a region. 
If you attempt to deploy a virtual machine with more cores than the permitted amount, you will receive an error stating the quota has been exceeded. 
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

You may receive an error during deployment because the account or service principal attempting to deploy the resources does not have access to perform those actions. 
Azure Active Directory enables you or your administrator to control which identities can access what resources with a great degree of precision. For example, if your account is assigned to the Reader role, it will not be 
able to create new resources. In that case, you should see an error message indicating that authorization failed.

For more information about role-based access control, see [Azure Role-Based Access Control](./active-directory/role-based-access-control-configure.md).

In addition to role-based access control, you deployment actions may be limited by policies on the subscription. Through policies, the administrator can enforce conventions on all resources deployed in the 
subscription. For example, an administrator can require that a particular tag value be provided for a resource type. If you have not fulfilled the policy requirements, you will receive an error during 
deployment. For more information about policies, see [Use Policy to manage resources and control access](resource-manager-policy.md).

## Check resource provider registration

Resources are managed by resource providers, and an account or subscription must be registered to use a particular provider. Most providers are registered automatically by the Azure portal or the command-line interface 
you are using, but not all.

### PowerShell

To see your registration status, use **Get-AzureRmResourceProvider**.

    Get-AzureRmResourceProvider -ListAvailable

Which returns all available resource providers and your registration status:

    ProviderNamespace               RegistrationState ResourceTypes
    -----------------               ----------------- -------------
    Microsoft.ApiManagement         Unregistered      {service, validateServiceName, checkServiceNameAvailability}
    Microsoft.AppService            Registered        {apiapps, appIdentities, gateways, deploymenttemplates...}
    Microsoft.Batch                 Registered        {batchAccounts}

To register a provider, use **Register-AzureRmResourceProvider** and provide the name of the resource provider you wish to register.

    Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Cdn

You are asked to confirm the registration, and then returned a status.

    Confirm
    Are you sure you want to register the provider 'Microsoft.Cdn'
    [Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): Y

    ProviderNamespace RegistrationState ResourceTypes
    ----------------- ----------------- -------------
    Microsoft.Cdn     Registering       {profiles, profiles/endpoints,...

### Azure CLI

To see whether the provider is registered for use using the Azure CLI, use the `azure provider list` command (the following is a truncated example of the output).

    azure provider list
        
Which returns all available resource providers and your registration status:
        
    info:    Executing command provider list
    + Getting ARM registered providers
    data:    Namespace                        Registered
    data:    -------------------------------  -------------
    data:    Microsoft.Compute                Registered
    data:    Microsoft.Network                Registered  
    data:    Microsoft.Storage                Registered
    data:    microsoft.visualstudio           Registered
    ...
    info:    provider list command OK

To register a resource provider, use the `azure provider register` command, and specify the *namespace* to register.

    azure provider register Microsoft.Cdn

### REST API

To get registration status, see [Get information about a resource provider](https://msdn.microsoft.com/library/azure/dn790534.aspx).

To register a provider, see [Register a subscription with a resource provider](https://msdn.microsoft.com/library/azure/dn790548.aspx).

## Custom script extension errors

If you encounter an error with a custom script extension when deploying a virtual machine, see [Troubleshooting Azure Windows VM extension failures](./virtual-machines/virtual-machines-windows-extensions-troubleshoot.md) 
or [Troubleshooting Azure Linux VM extension failures](./virtual-machines/virtual-machines-linux-extensions-troubleshoot.md).

## Understand when a deployment is ready 

Azure Resource Manager reports success on a deployment when all providers return from deployment successfully. However, that this does not necessarily mean that your resource group is "active and ready for your users". 
For example, a deployment may need to download upgrades, wait on 
non-template resources, or install complex scripts or some other executable activity that Azure does not know about because it is not an activity that a provider is tracking. In these cases, it can be some 
time before your resources are ready for real-world use. As a result, you should expect that the deployment status succeeds some time before your deployment can be used.

You can prevent Azure from reporting deployment success, however, by creating a custom script for your custom template -- using 
the [CustomScriptExtension](https://azure.microsoft.com/blog/2014/08/20/automate-linux-vm-customization-tasks-using-customscript-extension/) for example -- that knows how to monitor the entire deployment for 
system-wide readiness and returns successfully only when users can interact with the entire deployment. If you want to ensure that your extension is the last to run, use the **dependsOn** property in your template. 

## Next steps

- To learn about auditing actions, see [Audit operations with Resource Manager](resource-group-audit.md).
- To learn about actions to determine the errors during deployment, see [Troubleshooting resource group deployments](resource-manager-troubleshoot-deployments-portal.md).