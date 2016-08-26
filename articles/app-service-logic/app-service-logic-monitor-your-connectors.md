<properties
	pageTitle="Manage and Monitor your Connectors and API Apps in App Service | Microsoft Azure"
	description="View performance of your Connectors and API Apps in Logic Apps; microservices architecture"
	services="app-service\logic"
	documentationCenter=".net,nodejs,java"
	authors="MandiOhlinger"
	manager="dwrede"
	editor="cgronlun"/>

<tags
	ms.service="logic-apps"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/28/2016"
	ms.author="mandia"/>

# Manage and Monitor your built-in API Apps and Connectors

>[AZURE.NOTE] This version of the article applies to logic apps 2014-12-01-preview schema version.

You created a built-in API App. Now what?

In Azure, every API App is a separate web site hosted on Azure. As a result, you can easily see how many requests are made, and see how much data is being used by the connector. You can also backup your API App, create alerts, enable Tinfoil Security, and add users and roles.

This topic describes some of the different options to manage your API App.

To see these built-in features, open your API App in the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040). If the API App is on your startboard, select it to open the properties. You can also select **Browse**, select **API Apps**, and then select your API App:

![][browse]

## See the properties you entered

When you open the API App, there are several features and tasks available:

![][settings]

You can:

- **Settings** shows specific information on the API App, including your subscription details, and lists the users who have access to your API app. You can also increase or decrease the number of instances of your API App using the Scale feature; among other features.
- Use the **Start** and **Stop** buttons to control the API App.
- When product updates are made to the underlying files used by your API App, you can click **Update** to get the latest versions. For example, if there is a fix or a security update released by Microsoft, clicking **Update** automatically updates your API App to include this fix.
- Select **Change Plan** to upgrade or downgrade based on the data usage of the API App. You can also use this feature to see your data usage.
- When you create a connector that has tables, like the SQL connector, you can optionally enter a table name to connect to. A schema based on the table is automatically created and available when you click **Download Schemas**. You can then use this downloaded schema to create a transform or a map.

## Change your connector or API configuration values you entered

After you configured or created your built-connector, you can change the values you entered. For example, if you configured the SQL Connector and you want to change the SQL Server name or table name, you can do this in the API App blade for your connector.

Steps include:

1. Open your connector or API App. When you do, the API App blade opens.
2. In **Essentials**, click the hyperlink under the Host property. The hyperlink is named something like *slackconnector* or *microsoftsqlconnector123*:

	![][apiapphost]

3. In the API App Host blade, select **Settings**. In the Settings blade, select **Application Settings**. Your configuration values are listed under **App Settings**:

	![][hostsettings]

4. Click the setting you want to change, enter the new value, and **Save** your changes.


## Install the Hybrid Connection Manager - Optional

![][hcsetup]

The Hybrid Connection Manager gives you the ability to connect to an on-premises system, like SQL Server or SAP. This hybrid connectivity uses Azure Service Bus to connect and to control the security between your Azure resources and your on-premises resources.

See [Using the Hybrid Connection Manager in Azure App Service](app-service-logic-hybrid-connection-manager.md).

> [AZURE.NOTE] Hybrid Connection Manager is required only if you are connecting to an on-premises resource behind your firewall. If you are not connecting to an on-premises system,  the Hybrid Connection Manager may not be listed in your connector blade.

## Monitor the performance
Performance metrics are built-in features and included with every API App you create. These metrics are specific to your API App hosted in Azure. Sample metrics:

![][monitoring]

You can:

- Select **Requests and errors** to add different performance metrics including commonly-known HTTP error codes, like 200, 400, or 500 HTTP status codes. You can also see response times,  see how many requests are made to the API App, and see how much data comes in and how much data goes out. Based on the performance metrics, you can create email Alerts if a metric exceeds a threshold of your choosing.
- In **Usage**, you can see how much **CPU** is used by the API App, review the current **Usage Quota** in MB, and see your maximum data usage based on your cost tier. **Estimated spend**  can help you determine the potential costs of running your API App.
- Select **Processes** to open Process Explorer. This shows your web instances and their properties, including thread count and memory usage.

Using these tools, you can determine if the App Service Plan should be scaled up or scaled down, based on your business needs. These features are built-in to the portal with no additional tools required.

## Control the security

API Apps use role-based security. These roles apply to the entire Azure experience, including API Apps and other Azure resources. The roles include:

Role | Description
--- | ---
Owner | Have full access to the management experience and can give access to other users or groups.
Contributor | Have full access to the management experience. Cannot give access to other users or groups.
Reader | Can view all resources except secrets.
User Access Administrator | Can view all resources, create/manage roles, and create/manage support tickets.

See [Role-based access control in the Microsoft Azure portal](../active-directory/role-based-access-control-configure.md).

You can easily add users and assign them specific roles to your API App. The portal shows you the users that have access and their assigned role:

![][access]  

- Select **Users** to add a user, assign a role, and remove a user.
- Select **Roles** to see all the users in a specific role, add a user to a role, and remove a user from a role.


## More Good Stuff
- Select **API definition** to open the automatically-created Swagger file for your specific API app.
- Select **Dependencies** to view the files required by your API App. For example, if you're using the SAP connector, you install some additional files on the on-premises Hybrid Connection Manager. These dependencies are shown in your API app blade.

>[AZURE.IMPORTANT] When you open your API app properties and look under **Essentials**, there are **Host** and **Gateway** links that open new blades:
>
> ![][host]
>
>These properties are specific to the website that hosts your API App. When using a built-in API App or connector, most of these properties don't really apply and we recommend that you  don't update these properties. If you created your own API App in Visual Studio and deployed it to your Azure subscription, then you can use the Host and Gateway blades. <br/><br/>


>[AZURE.NOTE] To get started with Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic). You can create a short-lived starter logic app. No credit cards required and no commitments.

## Read More

[Monitor your Logic Apps](app-service-logic-monitor-your-logic-apps.md)<br/>
[Connectors and API Apps List in App Service](app-service-logic-connectors-list.md)<br/>
[Role-based access control in the Microsoft Azure portal](../active-directory/role-based-access-control-configure.md)<br/>
[Using the Hybrid Connection Manager in Azure App Service](app-service-logic-hybrid-connection-manager.md)


<!--Image references-->
[browse]: ./media/app-service-logic-monitor-your-connectors/browse.png
[settings]: ./media/app-service-logic-monitor-your-connectors/settings.png
[hcsetup]: ./media/app-service-logic-monitor-your-connectors/hcsetup.png
[monitoring]: ./media/app-service-logic-monitor-your-connectors/monitoring.png
[access]: ./media/app-service-logic-monitor-your-connectors/access.png
[host]: ./media/app-service-logic-monitor-your-connectors/host.png
[hostsettings]: ./media/app-service-logic-monitor-your-connectors/hostsettings.png
[apiapphost]: ./media/app-service-logic-monitor-your-connectors/apiapphost.png
