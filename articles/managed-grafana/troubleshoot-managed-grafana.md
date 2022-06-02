---
title: 'Troubleshoot Azure Managed Grafana'
description: Troubleshoot Azure Managed Grafana issues related to fetching data, managing Managed Grafana dashboards, speed and more.
author: maud-lv
ms.author: malev
ms.topic: troubleshooting
ms.service: managed-grafana
ms.date: 05/30/2022
---

# Troubleshoot issues for Azure Managed Grafana

This article guides you to troubleshoot errors with Azure Managed Grafana, and suggests solutions to resolve them.

## Azure Managed Grafana dashboard panel doesn't display any data

One or several of your Managed Grafana dashboard panels show no data.

### Solution: review your dashboard settings

Context: Grafana dashboards are set up to fetch new data periodically. If the dashboard is refreshed too often for the underlying query to load, the panel will be stuck without ever being able to load and display data.

1. Check how frequently the dashboard is configured to refresh data?
   1. In your dashboard, go to **Dashboard settings**.
   1. In the general settings, lower the **Auto refresh** rate of the dashboard to be no faster than the time the query takes to load.
1. When a query takes too long to retrieve data. Grafana will automatically time out certain dependency calls that take longer than, for example, 30 seconds. Check that there are no unusual slow-downs on the query's end.

## Azure Monitor can't fetch data

Every Grafana instance comes pre-configured with an Azure Monitor data source. When trying to use a pre-provisioned dashboard, you find that the Azure Monitor data source can't fetch data.

### Solution: review your Azure Monitor Data settings

1. Find a pre-provisioned dashboard by opening your Managed Grafana endpoint and selecting **Dashboards** > **Browse**. Then select a dashboard, for example **Azure Monitor** > **Azure App monitoring - Application Insights**.
1. Make sure the dropdowns near the top are populated with a subscription, resource group and resource name. In the screenshot example below, the **Resource** dropdown is set to null. In this case, select a resource name. You may need to select another resource group that contains a type of resource the dashboard was designed for. In this example, you need to pick a resource group that has an Application Insights resource.

      :::image type="content" source="media/troubleshoot/troubleshooting-dashboard-resource.png" alt-text="Screenshot of the Managed Grafana workspace: Checking dashboard information":::

1. Open the Azure Monitor data source set-up page

   1. In your Managed Grafana endpoint, select **Configurations** in the left menu and select **Data Sources**.
   1. Select **Azure Monitor**

1. If the data source uses Managed Identity, then:

   1. Select the **Load Subscriptions** button to make a quick test. If **Default Subscription** is populated with your subscription, Managed Grafana can access Azure Monitor within this subscription. If not, then there are permission issues.

      :::image type="content" source="media/troubleshoot/troubleshooting-load-subscriptions.png" alt-text="Screenshot of the Managed Grafana workspace: Load subscriptions":::

   1. Check if the system assigned managed identity option is turned on in the Azure portal. If not, turn it on manually:
      1. Open your Managed Grafana instance in the Azure portal.
      1. In the left menu, under **Settings**, select **Identity**.
      1. Select **Status**: **On** and select **Save**

      :::image type="content" source="media/troubleshoot/troubleshooting-managed-identity.png" alt-text="Screenshot of the Azure platform: Turn on system-assigned managed identity" lightbox="media/troubleshoot/troubleshooting-managed-identity-expanded.png":::

   1. Check if the managed identity has the Monitoring Reader role assigned to the Managed Grafana instance. If not, add it manually from the Azure portal:
      1. Open your Managed Grafana instance in the Azure portal.
      1. In the left-menu, under **Settings**, select **Identity**.
      1. Select **Azure role assignments**.
      1. There should be a **Monitoring Reader** role displayed, assigned to your Managed Grafana instance. If not, select Add role assignment and add the **Monitoring Reader** role.

      :::image type="content" source="media/troubleshoot/troubleshooting-add-role-assignment.png" alt-text="Screenshot of the Azure platform: Adding role assignment":::

1. If the data source uses an **App Registration** authentication:
   1. In your Grafana endpoint, go to **Configurations > Data Sources > Azure Monitor** and check if the information for **Directory (tenant) ID** and **Application (client) ID** is correct.
   1. Check if the service principal has the Monitoring Reader role assigned to the Managed Grafana instance. If not, add it manually from the Azure portal.
   1. If needed, reapply the Client Secret

      :::image type="content" source="media/troubleshoot/troubleshooting-azure-monitor-app-registration.png" alt-text="Screenshot of the Managed Grafana workspace: Check app registration authentication details":::

## Azure Data Explorer can't fetch data

The Azure Data Explorer data source can't fetch data.

### Solution: review your Azure Data Explorer settings

1. Find a pre-provisioned dashboard by opening your Managed Grafana endpoint and selecting **Dashboards** > **Browse**. Then select a dashboard, for example **Azure Monitor** > **Azure Data Explorer Cluster Resource Insights**.
1. Make sure the dropdowns near the top are populated with a data source, subscription, resource group, name space, resource, and workspace. In the screenshot example below, we chose a resource group that doesn't contain any Data Explorer cluster. In this case, select another resource group that contains a Data Explorer cluster.

      :::image type="content" source="media/troubleshoot/troubleshooting-dashboard-data-explorer.png" alt-text="Screenshot of the Managed Grafana workspace: Checking dashboard information for Azure Data Explorer":::

1. Check the Azure Data Explorer data source and see how authentication is set up. You can currently only set up authentication for Azure Data Explorer through Azure Active Directory (Azure AD).
1. In your Grafana endpoint, go to **Configurations > Data Sources > Azure Data Explorer**
1. Check if the information listed for **Azure cloud**, **Cluster URL**, **Directory (tenant) ID**, **Application (client) ID**, and **Client secret** is correct. If needed, create a new key to add as a client secret.
1. At the top of the page, you can find instructions guiding you through the process to grant necessary permissions to this Azure AD app to read the Azure Data Explorer database.
1. Make sure that your Azure Data Explorer instance doesn't have a firewall that blocks access to Managed Grafana. The Azure Data Explorer database needs to be exposed to the public internet.

## Azure Managed Grafana instance creation fails

An error is displayed when creating a Managed Grafana workspace from the Azure portal.

### Solution 1: edit the instance name

If you get an error while filling out the form to create the Managed Grafana instance, you may have given an invalid name to your Grafana instance.

:::image type="content" source="media/troubleshoot/troubleshooting-instance-name-issue.png" alt-text="Screenshot of the Azure platform: Instance name error.":::

Enter a name that:

- Is unique in the entire Azure region. It can't already be used by another user.
- Is 30 characters long or smaller
- Begins with a letter. The rest can only be alphanumeric characters or hyphens, and the name must end with an alphanumeric character.

### Solution 2: review deployment error

1. Review the Managed Grafana deployment details and read the status message.

   :::image type="content" source="media/troubleshoot/troubleshooting-deployment-error.png" alt-text="Screenshot of the Azure platform: Instance deployment error." lightbox="media/troubleshoot/troubleshooting-deployment-error.png":::

1. Do the following action, depending on the error message:

- The status message states that the region isn't supported and provides a list of supported Azure regions. Try deploying a new Managed Grafana instance again. When trying to create a Managed Grafana instance for the first time, the Azure portal suggests Azure regions that are not available. These regions won't be displayed on your second try.
- The status message states that the role assignment update isn't permitted. The user isn't a subscription owner. If the resource deployment succeeded and the role assignment failed, ask someone with Owner or Administrator access control over your subscription to:

  - Assign the Monitoring reader role at the subscription level to the managed identity of the Grafana Workspace
  - Assign you a Grafana Admin role for this new Managed Grafana instance
- If status message mentions a conflict, then someone may have created another an instance with the same name at the same time, or the name check failed earlier, leading to a conflict later on. Delete this instance and create another one with a different name.

## User can't access their Managed Grafana workspace

The user has successfully created an Azure Managed Grafana instance but can't access their Managed Grafana workspace, when going to the endpoint URL.

### Solution 1: use an Azure AD account

Managed Grafana doesn't support Microsoft accounts. Log in with an Azure AD account instead.

### Solution 2: check the provisioning state

If you get a page with an error message such as "can't reach this page", stating that the page took too long to respond, follow the process below:

   :::image type="content" source="media/troubleshoot/troubleshoot-generic-browser-error.png" alt-text="Screenshot of a browser: can't reach page.":::

1. In the Azure platform, open your instance and go to the **Overview** page. Make sure that the **Provisioning State** is **Succeeded** and that all other fields in the **Essentials** section are populated. If everything seems good, continue to follow the process below. Otherwise, delete and recreate an instance.

   :::image type="content" source="media/troubleshoot/troubleshoot-healthy-instance.png" alt-text="Screenshot of a the Azure platform. Overview - Essentials.":::

1. If you saw several browser redirections and then landed on a generic browser error page as shown above, then it means there is a failure in the backend.

1. If you have a firewall blocking outbound traffic, allow access to your instance, to your URL ending in grafana.azure.com, and Azure AD.

### Solution 3: fix access role issues

If you get an error page stating "No Roles Assigned":

   :::image type="content" source="media/troubleshoot/troubleshoot-no-roles-assigned.png" alt-text="Screenshot of a the browser. No roles assigned.":::

This issue can happen in two ways:

1. You didn't have permission to add a **Grafana Admin** role for yourself. Refer to []() for more information.

1. You use the CLI, an ARM template or other another means to create the workspace that wasn't the Azure portal. Only the Azure portal will automatically add the user as a **Grafana Admin**. In all other cases, you must manually give yourself the **Grafana Admin** role.
   1. Go to the IAM blade for the Grafana Workspace to add this role assignment. You must be a subscription/resource administrator or owner to make this role assignment. Ask your administrator if you don't have sufficient access rights.
   1. Your account is a foreign account: the Grafana instance isn't registered in your home tenant.
   1. If you recently addressed this problem and have been assigned a sufficient Grafana role, you may need to wait for some time before the cookie expires and get refreshed. This normally takes 5 min. If in doubts, delete all cookies or start a private browser session to force a fresh new cookie with new role information.

## Next steps

> [!div class="nextstepaction"]
> [Configure data sources](./how-to-data-source-plugins-managed-identity.md)
