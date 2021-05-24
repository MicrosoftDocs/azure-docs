---
title: Rotate the cloudadmin credentials for Azure VMware Solution
description: Learn how to rotate the vCenter Server and NSX-T Manager credentials for your Azure VMware Solution private cloud. 
ms.topic: how-to
ms.date: 05/11/2021

#Customer intent: As an Azure service administrator, I want to rotate my cloudadmin credentials so that the HCX Connector has the latest vCenter CloudAdmin and NSX-T admin credentials.

---

# Rotate the cloudadmin credentials for Azure VMware Solution

This article walks you through the steps to rotate the cloudadmin credentials for your Azure VMware Solution private cloud.  Although your vCenter Server CloudAdmin and NSX-T Manager admin credentials don't expire, you can generate new passwords for these accounts. After rotating the credentials, you'll verify the HCX Connector has the latest vCenter Server credentials.

You can also watch a video on how to [reset the vCenter CloudAdmin & NSX-T admin password](https://youtu.be/cK1qY3knj88). 

## Prerequisites

If you use your cloudadmin credentials for connected services like HCX, vRealize Orchestrator, vRealize Operations Manager, or VMware Horizon, your connections stop working once you update your password.  Stop these services before initiating the password rotation. Otherwise, you'll experience temporary locks on your vCenter CloudAdmin and NSX-T admin accounts, as these services continuously call using your old credentials.  For more information about setting up separate accounts for connected services, see [Access and Identity Concepts](./concepts-identity.md).

## Reset your Azure VMware Solution credentials

In this step, you'll rotate the cloudadmin credentials for your Azure VMware Solution components. 

>[!NOTE]
>Remember to replace **{SubscriptionID}**, **{ResourceGroup}**, and **{PrivateCloudName}** with you private cloud information.

1. From the Azure portal, open an Azure Cloud Shell session.

2. Update your vCenter CloudAdmin password.  

   ```azurecli-interactive
   az resource invoke-action --action rotateVcenterPassword --ids "/subscriptions/{SubscriptionID}/resourceGroups/{ResourceGroup}/providers/Microsoft.AVS/privateClouds/{PrivateCloudName}" --api-version "2020-07-17-preview"
   ```
          
3. Update your NSX-T admin password. 

   ```azurecli-interactive
   az resource invoke-action --action rotateNSXTPassword --ids "/subscriptions/{SubscriptionID}/resourceGroups/{ResourceGroup}/providers/Microsoft.AVS/privateClouds/{PrivateCloudName}" --api-version "2020-07-17-preview"
   ```

## Verify HCX Connector has the latest credentials

In this step, you'll verify that the HCX Connector has the updated credentials.

1. Go to the on-premises HCX Connector at https://{ip of the HCX connector appliance}:443 and sign in using the new credentials.

   Be sure to use port 443. 

2. On the VMware HCX Dashboard, select **Site Pairing**.
    
   :::image type="content" source="media/rotate-cloudadmin-credentials/hcx-site-pairing.png" alt-text="Screenshot of VMware HCX Dashboard with Site Pairing highlighted.":::
 
3. Select the correct connection to Azure VMware Solution and select **Edit Connection**.
 
4. Provide the new vCenter Server CloudAdmin user credentials and select **Edit**, which saves the credentials. Save should show successful.

## Next steps

Now that you've covered resetting vCenter Server and NSX-T Manager credentials for Azure VMware Solution, you may want to learn about:

- [Configure NSX network components in Azure VMware Solution](configure-nsx-network-components-azure-portal.md)
- [Monitor and manage Azure VMware Solution VMs](lifecycle-management-of-azure-vmware-solution-vms.md)
- [Deploy disaster recovery of virtual machines using Azure VMware Solution](disaster-recovery-for-virtual-machines.md)
