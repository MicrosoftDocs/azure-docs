---
title: Reset vSphere credentials for Azure VMware Solution
description: Learn how to reset vSphere credentials for your Azure VMware Solution private cloud and ensure the HCX connector has the latest vSphere credentials.
ms.topic: how-to
ms.date: 05/10/2021
---

# Reset vSphere credentials for Azure VMware Solution

This article walks you through the steps to reset the vCenter Server and NSX-T Manager credentials for your Azure VMware Solution private cloud. It allows you to ensure the HCX connector has the latest vCenter Server credentials.

In addition to this how-to, you can also view the video for [resetting the vCenter CloudAdmin & NSX-T Admin password](https://youtu.be/cK1qY3knj88).

## Prerequisites

If you use your cloudadmin credentials for connected services like HCX, vRealize Orchestrator, vRealize Operations Manager, or VMware Horizon, your connections will stop working once you update your password.  Stop these services before initiating the password rotation. If you don't stop these services, you'll experience temporary locks on your vCenter CloudAdmin and NSX-T admin accounts, as these services continuously call using your old credentials.  For more information about setting up separate accounts for connected services, see [Access and Identity Concepts](./concepts-identity.md).

## Reset your Azure VMware Solution credentials

In this step, you'll reset the credentials for your Azure VMware Solution components. Although your vCenter and NSX-T credentials don't expire, you can generate new passwords for these accounts.

1. From the Azure portal, open an Azure Cloud Shell session.

2. Run the following command to update your vCenter CloudAdmin password.  You will need to replace {SubscriptionID}, {ResourceGroup}, and {PrivateCloudName} with the actual values of the private cloud that the CloudAdmin account belongs to.

   ```azurecli-interactive
   az resource invoke-action --action rotateVcenterPassword --ids "/subscriptions/{SubscriptionID}/resourceGroups/{ResourceGroup}/providers/Microsoft.AVS/privateClouds/{PrivateCloudName}" --api-version "2020-07-17-preview"
   ```
          
3. Run the following command to update your NSX-T admin password. You will need to replace **{SubscriptionID}**, **{ResourceGroup}**, and **{PrivateCloudName}** with the actual values of the private cloud that the NSX-T admin account belongs to.

   ```azurecli-interactive
   az resource invoke-action --action rotateNSXTPassword --ids "/subscriptions/{SubscriptionID}/resourceGroups/{ResourceGroup}/providers/Microsoft.AVS/privateClouds/{PrivateCloudName}" --api-version "2020-07-17-preview"
   ```

## Verify the HCX Connector has the latest vCenter Server credentials

In this step, you'll verify that the HCX connector has the updated credentials.

1. Once your password is changed, go to the on-premises HCX connector web interface using https://{ip of the HCX connector appliance}:443. Be sure to use port 443. Log in using your new credentials.

2. On the VMware HCX Dashboard, select **Site Pairing**.
    
   :::image type="content" source="media/reset-vsphere-credentials/hcx-site-pairing.png" alt-text="Screenshot of VMware HCX Dashboard with Site Pairing highlighted.":::
 
3. Select the correct connection to Azure VMware Solution (if there is more than one) and select **Edit Connection**.
 
4. Provide the new vCenter Server CloudAdmin user credentials and select **Edit**, which saves the credentials. Save should show successful.

## Next steps

Now that you've covered resetting vCenter Server and NSX-T Manager credentials for Azure VMware Solution, you may want to learn about:

- [Configuring NSX network components in Azure VMware Solution](configure-nsx-network-components-azure-portal.md).
- [Monitor and manage Azure VMware Solution VMs](lifecycle-management-of-azure-vmware-solution-vms.md).
- [Deploying disaster recovery of virtual machines using Azure VMware Solution](disaster-recovery-for-virtual-machines.md).
