---
title: 'Create workbooks for Microsoft Sentinel solutions'
description: This article guides you through the process of creating and publishing workbooks to Microsoft Sentinel solutions.
author: anilgodavarthy
ms.author: angodavarthy
ms.service: microsoft-sentinel
ms.topic: conceptual 
ms.date: 1/22/2025

#CustomerIntent: As a ISV partner, I want to create and publish workbooks to my Microsoft Sentinel solution so that I can provide insights to my customers.
---

# Creating and publishing workbooks for Microsoft Sentinel solutions

Microsoft Sentinel Workbooks are an integral feature of Microsoft Sentinel, a cloud-native security information and event management (SIEM) solution. These workbooks are designed to provide users with interactive, customizable dashboards that aggregate and visualize data from various sources, enabling organizations to gain deeper insights into their security posture and streamline their threat detection and response efforts. By integrating data from various sources and facilitating collaboration among security teams, Microsoft Sentinel Workbooks play a pivotal role in strengthening an organization's overall security posture.

This article walks you through the process of creating and publishing workbooks to Microsoft Sentinel solutions.

## Use Cases for Microsoft Sentinel Workbooks
In a Security Operations Center (SOC), Microsoft Sentinel Workbooks are used to monitor and analyze security events in real-time. SOC analysts can create workbooks that display key performance indicators (KPIs) such as incident response times, alert volumes, and threat detection rates. By having a centralized view of security metrics, SOC teams can optimize their workflows and improve incident management processes.

- **Security Operations Center (SOC) Monitoring:** In a Security Operations Center (SOC), Microsoft Sentinel Workbooks are used to monitor and analyze security events in real-time. SOC analysts can create workbooks that display key performance indicators (KPIs) such as incident response times, alert volumes, and threat detection rates. By having a centralized view of security metrics, SOC teams can optimize their workflows and improve incident management processes.
- **Compliance and Audit Reporting:** Organizations need to adhere to various regulatory standards and audit requirements. Microsoft Sentinel Workbooks help generating compliance reports by visualizing data related to security controls, user activities, and policy enforcement. These reports can be customized to align with specific regulatory frameworks, making it easier for organizations to demonstrate compliance during audits.
- **Threat Hunting:** Threat hunting involves proactively searching for signs of malicious activity within an organization's environment. Microsoft Sentinel Workbooks aid threat hunters by providing visual representations of anomalous behaviors, attack patterns, and indicators of compromise (IOCs). Hunters can use these insights to uncover hidden threats, investigate suspicious activities, and take preventive actions before incidents escalate.

## Creating and publishing workbooks

### Step 1: Create your workbook using Microsoft Sentinel Workbooks UI
1. Navigate to the Azure portal and select Microsoft Sentinel from the list of available services.
1. Ensure you have a designated workspace for your Microsoft Sentinel instance. You can either create a new workspace or select an existing one.
1. In the Microsoft Sentinel workspace, select on the **Workbooks** tab to access the Workbooks UI.
1. You can either start with a prebuilt template or create a workbook from scratch:
    1. *Template:* Browse through the available templates and select one that matches your needs. Templates provide a quick way to get started with commonly used visualizations and metrics.
    1. *From Scratch:* To create a workbook from scratch, select on the "+ New" button. Clicking on the new button opens a blank workbook where you can add your custom queries and visualizations.
1. Workbooks aggregate data from various sources. Use the 'Add query' option to bring in data from connected data sources. You can write custom Kusto Query Language (KQL) queries to fetch and filter the data you need.
1. Once you have your data, you can add and customize visualizations to represent it effectively. Microsoft Sentinel offers various visualization options, including charts, tables, and graphs. Adjust the settings to match your specific requirements.
1. After designing your workbook, save it to your workspace. 

### Step 2: Get the workbook gallery template

1. Navigate to your workbook, select on edit and then advanced editor.
1. Select the **Gallery Template** tab.

:::image type="content" source="media/sentinel-workbook-creation/sentinel-workbook-edit-mode.png" alt-text="Screenshot showing the edit mode of workbooks in Microsoft Sentinel." lightbox="media/sentinel-workbook-creation/sentinel-workbook-edit-mode.png":::   

1. Copy the gallery template and save it as JSON file on your machine.
1. Add the below properties to your gallery template. These properties allow us to identify the specific Microsoft Sentinel workbook that was opened. Use the format `sentinel-"workbookName"` for consistency.

```json
 "styleSettings": {},
 "fromTemplateId": "sentinel-MyNewWorkbook",
 "$schema": "https://github.com/Microsoft/Application-Insights-Workbooks/blob/master/schema/workbook.json"
```
 3. Save the JSON file and upload it to the **Workbooks** folder under your solution repository in GitHub. If the Workbooks folder doesn't exist, create it.
 1. Capture two screenshots of your workbook - one each in dark and light themes. The images are used as preview images for your workbook. Be consistent with the filename conventions - the dark theme filename should contain the word "black" and the light theme image should contain the word "white." Upload these images to https://github.com/Azure/Azure-Sentinel/tree/master/Workbooks/Images/Preview 
 1. You can optionally add a logo that would be displayed in the Workbook. Upload the logo to https://github.com/Azure/Azure-Sentinel/tree/master/Workbooks/Images/Logos folder in GitHub. The logo should be in SVG format. If a logo isn't provided, the default Microsoft Sentinel logo is displayed.
 1. Add this section for your workbook in the https://github.com/Azure/Azure-Sentinel/blob/master/Workbooks/WorkbooksMetadata.json file. This file contains metadata for all the workbooks in the Microsoft Sentinel gallery. For more details, you can look at the existing entries in the file.

```json
{
 "workbookKey": "YourWorkbookKey", // in the format of "<Name>Workbook". Ensure that the key is unique across all workbooks
 
 "logoFileName": "",// If you have a logo, provide the filename here
 
 "description": "description of the workbook.", // Will be displayed on the workbooks blade next to the logo and preview images
 
 "dataTypesDependencies": [ "Datatype" ],//The data type(s) that your workbook queries
 
 "dataConnectorsDependencies": [],//Relevant connectors
 
 "previewImagesFileNames": [ ],//The relative path of the preview images you saved under workbooks/images/previews
 
 "version": "1.0", // if this is a new workbook - this should be "1.0"
 
 "title": "Workbook title",//This should be the name of the workbook which will be displayed in the main workbooks blade - for example "Palo Alto overview"
 
 "templateRelativePath": "MyNewWorkbook.json",//The relative path of the JSON of the template (the gallery template you saved) 
 
 "subtitle": "",
 
 "provider": "Your company name" //Name of the company/author who owns the workbook and is responsible for providing support
 }
```
## Related content

[Publish Microsoft Sentinel solutions](/azure/sentinel/publish-sentinel-solutions)    