---
title: Migrate on-premises volumes to Azure NetApp Files 
description: Learn how to peer and migrate on-premises volumes to Azure NetApp Files and establish SnapMirror relationships. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 10/21/2024
ms.author: anfdocs
---
# Migrate on-premises volumes to Azure NetApp Files 

You can peer and migrate on-premises volumes from NetApp's ONTAP software to Azure NetApp Files. The feature is only available in the REST API. 

## Considerations 

* On your on-premises storage cluster, you must be running ONTAP 9.8 or later.
* SnapMirror license entitlement needs to be obtained and applied to the on-premises cluster. Even if you already have the license, Work with your account team so they can get the Azure Technology Specialist involved in getting this license applied to the cluster. 
* Ensure your [network topology](azure-netapp-files-network-topologies.md) is supported for Azure NetApp Files. Ensure you have established connectivity from your on-premises storage to Azure NetApp Files. 
<!--    * You must be using Standard network features to peer and migrate on-premises volumes to Azure NetApp Files. -->
* The delegated subnet address space for hosting the Azure NetApp Files volumes must have at least seven free IP addresses: six for cluster peering and one for the migration volumes. The delegated subnet address space should be sized appropriately to accommodate more Azure NetApp Files network interfaces. Review [Guidelines for Azure NetApp Files network planning](azure-netapp-files-network-topologies.md) to ensure you meet the requirements for delegated subnet sizing.  
* After issuing the peering request, the request must be accepted within 60 minutes of making the request. If it's not accepted within 60 minutes, the request expires. 

## Register the feature 

<!-- steps -->

## Migrate volumes to Azure NetApp Files 


1. Create a migration API request to create Azure NetApp Files volumes each on-premises volume you intend to migrate. 

    ```rest
    PUT: https://southcentralus.management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.NetApp/netAppAccounts/<account-name>/capacityPools/<capacity-pool-name>/volumes/<volume-names>?api-version=2024-05-01
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

1. If you've already paired your on-premises cluster to Azure NetApp Files, skip to the next step. Otherwise, issue a cluster peering API request from each of the target Azure NetApp Files migration volumes to the on-premises cluster. Each call must provide a list of the on-premises cluster intercluster logical interfaces (LIFs).

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

    POST https://southcentralus.management.azure.com/subscriptions/<subscription-ID>/providers/Microsoft.NetApp/locations/<location>/operationResults/<Azure-AsyncOperation>?api-version=2024-05-01
    ```
    
    >[!NOTE]
    > This operation can take time. Check on the request status. It is complete when that status is "Succeeded."

    ```rest
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

1. Once you receive the succeeded status, copy and paste the `peerAcceptCommand` string into the ONTAP CLI followed by the passphrase string. 

    >[!NOTE]
    >If the `peerAcceptCommand` string is empty in the response body, peering is already established. Skip this step for the corresponding migration volume. 

1. Issue an `authorizeExternalReplication` API request for your migration volumes. This step must be repeated for each migration volume. 

    ```rest
    POST: https://southcentralus.management.azure.com/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.NetApp/netAppAccounts/<account-name>/capacityPools/<capacity-pool-name>/volumes/<volume-names>/authorizeExternalReplication?api-version=2024-05-01
    ```
1. Accept the storage virtual machine (SVM) peer request from A
 The customer needs to accept the SVM Peer Request from ANF to their On-Prem system, by running the accept command on their ONTAP. To get the ONTAP command to accept the SVM peer request they need to GET the Operations Result.

This is done by using the Azure-AsyncOperation ID copied from step 1.3 in a GET request (see example below). Since this is a long-running operation the customer needs to poll the request a few times until the status is "Succeeded".
    ```rest
    GET : https://southcentralus.management.azure.com/subscriptions/<subscription>/providers/Microsoft.NetApp/locations/<location>/operationResults/<result>?api-version=2024-05-01
    ```
    


1. Navigate to your Azure NetApp Files account. 
1. Select **Migrate ONTAP volumes**. 
1. 
1. To view the status of your migration or peer clusters, navigate to the **Migration Assistant** sidebar item. You can view the replication state, schedule, and transfer status, among other details, of peered volumes. 

## Next steps 

* [Guidelines for Azure NetApp Files network planning](azure-netapp-files-network-topologies.md)