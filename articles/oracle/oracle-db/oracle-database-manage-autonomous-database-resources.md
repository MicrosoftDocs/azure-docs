---
title: Manage resources in Oracle Database@Azure
description: Learn how to manage resources in an instance of Oracle Database@Azure.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.date: 08/01/2024
---

# Manage resources in Oracle Database@Azure

After you provision an instance of Oracle Database@Azure, you can use the Azure portal to complete a limited set of resource management functions.

## Prerequisites

You must have the following prerequisites before you can provision Oracle Database@Azure:

- An existing Azure subscription.
- An Azure virtual network with a subnet delegated to the Oracle Database@Azure service (`Oracle.Database/networkAttachments`).
- Permissions in Azure to create resources in the region, with the following conditions:
  - No policies that prohibit the creation of resources without tags. The OracleSubscription resource is created automatically without tags during onboarding.
  - No policies that enforce naming conventions. The OracleSubscription resource is created automatically with a default resource name.
- Oracle Database@Azure purchased in the Azure portal.
- An Oracle Cloud Infrastructure (OCI) account.

For more information, including optional steps, see [Onboard Oracle Database@Azure](https://docs.oracle.com/iaas/Content/database-at-azure/oaaonboard.htm).

## Common management functions in the Azure portal

This section describes management functions that are available for all Oracle Database@Azure resources. To access management functions, go to the Azure pane for that resource.

### Access the resource pane

1. In the Azure portal, go to the home pane for your Oracle Database@Azure application.
1. On the service menu, select **Oracle Database@Azure**.
1. If the pane lists and manages multiple resources, select the resource type at the top of the pane.

   For example, use the **Oracle Exadata Database@Azure** pane to access both the Oracle Exadata infrastructure and the Oracle Exadata virtual machine (VM) cluster resources.

### List a resource type status

1. Go to the resource pane. For more information, see [Access the resource pane](#access-the-resource-pane).

    Resources are shown as **Succeeded**, **Failed**, or **Provisioning**.

1. To access details for the resource, under **Name**, select the link for the resource.

### Provision a new resource

1. Go to the resource pane. For more information, see [Access the resource pane](#access-the-resource-pane).
1. In the command bar, select **Create**.
1. Complete the steps to [provision an instance of Oracle Autonomous Database](oracle-database-provision-autonomous-database.md).

### Refresh the pane

1. Go to the resource pane.
1. In the command bar, select the **Refresh** icon.
1. Wait for the pane to reload.

### Remove a resource

1. Go to the resource pane.
1. On the resource pane, you can remove a single resource or multiple resources by selecting the checkbox to the left of the table. After you select the resources to remove, in the command bar, select the **Delete** icon.
1. You also can remove a single resource. Under **Name**, select the link for the resource. On the resource's detail pane, select the **Delete** icon.

### Add, manage, or delete resource tags

1. Go to the resource pane.
1. Under **Name**, select the link for the resource.
1. On the resource overview pane, under **Tags**, select **Edit**.
1. To create a new tag, enter a name and tag value.
1. To edit an existing tag, change the value for the existing tag.
1. To delete an existing tag, select the **Delete** icon to the right of the tag.

### Manage resource allocation

> [!NOTE]
> You can change only the *resource allocation* settings for an instance of Oracle Database@Azure by using these steps. The steps don't apply to any other resource type.

1. Go to the resource pane.
1. Under **Name**, select the link for the resource.
1. On the service menu, select **Settings**, and then select **Resource allocation**.
1. On the **Resource allocation** pane, select **Manage**.
1. On the **Manage resource allocation** pane, you can set the Elastic Compute Processing Unit (ECPU) count from **2** to **512**. To set your Oracle Database@Azure instance to scale its computing allocation automatically up to 512, select the **Compute auto scaling** checkbox. For **Storage**, set storage allocation from 1 TB to 383 TB. To set your Oracle Database@Azure instance to scale storage allocation automatically up to 383 TB, select the **Storage auto scaling** checkbox.
1. After you set or review settings, select **Apply** to apply changes, or select **Cancel** to leave the current settings.

### Test connectivity

1. Go to the resource pane.
1. Under **Name**, select the link for the resource.
1. On the service menu, select **Settings**, and then select **Connections**.
1. Select the **Download wallet** icon and save the file.
1. Open Oracle SQL Developer. If you don't have SQL Developer installed, download SQL Developer and install it.
1. In SQL Developer, open a new connection by using the following information:

   1. **Name**: Enter a name to use for the connection.
   1. **Username**: Enter **SYS**.
   1. **Password**: Enter the password you used when you created the pluggable database (PDB).
   1. **Role**: Select **SYSDBA**.
   1. **Save Password**: Select this checkbox if your security rules allow. Otherwise, you're required to enter the PDB password every time you use this connection in SQL Developer.
   1. **Connection Type**: Select **Cloud Wallet**.
   1. **Configuration File**: Select **Browse**, and then select the wallet you downloaded.
   1. Select the **Test** button. Check **Status** in the list of connections for a **Success** value. If the connection isn't a success, the wallet is out of date, or the instance of Oracle Autonomous Database isn't currently running.
   1. Select **Save**.
   1. Select **Connect**.

### Access the OCI console

1. Go to the resource pane.
1. Under **Name**, select the link for the resource.
1. On the service menu, under **OCI Database URL**, select the **Go to OCI** link.
1. Sign in to OCI.
1. Manage the resource from within the OCI console.

### Get support for Oracle Database@Azure

1. Follow the steps to [access the OCI console](#access-the-oci-console).

1. In the OCI console, choose an option to access support resources:

   - On the top-right menu bar, select the **Help** (`?`) icon.

   - On the right side of the page, select the floating **Support** icon.

1. You have several support options from here, including documentation, requesting help via chat, visiting the Support Center, posting a question to a forum, submitting feedback, requesting a limit increase, and creating a support request.

   If you need to create a support request, select that option.

1. The support request page autopopulates with information that's needed by Oracle Support Services, including the resource name, the resource Oracle Cloud Identifier (OCID), the service group, the service, and several other items depending on the Oracle Database@Azure resource.

1. Select the relevant support option from the following options:

   1. **Critical outage** for a critical production system outage or if a critical business function is unavailable or unstable. You or an alternate contact must be available to work on this issue 24x7 if needed.

   1. **Significant impairment** for a critical system failure or if a business function experiencing severe loss of service. Operations can continue in a restricted manner. You or an alternate contact must be available to work on this issue during normal business hours.

   1. **Technical issue** for functionality, errors, or a performance issue that affects only some operations.

   1. **General guidance** if you have a product or service usage question, for product or service setup, or if you need documentation clarification.

1. Select **Create Support Request**.

The support ticket is created. You can monitor the ticket in the OCI console or via [My Oracle Support (MOS)](https://support.oracle.com/).
