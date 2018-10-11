---
title: Connect Configuration Manager to Log Analytics | Microsoft Docs
description: This article shows the steps to connect Configuration Manager to Log Analytics and start analyzing data.
services: log-analytics
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: ''
ms.assetid: f2298bd7-18d7-4371-b24a-7f9f15f06d66
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 03/22/2018
ms.author: magoedte
ms.component: 
---

# Connect Configuration Manager to Log Analytics
You can connect your System Center Configuration Manager environment to Azure Log Analytics to sync device collection data and reference these collections in Log Analytics and Azure Automation.  

## Prerequisites

Log Analytics supports System Center Configuration Manager current branch, version 1606 and higher.  

## Configuration overview
The following steps summarize the steps to configure Configuration Manager integration with Log Analytics.  

1. In the Azure portal, register Configuration Manager as a Web Application and/or Web API app, and ensure that you have the client ID and client secret key from the registration from Azure Active Directory. See [Use portal to create Active Directory application and service principal that can access resources](../azure-resource-manager/resource-group-create-service-principal-portal.md) for detailed information about how to accomplish this step.
2. In the Azure portal, [grant Configuration Manager (the registered web app) with permission to access Log Analytics](#grant-configuration-manager-with-permissions-to-log-analytics).
3. In Configuration Manager, [add a connection using the Add OMS Connection Wizard](#add-an-oms-connection-to-configuration-manager).
4. In Configuration Manager, [update the connection properties](#update-oms-connection-properties) if the password or client secret key ever expires or is lost.
5. [Download and install the Microsoft Monitoring Agent](#download-and-install-the-agent) on the computer running the Configuration Manager service connection point site system role. The agent sends Configuration Manager data to the Log Analytics workspace.
6. In Log Analytics, [import collections from Configuration Manager](#import-collections) as computer groups.
7. In Log Analytics, view data from Configuration Manager as [computer groups](log-analytics-computer-groups.md).

You can read more about connecting Configuration Manager to OMS at [Sync data from Configuration Manager to the Microsoft Operations Management Suite](https://technet.microsoft.com/library/mt757374.aspx).

## Grant Configuration Manager with permissions to Log Analytics
In the following procedure, you grant the *Contributor* role in your Log Analytics workspace to the AD application and service principal you created earlier for Configuration Manager.  If you do not already have a workspace, see [Create a workspace in Azure Log Analytics](log-analytics-quick-create-workspace.md) before proceeding.  This allows Configuration Manager to authenticate and connect to your Log Analytics workspace.  

> [!NOTE]
> You must specify permissions in Log Analytics for Configuration Manager. Otherwise, you receive an error message when you use the configuration wizard in Configuration Manager.
>

1. In the Azure portal, click **All services** found in the upper left-hand corner. In the list of resources, type **Log Analytics**. As you begin typing, the list filters based on your input. Select **Log Analytics**.<br><br> ![Azure portal](media/log-analytics-quick-collect-azurevm/azure-portal-01.png)<br><br>  
2. In your list of Log Analytics workspaces, select the workspace to modify.
3. From the left pane, select **Access Control (IAM)**.
4. In the Access Control page, click **Add** and the **Add permissions** pane appears.
5. In the **Add permissions** pane, under the **Role** drop-down list select the **Contributor** role.  
6. Under the **Assign access to** drop-down list, select the Configuration Manager application created in AD earlier, and then click **OK**.  

## Download and install the agent
Review the article [Connect Windows computers to the Log Analytics service in Azure](log-analytics-agent-windows.md) to understand the methods available for installing the Microsoft Monitoring Agent on the computer hosting the Configuration Manager service connection point site system role.  

## Add an OMS connection to Configuration Manager
In order to add an OMS connection, your Configuration Manager environment must have a [service connection point](https://technet.microsoft.com/library/mt627781.aspx) configured for online mode.

1. In the **Administration** workspace of Configuration Manager, select **OMS Connector**. This opens the **Add OMS Connection Wizard**. Select **Next**.
2. On the **General** screen, confirm that you have done the following actions and that you have details for each item, then select **Next**.

   1. In the Azure portal, you've registered Configuration Manager as a Web Application and/or Web API app, and that you have the [client ID from the registration](../active-directory/develop/quickstart-v1-integrate-apps-with-azure-ad.md).
   2. In the Azure portal, you've created an app secret key for the registered app in Azure Active Directory.  
   3. In the Azure portal, you've provided the registered web app with permission to access OMS.  
      ![Connection to OMS Wizard General page](./media/log-analytics-sccm/sccm-console-general01.png)
3. On the **Azure Active Directory** screen, configure your connection settings to Log Analytics by providing your **Tenant**, **Client ID**, and **Client Secret Key**, then select **Next**.  
   ![Connection to OMS Wizard Azure Active Directory page](./media/log-analytics-sccm/sccm-wizard-tenant-filled03.png)
4. If you accomplished all the other procedures successfully, then the information on the **OMS Connection Configuration** screen will automatically appear on this page. Information for the connection settings should appear for your **Azure subscription**, **Azure resource group**, and **Operations Management Suite Workspace**.  
   ![Connection to OMS Wizard OMS Connection page](./media/log-analytics-sccm/sccm-wizard-configure04.png)
5. The wizard connects to the Log Analytics service using the information you've input. Select the device collections that you want to sync with the service and then click **Add**.  
   ![Select Collections](./media/log-analytics-sccm/sccm-wizard-add-collections05.png)
6. Verify your connection settings on the **Summary** screen, then select **Next**. The **Progress** screen shows the connection status, then should **Complete**.

> [!NOTE]
> You must connect the top-tier site in your hierarchy to Log Analytics. If you connect a standalone primary site to Log Analytics and then add a central administration site to your environment, you have to delete and recreate the connection within the new hierarchy.
>
>

After you have linked Configuration Manager to Log Analytics, you can add or remove collections, and view the properties of the connection.

## Update Log Analytics connection properties
If a password or client secret key ever expires or is lost, you'll need to manually update the Log Analytics connection properties.

1. In Configuration Manager, navigate to **Cloud Services**, then select **OMS Connector** to open the **OMS Connection Properties** page.
2. On this page, click the **Azure Active Directory** tab to view your **Tenant**, **Client ID**, **Client secret key expiration**. **Verify** your **Client secret key** if it has expired.

## Import collections
After you've added an OMS connection to Configuration Manager and installed the agent on the computer running the Configuration Manager service connection point site system role, the next step is to import collections from Configuration Manager in Log Analytics as computer groups.

After you have completed initial configuration to import device collections from your hierarchy, the collection membership information is retrieved every 3 hours to keep the membership current. You can choose to disable this at any time.

1. In the Azure portal, click **All services** found in the upper left-hand corner. In the list of resources, type **Log Analytics**. As you begin typing, the list filters based on your input. Select **Log Analytics**.
2. In your list of Log Analytics workspaces, select the workspace Configuration Manager is registered with.  
3. Select **Advanced settings**.<br><br> ![Log Analytics Advance Settings](media/log-analytics-quick-collect-azurevm/log-analytics-advanced-settings-01.png)<br><br>  
4. Select **Computer Groups** and then select **SCCM**.  
5. Select **Import Configuration Manager collection memberships** and then click **Save**.  
   ![Computer Groups - SCCM tab](./media/log-analytics-sccm/sccm-computer-groups01.png)

## View data from Configuration Manager
After you've added an OMS connection to Configuration Manager and installed the agent on the computer running the Configuration Manager service connection point site system role, data from the agent is sent to Log Analytics. In Log Analytics, your Configuration Manager collections appear as [computer groups](log-analytics-computer-groups.md). You can view the groups from the **Configuration Manager** page under **Settings\Computer Groups**.

After the collections are imported, you can see how many computers with collection memberships have been detected. You can also see the number of collections that have been imported.

![Computer Groups - SCCM tab](./media/log-analytics-sccm/sccm-computer-groups02.png)

When you click either one, Search opens, displaying either all of the imported groups or all computers that belong to each group. Using [Log Search](log-analytics-log-searches.md), you can start in-depth analysis of Configuration Manager data.

## Next steps
* Use [Log Search](log-analytics-log-searches.md) to view detailed information about your Configuration Manager data.
