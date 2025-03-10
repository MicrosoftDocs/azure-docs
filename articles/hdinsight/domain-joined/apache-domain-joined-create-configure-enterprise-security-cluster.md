---
title: Create, configure Enterprise Security Package clusters - Azure
description: Learn how to create and configure Enterprise Security Package clusters in Azure HDInsight
services: hdinsight
ms.service: azure-hdinsight
ms.topic: how-to
ms.date: 12/11/2024
ms.custom: devx-track-azurepowershell
---

# Create and configure Enterprise Security Package clusters in Azure HDInsight

Enterprise Security Package (ESP) for Azure HDInsight gives you access to Microsoft Entra ID-based authentication, multiuser support, and role-based access control for your Apache Hadoop clusters in Azure. HDInsight ESP clusters enable organizations that adhere to strict corporate security policies to process sensitive data securely.

This guide shows how to create an ESP-enabled Azure HDInsight cluster. It also shows how to create a Windows IaaS VM on which Microsoft Entra ID and Domain Name System (DNS) are enabled. Use this guide to configure the necessary resources to allow on-premises users to sign in to an ESP-enabled HDInsight cluster.

The server you create will act as a replacement for your *actual* on-premises environment. You'll use it for the setup and configuration steps. Later you'll repeat the steps in your own environment.

This guide will also help you create a hybrid identity environment by using password hash sync with Microsoft Entra ID. The guide complements [Use ESP in HDInsight](apache-domain-joined-architecture.md).

Before you use this process in your own environment:

* Set up Microsoft Entra ID and DNS.
* Enable Microsoft Entra ID.
* Sync on-premises user accounts to Microsoft Entra ID.

:::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0002.png" alt-text="Microsoft Entra architecture diagram." border="false":::

## Create an on-premises environment

In this section, you'll use an Azure Quickstart deployment template to create new VMs, configure DNS, and add a new Microsoft Entra ID forest.

1. Go to the Quickstart deployment template to [Create an Azure VM with a new Microsoft Entra ID forest](https://azure.microsoft.com/resources/templates/active-directory-new-domain/).

1. Select **Deploy to Azure**.
1. Sign in to your Azure subscription.
1. On the **Create an Azure VM with a new AD Forest** page, provide the following information:

    |Property | Value |
    |---|---|
    |Subscription|Select the subscription where you want to deploy the resources.|
    |Resource group|Select **Create new**, and enter the name `OnPremADVRG`|
    |Location|Select a location.|
    |Admin Username|`HDIFabrikamAdmin`|
    |Admin Password|Enter a password.|
    |Domain Name|`HDIFabrikam.com`|
    |Dns Prefix|`hdifabrikam`|

    Leave the remaining default values.

    :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/create-azure-vm-ad-forest.png" alt-text="Template for Create an Azure VM with a new Microsoft Entra Forest." border="true":::

1. Review the **Terms and Conditions**, and then select **I agree to the terms and conditions stated above**.
1. Select **Purchase**, and monitor the deployment and wait for it to complete. The deployment takes about 30 minutes to complete.

## Configure users and groups for cluster access

In this section, you'll create the users that will have access to the HDInsight cluster by the end of this guide.

1. Connect to the domain controller by using Remote Desktop.
    1. From the Azure portal, navigate to **Resource groups** > **OnPremADVRG** > **adVM** > **Connect**.
    1. From the **IP address** drop-down list, select the public IP address.
    1. Select **Download RDP File**, and then open the file.
    1. Use `HDIFabrikam\HDIFabrikamAdmin` as the user name.
    1. Enter the password that you chose for the admin account.
    1. Select **OK**.

1. From the domain controller **Server Manager** dashboard, navigate to **Tools** > **Microsoft Entra ID Users and Computers**.

    :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/server-manager-active-directory-screen.png" alt-text="On the Server Manager dashboard, open Microsoft Entra ID Management." border="true":::

1. Create two new users: **HDIAdmin** and **HDIUser**. These two users will sign in to HDInsight clusters.

    1. From the **Microsoft Entra ID Users and Computers** page, right-click `HDIFabrikam.com`, and then navigate to  **New** > **User**.

        :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/create-active-directory-user.png" alt-text="Create a new Microsoft Entra ID user." border="true":::

    1. On the **New Object - User** page, enter `HDIUser` for **First name** and **User logon name**. The other fields will autopopulate. Then select **Next**.

        :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0020.png" alt-text="Create the first admin user object." border="true":::

    1. In the pop-up window that appears, enter a password for the new account. Select **Password never expires**, and then **OK** at the pop-up message.
    1. Select **Next**, and then **Finish** to create the new account.
    1. Repeat the above steps to create the user `HDIAdmin`.

        :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0024.png" alt-text="Create a second admin user object." border="true":::

1. Create a security group.

    1. From **Microsoft Entra ID Users and Computers**, right-click `HDIFabrikam.com`, and then navigate to  **New** > **Group**.

    1. Enter `HDIUserGroup` in the **Group name** text box.

    1. Select **OK**.

    :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/create-active-directory-group.png" alt-text="Create a new Microsoft Entra ID group." border="true":::

    :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0028.png" alt-text="Create a new object." border="true":::

1. Add members to **HDIUserGroup**.

    1. Right-click **HDIUser** and select **Add to a group...**.
    1. In the **Enter the object names to select** text box, enter `HDIUserGroup`. Then select **OK**, and **OK** again at the pop-up.
    1. Repeat the previous steps for the **HDIAdmin** account.

        :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/active-directory-add-users-to-group.png" alt-text="Add the member HDIUser to the group HDIUserGroup." border="true":::

You've now created your Microsoft Entra ID environment. You've added two users and a user group that can access the HDInsight cluster.

The users will be synchronized with Microsoft Entra ID.

<a name='create-an-azure-ad-directory'></a>

### Create a Microsoft Entra directory

1. Sign in to the Azure portal.
1. Select **Create a resource** and type `directory`. Select **Microsoft Entra ID** > **Create**.
1. Under **Organization name**, enter `HDIFabrikam`.
1. Under **Initial domain name**, enter `HDIFabrikamoutlook`.
1. Select **Create**.

   :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/create-new-directory.png" alt-text="Create a Microsoft Entra directory." border="true":::

### Create a custom domain

1. From your new **Microsoft Entra ID**, under **Manage**, select **Custom domain names**.
1. Select **+ Add custom domain**.
1. Under **Custom domain name**, enter `HDIFabrikam.com`, and then select **Add domain**.
1. Then complete [Add your DNS information to the domain registrar](../../active-directory/fundamentals/add-custom-domain.md#add-your-dns-information-to-the-domain-registrar).

   :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/create-custom-domain.png" alt-text="Create a custom domain." border="true":::

### Create a group

1. From your new **Microsoft Entra ID**, under **Manage**, select **Groups**.
1. Select **+ New group**.
1. In the **group name** text box, enter `AAD DC Administrators`.
1. Select **Create**.

<a name='configure-your-azure-ad-tenant'></a>

## Configure your Microsoft Entra tenant

Now you'll configure your Microsoft Entra tenant so that you can synchronize users and groups from the on-premises Microsoft Entra ID instance to the cloud.

Create a Microsoft Entra ID tenant administrator.

1. Sign in to the Azure portal and select your Microsoft Entra tenant, **HDIFabrikam**.

1. Navigate to **Manage** > **Users** > **New user**.

1. Enter the following details for the new user:

   **Identity**

   |Property |Description |
   |---|---|
   |User name|Enter `fabrikamazureadmin` in the text box. From the domain name drop-down list, select `hdifabrikam.com`|
   |Name| Enter `fabrikamazureadmin`.|

   **Password**
   1. Select **Let me create the password**.
   1. Enter a secure password of your choice.

   **Groups and roles**
   1. Select **0 groups selected**.
   1. Select **`AAD DC` Administrators**, and then **Select**.

      :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/azure-ad-add-group-member.png" alt-text="The Microsoft Entra groups dialog box." border="true":::

   1. Select **User**.
   1. Select **Administrator**, and then **Select**.

1. Select **Create**.

1. Then have the new user sign in to the Azure portal where it will be prompted to change the password. You'll need to do this before configuring Microsoft Entra Connect.

<a name='sync-on-premises-users-to-azure-ad'></a>

## Sync on-premises users to Microsoft Entra ID

<a name='configure-microsoft-azure-active-directory-connect'></a>

### Configure Microsoft Entra Connect

1. From the domain controller, download [Microsoft Entra Connect](https://www.microsoft.com/download/details.aspx?id=47594).

1. Open the executable file that you downloaded, and agree to the license terms. Select **Continue**.

1. Select **Use express settings**.

1. On the **Connect to Microsoft Entra ID** page, enter the username and password of the [Domain Name Administrator](/entra/identity/role-based-access-control/permissions-reference#domain-name-administrator) for Microsoft Entra ID. Use the username `fabrikamazureadmin@hdifabrikam.com` that you created when you configured your tenant. Then select **Next**.
   
   :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0058.png" alt-text="Connect to Microsoft Entra ID." border="true":::

1. On the **Connect to Microsoft Entra ID Domain Services** page, enter the username and password for an enterprise admin account. Use the username `HDIFabrikam\HDIFabrikamAdmin` and its password that you created earlier. Then select **Next**.

   :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0060.png" alt-text="Connect to A D D S page." border="true":::

1. On the **Microsoft Entra sign-in configuration** page, select **Next**.

   :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0062.png" alt-text="Microsoft Entra sign-in configuration page." border="true":::

1. On the **Ready to configure** page, select **Install**.

   :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0064.png" alt-text="Ready to configure page." border="true":::

1. On the **Configuration complete** page, select **Exit**.
   :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0078.png" alt-text="Configuration complete page." border="true":::

1. After the sync completes, confirm that the users you created on the IaaS directory are synced to Microsoft Entra ID.
   1. Sign in to the Azure portal.
   1. Select **Microsoft Entra ID** > **HDIFabrikam** > **Users**.

### Create a user-assigned managed identity

Create a user-assigned managed identity that you can use to configure Microsoft Entra Domain Services. For more information, see [Create, list, delete, or assign a role to a user-assigned managed identity by using the Azure portal](../../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md).

1. Sign in to the Azure portal.
1. Select **Create a resource** and type `managed identity`. Select **User Assigned Managed Identity** > **Create**.
1. For the **Resource Name**, enter `HDIFabrikamManagedIdentity`.
1. Select your subscription.
1. Under **Resource group**, select **Create new** and enter `HDIFabrikam-CentralUS`.
1. Under **Location**, select **Central US**.
1. Select **Create**.

:::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0082.png" alt-text="Create a new user-assigned managed identity." border="true":::

<a name='enable-azure-ad-ds'></a>

### Enable Microsoft Entra Domain Services

Follow these steps to enable Microsoft Entra Domain Services. For more information, see [Enable Microsoft Entra Domain Services by using the Azure portal](../../active-directory-domain-services/tutorial-create-instance.md).

1. Create a virtual network to host Microsoft Entra Domain Services. Run the following PowerShell code.

    ```powershell
    # Sign in to your Azure subscription
    $sub = Get-AzSubscription -ErrorAction SilentlyContinue
    if(-not($sub))
    {
        Connect-AzAccount
    }

    # If you have multiple subscriptions, set the one to use
    # Select-AzSubscription -SubscriptionId "<SUBSCRIPTIONID>"
    
    $virtualNetwork = New-AzVirtualNetwork -ResourceGroupName 'HDIFabrikam-CentralUS' -Location 'Central US' -Name 'HDIFabrikam-AADDSVNET' -AddressPrefix 10.1.0.0/16
    $subnetConfig = Add-AzVirtualNetworkSubnetConfig -Name 'AADDS-subnet' -AddressPrefix 10.1.0.0/24 -VirtualNetwork $virtualNetwork
    $virtualNetwork | Set-AzVirtualNetwork
    ```

1. Sign in to the Azure portal.
1. Select **Create resource**, enter `Domain services`, and select **Microsoft Entra Domain Services** > **Create**.
1. On the **Basics** page:
   1. Under **Directory name**, select the Microsoft Entra directory you created: **HDIFabrikam**.
   1. For **DNS domain name**, enter *HDIFabrikam.com*.
   1. Select your subscription.
   1. Specify the resource group **HDIFabrikam-CentralUS**. For **Location**, select **Central US**.

      :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0084.png" alt-text="Microsoft Entra Domain Services basic details." border="true":::

1. On the **Network** page, select the network (**HDIFabrikam-VNET**) and the subnet (**AADDS-subnet**) that you created by using the PowerShell script. Or choose **Create new** to create a virtual network now.

   :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0086.png" alt-text="Create virtual network step." border="true":::

1. On the **Administrator group** page, you should see a notification that a group named **`AAD DC` Administrators** has already been created to administer this group. You can modify the membership of this group if you want to, but in this case you don't need to change it. Select **OK**.

   :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0088.png" alt-text="View the Microsoft Entra administrator group." border="true":::

1. On the **Synchronization** page, enable complete synchronization by selecting **All** > **OK**.

   :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0090.png" alt-text="Enable Microsoft Entra Domain Services synchronization." border="true":::

1. On the **Summary** page, verify the details for Microsoft Entra Domain Services and select **OK**.

   :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0092.png" alt-text="Enable Microsoft Entra Domain Services." border="true":::

After you enable Microsoft Entra Domain Services, a local DNS server runs on the Microsoft Entra VMs.

<a name='configure-your-azure-ad-ds-virtual-network'></a>

### Configure your Microsoft Entra Domain Services virtual network

Use the following steps to configure your Microsoft Entra Domain Services virtual network (**HDIFabrikam-AADDSVNET**) to use your custom DNS servers.

1. Locate the IP addresses of your custom DNS servers.
   1. Select the `HDIFabrikam.com` Microsoft Entra Domain Services resource.
   1. Under **Manage**, select **Properties**.
   1. Find the IP addresses under **IP address on virtual network**.

   :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0096.png" alt-text="Locate custom DNS IP addresses for Microsoft Entra Domain Services." border="true":::

1. Configure **HDIFabrikam-AADDSVNET** to use custom IP addresses 10.0.0.4 and 10.0.0.5.

   1. Under **Settings**, select **DNS Servers**.
   1. Select **Custom**.
   1. In the text box, enter the first IP address (*10.0.0.4*).
   1. Select **Save**.
   1. Repeat the steps to add the other IP address (*10.0.0.5*).

In our scenario, we configured Microsoft Entra Domain Services to use IP addresses 10.0.0.4 and 10.0.0.5, setting the same IP address on the Microsoft Entra Domain Services virtual network:

:::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0098.png" alt-text="The custom DNS servers page." border="true":::

## Securing LDAP traffic

Lightweight Directory Access Protocol (LDAP) is used to read from and write to Microsoft Entra ID. You can make LDAP traffic confidential and secure by using Secure Sockets Layer (SSL) or Transport Layer Security (TLS) technology. You can enable LDAP over SSL (LDAPS) by installing a properly formatted certificate.

For more information about secure LDAP, see [Configure LDAPS for a Microsoft Entra Domain Services managed domain](../../active-directory-domain-services/tutorial-configure-ldaps.md).

In this section, you create a self-signed certificate, download the certificate, and configure LDAPS for the **HDIFabrikam** Microsoft Entra Domain Services managed domain.

The following script creates a certificate for **HDIFabrikam**. The certificate is saved in the *LocalMachine* path.

```powershell
$lifetime = Get-Date
New-SelfSignedCertificate -Subject hdifabrikam.com `
-NotAfter $lifetime.AddDays(365) -KeyUsage DigitalSignature, KeyEncipherment `
-Type SSLServerAuthentication -DnsName *.hdifabrikam.com, hdifabrikam.com
```

> [!NOTE]  
> Any utility or application that creates a valid Public Key Cryptography Standards (PKCS) \#10 request can be used to form the TLS/SSL certificate request.

Verify that the certificate is installed in the computer's **Personal** store:

1. Start Microsoft Management Console (MMC).
1. Add the **Certificates** snap-in that manages certificates on the local computer.
1. Expand **Certificates (Local Computer)** > **Personal** > **Certificates**. A new certificate should exist in the **Personal** store. This certificate is issued to the fully qualified host name.

    :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0102.png" alt-text="Verify local certificate creation." border="true":::

1. In pane on the right, right-click the certificate that you created. Point to **All Tasks**, and then select **Export**.

1. On the **Export Private Key** page, select **Yes, export the private key**. The computer where the key will be imported needs the private key to read the encrypted messages.

   :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0103.png" alt-text="The Export Private Key page of the Certificate Export Wizard." border="true":::

1. On the **Export File Format** page, leave the default settings, and then select **Next**.
1. On the **Password** page, type a password for the private key. For **Encryption**, select **TripleDES-SHA1**. Then select **Next**.
1. On the **File to Export** page, type the path and the name for the exported certificate file, and then select **Next**. The file name has to have a .pfx extension. This file is configured in the Azure portal to establish a secure connection.
1. Enable LDAPS for a Microsoft Entra Domain Services managed domain.
   1. From the Azure portal, select the domain `HDIFabrikam.com`.
   1. Under **Manage**, select **Secure LDAP**.
   1. On the **Secure LDAP** page, under **Secure LDAP**, select **Enable**.
   1. Browse for the .pfx certificate file that you exported on your computer.
   1. Enter the certificate password.

   :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0113.png" alt-text="Enable secure LDAP." border="true":::

1. Now that you've enabled LDAPS, make sure it's reachable by enabling port 636.
   1. In the **HDIFabrikam-CentralUS** resource group, select the network security group **AADDS-HDIFabrikam.com-NSG**.
   1. Under **Settings**, select **Inbound security rules** > **Add**.
   1. On the **Add inbound security rule** page, enter the following properties, and select **Add**:

      | Property | Value |
      |---|---|
      | Source | Any |
      | Source port ranges | * |
      | Destination | Any |
      | Destination port range | 636 |
      | Protocol | Any |
      | Action | Allow |
      | Priority | \<Desired number> |
      | Name | Port_LDAP_636 |

      :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/add-inbound-security-rule.png" alt-text="The Add inbound security rule dialog box." border="true":::

**HDIFabrikamManagedIdentity** is the user-assigned managed identity. The HDInsight Domain Services Contributor role is enabled for the managed identity that will allow this identity to read, create, modify, and delete domain services operations.

:::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0117.png" alt-text="Create a user-assigned managed identity." border="true":::

## Create an ESP-enabled HDInsight cluster

This step requires the following prerequisites:

1. Create a new resource group *HDIFabrikam-WestUS* in the location **West US**.
1. Create a virtual network that will host the ESP-enabled HDInsight cluster.

    ```powershell
    $virtualNetwork = New-AzVirtualNetwork -ResourceGroupName 'HDIFabrikam-WestUS' -Location 'West US' -Name 'HDIFabrikam-HDIVNet' -AddressPrefix 10.1.0.0/16
    $subnetConfig = Add-AzVirtualNetworkSubnetConfig -Name 'SparkSubnet' -AddressPrefix 10.1.0.0/24 -VirtualNetwork $virtualNetwork
    $virtualNetwork | Set-AzVirtualNetwork
    ```

1. Create a peer relationship between the virtual network that hosts Microsoft Entra Domain Services (`HDIFabrikam-AADDSVNET`) and the virtual network that will host the ESP-enabled HDInsight cluster (`HDIFabrikam-HDIVNet`). Use the following PowerShell code to peer the two virtual networks.

    ```powershell
    Add-AzVirtualNetworkPeering -Name 'HDIVNet-AADDSVNet' -RemoteVirtualNetworkId (Get-AzVirtualNetwork -ResourceGroupName 'HDIFabrikam-CentralUS').Id -VirtualNetwork (Get-AzVirtualNetwork -ResourceGroupName 'HDIFabrikam-WestUS')

    Add-AzVirtualNetworkPeering -Name 'AADDSVNet-HDIVNet' -RemoteVirtualNetworkId (Get-AzVirtualNetwork -ResourceGroupName 'HDIFabrikam-WestUS').Id -VirtualNetwork (Get-AzVirtualNetwork -ResourceGroupName 'HDIFabrikam-CentralUS')
    ```

1. Create a new Azure Data Lake Storage Gen2 account called **Hdigen2store**. Configure the account with the user-managed identity **HDIFabrikamManagedIdentity**. For more information, see [Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](../hdinsight-hadoop-use-data-lake-storage-gen2.md).

1. Set up custom DNS on the **HDIFabrikam-AADDSVNET** virtual network.
    1. Go to the Azure portal > **Resource groups** > **OnPremADVRG** > **HDIFabrikam-AADDSVNET** > **DNS servers**.
    1. Select **Custom** and enter *10.0.0.4* and *10.0.0.5*.
    1. Select **Save**.

        :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0123.png" alt-text="Save custom DNS settings for a virtual network." border="true":::

1. Create a new ESP-enabled HDInsight Spark cluster.
    1. Select **Custom (size, settings, apps)**.
    1. Enter details for **Basics** (section 1). Ensure that the **Cluster type** is **Spark 2.3 (HDI 3.6)**. Ensure that the **Resource group** is **HDIFabrikam-CentralUS**.

    1. For **Security + networking** (section 2), fill in the following details:
        * Under **Enterprise Security Package**, select **Enabled**.
        * Select **Cluster admin user** and select the **HDIAdmin** account that you created as the on-premises admin user. Click **Select**.
        * Select **Cluster access group** > **HDIUserGroup**. Any user that you add to this group in the future will be able to access HDInsight clusters.

            :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0129.jpg" alt-text="Select the cluster access group HDIUserGroup." border="true":::

    1. Complete the other steps of the cluster configuration and verify the details on the **Cluster summary**. Select **Create**.

1. Sign in to the Ambari UI for the newly created cluster at `https://CLUSTERNAME.azurehdinsight.net`. Use your admin username `hdiadmin@hdifabrikam.com` and its password.

    :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0135.jpg" alt-text="The Apache Ambari UI sign-in window." border="true":::

1. From the cluster dashboard, select **Roles**.
1. On the **Roles** page, under **Assign roles to these**, next to the **Cluster Administrator** role, enter the group *hdiusergroup*.

    :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0137.jpg" alt-text="Assign the cluster admin role to hdiusergroup." border="true":::

1. Open your Secure Shell (SSH) client and sign in to the cluster. Use the **hdiuser** that you created in the on-premises Microsoft Entra ID instance.

    :::image type="content" source="./media/apache-domain-joined-create-configure-enterprise-security-cluster/hdinsight-image-0139.jpg" alt-text="Sign in to the cluster by using the SSH client." border="true":::

If you can sign in with this account, you've configured your ESP cluster correctly to sync with your on-premises Microsoft Entra ID instance.

## Next steps

Read [An introduction to Apache Hadoop security with ESP](hdinsight-security-overview.md).
