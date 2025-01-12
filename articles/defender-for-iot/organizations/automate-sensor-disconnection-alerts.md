---
title: Set up automatic sensor disconnection notifications
description: This tutorial describes how to use the Microsoft Sentinel data connector and solution for Microsoft Defender for IoT to secure your entire  environment. Detect and respond to threats, including multistage attacks that may cross IT and OT boundaries.
ms.topic: tutorial
ms.date: 01/06/2025
ms.subservice: sentinel-integration
---

# Tutorial: Set up automatic sensor disconnection notifications with Microsoft Defender for IoT

This tutorial shows you how to create a [playbook](../../sentinel/tutorial-respond-threats-playbook.md) in Microsoft Sentinel that automatically sends an email notification when a sensor disconnects.

In this tutorial, you:

> [!div class="checklist"]
>
> * Create the playbook
> * Set up managed identity for your subscription 
> * Verify the sensor status

## Prerequisites

Before you start, make sure you have:

- **Read** and **Write** permissions on your Microsoft Sentinel workspace. For more information, see [Permissions in Microsoft Sentinel](../../sentinel/roles.md).

- Completed [Tutorial: Connect Microsoft Defender for IoT with Microsoft Sentinel](iot-solution.md).

- The subscription ID and the resource group for the relevant subscription. In the Azure portal **Subscriptions** page, copy the subscription ID and resource group and save them for a later stage.

## Create the playbook

1. In Microsoft Sentinel, select **Automation**.
1. In the **Automation** page, select **Create > Playbook with alert trigger**.
1. In the **Create playbook** page **Basics** tab, select the subscription and resource group running Microsoft Sentinel, and give the playbook a name.
1. Select **Next: Connections**.
1. In the **Connections** tab, select **Microsoft Sentinel > Connect with managed identity**.
1. Review the playbook information and select **Create playbook**.
    
    When the playbook is ready, Microsoft Sentinel displays a **Deployment successful** message and navigates to the **Logic app designer** page.

1. Select **Logic app code view**, modify these fields in the following code, and paste the code into the editor:
    - Under the `post` body, in the `To` field, type the email to which you want to receive the notifications.
    - Under the `office365` parameter:
        - Under the `id` field, replace `Replace with subscription` with the ID of the subscription running Microsoft Sentinel, for example:  
    
        ```json                      
        "id": "/subscriptions/exampleID/providers/Microsoft.Web/locations/eastus/managedApis/office365"
        ```

        - Under the `connectionId` field, replace `Replace with subscription` with your subscription ID, and replace `Replace with RG name` with your resource group name, for example:

        ```json           
         "connectionId": "/subscriptions/exampleID/resourceGroups/ExampleResourceGroup/providers/Microsoft.Web/connections/office365"
        ```

1. Select **Save**.
1. Go back to the **Logic app designer** to view the workflow that the playbook follows.

## Set up managed identity for your subscription

1. In the Azure portal, select **Subscriptions**.
1. Select the subscription running Microsoft Sentinel and select **Access Control (IAM)**.
1. Select **Add > Add Role Assignment**.
1. Search for the **Reader** role. 
1. In the **Role** tab, select **Next**.
1. In the **Members** tab, under **Assign access to**, select **Managed Identity**.
1. In the **Select Managed identities** window: 
    1. Under **Subscription**, select the subscription running Microsoft Sentinel.
    1. Under **Managed identity**, select **Logic app 5**.
    1. Under **Select**, select the name of the automation rule you created and select **Select**.
1. In the editor, select **HTTP2** and verify that the **Authentication Type** is set to **Managed Identity**. 

## Verify the sensor status 

If you can't create the playbook successfully, run a Keyword Query Language (KQL) query in Azure Resource Graph to confirm that the sensor is offline. 

1. In the Azure portal, search for *Azure resource graph explorer*.
1. Run the following query:

    ```kusto    
    iotsecurityresources  
    
    | where type =='microsoft.iotsecurity/locations/sites/sensors'  
    
    |extend Status=properties.sensorStatus  
    
    |extend LastConnectivityTime=properties.connectivityTime  
    
    |extend Status=iif(LastConnectivityTime<ago(5m),'Disconnected',Status)  
    
    |project SensorName=name, Status, LastConnectivityTime  
    
    |where Status == 'Disconnected' 
    ```

If the sensor has been offline for at least five minutes, the sensor status is **Disconnected**.  

> [!NOTE]
> It takes up to 15 minutes for the sensor to synchronize the status update with the cloud. This means that you should wait at least 15 minutes before checking the status.

## Next steps

> [!div class="nextstepaction"]
> [Visualize data](../../sentinel/get-visibility.md)

> [!div class="nextstepaction"]
> [Create custom analytics rules](../../sentinel/detect-threats-custom.md)

> [!div class="nextstepaction"]
> [Investigate incidents](../../sentinel/investigate-cases.md)

> [!div class="nextstepaction"]
> [Investigate entities](../../sentinel/entity-pages.md)

> [!div class="nextstepaction"]
> [Use playbooks with automation rules](../../sentinel/tutorial-respond-threats-playbook.md)

For more information, see our blog: [Defending Critical Infrastructure with the Microsoft Sentinel: IT/OT Threat Monitoring Solution](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/defending-critical-infrastructure-with-the-microsoft-sentinel-it/ba-p/3061184)
