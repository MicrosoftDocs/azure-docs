---
title: Known issues
description: "Troubleshooting in site manager"
author: torreymicrosoft
ms.author: torreyt
ms.service: azure-arc
#ms.subservice: site-manager
ms.topic: issues #Don't change
ms.date: 4/10/2024

#customer intent: As a customer, I want to understand how to resolve known issues I experience in site manager.

---

# Troubleshooting in Azure Arc site manager public preview

This article identifies the potential issue prone scenarios and when applicable their troubleshooting steps in Azure Arc site manager.  

## Troubleshooting

| Scenario | Troubleshooting Suggestions |
|---------|---------|
| Error adding resource to site | 1. Site manager only supports specific resources listed on the overview/about page. This list will change over time, read this list and see if the resource is on it. 2. The resource may not be able to be created in the resource group or subscription associated with the site. 3. Your permissions may not enable you to modify the resources within the resource group or subscription associated with the site. Work with your admin to ensure your permissions are correct and try again. | 
| Permissions error, also known as role based access control or RBAC | 1. Ensure you have the correct permissions to create new sites under your subscription or resource group, work with your admin to ensure you have permission to create. | 
| Resource not visible in site | 1. It is likely the resource is not supported by site manager. Site manager only supports specific resources listed on the overview/about page. This list will change over time, read this list and see if the resource is on it. | 
| Site page or overview or get started page in site manager is not loading or not showing any information |  1. Check the url being used while in the Azure portal, you might have a text in the url that is preventing site manager and/or pages within site manager from displaying or being searchable. Try to restart your Azure portal session and ensure your url doesn't have any extra text. 2. Ensure your subscription and/or resource group is within a region that is supported 
| 

