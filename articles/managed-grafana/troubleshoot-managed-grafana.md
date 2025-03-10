---
title: 'Troubleshoot Azure Managed Grafana'
description: Troubleshoot Azure Managed Grafana issues related to fetching data, managing Azure Managed Grafana dashboards, speed and more.
author: maud-lv
ms.author: malev
ms.topic: troubleshooting
ms.service: azure-managed-grafana
ms.date: 04/12/2024
---

# Troubleshoot issues for Azure Managed Grafana

This article guides you to troubleshoot errors with Azure Managed Grafana, and suggests solutions to resolve them.

## Access right alerts are displayed when creating the workspace

When creating an Azure Managed Grafana workspace from the Azure portal, the user gets an alert in the **Basics** tab: **You might not have enough access right at below subscription or resource group to enable all features, please see next 'Permission' tab for details.**

:::image type="content" source="media/troubleshoot/troubleshoot-access-rights-alert.png" alt-text="Screenshot of the Azure platform: insufficient access rights alert.":::

In the **Permissions** tab, another alert is displayed: **You must be a subscription 'Owner' or 'User Access Administrator' to use this feature.**
Role assignment controls are disabled.

These alerts are triggered because the user isn't a subscription Administrator or Owner and the following consequences will occur when the user creates the workspace:

- The user won't get the "Grafana Admin" role for the new Azure Grafana workspace
- The system-assigned managed identity of this Azure Grafana workspace won't get the Monitoring Reader role.

### Solution 1: proceed and get admin help

Proceed with the creation of the Azure Managed Grafana workspace. You should know that you won't be able to use the Azure Managed Grafana workspace until your subscription admin assigns you a Grafana Admin, Grafana Editor or Grafana Viewer role.

### Solution 2: select another subscription

The user can select another subscription in the **Basics** tab. They must be  an admin or an owner. The banner will disappear.

## Azure Managed Grafana workspace creation fails

An error is displayed when the user creates an Azure Managed Grafana workspace from the Azure portal.

### Solution 1: edit the workspace name

If you get an error while filling out the form to create the Azure Managed Grafana workspace, you may have given an invalid name to your Grafana workspace.

:::image type="content" source="media/troubleshoot/troubleshoot-instance-name-issue.png" alt-text="Screenshot of the Azure platform: workspace name error.":::

Enter a name that:

- Is unique in the entire Azure region. It can't already be used by another user.
- Is 23 characters long or smaller
- Begins with a letter. The rest can only be alphanumeric characters or hyphens, and the name must end with an alphanumeric character.

### Solution 2: review deployment error

1. Review the Azure Managed Grafana deployment details and read the status message.

   :::image type="content" source="media/troubleshoot/troubleshoot-deployment-error.png" alt-text="Screenshot of the Azure platform: workspace deployment error." lightbox="media/troubleshoot/troubleshoot-deployment-error.png":::

1. Do the following action, depending on the error message:

- The status message states that the region isn't supported and provides a list of supported Azure regions. Try deploying a new Azure Managed Grafana workspace again. When trying to create an Azure Managed Grafana workspace for the first time, the Azure portal suggests Azure regions that aren't available. These regions won't be displayed on your second try.
- The status message states that the role assignment update isn't permitted. The user isn't a subscription owner. If the resource deployment succeeded and the role assignment failed, ask someone with Owner or Administrator access control over your subscription to:

  - Assign the Monitoring reader role at the subscription level to the managed identity of the Azure Managed Grafana workspace
  - Assign you a Grafana Admin role for this new Azure Managed Grafana workspace
- If status message mentions a conflict, then someone may have created another a workspace with the same name at the same time, or the name check failed earlier, leading to a conflict later on. Delete this workspace and create another one with a different name.

## User can't access their Grafana user interface

The user has successfully created an Azure Managed Grafana workspace but can't access the Grafana UI when opening the endpoint URL.

### Solution 1: check the provisioning state

If you get a page with an error message such as "can't reach this page", stating that the page took too long to respond, follow the process below:

   :::image type="content" source="media/troubleshoot/troubleshoot-generic-browser-error.png" alt-text="Screenshot of a browser: can't reach page.":::

1. In the Azure platform, open your workspace and go to the **Overview** page. Make sure that the **Provisioning State** is **Succeeded** and that all other fields in the **Essentials** section are populated. If everything seems good, continue to follow the process below. Otherwise, delete and recreate a workspace.

   :::image type="content" source="media/troubleshoot/troubleshoot-healthy-instance.png" alt-text="Screenshot of the Azure platform. Overview - Essentials.":::

1. If you saw several browser redirects and then landed on a generic browser error page as shown above, then it means there's a failure in the backend.

1. If you have a firewall blocking outbound traffic, allow access to your workspace, to your URL ending in grafana.azure.com, and Microsoft Entra ID.

### Solution 2: fix access role issues

If you get an error page stating "No Roles Assigned":

   :::image type="content" source="media/troubleshoot/troubleshoot-no-roles-assigned.png" alt-text="Screenshot of the browser. No roles assigned.":::

This issue can happen if:

1. You didn't have permission to add a Grafana Admin role for yourself. Refer to [Access right alerts are displayed when creating the workspace](#access-right-alerts-are-displayed-when-creating-the-workspace) for more information.

1. You used the CLI, an ARM template or other another means to create the workspace that isn't the Azure portal. Only the Azure portal will automatically add you as a Grafana Admin. In all other cases, you must manually give yourself the Grafana Admin role.
   1. In your Azure Managed Grafana workspace, select **Access control (IAM) > Add role assignment** to add this role assignment. You must have the Administrator or Owner access role for the subscription or Azure Managed Grafana resource to make this role assignment. Ask your administrator to assist you if you don't have sufficient access.
   1. Your account is a foreign account: the Azure Managed Grafana workspace isn't registered in your home tenant.
   1. If you recently addressed this problem and have been assigned a sufficient Grafana role, you may need to wait for some time before the cookie expires and get refreshed. This process normally takes 5 min. If in doubts, delete all cookies or start a private browser session to force a fresh new cookie with new role information.

## Authorized users don't show up in Grafana Users configuration

Users aren't listed in the Grafana UI **Users** menu right after being added to a Grafana built-in RBAC role, such as Grafana Viewer. This behavior is *by design*. Grafana RBAC roles are stored in Microsoft Entra ID. For performance reasons, Azure Managed Grafana doesn't automatically synchronize users assigned to built-in roles across all workspace. There is no notification for changes in RBAC assignments and querying Microsoft Entra ID periodically to get current assignments adds extra load to the Microsoft Entra service.

There's no fix for this in itself. Users and their assigned roles are only listed in **Administration** > **Users and access** > **Users** in the Grafana UI once they've signed into the Azure Managed Grafana workspace.

## Azure Managed Grafana dashboard panel doesn't display any data

One or several Azure Managed Grafana dashboard panels show no data.

### Solution: review your dashboard settings

Context: Grafana dashboards are set up to fetch new data periodically. If the dashboard is refreshed too often for the underlying query to load, the panel will be stuck without ever being able to load and display data.

1. Check how frequently the dashboard is configured to refresh data.
   1. In your dashboard, go to **Dashboard settings**.
   1. In the general settings, lower the **Auto refresh** rate of the dashboard to be no faster than the time the query takes to load.
1. When a query takes too long to retrieve data. Grafana will automatically time out certain dependency calls that take longer than, for example, 30 seconds. Check that there are no unusual slow-downs on the query's end.

## General issues with data sources

The user can't connect to a data source, or a data source cannot fetch data.

### Solution: review network settings and IP address

To troubleshoot this issue:

1. Check the network setting of the data source server. There should be no firewall blocking Grafana from accessing it.
1. Check that the data source isn't trying to connect to a private IP address. Azure Managed Grafana doesn't currently support connections to private networks.

## Azure Monitor can't fetch data

Every Azure Managed Grafana workspace comes pre-configured with an Azure Monitor data source. When trying to use a pre-provisioned dashboard, the user finds that the Azure Monitor data source can't fetch data.

### Solution: review your Azure Monitor Data settings

1. Find a pre-provisioned dashboard by opening your Azure Managed Grafana endpoint and selecting **Dashboards** > **Browse**. Then select a dashboard, for example **Azure Monitor** > **Azure App monitoring - Application Insights**.
1. Make sure the dropdowns near the top are populated with a subscription, resource group and resource name. In the screenshot example below, the **Resource** dropdown is set to null. In this case, select a resource name. You may need to select another resource group that contains a type of resource the dashboard was designed for. In this example, you need to pick a resource group that has an Application Insights resource.

      :::image type="content" source="media/troubleshoot/troubleshoot-dashboard-resource.png" alt-text="Screenshot of the Azure Managed Grafana workspace: Checking dashboard information.":::

1. In the Azure Managed Grafana UI, select **Configurations** > **Data Sources** from the left menu, and select **Azure Monitor**.
1. If the data source is configured to use a managed identity:

   1. Select the **Load Subscriptions** button to make a quick test. If **Default Subscription** is populated with your subscription, Azure Managed Grafana can access Azure Monitor within this subscription. If not, then there are permission issues.

      :::image type="content" source="media/troubleshoot/troubleshoot-load-subscriptions.png" alt-text="Screenshot of the Azure Managed Grafana workspace: Load subscriptions.":::

      Check if a system-assigned or a user-assigned managed identity is enabled in your workspace by going to **Settings** > **Identity (Preview)**. Go to [Set up Azure Managed Grafana authentication and permissions](how-to-authentication-permissions.md) to learn how to enable and configure the managed identity.

   1. Once you've selected your subscription, select **Save & test**. If you see *No Log Analytics workspaces found*, you may need to assign the Reader role to the managed identity in the Log Analytics workspace. Open your Log Analytics workspace, go to **Settings** > **Access control (IAM)**, **Add** > **Add role assignment**.. 
 
1. If the data source uses an **App Registration** authentication:
   1. In your Grafana endpoint, go to **Configurations > Data Sources > Azure Monitor** and check if the information for **Directory (tenant) ID** and **Application (client) ID** is correct.
   1. Check if the service principal has the Monitoring Reader role assigned to the Azure Managed Grafana workspace. If not, add it from the Azure portal by opening your subscription in the Azure portal and going to **Access control (IAM)** > **Add** > **Add role assignment**.
   1. If needed, reapply the client secret.

      :::image type="content" source="media/troubleshoot/troubleshoot-azure-monitor-app-registration.png" alt-text="Screenshot of the Azure Managed Grafana workspace: Check app registration authentication details.":::

## Azure Data Explorer can't fetch data

The Azure Data Explorer data source can't fetch data.

### Solution: review your Azure Data Explorer settings

1. Find a pre-provisioned dashboard by opening your Azure Managed Grafana endpoint and selecting **Dashboards** > **Browse**. Then select a dashboard, for example **Azure Monitor** > **Azure Data Explorer Cluster Resource Insights**.
1. Make sure the dropdowns near the top are populated with a data source, subscription, resource group, name space, resource, and workspace name. In the screenshot example below, we chose a resource group that doesn't contain any Data Explorer cluster. In this case, select another resource group that contains a Data Explorer cluster.

      :::image type="content" source="media/troubleshoot/troubleshoot-dashboard-data-explorer.png" alt-text="Screenshot of the Azure Managed Grafana workspace: Checking dashboard information for Azure Data Explorer.":::

1. Check the Azure Data Explorer data source and see how authentication is set up. You can currently only set up authentication for Azure Data Explorer through Microsoft Entra ID.
1. In your Grafana endpoint, go to **Configurations > Data Sources > Azure Data Explorer**
1. Check if the information listed for **Azure cloud**, **Cluster URL**, **Directory (tenant) ID**, **Application (client) ID**, and **Client secret** is correct. If needed, create a new key to add as a client secret.
1. At the top of the page, you can find instructions guiding you through the process to grant necessary permissions to this Microsoft Entra app to read the Azure Data Explorer database.
1. Make sure that your Azure Data Explorer instance doesn't have a firewall that blocks access to Azure Managed Grafana. The Azure Data Explorer database needs to be exposed to the public internet.

## Dashboard import fails

The user gets an error when importing a dashboard from the gallery or a JSON file. An error message appears: **The dashboard has been changed by someone else**.

### Solution: edit dashboard name or UID

Most of the time this error occurs because the user is trying to import a dashboard that has the same name or unique identifier (UID) as another dashboard.

To check if your Azure Managed Grafana workspace already has a dashboard with the same name:

1. In your Grafana endpoint, select **Dashboards** from the navigation menu on the left and then **Browse**.
1. Review dashboard names.

   :::image type="content" source="media/troubleshoot/troubleshoot-dashboards-list.png" alt-text="Screenshot of the browser. Dashboard: browse.":::

1. Rename the old or the new dashboard.
1. You can also edit the UID of a JSON dashboard before importing it by editing the field named **uid** in the JSON file.

## Nothing changes after updating the managed identity role assignment

After disabling System-Assigned Managed Identity, the data source that has been configured with Managed Identity can still access the data from Azure services.

### Solution: wait for the change to take effect

Data sources configured with a managed identity may still be able to access data from Azure services for up to 24 hours. When a role assignment is updated in a managed identity for Azure Managed Grafana, this change can take up to 24 hours to be effective, due to limitations of managed identities.

## Next steps

> [!div class="nextstepaction"]
> [Support](./find-help-open-support-ticket.md)
