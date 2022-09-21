---
title: Register existing SAP system (preview)
description: Learn how to register an existing SAP system in Azure Center for SAP solutions (ACSS) through the Azure portal. You can visualize, manage, and monitor your existing SAP system through ACSS.
ms.service: azure-center-sap-solutions
ms.topic: how-to
ms.date: 07/19/2022
ms.author: ladolan
author: lauradolan
#Customer intent: As a developer, I want to register my existing SAP system so that I can use the system with Azure Center for SAP solutions (ACSS).
---

# Register existing SAP system (preview)

[!INCLUDE [Preview content notice](./includes/preview.md)]

In this how-to guide, you'll learn how to register an existing SAP system with *Azure Center for SAP solutions (ACSS)*. After you register an SAP system with ACSS, you can use its visualization, management and monitoring capabilities through the Azure portal. For example, you can:

- View and track the SAP system as an Azure resource, called the *Virtual Instance for SAP solutions (VIS)*.
- Get recommendations for your SAP infrastructure, based on quality checks that evaluate best practices for SAP on Azure.
- Get health and status information about your SAP system.
- Start and Stop SAP application tier.
- Monitor the Azure infrastructure metrics for the SAP system resources.

## Prerequisites

- Check that you're trying to register a [supported SAP system configuration](#supported-systems)
- Check that your Azure account has **Contributor** role access on the subscription or resource groups where you have the SAP system resources.
- Register the **Microsoft.Workloads** Resource Provider in the subscription where you have the SAP system.
- Make sure each virtual machine (VM) in the SAP system is currently running on Azure. These VMs include:
    - The ABAP SAP Central Services (ASCS) Server instance
    - The Application Server instance or instances
    - The Database instance for the SAP system identifier (SID)
- Make sure the **sapstartsrv** process is currently running on all the VMs in the SAP system.
    - Command to start up sapstartsrv process on SAP VMs: /usr/sap/hostctrl/exe/hostexecstart -start
- Grant the ACSS application **Azure SAP Workloads Management**  **Contributor** role access to the resource groups for the SAP system. There are two options:
    - If your Azure account has **Owner** or **User Access Admin** role access, you can automatically grant access to the application when registering the SAP system.
    - If your Azure account doesn't have **Owner** or **User Access Admin** role access, you can [enable access for the ACSS application](#enable-acss-resource-permissions) as described later.
- Grant access to your Azure Storage accounts from the virtual network where the SAP system exists. Use one of these options:
    - Allow outbound internet connectivity for the VMs.
    - Use a [**Storage** service tag](../virtual-network/service-tags-overview.md) to allow connectivity to any Azure storage account from the VMs.
    - Use a [**Storage** service tag with regional scope](../virtual-network/service-tags-overview.md) to allow storage account connectivity to the Azure storage accounts in the same region as the VMs.
    - Allowlist the region-specific IP addresses for Azure Storage.

## Supported systems

You can register SAP systems with ACSS that run on the following configurations:

- SAP NetWeaver or ABAP stacks
- Windows, SUSE and RHEL Linux operating systems
- HANA, DB2, SQL Server, Oracle, Max DB, and SAP ASE databases

The following SAP system configurations aren't supported in ACSS:

- HANA Large Instance (HLI)
- Systems with HANA Scale-out configuration
- Java stack
- Dual stack (ABAP and Java)
- Systems distributed across peered virtual networks
- Systems using IPv6 addresses

## Enable ACSS resource permissions

When you register an existing SAP system as a VIS, ACSS needs **Contributor** role access to the Azure subscription or resource group in which the SAP system exists. Before you register an SAP system with ACSS, either [update your Azure subscription permissions](#update-subscription-permissions) or [update your resource group permissions](#update-resource-group-permissions).

ACSS uses this role access to install VM extensions on the ASCS, Application Server and DB VMs. This step allows ACSS to discover the SAP system components, and other SAP system metadata. ACSS also needs this same permission to enable SAP system monitoring and management capabilities.

### Update subscription permissions

To update permissions for an Azure subscription:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Subscriptions** in the Azure portal's search bar.
1. On the **Subscriptions** page, select the name of the subscription where the SAP system exists.
1. In the subscription's sidebar menu, select **Access control (IAM)**.
1. On the **Access control (IAM)** page menu, select **Add role** &gt; **Add role assignment**.
1. On the **Role** tab of the **Add role assignment** page, select the **Contributor** role in the table.
1. Select **Next**.
1. On the **Members** tab, for **Assign access to**, select **User, group, or service principal**.
1. For **Members**, select **Select members**.
1. In the **Select members** pane, search for **Azure SAP Workloads Management**.
1. Select the ACSS application in the results.
1. Select **Select**.
1. Select **Review + assign**.

### Update resource group permissions

To update permissions for a resource group:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Resource groups** in the Azure portal's search bar.
1. On the **Resource groups** page, select the name of the resource group where the SAP system exists.
1. In the resource group's sidebar menu, select **Access control (IAM)**.
1. On the **Access control (IAM)** page, select **Add** &gt; **Add role assignment**.
1. On the **Role** tab of the **Add role assignment** page, select the **Contributor** role in the table.
1. Select **Next**.
1. On the **Members** tab, for **Assign access to**, select **User, group, or service principal**.
1. For **Members**, select **Select members**.
1. In the **Select members** pane, search for **Azure SAP Workloads Management**.
1. Select the ACSS application in the results.
1. Select **Select**.
1. Select **Review + assign**.

Then, repeat the process for any other resource groups where the SAP system exists.

## Register SAP system

To register an existing SAP system in ACSS:

1. Sign in to the [Azure portal](https://portal.azure.com). Make sure to sign in with an Azure account that has **Contributor** role access to the subscription or resource groups where the SAP system exists. For more information, see the [resource permissions explanation](#enable-acss-resource-permissions).
1. Search for and select **Azure Center for SAP solutions** in the Azure portal's search bar.
1. On the **Azure Center for SAP solutions** page, select **Register an existing SAP system**.

    :::image type="content" source="media/register-existing-system/register-button.png" alt-text="Screenshot of ACSS service overview page in the Azure portal, showing button to register an existing SAP system." lightbox="media/register-existing-system/register-button.png":::

1. On the **Basics** tab of the **Register existing SAP system** page, provide information about the SAP system.
    1. For **ASCS virtual machine**, select **Select ASCS virtual machine** and select the ASCS VM resource.
    1. For **SID name**, enter the SID name.
    1. For **SAP product**, select the SAP system product from the drop-down menu.
    1. For **Environment**, select the environment type from the drop-down menu. For example, production or non-production environments.
    1. For **Method to grant permission**, select your preferred method to grant Azure access to the related subscriptions and resource groups.
        - If you choose **Automatic**, ACSS has access to the entire Azure subscription where the ASCS VM exists. To use this option, your Azure account also must have **User Access Admin** or **Owner** role access.
        - If you choose **Manual**, you have to manually grant access to the resource group(s) where the SAP system exists. For more information, see the [resource permissions explanation](#enable-acss-resource-permissions).
    1. Select **Review + register** to discover the SAP system and begin the registration process.

        :::image type="content" source="media/register-existing-system/registration-page.png" alt-text="Screenshot of ACSS registration page, highlighting mandatory fields to identify the existing SAP system." lightbox="media/register-existing-system/registration-page.png":::

    1. On the **Review + register** pane, make sure your settings are correct. Then, select **Register**.

1. Wait for the VIS resource to be created. The VIS name is the same as the SID name. The VIS deployment finishes after all SAP system components are discovered from the ASCS VM that you selected.
  
You can now review the VIS resource in the Azure portal. The resource page shows the SAP system resources, and information about the system.

If the registration doesn't succeed, see [what to do when an SAP system registration fails in ACSS](#fix-registration-failure).

## Fix registration failure

The process of registering an SAP system in ACSS might fail for the following reasons:

- The selected ASCS VM and SID don't match. Make sure to select the correct ASCS VM for the SAP system that you chose, and vice versa.
- The ASCS instance or VM isn't running. Make sure the instance and VM are in the **Running** state.
- The **sapstartsrv** process isn't running on all the VMs in the SAP system.
    - Command to start up sapstartsrv process on SAP VMs: /usr/sap/hostctrl/exe/hostexecstart -start
- At least one Application Server and the Database aren't running for the SAP system that you chose. Make sure the Application Servers and Database VMs are in the **Running** state.
- The user trying to register the SAP system doesn't have **Contributor** role permissions. For more information, see the [prerequisites for registering an SAP system](#prerequisites).
- The ACSS service doesn't have **Contributor** role access to the Azure subscription or resource groups where the SAP system exists. For more information, see [how to enable ACSS resource permissions](#enable-acss-resource-permissions).

There's also a known issue with registering *S/4HANA 2021* version SAP systems. You might receive the error message: **Failed to discover details from the Db VM**. This error happens when the Database identifier is incorrectly configured on the SAP system. One possible cause is that the Application Server profile parameter `rsdb/dbid` has an incorrect identifier for the HANA Database. To fix the error:

1. Stop the Application Server instance:
    
    `sapcontrol -nr -function Stop`

1. Stop the ASCS instance:

    `sapcontrol -nr -function Stop`

1. Open the Application Server profile.

1. Add the profile parameter for the HANA Database: 

    `rsdb/dbid = HanaDbSid`

1. Restart the Application Server instance: 

    `sapcontrol -nr -function Start`

1. Restart the ASCS instance: 

    `sapcontrol -nr -function Start`

1. Delete the VIS resource whose registration failed.

1. [Register the SAP system](#register-sap-system) again.

If your registration fails:

1. Review the previous list of possible reasons for failure. Follow any steps to fix the issue.
1. Review any error messages in the Azure portal. Follow any recommended actions.
1. Delete the VIS resource from the failed registration. The VIS has the same name as the SID that you tried to register.
1. Retry the [registration process](#register-sap-system) again.

## Next steps

- [Monitor SAP system from Azure portal](monitor-portal.md)
- [Manage a VIS](manage-virtual-instance.md)
