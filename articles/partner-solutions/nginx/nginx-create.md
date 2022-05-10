---
title: Create nginx application - Azure partner solutions
description: This article describes how to use the Azure portal to create an instance of nginx.
ms.topic: quickstart
ms.collection: na
ms.service: partner-services
author: flang-msft
ms.author: franlanglois
ms.date: 05/12/2022
ms.custom: mode-other
---

# QuickStart: Get started with nginx

In this quickstart, you'll use the Azure portal to createan instance of nginx with your Azure solutions.

### Create new Nginx account 

Set the following values in the Create Nginx resource screen.

| Property  | Description |
|---------|---------|
| Subscription     | From the drop down select your Azure subscription where you have owner access        |
| Resource group     | Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see Azure Resource Group overview.          |
| Nginx account name  | Put the name for the Nginx account you want to create         |
| Location | Select West Central US. Please note that this is the only Azure region supported by Nginx during preview.          |
| Plan     |    Specified based on the selected Nginx plan      |
| Price    |     Pay As You Go     |

Image1 - Image, text, application

Image2 - Shape  Image, application

1. After filling in the proper values, select the button  that says **Next: Networking**. You are taken the **Networking** screen.  This screen allows you to specify the VNET and Subnet that is associated to the Nginx deployment.  

1. Check the checkbox that acknowledges access to you Tenant to ensure VNET and NIC association. 

1. Select either Public or Private End points for IP address selection.

### Add custom tags 

Image - nginx deployment 

You can specify custom tags for the new Nginx resource in Azure by adding custom key value pairs. An example is shown below.

| Property | Description |
|----------| -------------|
|Name | Name of the tag corresponding to the Azure Nginx resource |
| Value | Value of the tag corresponding to the Azure Nginx resource |

Click the **Next: Review+Create** button to navigate to the final step for resource creation. 

### Review + Create Nginx resource

Image - nginx review and create

Once you get to the **Review + Create** page, all validations are run. At this point, you can review all the selections made in the Basics, Metrics and Logs, Single sign-on and Tags screens. You can also review the Nginx and Azure marketplace terms and conditions.  

Once you have reviewed all the information click **Create**. 

Image

Azure now deploys the Nginx resource. 

Image 

Once the process is complete, the **Go to Resource** button appears. Click this button to navigate to the specific Nginx resource.

Image 

The Overview blade, provides basic information on the deployed resources. 

Image


## Identity Overview  

## Configure Managed Identity 

Add a new User Assigned Managed Identity  

 

 

 

Image, text, application

Description automatically generated 

 

 

## Nginx Configuration 

To upload an existing Nginx Configuration file,  select **Nginx configuration** menu item under the Settings in the left navigation Pane. 

Image, text, application, email

Description automatically generated 

Provide the path of the config file and click the **+** button and for config package 

 

 

 

 

 

Image



Edit the config file within the Editor. 
## Next steps

- [Manage the nginx resource](nginx-manage.md)
