---
title: Deploy Start/Stop VMs v2 (preview)
description: This article tells how to deploy the Start/Stop VMs v2 (preview) feature for your Azure VMs in your Azure subscription.
services: azure-functions
ms.subservice: start-stop-vms
ms.date: 06/25/2021
ms.topic: conceptual
---

# Deploy Start/Stop VMs v2 (preview)

Perform the steps in this topic in sequence to install the Start/Stop VMs v2 (preview) feature. After completing the setup process, configure the schedules to customize it to your requirements.

> [!NOTE]
> If you run into problems during deployment, you encounter an issue when using Start/Stop VMs v2 (preview), or if you have a related question, you can submit an issue on [GitHub](https://github.com/microsoft/startstopv2-deployments/issues). Filing an Azure support incident from the [Azure support site](https://azure.microsoft.com/support/options/) is not available for this preview version. 

> [!NOTE]
> By design the solution allows those with appropriate RBAC (Role-Based Access Control) permission on the Start/Stop V2 deployment to add, remove and manage schedules for virtual machines under the scope of the Start/Stop V2. In practice this means a user who does not have direct RBAC permission on a virtual machine could still create start, stop and autostop operations on that virtual machine if they have the RBAC permission to modify the Start/Stop V2 solution managing it.
> In addition to being able to indirectly act on virtual machines, any users with access to the Start/Stop V2 solution could also uncover cost, savings, operation history, and other data which is stored in the Start/Stop V2 application insights instance.
> Due to this design, the person managing the Start/Stop V2 solution should be mindful of who has permission to the Start/Stop V2 solution, especially if those users do not have permission to directly modify the target virtual machines.

## Deploy feature

The deployment is initiated from the Start/Stop VMs v2 GitHub organization [here](https://github.com/microsoft/startstopv2-deployments/blob/main/README.md). While this feature is intended to manage all of your VMs in your subscription across all resource groups from a single deployment within the subscription, you can install another instance of it based on the operations model or requirements of your organization. It also can be configured to centrally manage VMs across multiple subscriptions.

To simplify management and removal, we recommend you deploy Start/Stop VMs v2 (preview) to a dedicated resource group.

> [!NOTE]
> Currently this preview does not support specifying an existing Storage account or Application Insights resource.

1. Open your browser and navigate to the Start/Stop VMs v2 [GitHub organization](https://github.com/microsoft/startstopv2-deployments/blob/main/README.md).
1. Select the deployment option based on the Azure cloud environment your Azure VMs are created in. This will open the custom Azure Resource Manager deployment page in the Azure portal.
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

    :::image type="content" source="media/deploy/deployment-template-details.png" alt-text="Start/Stop VMs template deployment configuration":::

1. Select **Review + create** on the bottom of the page.
1. Select **Create** to start the deployment.
1. Select the bell icon (notifications) from the top of the screen to see the deployment status. You shall see **Deployment in progress**. Wait until the deployment is completed.
1. Select **Go to resource group** from the notification pane. You shall see a screen similar to:

    :::image type="content" source="media/deploy/deployment-results-resource-list.png" alt-text="Start/Stop VMs template deployment resource list":::

> [!NOTE]
> The naming format for the function app and storage account has changed. To guarantee global uniqueness, a random and unique string is now appended to the names of these resource.

> [!NOTE]
> We are collecting operation and heartbeat telemetry to better assist you if you reach the support team for any troubleshooting. We are also collecting virtual machine event history to verify when the service acted on a virtual machine and how long a virtual machine was snoozed in order to determine the efficacy of the service.

## Enable multiple subscriptions

After the Start/Stop deployment completes, perform the following steps to enable Start/Stop VMs v2 (preview) to take action across multiple subscriptions.

1. Copy the value for the Azure Function App Name that you specified during the deployment.

1. In the portal, navigate to your secondary subscription. Select the subscription, and then select **Access Control (IAM)**

1. Select **Add** and then select **Add role assignment**.

1. Select the **Contributor** role from the **Role** drop down list.

1. Enter the Azure Function Application Name in the **Select** field. Select the function name in the results.

1. Select **Save** to commit your changes.

## Configure schedules overview

To manage the automation method to control the start and stop of your VMs, you configure one or more of the included logic apps based on your requirements.

- Scheduled - Start and stop actions are based on a schedule you specify against Azure Resource Manager and classic VMs.**ststv2_vms_Scheduled_start** and **ststv2_vms_Scheduled_stop** configure the scheduled start and stop.

- Sequenced - Start and stop actions are based on a schedule targeting VMs with pre-defined sequencing tags. Only two named tags are supported - **sequencestart** and **sequencestop**. **ststv2_vms_Sequenced_start** and **ststv2_vms_Sequenced_stop** configure the sequenced start and stop.

    > [!NOTE]
    > This scenario only supports Azure Resource Manager VMs.

- AutoStop - This functionality is only used for performing a stop action against both Azure Resource Manager and classic VMs based on its CPU utilization. It can also be a scheduled-based *take action*, which creates alerts on VMs and based on the condition, the alert is triggered to perform the stop action.**ststv2_vms_AutoStop** configures the auto-stop functionality.

If you need additional schedules, you can duplicate one of the Logic Apps provided using the **Clone** option in the Azure portal.

:::image type="content" source="media/deploy/logic-apps-clone-option.png" alt-text="Select the Clone option to duplicate a logic app":::

## Scheduled start and stop scenario

Perform the following steps to configure the scheduled start and stop action for Azure Resource Manager and classic VMs. For example, you can configure the **ststv2_vms_Scheduled_start** schedule to start them in the morning when you are in the office, and stop all VMs across a subscription when you leave work in the evening based on the **ststv2_vms_Scheduled_stop** schedule.

Configuring the logic app to just start the VMs is supported.

For each scenario, you can target the action against one or more subscriptions, single or multiple resource groups, and specify one or more VMs in an inclusion or exclusion list. You cannot specify them together in the same logic app.

1. Sign in to the [Azure portal](https://portal.azure.com) and then navigate to **Logic apps**.

1. From the list of Logic apps, to configure scheduled start, select **ststv2_vms_Scheduled_start**. To configure scheduled stop, select **ststv2_vms_Scheduled_stop**.

1. Select **Logic app designer** from the left-hand pane.

1. After Logic App Designer appears, in the designer pane, select **Recurrence** to configure the logic app schedule. To learn about the specific recurrence options, see [Schedule recurring task](../../connectors/connectors-native-recurrence.md#add-the-recurrence-trigger).

    :::image type="content" source="media/deploy/schedule-recurrence-property.png" alt-text="Configure the recurrence frequency for logic app":::

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

    Specify multiple subscriptions in the `subscriptions` array with each value separated by a comma as in the following example.

    ```json
    "Subscriptions": [
          "/subscriptions/12345678-1234-5678-1234-123456781234/",
          "/subscriptions/11111111-0000-1111-2222-444444444444/"
        ]
    ```

    In the request body, if you want to manage VMs for specific resource groups, modify the request body as shown in the following example. Each resource path specified must be separated by a comma. You can specify one resource group or more if required.

    This example also demonstrates excluding a virtual machine. You can exclude the VM by specifying the VMs resource path or by wildcard.

    ```json
    {
      "Action": "start",
      "EnableClassic": false,
      "RequestScopes": {
        "ResourceGroups": [
          "/subscriptions/12345678-1234-5678-1234-123456781234/resourceGroups/rg1/",
          "/subscriptions/11111111-0000-1111-2222-444444444444/resourceGroups/rg2/"
        ],
        "ExcludedVMLists": [
         "/subscriptions/12345678-1111-2222-3333-1234567891234/resourceGroups/vmrg1/providers/Microsoft.Compute/virtualMachines/vm1"
        ]
      }
    }
    ```

    Here the action will be performed on all the VMs except on the VM name starts with Az and Bz in both subscriptions.

    ```json
    {
      "Action": "start",
      "EnableClassic": false,
      "RequestScopes": {
        "ExcludedVMLists": [“Az*”,“Bz*”],
       "Subscriptions": [
          "/subscriptions/12345678-1234-5678-1234-123456781234/",
          "/subscriptions/11111111-0000-1111-2222-444444444444/"
    
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
          "/subscriptions/12345678-1234-5678-1234-123456781234/resourceGroups/rg3/providers/Microsoft.Compute/virtualMachines/vm2",
          "/subscriptions/11111111-0000-1111-2222-444444444444/resourceGroups/rg2/providers/Microsoft.ClassicCompute/virtualMachines/vm30"
          
        ]
    }
    ```

## Sequenced start and stop scenario

In an environment that includes two or more components on multiple Azure Resource Manager VMs in a distributed application architecture, supporting the sequence in which components are started and stopped in order is important.

1. From the list of Logic apps, to configure sequenced start, select **ststv2_vms_Sequenced_start**. To configure sequenced stop, select **ststv2_vms_Sequenced_stop**.

1. Select **Logic app designer** from the left-hand pane.

1. After Logic App Designer appears, in the designer pane, select **Recurrence** to configure the logic app schedule. To learn about the specific recurrence options, see [Schedule recurring task](../../connectors/connectors-native-recurrence.md#add-the-recurrence-trigger).

    :::image type="content" source="media/deploy/schedule-recurrence-property.png" alt-text="Configure the recurrence frequency for logic app":::

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

    Specify multiple subscriptions in the `subscriptions` array with each value separated by a comma as in the following example.

    ```json
    "Subscriptions": [
          "/subscriptions/12345678-1234-5678-1234-123456781234/",
          "/subscriptions/11111111-0000-1111-2222-444444444444/"
        ]
    ```

    In the request body, if you want to manage VMs for specific resource groups, modify the request body as shown in the following example. Each resource path specified must be separated by a comma. You can specify one resource group if required.

    This example also demonstrates excluding a virtual machine by its resource path compared to the example for scheduled start/stop, which used wildcards.

    ```json
    {
      "Action": "start",
      "EnableClassic": false,
      "RequestScopes": {
        "ResourceGroups": [
          "/subscriptions/12345678-1234-5678-1234-123456781234/resourceGroups/rg1/",
          "/subscriptions/11111111-0000-1111-2222-444444444444/resourceGroups/rg2/"
        ],
        "ExcludedVMLists": [
         "/subscriptions/12345678-1111-2222-3333-1234567891234/resourceGroups/vmrg1/providers/Microsoft.Compute/virtualMachines/vm1"
        ]
      },
       "Sequenced": true
    }
    ```

    In the request body, if you want to manage a specific set of VMs within a subscription, modify the request body as shown in the following example. Each resource path specified must be separated by a comma. You can specify one VM if required.

    ```json
    {
      "Action": "start",
      "EnableClassic": true,
      "RequestScopes": {
        "ExcludedVMLists": [],
        "VMLists": [
          "/subscriptions/12345678-1234-5678-1234-123456781234/resourceGroups/rg1/providers/Microsoft.Compute/virtualMachines/vm1",
          "/subscriptions/12345678-1234-5678-1234-123456781234/resourceGroups/rg2/providers/Microsoft.ClassicCompute/virtualMachines/vm2",
          "/subscriptions/11111111-0000-1111-2222-444444444444/resourceGroups/rg2/providers/Microsoft.ClassicCompute/virtualMachines/vm30"
        ]
      },
       "Sequenced": true
    }
    ```

## Auto stop scenario

Start/Stop VMs v2 (preview) can help manage the cost of running Azure Resource Manager and classic VMs in your subscription by evaluating machines that aren't used during non-peak periods, such as after hours, and automatically shutting them down if processor utilization is less than a specified percentage.

The following metric alert properties in the request body support customization:

- AutoStop_MetricName
- AutoStop_Condition
- AutoStop_Threshold
- AutoStop_Description
- AutoStop_Frequency
- AutoStop_Severity
- AutoStop_Threshold
- AutoStop_TimeAggregationOperator
- AutoStop_TimeWindow

To learn more about how Azure Monitor metric alerts work and how to configure them see [Metric alerts in Azure Monitor](../../azure-monitor/alerts/alerts-metric-overview.md).

1. From the list of Logic apps, to configure auto stop, select **ststv2_vms_AutoStop**.

1. Select **Logic app designer** from the left-hand pane.

1. After Logic App Designer appears, in the designer pane, select **Recurrence** to configure the logic app schedule. To learn about the specific recurrence options, see [Schedule recurring task](../../connectors/connectors-native-recurrence.md#add-the-recurrence-trigger).

    :::image type="content" source="media/deploy/schedule-recurrence-property.png" alt-text="Configure the recurrence frequency for logic app":::

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

To learn how to monitor status of your Azure VMs managed by the Start/Stop VMs v2 (preview) feature and perform other management tasks, see the [Manage Start/Stop VMs](manage.md) article.
