---
title: Move Azure percept studio from one region to another
description: How to move your azure percept region from one region to another
author: nkhuyent
ms.author: cibuakaeze
ms.service: azure-percept
ms.topic: how-to
ms.date: 04/12/2022
ms.custom: template-how-to, subject-moving-resources
#Customer intent: As an Azure administrator,I want to move my service resources to another Azure region.
---



# Move Azure percept studio from one region to another 

Azure percept studio is region-specific and can't be moved across regions automatically. You must create a new percept studio resource in the target region, then deploy your models and solutions to the new region. You might move your Azure resources to another region for several reasons. For example, to take advantage of a new Azure region with Availability Zone support, to deploy features or services available in specific regions only, to meet internal policy and governance requirements, or in response to capacity planning requirements. 


## Prerequisites
- Ensure that the following are added to your allowed subscription: 
  - Managed identity (user assigned) 
  - IoT Hub - It is recommended that you use a S1 (Standard) tier or above. 
  - Computer Vision (under cognitive services) - It is recommended that you use a S1 (Standard) tier or above. 
- Video Analyzer 
- For preview features, ensure that your subscription is approved for the target region. 
- Ensure that your resource provider is registered 


## Create Percept Studio
1. Go to https://aka.ms/2studio 
2.  Search for “Percept Studio” in Marketplace. 
3.  Then click “Create” 
4.  Create Azure Percept Studio resource by selecting your subscription from the allowed list, and filing in the details for your Percept account. For the managed identity dropdown, please select the same managed identity created during the "Add resources" section above. Click on “Review + Create”. 
5.  When everything checks out, you will see “Validation Passed”. Click on “Create”. 
6.  Once your deployment is successful, you will see the following screen stating, “Your deployment is complete”. 
7.  Navigate to your newly created Percept Studio Account. 


## Next Steps
1. After creating percept studio, you can create a solution, connect cameras, Apply AI skills and enable/disable streams in the new studio resource  
2. The following link can help you locate more information on creating and deploying edge AI models on studio santa-cruz-workload/AzP Studio Guide.md at main · microsoft/santa-cruz-workload (github.com)  
