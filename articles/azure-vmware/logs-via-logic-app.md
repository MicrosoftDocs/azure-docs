---
title: Send VMware syslogs to log management server using Azure Logic Apps
description: Learn how to use Azure Logic Apps to collect and send VMware syslogs from your Azure VMware Solution private cloud to any log management service of your choice.
ms.topic: how-to 
ms.service: azure-vmware
ms.date: 3/21/2025
ms.custom: engagement-fy25

#Customer intent: As an Azure service administrator, I want to use Azure Logic Apps to send VMware syslogs from my Azure VMware Solution private cloud to my preferred log management service for centralized logging and analysis.

---

# Send VMware syslogs to log management server using Azure Logic Apps

Azure Logic Apps enables you to automate workflows by integrating various Azure services and third-party applications. You can use Logic Apps to collect and forward VMware syslogs from your Azure VMware Solution private cloud to any log management service of your choice. This allows for centralized log storage, analysis, and monitoring across your preferred tools.

In this article, learn how to configure an Azure Logic Apps workflow to capture VMware syslogs and send them to your chosen log management service.

## Prerequisites

Make sure you have an Azure VMware Solution private cloud set up that is streaming its syslogs to an Azure Event Hubs instance. For more information, see
[Configure VMware syslogs - Stream to Microsoft Azure Event Hubs](https://learn.microsoft.com/en-us/azure/azure-vmware/configure-vmware-syslogs#stream-to-microsoft-azure-event-hubs).

## Create an Azure Logic Apps instance

1. From your Azure Portal, select **Create a resource**, then search for **Logic App**. Find the one called **Logic App**, select **Create**, then click **Logic App**.

2. Select the Hosting plan that makes the most sense for your consumption needs. In most cases, the **Workflow Service Plan** should suffice.

3. Enter the Subscription you intend to use, the Resource Group chosen to house this instance. Give it a name and select a region. The default Pricing plan is **Workflow Standard WS1 (210 total ACU, 3.5 Gb memory, 1 vCPU)** which should handle large workloads. This can always adjust this later, as needed. After filing these details, select **Review + create**.

4. Review the details of the Logic App instance. Select **Create**. This will initialize the deployment of the Logic App instance. Once complete, the deployment status will read "Your deployment is complete".


## Set up the Azure Logic App workflow

1. Once deployed, navigate to the Logic App instance. Select **Workflows**, then click on **Workflows**.

2. Select **Add**, then click on **Add from Template**. This will take you to the template catalog available in Azure Logic Apps. 

3. In here, search for **Azure VMware Solution**. Click on the option called **Azure VMware Solution: Export private cloud logs to log management solution**.

4. On the right hand pane, select **Use this template** at the bottom of the screen. Give the workflow a name and select **Stateful** for State type. 

5. Next, connect the Event Hub that houses the Azure VMware Solution logs to this Logic App instance. To do so, click **Connect**. Provide a name for Connection Name, Authentication Type will remain Access Key. For Connection String, you need to retrieve the Connection String from the Event Hub instance you intend to use. 
    a. In a separate brower tab, open the Event Hub instance that contains the log messages. 
    b. Select **Settings**, then click on **Shared access policies**.
    c. Select **RootManagerSharedAccessKey** and click on the copy icon next to **Primary connection string**.
    d. Navigate back to the browser tab with the Logic App and paste what you just copied into the **Connection String** field. Click **Add Connection**, then click **Next**. 
    e. Add the name of the event hub instance under **Event hub name**. The exact name of the Event hub can be found under **Entities**, then **Event Hubs** in your Event Hub tab.
    f. Add the URI of the log server you intend to use under **Log destination URI**. Click **Next**, then click **Create**. This will now save the workflow that can be used to send the log messages from Azure VMware Solution to any syslog endpoint.

## (Optional) Adding certificates, updating HTTP header, and configuring notifications

### Certificates
If Azure Logic Apps requires that the certificate from the log management server be recognizable, you may need to add this in the Logic Apps instance for the log transmission to work. This is a necessary step when using tools such as VMware Cloud Foundation Operations for Logs, for example. You may add this to the Azure Logic App instance using the following approach: 

1. Export the certificate from the log management server and save it as a .cer file. 

2. Under the Azure Logic App, select **Settings**, then click on **Certificates**. Navigate to the tab that says **Public key certificates (.cer)** and click on **Add certificate**. 

3. Upload the certificate from Step 1 to **CER certificate file** and give the certificate a name, then click **Add** at the bottom. Once saved, copy the **Thumbprint** value. We will need that to for our environment variable in Step 4. 

4. Under **Settings**, select **Environment variables**, then select **Add**. The name of the environment variable to add is **WEBSITE_LOAD_ROOT_CERTIFICATES** and the value is going to be the thumbprint you just copied. Select **Apply** at the bottom of the panel to save the changes and **Apply** again at the bottom of the list of environment variables to apply these changes. The new environment variable should take effect. 


### HTTP Headers
By default, the **HTTP-Trigger-to-Log-Destination** trigger in the workflow you created has the following key-value pairs under Headers: 
 - **Content-Type** : **application/json**

This will work by itself for log management tools such as VMware Cloud Foundation Operations for Logs. You may need to verify the log management server's ingestion cURL command to see if there are other headers that may need to be added. If you see other ones, please add them here and click **Save** at the top, so that the logs can be ingested properly into you log management server. 

### Configuring Notifications
You will notice in the last step of the workflow that there is an optional item called **Optional-Notification (README)**. You may replace this item with one of the plethora of triggers available in Azure Logic Apps, such as Outlook emails or Teams messages, to notify you in the event there is a failure sending your logs to your log management server.