---
title: Rotate the cloudadmin credentials for Azure VMware Solution
description: Learn how to rotate the vCenter Server credentials for your Azure VMware Solution private cloud. 
ms.topic: how-to
ms.service: azure-vmware
ms.custom: devx-track-azurecli
ms.date: 8/16/2023
# Customer intent: As an Azure service administrator, I want to rotate my cloudadmin credentials so that the HCX Connector has the latest vCenter Server CloudAdmin credentials.
---

# Rotate the cloudadmin credentials for Azure VMware Solution


In this article, you'll rotate the cloudadmin credentials (vCenter Server and NSX-T *CloudAdmin* credentials) for your Azure VMware Solution private cloud.  Although the password for this account doesn't expire, you can generate a new one at any time.

>[!CAUTION]
>If you use your cloudadmin credentials to connect services to vCenter Server or NSX-T in your private cloud, those connections will stop working once you rotate your password. Those connections will also lock out the cloudadmin account unless you stop those services before rotating the password.

## Prerequisites

Consider and determine which services connect to vCenter Server as *cloudadmin@vsphere.local* or NSX-T as cloudadmin before you rotate the password. These services may include VMware services such as HCX, vRealize Orchestrator, vRealize Operations Manager, VMware Horizon, or other third-party tools used for monitoring or provisioning. 

One way to determine which services authenticate to vCenter Server with the cloudadmin user is to inspect vSphere events using the vSphere Client for your private cloud. After you identify such services, and before rotating the password, you must stop these services. Otherwise, the services won't work after you rotate the password. You'll also experience temporary locks on your vCenter Server CloudAdmin account, as these services continuously attempt to authenticate using a cached version of the old credentials. 

Instead of using the cloudadmin user to connect services to vCenter Server or NSX-T Data Center, we recommend individual accounts for each service. For more information about setting up separate accounts for connected services, see [Access and Identity Concepts](./concepts-identity.md).

## Reset your vCenter Server credentials

### [Portal](#tab/azure-portal)
 
1. In your Azure VMware Solution private cloud, select **VMware credentials**.
1. Select **Generate new password** under vCenter Server credentials.
1. Select the confirmation checkbox and then select **Generate password**.


### [Azure CLI](#tab/azure-cli)

To begin using Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

1. In your Azure VMware Solution private cloud, open an Azure Cloud Shell session.

2. Update your vCenter Server *CloudAdmin* credentials.  Remember to replace **{SubscriptionID}**, **{ResourceGroup}**, and **{PrivateCloudName}** with your private cloud information. 

   ```azurecli-interactive
   az resource invoke-action --action rotateVcenterPassword --ids "/subscriptions/{SubscriptionID}/resourceGroups/{ResourceGroup}/providers/Microsoft.AVS/privateClouds/{PrivateCloudName}" --api-version "2020-07-17-preview"
   ```



---

### Update HCX Connector 

1. Go to the on-premises HCX Connector at https://{ip of the HCX connector appliance}:443 and sign in using the new credentials.

   Be sure to use port **443**. 

2. On the VMware HCX Dashboard, select **Site Pairing**.
    
   :::image type="content" source="media/tutorial-vmware-hcx/site-pairing-complete.png" alt-text="Screenshot of VMware HCX Dashboard with Site Pairing highlighted.":::
 
3. Select the correct connection to Azure VMware Solution and select **Edit Connection**.
 
4. Provide the new vCenter Server user credentials and select **Edit**, which saves the credentials. Save should show successful.

## Reset your NSX-T Manager credentials

1. In your Azure VMware Solution private cloud, select **VMware credentials**.
1. Select **Generate new password** under NSX-T Manager credentials.
1. Select the confirmation checkbox and then select **Generate password**.

## Next steps

Now that you've covered resetting your vCenter Server and NSX-T Manager credentials for Azure VMware Solution, you may want to learn about:

- [Integrating Azure native services in Azure VMware Solution](integrate-azure-native-services.md)
- [Deploying disaster recovery for Azure VMware Solution workloads using VMware HCX](deploy-disaster-recovery-using-vmware-hcx.md)

