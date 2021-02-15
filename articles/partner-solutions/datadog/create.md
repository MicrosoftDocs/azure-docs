---
title: Create Datadog - Azure partner solutions
description: This article describes how to use the Azure portal to create an instance of Datadog.
ms.service: partner-services
ms.topic: quickstart
ms.date: 02/16/2021
author: tfitzmac
ms.author: tomfitz
---

# QuickStart: Get started with Datadog

In this quickstart, you'll create an instance of Datadog. You can either create a new Datadog organization or link to an existing Datadog organization.

## Pre-requisites

To set up the Azure Datadog integration, you must have **Owner** access on the Azure subscription. Ensure you have the appropriate access before starting the setup.

To use the Security Assertion Markup Language (SAML) Single Sign-On (SSO) feature within the Datadog resource, you must set up an Enterprise App.

Use the following steps:

1. Go to [Azure portal](https://portal.azure.com). Select **Azure Active Directory**.
1. In the left pane, select **Enterprise applications**.
1. Select **New Application**.
1. In **Add from the gallery**, search for *Datadog*. Select the search result then select **Add**.

   :::image type="content" source="media/create/datadogaadappgallery.png" alt-text="Datadog application in the AAD enterprise gallery." border="true":::

1. Once the app is created, go to properties from the side panel, and set the **User assignment required?** to **No**, then select **Save**.

   :::image type="content" source="media/create/userassignmentrequired.png" alt-text="Set properties for the Datadog application" border="true":::

1. Go to **Single sign-on** from the side panel. Then select **SAML**.

   :::image type="content" source="media/create/samlsso.png" alt-text="SAML authentication." border="true":::

1. Select **Yes** when prompted to **Save single sign-on settings**.

   :::image type="content" source="media/create/savesso.png" alt-text="Save single-sign on for the Datadog app" border="true":::

1. The setup of the Single Sign on is now complete.

## Find offer

Use the Azure portal to find Datadog.

1. Go to the [Azure portal](https://portal.azure.com/) and sign in.

1. If you've visited the **Marketplace** in a recent session, select the icon from the available options. Otherwise, search for _Marketplace_.

    :::image type="content" source="media/create/marketplace.png" alt-text="Marketplace icon.":::

1. In the Marketplace, search for **Datadog**.

1. In the plan overview screen, select the **Set up + subscribe**.

   :::image type="content" source="media/create/datadogapp.png" alt-text="Datadog application in Azure Marketplace.":::

## Create a Datadog resource in Azure

The portal displays a form for creating the Datadog resource.

:::image type="content" source="media/create/datadogcreateresource.png" alt-text="Create Datadog resource" border="true":::

Set the following values.

|Property | Description
|:-----------|:-------- |
| Subscription | Select the Azure subscription you want to use for creating the Datadog resource. You must have owner access. |
| Resource group | Specify whether you want to create a new resource group or use an existing one. A [resource group](../azure-resource-manager/management/overview.md#resource-groups) is a container that holds related resources for an Azure solution. |
| Resource name | The name of the Datadog resource. This name will be the name of the new Datadog organization, when creating a new Datadog organization. |
| Location | Select West US 2. Please note that this is the only Azure region supported by Datadog during this preview. |
| Datadog organization | To create a new Datadog organization, select **New**. To link to an existing Datadog organization, select **Existing**. |
| Pricing plan | When creating a new organization, select from the list of available Datadog plans. |
| Billing Term | Monthly. |

If you're linking to an existing Datadog organization, see the next section. Otherwise select **Next: Metrics and logs** and skip the next section.

## Link to existing Datadog organization

You can create a new Datadog resource in Azure and link it to an existing Datadog organization. For linking to an existing Datadog organization to a Datadog resource in Azure, you need to login and authenticate into Datadog.

Datadog org link	Please select the button which says ** Please login to your Datadog org**. This will open the Datadog login window in a pop up, where you will login into Datadog.

By default, Azure will link your default selected Datadog organization to your Datadog resource. However, if you would like to change it, please open datadoghq.com in a separate browser tab, login and switch to the specific organization. Once this is done, please select the button below titled **Please login to your Datadog org**.

:::image type="content" source="media/datadog-marketplace-integration/linktoexisting.png" alt-text="Link to existing Datadog organization." border="true":::

## Configure metrics

Use Azure resource tags to define configuration rules which specify which metrics to send to Datadog. You can include/exclude specific VM/VMSS/App service plans from the metrics using tags.
 
|Property	|Description
|:-----|:------|
|Action 	|Indicates whether to include or exclude Azure VM/VMSS/App |Service plans with the tags
|Name	|Name of the tag corresponding to the VM/VMSS/App Service plans 
|Value	|Value of the tag corresponding to the VM/VMSS/App Service plans

Tag rules for sending metrics are: 

- By default, metrics are collected for all resources – except for VM/VMSS/App Service plans
- VM/VMSS/App Service plans with *Include* tags send metrics to Datadog 
- VM/VMSS/App Service plans with *Exclude* tags do not send metrics to Datadog 
- If there is a conflict between inclusion and exclusion rules, exclusion takes a priority

For example, the screenshot below shows a tag rule where only those VM/VMSS/App service plans tagged as *Datadog = True* send metrics to Datadog.

## Configure logs

There are 2 types of logs that can be emitted from Azure to Datadog. 

1. **Subscription level logs** - Provide insight into the operations on each Azure resource in the subscription from the outside (the management plane) in addition to updates on Service Health events. Use the Activity Log, to determine the what, who, and when for any write operations (PUT, POST, DELETE) taken on the resources in your subscription. There is a single Activity log for each Azure subscription.

1. **Azure resource logs** - Provide insight into operations that were performed within an Azure resource (the data plane), for example getting a secret from a Key Vault or making a request to a database. The content of resource logs varies by the Azure service and resource type.

Subscription level logs can be sent to Datadog by checking the box titled **Send subscription level logs**. If this is left unchecked none of the subscription level logs are sent to Datadog. 
Azure resource logs can be sent to Datadog by checking the box titled **Send Azure resource logs for all defined resources**. The types of Azure resource logs are listed in Azure Monitor Resource Log categories .  To filter the specific set of Azure resources sending logs to Datadog, you can use Azure resource tags.  

Tag rules for sending logs are:

- By default, logs are collected for all resources.
- Azure resources with *Include* tags send logs to Datadog.
- Azure resources with  *Exclude* tags do not send logs to Datadog.
- If there is a conflict between inclusion and exclusion rules, exclusion takes priority.

Once you have completed configuring metrics and logs, select **Next: Single sign-on**.

:::image type="content" source="media/datadog-marketplace-integration/ configmetricslogs.png" alt-text="Configure Logs and Metrics." border="true":::

## Configure single sign-on

If your organization uses Azure Active Directory as its identity provider, you can establish single sign-on from the Azure portal to Datadog. If your organization uses some other identity provider or you don't want to establish single sign-on at this time, you can skip this section.

If you are linking the Datadog resource to an existing Datadog organization, you can't set up single sign-on at this step. Instead, you set up single sign-on after creating the Datadog resource. For more information, see [Reconfigure single sign-on]().

:::image type="content" source="media/create/linkingsso.png" alt-text="Single sign-on for linking to existing Datadog organization." border="true":::

To establish single sign-on through Azure Active directory, select the checkbox for **Enable single sign-on through Azure Active Directory**.

The Azure portal retrieves the appropriate Datadog application from Azure Active Directory. The app matches the Enterprise app you provided in an earlier step.

Select the Datadog app name.

:::image type="content" source="media/create/sso.png" alt-text="Enable Single sign-on to Datadog." border="true":::

Select **Next: Tags**.

## Add custom tags

You can specify custom tags for the new Datadog resource. Provide name and value pairs for the tags to apply to the Datadog resource.

:::image type="content" source="media/create/tags.png" alt-text="Add custom tags for the Datadog resource." border="true":::

When you've finished adding tags, select **Next: Review+Create**.

## Review + Create Datadog resource

Review your selections and the terms of use. After validation completes, select **Create**.

:::image type="content" source="media/create/reviewcreate.png" alt-text="Review and Create Datadog resource." border="true":::

Azure deploys the Datadog resource.

When the process completes, select **Go to Resource** to see the Datadog resource.

:::image type="content" source="media/create/gotoresource.png" alt-text="Datadog resource deployment." border="true":::

## Next steps

> [!div class="nextstepaction"]
> [Manage the Datadog resource](manage.md)
