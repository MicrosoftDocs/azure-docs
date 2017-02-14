---
title: Connect to Kafka on HDInsight using a VPN gateway - Azure | Microsoft Docs
description: Learn how to connect client systems directly to Apache Kafka on HDInsight by using a VPN. This connects the client systems directly to the Azure Virtual Network that the HDInsight cluster uses, which allows the client to directly communicate with Kafka and other services on HDInsight.
services: hdinsight
documentationCenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.service: hdinsight
ms.devlang: ''
ms.topic: article
ms.tgt_pltfrm: 'na'
ms.workload: big-data
ms.date: 01/30/2017
ms.author: larryfr

---

# Connect to Kafka on HDInsight using a VPN gateway

Learn how to connect directly to Kafka on HDInsight by using an Azure Virtual Network configured for point-to-site communication. Point-to-site configuration provides a VPN gateway that clients can use to connect to the virtual network and communicate directly with the HDInsight cluster.

## Why use VPN

HDInsight clusters are secured inside an Azure Virtual Network, and only allow incoming SSH and HTTPS traffic. You cannot connect to the Kafka brokers directly over the internet. Instead, you must use a VPN gateway into the virtual network that contains HDInsight. This allows remote clients to directly connect to Kafka over the internet.

> [!NOTE]
> Kafka applications that run directly on the cluster are already inside the virtual network.

The information in this document is primarily for the following scenarios:

* __Mirroring between two Kafka clusters__. For example, you may want to mirror Kafka topics between an on-premises Kafka cluster and Kafka on HDInsight.

* __Remote consumer or producers__. For example, you may have on-premises applications that need to directly read or write to Kafka on HDInsight.

## How it works

[TBD diagram]

> [!IMPORTANT]
> HDInsight is secured inside an Azure Virtual Network. If you create an HDInsight cluster and do not specify a virtual network, one is automatically created. However, this auto-created virtual network is hidden and you cannot add a VPN gateway to it.
>
> To use VPN to connect to HDInsight, you must instead create the virtual network first. Then specify the virtual network when creating the HDInsight cluster. This gives you full control over the virtual network, including the ability to configure a VPN gateway.

* __Virtual Network__: Provides a security boundary for HDInsight. Includes a default gateway that provides internet access to SSH and HTTPS services hosted on the cluster head nodes.

* __VPN gateway__: Allows remote clients to join the virtual network and directly communicate with the HDInsight cluster. The VPN gateway created by this template uses an IP address pool of 172.16.201.0/24 to assign IPs to clients. Access to the VPN gateway uses certificate authentication.

* __VPN client__: The VPN gateway created in Azure only provides a downloadable VPN client for Windows. See the following links for VPN clients that may work with Linux or OS X clients.

    * [TBD]

## Domain name resolution

> [!IMPORTANT]
> One of the limitations of Azure Virtual Networks is that the automatic domain name resolution provided by the virtual network only works for Azure resources. When connecting to the network using the VPN gateway, your client can only use IP addresses to connect to the HDInsight cluster.

While it is possible to create an Azure Virtual Machine to act as a custom DNS server for the virtual network, this is beyond the scope of this document. If you are familiar with configuring a DNS server, see [Manage DNS servers used by a virtual network](../virtual-network/virtual-networks-manage-dns-in-vnet.md) for more information on how to add the DNS server to your virtual network configuration.

> [!NOTE]
> HDInsight automatically uses the DNS server information from the virtual network configuration. There are no HDInsight specific steps to use a custom DNS server.

The information in this document is based on using only IP addresses to access HDInsight over the VPN gateway.

## Create through PowerShell

Use the following steps to create an Azure Virtual Network, VPN gateway, storage account, and Kafka on HDInsight cluster:

1. Using a text editor, create a new file named `Create-HDInsightWithVPN.ps1` and use the following as the file contents:

    ```PowerShell
    param(
        [Parameter(Mandatory=$true)]
        [String]$resourceGroupName,
        [Parameter(Mandatory=$true)]
        [String]$location,
        [Parameter(Mandatory=$true)]
        [String]$baseName,
        [Parameter(Mandatory=$true)]
        [String]$rootCert
    )

    # Login to your Azure subscription
    # Is there an active Azure subscription?
    $sub = Get-AzureRmSubscription -ErrorAction SilentlyContinue
    if(-not($sub))
    {
        Add-AzureRmAccount
    }

    # If you have multiple subscriptions, uncomment the following
    # and use it to set the subscription used in this script
    # Select-AzureRmSubscription -SubscriptionName "Name of subscription"

    # Prompt for HDInsight credentials
    $adminCreds = Get-Credential -Message "Enter the HTTPS user name and password for the HDInsight cluster" -UserName "admin"
    $sshCreds = Get-Credential -Message "Enter the SSH user name and password for the HDInsight cluster" -UserName "sshuser"

    # Names for Azure resources
    $networkName = "net-$baseName"
    $clusterName = "kafka-$baseName"
    $storageName = "store$baseName" # Can't use dashes in storage names
    $defaultContainerName = $clusterName
    $defaultSubnetName = "default"
    $gatewaySubnetName = "GatewaySubnet"
    $gatewayPublicIpName = "GatewayIp"
    $gatewayIpConfigName = "GatewayConfig"
    $vpnRootCertName = "rootcert"
    $vpnName = "VPNGateway"

    # Network settings
    $networkAddressPrefix = "10.0.0.0/16"
    $defaultSubnetPrefix = "10.0.0.0/24"
    $gatewaySubnetPrefix = "10.0.1.0/24"
    $vpnClientAddressPool = "172.16.201.0/24"

    # HDInsight settings
    $HdiWorkerNodes = 4
    $hdiVersion = "3.4"
    $hdiType = "Kafka"

    # Create the resource group that will contain everything
    New-AzureRmResourceGroup -Name $resourceGroupName -Location $location

    # Create the subnet configuration
    $defaultSubnetConfig = New-AzureRmVirtualNetworkSubnetConfig -Name $defaultSubnetName `
        -AddressPrefix $defaultSubnetPrefix
    $gatewaySubnetConfig = New-AzureRmVirtualNetworkSubnetConfig -Name $gatewaySubnetName `
        -AddressPrefix $gatewaySubnetPrefix

    # Create the subnet
    New-AzureRmVirtualNetwork -Name $networkName `
        -ResourceGroupName $resourceGroupName `
        -Location $location `
        -AddressPrefix $networkAddressPrefix `
        -Subnet $defaultSubnetConfig, $gatewaySubnetConfig

    # Get the network & subnet that were created
    $network = Get-AzureRmVirtualNetwork -Name $networkName `
        -ResourceGroupName $resourceGroupName
    $gatewaySubnet = Get-AzureRmVirtualNetworkSubnetConfig -Name $gatewaySubnetName `
        -VirtualNetwork $network
    $defaultSubnet = Get-AzureRmVirtualNetworkSubnetConfig -Name $defaultSubnetName `
        -VirtualNetwork $network

    # Set a dynamic public IP address for the gateway subnet
    $gatewayPublicIp = New-AzureRmPublicIpAddress -Name $gatewayPublicIpName `
        -ResourceGroupName $resourceGroupName `
        -Location $location `
        -AllocationMethod Dynamic
    $gatewayIpConfig = New-AzureRmVirtualNetworkGatewayIpConfig -Name $gatewayIpConfigName `
        -Subnet $gatewaySubnet `
        -PublicIpAddress $gatewayPublicIp

    # Get the certificate info
    # Get the full path in case a relative path was passed
    $rootCertFile = Get-ChildItem $rootCert
    $cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($rootCertFile)
    $certBase64 = [System.Convert]::ToBase64String($cert.RawData)
    $p2sRootCert = New-AzureRmVpnClientRootCertificate -Name $vpnRootCertName `
        -PublicCertData $certBase64

    # Create the VPN gateway
    New-AzureRmVirtualNetworkGateway -Name $vpnName `
        -ResourceGroupName $resourceGroupName `
        -Location $location `
        -IpConfigurations $gatewayIpConfig `
        -GatewayType Vpn `
        -VpnType RouteBased `
        -EnableBgp $false `
        -GatewaySku Standard `
        -VpnClientAddressPool $vpnClientAddressPool `
        -VpnClientRootCertificates $p2sRootCert

    # Create the storage account
    New-AzureRmStorageAccount `
        -ResourceGroupName $resourceGroupName `
        -Name $storageName `
        -Type Standard_GRS `
        -Location $location

    # Get the storage account keys and create a context
    $defaultStorageKey = (Get-AzureRmStorageAccountKey -ResourceGroupName $resourceGroupName `
        -Name $storageName)[0].Value
    $storageContext = New-AzureStorageContext -StorageAccountName $storageName `
        -StorageAccountKey $defaultStorageKey

    # Create the default storage container
    New-AzureStorageContainer -Name $defaultContainerName `
        -Context $storageContext

    # Create the HDInsight cluster
    New-AzureRmHDInsightCluster `
        -ResourceGroupName $resourceGroupName `
        -ClusterName $clusterName `
        -Location $location `
        -ClusterSizeInNodes $hdiWorkerNodes `
        -ClusterType $hdiType `
        -OSType Linux `
        -Version $hdiVersion `
        -HttpCredential $adminCreds `
        -SshCredential $sshCreds `
        -DefaultStorageAccountName "$storageName.blob.core.windows.net" `
        -DefaultStorageAccountKey $defaultStorageKey `
        -DefaultStorageContainer $defaultContainerName `
        -VirtualNetworkId $network.Id `
        -SubnetName $defaultSubnet.Id

    # Get the URI for the the Windows VPN client installer download
    Get-AzureRmVpnClientPackage -ResourceGroupName $resourceGroupName `
        -VirtualNetworkGatewayName $vpnName `
        -ProcessorArchitecture Amd64
    ```

2. Follow the steps in the [Working with self-signed certificates for Point-to-site connections](../vpn-gateway/vpn-gateway-certificates-point-to-site.md) document to create the certificates needed for the gateway.

    This generates the certificates used to authenticate clients to the VPN gateway.

3. To run the script, use the following command from a PowerShell prompt:

    ```PowerShell
    .\Create-HDInsightWithVPN.ps1 -resourceGroupName <groupname> -location <location> -baseName <basename> -rootCert <rootcertificate>

    * Replace __&lt;groupname>__ with the name of the Azure resource group to be created by the script. This resource group contains the services created by this script.

    * Replace __&lt;location>__ with the Azure region to create the services in.

    * Replace __&lt;basename>__ with a base name for the services created by the script. For example, using a basename of "contoso" will create a Kafka cluster named "kafka-contoso".

    * Replace __&lt;rootcertificate>__ with the path to the root certificate (.cer file) exported from the steps in the [Working with self-signed certificates for Point-to-site connections](../vpn-gateway/vpn-gateway-certificates-point-to-site.md) document. The cotents of this file appear similar to the following:

        ```
        -----BEGIN CERTIFICATE-----
        MIIC+TCCAeWgAwIBAgIQCsiv2ehq541F1yR324byFTAJBgUrDgMCHQUAMBYxFDAS
        BgNVBAMTC1ZQTlJvb3RDZXJ0MB4XDTE3MDEwNjIxNDU1NVoXDTM5MTIzMTIzNTk1
        OVowFjEUMBIGA1UEAxMLVlBOUm9vdENlcnQwggEiMA0GCSqGSIb3DQEBAQUAA4IB
        DwAwggEKAoIBAQCd3OwydpCmFTAkK+iJ3cbaqBpFFvydO/bf8jhZx9qi4PkiCPIU
        zf2LrVR5gtVkcbBGWAdk1AOgKMnwGO/BBwIqF5/yNH+TmiHf4hiYhTtoIoVQmCOT
        NMcBGEAIjNRgvCZ+LA4crL8s7S+nRbNu079oLMeRmcJLt0KW8xuRkxLQ3hlYwXLs
        6j3iincyf0dKDX4n9UlEPRUOxzNhN2eO3AHipdg21LsV+CCVuZfD2oltarx8NFKN
        pteUTRqpS1c8S1ga4qoiy7Sex6YMs+9sdOIqkokG3RJowqRV99Ip1kSSTWcs6jI1
        zaUbAdYteCPtR6jRLlAEmAqD/rWJFGYhaj3FAgMBAAGjSzBJMEcGA1UdAQRAMD6A
        ED8cbOrMOUQ+BUzM7D62kImhGDAWMRQwEgYDVQQDEwtWUE5Sb290Q2VydIIQCsiv
        2ehq541F1yR324byFTAJBgUrDgMCHQUAA4IBAQAujBrs0bORvW2Iw28euYFIIx6j
        Na3F/l/UVIjPUWOQu18R4ynMKwZnn3TrtwHuaSwru9c8PbpX6Bjj/8U+8O47hEAV
        laMlmZrErKYyTZbJcaPocpeVjDgNCTmaKe7iLl1JaGhhTgMp6MHGTm/KRfIr6iTV
        0dfP+NZLXeHAlG69juU3lVvYK2Rm0IYsvFVqh5gdppE0PUqQVv+5Efc65bIfFwXe
        gpSpD4jIACEL375G6Hlc77hNgzlLUdYR3ADeBf6as9Kb40jAxEtJmw3UvZ2pDiuL
        0P8ENZ2BVa0iOVS+GzP0WxPHzgZSr1jcHVrnvE/y/10TasGIEqp30lyNUDGn
        -----END CERTIFICATE-----
        ```

    You are prompted to enter the HTTPS login credentials and SSH user credentials for the cluster. These are used to secure HTTPS and SSH access to HDInsight. You may also be prompted to authenticate to your Azure subscription.

## Create through the Azure Portal

### Create the virtual network and VPN gateway

Follow the steps in the [Configure a Point-to-Site connection using the Azure portal](../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md) document to create a new Azure Virtual Network and VPN gateway.

### Create the Kafka cluster

1. Follow the steps in [Get started with Kafka on HDInsight](hdinsight-apache-kafka-get-started.md#create-a-kafka-cluster), but stop on the __Cluster summary__ blade. Do not use the __Create__ button to create the cluster. Once you are at the __Cluster summary__, continue with step 2 below.

2. From the __Cluster summary__ blade, select the __Edit__ link for the __Advanced settings__ section.

    ![Edit link for advanced settings](./media/hdinsight-apache-kafka-connect-vpn-gateway)

3. From the __Advanced settings__ blade, select the virtual network you created perviously. Select the __default__ subnet for the virtual network. Finally, use the __Next__ button to return to the __Cluster summary__.

    ![Advanced settings blade](./media/hdinsight-apache-kafka-connect-vpn-gateway)

4. From the __Cluster summary__ blade, use the __Create__ button to create the cluster.

## Configure Kafka

By default, Zookeeper returns the domain name of the Kafka brokers to clients. Since there is no DNS server to resolve the domain names, use the following steps to configure the cluster to return IP addresses instead.

1. From a web browser, navigate to https://CLUSTERNAME.azurehdinsight.net/. Replace __CLUSTERNAME__ with the name of your HDInsight cluster. This opens the Ambari Web UI for the cluster.

2. From the Ambari Web UI, select 


1. You need to append the kafka-env template in the Ambari Web UI with the following value. It essentially tells Kafka to use the ip address to register with Zookeeper. One has to switch to using advertised.listeners instead of advertised.host.name.
One can push data into Kafka brokers over vnet peering by using ip addresses
One can also push data into local brokers from the headnode using both ip-address and host name after making this change.
IP_ADDRESS=$(hostname -i)
echo advertised.listeners=$IP_ADDRESS
sed -i.bak -e '/advertised/{/advertised@/!d;}' /usr/hdp/current/kafka-broker/conf/server.properties
echo "advertised.listeners=PLAINTEXT://$IP_ADDRESS:9092" >> /usr/hdp/current/kafka-broker/conf/server.properties

Changing the value of *listeners* from PLAINTEXT://localhost:9092 to PLAINTEXT://0.0.0.0:9092 in Kafka Broker is OPTIONAL. It just tells Kafka to bind on all network interfaces.

## Additional information

For more information on creating an Azure Virtual Network with Point-to-Site VPN gateway, see the following documents:

* [Configure a Point-to-Site connection using the Azure portal](../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md)

* [Configure a Point-to-Site connection using Azure PowerShell](../vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps.md)

For more information on 
