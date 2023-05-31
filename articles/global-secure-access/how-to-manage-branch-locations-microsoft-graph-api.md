---
title: How to manage branch office locations using the Microsoft Graph API
description: Learn manage Global Secure Access branch office locations using the Microsoft Graph API.
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: how-to
ms.date: 05/31/2023
ms.service: network-access
ms.custom: 
---

# How to manage branch location details using the Microsoft Graph API

You can manage many of the details of your branch locations through the Microsoft Graph API on the `beta` endpoint.

## Create a branch location

1. Sign in to Microsoft Graph Explorer. 
1. Select POST as the HTTP method. 
1. Select BETA as the API version. 
1. Add the following query to use Create Branches API (add hyperlink to the Graph API) 
    ```
    POST https://graph.microsoft.com/beta/networkaccess/branches 
    { 
        "name": "ContosoBranch", 
        "country": "United States ", //must be removed 
        "region": "East US", 
        "bandwidthCapacity": 1000, //must be removed. This goes under deviceLink. 
        "deviceLinks": [ 
        { 
            "name": "CPE Link 1", 
            "ipAddress": "20.125.118.219", 
            "version": "1.0.0", 
            "deviceVendor": "Other", 
            "bgpConfiguration": { 
                "ipAddress": "172.16.11.5", 
                "asn": 8888 
              }, 
              "tunnelConfiguration": { 
                  "@odata.type": "#microsoft.graph.networkaccess.tunnelConfigurationIKEv2Default", 
                  "preSharedKey": "Detective5OutgrowDiligence" 
              } 
        }] 
    }  
    ```
1. Select **Run query** to create a branch.

## Assign a traffic profile to a branch location

Traffic profiles, also known as forwarding profiles, determine what traffic is routed to the Microsoft network. Associating a traffic profile to your branch location is two step process. First, get the ID of the traffic profile. The ID is important because it's different for all tenants. Second, associate the traffic profile with your desired branch location.

To update a branch using the Microsoft Graph API in Graph Explorer. 
1. Open a web browser and navigate to the Graph Explorer at https://aka.ms/ge.
1. Select **PATCH** as the HTTP method from the dropdown. 
1. Select the API version to **beta**. 
1. Enter the query:
    ```
    GET https://graph.microsoft.com/beta/networkaccess/forwardingprofiles 
    ```
1. Select **Run query**. 
1. Find the ID of the desired traffic forwarding profile. 
1. Select PATCH as the HTTP method from the dropdown. 
1. Enter the query:
    ```
        PATCH https://graph.microsoft.com/beta/networkaccess/branches/d2b05c5-1e2e-4f1d-ba5a-1a678382ef16/forwardingProfiles
        {
            "@odata.context": "#$delta",
            "value":
            [{
                "ID": "1adaf535-1e31-4e14-983f-2270408162bf"
            }]
        }
    ```
1. Select **Run query** to update the branch. 


## Edit a top-level branch setting
<!--- what IS a "top-level branch setting"? --->
To edit the name, location, or region of a branch location:

1. Open a web browser and navigate to the Graph Explorer at https://aka.ms/ge.
1. Select **PATCH** as the HTTP method from the dropdown. 
1. Select the API version to **beta**. 
1. Enter the query:
    ```
    PATCH https://graph.microsoft.com/beta/networkaccess/branches/8d2b05c5-1e2e-4f1d-ba5a-1a678382ef16
    {
        "@odata.context": "#$delta",
        "name": "ContosoBranch2"
    }
    ``` 
1. Select **Run query** to update the branch. 

## Delete a branch using the API
1. Open a web browser and navigate to the Graph Explorer at https://aka.ms/ge.
1. Select **PATCH** as the HTTP method from the dropdown. 
1. Select the API version to **beta**. 
1. Enter the query:
    ```
    DELETE https://graph.microsoft.com/beta/networkaccess/branches/97e2a6ea-c6c4-4bbe-83ca-add9b18b1c6b 
    ```
1. Select **Run query** to delete the branch. 

## Next steps

- [Manage branch locations in the Microsoft Entra admin center](how-to-manage-branch-locations.md)