---
title: Create and configure Enterprise Security Package clusters in Azure HDInsight
description: Learn how to create and configure Enterprise Security Package clusters in Azure HDInsight
services: hdinsight
ms.service: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.topic: howto
ms.date: 04/15/2019
---
# Create and configure Enterprise Security Package clusters in Azure HDInsight

The Enterprise Security Package for Azure HDInsight gives you access to Active Directory-based authentication, multi-user support, and role-based access control for your Apache Hadoop clusters in Azure. HDInsight ESP clusters enable organizations which adhere to strict corporate security policies, to process sensitive data securely.

This guide walks through the steps needed to create an Enterprise Security Package enabled Azure HDInsight Cluster. Specifically, the following topics will be discussed:

* creating a Windows IaaS VM, with Active Directory & DNS enabled mimicking an on-Prem environment
* create an hybrid identity environment using password hash sync with Azure Active Directory

At the end of this guide, a user created on your on-premises Active Directory should be able to login to an ESP enabled HDInsight cluster.

This guide is meant to complement [Use Enterprise Security Package in HDInsight](apache-domain-joined-architecture.md)

Pre-requisites:

* Create an On-Prem environment with Active Directory and DNS
* Enable Azure Active Directory and Sync the user to Azure Active Directory

![alt-text](./media/apache-hive-warehouse-connector/hive-warehouse-connector-architecture.png)

![alt-text](./media/apache-domain-joined-create-configure-esp/image002.png)

## Windows Domain Controller Setup

### Deploy Windows Server Domain Controller and Windows DNS Server to new Resource Group and Virtual Network

**Action**: Use Azure Quick Deployment template to Create new VMs and configure DNS and new AD Forest

Reference:
<https://azure.microsoft.com/en-gb/resources/templates/active-directory-new-domain/>

Step 1: Go to [Create an Azure VM with a new AD Forest](https://azure.microsoft.com/resources/templates/active-directory-new-domain/)

Step 2: Click on Deploy to Azure Button

![alt-text](./media/apache-domain-joined-create-configure-esp/image004.png)

Step 3: Login to your Azure Subscription where you want to configure Windows Domain Controller and DNS Server

Step 4: Enter the following details.

Sample Details:

* Resource Group Name: OnPremADVRG
* Location: Central US
* Username: HDIFabrikamAdmin
* Domain: HDIFabrikam.com
* DNS: hdifabrikam

![alt-text](./media/apache-domain-joined-create-configure-esp/image006.png)

Step 5: Monitor the Deployment and wait for it complete.

![alt-text](./media/apache-domain-joined-create-configure-esp/image008.png)

Step 6: Confirm the resources are created under this Resource Group

![alt-text](./media/apache-domain-joined-create-configure-esp/image010.png)

### Configure Additional Users and Groups to access HDInsight Cluster

End of the walk through we conclude explain on the users created in the follow section can access the HDInsight clusters.

Step 1: Connect to the Domain Controller Via Remote Desktop

![alt-text](./media/apache-domain-joined-create-configure-esp/image012.png)

Step 2: Use your `Domain_Name\\Administrator` user you have provided in the previous step during deployment

![alt-text](./media/apache-domain-joined-create-configure-esp/image014.png)

Step 3: Launch Active Directory Users and Computers from Server Manager Console

![alt-text](./media/apache-domain-joined-create-configure-esp/image016.png)

Step 4: Create two New Users, **HDIAdmin**, **HDIUser** as the usernames. These are the users names that will be will be used to login to HDInsight clusters.

![alt-text](./media/apache-domain-joined-create-configure-esp/image018.png)

![alt-text](./media/apache-domain-joined-create-configure-esp/image020.png)
 
![alt-text](./media/apache-domain-joined-create-configure-esp/image022.png)

Second Admin User

![alt-text](./media/apache-domain-joined-create-configure-esp/image024.png)

Step 5: Create HDIUserGroup as a new Group

![alt-text](./media/apache-domain-joined-create-configure-esp/image026.png)

![alt-text](./media/apache-domain-joined-create-configure-esp/image028.png)

Step 6: Add HDIUser Created in previous step to this HDIUserGroup as a member

Go to Properties of the HDIUserGroup

![alt-text](./media/apache-domain-joined-create-configure-esp/image030.png)

Go to Members Tab

![alt-text](./media/apache-domain-joined-create-configure-esp/image032.png)

Add HDIUser to this group

![alt-text](./media/apache-domain-joined-create-configure-esp/image034.png)

Click OK

![alt-text](./media/apache-domain-joined-create-configure-esp/image036.png)

[Now that we have our Active Directory environment setup, with the Users and User group will be create on the AD Evrionment that will be synchronized with Azure AD, ]

### Now we need an Azure AD tenant so that we can Synchronize our users and user group created on the on Prem AD to the cloud

![alt-text](./media/apache-domain-joined-create-configure-esp/image038.png)

![alt-text](./media/apache-domain-joined-create-configure-esp/image040.png)

![alt-text](./media/apache-domain-joined-create-configure-esp/image042.png)

![alt-text](./media/apache-domain-joined-create-configure-esp/image044.png)

> [!Note]
> If you want to change the password for the newly created user <fabrikamazureadmin@hdifabrikam.com>. Login to the Azure portal using the identity and then you will prompted to change the password.

![alt-text](./media/apache-domain-joined-create-configure-esp/image046.png)

![alt-text](./media/apache-domain-joined-create-configure-esp/image048.png)

### Download and Install AAD-Connect to the On-Prem Domain Controller to sync Users to Azure AD

Step 1: Download Azure AD Connect and Install Microsoft Azure Active Directory Connect

Link: <https://www.microsoft.com/en-us/download/details.aspx?id=47594>

Step 2: Install Microsoft Azure Active Directory Connect on the Domain Controller

![alt-text](./media/apache-domain-joined-create-configure-esp/image050.png)

![alt-text](./media/apache-domain-joined-create-configure-esp/image052.png)

![alt-text](./media/apache-domain-joined-create-configure-esp/image054.png)

![alt-text](./media/apache-domain-joined-create-configure-esp/image056.png)

Step 3: Configure Sync between On-Premises Domain Controller and Azure AD

1. On the Connect to Azure AD screen, enter the username and password the global administrator for Azure AD.
Click **Next**. (Azure AD has to be configured before proceeding with this step)
    ![alt-text](./media/apache-domain-joined-create-configure-esp/image058.png)
1. On the Connect to Active Directory Domain Services screen, enter the username and password for an enterprise admin account. Click **Next**.
    ![alt-text](./media/apache-domain-joined-create-configure-esp/image060.png)
    ![alt-text](./media/apache-domain-joined-create-configure-esp/image062.png)
1. On the Ready to configure screen, click **[Install]**.
    ![alt-text](./media/apache-domain-joined-create-configure-esp/image064.png)
    ![alt-text](./media/apache-domain-joined-create-configure-esp/image066.png)
    ![alt-text](./media/apache-domain-joined-create-configure-esp/image068.png)
    ![alt-text](./media/apache-domain-joined-create-configure-esp/image070.png)
    ![alt-text](./media/apache-domain-joined-create-configure-esp/image072.png)
    ![alt-text](./media/apache-domain-joined-create-configure-esp/image074.png)
    ![alt-text](./media/apache-domain-joined-create-configure-esp/image076.png)
    ![alt-text](./media/apache-domain-joined-create-configure-esp/image078.png)
1. After the syn is complete confirm if the users that you created on the IAAS Active Directory are Synced to
    ![alt-text](./media/apache-domain-joined-create-configure-esp/image080.jpg)
1. Next step is to create an User assigned managed Identity that will be used to configure on AADDS. 
    ![alt-text](./media/apache-domain-joined-create-configure-esp/image082.png)
1. Next step is to Enable Azure Active Directory Domain Services using Azure Portal. 
[Refer ][[ ]<https://docs.microsoft.com/en-us/azure/active-directory-domain-services/active-directory-ds-getting-started>[Lets start off creating the Virtual Network to host AADDS]

```powershell
Connect-AzAccount
Get-AzSubscription
Set-AzContext -Subscription d3f35892-70bb-44c8-a19d-6aa86f765816
$virtualNetwork = New-AzVirtualNetwork -ResourceGroupName HDIFabrikam-CentralUS -Location 'Central US' -Name HDIFabrikam-AADDSVNET -AddressPrefix 10.1.0.0/16
$subnetConfig = Add-AzVirtualNetworkSubnetConfig -Name -AddressPrefix 10.1.0.0/24 -VirtualNetwork $virtualNetwork
$virtualNetwork | Set-AzVirtualNetwork
```

We are enabling this service in Central US region, the select the Directory Name as that of the Azure Active Directory and that would be "HDIFabrikam"

![alt-text](./media/apache-domain-joined-create-configure-esp/image084.png)

Select the network and the subnet that we created in the previous step

![alt-text](./media/apache-domain-joined-create-configure-esp/image086.png)

![alt-text](./media/apache-domain-joined-create-configure-esp/image088.png)

![alt-text](./media/apache-domain-joined-create-configure-esp/image090.png)
![](./media/apache-domain-joined-create-configure-esp/image092.png)

![alt-text](./media/apache-domain-joined-create-configure-esp/image094.png)

[After you enable Azure AD-DS, a local Domain Name Service (DNS) server runs on the AD Virtual Machines (VMs), To Configure your Azure AADDS Virtual Network (VNET) to use custom DNS servers.

First locate the right IP addresses, select **[Properties]** of HDIFabricam.com AADDS, and look at the IP Addresses listed beneath **IP Address on Virtual Network]**

![alt-text](./media/apache-domain-joined-create-configure-esp/image096.png)

Change the configuration of the DNS servers on the Azure ADDS VNET in this scenario Virtual Network configured for AADDS is **HDIFabrikam-AADDSVNET**.

Configure **HDIFabrikam-AADDSVNET** to custom IPs 10.0.04 and 10.0.0.5.

Select **DNS Servers** under the **Settings** category. then click the radio button next to **Custom**, enter the first IP Address (10.0.04) [ ]in the text box below, and click **Save**.

Add additional IP Addresses (10.0.0.5) using the same steps.

In our scenario AADDS was configured to use IP Addresses 10.0.0.4 and 10.0.0.5, setting the same IP address on AADDS VNet as show in the image below.

![alt-text](./media/apache-domain-joined-create-configure-esp/image098.png)

Lightweight Directory Access Protocol (LDAP) is used to read from and write to Active Directory. You can make LDAP traffic confidential and secure by using Secure Sockets Layer (SSL) / Transport Layer Security (TLS) technology. You can enable LDAP over SSL (LDAPS) by installing a properly formatted certificate.

Reference : [Configure secure LDAP (LDAPS) for an Azure AD Domain Services managed domain](https://docs.microsoft.com/en-us/azure/active-directory-domain-services/active-directory-ds-admin-guide-configure-secure-ldap)

This section details the steps to create a self-signed certification, download the certificate and [ ]configure secure LDAP (LDAPS) for **hdifabrikam** Azure AD Domain Services managed domain. HDIFabrikam being the domain name, following powerShell script would create a certificate for hdifabrikam and will be saved under
certificates path "LocalMachine" here is the powershell command.

### Creating the certificate request

Any utility or application that creates a valid PKCS \#10 request can be used to form the SSL certificate request. In this case we are using PowerShell

```powershell
$lifetime = Get-Date
New-SelfSignedCertificate -Subject hdifabrikam.com `
-NotAfter $lifetime.AddDays(365) -KeyUsage DigitalSignature, KeyEncipherment `
-Type SSLServerAuthentication -DnsName *.hdifabrikam.com, hdifabrikam.com
```

![alt-text](./media/apache-domain-joined-create-configure-esp/image100.jpg)

Verify that the certificate is installed in the computer\'s Personal store. To do this, follow these
steps:
1. Start Microsoft Management Console (MMC).
1. Add the Certificates snap-in that manages certificates on the local computer.
1. Expand **Certificates (Local Computer)**, expand **Personal**, and then expand **Certificates**.

A new certificate should exist in the Personal store. This certificate is issued to the fully qualified host name.

![alt-text](./media/apache-domain-joined-create-configure-esp/image102.png)

In the right pane, right-click the certificate that you created in the previous step, point to **All Tasks**, and then click **Export**.

On the **[Export Private Key]** page, click **[Yes, export the private, t]**he private key is required for the encrypted messages to be read from the computer where the key will be imported.**[key]**. ]

![alt-text](./media/apache-domain-joined-create-configure-esp/image103.png)

On the **Export File Format** page, leave the default settings, and then click **Next**. On the **Password** page, type password for the private key.

![alt-text](./media/apache-domain-joined-create-configure-esp/image105.png)

On the **[File to Export]** page, type the path and the name for the exported certificate file, and then
click **[Next]**.

![alt-text](./media/apache-domain-joined-create-configure-esp/image107.png)

The file name has to be .pfx extension, this file is configured on Azure Portal to establish secure connection.

![alt-text](./media/apache-domain-joined-create-configure-esp/image109.png)

![alt-text](./media/apache-domain-joined-create-configure-esp/image111.png)

Enable secure LDAP (LDAPS) for an Azure AD Domain Services managed domain

![alt-text](./media/apache-domain-joined-create-configure-esp/image113.png)

Now that you enabled Secure LDAP, make sure it is reachable by enable the port 636.

![alt-text](./media/apache-domain-joined-create-configure-esp/image115.jpg)

HDIFabrikamManagedIdentity is the user-assigned managed identity, the HDInsight Domain Services Contributor role is enabled to the managed identity that will enable this Identity to read, create, modify, and delete domain services operations.

![alt-text](./media/apache-domain-joined-create-configure-esp/image117.png)

Creating Enterprise Security Package Enabled HDInsight cluster

This Step requires 3 Pre-requisites.

1. First step is to create Virtual Network that will host ESP enabled HDInsight cluster

    ```powershell
    $virtualNetwork = New-AzVirtualNetwork -ResourceGroupName HDIFabrikam-WestUS -Location 'west US' -Name HDIFabrikam-HDIVNet -AddressPrefix 10.1.0.0/16
    $subnetConfig = Add-AzVirtualNetworkSubnetConfig -Name SparkSubnet -AddressPrefix 10.1.0.0/24 -VirtualNetwork $virtualNetwork
    $virtualNetwork | Set-AzVirtualNetwork
    ```

1. Next step is to PEER the Virtual Network that is hosting AADDS and the Virtual Network that will host ESP enabled HDInsight cluster

    ```powershell
    Add-AzVirtualNetworkPeering -Name HDIVNet-AADDSVNet -RemoteVirtualNetworkId (Get-AzVirtualNetwork -ResourceGroupName HDIFabrikam-CentralUS).Id -VirtualNetwork (Get-AzVirtualNetwork -ResourceGroupName HDIFabrikam-WestUS)

    Add-AzVirtualNetworkPeering -Name AADDSVNet-HDIVNet -RemoteVirtualNetworkId (Get-AzVirtualNetwork -ResourceGroupName HDIFabrikam-WestUS).Id -VirtualNetwork (Get-AzVirtualNetwork -ResourceGroupName HDIFabrikam-CentralUS)
    ```

1. Step is storage Account and one additional step is to

![alt-text](./media/apache-domain-joined-create-configure-esp/image119.png)

**Hdigen2store** ADL Gen 2 store, is enabled to use an user Managed Identity **HDIFabrikamManagedIdentity**. While creating the HDInsight cluster this identity will be used to configure the store**.** When a HDI clusters need to make an outbound request, it can identify itself with this configured Managed Identity **HDIFabrikamManagedIdentity** and pass this identity along with the request to access the store.

![alt-text](./media/apache-domain-joined-create-configure-esp/image121.png)

![alt-text](./media/apache-domain-joined-create-configure-esp/image123.png)

![alt-text](./media/apache-domain-joined-create-configure-esp/image125.jpg)

![alt-text](./media/apache-domain-joined-create-configure-esp/image127.jpg)

![alt-text](./media/apache-domain-joined-create-configure-esp/image129.jpg)

![alt-text](./media/apache-domain-joined-create-configure-esp/image131.jpg)

![alt-text](./media/apache-domain-joined-create-configure-esp/image133.jpg)

![alt-text](./media/apache-domain-joined-create-configure-esp/image135.jpg)

![alt-text](./media/apache-domain-joined-create-configure-esp/image137.jpg)

![alt-text](./media/apache-domain-joined-create-configure-esp/image139.jpg)

![alt-text](./media/apache-domain-joined-create-configure-esp/image141.jpg)