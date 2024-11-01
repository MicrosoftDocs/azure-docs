---
title: Migrate on-premises volumes to Azure NetApp Files 
description: Learn how to peer and migrate on-premises or Cloud Volumes ONTAP volumes to Azure NetApp Files. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 11/01/2024
ms.author: anfdocs
---
# Migrate volumes to Azure NetApp Files 

You can peer and migrate volumes from ONTAP or Cloud Volumes ONTAP to Azure NetApp Files. The feature is only available in the REST API. 

## Considerations 

* On your on-premises storage cluster, you must be running ONTAP 9.9.0 or later.
* SnapMirror license entitlement needs to be obtained and applied to the on-premises or Cloud Volumes ONTAP cluster. If you already have the license, still work with your account team so they can get the Azure Technology Specialist involved in applying the license to the cluster. 
* Ensure your [network topology](azure-netapp-files-network-topologies.md) is supported for Azure NetApp Files. Ensure you have established connectivity from your on-premises storage to Azure NetApp Files. 
* The delegated subnet address space for hosting the Azure NetApp Files volumes must have at least seven free IP addresses: six for cluster peering and one for the migration volumes. The delegated subnet address space should be sized appropriately to accommodate more Azure NetApp Files network interfaces. Review [Guidelines for Azure NetApp Files network planning](azure-netapp-files-network-topologies.md) to ensure you meet the requirements for delegated subnet sizing.  
* After issuing the peering request, the request must be accepted within 60 minutes of making the request. If it's not accepted within 60 minutes, the request expires. 

## Register the feature 

<!-- steps -->

## Migrate volumes

1. Establish network connectivity from the ONTAP or Cloud Volumes ONTAP cluster to Azure NetApp Files. Work with the site reliability engineering team to create Express Route resources. 
    TThe source cluster must have connectivity to the Azure NetApp Files delegated subnet. Connectivity includes: ICMP, TCP 11104, TCP 11105, and HTTPS.
    Network connectivity must be in place for all intercluster logical interfaces (LIFs) on the source cluster.
1. Create a migration API request to create Azure NetApp Files volumes for each on-premises volume you intend to migrate. 
1. 
    >[!IMPORTANT]
    >Ensure the size and other volume properties on the target volumes match with the source.

    The "remote path" values are the host, server, and volume names of your on-premises storage. 

    ```rest
    PUT: https://southcentralus.management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.NetApp/netAppAccounts/<account-name>/capacityPools/<capacity-pool-name>/volumes/Migvolfinal?api-version=2024-05-01
    Body: {
       "type":"Microsoft.NetApp/netAppAccounts/capacityPools/volumes",
       "location":"<LOCATION>",
       "properties":{
          "volumeType":"Migration",
          "dataProtection":{
             "replication":{
                "endpointType":"Dst",
                "replicationSchedule":"Hourly",
                "remotePath":{
                   "externalHostName":"<external-host-name>",
                   "serverName":"<>",
                   "volumeName":"<volume-name>"
                }
             }
          },
          "serviceLevel":"<service-level>",
          "creationToken":"<token>",
          "usageThreshold":<value>,
          "exportPolicy":{
             "rules":[
                {
                   "ruleIndex":1,
                   "unixReadOnly":<true|false>,
                   "unixReadWrite":<true|false>,
                   "cifs":false,
                   "nfsv3":true,
                   "nfsv41":false,
                   "allowedClients":"0.0.0.0/0",
                   "kerberos5ReadOnly":<true|false>,
                   "kerberos5ReadWrite":<true|false>,
                   "kerberos5iReadOnly":<true|false>,
                   "kerberos5iReadWrite":<true|false>,
                   "kerberos5pReadOnly":<true|false>,
                   "kerberos5pReadWrite":<true|false>,
                   "hasRootAccess":<true|false>
                }
             ]
          },
          "protocolTypes":[
             "<protocols>"
          ],
          "subnetId":"/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/virtualNetworks/<virtual-network-name>/subnets/<subnet>",
          "networkFeatures":"Standard",
          "isLargeVolume":"<true|false>"
       }
    }
    ```

1. Issue a cluster peering API request from each of the target Azure NetApp Files migration volumes to the on-premises cluster. Repeat this step for each migration volume. Each call must provide a list of the on-premises cluster intercluster LIFs. The peer IP Addresses must match your on-premises networking.

    ```rest
        POST https://southcentralus.management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.NetApp/netAppAccounts/<account-name>/capacityPools/<capacity-pool-name>/volumes/<volume-names>/peerExternalCluster?api-version=2024-05-01
    
        Body: {
           "PeerAddresses":[
              "<LIF address>",
              "<LIF address>", 
              "<LIF address>",
              "<LIF address>"
           ]
        }
    ```

1. View the result header. Copy the Azure-AsyncOperation ID.
1. In your on-premises system, accept the cluster peer request from Azure NetApp Files by sending a GET request using Azure-AsyncOperation ID.

    ```rest

    POST https://southcentralus.management.azure.com/subscriptions/<subscription-ID>/providers/Microsoft.NetApp/locations/<location>/operationResults/<Azure-AsyncOperation>?api-version=2024-05-01...
    ```
    
    >[!NOTE]
    > This operation can take time. Check on the request status. It's complete when that status reads "Succeeded." If the Azure-AsyncOperation doesn't respond successfully after an hour or it fails with an error, run the peerExternalCluster command again. Ensure the network configuration between your external ONTAP system and your Azure NetApp Files delegated subnet is working before continuing.

    ```json
    {
        "id": "/subscriptions/<subscriptionID>/providers/Microsoft.NetApp/locations/southcentralus/operationResults/62215c87-50a9-455f-b3e3-5162c31def52",
        "name": "<name>",
        "status": "Succeeded",
        "name": "<name>",
        "status": "Succeeded",
        "startTime": "2023-11-02T07:48:53.6563893Z",
        "endTime": "2023-11-02T07:53:25.3253982Z",
        "percentComplete": 100.0,
        "properties": {
            "peerAcceptCommand": "cluster peer create -ipspace <IP-SPACE-NAME> -encryption-protocol-proposed tls-psk -peer-addrs <peer-addresses-list>",
            "passphrase": "<passphrase>"
        }
    }
    ```

1. Once you receive the succeeded status, copy and paste the `peerAcceptCommand` string into the command line for your on-premises volumes followed by the passphrase string. 

    >[!NOTE]
    >If the `peerAcceptCommand` string in the response body is empty, peering is already established. Skip this step for the corresponding migration volume. 

1. Issue an `authorizeExternalReplication` API request for your migration volumes. Repeat this request for each migration volume. 

    ```rest
    POST: https://southcentralus.management.azure.com/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.NetApp/netAppAccounts/<account-name>/capacityPools/<capacity-pool-name>/volumes/<volume-names>/authorizeExternalReplication?api-version=2024-05-01
    ```
1. Accept the storage virtual machine (SVM) peer request from Azure NetApp Files by sending a GET request using the Azure-AsyncOperation ID in step 3. 

    ```rest
    GET https://southcentralus.management.azure.com/subscriptions/<subscription-ID>/providers/Microsoft.NetApp/locations/<location>/operationResults/<>?api-version=2024-05-01&...
    ```

    An example response: 

    ```json
    {
        "id": "/subscriptions/00000000-aaaa-0000-aaaa-0000000000000/providers/Microsoft.NetApp/locations/southcentralus/operationResults/00000000-aaaa-000-aaaa-000000000000"
        "name": "00000000-aaaa-000-aaaa-000000000000",
        "status": "Succeeded",
        "name": "00000000-aaaa-0000-aaaa-0000000000000",
        "status": "Succeeded",
        "startTime": "2023-11-02T07:48:53.6563893Z",
        "endTime": "2023-11-02T07:53:25.3253982Z",
        "percentComplete": 100.0,
        "properties": {
            "svmPeeringCommand": "vserver peer accept -vserver on-prem-svm-name -peer-vserver destination-svm-name",
        }
    }
    ```

1. After receiving the response, copy the CLI command from `svmPeeringCommand` into the ONTAP CLI. 
1. Once baseline transfers have completed, select a time to take the on-premises volumes offline to prevent new data writes. 
1. If there have been changes to the data after the baseline transfer, send a "Perform Replication Transfer" request to capture any incremental data written after the baseline transfer was completed. Repeat this operation for _each_ migration volume. 

    ```rest
        POST https://southcentralus.management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-names>/providers/Microsoft.NetApp/netAppAccounts/<account-name>>/capacityPools/<capacity-pool>/volumes/<volumes>/performReplicationTransfer?api-version=2024-07-01 
    ```

1. Break the replication relationship. You can accomplish this in the Azure portal by navigating to each volume's **Replication** menu then selecting **Break peering**. You can alternately submit an API request: 

    ```rest
    POST https://southcentralus.management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group>/providers/Microsoft.NetApp/netAppAccounts/<NetApp-account>/capacityPools/<capacity-pool-name>>/volumes/<volumes>/breakReplication?api-version=2024-05-01
    ```

1. Finalize the replication by deleting the migration replication. If the deleted replication is the last migration associated with your subscription, the associated cluster peer and intercluster LIFs are deleted. 

    ```rest
    POST https://southcentralus.management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.NetApp/netAppAccounts/<NetApp-account>/capacityPools/<capacity-pool>/volumes/<volume-names>/finalizeExternalReplication?api-version=2024-05-01
    ```
 
## More information 

* [Guidelines for Azure NetApp Files network planning](azure-netapp-files-network-topologies.md)