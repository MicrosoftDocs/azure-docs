---
title: Manage Exadata resources
description: Learn about how to manage Exadata resources.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.date: 08/01/2024
---

# Manage Exadata resources

After provisioning an OracleDB@Azure resource, for example an Oracle Exadata Infrastructure or an Oracle Exadata VM Cluster, you can use the Microsoft Azure blade for a limited set of management functions, and those functions are described in this document.

## Prerequisites

There are prerequisites that must be completed before you can provision Exadata Services. You need to complete the following:

- An existing Azure subscription
- An Azure VNet with a subnet delegated to the Oracle Database@Azure service (`Oracle.Database/networkAttachments`)
- Permissions in Azure to create resources in the region, with the following conditions:
   * No policies prohibiting the creation of resources without tags, because the OracleSubscription resource is created automatically without tags during onboarding.
   * No policies enforcing naming conventions, because the OracleSubscription resource is created automatically with a default resource name.
- Purchase OracleDB@Azure in the Azure portal.
- Select your Oracle Cloud Infrastructure (OCI) account.
For more detailed documentation, including optional steps, see [Onboarding with Oracle Database@Azure](https://docs.oracle.com/iaas/Content/database-at-azure/oaaonboard.htm).

## Common Management Functions from the Microsoft Azure Blade

The following management functions are available for all resources from the Microsoft Azure blade for that resource.

### Access the resource blade
1. From the Microsoft Azure portal, select OracleDB@Azure application.
1. From the left menu, select **Oracle Exadata Database@Azure**.
1. If the blade lists and manages several resources, select the resource type at the top of the blade. For example, the **Oracle Exadata Database@Azure** blade accesses both Oracle Exadata Infrastructure and Oracle Exadata VM Cluster resources.

### List status for all resources of the same type
1. Follow the steps to **Access the resource blade**.
1. Resources will be shown in the list as **Succeeded**, **Failed**, or **Provisioning**.
1. Access the specifics of that resource by selecting the link in the **Name** field in the table.

### Provision a new resource

1. Follow the steps to **Access the resource blade**.

1. Select the **+ Create** icon at the top of the blade.
1. Follow the provisioning flow for the resource.
   * [Provision Exadata infrastructure](exadata-provision-infrastructure.md)
   * [Provision an Exadata VM cluster](exadata-provision-vm-cluster.md)

### Refresh the blade's info

1. Follow the steps to **Access the resource blade**.
1. Select the **Refresh** icon at the top of the blade.
1. Wait for the blade to reload.

### Remove a resource

1. Follow the steps to **Access the resource blade**.
1. You can remove a single or multiple resources from the blade by selecting the checkbox on the left side of the table. Once you have selected the resource(s) to remove, you can then select the **Delete** icon at the top of the blade.
1. You can also remove a single resource by selecting the link to the resource from the **Name** field in the table. From the resource's detail page, select the **Delete** icon at the top of the blade.

### Add, manage, or delete resource tags

1. Follow the steps to **Access the resource blade**.
1. Select the link to the resource from the **Name** field in the table.
1. From the resource's overview page, select the **Edit** link on the **Tags** field.
1. To create a new tag, enter values in the **Name** and **Value** fields.
1. To edit an existing tag, change the value in the existing tag's **Value** field.
1. To delete an existing tag, select the **Trashcan** icon at the right-side of the tag.

### Start, stop, or restart Oracle Exadata VM Cluster VMs
1. Follow the steps to **Access the resource blade**.
1. Select the Oracle Exadata VM Cluster blade.
1. Select the link to the resource from the **Name** field in the table.
1. From the resource's overview page, select the **Settings > Virtual machines** link on the left-side menu.
1. To start a virtual machine (VM), select the **Start** icon. The **Start virtual machine** panel opens. Select the VM to start from the **Virtual machine** drop-down list. The drop-down list only populates with any unavailable VMs. Select the **Submit** button to start that VM, or the **Cancel** button to cancel the operation.
1. To stop a virtual machine (VM), select the **Stop** icon. The **Stop virtual machine** panel opens. Select the VM to stop from the **Virtual machine** drop-down list. The drop-down list only populates with any available VMs. NOTE: Stopping a node may disrupt ongoing back-end software operations and database availability. Select the **Submit** button to stop that VM, or the **Cancel** button to cancel the operation.
1. To restart a virtual machine (VM), select the **Restart** icon. The **Restart virtual machine** panel opens. Select the VM to restart from the Virtual machine drop-down list. The drop-down list only populates with any available VMs.
 
 >[!NOTE] 
 >Restarting shuts down the node and then starts it. For single-node systems, databases are offline while the reboot is in progress.

1. Select the **Submit** button to restart that VM, or the **Cancel** button to cancel the operation.

### Access the OCI console
1. Follow the steps to **Access the resource blade**.
1. Select the link to the resource from the **Name** field in the table.
1. From the resource's detail page, select the **Go to OCI** link on the **OCI Database URL** field.
1. Log in to OCI.
1. Manage the resource from within the OCI console.

### Perform a connectivity test

1. Follow the steps to Access the OCI console.
1. In the OCI console, navigate to the **Pluggable Database Details** page for the database you want to test.
1. Select the **PDB connection** button.
1. Select **Show** link to expand the details for the **Connection Strings**.
1. Open Oracle SQL Developer. If you don't have SQL Developer installed, download [SQL Developer](https://www.oracle.com/database/sqldeveloper/technologies/download/) and install.
1. Within SQL Developer, open a new connection with the following information.
   1. **Name** - Enter a name of your choice used to save your connection.
   1. **Username** - Enter **SYS**.
   1. **Password** - Enter the password used when creating the PDB.
   1. **Role** - Select **SYSDBA**.
   1. **Save Password** - Select the box if your security rules allow. If not, you will need to enter the PDB password every time you use this connection in SQL Developer.
   1. **Connection Type** - Select **Basic**.
   1. **Hostname** - Enter one of the host IPs from the **Connection Strings** above.
   1. **Port** - The default is 1521. You only need to change this if you have altered default port settings for the PDB.
   1. **Service Name** - Enter the **SERVICE_NAME** value from the host IP you previously selected. This is from the **Connection Strings** above.
   1. Select the **Test** button. The Status at the bottom of the connections list, should show as **Success**. If the connection is not a success, one or more of the **Hostname**, **Port**, and **Service Name** fields is incorrect, or the PDB is not currently running.
   1. Select the **Save** button.
   1. Select the **Connect** button.

### Manage network security group (NSG) rules

1. Follow the steps to access the Oracle Exadata VM Cluster resource blade.
1. Select the link to the resource from the **Name** field in the table.
1. From the resource's detail page, select the **Go to OCI** link on the **OCI network security group URL** field.
1. Log in to OCI.
1. Manage the NSG rules from within the OCI console.
1. For additional information on NSG rules and considerations within OracleDB@Azure, see the **Automatic Network Ingress Configuration** section of [Troubleshooting and Known Issues for Exadata Services](exadata-troubleshoot-services.md).

### Support for OracleDB@Azure

1. Follow the steps to Access the OCI console.
1. From the OCI console, there are two ways to access support resources.
   1. At the top of the page, select the Help (?) icon at the top-right of the menu bar.
   1. On the right-side of the page, select the floating Support icon.
       
       >[!NOTE]
       >This icon can be moved by the user, and the precise horizontal location can vary from user to user.

1. You have several support options from here, including documentation, requesting help via chat, visiting the Support Center, posting a question to a forum, submitting feedback, requesting a limit increase, and creating a support request.
1. If you need to create a support request, select that option.
1. The support request page will auto-populate with information needed by Oracle Support Services, including resource name, resource OCID, service group, service, and several other items dependent upon the specific OracleDB@Azure resource.
1. Select the support option from the following options:
   1. Critical outage for critical production system outage or a critical business function is unavailable or unstable. You or an alternate contact must be available to work this issue 24x7 if needed.
   1. Significant impairment for critical system or a business function experiencing severe loss of service. Operations can continue in a restricted manner. You or an alternate contact are available to work this issue during normal business hours.
   1. Technical issue where functionality, errors, or a performance issue impact some operations.
   1. General guidance where a product or service usage question, product or service setup, or documentation clarification is needed.
1. Select the **Create Support Request** button.
1. The support ticket is created. This ticket can be monitored within the OCI console or via [My Oracle Support (MOS)](https://support.oracle.com/).