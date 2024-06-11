---
title: Define an access restriction policy for Standard-plan playbooks
description: This article shows how to define an access restriction policy for Microsoft Sentinel Standard-plan playbooks, so that they can support private endpoints.
ms.topic: how-to
author: batamig
ms.author: bagol
ms.date: 03/14/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#customerIntent: As a SOC engineer who's using Standard-plan playbooks, I want to understand how to define an access restriction policy, ensure that only Microsoft Sentinel has access to my Standard logic app with my playbook workflows.
---

# Define an access restriction policy for Standard-plan playbooks

This article describes how to define an [access restriction policy](/azure/app-service/overview-access-restrictions) for Microsoft Sentinel Standard-plan playbooks, so that they can support private endpoints.

Define an access restriction policy to ensure that only Microsoft Sentinel has access to the Standard logic app containing your playbook workflows.

For more information, see:

- [Secure traffic between Standard logic apps and Azure virtual networks using private endpoints](/azure/logic-apps/secure-single-tenant-workflow-virtual-network-private-endpoint)
- [Supported logic app types](logic-apps-playbooks.md#supported-logic-app-types)

> [!IMPORTANT]
>
> The new version of access restriction policies is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> [!INCLUDE [unified-soc-preview-without-alert](../includes/unified-soc-preview-without-alert.md)]

## Define an access restriction policy

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), select the **Configuration** > **Automation** page. For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Configuration** > **Automation**.

1. On the **Automation** page, select the **Active playbooks** tab.

1. Filter the list for Standard-plan apps. Select the **Plan** filter and clear the **Consumption** checkbox, and then select **OK**. For example:
    
    :::image type="content" source="../media/define-playbook-access-restrictions/filter-list-for-standard.png" alt-text="Screenshot showing how to filter the list of apps for the standard plan type.":::

1. Select a playbook to which you want to restrict access. For example:

    :::image type="content" source="../media/define-playbook-access-restrictions/select-playbook.png" alt-text="Screenshot showing how to select playbook from the list of playbooks." lightbox="../media/define-playbook-access-restrictions/select-playbook.png":::

1. Select the logic app link on the playbook screen. For example:

    :::image type="content" source="../media/define-playbook-access-restrictions/select-logic-app.png" alt-text="Screenshot showing how to select logic app from the playbook screen." lightbox="../media/define-playbook-access-restrictions/select-logic-app.png":::

1. From the navigation menu of your logic app, under **Settings**, select **Networking**. For example:

    :::image type="content" source="../media/define-playbook-access-restrictions/select-networking.png" alt-text="Screenshot showing how to select networking settings from the logic app menu." lightbox="../media/define-playbook-access-restrictions/select-networking.png":::

1. In the **Inbound traffic** area, select **Access restriction**. For example:

    :::image type="content" source="../media/define-playbook-access-restrictions/select-access-restriction.png" alt-text="Screenshot showing how to select access restriction policy for configuration.":::

1. In the **Access Restrictions** page, leave the **Allow public access** checkbox selected.

1. Under **Site access and rules**, select **+ Add**. The **Add rule** panel opens on the side. For example:

    :::image type="content" source="../media/define-playbook-access-restrictions/add-filter-rule.png" alt-text="Screenshot showing how to add a filter rule to your access restriction policy.":::

1. In the **Add rule** pane, enter the following details.

    The name and optional description should reflect that this rule allows only Microsoft Sentinel to access the logic app. Leave the fields not mentioned below as they are.

    | Field | Enter or select |
    | ----- | --------------- |
    | **Name**  | Enter `SentinelAccess` or another name of your choosing. |
    | **Action** | Allow |
    | **Priority** | Enter `1` |
    | **Description** | Optional. Add a description of your choosing. |
    | **Type** | Select **Service Tag**. |
    | **Service Tag**<br>*(will appear only after you<br>select **Service Tag** above.)* | Search for and select **AzureSentinel**. |

1. Select **Add rule**.

## Sample policy

After following the procedure in this article,  your policy should look as follows:

:::image type="content" source="../media/define-playbook-access-restrictions/resulting-rule.png" alt-text="Screenshot showing rules as they should appear in your access restriction policy.":::

## Related content

For more information, see:

- [Automate threat response with Microsoft Sentinel playbooks](automate-responses-with-playbooks.md)
- [Use playbooks with automation rules in Microsoft Sentinel](tutorial-respond-threats-playbook.md)
- [Set up Azure App Service access restrictions](/azure/app-service/app-service-ip-restrictions)