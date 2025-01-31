---
title: 'Create playbooks for Microsoft Sentinel solutions'
description: This article guides you through the process of creating and publishing playbooks to Microsoft Sentinel solutions.
author: anilgodavarthy
ms.author: angodavarthy
ms.service: microsoft-sentinel
ms.topic: conceptual 
ms.date: 1/23/2025

#CustomerIntent: As a ISV partner, I want to create and publish playbooks to my Microsoft Sentinel solution so that I can provide inbuilt automation use cases to my customers.
---

# Creating and publishing playbooks for Microsoft Sentinel solutions

Playbooks in Microsoft Sentinel are sets of procedures that can respond to incidents, alerts, or specific entities. They help automate responses and can be set to run automatically when certain alerts or incidents occur. Playbooks can also be executed manually.

This article walks you through the process of creating and publishing playbooks to Microsoft Sentinel solutions.

## Use Cases for Microsoft Sentinel playbooks
Due to the growing number of alerts and incidents, SOC analysts can't manually handle everything. To maximize the benefits of Microsoft Sentinel, it's crucial to determine which automations help SOC analysts with each detection in your solution. Here are some of the common scenarios for playbooks –

- **Incident Enrichment:** Enhance alerts with additional information for efficient investigation and resolution. Example: Collect more data on IP addresses associated with an incident.
- **Sync with Ticketing Systems:** Synchronize Microsoft Sentinel incidents with other systems like ServiceNow bi-directionally. Example: On incident creation, sync details with a ServiceNow ticket. For more information, see [ServiceNow connector](/connectors/service-now/)
- **Automated Response:** Take automated actions in response to suspicious activities. Example: Send a Teams message to the user for confirmation if a suspicious action is detected.

To understand more about potential playbook use cases, see [Recommended Microsoft Sentinel playbook use cases, templates, and examples | Microsoft Learn](/azure/sentinel/automation/playbook-recommendations).

## Creating and publishing playbooks

Microsoft Sentinel playbooks are based on Microsoft Azure Logic Apps, a cloud platform that enables the creation and execution of automated workflows with minimal to no coding. Users can use the visual designer and select prebuilt operations to efficiently build workflows that integrate and manage their applications, data, services, and systems. For more information, see [Overview - Azure Logic Apps | Microsoft Learn](/azure/logic-apps/logic-apps-overview). Microsoft Azure Logic Apps includes numerous out-of-the-box connectors, such as Salesforce, Office 365, and SQL, which offer no-code options for various functions. For example, the Office 365 Outlook connector includes built-in actions for sending emails without needing any code. If specific actions required by a playbook aren't covered by the out-of-the-box connectors, creating a custom connector is necessary.

### Scenario 1: playbook using builtin connectors

**Step 1: Create the playbook**
If your playbook doesn't require any custom actions outside of the actions already provided by the built-in connectors, you can use the Azure Logic apps UI in Microsoft Sentinel to create the playbook. No other code is required. For detailed instructions on how to create playbooks from Azure portal, see [Create and manage Microsoft Sentinel playbooks | Microsoft Learn](/azure/sentinel/automation/create-playbooks?tabs=azure-portal%2Cconsumption). For detailed instructions on how to create playbooks from Defender portal, see [Create and manage Microsoft Sentinel playbooks | Microsoft Learn](/azure/sentinel/automation/create-playbooks?tabs=defender-portal%2Cconsumption).  

**Step 2: Generate the ARM template for the playbook**
In the Code view tab of the Azure Logic Apps editor, you can access the JSON ARM template. Remove any organizational details like tenant ID and subscription info for privacy and security. Follow these steps to get a sanitized version of your playbook ARM template -  

1. Download the PowerShell script from https://aka.ms/playbook-ARM-Template-Generator 
1. Extract the folder and open "playbook_ARM_Template_Generator.ps1" in Visual Studio Code, Windows PowerShell, or PowerShell Core.

    > [!NOTE]
    > Run the script from your machine. Allow PowerShell script execution by running the command in PowerShell: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass  

1. Enter your Azure Tenant ID when prompted.
1. Authenticate with your credentials, then choose:
    1. Subscription
    1. playbooks
1. Select a location on your local drive to save the sanitized ARM Template as azuredeploy.json. The tool converts Microsoft Sentinel connections to Microsoft Software Installer (MSI) during export. For more information, see this demonstration video [Export your SOAR playbooks with ease | Microsoft Sentinel in the Field #7 - YouTube](https://www.youtube.com/watch?v=scTtVHVzrQw)
1. Update the metadata section of the azuredeploy.json file with your playbook's specific details

   :::image type="content" source="media/sentinel-playbook-creation/playbook-update-metadata.png" alt-text="Screenshot of playbook metadata that needs to be updated."  lightbox="media/sentinel-playbook-creation/playbook-update-metadata.png" :::   

7. It's recommended to use managed service identity rather than user-assigned identity for connecting Azure services (such as Microsoft Sentinel, Key Vault, and Storage Account) with playbooks. Update the authentication type under connectionProperties to "ManagedServiceIdentity".

   :::image type="content" source="media/sentinel-playbook-creation/sentinel-playbook-identity.png" alt-text="Screenshot of playbook identity updates."  lightbox="media/sentinel-playbook-creation/sentinel-playbook-identity.png" :::   

8. Update "Microsoft.Web/connections" resources 
 
   :::image type="content" source="media/sentinel-playbook-creation/sentinel-playbook-web-connections.png" alt-text="Screenshot of playbook web connections metadata."  lightbox="media/sentinel-playbook-creation/sentinel-playbook-web-connections.png" :::   

For more information, see https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/ThreatXCloud/playbooks/ThreatXplaybooks/ThreatX-BlockIP-URL/azuredeploy.json

### Scenario 2: Playbook using custom connectors

Custom connectors in Logic Apps extend Azure Logic Apps by integrating with APIs or services not covered by built-in connectors. They're useful for connecting your Logic Apps to specific use cases such as 

- **Internal APIs** within your organization.
- **Third-party services** not directly supported by Azure.
- **Custom-built applications** with a REST or SOAP API.

For more information, see [custom connectors](/connectors/custom-connectors)

**Step 1: Create the playbook**
To create a custom connector, describe the API so the connector understands its operations and data structures. This example uses an OpenAPI definition for the Cognitive Services Text Analytics Sentiment API. For more details on creating custom connectors, visit [Create a custom connector from an OpenAPI definition | Microsoft Learn](/connectors/custom-connectors/define-openapi-definition)

Once the custom connector is created, you can use it to build a playbook using Azure logic apps. For step-by-step instructions on how to use custom connectors in a playbook, see [Use a custom connector in a logic app workflow | Microsoft Learn](/connectors/custom-connectors/use-custom-connector-logic-apps)

**Step 2: Generate the ARM template for the playbook**
In the Code view tab of the Azure Logic Apps editor, you can access the JSON ARM template. Remove any organizational details like tenant ID and subscription info for privacy and security. Follow these steps to get a sanitized version of your playbook ARM template -  

1. Download the PowerShell script from https://aka.ms/playbook-ARM-Template-Generator 
1. Extract the folder and open "playbook_ARM_Template_Generator.ps1" in Visual Studio Code, Windows PowerShell, or PowerShell Core.

    > [!NOTE]
    > Run the script from your machine. Allow PowerShell script execution by running the command in PowerShell: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass  

1. Enter your Azure Tenant ID when prompted.
1. Authenticate with your credentials, then choose:
    1. Subscription
    1. playbooks
1. Select a location on your local drive to save the sanitized ARM Template as azuredeploy.json. The tool converts Microsoft Sentinel connections to Microsoft Software Installer (MSI) during export. For more information, see this demonstration video [Export your SOAR playbooks with ease | Microsoft Sentinel in the Field #7 - YouTube](https://www.youtube.com/watch?v=scTtVHVzrQw)
1. Update the metadata section of the azuredeploy.json file with your playbook's specific details

:::image type="content" source="media/sentinel-playbook-creation/playbook-update-metadata.png" alt-text="Screenshot of playbook metadata that needs to be updated."  lightbox="media/sentinel-playbook-creation/playbook-update-metadata.png" :::   

7. It's recommended to use managed service identity rather than user-assigned identity for connecting Azure services (such as Microsoft Sentinel, Key Vault, and Storage Account) with playbooks. Update the authentication type under connectionProperties to "ManagedServiceIdentity".

:::image type="content" source="media/sentinel-playbook-creation/sentinel-playbook-identity.png" alt-text="Screenshot of playbook identity updates."  lightbox="media/sentinel-playbook-creation/sentinel-playbook-identity.png" :::   

8. Update "Microsoft.Web/connections" resources 
 
:::image type="content" source="media/sentinel-playbook-creation/sentinel-playbook-web-connections.png" alt-text="Screenshot of playbook web connections metadata."  lightbox="media/sentinel-playbook-creation/sentinel-playbook-web-connections.png" :::   

For more information, see https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/ThreatXCloud/playbooks/ThreatXplaybooks/ThreatX-BlockIP-URL/azuredeploy.json

**Step 3: Generate the ARM template for the Logic app Custom Connector**
1. Navigate to Azure portal
1. Search for **Logic Apps Custom Connector** 
1. Open the connector and then select on Export template under Automation link.

:::image type="content" source="media/sentinel-playbook-creation/sentinel-playbook-export-template.png" alt-text="Screenshot to export template."  Lightbox="media/sentinel-playbook-creation/sentinel-playbook-export-template.png" :::   

4. Select "Copy template" and save contents in a JSON file on your local computer
1. From the JSON created in step 4, remove the runtimeUrls, apiDefinitions, and wsdlDefinition fields
1. Download the file containing swagger attributes. Select on the Overview link and then on the Download link. This downloads the swagger file

:::image type="content" source="media/sentinel-playbook-creation/sentinel-playbook-download-swagger.png" alt-text="Screenshot to download swagger file."  Lightbox="media/sentinel-playbook-creation/sentinel-playbook-download-swagger.png" :::   

7. Updated the JSON file created in step 4 with the swagger and backendService values obtained from the swagger file created in step 6.
1. Validate the host, basepath, and scheme parameters in the swagger file and update as needed.

:::image type="content" source="media/sentinel-playbook-creation/sentinel-playbook-swagger-fields.png" alt-text="Screenshot showing swagger fields."  Lightbox="media/sentinel-playbook-creation/sentinel-playbook-swagger-fields.png" :::   

9. Finally, update the Parameter section of the ARM template files for the custom connector as shown.

:::image type="content" source="media/sentinel-playbook-creation/playbook-update-parameters.png" alt-text="Screenshot showing update parameters."  Lightbox="media/sentinel-playbook-creation/playbook-update-parameters.png" :::   

Refer to the link for reference or comparison to determine which other fields need to be modified within the ARM template.
[Azure-Sentinel/Solutions/Minemeld/playbooks/CustomConnector/MinemeldCustomConnector/azuredeploy.json](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Minemeld/playbooks/CustomConnector/MinemeldCustomConnector/azuredeploy.json)

### Directory structure for playbook and custom connector contributions

Before making a pull request to the Microsoft Sentinel GitHub repo, follow the proper directory structure. The ARM template file must be named “azuredeploy.json.” Additionally, include a Readme.md file for all custom connectors and playbooks, detailing configuration steps during and after deployment.

Readme.md file references - 
- [Custom connector Readme.md file](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/Minemeld/playbooks/CustomConnector/MinemeldCustomConnector)
- [playbook Readme.md file](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/Minemeld/playbooks/Minemeldplaybooks/Minemeld-CreateIndicator)

:::image type="content" source="media/sentinel-playbook-creation/playbook-folder-structure.png" alt-text="Screenshot of playbook folder structure in GitHub."  Lightbox="media/sentinel-playbook-creation/playbook-folder-structure.png" :::