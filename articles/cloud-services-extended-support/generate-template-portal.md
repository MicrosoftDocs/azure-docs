---
title: Generate ARM Template for Cloud Services (extended support) using the Azure portal
description: Generate and download ARM Template and parameter file for Cloud Services (extended support) using the Azure portal
ms.topic: how-to
ms.service: cloud-services-extended-support
author: surbhijain
ms.author: surbhijain
ms.reviewer: gachandw
ms.date: 03/07/2021
ms.custom: devx-track-arm-template
---

# Generate ARM Template for Cloud Services (extended support) using the Azure portal

This article explains how to download the ARM template and parameter file from the [Azure portal](https://portal.azure.com) for your Cloud Service. The ARM template and parameter file can be used in deployments via PowerShell to create or update a cloud service

## Get ARM template via portal

  1. Go to the Azure portal and [create a new cloud service](deploy-portal.md). Add your cloud service configuration, package and definition files. 
    :::image type="content" source="media/deploy-portal-4.png" alt-text="Image shows the upload section of the basics tab during creation.":::
  
  2. Once all fields have been completed, move to the Review and Create tab to validate your deployment configuration and click on **Download template for automation** your Cloud Service (extended support).
    :::image type="content" source="media/download-template-portal-1.png" alt-text="Image shows downloading the template under cloud service (extended support) on the Azure portal.":::
  
  3. Download your template and parameter files. 
    :::image type="content" source="media/generate-template-portal-3.png" alt-text="Image shows downloading template file on the Azure portal.":::
  
  4. Copy the Package SAS URI and Configuration SAS URI from the review and create tab and add them to the parameter.json file. These files can now be used to create a new cloud service via PowerShell.
    :::image type="content" source="media/download-template-portal-2.png" alt-text="Image shows the package SAS URI and configuration SAS URI parameters on the Azure portal.":::
  
## Next steps 
- Review [frequently asked questions](faq.yml) for Cloud Services (extended support).
- Deploy a Cloud Service (extended support) using the [Azure portal](deploy-portal.md)
  
