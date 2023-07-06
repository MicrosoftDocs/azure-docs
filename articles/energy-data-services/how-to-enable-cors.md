---
title: How to enable CORS - Azure Data Manager for Energy
description: Guide on CORS in Azure data manager for Energy and how to set up CORS
author: NandiniMurali
ms.author: Nandinim
ms.service: energy-data-services
ms.topic: how-to
ms.date: 02/28/2023
ms.custom: template-how-to-pattern
---
# Use CORS for resource sharing in Azure Data Manager for Energy
This document is to help you as user of Azure Data Manager for Energy to set up CORS policies.

## What is CORS?

CORS (Cross Origin Resource Sharing) is an HTTP feature that enables a web application running under one domain to access resources in another domain. In order to reduce the possibility of cross-site scripting attacks, all modern web browsers implement a security restriction known as same-origin policy, which prevents a web page from calling APIs in a different domain. CORS provides a secure way to allow one origin (the origin domain) to call APIs in another origin.
You can set CORS rules for each Azure Data Manager for Energy instance. When you set CORS rules for the instance, it gets applied automatically across all the services and storage accounts linked with your Azure Data Manager for Energy resource. Once you set the CORS rules, then a properly authorized request made against the service evaluates from a different domain to determine whether it's allowed according to the rules you've specified. 


## Enabling CORS on Azure Data Manager for Energy instance

1.	Create an **Azure Data Manager for Energy** instance.
2.	Select the **Resource Sharing(CORS)** tab.
   [![Screenshot of Resource Sharing(CORS) tab while creating Azure Data Manager for Energy.](media/how-to-enable-cors/enable-cors-1.png)](media/how-to-enable-cors/enable-cors-1.png#lightbox)
 
3.	In the Resource Sharing(CORS) tab, select **Allowed Origins**. 
4.	There can be upto 5 **Allowed Origins** added for a given instance.
      [![Screenshot of 1 allowed origin selected.](media/how-to-enable-cors/enable-cors-2.png)](media/how-to-enable-cors/enable-cors-2.png#lightbox)
5. If you explicitly want to have ***(Wildcard)**, then in the allowed origin * can be added.
6.	If no setting is enabled on CORS page it's defaulted to Wildcard*, allow all. 
7. The other values of CORS policy like  **Allowed Methods**, **Allowed Headers**, **Exposed Headers**, **Max age in seconds** are set with default values displayed on the screen.
7.	Next, select “**Review+Create**” after completing other tabs. 
8.	Select the "**Create**" button. 
9.	An **Azure Data Manager for Energy** instance is created with CORS policy.
10.	Next, once the instance is created the CORS policy set can be viewed in instance **overview** page.
11. You can navigate to **Resource Sharing(CORS)** and see that CORS is enabled with required **Allowed Origins**.
    [![Screenshot of viewing the CORS policy set out.](media/how-to-enable-cors/enable-cors-3.png)](media/how-to-enable-cors/enable-cors-3.png#lightbox)

## How are CORS rules evaluated?
CORS rules are evaluated as follows:
1. First, the origin domain of the request is checked against the domains listed for the AllowedOrigins element. 
2. Rules evaluation proceeds if the origin domain is included in the list or all domains are allowed with the wildcard character (*). If the origin domain isn't included, the request fails.

## Limitations on CORS policy
The following limitations apply to CORS rules:
- You can specify up to five CORS rules per instance.
- The maximum size of all CORS rules settings on the request, excluding XML tags, shouldn't exceed 2 KiB.
- The length of allowed origin shouldn't exceed 256 characters.


## Next steps
- CORS policy once set up during provisioning can be modified only through a Support request
   > [!div class="nextstepaction"]
   > [Create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md)
- To learn more about CORS 
   > [!div class="nextstepaction"]
   > [CORS overview](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services)
