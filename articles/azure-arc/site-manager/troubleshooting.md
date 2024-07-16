---
title: Troubleshooting
description: "Troubleshooting in site manager"
author: torreymicrosoft
ms.author: torreyt
ms.service: azure-arc
ms.subservice: azure-arc-site-manager
ms.topic: troubleshooting-known-issue #Don't change
ms.date: 04/18/2024

#customer intent: As a customer, I want to understand how to resolve known issues I experience in site manager.

---

# Troubleshooting in Azure Arc site manager public preview

This article identifies the potential issue prone scenarios and when applicable their troubleshooting steps in Azure Arc site manager.  

| Scenario | Troubleshooting suggestions |
|---------|---------|
| Error adding resource to site | Site manager only supports specific resources. For more information, see [Supported resource types](./overview.md#supported-resource-types).<br><br>The resource might not be able to be created in the resource group or subscription associated with the site.<br><br>Your permissions might not enable you to modify the resources within the resource group or subscription associated with the site. Work with your admin to ensure your permissions are correct and try again. | 
| Permissions error, also known as role based access control or RBAC | Ensure that you have the correct permissions to create new sites under your subscription or resource group, work with your admin to ensure you have permission to create. | 
| Resource not visible in site | It's likely that the resource isn't supported by site manager. For more information, see [Supported resource types](./overview.md#supported-resource-types). | 
| Site page or overview or get started page in site manager isn't loading or not showing any information | 1. Check the url being used while in the Azure portal, you might have a text in the url that is preventing site manager and/or pages within site manager from displaying or being searched. Try to restart your Azure portal session and ensure your url doesn't have any extra text.<br><br>2. Ensure that your subscription and/or resource group is within a region that is supported. For more information, see [supported regions](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=azure-arc&regions=all). | 

