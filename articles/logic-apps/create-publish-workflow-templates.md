---
title: Create and publish workflow templates
description: How to create workflow templates for use in Azure Logic Apps and share templates with others through the template gallery.
services: azure-logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 06/16/2025
#Customer intent: As a developer, I want to create and share workflow templates for use with Azure Logic Apps.
---

# Create and publish workflow templates for Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

Azure Logic Apps provides prebuilt, reusable automation and integration workflow templates that you can use to speed up the process of building integration applications. These templates follow commonly used patterns and help you streamline development by providing a starting point or baseline with predefined business logic and configurations.

Not only can you kickstart development by using workflow templates, you can create and publish workflow templates for your organization's use alone within an Azure subscription or share them with others. Your template can include artifacts such as schemas, maps, and custom assemblies.

Organizational templates let you standardize integration patterns, share best practices, and reuse solutions across your enterprise internally without making them public. This capability is especially useful for businesses that want to promote consistency while keeping options open for flexibility. Whether your scenarios include embedding internal APIs, handling domain-specific logic, or enforcing architectural patterns, organizational templates help you scale and grow while you stay in control.

To add your template to the templates gallery in the Azure portal, create a template package by using this how-to guide. When you're done, visit the [workflow template repository in GitHub for Azure Logic Apps](https://github.com/Azure/LogicAppsTemplates) where you can create a pull request for your template package and have the Azure Logic Apps team review your template.

Azure Logic Apps templates also give you the following capabilities:

- Publish templates in test or production mode, which allow you to safely experiment and gate keep releases.

- Directly use APIs and internal systems in templates without having to externalize them.

- Download template packages and optionally add them to the public workflow template repository in GitHub.

- Graduate your templates from test to production by using the built-in lifecycle management in Azure DevOps, which gives your team structure but preserves agility.

- As first-class resources in Azure, templates support Azure role-based access control (RBAC).

  - You can manage template permissions like any other Azure resource.

    These permissions respect subscription and role scopes, which means developers can see and access only those templates in subscriptions where developers have access.

    This capability provides enterprise-grade control over who can author, view, and deploy templates. You have full control over the way that you want organize templates so that you can make sure the right teams get access to the automation patterns they need.

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- The deployed Consumption or Standard logic app resource and workflow to use as the source workflow definition for the template.

  If you don't have this resource, see [Create an example Standard logic app workflow](create-single-tenant-workflows-azure-portal.md). Your logic app resource and workflow must be deployed before you create your template. Also, make sure that any values that the workflow user must provide are correctly parameterized, rather than hardcoded. 

- Screenshots that show a read-only preview for the workflow template with **.png** file name extension. These preview images for template appear on the template overview pane in the templates gallery.

  To create these images, follow these steps:

  1. In the [Azure portal](https://portal.azure.com), open the Standard logic app and source workflow in the designer.

  1. Set up the workflow to create two screenshots: one version that works with a web browser's light theme and another version that works with a web browser's dark theme.

  1. Create the screenshots using your preferred screen capture tool. Don't include too much whitespace around the workflow.

  1. Save each image using the **.png** file name extension and a name that follows the [Names and style conventions](#names-style-conventions), for example, **<*image-name*>-light.png** and **<*image-name*>-dark.png**.

<a name="workflow-best-practices"></a>

## Workflow best practices

- Use the built-in operations as much as possible. For example, the Azure Blob Storage connector has the following versions available for Standard workflows:

  - A built-in, service provider version, which appears in the connectors gallery under the **Built-in** filter. This version is hosted and run with the single-tenant Azure Logic Apps runtime, offering better performance, throughput, and other benefits.

  - A Microsoft-managed API version, which appears in the connectors gallery with the **Shared** label. This version is hosted and run in multitenant Azure using shared global resources.

- Don't use hardcoded properties and their values in trigger and action definitions.

- Provide more context about trigger and action definitions by adding descriptive and helpful comments.

## Create a workflow template

### [Portal](#tab/portal)

To create your workflow template through the Azure portal, follow these steps:

1. In the [Azure portal](https://portal.azure.com) search box, find and select **logic apps templates**.

1. On the **Logic Apps Templates** page toolbar, select **Create**.

1. On the **Create an Azure Logic Apps template** page, on the **Basics** tab, provide the following information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Subscription** | Yes | <*Azure-subscription-name*> | The Azure subscription to use with the workflow template. |
   | **Resource group** | Yes | <*resource-group-name*> | The name for the Azure resource group to use with the template. |
   | **Name** | Yes | <*template-name*> | The name for the workflow template resource. |
   | **Region** | Yes | <*Azure-region*> | The Azure region for where to create the workflow template resource. |

1. When you're done, select **Review + create**. Review the provided information, and select **Create**.

   Azure creates the template resource.

Next, choose the source workflow definition to use for your template.

#### Choose the source workflow definition

1. On the template resource menu, under **Template**, select **Template**.

1. On the **Template** page, on the **Workflows** tab, select **Manage workflows**.

1. On the **Manage workflows** pane, on the **Choose workflows** tab, provide the following information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Subscription** | Yes | <*Azure-subscription-name*> | The name for the Azure subscription with the source logic app. |
   | **Resource group** | Yes | <*resource-group-name*> | The name for the Azure resource group with the source logic app. |
   | **Logic app instance** | Yes | <*source-logic-app*> | The name for the source Standard logic app with the workflow that you want to use. |
   | **Workflows** | Yes | <*source-workflows*> | Select at least one workflow to use in your template. |

1. When you're done, select **Next**.

1. On the **Set up workflows** tab, provide the following information for each selected source workflow:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Workflow name** | Yes | <*JSON-workflow-name*> | The JSON name for the workflow that can use only lowercase letters, numbers, and hyphens and which you can rename only one time. |
   | **Workflow display name** | Yes | <*workflow-friendly-name*> | The friendly name that appears in the user interface. |
   | **State** | Yes | **Stateful** or **Stateless** | Whether to save and store workflow run history, operation inputs, and operation outputs, by default. |
   | **Summary** | Yes | <*short-description*> | A short high-level summary about purpose for the template. |
   | **Description** | No | <*detailed-description*> | A description with more detailed information about the template. |
   | **Prerequisites** | No | <*prerequisites*> | Any requirements that you need before you can use the template. |

1. In the **Workflow images** section, provide the workflow preview images to use for the template overview pane in the templates gallery. This pane includes other template information.

   | Workflow image | Description |
   |----------------|-------------|
   | **Light mode image** | The light-themed preview image for your template. |
   | **Dark mode image** | The dark-themed preview image for your template. |

1. When you're done, select **Save**.

1. On the **Connections** tab, review and confirm the connections that Azure automatically pulls from the source workflows.

   You don't have to take any other actions.

1. When you're ready, select **Next**.

#### Customize parameters

On the **Parameters** tab, add customization for any parameters that you want for the workflow.

1. On the **Parameters** tab, select the edit icon for the parameter.

1. Provide the following information for the parameter:

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Display name** | Yes | The parameter name that appears in Azure portal. |
   | **Default value** | No | The default value for the parameter. |
   | **Description** | No | The description for parameter's purpose. |
   | **Required Field** | No | Whether or not the workflow requires the parameter. |

1. When you're done, select **Save**.

#### Provide template information

The **Profile** tab specifies information about your template that appears in the template gallery, for example, the template's display name, publisher name, connectors, and other metadata.

| Property | Required | Description |
|----------|----------|-------------|
| **Display name** | Yes | The workflow template display name that appears in the template gallery. |
| **By** | Yes | The workflow template publisher name. |
| **Summary** | Yes | The description for the workflow that the template creates. |
| **Featured connectors** | Yes | The names for the primary connectors in the workflow template. |
| **Category** | No | The category where the template belongs. |
| **Tags** | No | Any tags that you want to use for labeling the workflow. |

### [Manual](#tab/manual)

For the manual approach to create a template, you need to create a template package. 

#### What is in a template package?

The following table describes the required and optional files in a template package:

| File name | Required | Description |
|-----------|----------|-------------|
| **workflow.json** | Yes | A JSON file with your workflow definition. |
| **manifest.json** | Yes | A JSON file with information about your workflow and related components. |
| **<*image-name*>-dark.png** | Yes | An image file with the workflow as a read-only screenshot in **.png** format and works with a browser's dark theme. |
| **<*image-name*>-light.png** | Yes | An image file with the workflow as a read-only screenshot in **.png** format and works with a browser's light theme. |
| **<*map-name*>.json**, **.xml**, or **.xslt** | No | Any artifacts such as maps and schemas that support your workflow template. |
| **<*custom-assembly*>.dll** | No | Any custom assemblies that support your workflow template. |
| **readme.md** | No | A Markdown file with instructions, procedures, or other information for your workflow template. |

You can also include any other files to maintain and support your template, for example, files with test or sample data.

#### Create a template package folder

- Before you create the template package folder, get familiar with [Names and style conventions](#names-and-style-conventions).

- To keep the template repository easier to browse, organize, and maintain, use the following syntax for your folder name and the fewest number of words to avoid exceeding the character limit for file paths:

  **<*workflow-task*>-<*product*>-<*pattern-or-protocol*, if any>**

  For examples, see the [workflow template repository for Azure Logic Apps in GitHub](https://github.com/Azure/LogicAppsTemplates). 

- To correctly register your template package folder, you must add the folder name to the [repository's root-level manifest.json file](https://github.com/Azure/LogicAppsTemplates/blob/main/manifest.json).

#### Create a workflow.json file

The **workflow.json** file contains the underlying definition for a workflow in JSON format. To create the **workflow.json** file, you need to copy and save your workflow definition as a file named **workflow.json**.

For the easiest and best way to get the workflow definition, create your workflow using the designer. Make sure to review [Workflow best practices](#workflow-best-practices) along with [Names and style conventions](#names-and-style-conventions). Or, as a starting point, you can use the prebuilt workflow templates from the template gallery in the Azure portal.

As you build your workflow, the designer automatically includes references to any added built-in, service provider connections, managed API connections, or libraries in the underlying workflow definition.

After you're done, [copy the underlying workflow definition](#copy-workflow-definition) to an empty **workflow.json** file.

<a name="copy-workflow-definition"></a>

#### Copy the underlying workflow definition

1. In the [Azure portal](https://portal.azure.com), on the workflow menu, under **Developer**, select **Code**.

1. From the code view window, copy the entire workflow definition, for example:

   :::image type="content" source="media/create-publish-workflow-templates/standard-workflow-code-view.png" alt-text="Screenshot shows Azure portal, code view window, and Request-Response workflow definition." lightbox="media/create-publish-workflow-templates/standard-workflow-code-view.png":::

1. In an empty file named **workflow.json**, save the workflow definition.

#### Parameter references in workflow.json

When you reference parameters in the **workflow.json** file, you must reflect the parameter names that use the suffix **_#workflowname#** in the following way:

**`"name": "@parameters('<parameter-name>_#workflowname#')"`**

For example:

**`"name": "@parameters('sharepoint-folder-path_#workflowname#')"`**

#### Connection references in workflow.json

When you reference connections in the **workflow.json** file, you must reflect the connection names that use the suffix **_#workflowname#** in the following way:

```json
"referenceName": "<connector-ID>_#workflowname#",
"connectionName": "<connector-ID>_#workflowname#"
```

For example:

```json
"referenceName": "azureaisearch_#workflowname#",
"connectionName": "azureaisearch_#workflowname#"
```

For more information about the connector ID, see [Find the connector ID](#find-connector-id).

#### Create a manifest.json file

The **manifest.json** file describes the relationship between a workflow and related components. Currently, you need to manually create this file, or you can repurpose the **manifest.json** file from an existing prebuilt template in the [Azure Logic Apps workflow template repository in GitHub](https://github.com/Azure/LogicAppsTemplates). As you create the **manifest.json** file, make sure to review the [names and style conventions](#names-and-style-conventions).

The following table describes the attributes in the **manifest.json** file:

| Attribute name | Required | Value | Description |
|----------------|----------|-------|-------------|
| **`title`** | Yes | <*template-title*> | The title that appears in the templates gallery, which opens when you add a workflow from a template in the Azure portal. |
| **`description`** | Yes | <*template-description*> | The template description, which appears on the template's overview pane in the template gallery. |
| **`prerequisites`** | No | <*template-prerequisites*> | Any prerequisites to meet for using the template. Appears in the template's overview pane. You can link to other documents from this section. |
| **`tags`** | No | <*template-tags-array*> | The template tags to use for searching or filtering templates. |
| **`skus`** | Yes | **`standard`**, **`consumption`** | The logic app workflow type supported by the template. If you're not sure, use **`standard`**. |
| **`kinds`** | No | **`stateful`**, **`stateless`** | The workflow mode, which determines whether run history and operation states are stored. <br><br>By default, all workflows are available in both stateful and stateless mode. If your workflow only runs in stateful mode, use this attribute to make this requirement explicit. |
| **`detailsDescription`** | No | See description. | Any other detailed description information for the template. |
| **`details`** | No | See description. | Template information to use for filtering the templates gallery. <br><br>- **`By`**: The template publisher, for example, **`Microsoft`**. <br><br>- **`Type`**: **`Workflow`** <br><br>- **`Trigger`**: The trigger type, for example, **`Recurrence`**, **`Event`**, or **`Request`**. |
| **`artifacts`** | Yes | <*artifacts-array*> | All the relevant files in the template package and includes the following attributes: <br><br>- **`type`**: The file type, which determines the appropriate location for where to copy the file, for example, **`workflow`**. <br><br>- **`file`**: The file name and extension, for example, **workflow.json**. | 
| **`images`** | Yes | See description. | The workflow image file names for both browser light and dark themes: <br><br>- **`light`**: Image name for light theme, for example, **workflow-light**  <br><br>- **`dark`**: Image name for dark theme, for example, **workflow-dark**. |
| **`parameters`** | Yes, but can be empty if none exist | <*workflow-parameters-array*> | The parameters for the actions in the workflow template. For each parameter, you need to specify the following properties: <br><br>- **`name`**: The parameter name must have the suffix, **`_#workflowname#`**. Use only alphanumeric characters, hyphens or underscores, and follow this format: <br><br>**`<parameter-name>_#workflowname#`** <br><br>- **`displayName`**: The parameter's friendly display name. See [Names and style conventions](#names-style-conventions). <br><br>- **`type`**: The parameter's data type, for example, **`String`** or **`Int`**. <br><br>- **`default`**: The parameter's default value, if any. If none, leave this value as an empty string. <br><br>- **`description`** The parameter's details and other important or helpful information. <br><br>- **`required`**: **`true`** or **`false`** |
| **`connections`** | Yes, but can be empty if none exist. | <*connections-array*> | The connections to create using the workflow template. Each connection has the following properties: <br><br>-**`connectorId`**: The connector ID must have the suffix, **`_#workflowname#`**. Use only alphanumeric characters, hyphens or underscores, and follow this format: <br><br>**`<connector-ID>_#workflowname#`** <br><br>To find the connector ID, see [Find the connector ID](#find-connector-id). <br><br>- **`kind`**: The connector's runtime host type, which is either **`inapp`** for built-in operations and service provider connectors or **`shared`** for managed, Azure-hosted connectors. In the connectors gallery, built-in operations and service provider connectors are labeled as **In App**, while managed connectors are labeled as **Shared**. |
| **`featuredConnections`** | No | <*featured-connections-array*> | By default, the template gallery shows icons for the prebuilt operations and connectors in Azure Logic Apps used by each template. To include icons for any other operations, you can use the **`featuredConnections`** attribute. Each operation must have the following attributes: <br><br>- **`kind`**: The operation kind <br><br>- **`type`**: The operation type <br><br>To find these values, see [Find the operation kind and type for featuredConnections section](#find-featured-connections-operation-properties). |

In the **manifest.json** file for your workflow template package, add the same image names to the **`images`** section without the **.png** file name extension, for example:

   ```json
   "images": {
       "dark": "workflow-dark",
       "light": "workflow-light"
   }
   ```
<a name="find-connector-id"></a>

#### Find the connector ID

To find the connector ID to use for a connection in the **manifest.json** file or a connection reference in the **workflow.json** file, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

1. On the logic app menu, under **Workflows**, select **Connections**.

1. Select the **JSON View** tab.

1. Based on the connection type, follow these steps:

   - For a managed, "shared" API connection that is hosted and run in Azure:

     1. Find the **`managedApiConnections`** section.

     1. In the **`connection`** attribute, copy and save the **`id`** value, but replace any personal or sensitive data, such as the subscription ID, resource group name, and so on, with **`#<item>#`**:

        **`/subscriptions/#subscription#/providers/Microsoft.Web/locations/#location#/managedApis/<connection-name>`**

        For example, the following text shows the connector ID for the SharePoint connector:

        **`/subscriptions/#subscription#/providers/Microsoft.Web/locations/#location#/managedApis/sharepointonline`**

   - For a service provider connection that is hosted on the single-tenant Azure Logic Apps runtime:

     1. Find the **`serviceProviderConnections`** section.

     1. For each connection, find the **`id`** attribute in the **`serviceProvider`** attribute.

     1. Copy and save the following value:

        **`/serviceProviders/<connection-name>`**

        For example, the following text shows the connector ID for the Azure AI Search connector:

        **`/serviceProviders/azureaisearch`**.

<a name="find-featured-connections-operation-properties"></a>

#### Find the operation 'kind' and 'type' properties for featuredConnections

In the **manifest.json** file, the **`featuredConnections`** section can include icons for any other operations that you want to include with the template gallery in the Azure portal. For this section, which is an array, you need to provide the **`kind`** and **`type`** attributes for each operation.

To get these attribute values, follow these steps in the [Azure portal](https://portal.azure.com) with your opened workflow:

1. On the workflow menu, under **Developer**, select **Code**.

1. In the code view window, in the **`actions`** section, find the operation that you want, and then find the **`kind`** and **`type`** values.

#### Add template package to GitHub repository

To publish your template package to the templates gallery in the Azure portal, set up GitHub, and create a pull request with your template package for validation and review:

1. [Create a GitHub account](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github), if you don't have one.

   For more information, see [Get started with your GitHub account](https://docs.github.com/en/get-started/onboarding/getting-started-with-your-github-account).

1. Go to the [workflow template repository named **LogicAppsTemplates** for Azure Logic Apps in GitHub](https://github.com/Azure/LogicAppsTemplates).

1. Create your own [fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks), which is a remote copy of the **LogicAppsTemplates** repository in GitHub.

   For more information, see [Forking a repository](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project?tool=webui#forking-a-repository).

1. To work locally, clone your fork onto your computer.

   1. [Follow these steps to download, install, and set up Git](https://docs.github.com/en/get-started/getting-started-with-git/set-up-git).

   1. Go to your fork, which has the following URL:
   
      **`https://github.com/<your-username>/LogicAppsTemplates`**

   1. On your local computer, create a folder named **GitHub**, if you don't have one already. Don't clone to a OneDrive synced folder.

   1. [Follow these steps to clone *your* fork, not the production repository](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project?tool=webui#cloning-a-fork).

   1. In your local repository, [follow these steps to create a working branch](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project?tool=webui#creating-a-branch-to-work-on).

   1. After you check out your working branch, go to the root level in your local repository, and create the template package folder.

   1. Add your template files to the template package folder, and update the root-level **manifest.json** file with the folder name.

   1. When you're ready to commit your changes to your local repository, which is like saving a snapshot, run the following commands using the Git command-line tool or other tools:

      **`git add .`**

      **`git commit -m "<commit-short-description>"`**

   1. To upload your snapshot to your remote fork, run the following command:

      **`git push origin <your-working-branch>`**

1. In GitHub, create a pull request to compare **<*your-working-branch*>** with the **main** branch in the **LogicAppsTemplates** repository.

   1. Go to the repository's **Pull requests** page, and select **New pull request**.

   1. Under **Compare changes**, select **Compare across forks**.

   1. Make sure that your pull request has the following settings, and then select **Create pull request**.

      | Base repository | Base | Head repository | Compare |
      |-----------------|------|-----------------|---------|
      | **Azure/LogicAppsTemplates** | **main** | **<*user-name*>/LogicAppsTemplates** | **<*your-working-branch*>** |

      :::image type="content" source="media/create-publish-workflow-templates/github-pull-request.png" alt-text="Screenshot shows GitHub and pull request settings." lightbox="media/create-publish-workflow-templates/github-pull-request.png":::

   1. Enter a title and description for your pull request. To finish, select **Create pull request**.

   1. Wait for the Azure Logic Apps team to review your pull request.

   For more information, see [Creating a pull request from a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork).

---

<a name="names-style-conventions"></a>

## Names and style conventions

| Area | Convention |
|------|------------|
| Sensitive data | Don't include or upload personal and sensitive data in template files, screenshots, descriptions, or test data. For example, this data includes subscription IDs, usernames, passwords, and so on. |
| Folder names | For easier readability, use lowercase and hyphens when possible. See [Capitalization – Microsoft Style Guide](/style-guide/capitalization). |
| Image file names | Use the **.png** as the file name extension, lowercase, and hyphens, for example, **workflow-light.png**. |
| Product, service, technology, and brand names | Follow the official spelling and capitalization. For example: <br><br>- When you refer to the service name or platform, use "Azure Logic Apps", not "Logic Apps". <br><br>- When you refer to the resource or instance, use "logic apps" or "logic app", not "Logic App" or "Logic Apps". <br><br>- When you refer to the sequence of trigger and actions, use "logic app workflow" or "workflow". |
| Abbreviations and acronyms | Use the expanded name for product, service, technology, brand names, and uncommon technical terms, not abbreviations or acronyms. Common acronyms, such as "HTTP" and "URL", are acceptable. For example, use "Visual Studio Code", not "VS Code". See [Acronyms – Microsoft Style Guide](/style-guide/acronyms). |
| Other text | - Use sentence case for titles, headings, and body content, which means that you capitalize only the first letter unless you have product, service, technology, or brand name. <br><br>- Don't capitalize ordinary nouns and articles, such as "a", "an", "and", "or", "the", and so on. |
| Voice | - Use second person voice (you and your), rather than third person (users, developers, customers) unless you need to refer to specific roles. See [Person – Microsoft Style Guide](/style-guide/grammar/person). <br><br>- Use an active, direct, but friendly tone when possible. Active voice focuses on the subject and verb in text, while passive voice focuses on the object in text. |
| Vocabulary | - Use simple, common, everyday words, such as  "use", rather than "utilize" or "leverage". <br><br>- Don't use words, phrases, jargon, colloquialisms, idioms, or slang that don't translate well across languages. <br><br>-	Use "please" only for specific scenarios. See [please – Microsoft Style Guide](/style-guide/a-z-word-list-term-collections/p/please). <br><br>- Use "for example" or "such as", not "e.g." or "i.e.". <br><br>- Don't use directional terms such as "here", "above", "below", "right", and "left", which aren't accessible friendly. |
| Punctuation | -	For a series of items, include the last comma before the conjunction, such as "and". For example, "apples, oranges, and bananas". See [Commas – Microsoft Style Guide](/style-guide/punctuation/commas). <br><br>- End full sentences with appropriate punctuation. Don't use exclamation points. See [Punctuation – Microsoft Style Guide](/style-guide/punctuation/). |
| Formatting | - For code, follow the style convention for that code's language. <br><br>- Don't use hardcoded links, which break if the URLs change. In your PR request, ask for a redirection link to use instead. <br><br>- For links, use the following format: <br><br>"`For more information, see [descriptive-link-text](URL)]`.". <br><br>- Use descriptive link text, not generic or vague link text, such as "`See [here](URL)`." <br><br>- Use numbers only for steps in a procedure, not for lists that have no specific order. See [Lists – Microsoft Style Guide](/style-guide/scannable-content/lists). <br><br>- Use only one space after punctuation unless you're indenting code. |

For more guidance, see the [Microsoft Style Guide](/style-guide/welcome/) and [Global writing tips](/style-guide/global-communications/writing-tips).

## Related content

[Create a Standard logic app workflow from a prebuilt template](create-single-tenant-workflows-templates.md)
