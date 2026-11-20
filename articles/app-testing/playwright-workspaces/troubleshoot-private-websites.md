---
title: Troubleshoot private workspace creation for privately hosted websites
titleSuffix: Playwright Workspaces
description: Fix errors you get when you create a Playwright workspace that connects to your virtual network to reach privately hosted websites, such as subnet delegation, region, and permission errors.
ms.service: azure-app-testing
ms.subservice: playwright-workspaces
ms.custom: playwright-workspaces
ms.topic: troubleshooting-general
ms.date: 11/18/2026
author: Abhinav-Premsekhar
ms.author: apremsekhar
# customer intent: As a Playwright Workspaces user, I want to understand why my private workspace failed to deploy and how to fix it, so that my browsers can reach my privately hosted websites.
---

# Troubleshoot private workspace creation for privately hosted websites

> [!IMPORTANT]
> Access to privately hosted websites in Playwright Workspaces is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article helps you fix errors that occur when you create or update a Playwright workspace with **Traffic mode** set to **Private**. A private workspace connects to a subnet in your virtual network so that cloud browsers can reach websites and apps that aren't exposed to the internet. To learn how to set up a private workspace, see [Access privately hosted websites](how-to-access-private-websites.md). 

## Find the error details

When private workspace creation fails, the deployment ends in the **Failed** state. To see why:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to the resource group where you created the workspace, and then select **Settings** > **Deployments**.
1. Select the failed deployment, and then select **Error details**.

You can also find the error in the resource group's **Activity log**, or in the output of the Azure CLI or Azure PowerShell command that you ran.

The error has two parts:

- **Error code**: `InvalidRequest` (a problem with the request or your network setup) or `AuthError` (a missing permission or identity problem).
- **Message**: a description of the problem and what to do. Each message ends with *See aka.ms/pww/docs/vnet.*, which links to this article.

Use the error code and the message to find your problem in the [Error reference](#error-reference) table.

> [!NOTE]
> If the deployment shows **Failed** without an error code or message, the failure happened inside the service and isn't something you can fix in your network configuration. See [The deployment fails with no error details](#the-deployment-fails-with-no-error-details).

## Check the prerequisites first

Most private workspace errors come from a missed prerequisite. Before you look at a specific error, confirm the following:

| Requirement | How to check |
|---|---|
| The **Microsoft.App** resource provider is registered in the subscription that contains your virtual network. | In the Azure portal, go to the subscription and select **Settings** > **Resource providers**. **Microsoft.App** shows **Registered**. |
| The subnet is delegated to **Microsoft.App/environments**. | Open the subnet in your virtual network. **Subnet delegation** shows **Microsoft.App/environments**. |
| The virtual network and subnet are in the same subscription and the same region as the workspace. | Compare the **Location** and **Subscription** of the virtual network with the values you chose on the **Basics** tab. |
| The subnet, its network security group, its route table, and any other attached resources are in the **Succeeded** state. | Open each resource and check **Provisioning state** on the **Overview** or **Properties** page. |
| Your account has the **Network Contributor** role (or a role that includes it) on the virtual network. | Go to the virtual network and select **Access control (IAM)** > **Check access**. |
| The **CloudNativeTesting DP** application has the **Network Contributor** role, or the `Microsoft.Network/virtualNetworks/subnets/join/action` permission, on the virtual network or its subscription. | Go to the virtual network and select **Access control (IAM)** > **Role assignments**. Search for **CloudNativeTesting DP**. |

These requirements also appear in the **Private endpoint testing - Prerequisites** panel on the **Networking** tab when you create the workspace.

## Error reference

| Error code | Message (start) | Cause | Fix |
|---|---|---|---|
| `InvalidRequest` | A subnet resource ID is required to create a private workspace. | No subnet was provided in the request. | [Provide a subnet](#a-subnet-resource-id-is-required) |
| `InvalidRequest` | The Microsoft.App resource provider is not registered… | The **Microsoft.App** resource provider isn't registered. | [Register Microsoft.App](#the-microsoftapp-resource-provider-isnt-registered) |
| `InvalidRequest` | The requested subnet is not delegated to Microsoft.App/environments. | The subnet has no delegation, or a different delegation. | [Delegate the subnet](#the-subnet-isnt-delegated-to-microsoftappenvironments) |
| `InvalidRequest` | The requested subnet is in a different region than the workspace. | The virtual network is in a different Azure region from the workspace. | [Use a subnet in the same region](#the-subnet-is-in-a-different-region) |
| `InvalidRequest` | The requested virtual network or subnet configuration is invalid. | Another problem with the subnet or virtual network, such as a malformed subnet ID. | [Fix the network configuration](#the-virtual-network-or-subnet-configuration-is-invalid) |
| `InvalidRequest` | Workspace network infrastructure request is invalid. | The request was rejected, and no more specific reason is available. | [Fix the network configuration](#the-virtual-network-or-subnet-configuration-is-invalid) |
| `AuthError` | The identity used for private workspace provisioning does not have Microsoft.Network/virtualNetworks/subnets/join/action… | The service can't join your subnet. | [Grant the subnet join permission](#missing-subnet-join-permission) |
| `AuthError` | The identity used for private workspace provisioning does not have Microsoft.Network/virtualNetworks/read… | The service can't read your virtual network. | [Grant the virtual network read permission](#missing-virtual-network-read-permission) |
| `AuthError` | The identity used for private workspace provisioning does not have the required permission on the requested virtual network or subnet. | Another `Microsoft.Network` permission is missing. | [Grant Microsoft.Network permissions](#other-network-permission-errors) |
| `AuthError` | The tenant ID for the requested subnet is required… | The request didn't include the tenant of the subnet. | [Provide the tenant ID](#the-tenant-id-is-required) |
| `AuthError` | The identity used for private workspace provisioning could not be created for the customer tenant. | The service couldn't get a credential for your tenant. | [Retry, then contact support](#the-provisioning-identity-couldnt-be-created) |
| `AuthError` | Caller is not authorized to provision workspace network infrastructure. | An authorization failure with no more specific reason. | [Check your permissions](#caller-isnt-authorized) |
| None | (none: deployment shows **Failed**) | An internal service error or time-out. | [Retry, then contact support](#the-deployment-fails-with-no-error-details) |

## Network configuration errors (InvalidRequest)

### A subnet resource ID is required

**Message:** *A subnet resource ID is required to create a private workspace. Provide a subnet ID and retry.*

**Cause:** The workspace has **Traffic mode** set to **Private**, but the request doesn't include a subnet.

**Fix:**

- In the Azure portal, on the **Networking** tab, select a **Virtual network** and a **Subnet**.
- If you deploy with an Azure Resource Manager template, Bicep, or the REST API, set the subnet to the full resource ID, in this format:

  ```text
  /subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Network/virtualNetworks/<vnet-name>/subnets/<subnet-name>
  ```


### The Microsoft.App resource provider isn't registered

**Message:** *The Microsoft.App resource provider isn't registered for the subscription that hosts the private workspace infrastructure. Retry later or contact support if the problem persists.*

**Cause:** You need to register the **Microsoft.App** resource provider before Playwright Workspaces can connect to your subnet.

**Fix:**

1. Register the resource provider in the subscription that contains your virtual network:

   ```azurecli
   az provider register --namespace Microsoft.App
   ```

1. Wait until registration finishes. This command returns `Registered` when it's done:

   ```azurecli
   az provider show --namespace Microsoft.App --query registrationState --output tsv
   ```

1. Create the workspace again.

If **Microsoft.App** already shows **Registered** in your subscription and the error continues, wait a few minutes and retry. If it still fails, [contact support](#contact-support).


### The subnet isn't delegated to Microsoft.App/environments

**Message:** *The requested subnet isn't delegated to Microsoft.App/environments. Add that delegation to the subnet and retry.*

**Cause:** Playwright Workspaces needs a subnet that's delegated to **Microsoft.App/environments**.

**Fix:**

1. In the Azure portal, go to your virtual network and select **Settings** > **Subnets**.
1. Select the subnet.
1. Under **Subnet delegation**, select **Microsoft.App/environments**, and then select **Save**.
1. Create the workspace again.

Or use the Azure CLI:

```azurecli
az network vnet subnet update \
  --resource-group <resource-group> \
  --vnet-name <vnet-name> \
  --name <subnet-name> \
  --delegations Microsoft.App/environments
```

> [!NOTE]
> A subnet can have only one delegation. If the subnet is already delegated to another service, use a different subnet or create a new one.

### The subnet is in a different region

**Message:** *The requested subnet is in a different region than the workspace. Use a subnet in the same region and retry.*

**Cause:** The virtual network that contains the subnet is in a different Azure region from the workspace.

**Fix:**

1. Check the region of the virtual network.

   ```azurecli
   az network vnet show --resource-group <resource-group> --name <vnet-name> --query location --output tsv
   ```

1. Do one of the following:
   - Create the workspace in the same region as the virtual network.
   - Use a subnet in a virtual network that's in the workspace's region. If you need to reach a website in another region, use virtual network peering from that network.

### The virtual network or subnet configuration is invalid

**Messages:**

- *The requested virtual network or subnet configuration is invalid. Fix the network configuration and retry.*
- *Workspace network infrastructure request is invalid.*

**Cause:** The request was rejected for a network reason that doesn't match a more specific error, such as a malformed subnet resource ID, or a subnet or virtual network that doesn't exist.

**Fix:**

- Check that the subnet resource ID is complete and correct, and that the subnet still exists.
- Check that the virtual network and subnet are in the same subscription as the workspace.
- Check that the subnet, its network security group, its route table, and any other attached resources are in the **Succeeded** state. You can't use resources that are still updating or that failed.
- Go through [Check the prerequisites first](#check-the-prerequisites-first), and then retry.

## Permission errors (AuthError)

Playwright Workspaces uses the **CloudNativeTesting DP** first party application to connect to your subnet. This application needs permissions on your virtual network.

### Missing subnet join permission

**Message:** *The identity used for private workspace provisioning doesn't have Microsoft.Network/virtualNetworks/subnets/join/action on the requested subnet. Grant that permission and retry.*

**Cause:** The **CloudNativeTesting DP** application can't join your subnet.

**Fix:** Assign the **Network Contributor** role to the application on the virtual network. Or assign a custom role that includes `Microsoft.Network/virtualNetworks/subnets/join/action`.

1. In the Azure portal, go to the virtual network and select **Access control (IAM)**.
1. Select **Add** > **Add role assignment**.
1. On the **Role** tab, select **Network Contributor**, and then select **Next**.
1. On the **Members** tab, select **User, group, or service principal** > **Select members**. Search for **CloudNativeTesting DP**, select it, and then select **Select**.
1. Select **Review + assign**.
1. Create the workspace again.

Or use the Azure CLI:

```azurecli
az role assignment create \
  --assignee <cloudnativetesting-dp-app-id> \
  --role "Network Contributor" \
  --scope /subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Network/virtualNetworks/<vnet-name>
```

> [!TIP]
> To add a role assignment, you need the **Owner**, **User Access Administrator**, or **Role Based Access Control Administrator** role on the virtual network. Role assignments can take a few minutes to apply. Wait before you retry.

### Missing virtual network read permission

**Message:** *The identity used for private workspace provisioning doesn't have Microsoft.Network/virtualNetworks/read on the requested virtual network. Grant that permission and retry.*

**Cause:** The **CloudNativeTesting DP** application can't read your virtual network.

**Fix:** Assign the **Network Contributor** role to the application on the virtual network, as described in [Missing subnet join permission](#missing-subnet-join-permission). If you use a custom role, include `Microsoft.Network/virtualNetworks/read` as well as `Microsoft.Network/virtualNetworks/subnets/join/action`.

### Other network permission errors

**Message:** *The identity used for private workspace provisioning doesn't have the required permission on the requested virtual network or subnet. Grant the required Microsoft.Network permissions and retry.*

**Cause:** A `Microsoft.Network` permission other than subnet join or virtual network read is missing.

**Fix:**

- Assign the **Network Contributor** role to the **CloudNativeTesting DP** application on the virtual network. Network Contributor covers all the permissions that Playwright Workspaces needs.
- Check for an Azure Policy or a deny assignment that blocks changes to the virtual network or subnet. Ask your network administrator if you're not sure.

### The tenant ID is required

**Message:** *The tenant ID for the requested subnet is required to validate access to the customer virtual network. Provide the tenant ID and retry.*

**Cause:** The service needs the Microsoft Entra tenant of the subnet to check access, and the request didn't include it.

**Fix:** Retry the deployment. If you deploy by using a template or the REST API, ensure you're signed in to the tenant that owns the virtual network.

### The provisioning identity couldn't be created

**Message:** *The identity used for private workspace provisioning couldn't be created for the customer tenant. Retry the request, and contact support if the problem persists.*

**Cause:** The service couldn't get a credential for your tenant to connect to your subnet. This error is usually temporary.

**Fix:** Wait a few minutes, and then retry. If the error continues, check that your tenant allows the **CloudNativeTesting DP** application, and then [contact support](#contact-support).

### Caller isn't authorized

**Message:** *Caller is not authorized to provision workspace network infrastructure.*

**Cause:** An authorization failure happened and no more specific reason is available.

**Fix:**

- Check that your account has the **Network Contributor** role (or a role that includes it) on the virtual network.
- Check that the **CloudNativeTesting DP** application has the **Network Contributor** role on the virtual network.
- Wait a few minutes after any role change, and then retry.

## Other problems

### The deployment fails with no error details

**Symptom:** The deployment shows **Failed** with no error code or message, or with a general message such as *Workspace infrastructure operation failed.*

**Cause:** Playwright Workspaces only shows details for problems that you can fix, such as network setup or permissions. Internal service errors and time-outs aren't shown.

**Fix:**

1. Go through [Check the prerequisites first](#check-the-prerequisites-first).
1. Delete the failed workspace, wait a few minutes, and then create it again.
1. If it fails again, [contact support](#contact-support).

### You can't change the network setup of an existing workspace

**Symptom:** You update an existing private workspace to use a different subnet, and the update fails.

**Cause:** Changing the subnet of an existing private workspace isn't supported. Some workspaces created before an infrastructure update also can't be moved to the new private networking setup.

**Fix:** Create a new workspace with the subnet that you want, and then delete the old one.


## Contact support

If you can't fix the problem, [create a support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview). Include:

- The workspace resource ID and region.
- The subnet resource ID.
- The time of the failure, in UTC.
- The **Correlation ID** and the full error from the failed deployment's **Error details**.

## Related content

- [Access privately hosted websites](how-to-access-private-websites.md)
- [Manage workspaces in Playwright Workspaces](how-to-manage-playwright-workspace.md) 
- [Add or remove a subnet delegation](/azure/virtual-network/manage-subnet-delegation)
- [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types)
- [Assign Azure roles by using the Azure portal](/azure/role-based-access-control/role-assignments-portal)
