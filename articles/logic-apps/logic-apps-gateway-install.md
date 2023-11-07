---
title: Install on-premises data gateway
description: Download and install the on-premises data gateway to access on-premises data in Azure Logic Apps. See how the data gateway works.
services: logic-apps
ms.suite: integration
ms.reviewer: arthii, azla
ms.topic: how-to
ms.date: 10/31/2022

#Customer intent: As a software developer, I want to create logic app workflows that can access data in on-premises systems, which requires that I install and set up the on-premises data gateway.
---

# Install on-premises data gateway for Azure Logic Apps

In Consumption logic app workflows, some connectors provide access to on-premises data sources. Before you can create these connections, you have to download and install the [on-premises data gateway](https://aka.ms/on-premises-data-gateway-installer) and then create an Azure resource for that gateway installation. The gateway works as a bridge that provides quick data transfer and encryption between on-premises data sources and your workflows. You can use the same gateway installation with other cloud services, such as Power Automate, Power BI, Power Apps, and Azure Analysis Services.

In Standard logic app workflows, [built-in service provider connectors](/azure/logic-apps/connectors/built-in/reference/) don't need the gateway to access your on-premises data source. Instead, you provide information that authenticates your identity and authorizes access to your data source. If a built-in connector isn't available for your data source, but a managed connector is available, you need the on-premises data gateway.

This how-to guide shows how to download, install, and set up your on-premises data gateway so that you can access on-premises data sources from Azure Logic Apps. You can also learn more about [how the data gateway works](#how-the-gateway-works) later in this article. For more information about the gateway, see [What is an on-premises gateway](/data-integration/gateway/service-gateway-onprem)? To automate gateway installation and management tasks, see the [Data Gateway PowerShell cmdlets in the PowerShell gallery](https://www.powershellgallery.com/packages/DataGateway/3000.15.15).

For information about how to use the gateway with these services, see these articles:

* [Microsoft Power Automate on-premises data gateway](/power-automate/gateway-reference)
* [Microsoft Power BI on-premises data gateway](/power-bi/service-gateway-onprem)
* [Microsoft Power Apps on-premises data gateway](/powerapps/maker/canvas-apps/gateway-reference)
* [Azure Analysis Services on-premises data gateway](../analysis-services/analysis-services-gateway.md)

<a name="requirements"></a>

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

  * Your Azure account needs to use either a work account or school account with the format `<username>@<organization>.com`. You can't use Azure B2B (guest) accounts or personal Microsoft accounts, such as accounts with hotmail.com or outlook.com domains.

    > [!NOTE]
    > If you signed up for a Microsoft 365 offering and didn't provide your work email address, your address might have the format `username@domain.onmicrosoft.com`. In this case, your account is stored in a Microsoft Entra tenant. In most cases, the user principal name (UPN) for your Azure account is the same as your email address.

    To use a [Visual Studio Standard subscription](https://visualstudio.microsoft.com/vs/pricing/) that's associated with a Microsoft account, first [create a Microsoft Entra tenant](../active-directory/develop/quickstart-create-new-tenant.md) or use the default directory. Add a user with a password to the directory, and then give that user access to your Azure subscription. You can then sign in during gateway installation with this username and password.

  * Your Azure account must belong only to a single [Microsoft Entra tenant or directory](../active-directory/fundamentals/active-directory-whatis.md#terminology). You need to use that account when you install and administer the gateway on your local computer.

  * When you install the gateway, you sign in with your Azure account, which links your gateway installation to your Azure account and only that account. You can't link the same gateway installation across multiple Azure accounts or Microsoft Entra tenants.

  * Later in the Azure portal, you need to use the same Azure account to create an Azure gateway resource that's associated with your gateway installation. You can link only one gateway installation and one Azure gateway resource to each other. However, you can use your Azure account to set up different gateway installations that are each associated with an Azure gateway resource. Your logic app workflows can then use these gateway resources in triggers and actions that can access on-premises data sources.

* For local computer operating system and hardware requirements, see the [main guide for how to install the on-premises data gateway](/data-integration/gateway/service-gateway-install).

* Related considerations:

  * Install the on-premises data gateway only on a local computer, not a domain controller. You don't have to install the gateway on the same computer as your data source. You need only one gateway for all your data sources, so you don't need to install the gateway for each data source.

  * To minimize latency, install the gateway as close as possible to your data source, or on the same computer, assuming that you have permissions.

  * Install the gateway on a local computer that's on a wired network, connected to the internet, always turned on, and doesn't go to sleep. Otherwise, the gateway can't run, and performance might suffer over a wireless network.

  * If you plan to use Windows authentication, make sure that you install the gateway on a computer that's a member of the same Active Directory environment as your data sources.

  * The region that you select for your gateway installation is the same location that you must select when you later create the Azure gateway resource for your logic app workflow. By default, this region is the same location as your Microsoft Entra tenant that manages your Azure user account. However, you can change the location during gateway installation or later.

    > [!IMPORTANT]
    > During gateway setup, the **Change Region** command is unavailable if you signed in with your Azure Government account, which is associated with an 
    > Microsoft Entra tenant in the [Azure Government cloud](../azure-government/compare-azure-government-global-azure.md). The gateway 
    > automatically uses the same region as your user account's Microsoft Entra tenant.
    > 
    > To continue using your Azure Government account, but set up the gateway to work in the global multi-tenant Azure Commercial cloud instead, first sign 
    > in during gateway installation with the `prod@microsoft.com` username. This solution forces the gateway to use the global multi-tenant Azure cloud, 
    > but still lets you continue using your Azure Government account.

  * Your logic app resource and the Azure gateway resource, which you create after you install the gateway, must use the same Azure subscription. But these resources can exist in different Azure resource groups.

  * If you're updating your gateway installation, uninstall your current gateway first for a cleaner experience.

    As a best practice, make sure that you're using a supported version. Microsoft releases a new update to the on-premises data gateway every month, and currently supports only the last six releases for the on-premises data gateway. If you experience issues with the version that you're using, try [upgrading to the latest version](https://aka.ms/on-premises-data-gateway-installer). Your issue might be resolved in the latest version.

  * The gateway has two modes: standard mode and personal mode, which applies only to Power BI. You can't have more than one gateway running in the same mode on the same computer.

  * Logic Apps supports read and write operations through the gateway. However, these operations have [limits on their payload size](/data-integration/gateway/service-gateway-onprem#considerations).

<a name="install-gateway"></a>

## Install data gateway

1. [Download and run the gateway installer on a local computer](https://aka.ms/on-premises-data-gateway-installer).

1. Review the minimum requirements, keep the default installation path, accept the terms of use, and then select **Install**.

   :::image type="content" source="./media/logic-apps-gateway-install/review-and-accept-terms-of-use.png" alt-text="Screenshot of the gateway installer, with a minimum requirements link, an installation path, and a checkbox that's highlighted for accepting terms.":::

1. After the gateway installation finishes, provide the email address for your Azure account, and then select **Sign in**.

   :::image type="content" source="./media/logic-apps-gateway-install/sign-in-gateway-install.png" alt-text="Screenshot of the gateway installer, with a message about a successful installation, a box that contains an email address, and a 'Sign in' button.":::

   Your gateway installation can link to only one Azure account.

1. Select **Register a new gateway on this computer** > **Next**. This step registers your gateway installation with the [gateway cloud service](#how-the-gateway-works).

   :::image type="content" source="./media/logic-apps-gateway-install/register-gateway-local-computer.png" alt-text="Screenshot of the gateway installer, with a message about registering the gateway. The 'Register a new gateway on this computer' option is selected.":::

1. Provide this information for your gateway installation:

   * A gateway name that's unique across your Microsoft Entra tenant
   * A recovery key that has at least eight characters
   * Confirmation of the recovery key

   :::image type="content" source="./media/logic-apps-gateway-install/gateway-name-recovery-key.png" alt-text="Screenshot of the gateway installer, with input boxes for the gateway name, a recovery key, and confirmation of the recovery key.":::

   > [!IMPORTANT]
   > Save your recovery key in a safe place. You need this key to move, recover, or take over a gateway installation or to change its location.

   Note the **Add to an existing gateway cluster** option. When you install additional gateways for [high-availability scenarios](#high-availability-support), you use this option.

1. Check the region for the gateway cloud service and [Azure Service Bus messaging instance](../service-bus-messaging/service-bus-messaging-overview.md) that your gateway installation uses. By default, this region is the same location as the Microsoft Entra tenant for your Azure account.

   :::image type="content" source="./media/logic-apps-gateway-install/confirm-gateway-region.png" alt-text="Screenshot of part of the gateway installer window. The gateway cloud service region is highlighted.":::

1. To accept the default region, select **Configure**. But if the default region isn't the one that's closest to you, you can change the region.

   *Why change the region for your gateway installation?*

   For example, to reduce latency, you might change your gateway's region to the same region as your logic app workflow. Or, you might select the region that's closest to your on-premises data source. Your *gateway resource in Azure* and your logic app workflow can have different locations.

   1. Next to the current region, select **Change Region**.

      :::image type="content" source="./media/logic-apps-gateway-install/change-gateway-service-region.png" alt-text="Screenshot of part of the gateway installer window. Next to the gateway cloud service region, 'Change Region' is highlighted.":::

   1. On the next page, open the **Select Region** list, select the region you want, and then select **Done**.

      :::image type="content" source="./media/logic-apps-gateway-install/select-region-gateway-install.png" alt-text="Screenshot of the gateway installer window. The 'Select Region' list is open. A 'Done' button is visible.":::

1. Review the information in the final confirmation window. This example uses the same account for Logic Apps, Power BI, Power Apps, and Power Automate, so the gateway is available for all these services. When you're ready, select **Close**.

   :::image type="content" source="./media/logic-apps-gateway-install/finished-gateway-default-location.png" alt-text="Screenshot of the gateway installer window with a 'Close' button and green check marks for Power Apps, Power Automate, and Power BI.":::

1. Now [create the Azure resource for your gateway installation](logic-apps-gateway-connection.md).

<a name="communication-settings"></a>

## Check or adjust communication settings

The on-premises data gateway depends on [Service Bus messaging](../service-bus-messaging/service-bus-messaging-overview.md) to provide cloud connectivity and to establish the corresponding outbound connections to the gateway's associated Azure region. If your work environment requires that traffic goes through a proxy or firewall to access the internet, this restriction might prevent the on-premises data gateway from connecting to the gateway cloud service and Service Bus messaging. The gateway has several communication settings, which you can adjust.

An example scenario is where you use custom connectors that access on-premises resources by using the on-premises data gateway resource in Azure. If you also have a firewall that limits traffic to specific IP addresses, you need to set up the gateway installation to allow access for the corresponding managed connector [outbound IP addresses](logic-apps-limits-and-config.md#outbound). *All* logic app workflows in the same region use the same IP address ranges.

For more information, see these articles:

* [Adjust communication settings for the on-premises data gateway](/data-integration/gateway/service-gateway-communication)
* [Configure proxy settings for the on-premises data gateway](/data-integration/gateway/service-gateway-proxy)

<a name="high-availability"></a>

## High availability support

To avoid single points of failure for on-premises data access, you can have multiple gateway installations (standard mode only) with each on a different computer, and set them up as a cluster or group. That way, if the primary gateway is unavailable, data requests are routed to the second gateway, and so on. Because you can install only one standard gateway on a computer, you must install each additional gateway that's in the cluster on a different computer. All the connectors that work with the on-premises data gateway support high availability.

* You must already have at least one gateway installation with the same Azure account as the primary gateway. You also need the recovery key for that installation.

* Your primary gateway must be running the gateway update from November 2017 or later.

To install another gateway after you set up your primary gateway:

1. In the gateway installer, select **Add to an existing gateway cluster**.

1. In the **Available gateway clusters** list, select the first gateway that you installed.

1. Enter the recovery key for that gateway.

1. Select **Configure**.

For more information, see [High availability clusters for on-premises data gateway](/data-integration/gateway/service-gateway-install#add-another-gateway-to-create-a-cluster).

<a name="update-gateway-installation"></a>

## Change location, migrate, restore, or take over existing gateway

If you must change your gateway's location, move your gateway installation to a new computer, recover a damaged gateway, or take ownership for an existing gateway, you need the recovery key that you used during gateway installation.

> [!NOTE]
> Before you restore the gateway on the computer that has the original gateway installation, you must first uninstall the gateway on that computer. This action disconnects the original gateway. If you remove or delete a gateway cluster for any cloud service, you can't restore that cluster.

1. Run the gateway installer on the computer that has the existing gateway.

1. When the installer prompts you, sign in with the same Azure account that you used to install the gateway.

1. Select **Migrate, restore, or takeover an existing gateway** > **Next**.

   :::image type="content" source="./media/logic-apps-gateway-install/migrate-recover-take-over-gateway.png" alt-text="Screenshot of the gateway installer. The 'Migrate, restore, or takeover an existing gateway' option is selected and highlighted.":::

1. Select from the available clusters and gateways, and enter the recovery key for the selected gateway.

   :::image type="content" source="./media/logic-apps-gateway-install/select-existing-gateway.png" alt-text="Screenshot of the gateway installer. The 'Available gateway clusters,' 'Available gateways,' and 'Recovery key' boxes all have values.":::

1. To change the region, select **Change Region**, and then select the new region.

1. When you're ready, select **Configure**.

## Tenant-level administration

To get visibility into all the on-premises data gateways in a Microsoft Entra tenant, global administrators in that tenant can sign in to the [Power Platform Admin center](https://powerplatform.microsoft.com) as a tenant administrator and select the **Data Gateways** option. For more information, see [Tenant-level administration for the on-premises data gateway](/data-integration/gateway/service-gateway-tenant-level-admin).

<a name="restart-gateway"></a>

## Restart gateway

By default, the gateway installation on your local computer runs as a Windows service account named "On-premises data gateway service." However, the gateway installation uses the `NT SERVICE\PBIEgwService` name for its **Log On As** account credentials and has **Log on as a service** permissions.

> [!NOTE]
> Your Windows service account differs from the account that's used for connecting to on-premises data sources and from the Azure account that you use when you sign in to cloud services.

Like any other Windows service, you can start and stop a gateway in various ways. For more information, see [Restart an on-premises data gateway](/data-integration/gateway/service-gateway-restart).

<a name="gateway-cloud-service"></a>

## How the gateway works

Users in your organization can access on-premises data for which they already have authorized access. But before these users can connect to your on-premises data source, you need to install and set up an on-premises data gateway. Usually, an admin is the person who installs and sets up a gateway. These actions might require **Server Administrator** permissions or special knowledge about your on-premises servers.

The gateway helps facilitate faster and more secure behind-the-scenes communication. This communication flows between a user in the cloud, the gateway cloud service, and your on-premises data source. The gateway cloud service encrypts and stores your data source credentials and gateway details. The service also routes queries and their results between the user, the gateway, and your on-premises data source.

The gateway works with firewalls and uses only outbound connections. All traffic originates as secured outbound traffic from the gateway agent. The gateway sends the data from on-premises sources on encrypted channels through [Service Bus messaging](../service-bus-messaging/service-bus-messaging-overview.md). This service bus creates a channel between the gateway and the calling service, but doesn't store any data. All data that travels through the gateway is encrypted.

:::image type="content" source="./media/logic-apps-gateway-install/how-on-premises-data-gateway-works-flow-diagram.png" alt-text="Architecture diagram of an on-premises data gateway that shows the flow of data between cloud services and on-premises data sources." border="false":::

> [!NOTE]
> Depending on the cloud service, you might need to set up a data source for the gateway.

These steps describe what happens when you interact with an element that's connected to an on-premises data source:

1. The cloud service creates a query, along with the encrypted credentials for the data source. The service then sends the query and credentials to the gateway queue for processing.

1. The gateway cloud service analyzes the query and pushes the request to Service Bus messaging.

1. Service Bus messaging sends the pending requests to the gateway.

1. The gateway gets the query, decrypts the credentials, and connects to one or more data sources with those credentials.

1. The gateway sends the query to the data source for running.

1. The results are sent from the data source back to the gateway, and then to the gateway cloud service. The gateway cloud service then uses the results.

### Authentication to on-premises data sources

A stored credential is used to connect from the gateway to on-premises data sources. Regardless of the user, the gateway uses the stored credential to connect. There might be authentication exceptions for specific services, such as DirectQuery and LiveConnect for Analysis Services in Power BI.

<a name='azure-ad'></a>

### Microsoft Entra ID

Microsoft cloud services use [Microsoft Entra ID](../active-directory/fundamentals/active-directory-whatis.md) to authenticate users. A Microsoft Entra tenant contains usernames and security groups. Typically, the email address that you use for sign-in is the same as the UPN for your account.

### What is my UPN?

If you're not a domain admin, you might not know your UPN. To find the UPN for your account, run the `whoami /upn` command from your workstation. Although the result looks like an email address, the result is the UPN for your local domain account.

<a name='synchronize-an-on-premises-active-directory-with-azure-ad'></a>

### Synchronize an on-premises Active Directory with Microsoft Entra ID

You need to use the same UPN for your on-premises Active Directory accounts and Microsoft Entra accounts. So, make sure that the UPN for each on-premises Active Directory account matches your Microsoft Entra account UPN. The cloud services know only about accounts within Microsoft Entra ID. So, you don't need to add an account to your on-premises Active Directory. If an account doesn't exist in Microsoft Entra ID, you can't use that account.

Here are ways that you can match your on-premises Active Directory accounts with Microsoft Entra ID.

* Add accounts manually to Microsoft Entra ID.

  Create an account in the Azure portal or in the Microsoft 365 admin center. Make sure that the account name matches the UPN for the on-premises Active Directory account.

* Synchronize local accounts to your Microsoft Entra tenant by using the Microsoft Entra Connect tool.

  The Microsoft Entra Connect tool provides options for directory synchronization and authentication setup. These options include password hash sync, pass-through authentication, and federation. If you're not a tenant admin or a local domain admin, contact your IT admin to get Microsoft Entra Connect set up. Microsoft Entra Connect ensures that your Microsoft Entra UPN matches your local Active Directory UPN. This matching helps if you're using Analysis Services live connections with Power BI or single sign-on (SSO) capabilities.

  > [!NOTE]
  > Synchronizing accounts with the Microsoft Entra Connect tool creates new accounts in your Microsoft Entra tenant.

<a name="faq"></a>

## FAQ and troubleshooting

* [On-premises data gateway FAQ](/data-integration/gateway/service-gateway-onprem-faq)
* [Troubleshoot the on-premises data gateway](/data-integration/gateway/service-gateway-tshoot)
* [Monitor and optimize gateway performance](/data-integration/gateway/service-gateway-performance)

## Next steps

* [Connect to on-premises data from logic app workflows](logic-apps-gateway-connection.md)
* [Enterprise integration features](logic-apps-enterprise-integration-overview.md)
* [Managed connectors for Azure Logic Apps](../connectors/managed.md)
* [Built-in connectors for Azure Logic Apps](../connectors/built-in.md)
