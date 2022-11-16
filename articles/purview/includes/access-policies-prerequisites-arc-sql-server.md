---
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: include
ms.date: 10/11/2022
ms.custom: references_regions
---


- Get [SQL Server version 2022 RC 1 or later](https://www.microsoft.com/sql-server/sql-server-2022) running on Windows and install it.
- Complete the process to onboard that [SQL Server instance with Azure Arc](/sql/sql-server/azure-arc/connect).
- Enable [Azure Active Directory authentication in SQL Server](/sql/relational-databases/security/authentication-access/azure-ad-authentication-sql-server-setup-tutorial). For a simpler setup, follow [this article](/sql/relational-databases/security/authentication-access/azure-ad-authentication-sql-server-automation-setup-tutorial#setting-up-azure-ad-admin-using-the-azure-portal).

#### Region support

Policy enforcement is available in only the following regions for Microsoft Purview:

- East US
- East US 2
- South Central US
- West Central US
- West US
- West US2
- West US3
- Canada Central
- Brazil South
- North Europe
- West Europe
- France Central
- Switzerland North
- UK South
- UAE North
- South Africa North
- Central India
- Korea Central
- Japan East
- Australia East

#### Security considerations for SQL Server on Azure Arc-enabled servers

- The server admin can turn off the Microsoft Purview policy enforcement.
- Azure Arc admin and server admin permissions provide the ability to change the Azure Resource Manager path of the server. Because mappings in Microsoft Purview use Resource Manager paths, this can lead to wrong policy enforcements. 
- A SQL Server admin (database admin) can gain the power of a server admin and can tamper with the cached policies from Microsoft Purview.
- The recommended configuration is to create a separate app registration for each SQL server instance. This configuration prevents the second SQL Server instance from reading the policies meant for the first SQL Server instance, in case a rogue admin in the second SQL Server instance tampers with the Resource Manager path.

#### SQL Server configuration on Azure Arc

This section describes the steps to configure SQL Server on Azure Arc to use Microsoft Purview.

1. Sign in to the Azure portal through [this link](https://portal.azure.com/#view/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/~/sqlServers), which lists SQL Server instances on Azure Arc.

1. Select the SQL Server instance that you want to configure.

1. Go to **Azure Active Directory** on the left pane.

1. Verify that Azure Active Directory authentication is configured with an admin login, a SQL Server service certificate, and a SQL Server app registration.

1. Scroll down to set **External Policy Based Authorization** to **Enabled**.

1. For **Microsoft Purview Endpoint**, enter an endpoint in the format *https://\<purview-account-name\>.purview.azure.com*. You can see the names of Microsoft Purview accounts in your tenant through [this link](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Purview%2FAccounts). 

   Optionally, you can confirm the endpoint by going to the Microsoft Purview account. Go to the **Properties** section on the left menu and scroll down until you see **Scan endpoint**. The full endpoint path is the one listed without "/Scan" at the end.

1. Make a note of the **App registration ID** value. You'll need it when you register and enable this data source for **Data use management** in Microsoft Purview.

   ![Screenshot that shows selections for configuring a Microsoft Purview endpoint in the Azure Active Directory section.](../media/how-to-policies-data-owner-sql/setup-sql-on-arc-for-purview.png)
   
1. Select the **Save** button to save the configuration.
