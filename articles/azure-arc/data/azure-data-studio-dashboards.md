---
title: Azure Data Studio dashboards
description: Azure Data Studio dashboards
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# Azure Data Studio dashboards

[Azure Data Studio](/sql/azure-data-studio/what-is) provides an experience similar to the Azure portal for viewing information about your Azure Arc resources.  These views are called **dashboards** and have a layout and options similar to what you could see about a given resource in the Azure portal, but give you the flexibility of seeing that information locally in your environment in cases where you don't have a connection available to Azure.

## Connect to a data controller

### Prerequisites

- Download [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio)
- Azure Arc extension is installed

### Connect

1. Open Azure Data Studio.
2. Select the **Connections** tab on the left.
3. Expand the panel called **Azure Arc Controllers**.
4. Select the **Connect Controller** button. 

   Azure Data Studio opens a blade on the right side.

1. Enter the **Namespace** for the data controller.

   Azure Data Studio reads from the `kube.config` file in your default directory and lists the available Kubernetes cluster contexts. It selects the current cluster context. If this is the right cluster to connect to, use that namespace. 

   If you need to retrieve the namespace where the Azure Arc data controller is deployed, you can run `kubectl get datacontrollers -A` on your Kubernetes cluster. 

6. Optionally add a display name for the Azure Arc data controller in the input for **Name**.
7. Select **Connect**.


After you connect to a data controller, you can view the dashboards. Azure Data Studio has dashboards for the data controller and any SQL managed instances or PostgreSQL server resources that you have.

## View the data controller dashboard

Right-click on the data controller in the Connections panel in the **Arc Controllers** expandable panel and choose **Manage**.

Here you can see details about the data controller resource such as name, region, connection mode, resource group, subscription, controller endpoint, and namespace.  You can see a list of all of the managed database resources managed by the data controller as well.

You'll notice that the layout is similar to what you might see in the Azure portal.

Conveniently, you can launch the creation of a SQL managed instance or PostgreSQL server by clicking the + New Instance button.

You can also open the Azure portal in context to this data controller by clicking the Open in Azure portal button.

## View the SQL Managed Instance dashboards

If you have created some SQL Managed Instances, see them listed under **Connections** in the **Azure Data Controllers** expandable panel underneath the data controller that is managing them.

To view the SQL Managed Instance dashboard for a given instance, right-click on the instance and choose **Manage**.

The **Connection** panel prompts you for the login and password to connect to an instance. If you know the connection information you can enter it and choose **Connect**.  If you don't know, choose **Cancel**.  Either way, Azure Data Studio returns to the dashboard when the **Connection** panel closes.

On the **Overview** tab, view resource group, data controller, subscription ID, status, region, and other information. This location also provides links to the Grafana dashboard for viewing metrics or Kibana dashboard for viewing logs in context to that SQL managed instance.

With a connection to the SQL manage instance, you can see additional information here.

You can delete the SQL managed instance from here or open the Azure portal to view the SQL managed instance in the Azure portal.

If you click on the **Connection Strings** tab, the Azure Data Studio presents a list of pre-constructed connection strings for that instance making. Copy and paste these strings into various other applications or code.

## View the PostgreSQL server dashboards

If the deployment includes PostgreSQL servers, Azure Data Studio lists them  in the **Connections** panel in the **Azure Data Controllers** expandable panel underneath the data controller that is managing them.

To view the PostgreSQL server dashboard for a given server group, right-click on the server group and choose Manage.

On the **Overview** tab, review details about the server group such as resource group, data controller, subscription ID, status, region and more. The tab also has links to the Grafana dashboard for viewing metrics or Kibana dashboard for viewing logs in context to that server group.

You can delete the server group from here or open the Azure portal to view the server group in the Azure portal.

If you click on the **Connection Strings** tab on the left, Azure Data Studio provides pre-constructed connection strings for that server group. Copy and paste these strings to various other applications or code.

Select the **Properties** tab on the left to see additional details.

The **Resource health** tab on the left displays the current health of that server group.

The **Diagnose and solve problems** tab on the left, launches the PostgreSQL troubleshooting notebook.

For Azure support, select the **New support request** tab. This launches the Azure portal in context to the server group. Create an Azure support request from there.

## Next steps

- [View SQL Managed Instance in the Azure portal](view-arc-data-services-inventory-in-azure-portal.md)