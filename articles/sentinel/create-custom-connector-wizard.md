---
title: Microsoft Sentinel custom connector wizard - Getting started guide
description: Learn how to create and deploy custom codeless connectors for Microsoft Sentinel through the connector wizard.
author: EdB-MSFT
ms.service: microsoft-sentinel
ms.author: edbaynash
ms.topic: how-to
ms.date: 3/23/2026
# customer intent: As a security engineer or ISV partner, I want to understand how to build a simple REST API custom connector in the wizard so I can send real-time data from my application to Microsoft Sentinel.
---

# Microsoft Sentinel Connector Wizard - Getting started guide

This guide helps you understand, build, and deploy custom codeless connectors for Microsoft Sentinel using the Connector Wizard (preview).

## What is this tool?

The Sentinel Connector Wizard aims to simplify the process of creating and deploying a custom codeless connector for data ingestion from a simple REST API into a custom Log Analytics table. This tool handles ARM template formatting and deployment, allowing you to focus on defining the desired behavior of the data connector.

The wizard's custom connector drafts are autosaved in your browser cache. To access your drafts in another browser or to store them for version control, use the draft manager pane to export your drafts into JSON files. Drafts saved in this way can be imported into the tool again later.

## Prerequisites

Before building a connector, understand your data source and how Microsoft Sentinel needs to connect.

1. Schema of the output table(s).  

   It's important to understand the shape of your data stream and the fields you want to include in the output table. Reference your data source documentation or analyze sufficient output examples.

Research the following components and verify support for them in the [Data Connector API reference](data-connector-connection-rules-reference.md):

1. HTTP request and response structure to the data source

1. Authentication required by the data source.<br>For example, if your data source requires a token signed with a certificate, the data connector API reference specifies cert authentication isn't supported. 

1. Pagination options to the data source

## How to use the Sentinel Connector Wizard

Visit the Defender portal's [Sentinel Data Connectors experience](https://security.microsoft.com/sentinel/connectors)

Open the draft manager using the action button labeled "Create custom connector". From within the draft manager, you may choose to start a new custom connector draft or to import a draft. You may also edit, delete, or export existing drafts currently stored in the browser cache.

### Step-by-step guide

TODO

1.  Basics
    
    Name your custom data connector.

    1. Provide
        - **Connector name:** Display name of your data connector
        - **Author:** Provider of your data connector (your name, email, or organization)
        - **Description:** Description of your custom data connector. This field supports Markdown formatting.
        - **Version:** If you wish to use a different major and minor version than the default "1.0," change it here. The patch version is not configurable, as it is constructed from the datetime of the most recent update to the data connector draft.

1.  Authentication
    
    Define the authentication flow for your data connector. 

    1. Select one of the following supported auth types:
        - **Basic:** Username and password
        - **API key:** API key
        - **OAuth2:** OAuth2 style aut, which may be of 
    1. For API key or OAuth2, provide further auth details. If using basic authentication, no further auth details are necessary.
        - **API key**
            1. Provide
                
        - **OAuth2**
            1. Select either `client_credentials` or `authorization_code` grant type

1.  Deploy or download

    Deploy the generated ARM template to your current Sentinel workspace, or download the ARM template if you wish to make modifications not supported by the wizard.

    #### Optional
    
    A downloaded ARM template can be manually deployed through the ARM template deployment workflow in Azure Portal. See the following steps.

    1. In the Azure portal, search for **Deploy a custom template**
    1. Select **Build your own template in the editor**
    1. Select **Load file** and select `Package/mainTemplate.json` from your output folder
    1. Select **Save**
    1. Fill in the deployment parameters:
        - **Subscription:** Your Azure subscription
        - **Resource Group:** The resource group containing your Sentinel workspace
        - **Region:** Same region as your Sentinel workspace
        - **Workspace:** Your Log Analytics workspace name
    1. Select **Review + create**, then **Create**

    This deployment makes the connector available in your Microsoft Sentinel data connectors gallery.

    For detailed steps, see [Quickstart: Create and deploy ARM templates by using the Azure portal](/azure/azure-resource-manager/templates/quickstart-create-templates-use-the-portal).

1.  Enable the data connector

    After deploying the solution package, enable the connector to provision resources and generate credentials.

    1. In the Azure portal, navigate to your Microsoft Sentinel workspace
    1. Go to **Configuration** > **Data connectors**
    1. Search for and select **Contoso Security Alerts (Push)**
    1. Select **Open connector page**
    1. Select the **Deploy Contoso Security Alerts connector** button
    1. Wait for deployment to complete (creates custom table, DCR, DCE, Entra application with credentials)
    1. Copy the connection details that appear:
        - Tenant ID
        - Application (Client) ID
        - Client Secret
        - Data Collection Endpoint URI
        - Data Collection Rule Immutable ID
        - Stream Name: `Custom-ContosoSecurityAlerts`

1. Configure your application

    Update your application code with the credentials and resource details from Step 10. The code uses the OAuth 2.0 client credentials flow to authenticate with Azure Monitor.

    > [!CAUTION] 
    > Protect your credentials: Never hardcode credentials (Tenant ID, Application ID, Client Secret) directly in your application code or commit them to source control. 
    > Use secure credential storage solutions such as:  
    > - Azure Key Vault for production applications 
    > - Environment variables or configuration files (excluded from source control) 
    > - Managed identities where applicable 
    > - Secrets management tools that encrypt credentials at rest


## Next steps

Now that you understand CCF Push connectors, take the following steps:

1. **Design your data schema** - Identify the events you want to send and their fields.
1. **Create connector artifacts** - Build the four JSON files (table, DCR, connector definition, data connector).
1. **Organize solution structure** - Set up Data/ and Data Connectors/ folders with proper naming.
1. **Package your solution** - Use `createSolutionV3.ps1` to generate deployment templates.
1. **Deploy and test** - Deploy to your Sentinel workspace and validate data flow.
1. **Integrate with your application** - Add code to send events in real-time.
1. **Create alerts and workbooks** - Use your data for security monitoring.

## Additional resources

### CCF documentation

- [Create a codeless connector (CCF Pull)](/azure/sentinel/create-codeless-connector) - Polling-based connectors.
- [Data Connector Definitions API reference](/rest/api/securityinsights/data-connector-definitions) - UI configuration guide.
- [Data connector connection rules reference](/azure/sentinel/create-codeless-connector) - Connection rules for polling connectors.

### Azure Monitor and data collection

- [Azure Monitor Logs Ingestion API](/azure/azure-monitor/logs/logs-ingestion-api-overview) - Core API for sending data.
- [Data collection rules in Azure Monitor](/azure/azure-monitor/essentials/data-collection-rule-overview) - Understanding DCRs.
- [Structure of a data collection rule](/azure/azure-monitor/essentials/data-collection-rule-structure) - DCR structure details.
- [Data collection endpoints in Azure Monitor](/azure/azure-monitor/essentials/data-collection-endpoint-overview) - DCE configuration.
- [Tutorial: Send data to Azure Monitor Logs with Logs ingestion API](/azure/azure-monitor/logs/tutorial-logs-ingestion-portal) - Step-by-step tutorial.
- [Create a custom table](/azure/azure-monitor/logs/create-custom-table) - Custom table creation guide.

### Authentication and security

- [OAuth 2.0 client credentials flow](/entra/identity-platform/v2-oauth2-client-creds-grant-flow) - How app-to-service authentication works.
- [Microsoft identity platform access tokens](/entra/identity-platform/access-tokens) - Understanding OAuth tokens.
- [Register an application in Microsoft Entra ID](/entra/identity-platform/quickstart-register-app) - How to register an application in Microsoft Entra ID.
- [Best practices for Azure AD application registration](/entra/identity-platform/security-best-practices-for-app-registration) - Entra app security.
- [Assign Azure roles using Azure Resource Manager (ARM) templates](/azure/role-based-access-control/role-assignments-template) - Assign roles using templates.
- [ARM template security recommendations](/azure/azure-resource-manager/templates/best-practices#security-recommendations-for-parameters) - Securing deployment templates.
- [Azure Monitor service limits](/azure/azure-monitor/service-limits) - Rate limits and quotas.

### Microsoft Sentinel

- [About Microsoft Sentinel solutions](/azure/sentinel/sentinel-solutions) - Packaging connectors as solutions.
- [Monitor the health of your data connectors](/azure/sentinel/monitor-data-connector-health) - Health monitoring.
- [ARM template reference for data connectors](/rest/api/securityinsights/data-connectors) - Complete API reference.

## Getting help

- For ISV partners building integrations, contact: azuresentinelpartner@microsoft.com
- For technical questions, use [Microsoft Q&A](/answers/topics/azure-sentinel.html) with the tag 'azure-sentinel'.
