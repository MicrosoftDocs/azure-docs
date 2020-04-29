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
ms.date: 12/09/2019
ms.author: donkim
---

# Quickstart: Create a Custom Commands application with parameters

In the [previous article](./quickstart-custom-speech-commands-create-new.md), we created a simple Custom Commands application without parameters.

In this article, we will extend this application with parameters so that it can handle turning on and turning off multiple devices.

## Create Parameters

1. Open the project [we created previously](./quickstart-custom-speech-commands-create-new.md)
1. We will edit the existing command to turn on and turn off multiple devices.
1. Because the Command will now handle on and off, rename the Command to "TurnOnOff"
   - In the left panel, select the `TurnOn` command and then click on **...** icon next to **New command** at the top of the pane.
   - Click on **Rename** icon. In the **Rename command** pop-up window, change **Name** to `TuronOnOff`. Next, click on ***Save** button.
1. Create a new parameter to represent whether the user wants to turn the device on or off
   - Select the **+Add** icon present on the top of the middle pane. From the drop-down, click on **Parameter**.
   - On the right most pane, we can see the **Parameters** configuration section.

   > [!div class="mx-imgBorder"]
   > ![Create parameter](media/custom-speech-commands/create-on-off-parameter.png)

   | Configuration          | Suggested value     | Description                                                                                                     |
   | ------------------     | ------------------- | ----------------------------------------------------------------------------------------------------------------|
   | Name                   | OnOff               | A descriptive name for parameter                                                                           |
   | Is Global              | unchecked           | Checkbox indicating whether a value for this parameter is globally applied to all Commands in the application   |
   | Required               | checked             | Checkbox indicating whether a value for this parameter is required before completing the Command                |
   | Simple editor          | On or off?       | A prompt to ask for the value of this parameter when it isn't known                                             |
   | Type                   | String              | The type of parameter, such as Number, String, Date Time or Geography                                           |          |
   | Configuration          | Accept predefined input values from internal catalog | For Strings, this limits inputs to a set of possible values      |
   | Predefined input values     | on, off             | Set of possible values and their aliases                                      |

   - Next, select the `+` icon again to add a second parameter to represent the name of the devices. For this example, a tv and a fan

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

With parameters, it's helpful to add example sentences that cover all possible combinations. For example:

1. Full parameter information - `"turn {OnOff} the {SubjectDevice}"`
1. Partial parameter information - `"turn it {OnOff}"`
1. No parameter information - `"turn something"`

Example sentences with different degree of information allow the Custom Commands application to resolve both one-shot resolutions and multi-turn resolutions with partial information.

With that in mind, edit the Example Sentences to use the parameters as suggested below.

> [!TIP]
> In the Example Sentences editor use curly braces to refer to your parameters. - `turn {OnOff} the {SubjectDevice}`
> Use tab for auto-completion backed by previously created parameters.

> [!div class="mx-imgBorder"]
> ![Sample Sentences with parameters](media/custom-speech-commands/create-parameter-sentences.png)

```
turn {OnOff} the {SubjectDevice}
{SubjectDevice} {OnOff}
turn it {OnOff}
turn something {OnOff}
turn something
```

## Add parameters to Completion rules

Modify the Completion rule that we created in [the previous quickstart](./quickstart-custom-speech-commands-create-new.md):

1. Add a new Condition by clicking on **+** button next to **Conditions** section in the Completion rules configuration page.
1. In the new pop-up window **New Condition**, Select `Required parameters` from the **Type** drop-down. In the check-list below, select both `OnOff` and `SubjectDevice`.
1. Click on **Create**.
1. In the **Actions** section, Edit the existing Send speech response action to use `OnOff` and `SubjectDevice`:

   ```
   - Ok, turning {OnOff} the {SubjectDevice}
   ```

## Try it out
1. Click on **Train** button.
1. Once, training completes, click on **Test** button.
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
> [Quickstart: Use Custom Commands with Custom Voice](./quickstart-custom-speech-commands-select-custom-voice.md)
