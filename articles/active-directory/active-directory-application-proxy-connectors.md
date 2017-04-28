---
title: Classic portal Azure AD App Proxy connectors | Microsoft Docs
description: Covers how to create and manage groups of connectors in Azure AD Application Proxy.
services: active-directory
documentationcenter: ''
author: kgremban
manager: femila
editor: harshja

ms.assetid: b283796a-9679-4c79-b703-802bb850f65d
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/23/2017
ms.author: kgremban

---
# Publish applications on separate networks and locations using connector groups
> [!div class="op_single_selector"]
> * [Azure portal](active-directory-application-proxy-connectors-azure-portal.md)
> * [Azure classic portal](active-directory-application-proxy-connectors.md)
>
>

Connector groups are useful for various scenarios, including:

* Sites with multiple interconnected datacenters. In this case, you want to keep as much traffic within the datacenter as possible because cross-datacenter links are expensive and slow. You can deploy connectors in each datacenter to serve only the applications that reside within the datacenter. This approach minimizes cross-datacenter links and provides an entirely transparent experience to your users.
* Managing applications installed on isolated networks that are not part of the main corporate network. You can use connector groups to install dedicated connectors on isolated networks to also isolate applications to the network.
* For applications installed on IaaS for cloud access, connector groups provide a common service to secure the access to all the apps. Connector groups don't create additional dependency on your corporate network, or fragment the app experience. Connectors can be installed on every cloud datacenter and serve only applications that reside in this network. You can install several connectors to achieve high availability.
* Support for multi-forest environments in which specific connectors can be deployed per forest and set to serve specific applications.
* Connector groups can be used in Disaster Recovery sites to either detect failover or as backup for the main site.
* Connector groups can also be used to serve multiple companies from a single tenant.

## Prerequisite: Create your connectors
To group your connectors, [install multiple connectors](active-directory-application-proxy-enable.md), then name and group them. Finally you have to assign them to specific apps.

## Step 1: Create connector groups
You can create as many connector groups as you want. Connector group creation is accomplished in the Azure classic portal.

1. Select your directory and click **Configure**.  
    ![Application proxy, configure screenshot - click manage connector groups](./media/active-directory-application-proxy-connectors/app_proxy_connectors_creategroup.png)
2. Under Application Proxy, click **Manage Connector Groups** and create a connector group by giving the group a name.  
    ![Application proxy connector groups screenshot - name new group](./media/active-directory-application-proxy-connectors/app_proxy_connectors_namegroup.png)

## Step 2: Assign connectors to your groups
Once the connector groups are created, move the connectors to the appropriate group.

1. Under **Application Proxy**, click **Manage Connectors**.
2. Under **Group**, select the group you want for each connector. It might take the connectors up to 10 minutes to become active in the new group.  
    ![Application proxy connectors screenshot - select group from dropdown menu](./media/active-directory-application-proxy-connectors/app_proxy_connectors_connectorlist.png)

## Step 3: Assign applications to your connector groups
The last step is to set each application to the connector group that serves it.

1. In the Azure classic portal, in your directory, select the Application you want to assign to the group and click **Configure**.
2. Under **Connector group**, select the group you want the application to use. This change is immediately applied.  
    ![Application proxy connector group screenshot - select group from dropdown menu](./media/active-directory-application-proxy-connectors/app_proxy_connectors_newgroup.png)

## See also
* [Enable Application Proxy](active-directory-application-proxy-enable.md)
* [Enable single-sign on](active-directory-application-proxy-sso-using-kcd.md)
* [Enable conditional access](active-directory-application-proxy-conditional-access.md)
* [Troubleshoot issues you're having with Application Proxy](active-directory-application-proxy-troubleshoot.md)

For the latest news and updates, check out the [Application Proxy blog](http://blogs.technet.com/b/applicationproxyblog/)
