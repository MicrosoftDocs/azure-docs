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

# Manage an enterprise with Azure Communications Gateway's Number Management Portal (preview)

Azure Communications Gateway's Number Management Portal (preview) enables you to manage enterprise customers and their numbers through the Azure portal. Any changes made in this portal are automatically provisioned into the Operator Connect and Teams Phone Mobile environments. You can also use Azure Communications Gateway's Provisioning API (preview). For more information, see [Provisioning Azure Communications Gateway](provisioning-platform.md).

> [!IMPORTANT]
> The Operator Connect and Teams Phone Mobile programs require that full API integration to your BSS is completed prior to launch in the Teams Admin Center. This can either be directly to the Operator Connect API or through the Azure Communications Gateway's Provisioning API (preview).

You can:

* Manage your agreement with an enterprise customer.
* Manage numbers for the enterprise.
* View civic addresses for an enterprise.
* Configure a custom header for a number (not available for Teams Phone Mobile).

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
* You must know whether you want to configure the numbers directly in the Number Management Portal, or by uploading a CSV file to the Number Management Portal.
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
    
    # [Configure numbers directly in the portal](#tab/manual-configuration)
    
    1. Select **Create numbers**.
    1. Select **Manual input**.
    1. Select the service.
    1. Optionally, enter a value for **Custom SIP header**.
    1. Add the numbers in **Telephone Numbers**.
    1. Select **Create**.
    
    # [Upload a CSV](#tab/csv-upload)

    1. Prepare a `.csv` file containing the numbers. It should use the headings shown in the following tables, and contain one number per line (up to 10,000 numbers).
        * For Operator Connect:

            | Heading | Description  | Valid values |
            |---------|---------|---------|
            | `telephoneNumber`|The number to upload | E.164 numbers, including `+` and the country code |
            | `accountName` | The account to upload the number to | The name of an existing account |
            | `serviceDetails_teamsOperatorConnect_enabled`| Whether Operator Connect is enabled | `true` or `false`|
            | `serviceDetails_teamsOperatorConnect_assignmentStatus` | Whether the number is assigned to a user | `assigned` or `unassigned` |
            | `serviceDetails_teamsOperatorConnect_configuration_usage` | The usage of the number | `CallingUserAssignment`, `FirstPartyAppAssignment`, or `ConferenceAssignment` |
            | `serviceDetails_teamsOperatorConnect_configuration_choosableCapabilities` | The capabilities of the number | `InboundCalling`, `OutboundCalling`, or `Mobile` |
            | `serviceDetails_teamsOperatorConnect_configuration_additionalUsages` | Additional usages for the number | `CallingUserAssignment`, `FirstPartyAppAssignment`, or `ConferenceAssignment` |
            | `serviceDetails_teamsOperatorConnect_configuration_civicAddressId` | The ID of the civic address used as the emergency address | An existing ID |
            | `serviceDetails_teamsOperatorConnect_configuration_locationId` | The ID of a location associated with the civic address | An existing ID |
            | `serviceDetails_teamsOperatorConnect_configuration_allowTenantAddressUpdate` | Whether the enterprise can update the civic address | `true` or `false` |
            | `serviceDetails_teamsOperatorConnect_configuration_displayedCountryCode` | The country code to display for the number. Required if you're uploading a North American Toll-Free number, otherwise optional. | A valid country code |
            | `configuration_customSipHeader`| Optional: the value for a SIP custom header. | Can only contain letters, numbers, underscores, and dashes. Can be up to 100 characters in length. |

        * For Teams Phone Mobile:

            | Heading | Description  | Valid values |
            |---------|---------|---------|
            | `telephoneNumber`|The number to upload | E.164 numbers, including the country code |
            | `accountName` | The account to upload the number to | The name of an existing account |
            | `serviceDetails_teamsPhoneMobile_enabled`| Whether Teams Phone Mobile is enabled | `true` or `false`|
            | `serviceDetails_teamsPhoneMobile_assignmentStatus` | Whether the number is assigned to a user | `assigned` or `unassigned` |
            | `serviceDetails_teamsPhoneMobile_configuration_usage` | The usage of the number | `CallingUserAssignment`, `FirstPartyAppAssignment`, or `ConferenceAssignment` |
            | `serviceDetails_teamsPhoneMobile_configuration_choosableCapabilities` | The capabilities of the number | `InboundCalling`, `OutboundCalling`, or `Mobile` |
            | `serviceDetails_teamsPhoneMobile_configuration_additionalUsages` | Additional usages for the number | `CallingUserAssignment`, `FirstPartyAppAssignment`, or `ConferenceAssignment` |
            | `serviceDetails_teamsPhoneMobile_configuration_civicAddressId` | The ID of the civic address used as the emergency address | An existing ID |
            | `serviceDetails_teamsPhoneMobile_configuration_locationId` | The ID of a location associated with the civic address | An existing ID |
            | `serviceDetails_teamsPhoneMobile_configuration_allowTenantAddressUpdate` | Whether the enterprise can update the civic address | `true` or `false` |
            | `serviceDetails_teamsPhoneMobile_configuration_displayedCountryCode` | The country code to display for the number. Required if you're uploading a North American Toll-Free number, otherwise optional. | A valid country code |

    1. Select **Create numbers**.
    1. Select **File Upload**.
    1. Select the `.csv` file that you prepared.
    1. Select **Upload**.

    ---

1. To remove numbers from an enterprise:
    1. Select the numbers.
    1. Select **Delete numbers**.
    1. Wait 30 seconds, then select **Refresh** to confirm that the numbers have been removed.

## View civic addresses for an enterprise

You can view civic addresses for an enterprise. The enterprise configures the details of each civic address, so you can't configure these details.

1. In the sidebar, locate the **Number Management (Preview)** section and select **Accounts**. Select the enterprise **Account name**.
1. Select **Civic addresses**.
1. You can see the address, the company name, the description, and whether the address was validated when the enterprise configured the address.
1. Optionally, select an individual address to view additional information provided by the enterprise, for example the Emergency Location Identification Number (ELIN).

## Configure a custom header for a number

You can specify a custom SIP header value for an enterprise telephone number, which applies to all SIP messages sent and received by that number. This feature is available for all communications services except Azure Operator Call Protection Preview and Teams Phone Mobile.

1. In the sidebar, locate the **Number Management (Preview)** section and select **Numbers**.
1. Select the **Phone number** checkbox then select **Manage number**.
1. Specify a **Custom SIP header value**.
1. Select **Review and upload** then **Upload**.

## Next steps

Learn more about [the metrics you can use to monitor calls](monitoring-azure-communications-gateway-data-reference.md).
