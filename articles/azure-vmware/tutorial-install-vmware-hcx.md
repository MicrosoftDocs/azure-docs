---
title: Install VMware HCX in Azure VMware Solution
description: Install VMware HCX in your Azure VMware Solution private cloud.
ms.topic: tutorial
ms.date: 06/28/2021
---

# Install VMware HCX in Azure VMware Solution

VMware HCX Advanced Connector is no longer pre-deployed in Azure VMware Solution. You'll install it through the Azure portal as an add-on. You'll still download the VMware HCX Connector OVA and deploy the virtual appliance to your on-premises vCenter. 

VMware HCX Advanced Connector supports up to three site connections (on-premises to cloud, or cloud to cloud).  If you need more than three site connections, use [VMware HCX Enterprise](https://cloud.vmware.com/community/2019/08/08/introducing-hcx-enterprise/). Open a [support request](https://portal.azure.com/#create/Microsoft.Support) to have HCX Enterprise enabled. It's free and is subject to terms and conditions for a preview service. After the VMware HCX Enterprise service is generally available, you'll get a 30-day notice that billing will switch over. You'll also have the option to turn off or opt out of the service. Downgrading from HCX Enterprise to HCX Advanced is possible without redeploying, so you'll need to open a support ticket. If planning a downgrade, make sure no migrations are scheduled and features such as RAV, MON are not in use.


>[!TIP]
>You can also uninstall VMware HCX Advanced Connector through the portal. When you uninstall VMware HCX, make sure you don't have any active migrations in progress.


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Install VMware HCX through the Azure portal
> * Download and deploy the VMware HCX Connector OVA
> * Activate VMware HCX with a license key

After you're finished, follow the recommended next steps at the end to continue with the steps of this getting started guide.

## Prerequisites

* [Prepare for HCX installations](https://docs.vmware.com/en/VMware-HCX/4.1/hcx-user-guide/GUID-A631101E-8564-4173-8442-1D294B731CEB.html)
* [VMware blog series - cloud migration](https://blogs.vmware.com/vsphere/2019/10/cloud-migration-series-part-2.html)


## Install VMware HCX 

[do they need to turn on the Early Access flag first?]

1. In your Azure VMware Solution private cloud, select **Manage** > **Add-ons**.

1. Select **Get started** for **HCX Workload Mobility**.

1. Select the **I agree with terms and conditions** checkbox and then select **Install**.

   It could take up to 30 minutes to install VMware HCX, and once installed, the HCX Manager URL displays.


## Download and deploy the VMware HCX Connector OVA 

In this step, you'll download the VMware HCX Connector OVA file and then you'll deploy the VMware HCX Connector to your on-premises vCenter.

1. Open a browser window, sign in to the Azure VMware Solution HCX Manager on `https://x.x.x.9` port 443 with the **cloudadmin\@vsphere.local** user credentials

1. Select **Administration** > **System Updates** and then select **Request Download Link**.

1. Select the option of your choice to download the VMware HCX Connector OVA file.

1. In your on-premises vCenter, select an [OVF template](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.vm_admin.doc/GUID-17BEDA21-43F6-41F4-8FB2-E01D275FE9B4.html) to deploy the VMware HCX Connector to your on-premises vCenter.

1. Navigate to and select the OVA file that you downloaded and then select **Open**.

   :::image type="content" source="media/tutorial-vmware-hcx/select-ovf-template.png" alt-text="Screenshot of browsing to an OVF template." lightbox="media/tutorial-vmware-hcx/select-ovf-template.png":::

1. Select a name and location, and select a resource or cluster where you're deploying the VMware HCX Connector. Then review the details and required resources and select **Next**.

1. Review license terms, select the required storage and network, and then select **Next**.

1. Select storage and select **Next**. [huh? is this the same as the previous step?]

1. Select the [VMware HCX management network segment](tutorial-plan-private-cloud-deployment.md#define-vmware-hcx-network-segments) that you defined during the planning state. Then select **Next**.  

1. In **Customize template**, enter all required information and then select **Next**.

   :::image type="content" source="media/tutorial-vmware-hcx/customize-template.png" alt-text="Screenshot of the boxes for customizing a template." lightbox="media/tutorial-vmware-hcx/customize-template.png":::

1. Verify and then select **Finish** to deploy the VMware HCX Connector OVA.

   > [!IMPORTANT]
   > You will need to turn on the virtual appliance manually.  After powering on, wait 10-15 minutes before proceeding to the next step.

<!--video is now out of date  
For an end-to-end overview of this procedure, view the [Azure VMware Solution: HCX Appliance Deployment](https://www.youtube.com/embed/UKmSTYrL6AY) video.
-->

## Activate VMware HCX

After you deploy the VMware HCX Connector OVA on-premises and start the appliance, you're ready to activate. First, you need to get a license key from the Azure VMware Solution portal.

1. In the Azure VMware Solution portal, go to **Manage** > **Connectivity**, select the **HCX** tab, and then select **Add**.

1. Use the **admin** credentials to sign in to the on-premises VMware HCX Manager at `https://HCXManagerIP:9443`.  Make sure to include the `9443` port number with the VMware HCX Manager IP address.

   > [!TIP]
   > You defined the **admin** user password during the VMware HCX Manager OVA file deployment.

1. In **Licensing**, enter your key for **HCX Advanced Key** and select **Activate**.

    > [!IMPORTANT]
    > VMware HCX Manager must have open internet access or a proxy configured.

1. In **Datacenter Location**, provide the nearest location for installing the VMware HCX Manager on-premises. Then select **Continue**.

1. In **System Name**, modify the name or accept the default and select **Continue**.

1. Select **Yes, Continue**.

1. In **Connect your vCenter**, provide the FQDN or IP address of your vCenter server and the appropriate credentials, and then select **Continue**.

   > [!TIP]
   > The vCenter server is where you deployed the VMware HCX Connector in your datacenter.

1. In **Configure SSO/PSC**, provide the FQDN or IP address of your Platform Services Controller, and then select **Continue**.

   > [!NOTE]
   > Typically, it's the same as your vCenter FQDN or IP address.

1. Verify that the information entered is correct and select **Restart**.

   > [!NOTE]
   > You'll experience a delay after restarting before being prompted for the next step.

After the services restart, you'll see vCenter showing as green on the screen that appears. Both vCenter and SSO must have the appropriate configuration parameters, which should be the same as the previous screen.

:::image type="content" source="media/tutorial-vmware-hcx/activation-done.png" alt-text="Screenshot of the dashboard with green vCenter status." lightbox="media/tutorial-vmware-hcx/activation-done.png":::

>[!IMPORTANT]
>Whether you're using HCX Advanced or HCX Enterprise, you may need to install the patch from VMware's [KB article 81558](https://kb.vmware.com/s/article/81558).

## Next steps

Continue to the next tutorial to configure the VMware HCX Connector.


>[!div class="nextstepaction"]
>[Configure VMware HCX in Azure VMware Solution](tutorial-configure-vmware-hcx.md)