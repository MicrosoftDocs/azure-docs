---
title: Add an Azure Data Explorer data source in Grafana
titlesuffix: Azure Managed Grafana
description: In this guide, learn how to connect an Azure Data Explorer datasource to Grafana and learn about the authentication methods available for Azure Data Explorer.
author: maud-lv
ms.author: malev
ms.service: managed-grafana
ms.topic: how-to
ms.date: 11/22/2023
# CustomerIntent: As an Azure Managed Grafana customer, I want to add and set up Azure Data Explorer so that I can use an Azure Data Explorer datasource in a Grafana dashboard.
---


# Configure an Azure Data Explorer datasource

Azure Data Explorer is a logs & telemetry data exploration service. In this guide, you learn how to add an Azure Data Explorer data source to Grafana and you learn how to configure Azure Data Explorer using each authentication option available for this service.

## Prerequisites

* [An Azure Managed Grafana instance](./quickstart-managed-grafana-portal.md) in the Standard plan.
* [An Azure Data Explorer database](/azure/data-explorer/create-cluster-database)

## Add an Azure Data Explorer data source

Add an Azure Data Explorer data source to Grafana by following the steps below.

1. Open an Azure Managed Grafana instance in the Azure portal.
1. In the **Overview** section, open the **Endpoint** URL.
1. In the Grafana portal, deploy the menu on the left and select **Connections** > **Connect data**.
1. Select **Azure Data Explorer Datasource** from the list, and add it to Grafana by selecting **Create a Azure Data Explorer Datasource data source** in the top right corner.

## Register basic configuration information

Enter Azure Data Explorer configuration settings.

1. In the **Settings** tab, optionally edit the data source **Name**.
1. Under **Connection Details**, enter the Azure Data Explorer database **Cluster URL**..

## Set up authentication

Configure the Azure Data Explorer data source with one of the following authentication options.

### Use a managed identity

Azure Managed identity lets you authenticate without using explicit credentials.

1. In the Azure portal, open your Azure Data Explorer cluster.
1. In the **Overview** section, select the database that contains your data.
1. Select **Permissions > Add > Viewer**.
1. In the search box, enter your Azure Managed Grafana workspace name, select the workspace and then choose **Select**.
1. A success notification appears.
1. Back in Grafana, under **Authentication Method**, select **Managed Identity**.
1. Select **Save & test**. The "Success" notification displayed indicates that Grafana is able to fetch data from the database.

### Use  a service principal (app registration)

To use a service principal, you need to have a Microsoft Entra service principal and connect Microsoft Entra ID with an Azure Data Explorer User. For more information, go to [Configuring the datasource in Grafana](https://github.com/grafana/azure-data-explorer-datasource#configuring-the-datasource-in-grafana).

#### Configure initial set-up

1. Follow the steps in [Register an application with Microsoft Entra ID and create a service principal](/entra/identity-platform/howto-create-service-principal-portal#register-an-application-with-microsoft-entra-id-and-create-a-service-principal).
1. Assign the Reader role to the application in the [next step of the guide](/entra/identity-platform/howto-create-service-principal-portal#assign-a-role-to-the-application).
1. Follow the three first steps of the [Retrieve application details](/azure/managed-grafana/how-to-api-calls#retrieve-application-details) guide to gather the Directory (tenant) ID, Application (client) ID and Client Secret ID required in the next step.

#### Configure the data source

1. Under **Authentication Method**, select **App Registration**.
1. For **Azure Cloud**, select your Azure Cloud. For example, **Azure**.
1. Enter a **Directory (tenant) ID**, **Application (client) ID** and **Client Secret**
1. Optionally also edit the **Query Optimizations**, **Database schema settings**, and **Tracking** sections.
1. Select **Save & test** to validate the connection. The "Success" notification displayed indicates that Grafana is able to connect to the database.

### Use Current User

The Azure Data Explorer data source also supports user-based authentication. This authentication method leverages the current Grafana user's Entra ID credentials in the configured data source.

When you configure an Azure Data Explorer data source with a user-based authentication method, Grafana queries Azure Data Explorer using the user's credentials. With this approach, you don't need to go through the extra step of geting a read permission assigned to your Grafana managed identity.

> [!NOTE]
> Rollout of the user-based authentication in Azure Managed Grafana is in progress and will be complete in all regions by the end of 2023.

> [!CAUTION]
> User-based authentication in Grafana data sources is experimental.

> [!CAUTION]
> This feature is incompatible with use cases that requires always-on machine access to the queried data, including Alerting, Reporting, Query caching and Public dashboards. The Current User authentication method relies on a user being logged in, in an interactive session, for Grafana to reach the database. When user-based authentication is used and no user is logged in, automated tasks can't run in the background. To leverage automated tasks for Azure Data Explorer, we recommend setting up another Azure Data Explorer data source using another authentication method.

1. Under **Authentication Method**, select **Current User**.
1. Select **Save & test**. The "Success" notification displayed indicates that Grafana is able to fetch data from the database.

## Next step

> [!div class="nextstepaction"]
> [Create a dashboard](how-to-create-dashboard.md)
