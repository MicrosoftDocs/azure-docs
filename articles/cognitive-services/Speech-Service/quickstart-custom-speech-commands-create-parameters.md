---
title: 'Quickstart: Create a Custom Commands Preview app with parameters - Speech service'
titleSuffix: Azure Cognitive Services
description: In this article, you'll add parameters to a Custom Commands application so it can turn multiple devices on and off.
services: cognitive-services
author: nitinme
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/30/2020
ms.author: nitinme
---

# Quickstart: Create a Custom Commands Preview application with parameters

In the [previous article](./quickstart-custom-speech-commands-create-new.md), you created a simple Custom Commands application without parameters.

In this article, you'll extend that application with parameters so it can turn multiple devices on and off.

## Create parameters

1. Open the project you created in the [previous article](./quickstart-custom-speech-commands-create-new.md).

   We'll edit the existing command so it can be used to turn multiple devices on and off.
1. Because the command will now handle both on and off, rename it to **TurnOnOff**.
   1. In the left pane, select the **TurnOn** command and then select the ellipsis (**...**) button next to **New command** at the top of the pane.
   
   1. Select **Rename**. In the **Rename command** window, change the **Name** to **TurOnOff**. Select **Save**.

1. Create a parameter to represent whether the user wants to turn the device on or off.
   1. Select **Add** at the top of the middle pane. In the drop-down list, select **Parameter**.
   1. In the right pane, in the **Parameters** section, add a value in the **Name** box.
   1. Select **Required**. In the **Add response for a required parameter** window, select **Simple editor**. In the **First variation** box, enter this text:
        ```
        On or Off?
        ```
   1. Select **Update**.

       > [!div class="mx-imgBorder"]
       > ![Create required parameter response](media/custom-speech-commands/add-required-on-off-parameter-response.png)
   
1. Configure the rest of the properties of the parameter as follows:
       

    | Configuration      | Suggested value     | Description                                                      |
    | ------------------ | ----------------| ---------------------------------------------------------------------|
    | **Name**               | **OnOff**           | A descriptive name for the parameter.                                                                  |
    | **Is Global**          | Cleared       | A check box that indicates whether a value for the parameter is globally applied to all commands in the application.|
    | **Required**           | Selected         | A check box that indicates whether a value for the parameter is required.  |
    | **Response for required parameter**      |**Simple editor -> On or Off?**      | A prompt to ask for the value of the parameter when it isn't known. |
    | **Type**               | **String**          | The type of parameter. For example, Number, String, Date Time, Geography.   |
    | **Configuration**      | **Accept predefined input values from internal catalog** | For strings, this setting limits inputs to a set of possible values. |
    | **Predefined input values**     | **on**, **off**             | A set of possible values and their aliases.         |
       


    > [!div class="mx-imgBorder"]
    > ![Create parameter](media/custom-speech-commands/create-on-off-parameter.png)

1. Select **Save** to save the settings.

 1. Select **Add** again to add a second parameter. This parameter represents the name of the device. Use these settings:
   

       | Setting            | Suggested value       | Description                                                                                               |
       | ------------------ | --------------------- | --------------------------------------------------------------------------------------------------------- |
       | **Name**               | **SubjectDevice**         | A descriptive name for parameter.                                                                     |
       | **Is Global**          | Cleared             | A check box  that indicates whether a value for the parameter is globally applied to all commands in the application. |
       | **Required**           | Selected               | A check box that indicates whether a value for the parameter is required.          |
       | **Simple editor**      | **Which device?**    | A prompt to ask for the value of the parameter when it isn't known.                                       |
       | **Type**               | **String**                | The type of parameter. For example, Number, String, Date Time, Geography.                                                |
       | **Configuration**      | **Accept predefined input values from internal catalog** | For strings, this setting limits inputs to a set of possible values.       |
       | **Predefined input values** | **tv**, **fan**               | A set of possible values and their aliases.                               |
       | **Aliases** (tv)      | **television**, **telly**     | Optional aliases for each of the predefined input values.                                 |

## Add example sentences

For commands that have parameters, it's helpful to add example sentences that cover all possible combinations. For example:

- Complete parameter information: `turn {OnOff} the {SubjectDevice}`
- Partial parameter information: `turn it {OnOff}`
- No parameter information: `turn something`

Example sentences that have different amounts of information allow the Custom Commands application to resolve both one-shot resolutions and multi-turn resolutions that have partial information.

With that in mind, edit the example sentences to use the parameters as suggested here:

```
turn {OnOff} the {SubjectDevice}
{SubjectDevice} {OnOff}
turn it {OnOff}
turn something {OnOff}
turn something
```
> [!TIP]
> In the Example sentences editor, use braces to refer to your parameters: `turn {OnOff} the {SubjectDevice}`.
>
> Use tab for auto-completion defined by previously created parameters.

## Add parameters to completion rules

Modify the completion rule that you created in the [previous quickstart](./quickstart-custom-speech-commands-create-new.md).

1. In the **Conditions** section, select **Add a condition**.
1. In the **New Condition** window, in the **Type** list, select **Required parameters**. In the list, select both **OnOff** and **SubjectDevice**.
1. Select **Create**.
1. In the **Actions** section, edit the existing **Send speech response** action by hovering over the action and selecting the edit button. This time, use the new `OnOff` and `SubjectDevice` parameters:

    ```
    Ok, turning {OnOff} the {SubjectDevice}
    ```

## Try it out
1. Select **Train** at the top of the right pane.

1. When training is done, select **Test**.
    
    A **Test your application** window will appear.

1. Try a few interactions.

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
