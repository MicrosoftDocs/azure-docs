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

# Authentication

## Service Principals
In the Azure Data Manager for Energy instance, 
1. No Service Principals are created. 
2. The app-id is used for API access. This is the same app-id which is used to provision ADME instance.
3. The app-id does not have access to infrastructure resources. 
4. The app-id also gets added as OWNER to all OSDU groups by default. 
5. For service-to-service (S2S) communication, ADME uses MSI (msft service identity).

In the OSDU instance, 
1. Two Service Principals are created by terraform scripts: 
2. 1st Service Principals is used for API access. It can also manage infrastructure resources. 
3. 2nd Service Principals is used for service-to-service (S2S) communications. 


