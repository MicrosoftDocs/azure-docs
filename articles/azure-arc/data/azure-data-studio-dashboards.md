---
title: Azure Data Studio dashboards
description: Azure Data Studio dashboards
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Azure Data Studio dashboards

[Azure Data Studio](https://aka.ms/azuredatastudio) provides an experience similar to the Azure portal for viewing information about your Azure Arc resources.  These views are called **dashboards** and have a layout and options similar to what you could see about a given resource in the Azure portal, but give you the flexibility of seeing that information locally in your environment in cases where you don't have a connection available to Azure.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Connecting to a data controller

### Prerequisites

- Download [Azure Data Studio](https://aka.ms/getazuredatastudio)
- Azure Arc extension is installed

### Determine the data controller server API endpoint URL

First, you'll need to connect Azure Data Studio to your data controller service API endpoint URL.

To get this endpoint you can run the following command:

```console
kubectl get svc/controller-svc-external -n <namespace name>

#Example:
kubectl get svc/controller-svc-external -n arc
```

You'll see output that looks like this:

```console
NAME                      TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)                                       AGE
controller-svc-external   LoadBalancer   10.0.175.137   52.154.152.24    30080:32192/TCP                               22h
```

If you are using a LoadBalancer type, you'll want to copy the external IP address and port number. If you are using NodePort, you'll want to use the IP address of your Kubernetes API server and the port number listed under the PORT(S) column.

Now, you'll want to construct a URL to your endpoint by combining this information like so:

```console
https://<ip address>:<port>

Example:
https://52.154.152.24:30080
```

Take note of your IP address as you will use it in the next step.

### Connect

1. Open Azure Data Studio

1. Select the **Connections** tab on the left

Towards the bottom, expand the panel called **Azure Arc Controllers**.

Click the + icon to add a new data controller connection.

At the top of the screen in the command palette, enter the URL you constructed in Step 1, click enter.
Enter the username for the data controller.  This was the username value that you passed during the deployment of the data controller.  Click enter.
Enter the password for the data controller.  This was the password value that you passed during the deployment of the data controller. Click enter.

Now that you are connected to a data controller, you can view the dashboards for the data controller and any SQL managed instances or PostgreSQL Hyperscale server group resources that you have.

## View the Data Controller dashboard

Right-click on the data controller in the Connections panel in the **Arc Controllers** expandable panel and choose **Manage**.

Here you can see details about the data controller resource such as name, region, connection mode, resource group, subscription, controller endpoint, and namespace.  You can see a list of all of the managed database resources managed by the data controller as well.

You'll notice that the layout is similar to what you might see in the Azure portal.

Conveniently, you can launch the creation of a SQL managed instance or PostgreSQL Hyperscale server group by clicking the + New Instance button.

You can also open the Azure portal in context to this data controller by clicking the Open in Azure portal button.

## View the SQL managed instance dashboards

If you have created some SQL managed instances, you can see them listed in the Connections panel in the Azure Data Controllers expandable panel underneath the data controller that is managing them.

To view the SQL managed instance dashboard for a given instance, right-click on the instance and choose Manage.

The Connection panel will pop up on the right and prompt you for the login/password to connect to that SQL instance. If you know the connection information you can enter it and click Connect.  If you don't know, you can click Cancel.  Either way, you will be brought to the dashboard when the Connection panel closes.

On the Overview tab you can view details about the SQL managed instance such as resource group, data controller, subscription ID, status, region and more.  You can also see link that you can click to go into the Grafana or Kibana dashboards in context to that SQL managed instance.

If you are able to connect to the SQL manage instance, you can see additional information here.

You can delete the SQL managed instance from here or open the Azure portal to view the SQL managed instance in the Azure portal.

If you click on the Connection Strings tab on the left, you can see a list of pre-constructed connection strings for that SQL managed instance making it easy for you to copy/paste into various other applications or code.

## View the PostgreSQL Hyperscale server group dashboards

If you have created some PostgreSQL Hyperscale server groups, you can see them listed in the Connections panel in the Azure Data Controllers expandable panel underneath the data controller that is managing them.

To view the PostgreSQL Hyperscale server group dashboard for a given server group, right-click on the server group and choose Manage.

On the Overview tab you can view details about the server group such as resource group, data controller, subscription ID, status, region and more.  You can also see link that you can click to go into the Grafana or Kibana dashboards in context to that server group.

You can delete the server group from here or open the Azure portal to view the server group in the Azure portal.

If you click on the Connection Strings tab on the left, you can see a list of pre-constructed connection strings for that server group making it easy for you to copy/paste into various other applications or code.

If you click on the Properties tab on the left, you can see additional details.

If you click on the Resource health tab on the left you can see the current high-level health of that server group.

If you click on the Diagnose and solve problems tab on the left, you can launch the PostgreSQL troubleshooting notebook.

If you click on the New support request tab on the left, you can launch the Azure portal in context to the server group and create an Azure support request from there.
