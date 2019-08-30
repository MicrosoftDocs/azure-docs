---
title: Onboarding to Notifications for Azure Key Vault (PREVIEW)
description: Learn how to grant permission to many applications to access a key vault
services: key-vault
author: msmbaldwin
manager: rkarlin
tags: azure-resource-manager

ms.service: key-vault
ms.topic: tutorial
ms.date: 08/30/2019
ms.author: mbaldwin

---

# Onboarding to Notifications for Azure Key Vault (PREVIEW)

Key Vault Notifications is a new feature that is in preview. It isdesigned to allow users to be notified when the status of a secretstored in key vault has changed. A status change is defined as a secretthat is about to expire (within 30 days of expiration), a secret thathas expired, or a secret that has a new version available. Notificationsfor all 3 secret types (key, certificate, and secret) are supported.

This feature allows users to 'listen' for status updates to their key vault by leveraging Event Grid instead of having to continuously poll key vault to find out if a status change has occurred.

This feature also allows users to respond to status changes in their key vaults programmatically using Azure Automation.

This document will help walk you through the process of setting up notifications for Key Vault.

## Prerequisites

This feature is currently in preview. You need to request access before proceeding with the steps listed in this document.

Visit **http://aka.ms/keyvaultnotifications** and submit your Azure subscription id to the intake form and wait for confirmation that your subscriptions have been whitelisted to use this feature before proceeding.

## Feature Overview

Event Grid allows you to select an Azure Resource, such as a key vault, to subscribe to and monitor for pre-defined "events". When an event triggers, the result is sent to an endpoint.

An endpoint is a URL that is set up to receive an HTTP POST request from Event Grid. In this example we will use a web hook from Azure Automation that will trigger a runbook to execute when it receives the POST request.

A runbook is an Azure Automation logic application. It is a process automation tool which will allow you to execute a script based on a trigger. In this example, the trigger will be a webhook, and we will execute a PowerShell script.

## Feature Flow Example

Event Grid is subscribed to the key vault as a "topic resource". One of the keys in the key vault is about to expire. Event Grid is notified of the status change of the key in key vault and makes an HTTP POST to an endpoint. In this example, the endpoint is a webhook connected to a runbook. The webhook is triggered, and the runbook PowerShell script executes. The script will programmatically generate a new version of the key.

`![](./images/media/image1.png)

## Setup Procedure

This procedure assumes that you have the following prerequisites.

1.  You have an Azure Subscription

2.  You have Azure CLI Command Prompt installed on your machine

3.  Your Azure Subscription has been whitelisted to use this feature
    (see prerequisites section above).

4.  You have a key vault in your Azure Subscription.

### Step 1: Configuration

1.  Open the Azure CLI Command Prompt Window and type in the following
    commands

    a.  az cloud set \--name AzureCloud

    b.  az login

    c.  az account set -s Your Subscription ID

    d.  az provider register \--namespace Microsoft.KeyVault     

### Step 2:Create an Azure Automation Account

1.  Go to portal.azure.com and log in to your subscription

2.  In the search box, type in 'Automation Accounts'

3.  Under the "Services" Section of the drop-down from the search bar,
    select Automation Accounts.

4.  Click Add 

![](./images/media/image2.png)

5.  Fill the required information in the "Add Automation Account" Blade
    and select Create

6.  Wait for your automation account to be created.

### Step 3: Create a Runbook and Webhook

![](./images/media/image3.png)

1.  Select the automation account you created in step 1.

2.  Select "Runbooks" under the Process Automation section

3.  Click the "Create a runbook"

4.  Name your runbook and select "PowerShell" as the runbook type

5.  Click on the runbook you created, and select the "Edit" Button

6.  Enter the following code (for testing purposes) and click the
    "Publish" button. This will output the result of the POST request
    received.

    
```azurepowershell
    param
    (
    [Parameter (Mandatory = $false)]
    [object] $WebhookData
    )
    
    #If runbook was called from Webhook, WebhookData will not be null.
    if ($WebhookData) {
    #Write-Output "WebhookData <$WebhookData>"
    $WebhookDataRequestBody = $WebhookData.RequestBody
    Write-Output $WebhookDataRequestBody    
    }
    else
    {
    # Error
    write-Error "No input data found." 
    }
```


![](./images/media/image4.png)

7.  Select "Webhooks" from the resources section of the runbook you just
    published

8.  Click "Add Webhook"

![](./images/media/image5.png)

9.  Select "Create new Webhook"

10. Name the webhook, set an expiration date, and copy the URL

    a.  Please note that you cannot view the URL after you create it.
        Make sure you copy to clipboard and save it in a secure location
        where you can access it for the remainder of the tutorial.

11. Select Ok, and Click Create

    a.  You may need to click into the "parameters and run settings"
        option and select ok before the Create button will be enabled.
        You don't need to enter any parameters.

![](./images/media/image6.png)

### Step 4: Create an Event Grid Subscription

1.  Open the Azure Portal using the following link:

    https://ms.portal.azure.com/?Microsoft_Azure_KeyVault_ShowEvents=true&Microsoft_Azure_EventGrid_publisherPreview=true

2.  Go to your key vault and select the "Events" tab

    a.  If you cannot see the Events tab, make sure that you are using
        the preview version of the portal (see the link above).

![](./images/media/image7.png)

3.  Click the "+ Event Subscription" button

    a.  Create a descriptive name for the subscription

    b.  Choose "Event Grid Schema"

    c.  The topic resource should be the key vault you want monitored
        for status changes

    d.  Under event types, choose the specific event types for each
        secret type you want to monitor. (Default and recommended
        setting is all)

    e.  Select Webhook for endpoint type

    f.  When you click select an endpoint, a new context pane will open
        on the portal. In this field, paste the webhook URL that you
        created in Step 3 Task 10.

    g.  Select Confirm Selection on this context pane

    h.  Select Create

![](./images/media/image8.png)

### Step 5: Testing and Verification

> [!NOTE]
> This test assumes that you have subscribed to the new-version notification for keys in Step 4.
>
> This test assumes that you have the necessary privileges to create a new version of a key in a key vault.

![](./images/media/image9.png)

![](./images/media/image10.png)

1.  Go to your key vault on the Azure Portal

2.  Create a new key for testing purposes name the key and keep the
    remaining parameters in their default settings.

3.  Select the key that you have created and create a new version of the
    key.

4.  Now navigate to the events tab in your key vault.

5.  Click on the event grid subscription you created.

6.  Under metrics, see if an event was captured.

    a.  This validates that event grid successfully captured the status
        change of the key in your key vault.

![](./images/media/image11.png)

7.  Now go to your azure automation account on the Azure Portal

8.  Select the "Runbooks" tab, and click on the runbook you created

9.  Select the "Webhooks" tab, and look at the "last triggered"
    timestamp, confirm that this is the same time as when you created
    the new key version (within 60 seconds).

    a.  This validates that event grid made a POST to the webhook with
        the event details of the status change in your key vault, and
        the webhook was triggered.

![](./images/media/image12.png)

10. Now go back to your Runbook, and select the "Overview" Tab.

11. Look at the Recent Jobs list and you should see that a job was
    created, and that the status is complete.

    a.  This validates that the webhook triggered the runbook to start
        executing its script.

![](./images/media/image13.png)

12. You can drill down even further by selecting the recent job and
    looking at the actual POST request that was sent from event grid to
    the webhook.

13. Examine the JSON and make sure that the parameters for your key
    vault and event type are correct.

![](./images/media/image14.png)

14. If the "event type" parameter in the JSON object matches the event
    which occurred in the key vault (in this example,
    Microsoft.KeyVault.KeyNewVersionCreated) the test was successful.

### So Now What?

Congratulations! If you have followed all the steps above, you are now ready to programmatically respond to status changes of secrets stored in your key vault.

-   If have been using a polling-based system to look for status changes of secrets in your key vaults, migrate to using this notification feature.

-   Replace the test script in your runbook with code to programmatically renew your secrets when they are about to expire.

-   Stay connected with the User Voice forum and get notified when additional notification features become available.

## Troubleshooting

### Unable to create subscription

Reregister Event Grid and Key Vault is registered in your subscription resource providers. See [Azure resource providers and types](../azure-resource-manager/resource-manager-supported-services.md).

**Links to Additional Documentation**

- Learn more about [Azure Key Vault](key-vault-overview.md>
- Learn more about [Event Grid](../event-grid/overview.md)
- Learn more about [Azure Automation](../automation/index.yml)
