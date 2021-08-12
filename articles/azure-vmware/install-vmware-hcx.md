---
title: Install VMware HCX in Azure VMware Solution
description: Install VMware HCX in your Azure VMware Solution private cloud.
ms.topic: how-to
ms.date: 08/12/2021
---

# Install and activate VMware HCX in Azure VMware Solution

VMware HCX Advanced and its associated Cloud Manager are no longer pre-deployed in Azure VMware Solution. Instead, you'll need to install it through the Azure portal as an add-on. The default is HCX Advanced, after which you can still request VMware HCX Enterprise Edition through support if you need the features in the Enterprise edition. You'll still download the HCX Connector OVA and deploy the virtual appliance on your on-premises vCenter.

HCX Advanced supports up to three site connections (on-premises to cloud or cloud to cloud). If you need more than three site connections, use HCX Enterprise Edition. To activate HCX Enterprise Edition, which is currently in public preview on Azure VMware Solution, open a support request to have it enabled. Once the service is generally available, you'll have 30 days to decide on your next steps. You can also turn off or opt-out of the HCX Enterprise Edition service but keep HCX Advanced as it's part of the node cost.

Downgrading from HCX Enterprise Edition to HCX Advanced is possible without redeploying. First, ensure you’ve reverted to an HCX Advanced configuration state and not using the Enterprise features. If you plan to downgrade, ensure that no scheduled migrations, features like RAV and MON aren't in use, and site pairings are three or fewer.

>[!TIP]
>You can also [uninstall HCX Advanced](#uninstall-hcx-advanced) through the portal. When you uninstall HCX Advanced, make sure you don't have any active migrations in progress. Removing HCX Advanced returns the resources to your private cloud occupied by the HCX virtual appliances.

In this how-to, you'll:

* Install HCX Advanced through the Azure portal
* Download and deploy the VMware HCX Connector OVA
* Activate HCX Advanced with a license key
* Uninstall HCX Advanced

After you're finished, follow the recommended next steps at the end to continue with the steps of this getting started guide.

## Prerequisites

- [Prepare for HCX installations](https://docs.vmware.com/en/VMware-HCX/4.1/hcx-user-guide/GUID-A631101E-8564-4173-8442-1D294B731CEB.html)

- [VMware blog series - cloud migration](https://blogs.vmware.com/vsphere/2019/10/cloud-migration-series-part-2.html)


## Install VMware HCX Advanced

1. In your Azure VMware Solution private cloud, select **Manage** > **Add-ons**.

1. Select **Get started** for **HCX Workload Mobility**.

   :::image type="content" source="media/tutorial-vmware-hcx/deployed-hcx-migration-get-started.png" alt-text="Screenshot showing the Get started button for HCX Workload Mobility.":::

1. Select the **I agree with terms and conditions** checkbox and then select **Install**.

   It takes around 35 minutes to install HCX Advanced and configure the Cloud Manager. Once installed, the HCX Manager URL and the HCX keys needed for the HCX on-premises connector site pairing display on the **Migration using HCX** tab.

   :::image type="content" source="media/tutorial-vmware-hcx/deployed-hcx-migration-using-hcx-tab.png" alt-text="Screenshot showing the Migration using HCX tab under Connectivity.":::


## Download and deploy the VMware HCX Connector OVA 

In this step, you'll download the VMware HCX Connector OVA file, and then you'll deploy the VMware HCX Connector to your on-premises vCenter.

1. Open a browser window, sign in to the Azure VMware Solution HCX Manager on `https://x.x.x.9` port 443 with the **cloudadmin\@vsphere.local** user credentials

1. Under **Administration** > **System Updates**, select **Request Download Link**. If the box is greyed, wait a few seconds for it to generate a link.

1. Either download or receive a link for the VMware HCX Connector OVA file you deploy on your local vCenter.

1. In your on-premises vCenter, select an [OVF template](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.vm_admin.doc/GUID-17BEDA21-43F6-41F4-8FB2-E01D275FE9B4.html) to deploy the VMware HCX Connector to your on-premises vCenter.

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

1. Sign in to the on-premises VMware HCX Manager at `https://HCXManagerIP:9443` with the **admin** credentials.  Make sure to include the `9443` port number with the VMware HCX Manager IP address.

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
   >The vCenter server is where you deployed the VMware HCX Connector in your datacenter.

1. 8.	In **Configure SSO/PSC**, provide your Platform Services Controller's FQDN or IP address, and select **Continue**.

   >[!NOTE]
   >Typically, it's the same as your vCenter FQDN or IP address.

1. Verify that the information entered is correct and select **Restart**.

   >[!NOTE]
   >You'll experience a delay after restarting before being prompted for the next step.

After the services restart, you'll see vCenter showing as green on the screen that appears. Both vCenter and SSO must have the appropriate configuration parameters, which should be the same as the previous screen.

:::image type="content" source="media/tutorial-vmware-hcx/activation-done.png" alt-text="Screenshot of the dashboard with green vCenter status." lightbox="media/tutorial-vmware-hcx/activation-done.png":::


## Uninstall HCX Advanced

You can uninstall HCX Advanced through the portal, which removes the existing pairing and software. 

>[!NOTE]
>It could take approximately 30 minutes to return the resources to your private cloud occupied by the HCX virtual appliances. 

1. Make sure you don't have any active migrations in progress.

1. Ensure that L2 extensions are no longer needed or the networks have been "unstretched" to the destination. 

1. 3.	For workloads using MON, ensure that you’ve removed the default gateways. Otherwise, it may result in workloads not being able to communicate or function.  

1.  In your Azure VMware Solution private cloud, select **Manage** > **Add-ons**.

2. Select **Get started** for **HCX Workload Mobility** then select to "uninstall".

   
1. Enter **yes** to confirm the uninstall.

At this point, HCX Advanced will no longer have the vCenter plugin, and if needed, you can reinstall it at any time.


## Next steps

Continue to the next tutorial to configure the VMware HCX Connector.  After you've configured the VMware HCX Connector, you'll have a production-ready environment for creating virtual machines (VMs) and migration. 


>[!div class="nextstepaction"]
>[Configure VMware HCX in Azure VMware Solution](configure-vmware-hcx.md)
