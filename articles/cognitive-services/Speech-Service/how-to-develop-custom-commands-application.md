---
title: 'How-to: Develop Custom Commands applications - Speech service'
titleSuffix: Azure Cognitive Services
description: In this how-to, you learn how to develop and customize Custom Commands applications. Custom Commands makes it easy to build rich voice commanding apps optimized for voice-first interaction experiences, and is best suited for task completion or command-and-control scenarios, particularly well-matched for Internet of Things (IoT) devices, ambient and headless devices.
services: cognitive-services
author: trevorbye

manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 12/15/2020
ms.author: trbye
---

# Develop Custom Commands applications

In this how-to, you learn how to develop and configure Custom Commands applications. Custom Commands makes it easy to build rich voice commanding apps optimized for voice-first interaction experiences, and is best suited for task completion or command-and-control scenarios, particularly well-matched for Internet of Things (IoT) devices, ambient and headless devices.

In this article, you create an application that can turn a TV on and off, set the temperature, and set an alarm. After you create these basic commands, the following options for customizing commands are covered:

* Adding parameters to commands
* Adding configurations to command parameters
* Building interaction rules
* Creating language generation templates for speech responses
* Using Custom Voice 

## Create application with simple commands

First, start by creating an empty Custom Commands application. For details, refer to the [quickstart](quickstart-custom-commands-application.md). This time, instead of importing a project, you create a blank project.

1. In the **Name** box, enter project name as `Smart-Room-Lite` (or something else of your choice).
1. In the **Language** list, select **English (United States)**.
1. Select or create a LUIS resource of your choice.

   > [!div class="mx-imgBorder"]
   > ![Create a project](media/custom-commands/create-new-project.png)

### Update LUIS resources (optional)

You can update the authoring resource that you selected in the **New project** window, and set a prediction resource. Prediction resource is used for recognition when your Custom Commands application is published. You don't need a prediction resource during the development and testing phases.

### Add TurnOn Command

In the empty **Smart-Room-Lite** Custom Commands application you just created, add a simple command that processes an utterance, `turn on the tv`, and responds with the message `Ok, turning the tv on`.

1. Create a new Command by selecting **New command** at the top of the left pane. The **New command** window opens.
1. Provide value for the **Name** field as **TurnOn**.
1. Select **Create**.

The middle pane lists the different properties of the command. You configure the following properties of the command. For explanation of all the configuration properties of a command, go to [references](./custom-commands-references.md).

| Configuration            | Description                                                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Example sentences** | Example utterances the user can say to trigger this Command                                                                 |
| **Parameters**       | Information required to complete the Command                                                                                |
| **Completion rules** | The actions to be taken to fulfill the Command. For example, to respond to the user or communicate with another web service. |
| **Interaction rules**   | Additional rules to handle more specific or complex situations                                                              |


> [!div class="mx-imgBorder"]
> ![Create a command](media/custom-commands/add-new-command.png)

#### Add example sentences

Let's start with **Example sentences** section, and provide an example of what the user can say.

1. Select **Example sentences** section in the middle pane.
1. In the right most pane, add examples:

    ```
    turn on the tv
    ```

1.  Select **Save** at the top of the pane.

For now, we don't have parameters, so we can move to the **Completion rules** section.

#### Add a completion rule

Next, the command needs to have a completion rule. This rule tells the user that a fulfillment action is being taken. To read more about rules and completion rules, go to [references](./custom-commands-references.md).

1. Select default completion rule **Done** and edit it as follows:

    
    | Setting    | Suggested value                          | Description                                        |
    | ---------- | ---------------------------------------- | -------------------------------------------------- |
    | **Name**       | ConfirmationResponse                  | A name describing the purpose of the rule          |
    | **Conditions** | None                                     | Conditions that determine when the rule can run    |
    | **Actions**    | Send speech response > Simple editor > First variation > `Ok, turning the tv on` | The action to take when the rule condition is true |

   > [!div class="mx-imgBorder"]
   > ![Create a Speech response](media/custom-commands/create-speech-response-action.png)

1. Select **Save** to save the action.
1. Back in the **Completion rules** section, select **Save** to save all changes. 

    > [!NOTE]
    > It's not necessary to use the default completion rule that comes with the command. If needed, you can delete the existing default completion rule and add your own rule.

### Add SetTemperature command

Now, add one more command **SetTemperature** that will take a single utterance, `set the temperature to 40 degrees`, and respond with the message `Ok, setting temperature to 40 degrees`.

Follow the steps as illustrated for the **TurnOn** command to create a new command using the example sentence, "**set the temperature to 40 degrees**".

Then, edit the existing **Done** completion rules as follows:

| Setting    | Suggested value                          |
| ---------- | ---------------------------------------- |
| Name  | ConfirmationResponse                  |
| Conditions | None                                     |
| Actions    | Send speech response > Simple editor > First variation > `Ok, setting temperature to 40 degrees` |

Select **Save** to save all changes to the command.

### Add SetAlarm command

Create a new Command **SetAlarm** using the example sentence, "**set an alarm for 9 am tomorrow**". Then, edit the existing **Done** completion rules as follows:

| Setting    | Suggested value                          |
| ---------- | ---------------------------------------- |
| Rule Name  | ConfirmationResponse                  |
| Conditions | None                                     |
| Actions    | Send speech response > Simple editor > First variation >`Ok, setting an alarm for 9 am tomorrow` |

Select **Save** to save all changes to the command.

### Try it out

Test the behavior using the Test chat panel. Select **Train** icon present on top of the right pane. Once training completes, select **Test**. Try out the following utterance examples via voice or text:

- You type: set the temperature to 40 degrees
- Expected response: Ok, setting temperature to 40 degrees
- You type: turn on the tv
- Expected response: Ok, turning the tv on
- You type: set an alarm for 9 am tomorrow
- Expected response: Ok, setting an alarm for 9 am tomorrow

> [!div class="mx-imgBorder"]
> ![Test with web chat](media/custom-commands/create-basic-test-chat.png)

> [!TIP]
> In the test panel, you can select **Turn details** for information as to how this voice/text input was processed.

## Add parameters to commands

In this section, you learn how to add parameters to your commands. Parameters are information required by the commands to complete a task. In complex scenarios, parameters can also be used to define conditions which trigger custom actions.

### Configure parameters for TurnOn command

Start by editing the existing **TurnOn** command to turn on and turn off multiple devices.

1. Now that the command will now handle both on and off scenarios, rename the command to **TurnOnOff**.
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
   
   1. Now we configure the parameters properties. For explanation of all the configuration properties of a command, go to [references](./custom-commands-references.md). Configure the properties of the parameter as follows:
      

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
 
#### Add SubjectDevice parameter 

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

#### Modify example sentences

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

#### Modify completion rules to include parameters

Modify the existing Completion rule **ConfirmationResponse**.

1. In the **Conditions** section, select **Add a condition**.
1. In the **New Condition** window, in the **Type** list, select **Required parameters**. In the check-list below, check both **OnOff** and **SubjectDevice**.
1. Leave **IsGlobal** as unchecked.
1. Select **Create**.
1. In the **Actions** section, edit the existing **Send speech response** action by hovering over the action and selecting the edit button. This time, make use of the newly created **OnOff** and **SubjectDevice** parameters

    ```
    Ok, turning the {SubjectDevice} {OnOff}
    ```
1. Select **Save**.

Try out the changes by selecting the **Train** icon on top of the right pane. When training completes, select **Test**. A **Test your application** window will appear. Try the following interactions.

- Input: turn off the tv
- Output: Ok, turning off the tv
- Input: turn off the television
- Output: Ok, turning off the tv
- Input: turn it off
- Output: Which device do you want to control?
- Input: the tv
- Output: Ok, turning off the tv

### Configure parameters for SetTemperature command

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

### Configure parameters to the SetAlarm command

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

Test out the all the three commands together using utterances related to different commands. Note that you can switch between the different commands.

- Input: Set an alarm
- Output: For what time?
- Input: Turn on the tv
- Output: Ok, turning the tv on
- Input: Set an alarm
- Output: For what time?
- Input: 5pm
- Output: Ok, alarm set for 2020-05-01 17:00:00

## Add configurations to commands parameters

In this section, you learn more about advanced parameter configuration, including:

 - How parameter values can belong to a set defined externally to custom commands application
 - How to add validation clauses on the value of the parameters

### Configure parameter as external catalog entity

Custom Commands allows you to configure string-type parameters to refer to external catalogs hosted over a web endpoint. This allows you to update the external catalog independently without making edits to the Custom Commands application. This approach is useful in cases where the catalog entries can be large in number.

Reuse the **SubjectDevice** parameter from the **TurnOnOff** command. The current configuration for this parameter is **Accept predefined inputs from internal catalog**. This refers to static list of devices as defined in the parameter configuration. We want to move out this content to an external data source which can be updated independently.

To do this, start by adding a new web endpoint. Go to **Web endpoints** section in the left pane and add a new web endpoint with the following configuration.

| Setting | Suggested value |
|----|----|
| Name | `getDevices` |
| URL | `https://aka.ms/speech/cc-sampledevices` |
| Method | GET |


If the suggested value for URL doesn't work for you, you need to configure and host a simple web endpoint which returns a json consisting of list of the devices which can be controlled. The web endpoint should return a json formatted as follows:
    
```json
{
    "fan" : [],
    "refrigerator" : [
        "fridge"
    ],
    "lights" : [
        "bulb",
        "bulbs",
        "light"
        "light bulb"
    ],
    "tv" : [
        "telly",
        "television"
        ]
}

```

Next go the **SubjectDevice** parameter settings page and change the properties to the following.

| Setting | Suggested value |
| ----| ---- |
| Configuration | Accept predefined inputs from external catalog |                               
| Catalog endpoint | getDevices |
| Method | GET |

Then, select **Save**.

> [!IMPORTANT]
> You won't see an option to configure a parameter to accept inputs from an external catalog unless you have the web endpoint set in the **Web endpoint** section in the left pane.

Try it out by selecting **Train** and wait for training completion. Once training completes, select **Test** and try a few interactions.

* Input: turn on
* Output: Which device do you want to control?
* Input: lights
* Output: Ok, turning the lights on

> [!NOTE]
> Notice how you can control all the devices hosted on the web endpoint now. You still need to train the application for testing out the new changes and re-publish the application.

### Add validation to parameters

**Validations** are constructs applicable to certain parameter types which allow you to configure constraints on the parameter's value, and prompt for correction if values to do not fall within the constraints. For full list of parameter types extending the validation construct, go to [references](./custom-commands-references.md)

Test out validations using the **SetTemperature** command. Use the following steps to add a validation for the **Temperature** parameter.

1. Select **SetTemperature** command in the left pane.
1. Select  **Temperature** in the middle pane.
1. Select **Add a validation** present in the right pane.
1. In the **New validation** window, configure validation as follows, and select **Create**.


    | Parameter Configuration | Suggested value | Description |
    | ---- | ---- | ---- |
    | Min Value | `60` | For Number parameters, the minimum value this parameter can assume |
    | Max Value | `80` | For Number parameters, the maximum value this parameter can assume |
    | Failure response |  Simple editor > First Variation > `Sorry, I can only set temperature between 60 and 80 degrees. What temperature do you want?` | Prompt to ask for a new value if the validation fails |

    > [!div class="mx-imgBorder"]
    > ![Add a range validation](media/custom-commands/add-validations-temperature.png)

Try it out by selecting the **Train** icon present on top of the right pane. Once training completes, select **Test** and try a few interactions:

- Input: Set the temperature to 72 degrees
- Output: Ok, setting temperature to 72 degrees
- Input: Set the temperature to 45 degrees
- Output: Sorry, I can only set temperature between 60 and 80 degrees
- Input: make it 72 degrees instead
- Output: Ok, setting temperature to 72 degrees

## Add interaction rules

Interaction rules are *additional rules* to handle specific or complex situations. While you're free to author your own custom interaction rules, in this example you make use of interaction rules for the following targeted scenarios:

* Confirming commands
* Adding a one-step correction to commands

To learn more about interaction rules, go to the [references](./custom-commands-references.md) section.

### Add confirmations to a command

To add a confirmation, use the **SetTemperature** command. To achieve confirmation, you create interaction rules by using the following steps.

1. Select the **SetTemperature** command in the left pane.
1. Add interaction rules by selecting **Add** in the middle pane. Then select **Interaction rules** > **Confirm command**.

    This action adds three interaction rules which will ask the user to confirm the date and time of the alarm and expects a confirmation (yes/no) for the next turn.

    1. Modify the **Confirm command** interaction rule as per the following configuration:
        1. Rename **Name** to **Confirm temperature**.
        1. Add a new condition as **Required parameters** > **Temperature**.
        1. Add a new action as **Type** > **Send speech response** > **Are you sure you want to set the temperature as {Temperature} degrees?**
        1. Leave the default value of **Expecting confirmation from user** in the **Expectations** section.
      
         > [!div class="mx-imgBorder"]
         > ![Create required parameter response](media/custom-speech-commands/add-validation-set-temperature.png)
    

    1. Modify the **Confirmation succeeded** interaction rule to handle a successful confirmation (user said yes).
      
          1. Modify **Name** to **Confirmation temperature succeeded**.
          1. Leave the already existing **Confirmation was successful** condition.
          1. Add a new condition as **Type** > **Required parameters** > **Temperature**.
          1. Leave the default value of **Post-execution state** as **Execute completion rules**.

    1. Modify the **Confirmation denied** interaction rule to handle scenarios when confirmation is denied (user said no).

          1. Modify **Name** to **Confirmation temperature denied**.
          1. Leave the already existing **Confirmation was denied** condition.
          1. Add a new condition as **Type** > **Required parameters** > **Temperature**.
          1. Add a new action as **Type** > **Send speech response** > **No problem. What temperature then?**
          1. Leave the default value of **Post-execution state** as **Wait for user's input**.

> [!IMPORTANT]
> In this article, you used the built-in confirmation capability. You can also manually add interaction rules one by one.
   
Try out the changes by selecting **Train**, wait for the training to finish, and select **Test**.

- **Input**: Set temperature to 80 degrees
- **Output**: are you sure you want to set the temperature as 80 degrees?
- **Input**: No
- **Output**: No problem. What temperature then?
- **Input**: 72 degrees
- **Output**: are you sure you want to set the temperature as 72 degrees?
- **Input**: Yes
- **Output**: OK, setting temperature to 83 degrees

### Implement corrections in a command

In this section, you configure a one-step correction, which is used after the fulfillment action has already been executed. You also see an example of how a correction is enabled by default in case the command isn't fulfilled yet. To add a correction when the command isn't completed, add the new parameter **AlarmTone**.

Select the **SetAlarm** command from the left pane, and add the new parameter **AlarmTone**.
        
- **Name** > **AlarmTone**
- **Type** > **String**
- **Default Value** > **Chimes**
- **Configuration** > **Accept predefined input values from the internal catalog**
- **Predefined input values** > **Chimes**, **Jingle**, and **Echo** as individual predefined inputs


Next, update the response for the **DateTime** parameter to **Ready to set alarm with tone as {AlarmTone}. For what time?**. Then modify the completion rule as follows:

1. Select the existing completion rule **ConfirmationResponse**.
1. In the right pane, hover over the existing action and select **Edit**.
1. Update the speech response to **OK, alarm set for {DateTime}. The alarm tone is {AlarmTone}.**

> [!IMPORTANT]
> The alarm tone could be changed without any explicit configuration in an ongoing command, for example, when the command wasn't finished yet. *A correction is enabled by default for all the command parameters, regardless of the turn number if the command is yet to be fulfilled.*

#### Correction when command is completed

The Custom Commands platform also provides the capability for a one-step correction even when the command has been completed. This feature isn't enabled by default. It must be explicitly configured. Use the following steps to configure a one-step correction.

1. In the **SetAlarm** command, add an interaction rule of the type **Update previous command** to update the previously set alarm. Rename the default **Name** of the interaction rule to **Update previous alarm**.
1. Leave the default condition **Previous command needs to be updated** as is.
1. Add a new condition as **Type** > **Required Parameter** > **DateTime**.
1. Add a new action as **Type** > **Send speech response** > **Simple editor** > **Updating previous alarm time to {DateTime}.**
1. Leave the default value of **Post-execution state** as **Command completed**.

Try out the changes by selecting **Train**, wait for the training to finish, and select **Test**.

- **Input**: Set an alarm.
- **Output**: Ready to set alarm with tone as Chimes. For what time?
- **Input**: Set an alarm with the tone as Jingle for 9 am tomorrow.
- **Output**: OK, alarm set for 2020-05-21 09:00:00. The alarm tone is Jingle.
- **Input**: No, 8 am.
- **Output**: Updating previous alarm time to 2020-05-29 08:00.

> [!NOTE]
> In a real application, in the **Actions** section of this correction rule, you'll also need to send back an activity to the client or call an HTTP endpoint to update the alarm time in your system. This action should be solely responsible for updating the alarm time and not any other attribute of the command. In this case, that would be the alarm tone.

## Add language generation templates for speech responses

Language generation templates allow you to customize the responses sent to the client, and introduce variance in the responses. Language generation customization can be achieved by:

* Use of language generation templates
* Use of adaptive expressions

Custom Commands templates are based on the BotFramework's [LG templates](/azure/bot-service/file-format/bot-builder-lg-file-format#templates). Since Custom Commands creates a new LG template when required (that is, for speech responses in parameters or actions) you do not have to specify the name of the LG template. So, instead of defining your template as:

 ```
    # CompletionAction
    - Ok, turning {OnOff} the {SubjectDevice}
    - Done, turning {OnOff} the {SubjectDevice}
    - Proceeding to turn {OnOff} {SubjectDevice}
 ```

You only need to define the body of the template without the name, as follows.

> [!div class="mx-imgBorder"]
> ![template editor example](./media/custom-commands/template-editor-example.png)


This change introduces variation to the speech responses being sent to the client. So, for the same utterance, the corresponding speech response would be randomly picked out of the options provided.

Taking advantage of LG templates also allows you to define complex speech responses for commands using adaptive expressions. You can refer to the [LG templates format](/azure/bot-service/file-format/bot-builder-lg-file-format#templates) for more details. Custom Commands by default supports all the capabilities with the following minor differences:

* In the LG templates entities are represented as ${entityName}. In Custom Commands we don't use entities but parameters can be used as variables with either one of these representations ${parameterName} or {parameterName}
* Template composition and expansion are not supported in Custom Commands. This is because you never edit the `.lg` file directly, but only the responses of automatically created templates.
* Custom functions injected by LG  are not supported in Custom Commands. Predefined functions are still supported.
* Options (strict, replaceNull & lineBreakStyle) are not supported in Custom Commands.

### Add template responses to TurnOnOff command

Modify the **TurnOnOff** command to add a new parameter with the following configuration:

| Setting            | Suggested value       | 
| ------------------ | --------------------- | 
| Name               | `SubjectContext`         | 
| Is Global          | unchecked             | 
| Required           | unchecked               | 
| Type               | String                |
| Default value      | `all` |
| Configuration      | Accept predefined input values from internal catalog | 
| Predefined input values | `room`, `bathroom`, `all`|

#### Modify completion rule

Edit the **Actions** section of existing completion rule **ConfirmationResponse**. In the **Edit action** pop-up, switch to **Template Editor** and replace the text with the following example.

```
- IF: @{SubjectContext == "all" && SubjectDevice == "lights"}
    - Ok, turning all the lights {OnOff}
- ELSEIF: @{SubjectDevice == "lights"}
    - Ok, turning {OnOff} the {SubjectContext} {SubjectDevice}
- ELSE:
    - Ok, turning the {SubjectDevice} {OnOff}
    - Done, turning {OnOff} the {SubjectDevice}
```

**Train** and **Test** your application as follows. Notice the variation of responses due to usage of multiple alternatives of the template value, and also use of adaptive expressions.

* Input: turn on the tv
* Output: Ok, turning the tv on
* Input: turn on the tv
* Output: Done, turned on the tv
* Input: turn off the lights
* Output: Ok, turning all the lights off
* Input: turn off room lights
* Output: Ok, turning off the room lights

## Use Custom Voice

Another way to customize Custom Commands responses is to select a custom output voice. Use the following steps to switch the default voice to a custom voice.

1. In your custom commands application, select **Settings** from the left pane.
1. Select **Custom Voice** from the middle pane.
1. Select the desired custom or public voice from the table.
1. Select **Save**.

> [!div class="mx-imgBorder"]
> ![Sample Sentences with parameters](media/custom-commands/select-custom-voice.png)

> [!NOTE]
> - For **Public voices**, **Neural types** are only available for specific regions. To check availability, see [standard and neural voices by region/endpoint](./regions.md#standard-and-neural-voices).
> - For **Custom voices**, they can be created from the Custom Voice project page. See [Get Started with Custom Voice](./how-to-custom-voice.md).

Now the application will respond in the selected voice, instead of the default voice.

## Next steps

* Learn how to [integrate your Custom Commands application](how-to-custom-commands-setup-speech-sdk.md) with a client app using the Speech SDK.
* [Set up continuous deployment](how-to-custom-commands-deploy-cicd.md) for your Custom Commands application with Azure DevOps. 
                      