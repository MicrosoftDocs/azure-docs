---
title: Visualize data with enrichment widgets in Microsoft Sentinel
description: This article shows you how to enable the enrichment widgets experience, allowing you to better visualize entity data and insights and make better, faster decisions.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 11/15/2023
---

# Visualize data with enrichment widgets in Microsoft Sentinel 

This article shows you how to enable the enrichment widgets experience, allowing you to better visualize entity data and insights and make better, faster decisions.

Enrichment widgets are components that help you retrieve, visualize, and understand more information about entities. These widgets take data presentation to the next level by integrating external content, enhancing your ability to make informed decisions quickly.

> [!IMPORTANT]
>
> Enrichment widgets are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Enable enrichment widgets 

Widgets require using credentials to access and maintain connections to their data sources. These credentials can be in the form of API keys, username/password, or other secrets, and they are stored in a dedicated Azure Key Vault that you create for this purpose.

You must have the **Contributor** role for the workspace’s resource group to create this Key Vault in your environment. 

Microsoft Sentinel has automated the process of creating a Key Vault for enrichment widgets. To enable the widgets experience, take the following two steps: 

### Step 1: Create a dedicated Key Vault to store credentials

1. From the Microsoft Sentinel navigation menu, select **Entity behavior**.

1. On the **Entity behavior** page, select **Enrichment widgets (preview)** from the toolbar.

    :::image type="content" source="media/enable-enrichment-widgets/entity-behavior-page.png" alt-text="Screenshot of the entity behavior page." lightbox="media/enable-enrichment-widgets/entity-behavior-page.png":::

1. On the **Widgets Onboarding Page**, select **Create Key Vault**.

    :::image type="content" source="media/enable-enrichment-widgets/create-key-vault.png" alt-text="Screenshot of widget onboarding page instructions to create a key vault." lightbox="media/enable-enrichment-widgets/create-key-vault.png":::

    You will see an Azure portal notification when the Key Vault deployment is in progress, and again when it has completed.

    At that point you will also see that the **Create Key Vault** button is now grayed out, and beside it, the name of your new key vault appears as a link. You can access the key vault's page by selecting the link.

    Also, the section labeled **Step 2 - Add credentials**, previously grayed out, is now available.

    :::image type="content" source="media/enable-enrichment-widgets/add-credentials.png" alt-text="Screenshot of widget onboarding page instructions to add secrets to your key vault." lightbox="media/enable-enrichment-widgets/add-credentials.png":::

### Step 2: Add relevant credentials to your widgets' Key Vault

The data sources accessed by all the available widgets are listed on the **Widgets Onboarding Page**, under **Step 2 - Add credentials**. You need to add each data source's credentials one at a time. To do so, take the following steps for each data source:

1. See the [instructions in the section below](#find-your-credentials-for-each-widget-source) for finding or creating credentials for a given data source. (Alternatively, you can select the **Find your credentials** link on the Widgets Onboarding Page for a given data source, which will redirect you to the same instructions below.) When you have the credentials, copy them aside and proceed to the next step.

1. Select **Add credentials** for that data source. The **Custom deployment** wizard will open in a side panel on the right side of the page.  

    The **Subscription**, **Resource group**, **Region**, and **Key Vault name** fields are all pre-populated, and there should be no reason for you to edit them.

1. Enter the credentials you saved into the relevant fields in the **Custom deployment** wizard (**API key**, **Username**, **Password**, and so on).

1. Select **Review + create**.

1. The **Review + create** tab will present a summary of the configuration, and possibly the terms of the agreement. 

    :::image type="content" source="media/enable-enrichment-widgets/create-data-source-credentials.png" border="false" alt-text="Screenshot of wizard to create a new set of credentials for your widget data source." lightbox="media/enable-enrichment-widgets/create-data-source-credentials.png":::

    > [!NOTE]
    >
    > Before you select **Create** to approve the terms and create the secret, it's a good idea to duplicate the current browser tab, and then select **Create** in the new tab. This is recommended because creating the secret will, for now, take you outside of the Microsoft Sentinel context and into the Key Vault context, with no direct way back. This way, you'll have the old tab remain on the Widgets Onboarding Page, and the new tab for managing your key vault secrets.

    Select **Create** to approve the terms and create the secret.

1. A new page will be displayed for your new secret, with a message that the deployment is complete.

    :::image type="content" source="media/enable-enrichment-widgets/deployment-complete.png" alt-text="Screenshot of completed secret deployment." lightbox="media/enable-enrichment-widgets/deployment-complete.png":::

    Return to the Widgets Onboarding Page (in your original browser tab).

    (If you didn't duplicate the browser tab as directed in the Note above, open a new browser tab and return to the widgets onboarding page.)

1. Verify that your new secret was added to the key vault:

    1. Open the key vault dedicated for your widgets.
    1. Select **Secrets** from the key vault navigation menu.
    1. See that the widget source’s secret has been added to the list.

### Find your credentials for each widget source

This section contains instructions for creating or finding your credentials for each of your widgets' data sources.

> [!NOTE]
> Not all widget data sources require credentials for Microsoft Sentinel to access them.

#### Credentials for Virus Total

1. Enter the **API key** defined in your Virus Total account. You can [sign up for a free Virus Total account](https://aka.ms/SentinelWidgetsRegisterVirusTotal) to get an API key.

1. After you select **Create** and deploy the template as described in paragraph 6 of [Step 2 above](#step-2-add-relevant-credentials-to-your-widgets-key-vault), a secret named "Virus Total" will be added to your key vault.

#### Credentials for AbuseIPDB

1. Enter the **API key** defined in your AbuseIPDB account. You can [sign up for a free AbuseIPDB account](https://aka.ms/SentinelWidgetsRegisterAbuseIPDB) to get an API key.

1. After you select **Create** and deploy the template as described in paragraph 6 of [Step 2 above](#step-2-add-relevant-credentials-to-your-widgets-key-vault), a secret named "AbuseIPDB" will be added to your key vault.

#### Credentials for Anomali

1. Enter the **username** and **API key** defined in your Anomali account.

1. After you select **Create** and deploy the template as described in paragraph 6 of [Step 2 above](#step-2-add-relevant-credentials-to-your-widgets-key-vault), a secret named "Anomali" will be added to your key vault.

#### Credentials for Recorded Future

1. Enter your Recorded Future **API key**. Contact your Recorded Future representative to get your API key. You can also [apply for a 30-day free trial especially for Sentinel users](https://aka.ms/SentinelWidgetsRegisterRecordedFuture).

1. After you select **Create** and deploy the template as described in paragraph 6 of [Step 2 above](#step-2-add-relevant-credentials-to-your-widgets-key-vault), a secret named "Recorded Future" will be added to your key vault.

#### Credentials for Microsoft Defender Threat Intelligence

1. The Microsoft Defender Threat Intelligence widget should fetch the data automatically if you have the relevant Microsoft Defender Threat Intelligence license. There is no need for credentials.

1. You can check if you have the relevant license, and if necessary, purchase it, at the [Microsoft Defender Threat Intelligence official website](https://www.microsoft.com/security/business/siem-and-xdr/microsoft-defender-threat-intelligence).

## Add new widgets when they become available

Microsoft Sentinel aspires to offer a broad collection of widgets, making them available as they are ready. As new widgets become available, their data sources will be added to the list on the Widgets Onboarding Page, if they aren't already there. When you see announcements of newly available widgets, check back on the Widgets Onboarding Page for new data sources that don't yet have credentials configured. To configure them, [follow Step 2 above](#step-2-add-relevant-credentials-to-your-widgets-key-vault).

## Remove the widgets experience

To remove the widgets experience from Microsoft Sentinel, simply delete the Key Vault that you created in [Step 1 above](#step-1-create-a-dedicated-key-vault-to-store-credentials).

## Troubleshooting

### Errors in widget configuration

If in one of your widgets you see an error message about the widget configuration, for example as shown in the following screenshot, check that you followed the [configuration instructions above](#step-2-add-relevant-credentials-to-your-widgets-key-vault) and the [specific instructions for your widget](#find-your-credentials-for-each-widget-source).

:::image type="content" source="media/enable-enrichment-widgets/widget-not-configured.png" alt-text="Screenshot of widget configuration error message.":::

### Failure to create Key Vault

If you receive an error message when creating the Key Vault, there could be multiple reasons:

- You don't have the **Contributor** role on your resource group.

- Your subscription is not registered to the Key Vault resource provider.

### Failure to deploy secrets to your Key Vault

If you receive an error message when deploying a secret for your widget data source, check the following:

- Check that you entered the source credentials correctly.

- The provided ARM template may have changed.

## Next steps

In this article, you learned how to enable widgets for data visualization on entity pages. For more information about entity pages and other places where entity information appears:

- [Investigate entities with entity pages in Microsoft Sentinel](entity-pages.md)
- [Understand Microsoft Sentinel's incident investigation and case management capabilities](incident-investigation.md)
