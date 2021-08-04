---
title: 'Quickstart: Use Azure CLI with Sentinel'
description: In this quickstart, learn how to use the Azure CLI to set up basic Sentinel services.
services: sentinel
author: yelevin
ms.author: yelevin
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: quickstart
ms.date: 6/25/2021
ms.custom: references_regions
---
# Quickstart: Use Azure CLI with Sentinel

In this quickstart, learn how to use Azure CLI to set up basic Sentinel services.

1. Collect data

    Collect data at cloud scale across the enterprise, both on-premises and in multiple clouds. Azure Sentinel ingests data from services and apps by connecting to the service and forwarding the events and logs to Azure Sentinel. 

    - For physical and virtual machines, you can install the Log Analytics agent that collects the logs and forwards them to Azure Sentinel.

    - For firewalls and proxies, Azure Sentinel installs the Log Analytics agent on a Linux Syslog server, from which the agent collects the log files and forwards them to Azure Sentinel. 

    Azure Sentinel comes with a number of data connectors for Microsoft solutions. Some of the connectors are available out of the box and provide real-time integration. These data connectors let you connect to:

    - Amazon Web Services (AWS) CloudTrail.
    - Azure Active Directory (Azure AD).
    - Azure Defender alerts from Azure Security Center (ASC).
    - Microsoft Cloud App Security (MCAS).
    - Microsoft Defender for Endpoint (formerly Microsoft Defender Advanced Threat Protection, or MDATP).
    - Microsoft Defender for Identity (formerly Azure Advanced Threat Protection, or AATP).
    - Office.
    - Threat intelligence (TI).

    For most of these data connectors, you need to provide the following arguments:

    |Argument|Description|
    |-|-|
    |*tenant-id*|The tenant ID (a GUID) of the Azure subscription that you want to connect to and get data from.|
    |*state*|Whether the data type connection is enabled. Specify `Enabled` or `Disabled`.|
    |*kind*|The kind of data connector. See the next table for the string value to use for each data connector type.|
    |*etag*|The entity tag (ETag) of the Azure resource. An ETag helps verify that the data connector that you're trying to access is the current version.|

    The following table lists the parameter names than you may specify when you create a data connector using the [az sentinel data-connector create](/cli/azure/sentinel/data-connector#az_sentinel_data_connector_create) Azure CLI command, the corresponding data connection type, any differences in the arguments that you need to include for that data connection type, and the corresponding string value for the *kind* argument.

    |Parameter name|Data connection type|Argument differences|Value for 'kind'|
    |-|-|-|-|
    |*aad-data-connector*|Azure Active Directory (Azure AD) data connector|No differences.|`AzureActiveDirectory`|
    |*aatp-data-connector*|Microsoft Defender for Identity (formerly Azure Advanced Threat Protection, or AATP) data connector|No differences.|`AzureAdvancedThreatProtection`|
    |*asc-data-connector*|Azure Defender alerts from Azure Security Center (ASC) data connector|Uses the Azure *subscription-id* instead of *tenant-id*.|`AzureSecurityCenter`|
    |*aws-cloud-trail-data-connector*|Amazon Web Services (AWS) CloudTrail data connector|Uses *aws-role-arn* instead of *tenant-id*. *aws-role-arn* is the [Amazon Resource Name (ARN)](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) of the role that's used to access the AWS account.|`AmazonWebServicesCloudTrail`|
    |*mcas-data-connector*|Microsoft Cloud App Security (MCAS) data connector|Instead of *state*, uses separate state arguments for alerts and discovery logs (*state-data-types-alerts-state* and *state-data-types-discovery-logs-state*). Specify `Enabled` or `Disabled` for each of those state arguments.|`MicrosoftCloudAppSecurity`|
    |*mdatp-data-connector*|Microsoft Defender for Endpoint (formerly Microsoft Defender Advanced Threat Protection, or MDATP) data connector|No differences.|`MicrosoftDefenderAdvancedThreatProtection`|
    |*office-data-connector*|Office data connector|Instead of *state*, uses separate state arguments for Exchange and SharePoint (*state-data-types-exchange-state* and *state-data-types-share-point-state*). Specify `Enabled` or `Disabled` for each of those state arguments.|`Office365`|
    |*ti-data-connector*|Threat intelligence (TI) data connector|No differences.|`ThreatIntelligence`|

    For more information, see [Connect data sources](connect-data-sources.md).

    After you connect your data sources, either set up Sentinel yourself, or choose from a gallery of expertly created workbooks that surface insights based on your data. These workbooks can be easily customized to your needs.

    After your data sources are connected, your data starts streaming into Azure Sentinel and is ready for you to start working with. You can view the logs in the [built-in workbooks](quickstart-get-visibility.md) and start building queries in Log Analytics to [investigate the data](tutorial-investigate-cases.md).

2. Create security alerts

    Focus on what’s important using analytics to create alerts: [az monitor alert create](/cli/azure/monitor/alert#az_monitor_alert_create).

3. Automate & orchestrate

    Use or customize built-in playbooks to automate common tasks: [az logic](/cli/azure/logic).

## Prerequisites

- Azure subscription, if you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- Log Analytics workspace. Learn how to [create a Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md). For more information about Log Analytics workspaces, see [Designing your Azure Monitor Logs deployment](../azure-monitor/logs/design-logs-deployment.md). or use azure cli...

- To enable Azure Sentinel, you need contributor permissions to the subscription in which the Azure Sentinel workspace resides. 
- To use Azure Sentinel, you need either contributor or reader permissions on the resource group that the workspace belongs to.
- Additional permissions may be needed to connect specific data sources.
- Azure Sentinel is a paid service. For pricing information see [About Azure Sentinel](https://go.microsoft.com/fwlink/?linkid=2104058).

## Enable Azure Sentinel

To on-board Azure Sentinel, you first need to enable Azure Sentinel, and then connect your data sources. 

1. Sign in to the Azure portal. Make sure that the subscription in which Azure Sentinel is created is selected.

1. Search for and select **Azure Sentinel**.

   ![Services search](./media/quickstart-onboard/search-product.png)

1. Select **Add**.

1. Select the workspace you want to use or create a new one. You can run Azure Sentinel on more than one workspace, but the data is isolated to a single workspace.

   ![Choose a workspace](./media/quickstart-onboard/choose-workspace.png)

   > [!NOTE] 
   > Default workspaces created by Azure Security Center will not appear in the list; you can't install Azure Sentinel on them.
   > [!IMPORTANT]
   > Once deployed on a workspace, Azure Sentinel **does not currently support** the moving of that workspace to other resource groups or subscriptions. 
   >
   > If you have already moved the workspace, disable all active rules under **Analytics** and re-enable them after five minutes. This should be effective in most cases, though, to reiterate, it is unsupported and undertaken at your own risk.
1. Select **Add Azure Sentinel**.

## Code sample

```azurecli-interactive
# Add the required extensions.
az extension add --name log-analytics --upgrade
az extension add --name sentinel --upgrade

# Define variables.
uniqueId=$RANDOM
resourceGroupName="contoso-log-analytics-workspace-rg$uniqueId"
resourceGroupLocation="Central US"
logAnalyticsWorkspaceName="contoso-log-analytics-workspace$uniqueId"
logAnalyticsWorkspaceLocation="East US"
dataConnectorId="contoso-data-connector-$uniqueId"
alertName="contoso-alert-$uniqueId"

# Run Azure CLI commands.
myTenantId=$(az account show --query tenantId)  # Get tenant ID of default subscription.
myTenantId=${myTenantId:1:-1}  # Strip off the enclosing quotes.
az group create --name "$resourceGroupName" --location "$resourceGroupLocation"
az monitor log-analytics workspace create --workspace-name "$logAnalyticsWorkspaceName" \
    --resource-group "$resourceGroupName" \
    --location "$logAnalyticsWorkspaceLocation"
az sentinel data-connector create --data-connector-id "$dataConnectorId" \
    --workspace-name "$logAnalyticsWorkspaceName" \
    --resource-group "$resourceGroupName" \
    --aad-data-connector tenant-id="$myTenantId" state=Enabled kind=AzureActiveDirectory etag=*
az sentinel alert-rule create --workspace-name "$logAnalyticsWorkspaceName" --resource-group "$resourceGroupName" --rule-id 
az monitor alert create --name $alertName --condition  --target 
az logic
```

## Next steps

In this document, you learned about onboarding and connecting data sources to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- [Hunt for threats with Azure Sentinel](hunting.md).
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- [Automatically create incidents from Microsoft security alerts](create-incidents-from-alerts.md).
- [Data Connectors - Create Or Update](/rest/api/securityinsights/data-connectors/create-or-update)