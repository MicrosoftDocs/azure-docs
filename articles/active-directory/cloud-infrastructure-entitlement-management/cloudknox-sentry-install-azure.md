---
title: Install Microsoft CloudKnox Permissions Management Sentry on Microsoft Azure
description: How to install Microsoft CloudKnox Permissions Management Sentry on Microsoft Azure.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: conceptual
ms.date: 01/12/2022
ms.author: v-ydequadros
---


# Install Microsoft CloudKnox Permissions Management Sentry on Microsoft Azure

This topic describes how to install the Microsoft CloudKnox Permissions Management Sentry on Microsoft Azure (Azure).

<!---![Azure Sentry Installation](sentry-install-Azure.jpg)--->

## CloudKnox overview

The CloudKnox Sentry is an agent packaged in a virtual appliance. It gathers information on users, their privileges, activity, and resources for any monitored Azure account(s). It can be deployed in two ways:

- *Read only* (controller disabled), which only collects information about the account.
- *Controller enabled*, which allows the CloudKnox Sentry to collect information and make changes to identity and access management (IAM) roles, policies, and users.

To provide visibility and insights, the CloudKnox Sentry collects information from many sources. It uses *Read*, *List*, and *Describe* privileges, for example, to help CloudKnox display resource information to catalog ec2 instances and s3 buckets.

To gain insight into activity within the Azure account, CloudKnox gathers CloudTrail event logs and ties them to individual identities.

### Architecture

The CloudKnox Sentry is a Linux-based appliance that collects information about the Azure Subscription. Sentry uses an Azure Active Directory Application ID to make application programming interface (API) calls to read identity entitlements, resource information, and activity data on an hourly basis. It then uploads that data to the CloudKnox Software as a Service (SaaS) application for processing.

Inbound traffic to the Sentry is only received on port 22, and is used for configuration by the CloudKnox administrator. We recommend only allowing traffic from any observable source IP addresses your administrator may be configuring from. Outbound traffic is 443 to make API calls to Azure, CloudKnox, and Azure Active Directory (AD).

<!---![Sentry Architecture Azure](sentry-architecture-Azure.png)--->

### Port requirements

**Required ports for the CloudKnox Sentry**

| Traffic      | Port | Description                                                                                               |
| ------------ | ---- | --------------------------------------------------------------------------------------------------------- |
| TCP Inbound  | 9000 | Configuration. </p>Request this information from the administrator's source IP only when you're doing a configuration. |
| TCP Outbound | 443  | API calls to Azure, CloudKnox, and for identity provider (IDP) integration.        |

### Multi-account collection from one Sentry

For Azure organizations with multiple accounts, you can set up one Sentry to collect from multiple accounts by allowing the Sentry's IAM role to assume a cross-account role in the account from which you want to collect data. To allow cross-account, configure a trust relationship.

**Explanation and diagram**

<!---![Multi-Account Collection Diagram](multi-account-Azure.png)--->

**Example**

If the Sentry in Account B needs to collect entitlement, resource, and activity data from Account A:

1. Every hour, Sentry starts a data collection job by assuming the role passed to it.

2. The role assumes a cross-account role to Account A.

3. The cross-account role collects information about user privileges, groups, resources, configuration, and activity from native Azure services through the API. It then returns the data to the CloudKnox Sentry.

## CloudKnox Sentry deployment prerequisites

The following information guides you through the installation and configuration of the CloudKnox Sentry.

1. Identify the Azure subscriptions from which you want CloudKnox to collect data.

2. Make sure that the installing user can create an Azure AD application.

3. Make sure that the installing user has Azure Active Directory Administrative Privileges to grant permissions.

     The installing user should be an *Owner* of the subscriptions from which they want to collect data.

4. Identify an Azure Storage account and container to copy the CloudKnox Sentry VHD. (This step requires the Storage Account access key.)

## Deploying the CloudKnox Sentry appliance

### Create a network security group for the CloudKnox Sentry

1. Select **Network Security Groups** to display the dashboard.
2. In the **Network Security Groups** section:
     - In the **Name** box, enter `cloudknox-nsg`
     - In the **Subscription** box, enter the Azure subscription in which you installed the Sentry.
     - In the **Resource Group** box, enter the Azure Resource Group in which you installed the Sentry.
     - In the **Location** box, enter the location in which you installed the Sentry.

3. Select the network security group you created in Step 2 (cloudknox-nsg). 
4. From **Settings**, select the **Inbound security** rules.
5. To add a new inbound security rule, select **Add**.
6. Add the following rule:
    - In the **Source** box, enter the IP Addresses.
    - In the **Source IP addresses/CIDR ranges** box, enter your IP Address.
    - In the **Destination port ranges** box, enter *22*
    - In the **Protocol** box, enter *TCP*
    - In the **Name** box, enter *Port_22*
7. Select **Add**.

### Create the Service Principal

**Option 1: Using managed identities**

1. Open **Managed Identities and Create User Assigned Managed Identity**.
2. Enter the CloudKnox resource group.
3. Enter the name for the identity *CloudKnox*, and then create the identity.
4. In the subscription, select **Access Control (IAM)**.
5. Select **Add**, select **Add role assignment**, and then enter the following:
     - In the **Role** box, enter *Reader*
     - In the **Assign access to** box, enter *Azure AD user, group, or service principal*

6. Select: **Search for the User Managed Identity** created above, and then select **Save**.
7. Optional: To enable Controller functionality (that is, to enable JEP controller and Privilege On Demand), assign the following role:
       - In the **Role** box, enter *User Access Administrator*

8. Repeat step 5 for each Azure subscription from which you want CloudKnox to collect data.
9. Navigate to the virtual machine (VM) created earlier, then select the **Identity** menu.
10. Select the **User Managed** tab, then select the user-managed identity you created earlier.
11. Run the following PowerShell command to assign Microsoft graph API permission to the Service principal created earlier.

~~~
    $TenantID="<TenantID>"
    #Microsoft Graph App ID (DON'T CHANGE)
    $GraphAppId = "00000003-0000-0000-c000-000000000000"
    #Name of the managed identity
    $DisplayNameOfMSI="<CloudKnox>"
    Connect-AzureAD -TenantId $TenantID
    $MSI = (Get-AzureADServicePrincipal -Filter "displayName eq '$DisplayNameOfMSI'")
    Start-Sleep -Seconds 10
    $GraphServicePrincipal = Get-AzureADServicePrincipal -Filter "appId eq '$GraphAppId'"

    $PermissionName = "Directory.Read.All"
    $AppRole = $GraphServicePrincipal.AppRoles | Where-Object {$_.Value -eq $PermissionName -and $_.AllowedMemberTypes -contains "Application"}
    New-AzureAdServiceAppRoleAssignment -ObjectId $MSI.ObjectId -PrincipalId $MSI.ObjectId -ResourceId $GraphServicePrincipal.ObjectId -Id $AppRole.Id

    $PermissionName = "AuditLog.Read.All"
    $AppRole = $GraphServicePrincipal.AppRoles | Where-Object {$_.Value -eq $PermissionName -and $_.AllowedMemberTypes -contains "Application"}
    New-AzureAdServiceAppRoleAssignment -ObjectId $MSI.ObjectId -PrincipalId $MSI.ObjectId -ResourceId $GraphServicePrincipal.ObjectId -Id $AppRole.Id
~~~

**Option 2: Using App registration**

1. Browse to **Azure Active Directory**.
2. Select  **App registrations**.
3. Select **New registration**.
4. In the **Register an application** page:
     1. In the **Name** box, enter *CloudKnox-App*
     2. From **Supported account types**, select **Accounts in this organizational directory only**.
     3. Leave the **Redirect URI** box blank.

5. Make a note of the **Application (client) ID**. You'll use it when you configure the Sentry.
6. Select **View API Permissions**.
7. Select **Add a permission**.
    1. In **Microsoft Graph**:
         1. Select **Application permissions**.
         2. Add the **AuditLog.Read.All** permission.
         3. Add the **Directory.Read.All** permission.
         4. Select **Add permissions**.
8. Select **Grant admin consent**.
9. Select **Certificates & secrets**. Then:
    1. Select **New client secret**.
    2. Add a description and choose an **expiration date**.
    3. Select **Add**.
    4. Make a note of the **client secret value**. You'll use it when you configure the Sentry.

### Granting the *Reader* role to the Azure Application 

1. Browse to the subscription from which you want the Sentry to collect data.
2. In the subscription, select **Access Control (IAM)**.
3. Select **Add**, select **Add role assignment**, and then enter the following:
    1. In the **Role** box, enter *Reader*
    2. In the **Assign access to** box, enter the Azure AD user, group, or service principal.
    3. Select **Search**, enter the Azure Application you created previously, and then select **Save**.
    4. Optional:  To enable Controller functionality (that is, to enable JEP controller and Privilege On Demand), assign the following role:
       - In the **Role** box, enter *User Access Administrator*
4. Repeat step 3 for each Azure subscription from which you want CloudKnox to collect data.

### Creating the CloudKnox Sentry from the image

After you create a **Resource** group in CloudKnox, you'll use it to install CloudKnox sentry VM.

1. Create a VM using the following image as a reference.

    <!---https://portal.azure.com/#create/cloudknox.cloudknox_sentry_imagesentry_v1_byol0--->
2. Fill in the following information:
     - The **Resource Group** you created.
     - The **Virtual Machine Name**.
     - The **Size: D4s_v3**.
     - In the **Authentication type** box, enter the SSH public key.
        - **Username**
        - **SSH public key**
     - In the **Public inbound ports** box, enter *None*
3. In the **Networking** tab:
    - From **NIC network security group**, select **Advanced**.
      - **Public IP**: If you can route to the appliance from your local machine (port 22) through a VPN, you don't need a public IP.

        If you can't route to the appliance, assign a new public IP for the sentry temporarily for configuration.
      - In the **Configure network security group** box, enter *cloudknox-nsg* (the network security group you created earlier.)
4. Select **Review and Create**.
5. Select **Create**.

## Connecting the CloudKnox Sentry with the CloudKnox console

1. Select **Settings**, and then select the **Data Collectors** tab.
2. In the **Azure** section, select **Deploy**.

    <!---Add screenshot.--->
3. Select **Next**.
4. Enter the appliance DNS name or IP of the Sentry that you deployed in Azure, and then select **Next**.
5. Make a note of the email and PIN. You'll need it when you configure the Sentry in the next procedure.

    <!---Add screenshot.--->

### Configure the Sentry

1. To start the sentry configuration, use Secure Shell (SSH) to get into the VM.
2. Run the following script to configure Azure Sentry:

    `sudo /opt/cloudknox/sentrysoftwareservice/bin/runAzureConfigCLI.sh`
3. Enter the email address from the CloudKnox console that generated the PIN.
4. Enter the PIN you obtained earlier.
5. Enter the tenant name or ID in next prompt: *Azure AD tenant* or *tenantID*
6. Specify if the service principal with the Reader role for CloudKnox data collection is a managed identity or app registration.
    1. If you select **Y** for client ID configuration, enter the client ID and password to authenticate and verify access to Graph API.
    2. If you're using Azure MSI OR if you previously configured **(Y/N): ?**, you don't have to enter a value in the **Configure ClientID and Secret** box.
    3. In the **Azure application client ID:** box, enter the client ID.
    4. In the **Azure application password:** box, enter the client password.
7. To automatically pick subscriptions the CloudKnox service principal can access, in the **Enter number of subs to add (0-50):** box, enter the number of subscriptions you want.

<!---## Next steps--->