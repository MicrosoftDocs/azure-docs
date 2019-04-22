---
title: Azure CycleCloud Configuration | Microsoft Docs
description: Configure your Azure credentials to work with Azure CycleCloud.
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---

# Configuring Azure Credentials

Once Azure CycleCloud has been installed, you will need to add valid Azure credentials to use the software.

To begin, click on **Clusters** in the top menu bar. A notice will appear that you currently do not have a cloud provider set up.

![No Accounts Found error](~/images/no_accounts_found.png)

Click the link to add your credentials.

## Account Information

You will need to configure your Azure account for CycleCloud by generating access credentials, configuring network settings, and enabling certain services. CycleCloud uses the credentials you provide to provision infrastructure.

![Create Cloud Provider Account window](~/images/validate-credentials.png)

Enter a descriptive name for your cloud provider setup, such as "My Azure Account". You can choose to have this account be the default used for new clusters by checking the "Set Default" box. From the dropdown, select your Cloud Environment or leave "Azure Public Cloud" as the default. Enter the Tenant ID, Application ID, Application Secret, and Subscription ID (all of which are provided when you create the Service Account in Azure).

Once you have added the credentials for your Azure account, click **Validate Credentials** to verify the information. If successful, a "Test Succeeded" message will appear.

## Azure Resources

Once your account credentials have been validated, you will be able to enter or select the resources to be used with Azure CycleCloud. Using the dropdown menus, choose a **Default Location** for your resources.

Next, select your **Resource Group** and **Storage Account**. If the Storage Account doesn't exist, you can create it here. Finally, enter a **Storage Container**. This will be created if it does not exist within your account. Click **Save** to store the information.

![Select Azure Resources window](~/images/provider-configuration.png)

This information is required to start using CycleCloud, but can be changed at any time via [cluster template](cluster-templates.md).

## Requirements

You will need the following:

- A Microsoft Azure account with an active subscription
- An [Application Registration](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-authentication-scenarios#web-application-to-web-api) with [Contributor access](https://docs.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal) for the Subscription used with CycleCloud
- A [Network Security Group](https://docs.microsoft.com/en-us/azure/virtual-network/manage-network-security-group) set up to allow CycleCloud to communicate with Azure
- A [Virtual Network](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview) for CycleCloud

### Network Security Group Settings

From your Azure Dashboard, click on **Network Security Groups**. If you don't see the option, click on **All Services** and search for or scroll down to **Network Security Groups**.

1. Click **+ Add**
2. Give your Network Security Group a unique name. Security groups are managed per region, so we suggest including the region you intend to run in.
3. Create a new Resource Group with a unique name
4. Click **Create**

In the dashboard, click on the name of the Network Security Group you just created. If you do not see it, click **Refresh**. In the new panel, click on **Inbound Security Rules** and add the following:

| Name    | Priority | Source | Service | Protocol | Port Range |
| ------- | -------- | ------ | ------- | -------- | ---------- |
| SSH     | 100      | Any    | Custom  | Any      | 22         |
| RDP     | 110      | Any    | Custom  | Any      | 3389       |
| Ganglia | 120      | Any    | Custom  | Any      | 8652       |

5. For each entry, **Allow** the action
6. Click **OK** to add the rule

![Azure Inbound Rule screen](~/images/azure_inbound_rule.png)

>[!Note]
>Should you wish to start a cluster that includes CycleServer (such as the standard Condor cluster), you may want to include the following rule for port 8443. Please note that this will require SSL configured with a valid domain and certificates.

| Name        | Priority | Source | Service | Protocol | Port Range |
| ----------- | -------- | ------ | ------- | -------- | ---------- |
| https_8443  | 150      | Any    | HTTPS   | TCP      | 8443       |

### Creating a Virtual Network

You will need to set up a Virtual Network within Azure to work with CycleCloud. From the main menu, click on **Virtual Network**. If you don't see the option, click on **All Services** and either search for Virtual Networks or scroll down to the **Networking** section.

1. Click **+ Add**
2. Enter a unique name for your Virtual Network
3. Create a new Resource Group if you don't have one set up
4. The other default settings will suffice for this example
5. Select the Resource Group name you created in the previous step
6. Click **Create**

![Azure Virtual Network](~/images/azure_virtual_network.png)

Your Virtual Network requires a subnet, and your Network Security Group assigned to it:

- From the dashboard, click on the Virtual Network you just created
- Under "Settings", click on **Subnets**
- Click on the default subnet
- Click on the **Network Security Groups** header
- Select the group created earlier
- Click **OK**

### Information Location

Here's a list of what you'll need and where to find it:

- Application ID: Click on Dashboard - Azure Active Directory - App Registrations - the Application ID
- Application Secret: This is the secret key that you saved when creating your Application Registration
- Subscription ID: Dashboard - All Services - Subscriptions - Subscription - Subscription ID
- Tenant ID: This is the Directory ID. It is found under Azure Active Directory - Properties - Directory ID
