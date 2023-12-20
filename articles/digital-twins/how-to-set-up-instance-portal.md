---
# Mandatory fields.
title: Set up an instance and authentication (portal)
titleSuffix: Azure Digital Twins
description: See how to set up an instance of the Azure Digital Twins service using the Azure portal
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 11/17/2022
ms.topic: how-to
ms.service: digital-twins
ms.custom: contperf-fy21q2, subject-rbac-steps, engagement-fy23

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Set up an Azure Digital Twins instance and authentication (portal)

[!INCLUDE [digital-twins-setup-selector.md](../../includes/digital-twins-setup-selector.md)]

This article covers the steps to set up a new Azure Digital Twins instance, including creating the instance and setting up authentication. After completing this article, you'll have an Azure Digital Twins instance ready to start programming against.

This version of this article goes through these steps manually, one by one, using the Azure portal. The Azure portal is a web-based, unified console that provides an alternative to command-line tools.

[!INCLUDE [digital-twins-setup-steps.md](../../includes/digital-twins-setup-steps.md)]

## Create the Azure Digital Twins instance

[!INCLUDE [digital-twins-setup-portal.md](../../includes/digital-twins-setup-portal.md)]

3. On the following **Create Resource** page, fill in the values given below:
    * **Subscription**: The Azure subscription you're using
      - **Resource group**: A resource group in which to deploy the instance. If you don't already have an existing resource group in mind, you can create one here by selecting the **Create new** link and entering a name for a new resource group
    * **Location**: An Azure Digital Twins-enabled region for the deployment. For more details on regional support, visit [Azure products available by region (Azure Digital Twins)](https://azure.microsoft.com/global-infrastructure/services/?products=digital-twins).
    * **Resource name**: A name for your Azure Digital Twins instance. If your subscription has another Azure Digital Twins instance in the region that's
      already using the specified name, you'll be asked to pick a different name.
    * **Grant access to resource**: Checking the box in this section will give your Azure account permission to access and manage data in the instance. If you're the one that will be managing the instance, you should check this box now. If it's greyed out because you don't have permission in the subscription, you can continue creating the resource and have someone with the required permissions grant you the role later. For more information about this role and assigning roles to your instance, see the next section, [Set up user access permissions](#set-up-user-access-permissions).

    :::image type="content" source= "media/how-to-set-up-instance/portal/create-azure-digital-twins-2.png" alt-text="Screenshot of the Create Resource process for Azure Digital Twins in the Azure portal. The described values are filled in.":::

4. When you're finished, you can select **Review + create** if you don't want to configure any more settings for your instance. Doing so will take you to a summary page, where you can review the instance details you've entered and finish with **Create**. 

    If you do want to configure more details for your instance, the next section describes the remaining setup tabs.

### Additional setup options

Here are the additional options you can configure during setup, using the other tabs in the **Create Resource** process.

* **Networking**: In this tab, you can enable private endpoints with [Azure Private Link](../private-link/private-link-overview.md) to eliminate public network exposure to your instance. For instructions, see [Enable private access with Private Link](./how-to-enable-private-link.md?tabs=portal#add-a-private-endpoint-during-instance-creation).
* **Advanced**: In this tab, you can enable a system-assigned [managed identity](concepts-security.md#managed-identity-for-accessing-other-resources) for your instance. When this is enabled, Azure automatically creates an identity for the instance in [Microsoft Entra ID](../active-directory/fundamentals/active-directory-whatis.md), which can be used to authenticate to other services. You can enable that system-assigned managed identity while you're creating the instance here, or [later on an existing instance](#enabledisable-managed-identity-for-the-instance). If you want to enable a user-assigned managed identity instead, you'll need to do it later on an existing instance.
* **Tags**: In this tab, you can add tags to your instance to help you organize it among your Azure resources. For more about Azure resource tags, see [Tag resources, resource groups, and subscriptions for logical organization](../azure-resource-manager/management/tag-resources.md).

### Verify success and collect important values

After finishing your instance setup by selecting **Create**, you can view the status of your instance's deployment in your Azure notifications along the portal icon bar. The notification will indicate when deployment has succeeded, at which point you can select the **Go to resource** button to view your created instance.

:::image type="content" source="media/how-to-set-up-instance/portal/notifications-deployment.png" alt-text="Screenshot of the Azure notifications showing a successful deployment and highlighting the 'Go to resource' button in the Azure portal.":::

If deployment fails, the notification will indicate why. Observe the advice from the error message and retry creating the instance.

>[!TIP]
>Once your instance is created, you can return to its page at any time by searching for the name of your instance in the Azure portal search bar.

From the instance's **Overview** page, note its **Name**, **Resource group**, and **Host name**. These values are all important and you may need to use them as you continue working with your Azure Digital Twins instance. If other users will be programming against the instance, you should share these values with them.

:::image type="content" source="media/how-to-set-up-instance/portal/instance-important-values.png" alt-text="Screenshot of the Azure portal, highlighting the important values from the Azure Digital Twins instance's Overview page.":::

You now have an Azure Digital Twins instance ready to go. Next, you'll give the appropriate Azure user permissions to manage it.

## Set up user access permissions

[!INCLUDE [digital-twins-setup-role-assignment.md](../../includes/digital-twins-setup-role-assignment.md)]

There are two ways to create a role assignment for a user in Azure Digital Twins:
* [During Azure Digital Twins instance creation](#assign-the-role-during-instance-creation)
* [Using Azure Identity Management (IAM)](#assign-the-role-using-azure-identity-management-iam)

They both require the same permissions.

### Prerequisites: Permission requirements

[!INCLUDE [digital-twins-setup-permissions.md](../../includes/digital-twins-setup-permissions.md)]

### Assign the role during instance creation

While creating your Azure Digital Twins resource through the process described [earlier in this article](#create-the-azure-digital-twins-instance), select the **Assign Azure Digital Twins Data Owner Role** under **Grant access to resource**. Doing so will grant yourself full access to the data plane APIs.

:::image type="content" source= "media/how-to-set-up-instance/portal/create-azure-digital-twins-2-role.png" alt-text="Screenshot of the Create Resource process for Azure Digital Twins in the Azure portal. The checkbox under Grant access to resource is highlighted.":::

If you don't have permission to assign a role to an identity, the box will appear greyed out.

:::image type="content" source= "media/how-to-set-up-instance/portal/create-azure-digital-twins-2-role-greyed.png" alt-text="Screenshot of the Create Resource process for Azure Digital Twins in the Azure portal. The checkbox under Grant access to resource is disabled.":::

In that case, you can still continue to successfully create the Azure Digital Twins resource, but someone with the appropriate permissions will need to assign this role to you or the person who will be managing the instance's data.

### Assign the role using Azure Identity Management (IAM)

You can also assign the **Azure Digital Twins Data Owner** role using the access control options in Azure Identity Management (IAM).

1. First, open the page for your Azure Digital Twins instance in the Azure portal. 

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the Add role assignment page.

1. Assign the **Azure Digital Twins Data Owner** role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).
    
    | Setting | Value |
    | --- | --- |
    | Role | [Azure Digital Twins Data Owner](../role-based-access-control/built-in-roles.md#azure-digital-twins-data-owner) |
    | Assign access to | User, group, or service principal |
    | Members | Search for the name or email address of the user to assign |
    
    ![Add role assignment page](../../includes/role-based-access-control/media/add-role-assignment-page.png)

### Verify success

You can view the role assignment you've set up under **Access control (IAM) > Role assignments**. The user should show up in the list with a role of **Azure Digital Twins Data Owner**. 

:::image type="content" source="media/how-to-set-up-instance/portal/verify-role-assignment.png" alt-text="Screenshot of the role assignments for an Azure Digital Twins instance in the Azure portal.":::

You now have an Azure Digital Twins instance ready to go, and have assigned permissions to manage it.

## Enable/disable managed identity for the instance

This section shows you how to add a managed identity (either system-assigned or user-assigned) to an existing Azure Digital Twins instance. You can also use this page to disable managed identity on an instance that has it already.

Start by opening the [Azure portal](https://portal.azure.com) in a browser.

1. Search for the name of your instance in the portal search bar, and select it to view its details.

1. Select **Identity** in the left-hand menu.

1. Use the tabs to select which type of managed identity you want to add or remove.
    1. **System-assigned**: After selecting this tab, select the **On** option to turn on this feature, or **Off** to remove it.

       :::image type="content" source="media/how-to-set-up-instance/portal/identity-system-assigned.png" alt-text="Screenshot of the Azure portal showing the Identity page and system-assigned options for an Azure Digital Twins instance." lightbox="media/how-to-set-up-instance/portal/identity-system-assigned.png":::

        Select the **Save** button, and **Yes** to confirm. After system-assigned identity is turned on, more fields will be displayed on this page showing the new identity's **Object ID** and **Permissions** (Azure role assignments).

    1. **User-assigned (preview)**: After selecting this tab, select **Associate a user-assigned managed identity** and follow the prompts to choose an identity to associate with the instance.

       :::image type="content" source="media/how-to-set-up-instance/portal/identity-user-assigned.png" alt-text="Screenshot of the Azure portal showing the Identity page and user-assigned options for an Azure Digital Twins instance." lightbox="media/how-to-set-up-instance/portal/identity-user-assigned.png":::

        Or, if there is already an identity listed here that you want to disable, you can check the box next to it in the list and **Remove** it.

        Once an identity has been added, you can select its name from the list here to open its details. From its details page, you can view its **Object ID** and use the left menu to see its **Azure role assignments**.

### Considerations for disabling managed identities

It's important to consider the effects that any changes to the identity or its roles can have on the resources that use it. If you're [using managed identities with your Azure Digital Twins endpoints](how-to-create-endpoints.md#endpoint-options-identity-based-authentication) or for [data history](how-to-create-data-history-connection.md) and the identity is disabled, or a necessary role is removed from it, the endpoint or data history connection can become inaccessible and the flow of events will be disrupted.

## Next steps

Test out individual REST API calls on your instance using the Azure Digital Twins CLI commands: 
* [az dt reference](/cli/azure/dt)
* [Azure Digital Twins CLI command set](concepts-cli.md)

Or, see how to connect a client application to your instance with authentication code:
* [Write app authentication code](how-to-authenticate-client.md)
