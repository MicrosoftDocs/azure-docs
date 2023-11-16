---
title: Prompt tool in Azure Machine Learning prompt flow
titleSuffix: Azure Machine Learning
description: The prompt tool in prompt flow offers a collection of textual templates that serve as a starting point for creating prompts.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.custom:
  - ignite-2023
ms.topic: reference
author: likebupt
ms.author: keli19
ms.reviewer: lagayhar
ms.date: 11/02/2023
---

# Prompt tool

The prompt tool in prompt flow offers a collection of textual templates that serve as a starting point for creating prompts. These templates, based on the Jinja2 template engine, facilitate the definition of prompts. The tool proves useful when prompt tuning is required prior to feeding the prompts into the large language model (LLM) in prompt flow.

## Inputs

| Name               | Type   | Description                                              | Required |
|--------------------|--------|----------------------------------------------------------|----------|
| prompt             | string | Prompt template in Jinja                            | Yes      |
| Inputs             | -      | List of variables of prompt template and its assignments | -        |

## Outputs

The following sections show the prompt text parsed from the prompt and inputs.

## Write a prompt

1. Prepare a Jinja template. Learn more about [Jinja](https://jinja.palletsprojects.com/en/3.1.x/).

   In the following example, the prompt incorporates Jinja templating syntax to dynamically generate the welcome message and personalize it based on the user's name. It also presents a menu of options for the user to choose from. Depending on whether the user_name variable is provided, it either addresses the user by name or uses a generic greeting.

    ```jinja
    Welcome to {{ website_name }}!
    {% if user_name %}
        Hello, {{ user_name }}!
    {% else %}
        Hello there!
    {% endif %}
    Please select an option from the menu below:
    1. View your account
    2. Update personal information
    3. Browse available products
    4. Contact customer support
    ```
  
1. Assign values for the variables.

In the preceding example, two variables are automatically detected and listed in the **Inputs** section. Assign values.

### Sample 1

Here are the inputs and outputs for the sample.

#### Inputs

| Variable      | Type   | Sample value | 
|---------------|--------|--------------|
| website_name  | string | "Microsoft"  |
| user_name     | string | "Jane"       |

#### Outputs

```
Welcome to Microsoft! Hello, Jane! Please select an option from the menu below: 1. View your account 2. Update personal information 3. Browse available products 4. Contact customer support
```

### Sample 2

Here are the inputs and outputs for the sample.

#### Inputs

| Variable     | Type   | Sample value   |
|--------------|--------|----------------|
| website_name | string | "Bing"         |
| user_name    | string | "              |

#### Outputs

```
Welcome to Bing! Hello there! Please select an option from the menu below: 1. View your account 2. Update personal information 3. Browse available products 4. Contact customer support
```
