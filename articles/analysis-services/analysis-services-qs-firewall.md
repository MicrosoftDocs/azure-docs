---
title: Quickstart - Configure a firewall for an Analysis Services server in Azure | Microsoft Docs
description: Learn how to configure a firewall for an Analysis Services server instance in Azure.
author: minewiskan
manager: kfile
ms.service: azure-analysis-services
ms.topic: quickstart
ms.date: 07/03/2018
ms.author: owend
ms.reviewer: minewiskan
#Customer intent: As a BI developer, I want to secure my server by configuring a server firewall and create open IP address ranges for client computers in my organization.
---
# Quickstart: Configure server firewall - Portal

This quickstart helps you configure a firewall for your Azure Analysis Services server. Enabling a firewall and configuring IP address ranges for only those computers accessing your server are an important part of securing your server and data.

## Prerequisites

- An Analysis Services server in your subscription. To learn more, see [Quickstart: Create a server - Portal](analysis-services-create-server.md) or [Quickstart: Create a server - PowerShell](analysis-services-create-powershell.md)
- One or more IP address ranges for client computers (if needed).

## Log in to the Azure portal 

[Log in to the portal](https://portal.azure.com)

## Configure a firewall

1. Click on your server to open the Overview page. 
2. In **SETTINGS** > **Firewall** > **Enable firewall**, click **On**.
3. To allow DirectQuery access from Power BI service, in **Allow access from Power BI**, click **On**.  
4. (Optional) Specify one or more IP address ranges. Enter a name, starting, and ending IP address for each range. 
5. Click **Save**.

     ![Firewall settings](./media/analysis-services-qs-firewall/aas-qs-firewall.png)

## Clean up resources

When no longer needed, delete IP address ranges, or disable the firewall.

## Next steps
In this quickstart, you learned how to configure a firewall for your server. Now that you have server, and secured it with a firewall, you can add a basic sample data model to it from the portal. Having a sample model is helpful to learn about configuring model database roles and testing client connections. To learn more, continue to the tutorial for adding a sample model.

> [!div class="nextstepaction"]
> [Tutorial: Add a sample model to your server](analysis-services-create-sample-model.md)
