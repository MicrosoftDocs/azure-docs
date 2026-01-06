---
title: Connect Azure App Configuration to Azure Front Door (preview)
description: Learn how to connect Azure App Configuration to Azure Front Door for hyperscale global delivery of configuration and feature flags, using managed identity, caching, and endpoint controls.
#customer intent: As a developer, I want to integrate Azure Front Door with my App Configuration store to improve configuration delivery performance globally and reduce latency for my applications, while managing the setup through a single Azure portal interface.
author: maud-lv
ms.author: malev
ms.date: 10/27/2025
ms.topic: how-to
ms.service: azure-app-configuration
---

# Connect Azure App Configuration to Azure Front Door (preview)

Azure App Configuration supports direct integration with Azure Front Door (preview) to deliver configuration data through Azure's global content delivery network. This integration provides hyperscale global delivery of application settings and feature flags while centralizing configuration management in the Azure portal.

You can connect your App Configuration store to existing Azure Front Door profiles or create new profiles directly from the App Configuration interface for a quick start.

> [!NOTE]
> This feature is currently available only in the Azure public cloud.

## Prerequisites

Before you begin, ensure you have:

- An active Azure subscription
- An existing Azure App Configuration store
- Permissions to create and manage Azure Front Door resources (Contributor or equivalent)
- Permissions to  assign roles on the App Configuration resource (Owner or User Access Administrator)
- App Configuration Data Owner or App Configuration Data Reader role 
- Basic understanding of [CDN and content delivery concepts](/azure/frontdoor/front-door-overview)

## Connect to Azure Front Door

To connect Azure Front Door with your App Configuration store, follow these steps:

1. In the Azure portal, navigate to your App Configuration store.

1. In the left navigation pane, under **Settings**, select **Azure Front Door (preview)**.

    :::image type="content" source="media/how-to-connect-azure-front-door/select-resource.png" alt-text="Screenshot showing  Azure Front Door resource selection in the App Configuration store."

1. Configure the connection settings:

   - **Subscription**: Select the subscription for your Azure Front Door profile
   - **Resource group**: Select the resource group for the profile
   - **Create new/use existing profile**: Choose whether to create a new profile or use an existing one

1. Continue with the steps that match your selection:

   * To create a new profile, see [Create a new Azure Front Door profile](#create-a-new-azure-front-door-profile).
   * To connect an existing profile, see [Connect to an existing Azure Front Door profile](#connect-to-an-existing-azure-front-door-profile).

### Create a new Azure Front Door profile

Create a new Azure Front Door profile and connect it to your App Configuration store.

#### Basic settings

1. In **Profile name**, enter a name for your new Azure Front Door profile.

    :::image type="content" source="media/how-to-connect-azure-front-door/create-profile.png" alt-text="Screenshot showing creation of a new Azure Front Door profile in the App Configuration store."

1. Choose a **Pricing tier** based on your needs:

   - **Azure Front Door Standard**: Content delivery optimized
   - **Azure Front Door Premium**: Security optimized with enhanced security features

   For a detailed overview and comparison of Azure Front Door pricing tiers, see [Compare pricing between Azure Front Door tiers](/azure/frontdoor/understanding-pricing).

1. Create an endpoint that uses this App Configuration store as origin, and configure the following settings.

#### Endpoint configuration settings

1. Endpoint information:

   - **Endpoint name**: Enter a descriptive name for your endpoint
   - **Endpoint host name**: Automatically generated based on your endpoint name
   - **Origin host name**: Select your App Configuration store and any replicas from the dropdown. These are added to the origin group so Azure Front Door can route traffic to them. For details on how origin groups improve availability and performance, see [Azure Front Door routing methods](/azure/frontdoor/routing-methods)
     :::image type="content" source="media/how-to-connect-azure-front-door/endpoint-details.png" alt-text="Screenshot showing  Azure Front Door endpoint details in the App Configuration store."

1. **Identity type**: Choose the managed identity type for Azure Front Door to access your App Configuration store:

   - **System assigned managed identity**: Automatically enabled; no additional selection required.
   - **User assigned managed identity**: Select the managed identity from the dropdown.

1. **Cache Duration for Azure Front Door**: Configure cache duration to balance performance and origin load. We recommend a minimum TTL of 10 minutes, but you can choose a value that fits your application. Content loaded from AFD will be eventually consistent. Setting the cache duration too short may increase origin requests and lead to throttling. For more details about caching, see [Caching with Azure Front Door](/azure/frontdoor/front-door-caching).

1. **Filter Configuration to scope the request**: Configure one or more filters to control which requests pass through Azure Front Door. This prevents accidental exposure of sensitive configuration and ensures only the settings your application needs are accessible. The filters here must exactly match those used in your application code; otherwise, requests will be rejected by Azure Front Door.
   
   > [!NOTE]
   > To configure scoping filters correctly, ensure that the prefix filter in Azure Front Door exactly matches the selector your application uses to load keys from App Configuration. For example, if your application loads keys using the prefix "App1:", configure the same Starts with = "App1:" key filter in Azure Front Door. If your application instead uses a more specific key prefix such as "App1:Version", but Azure Front Door is allowlisted for "App1:" key filter (or vice versa), the request will be rejected because the selectors do not match exactly. See [examples for matching application filters with endpoint filters](https://github.com/Azure/AppConfiguration/blob/main/docs/AzureFrontDoor/readme.md).

   - **Key**: The key filter to apply when querying Azure App Configuration for key-values. Reserved characters: asterisk (`*`), comma (`,`), and backslash (`\`) must be escaped using a backslash (`\`) when filtering multiple key-values.
   - **Label**: The label filter to apply when querying Azure App Configuration for key-values. Reserved characters: asterisk (`*`), comma (`,`), and backslash (`\`) must be escaped using a backslash (`\`) when filtering multiple key-values.
   - **Tags**: The tag name and value filter to apply when querying Azure App Configuration for key-values. Reserved characters: asterisk (`*`), comma (`,`), backslash (`\`), and equals (`=`) must always be escaped using a backslash (`\`).
   - **Snapshot name**: Name of snapshot whose content should be accessible through this Azure Front Door endpoint. You can select one or more snapshots to restrict access to specific snapshots.

   > [!NOTE]
   > If your application loads feature flags, provide ".appconfig.featureflag/{YOUR-FEATURE-FLAG-PREFIX}" filter for the Key with *Starts with* operator.


1. Select **Create & Connect** to create the profile and establish the connection.

### Connect to an existing Azure Front Door profile

Follow these steps to connect an existing Azure Front Door profile.

1. In **Profile name**, select your existing Azure Front Door profile from the dropdown.

    :::image type="content" source="media/how-to-connect-azure-front-door/select-profile.png" alt-text="Screenshot showing use of existing profile in the App Configuration store."

    > [!NOTE]
    > If you switch subscriptions after selecting **Use existing**, you may see the error **"Failed to get Azure Front Door profile"** in the notifications panel. You can ignore this message and continue with the selection.

1. Select **Connect** to establish the connection.

1. After successful connection, you see your subscription information, the connected Azure Front Door profile name as a clickable link, and an **Existing endpoints** section. Any endpoints in the connected Azure Front Door profile that use this App Configuration store or its replicas as an origin appear here.

1. To create an additional endpoint, select **Create endpoint**, then [configure the endpoint](#endpoint-configuration-settings), and select **Create**.

Endpoints appear in the **Existing endpoints** table, showing endpoint URL, origin URL, origin location, and any configuration warnings that need attention.

## Monitor endpoint status

Use the **Existing endpoints** table to monitor your Azure Front Door endpoints and identify configuration issues.

:::image type="content" source="media/how-to-connect-azure-front-door/existing-connection.png" alt-text="Screenshot showing Azure Front Door connections in the App Configuration store." lightbox="media/how-to-connect-azure-front-door/existing-connection.png":::

The table displays:
- **Azure Front Door Endpoint**: The endpoint URL (clickable link)
- **Origin**: The origin URL pointing to your App Configuration store or replica
- **Origin Location**: The Azure region where the origin is located
- **Warnings**: Configuration issues that may need attention

Monitor for warnings such as "Identity not configured" which indicate additional setup requirements. Address these warnings promptly to ensure proper functionality.

## Disconnect Azure Front Door

When you no longer need to manage your Front Door profile through App Configuration, disconnect your App Configuration store from Azure Front Door.

1. From the Azure Front Door pane in your App Configuration store, select **Disconnect**.

1. Confirm the action by selecting **OK**.

> [!WARNING]
> After disconnecting, you won’t be able to manage the Front Door profile or its endpoints through App Configuration. However, your Front Door profile and endpoints will continue to exist in Azure, and your application will keep fetching configuration via Front Door as expected, unless other changes are made.

## Troubleshoot common issues

If you encounter issues while connecting Azure Front Door to your App Configuration store, consider the following troubleshooting steps:

- Ensure that you have sufficient permissions to create and manage Front Door resources (Contributor or equivalent)
- Ensure that you have sufficient permissions to assign roles (Owner or User Access Administrator).
- Ensure that the selected managed identity has the App Configuration Data Reader role assignment.
- From Front Door portal, make sure that the origin is correctly set up to be able to authenticate with the App Configuration origin. Learn how to [use managed identities to authenticate to origins](/azure/frontdoor/origin-authentication-with-managed-identities)
- Verify that the Azure Front Door resource provider is registered in your subscription.

## Next steps

> [!div class="nextstepaction"]
> [Load Configuration from Azure Front Door in Client Applications](./how-to-load-azure-front-door-configuration-provider.md)

## Related content

- [Configuration Management for Client Applications](./concept-hyperscale-client-configuration.md)
- [Learn more about Azure Front Door](/azure/frontdoor/)
- [Configure App Configuration feature flags](/azure/azure-app-configuration/concept-feature-management)
- [Set up managed identities](/azure/active-directory/managed-identities-azure-resources/)
- [Monitor Azure Front Door performance](/azure/frontdoor/front-door-diagnostics)
