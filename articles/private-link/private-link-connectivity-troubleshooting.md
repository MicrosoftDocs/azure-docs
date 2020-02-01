---
title: troubleshoot private link connectivity problems
description: Step-by-step guidance to diagnose private link connectivity
services: private-link
documentationcenter: na
author: rdhillon
manager: narayan
editor: ''

ms.service: private-link
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/31/2020
ms.author: rdhillon

---

# Troubleshoot Private Link Service connectivity problems

This guide provides step-by-step guidance to validate and diagnose connectivity for your private link service setup. 

Azure Private Link enables you to access Azure PaaS Services (for example, Azure Storage, Azure Cosmos DB, and SQL Database) and Azure hosted customer/partner services over a Private Endpoint in your virtual network. Traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet. You can also create your own Private Link Service in your virtual network (VNet) and deliver it privately to your customers. 

Service running behind Azure Standard Load Balancer can be enabled for Private Link access so that consumers to your service can access it privately from their own virtual networks. Consumers of the service can create a private endpoint inside their virtual network and map it to this service.

Here are the connectivity scenarios that are available with Private Link service
- virtual network from the same region 
- regionally peered virtual networks
- globally peered virtual networks
- customer on-premises over VPN or Express Route circuits

## Deployment Troubleshooting

For the problem scenarios where you are unable to select the source IP Address from the subnet of your choice for your Private Link Service, please review the information on [Disabling network policies on the private link service](https://docs.microsoft.com/en-us/azure/private-link/disable-private-link-service-network-policy).

Make sure that the setting **privateLinkServiceNetworkPolicies** is disabled for the subnet you are selecting the source IP Address from.

## Diagnosing connectivity problems

If you are experiencing connectivity problems with your private link setup, please go over the steps listed below to make sure all the usual configurations are as expected.

1. Review Private Link Service configuration by browsing the resource 

    a) Go to **Private Link Center**

    ![Private Link Center](./media/private-link-center.png)

    b) Select **Private Link Services** from the left navigation pane

    ![Private Link Services](./media/private-link-service.png)

    c) Filter and select the private link service that you want to diagnose

    d) Review the private endpoint connections
    - Make sure that the private endpoint that you are seeking connectivity from is listed with **Approved** connection state. 
        - If it is listed as **Pending**, Select it and approve it. 

    ![Private Endpoint Connections](./media/pls-private-endpoint-connections.png)

    - Navigate to Private endpoint that you are seeking connectivity from by clicking on the Private endpoint name and make sure the connection status shows **Approved**.

    ![Private Endpoint Connection overview](./media/pls-private-endpoint-overview.png)

    - Once both sides are approved, try the connectivity again.

    e) Review **Alias** from the Overview tab and **Resource ID** from the Properties tab 
    - Make sure the **Alias / Resource ID** matches the **Alias / Resource ID** you are using to create a private endpoint to this service. 

    ![Verify Alias](./media/pls-overview-pane-alias.png)

    ![Verify Resource ID](./media/pls-properties-pane-resourceid.png)

    f) Review Visibility (Overview Section) information
    - Make sure that your subscription falls under the **Visibility** scope

    ![Verify Visibility](./media/pls-overview-pane-visibility.png)

    g) Review Load Balancer (Overview) Information
    - You can navigate to load balancer by clicking on load balancer link

    ![Verify Load Balancer](./media/pls-overview-pane-ilb.png)

    - Make sure that Load Balancer Settings are configured as per your expectations
        - Review Frontend IP configuration
        - Review Backend Pools
        - Review Load Balancing rules

    ![Verify Load Balancer Properties](./media/pls-ilb-properties.png)

    - Make sure Load Balancer is working as per settings above
        - Select a VM in any subnet other than the subnet where Load Balancer backend pool is available
        - Try accessing the load balancer front end from VM above
        - If the connection makes to the backend pool as per load balancing rules, your load balancer is operational
        - You can also review the Load Balancer Metric through Azure Monitor to see if data is flowing through load balancer

2. Use [**Azure Monitor**](https://docs.microsoft.com/en-us/azure/azure-monitor/overview) to review data is flowing

    a) On Private Link SErvice resource, select **Metrics**
    - Select **bytes-in** or **bytes-out** and review data is flowing when attempting to connect to the Private Link Service (expect a delay of approx 10 mins)

    ![Verify Private Link Service Metrics](./media/pls-metrics.png)

3. Please reach out to [Azure Support](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) team if your problem is still unresolved and connectivity problem still exists. 

## Next steps

* [Create a Private Link Service (CLI)](https://docs.microsoft.com/en-us/azure/private-link/create-private-link-service-cli)

* [Private Endpoint troubleshooting guide](https://docs.microsoft.com/en-us/azure/private-link/private-endpoint-connectivity-troubleshooting)
