---
title: Rotate the cloudadmin credentials for Azure VMware Solution
description: Learn how to rotate the vCenter Server credentials for your Azure VMware Solution private cloud. 
ms.topic: how-to
ms.date: 08/25/2021

#Customer intent: As an Azure service administrator, I want to rotate my cloudadmin credentials so that the HCX Connector has the latest vCenter CloudAdmin credentials.

---

# Rotate the cloudadmin credentials for Azure VMware Solution

In this article, you'll rotate the cloudadmin credentials (vCenter Server *CloudAdmin* credentials) for your Azure VMware Solution private cloud.  Although the password for this account doesn't expire, you can generate a new one at any time.

> [!CAUTION]
> If you use your cloudadmin user credentials to connect services to vCenter in your private cloud, those connections will stop working once you rotate your password and will lockout the cloudadmin account unless those services are stopped prior to password rotation.

>[!IMPORTANT]
>Currently, rotating your NSX-T Manager *admin* credentials isn't supported.


## Prerequisites

You should consider and determine which services connect to vCenter as *cloudadmin@vsphere.local* prior to attempting password rotation. This may include VMware services such as HCX, vRealize Orchestrator, vRealize Operations Manager, VMware Horizon, or other third-party tools used for monitoring or provisioning. One way you can determine which services are authenticating to vCenter with the cloudadmin user is by inspecting vSphere events using the vSphere Client for your private cloud. After you idenitfy such services, stop them before initiating the password rotation operation. Otherwise, the services will stop working after you rotate the password and you'll experience temporary locks on your vCenter CloudAdmin account, as these services will continuously atteempt to authenticate using a cached version of the old credentials. 

Instead of using the cloudadmin user to connect services to vCenter, the use of individual accounts for each service is recommended. For more information about setting up separate accounts for connected services, see [Access and Identity Concepts](./concepts-identity.md).

## Reset your vCenter credentials

1. From the Azure portal, open an Azure Cloud Shell session.

2. Update your vCenter *CloudAdmin* credentials.  Remember to replace **{SubscriptionID}**, **{ResourceGroup}**, and **{PrivateCloudName}** with your private cloud information. 

   ```azurecli-interactive
   az resource invoke-action --action rotateVcenterPassword --ids "/subscriptions/{SubscriptionID}/resourceGroups/{ResourceGroup}/providers/Microsoft.AVS/privateClouds/{PrivateCloudName}" --api-version "2020-07-17-preview"
   ```
 
## Update HCX Connector 

1. Go to the on-premises HCX Connector at https://{ip of the HCX connector appliance}:443 and sign in using the new credentials.

   Be sure to use port **443**. 

2. On the VMware HCX Dashboard, select **Site Pairing**.
    
   :::image type="content" source="media/tutorial-vmware-hcx/site-pairing-complete.png" alt-text="Screenshot of VMware HCX Dashboard with Site Pairing highlighted.":::
 
3. Select the correct connection to Azure VMware Solution and select **Edit Connection**.
 
4. Provide the new vCenter user credentials and select **Edit**, which saves the credentials. Save should show successful.


## Next steps

Now that you've covered resetting your vCenter credentials for Azure VMware Solution, you may want to learn about:

- [Integrating Azure native services in Azure VMware Solution](integrate-azure-native-services.md)
- [Deploying disaster recovery for Azure VMware Solution workloads using VMware HCX](deploy-disaster-recovery-using-vmware-hcx.md)
