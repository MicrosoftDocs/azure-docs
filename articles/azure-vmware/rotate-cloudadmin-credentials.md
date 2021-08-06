---
title: Rotate the cloudadmin credentials for Azure VMware Solution
description: Learn how to rotate the vCenter and NSX-T credentials for your Azure VMware Solution private cloud. 
ms.topic: how-to
ms.date: 06/28/2021

#Customer intent: As an Azure service administrator, I want to rotate my cloudadmin credentials so that the HCX Connector has the latest vCenter CloudAdmin and NSX-T admin credentials.

---

# Rotate the cloudadmin credentials for Azure VMware Solution

In this article, you'll rotate the cloudadmin credentials (vCenter and NSX-T credentials) for your Azure VMware Solution private cloud.  Although the passwords for these accounts don't expire, you can generate new ones. After generating new passwords, you'll update VMware HCX Connector with the latest credentials. You can use your cloudadmin credentials for connected services like backup and disaster recovery appliances, VMware HCX, or any vRealize suite products. 



## Prerequisites

- If you use your cloudadmin credentials for connected services, your connections stop working once you've updated the password. Stop these services before you rotate the password. Otherwise, you'll experience temporary locks on your accounts, as these services continuously call your old credentials. 

- If you use your cloudadmin credentials for connected services, make sure to [set up a connection to an external identity source (LDAP)](connect-external-identity-source-ldap-run-command.md). An external identity source lets you create and manage credentials used by connected services. If you don't have an external identity source, rotating could break any connections that use the vCenter or NSX-T credentials. It could also lock out those accounts, resulting in a security lockout.


## Reset your Azure VMware Solution cloudadmin credentials

In this step, you'll reset the cloudadmin credentials for your Azure VMware Solution components.

1. In your Azure VMware Solution private cloud, select **Identity**.

1. Reset the **vCenter credentials**:

   1. Select **Generate new password**.

      :::image type="content" source="media/rotate-cloudadmin-credentials/reset-vcenter-credentials-1.png" alt-text="Screenshot showing the vCenter credentials and a way to copy them or generate a new password.":::

   1. Select the confirmation checkbox and then select **Generate password**.

      :::image type="content" source="media/rotate-cloudadmin-credentials/reset-vcenter-credentials-2.png" alt-text="Screenshot prompting confirmation to generate a new vCenter credential.":::

1. Reset the **NSX-T Manager credentials**:

   1. Select **Generate new password**.

      :::image type="content" source="media/rotate-cloudadmin-credentials/reset-nsxt-manager-credentials-1.png" alt-text="Screenshot showing the NSX-T Manager credentials and a way to copy them or generate a new password.":::

   1. Select the confirmation checkbox and then select **Generate password**.

      :::image type="content" source="media/rotate-cloudadmin-credentials/reset-nsxt-manager-credentials-2.png" alt-text="Screenshot prompting confirmation to generate a new NSX-T Manager credential.":::


## Update HCX Connector with the latest cloudadmin credentials

In this step, you'll update HCX Connector with the new credentials.

>[!NOTE]
>HCX connector won't need your NSX-T admin account, but other services might, such as vRealize Operations Manager. You can add and configure an [NSX-T Adapter Instance to vRealize Operations Manager](https://docs.vmware.com/en/VMware-Validated-Design/5.1/sddc-deployment-of-vmware-nsx-t-workload-domains/GUID-A14D37FE-59AD-44E7-BB95-E3098F8B3640.html?hWord=N4IghgNiBcIHIGUAaBaAKgAgIIBMwAcAXAUwCcQBfIA).

1. Go to the on-premises HCX Connector at https://*{ip of the HCX connector appliance}*:443 and sign in using the new credentials.

   Be sure to use port 443. 

1. On the VMware HCX Dashboard, select **Site Pairing**.
    
   :::image type="content" source="media/rotate-cloudadmin-credentials/hcx-site-pairing.png" alt-text="Screenshot of VMware HCX Dashboard with Site Pairing highlighted.":::
 
1. Select the correct connection to Azure VMware Solution and select **Edit Connection**.
 
1. Provide the new vCenter Server CloudAdmin user credentials and select **Edit**, which saves the credentials. 


## Next steps

Now that you've rotated your cloudadmin credentials for Azure VMware Solution, you may want to learn about:

- [Integrating Azure native services in Azure VMware Solution](integrate-azure-native-services.md)
- [Deploying disaster recovery for Azure VMware Solution workloads using VMware HCX](deploy-disaster-recovery-using-vmware-hcx.md)
