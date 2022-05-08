---
title: "Secure communication with Form Recognizer using managed identities and private endpoints"
titleSuffix: Azure Applied AI Services
description: Learn how to configure secure communications between Form Recognizer and other Azure Services.
author: vkurpad
manager: neathw
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: how-to
ms.date: 04/13/2022
ms.author: vikurpad
---

# Configuring secure access to your Form Recognizer resource

This how to guide walks you through the process of securing your Form Recognizer resource and enabling secure connections. The connections secured are
1. Communication between a client application within a VNET and the Form Recognizer Resource
1. Communication between the Form Recognizer Studio or the sample labeling tool and the Form Recognizer resource
1. Communication between the Form Recognizer resource and a storage account (needed when training a custom model)

You will be setting up the environment as in the image below to secure the environment
<Add Figure 1> End State

## Prerequisites

To get started, you'll need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/)—if you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* A [**Form Recognizer**](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) or [**Cognitive Services**](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) resource in the Azure portal. For detailed steps, _see_ [Create a Cognitive Services resource using the Azure portal](../../cognitive-services/cognitive-services-apis-create-account.md?tabs=multiservice%2cwindows).

* An [**Azure blob storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM) in the same region as your Form Recognizer resource. You'll create containers to store and organize your blob data within your storage account.

* An [**Azure virtual network**](https://portal.azure.com/#create/Microsoft.VirtualNetwork-ARM) in the same region as your Form Recognizer resource. You'll create a virtual network to deploy your application resources to train models and analyze documents.

* An [**Azure data science VM**](* An [**Azure virtual network**](https://portal.azure.com/#create/Microsoft.VirtualNetwork-ARM) optionally deploy a data science VM in the virtual network to test the secure connections being established.


## Configure resources

As a first step configure each of the resources to ensure that the resources can communicate with eah other
1. Configure the Form Recognizer Studio to use the newly created Form Recognizer resource by accessing the settings page and selecting the resource
1. Validate that this works by selecting the Read API and analyzing a sample document. If the resource was configured right, you will see the request complete successfully.
1. Add a training dataset to a container in the Storage account you just created.
1. Select the custom model tile to create a custom project. Ensure that you select the same Form Recognizer resource and the storage account you created in the previous step and select the container with the training dataset you uploaded in the previous step. Ensure that if the training dataset is within a folder, the folder path is set appropriately.
1. If you have the required permissions, the Studio will set the CORS setting required to access the storage account. If you do not have the permissions, you will need to ensure that the CORS settings are configured on the Storage account before you can proceed.
1. Validate that the Studio is configured to access your training data, if you can see your documents in the labeling experience, all the required connections have been established.

You now have a working implementation of all the components needed to build a Form Recognizer solution with the default security model as described in the figure below. 

:::image type="content" source="../media/managed-identities/default-config.png" alt-text="Default security configuration.":::


## Setup managed identity for Form Recognizer

Navigate to the Form Recognizer resource in the Azure portal and select the ```Identity``` tab. Toggle the ```System assigned```managed identity to ```On``` and save the changes

## Secure the Storage account to limit traffic

Start configuring secure communications by navigating to the ```Network``` tab on the Storage account in the Azure portal. 

1. Under ```Firewalls and virtual networks```, select ```Enabled from selected virtual networks and IP addresses```
2. Ensure that ```Allow Azure services on the trusted services list to access this storage account``` is selected
3. Save your changes
<add figure 3> FR MI

This ensures that your storage account will not be accessible from the public internet and refreshing the custom model labeling page in the Studio will result in a error message.

## Enable access to storage from Form Recognizer

To ensure that the Form Recognizer resource can still access the training dataset, you will need to add a role assignment for the Form Recognizer managed identity that was created earlier.

1. Staying on the Storage account blade in the portal, navigate to the ```Access Control (IAM)``` tab. 
2. Click on the ```Add role assignment``` button
3. On the ```Role``` tab, search for and select the```Storage Blob Reader``` permission and click next
4. On the ```Members``` tab, select the ```Managed identity``` option and click on the ```+ Select members```
5. On the ```Select managed identities``` dialog, select your subscription, from the ```Managed Identity``` drop down, select Form Recognizer, select the Form Recognizer resource you just enabled managed identities for.
6. Finally, click on select and ```Review + assign``` to save your changes

You have just configured managed identites to secure the communication between the storage account and the Form Recognizer resource

If you try using the Studio, you will see the READ API and other prebuilts work as they do not require storage access, but custom models will still not work as the Studio still cannot communicate with storage. To validate this, you can enable the ```Add your client IP address``` on ```Networking``` tab of the storage account to configure your machine to access the storage account via IP whitelisting.

## Configure private endpoints for access from VNETs

When securing resources in a virtual network, adding private endpoints will enable both the storage account and the Form Recognizer resource will only be accessible from the virtual network.

You will now configure the virtual network to ensure only resources within the virtual network or traffic router through the network will have access to the Form Recognizer resource and the storage account.

1. On the Azure portal navigate to the Form Recognizer resource, on the ```Networking``` blade, enable ```Selected Networking and Private Endpoints``` option on the ```Firewalls and virtual networks``` tab and hit save. If you try accessing any of the Studio features, you will see an access denied message. To enable access from the Studio on your machine, selecting the client IP address checkbox and saving will restore access.
2. Navigate to the ```Private endpoint connections``` tab and click on the add private endpoint button
3. On the create private endpoint dialog, start by selecting the subscription and resource group, name your private endpoint and add it to the same region as the virtual network before clicking next.
4. On the ```Resource``` tab accept the default values, cleck next.
5. On the ```Virtual Netowrk``` tab, ensure that the vnet you created is selected in the virtual network. If you have multiple subnets, select the subnet you want the private endpoint to be added to.Accept the default value of yes for integrating with private DNS zone
6. Accept the remaining defaults and click next until you can review and create the private endpoint.

Your Form Recognizer resource now is only accessible from the virtual network and any IP addresses in the IP whitelist.

###  Configure private endpoints for storage

Navigate to your storage account on the portal, select the ```Networking``` blade.
1. On the ```Private endpoint connections``` tab, add a private endpoint
2. Provide a name and pick the same region as the virtual network, click on next 
3. On the resource tab, select ```blob``` from the target sub-resource list, click on next
4. As with the Form Recognizer resource, select the virtual network and subnet, validate that the private DNS zone is selected and click next on the following tabs to create the private endpoint.

You now have all the connections betweent the Form Recognizer resource and storage configured to use managed identities and the resources are only accessible from the virtual network. Studio and access and analyze requests to your Form Recognizer resource will fail unless the request originates from the virtual network or is routed via the virtual network. The following 

## Validate your deployment

To validate your deployment, you can deploy a VM to the virtual network and connect to the resources.
1. Provision a [Data Science VM](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft-dsvm.dsvm-win-2019?tab=Overview) in the virtual network
2. Remote desktop into the VM to launch a browser session to access the Studio
3. Analyze requests and the training operations should now work successfully








