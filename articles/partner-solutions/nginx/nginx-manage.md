---
title: Manage an nginx integration with Azure - Azure partner solutions
description: This article describes management of nginx on the Azure portal. 
ms.topic: conceptual
ms.service: partner-services
ms.collection: na
author: flang-msft
ms.author: franlanglois
ms.date: 05/12/2022


---

# Manage the nginx integration with Azure

- Identity
- Certificates
- Monitoring
- GitHub integration
- Delete accounts

## Identity

Image

## Configure Managed Identity 

Add a new User Assigned Managed Identity  

    Image 

### Nginx Configuration 

To upload an existing Nginx Configuration file,  select **Nginx configuration** menu item under the Settings in the left navigation Pane. 

Graphical user interface, text, application, email

Description automatically generated 

Provide the path of the config file and click the **+** button and for config package 

Image  

Edit the config file within the Editor.

## Nginx Certificates 

You can bring in your certificates and upload it to Azure Key vault and associate it with your deployment. Click on Nginx configurations under the Settings in the left pane. 

Image 

## Nginx Monitoring 

Click the Nginx Monitoring under the Settings in the left navigation pane.

Image 

Click **Send metrics to Azure Monitor** to enable metrics and press Save. 

## GitHub Integration 

Enable CI/CD deployments via GitHub Actions integrations 

Image 
<!-- <<Add screenshot for GitHub integration>>  -->

## Delete Nginx Accounts 

1. Go to Overview in Resource manager on the left of the portal. 
1. Select **Nginx** resource and select “Delete”. 
1. Confirm that you want to delete Nginx resource. Select Delete. 

> [!NOTE]
> The delete button on the main account is  only activated if all the sub-accounts mapped to the main account are already deleted. Refer to section for deleting sub-accounts here 

Logs are no longer sent to Nginx once the account is deleted and all billing stops for Nginx through Azure Marketplace.

## Next steps

For help with troubleshooting, see [Troubleshooting nginx integration with Azure](nginx-troubleshoot.md).
