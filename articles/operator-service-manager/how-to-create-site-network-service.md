---
title: How to create site network service for Azure Operator Service Manager
description: Learn how to create site network service in Azure Operator Service Manager.
author: sherrygonz
ms.author: sherryg
ms.date: 09/11/2023
ms.topic: how-to
ms.service: azure-operator-service-manager
---

# Create site network service in Azure Operator Service Manager

In this how-to guide you learn how to create a Site Network Service (SNS) using the Azure portal. A Site Network Service (SNS) is a collection of network functions along with Azure infrastructure that come together to offer a service. The set of Network Functions (NFs) and infrastructure that make up that service defined by the Network Service Design Version (NSDV).

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription.
- A Resource Group over which you have the Contributor role.
- You have completed [Create a site in Azure Operator Service Manager](how-to-create-site.md).
- The Network Service Design (NSD) you plan to use is published within the same tenant where you intend to deploy the Site Network Service (SNS).
- Collaboration has taken place with the Network Services Design Version (NSDV) designed to identify the required details that must be included in the Configuration Group Value (CGVs) for this specific Site Network Service (SNS).
- Verify that any prerequisites specific to the Network Service Design (NSD) are correctly deployed. The documentation from the Network Service Design (NSD) designer contains the essential details of these prerequisites.

## Create the Site Network Service

1. In the Azure portal, select **Create resource**.
1. In the search bar, search for *Site Network Service* and then select **Create**.

    :::image type="content" source="media/how-to-create-site-network-service-search-site-network-services.png" alt-text="Diagram showing the Azure portal Create resource page and search for Site Network Service." lightbox="media/how-to-create-site-network-service-search-site-network-services.png":::

1. On the **Basics** tab, enter or select the information shown in the table. Accept the default values for the remaining settings.

    |Setting|Value| 
    |---|---| 
    |Subscription| Select your subscription.| 
    |Resource group| Select your resource group.|
    |Name| Enter the name for Site Network Service.| 
    |Region| Select the location.| 
    |Site| Select the name of the Site.|
    |Managed Identity Type | This setting relies on the Network Service Design Version (NSDV). Consult your Network Service Design (NSD) designer for guidance. |

    :::image type="content" source="media/how-to-create-site-network-service-basics-tab.png" alt-text="Screenshot showing the Basics tab with the mandatory fields." lightbox="media/how-to-create-site-network-service-basics-tab.png":::

## Choose a Network Service Design

1. On the *Choose a Network Service Design* tab, select the **Publisher**, **Network Service Design Resource**, **Network Service Design Version** that you published earlier.

    > [!NOTE]
    > Consult the documentation from your Network Service Design (NSD) Publisher or directly contact them to obtain the Publisher Offering Location, Publisher, Network Service Design Resource and Network Service Design version.

    :::image type="content" source="media/how-to-create-site-network-service-choose-design-tab.png" alt-text="Screenshot showing the Choose a Network Service Design tab with the mandatory fields." lightbox="media/how-to-create-site-network-service-choose-design-tab.png":::

1. On the *Set initial configuration* tab, select a Configuration Group Value resource for each schema listed in the selected Network Service Design.

    :::image type="content" source="media/how-to-create-site-network-service-set-initial-configuration-tab.png" alt-text="Screenshot showing the Set initial configuration tab and Create New tab." lightbox="media/how-to-create-site-network-service-set-initial-configuration-tab.png":::

1. Select **Create New** on the *Set initial configuration* page.
1. Enter the name for the Configuration Group into the **Configuration Group name** field.
1. Enter the configuration into the *Editor* panel.

### Editor panel

To configure settings in the *editor* panel, your input must be in JSON format:

- Begin by entering a pair of curly brackets '{}'.
- You notice a red squiggle appearing underneath them.
- Hover your mouse cursor over the red squiggle to reveal the fields that require input.
- More red squiggles might appear for any remaining errors. Follow the same process to address these issues.
- Once all errors have been resolved, select **Create Configuration**.

    :::image type="content" source="media/how-to-create-site-network-service-editor-panel-set-config.png" alt-text="Screenshot showing the editor panel with a sample error to correct." lightbox="media/how-to-create-site-network-service-editor-panel-set-config.png":::

> [!NOTE]
> Consult the documentation from your Network Service Design (NSD) Publisher or directly contact them to obtain the Configuration Group Value.

## Review and create

1. Select **Review + create** and then **Create**.
1. Select the link under *Current State -> Resources*. The link takes you to the *Managed Resource Group* created by the Azure Operator Service Manager (AOSM).