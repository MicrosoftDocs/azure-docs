---
title: Rotate the cloud admin credentials for Azure VMware Solution
description: Learn how to rotate the vCenter Server credentials for your Azure VMware Solution private cloud. 
ms.topic: how-to
ms.service: azure-vmware
ms.custom: devx-track-azurecli, engagement-fy23
ms.date: 3/25/2026
# Customer intent: As an Azure service administrator, I want to rotate my cloud admin credentials so that the HCX Connector has the latest vCenter Server Cloud Admin credentials.
---

# Rotate the cloud admin credentials for Azure VMware Solution

In this article, learn how to rotate the cloud admin credentials (vCenter Server and VMware NSX cloud admin credentials) for your Azure VMware Solution private cloud. Although the password for this account doesn't expire, you can generate a new one at any time.

>[!CAUTION]
>When you use your cloud admin credentials to connect services to vCenter Server or NSX in your private cloud, those connections stop working after you rotate your password. Those connections also lock out the cloud admin account unless you stop those services before you rotate the password.

## Prerequisites

Consider and determine which services connect to vCenter Server as `cloudadmin@vsphere.local` or NSX as cloud admin before you rotate the password. Services can include VMware services like HCX, vRealize Orchestrator, vRealize Operations Manager, VMware Horizon, or other non-Microsoft tools that are used for monitoring or provisioning.

One way to determine which services authenticate to vCenter Server with the cloud admin user is to inspect vSphere events by using the vSphere Client for your private cloud. After you identify those services, you need to stop them before rotating the password. If you don't stop those services, they won't work after you rotate the password. You can also experience temporary locks on your vCenter Server cloud admin account. Locks occur because these services continuously attempt to authenticate by using a cached version of the old credentials.

Instead of using the cloud admin user to connect services to vCenter Server or NSX, we recommend that you use individual accounts for each service. For more information about setting up separate accounts for connected services, see [Access and identity architecture](./architecture-identity.md).

## Reset your vCenter Server credentials

### [Portal](#tab/azure-portal)

1. In your Azure VMware Solution private cloud, select **VMware credentials**.
1. Select **Generate new password** under vCenter Server credentials.
1. Select the confirmation checkbox and then select **Generate password**.

### [Azure CLI](#tab/azure-cli)

To begin using the Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

1. In your Azure VMware Solution private cloud, open an Azure Cloud Shell session.

1. Update your vCenter Server cloud admin credentials. Remember to replace `{SubscriptionID}`, `{ResourceGroup}`, and `{PrivateCloudName}` with your private cloud information.

   ```azurecli-interactive
   az resource invoke-action --action rotateVcenterPassword --ids "/subscriptions/{SubscriptionID}/resourceGroups/{ResourceGroup}/providers/Microsoft.AVS/privateClouds/{PrivateCloudName}" --api-version "2020-07-17-preview"
   ```

---

### Update HCX Connector

1. Go to the on-premises HCX Connector and sign in using the new credentials.

   Be sure to use port **443**.

1. On the VMware HCX dashboard, select **Site Pairing**.

   :::image type="content" source="media/tutorial-vmware-hcx/site-pairing-complete.png" alt-text="Screenshot that shows the VMware HCX dashboard with Site Pairing highlighted.":::

1. Select the correct connection to Azure VMware Solution and select **Edit Connection**.

1. Provide the new vCenter Server user credentials, then select **Edit** to save the credentials. Save should show as successful.

## Reset your NSX Manager credentials

1. In your Azure VMware Solution private cloud, select **VMware credentials**.
1. Under NSX Manager credentials, select **Generate new password**.
1. Select the confirmation checkbox, then select **Generate password**.

## Next steps

Now that you learned how to reset your vCenter Server and NSX Manager credentials for Azure VMware Solution, consider learning more about:

- [Integrating Azure native services in Azure VMware Solution](integrate-azure-native-services.md)
- [Deploying disaster recovery for Azure VMware Solution workloads using VMware HCX](deploy-disaster-recovery-using-vmware-hcx.md)

