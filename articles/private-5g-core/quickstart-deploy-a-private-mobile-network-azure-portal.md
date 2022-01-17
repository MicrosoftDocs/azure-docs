---
title: Quickstart - Deploy an example private mobile network - Azure portal
description: Quickstart showing how to deploy a private mobile network through Azure Private 5G Core Preview using the Azure portal 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: quickstart
ms.date: 12/30/2021
ms.custom: template-quickstart
---

# Quickstart: Deploy an example private mobile network - Azure portal

Azure Private 5G Core Preview is an Azure cloud service for service providers and system integrators to securely deploy and manage private mobile networks for enterprises on Azure Arc-connected edge platforms such as an Azure Stack Edge device. In this quickstart, you will use the Azure portal to deploy a simple private mobile network.

## Prerequisites

- Complete all of the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor role at the subscription scope.
- Ensure that you know the name of the **Azure Network Function Manager - Device** resource representing the Azure Stack Edge device you created as part of the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).
- Create an SSH keypair you can use to securely connect to the Kubernetes base VM. The private key must be on your local machine and you must have the public key available to place on the Kubernetes base VM as part of carrying out this quickstart. For more information on creating SSH keypairs, see [Detailed steps: Create and manage SSH keys for authentication to a Linux VM in Azure](/azure/virtual-machines/linux/create-ssh-keys-detailed).
- Request the stock keeping unit (SKU) for the version of the Kubernetes base VM you will deploy from your support representative.
- Request a product key from your support representative.

## Deploy the Mobile Network and Service resources

1. Sign in to the [Azure portal](https://aka.ms/PMNSPortal).
1. In the Search bar, type *mobile networks* and then select the **Mobile Networks** service from the results that appear.
:::image type="content" source="media\mobile-networks-search.png" alt-text="Screenshot of the Azure portal showing a search for the Mobile Networks service.":::
1. On the Mobile Networks page, click **Create**.
:::image type="content" source="media\create-button-mobile-networks.png" alt-text="Screenshot of the Azure portal showing the Create button on the Mobile Networks page.":::
1. On the **Basics** configuration tab, fill out the fields as follows.

   |Field  |Value  |
   |---------|---------|
   |**Subscription**                  |\<your subscription\>|
   |**Resource group**                |*Contoso*|
   |**Mobile network name**           |*ContosoPMN*|
   |**Region**                        |*East US*|
   |**Mobile country code (MCC)**     |*001*|
   |**Mobile country code (MCC)**     |*01*|
1. Once you have filled out all of the fields, click **Next : SIMs >**.
1. On the **SIMs** configuration tab, select the **Add SIMs later** radio button, and then click **Review + create**.
1. The Azure portal will now validate the configuration values you have entered. You should see a message indicating your values have passed validation. Click **Create** to create the private mobile network.
1. The Azure portal will now deploy your **Mobile Network** resource and default **Service** resource into the new resource group. You will see the following confirmation screen when the deployment is complete.
:::image type="content" source="media\pmn-deployment-complete.png" alt-text="Screenshot of the Azure portal showing the confirmation of a successful deployment of Mobile Network and Service resources.":::
1. Click on **Go to resource group**, and then check that your new resource group contains the correct **Mobile Network** and **Service** resources. Note that you may need to tick the **Show hidden types** checkbox to display all resources.
:::image type="content" source="media\pmn-deployment-resource-group.png" alt-text="Screenshot of the Azure portal showing a resource group containing Mobile Network and Service resources.":::
1. Click on the name of the **Mobile Network** resource and then move to the next step.

## Configure settings for the Site resource

1. On the **Get started** tab, click **Create sites**.
:::image type="content" source="media\create-sites-button.png" alt-text="Screenshot of the Azure portal showing the Get started tab, with the Create sites button highlighted.":::
1. On the **Basics** configuration tab, fill out the fields as follows.

   |Field  |Value  |
   |---------|---------|
   |**Subscription**         |\<your subscription\>|
   |**Resource group**       |*Contoso*|
   |**Mobile network name**  |*Site1*|
   |**Region**               |*East US*|
   |**Mobile network**       |*ContosoPMN*|
1. Click **Next - Packet core >**.
1. On the **Packet core** configuration tab, set the **Technology type** field to *5G*, and then leave the **Version** and **Custom location** fields blank.
1. Under the **Access network** heading, fill out the fields as follows.

   |Field  |Value  |
   |---------|---------|
   |**N2 address (signaling)** |*10.232.46.22*|
   |**N2 subnet**              |*10.232.46.0/27*|
   |**N2 gateway**             |*10.232.46.1*|
   |**N3 address**             |*10.232.46.23*|
   |**N3 subnet**              |*10.232.46.0/27*|
   |**N3 gateway**             |*10.232.46.1*|
   |**Tracking area codes**    |*0001*|
1. Under the **Attached data networks** heading, fill out the fields as follows.
   |Field  |Value  |
   |---------|---------|
   |**Data network** |*internet*|
   |**N6 address**   |*198.51.100.51*|
   |**N6 subnet**    |*198.51.100.0/24*|
   |**N6 gateway**   |*198.51.100.1*|
   |**UE subnet**    |*192.0.2.0/24*|
   |**NAPT**         |*Enabled*|
1. Click **Review + create**.
1. The Azure portal will now validate the configuration values you have entered. You should see a message indicating your values have passed validation. Click **Create** to create the site.
1. The Azure portal will now deploy a **Arc for network functions - Packet Core** resource representing the site's packet core instance into the resource group. You will see the following confirmation screen when the deployment is complete.
:::image type="content" source="media\site-deployment-complete.png" alt-text="Screenshot of the Azure portal showing the confirmation of a successful deployment of the Arc for network functions - Packet Core resource.":::
1. Click on **Go to resource group**, and then check that your new resource group contains the correct **Arc for network functions - Packet Core** resource. Note that you may need to tick the **Show hidden types** checkbox to display all resources. Once you have confirmed this, keep the resource group displayed in the Azure portal and move to the next step.

## Create the Kubernetes base VM

1. In the resource group, select the **Mobile network site** resource called **Site1 (ContosoPMN/Site1)**. Note that you may need to tick the **Show hidden types** checkbox to display this resource.
1. Click **Create a custom location**.
:::image type="content" source="media\create-a-custom-location.png" alt-text="Screenshot of the Azure portal showing the location of the Create a custom location option.":::
1. Under the **Project details** heading, fill out the fields as follows.

   |Field  |Value  |
   |---------|---------|
   |**Subscription**        |\<your subscription\>|
   |**Resource group**      |*Contoso*|
1. Under the **Instance details** heading, fill out the fields as follows.
   |Field  |Value  |
   |---------|---------|
   |**Name**         |*ContosoVM*|
   |**Region**       |*East US*|
   |**Vendor**       |*metaswitch*|
   |**Device**   |\<Azure Network Function Manager - Device resource name\>|
   |**Vendor SKU**    |\<Kubernetes base VM SKU\>|
   |**SSH public key for admin user (MecUser)**         |\<SSH public key\>|
1. Under the **Instance details** heading, fill out the fields as follows.
   |Field  |Value  |
   |---------|---------|
   |**IP address**   |*10.232.46.21*|
   |**Subnet**       |*10.232.46.0.24*|
   |**Vendor**       |*10.232.46.1*|
1. Click **Next - Legal**.
1. On the **Legal** tab, read the Terms of Use and Privacy Policy. If you agree with these, tick the **I have read and agree to the Terms of use and the Privacy policy** checkbox, and then click the **Review + create** tab.
1. The Azure portal will now validate the configuration values you have entered. You should see a message indicating your values have passed validation. Click **Create** to create the Kubernetes base VM.
1. Azure will now begin creating the Kubernetes base VM. This process takes approximately 15 minutes.

## Connect the Kubernetes cluster to Azure Arc

1. Open a command prompt and enter `ssh -i <SSHKeyPath> MecUser@10.232.46.21`, where *`<SSHKeyPath>`* is the filepath of the SSH private key.
1. Enter the passphrase for your SSH private key.
1. Select **Connect Azure Arc for Kubernetes** and press Enter.
1. Enter the subscription ID of your Azure subscription.
1. Enter *contoso-arc-rg* as the name of the new resource group that will be created.
1. Enter *contoso-arc* as your chosen prefix.
1. Enter *eastus* as your chosen region.
1. Enter *no* to confirm that you do not want to use an existing Log Analytics workspace for the Kubernetes cluster.
1. Enter *yes* to confirm you want to create a new Log Analytics workspace for the Kubernetes cluster.
1. Paste in the product key provided to you by your support representative.
1. Check your chosen configuration is correct and then press Y to proceed.
1. The Network Function Service Menu starts the Microsoft Azure Command Line Interface setup. You will see output resembling the following. Make a note of the code given in the output.

    ```text
    Logging in to Azure CLI.
    To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code <Code> to authenticate.
    ```

1. Open a web browser and navigate to [https://microsoft.com/devicelogin](https://microsoft.com/devicelogin).
1. Enter the code you retrieved from the Network Function Service Menu and click **Next**.
:::image type="content" source="media\azure-cross-platform-cli-enter-code.png" alt-text="Screenshot of the Azure Cross-Platform Command Line Interface prompting for a code.":::
1. Use your Azure account credentials to sign in to the Microsoft Azure Cross-platform Command Line Interface.
:::image type="content" source="media\azure-cross-platform-cli-sign-in.png" alt-text="Screenshot of the Azure Cross-Platform Command Line Interface sign in screen.":::
1. Click **Continue** to confirm that you want to sign in.
:::image type="content" source="media\azure-cross-platform-cli-confirmation.png" alt-text="Screenshot of the Azure Cross-Platform Command Line Interface showing a confirmation prompt for sign in.":::
1. When the Microsoft Azure Cross-platform Command Line Interface confirms that the sign in is complete, you can close your browser.
1. The Network Function Service Menu will now run through the process of connecting the Kubernetes cluster to Azure Arc. This takes approximately 5 minutes and comprises 7 stages. When this is complete, you will see output resembling the following.

```text
Completed setting up Packet Core prerequisites.
Completed stage 7/7.
Azure Arc enabling has completed successfully.
Resource Group: contoso-arc-rg
Connected Kubernetes Cluster: contoso-k8s-cluster
Custom Location: contoso-custom-loc
Done.
Logging out of Azure CLI.
Azure arc setup completed using the following properties.
Azure subscription ID: <SubscriptionID>
Azure resource group: contoso-arc-rg
Azure connected Kubernetes cluster: contoso-arc-k8s-cluster
Azure custom location: contoso-arc-custom-loc
Azure location: eastus
Log analytics workspace: contoso-arc-log
Product key: **********...
```

## Verify that the correct resources have been created and that the connection is active

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).
1. Search for *contoso-arc-rg* and select the resource group that appears.
1. Check the contents of the resource group to confirm that it contains **Custom Location**, **Kubernetes - Azure Arc**, and **Log Analytics workspace** resources.
1. Select the **Kubernetes - Azure Arc** resource and confirm that the **Status** field is set to **Connected**.
:::image type="content" source="media\kubernetes-azure-arc-resource.png" alt-text="Screenshot of the Azure portal showing the Status field on a Kubernetes - Azure Arc resource.":::

## Configure the custom location

1. In the Azure portal, search for *ContosoPMN* and select the Mobile Network resource that appears.
1. On the left side bar, click **Sites**.
1. Select **Site1**.
:::image type="content" source="media\select-site.png" alt-text="Screenshot of the Azure portal showing the available sites in the private mobile network.":::
1. Select **Configure a custom location**.
:::image type="content" source="media\configure-a-custom-location.png" alt-text="Screenshot of the Azure portal showing the Configure a custom location option.":::
1. On the **Configuration** tab, select **contoso-arc-custom-loc** from the **Custom ARC location** drop down menu.
1. Click **Apply**.
1. Return to the **Site1** resource and confirm that the **Edge custom location** field is now set to **contoso-arc-custom-loc**.
:::image type="content" source="media\configured-custom-location.png" alt-text="Screenshot of the Azure portal showing a correctly configured custom location on a site.":::

You've now fully deployed the example private mobile network.

## Clean up resources

You can now remove your example private mobile network by deleting resources as follows.

<!-- 8. Need to also cover the Azure ARC RG. 
-->

1. In the Azure portal, search for *contoso* and select the resource group that appears.
1. Tick the **Show hidden types** checkbox.
1. Delete the resource types in the following order.
    - **microsoft.mobilenetwork/packetcorecontrolplanes/packetcoredataplanes/attacheddatanetworks**
    - **microsoft.mobilenetwork/packetcorecontrolplanes/packetcoredataplanes**
    - **Arc for network functions – Packet Core**
    - **Mobile Network Site**
    - **Mobile Network**

## Next steps

Collect the information you'll need to deploy your own private mobile network.
> [!div class="nextstepaction"]
> [Next steps button](collect-required-information-for-private-mobile-network.md)