---
title: Install VMware HCX in Azure VMware Solution
description: Install or uninstall VMware HCX in your Azure VMware Solution private cloud.
ms.topic: quickstart
ms.date: 06/28/2021
---

# Install VMware HCX in Azure VMware Solution

VMware HCX is an application mobility platform that is designed for simplifying application migration, workload rebalancing, and business continuity across data centers and clouds. 


VMware HCX Advanced Connector is no longer pre-deployed in Azure VMware Solution. You'll install it [what are the installation steps? I think the add-ons step is the "activation" piece of this.] and then enable it through the Azure portal as an add-on. VMware HCX Advanced Connector supports up to three site connections (on-premises to cloud, or cloud to cloud). If you need more than three site connections, use the [VMware HCX Enterprise](https://cloud.vmware.com/community/2019/08/08/introducing-hcx-enterprise/) add-on and then have it enabled through a [support request](https://portal.azure.com/#create/Microsoft.Support).




download the VMware HCX Connector OVA and then you'll deploy the virtual appliance to your on-premises vCenter





With VMware HCX, you can migrate your VMware workloads to Azure VMware Solution and other connected sites through various migration types. Because Azure VMware Solution deploys and configures HCX Cloud Manager, you must download, activate, and configure the HCX Connector in your on-premises VMware datacenter.



> [!IMPORTANT]
> Although the VMware Configuration Maximum tool describes site pairs maximum to be 25 between the on-premises HCX Connector and HCX Cloud Manager, licensing limits this to three for HCX Advanced and 10 for HCX Enterprise Edition.
>
> VMware HCX Enterprise is available with Azure VMware Solution as a preview service. It's free and is subject to terms and conditions for a preview service. After the VMware HCX Enterprise service is generally available, you'll get a 30-day notice that billing will switch over. You'll also have the option to turn off or opt out of the service. Downgrading from HCX Enterprise to HCX Advanced is possible without redeploying, but you'll have to log a support ticket for that action to take place. If planning a downgrade, make sure no migrations are scheduled and features such as RAV, MON are not in use.








>[!NOTE]
>When you uninstall VMware HCX, make sure you don't have any active migrations in progress.

Then, we'll walk through all the necessary procedures to:

> [!div class="checklist"]
> * Install VMware HCX from the Azure portal [is this being referred to as "add on"?]
> * Download the VMware HCX Connector OVA
> * Deploy the on-premises VMware HCX OVA (VMware HCX Connector)
> * Activate the VMware HCX Connector


[Prepare for HCX installations](https://docs.vmware.com/en/VMware-HCX/4.1/hcx-user-guide/GUID-A631101E-8564-4173-8442-1D294B731CEB.html)


## Install VMware HCX

[do they need to turn on the Early Access flag first?]

1. In your Azure VMware Solution private cloud, select **Manage** > **Add-ons**.

1. Select **Get started** for **HCX Workload Mobility**.

1. Select the **I agree with terms and conditions** checkbox and then **Install**.

   >[!TIP]
   >To enable HCX Enterprise, open a [support request](https://portal.azure.com/#create/Microsoft.Support).

1. 


## Download the VMware HCX Connector OVA

Before you deploy the virtual appliance to your on-premises vCenter, you must download the VMware HCX Connector OVA.

1. In the Azure portal, select the Azure VMware Solution private cloud.

1. Select **Manage** > **Connectivity** > **Settings** to identify the Azure VMware Solution HCX Manager's IP address.

<!--this image is out of date and it's out of place -->
   :::image type="content" source="media/tutorial-vmware-hcx/find-hcx-ip-address.png" alt-text="Screenshot of the VMware HCX IP address." lightbox="media/tutorial-vmware-hcx/find-hcx-ip-address.png":::

1. Select **Manage** > **Identity**.

<!-- I think this is where we pick up after they select **Install**. -->
   The URL for HCX Manager displays.

   > [!TIP]
   > The vCenter password was defined when you set up the private cloud. It's the same password you'll use to sign in to Azure VMware Solution HCX Manager. You can select **Generate a new password** to generate new vCenter and NSX-T passwords.

   :::image type="content" source="media/tutorial-access-private-cloud/ss4-display-identity.png" alt-text="Display private cloud vCenter and NSX Manager URLs and credentials." border="true":::

1. Open a browser window, sign in to the Azure VMware Solution HCX Manager on `https://x.x.x.9` port 443 with the **cloudadmin\@vsphere.local** user credentials

1. Select **Administration** > **System Updates** and then select **Request Download Link**.

1. Select the option of your choice to download the VMware HCX Connector OVA file.

## Deploy the VMware HCX Connector OVA on-premises

1. In your on-premises vCenter, select an [OVF template](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.vm_admin.doc/GUID-17BEDA21-43F6-41F4-8FB2-E01D275FE9B4.html) to deploy the VMware HCX Connector to your on-premises vCenter.

1. Navigate to and select the OVA file that you downloaded and then select **Open**.

   :::image type="content" source="media/tutorial-vmware-hcx/select-ovf-template.png" alt-text="Screenshot of browsing to an OVF template." lightbox="media/tutorial-vmware-hcx/select-ovf-template.png":::

1. Select a name and location, and select a resource or cluster where you're deploying the VMware HCX Connector. Then review the details and required resources and select **Next**.

1. Review license terms. If you agree, select the required storage and network, and then select **Next**.

1. Select storage and select **Next**.

1. Select the VMware HCX management network segment you previously defined in the [IP addresses prerequisites](#ip-addresses) section.  Then, select **Next**.

1. In **Customize template**, enter all required information and then select **Next**.

   :::image type="content" source="media/tutorial-vmware-hcx/customize-template.png" alt-text="Screenshot of the boxes for customizing a template." lightbox="media/tutorial-vmware-hcx/customize-template.png":::

1. Verify the configuration, and then select **Finish** to deploy the VMware HCX Connector OVA.

   > [!IMPORTANT]
   > You will need to turn on the virtual appliance manually.  After powering on, wait 10-15 minutes before proceeding to the next step.

For an end-to-end overview of this procedure, view the [Azure VMware Solution: HCX Appliance Deployment](https://www.youtube.com/embed/UKmSTYrL6AY) video.

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


   > [!IMPORTANT]
   > Whether you're using HCX Advanced or HCX Enterprise, you may need to install the patch from VMware's [KB article 81558](https://kb.vmware.com/s/article/81558).

## Next steps

In this tutorial, you've:

> [!div class="checklist"]
> * 
> * 
> * 

Continue to the next tutorial to configure the VMware HCX Connector.


> [!div class="nextstepaction"]
> [Configure VMware HCX in Azure VMware Solution](quickstart-configure-vmware-hcx.md)