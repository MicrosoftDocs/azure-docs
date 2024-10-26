---
title: 
description: 
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: how-to
ms.date: 10/26/2024

#customer intent: As a dev center administrator or Project Admin, I want to create image definition files so that my development teams can create customized dev boxes.
---

# Configure imaging for Dev Box Team Customizations
Dev Center imaging provides a way to optimize your team customizations by flattening them into an image. 

In this article, you:
1.    Use example customization file, or the customization file you created in the previous how-to
2.    Modify a pool to use the customization file as an image
3.    Choose to build the image
4.    Create a dev box

To learn more about team customizations, see <link to customizations overview>

## Prerequisites
To complete the steps in this article, you must have a team customization file that you want to use to create a dev box. If you don't have a customization file, see [Write a customization file](./how-to-write-customization-file.md).

## Permissions required to configure Microsoft Dev Box customizations  
  
[!INCLUDE [permissions-for-customizations](includes/permissions-for-customizations.md)]

## Configure imaging
This section covers the steps for creating your own customization (imagedefiniton.yaml) file.

## Create a customization file
Use VS Code or Dev Home to create a customization file
Or
Use a customization file from a repo
Create a pool to use the customization file as an image
Create a pool, specify imagedefinition.yaml
 
### Choose to build a resuable image
1.    Select yes
2.    Select your image from the list
3.    Check status until done
### Create a dev box
Dev portal or dev home?

## Related content
*    <link to overview>
*    <link to write a config file>
*    Add and configure a catalog from GitHub or Azure DevOps


- [Add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md)