---
title: Reset vSphere credentials for Azure VMware Solution
description: Learn how to reset vSphere credentials for your Azure VMware Solution private cloud and ensure the HCX connector has the latest vSphere credentials.
ms.topic: how-to
ms.date: 03/16/2021
---

# Reset vSphere credentials for Azure VMware Solution

In this article, we'll walk through the steps to reset the vCenter Server and NSX-T Manager credentials for your Azure VMware Solution private cloud. This will allow you to ensure the HCX connector has the latest vCenter Server credentials.

## Reset your Azure VMware Solution credentials

 First let's reset your Azure VMare Solution components credentials. Your vCenter Server CloudAdmin and NSX-T admin credentials don’t expire; however, you can follow these steps to generate new passwords for these accounts.

> [!NOTE]
> If you use your CloudAdmin credentials for connected services like HCX, vRealize Orchestrator, vRealizae Operations Manager or VMware Horizon, your connections will stop working once you update your password.  These services should be stopped before initiating the password rotation.  Failure to do so may result in temporary locks on your vCenter CloudAdmin and NSX-T admin accounts, as these services will continuously call using your old credentials.  For more information about setting up separate accounts for connected services, see [Access and Identity Concepts](https://docs.microsoft.com/azure/azure-vmware/concepts-identity).

1. From the Azure portal, open an Azure Cloud Shell session.

2. Run the following command to update your vCenter CloudAdmin password.  You will need to replace {SubscriptionID}, {ResourceGroup}, and {PrivateCloudName} with the actual values of the private cloud that the CloudAdmin account belongs to.

```
az resource invoke-action --action rotateVcenterPassword --ids "/subscriptions/{SubscriptionID}/resourceGroups/{ResourceGroup}/providers/Microsoft.AVS/privateClouds/{PrivateCloudName}" --api-version "2020-07-17-preview"
```
          
3. Run the following command to update your NSX-T admin password. You will need to replace {SubscriptionID}, {ResourceGroup}, and {PrivateCloudName} with the actual values of the private cloud that the NSX-T admin account belongs to.

```
az resource invoke-action --action rotateNSXTPassword --ids "/subscriptions/{SubscriptionID}/resourceGroups/{ResourceGroup}/providers/Microsoft.AVS/privateClouds/{PrivateCloudName}" --api-version "2020-07-17-preview"
```

## Ensure the HCX connector has your latest vCenter Server credentials

Now that you've reset your credentials, follow these steps to ensure the HCX connector has your updated credentials.

1. Once your password is changed, go to the on-premises HCX connector web interface using https://{ip of the HCX connector appliance}:443. Be sure to use port 443. Log in using your new credentials.

2. On the VMware HCX Dashboard, select **Site Pairing**.
    
    :::image type="content" source="media/reset-vsphere-credentials/hcx-site-pairing.png" alt-text="Screenshot of VMware HCX Dashboard with Site Pairing highlighted.":::
 
3. Select the correct connection to Azure VMware Solution (if there is more than one) and select **Edit Connection**.
 
4. Provide the new vCenter Server CloudAdmin user credentials and select **Edit**, which saves the credentials. Save should show successful.

## Next steps

Now that you've covered resetting vCenter Server and NSX-T Manager credentials for Azure VMware Solution, you may want to learn about:

- [Configuring NSX network components in Azure VMware Solution](configure-nsx-network-components-azure-portal.md).
- [Lifecycle management of Azure VMware Solution VMs](lifecycle-management-of-azure-vmware-solution-vms.md).
- [Deploying disaster recovery of virtual machines using Azure VMware Solution](disaster-recovery-for-virtual-machines.md).
