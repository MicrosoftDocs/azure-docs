---
title: Create Entra App Registration for use with Azure CycleCloud 
description: Configure Entra ID App Registration to use with CycleCloud
author: abatallas
ms.date: 01/13/2025
ms.author: padmalathas
---

# Create a Microsoft Entra application registration for use with Azure CycleCloud and Azure CycleCloud Workspace for Slurm

[Microsoft Entra ID](/entra/fundamentals) is a cloud-based identity and access management service that enables your employees to access external resources. Azure CycleCloud's native integration with Microsoft Entra ID makes it easy to manage, authorize, and authenticate users if needed by your organization. Check with your organization to ensure that an application registration doesn't already exist for use.

> [!NOTE]
> All users granted roles and access in a given Microsoft Entra ID application registration have those permissions across all Azure CycleCloud installations that use that application registration. You can segregate user access by creating separate application registrations for each CycleCloud installation.

## Create the Microsoft Entra ID application registration

### Automatic

Follow the steps in this section to create a Microsoft Entra ID application registration **before** deploying Azure CycleCloud and Azure CycleCloud Workspace for Slurm by using a utility script. 

This script creates a new user-assigned managed identity resource for exclusive use with the application registration. For more details, see [*Open OnDemand*](#open-ondemand). 

**Script instructions**

Download the script by using the following sequence of commands:

> [!IMPORTANT]
> Run the following commands from a Linux shell with the Azure CLI installed and authenticated by using the Azure account designated for deployment. Azure Cloud Shell might not be supported for this scenario.

```
LATEST_RELEASE=$(curl -sSL -H 'Accept: application/vnd.github+json' "https://api.github.com/repos/Azure/cyclecloud-slurm-workspace/releases/latest" | sed -n 's/.*"tag_name":[[:space:]]*"\([^"]*\)".*/\1/p')

wget "https://raw.githubusercontent.com/Azure/cyclecloud-slurm-workspace/refs/tags/${LATEST_RELEASE}/util/entra_predeploy.sh"
```

Replace the values for `LOCATION`, `ENTRA_MI_RESOURCE_GROUP`, `MI_NAME`, `APP_NAME`, and `SERVICE_MANAGEMENT_REFERENCE` in the downloaded script, including the characters `<` and `>`, by using your preferred text editor.

- `LOCATION` is the Azure region where you will deploy the managed identity resource and its resource group.
- `ENTRA_MI_RESOURCE_GROUP` is the name of the resource group that will contain the managed identity resource. 
- `MI_NAME` is the desired name of the managed identity resource. It can't contain spaces.
- `APP_NAME` is the designed name of the Microsoft Entra ID application registration. 
- `SERVICE_MANAGEMENT_REFERENCE` is an optional value that you can use to help identify the application registration in your organization's list of Entra ID applications. You can leave it blank.

Finally, run the script: 

```
sh entra_predeploy.sh
```

Make note of the Tenant, Client, and Managed Identity Resource IDs and proceed to the [*Configuring redirect URIs*](#configuring-redirect-uris) section. 

### Manual

> [!NOTE]
> Any service principal intended for use with Azure CycleCloud created by using the Azure CLI won't include the associated enterprise application required for use with Microsoft Entra ID.

1. In the Azure portal, select the **Microsoft Entra ID** icon in the navigation pane or type "Microsoft Entra ID" in the search bar and select "Microsoft Entra ID" from the Services category in the results.
1. Go to the **App registrations** tab under the **Manage** menu.  
:::image type="content" source="../images/entra-setup/entra1.png" alt-text="Screenshot of the App registrations tab location in Azure portal.":::

1. Select **New registration** from the top menu bar. You don't need to set any redirect URIs at this point.
:::image type="content" source="../images/entra-setup/entra17.png" alt-text="Screenshot of the App registration creation view.":::

1. Make note of the **Application (client) ID** and **Directory (tenant) ID** fields on the **Overview** page of the newly created application. You'll need these values to configure Entra authentication in CycleCloud in later steps.
:::image type="content" source="../images/entra-setup/entra2.png" alt-text="Screenshot of the App Registration overview window.":::

1. Go to the **Expose an API** page of your application and select **Add a scope**. This step exposes your app registration as an API for which Access Tokens can be generated. Keep the Application ID URI as the default value of `api://{ClientID}`.
:::image type="content" source="../images/entra-setup/entra3.png" alt-text="Screenshot of the Expose an API menu.":::
:::image type="content" source="../images/entra-setup/entra4.png" alt-text="Screenshot of the popup view for adding the API scope URI.":::

1. The portal prompts you to configure the new scope when you select **Save and Continue**. Enter `user_access` as the scope name and configure the other fields as desired, but make sure that **State** is set to **Enabled**.
:::image type="content" source="../images/entra-setup/entra5.png" alt-text="Screenshot of the Add a scope configuration sliding view.":::

1. Go to the **API Permissions** page and select **Add a permission**. In the **Request API permissions** menu, go to **My APIs** and choose the application. Then select **Delegated permissions** and check off the scope you created in the previous step. Select **Add permission**. The new permission now appears in the **Configured permissions** table.
:::image type="content" source="../images/entra-setup/entra6.png" alt-text="Screenshot of the API permissions table alongside the side menu for adding one.":::
:::image type="content" source="../images/entra-setup/entra7.png" alt-text="Screenshot of the Request API permissions menu.":::

1. Navigate to the **Authentication** page and enable **Allow public client flows** to use the CycleCloud CLI with Microsoft Entra ID. 
1. Next, add the user roles for CycleCloud under **App roles** by selecting **Create app role**. You can set the **Display name** field to any desired string, but the **Value** field must match the built-in CycleCloud role for authentication to work as intended. 
:::image type="content" source="../images/entra-setup/entra9.png" alt-text="Screenshot of the App roles configuration window.":::
    > [!NOTE] 
    > Microsoft Entra ID doesn't allow roles to have spaces in them and some of the in-built CycleCloud roles include spaces (for example, "Cluster Administrator"). Replace any spaces in the role names defined in Microsoft Entra ID with a dot (for example, "Data Admin" becomes "Data.Admin"). Rename any roles defined in CycleCloud to not feature dots. Role definitions in Microsoft Entra ID are case insensitive.
1. Add the following roles. The first two roles are required only if you're planning to use [Open OnDemand](#open-ondemand).
:::image type="content" source="../images/entra-setup/entra21.png" alt-text="Screenshot of the basic roles required for CycleCloud.":::

1. CycleCloud doesn't support v2.0 access tokens issued by the application registration. To fix this problem, configure the application registration to issue tokens v1.0 by selecting **Manifest** and changing the value of the **accessTokenAcceptedVersion** property to ``1`` in the manifest. Be sure to select **Save**.
:::image type="content" source="../images/entra-setup/entra24.png" alt-text="Screenshot of the Manifest menu.":::

## Configuring redirect URIs

> [!IMPORTANT]
> Complete the outlined steps *after* deploying Azure CycleCloud. 
> [!NOTE]
> If you've deployed Azure CycleCloud Workspace for Slurm, use the provided helper utility [script](./ccws/plan-your-deployment.md#post-deployment-utility) to automatically execute the following instructions.

1. On the same page, select **Add a platform** under *Platform Configurations* and then select **Mobile and desktop applications**. Enter `http://localhost` as the custom URI and save by pressing **Configure**. Then navigate to the **Mobile and desktop applications** section of the **Authentication** page and add `https://localhost` as another redirect URI. Both of these URIs are required to enable the CycleCloud CLI to authenticate with the new application registration. For more information, see [Redirect URI (reply URL) restrictions and limitations](/entra/identity-platform/reply-url). Be sure to select **Save** on the bottom of the page after completing this step. You can leave the remaining fields blank.
:::image type="content" source="../images/entra-setup/entra20.png" alt-text="Screenshot of the Mobile and desktop application configuration window.":::

1. Select **Add a platform** under *Platform Configurations* and then choose **Single-page application**. Enter `https://{your_cyclecloud_VM_IP_or_domain_name}/home` as the custom URI and save by pressing **Configure**. Similar to the previous step, navigate to the **Mobile and desktop applications** section of the **Authentication** page and add `https://{your_cyclecloud_VM_IP_or_domain_name}/sso` as a redirect URI. Add additional URIs in the same section of the Authentication page to use this application registration with multiple CycleCloud installations or to use multiple URIs for the same CycleCloud installation. You can leave the remaining fields blank.
:::image type="content" source="../images/entra-setup/entra15.png" alt-text="Screenshot of the Redirect URI configuration view.":::

## Permissioning users for CycleCloud
1. Add users and assign the newly created CycleCloud roles to them by going to the application's **Enterprise Application** page. The easiest way to get there is through a helper link on your App roles page. 
:::image type="content" source="../images/entra-setup/entra10.png" alt-text="Screenshot of the shortcut to get to the Enterprise Application role assignment window.":::

1.  Go to the **Users and groups** page of the Enterprise Application and select **Add user/group**.
:::image type="content" source="../images/entra-setup/entra11.png" alt-text="Screenshot of the Add a user/group menu.":::

1. On the **Add Assignment** page, select one or more users and the role to assign to them. You can use the search bar to filter users. Only one role may be assigned at a time. Repeat this process to add multiple roles to the same user.
:::image type="content" source="../images/entra-setup/entra12.png" alt-text="Screenshot of the Add a role assignment selection.":::
:::image type="content" source="../images/entra-setup/entra13.png" alt-text="Screenshot of the Add a role assignment completion.":::

1. Users will appear on the **User and groups** page upon being assigned a role. Assigning multiple roles to a single user results in several entries for that user: one entry per role.
:::image type="content" source="../images/entra-setup/entra14.png" alt-text="Screenshot of the User and groups view after a role has been assigned.":::

1. RECOMMENDED: If you want to allow access to CycleCloud only for users you explicitly add to your app, go to the **Properties of the Enterprise Application** and set **Assignment Required** to **Yes**.
:::image type="content" source="../images/entra-setup/entra16.png" alt-text="Screenshot of the Assignment required setting highlight in the Enterprise Application blade.":::

## Open OnDemand

Follow the steps in this section if you want to deploy Open OnDemand with Azure CycleCloud Workspace for Slurm. 

The Open OnDemand front end uses Open ID Connect (OIDC) for authentication. The OIDC provider is the Microsoft Entra ID application created by using the following steps. This application uses federated credentials with a user-assigned managed identity to avoid storing secrets in the Open OnDemand configuration. 

You don't need to enable Open OnDemand when initially deploying Azure CycleCloud or Azure CycleCloud Workspace for Slurm. You can easily add Open OnDemand to CycleCloud later. Therefore, the utility script that automatically creates the Microsoft Entra ID application registration also creates the user-assigned managed identity. 

Complete the following steps to use Open OnDemand with your manually created application registration. 
> [!NOTE]
> The following roles do not need to be created if you use the [utility script](./create-app-registration.md#automatic) to create your Microsoft Entra ID application registration. Instead, assign the roles to your users. 

As in Step 9 of the *Manual* subsection of *Creating the Microsoft Entra ID application registration*, create roles named `Global.Node.Admin` with value `Global.Node.Admin` and `Global.Node.User` with value `Global.Node.User`. Assign one of these two roles to users who want to use Open OnDemand.
> [!NOTE]
> You don't need to manually set the following redirect URI if you use the helper script provided [here](./ccws/plan-your-deployment.md#post-deployment-utility).

As in first step of the *Configuring redirect URIs* section, select **Add a platform** under *Platform Configurations* on the *Authentication* page and then choose **Web application**. Enter `https://{your_open_ondemand_VM_IP_or_domain_name}/oidc` as the custom URI and save by pressing **Configure**.

### Signing into Open OnDemand
Your users must first sign into Azure CycleCloud with Microsoft Entra ID before attempting to use Open OnDemand by navigating to the authentication URI listed in the **Single-page application** section on the Authentication page of the application registration. They can then sign in to Open OnDemand by navigating to the private IP or FQDN of the Open OnDemand virtual machine. Users should accept any consent messages that appear.
