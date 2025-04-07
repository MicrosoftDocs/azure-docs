---
title: Create Playbooks for Microsoft Sentinel Solutions
description: This article guides you through the process of creating and publishing playbooks for Microsoft Sentinel solutions.
author: anilgodavarthy
ms.author: angodavarthy
ms.service: microsoft-sentinel
ms.topic: conceptual 
ms.date: 1/23/2025

#CustomerIntent: As a ISV partner, I want to create and publish playbooks for my Microsoft Sentinel solution so that I can provide inbuilt automation use cases to my customers.
---

# Create and publish playbooks for Microsoft Sentinel solutions

Playbooks in Microsoft Sentinel are sets of procedures that can respond to incidents, alerts, or specific entities. They help automate responses and can be set to run automatically when certain alerts or incidents occur. Playbooks can also be run manually.

This article uses example scenarios to walk you through the process of creating and publishing playbooks for Microsoft Sentinel solutions.

## Use cases for Microsoft Sentinel playbooks

Due to the growing number of alerts and incidents, security operations center (SOC) analysts can't manually handle everything. To maximize the benefits of Microsoft Sentinel, it's crucial to determine which automations help SOC analysts with each detection in your solution. Here are some of the common scenarios for playbooks:

- **Incident enrichment**: Enhance alerts with additional information for efficient investigation and resolution. Example: Collect more data on IP addresses associated with an incident.
- **Sync with ticketing systems**: Synchronize Microsoft Sentinel incidents with other systems (like ServiceNow) bidirectionally. Example: On incident creation, sync details with a ServiceNow ticket. For more information, see the [ServiceNow connector reference](/connectors/service-now/).
- **Automated response**: Take automated actions in response to suspicious activities. Example: Send a Teams message to the user for confirmation if a suspicious action is detected.

To understand more about potential use cases for playbooks, see [Recommended playbook use cases, templates, and examples](/azure/sentinel/automation/playbook-recommendations).

## Create and publish playbooks for example scenarios

Microsoft Sentinel playbooks are based on Azure Logic Apps, a cloud platform that enables the creation and execution of automated workflows with minimal to no coding. You can use the visual designer and select prebuilt operations to efficiently build workflows that integrate and manage your applications, data, services, and systems. For more information, see [What is Azure Logic Apps?](/azure/logic-apps/logic-apps-overview).

Logic Apps includes numerous out-of-the-box connectors, such as Salesforce, Office 365, and SQL Server. These connectors offer no-code options for various functions. For example, the Office 365 Outlook connector includes built-in actions for sending emails without needing any code. If the out-of-the-box connectors don't cover specific actions that a playbook requires, you need to create a custom connector.

### Scenario: Playbook that uses built-in connectors

#### Create the playbook

If your playbook doesn't require any custom actions outside the actions that the built-in connectors already provide, you can use the Logic Apps UI in Microsoft Sentinel to create the playbook. No other code is required.

For detailed instructions on how to create playbooks from the Azure portal or the Microsoft Defender portal, see [Create and manage Microsoft Sentinel playbooks](/azure/sentinel/automation/create-playbooks).  

#### Generate the ARM template for the playbook

On the **Code view** tab of the Logic Apps editor, you can access the JSON Azure Resource Manager template (ARM template). Remove any organizational details, like tenant ID and subscription info, for privacy and security. Follow these steps to get a sanitized version of your playbook ARM template:  

1. [Download the PowerShell script](https://aka.ms/playbook-ARM-Template-Generator).

1. Extract the folder and open **playbook_ARM_Template_Generator.ps1** in Visual Studio Code, Windows PowerShell, or PowerShell Core.

    > [!NOTE]
    > Run the script from your machine. Allow PowerShell script execution by running this command in PowerShell: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`.  

1. Enter your Azure tenant ID when you're prompted.

1. Authenticate with your credentials, and then select **Subscription** > **playbooks**.

1. Select a location on your local drive to save the sanitized ARM template as **azuredeploy.json**. The tool converts Microsoft Sentinel connections to Microsoft Software Installer (MSI) during export. For more information, see the demonstration video [Export your SOAR playbooks with ease](https://www.youtube.com/watch?v=scTtVHVzrQw).

1. Update the metadata section of the **azuredeploy.json** file with your playbook's specific details.

   :::image type="content" source="media/sentinel-playbook-creation/playbook-update-metadata.png" alt-text="Screenshot of playbook metadata that needs to be updated."  lightbox="media/sentinel-playbook-creation/playbook-update-metadata.png" :::

1. We recommend that you use a managed service identity rather than a user-assigned identity for connecting Azure services (such as Microsoft Sentinel, Azure Key Vault, and Azure Storage) with playbooks. Update the authentication type under `connectionProperties` to `"ManagedServiceIdentity"`.

   :::image type="content" source="media/sentinel-playbook-creation/sentinel-playbook-identity.png" alt-text="Screenshot of playbook identity updates."  lightbox="media/sentinel-playbook-creation/sentinel-playbook-identity.png" :::

1. Update `Microsoft.Web/connections` resources.

   :::image type="content" source="media/sentinel-playbook-creation/sentinel-playbook-web-connections.png" alt-text="Screenshot of playbook web connections metadata."  lightbox="media/sentinel-playbook-creation/sentinel-playbook-web-connections.png" :::

For more information, see the [azuredeploy.json file on GitHub](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/ThreatXCloud/Playbooks/ThreatXPlaybooks/ThreatX-BlockIP-URL/azuredeploy.json).

### Scenario: Playbook that uses custom connectors

Custom connectors extend Azure Logic Apps by integrating with APIs or services that built-in connectors don't cover. They're useful for connecting your logic apps to specific use cases, such as:

- Internal APIs within your organization.
- Third-party services that Azure doesn't directly support.
- Custom-built applications with a REST or SOAP API.

For more information, see [Custom connectors overview](/connectors/custom-connectors).

#### Create the playbook

To create a custom connector, describe the API so that the connector understands its operations and data structures. This example uses an OpenAPI definition for the Cognitive Services Text Analytics Sentiment API. For more information on creating custom connectors, see [Create a custom connector from an OpenAPI definition](/connectors/custom-connectors/define-openapi-definition).

After you create the custom connector, you can use it to build a playbook by using Azure Logic Apps. For step-by-step instructions on how to use custom connectors in a playbook, see [Use a custom connector in a logic app workflow](/connectors/custom-connectors/use-custom-connector-logic-apps).

#### Generate the ARM template for the playbook

On the **Code view** tab of the Azure Logic Apps editor, you can access the JSON ARM template. Remove any organizational details, like tenant ID and subscription info, for privacy and security. Follow these steps to get a sanitized version of your playbook ARM template:  

1. [Download the PowerShell script](https://aka.ms/playbook-ARM-Template-Generator).

1. Extract the folder and open **playbook_ARM_Template_Generator.ps1** in Visual Studio Code, Windows PowerShell, or PowerShell Core.

    > [!NOTE]
    > Run the script from your machine. Allow PowerShell script execution by running this command in PowerShell: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`.  

1. Enter your Azure tenant ID when you're prompted.

1. Authenticate with your credentials, and then select **Subscription** > **playbooks**.

1. Select a location on your local drive to save the sanitized ARM template as **azuredeploy.json**. The tool converts Microsoft Sentinel connections to MSI during export. For more information, see the demonstration video [Export your SOAR playbooks with ease](https://www.youtube.com/watch?v=scTtVHVzrQw).

1. Update the metadata section of the **azuredeploy.json** file with your playbook's specific details.

   :::image type="content" source="media/sentinel-playbook-creation/playbook-update-metadata.png" alt-text="Screenshot of playbook metadata that needs to be updated."  lightbox="media/sentinel-playbook-creation/playbook-update-metadata.png" :::

1. We recommend that you use a managed service identity rather than a user-assigned identity for connecting Azure services (such as Microsoft Sentinel, Azure Key Vault, and Azure Storage) with playbooks. Update the authentication type under `connectionProperties` to `"ManagedServiceIdentity"`.

   :::image type="content" source="media/sentinel-playbook-creation/sentinel-playbook-identity.png" alt-text="Screenshot of playbook identity updates."  lightbox="media/sentinel-playbook-creation/sentinel-playbook-identity.png" :::

1. Update `Microsoft.Web/connections` resources.

   :::image type="content" source="media/sentinel-playbook-creation/sentinel-playbook-web-connections.png" alt-text="Screenshot of playbook web connections metadata."  lightbox="media/sentinel-playbook-creation/sentinel-playbook-web-connections.png" :::

For more information, see the [azuredeploy.json file on GitHub](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/ThreatXCloud/Playbooks/ThreatXPlaybooks/ThreatX-BlockIP-URL/azuredeploy.json).

#### Generate the ARM template for the Logic Apps custom connector

1. Go to the Azure portal.

1. Search for **Logic Apps Custom Connector**.

1. Open the connector. Under **Automation**, select **Export template**.

   :::image type="content" source="media/sentinel-playbook-creation/sentinel-playbook-export-template.png" alt-text="Screenshot that shows a template to export."  Lightbox="media/sentinel-playbook-creation/sentinel-playbook-export-template.png" :::

1. Select **Copy template** and save the contents in a JSON file on your local computer.

1. In the JSON that you created in step 4, remove the `runtimeUrls`, `apiDefinitions`, and `wsdlDefinition` fields.

1. Select **Overview**, and then select **Download**. This step downloads the file that contains Swagger attributes.

   :::image type="content" source="media/sentinel-playbook-creation/sentinel-playbook-download-swagger.png" alt-text="Screenshot of selections for downloading a Swagger file."  Lightbox="media/sentinel-playbook-creation/sentinel-playbook-download-swagger.png" :::

1. Update the JSON file that you created in step 4 with the `swagger` and `backendService` values that you obtained from the Swagger file that you downloaded in step 6.

1. Validate the `host`, `basePath`, and `schemes` parameters in the Swagger file, and update them as needed.

   :::image type="content" source="media/sentinel-playbook-creation/sentinel-playbook-swagger-fields.png" alt-text="Screenshot that shows Swagger fields."  Lightbox="media/sentinel-playbook-creation/sentinel-playbook-swagger-fields.png" :::

1. Update the `parameters` section of the ARM template file for the custom connector.

   :::image type="content" source="media/sentinel-playbook-creation/playbook-update-parameters.png" alt-text="Screenshot that shows updated parameters."  Lightbox="media/sentinel-playbook-creation/playbook-update-parameters.png" :::

For reference or comparison to determine which other fields you need to modify in the ARM template, see the [azuredeploy.json file on GitHub](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Minemeld/Playbooks/CustomConnector/MinemeldCustomConnector/azuredeploy.json).

### Directory structure for playbook and custom connector contributions

Before you make a pull request to the Microsoft Sentinel GitHub repo, follow the proper directory structure. The ARM template file must be named **azuredeploy.json**. Also include a **Readme.md** file for all custom connectors and playbooks, to detail configuration steps during and after deployment.

Here are **Readme.md** file references:

- [Custom connector Readme.md file](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/Minemeld/Playbooks/CustomConnector/MinemeldCustomConnector)
- [Playbook Readme.md file](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/Minemeld/Playbooks/MinemeldPlaybooks/Minemeld-CreateIndicator)

:::image type="content" source="media/sentinel-playbook-creation/playbook-folder-structure.png" alt-text="Screenshot of the playbook folder structure in GitHub."  Lightbox="media/sentinel-playbook-creation/playbook-folder-structure.png" :::
