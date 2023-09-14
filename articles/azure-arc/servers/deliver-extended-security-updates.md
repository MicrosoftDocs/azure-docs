---
title: Deliver Extended Security Updates for Windows Server 2012
description: Learn how to deliver Extended Security Updates for Windows Server 2012.
ms.date: 09/14/2023
ms.topic: conceptual
---

# Deliver Extended Security Updates for Windows Server 2012

This article provides steps to enable delivery of Extended Security Updates (ESUs) to Windows Server 2012 machines onboarded to Arc-enabled servers. You can enable ESUs to these machines individually or at scale.

## Before you begin

Plan and prepare to onboard your machines to Azure Arc-enabled servers. See [Prepare to deliver Extended Security Updates for Windows Server 2012](prepare-extended-security-updates.md) to learn more.

You'll also need the [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role in [Azure RBAC](../../role-based-access-control/overview.md) to create and assign ESUs to Arc-enabled servers.

## Manage ESU licenses

1. From your browser, sign in to the [Azure portal](https://portal.azure.com).

1. On the **Azure Arc** page, select **Extended Security Updates** in the left pane.

    :::image type="content" source="media/deliver-extended-security-updates/esu-main-window.png" alt-text="Screenshot  of main ESU window showing licenses tab and eligible resources tab.":::

    From here, you can view and create ESU **Licenses** and view **Eligible resources** for ESUs.

> [!NOTE]
> When viewing all your Arc-enabled servers from the **Servers** page, a banner specifies how many Windows 2012 machines are eligible for ESUs. You can then select **View servers in Extended Security Updates** to view a list of resources that are eligible for ESUs, together with machines already ESU enabled.
> 
## Create Azure Arc WS2012 licenses

The first step is to provision Windows Server 2012 and 2012 R2 Extended Security Update licenses from Azure Arc. You link these licenses to one or more Arc-enabled servers that you select in the next section.

After you provision an ESU license, you need to specify the SKU (Standard or Datacenter), type of cores (Physical or vCore), and number of 16-core and 2-core packs to provision an ESU license. You can also provision an Extended Security Update license in a deactivated state so that it won’t initiate billing or be functional on creation. Moreover, the cores associated with the license can be modified after provisioning.

> [!NOTE]
> The provisioning of ESU licenses requires you to attest to their SA or SPLA coverage.
> 

The **Licenses** tab displays Azure Arc WS2012 licenses that are available. From here you can select an existing license to apply or create a new license.

:::image type="content" source="media/deliver-extended-security-updates/esu-licenses.png" alt-text="Screenshot showing existing licenses.":::

1. To create a new WS2012 license, select **Create ESUs license**, and then provide the information required to configure the license on the page.

    For details on how to complete this step, see [License provisioning guidelines for Extended Security Updates for Windows Server 2012](license-extended-security-updates.md).

1. Review the information provided, and then select **Create**.

    The license you created appears in the list and you can link it to one or more Arc-enabled servers by following the steps in the next section.

    :::image type="content" source="media/deliver-extended-security-updates/esu-new-license.png" alt-text="Screenshot of licenses tab showing the newly created license in the list.":::

## Link ESU licenses to Arc-enabled servers

You can select one or more Arc-enabled servers to link to an Extended Security Update license. Once you've linked a server to an activated ESU license, the server is eligible to receive Windows Server 2012 and 2012 R2 ESUs. 

> [!NOTE]
> You have the flexibility to configure your patching solution of choice to receive these updates – whether that’s [Update Manager](../../update-center/overview.md), [Windows Server Update Services](/windows-server/administration/windows-server-update-services/get-started/windows-server-update-services-wsus), Microsoft Updates, [Microsoft Endpoint Configuration Manager](/mem/configmgr/core/understand/introduction), or a third-party patch management solution. 
> 
1. Select the **Eligible Resources** tab to view a list of all your Arc-enabled servers running Windows Server 2012 and 2012 R2.

    :::image type="content" source="media/deliver-extended-security-updates/esu-eligible-resources.png" alt-text="Screenshot of eligible resources tab showing servers eligible to receive ESUs.":::

    The **ESUs status** column indicates whether or not the machine is ESUs-enabled.

1.  To enable ESUs for one or more machines, select them in the list, and then select **Enable ESUs**.
    
1.  On the **Enable Extended Security Updates** page, it shows the number of machines selected to enable ESU and the WS2012 licenses available to apply. Select a license to link to the selected machine(s) and then select **Enable**.

    :::image type="content" source="media/deliver-extended-security-updates/esu-select-license.png" alt-text="Screenshot of window for selecting the license to apply to previously chosen machines.":::

    > [!NOTE]
    > You can also create a license from this page by selecting **Create an ESU license**.
    > 

The status of the selected machines changes to **Enabled**.

:::image type="content" source="media/deliver-extended-security-updates/esu-enabled-resources.png" alt-text="Screenshot of eligible resources tab showing status of enabled for previously selected servers.":::

If any problems occur during the enablement process, see [Troubleshoot delivery of Extended Security Updates for Windows Server 2012](troubleshoot-extended-security-updates.md) for assistance.
