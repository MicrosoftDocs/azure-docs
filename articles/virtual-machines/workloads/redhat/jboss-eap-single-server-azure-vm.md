---
title: "Quickstart: Deploy JBoss EAP Server on Azure VM using the Azure portal"
description: Shows you how to quickly stand up JBoss EAP Server on an Azure virtual machine.
author: KarlErickson
ms.author: jiangma
ms.topic: quickstart
ms.date: 01/03/2024
ms.service: virtual-machines
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-jbosseap, devx-track-javaee-jbosseap-vm
---

# Quickstart: Deploy JBoss EAP Server on an Azure virtual machine using the Azure portal

This article shows you how to quickly deploy JBoss EAP Server on an Azure virtual machine (VM) using the Azure portal.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]
- Ensure the Azure identity you use to sign in has either the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) role or the [Owner](/azure/role-based-access-control/built-in-roles#owner) role in the current subscription. For an overview of Azure roles, see [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview)
- Ensure you have the necessary Red Hat licenses. You need to have a Red Hat Account with Red Hat Subscription Management (RHSM) entitlement for JBoss EAP. This entitlement lets the Azure portal install the Red Hat tested and certified JBoss EAP version.
  > [!NOTE]
  > If you don't have an EAP entitlement, you can sign up for a free developer subscription through the [Red Hat Developer Subscription for Individuals](https://developers.redhat.com/register). Write down the account details, which you use as the *RHSM username* and *RHSM password* in the next section.
- After you're registered, you can find the necessary credentials (*Pool IDs*) by using the following steps. You also use the *Pool IDs* as the *RHSM Pool ID with EAP entitlement* later in this article.
  1. Sign in to your [Red Hat account](https://sso.redhat.com).
  1. The first time you sign in, you're asked to complete your profile. Make sure you select **Personal** for **Account Type**, as shown in the following screenshot.

     :::image type="content" source="media/jboss-eap-single-server-azure-vm/update-account-type-as-personal.png" alt-text="Screenshot of selecting 'Personal' for the 'Account Type'." lightbox="media/jboss-eap-single-server-azure-vm/update-account-type-as-personal.png":::

  1. In the tab where you're signed in, open [Red Hat Developer Subscription for Individuals](https://aka.ms/red-hat-individual-dev-sub). This link takes you to all of the subscriptions in your account for the appropriate SKU.
  1. Select the first subscription from the **All purchased Subscriptions** table.
  1. Copy and write down the value following **Master Pools** from **Pool IDs**.

> [!NOTE]
> The Azure Marketplace offer you're going to use in this article includes support for Red Hat Satellite for license management. Using Red Hat Satellite is beyond the scope of this quick start. For an overview on Red Hat Satellite, see [Red Hat Satellite](https://aka.ms/red-hat-satellite). To learn more about moving your Red Hat JBoss EAP and Red Hat Enterprise Linux subscriptions to Azure, see [Red Hat Cloud Access program](https://aka.ms/red-hat-cloud-access-overview).

## Deploy JBoss EAP Server on Azure VM

The steps in this section direct you to deploy JBoss EAP Server on Azure VMs.

:::image type="content" source="media/jboss-eap-single-server-azure-vm/portal-start-experience.png" alt-text="Screenshot of Azure portal showing JBoss EAP Server on Azure VM." lightbox="media/jboss-eap-single-server-azure-vm/portal-start-experience.png":::

The following steps show you how to find the JBoss EAP Server on Azure VM offer and fill out the **Basics** pane.

1. In the search bar at the top of the Azure portal, enter *JBoss EAP*. In the search results, in the **Marketplace** section, select **JBoss EAP standalone on RHEL VM**.

   :::image type="content" source="media/jboss-eap-single-server-azure-vm/marketplace-search-results.png" alt-text="Screenshot of Azure portal showing JBoss EAP Server on Azure VM in search results." lightbox="media/jboss-eap-single-server-azure-vm/marketplace-search-results.png":::

   In the drop-down menu, ensure **PAYG** is selected.

   Alternatively, you can also go directly to the [JBoss EAP standalone on RHEL VM](https://aka.ms/eap-vm-single-portal) offer. In this case, the correct plan is already selected for you.

   In either case, this offer deploys JBoss EAP by providing your Red Hat subscription at deployment time, and runs it on Red Hat Enterprise Linux using a pay-as-you-go payment configuration for the base VM.

1. On the offer page, select **Create**.
1. On the **Basics** pane, ensure the value shown in the **Subscription** field is the same one that has the roles listed in the prerequisites section.
1. You must deploy the offer in an empty resource group. In the **Resource group** field, select **Create new** and fill in a value for the resource group. Because resource groups must be unique within a subscription, pick a unique name. An easy way to have unique names is to use a combination of your initials, today's date, and some identifier. For example, *ejb0823jbosseapvm*.
1. Under **Instance details**, select the region for the deployment.
1. Leave the default VM size for **Virtual machine size**.
1. Leave the default option **OpenJDK 17** for **JDK version**.
1. Leave the default value **jbossuser** for **Username**.
1. Leave the default option **Password** for **Authentication type**.
1. Fill in password for **Password**. Use the same value for **Confirm password**.
1. Under **Optional Basic Configuration**, leave the default option **Yes** for **Accept defaults for optional configuration**.
1. Scroll to the bottom of the **Basics** pane and notice the helpful links for **Report issues, get help, and share feedback**.
1. Select **Next: JBoss EAP Settings**.

The following steps show you how to fill out **JBoss EAP Settings** pane and start the deployment.

1. Leave the default value **jbossadmin** for **JBoss EAP Admin username**.
1. Fill in JBoss EAP password for **JBoss EAP password**. Use the same value for **Confirm password**. Write down the value for later use.
1. Leave the default option **No** for **Connect to an existing Red Hat Satellite Server?**.
1. Fill in your RHSM username for **RHSM username**. The value is the same one that has been prepared in the prerequisites section.
1. Fill in your RHSM password for **RHSM password**. Use the same value for **Confirm password**. The value is the same one that has been prepared in the prerequisites section.
1. Fill in your RHSM pool ID for **RHSM Pool ID with EAP entitlement**. The value is the same one that has been prepared in the prerequisites section.
1. Select **Next: Networking**.
1. Select **Next: Database**.
1. Select **Review + create**. Ensure the green **Validation Passed** message appears at the top. If the message doesn't appear, fix any validation problems, then select **Review + create** again.
1. Select **Create**.
1. Track the progress of the deployment on the **Deployment is in progress** page.

Depending on network conditions and other activity in your selected region, the deployment may take up to 6 minutes to complete. After that, you should see text **Your deployment is complete** displayed on the deployment page.

## Optional: Verify the functionality of the deployment

By default, the JBoss EAP Server is deployed on an Azure VM in a dedicated virtual network without public access. If you want to verify the functionality of the deployment by viewing the **Red Hat JBoss Enterprise Application Platform** management console, use the following steps to assign the VM a public IP address for access.

1. On the deployment page, select **Deployment details** to expand the list of Azure resource deployed. Select network security group `jbosseap-nsg` to open its details page.
1. Under **Settings**, select **Inbound security rules**. Select **+ Add** to open **Add inbound security rule** panel for adding a new inbound security rule.
1. Fill in *9990* for **Destination port ranges**. Fill in *Port_jbosseap* for **Name**. Select **Add**. Wait until the security rule created.
1. Select **X** icon to close the network security group `jbosseap-nsg` details page. You're switched back to the deployment page.
1. Select the resource ending with `-nic` (with type `Microsoft.Network/networkInterfaces`) to open its details page.
1. Under **Settings**, select **IP configurations**. Select `ipconfig1` from the list of IP configurations to open its configuration details panel.
1. Under **Public IP address**, select **Associate**. Select **Create new** to open the **Add a public IP address** popup. Fill in *jbosseapvm-ip* for **Name**. Select **Static** for **Assignment**. Select **OK**.
1. Select **Save**. Wait until the public IP address created and the update completes. Select the **X** icon to close the IP configuration page.
1. Copy the value of the public IP address from the **Public IP address** column for `ipconfig1`. For example, `20.232.155.59`.

   :::image type="content" source="media/jboss-eap-single-server-azure-vm/public-ip-address.png" alt-text="Screenshot of public IP address assigned to the network interface." lightbox="media/jboss-eap-single-server-azure-vm/public-ip-address.png":::

1. Paste the public IP address in an Internet-connected web browser, append `:9990`, and press **Enter**. You should see the familiar **Red Hat JBoss Enterprise Application Platform** management console sign-in screen, as shown in the following screenshot.

   :::image type="content" source="media/jboss-eap-single-server-azure-vm/jboss-eap-console-login.png" alt-text="Screenshot of JBoss EAP management console sign-in screen." lightbox="media/jboss-eap-single-server-azure-vm/jboss-eap-console-login.png":::

1. Fill in the value of **JBoss EAP Admin username** which is **jbossadmin**. Fill in the value of **JBoss EAP password** you specified before for **Password**. Select **Sign in**.
1. You should see the familiar **Red Hat JBoss Enterprise Application Platform** management console welcome page as shown in the following screenshot.

   :::image type="content" source="media/jboss-eap-single-server-azure-vm/jboss-eap-console-welcome.png" alt-text="Screenshot of JBoss EAP management console welcome page." lightbox="media/jboss-eap-single-server-azure-vm/jboss-eap-console-welcome.png":::

> [!NOTE]
> You can also follow the guide [Connect to environments privately using Azure Bastion host and jumpboxes](/azure/cloud-adoption-framework/scenarios/cloud-scale-analytics/architectures/connect-to-environments-privately) and visit the **Red Hat JBoss Enterprise Application Platform** management console with the URL `http://<private-ip-address-of-vm>:9990`.

## Clean up resources

To avoid Azure charges, you should clean up unnecessary resources. When you no longer need the JBoss EAP Server deployed on Azure VM, unregister the JBoss EAP server and remove Azure resources.

Run the following command to unregister the JBoss EAP server and VM from Red Hat subscription management.

```azurecli
az vm run-command invoke\
    --resource-group <resource-group-name> \
    --name <vm-name> \
    --command-id RunShellScript \
    --scripts "sudo subscription-manager unregister"
```

Run the following command to remove the resource group, VM, network interface, virtual network, and all related resources.

```azurecli
az group delete --name <resource-group-name> --yes --no-wait
```

## Next steps

Learn more about migrating JBoss EAP applications to JBoss EAP on Azure VMs by following these links:

> [!div class="nextstepaction"]
> [Migrate JBoss EAP applications to JBoss EAP on Azure VMs](/azure/developer/java/migration/migrate-jboss-eap-to-jboss-eap-on-azure-vms?toc=/azure/virtual-machines/workloads/oracle/toc.json&bc=/azure/virtual-machines/workloads/oracle/breadcrumb/toc.json)
