<properties
   pageTitle="Troubleshooting resource group deployments in Azure"
   description="Describes common problems deploying resources in Azure, and shows how to use the Azure portal, the Azure Command-Line Interface for Mac, Linux, and Windows (Azure CLI), and PowerShell to examine deployments and detect issues."
   services="virtual-machines"
   documentationCenter=""
   authors="squillace"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="command-line-interface"
   ms.workload="infrastructure"
   ms.date="08/26/2015"
   ms.author="rasquill"/>

# Troubleshooting resource group deployments in Azure

Deployments can fail for any number of reasons. It is far better to prevent deployment errors by checking a few things in advance. This document describes tools and operations to prevent simple mistakes, to download template files, and to examine deployment logs. It also discusses the main areas to think about when examining deployment logs for failures.

## Useful tools to interact with Azure
When you work with your Azure resources from the command-line, you will collect tools that help you do your work. Azure resource group templates are JSON documents, and the Azure Resource Manager API accepts and returns JSON, so JSON parsing tools are some of the first things you will use to help you navigate information about your resources and to design or interact with templates and template parameter files.

### Mac, Linux, and Windows tools
If you use the Azure Command-Line Interface for Mac, Linux, and Windows, you are probably familiar with standard download tools such as **[curl](http://curl.haxx.se/)** and **[wget](https://www.gnu.org/software/wget/)**, or **[Resty](https://github.com/beders/Resty)**, and JSON utilities such as **[jq](http://stedolan.github.io/jq/download/)**, **[jsawk](https://github.com/micha/jsawk)**, and language libraries that handle JSON well. (Many of these tools also have ports for Windows, such as [wget](http://gnuwin32.sourceforge.net/packages/wget.htm); in fact, there are several ways to get Linux and other open-source software tools running on Windows as well.)

This topic includes some Azure CLI commands that you can use with **jq** to obtain precisely the information that you want more efficiently. You should choose the toolset that you are comfortable with to help you understand your Azure resource usage.

### Windows PowerShell

Windows PowerShell has several basic commands to perform the same procedures.

- Use the **[Invoke-WebRequest](https://technet.microsoft.com/library/hh849901%28v=wps.640%29)** cmdlet to download files such as resource group templates or parameters JSON files.
- Use the **[ConvertFrom-Json](https://technet.microsoft.com/library/hh849898%28v=wps.640%29.aspx)** cmdlet to convert a JSON string to a custom object ([PSCustomObject](https://msdn.microsoft.com/library/windows/desktop/system.management.automation.pscustomobject%28v=vs.85%29.aspx)) that has a property for each field in the JSON string.

## Preventing errors in the Azure CLI for Mac, Linux, and Windows

The Azure CLI has several commands to help prevent errors and detect what went wrong when errors occur.

- **azure location list**. This command gets the locations that support each type of resource, such as the provider for virtual machines. Before you enter a location for a resource, use this command to verify that the location supports the resource type.

    Because the list of locations can be long, and there are many providers, you can use tools to examine providers and locations before you use a location that isn't available yet. The following script uses **jq** to discover the locations where the resource provider for Azure virtual machines is available.

        azure location list --json | jq '.[] | select(.name == "Microsoft.Compute/virtualMachines")'
        {
          "name": "Microsoft.Compute/virtualMachines",
          "location": "East US,West US,West Europe,East Asia,Southeast Asia,North Europe"
        }

- **azure group template validate <resource group>**. This command validates your templates and template parameters before you use them. Enter a custom or gallery template and the template parameter values that  you plan to use.

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

## Getting information to fix deployment issues with the Azure CLI

- **azure group log show <resource group>**: This command gets the entries in the log for each deployment of the resource group. If something goes wrong, begin by examining the deployment logs.

        info:    Executing command group log show
        info:    Getting group logs
        data:    ----------
        data:    EventId:              <guid>
        data:    Authorization:
        data:                          action: Microsoft.Network/networkInterfaces/write
        data:                          role:   Subscription Admin
        data:                          scope:  /subscriptions/xxxxxxxxxxx/resourcegroups/templates/
                                               providers/Microsoft.Network/
                                               networkInterfaces/myNic
        data:    ResourceUri:          /subscriptions/xxxxxxxxxxxx/resourcegroups/templates/providers/
                                       Microsoft.Network/networkInterfaces/myNic
        data:    SubscriptionId:       <guid>
        data:    EventTimestamp (UTC): Wed Apr 22 2015 05:53:31 GMT+0000 (UTC)
        data:    OperationName:        Microsoft.Network/networkInterfaces/write
        data:    OperationId:          <guid>
        data:    Status:               Started
        data:    SubStatus:
        data:    Caller:
        data:    CorrelationId:        <guid>
        data:    Description:
        data:    HttpRequest:          clientRequestId: <guid>
                                       clientIpAddress: 000.000.00.000
                                       method:          PUT

        data:    Level:                Informational
        data:    ResourceGroup:        templates
        data:    ResourceProvider:     Microsoft.Network
        data:    EventSource:          Microsoft Resources
        data:    Properties:           requestbody: {"location":"West US","properties
                                       ":{"ipConfigurations":[{"
                                       name":"ipconfig1","properties":{"
                                       privateIPAllocationMethod

                                       ":"Dynamic","publicIPAddress":{"id":"/
                                       subscriptions/
                                       <guid>/
                                       resourceGroups/
                                       templates/providers/Microsoft.Network/
                                       publicIPAddresses/
                                       myPublicIP"},"subnet":{"idThe AzureResourceManager module includes cmdlets that ":"/subscriptions/
                                       <guid>/resourceGroups/templates/
                                       providers/
                                       Microsoft.Network/virtualNetworks/myVNET/subnets/
                                       Subnet-1
                                       "}}}]}}

Use the **--last-deployment** option to retrieve only the log for the most recent deployment. The following script uses the **--json** option and **jq** to search the log for deployment failures.

        azure group log show templates --json | jq '.[] | select(.status.value == "Failed")'

        {
          "claims": {
            "aud": "https://management.core.windows.net/",
            "iss": "https://sts.windows.net/<guid>/",
            "iat": "1429678549",
            "nbf": "1429678549",
            "exp": "1429682449",
            "ver": "1.0",
            "http://schemas.microsoft.com/identity/claims/tenantid": "<guid>",
            "http://schemas.microsoft.com/identity/claims/objectidentifier": "<guid>",
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn": "ahmet@contoso.onmicrosoft.com",
            "puid": "XXXXXXXXXXXXXX",
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "<hash string>",
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname": "ahmet",
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": "",
            "name": "Friendly Name",
            "http://schemas.microsoft.com/claims/authnmethodsreferences": "pwd",
            "groups": "<guid>",
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "ahmet@contoso.onmicrosoft.com",
            "appid": "<guid>",
            "appidacr": "0",
            "http://schemas.microsoft.com/identity/claims/scope": "user_impersonation",
            "http://schemas.microsoft.com/claims/authnclassreference": "1"
          },
          "properties": {},
          "authorization": {
            "action": "Microsoft.Resources/subscriptions/resourcegroups/deployments/write",
            "role": "Subscription Admin",
            "scope": "/subscriptions/<guid>/resourcegroups/templates/deployments/basic-vm-version-0.1"
          },
          "eventChannels": "Operation",
          "eventDataId": "<guid>",
          "correlationId": "<guid>",
          "eventName": {
            "value": "EndRequest",
            "localizedValue": "End request"
          },
          "eventSource": {
            "value": "Microsoft.Resources",
            "localizedValue": "Microsoft Resources"
          },
          "level": "Error",
          "resourceGroupName": "templates",
          "resourceProviderName": {
            "value": "Microsoft.Resources",
            "localizedValue": "Microsoft Resources"
          },
          "resourceUri": "/subscriptions/<guid>/resourcegroups/templates/deployments/basic-vm-version-0.1",
          "operationId": "<guid>",
          "operationName": {
            "value": "Microsoft.Resources/subscriptions/resourcegroups/deployments/write",
            "localizedValue": "Update deployment"
          },
          "status": {
            "value": "Failed",
            "localizedValue": "Failed"
          },
          "subStatus": {},
          "eventTimestamp": "2015-04-22T05:53:40.8150293Z",
          "submissionTimestamp": "2015-04-22T05:54:00.6728843Z",10037FFE8E80BB65
          "subscriptionId": "<guid>"
        }


- **--verbose and -vv options**:  Use the **--verbose** option to set the mode to verbose, to display the steps the operations go through on `stdout`. For a complete request history, include the steps that **--verbose** enables, use the **-vv** option. The messages often provide vital clues about the cause of any failures.

- **Your Azure credentials have not been set up or have expired**:  To refresh the credentials in your Azure CLI session, just type `azure login`. For help with authentication errors, make sure that you have [configured the Azure CLI correctly](../xplat-cli-connect.md).

## Preventing errors in Windows PowerShell

The AzureResourceManager module includes cmdlets that help you to prevent errors.


- **Get-AzureLocation**: This cmdlet gets the locations that support each type of resource. Before you enter a location for a resource, use this cmdlet to verify that the location supports the resource type.


- **Test-AzureResourceGroupTemplate**: Test your template and template parameter before you use them. Enter a custom or gallery template and the template parameter values that you plan to use. This cmdlet tests whether the template is internally consistent and whether your parameter value set matches the template.

## Getting information to fix deployment issues in Windows PowerShell

- **Get-AzureResourceGroupLog**: This cmdlet gets the entries in the log for each  deployment of the resource group. If something goes wrong, begin by examining the deployment logs.

- **Verbose and Debug**:  The cmdlets in the AzureResourceManager module call REST APIs that do the actual work. To see the messages that the APIs return, set the $DebugPreference variable to "Continue" and use the Verbose common parameter in your commands. The messages often provide vital clues about the cause of any failures.

- **Your Azure credentials have not been set up or have expired**:  To refresh the credentials in your Windows PowerShell session, use the **Add-AzureAccount** cmdlet. The credentials in a publish settings file are not sufficient for the cmdlets in the AzureResourceManager module.

## Authentication, subscription, role, and quota issues

There can be one or more of several issues preventing successful deployment involving authentication and authorization and Azure Active Directory. Regardless how you manage your Azure resource groups, the identity you use to sign in to your account must be either Azure Active Directory objects or Service Principals, which are also called work or school accounts, or organizational Ids.

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


## Azure CLI and PowerShell mode issues

You might have the experience that Azure resources deployed using the service management API or using the portal are not visible using the Resource Manager API or the Azure portal. It is important to manage resources using the same Resource Manager API or portal that you used to create them. If a resource has disappeared, check to see if it is available using the other management API or portal.

## Azure resource provider registration issues

Resources are managed by resource providers, and an account or subscription might be enabled to use a particular provider. If you are enabled to use a provider, it must also be registered for use. Most providers are registered automatically by the Azure portal or the command-line interface you are using, but not all.

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

## Understanding when a deployment succeeds for custom templates

If you are using templates that you created, it's important to understand that the Azure Resource Manager system reports success on a deployment when all providers return from deployment successfully. This means that all of your template items were deployed for your usage.

Note however, that this does not necessarily mean that your resource group is "active and ready for your users". For example, most deployments request the deployment to download upgrades, wait on other, non-template resources, or to install complex scripts or some other executable activity that Azure does not know about because it is not an activity that a provider is tracking. In these cases, it can be some time before your resources are ready for real-world use. As a result, you should expect that the deployment status succeeds some time before your deployment can be used.

You can prevent Azure from reporting deployment success, however, by creating a custom script for your custom template -- using the [CustomScriptExtension](http://azure.microsoft.com/blog/2014/08/20/automate-linux-vm-customization-tasks-using-customscript-extension/) for example -- that knows how to monitor the entire deployment for system-wide readiness and returns successfully only when users can interact with the entire deployment. If you want to ensure that your extension is the last to run, use the **dependsOn** property in your template. An example can be seen [here](https://msdn.microsoft.com/library/azure/dn790564.aspx).

## Merging templates

At times you might need to merge two templates together, or you might need to launch a child template from a parent. This can be accomplished through the use of a deployment resource within the master template to deploy a child template.


    {
            "name": "instance01",
            "type": "Microsoft.Resources/deployments",
            "apiVersion": "2015-01-01",
            "properties": {
                "mode": "Incremental",
                "templateLink": {
                    "uri": "https://mystore.blob.windows.net/azurermtemplates/my-child-template.json",
                    "contentVersion": "1.0.0.0"
                },
                "parameters": {
                    "storageAccountName": { "value": "[variables('stgAcctName1')]" },
                    "adminUsername": { "value": "[parameters('adminUsername')]" },
                    "adminPassword": { "value": "[parameters('adminPassword')]" }
                }
            }
    }


## Crossing resource groups

Often you might want to use a resource from outside of the current resource group where a template is getting deployed. The most common case for this behavior is using a Storage account or virtual network in an alternate resource group. This is often needed so that the deletion of the resource group which contains the virtual machines will not result in the deletion of the VHD blobs or a VNet that is used by multiple resource groups. The following example shows how a resource from an external resource group can be used:


    {
      "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json",
      "contentVersion": "1.0.0.0",
      "parameters": {
          "virtualNetworkName": {
              "type": "string"
          },
          "virtualNetworkResourceGroup": {
              "type": "string"
          },
          "subnet1Name": {
              "type": "string"
          },
          "nicName": {
              "type": "string"
          }
      },
      "variables": {
          "vnetID": "[resourceId(parameters('virtualNetworkResourceGroup'), 'Microsoft.Network/virtualNetworks', parameters('virtualNetworkName'))]",
          "subnet1Ref": "[concat(variables('vnetID'),'/subnets/', parameters('subnet1Name'))]"
      },
      "resources": [
      {
          "apiVersion": "2015-05-01-preview",
          "type": "Microsoft.Network/networkInterfaces",
          "name": "[parameters('nicName')]",
          "location": "[parameters('location')]",
          "properties": {
              "ipConfigurations": [{
                  "name": "ipconfig1",
                  "properties": {
                      "privateIPAllocationMethod": "Dynamic",
                      "subnet": {
                          "id": "[variables('subnet1Ref')]"
                      }
                  }
              }]
           }
      }]

    }

## Next steps

To master the creation of templates, read through the [Authoring Azure Resource Manager templates](../resource-group-authoring-templates.md), and walk through the [Azure quickstart templates repository](https://github.com/Azure/azure-quickstart-templates) for deployable examples. An examples of the **dependsOn** property is the [Create a VM with multiple NICs and RDP accessible](https://github.com/Azure/azure-quickstart-templates/tree/master/201-1-vm-loadbalancer-2-nics).

<!--Image references-->

<!--Reference style links - using these makes the source content way more readable than using inline links-->
