---
title: 'How To: Add simple commands to Custom Commands application - Speech service'
titleSuffix: Azure Cognitive Services
description: In this article, you learn how to add parameters to Custom Commands
services: cognitive-services
author: singhsaumya
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 06/18/2020
ms.author: sausin
---

# Add parameters to commands

In this article, you learn how to add parameters to Custom Commands. Parameters are information required by the commands to complete a task. In complex scenarios, parameters can also be used to define conditions which trigger custom actions.

## Prerequisites

> [!div class="checklist"]
> * [How To: Create application with simple commands](./how-to-custom-commands-create-application-with-simple-commands.md)

## Configure parameters for TurnOn command

Edit the existing **TurnOn** command to turn on and turn off multiple devices.

1. Because the command will now handle both on and off scenario, rename the Command to **TurnOnOff**.
   1. In the left pane, select the **TurnOn** command and then select the ellipsis (...) button next to **New command** at the top of the pane.
   
   1. Select **Rename**. In the **Rename command** windows, change **Name** to **TurnOnOff**.

1. Next, you add a new parameter to this command which represents whether the user wants to turn the device on or off.
   1. Select  **Add** present at top of the middle pane. From the drop-down, select **Parameter**.
   1. In the right pane, in the **Parameters** section, add value in the **Name** box as **OnOff**.
   1. Select **Required**. In the **Add response for a required parameter** window, select **Simple editor**. In the **First variation**, add
        ```
        On or Off?
        ```
   1. Select **Update**.

       > [!div class="mx-imgBorder"]
       > ![Create required parameter response](media/custom-commands/add-required-on-off-parameter-response.png)
   
   1. Now we configure the parameters properties. For explanation of all the configuration properties of a command, go to [references](./custom-commands-references.md). Configure the rest of the properties of the parameter as follows:
      

       | Configuration      | Suggested value     | Description                                                      |
       | ------------------ | ----------------| ---------------------------------------------------------------------|
       | Name               | `OnOff`           | A descriptive name for parameter                                                                           |
       | Is Global          | unchecked       | Checkbox indicating whether a value for this parameter is globally applied to all Commands in the application|
       | Required           | checked         | Checkbox indicating whether a value for this parameter is required before completing the Command |
       | Response for required parameter      |Simple editor > `On or Off?`      | A prompt to ask for the value of this parameter when it isn't known |
       | Type               | String          | The type of parameter, such as Number, String, Date Time or Geography   |
       | Configuration      | Accept predefined input values from internal catalog | For Strings, this limits inputs to a set of possible values |
       | Predefined input values     | `on`, `off`           | Set of possible values and their aliases         |
       
        
   1. For adding predefined input values, select **Add a predefined input** and in **New Item**  window, type in **Name** as provided in the table above. In this case, we aren't using aliases, so you can leave it blank. 
    > [!div class="mx-imgBorder"]
        > ![Create parameter](media/custom-commands/create-on-off-parameter.png)
   1. Select **Save** to save all configurations of the parameter.
 
 ### Add SubjectDevice parameter 

   1. Next, select **Add** again to add a second parameter to represent the name of the devices which can be controlled using this command. Use the following configuration.
   

       | Setting            | Suggested value       |
       | ------------------ | --------------------- |
       | Name               | `SubjectDevice`         |
       | Is Global          | unchecked             |
       | Required           | checked               |
       | Response for required parameter     | Simple editor > `Which device do you want to control?`    | 
       | Type               | String                |          |
       | Configuration      | Accept predefined input values from internal catalog | 
       | Predefined input values | `tv`, `fan`               |
       | Aliases (`tv`)      | `television`, `telly`     |

   1. Select **Save**

### Modify example sentences

For commands with parameters, it's helpful to add example sentences that cover all possible combinations. For example:

* Complete parameter information - `turn {OnOff} the {SubjectDevice}`
* Partial parameter information - `turn it {OnOff}`
* No parameter information - `turn something`

Example sentences with different degree of information allow the Custom Commands application to resolve both one-shot resolutions and multi-turn resolutions with partial information.

With that in mind, edit the example sentences to use the parameters as suggested below:

```
turn {OnOff} the {SubjectDevice}
{SubjectDevice} {OnOff}
turn it {OnOff}
turn something {OnOff}
turn something
```

Select **Save**.

> [!TIP]
> In the Example sentences editor use curly braces to refer to your parameters. - `turn {OnOff} the {SubjectDevice}`
> Use tab for auto-completion backed by previously created parameters.

### Modify completion rules to include parameters

Modify the existing Completion rule **ConfirmationResponse**.

1. In the **Conditions** section, select **Add a condition**.
1. In the **New Condition** window, in the **Type** list, select **Required parameters**. In the check-list below, check both **OnOff** and **SubjectDevice**.
1. Select **Create**.
1. In the **Actions** section, edit the existing **Send speech response** action by hovering over the action and selecting the edit button. This time, make use of the newly created **OnOff** and **SubjectDevice** parameters

    ```
    Ok, turning the {SubjectDevice} {OnOff}
    ```
1. Select **Save**.

### Try it out
1. Select **Train** icon present on top of the right pane.

1. When training completes, select **Test**. A **Test your application** window will appear.
 Try a few interactions.

    - Input: turn off the tv
    - Output: Ok, turning off the tv
    - Input: turn off the television
    - Output: Ok, turning off the tv
    - Input: turn it off
    - Output: Which device do you want to control?
    - Input: the tv
    - Output: Ok, turning off the tv

## Configure parameters for SetTemperature command

Modify the **SetTemperature** command to enable it to set the temperature as directed by the user.

Add new parameter **Temperature** with the following configuration

| Configuration      | Suggested value     |
| ------------------ | ----------------|
| Name               | `Temperature`           |
| Required           | checked         |
| Response for required parameter      | Simple editor > `What temperature would you like?`
| Type               | Number          |


Edit the example utterances to the following values.

```
set the temperature to {Temperature} degrees
change the temperature to {Temperature}
set the temperature
change the temperature
```

Edit the existing completion rules as per the following configuration.

| Configuration      | Suggested value     |
| ------------------ | ----------------|
| Conditions         | Required parameter > Temperature           |
| Actions           | Send speech response > `Ok, setting temperature to {Temperature} degrees` |

### Try it out

**Train** and **Test** the changes with a few interactions.

- Input: Set temperature
- Output: What temperature would you like?
- Input: 50 degrees
- Output: Ok, setting temperature to 50 degrees

## Configure parameters to the SetAlarm command

Add a parameter called **DateTime** with the following configuration.

   | Setting                           | Suggested value                     | 
   | --------------------------------- | ----------------------------------------|
   | Name                              | `DateTime`                               |
   | Required                          | checked                                 |
   | Response for required parameter   | Simple editor > `For what time?`            | 
   | Type                              | DateTime                                |
   | Date Defaults                     | If date is missing use today            |
   | Time Defaults                     | If time is missing use start of day     |


> [!NOTE]
> In this article, we predominantly made use of string, number and DateTime parameter types. For list of all supported parameter types and their properties, go to [references](./custom-commands-references.md).


Edit example utterances to the following values.

```
set an alarm for {DateTime}
set alarm {DateTime}
alarm for {DateTime}
```

Edit the existing completion rules as per the following configuration.

   | Setting    | Suggested value                               |
   | ---------- | ------------------------------------------------------- |
   | Actions    | Send speech response - `Ok, alarm set for {DateTime}`  |


### Try it out

**Train** and **Test** the changes.
- Input: Set alarm for tomorrow at noon
- Output: Ok, alarm set for 2020-05-02 12:00:00
- Input: Set an alarm
- Output: What time?
- Input: 5pm
- Output: Ok, alarm set for 2020-05-01 17:00:00


## Try out all the commands

Test out the all the three commands together using utterances related to different commands. Note that you can switch between the different commands.

- Input: Set an alarm
- Output: For what time?
- Input: Turn on the tv
- Output: Ok, turning the tv on
- Input: Set an alarm
- Output: For what time?
- Input: 5pm
- Output: Ok, alarm set for 2020-05-01 17:00:00

## Next steps

> [!div class="nextstepaction"]
> [How To: Add configurations to commands parameters](./how-to-custom-commands-add-parameter-configuration.md)
