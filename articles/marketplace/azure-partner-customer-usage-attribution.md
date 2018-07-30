---  
title: Azure partner and customer usage attribution
description: Overview of how to track customer usage for Azure Marketplace solutions
services: Azure, Marketplace, Compute, Storage, Networking, Blockchain, Security
documentationcenter:
author: ellacroi
manager: nunoc
editor:

ms.assetid: e8d228c8-f9e8-4a80-9319-7b94d41c43a6
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: article
ms.date: 07/26/2018
ms.author: ellacroi

---  
# Azure partner customer usage attribution

As a software partner for Azure, your solutions either require Azure components or to be deployed directly on Azure infrastructure.  Today, when a customer deploys a partner solution and provisions their own Azure resources, it is difficult for the partner to gain visibility to the status of those deployments and difficult to get optics into impact to Azure growth. Adding a higher level of visibility helps partners align with the Microsoft sales teams and gain credit for Microsoft partner programs.   

Microsoft is creating a new method to help partners better track Azure usage that is a result of a customer deploying your software on Azure. This new method is based on using Azure Resource Manager to orchestrate deployment of Azure services.

As a Microsoft partner, you can associate Azure usage with any Azure resources you provision on a customer's behalf.  This association can be done via the Azure Marketplace, the QuickStart repo, private github repos and even 1 on 1 customer engagement.  To enable tracking, there are two approaches available:

- Azure Resource Manager Templates: Azure Resource Manager templates or solution templates to deploy the Azure services to run the partner’s software. Partners can create Azure Resource Manager template that defines the infrastructure and configuration of your Azure solution. Creating an Azure Resource Manager template allows you and your customers to deploy your solution throughout its lifecycle and have confidence your resources are deployed in a consistent state. 

- Azure Resource Manager APIs: partners can call the Azure Resource Manager APIs directly to either deploy an Azure Resource Manager template or to generate the API calls to directly provision Azure services. 

## Method 1: Azure Resource Manager Templates 

Today many partner solutions are deployed on a customer’s subscription using Azure Resource Manager templates.  If you already have an Azure Resource Manager template available in the Azure Marketplace, on GitHub or as a QuickStart, the process of modifying your template to enable this new tracking method should be straight forward.  If you are not using an Azure Resource Manager template today, here are a few links to help you better understand Azure Resource Manager templates and how to create one: 

*	[Create and deploy your first Azure Resource Manager template](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-create-first-template)
*	[Guide to create a solution template for Azure Marketplace](https://docs.microsoft.com/azure/marketplace-publishing/marketplace-publishing-solution-template-creation)

## Instructions: add a GUID to your existing Azure Resource Manager template

Adding the GUID is a single modification of the main template file:
 1. Create a GUID, let's say that the generated value is eb7927c8-dd66-43e1-b0cf-c346a422063
 2. Open the Azure Resource Manager template
 3. Add a new resource in the main template file. The resource only needs to be in the mainTemplate.json or azuredeploy.json, not in any nested or linked templates.
 4. Enter the GUID after the “pid-” as shown above.

   It should look something like this example:
   `pid-eb7927c8-dd66-43e1-b0cf-c346a422063`

 5. Check template for any errors
 6. Republish the template in the appropriate repositories

## Sample template code

```

{ // add this resource to the mainTemplate.json (do not add the entire file)
      "apiVersion": "2018-02-01",
      "name": "pid-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX", // use your GUID here
      "type": "Microsoft.Resources/deployments",
      "properties": {
        "mode": "Incremental",
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "resources": []
        }
      }
    } // remove all comments from the file when done

```

## Method 2: Azure Resource Manager APIs

In some cases, you might prefer to make calls directly against the Azure Resource Manager REST APIs to deploy Azure services. [Azure supports multiple SDKs](https://docs.microsoft.com/azure/#pivot=sdkstools) to enable this.  You can use one of the SDKs, or call the REST APIs directly to deploy resources.

If you are using an Azure Resource Manager template, you should tag your solution using the instructions above.  If you are not using an Azure Resource Manager template and making direct API calls you can still tag your deployment to associate usage of Azure resources. 

**How to tag a deployment using the Azure Resource Manager APIs:**
For this approach, when designing your API calls you will include a GUID in the user agent header in the request. The GUID should be added for each Offer or SKU.  The string will need to be formatted with the prefix pid- and then include the partner generated GUID.   

>[!Note] 
>GUID format for insertion into the user agent: 
pid-eb7927c8-dd66-43e1-b0cf-c346a422063     // enter your GUID after the “pid-“

The format of the string is important. If the prefix “pid-” is not included, it isn't possible to query the data. Different SDKs do this differently.  To implement this method, you will need to review the support and approach for your preferred Azure SDK. 

**Example using the Python SDK:**
For Python, you need to use the “config” attribute. You can only add to a UserAgent. Here is an example:

```python

client = azure.mgmt.servicebus.ServiceBusManagementClient(**parameters)
        client.config.add_user_agent("pid-eb7927c8-dd66-43e1-b0cf-c346a422063")


```

>This has to be done for each client, there is no global static configuration (You may choose to do a client factory to be sure every client is doing it. 
>[Additional reference information](https://github.com/Azure/azure-cli/blob/7402fb2c20be2cdbcaa7bdb2eeb72b7461fbcc30/src/azure-cli-core/azure/cli/core/commands/client_factory.py#L70-L79)

How to tag a deployment using the Azure PowerShell or the Azure CLI:
If you deploy resources via AzurePowerShell, you can append your GUID by using the following method:

```

[Microsoft.Azure.Common.Authentication.AzureSession]::ClientFactory.AddUserAgent("pid-eb7927c8-dd66-43e1-b0cf-c346a422063")


```

To append your GUID when using the Azure CLI, set the AZURE_HTTP_USER_AGENT environment variable.  You can set this variable within the scope of a script or to set globally, for shell scope use:

```

export AZURE_HTTP_USER_AGENT='pid-eb7927c8-dd66-43e1-b0cf-c346a422063'


```

## Registering GUIDs/Offers

In order for the GUID to be included in our tracking, it must be registered.  

All registrations for template GUIDs will be done via the Azure Marketplace Cloud Partner Portal  (CPP). 

Apply to [Azure Marketplace](http://aka.ms/listonazuremarketplace) today and get access to the Cloud Partner portal.

*	Partners will be required to [have a profile in CPP](https://docs.microsoft.com/azure/marketplace/become-publisher) and encouraged to list the offer in Azure Marketplace or AppSource 
*	Partners will be able to register multiple GUIDs 
*	Partners will also be able to register a GUID for the non-Marketplace solution templates/offers

Once you have added the GUID to your template, or in the user agent, and registered the GUID in the CPP all deployments will be tracked. 

## Verification of GUID deployment 

After you have modified your template and performed a test deployment, you can use the following PowerShell script to retrieve the resources you deployed and tagged. 

You can use it to verify if the GUID has been added to your Azure Resource Manager template successfully. It does not apply to Azure Resource Manager API deployment.

Log in to Azure and select the subscription that contains the deployment you want to verify before running the script. It must be run within the subscription context of the deployment.

The GUID and resourceGroup name of the deployment are required params.

You can find the original script [here](https://gist.github.com/bmoore-msft/ae6b8226311014d6e7177c5127c7eba1#file-verify-deploymentguid-ps1).

```

Param(
    [GUID][Parameter(Mandatory=$true)]$guid,
    [string][Parameter(Mandatory=$true)]$resourceGroupName'
)

#get the correlationId of the pid deployment

$correlationId = (Get-AzureRmResourceGroupDeployment -ResourceGroupName 
$resourceGroupName -Name "pid-$guid").correlationId

#find all deployments with that correlationId

$deployments = Get-AzureRmResourceGroupDeployment -ResourceGroupName $resourceGroupName | Where-Object{$_.correlationId -eq $correlationId}

#find all deploymentOperations in a deployment by name (since PowerShell does not surface outputResources on the deployment or correlationId on the deploymentOperation)

foreach ($deployment in $deployments){

#get deploymentOperations by deploymentName and then the resourceId for any create operation

($deployment | Get-AzureRmResourceGroupDeploymentOperation | Where-Object{$_.properties.provisioningOperation -eq "Create" -and $_.properties.targetResource.resourceType -ne "Microsoft.Resources/deployments"}).properties.targetResource.id

}


```

## Guidance on creating GUIDs

A GUID (globally unique identifier) is a 32 hexadecimal digit unique reference number. To create a GUID, you should use a GUID generator to create their GUIDs for tracking.  There are multiple [online GUID generators](https://www.bing.com/search?q=guid%20generator&qs=n&form=QBRE&sp=-1&ghc=2&pq=guid%20g&sc=8-6&sk=&cvid=0BAFAFCD70B34E4296BB97FBFA3E1B4E) you can use.

You are encouraged to create a unique GUID for every Offer and distribution channel.  For example, if you have two solutions and both are deployed via a template and are available in both the Azure Marketplace and on GitHub.  Create four GUIDS:

*	Offer A in Azure Marketplace 
*	Offer A on GitHub
*	Offer B in Azure Marketplace 
*	Offer B on GitHub

Reporting will be done by partner (Microsoft Partner ID) and GUID. 

You can also choose to track GUIDs at a more granular level i.e. SKU (where SKUs are variants of an offer).

## Guidance on privacy and data collection

Partners should provide messaging to inform their customers that deployments that include the Azure Resource Manager GUID tracking will allow Microsoft to report the Azure usage associated with those deployments to the partner.  Some example language is below. Where it indicates "PARTNER" you should fill in your own company name. In addition, partners should ensure the language aligns with their own data privacy and collection policies including options for customers to be excluded from track: 

**For Azure Resource Manager template deployments**

When deploying this template, Microsoft will be able identify the installation of PARTNER software with the Azure resources deployed.  Microsoft will be able to correlate the Azure resources used to support the software.  Microsoft collects this information to provide the best experiences with their products and to operate their business. This data will be collected and governed by Microsoft’s privacy policies, which can be found at https://www.microsoft.com/trustcenter. 

**For SDK or API deployments**

When deploying PARTNER software, Microsoft will be able identify the installation of PARTNER software with the Azure resources deployed.  Microsoft will be able to correlate the Azure resources used to support the software.  Microsoft collects this information to provide the best experiences with their products and to operate their business. This data will be collected and governed by Microsoft’s privacy policies, which can be found at https://www.microsoft.com/trustcenter.

## Support

For assistance, follow the below steps:
 1. Visit the support page located at [go.microsoft.com/fwlink/?linkid=844975](https://go.microsoft.com/fwlink/?linkid=844975)
 2.	For issues with usage association - select Problem type: **Marketplace Onboarding** and Category: **Other** and then click **Start Request.** 
>[!Note]
>For issues on accessing Azure Marketplace Cloud Partner Portal - select Problem type: **Marketplace Onboarding** and Category: **Access Problem** and then click **Start Request.**
 3. Complete the required fields on the next page and click **Continue.**
 4. Complete the free text fields on the next page.  
 

 
>[!Important] 
>Fill in Incident title with **“ISV Usage Tracking”** and describe your issue in detail in the large free text field after.  Complete the rest of the form and click **Submit**.

## FAQs

**What is the benefit of adding the GUID to the template?**

Microsoft will provide partners with a view of customer deployments of their templates and insights on their influenced usage.  Both Microsoft and the partner can also use this information to drive closer engagement between sales teams. Both Microsoft and the partner can also use it to get a more consistent view of an individual partner’s impact on Azure growth. 

**Who can add a GUID to a template?**

The tracking resource is intended to connect the partner’s solution to the customers Azure usage.  The usage data is tied to a partner’s Microsoft Partner Network identity (MPN ID) and reporting will be available to partners in the Cloud Partner Portal (CPP).  

**Once a GUID has been added can it be changed?**
 
Yes, a customer or implementation partner may customize the template and could change or remove the GUID. We suggest that partners proactively describe the role of the resource and GUID to their customers and partners to prevent removal or edits to the tracking GUID.  Changing the GUID will only affect new, not existing, deployments and resources.

**When will reporting be available?**

A beta version of reporting should be available soon.  Reporting will be integrated into the Cloud Partner Portal (CPP).

**Can I track templates deployed from a non-Microsoft repository like GitHub?**

Yes, as long as the GUID is present when the template is deployed, usage will be tracked.  
Partners is required to have a profile in Cloud Partner Portal to register the related templates published outside of the Azure Marketplace. 

**Is there a difference if the template is deployed from Azure Marketplace versus other repositories like GitHub?**

Yes, partners who publish offers in the Azure Marketplace may receive more detailed data on deployments from the Azure Marketplace.  Partners will benefit from exposing their offer to customers on the Azure Marketplace portal and in the Azure management portal. Offers in the Azure marketplace also generate leads for the partner.

**What if I create a custom template for an individual customer engagement?**

You are still welcome to add the GUID to the template.  If you use an existing GUID that was registered, it will be included in reporting.  If you create a new GUID, you will need to register the new GUID to get it included in tracking.

**Does the customer receive reporting as well?**

Customers are currently able to track their usage of individual resources or customer defined resource groups within the Azure management portal.   

**Is this tracking methodology similar to the Digital Partner of Record (DPOR)?**

This new method of connecting the deployment and usage to a partner’s solution is intended to provide a mechanism to link a partner solution to Azure usage.  DPOR is intended to associate a consulting (Systems Integrator) or management (Managed Service Provider) partner with a customer’s Azure subscription.   
