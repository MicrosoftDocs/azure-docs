---
title: Install and activate VMware HCX in Azure VMware Solution
description: Install VMware HCX in your Azure VMware Solution private cloud.
ms.topic: how-to
ms.service: azure-vmware
ms.custom: engagement-fy23
ms.date: 12/05/2022
---

# Install and activate VMware HCX in Azure VMware Solution

[VMware HCX](https://docs.vmware.com/en/VMware-HCX/index.html) is an application mobility platform designed for simplifying application migration, rebalancing workloads, and optimizing disaster recovery across data centers and clouds. 

VMware HCX has two component services: **HCX Cloud Manager** and **HCX Connector**. These components work together for HCX operations.  

In this article, you'll learn how to install and activate the VMware HCX Cloud Manager and VMware HCX Connector components. 

HCX Cloud manager is typically deployed as the destination (cloud side), but it can also be used as the source in cloud-to-cloud deployments. HCX Connector is deployed at the source (on-premises environment). A download link is provided for deploying HCX Connector appliance from within the HCX Cloud Manager. 

In this how-to, you'll:

* Install VMware HCX Cloud through the Azure portal.
* Download and deploy the VMware HCX Connector in on-premises.
* Activate VMware HCX with a license key.

After HCX is deployed, follow the recommended [Next steps](#next-steps). 

## Prerequisite

- See [Prepare for HCX installations](https://docs.vmware.com/en/VMware-HCX/4.1/hcx-user-guide/GUID-A631101E-8564-4173-8442-1D294B731CEB.html)

## Install VMware HCX Cloud

1. In your Azure VMware Solution private cloud, select **Manage** > **Add-ons**.

1. Select **Get started** for **HCX Workload Mobility**.

   :::image type="content" source="media/tutorial-vmware-hcx/deployed-hcx-migration-get-started.png" alt-text="Screenshot showing the Get started button for HCX Workload Mobility.":::

1. Select the **I agree with terms and conditions** checkbox and then select **Install**.

    Once installed, you'll see the HCX Cloud Manager URL and the HCX keys required for the HCX on-premises connector site pairing on the **Migration using HCX** tab.

    > [!IMPORTANT]
    > If you don't see the HCX key after installing, click the **ADD** button to generate the key which you can then use for site pairing.

   :::image type="content" source="media/tutorial-vmware-hcx/deployed-hcx-migration-using-hcx-tab.png" alt-text="Screenshot showing the Migration using HCX tab under Connectivity.":::

## HCX license edition 

HCX offers various [services](https://docs.vmware.com/en/VMware-HCX/4.5/hcx-user-guide/GUID-32AF32BD-DE0B-4441-95B3-DF6A27733EED.html#GUID-32AF32BD-DE0B-4441-95B3-DF6A27733EED) based on the type of license installed with the system. Advanced delivers basic connectivity and mobility services to enable hybrid interconnect and migration services. HCX Enterprise offers more services than what standard licenses provide, such as Mobility Groups, Replication assisted vMotion (RAV), Mobility Optimized Networking, Network Extension High availability, OS assisted Migration, etc. 

>[!Note]
> VMware HCX Enterprise is available for Azure VMware Solution customers at no additional cost.  

- After HCX is deployed, you can upgrade the license from Advanced to Enterprise using a [support request](https://rc.portal.azure.com/#create/Microsoft.Support) to have HCX Enterprise Edition enabled. 
- Downgrading from HCX Enterprise Edition to HCX Advanced is possible without redeploying. First, ensure you've reverted to an HCX Advanced configuration state and you aren't using the Enterprise features. If you plan to downgrade, ensure that no scheduled migrations, [Enterprise services](https://docs.vmware.com/en/VMware-HCX/4.5/hcx-user-guide/GUID-32AF32BD-DE0B-4441-95B3-DF6A27733EED.html#GUID-32AF32BD-DE0B-4441-95B3-DF6A27733EED) like RAV and HCX MON, etc. aren't in use. Open a [support request](https://rc.portal.azure.com/#create/Microsoft.Support) to request downgrade. 

## Download and deploy the VMware HCX Connector in on-premises 

In this step, you'll download the VMware HCX Connector OVA file, and then you'll deploy the VMware HCX Connector to your on-premises vCenter Server. 

1. Open a browser window, sign in to the Azure VMware Solution HCX Manager on `https://x.x.x.9` port 443 with the **cloudadmin\@vsphere.local** user credentials 

 

1. Under **Administration** > **System Updates**, select **Request Download Link**. If the box is greyed, wait a few seconds for it to generate a link. 

 

1. Either download or receive a link for the VMware HCX Connector OVA file you deploy on your local vCenter Server. 
1. In your on-premises vCenter Server, select an [OVF template](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.vm_admin.doc/GUID-17BEDA21-43F6-41F4-8FB2-E01D275FE9B4.html) to deploy the VMware HCX Connector to your on-premises vSphere cluster. 
1. Navigate to and select the OVA file that you downloaded and then select **Open**. 

   :::image type="content" source="media/tutorial-vmware-hcx/select-ovf-template.png" alt-text="Screenshot of browsing to an OVF template." lightbox="media/tutorial-vmware-hcx/select-ovf-template.png"::: 

1. Select a name and location, and select a resource or cluster where you're deploying the VMware HCX Connector. Then review the details and required resources and select **Next**. 
1. Review license terms, select the required storage and network, and then select **Next**. 

1. Select the [VMware HCX management network segment](plan-private-cloud-deployment.md#define-vmware-hcx-network-segments) that you defined during the planning state. Then select **Next**.   
1. In **Customize template**, enter all required information and then select **Next**. 

 

   :::image type="content" source="media/tutorial-vmware-hcx/customize-template.png" alt-text="Screenshot of the boxes for customizing a template." lightbox="media/tutorial-vmware-hcx/customize-template.png"::: 

 
1. Verify and then select **Finish** to deploy the VMware HCX Connector OVA. 
   >[!IMPORTANT] 
   >You will need to turn on the virtual appliance manually.  After powering on, wait 10-15 minutes before proceeding to the next step. 

## Activate VMware HCX 

After deploying the VMware HCX Connector OVA on-premises and starting the appliance, you're ready to activate it. First, you'll need to get a license key from the Azure VMware Solution portal, and then you'll activate it in VMware HCX Manager. Finally, you’ll need a key for each on-premises HCX connector deployed. 

1. In your Azure VMware Solution private cloud, select **Manage** > **Add-ons** > **Migration using HCX**. Then copy the **Activation key**. 

   :::image type="content" source="media/tutorial-vmware-hcx/hcx-activation-key.png" alt-text="Screenshot showing the activation key.":::    

1. Sign in to the on-premises VMware HCX Manager at `https://HCXManagerIP:9443` with the `admin` credentials.  Make sure to include the `9443` port number with the VMware HCX Manager IP address.

   >[!TIP]
   >You defined the **admin** user password during the VMware HCX Manager OVA file deployment. 

1. In **Licensing**, enter your key for **HCX Advanced Key** and select **Activate**. 
    >[!IMPORTANT] 
    >VMware HCX Manager must have open internet access or a proxy configured. 
1. In **Datacenter Location**, provide the nearest location for installing the VMware HCX Manager on-premises. Then select **Continue**. 
1. In **System Name**, modify the name or accept the default and select **Continue**. 
1. Select **Yes, Continue**. 
1. In **Connect your vCenter**, provide the FQDN or IP address of your vCenter server and the appropriate credentials, and then select **Continue**. 
   >[!TIP] 
   >The vCenter Server is where you deployed the VMware HCX Connector in your datacenter. 

1. In **Configure SSO/PSC**, provide your Platform Services Controller's FQDN or IP address, and select **Continue**. 
   >[!NOTE] 
   >Typically, it's the same as your vCenter Server FQDN or IP address. 
1. Verify that the information entered is correct and select **Restart**. 
   >[!NOTE] 
   >You'll experience a delay after restarting before being prompted for the next step. 

After the services restart, you'll see vCenter Server displayed as green on the screen that appears. Both vCenter Server and SSO must have the appropriate configuration parameters, which should be the same as the previous screen. 

:::image type="content" source="media/tutorial-vmware-hcx/activation-done.png" alt-text="Screenshot of the dashboard with green vCenter status." lightbox="media/tutorial-vmware-hcx/activation-done.png"::: 

## Next steps 
Continue to the next tutorial to configure the VMware HCX Connector.  After you've configured the VMware HCX Connector, you'll have a production-ready environment for creating virtual machines (VMs) and migration.  


>[!div class="nextstepaction"] 

>[Configure VMware HCX in Azure VMware Solution](configure-vmware-hcx.md) 

>[VMware blog series - cloud migration](https://blogs.vmware.com/vsphere/2019/10/cloud-migration-series-part-2.html) 

>[Uninstall VMware HCX in Azure VMware Solution](uninstall-vmware-hcx.md)
















