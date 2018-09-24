---
title: Build workflows with the IoT Central connector in Microsoft Flow | Microsoft Docs
description: Use the IoT Central connector in Microsoft Flow to trigger workflows and create, update, and delete devices in workflows.
services: iot-central
author: viv-liu
ms.author: viviali
ms.date: 09/18/2018
ms.topic: conceptual
ms.service: iot-central
manager: peterpr
---

# Build workflows with the IoT Central connector in Microsoft Flow

*This topic applies to builders and administrators.*

Use Microsoft Flow to automate workflows across the many applications and services that business users rely on. Using the IoT Central connector in Microsoft Flow, you can trigger workflows when a rule is triggered in IoT Central. In a workflow triggered by IoT Central or any other application, you can use the actions in the IoT Central connector to create a device, update a device's properties and settings, or delete a device. Check out [these Microsoft Flow templates](https://aka.ms/iotcentralflowtemplates) that connect IoT Central to other services such as mobile notifications and Microsoft Teams.

> [!NOTE] 
> You'll need to sign into Microsoft Flow with a Microsoft personal or work or school account. Learn more about Microsoft Flow plans [here](https://aka.ms/microsoftflowplans).

## Trigger a workflow when a rule is triggered

This section shows you how to trigger a mobile notification in the Flow mobile app when a rule is triggered in IoT Central.

1. Start by [creating a rule in IoT Central](howto-create-telemetry-rules.md). After you save the rule conditions, click the **Microsoft Flow action** as a new action. A new tab or window should open in your browser, taking you into Microsoft Flow.

    ![Create a new Microsoft Flow action](media/howto-add-microsoft-flow/createflowaction.PNG)

1. Sign into Microsoft Flow. This doesn't need to be the same account as the one that you use in IoT Central. You'll land on an overview page showing an IoT Central connector connecting to a custom action.

1. Sign into the IoT Central connector and click **Continue**. You are taken to the Microsoft Flow designer to build your workflow. The workflow has an IoT Central trigger that has your Application and Rule already filled in.

1. Choose **+ New Step** and **Add an action**. At this point you can add any action you want to your workflow. As an example, let's send a mobile notification. Search for **notification**, and choose **Notifications - Send me a mobile notification**.

1. In the action, fill in the Text field with what you want your notification to say. You can include *Dynamic content* from your IoT Central rule, passing along important information such as device name and timestamp to your notification.

    > [!NOTE]
    > Click the "See more" text in the Dynamic content window to get measurement and property values that triggered the rule.

    ![Flow editing action with dynamic pane open](./media/howto-add-microsoft-flow/flowdynamicpane.PNG)

1. When you are done editing your action, click **Save**. You'll be directed to your workflow's overview page. Here you can see the run history and share it with other colleagues.

    > [!NOTE]
    > If you want other users in your IoT Central app to edit this rule, you must share it with them in Microsoft Flow. Add their Microsoft Flow accounts as owners in your workflow.

1. If you go back to your IoT Central app, you'll see this rule has a Microsoft Flow action under the Actions area.

You can always start building a workflow using the IoT Central connector in Microsoft Flow. You can then choose which IoT Central app and which rule to connect to.

## Create a device in a workflow

This section shows you how to create a new device in IoT Central at the push of a button on a mobile device using the Microsoft Flow mobile app. You can use this action in Flow to integrate ERP systems like Dynamics with IoT Central by creating a new device when a device is added elsewhere.

1. Start by creating a blank workflow in Microsoft Flow.

1. Search for **Flow button for mobile** as a trigger.

1. In this trigger, add a text input called **Device name**. Change the description text to be **Enter the device name of your new device**.

1. Add a new action. Search for the **Azure IoT Central - Create a device** action.

1. Pick your application, and choose a device template to create a device from in the dropdowns. You'll see the action expand to show all the properties and settings of the device.

1. Select the Device Name field. From the dynamic content pane, choose **Device Name**. This value will be passed from the input the user enters through the mobile app, and will be the name of your new device in IoT Central. In this example, the only required field is the device name, indicated by the red asterisk. Another device template may have multiple required fields that need to be filled in to create a new device.

    ![Flow create device action dynamic pane](./media/howto-add-microsoft-flow/flowcreatedevice.PNG)
1. (Optional) Fill in other fields as you see fit for your creating new devices.

1. Finally, save your workflow.

1. Try your workflow in the Microsoft Flow mobile app. Go to the **Buttons** tab in the app. You should see your Button -> Create a new device workflow. Enter the name of your new device, and watch it show up in IoT Central!

    ![Flow create device mobile screenshot](./media/howto-add-microsoft-flow/flowmobilescreenshot.png)

## Update a device in a workflow

This section shows you how to update device settings and properties in IoT Central at the push of a button on a mobile device using the Microsoft Flow mobile app.

1. Start by creating a blank workflow in Microsoft Flow.

1. Search for **Flow button for mobile** as a trigger.

1. In this trigger, add an input like a **Location** text input that corresponds to a setting or property you want to change. Change the description text.

1. Add a new action. Search for the **Azure IoT Central - Update a device** action.

1. Pick your application from the dropdown. Now you'll need an ID of the existing device you want to update. You can get the ID of the IoT Central device in the browser URL.

    ![IoT Central device explorer device ID](./media/howto-add-microsoft-flow/iotcdeviceid.PNG)

1. You can update the device name. To update any of the device's properties and settings, you must select the device template of the device you want to update in the **Device Template** dropdown. The action tile expands to show all the properties and settings you can update.

1. Select each of the properties and settings you want to update. From the dynamic content pane, choose the corresponding input from the trigger. In this example, the Location value is propagated down to update the device's Location property.

1. Finally, save your workflow.

1. Try your workflow in the Microsoft Flow mobile app. Go to the **Buttons** tab in the app. You should see your Button -> Update a device workflow. Enter the inputs, and see the device get updated in IoT Central!

## Delete a device in a workflow

You can delete a device by its device ID using the **Azure IoT Central - Delete a device** action. Here is an example workflow that deletes a device at the push of a button in the Microsoft Flow mobile app.

   ![Flow delete device workflow](./media/howto-add-microsoft-flow/flowdeletedevice.PNG)
    
## Troubleshooting

If you are having trouble creating a connection to the Azure IoT Central connector, here are some tips to help you.

1. Microsoft personal accounts (such as @hotmail.com, @live.com, @outlook.com domains) are not supported at this time. You must use an AAD work or school account.

2. To use the IoT Central connector in Microsoft Flow, you must have signed into the IoT Central application at least once. Otherwise the application won't appear in the Application dropdowns.

3. If you are receiving an error while using an AAD account, try opening Windows PowerShell and run the following commandlets as an administrator.
    ``` PowerShell
    Install-Module AzureAD
    Connect-AzureAD
    New-AzureADServicePrincipal -AppId 9edfcdd9-0bc5-4bd4-b287-c3afc716aac7 -DisplayName "Azure IoT Central"
    ```
    
## Next steps
Now that you have learned how to use Microsoft Flow to build workflows, the suggested next step is to [manage devices](howto-manage-devices.md).

