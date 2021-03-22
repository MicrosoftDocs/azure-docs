---
title: Azure customer usage attribution
description: Get an overview of tracking customer usage for Azure Applications on the commercial marketplace and other deployable IP developed by partners.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: cpercy737
ms.author: camper
ms.date: 03/22/2021
ms.custom: devx-track-terraform
---

# Azure customer usage attribution

Customer usage attribution associates usage from Azure resources in customer subscriptions created while deploying your IP with you as a partner. Forming these associations in internal Microsoft systems brings greater visibility to the Azure footprint running your software. For [Azure Application offers in the commercial marketplace](#commercial-marketplace-azure-apps), this tracking capability helps you align with Microsoft sales teams and gain credit for Microsoft partner programs.

Customer usage attribution supports three deployment options:

1. Azure Resource Manager templates (the common underpinnings of Azure apps, also referred to in the commercial marketplace as "solution templates" or "managed apps"): partners create Resource Manager templates to define the infrastructure and configuration of their Azure solutions. A Resource Manager template allows your customers to deploy your solution's resources in a consistent and repeatable state.
1. Azure Resource Manager APIs: partners can call the Resource Manager APIs to deploy a Resource Manager template or directly provision Azure services.
1. Terraform: partners can use Terraform to deploy a Resource Manager template or directly deploy Azure services.

There are secondary use cases for customer usage attribution outside of the commercial marketplace described [later in this article](#other-use-cases).

>[!IMPORTANT]
>- Customer usage attribution is not intended to track the work of systems integrators, managed service providers, or tools designed primarily to deploy and manage Azure resources.
>- Customer usage attribution is for new deployments and does not support tracking resources that have already been deployed.
>- Not all Azure services are compatible with customer usage attribution. Azure Kubernetes Services (AKS), VM Scale Sets, and Azure Batch have known issues that cause under-reporting of usage.

## Commercial marketplace Azure apps

Tracking Azure usage from Azure apps published to the commercial marketplace is largely automatic. When you upload a Resource Manager template as part of the [technical configuration of your marketplace Azure app's plan](https://docs.microsoft.com/azure/marketplace/create-new-azure-apps-offer-solution#define-the-technical-configuration), Partner Center will add a tracking ID readable by Azure Resource Manager.

If you use Azure Resource Manager APIs, you will need to add your tracking ID per the [instructions below](#use-resource-manager-apis) to pass it to Azure Resource Manager as your code deploys resources. This ID is visible in Partner Center on your plan's Technical Configuration page. 

> [!NOTE]
> For existing Azure apps, a one-time migration was performed in March 2021 to update the tracking IDs in each plan's technical configuration. Usage from past deployments of those offers will remain tracked in Microsoft systems.
>
>As you update your offers, you no longer need to add the **Microsoft.Resources/deployments** resource type in your main template file.

## Other use cases 

You may use customer usage attribution to track Azure usage of solutions not available in the commercial marketplace. These solutions usually reside in the Quickstart repository, private GitHub repositories, or come from 1:1 customer engagements that create durable IP (such as a deployable and scalable app).

There are several manual steps required:

1. Create one or more GUIDs to use as your tracking IDs.
1. Register those GUIDs in Partner Center.
1. Add your registered GUIDs to your Azure app and/or user agent strings.

### Create GUIDs

Unlike the tracking IDs that Partner Center creates on your behalf for Azure apps in the commercial marketplace, other uses of CUA require you to create a GUID to use as your tracking ID. A GUID is a unique reference identifier that has 32 hexadecimal digits. To create GUIDs for tracking, you should use a GUID generator, for example, via PowerShell:

```powershell
[guid]::NewGuid()
```

You should create a unique GUID for each product and distribution channel. You can use a single GUID for a product's multiple distribution channels if you don't want reporting to be split. Reporting occurs by Microsoft Partner Network ID and GUID.

### Register GUIDs

GUIDs must next be registered in Partner Center so they can be associated with you as a partner:

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard).

1. Sign up as a [commercial marketplace publisher](https://aka.ms/JoinMarketplace).

1. Select **Settings** (gear icon) in the top-right corner, then **Account settings**.

1. Select **Organization profile** > **Identifiers** > **Add Tracking GUID**.

1. In the **GUID** box, enter your tracking GUID. Enter just the GUID without the `pid-` prefix. In the **Description** box, enter your solution name or description.

1. To register more than one GUID, select **Add Tracking GUID** again. Additional boxes appear on the page.

1. Select **Save**.

### Add a GUID to a Resource Manager template

To add your registered GUID to a Resource Manager template, make a single modification to the main template file:

1. Open the Resource Manager template.

1. Add a new resource of type [Microsoft.Resources/deployments](/azure/templates/microsoft.resources/deployments) in the main template file. The resource needs to be in the **mainTemplate.json** or **azuredeploy.json** file only, not in any nested or linked templates.

1. Enter the GUID value after the `pid-` prefix as the name of the resource. For example, if the GUID is eb7927c8-dd66-43e1-b0cf-c346a422063, the resource name will be **pid-eb7927c8-dd66-43e1-b0cf-c346a422063**. Example:
 
```json
{ // add this resource to the resources section in the mainTemplate.json
    "apiVersion": "2020-06-01",
    "name": "pid-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX", // use your generated GUID here
    "type": "Microsoft.Resources/deployments",
    "properties": {
        "mode": "Incremental",
        "template": {
            "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
            "contentVersion": "1.0.0.0",
            "resources": []
        }
    }
} // remove all comments from the file when complete
```
4. Check the template for errors.

1. Republish the template in the appropriate repositories.

1. [Verify GUID success in the template deployment](#verify-deployments-tracked-with-a-guid).

> [!TIP]
> For more information on creating and publishing Resource Manager templates, see: [create and deploy your first Resource Manager template](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md).

### Verify deployments tracked with a GUID

After you modify your template and run a test deployment, use the following PowerShell script to retrieve the resources you deployed and tagged.

You can use the script to verify that the GUID is successfully added to your Resource Manager template. The script doesn't apply to Resource Manager API or Terraform deployments.

Sign in to Azure. Select the subscription with the deployment you want to verify before you run the script. Run the script within the subscription context of the deployment.

The **GUID** (below called "deploymentName") and **resourceGroupName** name of the deployment are required parameters.

You can get [the original script](https://gist.github.com/bmoore-msft/ae6b8226311014d6e7177c5127c7eba1) on GitHub.

```powershell
Param(
    [string][Parameter(Mandatory=$true)]$deploymentName, # the full name of the deployment, e.g. pid-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
    [string][Parameter(Mandatory=$true)]$resourceGroupName
)

# Get the correlationId of the named deployment
$correlationId = (Get-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -Name "$deploymentName").correlationId

# Find all deployments with that correlationId
$deployments = Get-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName | Where-Object{$_.correlationId -eq $correlationId}

# Find all deploymentOperations in all deployments with that correlationId as PowerShell doesn't surface outputResources on the deployment or correlationId on the deploymentOperation

foreach ($deployment in $deployments){
    # Get deploymentOperations by deploymentName
    # then the resourceIds for each resource
    ($deployment | Get-AzResourceGroupDeploymentOperation | Where-Object{$_.targetResource -notlike "*Microsoft.Resources/deployments*"}).TargetResource
}
```

### Notify your customers

Partners should inform their customers about deployments that use customer usage attribution. Microsoft reports the Azure usage associated with these deployments to the partner. The following examples include content that you can use to notify your customers about these deployments. In the examples, replace \<PARTNER> with your company name. Partners should ensure the notification aligns with their data privacy and collection policies, including options for customers to be excluded from tracking.

#### Notification for Resource Manager template deployments

When you deploy this template, Microsoft can identify the installation of \<PARTNER> software with the deployed Azure resources. Microsoft can correlate these resources used to support the software. Microsoft collects this information to provide the best experiences with their products and to operate their business. The data is collected and governed by Microsoft's privacy policies, located at [https://www.microsoft.com/trustcenter](https://www.microsoft.com/trustcenter).

#### Notification for SDK or API deployments

When you deploy \<PARTNER> software, Microsoft can identify the installation of \<PARTNER> software with the deployed Azure resources. Microsoft can correlate these resources used to support the software. Microsoft collects this information to provide the best experiences with their products and to operate their business. The data is collected and governed by Microsoft's privacy policies, located at [https://www.microsoft.com/trustcenter](https://www.microsoft.com/trustcenter).

## Use Resource Manager APIs

In some cases, you may make calls directly against the Resource Manager REST APIs to deploy Azure services. [Azure supports multiple SDKs](../index.yml?pivot=sdkstools) to enable these calls. You can use one of the SDKs or call the REST APIs directly to deploy resources.

To enable customer usage attribution, when you design your API calls, include your tracking ID in the user agent header in the request. Format the string with the `pid-` prefix. Examples:

```xml
//Commercial Marketplace Azure app
pid-contoso-myoffer-partnercenter //copy the tracking ID exactly as it appears in Partner Center

//Other use cases
pid-b6addd8f-5ff4-4fc0-a2b5-0ec7861106c4 //enter your GUID after "pid-"
```
> [!IMPORTANT]
> If you are using Resource Manager APIs with an Azure app in the commercial marketplace, use the tracking ID provided in Partner Center. Do NOT use a GUID.

Various SDKs interact with the Resource Manager APIs differently and will require some differences in your code. The examples below feature the non-commercial marketplace approach using a GUID and cover a variety of the more popular Azure SDKs.

#### Example: Python SDK

For Python, use the **config** attribute. You can only add the attribute to a UserAgent. Example:

```python
client = azure.mgmt.servicebus.ServiceBusManagementClient(**parameters)
client.config.add_user_agent("pid-b6addd8f-5ff4-4fc0-a2b5-0ec7861106c4")
```
> [!IMPORTANT]
> Add the attribute for each client. There's no global static configuration. You might tag a client factory to ensure every client is tracking. For more information, see this [client factory sample on GitHub](https://github.com/Azure/azure-cli/blob/7402fb2c20be2cdbcaa7bdb2eeb72b7461fbcc30/src/azure-cli-core/azure/cli/core/commands/client_factory.py#L70-L79).

#### Example: .NET SDK

For .NET, make sure to set the user agent. Use the [Microsoft.Azure.Management.Fluent](/dotnet/api/microsoft.azure.management.fluent) library to set the user agent with the following code (example in C#):

```csharp
var azure = Microsoft.Azure.Management.Fluent.Azure
    .Configure()
    // Add your pid in the user agent header
    .WithUserAgent("pid-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX", String.Empty) 
    .Authenticate(/* Credentials created via Microsoft.Azure.Management.ResourceManager.Fluent.SdkContext.AzureCredentialsFactory */)
    .WithSubscription("<subscription ID>");
```

#### Example: Azure PowerShell

If you deploy resources via Azure PowerShell, append your GUID using this method:

```powershell
[Microsoft.Azure.Common.Authentication.AzureSession]::ClientFactory.AddUserAgent("pid-eb7927c8-dd66-43e1-b0cf-c346a422063")
```

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

#### Example: Azure CLI

When you use the Azure CLI to append your GUID, set the **AZURE_HTTP_USER_AGENT** environment variable within the scope of a script. You can also set the variable globally for shell scope:

```powershell
export AZURE_HTTP_USER_AGENT='pid-eb7927c8-dd66-43e1-b0cf-c346a422063'
```

For more information, see [Azure SDK for Go](/azure/developer/go/).

## Use Terraform

Support for Terraform is available through Azure Provider's 1.21.0 release: [https://github.com/terraform-providers/terraform-provider-azurerm/blob/master/CHANGELOG.md#1210-january-11-2019](https://github.com/terraform-providers/terraform-provider-azurerm/blob/master/CHANGELOG.md#1210-january-11-2019). This applies to all partners who deploy their solution via Terraform and all resources deployed and metered by the Azure Provider (version 1.21.0 or later).

Azure provider for Terraform added a new optional field called [*partner_id*](https://www.terraform.io/docs/providers/azurerm/#partner_id) for specifying the tracking GUID used for your solution. The value of this field can also be sourced from the *ARM_PARTNER_ID* Environment Variable.

```
provider "azurerm" {
          subscription_id = "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          client_id = "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          ……
          # new stuff for ISV attribution
          partner_id = "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"}
```
Set the value of *partner_id* to a registered GUID. DO NOT prefix the GUID with "pid-", just set it to the actual GUID.

> [!IMPORTANT]
> If you are using Terraform with an Azure app in the commercial marketplace, use the entire tracking ID provided in Partner Center. Do NOT use a GUID.

## Get support

Learn about the support options in the commercial marketplace at [Support for the commercial marketplace program in Partner Center](support.md).

### How to submit a technical consultation request

1. Visit [Partner Technical Services](https://aka.ms/TechnicalJourney).
1. Select **Cloud infrastructure and management** to view the technical journey.
1. Select **Deployment Services** > **Submit a request**.
1. Sign in using your MSA (MPN account) or your AAD (Partner Dashboard account).
1. Complete/review the contact information on the form that opens. The consultation details may be pre-populated or you may have drop-down options.
1. Enter a title and a detailed description of the problem.
1. Select **Submit**.

View step-by-step instructions with screenshots at [Using Technical Presales and Deployment Services](https://aka.ms/TechConsultInstructions).

You will be contacted by a Microsoft Partner Technical Consultant to set up a call to scope your needs.

## Report
Reporting for Azure usage tracked via customer usage attribution is not available today for ISV partners. Adding reporting to the Commercial Marketplace Program in Partner Center to cover customer usage attribution is targeted for the second half of 2021.

## FAQ

#### After a tracking ID is added, can it be changed?

Tracking IDs for Azure apps in the commercial marketplace are managed automatically by Partner Center. A customer however can download a template and change or remove the tracking ID. Partners should proactively describe the role of the tracking ID to their customers to prevent removal or edits. Changing the tracking ID affects only new deployments and resources, not existing ones.

#### Can I track templates deployed from a non-Microsoft repository like GitHub?

Yes, as long as the tracking ID is present when the template is deployed, usage is tracked. To maintain the association between you as a publisher and your template deployed from a non-Microsoft repository, first download a copy of your published template (which will contain the tracking ID) from your offer's commercial marketplace listing in the Azure portal. Publish that version to GitHub or another non-Microsoft repository.

If your template is not listed in commercial marketplace and includes a registered GUID, make sure the GUID is present in the version you publish to GitHub or another non-Microsoft repository.

#### Does the customer receive reporting as well?

No. Customers can track their usage of all resources or resource groups within the Azure portal. Customers do not see usage broken out by CUA tracking ID.

#### Is customer usage attribution similar to the digital partner of record (DPOR) or partner admin link (PAL)?

Customer usage attribution is a mechanism to associate Azure usage with a partner's repeatable, deployable IP - forming the association at time of deployment. DPOR and PAL are intended to associate a consulting (Systems Integrator) or management (Managed Service Provider) partner with a customer's relevant Azure footprint for the time while the partner is engaged with the customer.