---
title: Authentication concepts in Microsoft Azure Data Manager for Energy 
description:  This article describes the various concepts regarding the authentication in Azure Data Manager for Energy.
author: shikhagarg1
ms.author: shikhagarg
ms.service: energy-data-services
ms.topic: conceptual
ms.date: 02/10/2023
ms.custom: template-concept
---

# Authentication concepts in Azure Data Manager for Energy 

## Service Principals
In the Azure Data Manager for Energy instance, 
1. No Service Principals are created. 
2. The app-id is used for API access. The same app-id is used to provision ADME instance.
3. The app-id doesn't have access to infrastructure resources. 
4. The app-id also gets added as OWNER to all OSDU groups by default. 
5. For service-to-service (S2S) communication, ADME uses MSI (msft service identity).

In the OSDU instance, 
1. Terraform scripts create two Service Principals: 
2. The first Service Principal is used for API access. It can also manage infrastructure resources. 
3. The second Service Principal is used for service-to-service (S2S) communications. 

## Refresh Token
You can refresh the authorization token using the steps outlined in [Generate a refresh token]. (https://learn.microsoft.com/en-us/azure/energy-data-services/how-to-generate-refresh-token) 
