---
title: Set up the required Azure resources to export security alerts to IBM QRadar and Splunk
description: Learn how to configure the required Azure resources in the Azure portal to stream security alerts to IBM QRadar and Splunk
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 04/04/2022
---

# Prepare Azure resources for exporting to Splunk and QRadar

In order to stream Microsoft Defender for Cloud security alerts to IBM QRadar and Splunk, you have to set up resources in Azure, such as Event Hubs and Microsoft Entra ID. Here are the instructions for configuring these resources in the Azure portal, but you can also configure them using a PowerShell script. Make sure you review [Stream alerts to QRadar and Splunk](export-to-siem.md#stream-alerts-to-qradar-and-splunk) before you configure the Azure resources for exporting alerts to QRadar and Splunk.

To configure the Azure resources for QRadar and Splunk in the Azure portal:

## Step 1: Create an Event Hubs namespace and event hub with send permissions

1. In the [Event Hubs service](../event-hubs/event-hubs-create.md), create an Event Hubs namespace:
    1. Select **Create**.
    1. Enter the details of the namespace, select **Review + create**, and select **Create**.

    :::image type="content" source="media/export-to-siem/create-event-hub-namespace.png" alt-text="Screenshot of creating an Event Hubs namespace in Microsoft Event Hubs." lightbox="media/export-to-siem/create-event-hub-namespace.png":::

1. Create an event hub:
    1. In the namespace that you create, select **+ Event Hub**.
    1. Enter the details of the event hub, and select **Review + create**, and select **Create**.
1. Create a shared access policy.
    1. In the Event Hub menu, select the Event Hubs namespace you created.
    1. In the Event Hub namespace menu, select **Event Hubs**.
    1. Select the event hub that you just created.
    1. In the event hub menu, select **Shared access policies**.
    1. Select **Add**, enter a unique policy name, and select **Send**.
    1. Select **Create** to create the policy.
    :::image type="content" source="media/export-to-siem/create-shared-access-policy.png" alt-text="Screenshot of creating a shared policy in Microsoft Event Hubs." lightbox="media/export-to-siem/create-shared-access-policy.png":::

## Step 2: **For streaming to QRadar SIEM** - Create a Listen policy

1. Select **Add**, enter a unique policy name, and select **Listen**.
1. Select **Create** to create the policy.
1. After the listen policy is created, copy the **Connection string primary key** and save it to use later.

    :::image type="content" source="media/export-to-siem/create-shared-listen-policy.png" alt-text="Screenshot of creating a listen policy in Microsoft Event Hubs." lightbox="media/export-to-siem/create-shared-listen-policy.png":::

## Step 3: Create a consumer group, then copy and save the name to use in the SIEM platform

1. In the Entities section of the Event Hubs event hub menu, select **Event Hubs** and select the event hub you created.

    :::image type="content" source="media/export-to-siem/open-event-hub.png" alt-text="Screenshot of opening the event hub Microsoft Event Hubs." lightbox="media/export-to-siem/open-event-hub.png":::

1. Select **Consumer group**.

## Step 4: Enable continuous export for the scope of the alerts

1. In the Azure search box, search for "policy" and go to the Policy.
1. In the Policy menu, select **Definitions**.
1. Search for "deploy export" and select the **Deploy export to Event Hub for Microsoft Defender for Cloud data** built-in policy.
1. Select **Assign**.
1. Define the basic policy options:
    1. In Scope, select the **...** to select the scope to apply the policy to.
    1. Find the root management group (for tenant scope), management group, subscription, or resource group in the scope and select **Select**.
        - To select a tenant root management group level you need to have permissions on tenant level.
    1. (Optional) In Exclusions you can define specific subscriptions to exclude from the export.
    1. Enter an assignment name.
    1. Make sure policy enforcement is enabled.

    :::image type="content" source="media/export-to-siem/create-export-policy.png" alt-text="Screenshot of assignment for the export policy." lightbox="media/export-to-siem/create-export-policy.png":::

1. In the policy parameters:
    1. Enter the resource group where the automation resource is saved.
    1. Select resource group location.
    1. Select the **...** next to the **Event Hub details** and enter the details for the event hub, including:
        - Subscription.
        - The Event Hubs namespace you created.
        - The event hub you created.
        - In **authorizationrules**, select the shared access policy that you created to send alerts.

    :::image type="content" source="media/export-to-siem/create-export-policy-parameters.png" alt-text="Screenshot of parameters for the export policy." lightbox="media/export-to-siem/create-export-policy-parameters.png":::

1. Select **Review and Create** and **Create** to finish the process of defining the continuous export to Event Hubs.
    - Notice that when you activate continuous export policy on the tenant (root management group level), it automatically streams your alerts on any **new** subscription that will be created under this tenant.

## Step 5: **For streaming alerts to QRadar SIEM** - Create a storage account

1. Go to the Azure portal, select **Create a resource**, and select **Storage account**. If that option isn't shown, search for "storage account".
1. Select **Create**.
1. Enter the details for the storage account, select **Review and Create**, and then **Create**.

    :::image type="content" source="media/export-to-siem/create-storage-account.png" alt-text="Screenshot of creating storage account." lightbox="media/export-to-siem/create-storage-account.png":::

1. After you create your storage account and go to the resource, in the menu select **Access Keys**.
1. Select **Show keys** to see the keys, and copy the connection string of Key 1.

    :::image type="content" source="media/export-to-siem/copy-storage-account-key.png" alt-text="Screenshot of copying storage account key." lightbox="media/export-to-siem/copy-storage-account-key.png":::

<a name='step-6-for-streaming-alerts-to-splunk-siem---create-an-azure-ad-application'></a>

## Step 6: **For streaming alerts to Splunk SIEM** - Create a Microsoft Entra application

1. In the menu search box, search for "Microsoft Entra ID" and go to Microsoft Entra ID.
1. Go to the Azure portal, select **Create a resource**, and select **Microsoft Entra ID**. If that option isn't shown, search for "active directory".
1. In the menu, select **App registrations**.
1. Select **New registration**.
1. Enter a unique name for the application and select **Register**.

    :::image type="content" source="media/export-to-siem/register-application.png" alt-text="Screenshot of registering application." lightbox="media/export-to-siem/register-application.png":::

1. Copy to Clipboard and save the **Application (client) ID** and **Directory (tenant) ID**.
1. Create the client secret for the application:
    1. In the menu, go to **Certificates & secrets**.
    1. Create a password for the application to prove its identity when requesting a token:
    1. Select **New client secret**.
    1. Enter a short description, choose the expiration time of the secret, and select **Add**.

    :::image type="content" source="media/export-to-siem/create-client-secret.png" alt-text="Screenshot of creating client secret." lightbox="media/export-to-siem/create-client-secret.png":::

1. After the secret is created, copy the Secret ID and save it for later use together with the Application ID and Directory (tenant) ID.

<a name='step-7-for-streaming-alerts-to-splunk-siem---allow-azure-ad-to-read-from-the-event-hub'></a>

## Step 7: **For streaming alerts to Splunk SIEM** - Allow Microsoft Entra ID to read from the event hub

1. Go to the Event Hubs namespace you created.
1. In the menu, go to **Access control**.
1. Select **Add** and select **Add role assignment**.
1. Select **Add role assignment**.

    :::image type="content" source="media/export-to-siem/add-role-assignment.png" alt-text="Screenshot of adding a role assignment." lightbox="media/export-to-siem/add-role-assignment.png":::

1. In the Roles tab, search for **Azure Event Hubs Data Receiver**.
1. Select **Next**.
1. Select **Select Members**.
1. Search for the Microsoft Entra application you created before and select it.
1. Select **Close**.

To continue setting up export of alerts, [install the built-in connectors](export-to-siem.md#step-2-connect-the-event-hub-to-your-preferred-solution-using-the-built-in-connectors) for the SIEM you're using.
