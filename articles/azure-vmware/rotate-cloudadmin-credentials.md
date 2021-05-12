---
title: Rotate the cloudadmin credentials for Azure VMware Solution
description: Learn how to rotate the vCenter and NSX-T credentials for your Azure VMware Solution private cloud. 
ms.topic: how-to
ms.date: 05/28/2021

#Customer intent: As an Azure service administrator, I want to rotate my cloudadmin credentials so that the HCX Connector has the latest vCenter CloudAdmin and NSX-T admin credentials.

---

# Rotate the cloudadmin credentials for Azure VMware Solution

This article walks you through the steps to rotate the cloudadmin credentials (vCenter and NSX-T credentials) for your Azure VMware Solution private cloud.  Although the passwords for these accounts don't expire, you can generate new ones. After generating new passwords, you'll verify that the VMware HCX Connector has the latest credentials applied.

You can use your cloudadmin credentials for connected services like HCX, vRealize Orchestrator, vRealize Operations Manager, or VMware Horizon. To use your cloudadmin credentials for connected services, you must first [set up a connection to an external identity source](#set-up-connection-to-an-external-identity-source). If you don't have an external identity source, such as Active Directory, don't rotate your cloudadmin credentials. Rotating could break any connections using the vCenter or NSX-T credentials. It could also lock those accounts out, resulting in a security lockout.

You can also watch a video on how to [reset the vCenter CloudAdmin & NSX-T admin password](https://youtu.be/cK1qY3knj88). 

## Prerequisites

If you use your cloudadmin credentials for connected services, your connections stop working once you've updated the password. Stop these services before you rotate the password. Otherwise, you'll experience temporary locks on your accounts, as these services continuously call your old credentials.

## Set up connection to an external identity source
In this step, you'll set up a connection to an external identity source, in this case, LDAP, to create and manage credentials for use with connected services. 

1. Sign in to your Azure VMware Solution private cloud and select **Operations** > **Run Commands**.

   :::image type="content" source="media/rotate-cloudadmin-credentials/rotate-credentials-ldap-run-commands.png" alt-text="Screenshot showing the Operations Run Command for LDAP.":::

1. Select **LDAP** from the available commands.  This built-in command is not editable. 

1. Select **Run**. After the script finishes, it returns the output and any errors.


## Reset your Azure VMware Solution credentials

In this step, you'll reset the cloudadmin credentials for your Azure VMware Solution components.

1. In your Azure VMware Solution private cloud, select **Identity**.

1. Reset the **vCenter credentials**:

   1. Select **Generate new password**.

      :::image type="content" source="media/rotate-cloudadmin-credentials/reset-vcenter-credentials1.png" alt-text="Screenshot showing the vCenter credentials and a way to copy them or generate a new password.":::

   1. Select the confirmation checkbox and then select **Generate password**.

      :::image type="content" source="media/rotate-cloudadmin-credentials/reset-vcenter-credentials2.png" alt-text="Screenshot prompting confirmation to generate a new vCenter credentials.":::

1. Reset the **NSX-T Manager credentials**:

   1. Select **Generate new password**.

      :::image type="content" source="media/rotate-cloudadmin-credentials/reset-nsxt-manager-credentials1.png" alt-text="Screenshot showing the NSX-T Manager credentials and a way to copy them or generate a new password.":::

   1. Select the confirmation checkbox and then select **Generate password**.

      :::image type="content" source="media/rotate-cloudadmin-credentials/reset-nsxt-manager-credentials2.png" alt-text="Screenshot prompting confirmation to generate a new NSX-T Manager credentials.":::

## Verify HCX Connector has the latest credentials

In this step, you'll verify that the HCX Connector has the updated credentials.

>[!NOTE]
>HCX connector won't need your NSX-T admin account, but other services might, such as vRealize Operations Manager. You can add and configure an [NSX-T Adapter Instance to vRealize Operations Manager](https://docs.vmware.com/en/VMware-Validated-Design/5.1/sddc-deployment-of-vmware-nsx-t-workload-domains/GUID-A14D37FE-59AD-44E7-BB95-E3098F8B3640.html?hWord=N4IghgNiBcIHIGUAaBaAKgAgIIBMwAcAXAUwCcQBfIA).

1. Go to the on-premises HCX Connector at https://{ip of the HCX connector appliance}:443 and sign in using the new credentials.

   Be sure to use port 443. 

1. On the VMware HCX Dashboard, select **Site Pairing**.
    
   :::image type="content" source="media/rotate-cloudadmin-credentials/hcx-site-pairing.png" alt-text="Screenshot of VMware HCX Dashboard with Site Pairing highlighted.":::
 
1. Select the correct connection to Azure VMware Solution and select **Edit Connection**.
 
1. Provide the new vCenter Server CloudAdmin user credentials and select **Edit**, which saves the credentials. 


## Next steps

Now that you've rotated your cloudadmin credentials for Azure VMware Solution, you may want to learn about:

- [Configuring NSX network components in Azure VMware Solution](configure-nsx-network-components-azure-portal.md).
- [Monitoring and managing Azure VMware Solution VMs](lifecycle-management-of-azure-vmware-solution-vms.md).
- [Deploying disaster recovery of virtual machines using Azure VMware Solution](disaster-recovery-for-virtual-machines.md).
