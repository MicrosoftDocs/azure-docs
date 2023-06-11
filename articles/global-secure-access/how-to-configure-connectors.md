---
title: How to configure connectors for Microsoft Entra Private Access
description: Learn how to configure App Proxy connectors for Microsoft Entra Private Access.
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: how-to
ms.date: 06/08/2023
ms.service: network-access
ms.custom: 

---
# How to configure App Proxy connectors for Microsoft Entra Private Access

Connectors are lightweight agents that sit on-premises and facilitate the outbound connection to the Global Secure Access service. Connectors must be installed on a Windows Server that has access to the backend application. You can organize connectors into connector groups, with each group handling traffic to specific applications. To learn more about connectors, see [Understand Azure AD Application Proxy connectors](../active-directory/app-proxy/application-proxy-connectors.md).

## Install and register a connector

To use Private Access, install a connector on each Windows server you're using for Microsoft Entra Private Access. The connector is an agent that manages the outbound connection from the on-premises application servers to Global Secure Access. You can install a connector on servers that also have other authentication agents installed such as Azure AD Connect.

> [!NOTE]
> Setting up App Proxy connectors and connector groups require planning and testing to ensure you have the right configuration for your organization. If you don't already have connector groups set up, pause this process and return when you have a connector group ready.
>
>The minimum version of connector required for Private Access is **1.5.3417.0**.

**To install the connector**:

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** as a Global Administrator of the directory that uses Application Proxy.
    -  For example, if the tenant domain is contoso.com, the admin should be admin@contoso.com or any other admin alias on that domain.
1. Select your username in the upper-right corner. Verify you're signed in to a directory that uses Application Proxy. If you need to change directories, select **Switch directory** and choose a directory that uses Application Proxy.
1. Go to **Global Secure Access (Preview)** > **Connect** > **Connectors**.
1. Select **Download connector service**.
1. Read the Terms of Service. When you're ready, select **Accept terms & Download**.
1. At the bottom of the window, select **Run** to install the connector. An install wizard opens.
1. Follow the instructions in the wizard to install the service. When you're prompted to register the connector with the Application Proxy for your Microsoft Entra ID tenant, provide your Global Administrator credentials.
    - For Internet Explorer (IE): If IE Enhanced Security Configuration is set to On, you may not see the registration screen. To get access, follow the instructions in the error message. Make sure that Internet Explorer Enhanced Security Configuration is set to Off.

## Things to know

If you've previously installed a connector, reinstall to get the latest version. To see information about previously released versions and what changes they include, see [Application Proxy: Version Release History](../active-directory/app-proxy/application-proxy-release-version-history.md).

If you choose to have more than one Windows server for your on-premises applications, you need to install and register the connector on each server. You can organize the connectors into connector groups. For more information, see [Connector groups](../active-directory/app-proxy/application-proxy-connector-groups.md).

If you have installed connectors in different regions, you can optimize traffic by selecting the closest Application Proxy cloud service region to use with each connector group, see [Optimize traffic flow with Azure Active Directory Application Proxy](../active-directory/app-proxy/application-proxy-network-topology.md).

## Verify the installation and registration

You can use the Global Secure Access portal or your Windows server to confirm that a new connector installed correctly.

### Verify the installation through the Microsoft Entra admin center

To confirm the connector installed and registered correctly:

1. Sign in to your tenant directory in the Microsoft Entra admin center.
1. Go to **Global Secure Access (Preview)** > **Connect** > **Connectors**
    - All of your connectors and connector groups appear on this page.
1. View a connector to verify its details. 
    - Expand the connector to view the details if it's not already expanded.
    - An active green label indicates that your connector can connect to the service. However, even though the label is green, a network issue could still block the connector from receiving messages.
For more help with installing a connector, see [Problem installing the Application Proxy Connector](../active-directory/app-proxy/application-proxy-connector-installation-problem.md).

### Verify the installation through your Windows server

To confirm the connector installed and registered correctly:
1. Select the **Windows** key and enter `services.msc` to open the Windows Services Manager.
1. Check to see if the status for the following services **Running**.
    - *Microsoft AAD Application Proxy Connector* enables connectivity.
    - *Microsoft AAD Application Proxy Connector Updater* is an automated update service.
    - The updater checks for new versions of the connector and updates the connector as needed.
1. If the status for the services isn't **Running**, right-click to select each service and choose **Start**.

## Create connector groups

To create as many connector groups as you want:

1. Go to **Global Secure Access (Preview)** > **Connect** > **Connectors**.
1. Select **New connector group**. 
1. Give your new connector group a name, then use the dropdown menu to select which connectors belong in this group.
1. Select **Save**.

To learn more about connector groups, see [Publish applications on separate networks and locations using connector groups](../active-directory/app-proxy/application-proxy-connector-groups.md).

[!INCLUDE [Public preview important note](./includes/public-preview-important-note.md)]

## Next steps

- [Configure per-app access for Microsoft Entra Private Access](how-to-configure-per-app-access.md)
