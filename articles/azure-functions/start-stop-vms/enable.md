---
title: Enable Start/Stop VMs (preview)
description: This article tells how to enable the Start/Stop VMs (preview) feature for your Azure VMs.
services: azure-functions
ms.subservice: 
ms.date: 03/12/2021
ms.topic: conceptual
---

# Enable Start/Stop VMs (preview)

Perform the steps in this topic in sequence to enable the Start/Stop VMs (preview) feature. After completing the setup process, configure the schedules to customize the feature.

The deployment is initiated from the Start/Stop VMs GitHub organization [here](https://github.com/microsoft/startstopv2-deployments/blob/main/README.md).

1. Select the deployment option based on the Azure cloud environment your Azure VMs are created in. This will open the custom Azure Resouce Manager deployment page in the Azure portal.
1. If prompted, sign in to the [Azure portal](https://portal.azure.com).
1. Enter the following values:

    |Name |Value |
    |-----|------|
    |Region |Select a region near you for new resources.|
    |Resource Group Name |Specify the resource group name that will contain the individual resources for Start/Stop VMs. |
    |Resource Group Region |Specify the region for the resource group. For example, **Central US**.|
    |Azure Function App Name |Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions. |
    |Application Insights Name |Specify the name of your Application Insights instance that will hold the analytics for Start/Stop VMs. |
    |Application Insights Region |Specify the region for the Application Insights instance.|
    |Storage Account Name |Specify the name of the Azure Storage account to store Start/Stop VMs execution telemetry. |
    |Email Address |Specify one or more email addresses to receive status notifications, separated by a comma (,).|

    :::image type="content" source="media/enable/deployment-template-details.png" alt-text="Start/Stop VMs template deployment configuration":::

1. Select **Review + create** on the bottom of the page.
1. Select **Create** to start the deployment.
1. Select the bell icon (notifications) from the top of the screen to see the deployment status. You shall see **Deployment in progress**. Wait until the deployment is completed.
1. Select **Go to resource group** from the notification pane. You shall see a screen similar to:

    :::image type="content" source="media/enable/deployment-results-resource-list.png" alt-text="Start/Stop VMs template deployment resource list":::

## Configure schedule

To manage the automation method to control the start and stop of your VMs, you configure one or more of the included logic apps based on your requirements.

- Scheduled - Start and stop actions are based on a schedule you specify against Azure Resource Manager and classic VMs.**ststv2_vms_Scheduled_start** and **ststv2_vms_Scheduled_stop** configure the scheduled start and stop.

- Sequenced - Start and stop actions are based on a schedule targeting VMs with pre-defined sequencing tags. Only two specifically named tags are supported - **sequencestart** and **sequencestop**. **ststv2_vms_Sequenced_start** and **ststv2_vms_Sequenced_stop** configure the sequenced start and stop.

    > [!NOTE]
    > This scenario only supports Azure Resource Manager VMs.

- AutoStop - This functionality is only used for performing a stop action against both Azure Resource Manager and classic VMs based on its CPU utilization. It can also be a scheduled-based *take action*, which creates alerts on VMs and based on the condition, the alert is triggered to perform the stop action.**ststv2_vms_AutoStop** configures the auto-stop functionality.

## Scheduled start and stop scenario

Perform the following steps to configure the scheduled start and stop action for VMs in a subscription, one or more resource groups, or VM list. For example, you can configure the **ststv2_vms_Scheduled_start** schedule to start them in the morning when you are in the office, and stop all VMs across a subscription when you leave work in the evening based on the **ststv2_vms_Scheduled_stop** schedule.

Configuring the logic app to just start the VMs is supported.

You can enable either targeting the action against a subscription, single or multiple resource groups, and specify one or more VMs. You cannot specify them together in the same logic app.

1. Sign in to the [Azure portal](https://portal.azure.com) and then navigate to **Logic apps**. 

1. From the list of Logic apps, to configure scheduled start, select **ststv2_vms_Scheduled_start**. To configure scheduled stop, select **ststv2_vms_Scheduled_stop**.

1. Select **Logic app designer** from the left-hand pane.

1. After Logic App Designer appears, in the designer pane, select **Recurrence** to configure the logic app schedule. To learn about the specific recurrence options, see [Schedule recurring task](../../connectors/connectors-native-recurrence.md#add-the-recurrence-trigger).

    :::image type="content" source="media/enable/schedule-recurrence-property.png" alt-text="Configure the recurrence frequency for logic app":::

1. In the designer pane, select **Function-Try** to configure the target settings. In the request body, if you want to manage VMs across all resource groups in the subscription, modify the request body as shown in the following example.

    ```json
    {
      "Action": "start",
      "EnableClassic": false,
      "RequestScopes": {
        "ExcludedVMLists": [],
        "Subscriptions": [
          "/subscriptions/12345678-1234-5678-1234-123456781234/"
        ]
     }
    }
    ```

    In the request body, if you want to manage VMs for specific resource groups, modify the request body as shown in the following example. Each resource path specified must be separated by a comma. You can specify one resource group if required.

    ```json
    {
      "Action": "start",
      "EnableClassic": false,
      "RequestScopes": {
        "ExcludedVMLists": [],
        "ResourceGroups": [
          "/subscriptions/12345678-1234-5678-1234-123456781234/resourceGroups/rg1/",
          "/subscriptions/12345678-1234-5678-1234-123456781234/resourceGroups/rg2/"
        ]
      }
    }
    ```

    In the request body, if you want to manage a specific set of VMs within the subscription, modify the request body as shown in the following example. Each resource path specified must be separated by a comma. You can specify one VM if required.

    ```json
    {
      "Action": "start",
      "EnableClassic": true,
      "RequestScopes": {
        "ExcludedVMLists": [],
        "VMLists": [
          "/subscriptions/12345678-1234-5678-1234-123456781234/resourceGroups/rg1/providers/Microsoft.Compute/virtualMachines/vm1",
          "/subscriptions/12345678-1234-5678-1234-123456781234/resourceGroups/rg2/providers/Microsoft.ClassicCompute/virtualMachines/vm2",
          "/subscriptions/12345678-1234-5678-1234-123456781234/resourceGroups/rg3/providers/Microsoft.Compute/virtualMachines/vm3"
        ]
    }
    ```

## Sequenced start and stop scenario

In an environment that includes two or more components on multiple VMs supporting a distributed workload, supporting the sequence in which components are started and stopped in order is important.

1. From the list of Logic apps, to configure sequenced start, select **ststv2_vms_Sequenced_start**. To configure sequenced stop, select **ststv2_vms_Sequenced_stop**.

1. Select **Logic app designer** from the left-hand pane.

1. After Logic App Designer appears, in the designer pane, select **Recurrence** to configure the logic app schedule. To learn about the specific recurrence options, see [Schedule recurring task](../../connectors/connectors-native-recurrence.md#add-the-recurrence-trigger).

    :::image type="content" source="media/enable/schedule-recurrence-property.png" alt-text="Configure the recurrence frequency for logic app":::

1. In the designer pane, select **Function-Try** to configure the target settings. In the request body, if you want to manage VMs across all resource groups in the subscription, modify the request body as shown in the following example.

    ```json
    {
      "Action": "start",
      "EnableClassic": false,
      "RequestScopes": {
        "ExcludedVMLists": [],
        "Subscriptions": [
          "/subscriptions/12345678-1234-5678-1234-123456781234/"
        ]
     },
       "Sequenced": true
    }
    ```

    In the request body, if you want to manage VMs for specific resource groups, modify the request body as shown in the following example. Each resource path specified must be separated by a comma. You can specify one resource group if required.

    ```json
    {
      "Action": "start",
      "EnableClassic": false,
      "RequestScopes": {
        "ExcludedVMLists": [],
        "ResourceGroups": [
          "/subscriptions/12345678-1234-5678-1234-123456781234/resourceGroups/rg1/",
          "/subscriptions/12345678-1234-5678-1234-123456781234/resourceGroups/rg2/"
        ],
        "ExcludedVMLists": [
         "/subscriptions/12345678-1111-2222-3333-1234567891234/resourceGroups/vmrg1/providers/Microsoft.Compute/virtualMachines/vm1"
        ]
      },
       "Sequenced": true
    }
    ```

    In the request body, if you want to manage a specific set of VMs within the subscription, modify the request body as shown in the following example. Each resource path specified must be separated by a comma. You can specify one VM if required.

    ```json
    {
      "Action": "start",
      "EnableClassic": true,
      "RequestScopes": {
        "ExcludedVMLists": [],
        "VMLists": [
          "/subscriptions/12345678-1234-5678-1234-123456781234/resourceGroups/rg1/providers/Microsoft.Compute/virtualMachines/vm1",
          "/subscriptions/12345678-1234-5678-1234-123456781234/resourceGroups/rg2/providers/Microsoft.ClassicCompute/virtualMachines/vm2",
          "/subscriptions/12345678-1234-5678-1234-123456781234/resourceGroups/rg3/providers/Microsoft.Compute/virtualMachines/vm3"
        ]
      },
       "Sequenced": true
    }
    ```

## Auto stop scenario

Start/Stop VMs can help manage the cost of running Azure Resource Manager and classic VMs in your subscription by evaluating machines that aren't used during non-peak periods, such as after hours, and automatically shutting them down if processor utilization is less than a specified percentage.

1. From the list of Logic apps, to configure auto stop, select **ststv2_vms_AutoStop**.

1. Select **Logic app designer** from the left-hand pane.

1. After Logic App Designer appears, in the designer pane, select **Recurrence** to configure the logic app schedule. To learn about the specific recurrence options, see [Schedule recurring task](../../connectors/connectors-native-recurrence.md#add-the-recurrence-trigger).

    :::image type="content" source="media/enable/schedule-recurrence-property.png" alt-text="Configure the recurrence frequency for logic app":::

1. In the designer pane, select **Function-Try** to configure the target settings. In the request body, if you want to manage VMs across all resource groups in the subscription, modify the request body as shown in the following example.

    ```json
    {
      "Action": "stop",
      "EnableClassic": false,    
      "AutoStop_MetricName": "Percentage CPU",
      "AutoStop_Condition": "LessThan",
      "AutoStop_Description": "Alert to stop the VM if the CPU % exceed the threshold",
      "AutoStop_Frequency": "00:05:00",
      "AutoStop_Severity": "2",
      "AutoStop_Threshold": "5",
      "AutoStop_TimeAggregationOperator": "Average",
      "AutoStop_TimeWindow": "06:00:00",
      "RequestScopes":{        
        "Subscriptions":[
            "/subscriptions/12345678-1111-2222-3333-1234567891234/",
            "/subscriptions/12345678-2222-4444-5555-1234567891234/"
        ],
        "ExcludedVMLists":[]
      }        
    }
    ```

    In the request body, if you want to manage VMs for specific resource groups, modify the request body as shown in the following example. Each resource path specified must be separated by a comma. You can specify one resource group if required.

    ```json
    {
      "Action": "stop",
      "AutoStop_Condition": "LessThan",
      "AutoStop_Description": "Alert to stop the VM if the CPU % exceed the threshold",
      "AutoStop_Frequency": "00:05:00",
      "AutoStop_MetricName": "Percentage CPU",
      "AutoStop_Severity": "2",
      "AutoStop_Threshold": "5",
      "AutoStop_TimeAggregationOperator": "Average",
      "AutoStop_TimeWindow": "06:00:00",
      "EnableClassic": true,
      "RequestScopes": {
        "ExcludedVMLists": [],
        "ResourceGroups": [
          "/subscriptions/12345678-1111-2222-3333-1234567891234/resourceGroups/vmrg1/",
          "/subscriptions/12345678-1111-2222-3333-1234567891234/resourceGroupsvmrg2/",
          "/subscriptions/12345678-2222-4444-5555-1234567891234/resourceGroups/VMHostingRG/"
          ]
      }
    }
    ```

    In the request body, if you want to manage a specific set of VMs within the subscription, modify the request body as shown in the following example. Each resource path specified must be separated by a comma. You can specify one VM if required.

    ```json
    {
      "Action": "stop",
      "AutoStop_Condition": "LessThan",
      "AutoStop_Description": "Alert to stop the VM if the CPU % exceed the threshold",
      "AutoStop_Frequency": "00:05:00",
      "AutoStop_MetricName": "Percentage CPU",
      "AutoStop_Severity": "2",
      "AutoStop_Threshold": "5",
      "AutoStop_TimeAggregationOperator": "Average",
      "AutoStop_TimeWindow": "06:00:00",
      "EnableClassic": true,
      "RequestScopes": {
        "ExcludedVMLists": [],
        "VMLists": [
          "/subscriptions/12345678-1111-2222-3333-1234567891234/resourceGroups/rg3/providers/Microsoft.ClassicCompute/virtualMachines/Clasyvm11",
          "/subscriptions/12345678-1111-2222-3333-1234567891234/resourceGroups/vmrg1/providers/Microsoft.Compute/virtualMachines/vm1"
        ]
      }
    }
    ```

## Next steps