---
title: Get resource events in Azure App Service
description: Learn how to get resource events through Activity Logs and Event Grid on your App Service app.
ms.topic: article
ms.date: 04/24/2020
ms.author: msangapu

---
# Get resource events in Azure App Service

Azure App Service provides built-in tools to monitor the status and health of your resources. Resource events help you understand any changes that were made to your underlying web app resources and take action as necessary. Event examples include: scaling of instances, updates to application settings, restarting of the web app, and many more. In this article, you'll learn how to view [Azure Activity Logs](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view) and enable [Event Grid](https://docs.microsoft.com/azure/event-grid/) to monitor resource events related to your App Service web app.

> [!NOTE]
> App Service integration with Event Grid is in **preview**. [View the announcement for more details.](https://aka.ms/app-service-event-grid-announcement)
>

## View Azure Activity Logs
Azure Activity Logs contain resource events emitted by operations taken on the resources in your subscription. Both the user actions in the Azure portal and Azure Resource Manager templates contribute to the events captured by the Activity log. 

Azure Activity Logs for App Service details such as:
- what operations were taken on the resources (ex: App Service Plans)
- who started the operation
- when the operation occurred
- the status of the operation
- property values to help you research the operation

### What can you do with Azure Activity Logs?

Azure Activity Logs can be queried using the Azure portal, PowerShell, REST API, or CLI. You can send the logs to a storage account, Event Hub, and Log Analytics. You can also analyze them in Power BI or create alerts to stay updated on resource events.

[View and retrieve Azure Activity log events.](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view)

## Ship Activity Logs to Event Grid

While Activity logs are user-based, there's a new [Event Grid](https://docs.microsoft.com/azure/event-grid/) integration with App Service (preview) that logs both user actions and automated events. With Event Grid, you can configure a handler to react to the said events. For example, use Event Grid to instantly trigger a serverless function to run image analysis each time a new photo is added to a blob storage container.

Alternatively, you can use Event Grid with Logic Apps to process data anywhere, without writing code. Event Grid connects data sources and event handlers. For example, use Event Grid to instantly trigger a serverless function to run image analysis each time a new photo is added to a blob storage container.

[View the properties and schema for Azure App Service Events.](https://docs.microsoft.com/azure/event-grid/event-schema-app-service)

## <a name="nextsteps"></a> Next steps
* [Query logs with Azure Monitor](../azure-monitor/log-query/log-query-overview.md)
* [How to Monitor Azure App Service](web-sites-monitor.md)
* [Troubleshooting Azure App Service in Visual Studio](troubleshoot-dotnet-visual-studio.md)
* [Analyze app Logs in HDInsight](https://gallery.technet.microsoft.com/scriptcenter/Analyses-Windows-Azure-web-0b27d413)
