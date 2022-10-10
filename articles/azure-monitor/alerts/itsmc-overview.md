---
title: IT Service Management integration
description: This article provides an overview of the ways you can integrate with an IT Service Management product.
ms.topic: conceptual
ms.date: 04/28/2022
ms.custom: references_regions

---
# IT Service Management (ITSM) Integration 

:::image type="icon" source="media/itsmc-overview/itsmc-symbol.png":::

This article describes how you can integrate Azure Monitor with supported IT Service Management (ITSM) products.

Azure services like Azure Log Analytics and Azure Monitor provide tools to detect, analyze, and troubleshoot problems with your Azure and non-Azure resources. But the work items related to an issue typically reside in an ITSM product or service.

Azure Monitor provides a bi-directional connection between Azure and ITSM tools to help you resolve issues faster. You can create work items in your ITSM tool, based on your Azure alerts (Metric Alerts, Activity Log Alerts, and Log Analytics alerts).

Azure Monitor supports connections with the following ITSM tools:

-	ServiceNow ITSM or ITOM
-	BMC

For information about legal terms and the privacy policy, see [Microsoft Privacy Statement](https://go.microsoft.com/fwLink/?LinkID=522330&clcid=0x9).
## ITSM Integration Workflow
Depending on your integration, start connecting to your ITSM with these steps:

- For Service Now ITOM events or BMC Helix use the Secure webhook action:

     1. [Register your app with Azure AD](./itsm-connector-secure-webhook-connections-azure-configuration.md#register-with-azure-active-directory).
     1. [Define a Service principal](./itsm-connector-secure-webhook-connections-azure-configuration.md#define-service-principal).
     1. [Create a Secure Webhook action group](./itsm-connector-secure-webhook-connections-azure-configuration.md#create-a-secure-webhook-action-group).
     1. Configure your partner environment. Secure Export supports connections with the following ITSM tools:
         - [ServiceNow ITOM](./itsmc-secure-webhook-connections-servicenow.md)
         - [BMC Helix](./itsmc-secure-webhook-connections-bmc.md)

-  For ServiceNow ITSM, use the ITSM action:

    1. Connect to your ITSM. See [the ServiceNow connection instructions](./itsmc-connections-servicenow.md).
    1. (Optional) Set up the IP Ranges. In order to list the ITSM IP addresses to allow ITSM connections from partner ITSM tools, we recommend listing the whole public IP range of Azure region where their LogAnalytics workspace belongs. [See details here](https://www.microsoft.com/en-us/download/details.aspx?id=56519). For regions EUS/WEU/EUS2/WUS2/US South Central the customer can list ActionGroup network tag only.
    1. [Configure your Azure ITSM Solution and create the ITSM connection](./itsmc-definition.md#install-it-service-management-connector).
    1. [Configure Action Group to leverage ITSM connector](./itsmc-definition.md#define-a-template).

## Next steps
- [ServiceNow connection instructions](./itsmc-connections-servicenow.md).