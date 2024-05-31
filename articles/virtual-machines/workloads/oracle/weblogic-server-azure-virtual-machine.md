---
title: "Quickstart: Deploy WebLogic Server on Azure Virtual Machines (VMs)"
description: Shows how to quickly stand up WebLogic Server on Azure Virtual Machine.
author: KarlErickson
ms.author: haiche
ms.topic: quickstart
ms.date: 05/29/2024
ms.service: oracle-on-azure
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-vm, devx-track-extended-java
---

# Quickstart: Deploy WebLogic Server on Azure Virtual Machines (VMs)

This article shows you how to quickly deploy WebLogic Application Server (WLS) on Azure Virtual Machines (VM) with the simplest possible set of configuration choices using the Azure portal. For a more full featured tutorial, including the use of Azure Application Gateway to make WLS cluster on VM securely visible on the public internet, see [Tutorial: Migrate a WebLogic Server cluster to Azure with Azure Application Gateway as a load balancer](/azure/developer/java/migration/migrate-weblogic-with-app-gateway?toc=/azure/virtual-machines/workloads/oracle/toc.json&bc=/azure/virtual-machines/workloads/oracle/breadcrumb/toc.json).

In this quickstart, you:

- Deploy WLS with Administration Server on a VM using the Azure portal.
- Deploy a Java EE sample application with WLS Administration Console portal.

This quickstart assumes a basic understanding of WLS concepts. For more information, see [Oracle WebLogic Server](https://www.oracle.com/java/weblogic/).

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

## Deploy WLS with Administration Server on a VM

The steps in this section direct you to deploy WLS on VM in the simplest possible way: using the [single node with an admin server](https://aka.ms/wls-vm-admin) offer. Other offers are available to meet different scenarios, including: [single node without an admin server](https://aka.ms/wls-vm-singlenode), [cluster](https://aka.ms/wls-vm-cluster), and [dynamic cluster](https://aka.ms/wls-vm-dynamic-cluster). For more information, see [What are solutions for running Oracle WebLogic Server on Azure Virtual Machines?](/azure/virtual-machines/workloads/oracle/oracle-weblogic).

:::image type="content" source="media/weblogic-server-azure-virtual-machine/portal-start-experience.png" alt-text="Screenshot of the Azure portal that shows the Create WebLogic Server With Admin console on Azure VM page." lightbox="media/weblogic-server-azure-virtual-machine/portal-start-experience.png":::

The following steps show you how to find the WLS with Admin Server offer and fill out the **Basics** pane:

1. In the search bar at the top of the portal, enter *weblogic*. In the autosuggested search results, in the **Marketplace** section, select **Oracle WebLogic Server With Admin Server**.

   :::image type="content" source="media/weblogic-server-azure-virtual-machine/search-weblogic-admin-offer-from-portal.png" alt-text="Screenshot of the Azure portal that shows WebLogic Server in the search results." lightbox="media/weblogic-server-azure-virtual-machine/search-weblogic-admin-offer-from-portal.png":::

   You can also go directly to the offer with this [portal link](https://aka.ms/wls-vm-admin).

1. On the offer page, select **Create**.

1. On the **Basics** pane, ensure the value shown in the **Subscription** field is the same one that you used to sign in to the Azure portal.

1. The offer must be deployed in an empty resource group. In the **Resource group** field, select **Create new** and fill in a value for the resource group. Because resource groups must be unique within a subscription, pick a unique name. An easy way to have unique names is to use a combination of your initials, today's date, and some identifier. For example, *ejb0802wls*.

1. Under **Instance details**, select the region for the deployment. For a list of Azure regions how and where VMs operate, see [Regions for virtual machines in Azure](/azure/virtual-machines/regions).

1. Accept the default value in **Oracle WebLogic Image**.

1. Accept the default value in **Virtual machine size**.

   If the default size isn't available in your region, choose an available size by selecting **Change size**, then select one of the listed sizes.

1. Under **Credentials for Virtual Machines and WebLogic**, leave the default value for **Username for admin account of VMs**.

1. Next to **Authentication type**, select **Password**. This article uses a user name and password pair for the authentication. If you want to use SSH, see [Create and use an SSH public-private key pair for Linux VMs in Azure](/azure/virtual-machines/linux/mac-create-ssh-keys). Fill in *wlsVmCluster2022* for **Password**. Use the same value for the confirmation.

1. Leave the default value for **Username for WebLogic Administrator**.

1. Fill in *wlsVmCluster2022* for the **Password for WebLogic Administrator**. Use the same value for the confirmation.

1. Select **Review + create**. Ensure the green **Validation Passed** message appears at the top. If not, fix any validation problems and select **Review + create** again.

1. Select **Create**.

1. Track the progress of the deployment in the **Deployment is in progress** page.

Depending on network conditions and other activity in your selected region, the deployment may take up to 30 minutes to complete.

## Examine the deployment output

The steps in this section show you how to verify the deployment successfully completed.

If you navigated away from the **Deployment is in progress** page, the following steps show you how to get back to that page. If you're still on the page that shows **Your deployment is complete**, you can skip to step 5, after the screenshot.

1. In the corner of any portal page, select the hamburger menu and select **Resource groups**.
1. In the box with the text **Filter for any field**, enter the first few characters of the resource group you created previously. If you followed the recommended convention, enter your initials, then select the appropriate resource group.
1. In the left navigation pane, in the **Settings** section, select **Deployments**. You can see an ordered list of the deployments to this resource group, with the most recent one first.
1. Scroll to the oldest entry in this list. This entry corresponds to the deployment you started in the preceding section. Select the oldest deployment, as shown in the following screenshot:

   :::image type="content" source="media/weblogic-server-azure-virtual-machine/resource-group-deployments.png" alt-text="Screenshot of the Azure portal that shows the resource group deployments list." lightbox="media/weblogic-server-azure-virtual-machine/resource-group-deployments.png":::

1. In the left panel, select **Outputs**. This list shows the output values from the deployment. Useful information is included in the outputs.
1. The **sshCommand** value is the fully qualified, SSH command to connect the VM that runs WLS. Select the copy icon next to the field value to copy the link to your clipboard. Save this value aside for later.
1. The **adminConsoleURL** value is the fully qualified, public internet visible link to the WLS admin console. Select the copy icon next to the field value to copy the link to your clipboard. Save this value aside for later.

## Deploy a Java EE application from Administration Console portal

Use the following steps to run a sample application in the WLS:

1. Download a sample application as a *.war* or *.ear* file. The sample app should be self contained and not have any database, messaging, or other external connection requirements. The sample app from the WLS Kubernetes Operator documentation is a good choice. You can download it from [Oracle](https://aka.ms/wls-aks-testwebapp). Save the file to your local filesystem.

1. Paste the value of **adminConsoleURL** in an internet-connected web browser. You should see the familiar WLS admin console login screen as shown in the following screenshot:

   :::image type="content" source="media/weblogic-server-azure-virtual-machine/wls-admin-login.png" alt-text="Screenshot of the WebLogic Server admin login screen.":::

1. Log in with user name *weblogic* and your password (this article uses *wlsVmCluster2022*). You can see the WLS Administration Console overview page.

1. Under **Change Center** on the top left corner, select **Lock & Edit**, as shown in the following screenshot:

   :::image type="content" source="media/weblogic-server-azure-virtual-machine/admin-console-portal.png" alt-text="Screenshot of the Oracle WebLogic Server Administration Console with Lock & Edit button highlighted." lightbox="media/weblogic-server-azure-virtual-machine/admin-console-portal.png":::

1. Under **Domain Structure** on the left side, select **Deployments**.

1. Under **Configuration**, select **Install**. There's an **Install Application Assistant** to guide you to finish the installation.

   1. Under **Locate deployment to install and prepare for deployment**, select **Upload your file(s)**.
   1. Under **Upload a deployment to the Administration Server**, select **Choose File** and upload your sample application. Select **Next**.
   1. Select **Finish**.

1. Under **Change Center** on the top left corner, select **Activate Changes**. You can see the message **All changes have been activated. No restarts are necessary**.

1. Under **Summary of Deployments**, select **Control**. Select the checkbox near the application name to select the application. Select **Start** and then select **Servicing all requests**.

1. Under **Start Application Assistant**, select **Yes**. If no error happens, you can see the message **Start requests have been sent to the selected deployments.**

1. Construct a fully qualified URL for the sample app, such as `http://<vm-host-name>:<port>/<your-app-path>`. You can get the host name and port from **adminConsoleURL** by removing `/console/`. If you're using the recommended sample app, the URL should be `http://<vm-host-name>:<port>/testwebapp/`, which should be similar to `http://wls-5b942e9f2a-admindomain.westus.cloudapp.azure.com:7001/testwebapp/`.

1. Paste the fully qualified URL in an internet-connected web browser. If you deployed the recommended sample app, you should see a page that looks similar to the following screenshot:

   :::image type="content" source="media/weblogic-server-azure-virtual-machine/test-webapp.png" alt-text="Screenshot of the test web app.":::

## Connect to the virtual machine

If you want to manage the VM, you can connect to it with SSH command. Before accessing the machine, make sure you enabled port 22 for the SSH agent.

Use the following steps to enable port 22:

1. Navigate back to your working resource group. In the overview page, you can find a network security group named **wls-nsg**. Select **wls-nsg**.
1. In the left panel, select **Settings**, then **Inbound security rules**. If there's a rule to allow port `22`, then you can jump to step 4.
1. In the top of the page, select **Add**.

   1. Under **Destination port ranges**, fill in the value *22*.
   1. Fill in the rule name *Port_SSH* for **Name**.
   1. Leave the default value for the other fields.
   1. Select **Add**.

   After the deployment completes, you can SSH to the VM.

1. Connect the VM with the value of **sshCommand** and your password (this article uses *wlsVmCluster2022*).

## Clean up resources

If you're not going to continue to use the WLS, navigate back to your working resource group. At the top of the page, under the text **Resource group**, select the resource group. Then, select **Delete resource group**.

## Next steps

Continue to explore options to run WLS on Azure.

> [!div class="nextstepaction"]
> [Learn more about Oracle WebLogic on Azure](/azure/virtual-machines/workloads/oracle/oracle-weblogic)
> [!div class="nextstepaction"]
> [Explore the official documentation from Oracle](https://aka.ms/wls-vm-docs)
> [!div class="nextstepaction"]
> [Explore the options for day 2 and beyond](https://aka.ms/wls-vms-day2)
