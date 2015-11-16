<properties
   pageTitle="Troubleshooting resource group deployments | Microsoft Azure"
   description="Describes common problems deploying resources created using Resource Manager deployment model, and shows how to detect and fix these issues."
   services="azure-resource-manager,virtual-machines"
   documentationCenter=""
   authors="tfitzmac"
   manager="wpickett"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-multiple"
   ms.workload="infrastructure"
   ms.date="10/14/2015"
   ms.author="tomfitz;rasquill"/>

# Troubleshooting resource group deployments in Azure

When you encounter a problem during deployment, you need to discover what went wrong. Resource Manager provides two ways for you to find out what happened and why it happened. You can use deployment commands to retrieve information about 
particular deployments for a resource group. Or, you can use the audit logs to retrieve information about all operations performed on a resource group.  With this information, you can fix the 
issue and resume operations in your solution.

This topic focuses primarily on using deployment commands to troubleshoot deployments. For information about using the audit logs to track all operations on your resources, see [Audit operations with Resource Manager](../resource-group-audit.md).

This topic shows how to retrieve troubleshooting information through Azure PowerShell, Azure CLI and REST API. For information about using the preview portal to troubleshoot deployments, see [Using the Azure Preview Portal to manage your Azure resources](../azure-portal/resource-group-portal.md).

Solutions to common errors that users encounter are also described in this topic.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] classic deployment model. You can't create resource groups with the classic deployment model.


## Troubleshoot with PowerShell

[AZURE.INCLUDE [powershell-preview-inline-include](../../includes/powershell-preview-inline-include.md)]

You can get the overall status of a deployment with the **Get-AzureRmResourceGroupDeployment** command. In the example below the deployment has failed.

    PS C:\> Get-AzureRmResourceGroupDeployment -ResourceGroupName ExampleGroup -DeploymentName ExampleDeployment

    DeploymentName    : ExampleDeployment
    ResourceGroupName : ExampleGroup
    ProvisioningState : Failed
    Timestamp         : 8/27/2015 8:03:34 PM
    Mode              : Incremental
    TemplateLink      :
    Parameters        :
                    Name             Type                       Value
                    ===============  =========================  ==========
                    siteName         String                     ExampleSite
                    hostingPlanName  String                     ExamplePlan
                    siteLocation     String                     West US
                    sku              String                     Free
                    workerSize       String                     0

    Outputs           :

Each deployment is usually made up of multiple operations, with each operation representing a step in the deployment process. To discover what went wrong with a deployment, you usually need to see details about the deployment operations. You can see the status of the operations with **Get-AzureRmResourceGroupDeploymentOperation**.

    PS C:\> Get-AzureRmResourceGroupDeploymentOperation -DeploymentName ExampleDeployment -ResourceGroupName ExampleGroup
    Id                        OperationId          Properties         
    -----------               ----------           -------------
    /subscriptions/xxxxx...   347A111792B648D8     @{ProvisioningState=Failed; Timestam...
    /subscriptions/xxxxx...   699776735EFC3D15     @{ProvisioningState=Succeeded; Times...

It shows two operations in the deployment. One has a provisioning state of Failed and the other of Succeeded. 

You can retrieve the status message with the following command:

    PS C:\> (Get-AzureRmResourceGroupDeploymentOperation -DeploymentName ExampleDeployment -ResourceGroupName ExampleGroup).Properties.StatusMessage

    Code       : Conflict
    Message    : Website with given name mysite already exists.
    Target     :
    Details    : {@{Message=Website with given name mysite already exists.}, @{Code=Conflict}, @{ErrorEntity=}}
    Innererror :

## Troubleshoot with Azure CLI

You can get the overall status of a deployment with the **azure group deployment show** command. In the example below the deployment has failed.

    azure group deployment show ExampleGroup ExampleDeployment

    info:    Executing command group deployment show
    + Getting deployments
    data:    DeploymentName     : ExampleDeployment
    data:    ResourceGroupName  : ExampleGroup
    data:    ProvisioningState  : Failed
    data:    Timestamp          : 2015-08-27T20:03:34.9178576Z
    data:    Mode               : Incremental
    data:    Name             Type    Value
    data:    ---------------  ------  ------------
    data:    siteName         String  ExampleSite
    data:    hostingPlanName  String  ExamplePlan
    data:    siteLocation     String  West US
    data:    sku              String  Free
    data:    workerSize       String  0
    info:    group deployment show command OK


You can find out more information about why the deployment failed in the audit logs. To see the audit logs, run the **azure group log show** command. You can include the **--last-deployment** option to retrieve only the log for the most recent deployment. 

    azure group log show ExampleGroup --last-deployment

The **azure group log show** command can return a lot of information. For troubleshooting, you usually want to focus on operations that failed. The following script uses the **--json** option and **jq** to search the log for deployment failures. To learn about tools like **jq**, see [Useful tools to interact with Azure](#useful-tools-to-interact-with-azure)

    azure group log show ExampleGroup --json | jq '.[] | select(.status.value == "Failed")'

    {
      "claims": {
        "aud": "https://management.core.windows.net/",
        "iss": "https://sts.windows.net/<guid>/",
        "iat": "1442510510",
        "nbf": "1442510510",
        "exp": "1442514410",
        "ver": "1.0",
        "http://schemas.microsoft.com/identity/claims/tenantid": "<guid>",
        "http://schemas.microsoft.com/identity/claims/objectidentifier": "<guid>",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "someone@example.com",
        "puid": "XXXXXXXXXXXXXXXX",
        "http://schemas.microsoft.com/identity/claims/identityprovider": "example.com",

        "altsecid": "1:example.com:XXXXXXXXXXX",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "<hash string>",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname": "Tom",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": "FitzMacken",
        "name": "Tom FitzMacken",
        "http://schemas.microsoft.com/claims/authnmethodsreferences": "pwd",
        "groups": "<guid>",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "example.com#someone@example.com",
        "wids": "<guid>",
        "appid": "<guid>",
        "appidacr": "0",
        "http://schemas.microsoft.com/identity/claims/scope": "user_impersonation",
        "http://schemas.microsoft.com/claims/authnclassreference": "1",
        "ipaddr": "000.000.000.000"
      },
      "properties": {
        "statusCode": "Conflict",
        "statusMessage": "{\"Code\":\"Conflict\",\"Message\":\"Website with given name mysite already exists.\",\"Target\":null,\"Details\":[{\"Message\":\"Website with given name 
          mysite already exists.\"},{\"Code\":\"Conflict\"},{\"ErrorEntity\":{\"Code\":\"Conflict\",\"Message\":\"Website with given name mysite already exists.\",\"ExtendedCode\":
          \"54001\",\"MessageTemplate\":\"Website with given name {0} already exists.\",\"Parameters\":[\"mysite\"],\"InnerErrors\":null}}],\"Innererror\":null}"
      },
    ...

You can see **properties** includes information in json about the failed operation.

You can use the **--verbose** and **-vv** options to see more information from the logs.  Use the **--verbose** option to display the steps the operations go through on `stdout`. For a complete request history, use the **-vv** option. The messages often provide vital clues about the cause of any failures.

## Troubleshoot with REST API

The Resource Manager REST API provides URIs for retrieving information about a deployment, the operations for deployment, and details about a particular operation. For full descriptions of these commands see:

- [Get information about a template deployment](https://msdn.microsoft.com/library/azure/dn790565.aspx)
- [List all template deployment operations](https://msdn.microsoft.com/library/azure/dn790518.aspx)
- [Get information about a template deployment operation](https://msdn.microsoft.com/library/azure/dn790519.aspx)


## Refreshing expired credentials

Your deployment will fail if your Azure credentials have expired or if you have not signed into your Azure account. Your credentials can expire if your session is open too long. You can refresh your credentials with the following options:

- For PowerShell, use the **Login-AzureRmAccount** cmdlet (or **Add-AzureAccount** for versions of PowerShell prior to 1.0 Preview). The credentials in a publish settings file are not sufficient for the cmdlets in the AzureResourceManager module.
- For Azure CLI, use **azure login**. For help with authentication errors, make sure that you have [configured the Azure CLI correctly](../xplat-cli-connect.md).

## Checking the format of templates and parameters

If your template or parameter file is not in the correct format, your deployment will fail. Prior to executing a deployment, you can test the validity of your template and parameters.

### PowerShell

For PowerShell, use **Test-AzureRmResourceGroupDeployment** (or **Test-AzureResourceGroupTemplate** for versions of PowerShell prior to 1.0 Preview).

    PS C:\> Test-AzureRmResourceGroupDeployment -ResourceGroupName ExampleGroup -TemplateFile c:\Azure\Templates\azuredeploy.json -TemplateParameterFile c:\Azure\Templates\azuredeploy.parameters.json
    VERBOSE: 12:55:32 PM - Template is valid.

### Azure CLI

For Azure CLI, use **azure group template validate <resource group>**

The following example shows how to validate a template and any required parameters. The Azure CLI prompts you for parameter values that are required.

        azure group template validate \
        > --template-uri "https://contoso.com/templates/azuredeploy.json" \
        > resource-group
        info:    Executing command group template validate
        info:    Supply values for the following parameters
        adminUserName: UserName
        adminPassword: PassWord
        + Initializing template configurations and parameters
        + Validating the template
        info:    group template validate command OK

### REST API

For REST API, see [Validate a template deployment](https://msdn.microsoft.com/library/azure/dn790547.aspx).

## Checking which locations support the resource

When specifying a location for a resource, you must use one of the locations that supports the resource. Before you enter a location for a resource, use one of the following commands to verify that the location supports the resource type.

### PowerShell

For versions of PowerShell prior to 1.0 Preview, you can see the full list of resources and locations with the **Get-AzureLocation** command.

    PS C:\> Get-AzureLocation

    Name                                    Locations                               LocationsString
    ----                                    ---------                               ---------------
    ResourceGroup                           {East Asia, South East Asia, East US... East Asia, South East Asia, East US,...
    Microsoft.ApiManagement/service         {Central US, East US, East US 2, Nor... Central US, East US, East US 2, Nort...
    Microsoft.AppService/apiapps            {East US, West US, South Central US,... East US, West US, South Central US, ...
    ...

You can specify a particular type of resource with:

    PS C:\> Get-AzureLocation | Where-Object Name -eq "Microsoft.Compute/virtualMachines" | Format-Table Name, LocationsString -Wrap

    Name                                                        LocationsString
    ----                                                        ---------------
    Microsoft.Compute/virtualMachines                           East US, East US 2, West US, Central US, South Central US,
                                                                North Europe, West Europe, East Asia, Southeast Asia,
                                                                Japan East, Japan West

For PowerShell 1.0 Preview, use **Get-AzureRmResourceProvider** to get supported locations.

    PS C:\> Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Web

    ProviderNamespace RegistrationState ResourceTypes               Locations
    ----------------- ----------------- -------------               ---------
    Microsoft.Web     Registered        {sites/extensions}          {Brazil South, ...
    Microsoft.Web     Registered        {sites/slots/extensions}    {Brazil South, ...
    Microsoft.Web     Registered        {sites/instances}           {Brazil South, ...
    ...

You can specify a particular type of resource with:

    PS C:\> ((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).Locations

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
    {
      "name": "Microsoft.Compute/virtualMachines",
      "location": "East US,East US 2,West US,Central US,South Central US,North Europe,West Europe,East Asia,Southeast Asia,Japan East,Japan West"
    }

### REST API
        
For REST API, see [Get information about a resource provider](https://msdn.microsoft.com/library/azure/dn790534.aspx).

## Creating unique resource names

For some resources, most notably Storage accounts, database servers, and web sites, you must provide a name for the resource that is unique across all of Azure. Currently, there is no way to test whether a name is unique. We suggest using a naming convention that is unlikely to be used by other organizations.

## Authentication, subscription, role, and quota issues

There can be one or more of several issues preventing successful deployment involving authentication and authorization and Azure Active Directory. Regardless how you manage your Azure resource groups, the identity you use to sign in to your account must be an Azure Active Directory object. This identity can be a work or school account that you created or was assigned to you, or you can create a Service Principal for applications.

But Azure Active Directory enables you or your administrator to control which identities can access what resources with a great degree of precision. If your deployments are failing, examine the requests themselves for signs of authentication or authorization issues, and examine the deployment logs for your resource group. You might find that while you have permissions for some resources, you do not have permissions for others. Using the Azure CLI, you can examine Azure Active Directory tenants and users using the `azure ad` commands. (For a complete list of Azure CLI commands, see [Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Manager](azure-cli-arm-commands.md).)

You might also have issues when a deployment hits a default quota, which could be per resource group, subscriptions, accounts, and other scopes. Confirm to your satisfaction that you have the resources available to deploy correctly. For complete quota information, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).

To examine your own subscription's quotas for cores, you should use the `azure vm list-usage` command in the Azure CLI and the **Get-AzureVMUsage** cmdlet in PowerShell. The following shows the command in the Azure CLI, and illustrates that the core quota for a free trial account is 4:

    azure vm list-usage
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

In these cases, you should go to the portal and file a support issue to raise your quota for the region into which you want to deploy.

> [AZURE.NOTE] Remember that for resource groups, the quota is for each individual region, not for the entire subscription. If you need to deploy 30 cores in West US, you have to ask for 30 Resource Manager cores in West US. If you need to deploy 30 cores in any of the regions to which you have access, you should ask for 30 resource Manager cores in all regions.
<!-- -->
To be specific about cores, for example, you can check the regions for which you should request the appropriate quota amount by using the following command, which pipes out to **jq** for json parsing.
<!-- -->
        azure provider show Microsoft.Compute --json | jq '.resourceTypes[] | select(.name == "virtualMachines") | { name,apiVersions, locations}'
        {
          "name": "virtualMachines",
          "apiVersions": [
            "2015-05-01-preview",
            "2014-12-01-preview"
          ],
          "locations": [
            "East US",
            "West US",
            "West Europe",
            "East Asia",
            "Southeast Asia"
          ]
        }


## Checking resource provider registration

Resources are managed by resource providers, and an account or subscription might be enabled to use a particular provider. If you are enabled to use a provider, it must also be registered for use. Most providers are registered automatically by the Azure portal or the command-line interface you are using, but not all.

### PowerShell

To get a list of resource providers and your registration status, use **Get-AzureProvider** for versions of PowerShell prior to 1.0 Preview.

    PS C:\> Get-AzureProvider

    ProviderNamespace                       RegistrationState                       ResourceTypes
    -----------------                       -----------------                       -------------
    Microsoft.AppService                    Registered                              {apiapps, appIdentities, gateways, d...
    Microsoft.Batch                         Registered                              {batchAccounts}
    microsoft.cache                         Registered                              {Redis, checkNameAvailability, opera...
    ...

To register a provider, use **Register-AzureProvider**.

For Powershell 1.0 Preview, use **Get-AzureRmResourceProvider**.

    PS C:\> Get-AzureRmResourceProvider -ListAvailable

    ProviderNamespace               RegistrationState ResourceTypes
    -----------------               ----------------- -------------
    Microsoft.ApiManagement         Unregistered      {service, validateServiceName, checkServiceNameAvailability}
    Microsoft.AppService            Registered        {apiapps, appIdentities, gateways, deploymenttemplates...}
    Microsoft.Batch                 Registered        {batchAccounts}

To register a provider, use **Register-AzureRmResourceProvider**.

### Azure CLI

To see whether the provider is registered for use using the Azure CLI, use the `azure provider list` command (the following is a truncated example of the output).

        azure provider list
        info:    Executing command provider list
        + Getting ARM registered providers
        data:    Namespace                        Registered
        data:    -------------------------------  -------------
        data:    Microsoft.Compute                Registered
        data:    Microsoft.Network                Registered  
        data:    Microsoft.Storage                Registered
        data:    microsoft.visualstudio           Registered
        data:    Microsoft.Authorization          Registered
        data:    Microsoft.Automation             NotRegistered
        data:    Microsoft.Backup                 NotRegistered
        data:    Microsoft.BizTalkServices        NotRegistered
        data:    Microsoft.Features               Registered
        data:    Microsoft.Search                 NotRegistered
        data:    Microsoft.ServiceBus             NotRegistered
        data:    Microsoft.Sql                    Registered
        info:    provider list command OK

Again, if you want more information about providers, including their regional availability, type `azure provider list --json`. The following selects only the first one in the list to view:

        azure provider list --json | jq '.[0]'
        {
          "resourceTypes": [
            {
              "apiVersions": [
                "2014-02-14"
              ],
              "locations": [
                "North Central US",
                "East US",
                "West US",
                "North Europe",
                "West Europe",
                "East Asia"
              ],
              "properties": {},
              "name": "service"
            }
          ],
          "id": "/subscriptions/<guid>/providers/Microsoft.ApiManagement",
          "namespace": "Microsoft.ApiManagement",
          "registrationState": "Registered"
        }

If a provider requires registration, use the `azure provider register <namespace>` command, where the *namespace* value comes from the preceding list.

### REST API

To get registration status, see [Get information about a resource provider](https://msdn.microsoft.com/library/azure/dn790534.aspx).

To register a provider, see [Register a subscription with a resource provider](https://msdn.microsoft.com/library/azure/dn790548.aspx).


## Understanding when a deployment succeeds for custom templates

If you are using templates that you created, it's important to understand that the Azure Resource Manager system reports success on a deployment when all providers return from deployment successfully. This means that all of your template items were deployed for your usage.

Note however, that this does not necessarily mean that your resource group is "active and ready for your users". For example, most deployments request the deployment to download upgrades, wait on other, non-template resources, or to install complex scripts or some other executable activity that Azure does not know about because it is not an activity that a provider is tracking. In these cases, it can be some time before your resources are ready for real-world use. As a result, you should expect that the deployment status succeeds some time before your deployment can be used.

You can prevent Azure from reporting deployment success, however, by creating a custom script for your custom template -- using the [CustomScriptExtension](http://azure.microsoft.com/blog/2014/08/20/automate-linux-vm-customization-tasks-using-customscript-extension/) for example -- that knows how to monitor the entire deployment for system-wide readiness and returns successfully only when users can interact with the entire deployment. If you want to ensure that your extension is the last to run, use the **dependsOn** property in your template. An example can be seen [here](https://msdn.microsoft.com/library/azure/dn790564.aspx).

## Useful tools to interact with Azure
When you work with your Azure resources from the command-line, you will collect tools that help you do your work. Azure resource group templates are JSON documents, and the Azure Resource Manager API accepts and returns JSON, so JSON parsing tools are some of the first things you will use to help you navigate information about your resources and to design or interact with templates and template parameter files.

### Mac, Linux, and Windows tools
If you use the Azure Command-Line Interface for Mac, Linux, and Windows, you are probably familiar with standard download tools such as **[curl](http://curl.haxx.se/)** and **[wget](https://www.gnu.org/software/wget/)**, or **[Resty](https://github.com/beders/Resty)**, and JSON utilities such as **[jq](http://stedolan.github.io/jq/download/)**, **[jsawk](https://github.com/micha/jsawk)**, and language libraries that handle JSON well. (Many of these tools also have ports for Windows, such as [wget](http://gnuwin32.sourceforge.net/packages/wget.htm); in fact, there are several ways to get Linux and other open-source software tools running on Windows as well.)

This topic includes some Azure CLI commands that you can use with **jq** to obtain precisely the information that you want more efficiently. You should choose the toolset that you are comfortable with to help you understand your Azure resource usage.

### PowerShell

PowerShell has several basic commands to perform the same procedures.

- Use the **[Invoke-WebRequest](https://technet.microsoft.com/library/hh849901%28v=wps.640%29)** cmdlet to download files such as resource group templates or parameters JSON files.
- Use the **[ConvertFrom-Json](https://technet.microsoft.com/library/hh849898%28v=wps.640%29.aspx)** cmdlet to convert a JSON string to a custom object ([PSCustomObject](https://msdn.microsoft.com/library/windows/desktop/system.management.automation.pscustomobject%28v=vs.85%29.aspx)) that has a property for each field in the JSON string.


## Next steps

To master the creation of templates, read through the [Authoring Azure Resource Manager templates](../resource-group-authoring-templates.md), and walk through the [Azure quickstart templates repository](https://github.com/Azure/azure-quickstart-templates) for deployable examples. An examples of the **dependsOn** property is the [Create a VM with multiple NICs and RDP accessible](https://github.com/Azure/azure-quickstart-templates/tree/master/201-1-vm-loadbalancer-2-nics).

<!--Image references-->

<!--Reference style links - using these makes the source content way more readable than using inline links-->

