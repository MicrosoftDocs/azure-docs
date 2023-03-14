---
title: Azure Health Insights response info  
description: this article describes the response from the service
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: overview
ms.date: 02/17/2023
ms.author: behoorne
---

# Azure Health Insights Response Info  

This page describes the response models and parameters that are being returned by the Azure Health Insights service.


## Response
The generic part of the Azure Health Insights response, common to all models.

Name              |Required|Type  |Description                                                                                     
------------------|--------|------|------------------------------------------------------------------------------------------------
jobId             |yes     |string|A processing job identifier.                                                                    
createdDateTime   |yes     |string|The date and time when the processing job was created.                                          
expirationDateTime|yes     |string|The date and time when the processing job is set to expire.                                     
lastUpdateDateTime|yes     |string|The date and time when the processing job was last updated.                                     
status            |yes     |string|The status of the processing job. [ notStarted, running, succeeded, failed, partiallyCompleted ]
errors            |no      |Error|An array of errors, if any errors occurred during the processing job.                           

## Error

Name      |Required|Type      |Description                                                             
----------|--------|----------|------------------------------------------------------------------------
code      |yes     |string    |Error code                                                              
message   |yes     |string    |A human-readable error message.                                         
target    |no      |string    |Target of the particular error (for example, the name of the property in error)
details   |no      |collection|A list of related errors that occurred during the request.              
innererror|no      |object    |An object containing more specific information about the error.         

## Next steps

To get started using the service, you can 

>[!div class="nextstepaction"]
> [deploy the service via the portal](deploy-portal.md) 