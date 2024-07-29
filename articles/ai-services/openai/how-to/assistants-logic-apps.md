---
title: 'How to use Assistants with Logic apps'
titleSuffix: Azure OpenAI
description: Learn how to create helpful AI Assistants with Logic apps.
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: how-to
ms.date: 05/21/2024
author: aahill
ms.author: aahi
recommendations: false
---

# Call Azure Logic apps as functions using Azure OpenAI Assistants 

> [!NOTE]
> This functionality is currently only available in Azure OpenAI Studio.

[Azure Logic Apps](https://azure.microsoft.com/products/logic-apps) is an integration platform in Azure that allows you to build applications and automation workflows with low code tools enabling developer productivity and faster time to market. By using the visual designer and selecting from hundreds of prebuilt connectors, you can quickly build a workflow that integrates and manages your apps, data, services, and systems.

Azure Logic Apps is fully managed by Microsoft Azure, which frees you from worrying about hosting, scaling, managing, monitoring, and maintaining solutions built with these services. When you use these capabilities to create [serverless](../../../logic-apps/logic-apps-overview.md) apps and solutions, you can just focus on the business logic and functionality. These services automatically scale to meet your needs, make automation workflows faster, and help you build robust cloud apps using little to no code.

## Function calling on Azure Logic Apps through the Assistants Playground 

To accelerate and simplify the creation of intelligent applications, we are now enabling the ability to call Logic Apps workflows through function calling in Azure OpenAI Assistants.

The Assistants playground enumerates and lists all the workflows in your subscription that are eligible for function calling. Here are the requirements for these workflows:

* [Consumption Logic Apps](../../../logic-apps/quickstart-create-example-consumption-workflow.md): Currently we only support consumption workflows.
* [Request trigger](../../../connectors/connectors-native-reqres.md?tabs=consumption): Function calling requires a REST-based API. Logic Apps with a request trigger provides a REST endpoint. Therefore only workflows with a request trigger are supported for function calling.
* Schema: The workflows you want to use for function calling should have a JSON schema describing the inputs and expected outputs. Using Logic Apps you can streamline and provide schema in the trigger, which would be automatically imported as a function definition.

If you already have workflows with above three requirements, you should be able to use them in Azure OpenAI Studio  and invoke them via user prompts.
If you do not have existing workflows, you can follow the steps in this article to create them. There are two primary steps:
1. [Create a Logic App on Azure portal](#create-logic-apps-workflows-for-function-calling).
2. [Import your Logic Apps workflows as a function in the Assistants Playground](#import-your-logic-apps-workflows-as-functions).

## Create Logic Apps workflows for function calling

Here are the steps to create a new Logic Apps workflow for function calling.

1. In the Azure portal search box, enter **logic apps**, and select **Logic apps**.
1. On the Logic apps page toolbar, select **Add**.
1. On the Create Logic App page, first select the Plan type for your logic app resource. That way, only the options for that plan type appear.
1. In the **Plan** section, for the Plan type, select **Consumption** to view only the consumption logic app resource settings.
1. Provide the following information for your logic app resource: Subscription, Resource Group, Logic App name, and Region.
1. When you're ready, select **Review + Create**.
1. On the validation page that appears, confirm all the provided information, and select **Create**.
1. After Azure successfully deploys your logic app resource, select **Go to resource**. Or, find and select your logic app resource by typing the name in the Azure search box.
1. Open the Logic Apps workflow in designer. Select Development Tools + Logic app designer. This opens your empty workflow in designer. Or you select Blank Logic App from templates
1. Now you're ready to add one more step in the workflow. A workflow always starts with a single trigger, which specifies the condition to meet before running any subsequent actions in the workflow.
1. Your workflow is required to have a Request trigger to generate a REST endpoint, and a response action to return the response to Azure OpenAI Studio  when this workflow is invoked.
1. Add a trigger [(Request)](../../../connectors/connectors-native-reqres.md?tabs=consumption)

    Select **Add a trigger** and then search for request trigger. Select the **When a HTTP request is received** operation.

    :::image type="content" source="..\media\how-to\assistants\logic-apps\create-logic-app-1.png" alt-text="A screenshot showing the Logic Apps designer." lightbox="..\media\how-to\assistants\logic-apps\create-logic-app-1.png":::

    Provide the JSON schema for the request. If you do not have the schema use the option to generate schema.

    :::image type="content" source="..\media\how-to\assistants\logic-apps\create-logic-app-2.png" alt-text="A screenshot showing the option to provide a JSON schema." lightbox="..\media\how-to\assistants\logic-apps\create-logic-app-2.png":::

    Here is an example of the request schema. You can add a description for your workflow in the comment box. This is imported by Azure OpenAI Studio  as the function description.
    
    :::image type="content" source="..\media\how-to\assistants\logic-apps\create-logic-app-3.png" alt-text="A screenshot showing an example request schema." lightbox="..\media\how-to\assistants\logic-apps\create-logic-app-3.png":::

    Save the workflow. This will generate the REST endpoint for the workflow.

    :::image type="content" source="..\media\how-to\assistants\logic-apps\create-logic-app-4.png" alt-text="A screenshot showing the REST endpoint." lightbox="..\media\how-to\assistants\logic-apps\create-logic-app-4.png":::

1. Depending on the business use case, you can now add one or more steps/actions in this workflow. For example, using the MSN weather connector to get the weather forecast for the current location.

    :::image type="content" source="..\media\how-to\assistants\logic-apps\create-logic-app-5.png" alt-text="A screenshot showing the MSN weather connector." lightbox="..\media\how-to\assistants\logic-apps\create-logic-app-5.png":::

    In the action to **get forecast for today**, we are using the **location** property that was passed to this workflow as an input.

    :::image type="content" source="..\media\how-to\assistants\logic-apps\create-logic-app-6.png" alt-text="A screenshot showing the location property." lightbox="..\media\how-to\assistants\logic-apps\create-logic-app-6.png":::

1. Configure the [response](../../../connectors/connectors-native-reqres.md#add-a-response-action). The workflow needs to return the response back to Azure OpenAI Studio. This is done using Response action.

    :::image type="content" source="..\media\how-to\assistants\logic-apps\create-logic-app-7.png" alt-text="A screenshot showing the response action." lightbox="..\media\how-to\assistants\logic-apps\create-logic-app-7.png":::

     In the response action, you can pick the output from any of the prior steps. You can optionally also provide a JSON schema if you want to return the output in a specific format.
    
    :::image type="content" source="..\media\how-to\assistants\logic-apps\create-logic-app-7.png" alt-text="A screenshot showing the comment box to specify a JSON schema." lightbox="..\media\how-to\assistants\logic-apps\create-logic-app-7.png":::

1. The workflow is now ready. In Azure OpenAI Studio, you can import this function using the **Add function** feature in the Assistants playground.


## Import your Logic Apps workflows as functions

Here are the steps to import your Logic Apps workflows as function in the Assistants playground in Azure OpenAI Studio:

1. In Azure OpenAI Studio, select **Assistants**. Select an existing Assistant or create a new one. After you have configured the assistant with a name and instructions, you are ready to add a function. Select **+ Add function**. 

    :::image type="content" source="..\media\how-to\assistants\logic-apps\assistants-playground-add-function.png" alt-text="A screenshot showing the Assistant playground with the add function button." lightbox="..\media\how-to\assistants\logic-apps\assistants-playground-add-function.png":::

1. The **Add function** option opens a screen with two tabs. Navigate to the tab for Logic Apps to browse your workflows with a request trigger. Select the workflow from list and select **Save**.  

    > [!NOTE]
    > This list only shows the consumption SKU workflows and with a request trigger.


    :::image type="content" source="..\media\how-to\assistants\logic-apps\import-logic-apps.png" alt-text="A screenshot showing the menu for adding functions." lightbox="..\media\how-to\assistants\logic-apps\import-logic-apps.png":::

You have now successfully imported your workflow and it is ready to be invoked. The function specification is generated based on the logic apps workflow swagger and includes the schema and description based on what you configured in the request trigger action.

:::image type="content" source="..\media\how-to\assistants\logic-apps\edit-function.png" alt-text="A screenshot showing the imported workflow." lightbox="..\media\how-to\assistants\logic-apps\edit-function.png":::

The workflow now will be invoked by the Azure OpenAI Assistants based on the user prompt. Below is an example where the workflow is invoked automatically based on user prompt to get the weather.

:::image type="content" source="..\media\how-to\assistants\logic-apps\playground-weather-example.png" alt-text="A screenshot showing a weather prompt example." lightbox="..\media\how-to\assistants\logic-apps\playground-weather-example.png":::

You can confirm the invocation by looking at the logs as well as your [workflow run history](../../../logic-apps/monitor-logic-apps.md?tabs=consumption.md#review-workflow-run-history).


:::image type="content" source="..\media\how-to\assistants\logic-apps\example-log.png" alt-text="A screenshot showing a logging example." lightbox="..\media\how-to\assistants\logic-apps\example-log.png":::

## FAQ 

**What are Logic App connectors?**

Azure Logic Apps has connectors to hundreds of line-of-business (LOB) applications and databases including but not limited to: SAP, Salesforce, Oracle, SQL, and more. You can also connect to SaaS applications or your in-house applications hosted in virtual networks. These out of box connectors provide operations to send and receive data in multiple formats. Leveraging these capabilities with Azure OpenAI assistants, you should be able to quickly bring your data for Intelligent Insights powered by Azure OpenAI.

**What happens when a Logic Apps is imported in Azure OpenAI Studio  and invoked**

The Logic Apps swagger file is used to populate function definitions. Azure Logic App publishes an OpenAPI 2.0 definition (swagger) for workflows with a request trigger based on [annotations on the workflow](/rest/api/logic/workflows/list-swagger). Users are able to modify the content of this swagger by updating their workflow. Azure OpenAI Studio  uses this to generate the function definitions that the Assistant requires.  

**How does authentication from Azure OpenAI Studio  to Logic Apps work?**

Logic Apps supports two primary types of authentications to invoke a request trigger.

* Shared Access Signature (SAS) based authentication.
    
    Users can obtain a callback URL containing a SAS using the [list callback URL](/rest/api/logic/workflows/list-callback-url) API. Logic Apps also supports using multiple keys and rotating them as needed. Logic Apps also supports creating SAS URLs with a specified validity period. For more information, see the [Logic Apps documentation](../../../logic-apps/logic-apps-securing-a-logic-app.md#generate-shared-access-signatures-sas).

* Microsoft Entra ID-based OAuth base authentication policy.

    Logic Apps also supports authentication trigger invocations with Microsoft Entra ID OAuth, where you can specify authentication policies to be used in validating OAuth tokens. For more information, see the [Logic Apps documentation](../../../logic-apps/logic-apps-securing-a-logic-app.md#generate-shared-access-signatures-sas).

When Azure OpenAI Assistants require invoking a Logic App as part of function calling, Azure OpenAI Studio  will retrieve the callback URL with the SAS to invoke the workflow. 

## See also

* [Learn more about Assistants](../concepts/assistants.md)