---
title: Enable SAP Principal Propagation and SSO for Power Platform
description: Learn about configuring SAP Principal Propagation and SSO in Power Platform
author: MartinPankraz

ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: how-to
ms.date: 14/08/2024
ms.author: mapankra
---
# Enable SAP Principal Propagation and SSO for Power Platform 

Working with SAP interfaces in low code solutions is a common requirement for customers.

This article describes the required foundational configurations and components to interact with SAP systems via OData and the legacy RFC/BAPI interfaces.

The article puts emphasis on secure authorization using Microsoft Entra identity in Power Platform and for the SAP backend user. This mechanism is often referred to as SAP Principal Propagation. See [this community post](https://community.powerplatform.com/blogs/post/?postid=c6a609ab-3556-ef11-a317-6045bda95bf0) for more details.

> [!IMPORTANT]
> SAP Principal Propagation ensures user-mapping to the licensed named SAP user. For any SAP license related questions please contact your SAP representative.

> [!NOTE]
> The guidance applies to Azure Logic Apps, Azure Functions, Azure Container Apps, and Azure App Service too.

## SAP ERP connector in Power Platform

The [SAP ERP connector (RFC/BAPI)](/connectors/saperp/) is designed so multiple people can access and use an application at once; therefore, the connections aren't shared. The user credentials are provided in the connection, while other details required to connect to the SAP system (like server details and security configuration) are provided as part of the action.

Enabling single sign-on (SSO) makes it easy to refresh data from SAP while adhering to user-level permissions configured in SAP. There are several ways you can set up SSO for streamlined identity and access management.

Find more details on the [power platform documentation](/power-platform/enterprise-templates/finance/sap-procurement/administer/configure-authentication).

## SAP OData connector in Power Platform

The [SAP OData connector](/connectors/sapodata/) enables consumption of any OData service from the SAP ecosystem.

Enabling SAP Principal Propagation makes it easy to interact with data while adhering to user-level permissions configured in SAP.

Learn more about the supported authentication types on the [power platform documentation](/connectors/sapodata/).

### Guidance for SAP Principal Propagation

Prinicipal Propagation is a mechanism well established in the SAP ecosystem. The SAP OData Connector supports this mechanism by providing a first-party Entra Id app registration with client id `6bee4d13-fd19-43de-b82c-4b6401d174c3` and scope `user_impersonation`. Use the field `Microsoft Entra ID Resource URI (Application ID URI)` to maintain your globally unique resource URI of the Entra ID app registration authorized to access the SAP OData service.

The focus of the described configuration is on the Azure API Management, SAP Gateway, SAP OAuth 2.0 Server with AS ABAP, and OData sources, but the concepts used apply to any web-based resource.

Learn more from this article on the [Power Platform community](https://community.powerplatform.com/blogs/post/?postid=c6a609ab-3556-ef11-a317-6045bda95bf0).

> [!NOTE]
> An existing trust setup between your SAP backend and Entra ID using an enterprise app registration is required. The configuration needs to support the OAuth2SAMLBearer flow. See [this Microsoft learn article](/entra/identity/saas-apps/sap-netweaver-tutorial) and this SAP blog for details on the initial steps.
>
> :::image type="content" source="media/expose-sap-odata-to-power-platform/sap-principal-propagation-trust.png" alt-text="Illustration of trust relationship between SAP, Entra ID, and API Management solution to support SAP Principal Propagation." lightbox="media/expose-sap-odata-to-power-platform/sap-principal-propagation-trust.png":::

For the Entra ID token exchange required by SAP ([OAuth2SAMLBearer flow](https://help.sap.com/doc/saphelp_nw75/7.5.5/en-US/6e/aec739afad4c5c96487c780c0bf82a/frameset.htm)), we recommend using an API Management solution. See [this Microsoft learn article](/azure/api-management/sap-api?tabs=odata#production-considerations) for details on the initial steps with Azure API Management.

:::image type="content" source="media/expose-sap-odata-to-power-platform/sap-principal-propagation.png" alt-text="Authentication flow of the SAP OData Connector with Azure API Management to support SAP Principal Propagation." lightbox="media/expose-sap-odata-to-power-platform/sap-principal-propagation.png":::

## Next steps

[Understand SAP Principal Propagation using API Management in detail | blog](https://community.powerplatform.com/blogs/post/?postid=c6a609ab-3556-ef11-a317-6045bda95bf0)

[Work with SAP OData APIs in Azure API Management | Microsoft Learn](../../api-management/sap-api.md)

[Protect APIs with Application Gateway and API Management | Microsoft Learn](/azure/architecture/reference-architectures/apis/protect-apis)

[Integrate API Management in an internal virtual network with Application Gateway | Microsoft Learn](../../api-management/api-management-howto-integrate-internal-vnet-appgateway.md)

[Understand Azure Application Gateway and Web Application Firewall for SAP | blog](https://blogs.sap.com/2020/12/03/sap-on-azure-application-gateway-web-application-firewall-waf-v2-setup-for-internet-facing-sap-fiori-apps/)
