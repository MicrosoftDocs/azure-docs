---
title: Exporting ISE Workflows to Logic Apps Standard
description: Learn how to use the VS Code Extension to export logic apps workflows from an Integration Service Environment (ISE) to a Logic App Standard project.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, wsilveira
ms.topic: walkthrough
ms.date: 08/11/2022
#Customer intent: As a developer, I want to export one or more ISE workflows to a Logic App Standard workflow.
---

# Exporting ISE Workflows to Logic Apps Standard

> [!NOTE]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The Logic App Standard sku adds a sleuth of new or improved functionality to the Logic Apps ecosystem such as Virtual Network (VNET) integration, private endpoints, compute isolation – in combination with Application Services Environment, low latency – with stateless Logic Apps, local debugging and development, and more.

Logic Apps Standard can be used to replace Integration Services Environment (ISE), on most of the scenarios where ISE was initially required – network integration or isolation and compute isolation, for example. But moving from ISE to Logic Apps Standard requires moving workflows that are already implemented in that platform to a Logic App Standard Application. The Export feature on the VS Code Extension now provide you with the ability to export logic apps workflows from ISE to a local Logic App Standard project, where will be able to test locally, amend your workflows as required and get it ready to be deployed directly from VS Code or to plug it on your DevOps process.

> [!NOTE] This is not a migration tool. Exporting will replicate the workflow definition, connections, and any integration artefacts into a Standard Logic App VS Code > project. ISE Logic Apps being exported will not be deleted, meaning all run and trigger history will be preserved. As a user you are in complete control on when you > complete a migration, opting to delete or disable your previous Logic App, once you have testing and validated your workflows on the new platform.*

## Scope

The export tool will allow you to combine a group of ISE Logic Apps into a Standard Logic Apps project, pre-validating your group of Logic Apps workflows so you don’t miss any dependencies when grouping workflows to export. It is recommended grouping workflows per logic app that share the same resources such as maps and schemas or are used in a chain of Logic App processes. Recommendations on how many workflows per logic app can be found here.

The export tool will not export infrastructure related information – e.g. Virtual Network configuration or Integration Account settings.

## Pre-requisites

The export tool is part of the Logic Apps Standard extension for VS Code. Follow the instructions [here](https://docs.microsoft.com/en-us/azure/logic-apps/create-single-tenant-workflows-visual-studio-code#prerequisites) to setup VSCode and all the pre-requisites required for the Logic Apps Standard Extension.

# Known Issue

Not all Logic Apps workflows are eligible for export. Please review the list of scenarios not able to be migrated now:

-   Consumption Logic Apps (with UX)
-   Logic Apps with Custom Connections
-   Logic Apps which include the API Management Connector action
-   Logic Apps which include the Function Connector action
-   User must be in the same network as the ISE in order to run the Export process.

## Concurrency Settings

Although Logic Apps with triggers containing concurrency settings will be exported, logic apps runtime will ignore these settings.

## Core Connectors Exported

ISE Core Connectors will be deployed as managed connectors. As new service provider connectors with the same level of functionality to core connectors are released in public preview or GA, the export tool will incorporate the ability to migrate them to service providers. When a core connector is available to be exported as service provider, the tool will make the conversion automatically

## Allowed action types for export

-   
-   Http,
-   Recurrence,
-   Wait,
-   ApiConnection,
-   ApiConnectionWebhook,
-   Response,
-   HttpWebhook,
-   Compose,
-   Scope,
-   Request,
-   If,
-   Foreach,
-   Until,
-   Terminate,
-   Switch,
-   ParseJson,
-   Table,
-   Join,
-   Select,
-   InitializeVariable,
-   IncrementVariable,
-   DecrementVariable,
-   SetVariable,
-   AppendToArrayVariable
-   AppendToStringVariabl
-   JavaScriptCode

## Allowed trigger types for export

-   Http,
-   HttpWebhook,
-   ApiConnection,
-   ApiConnectionWebhook,
-   Recurrence,
-   Request,
-   ApiConnectionNotification

## **Export Process Walkthrough**

Follow the steps below to export a group of logic apps workflows from ISE to a local project

1.  At the logic apps standard extension, click the export button

    ![](media/export-ise-to-logicapp-standard/fffb58280c7978bc9fc543ad3c1f5d5b.png)

    1.  Select the correct subscription and ISE environment, then click next

        ![](media/export-ise-to-logicapp-standard/38b590b538689ae247883a61c22e4e6e.png)

    2.  Select the logic app that you want to export. Each logic app selected will be added to the selected list on the side. Once the logic app list is selected, then click next.

        ![](media/export-ise-to-logicapp-standard/a7a63c79d11eb2962014e86152c5c660.png)

    3.  Review the validation results – logic apps that pass validation or present warnings are still eligible to be exported. Logic apps with validation exceptions can’t be exported and will need to be removed from the list.

        ![Graphical user interface, application Description automatically generated](media/export-ise-to-logicapp-standard/7ffec446130b6b1b8567b3198042bb67.png)

        The icons above indicate the type of validation result returned by the tool:

| Validation Icon                                 | Validation Type                                                                                                                                                                                                                                            |
|-------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ![failed icon](media/export-ise-to-logicapp-standard/ed124fa0b89b54e8215a8fbcdb82af41.png) | Item failed validation – export cannot continue. The item that failed validation will be automatically expanded and will provide a text explaining the validation failure reason                                                                           |
| ![warning icon](media/export-ise-to-logicapp-standard/6e151f804ceb7e99d9d9b8f2a5f25b3a.png) | Item passed validation with warning – the export can continue, but some post export remediation will be required. The item that generated the warning will be automatically expanded and will provide text explaining the required post export remediation |
| ![success icon](media/export-ise-to-logicapp-standard/00170f23affdd69e88799af456e1e177.png) | Item passed validation – export can continue and no other remediation is required.                                                                                                                                                                         |

Logic Apps with exceptions must be fixed at the source before being exported. You must click back and remove any logic app that didn’t pass validation before continuing.

In cases where all logic apps pass validation (with or without warnings) the export button will become available, like in the screenshot below. In this case, click on export (or export with warnings) to continue.

![Graphical user interface](media/export-ise-to-logicapp-standard/6df3b0eb7fffb476f468def053ad630f.png)

1.  Once the logic apps are ready to be exported, you must provide a location for the new VS Code project folder and click on export (or export with warnings) to complete the export

    ![Graphical user interface](media/export-ise-to-logicapp-standard/20f144d4fa87fe2f4932d6ceb9d9caf4.png)

    Alternatively, if your logic app have managed connections and you want to deploy it, you must also provide an existing resource group where the managed connections will be deployed. Notice that at this stage, connection credentials will not be cloned from the original logic app, so you will need to reauthenticate the connections after export, before your logic app workflows can work.

    ![Graphical user interface](media/export-ise-to-logicapp-standard/dedaf1ca05c4cb04dc5d1477548c09f4.png)

    1.  The export will download and expand the project in the location you selected – it will also deploy connections if you selected that option. After this is complete, a new workspace will be open. It is now safe to close the export window.

        ![Graphical user interface](media/export-ise-to-logicapp-standard/9b60085b2dfb3730904ba62ec5616911.png)

    2.  Start reviewing the README.md file for post deployment steps, in the new window

        ![Graphical user interface](media/export-ise-to-logicapp-standard/963243b07024d8281ddab6b7991732ea.png)

## Post-deployment steps

## Integration Account actions and content

When exporting actions that are dependent on an Integration account will need to manually configure a reference to an integration account containing the required artefacts. Follow the instructions here to configure an integration account on Logic Apps Standard.

## Post-deployment remediation

Some Logic Apps will require remediation steps post export to run on the Standard platform. Take note of the remediation steps and make sure you test your new Standard resource before making any changes to your original Consumption Logic App. You will find all the necessary post deployment steps in the README.md file generated as part of the export.

# Folder Structure

You will find a new set of files and folders created on the Logic App Standard project after executing the export tool. The table below describes each file appended:

| Folder                    | File                                           | Description                                                                                                              |
|---------------------------|------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| .development\\ deployment | LogicAppStandardConnections.parameters.json    | ARM template parameters file for deployment of Managed Connectors                                                        |
|                           | LogicAppStandardConnections.template.json      | ARM template definition for deployment of Managed Connectors                                                             |
|                           | LogicAppStandardInfrastructure.parameters.json | ARM template parameters file for deployment of Logic App Standard App                                                    |
|                           | LogicAppStandardInfrastructure.template.json   | ARM template definition for deployment of Logic App Standard App                                                         |
| .logs/export              | exportReport.json                              | Export Report summary raw file, which includes all the steps required for post deployment remediation                    |
|                           | exportValidation.json                          | Validation Report raw file, which includes validation results for each logic app exported.                               |
|                           | README.md                                      | Markdown file with a summary of the export result, including the list of logic apps created and all required next steps. |

