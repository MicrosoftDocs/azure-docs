---
title: Deploy Azure Communications Gateway
description: This article guides you through planning for and deploying an Azure Communications Gateway.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 01/08/2024
---

# Deploy Azure Communications Gateway

This article guides you through planning for and creating an Azure Communications Gateway resource in Azure.

## Prerequisites

Complete [Prepare to deploy Azure Communications Gateway](prepare-to-deploy.md). Ensure you have access to all the information that you collected by following that procedure.

[!INCLUDE [communications-gateway-tsp-restriction](includes/communications-gateway-tsp-restriction.md)]

[!INCLUDE [communications-gateway-deployment-prerequisites](includes/communications-gateway-deployment-prerequisites.md)]

## Create an Azure Communications Gateway resource

Use the Azure portal to create an Azure Communications Gateway resource.

1. Sign in to the [Azure portal](https://azure.microsoft.com/).
1. In the search bar at the top of the page, search for Communications Gateway and select **Communications Gateways**.

    :::image type="content" source="media/deploy/search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for Azure Communications Gateway.":::

1. Select the **Create** option.

    :::image type="content" source="media/deploy/create.png" alt-text="Screenshot of the Azure portal. Shows the existing Azure Communications Gateway. A Create button allows you to create more Azure Communications Gateways.":::

1. Use the information you collected in [Collect basic information for deploying an Azure Communications Gateway](prepare-to-deploy.md#collect-basic-information-for-deploying-an-azure-communications-gateway) to fill out the fields in the **Basics** configuration tab and then select **Next: Service Regions**.
1. Use the information you collected in [Collect configuration values for service regions](prepare-to-deploy.md#collect-configuration-values-for-service-regions) to fill out the fields in the **Service Regions** tab and then select **Next: Communications Services**.
1. Select the communications services that you want to support in the **Communications Services** configuration tab, use the information that you collected in [Collect configuration values for each communications service](prepare-to-deploy.md#collect-configuration-values-for-each-communications-service) to fill out the fields, and then select **Next: Test Lines**.
1. Use the information that you collected in [Collect values for service verification numbers](prepare-to-deploy.md#collect-values-for-service-verification-numbers) to fill out the fields in the **Test Lines** configuration tab and then select **Next: Tags**.
    - Don't configure numbers for integration testing.
    - Microsoft Teams Direct Routing and Azure Operator Call Protection Preview don't require service verification numbers.
1. (Optional) Configure tags for your Azure Communications Gateway resource: enter a **Name** and **Value** for each tag you want to create.
1. Select **Review + create**.

If you've entered your configuration correctly, the Azure portal displays a **Validation Passed** message at the top of your screen. Navigate to the **Review + create** section.

If you haven't filled in the configuration correctly, the Azure portal display an error symbol for the section(s) with invalid configuration. Select the section(s) and use the information within the error messages to correct the configuration, and then return to the **Review + create** section.

:::image type="content" source="media/deploy/failed-validation.png" alt-text="Screenshot of the Create an Azure Communications Gateway portal, showing a validation that failed due to missing information in the Contacts section.":::

## Submit your Azure Communications Gateway configuration

Check your configuration and ensure it matches your requirements. If the configuration is correct, select **Create**.

Once your resource has been provisioned, a message appears saying **Your deployment is complete**. Select **Go to resource group**, and then check that your resource group contains the correct Azure Communications Gateway resource.

> [!NOTE]
> You can't make calls immediately. You need to complete the remaining steps in this guide before your resource is ready to handle traffic.

:::image type="content" source="media/deploy/go-to-resource-group.png" alt-text="Screenshot of the Create an Azure Communications Gateway portal, showing a completed deployment screen.":::

## Wait for provisioning to complete

Wait for your resource to be provisioned. When your resource is ready, the **Provisioning Status** field on the resource overview changes to "Complete." We recommend that you check in periodically to see if the Provisioning Status field is "Complete." This step might take up to two weeks.

## Connect Azure Communications Gateway to your networks

When your resource has been provisioned, you can connect Azure Communications Gateway to your networks.

1. Exchange TLS certificate information with your onboarding team.
    1. Azure Communications Gateway is preconfigured to support the DigiCert Global Root G2 certificate and the Baltimore CyberTrust Root certificate as root certificate authority (CA) certificates. If the certificate that your network presents to Azure Communications Gateway uses a different root CA certificate, provide your onboarding team with this root CA certificate.
    1. The root CA certificate for Azure Communications Gateway's certificate is the DigiCert Global Root G2 certificate. If your network doesn't have this root certificate, download it from https://www.digicert.com/kb/digicert-root-certificates.htm and install it in your network.
1. Configure your infrastructure to meet the call routing requirements described in [Reliability in Azure Communications Gateway](reliability-communications-gateway.md).
    * Depending on your network, you might need to configure SBCs, softswitches, and access control lists (ACLs).
    > [!IMPORTANT]
    > When configuring SBCs, firewalls, and ACLs, ensure that your network can receive traffic from both of the /28 IP ranges provided to you by your onboarding team because the IP addresses used by Azure Communications Gateway can change as a result of maintenance, scaling or disaster scenarios.
    * If you are using Azure Operator Call Protection Preview, a component in your network (typically an SBC), must act as a SIPREC Session Recording Client (SRC).
    * Your network needs to send SIP traffic to per-region FQDNs for Azure Communications Gateway. To find these FQDNs:
        1. Sign in to the [Azure portal](https://azure.microsoft.com/).
        1. In the search bar at the top of the page, search for your Communications Gateway resource.
        1. Go to the **Overview** page for your Azure Communications Gateway resource.
        1. In each **Service Location** section, find the **Hostname** field. You need to validate TLS connections against this hostname to ensure secure connections.
    * We recommend configuring an SRV lookup for each region, using `_sip._tls.<regional-FQDN-from-portal>`. Replace *`<regional-FQDN-from-portal>`* with the per-region FQDNs from the **Hostname** fields on the **Overview** page for your resource.
1. If your Azure Communications Gateway includes integrated MCP, configure the connection to MCP:
    1. Go to the **Overview** page for your Azure Communications Gateway resource.
    1. In each **Service Location** section, find the **MCP hostname** field.
    1. Configure your test numbers with an iFC of the following form, replacing *`<mcp-hostname>`* with the MCP hostname for the preferred region for that subscriber.
        ```xml
        <InitialFilterCriteria>
            <Priority>0</Priority>
            <TriggerPoint>
                <ConditionTypeCNF>0</ConditionTypeCNF>
                <SPT>
                    <ConditionNegated>0</ConditionNegated>
                    <Group>0</Group>
                    <Method>INVITE</Method>
                </SPT>
                <SPT>
                    <ConditionNegated>1</ConditionNegated>
                    <Group>0</Group>
                    <SessionCase>4</SessionCase>
                </SPT>
            </TriggerPoint>
            <ApplicationServer>
                <ServerName>sip:<mcp-hostname>;transport=tcp;service=mcp</ServerName>
                <DefaultHandling>0</DefaultHandling>
            </ApplicationServer>
        </InitialFilterCriteria>
        ```
1. Configure your routers and peering connection to ensure all traffic to Azure Communications Gateway is through Microsoft Azure Peering Service Voice (also known as MAPS Voice) or ExpressRoute Microsoft Peering.
1. Enable Bidirectional Forwarding Detection (BFD) on your on-premises edge routers to speed up link failure detection.
    - The interval must be 150 ms (or 300 ms if you can't use 150 ms).
    - With MAPS Voice, BFD must bring up the BGP peer for each Private Network Interface (PNI).
1. Meet any other requirements for your communications platform (for example, the *Network Connectivity Specification* for Operator Connect or Teams Phone Mobile). If you need access to Operator Connect or Teams Phone Mobile specifications, contact your onboarding team.

## Configure alerts for upgrades, maintenance and resource health

Azure Communications Gateway is integrated with Azure Service Health and Azure Resource Health.

- We use Azure Service Health's service health notifications to inform you of upcoming upgrades and scheduled maintenance activities.
- Azure Resource Health gives you a personalized dashboard of the health of your resources, so you can see the current and historical health status of your resources.

You must set up the following alerts for your operations team.

- [Alerts for service health notifications](/azure/service-health/alerts-activity-log-service-notifications-portal), for upgrades and maintenance activities.
- [Alerts for resource health](/azure/service-health/resource-health-alert-monitor-guide), for changes in the health of Azure Communications Gateway.

Alerts allow you to send your operations team proactive notifications of changes. For example, you can configure emails and/or SMS notifications. For an overview of alerts, see [What are Azure Monitor alerts?](/azure/azure-monitor/alerts/alerts-overview). For more information on Azure Service Health and Azure Resource Health, see [What is Azure Service Health?](/azure/service-health/overview) and [Resource Health overview](/azure/service-health/resource-health-overview).

## Next steps

> [!div class="nextstepaction"]
> [Integrate with Azure Communications Gateway's Provisioning API](integrate-with-provisioning-api.md)
