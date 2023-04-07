---
title: Configure advanced security for Microsoft Sentinel playbooks
description: This article shows how to define an access restriction policy for Microsoft Sentinel Standard-plan playbooks, so that they can support private endpoints.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 12/27/2022
---

# Configure advanced security for Microsoft Sentinel playbooks

> [!IMPORTANT]
>
> The new version of access restriction policies is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article shows how to define an [access restriction policy](../app-service/overview-access-restrictions.md) for Microsoft Sentinel Standard-plan playbooks, so that they can support private endpoints. Defining this policy will ensure that **only Microsoft Sentinel will have access** to the Standard logic app containing your playbook workflows.

Learn more about [using private endpoints to secure traffic between Standard logic apps and Azure virtual networks](../logic-apps/secure-single-tenant-workflow-virtual-network-private-endpoint.md).

## Define an access restriction policy

1. From the Microsoft Sentinel navigation menu, select **Automation**. Select the **Active playbooks** tab.

1. Filter the list for Standard-plan apps.
    1. Select the **Plan** filter.
    1. Clear the **Consumption** checkbox.
    1. Select **OK**.

        :::image type="content" source="media/define-playbook-access-restrictions/filter-list-for-standard.png" alt-text="Screenshot showing how to filter the list of apps for the standard plan type.":::

1. Select a playbook to which you want to restrict access.

    :::image type="content" source="media/define-playbook-access-restrictions/select-playbook.png" alt-text="Screenshot showing how to select playbook from the list of playbooks.":::

1. Select the logic app link on the playbook screen.

    :::image type="content" source="media/define-playbook-access-restrictions/select-logic-app.png" alt-text="Screenshot showing how to select logic app from the playbook screen.":::

1. From the navigation menu of your logic app, under **Settings**, select **Networking**.

    :::image type="content" source="media/define-playbook-access-restrictions/select-networking.png" alt-text="Screenshot showing how to select networking settings from the logic app menu.":::

1. In the **Inbound traffic** area, select **Access restriction**.  

    :::image type="content" source="media/define-playbook-access-restrictions/select-access-restriction.png" alt-text="Screenshot showing how to select access restriction policy for configuration.":::

1. In the **Access Restrictions** page, leave the **Allow public access** checkbox marked.

1. Under **Site access and rules**, select **+ Add**. The **Add rule** panel will open to the right.

    :::image type="content" source="media/define-playbook-access-restrictions/add-filter-rule.png" alt-text="Screenshot showing how to add a filter rule to your access restriction policy.":::

1. Enter the following information in the **Add rule** panel. The name and optional description should reflect that this rule allows only Microsoft Sentinel to access the logic app. Leave the fields not mentioned below as they are.

    | Field | Enter or select |
    | ----- | --------------- |
    | **Name**  | Enter `SentinelAccess` or another name of your choosing. |
    | **Action** | Allow |
    | **Priority** | Enter `1` |
    | **Description** | Optional. Add a description of your choosing. |
    | **Type** | Select **Service Tag**. |
    | **Service Tag**<br>*(will appear only after you<br>select **Service Tag** above.)* | Search for and select **AzureSentinel**. |

1. Select **Add rule**.

Your policy should now look like this:

:::image type="content" source="media/define-playbook-access-restrictions/resulting-rule.png" alt-text="Screenshot showing rules as they should appear in your access restriction policy.":::

For more information about configuring access restriction policies in logic apps, see [Set up Azure App Service access restrictions](../app-service/app-service-ip-restrictions.md).

## Next steps

In this article, you learned how to define an access restriction policy to allow only Microsoft Sentinel to access Standard-plan playbooks, so that they can support private endpoints. Learn more about playbooks and automation in Microsoft Sentinel:

- [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md)
- [Tutorial: Use playbooks with automation rules in Microsoft Sentinel](tutorial-respond-threats-playbook.md)
