---
title: Stream Microsoft Defender for IoT cloud alerts to a partner SIEM - Microsoft Defender for IoT
description: Learn how to send Microsoft Defender for IoT data on the cloud to a partner SIEM via Microsoft Sentinel, using Splunk as an example.
ms.date: 12/26/2022
ms.topic: how-to
---

# Stream Defender for IoT cloud alerts to a partner SIEM

As more businesses convert OT systems to digital IT infrastructures, security operations center (SOC) teams and chief information security officers (CISOs) are increasingly responsible for handling threats from OT networks.

We recommend using Microsoft Defender for IoT's out-of-the-box [data connector](../iot-solution.md) and [solution](../iot-advanced-threat-monitoring.md) to integrate with Microsoft Sentinel and bridge the gap between the IT and OT security challenge.

However, if you have other security information and event management (SIEM) systems, you can also use Microsoft Sentinel to forward Defender for IoT cloud alerts on to that partner SIEM, via Microsoft Sentinel and an Event Hub.

While this article uses Splunk as an example, you can use the process described below with any SIEM that supports Event Hub ingestion, such as IBM QRadar.

> [!IMPORTANT]
> Using Event Hub and a Log Analytics export rule may incur additional charges. For more information, see [Event Hubs pricing](https://azure.microsoft.com/pricing/details/event-hubs/) and [Log Data Export pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Prerequisites

Before you start, you'll need the **Microsoft Defender for IoT** data connector installed in your Microsoft Sentinel instance.

For more information, see [Tutorial: Connect Microsoft Defender for IoT with Microsoft Sentinel](../iot-solution.md).

<!--permissions?-->

## Register an application in Azure Active Directory

You'll need Azure Active Directory (Azure AD) defined as a service principal for the [Splunk Add-on for Microsoft Cloud Services](https://splunkbase.splunk.com/app/3110/). To do this, you'll need to create an Azure AD application with specific permissions.

**To register an Azure AD application and define permissions**:

1. In [Azure AD](/azure/active-directory/), register a new application. On the **Certificates & secrets** page, add a new client secret for the service principal.

    For more information, see [Register an application with the Microsoft identity platform](/azure/active-directory/develop/quickstart-register-app)

1. In your app's **API permissions** page, grant API permissions to read data from your app.

    1. Select to add a permission and then select **Microsoft Graph** > **Application permissions** > **SecurityEvents.ReadWrite.All** > **Add permissions**.

    1. Make sure that admin consent is required for your permission.

    For more information, see [Configure a client application to access a web API](/azure/active-directory/develop/quickstart-configure-app-access-web-apis#add-permissions-to-access-your-web-api)

1. From your app's **Overview** page, note the following values for your app:

    - **Display name**
    - **Application (client) ID**
    - **Directory (tenant) ID**


1. From the **Certificates & secrets** page, note the values of your client secret **Value** and *Secret ID**.

## Create an Azure Event Hub

Create an Azure Event Hub to use as a bridge between Microsoft Sentinel and your partner SIEM. Start this step by creating an Azure Event Hub namespace, and then adding an Azure Event Hub.

**To create your Event Hub namespace and Event Hub**:

1. In Azure Event Hubs, create a new Event Hubs namespace. In your new namespace, create a new Azure event hub.

    In your event hub, make sure to define the **Partition Count** and **Message Retention** settings.

    For more information, see [Create an event hub using the Azure portal](/azure/event-hubs/event-hubs-create).

1. In your Event Hubs namespace, select the **Access control (IAM)** page and add a new role assignment.

    Select to use the **Azure Event Hubs Data Receiver** role, and add the Azure AD service principle app that you'd created [earlier](#register-an-application-in-azure-active-directory) as a member.

    For more information, see: [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

1. In your Event Hubs namespace's **Overview** page, make a note of the namespace's **Host name** value.

1. In your Event Hubs namespace's **Event Hubs** page, make a note of your event hub's name.

## Forward Microsoft Sentinel incidents to your Event Hub

To forward Microsoft Sentinel incidents or alerts to Azure Event Hub, create a data export from Azure Log Analytics.

In your rule, make sure to define the following settings:

- Configure the **Source** as **SecurityIncident**
- Configure the **Destination** as **Event Type**, using the Event Hub namespace and Event Hub name you'd recorded earlier.

For more information, see [Log Analytics workspace data export in Azure Monitor](/azure/azure-monitor/logs/logs-data-export?tabs=portal#create-or-update-a-data-export-rule).

## Configure Splunk to consume Microsoft Sentinel incidents

Once you have your event hub and export rule configured, configure Splunk to consume Microsoft Sentinel incidents from the event hub.

1. Install the [Splunk Add-on for Microsoft Cloud Services](https://splunkbase.splunk.com/app/3110/) app.

1. In the Splunk Add-on for Microsoft Cloud Services app, add an Azure App account.

    1. Enter a meaningful name for the account.
    1. Enter the client ID, client secret, and tenant ID details that you'd recorded earlier.
    1. Define the account class type as **Azure Public Cloud**.

1. Go to the Splunk Add-on for Microsoft Cloud Services inputs, and create a new input for your Azure event hub.

    1. Enter a meaningful name for your input.
    1. Select the Azure App Account that you'd just created in the Splunk Add-on for Microsoft Services app.
    1. Enter your event hub namespace FQDN and event hub name.

    Leave other settings as their defaults.

Once data starts getting ingested into Splunk from your event hub, query the data by using the following value in your search field: `sourcetype="mscs:azure:eventhub"`

## Next steps

This article describes how to forward alerts generated by cloud-connected sensors only. If you're working on-premises, such as in air-gapped environments, you may be able to create a forwarding alert rule to forward alert data directly from an OT sensor or on-premises management console. 

For more information, see [Integrations with Microsoft and partner services](../integrate-overview.md).
