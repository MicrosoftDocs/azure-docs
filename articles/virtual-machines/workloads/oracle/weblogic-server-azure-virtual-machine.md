---
title: "Quickstart: Deploy WebLogic Server on Azure Virtual Machines (VMs)"
description: Shows how to quickly stand up WebLogic Server on Azure Virtual Machine.
author: KarlErickson
ms.author: haiche
ms.topic: quickstart
ms.date: 07/01/2024
ms.service: oracle-on-azure
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-vm, devx-track-extended-java
---

# Quickstart: Deploy WebLogic Server on Azure Virtual Machines (VMs)

This article shows you how to quickly deploy WebLogic Server (WLS) on an Azure Virtual Machine (VM) with the simplest possible set of configuration choices using the Azure portal. In this quickstart, you learn how to:

- Deploy WebLogic Server with Administration Server enabled on a VM using the Azure portal.
- Deploy a sample Java application with the WebLogic Server Administration Console.
- Connect to the VM running WebLogic using SSH.

If you're interested in providing feedback or working closely on your migration scenarios with the engineering team developing WebLogic on Azure solutions, fill out this short [survey on WebLogic migration](https://aka.ms/wls-on-azure-survey) and include your contact information. The team of program managers, architects, and engineers will promptly get in touch with you to initiate close collaboration.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## Deploy WebLogic Server with Administration Server on a VM

The following steps show you how to deploy WebLogic Server on a VM using the [single instance with an admin server](https://aka.ms/wls-vm-admin) offer on the Azure portal. There are other offers that meet different scenarios such as [WebLogic cluster on multiple VMs](https://aka.ms/wls-vm-cluster).

1. In the search bar at the top of the portal, enter *weblogic*. In the autosuggested search results, in the **Marketplace** section, select **WebLogic Server with Admin Console on VM**. You can also go directly to the offer using the portal link.

   :::image type="content" source="media/weblogic-server-azure-virtual-machine/search-weblogic-admin-offer-from-portal.png" alt-text="Screenshot of the Azure portal that shows WebLogic Server in the search results." lightbox="media/weblogic-server-azure-virtual-machine/search-weblogic-admin-offer-from-portal.png":::

1. On the offer page, select **Create**. You then see the **Basics** pane.

   :::image type="content" source="media/weblogic-server-azure-virtual-machine/portal-start-experience.png" alt-text="Screenshot of the Azure portal that shows the Create WebLogic Server With Admin console on Azure VM page." lightbox="media/weblogic-server-azure-virtual-machine/portal-start-experience.png":::

1. On the **Basics** pane, ensure the value shown in the **Subscription** field is the same one that you used to sign in to the Azure portal.

1. The offer must be deployed in an empty resource group. In the **Resource group** field, select **Create new** and fill in a value for the resource group. Because resource groups must be unique within a subscription, pick a unique name. An easy way to have unique names is to use a combination of your initials, today's date, and some identifier. For example, *ejb0802wls*.

1. Under **Instance details**, select the region for the deployment.

1. Accept the default value in **Oracle WebLogic Image**.

1. Accept the default value in **Virtual machine size**.

   If the default size isn't available in your region, choose an available size by selecting **Change size**, then select one of the listed sizes.

1. Under **Credentials for Virtual Machines and WebLogic**, leave the default value for **Username for admin account of VMs**.

1. Next to **Authentication type**, select **Password**. This article uses a user name and password pair for the authentication. If you want to use SSH, see [Create and use an SSH public-private key pair for Linux VMs in Azure](/azure/virtual-machines/linux/mac-create-ssh-keys). Fill in *wlsVmCluster2022* for **Password**. Use the same value for the confirmation.

1. Leave the default value for **Username for WebLogic Administrator**.

1. Fill in *wlsVmCluster2022* for the **Password for WebLogic Administrator**. Use the same value for the confirmation.

1. Select **Review + create**.

1. Ensure the green **Validation Passed** message appears at the top. If it doesn't, fix any validation problems and select **Review + create** again.

1. Select **Create**.

1. Track the progress of the deployment in the **Deployment is in progress** page.

Depending on network conditions and other activity in your selected region, the deployment might take up to 30 minutes to complete.

## Examine the deployment output

The steps in this section show you how to verify the deployment successfully completed.

If you navigated away from the **Deployment is in progress** page, the following steps show you how to get back to that page. If you're still on the page that shows **Your deployment is complete**, you can skip to step 5, after the screenshot.

1. In the corner of any portal page, select the hamburger menu and select **Resource groups**.
1. In the box with the text **Filter for any field**, enter the first few characters of the resource group you created previously. If you followed the recommended convention, enter your initials, then select the appropriate resource group.
1. In the left navigation pane, in the **Settings** section, select **Deployments**. You can see an ordered list of the deployments to this resource group, with the most recent one first.
1. Scroll to the oldest entry in this list. This entry corresponds to the deployment you started in the preceding section. Select the oldest deployment, as shown in the following screenshot:
x
   :::image type="content" source="media/weblogic-server-azure-virtual-machine/resource-group-deployments.png" alt-text="Screenshot of the Azure portal that shows the resource group deployments list." lightbox="media/weblogic-server-azure-virtual-machine/resource-group-deployments.png":::

1. In the left panel, select **Outputs**. This list shows useful output values from the deployment.
1. The **sshCommand** value is the fully qualified SSH command to connect to the VM that runs WebLogic Server. Select the copy icon next to the field value to copy the link to your clipboard. Save this value aside for later.
1. The **adminConsoleURL** value is the fully qualified public internet visible link to the WebLogic Server admin console. Select the copy icon next to the field value to copy the link to your clipboard. Save this value aside for later.

## Deploy a Java application from Administration Console

Use the following steps to run a sample application on the WebLogic Server:

1. Download a sample application as a *.war* or *.ear* file. The sample app should be self contained and not have any database, messaging, or other external connection requirements. The sample app from the WebLogic Kubernetes Operator documentation is a good choice. You can download it from [Oracle](https://aka.ms/wls-aks-testwebapp). Save the file to your local filesystem.

1. Paste the value of **adminConsoleURL** in an internet-connected web browser. You should see the familiar WebLogic Server admin console login screen as shown in the following screenshot:

   :::image type="content" source="media/weblogic-server-azure-virtual-machine/wls-admin-login.png" alt-text="Screenshot of the WebLogic Server admin login screen.":::

1. Log in with user name *weblogic* and your password (this article uses *wlsVmCluster2022*). You can see the WebLogic Server Administration Console overview page.

1. Under **Change Center** on the top left corner, select **Lock & Edit**, as shown in the following screenshot:

   :::image type="content" source="media/weblogic-server-azure-virtual-machine/admin-console-portal.png" alt-text="Screenshot of the Oracle WebLogic Server Administration Console with Lock & Edit button highlighted." lightbox="media/weblogic-server-azure-virtual-machine/admin-console-portal.png":::

1. Under **Domain Structure** on the left side, select **Deployments**.

1. Under **Configuration**, select **Install**. There's an **Install Application Assistant** to guide you to finish the installation.

   1. Under **Locate deployment to install and prepare for deployment**, select **Upload your file(s)**.
   1. Under **Upload a deployment to the Administration Server**, select **Choose File** and upload your sample application. Select **Next**.
   1. Accept the defaults in the next few screens and select **Finish**.
   1. On the application configuration screen, select **Save**.

1. Under **Change Center** on the top left corner, select **Activate Changes**. You can see the message **All changes have been activated. No restarts are necessary**.

1. Under **Summary of Deployments**, select **Control**. Select the checkbox near the application name to select the application. Select **Start** and then select **Servicing all requests**.

1. Under **Start Application Assistant**, select **Yes**. If no error happens, you can see the message **Start requests have been sent to the selected deployments.**

1. Construct a fully qualified URL for the sample app, such as `http://<vm-host-name>:<port>/<your-app-path>`. You can get the host name and port from **adminConsoleURL** by removing `/console/`. If you're using the recommended sample app, the URL should be `http://<vm-host-name>:<port>/testwebapp/`, which should be similar to `http://wls-5b942e9f2a-admindomain.westus.cloudapp.azure.com:7001/testwebapp/`.

1. Paste the fully qualified URL in an internet-connected web browser. If you deployed the recommended sample app, you should see a page that looks similar to the following screenshot:

   :::image type="content" source="media/weblogic-server-azure-virtual-machine/test-webapp.png" alt-text="Screenshot of the test web app.":::

## Connect to the virtual machine

If you want to manage the VM, you can connect to it with SSH command. Before accessing the machine, make sure you enabled port 22 for the SSH agent.

Use the following steps to enable port 22:

1. Navigate back to your working resource group in the Azure portal. In the overview page, you can find a network security group named **wls-nsg**. Select **wls-nsg**.
1. In the left panel, select **Settings**, then **Inbound security rules**. If there's a rule to allow port `22`, then you can jump to step 4.
1. In the top of the page, select **Add**.

   1. Under **Destination port ranges**, fill in the value *22*.
   1. Fill in the rule name *Port_SSH* for **Name**.
   1. Leave the default value for the other fields.
   1. Select **Add**.

   After the deployment completes, you can SSH to the VM.

1. Connect to the VM with the value of **sshCommand** and your password (this article uses *wlsVmCluster2022*).

## Clean up resources

If you're not going to continue to use the WebLogic Server, navigate back to your working resource group in the Azure portal. At the top of the page, under the text **Resource group**, select **Delete resource group**.

## Next steps

Continue to explore options to run WebLogic Server on Azure.

* [WebLogic Server on virtual machines](/azure/virtual-machines/workloads/oracle/oracle-weblogic?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)
* [WebLogic Server on Azure Kubernetes Service](/azure/virtual-machines/workloads/oracle/weblogic-aks?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)

For more information about the Oracle WebLogic offers at Azure Marketplace, see [Oracle WebLogic Server on Azure](https://aka.ms/wls-contact-me). These offers are all _Bring-Your-Own-License_. They assume that you already have the appropriate licenses with Oracle and are properly licensed to run offers in Azure.
