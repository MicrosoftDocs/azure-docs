---
title: Create Azure HDInsight clusters with Entra ID Authentication
description: Learn how to create Azure HDInsight clusters with Entra ID Authentication
ms.service: azure-hdinsight
ms.topic: how-to
author: apurbasroy
ms.author: apsinhar
ms.reviewer: nijelsf
ms.date: 09/24/2025
---

# Create and Manage Azure HDInsight cluster with Entra ID authentication

This article provides comprehensive information on creating and managing Azure HDInsight clusters with Microsoft Entra ID authentication. By integrating with Entra ID,
users can securely authenticate and manage access to HDInsight clusters, ensuring enterprise-grade security and centralized identity governance.

With this capability, organizations can enforce role-based access, streamline user onboarding and offboarding, and enhance compliance by leveraging existing Entra ID 
policies. 
It simplifies cluster security management while providing a seamless login experience for data engineers, analysts, and administrators.

## Prerequisites

Before you begin, ensure the following requirements are met:

 - Azure Subscription

    - An active Azure subscription with sufficient permissions to create HDInsight clusters.

 - Microsoft Entra ID Tenant

    - Access to an Entra ID tenant linked to your Azure subscription.

    - Permissions to create and assign Entra ID groups and roles.

 - Resource Group

    - A resource group in Azure where the HDInsight cluster will be deployed.

 - HDInsight Cluster Requirements

    - HDInsight cluster type (e.g., Hadoop, Spark, HBase, or Kafka) selected for deployment.

    - Correct region chosen that supports Entra ID integration.

## Overview 

When creating an HDInsight cluster, users have to do the following for setting up Entra ID authentication: 

  - Select the desired authentication method: Entra ID 

  - Add one (or more) admin Entra ID user during cluster creation(adding atleast one admin is mandatory).

    :::image type="content" source="/media/create-hdinsight-clusters-with-entra-auth/creation-clusters.png" alt-text="Screenshot of hdinsight cluster creation landing page.":::

    **ss2**

## User Profiles in Ambari 

Entra ID enabled users will be assigned one of two profiles: 

  - Cluster Admin: Admin permission. 

  - Cluster User: View only permission.


    >[!Note]
    
    >During cluster creation if the admin chooses Entra ID for authentication, then all the users in the cluster must be authenticated using Entra ID.

     >If the admin chooses basic authentication during  cluster creation then all the users in the cluster must be authenticated using basic authentication.

    >During cluster creation if the user selects Entra ID authentication, during the entire lifecycle of the particular cluster authentication can be only done using Entra ID.
    
    >If the admin chooses basic authentication, during the entire lifecycle of the particular cluster authentication can be only done using Basic Authentication.
    
    > **User can use only one mode on authentication for a particular cluster.**


  **ss3**

## Login Options 

Users can log in via Multi-Factor Authentication (MFA) once they input their Entra ID. 

## Adding users with API

Admin can add multiple users at once via an API, ideal for managing large clusters. 

 This operation allows users to change the cluster gateway HTTP credentials.   


 | **Method** | **Request URI** |
 |------------|-----------------|
 | POST | `https://management.azure.com/subscriptions/{subscription Id}/resourceGroups/{resourceGroup Name}/providers/Microsoft.HDInsight/clusters/{cluster name}/updateGatewaySettings?api-version={api-version}` |
 | Entra Cluster API Version| greater than or equal to `2025-01-15-preview`|


 **JSON**
```
  				{ 
				"restAuthEntraUsers": [ 
					{ 
						"objectId": "0d7c4bd6-d042-45ec-9ae5-1ed7871c38e0", 
						"displayName": "Hemant Gupta", 
						"upn": "hemant@microsoft.com" 
					} 
				] 
			} 
```

**Response**
HTTP 202 (Accepted) on successful completion of the operation. 

## Authentication Process 
The authentication process varies based on the chosen method during cluster creation: 

If Entra ID is selected: 

 - The cluster creator provides an ID for the default cluster admin user in Ambari. 

 - The default admin can add more Ambari users as needed, with either 'Cluster Admin' or 'Cluster User' permissions after cluster creation via Ambari UI or  REST API.

   **ss4**

 - A multi-factor authentication prompt will appear when the user logs in with their Entra ID.

**Basic Authentication**

User will also be able to use the legacy basic authentication way of authenticating users as well 

If Basic Authentication is selected: 

 - User provides a User ID and password for the default admin user. 

 - New users can be created with various roles, similar to current functionality. 

 - Users will be prompted to enter their User ID and password upon login.

   ## Steps to add object ID in Ambari UI

   1. Login to the Ambari portal
  
   1. Navigate to "Manage Ambari" option
   
   1. Add user
  
      
   1. Add Object ID, add the display name and select the user access (Cluster Admin or Cluster User) and click on "Save"

## Next Steps
