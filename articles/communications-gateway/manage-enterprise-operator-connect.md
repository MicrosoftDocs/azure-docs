---
title: Use Azure Communications Gateway's Number Management Portal (preview) to manage an enterprise
description: Learn how to add and remove enterprises and numbers with Azure Communication Gateway's Number Management Portal.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 02/16/2024
ms.custom: template-how-to-pattern
---

# Manage an Operator Connect or Teams Phone Mobile customer with Azure Communications Gateway's Number Management Portal (preview)

Azure Communications Gateway's Number Management Portal (preview) enables you to manage enterprise customers and their numbers through the Azure portal. Any changes made in this portal are automatically provisioned into the Operator Connect and Teams Phone Mobile environments. You can also use Azure Communications Gateway's Provisioning API (preview). For more information, see [Provisioning Azure Communications Gateway](provisioning-platform.md).

> [!IMPORTANT]
> The Operator Connect and Teams Phone Mobile programs require you to complete full API integration to your BSS before your service launches in the Teams Admin Center. This integration can be directly to the Operator Connect API or through the Azure Communications Gateway's Provisioning API (preview).

You can:

* Manage your agreement with an enterprise customer.
* Manage numbers for the enterprise, including (for Operator Connect) optionally configuring a custom header.
* View civic addresses for an enterprise.

## Prerequisites

Confirm that you have **Reader** access to the Azure Communications Gateway resource and appropriate permissions for the AzureCommunicationsGateway enterprise application:

<!-- Must be kept in sync with provision-user-roles.md - steps for understanding and configuring -->
* To view configuration: **ProvisioningAPI.ReadUser**.
* To add or make changes to configuration: **ProvisioningAPI.ReadUser** and **ProvisioningAPI.WriteUser**.
* To remove configuration: **ProvisioningAPI.ReadUser** and **ProvisioningAPI.DeleteUser**.
* To view, add, make changes to, or remove configuration: **ProvisioningAPI.AdminUser**.

If you don't have these permissions, ask your administrator to set them up by following [Set up user roles for Azure Communications Gateway](provision-user-roles.md).

> [!IMPORTANT]
> Ensure you have permissions on the AzureCommunicationsGateway enterprise application (not the Project Synergy enterprise application). The AzureCommunicationsGateway enterprise application was created automatically as part of deploying Azure Communications Gateway.

If you're uploading new numbers for an enterprise customer:

* You must complete any internal procedures for assigning numbers.
* You must know the numbers you need to upload (as E.164 numbers). Each number must:
  * Contain only digits (0-9), and have `+` at the start.
  * Include the country code.
  * Be up to 16 characters long.
* You must know the following information for each number.

|Information for each number |Notes |
|---------|---------|
|Intended usage | Individuals (calling users), applications, or conference calls.|
|Capabilities     |Which types of call to allow (for example, inbound calls or outbound calls).|
|Civic address | A physical location for emergency calls. The enterprise must have configured this address in the Teams Admin Center. Only required for individuals (calling users) and only if you don't allow the enterprise to update the address.|
|Location | A description of the location for emergency calls. The enterprise must have configured this location in the Teams Admin Center. Only required for individuals (calling users) and only if you don't allow the enterprise to update the address.|
|Whether the enterprise can update the civic address or location | If you don't allow the enterprise to update the civic address or location, you must specify a civic address or location. You can specify an address or location and also allow the enterprise to update it.|
|Country code | The country code for the number.|

Each number is automatically assigned to the Operator Connect or Teams Phone Mobile calling profile associated with the Azure Communications Gateway that is being provisioned.

If you're changing the status of an enterprise, you can optionally specify an ID for any ticket or other request that you want to associate with this number. This ID can be up to 64 characters.

## Go to your Communications Gateway resource

1. Sign in to the [Azure portal](https://azure.microsoft.com/).
1. In the search bar at the top of the page, search for your Communications Gateway resource.
1. Select your Communications Gateway resource.

## Manage your agreement with an enterprise customer

When an enterprise customer uses the Teams Admin Center to request service, the Operator Connect APIs create a *consent*. The consent represents the relationship between you and the enterprise. The Number Management Portal (preview) displays a consent as a *Request for Information* and allows you to update the status.

1. From the overview page for your Communications Gateway resource, find the **Number Management (Preview)** section in the sidebar.
1. Select **Requests for Information**.
1. Find the enterprise that you want to manage. You can use the **Add filter** options to search for the enterprise.
1. If you need to change the status of the relationship, select the enterprise **Tenant ID** then select **Update relationship status**. Use the drop-down to select the new status. For example, if you're agreeing to provide service to a customer, set the status to **Agreement signed**. If you set the status to **Consent declined** or **Contract terminated**, you must provide a reason.

If you're providing service to an enterprise for the first time, you must also create an *account* for the enterprise.

1. On the **Requests for Information** pane, select the enterprise, then select **Create account**.
1. Fill in the enterprise **Account name**.
1. Select the checkboxes for the services you want to enable for the enterprise.
1. To use Azure Communications Gateway to provision Operator Connect or Teams Phone Mobile for this customer (sometimes called flow-through provisioning), select the **Sync with backend service** checkbox.
1. Fill in any additional information requested under the **Communications Services Settings** heading.
1. Select **Create**.

## Manage numbers for the enterprise

Uploading numbers for an enterprise allows IT administrators at the enterprise to allocate those numbers to their users.

1. In the sidebar, locate the **Number Management (Preview)** section and select **Accounts**.
1. Select the checkbox next to the enterprise **Account name**.
1. Select **View numbers**.
1. To add new numbers for an enterprise:
    1. Select **Create numbers**.
    1. Select **Manual input**.
    1. Select the service.
    1. Optionally, enter a value for **Custom SIP header**.
    1. Add the numbers in **Telephone Numbers**.
    1. Select **Create**.
1. To change or remove existing numbers:
    1. Select the checkbox next to the number you want to change or remove.
    1. Select **Manage number** or **Delete numbers** as appropriate.

## View civic addresses for an enterprise

You can view civic addresses for an enterprise. The enterprise configures the details of each civic address, so you can't configure these details.

1. In the sidebar, locate the **Number Management (Preview)** section and select **Accounts**. Select the enterprise **Account name**.
1. Select **Civic addresses**.
1. You can see the address, the company name, the description, and whether the address was validated when the enterprise configured the address.
1. Optionally, select an individual address to view additional information provided by the enterprise, for example the Emergency Location Identification Number (ELIN).

## Next steps

Learn more about [the metrics you can use to monitor calls](monitoring-azure-communications-gateway-data-reference.md).
