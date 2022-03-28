---
title: Add an Azure Cloud Account to Nutanix Clusters
description: 
ms.topic: how-to
ms.subservice: 
ms.date: 03/31/2021
---

# Add an Azure Cloud Account to Nutanix Clusters

To add your Azure account to Nutanix Clusters, you must specify your Azure cloud account name, cloud account ID, create and verify a Resource Manager in the Azure console, and select an Azure region in which you want to create Nutanix clusters. 

> [!NOTE]
> You can add one Azure account to multiple organizations within the same customer entity. However, you cannot add the same Azure account to two or more different Customer (tenant) entities.  

If you have already added an Azure account to an organization and want to add the same Azure account to another organization, follow the same process but you do not need to create the CloudFormation template. 

 
Perform the following procedure to add an Azure account to Nutanix Clusters. 

> [!NOTE]
> Before performing these steps, copy the credentials of your Azure Account from the Microsoft Azure portal. 

1. Log on to Nutanix Clusters from the My Nutanix dashboard.
2. In the navigation pane on the left, click the Organizations tab, click the ellipsis next to the organization you want to add the cloud account to, and click Cloud Accounts. 
1. In the Cloud accounts page, click Add Cloud Account. The Add a Cloud Account dialog box appears.  
To create and manage resources in your Azure account, Nutanix Clusters requires 
several IAM resources.

## Next steps

Learn more about Nutanix:

> [!div class="nextstepaction"]
> [About the Public Preview](about-the-public-preview.md)
