---
title: 'Custom Commands concepts and definitions - Speech service'
titleSuffix: Azure AI services
description: In this article, you learn about concepts and definitions for Custom Commands applications.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: conceptual
ms.date: 06/18/2020
ms.author: eur
ms.custom: cogserv-non-critical-speech
---

# Custom Commands concepts and definitions

[!INCLUDE [deprecation notice](./includes/custom-commands-retire.md)]

This article serves as a reference for concepts and definitions for Custom Commands applications.

## Commands configuration
Commands are the basic building blocks of a Custom Commands application. A command is a set of configurations required to complete a specific task defined by a user.

### Example sentences
Example utterances are the set examples the user can say to trigger a particular command. You need to provide only a sample of utterances and not an exhaustive list.

###	Parameters
Parameters are information required by the commands to complete a task. In complex scenarios, parameters can also be used to define conditions that trigger custom actions.

###	Completion rules
Completion rules are a series of rules to be executed after the command is ready to be fulfilled, for example, when all the conditions of the rules are satisfied.

###	Interaction rules
Interaction rules are additional rules to handle more specific or complex situations. You can add additional validations or configure advanced features such as confirmations or a one-step correction. You can also build your own custom interaction rules.

## Parameters configuration

Parameters are information required by commands to complete a task. In complex scenarios, parameters can also be used to define conditions that trigger custom actions.

### Name
A parameter is identified by the name property. You should always give a descriptive name to a parameter. A parameter can be referred across different sections, for example, when you construct conditions, speech responses, or other actions.

### Required
This check box indicates whether a value for this parameter is required for command fulfillment or completion. You must configure responses to prompt the user to provide a value if a parameter is marked as required.

Note that, if you configured a **required parameter** to have a **Default value**, the system will still explicitly prompt for the parameter's value.

### Type
Custom Commands supports the following parameter types:

* Age
* Currency
* DateTime
* Dimension
* Email
* Geography
* Number
* Ordinal
* Percentage
* PersonName
* PhoneNumber
* String
* Temperature
* Url

Every locale supports the "String" parameter type, but availability of all other types differs by locale. Custom Commands uses LUIS's prebuilt entity resolution, so the availability of a parameter type in a locale depends on LUIS's prebuilt entity support in that locale. You can find [more details on LUIS's prebuilt entity support per locale](../luis/luis-reference-prebuilt-entities.md). Custom LUIS entities (such as machine learned entities) are currently not supported.

Some parameter types like Number, String and DateTime support default value configuration, which you can configure from the portal.

### Configuration
Configuration is a parameter property defined only for the type String. The following values are supported:

* **None**.
* **Accept full input**: When enabled, a parameter accepts any input utterance. This option is useful when the user needs a parameter with the full utterance. An example is postal addresses.
* **Accept predefined input values from an external catalog**: This value is used to configure a parameter that can assume a wide variety of values. An example is a sales catalog. In this case, the catalog is hosted on an external web endpoint and can be configured independently.
* **Accept predefined input values from internal catalog**: This value is used to configure a parameter that can assume a few values. In this case, values must be configured in the Speech Studio.


### Validation
Validations are constructs applicable to certain parameter types that let you configure constraints on a parameter's value. Currently, Custom Commands supports validations on the following parameter types:

* DateTime
* Number

## Rules configuration
A rule in Custom Commands is defined by a set of *conditions* that, when met, execute a set of *actions*. Rules also let you configure *post-execution state* and *expectations* for the next turn.

### Types
Custom Commands supports the following rule categories:

* **Completion rules**: These rules must be executed upon command fulfillment. All the rules configured in this section for which the conditions are true will be executed.
* **Interaction rules**: These rules can be used to configure additional custom validations, confirmations, and a one-step correction, or to accomplish any other custom dialog logic. Interaction rules are evaluated at each turn in the processing and can be used to trigger completion rules.

The different actions configured as part of a rule are executed in the order in which they appear in the authoring portal.

### Conditions
Conditions are the requirements that must be met for a rule to execute. Rules conditions can be of the following types:

* **Parameter value equals**: The configured parameter's value equals a specific value.
* **No parameter value**: The configured parameters shouldn't have any value.
* **Required parameters**: The configured parameter has a value.
* **All required parameters**: All the parameters that were marked as required have a value.
* **Updated parameters**: One or more parameter values were updated as a result of processing the current input (utterance or activity).
* **Confirmation was successful**: The input utterance or activity was a successful confirmation (yes).
* **Confirmation was denied**: The input utterance or activity was not a successful confirmation (no).
* **Previous command needs to be updated**: This condition is used in instances when you want to catch a negated confirmation along with an update. Behind the scenes, this condition is configured for when the dialog engine detects a negative confirmation where the intent is the same as the previous turn, and the user has responded with an update.

### Actions
* **Send speech response**: Send a speech response back to the client.
* **Update parameter value**: Update the value of a command parameter to a specified value.
* **Clear parameter value**: Clear the command parameter value.
* **Call web endpoint**: Make a call to a web endpoint.
* **Send activity to client**: Send a custom activity to the client.

### Expectations
Expectations are used to configure hints for the processing of the next user input. The following types are supported:

* **Expecting confirmation from user**: This expectation specifies that the application is expecting a confirmation (yes/no) for the next user input.
* **Expecting parameter(s) input from user**: This expectation specifies one or more command parameters that the application is expecting from the user input.

### Post-execution state
The post-execution state is the dialog state after processing the current input (utterance or activity). It's of the following types:

* **Keep current state**: Keep current state only.
* **Complete the command**: Complete the command and no additional rules of the command will be processed.
* **Execute completion rules**: Execute all the valid completion rules.
* **Wait for user's input**: Wait for the next user input.


## Next steps

> [!div class="nextstepaction"]
> [See samples on GitHub](https://aka.ms/speech/cc-samples)
