---
title: Use Azure Communications Gateway's Number Management Portal to manage an enterprise
description: Learn how to add and remove enterprises and numbers for Operator Connect and Teams Phone Mobile with Azure Communication Gateway's Number Management Portal.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 07/17/2023
ms.custom: template-how-to-pattern
---

# Manage an enterprise with Azure Communications Gateway's Number Management Portal for Operator Connect and Teams Phone Mobile

Azure Communications Gateway's Number Management Portal enables you to manage enterprise customers and their numbers through the Azure portal.

The Operator Connect and Teams Phone Mobile programs don't allow you to use the Operator Connect portal for provisioning after you've launched your service in the Teams Admin Center. The Number Management Portal is a simple alternative that you can use until you've finished integrating with the Operator Connect APIs.

> [!IMPORTANT]
> You must have selected Azure Communications Gateway's API Bridge option to use the Number Management Portal.

## Prerequisites

Confirm that you have [!INCLUDE [project-synergy-nmp-permissions](includes/communications-gateway-nmp-project-synergy-permissions.md)] permissions for the Project Synergy enterprise application and **Reader** access to your subscription. If you don't have these permissions, ask your administrator to set them up by following [Set up user roles for Azure Communications Gateway](provision-user-roles.md).

If you're assigning new numbers to an enterprise customer:

* You must know the numbers you need to assign (as E.164 numbers). Each number must:
    * Contain only digits (0-9), with an optional `+` at the start.
    * Include the country code.
    * Be up to 19 characters long. 
* You must have completed any internal procedures for assigning numbers.
* You need to know the following information for each range of numbers.

|Information for each range of numbers |Notes  |
|---------|---------|
|Calling profile |One of the Calling Profiles created by Microsoft for you.|
|Intended usage | Individuals (calling users), applications or conference calls.|
|Capabilities     |Which types of call to allow (for example, inbound calls or outbound calls).|
|Civic address | A physical location for emergency calls. The enterprise must have configured this address in the Teams Admin Center. Only required for individuals (calling users) and only if you don't allow the enterprise to update the address.|
|Location | A description of the location for emergency calls. The enterprise must have configured this location in the Teams Admin Center. Only required for individuals (calling users) and only if you don't allow the enterprise to update the address.|
|Whether the enterprise can update the civic address or location | If you don't allow the enterprise to update the civic address or location, you must specify a civic address or location. You can specify an address or location and also allow the enterprise to update it.|
|Country | The country for the number. Only required if you're uploading a North American Toll-Free number, otherwise optional.|
|Ticket number (optional) |The ID of any ticket or other request that you want to associate with this range of numbers. Up to 64 characters. |

## Go to your Communications Gateway resource

1. Sign in to the [Azure portal](https://azure.microsoft.com/).
1. In the search bar at the top of the page, search for your Communications Gateway resource.
1. Select your Communications Gateway resource.

## Select an enterprise customer to manage

When an enterprise customer uses the Teams Admin Center to request service, the Operator Connect APIs create a **consent**. This consent represents the relationship between you and the enterprise.

The Number Management Portal allows you to update the status of these consents. Finding the consent for an enterprise is also the easiest way to manage numbers for an enterprise.

1. From the overview page for your Communications Gateway resource, select **Consents** in the sidebar.
1. Find the enterprise that you want to manage.
1. If you need to change the status of the relationship, select **Update Relationship Status** from the menu for the enterprise. Set the new status. For example, if you're agreeing to provide service to a customer, set the status to **Agreement signed**. If you set the status to **Consent Declined** or **Contract Terminated**, you must provide a reason.

## Manage numbers for the enterprise

Assigning numbers to an enterprise allows IT administrators at the enterprise to allocate those numbers to their users.

1. Go to the number management page for the enterprise.
    * If you followed [Select an enterprise customer to manage](#select-an-enterprise-customer-to-manage), select **Manage numbers** from the menu.
    * Otherwise, select **Numbers** in the sidebar and search for the enterprise using the enterprise's Azure Active Directory tenant ID.
1. To add new numbers for an enterprise:
    1. Select **Upload numbers**.
    1. Fill in the fields based on the information you determined in [Prerequisites](#prerequisites). These settings apply to all the numbers you upload in the **Telephone numbers** section.
    1. In **Telephone numbers**, upload the numbers, as a comma-separated list.
    1. Select **Review + upload** and **Upload**. Uploading creates an order for uploading numbers over the Operator Connect API.
    1. Wait 30 seconds, then refresh the order status. When the order status is **Complete**, the numbers are available to the enterprise. You might need to refresh more than once.
1. To remove numbers from an enterprise:
    1. Select the numbers.
    1. Select **Release numbers**.
    1. 1. Wait 30 seconds, then refresh the order status. When the order status is **Complete**, the numbers have been removed.

## View civic addresses for an enterprise

You can view civic addresses for an enterprise. The enterprise configures the details of each civic address, so you can't configure these details.

1. Go to the civic address page for the enterprise.
    * If you followed [Select an enterprise customer to manage](#select-an-enterprise-customer-to-manage), select **Civic addresses** from the menu.
    * Otherwise, select **Civic addresses** in the sidebar and search for the enterprise using the enterprise's Azure Active Directory tenant ID.
1. View the civic addresses. You can see the address, the company name, the description and whether the address was validated when the enterprise configured the address.
1. Optionally, select an individual address to view additional information provided by the enterprise (for example, the ELIN information).

## Next steps

Learn more about [the metrics you can use to monitor calls](monitoring-azure-communications-gateway-data-reference.md).