---
title: Deploy a private mobile network through Azure Private 5G Core - Azure portal
description: How-to guide showing how to deploy a private mobile network through Azure Private 5G Core Preview using the Azure portal 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 01/03/2021
ms.custom: template-how-to
---

# Deploy a private mobile network through Azure Private 5G Core - Azure portal

Azure Private 5G Core Preview is an Azure cloud service for service providers and system integrators to securely deploy and manage private mobile networks for enterprises on Azure Arc-connected edge platforms such as an Azure Stack Edge device. In this how-to guide, you will use the Azure portal to deploy a private mobile network to match your enterprise's requirements.

You'll create the following as part of this how-to guide.

- The Mobile Network resource representing your private mobile network as a whole.
- The Site resource representing the physical enterprise location of your Azure Stack Edge device, which will host the packet core instance.
- (Optionally) SIM resources representing the physical SIMs or eSIMs that will be served by the private mobile network.
- The Kubernetes base VM that will run on the Azure Stack Edge device in the site. This serves as the platform for the Kubernetes cluster that will run the packet core instance.

You will also connect the Kubernetes cluster that runs your packet core instance to Azure Arc. Azure Arc enabled Kubernetes allows you to manage the Kubernetes cluster directly from Azure.

## Prerequisites

- Complete all of the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor role at the subscription scope.
- Collect all of the information listed in [Collect the required information to deploy a private mobile network - Azure portal](collect-required-information-for-private-mobile-network.md).
- If you decided when collecting the information in [Collect the required information to deploy a private mobile network - Azure portal](collect-required-information-for-private-mobile-network.md) that you wanted to provision SIMs using a JSON file as part of deploying your private mobile network, you must have prepared this file and made it available on the machine you will use to access the Azure portal. You can find more information on the format of this file in [Provisioning SIM resources through the Azure portal using a JSON file](collect-required-information-for-private-mobile-network.md#provisioning-sim-resources-through-the-azure-portal-using-a-json-file) if necessary.
- Ensure that the private key of the SSH keypair you will use to securely connect to the Kubernetes base VM is available on your local machine and that you know its filepath. You created this SSH keypair as part of [Collect the required information to deploy a private mobile network - Azure portal](collect-required-information-for-private-mobile-network.md).
- Request a product key from your support representative.
- Decide on the Log Analytics workspace you want to use for the Kubernetes cluster. For more information on Log Analytics, see [Overview of Log Analytics in Azure Monitor](/azure/azure-monitor/logs/log-analytics-overview). You can choose from the following options.
  - A new Log Analytics workspace, which you will create as part of this procedure.
  - An existing Log Analytics workspace. If you select this option, you must know the resource ID of your chosen Log Analytics workspace. You can find this by navigating to the Log Analytics workspace in the Azure portal, selecting **Properties** from the left hand menu and then copying the value of the **Resource ID** field.
  - The default Log Analytics workspace for your subscription in the Azure region in which you are creating the resources for your private mobile network.

## Create the Mobile Network and (optionally) SIM resources
In this step, you will create the Mobile Network resource representing your private mobile network as a whole. You can also provision one or more SIMs.

1. Sign in to the Azure portal at [https://aka.ms/PMNSPortal](https://aka.ms/PMNSPortal).
1. In the Search bar, type *mobile networks* and then select the **Mobile Networks** service from the results that appear.

    :::image type="content" source="media\mobile-networks-search.png" alt-text="Screenshot of the Azure portal showing a search for the Mobile Networks service.":::

1. On the Mobile Networks page, click **Create**.

    :::image type="content" source="media\create-button-mobile-networks.png" alt-text="Screenshot of the Azure portal showing the Create button on the Mobile Networks page.":::

1. Use the information you collected in [Collect private mobile network resource configuration values](collect-required-information-for-private-mobile-network.md#collect-private-mobile-network-resource-configuration-values) to fill out the fields on the **Basics** configuration tab. Once you have done this, click **Next : SIMs >**.

    :::image type="content" source="media\how-to-guide-deploy-a-private-mobile-network-azure-portal\create-private-mobile-network-basics-tab.png" alt-text="Screenshot of the Azure portal showing the Basics configuration tab.":::

1. On the SIMs configuration tab, select your chosen input method by clicking the appropriate radio button next to **How would you like to input the SIMs information?**. You can then input the information you collected in [Collect SIM resource values](collect-required-information-for-private-mobile-network.md#collect-sim-resource-configuration-values).

    :::image type="content" source="media\how-to-guide-deploy-a-private-mobile-network-azure-portal\create-private-mobile-network-sims-tab.png" alt-text="Screenshot of the Azure portal showing the SIMs configuration tab.":::

    - If you select **Upload JSON file**, the **Upload SIM profile configurations** field will appear. Use this field to upload your chosen JSON file.
    - If you select **Add manually**, a new set of fields will appear under **Enter SIM profile configurations**. Fill out the first row of these fields with the correct settings for the first SIM you want to provision. If you have further SIMs you want to provision, add the settings for each of these SIMs to a new row.
    - If you decided that you do not want to provision any SIMs at this point, select **Add SIMs later**.
1. Once you have selected the appropriate radio button and provided information for any SIMs you want to provision, click **Review + create**.
1. Azure will now validate the configuration values you have entered. You should see a message indicating that your values have passed validation, as shown below.

    :::image type="content" source="media\how-to-guide-deploy-a-private-mobile-network-azure-portal\create-private-mobile-network-review-create-tab.png" alt-text="Screenshot of the Azure portal showing validated configuration for a private mobile network.":::

If the validation fails, you will see an error message and the configuration tab(s) containing the invalid configuration will be flagged with red dots. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.
1. Once the configuration has been validated, click **Create** to create the private mobile network resource and any SIM resources.
1. The Azure portal will now deploy the resources into your chosen resource group. You will see the following confirmation screen when your deployment is complete.

    :::image type="content" source="media\pmn-deployment-complete.png" alt-text="Screenshot of the Azure portal showing the confirmation of a successful deployment of Mobile Network and Service resources.":::

    Click on **Go to resource group**, and then check that your new resource group contains the correct **Mobile Network** resource, any **SIM** resources, and a default **Service** resource named **Allow-all-traffic**. Note that you may need to tick the **Show hidden types** checkbox to display all resources.

    :::image type="content" source="media\pmn-deployment-resource-group.png" alt-text="Screenshot of the Azure portal showing a resource group containing Mobile Network and Service resources.":::

1. Once you have confirmed that the correct resources are displayed, click on the name of the **Mobile Network** resource and move to the next step.

## Create the site resource

In this step, you will create the site resource representing the physical enterprise location of your Azure Stack Edge device, which will host the packet core instance.

1. On the **Get started** tab, click **Create sites**.

    :::image type="content" source="media\create-sites-button.png" alt-text="Screenshot of the Azure portal showing the Get started tab, with the Create sites button highlighted.":::

1. Use the information you collected in [Collect site resource configuration values](collect-required-information-for-private-mobile-network.md#collect-site-resource-configuration-values) to fill out the fields on the **Basics** configuration tab, and then click **Next : Packet core >**.

    :::image type="content" source="media\how-to-guide-deploy-a-private-mobile-network-azure-portal\create-site-basics-tab.png" alt-text="Screenshot of the Azure portal showing the Basics configuration tab for a site resource.":::

1. You will now see the **Packet core** configuration tab.

    :::image type="content" source="media\how-to-guide-deploy-a-private-mobile-network-azure-portal\create-site-packet-core-tab.png" alt-text="Screenshot of the Azure portal showing the Packet core configuration tab for a site resource.":::

1. In the **Packet core** section, ensure **Technology type** is set to *5G*, and then leave the **Version** and **Custom location** fields blank unless you have been instructed to do otherwise by your support representative.
1. Use the information you collected in [Collect access network configuration values](collect-required-information-for-private-mobile-network.md#collect-access-network-configuration-values) to fill out the fields in the **Access network** section. Note the following.

    - You must use the same value for both the **N2 subnet** and **N3 subnet** fields.
    - You must use the same value for both the **N2 gateway** and **N3 gateway** fields.

1. Use the information you collected in [Collect attached data network configuration values](collect-required-information-for-private-mobile-network.md#collect-attached-data-network-configuration-values) to fill out the fields in the **Attached data networks** section. Note that you can only connect the packet core instance to a single data network.
1. Click **Review + create**.
1. Azure will now validate the configuration values you have entered. You should see a message indicating that your values have passed validation, as shown below.

    :::image type="content" source="media\how-to-guide-deploy-a-private-mobile-network-azure-portal\create-site-validation.png" alt-text="Screenshot of the Azure portal showing successful validation of configuration values for a site resource.":::

    If the validation fails, you will see an error message and the configuration tab(s) containing the invalid configuration will be flagged with red dots. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

1. Once your configuration has been validated, you can click **Create** to create the site. The Azure portal will display the following confirmation screen when the site has been created.

    :::image type="content" source="media\site-deployment-complete.png" alt-text="Screenshot of the Azure portal showing the confirmation of a successful deployment of a site.":::

1. Click on **Go to resource group**, and confirm that an **Arc for network functions - Packet Core** resource representing the site's packet core instance is shown in the resource group. Note that you may need to tick the **Show hidden types** checkbox to display all resources.

    :::image type="content" source="media\how-to-guide-deploy-a-private-mobile-network-azure-portal\arc-for-network-functions-packet-core-resource.png" alt-text="Screenshot of the Azure portal showing a resource group containing a new Arc for network functions - Packet Core resource.":::

1. Once you have confirmed this, keep the resource group displayed in the Azure portal and move to the next step.

## Create the Kubernetes base VM

In this step, you will create the Kubernetes base VM that will run on the Azure Stack Edge device in the site. This serves as the platform the Kubernetes cluster that will run the packet core instance.

1. You should still be viewing the resource group containing the site you created in the previous step. Select the **Mobile network site** resource corresponding to the site. Note that you may need to tick the **Show hidden types** checkbox to display this resource.
1. Click **Create a custom location**.

    :::image type="content" source="media\select-site.png" alt-text="Screenshot of the Azure portal showing the available sites in the private mobile network.":::

1. Use the information you collected in [Collect Kubernetes base VM configuration values](collect-required-information-for-private-mobile-network.md#collect-kubernetes-base-vm-configuration-values) to fill out the fields on the **Basics** configuration tab. Once you have done this, click the **Next - Legal >** button.

    :::image type="content" source="media\how-to-guide-deploy-a-private-mobile-network-azure-portal\kubernetes-base-vm-basics-tab.png" alt-text="Screenshot of the Azure portal showing the Basics configuration tab for a Kubernetes base VM.":::

1. On the **Legal** tab, read the Terms of Use and Privacy Policy. If you agree with these, tick the **I have read and agree to the Terms of use and the Privacy policy** checkbox, and then click the **Review + create** tab.
1. Azure will now validate the configuration values you have entered. You should see a message indicating that your values have passed validation, as shown below.

    :::image type="content" source="media\how-to-guide-deploy-a-private-mobile-network-azure-portal\kubernetes-base-vm-validation-screen.png" alt-text="Screenshot of the Azure portal showing the successful validation of Kubernetes base VM configuration.":::

    If the validation fails, you will see an error message and the configuration tab(s) containing the invalid configuration will be flagged with red dots. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

1. Click **Create** to create the Kubernetes base VM. This process takes approximately 15 minutes. Once Azure has created the Kubernetes base VM, it will display the following confirmation screen.

    :::image type="content" source="media\how-to-guide-deploy-a-private-mobile-network-azure-portal\kubernetes-base-vm-deployment-confirmation.png" alt-text="Screenshot of the Azure portal confirming the successful deployment of Kubernetes base VM.":::

1. Click **Go to resource** to navigate to the newly created **Azure Network Function Manager - Network Function** resource. Check the configuration to ensure it is as expected.

    :::image type="content" source="media\how-to-guide-deploy-a-private-mobile-network-azure-portal\azure-nfm-network-function-resource.png" alt-text="Screenshot of the Azure portal displaying an Azure Network Function Manager - Network Function resource.":::

## Connect the Kubernetes cluster to Azure Arc

Azure Arc enabled Kubernetes allows you to use Azure to manage the Kubernetes cluster that will run your packet core instance. In this step, you'll connect the Kubernetes cluster to Azure Arc. This step will create the following resources.

- An **Azure Arc enabled Kubernetes** resource to represent the Kubernetes cluster on the Kubernetes base VM.
- A **custom location** that provides a target for tenant administrators when deploying Azure services instances on the Kubernetes cluster.

Do the following to connect the Kubernetes cluster to Azure Arc.

1. Open a command prompt and enter `ssh -i <SSHKeyPath> MecUser@10.232.46.21`, where *`<SSHKeyPath>`* is the filepath of the SSH private key on your local machine. You identified this location as part of [Prerequisites](#prerequisites).
1. Select **Connect Azure Arc for Kubernetes** and press Enter.
1. Enter the subscription ID of your Azure subscription.
1. Enter the name of the resource group in which the new Azure resources mentioned above will be created. This must be one of the following.

   - A name for a new resource group that will be automatically generated as part of this step. We strongly recommend using a name that will allow you to identify it easily in future (for example, *contoso-arc-rg*).
   - An existing resource group.

1. Enter a prefix that will be included in the names of each of the resources created by this process. This must be between 3 and 32 characters long and include only letters, numbers and hyphens (for example, *contoso-arc*).
1. Enter the region location code for the Azure region in which you want to create the resources (for example, *eastus*).
1. When prompted, confirm whether you want to use an existing Log Analytics workspace for the Kubernetes cluster. If you answer yes, you will be prompted to provide the resource ID of your chosen Log Analytics workspace. You retrieved this in [Prerequisites](#prerequisites).
1. If you answered no to the previous prompt, you will now be asked whether you want to create a new Log Analytics workspace for the Kubernetes cluster.

   - If you answer yes, the Network Function Service Menu will automatically create a new Log Analytics workspace with the name *`<Prefix>`***-log** as part of this step, where *`<Prefix>`* is the prefix you chose for the new Azure resources.
   - If you answer no, the Network Function Service Menu will configure the Kubernetes cluster to use the default Log Analytics workspace for your subscription in the Azure region you have chosen above. If this Log Analytics workspace doesn't already exist, the Network Function Service Menu will create it with the name **DefaultWorkspace-***`<Subscription>`***-***`<Region>`* and place it in the default resource group for your chosen region (**DefaultResourceGroup-***`<Region>`*).

1. When prompted, paste in the product key provided to you by your support representative.
1. Check your chosen configuration is correct. If so, press Y to proceed. If not, press N and repeat the process.
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
1. Search for and select the resource group created by the Network Function Service Menu. The name of this resource group is the prefix you chose before starting this task, followed by **-rg** (for example, **contoso-arc-rg**).
1. Check the contents of the resource group to confirm that it contains **Custom Location** and **Kubernetes - Azure Arc** resources. Note that if you chose to create a new Log Analytics workspace as part of the previous step, this will also be present in the resource group.
1. Make a note of the name of the **Custom location** resource. You will need this in the next step.
1. Select the **Kubernetes - Azure Arc** resource and confirm that the **Status** field is set to **Connected**.

    :::image type="content" source="media\kubernetes-azure-arc-resource.png" alt-text="Screenshot of the Azure portal showing the Status field on a Kubernetes - Azure Arc resource.":::

## Configure the custom location

1. In the Azure portal, search for and select the **Mobile network** resource corresponding to your private mobile network.
1. On the left side bar, click **Sites**.
1. Select the the **Mobile network site** resource corresponding to the site in which the packet core instance is located.

    :::image type="content" source="media\select-site.png" alt-text="Screenshot of the Azure portal showing the available sites in the private mobile network.":::

1. Select **Configure a custom location**.

    :::image type="content" source="media\configure-a-custom-location.png" alt-text="Screenshot of the Azure portal showing the Configure a custom location option.":::

1. On the **Configuration** tab, select the **Custom location** resource you identified in [Verify that the correct resources have been created and that the connection is active](#verify-that-the-correct-resources-have-been-created-and-that-the-connection-is-active) from the **Custom ARC location** drop down menu. You must ensure that you select the correct resource, as this cannot be reversed once you have applied it.
1. Click **Apply**.
1. Return to the **Mobile network site** resource and confirm that the **Edge custom location** field is now displaying the correct **Custom location** resource.

    :::image type="content" source="media\configured-custom-location.png" alt-text="Screenshot of the Azure portal showing a correctly configured custom location on a site.":::

## Next steps

- [Learn more about designing the policy control configuration for your private mobile network](policy-control.md)