---
title: Network isolation
description: Users can restrict public access to QnA Maker resources.
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: conceptual
ms.date: 11/09/2020
---

# Recommended settings for network isolation

You should follow the follow the steps below to restrict public access to QnA Maker resources. Protect a Cognitive Services resource from public access by [configuring the virtual network](../../cognitive-services-virtual-networks.md?tabs=portal).

## Restrict access to Cognitive Search Resource

# [QnA Maker GA (stable release)](#tab/v1)

Configuring Cognitive Search as a private endpoint inside a VNET. When a Search instance is created during the creation of a QnA Maker resource, you can force Cognitive Search to support a private endpoint configuration created entirely within a customer’s VNet.

All resources must be created in the same region to use a private endpoint.

* QnA Maker resource
* new Cognitive Search resource
* new Virtual Network resource

Complete the following steps in the [Azure portal](https://portal.azure.com):

1. Create a [QnA Maker resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesQnAMaker).
2. Create a new Cognitive Search resource with Endpoint connectivity (data) set to _Private_. Create the resource in the same region as the QnA Maker resource created in step 1. Learn more about [creating a Cognitive Search resource](../../../search/search-create-service-portal.md), then use this link to go directly to the [creation page of the resource](https://ms.portal.azure.com/#create/Microsoft.Search).
3. Create a new [Virtual Network resource](https://ms.portal.azure.com/#create/Microsoft.VirtualNetwork-ARM).
4. Configure the VNET on the App service resource created in step 1 of this procedure. Create a new DNS entry in the VNET for new Cognitive Search resource created in step 2. to the Cognitive Search IP address.
5. [Associate the App service to the new Cognitive Search resource](../how-to/set-up-qnamaker-service-azure.md) created in step 2. Then, you can delete the original Cognitive Search resource created in step 1.
    
In the [QnA Maker portal](https://www.qnamaker.ai/), create your first knowledge base.

#  [QnA Maker managed (preview release)](#tab/v2)

[Create Private endpoints](../reference-private-endpoint.md) to the Azure Search resource.

---

## Restrict access to App Service (QnA Runtime)

You can add IPs to App service allowlist to restrict access or Configure App Service Environemnt to host QnA Maker App Service.

#### Add IPs to App Service allowlist

1. Allow traffic only from Cognitive Services IPs. These are already included in Service Tag `CognitiveServicesManagement`. This is required for Authoring APIs (Create/Update KB) to invoke the app service and update Azure Search service accordingly. Check out [more information about service tags.](../../../virtual-network/service-tags-overview.md)
2. Make sure you also allow other entry points like Azure Bot Service, QnA Maker portal, etc. for prediction "GenerateAnswer" API access.
3. Please follow these steps to add the IP Address ranges to an allowlist:

   1. Download [IP Ranges for all service tags](https://www.microsoft.com/download/details.aspx?id=56519).
   2. Select the IPs of "CognitiveServicesManagement".
   3. Navigate to the networking section of your App Service resource, and click on "Configure Access Restriction" option to add the IPs to an allowlist.

    ![inbound port exceptions](../media/inbound-ports.png)

We also have an automated script to do the same for your App Service. You can find the [PowerShell script to configure an allowlist](https://github.com/pchoudhari/QnAMakerBackupRestore/blob/master/AddRestrictedIPAzureAppService.ps1) on GitHub. You need to input subscription id, resource group and actual App Service name as script parameters. Running the script will automatically add the IPs to App Service allowlist.

#### Configure App Service Environment to host QnA Maker App Service
    
The App Service Environment(ASE) can be used to host QnA Maker App service. Please follow the steps below:

1. Create an App Service Environment and mark it as “external”. Please follow the [tutorial](../../../app-service/environment/create-external-ase.md) for instructions.
2.  Create an App service inside the App Service Environment.
    1. Check the configuration for the App service and add 'PrimaryEndpointKey' as an application setting. The value for 'PrimaryEndpointKey' should be set to “\<app-name\>-PrimaryEndpointKey”. The App Name is defined in the App service URL. For instance, if the App service URL is "mywebsite.myase.p.azurewebsite.net", then the app-name is "mywebsite". In this case, the value for 'PrimaryEndpointKey' should be set to “mywebsite-PrimaryEndpointKey”.
    2. Create an Azure search service.
    3. Ensure Azure Search and App Settings are appropriately configured. 
          Please follow this [tutorial](../reference-app-service.md?tabs=v1#app-service).
3.  Update the Network Security Group associated with the App Service Environment
    1. Update pre-created Inbound Security Rules as per your requirements.
    2. Add a new Inbound Security Rule with source as 'Service Tag' and source service tag as 'CognitiveServicesManagement'.
4.  Create a QnA Maker cognitive service instance (Microsoft.CognitiveServices/accounts) using Azure Resource Manager, where QnA Maker endpoint should be set to the App Service     Endpoint created above (https:// mywebsite.myase.p.azurewebsite.net).
    
---
