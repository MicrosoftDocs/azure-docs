---
title: Monitor Azure services and applications using Grafana
description: Route Azure Monitor and Application Insights data so you can view them in Grafana.
services: azure-monitor
keywords: 
author: rboucher
ms.author: robb
ms.date: 11/06/2017
ms.topic: conceptual
ms.service: azure-monitor
ms.component: ""
---

# Monitor your Azure services in Grafana
You can now also monitor Azure services and applications from [Grafana](https://grafana.com/) using the [Azure Monitor data source plugin](https://grafana.com/plugins/grafana-azure-monitor-datasource). The plugin gathers application performance data collected by the Application Insights SDK as well as infrastructure data provided by Azure Monitor. You can then display this data on your Grafana dashboard.

The plugin is currently in preview.

Use the following steps to set up a Grafana server from Azure Marketplace and build dashboards for metrics from Azure Monitor and Application Insights.

## Set up a Grafana instance
1. Go to Azure Marketplace and pick Grafana by Grafana Labs.

2. Fill in the names and details. Create a new resource group. Keep track of the values you choose for the VM username, VM password, and Grafana server admin password.  

3. Choose VM size and a storage account.

4. Configure the network configuration settings.

5. View the summary and select **Create** after accepting the terms of use.

## Log in to Grafana
1. After the deployment completes, select **Go to Resource Group**. You see a list of newly created resources.

    ![Grafana resource group objects](.\media\monitor-how-to-grafana\grafana1.png)

    If you select the network security group (*grafana-nsg* in this case), you can see that port 3000 is used to access Grafana server.

2. Go back to the list of resources and select **Public IP address**. Using the values found on this screen, type *http://<IP address>:3000*  or the *<DNSName>:3000* in your browser. You should see a login page for the Grafana server you just built.

    ![Grafana login screen](.\media\monitor-how-to-grafana\grafana2.png)

3. Log in with the user name as *admin* and the Grafana server admin password you created earlier.

## Configure data source plugin

Once successfully logged in, you should see that the Azure Monitor data source plugin is already included.

![Grafana shows Azure Monitor plugin](.\media\monitor-how-to-grafana\grafana3.png)

1. Select **Add data source** to configure Azure Monitor and Application Insights.

2. Pick a name for the data source and select **Azure Monitor** as the data source from the dropdown.


## Create a service principal

Grafana uses an Azure Active Directory service principal to connect to Azure Monitor APIs and collect metrics data. You must create a service principal to manage access to your Azure resources.

1. See [these instructions](../azure-resource-manager/resource-group-create-service-principal-portal.md) to create a service principal. Copy and save your tenant ID, client ID, and a client secret.

2. See [Assign application to role](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-create-service-principal-portal#assign-application-to-role) to assign the reader role to the Azure Active Directory application. 	

3. If you use Application Insights, you can also include your Application Insights API and application ID to collect Application Insights based metrics. For more information, see [Getting your API key and Application ID](https://dev.applicationinsights.io/documentation/Authorization/API-key-and-App-ID).

4. After you have entered all of this info, select **Save** and Grafana tests the API. You should see a message similar to the following one.  

    ![Grafana shows Azure Monitor plugin](.\media\monitor-how-to-grafana\grafana4-1.png)

> [!NOTE]
> While configuring the plugin you can indicate which Azure Cloud (Public, Azure US Government, Azure Germany, or Azure China) you would like the plugin to be configured against.
>
>

## Build a Grafana dashboard

1. Go to Home and select **New Dashboard**.

2. In the new dashboard, select the **Graph**. You can try other charting options but this article uses *Graph* as an example.

    ![Grafana New Dashboard](.\media\monitor-how-to-grafana\grafana5.png)

3. A blank graph shows up on your dashboard.

4. Click on the panel title and select **Edit** to enter the details of the data you want to plot in this graph chart.

5. Once you have selected all the right VMs, you can start viewing the metrics in the dashboard.

Following is a simple dashboard with two charts. The one on left shows the CPU percentage of two VMs. The chart on the right shows the transactions in an Azure Storage account broken down by the Transaction API type.

![Grafana Two Charts Example](.\media\monitor-how-to-grafana\grafana6.png)


## Optional: Create dashboard playlists

One of the many useful features of Grafana is the dashboard playlist. You can create multiple dashboards and add them to a playlist configuring an interval for each dashboard to show. Select **Play** to see the dashboards cycle through. You may want to display them on a large wall monitor to provide a "status board" for your group.

![Grafana Playlist Example](.\media\monitor-how-to-grafana\grafana7.png)


## Optional: Monitor your custom metrics in the same Grafana server

You can also install Telegraf and InfluxDB to collect and plot both custom and agent-based metrics in the same Grafana instance. There are many data source plugins that you can use to bring these metrics together in a dashboard.

You can also reuse this set up to include metrics from your Prometheus server. Use the Prometheus data source plugin in Grafana's plugin gallery.

Here are good reference articles on how to use Telegraf, InfluxDB, Prometheus, and Docker
 - [How To Monitor System Metrics with the TICK Stack on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-monitor-system-metrics-with-the-tick-stack-on-ubuntu-16-04)

 - [Monitor Docker resource metrics with Grafana, InfluxDB, and Telegraf](https://blog.vpetkov.net/2016/08/04/monitor-docker-resource-metrics-with-grafana-influxdb-and-telegraf/)

 - [A monitoring solution for Docker hosts, containers, and containerized services](https://stefanprodan.com/2016/a-monitoring-solution-for-docker-hosts-containers-and-containerized-services/)

Here is an image of a full Grafana dashboard that has metrics from Azure Monitor and Application Insights.
![Grafana Example Metrics](.\media\monitor-how-to-grafana\grafana8.png)


## Clean up resources

You are charged when VMs are running whether you are using them or not. To avoid incurring additional charges, clean up the resource group created in this article.

1. From the left-hand menu in the Azure portal, click **Resource groups** and then click **Grafana**.
2. On your resource group page, click **Delete**, type **Grafana** in the text box, and then click **Delete**.

## Next steps
* [Overview of Azure Monitor Metrics](monitoring-overview-metrics.md)
