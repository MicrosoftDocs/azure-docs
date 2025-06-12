---
title: Send VMware syslogs to log management server using Azure Logic Apps
description: Learn how to use Azure Logic Apps to collect and send VMware syslogs from your Azure VMware Solution private cloud to any log management service of your choice.
ms.topic: how-to 
ms.service: azure-vmware
ms.date: 4/10/2025
ms.custom: engagement-fy25

#Customer intent: As an Azure service administrator, I want to use Azure Logic Apps to send VMware syslogs from my Azure VMware Solution private cloud to my preferred log management service for centralized logging and analysis.

---

# Send VMware syslogs to log management server using Azure Logic Apps

Azure Logic Apps enables you to automate workflows by integrating various Azure services and third-party applications. You can use Logic Apps to collect and forward VMware syslogs from your Azure VMware Solution private cloud to any log management service of your choice. This approach allows for centralized log storage, analysis, and monitoring across your preferred tools.

In this article, learn how to configure an Azure Logic Apps workflow to capture VMware syslogs and send them to your chosen log management service.

:::image type="content" source="media/logs-to-logic-app/logic-app-arch-diagram.png" alt-text="Architecture flow of Azure VMware Solution logs to syslog server via Azure Logic Apps." border="false"  lightbox="media/logs-to-logic-app/logic-app-arch-diagram.png":::

## Prerequisites

Make sure you have an Azure VMware Solution private cloud set up that is streaming its syslogs to an Azure Event Hubs instance. 

[Configure VMware syslogs - Stream to Microsoft Azure Event Hubs](/azure/azure-vmware/configure-vmware-syslogs#stream-to-microsoft-azure-event-hubs).

## Create an Azure Logic Apps instance

1. From your Azure portal, select **Create a resource**, then search for **Logic App**. Find the one called **Logic App**, select **Create**, then click **Logic App**.

:::image type="content" source="media/logs-to-logic-app/logs-to-logic-app-1.png" alt-text="Screenshot showing where to procure an instance of Azure Logic Apps." border="false"  lightbox="media/logs-to-logic-app/logs-to-logic-app-1.png":::

2. Select the Hosting plan that makes the most sense for your consumption needs. In most cases, the **Workflow Service Plan** should suffice.

:::image type="content" source="media/logs-to-logic-app/logs-to-logic-app-2.png" alt-text="Screenshot showing which hosting option of Azure Logic Apps to select." border="false"  lightbox="media/logs-to-logic-app/logs-to-logic-app-2.png":::

3. Enter the Subscription you intend to use, the Resource Group chosen to house this instance. Give it a name and select a region. The default Windows plan is **Workflow Standard WS1 (210 total ACU, 3.5 Gb memory, 1 vCPU)** which should be enough to handle log volumes from large workloads. This option can always be adjusted later, as needed. After filing these details, select **Review + create**.

:::image type="content" source="media/logs-to-logic-app/logs-to-logic-app-3.png" alt-text="Screenshot showing the fields that need to be populated when creating an Azure Logic App." border="false"  lightbox="media/logs-to-logic-app/logs-to-logic-app-3.png":::

4. Review the details of the Logic App instance. Select **Create**. Clicking this button initializes the deployment of the Logic App instance. Once complete, the deployment status will read "Your deployment is complete".

:::image type="content" source="media/logs-to-logic-app/logs-to-logic-app-4.png" alt-text="Screenshot showing the summary of the Logic App creation." border="false"  lightbox="media/logs-to-logic-app/logs-to-logic-app-4.png":::

## Set up the Azure Logic App workflow

1. Once deployed, navigate to the Logic App instance. Select **Workflows**, then click on **Workflows**. Select **Add**, then click on **Add from Template**. This action takes you to the template catalog available in Azure Logic Apps. 

:::image type="content" source="media/logs-to-logic-app/logs-to-logic-app-5.png" alt-text="Screenshot showing the Workflows blade of Azure Logic App." border="false"  lightbox="media/logs-to-logic-app/logs-to-logic-app-5.png":::

2. In the search bar, search for **Azure VMware Solution**. Click on the option called **Azure VMware Solution: Export private cloud logs to log management solution**.

:::image type="content" source="media/logs-to-logic-app/logs-to-logic-app-6.png" alt-text="Screenshot showing Azure VMware Solution option under Workflow templates in the Logic App." border="false"  lightbox="media/logs-to-logic-app/logs-to-logic-app-6.png":::

3. On the right hand pane, select **Use this template** at the bottom of the screen. Give the workflow a name and select **Stateful** for State type. 

:::image type="content" source="media/logs-to-logic-app/logs-to-logic-app-7.png" alt-text="Screenshot showing the Workflow name and State type for the Azure VMware Solution template." border="false"  lightbox="media/logs-to-logic-app/logs-to-logic-app-7.png":::

4. Next, connect the Event Hub that houses the Azure VMware Solution logs to this Logic App instance. To do so, click **Connect**. Provide a name for Connection Name, Authentication Type will remain Access Key. For Connection String, you need to retrieve the Connection String from the Event Hub instance you intend to use. 

:::image type="content" source="media/logs-to-logic-app/logs-to-logic-app-8.png" alt-text="Screenshot showing the Event Hubs connection portion of the Azure VMware Solution template." border="false"  lightbox="media/logs-to-logic-app/logs-to-logic-app-8.png":::

5. In a separate browser tab, open the Event Hub instance that contains the log messages. Select **Settings**, then click on **Shared access policies**. Select **RootManagerSharedAccessKey** and click on the copy icon next to **Primary connection string**.
    
:::image type="content" source="media/logs-to-logic-app/logs-to-logic-app-9.png" alt-text="Screenshot showing the Primary connection string on Azure Event Hub." border="false"  lightbox="media/logs-to-logic-app/logs-to-logic-app-9.png":::

6. Navigate back to the browser tab with the Logic App and paste what you just copied into the **Connection String** field. Click **Add Connection**.

:::image type="content" source="media/logs-to-logic-app/logs-to-logic-app-10.png" alt-text="Screenshot showing the pasting of the Primary connection string on Azure Logic Apps template." border="false"  lightbox="media/logs-to-logic-app/logs-to-logic-app-10.png":::

7.  If added successfully, the Status for the Event Hub should read **Connected**. At this point, click **Next** to proceed forward.

:::image type="content" source="media/logs-to-logic-app/logs-to-logic-app-11.png" alt-text="Screenshot showing successful Connected message on Azure Logic Apps template." border="false"  lightbox="media/logs-to-logic-app/logs-to-logic-app-11.png":::

8. Add the name of the event hub instance under **Event hub name**. The exact name of the Event hub can be found under **Entities**, then **Event Hubs** in your Event Hub tab. Add the URI of the log server you intend to use under **Log destination URI**. Click **Next**.

:::image type="content" source="media/logs-to-logic-app/logs-to-logic-app-12.png" alt-text="Screenshot showing the necessary parameters needed for the Azure Logic App template." border="false"  lightbox="media/logs-to-logic-app/logs-to-logic-app-12.png":::

9. Finally, review the information provided, then click **Create**. This action saves the workflow that can be used to send the log messages from Azure VMware Solution to any syslog endpoint.

:::image type="content" source="media/logs-to-logic-app/logs-to-logic-app-13.png" alt-text="Screenshot showing the review page before creating the Azure Logic App template." border="false"  lightbox="media/logs-to-logic-app/logs-to-logic-app-13.png":::

## Adding certificates, updating HTTP headers, and configuring notifications

### Certificates
If Azure Logic Apps requires the certificate from the log management server to be trusted, you may need to add the certificate to the Logic Apps instance to enable successful log transmission. This is a necessary step when using tools such as VMware Cloud Foundation Operations for Logs, for example. You may add this to the Azure Logic App instance using the following approach: 

1. Export the certificate from the log management server and save it as a .cer file. 

2. In the Azure Logic App, navigate to  **Settings > Certificates**. Navigate to the tab that says **Public key certificates (.cer)** and click on **Add certificate**. 

:::image type="content" source="media/logs-to-logic-app/logs-to-logic-app-14.png" alt-text="Screenshot showing where to add the Public key certificate in the Azure Logic App instance." border="false"  lightbox="media/logs-to-logic-app/logs-to-logic-app-14.png":::

3. Upload the certificate from Step 1 to **CER certificate file** and give the certificate a name, then click **Add** at the bottom.

:::image type="content" source="media/logs-to-logic-app/logs-to-logic-app-15.png" alt-text="Screenshot showing where to add the Public key certificate in the Azure Logic App instance and giving it a name." border="false"  lightbox="media/logs-to-logic-app/logs-to-logic-app-15.png":::

4. Once saved, copy the **Thumbprint** value. We need that for our environment variable in Step 5. 

:::image type="content" source="media/logs-to-logic-app/logs-to-logic-app-16.png" alt-text="Screenshot showing where to copy the thumbprint of the newly added certificate." border="false"  lightbox="media/logs-to-logic-app/logs-to-logic-app-16.png":::

5. Under **Settings**, select **Environment variables**, then select **Add**. The name of the environment variable to add is **WEBSITE_LOAD_ROOT_CERTIFICATES** and the value is going to be the thumbprint you copied. Select **Apply** at the bottom of the panel to save the changes and **Apply** again at the bottom of the list of environment variables to apply these changes. The new environment variable should take effect.

:::image type="content" source="media/logs-to-logic-app/logs-to-logic-app-17.png" alt-text="Screenshot showing the successfully added environment variable." border="false"  lightbox="media/logs-to-logic-app/logs-to-logic-app-17.png":::

### HTTP Headers
By default, the **HTTP-Trigger-to-Log-Destination** trigger in the workflow you created has the following key-value pairs under Headers: 
 - **Content-Type** : **application/json**

This works by itself for log management tools such as VMware Cloud Foundation Operations for Logs. You may need to verify the log management server's ingestion cURL command to see if there are other headers that may need to be added. If you see other headers, add them here and click **Save** at the top, so that the logs can be ingested properly into your log management server. 

:::image type="content" source="media/logs-to-logic-app/logs-to-logic-app-18.png" alt-text="Screenshot showing where headers can be modified inside the workflow." border="false"  lightbox="media/logs-to-logic-app/logs-to-logic-app-18.png":::

### Run History
The Run History section of a workflow in Azure Logic Apps provides a detailed log of workflow executions, helping you track successful runs, diagnose failures, and troubleshoot issues. By reviewing the timestamps, status codes, and error messages, you can ensure your Azure VMware Solution syslog forwarding process is running smoothly and quickly identify any disruptions.

:::image type="content" source="media/logs-to-logic-app/logs-to-logic-app-20.png" alt-text="Screenshot showing Run History can be accessed." border="false"  lightbox="media/logs-to-logic-app/logs-to-logic-app-20.png":::

### Configuring Notifications
You will notice in the last step of the workflow that there is an optional item called **Optional-Notification (README)**. You may replace this item with one of the available actions in Azure Logic Apps, such as Outlook emails or Teams messages, to notify you in the event there is a failure sending your logs to your log management server.

:::image type="content" source="media/logs-to-logic-app/logs-to-logic-app-19.png" alt-text="Screenshot showing where notifications can be added inside the workflow." border="false"  lightbox="media/logs-to-logic-app/logs-to-logic-app-19.png":::
