---
title: Enable SAP Principal Propagation for live OData feeds with Power Query
description: Learn how to configure SAP Principal Propagation for live OData feeds with Power Query.
author: MartinPankraz
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: how-to
ms.date: 03/19/2026
ms.author: mapankra
ms.custom: sfi-image-nochange
# Customer intent: As a data analyst using Microsoft tools, I want to configure SAP Principal Propagation for OData feeds, so that I can enable live data access from SAP in my reports without requiring static data exports.
---

# Enable SAP Principal Propagation for live OData feeds with Power Query

SAP Principal Propagation is a mechanism that maps a user's Microsoft Entra identity to their SAP back-end user, so that each data request carries the correct SAP authorization. When you consume SAP data through [Power Query](/power-query/power-query-what-is-power-query) in Microsoft Excel or Power BI, you typically want live, refreshable OData feeds rather than static data exports. SAP Principal Propagation ensures that those live feeds respect per-user SAP authorizations.

This article walks you through configuring [Azure API Management](../../api-management/index.yml), [SAP Gateway](https://help.sap.com/viewer/product/SAP_GATEWAY), and the [SAP OAuth 2.0 server](https://help.sap.com/docs/SAP_NETWEAVER_750/e815bb97839a4d83be6c4fca48ee5777/0b899f00477b4034b83aa31764361852.html) to enable SAP Principal Propagation for OData feeds with Power Query.

## Prerequisites

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An [Azure API Management](../../api-management/index.yml) instance.
- An SAP system with [SAP Gateway](https://help.sap.com/viewer/product/SAP_GATEWAY) and OData services activated.
- A Microsoft Entra tenant with permissions to create app registrations.

> [!IMPORTANT]
> SAP Principal Propagation ensures user mapping to the licensed named SAP user. For SAP license-related questions, contact your SAP representative.

## Review Microsoft products with SAP integration

Integrations between SAP products and the Microsoft 365 portfolio range from custom code and partner add-ons to fully customized Office products. The following list shows some examples:

- [SAP Analysis for Microsoft Office Excel and PowerPoint](https://help.sap.com/docs/SAP_BUSINESSOBJECTS_ANALYSIS_OFFICE/ca9c58444d64420d99d6c136a3207632/ebf198667aa54740b9049d9da804a901.html)

- [SAP Analytics Cloud, add-in for Microsoft Office](https://help.sap.com/docs/SAP_ANALYTICS_CLOUD_OFFICE/c637c9ff5d61457eb415ce161e38e57b/c9217302603a4fd6baa0fe6a6e780f8d.html)

- [Access SAP Data Warehouse Cloud with Microsoft Excel](https://blogs.sap.com/2022/05/17/access-sap-data-warehouse-cloud-with-saps-microsoft-excel-add-ins/)

- [SAP HANA Connector for Power Query](/power-query/connectors/sap-hana/overview)

- [Custom Excel Macros to interact with SAP back ends](https://help.sap.com/docs/SAP_BUSINESSOBJECTS_ANALYSIS_OFFICE/ca9c58444d64420d99d6c136a3207632/f270fd456c9b1014bf2c9a7eb0e91070.html)

- [Export from SAP List Viewer (ALV) to Microsoft Excel](https://help.sap.com/docs/ABAP_PLATFORM_NEW/b1c834a22d05483b8a75710743b5ff26/4ec38f8788d22b90e10000000a42189d.html)

The mechanism described in this article uses the standard [built-in OData capabilities of Power Query](/power-query/connectors/odatafeed) and focuses on SAP landscapes deployed on Azure. For on-premises landscapes, use the Azure API Management [self-hosted gateway](../../api-management/self-hosted-gateway-overview.md).

For more information about which Microsoft products support Power Query, see the [Power Query documentation](/power-query/power-query-what-is-power-query#where-can-you-use-power-query).

## Plan the setup

Users can choose between local desktop or web-based clients (such as Excel or Power BI). Consider the client execution environment for the network path between the client application and the target SAP workload. Network access solutions such as VPN aren't in scope for apps like Excel for the web.

[Azure API Management](../../api-management/index.yml) reflects local and web-based environment needs with different deployment modes that can be applied to Azure landscapes ([internal](../../api-management/api-management-using-with-internal-vnet.md?tabs=stv2)
or [external](../../api-management/api-management-using-with-vnet.md?tabs=stv2)). `Internal` refers to instances that are fully restricted to a private virtual network, whereas `External` retains public access to Azure API Management. On-premises installations require a hybrid deployment to apply the approach as is by using the Azure API Management [self-hosted gateway](../../api-management/self-hosted-gateway-overview.md).

Power Query requires a matching API service URL and Microsoft Entra application ID URL. Configure a [custom domain for Azure API Management](../../api-management/configure-custom-domain.md) to meet the requirement.

Configure [SAP Gateway](https://help.sap.com/docs/SAP_GATEWAY) to expose the desired target OData services. Discover and activate available services by using SAP transaction code `/IWFND/MAINT_SERVICE`. For more information, see SAP's [OData configuration](https://help.sap.com/docs/SAP_GATEWAY).

## Configure the Azure API Management custom domain

The following screenshot shows an example configuration in API Management that uses a custom domain called `api.custom-apim.domain.com` with a managed certificate and [Azure App Service Domain](../../app-service/manage-custom-dns-buy-domain.md). For more domain certificate options, see the Azure API Management [documentation](../../api-management/configure-custom-domain.md?tabs=managed).

:::image type="content" source="media/expose-sap-odata-to-power-query/apim-custom-domain-configuration.png" alt-text="Screenshot that shows the custom domain configuration in Azure API Management.":::

Complete the setup of your custom domain per the domain requirements. For more information, see the [custom domain documentation](../../api-management/configure-custom-domain.md?tabs=managed#set-a-custom-domain-name---portal). To prove domain name ownership and grant access to the certificate, add the DNS records to your Azure App Service Domain `custom-apim.domain.com` as shown in the following screenshot:

:::image type="content" source="media/expose-sap-odata-to-power-query/apim-custom-domain-setup.png" alt-text="Screenshot that shows custom domain mapping to Azure API Management domain.":::

The following screenshot shows the Microsoft Entra application registration for the Azure API Management tenant.

:::image type="content" source="media/expose-sap-odata-to-power-query/aad-app-reg-for-apim-configuration.png" alt-text="Screenshot that shows the app registration for Azure API Management in Microsoft Entra ID.":::

> [!NOTE]
> If a custom domain for Azure API Management isn't an option for you, use a [custom Power Query connector](/power-query/startingtodevelopcustomconnectors) instead.

## Design the Azure API Management policy for Power Query

Use the [Azure API Management policy for handling Power Query access requests](https://github.com/Azure/api-management-policy-snippets/blob/master/examples/Handle%20Power%20Query%20access%20request%20to%20custom%20API.policy.xml) for your target OData API to support Power Query's authentication flow. The following snippet highlights the authentication mechanism. For the Power Query client ID, see [Power Query connector authentication](/power-query/connectorauthentication#supported-workflow).

```xml
<!-- if empty Bearer token supplied assume Power Query sign-in request as described [here:](/power-query/connectorauthentication#supported-workflow) -->
<when condition="@(context.Request.Headers.GetValueOrDefault("Authorization","").Trim().Equals("Bearer"))">
    <return-response>
        <set-status code="401" reason="Unauthorized" />
        <set-header name="WWW-Authenticate" exists-action="override">
            <!-- Check the client ID for Power Query [here:](/power-query/connectorauthentication#supported-workflow) -->
            <value>Bearer authorization_uri=https://login.microsoftonline.com/{{AADTenantId}}/oauth2/authorize?response_type=code%26client_id=a672d62c-fc7b-4e81-a576-e60dc46e951d</value>
        </set-header>
    </return-response>
</when>
```

In addition to the **Organizational Account login flow**, the policy supports **OData URL response rewriting** because the target server replies with original URLs. The following snippet from the policy shows URL rewriting:

```xml
<!-- URL rewrite in body only required for GET operations -->
<when condition="@(context.Request.Method == "GET")">
    <!-- ensure downstream API metadata matches Azure API Management caller domain in Power Query -->
    <find-and-replace from="@(context.Api.ServiceUrl.Host +":"+ context.Api.ServiceUrl.Port + context.Api.ServiceUrl.Path)" to="@(context.Request.OriginalUrl.Host + ":" + context.Request.OriginalUrl.Port + context.Api.Path)" />
</when>
```

> [!NOTE]
> For more information about secure SAP access from the internet and SAP perimeter network design, see [SAP internet inbound and outbound design](/azure/architecture/guide/sap/sap-internet-inbound-outbound#network-design). For information about securing SAP APIs with Azure, see [Expose SAP Process Orchestration on Azure](./expose-sap-process-orchestration-on-azure.md).

## Authenticate SAP OData by using Power Query on Excel Desktop

With this configuration, the built-in authentication mechanism of Power Query becomes available to the exposed OData APIs. Add a new OData source to the Excel sheet on the **Data** ribbon (**Get Data** > **From Other Sources** > **From OData Feed**). Enter your target service URL. The following example uses the SAP Gateway demo service **GWSAMPLE_BASIC**. Discover or activate it by using SAP transaction `/IWFND/MAINT_SERVICE`. Then add it to Azure API Management by using the [official OData import guide](../../api-management/sap-api.md).

:::image type="content" source="media/expose-sap-odata-to-power-query/odata-url-retrieve-from-apim.png" alt-text="Screenshot that shows how to discover the OData URL within Azure API Management.":::

Retrieve the base URL and insert it in your target application. The following example shows the integration experience with Excel Desktop.

:::image type="content" source="media/expose-sap-odata-to-power-query/excel-odata-feed.png" alt-text="Screenshot that shows the OData configuration wizard in Excel Desktop.":::

Switch the sign in method to **Organizational account** and select **Sign in**. Provide the Microsoft Entra account that is mapped to the named SAP user on the SAP Gateway by using SAP Principal Propagation. For more information about the configuration, see the [Microsoft tutorial for SAP NetWeaver SSO](../../active-directory/saas-apps/sap-netweaver-tutorial.md#configure-sap-netweaver-for-oauth). For more information about SAP Principal Propagation, see the [SAP community post on Azure App Service with SAP OData Gateway](https://blogs.sap.com/2021/08/12/.net-speaks-odata-too-how-to-implement-azure-app-service-with-sap-odata-gateway/) and the [SAP Principal Propagation video series](https://github.com/MartinPankraz/SAP-MSTeams-Hero/blob/main/Towel-Bearer/103a-sap-principal-propagation-basics.md).

Next, choose at which level Power Query on Excel should apply the authentication settings. The following example shows a setting that would apply to all OData services hosted on the target SAP system (not only to the sample service GWSAMPLE_BASIC).

> [!NOTE]
> The authorization scope setting at the URL level in the following screenshot is independent of the actual authorizations on the SAP back end. SAP Gateway remains the final validator of each request and associated authorizations of a mapped named SAP user.

:::image type="content" source="media/expose-sap-odata-to-power-query/excel-odata-login.png" alt-text="Screenshot that shows the sign in flow within Excel for the Organizational Account option.":::

> [!IMPORTANT]
> The preceding guidance focuses on the process of obtaining a valid authentication token from Microsoft Entra ID through Power Query. This token needs further processing for SAP Principal Propagation.

## Configure SAP Principal Propagation with Azure API Management

Use the [Azure API Management SAP OAuth2 token policy](https://github.com/Azure/api-management-policy-snippets/blob/master/examples/Request%20OAuth2%20access%20token%20from%20SAP%20using%20AAD%20JWT%20token.xml) to complete the configuration for SAP Principal Propagation on the middle layer. For more information about the configuration of the SAP Gateway back end, see the [Microsoft tutorial for SAP NetWeaver SSO](../../active-directory/saas-apps/sap-netweaver-tutorial.md#configure-sap-netweaver-for-oauth).

> [!NOTE]
> For more information about SAP Principal Propagation, see the [SAP community post on Azure App Service with SAP OData Gateway](https://blogs.sap.com/2021/08/12/.net-speaks-odata-too-how-to-implement-azure-app-service-with-sap-odata-gateway/) and the [SAP Principal Propagation video series](https://github.com/MartinPankraz/SAP-MSTeams-Hero/blob/main/Towel-Bearer/103a-sap-principal-propagation-basics.md).

:::image type="content" source="media/expose-sap-odata-to-power-query/app-registration-dependencies.png" alt-text="Diagram that shows the Microsoft Entra app registrations involved in this article.":::

The policy relies on an established SSO setup between Microsoft Entra ID and SAP Gateway (use [SAP NetWeaver from the Microsoft Entra gallery](../../active-directory/saas-apps/sap-netweaver-tutorial.md#adding-sap-netweaver-from-the-gallery)). The following example uses the demo user Adele Vance. User mapping between Microsoft Entra ID and the SAP system is based on the user principal name (UPN) as the unique user identifier.

:::image type="content" source="media/expose-sap-odata-to-power-query/aad-user-config-for-sso.png" alt-text="Screenshot that shows the UPN of the demo user in Microsoft Entra ID.":::

:::image type="content" source="media/expose-sap-odata-to-power-query/aad-enterprise-sap-registration-sso.png" alt-text="Screenshot that shows the SAML2 configuration for SAP Gateway with UPN claim.":::

The UPN mapping is maintained on the SAP back end using transaction **SAML2**.

:::image type="content" source="media/expose-sap-odata-to-power-query/saml2-config.png" alt-text="Screenshot that shows the email mapping mode in SAP SAML2 transaction.":::

With this configuration, **named SAP users** are mapped to the respective Microsoft Entra user. The following screenshot shows an example configuration from the SAP back end by using transaction code **SU01**.

:::image type="content" source="media/expose-sap-odata-to-power-query/sap-su01-config.png" alt-text="Screenshot of named SAP user in transaction SU01 with mapped email address.":::

For more information about the required [SAP OAuth 2.0 Server with AS ABAP](https://help.sap.com/docs/SAP_NETWEAVER_750/e815bb97839a4d83be6c4fca48ee5777/0b899f00477b4034b83aa31764361852.html) configuration, see the [Microsoft tutorial for SSO with SAP NetWeaver using OAuth](../../active-directory/saas-apps/sap-netweaver-tutorial.md#configure-sap-netweaver-for-oauth).

When you use the described Azure API Management policies, **any** Power Query-enabled Microsoft product can call SAP-hosted OData services while honoring the SAP named user mapping.

:::image type="content" source="media/expose-sap-odata-to-power-query/excel-odata-import.png" alt-text="Screenshot that shows the OData response in Excel Desktop.":::

## Access SAP OData through other Power Query-enabled applications and services

The preceding example shows the process for Excel Desktop, but the approach applies to **any** Power Query OData-enabled Microsoft product. For more information about the OData connector of Power Query and which products support it, see the [Power Query Connectors documentation](/power-query/connectors/odatafeed). For more information about which products support Power Query, see the [Power Query documentation](/power-query/power-query-what-is-power-query#where-can-you-use-power-query).

Popular consumers are [Power BI](/power-bi/connect-data/desktop-connect-odata), [Excel for the web](https://www.office.com/launch/excel), [Power Apps (Dataflows)](/power-apps/maker/data-platform/create-and-use-dataflows), and [Analysis Services](/analysis-services/analysis-services-overview).

## Handle SAP write-back scenarios with Power Automate

The described approach also applies to write-back scenarios. For example, you can use [Power Automate](/flow/) to update a business partner in SAP by using OData with the [HTTP-enabled connectors](/training/modules/http-connectors/) (alternatively, use [RFCs or BAPIs](/connectors/saperp/)). The following screenshot shows an example of a [Power BI service](/power-bi/fundamentals/power-bi-service-overview) dashboard that is connected to Power Automate through [value-based alerts](/power-bi/create-reports/service-set-data-alerts) and a [button](/power-bi/create-reports/power-bi-automate-visual?tabs=powerbi-desktop) (highlighted in the screenshot). For more information about triggering flows from Power BI reports, see the [Power Automate documentation](/power-automate/trigger-flow-powerbi-report).

:::image type="content" source="media/expose-sap-odata-to-power-query/powerbi-flow-enabled-dashboard.png" alt-text="Screenshot that shows the flow-enabled Power BI service dashboard.":::

The highlighted button triggers a flow that forwards the OData PATCH request to the SAP Gateway to change the business partner role.

> [!NOTE]
> Use the Azure API Management [policy for SAP](https://github.com/Azure/api-management-policy-snippets/blob/master/examples/Request%20OAuth2%20access%20token%20from%20SAP%20using%20AAD%20JWT%20token.xml) to handle the authentication, refresh tokens, [CSRF tokens](https://blogs.sap.com/2021/06/04/how-does-csrf-token-work-sap-gateway/), and overall caching of tokens outside of the flow.

:::image type="content" source="media/expose-sap-odata-to-power-query/power-automate-powerbi-button-flow.png" alt-text="Screenshot that shows the flow on Power Automate requesting the business partner change on the SAP back end.":::

## Related content

- [Learn where you can use OData with Power Query](/power-query/connectors/odatafeed)
- [Work with SAP OData APIs in Azure API Management](../../api-management/sap-api.md)
- [Tutorial: Analyze sales data from Excel and an OData feed](/power-bi/connect-data/desktop-tutorial-analyzing-sales-data-from-excel-and-an-odata-feed)
- [Protect APIs with Application Gateway and API Management](/azure/architecture/reference-architectures/apis/protect-apis)
- [Integrate API Management in an internal virtual network with Application Gateway](../../api-management/api-management-howto-integrate-internal-vnet-appgateway.md)
- [Understand Azure Application Gateway and Web Application Firewall for SAP](https://blogs.sap.com/2020/12/03/sap-on-azure-application-gateway-web-application-firewall-waf-v2-setup-for-internet-facing-sap-fiori-apps/)
- [Automate API deployments with APIOps](/azure/architecture/example-scenario/devops/automated-api-deployments-apiops)
