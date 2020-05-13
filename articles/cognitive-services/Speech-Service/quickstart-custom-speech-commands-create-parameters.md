---
title: 'Quickstart: Create a Custom Command with Parameters (Preview) - Speech service'
titleSuffix: Azure Cognitive Services
description: In this article, you'll add parameters to a Custom Commands application.
services: cognitive-services
author: don-d-kim
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/30/2020
ms.author: donkim
---

# Quickstart: Create a Custom Commands application with parameters (Preview)

In the [previous article](./quickstart-custom-speech-commands-create-new.md), you created a simple Custom Commands application without parameters.

In this article, you will be extending this application to make use of parameters so that it can handle turning on and turning off multiple devices.

## Create Parameters

1. Open the project [you created previously](./quickstart-custom-speech-commands-create-new.md)
1. Let's edit the existing command to turn on and turn off multiple devices.
1. Because the Command will now handle on and off, rename the Command to `TurnOnOff`.
   - In the left pane, select the `TurnOn` command and then click on `...` icon next to `+ New command` at the top of the pane.
   
   - Select `Rename` icon. In the **Rename command** pop-up, change **Name** to `TurOnOff`. Next, select **Save**.

1. Next, you create a new parameter to represent whether the user wants to turn the device on or off.
   - Select  `+ Add` icon present on the top of the middle pane. From the drop-down, select **Parameter**.
   - On the right most pane, you can see the **Parameters** configuration section.
   - Add value for **Name**.
   - Check the **Required** check-box. In the **Add response for a required parameter** window, select **Simple editor** and to the **First variation**, add
        ```
        On or Off?
        ```
   - Select **Update**.

       > [!div class="mx-imgBorder"]
       > ![Create required parameter response](media/custom-speech-commands/add-required-on-off-parameter-response.png)
   
   - Next let's configure the rest of the properties of the parameter as follows and select `Save` to save configuration all configurations to the parameter.
       

       | Configuration      | Suggested value     | Description                                                      |
       | ------------------ | ----------------| ---------------------------------------------------------------------|
       | Name               | OnOff           | A descriptive name for parameter                                                                           |
       | Is Global          | unchecked       | Checkbox indicating whether a value for this parameter is globally applied to all Commands in the application|
       | Required           | checked         | Checkbox indicating whether a value for this parameter is required before completing the Command |
       | Response for required parameter      |Simple editor -> On or Off?      | A prompt to ask for the value of this parameter when it isn't known |
       | Type               | String          | The type of parameter, such as Number, String, Date Time or Geography   |
       | Configuration      | Accept predefined input values from internal catalog | For Strings, this limits inputs to a set of possible values |
       | Predefined input values     | on, off             | Set of possible values and their aliases         |
       
        > [!div class="mx-imgBorder"]
        > ![Create parameter](media/custom-speech-commands/create-on-off-parameter.png)

   - Next, select the `+ Add` icon again to add a second parameter to represent the name of the devices with the following configuration.
   

       | Setting            | Suggested value       | Description                                                                                               |
       | ------------------ | --------------------- | --------------------------------------------------------------------------------------------------------- |
       | Name               | SubjectDevice         | A descriptive name for parameter                                                                     |
       | Is Global          | unchecked             | Checkbox indicating whether a value for this parameter is globally applied to all Commands in the application |
       | Required           | checked               | Checkbox indicating whether a value for this parameter is required before completing the Command          |
       | Simple editor      | Which device?    | A prompt to ask for the value of this parameter when it isn't known                                       |
       | Type               | String                | The type of parameter, such as Number, String, Date Time or Geography                                                |
       | Configuration      | Accept predefined input values from internal catalog | For Strings, a String List limits inputs to a set of possible values       |
       | Predefined input values | tv, fan               | Set of possible values and their aliases                               |
       | Aliases (tv)      | television, telly     | Optional aliases for each possible value of predefined input values                                 |

## Add Example sentences

With commands with parameters, it's helpful to add example sentences that cover all possible combinations. For example:

1. Complete parameter information - `turn {OnOff} the {SubjectDevice}`
1. Partial parameter information - `turn it {OnOff}`
1. No parameter information - `turn something`

Example sentences with different degree of information allow the Custom Commands application to resolve both one-shot resolutions and multi-turn resolutions with partial information.

With that in mind, edit the example sentences to use the parameters as suggested below.

```
turn {OnOff} the {SubjectDevice}
{SubjectDevice} {OnOff}
turn it {OnOff}
turn something {OnOff}
turn something
```
> [!TIP]
> In the Example sentences editor use curly braces to refer to your parameters. - `turn {OnOff} the {SubjectDevice}`
> Use tab for auto-completion backed by previously created parameters.

## Add parameters to Completion rules

Modify the Completion rule that we created in [the previous quickstart](./quickstart-custom-speech-commands-create-new.md).

1. In the **Conditions** section, add a new condition by selecting **+ Add a condition**
1. In the new pop-up **New Condition**, Select `Required parameters` from the **Type** drop-down. In the check-list below, check both `OnOff` and `SubjectDevice`.
1. Click on **Create**.
1. In the **Actions** section, edit the existing Send speech response action by hovering over the action and clicking on the edit icon. This time, let's make use of newly created `OnOff` and `SubjectDevice` parameters

    ```
    Ok, turning {OnOff} the {SubjectDevice}
    ```

## Try it out
1. Select `Train` icon present on top of the right pane.

1. Once, training completes, select `Test`.
    - A new **Test your application** window will appear.
    - Try a few interactions.

        - Input: turn off the tv
        - Output: Ok, turning off the tv        
        - Input: turn off the television
        - Output: Ok, turning off the tv
        - Input: turn it off
        - Output: Which device?
        - Input: the tv
        - Output: Ok, turning off the tv

## Next steps
> [!div class="nextstepaction"]
> [Quickstart: Use Custom Commands with Custom Voice (Preview)](./quickstart-custom-speech-commands-select-custom-voice.md)
